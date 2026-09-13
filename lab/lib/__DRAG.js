/**
#3 Arrasto de Elementos
	O objeto '{__DRAG} atribuí um mecanismo de arrasto ao elemento e define os respectivos alvos de soltura:
	- apenas um elemento sofrerá o efeito do arrasto por ação;
	- cada elemento arrastável ('{drag}) poderá ser vinculados a vários elementos de queda ('{drop});
	- cada elemento de queda deverá estar vinculado a um efeito;
	- os efeitos possíveis são '{copy}, '{move} ou '{link};
	- é possível vincular uma função a ser chamada durante o evento de queda;
	- se não informada a função de queda, um comportamento simplificado será adotado durante o processo conforme efeito definido;
	- a função de queda receberá um argumento com as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|'{event}|string|Efeito vinculado ao arrasto: '{dragstart}, '{dragenter}, '{dragleave}, '{dragover}, '{drop} ou '{dragend}|
	|'{drag}|node|Elemento de arrasto|
	|'{drop}|node|Elemento de queda|
	|'{over}|node|Alvo do elemento de arrasto ou nulo, se fora dele|
	|'{effect}|string|Efeito vinculado ao elemento de queda|
	|'{x}|integer|Posição horizontal do elemento de arrasto em relação ao i{viewport}|
	|'{y}|integer|Posição vertical do elemento de arrasto em relação ao i{viewport}|
	|""Propriedades recepcionadas pela função disparadora de arraso""|
	Os eventos correspondem às seguintes ocorrências:
	. '{dragstart}: Iniciado o arrasto do elemento. A função será disparada para cada elemento de queda. A propriedade '{over} será nula.
	. '{dragenter}: O elemento de arrasto entra no elemento de queda. A função será disparada apenas para o elemento de queda específico. A propriedade '{over} será nula.
	. '{dragleave}: O elemento de arrasto sai do elemento de queda. A função será disparada apenas para o elemento de queda específico. A propriedade '{over} será nula.
	. '{dragover}: O elemento de arrasto está sobre o elemento de queda. A função será disparada apenas para o elemento de queda específico. A propriedade '{over} corresponderá ao elemento sobre o qual paira o elemento de arrasto.
	. '{drop}: O elemento de arrasto caiu sobre o elemento de queda. A função será disparada apenas para o elemento de queda específico. A propriedade '{over} corresponderá ao elemento sobre o qual o elemento de arrasto caiu.
	. '{dragend}: Encerrado o procedimento. A função será disparada para cada elemento de queda. A propriedade '{over} será nula.
	#4 Métodos e Propriedades
	**/
