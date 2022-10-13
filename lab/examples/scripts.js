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

/*-- para attr_config.html --*/
function testLoading(x) {
	if (x.closed) {alert("Click to close:");}
}
