import { html, render } from './preact.js';

/*
<div>
  Try opening these intents:
  <div><a href="intent://kirilv.com/canvas-confetti/#Intent;scheme=https;package=org.mozilla.focus;end;">Open in Firefox Focus</a></div>
  <div><a href="intent://kirilv.com/canvas-confetti/#Intent;scheme=https;package=com.android.chrome;end;">Open in Chrome</a></div>
</div>
*/

export default ({ events }) => {
  const elem = document.querySelector('#main');

  const splash = ({ title, text, url }) => {
    const stuff = html`<div class=limit>
      <div>title: ${title}</div>
      <div>text: ${text}</div>
      <div>url: ${url}</div>
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
