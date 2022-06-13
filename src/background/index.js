// background.js
let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.clear();
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { method } = message;

  if (method === 'setModule') {
    const { url, data } = message;
    setModuleToCache(url, data);
  } else if (method === 'getModule') {
    const { url } = message;
    getModuleFromCache(url).then((cached) => {
      sendResponse(cached[url]);
    })
    // const currTab = await getCurrentTab();
    // chrome.tabs.sendMessage(currTab.id, code);
  }

  return true;
})

// chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
//   if (message.method === 'getStorage') {
//     const { key } = message;
//     const val = await chrome.storage.sync.get(key);
//     sendResponse({ [`${key}`]: val });
//   } else {
//     const currTab = await getCurrentTab();

//     await chrome.scripting.executeScript({
//       target: { tabId: currTab.id },
//       func: appendCode,
//       args: [message],
//       world: 'MAIN',
//       injectImmediately: true, // Chrome 102+
//     });
//     // chrome.tabs.sendMessage(currTab.id, 'appendCode ready');
//     sendResponse('ok');
//   }
// })


async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function appendCode(code) {
  const el = document.createElement('script');
  el.id = 'demo-ext-plugin';
  el.textContent = code;
  el.type = 'module';
  document.documentElement.appendChild(el);
  // el.remove();
}


/**
 * storage.sync maximum 8k (each key 8k, total up to 100k)
 * storage.local maximum 5m (each key unlimited, total up to 5m)
 */
function setModuleToCache(url, data) {
  const cached = {};
  // const blob = new Blob([data]);
  // const blobUri = URL.createObjectURL(blob);
  cached[url] = data;
  chrome.storage.local.set(cached);
}

function getModuleFromCache(url) {
  return chrome.storage.local.get(url);
}