
//const host = "andromeda";
const host = "localhost";
const riscUrl = `http://${host}:6346/maunaloa/optionprice`;

class LevelLine {
    constructor(parent, levelValue, x1, x2, y, conf) {
        this.parent = parent;
        this.levelValue = levelValue;
        this.lineWidth = 1;
        this.color = "grey";
        this.fontColor = conf.fontColor || "crimson";
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y;
        this.y2 = y;
        this.legend = conf.legendFn || function () {
            return this.levelValue;
        };
        this.draggable = conf.hasOwnProperty("draggable") === true ? conf.draggable : true;
        this.onMouseUp = conf.onMouseUp || null;
    }
    move(dx, dy) {
        this.x1 += dx;
        this.x2 += dx;
        this.y1 += dy;
        this.y2 += dy;
        this.levelValue = this.parent.vruler.pixToValue(this.y2);
    }
    draw() {
        const ctx = this.parent.ctx;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.font = "16px Arial";
        ctx.fillStyle = this.fontColor;
        ctx.fillText(this.legend(), this.x1, this.y1 - 10);
    }
}

export class LevelLines {
    constructor(cfg) {
        this.hruler = null;
        this.vruler = null;
        this.canvas = document.getElementById(cfg.LEVEL_LINES);
        this.ctx = this.canvas.getContext("2d");
        this.mdo = LevelLines.handleMouseDown(this);
        this.mmo = LevelLines.handleMouseMove(this);
        this.mup = LevelLines.handleMouseUp(this);
        this.canvas.addEventListener('mouseup', this.mup, false);
        this.canvas.addEventListener('mousedown', this.mdo, false);
        this.canvas.addEventListener('mousemove', this.mmo, false);
        this.lines = [];
        this.nearest = null;
        this._spot = null;
        const btn = document.getElementById(cfg.BTN_LEVELLINE);
        btn.onclick = () => {
            this.addLine();
        };
        /*
        const btnRisc = document.getElementById(cfg.BTN_RISCLINES);
        const riscLinesFn = cfg.hasOwnProperty("riscLinesFn") === true ? cfg.riscLinesFn : null;
        btnRisc.onclick = () =>  {
            if (riscLinesFn === null) {
                alert("No Risc Lines function set!");
            }
        };
        //*/
    }
    reset(hruler, vruler) {
        this.hruler = hruler;
        this.vruler = vruler;
        this.clearCanvas();
    }
    clearCanvas() {
        this.lines = [];
        this._spot = null;
        if (this.ctx !== null) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    levelValue(pix) {
        return this.vruler.pixToValue(pix);
    }
    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const len = this.lines.length;
        for (let i = 0; i < len; ++i) {
            this.lines[i].draw();
        }
        // draw markers if a line is being dragged
        if (this.nearest) {
            // point on line nearest to mouse
            ctx.beginPath();
            ctx.arc(this.nearest.pt.x, this.nearest.pt.y, 5, 0, Math.PI * 2);
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }
        if (this._spot) {
            const lineChart = MAUNALOA.lineChart(this.hruler, this.vruler, ctx);
            lineChart.drawCandlestick(this._spot);
            ctx.font = "16px Arial";
            ctx.fillStyle = "crimson";
            const curTm = new Date(this._spot.tm);
            ctx.fillText("Spot: " + curTm.toGMTString(), 1000, 50);
        }
    }
    closestLine(mx, my) {
        const len = this.lines.length;
        if (len === 0) {
            return null;
        }
        let dist = 100000000;
        let index, pt;
        for (let i = 0; i < len; i++) {
            const curLine = this.lines[i];
            if (curLine.draggable === false) {
                continue;
            }
            const xy = LevelLines.closestXY(curLine, mx, my);
            const dx = mx - xy.x;
            const dy = my - xy.y;
            const thisDist = dx * dx + dy * dy;
            if (thisDist < dist) {
                dist = thisDist;
                pt = xy;
                index = i;
            }
        }
        const line = this.lines[index];
        return ({
            pt: pt,
            line: line,
            originalLine: {
                x1: line.x1,
                y1: line.y1,
                x2: line.x2,
                y2: line.y2
            }
        });
    }
    static lerp(a, b, x) {
        return (a + x * (b - a));
    }
    static closestXY(line, mx, my) {
        const x0 = line.x1;
        const y0 = line.y1;
        const x1 = line.x2;
        const y1 = line.y2;
        const dx = x1 - x0;
        const dy = y1 - y0;
        let t = ((mx - x0) * dx + (my - y0) * dy) / (dx * dx + dy * dy);
        t = Math.max(0, Math.min(1, t));
        const x = LevelLines.lerp(x0, x1, t);
        const y = LevelLines.lerp(y0, y1, t);
        return ({
            x: x,
            y: y
        });
    }
    static handleMouseDown(self) {
        return function (e) {
            if (self.lines.length === 0) {
                return;
            }
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            self.startX = e.offsetX;
            self.startY = e.offsetY;
            self.nearest = self.closestLine(e.offsetX, e.offsetY);
            self.draw();
            // set dragging flag
            self.isDown = true;
        }
    }
    static handleMouseMove(self) {
        return function (e) {
            if (!self.isDown) {
                return;
            }
            if (self.nearest === null) {
                return;
            }

            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            // calc how far mouse has moved since last mousemove event
            const dx = e.offsetX - self.startX;
            const dy = e.offsetY - self.startY;
            self.startX = e.offsetX;
            self.startY = e.offsetY;
            // change nearest line vertices by distance moved
            const line = self.nearest.line;
            line.move(dx, dy);
            // redraw
            self.draw();
        }
    }
    static handleMouseUp(self) {
        return function (e) {
            if (self.nearest === null) {
                return;
            }
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            const line = self.nearest.line;
            if (line.onMouseUp !== null) {
                line.onMouseUp();
            }
            self.isDown = false;
            self.nearest = null;
            self.draw();
        }
    }
    addLine() {
        const levelPix = 100;
        const levelValue = this.vruler.pixToValue(levelPix);
        const line = new LevelLine(this, levelValue, 300, this.canvas.width, levelPix, {});
        this.lines.push(line);
        this.draw();
    }
    set spot(value) {
        this._spot = value;
        this.draw();
    }
    //addRiscLines(ticker,stockPrice,optionPrice,risc,breakEven) {
    addRiscLines(cfg) {
        cfg.riscLines.forEach(line => {
            this.addRiscLine(line);
        });
        this.draw();
    }
    addRiscLine(line) {
        const breakEven = line.be.toFixed(1);
        const y = this.vruler.valueToPix(breakEven);
        const x0 = 300;
        const x1 = this.canvas.width;
        const breakEvenLine = new LevelLine(this, breakEven, x0, x1, y,
            {
                draggable: false,
                fontColor: "green",
                legendFn: function () {
                    return `[${line.ticker}] Ask: ${line.ask}, Break-even: ${breakEven}`;
                }
            });
        this.lines.push(breakEvenLine);

        const stockPrice = line.stockPrice.toFixed(1);
        const y2 = this.vruler.valueToPix(stockPrice);
        const self = this;
        const riscLine = new LevelLine(this, stockPrice, x0, x1, y2,
            {
                draggable: true,
                legendFn: function () {
                    const curRisc = this.risc || line.risc;
                    const curOptionPrice = this.optionPrice || line.optionPrice.toFixed(1);
                    return `[${line.ticker}] Price: ${curOptionPrice}, Risc: ${curRisc} => ${this.levelValue}`;
                },
                onMouseUp: function () {
                    this.risc = "-";
                    const curUrl = `${riscUrl}/${line.ticker}/${this.levelValue}/`;
                    fetch(curUrl)
                        .then(data => {
                            return data.json();
                        }).then(result => {
                            this.optionPrice = result.optionPrice.toFixed(1);
                            this.risc = result.risc.toFixed(1);
                            self.draw();
                        });
                }
            });
        this.lines.push(riscLine);
    }
}
