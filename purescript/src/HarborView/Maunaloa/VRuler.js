"use strict";

export const fi_lines = function (ctx) {
	return function (boundary) {
		return function (lines) {
			return function () {
				const x1 = boundary.p1;
				const x2 = boundary.p2;
				ctx.strokeStyle = "#000000";
				ctx.fillStyle = "#000000";
				ctx.lineWidth = 0.25;
				ctx.beginPath();
				for (var i = 0; i < lines.length; ++i) {
					const y = lines[i].p0;
					ctx.moveTo(x1, y);
					ctx.lineTo(x2, y);
					ctx.fillText(lines[i].tx, x1 + 5, y + 15);
				}
				ctx.stroke();
			}
		}
	}
}

