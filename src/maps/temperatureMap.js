import MersenneTwister from 'mersenne-twister';
import SimplexNoise from 'simplex-noise';

import {
  generateSouthToNorthGradient,
  organicNoiseGenerator,
  combineMaps,
} from '../noises/noiseGen';

import { temperatureTheme } from '../themes';

class TemperatureMap {
  constructor(dimensions, settings, heightMap) {
    console.info('\nGENERATE TEMPERATURE MAP');
    const organicRngGenerator = new MersenneTwister(settings.organicNoise.seed);
    const organicSimplexNoise = new SimplexNoise(organicRngGenerator.random());

    // south to north gradient
    this._southToNorthGradient = generateSouthToNorthGradient(
      dimensions,
      0,
      dimensions.width,
      -1.0,
      1.0,
    );

    // organic noise
    this._organicNoise = organicNoiseGenerator(
      organicSimplexNoise,
      settings.organicNoise,
      dimensions,
    );

    // combine both noises
    this._rawTemperature = combineMaps(
      dimensions,
      this._southToNorthGradient,
      this._organicNoise,
      settings.combineMaps.weight,
    );

    // colder at highlands and warmer in the lowlands
    this._temperatureMap = [];
    for (let i = 0; i < dimensions.width; i++) {
      this._temperatureMap[i] = [];
      for (let j = 0; j < dimensions.height; j++) {
        const t = this._rawTemperature[i][j];
        const h = heightMap[i][j];
        let value = t;

        if (h > 0.0) {
          value -= (h - settings.heatMap.offset) * settings.heatMap.multiplier;
        }
        this._temperatureMap[i][j] = value;
      }
    }
  }

  get southToNorthGradient() {
    return this._southToNorthGradient;
  }

  get organicNoise() {
    return this._organicNoise;
  }

  get rawTemperature() {
    return this._rawTemperature;
  }

  get map() {
    return this._temperatureMap;
  }

  get theme() {
    return temperatureTheme;
  }

  get name() {
    return 'HEAT MAP';
  }
}

export default TemperatureMap;
