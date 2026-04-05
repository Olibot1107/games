const fs = require('fs');
const os = require('os');
const express = require('express');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// ===== Discord setup =====
const token = fs.readFileSync('token.txt', 'utf-8').trim();
const CHANNEL_ID = '1441096216686366943';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// CPU usage helper
function getCPUUsage() {
    const cpus = os.cpus();
    let idle = 0, total = 0;
    cpus.forEach(core => {
        for (let type in core.times) total += core.times[type];
        idle += core.times.idle;
    });
    return (1 - idle / total) * 100;
}

// Memory usage helper
function getMemoryUsage() {
    const total = os.totalmem();
    const used = total - os.freemem();
    return { usedMB: (used / 1024 / 1024).toFixed(2), totalMB: (total / 1024 / 1024).toFixed(2) };
}

// Ping helper
async function pingGoogle() {
    const start = Date.now();
    try {
        await fetch('https://www.google.com', { method: 'HEAD' });
        return `${Date.now() - start} ms`;
    } catch {
        return 'N/A';
    }
}

let lastStatusMessage = null;

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) return console.log('Channel not found');

    await channel.send('<@&1490401309055123556> HELLO SIR UR SCAMMER CALL CENTER IS ONLINE');
    await channel.send('Version 1.1');

    // ===== Status updater =====
    setInterval(async () => {
        const ping = await pingGoogle();
        const cpu = getCPUUsage().toFixed(2);
        const mem = getMemoryUsage();

        const embed = new EmbedBuilder()
            .addFields(
                { name: 'Ping', value: ping, inline: true },
                { name: 'CPU Usage', value: `${cpu}%`, inline: true },
                { name: 'RAM', value: `${mem.usedMB}MB / ${mem.totalMB}MB`, inline: true }
            )
            .setColor('#00FF00')
            .setTimestamp();

        if (lastStatusMessage) lastStatusMessage.delete().catch(() => {});
        lastStatusMessage = await channel.send({ embeds: [embed] });
    }, 10000);
});

client.login(token);

// ===== Express API =====
const app = express();
const PORT = 4000;
app.use(express.json());

// POST /send-embed
app.post('/send-embed', async (req, res) => {
    const { title, description, color, fields } = req.body;
    const channel = await client.channels.fetch(CHANNEL_ID).catch(() => null);
    if (!channel) return res.status(500).json({ error: 'Discord channel not found' });

    const embed = new EmbedBuilder()
        .setTitle(title || null)
        .setDescription(description || null)
        .setColor(color || '#00FF00');

    if (Array.isArray(fields)) {
        fields.forEach(f => embed.addFields({ name: f.name, value: f.value, inline: f.inline || false }));
    }

    channel.send({ embeds: [embed] }).then(msg => {
        res.json({ success: true, messageId: msg.id });
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Failed to send embed' });
    });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));