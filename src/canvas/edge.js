import $ from 'jquery';
import {Edge} from 'butterfly-dag';

import RightMenuGen from './right-menu';

export default class BaseEdge extends Edge {
  mounted() {
    // todo 这块可以优化
    this._createRightMenu();

    $(this.eventHandlerDom).on('dblclick',(e) => {
      e.preventDefault();
      e.stopPropagation();
      this.emit('custom.edge.dblClick',{
        edge: this
      });
    });
    $(this.labelDom).on('dblclick',(e) => {
      e.preventDefault();
      e.stopPropagation();
      this.emit('custom.edge.dblClick',{
        edge: this
      });
    });
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
    let labelRender = _.get(this, 'options._config.labelRender');

    if (sourceNode.status === 'collapse' && targetNode.status === 'collapse') {
      let container = $('<span class="butterflies-label visual-modeling-label butterflies-collapse-label">...</span>');
      container.on('click', this._showCollapseMoldal.bind(this));
      return container[0];
    }

    let dom = null;
    // 存在 labelRender 但是没有 label 的时候，需要 labelRender 拿到这个 dom 去渲染
    if(labelRender) {
      const span = document.createElement('span');
      span.className = 'visual-modeling-label';
      span.style.position = 'absolute';
      span.style.zIndex = 500;
      dom = span;
    } else if (label && typeof label === 'string') {
      let container = $('<span class="butterflies-label visual-modeling-label"></span>');
      container.text(label);
      dom = container[0];
    }

    $(dom).on('click', () => {
      this.emit('system.link.click', {
        edge: this
      });
    });

    return dom;
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

