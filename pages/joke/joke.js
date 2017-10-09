var HTTP = require( '../../utils/util' );

Page({

  /**
   * 页面的初始数据
   */
  data: {
    jokeList:[],
    loadingHide: false,
    hideHeader: false,
    hideFooter: true,
  },

  oldestDate: null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    HTTP.requestLatestTech(this.getContentSuccess, this.getContentFail);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({ hideHeader: false });
    HTTP.requestLatestTech(this.getContentSuccess, this.getContentFail);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({ hideFooter: false });
    if (!this.oldest) {
      this.oldest = new Date();
    }
    var oldestDate = HTTP.formatTime(this.oldest);
    HTTP.requestOldestTech(oldestDate, this.getOldestContentSuccess, this.getContentFail);
  },

  getContentSuccess: function (dataArr) {
    this.reDefineData(dataArr);

    this.setData({ jokeList: dataArr, loadingHide: true, hideHeader: true, hideFooter: true });
    wx.stopPullDownRefresh();
  },

  getOldestContentSuccess: function (dataArr) {
    this.reDefineData(dataArr);

    this.setData({ jokeList: this.data.jokeList.concat(dataArr), loadingHide: true, hideHeader: true, hideFooter: true });
    wx.stopPullDownRefresh();
  },

  getContentFail: function (dataJson) {
    console.log(dataJson);
    wx.showModal({ title: '提示', content: dataJson, showCancel: false });
    this.setData({ hideHeader: true, hideFooter: true });
  },

  reDefineData: function (dataArr) {
    for (let i = 0; i < dataArr.length; ++i) {
      let dataObj = dataArr[i];
      //记录拉下来的数据中最小的日期
      dataObj.updatetime = dataObj.updatetime.replace(/-/g, "\/");
      let dataDate = new Date(dataObj.updatetime);
      let diffDateStr = HTTP.diffDate(dataDate, new Date());
      dataObj["diffDate"] = diffDateStr;
      if (!this.oldestDate) {
        this.oldestDate = dataDate;
      }
      if (dataDate < this.oldestDate) {
        this.oldest = dataDate;
      }
    }
  },

  tapItemClick:function(e){
    let index = e.currentTarget.dataset.index;
    let itemObj = e.currentTarget.dataset.item;
     wx.navigateTo({
       url: '/pages/navigate/navigate?navi_id=' + itemObj.navi_id + '&title=' + itemObj.title + '&updatetime=' + itemObj.updatetime + '&site=' + itemObj.site,
    }); 
  }

})