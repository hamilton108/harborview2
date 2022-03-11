"use strict";

exports.fi_paint = function (xaxis) {
  return function (candlestix) {
    return function (ctx) {
      return function () {
        //console.log(candlestix);
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#ffaa00";
        ctx.lineWidth = 0.5;
        const numCandlestix = candlestix.length;
        for (var i = 0; i < numCandlestix; ++i) {
          paintCandlestick(xaxis[i], candlestix[i], ctx);
        }
      }
    }
  }
}

const paintCandlestick = function (x, cndl, ctx) {
  const x0 = x - 4;
  ctx.beginPath();

  if (cndl.c > cndl.o) {
    // Bearish
    ctx.moveTo(x, cndl.h);
    ctx.lineTo(x, cndl.o);
    ctx.moveTo(x, cndl.c);
    ctx.lineTo(x, cndl.l);
    const cndlHeight = cndl.c - cndl.o;
    ctx.rect(x0, cndl.o, 8, cndlHeight);
    ctx.fillRect(x0, cndl.o, 8, cndlHeight);
  }
  else {
    // Bullish
    var cndlHeight = cndl.o - cndl.c;
    // If doji
    if (cndlHeight === 0.0) {
      cndlHeight = 1.0;
      const x1 = x + 4;
      ctx.moveTo(x, cndl.h);
      ctx.lineTo(x, cndl.l);
      ctx.moveTo(x0, cndl.c);
      ctx.lineTo(x1, cndl.c);
    }
    else {
      ctx.moveTo(x, cndl.h);
      ctx.lineTo(x, cndl.c);
      ctx.moveTo(x, cndl.o);
      ctx.lineTo(x, cndl.l);
      ctx.rect(x0, cndl.c, 8, cndlHeight);
    }
  }
  ctx.stroke();
}