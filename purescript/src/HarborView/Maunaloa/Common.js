
export const alert = function (msg) {
    return function () {
        alert(msg);
    }
}

export const showJson = function (json) {
    return function () {
        console.log(json);
    }
}