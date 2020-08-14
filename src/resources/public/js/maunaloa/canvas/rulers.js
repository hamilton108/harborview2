 var MAUNALOA = MAUNALOA || {};

MAUNALOA.vruler = function(chartHeight, valueRange) {
  const double2decimal = function(x, roundingFactor) {
    const rf = roundingFactor || 100;
    return (Math.round(x * rf)) / rf;
  };
  const minVal = valueRange[0];
  const maxVal = valueRange[1];
  const ppy = chartHeight / (maxVal - minVal);

  const lines = function(ctx, chartWidth, numVlines) {
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.strokeStyle = "#bbb";
    ctx.lineWidth = 0.25;
    const step = chartHeight / (numVlines - 1);
    for (let i = 0; i < numVlines; ++i) {
      const curStep = step * i;
      const curVal = double2decimal(maxVal - (curStep / ppy));
      ctx.beginPath();
      ctx.moveTo(0, curStep);
      ctx.lineTo(chartWidth, curStep);
      if (i === 0) {
        ctx.fillText(curVal, 10, curStep + 18);
      } else {
        ctx.fillText(curVal, 10, curStep - 5);
      }
      ctx.stroke();
    }
  };
  const pixToValue = function(pix) {
    return double2decimal(maxVal - (pix / ppy));
  };
  const valueToPix = function(v) {
    return Math.round((maxVal - v) * ppy);
  };
  /*
  const bottom = function() {
    return chartHeight;
  }
  */
  return {
    valueToPix: valueToPix,
    pixToValue: pixToValue,
    lines: lines,
    bottom: chartHeight
  }
};


MAUNALOA.hruler = function(width, startDateAsMillis, offsets, drawLegend, buffer) {
  const x0 = offsets[offsets.length - 1];
  const x1 = offsets[0] + buffer;
  const curDiffDays = x1 - x0;
  const ppx = width / curDiffDays;

  const startDate = new Date(startDateAsMillis);

  const date2string = function(d) {
    return (d.getMonth() + 1) + "." + d.getFullYear();
  };
  const calcPix = function(x) {
    const curDiffDays = x - x0;
    return ppx * curDiffDays;
  };
  const day_millis = 86400000;
  const dateToPix = function(d) {
    const curOffset = x0 + ((d - startDate) / day_millis);
    return calcPix(curOffset);
  };
  const timeStampToPix = function(tm) {
    const d = new Date(tm);
    return dateToPix(d);
  };
  const incMonths = function(origDate, numMonths) {
    return new Date(origDate.getFullYear(), origDate.getMonth() + numMonths, 1);
  };
  /*
  const diffDays = function(d0, d1) {
    return (d1 - d0) / day_millis;
  };
  */
  const offsetsToPix = function() {
    const result = [];
    for (let i = 0; i < offsets.length; ++i) {
      result[i] = calcPix(offsets[i]);
    }
    return result;
  };
  const lines = function(ctx, chartHeight, numIncMonths) {
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.strokeStyle = "#bbb";
    ctx.lineWidth = 0.25;
    let d0x = incMonths(startDate, numIncMonths);
    const txtY = chartHeight - 5;
    let curX = 0;
    while (curX < width) {
      curX = dateToPix(d0x);
      // console.log("Canvas width: " + canvas.width + ", curX: " + curX);
      ctx.beginPath();
      ctx.moveTo(curX, 0);
      ctx.lineTo(curX, chartHeight);
      ctx.stroke();
      if (drawLegend === true) {
        ctx.fillText(date2string(d0x), curX + 5, txtY);
      }
      d0x = incMonths(d0x, numIncMonths);
    }
  };
  const xaxis = offsetsToPix();
  return {
    dateToPix: dateToPix,
    timeStampToPix: timeStampToPix,
    xaxis: xaxis,
    startDate: startDate,
    lines: lines
  }
};
