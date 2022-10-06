import { html, render, useState, useEffect, useRef } from './preact.js';

// https://thenounproject.com/icon/chrome-browser-2627873/
const Chrome = () => html`
<svg viewBox="0 0 450 450">
  <path d="M224 25c-65 0-124 32-160 82l62 106c6-50 48-88 98-88h173A199 199 0 0 0 224 25ZM52 125a199 199 0 0 0 151 298l61-106c-46 20-101 2-126-42L52 125Zm172 20c-43 0-80 36-80 80s37 80 80 80c44 0 80-36 80-80s-36-80-80-80Zm60 0c41 30 52 87 27 130l-87 150h1a200 200 0 0 0 182-280H284Z"/>
</svg>
`;

// https://materialdesignicons.com/icon/firefox
const Firefox = () => html`
<svg viewBox="0 0 24 24">
  <path d="M9.3 7.9C9.3 7.9 9.3 7.9 9.3 7.9M6.9 6.7C6.9 6.7 6.9 6.7 6.9 6.7M21.3 8.6C20.9 7.6 20 6.4 19.3 6.1 19.8 7.2 20.2 8.3 20.3 9.1L20.3 9.1C19.2 6.3 17.2 5.2 15.7 2.7 15.6 2.6 15.5 2.4 15.4 2.3 15.4 2.2 15.4 2.2 15.3 2.1 15.3 2 15.2 1.8 15.2 1.7 15.2 1.7 15.2 1.7 15.2 1.7H15.1L15.1 1.7 15.1 1.7 15.1 1.7C12.9 3 12 5.3 11.7 6.7 11.1 6.8 10.4 6.9 9.8 7.2 9.6 7.3 9.6 7.4 9.6 7.5 9.7 7.7 9.8 7.7 10 7.7 10.5 7.4 11.1 7.3 11.7 7.2L11.8 7.2C11.8 7.2 11.9 7.2 12 7.2 12.5 7.2 13 7.3 13.4 7.4L13.5 7.4C13.6 7.5 13.7 7.5 13.8 7.5 13.8 7.5 13.9 7.6 13.9 7.6L14.1 7.6C14.1 7.7 14.2 7.7 14.3 7.7 14.3 7.8 14.3 7.8 14.3 7.8 14.4 7.8 14.5 7.9 14.5 7.9 14.6 7.9 14.6 7.9 14.7 8 15.4 8.4 16 9 16.4 9.8 15.9 9.4 14.9 9 14 9.2 17.6 11 16.6 17.2 11.6 17 11.2 16.9 10.8 16.9 10.3 16.7 10.2 16.7 10.1 16.6 10.1 16.6 10 16.6 9.9 16.5 9.9 16.5 8.7 15.9 7.6 14.7 7.5 13.2 7.5 13.2 8 11.5 10.8 11.5 11.1 11.5 12 10.6 12 10.4 12 10.3 10.3 9.6 9.6 9 9.2 8.6 9.1 8.4 8.9 8.3 8.8 8.2 8.8 8.2 8.7 8.1 8.4 7.3 8.4 6.5 8.6 5.7 7.6 6.1 6.8 6.9 6.2 7.5H6.2C5.8 7 5.9 5.4 5.9 5 5.9 5 5.6 5.2 5.5 5.2 5.2 5.4 4.9 5.7 4.6 6 4.2 6.4 3.9 6.7 3.6 7.1 3 8.1 2.5 9.1 2.3 10.2 2.3 10.2 2.2 10.6 2.1 11.1L2.1 11.3C2.1 11.5 2 11.7 2 11.9L2 11.9 2 12.3 2 12.3C2 17.9 6.5 22.3 12 22.3 17 22.3 21.1 18.7 21.9 14 21.9 13.9 21.9 13.8 21.9 13.6 22.1 11.9 21.9 10.1 21.3 8.6Z"/>
</svg>
`;

const getCamelUrl = productUrl => {
  return `camelcamelcamel.com/search?sq=${encodeURIComponent(productUrl)}`;
};

const getLandingImage = async url => {
  const res = await fetch(`https://proxy.cors.sh/${url}`);

  if (!res.ok) {
    return null;
  }

  const text = await res.text();
  const [, landingImage] = text.match(/"landingImageUrl":"([^"]+)"/) || [];

  return landingImage || null;
};

const query = (function parseQuery(){
  const query = {};
  const temp = window.location.search.substring(1).split('&');
  for (const i in temp) {
    const q = temp[i].split('=');
    query[q.shift()] = decodeURIComponent(q.join('=')).replace(/\+/g, ' ');
  }
  return query;
})();

const UI = ({ text, url, ...rest }) => {
  const [showDebug, setDebug] = useState(false);
  const [landingImage, setLandingImage] = useState(null);
  const previewRef = useRef(null);

  const regex = /(https?:\/\/[^ ]+)/;
  const [, textUrl] = text.match(regex) || [];
  const camelUrl = getCamelUrl(url || textUrl);

  useEffect(() => {
    getLandingImage(url || textUrl).then(result => {
      if (result) {
        setLandingImage(result);
      }
    }).catch(err => {
      console.error('failed to get preview image', err);
    });
  }, [url, textUrl]);

  useEffect(() => {
    if (previewRef.current && landingImage) {
      previewRef.current.style.setProperty(`--preview-image-url`, `url('${landingImage}')`);
    }
  }, [previewRef, landingImage]);

  const bodyText = text.replace(textUrl, '').trim();

  return html`
    <div class=side-by-side>
      <div class=preview ref=${previewRef} />
      <div class=body>${bodyText}</div>
    </div>
    <h2>Open price tracker in:</h2>
    <div class=links>
      <a href="intent://${camelUrl}#Intent;scheme=https;package=com.android.chrome;end;">
        <${Chrome} />
        <span>Chrome</span>
      </a>
      <a href="intent://${camelUrl}#Intent;scheme=https;package=org.mozilla.focus;end;">
        <${Firefox} />
        <span>Firefox Focus</span>
      </a>
    </div>
    <button onClick=${() => setDebug(!showDebug)} style="opacity: ${showDebug ? '1' : '0.6'}">Debug</button>
    <div class=debug style="display: ${showDebug ? 'block' : 'none'}">
      <table>
        ${Object.entries({ ...rest, text, url, camelUrl }).map(([key, value]) => html`<tr><td>${key}</td><td>${value}</td></tr>`)}
      </table>
    </div>
  `;
};

const renderShareUi = (props) => {
  return html`<${UI} ...${props} />`
};

const getSampleShare = () => ({
  title: 'Check out this cool share',
  text: 'This is a description that ends in a URL because that is how Amazon shares https://a.co/2t5xJnL'
});

const isLocalhost = () => !!/^localhost:[0-9]+$/.test(location.host);

export default () => {
  const elem = document.querySelector('#main');

  const ui = query.title && query.text ?
    renderShareUi(query) :
    isLocalhost() ?
      renderShareUi(getSampleShare()) :
      html`<div>Nothing was shared</div>`;

  render(ui, elem);

  return () => {};
};
