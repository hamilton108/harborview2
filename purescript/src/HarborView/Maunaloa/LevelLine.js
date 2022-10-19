"use strict";

/*------------------- consts and utility functions -------------------*/

const x1 = 45.0;

const STD_LINE = 1;
const RISC_LINE = 2;
const BREAK_EVEN_LINE = 3;
const NO_SUCH_LINE = 99;

const getLin = (chartType) => {
    switch (chartType) {
        case 1:
            return linDay;
        case 2:
            return linWeek;
        case 3:
            return linMonth;
    }
}

const lineShapeOf = (line) => {
    return line.value0.lt;
}

const createPilotLine = function (y, strokeStyle) {
    return { y: y, strokeStyle: strokeStyle };
}

const closestLine = function (items, y) {
    var dist = 100000000;
    var index = null;
    for (var i = 0; i < items.length; ++i) {
        if (lineShapeOf(items[i]) === BREAK_EVEN_LINE) {
            continue;
        }
        const curRec = items[i].value0;
        const dy = curRec.y - y;
        const thisDist = dy * dy;
        if (thisDist < dist) {
            index = i;
            dist = thisDist;
        }
    }
    if (index === null) {
        return null;
    }
    else {
        return items[index];
    }
}

const initLines = function () {
    return {
        items: [],
        pilotLine: null
    }
}

const randomBetween = function (min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}


/*------------------- LevelLineInternal -------------------*/

class LevelLineInternal {

    constructor() {
        this.ctx = null;
        this.v = null;
        this.lines = initLines();
        this.eventListeners = [];
    }

    paint(x2, y, displayValue, strokeStyle) {
        const _ctx = this.ctx;
        _ctx.lineWidth = 2.0;
        _ctx.strokeStyle = strokeStyle;
        _ctx.beginPath();
        _ctx.moveTo(x1, y);
        _ctx.lineTo(x2, y);
        _ctx.stroke();
        _ctx.font = "16px Arial";
        _ctx.fillStyle = "#000000";
        _ctx.fillText(displayValue, x1, y - 10);
    };

    clearRect() {
        this.ctx.clearRect(0, 0, this.v.w, this.v.h);
    }

    draw() {
        this.clearRect();
        const items = this.lines.items;
        for (var i = 0; i < items.length; ++i) {
            const curLine = items[i];
            const adtShape = lineShapeOf(curLine);
            switch (adtShape) {
                case STD_LINE:
                    this.paintStdLine(curLine);
                    break;
                case RISC_LINE:
                    this.paintRiscLine(curLine);
                    break;
                case BREAK_EVEN_LINE:
                    this.paintBreakEvenLine(curLine);
                    break;
                case NO_SUCH_LINE:
                    break;
            }
        }
        this.paintPilotLine();
    };

