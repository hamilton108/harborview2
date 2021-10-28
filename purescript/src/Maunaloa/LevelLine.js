"use strict";

const x1 = 45.0;

//* This is needed during testing and spago repl
const PS = {
    "Maunaloa.LevelLine": "",
    "Data.Maybe": { "Nothing": { "value": "" } }
};
//*/

const Maunaloa_LevelLine = PS["Maunaloa.LevelLine"];

const Data_Maybe = PS["Data.Maybe"];

const nothing = Data_Maybe.Nothing.value;

const just = function (obj) {
    return Data_Maybe.Just.create(obj);
}

const initLines = function () {
    return {
        items: [],
        pilotLine: nothing
    }
}

var _lines = initLines();

var _eventListeners = [];

const createPilotLine = function (y, strokeStyle) {
    return just({ y: y, strokeStyle: strokeStyle });
}

const closestLine = function (y) {
    var dist = 100000000;
    var index = null;
    const items = _lines.items;
    for (var i = 0; i < items.length; ++i) {
        if (items[i] instanceof Maunaloa_LevelLine.BreakEvenLine) {
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

        if (curLine instanceof Maunaloa_LevelLine.StdLine) {
            paintStdLine(curLine);
        }
        else if (curLine instanceof Maunaloa_LevelLine.RiscLine) {
            paintRiscLine(curLine);
        }
        else {
            paintBreakEvenLine(curLine);
        }
    }
    paintPilotLine();
};

exports.addListener = function (listener) {
    return function () {
        _eventListeners.push(listener);
    }
};
exports.resetListeners = function () {
    _eventListeners = [];
    _lines = initLines();
}
exports.getListeners = function () {
    return _eventListeners;
}


exports.onMouseDown = function (evt) {
    return function () {
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
    }
};

exports.onMouseDrag = function (evt) {
    return function () {
        if (_lines.pilotLine === nothing) {
            return;
        }
        _lines.pilotLine.value0.y = evt.offsetY;
        draw();
    };
};

exports.onMouseUp = function (evt) {
    return function () {
        var result = nothing;
        const items = _lines.items;
        for (var i = 0; i < items.length; ++i) {
            const curLine = items[i];
            if (curLine instanceof Maunaloa_LevelLine.BreakEvenLine) {
                continue;
            }
            const curRec = curLine.value0;
            if (curRec.selected == true) {
                curRec.y = _lines.pilotLine.value0.y;
                curRec.selected = false;

                if (curLine instanceof Maunaloa_LevelLine.RiscLine) {
                    result = just(curLine);
                }
            }
        }
        _lines.pilotLine = nothing;
        if (result === nothing) {
            // If result is RiscLine, draw() will be called later
            // in updateRiscLine
            draw();
        }
        return result;
    }
};

exports.updateRiscLine = function (riscLine) {
    return function (newValue) {
        return function () {
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
    }
}

var _ctx = null;
var _v = null;

exports.redraw = function (ctx) {
    return function (vruler) {
        return function () {
            ctx.clearRect(0, 0, vruler.w, vruler.h);
            _ctx = ctx;
            _v = vruler;
        }
    };
};

exports.clearCanvas = function () {
    if (_ctx === null) {
        return;
    }
    if (_v === null) {
        return;
    }
    clearRect();
    _lines = initLines();
};

exports.clearLines = function () {
    _lines = initLines();
    clearRect();
};

exports.addLine = function (line) {
    return function () {
        _lines.items.push(line);
        if (line instanceof Maunaloa_LevelLine.StdLine) {
            paintStdLine(line);
        }
        else if (line instanceof Maunaloa_LevelLine.RiscLine) {
            paintRiscLine(line);
        }
        else {
            paintBreakEvenLine(line);
        }

    };
};

const paintStdLine = function (line) {
    if (line.value0.selected === true) {
        return;
    }
    const y = line.value0.y;
    const displayValue = pixToValue(y).toFixed(2);
    const x2 = _v.w - x1;
    paint(x2, y, displayValue, "black");
};
const paintRiscLine = function (line) {
    if (line.value0.selected === true) {
        return;
    }
    const rec = line.value0;
    const displayValue = pixToValue(rec.y).toFixed(2) + " - " + rec.ticker + ", op: " + rec.bid.toFixed(2);
    const x2 = _v.w - x1;
    paint(x2, rec.y, displayValue, "red");
};
const paintBreakEvenLine = function (line) {
    if (line.value0.selected === true) {
        return;
    }
    const bel = line.value0;
    const y = bel.y;
    const displayValue = bel.breakEven.toFixed(2) + " - " + bel.ticker + ", ask: " + bel.ask.toFixed(2); // + ", be: " + bel.be.toFixed(2);
    const x2 = _v.w - x1;
    paint(x2, y, displayValue, "green");
};
const paintPilotLine = function () {
    if (_lines.pilotLine === nothing) {
        return;
    }
    const y = _lines.pilotLine.value0.y;
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
