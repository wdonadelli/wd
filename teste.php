<!DOCTYPE html>
<html>
	<head>
		<title>WD</title>
		<meta charset="UTF-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
		<meta name="keywords" content="github, wdonadelli, wd, XSQLite, PSWrequest">
		<meta name="author" content="Willian Donadelli"/>
		<meta name="description" content="wd"/>
		<meta name="rating" content="general" />
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<link  href="v2/wd.css" rel="stylesheet" />
		<script src="v2/wd.js"></script>
		<script>
function loko() {
	wd$("#form").item(0).textContent = wd$("#loko *").form;
}

function myLog(nome, arg) {
	console.log(nome);
	console.log(arg);
	//console.log(arg.target);
}

function loading() {
	var request = new XMLHttpRequest() || new ActiveXObject("Msxml2.XMLHTTP") || new ActiveXObject("Microsoft.XMLHTP");


	request.onreadystatechange = function(x) {myLog("onreadystatechange", request);}
	//request.onreadystatechange = function(x) {myLog("onreadystatechange", request);if (request.readyState === 2) {request.abort();}}
	//request.upload.progress = function(x) {console.log("UPLOAD");console.log(x);}


	//request.onload             = function(x) {myLog("onload", x);}
	//request.onloadend          = function(x) {myLog("onloadend", x);}
	//request.onloadstart        = function(x) {myLog("onloadstart", x);}
	request.onprogress         = function(x) {myLog("onprogress", x);console.log(x.loaded);}



	request.onabort            = function(x) {myLog("onabort", x);}
	request.onerror            = function(x) {myLog("onerror", x);}
	request.ontimeout          = function(x) {myLog("ontimeout", x);}


	request.open("POST", "v2/wd.css", true);
	//request.open("POST", "pacoteGrandeTeste.js", true);
	request.send();
}

// onprogress não funciona para medir o tamanho final do arquivo no GET ou POST



function WDdataRequest(request, time) {

	this.state = function() {
		// <= 2 START
		// == 3 PROGRESS
		// == 4 END
		return "START|PROGRESS|END|ABORTED|ERROR";
	}
	this.time = function() {
		return;
	}
	this.XML = function() {
		return "xml";
	}
	this.JSON = function() {
		return "xml";
	}
	this.TEXT = function() {
		return "xml";
	}
	this.message = function() {
		return request.statusText;
	}


}

var WD = wd;


function wdAJAX(action, method, pack, async, callback) {

	/* variáveis locais */
	var request;

	/* obtendo a interface */
	











}











		</script>
		
	</head>

	<body onload="loko();loading();">


	<form id="loko" class="wd-vform" >
		<input type="text" name="texto" class="wd-input" onkeyup="loko();"/>
		<input type="file" name="arquivo1" class="wd-input" onchange="loko();"/>
		<input type="file" name="arquivo2" multiple class="wd-input" onchange="loko();"/>
		<input type="checkbox" name="check" multiple class="wd-input" onchange="loko();"/> sem value
		<input type="checkbox" name="vcheck" multiple class="wd-input" value="mycheck" onchange="loko();"/> com value
		<input type="radio" name="radio" multiple class="wd-input" onchange="loko();"/> sem value 1
		<input type="radio" name="radio" multiple class="wd-input" onchange="loko();"/> sem value 2
		
		<input type="radio" name="vradio" multiple class="wd-input" value="radio1" onchange="loko();"/> com value 1
		<input type="radio" name="vradio" multiple class="wd-input" value="radio2" onchange="loko();"/> com value 2
		<p id="form" class="wd-text-red wd-input"></p>
		<input type="submit" name=""  class="wd-button"/>
	</form>


	<pre>
<?php
print_r($_GET);
?>

	</pre>

	</body>
</html>
