const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = ROOT_DIR;
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
const COMMENTS_UPLOAD_DIR = path.join(UPLOADS_DIR, 'comments');

const VOTES_FILE = path.join(ROOT_DIR, 'votes.json');
const COMMENTS_FILE = path.join(ROOT_DIR, 'comments.json');
const PLAYS_FILE = path.join(ROOT_DIR, 'plays.json');
const DATA_FILE = path.join(ROOT_DIR, 'data.json');
const SOUNDS_FILE = path.join(ROOT_DIR, 'sounds.json');
const SESSIONS_FILE = path.join(ROOT_DIR, 'sessions.json');
const HOSTS_FILE = path.join(ROOT_DIR, 'hosts.json');

const RESOURCE_KEY = Buffer.from('games-shell-v1');

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.wasm': 'application/wasm',
    '.unityweb': 'application/octet-stream'
};

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    black: '\x1b[30m',
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
};

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function ensureBaseDirs() {
    ensureDir(UPLOADS_DIR);
    ensureDir(COMMENTS_UPLOAD_DIR);
}

function logInfo(msg) {
    console.log(`${colors.bgCyan}${colors.black} INFO ${colors.reset} ${msg}`);
}

function logSuccess(msg) {
    console.log(`${colors.bgGreen}${colors.black} SUCCESS ${colors.reset} ${msg}`);
}

function logError(msg) {
    console.log(`${colors.bgRed}${colors.white} ERROR ${colors.reset} ${msg}`);
}

function parseJsonBody(req) {
    let body = req.body;
    if (Buffer.isBuffer(body)) body = body.toString('utf8');
    if (typeof body === 'string') body = body.trim();
    try {
        return typeof body === 'string' && body.length ? JSON.parse(body) : body;
    } catch {
        return null;
    }
}

function readJsonFile(filePath, fallback = {}) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return fallback;
    }
}

