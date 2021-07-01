/**
 * 组件各项配置
 * @author gorgear<cctv1005s@gmail.com>
 */
import Edge from './canvas/edge';

// butterfly 默认配置
export const bfCfg = {
  disLinkable: false,
  linkable: true,
  draggable: true,
  zoomable: true,
  moveable: true,
  theme: {
    edge: {
      shapeType: 'AdvancedBezier',
      arrow: true,
      isExpandWidth: true,
      arrowPosition: 1,
      arrowOffset: 5,
      Class: Edge
    },
    endpoint: {
      expandArea: {
        left: 0,
        right: 0,
        top: 0,
        botton: 0
      }
    },
    autoFixCanvas: {
      enable: true,
      autoMovePadding: [20, 20, 20, 20]
    },
  }
};

export const actions = [
  {
    key: 'zoom-in',
    icon: 'table-build-icon table-build-icon-zoom-in',
    title: '放大',
    onClick: (canvas) => {
      canvas.zoom(canvas._zoomData + 0.1);
    }
  },
  {
    key: 'zoom-out',
    icon: 'table-build-icon table-build-icon-zoom-out',
    title: '缩小',
    onClick: (canvas) => {
      canvas.zoom(canvas._zoomData - 0.1);
    }
  },
  {
    key: 'fit',
    icon: 'table-build-icon table-build-icon-quanping2',
    title: '居中',
    onClick: (canvas) => {
      canvas.focusCenterWithAnimate(undefined, () => {
        console.log('complete!!!')
      });
    }
  }
];
