/**
#3 Estilos
O objeto '{__CSS} registra os dados dos estilos de cada ferramenta da biblioteca.
**/
const __CSS = {
	/**. '{array data}: Registra o conteúdo textual dos estilos da biblioteca.**/
	data: [`
/*-- Variáveis --*/
:root {
	--var-js-wd-z-index-0: 9999;
	--var-js-wd-z-index-1: 9998;
	--var-js-wd-z-index-2: 9997;
	--var-js-wd-z-index-3: 9996;
	--var-js-wd-move-edge: 15px;
	--var-js-wd-font-type: Verdana, sans-serif, monospace;
	--var-js-wd-font-size: 12px;
}
/*-- Animações --*/
@keyframes js-wd-animation-emerge {
	from {opacity: 0;} to {opacity: 1;}
}
@keyframes js-wd-animation-fade {
	from {opacity: 1;} to {opacity: 0;}
}
@keyframes js-wd-animation-emerge-modal {
	from {background-color: rgba(50,50,50,0);} to {background-color: rgba(50,50,50,0.7);}
}
@keyframes js-wd-animation-expand {
	from {transform: scale(0);} to {transform: scale(1);}
}
@keyframes js-wd-animation-shrink {
	from {transform: scale(1);} to {transform: scale(0);}
}
/*-- Geral ---*/
* {box-sizing: border-box !important;}`],
	/**. '{void handleEvent(object ev)}: Disparador do carregará o estilo da biblioteca na página durante o evento '{load}.**/
	handleEvent: function(ev) {
		const node = document.createElement("STYLE");
		node.innerHTML = this.data.join("\n");
		document.head.appendChild(node);
		return;
	},
};