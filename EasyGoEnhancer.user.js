// ==UserScript==
// @name         EasyGoEnhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  EasyGo代办事项
// @author       Mao Yanqing
// @match        http://www.ascendacpa.com.cn/*
// @require      http://code.jquery.com/jquery-3.1.1.js

// ==/UserScript==

(function() {
    'use strict';

	// 删除首页中“待办事项”后面的伪Tags：
	var FakeTags = document.querySelector(".NewTitle1");
	for (var i = 5 - 1; i >= 0; i--) {
		FakeTags.removeChild(FakeTags.children[1]);
	}

	// 增加容器，并插入到“待办事项”标题下:
	// 以下为为了使用 insertBefore 而进行定位查找相关元素：
	var MaoList = document.querySelector(".contPage");
	var MaoTitle = document.querySelector(".newfooter");

	for (var m = 0; m <= 5-1; m++) {
		// 新建一个div容器：
		var ToDoList = document.createElement('div');
		var PerId ="ToDoList" + m.toString();
		ToDoList.id = PerId;
		ToDoList.innerText = "Mao is trying to downloading ......";

		// 把div容器插入到大标题“待办事项”下：
		MaoList.insertBefore(ToDoList, MaoTitle);

		var ifEmpty = "";
		var JPerId = "#" + PerId;
		var PerUrl = "http://www.ascendacpa.com.cn/MoreTask3.aspx " + "#tabContent__" + m.toString() + " div";

		$(JPerId).load(PerUrl, function () {
			// 判断是否为空，如果为空，则不用显示脚注“总记录”的条数
			ifEmpty = document.getElementById(PerId).querySelector("div").innerText;
			if(ifEmpty === ""){
				//利用querySelector定位到有id属性的第一个div
				var record = document.querySelector(JPerId);
				record.removeChild(record.children[1]);
			}
		});
	}
})();