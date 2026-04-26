document.addEventListener('DOMContentLoaded', () => {

const gamesList = document.getElementById('games-list');
const searchInput = document.getElementById('search');
const favoritesList = document.getElementById('favorites-list');
const debugPanel = document.getElementById('debug-panel');

let allGames = [];
let voteData = {};
let commentData = {};
let playData = {};
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentCommentGame = null;
const COMMENT_MIN_LENGTH = 1;
const COMMENT_MAX_LENGTH = 300;
let isSubmittingComment = false;
const CLIENT_ID_COOKIE = 'clientID';

// UID
if(!localStorage.getItem('uid')){
    localStorage.setItem('uid', Math.random().toString(36).slice(2));
}
const uid = localStorage.getItem('uid');
const clientId = getClientId();
const RESOURCE_KEY = new TextEncoder().encode('games-shell-v1');

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
}

function base64ToUint8Array(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

function xorBuffer(buffer) {
    const out = new Uint8Array(buffer.length);
    const keyLen = RESOURCE_KEY.length;
    let i = 0;

    const limit = buffer.length - 15;
    while (i < limit) {
        out[i] = buffer[i] ^ RESOURCE_KEY[(i) % keyLen];
        out[i + 1] = buffer[i + 1] ^ RESOURCE_KEY[(i + 1) % keyLen];
        out[i + 2] = buffer[i + 2] ^ RESOURCE_KEY[(i + 2) % keyLen];
        out[i + 3] = buffer[i + 3] ^ RESOURCE_KEY[(i + 3) % keyLen];
        out[i + 4] = buffer[i + 4] ^ RESOURCE_KEY[(i + 4) % keyLen];
        out[i + 5] = buffer[i + 5] ^ RESOURCE_KEY[(i + 5) % keyLen];
        out[i + 6] = buffer[i + 6] ^ RESOURCE_KEY[(i + 6) % keyLen];
        out[i + 7] = buffer[i + 7] ^ RESOURCE_KEY[(i + 7) % keyLen];
        out[i + 8] = buffer[i + 8] ^ RESOURCE_KEY[(i + 8) % keyLen];
        out[i + 9] = buffer[i + 9] ^ RESOURCE_KEY[(i + 9) % keyLen];
        out[i + 10] = buffer[i + 10] ^ RESOURCE_KEY[(i + 10) % keyLen];
        out[i + 11] = buffer[i + 11] ^ RESOURCE_KEY[(i + 11) % keyLen];
        out[i + 12] = buffer[i + 12] ^ RESOURCE_KEY[(i + 12) % keyLen];
        out[i + 13] = buffer[i + 13] ^ RESOURCE_KEY[(i + 13) % keyLen];
        out[i + 14] = buffer[i + 14] ^ RESOURCE_KEY[(i + 14) % keyLen];
        out[i + 15] = buffer[i + 15] ^ RESOURCE_KEY[(i + 15) % keyLen];
        i += 16;
    }
    while (i < buffer.length) {
        out[i] = buffer[i] ^ RESOURCE_KEY[i % keyLen];
        i++;
    }
    return out;
}

function decodeEncryptedPayload(payload) {
    const envelopeText = new TextDecoder().decode(xorBuffer(base64ToUint8Array(payload)));
    const envelope = JSON.parse(envelopeText);
    const decryptedFile = xorBuffer(base64ToUint8Array(envelope.payload));
    return new TextDecoder().decode(decryptedFile);
}

function fetchEncryptedJson(path) {
    return fetch('/api/resource', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ path })
    })
    .then(r => {
        if (!r.ok) throw new Error('Failed to fetch encrypted resource');
        return r.json();
    })
    .then(data => {
        if (!data.files || !data.files[0] || !data.files[0].payload) {
            throw new Error('Invalid encrypted response');
        }
        const jsonText = decodeEncryptedPayload(data.files[0].payload);
        return JSON.parse(jsonText);
    });
}

function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getClientId(){
    let id = getCookie(CLIENT_ID_COOKIE);
    if (!id) {
        id = "Anonymous"
    }
    return id;
}

