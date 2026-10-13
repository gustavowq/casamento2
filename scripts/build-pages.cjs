// Valida os módulos e reúne apenas os arquivos públicos para o GitHub Pages.
const fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const root = fs.realpathSync(path.resolve(__dirname, ".."));
const output = path.join(root, ".pages-dist");
const files = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? files(file) : [file];
});

for (const file of files(path.join(root, "js")).filter(file => file.endsWith(".js"))) {
  execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
}
const catalog = fs.readFileSync(path.join(root, "js/core/botanical-assets.js"), "utf8");
const assets = JSON.parse(catalog.match(/export const BOTANICAL_ASSETS = ([\s\S]*);\s*$/)[1]);
for (const asset of Object.values(assets)) {
  if (!fs.existsSync(path.join(root, asset))) throw new Error(`Ilustração ausente: ${asset}`);
}

if (fs.existsSync(output)) {
  if (fs.realpathSync(output) !== output || path.dirname(output) !== root) {
    throw new Error("A pasta de publicação precisa estar diretamente dentro deste projeto.");
  }
  fs.rmSync(output, { recursive: true, force: true });
}
fs.mkdirSync(output);
for (const item of ["index.html", "css", "js", "assets"]) {
  fs.cpSync(path.join(root, item), path.join(output, item), { recursive: true });
}
fs.writeFileSync(path.join(output, ".nojekyll"), "");
console.log(`Site validado: ${files(output).length} arquivos públicos preparados em .pages-dist.`);
