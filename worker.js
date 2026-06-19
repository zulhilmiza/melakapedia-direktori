export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/listings") {
      const cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type, x-admin-key",
      };

      if (request.method === "OPTIONS") {
        return new Response(null, { headers: cors });
      }

      if (request.method === "GET") {
        const data = await env.LISTINGS_KV.get("listings", { type: "json" });
        return Response.json(
          { listings: data || { penginapan: [], makanan: [], aktiviti: [] } },
          { headers: cors }
        );
      }

      if (request.method === "POST") {
        const key = request.headers.get("x-admin-key");
        if (!key || key !== env.ADMIN_KEY) {
          return Response.json({ error: "Unauthorized" }, { status: 401, headers: cors });
        }
        const body = await request.json();
        await env.LISTINGS_KV.put("listings", JSON.stringify(body.listings));
        return Response.json({ ok: true }, { headers: cors });
      }

      return new Response("Method not allowed", { status: 405 });
    }

    return env.ASSETS.fetch(request);
  },
};
