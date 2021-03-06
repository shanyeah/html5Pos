import React from 'react';
import { List, Row, Col, Modal, Popover, Icon, Input, InputNumber, message } from 'antd';
import windowSize from 'react-window-size';
import PosGoodDetailView from './PosGoodDetailView'
import PosOrderGoodDetailView from './PosOrderGoodDetailView'
import PosSettleView from './PosSettleView'
import { connect } from 'dva';
import './PosOrderList.css';
import * as posService from '../../services/PosService';
import MoneyValue from '../../utils/money';

class PosOrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectItem: null,
            modalVisible: false,
            settleModalVisible: false,
            billData: {},
            loading: false,
            render: 0
        }
    }

    componentWillUnmount() {
        this.props.dispatch({ type: 'pos/cacheOrderList', payload: {} });
    }

    getTitle() {
        var total = 0;

        for (let i = 0; i < this.props.orderList.length; i++) {
            const item = this.props.orderList[i];
            total += item.count;
        }

        if (total > 0) {
            return '已选商品 (共 ' + total + ' 件)';
        }

        return '已选商品';
    }

    getTotal() {
        var total = 0;

        for (let i = 0; i < this.props.orderList.length; i++) {
            const item = this.props.orderList[i];
            var price = MoneyValue(item.price) * item.count;
            total += price;
        }

        if (total > 0) {
            return '合计 ￥' + total.toFixed(2) + '';
        }

        return '未选商品';
    }

    reload() {
        this.setState({ render: this.state.render++ });
    }

    updatePriceAndRemark(item) {
        var selectItem = item;

        if (selectItem) {
            
            if (selectItem.selectGoodsPackList.length > 0) {
                // 重新计算总价
                var price = 0;
                var remark = "";
                for (let i = 0; i < selectItem.selectGoodsPackList.length; i++) {
                    const pack = selectItem.selectGoodsPackList[i];
                    var selectItems = pack.selectItems;
                    var items = Object.values(selectItems);
                    items.forEach(item => {
                        price += item.packPrice;
                    });                                        
                }
                selectItem.price = price;

                for (let i = 0; i < selectItem.selectGoodsPackList.length; i++) {
                    const pack = selectItem.selectGoodsPackList[i];
                    var selectItems = pack.selectItems;
                    var items = Object.values(selectItems);
                    items.forEach(item => {
                        var tags = Object.values(item.selectTag);
                        if (tags.length > 0) {
                            remark += (item.name + '(');
                            var tagArray = new Array();
                            tags.forEach(tag => {
                                var tagItem = item.tags[tag];
                                tagArray.push(tagItem.name);
                            });
                            var tagString = "";
                            if (tagArray.length == 1) {
                                tagString = tagArray[0];
                            } else {
                                tagString = tagArray.join(',');
                            }
                            remark += (tagString + ') ');
                        }
                    });                                        
                }
                selectItem.staticRemark = remark;
                console.log(selectItem);
            } else {

            }
            
            
        }
    
    }

    saveGoodsBill() {
        if (this.state.loading) {
            return;
        }
        var goodsList = new Array();
        for (let i = 0; i < this.props.orderList.length; i++) {
            const element = this.props.orderList[i];
            var item = {};
            item.categoryId = element.categoryId;
            item.categoryName = element.categoryName;
            item.goodsId = element.goodsId;
            item.name = element.name;
            item.type = element.type;
            item.unitId = element.unitId;
            item.unitName = element.unitName;
            item.allowDiscount = element.allowDiscount;
            item.quantity = element.count;
            item.price = element.price;
            item.payAmount = element.itemPrice * item.quantity;
            item.incomeAmount = element.itemPrice * item.quantity;
            item.discount = element.discount;
            item.changeFlag = element.changeFlag;
            item.remark = element.staticRemark + " " + element.remark;
            if (element.selectGoodsTags) {
                var selectGoodsTags = Object.values(element.selectGoodsTags);
                item.goodsTags = selectGoodsTags.join(",");
            }
            if (element.selectGoodsPackList && element.selectGoodsPackList.length > 0) {
                var goodsPackList = {};
                var items = new Array();
                for (let j = 0; j < element.selectGoodsPackList.length; j++) {
                    const packItem = element.selectGoodsPackList[j];
                    var packItemList = Object.values(packItem.selectItems);
                    for (let k = 0; k < packItemList.length; k++) {
                        var listItem = packItemList[k];
                        var selectTag = Object.values(listItem.selectTag);
                        if (selectTag.length > 0) {
                            listItem.goodsTags = selectTag.join(",");
                        }
                        // for (let l = 0; l < listItem.quantity; l++) {
                        //     items.push(listItem);
                        // }
                        items.push(listItem);
                    }
                }
                goodsPackList.items = items;
                item.goodsPackList = goodsPackList;
            }
            goodsList.push(item);
        }
        console.log(goodsList);
        this.setState({loading: true});
        var that = this;
        var params = { goodsList: goodsList, remark: "" };
        posService.saveGoodsBill(params,{
            success: function(data) {
                that.setState({ billData: data.data, settleModalVisible: true, loading: false });
            },
            error: function(err) {
                console.log(err);
                message.warn(err+"");
                that.setState({ loading: false });
            }
        });
    }

    render() {
        var that = this;
        return (
            <div className='pos_order'>
                <div className='pos_order_scroll_view' style={{ height: this.props.windowHeight - 84 - 50 }}>
                    <List
                        className='pos_order_list'
                        size="large"
                        dataSource={this.props.orderList}
                        header={
                            <div className='pos_order_header'>
                                <Row>
                                    <Col span={20}>
                                        <div className='pos_order_header_title'>{this.getTitle()}</div>
                                    </Col>
                                    <Col span={4}>
                                        <div className='pos_order_header_clear' onClick={event => {
                                            this.props.dispatch({ type: 'pos/clearOrderList', payload: {} });
                                        }}>清空</div>
                                    </Col>
                                </Row>

                            </div>
                        }
                        renderItem={item => (
                            <div className='pos_order_item'
                                data-item={JSON.stringify(item)}
                                onClick={event => {
                                    var itemString = event.currentTarget.getAttribute("data-item");
                                    var selectItem = JSON.parse(itemString);
                                    console.log(selectItem);
                                    that.setState({ selectItem: selectItem, modalVisible: true })
                                }}>
                                <Row>
                                    <Col span={13}>

                                        {(item.remark && item.remark.length) > 0 ? 
                                            (<div>
                                                <div className='pos_order_item_title'>{item.name}</div>
                                                <div className='pos_order_item_remark'>{item.remark}</div>
                                            </div>) : 
                                            (<div className='pos_order_item_title' style={{lineHeight: "54px"}}>{item.name}</div>)
                                        }
                                        
                                    </Col>
                                    <Col span={5}>
                                        <Row type="flex" justify="space-around">
                                            <Col span={8}>
                                                <div className='pos_order_item_remove' data-item={JSON.stringify(item)} onClick={event => {
                                                    // 阻止事件冒泡
                                                    event.stopPropagation();
                                                    var itemString = event.currentTarget.getAttribute("data-item");
                                                    var item = JSON.parse(itemString);
                                                    this.props.dispatch({ type: 'pos/removeGood', payload: { item: item } });
                                                }}>
                                                    <img className='pos_order_item_button' src={require('../../assets/remove.png')} />
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <div className='pos_order_item_number'>{item.count}</div>
                                            </Col>
                                            <Col span={8}>
                                                <div className='pos_order_item_add' data-item={JSON.stringify(item)} onClick={event => {
                                                    // 阻止事件冒泡
                                                    event.stopPropagation();
                                                    var itemString = event.currentTarget.getAttribute("data-item");
                                                    var item = JSON.parse(itemString);
                                                    this.props.dispatch({ type: 'pos/addGood', payload: { item: item } });
                                                }}>
                                                    <img className='pos_order_item_button' src={require('../../assets/add.png')} /></div>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={6}>
                                        {
                                            item.price == item.itemPrice ?
                                             <div className='pos_order_item_price'>{MoneyValue(item.price * item.count)}</div> : 
                                             <div>
                                                    <div className='pos_order_item_price' style={{lineHeight:"27px"}}>{MoneyValue(item.itemPrice * item.count)}</div>
                                                    <div className='pos_order_item_price' style={{ lineHeight: "27px", fontSize: "10px", color: "orange"}}>减免{((item.price - item.itemPrice) * item.count).toFixed(2)}</div>
                                             </div>
                                        }
                                    </Col>
                                </Row>
                            </div>
                        )}
                    />
                </div>
                
                
                <div className='pos_order_footer'>
                    <Row>
                        <Col span={16}>
                            <div className='pos_order_total'>{this.getTotal()}</div>
                        </Col>
                        <Col span={8}>
                            {this.props.orderList.length > 0 ? (<div className='pos_order_pay' onClick={event => {
                                that.saveGoodsBill();
                            }}>{this.state.loading ? <Icon type="loading"></Icon> : <span>结算</span>}</div>) : null}
                        </Col>
                    </Row>
                </div>
                {
                    this.state.selectItem ? 
                        <PosOrderGoodDetailView
                            selectItem={this.state.selectItem}
                            visible={this.state.modalVisible}
                            updatePriceAndRemark={this.updatePriceAndRemark}
                            onOk={e => {
                                that.props.dispatch({ type: 'pos/updateGood', payload: { item: that.state.selectItem } });
                                that.setState({ modalVisible: false });
                            }}
                            onCancel={e => {
                                that.setState({ modalVisible: false });
                            }}
                            afterClose={e => {
                                that.setState({ selectItem: null, modalVisible: false });
                            }}>
                        >
                        </PosOrderGoodDetailView>
                    : null
                }

                <PosSettleView
                    visible={this.state.settleModalVisible}
                    billData={this.state.billData}
                    onOk={e => {
                        that.setState({ billData:{}, settleModalVisible: false })
                        that.props.dispatch({ type: 'pos/clearOrderList', payload: {} });
                    }}
                    onCancel={e => {
                        that.setState({ settleModalVisible: false })
                    }}>
                </PosSettleView>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { list, orderList } = state.pos;
    return {
        list,
        orderList
    };
}

export default connect(mapStateToProps)(windowSize(PosOrderList));