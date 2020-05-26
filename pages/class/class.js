var month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var weeks = [7, 1, 2, 3, 4, 5, 6];
var date = new Date();
var currentYear = date.getFullYear();
var currentMonth = date.getMonth() + 1;
var currentDay = date.getDate();
var currentWeek = weeks[date.getUTCDay()];
var week = [];
for (var i = 0; i < currentWeek; i++) {
    week[i] = currentDay - currentWeek + i + 1;
    if (week[i] <= 0)
        week[i] = week[i] + month[(currentMonth - 2 >= 0) ? (currentMonth - 2) : (12 + (currentMonth - 2))];
}
for (var i = currentWeek, j = 1; i < 7; i++, j++) {
    week[i] = currentDay + j;
    if (week[i] > month[currentMonth - 1])
        week[i] = week[i] - month[currentMonth - 1];
}

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        stateH: null,
        islogin: false,
        year: currentYear,
        month: currentMonth,
        day: currentDay,
        schoolWeek: null,
        weekIndex: 0,
        classArray: ["1\\2", "3\\4", "5\\6", "7\\8", "9\\10"],
        dayArray: [{
            index: 1,
            day: week[0]
        }, {
            index: 2,
            day: week[1]
        }, {
            index: 3,
            day: week[2]
        }, {
            index: 4,
            day: week[3]
        }, {
            index: 5,
            day: week[4]
        }, {
            index: 6,
            day: week[5]
        }, {
            index: 7,
            day: week[6]
        }],
        listData: null,
        allData: null,
        cout: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;

        console.log(options);
        if (options.islogin == "true")
            this.setData({
                islogin: true
            })
        wx.getStorage({
            key: 'islogin',
            success: function (res) {
                if (res.data == true)
                    that.setData({
                        islogin: true
                    })
            }
        })
        var weeklist = Array();
        for (var i = 0; i <= 25; ++i)
            weeklist.push(i.toString());
        this.setData({
            schoolWeek: weeklist
        })
        wx.getStorage({
            key: 'noweek',
            success: function (res) {
                console.log(res);
                that.setData({
                    weekIndex:res.data
                })
                that.getData(res.data);
            },
            fail:function(){
                that.getData('0');
            }
        })
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    getData: function (week) {
        var that = this;
        wx.getStorage({
            key: 'week' + week,
            success: function (res) {
                wx.hideLoading();
                var jsons = JSON.parse(res.data);
                console.log(jsons);
                var listData = that.dealData(jsons);
                that.setData({
                    listData: listData,
                    allData: jsons
                })
            }
        })

    },
    pickerChange: function (e) {
        console.log(e.detail.value);
        this.setData({
            weekIndex: e.detail.value,
        })
        wx.showLoading({
            title: '加载中',
        })
        this.getData(e.detail.value);
        wx.setStorage({
            data: e.detail.value,
            key: 'noweek',
        })
    },
    dealData: function (data) {
        var newData = Array();
        var temp = 0;
        var a = 1;
        var b = 1;
        for (var i = 0; i <= 4; ++i) {
            var nowData = Array();
            for (var j = 0; j <= 6; ++j) {
                var str = a.toString() + '-' + b.toString() + '-1';
                nowData.push(data[temp++][0][str]);
                b++;
            }
            a++;
            b = 1;
            newData.push(nowData);
        }
        console.log(newData)
        return newData
    },
    showDetail: function (e) {
        var nowuse = Number(e.currentTarget.id);
        var data = this.data.allData;
        var str = (Math.floor(nowuse / 7) + 1).toString() + '-' + (nowuse % 7 + 1).toString();
        console.log(str)
        wx.showModal({
            title: '详细信息',
            content: '课程名：' + data[nowuse][0][str + '-1'] + "\r\n" + "详细信息：" + data[nowuse][1][str + '-2'] + "\r\n" + "其他：" + (data[nowuse][1][str + '-3'] == undefined ? "" : data[nowuse][1][str + '-3']),
            showCancel: false
        })
    },
    login: function () {
        wx.redirectTo({
            url: '../login/login',
        })
    }
})