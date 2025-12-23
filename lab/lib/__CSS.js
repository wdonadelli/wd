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
	/**. '{number ration(integer color)}: Ajusta a cor (0-255) para o cálculo da luminância.**/
	ratio: function(color) {
		const min = 0.03928;
		const rgb = (color < 0 ? 0 : (color > 255 ? 255 : color))/255;
		return rgb <= min ? (rgb/12.92) : Math.pow(((rgb + 0.055)/1.055), 2.4);
	},
	/**. '{number luminance(integer r, integer g, integer b)}: Retorna a luminância da cor.**/
	luminance: function(r, g, b) {
		return (0.2126 * this.ratio(r)) + (0.7152 * this.ratio(g)) + (0.0722 * this.ratio(b));
	},
	/**. '{number contrast(number l1, number l2)}: Retorna o contraste entre luminância '{l1} (clara) e '{l2} (escura).**/
	contrast: function(l1, l2) {
		/*-- L1 (cor clara, maior luminância) --*/
		const L1 = l1 >= l2 ? l1 : l2;
		/*-- L2 (cor escura, menor luminância) --*/
		const L2 = l1 >= l2 ? l2 : l1;
		/*-- 21 é o maior nível --*/
		return L2 === 0 ? 21 : (L1 + 0.05) / (L2 + 0.05);
	},
	/**. '{string level(number value, boolean heavy)}: Retorna o nível do contraste '{value} (A, AA, AAA) conforme texto '{heavy}.**/
	level: function (value, heavy) {
		/*-- texto grande: negrito ou fonte 18pt/24px --*/
		return heavy === true ? (value >= 4.5 ? "AAA" : (value >= 3 ? "AA" : "A")) : (value >= 7 ? "AAA" : (value >= 4.5 ? "AA" : "A"));
	},

	back: function(r, g, b, heavy) {
		const rgb  = [];
		const lum1 = this.luminance(r, g, b);
		for (let R = 0; R <= 255; R += 10) {
			for (let G = 0; G <= 255; G += 10) {
				for (let B = 0; B <= 255; B += 10) {
					let lum2 = this.luminance(R, G, B);
					let diff = this.contrast(lum1, lum2);
					let data = this.level(diff, heavy);
					if (data === "AAA")
						rgb.push({r: R, g: G, b: B, level: data});
				}
			}
		}
		return rgb;
	},

	palette: function(r, g, b, heavy) {
		const back = this.back(r, g, b, heavy);
		const html = back.map(function(v,i,a) {
			return `<p style="color: rgb(${v.r}, ${v.g}, ${v.b});" >${v.level} (${v.r}, ${v.g}, ${v.b})</p>`;
		});
		const main = document.createElement("DIV");
		main.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
		main.innerHTML = html.join("");
		return main;
	},







};