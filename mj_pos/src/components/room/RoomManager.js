import React from 'react';
import windowSize from 'react-window-size'
import './RoomManager.css';
import { connect } from 'dva';
import { Menu, Icon,Table, Input,Button, Popconfirm,Divider,Row, Col,Select,DatePicker,message,Spin,List, Card } from 'antd';
import RoomOpenModal from './RoomOpenModal';


import * as memberService from '../../services/MemberService';


const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;


class RoomManager extends React.Component {
    constructor(props) {
        super(props);

        
        this.params={pageSize:15, pageNum: 1};
        this.state = {
            currentMenu: "index",
            loading:false,
            destineVisible:false,
            roomInfo:null,
            roomList:[],
        }
   
        this.getMemberInfo(this.params);
    }


    // onBtSelect = () => {

    //     var mobile = document.getElementById("manager_id_mobile").value;
    //     var idNumber = document.getElementById("manager_id_number").value;
    //     var memberName = document.getElementById("manager_id_name").value;


    //     if (idNumber.length > 1) {
    //         this.params.idNumber = idNumber;
    //     }else{
    //         if(this.params.idNumber)delete this.params["idNumber"];
    //     }
    //     if (mobile.length > 1) {
    //         this.params.mobile = mobile;
    //     }else{
    //         if(this.params.mobile)delete this.params["mobile"];
    //     }
    //     if (memberName.length > 1) {
    //         this.params.name = memberName;
    //     }else{
    //         if(this.params.name)delete this.params["name"];
    //     }

    //     this.getMemberInfo(this.params);
    // }

