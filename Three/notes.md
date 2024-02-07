# Three.js 技巧

## 性能优化

- 对象合并
  - BufferGeometryUtils.mergeGeometries
  - 使用同一材质对象
- 离屏渲染
  - OffscreenCanvas
  - WebWorker
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
  - add，remove
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