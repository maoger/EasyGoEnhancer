// ==UserScript==
// @name         EasyGoEnhancer
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/maoger/EasyGoEnhancer
// @version      2.5.2
// @description  重整EasyGo首页待办事项的显示方式。
// @author       Maoger
// @match        http://www.ascendacpa.com.cn/*
// @require      http://code.jquery.com/jquery-3.2.1.js
// @updateURL    https://openuserjs.org/meta/maoger/EasyGoEnhancer.meta.js

// ==/UserScript==

(function() {
    'use strict';

    // trick：修改网页的title为EasyMao
    // oh~ no! 这个想法太坏了，我暂时隐藏掉吧
    //$("title").html("EasyMao");

    // 定义：“待办事项”所在子网页
    var DBSX_url = "http://www.ascendacpa.com.cn/MoreTask3.aspx";

    // 定义一个数组：待办事项的类型
    var ToDoListName = ["业务项目","业务报告","人文财务","独立性","综合"];

    // 定位：首页中“待办事项”栏的伪Tags
    var $FakeTags = $(".NewTitle1");

    // 新建：装载 待办事项 数据的容器
    var $DBSX_Container = $("<div/>");

    /*
    // 定义：“工时管理”所在子网页
    var GSGL_url = "http://www.ascendacpa.com.cn/Module/Framework/Acpa/Manhour/report.aspx";

    // 定位：首页中“生日提醒”滚动栏
    var $spanBirthdayName = $("#spanBirthdayName");

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
        .attr("href","http://www.ascendacpa.com.cn/Module/Framework/Acpa/Manhour/report.aspx")
        .css({
            "font-weight":"bold",
            "color":"red"
        });

    var $GSGL_trip = $("<a/>")
        .attr("href","http://www.ascendacpa.com.cn/Module/Framework/Acpa/Manhour/report.aspx")
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
    */

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
        .attr("href","Module/Framework/Acpa/Project/UserScheduleDynamic.aspx")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("动态报备");

    // 将“动态报备”的快捷标签插入到“待办事项”按钮后
    $FakeTags.append($DTBB);

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

    /*
    // 加载：工时管理 之 ①当月已报工时、②当月出差天数
    var GSGL_gs = GSGL_url + " " + "#tabContent__0 div:eq(1) tr:last td:eq(1)";
    $GSGL_gs.load(GSGL_gs);

    var GSGL_trip = GSGL_url + " " + "#tabContent__0 div:eq(1) tr:last td:eq(2)";
    $GSGL_trip.load(GSGL_trip);
    */
})();

/*
(function() {
    'use strict';
    2017.06.01更新：
        1、修复：打印按钮功能。
        2、说明：原网页只支持IE下的ActiveX控件直接调用打印方法，诸如：document.all.WebBrowser.ExecWB(8, 1);
            而且一般情况下，需要添加EasyGo为信任站点，并设置“对未标记为可安全执行脚本的ActiveX控件初始化并执行脚本”为“启用”，有点繁琐，
            故，此处直接修改打印button的onclick为通用的window.print()。
        3、注意：翻阅了一下网页，其他按钮的type均为submit，只有此处的打印按钮的type为button，
            故使用$(":button")定位所有 type="button" 的 <input> 元素，
            后期所有其他情况出现，再用id或class的方法定位元素。
    
    var printer1 =  $("#Button1");
    printer1.removeAttr("onclick");
    printer1.attr("onclick","window.print();");

    var printer1 =  $("#Button2");
    printer1.removeAttr("onclick");
    printer1.attr("onclick","window.print();");

    var printer1 =  $("#Button3");
    printer1.removeAttr("onclick");
    printer1.attr("onclick","window.print();");
})();
*/