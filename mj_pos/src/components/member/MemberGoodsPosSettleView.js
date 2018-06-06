import React from 'react';
import { Modal, Menu, Row, Col, Input, Button } from 'antd';
import { connect } from 'dva';
import '../pos/PosSettleView.css';
import PosSettleNetCardView from '../pos/PosSettleNetCardView'
import * as posService from '../../services/PosService';
import MoneyValue from '../../utils/money';

class MemberGoodsPosSettleView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMenu: '4',
            currentInfo: {},
            netCardBillData: null,
            payPassword: null,
            payPassModalVisible: false,
            seatNo: '',
            remark: '',
            loading: false
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
        // console.log(info);
        this.setState({ currentInfo: info, seatNo: info.seatNo, remark: info.remark });
    }

    billData() {
        var data = this.state.currentInfo.netCardBillData ? this.state.currentInfo.netCardBillData : this.props.billData;
        return data;
    }

    getCurrentView() {
        switch (this.state.currentMenu) {
            case '4':
                return <PosSettleNetCardView
                    billData={this.props.billData}
                    seatNo={this.state.seatNo}
                    remark={this.state.remark}
                    onUpdateInfo={this.onUpdateInfo.bind(this)}
                    onOk={this.onOk.bind(this)}>
                </PosSettleNetCardView>;
                break;
            default:
                return <div>{this.props.currentMenu}</div>
                break;
        }
    }

    onOk(e) {
        if (this.state.payPassModalVisible) {
            this.setState({ payPassModalVisible: false });
        }
        if (this.state.loading) {
            return;
        }
        var that = this;
        var params = { payType: 0, saleBillId: this.props.billData.saleBillId, incomeAmount: this.billData().incomeAmount, remark: this.state.remark };
        if (this.state.seatNo.length > 0) {
            params.seatNo = this.state.seatNo;
        }
        if (this.state.currentInfo.proof && this.state.currentInfo.proof.length > 0) {
            params.tn = this.state.currentInfo.proof;
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
            }
                break;
            case '2': {
                params.payType = 0;
                params.receiveCash = this.state.currentInfo.inputValue;

                if (this.state.currentInfo.inputValue < this.state.currentInfo.incomeAmount) {
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
                var memberInfo = this.state.currentInfo.memberInfo;
                if (memberInfo.needPayPass == 1) {
                    if (!this.state.payPassword) {
                        this.setState({ payPassModalVisible: true });
                        return;
                    }
                }

                if (this.state.payPassword) {
                    params.payPassword = this.state.payPassword;
                }

                params.userId = memberInfo.userId;
                params.payType = 2;
                params.payCategoryId = 0;
                params.payObjectId = memberInfo.userId;
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
                params.payCategoryId = 10;
            }
                break;
        }
        this.setState({ loading: true });
        posService.payGoodsBill(params, {
            success: function (data) {
                console.log(data);
                that.setState({ payPassword: null, currentInfo: {}, netCardBillData: null, seatNo: '', remark: '', loading: false });
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
                console.log(err);
                if (err == "请输入用户支付密码") {
                    that.setState({ payPassword: null, payPassModalVisible: true, loading: false });
                } else {
                    that.setState({ payPassword: null, loading: false });
                    Modal.error({
                        content: err
                    });
                }

            }
        });

    }

    onCancel(e) {
        this.setState({ payPassword: null, currentInfo: {}, netCardBillData: null, seatNo: '', remark: '', loading: false });
        this.props.onCancel(e);
    }

    afterClose(e) {
        this.setState({ currentMenu: "1", currentInfo: {} });
    }

    render() {
        var that = this;
        return (
            <div>
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
                                        <Menu.Item key="4">
                                            <span className="pos_settle_menu_title">会员卡扣</span>
                                        </Menu.Item>
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
                            <Col span={8} className="pos_settle_title" style={{ color: "red" }}>
                                实付:{MoneyValue(this.billData().incomeAmount)}
                            </Col>
                        </Row>



                    </div>
                </Modal>
                <Modal
                    title="请输入用户支付密码"
                    visible={this.state.payPassModalVisible}
                    maskClosable={false}
                    destroyOnClose={true}
                    footer={null}
                >
                    <Input
                        type="password"
                        ref={(input) => { this.input = input; }}
                        onChange={e => {
                            that.setState({ payPassword: e.target.value })
                        }}
                        onPressEnter={e => {
                            that.onOk(e);
                        }}
                    ></Input>
                    <br />
                    <br />
                    <div style={{ textAlign: "right" }}>
                        <Button type="primary" loading={this.state.loading} disabled={this.state.loading} onClick={this.onOk.bind(this)}>{this.state.loading ? "支付中" : "确定"}</Button>
                    </div>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
}

export default connect(mapStateToProps)(MemberGoodsPosSettleView);