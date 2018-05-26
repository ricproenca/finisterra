import MersenneTwister from 'mersenne-twister';

const mersenne = new MersenneTwister();

const distance = (x1, y1, x2, y2) => {
  const x = x2 - x1;
  const y = y2 - x1;
  return Math.sqrt(x * x + y * y);
};

const scale = (n, a, b, c, d) => (d - c) * (n - a) / (b - a) + c;

const lerp = (a, b, portion) => a + (b - a) * portion;

const lerpColor = (colorA, colorB, portion) => ({
  r: lerp(colorA.r, colorB.r, portion),
  g: lerp(colorA.g, colorB.g, portion),
  b: lerp(colorA.b, colorB.b, portion),
});

const getRandomInt = (min, max) => Math.floor(mersenne.random() * (max - min + 1)) + min;

const weightedMean = (a, b, weight) => (a * weight + b * 1 / weight) / 2;

export { distance, getRandomInt, lerp, lerpColor, scale, weightedMean };

export default {
  distance,
  getRandomInt,
  lerp,
  lerpColor,
  scale,
  weightedMean,
};
