import axios from 'axios';
import ReactDOM from "react-dom"
import IFrame from '../components/iFrame';

// const moduleURL = 'https://localhost:9000/dist/bundle.js';
const moduleURL = 'https://hoyangatshopback.github.io/exterior/bundle.js';

async function init() {
  console.log('[Extension Demo] content script init');

  const resp = await axios.get(moduleURL);
  const { data } = resp;

  chrome.runtime.sendMessage({ method: 'setModule', data, url: moduleURL });

  const code = await chrome.runtime.sendMessage({ method: 'getModule', url: moduleURL });

  // const module = Function(code);
  // const setting = module.settings;

  const theFrame = createIFrame('the-frame');

  document.documentElement.appendChild(theFrame);

  // const root = document.createElement('div');
  // ReactDOM.render(<IFrame src={iframeURL} style={style} id="the-frame" sandbox='allow-scripts' />, root);

  setTimeout(() => {
    const message = {
      command: 'loadScript',
      code
    };
    theFrame.contentWindow.postMessage(message, '*');
  }, 100)

  // setTimeout(() => {
  //   const message = {
  //     command: 'injectModule',
  //     url: moduleURL
  //   };
  //   theFrame.contentWindow.postMessage(message, '*');
  // }, 100)
}

// on result from sandboxed frame:
window.addEventListener('message', function (event) {
  const { module } = event.data;
  console.log('module :>> ', module);
})

chrome.runtime.onMessage.addListener((message) => {
  console.log('content onMessage :>> ', message);
});

function createIFrame(id) {
  const iframeURL = chrome.runtime.getURL('sandbox.html');

  const iframe = document.createElement('iframe');

  const inlineStyle = getInlineStyle({
    display: 'none'
    // width: 200,
    // height: 200,
    // position: 'fixed',
    // top: 20,
    // left: 60,
    // 'z-index': 99999
  })

  iframe.style = inlineStyle;
  iframe.src = iframeURL;
  iframe.id = id;
  iframe.sandbox = 'allow-scripts allow-modals';

  return iframe;
}

function getInlineStyle(styleObj) {
  const inline = Object.entries(styleObj).reduce((prev, curr) => {
    let [attr, val] = curr;
    const attrWithoutUnit = ['z-index'];
    if (Number.isInteger(val) && !attrWithoutUnit.includes(attr)) {
      val += 'px';
    }
    return prev += `${attr}: ${val}; `;
  }, '');
  return inline;
}

init();