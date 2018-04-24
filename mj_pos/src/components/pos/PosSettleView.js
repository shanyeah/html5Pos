import React from 'react';
import { Modal, Menu, Row, Col } from 'antd';
import { connect } from 'dva';
import './PosSettleView.css';
import PosSettleNetCardView from './PosSettleNetCardView'
import PosSettleCashView from './PosSettleCashView'
import PosSettleScanView from './PosSettleScanView'
import PosSettleTransferView from './PosSettleTransferView'
import PosSettleSignView from './PosSettleSignView'
import PosSettleCouponView from './PosSettleCouponView'
import PosSettleCashBarView from './PosSettleCashBarView'
import * as posService from '../../services/PosService';
import MoneyValue from '../../utils/money';

class PosSettleView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMenu: '1',
            currentInfo: {},
            netCardBillData: null,
            seatNo: '',
            remark: ''
        }
    }

    menuClick(e) {
        var menu = e.key;
        this.setState({
            currentMenu: menu,
            currentInfo: {}
        });
    }

    onUpdateInfo(info) {
        console.log(info);
        this.setState({ currentInfo: info, seatNo: info.seatNo, remark: info.remark });
    }

    billData() {
        var data = this.state.currentInfo.netCardBillData ? this.state.currentInfo.netCardBillData: this.props.billData;
        return data;
    }

    getCurrentView() {
        switch (this.state.currentMenu) {
            case '1':
                return <PosSettleScanView 
                    billData={this.props.billData} 
                    seatNo={this.state.seatNo}
                    remark={this.state.remark}
                    onUpdateInfo={this.onUpdateInfo.bind(this)}
                    onOk={this.onOk.bind(this)}
                    >
                    </PosSettleScanView>;
                break;
            case '2':
                return <PosSettleCashView 
                        billData={this.props.billData} 
                        seatNo={this.state.seatNo}
                        remark={this.state.remark}
                        onUpdateInfo={this.onUpdateInfo.bind(this)}
                        onOk={this.onOk.bind(this)}
                        ></PosSettleCashView>;
                break;
            case '3':
                return <PosSettleTransferView 
                        billData={this.props.billData} 
                        seatNo={this.state.seatNo}
                        remark={this.state.remark}
                        onUpdateInfo={this.onUpdateInfo.bind(this)}
                        onOk={this.onOk.bind(this)}
                        ></PosSettleTransferView>;
                break;
            case '4':
                return <PosSettleNetCardView 
                        billData={this.props.billData} 
                        seatNo={this.state.seatNo}
                        remark={this.state.remark}
                        onUpdateInfo={this.onUpdateInfo.bind(this)}
                        onOk={this.onOk.bind(this)}>
                        </PosSettleNetCardView>;
                break;
            case '5':
                return <PosSettleSignView 
                        billData={this.props.billData} 
                        seatNo={this.state.seatNo}
                        remark={this.state.remark}
                        onUpdateInfo={this.onUpdateInfo.bind(this)}
                        onOk={this.onOk.bind(this)}
                        ></PosSettleSignView>;
            case '6':
                return <PosSettleCashBarView 
                        billData={this.props.billData} 
                        seatNo={this.state.seatNo}
                        remark={this.state.remark}
                        onUpdateInfo={this.onUpdateInfo.bind(this)}
                        onOk={this.onOk.bind(this)}
                        ></PosSettleCashBarView>;
            // case '7':
            //     return <PosSettleCouponView></PosSettleCouponView>;
            default:
                return <div>{this.props.currentMenu}</div>
                break;
        }
    }

    onOk(e) {

        var that = this;
        var params = { payType: 0, saleBillId: this.props.billData.saleBillId, incomeAmount: this.props.billData.incomeAmount, remark:this.state.remark };
        if (this.state.seatNo.length > 0) {
            params.seatNo = this.state.seatNo;
        }
        
        if (Object.keys(this.state.currentInfo).length == 0) {
            Modal.warn({
                content: "请输入支付信息!"
            });
            return;
        }

        switch (this.state.currentMenu) {
            case '1': {
                params.payType = 1;
                params.payCategoryId = 0;
            }
                break;
            case '2': {
                params.payType = 0;
                params.receiveCash = this.state.currentInfo.inputValue;

                if (this.state.currentInfo.inputValue < this.state.currentInfo.payAmount) {
                    Modal.warn({
                        content: "输入金额不能小于实付金额"
                    });

                    return;
                }
            }
                break;
            case '3': {
                params.payType = 1;
                params.payCategoryId = 1;
            }
                break;
            case '4': {
                params.userId = this.state.currentInfo.memberInfo.userId;
                params.payType = 2;
                params.payCategoryId = 0;
                params.payObjectId = this.state.currentInfo.memberInfo.userId;
            }
                break;
            case '5': {
                params.payType = 3;
                params.payCategoryId = this.state.currentInfo.signInfo.payCategoryId;
                params.payObjectId = this.state.currentInfo.signInfo.payObjectId;
            }
                break;
            case '6': {
                params.payType = 1;
                params.payCategoryId = 11;
            }
                break;
        }
        console.log(params);
        posService.payGoodsBill(params, {
            success: function (data) {
                console.log(data);
                const modal = Modal.success({
                    content: '收款成功!'
                });
                setTimeout(() => modal.destroy(), 2000);
                if (window.mjPrintSaleBill) {
                    var saleBillId = data.data.saleBillId;
                    window.mjPrintSaleBill(0, 0, saleBillId);
                }
                that.props.onOk(e);
            },
            error: function (err) {
                Modal.error({
                    content: err
                });
            }
        });
        
    }

    onCancel(e) {
        this.props.onCancel(e);
    }

    afterClose(e) {
        this.setState({currentMenu: "1", currentInfo: {}});
    }

    render() {
        var that = this;
        return (
            <Modal title="收款"
                width={680}
                bodyStyle={{ padding: "0px 0px 0px 0px" }}
                wrapClassName="vertical-center-modal"
                okText="完成付款"
                cancelText="取消付款"
                maskClosable={false}
                destroyOnClose
                visible={this.props.visible}
                onOk={this.onOk.bind(this)}
                onCancel={this.onCancel.bind(this)}
                afterClose={this.afterClose.bind(this)}
                >
                
                <div>
                    <Row>
                        <Col span={5}>
                            <div style={{ width: "100%", height: 400 }}>
                                <Menu
                                    style={{ height: "100%" }}
                                    onClick={this.menuClick.bind(this)}
                                    selectedKeys={[this.state.currentMenu]}
                                    mode="inline"
                                >
                                    
                                    <Menu.Item key="1">
                                        <span className="pos_settle_menu_title">扫码支付</span>
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                        <span className="pos_settle_menu_title">现金支付</span>
                                    </Menu.Item>
                                    <Menu.Item key="3">
                                        <span className="pos_settle_menu_title">银行转账</span>
                                    </Menu.Item>
                                    <Menu.Item key="4">
                                        <span className="pos_settle_menu_title">会员卡扣</span>
                                    </Menu.Item>
                                    <Menu.Item key="5">
                                        <span className="pos_settle_menu_title">客户签单</span>
                                    </Menu.Item>
                                    <Menu.Item key="6">
                                        <span className="pos_settle_menu_title">收钱吧</span>
                                    </Menu.Item>
                                    {/* <Menu.Item key="7">
                                优惠券
                            </Menu.Item> */}
                                </Menu>
                            </div>

                        </Col>
                        <Col span={19}>
                            <div className='pos_settle_content'>
                                {this.getCurrentView()}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="pos_settle_title">
                            总计:{MoneyValue(this.billData().payAmount)}
                        </Col>
                        <Col span={8} className="pos_settle_discount" style={{ color: "orange" }}>
                            {this.billData().incomeAmount == this.billData().payAmount ? ""
                                : "优惠:" + MoneyValue(this.billData().payAmount - this.billData().incomeAmount)
                             }
                        </Col>
                        <Col span={8} className="pos_settle_title" style={{ color: "red"}}>
                            实付:{MoneyValue(this.billData().incomeAmount)}
                        </Col>
                    </Row>
                </div>
            </Modal>
            
        );
    }
}

function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps)(PosSettleView);