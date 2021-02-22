'use strict';

import TableNode from './canvas/node';
import Edge from './canvas/edge';
import * as _ from 'lodash';

export let transformInitData = (info) => {
  let {columns, data, config, nodeMenu, edgeMenu} = info;
  let nodes = (data.nodes || []).map((item) => {
    return _.assign(item, {
      _columns: columns,
      _config: config,
      _menu: nodeMenu,
      Class: TableNode
    });
  });
  let edges = (data.edges || []).map((item) => {
    return _.assign(item, {
      id: `${item.source}-${item.target}`,
      type: 'endpoint',
      _config: config,
      _menu: edgeMenu,
      Class: Edge
    });
  })

  return {
    nodes,
    edges
  }
}

export let transformChangeData = (data) => {

}

export let diffPropsData = (newData, oldData, columns) => {
  let addNodes = _.differenceWith(newData.nodes, oldData.nodes, (a, b) => {
    return a.id === b.id;
  });
  let rmNodes = _.differenceWith(oldData.nodes, newData.nodes, (a, b) => {
    return a.id === b.id;
  });
  let addEdges = _.differenceWith(newData.edges, oldData.edges, (a, b) => {
    return (
      a.sourceNode === b.sourceNode &&
      a.targetNode === b.targetNode &&
      a.sourceEndpoint === b.sourceEndpoint &&
      a.targetEndpoint === b.targetEndpoint
    );
  });
  let rmEdges = _.differenceWith(oldData.edges, newData.edges, (a, b) => {
    return (
      a.sourceNode === b.sourceNode &&
      a.targetNode === b.targetNode &&
      a.sourceEndpoint === b.sourceEndpoint &&
      a.targetEndpoint === b.targetEndpoint
    );
  });
  let updateTitle = [];
  let addFields = [];
  let rmFields = [];
  let updateFields = [];
  (newData.nodes || []).forEach((newNode) => {
    let _addFields = [];
    let _rmFields = [];
    let _updateFields = [];
    let oldNode = _.find((oldData.nodes || []), (item) => {
      return newNode.id === item.id;
    });
    if (!oldNode) {
      return false;
    }
    // 表名有变化
    if (newNode.title !== oldNode.title) {
      updateTitle.push({
        nodeId: newNode.id,
        title: newNode.title
      });
    }
    // 列属性有变化
    let _primaryKey = _.find(columns, (item) => {
      return item.primaryKey;
    }).key;
    _addFields = _.differenceWith(newNode.fields, oldNode.fields, (a, b) => {
      return a[_primaryKey] === b[_primaryKey];
    });
    _rmFields = _.differenceWith(oldNode.fields, newNode.fields, (a, b) => {
      return a[_primaryKey] === b[_primaryKey];
    });
    newNode.fields.forEach((newField) => {
      let oldField = _.find(oldNode.fields, (item) => {
        return newField[_primaryKey] === item[_primaryKey];
      });
      if (!oldField) {
        return;
      }
      for(let i = 0; i < columns.length; i++) {
        let col = columns[i];
        if (!col.primaryKey && newField[col.key] !== oldField[col.key]) {
          _updateFields.push(newField);
          return;
        }
      }
    })

    _addFields.length > 0 && addFields.push({
      nodeId: newNode.id,
      fields: _addFields
    });
    _rmFields.length > 0 && rmFields.push({
      nodeId: newNode.id,
      fields: _rmFields
    });
    _updateFields.length > 0 && updateFields.push({
      nodeId: newNode.id,
      fields: _updateFields
    });
  });
  return {
    addNodes,
    rmNodes,
    addEdges,
    rmEdges,
    updateTitle,
    addFields,
    rmFields,
    updateFields
  };
}