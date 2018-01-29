// ==UserScript==
// @name         EasyGoEnhancer
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/maoger/EasyGoEnhancer
// @version      2.8.180130.2
// @description  更加效率的EasyGo.
// @author       Maoger
// @match        http://*.ascendacpa.com.cn/*
// @match        http://10.131.0.7/*
// @require      http://code.jquery.com/jquery-3.2.1.js
// @updateURL    https://openuserjs.org/meta/maoger/EasyGoEnhancer.meta.js
// @grant        GM_openInTab
// @copyright    2016, maoger (https://openuserjs.org/users/maoger)
// @license      MIT

// ==/UserScript==

// ============================= Start: Load_ToDoList ========================================
function Load_ToDoList() {
    'use strict';

    // trick：修改网页的title
    $("title").html("EasyGo | Maoger祝大家年审快乐 | 让EasyGo变得更加效率");

    // 定义：“待办事项”所在子网页
    var DBSX_url = "/MoreTask3.aspx";

    // 定义一个数组：待办事项的类型
    var ToDoListName = ["业务项目","业务报告","人文财务","独立性","综合"];

    // 定位：首页中“待办事项”栏的伪Tags
    var $FakeTags = $(".NewTitle1");

    // 新建：装载 待办事项 数据的容器
    var $DBSX_Container = $("<div/>");

    // 定义：“工时管理”所在子网页
    var GSGL_url = "/Module/Framework/Acpa/Manhour/report.aspx";

    // 定位：首页中“生日提醒”滚动栏
    // var $spanBirthdayName = $("#spanBirthdayName");

    // 新建：装载 工时管理 数据的容器
    var $GSGL_Container = $("<span/>")
        .html("本月已工作：");

    var $GSGL_wb1 = $("<td/>")
        .html("&nbsp;个小时，");

    var $GSGL_cc = $("<td/>")
        .html("本月已出差：");

    var $GSGL_wb2 = $("<td/>")
        .html("&nbsp;天。");

    var $GSGL_gs = $("<a/>")
        .attr("href","/Module/Framework/Acpa/Manhour/report.aspx")
        .css({
            "font-weight":"bold",
            "color":"red"
        });

    var $GSGL_trip = $("<a/>")
        .attr("href","/Module/Framework/Acpa/Manhour/report.aspx")
        .css({
            "font-weight":"bold",
            "color":"red"
        });

    // 将 工时管理容器 插入 首页“待办事项”标签前
    $GSGL_Container.insertBefore($FakeTags);
    $GSGL_Container.append($GSGL_gs);
    $GSGL_wb1.insertAfter($GSGL_gs);
    $GSGL_cc.insertAfter($GSGL_wb1);
    $GSGL_trip.insertAfter($GSGL_cc);
    $GSGL_wb2.insertAfter($GSGL_trip);

    // tampermonkey 在运行的时候，碰到页面有 frame 标签，会对其每一个运行脚本
    // 这里排除没有找到相关元素的 frame
    if ($FakeTags.length === 0) return;

    // 移除：首页中“待办事项”栏的伪Tags
    $FakeTags.children().not(":first").remove();

    // 将 待办事项容器 插入 首页“待办事项”标签后
    $DBSX_Container.insertAfter($FakeTags);

    // 新建：存放进度条的容器
    var $loadContainer = $("<div/>")
        .addClass("barSpace")
        .css({
            "margin" : "0.25px 0px",
            "background" : "grey",
            "border-radius" : "1px",
        });

    // 将进度条的容器插入 待办事项容器 和 首页“待办事项”标签 中间
    $loadContainer.insertAfter($FakeTags);

    // 新建：进度条
    var $bar = $("<span/>")
        .attr("id" , "barsmooth" )
        .addClass("smooth")
        .css({
            "height" : "0.25px",
            "width" : "0%",
            "border-radius" : "1px",
            "display" : "block",
            "box-shadow" : "0px 0px 10px 1px #CC66FF",// 原来这里使用的是3B8CF8
            "background-color" : "#fff"
        });

    // 插入：将“进度条”插入“进度条容器”中
    $loadContainer.append($bar);

    // 新建：名为“动态报备”的快捷标签
    var $DTBB = $('<a/>')
        .attr("href","/Module/Framework/Acpa/Project/UserScheduleDynamic.aspx")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("动态报备");

    // 将“动态报备”的快捷标签插入到“待办事项”按钮后
    $FakeTags.append($DTBB);

    // 新建：名为“申报工时”的快捷标签，并插入页面中
    var $SBGS = $('<a/>')
        .attr("href","/Module/Framework/Acpa/Manhour/report.aspx")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("申报工时");
    $FakeTags.append($SBGS);

    // 新建：名为“项目园地”的快捷标签，并插入页面中
    var $XMYD = $('<a/>')
        .attr("href","/Module/Framework/Acpa/ClientInfo/ProFieldNav.aspx")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("项目园地");
    $FakeTags.append($XMYD);

    // 定义：一个Number类型变量，用于设置进度条的width的百分比
    var m = 0;

    // 加载：从服务器上逐项获取并加载“待办事项”数据
    for (var i = 0, max = ToDoListName.length; i < max; i++) {
        var name = ToDoListName[i];

        // 构建包裹元素
        var $elt = $("<table/>")
        .attr("data-name", name)
        .addClass("tablebox")
        .css({
            "text-align": "left"
        })
        .html("<span>正在加载<b>" + name + "</b>中，请稍候...</span>");
        $DBSX_Container.append($elt);

        // 构建每种类型“待办事项”所在位置
        var PerUrl = DBSX_url + "?ind=" + (i+1).toString() + " " + "#tabContent__" + i.toString() + " " + "div:first tr:gt(0)";

        $elt.load(PerUrl, function(responseTxt , statusTxt , xhr) {
            if (statusTxt === "success") {
                // 设置进度条显示的百分比
                var loadingRate = self.setInterval(function (){
                    if ( m < (i-1)*20 ) {
                        m = (i-1)*20;
                        $bar.css("width",m.toString() + "%");
                    }
                    else if( m < i*20 ){
                        m = m + 0.1;
                        $bar.css("width",m.toString() + "%");
                    }
                    if ( m >= 100 ) {
                        clearInterval(loadingRate);
                        setTimeout(function(){
                            $loadContainer.css("margin","0px");
                            $bar.css({"width" : "0%","height":"0px"});
                        },600);
                    }
                },10);
            }
            if (statusTxt === "error") {
                $(this).html('<span style="color: red;">加载<b>' + $(this).attr("data-name") + '</b>失败！</span>');
            }
        });
    }

    // 加载：工时管理 之 ①当月已报工时、②当月出差天数
    var GSGL_gs = GSGL_url + " " + "#tabContent__0 div:eq(1) tr:last td:eq(1)";
    $GSGL_gs.load(GSGL_gs);

    var GSGL_trip = GSGL_url + " " + "#tabContent__0 div:eq(1) tr:last td:eq(2)";
    $GSGL_trip.load(GSGL_trip);
}
Load_ToDoList();
// ============================= End: Load_ToDoList ========================================


