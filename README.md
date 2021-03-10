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
* 支持空字段内容定制

## 📦 安装

``` 
npm install react-visual-modeling
```

## API<a name='canvas-attr'></a>：

### <b>VisualModeling属性</b>

|      参数     |                  说明                 |                               类型                               | 默认值 |
|:-------------:|:-------------------------------------:|:----------------------------------------------------------------:|:-----:|
|      data     |                画布数据                |                  <font color="c41d7f">any</font>                 |   -   |
|     width     |                组件宽度                |         <font color="c41d7f">number &#124; string</font>         |   -   |
|     height    |                组件高度                |         <font color="c41d7f">number &#124; string </font>        |   -   |
|   className   |                组件类名                |                <font color="c41d7f">string</font>                |   -   |
|    columns    | 列的配置描述, 见[columns Prop](#columns) | <font color="c41d7f">Array&#60; [columns](#columns)&#62; </font> |   -   |
|    nodeMenu   |             节点右键菜单配置            |  <font color="c41d7f">Array&#60; [menu](#menu-type)&#62; </font> |  [ ]  |
|    edgeMenu   |             线段右键菜单配置            |  <font color="c41d7f">Array&#60; [menu](#menu-type)&#62; </font> |  [ ]  |
|     config    | 组件的画布配置，见[config Prop](#config) |                 <font color="c41d7f">any </font>                 |   -   |
|  emptyContent |          当表字段为空时显示内容          |      <font color="c41d7f">string &#124; JSX. Element</font>      |   -   |
|   emptyWidth  |          当表字段为空时表容器宽度         |         <font color="c41d7f">number &#124; string</font>         |   -   |
|    onLoaded   |               渲染完毕事件              |           <font color="c41d7f">(canvas) => void</font>           |   -   |
|    onChange   |             图内数据变化事件            |            <font color="c41d7f">(data) => void</font>            |   -   |
|  onFocusNode  |               聚焦节点事件              |            <font color="c41d7f">(node) => void</font>            |   -   |
|  onFocusEdge  |               聚焦线段事件              |            <font color="c41d7f">(edge) => void</font>            |   -   |
| onFocusCanvas |              聚焦空白处事件             |              <font color="c41d7f">() => void</font>              |   -   |

<br>

### <a name='columns'></a><b>columns</b>

节点字段每列的属性设置

|    参数    |              说明             |                    类型                   | 默认值 |
|:----------:|:-----------------------------:|:-----------------------------------------:|:-----:|
|    title   |           每列的名字           |     <font color="c41d7f">string</font>    |   -   |
|     key    |  每列的唯一标志，对应数据上的key值 |     <font color="c41d7f">string</font>    |   -   |
|    width   |            每列宽度            |     <font color="c41d7f">number</font>    |   -   |
| primaryKey | 这列的key对应的value是否作为键值对 |    <font color="c41d7f">boolean</font>    |   -   |
|   render   |       支持每列的自定义样式       | <font color="c41d7f">(key) => void</font> |   -   |

<br>

### <a name='menu-type'></a><b>menu</b>

'节点/线段'的右键菜单配置

|   参数  |             说明            |                       类型                      | 默认值 |
|:-------:|:---------------------------:|:-----------------------------------------------:|:-----:|
|  title  |        每列的展示的名字       |        <font color="c41d7f">string</font>       |   -   |
|   key   | 每列的唯一标志，对应数据上的key值 |        <font color="c41d7f">string</font>       |   -   |
|  render |      支持每列的自定义样式      |    <font color="c41d7f">(key) => void</font>    |   -   |
| onClick |         每列的点击回调        | <font color="c41d7f">(key, data) => void</font> |   -   |

<br>

### <a name='config'></a><b>config</b>

画布配置

|        参数        |             说明            |                               类型                              | 默认值 |
|:------------------:|:---------------------------:|:---------------------------------------------------------------:|:-----:|
|   showActionIcon   | 是否展示操作icon：放大，缩小，聚焦 |               <font color="c41d7f">boolean</font>               |   -   |
|    allowKeyboard   |        允许键盘删除事件       |               <font color="c41d7f">boolean</font>               |   -   |
|      collapse      |        是否允许节点收缩       | [collapse Prop](#collapse-prop)<font color="c41d7f"> { }</font> |   -   |
|     titleRender    |      节点title的渲染方法      |           <font color="c41d7f">(title) => void</font>           |   -   |
| titleExtIconRender |     节点右侧按钮的渲染方法     |            <font color="c41d7f">(node) => void</font>           |   -   |
|     labelRender    |      线段label的渲染方法      |           <font color="c41d7f">(label) => void</font>           |   -   |
|       minimap      |         是否开启缩略图        |  [minimap Prop](#minimap-prop)<font color="c41d7f"> { }</font>  |   -   |

<br>

### <a name='collapse-prop'></a><b>collapse</b>

节点收缩属性

|     参数    |      说明     |                 类型                |         默认值         |
|:-----------:|:-------------:|:-----------------------------------:|:---------------------:|
|    enable   | 是否允许节点收缩 | <font color="c41d7f">boolean</font> |           -           |
| defaultMode |   默认展示形式  | <font color="c41d7f"> string</font> | 默认以"展开/收缩"形式展示 |

<br>

### <a name='minimap-prop'></a><b>minimap</b>

缩略图属性

|  参数  |     说明    |                                     类型                                    | 默认值 |
|:------:|:-----------:|:---------------------------------------------------------------------------:|:-----:|
| enable | 是否开启缩略图 |                     <font color="c41d7f">boolean</font>                     |   -   |
| config |  缩略图的配置 | [minimap Config Prop](#minimap-config-prop)<font color="c41d7f"> { }</font> |   -   |

<br>

### <a name='minimap-config-prop'></a><b>minimap Config</b>

缩略图的配置

|       参数      |    说明    |               类型              | 默认值 |
|:---------------:|:----------:|:-------------------------------:|:-----:|
|    nodeColor    |   节点颜色  | <font color="c41d7f">any</font> |   -   |
| activeNodeColor | 节点激活颜色 | <font color="c41d7f">any</font> |   -   |

<br>

## 🔗API

``` JSX
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
  title ? : string, // 每列的名字
  key: string, // 每列的唯一标志，对应数据上的key值
  width ? : number, // 每列宽度
  primaryKey: boolean, // 这列的key对应的value是否作为键值对
  render ? (value: any, rowData: any) : void // 可自定义每列的样式
}

interface config { // 
  showActionIcon ? : boolean, // 是否展示操作icon：放大，缩小，聚焦
  allowKeyboard ? : boolean, // 允许键盘删除事件，todo以后支持shift多选
  collapse: {
    enable: boolean, // 允许节点收缩
    defaultMode: string // 默认以"展开/收缩"形式展示
  },
  titleRender ? (title: JSX.Element) : void, // 节点title的渲染方法
  titleExtIconRender ? (node: JSX.Element) : void, // 节点右侧按钮的渲染方法
  labelRender ? (label: JSX.Element) : void, // 线段label的渲染方法
  minimap: { // 是否开启缩略图
    enable: boolean,
    config: {
      nodeColor: any, // 节点颜色
      activeNodeColor: any // 节点激活颜色
    }
  }
}

interface menu { // '节点/线段'的右键菜单配置
  title ? : string, // 每列的展示的名字
  key: string, // 每列的唯一标志，对应数据上的key值
  render ? (key: string) : void, // 支持每列的自定义样式
  onClick ? (key: string, data: any) : void, // 每列的点击回调
}

interface props {
  width ? : number | string, // 组件宽
  height ? : number | string, // 组件高
  className ? : string, // 组件classname
  columns: Array < columns > , // 跟antd的table的column的概念类似
  nodeMenu: Array < menu > , // 节点右键菜单配置
  edgeMenu: Array < menu > , // 线段右键菜单配置
  config: config, // 如上述配置
  data: any, // 数据
  emptyContent ? : string | JSX.Element; // 当表字段为空时显示内容
  emptyWidth ? : number | string; // 当表字段为空时表容器宽度
  onLoaded(canvas: any): void, // 渲染完毕事件
  onChange(data: any): void, // 图内数据变化事件
  onFocusNode(node: any): void, // 聚焦节点事件
  onFocusEdge(edge: any): void, // 聚焦线段事件
  onFocusCanvas(): void, // 聚焦空白处事件
};
```

如需要更多定制的需求，您可以提issue或者参考[Butterfly](https://github.com/alibaba/butterfly)来定制您需要的需求