    getMemberInfo(params){
        // console.log("params",params);
        // this.setState({
        //     loading: true,
        // });	
        this.state.loading = true;
        var that = this;

        memberService.queryMemberInfo(params, {
            success: function (data) {
                // console.log(data);
                if(data.code==0){
                    // var memberList = data.data.list;
                    var roomList = [
                        {
                          areaId: 10001,
                          areaName: "Vip1包房",
                          price: 100,
                          status: 0,
                          orderInfo:{
                            name: "张三",
                            userId: 100085,
                            idNumber: "444**003333",
                            mobile: 1350003333,
                            balance: 100.99,
                            memberPrice: 80,
                            freezeAmount: 23,
                          },
                        },
                        {
                            areaId: 10001,
                            areaName: "Vip1包房",
                            price: 100,
                            status: 2,
                            orderInfo:{
                              name: "张三",
                              userId: 100085,
                              idNumber: "444**003333",
                              mobile: 1350003333,
                              balance: 100.99,
                              memberPrice: 80,
                              freezeAmount: 23,
                            },
                        },
                        {
                            areaId: 10001,
                            areaName: "Vip1包房",
                            price: 100,
                            status: 1,
                            orderInfo:{
                              name: "张三",
                              userId: 100085,
                              idNumber: "444**003333",
                              mobile: 1350003333,
                              balance: 100.99,
                              memberPrice: 80,
                              freezeAmount: 23,
                            },
                        },
                    ];

                    if(roomList.length>0){
                        for(var i=0; i < roomList.length;i++){
                            if(roomList[i].status==0){
                                roomList[i].stateColor = "#fd5c02";
                                roomList[i].stateName = '(空闲中)';
                                roomList[i].destineAble = false;
                                roomList[i].onAble = false;
                                roomList[i].cancleAble = true;
                                roomList[i].payAble = true;
                                roomList[i].offAble = true;
                            }else if(roomList[i].status==1){
                                roomList[i].stateColor = "#6034da";
                                roomList[i].stateName = '(预定中)';
                                roomList[i].destineAble = true;
                                roomList[i].onAble = false;
                                roomList[i].cancleAble = false;
                                roomList[i].payAble = true;
                                roomList[i].offAble = true;
                            }else if(roomList[i].status==2){
                                roomList[i].stateColor = "#999";
                                roomList[i].stateName = '(使用中)';
                                roomList[i].destineAble = true;
                                roomList[i].onAble = true;
                                roomList[i].cancleAble = true;
                                roomList[i].payAble = false;
                                roomList[i].offAble = false;
                            }
                    }
                }

                    that.setState({
                        roomList: roomList,
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

    loadData() {
        // var that = this;
        // this.setState({ shiftLoading: true })
        // posService.queryPosCheckList({
        //     success: function (data) {
        //         if (data.data.list && data.data.list.length > 0) {
        //             that.setState({ posCheckList: data.data.list, selectPosCheckInfo: data.data.list[0], shiftLoading: false });
        //             if (that.state.currentTab === 'sale') {
        //                 that.querySaleGoodsList();
        //             } else {
        //                 that.queryUserRechangeList();
        //             }
        //             that.queryPosCheckDetail();
        //         } else {
        //             that.setState({ posCheckList: [], shiftLoading: false });
        //         }
        //     },
        //     error: function (err) {
        //         message.warn(err);
        //         that.setState({ shiftLoading: false });
        //     }
        // });
    }



    
    // onClick = (e) => {
    //     // if(this.state.show){
    //     //     this.setState({ 
    //     //         show: false 
    //     //     });
    //     // }else{
    //     //     this.setState({ 
    //     //         show: true 
    //     //     });
    //     // }
    //     console.log("-----value",e.target.value);
    //   }




    render() {

        var that = this;
        var data = [
            {
              title: '包房 1',
              price:'(300元每小时)',
              state: '(空闲中)',
              stateColor: '#fd5c02',
              destineAble:false,
              onAble:false,
              cancleAble:true,
              payAble:true,
              offAble:true,
              name:"李静",
              mobile:"18965874587",
            },
            {
              title: '包房 2',
              price:'(300元每小时)',
              state: '(预定中)',
              stateColor: '#6034da',
              destineAble:true,
              onAble:false,
              cancleAble:false,
              payAble:true,
              offAble:true,
              name:"李静",
              mobile:"18965874587",
              count:"0.00",
            },
            {
              title: 'Title 3',
              price:'(300元每小时)',
              state: '(使用中)',
              stateColor: '#999',
              destineAble:true,
              onAble:true,
              cancleAble:true,
              payAble:false,
              offAble:false,
              name:"李静",
              mobile:"18965874587",
              idNumber:"425689547858745698",
              balance:"30.00",
              count:"10.00",
              discount:"150元/小时",
              time:"2018-12-10 12:20",
              payType:"手工扣费",
            },
            {
              title: 'Title 4',
              price:'(300元每小时)',
              state: '(使用中)',
              stateColor: '#999',
              destineAble:true,
              onAble:true,
              cancleAble:true,
              payAble:false,
              offAble:false,
              name:"李静",
              mobile:"18965874587",
            },
            {
              title: 'Title 5',
              price:'(300元每小时)',
              state: '(使用中)',
              stateColor: '#999',
              destineAble:true,
              onAble:true,
              cancleAble:true,
              payAble:false,
              offAble:false,
              name:"李静",
              mobile:"18965874587",
            },
            {
              title: 'Title 6',
              price:'(300元每小时)',
              state: '(使用中)',
              stateColor: '#999',
              destineAble:true,
              onAble:true,
              cancleAble:true,
              payAble:false,
              offAble:false,
              name:"李静",
              mobile:"18965874587",
            },
          ];

          var IconText = ({ item }) => (
            <Button size='small' disabled={item.destineAble} onClick={event => {
                that.setState({
                    destineVisible:true,
                    title:"包房预定",
                    slectType:0,
                    roomInfo:item,
                });
                }}>
                预定
            </Button>
          );

          var IconText1 = ({ item }) => (
            <Button size='small' disabled={item.onAble} onClick={event => {
                if(item.destineAble){
                    message.warn("包房上机，开始包房计费");
                }else{
                    that.setState({
                        destineVisible:true,
                        title:"上机",
                        slectType:0,
                        roomInfo:item,
                    });
                }

                }}>
                上机
            </Button>
          );

          var IconText2 = ({ item }) => (
            <Button size='small' disabled={item.cancleAble} onClick={event => {
                that.setState({
                    destineVisible:true,
                    title:"取消预定",
                    slectType:2,
                    roomInfo:item,
                });
                }}>
                取消
            </Button>
          );

          var IconText3 = ({ item }) => (
            <Button size='small' disabled={item.payAble} onClick={event => {
                that.setState({
                    destineVisible:true,
                    title:"包房续费",
                    slectType:3,
                    roomInfo:item,
                });
                }}>
                续费
            </Button>
          );

          var IconText4 = ({ item }) => (
            <Button size='small' disabled={item.offAble} onClick={event => {
                that.setState({
                    destineVisible:true,
                    title:"下机",
                    slectType:4,
                    roomInfo:item,
                });
                }}>
                下机
            </Button>
          );
        return (
            <div class='room_content'>
                <div class='room_manager_title'>
                    <div class='room_manager_refresh' style={{ float: "right" }}><Button shape="circle" icon="reload" onClick={event => {that.loadData();}}/></div>
                    包房管理
                </div>
                <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 3 }}
                    dataSource={this.state.roomList}
                    className='room_list_grid'
                    renderItem={item => (
                    <List.Item className='room_list_item'>
                        <Card className='room_item_card'
                            actions={[<IconText item={item}/>, <IconText1 item={item}/>, <IconText2 item={item}/>, <IconText3 item={item}/>, <IconText4 item={item}/>]}>
                            <div class="room_card_top">
                                <div class="room_card_state" style={{color:item.stateColor,float:"right"}}>  
                                    {item.stateName}  
                                </div> 
                                <span class="room_card_title">{item.areaName}</span>
                                <span class="room_card_price">{item.price.toFixed(2) +"元/小时"}</span>   
                            </div>

                            {item.destineAble?<div class="room_card_content">

                                <Row className='room_card_member'>
                                    <Col span={12}>
                                        <span class="room_member_state">姓名:</span>
                                        <span class="room_member_name">{item.orderInfo.name}</span>  
                                    </Col>
                                    <Col span={12}>
                                        <span class="room_member_state">手机:</span>
                                        <span class="room_member_name">{item.orderInfo.mobile}</span>  
                                    </Col>
								</Row>

                                <Row className='room_card_member'>
									<Col span={12}>
                                        <span class="room_member_state">余额:</span>
                                        <span class="room_member_money">{item.orderInfo.balance.toFixed(2) +"元"}</span>  
                                    </Col>
                                    <Col span={12}>
                                        <span class="room_member_state">折后价:</span>
                                        <span class="room_member_money">{item.orderInfo.memberPrice.toFixed(2) +"元/小时"}</span>  
                                    </Col>
								</Row>

                                <Row className='room_card_member'>
                                    <Col span={12}>
                                        <span class="room_member_state">扣费类型:</span>
                                        <span class="room_member_name">{item.price}</span>  
                                    </Col>
                                    <Col span={12}>
                                        <span class="room_member_state">冻结金额:</span>
                                        <span class="room_member_money">{item.orderInfo.freezeAmount.toFixed(2) +"元"}</span>  
                                    </Col>
								</Row>

                                <Row className='room_card_member'>
                                    <Col span={22}>
                                        <span class="room_member_state">证件号:</span>
                                        <span class="room_member_name">{item.orderInfo.idNumber}</span>  
                                    </Col>
								</Row>
                                <Row className='room_card_member'>
                                    <Col span={22}>
                                        <span class="room_member_state">上机时间:</span>
                                        <span class="room_member_name">{item.price}</span>  
                                    </Col>
								</Row>
                            </div>:<div class="room_card_content"></div>}
                        </Card>
                    </List.Item>
                    )}
                />


                <RoomOpenModal 
                    handleOk={e => {that.setState({destineVisible: false});}}
                    handleCancel={e => {                        
                        that.setState({
                            destineVisible: false,
                        });
                    }}
                    title={this.state.title}
                    slectType={this.state.slectType}
                    roomInfo={this.state.roomInfo}
                    modalVisible={this.state.destineVisible}>
                </RoomOpenModal>
    
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { currentMenu } = state.room;
    return {
        currentMenu
    };
}

export default connect(mapStateToProps)(windowSize(RoomManager));