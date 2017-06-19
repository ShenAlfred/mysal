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
    XuntongJSBridge.call('setWebViewTitle', {
      title: value
    })
  }
}

export default qingApi
