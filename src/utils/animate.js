export function animate(param) {
    const { timing, draw, duration } = param;
    const start = performance.now();
    requestAnimationFrame(function animate(time) {
        // timeFraction 从 0 增加到 1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        // 计算当前动画状态，百分比，0-1
        const progress = timing(timeFraction);

        draw(progress); // 绘制

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    });
}
/**
 * 下拉动画，0=>auto，auto=>0
 * @param el dom节点
 * @param isShow 是否显示
 * @param duration 持续时间
 */
export function slide(el, isShow, duration = 200) {
    if (!el) return;
    const { position, zIndex } = getComputedStyle(el);
    if (isShow) {
        el.style.position = "absolute";
        el.style.zIndex = "-100000";
        el.style.height = "auto";
    }
    //await nextTick();
    const height = el.offsetHeight;
    if (isShow) {
        el.style.position = position;
        el.style.zIndex = zIndex;
        el.style.height = "0px";
        el.style.overflow = "hidden";
    }
    animate({
        timing: timing.linear,
        draw: function(progress) {
            if (!el) return;
            el.style.height = isShow ? (progress === 1 ? "auto" : `${progress * height}px`) : progress === 0 ? "auto" : `${(1 - progress) * height}px`;
        },
        duration: duration
    });
}

const timing = {
    // 线性
    linear(timeFraction) {
        return timeFraction;
    },
    // n 次幂
    quad(timeFraction, n = 2) {
        return Math.pow(timeFraction, n);
    },
    // 圆弧
    circle(timeFraction) {
        return 1 - Math.sin(Math.acos(timeFraction));
    }
};
