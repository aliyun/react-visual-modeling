import $ from 'jquery';
import * as ReactDOM from 'react-dom';

const Tips = require('butterfly-dag').Tips;

let _genTipDom = (menuData, data) => {
  let dom = $('<div class="menu-container"></div>');
  menuData.forEach((item) => {
    let menuItem = $('<div class="menu-item"></div>');
    if (item.onClick) {
      menuItem.on('click', (e) => {
        item.onClick(item.key, data);
        if (item.closable) {
          Tips.closeMenu();
        }
      });
    }
    dom.append(menuItem);
    if (item.render) {
      ReactDOM.render(
        item.render(item.key, data),
        menuItem[0]
      );
    } else {
      menuItem.text(item.title || item.key);
    }
  });
  return dom[0]
}

export default (container, type, pos, menuData, data) => {
  Tips.createMenu({
    className: `butterfly-${type}-menu`,
    targetDom: container,
    genTipDom: () => { return _genTipDom(menuData, data) },
    placement: 'right',
    action: null,
    x: pos[0],
    y: pos[1],
    closable: true
  });
}