var YZQ_COMMON=function(e,t){return t.modifyImgSource=function(e){var t=null;if(null==e||""==e){var e="http://hzserver-10006163.image.myqcloud.com/9d4ccbe5-b16f-44ae-96f8-44539de2bb34";t=e+"?max_age=19830212&d=20151230193947"}else t=e.indexOf("hzyzq")>=0?e+"/wlist?max_age=19830212&d=20151230193947":e+"?max_age=19830212&d=20151230193947";return t},t.ScrollLoadData=function(t){var o=function(){var e=0,t=0,o=0;return document.body&&(t=document.body.scrollTop),document.documentElement&&(o=document.documentElement.scrollTop),e=t-o>0?t:o},n=function(){var e=0;return e="CSS1Compat"==document.compatMode?document.documentElement.clientHeight:document.body.clientHeight},a=function(){var e=document.body.scrollHeight;return e};return e.onscroll=function(){var e=o()+n(),r=a();e==r&&t()}},t.formateTime=function(e,t){var o=new Date(1e3*e);Y=o.getFullYear()+"-",M=(o.getMonth()+1<10?"0"+(o.getMonth()+1):o.getMonth()+1)+"-",D=(o.getDate()<10?"0"+o.getDate():o.getDate())+" ",h=(o.getHours()<10?"0"+o.getHours():o.getHours())+":",m=(o.getMinutes()<10?"0"+o.getMinutes():o.getMinutes())+":",s=o.getSeconds()<10?"0"+o.getSeconds():o.getSeconds();var n="";switch(t){case"YYYY-MM-DD":n=Y+M+D;break;case"YYYY-MM-DD h:m:s":n=Y+M+D+h+m+s}return n},t.parseURI=function(){var t=e.location.href,o=document.createElement("a");return o.href=t,{source:t,protocol:o.protocol.replace(":",""),host:o.hostname,port:o.port,query:o.search,params:function(){for(var e,t={},n=o.search.replace(/^\?/,"").split("&"),a=n.length,r=0;a>r;r++)n[r]&&(e=n[r].split("="),t[e[0]]=e[1]);return t}(),file:(o.pathname.match(/\/([^\/?#]+)$/i)||[,""])[1],hash:o.hash.replace("#",""),path:o.pathname.replace(/^([^\/])/,"/$1"),relative:(o.href.match(/tps?:\/\/[^\/]+(.+)/)||[,""])[1],segments:o.pathname.replace(/^\//,"").split("/")}},t.tips=function(t){if(!($(".ui-poptips").length>=1)){var o="";o+='<div class="ui-poptips pop-show" id="pop4">',o+='<div class="ui-poptips-cnt">'+t+"</div>",o+="</div>",$("body").append(o),e.setTimeout(function(){$(".ui-poptips").remove()},3e3)}},t.Loading=function(e,t){1==e?$(t).prepend('<div class="dropload-down" style="transition: all 300ms; height: 50px;"><div class="dropload-load"><span class="loading"></span>加载中...</div></div>'):$(".dropload-down").remove()},t}(window,window.YZQ_COMMON=window.YZQ_COMMON||{});