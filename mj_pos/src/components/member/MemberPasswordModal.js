import React from 'react'
import PropTypes from 'prop-types'
import { Modal,Button,Row,Col,Divider,Select,Table,DatePicker,message,Spin,Input,Icon} from 'antd'
import './MemberPasswordModal.css';

import * as memberService from '../../services/MemberService';
import NumericInput from '../base/NumericInput';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class MemberPasswordModal extends React.Component {

    constructor(props) {
        super(props);
        this.inputPhone = null;
        this.inputCode = null;
        this.inputPassword = null;
		this.inputPassword1 = null;

        this.params={userId:0};
        this.state = {
            modalVisible:false,
            recordInfo: null,
            mobile:"",
            title:"修改支付密码",
            loading:false,
            codeDisable:false,
            timerTitle:'获取验证码',
            timerCount:60,
            passwordValue:"",
            password1Value:"",
		}

        this.handleOk = this.handleOk.bind(this);
		this.handleCancel = this.handleCancel.bind(this);

		// console.log("props122",props.recordInfo);
		
	}
	
	componentWillReceiveProps(props) {
 
        // console.log("props1221",props.recordInfo);
        if(props.recordInfo){
            this.setState({
                recordInfo: props.recordInfo,
                mobile:props.recordInfo.mobile,
                modalVisible:props.modalVisible,
              });
            this.params.userId = props.recordInfo.id;
            // this.queryWalletLog(this.params);
        }
    }
    componentWillUnmount(){
        this.interval&&clearInterval(this.interval);
    }

	handleOk() {
		// var params={};
		// this.getMemberInfo(params);
    }
	handleCancel() {
        this.interval&&clearInterval(this.interval);
        this.setState({
            timerCount: 60,
            timerTitle:'获取验证码',
            codeDisable: false,
        })
	  	this.props.handleCancel(false);
    }

    onPasswordChange = (value) => {
        this.setState({ 
            passwordValue:value, 
        });
      }

    onPassword1Change = (value) => {
        this.setState({ 
            password1Value:value, 
        });
      }
    
    onKeyDownPhone(e) {
        if (e.keyCode == 13) {
			// setTimeout(this.focusCard.bind(this), 100);
		}
    }

    onKeyDownCode(e) {
        if (e.keyCode == 13) {
			setTimeout(this.focusPassword.bind(this), 100);
		}
	}
    onKeyDownPassword(e) {
        if (e.keyCode == 13) {
			setTimeout(this.focusPassword1.bind(this), 100);
		}
	}
	onKeyDownPassword1(e) {
        if (e.keyCode == 13) {
			// setTimeout(this.focusMoney.bind(this), 100);
		}
	}


	focusPassword() {
        this.inputPassword && this.inputPassword.inputFouces();
	}
	focusPassword1() {
        this.inputPassword1 && this.inputPassword1.inputFouces();
    }
    


    countDownAction(){
        const codeTime = this.state.timerCount;
        this.interval = setInterval(() =>{
            const timer = this.state.timerCount - 1
            if(timer===0){
            this.interval&&clearInterval(this.interval);
            this.setState({
                timerCount: codeTime,
                timerTitle:'获取验证码',
                codeDisable: false
            })
            }else{
            // console.log("---- timer ",timer);
            this.setState({
                timerCount:timer,
                timerTitle: `重新获取(${timer}s)`,
                codeDisable:true,
            })
            }
        },1000)
    }



    onBtCode = () => {
        

        var mobile = document.getElementById("update_id_mobile").value;
        if (mobile.length < 10) {
            message.warn("请输入正确的手机号");
			return;
        }
        var regex = /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/;
        if (!regex.test(mobile)) { 
            message.warn("请输入正确的手机号");
			return;
        }

        this.countDownAction();  

        this.setState({
            loading: true,
        });	
        var that = this;
        var param = {mobile:mobile, type:5};
        // console.log("param",param);
        memberService.sendSms(param, {
            success: function (data) {
                // console.log(data);
                if(data.code==0){

                }
            },
            error: function (err) {
                that.setState({
                    loading: false,
                });	
                console.log(err);
            }
        })


    }

    onBtSelect = () => {
        var mobile = document.getElementById("update_id_mobile").value;
        var regex = /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/;
        if (!regex.test(mobile)) { 
            message.warn("请输入正确的手机号");
			return;
        }
        if (mobile.length < 10) {
            message.warn("请输入正确的手机号");
			return;
        }else{
            this.params.mobile = mobile;
        }
        var password = document.getElementById("update_id_password").value;
        var password1 = document.getElementById("update_id_password1").value;

        if(password.length<6){
            message.warn("请输入6位数字密码");
            return;
        }
        if(password!=password1){
            message.warn("确认密码不正确");
            return;
        }

        // var forge = require('node-forge');
        // var md = forge.md.md5.create();
        // md.update(password1);
        // this.params.password = md.digest().toHex();

        this.params.password = password1;

        var code = document.getElementById("update_id_code").value;
        if(code.length<3){
            message.warn("请输入正确的验证码");
            return;
        }else{
            this.params.code = code;
        }



        this.setingPayPassword(this.params);
    }
	
    setingPayPassword(params){
        console.log("onBtSelect",params);
        this.setState({
            loading: true,
        });	
        var that = this;
        memberService.setingPayPassword(params, {
            success: function (data) {
                // console.log(data);
                if(data.code==0){
                    message.warn(data.message);
                    // that.props.handleCancel(false);
                    that.handleCancel();
                }else{
                    message.warn(data.message);
                }
            },
            error: function (err) {
                that.setState({
                    loading: false,
                });	
                console.log(err);
                message.warn(err);
            }
        })

    }

    render() {
        var that = this;

      return (<div class='wallet_boby'>
		  <Modal title={this.state.title}
			visible={this.props.modalVisible}
			width={480}
			bodyStyle={{padding:"0px 0px 0px 0px"}}
			onOk={this.handleOk}
			onCancel={this.handleCancel}
			destroyOnClose={true}
			footer={null}>
            <div class='member_password_content'>
                <div onKeyDown={this.onKeyDownPhone.bind(this)}>
                    <Row className='modal_row_info'>
                        <Col className='modal_password_state' span={4}>手机号码:</Col>
                        <Col className='update_password_phone' span={8}>
                            <Input id='update_id_mobile'
                                ref={(inputPhone) => { this.inputPhone = inputPhone; }} 
                                className='update_password_input'
                                disabled={true} 
                                defaultValue={this.state.mobile}/>
                        </Col>
                        <Col  className='password_col_4' span={5}>
                            <Button className='update_password_code' 
                                disabled={this.state.codeDisable}
                                type="primary" 
                                onClick={this.onBtCode}>{this.state.timerTitle}</Button>

                        </Col>
                    </Row>
                </div>
                <div onKeyDown={this.onKeyDownCode.bind(this)}>
                                        <Row className='modal_row_info'>
                                            <Col className='modal_password_state' span={4}>验证码:</Col>
                                            <Col className='update_password_phone' span={8}>
                                                <Input id='update_id_code'
                                                    ref={(inputCode) => { this.inputCode = inputCode; }} 
                                                    autoFocus={true}
                                                    className='update_password_input'/>
                                            </Col>
                                        </Row>
                                    </div>
                <div onKeyDown={this.onKeyDownPassword.bind(this)}>
                    <Row className='modal_row_info'>
                        <Col className='modal_password_state' span={4}>支付密码:</Col>
                        <Col className='update_password_phone' span={8}>
                            <NumericInput 
                                id='update_id_password'
                                ref={(inputPassword) => { this.inputPassword = inputPassword; }} 
                                value={this.state.passwordValue} 
                                className='update_password_input'
                                type="password" 
                                onChange={this.onPasswordChange} />
                        </Col>
                        <Col className='modal_input_passsword' span={7}>	
                            (6位数字密码)
                        </Col>
                    </Row>
                </div>
                <div onKeyDown={this.onKeyDownPassword1.bind(this)}>
                    <Row className='modal_row_info'>
                        <Col className='modal_password_state' span={4}>确认密码:</Col>
                        <Col className='update_password_phone' span={8}>
                            <NumericInput 
                                id='update_id_password1'
                                ref={(inputPassword1) => { this.inputPassword1 = inputPassword1; }} 
                                value={this.state.password1Value} 
                                className='update_password_input'
                                type="password" 
                                onChange={this.onPassword1Change} />
                        </Col>
                        <Col className='modal_input_passsword' span={7}>	
                            (6位数字密码)
                        </Col>
                    </Row>
                </div>

                <Row className='open_row_account'> 
                    <Divider className='open_bt_divider'/>
                    <Button className='open_bt_account' type="primary" onClick={this.onBtSelect}>确定</Button>
                </Row>
        
            </div>
		  </Modal>
	  </div>);
    }
}

export default MemberPasswordModal;