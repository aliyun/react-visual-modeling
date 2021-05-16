import React from 'react';
import {StarOutlined} from '@ant-design/icons';

// 节点菜单
export const nodeMenu = [
  {
    key: 'setting',
    title: '节点设置',
    onClick: (key, data) => {
      console.log('click setting')
    }
  }, 
  {
    key: 'delete',
    render: (key, data) => {
      return <span>节点删除</span>
    },
    onClick: (key, data) => {
      console.log('delete node');
    }
  }
];

// 边菜单
export const edgeMenu= [
  {
    key: 'setting',
    title: '线段设置',
    onClick: (key, data) => {
      console.log('click setting')
    }
  },
  {
    key: 'delete',
    render: (key, data) => {
      return <span>线段删除</span>
    },
    onClick: (key, data) => {
      console.log('delete node');
    }
  }
];

export const actionMenu = [
  {
    key: 'zoom-in',
    disable: true
  },
  {
    icon: <StarOutlined />,
    key: 'star',
    onClick: () => {
      alert('点击收藏！')
    }
  }
]