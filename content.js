


// Initialize Speech Recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.continuous = true;

// Start listening for voice commands
recognition.start();

// const createOverlay = () => {
//    const existingOverlay = document.getElementById("assistEase-overlay");
//    if (existingOverlay) existingOverlay.remove();

//    const overlay = document.createElement("div");
//    overlay.id = "assistEase-overlay";
//    overlay.style.position = "fixed";
//    overlay.style.top = "0";
//    overlay.style.left = "0";
//    overlay.style.width = "100%";
//    overlay.style.height = "100%";
//    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
//    overlay.style.zIndex = "10000";
//    overlay.style.pointerEvents = "none";
//    document.body.appendChild(overlay);

//    const clickableElements = document.querySelectorAll("a, button, [role='button']");
//    clickableElements.forEach((el, index) => {
//       const rect = el.getBoundingClientRect();
//       const label = document.createElement("div");

//       label.textContent = index + 1;
//       label.style.position = "absolute";
//       label.style.top = `${rect.top + window.scrollY}px`;
//       label.style.left = `${rect.left + window.scrollX}px`;
//       label.style.backgroundColor = "#FF5722";
//       label.style.color = "#FFF";
//       label.style.padding = "2px 5px";
//       label.style.borderRadius = "5px";
//       label.style.zIndex = "10001";
//       overlay.appendChild(label);

//       el.setAttribute("data-assistease-index", index + 1);
//    });
// };

// Inject toast HTML
if (!document.getElementById("toast")) {
   const toastDiv = document.createElement("div");
   toastDiv.id = "toast";
   toastDiv.style = "display:none; position:fixed; bottom:10px; right:10px; background:rgba(0,0,0,0.8); color:white; padding:10px; border-radius:5px; z-index:1000; font-family:sans-serif;";
   document.body.appendChild(toastDiv);
}

//function to show toast
function showToast(message) {
   const toast = document.getElementById("toast");
   toast.textContent = message;
   toast.style.display = "block";

   setTimeout(() => {
      toast.style.display = "none";
   }, 3000);
}

// Function to handle web search
function performWebSearch(query) {
   const searchEngine = "https://www.google.com/search?q="; // Default search engine
   const searchURL = searchEngine + encodeURIComponent(query);
   window.open(searchURL, "_blank"); // Open the search results in a new tab
}

// function to create overlay
const createOverlay = () => {
   const existingOverlay = document.getElementById("assistEase-overlay");
   if (existingOverlay) existingOverlay.remove();

   const overlay = document.createElement("div");
   overlay.id = "assistEase-overlay";
   overlay.style.position = "fixed";
   overlay.style.top = "0";
   overlay.style.left = "0";
   overlay.style.width = "100%";
   overlay.style.height = "100%";
   overlay.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
   overlay.style.zIndex = "10000";
   overlay.style.pointerEvents = "none";
   document.body.appendChild(overlay);

   // Select clickable elements including Instagram-specific clickable divs
   const clickableElements = document.querySelectorAll("a, button, [role='button'], [role='link'], div[tabindex='0']");
   clickableElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0 || rect.bottom < 0 || rect.top > window.innerHeight) {
         return;
      }

      const label = document.createElement("div");
      label.textContent = index + 1;
      label.style.position = "absolute";
      label.style.top = `${rect.top + window.scrollY}px`;
      label.style.left = `${rect.left + window.scrollX}px`;
      label.style.backgroundColor = "#FF5722";
      label.style.color = "#FFF";
      label.style.padding = "2px 5px";
      label.style.borderRadius = "5px";
      label.style.zIndex = "10001";
      overlay.appendChild(label);

      el.setAttribute("data-assistease-index", index + 1);
   });
};



