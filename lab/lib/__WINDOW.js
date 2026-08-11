/**
#3 Janelas
	O objeto '{__WINDOW} administra paredes e janelas:
. frame: Parede de profundidade baixa e posição fixa que permite múltiplas janelas.
. float: Parede de profundidade intermediária e posição variável que permite apenas uma janela a cada interação.
. modal: Parede de profundidade superior posição fixa que permite múltiplas janelas renderizadas em fila.
Características:
- A janela '{modal} aberta impede a exibição de novas janelas '{float} ou '{frame};
- Uma nova janela '{float} derruba a que estiver aberta;
- Uma mesma janela não pode ser renderizada mais de uma vez ao mesmo tempo;
- A tecla ESC derruba as janelas '{modal} e '{float};
- Um clique fora da janela '{float} a derruba;
- A janela '{modal} deixa o documento inerte;
- A janela '{float} deixa o documento estático;
- A cada mudança no estado da janela, uma função disparadora, se definida, é chamada enviando um objeto como argumento:
|Propriedade|Tipo|Descrição|
|'{signal}|string|O estado da janela|
|'{window}|node|Elemento da janela|
|'{open}|boolean|Informa se a janela foi exibida|
|'{close}|boolean|Informa se a janela foi fechada|
|'{submit}|object|Dados do evento '{submit}, se for o caso|
|""Tabela de argumentos da função disparadora.""|
	Os seguintes estados da janela podem ser anunciados:
	|Sinal|Descrição|'{modal}|'{float}|'{frame}|
	|'{attach}|Anexado à janela principal|Sim|Sim|Sim|
	|'{detach}|Janela removida pelo método '{detach}|Sim|Sim|Sim|
	|'{cancelled}|Janela removida pelo método '{detach} antes de ser exibida|Sim|Não|Não|
	|'{rejected}|A exibição da janela foi rejeitada|Não|Sim|Sim|
	|'{pushed}|Janela removida por outra janela|Não|Sim|Não|
	|'{escape}|Janela removida pela tecla '{esc}|Sim|Sim|Não|
	|'{tab}|Janela removida pela tecla '{Tab}|Não|Sim|Não|
	|'{offtarget}|Janela removida por clique fora do alvo|Não|Sim|Não|
	|'{submit}|Janela removida por submissão de formulário|Sim|Sim|Sim|
	|""Tabela dos estados da janela""|**/
