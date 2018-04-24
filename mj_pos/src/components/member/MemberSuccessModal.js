import React from 'react'
import PropTypes from 'prop-types'
import { Input,Radio, Modal,Button,Row,Col,Divider,Select} from 'antd'
import './MemberSuccessModal.css';
import MemberSuccessContent from '../member/MemberSuccessContent';
import MemberOpenAccount from '../member/MemberOpenAccount';
import * as memberService from '../../services/MemberService';

const Search = Input.Search;
const RadioGroup = Radio.Group;
const Option = Select.Option;

function handleChange(value) {
  console.log(`selected ${value}`);
}

class MemberSuccessModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
		    value: 1,
			slectType:1,
			searchValue:"",
			memberInfo: null,
			visible:true,
		}

        this.handleOk = this.handleOk.bind(this);
		this.handleCancel = this.handleCancel.bind(this);

		// console.log("props",props);
		
	}
	
	componentWillReceiveProps(props) {

		this.setState({
			memberInfo: props.memberInfo,
		  });
	}



    handleOpenOk(){
		console.log(4555);
		// var params={};
		// this.getMemberInfo(params);
	}

	handleOk() {
		// var params={};
		// this.getMemberInfo(params);
    }
	handleCancel() {
	  	this.props.handleCancel(false);
	}

	handleChange = (e) => {
		// console.log('select checked', e.target.value);

	}

	handleSlectType(value,searchValue,memberInfo,visible) {
        // this.setState({
		// 	slectType:value,
		// 	searchValue:searchValue,
		// 	// memberInfo:memberInfo,
		// 	visible:visible
		// });

		// console.log('SlectType', value+","+searchValue+memberInfo);
	}
	
    // getMemberInfo(params){
	// 	console.log("onBtSelect",params);
	// 	// this.props.handleCancel(false);
	// 	this.props.handleSuccess(true);
    //     // var that = this;
    //     // memberService.queryChargeInfo(params, {
    //     //     success: function (data) {
    //     //         console.log(data);
    //     //         if(data.code==0){
    //     //             var memberList = data.data.list;
    //     //             var pageSize = data.data.pageSize;
    //     //             var total = data.data.total*pageSize;
    //     //             that.setState({
    //     //                 data: memberList,
    //     //                 pageSize:pageSize,
    //     //                 total:total,
    //     //             });	
    //     //         }
    //     //     },
    //     //     error: function (err) {
    //     //         console.log(err);
    //     //     }
    //     // })

    // }


	getCurrentView() {
		
		switch (this.state.slectType) {

			case 1:

				return <MemberSuccessContent searchValue={this.state.searchValue} memberInfo={this.state.memberInfo} visible={this.state.visible}></MemberSuccessContent>;
			break;
			case 2:
				// return <MemberOpenAccount 
				// 	handleSlectType = {this.handleSlectType.bind(this)} 
				// 	searchValue={this.state.searchValue}
				// 	handleOpenOk = {this.handleOpenOk.bind(this)}>
				// </MemberOpenAccount>;
			default:

				break;

		}

}

    render() {
      return (<div>
		  <Modal title="开户/充值成功"
			visible={this.props.modalVisible}
			width={660}
			bodyStyle={{padding:"0px 0px 0px 0px"}}
			onOk={this.handleOk}
			onCancel={this.handleCancel}
			destroyOnClose={true}
			footer={null}>

				<Row span={19}>
					<div className='model_content'>
						{	this.getCurrentView() }
					</div>
          		</Row>

		  </Modal>
	  </div>);
    }
}

export default MemberSuccessModal;