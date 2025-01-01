// Handles background tasks for the extension
console.log("AssistEase background script running...");

// Example: Listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
   if (changeInfo.status === "complete") {
      console.log(`Tab updated: ${tab.url}`);
   }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   if (request.action === "saveBookmark") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
         const currentTab = tabs[0];
         if (currentTab) {
            chrome.storage.local.get("bookmarks", (data) => {
               const bookmarks = data.bookmarks || [];
               const newBookmark = { title: currentTab.title, url: currentTab.url };

               // Avoid duplicates
               if (!bookmarks.some((bookmark) => bookmark.url === newBookmark.url)) {
                  bookmarks.push(newBookmark);
                  chrome.storage.local.set({ bookmarks }, () => {
                     console.log("Bookmark saved:", newBookmark);
                  });
               } else {
                  console.log("Bookmark already exists.");
               }
            });
         }
      });
      sendResponse({ success: true });
   }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
   const { action, tabIndex } = message;

   if (["switchTab", "closeTab", "reloadTab"].includes(action)) {
      chrome.tabs.query({}, (tabs) => {
         if (tabIndex >= 0 && tabIndex < tabs.length) {
            const tabId = tabs[tabIndex].id;

            if (action === "switchTab") {
               chrome.tabs.update(tabId, { active: true }, () => sendResponse({ success: true }));
            } else if (action === "closeTab") {
               chrome.tabs.remove(tabId, () => sendResponse({ success: true }));
            } else if (action === "reloadTab") {
               chrome.tabs.reload(tabId, {}, () => sendResponse({ success: true }));
            }
         } else {
            sendResponse({ success: false });
         }
      });
      return true; // Keep the listener open for asynchronous response
   }
});
