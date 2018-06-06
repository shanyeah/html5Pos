import React from 'react';
import { Row, Col, Input, Select, Spin ,message ,Radio, Button,Divider,DatePicker} from 'antd';
import { connect } from 'dva';
import './RoomDestineInfo.css'
import * as memberService from '../../services/MemberService';
import * as posService from '../../services/PosService';

const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;


class RoomDestineInfo extends React.Component {
    constructor(props) {
		super(props);
		this.input = null;
		this.inputDiscount = null;
		this.inputDate = null;
		this.inputScan = null;

		this.params={};
        this.state = {
            searchValue:props.searchValue,
            memberList:[],
			memberInfo: props.memberInfo,
			roomInfo:props.roomInfo,
			fetching: false,
			searchVisible:false,
			visible:true,
			radioValue: 1,
			remark:false,
			money:0,
			scanValue:'2',
			discountValue:'100',
			idNumber:null,
			dateString:'',

			certFlag:props.certFlag,
			timerCount:6,
		}
	
		// console.log("searchValue:",this.state.searchValue);
		// if(props.searchValue && props.searchValue.length > 3){
		// 	var params={input:props.searchValue,certFlag:props.certFlag};
		// 	this.getMemberInfo(params);
		// }
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

	}
	
	componentDidUpdate(prevProps, prevState) {
		// console.log("searchValue1:",this.state.searchValue);
		// const input = this.member_input_money.refs.input;
		// input.focus();
		// console.log("act"+input);
		// document.querySelector('#member_input_money').focus();
	}

	componentDidMount() {
        setTimeout(this.focus.bind(this), 100);
	}
	
	focus() {
        this.input && this.input.focus();
	}

	focusDiscount() {
        this.inputDiscount && this.inputDiscount.focus();
	}

	focusDate() {
        this.inputDate && this.inputDate.focus();
	}

	focusScan() {
        this.inputScan && this.inputScan.focus();
	}



