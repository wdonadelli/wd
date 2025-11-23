/**
#3 Movimentação e Redimensionamento
O objeto '{__MOVE} atribui ao elemento a posibilidade de movimentação e dimensionamento.
**/
const __MOVE = {
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
		this.temp(target, {position: {static: "relative"}, display: {inline: "inline-block"}});
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
		const list = Array.prototype.slice.call(ev.currentTarget.children);
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