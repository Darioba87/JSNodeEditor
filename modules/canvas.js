import { el } from "./helpers.js";
import { Resizable } from "./basic.js";
import { ConnectionLine } from "./line.js";

class Canvas extends Resizable {
  canvasElem;
  context;
  id;
  cursorPosition = {};
  children = [];
  connections = [];
  tempLine;
  constructor(id, parent, width, height) {
    super(id, parent, width, height);
    this.createDomElement(id, parent, width, height);
  }

  /**
   * initialize the canvas object by creating its DOM element
   * @param {string} id the DOM element id
   * @param {HTMLElement} parent the element that should host/contain the canvas
   * @param {Number} width the canvas width
   * @param {Number} height canvas height
   */
  createDomElement(id, parent, width, height) {
    // create div to wrap the canvas
    const divWrapper = document.createElement("div");
    divWrapper.id = id;
    parent.appendChild(divWrapper);

    // create canvas element and add it to the wrapper div
    this.canvasElem = document.createElement("canvas");
    this.canvasElem.width = width;
    this.canvasElem.height = height;
    this.canvasElem.className = "drawingCanvas";

    divWrapper.appendChild(this.canvasElem);

    this.context = this.canvasElem.getContext("2d");
    this.canvasElem.addEventListener(
      "mousemove",
      this.updateCursorPosition.bind(this),
      false
    );
  }

  updateCursorPosition(e) {
    this.cursorPosition = {
      x: e.clientX - this.canvasElem.getBoundingClientRect().left,
      y: e.clientY - this.canvasElem.getBoundingClientRect().top,
    };
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    // console.log(this.children);
    // console.log(this.x, this.y);

    this.context.clearRect(
      this.x,
      this.y,
      window.innerWidth,
      window.innerHeight
    );

    this.children.forEach((element) => element.draw());
    this.connections.forEach((element) => element.draw());
    
    if (this.tempLine !== undefined)  {
      this.tempLine.draw();
    }

    // this.smooth([{x:50, y:100},{x:150, y:100}, {x:250, y:210}, {x:500, y:200}]);
    const p1 = { x: 500, y: 200 };
    const p4 = { x: 50, y: 100 };
    const p2 = { x: (p4.x + p1.x) / 2, y: p1.y };
    const p3 = { x: (p1.x - p4.x) / 2, y: p4.y };

    // console.log(p2, p3);

    // this.drawCurve([p1, p2, p3, p4]);
    // const l = new ConnectionLine(p1, this.cursorPosition, this);
    // l.draw();
    // l.end = this.cursorPosition;
    // l.draw();
    
  }





  smooth(points) {
    if (points == undefined || points.length == 0) {
      return true;
    }
    if (points.length == 1) {
      console.log("here 1");

      this.context.moveTo(points[0].x, points[0].y);
      this.context.lineTo(points[0].x, points[0].y);
      return true;
    }
    if (points.length == 2) {
      console.log("here 2");
      this.context.moveTo(points[0].x, points[0].y);
      this.context.lineTo(points[1].x, points[1].y);
      return true;
    }
    this.context.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length - 2; i++) {
      console.log("here 3");
      var xc = (points[i].x + points[i + 1].x) / 2;
      var yc = (points[i].y + points[i + 1].y) / 2;
      this.context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    this.context.quadraticCurveTo(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y
    );
    this.context.stroke();
  }

  // Export Image ################################################################

  exportAsJpg() {}
  // Save JSON ###################################################################
  saveJson() {}
}

export { Canvas };