    paintStdLine(line) {
        const rec = line.value0;
        if (rec.selected === true) {
            return;
        }
        const y = rec.y;
        const displayValue = this.pixToValue(y).toFixed(2);
        const x2 = this.v.w - x1;
        this.paint(x2, y, displayValue, rec.color);
    };
    paintRiscLine(line) {
        const rec = line.value0;
        if (rec.selected === true) {
            return;
        }
        const displayValue =
            this.pixToValue(rec.y).toFixed(2) +
            " - " + rec.ticker +
            ", bid: " + rec.bid.toFixed(2) +
            ", risc: " + rec.risc.toFixed(2) +
            ", risc price: " + rec.riscPrice.toFixed(2);
        const x2 = this.v.w - x1;
        this.paint(x2, rec.y, displayValue, "red");
    };
    paintBreakEvenLine(line) {
        const rec = line.value0;
        if (rec.selected === true) {
            return;
        }
        const y = rec.y;
        const displayValue = rec.breakEven.toFixed(2) + " - " + rec.ticker + ", ask: " + rec.ask.toFixed(2); // + ", be: " + bel.be.toFixed(2);
        const x2 = this.v.w - x1;
        this.paint(x2, y, displayValue, "green");
    };
    paintPilotLine() {
        if (this.lines.pilotLine === null) {
            return;
        }
        const y = this.lines.pilotLine.y;
        const displayValue = this.pixToValue(y).toFixed(2);
        const x2 = this.v.w - x1;
        this.paint(x2, y, displayValue, "black");
    };
    pixToValue(pix) {
        const _v = this.v;
        return _v.maxVal - ((pix - _v.padding.top) / _v.ppy);
    };
    valueToPix(value) {
        const _v = this.v;
        return ((_v.maxVal - value) * _v.ppy) + _v.padding.top;
    };
    addListener(listener) {
        this.eventListeners.push(listener);
    }
    resetListeners() {
        this.eventListeners = [];
        this.lines = initLines();
    }
    getListeners() {
        return this.eventListeners;
    }
    onMouseDown(evt) {
        const items = this.lines.items;
        if (items.length === 0) {
            return;
        }
        if (items.length === 1) {
            // This case will never contain a BreakEvenLine
            const curLine = items[0].value0;
            curLine.selected = true;
            this.lines.pilotLine = createPilotLine(curLine.y, "black");
        }
        else {
            const cl = closestLine(items, evt.offsetY);
            if (cl !== null) {
                cl.value0.selected = true;
                this.lines.pilotLine = createPilotLine(cl.y, "black"); //cl[1];
            }
        }
    }
    onMouseDrag(evt) {
        if (this.lines.pilotLine === null) {
            return;
        }
        this.lines.pilotLine.y = evt.offsetY;
        this.draw();
    }
    onMouseUpImpl(just, nothing) {
        var result = nothing;
        const items = this.lines.items;
        for (var i = 0; i < items.length; ++i) {
            const curLine = items[i];
            const adtShape = lineShapeOf(curLine);
            if (adtShape === BREAK_EVEN_LINE) {
                continue;
            }
            const curRec = curLine.value0;
            if (curRec.selected == true) {
                curRec.y = this.lines.pilotLine.y;
                curRec.selected = false;
                if (adtShape === RISC_LINE) {
                    result = just(curLine);
                }
            }
        }
        this.lines.pilotLine = null;
        if (result === nothing) {
            // If result is RiscLine, draw() will be called later
            // in updateRiscLine
            this.draw();
        }
        return result;
    };
    updateRiscLine(riscLine, newValue) {
        console.log(riscLine);
        const items = this.lines.items;
        for (var i = 0; i < items.length; ++i) {
            const item = items[i];
            var obj = item.value0;
            if (item === riscLine) {
                obj.riscPrice = newValue;
                obj.risc = obj.ask - newValue;
                break;
            }
        }
        this.draw();
    }
    redraw(ctx, vruler) {
        ctx.clearRect(0, 0, vruler.w, vruler.h);
        this.ctx = ctx;
        this.v = vruler;
    };
    clearCanvas() {
        if (this.ctx === null) {
            return;
        }
        if (this.v === null) {
            return;
        }
        this.clearRect();
        this.lines = initLines();
    };

    clearLines() {
        this.lines = initLines();
        this.clearRect();
    };
    addLine(line) {
        this.lines.items.push(line);
        const adtShape = lineShapeOf(line);
        switch (adtShape) {
            case STD_LINE:
                this.paintStdLine(line);
                break;
            case RISC_LINE:
                this.paintRiscLine(line);
                break;
            case BREAK_EVEN_LINE:
                this.paintBreakEvenLine(line);
                break;
            default:
                console.log("No such class: " + adtShape);
        }
    };
}

const linDay = new LevelLineInternal();
const linWeek = new LevelLineInternal();
const linMonth = new LevelLineInternal();

/*------------------- exports -------------------*/


export const addListener = chartType => listener => () => {
    const lin = getLin(chartType);
    lin.addListener(listener);
};
export const resetListeners = chartType => () => {
    const lin = getLin(chartType);
    lin.resetListeners();
}

export const getListeners = chartType => () => {
    const lin = getLin(chartType);
    return lin.getListeners();
}

export const onMouseDown = chartType => evt => () => {
    const lin = getLin(chartType);
    lin.onMouseDown(evt);
};

export const onMouseDrag = chartType => evt => () => {
    const lin = getLin(chartType);
    lin.onMouseDrag(evt);
};

export const onMouseUpImpl = chartType => just => nothing => () => {
    const lin = getLin(chartType);
    return lin.onMouseUpImpl(just, nothing);
};

export const updateRiscLine = chartType => riscLine => newValue => () => {
    const lin = getLin(chartType);
    lin.updateRiscLine(riscLine, newValue);
}

export const redraw = chartType => ctx => vruler => () => {
    const lin = getLin(chartType);
    lin.redraw(ctx, vruler);
};

export const clearCanvas = chartType => () => {
    const lin = getLin(chartType);
    lin.clearCanvas();
};

export const clearLines = chartType => () => {
    const lin = getLin(chartType);
    lin.clearLines();
};

export const addLine = chartType => line => () => {
    const lin = getLin(chartType);
    lin.addLine(line);
};
export const randomRgb = () => {
    const r = randomBetween(0, 220);
    const g = randomBetween(0, 220);
    const b = randomBetween(0, 220);
    return `rgb(${r},${g},${b})`;
}