/**
 * Created by zwp on 2015/11/26.
 * namespace: YZQ_DISCUSS
 * use: DISCUSS.HTML
 * @author   : cy
 * @datetime : 2015/11/26
 * @version  : 1.0.0
 */
;
(function () {

    var plate = 1,
        page = 1,
        relDatas = [];

    var getDiscussData = function (_page, _plate,me) {

        YZQ_UTILS.AJAXRequest(
            '/index/Card/cardList.do',
            'POST', {
                plate: _plate,
                num: 5,
                page: _page
            },
            function (data) {
                page++;
                var discussDatas = data.data;
				if(discussDatas.length == undefined){
					YZQ_COMMON.tips('暂无更多数据!');
					};
                for (var i = 0, len = discussDatas.length; i < len; i++) {

                    var discussData = discussDatas[i],
                        dataType = 'YYYY-MM-DD';

                    discussData.release_time = YZQ_COMMON.formateTime(discussData.release_time, dataType);
                    discussData.card_type = getDiscussCardType(discussData.card_type);

                    relDatas.push(discussData);
                    if(_page ==1){
                        YZQ_COMMON.Loading(false,"");
                    }

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

    var getDiscussCardType = function (type) {
        var cardType = '';
        switch (Number(type)) {
        case 1:
            cardType = '<ins class="ding">置顶</ins>';
            break;
        case 2:
            cardType = '<ins class="replay-yet">已回复</ins>';
            break;
        case 3:
            cardType = '<ins class="jing">精</ins>';
            break;
        case 4:
            cardType = '<ins class="re">热</ins>';
            break;
        case 5:
            cardType = '<ins class="jian">荐</ins>';
            break;
        default:
            cardType = '';
            break;
        };

        return cardType;
    };

    getDiscussData(page, plate);

    var vm = new Vue({
        el: '#discuss',
        data: {
            datas: relDatas
        }
    });

    //跳转帖子讨论
    var ClickJump = function () {
        $('body').on('click', '.nextPage', function () {
            var _url = ("discuss-de.html?card_id=" + ($(this).data('urlid')));
            var _title = "讨论详情";
            var data = {
                baseurl: WEB_CONFIG.NATIVE_JUMP(),
                page: _url,
                title: _title,
                isthide: false,
                isbhide: true,
                isfull: false,
                iconright : 0
            };
            YZQ_UTILS.pageSwitchMethod(data);
            return false;

        });
    }();

    //滑动加载数据
    var ScrollLoadData = function () {
        //YZQ_COMMON.ScrollLoadData(function text() {
        //    getDiscussData(page, plate);
        //});
		$('.discuss-list').dropload({
			scrollArea : window,
			loadDownFn : function(me){
				getDiscussData(page, plate,me);
				}
			});
    }();
    /**
     * 点击头像跳转到个人主页
     */
    $('.discuss-list').on('click','.head-img',function (){
        var userId = $(this).data('user_id'),
            junmpurl = 'my-page.html?userid='+ userId;
//        location.href = junmpurl;
        var data = {
            baseurl:  WEB_CONFIG.NATIVE_JUMP() ,
            page:   junmpurl,
            title:  "个人主页",
            isthide:    true,
            isbhide:    true,
            isfull:     false,
            iconright : 0
        };
        YZQ_UTILS.pageSwitchMethod(data);
        return false;
    });
    var target = '.discuss-list';
    YZQ_COMMON.Loading(true,target);
}());