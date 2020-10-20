const PARENT = '👀';
const log = (first, ...args) => {
  // eslint-disable-next-line no-console
  console.log(`${PARENT} ${first}`, ...args);
};

export default ({ events }) => {
  window.addEventListener('beforeinstallprompt', () => {
    log('we can install the app now');
  //  events.emit('can-install', { prompt: ev });
  });

  window.addEventListener('appinstalled', () => {
  //  events.emit('info', '🎊 installed 🎊');
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' }).then(() => {
      log('worker registered');
    }).catch(err => {
      log('worker errored', err);
    });

    navigator.serviceWorker.addEventListener('message', (ev) => {
      const data = ev.data;

      if (data.action === 'log') {
        return void log('worker - ', ...data.args);
      }

      if (data.action === 'receive-share') {
        const { title, text, url, file } = data;
        events.emit('receive-share', { title, text, url, file });
        return;
      }

      if (data.action === 'notification-click') {
        events.emit('render-focus', { id: data.id });
        return;
      }

      log('unknown message - ', ev.data);
    });

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage('init-ready');
    }
  } else {
    log('service worker is not supported');
  }
};
