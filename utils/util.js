var ServerConfig = require('ServerConfig');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * @param date1 前一个日期
 * @param date2 后一个日期
 */
function diffDate(date1,date2){
  console.info("date1:", date1, "  -------- date2:", date2);
  var date3 = date2.getTime() - date1.getTime();   //时间差的毫秒数
  //------------------------------
  //计算出相差天数
  var days = Math.floor(date3 / (24 * 3600 * 1000));
  //计算出小时数
  var leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000);
  console.log(" 相差 " + days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒");
  if(days > 0){
    return days + "天前";
  }
  if (hours > 0) {
    return hours + "小时前";
  }
  if (minutes > 0) {
    return minutes + "分钟前";
  }
  if (seconds > 0) {
    return seconds + "秒前";
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//请求网络(热门话题) 页面数据
function requestPageData(success, fail) {
  if (typeof success != 'function' || typeof fail != 'function') {
    return;
  }

  var app = getApp();
  wx.request({
    url: ServerConfig.GetLatestPageDataUrl,
    success: function (res) {
      if (res.data.result == 1) {
        success(res.data.info);
      } else {
        fail(res.data.msg);
      }
    },
    fail: function () {
      fail('网络错误');
    }

  });
}

//请求网络(热门话题) 页面数据
function requestOldestPageData(oldestDate, success, fail) {
  if (typeof success != 'function' || typeof fail != 'function') {
    return;
  }

  var app = getApp();
  wx.request({
    url: ServerConfig.GetOldestPageDataUrl,
    data: {
      //key: 'c39621ea5b825547001f9858a643f182',//app.globalData.appkey,
      oldDate: "'" + oldestDate + "'"//,
      //pagesize: 10//app.globalData.pagesize
    },
    success: function (res) {
      if (res.data.result == 1) {
        success(res.data.info);
      } else {
        fail(res.data.msg);
      }
    },
    fail: function () {
      fail('网络错误');
    }

  });
}
//
//
//
//请求网络(科技资讯) 页面数据
function requestLatestTech(success, fail) {
  if (typeof success != 'function' || typeof fail != 'function') {
    return;
  }

  var app = getApp();
  wx.request({
    url: ServerConfig.GetLatestTechUrl,
    success: function (res) {
      if (res.data.result == 1) {
        success(res.data.info);
      } else {
        fail(res.data.msg);
      }
    },
    fail: function () {
      fail('网络错误');
    }

  });
}

//请求网络(科技资讯) 页面数据
function requestOldestTech(oldestDate, success, fail) {
  if (typeof success != 'function' || typeof fail != 'function') {
    return;
  }

  var app = getApp();
  wx.request({
    url: ServerConfig.GetOldestTechUrl,
    data: {
      oldDate: "'" + oldestDate + "'"
    },
    success: function (res) {
      if (res.data.result == 1) {
        success(res.data.info);
      } else {
        fail(res.data.msg);
      }
    },
    fail: function () {
      fail('网络错误');
    }

  });
}

//请求网络 导航页面的新闻内容
function requestNavigatorContentDetail(linkId, success, fail) {
  if (typeof success != 'function' || typeof fail != 'function') {
    return
  }
  var app = getApp();
  wx.request({
    url: ServerConfig.GetNavigatorContentDetailUrl,
    data: {
      id: linkId
    },
    success: function (res) {
      if (res.data.result == 1) {
        success(res.data.info);
      }else {
        fail(res.data.msg);
      }
    },
    fail: function () {
      fail('网络错误');
    }
  });
}

module.exports = {
  formatTime: formatTime,
  diffDate: diffDate,
  requestPageData: requestPageData,
  requestOldestPageData: requestOldestPageData,
  requestLatestTech: requestLatestTech,
  requestOldestTech: requestOldestTech,
  requestNavigatorContentDetail: requestNavigatorContentDetail
}
