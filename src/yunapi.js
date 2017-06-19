/**
 * Created by admin on 2017/4/20.
 */
const XuntongJSBridge = window.XuntongJSBridge

const qingApi = {
  isYzjApp () {
    return navigator.userAgent.match(/Qing\/.*;(iOS|iPhone|Android).*/) ? 1 : 0
  },
  getPersonInfo (fn) {
    var res = {}
    XuntongJSBridge.call('getPersonInfo', { }, function (result) {
      res = {
        name: result.data.name || 'alffr',
        avatar: result.data.photoUrl,
        gender: result.data.gender === '0' ? '男' : '女',
        enterpriseId: result.data.id,
        openid: result.data.openid,
        userName: result.data.userName,
        email: result.data.email,
        cloudpassport: result.data.cloudpassport
      }
      fn && fn(res)
    })
  },
  hideOptionMenu () {
    XuntongJSBridge.call('hideOptionMenu')
  },
  showOptionMenu () {
    XuntongJSBridge.call('showOptionMenu')
  },
  setTitle (value) {
    document.title = value;
    const mobile = navigator.userAgent.toLocaleLowerCase();
    const length = document.querySelectorAll('iframe').length;
    if(/iphone|ipad|ipod/.test(mobile) && !length) {
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'display: none; width: 0; height: 0';
      iframe.setAttribute('src', 'about:blank');
      iframe.addEventListener('load', () => {
        setTimeout(() => {
          iframe.removeEventListener('load', false);
          document.body.removeChild(iframe);
        }, 0);
      });
      document.body.appendChild(iframe);
    }
  }
}

export default qingApi
