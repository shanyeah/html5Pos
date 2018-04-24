import React from 'react'
import PropTypes from 'prop-types'
import { Input,Radio, Modal,Button,Row,Col,Divider,Select,message} from 'antd'
import './MemberOrderModal.css';
import MemberOrderContent from '../member/MemberOrderContent';
import MemberOrderRefunds from '../member/MemberOrderRefunds';
import * as memberService from '../../services/MemberService';

const Search = Input.Search;
const RadioGroup = Radio.Group;
const Option = Select.Option;

function handleChange(value) {
  console.log(`selected ${value}`);
}

class MemberOrderModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
		    value: 1,
			selectType:1,
			memberInfo:null,
			saleBillId: null,
			visible:true,
			title:'订单详情',
		}

        this.handleOk = this.handleOk.bind(this);
		this.handleCancel = this.handleCancel.bind(this);

		// console.log("props",props);
		
	}
	
	componentWillReceiveProps(props) {

		if(props.saleBillId){
			this.getMemberInfo(props.saleBillId);
		}
		// console.log("props",props);
		if(props.selectType==1){
			this.setState({
				selectType:1,
				title: '订单详情',
			});	
		}else{
			this.setState({
				selectType:2,
				title: '退款',
			});	
		}

	}

	handleOk() {
		// var params={};
		// this.getMemberInfo(params);
    }
	handleCancel() {
	  	this.props.handleCancel(false);
	}


	
    getMemberInfo(params){
		// console.log("onBtSelect",params);
		// this.props.handleCancel(false);
		// this.props.handleSuccess(true);
        var that = this;
        memberService.queryRechangeDetai(params, {
            success: function (data) {
                console.log("data:",data);
                if(data.code==0){
                    that.setState({
                        memberInfo: data.data,
                    });	
                }
            },
            error: function (err) {
				console.log(err);
				message.warn(err);
            }
        })

    }


	getCurrentView() {
		
		switch (this.state.selectType) {

			case 1:
				return <MemberOrderContent memberInfo={this.state.memberInfo}></MemberOrderContent>;
			break;
			case 2:
				return <MemberOrderRefunds memberInfo={this.state.memberInfo}
					handleCancel = {this.handleCancel.bind(this)}>
				</MemberOrderRefunds>;
			default:
				break;

		}

}

    render() {
      return (<div>
		  <Modal title={this.state.title}
			visible={this.props.modalVisible}
			width={660}
			bodyStyle={{padding:"0px 0px 0px 0px"}}
			onOk={this.handleOk}
			onCancel={this.handleCancel}
			destroyOnClose={true}
			footer={null}>

				<Row span={19}>
					<div class='model_content'>
						{	this.getCurrentView() }
					</div>
          		</Row>

		  </Modal>
	  </div>);
    }
}

export default MemberOrderModal;