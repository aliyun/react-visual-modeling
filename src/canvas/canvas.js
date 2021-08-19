import {Canvas, Tips} from 'butterfly-dag';
import $ from 'jquery';

import CollapseMenuGen from './collapse-menu.jsx';

export default class TableCanvas extends Canvas {
  constructor(opts) {
    super(opts);
    this.originEdges = [];
    this._focusItem = null;
    this._enableHoverChain = opts.data.enableHoverChain;
    this._enableFocusChain = opts.data.enableFocusChain;
    this._showCollapseDetail = opts.data.showCollapseDetail;
    this.attachEvent();
  }

  attachEvent() {
    // 线段删除特殊处理
    this.on('custom.endpoint.dragNode', (data) => {
      let point = data.data;
      let node = this.getNode(point.nodeId);
      let linkedPoint = node.getEndpoint(point.id + '-right', 'source');
      this.emit('InnerEvents', {
        type: 'endpoint:drag',
        data: linkedPoint
      });
    });

    // 移动节点时，隐藏菜单
    this.on('system.drag.start', (data) => {
      Tips.closeMenu();
    });

    if (this._enableHoverChain) {
      this.on('custom.endpoint.hover', (data) => {
        let point = data.point;
        this.focusChain(point.nodeId, point.id, 'hover-chain');
      });
      this.on('custom.endpoint.unHover', (data) => {
        let point = data.point;
        this.unfocusChain(point.nodeId, point.id, 'hover-chain');
      });
    }
    if (this._enableFocusChain) {
      this.on('custom.endpoint.focus', (data) => {
        let point = data.point;
        this.focusChain(point.nodeId, point.id, 'focus-chain');
      });
    }

    this.on('custom.node.expand', (data) => {
      this.expand(data.nodeId);
    });

    this.on('custom.node.collapse', (data) => {
      this.collapse(data.nodeId);
    });

    this.on('custom.edge.showCollapseInfo', (data) => {
      const {container, pos, edge} = data;
      if (this._showCollapseDetail) {
        CollapseMenuGen({
          container,
          pos,
          edge,
          originEdgesInfo: this.originEdges
        });
      }
    });

    this.on('system.links.delete', (data) => {
      data.links.forEach((delLink) => {
        this.originEdges = this.originEdges.filter((originLink) => {
          return !(
            originLink.sourceNode === delLink.sourceNode.id,
            originLink.source === _.get(delLink, 'sourceEndpoint.options.originId'),
            originLink.targetNode === delLink.targetNode.id,
            originLink.target === _.get(delLink, 'targetEndpoint.options.originId')
          );
        });
      });
    });

    this.on('system.nodes.delete', (data) => {
      data.nodes.forEach((item) => {
        this.originEdges = this.originEdges.filter((originLink) => {
          return originLink.sourceNode !== item.id && originLink.targetNode !== item.id;
        });
      })
    });
  }

  updateNodes(nodeInfos) {
    (nodeInfos.updateTitle || []).forEach((info) => {
      let node = this.getNode(info.nodeId);
      node._updateTitle(info.title);
    });

    if (nodeInfos.newCol && nodeInfos.newCol.length > 0) {
      let edges = this.edges.map(item => item);
      let _originEdges = this.originEdges;
      this.nodes.forEach((item) => {
        item._updateCol(nodeInfos.newCol);
      });
      this.originEdges = _originEdges;

      /**
       * 更新col时会将之前的 endpoint 删掉，
       * 此时需要重新更新
       */
      edges.forEach(edge => {
        const newSrcEndpoint = edge.sourceNode.getEndpoint(edge.sourceEndpoint.id);
        edge.sourceEndpoint = newSrcEndpoint;

        const newTgtEndpoint = edge.targetNode.getEndpoint(edge.targetEndpoint.id);
        edge.targetEndpoint = newTgtEndpoint;
      });

      this.addEdges(edges, true);
    }

    (nodeInfos.addFields || []).forEach((info) => {
      let node = this.getNode(info.nodeId);
      node._addFields(info.fields);
    });
    (nodeInfos.rmFields || []).forEach((info) => {
      let node = this.getNode(info.nodeId);
      node._rmFields(info.fields);
    });
    (nodeInfos.updateFields || []).forEach((info) => {
      let node = this.getNode(info.nodeId);
      node._updateFields(info.fields);
    });
  }

  updateLabel(infos) {
    infos.forEach((info) => {
      let _targetEdge = info.edge;
      let edge = _.find(this.edges, (item) => {
        return (
          _targetEdge.sourceNode === item.sourceNode.id  &&
          _targetEdge.targetNode === item.targetNode.id  &&
          _targetEdge.source === item.sourceEndpoint.options.originId  &&
          _targetEdge.target === item.targetEndpoint.options.originId
        );
      });
      
      this.getEdge(info.edge.id);
      if (edge) {
        edge.updateLabel(info.label);
        $(edge.labelDom).on('dblclick',(e) => {
          e.preventDefault();
          e.stopPropagation();
          edge.emit('custom.edge.dblClick',{
            edge
          });
        });
      }
    })
  }

