const express = require('express');
const { spawn } = require('child_process');
const app = express();

const PORT = process.env.PORT || 3000;

let clients = [];

// Start FFmpeg process once to stream the song.mp3 file
const ffmpeg = spawn('ffmpeg', [
  '-re',           // Read input at native frame rate (simulate live)
  '-i', 'song.mp3', // Input file - make sure this file is in project root
  '-f', 'mp3',     // Output format MP3
  'pipe:1'         // Pipe output to stdout
]);

// Log FFmpeg errors
ffmpeg.stderr.on('data', (data) => {
  console.error('FFmpeg error:', data.toString());
});

// Handle FFmpeg exit (optional: could restart ffmpeg here if needed)
ffmpeg.on('exit', (code, signal) => {
  console.error(`FFmpeg exited with code ${code} and signal ${signal}`);
});

// When FFmpeg produces output chunks, send them to all connected clients
ffmpeg.stdout.on('data', (chunk) => {
  clients.forEach((res) => res.write(chunk));
});

// Endpoint for clients to connect and listen to the live stream
app.get('/live', (req, res) => {
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Transfer-Encoding', 'chunked');

  clients.push(res);
  console.log('Client connected. Total clients:', clients.length);

  // Remove client on disconnect
  req.on('close', () => {
    clients = clients.filter((r) => r !== res);
    console.log('Client disconnected. Total clients:', clients.length);
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`✅ Live radio streaming on port ${PORT}`);
});