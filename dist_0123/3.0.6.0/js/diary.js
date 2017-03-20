/**
 * Created by zwp on 2015/11/23
 * namespace: YZQ_DIARY
 * use: DIARY.HTML
 * @author   : zwp
 * @datetime : 2015/11/23
 * @version  : 1.0.0
 */
;
(function(){
    var pagenum = 1;//记录
    var reldata = new Array();//绑定数据的数组
    var choosestyle ='';
    var choosephase = '';
    //获取日记列表数据
    var GetDiaryData = function(page,_style,node){
        YZQ_UTILS.AJAXRequest(
            '/index/Diary/getDiaryList.do',
            "post",
            {
                page:page,
                style:_style,
                node:node
            },
            function(result) {
                pagenum++;
                var reputations = result.data;
                for (var i = 0; i < reputations.length; i++) {
                    var reput = reputations[i];
                    //处理时间
                    var _type = "YYYY-MM-DD";
                    reput.add_time = YZQ_COMMON.formateTime(reput.add_time,_type);
                    if(reput.author.gender==1){
                        reput.author.gender ="xingbie-nan";
                    }else{
                        reput.author.gender ="xingbie-nv";
                    }
                    reput.praiseCount = reput.praiseCount +"赞";
                    reput.juge = "";
                    if(reput.style==""){
                        reput.fenggesp ="";
                        reput.icojiao = "";
                    }else{
                        reput.fenggesp ="fengge-sp";
                        reput.icojiao = "ico-jiao";
                    }
                    //用户头像处理
                    if(reput.author.head_img =="" || reput.author.head_img ==null){
                        reput.author.head_img = "http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                    }
                    //最进点赞
                    if(reput.praise.length>0){
                        var len = "";
                        if(reput.praise.length>= 3){
                             len = 3;
                        }else{
                            len =reput.praise.length;
                        }
                        for(j=0;j<len;j++){
                            if(reput.praise[j].headImg =="" ||reput.praise[j].headImg ==null){
                                reput.praise[j].headImg ="http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                            }
                        }
                        reput.praise.splice(3,reput.praise.length);//只取前三个头像
                    }

                    if(reput.imgs[0] == null || reput.imgs[0] == ""){
                        reput.imgs[0] = "http://hzserver-10006163.image.myqcloud.com/9d4ccbe5-b16f-44ae-96f8-44539de2bb34?max_age=19830212&d=20151230193947";
                    }else if(reput.imgs[0].indexOf("hzyzq") >= 0) {
                        reput.imgs[0] +="/wlist?max_age=19830212&d=20151230193947";
                    }


                    reldata.push(reput);
                }

            },
            function(error) {
                console.log(error);
            }
        );
    };

    //获取风格列表
    var GetStyleList = function(){
        YZQ_UTILS.AJAXRequest(
            '/index/diary/getXgtSearch.do.do',
            "post",
            {
                type:1
            },
            function(result) {
                new Vue({
                    el: '#datalist',
                    data:{
                        datas:result.data
                    }
                });
                //点击事件

                var li_click =$('.drop li');
                li_click.click(function(){
                    var _rel = $(this).data('rel');
                    li_click.find('span').removeClass('c-org');
                    $(this).find('span').addClass("c-org");
                    $('.drop').find('i').removeClass('icon-on');
                    $('.drop').find('i').addClass('icon-under');
                    $(this).find('i').removeClass('icon-under');
                    $(this).find('i').addClass('icon-on');
                    $('.screen').removeClass("show");
                    $("#"+_rel).addClass("show");
                });
                $('.screen').click(function(){
                    $('.screen').removeClass("show");
                    $('.drop').find('span').removeClass('c-org');
                    $('.drop').find('i').removeClass('icon-on');
                    $('.drop').find('i').addClass('icon-under');

                });
                $('.screen li').click(function(){
                    $(this).siblings('li').removeClass('current');
                    $(this).addClass('current');
                    var _target =$(this).parent().parent().parent().data('rel'),
                        _text=$(this).find("span").text();
                    $('#'+_target).find('.js_target').text(_text);
                    $('.screen').removeClass("show");
                    $('.js_target').removeClass('c-org');
                    $('.drop i').removeClass('icon-on');
                    $('.drop i').addClass('icon-under');
                    choosestyle =$('#js_style').find('.current').data('chooseid');
                    choosephase=$('#js_phase').find('.current').data('chooseid');
                    //$('.list-box').empty();
                    reldata.splice(0,reldata.length);
                    //选择条件后请求数据
                    GetDiaryData("",choosestyle,choosephase);
                });
                $('.c-gray').click(function(){
                    event.stopPropagation();
                });
            },
            function(error) {
                console.log(error);
            }
        )
    }();
    GetDiaryData(pagenum);//第一次进入时加载第一屏数据
    //初始化vjs
    var vm = new Vue({
        el: '#js_datalist',
        data:{
            datas:reldata
        }
    });
    //滑动加载数据
    var ScrollLoadData =function(){
       YZQ_COMMON.ScrollLoadData(function text(){
           GetDiaryData(pagenum,choosestyle,choosephase);
       }) ;
    }();
    //点击图片跳转日记详情
    $("body").on("click",".pic",function(event){

        YZQ_MONITOR.pointClick(event);//埋点上报

        //$("body").off("click",".pic");
        var user_id = $(this).data('user_id');
        var headimg = $(this).data('headimg');
        var gender = $(this).data('gender');
        if(gender =="xingbie-nan"){
            gender = 1;
        }
        else{
            gender = 2;
        }
        var nick_name =encodeURI($(this).data('nick_name')) ;
        var style = encodeURI($(this).data('style'));
        var type = encodeURI($(this).data('type'));
        var junmpurl = "diary-de.html?user_id="+user_id+"&gender="+gender+"&headimg="+headimg+"&nick_name="+nick_name+"&style="+style+"&type="+type;
        var data = {
            baseurl:  WEB_CONFIG.NATIVE_JUMP() ,
            page:   junmpurl,
            title:  "日记详情",
            isthide:    false,
            isbhide:    false,
            isfull:     false,
            iconright : 0
        };console.log(junmpurl);
        YZQ_UTILS.pageSwitchMethod(data);
        return false;


       // window.location.href = junmpurl;
    });

}());