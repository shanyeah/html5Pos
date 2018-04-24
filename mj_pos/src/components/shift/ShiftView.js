import React from 'react';
import windowSize from 'react-window-size'
import './ShiftView.css';
import { connect } from 'dva';
import { List, Card, Row, Col, Select, Button, Table, Divider, Icon, Modal, message } from 'antd';
import ShiftActionModal from './ShiftActionModal'
import PosPrintOrderModal from '../pos/PosPrintOrderModal'
import PosRefundModal from '../pos/PosRefundModal'
import ShiftOrderDetailModal from './ShiftOrderDetailModal'

import * as posService from '../../services/PosService'
import MoneyValue from '../../utils/money';
import MemberOrderModal from '../member/MemberOrderModal';

const tabList = [{
    key: 'sale',
    tab: '商品销售',
}, {
    key: 'charge',
    tab: '会员充值',
}];

class ShiftView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectPosCheckIndex: 0,
            selectPosCheckInfo: null,
            posCheckDetailInfo: null,
            posCheckList: [],
            goodsData:{
                "total": 1,
                "pages": 1,
                "pageNum": 1,
                "pageSize": 15,
                list:[]
            },
            chargeData: {
                "total": 1,
                "pages": 1,
                "pageNum": 1,
                "pageSize": 15,
                list: []
            },
            currentPage: 1,
            shiftVisible: false,
            currentTab: "sale",
            shiftLoading: false,
            saleDataLoading: false,
            goodsDataLoading: false,
            chargeDataLoading: false,
            submitPosCheckLoading: false,
            printOrderType: 0,
            printModalVisible: false,
            printOrderRecord: {},
            orderDetailVisible: false,
            orderDetailRecord:{},
            orderDetailShowRefund: false,

            infoModalVisible:false,
            selectType:1,

        }
    }

    // 是否已经接班
    shiftAlready() {
        var loginInfo = window.mjGetLoginInfo();
        
        if (!loginInfo) {
            return false;
        }
        if (loginInfo.posCheckId == 0) {
            return false;
        }
        return true;
    }

    // 是否可以交班
    submitPosCheckEnable() {
        if (this.state.selectPosCheckInfo && this.state.selectPosCheckInfo.status == 0 && this.state.selectPosCheckIndex == 0) {
            return true;
        }
        return false;
    }

    componentDidMount() {
        this.loadData();

        if (!this.shiftAlready()) {
            this.setState({ shiftVisible: true});
        }
    }

    loadData() {
        var that = this;
        this.setState({ shiftLoading: true })
        posService.queryPosCheckList({
            success: function (data) {
                that.setState({ posCheckList: data.data.list, selectPosCheckInfo: data.data.list[0], shiftLoading: false });
                that.querySaleGoodsList();
                that.queryPosCheckDetail();
            },
            error: function (err) {
                message.warn(err);
                that.setState({ shiftLoading: false });
            }
        });
    }

    queryPosCheckDetail() {
        var that = this;
        this.setState({ saleDataLoading: true });
        posService.queryPosCheckDetail(this.state.selectPosCheckInfo.id, {
            success: function (data) {
                that.state.posCheckDetailInfo = data.data;
                that.setState({ saleDataLoading: false });
            },
            error: function (err) {
                message.warn(err);
                that.setState({ saleDataLoading: false });
            }
        })
    }

    querySaleGoodsList() {
        var that = this;
        this.setState({ goodsDataLoading: true })
        posService.querySaleGoodsList(this.state.currentPage, {
            success: function (data) {
                that.setState({ goodsData: data.data, goodsDataLoading: false });
            },
            error: function (err) {
                message.warn(err);
                that.setState({ goodsDataLoading: false });
            }
        });
        
    }

    queryUserRechangeList() {
        var that = this;
        this.setState({ chargeDataLoading: true })
        posService.queryUserRechangeList(this.state.currentPage, {
            success: function (data) {
                that.setState({ chargeData: data.data, chargeDataLoading: false });
            },
            error: function (err) {
                message.warn(err);
                that.setState({ chargeDataLoading: false });
            }
        });
    }

    submitPosCheck() {
        var that = this;
        Modal.confirm({
            title: '提示',
            content: '确认交班?',
            onOk() {
                that.setState({ submitPosCheckLoading: true });
                posService.submitPosCheck({
                    success: function (data) {
                        message.success("交班成功!");
                        that.setState({ submitPosCheckLoading: false });
                        var loginInfo = window.mjGetLoginInfo();
                        loginInfo.posCheckId = 0;
                        loginInfo.checkMessage = "用户未接班,请先接班";
                        window.mjSetLoginInfo(loginInfo);
                        if (window.mjPrintPosCheckBill) {
                            window.mjPrintPosCheckBill(that.state.selectPosCheckInfo.id);
                        }
                        if (window.mjLogout) {
                            window.mjLogout();
                        }
                        that.loadData();
                    },
                    error: function (err) {
                        message.warn(err);
                        that.setState({ submitPosCheckLoading: false });
                    }
                });
            },
            onCancel() {
               
            },
        });
    }

    onTabChange(key) {
        this.setState({ currentTab: key, currentPage: 1});
        if (key === 'sale') {
            this.querySaleGoodsList();
        } else {
            this.queryUserRechangeList();
        }
    }

    onPageChange(page) {
        this.state.currentPage = page;
        if (this.state.currentTab === 'sale') {
            this.querySaleGoodsList();
        } else {
            this.queryUserRechangeList();
        }
    }

    render() {
        var that = this;

        var columns = [{
            title: '单号',
            dataIndex: 'orderNo',
            key: 'orderNo',
            width: 150,
        }, {
            title: '类型',
            dataIndex: 'typeName',
            key: 'typeName',
        }, {
            title: '支付方式',
            dataIndex: 'payTypeName',
            key: 'payTypeName',
        }, {
            title: '收入金额',
            dataIndex: 'incomeAmount',
            key: 'incomeAmount',
            render: text => <span>{MoneyValue(text)}</span>

        }, {
            title: '操作人',
            dataIndex: 'createAdminName',
            key: 'createAdminName',
        }, {
            title: '下单来源',
            dataIndex: 'sourceTypeName',
            key: 'sourceTypeName',
        },  {
            title: '下单时间',
            dataIndex: 'createTime',
            key: 'createTime',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={e => {
                        that.setState({ orderDetailRecord: record, orderDetailVisible: true, orderDetailShowRefund: false });
                    }}>详情</a>
                    <Divider type="vertical" />
                    <a onClick={e=>{
                        that.setState({ printOrderType:0, printOrderRecord: record, printModalVisible: true});
                    }}>补打</a>
                    <Divider type="vertical" />
                    <a 
                    disabled={record.allowRefund ? false : true}
                    onClick={e => {
                        // var params = { refundType:0, saleBillId: record.saleBillId, type: 0, remark: ""};
                        // that.setState({ refundParams: params, refundModalVisible: true })
                        that.setState({ orderDetailRecord: record, orderDetailVisible: true, orderDetailShowRefund: true });
                    }}>退款</a>
                </span>
            ),
        }];

        var columns2 = [{
            title: '单号',
            dataIndex: 'orderNo',
            key: 'orderNo',
            width: 150
        }, {
            title: '类型',
            dataIndex: 'typeName',
            key: 'typeName',
        }, {
            title: '支付方式',
            dataIndex: 'payTypeName',
            key: 'payTypeName',
        }, {
            title: '充值金额',
            dataIndex: 'incomeAmount',
            key: 'incomeAmount',
            render: text => <span>{MoneyValue(text)}</span>
        }, {
                title: '下单来源',
                dataIndex: 'sourceTypeName',
                key: 'sourceTypeName',
        }, {
            title: '操作人',
            dataIndex: 'createAdminName',
            key: 'createAdminName',
        }, {
            title: '下单时间',
            dataIndex: 'createTime',
            key: 'createTime',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={e => {
                        that.setState({ saleBillId: record.saleBillId, infoModalVisible: true,selectType:1});
                    }}>详情</a>
                    <Divider type="vertical" />
                    <a onClick={e => {
                        that.setState({ printOrderType: 1, printOrderRecord: record, printModalVisible: true });
                    }}>补打</a>
                    <Divider type="vertical" />
                    <a 
                    disabled={record.allowRefund ? false : true}
                    onClick={e => {
                        that.setState({ saleBillId: record.saleBillId, infoModalVisible: true,selectType:2});
                    }}>退款</a>
                    
                </span>
            ),
        }];
        return (
            <div className="swift_view">
                <div style={{height: "12px"}}></div>

                <div style={{ display: "flex"}}>
                    <div style={{ flex: "1 1 auto" }}>
                        <Card title="班次信息" className="swift_info_view" loading={this.state.shiftLoading}>
                            <Row style={{ height: "60px", fontSize: "18px" }}>
                                <Col span={12}>
                                    <span style={{ marginRight: "24px"}}>班次:</span>
                                    <Select
                                        style={{ width: "70%" }} 
                                        value={this.state.selectPosCheckInfo ? this.state.selectPosCheckInfo.title : null}
                                        onChange={value => {
                                            for (let i = 0; i < that.state.posCheckList.length; i++) {
                                                var element = that.state.posCheckList[i];
                                                if (element.title == value) {
                                                    that.state.selectPosCheckIndex = i;
                                                    that.state.selectPosCheckInfo = element;
                                                    that.queryPosCheckDetail();
                                                    that.querySaleGoodsList();
                                                    break;
                                                }
                                            }
                                        }}
                                        >
                                        {this.state.posCheckList.map(d =>
                                            <Select.Option key={d.id} value={d.title}>
                                                {d.title}
                                            </Select.Option>
                                        )}
                                    </Select>
                                </Col>
                                <Col span={12} style={{ textAlign: "right" }}>
                                    <Button icon="printer" onClick={e=> {                                        
                                        if (window.mjPrintPosCheckBill) {
                                            window.mjPrintPosCheckBill(that.state.selectPosCheckInfo.id);
                                        }
                                    }}>打印交班单</Button>
                                    <span style={{ marginLeft: "12px" }}></span>
                                    {
                                        this.shiftAlready() ? 
                                            <Button
                                                type="primary"
                                                icon="user"
                                                disabled={!this.submitPosCheckEnable()}
                                                loading={this.state.submitPosCheckLoading}
                                                onClick={e => {
                                                    that.submitPosCheck();
                                                }}>交班</Button>
                                            :
                                            <Button
                                                type="primary"
                                                icon="user"
                                                onClick={e => {
                                                    that.setState({ shiftVisible: true });
                                                }}>接班</Button>
                                            
                                    }
                                    
                                </Col>
                            </Row>

                            <Row style={{ height: "36px", fontSize: "18px" }}>
                                <Col span={5}>
                                    班次ID: {this.state.selectPosCheckInfo ? this.state.selectPosCheckInfo.id : "--"}
                                 </Col>
                                <Col span={5}>
                                    接班人: {this.state.selectPosCheckInfo ? this.state.selectPosCheckInfo.createAdminName : "--"}
                                 </Col>
                                <Col span={5}>
                                    备用金额: {this.state.selectPosCheckInfo ? this.state.selectPosCheckInfo.pettyCashAmount : "--"}
                                </Col>
                                <Col span={9}>
                                    接班时间: {this.state.selectPosCheckInfo ? this.state.selectPosCheckInfo.createTime : "--"}
                                </Col>
                            </Row>
                        </Card>

                       {
                            <Card
                                className="swift_record_view"
                                tabList={tabList}
                                activeTabKey={this.state.currentTab}
                                onTabChange={this.onTabChange.bind(this)}

                            >

                                {
                                    this.state.currentTab === "sale" ?
                                        <Table
                                            loading={this.state.goodsDataLoading}
                                            columns={columns}
                                            dataSource={this.state.goodsData.list}
                                            pagination={{
                                                current: this.state.currentPage,
                                                total: this.state.goodsData.total,
                                                pageSize: this.state.goodsData.pageSize,
                                                hideOnSinglePage: true,
                                                onChange: this.onPageChange.bind(this)
                                            }}
                                        />
                                        : <Table
                                            loading={this.state.chargeDataLoading}
                                            columns={columns2}
                                            dataSource={this.state.chargeData.list}
                                            pagination={{
                                                current: this.state.currentPage,
                                                total: this.state.chargeData.total,
                                                pageSize: this.state.chargeData.pageSize,
                                                hideOnSinglePage: true,
                                                onChange: this.onPageChange.bind(this)
                                            }}
                                        />

                                }

                            </Card>
                       }
                        
                    </div>
                    <div style={{width: "330px"}}>

                        {
                            this.state.posCheckDetailInfo ?
                                this.state.posCheckDetailInfo.incomeList.map(d =>
                                    <Card
                                        title={d.name}
                                        extra={<div style={{ fontSize: "16px" }}>{"￥" + MoneyValue(d.incomeAmount) }</div>}
                                        style={{ marginLeft: "0px", marginRight: "12px", marginBottom: "12px"  }}
                                    >
                                        <Row style={{ height: "36px" }}>
                                            <Col span={12}>
                                                <div style={{ fontSize: "16px" }}>
                                                    <span className="swift_statistics_dot" style={{ background: "rgb(240, 72, 100)" }}></span>
                                                    销售单数: {d.saleBillCount}
                                    </div>
                                            </Col>
                                            <Col span={12}>
                                                <div style={{ fontSize: "16px" }}>
                                                    <span className="swift_statistics_dot" style={{ background: "rgb(240, 72, 100)" }}></span>
                                                    退款单数: {d.refundBillCount}
                                    </div>
                                            </Col>
                                        </Row>

                                        <Row style={{ height: "36px" }}>
                                            <Col span={12}>
                                                {d.payTypeList.length > 0 ? 
                                                    < div style={{ fontSize: "16px" }}>
                                                    <span className="swift_statistics_dot" style={{ background: "rgb(250, 204, 20)" }}></span>
                                                        {d.payTypeList[0]["name"] + ": " + MoneyValue(d.payTypeList[0]["amount"]) }
                                                    </div>
                                                    : null}
                                                
                                            </Col>
                                            <Col span={12}>
                                                {d.payTypeList.length > 1 ?
                                                    < div style={{ fontSize: "16px" }}>
                                                        <span className="swift_statistics_dot" style={{ background: "rgb(133, 67, 224)" }}></span>
                                                        {d.payTypeList[1]["name"] + ": " + MoneyValue(d.payTypeList[1]["amount"])}
                                                    </div>
                                                    : null}
                                            </Col>
                                        </Row>

                                        <Row style={{ height: "36px" }}>
                                            <Col span={12}>
                                                {d.payTypeList.length > 2 ?
                                                    < div style={{ fontSize: "16px" }}>
                                                        <span className="swift_statistics_dot" style={{ background: "rgb(47, 194, 91)" }}></span>
                                                        {d.payTypeList[2]["name"] + ": " + d.payTypeList[2]["amount"]}
                                                    </div>
                                                    : null}
                                            </Col>
                                            <Col span={12}>
                                                {d.payTypeList.length > 3 ?
                                                    < div style={{ fontSize: "16px" }}>
                                                        <span className="swift_statistics_dot" style={{ background: "rgb(24, 144, 255)" }}></span>
                                                        {d.payTypeList[3]["name"] + ": " + d.payTypeList[3]["amount"]}
                                                    </div>
                                                    : null}
                                            </Col>
                                        </Row>

                                    </Card>

                                )
                            :
                                <Card
                                    title="--"
                                    style={{ marginLeft: "0px", marginRight: "12px" }}
                                    loading={this.state.saleDataLoading}
                                ></Card>

                        }
                        
                    </div>
                </div>

                {/* <PosRefundModal
                    modalVisible={this.state.refundModalVisible}
                    params={this.state.refundParams}
                    onOk={e => {
                        that.setState({ refundModalVisible: false, refundParams: null })
                        if (that.state.currentTab === 'sale') {
                            that.querySaleGoodsList();
                        } else {
                            that.queryUserRechangeList();
                        }
                    }}
                    onCancel={e => {
                        that.setState({ refundModalVisible: false })
                    }}>
                >
                </PosRefundModal> */}

                <ShiftActionModal
                    modalVisible={this.state.shiftVisible}
                    onOk={e => {
                        that.setState({ shiftVisible: false })
                        that.loadData();
                    }}
                    onCancel={e => {
                        that.setState({ shiftVisible: false })
                    }}>
                </ShiftActionModal>

                <ShiftOrderDetailModal
                    orderDetailShowRefund={this.state.orderDetailShowRefund}
                    orderRecord={this.state.orderDetailRecord}
                    modalVisible={this.state.orderDetailVisible}
                    onOk={e => {
                        that.setState({ orderDetailVisible: false });
                        that.querySaleGoodsList();
                    }}
                    onCancel={e => {
                        that.setState({ orderDetailVisible: false });
                    }}>
                    ></ShiftOrderDetailModal>


                <PosPrintOrderModal
                    orderType={this.state.printOrderType}
                    orderRecord={this.state.printOrderRecord}
                    modalVisible={this.state.printModalVisible}
                    onOk={e => {
                        that.setState({ printModalVisible: false })
                    }}
                    onCancel={e => {
                        that.setState({ printModalVisible: false })
                    }}>
                >
                </PosPrintOrderModal>

                <MemberOrderModal 
                    handleOk={e => {that.setState({infoModalVisible: false});}}
                    handleCancel={e => {that.setState({infoModalVisible: false});}}
                    modalVisible={this.state.infoModalVisible}
                    saleBillId={this.state.saleBillId}
                    selectType={this.state.selectType}>
                </MemberOrderModal>

            </div>
        );
    }
}


function mapStateToProps(state) {
    const { currentMenu } = state.shift;
    return {
        currentMenu
    };
}

export default connect(mapStateToProps)(windowSize(ShiftView));