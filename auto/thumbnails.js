const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.resolve(__dirname, '../thumbnails');
const LIST_FILE = path.resolve(__dirname, '../list.json');
const CONCURRENCY = 1;

const c = {
    reset: '\x1b[0m', bold: '\x1b[1m',
    cyan: '\x1b[36m', magenta: '\x1b[35m',
    brightGreen: '\x1b[92m', brightRed: '\x1b[91m', yellow: '\x1b[33m',
};

const log = {
    title:   (m) => console.log(`${c.bold}${c.magenta}\n=== ${m} ===${c.reset}`),
    info:    (m) => console.log(`${c.cyan}[INFO]${c.reset} ${m}`),
    success: (m) => console.log(`${c.brightGreen}[OK]${c.reset} ${m}`),
    skip:    (m) => console.log(`${c.yellow}[SKIP]${c.reset} ${m}`),
    error:   (m) => console.log(`${c.brightRed}[ERROR]${c.reset} ${m}`),
};

function safeName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 80);
}

function toSearchQuery(name) {
    return name.replace(/[-_.]+/g, ' ').trim() + ' game';
}

async function fetchDDGThumbnail(gameName) {
    const query = toSearchQuery(gameName);
    const enc = encodeURIComponent(query);
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

    const homeRes = await fetch(`https://duckduckgo.com/?q=${enc}&iax=images&ia=images`, {
        headers: { 'User-Agent': ua }
    });
    const html = await homeRes.text();
    const m = html.match(/vqd=["']([^"']{5,})["']/);
    if (!m) throw new Error('vqd not found');

    const searchRes = await fetch(
        `https://duckduckgo.com/i.js?q=${enc}&vqd=${encodeURIComponent(m[1])}&f=,,,&p=1`,
        { headers: { 'User-Agent': ua, 'Referer': 'https://duckduckgo.com/' } }
    );
    if (!searchRes.ok) throw new Error(`DDG i.js ${searchRes.status}`);

    const data = await searchRes.json();
    if (!data.results?.length) throw new Error('No results');

    const candidates = data.results.filter(r => r.width >= 200 && r.height >= 150);
    if (!candidates.length) candidates.push(...data.results);
    return candidates.map(r => r.image);
}

// Returns 'skip' | 'ok' — throws on failure
async function downloadThumbnail(gameName) {
    const imgFile = path.join(CACHE_DIR, safeName(gameName) + '.jpg');

    if (fs.existsSync(imgFile)) {
        log.skip(gameName);
        return 'skip';
    }

    const urls = await fetchDDGThumbnail(gameName);
    let lastErr = new Error('No candidates');

    for (const url of urls.slice(0, 5)) {
        try {
            const imgRes = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                signal: AbortSignal.timeout(10000),
                redirect: 'follow'
            });
            if (!imgRes.ok) { lastErr = new Error(`${imgRes.status}`); continue; }
            const contentType = imgRes.headers.get('content-type') || '';
            if (!contentType.startsWith('image/')) { lastErr = new Error('not an image'); continue; }
            fs.writeFileSync(imgFile, Buffer.from(await imgRes.arrayBuffer()));
            log.success(gameName);
            return 'ok';
        } catch (e) {
            lastErr = e;
        }
    }

    throw lastErr;
}

async function pool(tasks, limit) {
    const results = [];
    let i = 0;
    async function worker() {
        while (i < tasks.length) {
            const idx = i++;
            results[idx] = await tasks[idx]();
        }
    }
    await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
    return results;
}

async function main() {
    log.title('Thumbnail Auto-Fetcher');

    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

    let list;
    try {
        list = JSON.parse(fs.readFileSync(LIST_FILE, 'utf8'));
    } catch (e) {
        log.error(`Could not read list.json: ${e.message}`);
        log.info('Run auto/list.js first to generate list.json');
        process.exit(1);
    }

    const games = [...(list.good || []), ...(list.nova || [])];
    log.info(`Found ${games.length} games — concurrency ${CONCURRENCY}`);

    const statuses = await pool(games.map(game => async () => {
        try {
            return await downloadThumbnail(game);
        } catch (err) {
            log.error(`${game}: ${err.message}`);
            return 'error';
        }
    }), CONCURRENCY);

    const ok      = statuses.filter(s => s === 'ok').length;
    const skipped = statuses.filter(s => s === 'skip').length;
    const failed  = statuses.filter(s => s === 'error').length;

    log.title('Done');
    console.log(`${c.brightGreen}Downloaded: ${ok}${c.reset}  ${c.yellow}Skipped: ${skipped}${c.reset}  ${c.brightRed}Failed: ${failed}${c.reset}`);
}

main();
