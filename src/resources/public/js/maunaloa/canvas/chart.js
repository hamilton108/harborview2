// import {Hruler,Vruler} from "./rulers.js";

export class Chart {
    constructor(myCanvasIds,myLevelLines) {
        this.myCanvasIds = myCanvasIds;
        //this.myHruler = null;
        //this.myVruler = null;
        this.myLevelLines = myLevelLines;
    }
    drawCanvases(cfg) {
        Chart.drawCanvas(cfg,cfg.chart,this.myCanvasIds.MAIN_CHART,true, this.myLevelLines);
        Chart.drawCanvas(cfg,cfg.chart2,this.myCanvasIds.OSC,true, null);
        Chart.drawCanvas(cfg,cfg.chart3,this.myCanvasIds.VOLUME,false, null);
    }
    static drawCanvas(cfg, curChart, curCanvas, drawLegend, levelLines) {
        if (curChart === null) {
            return;
        }
        let ctx, canvas;
        [ctx, canvas] = Chart.clearCanvas(curCanvas);
        const offsets = cfg.xaxis;
        const myHruler = MAUNALOA.hruler(1300, cfg.startdate, offsets, drawLegend, 5);
        // const myHruler = new Hruler(1300, cfg.startdate, offsets, drawLegend, 5);
        myHruler.lines(ctx, canvas.height, cfg.numIncMonths);

        const myVruler = MAUNALOA.vruler(canvas.height, curChart.valueRange);
        //const myVruler = new Vruler(canvas.height, curChart.valueRange);
        myVruler.lines(ctx, canvas.width, curChart.numVlines);

        const lineChart = MAUNALOA.lineChart(myHruler, myVruler, ctx);
        const strokes = cfg.strokes;
        if (curChart.lines !== null) {
            for (let i = 0; i < curChart.lines.length; ++i) {
                const line = curChart.lines[i];
                const curStroke = strokes[i] === undefined ? "#000000" : strokes[i];
                lineChart.drawLine(line, curStroke);
            }
        }
        if (curChart.bars !== null) {
            for (let i = 0; i < curChart.bars.length; ++i) {
                lineChart.drawBars(curChart.bars[i]);
            }
        }
        if (curChart.candlesticks !== null) {
            lineChart.drawCandlesticks(curChart.candlesticks);
        }
        if (levelLines !== null) {
            levelLines.reset(myHruler,myVruler);
        }
    }
    static clearCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return [ctx, canvas];
    }
    /*
    get myCanvases() {
        const result = [];
        result.push(document.getElementById(this.myCanvasIds.MAIN_CHART));
        result.push(document.getElementById(this.myCanvasIds.OSC));
        result.push(document.getElementById(this.myCanvasIds.VOLUME));
        return result;
    }
    */
}
