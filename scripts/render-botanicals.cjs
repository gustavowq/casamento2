// Regenera os WebP depois de editar os desenhos ou suas cores.
const fs = require("fs"), path = require("path"), os = require("os");
const { spawn } = require("child_process");
const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const clean = source => source.replace(/^import .*;\r?\n/gm, "").replace(/export /g, "");
const dom = read("js/core/dom.js");
const seed = clean(dom.slice(dom.indexOf("export function seeded")));
const details = clean(read("js/core/botanical-details.js"));
const botanical = clean(read("js/core/botanical.js"));
const manifestFile = "js/core/botanical-assets.js";
const manifest = JSON.parse(read(manifestFile).match(/export const BOTANICAL_ASSETS = ([\s\S]*);\s*$/)[1]);
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "emily-botanicals-"));
const html = path.join(temporary, "render.html");
fs.writeFileSync(html, `<!doctype html><pre id="assets"></pre><script>
${seed}
const {drawLeaf,drawLily,drawBud,drawStem,drawNode} = (() => {
${details}
return {drawLeaf,drawLily,drawBud,drawStem,drawNode};})();
const BOTANICAL_ASSETS = {};
${botanical}
const recipes = ${JSON.stringify(manifest)};
document.getElementById("assets").textContent = JSON.stringify(Object.entries(recipes).map(([key,file]) => {
  const [preset,seed,hue,tone] = key.split("|");
  return {file,data:artURL(preset,Number(seed),hue,tone)};
}));</script>`, "utf8");

const chrome = process.env.EMILY_CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = spawn(chrome, ["--headless", "--disable-gpu", "--disable-background-networking", "--disable-component-update",
  "--no-first-run", "--no-default-browser-check", `--user-data-dir=${path.join(temporary, "profile")}`,
  "--dump-dom", "file:///" + html.replaceAll("\\", "/")], { windowsHide: true });
let output = "", errors = "";
browser.stdout.on("data", data => { output += data; });
browser.stderr.on("data", data => { errors += data; });
browser.on("error", error => { console.error(error.message); process.exitCode = 1; });
browser.on("close", code => {
  const payload = output.match(/<pre id="assets">([^<]+)<\/pre>/)?.[1];
  if (code !== 0 || !payload) { console.error("Falha ao renderizar os desenhos.", errors.slice(-1000)); process.exitCode = 1; return; }
  const assets = JSON.parse(payload);
  for (const asset of assets) {
    const file = path.resolve(root, asset.file);
    if (!file.startsWith(path.join(root, "assets", "art") + path.sep)) throw new Error("Destino fora de assets/art.");
    fs.writeFileSync(file, Buffer.from(asset.data.split(",")[1], "base64"));
  }
  console.log(`${assets.length} ilustrações atualizadas em assets/art.`);
});
