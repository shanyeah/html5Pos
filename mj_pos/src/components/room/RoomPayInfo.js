import React from 'react';
import { Row, Col, Input, Select, Spin ,message ,Radio, Button,Divider,DatePicker} from 'antd';
import { connect } from 'dva';
import './RoomPayInfo.css'
import * as memberService from '../../services/MemberService';
import * as posService from '../../services/PosService';
import moment from 'moment';

const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;


class RoomPayInfo extends React.Component {
    constructor(props) {
		super(props);
		this.inputMoney = null;
		this.inputScan = null;
	

		this.inputRemark = null;
		this.params={};
        this.state = {
            searchValue:props.searchValue,
            memberList:[],
			memberInfo: props.memberInfo,
			roomInfo:props.roomInfo,
			fetching: false,
			searchVisible:false,
			visible:false,
			radioValue: 0,
			remark:true,
			money:0,
			scanValue:'1',
			dateString:'',
			idNumber:null,
			certFlag:props.certFlag,
			timerCount:6,
		}
	
		// console.log("searchValue:",this.state.searchValue);
		// if(props.searchValue && props.searchValue.length > 3){
		// 	var params={input:props.searchValue,certFlag:props.certFlag};
		// 	this.getMemberInfo(params);
		// }

		var params={input:"3057",certFlag:this.state.certFlag}
		this.getMemberInfo(params);
	}


	componentWillReceiveProps(props) {
		// const input = this.refs.myInput.refs.input;
		// input.focus();
		// console.log("act"+input);
		this.setState({
			searchValue:props.searchValue,
			idNumber:props.idNumber,
			certFlag:props.certFlag,
			memberInfo:props.memberInfo,
			roomInfo:props.roomInfo,
		});

		// if(props.btVisible){
		// 	this.setState({
		// 		visible:false,
		// 	});
		// }
		// console.log("searchValue:",this.state.searchValue);
		if(props.searchValue && props.searchValue.length > 3){
			var params={input:props.searchValue,certFlag:this.state.certFlag}
			this.getMemberInfo(params);
		}

		var params={input:"3057",certFlag:this.state.certFlag}
		this.getMemberInfo(params);

	}
	

	focus1() {
        this.inputMoney && this.inputMoney.focus();
	}

	focusScan() {
        this.inputScan && this.inputScan.focus();
	}




	

