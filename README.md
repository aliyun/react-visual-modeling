<h3 align="center">
  一个基于React的运维/监控DAG图
</h3>

[English](./README.en-US.md) | 简体中文

<p align="center">
  <img width="100%" src="https://img.alicdn.com/imgextra/i2/O1CN01eJigoL1gd9tjRSvdi_!!6000000004164-1-tps-1665-826.gif">
</p>

## ✨ 特性

* 支持左到右，上到下的布局
* 支持自定义状态，左上角自定义状态注释
* 支持自定义节点样式，以及hover，focus状态
* 支持线段label样式
* 支持节点，锚点，线段label的tooltips
* 支持节点，线段的右键菜单
* 支持minimap，以及高亮状态
* 支持线段流动动画

## 📦 安装

``` 
npm install react-monitor-dag
```

## API<a name='canvas-attr'></a>：

### <b>MonitorDag属性</b>

|        参数       |                       说明                      |                               类型                              |                       默认值                       |
|:-----------------:|:-----------------------------------------------:|:---------------------------------------------------------------:|:-------------------------------------------------:|
|        data       |                     画布数据                     |                 <font color="c41d7f">any</font>                 |                         -                         |
|       width       |                     组件宽度                     |         <font color="c41d7f">number &#124; string</font>        |                         -                         |
|       height      |                     组件高度                     |        <font color="c41d7f">number &#124; string </font>        |                         -                         |
|     className     |                     组件类名                     |                <font color="c41d7f">string</font>               |                         -                         |
|      nodeMenu     |                  节点右键菜单配置                 | <font color="c41d7f">Array&#60; [menu](#menu-type)&#62; </font> |                        [ ]                        |
|      edgeMenu     |                  线段右键菜单配置                 | <font color="c41d7f">Array&#60; [menu](#menu-type)&#62; </font> |                        [ ]                        |
|       config      |      组件的画布配置，见[config Prop](#config)      |                 <font color="c41d7f">any </font>                |                         -                         |
|      polling      |    组件的轮训属性配置，见[polling Prop](#polling)   |                <font color="c41d7f">object</font>               |                        { }                        |
|   registerStatus  |     自行注册状态，根据node的status给节点加上class    |                <font color="c41d7f">object</font>               | key:value的形式，可以自行注册，和node的status字段对应起来 |
|     statusNote    | 画布左上角状态注释，见[statusNote Prop](#statusNote) |                <font color="c41d7f">object</font>               |                        { }                        |
|    onClickNode    |                    单击节点事件                   |            <font color="c41d7f">(node) => void</font>           |                         -                         |
| onContextmenuNode |                    右键节点事件                   |            <font color="c41d7f">(node) => void</font>           |                         -                         |
|   onDblClickNode  |                    双击节点事件                   |            <font color="c41d7f">(node) => void</font>           |                         -                         |
|    onClickEdge    |                    单击线段事件                   |            <font color="c41d7f">(edge) => void</font>           |                         -                         |
|    onClickLabel   |                  单击label的事件                 |        <font color="c41d7f">(label, edge) => void</font>        |                         -                         |
| onContextmenuEdge |                    右键线段事件                   |            <font color="c41d7f">(edge) => void</font>           |                         -                         |
| onContextmenuGroup |                    右键group事件                   |            <font color="c41d7f">(edge) => void</font>           |                         -                         |
| onChangePage |                    单击group分页事件                   |            <font color="c41d7f">(edge) => void</font>           |                         -                         |
                    -                         |

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

|        参数        |          说明         |                              类型                             |               默认值               |
|:------------------:|:---------------------:|:-------------------------------------------------------------:|:---------------------------------:|
|      direction     |        图的方向        |               <font color="c41d7f">string</font>              | `left-right` &#124; `top-bottom` |
|        edge        |      定制线段的类型     |    [edge Prop](#edge-prop)<font color="c41d7f"> { }</font>    |                 -                 |
|     labelRender    |   线段label的渲染方法   |          <font color="c41d7f">(label) => void</font>          |                 -                 |
|   labelTipsRender  | 线段label tips的渲染方法 |           <font color="c41d7f">(data) => void</font>          |                 -                 |
|     nodeRender     |      节点的渲染方法     |           <font color="c41d7f">(data) => void</font>          |                 -                 |
|   nodeTipsRender   |    节点tips的渲染方法   |           <font color="c41d7f">(data) => void</font>          |                 -                 |
| endpointTipsRender |    锚点tips的渲染方法   |           <font color="c41d7f">(data) => void</font>          |                 -                 |
|       minimap      |      是否开启缩略图     | [minimap Prop](#minimap-prop)<font color="c41d7f"> { }</font> |                 -                 |

<br>

### <a name='edge-prop'></a><b>edge</b>

定制线段属性

|  参数  |   说明   |                类型                | 默认值 |
|:------:|:--------:|:----------------------------------:|:-----:|
|  type  | 线段的类型 | <font color="c41d7f">string</font> |   -   |
| config | 线段的配置 |  <font color="c41d7f"> any</font>  |   -   |

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

### <a name='polling'></a><b>polling</b>

轮训属性配置

|   参数   |    说明    |                    类型                    | 默认值 |
|:--------:|:----------:|:------------------------------------------:|:-----:|
|  enable  | 是否支持轮训 |     <font color="c41d7f">boolean</font>    |   -   |
| interval |   轮训时间  |     <font color="c41d7f">number</font>     |   -   |
|  getData |   轮训方法  | <font color="c41d7f">(data) => void</font> |   -   |

<br>

### <a name='statusNote'></a><b>statusNote</b>

画布左上角状态配置

|  参数  |        说明        |                            类型                           | 默认值 |
|:------:|:------------------:|:---------------------------------------------------------:|:-----:|
| enable | 是否开启左上角状态显示 |            <font color="c41d7f">boolean</font>            |   -   |
|  notes |   左上角状态配置信息  | [notes Prop](#notes-prop)<font color="c41d7f"> { }</font> |   -   |

<br>

### <a name='notes-prop'></a><b>notes</b>

左上角状态配置信息

|    参数   |       说明      |                 类型                | 默认值 |
|:---------:|:---------------:|:-----------------------------------:|:-----:|
|    code   |    左上角状态    |  <font color="c41d7f">string</font> |   -   |
| className |  左上角状态栏类名 | <font color="c41d7f"> string</font> |   -   |
|    text   | 左上角状态显示文字 |  <font color="c41d7f">string</font> |   -   |
|   render  | 自定义渲染方法 |  <font color="c41d7f">function</font> |   -   |

<br>

## 🔗API

``` jsx
import MonitorDag from 'react-monitor-dag';
import 'react-monitor-dag/dist/index.css'; 
<MonitorDag
  data={data}
  nodeMenu={menu}                   // Node Right-click Menu Configuration
  edgeMenu={menu}                   // Edge Right-click Menu Configuration
  onClickNode={(node) => {}}        // Single Click Node Event
  onContextmenuNode={(node) => {}}  // Right Click Node Event
  onDblClickNode={(node) => {}}     // Double Click Node Event
  onClickEdge={(edge) => {}}        // Single Click Edge Event
  onContextmenuEdge={(edge) => {}}  // Right Click Edge Event
   onContextmenuGroup={(data) => {}}   // Right Click Group Event
  onChangePage={(data) => {}}        // Single Click Group Pagination Event
  polling={{                        // support polling
    enable: true,
    interval: 5000,                 // interval of polling 
    getData: (data) => {            // the method of get data

    }
  }}
  registerStatus={{                 // Register status, which adds class to the node based on its status
    success: 'success-class',
    fail: 'fail-class',
    timeout: 'timeout-class',
    running: 'runnning-class',
    waitting: 'waiting-class',
    other: 'other-class'
  }}
  statusNote={{                      // Status note in upper left corner
    enable: true,
    notes: [{
      code: 'success',
      className: 'success-class',
      text: '运行成功'
    }]
  }}
>
</MonitorDag>
```

``` javascript
interface menu { // '节点/线段'的右键菜单配置
  title ? : string, // 每列的展示的名字
    key: string, // 每列的唯一标志，对应数据上的key值
    render ? (key: string) : void, // 支持每列的自定义样式
    onClick ? (key: string, data: any) : void, // 每列的点击回调
}

interface config {
  direction: string, // 图的方向: 'left-right' or 'top-bottom'
    edge: { // 定制线段的类型
      type: string,
      config: any
    },
    labelRender ? (label: JSX.Element) : void, // 线段label的渲染方法
    labelTipsRender ? (data: any) : void, // 线段label tips的渲染方法
    nodeRender ? (data: any) : void, // 节点的渲染方法
    nodeTipsRender ? (data: any) : void, // 节点tips的渲染方法
    endpointTipsRender ? (data: any) : void, // 锚点tips的渲染方法
    minimap: { // 是否开启缩略图
      enable: boolean,
      config: {
        nodeColor: any, // 节点颜色
        activeNodeColor: any // 节点激活颜色
      }
    }
}

interface props {
  data: any, // 画布数据
    width ? : number | string, // 组件宽
    height ? : number | string, // 组件高
    className ? : string, // 组件classname
    nodeMenu: Array < menu > , // 节点右键菜单配置
    edgeMenu: Array < menu > , // 线段右键菜单配置
    config ? : any, // 画布配置
    polling ? : { // 支持轮训
      enable: boolean,
      interval: number, // 轮训时间
      getData(data): void // 轮训方法
    },
    registerStatus ? : { // 自行注册状态，会根据node的status给节点加上class
      success: string,
      fail: string,
      // key:value的形式，可以自行注册，和node的status字段对应起来
    },
    statusNote ? : { // 画布左上角状态注释
      enable: boolean,
      notes: [{
        code: string,
        className: string,
        text: string,
        render?: () => JSX.Element
      }]
    },
    onClickNode ? (node: any) : void, // 单击节点事件
    onContextmenuNode ? (node: any) : void, // 右键节点事件
    onDblClickNode ? (node: any) : void, // 双击节点事件
    onClickEdge ? (edge: any) : void, // 单击线段事件
    onClickLabel ? (label: string, edge: any) : void, //单击label的事件
    onContextmenuEdge ? (edge: any) : void, // 右键线段事件
    onContextmenuGroup?(edge: any): void,   // 右键group事件
    onChangePage?(data:any): void,          // 单击分页事件&搜索
}
```

如需要更多定制的需求，您可以提issue或者参考[Butterfly](https://github.com/alibaba/butterfly)来定制您需要的需求
