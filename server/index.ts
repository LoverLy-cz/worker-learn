export default {
  fetch(request, env, ctx) {
    console.log(request, env, ctx)
    const url = new URL(request.url);

    return Response.json({
      name: "Cloudflare",
    });
  },
} satisfies ExportedHandler<Env>;
