"use strict";

const x1 = 45.0;

const nothing = PS["Data.Maybe"].Nothing.value;

const just = function (obj) {
    return PS["Data.Maybe"].Just.create(obj);
}

const initLines = function () {
    return {
        items: [],
        pilotLine: nothing
    }

}

var _lines = initLines();

var _eventListeners = [];

const createPilotLine = function (line) {
    return just({ y: line.y, strokeStyle: line.strokeStyle });
}

const closestLine = function (lines, y) {
    var dist = 100000000;
    var index = null;
    for (var i = 0; i < lines.length; ++i) {
        const curLine = lines[i];
        if (curLine.draggable === false) {
            continue;
        }
        const dy = curLine.y - y;
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
        return [index, createPilotLine(lines[index])];
    }
}

const draw = function (vruler, ctx) {
    ctx.clearRect(0, 0, vruler.w, vruler.h);

    const items = _lines.items;
    for (var i = 0; i < items.length; ++i) {
        const curLine = items[i];
        if (curLine.selected == true) {
            continue;
        }
        paintLine(curLine, vruler, ctx);
    }
    paintLine(_lines.pilotLine.value0, vruler, ctx);
};

exports.hasPilotLine = function () {
    return _lines.pilotLine !== nothing;
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

exports.showJson = function (json) {
    return function () {
        console.log(json);
    }
}
exports.onMouseDown = function (evt) {
    return function () {
        const items = _lines.items;
        if (items.length === 0) {
            return;
        }
        if (items.length === 1) {
            items[0].selected = true;
            _lines.pilotLine = createPilotLine(items[0]);
        }
        else {
            const cl = closestLine(items, evt.offsetY);
            if (cl !== null) {
                items[cl[0]].selected = true;
                _lines.pilotLine = cl[1];
            }
        }
    }
};

exports.onMouseDrag = function (evt) {
    return function (ctx) {
        return function (vruler) {
            return function () {
                _lines.pilotLine.value0.y = evt.offsetY;
                draw(vruler, ctx);
            }
        }
    }
};

exports.onMouseUp = function (evt) {
    return function () {
        var result = nothing;
        const items = _lines.items;
        for (var i = 0; i < items.length; ++i) {
            const curLine = items[i];
            if (curLine.selected == true) {
                curLine.y = _lines.pilotLine.value0.y;
                curLine.selected = false;
                result = just(curLine);
            }
        }
        _lines.pilotLine = nothing;
        return result;
    }
};

const paintLine = function (line, vruler, ctx) {
    const x2 = vruler.w - x1;
    const y = line.y;
    const displayValue = pixToValue(vruler, y).toFixed(2);
    paint(x2, y, displayValue, ctx, line.strokeStyle);
}

const paintRiscLine = function (riscValue, line, vruler, ctx) {
    const x2 = vruler.w - x1;
    const y = line.y;
    const displayValue = pixToValue(vruler, y).toFixed(2) + " - " + riscValue;
    paint(x2, y, displayValue, ctx, line.strokeStyle);
}

const paintDisplayValueDefault = function (y, vruler, ctx) {
    const x2 = vruler.w - x1;
    const displayValue = pixToValue(vruler, y).toFixed(2);
    paint(x2, y, displayValue, ctx, "black");
}

var _ctx = null;
var _vruler = null;

exports.redraw = function (ctx) {
    return function (vruler) {
        return function () {
            ctx.clearRect(0, 0, vruler.w, vruler.h);
            _ctx = ctx;
            _vruler = vruler;
        }
    };
};

exports.clearCanvas = function () {
    if (_ctx === null) {
        return;
    }
    if (_vruler === null) {
        return;
    }
    _ctx.clearRect(0, 0, _vruler.w, _vruler.h);
    _lines = initLines();
};

exports.createRiscLines = function (json) {
    return function (ctx) {
        return function (vruler) {
            return function () {
                //var result = [];
                for (var i = 0; i < json.length; ++i) {
                    const curJson = json[i];
                    const bePix = valueToPix(vruler, curJson.be);
                    const spPix = valueToPix(vruler, curJson.stockprice);
                    const breakEvenLine = { y: bePix, draggable: false, selected: false, strokeStyle: "green" };
                    const riscLine = { y: spPix, draggable: true, selected: false, strokeStyle: "red" };
                    paintRiscLine(curJson.ticker, breakEvenLine, vruler, ctx);
                    paintRiscLine(curJson.ticker, riscLine, vruler, ctx);
                    _lines.items.push(breakEvenLine);
                    _lines.items.push(riscLine);
                }
            };
        };
    };
};

exports.createLine = function (ctx) {
    8
    return function (vruler) {
        return function () {
            const y = vruler.h * Math.random();
            paintDisplayValueDefault(y, vruler, ctx);
            const result = { y: y, draggable: true, selected: false, strokeStyle: "black" };
            _lines.items.push(result);
            //return result;
        };
    };
};

const pixToValue = function (v, pix) {
    return v.maxVal - ((pix - v.padding.top) / v.ppy);
};
const valueToPix = function (v, value) {
    return ((v.maxVal - value) * v.ppy) + v.padding.top;
};

const paint = function (x2, y, displayValue, ctx, strokeStyle) {
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(displayValue, x1, y - 10);
};
