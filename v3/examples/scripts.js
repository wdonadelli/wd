/*-- Menu Style -- */
function toggleStyle() {
	wd$("html").class({toggle: "wd"});
	return;
}

/*-- Exibe o código renderizado --*/
function reload() {
	var value = wd$("#code").item().value;
	wd$("#view").load(value);
	return;
}

/*-- Exibe o resultado javascript --*/
function getValue(x) {
	wd$("#view").item().innerHTML += "<div class=\"wd-code wd-padding-length\"><samp>"+JSON.stringify(x)+"</samp></div>";
	return;
}

/*-- Faz um teste de requisição --*/
function testLoading() {
	wd().send("examples/target.php", function(x) {
		if (x.closed) {alert("Click to close:");}
	});
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
