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


	//request.onreadystatechange = function(x) {myLog("onreadystatechange", request);}
	//request.onreadystatechange = function(x) {myLog("onreadystatechange", request);if (request.readyState === 2) {request.abort();}}
	//request.upload.progress = function(x) {console.log("UPLOAD");console.log(x);}


	request.onload             = function(x) {myLog("onload", x);}
	request.onloadend          = function(x) {myLog("onloadend", x);}
	request.onloadstart        = function(x) {myLog("onloadstart", x);}
	request.onprogress         = function(x) {myLog("onprogress", x);console.log(x.loaded);}



	request.onabort            = function(x) {myLog("onabort", x);}
	request.onerror            = function(x) {myLog("onerror", x);}
	request.ontimeout          = function(x) {myLog("ontimeout", x);}


	request.open("POST", "v2/wd.css", true);
	//request.open("POST", "pacoteGrandeTeste.js", true);
	//request.send();
}

// onprogress não funciona para medir o tamanho final do arquivo no GET ou POST

var WD = wd;
var wdModalOpen  = function() {console.log("wdOpenModal");}
var wdModalClose = function() {console.log("wdOpenClose");}








function wdStandardRequest(method, action, pack, async, callback) {

	/* variáveis locais */
	var request, data, time;

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

	/*tempo inicial da chamada */
	time = new Date();

	/* objeto com os dados */
	data = {
		state: "UNSENT",      /* UNSENT|OPENED|HEADERS|LOADING|DONE|ABORTED|ERROR */
		time: 0,              /* tempo decorrido desde o início da chamada */
		message: "",          /* registra mensagem do statusText */
		load: 0,              /* registra o tamanho carregado na requisição */
		upload: 0,            /* registra o tamanho carregado no upload */
		TEXT: null,           /* registra o conteúdo textual da requisição */
		JSON: null,           /* registra o JSON da requisição */
		XML: null,            /* registra o XML da requisição */
		abort: function() {   /* registra a função para abortar*/
			//data.state = "ABORTED";
			request.abort();
			return;
		}
	};

	/* abrir janela modal */
	wdModalOpen();

	/* função a ser executada a cada mudança de estado */
	request.onreadystatechange = function(x) {
		if (request.readyState < 1) {
			return;
		} else if (request.readyState == 1) {
			data.state = "OPENED";
		} else if (request.readyState == 2) {
			data.state = "HEADERS";
		} else if (request.readyState == 3) {
			data.state = "LOADING";
		} else if (request.readyState == 4) {
			if (request.status === 200 || request.status === 304) {
				data.state = "DONE";
				data.TEXT  = request.responseText;
				data.XML   = request.responseXML;
				try {
					data.JSON = JSON.parse(data.TEXT) || eval("("+data.TEXT+")");
				} catch(e) {
					data.JSON = null;
				}
			} else {
				data.state = "ERROR";
			}
			wdModalClose();
		}
		data.message = request.statusText;
		data.time = (new Date()) - time;
		callback(data);
		return;
	}

	/* função a ser executada no caso de erro */
	request.onerror = function(x) {
		if (data.state !== "ERROR" && data.state !== "ABORTED") {
			data.state = "ERROR";
			data.message = request.statusText;
			wdModalClose();
			data.time = (new Date()) - time;
			callback(data);
		}
		return;
	}

	/* função a ser executada no caso de abortar */
	request.onabort = function(x) {
		/* chamar apenas uma vez o aborte */
		if (data.state !== "ABORTED") {
			data.state = "ABORTED";
			data.message = request.statusText;
			wdModalClose();
			data.time = (new Date()) - time;
			callback(data);
		}
		return;
	}

	/* função a ser executada durante o progresso */
	request.onprogress = function(x) {
		data.load = x.loaded;
		data.message = request.statusText;
		data.time = (new Date()) - time;
		callback(data);
		return;
	}
	
	/* funções a serem executada durante o upload */
	request.upload.onloadstart = function(x) {
		data.upload = x.loaded;
		data.message = request.statusText;
		data.time = (new Date()) - time;
		callback(data);
		return;
	}
	request.upload.onprogress = request.upload.onloadstart;
	//request.upload.onload     = request.upload.onloadstart;
	//request.upload.onloadend  = request.upload.onloadstart;

	/* envio da requisição */
	request.open(method, action, async);
	request.send();

	return true;
}



wdStandardRequest("POST", "grande.txt", null, true, function(x) {
	console.log(x);
	if (x.time > 31) {
		x.abort();
	}
	return;
});



/*
		FIXME

 - se eu provoco o abort, o primeiro evento tem que ser o abort e não o error
 - se o arquivo não existe, tenho que provocar o erro
 
 
 **** acho que o jeito é tirar o ABORTED ****

*/
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