// Function to activate a labeled element
const activateElement = (label) => {
   const element = document.querySelector(`[data-assistease-index="${label}"]`);
   if (element) {
      try {
         // Try triggering a click event
         element.click();
         speak(`Activated element ${label}`);
      } catch (e) {
         // Simulate a click for custom Instagram elements
         const event = new MouseEvent("click", { bubbles: true, cancelable: true });
         element.dispatchEvent(event);
      }
   } else {
      speak(`Element ${label} not found.`);
   }
};
// Function to remove the overlay
const removeOverlay = () => {
   const overlay = document.getElementById("assistEase-overlay");
   if (overlay) overlay.remove();
};


recognition.onresult = (event) => {
   const command = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
   console.log(`Heard command: ${command}`);


   if (command.includes("increase text size")) {
      adjustTextSize(2); // Increase by 2px
      showToast("Increased text size.");
   } else if (command.includes("reduce text size")) {
      adjustTextSize(-2); // Decrease by 2px
      showToast("Reduced text size.");
   } else if (command.includes("reset text size")) {
      resetTextSize(); // Reset to default
      showToast("Text size reset to default.");
   } else if (command.includes("dark mode")) {
      applyTheme("dark");
      showToast("Dark mode activated.");
   } else if (command.includes("light mode")) {
      applyTheme("light");
      showToast("Light mode activated.");
   } else if (command.includes("high contrast")) {
      applyTheme("high-contrast");
      showToast("High contrast mode activated.");
   } else if (command.includes("scroll up")) {
      scrollPage(-200); // Scroll up by 200px
      showToast("Scrolled up.");
   } else if (command.includes("scroll down")) {
      scrollPage(200); // Scroll down by 200px
      showToast("Scrolled down.");
   } else if (command.includes("open")) {
      openWebsite(command);
      showToast("Opening website...");
   } else if (command.includes("show links")) {
      createOverlay();
      showToast("Links overlay displayed.");
   } else if (command.startsWith("click")) {
      const label = command.replace("click", "").trim();
      activateElement(label);
      showToast(`Clicked on link with label: ${label}`);
   } else if (command.includes("hide links")) {
      removeOverlay();
      showToast("Links overlay hidden.");
   } else if (command.includes("bookmark this page")) {
      saveBookmark();
      showToast("Page bookmarked.");
   } else if (command.includes("show my bookmarks")) {
      showBookmarks();
      showToast("Displaying bookmarks.");
   } else if (command.startsWith("open ")) {
      const bookmarkTitle = command.replace("open ", "").trim();
      openBookmark(bookmarkTitle);
      showToast(`Opened bookmark: ${bookmarkTitle}`);
   } else if (command.startsWith("search for")) {
      const query = command.replace("search for", "").trim();
      if (query) {
         performWebSearch(query);
         showToast(`Searching for: ${query}`);
      } else {
         showToast("Please specify what to search for.");
      }
   } else if (command.includes("go back")) {
      goBack();
   } else if (command.includes("go forward")) {
      goForward();
   } if (command.startsWith("switch to tab")) {
      handleTabCommand(command, "switchTab");
   } else if (command.startsWith("close tab")) {
      handleTabCommand(command, "closeTab");
   } else if (command.startsWith("reload tab")) {
      handleTabCommand(command, "reloadTab");
   }

}

// Function to adjust text size
const adjustTextSize = (change) => {
   document.querySelectorAll("*").forEach((element) => {
      const currentSize = window.getComputedStyle(element).fontSize;
      const newSize = parseFloat(currentSize) + change;
      if (newSize > 10) {
         element.style.fontSize = `${newSize}px`;
      }
   });

   // Save the adjusted font size
   chrome.storage.local.set({ fontSizeAdjustment: change }, () => {
      console.log(`Font size adjusted by ${change}px and saved.`);
   });
};

// Function to reset text size
const resetTextSize = () => {
   document.querySelectorAll("*").forEach((element) => {
      element.style.fontSize = ""; // Reset to original size
   });

   // Clear saved font size adjustment
   chrome.storage.local.remove("fontSizeAdjustment", () => {
      console.log("Font size reset to default and saved adjustment cleared.");
   });
};

