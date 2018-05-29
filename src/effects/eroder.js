/* eslint prefer-destructuring: 0 */
/* eslint no-unused-vars: 0 */
/* eslint no-shadow: 0 */

import { getRandomInt, vectorLength } from '../utils/MathHelper';

const xyKey = (x, y) => `${x},${y}`;

const allEvar = {};

class Eroder {
  constructor(dimensions, slopeMap, map) {
    console.info('\nGENERATE EROSION');
    this.dim = dimensions;
    this.slopeMap = slopeMap;
    this.map = map;
  }

  applyErosion() {
    console.info('\nAPPLY EROSION TO MAP');
    const start = Date.now();
    const allRiverTiles = [];

    // river pass needs to run before erosion pass, otherwise the rivers
    // are prone to ending in the small dips created by the erosion drops

    // river pass
    for (let i = 0; i < 200; i++) {
      const result = this.flow(
        getRandomInt(0, this.dim.width),
        getRandomInt(0, this.dim.height),
        0.02,
        true,
        this.map,
      );

      for (let j = 0; j < result.riverTiles.length; j++) {
        allRiverTiles.push(result.riverTiles[j]);
      }
    }

    // erosion pass
    for (let i = 0; i < 15000; i++) {
      const result = this.flow(
        getRandomInt(0, this.dim.width),
        getRandomInt(0, this.dim.height),
        0.005,
        false,
        this.map,
      );
    }

    const finish = Date.now();
    console.log(`eroder completed ${allRiverTiles.length} tiles in ${finish - start} ms`);
    return allRiverTiles;
  }

  flow(x, y, erosionStrength, isRiver) {
    // console.log('flow', x, y, momentum, water, particulates, curr)
    const limit = isRiver ? 300 : 100;
    let curr = 0;
    const immune = {};
    const todo = [];
    const riverTiles = [];
    const slopeMap = this.slopeMap;
    const self = this;
    const isLowest = this.isLowest;

    const momentum = { x: 0, y: 0 };

    let dirt = 0;

    const innerFlow = (x, y) => {
      curr++;
      // console.log('flow', x, y, momentum, water, particulates, curr)
      if (!slopeMap.boundsCheck(x, y)) {
        // console.log('flow concluded: ran off edge of map')
        return;
      }

      if (curr > limit) {
        // console.log('flow concluded: hit limit of ' + limit + ' iterations')
        return;
      }

      if (allEvar[xyKey(x, y)]) {
        return;
      }

      if (self.map[x][y] <= 0) {
        return;
      }

      const threshold = isRiver ? 1 : 0.98;

      const slope = self.slopeMap.getTile(x, y);
      // slope may be inverted somewhere, this only goes downhill if slope is subtracted
      momentum.x -= slope.x;
      momentum.y -= slope.y;

      if (self.isLowest(x, y, threshold)) {
        todo.push(() => {
          self.deposit(x + 1, y, erosionStrength, this.map);
        });
        todo.push(() => {
          self.deposit(x - 1, y, erosionStrength, this.map);
        });
        todo.push(() => {
          self.deposit(x, y + 1, erosionStrength, this.map);
        });
        todo.push(() => {
          self.deposit(x, y - 1, erosionStrength, this.map);
        });
        todo.push(() => {
          self.deposit(x, y, erosionStrength, this.map);
        });
        dirt -= erosionStrength * 12;
        // console.log('flow concluded: arrived at lowest point')
        if (!isRiver) {
          return;
        }
      } else {
        const magnitude = vectorLength(momentum);
        if (dirt > magnitude && !self.isHighest(x, y, 1.0)) {
          todo.push(() => {
            self.deposit(x + 1, y, erosionStrength, this.map);
          });
          todo.push(() => {
            self.deposit(x - 1, y, erosionStrength, this.map);
          });
          todo.push(() => {
            self.deposit(x, y + 1, erosionStrength, this.map);
          });
          todo.push(() => {
            self.deposit(x, y - 1, erosionStrength, this.map);
          });
          todo.push(() => {
            self.deposit(x, y, erosionStrength, this.map);
          });

          dirt -= erosionStrength * 12;
          // momentum.x *= 0.99
          // momentum.y *= 0.99
        } else {
          todo.push(() => {
            self.erode(x, y, erosionStrength, this.map);
          });
          dirt += erosionStrength * 18;
        }
      }

      // mark the tile, used by the rendering code to draw blue river overlay
      if (isRiver) {
        riverTiles.push({ x, y });
        // riverTiles.push({x: x+1, y: y})
        // riverTiles.push({x: x, y: y+1})
        // riverTiles.push({x: x+1, y: y+1})
        allEvar[xyKey(x, y)] = true;
        // allEvar[xyKey(x+1, y)] = true
        // allEvar[xyKey(x+1, y+1)] = true
        // allEvar[xyKey(x, y+1)] = true
      }

      // mark the tile as immune, it cannot be eroded again this flow
      immune[xyKey(x, y)] = true;

      // console.log(momentum, magnitude, dirt)

      // lose momentum each tile, so that slope is a large factor in our direction (rather than
      // building up speed and making a very straight line)
      // momentum.x *= 0.98
      // momentum.y *= 0.98

      let next = self.chooseDirection(momentum);

      const maxTries = 2;
      let tries = 0;
      // flow in another direction if we've already flown here before
      while (xyKey(x + next.x, y + next.y) in immune && ++tries < maxTries) {
        // console.log('rerolling direction due to immunity')
        next = self.chooseDirection(momentum);
      }
      innerFlow(x + next.x, y + next.y);
    };

    innerFlow(x, y);

    for (let j = 0; j < todo.length; j++) {
      todo[j]();
    }

    return { todo, riverTiles };
  }

