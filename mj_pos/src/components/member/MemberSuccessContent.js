import React from 'react';
import { Row, Col, Input, Select, Spin ,message ,Radio, Button,Divider} from 'antd';
import { connect } from 'dva';
import '../member/MemberSuccessContent.css'
import * as posService from '../../services/PosService';

const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;


class MemberSuccessContent extends React.Component {
    constructor(props) {
		super(props);
		this.inputMoney = null;
		this.inputScna = null;
		this.inputVoucher = null;
		this.btCharge = null;
		this.params={};
        this.state = {
            searchValue:props.searchValue,
            memberList:[],
            memberInfo: props.memberInfo,
			fetching: false,
			visible:false,
			radioValue: 0,
			remark:true,
			money:0,
			scanValue:'1',
			changeRemark:''
		}

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
		// if (this.state.money <= 0) {
		// 	message.warn("请输入充值金额!");
		// } 

		// console.log('onClick');
	}

    render() {
        return (
            <div>

				<div className='member_div_input'>
					<div className="member_success_img"/>
				</div>

                {this.props.memberInfo ? <div className='div_member_info'>
					<Row className='success_row_title'>
						<Col className='modal_col_state' span={4}>会员信息:</Col>
					</Row>
					<Row className='success_row_info'>
						<Col className='success_col_state' span={4}>姓名:</Col>
						<Col className='success_success_name' span={10}>{this.state.memberInfo.name}</Col>
						<Col className='success_col_state' span={4}>手机:</Col>
						<Col className='success_success_name' span={6}>{this.state.memberInfo.mobile}</Col>
					</Row>

					<Row className='success_row_info'>
						<Col className='success_col_state' span={4}>会员等级:</Col>
						<Col className='success_success_name' span={10}>{this.state.memberInfo.className}</Col>
						<Col className='success_col_state' span={4}>证件号:</Col>
						<Col className='success_success_name' span={6}>{this.state.memberInfo.idNumber}</Col>
					</Row>

					<Row className='success_row_title1'>
						<Col className='success_col_state' span={4}>本次充值:</Col>
					</Row>

					<Row className='success_row_info'>
						<Col className='success_col_state' span={4}>充值金额:</Col>
						<Col className='member_info_money' span={10}>{this.state.memberInfo.amount?(this.state.memberInfo.amount).toFixed(2):0}</Col>
						<Col className='success_col_state' span={4}>赠送金额:</Col>
						<Col className='member_info_money' span={6}>{this.state.memberInfo.presentAmount?(this.state.memberInfo.presentAmount).toFixed(2):0}</Col>
					</Row>

					<Row className='success_row_title1'>
						<Col className='success_col_state' span={4}>充值后:</Col>
					</Row>
					<Row className='success_row_info'>
						<Col className='success_col_state' span={4}>总余额:</Col>
						<Col className='member_info_money' span={6}>{this.state.memberInfo.afterBalance?(this.state.memberInfo.afterBalance).toFixed(2):0}</Col>
					</Row>
					<Row className='success_row_info'>
						<Col className='success_col_state' span={4}>现金金额:</Col>
						<Col className='member_info_money' span={10}>{this.state.memberInfo.afterCashBalance?(this.state.memberInfo.afterCashBalance).toFixed(2):0}</Col>
						<Col className='success_col_state' span={4}>赠送余额:</Col>
						<Col className='member_info_money' span={6}>{this.state.memberInfo.afterPresentBalance?(this.state.memberInfo.afterPresentBalance).toFixed(2):0}</Col>
					</Row>
		
				<Divider className='success_success_divider'/>
			</div>: null}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps)(MemberSuccessContent);