function writeJsonFile(filePath, value) {
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function readVotes() {
    return readJsonFile(VOTES_FILE, {});
}

function writeVotes(votes) {
    writeJsonFile(VOTES_FILE, votes);
}

function readComments() {
    return readJsonFile(COMMENTS_FILE, {});
}

function writeComments(comments) {
    writeJsonFile(COMMENTS_FILE, comments);
}

function readPlays() {
    return readJsonFile(PLAYS_FILE, {});
}

function writePlays(plays) {
    writeJsonFile(PLAYS_FILE, plays);
}

function readData() {
    return readJsonFile(DATA_FILE, { totalBytes: 0 });
}

function writeData(data) {
    writeJsonFile(DATA_FILE, data);
}

function xorBufferFast(buffer) {
    const keyLen = RESOURCE_KEY.length;
    const bufLen = buffer.length;
    const out = Buffer.allocUnsafe(bufLen);

    let i = 0;
    const limit = bufLen - 15;

    while (i < limit) {
        const k0 = RESOURCE_KEY[i % keyLen];
        const k1 = RESOURCE_KEY[(i + 1) % keyLen];
        const k2 = RESOURCE_KEY[(i + 2) % keyLen];
        const k3 = RESOURCE_KEY[(i + 3) % keyLen];
        const k4 = RESOURCE_KEY[(i + 4) % keyLen];
        const k5 = RESOURCE_KEY[(i + 5) % keyLen];
        const k6 = RESOURCE_KEY[(i + 6) % keyLen];
        const k7 = RESOURCE_KEY[(i + 7) % keyLen];
        const k8 = RESOURCE_KEY[(i + 8) % keyLen];
        const k9 = RESOURCE_KEY[(i + 9) % keyLen];
        const k10 = RESOURCE_KEY[(i + 10) % keyLen];
        const k11 = RESOURCE_KEY[(i + 11) % keyLen];
        const k12 = RESOURCE_KEY[(i + 12) % keyLen];
        const k13 = RESOURCE_KEY[(i + 13) % keyLen];
        const k14 = RESOURCE_KEY[(i + 14) % keyLen];
        const k15 = RESOURCE_KEY[(i + 15) % keyLen];

        out[i] = buffer[i] ^ k0;
        out[i + 1] = buffer[i + 1] ^ k1;
        out[i + 2] = buffer[i + 2] ^ k2;
        out[i + 3] = buffer[i + 3] ^ k3;
        out[i + 4] = buffer[i + 4] ^ k4;
        out[i + 5] = buffer[i + 5] ^ k5;
        out[i + 6] = buffer[i + 6] ^ k6;
        out[i + 7] = buffer[i + 7] ^ k7;
        out[i + 8] = buffer[i + 8] ^ k8;
        out[i + 9] = buffer[i + 9] ^ k9;
        out[i + 10] = buffer[i + 10] ^ k10;
        out[i + 11] = buffer[i + 11] ^ k11;
        out[i + 12] = buffer[i + 12] ^ k12;
        out[i + 13] = buffer[i + 13] ^ k13;
        out[i + 14] = buffer[i + 14] ^ k14;
        out[i + 15] = buffer[i + 15] ^ k15;

        i += 16;
    }

    while (i < bufLen) {
        out[i] = buffer[i] ^ RESOURCE_KEY[i % keyLen];
        i++;
    }

    return out;
}

async function resolvePublicFile(reqPath) {
    const normalizedPath = reqPath.startsWith('/') ? reqPath.slice(1) : reqPath;
    const directPath = path.resolve(PUBLIC_DIR, normalizedPath);
    try {
        await fs.promises.access(directPath, fs.constants.F_OK);
        return directPath;
    } catch {
        const rootPath = path.resolve(PUBLIC_DIR, 'root', normalizedPath);
        try {
            await fs.promises.access(rootPath, fs.constants.F_OK);
            return rootPath;
        } catch {
            throw { code: 'ENOENT', path: reqPath };
        }
    }
}

function createCommentUploadFilename(originalName) {
    const ext = path.extname(originalName).toLowerCase();
    return `${Date.now()}-${crypto.randomUUID()}${ext}`;
}

function getSessions() {
    return readJsonFile(SESSIONS_FILE, {});
}

function writeSessions(sessions) {
    writeJsonFile(SESSIONS_FILE, sessions);
}

function getOrCreateSession(sessionId, defaultSession) {
    const sessions = getSessions();
    if (!sessions[sessionId]) {
        sessions[sessionId] = defaultSession;
        writeSessions(sessions);
    }
    return sessions[sessionId];
}

function updateSession(sessionId, updates) {
    const sessions = getSessions();
    sessions[sessionId] = { ...sessions[sessionId], ...updates, updatedAt: Date.now() };
    writeSessions(sessions);
}

function deleteSession(sessionId) {
    const sessions = getSessions();
    delete sessions[sessionId];
    writeSessions(sessions);
}

function getHosts() {
    return readJsonFile(HOSTS_FILE, {});
}

function writeHosts(hosts) {
    writeJsonFile(HOSTS_FILE, hosts);
}

function getHost(hostId) {
    return getHosts()[hostId];
}

function updateHost(hostId, updates) {
    const hosts = getHosts();
    hosts[hostId] = { ...hosts[hostId], ...updates };
    writeHosts(hosts);
}

function deleteHost(hostId) {
    const hosts = getHosts();
    delete hosts[hostId];
    writeHosts(hosts);
}

module.exports = {
    COMMENTS_FILE,
    COMMENTS_UPLOAD_DIR,
    COLORS: colors,
    COMMENTS_DIR: COMMENTS_UPLOAD_DIR,
    PLAYS_FILE,
    PUBLIC_DIR,
    DATA_FILE,
    RESOURCE_KEY,
    SOUNDS_FILE,
    UPLOADS_DIR,
    VOTES_FILE,
    SESSIONS_FILE,
    HOSTS_FILE,
    colors,
    createCommentUploadFilename,
    ensureBaseDirs,
    ensureDir,
    logError,
    logInfo,
    logSuccess,
    mimeTypes,
    parseJsonBody,
    readComments,
    readData,
    readJsonFile,
    readPlays,
    readVotes,
    resolvePublicFile,
    writeComments,
    writeData,
    writeJsonFile,
    writePlays,
    writeVotes,
    getSessions,
    writeSessions,
    getOrCreateSession,
    updateSession,
    deleteSession,
    getHosts,
    writeHosts,
    getHost,
    updateHost,
    deleteHost,
    xorBufferFast,
};
