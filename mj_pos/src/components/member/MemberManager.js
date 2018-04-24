import React from 'react';
import windowSize from 'react-window-size'
import './MemberManager.css';
import { connect } from 'dva';
import { Menu, Icon,Table, Input,Button, Popconfirm,Divider,Row, Col,Select,DatePicker,message,Spin } from 'antd';
import * as memberService from '../../services/MemberService';
import MemberWalletModal from './MemberWalletModal';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;


class MemberManager extends React.Component {
    constructor(props) {
        super(props);
        this.managerType = null;
        this.managerDate = null;
        this.managerDateState = null;
        
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
            loading:false,
            recordInfo:null,
            infoModalVisible:false,
        }
   
        this.getMemberInfo(this.params);
    }

    componentDidMount() {

    }
    onBtSelect = () => {

        var mobile = document.getElementById("manager_id_mobile").value;
        var idNumber = document.getElementById("manager_id_number").value;
        var memberName = document.getElementById("manager_id_name").value;


        if (idNumber.length > 1) {
            this.params.idNumber = idNumber;
        }else{
            if(this.params.idNumber)delete this.params["idNumber"];
        }
        if (mobile.length > 1) {
            this.params.mobile = mobile;
        }else{
            if(this.params.mobile)delete this.params["mobile"];
        }
        if (memberName.length > 1) {
            this.params.name = memberName;
        }else{
            if(this.params.name)delete this.params["name"];
        }

        this.getMemberInfo(this.params);
    }

    getMemberInfo(params){
        // console.log("params",params);
        this.setState({
            loading: true,
        });	
        var that = this;
        memberService.queryMemberInfo(params, {
            success: function (data) {
                // console.log(data);
                if(data.code==0){
                    var memberList = data.data.list;
                    if(memberList.length>0){
                        for(var i=0; i < memberList.length;i++){
                            var balance = memberList[i].balance.toFixed(2);
                            memberList[i].balance = balance;
                            var cashBalance = memberList[i].cashBalance.toFixed(2);
                            memberList[i].cashBalance = cashBalance;
                            var presentBalance = memberList[i].presentBalance.toFixed(2);
                            memberList[i].presentBalance = presentBalance;
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
                console.log(err);
                that.setState({
                    loading: false,
                });	
                // that.setState({
                //     memberList: [],
                //     memberInfo: null,
                //     fetching: false
                // });
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
        // console.log("idMember",this.state.idMember);
        document.getElementById("manager_id_mobile").value="";
        document.getElementById("manager_id_number").value="";
        document.getElementById("manager_id_name").value="";

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
            title: '姓名',
            dataIndex: 'name',
          },{
            title: '会员等级',
            dataIndex: 'className',
            align:'center',
          }, {
            title: '证件类型',
            dataIndex: 'idTypeName',
            align:'center',
          },{
            title: '总余额',
            dataIndex: 'balance',
            align:'center',
          },{
            title: '现金余额',
            dataIndex: 'cashBalance',
            align:'center',
          },{
            title: '赠送余额',
            dataIndex: 'presentBalance',
            align:'center',
          },{
            title: '开卡时间',
            dataIndex: 'createTime',
            align:'center',

          },{
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                   <a onClick={e=>{that.setState({recordInfo: record,infoModalVisible:true});}}>明细</a>
                </span>
            ),}];
        return (
            <div class='member_manager_all'>
                <div class='member_manager_title'>会员管理</div>
                <div class='member_manager_table'>
                    <div onKeyDown={this.onKeyDownMoney.bind(this)}>
                    <Row className='manager_search' >
                        <Col  span={8}>
                            <span class='manager_date_span'>证件号:</span>
                            <Input id='manager_id_number' 
                                ref={(inputMoney) => { this.inputMoney = inputMoney; }} 
                                className='manager_input_order' 
                                placeholder="请输入" 
                                defaultValue=""/>
                        </Col>
                        <Col  span={5}>
                            <span class='manager_type_state'>手机号:</span>
                            <Input id='manager_id_mobile' 
                                ref={(inputMoney) => { this.inputMoney = inputMoney; }} 
                                className='manager_input_number' 
                                placeholder="请输入" 
                                defaultValue=""
                                onChange = {e => {that.setState({idMember: e.target.value});}}/>
                        </Col>
                        <Col  span={5}>
                            <span class='manager_type_state'> 姓名:</span>
                            <Input id='manager_id_name' 
                                ref={(inputMoney) => { this.inputMoney = inputMoney; }} 
                                className='manager_input_name' 
                                placeholder="请输入" 
                                defaultValue=""/>
                        </Col>
                        <Col  className='manager_col_4' span={6}>
                            <Button className='manager_select' type="primary" onClick={this.onBtSelect}>查询</Button>
                            <span style={{ marginLeft: "12px" }}></span>
                            <Button onClick={this.onReset}>重置</Button>
                        </Col>
                    </Row>
                </div>
                    <Divider className='manager_info_divider'/>
                    <Spin className="charge_spin" size="large" spinning={this.state.loading} ></Spin>
                    <Table className='manager_table_info' columns={columns} dataSource={this.state.data} onChange={this.onPageChange} pagination={{ pageSize:this.state.pageSize,total:this.state.total}}/>
                </div>
                <MemberWalletModal 
                    handleOk={e => {that.setState({infoModalVisible: false});}}
                    handleCancel={e => {that.setState({infoModalVisible: false});}}
                    modalVisible={this.state.infoModalVisible}
                    recordInfo={this.state.recordInfo}>
                </MemberWalletModal>
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { currentMenu } = state.manager;
    return {
        currentMenu
    };
}

export default connect(mapStateToProps)(windowSize(MemberManager));