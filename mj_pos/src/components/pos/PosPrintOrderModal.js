import React from 'react';
import { Modal, Row, Col, Button, message } from 'antd';
import { connect } from 'dva';
import './PosPrintOrderModal.css';
import * as posService from '../../services/PosService';

class PosPrintOrderModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderType: props.orderType,
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            orderType: props.orderType,
        });
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
       
    }

    print(tag) {
        var saleBillId = this.props.orderRecord.saleBillId;
        if(this.state.orderType == 0){
            if (window.mjPrintSaleBill) window.mjPrintSaleBill(1, tag, saleBillId);
        }else{
            if(window.mjPrintRechargeBill)window.mjPrintRechargeBill(0, 0, saleBillId);
        }
    }

    onOk(e) {
        this.props.onOk(e);
    }

    onCancel(e) {
        this.props.onCancel(e);
    }

    getTitle() {
        var title = "补打销售单 ";
        if (this.props.orderRecord.orderNo) {
            title += this.props.orderRecord.orderNo;
        }
        return title;
    }

    render() {
        var that = this;
        return (
            <Modal
                title={this.getTitle()}
                visible={this.props.modalVisible}
                maskClosable={false}
                destroyOnClose={true}
                footer={null}
                onCancel={this.onCancel.bind(this)}
            >
                <Button type="primary" 
                    onClick={e => {
                    that.print(1);
                }}>顾客联</Button>
                <span style={{ marginLeft: "54px" }}></span>
                <Button type="primary"
                    onClick={e => {
                        that.print(2);
                    }}>收银联</Button>
                <span style={{ marginLeft: "54px" }}></span>
                <Button type="primary"
                    onClick={e => {
                        that.print(3);
                    }}>对账联</Button>
                <span style={{ marginLeft: "54px" }}></span>
                {
                    this.state.orderType == 0 ? 
                        <Button type="primary"
                            onClick={e => {
                                that.print(4);
                            }}>传菜单</Button>
                            : null
                }

            </Modal>
        );
    }
}

export default PosPrintOrderModal;