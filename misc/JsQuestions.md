# [Javascript-questions](https://github.com/lydiahallie/javascript-questions/blob/master/zh-CN/README-zh_CN.md)

标签：`Javascript`

发现一个 js 题库，记录一下易错题

---

#### 9. 输出是什么？

```javascript
let greeting
greetign = {} // Typo!
console.log(greetign)
```

- A: `{}`
- B: `ReferenceError: greetign is not defined`
- C: `undefined`

<details><summary><b> 答案 </b></summary>
<p>

#### 答案： A

代码打印出了一个对象，这是因为我们在全局对象上创建了一个空对象！当我们将 `greeting` 写错成 `greetign` 时， JS 解释器实际在上浏览器中将它视为 `global.greetign = {}`（或者 `window.greetign = {}`）。

为了避免这个为题，我们可以使用 `"use strict"。这能确保当你声明变量时必须赋值。

</p>
</details>

---

#### 11. 输出是什么？

```javascript
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

const member = new Person("Lydia", "Hallie");
Person.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
}

console.log(member.getFullName());
```

- A: `TypeError`
- B: `SyntaxError`
- C: `Lydia Hallie`
- D: `undefined` `undefined`

<details><summary><b> 答案 </b></summary>
<p>

#### 答案： A

你不能像常规对象那样，给构造函数添加属性。如果你想一次性给所有实例添加特性，你应该使用原型。因此本例中，使用如下方式：

```js
Person.prototype.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
}
```

这才会使 `member.getFullName()` 起作用。为什么这么做有益的？假设我们将这个方法添加到构造函数本身里。也许不是每个 `Person` 实例都需要这个方法。这将浪费大量内存空间，因为它们仍然具有该属性，这将占用每个实例的内存空间。相反，如果我们只将它添加到原型中，那么它只存在于内存中的一个位置，但是所有实例都可以访问它！

</p>
</details>

---

#### 14. 所有对象都有原型。

- A: 对
- B: 错

<details><summary><b> 答案 </b></summary>
<p>

#### 答案： B

除了 **基本对象**（ base object），所有对象都有原型。基本对象可以访问一些方法和属性，比如 `.toString`。这就是为什么你可以使用内置的 JavaScript 方法！所有这些方法在原型上都是可用的。虽然 JavaScript 不能直接在对象上找到这些方法，但 JavaScript 会沿着原型链找到它们，以便于你使用。

</p>
</details>

---

#### 17. 输出是什么？

```javascript
function getPersonInfo(one, two, three) {
  console.log(one)
  console.log(two)
  console.log(three)
}

const person = 'Lydia'
const age = 21

getPersonInfo`${person} is ${age} years old`
```

- A: `"Lydia"` `21` `["", " is ", " years old"]`
- B: `["", " is ", " years old"]` `"Lydia"` `21`
- C: `"Lydia"` `["", " is ", " years old"]` `21`

<details><summary><b> 答案 </b></summary>
<p>

#### 答案： B

如果使用标记模板字面量，第一个参数的值总是包含字符串的数组。其余的参数获取的是传递的表达式的值！

</p>
</details>

---

#### 29. 输出是什么？

```javascript
const a = {}
const b = { key: 'b' }
const c = { key: 'c' }

a[b] = 123
a[c] = 456

console.log(a[b])
```

- A: `123`
- B: `456`
- C: `undefined`
- D: `ReferenceError`

<details><summary><b> 答案 </b></summary>
<p>

#### 答案： B

对象的键被自动转换为字符串。我们试图将一个对象 `b` 设置为对象 `a` 的键，且相应的值为 `123`。

然而，当字符串化一个对象时，它会变成 `"[object Object]"`。因此这里说的是，`a["[object Object]"] = 123`。然后，我们再一次做了同样的事情，`c` 是另外一个对象，这里也有隐式字符串化，于是，`a["[object Object]"] = 456`。

然后，我们打印 `a[b]`，也就是 `a["[object Object]"]`。之前刚设置为 `456`，因此返回的是 `456`。

</p>
</details>

---

#### 63. 输出是什么？

```javascript
let num = 10;

const increaseNumber = () => num++;
const increasePassedNumber = number => number++;

const num1 = increaseNumber();
const num2 = increasePassedNumber(num1);

console.log(num1);
console.log(num2);
```

- A: `10`, `10`
- B: `10`, `11`
- C: `11`, `11`
- D: `11`, `12`

<details><summary><b> 答案 </b></summary>
<p>

#### 答案： A

一元操作符 `++` _ 先返回 _ 操作值，_ 再累加 _ 操作值。`num1` 的值是 `10`，因为 `increaseNumber` 函数首先返回 `num` 的值，也就是 `10`，随后再进行 `num` 的累加。

`num2` 是 `10` 因为我们将 `num1` 传入 `increasePassedNumber`. `number` 等于 `10`（`num1` 的值。同样道理，`++` _ 先返回 _ 操作值，_ 再累加 _ 操作值。）`number` 是 `10`，所以 `num2` 也是 `10`.

</p>
</details>

---

#### 101. 输出什么？

```javascript
const one = (false || {} || null)
const two = (null || false || "")
const three = ([] || 0 || true)

