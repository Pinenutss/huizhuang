/**
 * Created by zwp on 2015/12/01.
 * namespace: YZQ_PEOPLE
 * use: PEOPLE.HTML
 * @author   : cy
 * @datetime : 2015/12/01
 * @version  : 1.0.0
 */
;
(function(){

    var startTime = 0,
        endTime = 0,
        relTopArticleDatas = [],
        relCaseDatas = [],
        relQuestionDatas = [];

    /**
     * 判断用户是否登录，未登录禁用输入框
     */
    var if_login = function ()
    {
        try{
            var userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo()),//获取用户信息
                userid = userInfo.user_id,
                isLogin = false;
        }catch (err){
            console.log();
        }

        if(userid){
            $('body').find('.quiz').hide();
            isLogin = true;
        }else{
            $('body').find('.quiz').show();
            isLogin = false;
        }
        return isLogin;
    };

    if_login();

    /**
     * 获取案例列表数据
     */
    var getCaseData = function (lastId,me)
    {
        YZQ_UTILS.AJAXRequest(
            '/index/diary/getArticleLists.do',
            'POST',
            {last_id: lastId},
            function (data)
            {
                var caseDatas = data.data;
                if(caseDatas.length == undefined){
                    YZQ_COMMON.tips('已经全部加载完啦~');
                };
                for(var i = 0, len = caseDatas.length; i < len; i++){
                    caseDatas[i].img += '?imageView2/1/w/640/h/340/format/yjpg/q/70';
                    relCaseDatas.push(caseDatas[i]);
                }
                if(me){
                    me.resetload();
                };
            },
            function(error){
                //console.error('案例列表' + error.msg[0]);
                YZQ_COMMON.tips('案例列表' + error.msg[0]);
                if(me){
                    me.resetload();
                };
            }
        );
    };

    /**
     * 获取客服答疑信息
     * @param {Int} lastId 最后的id
     */
    var getQuestionData = function(lastId,me)
    {
        YZQ_UTILS.AJAXRequest(
            '/index/diary/getCircleAppCustomer.do',
            'POST',
            {
                last_id: lastId
            },
            function (data){
                var questionDatas = data.data;
                if(questionDatas.length == undefined){
                    YZQ_COMMON.tips('已经全部加载完啦~');
                };
                for(var i = 0, len = questionDatas.length; i < len; i++){
                    var questionData = questionDatas[i],
                        dataType = 'YYYY-MM-DD h:m:s';
                    questionData.add_time = YZQ_COMMON.formateTime(questionData.add_time, dataType);
                    questionData.hftime = YZQ_COMMON.formateTime(questionData.hftime, dataType);
                    if(questionData.userAvatar ==""||questionData.userAvatar == null){
                        questionData.userAvatar = "http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                    }
                    relQuestionDatas.push(questionData);
                }
                if(me){
                    me.resetload();
                };
            },
            function(error){
                //console.error('客服答疑' + error.msg[0]);
                YZQ_COMMON.tips('客服答疑' + error.msg[0]);
                if(me){
                    me.resetload();
                };
            }
        );
    };

    /**
     * 获取顶部文章信息
     */
    var getTopArticleData = function ()
    {
        YZQ_UTILS.AJAXRequest(
            '/index/diary/getCircleAppArticle.do',
            'POST',
            {},
            function (data){
                data.data.img += "?imageView2/1/w/640/h/340/format/yjpg/q/70";
                relTopArticleDatas.push(data.data);
            },
            function(error){
                console.log(error);
            }
        );
    };

    getTopArticleData();
    getQuestionData();
    getCaseData();

    /**
     * 获取当前时间
     * @return 'YYYY-MM-DD hh:mm:ss'格式的时间
     */
    var getCurrentDate = function()
    {
        var date = new Date();
        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())+ ':';
        s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

        return Y + M + D + h + m + s;
    };

    /**
     * 发送回复消息
     */
    var sendReplayInfo = function (replayContent)
    {
        var userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
        var userid = userInfo.user_id;
        var username =userInfo.nick_name;
        var useravatar = userInfo.avatar;
        YZQ_UTILS.AJAXRequest(
            '/index/diary/setCircleAppCustomer.do',
            'POST',
            {
                user_id: userid,
                content: replayContent
            },
            function (data){
                var sendInfo = {};
                sendInfo.add_time = getCurrentDate();
                sendInfo.content = replayContent;
                sendInfo.status = '0';
                sendInfo.userName = username;//alert("username是"+username);
                sendInfo.userAvatar = useravatar;//alert('useravatars是'+useravatar);
                sendInfo.user_id = userid;
                relQuestionDatas.unshift(sendInfo);
                YZQ_COMMON.tips("提问成功! 小惠将尽快回复您哒~");
            },
            function(error){
                console.log(error);
            }
        );
    };

    var vm = new Vue({
        el: '#people',
        data:{
            caseDatas: relCaseDatas,
            questionDatas: relQuestionDatas,
            topArticleData: relTopArticleDatas
        }
    });

    /**
     * 滑动加载数据
//     */
//    var ScrollLoadData = function () {
//
//        $('.ask').dropload({
//            scrollArea : window,
//            loadDownFn : function(me){
//                var last_dayi_id = $('.people .dayi').find('li:last').data('id'),
//                    last_case_id = $('.people .anli').find('li:last').data('titleid');
//                if($(".tab-top").find("span").eq(0).hasClass("active") == true){
//                    getCaseData(last_case_id,me);
//                }
//                if($(".tab-top").find("span").eq(1).hasClass("active") == true){
//                    getQuestionData(last_dayi_id,me);
//                }
//            }
//        });
//    }();

    /**
     * 注册‘发送’按钮的点击事件
     */
    var registerSendClickListener = function (){
        $('.people').on('click','.op-bot button',function (){
            var userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
            var $replayContent = $('.people').find('.wrap-input input');

            if($replayContent.val().length){
                sendReplayInfo($replayContent.val());
                $replayContent.val('');
            }
        });
    }();

    /**
     * 注册‘发送’文本框的点击事件
     */
    var registerSendInputClickListener = function (){
        $('.op-bot').on('focus', 'input', function (){
            $(this).parent().parent().css('position', 'absolute');
            if(!if_login()){
                $('body').find('.op-bot input')[0].blur();
                $('body').find('.op-bot .quiz').trigger('click');
            }
        });
    }();

    /**
     * 注册未登录情况下，盖在文本框上面的div的点击事件
     */
    var registerNoLoginClickListener = function(){
        $('body').on('click', '.quiz', function (){
            if(if_login()){
                $('body').find('.op-bot input')[0].focus();
            }else {
                HZ_APP_JSSDK.userloginjump();
            }
        });
    }();

    /**
     * 案例详情跳转
     * @param {Object} caseDetail 案例详情对象
     */
    var jumpCaseDetailPage = function (titleId, title)
    {
        var page = 'article.html?';

        page += 'id=' + titleId;
        page += '&pageid=200075';
//        location.href = page;

        var data = {
            baseurl:  WEB_CONFIG.NATIVE_JUMP(),
            page: page,
            title: title,
            isthide: false,
            isbhide: true,
            isfull: false,
            iconright : 0
        };
        YZQ_UTILS.pageSwitchMethod(data);
    };

    /**
     * 注册顶部图片获取详情的点击事件
     */
    var registerTopArticleClickListener = function (){
        $('.people').on('click', '.photo', function (){
            var titleId = $(this).data('titleid'),
                title = $(this).data('title');
            jumpCaseDetailPage(titleId, title);
        });
    }();

    /**
     * 注册‘案例’获取详情的点击事件
     */
    var registerDetailClickListener = function (){
        $('.people').on('click','.anli li',function (){
            var titleId = $(this).data('titleid'),
                title = $(this).data('title');
            jumpCaseDetailPage(titleId, title);
        });
    }();

    /**
     * 注册‘客服答疑’‘更多案例’的切换监听事件
     */
    var registerClickListener = function ()
    {
        $(".tab-top .btn-anli").click(function(){
            $(this).addClass("active");
            $(".btn-dayi").removeClass("active");
            $(".dayi").css("display","none");
            $(".anli").css("display","block");
            $(".op-bot").hide();
        })
        $(".tab-top .btn-dayi").click(function(){
            $(this).addClass("active");
            $(".btn-anli").removeClass("active");
            $(".dayi").css("display","block");
            $(".anli").css("display","none");
            $(".op-bot").show();
        })
    }();

    /**
     * 点击头像跳转到个人主页
     */
    $('.dayi').on('click','.user-img',function (){
        var userId = $(this).data('userid'),
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

    //埋点上报
    var reportPoint = (function(){
        //顶部
        $('body').on('click','.pic',function(){
            var pointid = $(this).data('pointid');
            YZQ_MONITOR.pointClick(pointid);
        });
        //输入框
        $('body').on('click','.op-bot input',function(){
            var pointid = $(this).data('pointid');
            YZQ_MONITOR.pointClick(pointid);
        });
        //发送
        $('body').on('click','.op-bot button',function(){
            var pointid = $(this).data('pointid');
            YZQ_MONITOR.pointClick(pointid);
        });
        //客户答疑
        $('body').on('click','.btn-dayi',function(){
            var pointid = $(this).data('pointid');
            YZQ_MONITOR.pointClick(pointid);
        });
        //更多案例
        $('body').on('click','.btn-anli',function(){
            var pointid = $(this).data('pointid');
            YZQ_MONITOR.pointClick(pointid);
        });
        //更多案例封面
        $('body').on('click','.anli li',function(){
            var pointid = $(this).data('pointid');
            YZQ_MONITOR.pointClick(pointid);
        });

    })();


}());