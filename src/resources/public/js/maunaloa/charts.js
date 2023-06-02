//import { Chart } from "./canvas/chart.js";
//import { LevelLines } from "./canvas/levelline.js";

import { Scrapbook } from "./canvas/scrapbook.js";

document.addEventListener("DOMContentLoaded", function () {
    const canvases = {
        DAY: {
            MAIN_CHART: 'chart-1',
            VOLUME: 'vol-1',
            OSC: 'osc-1',
            LEVEL_LINES: 'levellines-1',
            BTN_LEVELLINE: "btn-levelline-1",
            BTN_RISCLINES: "btn-persistent-levelline-1",
            BTN_DEL_RISCLINES: "btn-del-persistent-levelline-1"
        },
        WEEK: {
            MAIN_CHART: 'chart-2',
            VOLUME: 'vol-2',
            OSC: 'osc-2',
            LEVEL_LINES: 'levellines-2',
            BTN_LEVELLINE: "btn-levelline-2",
            BTN_RISCLINES: "btn-persistent-levelline-2",
            BTN_DEL_RISCLINES: "btn-del-persistent-levelline-2"
        },
        MONTH: {
            MAIN_CHART: 'chart-3',
            VOLUME: 'vol-3',
            OSC: 'osc-3',
            LEVEL_LINES: 'levellines-3',
            BTN_LEVELLINE: "btn-levelline-3",
            BTN_RISCLINES: "btn-persistent-levelline-3",
            BTN_DEL_RISCLINES: "btn-del-persistent-levelline-3"
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
    const CHART_WIDTH = 1750;

    const setCanvasSizes = function () {
        setCanvasSize('canvas.c1', CHART_WIDTH, 600);
        setCanvasSize('canvas.c2', CHART_WIDTH, 200);
        setCanvasSize('canvas.c3', CHART_WIDTH, 110);
    };
    setCanvasSizes();

    //---------------------- Elm.Maunaloa.Charts ---------------------------

    const saveCanvases = (canvases, canvasVolume, canvasCyberCycle, scrapbook) => {
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
        scrapbook.drawDraggable(newCtx);
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
            chartId: "chart", canvasId: c.MAIN_CHART,
            chartHeight: 600.0,
            levelCanvasId: c.LEVEL_LINES,
            addLevelId: c.BTN_LEVELLINE,
            fetchLevelId: c.BTN_RISCLINES,
            delLevelId: c.BTN_DEL_RISCLINES
        };
        const osc = {
            chartId: "chart2", canvasId: c.OSC,
            chartHeight: 200.0,
            levelCanvasId: "",
            addLevelId: "",
            fetchLevelId: "",
            delLevelId: ""
        };
        return [mainChart, osc];
    };

    const fetchTickers = (nodeId, eventHandler) => {
        fetch("/maunaloa/stockprice/tickers").then(result => {
            result.json().then(data => {
                const node = document.getElementById(nodeId);
                node.addEventListener("change", eventHandler);

                data.forEach(x => {
                    let opt = document.createElement("option");
                    opt.value = x.v;
                    opt.text = x.t;
                    node.add(opt);
                })
            });
        });
    };

    const DAY = 1;
    const WEEK = 2;
    const MONTH = 3;
    const SHIFT_WINDOW = 120;

    const chartTypeParams = (chartType) => {
        var result = {};
        switch (chartType) {
            case DAY:
                result.canvasesType = canvases.DAY;
                result.scrapBookConfig = scrapbooks.DAY;
                result.fetchTickersNode = "tickers-1";
                result.prevBtnClass = ".shift-prev-1";
                result.nextBtnClass = ".shift-next-1";
                result.lastBtnClass = ".shift-last-1";
                result.resetChartsBtnClass = ".reset-chart-1";
                break;
            case WEEK:
                result.canvasesType = canvases.WEEK;
                result.scrapBookConfig = scrapbooks.WEEK;
                result.fetchTickersNode = "tickers-2";
                result.prevBtnClass = ".shift-prev-2";
                result.nextBtnClass = ".shift-next-2";
                result.lastBtnClass = ".shift-last-2";
                result.resetChartsBtnClass = ".reset-chart-2";
                break;
            case MONTH:
                result.canvasesType = canvases.MONTH;
                result.scrapBookConfig = scrapbooks.MONTH;
                result.fetchTickersNode = "tickers-3";
                result.prevBtnClass = ".shift-prev-3";
                result.nextBtnClass = ".shift-next-3";
                result.lastBtnClass = ".shift-last-3";
                result.resetChartsBtnClass = ".reset-chart-3";
                break;
            default:
                result.canvasesType = canvases.DAY;
                result.scrapBookConfig = scrapbooks.DAY;
                result.fetchTickersNode = "tickers-1";
                result.prevBtnClass = ".shift-prev-1";
                result.nextBtnClass = ".shift-next-1";
                result.lastBtnClass = ".shift-last-1";
                result.resetChartsBtnClass = ".reset-chart-1";
                break;
        }
        return result;
    }

    const isPositiveInt = (val) => {
        return /^\d+$/.test(val);
    }

    const init = (chartType) => {
        const _params = chartTypeParams(chartType);
        const _chartMappings = toChartMappings(_params.canvasesType);
        var _currentTicker = null;
        var _shiftIndex = 0;
        const fetchPrices = (event) => {
            if (isPositiveInt(event.target.value)) {
                _currentTicker = event.target.value;
                _shiftIndex = 0;
                PS.paint(chartType)(_chartMappings)(event.target.value)(0)(SHIFT_WINDOW)();
            }
            else {
                _currentTicker = null;
                PS.paintEmpty(_chartMappings)();
            }
        };

        fetchTickers(_params.fetchTickersNode, fetchPrices);

        //---------------------- Shift events ----------------------

        const shiftPricesPrev = (event) => {
            if (_currentTicker == null) {
                return;
            }
            _shiftIndex += SHIFT_WINDOW;
            PS.paint(chartType)(_chartMappings)(_currentTicker)(_shiftIndex)(SHIFT_WINDOW)();
        };
        const shiftPricesNext = (event) => {
            if (_currentTicker == null) {
                return;
            }
            _shiftIndex -= SHIFT_WINDOW;
            if (_shiftIndex < 0) {
                _shiftIndex = 0;
            }
            PS.paint(chartType)(_chartMappings)(_currentTicker)(_shiftIndex)(SHIFT_WINDOW)();
        }
        const shiftPricesLast = (event) => {
            if (_currentTicker == null) {
                return;
            }
            _shiftIndex = 0;
            PS.paint(chartType)(_chartMappings)(_currentTicker)(0)(SHIFT_WINDOW)();
        };
        const resetCharts = (event) => {
            if (_currentTicker == null) {
                return;
            }
            PS.resetCharts();
            _shiftIndex = 0;
            PS.paint(chartType)(_chartMappings)(_currentTicker)(0)(SHIFT_WINDOW)();
        }
        const prevBtn = document.querySelector(_params.prevBtnClass);
        prevBtn.addEventListener("click", shiftPricesPrev);
        const nextBtn = document.querySelector(_params.nextBtnClass);
        nextBtn.addEventListener("click", shiftPricesNext);
        const lastBtn = document.querySelector(_params.lastBtnClass);
        lastBtn.addEventListener("click", shiftPricesLast);
        const resetChartsBtn = document.querySelector(_params.resetChartsBtnClass);
        resetChartsBtn.addEventListener("click", resetCharts);

        //---------------------- Scrapbooks ----------------------
        const scrapConfig = _params.scrapBookConfig;
        const scrap = new Scrapbook(scrapConfig);
        const btnClear = document.getElementById(scrapConfig.BTN_CLEAR);
        btnClear.onclick = () => {
            scrap.clear();
            PS.clearLevelLines(chartType)();
        };
        scrap.clear();
        const btnSave = document.getElementById(scrapConfig.BTN_SAVE);
        btnSave.onclick = () => {
            const canvasConfig = _params.canvasesType;
            const blobCanvases = [];
            blobCanvases.push(document.getElementById(canvasConfig.MAIN_CHART));
            blobCanvases.push(document.getElementById(scrapConfig.DOODLE));
            blobCanvases.push(document.getElementById(canvasConfig.LEVEL_LINES));
            const canvasVolume = document.getElementById(canvasConfig.VOLUME);
            const canvasCyberCycle = document.getElementById(canvasConfig.OSC);
            saveCanvases(blobCanvases, canvasVolume, canvasCyberCycle, scrap);
        };

    };

    init(DAY);
    init(WEEK);
    init(MONTH);


    //elmApp("my-app2", 2, canvases.WEEK, scrapbooks.WEEK);
    //elmApp("my-app3", 3, canvases.MONTH, scrapbooks.MONTH);
    //---------------------- Scrapbooks ---------------------------
    //const scrap1 = new Scrapbook(scrapbooks.DAY);
});
