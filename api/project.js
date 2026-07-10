const UA = "Xemzz/modrinth-hub/1.0.0 (github.com/xemzzxiterz)";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { id, version = "" } = req.query;
  if (!id) return res.status(400).json({ error: "missing_id" });

  try {
    if (version) {
      const r = await fetch(`https://api.modrinth.com/v2/version/${encodeURIComponent(version)}`, { headers: { "User-Agent": UA } });
      if (!r.ok) return res.status(r.status).json({ error: "modrinth_error", status: r.status });
      return res.status(200).json(await r.json());
    }

    const [projRes, versRes] = await Promise.all([
      fetch(`https://api.modrinth.com/v2/project/${encodeURIComponent(id)}`, { headers: { "User-Agent": UA } }),
      fetch(`https://api.modrinth.com/v2/project/${encodeURIComponent(id)}/version`, { headers: { "User-Agent": UA } })
    ]);

    if (!projRes.ok) return res.status(projRes.status).json({ error: "modrinth_error", status: projRes.status });

    const project = await projRes.json();
    const versions = versRes.ok ? await versRes.json() : [];
    res.status(200).json({ project, versions });
  } catch (e) {
    res.status(502).json({ error: "fetch_failed" });
  }
};
