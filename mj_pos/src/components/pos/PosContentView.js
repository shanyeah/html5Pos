import React from 'react';
import './PosContentView.css';
import PosOrderList from './PosOrderList'
import PosGoodsView from './PosGoodsView'

class PosContentView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='pos_layout_main'>
                <div className='pos_layout_slider'>
                    <PosOrderList></PosOrderList>
                </div>
                <div className='pos_layout_content'>
                    <PosGoodsView></PosGoodsView>
                </div>
            </div> 
        );
    }
}

export default PosContentView;