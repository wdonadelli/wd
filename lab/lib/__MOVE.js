/**
#3 Movimentação e Redimensionamento
O objeto '{__MOVE} atribui ao elemento a posibilidade de movimentação e dimensionamento.
**/
const __MOVE = {
	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- MOVE/RESIZE --*/
.css-wd-move {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 999;
	border: 2px dashed red;
	font-size: var(--var-js-wd-font-size);
	font-family: var(--var-js-wd-font-type);
}
.css-wd-move > * {
	position: absolute;
	border: 0;
	background: transparent;
	font-family: inherit;
	font-size: inherit;
}
/*-- resize vertical --*/
.css-wd-move-n, .css-wd-move-s {
	height: var(--var-js-wd-move-edge);
	left:   calc(var(--var-js-wd-move-edge) / 2);
	right:  calc(var(--var-js-wd-move-edge) / 2);
}
.css-wd-move-n {
	top:    calc(-1 * var(--var-js-wd-move-edge) / 2);
	cursor: n-resize;
}
.css-wd-move-s {
	bottom: calc(-1 * var(--var-js-wd-move-edge) / 2);
	cursor: s-resize;
}
/*-- resize horizontal --*/
.css-wd-move-w, .css-wd-move-e {
	width:  var(--var-js-wd-move-edge);
	top:    calc(var(--var-js-wd-move-edge) / 2);
	bottom: calc(var(--var-js-wd-move-edge) / 2);
}
.css-wd-move-w {
	left:   calc(-1 * var(--var-js-wd-move-edge) / 2);
	cursor: w-resize;
}
.css-wd-move-e {
	right:  calc(-1 * var(--var-js-wd-move-edge) / 2);
	cursor: e-resize;
}
/*-- resize bidimensional --*/
.css-wd-move-nw, .css-wd-move-ne, .css-wd-move-sw, .css-wd-move-se {
	width:  var(--var-js-wd-move-edge);
	height: var(--var-js-wd-move-edge);
	border: 2px solid red;
	background: white;
	/*border-radius: calc(var(--var-js-wd-move-edge) / 2);*/
}
.css-wd-move-nw {
	left:   calc(-1 * var(--var-js-wd-move-edge) / 2);
	top:    calc(-1 * var(--var-js-wd-move-edge) / 2);
	cursor: nw-resize;
}
.css-wd-move-ne {
	right:  calc(-1 * var(--var-js-wd-move-edge) / 2);
	top:    calc(-1 * var(--var-js-wd-move-edge) / 2);
	cursor: ne-resize;
}
.css-wd-move-sw {
	left:   calc(-1 * var(--var-js-wd-move-edge) / 2);
	bottom: calc(-1 * var(--var-js-wd-move-edge) / 2);
	cursor: sw-resize;
}
.css-wd-move-se {
	right:   calc(-1 * var(--var-js-wd-move-edge) / 2);
	bottom:  calc(-1 * var(--var-js-wd-move-edge) / 2);
	cursor: se-resize;
}
.css-wd-move-c {
	left:   calc(var(--var-js-wd-move-edge) / 2);
	top:    calc(var(--var-js-wd-move-edge) / 2);
	right:  calc(var(--var-js-wd-move-edge) / 2);
	bottom: calc(var(--var-js-wd-move-edge) / 2);
	cursor: move;
	color: black;
	background: rgba(255,255,255,0.7);
}`)-1,
	/**. '{number delta}: Espaço entre as movimentaçoes do teclado.**/
	delta: Math.min(window.screen.height, window.screen.width)/100,
	/**. '{array sides}: Identificação dos lados do manipulador com relação à posição relativa (ordem de focalização).**/
	sides: ["nw", "n", "ne", "w", "c", "e", "sw", "s", "se"],
	/**. '{object mouse}: Registra dados para manipulação do mouse.**/
	mouse: null,
	/**. '{array heap}: Registra os identificadores dos manipuladores abertos.**/
	heap: [],
	/**. '{void attach(node target)}: Anexa o manipulador ao alvo.**/
	attach: function(target) {
		this.detach(target);
		const view = __ID.value;
		const ctrl = __ID.id(target);
		const fire = {keydown: this, mousedown: this, focusin: this};
		const move = {tag: "div", attr: {className: "css-wd-move", addEventListener: fire, id: __ID.value}, child: []};
		/*-- posicionamento --*/
		__CSS.temp(target, {position: {static: "relative"}, display: {inline: "inline-block"}});
		/*-- manipuladores específicos --*/
		this.sides.forEach(function(v,i,a) {
			const attr = {className: `css-wd-move-${v}`, "aria-controls": ctrl, "aria-label": v.toUpperCase()};
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
	/**. '{object size(node node, object data)}: Define ou retorna os valores dimensionais do nó ('{height, width, left, right, top, bottom, fontSize}).**/
	size: function(node, data) {
		const read = !(data !== null && typeof data === "object");
		const info = read ? {height: 0, width: 0, left: 0, top: 0, right: 0, bottom: 0, fontSize: 0} : this.size(node);
		const css  = read ? window.getComputedStyle(node, null) : null;
		for (let i in info) {
			if (read)
				info[i] = Number(css[i].replace(/\D+$/, ""));
			else if (i in data)
				node.style[i] = `${data[i]}px`;
		}
		return read ? info : this.size(node);
	},
	/**. '{string move(node node, number dx, number dy)}: Desloca o nó e retorna a descrição da sua posição.**/
	move: function(node, dx, dy) {
		const size = this.size(node);
		size.left   += dx;
		size.right  -= dx;
		size.top    += dy;
		size.bottom -= dy;
		const data = this.size(node, size);
		return `(${Math.trunc(data.left)}, ${Math.trunc(data.top)})`;
	},
	/**. '{string resize(node node, number dx, number dy)}: Desloca o nó e retorna a descrição da sua dimensão.**/
	resize: function(node, dn, de, ds, dw) {
		const size = this.size(node);
		/*-- vertical superior --*/
		size.height -= dn;
		size.top    += dn;
		/*-- vertical inferior --*/
		size.height += ds;
		size.bottom -= ds;
		/*-- horizontal esquerda --*/
		size.width  -= dw;
		size.left   += dw;
		/*-- horizontal direita --*/
		size.width  += de;
		size.right  -= de;
		const data = this.size(node, size);
		return `${Math.trunc(data.width)} x ${Math.trunc(data.height)}`;
	},
	/**. '{void data(object ev)}: Retorna os dados envolvendo manipulador ou nulo.**/
	data: function(ev) {
		const list = Array.from(ev.currentTarget.children);
		const item = list.indexOf(ev.target);
		return {
			node: ev.currentTarget.parentElement,
			main: ev.currentTarget,
			side: ev.target,
			name: this.sides[item],
			text: list[this.sides.indexOf("c")],
			next: list[(item + 1)%list.length],
			prev: list[(list.length + item - 1)%list.length],
		};
	},
	/**. '{void tab(object ev, object data)}: Manipulador que gerencia a mudança de foco dos manipuladores.**/
	tab: function(ev, data) {
		(ev.shiftKey ? data.prev.focus() : data.next.focus());
		return;
	},
	/**. '{void focus(object ev, object data)}: Manipulador que gerencia o foco dos elementos.**/
	focus: function(ev, data) {
		data.text.textContent = this[data.name === "c" ? "move" : "resize"](data.node, 0, 0, 0, 0);;
		return;
	},
	/**. '{void moveKey(object ev, object data)}: Manipulador para mover o elemento com o teclado.**/
	moveKey: function(ev, data) {
		const di = this.delta * (ev.shiftKey ? 5 : 1);
		const dy = di * (ev.key === "ArrowUp"   ? -1 : (ev.key === "ArrowDown"  ? 1 : 0));
		const dx = di * (ev.key === "ArrowLeft" ? -1 : (ev.key === "ArrowRight" ? 1 : 0));
		data.text.textContent = this.move(data.node, dx, dy);
		return;
	},
	/**. '{void resizeKey(object ev, object data)}: Manipulador para altera as dimenssões do elemento com o teclado.**/
	resizeKey: function(ev, data) {
		const di   = this.delta * (ev.shiftKey ? 5 : 1);
		const line = {ArrowUp: "v", ArrowDown: "v", ArrowRight: "h", ArrowLeft: "h"};
		const side = {dn: 0, ds: 0, dw: 0, de: 0};
		if      (line[ev.key] === "v" && data.name.indexOf("n") >= 0)
			side.dn = di * (ev.key === "ArrowUp"    ? -1 : +1);
		else if (line[ev.key] === "v" && data.name.indexOf("s") >= 0)
			side.ds = di * (ev.key === "ArrowUp"    ? -1 : +1);
		else if (line[ev.key] === "h" && data.name.indexOf("e") >= 0)
			side.de = di * (ev.key === "ArrowRight" ? +1 : -1);
		else if (line[ev.key] === "h" && data.name.indexOf("w") >= 0)
			side.dw = di * (ev.key === "ArrowRight" ? +1 : -1);
		data.text.textContent = this.resize(data.node, side.dn, side.de, side.ds, side.dw);
		return;
	},
	/**. '{void mouseDown(object ev, object data)}: Manipulador que inicializa o movimento a partir do mouse.**/
	mouseDown: function(ev, data) {
		this.mouse   = data;
		this.mouse.x = ev.pageX;
		this.mouse.y = ev.pageY;
		window.addEventListener("mouseup", this);
		window.addEventListener("mousemove", this);
		return;
	},
	/**. '{void mouseUp(object ev, object data)}: Manipulador que encerra o movimento a partir do mouse.**/
	mouseUp: function(ev, data) {
		window.removeEventListener("mouseup", this);
		window.removeEventListener("mousemove", this);
		this.mouse.side.focus();
		this.mouse = null;
		return;
	},
	/**. '{void mouseMove(object ev, object data)}: Manipulador que define o movimento a partir do mouse.**/
	mouseMove: function(ev, data) {
		const attr = {
			id: this.mouse.name,
			dx: ev.pageX - this.mouse.x,
			dy: ev.pageY - this.mouse.y,
			get dn() {return this.id.indexOf("n") >= 0 ? this.dy : 0;},
			get ds() {return this.id.indexOf("s") >= 0 ? this.dy : 0;},
			get de() {return this.id.indexOf("e") >= 0 ? this.dx : 0;},
			get dw() {return this.id.indexOf("w") >= 0 ? this.dx : 0;},
		};
		/*-- redefinir referência --*/
		this.mouse.x += attr.dx;
		this.mouse.y += attr.dy;
		/*-- aplicar ajustes --*/
		if (this.mouse.name === "c")
			this.mouse.text.textContent = this.move(this.mouse.node, attr.dx, attr.dy);
		else
			this.mouse.text.textContent = this.resize(this.mouse.node, attr.dn, attr.de, attr.ds, attr.dw);
		return;
	},
	/**. '{void click(object ev, object data)}: Manipulador Define o movimento a partir do mouse.**/
	click: function(ev, data) {
		const heap = this.heap.slice();
		for (let i = 0; i < heap.length; i++) {
			let find = document.getElementById(heap[i]);
			let node = find !== null ? find.parentElement : null;
			if (node !== null && !node.contains(ev.target))
				this.detach(node);
		}
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador de manipulação chamado durante os eventos '{keydown}, '{click}, '{mousedown}, '{mouseup}, '{mousemove} e '{focusin}.**/
	handleEvent: function(ev) {
		if (ev.target === ev.currentTarget) return;
		ev.stopPropagation();
		const data = ev.currentTarget === window ? null : this.data(ev);
		const keys = /^(Escape|Tab|ArrowUp|ArrowRight|ArrowLeft|ArrowDown)$/;
		if (ev.type === "keydown" && keys.test(ev.key)) {
			ev.preventDefault();
			if (ev.key === "Escape")
				this.detach(data.node);
			else if (ev.key === "Tab")
				this.tab(ev, data);
			else if (data.name === "c")
				this.moveKey(ev, data);
			else
				this.resizeKey(ev, data);
		}
		else if (ev.type === "mousedown" && ev.button === 0)
			this.mouseDown(ev, data);
		else if (ev.type === "mousemove")
			this.mouseMove(ev, data);
		else if (ev.type === "mouseup")
			this.mouseUp(ev, data);
		else if (ev.type === "focusin")
			this.focus(ev, data);
		else if (ev.type === "click")
			this.click(ev, data)
		return;
	},
};