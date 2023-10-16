console.log("background scriptがロードされました");

//ログ記録ストレージを初期化する
try{
	var log_str = localStorage.getItem("log");
	var log = JSON.parse(log_str);
	if(log == null){
		console.log("ログが読み取れなかったため消去しました");
		localStorage.setItem("log","{}");
	}
}catch{
	console.log("ログファイルが壊れていたため消去しました");
	localStorage.setItem("log","{}")
}

//SPAモードの設定を初期化する

if(localStorage.getItem("SPA") === null){
	console.log("SPAをセットしました");
	localStorage.setItem("SPA", "0");
}


//ターゲットURLを初期化する
if(localStorage.getItem("targetURL") === null || localStorage.getItem("exclusionURL") === null){
	localStorage.setItem("targetURL", 'htt(p|ps)://example.net($|/.*)');
	localStorage.setItem("exclusionURL", '(.*\\.)(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|mp4|mp3|ts|m3u8|pdf|doc|docx|ppt|pptx|xls|xlsx|md)$');
}

// content_scriptと通信するためのリスナー
browser.runtime.onMessage.addListener((req,sender,sendResponse)=>{
	switch(req.type){
		case "test":
			console.log("test");
			sendResponse("test ok!");
		break;
		
		case "targetURL":
		    const targetURL = new RegExp(localStorage.getItem("targetURL"));	
			sendResponse(targetURL);
		break;
		
		case "exclusionURL":
			const exclusionURL = new RegExp(localStorage.getItem("exclusionURL"));
			sendResponse(exclusionURL);
		break;
		
		case "SPA":
			sendResponse(localStorage.getItem("SPA"));
		break;
		
		case "putlog":
			try{
				var url = req.url;
				var log = JSON.parse(localStorage.getItem("log"));
				
				if(log[url] != null){
					// URLが既存の場合は重複を消してマージする
					log[url]['button'] = Array.from(new Set(log[url]['button'].concat(req.message[url]['button'])))
					log[url]['link'] = Array.from(new Set(log[url]['link'].concat(req.message[url]['link'])))
					log[url]['input'] = Array.from(new Set(log[url]['input'].concat(req.message[url]['input'])))
				}else{
					// URLが新規の場合はそのまま突っ込む
					log[url] = req.message[url];
				}
				
				//ストレージに保存
				localStorage.setItem("log",JSON.stringify(log));
				sendResponse("putlog ok!");
			}catch{
				sendResponse("putlog ng!");
			}
		break;
	}
});