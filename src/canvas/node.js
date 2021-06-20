import $ from 'jquery';
import * as _ from 'lodash';
import { Node } from 'butterfly-dag';
import * as ReactDOM from 'react-dom';

import emptyDom from './empty';
import Endpoint from './endpoint';
import RightMenuGen from './right-menu';

export default class TableNode extends Node {
  constructor(opts) {
    super(opts);

    this.fieldsList = [];

    // 每列宽度
    this.COLUMN_WIDTH = 60;
    this.status = 'expand';
    this.emptyDataTree = undefined;
  }

  draw(obj) {
    let _dom = obj.dom;
    if (!_dom) {
      _dom = $('<div></div>')
        .attr('class', 'node table-node')
        .attr('id', obj.name);
    }
    const node = $(_dom);
    // 计算节点坐标
    if (obj.top !== undefined) {
      node.css('top', `${obj.top}px`);
    }
    if (obj.left !== undefined) {
      node.css('left', `${obj.left}px`);
    }

    this._createTableTitle(node);
    this._createExtIcon(node);
    this._createFields(node);
    return node[0];
  }

  mounted() {
    // 生成field的endpoint
    this._createNodeEndpoint();

    if (this.fieldsList.length === 0) {
      $(this.dom).find('.title').css('width', this.options._emptyWidth || 150);
    }

    $(this.dom).on('dblclick', (e) => {
      this.emit('system.node.dblClick', {
        node: this
      });
    });
    // 生成右键菜单
    this._createRightMenu();
  }

  focus() {
    $(this.dom).addClass('focus');
    this.options.minimapActive = true;
  }

  unfocus() {
    $(this.dom).removeClass('focus');
    this.options.minimapActive = false;
  }

  _expand() {
    if (this.status === 'expand') {
      console.warn(`节点${this.id}已经是展开状态`)
      return;
    }

    // 清除新锚点
    this._rmTitleEndpoint();

    // 隐藏字段
    this.fieldsList.forEach((item) => {
      $(item.dom).css('display', 'flex');
      let points = [
        this.getEndpoint(item.id),
        this.getEndpoint(`${item.id}-left`),
        this.getEndpoint(`${item.id}-right`),
      ]

      points.forEach((item) => {
        item.updatePos();
      });
    });

    // 记录状态
    this.status = 'expand';
    // 改变伸缩状态
    $(this.dom).removeClass('collapse');
  }

