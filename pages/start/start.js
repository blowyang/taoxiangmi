//login.js
//获取应用实例
var app = getApp();
function countdown(that) {
  var second = that.data.second;
  var home = that.data.home;
  if (home == 0){
    if (second == 0) {
      wx.switchTab({
        url: '../index/index'
      })
    }
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }
    , 1000)
}
Page({
  data: {
    second: 5,
    home: 0
  },

  home: function () {
    this.setData({
      home: 1
    });
    wx.switchTab({
      url: '../index/index'
    })
  },
  tapBanner: function (e) {
    if (e.currentTarget.dataset.id != 0) {
      this.setData({
        home: 1
      });
      wx.redirectTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  onLoad: function () {
    var that = this;
    countdown(that);
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/banner/list',
      data: {
        key: 'mallName',
        type: 'start'
      },
      success: function (res) {
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.data[0].linkUrl
        })
        //console.log(res.data.data[0].linkUrl)
        if (res.data.code == 0) {
          that.setData({
            sales: res.data.data
          });
        }
      }
    })

  }
});