const fs = require("fs/promises");
const path = require("path");

const outDir = path.join(__dirname, "..", "out");

async function pathExists(dir) {
  try {
    await fs.access(dir);
    return true;
  } catch {
    return false;
  }
}

async function walkAndClean(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkAndClean(full);
      continue;
    }
    if (!entry.isFile()) continue;

    const base = entry.name;
    const baseLower = base.toLowerCase();
    const ext = path.extname(base).toLowerCase();
    if (ext === ".txt" && baseLower !== "robots.txt") {
      await fs.unlink(full);
    }
  }
}

async function main() {
  if (!(await pathExists(outDir))) {
    process.exit(0);
  }
  await walkAndClean(outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
