
/*-- Menu Principal --*/
function lista_biblioteca() {
	const query = Array.from(document.querySelectorAll("[data-library]"));
	const list  = query.map(function(v,i,a) {return v.getAttribute("src");}).sort();
	return ["Pacotes"].concat(list);
}

function lista_exemplo() {
	const list = ["Exemplos", "wdFilter", "wdMask"];
	return list.map(function(v,i,a) {return i > 0 ? `eg/${v}.html` : v});
}

function carregar(url) {
	/*-- exemplos --*/
	if ((/^eg\//).test(url))
		return __HTML(document.getElementById("exemplo"), {dataset: {wdLoad: `@url{${url}}`}});
	/*-- biblioteca --*/
	if ((/^lib\//).test(url))
		return __REQUEST.send({url: url, call: function(x) {
			if (x.ok) {
				const split = __DOCODE.split(x.result, "/**", "**/");
				document.getElementById("manual").innerHTML = "";
				__DOCODE.render(document.getElementById("manual"), split.data);
				document.getElementById("codigo").textContent = split.code;
			}
		}
	});
	return;
}

WD.attach("menu", function () {
	const menu = ["WD Lab Menu", lista_exemplo(), lista_biblioteca()];
	return {
		list: menu,
		call: function(x) {return carregar(x.path[x.path.length - 1])}
	};
});