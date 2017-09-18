//

var additionalInfo = {
	"title": document.title,
	"selection": window.getSelection().toString()
};

//向background发送请求
chrome.runtime.connect().postMessage(additionalInfo);
