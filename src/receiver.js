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

export default ({ events }) => {
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

  const onShare = async ({ title, text, url }) => {
    splash({ title, text, url });
  };

  events.on('receive-share', onShare);

  return () => {
    events.off('receive-share', onShare);
  };
};
