//Telegram参数配置

var default_botid ="";
var default_chatid = 0;

function load() {
	//表但元素
	var botElement = document.getElementById('botid');
	var chatElement = document.getElementById('chatid');
	//保存的参数
	var botid  = localStorage['botid'] || default_botid;
	var chatid = localStorage['chatid'] || default_chatid;

	//为元素赋值
	botElement.value = botid;
	chatElement.value = chatid;

	//表单监控函数
	function listener(evt) {
		botid = botElement.value;
		localStorage['botid'] = botid;

		chatid = chatElement.value;
		localStorage['chatid'] = chatid;

		console.log("botid: "+ botid +"\nchatid:"+chatid);
	}

	//监控事件
	var submitElement = document.getElementById('submit');
	submitElement.addEventListener('click', listener, false);
}

document.addEventListener('DOMContentLoaded', load);
