import * as PIXI from 'pixi.js';
import Viewport from 'pixi-viewport';

class Camera {
  constructor(mapSettings) {
    this._tileSize = mapSettings.tileSize;
    this._mapWidth = mapSettings.width;
    this._mapHeight = mapSettings.height;

    this._viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: mapSettings.width * mapSettings.tileSize,
      worldHeight: mapSettings.height * mapSettings.tileSize,
    });
    this._viewport.name = 'WORLD';

    const emptySprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    this._viewPoint = this._viewport.addChild(emptySprite);
    this._viewPoint.name = 'CAMERA_POINT';
    this._viewPoint.tint = 0x551a8b;
    this._viewPoint.width = this._tileSize;
    this._viewPoint.height = this._tileSize;
    this._viewPoint.x = (this._mapWidth * this._tileSize) / 2;
    this._viewPoint.y = (this._mapHeight * this._tileSize) / 2;

    this._viewport.addChild(this._viewPoint);
    this._viewport.follow(this._viewPoint).wheel();
  }

  get viewport() {
    return this._viewport;
  }
}

export default Camera;
