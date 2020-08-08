function onOffStyle() {
	wd$("html").class({toggle: "wd"});
	return;
}

function boxCode(css) {
	var text, tabs, dspl;
	text = [""];
	tabs = wd$(css);
	dspl = tabs.getStyle("display");
	for (var i = 0; i < dspl.length; i++) {
		if (dspl[i].toLowerCase() !== "none") {
			text.push(tabs.item(i).innerHTML);
		}
	}
	wd$("#boxCodeContent").item().textContent = text.join("\n").replace(/\n\t\t\t/g, "\n").trim();
	wd$("#boxCode").action("open");
	return;
}

function setCss(elem, css) {
	wd$(css).class(null).class({add: elem.value});
	return;
}


