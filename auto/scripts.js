const fs = require('fs');
const path = require('path');

// ================= SCRIPTS =================
const STATUSBAR_SCRIPT = `<script src="/lib/statusbar.js"></script>`;
const PLAYTIME_SCRIPT  = `<script src="/lib/playtime.js"></script>`;
const CLIENT_SCRIPT    = `<script src="https://plain-vanessa-ojdaw-24d55416.koyeb.app/client_script.js"></script>`;

// scripts to strip from game pages
const REMOVE_PATTERNS = [
  '/fps.js',
  './fps.js',
  'fps.js',
  'lib/fps.js',
  './lib/fps.js',
  '/lib/fps.js',
];

// ================= COLORS =================
const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m'
};

function log(msg, color = 'reset') {
  console.log(`${c[color] || ''}[injector] ${msg}${c.reset}`);
}

// ================= SAFE INJECT =================
function injectScript(html, scriptTag) {
  if (html.includes(scriptTag)) return html;

  if (html.includes('</body>')) {
    return html.replace('</body>', `${scriptTag}\n</body>`);
  }

  return html + '\n' + scriptTag;
}

// ================= FILE PROCESS =================
function processFile(fullPath) {
  fs.readFile(fullPath, 'utf8', (err, data) => {
    if (err) {
      log(`Read error: ${fullPath}`, 'red');
      return;
    }

    let updated = data;
    let changed = false;

    // remove fps + statusbar from game pages
    REMOVE_PATTERNS.forEach(old => {
      const regex = new RegExp(`\\s*<script\\s+src=["']${escapeReg(old)}["']><\\/script>`, 'g');
      if (regex.test(updated)) {
        updated = updated.replace(regex, '');
        log(`Removed: ${old}`, 'yellow');
        changed = true;
      }
    });

    // inject statusbar
    const beforeSB = updated;
    updated = injectScript(updated, STATUSBAR_SCRIPT);
    if (beforeSB !== updated) {
      log(`Injected statusbar -> /lib/statusbar.js`, 'green');
      changed = true;
    }

    // inject playtime tracker
    const beforePT = updated;
    updated = injectScript(updated, PLAYTIME_SCRIPT);
    if (beforePT !== updated) {
      log(`Injected playtime -> /lib/playtime.js`, 'green');
      changed = true;
    }

    // inject client script
    const beforeClient = updated;
    updated = injectScript(updated, CLIENT_SCRIPT);
    if (beforeClient !== updated) {
      log(`Injected client script`, 'cyan');
      changed = true;
    }

    if (changed) {
      fs.writeFile(fullPath, updated, err => {
        if (err) {
          log(`Write failed: ${fullPath}`, 'red');
        } else {
          log(`Updated: ${fullPath}`, 'magenta');
        }
      });
    } else {
      log(`No changes: ${fullPath}`);
    }
  });
}

// escape regex helper
function escapeReg(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ================= DIRECTORY SCAN =================
function findHtmlFiles(dir) {
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      log(`Error reading ${dir}: ${err.message}`, 'red');
      return;
    }

    files.forEach(file => {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        findHtmlFiles(fullPath);
        return;
      }

      if (file.isFile() && file.name.toLowerCase().endsWith('.html')) {

        if (file.name.toLowerCase() === 'blocked.html') {
          log(`Skipped: ${fullPath}`, 'yellow');
          return;
        }

        processFile(fullPath);
      }

      if (file.isFile() && file.name.toLowerCase().endsWith('.html')) {
        processFile(fullPath);
      }
    });
  });
}

// ================= START =================
const startDir = process.argv[2] || __dirname;

log(`Starting scan in: ${startDir}`, 'bold');
findHtmlFiles(startDir);