import React from 'react';
import { Modal, Row, Col, Button, Input, message } from 'antd';
import { connect } from 'dva';
import './PosOrderDiscountModal.css';
import * as posService from '../../services/PosService';
import MoneyValue from '../../utils/money';

class PosOrderDiscountModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            discount: props.discount,
            inputValue: "0.",
            moneyValue: ""
        }
    }

    focus() {
        this.input && this.input.focus();
    }

    componentWillReceiveProps(props) {
        setTimeout(this.focus.bind(this), 100);
    }

    onOk(discount) {
        this.props.onOk(discount);
    }

    onCancel(e) {
        this.props.onCancel(e);
    }

    getTitle() {
       return "整单打折(当前总价: ￥"+ this.props.price + ")";
    }

    buttonClick(value) {
        if (this.state.inputValue.length < 4) {
            var newValue = this.state.inputValue + value;
            this.setState({inputValue: newValue});
        }
    }

    onKeyDown(e) {
        if (e.keyCode == 13) {
            this.confirm();
        }
    }

    confirm() {
        if(this.state.inputValue == "0.") {
            Modal.warn({
                content: "请输入折扣!"
            });
            return;
        }
        var discount = (this.state.inputValue * 100).toFixed(0);
        this.setState({inputValue: "0."})
        this.onOk(discount);
    }

    render() {
        var that = this;
        return (
            <Modal
                title={this.getTitle()}
                visible={this.props.visible}
                maskClosable={false}
                destroyOnClose={true}
                footer={null}
                onCancel={this.onCancel.bind(this)}
            >
                 <div onKeyDown={this.onKeyDown.bind(this)}>
                     <Row>
                         <Input className="pos_order_discount_input"
                                ref={(input) => { this.input = input; }}
                                value={this.state.inputValue}
                                onChange={e=> {
                                    var value = e.currentTarget.value;
                                    if (value.length <= 2) {
                                        value = "0.";
                                    }
                                    if (value.length > 4) {
                                        value = value.substring(0, 4);
                                    }
                                    that.setState({inputValue: value});
                                }}
                         ></Input> 
                     </Row>
                    {/* <Row>
                        <Input className="pos_order_discount_input"
                            placeholder="手工定价"
                            ref={(moneyInput) => { this.moneyInput = moneyInput; }}
                            value={this.state.moneyInput}
                            onChange={e => {
                                var value = e.currentTarget.value;
                                that.setState({ moneyInput: value });
                            }}
                        ></Input>
                    </Row> */}
                     <Row style={{marginTop:"16px"}}>
                        <Col span={8}>
                            <div className="pos_order_discount_btn" onClick={e => {
                                 that.buttonClick(1);
                            }}>1</div>
                        </Col>
                        <Col span={8}>
                            <div className="pos_order_discount_btn" onClick={e => {
                                 that.buttonClick(2);
                            }}>2</div>
                        </Col>
                        <Col span={8}>
                            <div className="pos_order_discount_btn" onClick={e => {
                                 that.buttonClick(3);
                            }}>3</div>
                        </Col>
                    </Row>
                    
                    <Row style={{marginTop:"10px"}}>
                        <Col span={8}>
                            <div className="pos_order_discount_btn" onClick={e => {
                                 that.buttonClick(4);
                            }}>4</div>
                        </Col>
                        <Col span={8}>
                            <div className="pos_order_discount_btn" onClick={e => {
                                 that.buttonClick(5);
                            }}>5</div>
                        </Col>
                        <Col span={8}>
                            <div className="pos_order_discount_btn" onClick={e => {
                                 that.buttonClick(6);
                            }}>6</div>
                        </Col>
                    </Row>

                    <Row style={{marginTop:"10px"}}>
                        <Col span={8}>
                            <div className="pos_order_discount_btn" onClick={e => {
                                 that.buttonClick(7);
                            }}>7</div>
                        </Col>
                        <Col span={8}>
                            <div className="pos_order_discount_btn" onClick={e => {
                                 that.buttonClick(8);
                            }}>8</div>
                        </Col>
                        <Col span={8}>
                            <div className="pos_order_discount_btn" onClick={e => {
                                 that.buttonClick(9);
                            }}>9</div>
                        </Col>
                    </Row>

                    <Row style={{marginTop:"10px"}}>
                        <Col span={8}>
                            <div className="pos_order_discount_btn" onClick={e => {
                                 that.buttonClick(0);
                            }}>0</div>
                        </Col>
                        <Col span={8}>
                            <div className="pos_order_discount_btn" onClick={e => {
                                 that.buttonClick(".");
                            }}>.</div>
                        </Col>
                        <Col span={8}>
                            <div className="pos_order_discount_btn" onClick={e => {
                                 that.setState({inputValue: "0."});
                            }}>清除</div>
                        </Col>
                    </Row>

                    <Row style={{marginTop:"10px"}}>
                        <Col span={8}>
                            <div className="pos_order_discount_btn control" onClick={e => {
                                 that.setState({inputValue: "0."});
                                 that.props.onCancel(e);
                            }}>取消</div>
                        </Col>
                        <Col span={8}>
                            <div className="pos_order_discount_btn control" onClick={e => {
                                 that.setState({inputValue: "0."});
                                 that.onOk(100);
                            }}>取消打折</div>
                        </Col>
                        <Col span={8}>
                            <div className="pos_order_discount_btn control" style={{ "background": "#1ad450"}} onClick={e => {
                                 that.confirm();
                            }}>打折</div>
                        </Col>
                    </Row>
                </div>
            
            </Modal>
        );
    }
}

export default PosOrderDiscountModal;