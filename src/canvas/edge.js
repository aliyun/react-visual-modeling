'use strict';

import {Edge} from 'butterfly-dag';
import $ from 'jquery';
import * as ReactDOM from 'react-dom';
import RightMenuGen from './right-menu';

export default class BaseEdge extends Edge {
  mounted() {
    // todo 这块可以优化
    this._createRightMenu();
  }
  draw(obj) {
    let path = super.draw(obj);
    path.setAttribute('class', 'butterflies-link visual-modeling-link');
    return path;
  }
  drawArrow(arrow) {
    let path = super.drawArrow(arrow);
    if (path) {
      path.setAttribute('class', 'butterflies-arrow visual-modeling-arrow');
    }
    return path;
  }
  focus() {
    $(this.dom).addClass('focus');
    $(this.arrowDom).addClass('focus');
    $(this.labelDom).addClass('focus');
  }
  unfocus() {
    $(this.dom).removeClass('focus');
    $(this.arrowDom).removeClass('focus');
    $(this.labelDom).removeClass('focus');
  }
  focusChain(addClass = 'hover-chain') {
    $(this.dom).addClass(addClass);
    $(this.arrowDom).addClass(addClass);
    $(this.labelDom).addClass(addClass);
  }
  unfocusChain(rmClass = 'hover-chain') {
    $(this.dom).removeClass(rmClass);
    $(this.arrowDom).removeClass(rmClass);
    $(this.labelDom).removeClass(rmClass);
  }
  drawLabel(label) {
    let sourceNode = this.sourceNode;
    let targetNode = this.targetNode;
    if (sourceNode.status === 'collapse' && targetNode.status === 'collapse') {
      let container = $('<span class="butterflies-label visual-modeling-label butterflies-collapse-label">...</span>');
      container.on('click', this._showCollapseMoldal.bind(this));
      return container[0];
    }

    if (label) {
      let labelRender = _.get(this, 'options._config.labelRender');
      let container = $('<span class="butterflies-label visual-modeling-label"></span>');
      if (labelRender) {
        ReactDOM.render(
          labelRender(label, this.options),
          container[0]
        );
        return container[0];
      } else if (label) {
        container.text(label);
        return container[0];
      }
    }
  }
  isConnect() {
    if (this.sourceNode.id === this.targetNode.id) {
      return false;
    }
    return true;
  }
  // 右键菜单
  _createRightMenu() {
    let menus = _.get(this, 'options._menu', []);
    if (menus.length > 0) {
      $(this.eventHandlerDom).contextmenu((e) => {
        e.preventDefault();
        e.stopPropagation();
        RightMenuGen(this.dom, 'edge', [e.clientX, e.clientY], menus, this.options);
      })
    }
  }
  _showCollapseMoldal(e) {
    e.preventDefault();
    e.stopPropagation();
    this.emit('custom.edge.showCollapseInfo', {
      container: e.target,
      pos: [e.clientX, e.clientY],
      edge: this
    });
  }
}

