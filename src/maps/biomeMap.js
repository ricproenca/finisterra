import { biomeTheme } from '../themes';

const classifyBiome = (elevation, temperature, precipitation) => {
  let biome = 'void';
  if (elevation < 0) {
    // ocean biomes
    biome = 'ocean';

    if (temperature > 0.25) {
      biome = 'tropical-ocean';
    }
    if (temperature < -0.25) {
      biome = 'arctic-ocean';
    }
    if (temperature <= 0.25 && temperature >= -0.25) {
      biome = 'temperate-ocean';
    }
  } else {
    // land biomes
    if (temperature < -0.25) {
      // the chilly biomes
      if (precipitation > -1.0) {
        biome = 'cold-desert';
      }
      if (precipitation > -0.25) {
        biome = 'tundra';
      }
      if (precipitation > 0.0) {
        biome = 'taiga-frontier';
      }
      if (precipitation > 0.25) {
        biome = 'taiga';
      }
      if (precipitation > 0.5) {
        biome = 'taiga-rainforest';
      }
    }

    if (temperature > 0.25) {
      // the hot biomes
      if (precipitation > -1) {
        biome = 'hot-desert';
      }
      if (precipitation > -0.25) {
        biome = 'hot-savanna';
      }
      if (precipitation > 0.0) {
        biome = 'tropical-frontier'; // meaning between grass and forest
      }
      if (precipitation > 0.25) {
        biome = 'tropical-forest';
      }
      if (precipitation > 0.5) {
        biome = 'tropical-rainforest';
      }
    }

    if (temperature <= 0.25 && temperature >= -0.25) {
      // the temperate biomes
      if (precipitation > -1) {
        biome = 'temperate-desert';
      }
      if (precipitation > -0.25) {
        biome = 'temperate-grassland';
      }
      if (precipitation > 0.0) {
        biome = 'temperate-frontier'; // meaning between grass and forest
      }
      if (precipitation > 0.25) {
        biome = 'temperate-forest';
      }
      if (precipitation > 0.5) {
        biome = 'temperate-rainforest';
      }
    }

    //
    if (temperature < -0.55) {
      biome = 'snow';
    }

    if (temperature < -0.66) {
      biome = 'glacier';
    }
  }
  if (biome === 'void') {
    biome = 'nothing';
    console.log(elevation, temperature, precipitation);
  }
  return biome;
};

class BiomeMap {
  constructor(dimensions, elevationMap, temperatureMap, precipitationMap) {
    console.info('\nGENERATE BIOME MAP');
    const START = Date.now();
    this._biomeMap = [];
    for (let i = 0; i < dimensions.width; i++) {
      this._biomeMap[i] = [];
      for (let j = 0; j < dimensions.height; j++) {
        const e = elevationMap[i][j];
        const t = temperatureMap[i][j];
        const p = precipitationMap[i][j];

        const biome = classifyBiome(e, t, p);
        this._biomeMap[i][j] = biome;
      }
    }
    const STOP = Date.now();
    console.log(`biomes classified in ${STOP - START} ms`);
  }

  get map() {
    return this._biomeMap;
  }

  get theme() {
    return biomeTheme;
  }

  get name() {
    return 'BIOME MAP';
  }
}

export default BiomeMap;
