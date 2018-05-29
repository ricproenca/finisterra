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

const keyify = (x, y) => `${x},${y}`;

class FloraMap {
  constructor(dimensions, elevationMap, temperatureMap, precipitationMap) {
    console.info('\nGENERATE FLORA MAP');
    const START = Date.now();

    const poisson = new Poisson([dimensions.width, dimensions.height], 2, 10, 10);
    const points = poisson.fill();

    const keyPoints = {};

    points.forEach((point) => {
      /* eslint no-bitwise: 0 */
      keyPoints[keyify(~~point[0], ~~point[1])] = 'superarid';
    });

    console.log('keyPoints', keyPoints);

    this._floraMap = [];
    for (let x = 0; x < dimensions.width; x++) {
      this._floraMap[x] = [];
      for (let y = 0; y < dimensions.height; y++) {
        this._floraMap[x][y] = 'nothing';

        const e = elevationMap[x][y];
        const t = temperatureMap[x][y];
        const p = precipitationMap[x][y];

        const biomeType = classifyFlora(e, t, p);
        if (biomeType === 'superarid' && keyPoints[keyify(x, y)] === 'superarid') {
          this._floraMap[x][y] = 'tree';
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
