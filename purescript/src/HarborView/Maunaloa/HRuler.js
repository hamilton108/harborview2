"use strict";

export const fi_incMonths = function (startTime) {
	return function (numMonths) {
		var stm = new Date(startTime);
		return Date.UTC(stm.getFullYear(), stm.getMonth() + numMonths, 1);
	}
}

export const fi_incDays = function (startTime) {
	return function (offset) {
		var stm = new Date(startTime);
		return Date.UTC(stm.getFullYear(), stm.getMonth(), stm.getDate() + offset);
	}
}

export const fi_dateToString = function (tm) {
	var d = new Date(tm);
	var m = d.getMonth() + 1;
	if (m < 10) {
		return "0" + m + "." + d.getFullYear();
	}
	else {
		return m + "." + d.getFullYear();
	}
}

export const fi_lines = function (ctx) {
	return function (boundary) {
		return function (lines) {
			return function () {
				const y1 = boundary.p1;
				const y2 = boundary.p2;
				ctx.strokeStyle = "#000000";
				ctx.fillStyle = "#000000";
				ctx.lineWidth = 0.25;
				ctx.beginPath();
				for (var i = 0; i < lines.length; ++i) {
					const x = lines[i].p0;
					ctx.moveTo(x, y1);
					ctx.lineTo(x, y2);
					ctx.fillText(lines[i].tx, x + 5, y1 + 15);
				}
				ctx.stroke();
			}
		}
	}
}

export const fi_startOfNextMonth = function (tm) {
	const curDate = new Date(tm);
	return Date.UTC(curDate.getFullYear(), curDate.getMonth() + 1, 1);
}
