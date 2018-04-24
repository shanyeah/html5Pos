import React from 'react';
import { Row, Col, Input } from 'antd';
import { connect } from 'dva';
import './PosSettleCouponView.css';
import './PosSettleCommon.css'

class PosSettleCouponView extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <Row className="pos_settle_row">
                    <Col span={3}>
                        优惠券号
                    </Col>
                    <Col span={20}>
                        <Input></Input>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
}

export default connect(mapStateToProps)(PosSettleCouponView);