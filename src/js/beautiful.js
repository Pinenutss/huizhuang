/**
 * Created by daikui on 2015/11/25.
 * namespace: YZQ_BEAUTIFUL
 * use: BEAUTIFUL.HTML
 * @author   : zwp
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
    var imgDownUrl = '';//下载的图片地址
    var recommend = new  Array();//推荐列表数据
    var bgimg = '';//推荐列表背景
    //获取装修美图专辑
    var getGalleryData = function(_page, _room_style, _room_space, _room_part, _room_type,me){
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
                console.log(result);
				pagenum++;                
                var _result = result.data.list;
				if(_result.length == undefined){
					YZQ_COMMON.tips('已经全部加载完啦~');
					};
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
                console.log(reldata.length);
				if(me){
					me.resetload();
                }

            },
            function(result){
				YZQ_COMMON.tips(result.msg);
				if(me){
					me.resetload();
					};
			});
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
            $(".screen").addClass("show");
            $(".drop").removeClass("updown");
        });
        $(".screen").click(function() {
            $(this).removeClass("show");
            $(".drop").addClass("updown");
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
        $('.drop').removeClass('updown');
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
            //return false;
            return 111;
        }
    };
    //点击图片打开图片详情页
    var GetImgList =function(){
        //点击对应图片事件
        $("body").on("click",".pic-list div",function(event){
            var num = $('.pic-list div').length;
            console.log($(this).data('pointid'));
            for(var k=0; k<num; k++){
                
            }
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
                        imgDownUrl = result.data.list[0].img_url;
                        $('#js_downImg').attr("href",imgDownUrl);
                        var pswpElement = document.querySelectorAll('.pswp')[0];
                        //添加图片
                        var arr = new Array();
                        for(var i=0;i<result.data.list.length;i++){
                            var reput = result.data.list[i];
                            if(reput.img_url == null || reput.img_url == ""){
                                reput.img_url = "http://hzserver-10006163.image.myqcloud.com/9d4ccbe5-b16f-44ae-96f8-44539de2bb34?max_age=19830212&d=20151230193947";
                            }else if(reput.img_url.indexOf("hzyzq") >= 0) {
                                reput.img_url +="/wlist?max_age=19830212&d=20151230193947";
                            }
                            arr[i]={
                                //src: reput.img_url,
                                w: 600,
                                h: 400,
                                title:reput.digest,
                                html: '<table><tr><td><img class="pswp__img" src="'+reput.img_url+'" style=""  img-id ='+reput.id+'></td></tr></table>'
                            };

                        }
                        var imgfirst = '';
                        var imgsecond = '';
                        var imgfirstId = '';
                        var imgsecondId = '';
                        var imgbg = result.data.list[0].img_url;
                        var imgLength = '';
                        bgimg=imgbg;
                        //新加最后的感兴趣图片
                        YZQ_UTILS.AJAXRequest(
                            '/index/diary/getCircleAppSketchAlbum.do',
                            'post',
                            {
                                page:   "",
                                room_style: choosestyle,
                                room_space: "",
                                room_part:  "",
                                room_type:  ""
                            },
                            function(result){
                                try{
                                     imgfirst = result.data.list[0].img_url;
                                     imgsecond = result.data.list[1].img_url;
                                     imgfirstId = result.data.list[0].album_id;
                                     imgsecondId = result.data.list[1].album_id;

                                    //添加感兴趣图片
                                    var imgdata=new Array();
                                    for(k=0;k<result.data.list.length;k++){
                                        if (imglistID != result.data.list[k].album_id){
                                            var data ={};
                                            data.img_url=result.data.list[k].img_url;
                                            data.album_id = result.data.list[k].album_id;
                                            data.name =result.data.list[k].name;
                                            imgdata.push(data);
                                        }
                                    }
//                                    var Htmlstr = {
//                                        html:
//                                            ' <div class="bg" style="background-image:url('+imgbg+');">'+
//                                            '<div class="header-cont">' +
//                                            '<p>喜欢这套设计？</p>' +
//                                            '<span>让惠装帮你把梦想变为现实</span>' +
//                                            '<button class="js_booking" data-pointid="20007388">立即预约</button></div></div>' +
//                                            '<div class="cont-title">' +
//                                            '<p><span class="icon-lovexin"></span>你可能还喜欢</p>' +
//                                            '</div>' +
//                                            '<div class="cont"><ul>' +
//                                            '<li><button class="js_imgjump" style="display: block" data-album_id="'+imgdata[0].album_id+'"><img  src="'+imgdata[0].img_url+'" alt=""/></button><p>'+imgdata[0].name+'</p></li> ' +
//                                            '<li><button class="js_imgjump" style="display: block" data-album_id="'+imgdata[1].album_id+'"><img  src="'+imgdata[1].img_url+'" alt=""/></button><p>'+imgdata[1].name+'</p></li>' +
//                                            '</ul></div></div>'
//
//                                    };
//                                    arr.push(Htmlstr);
                                    imgLength = arr.length;
                                    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
                                    gallery.init();
                                    gallery.updateSize(true);
                                    //活动到最后关闭当前幻灯片
                                    gallery.listen('afterChange', function(e) {
                                        getIsPraise();
                                        if(gallery.getCurrentIndex() == (gallery.items.length - 1)){
                                            gallery.listen('beforeChange', function(e) {
                                                gallery.destroy();
                                                getLastImg();
                                            })
                                        }
                                    });
                                    gallery.listen('close', function() {
                                        HZ_APP_JSSDK.setImageShowForFull("0");
                                    });


                                    //点击感兴趣的图片
//                                    $('body').on("click",'.js_imgjump',function(){
//                                        //点击获取图片集
//                                        var click_arr = new Array();
//                                        var album_id = $(this).data('album_id');
//                                        YZQ_UTILS.AJAXRequest('/index/diary/getCircleAppSketch.do',
//                                            "POST",
//                                            {
//                                                album_id:album_id,
//                                                user_id:_user_id
//                                            },
//                                            function(result){
//                                                imgDownUrl =result.data.list[0].img_url;
//                                                $('#js_downImg').attr("href",imgDownUrl);
//                                                for(var i=0;i<result.data.list.length;i++){
//                                                    var reput = result.data.list[i];
//                                                    if(reput.img_url == null || reput.img_url == ""){
//                                                        reput.img_url = "http://hzserver-10006163.image.myqcloud.com/9d4ccbe5-b16f-44ae-96f8-44539de2bb34?max_age=19830212&d=20151230193947";
//                                                    }else if(reput.img_url.indexOf("hzyzq") >= 0) {
//                                                        reput.img_url +="/wlist?max_age=19830212&d=20151230193947";
//                                                    }
//                                                    click_arr[i]={
//                                                        //src: reput.img_url,
//                                                        w: 600,
//                                                        h: 400,
//                                                        title:reput.digest,
//                                                        html: '<table><tr><td><img class="pswp__img" src="'+reput.img_url+'" style=""  img-id ='+reput.id+'></td></tr></table>'
//                                                    };
//                                                    gallery.items.push(click_arr[i]);
//                                                }
//                                                gallery.items.splice(0,(imgLength));
//                                                imgbg = result.data.list[0].img_url;
//                                                //新加最后的感兴趣图片
//                                                YZQ_UTILS.AJAXRequest(
//                                                    '/index/diary/getCircleAppSketchAlbum.do',
//                                                    'post',
//                                                    {
//                                                        page:   "",
//                                                        room_style: choosestyle,
//                                                        room_space: "",
//                                                        room_part:  "",
//                                                        room_type:  ""
//                                                    },
//                                                    function(result){
//                                                        //添加感兴趣图片
//                                                        var imgdata=new Array();
//                                                        for(k=0;k<result.data.list.length;k++){
//                                                            if (album_id != result.data.list[k].album_id){
//                                                                var data ={};
//                                                                data.img_url=result.data.list[k].img_url;
//                                                                data.album_id = result.data.list[k].album_id;
//                                                                data.name =result.data.list[k].name;
//                                                                imgdata.push(data);
//                                                            }
//                                                        }
//                                                        var Htmlstr = {
//                                                            html:
//                                                                ' <div class="bg" style="background-image:url('+imgbg+');">'+
//                                                                '<div class="header-cont">' +
//                                                                '<p>喜欢这套设计？</p>' +
//                                                                '<span>让惠装帮你把梦想变为现实</span>' +
//                                                                '<button class="js_booking" data-pointid="20007388">立即预约</button></div></div>' +
//                                                                '<div class="cont-title">' +
//                                                                '<p><span class="icon-lovexin"></span>你可能还喜欢</p>' +
//                                                                '</div>' +
//                                                                '<div class="cont"><ul>' +
//                                                                '<li><button class="js_imgjump" style="display: block" data-album_id="'+imgdata[0].album_id+'"><img  src="'+imgdata[0].img_url+'" alt=""/></button><p>'+imgdata[0].name+'</p></li> ' +
//                                                                '<li><button class="js_imgjump" style="display: block" data-album_id="'+imgdata[1].album_id+'"><img  src="'+imgdata[1].img_url+'" alt=""/></button><p>'+imgdata[1].name+'</p></li>' +
//                                                                '</ul></div></div>'
//
//                                                        };
//                                                        gallery.items.push(Htmlstr);
//                                                        imgLength = arr.length;
//                                                        gallery.updateSize(true);
//                                                        gallery.goTo(0);
//                                                        gallery.listen('close', function() {
//                                                            HZ_APP_JSSDK.setImageShowForFull("0");
//                                                        });
//                                                    },
//                                                    function(err){
//
//                                                    })
//
//                                            },
//                                            function(err){
//                                                console.log(err);
//                                            }
//                                        );
//                                    });

                                }catch (err){
                                    console.log(err);
                                }
                            },
                            function(err){
                                console.log(err);
                            }
                        );
                        //初始化
                        var items = arr;
                        var options = {
                            index: 0 ,
                            closeOnVerticalDrag:false,
                            isClickableElement: function(el) {
                                return el.tagName === 'BUTTON';
                            },
                            focus:true
                        };
                        getIsPraise();
                        HZ_APP_JSSDK.setImageShowForFull("1");
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
                var currentid=GetImgId();
                if(currentid ==undefined){
                    $("#js_Praise").removeClass("yizan");
                    return;
                }
                YZQ_UTILS.AJAXRequest('/index/diary/getCircleAppSketch.do',
                    "POST",
                    {
                    album_id:imglistID,
                    user_id:_user_id
                    },
                    function(result){
                        var imgdata = result.data.list;
                        for(var i=0;i<=imgdata.length;i++){
                            var reput = imgdata[i];
                            try{
                                if(reput.id ==currentid){
                                    if(reput.is_prase ==1){
                                        $("#js_Praise").addClass("yizan");
                                    }else{
                                        $("#js_Praise").removeClass("yizan");
                                    }
                                }
                            }catch (err){
                                console.log(err);
                            }
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
                var _img_id = GetImgId();
                if(_img_id == undefined){
                    return false;
                }
                var _userid= getUserId();
                YZQ_UTILS.AJAXRequest('/index/Card/praise.do', "POST", {
                    id:_img_id,
                    user_id:_userid,
                    type:4
                },function(result){
                    $("#js_Praise").addClass("yizan");
                },function(error){

                });
            }();
        });

    }();

    //最后两张推荐图
    var getLastImg =function(){
       // var styleId = choosestyle ;//风格
        YZQ_UTILS.AJAXRequest('/index/Index/drawing.do', "POST", {
            styleId:choosestyle
        },
        function(result){
            for(i=0;i<2&&i<result.data.length;i++){
                result.data[i].bgimg =bgimg;//背景图
                recommend.push(result.data[i]);
            }
        },
        function(error){
            console.log(error);
        });


    };
    //初始化vjs
    var recommendData = new Vue({
        el: '#js_recommend',
        data:{
            datas:recommend
        }
    });


    //下单跳转
    $('body').on("click",'.js_booking',function(event){
        var obj =new Object();
        obj.source ="yzq_xiaoguotu";
        obj.pageid = "200073";
        obj.foremanid ="";
        HZ_APP_JSSDK.bookingJump(JSON.stringify(obj));
        YZQ_MONITOR.pointClick(event);//埋点上报
    });
    //懒加载
    var lazyload = function(){
        $("div.pic").lazyload({
            effect : "fadeIn",
            event: "scrollstop"
        });
    };
    //分享点击执行
    $("body").on("click",'#js_share',function(event){
        $('.bottom-photo').hide();
        $(".mod-share").css("display","block");
         YZQ_MONITOR.pointClick(event);//埋点上报
    });
    //关闭分享
    $('.mod-share').click(function(){
        $('.mod-share').css("display","none");
        $('.bottom-photo').show();
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
            url: "http://h5.huizhuang.com/phone/phone.html",
            site: "http://h5.huizhuang.com/phone/phone.html",
            siteurl: "http://h5.huizhuang.com/phone/phone.html",
            titleurl: "http://h5.huizhuang.com/phone/phone.html"
        };
        HZ_APP_JSSDK.shareToDifPlatform(JSON.stringify(obj));
    };
    //$(window).on('load',lazyload);
    //滑动加载数据
    var ScrollLoadData =function(){
        //YZQ_COMMON.ScrollLoadData(function text(){
        //   getGalleryData(pagenum, choosestyle, choosespace, chooseohter, chooseroom);
        //}) ;
		$('.pic-list').find("ul").dropload({
			scrollArea : window,
			loadDownFn : function(me){
				getGalleryData(pagenum, choosestyle, choosespace, chooseohter, chooseroom,me);
				}
			});
    }();


    var startY='';
    var moveEndY ='';
    var Y='';
    //顶部条吸顶效果
    $("body").on("touchstart", function(e) {
        startY = e.originalEvent.changedTouches[0].pageY;
    })
    $("body").on("touchmove", function(e) {
        moveEndY = e.originalEvent.changedTouches[0].pageY;
        Y = moveEndY - startY;
    });
    $("body").on("touchend", function(e) {
        if (Y > 0) {
            $('.updown').fadeIn();
        } else if (Y < 0) {
            $('.updown').fadeOut();
        }
    })

    //获取当前图片ID
    var GetImgId = function(){
        var pswp_container = $('.pswp__container').css('transform');
        var pswp_item_first = $('.pswp__item').eq(0).css('transform');
        var pswp_item_second = $('.pswp__item').eq(1).css('transform');
        var pswp_item_last = $('.pswp__item').eq(2).css('transform');
        var arr =new  Array();
        var arr_first =new  Array();
        var arr_second  =new  Array();
        var arr_last =new  Array();
        arr.push(pswp_container.split(","));
        arr_first.push(pswp_item_first.split(","));
        arr_second.push(pswp_item_second.split(","));
        arr_last.push(pswp_item_last.split(","));
        var num = Math.abs(parseInt(arr[0][4]));
        var num_arr_first = Math.abs(parseInt(arr_first[0][4]));
        var num_arr_second = Math.abs(parseInt(arr_second[0][4]));
        var num_arr_last = Math.abs(parseInt(arr_last[0][4]));
        var target='';//当前图片对应的id
        if(num == num_arr_first){
            target = $('.pswp__item').eq(0).find('img').attr('img-id');
            imgDownUrl = $('.pswp__item').eq(0).find('img').attr('src');
        }if(num == num_arr_second){
            target = $('.pswp__item').eq(1).find('img').attr('img-id');
            imgDownUrl = $('.pswp__item').eq(1).find('img').attr('src');
        }if(num == num_arr_last){
            target = $('.pswp__item').eq(2).find('img').attr('img-id');
            imgDownUrl = $('.pswp__item').eq(2).find('img').attr('src');
        }
        $('#js_downImg').attr("href",imgDownUrl);
        return target;
    }
//    $(document).ready(function(){});
//    setTimeout(function(){
//        scrollTo(0,1);
//    },5000);




})();