import { Chart } from "./canvas/chart.js";
import { Scrapbook } from "./canvas/scrapbook.js";
//import { LevelLines } from "./canvas/levelline.js";

document.addEventListener("DOMContentLoaded", function () {
    const canvases = {
        DAY: {
            MAIN_CHART: 'chart-1',
            VOLUME: 'vol-1',
            OSC: 'osc-1',
            LEVEL_LINES: 'levellines-1',
            BTN_LEVELLINE: "btn-levelline-1",
            BTN_RISCLINES: "btn-persistent-levelline-1"
        },
        WEEK: {
            MAIN_CHART: 'chart-2',
            VOLUME: 'vol-2',
            OSC: 'osc-2',
            LEVEL_LINES: 'levellines-2',
            BTN_LEVELLINE: "btn-levelline-2"
        },
        MONTH: {
            MAIN_CHART: 'chart-3',
            VOLUME: 'vol-3',
            OSC: 'osc-3',
            LEVEL_LINES: 'levellines-3',
            BTN_LEVELLINE: "btn-levelline-3"
        }
    };
    const scrapbooks = {
        DAY: {
            SVG: 'svg-1',
            DIV_DOODLE: 'div-1-doodle',
            DIV_LEVEL_LINES: 'div-1-levelline',
            DOODLE: 'doodle-1',
            RG_LAYER: "rg-layer1",
            COLOR: "color1",
            RG_LINE_SIZE: "rg-line1",
            BTN_LINE: "btn-scrapbook1-line",
            BTN_HORIZ: "btn-scrapbook1-horiz",
            BTN_ARROW: "btn-scrapbook1-arrow",
            BTN_TEXT: "btn-scrapbook1-text",
            BTN_CLEAR: "btn-scrapbook1-clear",
            BTN_SAVE: "btn-scrapbook1-save",
            BTN_DRAGGABLE: "btn-draggable-1",
            ARROW_ORIENT: "arrow1-orient",
            COMMENT: "comment1",
        },
        WEEK: {
            SVG: 'svg-2',
            DIV_DOODLE: 'div-2-doodle',
            DIV_LEVEL_LINES: 'div-2-levelline',
            DOODLE: 'doodle-2',
            RG_LAYER: "rg-layer2",
            COLOR: "color2",
            RG_LINE_SIZE: "rg-line2",
            BTN_LINE: "btn-scrapbook2-line",
            BTN_HORIZ: "btn-scrapbook2-horiz",
            BTN_ARROW: "btn-scrapbook2-arrow",
            BTN_TEXT: "btn-scrapbook2-text",
            BTN_CLEAR: "btn-scrapbook2-clear",
            BTN_SAVE: "btn-scrapbook2-save",
            BTN_DRAGGABLE: "btn-draggable-2",
            ARROW_ORIENT: "arrow2-orient",
            COMMENT: "comment2",
        },
        MONTH: {
            SVG: 'svg-3',
            DIV_DOODLE: 'div-3-doodle',
            DIV_LEVEL_LINES: 'div-3-levelline',
            DOODLE: 'doodle-3',
            RG_LAYER: "rg-layer3",
            COLOR: "color3",
            RG_LINE_SIZE: "rg-line3",
            BTN_LINE: "btn-scrapbook3-line",
            BTN_HORIZ: "btn-scrapbook3-horiz",
            BTN_ARROW: "btn-scrapbook3-arrow",
            BTN_TEXT: "btn-scrapbook3-text",
            BTN_CLEAR: "btn-scrapbook3-clear",
            BTN_SAVE: "btn-scrapbook3-save",
            BTN_DRAGGABLE: "btn-draggable-3",
            ARROW_ORIENT: "arrow3-orient",
            COMMENT: "comment3",
        }
    };
    const setCanvasSize = function (selector, w, h) {
        const c1 = document.querySelectorAll(selector);
        for (let i = 0; i < c1.length; ++i) {
            const canvas = c1[i];
            canvas.width = w;
            canvas.height = h;
        }
    };
    const setCanvasSizes = function () {
        setCanvasSize('canvas.c1', 1310, 500);
        setCanvasSize('canvas.c2', 1310, 200);
        setCanvasSize('canvas.c3', 1310, 110);
    };
    setCanvasSizes();
    /*
    const draggableBtn1 = document.getElementById("btn-draggable-1");
    draggableBtn1.onclick = function() {
        Draggable.addLine("svg-1");
    };
    */
    //---------------------- Elm.Maunaloa.Charts ---------------------------

    const saveCanvases = (canvases, canvasVolume, canvasCyberCycle) => {
        const c1 = canvases[0]; // this.canvas; //document.getElementById('canvas');
        const w1 = c1.width;
        const h1 = c1.height;
        const h2 = canvasVolume.height;
        const h3 = canvasCyberCycle.height;
        const newCanvas = document.createElement('canvas');
        newCanvas.width = w1;
        newCanvas.height = h1 + h2 + h3;
        const newCtx = newCanvas.getContext("2d");
        newCtx.fillStyle = "FloralWhite";
        newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
        canvases.forEach(cx => {
            newCtx.drawImage(cx, 0, 0);
        });
        newCtx.drawImage(canvasVolume, 0, h1);
        newCtx.drawImage(canvasCyberCycle, 0, h1 + h2);
        newCanvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "scrap.png";
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        });
        newCanvas.remove();
    };
    const toChartMappings = (c) => {
        const mainChart = {
            chartId: "chart", canvasId: c.MAIN_CHART, chartHeight: 500.0, 
            levelCanvasId: c.LEVEL_LINES, addLevelId: c.BTN_LEVELLINE, fetchLevelId: c.BTN_RISCLINES
        };
        const osc = {
            chartId: "chart2", canvasId: c.OSC, chartHeight: 200.0, levelCanvasId: "", addLevelId: "", fetchLevelId: ""
        };
        return [mainChart, osc];
    };

    let unlistener = null;

    const elmApp = (appId, chartRes, myCanvases, config) => {
        //===>>> const levelLines = new LevelLines(config);
        const scrap = new Scrapbook(config);
        const node = document.getElementById(appId);
        const app = Elm.Maunaloa.Charts.Main.init({
            node: node,
            flags: chartRes
        });
        //const myChart = new Chart(myCanvases, levelLines);
        app.ports.drawCanvas.subscribe(cfg => {
            if (unlistener !== null) {
                unlistener(1)();
            }
            //console.log(cfg);
            scrap.clear();
            //myChart.drawCanvases(cfg);
            const mappings = toChartMappings(myCanvases);
            //PS.Main.paint(mappings)(cfg)();
            unlistener = PS.Main.paint(mappings)(cfg)();
            console.log(unlistener);
        });
        const drawRiscLines = function (riscLines) {
            //===>>> levelLines.addRiscLines(riscLines);
        };
        app.ports.drawRiscLines.subscribe(drawRiscLines);
        const drawSpot = function (spot) {
            //===>>> levelLines.spot = spot;
        };
        app.ports.drawSpot.subscribe(drawSpot);

        const btnClear = document.getElementById(config.BTN_CLEAR);
        btnClear.onclick = () => {
            //===>>> levelLines.clearCanvas();
        };
        scrap.clear();
        const btnSave = document.getElementById(config.BTN_SAVE);
        btnSave.onclick = () => {
            const blobCanvases = [];
            blobCanvases.push(document.getElementById(myCanvases.MAIN_CHART));
            blobCanvases.push(document.getElementById(config.DOODLE));
            blobCanvases.push(document.getElementById(config.LEVEL_LINES));
            const canvasVolume = document.getElementById(myCanvases.VOLUME);
            const canvasCyberCycle = document.getElementById(myCanvases.OSC);
            saveCanvases(blobCanvases, canvasVolume, canvasCyberCycle);
        };
    };
    elmApp("my-app", 1, canvases.DAY, scrapbooks.DAY);
    elmApp("my-app2", 2, canvases.WEEK, scrapbooks.WEEK);
    elmApp("my-app3", 3, canvases.MONTH, scrapbooks.MONTH);
    //---------------------- Scrapbooks ---------------------------
    //const scrap1 = new Scrapbook(scrapbooks.DAY);
});
