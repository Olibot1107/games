const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');
const unzipper = require('unzipper');
const fse = require('fs-extra');

const {
    PUBLIC_DIR,
    RESOURCE_KEY,
    colors,
    logError,
    logInfo,
    logSuccess,
    mimeTypes,
    resolvePublicFile,
    xorBufferFast,
} = require('./data');

const ZIP_URL = 'https://github.com/Olibot1107/games-math/archive/refs/heads/main.zip';
const TEMP_ZIP = path.join(__dirname, '..', 'repo.zip');
const TEMP_DIR = path.join(__dirname, '..', 'temp_extract');
const FINAL_DIR = path.join(__dirname, '..', 'math');

let archiver;
async function loadArchiver() {
    if (!archiver) {
        const module = await import('archiver');
        archiver = module.default ?? module;
    }
    return archiver;
}

function createArchive(type, options) {
    if (typeof archiver === 'function') {
        return archiver(type, options);
    }

    if (type === 'zip' && archiver?.ZipArchive) {
        return new archiver.ZipArchive(options);
    }
    if (type === 'tar' && archiver?.TarArchive) {
        return new archiver.TarArchive(options);
    }
    if (type === 'json' && archiver?.JsonArchive) {
        return new archiver.JsonArchive(options);
    }

    throw new Error('Unsupported archiver export shape');
}

function stripAnsi(text) {
    return text.replace(/\x1b\[[0-9;]*m/g, '');
}

function padRight(text, width) {
    const visible = stripAnsi(text).length;
    return visible >= width ? text : text + ' '.repeat(width - visible);
}

function createBatchProgressLogger(paths) {
    const isTty = Boolean(process.stdout.isTTY);
    const width = Math.max(24, ...paths.map(p => stripAnsi(String(p)).length));
    const statuses = new Array(paths.length).fill('waiting');
    const details = new Array(paths.length).fill('');
    const isSingle = paths.length === 1;
    let rendered = false;
    let frameLines = 0;
    let singleRendered = false;
    let renderQueued = false;
    let renderTimer = null;
    let lastSnapshot = '';

    const statusPills = {
        waiting: `${colors.bgYellow}${colors.black} waiting to read ${colors.reset}`,
        reading: `${colors.bgBlue}${colors.white} reading and sending ${colors.reset}`,
        done: `${colors.bgGreen}${colors.white} done and sent ${colors.reset}`,
        error: `${colors.bgRed}${colors.white} error ${colors.reset}`,
    };

    function formatStatus(index) {
        const status = statuses[index];
        if (status === 'waiting' && !details[index]) {
            return '';
        }

        const pill = statusPills[status] || '';
        const detail = details[index] ? `${colors.dim}${details[index]}${colors.reset}` : '';
        return detail ? `${pill}  ${detail}` : pill;
    }

    function buildLines() {
        if (isSingle) {
            const fileLabel = String(paths[0]);
            const status = formatStatus(0);
            return [
                `${colors.bgCyan}${colors.black} INFO ${colors.reset} ${colors.bright}Resource${colors.reset} ${colors.dim}(1 file)${colors.reset}`,
                status ? `╰ ${fileLabel}  ${status}` : `╰ ${fileLabel}`,
            ];
        }

        const header = `${colors.bgCyan}${colors.black} INFO ${colors.reset} ${colors.bright}Resource batch${colors.reset} ${colors.dim}(${paths.length} files)${colors.reset}`;
        const rows = paths.map((file, index) => {
            const prefix = index === paths.length - 1 ? '╰' : '├';
            const gutter = index === paths.length - 1 ? ' ' : '│';
            const fileLabel = padRight(String(file), width);
            const status = formatStatus(index);
            return status ? `${gutter} ${prefix} ${fileLabel}  ${status}` : `${gutter} ${prefix} ${fileLabel}`;
        });

        return [header, ...rows];
    }

    function writeLines(lines) {
        const snapshot = lines.join('\n');
        if (snapshot === lastSnapshot) {
            return;
        }
        lastSnapshot = snapshot;

        if (!isTty) {
            lines.forEach((line) => console.log(line));
            return;
        }

        process.stdout.write(snapshot + '\n');
        frameLines = lines.length;
    }

    function flushRender() {
        renderQueued = false;
        if (renderTimer) {
            clearTimeout(renderTimer);
            renderTimer = null;
        }

        if (isSingle && statuses[0] === 'waiting' && !details[0]) {
            return;
        }

        const lines = buildLines();
        if (!isSingle && !isTty) {
            writeLines(lines);
            return;
        }

        if (isSingle && singleRendered) {
            readline.moveCursor(process.stdout, 0, -2);
            readline.cursorTo(process.stdout, 0);
            readline.clearScreenDown(process.stdout);
        } else if (!isSingle && rendered && frameLines > 0) {
            readline.moveCursor(process.stdout, 0, -frameLines);
            readline.cursorTo(process.stdout, 0);
            readline.clearScreenDown(process.stdout);
        }

        writeLines(lines);
        rendered = true;
        if (isSingle) {
            singleRendered = true;
        }
    }

    function scheduleRender() {
        if (renderQueued) {
            return;
        }
        renderQueued = true;
        renderTimer = setTimeout(flushRender, 25);
    }

    return {
        start() {
            if (!isSingle) {
                flushRender();
            }
        },
        waiting(index) {
            statuses[index] = 'waiting';
            details[index] = '';
            scheduleRender();
        },
        reading(index, detail) {
            statuses[index] = 'reading';
            details[index] = detail || '';
            scheduleRender();
        },
        done(index, detail) {
            statuses[index] = 'done';
            details[index] = detail || '';
            scheduleRender();
        },
        error(index, detail) {
            statuses[index] = 'error';
            details[index] = detail || '';
            scheduleRender();
        },
    };
}

async function downloadZip(url = ZIP_URL, redirectCount = 0) {
    return new Promise((resolve, reject) => {
        if (redirectCount > 5) {
            return reject(new Error('Too many redirects'));
        }

        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return downloadZip(res.headers.location, redirectCount + 1)
                    .then(resolve)
                    .catch(reject);
            }

            if (res.statusCode !== 200) {
                return reject(new Error('Bad status code: ' + res.statusCode));
            }

            const file = fs.createWriteStream(TEMP_ZIP);
            res.pipe(file);

            file.on('finish', () => {
                file.close(resolve);
            });
            file.on('error', reject);
        }).on('error', reject);
    });
}

