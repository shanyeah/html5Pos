import React from 'react';
import { Row, Col, Input, Select, Spin ,message ,Radio, Button,Divider} from 'antd';
import { connect } from 'dva';
import '../member/MemberOpenAccount.css'
import * as posService from '../../services/PosService';

const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;

class MemberOpenAccount extends React.Component {
    constructor(props) {
		super(props);
		this.inputPapers = null;
		this.inputNumber = null;
		this.inputName = null;
		this.inputPhone = null;
		this.inputCard = null;
		this.inputMoney = null;
		this.inputScan = null;
		this.inputProof = null;
		this.inputCustomer = null;
		

		this.params={};
        this.state = {
            searchValue:null,
            memberList:[],
            memberInfo: null,
			fetching: false,
			visible:props.visible,
			value: 1,
			typeValue:'12',
			customerValue:'',
			remark:true,
			cardValue:'',
			scanValue:'1',
			signList: [],
			customerList: [],
			customerVisible:false,
			idNumber:props.idNumber,
			userName:props.userName,
			certFlag:props.certFlag,
			proofVisible:false,
			payCategoryId:'',
		}

		// console.log(this.props);
		// console.log("searchValue:",this.state.searchValue);
		// if(props.searchValue && this.state.searchValue.length > 3)this.getMemberInfo(props.searchValue);

		
	}

	componentWillReceiveProps(props) {
		// const input = this.refs.myInput.refs.input;
		// input.focus();
		// console.log("act"+input);
		this.setState({
			visible: props.visible,
			searchValue:props.searchValue,
			idNumber:props.idNumber,
			userName:props.userName,
			certFlag:props.certFlag,
		});

		// console.log("searchValue:",this.state.searchValue);
		if(props.searchValue && props.searchValue.length > 3){
			var params={input:props.searchValue,certFlag:props.certFlag}
			this.getMemberInfo(params);
		}

	}
	
