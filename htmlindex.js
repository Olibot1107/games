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
let selectedImages = [];
const CLIENT_ID_COOKIE = 'clientID';

// UID
if(!localStorage.getItem('uid')){
    localStorage.setItem('uid', Math.random().toString(36).slice(2));
}
const uid = localStorage.getItem('uid');
const clientId = getClientId();

// Check for reload from game
if (performance.getEntriesByType('navigation')[0].type === 'reload' && document.referrer) {
    try {
        const url = new URL(document.referrer);
        const match = url.pathname.match(/^\/good\/([^\/]+)\/index\.html$/);
        if (match) {
            const game = match[1];
            fetch('/api/plays', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ game, clientId })
            }).then(() => {
                fetchPlayCounts();
            }).catch(() => {});
        }
    } catch (e) {
        // ignore
    }
}
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
        const aComments = commentData[a.name]?.count || 0;
        const bComments = commentData[b.name]?.count || 0;
        const aPlays = playData[a.name] || 0;
        const bPlays = playData[b.name] || 0;
        const aScore = (aV.up - aV.down) + aComments + Math.floor(aPlays / 30);
        const bScore = (bV.up - bV.down) + bComments + Math.floor(bPlays / 30);
        return bScore - aScore;
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

function timeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return seconds === 1 ? '1s ago' : `${seconds}s ago`;
    if (minutes < 60) return minutes === 1 ? '1m ago' : `${minutes}m ago`;
    if (hours < 24) return hours === 1 ? '1h ago' : `${hours}h ago`;
    if (days < 7) return days === 1 ? '1d ago' : `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
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
    selectedImages = [];
    updateImagePreview();
    updateCommentInputHint(0);
    modal.classList.remove('hidden');
    loadComments(game);
}

function closeCommentPanel(){
    const modal = document.getElementById('comments-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    selectedImages = [];
    updateImagePreview();
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

        // Group comments by parentId
        const topLevelComments = [];
        const replies = {};

        comments.forEach(c => {
            const parentId = (c.parentId && typeof c.parentId === 'string') ? c.parentId : null;
            if (parentId) {
                if (!replies[parentId]) replies[parentId] = [];
                replies[parentId].push(c);
            } else {
                topLevelComments.push(c);
            }
        });

        // Sort top-level comments by timestamp (newest first)
        topLevelComments.sort((a,b)=>b.ts - a.ts);

        topLevelComments.forEach(c => {
            const commentElement = createCommentElement(c, replies[c.id] || []);
            list.appendChild(commentElement);
        });
    })
    .catch(e=>{
        list.innerHTML = `<div class="text-red-500">Failed loading comments.</div>`;
        log('Comment load error: ' + e.message);
    });
}

function startEditComment(commentId, commentElement) {
    const textDiv = commentElement.querySelector('.text-sm');
    if (!textDiv) return;

    const currentText = textDiv.textContent;
    const input = document.createElement('textarea');
    input.value = currentText;
    input.rows = 3;
    input.className = 'w-full rounded border border-slate-300 px-2 py-1 text-sm';
    input.maxLength = COMMENT_MAX_LENGTH;

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 mr-2';
    saveBtn.onclick = () => saveEditComment(commentId, input.value.trim(), commentElement, textDiv, input, actionsDiv);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'bg-gray-500 text-white text-xs px-3 py-1 rounded hover:bg-gray-600';
    cancelBtn.onclick = () => cancelEdit(textDiv, input, actionsDiv);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'mt-2';
    actionsDiv.appendChild(saveBtn);
    actionsDiv.appendChild(cancelBtn);

    textDiv.replaceWith(input);
    input.focus();
    input.parentNode.appendChild(actionsDiv);
}

function saveEditComment(commentId, newText, commentElement, originalTextDiv, input, actionsDiv) {
    if (newText.length < COMMENT_MIN_LENGTH || newText.length > COMMENT_MAX_LENGTH) {
        alert('Comment must be 1-300 characters');
        return;
    }

    const body = {
        game: currentCommentGame,
        id: commentId,
        text: newText,
        uid
    };

    fetch('/api/comments', {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(body)
    })
    .then(r => r.json())
    .then(result => {
        if (result.success) {
            originalTextDiv.textContent = newText;
            cancelEdit(originalTextDiv, input, actionsDiv);
            fetchCommentCounts();
            loadComments(currentCommentGame);
        } else {
            alert(result.error || 'Failed to edit comment');
        }
    })
    .catch(e => {
        alert('Unable to edit comment');
        log('Edit comment error: ' + e.message);
    });
}

function cancelEdit(originalTextDiv, input, actionsDiv) {
    input.replaceWith(originalTextDiv);
    actionsDiv.remove();
}

function startReplyComment(parentId, commentElement) {
    // Find the parent comment to display who we're replying to
    let parentComment = null;
    fetchEncryptedJson('comments.json')
    .then(data => {
        const comments = (data && data[currentCommentGame]) || [];
        parentComment = comments.find(c => c.id === parentId);
        
        const replyInput = document.createElement('div');
        replyInput.className = 'mt-3 ml-6 p-3 border-l-4 border-green-400 rounded bg-green-50';
        
        let parentPreview = '';
        if (parentComment) {
            const parentAuthor = parentComment.uid === uid ? 'You' : (parentComment.author || 'Guest');
            const textPreview = parentComment.text.slice(0, 50) + (parentComment.text.length > 50 ? '...' : '');
            parentPreview = `<div class="text-xs text-slate-600 mb-2 bg-white p-2 rounded border-l-2 border-green-400"><strong>Replying to ${escapeHtml(parentAuthor)}:</strong> ${escapeHtml(textPreview)}</div>`;
        }
        
        replyInput.innerHTML = `
            ${parentPreview}
            <textarea rows="3" maxlength="300" class="w-full rounded border border-slate-300 px-2 py-1 text-sm mb-2 reply-textarea" placeholder="Write a reply..."></textarea>
            <div class="mb-2">
                <input type="file" accept="image/*" multiple class="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-green-100 file:text-green-700 reply-images">
                <div class="flex flex-wrap gap-2 mt-1 reply-preview"></div>
            </div>
            <div class="flex gap-2">
                <button class="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 reply-submit">Reply</button>
                <button class="bg-gray-500 text-white text-xs px-3 py-1 rounded hover:bg-gray-600 reply-cancel">Cancel</button>
            </div>
        `;

        const textarea = replyInput.querySelector('.reply-textarea');
        const imageInput = replyInput.querySelector('.reply-images');
        const submitBtn = replyInput.querySelector('.reply-submit');
        const cancelBtn = replyInput.querySelector('.reply-cancel');
        const preview = replyInput.querySelector('.reply-preview');
        let replyImages = [];

        imageInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            const maxSize = 5 * 1024 * 1024;
            
            const validFiles = files.filter(file => {
                if (!file.type.startsWith('image/')) return false;
                if (file.size > maxSize) return false;
                return true;
            });
            
            replyImages = validFiles;
            updateReplyPreview(preview, replyImages);
        });

        submitBtn.onclick = async () => {
            const text = textarea.value.trim();
            if (text.length < COMMENT_MIN_LENGTH) {
                alert('Type a reply before submitting.');
                return;
            }
            if (text.length > COMMENT_MAX_LENGTH) {
                alert(`Replies are limited to ${COMMENT_MAX_LENGTH} characters.`);
                return;
            }

            submitReply(text, parentId, replyInput, replyImages);
        };

        cancelBtn.onclick = () => replyInput.remove();

        commentElement.appendChild(replyInput);
        textarea.focus();
    })
    .catch(e => {
        log('Error loading parent comment: ' + e.message);
    });
}

function updateReplyPreview(preview, images) {
    preview.innerHTML = '';
    images.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'relative inline-block';
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.className = 'w-12 h-12 object-cover rounded border';
        const btn = document.createElement('button');
        btn.className = 'absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-xs';
        btn.textContent = '×';
        btn.onclick = (e) => {
            e.preventDefault();
            images.splice(index, 1);
            updateReplyPreview(preview, images);
        };
        item.appendChild(img);
        item.appendChild(btn);
        preview.appendChild(item);
    });
}

function submitReply(text, parentId, replyInput, replyImages) {
    if (isSubmittingComment) return;
    isSubmittingComment = true;

    (async () => {
        try {
            let imageUrls = [];
            if (replyImages && replyImages.length > 0) {
                const formData = new FormData();
                replyImages.forEach(file => formData.append('photos', file));
                
                const response = await fetch('/api/comments/upload', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (result.success) {
                    imageUrls = result.photos.map(photo => photo.url);
                } else {
                    throw new Error(result.error || 'Image upload failed');
                }
            }

            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    game: currentCommentGame,
                    text,
                    uid,
                    author: `Guest-${uid.slice(0,6)}`,
                    clientId,
                    parentId,
                    images: imageUrls
                })
            });

            const result = await response.json();
            if (result.success) {
                fetchCommentCounts();
                loadComments(currentCommentGame);
                replyInput.remove();
            } else {
                alert(result.error || 'Reply failed.');
            }
        } catch (error) {
            alert('Unable to post reply: ' + error.message);
            log('Reply submit error: ' + error.message);
        } finally {
            isSubmittingComment = false;
        }
    })();
}

function createCommentElement(comment, replies = []) {
    const isOwnComment = comment.uid === uid;
    const isReply = comment.parentId && typeof comment.parentId === 'string';
    const item = document.createElement('div');
    item.className = 'p-3 border rounded-lg bg-slate-50 mb-3';

    const header = document.createElement('div');
    header.className = 'flex items-start justify-between gap-2 text-xs text-slate-500 mb-2';

    const authorTime = document.createElement('div');
    authorTime.className = 'space-x-2 flex items-center';
    const voteCount = comment.votes ? Object.values(comment.votes).filter(v => v === 'up').length : 0;
    authorTime.innerHTML = `
        <span class="font-semibold text-slate-700">${escapeHtml(isOwnComment ? 'You' : (comment.author || 'Guest'))}</span>
        <span>${timeAgo(comment.ts)}</span>
        ${comment.edited ? '<span class="text-slate-400">(edited)</span>' : ''}
        <span class="text-slate-600">👍 ${voteCount}</span>
    `;

    const actions = document.createElement('div');
    actions.className = 'flex gap-2';

    // Upvote button
    const upvoteBtn = document.createElement('button');
    const userVote = comment.votes && comment.votes[uid];
    upvoteBtn.textContent = userVote === 'up' ? '👍' : '🤍';
    upvoteBtn.className = userVote === 'up' ? 'text-blue-500 text-xs hover:underline font-bold' : 'text-slate-400 text-xs hover:text-blue-500';
    upvoteBtn.onclick = () => voteComment(currentCommentGame, comment.id, uid);
    actions.appendChild(upvoteBtn);

    if (isOwnComment) {
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'text-blue-500 text-xs hover:underline';
        editBtn.onclick = () => startEditComment(comment.id, item);
        actions.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'text-red-500 text-xs hover:underline';
        deleteBtn.onclick = () => deleteComment(comment.id);
        actions.appendChild(deleteBtn);
    }

    // Only add reply button if this is not already a reply
    if (!isReply) {
        const replyBtn = document.createElement('button');
        replyBtn.textContent = 'Reply';
        replyBtn.className = 'text-green-500 text-xs hover:underline';
        replyBtn.onclick = () => startReplyComment(comment.id, item);
        actions.appendChild(replyBtn);
    }

    header.appendChild(authorTime);
    header.appendChild(actions);

    const textDiv = document.createElement('div');
    textDiv.className = 'text-sm text-slate-800 mb-2';
    textDiv.textContent = comment.text;

    // Add images if any
    if (comment.images && comment.images.length > 0) {
        const imagesDiv = document.createElement('div');
        imagesDiv.className = 'flex flex-wrap gap-2 mb-2';
        comment.images.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.className = 'max-w-32 max-h-32 object-cover rounded border cursor-pointer';
            img.onclick = () => window.open(imageUrl, '_blank');
            imagesDiv.appendChild(img);
        });
        textDiv.appendChild(imagesDiv);
    }

    item.appendChild(header);
    item.appendChild(textDiv);

    // Add replies
    if (replies.length > 0) {
        replies.sort((a,b)=>a.ts - b.ts); // Oldest first for replies
        const repliesContainer = document.createElement('div');
        repliesContainer.className = 'ml-6 mt-3 space-y-2 border-l-2 border-slate-200 pl-4';

        replies.forEach(reply => {
            const replyElement = createCommentElement(reply, []); // Replies don't have nested replies for now
            replyElement.className = 'p-2 border rounded bg-slate-100';
            repliesContainer.appendChild(replyElement);
        });

        item.appendChild(repliesContainer);
    }

    return item;
}

function submitComment(parentId = null, retryCount = 0){
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

    (async () => {
        try {
            let imageUrls = [];
            if (selectedImages.length > 0) {
                try {
                    feedback.textContent = 'Uploading images...';
                    imageUrls = await uploadImages();
                } catch (imgError) {
                    feedback.textContent = 'Warning: Image upload failed, posting comment without images.';
                    feedback.className = 'text-xs text-yellow-600';
                    imageUrls = [];
                }
            }

            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    game: currentCommentGame,
                    text,
                    uid,
                    author: `Guest-${uid.slice(0,6)}`,
                    clientId,
                    parentId: parentId || null,
                    images: imageUrls
                })
            });

            const result = await response.json();
            if (result.success) {
                fetchCommentCounts();
                loadComments(currentCommentGame);
                textInput.value = '';
                selectedImages = [];
                updateImagePreview();
                updateCommentInputHint(0);
                feedback.textContent = 'Comment posted successfully.';
                feedback.className = 'text-xs text-green-600';
            } else {
                throw new Error(result.error || 'Comment failed.');
            }
        } catch (error) {
            if (retryCount < 1) {
                feedback.textContent = 'Posting failed, retrying...';
                feedback.className = 'text-xs text-yellow-600';
                setTimeout(() => submitComment(parentId, retryCount + 1), 2000);
                return;
            }
            feedback.textContent = 'Unable to post comment: ' + error.message;
            feedback.className = 'text-xs text-red-500';
            log('Comment submit error: ' + error.message);
        } finally {
            isSubmittingComment = false;
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        }
    })();
}

// ================= VOTE =================
function deleteComment(commentId){
    if (!currentCommentGame || !commentId) return;

    fetchEncryptedJson('comments.json')
    .then(data => {
        const comments = (data && data[currentCommentGame]) || [];
        const toDelete = [commentId];
        const findReplies = (parentId) => {
            comments.forEach(c => {
                if (c.parentId === parentId) {
                    toDelete.push(c.id);
                    findReplies(c.id);
                }
            });
        };
        findReplies(commentId);

        const deletePromises = toDelete.map(id =>
            fetch('/api/comments', {
                method: 'DELETE',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    game: currentCommentGame,
                    id,
                    uid
                })
            }).then(r => r.json())
        );
        return Promise.all(deletePromises);
    })
    .then(results => {
        if (results.every(r => r.success)) {
            fetchCommentCounts();
            loadComments(currentCommentGame);
            log('Comment and replies deleted');
        } else {
            log('Some deletes failed');
        }
    })
    .catch(e => log('Delete error: ' + e.message));
}

function voteComment(game, commentId, voter) {
    fetch('/api/comments/vote', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            game,
            commentId,
            uid: voter
        })
    })
    .then(r => r.json())
    .then(result => {
        if (result.success) {
            loadComments(game);
        } else {
            log(result.error || 'Unable to vote');
        }
    })
    .catch(e => log('Vote error: ' + e.message));
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

const commentsImages = document.getElementById('comments-images');
if (commentsImages) {
    commentsImages.addEventListener('change', handleImageSelection);
}

function updateCommentInputHint(length) {
    if (!commentsHint) return;
    const remaining = COMMENT_MAX_LENGTH - length;
    commentsHint.textContent = `${remaining} characters remaining`;
    commentsHint.className = remaining < 0 ? 'text-xs text-red-500' : 'text-xs text-slate-500';
}

function handleImageSelection(event) {
    const files = Array.from(event.target.files);
    const maxImages = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB per image

    if (selectedImages.length + files.length > maxImages) {
        alert(`You can only upload up to ${maxImages} images per comment.`);
        return;
    }

    const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
            alert(`${file.name} is not an image file.`);
            return false;
        }
        if (file.size > maxSize) {
            alert(`${file.name} is too large. Maximum size is 5MB.`);
            return false;
        }
        return true;
    });

    selectedImages.push(...validFiles);
    updateImagePreview();
}

function updateImagePreview() {
    const preview = document.getElementById('comments-image-preview');
    if (!preview) return;

    preview.innerHTML = '';
    selectedImages.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'relative inline-block';
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.className = 'w-16 h-16 object-cover rounded border';
        img.alt = 'Preview';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600';
        removeBtn.textContent = '×';
        removeBtn.onclick = () => removeImage(index);

        item.appendChild(img);
        item.appendChild(removeBtn);
        preview.appendChild(item);
    });
}

// Make removeImage global for onclick
window.removeImage = removeImage;

async function uploadImages() {
    if (selectedImages.length === 0) return [];

    const formData = new FormData();
    selectedImages.forEach(file => formData.append('photos', file));

    try {
        const response = await fetch('/api/comments/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            return result.photos.map(photo => photo.url);
        } else {
            throw new Error(result.error || 'Upload failed');
        }
    } catch (error) {
        console.error('Image upload error:', error);
        throw error;
    }
}

updateCommentInputHint(0);

});