async function extractZip() {
    await fse.remove(TEMP_DIR);
    await fse.ensureDir(TEMP_DIR);

    const buffer = await fs.promises.readFile(TEMP_ZIP);

    await unzipper.Open.buffer(buffer)
        .then(d => d.extract({ path: TEMP_DIR }));
}

async function moveToMathFolder() {
    await fse.ensureDir(FINAL_DIR);

    const extractedRoot = fs.readdirSync(TEMP_DIR)[0];
    const extractedPath = path.join(TEMP_DIR, extractedRoot);

    await fse.copy(extractedPath, FINAL_DIR, {
        overwrite: true
    });

    const gitPath = path.join(FINAL_DIR, '.git');
    if (await fse.pathExists(gitPath)) {
        await fse.remove(gitPath);
    }
}

function registerResourceRoutes(app) {
    app.post('/api/resource', async (req, res) => {
        let body;
        try {
            body = JSON.parse(req.body.toString());
        } catch {
            return res.status(400).json({ error: 'invalid body' });
        }

        const paths = body.paths || [body.path];

        if (!Array.isArray(paths)) {
            return res.status(400).json({ error: 'paths must be array' });
        }

        const progress = createBatchProgressLogger(paths);
        progress.start();

        const results = await Promise.all(paths.map(async (reqPath, index) => {
            if (!reqPath || reqPath.includes('..')) {
                progress.error(index, 'invalid path');
                return { error: 'invalid path' };
            }

            let fullPath;
            try {
                fullPath = await resolvePublicFile(reqPath);
            } catch (err) {
                if (err && err.code === 'ENOENT') {
                    progress.error(index, 'not found');
                    return { error: 'not found' };
                }
                throw err;
            }

            try {
                const stat = await fs.promises.stat(fullPath);
                const ext = path.extname(fullPath).toLowerCase();

                const fileBuffer = await fs.promises.readFile(fullPath);
                progress.reading(index, `${(fileBuffer.length / 1024).toFixed(2)} KB read`);

                const encrypted = xorBufferFast(fileBuffer);
                const encryptedFile = encrypted.toString('base64');

                const envelope = {
                    contentType: mimeTypes[ext] || 'application/octet-stream',
                    contentEncoding: ext === '.unityweb' ? 'gzip' : null,
                    size: stat.size,
                    payload: encryptedFile
                };

                const encryptedEnvelope = xorBufferFast(
                    Buffer.from(JSON.stringify(envelope))
                ).toString('base64');

                progress.done(index, `${(stat.size / 1024).toFixed(2)} KB sent`);
                return { payload: encryptedEnvelope };

            } catch (err) {
                if (err.code === 'ENOENT') {
                    logError('File not found: ' + fullPath);
                    progress.error(index, 'not found');
                    return { error: 'not found' };
                }
                logError('Server error: ' + err.message);
                progress.error(index, 'server error');
                return { error: 'server error' };
            }
        }));

        res.set('X-Resource-Count', results.length);
        res.json({ files: results });
    });

    app.get('/api/die', (req, res) => {
        res.json({ message: 'Shutting down server...' });

        logInfo('Kill endpoint called - shutting down server');

        setTimeout(() => {
            process.exit(0);
        }, 100);
    });
}

async function setupMathRepo() {
    try {
        logInfo('Cleaning old math folder...');
        await fse.remove(FINAL_DIR);

        logInfo('Downloading math repo...');
        await downloadZip();

        logInfo('Extracting zip...');
        await extractZip();

        logInfo('Moving files into /math...');
        await moveToMathFolder();

        if (await fse.pathExists(TEMP_ZIP)) {
            await fse.remove(TEMP_ZIP);
            logInfo('Deleted repo.zip');
        }

        if (await fse.pathExists(TEMP_DIR)) {
            await fse.remove(TEMP_DIR);
            logInfo('Deleted temp extract folder');
        }

        logSuccess('Math repo ready');
    } catch (err) {
        logError('Setup failed: ' + err.message);
    }
}

module.exports = {
    FINAL_DIR,
    TEMP_DIR,
    TEMP_ZIP,
    ZIP_URL,
    createArchive,
    loadArchiver,
    registerResourceRoutes,
    setupMathRepo,
};
