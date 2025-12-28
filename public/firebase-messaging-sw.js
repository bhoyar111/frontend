/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey:'AIzaSyDfBHw9wqACydaHof0R74aGlMTJ7mw08hc',
  authDomain:'akgroup-25db6.firebaseapp.com',
  projectId:'akgroup-25db6',
  storageBucket:'akgroup-25db6.firebasestorage.app',
  messagingSenderId:4541876372,
  appId:'1:4541876372:web:7f99273c7ad2b33cc74c81',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Handling background message:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: payload.notification?.icon || "/logo192.png", // fallback icon
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions);
});
