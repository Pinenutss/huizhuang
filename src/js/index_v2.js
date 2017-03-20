/*
* index_v2版本
* 2015/12/29
*/

var index = function(){
	/*--------------------------页面注册方法----------------------------*/
	var banner = [];			//banner数据存储数组
	var stickPost = [];      	//stickPost数据存储数组
	var post = [];      		//post数据存储数组
	var page = 1;
	
	//APP内公用跳转方法
	var linkHref = function(url,page,name,head){
		var data = {
			baseurl: url || WEB_CONFIG.NATIVE_JUMP(),
			page: page,
			title: name,
			isthide: head || false,
			isbhide: true,
			isfull: false,
			iconright: 0
			};
			console.log(data);
			YZQ_UTILS.pageSwitchMethod(data);
			return false;
		};
	
	//获取APP内部信息
	var getUserInfo = function() {
        try {
            var userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());
            var siteId = userInfo.site_id;
            var appid = userInfo.appid;
            if (appid < 2003100) {
                document.location.href = "3.0.6/index.html";
            } else {
                getIndexAdvert(siteId);
            }
        } catch (err) {
            console.log(err)
        }
        ;
    }
	
	//获取幻灯片方法
	var getIndexAdvert = function(siteId){
        var os = YZQ_UTILS.getPlatformMethod();
        if(os == 2){
            os = "ios";
        }else{
            os = "android" ;
        }
		YZQ_UTILS.AJAXRequest('/index/Index/ad.do',"POST",{
			site_id: siteId || 1,
            os : os
			},function(result){
				var pointid = 20005612;
				for(var i=0; i<result.data.length; i++){
					var msg = result.data[i];
					msg.pointid = pointid;
					pointid++;
					banner.push(msg);
				};

				
//				$("body").on("click",".banner-href",function(){
//					YZQ_MONITOR.pointClick($(this).data("pointid")); //埋点上报
//					var url = $(this).attr("data-url");
//					var title = $(this).attr("data-title");
//					linkHref(url,"",title);
//					});
			});
		};
	
	//获取置顶帖子列表方法
	var	getStickPostsList = function(){
		YZQ_UTILS.AJAXRequest('/index/Card/zDcardList.do',"POST",{
			},function(result){
				for(var i=0; i<result.items.length; i++){
					var msg = result.items[i];
					stickPost.push(msg);
				};
			})
		};
	
	//获取非置顶帖子列表方法
	var getPostsList = function(me){
		YZQ_UTILS.AJAXRequest('/index/Card/getCardList.do',"POST",{
			page: page,
			num: 5
			},function(result){
				if(result.items == ""){
					YZQ_COMMON.tips("已经全部加载完啦~");
					};
				page++;
				for(var i=0; i<result.items.length; i++){
					var msg = result.items[i];
					msg.time = TurnTime(msg.add_time,msg.nowTime);
					if(!msg.head_img){
						msg.head_img = "http://imgcache.huizhuang.com/hzone_v2/img/head-users.png";
						}
					post.push(msg);
				}
				if(me){
					me.resetload();
					};
			},function(result){
				YZQ_COMMON.tips(result.msg);
				if(me){
					me.resetload();
					};
			})
		};
	
	//时间戳转换2015-03-15格式
	var TurnTime = function(time,nowTime){
		var timeAgo = (nowTime - time)*1000;				//发表时间到当前服务器时间的毫秒数
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
	
	
	
	
	/*----------------------------Vue.js的构造器--------------------------*/
	
	//bannerModel Vue.js的构造器
	var bannerModel = new Vue({
        el: "#js_banner",
        data: {
            banners: banner
        },
        methods: {
			bannerClick:function(msg){
				var url = msg.url;
				var title = msg.ad_name;
				linkHref(url,"",title);
			}
		},
		ready: function(){
			setTimeout(function(){
                var mySwiper = new Swiper ('.swiper-container', {
                    loop: true,
                    pagination: '.swiper-pagination' ,
                    autoplay : 3000 ,
                    speed:500
                });
				$(".wrap-top").hide();
            },1500);
		}
    });
	
	//stickPostsModel Vue.js的构造器
	var stickPostsModel = new Vue({
		el: "#js_stickposts",
        data: {
            stickPosts: stickPost
        },
        methods: {
			stickPostsClick:function(msg){
				YZQ_MONITOR.pointClick(20005646); //埋点上报
				allPostsContent(msg);
				}
        }
	});
	
	//postsModel Vue.js的构造器
	var postsModel = new Vue({
		el: "#js_posts",
        data: {
			posts: post
        },
        methods: {
			postsName:function(msg){
				YZQ_MONITOR.pointClick(20005645); //埋点上报
				var page = "my-page.html?userid="+msg.user_id;
				var title = msg.title;
				linkHref("",page,title,true);
			},
			postsContent:function(msg){
				YZQ_MONITOR.pointClick(20005646); //埋点上报
				allPostsContent(msg);
				}
        }
	});
	
	//共用帖子详情跳转
	var allPostsContent = function(msg){
		var page = "discuss-de.html?card_id="+msg.id;
		var title = "详情";
		linkHref("",page,title);
		}
		
	//点击事件
	$(".nav a").on("click",function(){
		var page = $(this).data("page");
		var title = $(this).data("title");
		linkHref("",page,title);
		});	

	/*--------------------------页面执行方法----------------------------*/
	$(document).ready(function(){
		getUserInfo();
		//getIndexAdvert();
		getStickPostsList();
		getPostsList();
		
		//上划加载组件初始化
		$('#js_posts').dropload({
            scrollArea: window,
            loadDownFn: function(me){
                getPostsList(me);
            	}
        	});
		});	
}();