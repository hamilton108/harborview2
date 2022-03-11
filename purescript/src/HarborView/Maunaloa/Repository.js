"use strict";

var _charts = {};

exports.setJsonResponse = key => charts => () => {
    _charts[key] = charts;
};

exports.getJsonResponseImpl = just => nothing => key => {
    if (key in _charts) {
        return just(_charts[key]);
    }
    else {
        return nothing;
    }
};

exports.resetCharts = () => {
    _charts = {};
}

/*
exports.setDemo = key => charts => {
    return function () {
        _charts[key] = charts;
        console.log(_charts);
    }
}

exports.getDemoImpl = just => nothing => key => {
    console.log(key);
    if (key in _charts) {
        return just(_charts[key]);
    }
    else {
        return nothing;
    }
}
//*/