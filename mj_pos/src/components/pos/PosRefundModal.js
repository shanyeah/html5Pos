import React from 'react';
import { Modal, Row, Col, Input, Button, Table, message } from 'antd';
import { connect } from 'dva';
import './PosRefundModal.css';
import * as posService from '../../services/PosService';

class PosRefundModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {},
            data: { code: 999 },
            loading: false
        }
    }

    focus() {
        this.input && this.input.focus();
    }

    componentWillReceiveProps(props) {
        if (props.modalVisible) {
            this.state.params = props.params;
            setTimeout(this.focus.bind(this));
        }
    }

    refund() {
        this.setState({ loading: true });
        var that = this;
        var success = function (data) {
            that.setState({ data: data.data, loading: false });
            const modal = Modal.success({
                content: '退款成功!'
            });
            that.onOk(null);
        };
        var error = function (err) {
            const modal = Modal.warn({
                content: err
            });
            that.setState({ loading: false });
        };
        if (this.state.params.refundType == 0) {
            posService.refundGoodsSaleBill(that.state.params, {
                success: success,
                error: error
            });
        } else {
            posService.refundUserDepositBill(that.state.params, {
                success: success,
                error: error
            });
        }
        
    }

    onOk(e) {
        this.props.onOk(e);
    }

    onCancel(e) {
        this.setState({params:{}, data:{code:999}});
        this.props.onCancel(e);
    }

    render() {
        var that = this;
        return (
            <Modal
                title="退款"
                visible={this.props.modalVisible}
                maskClosable={false}
                destroyOnClose={true}
                footer={null}
                onCancel={this.onCancel.bind(this)}
            >
                <Input
                    placeholder="请输入退款说明"
                    ref={(input) => { this.input = input; }}
                    onChange={e => {
                        that.state.params.remark = e.target.value;
                    }}
                    onPressEnter={e => {
                        that.refund();
                    }}
                ></Input>
                <br />
                <br />
                <div style={{ textAlign: "right" }}>
                    <Button type="primary" loading={this.state.loading} onClick={this.refund.bind(this)}>退款</Button>
                </div>
            </Modal>
        );
    }
}

export default PosRefundModal;