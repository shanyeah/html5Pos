import fetch from 'dva/fetch';
import md5 from './md5';
import appConfig from "./appConfig";

const MJDJ_LOCAL_SERVER = 'http://localhost:8000';
const MJDJ_SERVER = 'http://local.api.liandaxia.com';
// const MJDJ_SERVER = 'http://api.liandaxia.com/';

// const MJDJ_SERVER = 'http://local.api.mjdj.cn/';
// const MJDJ_SERVER = 'http://imp.mjdj.cn/';



function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  var error = new Error("网络异常, 请稍候再试!");
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options, callback) {
  let requestUrl = (appConfig.mock || url.indexOf("mock") > 0) ? url : MJDJ_SERVER + url;
  
  var token = '0';
  var posCheckId = 0;

  var loginInfo = window.mjGetLoginInfo();

  var organId = '21';
  var posCheckId = 0;
  if (loginInfo) {
     token = loginInfo.token;
     posCheckId = loginInfo.posCheckId;
  }

  if (token) {
    var connector = requestUrl.indexOf('?') > 0 ? '&' : '?';
    requestUrl = requestUrl + connector + 'token=' + token;
  }

  if (posCheckId) {
    var connector = requestUrl.indexOf('?') > 0 ? '&' : '?';
    requestUrl = requestUrl + connector + 'posCheckId=' + posCheckId;
  }

  if (window["mjGetAppSign"]) {
    requestUrl = window.mjGetAppSign(requestUrl, options.body ? JSON.stringify(options.body) : "");
  } else {
    var nonce = Math.round(Math.random() * 1 + 60);
    var time = (new Date()).valueOf();
    var deviceId = 1;
    var body = JSON.stringify(options.body);
    var signStr = 'nonce=' + nonce + '&time=' + time + '&user=' + ('hello' + body + 'kd0*J0c!' + '54321');
    var sign = md5(signStr);
    console.log("url:" + requestUrl);
    requestUrl = requestUrl + '&time=' + time + '&nonce=' + nonce + '&sign=' + sign + '&deviceId=' + deviceId + '&organId=' + organId;
  }

  
  return fetch(requestUrl, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => { 
        if (data.code == 0) {
          if (callback && callback.success) {
            callback.success(data);
          }
        } else {
          var error = data.message ? data.message : "网络异常, 请稍候再试!";
          console.log(error);
          if (callback && callback.error) {
            callback.error(error);
          }
        }
        return { data };
    })
    .catch(err => { 
        console.log(err);
        var error = "网络异常, 请稍候再试!";  
        if (callback && callback.error) {
          callback.error(error);
        }
        return { error };
    });
}
