/**
 * Created by zwp on 2015/12/1.
 * 帖子讨论
 */
;
var discuss_de = function(){
    var discussData =  new Array();//帖子详情绑定数据的数组
    var discussLitsData =  new Array();//帖子详情绑定数据的数组
    var tiezi_userid = "";//贴主的用户id
    var reply_victor_replyid = "";//回复的对象id (如果是帖子就为空 如果是对评论的回复进行回复 这该字段是评论的id)
    var reply_victor_userid ="";//回复对象的用户id (如果是对评论的回复进行回复 这该字段是评论的用户id)
    var reply_victor_commentid = "";//回复的回复的id(不是就为空)
    var replyflag = "";//回复对象的标志， 1 对帖子回复，2 点击图标评论  3点击行回复
    var replynode = "";//回复评论的this节点
    //获取帖子详情
    var GetDisscussInfo = function(){
        var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
        var user_id =_userInfo.user_id;
        if (user_id == ""||user_id == null){
            user_id = _userInfo.machineid;
        }
        //var user_id =130;
        var t =YZQ_COMMON.parseURI().params;
        var _cardid = t.card_id;//网址解析出来的帖子ID
        YZQ_UTILS.AJAXRequest(
            '/index/Card/cardDetail.do',
            'post',
            {
                card_id:_cardid,//620
                user_id:user_id//userid0.
            },
            function(result){
                var infodata =  result.data;
                tiezi_userid = infodata.user_id;//存发贴人id
                //处理数据
                var _type = "YYYY-MM-DD";
                infodata.card_add_time=YZQ_COMMON.formateTime(infodata.card_add_time,_type);
                if (infodata.user_head_img ==""||infodata.user_head_img ==null){
                    infodata.user_head_img ="http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                }
                //日记图片
                if (infodata.imgs.length>0){
                    for (i=0; i<infodata.imgs.length&&i<9; i++){
                        if(infodata.imgs[i].img_url ==""||infodata.imgs[i].img_url ==null){
                            infodata.imgs[i].img_url="http://placehold.it/10x10";
                        }
                    }
                    infodata.imgs.splice(9,100);
                }
                //最近点赞人 最多3个
                if(infodata.praises.length>0){
                    var len = "";
                    if(infodata.praises.length>3){
                        len = 3;
                    }else{
                        len = infodata.praises.length;
                    }console.log(len);
                    for (j=0; j<len; j++){
                        if(infodata.praises[j].praise_user_head ==""||infodata.praises[j].praise_user_head ==null){
                            infodata.praises[j].praise_user_head="http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                        }
                    }
                    infodata.praises.splice(3,10000);
                }
                //判断浏览人是否点赞帖子
                if(infodata.is_praise ==0){
                    infodata.ifpraise = "dian-zan";
                    infodata.ifpraiseico ="ico-zan";
                    infodata.ifpraiseword = "点赞";
                }else{
                    infodata.ifpraise = "dian-zan-yet";
                    infodata.ifpraiseico ="ico-zan-yet";
                    infodata.ifpraiseword = "已赞";
                }
                discussData.push(infodata);
            },
            function(error){
                console.log(error);
            }
        )
    }();
    //获取帖子评论
    var GetDisscussList =function(){
        var t =YZQ_COMMON.parseURI().params;
        var _cardid = t.card_id;//网址解析出来的帖子ID
        var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
        var user_id =_userInfo.user_id;
        if (user_id == ""||user_id == null){
            user_id = _userInfo.machineid;
        }
        //var user_id = 130;
        YZQ_UTILS.AJAXRequest(
            '/index/Card/getDiscussInfo.do',
            'post',
            {
                card_id:_cardid//cardid
                ,user_id:user_id

            },
            function(result){
                var data = result.data;
                if(data.length!= 0){
                    for (k=0; k<data.length; k++){
                        //处理时间
                        var _type = "YYYY-MM-DD";
                        data[k][0].add_time=YZQ_COMMON.formateTime(data[k][0].add_time,_type);
                        //处理点赞
                        if(data[k][0].is_parise == 0){
                            data[k][0].divclass = "dian-zan";
                            data[k][0].icon = "ico-zan";
                        }else{
                            data[k][0].divclass = "dian-zan-yet";
                            data[k][0].icon = "ico-zan-yet";
                        }
                        //处理用户头像为空
                        if(data[k][0].user_head_img ==""||data[k][0].user_head_img ==null){
                            data[k][0].user_head_img ="http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                        }


                    }


                    discussLitsData.push(data);
                }

            },
            function(error){}
        )
    }();
    //对帖子点赞
    $('body').on("click",'#js_toprprise',function(){
        if($('#js_toprprise').attr('class') == "dian-zan"){
            $('#js_toprprise').removeClass('dian-zan').addClass('dian-zan-yet');
            $('#js_priseico').removeClass('ico-zan').addClass('ico-zan-yet');
            $('#js_priseword').text('已赞');
            var _prisenum = parseInt($('.zan-list b').text());
            $('.zan-list b').text((_prisenum+1));
            var msgid = $(this).data("msgid");//点赞对象id
            var prise_type = 1;
            praise(msgid,prise_type);
        }
    });
    //点赞接口
    var praise =function(id,type){
        var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
        var userid = _userInfo.user_id;
        if (userid == ""||userid == null){
            userid = _userInfo.machineid;
        }
        //var userid = 130;
        YZQ_UTILS.AJAXRequest(
            '/index/Card/praise.do',
            'post',
            {
                id:id,
                user_id:userid,
                type:type//点赞类型 1:帖子 2:评论
            },
            function(result){
                console.log(result.msg);
            },
            function(error){
            }
        )
    };
    //点击回复楼主判断是否登录
    $('body').on('click','#js_replay_content',function(){
        var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
        var userid = _userInfo.user_id;
        //var userid = 130;
        if(userid==""||userid==null){
            //跳转登录
            HZ_APP_JSSDK.userloginjump();

        }else{console.log("输入文字处");
            //对帖子回复
            $('body').find('#js_cont_send').unbind("click").click(function(){
                if($('#js_replay_content').val() == ""){
                    YZQ_COMMON.tips("请先输入评论再发送");

                }else{
                    var _reply_id = "";
                    var _reply_user_id =tiezi_userid;
                    var _comment_id = "";
                    replyflag = 1;
                    replay(_reply_id,_reply_user_id,_comment_id);
                }
            });
            //对帖子中的评论回复
            $('body').find('#js_cont_sendto_victior').unbind("click").click(function(){
                if($('#js_replay_content').val() == ""){
                    YZQ_COMMON.tips("请先输入评论再发送");
                }else{
                    var _reply_id = reply_victor_replyid;
                    var _reply_user_id =reply_victor_userid;
                    var _comment_id = reply_victor_commentid;
                    replay(_reply_id,_reply_user_id,_comment_id);
                }
            });

        }
    });
    //点击回复图标
    $('body').on("click",'.ping',function(){
        $('#js_cont_send').hide();
        $('#js_cont_sendto_victior').show();
        var replay_name = $(this).data("victorname");
        $('#js_replay_content').attr('placeholder','回复'+replay_name);
        reply_victor_commentid ="";
        reply_victor_replyid =$(this).data("replyid");
        reply_victor_userid=$(this).data("victorid");
        replynode =$(this).parent().parent();
        replyflag = 2;
    });
    //行点击回复
    $('body').on("click",'.js_reply_msg',function(){
        $('#js_cont_send').hide();
        $('#js_cont_sendto_victior').show();
        var replay_name = $(this).data("victorname");
        reply_victor_replyid =$(this).data("replyid");
        reply_victor_userid=$(this).data("victorid");
        reply_victor_commentid =$(this).data("commentid");
        $('#js_replay_content').attr('placeholder','回复'+replay_name);
        replynode =$(this).parent();
        replyflag = 3;
    });
    //对用户评论点赞
    $('.comment').on("click",'.userprise',function(){
        var _priseid = $(this).data("userprise");
        var _type = 2;
        var classname = $(this).attr('class');
        if(classname.indexOf("ico-zan-yet")<0){
            $(this).removeClass("ico-zan").addClass('ico-zan-yet');
            $(this).unbind("click");
            $(this).parent().removeClass("dian-zan").addClass("dian-zan-yet");
            var num =  $(this).parent().find('.prise_num').text();
            var intmun = parseInt(num);
            $(this).parent().find('.prise_num').text((intmun+1));
            praise(_priseid,_type);
        }
    });
    //回复评论
    var replay = function(_reply_id,reply_user_id,comment_id){
        var _userInfo = JSON.parse(HZ_APP_JSSDK.getUserInfo());//获取用户信息
        var user_id =_userInfo.user_id;
       // var user_id =130;
        var _cont = $('#js_replay_content').val();
        var t =YZQ_COMMON.parseURI().params;
        var _cardid = t.card_id;//网址解析出来的帖子ID
        YZQ_UTILS.AJAXRequest(
            '/index/Card/discuss.do',
            'post',
            {
                card_id:_cardid,//帖子id
                reply_id:_reply_id,//回复的对象id (如果是对评论的回复进行回复 这该字段是评论的id)
                reply_user_id:reply_user_id,//回复对象的用户id (如果是对评论的回复进行回复 这该字段是评论的用户id)
                user_id:user_id,//user_id,//评论,回复用户id
                content:_cont,//内容
                comment_id:comment_id
            },
            function(result){
                console.log(result.data);
                if(result.status == 200){
                    var data = result.data;console.log(replyflag);
                    //回复楼主
                    if(replyflag == 1){
                        var _type = "YYYY-MM-DD";
                        var addtime = YZQ_COMMON.formateTime(data.add_time,_type);
                        if(data.user_avatar == "" || data.user_avatar == null){
                            data.user_avatar = "http://hzimg.huizhuang.com/hzone_v2/img/head-users.png";
                        }
                        var str = '';
                        str += '<li>';
                        str += '<i  class="head-img" style="background-image:url('+data.user_avatar+');"></i>';
                        str += '<div class="list-wrap">';
                        str += '<p class="name">'+data.user_name+'</p>';
                        str += '<p class="content">'+data.content+'</p>';
                        str += '<div class="list-info">';
                        str += '<time>'+addtime+'</time>';
                        str += '<div class="dian-zan"   data-pointid="4"><span class="ico-zan userprise" data-userprise="'+data.id+'"></span><span class="prise_num">0</span></div>';
                        str += '<div class="ping"   data-victorid="'+data.user_id+'" data-replyid ="'+data.user_id+'" data-victorname="'+data.user_name+'" data-pointid="6"><span class="ico-ping-hot"></span></div>';
                        str += '</div>';
                        str += '</li>';
                        $('.discuss-list').append(str);
                        $('#js_replay_content').val('');
                    }
                    //点击图标回复
                    if(replyflag == 2){
                        if(replynode.find('.replay').length == 0){
                            var addnewnode = "";
                            addnewnode += '<div class="replay" >';
                            addnewnode += '<span class="ico-jian"></span>';
                            addnewnode += '<ul>';
                            addnewnode += '<li data-pointid="5"  class="js_reply_msg" data-commentid="'+data.id+'" data-victorid="'+data.user_id+'" data-victorname="'+data.user_name+'" data-replyid ="'+data.reply_id+'"><b>'+data.user_name+'</b>回复<b>'+data.reply_user_name+'</b><i class="ico-lou"></i><span>：'+data.content+'</span></li>';
                            addnewnode += '</ul>';
                            addnewnode += '</div>';
                            replynode.append(addnewnode);
                        }else{
                            var parentnode = replynode.find('.replay ul');
                            var iconreplaystr = '<li data-pointid="5"  class="js_reply_msg" data-commentid="'+data.id+'" data-victorid="'+data.user_id+'" data-victorname="'+data.user_name+'" data-replyid ="'+data.reply_id+'"><b>'+data.user_name+'</b>回复<b>'+data.reply_user_name+'</b><i class="ico-lou"></i><span>：'+data.content+'</span></li>';
                            parentnode.append(iconreplaystr);
                        }
                        $('#js_replay_content').val('');
                    }
                    //行点击回复
                    if(replyflag == 3){
                        var linestr = '<li data-pointid="5"  class="js_reply_msg" data-commentid="'+data.id+'" data-victorid="'+data.user_id+'" data-victorname="'+data.user_name+'" data-replyid ="'+data.reply_id+'"><b>'+data.user_name+'</b>回复<b>'+data.reply_user_name+'</b><i class="ico-lou"></i><span>：'+data.content+'</span></li>';
                        replynode.append(linestr);
                        $('#js_replay_content').val('');
                    }

                    YZQ_COMMON.tips("回复成功");
                }
               // window.location.reload();
            },
            function(error){
            }
        );
    };
    //初始化帖子详情vjs
    var vm_list = new Vue({
        el: '.comment',
        data:{
            datalist:discussLitsData
        }
    });
    //初始化帖子详情vjs
    var vm = new Vue({
        el: '.discuss-de',
        data:{
            datas:discussData
        }
    });
}();