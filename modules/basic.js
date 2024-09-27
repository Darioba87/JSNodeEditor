//TODO: think of generic structure that also suppots circle and other shapes
class Basic {
  x;
  y;
  width;
  height;
  parent;
  zIndex;
  isTopMost;
  constructor(x, y, height, width, parent) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.parent = parent;
  }

  init() {}
  deinit() {}
}

class Resizable extends Basic {
  ratio = 1.0;
  constructor(x, y, height, width, ratio = 1) {
    super(x, y, height, width, ratio);
    this.ratio = ratio;
  }
}

export { Resizable };
