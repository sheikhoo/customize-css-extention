// Import the beautify function
const beautify = window.js_beautify.css;

let customCSS;
let fileName = 'custom.css';
let fileUrl;

// Retrieve custom CSS from local storage using the current tab URL as the key
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  customCSS = localStorage.getItem(tabs[0].url);
  // Insert custom CSS into the current website
  chrome.tabs.executeScript(tabs[0].id, {
    code: 'document.body.style.cssText += "' + customCSS + '";',
  });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Check if the tab is fully loaded
  if (changeInfo.status === 'complete') {
    // Retrieve custom CSS from local storage using the current tab URL as the key
    customCSS = localStorage.getItem(tab.url);
    // Insert custom CSS into the website
    chrome.tabs.executeScript(tabId, {
      code: 'document.body.style.cssText += "' + customCSS + '";',
    });
  }
});

// Insert custom CSS into textarea
document.getElementById('custom-css').value = customCSS;

// Save button click event
document.getElementById('save-button').addEventListener('click', function () {
  alert('save');
  // Get the custom CSS from the textarea
  customCSS = document.getElementById('custom-css').value;
  // Save the custom CSS to file
  chrome.fileSystem.chooseEntry(
    { type: 'openWritableFile', suggestedName: fileName },
    function (writableFileEntry) {
      writableFileEntry.createWriter(
        function (writer) {
          writer.onwriteend = function (e) {
            fileUrl = writer.toURL();
          };
          writer.write(new Blob([customCSS], { type: 'text/css' }));
        },
        function (e) {
          console.log(e);
        }
      );
    }
  );
  // Save the custom CSS to local storage using the current tab URL as the key
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    localStorage.setItem(tabs[0].url, customCSS);
    // Insert the custom CSS into the current website
    chrome.tabs.executeScript(tabs[0].id, {
      code: 'document.body.style.cssText += "' + customCSS + '";',
    });
  });

  document
    .getElementById('beautify-button')
    .addEventListener('click', function () {
      let css = document.getElementById('custom-css').value;
      document.getElementById('custom-css').value = beautify(css);
    });
});
