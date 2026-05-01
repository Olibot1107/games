const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const NEW_TITLE = "Math Practice";

// ANSI colors
const color = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m"
};

const log = {
  info: (msg) => console.log(`${color.cyan}[INFO]${color.reset} ${msg}`),
  success: (msg) => console.log(`${color.green}[OK]${color.reset} ${msg}`),
  warn: (msg) => console.log(`${color.yellow}[WARN]${color.reset} ${msg}`),
  error: (msg) => console.log(`${color.red}[ERROR]${color.reset} ${msg}`)
};

function getAllFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (entry.isFile() && fullPath.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function processFiles() {
  log.info(`Scanning directory: ${ROOT_DIR}`);

  const htmlFiles = getAllFiles(ROOT_DIR);

  log.info(`Found ${htmlFiles.length} HTML files`);

  let changedCount = 0;

  htmlFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');

      const updated = content.replace(
        /<title>[\s\S]*?<\/title>/gi,
        `<title>${NEW_TITLE}</title>`
      );

      if (updated !== content) {
        fs.writeFileSync(file, updated, 'utf8');
        log.success(`Updated: ${file}`);
        changedCount++;
      } else {
        log.warn(`No changes: ${file}`);
      }
    } catch (err) {
      log.error(`Failed: ${file} (${err.message})`);
    }
  });

  log.info(`Done. Files changed: ${changedCount}`);
}

processFiles();