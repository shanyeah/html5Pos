import React from 'react';
import { Row, Col, Input } from 'antd';
import { connect } from 'dva';
import './PosSettleCashView.css';
import './PosSettleCommon.css'
import MoneyValue from '../../utils/money';

class PosSettleCashView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payAmount: props.billData.payAmount,
            inputValue: 0,
            changeMoney: 0,
            seatNo: props.seatNo,
            remark: props.remark
        }
    }

    getStatusText() {
        if (this.state.changeMoney > 100) {
            return "输入金额不能多于实付金额 100 元";
        }
        return "";
    }

    focus() {
        this.input && this.input.focus();
    }

    componentDidMount() {
        setTimeout(this.focus.bind(this));
    }

    render() {
        var that = this;
        return (
            <div>
                <Row className='pos_settle_row'>
                    <Col span={12}>
                        <span className="pos_settle_action_title">现金</span>    
                        <Input
                          ref={(input) => { this.input = input; }} 
                          style={{width:"200px"}}
                          onChange={event => {
                              var value = event.target.value;
                              var changeMoney = MoneyValue(value - that.state.payAmount);
                              if (changeMoney < 0) {
                                  changeMoney = 0;
                              }
                              that.state.inputValue = value;
                              that.state.changeMoney = changeMoney;
                              that.props.onUpdateInfo(that.state);
                          }}
                          onPressEnter={e => {
                                that.seatInput.focus();
                          }}
                        ></Input>

                    </Col>
                    <Col span={12}>
                        <span className="pos_settle_action_title">找零</span>
                        <Input
                            disabled={true}
                            style={{ width: "200px", color:"red" }}
                            value={this.state.changeMoney}
                        ></Input>
                    </Col>
                </Row>
                <Row>
                    <span className="pos_settle_action_title">桌号</span>
                    <Input
                        style={{ width: "462px" }}
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
                        style={{width:"462px"}}
                        ref={(input) => { this.remarkInput = input; }} 
                        defaultValue={this.state.remark}
                        onChange={event => {
                            var value = event.target.value;
                            that.state.remark = value;
                            that.props.onUpdateInfo(that.state);
                        }}
                    ></Input>
                </Row>
                <div className="pos_settle_cash_status">{this.getStatusText()}</div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps)(PosSettleCashView);