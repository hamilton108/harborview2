"use strict";

const x1 = 45.0;

const initLines = function () {
    return {
        items: [],
        pilotLine: null
    }
}

const STD_LINE = 1;
const RISC_LINE = 2;
const BREAK_EVEN_LINE = 3;
const NO_SUCH_LINE = 99;

const lineShapeOf = (line) => {
    const cn = line.constructor.name;
    switch (cn) {
        case "StdLine":
            return STD_LINE;
        case "RiscLine":
            return RISC_LINE;
        case "BreakEvenLine":
            return BREAK_EVEN_LINE;
        default:
            return NO_SUCH_LINE;
    }
}

var _lines = initLines();

var _eventListeners = [];

const createPilotLine = function (y, strokeStyle) {
    return { y: y, strokeStyle: strokeStyle };
}

const closestLine = function (y) {
    var dist = 100000000;
    var index = null;
    const items = _lines.items;
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

const clearRect = function () {
    _ctx.clearRect(0, 0, _v.w, _v.h);
}

const draw = function () {
    clearRect();
    const items = _lines.items;
    for (var i = 0; i < items.length; ++i) {
        const curLine = items[i];
        const adtShape = lineShapeOf(curLine);
        switch (adtShape) {
            case STD_LINE:
                paintStdLine(curLine);
                break;
            case RISC_LINE:
                paintRiscLine(curLine);
                break;
            case BREAK_EVEN_LINE:
                paintBreakEvenLine(curLine);
                break;
            case NO_SUCH_LINE:
                break;
        }
    }
    paintPilotLine();
};

export const addListener = listener => () => {
    _eventListeners.push(listener);
};
export const resetListeners = () => {
    _eventListeners = [];
    _lines = initLines();
}
export const getListeners = () => {
    return _eventListeners;
}


export const onMouseDown = evt => () => {
    const items = _lines.items;
    if (items.length === 0) {
        return;
    }
    if (items.length === 1) {
        // This case will never contain a BreakEvenLine
        const curLine = items[0].value0;
        curLine.selected = true;
        _lines.pilotLine = createPilotLine(curLine.y, "black");
    }
    else {
        const cl = closestLine(evt.offsetY);
        if (cl !== null) {
            cl.value0.selected = true;
            _lines.pilotLine = createPilotLine(cl.y, "black"); //cl[1];
        }
    }
};

export const onMouseDrag = evt => () => {
    if (_lines.pilotLine === null) {
        return;
    }
    _lines.pilotLine.y = evt.offsetY;
    draw();
};

export const onMouseUpImpl = just => nothing => () => {
    var result = nothing;
    const items = _lines.items;
    for (var i = 0; i < items.length; ++i) {
        const curLine = items[i];
        const adtShape = lineShapeOf(curLine);
        if (adtShape === BREAK_EVEN_LINE) {
            continue;
        }
        const curRec = curLine.value0;
        if (curRec.selected == true) {
            curRec.y = _lines.pilotLine.y;
            curRec.selected = false;
            if (adtShape === RISC_LINE) {
                result = just(curLine);
            }
        }
    }
    _lines.pilotLine = null;
    if (result === nothing) {
        // If result is RiscLine, draw() will be called later
        // in updateRiscLine
        draw();
    }
    return result;
};

export const updateRiscLine = riscLine => newValue => () => {
    console.log(riscLine);
    const items = _lines.items;
    for (var i = 0; i < items.length; ++i) {
        const item = items[i];
        if (item === riscLine) {
            item.value0.bid = newValue;
            break;
        }
    }
    draw();
}

var _ctx = null;
var _v = null;

export const redraw = ctx => vruler => () => {
    ctx.clearRect(0, 0, vruler.w, vruler.h);
    _ctx = ctx;
    _v = vruler;
};

export const clearCanvas = () => {
    if (_ctx === null) {
        return;
    }
    if (_v === null) {
        return;
    }
    clearRect();
    _lines = initLines();
};

export const clearLines = () => {
    _lines = initLines();
    clearRect();
};

export const addLine = line => () => {
    _lines.items.push(line);
    const adtShape = lineShapeOf(line);
    switch (adtShape) {
        case STD_LINE:
            paintStdLine(line);
            break;
        case RISC_LINE:
            paintRiscLine(line);
        case BREAK_EVEN_LINE:
            paintBreakEvenLine(line);
        default:
            console.log("No such class: " + clazz);
    }
};

const paintStdLine = function (line) {
    const rec = line.value0;
    if (rec.selected === true) {
        return;
    }
    const y = rec.y;
    const displayValue = pixToValue(y).toFixed(2);
    const x2 = _v.w - x1;
    paint(x2, y, displayValue, "black");
};
const paintRiscLine = function (line) {
    const rec = line.value0;
    if (rec.selected === true) {
        return;
    }
    const displayValue = pixToValue(rec.y).toFixed(2) + " - " + rec.ticker + ", op: " + rec.bid.toFixed(2);
    const x2 = _v.w - x1;
    paint(x2, rec.y, displayValue, "red");
};
const paintBreakEvenLine = function (line) {
    const rec = line.value0;
    if (rec.selected === true) {
        return;
    }
    const y = rec.y;
    const displayValue = rec.breakEven.toFixed(2) + " - " + rec.ticker + ", ask: " + rec.ask.toFixed(2); // + ", be: " + bel.be.toFixed(2);
    const x2 = _v.w - x1;
    paint(x2, y, displayValue, "green");
};
const paintPilotLine = function () {
    if (_lines.pilotLine === null) {
        return;
    }
    const y = _lines.pilotLine.y;
    const displayValue = pixToValue(y).toFixed(2);
    const x2 = _v.w - x1;
    paint(x2, y, displayValue, "black");
};

const pixToValue = function (pix) {
    return _v.maxVal - ((pix - _v.padding.top) / _v.ppy);
};
const valueToPix = function (value) {
    return ((_v.maxVal - value) * _v.ppy) + _v.padding.top;
};

const paint = function (x2, y, displayValue, strokeStyle) {
    _ctx.lineWidth = 1.0;
    _ctx.strokeStyle = strokeStyle;
    _ctx.beginPath();
    _ctx.moveTo(x1, y);
    _ctx.lineTo(x2, y);
    _ctx.stroke();
    _ctx.font = "16px Arial";
    _ctx.fillStyle = "#000000";
    _ctx.fillText(displayValue, x1, y - 10);
};
