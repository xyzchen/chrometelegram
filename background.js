//background.js

var telegram = "https://api.telegram.org/bot{}/sendMessage";

//默认参数
var default_botid ="";
var default_chatid = 0;

//第一次使用，打开设置界面
if(localStorage['lastVersionUsed'] != 1){
	localStorage['lastVersionUsed'] = '1';
	chrome.tabs.create({
		url: chrome.extension.getURL('options.html')
	})
}

//定义变量
var botid   = localStorage['botid'] || default_botid;
var chatid = localStorage['chatid'] || default_chatid;
var apiurl  = telegram.replace("{}", botid);
console.log("api url = " + botid);

//执行Telegram调用
function executeTelegram(tab_id, subject, body, selection) {
	//要发送的文本
	var post_text = ""

	//标题
	if (subject.length > 0){
		post_text += "" + subject + "\n";
	}

	//正文
	if (body.length > 0) {
		post_text += "(" + body +")\n";
		// 选择的文本
		if (selection.length > 0) {
			post_text += "\n" + selection;
		}
	}
	
	//构造消息参数
	var data = {
		"chat_id" : chatid,
		"text" : post_text
	};
	//console.log(data);
	//发送消息
	$.ajax({
		url :  apiurl,
		type : "POST",
		data : data,
		dataType: "json"
	}).then(function(){
		//将正确信息返回给 content_script

	}, function(){
		//将错误信息返回给 content_script
	});
}

//菜单被点击之后的回调函数
function onClickHandler(info, tab) {
	console.log("info: " + JSON.stringify(info));
	console.log("tab: " + JSON.stringify(tab));
	var srcurl = "";
	if(info.srcUrl){
		srcurl = info.srcUrl;
	}
	else if(info.pageUrl){
		srcurl = info.pageUrl;
	}
	else if(info.linkUrl){
		srcurl = info.linkUrl;
	}
	else{
		srcurl = tab.url;
	}
	var selectiontext = "";
	if(info.selectionText){
		selectiontext = info.selectionText;
	}
	executeTelegram(tab.id, tab.title, srcurl, selectiontext);
}

//加载上下文菜单监听器
chrome.contextMenus.onClicked.addListener(onClickHandler);

//安装的时候创建上下文菜单
chrome.runtime.onInstalled.addListener(function(){
	//为指定类型对象创建上下文菜单
	var contexts = ["page","selection","link","editable","image"];
	for (var i = 0; i < contexts.length; i++){
		var context = contexts[i];
		var title = "使用Telegram发送“" + context +"”";
		var id = chrome.contextMenus.create({"title": title, "contexts":[context],
		                             "id": "context" + context});
		console.log("'" + context + "' item:" + id);
	}
});

//增加事件监听器
chrome.runtime.onConnect.addListener(function(port) {
	var tab = port.sender.tab;

	port.onMessage.addListener(function(info) {
		var max_length = 1024;
		if (info.selection.length > max_length){
			info.selection = info.selection.substring(0, max_length);
		}
		executeTelegram(tab.id, info.title, tab.url, info.selection);
	});
});

// 点击扩展图标时执行这个函数
chrome.browserAction.onClicked.addListener(function(tab) {
	if (tab.url.indexOf("http:") != 0 && tab.url.indexOf("https:") != 0) {
		executeTelegram(tab.id, "", tab.url, "");
	}
	else {
		chrome.tabs.executeScript(null, {file: "content_script.js"});
	}
});
