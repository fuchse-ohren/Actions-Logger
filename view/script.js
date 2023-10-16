const log_str = localStorage.getItem("log");
const log = JSON.parse(log_str);
const keys = Object.keys(log);

for(var i = 0; i< keys.length; i++){
	let row = document.createElement('tr');
	let col1 = document.createElement('td');
	let col2 = document.createElement('td');
	let col3 = document.createElement('td');
	let col4 = document.createElement('td');
	
	col1.innerText = keys[i];
	col2.innerText = log[keys[i]]['button'].join(",");
	col3.innerText = log[keys[i]]['link'].join(",");
	col4.innerText = log[keys[i]]['input'].join(",");
	
	row.appendChild(col1);
	row.appendChild(col2);
	row.appendChild(col3);
	row.appendChild(col4);
	
	document.getElementById("tbl").appendChild(row);
}
