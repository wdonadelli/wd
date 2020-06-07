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

function testeData() {
	var data = wd$("form *").Form;
	
	//console.log("O arquivo existe? ", wd("teste.php?puta=gostosa").path);
	wd("teste.php?${*}").request(function(x) {
		console.log(x);
		//console.log(x.text);
	}).post();

	return;
}

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
		<input id="loku" />
	</form>


	<pre>
<?php
echo "\n---\n\nREQUEST:\n\n";
print_r($_REQUEST);
echo "\n---\n\nFILES:\n\n";
print_r($_FILES);

//move_uploaded_file($_FILES['arquivo1']['tmp_name'], "/home/wd/bundinha2.pdf");
?>

	</pre>

	</body>
</html>
