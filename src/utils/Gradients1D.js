import { hexToRgb } from './ColorHelper';
import { lerpColor } from './MathHelper';

const sanitizeColor = (color) => {
  if (typeof color === 'string' && color.indexOf('#') === 0) {
    return hexToRgb(color);
  } else if (typeof color.r === 'number') {
    return color;
  }
  throw Error('Unable to understand color format. Use hex #FFFFFF or { r: 255, g: 255: b: 255 }');
};

class Gradient1D {
  constructor(anchors) {
    this.anchors = [];
    Object.keys(anchors).forEach((prop) => {
      this.anchors.push({
        value: parseFloat(prop),
        color: sanitizeColor(anchors[prop]),
      });
    });
  }

  colorAt(n) {
    // hack, b/c exact 1.0 and -1.0 don't work... need to change > to >=
    // but not going to test all that yet, so this remains for now
    // also acts as a bounds check
    let nBounded = n;
    if (nBounded > 0.99) {
      nBounded = 0.99;
    }
    if (nBounded < -0.99) {
      nBounded = -0.99;
    }

    // for n, find closet two anchor points
    let max = { value: 9999, color: this.anchors[this.anchors.length - 1] };
    let min = { value: -9999, color: this.anchors[0] };

    for (let i = 0; i < this.anchors.length; i++) {
      const curr = this.anchors[i];
      if (curr.value < max.value && curr.value > nBounded) {
        max = curr;
      }
      if (curr.value > min.value && curr.value < nBounded) {
        min = curr;
      }
    }

    // then linearly interpolate a blended color between these two anchor points
    const portion = (nBounded - min.value) / (max.value - min.value);
    const color = lerpColor(min.color, max.color, portion);

    return color;
  }

  getRGBA(n) {
    const color = this.colorAt(n);
    return `rgba(${Math.floor(color.r)},${Math.floor(color.g)},${Math.floor(color.b)}, 1.0)`;
  }

  getHex(n) {
    const rgba = this.getRGBA(n);
    const rgb = rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return rgb && rgb.length === 4
      ? `0x${`0${parseInt(rgb[1], 10).toString(16)}`.slice(-2)}${`0${parseInt(rgb[2], 10).toString(16)}`.slice(-2)}${`0${parseInt(rgb[3], 10).toString(16)}`.slice(-2)}`
      : '';
  }
}

export default Gradient1D;
