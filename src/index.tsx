import * as React from 'react';
import * as _ from 'lodash';
import * as ReactDOM from 'react-dom';

import {bfCfg} from './config';
import {Arrow} from 'butterfly-dag';
import Canvas from './canvas/canvas';
import EdgeRender from './component/edge-render'
import ActionMenu, {action} from './component/action-menu';
import {transformInitData, diffPropsData} from './adaptor';

import 'butterfly-dag/dist/index.css';

import './index.less';

// 跟antd的table的column的概念类似
interface columns {
  title?: string,
  key: string,
  width?: number,
  primaryKey: boolean,
  render?(value: any, rowData: any): void
}

interface config {
  showActionIcon?: boolean,                       // 是否展示操作icon：放大，缩小，聚焦
  allowKeyboard?: boolean,                        // 允许键盘删除事件，todo以后支持shift多选
  collapse: {
    enable: boolean,                              // 允许节点收缩
    defaultMode: string                           // 默认以哪种形式展示
  },
  enableHoverChain: boolean,
  enableFoucsChain: boolean,
  titleRender?(title: JSX.Element): void,         // 节点title的渲染方法
  titleExtIconRender?(node: JSX.Element): void,   // 节点右侧按钮的渲染方法
  labelRender?(label: JSX.Element): void,         // 线段label的渲染方法
  autoLayout: {
    enable: boolean,                              // 是否开启自动布局
    isAlways: boolean,                            // 是否添加节点后就重新布局
    type: string,                                 // 算法类型
    config: any                                   // 算法配置
  },
  minimap: {                                      // 是否开启缩略图
    enable: boolean,
    config: {
      nodeColor: any
    }
  },
  butterfly: any;                                 // 小蝴蝶的画布配置，参考：https://github.com/alibaba/butterfly/blob/dev/v4/docs/zh-CN/canvas.md
}

// 右键菜单配置
interface menu {
  title?: string,
  key: string,
  render?(key: string): void,
  onClick?(node: any): void,
}

interface ComProps {
  width?: number | string,                          // 组件宽
  height?: number | string,                         // 组件高
  className?: string,                               // 组件classname
  columns: columns[],                               // 跟antd的table的column的概念类似
  nodeMenu: menu[],                                 // 节点右键菜单配置
  edgeMenu: menu[],                                 // 线段右键菜单配置
  actionMenu: action[],                             // action菜单
  config: config,                                   // 如上述配置
  data: any,                                        // 数据
  emptyWidth?: number | string,                     // 空数据时默认标题宽度
  emptyContent?: string | JSX.Element,              // 空数据显示内容
  selectable: boolean;                              // 开启框选模式
  onLoaded(canvas: any, utils: any): void,          // 渲染完毕事件
  onChange(data: any): void,                        // 图内数据变化事件
  onFocusNode(node: any): void,                     // 聚焦节点事件
  onFocusEdge(edge: any): void,                     // 聚焦线段事件
  onFocusCanvas(): void,                            // 聚焦空白处事件
  onDblClickNode?(node: any): void,                 // 双击节点事件
  onSelect(nodes: any, edges: any): void,           // 选中事件

  // TODO: 展开/收缩节点
  // onDeteleNodes(nodeInfo: any): void,
  // onDeteleEdges(edgeInfo: any): void,
  // onConnectEdges(edgeInfo: any): void,
  // onReConnectEdges(addEdgeInfo: any, rmEdgeInfo: any): void,
};

const noop = () => null;

export default class TableBuilding extends React.Component<ComProps, any> {
  protected canvas: any;
  protected canvasData: any;
  private _focusNodes: any;
  private _columns: any;
  private _focusLinks: any;
  private _enableHoverChain: any;
  private _enableFocusChain: any;
  props: any;

  constructor(props: ComProps) {
    super(props);
    this.canvas = null;
    this.canvasData = null;

    this._focusNodes = [];
    this._focusLinks = [];

    this._enableHoverChain = _.get(props, 'config.enableHoverChain', true);
    this._enableFocusChain = _.get(props, 'config.enableFocusChain', false);
  }

