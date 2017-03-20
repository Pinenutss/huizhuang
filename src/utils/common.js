/**
 * 业主圈COMMON方法
 * namespace: YZQ_COMMON
 * use: YZQ_COMMON.method
 * @author   : zwp
 * @datetime : 2015/11/21
 * @version  : 1.0.0
 */
var YZQ_COMMON = (function(window, factory) {
	//模块名称
	var _MODULE_NAME = "业主圈-公用函数";
	//模块版本
	var _MODULE_VERSION = "1.0.0";

	/**
	 * [modifyImgSource 判断图片来源,返回对应的URL]
	 * url如果为空,if判断中设定默认图片
	 * @return {[string]} [加时间戳的图片URL]
	 */
	factory.modifyImgSource = function(url) {
		var _that = null;
		if(url == null || url == ""){
			var url = "http://hzserver-10006163.image.myqcloud.com/9d4ccbe5-b16f-44ae-96f8-44539de2bb34";
			_that = url + "?max_age=19830212&d=20151230193947";
		}else if(url.indexOf("hzyzq") >= 0) {
			_that = url + "/wlist?max_age=19830212&d=20151230193947";
		}else{
			_that = url + "?max_age=19830212&d=20151230193947";
		}
		return _that;
	};

    /**
	*	author  zwp   
	*	datetime :2015/12/08
	**/

    /**
     * [ScrollLoadData 滑动到底部加载数据]
     *
     *  参数ScrollLoadData 为滑动到底部执行的方法
     */
    factory.ScrollLoadData =function(ScrollLoadData){
        //滚动条在Y轴上的滚动距离
        var  getScrollTop= function () {
            var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
            if (document.body) {
                bodyScrollTop = document.body.scrollTop;
            }
            if (document.documentElement) {
                documentScrollTop = document.documentElement.scrollTop;
            }
            scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
            return scrollTop;
        };
        //浏览器视口的高度
        var getWindowHeight = function () {
            var windowHeight = 0;
            if (document.compatMode == "CSS1Compat") {
                windowHeight = document.documentElement.clientHeight;
            } else {
                windowHeight = document.body.clientHeight;
            }
            return windowHeight;
        };
        //获取总高度
        var getScrollHeight=function () {
            var scrollHeight = document.body.scrollHeight;
            return scrollHeight;
        };
       return  window.onscroll = function () {
           var a = (getScrollTop() + getWindowHeight() );
           var b = (getScrollHeight());
           if (a == b) {
               ScrollLoadData();
           }
       };
    };
    /**
     * [AJAXRequest 滑动到底部加载数据]
     * timsta:时间戳
     * type：需要输出的类型
     *
     */
    factory.formateTime =function(timsta, type){
            var date = new Date(timsta * 1000); //获取一个时间对象  注意：如果是uinx时间戳记得乘于1000。比如php函数time()获得的时间戳就要乘于1000
            Y = date.getFullYear() + '-';
            M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
//            D = date.getDate() + ' ';
//            h = date.getHours() + ':';
//            m = date.getMinutes() + ':';
//            s = date.getSeconds();
            D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())+ ':';
            s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        
            var newTime = "";
            switch (type) {
                case "YYYY-MM-DD":
                    newTime = Y + M + D;
                    break;
                case "YYYY-MM-DD h:m:s":
                    newTime = Y + M + D + h + m + s;
                    break;
            }
            return newTime;
    };
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

    /**
     * [YZQ_Tips 业主圈弹出提示]
     * 
     *
     */
    factory.tips = function(_tipMsg){
        if($('.ui-poptips').length >= 1){
            $('.ui-poptips-cnt').text(_tipMsg);
            return;
        }
        var tipStr = '';
        tipStr += '<div class="ui-poptips pop-show" id="pop4">';
        tipStr += '<div class="ui-poptips-cnt">'+_tipMsg+'</div>';
        tipStr += '</div>';
        $('body').append(tipStr);
        window.setTimeout(function(){
            $('.ui-poptips').remove();
        }, 3000);
    };

    /**
     * [YZQ_Tips 业主圈加载中显示]
     *
     *
     */
    factory.Loading =function(falg,tagget){
      if (falg == true){
          $(tagget).prepend('<div class="dropload-down" style="transition: all 300ms; height: 50px;"><div class="dropload-load"><span class="loading"></span>加载中...</div></div>');
      }else{
          $('.dropload-down').remove();
      }
    };
   


	/* 暴露 API 工厂*/
	return factory;

})(window, window.YZQ_COMMON = window.YZQ_COMMON || {});
/*

var BASE_URL = "http://circle2.huizhuang.com" //正式地址
	//var BASE_URL = "http://circle2.rls.huizhuang.com"//测试地址

//判断图片来源并确定是否裁剪
var imageSource = function(url) {
	if (url.indexOf("hzyzq") >= 0) {
		var url = url + "/wlist?max_age=19830212&d=20151230193947";
		return url;
	} else {
		var url = url + "?max_age=19830212&d=20151230193947";
		return url;
	}
}

//ajax通用请求方法
var ajaxRequest = function(url, data, success, fail) {
	$.ajax({
		url: BASE_URL + url,
		dataType: "json",
		type: "POST",
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
}*/