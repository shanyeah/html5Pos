import React from 'react';
import { Row, Col, Button, List, Card, Input, Menu, Popover, Icon, message } from 'antd';
import './PosGoodDetailView.css';
import MoneyValue from '../../utils/money';

class PosGoodDetailView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectItem: props.selectItem,
            reload: props.reload,
            updatePriceAndRemark: props.updatePriceAndRemark
        }
    }

    render() {
        var that = this;
        return (
            <div>
                {
                    (function () {
                        var selectItem = that.state.selectItem;
                        if (selectItem) {

                            if (selectItem.type == 14) {
                                // 选择套餐
                                return (
                                    selectItem.goodsPackList.map((element, index) => (
                                        <List
                                            key={element.groupName}
                                            className='pos_category'
                                            header={
                                            <div className='pos_goods_list_title'>{element.groupName + " (选" + element.quantity + "个)"}
                                                    <span style={{ marginLeft: "12px", color: "red" }}>￥{MoneyValue(element.items[0].packPrice)}</span>
                                            </div>}
                                            grid={{ gutter: 12, column: 3 }}
                                            dataSource={element.items}
                                            renderItem={item => (
                                                <List.Item >
                                                    <div key={item.uniqueId}
                                                        className={
                                                            (function () {
                                                                var selectGoodsPackList = selectItem.selectGoodsPackList;
                                                                for (let i = 0; i < selectGoodsPackList.length; i++) {
                                                                    const packItem = selectGoodsPackList[i];
                                                                    if (packItem.selectItems[item.uniqueId]) {
                                                                        return 'pos_category_item_selected';
                                                                    }    

                                                                    var selectItemCount = Object.keys(packItem.selectItems).length;
                                                                    if (packItem.items[item.uniqueId] && packItem.quantity == selectItemCount) {
                                                                        return 'pos_category_item_disable';
                                                                    }
                                                                }

                                                                return 'pos_category_item';
                                                            })()
                                                        }
                                                        data-packid={element.packId} data-uniqueid={item.uniqueId} onClick={event => {
                                                            // 选择套餐子项
                                                            var id = event.currentTarget.getAttribute("data-uniqueid");
                                                            var packId = event.currentTarget.getAttribute("data-packid");
                                                            var selectGoodsPackList = selectItem.selectGoodsPackList;
                                                            
                                                            for (let i = 0; i < selectGoodsPackList.length; i++) {
                                                                const packItem = selectGoodsPackList[i];
                                                                if (packItem.packId == packId) {
                                                                    var itemCount = Object.keys(packItem.items).length;
                                                                    var selectItemCount = Object.keys(packItem.selectItems).length;
                                                                    
                                                                    if (packItem.quantity == 1) {
                                                                        var selectItems = {};
                                                                        selectItems[id] = packItem.items[id];
                                                                        packItem.selectItems = selectItems;
                                                                    } else {
                                                                        if (packItem.selectItems[id]) {
                                                                            if (itemCount == selectItemCount) {
                                                                                return;
                                                                            }
                                                                            delete packItem.selectItems[id];
                                                                        } else {
                                                                            if (packItem.quantity == selectItemCount) {
                                                                                return;
                                                                            }
                                                                            packItem.selectItems[id] = packItem.items[id];
                                                                        }
                                                                    }
                                                                    break;
                                                                }
                                                            }

                                                            that.state.updatePriceAndRemark(that.state.selectItem);
                                                            that.state.reload();
                                                            console.log(that.state.selectItem);

                                                        }}>
                                                        
                                                        <span style={{ display: "inline-block", verticalAlign: "middle",  maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis"}}>{item.name+""}</span> 
                                                        <span style={{ display: "inline-block", verticalAlign: "top", color: "red", fontSize: "6px"}}>
                                                        {
                                                            (function() {
                                                                    var minPrice = element.items[0].packPrice;
                                                                    var price = item.packPrice;
                                                                    var interPrice = price - minPrice;
                                                                    if (interPrice > 0) {
                                                                        return '+￥' +  MoneyValue(interPrice);
                                                                    }
                                                                    return '';
                                                            })()
                                                        }
                                                        </span> 
                                                        {/* 选择套餐中的口味 */}
                                                        {(function () {
                                                            var selected = false;
                                                            for (let i = 0; i < selectItem.selectGoodsPackList.length; i++) {
                                                                const packItem = selectItem.selectGoodsPackList[i];
                                                                var goodItem = packItem.selectItems[item.uniqueId];
                                                                if (goodItem) {
                                                                    selected = true;
                                                                    break;
                                                                }
                                                            }
                                                            if (selected && item.goodsTagCategories && item.goodsTagCategories.length > 0) {
                                                                return (<Popover
                                                                    title="选择口味"
                                                                    content={
                                                                        item.goodsTagCategories.map((element, index) => (
                                                                            <List
                                                                                key={element.id}
                                                                                className='pos_category'
                                                                                header={<div className='pos_goods_list_title'>{element.name}</div>}
                                                                                grid={{ gutter: 12, column: 4 }}
                                                                                dataSource={element.goodsTags}
                                                                                renderItem={tagItem => (
                                                                                    <List.Item >
                                                                                        <div key={tagItem.id}
                                                                                            data-id={tagItem.id}
                                                                                            data-uniqueid={item.uniqueId}
                                                                                            data-tagid={tagItem.tagId}
                                                                                            className={
                                                                                                (function () {
                                                                                                    var selectGoodsPackList = selectItem.selectGoodsPackList;
                                                                                                    for (let i = 0; i < selectGoodsPackList.length; i++) {
                                                                                                        const packItem = selectGoodsPackList[i];
                                                                                                        var goodItem = packItem.selectItems[item.uniqueId];
                                                                                                        if (goodItem && tagItem.id == goodItem.selectTag[tagItem.tagId]) {
                                                                                                            return 'pos_category_item_selected';
                                                                                                        }
                                                                                                    }
                                                                                                    return 'pos_category_item';
                                                                                                })()
                                                                                            }
                                                                                            onClick={event => {
                                                                                                var uniqueId = event.currentTarget.getAttribute("data-uniqueid");
                                                                                                var tagId = event.currentTarget.getAttribute("data-tagid");
                                                                                                var id = event.currentTarget.getAttribute("data-id");
                                                                                                var selectGoodsPackList = selectItem.selectGoodsPackList;
                                                                                                // console.log(goodsId + "--" + tagId + "--" + id);
                                                                                                for (let i = 0; i < selectGoodsPackList.length; i++) {
                                                                                                    const packItem = selectGoodsPackList[i];
                                                                                                    var goodItem = packItem.selectItems[uniqueId];
                                                                                                    if (goodItem) {
                                                                                                        if (id != goodItem.selectTag[tagId]) {
                                                                                                            goodItem.selectTag[tagId] = id;
                                                                                                            that.state.updatePriceAndRemark(that.state.selectItem);
                                                                                                            that.state.reload();
                                                                                                        }
                                                                                                        break;
                                                                                                    }
                                                                                                }
                                                                                            }}>{tagItem.name}</div>
                                                                                    </List.Item>
                                                                                )}
                                                                            ></List>
                                                                        ))
                                                                    }
                                                                    arrowPointAtCenter>
                                                                    <div style={{ float: "right", marginRight: "10px" }}><Icon type="down" /></div>

                                                                </Popover>)
                                                            }
                                                        })()}


                                                    </div>

                                                </List.Item>
                                            )}
                                        ></List>
                                    ))
                                );
                            }

                            if (selectItem.goodsTagCategories && selectItem.goodsTagCategories.length > 0) {
                                // 选择口味
                                return (selectItem.goodsTagCategories.map((element, index) => (
                                    <List
                                        key={element.id}
                                        className='pos_category'
                                        header={<div className='pos_goods_list_title'>{element.name}</div>}
                                        grid={{ gutter: 12, column: 4 }}
                                        dataSource={element.goodsTags}
                                        renderItem={item => (
                                            <List.Item >
                                                <div key={item.id} className={item.id == selectItem.selectGoodsTags[element.id] ? 'pos_category_item_selected' : 'pos_category_item'}
                                                    data-tagid={element.id} data-id={item.id} onClick={event => {
                                                        var tagId = event.currentTarget.getAttribute("data-tagid");
                                                        var id = event.currentTarget.getAttribute("data-id");
                                                        var selectItem = that.state.selectItem;
                                                        selectItem.selectGoodsTags[tagId] = id;
                                                        that.state.reload();
                                                    }}>{item.name}</div>
                                            </List.Item>
                                        )}
                                    ></List>
                                )));
                            }

                            

                        }
                    })()
                }

                <div>
                    {this.state.selectItem.staticRemark.length > 0 ? <div><br />备注:<br />{this.state.selectItem.staticRemark} </div>: <div></div>}
                    <div>
                        <br />
                        <Input
                            placeholder="附加备注"
                            value={that.state.selectItem.remark}
                            onChange={e => {
                                that.state.selectItem.remark = e.target.value;
                                that.state.reload();
                            }}
                        ></Input>
                    </div>
                </div>
            </div>
        );
    }
}

export default PosGoodDetailView;