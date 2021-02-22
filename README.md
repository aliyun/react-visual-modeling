<h3 align="center">
  一个基于React的数据可视化建模的DAG图，适用于UML，数据库建模，数据仓库建设等业务。
</h3>

[English](./README.en-US.md) | 简体中文

<p align="center">
  <img width="100%" src="https://img.alicdn.com/imgextra/i4/O1CN01VZxfyl1pOLc15k7XM_!!6000000005350-1-tps-1665-829.gif">
</p>

## ✨ 特性
* 支持定制字段属性
* 支持定制title，title的icon
* 支持节点的收缩/展开状态，以及收缩后的映射关系
* 支持定制线段的属性以及自定义label
* 支持节点，字段的hover，focus，linked以及全链路高亮状态
* 支持节点，线段的右键菜单
* 支持minimap，以及minimap的联动移动和高亮状态

## 📦 安装
```
npm install react-visual-modeling
```

``` javascript
import VisualModeling from 'react-visual-modeling';
import 'react-visual-modeling/dist/index.css';
<VisualModeling
  data={data}
  column={column}
  nodeMenu={menu}
  edgeMenu={menu}
  config={config}
  onLoaded={() => {}}
  onChange={() => {}}
  onFocusNode={() => {}}
  onFocusEdge={() => {}}
  onFocusCanvas={() => {}}
>
</VisualModeling>
```

## 🔗API
``` javascript
interface columns { // 节点字段每列的属性设置
  title?: string, // 每列的名字
  key: string, // 每列的唯一标志，对应数据上的key值
  width?: number, // 每列宽度
  primaryKey: boolean, // 这列的key对应的value是否作为键值对
  render?(value: any, rowData: any): void // 可自定义每列的样式
}

interface config { // 
  showActionIcon?: boolean,// 是否展示操作icon：放大，缩小，聚焦
  allowKeyboard?: boolean, // 允许键盘删除事件，todo以后支持shift多选
  collapse: {
    enable: boolean,       // 允许节点收缩
    defaultMode: string    // 默认以"展开/收缩"形式展示
  },
  titleRender?(title: JSX.Element): void,  // 节点title的渲染方法
  titleExtIconRender?(node: JSX.Element): void,  // 节点右侧按钮的渲染方法
  labelRender?(label: JSX.Element): void,  // 线段label的渲染方法
  minimap: {   // 是否开启缩略图
    enable: boolean,
    config: {
      nodeColor: any, // 节点颜色
      activeNodeColor: any // 节点激活颜色
    }
  }
}

interface menu { // '节点/线段'的右键菜单配置
  title?: string, // 每列的展示的名字
  key: string, // 每列的唯一标志，对应数据上的key值
  render?(key: string): void, // 支持每列的自定义样式
  onClick?(key: string, data: any): void, // 每列的点击回调
}

interface props {
  width?: number | string,     // 组件宽
  height?: number | string,    // 组件高
  className?: string,          // 组件classname
  columns: Array<columns>,     // 跟antd的table的column的概念类似
  nodeMenu: Array<menu>,       // 节点右键菜单配置
  edgeMenu: Array<menu>,       // 线段右键菜单配置
  config: config,              // 如上述配置
  data: any,                   // 数据
  onLoaded(canvas: any): void, // 渲染完毕事件
  onChange(data: any): void,   // 图内数据变化事件
  onFocusNode(node: any): void,// 聚焦节点事件
  onFocusEdge(edge: any): void,// 聚焦线段事件
  onFocusCanvas(): void,       // 聚焦空白处事件
};
```