import { html, render } from './preact.js';

/*
<div>
  Try opening these intents:
  <div><a href="intent://kirilv.com/canvas-confetti/#Intent;scheme=https;package=org.mozilla.focus;end;">Open in Firefox Focus</a></div>
  <div><a href="intent://kirilv.com/canvas-confetti/#Intent;scheme=https;package=com.android.chrome;end;">Open in Chrome</a></div>
</div>
*/

const getOpengraphData = async url => {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`error response ${res.status} "${res.statusText}"\n${text}`);
  }

  // look for:
  // <link rel="canonical" href="https://www.amazon.com/Weaver-Leather-Beeswax-1-oz/dp/B00WH2QITG" />

  // look for:
  // <meta name="description" content="Amazon.com : Weaver Leather Beeswax, 1 oz : Sports &amp; Outdoors" />
  // <meta name="title" content="Amazon.com : Weaver Leather Beeswax, 1 oz : Sports &amp; Outdoors" />

  return text;
};

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

const renderShareUi = ({ title, text, url }) => {
  const regex = /(https?:\/\/(?:[^.]+\.)?amazon\.[^ ]+)/;
  const [, textUrl] = text.match(regex) || [];
  const camelUrl = getCamelUrl(url || textUrl);

  getOpengraphData(`https://www.amazon.com/dp/B00WH2QITG/ref=cm_sw_H6NA2PQ3HJ0EPK1HGXYZ`).then(data => console.log(data)).catch(err => console.error(err));

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

  return stuff;
};

export default () => {
  const elem = document.querySelector('#main');

  const ui = query.title && query.text ?
    renderShareUi(query) :
    html`<div>Nothing was shared</div>`;

  render(ui, elem);

  return () => {};
};
