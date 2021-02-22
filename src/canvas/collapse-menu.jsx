'use strict';
import $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ButterflyDataMapping from 'react-data-mapping';
import 'react-data-mapping/dist/index.css';

const Tips = require('butterfly-dag').Tips;

let _genTipDom = (result) => {
  let dom = $('<div class="menu-container"></div>');
  let title = $('<p class="menu-title">连接详情</p>');
  let content = $('<div class="menu-content"></div>')
  let canvas = (
    <ButterflyDataMapping 
      columns={result.columns}
      sourceData={result.sourceData}
      targetData={result.targetData}
      mappingData={result.mappingData}
      width={250}
      height={'auto'}
      delayDraw={1000}
      config={{
        extraPos: {
          paddingCenter: 50
        }
      }}
    />
  );
  ReactDOM.render(
    canvas,
    content[0]
  );
  dom.append(title).append(content);
  return dom[0]
}

let transformData = (currentEdge, originEdgesInfo) => {
  let sourceNode = currentEdge.sourceNode;
  let targetNode = currentEdge.targetNode;
  let columns = (sourceNode.options._columns || []).filter((item) => {
    return item.primaryKey;
  });
  let links = originEdgesInfo.filter((item) => {
    return item.sourceNode === sourceNode.id && item.targetNode === targetNode.id;
  });
  let sourceData = {
    title: sourceNode.id,
    fields: sourceNode.options.fields
  };
  let targetData = {
    title: targetNode.id,
    fields: targetNode.options.fields
  };
  let mappingData = links.map((item) => {
    return {
      source: item.source,
      target: item.target
    }
  });
  return {
    columns,
    sourceData,
    targetData,
    mappingData
  }
}

export default (opts) => {
  const {container, pos, edge, originEdgesInfo} = opts;
  let result = transformData(edge, originEdgesInfo);
  Tips.createMenu({
    className: 'visual-modeling-collapse-menu',
    targetDom: container,
    genTipDom: () => { return _genTipDom(result) },
    placement: 'right',
    action: null,
    x: pos[0],
    y: pos[1],
    closable: true
  }, (dom) => {
    setTimeout(() => {
      const info = {
        top: $(container).offset().top,
        left: $(container).offset().left,
        width: $(container).outerWidth(),
        height: $(container).outerHeight(),
        actualWidth: $(dom).outerWidth(),
        actualHeight: $(dom).outerHeight()
      };
      let top = pos[1] - info.actualHeight / 2 - info.height / 2 + 9;
      let left = pos[0] + info.width - 12;
      $(dom).css({
        top: top,
        left: left
      });
    }, 100)
  });
}
