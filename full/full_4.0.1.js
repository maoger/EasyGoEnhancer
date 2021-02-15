EasyGoEnhancer_main();
function EasyGoEnhancer_main(){
    'use strict';

    $('title').html('EasyGo | maoyanqing.com');

    // 判断：若为首页，执行指定JS
    if ($('.NewTitle1').length > 0){
        load_working_hours();
        load_toDoList();
    }
    // 判断：若为【项目园地 - 询证函】界面，则①添加 批量下载按钮，②更新或保存询证函ID到localStorage
    else if (window.location.href.indexOf('/Confirmation.aspx') >= 0){
        letter_download_multi();
        letter_save_url();
    }
    // 判断：若为每张询证函界面，自动下载
    else if (window.location.href.indexOf('/ConfirmationEdit.aspx') >= 0 ){
        letter_download_single_auto();
    }
    // 判断：若为【询证函查询】界面，添加批量下载按钮
    else if (window.location.href.indexOf('/ConfirmationEdit2014.aspx?ID=') >= 0 ){
        XZHCX_download();
    }
    // 判断：修复打印按钮
    else if (window.location.href.indexOf('/RiskManagement/') >= 0){
        $('title').html('EasyGo');
        fix_printer();
    }
    else{
        console.log('欢迎使用 EasyGoEnhancer !')
    }
};

