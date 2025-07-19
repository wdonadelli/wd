/*----------------------------------------------------------------------------*/
	/**#4 Janelas
	''const object __WINDOW''
	Administra containers para janelas modais, em quadro ou flutuantes.**/
	const __WINDOW = {
		/**. '{regexp places}: Valores de posicionamento.**/
		places: /^(top|bottom|left|right|center|full|[nswe]|[ns][we])$/i,
		/**. '{integer id}: Controla o identificador das janelas.**/
		id: Math.trunc(100*Math.random()),
		/**. '{array heap}: Registra informações sobre os quadros.**/
		heap: [],
		/**. '{integer indexOf(node node)}: Retorna o índice da pilha onde o nó foi localizado ou -1 se não encontrado.**/
		indexOf: function(node) {
			for (let i = 0; i < this.heap.length; i++)
				if (this.heap[i].node === node) return i;
			return -1;
		},
		/**. '{boolean remove(node node)}: Retorna verdadeiro se a remoção do nó da pilha foi possível (não renderizado)**/
		remove: function (node) {
			const item = this.indexOf(node);
			if (item < 0)              return true;
			if (this.heap[item].added) return false;
			this.heap = this.heap.filter(function(v,i,a) {return item !== i;});
			return true;
		},
		/**. '{boolean isForm(node node)}: Retorna verdadeiro se o elemento for um nó.**/
		isForm: function(node) {
			return typeof node === "object" && node instanceof HTMLFormElement;
		},


		/*
		nó precisa ser um form para adicionar o evento submit
		tipos:
			modal: janela  flutuante modal com posição fixa à tela (única)
			float:  janela  flutuante com posição absoluta sobre um elemento (única)
			frame: janelas flutuantes dispostas em uma área da tela em ordem de exibição (múltipla)
		*/
		/**. '{integer addModal(node node, string place, function trigger)}: Adiciona o nó á fila para ser exibido numa janela modal quando oportuno e retorna seu id ou nulo se o nó não for um formulário HTML ou já estiver na fila ou renderizado.**/
		addModal: function(node, place, trigger) {
			if (!this.isForm(node) || !this.remove(node)) return null;
			place      = this.places.test(place) ? place.toLowerCase() : "center";
			trigger    = typeof trigger === "function" ? trigger : null;
			const heap = {
				id:   this.id++, added: false, type:    "modal",
				node: node,      place: place, trigger: trigger,
				win: __DOM({
					tag: "DIV",
					attr: {
						"data-wd-window": "modal",
						"className": `js-wd-window-${place}`,
						"tabIndex": "-1",
					},
					child: {
						tag: node,
						attr: {"aria-modal": "true", "tabIndex": "-1"}
					}
				})
			};
			node.removeEventListener("submit", this);
			node.addEventListener("submit", this);
			this.heap.push(heap);
			return heap.id;
		},












		/**. '{object packs}: Registra os elementos empacotadores de janela.**/
		packs: {
			modal: {multiple: 0, inert: 1, freeze: 0, escape: 1, child: [], node: __HTML("DIV")},
			float: {multiple: 0, inert: 0, freeze: 1, escape: 1, child: [], node: __HTML("DIV", {addEventListener: ["scroll", (ev) => ev.preventDefault(), {passive: false}]})},
			frame: {multiple: 1, inert: 0, freeze: 0, escape: 0, child: [], node: __HTML("DIV")},
		},
		/**. '{void setPosition(node node, integer x, integer y)}: Acerta o posicionamento da janela float.**/
		setPosition: function(node, x, y) {
			const back = this.packs.float.node;
			const base = {w: window.screen.width, h: window.screen.height};
			const area = {w: window.innerWidth,   h: window.innerHeight};
			const padd = Math.min(base.w, base.h) / 100;
			const pack = Math.max(base.w, base.h) / 4;
			const edge = {l: padd, r: area.w - padd, t: padd, b: area.h - padd};
			const dots = {
				x: x < edge.l ? edge.l : (x > edge.r ? edge.r : x),
				y: y < edge.t ? edge.t : (y > edge.b ? edge.b : y),
			};
			const size = {
				rect: function() {
					const data = node.getBoundingClientRect();
					this.w = data.width;
					this.h = data.height;
				}
			};
			size.rect();
			/*-- horizontal --*/ //FIXME arrumar isso aqui para qualquer tamanho de nó limitado a tela
			back.style.width = (size.w > pack ? pack : size.w)+"px";
			size.rect();
			size.px = (dots.x + size.w > edge.r) && (dots.x - edge.l > edge.r - dots.x) ? "right" : "left";
			back.style[size.px] = (size.px === "left" ? dots.x : area.w - dots.x)+"px";
			/*-- vertical --*/
			size.py = (dots.y + size.h > edge.b) && (dots.y - edge.t > edge.b - dots.y) ? "bottom" : "top";
			back.style[size.py]  = (size.py === "top" ? dots.y : area.h - dots.y)+"px";
			back.style.maxHeight = (size.py === "top" ? (edge.b - dots.y) : (dots.y - edge.t))+"px";
			return;
		},
		/**. '{void show(object heap)}: Renderiza o elemento.**/
		show: function(heap) {
			const css1 = `js-wd-window js-wd-window-${heap.type}`;
			const css2 = heap.type === "modal" ? `js-wd-window-${heap.type}-${heap.local}` : "";
			const aria = heap.type === "modal" ? "true" : "false"
			__DOM({
				tag:   this.packs[heap.type].node,
				attr:  {className: `${css1} ${css2}`, tabIndex:  -1, style: ""},
				child: [{tag:  heap.node, attr: {tabIndex: -1, "aria-modal": aria}}],
			}, document.body);
			/*-- arrumando particularidades de estilos --*/
			const ignore = {display: "none", visibility: "hidden"};
			const styles = window.getComputedStyle(heap.node, null);
			for (let i in ignore) {
				if (styles[i] === ignore[i])
					heap.node.style[i] = null;
			}
			/*-- arrumando posicionamento de float --*/
			if (heap.type === "float")
				this.setPosition(heap.node, heap.x, heap.y);
			/*-- ir para o primeiro elemento focável dentro do elemento (o próprio não pode) --*/
			if (heap.type === "modal" || heap.type === "float")
				__ARIA.setFocus(heap.node, true);
			return;
		},


		/**. '{void update()}: Administra a pilha.**/
		update: function() {
			/*-- obtendo conteúdo das janelas para fins de vincular ouvinte --*/
			const oldChild = this.packs.modal.child.length + this.packs.float.child.length > 0;
			/*-- zerar a contagem de filhos --*/
			for (let name in this.packs)
				this.packs[name].child = [];
			/*-- analisando a pilha --*/
			this.heap.forEach(function(heap,i,a) {
				const pack = this.packs[heap.type];
				const push = pack.child.length === 0 || data.multiple === 1;
				/*-- renderizar nós aguardando na fila --*/
				if (heap.status === "INACTIVE" && push) {
					heap.status = "ACTIVE"
					this.show(heap);
					//FIXME inert e freeze?
				}
				/*-- registrar nós renderizados --*/
				if (heap.status === "ACTIVE") {
					pack.child.push(heap.node);
					/*-- realocar se necessário os nós sequestrados --*/
					if (heap.node.parentElement !== pack.node)
						this.show(heap);
				}
			}, this);
			/*-- analisando os empacotadores --*/
			for (let name in this.packs) {
				let pack = this.packs[name];
				/*-- fechar empacotadores vazios --*/
				if (pack.child.length === 0) {
					if (pack.node.parentElement !== null)
						pack.node.remove();
						//FIXME inert e freeze?
					if (pack.node.childElementCount > 0)
						pack.node.innerHTML = "";
				}
				/*-- remover nós alienígenas dos empacotadores --*/
				if (pack.node.childElementCount !== pack.child.length) {
					let child = pack.node.children;
					for (let i = 0; i < child.length; i++) {
						if (pack.child.indexOf(child[j]) < 0)
							child[j].remove();
					}
				}
				/*-- realocar empacotador, se necessário --*/
				if (pack.node.parentElement !== null && pack.node.parentElement !== document.body)
					document.node.appenChild(pack.node);
			}
			/*-- des/vincular ouvinte --*/

			const newChild = this.packs.modal.child.length + this.packs.float.child.length > 0;
			//console.log({old: oldChild, new: newChild})
			if (!oldChild && newChild)
				this.trigger(true);
			else if (oldChild && !newChild)
				this.trigger(false);
			return;
		},/^(top|bottom|left|right|center|full|[nswe]|[ns][we])$/;










	//FIXME reescrever isso aqui, a função close agora retorna 3 elementos tem as propriedades x, y, e local
		/**. '{integer append(node node, object options)}: Agrega elementos aos quadros e retorna o identificador do elemento adicionado. O argumento '{node} refere-se ao elemento a ser agregado e o argumento '{options} define as características do elemento:
		|Nome|Tipo|Valores|Descrição|
		|type|string|float (padrão), modal ou frame|Define o tipo de quadro|
		|place|string|ver adiante|Posicionamento do nó no quadro|
		|close|function|-|Função a ser chamada ao fechar o nó|
		Quanto às características dos quadro, tem-se:
		|Característica|frame|modal|float|
		|Acondicionamento|Em fila|Em camada|Individual|
		|Fundo|Transparente-localizado|Opaco-Tela-Inerte|Ausente-Tela|
		|Fechamento|Não|Esc|Esc, Tab e clique|
		|Objetivo|Alerta|Diálogo|Menu|
		. Ao fechar o nó com o método '{remove}, '{close} receberá como argumento i{verdadeiro}, caso contrário, i{falso}.
		. Para o tipo '{modal}, '{place} pode ter posicionalmento nos lados (top, right, bottom, left, center, full) ou nos pontos cardeais (n, ne, e, se, s, sw, w, nw). Para o tipo '{float}, a posição (x,y) da tela. Não há posicionamento para o tipo '{frame}.

		STATUS>: "INACTIVE ACTIVE CLOSED IGNORED CANCELED"

		**/
		append: function(node, options) {
			const heap  = typeof options === "object" ? options : {};
			const type  = /^(modal|float|frame)$/;
			const local = /^(top|bottom|left|right|center|full|[nswe]|[ns][we])$/;
			/*-- pré ajustes --*/
			heap.type  = String(heap.type).toLowerCase().replace(/\s+/g, "");
			heap.place = String(heap.place).toLowerCase().replace(/\s+/g, "");
			heap.node  = __HTML(node);
			if (heap.node === null || heap.node === document.body) return;
			/*-- definindo heap --*/
			heap.type   = type.test(heap.type)   ? heap.type  : "frame";
			heap.local  = local.test(heap.local) ? heap.local : "center";
			heap.x      = isFinite(heap.x) ? Number(heap.x) : 0;
			heap.y      = isFinite(heap.y) ? Number(heap.y) : 0;
			heap.close  = typeof heap.close === "function" ? heap.close : null;//FIXME mudar isso para listener?
			heap.id     = ++this.id;
			heap.status = "INACTIVE";
			/*-- remover, se já existir em alguma janela, e adicionar à pilha --*/
			this.remove(heap.node, true);
			this.heap.push(heap);
			this.update();
			return heap.id;
		},
		/**. '{integer remove(node node, boolean escape)}: Remove o nó do quadro que o armazena e retorna seu id. O argumento '{escape} deve ser verdadeiro quando o elemento for realocado para outra janela ou fechado.**/
		remove: function(node, escape) {
			let id = null;
			this.heap = this.heap.filter(function(heap,i,a) {
				if (heap.node === node) {
					id = heap.id;
					heap.node.remove();
					if (heap.close !== null)
						heap.close(id, heap.node, escape === true);
					return false;
				}
				return true;
			}, this);
			if (id !== null) this.update();
			return id;
		},



		handleEvent: function(ev) {
			/*-- congelar janela float --*/
			if ((ev.type === "wheel" || ev.type === "touchmove") && this.packs.float.child.length > 0) {
				if (ev.target !== this.packs.float.node && !this.packs.float.node.contains(ev.target))
					return ev.preventDefault();
				if (ev.target === document.body)
					return ev.preventDefault();
			}
			/*-- escapar janela float com clique fora --*/
			if (ev.type === "click" && this.packs.float.child.length > 0) {
				if (ev.target !== this.packs.float.node && !this.packs.float.node.contains(ev.target)) {
					ev.preventDefault();
					return this.remove(this.packs.float.child[0], true);
				}
			}
			/*-- escapar janela float ou modal com Esc --*/
			if (ev.type === "keydown" && ev.key === "Escape") {
				if (this.packs.float.child.length > 0) {
					ev.preventDefault();
					return this.remove(this.packs.float.child[0], true);
				}
				if (this.packs.modal.child.length > 0) {
					ev.preventDefault();
					return this.remove(this.packs.modal.child[0], true);
				}
			}
			return;
		},

		trigger: function(add) {
			if (add === true) {
				document.addEventListener("wheel",     this, {passive: false});
				document.addEventListener("touchmove", this, {passive: false});
				document.addEventListener("click",     this, false);
				document.addEventListener("keydown",   this, false)
			}
			else {
				document.removeEventListener("wheel",     this, {passive: false});
				document.removeEventListener("touchmove", this, {passive: false});
				document.removeEventListener("click",     this, false);
				document.removeEventListener("keydown",   this, false)
			}
			return;
		},





	};



	/**. '{void hideFocus(node node, boolean add)}: Método para tirar o nó do fluxo natural se '{add} for verdadeiro. Se falso, reestabelecerá o fluxo, caso contrário, aplicará falso a todos os nós do elemento.**/
		hideFocus: function(node, add) {
			const attr = "data-js-wd-flux";
			const has  = node.hasAttribute(attr);
			/*-- adicionando (se receber foco ou for editável) --*/
			if (add === true && !has && (node.tabIndex >= 0 || node.isContentEditable)) {
				const json = {tab: node.getAttribute("tabindex"), edit: node.isContentEditable};
				node.removeAttribute("contenteditable");
				node.setAttribute("tabindex", "-1");
				node.setAttribute(attr, JSON.stringify(json));
			}
			/*-- removendo (se conter o atributo) --*/
			else if (add === false && has) {
				try {
					const json = JSON.parse(node.getAttribute(attr));
					if (json.tab !== null)
						node.setAttribute("tabindex", json.tab);
					else
						node.removeAttribute("tabindex");
					if (json.edit)
						node.setAttribute("contenteditable", "true");
				} catch(e) {}
				node.removeAttribute(attr);
			}
			/*-- remover o método de todos os filhos do nó --*/
			else {
				const query = node.querySelectorAll(`[${attr}]`);
				for (let i = 0; i < query.length; i++)
					this.hideFocus(query[i], false);
			}
			return;
		},
		/**. '{void fakeInert(node node, boolean add)}: Método alternativo para deixar o nó inerte.**/
		fakeInert: function(node, add) {
			const has  = node.hasAttribute("data-js-wd-inert");
			if (add && !has) {
				node.setAttribute("data-js-wd-inert", "");
				node.setAttribute("aria-hidden", "true");
				this.hideFocus(node, add);
				const focus = `[contenteditable], [tabindex], a[href], area[href], button, input, select, textarea, summary, iframe, object`;
				const query = node.querySelectorAll(focus);
				for (let i = 0; i < query.length; i++)
					this.hideFocus(query[i], true);
			}
			else if (!add && has) {
				node.removeAttribute("data-js-wd-inert");
				node.removeAttribute("aria-hidden");
				this.hideFocus(node, add);
				this.hideFocus(node);
			}
			return;
		},