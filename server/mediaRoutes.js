const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');

const {
    COMMENTS_UPLOAD_DIR,
    PHOTO_UPLOAD_DIR,
    UPLOADS_DIR,
    createCommentUploadFilename,
    ensureBaseDirs,
} = require('./data');

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

function registerMediaRoutes(app) {
    ensureBaseDirs();

    const photoStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            if (!fs.existsSync(PHOTO_UPLOAD_DIR)) fs.mkdirSync(PHOTO_UPLOAD_DIR, { recursive: true });
            cb(null, PHOTO_UPLOAD_DIR);
        },
        filename: (req, file, cb) => {
            if (!req.fileIndex) req.fileIndex = 0;
            const hash = req.body.hashes[req.fileIndex++];
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, `${hash}${ext}`);
        }
    });

    const commentStorage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, COMMENTS_UPLOAD_DIR),
        filename: (req, file, cb) => {
            cb(null, createCommentUploadFilename(file.originalname));
        }
    });

    const photoUpload = multer({
        storage: photoStorage,
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Only image uploads are allowed'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 20 * 1024 * 1024,
            files: 3
        }
    });

    const commentUpload = multer({
        storage: commentStorage,
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Only image uploads are allowed'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
            files: 5
        }
    });

    app.post('/api/photos/upload', photoUpload.array('photos', 3), (req, res) => {
        const files = req.files || [];
        if (!files.length) {
            return res.status(400).json({ error: 'No photos uploaded' });
        }

        const uploaded = files.map(file => ({
            originalName: file.originalname,
            url: `/uploads/photos/${encodeURIComponent(file.filename)}`,
            uploadedAt: Date.now()
        }));

        res.json({ success: true, photos: uploaded });
    });

    app.post('/api/comments/upload', commentUpload.array('photos', 5), (req, res) => {
        const files = req.files || [];
        if (!files.length) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        const uploaded = files.map(file => ({
            originalName: file.originalname,
            url: `/uploads/comments/${encodeURIComponent(file.filename)}`,
            uploadedAt: Date.now()
        }));

        res.json({ success: true, photos: uploaded });
    });

    app.get('/api/photos', async (req, res) => {
        try {
            if (!fs.existsSync(PHOTO_UPLOAD_DIR)) {
                return res.json({ photos: [] });
            }

            const names = await fs.promises.readdir(PHOTO_UPLOAD_DIR);
            const photos = await Promise.all(names.map(async (filename) => {
                const fullPath = path.join(PHOTO_UPLOAD_DIR, filename);
                const stat = await fs.promises.stat(fullPath);
                return {
                    originalName: filename,
                    url: `/uploads/photos/${encodeURIComponent(filename)}`,
                    uploadedAt: stat.mtimeMs
                };
            }));

            photos.sort((a, b) => b.uploadedAt - a.uploadedAt);
            res.json({ photos });
        } catch (err) {
            console.error('Failed to list photo uploads', err);
            res.json({ photos: [] });
        }
    });

    app.get('/api/photos/download', async (req, res) => {
        try {
            if (!fs.existsSync(PHOTO_UPLOAD_DIR)) {
                return res.status(404).json({ error: 'No photos found' });
            }

            const names = await fs.promises.readdir(PHOTO_UPLOAD_DIR);
            if (!names.length) {
                return res.status(404).json({ error: 'No photos found' });
            }

            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', 'attachment; filename="photos.zip"');

            await loadArchiver();
            const archive = createArchive('zip', { zlib: { level: 9 } });

            archive.on('error', (err) => {
                throw err;
            });

            archive.pipe(res);

            names.forEach(filename => {
                const filePath = path.join(PHOTO_UPLOAD_DIR, filename);
                archive.file(filePath, { name: filename });
            });

            archive.finalize();
        } catch (err) {
            console.error('Failed to create zip', err);
            res.status(500).json({ error: 'Failed to create download' });
        }
    });

    app.use('/uploads', express.static(UPLOADS_DIR));
}

module.exports = {
    registerMediaRoutes,
};
