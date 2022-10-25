
document.addEventListener("DOMContentLoaded", function () {
  class Draggable {
    constructor(svgId) {
      this.svgId = svgId;
      this.items = [];
    }
    removeElements() {
      const svg = document.getElementById(this.svgId);
      if (svg === null) {
        return;
      }
      while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
      }
    }
    listElements() {
      const svg = document.getElementById(this.svgId);
      if (svg === null) {
        return;
      }
      // while (svg.lastChild) {
      //   console.log(svg.lastChild);
      // }
      //console.log(svg.lastChild);
      // this.items.forEach(item => {
      //   console.log(item);
      // });
      // var myItems = Array.from(svg);
      // myItems.forEach(item => {
      //   console.log(item);
      // });

      const len = svg.children.length;
      for (var i = 0; i < len; ++i) {
        let ch = svg.children[i];
        let tn = ch.tagName;
        let st = ch.getAttribute("stroke");
        let stw = ch.getAttribute("stroke-width");
        if (tn === "line") {
          let x1 = ch.x1.baseVal.value;
          let x2 = ch.x2.baseVal.value;
          console.log(`${tn}, x1: ${x1}, x2: ${x2}, color: ${st}, width: ${stw}`);
        }
        else if (tn === "circle") {
          let cx = ch.cx.baseVal.value;
          let cy = ch.cy.baseVal.value;
          console.log(`${tn}, cx: ${cx}, cy: ${cy}, color: ${st}, width: ${stw}`);
        }
      }
    }
    addLine() {
      const svg = document.getElementById(this.svgId);
      if (svg === null) {
        return;
      }
      let curMarker = null;
      const curMarkerDown = function (e) {
        curMarker = e.target;
      };
      const curMarkerUp = function () {
        curMarker = null;
      };
      const color = Draggable.randomRgb()
      const f = Draggable.fib(150, 450);
      const l = Draggable.svgLine(200, 150, 200, 450, color);
      //const l23 = Draggable.svgLine(Draggable.X1, f.f23, Draggable.X2, f.f23, color);
      const l38 = Draggable.svgLine(Draggable.X1, f.f38, Draggable.X2, f.f38, color);
      const l50 = Draggable.svgLine(Draggable.X1, f.f50, Draggable.X2, f.f50, color);
      const l62 = Draggable.svgLine(Draggable.X1, f.f62, Draggable.X2, f.f62, color);
      //const l78 = Draggable.svgLine(Draggable.X1, f.f78, Draggable.X2, f.f78, color);
      const le27H = Draggable.svgLine(Draggable.X1, f.e27H, Draggable.X2, f.e27H, color);
      const le27L = Draggable.svgLine(Draggable.X1, f.e27L, Draggable.X2, f.e27L, color);
      const c1 = Draggable.draggableMarker("1", l.getAttribute("x1"), l.getAttribute("y1"), curMarkerDown, curMarkerUp);
      const c2 = Draggable.draggableMarker("2", l.getAttribute("x2"), l.getAttribute("y2"), curMarkerDown, curMarkerUp);
      svg.addEventListener("mousemove", function (e) {
        if (curMarker !== null) {
          const x = e.offsetX;
          const y = e.offsetY;
          let x0;
          let y0;
          curMarker.setAttribute("cx", x);
          curMarker.setAttribute("cy", y);
          if (curMarker.id === "1") {
            l.setAttribute("x1", x);
            l.setAttribute("y1", y);
            y0 = l.getAttribute("y2");
            x0 = l.getAttribute("x2");
          } else {
            l.setAttribute("x2", x);
            l.setAttribute("y2", y);
            y0 = l.getAttribute("y1");
            x0 = l.getAttribute("x1");
          }

          const fu = Draggable.fib(y0, y);
          //Draggable.updateSvg(l23, fu.f23);
          Draggable.updateSvg(l38, fu.f38);
          Draggable.updateSvg(l50, fu.f50);
          Draggable.updateSvg(l62, fu.f62);
          //Draggable.updateSvg(l78, fu.f78);
          Draggable.updateSvg(le27H, fu.e27H);
          Draggable.updateSvg(le27L, fu.e27L);
        }
      });
      svg.appendChild(l);
      //svg.appendChild(l23);
      svg.appendChild(l38);
      svg.appendChild(l50);
      svg.appendChild(l62);
      //svg.appendChild(l78);
      svg.appendChild(le27H);
      svg.appendChild(le27L);
      svg.appendChild(c1);
      svg.appendChild(c2);
      this.items.push(l);
    }
    static fib(v0, v1) {
      const h = Math.abs(v1 - v0);
      const vH = Math.max(v0, v1);
      const vL = Math.min(v0, v1)
      const fe = (h * Draggable.PHI_EXT) - h;
      return {
        /*
        f23: Math.round((h * Draggable.PHI_23) + vL),
        f38: Math.round((h * Draggable.PHI_38) + vL),
        f50: Math.round((h * 0.5) + vL),
        f62: Math.round((h * Draggable.PHI) + vL),
        f78: Math.round((h * Draggable.PHI_78) + vL),
        e27H: Math.round(vH + fe),
        e27L: Math.round(vL - fe)
        */
        //f23: (h * Draggable.PHI_23) + vL,
        f23: vH - (h * Draggable.PHI_23),
        f38: (h * Draggable.PHI_38) + vL,
        f50: (h * 0.5) + vL,
        f62: (h * Draggable.PHI) + vL,
        //f78: (h * Draggable.PHI_78) + vL,
        f78: vH - (h * Draggable.PHI_78),
        e27H: vH + fe,
        e27L: vL - fe
      }
    }

    static updateSvg(l, val) {
      l.setAttribute("y1", val);
      l.setAttribute("y2", val);
    }
    static draggableMarker(id, cx, cy, fnDown, fnUp) {
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      //c.setAttribute("id", "");
      c.id = id;
      c.setAttribute("r", "5");
      c.setAttribute("stroke", "green");
      c.setAttribute("stroke-width", "1");
      c.setAttribute("fill", "transparent");
      c.setAttribute("cx", cx);
      c.setAttribute("cy", cy);
      c.setAttribute("class", "draggable");
      c.addEventListener("mousedown", fnDown);
      c.addEventListener("mouseup", fnUp);
      return c;
    }
    static randomBetween(min, max) {
      // min and max included 
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
    static randomRgb() {
      const r = Draggable.randomBetween(0, 150);
      const g = Draggable.randomBetween(0, 150);
      const b = Draggable.randomBetween(0, 200);
      return `rgb(${r},${g},${b})`;
    }
    static svgLine(x1, y1, x2, y2, color) {
      const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      l.setAttribute("x1", x1);
      l.setAttribute("y1", y1);
      l.setAttribute("x2", x2);
      l.setAttribute("y2", y2);
      l.setAttribute("stroke", color);
      l.setAttribute("stroke-width", 1.5);
      return l;
    };
  }
  Draggable.PHI = 0.618034;
  Draggable.PHI_38 = Draggable.PHI * Draggable.PHI;
  Draggable.PHI_23 = Draggable.PHI * Draggable.PHI * Draggable.PHI;
  Draggable.PHI_78 = Math.sqrt(Draggable.PHI);
  Draggable.PHI_EXT = 1.272;
  Draggable.X1 = 0;
  Draggable.X2 = 1750;

  const draggable = new Draggable("mysvg");
  const addbtn = document.getElementById("addsvg");
  addbtn.onclick = () => {
    draggable.addLine();
  };
  const rembtn = document.getElementById("remsvg");
  rembtn.onclick = () => {
    draggable.removeElements();
  };
  const listbtn = document.getElementById("listsvg");
  listbtn.onclick = () => {
    draggable.listElements();
  };

});

