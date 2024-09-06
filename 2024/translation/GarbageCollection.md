# 记一次 JS 内存泄漏

标签：`Javascript` `内存泄漏`

原文链接：[ 记一次 JS 内存泄漏 ](https://jakearchibald.com/2024/garbage-collection-and-closures/)

## 前言

我们在开发过程中，发现有一个函数内的垃圾回收机制并不符合我们的预期

```js
function demo() {
  const bigArrayBuffer = new ArrayBuffer(100_000_000);
  const id = setTimeout(() => {
    console.log(bigArrayBuffer.byteLength);
  }, 1000);

  return () => clearTimeout(id);
}

globalThis.cancelDemo = demo();
```

在以上代码中，`bigArrayBuffer` 会被永远泄露，这并不是我们所期望的，我是这样想的：

- 一秒钟后，引用 `bigArrayBuffer` 的函数将不可再被调用
- 返回的取消定时器的函数也并不引用 `bigArrayBuffer`

但是这些无关紧要

## Javascript 引擎是非常智能的

下面这种写法并不会发生内存泄漏

```js
function demo() {
  const bigArrayBuffer = new ArrayBuffer(100_000_000);
  console.log(bigArrayBuffer.byteLength);
}

demo();
```

该函数执行后，不再需要 `bigArrayBuffer`，因此它会被垃圾回收

下面这种写法同样也不会发生内存泄漏

```js
function demo() {
  const bigArrayBuffer = new ArrayBuffer(100_000_000);

  setTimeout(() => {
    console.log(bigArrayBuffer.byteLength);
  }, 1000);
}

demo();
```

在这种情况下

1. 引擎发现 `bigArrayBuffer` 被内部函数所引用，因此保留了它。它与调用 `demo()` 时所创建的作用域相关联
2. 一秒钟之后，引用 `bigArrayBuffer` 的函数再也不能被调用
3. 自此作用域内没有任何内容能够被调用，所以作用域与 `bigArrayBuffer` 一起被垃圾回收掉

下面这种写法也也也也不会发生内存泄漏

```js
function demo() {
  const bigArrayBuffer = new ArrayBuffer(100_000_000);

  const id = setTimeout(() => {
    console.log('hello');
  }, 1000);

  return () => clearTimeout(id);
}

globalThis.cancelDemo = demo();
```

这种情况下，引擎依然可以判断出 `bigArrayBuffer` 无需被保留，因为没有任何内部可调用对象内访问到它

## 问题案例

这就是让问题变得混乱之处

```js
function demo() {
  const bigArrayBuffer = new ArrayBuffer(100_000_000);

  const id = setTimeout(() => {
    console.log(bigArrayBuffer.byteLength);
  }, 1000);

  return () => clearTimeout(id);
}

globalThis.cancelDemo = demo();
```

之所以这种写法会发生内存泄漏，是因为：

1. 引擎发现 `bigArrayBuffer` 被内部函数所引用，保留了它，它与调用 `demo()` 时所创建的作用域相关联
2. 一秒钟之后，引用 `bigArrayBuffer` 的函数再也不能被调用
3. 但是，作用域依然会被保留，因为 **取消函数** 一直可以被调用
4. 而 `bigArrayBuffer` 与作用域相关联，也会被保留在内存中

我以为引擎会更加聪明，因为 `bigArrayBuffer` 不可用而直接回收掉它，但事实并非如此

```js
globalThis.cancelDemo = null
```

执行上述代码后，`bigArrayBuffer` 便可以被垃圾回收了，因为作用域内没有任何内容可被调用

这种情况并不仅仅发生在定时器上，只是我因为使用定时器而撞上了，亦如：

```js
function demo() {
  const bigArrayBuffer = new ArrayBuffer(100_000_000);

  globalThis.innerFunc1 = () => {
    console.log(bigArrayBuffer.byteLength);
  };

  globalThis.innerFunc2 = () => {
    console.log('hello');
  };
}

demo();
// bigArrayBuffer is retained, as expected.

globalThis.innerFunc1 = undefined;
// bigArrayBuffer is still retained, as unexpected.

globalThis.innerFunc2 = undefined;
// bigArrayBuffer can now be collected.
```

## 更新

最开始我以为这种泄露仅发生在比父函数初始执行时间更长的函数中，但是并非如此

```js
function demo() {
  const bigArrayBuffer = new ArrayBuffer(100_000_000);

  (() => {
    console.log(bigArrayBuffer.byteLength);
  })();

  globalThis.innerFunc = () => {
    console.log('hello');
  };
}

demo();
// bigArrayBuffer is retained, as unexpected.
```

在 IIFE 中足以触发泄露

另外，这是一个跨浏览器的问题，并且由于性能问题不太可能被解决掉

我也不是第一个记录这个问题的人，并且我也并不认为是因为 `eval()` 导致的这个问题