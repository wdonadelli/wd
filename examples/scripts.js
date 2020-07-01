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
