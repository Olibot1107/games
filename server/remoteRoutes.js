'use strict';

const express = require('express');
const router = express.Router();
const { getOrCreateSession, updateSession, deleteSession, getSessions, getHost, updateHost, deleteHost } = require('./data');

// Parse JSON bodies for all remote routes
// Decode raw Buffer bodies left by express.raw()
router.use((req, res, next) => {
  if (Buffer.isBuffer(req.body)) {
    try { req.body = JSON.parse(req.body.toString('utf8')); }
    catch { req.body = {}; }
  }
  next();
});
/* Session Management */
router.post('/sessions', (req, res) => {
  try {
    const { id, url, requestedBy, client, idleTimeoutMs, maxSessionMs } = req.body;
    if (!id || !url) return res.status(400).json({ ok: false, error: 'id and url required' });

    const session = {
      id,
      url,
      requestedBy: requestedBy || '',
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      client: client || {},
      idleTimeoutMs: idleTimeoutMs || 5 * 60 * 1000,
      maxSessionMs: maxSessionMs || 30 * 60 * 1000,
      hostId: null,
      offer: null,
      answer: null,
      cc: {},
      sc: {},
    };

    getOrCreateSession(id, session);
    res.json({ ok: true, data: session });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get('/sessions/:sessionId', (req, res) => {
  try {
    const session = getSessions()[req.params.sessionId];
    if (!session) return res.status(404).json({ ok: false, error: 'Session not found' });
    res.json({ ok: true, data: session });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.put('/sessions/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const updates = req.body;
    const session = getSessions()[sessionId];
    if (!session) return res.status(404).json({ ok: false, error: 'Session not found' });

    const updated = { ...session, ...updates, updatedAt: Date.now() };
    updateSession(sessionId, updated);
    res.json({ ok: true, data: updated });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.delete('/sessions/:sessionId', (req, res) => {
  try {
    deleteSession(req.params.sessionId);
    res.json({ ok: true, data: { deleted: req.params.sessionId } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* Host Discovery */
router.get('/hosts/pending', (req, res) => {
  try {
    const sessions = getSessions();
    const pending = Object.values(sessions)
      .filter(s => s.status === 'pending' && !s.hostId)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    res.json({ ok: true, data: pending });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/hosts/:hostId/status', (req, res) => {
  try {
    const { hostId } = req.params;
    const { status, pid, platform, sess, caps, startedAt, stoppedAt, stopReason } = req.body;

    const hostData = {
      id: hostId,
      status: status || 'online',
      ts: Date.now(),
      pid: pid || null,
      platform: platform || null,
      sess: sess || 0,
      caps: caps || {},
    };
    if (startedAt) hostData.startedAt = startedAt;
    if (stoppedAt) hostData.stoppedAt = stoppedAt;
    if (stopReason) hostData.stopReason = stopReason;

    updateHost(hostId, hostData);
    res.json({ ok: true, data: hostData });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.delete('/hosts/:hostId', (req, res) => {
  try {
    deleteHost(req.params.hostId);
    res.json({ ok: true, data: { deleted: req.params.hostId } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* Signaling: Offer */
router.put('/sessions/:sessionId/offer', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { offer } = req.body;
    const sessions = getSessions();
    const session = sessions[sessionId];
    if (!session) return res.status(404).json({ ok: false, error: 'Session not found' });

    session.offer = offer || null;
    session.updatedAt = Date.now();
    updateSession(sessionId, session);
    res.json({ ok: true, data: { offer: session.offer } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* Signaling: Answer */
router.put('/sessions/:sessionId/answer', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answer } = req.body;
    const sessions = getSessions();
    const session = sessions[sessionId];
    if (!session) return res.status(404).json({ ok: false, error: 'Session not found' });

    session.answer = answer || null;
    session.updatedAt = Date.now();
    updateSession(sessionId, session);
    res.json({ ok: true, data: { answer: session.answer } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* Signaling: Client ICE Candidates */
router.post('/sessions/:sessionId/candidates/client', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { key, candidate } = req.body;
    if (!key) return res.status(400).json({ ok: false, error: 'key required' });

    const sessions = getSessions();
    const session = sessions[sessionId];
    if (!session) return res.status(404).json({ ok: false, error: 'Session not found' });

    if (!session.cc) session.cc = {};
    session.cc[key] = candidate || null;
    session.updatedAt = Date.now();
    updateSession(sessionId, session);
    res.json({ ok: true, data: { cc: session.cc } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* Signaling: Server ICE Candidates */
router.post('/sessions/:sessionId/candidates/server', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { key, candidate } = req.body;
    if (!key) return res.status(400).json({ ok: false, error: 'key required' });

    const sessions = getSessions();
    const session = sessions[sessionId];
    if (!session) return res.status(404).json({ ok: false, error: 'Session not found' });

    if (!session.sc) session.sc = {};
    session.sc[key] = candidate || null;
    session.updatedAt = Date.now();
    updateSession(sessionId, session);
    res.json({ ok: true, data: { sc: session.sc } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* Get all candidates for a session */
router.get('/sessions/:sessionId/candidates', (req, res) => {
  try {
    const sessions = getSessions();
    const session = sessions[req.params.sessionId];
    if (!session) return res.status(404).json({ ok: false, error: 'Session not found' });
    res.json({ ok: true, data: { cc: session.cc || {}, sc: session.sc || {} } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
