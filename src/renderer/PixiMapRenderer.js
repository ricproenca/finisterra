import * as PIXI from 'pixi.js';

import { drawGraphicTile } from './tile';
import Keyboard from './keyboard';

const VELOCITY = 16;

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
    // this._app = new PIXI.Application(this._width, this._height, pixiSettings);
    this._app = new PIXI.Application(window.innerWidth, window.innerHeight, pixiSettings);
    this._app.stage.name = 'STAGE';

    this._mapBounds = {
      left: 0,
      right: this._mapHeight * this._tileSize - this._tileSize,
      top: 0,
      bottom: this._mapWidth * this._tileSize - this._tileSize,
    };

    // Append and add resize listener
    document.body.appendChild(this._app.view);

    this._world = this._app.stage.addChild(new PIXI.Container());
    this._world.position.x = this._app.renderer.width / 2;
    this._world.position.y = this._app.renderer.height / 2;
    this._world.name = 'WORLD';

    window.addEventListener('resize', this._resize.bind(this));
    this._resize();

    this.keyboard = new Keyboard();

    const ticker = PIXI.ticker.shared;
    ticker.add(this._update.bind(this));
  }

  renderPlayer() {
    const emptySprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    this._player = this._world.addChild(emptySprite);
    this._player.name = 'PLAYER';
    this._player.tint = 0x551a8b;
    this._player.width = this._tileSize;
    this._player.height = this._tileSize;
    this._player.x = (this._mapWidth * this._tileSize) / 2;
    this._player.y = (this._mapHeight * this._tileSize) / 2;

    this._world.pivot.x = this._player.position.x;
    this._world.pivot.y = this._player.position.y;
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
          x * this._tileSize,
          y * this._tileSize,
          this._tileSize,
          this._tileSize,
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
            x * this._tileSize,
            y * this._tileSize,
            this._tileSize,
            this._tileSize,
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
        tile.x * this._tileSize,
        tile.y * this._tileSize,
        this._tileSize,
        this._tileSize,
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

  _setCameraBounds() {
    this._cameraBounds = {
      left: window.innerWidth / 2 - this._tileSize,
      right: this._mapWidth * this._tileSize - window.innerWidth / 2 + this._tileSize,
      top: window.innerHeight / 2 - this._tileSize,
      bottom: this._mapHeight * this._tileSize - window.innerHeight / 2 + this._tileSize,
    };
    window._cameraBounds = this._cameraBounds;
  }

  _resize() {
    // const ratio = Math.min(window.innerWidth / this._width, window.innerHeight / this._height);
    // this._app.stage.scale.x = ratio;
    // this._app.stage.scale.y = ratio;

    this._app.renderer.resize(window.innerWidth, window.innerHeight);
    this._app.renderer.view.style.position = 'absolute';
    this._app.renderer.view.style.top = '0px';
    this._app.renderer.view.style.left = '0px';

    this._setCameraBounds();
  }

  _update() {
    if (this.keyboard.left.pressed && this._player.x > this._mapBounds.left) {
      if (this._player.x > this._cameraBounds.left && this._player.x < this._cameraBounds.right) {
        this._world.pivot.x = this._player.position.x;
      }
      this._player.x -= VELOCITY;
    }

    if (this.keyboard.right.pressed && this._player.x < this._mapBounds.right) {
      if (this._player.x > this._cameraBounds.left && this._player.x < this._cameraBounds.right) {
        this._world.pivot.x = this._player.position.x;
      }
      this._player.x += VELOCITY;
    }

    if (this.keyboard.up.pressed && this._player.y > this._mapBounds.top) {
      if (this._player.y > this._cameraBounds.top && this._player.y < this._cameraBounds.bottom) {
        this._world.pivot.y = this._player.position.y;
      }
      this._player.y -= VELOCITY;
    }

    if (this.keyboard.down.pressed && this._player.y < this._mapBounds.bottom) {
      if (this._player.y > this._cameraBounds.top && this._player.y < this._cameraBounds.bottom) {
        this._world.pivot.y = this._player.position.y;
      }
      this._player.y += VELOCITY;
    }

    if (this.keyboard.space.pressed) {
      console.log('player', this._player.x, this._player.y);
    }
  }
}

export default PixiMapRenderer;
