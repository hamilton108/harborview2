
export class Vruler {
    constructor(chartHeight, valueRange) {
        this.minVal = valueRange[0];
        this.maxVal = valueRange[1];
        this.ppy = chartHeight / (this.maxVal - this.minVal);
        this.chartHeight = chartHeight;
    }
    static double2decimal(x, roundingFactor) {
        const rf = roundingFactor || 100;
        return (Math.round(x * rf)) / rf;
    };
    pixToValue(pix) {
        return Vruler.double2decimal(this.maxVal - (pix / this.ppy));
    };
    valueToPix(v) {
        return Math.round((this.maxVal - v) * this.ppy);
    };
    lines(ctx, chartWidth, numVlines) {
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.strokeStyle = "#bbb";
        ctx.lineWidth = 0.25;
        const step = this.chartHeight / (numVlines - 1);
        for (let i = 0; i < numVlines; ++i) {
            const curStep = step * i;
            const curVal = Vruler.double2decimal(this.maxVal - (curStep / this.ppy));
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
}

export class Hruler {
    constructor(width, startDateAsMillis, offsets, drawLegend, buffer) {
        //this.offsets = offsets;
        this.x0 = offsets[offsets.length - 1];
        this.x1 = offsets[0] + buffer;
        const curDiffDays = this.x1 - this.x0;
        this.ppx = width / curDiffDays;
        this.startDate = new Date(startDateAsMillis);
        this.drawLegend = drawLegend;
        this.width = width;
        this.xaxis = this.offsetsToPix(offsets);
    }
    static date2string(d) {
        return (d.getMonth() + 1) + "." + d.getFullYear();
    };
    calcPix(x) {
        const curDiffDays = x - this.x0;
        return this.ppx * curDiffDays;
    };
    dateToPix(d) {
        const curOffset = this.x0 + ((d - this.startDate) / 86400000);
        return this.calcPix(curOffset);
    };
    timeStampToPix(tm) {
        const d = new Date(tm);
        return this.dateToPix(d);
    };
    static incMonths(origDate, numMonths) {
        return new Date(origDate.getFullYear(), origDate.getMonth() + numMonths, 1);
    };
    offsetsToPix(offsets) {
        const result = [];
        for (let i = 0; i < offsets.length; ++i) {
            result[i] = this.calcPix(offsets[i]);
        }
        return result;
    };
    lines(ctx, chartHeight, numIncMonths) {
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.strokeStyle = "#bbb";
        ctx.lineWidth = 0.25;
        let d0x = Hruler.incMonths(this.startDate, numIncMonths);
        const txtY = chartHeight - 5;
        let curX = 0;
        while (curX < this.width) {
            curX = this.dateToPix(d0x);
            // console.log("Canvas width: " + canvas.width + ", curX: " + curX);
            ctx.beginPath();
            ctx.moveTo(curX, 0);
            ctx.lineTo(curX, chartHeight);
            ctx.stroke();
            if (this.drawLegend === true) {
                ctx.fillText(Hruler.date2string(d0x), curX + 5, txtY);
            }
            d0x = Hruler.incMonths(d0x, numIncMonths);
        }
    }
}
