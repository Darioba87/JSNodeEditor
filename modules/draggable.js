import { get_style_rule_value, cursorHitTest } from "./helpers.js";
import { Resizable } from "./basic.js";

class Draggable extends Resizable {
  #isHit;
  #mouseIsDown;
  #cursorTempPos;
  constructor(x, y, height, width, parent) {
    super(x, y, height, width, parent);
  }

  init() {
    super.deinit();
    this.parent.canvasElem.addEventListener(
      "mousedown",
      this.mouseDown.bind(this)
    );
    this.parent.canvasElem.addEventListener("mousemove", this.move.bind(this));
    this.parent.canvasElem.addEventListener("mouseup", this.mouseUp.bind(this));
  }

  mouseUp(e) {
    this.#mouseIsDown = false;
  }

  mouseDown(e) {
    this.#mouseIsDown = true;
    this.#cursorTempPos = { x: e.x, y: e.y };
  }

  deinit() {
    this.removeEventLinstener("mousedown");
    this.removeEventLinstener("mouseup");
    this.removeEventLinstener("mousemove");
  }

  move(e) {
    this.#isHit = cursorHitTest(
      this.x,
      this.y,
      this.width,
      this.height,
      e.x,
      e.y
    );

    // drag
    if (
      // TODO: fix the issue with draging two overlaped elements
      // this.isTopMost &&
      this.#mouseIsDown &&
      this.#isHit &&
      this.#cursorTempPos !== undefined &&
      (this.#cursorTempPos.x !== e.x || this.#cursorTempPos.y !== e.y)
    ) {
      // TODO: calculate clear offset without removing other objects
      // or may be clear the whole canvas is better
      // this.parent.context.clearRect(this.x, this.y, this.width, this.height);
      const dx = e.x - this.#cursorTempPos.x;
      const dy = e.y - this.#cursorTempPos.y;
      this.x += dx;
      this.y += dy;
      this.draw();
    }

    this.#cursorTempPos = { x: e.x, y: e.y };
  }

  topMost() {
    return Math.max(...this.parent.children.map((o) => o.zIndex));
  }
}

export { Draggable };
