import React from 'react';
import windowSize from 'react-window-size'
import './PosLayout.css';
import BaseTipsView from '../base/BaseTipsView'
import PosHeader from './PosHeader'
import PosContentView from './PosContentView'
import PosVenditionView from './PosVenditionView'
import ShiftView from '../shift/ShiftView'
import PosPrintSettingModal from './PosPrintSettingModal'

import MemberInfoModal from '../member/MemberInfoModal';
import MemberSuccessModal from '../member/MemberSuccessModal';

import MemberManager from '../member/MemberManager';
import MemberChargeInfo from '../member/MemberChargeInfo';
import { connect } from 'dva';
import { BrowserRouter as Router, Route} from 'react-router-dom'


class PosLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infoVisible:false,
            successVisible:false,
            shiftVisible:false,
            printSettingVisible:false,
            action:"",
            memberInfo:null,
            idNumber:null,
            successInfo:null
        }
        
        window.mjReceiveIdNumber = this.receiveIdNumber.bind(this);
    }

    receiveIdNumber(info) {
        var visible = true;
        if (this.state.printSettingVisible || this.state.shiftVisible) {
            visible = false;
        }
        this.setState({ infoVisible: visible, idNumber: info});
    }

    shiftAlready() {
        var loginInfo = window.mjGetLoginInfo();
        if (!loginInfo) {
            return false;
        }
        if (loginInfo.posCheckId == 0) {
            return false;
        }
        return true;
    }

    componentDidMount() {
        if (!this.shiftAlready()) {
            this.props.history.push("/shift");
        }
    }

    handleOk(value) {
        this.setState({
            modalVisible: value,
            infoVisible:value,
            idNumber: null
        });
    };

    handleSuccess(bl,info){
        this.setState({
            successVisible: bl,
            infoVisible:true,
            successInfo:info,
            idNumber: null,
        });
        console.log("info",info);
    };


    headerClick(value, action) {
        switch (action) {
            case 'action:member':
                this.setState({
                    infoVisible:value,
                    action:action,
                });
                break;
            case 'action:shift':
                this.setState({
                    shiftVisible: true,
                    action: action,
                });
                break;
            case 'action:printSetting':
                this.setState({
                    printSettingVisible: true,
                    action: action,
                });
                break;
            default:
                break;
        }

		// console.log('SlectType', value+","+action);
    };

    getCurrentPage() {
        // console.log('currentMenu', this.props.currentMenu);
        var path = this.props.location.pathname.replace("/", "");
        
        switch (path) {
            case '':
            case 'shopping':
                return <PosContentView extData={this.state.extData}></PosContentView>;
                break;
            case 'shift':
                return <ShiftView></ShiftView>;
                break;
            case 'manager':
                return <MemberManager></MemberManager>;
                break;
            case 'charge':
                return <MemberChargeInfo></MemberChargeInfo>;
                break;
            case 'vendition':
                return <PosVenditionView></PosVenditionView>;
                break;
               
            default:
                return <div></div>;
                break;
        }
    }


    render() {
        var that=this; 
        return (
            <div className='pos_layout'>
                <div className='pos_layout_header'>
                    <PosHeader location={this.props.location} history={this.props.history} headerClick={this.headerClick.bind(this)}></PosHeader>
                </div>
                <div className='pos_layout_content'>
                    <div style={{height: 64 }}></div>
                    {this.getCurrentPage()}
                </div>
                
                <MemberSuccessModal 
                            handleOk={e => {that.setState({successVisible: false});}}
                            handleCancel={e => {that.setState({successVisible: false});}}
                            modalVisible={this.state.successVisible}
                            memberInfo={this.state.successInfo}>
                </MemberSuccessModal>
                <MemberInfoModal
                    idNumber={this.state.idNumber}
                    modalVisible={this.state.infoVisible}
                    memberInfo={this.state.memberInfo}
                    handleSuccess={this.handleSuccess.bind(this)}
                    handleOk={this.handleOk.bind(this)}
                    handleCancel={e => {
                        that.setState({ infoVisible: false, idNumber: null ,memberInfo:null,});
                    }}>
                </MemberInfoModal>
                <PosPrintSettingModal 
                    modalVisible={this.state.printSettingVisible}
                    onOk={e=> {
                        that.setState({ printSettingVisible: false});
                    }}
                    onCancel={e=> {
                        that.setState({ printSettingVisible: false });
                }}>
                </PosPrintSettingModal>
                <BaseTipsView location={this.props.location} history={this.props.history}></BaseTipsView>
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { currentMenu } = state.home;
    return {
        currentMenu
    };
}

export default connect(mapStateToProps)(windowSize(PosLayout));