const __WINDOW = {
	/**. '{array heap}: Estabelece a fila de janelas anexadas com as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|'{open}|boolean|Informa se a janela foi exibida|
	|'{win}|node|Registra a janela|
	|'{type}|string|Registra o tipo de janela: '{frame, modal, float}|
	|'{call}|function|Função disparadora a ser chamada ao abrir e fechar a janela|
	|'{source}|node|Elemento focado antes de chamar a janela|
	|'{parent}|node|Nó HTML pai da janela no momento da anexação|
	|'{next}|node|Nó HTML irmão da janela no momento da anexação|
	|'{focus}|node|Nó HTML vigente no momento da anexação|
	|'{hidden}|boolean|Valor da propriedade '{hidden} da janela no momento da anexação|
	|'{index}|boolean|Valor do atributo '{tabindex} da janela no momento da anexação|
	|'{style}|boolean|Valor do atributo '{style} da janela no momento da anexação|**/
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
		const ev = {
			frame: {submit: this},
			modal: {submit: this, keydown: this},
			float: {submit: this, keydown: this, click: this}
		};
		for (let i in ev) {
			let attr = {"data-js-wd-window": i, addEventListener: ev[i], tabindex: -1};
			this[i] = this[i] ? this[i] : __HTML("div", attr);
		}
		return;
	},
	/**. '{void inert(boolean ok)}: Define a inércia no documento, exceto para a parede "modal".**/
	inert: function(ok) {
		const query = ok ? document.body.children : document.querySelectorAll("body > *[inert]");
		for (let i = 0; i < query.length; i++) {
			(!ok || query[i] === this.modal ? query[i].removeAttribute("inert") : query[i].setAttribute("inert", "true"));
			(!ok || query[i] === this.modal ? query[i].removeAttribute("aria-hidden") : query[i].setAttribute("aria-hidden", "true"));
		}
		return;
	},
	/**. '{void freeze(boolean x)}: Define o congelamento do documento.**/
	freeze: function(x) {
		__HTML(document.body, {className: x === true ? {add: "js-wd-freeze"} : {remove: "js-wd-freeze"}});
		return;
	},
	/**. '{void affix(node win, node src)}: Fixa a janela '{float} ao elemento que causou seu disparo, ou na posição '{sw}.**/
	affix: function(win, src) {
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
		win.style.width     = window.getComputedStyle(win).width;
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
		const heap   = this.heap[index];
		const open   = this.match({open: true, type: heap.type}) >= 0;
		const modal  = this.match({open: true, type: "modal"});
		const float  = this.match({open: true, type: "float"});
		const frame  = this.match({open: true, type: "frame"});
		this.walls();
		/*-- casos específicos --*/
		if (modal >= 0)
			return this.close(heap.type === "modal" ? -1 : index, "rejected");
		if (float >= 0 && heap.type === "float")
			return this.close(float, "pushed");
		/*-- adicionando à janela --*/
		heap.open = true;
		heap.win.hidden = false;
		heap.win.setAttribute("aria-modal", heap.type === "modal" ? "true" : "false" );
		this[heap.type].appendChild(heap.win);
		if (this[heap.type].parentElement !== document.body)
			document.body.appendChild(this[heap.type]);
		/*-- definindo comportamento de modal ou float --*/
		if (heap.type === "modal" || heap.type === "float") {
			/*-- posicionando float --*/
			if (heap.type === "float") this.affix(heap.win, heap.source);
			/*-- ligar inert ou freeze --*/
			if (!open) this[heap.type === "modal" ? "inert" : "freeze"](true);
			/*-- fixando foco --*/
			const auto = heap.win.querySelector("[autofocus]");
			const main = auto === null ? heap.win : auto;
			if (main.tabIndex < 0)
				main.setAttribute("tabindex", auto === null ? -1 : 0);
			main.focus();
		}
		/*-- adicionando cores --*/
		const wcolor = window.getComputedStyle(heap.win);
		if (wcolor.background === "none") {
			const bcolor = window.getComputedStyle(document.body);
			const empty  = bcolor.background === "none";
			heap.win.style.background = empty ? "#f9f9f9" : bcolor.background;
			heap.win.style.color = empty || bcolor.color === "none" ? "#202020" : bcolor.color;
		}
		/*-- acionar disparador --*/
		if (heap.call !== null)
			heap.call({signal: "attach", window: heap.win, close: false, open: true, submit: null});
		return;
	},
	/**. '{void update(integer index)}: Verifica o atendimento da fila.**/
	update: function() {
		return this.open(this.match({open: false}));
	},
	/**. '{void close(integer index, string signal, object ev)}: Remove a janela localizada no índice indicado. O argumento '{signal} define o motivo do fechamento e '{ev} o evento de submissão, se for o caso.**/
	close: function(index, signal, ev) {
		if (index < 0 || index > this.heap.length - 1) return;
		const heap = this.heap[index];
		this.heap  = this.heap.filter(function(v,i,a) {return i !== index;});
		const open = this.match({open: true, type: heap.type}) >= 0;
		/*-- retornar o elemento para origem ou excluí-lo da tela --*/
		if (heap.parent === null)
			heap.win.remove();
		else if (heap.next === null || heap.next.parentElement !== heap.parent)
			heap.parent.appendChild(heap.win);
		else
			heap.parent.insertBefore(heap.win, heap.next);
		/*-- fechando parede se não tiver janela sendo exibida --*/
		if (!open) {
			this[heap.type].remove();
			this[heap.type] = null;
		}
		/*-- reestabelecendo características --*/
		heap.win[heap.style === null ? "removeAttribute" : "setAttribute"]("style", heap.style);
		heap.win[heap.index === null ? "removeAttribute" : "setAttribute"]("tabindex", heap.index);
		heap.win.removeAttribute("aria-modal");
		heap.win.hidden = heap.hidden;
		/*-- definindo comportamento de modal ou float --*/
		if (heap.type === "modal" || heap.type === "float") {
			/*-- desligando inert ou freeze se não tiver janela sendo exibida --*/
			if (!open) this[heap.type === "modal" ? "inert" : "freeze"](false);
			/*-- foco após fechamento da janela, se não existir janela aberta --*/
			if (!open && heap.source !== null) {
				if (heap.source.tabIndex < 0)
					heap.source.setAttribute("tabindex", -1);
				heap.source.focus();
			}
		}
		/*-- disparando evento --*/
		if (heap.call !== null)
			heap.call({signal: signal, window: heap.win, close: true, open: heap.open, submit: ev ? ev : null});
		return this.update();
	},
	/**. '{void attach(node win, string type, function call)}: Anexa a janela, conforme o tipo, e define um disparador.**/
	attach: function(win, type, call) {
		if (!__Type(win).instanceOf("HTMLElement")) return null;
		if (this.contains(win)) return null;
		type = String(type).trim().toLowerCase();
		this.heap.push({
			open: 	false,
			win:    win,
			type:   (/^frame|modal|float$/).test(type) ? type : "frame",
			call:   typeof call === "function" ? call : null,
			source: document.activeElement !== document.body ? document.activeElement : null,
			parent: win.parentElement,
			next:   win.nextElementSibling,
			hidden: win.hidden,
			index:  win.getAttribute("tabindex"),
			style:  win.getAttribute("style"),
		});
		return this.open(this.heap.length - 1);
	},
	/**. '{void detach(node win)}: Desanexa a janela da tela.**/
	detach: function(win) {
		const find = this.match({win: win});
		return find < 0 ? undefined : this.close(find, this.heap[find].open ? "detach" : "cancelled");
	},
	/**. '{void handleEvent(object ev)}: Disparador do objeto chamado durante os eventos '{click, keydown e submit}.**/
	handleEvent: function(ev) {
		/*-- submit: aplica-se às três paredes --*/
		if (ev.type === "submit") {
			ev.preventDefault();
			const child = ev.currentTarget.children;
			for (let i = 0; i < child.length; i++) {
				if (child[i].contains(ev.target))
					this.close(this.match({win: child[i]}), "submit", ev);
			}
			return;
		}
		/*-- click: aplica-se à parede float --*/
		if (ev.type === "click" && ev.target === ev.currentTarget) {
			return this.close(this.match({win: ev.currentTarget.firstElementChild}), "offtarget");
		}
		/*-- keydown: aplica-se às paredes float e modal --*/
		if (ev.type === "keydown") {
			const find = this.match({win: ev.currentTarget.firstElementChild});
			if (ev.key === "Escape")
				return this.close(find, "escape");
			if (ev.key === "Tab" && find >= 0 && this.heap[find].type === "float") {
				ev.preventDefault();
				return this.close(find, "tab");
			}

		}
		return;
	},
};
__CSS.push(`/*-- WINDOW --*/
:root {
	--var-js-wd-window-zindex-0: 9999;
	--var-js-wd-window-zindex-1: 9998;
	--var-js-wd-window-zindex-2: 9997;
}
@keyframes js-wd-window-modal {
	from {opacity: 0; transform: scale(0);}
	to   {opacity: 1; transform: scale(1);}
}
@keyframes js-wd-window-float {
	from {opacity: 0; max-height: 0;}
	to   {opacity: 1;}
}
@keyframes js-wd-window-frame {
	from {opacity: 0; transform: translate(-100%);}
	to   {opacity: 1;}
}
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
[data-js-wd-window="modal"] > * {animation: js-wd-window-modal 0.5s ease;}
[data-js-wd-window="float"] > * {animation: js-wd-window-float 0.5s ease;}
[data-js-wd-window="frame"] > * {animation: js-wd-window-frame 0.5s ease;}
[data-js-wd-window="frame"] {
	top:            initial !important;
	display:        flex !important;
	flex-direction: column !important;
	margin:         0.5em !important;
	padding-right:  10px !important;
	max-height:     calc(100vh - 1em) !important;
	overflow-y:     auto !important;
	z-index:        var(----var-js-wd-window-zindex-3) !important;
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
	z-index: var(--var-js-wd-window-zindex-2) !important;
}
[data-js-wd-window="float"] > * {
	position: absolute !important;
	display:  block !important;
	overflow: auto !important;
}
[data-js-wd-window="modal"] {
	padding: 0.5em !important;
	z-index: var(--var-js-wd-window-zindex-1);
	background: rgb(50,50,50) !important;
	background: rgba(50,50,50,0.3) !important;
	display:         flex !important;
	flex-direction:  row !important;
	justify-content: center !important;
	align-items:     center !important;
}
[data-js-wd-window="modal"] > * {
	max-width:  90vw;
	max-height: 90vh;
	overflow-y: auto !important;
}`);