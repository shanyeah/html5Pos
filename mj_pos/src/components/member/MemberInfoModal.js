import React from 'react'
import PropTypes from 'prop-types'
import { Input,Radio, Modal,Button,Row,Col,Divider,Select,message} from 'antd'
import './MemberInfoModal.css';
import MemberInfo from '../member/MemberInfo';
import MemberOpenAccount from '../member/MemberOpenAccount';
import * as memberService from '../../services/MemberService';

const Search = Input.Search;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class MemberInfoModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
		    value: 1,
			slectType:1,
			searchValue:"",
			idNumber:null,
			userName:null,
			certFlag:0,
			memberInfo: null,
			visible:false,
		}

        this.handleOk = this.handleOk.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		
	}
	
	componentWillReceiveProps(props) {
		this.setState({
			memberInfo: props.memberInfo,
		  });

		  if(props.idNumber){
			var idNumber = JSON.parse(props.idNumber);
			console.log('idNumber', idNumber);
			this.setState({
				searchValue:idNumber.idNumber,
				idNumber:idNumber.idNumber,
				userName:idNumber.name,
				certFlag:idNumber.certFlag,
			});
		  }else{
			this.setState({
				searchValue:null,
				idNumber:null,
				userName:null,
				certFlag:0,
			});
		  }

	}

    onChange = (e) => {
	    // console.log('radio checked', e.target.value);
	    this.setState({
	      value: e.target.value,
	    });
    }

    handleOpenOk(params,type){
		// console.log(params);
		if(type==1){
			this.getAddMember(params);
		}else{
			this.queryCharge(params);
		}
	}

	handleOk() {
		// var params={};
		// this.getMemberInfo(params);
    }
	handleCancel() {
		  this.props.handleCancel(false);
		  this.setState({
			searchValue:null,
			visible:false,
		});
	}


	handleSlectType(value,searchValue,memberInfo,visible,certFlag) {
        this.setState({
			slectType:value,
			searchValue:searchValue,
			memberInfo:memberInfo,
			visible:visible,
		});
		if(certFlag==0){
			this.setState({
				idNumber:null,
				userName:null,
			});
		}

		// console.log('SlectType', certFlag);
	}
	
    getAddMember(params){
		// console.log("onBtSelect",params);
        var that = this;
        memberService.addMember(params, {
            success: function (data) {
                // console.log("data44",data);
                if(data.code==0){
					if(data.data.amount){
						if(window.mjPrintRechargeBill)window.mjPrintRechargeBill(0, 0, data.data.saleBillId);
					}
					that.props.handleSuccess(true,data.data);
					that.props.handleCancel(false);
                }
            },
            error: function (err) {
				message.warn(err);
            }
        })

	}
	
	queryCharge(params){
		console.log("onBtSelect",params);
        var that = this;
        memberService.queryCharge(params, {
            success: function (data) {
                // console.log("data",data);
                if(data.code==0){
					if(window.mjPrintRechargeBill)window.mjPrintRechargeBill(0, 0, data.data.saleBillId);
					that.props.handleSuccess(true,data.data);
					that.props.handleCancel(false);
					// console.log("data0",data);
                }else{
					// console.log("data1",data);
				}
            },
            error: function (err) {
				console.log(err);
				message.warn(err);
            }
        })

    }


	getCurrentView() {
		
		switch (this.state.slectType) {

			case 1:
				return <MemberInfo handleSlectType = {this.handleSlectType.bind(this)} 
					searchValue={this.state.searchValue} 
					idNumber={this.state.idNumber}
					certFlag={this.state.certFlag}
					memberInfo={this.state.memberInfo} 
					handleOpenOk = {this.handleOpenOk.bind(this)}>
				</MemberInfo>;
			break;
			case 2:
				return <MemberOpenAccount handleSlectType = {this.handleSlectType.bind(this)} 
					searchValue={this.state.searchValue}
					idNumber={this.state.idNumber}
					userName={this.state.userName}
					certFlag={this.state.certFlag}
					visible={this.state.visible}
					handleOpenOk = {this.handleOpenOk.bind(this)}>
				</MemberOpenAccount>;
			default:

				break;

		}

}

    render() {
      return (<div>
		  <Modal title="会员开户/充值"
			visible={this.props.modalVisible}
			width={660}
			bodyStyle={{padding:"0px 0px 0px 0px"}}
			onOk={this.handleOk}
			onCancel={this.handleCancel}
			destroyOnClose={true}
			footer={null}>
			
				<Row span={19}>
					<div className='model_content'>
						{this.getCurrentView()}
					</div>
          		</Row>

		  </Modal>
	  </div>);
    }
}

export default MemberInfoModal;