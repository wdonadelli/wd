/**
#3 Estilos
O objeto '{__CSS} registra os dados dos estilos de cada ferramenta da biblioteca.
**/
const __CSS = {
	/**. '{node style}: Elemento HTML para registrar os estilos CSS.**/
	style: document.createElement("style"),
	/**. '{void push}: Adiciona estilo CSS à biblioteca.**/
	push: function(css) {this.style.innerHTML += `\n`+css;},
	/**. '{void handleEvent(object ev)}: Disparador para carregar o estilo da biblioteca durante o evento '{load}.**/
	handleEvent: function(ev) {
		if (this.style.parentElement !== document.head)
			document.head.appendChild(this.style);
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
	/**. '{array rgb(string color)}: Retorna os valores de [red, green, blue] a partir do nome da cor ou formato hex.**/
	rgb: function(color) {
		if (Array.isArray(color)) return color;
		color = String(color).trim().toLowerCase();
		const re  = /^([0-9a-fA-F][0-9a-fA-F])([0-9a-fA-F][0-9a-fA-F])([0-9a-fA-F][0-9a-fA-F])$/;
		const hex = color in this.colors ? this.colors[color] : (re.test(color) ? color : "000000");
		return hex.match(re).slice(1).map(function(v,i,a) {return parseInt(v, 16);});
	},
	/**. '{number ration(integer value)}: Ajusta a cor de linear (0-255) para racional (0-1).**/
	ratio: function(value) {
		const ref = 0.04045;
		const val = (value < 0 ? 0 : (value > 255 ? 255 : value))/255;
		return val <= ref ? (val/12.92) : Math.pow(((val + 0.055)/1.055), 2.4);
	},
	/**. '{number luminance(string color)}: Retorna a luminância da cor (ver método '{rgb}).**/
	luminance: function(color) {
		const rgb = this.rgb(color).map(function(v,i,a) {return this.ratio(v);}, this);
		return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]);
	},
	/**. '{number contrast(string color1, string color2)}: Retorna o contraste entre as cores (ver método '{rgb}).**/
	contrast: function(color1, color2) {
		const l1 = this.luminance(color1);
		const l2 = this.luminance(color2);
		/*-- L1 (cor clara, maior luminância) --*/
		const L1 = l2 > l1 ? l2 : l1;
		/*-- L2 (cor escura, menor luminância) --*/
		const L2 = l2 > l1 ? l1 : l2;
		/*-- retorno --*/
		return (L1 + 0.05) / ((L2 === 0 ? this.luminance("000001") : L2) + 0.05);
	},
	/**. '{integer WCAG(string color1, string color2, boolean big)}: Retorna a nível de acessibilidade do contraste de cores em 1, 2 ou 3 (quantidade de As). O argumento '{big} deverá ser verdadeiro para negrito ou fonte maior que 18pt/24px.**/
	WCAG: function (color1, color2, big) {
		const diff = this.contrast(color1, color2);
		return big !== true ? (diff >= 7 ? 3 : (diff >= 4.5 ? 2 : 1)) : (diff >= 4.5 ? 3 : (diff >= 3 ? 2 : 1));
	},
	/**. '{object wacgList(string color, integer wacg, boolean big)}: Retorna as opções de melhor contraste '{wacg} à cor '{color}.**/
	wacgList: function(color, wacg, big) {
		const list = {};
		for (let i in this.colors) {
			if (this.WCAG(color, i) >= wacg)
				list[i] = this.colors[i];
		}
		return list;
	},
	/**. '{void wacgName(node node, string color, integer wacg, boolean big)}: Exibe no nó as cores que passaram no teste.**/
	wacgName: function(node, color, wacg, big) {
		node.style.backgroundColor = `rgb(${this.rgb(color).join(",")})`;
		node.innerHTML = "";
		const font = big === true ? "bold" : "normal"
		let  index = 0;
		const list = this.wacgList(color, wacg, big);
		for (let i in list) node.appendChild(__HTML("span", {
			textContent: `${++index}) ${i} HEX[#${list[i]}] `,
			style: {color: `#${list[i]}`, fontWeight: font, display: "inline-block", padding: ".5em"},
		}));
		return;
	},
	/**. '{void wacgRGB(node node, string color, boolean big)}: Semelhante ao '{wacgName} para cores não nominais.**/
	wacgRGB: function(node, color, big) {
		node.style.backgroundColor = `rgb(${this.rgb(color).join(",")})`;
		node.innerHTML = "";
		const font = big === true ? "bold" : "normal"
		const gap  = 17;
		for (let b = 0; b < 256; b += gap) {
			for (let g = 0; g < 256; g += gap) {
				for (let r = 0; r < 256; r += gap) {
					if (this.WCAG(color, [r, g, b], big) > 2)
						node.appendChild(__HTML("span", {
							textContent: `RGB[${r}, ${g}, ${b}] `,
							style: {color: `rgb(${r}, ${g}, ${b})`, fontWeight: font, display: "inline-block", padding: ".5em"},
						}));
				}
			}
		}
		return;
	},
	/**. '{object colors}: Retorna dados das cores nominais.**/
	colors: {
		pink: "ffc0cb",
		lightpink: "ffb6c1",
		hotpink: "ff69b4",
		deeppink: "ff1493",
		palevioletred: "db7093",
		mediumvioletred: "c71585",
		lavender: "e6e6fa",
		thistle: "d8bfd8",
		plum: "dda0dd",
		orchid: "da70d6",
		violet: "ee82ee",
		fuchsia: "ff00ff",
		magenta: "ff00ff",
		mediumorchid: "ba55d3",
		darkorchid: "9932cc",
		darkviolet: "9400d3",
		blueviolet: "8a2be2",
		darkmagenta: "8b008b",
		purple: "800080",
		mediumpurple: "9370db",
		mediumslateblue: "7b68ee",
		slateblue: "6a5acd",
		darkslateblue: "483d8b",
		rebeccapurple: "663399",
		indigo: "4b0082",
		lightsalmon: "ffa07a",
		salmon: "fa8072",
		darksalmon: "e9967a",
		lightcoral: "f08080",
		indianred: "cd5c5c",
		crimson: "dc143c",
		red: "ff0000",
		firebrick: "b22222",
		darkred: "8b0000",
		orange: "ffa500",
		darkorange: "ff8c00",
		coral: "ff7f50",
		tomato: "ff6347",
		orangered: "ff4500",
		gold: "ffd700",
		yellow: "ffff00",
		lightyellow: "ffffe0",
		lemonchiffon: "fffacd",
		lightgoldenrodyellow: "fafad2",
		papayawhip: "ffefd5",
		moccasin: "ffe4b5",
		peachpuff: "ffdab9",
		palegoldenrod: "eee8aa",
		khaki: "f0e68c",
		darkkhaki: "bdb76b",
		greenyellow: "adff2f",
		chartreuse: "7fff00",
		lawngreen: "7cfc00",
		lime: "00ff00",
		limegreen: "32cd32",
		palegreen: "98fb98",
		lightgreen: "90ee90",
		mediumspringgreen: "00fa9a",
		springgreen: "00ff7f",
		mediumseagreen: "3cb371",
		seagreen: "2e8b57",
		forestgreen: "228b22",
		green: "008000",
		darkgreen: "006400",
		yellowgreen: "9acd32",
		olivedrab: "6b8e23",
		darkolivegreen: "556b2f",
		mediumaquamarine: "66cdaa",
		darkseagreen: "8fbc8f",
		lightseagreen: "20b2aa",
		darkcyan: "008b8b",
		teal: "008080",
		aqua: "00ffff",
		cyan: "00ffff",
		lightcyan: "e0ffff",
		paleturquoise: "afeeee",
		aquamarine: "7fffd4",
		turquoise: "40e0d0",
		mediumturquoise: "48d1cc",
		darkturquoise: "00ced1",
		cadetblue: "5f9ea0",
		steelblue: "4682b4",
		lightsteelblue: "b0c4de",
		lightblue: "add8e6",
		powderblue: "b0e0e6",
		lightskyblue: "87cefa",
		skyblue: "87ceeb",
		cornflowerblue: "6495ed",
		deepskyblue: "00bfff",
		dodgerblue: "1e90ff",
		royalblue: "4169e1",
		blue: "0000ff",
		mediumblue: "0000cd",
		darkblue: "00008b",
		navy: "000080",
		midnightblue: "191970",
		cornsilk: "fff8dc",
		blanchedalmond: "ffebcd",
		bisque: "ffe4c4",
		navajowhite: "ffdead",
		wheat: "f5deb3",
		burlywood: "deb887",
		tan: "d2b48c",
		rosybrown: "bc8f8f",
		sandybrown: "f4a460",
		goldenrod: "daa520",
		darkgoldenrod: "b8860b",
		peru: "cd853f",
		chocolate: "d2691e",
		olive: "808000",
		saddlebrown: "8b4513",
		sienna: "a0522d",
		brown: "a52a2a",
		maroon: "800000",
		white: "ffffff",
		snow: "fffafa",
		honeydew: "f0fff0",
		mintcream: "f5fffa",
		azure: "f0ffff",
		aliceblue: "f0f8ff",
		ghostwhite: "f8f8ff",
		whitesmoke: "f5f5f5",
		seashell: "fff5ee",
		beige: "f5f5dc",
		oldlace: "fdf5e6",
		floralwhite: "fffaf0",
		ivory: "fffff0",
		antiquewhite: "faebd7",
		linen: "faf0e6",
		lavenderblush: "fff0f5",
		mistyrose: "ffe4e1",
		gainsboro: "dcdcdc",
		lightgray: "d3d3d3",
		silver: "c0c0c0",
		darkgray: "a9a9a9",
		dimgray: "696969",
		gray: "808080",
		lightslategray: "778899",
		slategray: "708090",
		darkslategray: "2f4f4f",
		black: "000000",
	},
};
//FIXME precisa disso?
__CSS.push(`/*-- Padrão --*/
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
* {box-sizing: border-box !important;}
`);