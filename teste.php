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


// onprogress não funciona para medir o tamanho final do arquivo no GET ou POST

var WD = wd;
var wdModalOpen  = function() {console.log("wdOpenModal");}
var wdModalClose = function() {console.log("wdOpenClose");}
























//==============================================================================

function wdStandardRequest(action, pack, callback, method, async) {

	/* variáveis locais */
	var request, data, time;

	/* verificando argumentos */

	if (WD(action).type !== "text") {
		return false;
	}

	if (pack === undefined || WD(pack).type === "null") {
		pack = null;
	}

	method = (method === undefined || WD(method).type !== "text") ? "GET" : method.toUpperCase();

	if (async === undefined) {
		async = true;
	}

	if (WD(callback).type !== "function") {
		callback = null
	}

	/* obtendo a interface */
	if ("XMLHttpRequest" in window) {
		request = new XMLHttpRequest();
	} else if ("ActiveXObject" in window) {
		try {
			request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {
			request = new ActiveXObject("Microsoft.XMLHTP");
		}
	} else {
		//log("XMLHttpRequest and ActiveXObject are not available!", "e");
		return false;
	}

	/* metodo que verifica se o status já está encerrado */
	requestClosed = function() {
		if (["ERROR", "NOTFOUND", "ABORTED", "DONE"].indexOf(data.status) >= 0) {
			return true;
		}
		return false;
	}

	/* objeto com os dados */
	data = {
		status: "UNSENT",     /* UNSENT|OPENED|HEADERS|LOADING|UPLOADING|DONE|NOTFOUND|ABORTED|ERROR */
		time: 0,              /* tempo decorrido desde o início da chamada */
		load: 0,              /* registra o tamanho carregado na requisição */
		upload: 0,            /* registra o tamanho carregado no upload */
		TEXT: null,           /* registra o conteúdo textual da requisição */
		JSON: null,           /* registra o JSON da requisição */
		XML: null,            /* registra o XML da requisição */
		abort: function() {   /* registra a função para abortar*/
			if (!requestClosed()) {
				data.status = "ABORTED";
				request.abort();
				if (callback !== null) {
					callback(data);
				}
			}
			return;
		}
	};

	/* função a ser executada a cada mudança de estado */
	request.onreadystatechange = function(x) {//console.log(request);
		if (request.readyState < 1 || requestClosed()) {
			return;
		} else if (data.status === "UNSENT") {
			data.status = "OPENED";
		} else if (request.status === 404) {
			data.status = "NOTFOUND";
		} else if (request.readyState === 2) {
			data.status = "HEADERS";
		} else if (request.readyState === 3) {
			if ("onprogress" in request) {
				return;
			} else {
				data.status = "LOADING";
			}
		} else if (request.readyState === 4) {
			if (request.status === 200 || request.status === 304) {
				data.status = "DONE";
				data.TEXT   = request.responseText;
				data.XML    = request.responseXML;
				try {
					data.JSON = JSON.parse(data.TEXT) || eval("("+data.TEXT+")");
				} catch(e) {
					data.JSON = null;
				}
			} else {
				data.status = "ERROR";
			}
		}
		data.time = (new Date()) - time;
		if (requestClosed()) {
			wdModalClose();
		}
		if (callback !== null) {
			callback(data);
		}
		return;
	}

	/* função a ser executada durante o progresso */
	request.onprogress = function(x) {
		if (!requestClosed()) {
			data.status = "LOADING";
			data.load = x.loaded;
			data.time = (new Date()) - time;
			if (callback !== null) {
				callback(data);
			}
		}
		return;
	}
	
	/* funções a serem executada durante o upload */
	if ("upload" in request) {
		if ("onprogress" in request.upload) {
			request.upload.onprogress = function(x) {
				if (!requestClosed()) {
					data.status = "UPLOADING";
					data.upload = x.loaded;
					data.time = (new Date()) - time;
					if (callback !== null) {
						callback(data);
					}
				}
				return;
			}
		}
	}

	/* abrir janela modal */
	wdModalOpen();

	/*tempo inicial da chamada */
	time = new Date();

	/* envio da requisição */
	request.open(method, action, async);

	if (method === "POST" && WD(pack).type === "text") {
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	}

	request.send(pack);

	return true;
}




















//==============================================================================

function testeData() {
	var data = new FormData();
	data.append("texto", "willian gostosão");
	//data.append("arquivo1", wd$("input[name=arquivo2]").item(0).files[0]);

	var text = wd$("form *").form;

	wdStandardRequest("teste.php?nome=valor", data, function(x) {
		console.log(x);
		if (x.status === "DONE") {
			console.log(x.TEXT);
		}
		return;
	}, "POST");
	return;
}















function DONE() {
	console.log("----------------- DONE -----------------");
	wdStandardRequest( "grande.txt", null, function(x) {
		console.log(x);
		return;
	}, "POST", true);
}

function ABORTED () {
	console.log("----------------- ABORTED -----------------");
	wdStandardRequest("grande.txt", null, function(x) {
		console.log(x);
		//if (x.time > 15) {
		//if (x.status === "OPENED") {
			x.abort();
//		}
		return;
	}, null, "POST", true);
}

function NOTFOUND () {
	console.log("----------------- NOTFOUND -----------------");
	wdStandardRequest("grande2.txt", null, function(x) {
		console.log(x);
		return;
	}, "POST", true);
}

function PATH () {
	console.log("----------------- PATH -----------------");
	var existe;
	wdStandardRequest("grande.txt", null, function(x) {
		existe = x.status === "DONE" ? true : false;
		return;
	}, "HEAD", false);
	console.log(existe ? "Existe o arquivo" : "Não existe o arquivo");
	return existe;
}







//DONE();
//ABORTED();
//NOTFOUND();
//PATH();
















/*
		FIXME

 - testar com um arquivo binário
 - fechar o modal após aborted e not found

*/
		</script>
		
	</head>

	<body onload="loko();testeData();">


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
print_r($_REQUEST);
print_r($_FILES);

//move_uploaded_file($_FILES['arquivo1']['tmp_name'], "/home/wd/bundinha2.pdf");
?>

	</pre>

	</body>
</html>
