import Poisson from 'poisson-disk-sampling';
import classifyFlora from '../classifiers/flora';
import { floraTheme } from '../themes';

const keyify = (x, y) => `${x},${y}`;

class FloraMap {
  constructor(dimensions, floraBiomes, elevationMap, temperatureMap, precipitationMap) {
    console.info('\nGENERATE FLORA MAP');
    const START = Date.now();

    this._keyPoints = {};

    this._createFloraMap(dimensions);

    Object.entries(floraBiomes).forEach((entry) => {
      const [biomeType, pdsSettings] = entry;
      const pds = new Poisson(
        [dimensions.width, dimensions.height],
        pdsSettings.sampleMinDistance, pdsSettings.sampleMaxDistance, pdsSettings.maxTries,
      );
      const points = pds.fill();

      this._generateBiomeFlora(
        biomeType, points, dimensions,
        elevationMap, temperatureMap, precipitationMap,
      );
    });

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

  _createFloraMap(dimensions) {
    this._floraMap = [];
    for (let x = 0; x < dimensions.width; x++) {
      this._floraMap[x] = [];
      for (let y = 0; y < dimensions.height; y++) {
        this._floraMap[x][y] = 'nothing';
      }
    }
  }

  _generateBiomeFlora(
    biomeName, points, dimensions,
    elevationMap, temperatureMap, precipitationMap,
  ) {
    let PDS_POINTS = 0;

    points.forEach((point) => {
      const x = ~~point[0];
      const y = ~~point[1];
      if (this._floraMap[x][y] === 'nothing') {
        /* eslint no-bitwise: 0 */
        this._keyPoints[keyify(x, y)] = biomeName;
      }
    });

    for (let x = 0; x < dimensions.width; x++) {
      for (let y = 0; y < dimensions.height; y++) {
        const e = elevationMap[x][y];
        const t = temperatureMap[x][y];
        const p = precipitationMap[x][y];

        const biomeType = classifyFlora(e, t, p);
        if (biomeType === biomeName && this._keyPoints[keyify(x, y)] === biomeName) {
          this._floraMap[x][y] = 'tree';
          PDS_POINTS++;
        }
      }
    }
    console.log(`${biomeName} has ${PDS_POINTS} flora points`);
  }
}

export default FloraMap;
