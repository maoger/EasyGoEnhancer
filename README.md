# EasyGoEnhancer

## 1、功能：
利用 jQuery - AJAX load() 方法， 使得EasyGo能够直接在首页直接显示 所有的 待办事项。

## 2、更新：
* Version 1.0
    * 首次上传： 使用 jQuery - AJAX load() 方法， 直接将“待办事项”清单和脚注调取过来。

* Version 1.1
    * 重大更新： 倪老师使用 jQuery - AJAX get() 方法 + button 事件， 初试效果，获取的内容相当纯净、干脆。

* Version 1.2
    * 尝试：重回 jQuery - AJAX load() 方法，无耻尝试：.load() 方法应该能够继承 jQuery 选择器的 :first 功能， 居然真的可以成功。
    * 美化：新增了一个待办事项类型的数组，在加载的过程中，随着文字的变换，可以知道加载到第几大类的待办事项。

* Version 1.3
    * 美化：添加 table 属性，直接调用原生 css 中的 tablebox 样式，与首页的其他内容显得浑然一体。

* Version 1.4
	* 修复Bug： 修改 load() 每次访问的子页面 url 为对应的真实子页面 ?ind=X ， 可能由于后续子页面的 style.display 为 none 而无法获取 id。倪老师的构造 form 请求的方法更好，但是我还不能理解其规则，暂存。
    * 美化：用jQuery元素表达方法重述原来的HTML元素，代码更加简洁； via : 倪老师。
    * 美化：减少了不必要的新建DOM， table 元素更加简洁； via : 倪老师。

* Version 2.0
    * 添加：进度条UI。