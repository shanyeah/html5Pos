import React from 'react';
import windowSize from 'react-window-size'
import './PosVenditionView.css';
import { connect } from 'dva';
import { Menu, Icon,Table, Input,Button, Popconfirm,Divider,Row, Col,Select,DatePicker,message,Spin } from 'antd';
import * as memberService from '../../services/MemberService';
import ShiftOrderDetailModal from '../shift/ShiftOrderDetailModal'
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class PosVenditionView extends React.Component {
    constructor(props) {
        super(props);
        this.venditionType = null;
        this.venditionDate = null;
        this.venditionDateState = null; 

        this.params={pageSize:15, pageNum: 1};
        this.state = {
            currentMenu: "index",
            show:false,
            data:[],
            pageSize:15,
            total:0,
            typeValue:'2',
            stateValue:'',
            dateValue:null,
            dateString:[],
            idMember:'', 
            orderDetailVisible:false,
            orderDetailRecord:null,
            loading:false,      
        }

        this.getMemberInfo(this.params);
    }

    componentDidMount() {

    }
    onBtSelect = () => {

        var orderNo = document.getElementById("vendition_order_no").value;
        var idMember = document.getElementById("vendition_id_number").value;
        var mobile = document.getElementById("vendition_id_mobile").value;
        if (orderNo.length > 1) {
            this.params.orderNo = orderNo;
        }
        if (idMember.length > 1) {
            this.params.idNumber = idMember;
        }

        if (mobile.length > 1) {
            this.params.mobile = mobile;
        }

        if (this.state.stateValue && this.state.stateValue.length > 2) {
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

        if(document.getElementById("vendition_id_name")){
            var memberName = document.getElementById("vendition_id_name").value;
            if (memberName.length > 2) {
                this.params.userName = memberName;
            }
        }

        this.getMemberInfo(this.params);
    }

    getMemberInfo(params){
        // console.log("onBtSelect",params);
        this.setState({
            loading: true,
        });	
        var that = this;
        memberService.queryGoodsList(params, {
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
        document.getElementById("vendition_order_no").value="";
        document.getElementById("vendition_id_number").value="";
        document.getElementById("vendition_id_mobile").value="";
        if(this.venditionType){
            this.setState({ 
                typeValue:"2",
            });
        }

        if(this.venditionDateState){
            this.setState({ stateValue:"",});
        }
 
        if(this.venditionDate){
            this.setState({ 
                dateValue:null,
                dateString:[],
            }); 
        }

        if(document.getElementById("vendition_id_name")){
            document.getElementById("vendition_id_name").value="";
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
            title: '类型',
            dataIndex: 'typeName',
            align:'center',
          },{
            title: '支付方式',
            dataIndex: 'payTypeName',
            align:'center',
          },{
            title: '收入金额',
            dataIndex: 'incomeAmount',
            align:'center',
          },{
            title: '操作人',
            dataIndex: 'createAdminName',
            align:'center',
          },{
            title: '下单来源',
            dataIndex: 'sourceTypeName',
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
                   <a onClick={e=>{that.setState({orderDetailRecord: record,orderDetailVisible:true});}}>详情</a>
              </span>
            ),
          }];
        return (
            <div >
                <div class='member_vendition_title'>商品销售明细</div>
                <div class='member_vendition_table'>
                    <div onKeyDown={this.onKeyDownMoney.bind(this)}>
                    <Row className='vendition_search' >
                            <Col  span={8}>
                                <span class='vendition_date_span'>单号:</span>
                                <Input id='vendition_order_no' 
                                    ref={(inputMoney) => { this.inputMoney = inputMoney; }} 
                                    className='vendition_input_order' 
                                    placeholder="请输入" 
                                    defaultValue=""/>
                            </Col>
                            <Col  span={5}>
                                <span class='vendition_type_state'>证件号:</span>
                                <Input id='vendition_id_number' 
                                    ref={(inputMoney) => { this.inputMoney = inputMoney; }} 
                                    className='vendition_input_number' 
                                    placeholder="请输入" 
                                    defaultValue=""
                                    onChange = {e => {that.setState({idMember: e.target.value});}}/>
                            </Col>
                            <Col  span={5}>
                                <span class='vendition_type_state'> 手机号:</span>
                                <Input id='vendition_id_mobile' 
                                    ref={(inputMoney) => { this.inputMoney = inputMoney; }} 
                                    className='vendition_input_name' 
                                    placeholder="请输入" 
                                    defaultValue=""/>
                            </Col>

                            <Col  className='vendition_col_4' span={6}>
                                <Button className='vendition_select' type="primary" onClick={this.onBtSelect}>查询</Button>
                                <span style={{ marginLeft: "12px" }}></span>
                                <Button onClick={this.onReset}>重置</Button>
                                {this.state.show?<span class='vendition_more2' id='vendition_id_up' onClick={this.onClick}> 收起 <Icon type="up"/></span>:
                                <span class='vendition_more1' id='vendition_id_down' onClick={this.onClick}> 展开 <Icon type="down"/></span>}
                            </Col>
                        </Row>
                        {this.state.show?<div>
                            <Row className='vendition_search' >
                            <Col  span={8}>
                                <span class='vendition_date_span'>日期:</span>
                                <Select 
                                    value={this.state.stateValue}
                                    selectValue={this.state.stateValue} 
                                    defaultValue="" 
                                    ref={(venditionDateState) => { this.venditionDateState = venditionDateState; }} 
                                    className='vendition_date_state'
                                    onChange={this.handleStateChange}>
                                    <Option value="day">今天</Option>
                                    <Option value="week">本周</Option>
                                    <Option value="month">本月</Option>
                                </Select>

                                <RangePicker 
                                    className='vendition_range_picker'
                                    dateString={this.state.dateString} 
                                    value={this.state.dateValue} 
                                    ref={(venditionDate) => { this.venditionDate = venditionDate; }} 
                                    onChange={this.onTimeChange} />
                            </Col>
                            <Col  span={5}>
                                <span className='vendition_type_state'>类型:</span>
                                <Select 
                                    id='vendition_id_type'
                                    value={this.state.typeValue}
                                    selectValue={this.state.typeValue} 
                                    defaultValue="" ref={(venditionType) => { this.venditionType = venditionType; }} 
                                    className='vendition_select_vendition' 
                                    onChange={this.handleTypeChange}>
                                    <Option value="2">全部</Option>
                                    <Option value="0">充值</Option>
                                    <Option value="1">退款</Option>
                                </Select>
                            </Col>
                            <Col  span={5}>
                                <span className='vendition_type_state'>姓名:</span>
                                <Input id='vendition_id_name' 
                                    ref={(inputMoney) => { this.inputMoney = inputMoney; }} 
                                    className='vendition_select_type' 
                                    placeholder="请输入" 
                                    defaultValue=""/>
                            </Col>
                            <Col  className='vendition_col_4' span={6}>
                            </Col>
                        </Row></div>:<div></div>
                        }
                    </div>
                    <Divider className='vendition_info_divider'/>
                    <Spin className="charge_spin" size="large" spinning={this.state.loading} ></Spin>
                    <Table className='vendition_table_info' columns={columns} dataSource={this.state.data} onChange={this.onPageChange} pagination={{ pageSize:this.state.pageSize,total:this.state.total}}/>
                </div>
                <ShiftOrderDetailModal
                    orderRecord={this.state.orderDetailRecord}
                    modalVisible={this.state.orderDetailVisible}
                    onOk={e => {
                        that.setState({ orderDetailVisible: false })
                    }}
                    onCancel={e => {
                        that.setState({ orderDetailVisible: false })
                    }}>
                    ></ShiftOrderDetailModal>
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { currentMenu } = state.vendition;
    return {
        currentMenu
    };
}

export default connect(mapStateToProps)(windowSize(PosVenditionView));