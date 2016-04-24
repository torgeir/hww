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

const keys = function () {

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

  document.addEventListener('keydown', function (e) {
    if (isInput(e)) {
      return;
    }
    const { keyCode } = e;
    const fn = listeners[keymap[keyCode]];
    if (typeof fn == 'function') {
      fn();
    }
  });

  const listeners = {};

  return function (effects) {
    const { keys } = effects;
    if (keys.length == 0) {
      return;
    }
    Object.keys(keys)
          .forEach(function (key) {
            listeners[key] = keys[key];
          });
  };
};


export default keys;
