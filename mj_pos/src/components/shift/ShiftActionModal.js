import React from 'react';
import { Modal, Row, Col, Input, Button, Icon, message } from 'antd';
import { connect } from 'dva';
import './ShiftActionModal.css';
import * as posService from '../../services/PosService';

class ShiftActionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            money: 0,
            loading: false
        }
    }

    focus() {
        this.input && this.input.focus();
    }

    componentWillReceiveProps(props) {
        if (props.modalVisible) {
            setTimeout(this.focus.bind(this));
        }
    }

    onOk(e) {
        var that = this;
        this.setState({ loading: true });
        posService.takePosCheck(this.state.money, {
            success: function (data) {
                var posCheckId = data.data.posCheckId;
                var loginInfo = window.mjGetLoginInfo();
                loginInfo.posCheckId = posCheckId;
                loginInfo.checkMessage = "";
                window.mjSetLoginInfo(loginInfo);
                that.setState({loading: false });
                that.props.onOk(e);
            },
            error: function (err) {
                message.warn(err);
                that.setState({ loading: false });
            }
        });
        
    }

    onCancel(e) {
        this.props.onCancel(e);
    }

    render() {
        var that = this;
        return (
            <Modal 
                title="进行接班"
                visible={this.props.modalVisible}
                maskClosable={false}
                destroyOnClose={true}
                footer={null}
                onCancel={this.onCancel.bind(this)}
            >
                <Input 
                    placeholder="请输入备用金额"
                    ref={(input) => { this.input = input; }} 
                    onChange={e => {
                        that.state.money = e.target.value;
                    }}
                    onPressEnter={e => {
                        that.onOk(e);
                    }}
                ></Input>
                <br/>
                <br/>
                <div style={{textAlign: "right"}}>
                    <Button type="primary" loading={this.state.loading} onClick={this.onOk.bind(this)}>接班</Button>
                </div>
            </Modal>
        );
    }
}

export default ShiftActionModal;