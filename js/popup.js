var editor = CodeMirror.fromTextArea(document.getElementById('custom-css'), {
  extraKeys: { 'Ctrl-Space': 'autocomplete' },
  lineNumbers: true,
});
editor.setOption('theme', 'ayu-dark');

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
      editor.getDoc().setValue(css_beautify(customCSS));
    }
  });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Check if the tab is fully loaded
  if ((changeInfo.status || tab.status) == 'complete') {
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
      }
    });
  }
});
chrome.tabs.onCreated.addListener(function (tab) {
  chrome.storage.local.get(tab.url, function (result) {
    customCSS = result[tab.url];
    if (customCSS != undefined) {
      // Insert custom CSS into the website
      chrome.tabs.executeScript(tab.id, {
        code:
          "var style = document.createElement('style'); style.innerHTML = '" +
          customCSS.replace(/(\r\n|\n|\r)/gm, '') +
          "'; document.head.appendChild(style);",
      });
    }
  });
});

// Insert custom CSS into textarea
editor.getDoc().setValue(css_beautify(customCSS));

// Save button click event
document.getElementById('save-button').addEventListener('click', function () {
  // Get the custom CSS from the textarea
  customCSS = editor.getDoc().getValue();
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
    let css = editor.getDoc().getValue();
    editor.getDoc().setValue(css_beautify(css));
  });
