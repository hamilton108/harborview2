
export const alert = function (msg) {
  return function () {
    alert(msg);
  }
}