// ========================= Start:下载并重命名的一整套方法 ===================================
/*
获取 blob
    @param  {String} url 目标文件地址
    @return {Promise}
 */
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

/*
保存
    @param  {Blob} blob
    @param  {String} filename 想要保存的文件名称
 */
function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement('a');
        const body = document.querySelector('body');

        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);
        link.click();
        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
    }
}

/*
下载
    @param  {String} url 目标文件地址
    @param  {String} filename 想要保存的文件名称
 */
function download(url, filename) {
    getBlob(url).then(blob => {
        saveAs(blob, filename);
    });
}
// ========================= End:下载并重命名的一整套方法 ===================================


// ========================= Star:批量下载按钮 ===================================
// 批量下载
function Download_Multi() {
    'use strict';

    // 如果当前是询证函界面，加载一键下载按钮
    if(window.location.href.indexOf('/Confirmation.aspx?No=')>0){
        // 新建：“下载”按钮
        var $DingWei_Multi = $("#ctl00_PageBody_lblFullName");
        var $MaoDownloader_Multi = $("<button/>")
            .attr('type','button')
            .html("<span style='font-family:Calibri; font-size: 14px; color: #9932CD'>一键打开 \>\>以下全部询证函</span>");
        $MaoDownloader_Multi.insertAfter($DingWei_Multi);

        // 新建：提醒
        var $DingWei_Title = $(".menubar_title");
        var $MaoReminder_Multi = $("<td/>")
            .html("<span style='font-style:italic; font-family:Calibri; font-size: 14px; color: #EEA9B8'>&nbsp;&nbsp;&nbsp;&nbsp;提示：点击以下的【查询】按钮，查看更多选项；比如：可以按照 “回函扫描创建日期” or “回函收件人” or “被询证方” 等筛选回函结果……</span>");
        $MaoReminder_Multi.insertAfter($DingWei_Title);

        $MaoDownloader_Multi.click(function(){
            // 打开所有链接
            var url = '';
            var c ='';
            var hrefArr = document.getElementsByTagName('a');
            var n = hrefArr.length;
            for( var i=0; i<hrefArr.length; i++ ){
                c = hrefArr[i].href;

                if (c.indexOf("ID")>=0){
                    window.open(c);
                }
            }
        });
    }

}
Download_Multi();
// ========================= End:批量下载按钮 ===================================


