import { html, render } from './preact.js';

// https://materialdesignicons.com/icon/google-chrome
const Chrome = () => html`
<svg viewBox="0 0 24 24">
  <path d="M12 20L15.5 14H15.5C15.8 13.4 16 12.7 16 12 16 10.8 15.5 9.7 14.6 9H19.4C19.8 9.9 20 10.9 20 12A8 8 0 0 1 12 20M4 12C4 10.5 4.4 9.2 5.1 8L8.5 14H8.6C9.2 15.2 10.5 16 12 16 12.5 16 12.9 15.9 13.3 15.8L10.9 19.9C7 19.4 4 16 4 12M15 12A3 3 0 0 1 12 15 3 3 0 0 1 9 12 3 3 0 0 1 12 9 3 3 0 0 1 15 12M12 4C15 4 17.5 5.6 18.9 8H12C10.1 8 8.5 9.4 8.1 11.2L5.7 7.1C7.2 5.2 9.4 4 12 4M12 2A10 10 0 0 0 2 12 10 10 0 0 0 12 22 10 10 0 0 0 22 12 10 10 0 0 0 12 2Z"/>
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

const query = (function parseQuery(){
  const query = {};
  const temp = window.location.search.substring(1).split('&');
  for (const i in temp) {
    const q = temp[i].split('=');
    query[q.shift()] = decodeURIComponent(q.join('=')).replace(/\+/g, ' ');
  }
  return query;
})();

const renderShareUi = ({ text, url }) => {
  const regex = /(https?:\/\/[^ ]+)/;
  const [, textUrl] = text.match(regex) || [];
  const camelUrl = getCamelUrl(url || textUrl);

  const bodyText = text.replace(textUrl, '').trim();

  const stuff = html`
    <h1>${bodyText}</h1>
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
  `;

  return stuff;
};

const getSampleShare = () => ({
  title: 'Check out this cool share',
  text: 'This is a description that ends in a URL because that is how Amazon shares https://kirilvatev.com'
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
