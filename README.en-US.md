<h3 align="center">
  A React-based DAG diagram for data visualization modeling, suitable for UML, database modeling, data warehouse construction and other businesses.
</h3>

English| [简体中文](./README.md)

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
interface columns { // property settings for each column of fields
  title?: string, // name of each column
  key: string, // the unique mark of each column, corresponding to the key value on the data
  width?: number, // width of each column
  primaryKey: boolean, // whether the value corresponding to the key in this column is used as a unique sign
  render?(value: any, rowData: any): void // Customize the style of each column
}

interface config { // 
  showActionIcon?: boolean,// whether show operation icon: zoom in, zoom out, focus
  allowKeyboard?: boolean, // allow keyboard to delete events. Todo: supports shift multiple selection later
  collapse: {
    enable: boolean,       // allow node shrinkage
    defaultMode: string    // show as 'expand/collapse' by default
  },
  titleRender?(title: JSX.Element): void,  // rendering methods for node's title
  titleExtIconRender?(node: JSX.Element): void,  // rendering method of buttons on right side of node
  labelRender?(label: JSX.Element): void,  // rendering method of edge's label
  minimap: {   // whether to show minimap
    enable: boolean,
    config: {
      nodeColor: any, // node color
      activeNodeColor: any // active node color
    }
  }
}

interface menu { // right-click menu configuration for'Node/Edge'
  title?: string, // name of each column
  key: string, // unique flag for each column menu
  render?(key: string): void, // Customize the style of each column menu
  onClick?(key: string, data: any): void, // Click Callback for Each Column
}

interface props {
  width?: number | string,     // component width
  height?: number | string,    // component height
  className?: string,          // component className
  columns: Array<columns>,     // similar to antd's table column concept
  nodeMenu: Array<menu>,       // Node Right-click Menu Configuration
  edgeMenu: Array<menu>,       // Edge Right-click Menu Configuration
  config: config,              // As configured above
  data: any,                   // data
  emptyContent?: string | JSX.Element; // show content when table field is empty
  emptyWidth?: number | string; // table container width when table field is empty
  onLoaded(canvas: any): void, // canvas loaded event
  onChange(data: any): void,   // canvas data change event
  onFocusNode(node: any): void,// focus node events
  onFocusEdge(edge: any): void,// focus edge events
  onFocusCanvas(): void,       // focus canvas blank events
};
```

If you need more customized requirements, you can refer to issue or [butterfly](https://github.com/alibaba/butterfly/blob/master/README.en-US.md) to customize your needs