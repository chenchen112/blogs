# Vue 响应式失效
使用 Vue 开发时突然发现输入框无法输入，下拉选择框无法选择等问题

通常是出现在此类组件和 Form 表单组件组合使用时，经研究其背后的原因与 Vue 的响应式原理有关

固以一个简单的组件示例展开，深入其背后的底层原理以及有效的规避方式

## 问题复现
首先将问题出现的场景简化了一下，先看以下组件

```vue
<template>
    <el-input v-model="user.name" placeholder="请选择" />
</template>
<script>
export default {
    data() {
        return {
            user: {},
        };
    },
};
</script>

```

此组件仅仅是一个简单的 element 输入框，能够符合预期的运行。

但是在如详情页等数据需要异步加载的场景下通常会多一段加载后设值的逻辑如下：

```vue
<template>
    <el-input v-model="user.name" placeholder="请选择" />
</template>
<script>
export default {
    data() {
        return {
            user: {},
        };
    },

    mounted() { 
        setTimeout(() => { // 简化了数据加载过程
            this.user.name = "小李";
        });
    },
};
</script>

```

加上这段逻辑后会我们期望的现象是，输入框内有 "小李" 二字

但实际上的结果是

+ 输入框仍旧为空
+ 输入框无法输入

## 问题分析
熟悉 Vue 响应式原理的都知道，Vue 组件只会在初始化时对 data 中已经定义的对象进行递归遍历，使其成为响应式数据，并且 Vue 并不能检测到对象属性的添加和删除，需要通过 `Vue.set` 方法向对象添加响应式数据。

这段原理就不在这里做展开了，具体可见官方文档 [深入响应式原理](https://v2.cn.vuejs.org/v2/guide/reactivity.html)

所以，按理来说上述代码其实是有问题的，因为初始化时未在 `user` 内定义需要使用到的字段 `name`，以至于后续得到的数据是非响应式数据，其变化无法引起视图的更新。

为验证上述说法并减少上述代码中的变量，进一步简化代码

```vue
<template>
    <div>
        {{ user.name || "-" }}
        <el-button @click="handleClick">确认</el-button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            user: {},
        };
    },

    methods: {
        handleClick() {
            this.user.name = "小李";
        },
    },
};
</script>

```

此时点击确认按钮时，发现文本未发生变化，以此可以验证了上述 Vue 并不能检测响应式对象的属性添加

那么对于上述的输入框可以正常工作，必然是在某个地方默默执行了 Vue.set 使得 user.name 成为了响应式数据，对比上述示例可以得出以下两种猜测

+ `el-input` 执行了 `Vue.set`
+ `v-model` 执行了 `Vue.set`

## 问题探究
先从简单的 `el-input` 入手，源码也就 400 行，翻 [源码](https://github.com/ElemeFE/element/blob/dev/packages/input/src/input.vue) 就可以发现它并没有帮我们调用 Vue.set 将数据变成响应式的，因此可以排除

其它输入组件如 `el-select` 等同理可以排除，因此大概率时 `v-model` 帮你做了这件事

事实也确实如此，附上 `v-model` 部分 [源码](https://github.com/vuejs/vue/blob/v2.6.14/dist/vue.js)

```javascript
function model(el, dir, _warn) {
    // ... ...

    if (tag === "input" || tag === "textarea") {
        genDefaultModel(el, value, modifiers);
    }

    // ... ...
}

function genDefaultModel() {
    // ... ...

    var code = genAssignmentCode(value, valueExpression);

    // ... ...

    addHandler(el, event, code, null, true);
    
    // ... ...
}

function genAssignmentCode(value, assignment) {
    var res = parseModel(value);
    if (res.key === null) {
        return value + "=" + assignment;
    } else {
        return "$set(" + res.exp + ", " + res.key + ", " + assignment + ")";
    }
}

```

可以看到最后确实生成了包含 `$set` 方法的代码，那么 **问题复现** 中第一段代码可以正常运行就能被解释了。

虽然我们没有在 data 中定义 `user.name` 字段，但当输入框变化时 `v-model` 帮我们调用了 `Vue.set` 方法将其变成了响应式数据

那么为何我们在挂载时进行了一次赋值后 `v-model` 没有帮助我们将其变成响应式数据呢

`Vue.set` 源码如下

```javascript
function set(target, key, val) {
    // ... ...
    if (key in target && !(key in Object.prototype)) {
        target[key] = val;
        return val;
    }
   
    // ... ...
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val;
}
```

可以看到其实它里面是有做判断属性是否已经存在，如若存在就只是简单的赋值，如果不存在则转成响应式数据。

**问题复现** 中第二段代码中因为我们手动设置了 user.name 以至于即使 v-model 帮我们调用了 Vue.set，但是由于上述判断未通过，没有将其变成响应式数据，所以此时输入框依旧无法输入。

## 总结
为避免 Vue 双向绑定失效，一种比较简单粗暴的方式是在 data 中定义需要被绑定的对象时，声明所有的响应式字段，而不是直接置成空对象

```vue
<template>
    <div>
        <el-input v-model="user.name" />
        <el-input v-model="user.password" />
    </div>
</template>
<script>
export default {
    data() {
        return {
            user: {
                // 声明所有需要的字段
                name: "",
                password: "",
            },
        };
    },
};
</script>

```

如果需要定义所有字段嫌麻烦，更好一点的方式是在响应式对象需要新增字段时使用 Vue.set 处理，相对来说开发的时候需要小心一点，如果是一个逻辑复杂的表单，各个表单项间有联动的情况下需要额外注意

```javascript
this.$set(this.user, "passowrd", "");
```

## 其它
上述提到的 `v-model` 会自动将不存在的值变化后转换为响应式数据得更新出现在 vue 2.5.1 版本

此前的版本并不生效，原 Issue：[Warn when v-model is bound on non-existent key](https://github.com/vuejs/vue/issues/5932#issuecomment-334040085)

+ [v-model源码解析(超详细)](https://segmentfault.com/a/1190000021039085#item-4)