// ============================= Start: Load_ToDoList ========================================
function load_toDoList() {
    'use strict';

    // 定义：“待办事项”所在子网页
    var DBSX_url = "/MoreTask3.aspx";

    // 定义一个数组：待办事项的类型
    var toDoList_names = ["业务项目","业务报告","人文财务","独立性","综合"];

    // 定位：首页中“待办事项”栏的伪Tags
    var fake_tags = $(".NewTitle1");

    // 新建：装载 待办事项 数据的容器
    var DBSX_container = $("<div/>");

    // 定位：首页中“生日提醒”滚动栏
    // var $spanBirthdayName = $("#spanBirthdayName");

    // tampermonkey 在运行的时候，碰到页面有 frame 标签，会对其每一个运行脚本
    // 这里排除没有找到相关元素的 frame
    if (fake_tags.length === 0) return;

    // 移除：首页中“待办事项”栏的伪Tags
    fake_tags.children().not(":first").remove();

    // 将 待办事项容器 插入 首页“待办事项”标签后
    DBSX_container.insertAfter(fake_tags);

    // 新建：存放进度条的容器
    var load_container = $("<div/>")
        .addClass("barSpace")
        .css({
            "margin" : "0.25px 0px",
            "background" : "grey",
            "border-radius" : "1px",
        });
    load_container.insertAfter(fake_tags);

    // 新建：进度条
    // box-shadow： 原来这里使用的是3B8CF8
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

    // 新建：名为“动态报备”的快捷标签
    var DTBB = $('<a/>')
        .attr("href","/Module/Framework/Acpa/Project/UserScheduleDynamic.aspx")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("<i class='far fa-check-circle'></i>&nbsp;动态报备");
    fake_tags.append(DTBB);

    // 新建：名为“申报工时”的快捷标签，并插入页面中
    var SBGS = $('<a/>')
        .attr("href","/Module/Framework/Acpa/Manhour/report.aspx")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("<i class='far fa-clock'></i>&nbsp;申报工时");
    fake_tags.append(SBGS);

    // 新建：名为“项目园地”的快捷标签，并插入页面中
    var XMYD = $('<a/>')
        .attr("href","/Module/Framework/Acpa/ClientInfo/ProFieldNav.aspx")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("<i class='fas fa-sitemap'></i>&nbsp;函证中心");
        // <span style='font-family:Calibri; font-size: 12px; color: #9E9E9E'>「询证函下载入口」</span>
    fake_tags.append(XMYD);

    // 新建：名为“询证函查询”的快捷标签，并插入页面中
    var XZHCX = $('<a/>')
        .attr("href","/Module/Framework/Acpa/Project/ConfirmationList2014.aspx")
        .attr("target","_blank")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("<i class='fas fa-search'></i>&nbsp;询证函查询");
        // <span style='font-family:Calibri; font-size: 12px; color: #9E9E9E'>「询证函下载入口」</span>
    fake_tags.append(XZHCX);

    // 新建：名为“最近查看的询证函”的快捷标签，并插入页面中
    if (window.localStorage && localStorage.letter_href) {
        var recent_letter = $('<a/>')
        .attr("href",localStorage.letter_href)
        .attr("target","_blank")
        .css({
        "margin-right": "30px",
        "color":"#333",
        })
        .html("<i class='far fa-eye'></i>&nbsp;最近查看的询证函");
        fake_tags.append(recent_letter);
    }

    // 定义：一个Number类型变量，用于设置进度条的width的百分比
    var m = 0;

    // 加载：从服务器上逐项获取并加载“待办事项”数据
    for (var i=0; i<toDoList_names.length; i++) {
        var name = toDoList_names[i];

        // 构建包裹元素
        var elt = $("<table/>")
        .attr("data-name", name)
        .addClass("tablebox")
        .css({
            "text-align": "left"
        })
        .html("<span>正在加载<b>" + name + "</b>中，请稍候...</span>");
        DBSX_container.append(elt);

        // 构建每种类型“待办事项”所在位置
        var PerUrl = DBSX_url + "?ind=" + (i+1).toString() + " " + "#tabContent__" + i.toString() + " " + "div:first tr:gt(0)";

        elt.load(PerUrl, function(responseTxt , statusTxt , xhr) {
            if (statusTxt === "success") {
                // 设置进度条显示的百分比
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
                        console.log('欢迎使用EasyGoEnhancer !')
                    };
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
// ============================= End: Load_ToDoList ========================================


// ============================= Start: 工时管理  ========================================
function load_working_hours(){
    'use strict';

    // 定位：首页中“待办事项”栏的伪Tags
    var fake_tags = $(".NewTitle1");

    // 定义：“工时管理”所在子网页
    var GSGL_url = "/Module/Framework/Acpa/Manhour/report.aspx";

    // 新建：装载 工时管理 数据的容器
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

    // 将 工时管理容器 插入 首页“待办事项”标签前
    GSGL_container.insertBefore(fake_tags);
    GSGL_container.append(GSGL_gs);
    GSGL_wb1.insertAfter(GSGL_gs);
    GSGL_cc.insertAfter(GSGL_wb1);
    GSGL_trip.insertAfter(GSGL_cc);
    GSGL_wb2.insertAfter(GSGL_trip);

    // 加载：工时管理 之 ①当月已报工时、②当月出差天数
    var GSGL_gs_rul = GSGL_url + " " + "#tabContent__0 div:eq(1) tr:last td:eq(1)";
    GSGL_gs.load(GSGL_gs_rul);

    var GSGL_trip_url = GSGL_url + " " + "#tabContent__0 div:eq(1) tr:last td:eq(2)";
    GSGL_trip.load(GSGL_trip_url);
}
// ============================= End: 工时管理  ========================================


// ============================= Start: 下载询证函 ========================================

// Start:下载并重命名的一整套方法 ~~~~~~~~~~~~~~~~~~~~~~~~`
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
            };
        };

        xhr.send();
    });
};

/*
saveAs
    @param  {Blob} blob
    @param  {String} filename 想要保存的文件名称
*/
function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    }
    else {
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
};

/*
download
    @param  {String} url 目标文件地址
    @param  {String} filename 想要保存的文件名称
*/
function download(url, filename) {
    getBlob(url).then(blob => {
        saveAs(blob, filename);
    })
};
// End:下载并重命名的一整套方法 ~~~~~~~~~~~~~~~~~~~~~~~~`

