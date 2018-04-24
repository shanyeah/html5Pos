import React from 'react';
import './PosHeader.css';
import { Menu, Icon, Modal } from 'antd';
import { connect } from 'dva';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class PosHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    logout() {
        var that = this;
        Modal.confirm({
            title: '确认重新登录?',
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                if (window.mjLogout) {
                    window.mjLogout();
                } else {
                    that.props.history.push("/login");
                }
            },
            onCancel() {
                
            }
        });
    }

    exit() {
        var that = this;
        Modal.confirm({
            title: '确认退出系统?',
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                if (window.mjExit) {
                    window.mjExit();
                }
            },
            onCancel() {

            }
        });
    }

    getTitle() {
        if (window.mjGetValue) {
            var title = window.mjGetValue("organName");
            if (title && title.length > 0) {
                return title;
            }
        }
        return "链大侠收银系统";
    }

    getSelectMenu() {
        var path = this.props.location.pathname;
        return [path.replace("/", "")];
    }

    menuClick(e) {
        var menu = e.key;

        if (menu.indexOf("action:") == 0) {
            switch (menu) {
                case 'action:exit': {
                    this.exit();
                }
                    break;
                case 'action:login':
                case 'action:logout':
                    this.logout();
                    break;
                case 'action:shift':
                case 'action:member':
                case 'action:printSetting':
                    this.props.headerClick(true, menu);
                    break;
                case 'action:lock': {
                    if (window.mjLockScreen) {
                        window.mjLockScreen();
                    }
                }
                    break;
                case 'action:refreshCache': {
                    if (window.mjRefreshCacheData) {
                        window.mjRefreshCacheData();
                        const modal = Modal.success({
                            content: '刷新成功!'
                        });
                        setTimeout(() => modal.destroy(), 2000);
                    }
                } 
                    break;
            }
            return;
        }
        this.props.history.push("/" + menu);
    }

    render() {
        return (
            
            <div className='pos_header'>
                
                <view style={{marginLeft: "12px"}}>{this.getTitle()}</view>
                <Menu
                    className='pos_header_menu'
                    onClick={this.menuClick.bind(this)}
                    selectedKeys={this.getSelectMenu()}
                    mode="horizontal"
                >
                    <Menu.Item key="shopping">
                        <span className="pos_header_menu_title"><Icon type="shopping-cart" style={{ fontSize: 18 }} />商品售卖</span>
                    </Menu.Item>
                    <SubMenu title={<span className="pos_header_menu_title"><Icon type="dashboard" style={{ fontSize: 16 }} />日常运营</span>}>
                        <Menu.Item key="shift"><span className="pos_header_menu_sub_title">交班管理</span></Menu.Item>
                        <Menu.Item key="vendition"><span className="pos_header_menu_sub_title">销售明细</span></Menu.Item>
                    </SubMenu>
                    <SubMenu title={<span className="pos_header_menu_title"><Icon type="solution" style={{ fontSize: 16 }}/>会员管理</span>}>
                        <Menu.Item key="action:member"><span className="pos_header_menu_sub_title">开户充值</span></Menu.Item>
                        <Menu.Item key="charge"><span className="pos_header_menu_sub_title">充值明细</span></Menu.Item>
                        <Menu.Item key="manager"><span className="pos_header_menu_sub_title">会员管理</span></Menu.Item>
                    </SubMenu>
                    <SubMenu title={<span className="pos_header_menu_title"><Icon type="setting" style={{ fontSize: 18 }}/>系统管理</span>}>
                        <Menu.Item key="action:lock"><span className="pos_header_menu_sub_title">系统锁定</span></Menu.Item>
                        {/* <Menu.Item key="action:openWallet"><span className="pos_header_menu_sub_title">打开钱箱</span></Menu.Item> */}
                        <Menu.Item key="action:printSetting"><span className="pos_header_menu_sub_title">打印测试</span></Menu.Item>
                        {/* <Menu.Item key="action:showScreen"><span className="pos_header_menu_sub_title">显示副屏</span></Menu.Item> */}
                        <Menu.Item key="action:refreshCache"><span className="pos_header_menu_sub_title">刷新缓存</span></Menu.Item>
                        <Menu.Item key="action:logout"><span className="pos_header_menu_sub_title">重新登录</span></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="action:exit">
                        <span className="pos_header_menu_title"><Icon type="logout" style={{ fontSize: 16 }} />退出系统</span>
                    </Menu.Item>
                </Menu>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps)(PosHeader);