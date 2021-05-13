import $ from 'jquery';
import {Endpoint} from 'butterfly-dag';

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
      this.emit('custom.endpoint.focus', {
        point: this
      });
    });

    // todo: 高亮整条链路
    if (this.options._isNodeSelf) {
      $(this.dom).on('mouseover', (e) => {
        this.emit('custom.endpoint.hover', {
          point: this
        });
      });
  
      $(this.dom).on('mouseout', (e) => {
        this.emit('custom.endpoint.unHover', {
          point: this
        });
      });
    }
  }
  focusChain(addClass) {
    $(this.dom).addClass(addClass);
    $(this.arrowDom).addClass(addClass);
  }
  unfocusChain(rmClass) {
    $(this.dom).removeClass(rmClass);
    $(this.arrowDom).removeClass(rmClass);
  }
}

export default NewEndPoint;