function log(msg){
    if(debugPanel) debugPanel.textContent += "\n" + msg;
}

// ================= FAVORITES =================
function saveFavorites(){
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}

function toggleFavorite(game){
    if(favorites.includes(game)){
        favorites = favorites.filter(f => f !== game);
    } else {
        favorites.push(game);
    }
    saveFavorites();
    renderGames();
}

function renderFavorites(){
    if(!favoritesList) return;

    favoritesList.innerHTML = '';

    if(favorites.length === 0){
        favoritesList.innerHTML = '<li class="italic text-gray-500">No favorites yet.</li>';
        return;
    }

    favorites.forEach(f=>{
        const li = document.createElement('li');
        li.className = "flex justify-between";

        const a = document.createElement('a');
        a.textContent = f;
        a.href = `/good/${f}/index.html`;
        a.className = "text-blue-500 hover:underline";

        const btn = document.createElement('button');
        btn.textContent = '★';
        btn.className = "text-yellow-400";
        btn.onclick = () => toggleFavorite(f);

        li.append(a, btn);
        favoritesList.appendChild(li);
    });
}

// ================= GAME ITEM =================
function createGameItem(game, votes){
    const li = document.createElement('li');
    li.className = "flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100";

    const left = document.createElement('div');
    left.className = "flex gap-2 items-center";

    const fav = document.createElement('button');
    fav.textContent = favorites.includes(game.name) ? '★' : '☆';
    fav.className = "text-yellow-400";
    fav.onclick = () => toggleFavorite(game.name);

    const link = document.createElement('a');
    link.textContent = game.name;
    link.href = `/${game.category}/${game.name}/index.html`;
    link.className = "text-blue-500 hover:underline";
    link.onclick = (event) => {
        event.preventDefault();
        incrementPlayAndNavigate(game, link.href);
    };

    left.append(fav, link);

    const right = document.createElement('div');
    right.className = "flex gap-2 items-center";

    const up = document.createElement('button');
    const down = document.createElement('button');
    const neutralBtn = document.createElement('button');
    const commentBtn = document.createElement('button');

    up.textContent = '👍';
    down.textContent = '👎';
    neutralBtn.textContent = '✌️';
    neutralBtn.title = 'No liking';
    const commentCount = commentData[game.name]?.count || 0;
    commentBtn.textContent = `💬 ${commentCount}`;
    commentBtn.title = `${commentCount} comment${commentCount === 1 ? '' : 's'}`;

    up.className = "bg-green-200 px-2 rounded";
    down.className = "bg-red-200 px-2 rounded";
    neutralBtn.className = "bg-slate-100 px-2 rounded text-slate-700";
    commentBtn.className = "bg-blue-100 px-2 rounded text-slate-700";

    if(votes.userVote==='up') up.classList.add('ring-2','ring-green-500');
    if(votes.userVote==='down') down.classList.add('ring-2','ring-red-500');
    if(votes.userVote===null) neutralBtn.classList.add('ring-2','ring-slate-400');

    up.onclick = () => sendVote(game.name,'up');
    down.onclick = () => sendVote(game.name,'down');
    neutralBtn.onclick = () => sendVote(game.name,'none');
    commentBtn.onclick = () => openCommentPanel(game.name);

    const playCountBtn = document.createElement('button');
    playCountBtn.type = 'button';
    playCountBtn.className = 'bg-slate-100 px-2 rounded text-slate-700';
    playCountBtn.textContent = `🎮 ${playData[game.name] || 0}`;
    playCountBtn.title = `Played ${playData[game.name] || 0} time${(playData[game.name] || 0) === 1 ? '' : 's'}`;
    playCountBtn.onclick = () => openPlayModal(game.name);

    const count = document.createElement('div');
    count.innerHTML = `
        <span class="text-green-600">${votes.up}</span> 👍 
        <span class="text-red-600">${votes.down}</span> 👎
    `;

    right.append(up, down, neutralBtn, commentBtn, count, playCountBtn);
    li.append(left, right);

    return li;
}

