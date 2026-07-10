const UA = "Xemzz/modrinth-hub/1.0.0 (github.com/xemzzxiterz)";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { q = "", type = "mod", index = "relevance", offset = "0", limit = "24", version = "", loader = "" } = req.query;

  const facets = [[`project_type:${type}`]];
  if (version) facets.push([`versions:${version}`]);
  if (loader) facets.push([`categories:${loader}`]);

  const url = new URL("https://api.modrinth.com/v2/search");
  url.searchParams.set("query", q);
  url.searchParams.set("index", index);
  url.searchParams.set("offset", offset);
  url.searchParams.set("limit", limit);
  url.searchParams.set("facets", JSON.stringify(facets));

  try {
    const r = await fetch(url, { headers: { "User-Agent": UA } });
    if (!r.ok) return res.status(r.status).json({ error: "modrinth_error", status: r.status });
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: "fetch_failed" });
  }
};
