// Handles popup interactions

document.getElementById("enable-feature").addEventListener("click", () => {
   console.log("Voice control feature enabled.");
});

document.getElementById("enable-feature").addEventListener("click", () => {
   alert("Voice control feature enabled.");
});

// Enable Voice Control Placeholder
document.getElementById("enable-feature").addEventListener("click", () => {
   alert("Voice control feature enabled.");
});

// Utility function to adjust font size with limits
const adjustFontSize = (adjustment) => {
   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
         target: { tabId: tabs[0].id },
         func: (adjustment) => {
            const minFontSize = 10; // Minimum font size in pixels
            const maxFontSize = 40; // Maximum font size in pixels
            const currentFontSize = parseInt(
               localStorage.getItem("assistEaseFontSize") ||
               getComputedStyle(document.body).fontSize
            );
            const newFontSize = Math.min(
               Math.max(currentFontSize + adjustment, minFontSize),
               maxFontSize
            );
            document.body.style.fontSize = `${newFontSize}px`;
            localStorage.setItem("assistEaseFontSize", newFontSize);
         },
         args: [adjustment],
      });
   });
};

// Increase Text Size
document.getElementById("increase-size").addEventListener("click", () => {
   adjustFontSize(2); // Increase font size by 2px
});

// Decrease Text Size
document.getElementById("decrease-size").addEventListener("click", () => {
   adjustFontSize(-2); // Decrease font size by 2px
});


const applyTheme = (theme) => {
   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.storage.local.set({ selectedTheme: theme }, () => {
         chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (theme) => {
               document.body.dataset.theme = theme;
            },
            args: [theme],
         });
      });
   });
};

document.getElementById("dark-mode").addEventListener("click", () => {
   applyTheme("dark");
});

document.getElementById("light-mode").addEventListener("click", () => {
   applyTheme("light");
});

document.getElementById("high-contrast").addEventListener("click", () => {
   applyTheme("high-contrast");
});


document.addEventListener("DOMContentLoaded", () => {
   const bookmarksList = document.getElementById("bookmarks");
   chrome.storage.local.get("bookmarks", (data) => {
      const bookmarks = data.bookmarks || [];
      bookmarks.forEach((bookmark) => {
         const listItem = document.createElement("li");
         const link = document.createElement("a");
         link.href = bookmark.url;
         link.textContent = bookmark.title;
         link.target = "_blank";
         listItem.appendChild(link);
         bookmarksList.appendChild(listItem);
      });
   });
});
