"use strict";(self.webpackChunkarmeria_site=self.webpackChunkarmeria_site||[]).push([[1594],{38877:function(e,a,t){t.r(a),t.d(a,{pageTitle:function(){return s},_frontmatter:function(){return c},default:function(){return h}});var r,n=t(63366),i=(t(67294),t(64983)),l=t(89791),o=["components"],s="Test running a service",c={},p=(r="TutorialSteps",function(e){return console.warn("Component "+r+" was not imported, exported, or provided by MDXProvider as global scope"),(0,i.kt)("div",e)}),m={pageTitle:s,_frontmatter:c},v=l.Z;function h(e){var a=e.components,t=(0,n.Z)(e,o);return(0,i.kt)(v,Object.assign({},m,t,{components:a,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"test-running-a-service",style:{position:"relative"}},(0,i.kt)("a",{parentName:"h1",href:"#test-running-a-service","aria-label":"test running a service permalink",className:"anchor before"},(0,i.kt)("svg",{parentName:"a","aria-hidden":"true",focusable:"false",height:"16",version:"1.1",viewBox:"0 0 16 16",width:"16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"}))),"Test running a service"),(0,i.kt)("h6",{className:"inlinePageToc",role:"navigation"},"Table of contents"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#what-you-need"},"What you need")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#1-declare-an-empty-service"},"1. Declare an empty service")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#2-add-a-service-to-a-server"},"2. Add a service to a server")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#3-serve-the-service"},"3. Serve the service")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#4-write-a-client"},"4. Write a client")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#5-test-run"},"5. Test run")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#whats-next"},"What's next"))),(0,i.kt)("p",null,"In this step, we'll do three things with the code we obtained from our proto file; we'll create a server instance, add an empty gRPC service, and then lastly create a minimal client."),(0,i.kt)(p,{current:2,mdxType:"TutorialSteps"}),(0,i.kt)("h2",{id:"what-you-need",style:{position:"relative"}},(0,i.kt)("a",{parentName:"h2",href:"#what-you-need","aria-label":"what you need permalink",className:"anchor before"},(0,i.kt)("svg",{parentName:"a","aria-hidden":"true",focusable:"false",height:"16",version:"1.1",viewBox:"0 0 16 16",width:"16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"}))),"What you need"),(0,i.kt)("p",null,"You need to have the ",(0,i.kt)("a",{parentName:"p",href:"/tutorials/grpc/blog/define-service#compile-proto-file"},"Java code generated")," from the service and messages defined in the ",(0,i.kt)("a",{parentName:"p",href:"/tutorials/grpc/blog/define-service"},"proto file"),"."),(0,i.kt)("h2",{id:"1-declare-an-empty-service",style:{position:"relative"}},(0,i.kt)("a",{parentName:"h2",href:"#1-declare-an-empty-service","aria-label":"1 declare an empty service permalink",className:"anchor before"},(0,i.kt)("svg",{parentName:"a","aria-hidden":"true",focusable:"false",height:"16",version:"1.1",viewBox:"0 0 16 16",width:"16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"}))),"1. Declare an empty service"),(0,i.kt)("p",null,"Create a file ",(0,i.kt)("inlineCode",{parentName:"p"},"BlogService.java")," and declare an empty blog service. We'll implement the service methods later on in this file. For now, leave it empty."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java",metastring:"filename=BlogService.java",filename:"BlogService.java"},"package example.armeria.blog.grpc;\n\nfinal class BlogService extends BlogServiceGrpc.BlogServiceImplBase {}\n")),(0,i.kt)("h2",{id:"2-add-a-service-to-a-server",style:{position:"relative"}},(0,i.kt)("a",{parentName:"h2",href:"#2-add-a-service-to-a-server","aria-label":"2 add a service to a server permalink",className:"anchor before"},(0,i.kt)("svg",{parentName:"a","aria-hidden":"true",focusable:"false",height:"16",version:"1.1",viewBox:"0 0 16 16",width:"16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"}))),"2. Add a service to a server"),(0,i.kt)("p",null,"Build a service and server using Armeria's ",(0,i.kt)("a",{parentName:"p",href:"type://ServerBuilder:https://javadoc.io/doc/com.linecorp.armeria/armeria-javadoc/latest/com/linecorp/armeria/server/ServerBuilder.html"},"type://ServerBuilder")," to serve our service."),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"Create a main class for our server. You can see the full version of the file ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/line/armeria-examples/blob/master/tutorials/grpc/src/main/java/example/armeria/server/blog/grpc/BlogService.java"},"here"),"."),(0,i.kt)("pre",{parentName:"li"},(0,i.kt)("code",{parentName:"pre",className:"language-java",metastring:"filename=Main.java",filename:"Main.java"},"package example.armeria.blog.grpc;\n\nimport org.slf4j.Logger;\nimport org.slf4j.LoggerFactory;\n\npublic final class Main {\n  private static final Logger logger = LoggerFactory.getLogger(Main.class);\n}\n"))),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"Create a service instance using Armeria's ",(0,i.kt)("a",{parentName:"p",href:"type://GrpcService#builder():https://javadoc.io/doc/com.linecorp.armeria/armeria-javadoc/latest/com/linecorp/armeria/server/grpc/GrpcService.html#builder()"},"type://GrpcService#builder()"),"."),(0,i.kt)("pre",{parentName:"li"},(0,i.kt)("code",{parentName:"pre",className:"language-java",metastring:"filename=Main.java",filename:"Main.java"},"import com.linecorp.armeria.server.grpc.GrpcService;\n\npublic final class Main {\n  static Server newServer(int port) throws Exception {\n    final GrpcService grpcService = \n      GrpcService.builder()\n                 .addService(new BlogService())\n                 .build();\n  }\n}\n"))),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"Build and return a new server instance using Armeria's ",(0,i.kt)("a",{parentName:"p",href:"type://ServerBuilder:https://javadoc.io/doc/com.linecorp.armeria/armeria-javadoc/latest/com/linecorp/armeria/server/ServerBuilder.html"},"type://ServerBuilder"),"."),(0,i.kt)("pre",{parentName:"li"},(0,i.kt)("code",{parentName:"pre",className:"language-java",metastring:"filename=Main.java",filename:"Main.java"},"  public final class Main {\n    static Server newServer(int port) throws Exception {\n      ...\n      return Server.builder()\n                   .http(port)\n                   .service(grpcService)\n                   .build();\n\n    }\n")))),(0,i.kt)("h2",{id:"3-serve-the-service",style:{position:"relative"}},(0,i.kt)("a",{parentName:"h2",href:"#3-serve-the-service","aria-label":"3 serve the service permalink",className:"anchor before"},(0,i.kt)("svg",{parentName:"a","aria-hidden":"true",focusable:"false",height:"16",version:"1.1",viewBox:"0 0 16 16",width:"16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"}))),"3. Serve the service"),(0,i.kt)("p",null,"Create a server instance and run the blog service."),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"Create a server instance in the ",(0,i.kt)("inlineCode",{parentName:"p"},"main()")," method."),(0,i.kt)("pre",{parentName:"li"},(0,i.kt)("code",{parentName:"pre",className:"language-java",metastring:"filename=Main.java",filename:"Main.java"},'public static void main(String[] args) throws Exception {\n    final Server server = newServer(8080);\n\n    server.closeOnJvmShutdown().thenRun(() -> {\n        logger.info("Server has been stopped.");\n    });\n\n    server.start().join();\n}\n'))),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"Start the server by running the ",(0,i.kt)("inlineCode",{parentName:"p"},"Main.main()")," method on your IDE or using Gradle."),(0,i.kt)("pre",{parentName:"li"},(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"./gradlew run\n"))),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"Open up ",(0,i.kt)("a",{parentName:"p",href:"http://127.0.0.1:8080"},"http://127.0.0.1:8080")," on a web browser. Since our blog service is empty, you'll see the 404 \"Not Found\" message in the browser. At least we've checked that we got our service to run on a server."))),(0,i.kt)("h2",{id:"4-write-a-client",style:{position:"relative"}},(0,i.kt)("a",{parentName:"h2",href:"#4-write-a-client","aria-label":"4 write a client permalink",className:"anchor before"},(0,i.kt)("svg",{parentName:"a","aria-hidden":"true",focusable:"false",height:"16",version:"1.1",viewBox:"0 0 16 16",width:"16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"}))),"4. Write a client"),(0,i.kt)("p",null,"We've only tested running the service on a server. This time, let's try calling the service. To test, we'll write a simple client using Armeria's ",(0,i.kt)("a",{parentName:"p",href:"type://GrpcClients#newClient(String,Class):https://javadoc.io/doc/com.linecorp.armeria/armeria-javadoc/latest/com/linecorp/armeria/client/grpc/GrpcClients.html#newClient(java.lang.String,java.lang.Class)"},"type://GrpcClients#newClient(String,Class)")," and the Java code generated from ",(0,i.kt)("a",{parentName:"p",href:"/tutorials/grpc/blog/define-service"},"Defining a service"),"."),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"Create another main class for the client. We'll name the file ",(0,i.kt)("inlineCode",{parentName:"p"},"BlogClient.java"),"."),(0,i.kt)("pre",{parentName:"li"},(0,i.kt)("code",{parentName:"pre",className:"language-java",metastring:"filename=BlogClient.java",filename:"BlogClient.java"},"package example.armeria.client.blog.grpc;\n\nfinal class BlogClient {\n  public static void main(String[] args) throws Exception {}\n}\n"))),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"Create a client using Armeria's ",(0,i.kt)("a",{parentName:"p",href:"type://GrpcClients:https://javadoc.io/doc/com.linecorp.armeria/armeria-javadoc/latest/com/linecorp/armeria/client/grpc/GrpcClients.html"},"type://GrpcClients"),". We're running the server locally and have set the port to 8080 in our server code. Let's access the server at ",(0,i.kt)("a",{parentName:"p",href:"http://127.0.0.1:8080"},"http://127.0.0.1:8080"),"."),(0,i.kt)("pre",{parentName:"li"},(0,i.kt)("code",{parentName:"pre",className:"language-java",metastring:"filename=BlogClient.java",filename:"BlogClient.java"},'import com.linecorp.armeria.client.grpc.GrpcClients;\nimport example.armeria.blog.grpc.BlogServiceGrpc.BlogServiceBlockingStub;\n\nclass BlogClient {\n  static BlogServiceBlockingStub client;\n\n  public static void main(String[] args) throws Exception {\n    client = GrpcClients.newClient("http://127.0.0.1:8080/",\n                                   BlogServiceBlockingStub.class);\n}\n'))),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"Although we haven't implemented any service methods, we'll call one just to check whether our client can communicate with the server."),(0,i.kt)("pre",{parentName:"li"},(0,i.kt)("code",{parentName:"pre",className:"language-java",metastring:"filename=BlogClient.java",filename:"BlogClient.java"},'import example.armeria.blog.grpc.Blog.BlogPost;\nimport example.armeria.blog.grpc.Blog.CreateBlogPostRequest;\n\npublic static void main(String[] args) throws Exception {\n  ...\n  CreateBlogPostRequest request = CreateBlogPostRequest.newBuilder()\n                                                       .setTitle("My first blog")\n                                                       .setContent("Yay")\n                                                       .build();\n  BlogPost response = client.createBlogPost(request);\n}\n')))),(0,i.kt)("h2",{id:"5-test-run",style:{position:"relative"}},(0,i.kt)("a",{parentName:"h2",href:"#5-test-run","aria-label":"5 test run permalink",className:"anchor before"},(0,i.kt)("svg",{parentName:"a","aria-hidden":"true",focusable:"false",height:"16",version:"1.1",viewBox:"0 0 16 16",width:"16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"}))),"5. Test run"),(0,i.kt)("p",null,"While the server is running, run the client's ",(0,i.kt)("inlineCode",{parentName:"p"},"main()")," method. You'll get an exception."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},'Exception in thread "main" io.grpc.StatusRuntimeException: UNIMPLEMENTED: Method example.armeria.blog.grpc.BlogService/CreateBlogPost is unimplemented\n')),(0,i.kt)("p",null,'The message says "UNIMPLEMENTED". This is because we are yet to implement the service method to create a blog post. One thing we did check is that our service does return something to a client call.'),(0,i.kt)("h2",{id:"whats-next",style:{position:"relative"}},(0,i.kt)("a",{parentName:"h2",href:"#whats-next","aria-label":"whats next permalink",className:"anchor before"},(0,i.kt)("svg",{parentName:"a","aria-hidden":"true",focusable:"false",height:"16",version:"1.1",viewBox:"0 0 16 16",width:"16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"}))),"What's next"),(0,i.kt)("p",null,"In this step, we've created and added an empty gRPC service to a server. We've also created a minimal client and made a call to the server."),(0,i.kt)("p",null,"Next, we'll get on with implementing a service method for ",(0,i.kt)("a",{parentName:"p",href:"/tutorials/grpc/blog/implement-create"},"creating blog posts"),"."),(0,i.kt)(p,{current:2,mdxType:"TutorialSteps"}))}h.isMDXComponent=!0},89791:function(e,a,t){t.d(a,{Z:function(){return o}});var r=t(25444),n=t(67294),i=JSON.parse('{"root":["index"],"Useful links":{"User manual":"/docs","API documentation":"https://javadoc.io/doc/com.linecorp.armeria/armeria-javadoc/latest/index.html","Release notes":"/release-notes"},"REST service":["rest/blog","rest/blog/create-server","rest/blog/prepare-data-object","rest/blog/add-services-to-server","rest/blog/implement-create","rest/blog/implement-read","rest/blog/implement-update","rest/blog/implement-delete"],"gRPC service":["grpc/blog","grpc/blog/define-service","grpc/blog/run-service","grpc/blog/implement-create","grpc/blog/implement-read","grpc/blog/implement-update","grpc/blog/implement-delete","grpc/blog/add-docservice"],"Thrift service":{"Coming soon":null}}'),l=t(46731),o=function(e){var a=(0,r.useStaticQuery)("3172452987").allMdx.nodes;return n.createElement(l.Z,Object.assign({},e,{candidateMdxNodes:a,index:i,prefix:"tutorials",menuTitle:!0,pageTitleSuffix:"Armeria tutorial"}))}}}]);
//# sourceMappingURL=component---src-pages-tutorials-grpc-blog-run-service-mdx-2ee1419a33e50109294e.js.map