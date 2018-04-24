import React from 'react'
import PropTypes from 'prop-types'
import { Modal,Button,Row,Col,Divider,Select,Table,DatePicker,message,Spin} from 'antd'
import './MemberWalletModal.css';

import * as memberService from '../../services/MemberService';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class MemberWalletModal extends React.Component {

    constructor(props) {
        super(props);

        this.params={pageSize:10, pageNum: 1};
        this.state = {
            recordInfo: null,
            data:[],
            pageSize:15,
            total:0,
            title:"明细",
            stateValue:'',
            dateValue:null,
            dateString:[],
            typeValue:'10',
            loading:false,
		}

        this.handleOk = this.handleOk.bind(this);
		this.handleCancel = this.handleCancel.bind(this);

		console.log("props122",props.recordInfo);
		
	}
	
	componentWillReceiveProps(props) {
 
        // console.log("props1221",props.recordInfo);
        if(props.recordInfo){
            this.setState({
                recordInfo: props.recordInfo,
                title:props.recordInfo.name,
              });
            this.params.userId = props.recordInfo.id;
            this.queryWalletLog(this.params);
        }
	}





	handleOk() {
		// var params={};
		// this.getMemberInfo(params);
    }
	handleCancel() {
	  	this.props.handleCancel(false);
	}

    onPageChange = (page) => {
        this.params.pageNum = page.current;
        this.queryWalletLog(this.params);
    }
    handleStateChange = (value) => {
        this.setState({
            dateValue:null,
            dateString:[],
            stateValue: value,
            });
    }

    onTimeChange = (value, dateString) => {

        this.setState({ 
            dateValue:value,
            dateString:dateString,
            stateValue:"",
        }); 

    }
    handleTypeChange = (value) => {
        this.setState({
            typeValue: value,
          });
      }

    onReset = () => {

        this.setState({ 
            stateValue:"",
            dateValue:null,
            dateString:[],
            typeValue:'10'
        }); 

        this.params={pageSize:10, pageNum: 1,userId:this.state.recordInfo.id};
    }

    onBtSelect = () => {

        if (this.state.stateValue.length > 2) {
            this.params.rangeTime = this.state.stateValue;
            if(this.params.startTime)delete this.params["startTime"];
            if(this.params.endTime)delete this.params["endTime"];
        }
        if (this.state.dateString.length > 0) {
            this.params.startTime = this.state.dateString[0];
            this.params.endTime = this.state.dateString[1];
            if(this.params.rangeTime)delete this.params["rangeTime"];
        }
        if(this.state.typeValue==='10'){
            if(this.params.type)delete this.params["type"];
        }else{
            this.params.type=this.state.typeValue;
        }

        this.queryWalletLog(this.params);
    }
	
    queryWalletLog(params){
        // console.log("onBtSelect",params);
        this.setState({
            loading: true,
        });	
        var that = this;
        memberService.queryWalletLog(params, {
            success: function (data) {
                // console.log(data);
                if(data.code==0){
                    var memberList = data.data.list;
                    if(memberList.length>0){
                        for(var i=0; i < memberList.length;i++){
                            var amount = memberList[i].amount.toFixed(2);
                            memberList[i].amount = amount;
                            var cashAmount = memberList[i].cashAmount.toFixed(2);
                            memberList[i].cashAmount = cashAmount;
                            var presentAmount = memberList[i].presentAmount.toFixed(2);
                            memberList[i].presentAmount = presentAmount;
                        }
                    }
                    var pageSize = data.data.pageSize;
                    var total = data.data.total;
                    that.setState({
                        data: memberList,
                        pageSize:pageSize,
                        total:total,
                        loading: false,
                    });	
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

    render() {
        var that = this;
        var columns = [{
            title: 'ID',
            dataIndex: 'id',
            align:'center',
          },{
            title: '类型',
            dataIndex: 'typeName',
            align:'center',
          },{
            title: '门店名称',
            dataIndex: 'organName',
            align:'center',
          },{
            title: '交易金额',
            dataIndex: 'amount',
            align:'center',
          },{
            title: '现金金额',
            dataIndex: 'cashAmount',
            align:'center',
          },{
            title: '赠送金额',
            dataIndex: 'presentAmount',
            align:'center',
          },{
            title: '备注',
            dataIndex: 'remark',
            align:'center',
          },{
            title: '下单时间',
            dataIndex: 'createTime',
            align:'center',
          }
        ];
      return (<div className='wallet_boby'>
		  <Modal title={this.state.title}
			visible={this.props.modalVisible}
			width={960}
			bodyStyle={{padding:"0px 0px 0px 0px"}}
			onOk={this.handleOk}
			onCancel={this.handleCancel}
			destroyOnClose={true}
			footer={null}>

            <div className='wallet_content'>
                <Row className='wallet_search' >
                    <Col  span={13}>
                        <span class='wallet_date_span'>日期:</span>
                        <Select 
                            value={this.state.stateValue}
                            selectValue={this.state.stateValue} 
                            defaultValue="" 
                            ref={(chargeDateState) => { this.chargeDateState = chargeDateState; }} 
                            className='wallet_date_state'
                            onChange={this.handleStateChange}>
                            <Option value="day">今天</Option>
                            <Option value="week">本周</Option>
                            <Option value="month">本月</Option>
                        </Select>

                        <RangePicker 
                            className='wallet_range_picker'
                            dateString={this.state.dateString} 
                            value={this.state.dateValue} 
                            ref={(chargeDate) => { this.chargeDate = chargeDate; }} 
                            onChange={this.onTimeChange} />
                    </Col>

                    <Col  span={6}>
                        <span className='charge_type_state'>类型:</span>
                        <Select 
                            id='charge_id_type'
                            value={this.state.typeValue}
                            selectValue={this.state.typeValue} 
                            defaultValue="" ref={(chargeType) => { this.chargeType = chargeType; }} 
                            className='wallet_select_charge' 
                            onChange={this.handleTypeChange}>
                            <Option value="10">全部</Option>
                            <Option value="0">会员充值</Option>
                            <Option value="1">充值退款</Option>
                            <Option value="2">商品支付</Option>
                            <Option value="3">转账转出</Option>
                            <Option value="4">转账转入</Option>
                        </Select>
                    </Col>
                    <Col  className='wallet_col_4' span={5}>
                        <Button className='wallet_select' type="primary" onClick={this.onBtSelect}>查询</Button>
                        <span style={{ marginLeft: "12px" }}></span>
                        <Button onClick={this.onReset}>重置</Button>
                    </Col>
                </Row>           
                <Divider className='wallet_info_divider'/>
                <Spin className="wallet_spin" size="large" spinning={this.state.loading} ></Spin>
                <Table className='wallet_table_info' columns={columns} dataSource={this.state.data} onChange={this.onPageChange}
                    scroll={{ y: 380}} 
                    pagination={{ pageSize:this.state.pageSize,total:this.state.total}}/>
            </div>
		  </Modal>
	  </div>);
    }
}

export default MemberWalletModal;