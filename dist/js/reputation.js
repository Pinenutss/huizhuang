!function(){var e=1,i=new Array,a=function(a,t){try{var n=JSON.parse(HZ_APP_JSSDK.getUserInfo()),s=n.site_id}catch(o){console.log(o)}YZQ_UTILS.AJAXRequest("/index/Index/evaluate.do","post",{page:a,site_id:s},function(n){e++;var s=n.data;void 0==s.length&&YZQ_COMMON.tips("已经全部加载完啦~");for(var o=0;o<s.length;o++){var r=s[o];if(r.content.length>2&&r.service_num>0&&r.housing_area>0){(""==r.user_head_img||null==r.user_head_img)&&(r.user_head_img="http://hzimg.huizhuang.com/hzone_v2/img/head-users.png"),(""==r.foreman_head_img||null==r.foreman_head_img)&&(r.foreman_head_img="http://hzimg.huizhuang.com/hzone_v2/img/head-users.png");var d="YYYY-MM-DD";r.add_time=YZQ_COMMON.formateTime(r.add_time,d),"done"==r.stage&&(r.stage="竣工阶段"),"oil_paint"==r.stage&&(r.stage="油漆阶段"),"water"==r.stage&&(r.stage="水电阶段"),"wood"==r.stage&&(r.stage="泥木阶段"),"start"==r.stage&&(r.stage="开工阶段"),"measure"==r.stage&&(r.stage="量房阶段"),r.service_num=r.service_num+"次",r.housing_area=r.housing_area+"m²",r.starscore=r.score/5*100,r.userVip=Number(r.userVip)?'<span class="ico-vsmall"></span>':"",r.sex=2==Number(r.sex)?'<i class="xingbie-nv"></i>':'<i class="xingbie-nan"></i>',""!=r.city&&(r.point="·"),i.push(r),1==a&&YZQ_COMMON.Loading(!1,"")}}t&&t.resetload()},function(e){YZQ_COMMON.tips(e.msg),t&&t.resetload()})};a(e);new Vue({el:"#list",data:{datas:i}}),function(){$("#list").find("ul").dropload({scrollArea:window,loadDownFn:function(i){a(e,i)}})}();$("body").on("click",".owner-cont .head-img i",function(){var e=$(this).data("pointid");YZQ_MONITOR.pointClick(e);var i=$(this).data("user_id"),a="my-page.html?userid="+i,t={baseurl:WEB_CONFIG.NATIVE_JUMP(),page:a,title:"个人主页",isthide:!0,isbhide:!0,isfull:!1,iconright:0};return YZQ_UTILS.pageSwitchMethod(t),!1}),$("body").on("click",".gong-cont",function(){var e=$(this).find(".head-img").data("pointid");YZQ_MONITOR.pointClick(e);var i=$(this).find(".head-img").data("foremanid");HZ_APP_JSSDK.switchForemanDetail(i.toString())});$(".js_booking").on("click",function(){var e=new Object;e.source="yzq_koubei",e.pageid="200065",e.foremanid="",HZ_APP_JSSDK.bookingJump(JSON.stringify(e));var i=$(this).data("pointid");YZQ_MONITOR.pointClick(i)})}();