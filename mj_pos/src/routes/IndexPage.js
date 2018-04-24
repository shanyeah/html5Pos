import React from 'react';
import styles from './IndexPage.css'
import PosLayout from '../components/pos/PosLayout'
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <LocaleProvider locale={zh_CN}>
            <div className='normal'>
              <PosLayout location={this.props.location} history={this.props.history}>
              </PosLayout>
            </div>
        </LocaleProvider>
      );
    }
}

export default IndexPage;
