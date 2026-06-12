const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');

const {
    COMMENTS_UPLOAD_DIR,
    UPLOADS_DIR,
    createCommentUploadFilename,
    ensureBaseDirs,
} = require('./data');

function registerMediaRoutes(app) {
    ensureBaseDirs();

    const commentStorage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, COMMENTS_UPLOAD_DIR),
        filename: (req, file, cb) => {
            cb(null, createCommentUploadFilename(file.originalname));
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

    app.use('/uploads', express.static(UPLOADS_DIR));
}

module.exports = {
    registerMediaRoutes,
};
