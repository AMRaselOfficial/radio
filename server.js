const express = require('express');
const { spawn } = require('child_process');
const app = express();

const PORT = process.env.PORT || 3000;

let clients = [];

// Start FFmpeg process once to stream the song.mp3 file
const ffmpeg = spawn('ffmpeg', [
  '-re',            // Read input at native speed
  '-i', 'https://www.dropbox.com/scl/fi/2h2u8wwq62rr384xm13s3/song.mp3?rlkey=hkbujwxtv2wivz38ajoic6ojd&st=ei2ahfbp&dl=1', // Audio file path
  '-f', 'mp3',      // Output format
  'pipe:1'          // Output to stdout
]);

// Log any errors from FFmpeg
ffmpeg.stderr.on('data', (data) => {
  console.error('FFmpeg error:', data.toString());
});

// Handle unexpected FFmpeg exit
ffmpeg.on('exit', (code, signal) => {
  console.error(`FFmpeg exited with code ${code} and signal ${signal}`);
});

// When audio data is ready, send it to all connected clients
ffmpeg.stdout.on('data', (chunk) => {
  clients.forEach((res) => res.write(chunk));
});

// Live streaming endpoint
app.get('/live', (req, res) => {
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Transfer-Encoding', 'chunked');

  clients.push(res);
  console.log('Client connected. Total:', clients.length);

  // Remove client when disconnected
  req.on('close', () => {
    clients = clients.filter((r) => r !== res);
    console.log('Client disconnected. Total:', clients.length);
  });
});

// ✅ Ping route for UptimeRobot
app.get('/ping', (req, res) => {
  res.send('pong'); // Lightweight, instant response
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`✅ Radio server running on port ${PORT}`);
});
