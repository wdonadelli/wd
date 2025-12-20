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
	--var-js-wd-font-code: Fira Mono, DejaVu Sans Mono, Menlo, Consolas, Liberation Mono, Monaco, Lucida Console, monospace;
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
	/**. '{void temp(node target, object style)}: Define temporariamente as propriedades do atributo '{style} preservando-as para a reversão. O argumento '{style} é um objeto cujas propriedades fazem referência às propriedades do atributo '{style}. O valor dessas propriedades também são objetos cujo nome da propriedades aponta para o valor inaquedado (utilize o caractere * como nome da propriedade para definir qualquer valor} enquanto que seu valor aponta para o novo estilo a ser atualizado temporariamente. Se o argumento '{style} não for informado, os valores serão reestabelecidos. b{Cuidado com o nome das cores e as medidas}, dentre outros atributos, pois, respectivamente, não são sensibilizadas pelo nome ou são definidas em unidade de medida padrão. Se precisar alterá-las, utilize o caractere coringa.
		. Exemplificando, caso o valor "inline" para a propriedade '{display} seja inadequado, devendo ser alterado temporariamente para "inline-block", o argumento '{style} deverá ser definindo como:
	''{display: {inline: "inline-block"}}''**/
	temp: function(node, style) {
		const undo = !(typeof style === "object" && style !== null);
		if (undo && "jsWdTemp" in node.dataset) {
			const temp = JSON.parse(node.dataset.jsWdTemp);
			delete node.dataset.jsWdTemp;
			for (let i in temp) node.style[i] = temp[i];
		}
		else if (!undo) {
			const data = window.getComputedStyle(node, null);
			const temp = "jsWdTemp" in node.dataset ? JSON.parse(node.dataset.jsWdTemp) : {};
			/*-- percorrendo as propriedades do argumento style (tipo do estilo) --*/
			for (let name in style) {
				/*-- percorrendo os valores do estilo a ser encontrado (valor do estilo) --*/
				for (let value in style[name]) {
					/*-- se o valor incorreto da propriedade for encontrado --*/
					if (data[name] === value || value === "*") {
						/*-- preservar a informação original --*/
						if (!(name in temp))
							temp[name] = node.style[name] === "" ? null : node.style[name];
						/*-- definindo o novo valor temporariamente --*/
						node.style[name] = style[name][value];
						break;
					}
				}
			}
			node.dataset.jsWdTemp = JSON.stringify(temp);
		}
		return;
	},
};