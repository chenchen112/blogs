# 节流

节流是指当事件触发时，会执行这个事件的响应函数。但是该事件如果被频繁触发，那么节流函数会按照一定的频率来执行函数

``` javascript

// leading参数用来控制是否第一次立即执行，默认为true
function throttle(fn, interval, leading = true) {
  //该变量用于记录上一次函数的执行事件
  let lastTime = 0;
  // 内部的控制是否立即执行的变量
  let isLeading = true;

  const _throttle = function (...args) {
    // 获取当前时间
    const nowTime = new Date().getTime();

    // 第一次不需要立即执行
    if (!leading && isLeading) {
      // 将lastTime设置为nowTime，这样就不会导致第一次时remainTime大于interval
      lastTime = nowTime;
      // 将isLeading设置为false，这样就才不会对后续的lastTime产生影响。
      isLeading = false;
    }

    // cd剩余时间
    const remainTime = nowTime - lastTime;
    // 如果剩余时间大于间隔时间，也就是说可以再次执行函数
    if (remainTime - interval >= 0) {
      fn.apply(this, args);
      // 将上一次函数执行的时间设置为nowTime，这样下次才能重新进入cd
      lastTime = nowTime;
    }
  };
  // 返回_throttle函数
  return _throttle;
}

```