import React from 'react';
import windowSize from 'react-window-size'
import './MemberChargeInfo.css';
import { connect } from 'dva';
import { Menu, Icon,Table, Input,Button,Divider,Row, Col,Select,DatePicker,message,Spin } from 'antd';
import * as memberService from '../../services/MemberService';
import MemberOrderModal from './MemberOrderModal';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

//   const data = [];
//   for (let i = 0; i < 100; i++) {
//     data.push({
//       key: i,
//       orderNo:i+1,
//       memberName: `李二${i}`,
//       saleBillId: i,
//       className:'会员卡',
//       payTypeName:'微信支付',
//       idNumber: `45012219850425156 ${i}`,
//       balance:'20',
//       cashBalance:'20',
//       presentBalance:'20',
//       createAdminName:'李二',
//       createTime:'2018-05-25 12:20',
//     });
//   }

class MemberChargeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.chargeType = null;
        this.chargeDate = null;
        this.chargeDateState = null;

        this.params={pageSize:15, pageNum: 1};
        this.state = {
            currentMenu: "index",
            show:false,
            data:[],
            pageSize:15,
            total:0,
            typeValue:'2',
            sendValue:'3',
            stateValue:'',
            dateValue:null,
            dateString:[],
            idMember:'',
            infoModalVisible:false,
            saleBillId:null,
            selectType:1,
            loading:false, 
        }
   
        this.getMemberInfo(this.params);
    }

    componentDidMount() {

    }

    componentWillReceiveProps(props) {

		// console.log("infoModalVisible:",this.state.infoModalVisible);
		// this.setState({
		// 	visible: props.visible,
		// 	searchValue:props.searchValue,
		// });

	}

    onBtSelect = () => {

        var orderNo = document.getElementById("charge_order_no").value;
        var idMember = document.getElementById("charge_id_number").value;
        var memberName = document.getElementById("charge_id_name").value;
        if (orderNo.length > 1) {
            this.params.orderNo = orderNo;
        }else{
            if(this.params.orderNo)delete this.params["orderNo"];
        }
        if (idMember.length > 1) {
            this.params.idNumber = idMember;
        }else{
            if(this.params.idNumber)delete this.params["idNumber"];
        }
        if (memberName.length > 1) {
            this.params.userName = memberName;
        }else{
            if(this.params.userName)delete this.params["userName"];
        }

        if (this.state.stateValue.length > 1) {
            this.params.rangeTime = this.state.stateValue;
            if(this.params.startTime)delete this.params["startTime"];
            if(this.params.endTime)delete this.params["endTime"];
        }
        if (this.state.dateString.length > 0) {
            this.params.startTime = this.state.dateString[0];
            this.params.endTime = this.state.dateString[1];
            if(this.params.rangeTime)delete this.params["rangeTime"];
        }

        if (this.state.typeValue==='2') {
            if(this.params.type)delete this.params["type"];
        }else{
            this.params.type = this.state.typeValue;
        }

        if (this.state.sendValue==='3') {
            if(this.params.optionType)delete this.params["optionType"];
        }else{
            this.params.optionType = this.state.sendValue;
        }

        if(document.getElementById("charge_id_mobile")){
            var mobile = document.getElementById("charge_id_mobile").value;
            if (mobile.length > 2) {
                this.params.mobile = mobile;
            }else{
                if(this.params.mobile)delete this.params["mobile"];
            }
        }

        this.getMemberInfo(this.params);
    }

    getMemberInfo(params){
        console.log("onBtSelect",params);
        this.setState({
            loading: true,
        });	
        var that = this;
        memberService.queryChargeInfo(params, {
            success: function (data) {
                // console.log(data);
                if(data.code==0){
                    var memberList = data.data.list;
                    if(memberList.length>0){
                        for(var i=0; i < memberList.length;i++){
                            var incomeAmount = memberList[i].incomeAmount.toFixed(2);
                            memberList[i].incomeAmount = incomeAmount;
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
                message.warn(err);
            }
        })

    }


    handleTypeChange = (value) => {
        this.setState({
            typeValue: value,
          });
      }
    handleSendChange = (value) => {
        this.setState({
            sendValue: value,
          });
      }
    handleStateChange = (value) => {
        this.setState({
            dateValue:null,
            dateString:[],
            stateValue: value,
            });
    }


    onPageChange = (page) => {
        this.params.pageNum = page.current;
        this.getMemberInfo(this.params);
    }

    onTimeChange = (value, dateString) => {

        this.setState({ 
            dateValue:value,
            dateString:dateString,
            stateValue:"",
        }); 

    }

    onKeyDownMoney(e) {
        if (e.keyCode == 13) {
			setTimeout(this.onBtSelect.bind(this), 100);
			// console.log("提交");
		}
    }

    onReset = () => {
        console.log("idMember",this.state.idMember);
        document.getElementById("charge_order_no").value="";
        document.getElementById("charge_id_number").value="";
        document.getElementById("charge_id_name").value="";

        if(this.chargeType){
            this.setState({ 
                typeValue:"2",
                sendValue:"3",
            });
        }

        if(this.chargeDateState){
            this.setState({ stateValue:"",});
        }
 
        if(this.chargeDate){
            this.setState({ 
                dateValue:null,
                dateString:[],
            }); 
        }

        if(document.getElementById("charge_id_mobile")){
            document.getElementById("charge_id_mobile").value="";
        }

        this.setState({ 
            idMember:'',
        });
        
        this.params={pageSize:15, pageNum: 1};

    }
    
    onClick = () => {
        if(this.state.show){
            this.setState({ 
                show: false 
            });
        }else{
            this.setState({ 
                show: true 
            });
        }
      }


    render() {
        var that = this;
        var columns = [{
            title: '单号',
            dataIndex: 'orderNo',
          },{
            title: '姓名',
            dataIndex: 'userName',
            align:'center',
          },{
            title: '手机',
            dataIndex: 'mobile',
            align:'center',
          },{
            title: '类型',
            dataIndex: 'typeName',
            align:'center',
          },{
            title: '支付方式',
            dataIndex: 'payTypeName',
            align:'center',
          },{
            title: '充送方式',
            dataIndex: 'optionTypeName',
            align:'center',
          },{
            title: '充值金额',
            dataIndex: 'incomeAmount',
            align:'center',
          },{
            title: '操作员',
            dataIndex: 'createAdminName',
            align:'center',
          },{
            title: '下单时间',
            dataIndex: 'createTime',
            align:'center',
          },{
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                   <a onClick={e=>{that.setState({saleBillId: record.saleBillId,infoModalVisible:true});}}>详情</a>
                </span>
            ),
          }];
        return (
            <div >
                <div class='member_charge_title'>充值明细</div>
                <div class='member_charge_table'>
                    <div onKeyDown={this.onKeyDownMoney.bind(this)}>
                        <Row className='charge_search' >
                            <Col  span={8}>
                                <span class='charge_date_span'>单号:</span>
                                <Input id='charge_order_no' 
                                    ref={(inputMoney) => { this.inputMoney = inputMoney; }} 
                                    className='charge_input_order' 
                                    placeholder="请输入" 
                                    defaultValue=""/>
                            </Col>
                            <Col  span={5}>
                                <span class='charge_type_state'>证件号:</span>
                                <Input id='charge_id_number' 
                                    ref={(inputMoney) => { this.inputMoney = inputMoney; }} 
                                    className='charge_input_number' 
                                    placeholder="请输入" 
                                    defaultValue=""
                                    onChange = {e => {that.setState({idMember: e.target.value});}}/>
                            </Col>
                            <Col  span={5}>
                                <span class='charge_type_state'> 姓名:</span>
                                <Input id='charge_id_name' 
                                    ref={(inputMoney) => { this.inputMoney = inputMoney; }} 
                                    className='charge_input_name' 
                                    placeholder="请输入" 
                                    defaultValue=""/>
                            </Col>
                            <Col  className='charge_col_4' span={6}>
                                <Button className='charge_select' type="primary" onClick={this.onBtSelect}>查询</Button>
                                <span style={{ marginLeft: "12px" }}></span>
                                <Button onClick={this.onReset}>重置</Button>
                                {this.state.show?<span class='charge_more2' id='manager_id_up' onClick={this.onClick}> 收起 <Icon type="up"/></span>:
                                <span class='charge_more1' id='charge_id_down' onClick={this.onClick}> 展开 <Icon type="down"/></span>}
                            </Col>
                        </Row>

                        {this.state.show?<div>
                            <Row className='charge_search' >
                            <Col  span={8}>
                                <span class='charge_date_span'>日期:</span>
                                <Select 
                                    value={this.state.stateValue}
                                    selectValue={this.state.stateValue} 
                                    defaultValue="" 
                                    ref={(chargeDateState) => { this.chargeDateState = chargeDateState; }} 
                                    className='charge_date_state'
                                    onChange={this.handleStateChange}>
                                    <Option value="day">今天</Option>
                                    <Option value="week">本周</Option>
                                    <Option value="month">本月</Option>
                                </Select>

                                <RangePicker 
                                    className='charge_range_picker'
                                    dateString={this.state.dateString} 
                                    value={this.state.dateValue} 
                                    ref={(chargeDate) => { this.chargeDate = chargeDate; }} 
                                    onChange={this.onTimeChange} />
                            </Col>
                            <Col  span={5}>
                                <span className='charge_type_state'>类型:</span>
                                <Select 
                                    id='charge_id_type'
                                    value={this.state.typeValue}
                                    selectValue={this.state.typeValue} 
                                    defaultValue="" ref={(chargeType) => { this.chargeType = chargeType; }} 
                                    className='charge_select_charge' 
                                    onChange={this.handleTypeChange}>
                                    <Option value="2">全部</Option>
                                    <Option value="0">充值</Option>
                                    <Option value="1">退款</Option>
                                </Select>
                            </Col>
                            <Col  span={5}>
                                <span className='charge_type_state'>充送方式:</span>
                                <Select 
                                    id='charge_id_send'
                                    value={this.state.sendValue}
                                    selectValue={this.state.sendValue} 
                                    defaultValue="" ref={(sendType) => { this.sendType = sendType; }} 
                                    className='charge_select_type' 
                                    onChange={this.handleSendChange}>
                                    <Option value="3">全部</Option>
                                    <Option value="0">有送充值</Option>
                                    <Option value="1">无送充值</Option>
                                    <Option value="2">赠送充值</Option>
                                </Select>
                            </Col>
                            <Col  className='charge_col_4' span={6}>
                                <span class='charge_type_state'>手机号:</span>
                                <Input id='charge_id_mobile' ref={(inputMoney) => { this.inputMoney = inputMoney; }} className='charge_select_mobile' placeholder="请输入" defaultValue=""/>
                            </Col>
                        </Row></div>:<div></div>
                        }
                    </div>
                    <Divider className='charge_info_divider'/>
                    <Spin className="charge_spin" size="large" spinning={this.state.loading} ></Spin>
                    <Table className='charge_table_info' columns={columns} dataSource={this.state.data} onChange={this.onPageChange} pagination={{ pageSize:this.state.pageSize,total:this.state.total}}/>
                    <MemberOrderModal 
                        handleOk={e => {that.setState({infoModalVisible: false});}}
                        handleCancel={e => {that.setState({infoModalVisible: false});}}
                        modalVisible={this.state.infoModalVisible}
                        saleBillId={this.state.saleBillId}
                        selectType={this.state.selectType}>
                    </MemberOrderModal>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { currentMenu } = state.charge;
    return {
        currentMenu
    };
}

export default connect(mapStateToProps)(windowSize(MemberChargeInfo));