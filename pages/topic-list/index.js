var app = getApp()
Page({
  data: {
    
  },
  tapContents: function (e) {
    wx.navigateTo({
      url: "/pages/topic/index?id=" + e.currentTarget.dataset.id
    })
  },
  onLoad: function () {
    var that = this
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/cms/category/list',
      data: {
      },
      success: function (res) {
        //console.log(res.data.data[0].id)
        var topic=[]
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            topic.push(res.data.data[i]);
          }
          that.setData({
            topics: topic,
            activecmsid: res.data.data[0].id
          });
         
        }
        that.gettapList(res.data.data[0].id)
      }
    })
    
  },
  tapTopic:function(e){
    this.setData({
      activecmsid: e.currentTarget.dataset.id
    });
    this.gettapList(this.data.activecmsid);
  },
  gettapList: function (cmsid) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/cms/news/list',
      success: function (res) {
        var content = [];
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].categoryId == cmsid) {
              content.push(res.data.data[i]);
            }
          }
        }
        that.setData({
          contents: content
        });
      }
    })
  }

})