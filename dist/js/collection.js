!function(){var i=[],e=function(){YZQ_UTILS.AJAXRequest("/index/Article/getArticleType.do","post",{id:2},function(i){if(void 0==i.items.length)return void YZQ_COMMON.tips("已经全部加载完啦~");for(var e=$(".header").find("ul"),t="",a=20007603,l=0,o=i.items.length;o>l;l++){var d=i.items[l];t+='<li class="swiper-slide" data-pointid="'+a+'"><i style="background-image: url('+d.img+')"></i><p class="sp1" data-type="'+d.id+'" >'+d.name+"</p></li>",a++}e.append(t),n()},function(i){YZQ_COMMON.tips(i.msg)})};e();var t=function(e,t,n){i.splice(0,i.length),YZQ_UTILS.AJAXRequest("/index/Article/getArticleList.do","post",{type:e,minId:t},function(e){if(void 0==e.data.length)return void YZQ_COMMON.tips("已经全部加载完啦~");for(var t=0,a=e.data.length;a>t;t++)i.push(e.data[t]);n&&n.resetload()},function(i){YZQ_COMMON.tips(i.msg),n&&n.resetload()})},n=(new Vue({el:"#collection",data:{datas:i}}),function(){new Swiper(".swiper-container",{pagination:".swiper-pagination",slidesPerView:"auto",centeredSlides:!0,paginationClickable:!0,initialSlide:0,spaceBetween:0,slideToClickedSlide:!0,loop:!0,onSlideChangeEnd:function(){var e=$("body").find(".swiper-slide-active").data("pointid");YZQ_MONITOR.pointClick(e);var n=$(".swiper-slide-active").find("p").data("type");i.splice(0,i.length),n&&t(n)}})});(function(){$("#collection").find("ul").dropload({scrollArea:window,loadDownFn:function(i){var e=($(".neirong").find("li").length,$(".neirong").find("li:last").data("id"));t(collectionType,e,i)}})})(),function(){$(".collection").on("click",".neirong li",function(){YZQ_MONITOR.pointClick(event);var i=$(this).data("id"),e=$(this).data("title"),t="article.html?";t+="id="+i,t+="&pageid=200076";var n={baseurl:WEB_CONFIG.NATIVE_JUMP(),page:t,title:e,isthide:!1,isbhide:!0,isfull:!1,iconright:0};YZQ_UTILS.pageSwitchMethod(n)})}();$("body").on("click",".neirong .clearfix li",function(){var i=$(this).data("pointid");YZQ_MONITOR.pointClick(i)})}();