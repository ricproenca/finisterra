class WorldCamera {
  constructor(world, worldWidth, worldHeight, canvas) {
    this._world = world;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.width = canvas.width;
    this.height = canvas.height;
    this._x = 0;
    this._y = 0;
    window.addEventListener('resize', this._resize.bind(this));
  }

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
    this._world.x = -this._x;
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
    this._world.y = -this._y;
  }

  get centerX() {
    return this.x + (this.width / 2);
  }
  get centerY() {
    return this.y + (this.height / 2);
  }

  get rightInnerBoundary() {
    return this.x + (this.width / 2) + (this.width / 4) + 8;
  }

  get leftInnerBoundary() {
    return this.x + (this.width / 2) - (this.width / 4);
  }

  get topInnerBoundary() {
    return this.y + (this.height / 2) - (this.height / 4);
  }

  get bottomInnerBoundary() {
    return this.y + (this.height / 2) + (this.height / 4);
  }

  follow(sprite) {
    if (sprite.x < this.leftInnerBoundary) {
      this.x = sprite.x - (this.width / 4);
    }

    if (sprite.y < this.topInnerBoundary) {
      this.y = sprite.y - (this.height / 4);
    }

    if (sprite.x + sprite.width > this.rightInnerBoundary) {
      this.x = sprite.x + sprite.width - (this.width / 4 * 3);
    }

    if (sprite.y + sprite.height > this.bottomInnerBoundary) {
      this.y = sprite.y + sprite.height - (this.height / 4 * 3);
    }

    if (this.x < 0) {
      this.x = 0;
    }

    if (this.y < 0) {
      this.y = 0;
    }

    if (this.x + this.width + sprite.width > this.worldWidth) {
      this.x = this.worldWidth - this.width;
    }

    if (this.y + this.height + sprite.height > this.worldHeight) {
      this.y = this.worldHeight - this.height;
    }
  }

  centerOver(sprite) {
    this.x = (sprite.x + sprite.width / 2) - (this.width / 2);
    this.y = (sprite.y + sprite.height / 2) - (this.height / 2);
  }

  _resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }
}

export default WorldCamera;
