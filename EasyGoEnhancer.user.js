// ==UserScript==
// @name         EasyGoEnhancer
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/maoger/EasyGoEnhancer
// @version      1.3.2
// @description  首页显示EasyGo待办事项
// @author       Maoger
// @modifier     creamidea
// @match        http://www.ascendacpa.com.cn/*
// @require      http://code.jquery.com/jquery-3.1.1.js
// @updateURL    https://openuserjs.org/meta/maoger/Copyer.meta.js

// ==/UserScript==

(function() {
  'use strict';

  //定义一个数组：待办事项的类型：
  var toDoListName = ["业务项目", "业务报告", "人文财务", "独立性", "综合"];

  // 删除首页中“待办事项”后面的伪Tags：
  var $FakeTags = $(".NewTitle1");

  // 装载数据的容器
  var $hint = $('<span />').html('加载数据中，请稍后...');
  var $container = $('<div />');

  // 数据请求源
  var url = "http://www.ascendacpa.com.cn/MoreTask3.aspx";

  // tampermonkey 在运行的时候，碰到页面有 frame 标签，会对其每一个运行脚本
  // 这里排除没有找到相关元素的 frame
  if ($FakeTags.length === 0) return;

  // 移除原先的 业务项目 等导航
  $FakeTags.children().not(':first').remove();

  // 将容器插入 DOM
  $container.insertAfter($FakeTags);

  // 请求每一项的 ToDo
  for (var i = 0; i < 5; i++) {
    var name = toDoListName[i];

    // 构建包裹元素
    var $elt = $('<table/>')
      .attr('data-name', name)
      .addClass('tablebox')
      .css({
        'text-align': 'left'
      })
      .html('<span>加载<strong>' + name + '</strong>中，请稍后...</span>');
    $container.append($elt);

    // 加载数据
    $elt.load(url + " .table-news tbody", {
      __EVENTTARGET: 'ctl00$PageBody$TabOptionItem' + (i + 1)
    }, function(response, status, xhr) {
      if (status === 'error') {
        $(this).html('<span style="color: red;">加载<strong>' + $(this).attr('data-name') + '</strong>失败</span>');
      }
    });
  }

})();