// ================= RENDER =================
function renderGames(){
    if(!gamesList) return;

    const search = searchInput.value.toLowerCase();

    let filtered = allGames.filter(g =>
        g.name.toLowerCase().includes(search)
    );

    filtered.sort((a,b)=>{
        const aV = voteData[a.name] || {up:0,down:0};
        const bV = voteData[b.name] || {up:0,down:0};
        return (bV.up - bV.down) - (aV.up - aV.down);
    });

    gamesList.innerHTML = '';

    if(filtered.length===0){
        gamesList.innerHTML = '<li>No games found</li>';
        return;
    }

    filtered.forEach(g=>{
        gamesList.appendChild(
            createGameItem(
                g,
                voteData[g.name] || {up:0,down:0,userVote:null}
            )
        );
    });
}

// ================= VOTES =================
function fetchVotes(){
    fetch('/votes.json')
    .then(r=>r.json())
    .then(data=>{
        voteData = {};

        allGames.forEach(g=>{
            const raw = data[g.name] || {};

            let up = 0;
            let down = 0;

            Object.values(raw).forEach(v=>{
                if(v === 'up') up++;
                if(v === 'down') down++;
            });

            voteData[g.name] = {
                up,
                down,
                userVote: raw[uid] || null
            };
        });

        renderGames();
        log('votes loaded');
    })
    .catch(e=>log(e.message));
}

function fetchCommentCounts(){
    fetchEncryptedJson('comments.json')
    .then(data=>{
        commentData = {};
        const comments = data || {};
        Object.entries(comments).forEach(([game, list]) => {
            commentData[game] = { count: Array.isArray(list) ? list.length : 0 };
        });
        renderGames();
    })
    .catch(e=>{
        log('Comment counts error: ' + e.message);
    });
}

function fetchPlayCounts(){
    fetchEncryptedJson('plays.json')
    .then(data=>{
        const counts = {};
        Object.entries(data || {}).forEach(([game, value]) => {
            if (typeof value === 'number') {
                counts[game] = value;
            } else if (typeof value === 'object' && value !== null) {
                counts[game] = Number(value.total) || Object.values(value.clients || {}).reduce((sum, v) => sum + Number(v || 0), 0);
            } else {
                counts[game] = 0;
            }
        });
        playData = counts;
        renderGames();
    })
    .catch(e=>{
        log('Play counts error: ' + e.message);
    });
}

function incrementPlayAndNavigate(game, href){
    fetch('/api/plays', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ game: game.name, clientId })
    })
    .then(() => {
        fetchPlayCounts();
        window.location.href = href;
    })
    .catch(() => {
        window.location.href = href;
    });
}

function openPlayModal(game){
    const modal = document.getElementById('plays-modal');
    const title = document.getElementById('plays-modal-title');
    const totalLabel = document.getElementById('plays-modal-total');
    const list = document.getElementById('plays-list');
    if (!modal || !title || !totalLabel || !list) return;

    title.textContent = `Players for ${game}`;
    totalLabel.textContent = 'Loading...';
    list.innerHTML = '<div class="text-gray-500 italic">Loading play history...</div>';
    modal.classList.remove('hidden');
    loadPlayDetails(game);
}

function closePlayModal(){
    const modal = document.getElementById('plays-modal');
    if (!modal) return;
    modal.classList.add('hidden');
}

function loadPlayDetails(game){
    const totalLabel = document.getElementById('plays-modal-total');
    const list = document.getElementById('plays-list');
    if (!totalLabel || !list) return;

    fetchEncryptedJson('plays.json')
    .then(data => {
        const record = data && data[game];
        const detail = (record && record.clients) || {};
        const total = record && typeof record.total !== 'undefined'
            ? Number(record.total)
            : Object.values(detail).reduce((sum, value) => sum + Number(value || 0), 0);

        totalLabel.textContent = `Total plays: ${total}`;
        list.innerHTML = '';

        const rows = Object.entries(detail).sort((a,b)=>b[1]-a[1]);
        if (!rows.length) {
            list.innerHTML = '<div class="text-gray-500 italic">Nobody has played this yet.</div>';
            return;
        }

        rows.forEach(([id, count]) => {
            const item = document.createElement('div');
            item.className = 'p-3 border rounded-lg bg-slate-50 mb-2';
            item.innerHTML = `
                <div class="flex items-center justify-between text-sm text-slate-700">
                    <span>${escapeHtml(id)}</span>
                    <span>${count} time${count === 1 ? '' : 's'}</span>
                </div>
            `;
            list.appendChild(item);
        });
    })
    .catch(e => {
        list.innerHTML = `<div class="text-red-500">Unable to load plays.</div>`;
        totalLabel.textContent = '';
        log('Play detail error: ' + e.message);
    });
}

