const UA = "Xemzz/modrinth-hub/1.0.0 (github.com/xemzzxiterz)";
const ALLOWED_HOSTS = ["cdn.modrinth.com"];

module.exports = async (req, res) => {
  const { url, name = "file" } = req.query;
  if (!url) return res.status(400).json({ error: "missing_url" });

  let target;
  try {
    target = new URL(url);
  } catch (e) {
    return res.status(400).json({ error: "invalid_url" });
  }

  if (!ALLOWED_HOSTS.includes(target.hostname)) {
    return res.status(403).json({ error: "host_not_allowed" });
  }

  try {
    const upstream = await fetch(target, { headers: { "User-Agent": UA } });
    if (!upstream.ok || !upstream.body) {
      return res.status(upstream.status || 502).json({ error: "upstream_failed" });
    }

    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/octet-stream");
    const len = upstream.headers.get("content-length");
    if (len) res.setHeader("Content-Length", len);
    res.setHeader("Content-Disposition", `attachment; filename="${name.replace(/[^a-zA-Z0-9._-]/g, "_")}"`);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    const reader = upstream.body.getReader();
    res.status(200);
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
  } catch (e) {
    res.status(502).json({ error: "stream_failed" });
  }
};
