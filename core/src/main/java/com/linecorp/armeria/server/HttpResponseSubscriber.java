/*
 * Copyright 2016 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

package com.linecorp.armeria.server;

import static com.google.common.base.MoreObjects.firstNonNull;
import static com.linecorp.armeria.internal.common.HttpHeadersUtil.mergeResponseHeaders;
import static com.linecorp.armeria.internal.common.HttpHeadersUtil.mergeTrailers;

import java.nio.channels.ClosedChannelException;
import java.util.concurrent.CompletableFuture;

import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.linecorp.armeria.common.AggregatedHttpResponse;
import com.linecorp.armeria.common.CancellationException;
import com.linecorp.armeria.common.HttpData;
import com.linecorp.armeria.common.HttpHeaderNames;
import com.linecorp.armeria.common.HttpHeaders;
import com.linecorp.armeria.common.HttpMethod;
import com.linecorp.armeria.common.HttpObject;
import com.linecorp.armeria.common.HttpStatus;
import com.linecorp.armeria.common.ResponseHeaders;
import com.linecorp.armeria.common.annotation.Nullable;
import com.linecorp.armeria.common.stream.CancelledSubscriptionException;
import com.linecorp.armeria.common.util.Exceptions;
import com.linecorp.armeria.common.util.SafeCloseable;
import com.linecorp.armeria.internal.common.Http1ObjectEncoder;
import com.linecorp.armeria.internal.common.RequestContextUtil;
import com.linecorp.armeria.unsafe.PooledObjects;

import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http2.Http2Error;

final class HttpResponseSubscriber extends AbstractHttpResponseHandler implements Subscriber<HttpObject> {

    private static final Logger logger = LoggerFactory.getLogger(HttpResponseSubscriber.class);

    enum State {
        NEEDS_HEADERS,
        NEEDS_DATA_OR_TRAILERS,
        NEEDS_TRAILERS,
        DONE,
    }

    @Nullable
    private Subscription subscription;
    private State state = State.NEEDS_HEADERS;

    private boolean isSubscriptionCompleted;

    private boolean loggedResponseHeadersFirstBytesTransferred;

    @Nullable
    private WriteHeadersFutureListener cachedWriteHeadersListener;

    @Nullable
    private WriteDataFutureListener cachedWriteDataListener;

    HttpResponseSubscriber(ChannelHandlerContext ctx, ServerHttpObjectEncoder responseEncoder,
                           DefaultServiceRequestContext reqCtx, DecodedHttpRequest req,
                           CompletableFuture<Void> completionFuture) {
        super(ctx, responseEncoder, reqCtx, req, completionFuture);
    }

    @Override
    public void onSubscribe(Subscription subscription) {
        assert this.subscription == null;
        this.subscription = subscription;
        if (state == State.DONE) {
            if (!isSubscriptionCompleted) {
                isSubscriptionCompleted = true;
                subscription.cancel();
            }
            return;
        }

        scheduleTimeout();

        // Start consuming.
        subscription.request(1);
    }

    @SuppressWarnings("checkstyle:FallThrough")
    @Override
    public void onNext(HttpObject o) {
        if (!(o instanceof HttpData) && !(o instanceof HttpHeaders)) {
            req.abortResponse(new IllegalArgumentException(
                    "published an HttpObject that's neither HttpHeaders nor HttpData: " + o +
                    " (service: " + service() + ')'), true);
            return;
        }

        if (failIfStreamOrSessionClosed()) {
            PooledObjects.close(o);
            return;
        }

        boolean endOfStream = o.isEndOfStream();
        switch (state) {
            case NEEDS_HEADERS: {
                logBuilder().startResponse();
                if (!(o instanceof ResponseHeaders)) {
                    req.abortResponse(new IllegalStateException(
                            "published an HttpData without a preceding ResponseHeaders: " + o +
                            " (service: " + service() + ')'), true);
                    return;
                }

                final ResponseHeaders headers = (ResponseHeaders) o;
                final HttpStatus status = headers.status();
                final ResponseHeaders merged;
                if (status.isInformational()) {
                    if (endOfStream) {
                        req.abortResponse(new IllegalStateException(
                                "published an informational headers whose endOfStream is true: " + o +
                                " (service: " + service() + ')'), true);
                        return;
                    }
                    merged = headers;
                } else {
                    if (responseEncoder.isResponseHeadersSent(req.id(), req.streamId())) {
                        // The response is sent by the HttpRequestDecoder so we just cancel the stream message.
                        tryComplete(new CancelledSubscriptionException(
                                "An HTTP response was sent already. ctx: " + reqCtx));
                        setDone(true);
                        return;
                    }

                    if (req.method() == HttpMethod.HEAD) {
                        endOfStream = true;
                    } else if (status.isContentAlwaysEmpty()) {
                        state = State.NEEDS_TRAILERS;
                    } else {
                        state = State.NEEDS_DATA_OR_TRAILERS;
                    }
                    if (endOfStream) {
                        setDone(false);
                    }
                    merged = mergeResponseHeaders(headers, reqCtx.additionalResponseHeaders());
                    logBuilder().responseHeaders(merged);
                }

                responseEncoder.writeHeaders(req.id(), req.streamId(), merged, endOfStream,
                                             reqCtx.additionalResponseTrailers().isEmpty())
                               .addListener(writeHeadersFutureListener(endOfStream));
                break;
            }
            case NEEDS_TRAILERS: {
                if (o instanceof ResponseHeaders) {
                    req.abortResponse(new IllegalStateException(
                            "published a ResponseHeaders: " + o +
                            " (expected: an HTTP trailers). service: " + service()), true);
                    return;
                }
                if (o instanceof HttpData) {
                    // We silently ignore the data and call subscription.request(1).
                    ((HttpData) o).close();
                    assert subscription != null;
                    subscription.request(1);
                    return;
                }
                // We handle the trailers in NEEDS_DATA_OR_TRAILERS.
            }
            case NEEDS_DATA_OR_TRAILERS: {
                if (o instanceof HttpHeaders) {
                    final HttpHeaders trailers = (HttpHeaders) o;
                    if (trailers.contains(HttpHeaderNames.STATUS)) {
                        req.abortResponse(new IllegalArgumentException(
                                "published an HTTP trailers with status: " + o +
                                " (service: " + service() + ')'), true);
                        return;
                    }
                    setDone(false);

                    final HttpHeaders merged = mergeTrailers(trailers, reqCtx.additionalResponseTrailers());
                    logBuilder().responseTrailers(merged);
                    responseEncoder.writeTrailers(req.id(), req.streamId(), merged)
                                   .addListener(writeHeadersFutureListener(true));
                } else {
                    final HttpData data = (HttpData) o;
                    final boolean wroteEmptyData = data.isEmpty();
                    logBuilder().increaseResponseLength(data);
                    if (endOfStream) {
                        setDone(false);
                    }

                    final HttpHeaders additionalTrailers = reqCtx.additionalResponseTrailers();
                    if (endOfStream && !additionalTrailers.isEmpty()) { // Last DATA frame
                        responseEncoder.writeData(req.id(), req.streamId(), data, false)
                                       .addListener(writeDataFutureListener(false, wroteEmptyData));
                        logBuilder().responseTrailers(additionalTrailers);
                        responseEncoder.writeTrailers(req.id(), req.streamId(), additionalTrailers)
                                       .addListener(writeHeadersFutureListener(true));
                    } else {
                        responseEncoder.writeData(req.id(), req.streamId(), data, endOfStream)
                                       .addListener(writeDataFutureListener(endOfStream, wroteEmptyData));
                    }
                }
                break;
            }
            case DONE:
                isSubscriptionCompleted = true;
                subscription.cancel();
                PooledObjects.close(o);
                return;
        }

        ctx.flush();
    }

    @Override
    boolean isDone() {
        return state == State.DONE;
    }

    private State setDone(boolean cancel) {
        if (cancel && subscription != null && !isSubscriptionCompleted) {
            isSubscriptionCompleted = true;
            subscription.cancel();
        }
        clearTimeout();
        final State oldState = state;
        state = State.DONE;
        return oldState;
    }

    @Override
    public void onError(Throwable cause) {
        isSubscriptionCompleted = true;
        if (!isWritable()) {
            // A session or stream is currently being closing or is closed already.
            fail(cause);
            return;
        }

        if (cause instanceof HttpResponseException) {
            // Timeout may occur when the aggregation of the error response takes long.
            // If timeout occurs, the response is sent by newCancellationTask().
            toAggregatedHttpResponse((HttpResponseException) cause).handleAsync((res, throwable) -> {
                if (throwable != null) {
                    failAndRespond(throwable,
                                   internalServerErrorResponse,
                                   Http2Error.CANCEL, false);
                } else {
                    failAndRespond(cause, res, Http2Error.CANCEL, false);
                }
                return null;
            }, ctx.executor());
        } else if (cause instanceof HttpStatusException) {
            final Throwable cause0 = firstNonNull(cause.getCause(), cause);
            final AggregatedHttpResponse res = toAggregatedHttpResponse((HttpStatusException) cause);
            failAndRespond(cause0, res, Http2Error.CANCEL, false);
        } else if (Exceptions.isStreamCancelling(cause)) {
            failAndReset(cause);
        } else {
            if (!(cause instanceof CancellationException)) {
                logger.warn("{} Unexpected exception from a service or a response publisher: {}",
                            ctx.channel(), service(), cause);
            } else {
                // Ignore CancellationException and its subtypes, which can be triggered when the request
                // was cancelled or timed out even before the subscription attempt is made.
            }

            failAndRespond(cause, internalServerErrorResponse, Http2Error.INTERNAL_ERROR, false);
        }
    }

    @Override
    public void onComplete() {
        isSubscriptionCompleted = true;

        final State oldState = setDone(false);
        if (oldState == State.NEEDS_HEADERS) {
            logger.warn("{} Published nothing (or only informational responses): {}", ctx.channel(), service());
            responseEncoder.writeReset(req.id(), req.streamId(), Http2Error.INTERNAL_ERROR)
                           .addListener(future -> tryComplete(null));
            ctx.flush();
            return;
        }

        if (oldState != State.DONE) {
            final HttpHeaders additionalTrailers = reqCtx.additionalResponseTrailers();
            if (!additionalTrailers.isEmpty()) {
                logBuilder().responseTrailers(additionalTrailers);
                responseEncoder.writeTrailers(req.id(), req.streamId(), additionalTrailers)
                               .addListener(writeHeadersFutureListener(true));
                ctx.flush();
            } else if (responseEncoder.isWritable(req.id(), req.streamId())) {
                responseEncoder.writeData(req.id(), req.streamId(), HttpData.empty(), true)
                               .addListener(writeDataFutureListener(true, true));
                ctx.flush();
            }
        }
    }

    @Override
    void fail(Throwable cause) {
        if (tryComplete(cause)) {
            setDone(true);
            endLogRequestAndResponse(cause);
            maybeWriteAccessLog();
        }
    }

    private void failAndRespond(Throwable cause, AggregatedHttpResponse res, Http2Error error, boolean cancel) {
        final State oldState = setDone(cancel);
        final int id = req.id();
        final int streamId = req.streamId();

        final ChannelFuture future;
        final boolean isReset;
        if (oldState == State.NEEDS_HEADERS) { // ResponseHeaders is not sent yet, so we can send the response.
            future = writeAggregatedHttpResponse(res);
            isReset = false;
        } else {
            // Wrote something already; we have to reset/cancel the stream.
            future = responseEncoder.writeReset(id, streamId, error);
            isReset = true;
        }

        addCallbackAndFlush(cause, oldState, future, isReset);
    }

    private void failAndReset(Throwable cause) {
        final State oldState = setDone(false);
        final ChannelFuture future =
                responseEncoder.writeReset(req.id(), req.streamId(), Http2Error.CANCEL);

        addCallbackAndFlush(cause, oldState, future, true);
    }

    private void addCallbackAndFlush(Throwable cause, State oldState, ChannelFuture future, boolean isReset) {
        if (oldState != State.DONE) {
            future.addListener(f -> {
                try (SafeCloseable ignored = RequestContextUtil.pop()) {
                    if (f.isSuccess() && !isReset) {
                        maybeLogFirstResponseBytesTransferred();
                    }
                    // Write an access log always with a cause. Respect the first specified cause.
                    if (tryComplete(cause)) {
                        endLogRequestAndResponse(cause);
                        maybeWriteAccessLog();
                    }
                }
            });
        }
        ctx.flush();
    }

    private WriteHeadersFutureListener writeHeadersFutureListener(boolean endOfStream) {
        if (!endOfStream) {
            // Reuse in case sending multiple informational headers.
            if (cachedWriteHeadersListener == null) {
                cachedWriteHeadersListener = new WriteHeadersFutureListener(false);
            }
            return cachedWriteHeadersListener;
        }
        return new WriteHeadersFutureListener(true);
    }

    private WriteDataFutureListener writeDataFutureListener(boolean endOfStream, boolean wroteEmptyData) {
        if (!endOfStream && !wroteEmptyData) {
            // Reuse in case sending streaming data.
            if (cachedWriteDataListener == null) {
                cachedWriteDataListener = new WriteDataFutureListener(false, false);
            }
            return cachedWriteDataListener;
        }
        return new WriteDataFutureListener(endOfStream, wroteEmptyData);
    }

    private class WriteHeadersFutureListener implements ChannelFutureListener {
        private final boolean endOfStream;

        WriteHeadersFutureListener(boolean endOfStream) {
            this.endOfStream = endOfStream;
        }

        @Override
        public void operationComplete(ChannelFuture future) throws Exception {
            try (SafeCloseable ignored = RequestContextUtil.pop()) {
                handleWriteComplete(future, endOfStream, future.isSuccess());
            }
        }
    }

    private class WriteDataFutureListener implements ChannelFutureListener {
        private final boolean endOfStream;
        private final boolean wroteEmptyData;

        WriteDataFutureListener(boolean endOfStream, boolean wroteEmptyData) {
            this.endOfStream = endOfStream;
            this.wroteEmptyData = wroteEmptyData;
        }

        @Override
        public void operationComplete(ChannelFuture future) throws Exception {
            try (SafeCloseable ignored = RequestContextUtil.pop()) {
                final boolean isSuccess;
                if (future.isSuccess()) {
                    isSuccess = true;
                } else {
                    // If 1) the last chunk we attempted to send was empty,
                    //    2) the connection has been closed,
                    //    3) and the protocol is HTTP/1,
                    // it is very likely that a client closed the connection after receiving the
                    // complete content, which is not really a problem.
                    isSuccess = endOfStream && wroteEmptyData &&
                                future.cause() instanceof ClosedChannelException &&
                                responseEncoder instanceof Http1ObjectEncoder;
                }
                handleWriteComplete(future, endOfStream, isSuccess);
            }
        }
    }

    void handleWriteComplete(ChannelFuture future, boolean endOfStream, boolean isSuccess) throws Exception {
        // Write an access log if:
        // - every message has been sent successfully.
        // - any write operation is failed with a cause.
        if (isSuccess) {
            maybeLogFirstResponseBytesTransferred();

            if (endOfStream) {
                if (tryComplete(null)) {
                    final Throwable capturedException = CapturedServiceException.get(reqCtx);
                    if (capturedException != null) {
                        endLogRequestAndResponse(capturedException);
                    } else {
                        endLogRequestAndResponse();
                    }
                    maybeWriteAccessLog();
                }
            }

            if (!isSubscriptionCompleted) {
                assert subscription != null;
                // Even though an 'endOfStream' is received, we still need to send a request signal to the
                // upstream for completing or canceling this 'HttpResponseSubscriber'
                subscription.request(1);
            }
            return;
        }

        fail(future.cause());
        // We do not send RST but close the channel because there's high chances that the channel
        // is not reusable if an exception was raised while writing to the channel.
        HttpServerHandler.CLOSE_ON_FAILURE.operationComplete(future);
    }

    private void maybeLogFirstResponseBytesTransferred() {
        if (!loggedResponseHeadersFirstBytesTransferred) {
            loggedResponseHeadersFirstBytesTransferred = true;
            logBuilder().responseFirstBytesTransferred();
        }
    }
}