const __DRAG = {
	/**. '{node grab}: Registra o elemento arrastado porque no Chromium não carrega '{dataTransfer} do drag no drop.**/
	grab: null,
	/**. '{void dragging(object data)}: Função de arrasto padrão quando não informada em '{attach}.**/
	dragging: function(data) {
		console.log(data);//FIXME
		/*-- apagar css de posicionamento --*/
		const list = document.querySelectorAll(".css-js-wd-drag-over, .css-js-wd-drag-over-start, .css-js-wd-drag-over-end");
		for (let i = 0; i < list.length; i++)
			__HTML(list[i], {classList: {remove: "css-js-wd-drag-over css-js-wd-drag-over-start css-js-wd-drag-over-end"}});
		/*-- analisar eventos --*/
		if (data.event === "dragstart")
			return __HTML(data.drop, {classList: {add: `css-js-wd-drag-${data.effect}`}});
		if (data.event === "dragend")
			return __HTML(data.drop, {classList: {remove: `css-js-wd-drag-${data.effect} css-js-wd-drag-enter`}});
		if (data.event === "dragenter")
			return __HTML(data.drop, {classList: {add: "css-js-wd-drag-enter"}});
		if (data.event === "dragleave")
			return __HTML(data.drop, {classList: {remove: "css-js-wd-drag-enter"}});
		/*-- obter posição do mouse sobre o filho de drop para os eventos dragover e drop --*/
		if (data.over === null) return;
		let target = data.over;
		if (target !== data.drop) {
			while(target.parentElement !== data.drop)
				target = target.parentElement;
		}
		const rect = target.getBoundingClientRect();
		const vect = {x: data.x - rect.left, y: data.y - rect.top};
		const down = vect.y >= rect.height * (1 - vect.x/rect.width);
		const flow = target === data.drop ? 0 : (down ? 1 : -1);
		if (data.event === "dragover") {
			const css = flow === 0 ? "" : (flow > 0 ? "-end" : "-start");
			__HTML(target, {classList: {add: `css-js-wd-drag-over${css}`}});
			return;
		}
		if (data.event === "drop") {
			const next = target.nextElementSibling;
			const elem = {
				copy: __HTML(data.drag.cloneNode(true), {removeAttribute: ["draggable", "id"]}),
				move: data.drag,
				link: __HTML("a", {href: "#"+__ID.id(data.drag), innerHTML: "&#x1F517;", "aria-labelledby": __ID.id(data.drag)}),
			}[data.effect];
			if (flow === 0 || (flow > 0 && next === null))
				data.drop.appendChild(elem);
			else
				target.parentElement.insertBefore(elem, flow > 0 ? next : target);
			return;
		}
		return;
	},
	/**. '{void attach(node drag, object drop, function call)}: Vincula um elemento de arrasto a um ou mais elementos de queda vinculados a um efeito específico:
	|Propriedade|Descrição|
	|'{drag}|Elemento de arrasto|
	|'{drop}|Objeto que vincula o efeito ao elemento de queda|
	|'{call}|Função opcional a ser chamada durante o procedimento|
	|""Tabela de argumentos do método""|
	. Os nomes aplicados ao objeto '{drop} (efeitos) são '{copy}, '{move} ou '{link} e seus valores são o elemento ou a lista de elementos de queda. Se o mesmo elemento de queda for atribuído a diferentes efeitos, apenas uma informação prevalecerá. Alguns navegadores podem apresentar problemas com o efeito '{link} (Chromium).**/
	attach: function(drag, drop, call) {
		if (!(drag instanceof HTMLElement) || !__Type(drop).object) return;
		const data = {
			attr:  __HEAP.getAttr(drag, "draggable"),
			drag: drag,
			drop: null,
			call: typeof call === "function" ? call : this.dragging,
		};
		/*-- vinculando os nós aos efeitos --*/
		let list, test, drops = [];
		for (let e in drop) {
			test = new __Type(drop[e]);
			if ((/^(copy|link|move)$/).test(e) && test.node) {
				list = test.value.filter(function(v,i,a) {return drops.indexOf(v) < 0;});
				if (list.length > 0) {
					if (data.drop === null) data.drop = {};
					data.drop[e] = list;
					drops = drops.concat(list);
				}
			}
		}
		/*-- anexando e preparando elemento se existir quedas --*/
		if (data.drop !== null) {
			__HEAP.attach(drag, data, this);
			__HTML(drag, {draggable: true, addEventListener: {dragstart: this, dragend: this}});
		}
		return;
	},
	/**. '{void detach(node drag)}: Desvincula os efeitos de arrasto do elemento.**/
	detach: function(drag) {
		if (__HEAP.data(drag) === null) return;
		const data = __HEAP.data(drag);
		__HEAP.resetAttr(data.attr);
		__HTML(drag, {removeEventListener: {dragstart: this, dragend: this}});
		return;
	},
	/**. '{string effect(object drop)}: Recebe a informação de '{drop} e retorna o efeito do elemento arrastável.**/
	effect: function(drop) {
		if ("move" in drop && "copy" in drop && "link" in drop)
			return "all";
		if ("move" in drop && "copy" in drop)
			return "copyMove";
		if ("copy" in drop && "link" in drop)
			return "copyLink";
		if ("move" in drop && "link" in drop)
			return "linkMove";
		return "move" in drop ? "move" : ("copy" in drop ? "copy" : ("link" in drop ? "link" : "none"));
	},
	/**. '{string dropEffect(object drop)}: Recebe o elemento de queda e retorna o efeito vinculado ou nulo.**/
	dropEffect: function(drop) {
		const data = __HEAP.data(this.grab);
		if (data !== null) {
			for (let i in data.drop)
				if (data.drop[i].indexOf(drop) >= 0) return i;
		}
		return null;
	},
	/**. '{void dragstart(object ev)}: Manipulador que inicializa o arrasto.**/
	dragstart: function(ev) {
		const drag = ev.currentTarget;
		const data = __HEAP.data(drag);
		const drop = data === null ? null : data.drop;
		if (drop !== null) {
			/*-- dataTransfer não funciona em todos navegadores, utilizar grab para referenciar o elemento arrastável --*/
			this.grab = drag;
			ev.dataTransfer.setData("text", __ID.id(drag));
			ev.dataTransfer.effectAllowed = this.effect(drop);
			/*-- adicionando disparadores aos elementos de queda --*/
			for (let effect in drop) {
				drop[effect].forEach(function(v,i,a) {
					__HTML(v, {addEventListener: {dragover: this, dragenter: this, dragleave: this, drop: this}});
					data.call({event: ev.type, drag: drag, drop: v, over: null, effect: effect, x: ev.clientX, y: ev.clientY})
				}, this);
			}
		}
		return;
	},
	/**. '{void dragend(object ev)}: Manipulador que encerra o arrasto.**/
	dragend: function(ev) {
		const drag = ev.currentTarget;
		const data = __HEAP.data(drag);
		const drop = data === null ? null : data.drop;
		if (drop !== null) {
			this.grab = null;
			/*-- removendo disparadores aos elementos de queda --*/
			for (let effect in drop) {
				drop[effect].forEach(function(v,i,a) {
					__HTML(v, {removeEventListener: {dragover: this, dragenter: this, dragleave: this, drop: this}});
					data.call({event: ev.type, drag: drag, drop: v, over: null, effect: effect, x: ev.clientX, y: ev.clientY});
				}, this);
			}
		}
		return;
	},
	/**. '{void dragenter(object ev)}: Manipulador ao entrar sobre o drop (não carrega dataTransfer no chromium).**/
	dragenter: function(ev) {
		/*-- se o elemento de saída estiver no drop, desprezar evento --*/
		if (ev.currentTarget.contains(ev.relatedTarget)) return;
		const drag = this.grab;
		const data = __HEAP.data(drag);
		const drop = ev.currentTarget;
		const type = this.dropEffect(drop);
		if (data !== null && type !== null) {
			data.call({event: ev.type, drag: drag, drop: drop, over: null, effect: type, x: ev.clientX, y: ev.clientY});
			ev.stopPropagation();
		}
		return;
	},
	/**. '{void dragleave(object ev)}: Manipulador ao tirar o drag sobre o drop (não carrega dataTransfer no chromium).**/
	dragleave: function(ev) {
		/*-- se o elemento de entrada estiver no drop, desprezar evento --*/
		if (ev.currentTarget.contains(ev.relatedTarget)) return;
		const drag = this.grab;
		const data = __HEAP.data(drag);
		const drop = ev.currentTarget;
		const type = this.dropEffect(drop);
		if (data !== null && type !== null) {
			data.call({event: ev.type, drag: drag, drop: drop, over: null, effect: type, x: ev.clientX, y: ev.clientY});
			ev.stopPropagation();
		}
		return;
	},
	/**. '{void dragover(object ev)}: Manipulador ao navegar o drag sobre o drop (não carrega dataTransfer no chromium).**/
	dragover: function(ev) {
		const drag = this.grab;
		const data = __HEAP.data(drag);
		const drop = ev.currentTarget;
		const type = this.dropEffect(drop);
		ev.dataTransfer.dropEffect = type === null ? "none" : type;
		if (!this.grab.contains(ev.target) && data !== null && type !== null) {
			data.call({event: ev.type, drag: drag, drop: drop, over: ev.target, effect: type, x: ev.clientX, y: ev.clientY});
			ev.preventDefault();
			ev.stopPropagation();
		}
		return;
	},
	/**. '{void drop(object ev)}: Manipulador ao soltar o drag sobre o drop.**/
	drop: function(ev) {
		const drag = this.grab;
		const data = __HEAP.data(drag);
		const drop = ev.currentTarget;
		const type = this.dropEffect(drop);
		ev.dataTransfer.dropEffect = type === null ? "none" : type;
		/*-- o elemento de arraste não pode ser jogado dentro dele mesmo */
		if (!this.grab.contains(ev.target) && data !== null && type !== null) {
			ev.preventDefault();
			ev.stopPropagation();
			data.call({event: ev.type, drag: drag, drop: drop, over: ev.target, effect: type, x: ev.clientX, y: ev.clientY});
		}
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador de manipulação chamado durante os eventos '{dragstart}, '{dragend}, '{dragover}, '{dragleave} e '{drop}.**/
	handleEvent: function(ev) {
		return ev.type in this ? this[ev.type](ev) : undefined;
	},
};
__CSS.push(`/*-- DRAG --*/
[draggable]:hover  {cursor: grab;}
[draggable]:active {cursor: grabbing;}
.css-js-wd-drag-copy,
.css-js-wd-drag-move,
.css-js-wd-drag-link {
	min-width: 1em;
	min-height: 1em;
}
.css-js-wd-drag-copy {outline: medium dashed MediumPurple;}
.css-js-wd-drag-move {outline: medium dashed ForestGreen;}
.css-js-wd-drag-link {outline: medium dashed DodgerBlue;}
.css-js-wd-drag-copy.css-js-wd-drag-enter,
.css-js-wd-drag-move.css-js-wd-drag-enter,
.css-js-wd-drag-link.css-js-wd-drag-enter {
	outline-style: solid;
}
.css-js-wd-drag-over-start,
.css-js-wd-drag-over-end,
.css-js-wd-drag-over {
	color: rgba(125,125,125,0.1);
	background-color: white;
	background-size: 0.5em 0.5em;
	background-repeat: no-repeat;
	background-origin: content-box;
}
.css-js-wd-drag-over {
	background-position: 50% 50%;
	background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' ><path d='M 0,50 L 50,0 L 100,50 L 50,100 Z' fill='red'/></svg>");
}
.css-js-wd-drag-over-start {
	background-position: 0 0;
	background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' ><path d='M 0,0 H 100 L 0,100 Z' fill='red'/></svg>");
}
.css-js-wd-drag-over-end {
	background-position: 100% 100%;
	background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' ><path d='M 0,100 H 100 L 100,0 Z' fill='red'/></svg>");
}
`);