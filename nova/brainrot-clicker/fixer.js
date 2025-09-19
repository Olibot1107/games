// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;
const FILE_DIR = path.join(__dirname, '');

if (!fs.existsSync(FILE_DIR)) fs.mkdirSync(FILE_DIR, { recursive: true });

// Helper: download file with headers
async function downloadFile(remoteUrl, dest, headers) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    const writer = fs.createWriteStream(dest);
    const response = await axios({
        url: remoteUrl,
        method: 'GET',
        responseType: 'stream',
        headers
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

// Middleware: download missing files dynamically
app.use(async (req, res, next) => {
    try {
        const localPath = path.join(FILE_DIR, req.path);

        if (!fs.existsSync(localPath)) {
            // Build remote URL from the request path
            const remoteUrl = 'https://unblocked-games.s3.amazonaws.com/games/2025/rhm/brainrot-clicker/' + req.path.slice(1); // remove leading /

            console.log(`Downloading missing file: ${remoteUrl}`);

            // Pass most browser headers to the request
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
                'Referer': 'https://unblocked-games.s3.amazonaws.com/games/2024/gm/moto-x3m/index.html',
                'Accept': '*/*',
                'Accept-Encoding': 'identity',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Cookie': '_cc_id=ac7355e6d06ad63ab2668abd97f648d2; FCCDCF=%5Bnull%2Cnull%2Cnull%2C%5B%22CQX_iIAQX_iIAEsACBENB9FoAP_gAEPgAATAK1JB_C_tbSFDyL53aLsEMAhHR9BIasQwAAbBA2ABTJKQIAQCgkEYFASAFCACCAAAOCTBIQIkCAAAAUCAIAAVDgBEAAwQIBAIICAEgAEAAkAIAAACCIAgEQCIAAAEEkAAmAgAAIIASQACgAAEEACBgSCQCAAAIACBACAABAIAAUAAQgQQgQAIiAAAAAEAAhAIAEEACCAQACAEAAAAAAAAAAgAAAAAAAAAABAAAAAAAQTBSD-F_a2kKHkXCuwXYIYBCuj6AA1YhgAA2CBsACmSUgQAgFJIIkCIEAIEAAEAAAQEiCQABQEBAAAIECAAAqHACIABggQCAQQMAJAAIAhIAAAAAEEQBAIgEQAAAIIIABEhAAAQQAkgAEAAAAYAECAkEgAAAAQAACAEAAEAAAAMABhAgBAAAREAAAAAAABCAQIIAAEEAgAEAIBAAA.f_wAAAAAAAA%22%2C%222~61.70.89.93.108.122.149.184.196.230.236.259.311.313.314.323.358.415.442.445.486.494.495.540.550.574.576.723.827.864.981.1029.1033.1046.1047.1048.1051.1095.1097.1126.1166.1205.1276.1301.1329.1342.1365.1415.1449.1514.1570.1577.1598.1651.1716.1725.1735.1753.1765.1870.1878.1889.1942.1958.1987.2068.2072.2074.2107.2213.2219.2223.2224.2253.2299.2328.2331.2373.2387.2415.2416.2501.2506.2526.2531.2567.2568.2571.2575.2624.2657.2677.2686.2778.2869.2878.2908.2920.2963.3005.3023.3100.3126.3219.3234.3235.3253.3309.3731.6931.8931.13731.15731.33931~dv.%22%2C%22B0E55281-FB70-4783-A1E3-06097F04877D%22%5D%5D; panoramaId_expiry=1758902600627; panoramaId=2ffced61816f32804fb6295fdd29185ca02cf622b09d5ee02c0e1c7ea8495f51; panoramaIdType=panoDevice; cto_bundle=OOS_eF9RZzJmbWFDUXIzZHNSJTJGVlRZOElQNEg2TGsyZkw0ZnJlTHBGbjlndXN2ODhIYUh3dUUya3olMkZ5aUttb1Q1THhJZE1oMU9oNVVlWENMZDVuSm5mMlFsb0F2Qm5KRzZ4b05MNEUxRXZ0eVJFNGpqQWoxVUl0UEpVJTJCTjBnV09xV05pTG50JTJCZHZqVCUyRjAlMkZ4QXZKVHFZajJNVzBUN1BmZkEzNDRjOHNsV2pWdlJwNkJIMHJKZHBEcmwwUnVVWTV2RTJTVzE; _gid=GA1.4.1855626552.1758297802; _ga_SC8PQWWTGF=GS2.1.s1758298187$o1$g1$t1758298197$j50$l0$h0; _ga_GXS04HS5MX=GS2.1.s1758298085$o5$g1$t1758298775$j60$l0$h0; __wginti1__={"m":true,"d":false,"ds":["30","1","30"],"e":1758300213188}; _ga_Z1FT2YYNFS=GS2.1.s1758297783$o5$g1$t1758300484$j58$l0$h0; FCNEC=%5B%5B%22AKsRol_VivHVE5I01CGkOEfV74MN9nZI0R0dRnsJDc-5UlFOdW0tmy8pJ-EpOPl0XuN0ZwpidZI92By40yPtJNzr697TU1hh890FLaFW2fg7aROn652M95unsblIf3eb6B9egWFnvD2QMZZk1gsODLAXHkRpcWUUDw%3D%3D%22%5D%5D; _ga_FN2KC2KY6V=GS2.1.s1758297801$o5$g1$t1758300490$j59$l0$h0; _ga=GA1.1.187767805.1757607612; __gads=ID=224e66c3cdf7e0bf:T=1757607628:RT=1758300830:S=ALNI_MZojgFlTmc_cHmQ2cSxhnAGJ1ptOw; __gpi=UID=0000128a3d5f7cd7:T=1757607628:RT=1758300830:S=ALNI_MaZecfLPXA2J-jA9anGH2GP4QX3aw'
            };

            await downloadFile(remoteUrl, localPath, headers);
            console.log(`Saved: ${localPath}`);
        }
    } catch (err) {
        console.error('Failed to download:', err.message);
    }
    next();
});

// Serve files statically
app.use(express.static(FILE_DIR));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
