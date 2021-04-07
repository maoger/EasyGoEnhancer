// ==UserScript==
// @name         EasyGoEnhancer
// @icon         http://www.ascendacpa.com.cn/favicon.ico
// @homepage     https://github.com/maoger/EasyGoEnhancer
// @version      4.0.6
// @description  Make EasyGo easier to go.
// @author       Maoger
// @match        http*://*.ascendacpa.com.cn/*
// @match        http*://10.131.0.7/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/font-awesome/5.15.3/js/all.min.js
// @resource     https://cdn.bootcdn.net/ajax/libs/font-awesome/5.15.3/css/all.min.css
// @updateURL    https://openuserjs.org/meta/maoger/EasyGoEnhancer.meta.js
// @copyright    2016-2021, maoger (https://openuserjs.org/users/maoger)
// @license      MIT

// ==/UserScript==

EasyGoEnhancer_main();
function EasyGoEnhancer_main(){
    'use strict';
    $('title').html('EasyGo | maoyanqing.com');
    if (window.location.href.indexOf('/NewRight4.aspx') >= 0 ){
        Homepage_LoadJudge();
    }
    if (window.location.href.indexOf('/Confirmation.aspx') >= 0){
        Letter_DownloadMulti();
        Letter_SaveUrl();
    }
    if (window.location.href.indexOf('/ConfirmationEdit.aspx') >= 0 ){
        Letter_DownloadSingleAuto();
    }
    if (window.location.href.indexOf('/ConfirmationEdit2014.aspx?ID=') >= 0 ){
        Letter_DownloadNoBarcode();
    }
    if (window.location.href.indexOf('/RiskManagement/') >= 0){
        $('title').html('EasyGo');
        Fix_PrinterButton();
    }
    if (window.location.href.indexOf('/CheckBill.aspx?ProjectId=') >= 0){
        CheckBill_IntelligentSelector();
    }
};
function Homepage_LoadJudge(){
    Homepage_LoadSwitch();
    if (window.localStorage) {
        var load_config = localStorage.homepage_load_config;
        if(load_config == 'on' || load_config == undefined){
            Homepage_LoadWorkingHours();
            Homepage_LoadToDoList();
        }
    };
};
function Homepage_LoadSwitch(){
    var active_html = '<i class="far fa-eye"></i>';
    var inactive_html = '<i class="far fa-eye-slash"></i>';
    var active_color = '#009cde';
    var inactive_color = '#bbbbbb';
    if (window.localStorage) {
        var load_config = localStorage.homepage_load_config;
        if (load_config == undefined){
            load_config = 'on';
        };
    };
    var ele_html = '';
    var ele_color = '';
    if (load_config == 'on'){
        ele_html = active_html;
        ele_color = active_color;
    }
    else {
        ele_html = inactive_html;
        ele_color = inactive_color;
    };
    var ele_location = $('div.NewTitle1 > a:nth-child(1)');
    var ele = $('<a/>')
        .css({
            'margin-right': '2px',
            'color': ele_color,
            })
        .html(ele_html);
    ele.insertBefore(ele_location);
    ele.click(function(){
        if (load_config == 'on'){
            this.innerHTML = inactive_html;
            this.style.color = inactive_color;
            localStorage.homepage_load_config = 'off';
            parent.RightFrame.location='NewRight4.aspx';
        }
        else {
            this.innerHTML = active_html;
            this.style.color = active_color;
            localStorage.homepage_load_config = 'on';
            parent.RightFrame.location='NewRight4.aspx';
        }
    })
};
function Homepage_LoadToDoList() {
    'use strict';
    if (window.location.href.indexOf('/NewRight4.aspx') == -1 ) return;
    var DBSX_url = "/MoreTask3.aspx";
    var toDoList_names = ["业务项目","业务报告","人文财务","独立性","综合"];
    var ele_loc_todolist = $(".NewTitle1");
    var DBSX_container = $("<div/>");
    if (ele_loc_todolist.length === 0) return;
    ele_loc_todolist.children().not(":first").remove();
    DBSX_container.insertAfter(ele_loc_todolist);
    var load_container = $("<div/>")
        .addClass("barSpace")
        .css({
            "margin" : "0.25px 0px",
            "background" : "grey",
            "border-radius" : "1px",
        });
    load_container.insertAfter(ele_loc_todolist);
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
    var DBSX = $('<a/>')
        .attr("href","/moretask3.aspx")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("待办事项");
    ele_loc_todolist.append(DBSX);
    var DTBB = $('<a/>')
        .attr("href","/Module/Framework/Acpa/Project/UserScheduleDynamic.aspx")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("<i class='far fa-check-circle'></i>&nbsp;动态报备");
    ele_loc_todolist.append(DTBB);
    var SBGS = $('<a/>')
        .attr("href","/Module/Framework/Acpa/Manhour/report.aspx")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("<i class='far fa-clock'></i>&nbsp;申报工时");
    ele_loc_todolist.append(SBGS);
    var XMYD = $('<a/>')
        .attr("href","/Module/Framework/Acpa/ClientInfo/ProFieldNav.aspx")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("<i class='fas fa-sitemap'></i>&nbsp;函证中心");
    ele_loc_todolist.append(XMYD);
    var XZHCX = $('<a/>')
        .attr("href","/Module/Framework/Acpa/Project/ConfirmationList2014.aspx")
        .attr("target","_blank")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("<i class='fas fa-search'></i>&nbsp;询证函查询");
    ele_loc_todolist.append(XZHCX);
    if (window.localStorage) {
        var letter_href = localStorage.letter_href;
        var letter_project_name = localStorage.letter_project_name;
        if (letter_href){
            if (letter_project_name == undefined){
                create_iframe(1,letter_href,0,0);
                letter_project_name = '^_^';
            }
            if(letter_project_name.length > 4){
                letter_project_name = letter_project_name.substring(0,4) + '...';
            }
            var recent_letter = $('<a/>')
                .attr("href",localStorage.letter_href)
                .attr("target","_blank")
                .css({
                "margin-right": "30px",
                "color":"#333",
                })
                .html('<i class="far fa-envelope"></i>&nbsp;询证函&nbsp;' + '[' + letter_project_name + ']');
            ele_loc_todolist.append(recent_letter);
        }
    }
    var m = 0;
    for (var i=0; i<toDoList_names.length; i++) {
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
                    else {
                        m = m + 0.1;
                        bar.css("width",m.toString() + "%");
                    }
                    if ( m >= 100 ) {
                        clearInterval(loadingRate);
                        setTimeout(function(){
                            load_container.css("margin","0px");
                            bar.css({"width" : "0%","height":"0px"});
                        },600);
                    };
                },10);
            }
            if (statusTxt === "error") {
                $(this).html('<span style="color: red;">加载<b>' + $(this).attr("data-name") + '</b>失败！</span>');
            }
        });
    }
};
function Homepage_LoadWorkingHours(){
    'use strict';
    if (window.location.href.indexOf('/NewRight4.aspx') == -1 ) return;
    var ele_loc_todolist = $(".NewTitle1");
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
    GSGL_container.insertBefore(ele_loc_todolist);
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
            };
        };
        xhr.send();
    });
};
function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    }
    else {
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
};
function download(url, filename) {
    getBlob(url).then(blob => {
        saveAs(blob, filename);
    })
};
function Letter_DownloadMulti(){
    'use strict';
    $(".menubar_title")[0].innerHTML = "<a href='//maoyanqing.com/download/easygoenhancer.html' target='_blank' style='font-family:Calibri; font-size: 26px; color: #009CDE'>EasyGoEnhancer</a>";
    var ele_footer = $("#ctl00_PageBody_AspNetPager1");
    var mao_reminder_multi = $("<td/>")
        .html("<br/><hr/><b>Notes:</b><br/><span style='font-family:Calibri; font-size: 12px; color: #9E9E9E'><b>1、筛选</b><br/>点击上述【查询】按钮，查看更多选项；<br/>比如：可以按照 “回函扫描创建日期” 、 “回函收件人” 等，先筛选回函结果，再下载...<br/><br/><b>2、建议</b><br/>将浏览器设置为静默下载（不弹出下载框），详见：<a target='_blank' href='//maoyanqing.com/download/easygoenhancer-docs.html' style='font-family: Calibri; font-size: 12px; color: #0000cc;'>开启静默下载的操作提示</a></span>");
    mao_reminder_multi.insertAfter(ele_footer);
    var ele_auditClient = $("#ctl00_PageBody_lblFullName");
    var letter_obj = {};
    var letter_obj2str = '';
    var letter_todo_num = localStorage.letter_download_mark;
    var letter_todo_page = 0;
    if (letter_todo_num == undefined){
        letter_todo_page = 0;
    }
    else{
        letter_todo_page = Math.ceil(letter_todo_num / 10);
    }
    if (letter_todo_page > 0){
        letter_obj2str = localStorage.letter_download;
        if (letter_obj2str == undefined || letter_obj2str == ''){
            letter_obj = {};
        }
        else{
            letter_obj = JSON.parse(letter_obj2str);
        }
        var letter_todo_index = localStorage.letter_download_mark;
        var letter_href = '';
        var hrefArr = document.getElementsByTagName('a');
        for ( var i=0; i<hrefArr.length; i++ ){
            letter_href = hrefArr[i].href;
            if (letter_href.indexOf('?ID=')>=0){
                letter_obj[letter_todo_index--] = letter_href;
            }
        }
        letter_obj2str = JSON.stringify(letter_obj);
        localStorage.letter_download = letter_obj2str;
        letter_todo_num = Math.max(0,letter_todo_num - 10);
        letter_todo_page = Math.ceil(letter_todo_num / 10);
        localStorage.letter_download_mark = letter_todo_num;
        if (letter_todo_page > 0){
            __doPostBack('ctl00$PageBody$AspNetPager1',letter_todo_page);
        }
    }
    if (letter_todo_num == 0){
        letter_obj2str = localStorage.letter_download;
        if (letter_obj2str == undefined || letter_obj2str == ""){
            letter_obj = {};
        }
        else{
            letter_obj = JSON.parse(letter_obj2str);
        }
        var progress_reminder = "<span style='font-family:Calibri; font-size: 14px; color: #3F9C35'>&nbsp;<i class='fas fa-spinner fa-pulse'></i>&nbsp;EasyGoEnhancer 正在为您自动下载询证函... 请耐心等待所有询证函下载完毕后再关闭本网页...</span>";
        ele_auditClient.append(progress_reminder);
        for(var p in letter_obj){
            create_iframe(p,letter_obj[p],0,0);
        }
        localStorage.removeItem('letter_download');
        localStorage.removeItem('letter_download_mark');
    }
    var letter_todo_total = $("#ctl00_PageBody_AspNetPager1 > table > tbody > tr > td:nth-child(1)").text().split("：")[1].split(" ")[0];
    if (letter_todo_total > 0 && letter_todo_num == undefined){
        var btn_download = $("<button/>")
            .attr('type','button')
            .html("<span style='font-family:Calibri; font-size: 16px; font-weight: bold; color: #009CDE'><i class='fas fa-cloud-download-alt'></i>&nbsp;点击下载</span>");
        btn_download.insertAfter(ele_auditClient);
        btn_download.click(function(){
            this.style.display = "none";
            localStorage.letter_download_mark = letter_todo_total;
            letter_todo_page = Math.ceil(letter_todo_total / 10);
            if (letter_todo_page>1){
                __doPostBack('ctl00$PageBody$AspNetPager1',letter_todo_page);
            }
            else {
                location.reload();
            }
        })
    }
};
function create_iframe(id,url,width,height){
    var iframe = document.createElement("iframe");
    iframe.id=id;
    iframe.width=width;
    iframe.height=height;
    iframe.src=url;
    document.body.appendChild(iframe);
};
function Letter_DownloadSingleAuto() {
    'use strict';
    var letter_match = '';
    var letter_id = $('#ctl00_PageBody_lblConfID').text();
    var letter_name = $('#ctl00_PageBody_txtConfirmationName').val();
    var filename = '';
    var ele_perID = $("#ctl00_PageBody_lblConfID");
    var mao_reminder_perID = $("<span/>")
        .html("<span style='font-style:italic; font-family:Calibri; font-size: 14px; color: #3F9C35'>&nbsp;&nbsp;<i class='fas fa-spinner fa-pulse'></i>&nbsp;EasyGoEnhancer 正在为您自动下载询证函... 请耐心等待所有询证函下载完毕后再关闭本网页...</span>");
    var mao_nothing_perID = $("<span/>")
        .html("<span style='font-style:italic; font-family:Calibri; font-size: 14px; color: #EEA9B8'>&nbsp;&nbsp;暂未回函！如果已发函很长时间了，请尽快催函，或加强催函力度……</span>");
    var url = '';
    var c ='';
    var hrefArr = document.getElementsByTagName('a');
    var file_split = [];
    var file_type = '';
    var file_type_arr = ['pdf','PDF','jpg','JPG'];
    for (var i=0; i<hrefArr.length; i++ ){
        c = hrefArr[i].href;
        file_split = c.split(".");
        file_type = file_split[file_split.length - 1];
        if (file_type_arr.includes(file_type)){
            url = c;
            break;
        }
    }
    if (url ==''){
        mao_nothing_perID.insertAfter(ele_perID );
    }
    else{
        if(document.getElementById('ctl00_PageBody_rblIsMatch_0').getAttribute('checked') == 'checked'){
            letter_match = 'Y';
        }
        else if(document.getElementById('ctl00_PageBody_rblIsMatch_1').getAttribute('checked') == 'checked'){
            letter_match = 'N';
        }
        else{
            letter_match = '@';
        };
        mao_reminder_perID.insertAfter(ele_perID );
        var j = 0;
        for (i=0; i<hrefArr.length; i++ ){
            c = hrefArr[i].href;
            file_split = c.split(".");
            file_type = file_split[file_split.length - 1];
            if (file_type_arr.includes(file_type)){
                url = c;
                j = j + 1;
                if (j == 1){
                    filename = '[' + letter_match + ']_' + letter_id + '_' + letter_name + '.' + file_type;
                }
                else{
                    filename =  '[' + letter_match + ']_' + letter_id + '_' + letter_name + '_' + j.toString() + '.' + file_type;
                };
                download(url,filename);
            }
        }
    }
};
function Letter_DownloadNoBarcode() {
    'use strict';
    $(".menubar_title")[0].innerHTML = "<a href='//maoyanqing.com/download/easygoenhancer.html' target='_blank' style='font-family:Calibri; font-size: 26px; color: #009CDE'>EasyGoEnhancer</a>";
    var webpage_title = $('#FrameWork_Acpa_EasyGoSelectIndex');
    var btn_download = $("<button/>")
        .attr('type','button')
        .html("<span style='font-family:Calibri; font-size: 16px; font-weight: bold; color: #009CDE'><i class='fas fa-cloud-download-alt'></i>&nbsp;点击下载</span>");
    btn_download.insertAfter(webpage_title);
    var btn_reminder = $("<span/>")
        .html("<span style='font-family:Calibri; font-size: 14px; color: #009CDE'>&nbsp;&nbsp;以下列示的所有询证函中&nbsp;&nbsp;</span><span style='font-family:Calibri; font-size: 14px; color: #EEA9B8'>上传日期</span>&nbsp;<kbd>≥</kbd>&nbsp;");
    btn_reminder.insertAfter(btn_download);
    var input_date = $("<input/>")
        .attr('id','input_date')
        .attr('type','date')
        .attr('value','');
    input_date.insertAfter(btn_reminder);
    var mao_reminder = $("<p/>")
        .html("<br/><hr/><span style='font-family:Calibri; font-size: 12px; color: #9E9E9E'><b>【建议】</b>将浏览器设置为静默下载（不弹出下载框），详见：<a target='_blank' href='//maoyanqing.com/download/easygoenhancer-docs.html' style='font-family: Calibri; font-size: 12px; color: #0000cc;'>开启静默下载的操作提示</a></span>");
    mao_reminder.insertAfter(input_date);
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var pick_date_str = y + '-' + m + '-' + d;
    input_date.val(pick_date_str);
    btn_download.click(function(){
        this.style.display = "none";
        var mao_reminder = $("<span/>")
            .html("<span style='font-style:italic; font-family:Calibri; font-size: 14px; color: #3F9C35'>&nbsp;&nbsp;<i class='fas fa-spinner fa-pulse'></i>&nbsp;EasyGoEnhancer 正在为您自动下载&nbsp;&nbsp;</span>");
        mao_reminder.insertAfter(webpage_title);
        var mao_reminder2 = $("<span/>")
            .html("<span style='font-style:italic; font-family:Calibri; font-size: 14px; color: #3F9C35'>&nbsp;&nbsp;的询证函... 请耐心等待所有询证函下载完毕后再关闭本网页...</span>");
        mao_reminder2.insertAfter(input_date);
        pick_date_str = input_date.val();
        if (pick_date_str == '' || pick_date_str == undefined){
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            pick_date_str = y + '-' + m + '-' + d;
        }
        Letter_DownloadByDate(pick_date_str);
    });
};
function Letter_DownloadByDate(pick_date_str){
    'use strict';
    var filename = '';
    var url = '';
    var upload_date_str = '';
    var upload_date = new Date();
    var pick_date = new Date();
    var hrefArr = document.getElementsByTagName('a');
    var file_split = [];
    var file_type = '';
    var file_type_arr = ['pdf','PDF','jpg','JPG'];
    for (var i=0; i<hrefArr.length; i++ ){
        url = hrefArr[i].href;
        file_split = url.split(".");
        file_type = file_split[file_split.length - 1];
        if (file_type_arr.includes(file_type)){
            upload_date_str = hrefArr[i].parentNode.nextSibling.nextSibling.innerHTML;
            upload_date = new Date(upload_date_str);
            pick_date = new Date(pick_date_str);
            if (upload_date >= pick_date){
                filename = hrefArr[i].innerHTML;
                download(url,filename);
            }
        }
    }
};
function Fix_PrinterButton(){
    'use strict';
    var btns_length = $('.button_bak').length;
    var btn;
    for (var i=0; i < btns_length; i++){
        btn = $('#Button'+(i+1));
        if (btn.val().indexOf("打印") >= 0){
            btn.removeAttr("onclick");
            btn.attr("onclick","window.print();");
        }
    }
};
function Letter_SaveUrl(){
    'use strict';
    if (window.localStorage){
        var loc = window.location;
        localStorage.letter_href = loc.href.replace(loc.origin,'');
        var project_name = document.getElementById('ctl00_PageBody_lblFullName').innerHTML;
        project_name = project_name.replace('被审计单位：【','').replace('】','');
        localStorage.letter_project_name = project_name;
    }
};
function CheckBill_IntelligentSelector(){
    'use strict';
    var btn_save = document.querySelector('input#ctl00_PageBody_btnSave');
    if(btn_save){
        CheckBill_ShowButtonForClick();
    }
    else{
        CheckBill_RefreshConfiguration();
    }
};
function CheckBill_ShowButtonForClick(){
    var ele_td = document.querySelector('tr.table_head');
    var btn_download = $("<button/>")
        .attr('type','button')
        .attr('style', 'float:right')
        .html("<span style='font-family:Calibri; font-size: 14px; font-weight: bold; color: #3f9c35'><i class='fas fa-check'></i>&nbsp;智选</span>");
    btn_download.insertBefore(ele_td);
    btn_download.click(function(){
        this.style.display = "none";
        CheckBill_SelectAll();
    })
};
function CheckBill_SelectAll(){
    if (window.localStorage && localStorage.checkbill_config) {
        var checkbill_config = JSON.parse(localStorage.checkbill_config);
        var ele_tr;
        var ele_radio;
        var ele_radios;
        var ele_info = '';
        var ele_choice = '';
        var i = 0;
        var ele_trs = document.querySelectorAll('#ctl00_PageBody_gvContent > tbody > tr');
        for(i=1; i<ele_trs.length; i++){
            ele_tr = ele_trs[i];
            ele_info = ele_tr.querySelector('td:nth-child(1) > span').innerHTML;
            ele_choice = checkbill_config[ele_info];
            ele_radio = ele_tr.querySelector('[value="' + ele_choice + '"]');
            ele_radio.click();
        };
    }
    else {
        alert('【EasyGoEnhancer 智选提示】\n\n请打开最近一次提交过的《业务复核核对表》，EasyGoEnhancer将可实现一键智能选择。');
        ele_choice = '是';
        ele_radios = document.querySelectorAll('[value="' + ele_choice + '"]');
        for(i=1; i<ele_radios.length; i++){
            ele_radios[i].click();
        };
    }
};
function CheckBill_RefreshConfiguration(){
    var ele_trs = document.querySelectorAll('#ctl00_PageBody_gvContent > tbody > tr');
    var checkbill_obj = {};
    var ele_tr;
    var ele_info = '';
    var ele_choice = '';
    for(var i=1; i<ele_trs.length; i++){
        ele_tr = ele_trs[i];
        ele_info = ele_tr.querySelector('td:nth-child(1) > span').innerHTML;
        ele_choice = ele_tr.querySelector('td:nth-child(2) > div#ms-none > span').innerHTML;
        checkbill_obj[ele_info] = ele_choice;
    };
    var checkbill_obj2str = JSON.stringify(checkbill_obj);
    localStorage.checkbill_config = checkbill_obj2str;
};
