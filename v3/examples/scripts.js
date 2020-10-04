/*-- Menu Style -- */
function toggleStyle() {
	wd$("html").class({toggle: "wd"});
	return;
}

/*-- Define código CSS --*/
function setCSS(css, value) {
	wd$(css).class(null).class({add: value});
	return;
}

/*============================================================================*/
/*-- Elabora a lista de métodos --*/
function oTools(input) {
	var arr, tools;
	arr = [
		{tool: "toString();", args: 0},
		{tool: "valueOf();", args: 0}
	];
	tools = input.tools;
	for (var i = 0; i < tools.length; i++) {
		var obj = {};
		obj.tool = wd(input[tools[i]]).type === "function" ? tools[i]+"();" : tools[i]+";";
		obj.args = wd(input[tools[i]]).type === "function" ? input[tools[i]].length : 0;
		arr.push(obj);
	}
	return arr;
}

/*-- Exibe a lista com os métodos --*/
function generic(val) {
	var input, aux;
	input = wd$("#input").item().value.replace(/\n/g, "");
	wd$("#methods").repeat([]);
	if (val !== undefined) {
		wd$("#input").item().value += val;
		generic();
	} else if ((/^wd\$?\((.+)?\)\.$/).test(input)) {
		try {
			aux = oTools(eval("("+input.replace(/\.$/, "")+")"));
			wd$("#methods").repeat(aux);
		} catch(e) {
			wd$("#output").item().textContent = "ERROR: "+e.message;
			return;
		}
	} else if ((/^wd\$?\((.+)?\)\.[0-9a-zA-Z]+(\((.+)?\))?\;$/).test(input)) {
		try {
			aux = eval("("+input.replace(/\;$/, "")+");");
			wd$("#output").item().textContent = JSON.stringify(aux);
		} catch(e) {
			wd$("#output").item().textContent = "ERROR: "+e.message;
			return;
		}
	} else {
		wd$("#output").item().textContent = "";
	}
	return;
}

/*============================================================================*/

/*-- Obtém o código do elemento --*/
function getCode(css, all) {
	var inner, outer, elem;
	elem  = wd$(css);
	outer = elem.item().outerHTML;
	inner = elem.item().innerHTML;
	if (all === false) {
		return inner;
	}
	if (all === true || inner === "") {
		return outer;
	}
	outer = outer.replace(/[\n\t]/g, "");
	inner = inner.replace(/[\n\t]/g, "");
	outer = outer.replace(inner, "...");
	return outer;
}

/*-- Define as características da caixa de exemplo --*/
function boxExample(from, to, all) {
	wd$(to).
		class({add: "wd-code wd-radius wd-padding wd-margin-height"}).
		item().textContent = getCode(from, all).replace(/\&amp\;/g, "&");
	return;
}

/*-- Exibe a janela com o código --*/
function showCode(css, all) {
	all = css === undefined ?  false : all;
	css = css === undefined ? "main" : css;
	var text = getCode(css, all);
	wd$("#sourceCode").item().textContent = text;
	wd$("#winCode").action("open");
	return;
}


























function langConfig(lang) {
	var obj = {
		it: {
			modalMsg:  "Richiesta in corso ...",
			modalFg:   "#FFFFFF",
			modalBg:   "#005544",
			fileTitle: "File",
			fileSize:  "Dimensioni del file maggiori di quelle consentite.",
			fileTotal: "Dimensione totale del file maggiore di quella consentita.",
			fileChar:  "Caratteri non consentiti nel nome del file.",
			fileLen:   "Numero massimo di file superato.",
			fileType:  "Tipo di file non consentito."
		},
		de: {
			modalMsg:  "Anfrage in Bearbeitung...",
			modalFg:   "#FFFFFF",
			modalBg:   "#005544",
			fileTitle: "Dateien",
			fileSize:  "Größere Dateigröße als zulässig.",
			fileTotal: "Gesamtdateigröße größer als zulässig.",
			fileChar:  "Zeichen im Dateinamen nicht zulässig.",
			fileLen:   "Maximale Anzahl von Dateien überschritten.",
			fileType:  "Dateityp nicht erlaubt."
		},
		pt: {
			modalMsg:  "Solicitação em andamento ...",
			modalFg:   "#FFFFFF",
			modalBg:   "#005544",
			fileTitle: "Arquivos",
			fileSize:  "Tamanho de arquivo maior do que o permitido.",
			fileTotal: "O tamanho total do arquivo é maior do que o permitido.",
			fileChar:  "Caracteres não permitidos no nome do arquivo.",
			fileLen:   "Número máximo de arquivos excedido.",
			fileType:  "Tipo de arquivo não permitido."
		}
	};
	if (lang in obj) {
		var content = "";
		for (var i in obj[lang]) {
			content += i+"{"+obj[lang][i]+"}";
		}
		wd$("body").data({wdConfig: content});
	} else {
		wd$("body").data({wdConfig: null});
	}
	boxExample("body", "#egconfig");
};










/*============================================================================*/
function testLoading() {
	wd().send("examples/target.php", function(x) {
		if (x.closed) {alert("End?");}
	});
}





























































/* All */
function viewCode(css) {
	if (css !== undefined) {
		var x = wd$(css).item(0).outerHTML.replace(/\t\t\t([^\t])/g, "$1")	;
		wd$("#winContent").item(0).textContent = x;
		wd$("#win").action("open");
	} else {
		wd$("#win").action("close");
	}
	return;
}

/*wd_attr_config_tool*/
function configBody() {
	var config = "";
	wd$("#config input").run(function(x) {
		config += x.name+"{"+x.value+"}";
	});
	wd(document.body).data({wdConfig: config});
	return;
}



/*wd_attr_config_tool*/

