import Key from './key';

// handled keys
const KEY_MAP = {
  27: 'escape',
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
};

class Keyboard {
  constructor() {
    this.keys = {};

    Object.keys(KEY_MAP).forEach((k) => {
      const key = new Key(k);
      this.keys[k] = key;
      this[key.name] = key;
    });

    window.addEventListener('keydown', (e) => {
      const key = this.keys[e.keyCode];
      if (key) {
        key.onPress();
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = this.keys[e.keyCode];
      if (key) {
        key.onRelease();
      }
    });
  }
}

export default Keyboard;
