import React from 'react';
import { Row, Col, Input, Select, Spin ,message ,Radio, Button,Divider} from 'antd';
import { connect } from 'dva';
import '../member/MemberOrderContent.css'
import * as memberService from '../../services/MemberService';

const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;


class MemberOrderRefunds extends React.Component {
    constructor(props) {
        super(props);
        
		this.inputRefunds = null;
		this.params={};
        this.state = {
            memberInfo: props.memberInfo,
        }
        
        setTimeout(this.focusRefunds.bind(this), 100);
	}

	componentWillReceiveProps(props) {
		this.setState({
			memberInfo: props.memberInfo,
          });
        // console.log("props.memberInfo",props.memberInfo);
	}
	
	componentDidUpdate(prevProps, prevState) {
		// const input = this.member_input_money.refs.input;
		// input.focus();
		// console.log("act"+input);
		// document.querySelector('#member_input_money').focus();
	}

	onClick= () => {
		var remark = document.getElementById("refunds_id_remark").value;

		if (remark.length <= 0) {
			message.warn("请输入退款原因!");
			return;
		}else{
			this.params.remark = remark;
		}

		this.params.type= 0;
		this.params.saleBillId= this.state.memberInfo.saleBillId;
		this.params.cashAmount= this.state.memberInfo.cashAmount;
		this.params.presentAmount= this.state.memberInfo.presentAmount;
		this.queryRefundUser(this.params);

		// console.log('onClick');
	}
	
	queryRefundUser(params){
		// console.log("onBtSelect",params);
        var that = this;
        memberService.queryRefundUser(params, {
            success: function (data) {
				// console.log("data11",data);
				if(data.message)message.warn(data.message);
                if(data.code==0){
					// console.log("data0",data.data.saleBillId);
					if(window.mjPrintRechargeBill)window.mjPrintRechargeBill(0, 0, data.data.saleBillId);
					// that.props.handleSuccess(true,data.data);
					that.props.handleCancel(false);

                }else{
					// console.log("data1",data);
				}
            },
            error: function (err) {
				// console.log("data2",err);
				console.log(err);
				message.warn(err);
            }
        })

    }
    
    focusRefunds() {
        this.inputRefunds && this.inputRefunds.focus();
	}

    render() {
        return (
            <div>
                {this.props.memberInfo ? <div className='div_member_info'>
					<Row className='order_content_title'>
						<Col className='modal_col_state' span={4}>会员信息:</Col>
					</Row>
					<Row className='success_row_info'>
						<Col className='success_col_state' span={4}>姓名:</Col>
						<Col className='success_success_name' span={10}>{this.state.memberInfo.userWallet.userName}</Col>
						<Col className='success_col_state' span={4}>手机:</Col>
						<Col className='success_success_name' span={6}>{this.state.memberInfo.userWallet.mobile}</Col>
					</Row>

					<Row className='success_row_info'>
						<Col className='success_col_state' span={4}>会员ID:</Col>
						<Col className='success_success_name' span={10}>{this.state.memberInfo.userWallet.userId}</Col>
						<Col className='success_col_state' span={4}>会员等级:</Col>
						<Col className='success_success_name' span={6}>{this.state.memberInfo.userWallet.className}</Col>
					</Row>
                    <Row className='success_row_info'>
						<Col className='success_col_state' span={4}>证件号:</Col>
						<Col className='success_success_name' span={10}>{this.state.memberInfo.userWallet.idNumber}</Col>
					</Row>

					<Row className='success_row_title1'>
						<Col className='success_col_state' span={4}>本次充值:</Col>
					</Row>
                    <Row className='success_row_info'>
						<Col className='success_col_state' span={4}>单号:</Col>
						<Col className='success_success_name' span={10}>{this.state.memberInfo.orderNo}</Col>
						<Col className='success_col_state' span={4}>充送方式:</Col>
						<Col className='success_success_name' span={6}>{this.state.memberInfo.optionTypeName}</Col>
					</Row>
                    <Row className='success_row_info'>
						<Col className='success_col_state' span={4}>操作员:</Col>
						<Col className='success_success_name' span={10}>{this.state.memberInfo.createAdminName}</Col>
						<Col className='success_col_state' span={4}>类型:</Col>
						<Col className='success_success_name' span={6}>{this.state.memberInfo.typeName}</Col>
					</Row>
					<Row className='success_row_info'>
						<Col className='success_col_state' span={4}>充值金额:</Col>
						<Col className='member_info_money' span={10}>{this.state.memberInfo.userWallet.amount?(this.state.memberInfo.userWallet.amount).toFixed(2):0}</Col>
						<Col className='success_col_state' span={4}>赠送金额:</Col>
						<Col className='member_info_money' span={6}>{this.state.memberInfo.userWallet.presentAmount?(this.state.memberInfo.userWallet.presentAmount).toFixed(2):0}</Col>
					</Row>
					<Row className='success_row_info'>
						<Col className='success_col_state' span={4}>下单时间:</Col>
						<Col className='success_success_name' span={10}>{this.state.memberInfo.createTime}</Col>
					</Row>
					<Row className='success_row_info'>
						<Col className='success_col_state' span={4}>备注:</Col>
						<Col className='success_success_name' span={20}>{this.state.memberInfo.payInfo}</Col>
					</Row>

					<Row className='success_row_title1'>
						<Col className='success_col_state' span={4}>充值后:</Col>
					</Row>
					<Row className='success_row_info'>
						<Col className='success_col_state' span={4}>总余额:</Col>
						<Col className='member_info_money' span={6}>{this.state.memberInfo.userWallet.afterBalance?(this.state.memberInfo.userWallet.afterBalance).toFixed(2):0}</Col>
					</Row>
					<Row className='success_row_info'>
						<Col className='success_col_state' span={4}>现金金额:</Col>
						<Col className='member_info_money' span={10}>{this.state.memberInfo.userWallet.afterCashBalance?(this.state.memberInfo.userWallet.afterCashBalance).toFixed(2):0}</Col>
						<Col className='success_col_state' span={4}>赠送余额:</Col>
						<Col className='member_info_money' span={6}>{this.state.memberInfo.userWallet.afterPresentBalance?(this.state.memberInfo.userWallet.afterPresentBalance).toFixed(2):0}</Col>
					</Row>
                    <Divider className='success_success_divider'/>
                    <Row className='refunds_row_account'> 
                        <Col className='refunds_col_state' span={20}>
                            <span class='refunds_remark_span'>退款原因:</span>
                            <Input id='refunds_id_remark' 
                                autoFocus={true}
                                ref={(inputRefunds) => { this.inputRefunds = inputRefunds; }} 
                                className='refunds_input_remark' 
                                placeholder="请输入" 
                                defaultValue=""/>
                        </Col>
                        <Col span={4}>
                            <Button ref={(btCharge) => { this.btCharge = btCharge; }} 
                                className='refunds_bt_ok' 
                                type="primary" 
                                disabled={this.state.visible}
                                onClick={this.onClick}>
                                确定
                            </Button>
                        </Col>
                    </Row>
			</div>: null}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps)(MemberOrderRefunds);