  _collapse(oldEdges) { 
    if (this.status === 'collapse') {
      console.warn(`节点${this.id}已经是收缩状态`)
      return;
    }
    // 生成新锚点
    this._createTitleEndpoint();
    // 隐藏字段
    this.fieldsList.forEach((item) => {
      $(item.dom).css('display', 'none');
    });
    // 记录状态
    this.status = 'collapse';
    // 改变伸缩状态
    $(this.dom).addClass('collapse');

    // 生成新线段,并去重
    let newEdges = [];
    oldEdges.forEach((item) => {
      let updateObj = {};
      if (item.sourceNode === this.id) {
        updateObj['source'] = `${this.id}-right`;
      } else if (item.targeNode = this.id) {
        updateObj['target'] = `${this.id}-left`;
      }

      let newEdgeObj = _.assign({}, item, updateObj);

      let hasExist = _.some(newEdges, (item) => {
        return (
          newEdgeObj.sourceNode === item.sourceNode &&
          newEdgeObj.source === item.source &&
          newEdgeObj.targetNode === item.targetNode &&
          newEdgeObj.target === item.target
        )
      });
      if (!hasExist) {
        newEdges.push(newEdgeObj);
      }
    });

    return newEdges;
  }
  _createTableTitle(container = this.dom) {
    let title = _.get(this, 'options.title');
    let titleRender = _.get(this, 'options._config.titleRender');
    let titleDom = $(`<div class="title"></div>`);
    $(container).append(titleDom);
    if (title) {
      if (titleRender) {
        let titleTextDom = $(`<div class="title-text"></div>`);
        $(titleDom).append(titleTextDom);
        ReactDOM.render(
          titleRender(title, this.options),
          titleTextDom[0],
          () => {
            this._updateEndpointPos();
          }
        );
      } else {
        let titleTextDom = $(`<div class="title-text">${title}</div>`);
        $(titleDom).append(titleTextDom);
      }
    }
  }
  _createExtIcon(container = this.dom) {
    let titleDom = $(container).find('.title');
    let titleIcon = $('<span class="title-icon-con"></span>');
    // 展开收缩icon
    let collapseIcon = $('<i class="table-build-icon table-build-icon-xiala"></i>');
    collapseIcon.on('click', (e) => {
      if (this.status === 'collapse') {
        this.emit('custom.node.expand', {
          nodeId: this.id
        });
      } else {
        this.emit('custom.node.collapse', {
          nodeId: this.id
        });
      }
    });
    titleIcon.append(collapseIcon);
    // 删除icon
    let deleteIcon = $('<i class="table-build-icon table-build-icon-canvas-cuo"></i>');
    deleteIcon.on('click', (e) => {
      this.emit('custom.node.delete', {
        node: this
      });
    });
    titleIcon.append(deleteIcon);
    let extIcon = $('<span class="title-ext-icon"></span>');
    let titleIconRender = _.get(this, 'options._config.titleExtIconRender');
    if (titleIconRender) {
      titleIcon.prepend(extIcon);
      ReactDOM.render(
        titleIconRender(this.options),
        extIcon[0]
      );
    }
    titleDom.append(titleIcon);
  }
  _createFields(container = this.dom, fieldList) {
    let fields = fieldList || _.get(this, 'options.fields');
    let coloums = _.get(this, 'options._columns', []);
    let _primaryKey = _.get(coloums, '[0].key');

    if (fields && fields.length) {
      return fields.map((_field) => {
        let fieldDom = $('<div class="field"></div>');
        coloums.forEach((_col) => {
          if (_col.render) {
            let fieldItemDom = $(`<span class="field-item"></span>`);
            fieldItemDom.css('width', (_col.width || this.COLUMN_WIDTH) + 'px').attr('dataType', _col.key);
            fieldDom.append(fieldItemDom);
            ReactDOM.render(
              _col.render(_field[_col.key], _field),
              fieldItemDom[0]
            );
          } else {
            let fieldItemDom = $(`<span class="field-item">${_field[_col.key]}</span>`);
            fieldItemDom.css('width', (_col.width || this.COLUMN_WIDTH) + 'px').attr('dataType', _col.key);
            fieldDom.append(fieldItemDom);
          }
          if (_col.primaryKey) {
            _primaryKey = _col.key;
          }
        });
        let leftPoint = $('<div class="point left-point"></div>');
        let rightPoint = $('<div class="point right-point"></div>');
        fieldDom.append(leftPoint).append(rightPoint);
        container.append(fieldDom);
        let _newFieldItem = {
          id: _field[_primaryKey],
          dom: fieldDom
        };
        this.fieldsList.push(_newFieldItem);
        return _newFieldItem;
      });
    } else {
      if(this.emptyDataTree){
        return this.emptyDataTree;
      }
      const _emptyContent = _.get(this.options, '_emptyContent');
      const noDataCon = $('<div></div>');
      container.append(noDataCon);
      const noDataTree = emptyDom({
        content: _emptyContent,
        container: noDataCon,
        width: this.options._emptyWidth
      });
      container.append(noDataTree);
      const _newFieldItem = {
        id: 0,
        __type: 'no-data',
        dom: noDataTree
      };
      this.emptyDataTree = [_newFieldItem];
      return [_newFieldItem];
    }
  }
  _createNodeEndpoint(fieldList) {
    let _fieldList = (fieldList || this.fieldsList);
    _fieldList.forEach((item) => {
      this.addEndpoint({
        id: item.id,
        type: 'onlyConnect',
        _isNodeSelf: true,
        dom: item.dom[0],
        Class: Endpoint
      });
      this.addEndpoint({
        id: item.id + '-right',
        originId: item.id,
        orientation: [1,0],
        type: 'source',
        _isNodeSelf: false,
        dom: $(item.dom).find('.right-point')[0],
        Class: Endpoint,
        linkable: false,
        disLinkable: false
      });
      this.addEndpoint({
        id: item.id + '-left',
        originId: item.id,
        orientation: [-1,0],
        type: 'target',
        _isNodeSelf: false,
        dom: $(item.dom).find('.left-point')[0],
        Class: Endpoint,
        linkable: false,
        disLinkable: false
      });
    });
  }
  _rmNodeEndpoint(ids) {
    ids.forEach((id) => {
      this.removeEndpoint(id);
    })
  }
  _updateTitle(newTitle) {
    if (newTitle !== this.options.title) {
      this.options.title = newTitle;
      let titleTextDom = $(this.dom).find('.title-text');
      let titleRender = _.get(this, 'options._config.titleRender');
      if (titleRender) {
        ReactDOM.unmountComponentAtNode(titleTextDom[0]);
        ReactDOM.render(
          titleRender(newTitle),
          titleTextDom[0],
          () => {
            this._updateEndpointPos();
          }
        );
      } else {
        titleTextDom.text(newTitle);
      }
    }
  }

