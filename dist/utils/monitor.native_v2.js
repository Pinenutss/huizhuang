var YZQ_MONITOR=function(e,t){var a=0,o=null,n=null,r=0,s={},i=0,l=function(e){var t="";switch(e){case 0:t="http://report.rls.huizhuang.com";break;case 1:t="http://report.live.huizhuang.com";break;case 2:t="http://report.huizhuang.com"}return a=t};l(a);var c=YZQ_UTILS.getPlatformMethod(),m=function(e){if(null!=e){n=JSON.parse(HZ_APP_JSSDK.getUserInfo());var t=n.appid,o=n.machineid;if((null!=n.channel||""!=n.channel)&&(i=n.channel),1==c){var r="";if(null==sessionStorage.getItem("num")){try{r=HZ_APP_JSSDK.getCounterFromClient();var s=JSON.parse(r).counter}catch(l){console.log("错误是"+l)}$.ajax({url:a+"/getseq.do",dataType:"json",type:"GET",xhrFields:{withCredentials:!1},data:{appid:t,machineid:o},crossDomain:!0,success:function(e){if(console.log(e),200==e.status){var t=e.data.seq;try{sessionStorage.setItem("seq",t),sessionStorage.setItem("num",parseInt(s)+1),g()}catch(a){console(a)}}},error:function(e){console.log(e)}})}else g()}else if(null==localStorage.getItem("num")){try{r=HZ_APP_JSSDK.getCounterFromClient()}catch(l){console.log("错误是"+l)}$.ajax({url:a+"/getseq.do",dataType:"json",type:"GET",xhrFields:{withCredentials:!1},data:{appid:t,machineid:o},crossDomain:!0,success:function(e){if(console.log(e),200==e.status){var t=e.data.seq;localStorage.setItem("seq",t),localStorage.setItem("num",parseInt(r)+1),g()}},error:function(e){console.log(e)}})}else r=HZ_APP_JSSDK.getCounterFromClient(),g()}},g=function(){try{var e=S-d,t={pvtime:e},a="";1==c?(a=sessionStorage.getItem("seq")+"_"+sessionStorage.getItem("num"),null!=sessionStorage.getItem("atricle_pageid")&&(r=sessionStorage.getItem("atricle_pageid"))):(a=localStorage.getItem("seq")+"_"+localStorage.getItem("num"),null!=localStorage.getItem("atricle_pageid")&&(r=localStorage.getItem("atricle_pageid")));var o={createtime:(new Date).valueOf(),type:1,platform:n.platform,channel:n.channel,appid:n.appid,siteid:n.site_id,objectid:r,userid:n.userid,machineid:n.machineid,network:n.network,gpsx:n.lat,gpsy:n.lng,seqid:a,other:JSON.stringify(t)},s="";1==c?(s=parseInt(sessionStorage.getItem("num")),sessionStorage.removeItem("num"),sessionStorage.setItem("num",s+1)):(s=parseInt(localStorage.getItem("num")),localStorage.removeItem("num"),localStorage.setItem("num",s+1)),u(o)}catch(i){console.log(i)}},u=function(e){var t=[];t.push(e),$.ajax({url:a+"/pvcv.do",dataType:"json",type:"POST",xhrFields:{withCredentials:!1},data:{data:JSON.stringify(t)},crossDomain:!0,success:function(e){console.log(e)},error:function(e){console.log(e)}})};t.pointClick=function(e){try{p(e)}catch(t){console.log(t)}},t.BackPointClick=function(e){p(e)};var p=function(e){try{var t=JSON.parse(HZ_APP_JSSDK.getUserInfo()),a="";a=1==c?sessionStorage.getItem("seq")+"_"+sessionStorage.getItem("num"):localStorage.getItem("seq")+"_"+localStorage.getItem("num");var o={createtime:(new Date).valueOf(),type:2,channel:i,appid:t.appid,userid:t.userid,machineid:t.machineid,objectid:e,platform:t.platform,gpsx:t.lat,gpsy:t.lng,network:t.network,siteid:t.site_id,seqid:a},n="";1==c?(n=parseInt(sessionStorage.getItem("num")),sessionStorage.removeItem("num"),sessionStorage.setItem("num",n+1)):(n=parseInt(localStorage.getItem("num")),localStorage.removeItem("num"),localStorage.setItem("num",n+1))}catch(r){console.log(r)}u(o)};t.initMonitor=function(t,a){d=t,S=a,null!==e.HZ_APP_JSSDK?(o="HZ_APP_JSSDK",m(o)):o=null};var d="",S="";return function(){for(var t=null,a=document.getElementsByTagName("script"),o=0;o<a.length;o++)if(t=a[o].src){var n=t.match(/\/monitor.native.js.*[?&]pageid=(\d+)/);if(n&&n[1]){var i=function(e){var t=document.createElement("a");return t.href=e,{params:function(){for(var e,a={},o=t.search.replace(/^\?/,"").split("&"),n=o.length,r=0;n>r;r++)o[r]&&(e=o[r].split("="),a[e[0]]=e[1]);return a}()}},l=i(n.input).params;r=l.pageid;break}}e.performance&&(s=e.performance)}(),t}(window,window.YZQ_UTILS=window.YZQ_UTILS||{});