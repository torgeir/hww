const keymap = {
    8: 'backspace',
    9: 'tab',
   13: 'enter',
   16: 'shift',
   17: 'ctrl',
   18: 'alt',
   20: 'capslock',
   27: 'esc',
   32: 'space',
   33: 'pageup',
   34: 'pagedown',
   35: 'end',
   36: 'home',
   37: 'left',
   38: 'up',
   39: 'right',
   40: 'down',
   45: 'ins',
   46: 'del',
   91: 'meta',
   93: 'meta',
  224: 'meta',
  106: '*',
  107: '+',
  109: '-',
  110: '.',
  111: '/',
  186: ';',
  187: '=',
  188: ',',
  189: '-',
  190: '.',
  191: '/',
  192: '`',
  219: '[',
  220: '\\',
  221: ']',
  222: '\''
};

const aliases = {
  'delete': 'backspace',
  'cmd': 'meta',
  'control': 'ctrl'
};

const isInput = function (e) {
  const element = e.target || e.srcElement;
  if (element.className.indexOf('with-hotkeys') > -1) {
    return false;
  }
  return element.tagName === 'INPUT' ||
    element.tagName === 'SELECT' ||
    element.tagName === 'TEXTAREA' ||
    element.isContentEditable;
};

const lookupKey = function (keyCode) {
  return keymap[keyCode] || String.fromCharCode(keyCode).toLowerCase();
};

let currentKey = [];

const addKey = function (key) {
  if (currentKey.indexOf(key) == -1) {
    currentKey.push(key);
    currentKey.sort();
  }
};

const removeKey = function (key) {
  const keyIndex = currentKey.indexOf(key);
  if (keyIndex != -1) {
    currentKey.splice(keyIndex, 1);
  }
};

const uniqueKeyCombo = (keyCombo) => keyCombo.split(" ").map(key => aliases[key] || key).sort().join(" ");
const currentKeyCombo = () => currentKey.join(" ");

const keys = function () {

  document.addEventListener('keydown', function (e) {
    if (isInput(e)) {
      return;
    }

    const { keyCode } = e;
    const key = lookupKey(keyCode);
    addKey(key);

    if (e.ctrlKey)  { addKey('ctrl'); }  // eslint-disable-line
    if (e.shiftKey) { addKey('shift'); } // eslint-disable-line
    if (e.altKey)   { addKey('alt'); }   // eslint-disable-line
    if (e.metaKey)  { addKey('meta'); }  // eslint-disable-line

    const combo = currentKeyCombo();
    const fn = listeners[combo];
    if (typeof fn == 'function') {
      fn();
      removeKey(key);
    }

    const hasModifier = e.ctrlKey || e.shiftKey || e.altKey || e.metaKey;
    if (hasModifier) {
      // e.g. `meta ,` does not fire keyup for `,` if `meta` is released first, help out
      // this means we don't handle multiple simultaneous keys with modifiers
      currentKey = [];
    }
  });

  document.addEventListener('keyup', function (e) {
    if (isInput(e)) {
      return;
    }

    const { keyCode } = e;
    const key = lookupKey(keyCode);
    removeKey(key);
  });

  let listeners;
  let runThrottled;

  return function (effects) {
    const { keys } = effects;
    if (keys.length == 0) {
      return;
    }

    listeners = {};

    keys.forEach(function (keyCombos) {
      Object.keys(keyCombos)
        .forEach(function (keyCombo) {
          const sortedKeyCombo = uniqueKeyCombo(keyCombo);
          const shortcut = keyCombos[keyCombo];
          const existingShortcut = listeners[sortedKeyCombo];
          listeners[sortedKeyCombo] = existingShortcut
            ? combine(existingShortcut, shortcut)
            : shortcut;
        });
    });
  };
};

export default keys;

function combine (f, g) {
  return function (...args) {
    f(...args);
    g(...args);
  };
}
