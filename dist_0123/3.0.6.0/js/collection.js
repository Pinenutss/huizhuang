/**
 * Created by cy on 2015/11/27.
 * namespace: YZQ_COLLECTION
 * use: COLLECTION.HTML
 * @author   : cy
 * @datetime : 2015/11/27
 * @version  : 1.0.0
 */
;
(function() {

    var collectionType = 12,
        iconData = []; //绑定数据的数组

    /**
     * 获取头像数据
     * @param {Int} type 类型 (20:软装入住,19:竣工阶段,18:油漆阶段,17:泥木阶段,16:水电阶段,15:开工阶段,14:建材选购,13:量房设计,12:装修准备)
     * @param {Int} minId 最后id
     */
    var getIconData = function(type, minId) {
        YZQ_UTILS.AJAXRequest(
            '/index/Article/getArticleList.do',
            "post", {
                type: type,
                minId: minId
            },
            function(data) {
                for (var i = 0, len = data.data.length; i < len; i++) {
                    iconData.push(data.data[i]);
                }
            },
            function(error) {
                console.log(error);
            }
        );
    };

    var vm = new Vue({
        el: '#collection',
        data: {
            datas: iconData
        }
    });

    /**
     * 切换加载数据
     */
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 'auto',
        centeredSlides: true,
        paginationClickable: true,
        spaceBetween: 0,
        loop: true,
        onSlideChangeEnd: function() {
            var _pitType = $('.swiper-slide-active').find('p').data('type');
            iconData.splice(0, iconData.length);
            getIconData(_pitType);
        }
    });

    /**
     * 滑动加载数据
     */
    var ScrollLoadData = function() {
        YZQ_COMMON.ScrollLoadData(function text() {
            var _length = $('.neirong').find('li').length;
            var _minId = $('.neirong').find('li:last').data('id');
            getIconData(collectionType, _minId);
        });
    }();

    /**
     * 注册点击事件监听
     */
    var registerClickListener = function() {
        $(".collection").on('click', '.neirong li', function() {
            //YZQ_MONITOR.pointClick(event); //埋点上报
            var id = $(this).data('id'),
                title = $(this).data('title'),
                page = 'article.html?';

            page += 'id=' + id;
            page += '&pageid=200076';
            var data = {
                baseurl: WEB_CONFIG.NATIVE_JUMP(),
                page: page,
                title: title,
                isthide: false,
                isbhide: false,
                isfull: false,
                iconright: 0
            };
            YZQ_UTILS.pageSwitchMethod(data);
        });
    }();
}());