/**
#3 Janelas
O objeto '{__WINDOW} administra paredes e janelas. Conceitos
- frame: Parede de profundidade baixa e posição invariável e fixa à tela permitindo a adição de múltiplas janelas sem restrição.
- float: Parede de profundidade intermediária e posição variável e fixa à tela ou FIXME absoluta a um elemento permitindo a adição de uma única janela a cada interação. Pode ser fechada por meio da tecla kbd{Esc} ou por um clique externo. É incompatível com a parede "modal" ou com outra janela "float".
- modal: Parede de profundidade alta e posiçã__Pino fixa à tela, ocupando toda a área, permitindo a adição de múltiplas janelas organizadas por meio de uma fila, exibindo apenas uma janela a cada interação. Pode ser fechada por meio da tecla kbd{Esc}. Elementos fora da janela ficarão inertes.
A cada mudança na janela, o evento i{wdwindow} será disparado podendo ser vinculado à janela para acompanhar a mudança no '{status}.
**/
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
	/**. '{array heap}: Registra a fila das janelas modais.**/
	heap: [],
	/**. '{object wall}: Registra as paredes fixadoras de janelas.**/
	wall: Object.freeze({
		frame: __HTML("div", {"data-js-wd-window": "frame"}),
		modal: __HTML("div", {"data-js-wd-window": "modal"}),
		float: __HTML("div", {"data-js-wd-window": "float"})
	}),
	/**. '{object data}: Registra os identificadores das janelas fixadas à parede '{data -> ID = data}.**/
	data: {},
	/**. '{object find(any key)}: Retorna os dados da janela adicionada localizado pelo identificador ou pela janela.**/
	find: function(key) {
		for (let id in this.data)
			if (key === id || key === this.data[id].window)
				return this.data[id];
		return null;
	},
	/**. '{void fire(string status, object data)}: Dispara eventos de mutação da janela. A propriedade '{detail} contem a informados dos dados informados em '{attach} acrescido do identificador ('{id}) e do '{status}:
	|Status|Descrição|
	|avoid|A janela foi rejeitada.|
	|wait|A janela modal aguarda renderização (está no '{heap}).|
	|open|A janela foi renderizada.|
	|close|A janela foi fechada.|
	|escape|A janela foi descartada.|
	. Motivos para o status "escape":
	- Botão ESC pressionado com janelas modal ou float aberta;
	- Clique fora da janela float;
	- Abertura de uma nova janela float;
	- Abertura de uma janela modal concomitante a uma janela float aberta; e
	- Evento de mudança de tamanho da tela concomitante a uma janela float aberta.**/
	fire: function(status, data) {
		const detail = {wall: data.wall, pin: data.pin, id: data.id, status: status};
		const event  = new CustomEvent("wdwindow", {detail: detail});
		data.window.dispatchEvent(event);
		return;
	},
	/**. '{void hide(object data, boolean focus)}: Limpa e esconde a parede.**/
	hide: function(data, focus) {
		const kill = {"data-js-wd-window": data.wall, className: null, removeAttribute: ["id"], remove: [], innerHTML: "", style: null};
		__HTML(this.wall[data.wall], kill);
		if (focus === true) {
			try {data.pin.focus();}
			catch(e) {
				try {data.active.focus();}
				catch(f) {}
			}
		}
		return;
	},
	/**. '{void focus(node win)}: Define o foco da janela renderizada.**/
	focus: function(win) {
		const query = win.querySelector("[autofocus]");
		const first = win.childElementCount > 0 ? win.firstElementChild : win;
		(query !== null ? query.focus() : first.focus());
		return;
	},
	/**. '{boolean inert}: Define a inércia no documento.**/
	set inert(x) {
		x = x === true;
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
		x = x === true;
		__HTML(document.body, {className: x ? {add: "js-wd-freeze"} : {remove: "js-wd-freeze"}});
	},
	/**. '{string attach(node win, string wall, any pin)}: Fixa a janela '{win} à parede '{wall} e retorna o '{id} do processo ou nulo.
	|Argumento|Tipo|Descrição|
	|win|node|Janela a fixar, não pode estar contida em outro nó já adicionado.|
	|wall|string|Nome da parede a fixar a janela: "float", "modal" ou "frame" (padrão)|
	|pin|node|Nó de fixação da parede "float".|
	|pin|object|Posição (x, y) da parede "float".|**/
	attach: function(win, wall, pin) {
		const data = {window: win, wall: wall, pin: pin, id: __ID.value, active: document.activeElement};
		/*-- janela não é um nó: retornar nulo --*/
		if (typeof win !== "object" || win === null || !(win instanceof HTMLElement))
			return null;
		/*-- janela já adicionada: rejeitar --*/
		for (let i in this.wall) {
			if (this.wall[i].contains(win)) {
				data.id = null;
				this.fire("avoid", data);
				return null;
			}
		}
		/*-- analisar dados específicos --*/
		if (wall === "frame") return this.addFrame(data);
		if (wall === "modal") return this.addModal(data);
		if (wall === "float") return this.addFloat(data);
		return null;
	},
	/**. '{string detach(any key)}: Remove a janela atravês do identificador ou pelo nó.**/
	detach: function(key) {
		const data = this.find(key);
		if (data === null)         return null;
		if (data.wall === "frame") return this.delFrame(data);
		if (data.wall === "modal") return this.delModal(data);
		if (data.wall === "float") return this.delFloat(data);
		return null;
	},
	/**. '{string addModal(object data)}: Adiciona uma janela modal e retorna seu identificador ou nulo.**/
	addModal(data) {
		/*-- aguardar na fila se já houver um modal aberto --*/
		if (this.wall.modal.childElementCount > 0) {
			data.id = null;
			this.heap.push(data)
			this.fire("wait", data);
			return null;
		}
		/*-- incompatível com float --*/
		if (this.wall.float.childElementCount > 0) {
			const find = this.find(this.wall.float.firstElementChild);
			if (find === null)
				this.hide({wall: "float"});
			else
				this.delFloat(find, true);
		}
		window.addEventListener("keydown", this);
		this.wall.modal.appendChild(data.window);
		document.body.appendChild(this.wall.modal);
		this.inert = true;
		this.focus(data.window);
		this.data[data.id] = data;
		this.fire("open", data);
		return data.id;
	},
	/**. '{string delModal(object data, boolean esc)}: Remove uma janela modal e retorna seu identificador ou nulo.**/
	delModal(data, esc) {
		window.removeEventListener("keydown", this);
		delete this.data[data.id];
		this.inert = false;
		this.hide(data, true);
		this.fire(esc === true ? "escape" : "close", data);
		if (this.heap.length > 0) {
			const item = this.heap[0];
			this.attach(item.window, item.wall, item.pin);
			this.heap.shift();
		}
		return data.id;
	},
	/**. '{string addFloat(object data)}: Adiciona uma janela flutuante e retorna seu identificador ou nulo.**/
	addFloat(data) {
		/*-- incompatível com modal --*/
		if (this.wall.modal.childElementCount > 0) {
			data.id = null;
			this.fire("avoid", data);
			return null;
		}
		/*-- incompatível com outro float --*/
		if (this.wall.float.childElementCount > 0) {
			const find = this.find(this.wall.float.firstElementChild);
			if (find === null)
				this.hide({wall: "float"});
			else
				this.delFloat(find, true);
		}
		window.addEventListener("click", this);
		window.addEventListener("keydown", this);
		window.addEventListener("resize", this);
		this.wall.float.appendChild(data.window);
		document.body.appendChild(this.wall.float);
		this.freeze = true;
		const pin   = new __Pin(this.wall.float, data.pin);
		pin.fix();
		this.focus(data.window);
		this.data[data.id] = data;
		this.fire("open", data);
		return data.id;
	},
	/**. '{string delFloat(object data, boolean esc)}: Remove uma janela flutuante e retorna seu identificador ou nulo.**/
	delFloat(data, esc) {
		window.removeEventListener("click", this);
		window.removeEventListener("keydown", this);
		window.removeEventListener("resize", this);
		delete this.data[data.id];
		this.freeze = false;
		this.hide(data, true);
		this.fire(esc === true ? "escape" : "close", data);
		return data.id;
	},
	/**. '{string addFrame(object data)}: Adiciona uma janela ao frame e retorna se identificador ou nulo.**/
	addFrame(data) {
		this.wall.frame.appendChild(data.window);
		document.body.appendChild(this.wall.frame);
		this.data[data.id] = data;
		this.fire("open", data);
		return data.id;
	},
	/**. '{string delFrame(object data)}: Remove uma janela do frame e retorna se identificador ou nulo.**/
	delFrame(data) {
		data.window.remove();
		delete this.data[data.id];
		this.fire("close", data);
		if (this.wall.frame.childElementCount === 0)
			this.hide(data, false);
		return data.id;
	},
	/**. '{void handleEvent(object ev)}: Disparador do objeto chamado durante os eventos '{resize, click e keydown}.**/
	handleEvent: function(ev) {
		const float = this.wall.float.firstElementChild;
		const modal = this.wall.modal.firstElementChild;
		if (ev.type === "click" && float !== null && !float.contains(ev.target)) {
			const find = this.find(float);
			if (find === null)
				this.hide({wall: "float"});
			else
				this.delFloat(find, true);
		}
		else if (ev.type === "resize" && float !== null) {
			const find = this.find(float);
			if (find === null)
				this.hide({wall: "float"});
			else
				this.delFloat(find, true);
		}
		else if (ev.type === "keydown" && ev.key === "Escape") {
			if (float !== null) {
				const find = this.find(float);
				if (find === null)
					this.hide({wall: "float"});
				else
					this.delFloat(find, true);
			}
			if (modal !== null) {
				const find = this.find(modal);
				if (find === null)
					this.hide({wall: "modal"});
				else
					this.delModal(find, true);
			}
		}
		return;
	},
};