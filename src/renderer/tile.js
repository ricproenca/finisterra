const drawGraphicTile = (graphics, x, y, w, h, color, alpha = 1) => {
  graphics.beginFill(color, alpha);
  graphics.drawRect(x, y, w, h);
  graphics.endFill();
};

export default drawGraphicTile;
export { drawGraphicTile };
