import { weightedMean, scale } from '../utils/MathHelper';

let MAX = -9999;
let MIN = 9999;
let START = 0;
let STOP = 0;

const resetmaxmin = () => {
  START = Date.now();
  MAX = -9999;
  MIN = 9999;
};

const setmaxmin = (value) => {
  if (value < MIN) {
    MIN = value;
  }
  if (value > MAX) {
    MAX = value;
  }
};

const logmaxmin = (text) => {
  STOP = Date.now();
  console.log(`${text} [${MIN}, ${MAX}] in ${STOP - START} ms`);
};

const sumOctave = (simplexNoise, numIterations, x, y, persistence, fScale, low, high) => {
  let maxAmp = 0;
  let amp = 1;
  let freq = fScale;
  let noise = 0;

  // add successively smaller, higher-frequency terms
  for (let i = 0; i < numIterations; ++i) {
    noise += simplexNoise.noise2D(x * freq, y * freq) * amp;
    maxAmp += amp;
    amp *= persistence;
    freq *= 2;
  }

  // take the average value of the iterations
  noise /= maxAmp;

  // normalize the result
  noise = noise * (high - low) / 2 + (high + low) / 2;
  return noise;
};

/** ******************************************************************* */

/*
* Frequency it's like zooming in and out.
* Lower frequency -> larger areas of valleys and mountains
* Higher frequency -> smaller areas of valleys and mountains
*/
const scaledNoiseGenerator = (simplexNoise, noiseConfig, dimensions) => {
  resetmaxmin();
  const map = [];
  for (let x = 0; x < dimensions.width; x++) {
    map[x] = [];
    for (let y = 0; y < dimensions.height; y++) {
      const noise = simplexNoise.noise2D(x * noiseConfig.xFrequency, y * noiseConfig.yFrequency);
      const value = (noise + 1) / 2;

      setmaxmin(value);
      map[x][y] = value;
    }
  }
  logmaxmin('generated smooth noise');
  return map;
};

/*
* A bit more chaotic and organic noise.
* To get this, we’re going to need to use another technique: fractal Brownian motion.
* This method works by using our noise function for multiple iterations.
* In each successive iteration, we should decrease the amplitude and increase the frequency.
* It then sums all these iterations together and takes the average.
* From there, we can normalize the value and add the result to our array.
*/
const organicNoiseGenerator = (simplexNoise, noiseConfig, dimensions) => {
  resetmaxmin();
  const map = [];
  for (let x = 0; x < dimensions.width; x++) {
    map[x] = [];
    for (let y = 0; y < dimensions.height; y++) {
      const value = sumOctave(
        simplexNoise,
        noiseConfig.octaves,
        x,
        y,
        noiseConfig.persistence,
        noiseConfig.scale,
        noiseConfig.low,
        noiseConfig.high,
      );
      setmaxmin(value);
      map[x][y] = value;
    }
  }
  logmaxmin('generated organic noise');
  return map;
};

// Averages the values of each map, applying weight
// 1.0 is equality
// 2.0 will double the contribution of mapA to the result
// 0.5 will do the exact opposite
const combineMaps = (dimensions, mapA, mapB, weight = 1, low = -1, high = 1) => {
  resetmaxmin();

  const map = [];
  for (let x = 0; x < dimensions.width; x++) {
    map[x] = [];
    for (let y = 0; y < dimensions.height; y++) {
      const a = mapA[x][y];
      const b = mapB[x][y];
      let value = weightedMean(a, b, weight);

      if (value > high) value = high;
      if (value < low) value = low;

      setmaxmin(value);
      map[x][y] = value;
    }
  }

  logmaxmin('combine noises');
  return map;
};

const generateSouthToNorthGradient = (dim, x1, x2, value1, value2) => {
  resetmaxmin();

  const map = [];
  for (let x = 0; x < dim.width; x++) {
    map[x] = [];
    for (let y = 0; y < dim.height; y++) {
      const value = scale(y, x1, x2, value1, value2);

      setmaxmin(value);
      map[x][y] = value;
    }
  }

  logmaxmin('Vertical South to North Gradient Noise');
  return map;
};

const generateNorthToSouthGradient = (dim, x1, x2, value1, value2) => {
  resetmaxmin();

  const map = [];
  for (let x = 0; x < dim.width; x++) {
    map[x] = [];
    for (let y = 0; y < dim.height; y++) {
      const value = scale(y, x2, x1, value1, value2);

      setmaxmin(value);
      map[x][y] = value;
    }
  }

  logmaxmin('Vertical North to South Gradient Noise');
  return map;
};

export {
  combineMaps,
  organicNoiseGenerator,
  scaledNoiseGenerator,
  generateSouthToNorthGradient,
  generateNorthToSouthGradient,
};
export default {
  combineMaps,
  organicNoiseGenerator,
  scaledNoiseGenerator,
  generateSouthToNorthGradient,
  generateNorthToSouthGradient,
};