  expand(nodeId) {
    let node = this.getNode(nodeId);

    if(!node) {
      return;
    }

    let oldEdges = this.getNeighborEdges(nodeId);
    this.removeEdges(oldEdges, true);
    node._expand();
    let newEdges = [];
    // 从全局展开图里面纠正线段
    this.originEdges.forEach((item) => {
      if (item.sourceNode === nodeId) {
        let targetNode = this.getNode(item.targetNode);
        if (targetNode.status === 'collapse') {
          newEdges.push(_.assign({}, item, {
            sourceNode: item.sourceNode,
            source: `${item.source}-right`,
            targetNode: item.targetNode,
            target: `${targetNode.id}-left`
          }));
        } else {
          newEdges.push(_.assign({}, item, {
            sourceNode: item.sourceNode,
            source: `${item.source}-right`,
            targetNode: item.targetNode,
            target: `${item.target}-left`
          }));
        }
      } else if (item.targetNode == nodeId) {
        let sourceNode = this.getNode(item.sourceNode);
        if (sourceNode.status === 'collapse') {
          newEdges.push(_.assign({}, item, {
            sourceNode: item.sourceNode,
            source: `${sourceNode.id}-right`,
            targetNode: item.targetNode,
            target: `${item.target}-left`
          }));
        } else {
          newEdges.push(_.assign({}, item, {
            sourceNode: item.sourceNode,
            source: `${item.source}-right`,
            targetNode: item.targetNode,
            target: `${item.target}-left`
          }));
        }
      }
    });
    // 去重
    newEdges = _.uniqWith(newEdges, (a, b) => {
      return (
        a.sourceNode === b.sourceNode &&
        a.targetNode === b.targetNode &&
        a.souce === b.souce &&
        a.target === b.target
      );
    });

    this.addEdges(newEdges, true);

    this.emit('table.canvas.expand');
  }

  collapse(nodeId) {
    let node = this.getNode(nodeId);
    if(!node) {
      return;
    }

    let oldEdges = this.getNeighborEdges(nodeId);
    let oldEdgesInfo = oldEdges.map((item) => {
      return item.options;
    });

    this.removeEdges(oldEdges, true);
    let newEdgesInfos = node._collapse(oldEdgesInfo);
    let newEdges = this.addEdges(newEdgesInfos, true);
    
    newEdges.forEach((item) => {
      item.collapse = true;
      item.sourceEndpoint.updatePos();
      item.targetEndpoint.updatePos();
      item.redraw();
    });
    this.emit('table.canvas.collapse');
  }

  focusChain(nodeId, pointId, addClass) {
    let chain = this._findChain(nodeId, pointId);
    chain.edges.forEach((item) => {
      item.focusChain(addClass);
    });
    chain.point.forEach((item) => {
      item.point.focusChain(addClass);
    });
    if (this._focusItem && addClass === 'focus-chain') {
      this.unfocusChain(this._focusItem.nodeId, this._focusItem.pointId, addClass);
    }
    if (addClass === 'focus-chain') {
      this._focusItem = {
        nodeId: nodeId,
        pointId: pointId
      }
    }
  }

  unfocusChain(nodeId, pointId, rmClass) {
    let chain = this._findChain(nodeId, pointId);
    chain.edges.forEach((item) => {
      item.unfocusChain(rmClass);
    });
    chain.point.forEach((item) => {
      item.point.unfocusChain(rmClass);
    });
  }

  focusItems(nodes = [], edges = []) {
    this.emit('custom.item.focus', {
      nodes,
      edges
    });
    nodes.forEach((item) => {
      item.focus();
    });
    edges.forEach((item) => {
      item.focus();
    });
  }

  _findChain(nodeId, pointId) {
    let resultPoints = [];
    let resultEdges = [];
    let queue = [{nodeId, pointId}];
    while(queue.length > 0) {
      let item = queue.pop();
      let hasExist = _.some(resultPoints, (point) => {
        return item.nodeId === point.id && item.pointId === point.point.id;
      });
      if (hasExist) {
        return;
      } else {
        let node = this.getNode(item.nodeId);
        let point = node.getEndpoint(item.pointId);
        resultPoints.push({
          node,
          point
        });
      }
      let targetEdge = this.getNeighborEdgesByEndpoint(item.nodeId, `${item.pointId}-left`);
      let sourceEdge = this.getNeighborEdgesByEndpoint(item.nodeId, `${item.pointId}-right`);
      targetEdge.forEach((edge) => {
        let node = edge.sourceNode;
        let point = node.getEndpoint(_.get(edge, 'sourceEndpoint.options.originId'));
        if (!point) {
          return;
        }
        let hasExist = _.some(resultPoints, (item) => {
          return item.node.id === edge.sourceNode.id && item.point.id === point.id;
        });
        if (!hasExist) {
          resultEdges.push(edge);
          queue.push({
            nodeId: edge.sourceNode.id,
            pointId: point.id
          });
        }
      });
      sourceEdge.forEach((edge) => {
        let node = edge.targetNode;
        let point = node.getEndpoint(_.get(edge, 'targetEndpoint.options.originId'));
        if (!point) {
          return;
        }
        let hasExist = _.some(resultPoints, (item) => {
          return item.node.id === edge.targetNode.id && item.point.id === point.id;
        });
        if (!hasExist) {
          resultEdges.push(edge);
          queue.push({
            nodeId: edge.targetNode.id,
            pointId: point.id
          });
        }
      });
    }
    return {
      edges: resultEdges,
      point: resultPoints
    }
  }

  unfocus() {
    if (this._focusItem && this._enableFocusChain) {
      this.unfocusChain(this._focusItem.nodeId, this._focusItem.pointId, 'focus-chain');
      this._focusItem = null;
    }
  }
};