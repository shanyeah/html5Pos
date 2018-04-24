import React from 'react';
import styles from './LoginPage.css'
import { connect } from 'dva';
import { LocaleProvider,Form, Input,Button,Icon,message} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { routerRedux } from 'dva/router'
import BaseTipsView from '../components/base/BaseTipsView'

const FormItem = Form.Item;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
        // console.log('props', props);
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  componentWillReceiveProps(props) {
    if (props.extData.code == 0) {
      // message.info(props.extData.message);
      this.props.history.push("/");
    } 
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({ type: 'login/login', payload: values });
        console.log('props', this.props);
      }
    });
  }

  render() {

    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const userNameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');

    return (
        <LocaleProvider locale={zh_CN}>
            <div className='normal'>
              <div className="header"></div>
              <div className="loginWraper">
                <div id="loginform" className="loginBox">
                  <Form className="formName" onSubmit={this.handleSubmit}>
                    <FormItem className="formItem"         
                      validateStatus={userNameError ? 'error' : ''}
                      help={userNameError || ''}>

                      {getFieldDecorator('username', {
                      rules: [{ required: true, message: '帐号不能为空!' }],
                      })(
                        <Input className="inputName"
                          placeholder="输入帐户名"
                          prefix={<Icon type="user"/>}
                        />
                      )}
                    </FormItem>

                    <FormItem className="formItem"
                      validateStatus={passwordError ? 'error' : ''}
                      help={passwordError || ''}>

                      {getFieldDecorator('password', {
                        rules: [{ required: true, message: '密码不能为空!' }],
                      })(
                        <Input className="password"
                          placeholder="输入密码"
                          prefix={<Icon type="lock"/>} 
                          type="password"
                        />
                      )}
                    </FormItem>

                    <FormItem>
                      <Button className="btSumbit" 
                        type="primary" 
                        htmlType="submit"
                        disabled={hasErrors(getFieldsError())}>登录</Button>
                    </FormItem>

                  </Form>

                </div>
              </div>
              <div className="footer">Copyright by 魔杰电竞</div>
              <BaseTipsView location={this.props.location} history={this.props.history}></BaseTipsView>              
            </div>
        </LocaleProvider>
      );
    }
}

function mapStateToProps(state) {
    const { extData } = state.login;
    console.log(state);
    return {
        loading: state.loading.models.login,
        extData
    };
}

LoginPage = Form.create()(LoginPage);
export default connect(mapStateToProps)(LoginPage);