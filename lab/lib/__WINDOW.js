
/*
	|Evento|Descrição|'{modal}|'{float}|'{frame}|
	|'{attach}|Adiconado à fila|Sim|Sim|Sim|
	|'{display}|Em exibição|Sim|Sim|Sim|
	|'{stop}|Impedido de entrar|Não|Sim|Não|
	|'{detach}|Removido formalmente|Sim|Sim|Sim|
	|'{escape}|Removido pela tecla esc|Sim|Sim|Não|
	|'{offtarget}|Removido por clique fora do alvo|Não|Sim|Não|
	|'{push}|Removido por outro elemento|Não|Sim|Não|
	|'{submit}|Removido por submissão de formulário|Sim|Sim|Sim|
	*/

const __WIN = {
	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- WINDOW --*/
.js-wd-freeze {overflow: hidden !important;}
[data-js-wd-window] {
	position:   fixed !important;
	top:        0 !important;
	left:       0 !important;
	right:      0 !important;
	bottom:     0 !important;
	margin:     0 !important;
	margin:     0 !important;
	padding:    0 !important;
	background: tranparent !important;
}
[data-js-wd-window="frame"] {
	top:            initial !important;
	display:        flex !important;
	flex-direction: column !important;
	margin:         0.5em !important;
	max-height:     calc(100vh - 1em) !important;
	overflow-y:     auto !important;
	z-index:        var(--var-js-wd-z-index-3) !important;
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
[data-js-wd-window="float"] {
	display: block !important;
	z-index: var(--var-js-wd-z-index-2) !important;
}
[data-js-wd-window="float"] > * {
	position: absolute !important;
	display:  block !important;
	overflow: auto !important;
}
[data-js-wd-window="modal"] {
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
	/**. '{array heap}: Estabelece a fila de janelas anexadas com as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|'{open}|boolean|Informa se a janela foi exibida|
	|'{win}|node|Registra a janela|
	|'{type}|string|Registra o tipo de janela: '{frame, modal, float}|
	|'{call}|function|Função disparadora a ser chamada ao abrir e fechar a janela|
	|'{focus}|node|Nó HTML vigente no momento da anexação|
	|'{mouse}|object|Posição do mouse no momento da anexação|
	|'{parent}|node|Nó HTML pai da janela no momento da anexação|
	|'{next}|node|Nó HTML irmão da janela no momento da anexação|
	|'{hidden}|boolean|Valor da propriedade '{hidden} da janela no momento da anexação|**/
	heap: [],
	/**. '{integer match(object data)}: Retorna o índice do primeiro item da fila cujas características casam com '{data}, ou -1**/
	match: function(data) {
		for (let i = 0; i < this.heap.length; i++) {
			let find = true;
			for (let j in data) {
				find = data[j] === this.heap[i][j];
				if (!find) break;
			}
			if (find) return i;
		}
		return -1;
	},
	/**. '{boolean contains(node win)}: Retorna verdadeiro se '{win} conter ou estiver contido em alguma janela da fila**/
	contains: function(win) {
		for (let data of this.heap)
			if (win.contains(data.win) || data.win.contains(win)) return true;
		return false;
	},
	/**. '{void walls()}: Cria as paredes para recepcionar as janelas ('{frame, modal, float}) do objeto.**/
	walls: function() {
		this.frame = this.frame ? this.frame : __HTML("div", {"data-js-wd-window": "frame"});
		this.modal = this.modal ? this.modal : __HTML("div", {"data-js-wd-window": "modal", addEventListener: {keydown: this}, tabIndex: -1});
		this.float = this.float ? this.float : __HTML("div", {"data-js-wd-window": "float", addEventListener: {keydown: this, click: this}, tabIndex: -1});
		return;
	},
	/**. '{void inert(boolean ok)}: Define a inércia no documento, exceto para a parede "modal".**/
	inert: function(ok) {
		const query = ok ? document.body.children : document.querySelectorAll("body > *[inert]");
		for (let i = 0; i < query.length; i++)
			(!ok || query[i] === this.modal ? query[i].removeAttribute("inert") : query[i].setAttribute("inert", "true"));
		return;
	},
	/**. '{void freeze(boolean x)}: Define o congelamento do documento.**/
	freeze: function(x) {
		__HTML(document.body, {className: x === true ? {add: "js-wd-freeze"} : {remove: "js-wd-freeze"}});
		return;
	},
	/**. '{void affix(node win, node src)}: Fixa a janela '{float} ao elemento que causou seu disparo, ou na posição '{sw}.**/
	affix: function(win, src) {console.log(win, src)
		/*-- dados gerais --*/
		const p  = Math.min(window.screen.width, window.screen.height)*0.01;
		const h  = window.innerWidth;
		const v  = window.innerHeight;
		/*-- acertando estilos --*/
		win.style.left      = null;
		win.style.bottom    = null;
		win.style.top       = null;
		win.style.right     = null;
		win.style.maxHeight = null;
		win.style.maxWidth  = `${h - 2*p}px`;
		win.style.maxHeight = `${v - 2*p}px`;
		/*-- sem fonte --*/
		if (src === null) {
			win.style.left      = `${p}px`;
			win.style.bottom    = `${p}px`;
			return;
		}
		/*-- com fonte --*/
		const bw = win.getBoundingClientRect();
		const bs = src.getBoundingClientRect();
		/*-- espaço vertical --*/
		const dn = bs.top - p > 0 ? bs.top - p : 0;
		const ds = v - p - bs.bottom > 0 ? v - p - bs.bottom : 0;
		/*-- espaço horizontal --*/
		const de = h - p - bs.left > 0 ? h - p - bs.left : 0;
		const dw = bs.right - p > 0 ? bs.right - p : 0;
		/*-- posicionamento --*/
		const pv = bw.height <= ds ? "s" : (bw.height <= dn ? "n" : (dn > ds ? "n" : "s"));
		const ph = bw.width  <= de ? "e" : (bw.width  <= dw ? "w" : (dw > de ? "left" : "right"));
		/*-- fixar na vertical --*/
		if (pv === "s")
			win.style.top = (bs.bottom < p ? p : bs.bottom)+"px";
		else
			win.style.bottom = (bs.top > (v - p) ? (v - p) : v - bs.top)+"px";
		win.style.maxHeight = (pv === "s" ? ds : dn)+"px";
		/*-- fixar na horizontal --*/
		if (ph === "e")
			win.style.left = (bs.left < p ? p : bs.left)+"px";
		else if (ph === "w")
			win.style.right = (bs.right > (h - p)? (h - p) : h - bs.right)+"px";
		else
			win.style[ph] = `${p}px`;
		return;
	},
	/**. '{void open(integer index)}: Verifica a possibilidade de abertura da janela localizada no índice indicado.**/
	open: function(index) {
		if (index < 0 || index > this.heap.length - 1) return;
		const heap  = this.heap[index];
		const open  = this.match({open: true, type: heap.type}) >= 0;
		const modal = this.match({open: true, type: "modal"});
		const float = this.match({open: true, type: "float"});
		const frame = this.match({open: true, type: "frame"});
		/*-- casos específicos --*/
		if (modal >= 0 && heap.type === "float")//FIXME não está funcionando
			return this.close(index, "rejected");
		if (modal >= 0 && heap.type === "modal")//FIXME não está funcionando (que porra é essa?)
			return;
		if (float >= 0 && heap.type === "float")//FIXME não está funcionando
			this.close(float, "pushed");
		/*-- adicionando à janela --*/
		heap.open = true;
		heap.win.hidden = false;
		this[heap.type].appendChild(heap.win);
		document.body.appendChild(this[heap.type]);
		/*-- posicionando float --*/
		if (heap.type === "float")
			this.affix(heap.win, heap.source);
		// ligar inert ou freeze
		if (!open && (heap.type === "modal" || heap.type === "float"))
			this[heap.type === "modal" ? "inert" : "freeze"](true);
		/*-- formulário --*/
		if ((/^form$/i).test(heap.win.tagName))
			heap.win.addEventListener("submit", this);
		/*-- fixando foco --*/
		if (heap.type === "modal" || heap.type === "float") {
			const auto = heap.win.querySelector("[autofocus]");
			const main = auto === null ? heap.win : auto;
			main.setAttribute("tabindex", main.tabIndex >= 0 ? main.tabIndex : (auto === null ? -1 : 0));
			main.focus();
		}
		/*-- acionar disparador --*/
		if (heap.call !== null)
			heap.call("attach", heap.win);
		return;
	},
	/**. '{void update(integer index)}: Verifica o atendimento da fila.**/
	update: function() {
		return this.open(this.match({open: false}));
	},
	/**. '{void close(integer index)}: Remove a janela localizada no índice indicado.**/
	close: function(index, signal) {
		if (index < 0 || index > this.heap.length - 1) return;
		const heap = this.heap[index];
		this.heap  = this.heap.filter(function(v,i,a) {return i !== index;});
		const open = this.match({open: true, type: heap.type}) >= 0;
		/*-- tornar o elemento para origem ou excluí-lo da tela --*/
		heap.win.hidden = heap.hidden;
		if (heap.parent === null)
			heap.win.remove();
		else if (heap.next === null || heap.next.parentElement !== heap.parent)
			heap.parent.appendChild(heap.win);
		else
			heap.parent.insertBefore(heap.win, heap.next);
		/*-- formulário --*/
		if ((/^form$/i).test(heap.win.tagName))
			heap.win.removeEventListener("submit", this);
		/*-- retornando style --*/
		if (heap.style === null)
			heap.win.removeAttribute("style")
		else
			heap.win.setAttribute("style", heap.style);
		/*-- fechando parede sem janela --*/
		if (!open)
			this[heap.type].remove();
		/*-- desligando inert ou freeze --*/
		if (!open && (heap.type === "modal" || heap.type === "float"))
			this[heap.type === "modal" ? "inert" : "freeze"](false);
		/*-- retornando ao foco --*/
		if (heap.source !== null && (heap.type === "modal" || heap.type === "float")) {
			const tab = heap.source.tabIndex;
			heap.source.setAttribute("tabindex", tab >= 0 ? tab : -1);
			heap.source.focus();
		}
		/*-- disparando evento --*/
		if (heap.call !== null)
			heap.call(signal, heap.win);
		return this.update();
	},
	/**. '{void attach(node win, string type, function call)}: Anexa a janela, conforme o tipo, e define um disparador.**/
	attach: function(win, type, call) {
		if (!__Type(win).instanceOf("HTMLElement")) return null;
		if (this.contains(win)) return null;
		type = String(type).trim().toLowerCase();
		this.walls();
		this.heap.push({
			open: 	false,
			win:    win,
			type:   (/^frame|modal|float$/).test(type) ? type : "frame",
			call:   typeof call === "function" ? call : null,
			source: document.activeElement !== document.body ? document.activeElement : null,
			parent: win.parentElement,
			next:   win.nextElementSibling,
			hidden: win.hidden,
			style:  win.getAttribute("style"),
		});
		return this.open(this.heap.length - 1);
	},
	/**. '{void detach(node win)}: Desanexa a janela da tela.**/
	detach: function(win) {
		return this.close(this.match({win: win}), "detach");
	},
	/**. '{void handleEvent(object ev)}: Disparador do objeto chamado durante os eventos '{click, keydown e submit}.**/
	handleEvent: function(ev) {
		if (ev.type === "submit")
			return this.close(this.match({win: ev.target}), "submit");
		if (ev.type === "click" && ev.target === ev.currentTarget)
			return this.close(this.match({win: ev.currentTarget.firstElementChild}), "offtarget");
		if (ev.type === "keydown" && /*ev.target === ev.currentTarget &&*/ ev.key === "Escape")
			return this.close(this.match({win: ev.currentTarget.firstElementChild}), "escape");
		return;
	},
};

















/**
#3 Janelas
O objeto '{__WINDOW} administra paredes e janelas:
. frame: Parede de profundidade baixa e posição fixa que permite múltiplas janelas.
. float: Parede de profundidade intermediária e posição variável que permite apenas uma janela a cada interação.
. modal: Parede de profundidade superior posição fixa que permite múltiplas janelas renderizadas em fila.
Características:
- A janela "modal" derruba a janela "float" aberta e impede a exibição de novas janelas "float" ou "frame";
- Uma nova janela "float" derruba a que estiver aberta;
- Uma mesma janela não pode ser renderizada mais de uma vez ao mesmo tempo;
- A tecla ESC derruba as janelas "modal" ou "float";
- Um clique fora da janela "float" a derruba;
- A janela "modal" deixa o documento inerte;
- A janela "float" deixa o documento estático;
- A cada mudança no estado da janela, um evento i{wdwindow} será disparado na janela (ver método '{fire}).
**/
const __WINDOW = {
	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	//CSS: __CSS.data.push(`/*-- WINDOW/FRAME --*/
	CSS: __CSS.data.valueOf(`/*-- WINDOW/FRAME --*/
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
	|wait|A janela modal aguarda renderização.|
	|open|A janela foi renderizada.|
	|close|A janela foi fechada (sai do '{heap}).|
	|escape|A janela foi descartada (sai do '{heap}).|
	. Motivos para o status "avoid":
	- Tentativa de anexação de janela já renderizada;
	- Anexação de janela "float" ou "frame" com "modal" aberto;
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
		/*-- jogando fora itens descartados --*/
		if (status === "avoid" || status === "escape" || status === "close")
			this.heap = this.heap.filter(function(v,i,a) {return v !== heap;}, this);
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