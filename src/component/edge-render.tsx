import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IProps {
  canvas: any;
  labelRender: (label: any, edge: any) => JSX.Element;
}

const EdgeRender = (props: IProps) => {
  const {canvas, labelRender} = props;

  if (!canvas) {
    return null;
  }

  if (!canvas.edges) {
    return null;
  }

  return canvas.edges.map(edge => {
    if(!edge || !edge.labelDom) {
      return null;
    }

    return (
      ReactDOM.createPortal(
        labelRender(edge.label, edge),
        edge.labelDom
      )
    )
  })
}

export default EdgeRender;