// 批量下载
function letter_download_multi(){
    'use strict';

    $(".menubar_title")[0].innerHTML = "<a href='//maoyanqing.com/download/easygoenhancer.html' target='_blank' style='font-family:Calibri; font-size: 26px; color: #009CDE'>EasyGoEnhancer</a>";

    // 页面底部提醒：使用【查询】按钮筛选信息等
    var ele_footer = $("#ctl00_PageBody_AspNetPager1");
    var mao_reminder_multi = $("<td/>")
        .html("<br/><hr/><b>Notes:</b><br/><span style='font-family:Calibri; font-size: 12px; color: #9E9E9E'><b>1、筛选</b><br/>点击上述【查询】按钮，查看更多选项；<br/>比如：可以按照 “回函扫描创建日期” 、 “回函收件人” 等，先筛选回函结果，再下载...<br/><br/><b>2、建议</b><br/>将浏览器设置为静默下载（不弹出下载框），详见：<a target='_blank' href='//maoyanqing.com/download/easygoenhancer-docs.html' style='font-family: Calibri; font-size: 12px; color: #0000cc;'>开启静默下载的操作提示</a></span>");
    mao_reminder_multi.insertAfter(ele_footer);

    // 下载进度提醒
    var ele_auditClient = $("#ctl00_PageBody_lblFullName");

    // 用来存储待下载询证函清单
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

    // 【判断】是否需要添加：“下载”按钮
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


// https://www.jianshu.com/p/63ef6b1c08ec
function create_iframe(id,url,width,height){
    var iframe = document.createElement("iframe");
    iframe.id=id;
    iframe.width=width;
    iframe.height=height;
    iframe.src=url;
    document.body.appendChild(iframe);

};

function letter_download_single_auto() {
    'use strict';

    // 重命名取数
    var letter_match = '';
    var letter_id = $('#ctl00_PageBody_lblConfID').text();
    var letter_name = $('#ctl00_PageBody_txtConfirmationName').val();
    var filename = '';

    // 定位
    var ele_perID = $("#ctl00_PageBody_lblConfID");

    // 新建提示1：已回函，开始静默下载
    var mao_reminder_perID = $("<span/>")
        .html("<span style='font-style:italic; font-family:Calibri; font-size: 14px; color: #3F9C35'>&nbsp;&nbsp;<i class='fas fa-spinner fa-pulse'></i>&nbsp;EasyGoEnhancer 正在为您自动下载询证函... 请耐心等待所有询证函下载完毕后再关闭本网页...</span>");

    // 新建提示2：没有回函扫描件
    var mao_nothing_perID = $("<span/>")
        .html("<span style='font-style:italic; font-family:Calibri; font-size: 14px; color: #EEA9B8'>&nbsp;&nbsp;暂未回函！如果已发函很长时间了，请尽快催函，或加强催函力度……</span>");

    // 查找：下载链接，判断是不是要 下载
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
        // 如果已回函（url非空），则开始自动下载

        // 是否相符
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
            // 下载
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
        // 下载完，2分钟后关闭当前页面
        // 低网速下，1分钟可能时间不够
        // setTimeout(close_tab,120000);
    }
};

/*
function close_tab(){
    window.opener = null;
    window.open('','_self');
    window.close();
};
*/

// ============================= End: 下载询证函 ========================================

// ============================= Start： 【询证函查询】批量下载 ========================================

function XZHCX_download() {
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
 
        XZHCX_download_main(pick_date_str);
    });
   
};

function XZHCX_download_main(pick_date_str){
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

// ============================= End： 【询证函查询】批量下载 ==========================================



// ============================= Start: 修改打印按钮 ========================================
function fix_printer(){
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
// ============================= End: 修改打印按钮 ========================================


// ============================= Start: 存储最近一次打开的询证函查询界面 ========================================
function letter_save_url(){
    'use strict';
    if (window.localStorage){
        var loc = window.location;
        localStorage.letter_href = loc.href.replace(loc.origin,'');
        // console.log(localStorage.letter_href);
    }
};
// ============================= End: 存储最近一次打开的询证函查询界面 ========================================
