document.addEventListener("DOMContentLoaded", function () {
   const menuButtons = document.querySelectorAll(".menu-btn");
   const submenuButtons = document.querySelectorAll(".submenu-btn");
   const subMenus = document.querySelectorAll(".submenu");
   const mainMenu = document.getElementById("main-menu");
   const backButtons = document.querySelectorAll(".back-btn");

   // Show the corresponding submenu when a main menu button is clicked
   menuButtons.forEach(button => {
      button.addEventListener("click", function () {
         const targetId = this.dataset.target;
         mainMenu.style.display = "none";
         hideAllSubmenus();
         document.getElementById(targetId).style.display = "block";
      });
   });

   // Show the corresponding submenu when a submenu button is clicked
   submenuButtons.forEach(button => {
      button.addEventListener("click", function () {
         const targetId = this.dataset.target;
         hideAllSubmenus();
         document.getElementById(targetId).style.display = "block";
      });
   });

   // Return to the main menu when a back button is clicked
   backButtons.forEach(button => {
      button.addEventListener("click", function () {
         const parentMenu = this.closest(".submenu");
         parentMenu.style.display = "none";

         // If returning from a submenu of "Larger Elements", show "Larger Elements" menu
         if (parentMenu.id === "text-resize" || parentMenu.id === "button-resize" || parentMenu.id === "other-elements-resize") {
            document.getElementById("larger-elements").style.display = "block";
         } else {
            mainMenu.style.display = "flex";
         }
      });
   });

   function hideAllSubmenus() {
      subMenus.forEach(menu => menu.style.display = "none");
   }

   // Function to update element size on the webpage
   const updateElementSize = (type, size) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
         chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (type, size) => {
               if (type === "text") {
                  document.body.style.fontSize = `${size}px`;
                  localStorage.setItem("assistEaseFontSize", size);
               } else if (type === "button") {
                  document.querySelectorAll("button").forEach(btn => {
                     btn.style.padding = `${size / 10}px`;
                     btn.style.fontSize = `${size / 5}px`;
                  });
                  localStorage.setItem("assistEaseButtonSize", size);
               } else if (type === "input") {
                  document.querySelectorAll("input, textarea, select").forEach(el => {
                     el.style.padding = `${size / 10}px`;
                     el.style.fontSize = `${size / 4}px`;
                  });
                  localStorage.setItem("assistEaseInputSize", size);
               }
            },
            args: [type, size],
         });
      });
   };

   // Load saved sizes from storage and apply them when the extension is opened
   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
         target: { tabId: tabs[0].id },
         func: () => ({
            text: localStorage.getItem("assistEaseFontSize") || "16",
            button: localStorage.getItem("assistEaseButtonSize") || "14",
            input: localStorage.getItem("assistEaseInputSize") || "14",
         }),
      }, (result) => {
         if (result[0]) {
            document.getElementById("text-slider").value = result[0].result.text;
            document.getElementById("button-slider").value = result[0].result.button;
            document.getElementById("other-slider").value = result[0].result.input;
         }
      });
   });

   // Handle element resizing using sliders
   document.getElementById("text-slider").addEventListener("input", function () {
      updateElementSize("text", this.value);
   });

   document.getElementById("button-slider").addEventListener("input", function () {
      updateElementSize("button", this.value);
   });

   document.getElementById("other-slider").addEventListener("input", function () {
      updateElementSize("input", this.value);
   });
});
