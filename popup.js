let customCSS;
let fileName = 'custom.css';
let fileUrl;

// Retrieve custom CSS from local storage
customCSS = localStorage.getItem('customCSS');

// Insert custom CSS into textarea
document.getElementById('custom-css').value = customCSS;

// Save button click event
document.getElementById('save-button').addEventListener('click', function () {
  // Get the custom CSS from the textarea
  customCSS = document.getElementById('custom-css').value;
  // Save the custom CSS to file
  chrome.fileSystem.chooseEntry(
    { type: 'saveFile', suggestedName: fileName },
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
  // Insert the custom CSS into the current website
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code: 'document.body.style.cssText += "' + customCSS + '";',
    });
  });
});
