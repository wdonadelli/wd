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
	/**. '{node frame}: Registra a parede para janelas em quadro.**/
	frame: __HTML("div", {"data-js-wd-window": "frame"}),
	/**. '{node modal}: Registra a parede para janelas modais.**/
	modal: __HTML("div", {"data-js-wd-window": "modal"}),
	/**. '{node float}: Registra a parede para janelas flutuantes.**/
	float: __HTML("div", {"data-js-wd-window": "float"}),
	/**. '{array heap}: Registra o histórico de janelas anexadas, cada item é um objeto com as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|window|node|Janela a fixar|
	|wall|string|Tipo de parede|
	|pin|node ou object|Nó HTML ou posição da tela a anexar o elemento|
	|status|string|Estado da janela|
	|focus|node|Valor de '{pin} ou do nó com foco ativo no momento da fixação|**/
	heap: [],

	trash: [],
	/**. '{boolean check(object data, object item)}: Checa se os dados de '{data} conferem com os dados de '{heap}.**/
	check: function(data, heap) {
		let test = false;
		for (let i in heap) {
			if (i in data) {
				if (data[i] !== heap[i]) return false;
				test = true;
			}
		}
		return test;
	},
	/**. '{array match(object data)}: Retorna a lista de itens de '{data} que casam com os dados de '{heap}.**/
	match: function(data) {
		return this.heap.filter(function(v,i,a) {
			return this.check(data, v);
		}, this);
	},
	/**. '{integer index(object data)}: Retorna o índice do primeiro item que de '{data} que casa com os dados de '{heap}.**/
	index: function(data) {
		for (let i = 0; i < this.heap.length; i++) {
			if (this.check(data, this.heap[i])) return i;
		}
		return -1;
	},
	/**. '{boolean inert}: Define a inércia no documento, exceto para a parede "modal".**/
	set inert(x) {
		x = x === true;
		const query = x ? document.body.children : document.querySelectorAll("body > *[inert]");
		for (let i = 0; i < query.length; i++) {
			if (query[i] !== this.modal) {
				if (x) query[i].setAttribute("inert", "true");
				else   query[i].removeAttribute("inert");
			}
		}
		return;
	},
	/**. '{boolean freeze}: Define o congelamento do documento.**/
	set freeze(x) {
		x = x === true;
		__HTML(document.body, {className: x ? {add: "js-wd-freeze"} : {remove: "js-wd-freeze"}});
		return;
	},
	/**. '{void update()}: Define os eventos do documento, o congelamento do documento e a renderização das janelas.**/
	update: function() {
		/*-- remover eventos da janela do documento e desligar congelamentos --*/
		window.removeEventListener("click",   this);
		window.removeEventListener("keydown", this);
		window.removeEventListener("resize",  this);
		/*-- limpar invasores --*/
		const wall = {frame: this.frame.children, float: this.float.children, modal: this.modal.children};
		for (let w in wall) {
			let child = wall[w];
			for (let i = 0; i < child.length; i++) {
				if (this.index({window: child[i], wall: w, status: "open"}) < 0)
					child[i].remove();
			}
		}
		/*-- adicionar janelas --*/
		this.match({status: "open"}).forEach(function(v,i,a) {
			if (v.window.parentElement !== this[v.wall])
				this[v.wall].appendChild(v.window);
		}, this);
		/*-- redefinir eventos de janela do documento --*/
		const float = this.index({wall: "float", status: "open"}) >= 0;
		const modal = this.index({wall: "modal", status: "open"}) >= 0;
		const frame = this.index({wall: "frame", status: "open"}) >= 0;
		if (float) {
			window.addEventListener("click", this);
			window.addEventListener("keydown", this);
			window.addEventListener("resize", this);
			this.freeze = true;
			document.body.appendChild(this.float);
		} else {
			this.freeze = false;
			this.float.remove();
		}
		if (modal) {
			this.inert = true;
			document.body.appendChild(this.modal);
			if (!float) window.addEventListener("keydown", this);
		} else {
			this.inert = false;
			this.modal.remove();
		}
		if (frame) {
			document.body.appendChild(this.frame);
		} else {
			this.frame.remove()
		}
		return;
	},
	/**. '{void fire(string status, object data)}: Dispara os eventos de mutação da janela ('{wdwindow}) cuja propriedade '{detail} do evento contem os dados informados durante sua anexação acrescido da propriedade '{status}:
	|Status|Descrição|
	|avoid|A janela foi rejeitada.|
	|wait|A janela modal aguarda renderização (está no '{heap}).|
	|open|A janela foi renderizada.|
	|close|A janela foi fechada.|
	|escape|A janela foi descartada.|
	. Motivos para o status "avoid":
	- Tentativa de anexação de janela já renderizada;
	- Anexação de janela "float" ou "frame" com modal aberto;
	. Motivos para o status "escape":
	- Botão ESC pressionado com janelas "modal" ou "float" aberta;
	- Clique fora da janela "float";
	- Abertura de uma nova janela "float";
	- Abertura de uma janela "modal" existindo uma janela "float" aberta; e
	- Evento de mudança de tamanho da tela existindo uma janela "float" aberta.**/
	fire: function(status, data) {
		const item = this.index(data);
		const heap = this.heap[item];
		const fire = new CustomEvent("wdwindow", {detail: {wall: heap.wall, pin: heap.pin, status: status}});
		this.heap[item].status = status;
		this.update();
		heap.window.dispatchEvent(fire);
		/*-- jogando itens descartados para a lixeira: evitar processamento --*/
		if (status === "avoid" || status === "escape" || status === "close") {
			this.trash.push(heap);
			this.heap = this.heap.filter(function(v,i,a) {return v !== heap;}, this);
		}
		return;
	},
	/**. '{void focus(node win)}: Define o foco da janela renderizada na seguinte ordem:
	- Elemento com atributo '{autofocus};
	- Primeiro filho da janela; ou
	- A própria janela.**/
	focus: function(win) {
		const query = win.querySelector("[autofocus]");
		const first = win.childElementCount > 0 ? win.firstElementChild : win;
		(query !== null ? query.focus() : first.focus());
		return;
	},
	/**. '{boolean isNode(any value)}: Checa se o elemento é um nó HTML.**/
	isNode: function(value) {
		return value !== null && typeof value === "object" && value instanceof HTMLElement;
	},
	/**. '{boolean contains(node win)}: Checa se a janela já está contida nas paredes.**/
	contains: function(win) {
		return this.match({status: "open"}).filter(function (v,i,a) {
			return this[v.wall].contains(win);
		}, this).length > 0;
	},
	/**. '{void attach(node win, string wall, any pin)}: Renderiza a janela à parede.
	|Argumento|Tipo|Descrição|
	|win|node|Janela a fixar, não pode estar contida em outro nó já adicionado.|
	|wall|string|Nome da parede a fixar a janela: "float", "modal" ou "frame" (padrão)|
	|pin|node|Nó de fixação da parede "float" (opcional).|
	|pin|object|Posição (x, y) da parede "float" (opcional).|**/
	attach: function(win, wall, pin) {
		/*-- janela não é um nó: retornar nulo --*/
		if (!this.isNode(win)) throw new TypeError("The window must be an HTML element.");
		wall = (/^(frame|modal|float)$/i).test(wall) ? String(wall).toLowerCase() : "frame";
		const focus = this.isNode(pin) ? pin : (document.activeElement !== document.body ? document.activeElement : null);
		this.heap.push({window: win, wall: wall, pin: pin, focus: focus, status: null});
		/*-- janela renderizada: rejeitar --*/
		if (this.contains(win))
			return this.fire("avoid", {window: win, status: null});
		/*-- modal aberto: impedir interrupções --*/
		if (this.index({wall: "modal", status: "open"}) >= 0 && wall !== "modal")
			return this.fire("avoid", {window: win, status: null});
		/*-- checar particularidades --*/
		this.fire("wait", {window: win, status: null});
		if (wall === "frame") return this.addFrame(win);
		if (wall === "modal") return this.addModal(win);
		if (wall === "float") return this.addFloat(win);
		return;
	},
	/**. '{void detach(node win)}: Remove a janela renderizada.**/
	detach: function(win) {
		const find = this.match({window: win, status: "open"});
		if (find.length  === 0       ) return;
		if (find[0].wall === "frame" ) return this.delFrame(win);
		if (find[0].wall === "modal" ) return this.delModal(win);
		if (find[0].wall === "float" ) return this.delFloat(win);
		return
	},
	/**. '{void addModal(node win)}: Adiciona uma janela modal.**/
	addModal: function(win) {
		/*-- se já tiver uma janela modal aberta: aguardar --*/
		if (this.index({wall: "modal", status: "open"}) >= 0) return;
		/*-- se já tiver uma janela float aberta: remover --*/
		if (this.index({wall: "float", status: "open"}) >= 0) this.purge("float", true);
		/*-- adicionar janela --*/
		this.modal.appendChild(win);
		win.setAttribute("aria-modal", "true");
		this.fire("open", {window: win, status: "wait", wall: "modal"});
		return this.focus(win);
	},
	/**. '{void delModal(node win, boolean esc)}: Remove uma janela modal.**/
	delModal: function(win, esc) {
		this.match({window: win, status: "open", wall: "modal"}).forEach(function(v,i,a) {
			v.window.remove();
			win.removeAttribute("aria-modal");
			this.fire(esc === true ? "escape" : "close", v);
			/*-- último item: chamar o próximo modal da fila ou devolver o focus --*/
			if (i === a.length - 1) {
				const rest = this.match({status: "wait", wall: "modal"});
				if (rest.length > 0)
					this.addModal(rest[0].window);
				else if	(v.focus !== null)
					v.focus.focus();
			}
		}, this);
		return;
	},
	/**. '{void addFloat(node win)}: Adiciona uma janela flutuante.**/
	addFloat: function(win) {
		/*-- não renderizar dois float ao mesmo tempo --*/
		this.match({wall: "float", status: "open"}).forEach(function(v,i,a) {
			this.delFloat(v.window, true);
		}, this)
		/*-- adicionar janela --*/
		this.float.appendChild(win);
		this.fire("open", {window: win, status: "wait", wall: "float"});
		/*-- definir posicionamento --*/
		const data = this.match({window: win, status: "open", wall: "float"})[0];
		const pin  = new __Pin(this.float, data.pin);
		pin.fix();
		return this.focus(win);
	},
	/**. '{void delFloat(node win, boolean esc)}: Remove uma janela flutuante.**/
	delFloat: function(win, esc) {
		this.match({window: win, status: "open", wall: "float"}).forEach(function(v,i,a) {
			v.window.remove();
			this.fire(esc === true ? "escape" : "close", v);
			/*-- último item: devolver o focus --*/
			if (i === a.length - 1 && v.focus !== null)
				v.focus.focus();
		}, this);
		return;
	},
	/**. '{void addFrame(node win)}: Adiciona uma janela ao frame.**/
	addFrame: function(win) {
		this.frame.appendChild(win);
		this.fire("open", {window: win, status: "wait", wall: "frame"});
		return;
	},
	/**. '{void delFrame(node win, boolean esc)}: Remove uma janela do frame.**/
	delFrame: function(win, esc) {
		this.match({window: win, status: "open", wall: "frame"}).forEach(function(v,i,a) {
			v.window.remove();
			this.fire(esc === true ? "escape" : "close", v);
		}, this);
		return;
	},
	/**. '{void purge(string wall)}: Remove todas as janelas renderizadas da parede.**/
	purge: function(wall) {
		this.match({wall: wall, status: "open"}).forEach(function(v,i,a) {
			if      (wall === "frame") this.delFrame(v.window, true);
			else if (wall === "float") this.delFloat(v.window, true);
			else if (wall === "modal") this.delModal(v.window, true);
		}, this);
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador do objeto chamado durante os eventos '{resize, click e keydown}.**/
	handleEvent: function(ev) {
		if (ev.type === "click" && !this.float.contains(ev.target)) {
			this.purge("float");
		}
		else if (ev.type === "resize") {
			this.purge("float");
		}
		else if (ev.type === "keydown" && ev.key === "Escape") {
			this.purge("float");
			this.purge("modal");
		}
		return;
	},
};