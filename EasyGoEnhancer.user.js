// ==UserScript==
// @name         EasyGoEnhancer
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/maoger/EasyGoEnhancer
// @version      2.1
// @description  重整EasyGo待办事项，直接首页呈现明细。
// @author       Maoger
// @match        http://www.ascendacpa.com.cn/*
// @require      http://code.jquery.com/jquery-3.1.1.js
// @updateURL    https://openuserjs.org/meta/maoger/EasyGoEnhancer.meta.js

// ==/UserScript==

(function() {
    'use strict';

    // 定义：“待办事项”所在子网页
    var url = "http://www.ascendacpa.com.cn/MoreTask3.aspx";

    //定义一个数组：待办事项的类型
    var ToDoListName = ["业务项目","业务报告","人文财务","独立性","综合"];

    // 定位：首页中“待办事项”栏的伪Tags
    var $FakeTags = $(".NewTitle1");

    // 新建：装载数据的容器
    var $container = $("<div/>");

    // tampermonkey 在运行的时候，碰到页面有 frame 标签，会对其每一个运行脚本
    // 这里排除没有找到相关元素的 frame
    if ($FakeTags.length === 0) return;

    // 移除：首页中“待办事项”栏的伪Tags
    $FakeTags.children().not(":first").remove();

    // 将容器插入 DOM
    $container.insertAfter($FakeTags);

    // 新建：存放进度条的容器
    var $loadContainer = $("<div/>")
        .addClass("barSpace")
        .css({
            "margin" : "0.25px 0px",
            "background" : "grey",
            "border-radius" : "1px",
        });

    // 将进度条的容器插入 DOM
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

    // 将 进度条 插入 DOM
    $loadContainer.append($bar);

    // 定义：一个Number类型变量，用于设置进度条的width的百分比
    var m = 0;

    // 请求并获取每一项的 ToDo
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
        $container.append($elt);

        // 从服务器上“待办事项”所在位置加载数据
        var PerUrl = "http://www.ascendacpa.com.cn/MoreTask3.aspx?ind=" + (i+1).toString() + " " + "#tabContent__" + i.toString() + " " + "div:first tr:gt(0)";

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
})();