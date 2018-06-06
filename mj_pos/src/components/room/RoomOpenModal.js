import React from 'react'
import PropTypes from 'prop-types'
import { Input,Radio, Modal,Button,Row,Col,Divider,Select,message} from 'antd'
import './RoomOpenModal.css';
import RoomDestineInfo from './RoomDestineInfo';
import RoomCancelInfo from './RoomCancelInfo';
import RoomPayInfo from './RoomPayInfo';
import RoomOffInfo from './RoomOffInfo';
import * as memberService from '../../services/MemberService';
import * as posService from '../../services/PosService';

const Search = Input.Search;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class RoomOpenModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
		    value: 1,
			slectType:0,
			searchValue:"",
			idNumber:null,
			userName:null,
			certFlag:0,
			memberInfo: null,
			visible:false,
			infoVisible:false,
			roomInfo: null,
		}

        this.handleOk = this.handleOk.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		
	}
	
	componentWillReceiveProps(props) {
		this.setState({
			slectType:props.slectType,
			memberInfo: props.memberInfo,
			infoVisible:props.infoVisible,
			roomInfo: props.roomInfo,
		  });

		  if(props.idNumber){
			var idNumber = JSON.parse(props.idNumber);
			this.setState({
				searchValue:idNumber.idNumber,
				idNumber:idNumber.idNumber,
				userName:idNumber.name,
				certFlag:idNumber.certFlag,
				slectType:props.slectType,
			});

			var params={input:idNumber.idNumber,certFlag:this.state.certFlag}
			this.getMemberInfo(params);

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
		console.log("---params",params);
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
		// console.log("onBtSelect",params);
        var that = this;
        memberService.queryCharge(params, {
            success: function (data) {
				// console.log("---data",data);
				// console.log("---data",data.data.saleBillId);
                if(data.code==0){
					that.setState({
						visible:false,
					});
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
						that.handleSlectType(2,that.state.searchValue,null,true,that.state.certFlag);
					}else{
						that.handleSlectType(1,that.state.searchValue,null,true,that.state.certFlag);
					}
	
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


	getCurrentView() {
		
		switch (this.state.slectType) {

			case 0:
				return <RoomDestineInfo handleSlectType = {this.handleSlectType.bind(this)} 
					searchValue={this.state.searchValue} 
					idNumber={this.state.idNumber}
					certFlag={this.state.certFlag}
					memberInfo={this.state.memberInfo} 
					roomInfo={this.state.roomInfo} 
					handleOpenOk = {this.handleOpenOk.bind(this)}>
				</RoomDestineInfo>;
			break;

			case 2:
				return <RoomCancelInfo handleSlectType = {this.handleSlectType.bind(this)} 
					searchValue={this.state.searchValue} 
					idNumber={this.state.idNumber}
					certFlag={this.state.certFlag}
					memberInfo={this.state.memberInfo} 
					roomInfo={this.state.roomInfo} 
					handleOpenOk = {this.handleOpenOk.bind(this)}>
					</RoomCancelInfo>;
				break;
			
			case 3:
				return <RoomPayInfo handleSlectType = {this.handleSlectType.bind(this)} 
				searchValue={this.state.searchValue} 
				idNumber={this.state.idNumber}
				certFlag={this.state.certFlag}
				memberInfo={this.state.memberInfo} 
				roomInfo={this.state.roomInfo} 
				handleOpenOk = {this.handleOpenOk.bind(this)}>
				</RoomPayInfo>;
				break;
			case 4:
				return <RoomOffInfo handleSlectType = {this.handleSlectType.bind(this)} 
				searchValue={this.state.searchValue} 
				idNumber={this.state.idNumber}
				certFlag={this.state.certFlag}
				memberInfo={this.state.memberInfo} 
				roomInfo={this.state.roomInfo} 
				handleOpenOk = {this.handleOpenOk.bind(this)}>
				</RoomOffInfo>;
				break;

			default:

				break;

		}

}

    render() {
      return (<div>
		  <Modal title={this.props.title}
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

export default RoomOpenModal;