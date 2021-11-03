var _charts = {};


exports.addCharts = key => charts => {
    _charts[key] = charts;
    console.log(_charts);
};

exports.getChartsImpl = just => nothing => key => {
    if (key in _charts) {
        return just(_charts[key]);
    }
    else {
        return nothing;
    }
};

exports.resetCharts = function () {
    _charts = {};
}