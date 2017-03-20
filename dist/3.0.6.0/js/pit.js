/**
 * Created by cy on 2015/11/25.
 * namespace: YZQ_PIT
 * use: PIT.HTML
 * @author   : cy
 * @datetime : 2015/11/25
 * @version  : 1.0.0
 */
;
(function() {

    var pitType = 11,
        iconData = new Array(); //绑定数据的数组

    /**
     * 获取头像数据
     * @param {Int} type 类型 (11:售后,10:油漆,9 :泥木,8 :水电,7 :材料,6 :合同,5 :预算,4 :量房)
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
        el: '#pit',
        data: {
            datas: iconData
        },
        methods: {
            fnShowHandler: function(aid, atitle) {
                YZQ_MONITOR.pointClick(event); //埋点上报
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
            var _minId = $('.neirong').find('li:last').data('id');
            getIconData(pitType, _minId);
        });
    }();

    /**
     * 注册点击事件
     */
    /*var registerClickListener = function() {

        $(".pit").on('click', '.neirong li', function() {
            //YZQ_MONITOR.pointClick(event); //埋点上报
            var id = $(this).data('id'),
                title = $(this).data('title'),
                page = 'article.html?';

            page += 'id=' + id;
            page += '&pageid=200077';
            //            location.href = page;

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
    }();*/
}());