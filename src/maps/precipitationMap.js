import MersenneTwister from 'mersenne-twister';
import SimplexNoise from 'simplex-noise';

import {
  generateNorthToSouthGradient,
  organicNoiseGenerator,
  combineMaps,
} from '../noises/noiseGen';

import { precipitationTheme } from '../themes';

class PrecipitationMap {
  constructor(dimensions, settings, heightMap) {
    console.info('\nGENERATE PRECIPITATION MAP');
    const organicRngGenerator = new MersenneTwister(settings.organicNoise.seed);
    const organicSimplexNoise = new SimplexNoise(organicRngGenerator.random());

    // north to south gradient
    this._northToSouthGradient = generateNorthToSouthGradient(
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
    this._rawPrecipitation = combineMaps(
      dimensions,
      this._northToSouthGradient,
      this._organicNoise,
      settings.combineMaps.weight,
    );

    // more precipitation at highlands and less in the lowlands
    this._precipitationMap = [];
    for (let i = 0; i < dimensions.width; i++) {
      this._precipitationMap[i] = [];
      for (let j = 0; j < dimensions.height; j++) {
        const t = this._rawPrecipitation[i][j];
        const h = heightMap[i][j];
        let value = t;

        if (h > 0.0) {
          value -= (h - settings.rainMap.offset) * settings.rainMap.multiplier;
        }
        this._precipitationMap[i][j] = value;
      }
    }
  }

  get northToSouthGradient() {
    return this._northToSouthGradient;
  }

  get organicNoise() {
    return this._organicNoise;
  }

  get rawPrecipitation() {
    return this._rawPrecipitation;
  }

  get map() {
    return this._precipitationMap;
  }

  get theme() {
    return precipitationTheme;
  }

  get name() {
    return 'RAIN MAP';
  }
}

export default PrecipitationMap;