/*
const PHI = 0.618034;
const PHI_38 = PHI * PHI;
const PHI_23 = PHI * PHI * PHI;
const PHI_78 = Math.sqrt(PHI);
const PHI_EXT = 1.272;

const do_round = false;

const fib = (v0, v1) => {
  const h = Math.abs(v1 - v0);
  const vH = Math.max(v0, v1);
  const vL = Math.min(v0, v1)
  const fe = (h * PHI_EXT) - h;
  var f78 = (h * PHI_78) + vL;
  var f62 = (h * PHI) + vL;
  var f23 = (h * PHI_23) + vL;
  var f38 = (h * PHI_38) + vL;
  var f50 = (h * 0.5) + vL;
  if (do_round == true) {
    f78 = Math.round(f78);
    f62 = Math.round(f62);
    f23 = Math.round(f23);
    f38 = Math.round(f38);
    f50 = Math.round(f50);
  }
  return {
    f23: f23,
    f38: f38,
    f50: f50,
    f62: f62,
    f78: f78,
    exH: Math.round(vH + fe),
    exL: Math.round(vL - fe),
    d1: f78 - f62,
    d2: f38 - f23,
    d3: vH - f62,
    d4: f38 - vL,
    d5: f50 - f38,
    d6: f62 - f50,
    d7: f78 - f50,
    d8: f50 - f23,
    phi_23: PHI_23,
    phi_78: PHI_78,
  }
}


const randomBetween = function (min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const randomRgb = function () {
  const r = randomBetween(0, 155);
  const g = randomBetween(0, 155);
  const b = randomBetween(0, 155);
  return `rgb(${r},${g},${b})`;
}

const result = fib(2382, 2750);


console.log(result);
*/