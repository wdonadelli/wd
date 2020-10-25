/*-- Menu Style -- */
function toggleStyle() {
	wd$("html").class({toggle: "wd"});
	return;
}

/*-- Exibe o código renderizado --*/
function showView() {
	var value = wd$("#code").item().value;
	if ((/^wd\$?\((.+)?\)\.[0-9a-zA-Z]+(\((.+)?\))?\;$/).test(value) === true) {
		try {
			var aux = eval("("+value.replace(/\;$/, "")+");");
			wd$("#view").item().textContent = JSON.stringify(aux);
		} catch(e) {
			wd$("#view").item().textContent = "ERROR: "+e.message;
			return;
		}
	} else {
		wd$("#view").load(value);
	}
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

/*ferramenta de teste do config.html*/
function langConfig(lang) {
	var obj = [
		"modalMsg{Downloading data can take some time!}",
		"modalFg{white}",
		"modalBg{#4169E1}",
		"fileTitle{Something failed ...}",
		"fileSize{Very large file}",
		"fileTotal{Total size too large}",
		"fileChar{Strange characters found}",
		"fileLen{Too many files}",
		"fileType{Strange files}"
	];
	wd$("body").data({wdConfig: (lang === undefined ? null : obj.join(""))});
	boxExample("body", "#egconfig");
};

/*============================================================================*/
function testLoading() {
	wd().send("examples/target.php", function(x) {
		if (x.closed) {alert("Click to close:");}
	});
}
