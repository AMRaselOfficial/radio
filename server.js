const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

let clients = [];

// Serve sitemap.xml with correct content-type
app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

// Keep-alive ping for UptimeRobot
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Stream MP3 with FFmpeg
const ffmpeg = spawn('ffmpeg', [
  '-stream_loop', '-1', // 🔁 Loop forever
  '-re',
  '-i', 'https://ydc1-d.kuku.lu/files/20250915-0739_99c042ee3f641209064fbc320c387b03.mp3',
  '-f', 'mp3',
  'pipe:1'
]);

ffmpeg.stderr.on('data', (data) => {
  console.error('FFmpeg error:', data.toString());
});

// Send chunks to all connected clients
ffmpeg.stdout.on('data', (chunk) => {
  clients.forEach((res) => res.write(chunk));
});

// Streaming route
app.get('/live', (req, res) => {
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Transfer-Encoding', 'chunked');

  clients.push(res);
  console.log('Client connected. Total:', clients.length);

  req.on('close', () => {
    clients = clients.filter((r) => r !== res);
    console.log('Client disconnected. Total:', clients.length);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`🎧 Radio streaming at /live`);
  console.log(`📡 Ping route ready at /ping`);
  console.log(`🗺️ Sitemap available at /sitemap.xml`);
});
