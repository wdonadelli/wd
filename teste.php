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

function testeData(x) {
	console.log(x);
	if (x.closed && x.status === "DONE") console.log(x.text);
	return;
}

	</script>
		
	</head>

	<body onload="alerdst('11uy1u1yo1u1y');" onresize="console.log('drogas');" data-WD-DEVICE="desktop{wd-box-red}mobile{wd-box-blue}">


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
		<input type="button" value="Send()" class="wd-button" data-wd-send="post{teste.php}${*}callback{testeData}"/>
		<input type="button" value="Request()" class="wd-button" data-wd-request="get{teste.php?${*}}method{testeData}" onclick="alert(123);"/>
	</form>


	<pre data-wd-repeatd="post{manual/log.json}">
		<p>{{target}}</p>

<?php
echo "\n---\n\nREQUEST:\n\n";
print_r($_REQUEST);
echo "\n---\n\nFILES:\n\n";
print_r($_FILES);

//move_uploaded_file($_FILES['arquivo1']['tmp_name'], "/home/wd/bundinha2.pdf");
?>

	</pre>


	<div onclickxxx="alert('loko');" id="evento" class="wd-xxxmargin wd-border">
		<ul>
			<li><p>Item <span>111111111111111111111</span></p></li>
			<li>item 2</li>
		</ul>
	</div>




	</body>
</html>
