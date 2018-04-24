import React from 'react';
import { Row, Col, Input, Select, Spin, message} from 'antd';
import { connect } from 'dva';
import './PosSettleSignView.css';
import './PosSettleCommon.css'
import * as posService from '../../services/PosService';
const Option = Select.Option;

class PosSettleSignView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signList: [],
            signInfo: null,
            fetching: false,
            seatNo: props.seatNo,
            remark: props.remark,
        }
    }

    onSelect(value) {
        for (let i = 0; i < this.state.signList.length; i++) {
            var signInfo = this.state.signList[i];
            if (signInfo.payObjectId == value) {
                this.state.signInfo = signInfo;
                this.props.onUpdateInfo(this.state);
                break;
            }
        }
    }

    onFocus(e) {
        if (window.mjGetCacheData) {
            var list = window.mjGetCacheData("cache.all.customers");
            if (list) {
                var signList = JSON.parse(list);
                if (signList && signList.length > 0) {
                    this.setState({
                        signList: signList,
                    });
                }
            }
        }

        if (this.state.signList.length == 0) {
            this.setState({
                fetching: true
            });
            var that = this;
            posService.queryCustomerList({
                success: function (data) {
                    var signList = data.data;
                    that.setState({
                        signList: signList,
                        fetching: false
                    });
                },
                error: function (err) {
                    console.log(err);
                    message.warn(err);
                    that.setState({
                        fetching: false
                    });
                }
            });
        }
    }

    render() {
        var that = this;
        return (
            <div>
                <Row>
                    <span className="pos_settle_action_title">客户</span>
                    <Select
                        showSearch
                        style={{ width: "460px" }}
                        placeholder="选择客户"
                        optionFilterProp="children"
                        notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
                        onFocus={this.onFocus.bind(this)}
                        onSelect={this.onSelect.bind(this)}
                    >
                        {this.state.signList.map(d =>
                            <Option key={d.payObjectId}>
                                {d.name}
                            </Option>
                        )}
                    </Select>
                </Row>
                <Row>
                    <span className="pos_settle_action_title">桌号</span>
                    <Input
                        style={{ width: "460px" }}
                        ref={(input) => { this.seatInput = input; }}
                        defaultValue={this.state.seatNo}
                        onChange={event => {
                            var value = event.target.value;
                            that.state.seatNo = value;
                            that.props.onUpdateInfo(that.state);
                        }}
                        onPressEnter={e => {
                            that.remarkInput.focus();
                        }}
                    >
                    </Input>
                </Row>
                <Row>
                    <span className="pos_settle_action_title">备注</span>
                    <Input 
                        style={{ width: "460px" }}
                        ref={(input) => { this.remarkInput = input; }}
                        defaultValue={this.state.remark}
                        onChange={event => {
                            var value = event.target.value;
                            that.state.remark = value;
                            that.props.onUpdateInfo(that.state);
                        }}
                    ></Input>  
                </Row>
                
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
}

export default connect(mapStateToProps)(PosSettleSignView);