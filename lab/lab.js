function biblioteca(url) {
	return __REQUEST.send({url: url, call: function(x) {
		if (x.ok) {
			const split = __DOCODE.split(x.result, "/**", "**/");
			document.getElementById("manual").innerHTML = "";
			__DOCODE.render(document.getElementById("manual"), split.data);
			document.getElementById("codigo").textContent = split.code;
		}
	}});
}

function menu() {
	const list = ["Menu"];
	const code = "&#x1F4DD;";
	Array.from(document.querySelectorAll("[data-library]")).forEach(function(v,i,a) {
		list.push(code + v.getAttribute("src").match(/lib\/(\w+)\.js/)[1]);
	});
	__MENU.attach(document.getElementById("menu"), list, function(x) {
		const item = x.path[x.path.length - 1]



		biblioteca(`lib/${item.replace(code, "")}.js`);
	});
}


window.addEventListener("load", function(ev) {
	menu();
	__CSS.handleEvent();

});