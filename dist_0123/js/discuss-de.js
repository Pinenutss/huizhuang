/**
 * Created by zwp on 2015/12/1.
 * 帖子讨论
 */

var discuss_de = function(){
    var discussData =  [];//帖子详情绑定数据的数组
    var discussLitsData =  [];//帖子详情绑定数据的数组
    var accusationReason = [];//举报原因
    var tiezi_userid = "";//贴主的用户id
    var reply_victor_replyid = "";//回复的对象id (如果是帖子就为空 如果是对评论的回复进行回复 这该字段是评论的id)
    var reply_victor_userid ="";//回复对象的用户id (如果是对评论的回复进行回复 这该字段是评论的用户id)
    var reply_victor_commentid = "";//回复的回复的id(不是就为空)
    var replyflag = "";//回复对象的标志， 1 对帖子回复，2 点击图标评论  3点击行回复
    var replynode = "";//回复评论的this节点
    //获取帖子详情
    var GetDisscussInfo = function(){
        try{
            var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
            var user_id =_userInfo.user_id;
            if (user_id === ""||user_id === null){
                user_id = _userInfo.machineid;
            }
        }catch (err){

        }

        //var user_id =130;
        var t =YZQ_COMMON.parseURI().params;
        var _cardid = t.card_id;//网址解析出来的帖子ID
        YZQ_UTILS.AJAXRequest(
            '/index/Card/cardDetail.do',
            'post',
            {
                card_id:_cardid,//620
                user_id:user_id//userid0.
            },
            function(result){
                var infodata =  result.data;
                tiezi_userid = infodata.user_id;//存发贴人id
                //处理数据
                var _type = "YYYY-MM-DD";
                infodata.card_add_time=YZQ_COMMON.formateTime(infodata.card_add_time,_type);
                if (infodata.user_head_img ===""||infodata.user_head_img ===null){
                    infodata.user_head_img ="http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                }
                //日记图片
                if (infodata.imgs.length>0){
                    for (i=0; i<infodata.imgs.length&&i<9; i++){
                        if(infodata.imgs[i].img_url ===""||infodata.imgs[i].img_url ===null){
                            infodata.imgs[i].img_url="http://placehold.it/10x10";
                        }
                    }
                    infodata.imgs.splice(9,100);
                }
                //最近点赞人 最多3个
                if(infodata.praises.length>0){
                    var len = "";
                    if(infodata.praises.length>3){
                        len = 3;
                    }else{
                        len = infodata.praises.length;
                    }
                    for (j=0; j<len; j++){
                        if(infodata.praises[j].praise_user_head ===""||infodata.praises[j].praise_user_head ===null){
                            infodata.praises[j].praise_user_head="http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                        }
                    }
                    infodata.praises.splice(3,10000);
                }
                //判断浏览人是否点赞帖子
                if(infodata.is_praise ==0){
                    infodata.ifpraise = "click-like";
                    infodata.ifpraiseword = "点赞";
                }else{
                    infodata.ifpraise = "click-like yet";
                    infodata.ifpraiseword = "已赞";
                }
                discussData.push(infodata);
            },
            function(error){
                console.log(error);
            }
        );
    }();
    //获取帖子评论
    var GetDisscussList =function(){
        var t =YZQ_COMMON.parseURI().params;
        var _cardid = t.card_id;//网址解析出来的帖子ID
        try{
            var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
            var user_id =_userInfo.user_id;
//        var user_id =1;
            if (user_id === ""||user_id === null){
                user_id = _userInfo.machineid;
            }
        }catch (err){
            console.log(err);
        }

        //var user_id = 130;
        YZQ_UTILS.AJAXRequest(
            '/index/Card/getDiscussInfo.do',
            'post',
            {
                card_id:_cardid//cardid
                ,user_id:user_id

            },
            function(result){
                var data = result.data;
                if(data.length!= 0){
                    for (k=0; k<data.length; k++){
                        //处理时间
                        var _type = "YYYY-MM-DD";
                        //data[k][0].add_time=YZQ_COMMON.formateTime(data[k][0].add_time,_type);
                        data[k][0].add_time = TurnTime(data[k][0].add_time);
                        //处理点赞
                        if(data[k][0].is_parise == 0){
                            data[k][0].divclass = "click-like";
                        }else{
                            data[k][0].divclass = "click-like yet";
                        }
                        //处理用户头像为空
                        if(data[k][0].user_head_img ===""||data[k][0].user_head_img ===null){
                            data[k][0].user_head_img ="http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                        }


                    }


                    discussLitsData.push(data);
                }

            },
            function(error){}
        )
    }();
    //时间戳转换
    var TurnTime = function(time){
        var timestamp=new Date().getTime();
        var timeAgo = (timestamp - time)*1000;				//发表时间到当前服务器时间的毫秒数
        var MinuteAgo = 60*60*1000;						//1小时内毫秒数
        var HoursAgo = 24*60*60*1000;					//1天内毫秒数
        var DateAgo = 3*24*60*60*1000;					//3天内毫秒数
        if(timeAgo < MinuteAgo){
            return Math.floor(timeAgo/1000/60) + "分钟前";
        }else if(MinuteAgo <= timeAgo && timeAgo < HoursAgo){
            return Math.floor(timeAgo/1000/60/60) + "小时前";
        }else if(HoursAgo <= timeAgo && timeAgo < DateAgo){
            return Math.floor(timeAgo/1000/60/60/24) + "天前";
        }else{
            var geTime = new Date(time*1000).toGMTString();	//将时间戳转换为格林威治时间
            var chinaDate = new Date(geTime);				//将格林威治时间转换为中国标准时间
            var year = chinaDate.getFullYear();
            var month = chinaDate.getMonth()+1<10?'0'+(chinaDate.getMonth()+1):chinaDate.getMonth()+1;
            var date = chinaDate.getDate()<10?'0'+chinaDate.getDate():chinaDate.getDate();
            var hour = chinaDate.getHours()<10?'0'+chinaDate.getHours():chinaDate.getHours();
            var minute = chinaDate.getMinutes()<10?'0'+chinaDate.getMinutes():chinaDate.getMinutes();
            var second = chinaDate.getSeconds()<10?'0'+chinaDate.getSeconds():chinaDate.getSeconds();
            //return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
            return year+"-"+month+"-"+date;
        }
    };
    //对帖子点赞
    $('body').on("click",'#js_toprprise',function(){
        if($('#js_toprprise').attr('class') == "click-like"){
            $('#js_toprprise').addClass('yet');
            $('#js_priseword').text('已赞');
            var _prisenum = parseInt($('.zan-list b').text());
            $('.zan-list b').text((_prisenum+1));
            var msgid = $(this).data("msgid");//点赞对象id
            var prise_type = 1;
            praise(msgid,prise_type);
        }
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
    });
    //点赞接口
    var praise =function(id,type){
        var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
        var userid = _userInfo.user_id;
        if (userid === ""||userid === null){
            userid = _userInfo.machineid;
        }
        //var userid = 130;
        YZQ_UTILS.AJAXRequest(
            '/index/Card/praise.do',
            'post',
            {
                id:id,
                user_id:userid,
                type:type//点赞类型 1:帖子 2:评论
            },
            function(result){
                console.log(result.msg);
            },
            function(error){
            }
        )
    };
    //点击回复楼主判断是否登录
    $('body').on('click','#js_replay_content',function(event){
        var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
        var userid = _userInfo.user_id;
        //var userid = 130;
        if(userid===""||userid===null){
            //跳转登录
            HZ_APP_JSSDK.userloginjump();

        }else{console.log("输入文字处");
            //对帖子回复
            $('body').find('#js_cont_send').unbind("click").click(function(){
                if($('#js_replay_content').val() == ""){
                    YZQ_COMMON.tips("请先输入评论再发送");

                }else{
                    var _reply_id = "";
                    var _reply_user_id =tiezi_userid;
                    var _comment_id = "";
                    replyflag = 1;
                    replay(_reply_id,_reply_user_id,_comment_id);
                    $('#js_replay_content').val("") ;
                }
                var pointid = $(this).data('pointid');
                YZQ_MONITOR.pointClick(pointid); //埋点上报
            });
            //对帖子中的评论回复
            $('body').find('#js_cont_sendto_victior').unbind("click").click(function(){
                if($('#js_replay_content').val() == ""){
                    YZQ_COMMON.tips("请先输入评论再发送");
                }else{
                    var _reply_id = reply_victor_replyid;
                    var _reply_user_id =reply_victor_userid;
                    var _comment_id = reply_victor_commentid;
                    replay(_reply_id,_reply_user_id,_comment_id);
                    $('#js_replay_content').val("") ;
                }
                var pointid = $(this).data('pointid');
                YZQ_MONITOR.pointClick(pointid); //埋点上报
            });
        }
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
    });
    //点击回复图标
    $('body').on("click",'.ping',function(){
        $('#js_cont_send').hide();
        $('#js_cont_sendto_victior').show();
        var replay_name = $(this).data("victorname");
        $('#js_replay_content').attr('placeholder','回复'+replay_name);
        reply_victor_commentid ="";
        reply_victor_replyid =$(this).data("replyid");
        reply_victor_userid=$(this).data("victorid");
        replynode =$(this).parent().parent();
        replyflag = 2;
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
    });
    //行点击回复
    $('body').on("click",'.js_reply_msg',function(){
        $('#js_cont_send').hide();
        $('#js_cont_sendto_victior').show();
        var replay_name = $(this).data("victorname");
        reply_victor_replyid =$(this).data("replyid");
        reply_victor_userid=$(this).data("victorid");
        reply_victor_commentid =$(this).data("commentid");
        $('#js_replay_content').attr('placeholder','回复'+replay_name);
        replynode =$(this).parent();
        replyflag = 3;
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
    });
    //对用户评论点赞
    $('.comment').on("click",'.click-like',function(){
        var _priseid = $(this).data("userprise");
        var _type = 2;
        if($(this).attr('class').indexOf("yet")<0){
            $(this).addClass('yet');
            $(this).unbind("click");
            var num =  $(this).find('.prise_num').text();
            var intmun = parseInt(num);
            $(this).find('.prise_num').text((intmun+1));
            praise(_priseid,_type);
        }
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报

    });
    //回复评论
    var replay = function(_reply_id,reply_user_id,comment_id){
        var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
        var user_id =_userInfo.user_id;
        // var user_id =130;
        var _cont = $('#js_replay_content').val();
        var t =YZQ_COMMON.parseURI().params;
        var _cardid = t.card_id;//网址解析出来的帖子ID
        YZQ_UTILS.AJAXRequest(
            '/index/Card/discuss.do',
            'post',
            {
                card_id:_cardid,//帖子id
                reply_id:_reply_id,//回复的对象id (如果是对评论的回复进行回复 这该字段是评论的id)
                reply_user_id:reply_user_id,//回复对象的用户id (如果是对评论的回复进行回复 这该字段是评论的用户id)
                user_id:user_id,//user_id,//评论,回复用户id
                content:_cont,//内容
                comment_id:comment_id
            },
            function(result){
                console.log(result.data);
                if(result.status == 200){
                    var data = result.data;console.log(replyflag);
                    //回复楼主
                    if(replyflag == 1){
                        var _type = "YYYY-MM-DD";
                        var addtime = YZQ_COMMON.formateTime(data.add_time,_type);
                        if(data.user_avatar == "" || data.user_avatar == null){
                            data.user_avatar = "http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                        }
                        var str = '';
                        str += '<li>';
                        str += '<i  class="head-img" style="background-image:url('+data.user_avatar+');"></i>';
                        str += '<div class="list-wrap">';
                        str += '<p class="name">'+data.user_name+'</p>';
                        str += '<p class="content">'+data.content+'</p>';
                        str += '<div class="list-info">';
                        str += '<time>'+addtime+'</time>';
                        str += '<div class="dian-zan"   data-pointid="4"><span class="ico-zan userprise" data-userprise="'+data.id+'"></span><span class="prise_num">0</span></div>';
                        str += '<div class="ping"   data-victorid="'+data.user_id+'" data-replyid ="'+data.user_id+'" data-victorname="'+data.user_name+'" data-pointid="6"><span class="ico-ping-hot"></span></div>';
                        str += '</div>';
                        str += '</li>';
                        $('.discuss-list').append(str);
                        $('#js_replay_content').val('');
                    }
                    //点击图标回复
                    if(replyflag == 2){
                        if(replynode.find('.replay').length == 0){
                            var addnewnode = "";
                            addnewnode += '<div class="replay" >';
                            addnewnode += '<span class="ico-jian"></span>';
                            addnewnode += '<ul>';
                            addnewnode += '<li data-pointid="5"  class="js_reply_msg" data-commentid="'+data.id+'" data-victorid="'+data.user_id+'" data-victorname="'+data.user_name+'" data-replyid ="'+data.reply_id+'"><b>'+data.user_name+'</b>回复<b>'+data.reply_user_name+'</b><i class="ico-lou"></i><span>：'+data.content+'</span></li>';
                            addnewnode += '</ul>';
                            addnewnode += '</div>';
                            replynode.append(addnewnode);
                        }else{
                            var parentnode = replynode.find('.replay ul');
                            var iconreplaystr = '<li data-pointid="5"  class="js_reply_msg" data-commentid="'+data.id+'" data-victorid="'+data.user_id+'" data-victorname="'+data.user_name+'" data-replyid ="'+data.reply_id+'"><b>'+data.user_name+'</b>回复<b>'+data.reply_user_name+'</b><i class="ico-lou"></i><span>：'+data.content+'</span></li>';
                            parentnode.append(iconreplaystr);
                        }
                        $('#js_replay_content').val('');
                    }
                    //行点击回复
                    if(replyflag == 3){
                        var linestr = '<li data-pointid="5"  class="js_reply_msg" data-commentid="'+data.id+'" data-victorid="'+data.user_id+'" data-victorname="'+data.user_name+'" data-replyid ="'+data.reply_id+'"><b>'+data.user_name+'</b>回复<b>'+data.reply_user_name+'</b><i class="ico-lou"></i><span>：'+data.content+'</span></li>';
                        replynode.append(linestr);
                        $('#js_replay_content').val('');
                    }

                    YZQ_COMMON.tips("回复成功");
                }
                // window.location.reload();
            },
            function(error){
            }
        );
    };
    var getaccusationReason =function(){
        YZQ_UTILS.AJAXRequest(
            '/index/Index/getTagReportInfo.do',
            'post',
            {

            },
            function(result){
                var pointid = "20007212";
                for(i=0;i<result.data.length;i++){
                    result.data[i].pointid = pointid;
                    accusationReason.push(result.data[i]);
                    pointid++;
                }
            },
            function(err){
                console.log(err);
            }
        )
    }();
    //初始化帖子详情vjs
    var vm_list = new Vue({
        el: '.comment',
        data:{
            datalist:discussLitsData
        }
    });
    //初始化帖子详情vjs
    var vm = new Vue({
        el: '.discuss-de',
        data:{
            datas:discussData,
            reasons: accusationReason
        }
    });
//    //初始化举报vjs
//    var vm_accusation = new Vue({
//        el: '.report',
//        data:{
//            reasons: accusationReason
//        }
//    });

    /**
     * 点击头像跳转到个人主页
     */
    $('.discuss-de').on('click','.host .host-info .head-img',function (){
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
        var userId = $(this).data('user_id'),
            junmpurl = 'my-page.html?userid='+ userId;
//        location.href = junmpurl;
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
     * 点击回复头像跳转到个人主页
     */
    $('.discuss-de').on('click','.comment .head-img',function (){
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
        var userId = $(this).data('reply_user_id'),
            junmpurl = 'my-page.html?userid='+ userId;
//        location.href = junmpurl;
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

    var reportType= '';//举报类型
    var reportId = '';//举报ID
    var causeId = '';//举报原因id
    //点击举报楼主
    $('body').on('click','.jubao-sp',function (){
        reportType = 1;
        var t =YZQ_COMMON.parseURI().params;
        reportId = t.card_id;//帖子ID
        $('.report').show();
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
    });
    //点击举报楼层
    $('body').on('click','.cont-sp',function (){
        reportType = 2;
        reportId =$(this).data('id');
        $('.report').show();
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
    });
    //点击取消举报
    $('body').on('click','#js_accusation_cancel',function (){
        $('.report').hide();
        $('.report-cont i').removeClass('quan-choose').addClass('quan');
        causeId='';
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
    });
    //选择举报原因
    $('body').on('click','.report-cont li',function (){
        $(this).parent().find('i').removeClass('quan-choose').addClass('quan');
        $(this).find('i').removeClass('quan').addClass('quan-choose');
        causeId = $(this).data('id');
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
    });
    //举报
    $('#js_accusation_sbumit').click(function(){
        try{
            var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
            var user_id =_userInfo.user_id;
            var machineid =_userInfo.machineid;
//            var user_id =1;
//            var machineid =111;
            if(user_id ==="" || user_id === undefined){
                user_id = 0;
            }
        }catch (err){
            console.log(err);
        }
        if(causeId !=''){
            $('.report').hide();
            YZQ_UTILS.AJAXRequest(
                '/index/Index/report.do',
                'post',
                {
                    userId :	user_id,
                    machineId :	machineid,
                    reportType : reportType,
                    reportId : 	reportId,
                    causeId :   causeId
                },
                function(result){
                    if(result.status == 200){
                        $('.report-success p').text("该条信息被成功举报，请等待审核。");
                        $('.report-success').show();
                        setTimeout(function(){
                            $('.report-success').hide();
                        },2000);
                        $('.report-cont i').removeClass('quan-choose').addClass('quan');
                        causeId='';
                    }
                },
                function(err){
                    console.log(err);
                    $('.report-success p').text("出错啦，请稍后再举报");
                    $('.report-success').show();
                    setTimeout(function(){
                        $('.report-success').hide();
                    },2000);
                }
            )
        }
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
    });

    //点击查看图片
    $('body').on('click','.pic-list li',function(){
        try{
            HZ_APP_JSSDK.setImageShowForFull("1");
        }catch (err){
            console.log(err);
        }
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
        var ulstr = '<div class="flexslider"><ul class="slides"></ul></div>';
        $('.foot').append(ulstr);

        var clickid = $(this).index();
        var reg = new RegExp("thumbnail", "g"); //创建正则RegExp对象
        var imgSrc = $(this).siblings("li"); //取到点击li的兄弟元素
        console.log(imgSrc);
        for (i = 0; i < imgSrc.length; i++) {
            var str = "";
            var imglist = new Array();
            for (var n = 0; n < imgSrc.length; n++) {
                if (imgSrc[n].style.backgroundImage == null || imgSrc[n].style.backgroundImage == "") {
                    imgSrc[n].style.backgroundImage = "http://hzserver-10006163.image.myqcloud.com/9d4ccbe5-b16f-44ae-96f8-44539de2bb34?max_age=19830212&d=20151230193947";
                } else if (imgSrc[n].style.backgroundImage.indexOf("hzyzq") >= 0) {
                    var stringObj = imgSrc[n].style.backgroundImage;
                    var imgurl = stringObj.replace(reg, "normal");
                    imglist.push(imgurl);
                } else{
                    var imgurl = imgSrc[n].style.backgroundImage;
                    imglist.push(imgurl);
                }
            }
            str += "<li id='" + (i + 1) + "' style='background:" + imglist[i] + " no-repeat center; background-size:contain;height:100%;'></li>";
            $('.slides').append(str); //添加其他li列表
        }
        var clickImgUrl = $(this).css("background-image"); //取到点击图片地址
        if (clickImgUrl == null || clickImgUrl == "") {
            clickImgUrl = "http://hzserver-10006163.image.myqcloud.com/9d4ccbe5-b16f-44ae-96f8-44539de2bb34?max_age=19830212&d=20151230193947";
        } else if (clickImgUrl.indexOf("hzyzq") >= 0) {
            var _stringObj = clickImgUrl;
            var _imgurl = _stringObj.replace(reg, "normal");
        } else{
            var _imgurl = clickImgUrl;
        }
        var clickstr = "<li id='clickid' style='background:" + _imgurl + " no-repeat center; background-size:contain;height:100%;'></li>";
        if ($(this).parent().find("li").length == 1) {
            $('.slides').append(clickstr);
        } else {
            $('.slides').find("li").eq(clickid - 1).after(clickstr); //添加点击li
        }
        $("html,body").addClass("all-wrap");
        $(".photos-detail").css("display", "block");
//            $(".photos-detail").click(function() {
//                $(this).hide();
//            });
        //更改图片总数的数字
        $('.right-sp2').text(imgSrc.length + 1);
        $('.right-sp1').text(clickid + 1 + "/");

        //执行幻灯片方法
        $('.flexslider').flexslider({
            animation: "slide",
            directionNav: true,
            pauseOnAction: true,
            controlNav: false,
            slideshow: true,
            animationLoop: true,
            animationSpeed: 300,
            startAt: clickid,
            after: function() {
                var _id = $(".slides").find(".flex-active-slide").index();
                $('.right-sp1').text((_id) + "/");
            }
        });
        //取消返回点击事件
        $("#js_slider_back").on("click", function() {
            $("html,body").removeClass("all-wrap");
            $(".photos-detail").css("display", "none");
            $('.flexslider').remove();
            HZ_APP_JSSDK.setImageShowForFull("0");
        });
    });

}();