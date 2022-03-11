
exports.alert = function (msg) {
    return function () {
        alert(msg);
    }
}

exports.showJson = function (json) {
    return function () {
        console.log(json);
    }
}