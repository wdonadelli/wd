<?php
header("Content-Type: application/javascript");
echo file_get_contents("modules/LICENSE");
?>

/**
#1 Biblioteca JavaScript
#2 Documentação para Manutenção
#0 Menu
**/

"use strict";

const wd = (function() {

	/**#3 Constantes**/

	/**''const string __VERSION''
	Registra a versão da biblioteca.**/
	const __VERSION = "WD JS v5.0.0";

	/**''const boolean __UNDERMAINTENANCE''
	Se verdadeiro, libera em WD métodos em teste e imprime cascata de disparadores.**/
	const __UNDERMAINTENANCE = true;

	/**''const string __CSS''
	Folha de estilos básica da biblioteca.**/
	const __CSS = `<?php
echo file_get_contents("modules/JS.style.css");
	?>`;



<?php
/*-- carregando módulos --*/
echo file_get_contents("modules/JS.constant.js");
echo file_get_contents("modules/JS.css.js");














?>

	return WD;
}());