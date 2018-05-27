class SlopeMap {
  constructor(dimensions, map) {
    console.info('\nGENERATE SLOPE MAP');
    this._dim = dimensions;
    this._map = [];
    for (let i = 0; i < dimensions.width; i++) {
      this._map[i] = [];
      for (let j = 0; j < dimensions.height; j++) {
        const sx = map[i < dimensions.width - 1 ? i + 1 : i][j] - map[i - 1 >= 0 ? i - 1 : i][j];
        const sy = map[i][j < dimensions.height - 1 ? j + 1 : j] - map[i][j - 1 >= 0 ? j - 1 : j];
        this._map[i][j] = { x: sx, y: sy };
      }
    }
  }

  setTile(x, y, object) {
    this._map[x][y] = object;
  }

  getTile(x, y) {
    return this._map[x][y];
  }

  boundsCheck(x, y) {
    return x > 0 && x < this._dim.width - 1 && y > 0 && y < this._dim.height - 1;
  }

  recalculate(x, y, map) {
    const i = x;
    const j = y;
    if (!this.boundsCheck(x, y)) {
      return;
    }

    if (!this.boundsCheck(x + 1, y)) {
      return;
    }

    if (!this.boundsCheck(x, y + 1)) {
      return;
    }

    if (!this.boundsCheck(x - 1, y)) {
      return;
    }

    if (!this.boundsCheck(x, y - 1)) {
      return;
    }

    const sx = map[i < this._dim.width - 1 ? i + 1 : i][j] - map[i - 1 >= 0 ? i - 1 : i][j];
    const sy = map[i][j < this._dim.height - 1 ? j + 1 : j] - map[i][j - 1 >= 0 ? j - 1 : j];
    this._map[i][j] = { x: sx, y: sy };
  }

  recalculateAll(map) {
    for (let i = 0; i < this._dim.width; i++) {
      for (let j = 0; j < this._dim.height; j++) {
        this.recalculate(i, j, map);
      }
    }
  }
}

export default SlopeMap;
