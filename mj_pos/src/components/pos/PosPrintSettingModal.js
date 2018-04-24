import React from 'react';
import { Modal, Row, Col, Input, Button, Table, message } from 'antd';
import { connect } from 'dva';
import './PosPrintSettingModal.css';
import * as posService from '../../services/PosService';


const columns = [{
    title: '名称',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '打印机',
    dataIndex: 'printer',
    key: 'printer',
        render: (text) => (
            <span>{(text && text.length) > 0 ? text : "默认打印机"}</span>
        ),
}, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
        <a
          onClick={e => {
                if (window.mjTestPrint) {
                    window.mjTestPrint(record.id);
                }
        }}>测试打印</a>
    ),
}];

class PosPrintSettingModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            printerList: [],
            loading: false
        }
    }

    componentWillReceiveProps(props) {
        if (props.modalVisible == true && this.state.loading == false) {
            this.loadData();
        }
    }

    loadData() {
        this.setState({ loading: true});
        var that = this;
        posService.queryPrintTemplate({
            success: function (data) {
                that.setState({ printerList:data.data, loading: false });
            },
            error: function (err) {
                message.warn(err);
                that.setState({ loading: false });
            }
        })
    }

    onOk(e) {
        this.props.onOk(e);
    }

    onCancel(e) {
        this.props.onCancel(e);
    }

    render() {
        return (
            <Modal
                title="打印设置"
                width={600}
                visible={this.props.modalVisible}
                maskClosable={false}
                destroyOnClose={true}
                footer={null}
                onCancel={this.onCancel.bind(this)}
            >
                <Table
                    columns={columns}
                    dataSource={this.state.printerList}
                    pagination={false}
                    loading={this.state.loading}
                    locale={{emptyText: ""}}
                />
            </Modal>
        );
    }
}

export default PosPrintSettingModal;