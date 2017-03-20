/**
 * Created by daikui on 2015/11/20.
 * namespace: YZQ_REPUTATION
 * use: REPUTATION.HTML
 * @author   : zwp
 * @datetime : 2015/11/23
 * @version  : 1.0.0
 */
;
(function(){
    var pagenum = 1;//翻页计数
    var reldata = new Array();//绑定数据的数组
    //获取口碑列表数据
    var get_content =function (_page){
        var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
        var site_id =_userInfo.site_id;
        YZQ_UTILS.AJAXRequest(
            '/index/Index/evaluate.do',
            "post",
            {
                page:_page
                ,site_id:site_id
            },
            function(data) {
                pagenum++;
               // var reldata = new Array();
                var reputations = data.data;
                for (var i = 0; i < reputations.length; i++) {
                    var reput = reputations[i];
                    //只有评价2个字以上,接单次数大于0的才给予显示
                    if(reput.content.length>2 &&reput.service_num>0 && reput.housing_area >0 &&reput.city!=""){
                        //处理用户头像为空
                        if(reput.user_head_img ==""||reput.user_head_img ==null){
                            reput.user_head_img = "http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                        }
                        //处理工长头像为空
                        if(reput.foreman_head_img ==""||reput.foreman_head_img ==null){
                            reput.foreman_head_img = "http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                        }
                        //处理时间
                        var _type = "YYYY-MM-DD";
                        reput.add_time = YZQ_COMMON.formateTime(reput.add_time,_type);
                        //处理量房阶段
                        if(reput.stage == "done"){
                            reput.stage ="竣工阶段";
                        }
                        if(reput.stage == "oil_paint"){
                            reput.stage ="油漆阶段";
                        }
                        if(reput.stage == "water"){
                            reput.stage ="水电阶段";
                        }
                        if(reput.stage == "wood"){
                            reput.stage ="泥木阶段";
                        }
                        if(reput.stage == "start"){
                            reput.stage ="开工阶段";
                        }
                        if(reput.stage == "measure"){
                            reput.stage ="量房阶段";
                        }
                        reput.service_num = reput.service_num+"次";
                        reput.housing_area = reput.housing_area+"m²";
                        //处理评分
                        reput.starscore = ((reput.score/5)*100);
                        reldata.push(reput);
                    }
                }
            },
            function(error) {
                console.log(error);
            }
        );
    };
    get_content(pagenum);
    var vm = new Vue({
        el: '#list',
        data:{
            datas:reldata
        }
    });
    //滑动加载数据
    var ScrollLoadData =function(){
        YZQ_COMMON.ScrollLoadData(function(){
            get_content(pagenum);
        }) ;
    }();
}());
