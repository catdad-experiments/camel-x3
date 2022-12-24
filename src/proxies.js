const fetchOk = async (url, ...opts) => {
  let res;

  try {
    res = await fetch(url, ...opts);
  } catch (e) {
    throw new Error(`failed to fetch "${url}" with error: ${e.message}`);
  }

  if (!res.ok) {
    throw new Error(`failed to fetch "${url}" with status: ${res.status} ${res.statusText}`);
  }

  return res;
};

const corsSh = async url => await fetchOk(`https://proxy.cors.sh/${url}`);
const thingProxy = async url => await fetchOk(`https://thingproxy.freeboard.io/fetch/${url}`);
const cloudFlareWorker = async url => await fetchOk(`https://test.cors.workers.dev/?${url}`);
const corsAnywhere = async url => await fetchOk(`https://cors-anywhere.herokuapp.com/${url}`);

export const proxies = [corsSh, thingProxy, corsAnywhere, cloudFlareWorker];
