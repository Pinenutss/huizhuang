/**
 * 项目基本配置
 * namespace: WEB_CONFIG
 * use: WEB_CONFIG.method
 * @author   : zwp
 * @datetime : 2015/11/21
 * @version  : 1.0.0
 */

var WEB_CONFIG = (function(root, factory) {
    //模块名称
    var _MODULE_NAME = "项目基本配置";
    //模块版本
    var _MODULE_VERSION = "1.0.0";
    //定义当前环境
    var _ENV_PATH = 1; //0:开发,1:测试,2:live,3:正式,默认:开发
    //定义客户端内部跳转环境
    var _JUMP_URL = 3; //0:开发,1:测试,2:live,3:正式,默认:开发
    /**
     * [HOST 获取服务器接口地址]
     * @param {int} env 运行环境:{0:开发,1:测试,2:live,3:正式,默认:开发}
     * @return{string} 服务器地址
     */
    factory.HOST = function() {
        var host = "";
        switch (_ENV_PATH) {
            case 0:
                host = "http://circle2.rls.huizhuang.com";
                break;
            case 1:
                host = "http://circle2.rls.huizhuang.com";
                break;
            case 2:
                host = "http://circle2.live.huizhuang.com";
                break;
            case 3:
                host = "http://circle2.huizhuang.com";
                break;
            default:
                host = "http://circle2.rls.huizhuang.com";
                break;
        }
        return host;
    };
    factory.NATIVE_JUMP = function() {
        var jump_url = "";
        switch (_JUMP_URL) {
            case 0:
                jump_url = "http://ued.huizhuang.com/dep/hzone_v2/";
                break;
            case 1:
                jump_url = "http://hzone.live.huizhuang.com/";
                break;
            case 2:
                jump_url = "http://hzone.live.huizhuang.com/";
                break;
            case 3:
                jump_url = "http://hzone.huizhuang.com/";
                break;
			case 4:
				jump_url = "http://hzone.rls.huizhuang.com/v2/src/";
				break;
            default:
                jump_url = "http://ued.huizhuang.com/dep/hzone_v2/";
                break;
        }
        return jump_url;
    };
    /* 暴露 API 工厂*/
    return factory;

})(window, window.WEB_CONFIG = window.WEB_CONFIG || {});