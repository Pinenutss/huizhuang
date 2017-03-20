/**
 * Created by zwp on 2015/12/3.
 * namespace: YZQ_DIARY
 * use: SEND.HTML
 * @author   : zwp
 * @datetime : 2015/12/03
 * @version  : 1.0.0
 */;
(function(){
    //上传图片
    $('body').on('click','.add',function(){
        HZ_APP_JSSDK.showPreview();
//        var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
//        $('#js_content').val(_userInfo);
    //移动到回调函数中
    var divstr = '<div class="picbox" style="background-image:url(http://hzyzq-10006163.image.myqcloud.com/c57ae1e6-9b15-43c7-b52b-cefe9f5eba42/thumbnail)"><button class="btn-del" data-pointid="6"></button></div>';
    $('.upload').prepend(divstr);

        //选图回调函数
        function get_smallImg (msg){
            $('#js_content').val(msg);
            alert("回调");
            $('#js_content').val("huidiao");
            return msg;
        }
    });
    $('body').on('click','.btn-del',function(){
        $(this).parent().remove();
    });

    //测试发帖
    $('#js_text').click(function(){
        SendDisscuss();
    });

    //发帖
    var SendDisscuss =function(){
        if($('#js_title').val()==""){
            YZQ_COMMON.tips("请输入标题");
        }else{
            if($('#js_content').val()==""){
               YZQ_COMMON.tips("帖子内容不能为空");
            }else{
                alert("此处发帖");
                var title = $('#js_title').val();
                var cont = $('#js_content').val();
                var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());
                var user_id = _userInfo.user_id;
               // var user_id = "99999";
                YZQ_UTILS.AJAXRequest(
                    '/index/Card/sendCard.do',
                    "post",
                    {
                        title:title,
                        content:cont,
                        imgs:"",
                        user_id:user_id,
                        type:1
                    },
                    function(data){
                        console.log(data);
                    },
                    function(error){}
                )
            }
        }
    };







}());