import React from 'react';
import { Modal, Divider, Row, Col, Table, Input, Button } from 'antd';
import { connect } from 'dva';
import './ShiftOrderDetailModal.css';
import * as posService from '../../services/PosService';
import MoneyValue from '../../utils/money';

class ShiftOrderDetailModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailInfo: {},
            loading: false,
            refundRemark: "",
            refundLoading: false,
            refundData: {}
        }
    }

    componentWillReceiveProps(props) {
        if (props.orderRecord && props.orderRecord.saleBillId && !this.state.loading) {
            var that = this;
            this.state.loading = true;
            posService.queryGooodsBillDetail(props.orderRecord.saleBillId, {
                success: function (data) {
                    console.log(data);
                    that.setState({ detailInfo: data.data, loading: false });
                },
                error: function (err) {
                    that.setState({ detailInfo: {}, loading: false });
                }
            });
        }
    }

    refund() {
        if (this.state.refundRemark.length == 0) {
            Modal.warn({
                content: '请输入退款说明!'
            });
            return;
        }
        this.setState({ refundLoading: true });
        var params = { saleBillId: this.props.orderRecord.saleBillId, type: 0, remark: this.state.refundRemark };

        var that = this;
        var success = function (data) {
            that.setState({ refundData: data.data, refundLoading: false });
            const modal = Modal.success({
                content: '退款成功!'
            });
            that.onOk(null);
        };
        var error = function (err) {
            const modal = Modal.warn({
                content: err
            });
            that.setState({ refundLoading: false });
        };
        posService.refundGoodsSaleBill(params, {
            success: success,
            error: error
        });

    }

    componentDidMount() {

    }

    onOk(e) {
        this.props.onOk(e);
    }

    onCancel(e) {
        this.props.onCancel(e);
    }

    render() {
        var that = this;
        var columns = [{
            title: '名称',
            dataIndex: 'goodsName',
            key: 'goodsName',
        }, {
            title: '单价',
            dataIndex: 'price',
            key: 'price',
            render: text => <span>{MoneyValue(text)}</span>
        }, {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
        }, {
                title: '应收',
                dataIndex: 'incomeAmount',
                key: 'incomeAmount',
                render: text => <span>{MoneyValue(text)}</span>
        }, {
            title: '实付',
            dataIndex: 'payAmount',
            key: 'payAmount',
            render: text => <span>{MoneyValue(text)}</span>
        }];
        return (
            <Modal
                title="订单详情"
                width={940}
                visible={this.props.modalVisible}
                maskClosable={false}
                destroyOnClose={true}
                footer={null}
                onOk={this.onOk.bind(this)}
                onCancel={this.onCancel.bind(this)}
            > 
             {
                 this.state.loading ? 
                    <div>加载中...</div>
                 :
                  <div>
                            {/* <div style={{ height: "36px", fontSize: "16px", fontWeight: "bold" }}>基础信息</div> */}
                            <Row style={{ height: "36px", fontSize: "15px"}}>
                                <Col span={8}>
                                    订单号: {this.state.detailInfo.orderNo}
                                </Col>  
                                <Col span={8}>
                                    操作人: {this.state.detailInfo.createAdminName}
                                </Col>  
                                <Col span={8}>
                                    下单时间: {this.state.detailInfo.createTime}
                                </Col>
                            </Row>
                            <Row style={{ height: "36px", fontSize: "15px" }}>
                               
                                <Col span={16}>
                                    支付说明: {this.state.detailInfo.payInfo}
                                </Col>
                                
                            </Row>
                            <Row style={{ height: "36px", fontSize: "15px" }}>

                                <Col span={8}>
                                    备注:  {this.state.detailInfo.remark}
                                </Col>

                            </Row>

                            

                            {this.state.detailInfo.userInfo ? 
                                <div>
                                    <div style={{ height: "36px", fontSize: "16px", fontWeight: "bold" }}>用户信息</div>
                                    <Row style={{ height: "36px", fontSize: "15px" }}>
                                        <Col span={8}>
                                            姓名: {this.state.detailInfo.userInfo.userName}
                                        </Col>
                                        <Col span={8}>
                                            手机: {this.state.detailInfo.userInfo.mobile}
                                        </Col>
                                        <Col span={8}>
                                            证件号: {this.state.detailInfo.userInfo.idNumber}
                                        </Col>
                                    </Row>
                                </div>
                            :
                            null}

                            <Divider type="horizontal" />
                            <Table columns={columns}
                                dataSource={this.state.detailInfo.goodsList}
                                expandedRowRender={record => <div>
                                        {record.childGoodsList ?
                                            record.childGoodsList.map(d =>
                                                <div>
                                                    <Row>
                                                        <Col span={6}>{d.goodsName}</Col>
                                                        <Col span={5}>{MoneyValue(d.incomeAmount)}</Col>
                                                        <Col span={4}>1</Col>
                                                        <Col span={4}>{MoneyValue(d.incomeAmount)}</Col>
                                                        <Col span={4}>{MoneyValue(d.payAmount)}</Col>
                                                    </Row>

                                                </div>

                                            )
                                            :
                                            null
                                        }
                                        {record.childGoodsList ? <br/> : null}
                                        备注: {record.remark}
                                    </div>
                                }
                                footer={() => 
                                <div style={{ fontSize: "18px" }}>
                                        <span>总计: ￥{MoneyValue(Math.abs(this.state.detailInfo.incomeAmount))}</span>
                                        <span style={{ marginLeft: "12px" }}>{this.state.detailInfo.payAmount > 0 ? "实付" : "退款"}: ￥{MoneyValue(this.state.detailInfo.payAmount)}</span>
                                </div>}
                                pagination={{
                                    hideOnSinglePage: true
                                }}>
                                
                            </Table>

                            {
                                (this.props.orderRecord && this.props.orderDetailShowRefund) ? 
                                 <div>
                                        <br />
                                        <Input
                                            placeholder="退款说明"
                                            ref={(input) => { this.input = input; }}
                                            onChange={e => {
                                                that.state.refundRemark = e.target.value;
                                            }}
                                            onPressEnter={e => {
                                                that.refund();
                                            }}
                                        ></Input>
                                        <br />
                                        <br />
                                        <div style={{ textAlign: "right" }}>
                                            <Button type="primary" loading={this.state.refundLoading} onClick={this.refund.bind(this)}>退款</Button>
                                        </div>
                                 </div> :
                                 null
                            }
                      
                  </div>


             }
            </Modal>
        );
    }
}

export default ShiftOrderDetailModal;