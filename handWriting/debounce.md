# 防抖

防抖就是将函数的执行延迟一定时间，如果在该时间内重新触发事件，那么延迟的时间会重置，只有真正达到延迟时间，才会执行回调函数

``` javascript

// 第一个参数是需要进行防抖处理的函数，第二个参数是延迟时间，默认为1秒钟
// 这里多传一个参数，immediate用来决定是否要第一次立即执行, 默认为false
function debounce(fn, delay = 1000, immediate = false) {
  // 实现防抖函数的核心是使用setTimeout
  // time变量用于保存setTimeout返回的Id
  let time = null;
  // isImmediate变量用来记录是否立即执行, 默认为false
  let isImmediate = false;

  // 将回调接收的参数保存到args数组中
  function _debounce(...args) {
    // 如果time不为0，也就是说有定时器存在，将该定时器清除
    if (time !== null) {
      clearTimeout(time);
    }

    // 当是第一次触发，并且需要触发第一次事件
    if (!isImmediate && immediate) {
      fn.apply(this, args);
      // 将isImmediate设置为true，这样不会影响到后面频繁触发的函数调用
      isImmediate = true;
    }

    time = setTimeout(() => {
      // 使用apply改变fn的this，同时将参数传递给fn
      fn.apply(this, args);
      // 当定时器里的函数执行时，也就是说是频繁触发事件的最后一次事件
      // 将isImmediate设置为false，这样下一次的第一次触发事件才能被立即执行
      isImmediate = false;
    }, delay);
  }

  // 防抖函数会返回另一个函数，该函数才是真正被调用的函数
  return _debounce;
}

    
```


