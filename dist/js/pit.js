var Pit=function(){var i=[],e=function(){YZQ_UTILS.AJAXRequest("/index/Article/getArticleType.do","post",{id:3},function(i){if(void 0==i.items.length)return void YZQ_COMMON.tips("已经全部加载完啦~");for(var e=$(".header").find("ul"),t="",a=20007703,d=0,l=i.items.length;l>d;d++){var o=i.items[d];t+='<li class="swiper-slide" data-pointid="'+a+'"><i style="background-image: url('+o.img+')"></i><p class="sp1" data-type="'+o.id+'" >'+o.name+"</p></li>",a++}e.append(t),n()},function(i){YZQ_COMMON.tips(i.msg)})};e();var t=function(e,t,n){i.splice(0,i.length),YZQ_UTILS.AJAXRequest("/index/Article/getArticleList.do","post",{type:e,minId:t},function(e){if(void 0==e.data.length)return void YZQ_COMMON.tips("已经全部加载完啦~");for(var t=0,a=e.data.length;a>t;t++)i.push(e.data[t]);n&&n.resetload()},function(i){YZQ_COMMON.tips(i.msg),n&&n.resetload()})},n=(new Vue({el:"#pit",data:{datas:i},methods:{fnShowHandler:function(i,e){var t="article.html?";t+="id="+i,t+="&pageid=200077";var n={baseurl:WEB_CONFIG.NATIVE_JUMP(),page:t,title:e,isthide:!1,isbhide:!0,isfull:!1,iconright:0};YZQ_UTILS.pageSwitchMethod(n)}}}),function(){new Swiper(".swiper-container",{pagination:".swiper-pagination",slidesPerView:"auto",centeredSlides:!0,initialSlide:0,paginationClickable:!1,spaceBetween:0,slideToClickedSlide:!0,loop:!0,onSlideChangeEnd:function(e){var n=$("body").find(".swiper-slide-active").data("pointid");YZQ_MONITOR.pointClick(n);var a=$(".swiper-slide-active").find("p").data("type");i.splice(0,i.length),a&&t(a)}})});(function(){$(".diary-main").find("ul").dropload({scrollArea:window,loadDownFn:function(i){var e=$(".neirong").find("li:last").data("id");t(pitType,e,i)}})})();$("body").on("click",".neirong .clearfix li",function(){var i=$(this).data("pointid");YZQ_MONITOR.pointClick(i)})}();