// ========================= Star:自动下载与提示 ===================================
function Download_Auto() {
    'use strict';
    /*
    # V180129.1
    - 更新了match的url地址，更加精准定位

    # V180129.2
    - 兼容下载多个附件

    # V180129.3
    - 改为自动下载
    - 修改提示样式

    # V180130.1
    - 增加“jpg”格式下载
    */

    // 如果当前是询证函查询界面，加载下载按钮
    if(window.location.href.indexOf('/ConfirmationEdit.aspx?ID=')>0){
        // 重命名取数
        var LetterId = document.getElementById('ctl00_PageBody_lblConfID').innerHTML;
        var LetterName = document.getElementById('ctl00_PageBody_txtConfirmationName').value;
        var filename = '';

        // 定位
        var $DingWei_PerID = $("#ctl00_PageBody_lblConfID");

        // 新建提示1：已回函，开始静默下载
        var $MaoReminder_PerID = $("<span/>")
            .html("<span style='font-style:italic; font-family:Calibri; font-size: 14px; color: #CDCDCD'>&nbsp;&nbsp;&nbsp;&nbsp;已开始静默下载，稍等片刻……</span>");


        // 新建提示2：没有回函扫描件
        var $MaoNothing_PerID = $("<span/>")
            .html("<span style='font-style:italic; font-family:Calibri; font-size: 14px; color: #EEA9B8'>&nbsp;&nbsp;&nbsp;&nbsp;暂未回函！如果已发函很长时间了，请尽快催函，或加强催函力度……</span>");

        // 查找：下载链接，判断是不是要增加“下载”按钮
        var url = '';
        var c ='';
        var hrefArr = document.getElementsByTagName('a');


        for( var i=0; i<hrefArr.length; i++ ){
            c = hrefArr[i].href;

            if (c.indexOf("pdf")>=0 || c.indexOf("jpg")>=0){
                url = c;
            }
        }

        if (url ==''){
            $MaoNothing_PerID.insertAfter($DingWei_PerID );
        }
        else{
            // 如果已回函（url非空），则开始自动下载
            $MaoReminder_PerID.insertAfter($DingWei_PerID );
            var j = 0;
            for(i=0; i<hrefArr.length; i++ ){
                c = hrefArr[i].href;

                // 下载方式1：PDF格式
                if (c.indexOf("pdf")>=0){
                    url = c;

                    j = j + 1;

                    if(j == 1){
                        filename = LetterId + '_' + LetterName + '.pdf';
                    }
                    else{
                        filename = LetterId + '_' + LetterName + '_' + j.toString() + '.pdf';
                    }

                    download(url,filename);
                }
                // 下载方式2：JPG格式
                if (c.indexOf("jpg")>=0){
                    url = c;

                    j = j + 1;

                    if(j == 1){
                        filename = LetterId + '_' + LetterName + '.jpg';
                    }
                    else{
                        filename = LetterId + '_' + LetterName + '_' + j.toString() + '.jpg';
                    }

                    download(url,filename);
                }
            }
        }
    }
}
Download_Auto();
// ========================= End:自动下载与提示 ===================================