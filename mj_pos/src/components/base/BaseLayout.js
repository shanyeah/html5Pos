import React from 'react';
import './BaseLayout.css';
import BaseTipsView from './BaseTipsView'

class BaseLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="content">
                    <div className="main">
                        {this.props.children}
                    </div>
                </div>
                <BaseTipsView location={this.props.location} history={this.props.history}></BaseTipsView>
            </div>
        );
    }
}

export default BaseLayout;