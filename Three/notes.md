# 笔记

记一些干货

## 性能优化

- 对象合并
  - BufferGeometryUtils.mergeGeometries
  - 使用同一材质对象
- 离屏渲染
  - OffscreenCanvas
  - WebWorker(workerpool)
- remove 并不能完全释放内存
  - 针对 material 和 texture 需要手动 dispose

## 知识点

- 仅支持画宽度为 1 的线
  - 可使用 MeshLine 画粗线，但是虚线效果不好
  - Line2 渲染虚线也有缺陷
- 通过射线法实现选择
  - SelectionBox 实现框选
  - raycaster.params.Line.threshold 可修改触碰精度
- 修改后没有变化检查是否手动修改 needsUpdate
- CSS3DObject 的显隐不随 parent 变化，需要独自处理
- 控制物体显隐的方式
  - visible
  - layers
  - add， remove
- 绘制特殊样式的点的思路
  - material.map 设为 CanvasTexture
  - 重绘 CanvasTexture 的 canvas
- clone
  - 一般 extends Object3D 后 clone 方法便无法使用
  - 原生的 clone 出来的对象共用同一份 geometry 和 material
- alphaTest 可以帮助解决透明遮挡问题
- 3D 文字实现思路
  - FontLoader 加载字体包
  - MeshBasicMaterial + TextGeometry
- Line 更新后需要手动调用 computeLineDistances 以恢复虚线效果
- CSS2DObject 和 CSS3DObject 区别在于 CSS2DObject 为固定大小，不随镜头远近而放大缩小
- onAfterRender 和 onBeforeRender 的使用
- 计算对象绕顶点旋转指定角度的变换矩阵 ( 矩阵变换基于自身坐标系 )
  ``` typescript
  getRotationMatrix(point: Vector3, angle: number) {
    const translation = new Matrix4().makeTranslation(point.x, point.y, point.z);
    const inverseTranslation = translation.clone().invert();
    const rotationMatrix = new Matrix4();
    rotationMatrix.makeRotationFromEuler(new Euler(0, 0, angle, 'XYZ'));
    const finalMatrix = new Matrix4();
    finalMatrix.multiplyMatrices(translation, rotationMatrix);
    finalMatrix.multiply(inverseTranslation);
    return finalMatrix;
  }
  ```