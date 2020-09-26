function toggleStyle() {
	wd$("html").class({toggle: "wd"});
	return;
}

function showCode(input, outside) {
	outside = outside === true ? "outerHTML" : "innerHTML";
	input   = wd(input).type === "text" ? input : "main";
	wd().send(input, function(x) {
		var text;
		if (x.closed) {
			text = x.status === "DONE" ? x.text : wd$(input).item()[outside];
			text = text.replace(/\&amp\;/g, "&");
			wd$("#sourceCode").item().textContent = text;
			wd$("#winCode").action("open");			
		}
		return;	
	});
	return;
}

function setCSS(css, value) {
	wd$(css).class(null).class({add: value});
	return;
}

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
function getCode(css, all) {
	var inner, outer, elem;
	elem  = wd$(css);
	outer = elem.item().outerHTML;
	inner = elem.item().innerHTML;
	if (all === true || inner === "") {
		return outer;
	}
	outer = outer.replace(/[\n\t]/g, "");
	inner = inner.replace(/[\n\t]/g, "");
	outer = outer.replace(inner, "...");
	return outer;
}


function boxExample(from, to, all) {
	wd$(to).
		class({add: "wd-code wd-radius wd-padding wd-margin-height"}).
		item().textContent = getCode(from, all).replace(/\&amp\;/g, "&");
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
};












function setAttrCode(code, attr) {
	code = code.replace(/^(\<[a-z]+)(\ |\/\>|\>)/, "$1 "+attr+" $2");
	return code;
}

function setAttr(css, attr, value, all) {
	var obj, code, html;
	code = getCode(css, all);
	if (attr === null || value === null) {return code;}
	obj = {};
	obj[attr] = value;
	html = setAttrCode(code, " data-"+(wd(attr).dash)+"=\""+value+"\"");
	wd$(css).data(obj);
	return html;
}

function getAttrValue(css) {
	var array = [];
	wd$(css).run(function (x) {
		if (x.value !== "" && x.value !== "0" && x.value !== undefined && x.value !== null) {
			array.push(x.name+"{"+x.value+"}");
		}
		return;
	});
	return array.length === 0 ? "" : array.join("");
}

function setExample(from, to, form, attr, all) {
	var code, attr, value;
	if (form === null) {
		value = null;
	} else if ((/^\{/).test(form)) {
		value = form.replace(/^\{/, "").replace(/\}$/, "");
	} else {
		value = getAttrValue(form);
	}
	code  = setAttr(from, attr, value, all);
	wd$(to).item().textContent = code;
	return;
}







/*
function setAttrConfig(attr, get, set, eg, force) {
	var example;

	example = wd$(set).item().outerHTML.split(">");
	example[0] = example[0].replace(/\/$/, "");
	example[1] = example.length === 2 ? " />" : " > ..."
	if (object[attr] !== null) {
		example[0] += " data-"+(wd(attr).dash)+"=\""+object[attr]+"\"";
	}
	wd$(eg).item().textContent = example[0]+example[1];

	wd$(set).data(object);
	return;
}*/
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

