import React from 'react';
import './MemberGoodsExchangeView.css';
import MemberGoodsOrderList from './MemberGoodsOrderList'
import MemberGoodsView from './MemberGoodsView'

class MemberGoodsExchangeView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='member_pos_layout_main'>
                <div className='member_pos_layout_slider'>
                    <MemberGoodsOrderList></MemberGoodsOrderList>
                </div>
                <div className='member_pos_layout_content'>
                    <MemberGoodsView></MemberGoodsView>
                </div>
            </div>
        );
    }
}

export default MemberGoodsExchangeView;