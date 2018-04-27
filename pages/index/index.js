//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    flag: true,
    indicatorDots: true,
    autoplay: true,
    interval: 8000,
    duration: 800,
    loadingHidden: false , // loading
    userInfo: {},
    swiperCurrent: 0,  
    selectCurrent:0,
    categories: [],
    activeCategoryId: 0,
    goods:[],
    scrollTop:"0",
    loadingMoreHidden:true,

    hasNoCoupons:true,
    coupons: [],
    searchInput: '',
  },

  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  //事件处理函数
  swiperchange: function(e) {
      //console.log(e.detail.current)
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  toDetailsTap:function(e){
    wx.navigateTo({
      url:"/pages/goods-details/index?id="+e.currentTarget.dataset.id
    })
  },
  toTopic: function (e) {
    wx.navigateTo({
      url: "/pages/topic/index?id=" + e.currentTarget.dataset.id
    })
  },
  tapBanner: function(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  getkanjialist: function(){
    wx.navigateTo({
      url: "/pages/kanjia-list/index"
    })
  },
  kanjiaTap: function (e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/kanjia-goods/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  tapSales: function (e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: e.currentTarget.dataset.id
      })
    }
  },
  bindTypeTap: function(e) {
     this.setData({  
        selectCurrent: e.index  
    })  
  },
  scroll: function (e) {
    //  console.log(e) ;
    var that = this,scrollTop=that.data.scrollTop;
    that.setData({
      scrollTop:e.detail.scrollTop
    })
    // console.log('e.detail.scrollTop:'+e.detail.scrollTop) ;
    // console.log('scrollTop:'+scrollTop)
  },
  //弹窗优惠券关闭按钮
  hide: function () {
    this.setData({ flag: true })
  },
  //用户自主领取优惠券
  newCoupon: function (e) {
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/fetch',
      data: {
        id: e.currentTarget.dataset.id,//优惠券id
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '成功领取',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  onLoad: function () {
    var that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    /*
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    */
    //首页幻灯片
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/banner/list',
      data: {
        key: 'mallName',
        type: 'home'
      },
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            banners: res.data.data
          });
        }
      }
    })
    //3个展示位
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/banner/list',
      data: {
        key: 'mallName',
        type: 'sale'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            sales: res.data.data
          });
        }
      }
    })
    //砍价专题
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/banner/list',
      data: {
        key: 'mallName',
        type: 'kanjia'
      },
      success: function (res) {
        if (res.data.code == 0) {
          var kb = res.data.data[0].linkUrl;
          var kbarr = kb.split(',');
          that.setData({
            kanjia: res.data.data
          });
          var kjgoods = [];
          for (var i = 0; i < kbarr.length; i++) {
            wx.request({
              url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/detail',
              data: {
                id: kbarr[i]
              },
              success: function (res) {
                if (res.data.code == 0) {
                  kjgoods.push(res.data.data.basicInfo);
                }
                that.setData({
                  kjgoods: kjgoods
                });
              }
            })
          }
        }
      }
    })
    //好物推荐专题
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/banner/list',
      data: {
        key: 'mallName',
        type: 'special'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            specials: res.data.data
          });
          wx.request({
            url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/list',
            data: {
              recommendStatus: 1,
              pageSize: 10
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
        }
      }
    })
    //分类推荐专题
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/banner/list',
      data: {
        key: 'mallName',
        type: 'category'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            businessId: [],
            categorys: res.data.data
          });
          var businessId = [];
          var cg={};
          for (var i = 0; i < res.data.data.length; i++) {
            //console.log(res.data.data[i].businessId);
            that.getcgoods(res.data.data[i].businessId,cg)
          }
        }
      }
    })
    //新用户领取优惠券弹窗
    setTimeout(function () {
      wx.request({
        url: 'https://api.it120.cc/' + app.globalData.subDomain + '/banner/list',
        data: {
          key: 'mallName',
          type: 'newcoupons'
        },
        success: function (res) {
          if (res.data.code == 0) {
            //console.log(res.data.data[0].businessId);
            wx.request({//识别用户是否可以领取优惠券
              url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/fetch',
              data: {
                id: res.data.data[0].businessId,//优惠券id
                token: app.globalData.token,
                detect: true
              },
              success: function (res) {
                if (res.data.code == 0) {
                  that.setData({ flag: false })
                }
              }
            });
            that.setData({
              newcoupons: res.data.data
            });
          }
        }
      })
    }, 2000
    )
    
    wx.request({
      url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/shop/goods/category/all',
      success: function(res) {
        var categories = [{id:0, name:"全部"}];
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            categories.push(res.data.data[i]);
          }
        }
        that.setData({
          categories:categories,
          activeCategoryId:0
        });
        //that.getGoodsList(0);
      }
    })
    that.getCoupons ();
    that.getNotice ();
  },
  getCoupons: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/coupons',
      data: {
        type: ''
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            hasNoCoupons: false,
            coupons: res.data.data
          });
        }
      }
    })
  },
  gitCoupon : function (e) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/fetch',
      data: {
        id: e.currentTarget.dataset.id,
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 20001 || res.data.code == 20002) {
          wx.showModal({
            title: '错误',
            content: '来晚了',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20003) {
          wx.showModal({
            title: '错误',
            content: '你领过了，别贪心哦~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 30001) {
          wx.showModal({
            title: '错误',
            content: '您的积分不足',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20004) {
          wx.showModal({
            title: '错误',
            content: '已过期~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 0) {
          wx.showToast({
            title: '领取成功，赶紧去下单吧~',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('mallName') + '——' + app.globalData.shareProfile,
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  getNotice: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/notice/list',
      data: { pageSize :5},
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            noticeList: res.data.data
          });
        }
      }
    })
  },
  listenerSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })

  },
  toSearch : function (){
    this.getGoodsList(this.data.activeCategoryId);
  },
  getcgoods:function(e,cg){
    var that=this
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/list',
      data: {
        categoryId:e,
        pageSize: 10
      },
      success: function (res) {
        //console.log(res.data.data);
        that.setData({
          ccgoods: [],
          loadingMoreHidden: true
        });
        var cgoods = [];
        
        if (res.data.code != 0 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden: false,
          });
          cg[e] = cgoods;
          //console.log(cg)
          that.setData({
            ccgoods: cg,
          });
          return;
        }

        for (var i = 0; i < res.data.data.length; i++) {
          cgoods.push(res.data.data[i]);
        }
        cg[e]=cgoods
        //console.log(cg)
        that.setData({
          ccgoods: cg,
        });
      }
    })
  }
})