	handleOpen = () => {

		if (this.state.typeValue.length > 0) {
            this.params.idType = this.state.typeValue;
        }
        var idNumber = document.getElementById("open_id_number").value;
        var name = document.getElementById("open_id_name").value;
		var mobile = document.getElementById("open_id_mobile").value;
		var money = document.getElementById("open_id_money").value;


        if (idNumber.length > 0) {
            this.params.idNumber = idNumber;
        }else{
			message.warn("证件号不能为空");
			return;
		}
        if (name.length > 0) {
            this.params.name = name;
        }else{
			message.warn("姓名不能为空");
			return;
		}
        if (mobile.length > 8) {
            this.params.mobile = mobile;
        }else{
			message.warn("请输入正确的手机号");
			return;
		}
        if (money.length > 0) {
            this.params.amount = money;
		}else{
			this.params.amount = 0;
		}
		


        if (this.state.cardValue.length > 0) {
            this.params.classId = this.state.cardValue;
		}
		
		if(this.state.idNumber){
			this.params.certFlag = 1;
		}else{
			this.params.certFlag = 0;
		}

		this.params.type = 0;

		var proof = null;
		if(this.state.scanValue==3){

		}else{
			proof = document.getElementById("open_id_proof").value;
		}
		
		if(this.state.scanValue==0){
			this.params.payType = 0;
		}else if(this.state.scanValue==1){
			this.params.payType = 1;
			this.params.payCategoryId = 0;
			this.params.tn = proof;
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
		}else if(this.state.scanValue==4){
				this.params.payType = 1;
				this.params.payCategoryId = 10;
				if(document.getElementById("info_id_proof")){
					var proof = document.getElementById("info_id_proof").value;
					this.params.payObjectId = proof;
				}
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
		// console.log('params',this.params);
		this.props.handleOpenOk(this.params,1);
    }

    onKeyDown(e) {
		// console.log("keycode",e.keyCode);
        if (e.keyCode == 13) {

			var params={input:this.state.searchValue,certFlag:this.state.certFlag}
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
				fetching: true,
			});
			var that = this;
			posService.queryMemberInfo(params, {
				success: function (data) {
					console.log(data);
					var memberList = data.data.list;

					that.setState({
						memberList: memberList,
						memberInfo: memberList.length == 1 ? memberList[0] : 0,
						fetching: false
					});
					
					if(memberList.length==1){
						that.props.handleSlectType(1,params,memberList[0],false,that.state.certFlag);
					}
					// that.props.handleSlectType(1,that.state.searchValue,that.state.memberInfo);
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
	
	onKeyDown1(e) {
		var input = document.getElementById("member_input_money");
		input.focus;
	}

	onKeyDownNumber(e) {
        if (e.keyCode == 13) {
			setTimeout(this.focusName.bind(this), 100);
		}
	}

	onKeyDownName(e) {
        if (e.keyCode == 13) {
			setTimeout(this.focusPhone.bind(this), 100);
		}
	}
	onKeyDownPhone(e) {
        if (e.keyCode == 13) {
			setTimeout(this.focusCard.bind(this), 100);
		}
	}

	onKeyDownMoney(e) {
        if (e.keyCode == 13) {
			setTimeout(this.focusScan.bind(this), 100);
		}
	}

	onKeyDownProof(e) {
        if (e.keyCode == 13) {
			// setTimeout(this.focusScan.bind(this), 100);
		}
	}

	focusNumber() {
        this.inputNumber && this.inputNumber.focus();
	}

	focusName() {
        this.inputName && this.inputName.focus();
	}

	focusPhone() {
        this.inputPhone && this.inputPhone.focus();
	}
	focusCard() {
        this.inputCard && this.inputCard.focus();
	}

	focusMoney() {
        this.inputMoney && this.inputMoney.focus();
	}

	focusScan() {
        this.inputScan && this.inputScan.focus();
	}

	focusProof() {
        this.inputProof && this.inputProof.focus();
	}
	
	focusCustomer() {
        this.inputCustomer && this.inputCustomer.focus();
	}
	


    onSearch(value) {
		this.state.searchValue = value;

        if (this.state.memberList.length > 0) {
            this.setState({
                memberList: [],
                memberInfo: null,
				fetching: false,
				visible:false
            });
        }
    }

    onSelect(value) {
        for (let i = 0; i < this.state.memberList.length; i++) {
            var member = this.state.memberList[i];
            if (member.userId == value.key) {
                this.setState({
                    memberInfo: member
				})
				this.props.handleSlectType(1,this.state.searchValue,member,false);
                break;
			}   
		}
		// if(this.state.memberList.length>0){
		// 	this.setState({
		// 		visible:false
		// 	});
		// }else{
		// 	this.setState({
		// 		visible:true
		// 	});
		// }

		// if(this.inputPapers && document.activeElement.id==='selectOpenPapers'){
		// 	setTimeout(this.focusNumber.bind(this), 100);
		// }else if(this.inputCard && document.activeElement.id==='selectCard'){
		// 	setTimeout(this.focusMoney.bind(this), 100);
		// }else if(this.inputScan && document.activeElement.id==='selectScan'){
		// 	setTimeout(this.focusProof.bind(this), 100);
		// }
	}
	handleSearchChange = (e) => {
		this.setState({
			certFlag: 0,
			idNumber:null,
			userName:null,
		});
	}

	handleTypeSelect(value) {
		setTimeout(this.focusNumber.bind(this), 100);
	}
	handleCardSelect(value) {
		setTimeout(this.focusMoney.bind(this), 100);
	}
	handleScanSelect(value) {
		if(value==3){
			setTimeout(this.focusCustomer.bind(this), 100);
		}else{
			setTimeout(this.focusProof.bind(this), 100);
		}

	}

	handleCustomerSelect(value) {
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
		
	handleMoneyChange = (e) => {
		this.setState({ 
			remark:e.target.value>0?false:true,
			proofVisible:e.target.value>0?false:true,
			scanValue:e.target.value>0?'1':'1',
		});
		console.log('money', e.target.value);
	}


	
	// handleSelect(value) {

	// 	for (let i = 0; i < this.state.memberList.length; i++) {
    //         var member = this.state.memberList[i];
    //         if (member.memberId == value.key) {
    //             this.setState({
    //                 memberInfo: member
	// 			})
	// 			this.props.handleSlectType(1,this.state.searchValue,member,false);
    //             break;
	// 		}   
	// 	}
	// 	// if(this.state.memberList.length>0){
	// 	// 	this.setState({
	// 	// 		visible:false
	// 	// 	});
	// 	// }else{
	// 	// 	this.setState({
	// 	// 		visible:true
	// 	// 	});
	// 	// }

	// 	console.log('select checked', value);
	// 	setTimeout(this.focusProof().bind(this), 100);

	// }

	handleTypeChange = (value) => {
        this.setState({
            typeValue: value,
		  });
		//   console.log("open",value);
	}
	
	handleCardChange = (value) => {
        this.setState({
            cardValue: value,
		  });
		//   console.log("open",value);
	}

	handleCustomerChange = (value) => {
        this.setState({
            customerValue: value,
		  });
		//   console.log("open",value);
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
	
	onFocus(e) {
        if (window.mjGetCacheData) {
            var list = window.mjGetCacheData("cache.all.classes");
            if (list) {
                var signList = JSON.parse(list);
                if (signList && signList.length > 0) {
					this.setState({
						signList: signList
					});
                }  
			}

		}
        if (this.state.signList.length == 0) {
            this.setState({
                fetching: true
            });
			var that = this;
			// console.log("classes","data12");
            posService.queryClassesList({
                success: function (data) {
					var signList = data.data;
					console.log("classes",data);
                    that.setState({
                        signList: signList,
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
	
	onFocusCustomer(e) {
        if (window.mjGetCacheData) {
            var list = window.mjGetCacheData("cache.all.customers");
            if (list) {
                this.state.customerList = JSON.parse(list);    
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


    render() {
		var that = this;
        return (
            <div>

							<div className='model_div_input'>

								<Row> 
									<Col className='model_search_state' span={3}>会员查询:</Col>    
									<Col className='model_member_search' span={7}>
										<div onKeyDown={this.onKeyDown.bind(this)}>
															<Select
																	mode="combobox"
																	labelInValue
																	style={{ width: "360px" }}
																	placeholder="输入证件号/机座号/手机号"
																	enterButton="查询"
																	notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
																	filterOption={false}
																	optionLabelProp="searchValue"
																	onSearch={this.onSearch.bind(this)}
																	onSelect={this.onSelect.bind(this)}
																	onChange={this.handleSearchChange}>
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
									{this.state.visible?(<Col className='model_no_member' span={8}>	
										用户不存在
									</Col>):null}

								</Row>
								<Divider className='modal_info_divider'/>
							</div>
 
							<div className='div_member_info'> 
								<Row className='modal_row_info'>
									<Col className='modal_input_state' span={4}>证件类型(*):</Col>
									<Col className='modal_info_money' span={13}>
										<Select className='modal_input_money'
											id='selectOpenPapers'
											allowClear={true} 
											autoFocus={true}
											value={this.state.typeValue}
											selectValue={this.state.typeValue} 
											defaultValue="" ref={(managerType) => { this.managerType = managerType; }} 
											onSelect={this.handleTypeSelect.bind(this)} 
											onChange={this.handleTypeChange}>
											<Option value="12">二代身份证</Option>
											<Option value="97">港澳通行证</Option>
											<Option value="96">回乡证</Option>
											<Option value="15">学生证</Option>
											<Option value="20">驾驶证</Option>
											<Option value="90">军官证</Option>
											<Option value="91">警官证</Option>
											<Option value="92">士兵证</Option>
											<Option value="93">户口簿</Option>
											<Option value="94">护照</Option>
											<Option value="95">台胞证</Option>
											<Option value="21">广东居住证</Option>
											<Option value="22">深圳居住证</Option>
											<Option value="99">其他证件</Option>
										</Select>
									</Col>
								</Row>	

								<div onKeyDown={this.onKeyDownNumber.bind(this)}>
									<Row className='modal_row_info'>
										<Col className='modal_input_state' span={4}>证件号(*):</Col>
										<Col className='modal_info_money' span={13}>
											<Input id='open_id_number'
												ref={(inputNumber) => { this.inputNumber = inputNumber; }} 
												className='modal_input_money'
												value={this.state.certFlag==1?this.state.idNumber:""}
												defaultValue={this.state.certFlag==1?this.state.idNumber:""}/>
										</Col>
									</Row>
								</div>
								<div onKeyDown={this.onKeyDownName.bind(this)}>
									<Row className='modal_row_info'>
										<Col className='modal_input_state' span={4}>姓名(*):</Col>
										<Col className='modal_info_money' span={13}>
											<Input id='open_id_name'
												ref={(inputName) => { this.inputName = inputName; }} 
												className='modal_input_money'
												value={this.state.certFlag==1?this.state.userName:""}
												defaultValue={this.state.certFlag==1?this.state.idNumber:""}/>
										</Col>
									</Row>
								</div>
								<div onKeyDown={this.onKeyDownPhone.bind(this)}>
									<Row className='modal_row_info'>
										<Col className='modal_input_state' span={4}>手机:</Col>
										<Col className='modal_info_money' span={13}>
											<Input id='open_id_mobile'
												ref={(inputPhone) => { this.inputPhone = inputPhone; }} 
												className='modal_input_money' 
												defaultValue=""/>
										</Col>
									</Row>
								</div>
								<Row className='modal_row_info'>
									<Col className='modal_input_state' span={4}>会员等级(*):</Col>
									<Col className='modal_info_money' span={13}>
										<Select className='modal_input_money'
											id='selectCard'
											ref={(inputCard) => { this.inputCard = inputCard; }}
											value={this.state.cardValue}
											selectValue={this.state.cardValue} 
											defaultValue="" 
											onFocus={this.onFocus.bind(this)}
											onSelect={this.handleCardSelect.bind(this)} 
											onChange={this.handleCardChange}>
											{this.state.signList.map(d =>
												<Option key={d.id}>
													{d.name}
												</Option>
											)}

										</Select>
									</Col>
								</Row>
								<div onKeyDown={this.onKeyDownMoney.bind(this)}>
									<Row className='modal_row_info'>
										<Col className='modal_input_state' span={4}>充值金额(*):</Col>
										<Col className='modal_info_money' span={13}>
											<Input id='open_id_money'
												ref={(inputMoney) => { this.inputMoney = inputMoney; }} 
												className='modal_input_money' 
												defaultValue="" 
												type="number"
												min="0"
												step='100'
												onChange={this.handleMoneyChange}/>
										</Col>
									</Row>
								</div>
								<Row className='modal_row_info'>
									<Col className='modal_input_state' span={4}>支付类型(*):</Col>
									<Col className='modal_info_money' span={13}>
										<Select className='modal_input_money'
											id='selectScan'
											ref={(inputScan) => { this.inputScan = inputScan; }}
											allowClear={true} 
											value={this.state.scanValue}
											selectValue={this.state.scanValue} 
											defaultValue="" 
											disabled={this.state.remark}
											onSelect={this.handleScanSelect.bind(this)} 
											onChange={this.handleScanChange}>
											<Option value="0">现金支付</Option>
											<Option value="2">银行卡付</Option>
											<Option value="1">扫码支付</Option>
											<Option value="3">客户签单</Option>
											<Option value="4">收钱吧付</Option>
										</Select>
									</Col>
								</Row>
								<div onKeyDown={this.onKeyDownProof.bind(this)}>
								{this.state.customerVisible?
									<Row className='modal_row_info'>
										<Col className='modal_input_state' span={4}>签单客户:</Col>
										<Col className='modal_info_money' span={13}>
										    <Select
												showSearch
												placeholder="选择客户"
												className='modal_input_money'
												ref={(inputCustomer) => { this.inputCustomer = inputCustomer; }}
												allowClear={true} 
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
											<Input id='open_id_proof'
												ref={(inputProof) => { this.inputProof = inputProof; }} 
												className='modal_input_money'
												disabled={this.state.proofVisible}
												defaultValue="" />
			

										</Col>
									</Row>}
								</div>
								
								<Row className='open_row_account'> 
									<Divider className='open_bt_divider'/>
									<Button className='open_bt_account' type="primary" onClick={this.handleOpen}>开户</Button>
								</Row>
						</div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps)(MemberOpenAccount);