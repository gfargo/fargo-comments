// scripts/gen-registry.mjs
import fs from "node:fs";
import path from "node:path";
import config from "./registry.config.mjs";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, config.outDir);
const R_DIR = path.join(OUT_DIR, "r");

const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });

/** Recursively list files under a directory */
function listFiles(dir) {
  const res = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      res.push(...listFiles(p));
    } else if (entry.isFile()) {
      // keep repo-relative path with forward slashes
      res.push(p.replace(ROOT + path.sep, "").split(path.sep).join("/"));
    }
  }
  return res;
}

/** Minimal path utility: join with posix slashes */
function joinPosix(...segments) {
  return path.join(...segments).split(path.sep).join("/");
}

/** Map "core" → full URL if it's one of our items */
function depToUrl(depName, items) {
  const found = items.find((it) => it.shortName === depName);
  if (!found) return depName; // leave as-is if not shorthand
  return `${config.baseUrl}/r/${found.fileName.replace(/\.json$/, "")}`;
}

/** Build one registry item JSON */
function buildItemJSON(allFiles, itemCfg, items) {
  const include = itemCfg.include ?? [];
  const exclude = itemCfg.exclude ?? [];
  const matches = new Set();

  for (const file of allFiles) {
    const inc = include.some((rx) => rx.test(file));
    if (!inc) continue;
    const exc = exclude.some((rx) => rx.test(file));
    if (exc) continue;
    matches.add(file);
  }

  // Convert matched files into { from, to } with path rewriting
  const files = [...matches].sort().map((from) => {
    const toRaw = config.pathRewriter(from);
    // Use the original lib/ path as the source
    return { from: from, to: toRaw };
  });

  // Merge dependencies: defaults + item-specific
  const deps = {
    ...(config.defaults?.dependencies ?? {}),
    ...(itemCfg.dependencies ?? {}),
  };
  const dependencies = Object.keys(deps).length ? deps : undefined;

  // Resolve registryDependencies → full URLs
  const registryDependencies =
    (itemCfg.registryDependencies ?? []).map((short) => depToUrl(short, items));

  return {
    name: itemCfg.name,
    type: itemCfg.type || "components",
    ...(dependencies ? { dependencies } : {}),
    ...(registryDependencies.length ? { registryDependencies } : {}),
    files,
  };
}

/** MAIN */
(function main() {
  ensureDir(R_DIR);

  // Read project tree
  const repoFiles = listFiles(ROOT);

  // Prepare lookup of items with "short names" for deps like ["core"]
  const items = config.items.map((it) => ({
    ...it,
    shortName: it.fileName.replace(/\.json$/, ""), // e.g., "core"
  }));

  // Generate each registry item JSON
  const outputs = items.map((item) =>
    buildItemJSON(repoFiles, item, items)
  );

  // Write each /r/*.json
  for (let i = 0; i < outputs.length; i++) {
    const raw = outputs[i];
    const fn = items[i].fileName;
    const outPath = path.join(R_DIR, fn);
    fs.writeFileSync(outPath, JSON.stringify(raw, null, 2), "utf8");
  }

  // Write registry manifest
  const manifest = {
    registry: outputs.map((o, i) => ({
      name: o.name,
      item: `${config.baseUrl}/r/${items[i].fileName.replace(/\.json$/, "")}`,
      file: joinPosix("r", items[i].fileName),
      type: o.type,
    })),
  };
  fs.writeFileSync(
    path.join(OUT_DIR, "registry.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );

  // Print a summary
  console.log(
    `✅ Generated ${outputs.length} registry items into ${joinPosix(config.outDir, "r")}`
  );
  
  // Print each item for verification
  outputs.forEach((output, i) => {
    console.log(`📦 ${output.name}: ${output.files.length} files`);
  });
})();