
document.addEventListener("DOMContentLoaded", function () {

    const chart = 
        { bars: []
        , candlesticks: [{ c: 34.22, h: 34.53, l: 33.61, o: 33.61 },{ c: 33.62, h: 34.44, l: 32.73, o: 34.07 },
            { c: 34.07, h: 34.29, l: 33.56, o: 33.93 },{ c: 33.12, h: 33.17, l: 31.85, o: 31.9 },{ c: 31.87, h: 32.02, l: 31.1, o: 31.25 },
            { c: 31.1, h: 31.43, l: 30.42, o: 30.93 },{ c: 30.92, h: 30.98, l: 30.0, o: 30.15 },{ c: 29.65, h: 29.92, l: 29.15, o: 29.29 },
            { c: 28.8, h: 29.4, l: 28.75, o: 29.4 },{ c: 29.41, h: 29.8, l: 29.02, o: 29.02 }]
        , lines: [
            [33.8,33.2,32.5,31.5,30.7,30.1,29.4,28.8,28.4,28.0],
            [29.3,29.0,28.6,28.3,28.0,27.8,27.6,27.4,27.3,27.3]]
        , numVlines: 10 
        , valueRange: [24.885714285714283,37.905] 
        };

    const ciwin = 
        { chart: chart
        , chart2: null 
        , chart3: null
        , numIncMonths: 1
        , startdate: 1557273600000.0
        , strokes: ["#000000","#ff0000","#aa00ff"]
        , ticker: "1"
        , xaxis: [3542,3541,3540,3539,3538,3535,3534,3533,3532,3531] 
        };
   
    const chartMapping1 =
        { ticker: "1"
        , chartId: "chart"
        , canvasId: "levellines-1"
        , chartHeight: 500.0
        , levelCanvasId: "levellines-1"
        , addLevelId: "addLevel-1"
        , fetchLevelId: "fetchLevel-1"
        };

    const mappings = [chartMapping1];
    /*
    const cfg = {
        "startdate": 1548115200000,
        "xaxis": [10, 9, 8, 5, 4],
        "chart3": null,
        "chart2": null,
        "chart": { "candlesticks": null, "lines": [[3.0, 2.2, 3.1, 4.2, 3.5]], "valueRange": [2.2, 4.2] }
    };

    const mappings = () => {
        const mainChart = {
            chartId: "chart",
            canvasId: "levellines-1",
            chartHeight: 500.0,
            levelCanvasId: "levellines-1",
            addLevelId: "addLevel-1"
        };
        return [mainChart];
    };
    */

    const unlistener = PS.Main.paint(mappings)(ciwin)();
    console.log(unlistener);
    const removeEventsBtn = document.getElementById("remove-events");
    removeEventsBtn.addEventListener("click", (evt) => {
        console.log(unlistener);
        unlistener(34)();
    });

})