/**
 * /**
 * Created by zwp on 2015/11/26
 * namespace: YZQ_DIARY-DE
 * use: DIARY.HTML
 * @author   : zwp
 * @datetime : 2015/11/23
 * @version  : 1.0.0
 */
;
(function() {
    var reldata = new Array(); //绑定数据的数组
    var GetNoteInfo = function(userid) {
        try{
            var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo()); //获取用户信息
            var viewId = _userInfo.user_id;
            var machine_id = _userInfo.machineid;
            //var viewId = 11;
            if (viewId == "" || viewId == null) {
                viewId = 0;
            }
        }catch (err){

        }
        YZQ_UTILS.AJAXRequest(
            '/index/Diary/getUserDiaryList.do',
            "post", {
                user_id: userid,
                viewId: viewId,//1,//viewId,
                machine_id: 111//machine_id
            },
            function(data) {
                var diary = data.data.diary;
                var arr_obj = new Array();
                //var des_arr;
                var des_arr = new Array();
                var nodes = data.data.node;
                //处理阶段
                $.each(nodes, function(index) {
                    var step = nodes[index];
                    arr_obj.push(step);
                });
                //处理显示顺序
                // des_arr  = arr_obj.reverse();//p8-p1
                des_arr.push(arr_obj[7]);
                des_arr.push(arr_obj[4]);
                des_arr.push(arr_obj[3]);
                des_arr.push(arr_obj[2]);
                des_arr.push(arr_obj[1]);
                des_arr.push(arr_obj[0]);
                des_arr.push(arr_obj[5]);
                des_arr.push(arr_obj[6]);
                for (var i = 0; i < des_arr.length; i++) {
                    var reput = des_arr[i];
                    reput.diaryReuput = []; //每个阶段对应的文章
                    reput.diaryImg = []; //每个阶段文章对应的图片
                    reput.prisearr = []; //每个文章是否点赞
                    reput.dairy = [];
                    if (reput.count != 0) {
                        reput.name = reput[0];
                        reput.count = (reput.count + "篇");
                        for (var j = 0; j < diary.length; j++) {
                            var diaryReuput = diary[j];



                            if (diaryReuput.zx_node == reput.id) {
                                var _type = "YYYY-MM-DD";
                                diaryReuput.add_time = YZQ_COMMON.formateTime(diaryReuput.add_time, _type);
                                // reput.diaryReuput.push(diaryReuput);
                                //处理日记图片
                                var img_leng = "";
                                if (diaryReuput.img.length > 0) {
                                    if (img_leng > 9) {
                                        img_leng = 9; //最多显示9张图片
                                    } else {
                                        img_leng = diaryReuput.img.length;
                                    }
                                    for (var k = 0; k < img_leng; k++) {
                                        var img_list = diaryReuput.img[k];
                                        reput.diaryImg.push(img_list);
                                    }
                                }
                                //处理最近拜访人(现在改为点赞人)
                                if (diaryReuput.praise.length > 0) {
                                    var len = "";
                                    if (diaryReuput.praise.length > 3) {
                                        len = 3;
                                    } else {
                                        len = diaryReuput.praise.length;
                                    }
                                    for (k = 0; k < len; k++) {
                                        if (diaryReuput.praise[k].headImg == null || diaryReuput.praise[k].headImg == "") {
                                            diaryReuput.praise[k].headImg = "http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                                        }
                                    }
                                    diaryReuput.praise.splice(3, diaryReuput.praise.length);


                                    reput.dairy.push(diaryReuput);
                                }else if(diaryReuput.praise.length == 0 && diaryReuput.praiseCount>0){
                                    var praiseCountLength = diaryReuput.praiseCount;
                                    if (praiseCountLength >3){
                                        praiseCountLength =3;
                                    }
                                    var praiseCountOj = {};
                                    for (j = 0; j < praiseCountLength; j++) {
                                        praiseCountOj.headImg = "http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                                        diaryReuput.praise.push(praiseCountOj);
                                    }
                                }
                                //处理是否点赞
                                if (diaryReuput.isPrase == 0) {
                                    diaryReuput.pridiv = "click-like";
                                    diaryReuput.word = "点赞";
                                } else {
                                    diaryReuput.pridiv = "click-like yet";
                                    diaryReuput.word = "已赞";
                                }
                                for (var n = 0; n < diaryReuput.img.length; n++) {
                                    if (diaryReuput.img[n] == null || diaryReuput.img[n] == "") {
                                        diaryReuput.img[n] = "http://hzserver-10006163.image.myqcloud.com/9d4ccbe5-b16f-44ae-96f8-44539de2bb34?max_age=19830212&d=20151230193947";
                                    } else {
                                        if (diaryReuput.img[n].indexOf("hzyzq") >= 0) {
                                            diaryReuput.img[n] += "/thumbnail?max_age=19830212&d=20151230193947";
                                        }else{
                                            diaryReuput.img[n] += "?imageView2/1/w/200/format/yjpg/q/70";
                                        }

                                    }
                                }
                                reput.prisearr.push(diaryReuput);
                                reput.prisearr.splice(1, reput.prisearr.length);
                                reput.dairy.splice(1, reput.dairy.length);

                                reput.diaryReuput.push(diaryReuput);


                            }

                        }



                        reldata.push(reput);
                    }
                }
                YZQ_COMMON.Loading(false, "");
            },
            function(error) {
                console.log(error);
            }
        )
    };

    //日记点赞
    var NotePrise = function() {
        $('body').on('click', '.click-like', function() {
            if($(this).attr('class') == "click-like"){
                try{
                    var pointid = $(this).data('pointid');
                    YZQ_MONITOR.pointClick(pointid); //埋点上报
                    $(this).addClass('yet');
                    $(this).find('.js_priseword').text("已赞");
                    var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo()); //获取用户信息
                    var user_id = _userInfo.user_id;
                    var machineid = _userInfo.machineid;
                    if (user_id == "" || user_id == null) {
                        user_id = 0;
                    }
                    // var user_id =1234;
                    var userheadimg = _userInfo.avatar;
                    if (userheadimg == "" || userheadimg == null) {
                        userheadimg = "http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                    }
                }catch (err){
                    console.log(err);
                }
                //如果没有赞过
                if ($(this).parent().find(".zan-list").length == 0) {
                    var str = "";
                    str += '<div class="zan-list">';
                    str += '<i class="head-img" style="background-image:url(' + userheadimg + ')"></i>';
                    str += '<span><b>1</b><span>赞</span></span>';
                    str += '  </div>';
                    $(this).parent().append(str);
                } else {
                    //赞过直接增加
                    //头像小于3个
                    var newimg = '<i class="head-img" style="background-image:url(' + userheadimg + ')"></i>';
                    if ($(this).parent().find(".zan-list i").length < 3) {
                        $(this).parent().find(".zan-list ").prepend(newimg);
                    } else {
                        //头像大于三个
                        $(this).parent().find(".zan-list i:last").remove();
                        $(this).parent().find(".zan-list ").prepend(newimg);
                    }
                    var num = $(this).parent().find('.zan-list b').text();
                    num++;
                    $(this).parent().find('.zan-list b').text(num);
                }
                var dairyid = $(this).data("diaryid");
                YZQ_UTILS.AJAXRequest(
                    '/index/Diary/praise.do',
                    "post", {
                        id: dairyid,
                        user_id: user_id,
                        type: 1,
                        machine_id: machineid
                    },
                    function(result) {
                        console.log(result)
                    },
                    function(error) {
                        console.log(error)
                    }
                )
            }



        });
    }();


    //  初始化vjs
    var vm = new Vue({
        el: '#dairylist',
        data: {
            datas: reldata
        }
    });
    //点击图片打开大图
    var GetImgList = function() {
        //点击对应图片事件
        $("body").on("click", ".pic-list li", function() {
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
            var regOther = new RegExp("/[imageView2/1/w/200/format/yjpg/q/70]/", "g"); //创建正则RegExp对象
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
                    } else if (imgSrc[n].style.backgroundImage.indexOf("file.huizhuang.com") >= 0) {
                        var imgurl = imgSrc[n].style.backgroundImage;
                        imglist.push(imgurl);
                    }else if(imgSrc[n].style.backgroundImage.indexOf("imageView2") >= 0){
                        var stringObj = imgSrc[n].style.backgroundImage;
                        var imgurl = stringObj.replace(regOther, "ondetail");console.log(imgurl);
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
            } else if (clickImgUrl.indexOf("file.huizhuang.com") >= 0) {
                var _imgurl = clickImgUrl;
            }else if (clickImgUrl.indexOf("imageView2") >= 0) {
                var _stringObj = clickImgUrl;
                var _imgurl = _stringObj.replace(regOther, "ondetail");
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
                animationLoop: false,
                animationSpeed: 300,
                startAt: clickid,
                after: function() {
                    var _id = $(".slides").find(".flex-active-slide").index();
                    $('.right-sp1').text((_id+1) + "/");
                }
            });
        });

        //取消返回点击事件
        $("#js_slider_back").on("click", function() {
            $("html,body").removeClass("all-wrap");
            $(".photos-detail").css("display", "none");
            $('.flexslider').remove();
            HZ_APP_JSSDK.setImageShowForFull("0");
        })
    }();

    //解析链接中的字符,处理用户信息
    var SetUserIonfo = function() {
        var parseobj = YZQ_COMMON.parseURI().params;
        var nickname = "";
        var style = "";
        var head_img = "";
        var type = "";
        var gender = "";
        var userid = parseobj.user_id;
        YZQ_UTILS.AJAXRequest(
            '/index/Index/getUserInfo.do',
            "post", {
                user_id: userid

            },
            function(data) {
                var userinfo = data.data;
                head_img = userinfo.avatar;
                nickname = userinfo.nick_name;
                style = userinfo.room_type;
                type = userinfo.room_style;
                gender =userinfo.gender;
                if (head_img != "" && head_img != null) {
                    $('.head-img').css("background-image", "url('" + head_img + "')");
                } else {
                    $('.head-img').css("background-image", "url('http://hzimg.huizhuang.com/hzone_v2/img/head-users.png')");
                }
                $('.name span').text(nickname);
                var cont = style + "|" + type;
                if (style == "" || style == null) {
                    cont = type;
                }
                if (type == "" || type == null) {
                    cont = style;
                }
                $('.info').text(cont);
                if (gender == 1) {
                    $('.xingbie-nv').hide();
                    $('.xingbie-nan').show();
                } else if (gender == 2) {
                    $('.xingbie-nan').hide();
                    $('.xingbie-nv').show();
                } else {
                    $('.xingbie-nv').hide();
                    $('.xingbie-nan').hide();
                }
            },
            function(err) {}
        );
        GetNoteInfo(userid);
    }();
    /**
     * 点击头像跳转到个人主页
     */
    $('body header').on('click','.head-img',function (){
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
        var parseobj = YZQ_COMMON.parseURI().params,
            userid = parseobj.user_id,
            junmpurl = 'my-page.html?userid='+ userid;
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
    var target = '.header-fix';
    YZQ_COMMON.Loading(true, target);


}());