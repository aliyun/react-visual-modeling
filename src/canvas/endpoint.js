'use strict';

import {Endpoint} from 'butterfly-dag';
import $ from 'jquery';

class NewEndPoint extends Endpoint {
  constructor(opts) {
    super(opts);
  }
  attachEvent() {
    $(this.dom).on('mousedown', (e) => {
      const LEFT_KEY = 0;
      if (e.button !== LEFT_KEY) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (this.options._isNodeSelf) {
        this.emit('custom.endpoint.dragNode', {
          data: this
        });
      }
    });

    // todo: 高亮整条链路
    if (this.options._isNodeSelf) {
      $(this.dom).on('mouseover', (e) => {
        this.emit('custom.endpoint.focus', {
          point: this
        });
      });
  
      $(this.dom).on('mouseout', (e) => {
        this.emit('custom.endpoint.unfocus', {
          point: this
        });
      });
    }
  }
  focusChain() {
    $(this.dom).addClass('focus-chain');
    $(this.arrowDom).addClass('focus-chain');
  }
  unfocusChain() {
    $(this.dom).removeClass('focus-chain');
    $(this.arrowDom).removeClass('focus-chain');
  }
}

export default NewEndPoint;
