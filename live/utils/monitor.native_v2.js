/**
 * 业主圈MONITOR类
 * namespace: YZQ_MONITOR
 * use: YZQ_MONITOR.method
 * @author   : zwp
 * @datetime : 2015/12/15
 * @version  : 1.0.0
 */
var YZQ_MONITOR = (function(window, factory) {

	//模块名称
	var _MODULE_NAME = "业主圈-MONITOR类";
	//模块版本
	var _MODULE_VERSION = "1.0.0";
	var REPORT = 0; //0:测试,1:live,2:正式 默认:测试
	var _APPJSAPI = null;
	var _UserInfo = null;
	var pageid = 0;
    var cvappid = 0;
    var apptype = 0;
    var performance = {};
    var channel = 0;
    var REPORT_PATH = function(_REPORT){
        var path = "";
        switch(_REPORT){
            case 0:
                path = "http://report.rls.huizhuang.com";
                break;
            case 1:
                path = "http://report.live.huizhuang.com";
                break;
            case 2:
                path = "http://report.huizhuang.com";
                break;
        }
        REPORT = path;
        return REPORT;
    };
    REPORT_PATH(REPORT);

    //判断设备
    var machinetype = YZQ_UTILS.getPlatformMethod();

	var getCounterFromClient = function(api) {
		if (api != null) {

            _UserInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());
            var appid = _UserInfo.appid;
            var machineid = _UserInfo.machineid;
            if (_UserInfo.channel != null || _UserInfo.channel!= ""){
                channel = _UserInfo.channel;
            }
            //machinetype == 1 为安卓的操作
            if(machinetype == 1){
                var _serial ="";
                if(sessionStorage.getItem("num") == null){
                    try{
                         _serial = HZ_APP_JSSDK.getCounterFromClient();
                        var client = JSON.parse(_serial).counter;
                    }catch (err){
                        console.log("错误是"+err);
                    }

                    $.ajax({
                        url: REPORT + "/getseq.do",
                        dataType: "json",
                        type: "GET",
                        xhrFields: {
                            withCredentials: false
                        },
                        data: {
                            appid: appid,
                            machineid: machineid
                        },
                        crossDomain: true,
                        success: function(result) {
                            console.log(result);
                            if (result.status == 200) {
                                var seq = result.data.seq;
                                try{
                                    sessionStorage.setItem("seq", seq);
                                    sessionStorage.setItem("num", parseInt(client) + 1);
                                    setPVReport();
                                }catch (err){
                                    console(err);
                                }

                            }
                        },
                        error: function(result) {
                            console.log(result);
                        }
                    })
                }else{
                    setPVReport();
                }
            }else{
                if(localStorage.getItem("num") == null){
                    try{
                         _serial = HZ_APP_JSSDK.getCounterFromClient();
                    }catch (err){
                        console.log("错误是"+err);
                    }

                    $.ajax({
                        url: REPORT + "/getseq.do",
                        dataType: "json",
                        type: "GET",
                        xhrFields: {
                            withCredentials: false
                        },
                        data: {
                            appid: appid,
                            machineid: machineid
                        },
                        crossDomain: true,
                        success: function(result) {
                            console.log(result);
                            if (result.status == 200) {
                                var seq = result.data.seq;
//                                sessionStorage.setItem("seq", seq);
//                                sessionStorage.setItem("num", parseInt(_serial) + 1);
                                localStorage.setItem("seq", seq);
                                localStorage.setItem("num", parseInt(_serial) + 1);
                                setPVReport();
                            }
                        },
                        error: function(result) {
                            console.log(result);
                        }
                    })
                }else{
                    _serial = HZ_APP_JSSDK.getCounterFromClient();
                    setPVReport();
                }
            }



		}
	}

	var setPVReport = function() {
        try{
            var pageLoad = (_endtime-_starttime);
            var render = {
                pvtime: pageLoad
            }
            var getseqid = "";
            if(machinetype == 1){
                getseqid =sessionStorage.getItem("seq") + "_" + sessionStorage.getItem("num");
                if (sessionStorage.getItem("atricle_pageid") !=null){
                    pageid = sessionStorage.getItem("atricle_pageid");
                }
            }else{
                getseqid =localStorage.getItem("seq") + "_" + localStorage.getItem("num");
                if (localStorage.getItem("atricle_pageid") !=null){
                    pageid = localStorage.getItem("atricle_pageid");
                }
            }
            var pvData = {
                createtime: new Date().valueOf(),
                type: 1,
                platform: _UserInfo.platform,
                channel: _UserInfo.channel,
                appid: _UserInfo.appid,
                siteid: _UserInfo.site_id,
                objectid: pageid,
                userid: _UserInfo.userid,
                machineid:_UserInfo.machineid,//"rfgdfgfdggdrf", //
                network: _UserInfo.network,
                gpsx: _UserInfo.lat,
                gpsy: _UserInfo.lng,
                seqid: getseqid,
                other: JSON.stringify(render)
            }
            //machinetype == 1 为安卓的操作
            var addnum= "";
            if(machinetype == 1){
                addnum = parseInt(sessionStorage.getItem("num"));
                sessionStorage.removeItem("num");
                sessionStorage.setItem("num", addnum + 1);
//                localStorage.removeItem("num");
//                localStorage.setItem("num", addnum + 1);
            }else{
                addnum = parseInt(localStorage.getItem("num"));
                localStorage.removeItem("num");
                localStorage.setItem("num", addnum + 1);
//                sessionStorage.removeItem("num");
//                sessionStorage.setItem("num", addnum + 1);
            }




            reportHandler(pvData);
        }catch (err){
            console.log(err);
        }
	};

	var reportHandler = function(data) {
		var reportArray = [];
		reportArray.push(data);
		$.ajax({
			url: REPORT + "/pvcv.do",
			dataType: "json",
			type: "POST",
                xhrFields: {
				withCredentials: false
			},
			data: {
				data: JSON.stringify(reportArray)
			},
			crossDomain: true,
			success: function(result) {
				console.log(result);
			},
			error: function(result) {
				console.log(result);
			}
		})
	}

    /*
    * 点击上报
    *
    */
//    $(document).on("click", function(event) {
//        var targetDom = $(event.target);
//        if (targetDom.data().pointid !== null) {
//            var flagid = targetDom.data().pointid;
//            setCVReport(flagid);
//        }
//    });

    factory.pointClick = function(flagid){
        try{
            setCVReport(flagid);
        }catch (err){
            console.log(err);
        }

    };
    /*
    *  业主圈返回键调用
    *
    */
    factory.BackPointClick =function (pointid){
        setCVReport(pointid);
    };


    var setCVReport =function(flagid){
        try{
            var userinformation = JSON.parse(HZ_APP_JSSDK.getUserInfo());
            var getseqid = "";
            if(machinetype == 1){
                getseqid =sessionStorage.getItem("seq") + "_" + sessionStorage.getItem("num");
            }else{
                getseqid =localStorage.getItem("seq") + "_" + localStorage.getItem("num");
            }
            var data = {
                createtime: new Date().valueOf(),
                type: 2,
                channel: channel,
                appid: userinformation.appid,
                userid: userinformation.userid,
                machineid:userinformation.machineid,//"rfgdfgfdggdrf",//
                objectid: flagid,  //埋点ID
                platform: userinformation.platform, //平台信息
                gpsx: userinformation.lat,
                gpsy: userinformation.lng,
                network: userinformation.network,
                siteid:userinformation.site_id,
                seqid: getseqid
            };
            var addnum = "";
            if(machinetype == 1){
                addnum = parseInt(sessionStorage.getItem("num"));
                sessionStorage.removeItem("num");
                sessionStorage.setItem("num", addnum + 1);
//                localStorage.removeItem("num");
//                localStorage.setItem("num", addnum + 1);
            }else{
                addnum = parseInt(localStorage.getItem("num"));
                localStorage.removeItem("num");
                localStorage.setItem("num", addnum + 1);
//                sessionStorage.removeItem("num");
//                sessionStorage.setItem("num", addnum + 1);
            }
        }catch (err){
            console.log(err);
        }
        reportHandler(data);
    };


	factory.initMonitor = function(start,end) {
        _starttime= start;
        _endtime =end;
		if (window.HZ_APP_JSSDK !== null) {
			_APPJSAPI = "HZ_APP_JSSDK";
			getCounterFromClient(_APPJSAPI);
		} else {
			_APPJSAPI = null;
		}
	};
    var _starttime="";
    var _endtime="";


	/**
	 * 获取基本属性,页面ID,apptype
	 */
	(function() {
		var monitorURL = null;
		var mScripts = document.getElementsByTagName("script");
		for (var i = 0; i < mScripts.length; i++) {
			monitorURL = mScripts[i].src;
			if (monitorURL) {
				var mths = monitorURL.match(/\/monitor.native.js.*[?&]pageid=(\d+)/);
				if (mths && mths[1]) {
                    var parseURI =function(mths){
                        var a = document.createElement('a');
                        a.href = mths;
                        return {
                            params: (function() {
                                var ret = {},
                                    seg = a.search.replace(/^\?/, '').split('&'),
                                    len = seg.length,
                                    i = 0,
                                    s;
                                for (; i < len; i++) {
                                    if (!seg[i]) {
                                        continue;
                                    }
                                    s = seg[i].split('=');
                                    ret[s[0]] = s[1];
                                }
                                return ret;
                            })()
                        };
                    };
                    var getbaseinfo = parseURI(mths.input).params;
                    pageid = getbaseinfo.pageid;
					break;
				}
			}
		}
        if (window.performance) {
            performance = window.performance;
        }
	})();
	/* 暴露 API 工厂*/
	return factory;

})(window, window.YZQ_UTILS = window.YZQ_UTILS || {});