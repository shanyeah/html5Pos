import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';

var historyStack = new Array();

class BaseTipsView extends React.Component {
  constructor(props) {
    super(props);
  }

  errorListener(event) {
      // 监听加载页面 js 错误
      var reason = event.reason + "";
      if (reason.indexOf('Loading chunk') > 0) {
          message.error("网络异常,请稍候再试!");  
          // history.go(-1);
      }
  }

  componentDidMount() {
      if (!window['mjdjErrorListener']) {
          window.addEventListener('unhandledrejection', this.errorListener.bind(this));
          window['mjdjErrorListener'] = 1;
      }
  }

  componentDidUpdate() {
    if (this.props.msg) {
        if (this.props.msgType == 0) {
          message.error(this.props.msg);
        } else if (this.props.msgType == 1) {
          Message.info(this.props.msg);
        }
      }
  }

  render() {
    return <div timestamp={this.props.timestamp}></div>;
  }
}

function mapStateToProps(state) {
  const { msg, msgType, timestamp} = state.tips;
  return {
    msg,
    msgType,
    timestamp
  };
}

export default connect(mapStateToProps)(BaseTipsView);