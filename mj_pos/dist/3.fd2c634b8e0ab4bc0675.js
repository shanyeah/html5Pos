webpackJsonp([3],{302:function(t,e,r){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=r(48),i=n(o),a=r(11),s=n(a),u=r(138),f=(n(u),r(873)),d=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}(f);e.default={namespace:"login",state:{extData:{}},reducers:{save:function(t,e){var r=e.payload.extData;return(0,s.default)({},t,{extData:r})}},effects:{login:i.default.mark(function t(e,r){var n,o,a,s,u=e.payload,f=r.call,c=r.put;return i.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("values of form: ",u),t.next=3,c({type:"save",payload:{extData:{}}});case 3:return t.prev=3,t.next=6,f(d.login,u);case 6:if(n=t.sent,o=n.data,a=n.err,0!=o.code){t.next=16;break}return window.mjSetLoginInfo(o.data),t.next=13,c({type:"save",payload:{extData:o}});case 13:console.log("loginData12",o),t.next=20;break;case 16:return s=o.message,s&&0!=s.length||(s="\u767b\u9646\u5f02\u5e38"),t.next=20,c({type:"tips/handleErrorMsg",payload:{msg:s}});case 20:t.next=26;break;case 22:return t.prev=22,t.t0=t.catch(3),t.next=26,c({type:"tips/handleErrorMsg",payload:{msg:t.t0}});case 26:case"end":return t.stop()}},t,this,[[3,22]])})},subscriptions:{setup:function(t){t.dispatch;return t.history.listen(function(t){t.pathname,t.search})}}},t.exports=e.default},346:function(t,e,r){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function o(t){return t.json()}function i(t){if(t.status>=200&&t.status<300)return t;var e=new Error("\u7f51\u7edc\u5f02\u5e38, \u8bf7\u7a0d\u5019\u518d\u8bd5!");throw e.response=t,e}function a(t,e,r){var n=p.default.mock||t.indexOf("mock")>0?t:y+t,a="0",s=0,f=window.mjGetLoginInfo(),s=0;if(f&&(a=f.token,s=f.posCheckId),a){var c=n.indexOf("?")>0?"&":"?";n=n+c+"token="+a}if(s){var c=n.indexOf("?")>0?"&":"?";n=n+c+"posCheckId="+s}if(window.mjGetAppSign)n=window.mjGetAppSign(n,e.body?(0,u.default)(e.body):"");else{var h=Math.round(1*Math.random()+60),b=(new Date).valueOf(),m=(0,u.default)(e.body),v="nonce="+h+"&time="+b+"&user=hello"+m+"kd0*J0c!54321",w=(0,l.default)(v);console.log("url:"+n),n=n+"&time="+b+"&nonce="+h+"&sign="+w+"&deviceId=1&organId=21"}return(0,d.default)(n,e).then(i).then(o).then(function(t){if(0==t.code)r&&r.success&&r.success(t);else{var e=t.message?t.message:"\u7f51\u7edc\u5f02\u5e38, \u8bf7\u7a0d\u5019\u518d\u8bd5!";console.log(e),r&&r.error&&r.error(e)}return{data:t}}).catch(function(t){console.log(t);return r&&r.error&&r.error("\u7f51\u7edc\u5f02\u5e38, \u8bf7\u7a0d\u5019\u518d\u8bd5!"),{error:"\u7f51\u7edc\u5f02\u5e38, \u8bf7\u7a0d\u5019\u518d\u8bd5!"}})}Object.defineProperty(e,"__esModule",{value:!0});var s=r(136),u=n(s);e.default=a;var f=r(359),d=n(f),c=r(362),l=n(c),h=r(363),p=n(h),y="http://local.api.liandaxia.com";t.exports=e.default},359:function(t,e,r){t.exports=r(360)},360:function(t,e,r){r(361),t.exports=self.fetch.bind(self)},361:function(t,e){!function(t){"use strict";function e(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function r(t){return"string"!=typeof t&&(t=String(t)),t}function n(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return m.iterable&&(e[Symbol.iterator]=function(){return e}),e}function o(t){this.map={},t instanceof o?t.forEach(function(t,e){this.append(e,t)},this):Array.isArray(t)?t.forEach(function(t){this.append(t[0],t[1])},this):t&&Object.getOwnPropertyNames(t).forEach(function(e){this.append(e,t[e])},this)}function i(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function a(t){return new Promise(function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}})}function s(t){var e=new FileReader,r=a(e);return e.readAsArrayBuffer(t),r}function u(t){var e=new FileReader,r=a(e);return e.readAsText(t),r}function f(t){for(var e=new Uint8Array(t),r=new Array(e.length),n=0;n<e.length;n++)r[n]=String.fromCharCode(e[n]);return r.join("")}function d(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function c(){return this.bodyUsed=!1,this._initBody=function(t){if(this._bodyInit=t,t)if("string"==typeof t)this._bodyText=t;else if(m.blob&&Blob.prototype.isPrototypeOf(t))this._bodyBlob=t;else if(m.formData&&FormData.prototype.isPrototypeOf(t))this._bodyFormData=t;else if(m.searchParams&&URLSearchParams.prototype.isPrototypeOf(t))this._bodyText=t.toString();else if(m.arrayBuffer&&m.blob&&w(t))this._bodyArrayBuffer=d(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!m.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(t)&&!g(t))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=d(t)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):m.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},m.blob&&(this.blob=function(){var t=i(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?i(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(s)}),this.text=function(){var t=i(this);if(t)return t;if(this._bodyBlob)return u(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(f(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},m.formData&&(this.formData=function(){return this.text().then(p)}),this.json=function(){return this.text().then(JSON.parse)},this}function l(t){var e=t.toUpperCase();return _.indexOf(e)>-1?e:t}function h(t,e){e=e||{};var r=e.body;if(t instanceof h){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new o(t.headers)),this.method=t.method,this.mode=t.mode,r||null==t._bodyInit||(r=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"omit",!e.headers&&this.headers||(this.headers=new o(e.headers)),this.method=l(e.method||this.method||"GET"),this.mode=e.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&r)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(r)}function p(t){var e=new FormData;return t.trim().split("&").forEach(function(t){if(t){var r=t.split("="),n=r.shift().replace(/\+/g," "),o=r.join("=").replace(/\+/g," ");e.append(decodeURIComponent(n),decodeURIComponent(o))}}),e}function y(t){var e=new o;return t.split(/\r?\n/).forEach(function(t){var r=t.split(":"),n=r.shift().trim();if(n){var o=r.join(":").trim();e.append(n,o)}}),e}function b(t,e){e||(e={}),this.type="default",this.status="status"in e?e.status:200,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new o(e.headers),this.url=e.url||"",this._initBody(t)}if(!t.fetch){var m={searchParams:"URLSearchParams"in t,iterable:"Symbol"in t&&"iterator"in Symbol,blob:"FileReader"in t&&"Blob"in t&&function(){try{return new Blob,!0}catch(t){return!1}}(),formData:"FormData"in t,arrayBuffer:"ArrayBuffer"in t};if(m.arrayBuffer)var v=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],w=function(t){return t&&DataView.prototype.isPrototypeOf(t)},g=ArrayBuffer.isView||function(t){return t&&v.indexOf(Object.prototype.toString.call(t))>-1};o.prototype.append=function(t,n){t=e(t),n=r(n);var o=this.map[t];this.map[t]=o?o+","+n:n},o.prototype.delete=function(t){delete this.map[e(t)]},o.prototype.get=function(t){return t=e(t),this.has(t)?this.map[t]:null},o.prototype.has=function(t){return this.map.hasOwnProperty(e(t))},o.prototype.set=function(t,n){this.map[e(t)]=r(n)},o.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},o.prototype.keys=function(){var t=[];return this.forEach(function(e,r){t.push(r)}),n(t)},o.prototype.values=function(){var t=[];return this.forEach(function(e){t.push(e)}),n(t)},o.prototype.entries=function(){var t=[];return this.forEach(function(e,r){t.push([r,e])}),n(t)},m.iterable&&(o.prototype[Symbol.iterator]=o.prototype.entries);var _=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];h.prototype.clone=function(){return new h(this,{body:this._bodyInit})},c.call(h.prototype),c.call(b.prototype),b.prototype.clone=function(){return new b(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new o(this.headers),url:this.url})},b.error=function(){var t=new b(null,{status:0,statusText:""});return t.type="error",t};var x=[301,302,303,307,308];b.redirect=function(t,e){if(-1===x.indexOf(e))throw new RangeError("Invalid status code");return new b(null,{status:e,headers:{location:t}})},t.Headers=o,t.Request=h,t.Response=b,t.fetch=function(t,e){return new Promise(function(r,n){var o=new h(t,e),i=new XMLHttpRequest;i.onload=function(){var t={status:i.status,statusText:i.statusText,headers:y(i.getAllResponseHeaders()||"")};t.url="responseURL"in i?i.responseURL:t.headers.get("X-Request-URL");var e="response"in i?i.response:i.responseText;r(new b(e,t))},i.onerror=function(){n(new TypeError("Network request failed"))},i.ontimeout=function(){n(new TypeError("Network request failed"))},i.open(o.method,o.url,!0),"include"===o.credentials&&(i.withCredentials=!0),"responseType"in i&&m.blob&&(i.responseType="blob"),o.headers.forEach(function(t,e){i.setRequestHeader(e,t)}),i.send(void 0===o._bodyInit?null:o._bodyInit)})},t.fetch.polyfill=!0}}("undefined"!=typeof self?self:this)},362:function(t,e,r){"use strict";function n(t){return i(o(a(t)))}function o(t){return u(f(s(t),8*t.length))}function i(t){for(var e,r=v?"0123456789ABCDEF":"0123456789abcdef",n="",o=0;o<t.length;o++)e=t.charCodeAt(o),n+=r.charAt(e>>>4&15)+r.charAt(15&e);return n}function a(t){for(var e,r,n="",o=-1;++o<t.length;)e=t.charCodeAt(o),r=o+1<t.length?t.charCodeAt(o+1):0,55296<=e&&e<=56319&&56320<=r&&r<=57343&&(e=65536+((1023&e)<<10)+(1023&r),o++),e<=127?n+=String.fromCharCode(e):e<=2047?n+=String.fromCharCode(192|e>>>6&31,128|63&e):e<=65535?n+=String.fromCharCode(224|e>>>12&15,128|e>>>6&63,128|63&e):e<=2097151&&(n+=String.fromCharCode(240|e>>>18&7,128|e>>>12&63,128|e>>>6&63,128|63&e));return n}function s(t){for(var e=Array(t.length>>2),r=0;r<e.length;r++)e[r]=0;for(var r=0;r<8*t.length;r+=8)e[r>>5]|=(255&t.charCodeAt(r/8))<<r%32;return e}function u(t){for(var e="",r=0;r<32*t.length;r+=8)e+=String.fromCharCode(t[r>>5]>>>r%32&255);return e}function f(t,e){t[e>>5]|=128<<e%32,t[14+(e+64>>>9<<4)]=e;for(var r=1732584193,n=-271733879,o=-1732584194,i=271733878,a=0;a<t.length;a+=16){var s=r,u=n,f=o,d=i;r=c(r,n,o,i,t[a+0],7,-680876936),i=c(i,r,n,o,t[a+1],12,-389564586),o=c(o,i,r,n,t[a+2],17,606105819),n=c(n,o,i,r,t[a+3],22,-1044525330),r=c(r,n,o,i,t[a+4],7,-176418897),i=c(i,r,n,o,t[a+5],12,1200080426),o=c(o,i,r,n,t[a+6],17,-1473231341),n=c(n,o,i,r,t[a+7],22,-45705983),r=c(r,n,o,i,t[a+8],7,1770035416),i=c(i,r,n,o,t[a+9],12,-1958414417),o=c(o,i,r,n,t[a+10],17,-42063),n=c(n,o,i,r,t[a+11],22,-1990404162),r=c(r,n,o,i,t[a+12],7,1804603682),i=c(i,r,n,o,t[a+13],12,-40341101),o=c(o,i,r,n,t[a+14],17,-1502002290),n=c(n,o,i,r,t[a+15],22,1236535329),r=l(r,n,o,i,t[a+1],5,-165796510),i=l(i,r,n,o,t[a+6],9,-1069501632),o=l(o,i,r,n,t[a+11],14,643717713),n=l(n,o,i,r,t[a+0],20,-373897302),r=l(r,n,o,i,t[a+5],5,-701558691),i=l(i,r,n,o,t[a+10],9,38016083),o=l(o,i,r,n,t[a+15],14,-660478335),n=l(n,o,i,r,t[a+4],20,-405537848),r=l(r,n,o,i,t[a+9],5,568446438),i=l(i,r,n,o,t[a+14],9,-1019803690),o=l(o,i,r,n,t[a+3],14,-187363961),n=l(n,o,i,r,t[a+8],20,1163531501),r=l(r,n,o,i,t[a+13],5,-1444681467),i=l(i,r,n,o,t[a+2],9,-51403784),o=l(o,i,r,n,t[a+7],14,1735328473),n=l(n,o,i,r,t[a+12],20,-1926607734),r=h(r,n,o,i,t[a+5],4,-378558),i=h(i,r,n,o,t[a+8],11,-2022574463),o=h(o,i,r,n,t[a+11],16,1839030562),n=h(n,o,i,r,t[a+14],23,-35309556),r=h(r,n,o,i,t[a+1],4,-1530992060),i=h(i,r,n,o,t[a+4],11,1272893353),o=h(o,i,r,n,t[a+7],16,-155497632),n=h(n,o,i,r,t[a+10],23,-1094730640),r=h(r,n,o,i,t[a+13],4,681279174),i=h(i,r,n,o,t[a+0],11,-358537222),o=h(o,i,r,n,t[a+3],16,-722521979),n=h(n,o,i,r,t[a+6],23,76029189),r=h(r,n,o,i,t[a+9],4,-640364487),i=h(i,r,n,o,t[a+12],11,-421815835),o=h(o,i,r,n,t[a+15],16,530742520),n=h(n,o,i,r,t[a+2],23,-995338651),r=p(r,n,o,i,t[a+0],6,-198630844),i=p(i,r,n,o,t[a+7],10,1126891415),o=p(o,i,r,n,t[a+14],15,-1416354905),n=p(n,o,i,r,t[a+5],21,-57434055),r=p(r,n,o,i,t[a+12],6,1700485571),i=p(i,r,n,o,t[a+3],10,-1894986606),o=p(o,i,r,n,t[a+10],15,-1051523),n=p(n,o,i,r,t[a+1],21,-2054922799),r=p(r,n,o,i,t[a+8],6,1873313359),i=p(i,r,n,o,t[a+15],10,-30611744),o=p(o,i,r,n,t[a+6],15,-1560198380),n=p(n,o,i,r,t[a+13],21,1309151649),r=p(r,n,o,i,t[a+4],6,-145523070),i=p(i,r,n,o,t[a+11],10,-1120210379),o=p(o,i,r,n,t[a+2],15,718787259),n=p(n,o,i,r,t[a+9],21,-343485551),r=y(r,s),n=y(n,u),o=y(o,f),i=y(i,d)}return Array(r,n,o,i)}function d(t,e,r,n,o,i){return y(b(y(y(e,t),y(n,i)),o),r)}function c(t,e,r,n,o,i,a){return d(e&r|~e&n,t,e,o,i,a)}function l(t,e,r,n,o,i,a){return d(e&n|r&~n,t,e,o,i,a)}function h(t,e,r,n,o,i,a){return d(e^r^n,t,e,o,i,a)}function p(t,e,r,n,o,i,a){return d(r^(e|~n),t,e,o,i,a)}function y(t,e){var r=(65535&t)+(65535&e);return(t>>16)+(e>>16)+(r>>16)<<16|65535&r}function b(t,e){return t<<e|t>>>32-e}function m(t){return n(t)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=m;var v=0;t.exports=e.default},363:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={mock:!1},t.exports=e.default},873:function(t,e,r){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function o(t){var e=(0,s.default)(t);return(0,f.default)("/pos/login.do",{method:"POST",body:e})}function i(t,e){var r=(0,s.default)(t);return(0,f.default)("/pos/login.do",{method:"POST",body:r},e)}Object.defineProperty(e,"__esModule",{value:!0});var a=r(136),s=n(a);e.login=o,e.loginData=i;var u=r(346),f=n(u)}});