function escapeHtml(text){
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function openCommentPanel(game){
    currentCommentGame = game;
    const modal = document.getElementById('comments-modal');
    const title = document.getElementById('comments-modal-title');
    const feedback = document.getElementById('comments-feedback');
    const countLabel = document.getElementById('comments-count');
    const input = document.getElementById('comments-input');

    if (!modal || !title || !feedback || !countLabel || !input) return;

    title.textContent = `Comments for ${game}`;
    countLabel.textContent = 'Loading comments...';
    feedback.textContent = '';
    input.value = '';
    updateCommentInputHint(0);
    modal.classList.remove('hidden');
    loadComments(game);
}

function closeCommentPanel(){
    const modal = document.getElementById('comments-modal');
    if (!modal) return;
    modal.classList.add('hidden');
}

function loadComments(game){
    const list = document.getElementById('comments-list');
    const countLabel = document.getElementById('comments-count');
    if (!list || !countLabel) return;

    list.innerHTML = '<div class="text-gray-500 italic">Loading comments...</div>';
    countLabel.textContent = 'Loading comments...';

    fetchEncryptedJson('comments.json')
    .then(data => {
        const comments = (data && data[game]) || [];
        list.innerHTML = '';
        countLabel.textContent = `${comments.length} comment${comments.length === 1 ? '' : 's'}`;

        if (comments.length === 0) {
            list.innerHTML = '<div class="text-gray-500 italic">No comments yet. Be the first!</div>';
            return;
        }

        comments.sort((a,b)=>b.ts - a.ts).forEach(c => {
            const isOwnComment = c.uid === uid;
            const item = document.createElement('div');
            item.className = 'p-3 border rounded-lg bg-slate-50';
            item.innerHTML = `
                <div class="flex items-start justify-between gap-2 text-xs text-slate-500 mb-2">
                    <div class="space-x-2">
                        <span class="font-semibold text-slate-700">${escapeHtml(isOwnComment ? 'You' : (c.author || 'Guest'))}</span>
                        <span>${new Date(c.ts).toLocaleString()}</span>
                    </div>
                    ${isOwnComment ? '<button data-comment-id="' + escapeHtml(c.id) + '" class="comments-delete text-red-500 text-xs hover:underline">Delete</button>' : ''}
                </div>
                <div class="text-sm text-slate-800">${escapeHtml(c.text)}</div>
            `;
            list.appendChild(item);
        });

        list.querySelectorAll('.comments-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteComment(btn.dataset.commentId));
        });
    })
    .catch(e=>{
        list.innerHTML = `<div class="text-red-500">Failed loading comments.</div>`;
        log('Comment load error: ' + e.message);
    });
}

function submitComment(){
    const textInput = document.getElementById('comments-input');
    const feedback = document.getElementById('comments-feedback');
    const submitButton = document.getElementById('comments-submit');
    if (!currentCommentGame || !textInput || !feedback || !submitButton) return;

    const text = textInput.value.trim();
    if (text.length < COMMENT_MIN_LENGTH) {
        feedback.textContent = 'Type a comment before submitting.';
        feedback.className = 'text-xs text-red-500';
        return;
    }
    if (text.length > COMMENT_MAX_LENGTH) {
        feedback.textContent = `Comments are limited to ${COMMENT_MAX_LENGTH} characters.`;
        feedback.className = 'text-xs text-red-500';
        return;
    }

    if (isSubmittingComment) return;
    isSubmittingComment = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Posting...';
    feedback.textContent = '';

    fetch('/api/comments', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            game: currentCommentGame,
            text,
            uid,
            author: `Guest-${uid.slice(0,6)}`
        })
    })
    .then(r => r.json())
    .then(result => {
        if (result.success) {
            fetchCommentCounts();
            loadComments(currentCommentGame);
            textInput.value = '';
            updateCommentInputHint(0);
            feedback.textContent = 'Comment posted successfully.';
            feedback.className = 'text-xs text-green-600';
        } else {
            feedback.textContent = result.error || 'Comment failed.';
            feedback.className = 'text-xs text-red-500';
        }
    })
    .catch(e => {
        feedback.textContent = 'Unable to post comment.';
        feedback.className = 'text-xs text-red-500';
        log('Comment submit error: ' + e.message);
    })
    .finally(() => {
        isSubmittingComment = false;
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    });
}

