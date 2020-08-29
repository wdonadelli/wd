function toggleStyle() {
	wd$("html").class({toggle: "wd"});
	return;
}

function showCode(input) {
	input = wd(input).type === "text" ? input : "main";
	wd().send(input, function(x) {
		var text;
		if (x.closed) {
			text = x.status === "DONE" ? x.text : wd$(input).item().innerHTML;
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

/*wd_attr_file_tool*/
function setFile() {
	var config = "";
	wd$("#dataFile input").run(function(x) {
		config += x.name+"{"+x.value+"}";
	});
	wd$("#typeFile").data({wdFile: config});
	return;
}

/*wd_attr_config_tool*/
function testLoading() {
	wd().send('wd_attr_config_tool.html', function(x) {
		if (x.status === "DONE") {
			alert("Hi!");
		}
	});
}
