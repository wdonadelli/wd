/**
#3 Soltura de arquivos
	O objeto '{__DROP} define ao elemento um mecanismo de soltura de arquivos arrastados para seu interior:
	- cada elemento de soltura ('{drop}) será vinculado a um efeito;
	- os efeitos possíveis são '{copy}, '{move} ou '{link};
	- os arquivos arrastados ('{drag}) poderão ser múltiplos;
	- é possível vincular uma função a ser chamada durante o evento de queda dos arquivos;
	- se não informada a função de queda, um comportamento simplificado será adotado durante o processo conforme efeito definido;
	- a função de queda receberá um argumento com as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|'{event}|string|Efeito vinculado ao arrasto: '{dragstart}, '{dragenter}, '{dragleave}, '{dragover}, '{drop} ou '{dragend}|
	|'{drag}|node|Lista de arquivos arrastados|
	|'{drop}|node|Elemento de queda|
	|'{over}|node|Alvo do elemento de arrasto ou nulo, se fora dele|
	|'{effect}|string|Efeito vinculado ao elemento de queda|
	|'{x}|integer|Posição horizontal do objeto de arrasto em relação ao i{viewport}|
	|'{y}|integer|Posição vertical do objeto de arrasto em relação ao i{viewport}|
	Os eventos correspondem às seguintes ocorrências:
	. '{dragstart}: Os arquivos arrastados estão sobre o documento. A função será disparada para cada elemento de queda. As propriedades '{over} e '{drag} serão nulas.
	. '{dragenter}: O objeto de arrasto entra no elemento de queda. A função será disparada apenas para o elemento de queda específico. As propriedades '{over} e '{drag} serão nulas.
	. '{dragleave}: O objeto de arrasto sai do elemento de queda. A função será disparada apenas para o elemento de queda específico. As propriedades '{over} e '{drag} serão nulas.
	. '{dragover}: O objeto de arrasto está sobre o elemento de queda. A função será disparada apenas para o elemento de queda específico. A propriedade '{over} corresponderá ao elemento sobre o qual paira o elemento de arrasto e a propriedade '{drag} será nula.
	. '{drop}: O objeto de arrasto caiu sobre o elemento de queda. A função será disparada apenas para o elemento de queda específico. A propriedade '{over} corresponderá ao elemento sobre o qual o elemento de arrasto caiu e a propriedade '{drag} conterá a lista de arquivos derrubados.
	. '{dragend}: Encerrado o procedimento. A função será disparada para cada elemento de queda. As propriedades '{over} e '{drag} serão nulas.
	#4 Métodos e Propriedades
**/
const __DROP = {
	/**. '{array drops}: Registra os elementos de queda para fins de controle do evento '{drag} em '{window}.**/
	drops: [],

	/**. '{void dragging(object data)}: Função de arrasto padrão quando não informada em '{attach}.**/
	dragging: function(data) {
		console.log(data);//FIXME
		/*-- analisar eventos --*/
		if (data.event === "dragstart")
			return __HTML(data.drop, {classList: {add: `css-js-wd-drag-${data.effect}`}});
		if (data.event === "dragend")
			return __HTML(data.drop, {classList: {remove: `css-js-wd-drag-${data.effect} css-js-wd-drag-enter css-js-wd-drag-over`}});
		if (data.event === "dragenter")
			return __HTML(data.drop, {classList: {add: "css-js-wd-drag-enter"}});
		if (data.event === "dragleave")
			return __HTML(data.drop, {classList: {remove: "css-js-wd-drag-enter css-js-wd-drag-over"}});
		if (data.event === "dragover")
			return __HTML(data.drop, {classList: {add: "css-js-wd-drag-over"}});
		if (data.event !== "drop") return;
		for (let i = 0; i < data.drag.length; i++) {
			let elem;
			let type = data.drag[i].type.split("/");
			if (data.effect === "link")
				elem = __HTML("a", {href: URL.createObjectURL(data.drag[i]), textContent: data.drag[i].name});
			else if (type[0] === "audio")
				elem = __HTML("audio", {src: URL.createObjectURL(data.drag[i]), controls: true});
			else if (type[0] === "video")
				elem = __HTML("video", {src: URL.createObjectURL(data.drag[i]), controls: true});
			else if (type[0] === "image")
				elem = __HTML("img", {src: URL.createObjectURL(data.drag[i]), alt: data.drag[i].name});
			else
				elem = __HTML("iframe", {src: URL.createObjectURL(data.drag[i])});
			if (data.effect === "move" || data.effect === "link")
				data.drop.appendChild(elem);
			else {
				data.drop.innerHTML = "";
				data.drop.appendChild(elem);
			}
		}
		return;
	},
	/**. '{void attach(node drop, string effect, function call)}: Vinculao um elemento de soltura para receber arquivos arrastados:
	|Argumento|Descrição|
	|'{drop}|Elemento a receber o arrasto de arquivos|
	|'{effect}|Efeito do arrasto aplicado ao elemento|
	|'{call}|Função opcional a ser chamada durante o procedimento|
	|""Tabela de argumentos do método""|
**/
	attach: function(drop, effect, call) {
		if (!(drop instanceof HTMLElement)) return;
		effect  = (/^(copy|link|move)$/i).test(effect) ? effect.toLowerCase() : "link";
		/*-- efetuar registros necessários --*/
		const data = {
			attr:  __HEAP.getAttr(drop),
			drop:   drop,
			effect: effect,
			call:   typeof call === "function" ? call : this.dragging,
		};
		__HEAP.attach(drop, data, this);
		this.drops.push(drop);
		/*-- anexando eventos --*/
		if (this.drops.length === 1) {
			window.addEventListener("dragenter", this);
			window.addEventListener("dragleave", this);
			window.addEventListener("dragend",   this);
		}
		return;
	},
	/**. '{void detach(node drop)}: Desvincula o elemento para receber a soltura de arquivos.**/
	detach: function(drop) {
		if (__HEAP.data(drop) === null) return;
		const data = __HEAP.data(drop);
		this.drops = this.drops.filter(function(v,i,a) {return v !== drop;});
		if (this.drops.length === 0) {
			window.removeEventListener("dragenter", this);
			window.removeEventListener("dragleave", this);
			window.removeEventListener("dragend",   this);
		}
		__HTML(drop, {removeEventListener: {dragenter: this, dragleave: this, dragover: this, drop: this}});
		return;
	},
	/**. '{void dragenter(object ev)}: Manipulador ao entrar com arquivos na janela i{window} ou sobre o elemento de soltura.**/
	dragenter: function(ev) {
		const drop = this.drops.length === 0 ? null : ev.currentTarget;
		const data = __HEAP.data(drop);
		/*-- arquivos entraram no window --*/
		if (drop === window && ev.relatedTarget === null) {
			this.drops.forEach(function(drop,i,a) {
				const data = __HEAP.data(drop);
				if (data !== null) {
					__HTML(drop, {addEventListener: {dragenter: this, dragleave: this, dragover: this, drop: this}});
					data.call({event: "dragstart", drag: null, drop: drop, over: null, effect: data.effect, x: ev.clientX, y: ev.clientY});
				}
			}, this);
			//ev.stopPropagation();
			return;
		}
		/*-- arquivos entraram no drop --*/
		if (data !== null && !drop.contains(ev.relatedTarget)) {
			data.call({event: ev.type, drag: null, drop: drop, over: null, effect: data.effect, x: ev.clientX, y: ev.clientY});
			ev.stopPropagation();
			return;
		}
		return;
	},
	/**. '{void dragleave(object ev)}: Manipulador ao sair com arquivos da janela i{window} ou sobre o elemento de soltura.**/
	dragleave: function(ev) {console.log(ev)
		const drop = this.drops.length === 0 ? null : ev.currentTarget;
		const data = __HEAP.data(drop);
		/*-- arquivos saíram de window --*/
		if (drop === window && ev.relatedTarget === null) {
			this.drops.forEach(function(drop,i,a) {
				const data = __HEAP.data(drop);
				if (data !== null) {
					__HTML(drop, {removeEventListener: {dragenter: this, dragleave: this, dragover: this, drop: this}});
					data.call({event: "dragend", drag: null, drop: drop, over: null, effect: data.effect, x: ev.clientX, y: ev.clientY});
				}
			}, this);
			return;
		}
		/*-- arquivos saíram no drop --*/
		if (data !== null && !drop.contains(ev.relatedTarget)) {
			data.call({event: ev.type, drag: null, drop: drop, over: null, effect: data.effect, x: ev.clientX, y: ev.clientY});
			//ev.stopPropagation();
			return;
		}
		return;
	},
	/**. '{void dragover(object ev)}: Manipulador ao navegar os arquivos sobre o elemento de queda.**/
	dragover: function(ev) {
		const drop = this.drops.length === 0 ? null : ev.currentTarget;
		const data = __HEAP.data(drop);
		if (data !== null) {
			ev.preventDefault();
			ev.stopPropagation();
			ev.dataTransfer.dropEffect = data.effect;
			data.call({event: ev.type, drag: null, drop: drop, over: ev.target, effect: data.effect, x: ev.clientX, y: ev.clientY});
		}
		return;
	},
	/**. '{void drop(object ev)}: Manipulador ao soltar o arquivo sobre o elemento de soltura.**/
	drop: function(ev) {
		const drop = this.drops.length === 0 ? null : ev.currentTarget;
		const data = __HEAP.data(drop);
		if (data !== null) {
			ev.preventDefault();
			ev.stopPropagation();
			const files = ev.dataTransfer.files;
			data.call({event: ev.type, drag: files, drop: drop, over: ev.target, effect: data.effect, x: ev.clientX, y: ev.clientY});
			/*-- marcar como encerrado --*/
			this.drops.forEach(function(drop,i,a) {
				const data = __HEAP.data(drop);
				if (data !== null) {
					__HTML(drop, {removeEventListener: {dragenter: this, dragleave: this, dragover: this, drop: this}});
					data.call({event: "dragend", drag: null, drop: drop, over: null, effect: data.effect, x: ev.clientX, y: ev.clientY});
				}
			}, this);
		}
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador de manipulação chamado durante o procedimento.**/
	handleEvent: function(ev) {
		return ev.type in this ? this[ev.type](ev) : undefined;
	},
};