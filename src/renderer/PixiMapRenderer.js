import * as PIXI from 'pixi.js';
import Camera from './camera';

import { drawGraphicTile } from './tile';

class PixiMapRenderer {
  constructor(canvasSettings, pixiSettings, mapSettings) {
    // Canvas settings
    this._width = canvasSettings.width;
    this._height = canvasSettings.height;

    // Map settings
    this._tileSize = mapSettings.tileSize;
    this._mapWidth = mapSettings.width;
    this._mapHeight = mapSettings.height;

    // Application settings
    this._app = new PIXI.Application(this._width, this._height, pixiSettings);
    this._app.stage.name = 'STAGE';

    // Append and add resize listener
    document.body.appendChild(this._app.view);
    window.addEventListener('resize', this._resize.bind(this));

    // Camera
    const camera = new Camera(mapSettings);
    this._world = this._app.stage.addChild(camera.viewport);
    this._resize();
  }

  renderNoiseMap(map, theme, mapName) {
    const start = Date.now();
    const graphics = new PIXI.Graphics();
    graphics.name = mapName;

    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map[x].length; y++) {
        const tile = map[x][y];
        const color = theme.getHex(tile);
        drawGraphicTile(
          graphics,
          x * this._tileSize, y * this._tileSize, this._tileSize, this._tileSize,
          color,
        );
      }
    }
    this._world.addChild(graphics);
    const stop = Date.now();
    console.log(`${mapName} map rendered`, stop - start, 'ms');
  }

  renderFlatMap(map, colors, mapName) {
    const start = Date.now();
    const graphics = new PIXI.Graphics();
    graphics.name = mapName;

    for (let x = 0; x < this._mapWidth; x++) {
      for (let y = 0; y < this._mapHeight; y++) {
        const tile = map[x][y];
        if (tile && tile !== 'nothing') {
          // i.e if tile.flora !=='nothing'
          const color = colors[tile];

          drawGraphicTile(
            graphics,
            x * this._tileSize, y * this._tileSize, this._tileSize, this._tileSize,
            color,
          );
        }
      }
    }
    this._world.addChild(graphics);
    const stop = Date.now();
    console.log(`${mapName} rendered`, stop - start, 'ms');
  }

  renderRiverMap(riverTiles, color, mapName) {
    const start = Date.now();
    const graphics = new PIXI.Graphics();
    graphics.name = mapName;

    for (let i = 0; i < riverTiles.length; i++) {
      const tile = riverTiles[i];
      drawGraphicTile(
        graphics,
        tile.x * this._tileSize, tile.y * this._tileSize, this._tileSize, this._tileSize,
        color,
      );
    }
    this._world.addChild(graphics);
    const stop = Date.now();
    console.log(`${mapName} rendered`, stop - start, 'ms');
  }

  drawVector(x, y, vector) {
    this._app.renderer.beginPath(); // is this even a path? idk
    this._app.renderer.moveTo(x + 0.5 * this._tileSize, y + 0.5 * this._tileSize);
    this._app.renderer.lineTo(x + vector.x * 1000, y + vector.y * 1000);
    this._app.renderer.strokeStyle = 'rgba(0,0,255,0.25)';
    this._app.renderer.lineWidth = 2;
    this._app.renderer.stroke();
    this._app.renderer.closePath(); // is this even a path? idk
  }

  _resize() {
    // const ratio = Math.min(window.innerWidth / this._width, window.innerHeight / this._height);

    // this._app.stage.scale.x = ratio;
    // this._app.stage.scale.y = ratio;

    this._app.renderer.resize(window.innerWidth, window.innerHeight);
    this._world.resize(window.innerWidth, window.innerHeight);

  //   this._app.renderer.view.style.position = 'absolute';
  //   this._app.renderer.view.style.top = '0px';
  //   this._app.renderer.view.style.left = '0px';
  }
}

export default PixiMapRenderer;
