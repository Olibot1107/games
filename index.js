const express = require('express');
const health = require('express-ping');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');

const {
    PUBLIC_DIR,
    RESOURCE_KEY,
    colors,
    logError,
    logInfo,
    logSuccess,
} = require('./server/data');
const { registerMediaRoutes } = require('./server/mediaRoutes');
const { registerResourceRoutes, setupMathRepo } = require('./server/resourceRoutes');
const { registerSocialRoutes } = require('./server/socialRoutes');

const app = express();
const PORT = 3000;
const DEBUG = process.env.DEBUG === 'true'; // run with: DEBUG=true node server.js

app.use(express.raw({ type: ['application/json', 'application/vnd.api+json', 'text/plain'], limit: '90mb' }));
app.use(cookieParser());
app.use(health.ping('/api/ping'));

app.use((req, res, next) => {
    if (!DEBUG) return next();

    try {
        const bodyPreview = req.body
            ? (Buffer.isBuffer(req.body)
                ? req.body.toString().slice(0, 500)
                : JSON.stringify(req.body).slice(0, 500))
            : null;

        console.log(`
${colors.bgBlue}${colors.bright} DEBUG REQUEST ${colors.reset}
${colors.cyan}Time:${colors.reset} ${new Date().toISOString()}
${colors.cyan}Method:${colors.reset} ${req.method}
${colors.cyan}URL:${colors.reset} ${req.originalUrl}
${colors.cyan}IP:${colors.reset} ${req.ip}

${colors.magenta}Headers:${colors.reset}
${JSON.stringify(req.headers, null, 2)}

${colors.yellow}Query:${colors.reset}
${JSON.stringify(req.query, null, 2)}

${colors.green}Cookies:${colors.reset}
${JSON.stringify(req.cookies, null, 2)}

${colors.white}Body (preview):${colors.reset}
${bodyPreview}
        `);
    } catch (err) {
        logError('Debug logging failed: ' + err.message);
    }

    next();
});

app.use((req, res, next) => {
    if (req.path.startsWith('/api/') ||  req.path.startsWith('/math') || req.path.startsWith('/uploads')) return next();
    if (req.cookies?.ok === 'true') return next();
    return res.redirect('/math/index.html');
});

registerResourceRoutes(app);
registerMediaRoutes(app);
registerSocialRoutes(app);

app.use(async (req, res, next) => {
    if (req.method !== 'GET') return next();

    if (req.path.endsWith('.html') || req.path === '/') {
        const filePath = req.path === '/'
            ? path.join(PUBLIC_DIR, 'index.html')
            : path.join(PUBLIC_DIR, req.path);

        try {
            let html = await fs.promises.readFile(filePath, 'utf8');
            const inject = `<script>if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js');</script>`;
            html = html.includes('</head>')
                ? html.replace('</head>', inject + '</head>')
                : html + inject;

            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.send(html);
        } catch {
            return next();
        }
    }
    next();
});

app.use(async (req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api/') || req.path === '/') return next();

    const directPath = path.resolve(PUBLIC_DIR, '.' + req.path);
    try {
        await fs.promises.access(directPath, fs.constants.F_OK);
        return next();
    } catch {
        const rootPath = path.resolve(PUBLIC_DIR, 'root', req.path.replace(/^\/+/, ''));
        try {
            await fs.promises.access(rootPath, fs.constants.F_OK);
            return res.sendFile(rootPath);
        } catch {
            return next();
        }
    }
});

app.use(express.static(PUBLIC_DIR));

app.listen(PORT, () => {
    console.log(`${colors.cyan}${colors.bright}
╭────────────────────────────────────────╮
│          SERVER STATUS PANEL           │
├────────────────────────────────────────┤
│  Status :  ONLINE                      │
│  URL    :  http://localhost:${PORT}       │
│  Key    :  ${RESOURCE_KEY.toString()}              │
╰────────────────────────────────────────╯
${colors.reset}`);

    setupMathRepo();
});
