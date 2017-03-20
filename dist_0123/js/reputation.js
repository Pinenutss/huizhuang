/**
 * Created by daikui on 2015/11/20.
 * namespace: YZQ_REPUTATION
 * use: REPUTATION.HTML
 * @author   : zwp
 * @datetime : 2015/11/23
 * @version  : 1.0.0
 */
;
(function() {
    var pagenum = 1; //翻页计数
    var reldata = new Array(); //绑定数据的数组
    //获取口碑列表数据
    var get_content = function(_page, me) {
        try{
            var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo()); //获取用户信息
            var site_id = _userInfo.site_id;
        }catch (err){
            console.log(err);
        }
//         var site_id = 1;
        YZQ_UTILS.AJAXRequest(
            '/index/Index/evaluate.do',
            "post", {
                page: _page,
                site_id: site_id
            },
            function(data) {
                pagenum++;
                // var reldata = new Array();
                var reputations = data.data;
                if (reputations.length == undefined) {
                    YZQ_COMMON.tips('已经全部加载完啦~');
                };
                for (var i = 0; i < reputations.length; i++) {
                    var reput = reputations[i];
                    //只有评价2个字以上,接单次数大于0的才给予显示
                    if (reput.content.length > 2 && reput.service_num > 0 && reput.housing_area > 0 ) {
                        //处理用户头像为空
                        if (reput.user_head_img == "" || reput.user_head_img == null) {
                            reput.user_head_img = "http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                        }
                        //处理工长头像为空
                        if (reput.foreman_head_img == "" || reput.foreman_head_img == null) {
                            reput.foreman_head_img = "http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                        }
                        //处理时间
                        var _type = "YYYY-MM-DD";
                        reput.add_time = YZQ_COMMON.formateTime(reput.add_time, _type);
                        //处理量房阶段
                        if (reput.stage == "done") {
                            reput.stage = "竣工阶段";
                        }
                        if (reput.stage == "oil_paint") {
                            reput.stage = "油漆阶段";
                        }
                        if (reput.stage == "water") {
                            reput.stage = "水电阶段";
                        }
                        if (reput.stage == "wood") {
                            reput.stage = "泥木阶段";
                        }
                        if (reput.stage == "start") {
                            reput.stage = "开工阶段";
                        }
                        if (reput.stage == "measure") {
                            reput.stage = "量房阶段";
                        }
                        reput.service_num = reput.service_num + "次";
                        reput.housing_area = reput.housing_area + "m²";
                        //处理评分
                        reput.starscore = ((reput.score / 5) * 100);
                        
                        reput.userVip = Number(reput.userVip) ? '<span class="ico-vsmall"></span>' : '';
                        reput.sex = Number(reput.sex) == 2 ? '<i class="xingbie-nv"></i>' : '<i class="xingbie-nan"></i>';
                        //处理城市
                        if(reput.city != ""){
                            reput.point ="·";
                        }
                        reldata.push(reput);
                        if (_page == 1) {
                            YZQ_COMMON.Loading(false, "");
                        }
                    }
                }
                if (me) {
                    me.resetload();
                };
            },
            function(error) {
                YZQ_COMMON.tips(error.msg);
                if (me) {
                    me.resetload();
                };
            }
        );
    };
    get_content(pagenum);
    var vm = new Vue({
        el: '#list',
        data: {
            datas: reldata
        }
    });
    //滑动加载数据
    var ScrollLoadData = function() {
        //YZQ_COMMON.ScrollLoadData(function(){
        //    get_content(pagenum);
        //}) ;
        $('#list').find("ul").dropload({
            scrollArea: window,
            loadDownFn: function(me) {
                get_content(pagenum, me);
            },
            loadUpFn : function(me){
                window.location.reload();
                me.resetload();
            },
            domUp : {
                domClass : 'dropload-up',
                domRefresh : '<div class="dropload-refresh">↓下拉刷新</div>',
                domUpdate : '<div class="dropload-update">↑释放更新</div>',
                domLoad : '<div class="dropload-load">正在刷新...</div>'
            }
        });
    }();
    /**
     * 点击头像跳转到个人主页
     */
    $('body').on('click', '.owner-cont .head-img i', function (){
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
        var userId = $(this).data('user_id'),
            junmpurl = 'my-page.html?userid='+ userId;
//            location.href = junmpurl;
        var data = {
            baseurl:  WEB_CONFIG.NATIVE_JUMP() ,
            page:   junmpurl,
            title:  "个人主页",
            isthide:    true,
            isbhide:    true,
            isfull:     false,
            iconright : 0
        };
        YZQ_UTILS.pageSwitchMethod(data);
        return false;
    });
    /**
     * 点击头像跳转到工长详情ye
     */
    $('body').on('click', '.gong-cont', function (){
        var pointid = $(this).find('.head-img').data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
        var foremanid = $(this).find('.head-img').data('foremanid');
        HZ_APP_JSSDK.switchForemanDetail(foremanid.toString());
    });
    var target = '.repu-list';
   // YZQ_COMMON.Loading(true, target);
	
	//下单预约点击事件
	$(".js_booking").on("click",function(){
		var obj = new Object();
		obj.source ="yzq_koubei";
		obj.pageid = "200065";
		obj.foremanid ="";
		HZ_APP_JSSDK.bookingJump(JSON.stringify(obj));
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
    });
}());