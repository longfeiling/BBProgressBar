/**
 * User: 老三
 * Date: 13-11-17
 * Time: 上午7:58
 * 进度条接口定义.
 */

;(function(win, undefined) {
    "use strict";
    function ProgressBar(options) {
        this.options = options;
        this.init(options);
    }

    ProgressBar.prototype = {
        constructor: ProgressBar,
        /**
         * ProgressBar的初始化方法
         */
        init: function() {},
        /**
         * 绘制百分比方法
         * @param percent {Float} [0,1]闭区间
         */
        paint: function(percent) {},
        /**
         * 绘制当前进度提示语
         * @param text {String} 进度提示语
         */
        drawTips: function(text) {}
    };
    ProgressBar.extend = function extend(proto) {
        var parent = this;
        var child = function(){ return parent.apply(this, arguments); };

        child.extend = parent.extend;

        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        if (proto) {
            for(var key in proto) {
                child.prototype[key] = proto[key];
            }
        }

        child.__super__ = parent.prototype;

        return child;
    };
    win.ProgressBar = ProgressBar;
}(window));
