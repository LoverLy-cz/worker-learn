export default {
  fetch(request, env, ctx) {
    console.log(request, env, ctx)
    const url = new URL(request.url);
    if(url.pathname.startsWith('/api')) {
      return Response.json({
        name: "Cloudflare",
      });
    }

    return new Response('Hello World!');
  },
} satisfies ExportedHandler<Env>;