// ================= VOTE =================
function deleteComment(commentId){
    if (!currentCommentGame || !commentId) return;

    fetch('/api/comments', {
        method: 'DELETE',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            game: currentCommentGame,
            id: commentId,
            uid
        })
    })
    .then(r => r.json())
    .then(result => {
        if (result.success) {
            fetchCommentCounts();
            loadComments(currentCommentGame);
            log('Comment deleted');
        } else {
            log(result.error || 'Unable to delete comment');
        }
    })
    .catch(e => log('Delete comment error: ' + e.message));
}

function sendVote(game, vote){

    if (game === 'five-nights-at-epsteins' && vote === 'down') {
        alert('bad boy not happening');
        return;
    }

    const current = voteData[game]?.userVote;
    if(current === vote) return;

    if(current === 'up') voteData[game].up--;
    if(current === 'down') voteData[game].down--;

    if(vote === 'up') voteData[game].up++;
    if(vote === 'down') voteData[game].down++;

    voteData[game].userVote = vote === 'none' ? null : vote;

    renderGames();

    fetch('/api/vote',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            game,
            uid,
            vote,
        })
    }).catch(e=>log(e.message));
}

// ================= INIT =================
fetch('./list.json')
.then(r=>r.json())
.then(data=>{
    allGames = [
        ...(data.good||[]).map(n=>({name:n,category:'good'})),
        ...(data.nova||[]).map(n=>({name:n,category:'nova'}))
    ];

    renderFavorites();
    fetchVotes();
    fetchCommentCounts();
    fetchPlayCounts();
});

if(searchInput){
    searchInput.addEventListener('input', renderGames);
}

const commentsModal = document.getElementById('comments-modal');
const commentsClose = document.getElementById('comments-close');
const commentsSubmit = document.getElementById('comments-submit');

if (commentsClose) commentsClose.addEventListener('click', closeCommentPanel);
if (commentsSubmit) commentsSubmit.addEventListener('click', submitComment);
if (commentsModal) {
    commentsModal.addEventListener('click', (event) => {
        if (event.target === commentsModal) closeCommentPanel();
    });
}

const commentsInput = document.getElementById('comments-input');
const commentsHint = document.getElementById('comments-hint');
const playsModal = document.getElementById('plays-modal');
const playsClose = document.getElementById('plays-close');

if (commentsClose) commentsClose.addEventListener('click', closeCommentPanel);
if (commentsSubmit) commentsSubmit.addEventListener('click', submitComment);
if (commentsModal) {
    commentsModal.addEventListener('click', (event) => {
        if (event.target === commentsModal) closeCommentPanel();
    });
}
if (playsClose) playsClose.addEventListener('click', closePlayModal);
if (playsModal) {
    playsModal.addEventListener('click', (event) => {
        if (event.target === playsModal) closePlayModal();
    });
}

if (commentsInput) {
    commentsInput.addEventListener('input', () => {
        updateCommentInputHint(commentsInput.value.length);
    });
}

function updateCommentInputHint(length) {
    if (!commentsHint) return;
    const remaining = COMMENT_MAX_LENGTH - length;
    commentsHint.textContent = `${remaining} characters remaining`;
    commentsHint.className = remaining < 0 ? 'text-xs text-red-500' : 'text-xs text-slate-500';
}

updateCommentInputHint(0);

});