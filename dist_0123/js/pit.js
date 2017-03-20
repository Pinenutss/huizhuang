/**
 * Created by cy on 2015/11/25.
 * namespace: YZQ_PIT
 * use: PIT.HTML
 * @author   : cy
 * @datetime : 2015/11/25
 * @version  : 1.0.0
 */
var Pit = function ()
{
    var iconData = []; //绑定数据的数组
    /**
     * 获取文章标题列表数据
     * @param {void} 无
     * @param {void} 无
     */
    var getArticleType = function ()
    {
        YZQ_UTILS.AJAXRequest(
            '/index/Article/getArticleType.do',
            "post", {
                id: 3
            },
            function (data) {
				if(data.items.length == undefined){
					YZQ_COMMON.tips('已经全部加载完啦~');
                    return;
                };
                var $article = $('.header').find('ul');
                var str = '';
                var point = 20007703;
                for(var i = 0, len = data.items.length; i < len; i++){
                    var item = data.items[i];
                    str += '<li class="swiper-slide" data-pointid="'+point+'"><i style="background-image: url(' + item.img + ')"></i><p class="sp1" data-type="' + item.id + '" >' + item.name + '</p></li>';
                    point++;
                }
                $article.append(str);
                switchIcon();
            },
            function (error) {
                YZQ_COMMON.tips(error.msg);
            }
        );
    };
    getArticleType();
    
    /**
     * 获取头像数据
     * @param {Int} type 类型 (11:售后,10:油漆,9 :泥木,8 :水电,7 :材料,6 :合同,5 :预算,4 :量房)
     * @param {Int} minId 最后id
     */
    var getIconData = function(type, minId, me) {
        iconData.splice(0,iconData.length);
        YZQ_UTILS.AJAXRequest(
            '/index/Article/getArticleList.do',
            "post", {
                type: type,
                minId: minId
            },
            function(data) {
                if (data.data.length == undefined) {
                    YZQ_COMMON.tips('已经全部加载完啦~');
                    return;
                };
                for (var i = 0, len = data.data.length; i < len; i++) {
                    iconData.push(data.data[i]);
                }
                if (me) {
                    me.resetload();
                };
            },
            function(error) {
                YZQ_COMMON.tips(error.msg);
                if (me) {
                    me.resetload();
                };
            }
        );
    };

    var vm = new Vue({
        el: '#pit',
        data: {
            datas: iconData
        },
        methods: {
            fnShowHandler: function(aid, atitle) {
                var page = 'article.html?';
                page += 'id=' + aid;
                page += '&pageid=200077';
                //            location.href = page;
                var data = {
                    baseurl: WEB_CONFIG.NATIVE_JUMP(),
                    page: page,
                    title: atitle,
                    isthide: false,
                    isbhide: true,
                    isfull: false,
                    iconright: 0
                };
                YZQ_UTILS.pageSwitchMethod(data);
            }
        }
    });

    /**
     * 切换加载数据
     */
    var switchIcon = function ()
    {
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 'auto',
            centeredSlides: true,
            initialSlide: 0,
            paginationClickable: false,
            spaceBetween: 0,
            slideToClickedSlide : true,
            loop: true,
            onSlideChangeEnd: function(swiper) {
                var pointid = $('body').find('.swiper-slide-active').data('pointid');
                YZQ_MONITOR.pointClick(pointid); //埋点上报
                var _pitType = $('.swiper-slide-active').find('p').data('type');
                iconData.splice(0, iconData.length);
                if(_pitType){
                    getIconData(_pitType);
                }
            }
        });
    };
    
    /**
     * 滑动加载数据
     */
    var ScrollLoadData = function() {
        //        YZQ_COMMON.ScrollLoadData(function text() {
        //            var _minId = $('.neirong').find('li:last').data('id');
        //            getIconData(pitType, _minId);
        //        });
        $('.diary-main').find("ul").dropload({
            scrollArea: window,
            loadDownFn: function(me) {
                var _minId = $('.neirong').find('li:last').data('id');
                getIconData(pitType, _minId, me);
            }
        });
    }();

    //文章点击上报
    $('body').on('click','.neirong .clearfix li',function(){
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
    });
}();