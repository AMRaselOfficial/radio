// Import Firebase modules as ES modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAn8kADK2SbKClaEZZ1QVmw8ja5jI6s16A",
  authDomain: "livechat-amraselofficial.firebaseapp.com",
  projectId: "livechat-amraselofficial",
  storageBucket: "livechat-amraselofficial.firebasestorage.app",
  messagingSenderId: "271740919161",
  appId: "1:271740919161:web:189b1f0857eb91fdaa23a8",
  measurementId: "G-TWEER2R26W"
};
initializeApp(firebaseConfig);
const db = getFirestore();

// DOM elements
const chatBox = document.getElementById('chat-box');
const notificationBox = document.getElementById('notifications');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

const userName = "User";  // All users appear as "Listener"

// Listen for new chat messages (Firestore real-time)
const messagesCollection = collection(db, "messages");
const messagesQuery = query(messagesCollection, orderBy('timestamp'));
onSnapshot(messagesQuery, snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      const data = change.doc.data();
      displayMessage(data);
    }
  });
});

// Listen for admin notifications
const notificationsCollection = collection(db, "notifications");
const notificationsQuery = query(notificationsCollection, orderBy('timestamp'));
onSnapshot(notificationsQuery, snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      const data = change.doc.data();
      displayNotification(data.text);
    }
  });
});

// Send message to Firestore
async function sendMessage() {
  const text = messageInput.value.trim();
  if (text !== "") {
    try {
      await addDoc(messagesCollection, {
        text: text,
        sender: userName,
        timestamp: serverTimestamp()
      });
      messageInput.value = ""; // clear input
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}

// Display a chat message in the chat box
function displayMessage(data) {
  const div = document.createElement('div');
  div.textContent = `${data.sender}: ${data.text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Display an admin notification
function displayNotification(text) {
  const div = document.createElement('div');
  div.textContent = `Admin: ${text}`;
  notificationBox.appendChild(div);
  notificationBox.scrollTop = notificationBox.scrollHeight;
}

// Enable input and set up event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});