console.log(one, two, three)
```

- A: `false` `null` `[]`
- B: `null` `""` `true`
- C: `{}` `""` `[]`
- D: `null` `null` `true`

<details><summary><b> 答案 </b></summary>
<p>

#### 答案： C

使用 `||` 运算符，我们可以返回第一个真值。如果所有值都是假值，则返回最后一个值。

`（false || {} || null）`：空对象 `{}` 是一个真值。这是第一个（也是唯一的）真值，它将被返回。`one` 等于 `{}`。

`（null || false ||“”）`：所有值都是假值。这意味着返回传递的值 `""`。`two` 等于 `""`。

`（[] || 0 ||“”）`：空数组 `[]` 是一个真值。这是第一个返回的真值。`three` 等于 `[]`。

</p>
</details>

---

#### 答案： A

你不能像常规对象那样，给构造函数添加属性。如果你想一次性给所有实例添加特性，你应该使用原型。因此本例中，使用如下方式：

```js
Person.prototype.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
}
```

这才会使 `member.getFullName()` 起作用。为什么这么做有益的？假设我们将这个方法添加到构造函数本身里。也许不是每个 `Person` 实例都需要这个方法。这将浪费大量内存空间，因为它们仍然具有该属性，这将占用每个实例的内存空间。相反，如果我们只将它添加到原型中，那么它只存在于内存中的一个位置，但是所有实例都可以访问它！

</p>
</details>

---

#### 14. 所有对象都有原型。

- A: 对
- B: 错

<details><summary><b> 答案 </b></summary>
<p>

#### 答案： B

除了 **基本对象**（ base object），所有对象都有原型。基本对象可以访问一些方法和属性，比如 `.toString`。这就是为什么你可以使用内置的 JavaScript 方法！所有这些方法在原型上都是可用的。虽然 JavaScript 不能直接在对象上找到这些方法，但 JavaScript 会沿着原型链找到它们，以便于你使用。

</p>
</details>

---

#### 17. 输出是什么？

```javascript
function getPersonInfo(one, two, three) {
  console.log(one)
  console.log(two)
  console.log(three)
}

const person = 'Lydia'
const age = 21

getPersonInfo`${person} is ${age} years old`
```

- A: `"Lydia"` `21` `["", " is ", " years old"]`
- B: `["", " is ", " years old"]` `"Lydia"` `21`
- C: `"Lydia"` `["", " is ", " years old"]` `21`

<details><summary><b> 答案 </b></summary>
<p>

#### 答案： B

如果使用标记模板字面量，第一个参数的值总是包含字符串的数组。其余的参数获取的是传递的表达式的值！

</p>
</details>

---

#### 29. 输出是什么？

```javascript
const a = {}
const b = { key: 'b' }
const c = { key: 'c' }

a[b] = 123
a[c] = 456

console.log(a[b])
```

- A: `123`
- B: `456`
- C: `undefined`
- D: `ReferenceError`

<details><summary><b> 答案 </b></summary>
<p>

#### 答案： B

对象的键被自动转换为字符串。我们试图将一个对象 `b` 设置为对象 `a` 的键，且相应的值为 `123`。

然而，当字符串化一个对象时，它会变成 `"[object Object]"`。因此这里说的是，`a["[object Object]"] = 123`。然后，我们再一次做了同样的事情，`c` 是另外一个对象，这里也有隐式字符串化，于是，`a["[object Object]"] = 456`。

然后，我们打印 `a[b]`，也就是 `a["[object Object]"]`。之前刚设置为 `456`，因此返回的是 `456`。

</p>
</details>

---

#### 63. 输出是什么？

```javascript
let num = 10;

const increaseNumber = () => num++;
const increasePassedNumber = number => number++;

const num1 = increaseNumber();
const num2 = increasePassedNumber(num1);

console.log(num1);
console.log(num2);
```

- A: `10`, `10`
- B: `10`, `11`
- C: `11`, `11`
- D: `11`, `12`

<details><summary><b> 答案 </b></summary>
<p>

#### 答案： A

一元操作符 `++` _ 先返回 _ 操作值，_ 再累加 _ 操作值。`num1` 的值是 `10`，因为 `increaseNumber` 函数首先返回 `num` 的值，也就是 `10`，随后再进行 `num` 的累加。

`num2` 是 `10` 因为我们将 `num1` 传入 `increasePassedNumber`. `number` 等于 `10`（`num1` 的值。同样道理，`++` _ 先返回 _ 操作值，_ 再累加 _ 操作值。）`number` 是 `10`，所以 `num2` 也是 `10`.

</p>
</details>

---

#### 101. 输出什么？

```javascript
const one = (false || {} || null)
const two = (null || false || "")
const three = ([] || 0 || true)

console.log(one, two, three)
```

- A: `false` `null` `[]`
- B: `null` `""` `true`
- C: `{}` `""` `[]`
- D: `null` `null` `true`

<details><summary><b> 答案 </b></summary>
<p>

#### 答案： C

使用 `||` 运算符，我们可以返回第一个真值。如果所有值都是假值，则返回最后一个值。

`（false || {} || null）`：空对象 `{}` 是一个真值。这是第一个（也是唯一的）真值，它将被返回。`one` 等于 `{}`。

`（null || false ||“”）`：所有值都是假值。这意味着返回传递的值 `""`。`two` 等于 `""`。

`（[] || 0 ||“”）`：空数组 `[]` 是一个真值。这是第一个返回的真值。`three` 等于 `[]`。

</p>
</details>

---