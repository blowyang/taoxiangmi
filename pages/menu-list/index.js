//index.js
//获取应用实例
var app = getApp()
Page({
  data: {

  },

  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  onLoad: function (e) {
    var that = this;
    
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/list',
      data: {
        categoryId: e.id
      },
      success: function (res) {
        that.setData({
          goods: [],
          loadingMoreHidden: true
        });
        var goods = [];
        if (res.data.code != 0 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden: false,
          });
          return;
        }
        for (var i = 0; i < res.data.data.length; i++) {
          goods.push(res.data.data[i]);
        }
        that.setData({
          goods: goods,
        });
      }
    })
  },
  //模拟tabar
  home: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  list: function () {
    wx.reLaunch({
      url: '/pages/menu/index'
    })
  },
  cart: function () {
    wx.reLaunch({
      url: '/pages/shop-cart/index'
    })
  },
  my: function () {
    wx.reLaunch({
      url: '/pages/my/index'
    })
  }

})
