var HTTP = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    jokeList: [],
    loadingHide: false,
    hideHeader:false,
    hideFooter: true,
  },

  oldestDate: null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    HTTP.requestPageData(this.getContentSuccess, this.getContentFail);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({ hideHeader: false });
    HTTP.requestPageData(this.getContentSuccess, this.getContentFail);
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
    HTTP.requestOldestPageData(oldestDate, this.getOldestContentSuccess, this.getContentFail);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getContentSuccess: function (dataArr) {
    this.reDefineData(dataArr);

    this.setData({ jokeList: dataArr, loadingHide: true, hideHeader: true, hideFooter:true });
    wx.stopPullDownRefresh();
  },

  getOldestContentSuccess:function(dataArr){
    this.reDefineData(dataArr);

    this.setData({ jokeList: this.data.jokeList.concat(dataArr), loadingHide: true, hideHeader: true, hideFooter: true });
    wx.stopPullDownRefresh();
  },

  getContentFail: function (dataJson) {
    console.log(dataJson);
    wx.showModal({title: '提示', content: dataJson, showCancel:false});

    this.setData({ hideHeader: true, hideFooter: true });
  },

  clickTapItem: function (e) {
    let index = e.currentTarget.dataset.index;
    let itemObj = e.currentTarget.dataset.item;
    for (let i = 0; i < this.data.jokeList.length; ++i) {
      let data = this.data.jokeList[i];
      if(index == i) {
        if (data.click_box) {
          this.clickSelectItem(data,false);
        } else {
          this.clickSelectItem(data, true);
        }
      }else {
        this.clickSelectItem(data, false);
      }
    }
    this.setData({ jokeList: this.data.jokeList});


    /* wx.navigateTo({
      url: '../detail/detail?url=' + 'https://baidu.com',
    }); */
  },

  clickSelectItem: function (data,isSlect) {
    if (isSlect){
      data.click_box = "click_box";
      data.click_title = "click_title";
      data.click_content = "click_content";
      data.click_links = "click_links";
    }else {
      data.click_box = "";
      data.click_title = "";
      data.click_content = "";
      data.click_links = "";
    }
  },

  clickToNavigator:function(e){
    let urlParams = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/pages/navigate/navigate?' + urlParams,
    })
  },

  reDefineData:function(dataArr) {
    for (let i = 0; i < dataArr.length; ++i) {
      let dataObj = dataArr[i];
      let linksArr = JSON.parse(dataObj.links);
      dataObj['linksArr'] = linksArr;
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

  }

})