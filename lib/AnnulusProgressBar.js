/**
 * User: 老三
 * Date: 13-11-17
 * Time: 下午5:02
 * 环形进度条实现
 */
;(function(win, undefined){
    "use strict";
    /**
     * 弧形进度条
     * @type {*}
     */
    var ProgressBar = win.ProgressBar,
        AnnulusProgressBar = ProgressBar.extend({
            init: function(options) {
                var self = this;
                self.panel = typeof options.panel === 'string' ? document.getElementById(options.panel) : options.panel;
                //圆弧厚度
                self.circleWidth = options.outlineWidth || 67;

                self.grooveWidth = options.barWidth || 41;
                self.barWidth = options.barWidth || self.grooveWidth;

                self.circleR = (options.r || 163);
                self.grooveR = self.circleR;
                self.barR = self.grooveR;
                self.bgR = self.circleR-self.circleWidth/2;

                self.panel.width = self.circleR * 2 + self.circleWidth;
                self.panel.height = self.panel.width;

                var paintbrush = self.paintbrush = self.panel.getContext("2d");
                this.percent = 0;
                self.center = self.circleR + self.circleWidth/2;
                self.initColors(paintbrush, self.panel.width);

                self.drawBg(paintbrush);
                self.drawCircle(paintbrush);
                self.drawGroove(paintbrush);
            },
            initColors: function(paintbrush, refer) {
                var self = this, referColor = refer / 2 - 1,
                    circleColor = self.circleColor = paintbrush.createLinearGradient(referColor, 0, referColor, refer);
                circleColor.addColorStop(0, "#d6eeff");
                circleColor.addColorStop(1, "#b6d8f0");

                var bgColor = self.bgColor = paintbrush.createLinearGradient(referColor, referColor * 0.133333, referColor, refer - referColor * 0.133333);
                bgColor.addColorStop(0, "#f9fcfe");
                bgColor.addColorStop(1, "#d9ebf7");

                var grooveColor = self.grooveColor = paintbrush.createLinearGradient(referColor, 0, referColor, refer);
                grooveColor.addColorStop(0, "#c1dff4");
                grooveColor.addColorStop(1, "#aacee6");

                var barColor = self.barColor = paintbrush.createLinearGradient(0, referColor, refer, referColor);
                barColor.addColorStop(0, "#FFD6AB");
                barColor.addColorStop(0.25, "#FDB7A7");
                barColor.addColorStop(0.5, "#FFE7AE");
                barColor.addColorStop(0.75, "#B4F9B1");
                barColor.addColorStop(1, "#E1F2B0");

            },
            PI_MUC2_DIV3: 2*Math.PI/3,
            PI_MUL_2: Math.PI*2,
            paint: function(percent) {
                var self = this, paintbrush = self.paintbrush;
                self.percent = percent;
                self.drawGroove(paintbrush)
                self.drawBg(paintbrush);
                self.drawBar(paintbrush,percent);
                self.drawPercent(paintbrush, percent);
                //paintbrush.save();
            },
            drawBg: function(paintbrush) {
                var self = this;
                paintbrush.beginPath();
                paintbrush.fillStyle = self.bgColor;
                paintbrush.arc(self.center, self.center, self.bgR, 0, self.PI_MUL_2, true);
                paintbrush.fill();
                paintbrush.save();
            },
            drawCircle: function(paintbrush) {
                var self = this;
                paintbrush.beginPath();
                paintbrush.strokeStyle = self.circleColor;
                paintbrush.lineWidth = self.circleWidth;
                paintbrush.arc(self.center, self.center, self.circleR, 0,self.PI_MUL_2, true);
                paintbrush.stroke();
                paintbrush.save();
            },
            drawBar: function(paintbrush,percent) {
                if(percent > 1) percent = 1;
                if(percent < 0) percent = 0;
                var self = this,
                    startAngle = self.PI_MUC2_DIV3,
                    endAngle = self.PI_MUC2_DIV3 + 5/3 * Math.PI * percent,
                    x0 = self.center,
                    y0 = x0,
                    sinStartAngle = Math.sin(startAngle),
                    cosStartAngle = Math.cos(startAngle),
                    sinEndAngle = Math.sin(endAngle),
                    cosEndAngle = Math.cos(endAngle),
                    x1 = cosStartAngle * self.barR + x0,
                    y1 = sinStartAngle * self.barR + y0,
                    x2 = cosEndAngle * self.barR + x0,
                    y2 = sinEndAngle * self.barR + y0;

                paintbrush.beginPath();
                paintbrush.strokeStyle = self.barColor;
                paintbrush.lineWidth = self.barWidth;
                paintbrush.arc(self.center, self.center, self.barR, self.PI_MUC2_DIV3, self.PI_MUC2_DIV3 + 5/3 * Math.PI * percent, false);
                paintbrush.stroke();
                self.drawEndpoint(paintbrush, x1, y1, self.barWidth/ 2, self.barColor);
                self.drawEndpoint(paintbrush, x2, y2, self.barWidth/ 2, self.barColor);
            },
            drawPercent: function(paintbrush, percent) {
                var self = this,
                    percentTxt = (percent * 100).toFixed(0) + "%",
                    bgCenter = self.center;
                // 设置字体
                paintbrush.font = "Bold " + 2*self.bgR/3 + "px Arial";
                // 设置对齐方式
                paintbrush.textAlign = "center";
                // 设置填充颜色
                paintbrush.fillStyle = "#80A9C8";
                // 设置字体内容，以及在画布上的位置
                paintbrush.fillText(percentTxt, bgCenter, bgCenter + self.bgR/4);

            },
            drawTips: function(tipTxt) {
                var self = this,
                    paintbrush = self.paintbrush,
                    bgCenter = self.center;
                self.drawCircle(paintbrush);
                self.paint(self.percent);
                // 设置字体
                paintbrush.font = "Bold " + self.circleWidth/2 + "px Arial";
                // 设置对齐方式
                paintbrush.textAlign = "center";
                // 设置填充颜色
                paintbrush.fillStyle = "#80A9C8";
                // 设置字体内容，以及在画布上的位置
                paintbrush.fillText(tipTxt, bgCenter, bgCenter + self.circleR);
            },
            drawEndpoint: function(paintbrush, x, y, r, fillColor) {
                var self = this;
                paintbrush.beginPath();
                paintbrush.fillStyle = fillColor;
                paintbrush.arc(x, y, r, 0, self.PI_MUL_2, false);
                paintbrush.fill();
            },
            drawGroove: function(paintbrush) {
                var self = this;
                var startAngle = self.PI_MUC2_DIV3,
                    endAngle = Math.PI/3,
                    x0 = self.center,
                    y0 = x0,
                    sinStartAngle = Math.sin(startAngle),
                    cosStartAngle = Math.cos(startAngle),
                    sinEndAngle = Math.sin(endAngle),
                    cosEndAngle = Math.cos(endAngle),
                    x1 = cosStartAngle * self.barR + x0,
                    y1 = sinStartAngle * self.barR + y0,
                    x2 = cosEndAngle * self.barR + x0,
                    y2 = sinEndAngle * self.barR + y0;
                paintbrush.beginPath();
                paintbrush.strokeStyle = self.grooveColor;
                paintbrush.lineWidth = self.grooveWidth;
                paintbrush.arc(self.center, self.center, self.grooveR, self.PI_MUC2_DIV3, Math.PI/3, false);
                paintbrush.stroke();
                self.drawEndpoint(paintbrush, x1, y1, self.barWidth/ 2, self.grooveColor);
                self.drawEndpoint(paintbrush, x2, y2, self.barWidth/ 2, self.grooveColor);

            }
        });
    win.AnnulusProgressBar = AnnulusProgressBar;
}(window));

