import * as React from 'react';

import './index.less';

interface IProps {
  children: JSX.Element,
  title: JSX.Element
};

const Tooltip = (props: IProps) => {
  const {title, children} = props;
  
  if(!title) {
    return children;
  }

  return (
    <span className="react-visual-modeling-tooltip">
      <span className="react-visual-modeling-title">{title}</span>
      {children}
    </span>
  )
}

export default Tooltip;
