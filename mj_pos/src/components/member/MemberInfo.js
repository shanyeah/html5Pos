import React from 'react';
import { Row, Col, Input, Select, Spin ,message ,Radio, Button,Divider} from 'antd';
import { connect } from 'dva';
import '../member/MemberInfo.css'
import * as posService from '../../services/PosService';

const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;


class MemberInfo extends React.Component {
    constructor(props) {
		super(props);
		this.inputMoney = null;
		this.inputScna = null;
		this.inputProof = null;
		this.inputCustomer = null;
		this.inputRemark = null;
		this.params={};
        this.state = {
            searchValue:props.searchValue,
            memberList:[],
            memberInfo: props.memberInfo,
			fetching: false,
			visible:true,
			radioValue: 0,
			remark:true,
			money:0,
			scanValue:'1',
			changeRemark:'',
			idNumber:null,
			proofVisible:false,
			customerList: [],
			customerVisible:false,
			customerValue:'',
			payCategoryId:'',
			certFlag:props.certFlag,
		}
	
		// console.log("searchValue:",this.state.searchValue);
		if(props.searchValue && props.searchValue.length > 3){
			var params={input:props.searchValue,certFlag:props.certFlag};
			this.getMemberInfo(params);
		}
	}


	componentWillReceiveProps(props) {
		// const input = this.refs.myInput.refs.input;
		// input.focus();
		// console.log("act"+input);
		this.setState({
			searchValue:props.searchValue,
			idNumber:props.idNumber,
			certFlag:props.certFlag,
			memberInfo: props.memberInfo,
		});
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

	focus() {
        this.input && this.input.focus();
	}

	focus1() {
        this.inputMoney && this.inputMoney.focus();
	}

	focusScan() {
        this.inputScan && this.inputScan.focus();
	}

	focusProof() {
        this.inputProof && this.inputProof.focus();
	}
	focusRemark() {
        this.inputRemark && this.inputRemark.focus();
	}

	focusCustomer() {
        this.inputCustomer && this.inputCustomer.focus();
	}

    componentDidMount() {
        setTimeout(this.focus.bind(this), 100);
    }


    onKeyDown(e) {
		// console.log('inputMoney',this.inputMoney);
        if (e.keyCode == 13) {
            if (this.state.memberList.length > 0) {
				setTimeout(this.focus1.bind(this), 100);
                return;
			}
			
            // if (this.state.searchValue.length < 3) {
            //     message.warn("请输入3个或以上字符!");
            // } else {
            //     this.setState({
            //         memberList: [],
            //         memberInfo: null,
            //         fetching: true
            //     });
            //     var that = this;
            //     posService.queryMemberInfo(this.state.searchValue, {
            //         success: function (data) {
            //             console.log("infodata",data);
			// 			var memberList = data.data.list;
			// 			if(memberList.length==0){
			// 				that.props.handleSlectType(2,that.state.searchValue,null,true);
			// 			}
            //             that.setState({
            //                 memberList: memberList,
			// 				memberInfo: memberList.length == 1 ? memberList[0] : 0,
            //                 fetching: false
			// 			});	
            //         },
            //         error: function (err) {
            //             console.log(err);
            //             that.setState({
            //                 memberList: [],
            //                 memberInfo: null,
            //                 fetching: false
            //             });
            //         }
            //     })
			// }
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
						that.props.handleSlectType(2,that.state.searchValue,null,true,that.state.certFlag);
					}else{
						setTimeout(that.focus1.bind(that), 100);
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

	onKeyDownCharge(e) {

        if (e.keyCode == 13) {
			setTimeout(this.onClick.bind(this), 100);
			// console.log("提交");
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
		// if(this.state.memberList.length>0){
		// 	this.setState({
		// 		visible:false
        //     });
		// }else{
		// 	this.setState({
		// 		visible:true
		// 	});
		// }

		setTimeout(this.focus1.bind(this), 100);

		}
		
	onRadioChange = (e) => {
	// console.log('radio checked', e.target.value);
	this.setState({
		radioValue: e.target.value,
		remark:e.target.value==2?false:true,
		scanValue:e.target.value==2?"0":"1",
	});

	}

	onChangeMoney = (e) => {
		this.setState({ 
			money: e.target.value,
			visible:e.target.value>0?false:true,
		});
		// console.log('money', e.target.value);
	}

	onChangeRemark = (e) => {
		this.setState({ changeRemark: e.target.value });
		// console.log('Remark', e.target.value);
	}

	handleScanSelect(value) {
		// console.log('select checked', value);
		this.setState({ scanValue:value });
		// setTimeout(this.focusProof.bind(this), 100);
		if(value==3){
			setTimeout(this.focusCustomer.bind(this), 100);
		}else{
			if(this.state.remark){
				setTimeout(this.focusProof.bind(this), 100);
			}else{
				setTimeout(this.focusRemark.bind(this), 100);
			}

		}

	}

	handleScanChange = (value) => {
        this.setState({
            scanValue: value,
		  });
		  if(value==0){
			this.setState({
				proofVisible: true,
				customerVisible:false,
			  });
		  }else if(value==3){
			this.setState({
				proofVisible: false,
				customerVisible:true,
			  });
		  }else{
			this.setState({
				proofVisible: false,
				customerVisible:false,
			  });
		  }
	}
	handleCustomerChange = (value) => {
        this.setState({
            customerValue: value,
		  });
		//   console.log("open",value);
	}

	handleCustomerSelect(value) {
		// console.log("CustomerSelect",value);
		for (let i = 0; i < this.state.customerList.length; i++) {
            var customerList = this.state.customerList[i];
            if (customerList.payObjectId == value) {
				this.setState({
					payCategoryId: customerList.payCategoryId,
				  });
                break;
            }
        }

	}

	onFocusCustomer(e) {
        if (window.mjGetCacheData) {
            var list = window.mjGetCacheData("cache.all.customers");
            if (list) {
				this.state.customerList = JSON.parse(list);  
				var cusList = JSON.parse(list);
                if (cusList && cusList.length > 0) {
					this.setState({
						customerList: cusList
					});
                }   
			}
			
        }
        if (this.state.customerList.length == 0) {
            this.setState({
                fetching: true
            });
            var that = this;
            posService.queryCustomerList({
                success: function (data) {
                    var customerList = data.data;
                    that.setState({
                        customerList: customerList,
                        fetching: false
                    });
                },
                error: function (err) {
                    console.log(err);
                    message.warn(err);
                    that.setState({
                        fetching: false
                    });
                }
            });
        }
    }

	onClick= () => {
		// if (this.state.money <= 0) {
		// 	message.warn("请输入充值金额!");
		// } 
		this.params.userId = this.state.memberInfo.userId;

		this.params.type = this.state.radioValue;

		var money = document.getElementById("info_id_money").value;
		if (money.length >= 0) {
            this.params.amount = money;
		}

		if(this.state.scanValue==0){
			this.params.payType = 0;
		}else if(this.state.scanValue==1){
			this.params.payType = 1;
			this.params.payCategoryId = 0;
			if(document.getElementById("info_id_proof")){
				var proof = document.getElementById("info_id_proof").value;
				this.params.tn = proof;
			}
		}else if(this.state.scanValue==2){
			this.params.payType = 1;
			this.params.payCategoryId = 1;
		}else if(this.state.scanValue==3){
			this.params.payType = 3;
			if(this.state.customerValue){
				this.params.payObjectId = this.state.customerValue;
				this.params.payCategoryId = this.state.payCategoryId;
			}else{
				message.warn("请选择签单客户!");
				return;
			}

			// if(document.getElementById("info_id_proof")){
			// 	var proof = document.getElementById("info_id_proof").value;
			// 	this.params.payCategoryId = proof;
			// 	this.params.payObjectId = proof;
			// }
		}else if(this.state.scanValue==4){
			this.params.payType = 1;
			this.params.payCategoryId = 10;
			if(document.getElementById("info_id_proof")){
				var proof = document.getElementById("info_id_proof").value;
				this.params.payObjectId = proof;
			}
		}

		if(this.state.radioValue==2){
			var remark = document.getElementById("info_id_remark").value;
			this.params.remark = remark;
		}


		let storage = window.localStorage;
		let outTradeNo = storage.getItem("outTradeNo");
		if(outTradeNo){
			this.params.outTradeNo = outTradeNo;
		}else{
			var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];  
			var nums="";  
			for(var i=0;i<32;i++){  
				var id = parseInt(Math.random()*61);  
				nums+=chars[id];  
			} 
			this.params.outTradeNo = nums;
		}
		// console.log('onClick');
		this.props.handleOpenOk(this.params,2);
	}



    render() {
		var children = [];
		children.push(<Option key={0}>{'现金支付'}</Option>);
		children.push(<Option key={1}>{"扫码支付"}</Option>);
		children.push(<Option key={2}>{"银行卡付"}</Option>);
		children.push(<Option key={3}>{"客户签单"}</Option>);
		children.push(<Option key={4}>{"收钱吧付"}</Option>);
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
								</Row>
								<Divider className='modal_info_divider'/>
							</div>

                {this.state.memberInfo ? <div className='div_member_info'>
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
									<Col className='modal_col_state' span={4}>商品折扣:</Col>
									<Col className='modal_info_name' span={6}>{this.state.memberInfo.goodsDiscount}%</Col>
									<Col className='modal_col_state' span={4}>包房折扣:</Col>
									<Col className='modal_info_name' span={6}>{this.state.memberInfo.roomDiscount}%</Col>
								</Row>

								<Row className='modal_row_info'>
									<Col className='modal_col_state' span={4}>总余额:</Col>
									<Col className='member_info_money' span={6}>{(this.state.memberInfo.balance).toFixed(2)}</Col>
								</Row>
								<Row className='modal_row_info'>
									<Col className='modal_col_state' span={4}>现金金额:</Col>
									<Col className='member_info_money' span={6}>{(this.state.memberInfo.cashBalance).toFixed(2)}</Col>
									<Col className='modal_col_state' span={4}>赠送余额:</Col>
									<Col className='member_info_money' span={6}>{(this.state.memberInfo.presentBalance).toFixed(2)}</Col>
								</Row>
								<Row className='modal_row_info'>
									<Col className='modal_col_state' span={4}>充值类型:</Col>
									<Col className='modal_info_name' span={16}>
											<RadioGroup onChange={this.onRadioChange} value={this.state.radioValue}>
											<Radio className='modal_radio' value={0}>现金充值(有送)</Radio>
											<Radio className='modal_radio' value={1}>现金充值(无送)</Radio>
											<Radio className='modal_radio' value={2}>赠送充值</Radio>
										</RadioGroup>
									</Col>
	
								</Row>

								<div onKeyDown={this.onKeyDownMoney.bind(this)}>
									<Row className='modal_row_info' >
										<Col className='modal_input_state' span={4}>充值金额:</Col>
										<Col className='modal_info_money' span={13}>
											<Input ref={(inputMoney) => { this.inputMoney = inputMoney; }} 
												id='info_id_money'
												className='modal_input_money' 
												defaultValue="" 
												type="number"
												min="0"
												step='100'
												onChange={this.onChangeMoney}/>
										</Col>
									</Row>
								</div>
								<Row className='modal_row_info'>
									<Col className='modal_input_state' span={4}>支付类型:</Col>
									<Col className='modal_info_money' span={13}>
										<Select className='modal_input_money'
											id='info_select_scan'
											ref={(inputScan) => { this.inputScan = inputScan; }}
											allowClear={true} 
											disabled={!this.state.remark}
											value={this.state.scanValue}
											selectValue={this.state.scanValue} 
											defaultValue="" 
											onSelect={this.handleScanSelect.bind(this)} 
											onChange={this.handleScanChange}>

											{children}
											
										</Select>
									</Col>
								</Row>
								{this.state.remark?(<div onKeyDown={this.onKeyDownCharge.bind(this)}>

									{this.state.customerVisible?
									<Row className='modal_row_info'>
										<Col className='modal_input_state' span={4}>签单客户:</Col>
										<Col className='modal_info_money' span={13}>
										    <Select
												showSearch
												placeholder="选择客户"
												className='modal_input_money'
												ref={(inputCustomer) => { this.inputCustomer = inputCustomer; }}
												value={this.state.customerValue}
												selectValue={this.state.customerValue}
												optionFilterProp="children"
												notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
												onFocus={this.onFocusCustomer.bind(this)}
												onSelect={this.handleCustomerSelect.bind(this)} 
												onChange={this.handleCustomerChange}>
												{this.state.customerList.map(d =>
													<Option key={d.payObjectId}>
														{d.name}
													</Option>
												)}
											</Select>
										</Col>
									</Row>:<Row className='modal_row_info'>
										<Col className='modal_input_state' span={4}>支付凭证:</Col>
										<Col className='modal_info_money' span={13}>
											<Input id='info_id_proof'
												ref={(inputProof) => { this.inputProof = inputProof; }} 
												className='modal_input_money'
												disabled={this.state.proofVisible}
												defaultValue="" />
										</Col>
									</Row>}
								</div>):(<Row className='modal_row_info'>
									<Col className='modal_input_state' span={4}>备注信息:</Col>
									<Col className='modal_info_money' span={13}>
										<Input className='modal_input_money'
											id='info_id_remark'
											ref={(inputRemark) => { this.inputRemark = inputRemark; }} 
											defaultValue="" 
											onChange={this.onChangeRemark}/>
									</Col>
								</Row>)}
		
								<Row className='model_row_account'> 
									<Divider className='modal_bt_divider'/>
									<Button ref={(btCharge) => { this.btCharge = btCharge; }} 
										className='member_bt_account' 
										type="primary" 
										disabled={this.state.visible}
										onClick={this.onClick}>
										充值
									</Button>
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

export default connect(mapStateToProps)(MemberInfo);