  _addFields(fields) {
    $(this.dom).find('.no-data').remove();
    this.emptyDataTree = undefined;
    let _newFieldsList = this._createFields($(this.dom), fields);
    if (_newFieldsList.length >= 1 && _.get(_newFieldsList, ['0', '__type']) !== 'no-data') {
      this._createNodeEndpoint(_newFieldsList);
    }
  }

  _rmFields(fields = this.fieldsList) {
    // 寻找primaryKey
    let columns = _.get(this, 'options._columns', []);
    let _primaryKey = columns[0].key;
    columns.forEach((col) => {
      if (col.primaryKey) {
        _primaryKey = col.key;
      }
    });
    // 删除field
    let ids = [];
    fields.forEach((field) => {
      ids = ids.concat([field.id, `${field.id}-left`, `${field.id}-right`]);
    });
    ids.forEach((id) => {
      this.removeEndpoint(id);
      this.fieldsList = this.fieldsList.filter((item) => {
        return id !== item.id;
      });
      this.options.fields = (this.options.fields || []).filter((item) => {
        return id !== item[_primaryKey];
      });
    });
  }

  _updateFields(fields) {
    let columns = _.get(this, 'options._columns', []);
    let _primaryKey = _.find(columns, (item) => {
      return item.primaryKey;
    }).key;
    fields.forEach((newField) => {
      let oldFieldInfo = _.find(this.options.fields || [], (item) => {
        return newField[_primaryKey] === item[_primaryKey];
      });
      let oldFieldItem = _.find(this.fieldsList || [], (item) => {
        return newField[_primaryKey] === item.id;
      });
      if (!oldFieldInfo || !oldFieldItem) {
        return;
      }
      columns.forEach((col) => {
        let targetDom = $(oldFieldItem.dom).find(`[dataType="${col.key}"]`);
        if (col.render) {
          ReactDOM.unmountComponentAtNode(targetDom[0]);
          ReactDOM.render(
            col.render(newField[col.key], newField),
            targetDom[0]
          );
        } else {
          $(targetDom).text(newField[col.key]);
        }
      })
    });
  }

  // 更新col
  _updateCol(newCol) {
    let fields = this.fieldsList;
    let ids = [];
    fields.forEach((field) => {
      ids = ids.concat([field.id, `${field.id}-left`, `${field.id}-right`]);
    });
    ids.forEach((id) => {
      this.removeEndpoint(id);
    });
    this.fieldsList = [];
    _.set(this, 'options._columns', newCol);
    this._addFields();

  }

  _createTitleEndpoint() {
    let titleDom = $(this.dom).find('.title');
    let leftPoint = $('<div class="point left-point"></div>');
    let rightPoint = $('<div class="point right-point"></div>');
    titleDom.append(leftPoint).append(rightPoint);

    this.addEndpoint({
      id: this.id + '-right',
      orientation: [1,0],
      type: 'source',
      _isNodeSelf: false,
      dom: rightPoint[0],
      Class: Endpoint,
      linkable: false,
      disLinkable: false
    });
    this.addEndpoint({
      id: this.id + '-left',
      orientation: [-1,0],
      type: 'target',
      _isNodeSelf: false,
      dom: leftPoint[0],
      Class: Endpoint,
      linkable: false,
      disLinkable: false
    });
  }

  _rmTitleEndpoint() {
    this.removeEndpoint(`${this.id}-left`);
    this.removeEndpoint(`${this.id}-right`);
  }

  // 右键菜单
  _createRightMenu() {
    let menus = _.get(this, 'options._menu', []);
    if (menus.length > 0) {
      $(this.dom).contextmenu((e) => {
        e.preventDefault();
        e.stopPropagation();
        RightMenuGen(this.dom, 'node', [e.clientX, e.clientY], menus, this.options);
      })
    }
  }

  _updateEndpointPos() {
    (this.endpoints || []).forEach((item) => {
      item.updatePos();
    });
  }
};