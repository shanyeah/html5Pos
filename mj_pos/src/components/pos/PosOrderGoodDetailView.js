import React from 'react';
import { Row, Col, Button, List, Card, Input, InputNumber, Menu, Popover, Icon, Modal } from 'antd';
import './PosOrderGoodDetailView.css';
import PosGoodDetailView from './PosGoodDetailView';
import MoneyValue from '../../utils/money';

class PosOrderGoodDetailView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: props.visible,
            selectItem: props.selectItem,
            updatePriceAndRemark: props.updatePriceAndRemark,
            changePrice: MoneyValue(props.selectItem.itemPrice),
            render: 0
        }
        console.log(this.state);
        
    }

    reload() {
        this.setState({ render: this.state.render++ });
    }

    render() {
        var that = this;
        return (
            <Modal title={this.state.selectItem.name}
                width={860}
                bodyStyle={{ padding: "0px 0px 0px 24px" }}
                wrapClassName="vertical-center-modal"
                visible={this.state.modalVisible}
                onOk={e => {
                    that.state.modalVisible = false;
                    that.props.onOk(e);
                }}
                onCancel={e => {
                    that.state.modalVisible = false;
                    that.props.onCancel(e);
                }}
                afterClose={e => {
                    that.props.afterClose(e);
                }}
                maskClosable={false}
                keyboard={false}
            >
                <Row>
                    <Col span={16} style={{ paddingRight: "24px" }}>
                        <PosGoodDetailView
                            selectItem={this.state.selectItem}
                            reload={this.reload.bind(this)}
                            updatePriceAndRemark={this.state.updatePriceAndRemark} >
                            </PosGoodDetailView>
                    </Col>
                    <Col span={8}>
                        <div className='pos_order_detail_control'>
                            <div className='pos_order_detail_control_item'>
                                <Row>
                                    <Col span={18}>
                                        <div className='pos_order_detail_control_item_title'>原价</div>
                                    </Col>
                                    <Col span={6}>
                                        <div className='pos_order_detail_control_item_price'>{MoneyValue(this.state.selectItem.price)}</div>
                                    </Col>
                                </Row>

                            </div>
                            <div className='pos_order_detail_control_item'>
                                <Row>
                                    <Col span={15}>
                                        <div className='pos_order_detail_control_item_title'>折扣</div>
                                    </Col>
                                    <Col span={8}>
                                        <InputNumber
                                            ref={(input) => { this.discountInput = input; }} 
                                            min={10}
                                            max={100}
                                            formatter={value => `${Math.round(value)}%`}
                                            parser={value => value.replace('%', '')}
                                            value={this.state.selectItem.discount}
                                            onChange={value => {
                                                that.state.selectItem.changeFlag = 0;
                                                that.state.selectItem.discount = value;
                                                that.state.selectItem.itemPrice = MoneyValue(that.state.selectItem.price * value / 100);
                                                console.log(that.state);
                                                that.reload();
                                            }} 
                                            onKeyDown={e => {
                                                
                                                if (e.keyCode == 13) {
                                                    that.priceInput.focus(); 
                                                }
                                            }}
                                            />
                                    </Col>
                                </Row>
                            </div>
                            <div className='pos_order_detail_control_item'>
                                <Row>
                                    <Col span={15}>
                                        <div className='pos_order_detail_control_item_title'>现价</div>
                                    </Col>
                                    <Col span={8}>
                                        <Input
                                            ref={(input) => { this.priceInput = input; }} 
                                            value={this.state.selectItem.changeFlag == 0 ?
                                                (MoneyValue(this.state.selectItem.price) * this.state.selectItem.discount / 100).toFixed(2)
                                                : this.state.changePrice}
                                            onChange={event => {

                                                var value = event.target.value;
                                                if (MoneyValue(value) * 100 > MoneyValue(that.state.selectItem.price) * 100) {
                                                    value = MoneyValue(that.state.selectItem.price);
                                                }
                                                if (value < 0) {
                                                    value = 0;
                                                }

                                                that.state.changePrice = value;
                                                that.state.selectItem.changeFlag = 1;
                                                that.state.selectItem.discount = Math.round((value / MoneyValue(that.state.selectItem.price)) * 100);
                                                that.state.selectItem.itemPrice = value;
                                                that.reload();
                                                
                                            }}
                                            onPressEnter={e => {
                                                that.priceInput.blur();
                                                that.countInput.focus();
                                            }}
                                            />
                                    </Col>
                                </Row>
                            </div>
                            <div className='pos_order_detail_control_item'>
                                <Row>
                                    <Col span={13}>
                                        <div className='pos_order_detail_control_item_title'>数量</div>
                                    </Col>
                                    <Col span={2}>
                                        X
                                            </Col>
                                    <Col span={8}>
                                        <InputNumber 
                                            ref={(input) => { this.countInput = input; }} 
                                            min={1} 
                                            defaultValue={this.state.selectItem.count} 
                                            onChange={value => {
                                            that.state.selectItem.count = value;
                                            that.reload();
                                            }} 
                                            onKeyDown={e => {
                                                if (e.keyCode == 13) {
                                                    that.state.modalVisible = false;
                                                    that.props.onOk(e);
                                                }
                                                
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <div className='pos_order_detail_control_item'>
                                <Row>
                                    <Col span={18}>
                                        <div className='pos_order_detail_control_item_title'>小计</div>
                                    </Col>
                                    <Col span={6}>
                                        <div className='pos_order_detail_control_item_price'>￥{(this.state.selectItem.changeFlag == 0 ?
                                            (MoneyValue(this.state.selectItem.price) * this.state.selectItem.discount / 100).toFixed(2)
                                            : this.state.changePrice) * that.state.selectItem.count}</div>
                                    </Col>
                                </Row>
                            </div>

                        </div>
                    </Col>
                </Row>
            </Modal>
        )
    }
}

export default PosOrderGoodDetailView;