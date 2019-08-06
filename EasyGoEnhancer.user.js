// ==UserScript==
// @name         EasyGoEnhancer
// @icon         http://www.ascendacpa.com.cn/favicon.ico
// @homepage     https://github.com/maoger/EasyGoEnhancer
// @version      3.7
// @description  Make EasyGo to be easier to go.
// @author       Maoger
// @match        http*://*.ascendacpa.com.cn/*
// @match        http*://10.131.0.7/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @updateURL    https://openuserjs.org/meta/maoger/EasyGoEnhancer.meta.js
// @grant        GM_openInTab
// @copyright    2016, maoger (https://openuserjs.org/users/maoger)
// @license      MIT

// ==/UserScript==

window.onload = function(){
    $("title").html("EasyGo | Maoger");
    if ($(".NewTitle1").length > 0){
        load_working_hours();
        load_toDoList();
    }
    else if (window.location.href.indexOf('/Confirmation.aspx') >= 0){
        download_multi();
    }
    else if (window.location.href.indexOf('/ConfirmationEdit.aspx') >= 0 ){
        download_auto();
    }
    else if (window.location.href.indexOf('/Acpa/') >= 0 ){
        fix_printer();
    }
    else{
        console.log('欢迎使用EasyGoEnhancer,详情请见：http://www.maoyanqing.com/download/easygoenhancer.html')
    }
}
function load_toDoList() {
    'use strict';
    var DBSX_url = "/MoreTask3.aspx";
    var toDoList_names = ["业务项目","业务报告","人文财务","独立性","综合"];
    var fake_tags = $(".NewTitle1");
    var DBSX_container = $("<div/>");
    if (fake_tags.length === 0) return;
    fake_tags.children().not(":first").remove();
    DBSX_container.insertAfter(fake_tags);
    var load_container = $("<div/>")
        .addClass("barSpace")
        .css({
            "margin" : "0.25px 0px",
            "background" : "grey",
            "border-radius" : "1px",
        });
    load_container.insertAfter(fake_tags);
    var bar = $("<span/>")
        .attr("id" , "barsmooth" )
        .addClass("smooth")
        .css({
            "height" : "0.25px",
            "width" : "0%",
            "border-radius" : "1px",
            "display" : "block",
            "box-shadow" : "0px 0px 10px 1px #CC66FF",
            "background-color" : "#fff"
        });
    load_container.append(bar);
    var DTBB = $('<a/>')
        .attr("href","/Module/Framework/Acpa/Project/UserScheduleDynamic.aspx")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("动态报备");
    fake_tags.append(DTBB);
    var SBGS = $('<a/>')
        .attr("href","/Module/Framework/Acpa/Manhour/report.aspx")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("申报工时");
    fake_tags.append(SBGS);
    var XMYD = $('<a/>')
        .attr("href","/Module/Framework/Acpa/ClientInfo/ProFieldNav.aspx")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("项目园地<span style='font-family:Calibri; font-size: 12px; color: #9E9E9E'>「询证函下载入口」</span>");
    fake_tags.append(XMYD);
    var m = 0;
    for (var i = 0; i<toDoList_names.length; i++) {
        var name = toDoList_names[i];
        var elt = $("<table/>")
        .attr("data-name", name)
        .addClass("tablebox")
        .css({
            "text-align": "left"
        })
        .html("<span>正在加载<b>" + name + "</b>中，请稍候...</span>");
        DBSX_container.append(elt);
        var PerUrl = DBSX_url + "?ind=" + (i+1).toString() + " " + "#tabContent__" + i.toString() + " " + "div:first tr:gt(0)";
        elt.load(PerUrl, function(responseTxt , statusTxt , xhr) {
            if (statusTxt === "success") {
                var loadingRate = self.setInterval(function (){
                    if ( m < (i-1)*20 ) {
                        m = (i-1)*20;
                        bar.css("width",m.toString() + "%");
                    }
                    else if ( m < i*20 ){
                        m = m + 0.1;
                        bar.css("width",m.toString() + "%");
                    }
                    else{
                        console.log('欢迎使用EasyGoEnhancer,详情请见：http://www.maoyanqing.com/download/easygoenhancer.html')
                    }
                    if ( m >= 100 ) {
                        clearInterval(loadingRate);
                        setTimeout(function(){
                            load_container.css("margin","0px");
                            bar.css({"width" : "0%","height":"0px"});
                        },600);
                    }
                },10);
            }
            if (statusTxt === "error") {
                $(this).html('<span style="color: red;">加载<b>' + $(this).attr("data-name") + '</b>失败！</span>');
            }
        });
    }
}
function load_working_hours(){
    'use strict';
    var fake_tags = $(".NewTitle1");
    var GSGL_url = "/Module/Framework/Acpa/Manhour/report.aspx";
    var GSGL_container = $("<span/>").html("本月已工作：");
    var GSGL_wb1 = $("<td/>").html("&nbsp;个小时，");
    var GSGL_cc = $("<td/>").html("本月已出差：");
    var GSGL_wb2 = $("<td/>").html("&nbsp;天。");
    var GSGL_gs = $("<a/>")
        .attr("href","/Module/Framework/Acpa/Manhour/report.aspx")
        .css({
            "font-weight":"bold",
            "color":"red"
        });
    var GSGL_trip = $("<a/>")
        .attr("href","/Module/Framework/Acpa/Manhour/report.aspx")
        .css({
            "font-weight":"bold",
            "color":"red"
        });
    GSGL_container.insertBefore(fake_tags);
    GSGL_container.append(GSGL_gs);
    GSGL_wb1.insertAfter(GSGL_gs);
    GSGL_cc.insertAfter(GSGL_wb1);
    GSGL_trip.insertAfter(GSGL_cc);
    GSGL_wb2.insertAfter(GSGL_trip);
    var GSGL_gs_rul = GSGL_url + " " + "#tabContent__0 div:eq(1) tr:last td:eq(1)";
    GSGL_gs.load(GSGL_gs_rul);
    var GSGL_trip_url = GSGL_url + " " + "#tabContent__0 div:eq(1) tr:last td:eq(2)";
    GSGL_trip.load(GSGL_trip_url);
}
function getBlob(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            }
        };
        xhr.send();
    });
}
function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement('a');
        const body = document.querySelector('body');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
    }
}
function download(url, filename) {
    getBlob(url).then(blob => {
        saveAs(blob, filename);
    });
}
function download_multi(){
    'use strict';
    var dingWei_multi = $("#ctl00_PageBody_lblFullName");
    var mao_downloader_multi = $("<button/>")
        .attr('type','button')
        .html("<span style='font-family:Calibri; font-size: 14px; color: #9932CD'>一键下载 \>\>以下全部询证函</span>");
    mao_downloader_multi.insertAfter(dingWei_multi);
    var dingWei_title = $("#ctl00_PageBody_AspNetPager1");
    var mao_reminder_multi = $("<td/>")
        .html("<br/><hr/><strong>Notes:</strong><br/><span style='font-family:Calibri; font-size: 12px; color: #9E9E9E'>1、提示<br/>点击上述【查询】按钮，查看更多选项；比如：可以按照 “回函扫描创建日期” 、 “回函收件人” 等，先筛选回函结果，再下载……<br/><br/>2、建议<br/>①将浏览器设置为静默下载（取消“每次下载前提示保存位置”）；<br/>②设置浏览器为“始终允许此网站的弹出式窗口”。<br/><br/>3、受限于网速，反应可能会比较慢……请耐心等待全部下载完成后，再关闭后续的子页面。<br/><br/>4、更多信息，详见：<a target='_blank' href='http://www.maoyanqing.com/download/easygoenhancer.html' style='font-family: Calibri; font-size: 12px; color: #0000cc;'>EasyGoEnhancer官网</a></span>");
    mao_reminder_multi.insertAfter(dingWei_title);
    mao_downloader_multi.click(function(){
        var c ='';
        var hrefArr = document.getElementsByTagName('a');
        for ( var i=0; i<hrefArr.length; i++ ){
            c = hrefArr[i].href;
            if (c.indexOf("ID")>=0){
                window.open(c);
            }
        }
    });
}
function download_auto() {
    'use strict';
    var letter_id = $('#ctl00_PageBody_lblConfID').text();
    var letter_name = $('#ctl00_PageBody_txtConfirmationName').val();
    var filename = '';
    var dingWei_perID = $("#ctl00_PageBody_lblConfID");
    var mao_reminder_perID = $("<span/>")
        .html("<span style='font-style:italic; font-family:Calibri; font-size: 14px; color: #CDCDCD'>&nbsp;&nbsp;&nbsp;&nbsp;已开始静默下载，稍等片刻……</span>");
    var mao_nothing_perID = $("<span/>")
        .html("<span style='font-style:italic; font-family:Calibri; font-size: 14px; color: #EEA9B8'>&nbsp;&nbsp;&nbsp;&nbsp;暂未回函！如果已发函很长时间了，请尽快催函，或加强催函力度……</span>");
    var url = '';
    var c ='';
    var hrefArr = document.getElementsByTagName('a');
    var file_split = [];
    var file_type = '';
    var file_type_arr = ['pdf','PDF','jpg','JPG'];
    for ( var i=0; i<hrefArr.length; i++ ){
        c = hrefArr[i].href;
        file_split = c.split(".");
        file_type = file_split[file_split.length - 1];
        if (file_type_arr.includes(file_type)){
            url = c;
            break;
        }
    }
    if (url ==''){
        mao_nothing_perID.insertAfter(dingWei_perID );
    }
    else{
        mao_reminder_perID.insertAfter(dingWei_perID );
        var j = 0;
        for (i=0; i<hrefArr.length; i++ ){
            c = hrefArr[i].href;
            file_split = c.split(".");
            file_type = file_split[file_split.length - 1];
            if (file_type_arr.includes(file_type)){
                url = c;
                j = j + 1;
                if (j == 1){
                    filename = letter_id + '_' + letter_name + '.' + file_type;
                }
                else{
                    filename = letter_id + '_' + letter_name + '_' + j.toString() + '.' + file_type;
                }
            download(url,filename);
            }
        }
        setTimeout(close_tab,60000);
    }
}
function close_tab(){
    window.opener=null;
    window.open('','_self');
    window.close();
}
function fix_printer(){
    'use strict';
    var btn =  $("#Button1");
    if (btn.val().indexOf("打印") >= 0){
        btn.removeAttr("onclick");
        btn.attr("onclick","window.print();");
    }
    btn =  $("#Button2");
    if (btn.val().indexOf("打印") >= 0){
        btn.removeAttr("onclick");
        btn.attr("onclick","window.print();");
    }
    btn =  $("#Button3");
    if (btn.val().indexOf("打印") >= 0){
        btn.removeAttr("onclick");
        btn.attr("onclick","window.print();");
    }
}