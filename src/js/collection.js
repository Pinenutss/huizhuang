/**
 * Created by cy on 2015/11/27.
 * namespace: YZQ_COLLECTION
 * use: COLLECTION.HTML
 * @author   : zwp
 * @datetime : 2015/11/27
 * @version  : 1.0.0
 */
;
(function () {

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
                id: 2
            },
            function (data) {
//                if(data.items.length == undefined){
//                    YZQ_COMMON.tips('已经全部加载完啦~');
//                    return;
//                };
                var $article = $('.header').find('ul');
                var str = '';
                var point = 20007603;
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
     * @param {Int} type 类型 (20:软装入住,19:竣工阶段,18:油漆阶段,17:泥木阶段,16:水电阶段,15:开工阶段,14:建材选购,13:量房设计,12:装修准备)
     * @param {Int} minId 最后id
     */
    var getIconData = function (type, minId,me)
    {
        iconData.splice(0,iconData.length);
        YZQ_UTILS.AJAXRequest(
            '/index/Article/getArticleList.do',
            "post", {
                type: type,
                minId: minId
            },
            function (data) {
//                if(data.data.length == undefined){
//                    YZQ_COMMON.tips('已经全部加载完啦~');
//                    return;
//                };
                for (var i = 0, len = data.data.length; i < len; i++) {
                    iconData.push(data.data[i]);
                }
                if(me){
                    me.resetload();
                };
            },
            function (error) {
                YZQ_COMMON.tips(error.msg);
                if(me){
                    me.resetload();
                };
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
    var switchIcon = function ()
    {
        var indexflag = parseInt(sessionStorage.getItem('col_indexflag'));
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 'auto',
            centeredSlides: true,
            paginationClickable: true,
            initialSlide: indexflag ||0,
            spaceBetween: 0,
            slideToClickedSlide : true,
            loop: true,
            onSlideChangeEnd: function () {
                var pointid = $('body').find('.swiper-slide-active').data('pointid');
                YZQ_MONITOR.pointClick(pointid); //埋点上报
                var _pitType = $('.swiper-slide-active').find('p').data('type');
                iconData.splice(0, iconData.length);
                if(_pitType){
                    getIconData(_pitType);
                }
                indexflag = $('.swiper-slide-active').data('swiper-slide-index');
                sessionStorage.removeItem('col_indexflag');
                sessionStorage.setItem('col_indexflag',indexflag);
            }
        });
    };

    /**
     * 滑动加载数据
     */
    var ScrollLoadData = function ()
    {
        //YZQ_COMMON.ScrollLoadData(function text() {
        //    var _length = $('.neirong').find('li').length;
        //    var _minId = $('.neirong').find('li:last').data('id');
        //    getIconData(collectionType, _minId);
        //});
        $('#collection').find("ul").dropload({
            scrollArea : window,
            loadDownFn : function(me){
                var _length = $('.neirong').find('li').length;
                var _minId = $('.neirong').find('li:last').data('id');
                getIconData(collectionType, _minId,me);
            }
        });
    }();

    /**
     * 注册点击事件监听
     */
    var registerClickListener = function ()
    {
        $(".collection").on('click', '.neirong li', function () {
            YZQ_MONITOR.pointClick(event);//埋点上报
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
                isbhide: true,
                isfull: false,
                iconright : 0
            };
            YZQ_UTILS.pageSwitchMethod(data);
        });
    }();
    //文章点击上报
    $('body').on('click','.neirong .clearfix li',function(){
        var pointid = $(this).data('pointid');
        YZQ_MONITOR.pointClick(pointid); //埋点上报
    });
}());