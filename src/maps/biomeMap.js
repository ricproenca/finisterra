import { biomeTheme } from '../themes';
import classifyBiome from '../classifiers/biome';

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
