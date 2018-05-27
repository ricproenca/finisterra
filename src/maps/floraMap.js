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

class FloraMap {
  constructor(dimensions, elevationMap, temperatureMap, precipitationMap) {
    console.info('\nGENERATE FLORA MAP');
    const START = Date.now();

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
    return 'FlORA MAP';
  }
}

export default FloraMap;
