import MersenneTwister from 'mersenne-twister';
import SimplexNoise from 'simplex-noise';

import { scaledNoiseGenerator, organicNoiseGenerator, combineMaps } from '../noises/noiseGen';

import { oahuTheme } from '../themes';

class ElevationMap {
  constructor(dimensions, settings) {
    console.info('GENERATE ELEVATION MAP');
    const scaledRngGenerator = new MersenneTwister(settings.scaledNoise.seed);
    const organicRngGenerator = new MersenneTwister(settings.organicNoise.seed);

    const scaledSimplexNoise = new SimplexNoise(scaledRngGenerator.random());
    const organicSimplexNoise = new SimplexNoise(organicRngGenerator.random());

    // noise with smooth transitions
    this._scaledNoise = scaledNoiseGenerator(scaledSimplexNoise, settings.scaledNoise, dimensions);

    // organic noise
    this._organicNoise = organicNoiseGenerator(
      organicSimplexNoise,
      settings.organicNoise,
      dimensions,
    );

    // combine both noises
    this._elevationNoise = combineMaps(
      dimensions,
      this._organicNoise,
      this._scaledNoise,
      settings.combineMaps.weight,
    );
  }

  get scaledNoise() {
    return this._scaledNoise;
  }

  get organicNoise() {
    return this._organicNoise;
  }

  get map() {
    return this._elevationNoise;
  }

  get theme() {
    return oahuTheme;
  }

  get name() {
    return 'HEIGHT MAP';
  }
}

export default ElevationMap;
