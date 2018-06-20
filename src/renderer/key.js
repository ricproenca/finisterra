/* eslint no-debugger: 0 */

// handled keys
const KEY_MAP = {
  27: 'escape',
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
};

class Key {
  constructor(code) {
    this.code = code;
    this.name = KEY_MAP[code];
    this.pressed = false;
  }

  onPress() {
    this.pressed = true;
  }

  onRelease() {
    this.pressed = false;
  }
}

export default Key;
