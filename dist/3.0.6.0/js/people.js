/**
 * Created by cy on 2015/12/01.
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
        var userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo()),//获取用户信息
            userid = userInfo.user_id,
            isLogin = false;

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
	var getCaseData = function (lastId)
    {
        YZQ_UTILS.AJAXRequest(
            '/index/diary/getArticleLists.do',
            'POST',
            {last_id: lastId},
            function (data)
            { 
                var caseDatas = data.data;
                for(var i = 0, len = caseDatas.length; i < len; i++){
                    relCaseDatas.push(caseDatas[i]);
                }
            },
            function(error){
                console.error('案例列表' + error.msg[0]);
            }
        );  
    };
    
    /**
     * 获取客服答疑信息
     * @param {Int} lastId 最后的id
     */
    var getQuestionData = function(lastId)
    {
          YZQ_UTILS.AJAXRequest(
            '/index/diary/getCircleAppCustomer.do',
            'POST',
            {
                last_id: lastId
            },
            function (data){ 
                var questionDatas = data.data;
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
            },
            function(error){
                console.error('客服答疑' + error.msg[0]);
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
                sendInfo.userName = username;
                sendInfo.userAvatar = useravatar;
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
     */
    var ScrollLoadData = function () {
        YZQ_COMMON.ScrollLoadData(function text() {
            var last_dayi_id = $('.people .dayi').find('li:last').data('id'),
                last_case_id = $('.people .anli').find('li:last').data('titleid');
            getQuestionData(last_dayi_id);
            getCaseData(last_case_id);
        });
    }();
    
    /**
     * 注册‘发送’按钮的点击事件
     */
    var registerSendClickListener = function (event){
        $('.people').on('click','.op-bot button',function (){
            YZQ_MONITOR.pointClick(event);//埋点上报
            var userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
            var $replayContent = $('.people').find('.wrap-input input');
            
            if($replayContent.val().length){
                sendReplayInfo($replayContent.val());
                $replayContent.val('');
            }
        });
    }();

    //输入框点击上报
    $('.wrap-input input').click(function(event){
        YZQ_MONITOR.pointClick(event);//埋点上报
    });

    /**
     * 注册‘发送’文本框的点击事件
     */
    var registerSendInputClickListener = function (){
        $('.op-bot').on('click','input',function (event){
            YZQ_MONITOR.pointClick(event);//埋点上报
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
            isbhide: false,
            isfull: false,
            iconright : 0
        };
        YZQ_UTILS.pageSwitchMethod(data);  
    };
    
    //注册顶部图片获取详情的点击事件
    /**
     * 发送回复消息
     */
    var registerTopArticleClickListener = function (){
        $('.people').on('click', '.pic', function (event){
            YZQ_MONITOR.pointClick(event);//埋点上报
            var titleId = $(this).data('titleid'),
                title = $(this).data('title');
            jumpCaseDetailPage(titleId, title);
        });
    }();
    
    /**
     * 注册‘案例’获取详情的点击事件
     */
    var registerDetailClickListener = function (){
        $('.people').on('click','.anli li',function (event){
            YZQ_MONITOR.pointClick(event);//埋点上报
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
        $(".tab-top .btn-anli").click(function(event){
            YZQ_MONITOR.pointClick(event);//埋点上报
            $(this).addClass("active");
            $(".btn-dayi").removeClass("active");
            $(".dayi").css("display","none");
            $(".anli").css("display","block");
            $(".op-bot").hide();
        })
        $(".tab-top .btn-dayi").click(function(event){
            YZQ_MONITOR.pointClick(event);//埋点上报
            $(this).addClass("active");
            $(".btn-anli").removeClass("active");
            $(".dayi").css("display","block");
            $(".anli").css("display","none");
            $(".op-bot").show();
        })
    }();
}());