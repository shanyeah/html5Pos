import React from 'react';
import { Row, Col, Button, List, Card, Input, Modal, Menu, Popover, Icon, Pagination, Spin, message } from 'antd';
import Hotkeys from 'react-hot-keys';
import windowSize from 'react-window-size';
import { connect } from 'dva';
import PosGoodDetailView from '../pos/PosGoodDetailView'
import '../pos/PosGoodsView.css';
import MoneyValue from '../../utils/money';

class MemberGoodsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCategory: 0,
            categoryGridConfig: { gutter: 10, xs: 2, sm: 3, md: 4, lg: 6, xl: 8, xxl: 8 },
            goodsGridConfig: { gutter: 10, xs: 2, sm: 2, md: 3, lg: 4, xl: 6, xxl: 8 },
            goodsLimitCount: 0,
            currentPage: 1,
            totalPage: 1,
            searchValue: '',
            searchList: [],
            selectItem: null,
            modalVisible: false,
            render: 0
        }
    }

    reload() {
        this.setState({ render: this.state.render++ });
    }

    componentWillReceiveProps(props) {
        this.updatePage(props);
    }

    componentDidMount() {
        this.props.dispatch({ type: 'pos/fetchGoods', payload: {} });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    updatePage(props) {
        if (props.list && props.list.length > 0) {
            // 计算要显示的商品个数
            var width = props.windowWidth;
            var height = props.windowHeight;
            var categoryItemCount = 0;
            var goodsItemCount = 0;

            if (width < 576) {
                categoryItemCount = this.state.categoryGridConfig.xs;
                goodsItemCount = this.state.goodsGridConfig.xs;
            } else if (width < 768) {
                categoryItemCount = this.state.categoryGridConfig.sm;
                goodsItemCount = this.state.goodsGridConfig.sm;
            } else if (width < 992) {
                categoryItemCount = this.state.categoryGridConfig.md;
                goodsItemCount = this.state.goodsGridConfig.md;
            } else if (width < 1200) {
                categoryItemCount = this.state.categoryGridConfig.lg;
                goodsItemCount = this.state.goodsGridConfig.lg;
            } else if (width < 1600) {
                categoryItemCount = this.state.categoryGridConfig.xl;
                goodsItemCount = this.state.goodsGridConfig.xl;
            } else if (width >= 1600) {
                categoryItemCount = this.state.categoryGridConfig.xxl;
                goodsItemCount = this.state.goodsGridConfig.xxl;
            }

            var list = [];
            if (this.state.searchList.length > 0) {
                list = this.state.searchList;
            } else {
                for (var i = 0; i < props.list.length; i++) {
                    var item = props.list[i];
                    if (item.categoryId == this.state.currentCategory) {
                        list = item.goodsList;
                        break;
                    }
                }
            }

            var categoryHeight = Math.ceil(props.list.length / categoryItemCount) * 46 + 20;
            var totalGoodsCount = list.length;
            var goodsHeight = height - 84 - 40 - categoryHeight - 54;
            var goodsLimitCount = Math.floor(goodsHeight * 1.0 / 70.0) * goodsItemCount;
            // console.log(categoryHeight + "---" + totalGoodsCount + "---" + goodsHeight + "---" + goodsLimitCount);
            // console.log("width:" + width + " height:" + height);
            if (goodsLimitCount >= totalGoodsCount) {
                this.setState({
                    goodsLimitCount: totalGoodsCount,
                    currentPage: 1,
                    totalPage: 1
                });
            } else {
                var totalPage = Math.ceil(totalGoodsCount / goodsLimitCount);
                this.setState({
                    goodsLimitCount: goodsLimitCount,
                    currentPage: 1,
                    totalPage: totalPage
                });
            }
        }
    }

    onKeyDown(keyName, e, handle) {
        this.searchInput.focus();
    }

    onSearch(value) {
        var searchValue = value.toLowerCase();
        var searchList = new Array();
        for (var i = 1; i < this.props.list.length; i++) {
            var goodsList = this.props.list[i].goodsList;
            for (let j = 0; j < goodsList.length; j++) {
                var item = goodsList[j];
                if (item.name.indexOf(value) >= 0
                    || item.py.indexOf(searchValue) >= 0
                    || item.py1.indexOf(searchValue) >= 0
                    || (item.code != undefined && item.code.toLowerCase().indexOf(searchValue) >= 0)
                ) {
                    searchList.push(item);
                }
            }
        }
        this.state.searchList = searchList;

        this.updatePage(this.props);
    }

    onSearchChange(e) {
        var value = e.target.value;

        if (value.length == 0) {
            this.clearSearch();
        } else {
            this.state.searchValue = value;
            this.onSearch(value);
        }
    }

    clearSearch(e) {
        this.state.searchValue = '';
        this.state.searchList = [];
        this.updatePage(this.props);
    }

    getCurrentGoodList(goodList) {
        var list = [];
        if (this.state.searchList.length > 0) {
            list = this.state.searchList;
        } else {
            for (var i = 0; i < goodList.length; i++) {
                var item = goodList[i];
                if (item.categoryId == this.state.currentCategory) {
                    list = item.goodsList;
                    break;
                }
            }
        }
        var currentList = [];

        if (this.state.totalPage == 1) {
            currentList = list;
        } else {
            var page = this.state.currentPage;
            var limitCount = this.state.goodsLimitCount;
            var start = (page - 1) * limitCount;
            var end = limitCount * page < list.length ? limitCount * page : (list.length);
            currentList = list.slice(start, end);
        }

        return currentList;
    }

    showModal() {
        this.setState({ modalVisible: true })
    }

    hideModal() {
        this.setState({ modalVisible: false })
    }

    handleModalClose() {
        this.setState({ selectItem: null })
    }

    handleModalOk() {
        var selectItem = this.state.selectItem;
        // console.log(selectItem);
        // if (selectItem.goodsTagCategories && selectItem.goodsTagCategories.length > 0 && Object.keys(selectItem.selectGoodsTags).length != selectItem.goodsTagCategories.length) {
        //     message.warning('请选择口味');
        //     return;
        // }

        if (selectItem.goodsPackList && selectItem.goodsPackList.length > 0 && Object.keys(selectItem.selectGoodsPackList).length != selectItem.goodsPackList.length) {
            message.warning('请选择套餐');
            return;
        }

        this.props.dispatch({ type: 'pos/addGood', payload: { item: selectItem } });
        this.setState({ selectItem: null, modalVisible: false })
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
                        if (item && item.packPrice) {
                            price += item.packPrice;
                        }
                    });
                }
                selectItem.price = price;

                for (let i = 0; i < selectItem.selectGoodsPackList.length; i++) {
                    const pack = selectItem.selectGoodsPackList[i];
                    var selectItems = pack.selectItems;
                    var items = Object.values(selectItems);
                    items.forEach(item => {
                        if (item && item.selectTag) {
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
                        }
                    });
                }
                selectItem.staticRemark = remark;
            } else {

            }


        }

    }

    render() {
        var that = this;
        return (
            <div className='pos_content' style={{ height: '100%' }}>
                <Spin className="pos_spin" size="large" spinning={this.props.loading} ></Spin>
                <Row>
                    <Col span={23}>
                        <Input.Search
                            ref={(input) => { this.searchInput = input; }}
                            placeholder="搜索商品"
                            // onSearch={this.onSearch.bind(this)} 
                            onChange={this.onSearchChange.bind(this)}
                            addonAfter={<div className='pos_search_clear' onClick={this.clearSearch.bind(this)}>清空</div>}
                            value={this.state.searchValue}
                        >
                        </Input.Search>
                    </Col>
                    <Col span={1}>
                        <div style={{ marginLeft: "4px" }}><Button shape="circle" icon="reload" onClick={event => {
                            that.props.dispatch({ type: 'pos/fetchGoods', payload: {} });
                        }} /></div>
                    </Col>
                </Row>

                <Hotkeys
                    keyName="ctrl+f"
                    onKeyDown={this.onKeyDown.bind(this)}
                />
                <List
                    className='pos_category'
                    grid={this.state.categoryGridConfig}
                    header={<div className='pos_goods_list_title' style={{ display: this.props.loading ? "none" : "block" }} >分类</div>}
                    dataSource={this.props.list}
                    renderItem={item => (
                        <List.Item >
                            <div className={item.categoryId == this.state.currentCategory ? 'pos_category_item_selected' : 'pos_category_item'}
                                data-category={item.categoryId} onClick={event => {
                                    var category = event.currentTarget.getAttribute("data-category");
                                    that.state.currentCategory = category;
                                    that.updatePage(that.props);
                                }}>{item.categoryName} </div>
                        </List.Item>
                    )}
                />
                <List
                    grid={this.state.goodsGridConfig}
                    header={
                        <Row style={{ display: this.props.loading ? "none" : "block" }}>
                            <Col span={12}>
                                <div className='pos_goods_list_title' >商品</div>
                            </Col>
                            <Col span={12}>
                                <Pagination
                                    style={{ textAlign: "right" }}
                                    pageSize={1}
                                    defaultCurrent={1}
                                    current={this.state.currentPage}
                                    total={this.state.totalPage}
                                    hideOnSinglePage={true}
                                    onChange={(page) => {
                                        that.setState({ currentPage: page });
                                    }} />
                            </Col>
                        </Row>

                    }
                    dataSource={this.getCurrentGoodList(this.props.list)}
                    renderItem={item => (
                        <List.Item >
                            <div className='pos_goods_item' data-item={JSON.stringify(item)} onClick={event => {
                                var itemString = event.currentTarget.getAttribute("data-item");
                                var item = JSON.parse(itemString);

                                // 需要选择套餐或者口味
                                if (item.type == 14) {
                                    // 初始化套餐选择数据
                                    var selectGoodsPackList = new Array();
                                    for (let i = 0; i < item.goodsPackList.length; i++) {
                                        var element = item.goodsPackList[i];
                                        var dict = {};
                                        dict.packId = element.packId;
                                        dict.groupType = element.groupType;
                                        dict.groupName = element.groupName;
                                        dict.quantity = element.quantity;
                                        var selectItems = {}; // 记录选中项
                                        var items = {};       // 记录所有子项
                                        var expandItems = new Array();
                                        for (let j = 0; j < element.items.length; j++) {
                                            var itemElement = element.items[j];

                                            for (let index = 0; index < itemElement.quantity; index++) {
                                                var newItemElement = JSON.parse(JSON.stringify(itemElement));
                                                var uniqueId = newItemElement.goodsId + "" + index;
                                                newItemElement.uniqueId = uniqueId;
                                                newItemElement.quantity = 1;
                                                expandItems.push(newItemElement);
                                            }

                                            var itemDict = {};
                                            itemDict.categoryId = itemElement.categoryId;
                                            itemDict.categoryName = itemElement.categoryName;
                                            itemDict.goodsId = itemElement.goodsId;
                                            itemDict.name = itemElement.name;
                                            itemDict.packPrice = itemElement.packPrice;
                                            itemDict.price = itemElement.price;
                                            itemDict.quantity = itemElement.quantity;
                                            itemDict.unitId = itemElement.unitId;
                                            itemDict.unitName = itemElement.unitName;
                                            itemDict.selectTag = {};
                                            if (itemElement.goodsTagCategories && itemElement.goodsTagCategories.length > 0) {
                                                var tags = {};
                                                for (let k = 0; k < itemElement.goodsTagCategories.length; k++) {
                                                    const tagElement = itemElement.goodsTagCategories[k];
                                                    if (tagElement.goodsTags.length > 0) {
                                                        for (let l = 0; l < tagElement.goodsTags.length; l++) {
                                                            var tag = tagElement.goodsTags[l];
                                                            tag.tagId = tagElement.id;
                                                            tags[tag.id] = tag;
                                                        }
                                                        itemDict.tags = tags; // 记录所有口味
                                                    }
                                                }

                                            }

                                            for (let index = 0; index < itemDict.quantity; index++) {
                                                var uniqueId = itemDict.goodsId + "" + index;
                                                itemElement.uniqueId = uniqueId;
                                                var newItemDict = JSON.parse(JSON.stringify(itemDict));
                                                newItemDict.uniqueId = uniqueId;
                                                newItemDict.quantity = 1;
                                                items[uniqueId] = newItemDict;
                                                if (Object.keys(selectItems).length < element.quantity) {
                                                    selectItems[newItemDict.uniqueId] = newItemDict;
                                                }
                                            }
                                        }
                                        element.items = expandItems;
                                        dict.items = items;
                                        dict.selectItems = selectItems;
                                        selectGoodsPackList.push(dict);
                                        console.log(dict);
                                    }

                                    item.selectGoodsPackList = selectGoodsPackList;

                                    this.updatePriceAndRemark(item);
                                    this.setState({ selectItem: item, modalVisible: true })
                                } else if (item.goodsTagCategories && item.goodsTagCategories.length > 0) {
                                    var tags = {};
                                    for (let k = 0; k < item.goodsTagCategories.length; k++) {
                                        const tagElement = item.goodsTagCategories[k];
                                        for (let l = 0; l < tagElement.goodsTags.length; l++) {
                                            var tag = tagElement.goodsTags[l];
                                            tag.tagId = tagElement.id;
                                            tags[tag.id] = tag;
                                        }
                                    }
                                    item.tags = tags;
                                    item.remark = '';
                                    item.selectGoodsTags = {};
                                    this.setState({ selectItem: item, modalVisible: true })
                                } else {
                                    item.remark = '';
                                    this.props.dispatch({ type: 'pos/addGood', payload: { item: item } });
                                }

                            }} >
                                <img className='pos_goods_image' src={item.imageUrl}></img>
                                <div>
                                    <div className='pos_goods_item_title'>{item.name}</div>
                                    <div className='pos_goods_item_price'>￥{MoneyValue(item.price)}</div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />


                {
                    this.state.selectItem ?
                        <Modal
                            title={this.state.selectItem.name}
                            width={740}
                            wrapClassName="vertical-center-modal"
                            visible={this.state.modalVisible}
                            onOk={this.handleModalOk.bind(this)}
                            onCancel={this.hideModal.bind(this)}
                            afterClose={this.handleModalClose.bind(this)}
                            maskClosable={false}
                        >
                            <PosGoodDetailView
                                selectItem={this.state.selectItem}
                                reload={this.reload.bind(this)}
                                updatePriceAndRemark={this.updatePriceAndRemark.bind(this)} ></PosGoodDetailView>

                        </Modal>
                        :
                        <div></div>
                }
            </div>

        );
    }
}

function mapStateToProps(state) {
    const { list } = state.pos;
    return {
        loading: state.loading.models.pos,
        list
    };
}

export default connect(mapStateToProps)(windowSize(MemberGoodsView));