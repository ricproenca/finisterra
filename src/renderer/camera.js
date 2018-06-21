/* eslint no-unused-vars: 0 */
import * as PIXI from 'pixi.js';
import Viewport from 'pixi-viewport';

import Keyboard from './keyboard';

const VELOCITY = 5;

class Camera {
  constructor(mapSettings) {
    this._tileSize = mapSettings.tileSize;
    this._mapWidth = mapSettings.width;
    this._mapHeight = mapSettings.height;

    this._setViewport(mapSettings);
  }

  get viewport() {
    return this._viewport;
  }

  addViewPoint() {
    this._setViewPoint();
    this._setControls();

    this._viewport.addChild(this._viewPoint);
    this._viewport.follow(this._viewPoint).bounce();
  }

  drawBorder() {
    this._drawLine(0, 0, this.viewport.worldWidth, 10);
    this._drawLine(0, this.viewport.worldHeight - 10, this.viewport.worldWidth, 10);
    this._drawLine(0, 0, 10, this.viewport.worldHeight);
    this._drawLine(this.viewport.worldWidth - 10, 0, 10, this.viewport.worldHeight);
  }

  _drawLine(x, y, width, height, color = 0xff0000) {
    const line = this._viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
    line.tint = color;
    line.x = x;
    line.y = y;
    line.width = width;
    line.height = height;
    line.name = 'BORDER';
  }

  _setViewport(mapSettings) {
    const viewportSettings = {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: mapSettings.width * mapSettings.tileSize,
      worldHeight: mapSettings.height * mapSettings.tileSize,
    };
    this._viewport = new PIXI.extras.Viewport(viewportSettings);
    this._viewport.name = 'WORLD';
    console.warn('viewport', this._viewport);
    window.viewport = this._viewport;
  }

  _setViewPoint() {
    const emptySprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    this._viewPoint = this._viewport.addChild(emptySprite);
    this._viewPoint.name = 'CAMERA_POINT';
    this._viewPoint.tint = 0x551a8b;
    this._viewPoint.width = this._tileSize;
    this._viewPoint.height = this._tileSize;
    this._viewPoint.x = (this._mapWidth * this._tileSize) / 2;
    this._viewPoint.y = (this._mapHeight * this._tileSize) / 2;
  }

  _setControls() {
    this.keyboard = new Keyboard();

    const ticker = PIXI.ticker.shared;
    ticker.add(() => {
      if (this.keyboard.right.pressed) {
        this._viewPoint.x += VELOCITY;
      }
      if (this.keyboard.left.pressed) {
        this._viewPoint.x -= VELOCITY;
      }
      if (this.keyboard.up.pressed) {
        this._viewPoint.y -= VELOCITY;
      }
      if (this.keyboard.down.pressed) {
        this._viewPoint.y += VELOCITY;
      }
    });
  }
}

export default Camera;
