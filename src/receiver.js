import { html, render } from './preact.js';

/*
<div>
  Try opening these intents:
  <div><a href="intent://kirilv.com/canvas-confetti/#Intent;scheme=https;package=org.mozilla.focus;end;">Open in Firefox Focus</a></div>
  <div><a href="intent://kirilv.com/canvas-confetti/#Intent;scheme=https;package=com.android.chrome;end;">Open in Chrome</a></div>
</div>
*/

const getCamelUrl = productUrl => {
  return `camelcamelcamel.com/search?sq=${encodeURIComponent(productUrl)}`;
};

const query = (function parseQuery(){
  const query = {};
  const temp = window.location.search.substring(1).split('&');
  for (const i in temp) {
    const q = temp[i].split('=');
    query[q.shift()] = decodeURIComponent(q.join('='));
  }
  return query;
})();

export default () => {
  const elem = document.querySelector('#main');
  const regex = /(https?:\/\/(?:[^.]+\.)?amazon\.[^ ]+)/;

  const splash = ({ title, text, url }) => {
    const [, textUrl] = text.match(regex) || [];
    const camelUrl = getCamelUrl(url || textUrl);

    const stuff = html`<div class=limit>
      <div>this site: ${window.location.href}</div>
      <div>-------------</div>
      <div>title: ${title}</div>
      <div>text: ${text}</div>
      <div>url: ${url}</div>
      <div>camel url: ${camelUrl}</div>
      <div>
        <div><a href="intent://${camelUrl}#Intent;scheme=https;package=org.mozilla.focus;end;">Open in Firefox Focus</a></div>
        <div><a href="intent://${camelUrl}#Intent;scheme=https;package=com.android.chrome;end;">Open in Chrome</a></div>
      </div>
    </div>`;

    render(stuff, elem);
  };

  splash(query);

  return () => {};
};
