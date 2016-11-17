// ==UserScript==
// @name         EasyGoEnhancer
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/maoger/EasyGoEnhancer
<<<<<<< HEAD
// @version      1.4.2
=======
// @version      1.4
>>>>>>> parent of 31cb9a7... V 1.4.1
// @description  首页显示EasyGo待办事项
// @author       Maoger
// @match        http://www.ascendacpa.com.cn/*
// @require      http://code.jquery.com/jquery-3.1.1.js
// @updateURL    https://openuserjs.org/meta/maoger/EasyGoEnhancer.meta.js

// ==/UserScript==

(function() {
    'use strict';

    // 待办事项所在子网页
    var url = "http://www.ascendacpa.com.cn/MoreTask3.aspx";

    //定义一个数组：待办事项的类型
    var ToDoListName = ["业务项目","业务报告","人文财务","独立性","综合"];

    // 定位：首页中“待办事项”栏的伪Tags
    var $FakeTags = $(".NewTitle1");

    // 新建装载数据的容器
    var $hint = $('<span />').html('加载数据中，请稍后...');
    var $container = $('<div />');

    // tampermonkey 在运行的时候，碰到页面有 frame 标签，会对其每一个运行脚本
    // 这里排除没有找到相关元素的 frame
    if ($FakeTags.length === 0) return;

    // 移除:首页中“待办事项”栏的伪Tags
    $FakeTags.children().not(':first').remove();

    // 将容器插入 DOM
    $container.insertAfter($FakeTags);

    // 请求并获取每一项的 ToDo
    for (var i = 0; i < 5; i++) {
    var name = ToDoListName[i];

    // 构建包裹元素
    var $elt = $('<table/>')
        .attr('data-name', name)
        .addClass('tablebox')
        .css({
        'text-align': 'left'
        })
        .html('<span>正在加载<b>' + name + '</b>中，请稍后...</span>');
    $container.append($elt);

    // 加载数据
    var PerUrl = "http://www.ascendacpa.com.cn/MoreTask3.aspx?ind=" + (i+1).toString() + " " + "#tabContent__" + i.toString() + " " + "div:first tr:gt(0)";
    $elt.load(PerUrl, function(response, status, xhr) {
        if (status === 'error') {
            $(this).html('<span style="color: red;">加载<b>' + $(this).attr('data-name') + '</b>失败</span>');
        }
    });
    }
})();