var index=function(){var t=[],e=[],n=[],i=1,o=function(t,e,n,i){var o={baseurl:t||WEB_CONFIG.NATIVE_JUMP(),page:e,title:n,isthide:i||!1,isbhide:!0,isfull:!1,iconright:0};return console.log(o),YZQ_UTILS.pageSwitchMethod(o),!1},a=function(){try{var t=JSON.parse(HZ_APP_JSSDK.getUserInfo()),e=t.site_id,n=t.appid;2003100>n?document.location.href="3.0.6/index.html":s(e)}catch(i){console.log(i)}},s=function(e){var n=YZQ_UTILS.getPlatformMethod();n=2==n?"ios":"android",YZQ_UTILS.AJAXRequest("/index/Index/ad.do","POST",{site_id:e||1,os:n},function(e){for(var n=20005612,i=0;i<e.data.length;i++){var o=e.data[i];o.pointid=n,n++,t.push(o)}})},r=function(){YZQ_UTILS.AJAXRequest("/index/Card/zDcardList.do","POST",{},function(t){for(var n=0;n<t.items.length;n++){var i=t.items[n];e.push(i)}})},d=function(t){YZQ_UTILS.AJAXRequest("/index/Card/getCardList.do","POST",{page:i,num:5},function(e){""==e.items&&YZQ_COMMON.tips("已经全部加载完啦~"),i++;for(var o=0;o<e.items.length;o++){var a=e.items[o];a.time=u(a.time,a.nowTime),a.head_img||(a.head_img="http://imgcache.huizhuang.com/hzone_v2/img/head-users.png"),n.push(a)}t&&t.resetload()},function(e){YZQ_COMMON.tips(e.msg),t&&t.resetload()})},u=function(t,e){var n=1e3*(e-t),i=36e5,o=864e5,a=2592e5;if(i>n)return Math.floor(n/1e3/60)+"分钟前";if(n>=i&&o>n)return Math.floor(n/1e3/60/60)+"小时前";if(n>=o&&a>n)return Math.floor(n/1e3/60/60/24)+"天前";var s=new Date(1e3*t).toGMTString(),r=new Date(s),d=r.getFullYear(),u=r.getMonth()+1<10?"0"+(r.getMonth()+1):r.getMonth()+1,c=r.getDate()<10?"0"+r.getDate():r.getDate();r.getHours()<10?"0"+r.getHours():r.getHours(),r.getMinutes()<10?"0"+r.getMinutes():r.getMinutes(),r.getSeconds()<10?"0"+r.getSeconds():r.getSeconds();return d+"-"+u+"-"+c},c=(new Vue({el:"#js_banner",data:{banners:t},methods:{bannerClick:function(t){var e=t.url,n=t.ad_name;o(e,"",n)}},ready:function(){setTimeout(function(){new Swiper(".swiper-container",{loop:!0,pagination:".swiper-pagination",autoplay:3e3,speed:500});$(".wrap-top").hide()},1500)}}),new Vue({el:"#js_stickposts",data:{stickPosts:e},methods:{stickPostsClick:function(t){YZQ_MONITOR.pointClick(20005646),c(t)}}}),new Vue({el:"#js_posts",data:{posts:n},methods:{postsName:function(t){YZQ_MONITOR.pointClick(20005645);var e="my-page.html?userid="+t.user_id,n=t.title;o("",e,n,!0)},postsContent:function(t){YZQ_MONITOR.pointClick(20005646),c(t)}}}),function(t){var e="discuss-de.html?card_id="+t.id,n="详情";o("",e,n)});$(".nav a").on("click",function(){var t=$(this).data("page"),e=$(this).data("title");o("",t,e)}),$(document).ready(function(){a(),r(),d(),$("#js_posts").dropload({scrollArea:window,loadDownFn:function(t){d(t)}})})}();