// Function to apply themes
const applyTheme = (theme) => {
   document.body.dataset.theme = theme;
   chrome.storage.local.set({ selectedTheme: theme }, () => {
      console.log(`Theme switched to: ${theme}`);
   });
};

// Function to scroll the page
const scrollPage = (pixels) => {
   window.scrollBy({ top: pixels, behavior: "smooth" });
   console.log(`Page scrolled by ${pixels} pixels.`);
};

const openWebsite = (command) => {
   const websiteName = command.replace("open", "").trim();
   let url;
   if (!websiteName.includes(".")) {
      url = `https://www.${websiteName}.com`;
   } else {
      url = `https://${websiteName}`;
   }
   window.open(url, "_blank");
   console.log(`Opened website: ${url}`);
};



// Retrieve and apply stored settings on load
chrome.storage.local.get(["selectedTheme", "fontSizeAdjustment"], (data) => {
   if (data.selectedTheme) {
      document.body.dataset.theme = data.selectedTheme;
      console.log(`Applied saved theme: ${data.selectedTheme}`);
   }

   if (data.fontSizeAdjustment) {
      adjustTextSize(data.fontSizeAdjustment);
      console.log(`Applied saved font size adjustment: ${data.fontSizeAdjustment}`);
   }
});

// Handle errors
recognition.onerror = (event) => {
   console.error("Speech recognition error:", event.error);
};



// Save a bookmark
const saveBookmark = () => {
   chrome.runtime.sendMessage({ action: "saveBookmark" });
};

// Example command handler
if (command.includes("bookmark this page")) {
   saveBookmark();
   speak("This page has been bookmarked.");
}

// show a bookmark
const showBookmarks = () => {
   chrome.storage.local.get("bookmarks", (data) => {
      const bookmarks = data.bookmarks || [];
      bookmarks.forEach((bookmark) => {
         console.log(`Title: ${bookmark.title}, URL: ${bookmark.url}`);
      });
   });
};


// Open a bookmark by title
const openBookmark = (bookmarkTitle) => {
   chrome.storage.local.get("bookmarks", (data) => {
      const bookmarks = data.bookmarks || [];
      const bookmark = bookmarks.find((b) => b.title.toLowerCase() === bookmarkTitle.toLowerCase());
      if (bookmark) {
         chrome.tabs.create({ url: bookmark.url });
      } else {
         console.log("Bookmark not found.");
      }
   });
};

// Function to navigate backward
function goBack() {
   window.history.back();
   showToast("Navigated back.");
}


// Function to navigate forward
function goForward() {
   window.history.forward();
   showToast("Navigated forward.");
}

function parseTabIdentifier(identifier) {
   const ordinalMap = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
      eight: 8, nine: 9, ten: 10
   };
   // Check if it's a numeric string
   if (!isNaN(identifier)) {
      return parseInt(identifier, 10);
   }
   // Check if it's an ordinal word
   return ordinalMap[identifier.toLowerCase()] || null;
}



// General tab action handler
function handleTabCommand(command, action) {
   const match = command.match(/(switch to|close|reload) tab (\w+)/i);
   if (match) {
      const identifier = match[2]; // Get the tab number or ordinal word
      const tabIndex = parseTabIdentifier(identifier) - 1; // Convert to 0-based index

      if (tabIndex >= 0) {
         chrome.runtime.sendMessage({ action, tabIndex }, (response) => {
            if (response.success) {
               showToast(`${action.charAt(0).toUpperCase() + action.slice(1)}ed tab ${identifier}.`);
            } else {
               showToast(`Could not ${action} tab ${identifier}.`);
            }
         });
      } else {
         showToast("Please specify a valid tab identifier (e.g., 7 or seven).");
      }
   }
}

// Function to reload the page
function reloadPage() {
   location.reload();
   showToast("Page reloaded.");
}

