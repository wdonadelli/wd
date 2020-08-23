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
	arr = [];
	tools = input.tools;
	for (var i = 0; i < tools.length; i++) {
		var obj = {};
		obj.tool = wd(input[tools[i]]).type === "function" ? tools[i]+"()" : tools[i];
		arr.push(obj);
	}
	return arr;
}


function js(check) {
	var input, tool, args, aux, out, screen;
	input = wd$("#input").item().value.trim() === "" ? undefined : wd$("#input").item().value;

	if (check === true) {
		try {
			aux = oTools(wd(eval(input)));
			wd$("#tool").repeat(aux);
		} catch(e) {
			wd("ERROR: "+e.toString()).message("error");
			wd$("#tool").repeat([]);
			wd$("#args").item().value = "";
			return;
		}
	}

	tool = wd$("#tool").item().value;
	args = wd$("#args").item().value;
	aux  = ("wd("+input+")."+tool).replace("()", "("+args+");");
	try {
		out = (eval(aux));
	} catch(e) {
		wd("ERROR: "+e.toString()).message("error");
		return;
	}
	screen  = ("wd(<var>"+input+"</var>)."+tool).replace("()", "(<var>"+args+"</var>);");
	screen += "<br><samp>"+out+"</samp>";
	console.log(screen);
	wd$("#output").item().innerHTML = screen;
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
