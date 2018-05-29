import Poisson from 'poisson-disk-sampling';

// import { scale, getRandomInt } from '../utils/MathHelper';
import { floraTheme } from '../themes';

const classifyFlora = (elevation, temperature, precipitation) => {
  let flora = 'void';
  if (elevation < 0) {
    // ocean biomes
    flora = 'any';

    if (temperature > 0.25) {
      flora = 'any';
    }
    if (temperature < -0.25) {
      flora = 'any';
    }
    if (temperature <= 0.25 && temperature >= -0.25) {
      flora = 'any';
    }
  } else {
    // land floras
    if (temperature < -0.25) {
      // the chilly floras
      if (precipitation > -1.0) {
        flora = 'superarid';
      }
      if (precipitation > -0.25) {
        flora = 'humid';
      }
      if (precipitation > 0.0) {
        flora = 'humid';
      }
      if (precipitation > 0.25) {
        flora = 'superhumid';
      }
      if (precipitation > 0.5) {
        flora = 'superhumid';
      }
    }

    if (temperature > 0.25) {
      // the hot floras
      if (precipitation > -1.0) {
        flora = 'superarid';
      }
      if (precipitation > -0.25) {
        flora = 'arid';
      }
      if (precipitation > 0.0) {
        flora = 'humid'; // meaning between grass and forest
      }
      if (precipitation > 0.25) {
        flora = 'humid';
      }
      if (precipitation > 0.5) {
        flora = 'superhumid';
      }
    }

    if (temperature <= 0.25 && temperature >= -0.25) {
      // the temperate floras
      if (precipitation > -1.0) {
        flora = 'superarid';
      }
      if (precipitation > -0.25) {
        flora = 'arid';
      }
      if (precipitation > 0.0) {
        flora = 'humid';
      }
      if (precipitation > 0.25) {
        flora = 'superhumid';
      }
      if (precipitation > 0.5) {
        flora = 'superhumid';
      }
    }

    //
    if (temperature < -0.55) {
      flora = 'arid';
    }

    if (temperature < -0.66) {
      flora = 'any';
    }
  }
  if (flora === 'void') {
    flora = 'nothing';
    console.log(elevation, temperature, precipitation);
  }
  return flora;
};

class FloraMap {
  constructor(dimensions, elevationMap, temperatureMap, precipitationMap) {
    console.info('\nGENERATE FLORA MAP');
    const START = Date.now();

    const poisson = new Poisson([dimensions.width, dimensions.height], 5, 10, 10);
    const points = poisson.fill();

    this._floraMap = [];
    for (let x = 0; x < dimensions.width; x++) {
      this._floraMap[x] = [];
      for (let y = 0; y < dimensions.height; y++) {
        this._floraMap[x][y] = 'nothing';

        const e = elevationMap[x][y];
        const t = temperatureMap[x][y];
        const p = precipitationMap[x][y];

        const biomeType = classifyFlora(e, t, p);
        if (biomeType === 'superhumid') {
          for (let z = 0; z < points.length; z++) {
            /* eslint no-bitwise: 0 */
            const pointX = ~~points[z][0];
            const pointY = ~~points[z][1];
            if (x === pointX && y === pointY) {
              this._floraMap[x][y] = 'tree';
            }
          }
        }
      }
    }

    const STOP = Date.now();
    console.log(`flora map generated in ${STOP - START} ms`);
  }

  get map() {
    return this._floraMap;
  }

  get theme() {
    return floraTheme;
  }

  get name() {
    return 'FLORA MAP';
  }
}

export default FloraMap;
