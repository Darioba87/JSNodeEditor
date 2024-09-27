import { get_style_rule_value, isIntersect } from "./helpers.js";
import { Canvas } from "./canvas.js";
import { Draggable } from "./draggable.js";
import { Resizable } from "./basic.js";
import {ConnectionLine} from "./line.js"

// TODO: extend Resizable
class Port {
  x;
  y;
  r;
  parent;
  isHit;
  connections = [];
  #cursorTempPos;
  #mouseIsDown;
  #tempLine;
  constructor(x, y, r, parent) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.parent = parent;
    this.ctx = this.parent.parent.context;
  }

  init() {
    // this.parent.context.globalCompositeOperation='destination-over';
    this.parent.parent.canvasElem.addEventListener(
      "mousemove",
      this.mouseMove.bind(this)
    );
    this.parent.parent.canvasElem.addEventListener(
      "mouseup",
      this.mouseUp.bind(this)
    );
    this.parent.parent.canvasElem.addEventListener(
      "mousedown",
      this.mouseDown.bind(this)
    );
  }

  deinit() {}

  draw() {
    // console.log(this);
    this.ctx.fillStyle = "black";
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
    this.ctx.fill();
    this.ctx.stroke();

    // draw temp line. after adding the line to canvas lines list it should be drawn from there
    if (this.#tempLine) {
      this.#tempLine.draw();
    }
  }

  mouseDown(e) {
    // set isHit
    this.#mouseIsDown = true;
    this.#cursorTempPos = { x: e.x, y: e.y };

    // start drawing line here with points start = end = cPos

    if (
      isIntersect(
        { x: this.x, y: this.y, r: this.r },
        this.parent.parent.cursorPosition
      )
    ) {
     
      // this.#tempLine = new ConnectionLine({ x: this.x, y: this.y}, {x:e.clientX,y:0}, this.parent.parent);
      this.parent.parent.tempLine = new ConnectionLine({ x: this.x, y: this.y}, this.parent.parent.cursorPosition, this.parent.parent);
      console.log('from mouseup', this.parent.parent.tempLine.end);
      
      // this.#tempLine.draw();
    }
    // debug code

    // end debug code
  }
  mouseUp(e) {
    // reset isHit
    this.#mouseIsDown = false;
    if (
      isIntersect(
        { x: this.x, y: this.y, r: this.r },
        this.parent.parent.cursorPosition
      ) &&
      this.parent.parent.tempLine !== undefined
    ) {
      this.parent.parent.connections.push(this.parent.parent.tempLine);
      this.parent.parent.tempLine = undefined;
    }
  }
  mouseMove(e) {
    // point if the mouse still down

    if (this.#mouseIsDown && this.parent.parent.tempLine !== undefined) {
      this.parent.parent.tempLine.end = this.parent.parent.cursorPosition;
      
      // this.#tempLine.end.x = e.clientX;
      // this.#tempLine.end.y = e.clientY;
      // this.#tempLine.draw();
    }
  }

}

class Rectangle extends Draggable {
  x;
  y;
  height;
  width;
  parent;
  cssClassName;
  ports = [];
  constructor(x, y, height, width, parent, cssClassName) {
    super();
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.parent = parent;
    this.cssClassName = cssClassName;
  }

  init() {
    super.init();
    this.zIndex = Math.max(...this.parent.children.map((o) => o.zIndex)) + 1;
    this.parent.children.forEach((element) => {
      element.isTopMost = false;
    });
    this.isTopMost = true;
    this.parent.children.push(this);
  }

  draw() {
    const bc =
      this.cssClassName != undefined
        ? get_style_rule_value(this.cssClassName, "background-color")
        : "black";
    this.parent.context.fillStyle = bc;
    this.parent.context.strokeRect(this.x, this.y, this.width, this.height);
    this.parent.context.fillRect(this.x, this.y, this.width, this.height);
    this.drawPorts();
  }

  drawPorts() {
    const leftPort = {
      x: this.x,
      y: this.y + this.height / 2,
      r: 10,
    };

    const rightPort = {
      x: this.x + this.width,
      y: this.y + this.height / 2,
      r: 10,
    };

    const lprt = new Port(leftPort.x, leftPort.y, leftPort.r, this);
    lprt.draw();
    lprt.init();
    const rprt = new Port(rightPort.x, rightPort.y, rightPort.r, this);
    rprt.draw();
    rprt.init();
  }
}

export { Rectangle };
