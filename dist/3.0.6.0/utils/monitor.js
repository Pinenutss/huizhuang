/**
 *  埋点上报SDK,
 *  使用方法:
 *
 *  <!DOCTYPE html> 之前加:
 *  <script>
 *	var startTime = new Date().valueOf()
 *  </script>
 *   页面最后加
 *   </html>
 *   <script>
 *	var endTime = new Date().valueOf()
 *   </script>
 *  <script src="your address/monitor.js?appid=100200&pageid=55&apptype=100000"></script>
 *
 *  页面埋点使用data-pointid="xxx"
 *  如:
 *  <a href="#" data-pointid="0006">我是测试埋点6</a>
 *	<input type="button" name="" id="" value="我是测试埋点7"  data-pointid="0007"/>
 *	<button data-pointid="0008">asdasd </button>
 *
 *
 *  开发环境请将  isProduction 设置为false
 *  正式环境 isProduction 为true
 *
 */
;
(function(root) {
	//定义全局变量;	
	var isProduction = false;
	var PRODUCTION_URL = "http://report2.huizhuang.com/pushPoint.do?";
	var DEVELOP_ENV_URL = "http://report.rls.huizhuang.com/pushPoint.do?";
	var appid = 0; //应用版本号
	var pageid = 0; //页面ID
	var apptype = 0; //应用平台
	var platform = 0; //当前设备平台
	var channel = "-"; //渠道号
	var flagid = 0; //页面埋点ID
	var userid = "HZ_USER" + new Date().valueOf(); //用户id
	var machineid = "HZ_MACHINE_USER" + new Date().valueOf(); //设备id
	var sessionid = "HZ_SESSION_USER" + new Date().valueOf(); //token
	var skey = "0a2225b7222f4aec4f9913dcf29d8f41"; //鉴权key
	var ip = "-"; //用户id
	var gpsx = "-"; //lat ,坐标
	var gpsy = "-"; //lng ,坐标
	var network = 0; //网络类型
	var key = null;
	/* 需要特别注明的参数 */
	var other = {
		name: "HZ_YZQ"
	}; 
	


	/**
	 * 合并Object
	 * @param {Object} obj1
	 * @param {Object} obj2
	 */
	var _mergeObject = function(obj1, obj2) {
		var obj3 = {};
		for (var attrname in obj1) {
			obj3[attrname] = obj1[attrname];
		}
		for (var attrname in obj2) {
			obj3[attrname] = obj2[attrname];
		}
		return obj3;
	}

	/**
	 * 定义切面Before方法，函数执行前执行
	 * @param {func} func
	 */
	Function.prototype.before = function(func) {
			var _self = this;
			return function() {
				if (func.apply(this, arguments) === false) {
					return false;
				} else {
					return _self.apply(this, arguments);
				}
			}
		}
		/**
		 * 定义切面After方法，函数执行之后执行
		 * @param {func} func
		 */
	Function.prototype.after = function(func) {
		var _self = this;
		return function() {
			var ret = _self.apply(this, arguments);
			if (ret === false) {
				return false;
			} else {
				func.apply(this, arguments);
				return ret;
			}
		}
	}

	/**
	 * 获取上报环境
	 * @param {Object} bStatus
	 */
	var _getEnvirURL = function(bStatus) {
			if (bStatus) {
				return PRODUCTION_URL;
			} else {
				return DEVELOP_ENV_URL;
			}
		}
		/**
		 * 获取埋点URL中的参数
		 * @return {Object} params
		 */
	var _getMonitorURL = function() {
		var monitorURL = null;
		var mScripts = document.getElementsByTagName("script");
		for (var i = 0; i < mScripts.length; i++) {
			if (/monitor.js/i.test(mScripts[i].src)) {
				monitorURL = mScripts[i].src;
			}
		}
		key = _mergeObject(other, _getURIParams(window.location.href).params);
		return _getURIParams(monitorURL).params;
	}

	/**
	 * 注册页面事件监听
	 */
	var _registerListener = function() {
		if (document.addEventListener) {
			document.addEventListener("click", function(event) {
				var eventDom = event.target;
				var dataMaps = eventDom.dataset;
				try {
					flagid = dataMaps.pointid;
				} catch (e) {
					flagid = 0;
				}
				if(flagid !== undefined){
					_cvReportHandler(flagid)
				}				
			})
		} else {
			document.attachEvent("onclick", function(event) {
				var eventDom = event.target;
				var dataMaps = eventDom.dataset;
				try {
					flagid = dataMaps.pointid;
				} catch (e) {
					flagid = 0;
				}
				if(flagid !== undefined){
					_cvReportHandler(flagid)
				}		
			})
		}
	}

	var _getLocation = function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				gpsx = position.coords.latitude;
				gpsy = position.coords.longitude;
				_pvReportHandler();
			}, function(error) {
				gpsx = "-";
				gpsy = "-";
				_pvReportHandler();
			})
		} else {
			gpsx = "-";
			gpsy = "-";
			_pvReportHandler();
		}
	}


	/**
	 * 获取URL中的参数
	 * @param {String} url
	 */
	var _getURIParams = function(url) {
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

	var _getPlatform = function() {
		var _userAgent = navigator.userAgent.toLowerCase();
		if ((/mobile/i.test(_userAgent)) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(_userAgent))) {
			if (/iphone/i.test(_userAgent)) {
				if (/micromessenger/i.test(_userAgent)) {
					return 3;
				} else {
					return 1;
				}
			} else if (/android/i.test(_userAgent)) {
				if (/micromessenger/i.test(_userAgent)) {
					return 3;
				} else {
					return 2;
				}
			} else {
				return 5;
			}
		} else {
			return 4
		}
	};

	var _pvReportHandler = function() {
		var pvObject = {
			starttime: startTime,
			endtime: endTime
		}
		_reportHandler(pvObject, 0);
	}
	var _cvReportHandler = function(el) {
		var cvTime = new Date().valueOf();
		var cvObject = {
			flagid: el,
			time: cvTime
		}
		_reportHandler(cvObject, 1);
	}

	/**
	 *
	 * @param {Object} data
	 * @param {int} type 类型 0: pv 1:cv
	 */
	var _reportHandler = function(data, type) {
		var dataObject = {
			appid: _getMonitorURL().appid,
			channel: channel,
			apptype: _getMonitorURL().apptype,
			platform: _getPlatform(),
			pageid: _getMonitorURL().pageid,
			userid: userid,
			machineid: machineid,
			sessionid: sessionid,
			skey: skey,
			ip: ip,
			gpsx: gpsx,
			gpsy: gpsy,
			network: network,
			other: JSON.stringify(key)
		}
		if (type === 0) {
			dataObject.flagid = 0;
			dataObject.event = 6;
			dataObject.starttime = data.starttime;
			dataObject.endtime = data.endtime;
		} else {
			dataObject.flagid = data.flagid;
			dataObject.event = 3;
			dataObject.starttime = data.time;
			dataObject.endtime = data.time;
		}


		var dataArray = [];
		dataArray.push(dataObject);
		console.log(dataArray);
		var dataStr = encodeURI(JSON.stringify(dataArray));
		var iUrl = _getEnvirURL(isProduction) + "data=" + dataStr;
		var img = new Image();
		img.src = iUrl;
	}

	/* 页面装载完成，初始化相关业务，并且注册 监听 点击事件 */
	root.onload = (root.onload || function() {}).after(function() {
		//_getLocation();
		_pvReportHandler();
		_registerListener();
	})

})(window);