import { scale, getRandomInt } from '../utils/MathHelper';
import { floraTheme } from '../themes';

class FloraMap {
  constructor(dimensions, elevationMap, temperatureMap, precipitationMap) {
    console.info('\nGENERATE FLORA MAP');
    const START = Date.now();

    let countNothing = 0;
    let countVegetation = 0;
    let countTree = 0;
    let countRock = 0;

    this._floraMap = [];
    for (let i = 0; i < dimensions.width; i++) {
      this._floraMap[i] = [];
      for (let j = 0; j < dimensions.height; j++) {
        // const t = temperatureMap[i][j].value;
        const h = elevationMap[i][j];
        const p = precipitationMap[i][j];

        let flora = 'nothing';

        if (h > 0.0) {
          const scaledP = scale(p, -1.0, 1.0, 0, 1);

          // This math is really a placeholder
          // For now it means that the probability of a tile
          // having vegetation grows exponentially with rain
          // plain ol' vegetation is weighed twice as much as a tree
          const exponentialGrowth = scaledP * 10 * scaledP * 10;

          if (scaledP > 0 && getRandomInt(0, 100) < exponentialGrowth * -1) {
            // future: different types of vegetation, based on biome
            flora = 'vegetation';
          } else if (scaledP > 0 && getRandomInt(0, 100) < exponentialGrowth) {
            // future: different types of trees
            flora = 'tree';
          }

          // rocks overwrite other things
          // It's not flora, but its in here for now!
          // Rocks appear exponentially with elevation
          if (getRandomInt(0, 100) < h * 10) {
            // future: different types of rocks
            flora = 'rock';
          }

          // future: other features other than rocks and trees!
        }

        switch (flora) {
          case 'nothing':
            countNothing++;
            break;
          case 'vegetation':
            countVegetation++;
            break;
          case 'tree':
            countTree++;
            break;
          case 'rock':
            countRock++;
            break;
          default:
            break;
        }
        this._floraMap[i][j] = flora;
      }
    }

    const STOP = Date.now();
    console.log(`flora map generated in ${STOP - START} ms`);

    console.log('nothing', countNothing);
    console.log('vegetation', countVegetation);
    console.log('tree', countTree);
    console.log('rock', countRock);
    console.log(countRock + countTree + countVegetation);
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
