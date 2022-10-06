
export class Doodle {
    constructor(cfg) {
        this.canvas = document.getElementById(cfg.DOODLE);
        if (this.canvas !== null) {
            this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this), false);
            this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this), false);
            this.canvas.addEventListener("mouseup", this.handleMouseDone.bind(this), false);
            this.canvas.addEventListener("mouseleave", this.handleMouseDone.bind(this), false);
            /*
            c_scrap.addEventListener('mousemove', this.handleMouseMove(this), false);
            c_scrap.addEventListener('mouseup', this.handleMouseDone(this), false);
            c_scrap.addEventListener('mouseleave', this.handleMouseDone(this), false);
            this.ctx = c_scrap.getContext("2d");
            */
        }
        this.p0 = null;
        this.MODE = Doodle.MODE_NONE;
        this.guiEvent(cfg.BTN_LINE, () => { this.MODE = Doodle.MODE_LINE_BEGIN; });
        this.guiEvent(cfg.BTN_HORIZ, () => { this.MODE = Doodle.MODE_HORIZ_BEGIN; });
        this.guiEvent(cfg.BTN_ARROW, () => { this.MODE = Doodle.MODE_ARROW; });
        this.guiEvent(cfg.BTN_TEXT, () => { this.MODE = Doodle.MODE_TEXT; });
        this.getLineSize = this.getLineSizeFn(cfg.RG_LINE_SIZE);

        this.color = document.getElementById(cfg.COLOR);
        this.comment = document.getElementById(cfg.COMMENT);
        this.arrowOrient = document.getElementById(cfg.ARROW_ORIENT);
    }
    get curContext() {
        return this.canvas.getContext("2d");
    }
    guiEvent(domId, fn) {
        const obj = document.getElementById(domId);
        if (obj !== null) {
            obj.onclick = fn.bind(this);
        }
    }
    clearCanvas() {
        const canvas = this.canvas;
        this.curContext.clearRect(0, 0, canvas.width, canvas.height)
    }
    getLineSizeFn(lineSizeId) {
        return function () {
            /*const qry = `input[name="${lineSizeId}"]:checked`;
            const qry = `input[name="${lineSizeId}"]:checked`;
            const rgLine = document.querySelector(qry).value;*/
            const rgLine = document.getElementById(lineSizeId).value;
            switch (rgLine) {
                case "1":
                    return 1;
                case "2":
                    return 3;
                case "3":
                    return 7;
            }
        }
    }
    handleMouseDown(e) {
        switch (this.MODE) {
            case Doodle.MODE_LINE_BEGIN:
                this.p0 = {
                    x: e.offsetX,
                    y: e.offsetY
                };
                this.MODE = Doodle.MODE_LINE_END;
                break;
            case Doodle.MODE_LINE_END:
                const ctx = this.curContext;
                ctx.lineWidth = this.getLineSize();
                ctx.strokeStyle = this.color.value;
                ctx.beginPath();
                ctx.moveTo(this.p0.x, this.p0.y);
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
                this.p0 = null;
                this.MODE = Doodle.MODE_NONE;
                break;
            case Doodle.MODE_HORIZ_BEGIN:
                this.p0 = {
                    x: e.offsetX,
                    y: e.offsetY
                };
                this.MODE = Doodle.MODE_HORIZ_END;
                break;
            case Doodle.MODE_HORIZ_END:
                const ctx3 = this.curContext;
                ctx3.strokeStyle = this.color.value;
                //ctx3.lineJoin = "round";
                ctx3.lineWidth = this.getLineSize();
                ctx3.beginPath();
                ctx3.moveTo(this.p0.x, this.p0.y);
                ctx3.lineTo(e.offsetX, this.p0.y);
                ctx3.stroke();
                this.p0 = null;
                this.MODE = Doodle.MODE_NONE;
                break;
            case Doodle.MODE_ARROW:
                const ctx2 = this.curContext;
                const clr = this.color.value;
                ctx2.fillStyle = clr;
                ctx2.strokeStyle = clr;
                ctx2.lineWidth = this.getLineSize();
                ctx2.font = "16px Arial";
                Doodle.drawArrowLine(ctx2, e.offsetX, e.offsetY, this.comment.value, this.arrowOrient.value);
                this.MODE = Doodle.MODE_NONE;
                break;
            case Doodle.MODE_TEXT:
                const ctx4 = this.curContext;
                ctx4.fillStyle = this.color.value;
                ctx4.font = "16px Arial";
                ctx4.fillText(this.comment.value, e.offsetX, e.offsetY);
                this.MODE = Doodle.MODE_NONE;
                break;
            default:
                this.MODE = Doodle.MODE_PAINT;
                this.clickX = [];
                this.clickY = [];
                this.addClick(e.offsetX, e.offsetY);
                break;

        }
        e.preventDefault();
        e.stopPropagation();
    }
    handleMouseMove(e) {
        if (this.MODE === Doodle.MODE_PAINT) {
            this.addClick(e.offsetX, e.offsetY);
            this.redraw();
            e.preventDefault();
            e.stopPropagation();
        }
    }
    handleMouseDone(e) {
        if (this.MODE === Doodle.MODE_PAINT) {
            this.clickX = null;
            this.clickY = null;
            this.MODE = self.MODE_NONE;
            e.preventDefault();
            e.stopPropagation();
        }
    }
    addClick(x, y) {
        this.clickX.push(x);
        this.clickY.push(y);
    }
    redraw() {
        const context = this.curContext;
        context.strokeStyle = this.color.value;
        context.lineJoin = "round";
        context.lineWidth = this.getLineSize();
        const cx = this.clickX;
        const cy = this.clickY;
        context.beginPath();
        context.moveTo(cx[0], cy[0]);
        for (let i = 1; i < cx.length; ++i) {
            context.lineTo(cx[i], cy[i]);
        }
        context.stroke();
    }
    static drawArrowLine(ctx, x, y, comment, orientation) {
        let x1 = x - 140;
        let y1 = y + 50;
        let x2 = x - 105;
        let y2 = y + 120;
        let x3 = x - 20;
        let y3 = y + 5;
        let x4 = x + 5;
        let y4 = y + 15;
        let x5 = x - 160;
        let y5 = y + 40;
        let ty, tx;
        switch (orientation) {
            case "NW":
                ty = 2 * y;
                y1 = ty - y1;
                y2 = ty - y2;
                y3 = ty - y3;
                y4 = ty - y4;
                y5 = ty - y5 + 10;
                break;
            case "NE":
                tx = 2 * x;
                ty = 2 * y;
                x1 = tx - x1;
                y1 = ty - y1;
                x2 = tx - x2;
                y2 = ty - y2;
                x3 = tx - x3;
                y3 = ty - y3;
                x4 = tx - x4;
                y4 = ty - y4;
                x5 = tx - x5 - 100;
                y5 = ty - y5 + 10;
                break;
            case "SE":
                tx = 2 * x;
                x1 = tx - x1;
                x2 = tx - x2;
                x3 = tx - x3;
                x4 = tx - x4;
                x5 = tx - x5 - 100;
                break;
        }
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(x2, y2, x, y);
        ctx.lineTo(x3, y3);
        ctx.moveTo(x, y);
        ctx.lineTo(x4, y4);
        ctx.stroke();
        ctx.fillText(comment, x5, y5);
    }
}
Doodle.MODE_NONE = 0;
Doodle.MODE_LINE_BEGIN = 1;
Doodle.MODE_LINE_END = 2;
Doodle.MODE_HORIZ_BEGIN = 3;
Doodle.MODE_HORIZ_END = 4;
Doodle.MODE_ARROW = 5;
Doodle.MODE_TEXT = 6;
Doodle.MODE_PAINT = 7;


