/**
 * 业主圈UTILS工具类
 * namespace: YZQ_UTILS
 * use: YZQ_UTILS.method
 * @author   : zwp
 * @datetime : 2015/11/04
 * @version  : 1.0.0
 */
var YZQ_UTILS = (function(window, factory) {
	//模块名称
	var _MODULE_NAME = "业主圈-工具类";
	//模块版本
	var _MODULE_VERSION = "1.0.0";

	/**
	 * [getPlatformMethod 获取设备平台]
	 * @return {[int]} [返回设备平台代号, 2: IOS, 1:Andriod,4:微信,3:PC,5:other]
	 */
	factory.getPlatformMethod = function() {
		var _userAgent = navigator.userAgent.toLowerCase();
		if ((/mobile/i.test(_userAgent)) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(_userAgent))) {
			if (/iphone/i.test(_userAgent)) {
				if (/micromessenger/i.test(_userAgent)) {
					return 4;
				} else {
					return 2;
				}
			} else if (/android/i.test(_userAgent)) {
				if (/micromessenger/i.test(_userAgent)) {
					return 4;
				} else {
					return 1;
				}
			} else {
				return 5;
			}
		} else {
			return 3
		}
	};

	/**
	 * [AJAXRequest 封装AJAX]
	 * @param {[string]}  [api:具体的接口(不带URL前缀)]
	 * @param {[string]}  [method:get||Post]
	 * @param {[object]}  [data:数据对象]
	 * @param {[function]}  [success:成功回调函数]
	 * @param {[function]}  [fail:失败回调函数}]
	 * @param {[void]}  [HTTP Request失败自调用函数,无需传参]
	 * @return {[void]} [直接执行callback]
	 */

	factory.AJAXRequest = function(api, method, data, success, fail) {
		$.ajax({
			url: CONFIG.API + api,
			dataType: "json",
			type: method || "GET",
			xhrFields: {
				withCredentials: false
			},
			data: data,
			crossDomain: true,
			success: function(result) {
				if (result.status == 200) {
					success(result);
				} else {
					if (typeof(fail) == "undefined") {
						console.log(result);
					} else {
						fail(result);
					}
				}
			},
			error: function(result) {
				console.log(result.msg);
			}
		})
	}
    
    /**
	 * [pageSwitchMethod 页面切换]
	 * @param {void}  无
	 * @return{void}  无
	 */
	factory.pageSwitchMethod = function(data){
        var pageObject = {
			baseurl:data.baseurl,
			page:data.page,
			title:data.title,
			isthide:data.isthide,
			isbhide:data.isbhide,
			isfull:data.isfull,
            iconright:data.iconright
		}
		var pageJSON = JSON.stringify(pageObject);
		try{
			HZ_APP_JSSDK.pageSwitch(pageJSON);
			return false;
		}catch(e){
			console.log(e);
		}
	}
	
	/**
     * [parseURI 解析网址中的数据]
     * 解析的数据在params对象中
     *
     */
    factory.parseURI =function(){
        var url =window.location.href;
        var a = document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
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
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
            hash: a.hash.replace('#', ''),
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/')
        };
    };
	/* 暴露 API 工厂*/
	return factory;

})(window, window.YZQ_UTILS = window.YZQ_UTILS || {});