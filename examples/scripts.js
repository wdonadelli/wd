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

/*wd_attr_config_toll*/
function configBody() {
	var config = "";
	wd$("#config input").run(function(x) {
		config += x.name+"{"+x.value+"}";
	});
	wd(document.body).data({wdConfig: config});
	return;
}

/*wd_attr_file_toll*/
function setFile() {
	var config = "";
	wd$("#dataFile input").run(function(x) {
		config += x.name+"{"+x.value+"}";
	});
	wd$("#typeFile").data({wdFile: config});
	return;
}
