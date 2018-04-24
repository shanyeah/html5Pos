import React from 'react';
import { Row, Col, Input, Select, Spin ,message } from 'antd';
import { connect } from 'dva';
import './PosSettleNetCardView.css';
import './PosSettleCommon.css'
import * as posService from '../../services/PosService';
import MoneyValue from '../../utils/money';

const Option = Select.Option;

class PosSettleNetCardView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            certFlag: 0,
            searchValue:"",
            memberList:[],
            memberInfo: null,
            netCardBillData: null,
            seatNo: props.seatNo,
            remark: props.remark,
            fetching: false
        }
    }

    receiveIdNumber(idNumber) {
        this.state.searchValue = idNumber.idNumber;
        this.state.certFlag = 1;
        this.search();
    } 

    componentDidMount() {
        setTimeout(this.focus.bind(this));
        window.oldMjReceiveIdNumber = window.mjReceiveIdNumber;
        window.mjReceiveIdNumber = this.receiveIdNumber.bind(this);

        // setTimeout(this.receiveIdNumber.bind(this), 3000, {idNumber: "44010519880213121X"});
    }

    componentWillUnmount() {
        window.mjReceiveIdNumber = window.oldMjReceiveIdNumber;
        window.oldMjReceiveIdNumber = null;
    }

    focus() {
        this.input && this.input.focus();
    }

    getGoodsBillMemberPrice() {
        var that = this; 
        var param = { saleBillId: this.props.billData.saleBillId, userId: this.state.memberInfo.userId};
        posService.getGoodsBillMemberPrice(param, {
            success: function (data) {
                that.state.netCardBillData = data.data;
                that.props.onUpdateInfo(that.state);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    search() {
        if (this.state.memberList.length > 0) {
            return;
        }

        if (this.state.searchValue.length < 1) {
            message.warn("请输入搜索文本!");
        } else {
            this.setState({
                memberList: [],
                memberInfo: null,
                fetching: true
            });
            var that = this;
            var params = { input: this.state.searchValue, certFlag: this.state.certFlag };
            posService.queryMemberInfo(params, {
                success: function (data) {
                    console.log(data);
                    var memberList = data.data.list;
                    that.setState({
                        memberList: memberList.length > 1 ? memberList : [],
                        memberInfo: memberList.length == 1 ? memberList[0] : null,
                        fetching: false
                    });
                    console.log(that.state.memberInfo);

                    if (memberList.length == 0) {
                        message.warn("无此会员信息");
                    }
                    if (memberList.length == 1) {
                        that.getGoodsBillMemberPrice();
                    }
                    that.props.onUpdateInfo(that.state);
                },
                error: function (err) {
                    console.log(err);
                    message.warn(err);
                    that.setState({
                        memberList: [],
                        memberInfo: null,
                        fetching: false
                    });
                }
            });
        }
    }

    onKeyDown(e) {
        if (e.keyCode == 13) {
            this.search();
        }
    }

    onSearch(value) {
        this.state.searchValue = value;
        if (this.state.memberList.length > 0) {
            this.setState({
                memberList: [],
                memberInfo: null
            });
            this.props.onUpdateInfo(this.state);
        }
    }

    onSelect(value) {
        for (let i = 0; i < this.state.memberList.length; i++) {
            const member = this.state.memberList[i];
            if (member.userId == value.key) {
                console.log(member);
                this.state.memberInfo = member;
                this.props.onUpdateInfo(that.state);
                this.getGoodsBillMemberPrice();
                break;
            } 
        }
    }

    onChange(value) {
        this.state.certFlag = 0;
    }

    render() {
        var that = this;
        return (
            <div>
                <Row>
                    <div onKeyDown={this.onKeyDown.bind(this)}>
                        <span className="pos_settle_action_title">会员查询</span>
                            <Select
                                ref={(input) => { this.input = input; }} 
                                mode="combobox"
                                style={{ width: "420px" }}
                                placeholder="证件号/机座号/手机号"
                                labelInValue
                                notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
                                filterOption={false}
                                optionLabelProp="searchValue"
                                onSearch={this.onSearch.bind(this)}
                                onSelect={this.onSelect.bind(this)}
                                onChange={this.onChange.bind(this)}
                            >
                            {this.state.memberList.map(d =>
                                <Option key={d.userId} searchValue={this.state.searchValue}>
                                    <Row>
                                        <Col span={4}>
                                            {d.name}
                                        </Col>
                                        <Col span={10}>
                                            <div style={{ whiteSpace: "pre" }}>-      {d.idNumber}</div> 
                                        </Col>
                                    </Row>
                                 </Option>
                                 )}
                            </Select>

                    </div>
                    
                </Row>
                <Row>
                    <span className="pos_settle_action_title" style={{ marginRight: "42px" }}>桌号</span>
                    <Input
                        style={{ width: "420px" }}
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
                    <span className="pos_settle_action_title" style={{ marginRight: "42px" }}>备注</span>
                    <Input 
                        style={{ width: "420px" }}
                        ref={(input) => { this.remarkInput = input; }}
                        defaultValue={this.state.remark}
                        onChange={event => {
                            var value = event.target.value;
                            that.state.remark = value;
                            that.props.onUpdateInfo(that.state);
                        }}
                    ></Input>
                </Row>
                {
                this.state.memberInfo ? 
                    <div>
                        <Row className="pos_settle_member_row">
                            <Col span={12}>
                                <Row>
                                    <Col span={9}>
                                        姓名:
                                    </Col>
                                    <Col span={14}>
                                        {this.state.memberInfo.name}
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={9}>
                                        手机:
                                </Col>
                                    <Col span={15}>
                                        {this.state.memberInfo.mobile}
                                </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className="pos_settle_member_row">
                            <Col span={12}>
                                <Row>
                                    <Col span={9}>
                                        证件类型:
                                </Col>
                                    <Col span={15}>
                                        身份证
                                </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={9}>
                                        证件号:
                                </Col>
                                    <Col span={15}>
                                        {this.state.memberInfo.idNumber}
                                </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className="pos_settle_member_row">
                            <Col span={12}>
                                <Row>
                                    <Col span={9}>
                                        会员等级:
                                </Col>
                                    <Col span={15}>
                                      {this.state.memberInfo.className}
                                </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={9}>
                                        机座号:
                                </Col>
                                    <Col span={15}>
                                        无
                                </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className="pos_settle_member_row">
                            <Col span={12}>
                                <Row>
                                    <Col span={9}>
                                        商品折扣:
                                </Col>
                                    <Col span={15}>
                                            {this.state.memberInfo.goodsDiscount}%
                                </Col>
                                </Row>

                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={9}>
                                        包房折扣:
                                    </Col>
                                    <Col span={15}>
                                        {this.state.memberInfo.roomDiscount}%
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className="pos_settle_member_row">
                            <Col span={12}>
                                <Row>
                                    <Col span={9}>
                                        现金金额:
                                     </Col>
                                    <Col span={15}>
                                            {MoneyValue(this.state.memberInfo.availCashBalance)}
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={9}>
                                        赠送余额:
                                    </Col>
                                    <Col span={15}>
                                            {MoneyValue(this.state.memberInfo.availPresentBalance)}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className="pos_settle_member_row">
                            {/* <Col span={12}>
                                <Row>
                                    <Col span={9}>
                                        魔元余额:
                                    </Col>
                                    <Col span={15}>
                                            {MoneyValue(this.state.memberInfo.magicCoin)}
                                     </Col>
                                </Row>
                            </Col> */}
                            <Col span={12}>
                                <Row>
                                    <Col span={9}>
                                        总余额:
                                    </Col>
                                    <Col span={15}>
                                            {MoneyValue(this.state.memberInfo.availBalance)}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                : null
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps)(PosSettleNetCardView);