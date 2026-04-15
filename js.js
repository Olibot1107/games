document.addEventListener('DOMContentLoaded', () => {

const gamesList = document.getElementById('games-list');
const searchInput = document.getElementById('search');
const favoritesList = document.getElementById('favorites-list');
const debugPanel = document.getElementById('debug-panel');

const REPORT_KEY = "last_report_time";
let lastReportTime = JSON.parse(localStorage.getItem(REPORT_KEY) || "{}");

let allGames = [];
let voteData = {};
let reportData = {}; // 🔥 ADDED
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// UID
if(!localStorage.getItem('uid')){
    localStorage.setItem('uid', Math.random().toString(36).slice(2));
}
const uid = localStorage.getItem('uid');

function log(msg){
    if(debugPanel) debugPanel.textContent += "\n" + msg;
}

// ================= REPORTS FETCH =================
function fetchReports(){
    fetch('/api/reports')
    .then(r => r.json())
    .then(data => {
        const reports = data.reports || {};

        reportData = {};

        allGames.forEach(g => {
            reportData[g.name] = (reports[g.name] || []).length;
        });

        renderGames();
    })
    .catch(e => log(e.message));
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

    left.append(fav, link);

    const right = document.createElement('div');
    right.className = "flex gap-2 items-center";

    const up = document.createElement('button');
    const down = document.createElement('button');

    up.textContent = '👍';
    down.textContent = '👎';

    up.className = "bg-green-200 px-2 rounded";
    down.className = "bg-red-200 px-2 rounded";

    if(votes.userVote==='up') up.classList.add('ring-2','ring-green-500');
    if(votes.userVote==='down') down.classList.add('ring-2','ring-red-500');

    up.onclick = () => sendVote(game.name,'up');
    down.onclick = () => sendVote(game.name,'down');

    const count = document.createElement('div');
    count.innerHTML = `
        <span class="text-green-600">${votes.up}</span> 👍 
        <span class="text-red-600">${votes.down}</span> 👎
    `;

    // ================= ⚠️ REPORT BUTTON WITH COUNT =================
    const reportCount = reportData[game.name] || 0;

    const report = document.createElement('button');
    report.textContent = `⚠️ ${reportCount}`;
    report.className = "bg-orange-200 px-2 rounded";
    report.title = "Report broken game";
    report.onclick = () => sendReport(game.name);

    right.append(up, down, count, report);
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
    fetch('/api/votes')
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

        fetchReports(); // 🔥 IMPORTANT
    })
    .catch(e=>log(e.message));
}

// ================= REPORT =================
function sendReport(game){
    const now = Date.now();

    const cooldown = 5 * 60 * 60 * 1000;

    if(now - lastReportTime < cooldown){
        const mins = Math.ceil((cooldown - (now - lastReportTime)) / 60000);
        alert(`You can report again in ${mins} minutes`);
        return;
    }

    const reason = prompt("Why is this game broken?");
    if(!reason || !reason.trim()) return;

    fetch('/api/report', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            game,
            uid,
            reason: reason.trim()
        })
    })
    .then(res => {
        if(res.status === 429){
            alert("Cooldown active");
            return;
        }

        lastReportTime = now;
        localStorage.setItem(REPORT_KEY, String(lastReportTime));

        fetchReports();

        alert("Report submitted");
    })
    .catch(e=>log(e.message));
}

// ================= VOTE =================
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

    voteData[game].userVote = vote;

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
});

if(searchInput){
    searchInput.addEventListener('input', renderGames);
}

});