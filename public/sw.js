// public/sw.js
console.log("Service Worker loaded");

// Listen for push events
self.addEventListener("push", function (event) {
  console.log("Push notification received:", event);

  let notificationData = {
    title: "BukPulse",
    body: "You have a new notification",
    icon: "/192bukp.png",
    badge: "/512bukp.png",
    data: { url: "/" },
  };

  // Parse the push data if it exists
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        data: {
          url: data.url || "/",
          ...data,
        },
        tag: data.tag || "default",
        requireInteraction: data.requireInteraction || false,
      };
    } catch (e) {
      console.error("Error parsing push data:", e);
    }
  }

  // Show the notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      data: notificationData.data,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
    })
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", function (event) {
  console.log("Notification clicked:", event.notification);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  // Focus existing window or open new one
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        // Check if there's already a window open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle subscription changes
self.addEventListener("pushsubscriptionchange", function (event) {
  console.log("Push subscription changed:", event);
  // You can handle subscription refresh here if needed
});
