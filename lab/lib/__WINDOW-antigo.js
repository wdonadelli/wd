/**
#3 Janelas
O objeto '{__WINDOW} administra paredes e janelas. Conceitos
- frame: Parede de profundidade baixa e posição invariável e fixa à tela permitindo a adição de múltiplas janelas sem restrição.
- float: Parede de profundidade intermediária e posição variável e fixa à tela ou absoluta a um elemento permitindo a adição de uma única janela a cada interação. Pode ser fechada por meio da tecla kbd{Esc} ou por um clique externo. É incompatível com a parede "modal" ou com outra janela "float".
- modal: Parede de profundidade alta e posiçã__Pino fixa à tela, ocupando toda a área, permitindo a adição de múltiplas janelas organizadas por meio de uma fila, exibindo apenas uma janela a cada interação. Pode ser fechada por meio da tecla kbd{Esc}. Elementos fora da janela ficarão inertes.
A cada mudança de '{status}, o evento i{wdwindow} será disparado. A propriedade '{detail} do evento contera os dados do identificador '{id} e do '{status} (string):
|Status|Descrição|
|open|Indica que a janela foi fixada à parede e está sendo exibida na tela|
|closed|Indica que a janela renderizada foi removida da parede|
|canceled|Indica que a janela foi removida da fila|**/
const __WINDOW = {
	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- WINDOW/FRAME --*/
[data-js-wd-window="frame"] {
	position: fixed !important;
	bottom: 0 !important;
	left:   0 !important;
	right:  0 !important;
	display: flex !important;
	flex-direction: column !important;
	margin:  0.5em !important;
	padding: 0 !important;
	max-height: calc(100vh - 1em) !important;
	overflow-y: auto !important;
	z-index: var(--var-js-wd-z-index-3) !important;
	background: tranparent !important;
}
@media screen and (min-width: 768px) {
	[data-js-wd-window="frame"] {
		right: initial !important;
		width: 25vw !important;
	}
}
[data-js-wd-window="frame"] > * ~ * {
	margin-top: 0.5em !important;
}
/*-- WINDOW/FLOAT --*/
[data-js-wd-window="float"] {
	position: fixed !important;
	display: block !important;
	margin:  0 !important;
	padding: 0 !important;
	overflow-y: auto !important;
	z-index:  var(--var-js-wd-z-index-2) !important;
	background: transparent !important;
}
/*-- WINDOW/MODAL --*/
[data-js-wd-window="modal"] {
	position: fixed !important;
	top:     0 !important;
	left:    0 !important;
	right:   0 !important;
	bottom:  0 !important;
	margin:  0 !important;
	padding: 0.5em !important;
	overflow-y: auto !important;
	z-index: var(--var-js-wd-z-index-1);
	background: rgb(50,50,50) !important;
	background: rgba(50,50,50,0.5) !important;
	display:         flex !important;
	flex-direction:  row !important;
	justify-content: center !important;
	align-items:     center !important;
}`),
	/**. '{array heap}: Guarda os registros vigentes.**/
	heap: [],
	/**. '{object wall}: Registra as paredes fixadoras de janelas.**/
	wall: Object.freeze({
		frame: __HTML("div", {"data-js-wd-window": "frame"}),
		modal: __HTML("div", {"data-js-wd-window": "modal"}),
		float: __HTML("div", {"data-js-wd-window": "float"})
	}),
	/**. '{void clear(string wall)}: Remove e limpa atributos da parede especificada em '{wall}.**/
	clear: function(wall) {
		const attr = {"data-js-wd-window": wall, style: null, className: null, removeAttribute: ["id"]};
		if (wall in this.wall) {
			this.wall[wall].remove();
			__HTML(this.wall[wall], attr);
		}
		return;
	},
	/**. '{object find(any key)}: Retorna o primeiro identificador encontrado na pilha ou nulo conforme argumento '{key}. Se o argumento for um nó HTML, buscará pela janela, se for uma string, fará a busca pelo nome da janela ou pelo identificador.**/
	find: function(key) {
		const node = typeof key === "object" && key instanceof HTMLElement;
		const text = typeof key === "string";
		const wall = text && (/^(float|modal|frame)$/i).test(key.toLowerCase());
		const len  = node || wall || text ? this.heap.length : 0;
		for (let i = 0; i < len; i++) {
			if (node && this.heap[i].window.contains(key))
				return this.heap[i];
			if (wall && this.heap[i].wall === key.toLowerCase())
				return this.heap[i];
			if (text && this.heap[i].id === key)
				return this.heap[i];
		}
		return null;
	},
	/**. '{object list}: Retorna as informações da pilha em forma de '{array} separados por paredes.**/
	get list() {
		const wall = {float: [], modal: [], frame: []};
		for (let i = 0; i < this.heap.length; i++)
			wall[this.heap[i].wall].push(this.heap[i]);
		return wall;
	},
	/**. '{object fire(object heap)}: Dispara eventos de mutação da janela.**/
	fire: function(heap) {
		const detail = {id: heap.id, status: heap.status};
		const event  = new CustomEvent("wdwindow", {detail: detail});
		heap.window.dispatchEvent(event);
		return;
	},
	/**. '{boolean inert}: Define a inércia no documento.**/
	set inert(x) {
		const query = x ? document.body.children : document.querySelectorAll("body > *[inert]");
		for (let i = 0; i < query.length; i++) {
			if (query[i] !== this.wall.modal) {
				if (x) query[i].setAttribute("inert", "true");
				else   query[i].removeAttribute("inert");
			}
		}
	},
	/**. '{boolean freeze}: Define o congelamento do documento.**/
	set freeze(x) {
		const data = x ? {add: "js-wd-freeze"} : {remove: "js-wd-freeze"};
		__HTML(document.body, {className: data});
	},
	/**. '{void pin(object heap)}: Define a forma de fixação das janelas '{float/modal} à tela.**/
	pin: function(heap) {
		/*-- fixar posição --*/
		if (heap.wall === "float") {
			const pin = new __Pin(this.wall.float, heap.pin);
			pin.fix();
		}
		//FIXME checar o foco nesse negócio: focar em onfocus/janela ou do jeito que está?


		/*-- definir focus --*/
		if (heap.wall === "float" || heap.wall === "modal")
			__FOCUS.setFocus(heap.window);
		/*-- cor --*/
		const bg = window.getComputedStyle(heap.window).background;
		if (bg === "none") {
			heap.window.style.color = "black";
			heap.window.style.background = "white";
		}
		return;
	},
	/**. '{void update()}: Atualiza fixação das janelas.**/
	update: function() {
		/*-- removendo eventos --*/
		const event = {float: ["keydown", "resize", "click"], modal: ["keydown"]};
		for (let i = 0; i < event.float.length; i++)
			window.removeEventListener(event.float[i], this);
		/*-- atualizando lista --*/
		const list = this.list;
		for (let wall in list) {
			list[wall].forEach(function(heap,i,a) {
				/*-- parede modal: só analisar a primeira janela --*/
				if (heap.wall === "modal" && i > 0) return;
				/*-- Adicionando janelas e fixando paredes --*/
				if (heap.window.parentElement !== this.wall[heap.wall]) {
					/*-- adicionar janela à parede --*/
					this.wall[heap.wall].appendChild(heap.window);
					/*-- adicionar parede ao documento (não necessariamente a body) --*/
					if (this.wall[heap.wall].parentElement === null)
						document.body.appendChild(this.wall[heap.wall]);
					/*-- definindo posicionamento e foco --*/
					this.pin(heap);
					/*-- disparar evento --*/
					heap.status = "open";
					this.fire(heap);
				}
			}, this);
			/*-- limpar dados da parede --*/
			if (list[wall].length < 1) this.clear(wall);
		}
		/*-- adicionando eventos à window --*/
		const ev = list.modal.length > 0 ? "modal" : (list.float.length > 0 ? "float" : null);
		if (ev in event)
			for (let i = 0; i < event[ev].length; i++)
				window.addEventListener(event[ev][i], this);
		/*-- inert e freeze --*/
		this.inert  = list.modal.length > 0;
		this.freeze = list.float.length > 0;
		return;
	},
	/**. '{integer remove(any key)}: Remove a janela da pilha (ver método '{find} quanto ao argumento '{key}).**/
	remove: function(key) {
		const heap = this.find(key);
		const wall = heap === null ? null : heap.wall;
		const show = heap === null ? null : this.wall[heap.wall].contains(heap.window);
		if (heap !== null) {
			heap.window.remove();
			heap.status = show ? "closed" : "canceled";
			this.heap = this.heap.filter(function(v,i,a) {return v.id !== heap.id;});
			this.fire(heap);
			this.update();
			/*-- voltar o foco ao elemento --*/
			if (heap.wall === "float" || heap.wall === "modal") {
				const list = this.list;
				if (list.float.length + list.modal.length === 0) {
					try {heap.pin.focus();} catch(e) {
						try {heap.focus.focus();} catch(f) {}
					}
				}
			}
		}
		return heap === null ? null : heap.id;
	},
	/**. '{boolean checkWindow(node win, string wall)}: Checa se a janela atende os critérios para inclusão na pilha.**/
	checkWindow: function(win, wall) {
		wall = wall in this.wall ? wall : "frame";
		const list = this.list;
		/*-- 1) a janela precisa ser um nó --*/
		if (typeof win !== "object" || !(win instanceof HTMLElement))
			return false;
		/*-- 2) a janela não pode estar contida na pilha --*/
		if (this.find(win) !== null)
			return false;
		/*-- 3) a janela não pode estar contida nas paredes --*/
		for (let i in this.wall)
			if (win.contains(this.wall[i])) return false;
		/*-- 4) janela float aberta é fechada, exceto em caso de nova janela frame --*/
		if (list.float.length > 0 && wall !== "frame")
			list.float.forEach(function(v,i,a) {this.remove(v.window);}, this);
		/*-- 5) janela float é incompatível com uma janela modal aberta --*/
		if (wall === "float" && list.modal.length > 0)
			return false;
		return true;
	},
	/**. '{string add(node win, string wall, any pin)}: Adiciona a janela e retorna seu '{id} ou nulo em caso de insucesso:
	|Argumento|Tipo|Descrição|
	|win|node|Janela a ser adicionada, não pode ser parte de outra janela já adicionada (ver método '{checkWindow}).|
	|wall|string|Tipo de parede: "float", "modal" ou "frame"|
	|pin|string|Localização da janela na parede modal:  "top", "bottom", "left", "right", "full" e "center".|
	|pin|node|Nó de fixação da parede float.|
	|pin|object|Posição (x, y) da parede float.|**/
	add: function(win, wall, pin) {
		wall = wall in this.wall ? wall : "frame";
		if (!this.checkWindow(win, wall)) return null;
		const id = __ID.value;
		this.heap.push({
			id:     id,
			status: null,
			window: win,
			wall:   wall,
			pin:    pin,
			focus:  document.activeElement
		});
		this.update();
		return id;
	},
	/**. '{void handleEvent(object ev)}: Disparador do objeto chamado durante os eventos '{resize, click e keydown}.**/
	handleEvent: function(ev) {
		let   kill = false;
		const list = this.list;
		/*-- FLOAT --*/
		if (list.float.length > 0) {
			if (ev.type === "click")
				kill = !this.wall.float.contains(ev.target)
			else if (ev.type === "keydown")
				kill = ev.key === "Escape";
			else if (ev.type === "resize")
				kill = true;
			if (kill)
				this.remove(list.float[0].id);
		}
		/*-- MODAL --*/
		if (list.modal.length > 0) {
			if (ev.type === "keydown")
				kill = ev.key === "Escape";
			if (kill)
				this.remove(list.modal[0].id);
		}
		return;
	},
};