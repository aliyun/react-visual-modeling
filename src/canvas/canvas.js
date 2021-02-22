'use strict';

import {Canvas} from 'butterfly-dag';
import CollapseMenuGen from './collapse-menu.jsx';

export default class TableCanvas extends Canvas {
  constructor(opts) {
    super(opts);
    this.attachEvent();
    this.originEdges = [];
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
    this.on('custom.endpoint.focus', (data) => {
      let point = data.point;
      this.focusChain(point.nodeId, point.id);
    });
    this.on('custom.endpoint.unfocus', (data) => {
      let point = data.point;
      this.unfocusChain(point.nodeId, point.id);
    });
    this.on('custom.node.expand', (data) => {
      this.expand(data.nodeId);
    });
    this.on('custom.node.collapse', (data) => {
      this.collapse(data.nodeId);
    });
    this.on('custom.edge.showCollapseInfo', (data) => {
      const {container, pos, edge} = data;
      CollapseMenuGen({
        container,
        pos,
        edge,
        originEdgesInfo: this.originEdges
      });
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
    //system.nodes.delete
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
  expand(nodeId) {
    let node = this.getNode(nodeId);
    if (node) {
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
    }
  }
  collapse(nodeId) {
    let node = this.getNode(nodeId);
    if (node) {
      let oldEdges = this.getNeighborEdges(nodeId);
      let oldEdgesInfo = oldEdges.map((item) => {
        return item.options;
      });
      this.removeEdges(oldEdges, true);
      let newEdges = node._collapse(oldEdgesInfo);
      this.addEdges(newEdges, true);
    }
  }
  focusChain(nodeId, pointId) {
    let chain = this._findChain(nodeId, pointId);
    if (chain.edges.length === 0) {
      return;
    }
    chain.edges.forEach((item) => {
      item.focusChain();
    });
    chain.point.forEach((item) => {
      item.point.focusChain();
    });
  }
  unfocusChain(nodeId, pointId) {
    let chain = this._findChain(nodeId, pointId);
    if (chain.edges.length === 0) {
      return;
    }
    chain.edges.forEach((item) => {
      item.unfocusChain();
    });
    chain.point.forEach((item) => {
      item.point.unfocusChain();
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
};