
/*-- Menu Principal --*/
function lista_menu() {
	const re       = /(\w+)\.\w+/
	const scripts  = Array.from(document.querySelectorAll("[data-library]"));
	const pacotes  = scripts.map((v) => v.getAttribute("src").match(re)[1]);
	const exemplos = ["wdFilter", "wdMask", "wdRepeat"];
	return [["Pacotes"].concat(pacotes.sort()), ["Exemplos"].concat(exemplos.sort())];
}

function carregar_menu(x) {
	if (x.line[1] === "Exemplos")
		return WD.$("#exemplo").set({dataset: {wdLoad: `@url{eg/${x.line[0]}.html}`}});

	if (x.line[1] === "Pacotes")
		return __REQUEST.send({url: `lib/${x.line[0]}.js`, call: function(x) {
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

WD.attach("menu", function() {return {list: lista_menu(), call: carregar_menu};});