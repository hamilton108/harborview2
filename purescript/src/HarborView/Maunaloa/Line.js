"use strict";

exports.fi_paint = function (lines) {
	return function (ctx) {
		return function () {
			for (var i = 0; i < lines.length; ++i) {
				paintLine(ctx, lines[i]);
			}
		}
	}
};

const paintLine = function (ctx, line) {
	ctx.strokeStyle = line.strokeStyle;
	ctx.lineWidth = 0.5;
	ctx.beginPath();
	const y = line.yaxis;
	const x = line.xaxis;
	ctx.moveTo(x[0], y[0]);
	for (var i = 1; i < x.length; ++i) {
		ctx.lineTo(x[i], y[i]);
	}
	ctx.stroke();
};
