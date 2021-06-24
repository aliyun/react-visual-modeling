import * as _ from 'lodash';

import Edge from './canvas/edge';
import TableNode from './canvas/node';

export const transformInitData = (info) => {
  let {
    columns, data, config,
    nodeMenu, edgeMenu, emptyContent,
    emptyWidth
  } = info;

  let nodes = (data.nodes || []).map((item) => {
    return _.assign(item, {
      _columns: columns,
      _config: config,
      _menu: nodeMenu,
      Class: TableNode,
      _emptyWidth: emptyWidth,
      _emptyContent: emptyContent
    });
  });

  let edges = (data.edges || []).map((item) => {
    return _.assign(item, {
      id: `${item.sourceNode}-${item.source}-${item.targetNode}-${item.target}`,
      type: 'endpoint',
      _config: config,
      _menu: edgeMenu,
      Class: Edge,
      label: item.label,
    });
  });

  return {
    nodes,
    edges
  }
}

export const diffPropsData = (newData, oldData, options) => {
  const isSameNode = (a, b) => a.id === b.id;
  let addNodes = _.differenceWith(newData.nodes, oldData.nodes, isSameNode);
  let rmNodes = _.differenceWith(oldData.nodes, newData.nodes, isSameNode);

  const isSameEdge = (a, b) => {
    return (
      a.sourceNode === b.sourceNode &&
      a.targetNode === b.targetNode &&
      a.source === b.source &&
      a.target === b.target
    );
  }

  const isSameLabel = (a, b) => {
    if(typeof a === 'string') {
      return a === b;
    }

    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch (e) {
      return a === b;
    }
  }

  let addEdges = _.differenceWith(newData.edges, oldData.edges, isSameEdge);
  let rmEdges = _.differenceWith(oldData.edges, newData.edges, isSameEdge);

  // 线段的label有变化
  let updateLabel = [];
  newData.edges.forEach((a) => {
    let edge = _.find(oldData.edges, (b) => {
      return isSameEdge(a, b);
    });

    if(!edge) {
      return;
    }

    if(isSameLabel(a.label, edge.label)) {
      return;
    }

    updateLabel.push({
      edge,
      label: a.label
    });
  });

  let updateTitle = [];
  let addFields = [];
  let rmFields = [];
  let updateFields = [];
  let newCol = [];
  let columns = options.newCol;

  // columns有变化
  let addCol = _.differenceWith(options.newCol, options.oldCol, (a, b) => a.key === b.key);
  let oldCol = _.differenceWith(options.oldCol, options.newCol, (a, b) => a.key === b.key);

  if (addCol.length !== 0 || oldCol.length !== 0) {
    newCol = options.newCol;
  }

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
    updateLabel,
    updateTitle,
    addFields,
    rmFields,
    updateFields,
    newCol
  };
}