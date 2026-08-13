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

/*-- Menu Principal --*/
WD.attach("menu", function () {
	const code = "&#x1F4DD;";
	const list = Array.from(document.querySelectorAll("[data-library]")).map(function(v,i,a) {
		return code + v.getAttribute("src").match(/lib\/(\w+)\.js/)[1];
	}).sort();
	list.unshift("WD Lab Menu");

	return {
		list: list,
		call: function(x) {
			const item = x.path[x.path.length - 1];
			biblioteca(`lib/${item.replace(code, "")}.js`);
		}
	};
});


//window.addEventListener("load", function(ev) {menu();});