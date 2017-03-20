/**
 * Created by daikui on 2015/11/25.
 * namespace: YZQ_BEAUTIFUL
 * use: BEAUTIFUL.HTML
 * @author   : DJ
 * @datetime : 2015/11/26
 * @version  : 1.0.0
 */
;
(function(){
    var pagenum = 1;//记录
    var reldata = new Array();//绑定数据的数组
    var choosestyle ='';
    var choosespace ='';
    var chooseohter ='';
    var chooseroom ='';
    var imgtitle = "";//点开的图片标题
    var imgdigest = "";//点开的图片介绍
    var imgurl = "";//点开的图片地址
    //获取装修美图专辑
    var getGalleryData = function(_page, _room_style, _room_space, _room_part, _room_type){
        YZQ_UTILS.AJAXRequest(
            '/index/diary/getCircleAppSketchAlbum.do',
            'post',
            {
                page:   _page,
                room_style: _room_style,
                room_space: _room_space,
                room_part:  _room_part,
                room_type:  _room_type
            },
            function(result){
                pagenum++;
                var _result = result.data.list;
                for (i=0; i<_result.length; i++){
                    var reput = result.data.list[i];
                    if(reput.img_url == null || reput.img_url == ""){
                        reput.img_url = "http://hzserver-10006163.image.myqcloud.com/9d4ccbe5-b16f-44ae-96f8-44539de2bb34?max_age=19830212&d=20151230193947";
                    }else if(reput.img_url.indexOf("hzyzq") >= 0) {
                        reput.img_url +="/wlist?max_age=19830212&d=20151230193947";
                    }
                    var _gallery = _result[i];
                    reldata.push(_gallery);
                }
                //lazyload();

                //console.log(reldata);
            }
        );
    }

    //获取装修美图筛选条件
    var getGalleryStyle = function(_type){
        YZQ_UTILS.AJAXRequest(
            '/index/diary/getXgtSearch.do.do',
            'POST',
            {
                type:  _type//_type //参数 type 1:风格 ，2：空间，3：局部，4：户型
            },
            function(result){
                if(_type==2){
                    new Vue({
                        el: '.space_List',
                        data:{
                            datas:result.data
                        }
                    });
                }if(_type==1){
                    new Vue({
                        el: '.type_List',
                        data:{
                            datas:result.data
                        }
                    });
                }if(_type==3){
                    new Vue({
                        el: '.other_List',
                        data:{
                            datas:result.data
                        }
                    });
                }if(_type==4){
                    new Vue({
                        el: '.room_List',
                        data:{
                            datas:result.data
                        }
                    });
                }
            }
        )
    };
    $(document).ready(function() {
        $(".drop li").click(function() {
            $(".screen").addClass("show");
        });
        $(".screen").click(function() {
            $(this).removeClass("show");
            $('#typeList li').removeClass("current");
            $('#typeList li').find('i').removeClass('icon-on').addClass('icon-under');
        });
    });
    //点击事件
    var _li = $('.drop b');
    _li.click(function(event){
        YZQ_MONITOR.pointClick(event);//埋点上报
        var _rel = $(this).data('type');
        _li.parent().removeClass('current');
        _li.siblings('i').removeClass('icon-on').addClass('icon-under');
        $(this).parent().addClass('current');
        $(this).siblings('i').removeClass('icon-under').addClass('icon-on');
        getGalleryStyle(_rel);
        $('.clearfix').hide();
        $('#'+($(this).data('ul'))).show();
    });
    $('.c-gray').on("click","li",function(){
        $('#typeList li').removeClass('current');
        $('#typeList').find('i').removeClass('icon-on').addClass('icon-under');
        var typeclass=$(this).parent().data('rel');
        var _value = $(this).find('span').text();
        var valueid = $(this).data('chooseid');
        $('#'+typeclass).text(_value);
        $('#'+typeclass).data("valueid",valueid);
        choosestyle =$('#_type').data('valueid');
        choosespace =$('#_space').data('valueid');
        chooseohter =$('#_other').data('valueid');
        chooseroom =$('#_room').data('valueid');
        reldata.splice(0,reldata.length);
        getGalleryData("", choosestyle, choosespace, chooseohter, chooseroom);
        //lazyload();
    });

    getGalleryData(pagenum);//第一次进入时加载第一屏数据
    //初始化vjs
    var vm = new Vue({
        el: '.js_gallery',
        data:{
            datas:reldata
        }
    });
    //处理用户ID
    var getUserId = function(){
        try{
            var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());
            _user_id = _userInfo.user_id;
            if(_user_id == "" || _user_id == null){
                var _user_id = _userInfo.machineid;
                return _user_id;
            }else{
                return _user_id;
            }
        }catch(e){
            return false;
        }
    };
    //点击图片打开图片详情页
    var GetImgList =function(){
        //点击对应图片事件
        $("body").on("click",".pic-list div",function(event){
            YZQ_MONITOR.pointClick(event);//埋点上报
            var GetImgInfo = function(imglistID,_id){
                YZQ_UTILS.AJAXRequest(
                    '/index/diary/getCircleAppSketch.do',
                    'post',
                    {
                        album_id :imglistID,
                        user_id:_id
                    },
                    function(result){

                        imgtitle = "惠装比装修公司省40%";//点开的图片标题
                        imgdigest = "我在惠装APP发现一张超棒的装修效果图分享给你";//点开的图片介绍
                        imgurl = result.data.list[0].img_url;
                        //加幻灯片外部结构
                        var ulstr = '<div class="flexslider"><ul class="slides"></ul></div>';
                        $('.foot').append(ulstr);
                        //添加li元素到DOM中
                        for(var i=0;i<result.data.list.length;i++){
                            var reput = result.data.list[i];
                            if(reput.img_url == null || reput.img_url == ""){
                                reput.img_url = "http://hzserver-10006163.image.myqcloud.com/9d4ccbe5-b16f-44ae-96f8-44539de2bb34?max_age=19830212&d=20151230193947";
                            }else if(reput.img_url.indexOf("hzyzq") >= 0) {
                                reput.img_url +="/normal?max_age=19830212&d=20151230193947";
                            }
                            var str = '';
                            str += '<li style="background:url('+YZQ_COMMON.modifyImgSource(reput.img_url)+') center no-repeat;background-size:contain;height:100%;" id="'+(i+1)+'" img-id="'+reput.id+'"></li>';
                            //拼接结果
                            $(".slides").append(str);
                        }
                        //开启遮罩，显示幻灯片
                        $("html,body").addClass("all-wrap");
                        $(".photos-detail").css("display","block");
                        $('.drop').hide();
                        //更改图片总数的数字
                        $('.right-sp2').text(result.data.list.length);
                        //判断首图是否点赞
                        if(result.data.list[0].is_prase == "1"){
                            $("#js_Praise").removeClass("zan").addClass("yizan");
                        }
                        else{
                            $("#js_Praise").removeClass("yizan").addClass("zan");
                        }
                        //翻页回调函数
                        $('.flexslider').flexslider({
                            animation: "slide",
                            directionNav: true,
                            pauseOnAction: true,
                            controlNav:false,
                            slideshow:false,
                            animationSpeed:300,
                            after :function(){
                                var _id = $('.flex-active-slide').attr('id');
                                $('.right-sp1').text(_id+"/");
                                //翻页回调函数,判断是否点赞
                                getIsPraise();
                            }
                        })
                    },
                    function(error){
                        console.log(error);
                    }
                );
            };

            var imglistID =$(this).data('album_id');
            var _user_id = getUserId();
            GetImgInfo(imglistID,_user_id);
            //翻页回调函数拉取新的数据
            var getIsPraise = function(){
                YZQ_UTILS.AJAXRequest('/index/diary/getCircleAppSketch.do',
                    "POST",
                    {
                    album_id:imglistID,
                    user_id:_user_id
                    },
                    function(result){

                        var img_id = $('.flex-active-slide').attr('id');
                        imgurl = result.data.list[img_id-1].img_url;
                        if(result.data.list[img_id-1].is_prase == "1"){
                            $("#js_Praise").removeClass("zan").addClass("yizan");
                        }else{
                            $("#js_Praise").removeClass("yizan").addClass("zan");
                    }
                });
            };
        });
        //取消返回点击事件
        $("#js_slider_back").on("click",function(){
            $("html,body").removeClass("all-wrap");
            $(".photos-detail").css("display","none");
            $('.flexslider').remove();
            $('.drop').show();
            $('.right-sp1').text("1/");
        });
        //点赞
        $("#js_Praise").on("click",function(event){
            YZQ_MONITOR.pointClick(event);//埋点上报
            var sendIsPraise = function(){
                var _img_id = $(".flexslider").find(".flex-active-slide").attr("img-id");
                var _userid= getUserId();
                YZQ_UTILS.AJAXRequest('/index/Card/praise.do', "POST", {
                    id:_img_id,
                    user_id:_userid,
                    type:4
                },function(result){
                    $("#js_Praise").removeClass("zan").addClass("yizan");
                },function(error){

                });
            }();
        });

    }();
    //懒加载
    var lazyload = function(){
        $("div.pic").lazyload({
            effect : "fadeIn",
            event: "scrollstop"
        });
    };
    //分享点击执行
    $("#js_share").on("click",function(event){
        YZQ_MONITOR.pointClick(event);//埋点上报
        $(".mod-share").css("display","block");
    });
    //关闭分享
    $('.mod-share').click(function(){
        $('.mod-share').css("display","none");
    });
    $('.wrap-share').click(function(){
        event.stopPropagation();
    });
    //微信好友分享
    $('#js_shareWxFriends').click(function(event){
        YZQ_MONITOR.pointClick(event);//埋点上报
        var _platform ="wechat";
        Share(_platform);
    });
    //
    $('#js_shareWXSocials').click(function(event){
        YZQ_MONITOR.pointClick(event);//埋点上报
        var _platform ="wechatmoment";
        Share(_platform);
    });
    $('#js_sharSina').click(function(event){
        YZQ_MONITOR.pointClick(event);//埋点上报
        var _platform ="sina";
        Share(_platform);
    });

    //分享
    var Share = function(platform){
        var obj = {
            platform: platform,
            imageurl: imgurl,
            text: imgdigest,
            title: imgtitle,
            url: imgurl,
            site: imgurl,
            siteurl: imgurl,
            titleurl: imgurl
        };
        HZ_APP_JSSDK.shareToDifPlatform(JSON.stringify(obj));
    };
    //$(window).on('load',lazyload);
    //滑动加载数据
    var ScrollLoadData =function(){
        YZQ_COMMON.ScrollLoadData(function text(){
            getGalleryData(pagenum, choosestyle, choosespace, chooseohter, chooseroom);
        }) ;
    }();
})();