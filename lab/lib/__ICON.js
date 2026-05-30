/**
#3 Ícones
O objeto '{__ICON''} define plano de fundo estilizado por i{dingbats}/'{symbols} em unicode.
**/
const __ICON = {
	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- ICON --*/
.css-wd-icon-circle, .css-wd-icon-square {
		font-family: monospace;
		height:  1em;
		width:   1em;
		padding: 0;
		border:  none;
		margin:  auto;
	}
	.css-wd-icon-circle {border-radius: 0.5em;}`),
	/**. '{string image(object data)}: Retorna o valor para o atributo '{background-image}. Propriedade do argumento '{data}:
	|Nome|Tipo|Descrição|Padrão|
	|x|string|Posição horizontal do caractere|50%|
	|y|string|Posição vertical do caractere|50%|
	|code|string|Unicode do caractere|003F|
	|size|string|Tamanho da fonte do caractere|1em|
	|height|string|Altura da imagem|1em|
	|width|string|Comprimento da imagem|1em|
	|rotate|string|Rotação da imagem|0|
	|opacity|string|Opacidade da imagem|1|**/
	image: function(data) {
		data.x       = typeof data.x       === "string" ? data.x       : "50%";
		data.y       = typeof data.y       === "string" ? data.y       : "50%";
		data.height  = typeof data.height  === "string" ? data.height  : "1em";
		data.width   = typeof data.width   === "string" ? data.width   : "1em";
		data.rotate  = typeof data.rotate  === "string" ? data.rotate  : "0";
		data.opacity = typeof data.opacity === "string" ? data.opacity : "1";
		data.code    = typeof data.code    === "string" ? data.code    : "003F";
		data.size    = typeof data.size    === "string" ? data.size    : "1em";
		return `url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(${data.rotate})' opacity='${data.opacity}' height='${data.height}' width='${data.width}' style='background-color: inherit;'><text x='${data.x}' y='${data.y}' text-anchor='middle' dominant-baseline='middle' font-family='monospace' font-size='${data.size}'>\\${data.code}</text></svg>")`;
	},
	/**. '{void style(node, image, size, repeat, position, origin)}: Define o estilo do fundo do nó ('{node}):
	|Nome|Tipo|CSS|Padrão|
	|image|object|-|Ver método '{image}|
	|size|string|a{backgroundSize}@href{https://developer.mozilla.org/en-US/docs/Web/CSS/background-size}|1em|
	|repeat|string|a{backgroundRepeat}@href{https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat}|no-repeat|
	|position|string|a{backgroundPosition}@href{https://developer.mozilla.org/en-US/docs/Web/CSS/background-position}|50% 50%|
	|origin|string|a{backgroundOrigin}@href{https://developer.mozilla.org/en-US/docs/Web/CSS/background-origin}|content-box|**/
	style: function(node, image, size, repeat, position, origin) {
		node.style.backgroundImage    = this.image(image);
		node.style.backgroundSize     = typeof size     === "string" ? size     : "1em";
		node.style.backgroundRepeat   = typeof repeat   === "string" ? repeat   : "no-repeat";
		node.style.backgroundPosition = typeof position === "string" ? position : "50% 50%";
		node.style.backgroundOrigin   = typeof origin   === "string" ? origin   : "content-box";
		return;
	},
	/**. '{void icon(node node, string code, boolean circle)}: Atribui ao nó um ícone quadrado sem conteúdo. O argumento '{circle} estabelece bordas arredondadas se verdadeiro.**/
	icon: function(node, code, circle) {
		node.className = `css-wd-icon-${circle === true ? "circle" : "square"}`;
		this.style(node, {code: code, y: "56%"}, "contain", "no-repeat", "50% 50%");
		return;
	},
	/**. '{void button(node node, string code, string locale)}: Atribui ao nó um formato de botão. Argumento '{locale} define o posicionamento do ícone e do texto:
	|Valor|Ícone|Texto|
	|top|Superior|Inferior|
	|bottom|Inferior|Superior|
	|left|Esquerda|Direita|
	|right|Direita|Esquerda|
	|circle|Todo o nó com bordas arredondadas|Não visível|
	|default|Todo o nó|Não visível|**/
	button: function(node, code, locale) {
		const data = {top: "div", bottom: "div", left: "span", right: "span"};
		/*-- redefinir conteúdo textual do nó --*/
		const kill = node.querySelectorAll(".css-wd-icon");
		for (let i = 0; i < kill.length; i++) kill[i].remove();
		const text = node.textContent.trim();
		/*-- redefinindo características do nó --*/
		const info = window.getComputedStyle(node, null);
		__HTML(node, {
			innerHTML: "",
			"aria-label": null,
			style: {
				fontSize: null,
				textAlign: "center",
				position: info.position === "static" ? "relative" : info.position,
				className: "",
			},
		});
		/*-- definindo ícone --*/
		const tag  = locale === "top" || locale === "bottom" ? "div" : "span";
		const icon = __HTML(tag, {style: {
			display:  tag === "div" ? "block" : "inline-block",
			margin:   tag === "div" ? "auto"  : "0 0.25em",
			fontSize: tag === "div" ? "3em"   : "1em",
		}});
		/*-- aplicando regras --*/
		if (locale in data) {
			const init = locale === "top" || locale === "left";
			const span = {tag: tag, attr: {textContent: text}};
			__DOM({tag: node, child: init ? [{tag: icon}, span] : [span, {tag: icon}]});
			this.icon(icon, code, true);
		}
		else {
			const byid = __ID.value;
			const span = {tag: "span", attr: {textContent: text, id: byid, className: "css-wd-tooltip"}};
			__DOM({tag: node, child: [span], attr: {"aria-labelledby": byid, style: {fontSize: "3em"}}});
			this.icon(node, code, locale === "circle");
		}
		return;
	},
	/**. '{void background(node node, string code, string size, string data)}: Define um plano de fundo com o ícone. O argumento '{data} pode se referir à posição x,y, com a unidade de medida separada por espaço (sem repetição) ou o tipo de repetição.**/
	background: function(node, code, size, data) {
		data = String(data).replace(/\s+/g, " ").trim().toLowerCase()
		const mult = /^(space|round|repeat(\-[xy])?)$/;
		const site = /^(0|\d+(\.\d+)?(\%|[a-z]+))\ (0|\d+(\.\d+)?(\%|[a-z]+))$/;
		if (mult.test(data))
			return this.style(node, {code: code}, size, data);
		if (site.test(data))
			return this.style(node, {code: code}, size, "no-repeat", data);
		return this.style(node, {code: code}, size);
	}
};