const {
    COMMENTS_FILE,
    PLAYS_FILE,
    DATA_FILE,
    VOTES_FILE,
    ensureBaseDirs,
    parseJsonBody,
    readComments,
    readPlays,
    readData,
    readVotes,
    writeComments,
    writeData,
    writePlays,
    writeVotes,
} = require('./data');

function registerSocialRoutes(app) {
    ensureBaseDirs();

    if (!require('fs').existsSync(VOTES_FILE)) require('fs').writeFileSync(VOTES_FILE, '{}', 'utf8');
    if (!require('fs').existsSync(COMMENTS_FILE)) require('fs').writeFileSync(COMMENTS_FILE, '{}', 'utf8');
    if (!require('fs').existsSync(PLAYS_FILE)) require('fs').writeFileSync(PLAYS_FILE, '{}', 'utf8');
    if (!require('fs').existsSync(DATA_FILE)) require('fs').writeFileSync(DATA_FILE, '{"totalBytes":0,"totalRequests":0}', 'utf8');

    app.get('/api/data', (req, res) => {
        const data = readData();
        const gb = (data.totalBytes / (1024 * 1024 * 1024)).toFixed(2);
        res.json({ totalGB: gb, totalRequests: data.totalRequests });
    });

    app.post('/api/vote', (req, res) => {
        const data = parseJsonBody(req);
        if (!data) return res.status(400).json({ error: 'Invalid JSON' });

        const { game, vote, uid } = data;
        if (!game || typeof vote === 'undefined' || !uid) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        const votes = readVotes();
        if (!votes[game]) votes[game] = {};

        if (vote === 'none') {
            delete votes[game][uid];
        } else {
            votes[game][uid] = vote;
        }

        writeVotes(votes);
        res.json({ success: true });
    });

    app.get('/api/comments', (req, res) => {
        const comments = readComments();
        const game = req.query.game;

        if (game) {
            return res.json({ comments: comments[game] || [] });
        }

        const counts = Object.keys(comments).reduce((acc, key) => {
            acc[key] = Array.isArray(comments[key]) ? comments[key].length : 0;
            return acc;
        }, {});

        res.json({ counts });
    });

    app.get('/api/plays', (req, res) => {
        const plays = readPlays();
        const game = req.query.game;

        if (game) {
            const gameRecord = plays[game];
            if (!gameRecord) {
                return res.json({ total: 0, detail: {} });
            }

            if (typeof gameRecord === 'number') {
                return res.json({ total: gameRecord, detail: {} });
            }

            const detail = gameRecord.clients || {};
            const total = Number(gameRecord.total) || Object.values(detail).reduce((sum, value) => sum + Number(value), 0);

            return res.json({ total, detail });
        }

        const counts = Object.keys(plays).reduce((acc, key) => {
            const gameRecord = plays[key];
            if (typeof gameRecord === 'number') {
                acc[key] = Number(gameRecord);
            } else {
                acc[key] = Number(gameRecord.total) || Object.values(gameRecord.clients || {}).reduce((sum, value) => sum + Number(value), 0);
            }
            return acc;
        }, {});
        res.json({ counts });
    });

    app.post('/api/plays', (req, res) => {
        const data = parseJsonBody(req);
        if (!data || !data.game || !data.clientId) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        const game = data.game.toString();
        const clientId = data.clientId.toString();
        const plays = readPlays();
        const record = typeof plays[game] === 'object' && plays[game] !== null ? plays[game] : { total: 0, clients: {} };

        record.clients[clientId] = (Number(record.clients[clientId]) || 0) + 1;
        record.total = (Number(record.total) || 0) + 1;
        plays[game] = record;
        writePlays(plays);

        res.json({ success: true, count: record.total });
    });

    app.post('/api/comments', (req, res) => {
        const data = parseJsonBody(req);
        if (!data) return res.status(400).json({ error: 'Invalid JSON' });

        const { game, text, uid, author, clientId, parentId, images } = data;
        if (!game || !text || !uid || !clientId) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        const trimmedText = text.toString().trim();
        if (trimmedText.length < 1 || trimmedText.length > 300) {
            return res.status(400).json({ error: 'Comment must be 1-300 characters' });
        }

        const comments = readComments();
        if (!comments[game]) comments[game] = [];

        if (parentId && typeof parentId === 'string') {
            const parentComment = comments[game].find(c => c.id === parentId);
            if (!parentComment) {
                return res.status(400).json({ error: 'Parent comment not found' });
            }
            if (parentComment.parentId) {
                return res.status(400).json({ error: 'Cannot reply to a reply' });
            }
        }

        const ts = Date.now();
        const id = `${clientId}_${ts}`;

        const commentData = {
            id,
            uid,
            author: author ? author.toString().slice(0, 32) : `User-${uid.slice(0, 6)}`,
            text: trimmedText,
            ts,
            images: Array.isArray(images) ? images.slice(0, 5) : [],
            votes: {}
        };

        if (typeof parentId === 'string') {
            commentData.parentId = parentId;
        }

        comments[game].push(commentData);

        writeComments(comments);
        res.json({ success: true, id });
    });

    app.put('/api/comments', (req, res) => {
        const data = parseJsonBody(req);
        if (!data) return res.status(400).json({ error: 'Invalid JSON' });

        const { game, id, text, uid, images } = data;
        if (!game || !id || !text || !uid) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        const trimmedText = text.toString().trim();
        if (trimmedText.length < 1 || trimmedText.length > 300) {
            return res.status(400).json({ error: 'Comment must be 1-300 characters' });
        }

        const comments = readComments();
        const gameComments = comments[game];
        if (!Array.isArray(gameComments)) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const comment = gameComments.find(c => c.id === id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        if (comment.uid !== uid) {
            return res.status(403).json({ error: 'Not allowed' });
        }

        comment.text = trimmedText;
        comment.edited = true;
        comment.editedTs = Date.now();
        if (Array.isArray(images)) {
            comment.images = images.slice(0, 5);
        }

        writeComments(comments);
        res.json({ success: true });
    });

    app.delete('/api/comments', (req, res) => {
        const data = parseJsonBody(req);
        if (!data) return res.status(400).json({ error: 'Invalid JSON' });

        const { game, id, uid } = data;
        if (!game || !id || !uid) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        const comments = readComments();
        const gameComments = comments[game];
        if (!Array.isArray(gameComments)) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const index = gameComments.findIndex(c => c.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        if (gameComments[index].uid !== uid) {
            return res.status(403).json({ error: 'Not allowed' });
        }

        gameComments.splice(index, 1);
        comments[game] = gameComments;
        writeComments(comments);
        res.json({ success: true });
    });

    app.post('/api/comments/vote', (req, res) => {
        const data = parseJsonBody(req);
        if (!data) return res.status(400).json({ error: 'Invalid JSON' });

        const { game, commentId, uid } = data;
        if (!game || !commentId || !uid) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        const comments = readComments();
        const gameComments = comments[game];
        if (!Array.isArray(gameComments)) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const comment = gameComments.find(c => c.id === commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (!comment.votes) {
            comment.votes = {};
        }

        if (comment.votes[uid] === 'up') {
            delete comment.votes[uid];
        } else {
            comment.votes[uid] = 'up';
        }

        writeComments(comments);
        res.json({ success: true });
    });
}

module.exports = {
    registerSocialRoutes,
};
