"use strict";
var gulp = require("gulp"); //导入gulp
var jshint = require("gulp-jshint"); //js检查
var stylish = require('jshint-stylish'); //js检查格式化
var concat = require('gulp-concat'); //文件合并
var uglify = require('gulp-uglify'); //js压缩混淆
var del = require('del'); //删除文件
var cdn = require('gulp-cdn'); //域名切换
var config = require('./web.config').WEB_CONFIG; //项目配置文件

/**  清理test环境  **/
gulp.task("testClear", function(cb) {
    del.sync(config.PATH.test + "/*");
    cb();
});
/**  清理Live环境  **/
gulp.task("liveClear", function(cb) {
	del.sync(config.PATH.live + "/*");
	cb();
});
/**  清理Dist环境  **/
gulp.task("distClear", function(cb) {
	del.sync(config.PATH.release + "/*");
	cb();
});
/**  配置文件切换  **/
//Test
gulp.task("testConfig", ["testClear"], function() {
    return gulp.src(config.PATH.src + "/config.rls.js")
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(cdn([{
            domain: config.API.rls,
            cdn: config.API.test
        }, {
            domain: config.REPORT.rls,
            cdn: config.REPORT.test
        }, {
            domain: config.STYLE.rls,
            cdn: config.STYLE.test
        }]))
        .pipe(concat("config.test.js"))
        .pipe(gulp.dest(config.PATH.test + "/"));
});
//Live
gulp.task("liveConfig", ["liveClear"], function() {
	return gulp.src(config.PATH.src + "/config.rls.js")
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(cdn([{
			domain: config.API.rls,
			cdn: config.API.live
		}, {
			domain: config.REPORT.rls,
			cdn: config.REPORT.live
		}, {
			domain: config.STYLE.rls,
			cdn: config.STYLE.live
		}]))
		.pipe(concat("config.live.js"))
		.pipe(gulp.dest(config.PATH.live + "/"));
});
//Dist
gulp.task("distConfig", ['distClear'], function() {
	return gulp.src(config.PATH.live + "/config.live.js")
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(cdn([{
			domain: config.API.live,
			cdn: config.API.release
		}, {
			domain: config.REPORT.live,
			cdn: config.REPORT.release
		}, {
			domain: config.STYLE.live,
			cdn: config.STYLE.release
		}]))
		.pipe(uglify())
		.pipe(concat("config.js"))
		.pipe(gulp.dest(config.PATH.release + "/"));
});
/**  页面引用切换  **/
//Test
gulp.task("testSwitch", ["testConfig"], function() {
    return gulp.src(config.PATH.src + "/*.html")
        .pipe(cdn([{
            domain: config.STYLE.rls,
            cdn: config.STYLE.test
        }, {
            domain: "config.rls.js",
            cdn: "config.test.js"
        }]))
        .pipe(gulp.dest(config.PATH.test + "/"));
});
//Live
gulp.task("liveSwitch", ["liveConfig"], function() {
	return gulp.src(config.PATH.src + "/*.html")
		.pipe(cdn([{
			domain: config.STYLE.rls,
			cdn: config.STYLE.live
		}, {
			domain: "config.rls.js",
			cdn: "config.live.js"
		}]))
		.pipe(gulp.dest(config.PATH.live + "/"));
});
//Dist
gulp.task("distSwitch", ["distConfig"], function() {
	return gulp.src(config.PATH.live + "/*.html")
		.pipe(cdn([{
			domain: config.STYLE.live,
			cdn: config.STYLE.release
		}, {
			domain: "config.live.js",
			cdn: "config.js"
		}]))
		.pipe(gulp.dest(config.PATH.release + "/"));
});
/**  Javascript检查  **/
//Test js
gulp.task("testJS", ["testSwitch"], function() {
    return gulp.src(config.PATH.src + "/js/*.js")
        .pipe(jshint())
        .pipe(cdn([{
            domain: config.API.rls,
            cdn: config.API.test
        }, {
            domain: config.REPORT.rls,
            cdn: config.REPORT.test
        }]))
        .pipe(jshint.reporter(stylish))
        .pipe(gulp.dest(config.PATH.test + "/js/"));
});
//Test Utils
gulp.task("testUtils", ["testJS"], function() {
    return gulp.src(config.PATH.src + "/utils/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(gulp.dest(config.PATH.test + "/utils/"));
});
//Live js
gulp.task("liveJS", ["liveSwitch"], function() {
	return gulp.src(config.PATH.src + "/js/*.js")
		.pipe(jshint())
		.pipe(cdn([{
			domain: config.API.rls,
			cdn: config.API.live
		}, {
			domain: config.REPORT.rls,
			cdn: config.REPORT.live
		}]))
		.pipe(jshint.reporter(stylish))
		.pipe(gulp.dest(config.PATH.live + "/js/"));
});
//Live Utils
gulp.task("liveUtils", ["liveJS"], function() {
	return gulp.src(config.PATH.src + "/utils/*.js")
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(gulp.dest(config.PATH.live + "/utils/"));
});
//Dist js
gulp.task("distJS", ["distSwitch"], function() {
	return gulp.src(config.PATH.live + "/js/*.js")
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(uglify())
		.pipe(gulp.dest(config.PATH.release + "/js/"));
});
//Dist utils
gulp.task("distUtils", ["distJS"], function() {
	return gulp.src(config.PATH.live + "/utils/*.js")
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(uglify())
		.pipe(gulp.dest(config.PATH.release + "/utils/"));
});
//****打包发布到test环境*****//
gulp.task("test", ["testUtils"], function() {
    console.log('Task dist has been completed')
});
//****打包发布到Live环境*****//
gulp.task("live", ["liveUtils"], function() {
	console.log('Task live has been completed');
});
//****打包发布到Dist环境*****//
gulp.task("dist", ["distUtils"], function() {
	console.log('Task dist has been completed')
});
// 默认任务
gulp.task("default", function() {
	console.log('============== Gulp Info ============');
	console.log('1. use "gulp live" command publish file form src to live!');
	console.log('2. use "gulp dist" command publish file form live to release!');
	console.log('=====================================');
});