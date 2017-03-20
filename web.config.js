/**
 * [WEB_CONFIG 项目配置]
 * @Object 项目基本配置
 * API：API数据接口
 * REPORT: 上报接口
 * STYLE：样式地址
 * PATH：环境变量
 */
exports.WEB_CONFIG = {
	/* 数据接口 */
	API: {
		rls: "http://circle2.rls.huizhuang.com",
        test:"http://circle2.test.huizhuang.com",
		live: "http://circle2.live.huizhuang.com",
		release: "http://circle2.huizhuang.com"
	},
	/* 上报接口 */
	REPORT: {
		rls: "http://report.rls.huizhuang.com",
        test: "http://report.test.huizhuang.com",
		live: "http://report.live.huizhuang.com",
		release: "http://report.huizhuang.com"
	},
	/* 样式文件地址 */
	STYLE: {
//		rls: "http://imgcache.rls.huizhuang.com/hzone_v2/dist",
//		live: "http://imgcache.live.huizhuang.com/hzone_v2",
//		release: "http://hzimg.huizhuang.com/hzone_v2"

        rls: "http://imgcache.dev.huizhuang.com/hzone_v2/dist/",
        test:"http://imgcache.test.huizhuang.com/hzone_v2/",
        live: "http://imgcache.live.huizhuang.com/hzone_v2/",
        release: "http://hzimg.huizhuang.com/hzone_v2/"


	},
	/* 环境变量 */
	PATH: {
		src: "./src",
        test: "./test",
		live: "./live",
		release: "./dist"
	}
}