import React from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import {Layout, Tooltip} from 'antd';
import {BrowserRouter as Router} from 'react-router-dom';

import TableBuilding from '../src/index.tsx';
import {nodeMenu, edgeMenu, actionMenu} from './menu';
import * as MockData from './mock_data/data.jsx';

import 'antd/dist/antd.css';
import './index.less';

const {Header} = Layout;
const {columns, data} = MockData;

const config = {
  // butterfly-dag 属性
  butterfly:{
    theme:{
      edge: {
        // shapeType: 'Manhattan',
      }
    },
  },

  // 网格布局
  gridMode: {
    theme: {
      shapeType: 'circle',     // 展示的类型，支持line & circle
      gap: 20,                 // 网格间隙
      circleRadiu: 1.5,        // 圆点半径
      circleColor: 'rgba(255, 255, 255, 0.08)',    // 圆点颜色
    }
  },

  // 键盘事件
  allowKeyboard: true,

  // 小地图相关
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

  // 是否表格可折叠
  collapse: {
    enable: true,
    showCollapseDetail: true
  },
  titleRender: (title) => {
    return title;
  },
  titleExtIconRender: () => {
    return (
      <Tooltip title="自定义title ext icon">
        <i 
          className="table-build-icon table-build-icon-iconfontxiaogantanhao"
        />
      </Tooltip>
    );
  },
  labelRender: (label) => {
    if(!label) {
      return 'connection';
    }

    return (
      <Tooltip title="自定义label">
        {label}
      </Tooltip>
    )
  }
};

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.state = {
      columns: _.cloneDeep(columns),
      data: {},
      selectable: false,
      collapse: false
    };
  }

  componentWillMount() {
    this._data = _.cloneDeep(data);
    this.setState({
      data: this._data
    });
  }

  onAddEdge = () => {
    const data = this.state.data;

    data.edges.push({
      "id": 1,
      "sourceNode": "aaa",
      "targetNode": "bbb",
      "source": "field_1",
      "target": "field_2"
    });

    this.setState({
      data: {...data}
    });
  }

  onDelEdge = () => {
    const data = this.state.data;
    data.edges.pop();

    this.setState({
      data: {...data}
    });
  }

  onSetGridMode = () => {
    this.setState({
      selectable: true
    });
  }

  render() {
    const {selectable} = this.state;

    return (
      <TableBuilding
        // =========== 画布事件 ===========
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
          canvas.on('events', (data) => {
            // console.log(data);
          });
        }}

        // =========== 节点Table相关属性 ===========
        columns={this.state.columns}
        data={this.state.data}
        onDblClickNode={(node) => {}}
        emptyContent={
          <div className="empty-content">
            <p className="desc">暂无数据</p>
            <p
              className="add-field"
              onClick={(e) => {
                e.stopPropagation();
                console.log('自定义空状态');
              }}
            >
              + 添加字段
            </p>
          </div>
        }

        // =========== 菜单相关属性 ===========
        nodeMenu={nodeMenu}
        edgeMenu={edgeMenu}
        actionMenu={actionMenu({
          onAddEdge: this.onAddEdge,
          onDelEdge: this.onDelEdge,
          onSetGridMode: this.onSetGridMode
        })}

        // =========== 画布配置 ===========
        config={{
          ...config,
          collapse: {
            status: this.state.collapse,
            showCollapseDetail: true
          }
        }}

        // =========== 框选配置 ===========
        selectable={selectable}
        onSelect={() => {
          this.setState({
            selectable: false
          })
        }}

        beforeDeleteNode={(nodes) => {
          // 返回false或者Promise.reject则不会删除
        }}
        beforeDeleteEdge={(edges) => {
          console.log(edges);
          // 返回false或者Promise.reject则不会删除
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
