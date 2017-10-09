var HTTP = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navi_id:0,
    updatetime:"",
    site:"",
    contentArr: [],
    loadingHide: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navi_id: options.navi_id,
      updatetime: options.updatetime,
      site:options.site
    });
    wx.setNavigationBarTitle({
      title: options.title,
    });

    HTTP.requestNavigatorContentDetail(options.navi_id,this.getContentSuccess, this.getContentFail);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  getContentSuccess: function (dataInfo) {
    let content = dataInfo.content;
    let contentArr = content.split("\n");
    this.setData({ contentArr: contentArr, site: dataInfo.site, loadingHide: true });
  },

  getContentFail: function (dataMsg) {
    console.log(dataMsg);
    wx.showModal({ title: '提示', content: dataJson, showCancel: false });
    this.setData({ loadingHide: true });
  }



})