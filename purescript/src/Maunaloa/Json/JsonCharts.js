

var _charts = {};


exports.addCharts = function (key) {
    return function (charts) {
        return function () {
            _charts[key] = charts;
            console.log(_charts);
        };
    };
};

exports.resetCharts = function () {
    _charts = {};
}