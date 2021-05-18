<h3 align="center">
  A React-based DAG diagram for data visualization modeling, suitable for UML, database modeling, data warehouse construction and other businesses. 
</h3>

English | [简体中文](./README.md)

<p align="center">
  <img width="100%" src="https://img.alicdn.com/imgextra/i4/O1CN01VZxfyl1pOLc15k7XM_!!6000000005350-1-tps-1665-829.gif">
</p>

## ✨ Feature

* support custom field properties
* support custom title, title Icon
* support the shrinking / expanding state of nodes, and show the mapping relationship after shrinking
* support custom edge attributes and custom edge label
* support the node, field's status of hover, focus, linked and full chain highlight
* support the right-click menu of node and edge
* support minimap and highlight state of minimap
* support custom empty field content

## 📦 Install

``` 
npm install react-visual-modeling
```

## API<a name='canvas-attr'></a>：

### <b>VisualModeling properties</b>

|    Property   |                             Description                             |                               Type                               | Default |
|:-------------:|:-------------------------------------------------------------------:|:----------------------------------------------------------------:|:-------:|
|      data     |                                 data                                |                  <font color="c41d7f">any</font>                 |    -    |
|     width     |                           component width                           |         <font color="c41d7f">number &#124; string</font>         |    -    |
|     height    |                           component height                          |         <font color="c41d7f">number &#124; string </font>        |    -    |
|   className   |                         component className                         |                <font color="c41d7f">string</font>                |    -    |
|    columns    | property settings for each column of fields[columns Prop](#columns) | <font color="c41d7f">Array&#60; [columns](#columns)&#62; </font> |    -    |
|    nodeMenu   |                 Node Right-click Menu Configuration                 |  <font color="c41d7f">Array&#60; [menu](#menu-type)&#62; </font> |   [ ]   |
|    edgeMenu   |                 Edge Right-click Menu Configuration                 |  <font color="c41d7f">Array&#60; [menu](#menu-type)&#62; </font> |   [ ]   |
|     config    |              As configured above[config Prop](#config)              |                 <font color="c41d7f">any </font>                 |    -    |
|  emptyContent |                show content when table field is empty               |      <font color="c41d7f">string &#124; JSX. Element</font>      |    -    |
|   emptyWidth  |           table container width when table field is empty           |         <font color="c41d7f">number &#124; string</font>         |    -    |
|    onLoaded   |                         canvas loaded event                         |           <font color="c41d7f">(canvas) => void</font>           |    -    |
|    onChange   |                       canvas data change event                      |            <font color="c41d7f">(data) => void</font>            |    -    |
|  onFocusNode  |                          focus node events                          |            <font color="c41d7f">(node) => void</font>            |    -    |
|  onFocusEdge  |                          focus edge events                          |            <font color="c41d7f">(edge) => void</font>            |    -    |
| onFocusCanvas |                      focus canvas blank events                      |              <font color="c41d7f">() => void</font>              |    -    |
| onDblClickNode|                      double click node events                       |               <font color="c41d7f">() => void</font>             |    -    |

<br>

### <a name='columns'></a><b>columns</b>

property settings for each column of fields

|  Property  |                                     Description                                    |                    Type                   | Default |
|:----------:|:----------------------------------------------------------------------------------:|:-----------------------------------------:|:-------:|
|    title   |                                 name of each column                                |     <font color="c41d7f">string</font>    |    -    |
|     key    |     the unique mark of each column, corresponding to the key value on the data     |     <font color="c41d7f">string</font>    |    -    |
|    width   |                                width of each column                                |     <font color="c41d7f">number</font>    |    -    |
| primaryKey | whether the value corresponding to the key in this column is used as a unique sign |    <font color="c41d7f">boolean</font>    |    -    |
|   render   |                         Customize the style of each column                         | <font color="c41d7f">(key) => void</font> |    -    |

<br>

### <a name='menu-type'></a><b>menu</b>

right-click menu configuration for'Node/Edge'

| Property |               Description               |                       Type                      | Default |
|:--------:|:---------------------------------------:|:-----------------------------------------------:|:-------:|
|   title  |           name of each column           |        <font color="c41d7f">string</font>       |    -    |
|    key   |     unique flag for each column menu    |        <font color="c41d7f">string</font>       |    -    |
|  render  | Customize the style of each column menu |    <font color="c41d7f">(key) => void</font>    |    -    |
|  onClick |      Click Callback for Each Column     | <font color="c41d7f">(key, data) => void</font> |    -    |

<br>

### <a name='config'></a><b>config</b>

the configuration of canvas

|      Property      |                                   Description                                  |                               Type                              | Default |
|:------------------:|:------------------------------------------------------------------------------:|:---------------------------------------------------------------:|:-------:|
|   showActionIcon   |              whether show operation icon: zoom in, zoom out, focus             |               <font color="c41d7f">boolean</font>               |    -    |
|    allowKeyboard   | allow keyboard to delete events. Todo: supports shift multiple selection later |               <font color="c41d7f">boolean</font>               |    -    |
|      collapse      |                         whether to allow node shrinkage                        | [collapse Prop](#collapse-prop)<font color="c41d7f"> { }</font> |    -    |
|     titleRender    |                       rendering methods for node's title                       |           <font color="c41d7f">(title) => void</font>           |    -    |
| titleExtIconRender |                rendering method of buttons on right side of node               |            <font color="c41d7f">(node) => void</font>           |    -    |
|     labelRender    |                        rendering method of edge's label                        |           <font color="c41d7f">(label) => void</font>           |    -    |
|       minimap      |                             whether to show minimap                            |  [minimap Prop](#minimap-prop)<font color="c41d7f"> { }</font>  |    -    |

<br>

### <a name='collapse-prop'></a><b>collapse</b>

the configuration of node contraction

|   Property  |           Description           |                 Type                |                Default               |
|:-----------:|:-------------------------------:|:-----------------------------------:|:------------------------------------:|
|    enable   | whether to allow node shrinkage | <font color="c41d7f">boolean</font> |                   -                  |
| defaultMode |    default presentation form    | <font color="c41d7f"> string</font> | show as 'expand/collapse' by default |

<br>

### <a name='minimap-prop'></a><b>minimap</b>

the configuration of minimap

| Property |       Description       |                                     Type                                    | Default |
|:--------:|:-----------------------:|:---------------------------------------------------------------------------:|:-------:|
|  enable  | whether to show minimap |                     <font color="c41d7f">boolean</font>                     |    -    |
|  config  |  the config of minimap  | [minimap Config Prop](#minimap-config-prop)<font color="c41d7f"> { }</font> |    -    |

<br>

### <a name='minimap-config-prop'></a><b>minimap Config</b>

the config of minimap

|     Property    |    Description    |               Type              | Default |
|:---------------:|:-----------------:|:-------------------------------:|:-------:|
|    nodeColor    |     node color    | <font color="c41d7f">any</font> |    -    |
| activeNodeColor | node active color | <font color="c41d7f">any</font> |    -    |

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
  onDblClickNode={() => {}}
>
</VisualModeling>
```

## 🔗API

``` javascript
interface columns { // property settings for each column of fields
  title ? : string, // name of each column
  key: string, // the unique mark of each column, corresponding to the key value on the data
  width ? : number, // width of each column
  primaryKey: boolean, // whether the value corresponding to the key in this column is used as a unique sign
  render ? (value: any, rowData: any) : void // Customize the style of each column
}

interface config { // 
  showActionIcon ? : boolean, // whether show operation icon: zoom in, zoom out, focus
  allowKeyboard ? : boolean, // allow keyboard to delete events. Todo: supports shift multiple selection later
  collapse: {
    enable: boolean, // allow node shrinkage
    defaultMode: string // show as 'expand/collapse' by default
  },
  titleRender ? (title: JSX.Element) : void, // rendering methods for node's title
  titleExtIconRender ? (node: JSX.Element) : void, // rendering method of buttons on right side of node
  labelRender ? (label: JSX.Element) : void, // rendering method of edge's label
  minimap: { // whether to show minimap
    enable: boolean,
    config: {
      nodeColor: any, // node color
      activeNodeColor: any // active node color
    }
  }
}

interface menu { // right-click menu configuration for'Node/Edge'
  title ? : string, // name of each column
  key: string, // unique flag for each column menu
  render ? (key: string) : void, // Customize the style of each column menu
  onClick ? (key: string, data: any) : void, // Click Callback for Each Column
}

interface props {
  width ? : number | string, // component width
  height ? : number | string, // component height
  className ? : string, // component className
  columns: Array < columns > , // similar to antd's table column concept
  nodeMenu: Array < menu > , // Node Right-click Menu Configuration
  edgeMenu: Array < menu > , // Edge Right-click Menu Configuration
  config: config, // As configured above
  data: any, // data
  emptyContent ? : string | JSX.Element; // show content when table field is empty
  emptyWidth ? : number | string; // table container width when table field is empty
  onLoaded(canvas: any): void, // canvas loaded event
  onChange(data: any): void, // canvas data change event
  onFocusNode(node: any): void, // focus node events
  onFocusEdge(edge: any): void, // focus edge events
  onFocusCanvas(): void, // focus canvas blank events
};
```

If you need more customized requirements, you can refer to issue or [butterfly](https://github.com/alibaba/butterfly/blob/master/README.en-US.md) to customize your needs
