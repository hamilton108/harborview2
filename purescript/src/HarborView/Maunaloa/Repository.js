"use strict";

var _charts = {};

export const setJsonResponse = key => charts => () => {
    _charts[key] = charts;
};

export const getJsonResponseImpl = just => nothing => key => {
    if (key in _charts) {
        return just(_charts[key]);
    }
    else {
        return nothing;
    }
};

export const resetChart = key => () => {
    delete _charts[key];
}

export const resetCharts = () => {
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