/**
 * Created by cy on 2015/12/01.
 * namespace: YZQ_TITLES
 * use: TITLES.HTML
 * @author   : cy
 * @datetime : 2015/12/01
 * @version  : 1.0.0
 */
;
(function () {

    var relData = [];//绑定数据的数组

    //     下单预约点击事件
    try{
        var flag = HZ_APP_JSSDK;
    }catch (err){
        console.log(err);
    }
    if(flag){
        $(".js_booking").on("click",function(event){
            var obj = new Object();
            obj.source ="yzq_wenzhang";
            obj.pageid = "200084";
            obj.foremanid ="";
            HZ_APP_JSSDK.bookingJump(JSON.stringify(obj));
            YZQ_MONITOR.pointClick(20008404);//埋点上报
        });
    }else{
        //配合外部跳转
        var lasturl = document.referrer;
        var dist_num = lasturl.indexOf('hzone.huizhuang.com');
        var ued_num = lasturl.indexOf('ued.huizhuang.com');
        if(dist_num<0&&ued_num<0){//不是从业主圈跳转
            var a = document.createElement('a');
            a.href = document.referrer;
            var file= (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1];
            lasturl = lasturl.replace(file,"other-order.html");console.log(lasturl);
            $('.js_booking').click(function(){
                window.location.href = lasturl;
            });
        }
    }





    
    var getData = function () {
        
        var parseobj = YZQ_COMMON.parseURI().params;
        
        YZQ_UTILS.AJAXRequest(
            '/index/Article/articleDetail.do',
            "post", {
                id: parseobj.id
            },
            function (data) {
                relData.push(data.data);
            },
            function (error) {
                console.log(error);
            }
        );
    };
    
    getData();
    
    var vm = new Vue({
        el: '#articles',
        data: {
            datas: relData
        }
//        ,
//        methods: {
//            stickPostsClick:function(){
//                var obj = new Object();
//                obj.source ="yzq_wenzhang";
//                obj.pageid = "200084";
//                obj.foremanid ="";
//                HZ_APP_JSSDK.bookingJump(JSON.stringify(obj));
//                YZQ_MONITOR.pointClick(20008404);//埋点上报
//            }
//        }
    });
	
    //设置页面对应的Pageid
    (function(){
        var parseurl = YZQ_COMMON.parseURI().params;
        var pageid = parseurl.pageid;
        if(pageid==200075){//人民惠装
            sessionStorage.removeItem("atricle_pageid");
            localStorage.removeItem("atricle_pageid");
            sessionStorage.setItem("atricle_pageid","200075");
            localStorage.setItem("atricle_pageid","200075");
        }if(pageid==200077){//防坑大全
            sessionStorage.removeItem("atricle_pageid");
            localStorage.removeItem("atricle_pageid");
            sessionStorage.setItem("atricle_pageid","200077");
            localStorage.setItem("atricle_pageid","200077");
        }if(pageid==200076){//装修宝典
            sessionStorage.removeItem("atricle_pageid");
            localStorage.removeItem("atricle_pageid");
            sessionStorage.setItem("atricle_pageid","200076");
            localStorage.setItem("atricle_pageid","200076");
        }
    })();

//    var wx_share = function(platform)
//    {
//        var title = relData[0].title;
//        var urls = window.location.href;
//        var obj = {
//            platform: platform,
//            imageurl: relData[0].img,
//            text: relData[0].title,
//            title: relData[0].title,
//            url: urls,
//            site: urls,
//            siteurl: urls,
//            titleurl: urls
//        };
//        HZ_APP_JSSDK.shareToDifPlatform(JSON.stringify(obj));
//    };
    
    /*var registerClickListener = function (){
        $('#js_shareWxFriends').click(function (){
            var platform = "wechat"
            wx_share(platform);
        });
        
        $('#js_shareWXSocials').click(function (){
            var platform = "wechatmoment";
            wx_share(platform);
        });
        
        $('#js_weibo').click(function (){
            var platform = "sina";
            wx_share(platform);
        });
    }();*/
}());