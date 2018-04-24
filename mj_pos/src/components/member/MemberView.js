import React from 'react';
import { Menu, Icon,Layout,Row, Col } from 'antd'
import './MemberView.css';
import MemberInfo from './MemberInfo';
import MemberInfoModal from './MemberInfoModal';


const { Sider,Content} = Layout;
const data = [
  {
    value: '1',
    label: '开户/充值',
  }, {
    value: '2',
    label: '充值单查询',
  },
  {
    value: '3',
    label: '在线支付单查询',
    isLeaf: true,
  },
];

class MemberView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMenu: '1',
            modalVisible:false,
            infoVisible:false,
        }
        // console.log('this.props.dispatch: ', this.props.dispatch);
    }

    getCurrentPage() {
        switch (this.state.currentMenu) {
            case '1':
                return <MemberInfo></MemberInfo>;
                break;
            case '2':
                // return <ChargeView></ChargeView>;
                break;
            case '3':

                break;

            case '9':
                this.props.history.push("/login");
                break;
            default:
                return <div>{this.state.currentMenu}</div>
                break;
        }
    }
    handleOk(value) {
        this.setState({
            modalVisible: value,
            infoVisible:value
        });
    };
    handleCancel(value) {
        this.setState({
            modalVisible: value,
            infoVisible:value
        });
    };

    menuClick(e) {
        var menu = e.key;
        this.setState({
            currentMenu: menu,
        });

        switch (menu) {
            case '1':

                break;

            case '3':
                this.setState({
                    infoVisible: true
                });
                break;
            case '8':
                this.setState({
                    modalVisible: true
                });
                break;
            default:

                break;
        }


        // this.props.dispatch({ type: 'home/updateMenu', payload: { menu: menu}});
    }

    render() {

        return (
            <div className='member_view'>
               <Layout className='layout_menu'>
                    <Sider className='member_menu'>
                        <Menu
                            onClick={this.menuClick.bind(this)}
                            selectedKeys={[this.state.currentMenu]}
                            mode="inline">
                            <Menu.Item key="1">
                                会员信息查询
                            </Menu.Item>
                            <Menu.Item key="2">
                                充值单查询
                            </Menu.Item>
                            <Menu.Item key="3">
                                在线支付单查询
                            </Menu.Item>
                            <Menu.Item key="4">
                                打印自助充值单
                            </Menu.Item>
                            <Menu.Item key="5">
                                包时服务
                            </Menu.Item>
                            <Menu.Item key="6">
                                魔元商品兑换
                            </Menu.Item>
                            <Menu.Item key="7">
                                活动商品兑换
                            </Menu.Item>
                            <Menu.Item key="8">
                                开户/充值
                            </Menu.Item>
                            <Menu.Item key="9">
                                登录
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content className='member_content'>
                        <MemberInfoModal handleOk={this.handleOk.bind(this)}
                            handleCancel={this.handleCancel.bind(this)}
                            modalVisible={this.state.infoVisible}>
                        </MemberInfoModal>
                        {this.getCurrentPage()}
                    </Content>
                </Layout>
            </div> 
        );
    }
}

export default MemberView;
