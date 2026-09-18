/**
#3 Movimentação e Redimensionamento
O objeto '{__MOVE} atribui ao elemento a posibilidade de movimentação e dimensionamento.
**/
const __MOVE = {
	/**. '{object mouse}: Registra dados para manipulação do mouse.**/
	mouse: null,
	/**. '{void setRect(node main, node move)}: Define as dimensões do movimentador (`{move}) conforme o elemento alvo ('{main}).**/
	setRect: function(main, move) {
		const rect = main.getBoundingClientRect();
		const attr = ["top", "bottom", "left", "right", "width", "height"];
		attr.forEach(function(v,i,a) {move.style[v] = `${rect[v]}px`;});
		return;
	},
	/**. '{void mover(node main)}: Cria e estabele a caixa de movimento e redimensionamento ao elemento.**/
	mover: function(main) {
		const id   = __ID.id(main);
		const wgcs = window.getComputedStyle(main);
		const size = {
			nw: "Top-left corner",  sw: "Bottom-left corner",  w: "Left side",  s: "Underside",
			ne: "Top right corner", se: "Bottom right corner", e: "Right side", n: "Top side",
		};
		const move = __DOM({
			tag: "div",
			attr: {
				addEventListener: {click: this, mouseup: this, mousemove: this},
				class: "css-js-wd-move-box",
				role: "presentation",
			},
			child: [{
				tag: "div",
				attr: {
					role: "button",
					"aria-controls": id,
					"aria-label": "Move",
					tabindex: "0",
					class: "css-js-wd-move-c",
					addEventListener: {keydown: this, mousedown: this},
				},
				child: ["nw", "n", "ne", "e", "se", "s", "sw", "w"].map(function(v,i,a) {
					return {
						tag: "div",
						attr: {
							role: "separator",
							"aria-controls": id,
							tabindex: 0,
							class: `css-js-wd-move-${v}`,
							"aria-label": size[v],
							addEventListener: {keydown: this, mousedown: this},
						}
					};
				}, this),
			}]
		}).tag;
		/*-- acertando posicionamento do alvo e do movedor --*/
		if (wgcs.position === "static") main.style.position = "relative";
		if (wgcs.display  === "inline") main.style.display  = "inline-block";
		document.body.appendChild(move);
		this.setRect(main, move.firstElementChild);
		move.focus();
		return move;
	},


	/**. '{void attach(node target)}: Anexa o manipulador ao alvo.**/
	attach: function(target) {
		if (!(drag instanceof HTMLElement) || !__Type(drop).object) return;
		const data = {
			attr:  __HEAP.getAttr(target, "class", "style", "tabindex"),
			move: target,
		};
		__HEAP.attach(target, data, this);
		/*-- definindo propriedades do alvo --*/
		__HTML(target, {
			tabindex: "0",
			addEventListener: {keydown: this},

		});






		this.detach(target);
		const view = __ID.value;
		const ctrl = __ID.id(target);
		const fire = {keydown: this, mousedown: this, focusin: this};
		const move = {tag: "div", attr: {className: "css-js-wd-move", addEventListener: fire, id: __ID.value}, child: []};
		/*-- posicionamento --*/
		__CSS.temp(target, {position: {static: "relative"}, display: {inline: "inline-block"}});
		/*-- manipuladores específicos --*/
		this.sides.forEach(function(v,i,a) {
			const attr = {className: `css-js-wd-move-${v}`, "aria-controls": ctrl, "aria-label": v.toUpperCase()};
			attr[v === "c" ? "id" : "aria-describedby"] = view;
			move.child.push({tag: "button", attr: attr, child: []});
		}, this);
		/*-- anexando manipulador e focalizando --*/
		__DOM(move, target).tag.children[this.sides.indexOf("c")].focus();
		if (this.heap.length === 0)
			window.addEventListener("click", this);
		this.heap.push(move.attr.id);
		return;
	},
	/**. '{void detach(node target)}: Desanexa o manipulador do alvo.**/
	detach: function(target) {
		this.heap = this.heap.filter(function(v,i,a) {
			const find = document.getElementById(v);
			if (find !== null && find.parentElement === target) {
				find.remove();
				target.focus();
				return false;
			}
			return true;
		});
		if (this.heap.length === 0)
			window.removeEventListener("click", this);
		return;
	},


	/**. '{string anchor(node elem)}: Retorna o tipo de âncora do elemento.**/
	anchor: function(elem) {
		const re  = /^css-js-wd-move-(nw|n|ne|e|se|s|sw|w|c|box)$/;
		const css = elem.getAttribute("class");
		return re.test(css) ? css.match(re)[1] : null;
	},
	/**. '{void click(object ev)}: Manipulador para fechar o movimentador.**/
	click: function(ev) {
		const type = this.anchor(ev.currentTarget);
		if (ev.currentTarget === ev.target && type === "box") {
			ev.stopPropagation();
			ev.currentTarget.remove();
		}
		return;
	},
	/**. '{void keydown(object ev)}: Manipulador para mover e redimencionar com o i{mouse}.**/
	keydown: function(ev) {
		const type = this.anchor(ev.target);
		const move = type === "c" ? ev.target : ev.target.parentElement
		const main = document.getElementById(ev.target.getAttribute("aria-controls"));
		const attr = ["height", "width", "top", "bottom", "left", "right"];
		const wgcs = window.getComputedStyle(main);
		const rect = {};
		const gap  = (ev.shiftKey ? 5 : 1) * Math.min(window.screen.height, window.screen.width)/100;
		attr.forEach(function (v,i,a) {rect[v] = Number(wgcs[v].replace(/\D+$/, ""));});
		/*-- foco --*/
		if (ev.key === "Tab") {
			if ((type === "w" && !ev.shiftKey) || (type === "c" && ev.shiftKey)) {
				ev.preventDefault();
				(type === "w" ? move : move.lastElementChild).focus();
			}
			return;
		}
		/*-- sair --*/
		if (ev.key === "Escape") {
			return move.parentElement.remove();
		}
		/*-- horizontal superior --*/
		else if ((ev.key === "ArrowUp" || ev.key === "ArrowDown") && (type === "nw" || type === "n" || type === "ne")) {
				rect.top    += ev.key === "ArrowUp" ? -gap : +gap;
				rect.height += ev.key === "ArrowUp" ? +gap : -gap;
		}
		/*-- horizontal inferior --*/
		else if ((ev.key === "ArrowUp" || ev.key === "ArrowDown") && (type === "sw" || type === "s" || type === "se")) {
				rect.bottom += ev.key === "ArrowUp" ? +gap : -gap;
				rect.height += ev.key === "ArrowUp" ? -gap : +gap;
		}
		/*-- vertical esquerda --*/
		else if ((ev.key === "ArrowLeft" || ev.key === "ArrowRight") && (type === "nw" || type === "w" || type === "sw")) {
				rect.left  += ev.key === "ArrowLeft" ? -gap : +gap;
				rect.width += ev.key === "ArrowLeft" ? +gap : -gap;
		}
		/*-- vertical direita --*/
		else if ((ev.key === "ArrowLeft" || ev.key === "ArrowRight") && (type === "ne" || type === "e" || type === "se")) {
				rect.right += ev.key === "ArrowLeft" ? +gap : -gap;
				rect.width += ev.key === "ArrowLeft" ? -gap : +gap;
		}
		/*-- movimento vertical --*/
		else if ((ev.key === "ArrowUp" || ev.key === "ArrowDown") && type === "c") {
				rect.top    += ev.key === "ArrowUp" ? -gap : +gap;
				rect.bottom += ev.key === "ArrowUp" ? +gap : -gap;
		}
		/*-- movimento horizontal --*/
		else if ((ev.key === "ArrowLeft" || ev.key === "ArrowRight") && type === "c") {
				rect.left  += ev.key === "ArrowLeft" ? -gap : +gap;
				rect.right += ev.key === "ArrowLeft" ? +gap : -gap;
		}
		else {
			return;
		}
		/*-- definindo posicionamento do alvo e do movimentador --*/
		for (let i in rect) main.style[i] = `${rect[i]}px`;
		this.setRect(main, move);
		return;
	},
	/**. '{void mousedown(object ev)}: Manipulador para iniciar o movimento com o i{mouse}.**/
	mousedown: function(ev) {
		const type = this.anchor(ev.target);
		const move = type === "c" ? ev.target : ev.target.parentElement
		const main = document.getElementById(ev.target.getAttribute("aria-controls"));
		if (ev.button === 0)
			this.mouse = {main: main, type: type, move: move, x: ev.clientX, y: ev.clientY};
		return;
	},
	/**. '{void mouseup(object ev)}: Manipulador para encerrar o movimento com o i{mouse}.**/
	mouseup: function(ev) {
		this.mouse = null;
		return;
	},
	/**. '{void mousemove(object ev)}: Manipulador para mover ou redimencionar com o i{mouse}.**/
	mousemove: function(ev) {
		if (this.mouse === null) return;
		const type = this.mouse.type;
		const attr = ["height", "width", "top", "bottom", "left", "right"];
		const vect = {x: ev.clientX, y: ev.clientY};
		const gbcr = this.mouse.main.getBoundingClientRect();
		const wgcs = window.getComputedStyle(this.mouse.main);
		const rect = {};
		attr.forEach(function (v,i,a) {rect[v] = Number(wgcs[v].replace(/\D+$/, ""));});
		/*-- horizontal superior --*/
		if (type === "nw" || type === "n" || type === "ne") {
			rect.height += +gbcr.top - vect.y;
			rect.top    += -gbcr.top + vect.y;
		}
		/*-- horizontal inferior --*/
		if (type === "sw" || type === "s" || type === "se") {
			rect.height += -gbcr.bottom + vect.y;
			rect.bottom += +gbcr.bottom - vect.y;
		}
		/*-- horizontal esquerda --*/
		if (type === "nw" || type === "w" || type === "sw") {
			rect.width += +gbcr.left - vect.x;
			rect.left  += -gbcr.left + vect.x;
		}
		/*-- horizontal direita --*/
		if (type === "ne" || type === "e" || type === "se") {
			rect.width += -gbcr.right + vect.x;
			rect.right += +gbcr.right - vect.x;
		}
		/*-- movimento --*/
		if (type === "c") {
			rect.left   += +ev.clientX - this.mouse.x;
			rect.right  += -ev.clientX + this.mouse.x;
			rect.top    += +ev.clientY - this.mouse.y;
			rect.bottom += -ev.clientY + this.mouse.y;
			this.mouse.x = ev.clientX;
			this.mouse.y = ev.clientY;
		}
		/*-- definindo posicionamento do alvo e do movimentador --*/
		for (let i in rect) this.mouse.main.style[i] = `${rect[i]}px`;
		this.setRect(this.mouse.main, this.mouse.move);
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador de manipulação chamado durante os eventos '{keydown}, '{click}, '{mousedown}, '{mouseup}, '{mousemove} e '{focusin}.**/
	handleEvent: function(ev) {
		ev.stopPropagation();
		return ev.type in this ? this[ev.type](ev) : undefined;
	},
};
__CSS.push(`/*-- MOVE/RESIZE --*/
/*-- move --*/
.css-js-wd-move-box {
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	font-size: 16px;
}
.css-js-wd-move-c {
	position: fixed;
	z-index: 999;
	cursor: move;
	border: 0.125em dashed red;
}
.css-js-wd-move-c * {
	position: absolute;
	border: 0;
}
/*-- resize vertical --*/
.css-js-wd-move-n, .css-js-wd-move-s {
	height: 0.50em;
	left:   0.25em;
	right:  0.25em;
}
.css-js-wd-move-n {
	top:    -0.25em;
	cursor: n-resize;
}
.css-js-wd-move-s {
	bottom: -0.25em;
	cursor: s-resize;
}
/*-- resize horizontal --*/
.css-js-wd-move-w, .css-js-wd-move-e {
	width:  0.50em;
	top:    0.25em;
	bottom: 0.25em;
}
.css-js-wd-move-w {
	left:   -0.25em;
	cursor: w-resize;
}
.css-js-wd-move-e {
	right:  -0.25em;
	cursor: e-resize;
}
/*-- resize bidimensional --*/
.css-js-wd-move-nw, .css-js-wd-move-ne, .css-js-wd-move-sw, .css-js-wd-move-se {
	width:  0.50em;
	height: 0.50em;
	background: red;
}
.css-js-wd-move-nw {
	left:   -0.25em;
	top:    -0.25em;
	cursor: nw-resize;
}
.css-js-wd-move-ne {
	right:  -0.25em;
	top:    -0.25em;
	cursor: ne-resize;
}
.css-js-wd-move-sw {
	left:   -0.25em;
	bottom: -0.25em;
	cursor: sw-resize;
}
.css-js-wd-move-se {
	right:   -0.25em;
	bottom:  -0.25em;
	cursor: se-resize;
}
`);