  componentDidMount() {
    const {beforeLoad = noop, config = {}} = this.props;

    let root = ReactDOM.findDOMNode(this) as HTMLElement;

    if (this.props.width !== undefined) {
      root.style.width = (this.props.width || 500) + 'px';
    }

    if (this.props.height !== undefined) {
      root.style.height = (this.props.height || 500) + 'px';
    }

    let result = transformInitData({
      columns: this.props.columns,
      config: this.props.config,
      nodeMenu: this.props.nodeMenu,
      edgeMenu: this.props.edgeMenu,
      data: _.cloneDeep(this.props.data),
      emptyContent: this.props.emptyContent,
      emptyWidth: this.props.emptyWidth
    });

    this.canvasData = result;

    this.canvas = new Canvas(
      _.merge(
        {},
        // 默认配置
        bfCfg,
        // 用户配置
        (config.butterfly || {}),
        // 固定配置
        {
          root,
          data: {
            enableHoverChain: this._enableHoverChain,
            enableFocusChain: this._enableFocusChain
          }
        }
      )
    );

    beforeLoad({Arrow});

    this.canvas.draw(result, () => {
      this.props.onLoaded && this.props.onLoaded(this.canvas);
      let minimap = _.get(this, 'props.config.minimap', {});

      if (_.get(this, 'props.config.allowKeyboard')) {
        document.addEventListener('keydown', this._deleteFocusItem.bind(this));
      }

      const minimapCfg = _.assign({}, minimap.config, {
        events: [
          'system.node.click',
          'system.canvas.click'
        ]
      });

      if (minimap && minimap.enable) {
        this.canvas.setMinimap(true, minimapCfg);
      }

      if (_.get(this, 'props.config.collapse.defaultMode') === 'collapse') {
        this.canvas.nodes.forEach((item) => {
          this.canvas.collapse(item.id);
        })
      }

      this.forceUpdate();
    });

    this.initEvents();
  }

  /**
   * 初始化butterfly事件
   */
  initEvents() {
    const {config, edgeMenu} = this.props;
    let isAfterSelect = false;

    let _addLinks = (links: any) => {
      let newLinkOpts = links.map((item: any) => {
        let _oldSource = _.get(item, 'sourceEndpoint.id', '');
        let _oldTarget = _.get(item, 'targetEndpoint.id', '');
        let _newSource = _oldSource.indexOf('-right') !== -1 ? _oldSource : _oldSource + '-right';
        let _newTarget = _oldTarget.indexOf('-left') !== -1 ? _oldTarget : _oldTarget + '-left';

        return {
          id: item.options.id,
          sourceNode: item.options.sourceNode,
          targetNode: item.options.targetNode,
          arrowShapeType: item.arrowShapeType,
          source: _newSource,
          target: _newTarget,
          _menu: item.options._menu || edgeMenu,
          _config: item.options._config || config,
          type: 'endpoint',
          label: item.label
        };
      });

      this.canvas.removeEdges(links, true);
      let newEdge = this.canvas.addEdges(newLinkOpts, true);
      newEdge.forEach((item) => {
        this.canvas.originEdges.push(_.assign({}, item.options, {
          source: _.get(item, 'sourceEndpoint.options.originId'),
          target: _.get(item, 'targetEndpoint.options.originId'),
        }));
      });
    }
    
    this.canvas.on('system.link.connect', (data: any) => {
      _addLinks(data.links || []);
      this.onConnectEdges(data.links);

      this.forceUpdate();
    });

    this.canvas.on('system.link.reconnect', (data: any) => {
      _addLinks(data.addLinks || []);
      this.onReConnectEdges(data.addLinks, data.delLinks);

      this.forceUpdate();
    });

    this.canvas.on('system.node.click', (data: any) => {
      this._focusNode(data.node);
    });

    this.canvas.on('system.node.dblClick', (data: any) => {
      this.props.onDblClickNode && this.props.onDblClickNode(data.node);
    });

    this.canvas.on('system.link.click', (data: any) => {
      this._focusLink(data.edge);
    });

    this.canvas.on('system.canvas.click', (data: any) => {
      if(isAfterSelect) {
        return;
      }

      this._unfocus();
      this.props.onFocusCanvas && this.props.onFocusCanvas();
      this.canvas.unfocus();
    });

    this.canvas.on('system.multiple.select', ({data}) => {
      // 加这个判断是为了防止[system.canvas.click]事件和当前事件冲突
      isAfterSelect = true;

      const {nodes, edges} = data;
      this._unfocus();

      nodes.forEach(node => {
        node.focus();
        this._focusNodes.push(node);
      });

      edges.forEach(edge => {
        edge.focus();
        this._focusLinks.push(edge);
      })
  
      _.isFunction(this.props.onSelect) && this.props.onSelect(nodes, edges);

      // 防止误触
      setTimeout(() => {
        isAfterSelect = false;
      }, 100);
    });    

    this.canvas.on('custom.node.delete', (data: any) => {
      this.onDeteleNodes([data.node]);
    });

    this.canvas.on('table.canvas.expand', () => {
      this.forceUpdate();
    });

    this.canvas.on('table.canvas.collapse', () => {
      this.forceUpdate();
    });
  }


