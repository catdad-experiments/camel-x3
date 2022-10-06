/* eslint-disable no-console */

import eventEmitter from './event-emitter.js';
import toast from './toast.js';
import validate from './init-validate.js';
import service from './init-service.js';

const TOAST = '🍞';
const events = eventEmitter();
events.pause();

service({ events });

function onError(err, duration = 8 * 1000) {
  // eslint-disable-next-line no-console
  console.error(TOAST, err);

  const html = `${err.prepared ? '' : '<p>An error occured:</p>'}<p>${
    err.message.split('\n').join('<br/>')
  }</p>`;

  toast.error(html, {
    duration
  });
}

function load(name) {
  // get around eslint@5 not supporting dynamic import
  // this is ugly, but I also don't care
  return (new Function(`return import('${name}')`))().then(m => m.default || m);
}

async function map(arr, func) {
  const results = [];

  for (let i = 0; i < arr.length; i++) {
    results.push(await func(arr[i], i, arr));
  }

  return results;
}

export default () => {
  try {
    validate();
  } catch (err) {
    onError(err, -1);
    return;
  }

  // load all the modules from the server directly
  Promise.all([
    load('./renderer.js')
  ]).then(async ([
    ...modules
  ]) => {
    // set up a global event emitter
    const context = { events, load };
    const destroys = await map(modules, mod => mod(context));

    context.events.on('error', function (err) {
      onError(err, -1);
      destroys.forEach(d => d());
    });

    context.events.on('warn', function (err) {
      onError(err);
    });

    context.events.on('info', (msg) => {
      console.log(TOAST, msg);
      toast.info(msg.toString());
    });

    events.resume();
  }).catch(function catchErr(err) {
    events.emit('error', err);
    onError(err);
  });
};
