/**
 * Created by cy on 2015/11/26.
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

    var getDiscussData = function (_page, _plate) {

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
                for (var i = 0, len = discussDatas.length; i < len; i++) {

                    var discussData = discussDatas[i],
                        dataType = 'YYYY-MM-DD';

                    discussData.add_time = YZQ_COMMON.formateTime(discussData.add_time, dataType);
                    discussData.card_type = getDiscussCardType(discussData.card_type);

                    relDatas.push(discussData);
                }
            },
            function (error) {
                console.log(error);
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
                isbhide: false,
                isfull: false
            };
            YZQ_UTILS.pageSwitchMethod(data);
            return false;

        });
    }();


    //滑动加载数据
    var ScrollLoadData = function () {
        YZQ_COMMON.ScrollLoadData(function text() {
            getDiscussData(page, plate);
        });
    }();
}());