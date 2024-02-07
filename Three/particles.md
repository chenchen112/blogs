# 粒子效果

## 粒子创建

- Canvas2D：数据量大时，性能不佳
- THREE.Points：经典方式
- THREE.Sprites：因为需要创建多个对象，理论上性能不如 Points
- Shader 编程：能玩的很花，且性能最佳，但需要了解 webgl 相关图形学知识

## 粒子位置

- 随机：随机的位置、移动方向、移动速度等
- 针对形状归整图形，可通过参数方程进行采样
- 针对形状复杂图形，可通过加载模型，获取所有顶点的方式

## 粒子动画
- 形状 A 变换到形状 B
  - 明确速度/轨迹/加速度，确定好起止位置，通过补间动画的方式，进行位置移动
  - 可能存在的问题，点 A 到 A' 走了最远路径，看着效果没那么好
  - 多余粒子处理方式：取余后使粒子重叠、随机散落
- 整体转场：如形状 A 缩小消失，然后形状 B 放大消失
- 响应鼠标
  - 鼠标移动位置有波纹，炸开效果
  - 根据鼠标移动量调整相机
- 补间动画
  - tween.js
  - GSAP

## 粒子连线
- 距离判断：通过判断当前粒子和其他粒子的距离，满足某个范围时，建立连线。计算量特别大，点多时性能肯定不好


## 性能测试

使用 THREE.Points + Tween.js 实践简易的粒子效果

>50 ～ 60 FPS 的动画将会相当流畅，30 ～ 50 FPS 之间的动画，因各人敏感程度不同，舒适度因人而异， 30 FPS 以下的动画，让人感觉到明显的卡顿和不适感

### 效果


| 粒子数量 | 0个 | 5000个 | 8000个 | 10000个 | 15000个 | 20000个 | 30000个 |
| --- | --- | --- | --- | --- | ---| --- | --- |
|  FPS  | ![58.2](/public/FPS58.2.png) | ![54.6](/public/FPS54.6.png) | ![40.8](/public/FPS40.8.png) | ![34.8](/public/FPS34.8.png) | ![24.6](/public/FPS24.6.png) | ![20.4](/public/FPS20.4.png) | ![12.6](/public/FPS12.6.png) |

5000 个和 50000 个效果如下：

<div style="text-align:center">
<img src="../public/CPU5000.gif" width="48%"/> <img src="../public/CPU50000.gif" width="48%"//>
</div>

### CPU 实现

```
import { Easing, Tween, update } from '@tweenjs/tween.js';

const PointNum = 10000;
const BoxSize = 300;
const Radius = 150;
const Duration = 3000;

const getRandomCubePs = (n: number) => {
  const ps: Vector3[] = [];
  const getRandom = () => Math.random() * BoxSize - BoxSize / 2;
  for (let i = 0; i < n; i += 1) {
    ps.push(new Vector3(getRandom(), getRandom(), getRandom()));
  }
  return ps;
};

const getRandomCubePoints = (ps: Vector3[]) => {
  const geo = new BufferGeometry().setFromPoints(ps);
  const material = new PointsMaterial({ color: 'red' });
  const points = new Points(geo, material);
  return points;
};

const getRandomSpherePs = (n: number) => {
  const ps: Vector3[] = [];
  const getRandom = () => (Math.random() - 0.5) * 2;
  while (ps.length < n) {
    const x = getRandom();
    const y = getRandom();
    const z = getRandom();
    const length = Math.sqrt(x * x + y * y + z * z);
    const ratio = (Radius / length) * Math.random();
    ps.push(new Vector3(x, y, z).multiplyScalar(ratio));
  }
  return ps;
};

const spherePs = getRandomSpherePs(PointNum);
const targetSpherePs = spherePs.map((item) => item.clone());
const cubePs = getRandomCubePs(PointNum);
const targetCubePs = cubePs.map((item) => item.clone());
const points = getRandomCubePoints(cubePs);


  useEffect(() => {
    editor.add(points);
    const updateFn = (val: Vector3[]) => {
      const geo = points.geometry;
      if (geo) {
        geo.setAttribute(
          'position',
          new Float32BufferAttribute(
            val.flatMap((item) => item.toArray()),
            3,
          ),
        );
        geo.getAttribute('position').needsUpdate = true;
        editor.render();
      }
    };
    const tween = new Tween(cubePs);
    const tweenBack = new Tween(cubePs);
    tween.to(targetSpherePs, Duration).easing(Easing.Exponential.InOut).onUpdate(updateFn);
    tweenBack.to(targetCubePs, Duration).easing(Easing.Exponential.InOut).onUpdate(updateFn);
    tween.chain(tweenBack);
    tweenBack.chain(tween);
    tween.start();
    const animate = (time?: number) => {
      const result = update(time);
      animationId.current = window.requestAnimationFrame(animate);
      if (!result) {
        window.cancelAnimationFrame(animationId.current);
      }
    };
    animate();
    return () => {
      points.removeFromParent();
      window.cancelAnimationFrame(animationId.current);
    };
  });
```