    onKeyDown(e) {
		// console.log('inputMoney',this.inputMoney);
        if (e.keyCode == 13) {
            if (this.state.memberList.length > 0) {
				setTimeout(this.focusDate.bind(this), 100);
                return;
			}

			var params={input:this.state.searchValue,certFlag:this.state.certFlag};
			this.getMemberInfo(params);
		}
		
		
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
						setTimeout(that.focusDate.bind(that), 100);
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
	
	onKeyDownDiscount(e) {

        if (e.keyCode == 13) {
			setTimeout(this.focusDate.bind(this), 100);
		}
	}
	
	onKeyDownDate(e) {

        if (e.keyCode == 13) {
			setTimeout(this.focusScan.bind(this), 100);
		}
	}



    onSearch(value) {
		this.state.searchValue = value;
		// console.log("onSearch",value);
		this.setState({
			certFlag: 0,
		});
        if (this.state.memberList.length > 0) {
            this.setState({
                memberList: [],
                memberInfo: null,
				fetching: false,
            });
        }
    }

    onSelect(value) {
        for (let i = 0; i < this.state.memberList.length; i++) {
            const member = this.state.memberList[i];
            if (member.userId == value.key) {
                this.setState({
                    memberInfo: member
                })
                break;
			}   
		}

		setTimeout(this.focusDate.bind(this), 100);

		}
		
	onRadioChange = (e) => {
	// console.log('radio checked', e.target.value);
	this.setState({
		radioValue: e.target.value,
		remark:e.target.value==0?true:false,
	});

	setTimeout(this.focusDate.bind(this), 100);

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


	handleDiscountSelect(value) {
		console.log('select checked', value);
		this.setState({ discountValue:value });

	}

	handleDiscountChange = (value) => {
        this.setState({
            discountValue: value,
		  });

		  console.log('select checked', value);

	}



	handleScanSelect(value) {
		// console.log('select checked', value);
		this.setState({ scanValue:value });

	}

	handleScanChange = (value) => {
        this.setState({
            scanValue: value,
		  });

	}






	onClick= () => {

		this.params.userId = this.state.memberInfo.userId;

		this.params.type = this.state.radioValue;

		if (this.state.dateString.length < 1) {
			message.warn("请选择上机时间!");
			return;
		} 
		this.params.dateString = this.state.dateString;

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
		children.push(<Option key={1}>{'1小时'}</Option>);
		children.push(<Option key={2}>{"2小时"}</Option>);
		children.push(<Option key={3}>{"3小时"}</Option>);
		children.push(<Option key={4}>{"4小时"}</Option>);
		children.push(<Option key={5}>{"5小时"}</Option>);
		children.push(<Option key={6}>{"6小时"}</Option>);
		children.push(<Option key={7}>{"7小时"}</Option>);
		children.push(<Option key={8}>{"8小时"}</Option>);


        return (
            <div>

				<div className='model_div_input'>

					<Row> 
						<Col className='model_search_state' span={3}>会员查询:</Col>    
						<Col className='model_member_search' span={7}>
							<div onKeyDown={this.onKeyDown.bind(this)}>
												<Select
														ref={(input) => { this.input = input; }}
														destroyOnClose={true}
														autoFocus={true}
														mode="combobox"
														labelInValue
														style={{ width: "360px" }}
														placeholder="输入证件号/机座号/手机号"
														enterButton="查询"
														notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
														filterOption={false}
														optionLabelProp="searchValue"
														onSearch={this.onSearch.bind(this)}
														onSelect={this.onSelect.bind(this)}>
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
						</Col>
						{this.state.searchVisible?(<Col className='model_no_member' span={8}>	
							用户不存在
						</Col>):null}
					</Row>
					<Divider className='modal_info_divider'/>
				</div>

                {this.state.memberInfo ? <div class='div_member_info'>
				  <div class='room_destine_info'>
					<Row className='modal_row_info'>
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
					<Divider className='modal_info_divider'/>
					<Row className='modal_row_info'>
						<Col className='modal_input_state' span={4}>包房名称:</Col>
						<Col className='modal_info_name' span={6}>{this.state.roomInfo.areaName}</Col>
					</Row>
					<div onKeyDown={this.onKeyDownDiscount.bind(this)}>
					<Row className='modal_row_info'>
						<Col className='modal_input_state' span={4}>包房单价:</Col>
						<Col className='destine_info_name' span={6}>{this.state.roomInfo.price.toFixed(2) +"元/小时"}</Col>
						<Col className='destine_discount_state' span={4}>打折:</Col>
						<Col className='modal_info_name' span={6}>
							<Select className='modal_input_money'
									id='info_select_discount'
									mode="combobox"
									ref={(inputDiscount) => { this.inputDiscount = inputDiscount; }}
									value={this.state.discountValue}
									selectValue={this.state.discountValue} 
									defaultValue="" 
									onSelect={this.handleDiscountSelect.bind(this)} 
									onChange={this.handleDiscountChange}>
									<Option value="100">100</Option>
									<Option value="90">90</Option>
      								<Option value="80">80</Option>
									<Option value="70">70</Option>
      								<Option value="60">60</Option>
								
							</Select>
						
						</Col>
					</Row>
					</div>

					<Row className='modal_row_info'>
						<Col className='modal_input_state' span={4}>折后价格:</Col>
						<Col className='destine_info_name' span={6}>{(this.state.roomInfo.price*this.state.discountValue/100).toFixed(2) +"元/小时"}</Col>
					</Row>



					<Row className='modal_row_info'>
						<Col className='modal_input_state' span={4}>扣费类型:</Col>
						<Col className='modal_info_name' span={16}>
								<RadioGroup onChange={this.onRadioChange} value={this.state.radioValue}>
								<Radio className='room_modal_radio' value={0}>手工扣费</Radio>
								<Radio className='room_modal_radio' value={1}>自动扣费</Radio>
							</RadioGroup>
						</Col>

					</Row>

					<div onKeyDown={this.onKeyDownDate.bind(this)}>
						<Row className='modal_row_info' >
							<Col className='modal_input_state' span={4}>上机时间:</Col>
							<Col className='modal_info_money' span={13}>
								<DatePicker className='modal_input_money'
								    ref={(inputDate) => { this.inputDate = inputDate; }}
									showTime
									format="YYYY-MM-DD HH:mm"
									placeholder=""
									onChange={this.onChangeDate}
									onOk={this.onOk}/>
							</Col>
						</Row>
					</div>

					{this.state.remark?<Row className='modal_row_info'>
						<Col className='modal_input_state' span={4}>包房小时:</Col>
						<Col className='modal_info_money' span={13}>
							<Select className='modal_input_money'
								id='info_select_scan'
								ref={(inputScan) => { this.inputScan = inputScan; }}
								disabled={!this.state.remark}
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

export default connect(mapStateToProps)(RoomDestineInfo);