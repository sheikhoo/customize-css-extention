// Import the beautify function
const beautify = window.js_beautify.css;

let customCSS;

// Retrieve custom CSS from storage using the current tab URL as the key
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.storage.local.get(tabs[0].url, function (result) {
    customCSS = result[tabs[0].url];
    // Insert custom CSS into the current website
    if (customCSS != undefined) {
      chrome.tabs.executeScript(tabs[0].id, {
        code:
          "var style = document.createElement('style'); style.innerHTML = '" +
          customCSS.replace(/(\r\n|\n|\r)/gm, '') +
          "'; document.head.appendChild(style);",
      });
      document.getElementById('custom-css').value = customCSS;
    }
  });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  alert('ok');
  // Check if the tab is fully loaded
  if (changeInfo.status === 'complete') {
    // Retrieve custom CSS from storage using the current tab URL as the key
    chrome.storage.local.get(tab.url, function (result) {
      customCSS = result[tab.url];
      if (customCSS != undefined) {
        // Insert custom CSS into the website
        chrome.tabs.executeScript(tabId, {
          code:
            "var style = document.createElement('style'); style.innerHTML = '" +
            customCSS.replace(/(\r\n|\n|\r)/gm, '') +
            "'; document.head.appendChild(style);",
        });
      } else {
        alert(tab.url);
      }
    });
  }
});
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    chrome.storage.local.get(tab.url, function (result) {
      customCSS = result[tab.url];
      if (customCSS != undefined) {
        chrome.tabs.executeScript(tab.id, {
          code:
            'var style = document.createElement("style");' +
            'style.innerHTML = "' +
            customCSS.replace(/(\r\n|\n|\r)/gm, '') +
            '";' +
            'document.head.appendChild(style);',
        });
      }
    });
  });
});

// Insert custom CSS into textarea
document.getElementById('custom-css').value = customCSS;

// Save button click event
document.getElementById('save-button').addEventListener('click', function () {
  // Get the custom CSS from the textarea
  customCSS = document.getElementById('custom-css').value;
  // Save the custom CSS to storage using the current tab URL as the key
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let data = {};
    data[tabs[0].url] = customCSS;
    if (customCSS != undefined) {
      chrome.storage.local.set(data, function () {
        // Insert the custom CSS into the current website
        chrome.tabs.executeScript(tabs[0].id, {
          code:
            "var style = document.createElement('style'); style.innerHTML = '" +
            customCSS.replace(/(\r\n|\n|\r)/gm, '') +
            "'; document.head.appendChild(style);",
        });
      });
    }
  });
});

document
  .getElementById('beautify-button')
  .addEventListener('click', function () {
    let css = document.getElementById('custom-css').value;
    document.getElementById('custom-css').value = beautify(css);
  });
