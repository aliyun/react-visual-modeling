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
  componentDidMount() {
    this._data = _.cloneDeep(data);
    this.setState({
      data: this._data
    });
    setTimeout(() => {
      // this._data = _.cloneDeep(data);
      // this._data.nodes[0].fields[0].type = 'bigint';
      // this._data.nodes[1].fields[0].type = 'bigint';
      // this._data.nodes[1].fields[2].desc = '更改后';
      // this.setState({
      //   data: this._data
      // });
      // console.log(this.canvas);

      // this.canvas.collapse('aaa');
    }, 2000);
    // setTimeout(() => {
    //   this.canvas.expand('aaa');
    // }, 4000);
  }
  render() {
    return (
      <TableBuilding
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
