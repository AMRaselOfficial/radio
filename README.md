# 🎧 Online Radio Stream with Node.js & GitHub Pages

Welcome to the *Live Radio Stream Project!* This is a simple web-based radio system that uses:

- A Node.js streaming server powered by FFmpeg
- Render.com for hosting the backend
- GitHub Pages for hosting the frontend
- UptimeRobot to keep the backend awake 24/7 on the free tier

---

## 🚀 Live Demo

Frontend:  
🔗 [https://amraselofficial.github.io/radio](https://amraselofficial.github.io/radio) — Public HTML radio player interface

Backend Streaming (audio stream):  
🔗 [https://radio-1jz4.onrender.com/live](https://radio-1jz4.onrender.com/live) — MP3 streaming endpoint served by Node.js + FFmpeg

---

## 🧠 How It Works

- `server.js` (Node.js): Streams a local `song.mp3` using FFmpeg and serves it as a continuous MP3 stream on `/live`
- GitHub Pages: Serves the HTML frontend (`index.html`) that contains an `<audio>` tag to play the live stream
- UptimeRobot: Pings the `/ping` endpoint every 5 minutes to keep the free Render backend awake
- Fully HTTPS-secured for modern browser compatibility

---

## 📁 Project Structure

📦 radio/ ┣ 📜 index.html         # Frontend radio player ┣ 📜 style.css          # Styling for the radio interface ┣ 📜 server.js          # Node.js streaming server ┣ 📜 package.json       # Node dependencies and start script ┣ 📜 README.md          # This file ┗ 🎵 song.mp3           # Local MP3 file streamed (uploaded separately to Render)

---

## 🎧 Streaming Server Details

- Uses **Express.js** to create a server
- FFmpeg pipes `song.mp3` as an infinite stream via `pipe:1`
- Clients connect to `/live` to receive the audio stream
- Render free tier used for 24/7 backend hosting

### 🔒 HTTPS

Both frontend and backend use HTTPS:
- GitHub Pages provides automatic HTTPS
- Render provides HTTPS by default (e.g., `https://radio-xxxx.onrender.com/live`)

---

## 🌐 Deploy Instructions

### 1. 🖥️ Backend Deployment (Render)

1. Push your project to GitHub (excluding large files >100MB)
2. Go to [https://render.com](https://render.com)
3. Create a **new Web Service**
4. Connect your repo, choose `Node`, set the start command to:

node server.js

5. Place `song.mp3` manually using **Render Shell** *(paid)* or upload it to a public URL and stream directly via FFmpeg

---

### 2. 🎧 Frontend Deployment (GitHub Pages)

1. Keep your `index.html`, `style.css` inside a folder (e.g., `/radio`)
2. Push it to a GitHub repo
3. Enable GitHub Pages from repo → Settings → Pages → Select root or `/docs` folder
4. Done! Access it from `https://<yourname>.github.io/<repo-name>`

---

### 3. 🔁 Keep Render Backend Awake (UptimeRobot)

Render free plans go to sleep after 15 mins of inactivity.

#### How to fix it:

1. Sign up at [https://uptimerobot.com](https://uptimerobot.com)
2. Create a monitor:
- Type: `HTTP(s)`
- Name: `Radio Backend`
- URL: `https://your-backend-url.onrender.com/ping`
- Interval: `Every 5 minutes`
3. In your `server.js`, make sure you add:

```js
app.get('/ping', (req, res) => {
res.send('pong');
});
```
✅ This keeps the backend alive 24/7!


---

🛡️ Browser Security

All content (HTML, JS, CSS, audio stream) loads over HTTPS

No mixed-content warnings

Mobile-friendly and compatible with all modern browsers (Chrome, Firefox, Safari, etc.)



---

🧪 Future Ideas

Add microphone input streaming for live DJs

Add a listener counter

Add playlist support and auto-rotation

Add volume/mute controls or a visualizer

Add Discord integration or a request system



---

👨‍💻 Created By

Abdul Momin (Rasel) 
🎮 Web Developer & Learner
🔗 https://amraselofficial.github.io/main


---

📄 License

MIT License — feel free to use, modify, or share this project. Just let me know if you are using my project. So that I can see your work too. This motivates me to do something more. 

---

