export class Draggable {
    /*
    constructor(svgId){
        this.svgId = svgId;
    }
    */
    static addLine(svgId) {
        const svg = document.getElementById(svgId);
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
        const l = Draggable.svgLine("200", "150", "200", "450");
        const l50 = Draggable.svgLine(Draggable.X1, "300", Draggable.X2, "300");
        const lPhi = Draggable.svgLine(Draggable.X1, "335", Draggable.X2, "335");
        const lPhi2 = Draggable.svgLine(Draggable.X1, "265", Draggable.X2, "265");
        const lExt = Draggable.svgLine(Draggable.X1, "532", Draggable.X2, "532");
        const lExt2 = Draggable.svgLine(Draggable.X1, "68", Draggable.X2, "68");
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

                x0 = parseFloat(x0);
                y0 = parseFloat(y0);
                //const x50 = (Math.abs(x - x0) / 2.0) + Math.min(x, x0);
                const y50 = (Math.abs(y - y0) / 2.0) + Math.min(y, y0);
                //l50.setAttribute("x1", x50);
                l50.setAttribute("y1", y50);
                l50.setAttribute("y2", y50);
                const yPhi = (Math.abs(y - y0) * Draggable.PHI) + Math.min(y, y0);
                const yPhi2 = (Math.abs(y - y0) * Draggable.PHI * Draggable.PHI) + Math.min(y, y0);
                lPhi.setAttribute("y1", yPhi);
                lPhi.setAttribute("y2", yPhi);
                lPhi2.setAttribute("y1", yPhi2);
                lPhi2.setAttribute("y2", yPhi2);
            }
        });
        svg.appendChild(l);
        svg.appendChild(l50);
        svg.appendChild(lPhi);
        svg.appendChild(lPhi2);
        svg.appendChild(lExt);
        svg.appendChild(lExt2);
        svg.appendChild(c1);
        svg.appendChild(c2);
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
    static svgLine(x1, y1, x2, y2) {
        const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
        l.setAttribute("x1", x1);
        l.setAttribute("y1", y1);
        l.setAttribute("x2", x2);
        l.setAttribute("y2", y2);
        l.setAttribute("stroke", "blue");
        l.setAttribute("stroke-width", 1);
        return l;
    };
    static removeElements(svgId) {
        const svg = document.getElementById(svgId);
        if (svg === null) {
            return;
        }
        while (svg.lastChild) {
            svg.removeChild(svg.lastChild);
        }
    }
}
Draggable.PHI = 0.618034;
Draggable.PHI_EXT = 1.272;
Draggable.X1 = "0";
Draggable.X2 = "1750";
