/**
 * Created by cy on 2015/11/22
 * namespace: YZQ_MY_PAGE
 * use: MY_PAGE.HTML
 * @author   : cy
 * @datetime : 2015/11/22
 * @version  : 1.0.0
 */
var MyPage = function ()
{
    var userInfoDatas = [],
        userCardDatas = [],
        userDiaryDatas = [],
        parseobj = YZQ_COMMON.parseURI().params,
        userid = parseobj.userid;
    /**
     * 添加‘帖子’‘日记’标签的点击切换功能
     */
    $('.tab').find('li').click(function (){
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
        var name = $(this).find('span').text();
        removeAllClassName();
        if(name == '帖子'){
            $(".tiezi").css("display", "block");
            $(".riji").css("display", "none");
        }else {
            $(".tiezi").css("display", "none");
            $(".riji").css("display", "block");
        }
        $(this).addClass('active');
        $(this).find('i').addClass('tab-icon');
    });
    /**
     * 移除‘帖子’‘日记’标签的classname
     */
    var removeAllClassName = function ()
    {
        $('.tab').find('li').each(function (){
            $(this).removeClass('active');
            $(this).find('i').removeClass('tab-icon');
        });
    };
    /**
     * 获取用户信息
     * @param {Int} userId 用户id
     */
    var getUserInfoData = function (userId)
    {
        YZQ_UTILS.AJAXRequest(
            '/index/Index/getUserInfo.do',
            'POST',
            {
                user_id: userId
            },
            function (data) {
                data.data.gender = Number(data.data.gender) == 2 ? '<span class="female"></span>' : '<span class="ico-male"></span>';
                data.data.avatar = data.data.avatar ? data.data.avatar : 'http://hzimg.huizhuang.com/hzone_v2/img/head-users.png';
                data.data.userVip = Number(data.data.userVip) ? '<span class="ico-vip"></span>' : '';
                userInfoDatas.push(data.data);
            },
            function (error) {
                console.log(error);
            }
        );
    };
    /**
     * 获取用户帖子数据
     * @param {Int} userId 用户id
     */
    var getUserCardData = function (userId)
    {
        YZQ_UTILS.AJAXRequest(
            '/index/Card/userCardList.do',
            'POST',
            {
                user_id: userId
            },
            function (data) {
                if (!data.data.length) {
                    $('.tiezi ul').hide();
                    $('.note').show();
                    return;
                };

                for(var i = 0, len = data.data.length; i < len; i ++){
                    var card = data.data[i],
                        dataType = 'YYYY-MM-DD';
                    card.release_time = YZQ_COMMON.formateTime(card.release_time, dataType);
                    card.title = card.title.substr(0,25);

                    if(card.imgs){
                        if(card.imgs.img_url == null || card.imgs.img_url == ""){
                            card.imgs.img_url = "http://hzserver-10006163.image.myqcloud.com/9d4ccbe5-b16f-44ae-96f8-44539de2bb34?max_age=19830212&d=20151230193947";
                        }else if(card.imgs.img_url.indexOf("hzyzq") >= 0) {
                            card.imgs.img_url +="/thumbnail?max_age=19830212&d=20151230193947";
                        }
                    }

                    if(card.title.length >= 25){
                        card.title += '...';
                    }
                    userCardDatas.push(data.data[i]);
                }
            },
            function (error) {
                console.log(error);
            }
        );
    };
    /**
     * 获取用户日记数据
     * @param {Int} userId 用户id
     */
    var getUserDiaryData = function (userId)
    {
        YZQ_UTILS.AJAXRequest(
            '/index/Diary/userDiaryList.do',
            'POST',
            {
                user_id: userId
            },
            function (data) {
                if(!data.data.id){
                    $('.riji ul').hide();
                    $('.diary').show();
                    return;
                }

                data.data.info.avatar = data.data.info.avatar ? data.data.info.avatar : 'http://hzimg.huizhuang.com/hzone_v2/img/head-users.png';

                var dataType = 'YYYY-MM-DD';
                data.data.date = YZQ_COMMON.formateTime(data.data.date, dataType);
                data.data.info.gender = Number(data.data.info.gender) == 2 ? '<i class="xingbie-nv"></i>' : '<i class="xingbie-nan"></i>';
                data.data.info.userVip = Number(data.data.info.userVip) ? '<span class="ico-vsmall"></span>' : '';

                for(var i = 0, len = data.data.imgs.length; i < len; i++){
                    if(data.data.imgs){
                        if(data.data.imgs[i] == null || data.data.imgs[i] == ""){
                            data.data.imgs[i] = "http://hzserver-10006163.image.myqcloud.com/9d4ccbe5-b16f-44ae-96f8-44539de2bb34?max_age=19830212&d=20151230193947";
                        }else if(data.data.imgs[i].indexOf("hzyzq") >= 0) {
                            data.data.imgs[i] +="/thumbnail?max_age=19830212&d=20151230193947";
                        }
                    }
                }

                for(var j = 0, praiseLen = data.data.praise.length; j < praiseLen; j++){
                    if(!data.data.praise[j].headImg){
                        data.data.praise[j].headImg = 'http://hzimg.huizhuang.com/hzone_v2/img/head-users.png';
                    }
                }

                userDiaryDatas.push(data.data);
            },
            function (error) {
                console.log(error);
            }
        );
    };

    getUserInfoData(userid); //获取用户信息
    getUserCardData(userid); //获取用户帖子数据
    getUserDiaryData(userid); //获取用户日记数据

    /**
     * 加载数据
     * @param {void} 无
     */
    var vm = new Vue({
        el: '#myPage',
        data: {
            userInfoDatas: userInfoDatas,
            userCardDatas: userCardDatas,
            userDiaryDatas: userDiaryDatas
        },
        methods: {
            cardClickHandler: function(id, title){
                bindCardClickEvent(id, title);
            },
            diaryClickHandler: function(gender, headimg, nick_name, style, type){
                bindDiaryClickEvent(gender, headimg, nick_name, style, type);
            }
        }
    });

    $('body').on('click','.clearfix li',function(){
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
    });
    $('body').on('click','.riji-center',function(){
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
    });
    /**
     * 绑定返回上一页的点击事件
     * @param {void} 无
     */
    $('body').on('click', '.user-info .link-back', function (){
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
        HZ_APP_JSSDK.goBack('true');
    });

    /**
     * 绑定帖子列表的点击事件
     * @param {void} 无
     */
    var bindCardClickEvent = function (id, title)
    {
        var junmpurl = 'discuss-de.html?card_id=' + id+'&userid='+userid;
//        location.href = junmpurl;
        var data = {
            baseurl:  WEB_CONFIG.NATIVE_JUMP(),
            page:   junmpurl,
            title:  '详情',
            isthide:    false,
            isbhide:    true,
            isfull:     false,
            iconright : 0
        };
        YZQ_UTILS.pageSwitchMethod(data);
        return false;
    };
    /**
     * 绑定记列表的点击事件
     * @param {void} 无
     */
    var bindDiaryClickEvent = function (gender, headimg, nick_name, style, type)
    {
        gender = gender=='<i class="xingbie-nan"></i>' ? 1 : 2;
        var junmpurl = "diary-de.html?user_id="+userid;
//            location.href = junmpurl;
        var data = {
            baseurl:  WEB_CONFIG.NATIVE_JUMP() ,
            page:   junmpurl,
            title:  '日记详情',
            isthide:    false,
            isbhide:    true,
            isfull:     false,
            iconright : 0
        };
        YZQ_UTILS.pageSwitchMethod(data);
        return false;
    };
}();