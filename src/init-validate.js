const FEATURES = [
  'Promise',
  'Map',
  ['dynamic import', () => {
    try {
      new Function('import("").catch(() => {})')();
      return true;
    } catch (err) {
      return false;
    }
  }],
  ['async/await', () => {
    try {
      new Function('async () => {}');
      return true;
    } catch (err) {
      return false;
    }
  }],
  ['Rest Parameters', () => {
    try {
      new Function('function f(...rest) {}')(1,2);
      return true;
    } catch (err) {
      return false;
    }
  }],
  ['Destructuring Rest Parameters', () => {
    try {
      new Function('function f({ a, ...rest }) {}')({a:1,b:2});
      return true;
    } catch (err) {
      return false;
    }
  }]
];

function throwMissingFeatures(missing) {
  const err = new Error([
    'It seems your browser is not supported. The following features are missing:',
    missing.join(', ')
  ].join('\n'));

  err.prepared = true;
  throw err;
}

export default function () {
  // detect missing features in the browser
  const missingFeatures = FEATURES.filter(function (name) {
    if (Array.isArray(name)) {
      const [, test] = name;

      return !test();
    }

    return !name.split('.').reduce(function (obj, path) {
      return (obj || {})[path];
    }, window);
  }).map(v => Array.isArray(v) ? v[0] : v);

  if (missingFeatures.length) {
    throwMissingFeatures(missingFeatures);
  }
}