  shouldComponentUpdate(newProps: ComProps, newState: any) {

    this.canvas.setSelectMode(!!newProps.selectable);

    // 更新节点
    let result = transformInitData({
      columns: this.props.columns,
      config: this.props.config,
      nodeMenu: this.props.nodeMenu,
      edgeMenu: this.props.edgeMenu,
      data: _.cloneDeep(newProps.data),
      emptyContent: this.props.emptyContent,
      emptyWidth: this.props.emptyWidth
    });

    let diffInfo = diffPropsData(result, this.canvasData, {
      oldCol: this.props.columns,
      newCol: newProps.columns
    });

    if (diffInfo.addNodes.length > 0) {
      this.canvas.addNodes(diffInfo.addNodes);
    }
    if (diffInfo.rmNodes.length > 0) {
      this.canvas.removeNodes(diffInfo.rmNodes.map(node => node.id));
    }
    if (diffInfo.addEdges.length > 0) {
      this.canvas.addEdges(diffInfo.addEdges);
    }

    if (diffInfo.rmEdges.length > 0) {
      this.canvas.removeEdges(diffInfo.rmEdges.map(edge => edge.id));
    }

    // 更新节点中的字段
    let _isDiffNode = (
      diffInfo.updateTitle.length > 0 ||
      diffInfo.updateFields.length > 0 ||
      diffInfo.addFields.length > 0 ||
      diffInfo.rmFields.length > 0 ||
      diffInfo.newCol.length > 0
    );

    if (_isDiffNode) {
      this.canvas.updateNodes(diffInfo);
    }

    this.canvasData = result;
    return true;
  }

  componentWillUnmount() {
    if (_.get(this, 'props.config.allowKeyboard')) {
      document.removeEventListener('keydown', this._deleteFocusItem);
    }
  }

  onConnectEdges(links) {
    let linksInfo = links.map((item) => {
      return item.options;
    });

    this.props.onChange && this.props.onChange({
      type: 'system.link.connect',
      links: linksInfo
    });
  }

  onReConnectEdges(addLinks, rmLinks) {
    let addLinksInfo = addLinks.map((item) => {
      return item.options;
    });
    let rmLinksInfo = rmLinks.map((item) => {
      return item.options;
    });
    this.props.onChange && this.props.onChange({
      type: 'system.link.reconnect',
      addLinks: addLinksInfo,
      rmLinks: rmLinksInfo
    });
  }

  onDeteleNodes(nodes) {
    let neighborLinksInfo = [];
    nodes.forEach((node) => {
      let links = this.canvas.getNeighborEdges(node.id);
      let linksInfo = links.map((link) => {
        return link.options;
      });
      neighborLinksInfo = neighborLinksInfo.concat(linksInfo);
    })

    let nodesInfo = nodes.map((item) => {
      return item.options;
    });

    this.props.onChange && this.props.onChange({
      type: 'system.node.delete',
      nodes: nodesInfo,
      neighborLinks: neighborLinksInfo
    });
  }

  onDeteleEdges(links) {
    let linksInfo = links.map((item) => {
      return item.options;
    });

    this.props.onChange && this.props.onChange({
      type: 'system.link.delete',
      links: linksInfo
    });
  }

  _genClassName() {
    return (this.props.className || '') + ' butterfly-table-building'
  }

  // 聚焦节点
  _focusNode(node) {
    this._unfocus();
    node.focus();
    this._focusNodes.push(node);
    this.props.onFocusNode && this.props.onFocusNode(node);
  }

  // 聚焦线段
  _focusLink(edge) {
    this._unfocus();
    edge.focus();
    this._focusLinks.push(edge);
    this.props.onFocusEdge && this.props.onFocusEdge(edge);
  }

  // 失焦
  _unfocus() {
    this._focusNodes.forEach((item) => {
      item.unfocus();
    });

    this._focusLinks.forEach((item) => {
      item.unfocus();
    });

    this._focusNodes = [];
    this._focusLinks = [];
  }

  _deleteFocusItem(e) {
    // todo: 这块需要好好思考下
    if (e.key === 'Delete' || e.key === 'Backspace') {
      this.onDeteleNodes(this._focusNodes);
      this.onDeteleEdges(this._focusLinks);
    }
  }

  _delNodes(nodes) {
    return nodes.map((item) => {
      return item.options;
    });
  }

  _delEdges(edges) {
    return edges.map((item) => {
      return item.options;
    });
  }

  render() {
    const {canvas} = this;
    const {actionMenu = []} = this.props;
    const actionMenuVisible = _.get(this, 'props.config.showActionIcon', true);
    const labelRender = _.get(this, 'props.config.labelRender', noop);
    const selectable = !!this.props.selectable;

    return (
      <div
        className={this._genClassName()}
        style={{
          cursor: selectable ? 'crosshair' : 'default'
        }}
      >
        <ActionMenu 
          canvas={canvas}
          actionMenu={actionMenu}
          visible={actionMenuVisible}
        />
        <EdgeRender
          canvas={canvas}
          labelRender={labelRender}
        />
      </div>
    )
  }
}