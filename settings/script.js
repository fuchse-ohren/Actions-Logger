function sv(){
	var message = document.getElementById('message');

	if(document.getElementById("regex").value === ""){
		message.innerText = "何か入力したらどうですか？";
		message.style.color="#e78B90";
		return;
	}
	
	//対象URLの登録
	try{
		var thisRegex = new RegExp(document.getElementById("regex").value);
		localStorage.setItem("targetURL", document.getElementById("regex").value);
		console.log(localStorage.getItem("targetURL"));
		message.innerText = "登録しました";
		message.style.color="#e78B90";
	}catch{
		message.innerText = "対象URLの正規表現が正しくありません";
		message.style.color="#e78B90";
	}
	
	//除外URLの登録
		if(document.getElementById("excregex").value === ""){
			message.innerText = "何か入力したらどうですか？";
			message.style.color="#e78B90";
			return;
	}
	
	try{
		var thisRegex = new RegExp(document.getElementById("excregex").value);
		localStorage.setItem("exclusionURL", document.getElementById("excregex").value);
		console.log(localStorage.getItem("exclusionURL"));
	}catch{
		message.innerText = "除外URLの正規表現が正しくありません";
		message.style.color="#e78B90";
	}
	
	//SPAモードの登録
	try{
		localStorage.setItem("SPA", document.getElementById("spamode").value);
		console.log(localStorage.getItem("SPA"));
		message.innerText = "登録しました";
		message.style.color="#e78B90";
	}catch{
		message.innerText = "SPAモードの設定が登録できませんでした";
		message.style.color="#e78B90";
	}
}

function rm(){
	const message = document.getElementById("log_message");
	localStorage.setItem("log","{}");
	message.innerText = "ログを消去しました";
	message.style.color="#e78B90";
	document.getElementById("logsize").innerText = String(localStorage.getItem("log").length)+" バイト";
}

function dl(){
	const log = localStorage.getItem("log");
	const blob = new Blob([log], { type: 'application/json' });
	let a = document.createElement('a');
	document.body.appendChild(a);
	a.href = window.URL.createObjectURL(blob);
	a.download = 'params_log.json';
	a.click();
	document.body.removeChild(a);
}

function reset(){
	localStorage.setItem("targetURL", 'htt(p|ps)://example.net($|/.*)');
	localStorage.setItem("exclusionURL", '(.*\\.)(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|mp4|mp3|ts|m3u8|pdf|doc|docx|ppt|pptx|xls|xlsx|md)$');
	localStorage.setItem("SPA", 0);
	message.innerText = "設定をリセットしました";
	message.style.color="#e78B90";
	document.getElementById("regex").value = localStorage.getItem("targetURL");
	document.getElementById("excregex").value = localStorage.getItem("exclusionURL");
	document.getElementById("logsize").innerText = String(localStorage.getItem("log").length)+" バイト";
    document.getElementById("spamode").value = localStorage.getItem("SPA");
}

document.getElementById('save').addEventListener('click',sv);
document.getElementById('logrm').addEventListener('click',rm);
document.getElementById('logdl').addEventListener('click',dl);
document.getElementById('reset').addEventListener('click',reset);
document.getElementById("regex").value = localStorage.getItem("targetURL");
document.getElementById("excregex").value = localStorage.getItem("exclusionURL");
document.getElementById("spamode").value = localStorage.getItem("SPA");
document.getElementById("logsize").innerText = String(localStorage.getItem("log").length)+" バイト";
document.getElementById('logview').addEventListener('click',()=>{window.open('/view/index.html')});