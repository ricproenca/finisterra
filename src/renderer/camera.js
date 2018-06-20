import * as PIXI from 'pixi.js';
import Viewport from 'pixi-viewport';

import Keyboard from './keyboard';

const VELOCITY = 10;

class Camera {
  constructor(mapSettings) {
    this._tileSize = mapSettings.tileSize;
    this._mapWidth = mapSettings.width;
    this._mapHeight = mapSettings.height;

    this._minViewPointX = 0;
    this._minViewPointY = 0;
    this._maxViewPointX = this._tileSize * this._mapWidth - (window.innerHeight / 2);
    this._maxViewPointY = this._tileSize * this._mapHeight;

    this._setViewport(mapSettings);
  }

  get viewport() {
    return this._viewport;
  }

  addViewPoint() {
    this._setViewPoint();
    this._setControls();

    this._viewport.addChild(this._viewPoint);
    const followSettings = {
      speed: 0,
      radius: 100,
    };
    this._viewport.follow(this._viewPoint, followSettings);
  }

  _setViewport(mapSettings) {
    const viewportSettings = {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: mapSettings.width * mapSettings.tileSize,
      worldHeight: mapSettings.height * mapSettings.tileSize,
      threshold: 10,
    };
    this._viewport = new Viewport(viewportSettings);
    this._viewport.name = 'WORLD';
    console.warn('viewportSettings', viewportSettings);
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
