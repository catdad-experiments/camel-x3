const fetchOk = async (url, ...opts) => {
  const res = await fetch(url, ...opts);

  if (!res.ok) {
    throw new Error(`failed to load with error: ${res.status}`);
  }

  return res;
};

const corsSh = async url => await fetchOk(`https://proxy.cors.sh/${url}`);
const thingProxy = async url => await fetchOk(`https://thingproxy.freeboard.io/fetch/${url}`);
const cloudFlareWorker = async url => await fetchOk(`https://test.cors.workers.dev/?${url}`);
const corsAnywhere = async url => await fetchOk(`https://cors-anywhere.herokuapp.com/${url}`);

export const getUrl = async url => {
  for (const proxy of [corsSh, thingProxy, corsAnywhere, cloudFlareWorker]) {
    try {
      return await proxy(url);
    } catch (e) {}
  }

  throw new Error('all proxies failed to get a successful response');
};
