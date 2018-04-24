import React from 'react';
import { Row, Col, Input, Select } from 'antd';
import { connect } from 'dva';
import './PosSettleCommon.css'
const Option = Select.Option;

class PosSettleCashBarView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            proof: "",
            seatNo: props.seatNo,
            remark: props.remark
        }
    }

    render() {
        var that = this;
        return (
            <div>
                <Row>
                    <span className="pos_settle_action_title">支付凭证</span>
                    <Input
                        style={{ width: "420px" }}
                        ref={(input) => { this.input = input; }}
                        onChange={event => {
                            var value = event.target.value;
                            that.state.proof = value
                            that.props.onUpdateInfo(that.state);
                        }}
                        onPressEnter={e => {
                            that.seatInput.focus();
                        }}
                    ></Input>
                </Row>
                <Row>
                    <span className="pos_settle_action_title" style={{ marginRight: "42px" }}>桌号</span>
                    <Input
                        style={{ width: "420px" }}
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
                    <span className="pos_settle_action_title" style={{ marginRight: "42px" }}>备注</span>
                    <Input
                        style={{ width: "420px" }}
                        ref={(input) => { this.remarkInput = input; }}
                        defaultValue={this.state.remark}
                        onChange={event => {
                            var value = event.target.value;
                            that.state.remark = value;
                            that.props.onUpdateInfo(that.state);
                        }}>
                    </Input>
                </Row>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
}

export default connect(mapStateToProps)(PosSettleCashBarView);