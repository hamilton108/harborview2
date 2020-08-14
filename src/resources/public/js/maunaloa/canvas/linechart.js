var MAUNALOA = MAUNALOA || {};

MAUNALOA.lineChart = function (hruler, vruler, ctx) {
  const scaleLine = function (line) {
    const result = [];
    for (let i = 0; i < line.length; ++i) {
      result.push(vruler.valueToPix(line[i]));
    }
    return result;
  };
  const drawLine = function (line, strokeStyle, lineWidth) {
    ctx.lineWidth = lineWidth || 0.5;
    ctx.strokeStyle = strokeStyle; // "#FF0000";
    const ys = scaleLine(line);
    const xs = hruler.xaxis;
    ctx.beginPath();
    ctx.moveTo(xs[0], ys[0]);
    for (let i = 1; i < ys.length; ++i) {
      const y = ys[i];
      const x = xs[i];
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  };
  const scaleCandlestick = function (candleStick) {
    const o = vruler.valueToPix(candleStick.o);
    const h = vruler.valueToPix(candleStick.h);
    const l = vruler.valueToPix(candleStick.l);
    const c = vruler.valueToPix(candleStick.c);
    return {
      o: o,
      h: h,
      l: l,
      c: c
    };
  };
  const scaleCandlesticks = function (cs) {
    const result = []
    for (let i = 0; i < cs.length; ++i) {
      result.push(scaleCandlestick(cs[i]));
    }
    return result;
  };
  const _drawCandlestick = function (x, candleStick) {
    const x0 = x - 4;
    ctx.beginPath();

    if (candleStick.c > candleStick.o) {
      // Bearish
      ctx.moveTo(x, candleStick.h);
      ctx.lineTo(x, candleStick.o);
      ctx.moveTo(x, candleStick.c);
      ctx.lineTo(x, candleStick.l);
      const cndlHeight = candleStick.c - candleStick.o;
      ctx.rect(x0, candleStick.o, 8, cndlHeight);
      ctx.fillRect(x0, candleStick.o, 8, cndlHeight);
    }
    else {
      // Bullish
      let cndlHeight = candleStick.o - candleStick.c;
      // If doji
      if (cndlHeight === 0.0) {
        cndlHeight = 1.0;
        const x1 = x + 4;
        ctx.moveTo(x, candleStick.h);
        ctx.lineTo(x, candleStick.l);
        ctx.moveTo(x0, candleStick.c);
        ctx.lineTo(x1, candleStick.c);
      }
      else {
        ctx.moveTo(x, candleStick.h);
        ctx.lineTo(x, candleStick.c);
        ctx.moveTo(x, candleStick.o);
        ctx.lineTo(x, candleStick.l);
        ctx.rect(x0, candleStick.c, 8, cndlHeight);
      }
    }
    ctx.stroke();
  };
  const drawCandlesticks = function (cs) {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#ffaa00";
    ctx.lineWidth = 0.5;
    const xs = hruler.xaxis;
    const scs = scaleCandlesticks(cs);
    const numCandlesticks = scs.length;
    for (let i = 0; i < numCandlesticks; ++i) {
      _drawCandlestick(xs[i], scs[i]);
    }
  };
  const drawCandlestick = function (candleStick) {
    const scaled = scaleCandlestick(candleStick);
    const x = hruler.timeStampToPix(candleStick.tm);
    _drawCandlestick(x, scaled);
  };
  const scaleBars = function (bars) {
    //var o = vruler.valueToPix(candleStick.o);
    const result = []
    for (let i = 0; i < bars.length; ++i) {
      result.push(vruler.valueToPix(bars[i]));
    }
    return result;
  };
  const drawBar = function (x, bar) {
    ctx.beginPath();
    ctx.moveTo(x, vruler.bottom);
    ctx.lineTo(x, bar);
    ctx.stroke();
  };
  const drawBars = function (bars) {
    ctx.strokeStyle = "#ff0000";
    //ctx.fillStyle = "#ffaa00";
    ctx.lineWidth = 0.5;

    var xs = hruler.xaxis;
    var sbars = scaleBars(bars);
    var numBars = sbars.length;
    for (var i = 0; i < numBars; ++i) {
      drawBar(xs[i], sbars[i]);
    }
  };
  return {
    drawLine: drawLine,
    drawCandlesticks: drawCandlesticks,
    drawCandlestick: drawCandlestick,
    drawBars: drawBars
  }
};
