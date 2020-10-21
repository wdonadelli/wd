function code() {
	var code = wd$("#view").item().innerHTML;
	code = code.replace(/[\n\t]/g, "").replace(/\&amp\;/g, "&");
	code = code.replace(/\>\</g, ">\n<");
	wd$("#code").item().textContent = code;
}

function model() {
	var file = wd$("#model-value").item().value;
	wd().send(file, function(x) {
		if (x.closed) {
			wd$("#view").load(x.text);
			code();
		}
		return;
	});
	return;
}

function css() {
	var target = "#view "+wd$("#css-target").item().value;
	var value  = wd$("#css-value").item().value;
	wd$(target).class(null).class({add: value});
	code();
	return;
}

function attr(minus) {
	var target = "#view "+wd$("#attr-target").item().value;
	var attr   = wd$("#attr-attr").item().value;
	var value  = wd$("#attr-value").item().value;
	var obj = {};
	obj[attr] = minus === 0 ? null : value;
	wd$(target).data(obj);
	code();
	return;
}

function attr2() {
	attr(0);
	return;
}

function js() {
	var value = wd$("#js-value").item().value;

	if ((/^wd\$?\((.+)?\)\.[0-9a-zA-Z]+(\((.+)?\))?\;$/).test(value)) {
		try {
			var aux = eval("("+value.replace(/\;$/, "")+");");
			wd("<span>"+JSON.stringify(aux)+"</span>").message("info");
		} catch(e) {
			wd("ERROR: "+e.message).message("error");
		}
	}
	code();
	return;
}











wd(window).handler({
	load: function() {
		wd$("#model-action").handler({click: model});
		wd$("#css-action").handler({click: css});
		wd$("#attr-plus").handler({click: attr});
		wd$("#attr-minus").handler({click: attr2});
		wd$("#js-action").handler({click: js});
		return;
	},
	resize: code
});
