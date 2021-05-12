'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import {Layout, Tooltip} from 'antd';
import TableBuilding from '../src/index.tsx';
import * as MockData from './mock_data/data.jsx';
import _ from 'lodash';

import 'antd/dist/antd.css';
import './index.less';

const {Header} = Layout;
const {columns, data} = MockData;

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.state = {
      columns: _.cloneDeep(columns),
      data: {}
    };
  }
  componentWillMount() {
    this._data = _.cloneDeep(data);
    this.setState({
      data: this._data
    });
    // setTimeout(() => {
    //   let newData = _.cloneDeep(this.state.data);
    //   newData.nodes.push({
    //     top: 300,
    //     left: 500,
    //     id: 'ggg',
    //     title: '我是新增的',
    //     fields: [{
    //       id: 'field_1',
    //       type: 'string',
    //       desc: '字段1'
    //     }, {
    //       id: 'field_2',
    //       type: 'string',
    //       desc: '字段2'
    //     }, {
    //       id: 'field_3',
    //       type: 'string',
    //       desc: '字段3'
    //     }]
    //   });
    //   this.setState({
    //     data: newData
    //   });
      // this._data = _.cloneDeep(data);
      // this._data.nodes[0].fields[0].type = 'bigint';
      // this._data.nodes[1].fields[0].type = 'bigint';
      // this._data.nodes[1].fields[2].desc = '更改后';
      // this.setState({
      //   data: this._data
      // });
      // console.log(this.canvas);

      // this.canvas.collapse('aaa');
    // }, 10000);
    // setTimeout(() => {
    //   this.canvas.expand('aaa');
    // }, 4000);
  }
  render() {
    return (
      <TableBuilding
        beforeLoad={(utils) => {
          // 自定义注册箭头
          const {Arrow} = utils;
          Arrow.registerArrow([{
            key: 'arrow1',
            type: 'svg',
            width: 14,
            height: 14,
            content: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMC4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg0NS4zNTQ2NjcgMjYuNDk2bDQ1LjQ4MjY2NiA3Mi4xOTJMMzAyLjEyMjY2NyA0NjkuMzMzMzMzSDkxNy4zMzMzMzN2ODUuMzMzMzM0SDM2MC40OTA2NjdsNTMwLjk0NCAzNzMuNjc0NjY2LTQ5LjA2NjY2NyA2OS43Ni02NDUuODAyNjY3LTQ1NC40IDM2LjUyMjY2Ny01Mi4wMTA2NjYtMzUuOTI1MzMzLTU3LjA0NTMzNEw4NDUuMzU0NjY3IDI2LjQ1MzMzM3oiIGZpbGw9IiNGNjY5MDIiIC8+PHBhdGggZD0iTTI3Ny4zMzMzMzMgNTEybS0xMjggMGExMjggMTI4IDAgMSAwIDI1NiAwIDEyOCAxMjggMCAxIDAtMjU2IDBaIiBmaWxsPSIjRjY2OTAyIiAvPjxwYXRoIGQ9Ik0yNzcuMzMzMzMzIDM0MS4zMzMzMzNhMTcwLjY2NjY2NyAxNzAuNjY2NjY3IDAgMSAxIDAgMzQxLjMzMzMzNCAxNzAuNjY2NjY3IDE3MC42NjY2NjcgMCAwIDEgMC0zNDEuMzMzMzM0eiBtMCA4NS4zMzMzMzRhODUuMzMzMzMzIDg1LjMzMzMzMyAwIDEgMCAwIDE3MC42NjY2NjYgODUuMzMzMzMzIDg1LjMzMzMzMyAwIDAgMCAwLTE3MC42NjY2NjZ6IiBmaWxsPSIjRkZCMjdCIiAvPjwvc3ZnPg=='
          }]);
        }}
        onLoaded={(canvas) => {
          this.canvas = canvas;
        }}
        nodeMenu={[{
          key: 'setting',
          title: '节点设置',
          onClick: (key, data) => {
            console.log('click setting')
          }
        }, {
          key: 'delete',
          render: (key, data) => {
            return <span>节点删除</span>
          },
          onClick: (key, data) => {
            console.log('delete node');
          }
        }]}
        edgeMenu={[{
          key: 'setting',
          title: '线段设置',
          onClick: (key, data) => {
            console.log('click setting')
          }
        }, {
          key: 'delete',
          render: (key, data) => {
            return <span>线段删除</span>
          },
          onClick: (key, data) => {
            console.log('delete node');
          }
        }]}
        columns={this.state.columns}
        data={this.state.data}
        emptyContent={
          <div className="empty-content">
            <p className="desc">暂无数据</p>
            <p
              className="add-field"
              onClick={(e) => {
                e.stopPropagation();
                console.log('自定义空状态');
              }}
            >+ 添加字段</p>
          </div>
        }
        config={{
          allowKeyboard: true,
          minimap: {
            enable: true,
            config: {
              nodeColor: 'rgba(216, 216, 216, 0.13)',
              activeNodeColor: '#F66902',
              viewportStyle: {
                'background-color': 'rgba(216, 216, 216, 0.07)'
              }
            }
          },
          collapse: {
            enable: true,
            // defaultMode: 'collapse'
          },
          titleRender: (title) => {
            return title;
          },
          titleExtIconRender: () => {
            return (
              <Tooltip title="自定义title ext icon">
                <i 
                  className="table-build-icon table-build-icon-iconfontxiaogantanhao"
                ></i>
              </Tooltip>
            );
          },
          labelRender: (label) => {
            return (
              <Tooltip title="自定义label">
                <span>test label</span>
              </Tooltip>
            )
          }
        }}
      />
    )
  }
}

ReactDOM.render((
  <Router>
    <Layout>
      <Header className='header'>DTDesign-React可视化建模组件</Header>
      <Layout>
        <Component/>
      </Layout>
    </Layout>
  </Router>
), document.getElementById('main'));
