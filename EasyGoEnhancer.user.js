// ==UserScript==
// @name         EasyGoEnhancer
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/maoger/EasyGoEnhancer
// @version      1.3.1
// @description  首页显示EasyGo待办事项
// @author       Maoger
// @match        http://www.ascendacpa.com.cn/*
// @require      http://code.jquery.com/jquery-3.1.1.js
// @updateURL    https://openuserjs.org/meta/maoger/Copyer.meta.js

// ==/UserScript==

(function() {
	'use strict';

	//定义一个数组：待办事项的类型：
	var ToDoListName = ["业务项目","业务报告","人文财务","独立性","综合"];

	// 删除首页中“待办事项”后面的伪Tags：
	var FakeTags = document.querySelector(".NewTitle1");

	// tampermonkey 在运行的时候，碰到页面有 frame 标签，会对其每一个运行脚本
	// 这里排除没有找到相关元素的 frame
	if (!FakeTags) return;
	
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


		// 把div容器插入到大标题“待办事项”下：
		MaoList.insertBefore(ToDoList, MaoTitle);

		// 新建一个table容器：
		var MaoTable = document.createElement('table');
		MaoTable.className = "tablebox";
		MaoTable.border = "0";
		MaoTable.style = "border-collapse:collapse";
		var MaoTbody = document.createElement("tbody");
		MaoTbody.id = "ToDoListTable" + m.toString();
		MaoTbody.textContent = ToDoListName[m] + "is downloading ......";

		// 在div容器内插入table空白表格用于格式化显示“待办事项”
		ToDoList.appendChild(MaoTable);
		MaoTable.appendChild(MaoTbody);



		// 使用load()方法获取待办事项，并插入div容器中
		var JPerId = "#" + "ToDoListTable" + m.toString();
		var PerUrl = "http://www.ascendacpa.com.cn/MoreTask3.aspx " + "#tabContent__" + m.toString() + " div:first tr:gt(0)";
		$(JPerId).load(PerUrl);
	}
})();
