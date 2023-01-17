chrome.storage.local.get(location.href, function (result) {
  customCSS = result[location.href];
  var style = document.createElement('style');
  style.innerHTML = customCSS;
  document.head.appendChild(style);
});
