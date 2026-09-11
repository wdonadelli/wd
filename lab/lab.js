/*-- Montar WD --*/
function montar_wd(lista, tipo) {
	const code = [];
	const data = [];
	for (let i = 0; i < lista.length; i++) {
		if (lista[i].code === null || lista[i].data === null) return;
		code.push(lista[i].code);
		data.push(lista[i].data);
	}
	/*-- Arquivo Javascript --*/
	if (tipo === "js") {
		const jsURL  = __REQUEST.blob("const wd = (function() {\n" + code.join("") + "\n}());", "text/javascript", true);
		const jsLink = __HTML("a", {href: jsURL, textContent: `${__INFO.name}${__INFO.version}.js`, download: `${__INFO.name}.js`,});
		document.body.appendChild(jsLink);
		jsLink.click();
		jsLink.remove();
		URL.revokeObjectURL(jsURL);
		return;
	}
	/*-- Arquivo DOCODE --*/
	if (tipo === "html") {
		const elem = __HTML("div");
		__DOCODE.render(elem, data.join("\n"));
		document.getElementById("manutencao").innerHTML = elem.innerHTML;
		return;
	}
	return;
}

function obter_wd(tipo) {
	const lista = Array.from(document.querySelectorAll(`[data-library=true]`)).map(function(v,i,a) {
		return {src: v.src, code: null, data: null};
	});
	for (let i = 0; i < lista.length; i++)
		__REQUEST.send({
			url: lista[i].src,
			call: function(x) {
				if (x.ok) {
					const split = __DOCODE.split(x.result, "/**", "**/");
					lista[i].code = split.code;
					lista[i].data = split.data;
					montar_wd(lista, tipo);
				}
				else if (x.done)
					throw new Error (`Erro na montagem da biblioteca: ${lista[i].src}`);
			},
	});
	return;
};





/*-- Menu Principal --*/
function lista_menu() {
	const re       = /(\w+)\.\w+/
	const scripts  = Array.from(document.querySelectorAll("[data-library]"));
	const pacotes  = scripts.map((v) => v.getAttribute("src").match(re)[1]);
	const exemplos = ["wdFilter", "wdMask", "wdRepeat", "wdDrag"];
	return [["Pacotes"].concat(pacotes.sort()), ["Exemplos"].concat(exemplos.sort()), "&#x1F4BE;Biblioteca", "Manutenção"];
}

function carregar_menu(x) {
	if (x.line[0] === "Biblioteca") {
		return obter_wd("js");
	}

	if (x.line[0] === "Manutenção") {
		document.querySelector(`[aria-controls="manutencao"]`).click();
		return obter_wd("html");
	}

	if (x.line[1] === "Exemplos") {
		document.querySelector(`[aria-controls="exemplo"]`).click();
		return WD.$("#exemplo").set({dataset: {wdLoad: `@url{eg/${x.line[0]}.html}`}});
	}

	if (x.line[1] === "Pacotes")
		return __REQUEST.send({url: `lib/${x.line[0]}.js`, call: function(x) {
			if (x.ok) {
				const split = __DOCODE.split(x.result, "/**", "**/");
				document.querySelector(`[aria-controls="manual"]`).click();
				document.getElementById("manual").innerHTML = "";
				__DOCODE.render(document.getElementById("manual"), split.data);
				document.getElementById("codigo").textContent = split.code;
			}
		}
	});
	return;
}

WD.attach("menu", function() {return {list: lista_menu(), call: carregar_menu};});



