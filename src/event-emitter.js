export default () => {
  const events = {};
  const api = {};
  let collection = [];
  let paused = false;

  function addEvent(name, func, wrapped) {
    const evName = name.toLowerCase();
    events[evName] = events[evName] || [];

    events[evName].push({
      func: func,
      wrapped: wrapped
    });

    return api;
  }

  function removeEvent(name, func) {
    events[name] = events[name].filter(obj => obj.func !== func);
    return api;
  }

  api.on = (name, func) => {
    return addEvent(name, func, func);
  };

  api.once = (name, func) => {
    return addEvent(name, func, (...args) => {
      func(...args);
      removeEvent(name, func);
    });
  };

  api.off = (name, func) => {
    const evName = name.toLowerCase();

    if (!events[evName]) {
      return api;
    }

    return removeEvent(evName, func);
  };

  api.emit = (name, ...args) => {
    const evName = name.toLowerCase();

    if (paused) {
      collection.push([name, ...args]);
      return api;
    }

    if (!events[evName]) {
      return api;
    }

    events[evName].forEach(obj => obj.wrapped(...args));

    return api;
  };

  api.pause = () => {
    paused = true;
    return api;
  };

  api.resume = () => {
    paused = false;
    collection.forEach(args => api.emit(...args));
    collection = [];
    return api;
  };

  return api;
};