  isLowest(x, y, threshold) {
    const here = this.map[x][y];
    if (
      here < this.map[x + 1][y] * threshold &&
      here < this.map[x - 1][y] * threshold &&
      here < this.map[x][y + 1] * threshold &&
      here < this.map[x][y - 1] * threshold
    ) {
      return true;
    }

    return false;
  }

  isHighest(x, y, threshold) {
    const here = this.map[x][y];
    if (
      here > this.map[x + 1][y] * threshold &&
      here > this.map[x - 1][y] * threshold &&
      here > this.map[x][y + 1] * threshold &&
      here > this.map[x][y - 1] * threshold
    ) {
      return true;
    }

    return false;
  }

  // deposit sediment
  deposit(x, y, amount) {
    let currTile = this.map[x][y];

    const neighbors = [{ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 }];

    let highestNeighorValue = -99;
    let highestNeighbor = false;

    // find the highest neighbor
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];

      if (this.slopeMap.boundsCheck(neighbor.x, neighbor.y)) {
        const neighborValue = this.map[neighbor.x][neighbor.y];
        if (neighborValue > highestNeighorValue) {
          highestNeighorValue = neighborValue;
          highestNeighbor = neighbor;
        }
      }
    }

    // only deposit up to the highest neighbor's height
    if (highestNeighbor) {
      if (highestNeighorValue > currTile) {
        const maxFillAmount = highestNeighorValue - currTile;

        if (amount < maxFillAmount) {
          // console.log('filling amount', amount)
          currTile += amount;
        } else {
          // console.log('max amount', maxFillAmount)
          currTile += maxFillAmount;
        }
      }
    }

    this.slopeMap.recalculate(x, y, this.map);
    this.slopeMap.recalculate(x + 1, y, this.map);
    this.slopeMap.recalculate(x - 1, y, this.map);
    this.slopeMap.recalculate(x, y + 1, this.map);
    this.slopeMap.recalculate(x, y - 1, this.map);
  }

  erode(x, y, amount) {
    this.map[x][y] -= amount;

    if (this.slopeMap.boundsCheck(x + 1, y)) {
      this.map[x + 1][y + 0] -= amount * 0.5;
    }
    if (this.slopeMap.boundsCheck(x - 1, y)) {
      this.map[x - 1][y + 0] -= amount * 0.5;
    }
    if (this.slopeMap.boundsCheck(x, y + 1)) {
      this.map[x + 0][y + 1] -= amount * 0.5;
    }
    if (this.slopeMap.boundsCheck(x, y - 1)) {
      this.map[x + 0][y - 1] -= amount * 0.5;
    }

    this.slopeMap.recalculate(x, y, this.map);
    this.slopeMap.recalculate(x + 1, y, this.map);
    this.slopeMap.recalculate(x - 1, y, this.map);
    this.slopeMap.recalculate(x, y + 1, this.map);
    this.slopeMap.recalculate(x, y - 1, this.map);
  }

  chooseDirection(vector) {
    const direction = { x: 0, y: 0 };

    // commit to a direction for X, either 1 or -1 if x is above/below zero
    if (vector.x > 0.0) {
      direction.x = 1;
    } else {
      direction.x = -1;
    }

    // commit to a direction for Y, either 1 or -1 if y is above/below zero
    if (vector.y > 0.0) {
      direction.y = 1;
    } else {
      direction.y = -1;
    }

    const absX = Math.abs(vector.x);
    const absY = Math.abs(vector.y);

    if (absX > absY * getRandomInt(1, 4)) {
      direction.y = 0;
    }

    if (absY > absX * getRandomInt(1, 4)) {
      direction.x = 0;
    }
    /*
    // half the time go somewhere random
    if (getRandomInt(1,10) === 1) {
      direction.x = getRandomInt(-1, 1)
    } else {
      direction.y = getRandomInt(-1, 1)
    }
    */

    return direction;
  }
}

export default Eroder;
