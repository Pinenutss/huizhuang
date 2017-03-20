/**
 * 配置文件
 */
var CONFIG = (function(root, factory) {
	"use strict";
	factory.APPID = 200000;
	factory.VERSION = "3.2.0.0";
    factory.API = "http://circle2.huizhuang.com";//factory.API = "http://circle2.rls.huizhuang.com";//
	factory.REPORT_API = "http://report.rls.huizhuang.com";
	factory.STYLE = "";
	factory.CHANNEL = "yzq";
	factory.SKEY = "yzq_huizhuang_secret_key";
	/* 暴露 API 工厂*/
	return factory;

})(window, window.CONFIG = window.CONFIG || {});