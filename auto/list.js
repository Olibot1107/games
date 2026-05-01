const fs = require("fs");
const path = require("path");

// 🎨 Extended ANSI color system
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",

  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",

  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightBlue: "\x1b[94m",
  brightMagenta: "\x1b[95m",
  brightCyan: "\x1b[96m"
};

const log = {
  title: (msg) => console.log(`${c.bold}${c.brightMagenta}\n=== ${msg} ===${c.reset}`),
  info: (msg) => console.log(`${c.cyan}[INFO]${c.reset} ${msg}`),
  success: (msg) => console.log(`${c.brightGreen}[SUCCESS]${c.reset} ${msg}`),
  warn: (msg) => console.log(`${c.yellow}[WARN]${c.reset} ${msg}`),
  error: (msg) => console.log(`${c.brightRed}[ERROR]${c.reset} ${msg}`),
  debug: (msg) => console.log(`${c.magenta}[DEBUG]${c.reset} ${msg}`)
};

// 📁 Safe directory reader
function getDirs(base) {
  try {
    if (!fs.existsSync(base)) {
      log.warn(`Missing path: ${base}`);
      return [];
    }

    return fs.readdirSync(base, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

  } catch (err) {
    log.error(`Read failed: ${err.message}`);
    return [];
  }
}

// 📍 Paths
const goodPath = path.resolve(__dirname, "../good");
const novaPath = path.resolve(__dirname, "../nova");

log.title("Folder Scanner Starting");

log.info(`Checking: ${goodPath}`);
const good = getDirs(goodPath);

log.info(`Checking: ${novaPath}`);
const nova = getDirs(novaPath);

// 📊 Results
log.title("Scan Results");

log.success(`Good folders: ${good.length}`);
log.success(`Nova folders: ${nova.length}`);

console.log(
  `${c.brightCyan}\nGood:${c.reset} ${good.join(", ") || "none"}`
);

console.log(
  `${c.brightYellow}\nNova:${c.reset} ${nova.join(", ") || "none"}`
);

// 💾 Output file
const output = {
  generated: new Date().toISOString(),
  good,
  nova
};

const outputPath = path.resolve(__dirname, "../list.json");

try {
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  log.title("Save Complete");
  log.success(`Saved to: ${outputPath}`);
} catch (err) {
  log.error(`Write failed: ${err.message}`);
}