上述方式超过 5000 个粒子时，性能下降非常明显，改为通过 `ShaderMaterial` 实现后，充分利用 `GPU` 的计算能力，性能提升巨大。

| 粒子数量 | 0个 | 50万个 | 100万个 | 200万个 | 500万个 | 800万个 | 1000万个 |
| --- | --- | --- | --- | --- | ---| --- | --- |
|  FPS  | 59.4 | 59.4 | 59.4 | 59.4 | 45.0 | 33.0 | 27.6 |


一百万个效果如下：

<div style="text-align:center">
<img src="../public/GPU100w.gif"/>
</div>

### GPU 实现
```
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  ShaderMaterial,
  Texture,
  Vector3,
} from 'three';
import { Easing, Tween, update } from '@tweenjs/tween.js';

const CubePointNum = 800000;
const SpherePointNum = 8000;
const BoxSize = 300;
const Radius = 150;
export const Duration = 3000;

const getRandomCubeGeom = (n: number) => {
  const ps: Vector3[] = [];
  const getRandom = () => Math.random() * BoxSize - BoxSize / 2;
  for (let i = 0; i < n; i += 1) {
    ps.push(new Vector3(getRandom(), getRandom(), getRandom()));
  }
  return new BufferGeometry().setFromPoints(ps);
};

const getRandomSphereGeom = (n: number) => {
  const ps: Vector3[] = [];
  const getRandom = () => (Math.random() - 0.5) * 2;
  while (ps.length < n) {
    const x = getRandom();
    const y = getRandom();
    const z = getRandom();
    const length = Math.sqrt(x * x + y * y + z * z);
    const ratio = (Radius / length) * Math.random();
    ps.push(new Vector3(x, y, z).multiplyScalar(ratio));
  }
  return new BufferGeometry().setFromPoints(ps);
};

const getTexture = (canvasSize = 64) => {
  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  canvas.style.background = 'transparent';
  const context = canvas.getContext('2d')!;
  const gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 8,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2,
  );
  gradient.addColorStop(0, '#fff');
  gradient.addColorStop(1, 'transparent');
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2, true);
  context.fill();
  const texture = new Texture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const getPointsMaterial = () => new PointsMaterial({ color: 'red' });

const getShaderMaterial = () => {
  const uniforms = {
    // 顶点颜色
    color: {
      type: 'v3',
      value: new Color(0xffffff),
    },
    // 传递顶点贴图
    itemTexture: {
      value: getTexture(),
    },
    // 传递 axis 值，用于 shader 计算顶点位置
    axis: {
      value: 1,
    },
  };
  const material = new ShaderMaterial({
    uniforms,
    vertexShader: `attribute vec3 memoPs;
    uniform float axis;
    void main() {
        vec3 vPos;
        // 变动的val值引导顶点位置的迁移
        vPos.x = position.x * axis + memoPs.x * (1. - axis);
        vPos.y = position.y * axis + memoPs.y * (1. - axis);
        vPos.z = position.z * axis + memoPs.z * (1. - axis);
        vec4 mvPosition = modelViewMatrix * vec4( vPos, 1.0 );
        gl_PointSize = 4.;
        gl_Position = projectionMatrix * mvPosition;
    }`,
    fragmentShader: `uniform vec3 color;
    uniform sampler2D itemTexture;
    void main() {
        gl_FragColor = vec4( color, 1.0 );
        gl_FragColor = gl_FragColor * texture2D( itemTexture, gl_PointCoord );
    }`,
    blending: AdditiveBlending,
    depthTest: false,
    transparent: true,
  });
  return material;
};

const getMemoPs = (origin: BufferGeometry, target: BufferGeometry) => {
  const originPs = origin.getAttribute('position').array;
  const targetPs = target.getAttribute('position').array;
  const [more, less] =
    originPs.length > targetPs.length ? [originPs, targetPs] : [targetPs, originPs];
  // 根据最大的顶点数开辟数组空间，同于存放顶点较少的模型顶点数据
  const memoPs = new Float32Array(more.length);
  // 先把顶点较少的模型顶点坐标放进数组
  memoPs.set(less);

  for (let i = less.length, j = 0; i < more.length; i += 1, j += 1) {
    j %= less.length;
    memoPs[i] = less[j];
    memoPs[i + 1] = less[j + 1];
    memoPs[i + 2] = less[j + 2];
  }
  return memoPs;
};

export const cubeGeom = getRandomCubeGeom(CubePointNum);
export const sphereGeom = getRandomSphereGeom(SpherePointNum);
export const shaderMaterial = getShaderMaterial();
export const pointsMaterial = getPointsMaterial();
export const memoPs = getMemoPs(cubeGeom, sphereGeom);
cubeGeom.setAttribute('memoPs', new Float32BufferAttribute(memoPs, 3));
export const cube = new Points(cubeGeom, shaderMaterial);

export const axis = { value: 0 };
... ...

  useEffect(() => {
    editor.getCameraControls().setEnableRotate(true);
    editor.add(cube);
    editor.render();
    const updateFn = (val: { value: number }) => {
      if (!cube) {
        return;
      }
      cube.material.uniforms.axis = val;
      editor.render();
    };
    const tween = new Tween(axis);
    const tweenBack = new Tween(axis);
    tween.to({ value: 1 }, Duration).easing(Easing.Exponential.InOut).onUpdate(updateFn);
    tweenBack.to({ value: 0 }, Duration).easing(Easing.Exponential.InOut).onUpdate(updateFn);
    tween.chain(tweenBack);
    tweenBack.chain(tween);
    tween.start();
    const animate = (time?: number) => {
      const result = update(time);
      animationId.current = window.requestAnimationFrame(animate);
      if (!result) {
        window.cancelAnimationFrame(animationId.current);
      }
    };
    animate();
    afterRenderFn();
    return () => {
      cube.removeFromParent();
      window.cancelAnimationFrame(animationId.current);
    };
  });
  
```


## 参考资料

- [threejs+tweenjs实现3D粒子模型切换](https://juejin.cn/post/6844903669305966600)
- [腾讯UP2017 3D粒子效果在网页端实现](https://github.com/liunnn1994/TencentUp2017?tab=readme-ov-file)
- [3D粒子效果在网页端实现分享](https://tgideas.qq.com/gicp/news/475/6515254.html?from=list)
- [sketch of three.js](https://ykob.github.io/sketch-threejs/)
- [particle-love](https://particle-love.com/)
- [Three.js粒子特效](https://juejin.cn/post/6844903615438553096#heading-18)
- [3DPoints](https://github.com/youngdro/3DPoints)