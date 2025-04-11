function onInputDataSet(source, target, name) {
	wd.$(source).set({
		addEventListener: {
			input: function(ev) {
				data = {};
				data[name] = ev.target.value;
				wd.$(target).set({dataset: data});
			}
		}
	});
	return;
}

function toDataSet(source, target, attr) {
	let data = {dataset: {}};
	data.dataset[attr] = document.querySelector(source).value;
	wd.$(target).set(data);
	return;
}






function loadTable(elem, target) {
	wd().send(target, {
		method: "GET",
		ondone: function(x) {
			let table = x.table;
			if (table !== null) elem.appendChild(table);
			table.border = 1;
			return;
		}
	});
	return;
}


function openPage(x) {
	localStorage.setItem("page", x);
	wd.$$("#renderCode").set({
		dataset: {wdLoad: `{url:${x};method:get;_script:true}`}
	});
	wd.$$("#sourceCode").set({
		dataset: {wdLoad: `{url:${x};method:get;_text:true}`}
	});
	return;
}

function reloadPage() {
	let x = localStorage.getItem("page");
	console.log(x);
	if (x !== null) openPage(x);
	return;
}

function darkMode() {
	let hour = wd.now.hour;
	wd.$("body").set({
		class: {
			add: hour > 6 && hour < 18 ? "wd-bg-base" : "wd-bg-black",
		}
	});
	return;
}

function getCode() {
	let x = document.getElementById("renderCode").innerHTML;
	wd.$("#sourceCode").set({value: x});
	return;
}

function setCode() {
	let x = document.getElementById("sourceCode").value;
	wd.$("#renderCode").load(x, false, true);
	return;
}

window.addEventListener("load", function() {
		darkMode();
		wd.$("#setCode").set(  {addEventListener: {click: setCode}});
		wd.$("#getCode").set(  {addEventListener: {click: getCode}});
		wd.$("#resetCode").set({addEventListener: {click: reloadPage}});
	}, false);
