//index.js
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 8000,
    duration: 800,
    swiperCurrent: 0,
    selectCurrent: 0,
    activeCategoryId: 0,
    loadingMoreHidden: true,
  },

  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  levelClick: function (e) {
    wx.navigateTo({
      url: "/pages/menu-list/index?id=" + e.currentTarget.dataset.id
    })
  },
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onLoad: function () {
    var that = this
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/banner/list',
      data: {
        key: 'mallName',
        type: 'goods'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            banners: res.data.data
          });
        }
      }
    }),
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/category/all',
      success: function (res) {
        var categories = [{ id: 0, name: "所有分类" }];
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].level == 1) {
              categories.push(res.data.data[i]);
            }
          }
        }//
        that.setData({
          categories: categories,
          activeCategoryId: 0
        });
        that.getGoodsList(0);
      }
    })
  },
  getGoodsList: function (categoryId) {
    if (categoryId == 0) {
      categoryId = "";
    }
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/category/all',
      success: function (res) {
        var categorieslist = [];
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (categoryId != '') {
              if (res.data.data[i].pid == categoryId) {
                categorieslist.push(res.data.data[i]);
              }
            } else {
              //categorieslist.push(res.data.data[i]);
              if (res.data.data[i].pid != 0) {
                categorieslist.push(res.data.data[i]);
              }
            }
          }
        }//
        that.setData({
          categorieslist: categorieslist,
        });
      }
    })
  }

})