	getMemberInfo(params){
        // console.log("onBtSelect",params);
		if (params.length < 3) {
			message.warn("请输入3个或以上字符!");
		} else {
			this.setState({
				memberList: [],
				memberInfo: null,
				fetching: true
			});
			var that = this;
			posService.queryMemberInfo(params, {
				success: function (data) {
					// console.log("infodata",data);
					var memberList = data.data.list;
					if(memberList.length==0){
						// that.props.handleSlectType(2,that.state.searchValue,null,true,that.state.certFlag);
						that.setState({searchVisible:true});
					}else{
						setTimeout(that.focus1.bind(that), 100);
						that.setState({searchVisible:false});
					}
					that.setState({
						memberList: memberList.length>1?memberList:[],
						memberInfo: memberList.length == 1 ? memberList[0] : 0,
						fetching: false
					});	
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
			})
		}


    }
	
	onKeyDownMoney(e) {

        if (e.keyCode == 13) {
			setTimeout(this.focusScan.bind(this), 100);
		}
	}




	


		
	onRadioChange = (e) => {
	// console.log('radio checked', e.target.value);
	this.setState({
		radioValue: e.target.value,
	});

	}

	onChangeDate = (value, dateString) => {
		this.setState({ 
			// dateTime: value,
			dateString:dateString,
			visible:false,
		});

		// console.log('Selected Time: ', value);
		// console.log('Formatted Selected Time: ', dateString);

	}

	onOk = (value) => {
		console.log('onOk: ', value);
		this.setState({ 
			// money: e.target.value,
			visible:false,
		});
		setTimeout(this.focusScan(this), 100);
	  }

	onChangeRemark = (e) => {
		this.setState({ changeRemark: e.target.value });
		// console.log('Remark', e.target.value);
	}

	handleScanSelect(value) {
		// console.log('select checked', value);
		this.setState({ scanValue:value });
		// setTimeout(this.focusProof.bind(this), 100);
		// if(value==3){
		// 	setTimeout(this.focusCustomer.bind(this), 100);
		// }else{
		// 	if(this.state.remark){
		// 		setTimeout(this.focusProof.bind(this), 100);
		// 	}else{
		// 		setTimeout(this.focusRemark.bind(this), 100);
		// 	}

		// }

		// setTimeout(this.onClick.bind(this), 100);

	}

	handleScanChange = (value) => {
        this.setState({
            scanValue: value,
		  });
		//   if(value==0){
		// 	this.setState({
		// 		proofVisible: true,
		// 		customerVisible:false,
		// 	  });
		//   }else if(value==3){
		// 	this.setState({
		// 		proofVisible: false,
		// 		customerVisible:true,
		// 	  });
		//   }else{
		// 	this.setState({
		// 		proofVisible: false,
		// 		customerVisible:false,
		// 	  });
		//   }
	}






	onClick= () => {
		// if (this.state.money <= 0) {
		// 	message.warn("请输入充值金额!");
		// } 
		this.params.userId = this.state.memberInfo.userId;

		this.params.type = this.state.radioValue;

		// var money = document.getElementById("info_id_money").value;
		// if (money.length >= 0) {
        //     this.params.amount = money;
		// }

		this.params.hour = this.state.scanValue;





		// let storage = window.localStorage;
		// let outTradeNo = storage.getItem("outTradeNo");
		// if(outTradeNo){
		// 	this.params.outTradeNo = outTradeNo;
		// }else{
		// 	var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];  
		// 	var nums="";  
		// 	for(var i=0;i<32;i++){  
		// 		var id = parseInt(Math.random()*61);  
		// 		nums+=chars[id];  
		// 	} 
		// 	this.params.outTradeNo = nums;
		// }
		// console.log('onClick');

		this.setState({
			visible:true,
		});
		this.countDownAction();
		this.props.handleOpenOk(this.params,2);
	}

	countDownAction(){
        const timeCount = this.state.timerCount;
        this.interval = setInterval(() =>{
            const timer = this.state.timerCount - 1
            if(timer===0){
            this.interval&&clearInterval(this.interval);
            this.setState({
                timerCount: timeCount,
                visible: false
            })
            }else{
            // console.log("---- timer ",timer);
            this.setState({
                timerCount:timer,
                // visible:true,
            })
            }
        },1000)
    }

    render() {
		var children = [];
		children.push(<Option key={0.5}>{'0.5小时'}</Option>);
		children.push(<Option key={1}>{"1小时"}</Option>);
		children.push(<Option key={1.5}>{"1.5小时"}</Option>);
		children.push(<Option key={2}>{"2小时"}</Option>);
		children.push(<Option key={2.5}>{"2.5小时"}</Option>);
		children.push(<Option key={3}>{"3小时"}</Option>);
		children.push(<Option key={4}>{"4小时"}</Option>);
		children.push(<Option key={5}>{"5小时"}</Option>);


        return (
            <div>

                {this.state.memberInfo ? <div class='div_member_info'>
				  <div class='room_pay_info'>
					<Row className='pay_row_info'>
						<Col className='modal_col_state' span={4}>姓名:</Col>
						<Col className='modal_info_name' span={6}>{this.state.memberInfo.name}</Col>
						<Col className='modal_col_state' span={4}>手机:</Col>
						<Col className='modal_info_name' span={6}>{this.state.memberInfo.mobile}</Col>
					</Row>

					<Row className='modal_row_info'>
						<Col className='modal_col_state' span={4}>证件类型:</Col>
						<Col className='modal_info_name' span={6}>{this.state.memberInfo.idTypeName}</Col>
						<Col className='modal_col_state' span={4}>证件号:</Col>
						<Col className='modal_info_name' span={6}>{this.state.memberInfo.idNumber}</Col>
					</Row>

					<Row className='modal_row_info'>

						<Col className='modal_col_state' span={4}>会员等级:</Col>
						<Col className='modal_info_name' span={6}>{this.state.memberInfo.className}</Col>
						<Col className='modal_col_state' span={4}>机座号:</Col>
						<Col className='modal_seat_name' span={6}>256</Col>
					</Row>

					<Row className='modal_row_info'>
						<Col span={8}>
							<span class="room_destine_state">总余额:</span>
							<span class="member_info_money">{(this.state.memberInfo.balance).toFixed(2)}</span>  
						</Col>
						<Col span={8}>
							<span class="room_destine_state">现金金额:</span>
							<span class="member_info_money">{(this.state.memberInfo.cashBalance).toFixed(2)}</span>  
						</Col>
						<Col span={8}>
							<span class="room_destine_state">赠送余额:</span>
							<span class="member_info_money">{(this.state.memberInfo.presentBalance).toFixed(2)}</span>  
						</Col>
					</Row>

					<Divider className='pay_info_divider'/>
					<Row className='modal_row_info'>
						<Col className='modal_input_state' span={4}>包房名称:</Col>
						<Col className='modal_info_name' span={6}>{this.state.roomInfo.areaName}</Col>
						<Col className='modal_col_state' span={4}>包房折扣:</Col>
						<Col className='modal_info_name' span={6}>{this.state.memberInfo.roomDiscount}%</Col>
					</Row>


					<Row className='modal_row_info'>
						<Col className='modal_col_state' span={4}>包房单价:</Col>
						<Col className='modal_info_name' span={6}>{this.state.roomInfo.price.toFixed(2) +"元/小时"}</Col>
						<Col className='modal_col_state' span={4}>折后单价:</Col>
						<Col className='modal_info_name' span={6}>{this.state.memberInfo.roomDiscount}</Col>
					</Row>



					<Row className='modal_row_info'>
						<Col className='modal_col_state' span={4}>扣费类型:</Col>
						<Col className='modal_info_name' span={16}>
								<RadioGroup onChange={this.onRadioChange} value={this.state.radioValue}>
								<Radio className='room_modal_radio' value={0} defaultChecked={true} disabled={true}>手工扣费</Radio>
								<Radio className='room_modal_radio' value={1} defaultChecked={false} disabled={true}>自动扣费</Radio>
							</RadioGroup>
						</Col>

					</Row>

					<div onKeyDown={this.onKeyDownMoney.bind(this)}>
						<Row className='modal_row_info' >
							<Col className='modal_input_state' span={4}>上机时间:</Col>
							<Col className='modal_info_money' span={13}>
								<DatePicker className='modal_input_money'
									showTime
									defaultValue={moment('2018-05-22 10:20', "YYYY-MM-DD HH:mm")}
									disabled={true}
									format="YYYY-MM-DD HH:mm"
									placeholder=""
									onChange={this.onChangeDate}
									onOk={this.onOk}/>
							</Col>
						</Row>
					</div>

					{this.state.remark?<Row className='modal_row_info'>
						<Col className='modal_input_state' span={4}>续费小时:</Col>
						<Col className='modal_info_money' span={13}>
							<Select className='modal_input_money'
								id='info_select_scan'
								ref={(inputScan) => { this.inputScan = inputScan; }}
								disabled={!this.state.remark}
								autoFocus={true}
								value={this.state.scanValue}
								selectValue={this.state.scanValue} 
								defaultValue="" 
								onSelect={this.handleScanSelect.bind(this)} 
								onChange={this.handleScanChange}>

								{children}
								
							</Select>
						</Col>
					</Row>:null}
				  </div>
					<Row className='model_row_account'> 
						<Divider className='modal_bt_divider'/>
						<Button ref={(btCharge) => { this.btCharge = btCharge; }} 
							className='member_bt_account' 
							type="primary" 
							disabled={this.state.visible}
							onClick={this.onClick}>
							确定
						</Button>
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

export default connect(mapStateToProps)(RoomPayInfo);