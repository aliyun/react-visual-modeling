import * as _ from 'lodash';
import * as React from 'react';

import {actions} from '../config';
import Tooltip from './tooltip/index';

export interface action {
  key: string,                                      // 唯一表示
  icon: string | JSX.Element,                       // 图标
  title?: string;                                   // 提示
  onClick: (canvas: any) => void;                   // 点击响应函数
  disable: boolean;                                 // 是否禁用
}

interface IProps {
  canvas: any;                                      // 画布实例
  actionMenu: action[];                             // action菜单
  visible: boolean;                                 // 是否可见
}

const ActionMenu = (props: IProps) => {
  let {canvas, actionMenu = [], visible} = props;

  if(!visible) {
    return null;
  }

  if(!Array.isArray(actionMenu)) {
    actionMenu = [];
  }

  // 合并action菜单
  let sysActions = _.cloneDeep(actions);
  const allActions = [];

  for(let action of actionMenu) {
    const sysAction = _.find(sysActions, (a) => {
      return a.key === action.key
    });

    if(!sysAction) {
      allActions.push(action);

      continue;
    }

    // 合并用户同名 key
    _.merge(sysAction, action);
    allActions.push(sysAction);
    
    // 移除用户覆盖的 action
    sysActions = sysActions.filter(action => action.key !== sysAction.key);
  }

  sysActions.forEach(sysAction => {
    allActions.unshift(sysAction);
  });

  // 兼容多类型图标渲染
  const renderIcon = (icon) => {
    if(typeof icon === 'string') {
      return <i className={icon} />
    }

    if(React.isValidElement(icon)) {
      return icon;
    }

    return null;
  }

  return (
    <div className='table-build-canvas-action'>
      {
        allActions.map(action => {
          if(action.disable) {
            return null;
          }

          return (
            <div 
              key={action.key} 
              title={action.title}
              onClick={() => action.onClick(canvas)}
            >
              <Tooltip title={action.title}>
                {renderIcon(action.icon)}
              </Tooltip>
            </div>
          )
        })
      }
    </div>
  );
}

export default ActionMenu;
