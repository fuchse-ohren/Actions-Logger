//設定を取得する関数
function _get_setting(type){
	return new Promise(function (resolve) {
		chrome.runtime.sendMessage({"type":type}, function(res) {
			resolve(res);
		});
	});
}

function _putlog(url,log){
	return new Promise(function (resolve) {
		chrome.runtime.sendMessage({"type":"putlog","message":log,"url":url}, function(res) {
			resolve(res);
		});
	});
}

async function poll(){
	const targetURL = await _get_setting('targetURL');
	const exclusionURL = await _get_setting('exclusionURL');
	const url = location.href.split(/(#|\?|\/$)/)[0];
	
	//ターゲットURLのみ記録する
	if(targetURL.test(location.href) && !exclusionURL.test(location.href)){	//クエリなどを除外した影響が出ないように location.hrefで判定する
		var log = {};
		log[url] = {"button":[],"link":[],"input":[]};
		
		//ページ内のアクション一覧を取得
		var but = document.getElementsByTagName("button")
		var but_list = new Set(log[url]["button"])
		for(i=0;i<but.length;i++){
		  if(but[i].innerText.trim() != ""){
			but_list.add(but[i].innerText.trim())
		  }
		}

		var a = document.getElementsByTagName("a")
		var a_list = new Set(log[url]["link"])
		for(i=0;i<a.length;i++){
		  if(a[i].innerText.trim() != ""){
			a_list.add(a[i].innerText.trim())
		  }else if(a[i].href.trim() != "" && a[i].href != "#" && a[i].href != "javascript:void(0)"){
			a_list.add(a[i].href.trim())
		  }
		};

		var input = document.getElementsByTagName("input")
		var input_list = new Set(log[url]["input"]);
		for(i=0;i<input.length;i++){
		  if(input[i].type == "submit" && input[i].value != ""){
		    input_list.add(input[i].value.trim())
		  }else if(input[i].placeholder.trim() != "" && input[i].type != "hidden"){
			input_list.add(input[i].placeholder.trim())
		  }else if(input[i].name.trim() != "" && input[i].type != "hidden"){
			input_list.add(input[i].name.trim())
		  }
		}

		log[url]["button"] =  Array.from(but_list);
		log[url]["link"] =  Array.from(a_list);
		log[url]["input"] =  Array.from(input_list);
		
		res = await _putlog(url,log);
		console.log(res);
	}
}

async function main(){
	const spamode = await _get_setting('SPA');
	console.log(spamode);
	switch(spamode){
		case "0":
			poll();
			break;
		case "1":
			const observer = new MutationObserver(poll);
			observer.observe(document, { childList: true, subtree: true });
			break;
		case "2":
			setInterval(poll,5000);
			break;
	}
}

main();