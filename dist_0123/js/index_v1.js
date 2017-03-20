/*
*
* Dw 2015/11/23.
* 
* index模块
*
*/

(function(){

	//翻页的最后一个图集id
	var mindid = "";
	sessionStorage.setItem("minid",mindid);
	var Opend_album_id="";
    var imgtitle = "";//点开的图片标题
    var imgdigest = "";//点开的图片介绍
    var imgurl = "";//点开的图片地址
    var imgpage = 1;
	//取用户user_id,内嵌APP时自执行,网页测试时user_id为字符串1;
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


    /*----------------------------板块跳转方法---------------------------*/
       
    $('nav span').click(function(event){//console.log($(this).data('pointid'));
        YZQ_MONITOR.pointClick(event);//埋点上报
        var _url = $(this).data('url'),
            _title = $(this).siblings('p').text();
        var iconright_flag = 0 ;
        if (_url =="discuss.html"){
            iconright_flag =1;
        }
         var   data = {
            baseurl:  WEB_CONFIG.NATIVE_JUMP(),
            page:   _url,
            title:  _title,
            isthide:    false,
            isbhide:    false,
            isfull:     false,
            iconright : iconright_flag
        };
       //$('body').prepend(_url + _title);
       YZQ_UTILS.pageSwitchMethod(data); 
        return false;
    });
    $('body').on('click', '.js_nativejump',function(event){
        //YZQ_MONITOR.pointClick(event);//埋点上报
        var _url = $(this).attr('href'),
            _title = $(this).attr('title');
        var data = {
            baseurl:  WEB_CONFIG.NATIVE_JUMP(),
            page:   _url,
            title:  _title,
            isthide:    false,
            isbhide:    false,
            isfull:     false,
            iconright : 0
        };
        YZQ_UTILS.pageSwitchMethod(data); 
        return false;
    })
    $('body').on('click', '.js_advjump',function(event){
        YZQ_MONITOR.pointClick(event);//埋点上报
        var _url = $(this).data('url'),
            _title = $(this).attr('title');
        var data = {
            baseurl:    _url,
            page:   "?",
            title:  _title,
            isthide:    false,
            isbhide:    false,
            isfull:     false,
            iconright : 0
        };
        YZQ_UTILS.pageSwitchMethod(data); 
        return false;
    })
    


	//滚动条在Y轴上的滚动距离
    getScrollTop = function() {
        var scrollTop = 0,
            bodyScrollTop = 0,
            documentScrollTop = 0;
        if (document.body) {
            bodyScrollTop = document.body.scrollTop;
        }
        if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    };
	
    //浏览器视口的高度
    getWindowHeight = function() {
        var windowHeight = 0;
        if (document.compatMode == "CSS1Compat") {
            windowHeight = document.documentElement.clientHeight;
        } else {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    };
	
    //获取总高度
    getScrollHeight = function() {
        var scrollHeight = document.body.scrollHeight;
        return scrollHeight;
    };

    //屏幕位置判断
    var ajaxmore = function(me) {
        //window.onscroll = function() {
            //var a = (getScrollTop() + getWindowHeight());
            //var b = (getScrollHeight());
            //if (a == b) {
				var str = "";
				str += '<li v-for="todo in todos" onclick="" id="{{todo.id}}" data-pointid="3">';
				str += '<div class="pic" style="background-image:url({{todo.thumb_sketch}});"></div>';
				str += '<h3>{{todo.name}}</h3></li>';
				$("#js_pic_list").find("ul").append(str);
            	drawing(me,imgpage);
            //}
        //}
    };
	
	//处理首页推荐效果图专辑列表
	var drawing = function(me,page){
		YZQ_UTILS.AJAXRequest('/index/Index/drawing.do', "POST", {
			num:5,
			//minId:sessionStorage.getItem("minid")
            page:page
			},function(result){
            if(page ==1){
                YZQ_COMMON.Loading(false,"");
            }

                imgpage++;
                var reputation = result.data;
				if(reputation.length == undefined){
					YZQ_COMMON.tips('已经全部加载完啦~!');
					};
                for(var i=0;i<reputation.length;i++){
                    var reput = reputation[i];
                    if(reput.thumb_sketch == null || reput.thumb_sketch == ""){
                        reput.thumb_sketch = "http://hzserver-10006163.image.myqcloud.com/9d4ccbe5-b16f-44ae-96f8-44539de2bb34?max_age=19830212&d=20151230193947";
                    }else if(reput.thumb_sketch.indexOf("hzyzq") >= 0) {
                        reput.thumb_sketch +="/wlist?max_age=19830212&d=20151230193947";
                    }
                }

				new Vue({
					el: "#js_pic_list",
					data: {
						todos: result.data
					}
				})
				/*computed:{
					b: function(){
						return this.a + 1
				  	}
				}*/
				if(result.data.length > 0){
					sessionStorage.setItem("minid", result.data[result.data.length-1].id);
					};
				if(me){
					me.resetload();
					};
			},function(result){
				YZQ_COMMON.tips(result.msg);
				if(me){
					me.resetload();
					};	
			});
		};
	
	//处理页面展示广告图片
	var showAdverSwiper = function(){
		YZQ_UTILS.AJAXRequest('/index/Index/ad.do', "POST", {
			site_id:1	
		},function(result){
			var pointid = 20005612;
			for(i=0;i<result.data.length;i++){
					result.data[i].id = pointid;
					pointid++;
					}
			new Vue({
					el: "#js_adver",
					data: {
						todos: result.data
					}
				})
			
			//运行广告js方法
			var mySwiper = new Swiper ('.adver .swiper-container', {
				direction: 'horizontal',
				//pagination: '.swiper-pagination',
				slidesPerView: 'auto',
				paginationClickable: true,
				spaceBetween: 5,
				loop:true
			});
		});
	};

	/*----------------------------点击事件注册---------------------------*/	
	
	//取消返回点击事件
	$("#js_slider_back").on("click",function(event){
        YZQ_MONITOR.pointClick(event);//埋点上报
		$("html,body").removeClass("all-wrap");
		$(".photos-detail").css("display","none");
		$('.flexslider').remove();
        $('.right-sp1').text("1/");
        HZ_APP_JSSDK.setImageShowForFull("0");
		});
		
	//点赞点击执行
	$("#js_Praise").on("click",function(event){
        YZQ_MONITOR.pointClick(event);//埋点上报
		sendIsPraise();
		});
		
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
		
	//点赞成功后执行 				 禁止重复点赞，封装
	var sendIsPraise = function(){
		var _img_id = $(".flexslider").find(".flex-active-slide").attr("img-id");
        var _userid =  getUserId();
		YZQ_UTILS.AJAXRequest('/index/Card/praise.do', "POST", {
			id:_img_id,
			user_id:_userid,
			type:4
		},function(result){
			$("#js_Praise").removeClass("zan").addClass("yizan");
		},function(error){
			console.log(error);
			//$("#js_Praise").removeClass("zan").addClass("yizan");
		});
	};
	
	/*----------------------------幻灯片图集展示---------------------------*/

	//点击打开幻灯片函数
	var imgSlider = function(){
		$("body").on("click",".pic-list li",function(event){
            //YZQ_MONITOR.pointClick(event);//埋点上报
			album_id = $(this).attr("id");
            Opend_album_id = $(this).attr("id");
			//拉取对应图集展示
			showDrawingImg();

			});
		}();
	
	//处理展示图集图片
	var showDrawingImg = function(){
        var _userid = getUserId();
		YZQ_UTILS.AJAXRequest('/index/Index/drawingImg.do', "POST", {
			album_id:album_id,
			user_id:_userid
		},function(result){

             imgtitle = result.data[0].name;//点开的图片标题
             imgdigest = result.data[0].digest;//点开的图片介绍
             imgurl = result.data[0].img_url;
			//加幻灯片外部结构
			var ulstr = '<div class="flexslider"><ul class="slides"></ul></div>';
			$('.foot').append(ulstr);
			
			//添加li元素到DOM中
			for(var i=0;i<result.data.length;i++){
				var reput = result.data[i];
				var str = '';
                if(reput.img_url == null || reput.img_url == ""){
                    reput.img_url = "http://hzserver-10006163.image.myqcloud.com/9d4ccbe5-b16f-44ae-96f8-44539de2bb34?max_age=19830212&d=20151230193947";
                }else if(reput.img_url.indexOf("hzyzq") >= 0) {
                    reput.img_url +="/normal?max_age=19830212&d=20151230193947";
                }

				str += '<li style="background:url('+reput.img_url+') center no-repeat;background-size:contain;height:100%;" id="'+(i+1)+'" img-id="'+reput.id+'"></li>';
				//拼接结果
				$(".slides").append(str);
			}
			
			//判断首图是否点赞
			if(result.data[0].is_prase == "1"){
				$("#js_Praise").removeClass("zan").addClass("yizan");
				}
			else{
				$("#js_Praise").removeClass("yizan").addClass("zan");
				}
			
			//开启遮罩，显示幻灯片
			$("html,body").addClass("all-wrap");
			$(".photos-detail").css("display","block");
			
			//更改图片总数的数字
			$('.right-sp2').text(result.data.length);
			
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
		});
        HZ_APP_JSSDK.setImageShowForFull("1");
	};

	//翻页回调函数拉取新的数据
	var getIsPraise = function(){
        var _userid =  getUserId();
		YZQ_UTILS.AJAXRequest('/index/Index/drawingImg.do', "POST", {
			album_id:Opend_album_id,
			user_id:_userid
		},function(result){
			var img_id = $('.flex-active-slide').attr('id');
            imgtitle = result.data[img_id-1].name;//点开的图片标题
            imgdigest = result.data[img_id-1].digest;//点开的图片介绍
            imgurl = result.data[img_id-1].img_url;
			if(result.data[img_id-1].is_prase == "1"){
				$("#js_Praise").removeClass("zan").addClass("yizan");
           //     alert("可以赞");
			}else{
				$("#js_Praise").removeClass("yizan").addClass("zan");
            //    alert("已经赞");
				}
		});
	};
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
    //微信好友分享
    $('#js_shareWxFriends').click(function(){
        var _platform ="wechat";
        Share(_platform);
    });
    //
    $('#js_shareWXSocials').click(function(){
        var _platform ="wechatmoment";
        Share(_platform);
    });
    $('#js_sharSina').click(function(){
        var _platform ="sina";
        Share(_platform);
    });
 /*----------------------------标签模块---------------------------*/

    //IOS进入业主圈调用
    function getCounterFromClient(){
       //alert("进入时调用");
        isFirstClickHomeZone();
    }


    var labelData = {},
        labelDatas = [];
    /**
     * 初始化判定用户是否登录及是否是第一次进入业主圈
     */

//    var isFirstClickHomeZone = function ()
//    {
//        var userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo()),
//            userId = userInfo.user_id;
////        var userId = 2;
//        if(!userId){ //未登录
//            return;
//        }
//        
//        YZQ_UTILS.AJAXRequest(
//            '/index/Index/userTagInfo.do',
//            'POST',
//            {
//                user_id: userId
//            },
//            function (data) {
//                if(data.data.nick){
//                    $('.mask').hide();
//                }else {                   
//                    $('.mask').show();
//                    $('body').css('overflow', 'hidden');
//                    getLabelInfo();
//                }
//            },
//            function (error) {
//                console.log(error);
//            }
//        );
//    };

    /**
     * 标签初始化选择性别(默认选中女生)
     */
    var registerSexClickListener =function ()
    {
        $('.nv').click(function(){
            $('.nv').addClass('chicknv');
            $('.nan').removeClass('chicknan');
        });
        $('.nan').click(function(){
            $('.nan').addClass('chicknan');
            $('.nv').removeClass('chicknv');
        });
    };
    /**
     * 获取标签信息
     */
    var getLabelInfo = function ()
    {
        YZQ_UTILS.AJAXRequest(
            '/index/Index/tagTemInfo.do',
            "POST",
            {}, 
            function (data) {
                labelDatas.push(data.data);
                loadLabelInfo();
            },
            function (error) {
                console.log(error);
            }
        );
    };
    /**
     * 动态加载标签数据
     * @param {Int} type 类型 (11:售后,10:油漆,9 :泥木,8 :水电,7 :材料,6 :合同,5 :预算,4 :量房)
     * @param {Int} minId 最后id
     */
    var loadLabelInfo = function ()
    {
        var vm = new Vue({
            el: '#mask',
            data: {
                labelDatas: labelDatas
            }
        });
        registerRoomNumClickListener();
        registerSexClickListener();
    };
    
    /**
     * 注册房间几居室的选中点击事件监听
     */
    var registerRoomNumClickListener = function ()
    {
        var $roomContainer = $('.swiper-wrapper');
        $roomContainer.find('div .mask-img').click(function(){
            if($(this).html()){
                $(this).html('');
            }else {
                $(this).append('<span class="mask-img-choose"><span class="mask-gou"></span></span>');
            }
        });
    };
    /**
     * 注册基本信息页面按钮的监听事件
     */
    var registerBasicNextClickListener = function ()
    {
        var $bgContainer = $('.bg');
        $bgContainer.find('.next').click(function(){
            var name = $bgContainer.find('input').val();
            $('.nv').hasClass('chicknv') ? labelData.sex = '女': labelData.sex = '男';
            if(!name){
                $bgContainer.find('input').css('box-shadow', '0 0 5px #fff');
                YZQ_COMMON.tips('请填写昵称~~');
            }else {
                $bgContainer.find('input').css('box-shadow');
                $(this).parent().parent().hide();
                $('.bg-next').show();
                $('.sp-word').text(name);
                labelData.nick = name;
                
                var mySwiper2 = new Swiper('.bg-next .swiper-container', {
                    pagination: '.bg-next .swiper-pagination',
                    slidesPerView: 2,
                    slidesPerColumn: 2
                });
            }
        });
    };
    /**
     * 注册昵称文本框的监听事件
     */
    var registerNickInputClickListener = function ()
    {
        var $bgContainer = $('.bg');
        $bgContainer.find('input').click(function(){
            $bgContainer.find('input').css('box-shadow', '');
        });
    };
    /**
     * 注册几居室页面按钮的监听事件
     */
    var registerRoomNumNextClickListener = function ()
    {
        var $bgContainer = $('.bg-next');
        $bgContainer.find('.next').click(function(){
            var $chooseRoomNum = $bgContainer.find('div .mask-img .mask-img-choose');
            if(!$chooseRoomNum.length){
                YZQ_COMMON.tips('请至少选择一种居室~~');
            }
            else {
                getRoomValue($chooseRoomNum.parent());
                $(this).parent().parent().hide();
                $('.bg-thrid').show();
                $('.sp-thrid').text($('.mask').find('input').val());
                
                var mySwiper3 = new Swiper('.bg-thrid .swiper-container', {
                    pagination: '.bg-thrid .swiper-pagination',
                    slidesPerView: 2,
                    slidesPerColumn: 2
                });
            }
        });
    };
    /**
     * 标签初始化选择性别
     * @param {JQuery} $room 房间几居室 
     */
    var getRoomValue = function ($room)
    {
        var roomValue = '';
        $room.each(function (){
            var value = $(this).data('value');
            roomValue += value + ',';
        });
        labelData.room = roomValue.substr(0, roomValue.length-1);
    };
    /**
     * 获取房间风格对应的value值
     * @param {JQuery} $roomStyle 风格 
     */
    var getStyleValue = function ($roomStyle)
    {
        var roomStyle = '';
        $roomStyle.each(function (){
            var value = $(this).data('value');
            roomStyle += value + ',';
        });
        labelData.style = roomStyle.substr(0, roomStyle.length-1);
    };
    /**
     * 注册风格页面按钮的监听事件
     */
    var registerRoomStyleNextClickListener = function ()
    {
        var $bgContainer = $('.bg-thrid');
        $bgContainer.find('.end-next').click(function(){
            var $chooseRoomStyle = $bgContainer.find('div .mask-img .mask-img-choose');
            if(!$chooseRoomStyle.length){
                YZQ_COMMON.tips('请至少选择一种风格~~');
            }
            else {
                getStyleValue($chooseRoomStyle.parent());
                sendLabelData();
            }
        });
    };
    /**
     * 发送标签信息（标签添加成功后，就隐藏当前窗口）
     */
    var sendLabelData = function ()
    {
        var userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo()),
            userId = userInfo.user_id;
        
        YZQ_UTILS.AJAXRequest(
            '/index/Index/selectTagInfo.do',
            "POST",
            {
                user_id: userId,
                nick: labelData.nick,
                sex: labelData.sex,
                room: labelData.room,
                style: labelData.style
            }, 
            function (data) {
                YZQ_COMMON.tips('添加成功~~');
                $('.mask').hide();
                $('body').css('overflow', '');
            },
            function (error) {
                console.log(error);
            }
        );
    };

	/*----------------------------执行方法处---------------------------*/
	$(document).ready(function(){
        //isFirstClickHomeZone();//初始化判定用户是否登录及是否isFirstClickHomeZone入业主圈
        registerBasicNextClickListener();//注册基本信息页面按钮的监听事件
        registerRoomNumNextClickListener();//注册几居室页面按钮的监听事件
        registerRoomStyleNextClickListener();//注册风格页面按钮的监听事件
        registerNickInputClickListener();//注册昵称文本框的监听事件
        
		//拉取首页推荐效果图专辑列表
		drawing("",imgpage);
	
		//拉取首页广告图片showAdverSwiper
		showAdverSwiper();
	
		//监测页面滚动事件
    	//ajaxmore();
		$('#js_pic_list').find("ul").dropload({
			scrollArea : window,
			loadDownFn : function(me){
				ajaxmore(me);
				}
			});
        var target = '.pic-list ul';
        YZQ_COMMON.Loading(true,target);
	});
}())