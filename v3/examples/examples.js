function onOffStyle() {
	wd$("html").class({toggle: "wd"});
	return;
}

function boxCode(css) {
	var text;
	text = css === undefined ? "" : wd$(css).item().innerHTML;
	wd$("#boxCodeContent").item().textContent = text;
	wd$("#boxCode").action("open");
	return;
}
