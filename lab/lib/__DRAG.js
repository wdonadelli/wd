/**
#3 Arrasto de Elementos
	O objeto '{__DRAG} define ao elemento mecanismo de arrasto e seus respectivos elementos de soltura e o comportamento
	- apenas um elemento sofrerá o efeito do arrasto por ação;
	- cada elemento arrastável ('{drag}) poderá ser vinculados a vários elementos de queda ('{drop});
	- cada elemento de queda deverá estar vinculado a um efeito;
	- os efeitos possíveis são '{copy}, '{move} ou '{link};
	- é possível vincular uma função a ser chamada durante o evento de queda;
	- se não informada a função de queda, um comportamento padrão será adotado conforme efeito vinculado;
	- a função de queda receberá um argumento com as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|'{event}|string|Efeito vinculado ao arrasto: '{dragstart}, '{dragenter}, '{dragleave}, '{dragover}, '{drop} ou '{dragend}|
	|'{drag}|node|Elemento de arrasto|
	|'{drop}|node|Elemento de queda|
	|'{over}|node|Alvo do elemento de arrasto ou nulo, se fora dele|
	|'{effect}|string|Efeito vinculado ao elemento de queda|
	|'{x}|integer|Posição horizontal do elemento de arrasto em relação ao i{viewport}|
	|'{y}|integer|Posição vertical do elemento de arrasto em relação ao i{viewport}|
	- Quando o evento não estiver relacionado ao elemento de queda, as propriedades a partir de '{drop} serão nulas.
**/
//FIXME borda pequena ao acionar o drop e borda grande ao entrar
const __DRAG = {
	/**. '{node fake}: Registra o container falso que indica a posição da queda para o método '{drabbin}.**/
	fake: null,
	/**. '{node grab}: Registra o elemento arrastado porque no Chromium não carrega '{dataTransfer} do drag no drop.**/
	grab: null,






	/**. '{void dragging(object data)}: Função de arrasto padrão quando não informada em '{attach}.**/
	dragging: function(data) {
		console.log(data);
		function clearOver() {
			const list = document.querySelectorAll(".css-js-wd-drag-over-start, .css-js-wd-drag-over-end");
			for (let i = 0; i < list.length; i++)
				__HTML(list[i], {classList: {remove: "css-js-wd-drag-over-start css-js-wd-drag-over-end"}});
			return;
		}
		if (data.event === "dragleave") {
			console.clear();
			console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

		}



		if (data.event === "dragstart") {
			clearOver();
			__HTML(data.drop, {classList: {add: `css-js-wd-drag-${data.effect}`}});
			return;
		}
		if (data.event === "dragend") {
			clearOver();
			__HTML(data.drop, {classList: {remove: `css-js-wd-drag-${data.effect} css-js-wd-drag-enter`}});
			return;
		}
		if (data.event === "dragenter") {
			clearOver();
			__HTML(data.drop, {classList: {add: "css-js-wd-drag-enter"}});
			return;
		}
		if (data.event === "dragleave") {
			clearOver();
			__HTML(data.drop, {classList: {remove: "css-js-wd-drag-enter"}});
			return;
		}
		/*-- obter posição do mouse sobre o filho de drop para os eventos dragover e drop --*/
		if (data.over === null) return;
		let target = data.over;
		if (target !== data.drop) {
			while(target.parentElement !== data.drop)
				target = target.parentElement;
		}
		const rect = target.getBoundingClientRect();
		const vect = {x: data.x - rect.left, y: data.y - rect.top};
		const flow = vect.y >= rect.height * (1 - vect.x/rect.width);




		if (data.event === "dragover") {
			clearOver();
			__HTML(target, {classList: {add: `css-js-wd-drag-over-${flow ? "end" : "start"}`}});
			return;
		}
		if (data.event === "drop") {
			/*if (data.effect === "move")
				data.drop.replaceChild(data.drag, __DRAG.fake);
			if (data.effect === "copy")
				data.drop.replaceChild(data.drag.cloneNode(true), __DRAG.fake);*/
			return;
		}








		/*




				if (data.effect === "copy") {
			const clone = drag.cloneNode(true);
			clone.id = __ID.value;
			drop.insertBefore(clone, this.fake);
		}
		else if (data.effect === "move") {
			drop.insertBefore(drag, this.fake);
		}
		else if (data.effect === "link") {
			__ID.id(drag);
			const text = __TAB.label(drag);
			const link = __HTML("a", {
				href: `#${drag.id}`,
				textContent: text === null ? "Link" : text,
				"aria-describedby": drag.id
			});
			console.log(link);
			drop.insertBefore(link, this.fake);
		}
		/*-- remover fake e chamar o disparador, se existir --* /
		this.makeFake();
		if (typeof data.call === "function")
			data.call(drag, drop, data.effect);
		return;








		*/

	},






	/**. '{void attach(node drag, object drop, function call)}: Vincula um elemento de arrasto a um ou mais elementos de queda vinculados a um efeito específico:
	|Propriedade|Descrição|
	|'{drag}|Elemento de arrasto|
	|'{drop}|Objeto que vincula o efeito ao elemento de queda|
	|'{call}|Função opcional a ser chamada após a queda do elemento|
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








	//TODO apagar toda essa porra
	/**. '{void makeFake(string effect, node fake)}: Define o estilo do elemento falso conforme efeito de soltura:
	- se '{fake} for indefinido, será resgatado o nó da propriedade da biblioteca;
	- se '{fake} for um nó, a propriedade da biblioteca será definido como seu clone; e
	- se '{effect} for diferente de "copy", "move" ou "link", '{fake} será removido do documento.**/
	makeFake: function(effect, fake) {
		if (fake !== undefined) {
			this.fake    = fake.cloneNode(true);
			this.fake.id = __ID.value;
		}
		const icon = {copy: "1F5B6", move: "1F588", link: "1F587"};
		__HTML(this.fake, {style: {backgroundColor: "rgb(248, 248, 255)", opacity: "0.5"}});
		(effect in icon ? __ICON.background(this.fake, icon[effect], "1.5em", "50% 50%") : this.fake.remove());
		return;
	},
	//FIXME pensar melhor nisso aqui, porque o fake está meio estranho
	/**. '{void appendFake(object ev)}: Manipulador que exibe o '{fake} conforme conteúdo de i{drop} .**/
	appendFake: function(ev) {
		const drop = ev.currentTarget;
		let  child = ev.target;
		/*-- o alvo é o fake: não fazer nada --*/
		if (child.contains(this.fake)) return;
		/*-- drop sem filhos: adicionar fake ao container --*/
		if (drop.childElementCount === 0) {
			drop.appendChild(this.fake);
			return;
		}
		/*-- posicionar fake antes ou após o filho do alvo a depender da posição do mouse sobre o elemento --*/
		if (ev.target === drop) return;
		while (child.parentElement !== drop)
			child = child.parentElement;
		__CSS.temp(child, {display: {inline: "inline-block"}});
		const size = __MOVE.size(child);
		const flow = ev.offsetY >= size.height * (1 - ev.offsetX/size.width);
		const bros = flow ? child.nextElementSibling : child.previousElementSibling;
		if (flow && bros === null)
			drop.appendChild(this.fake);
		else if (flow && bros !== this.fake)
			drop.insertBefore(this.fake, bros);
		else if (!flow && bros !== this.fake)
			drop.insertBefore(this.fake, child);
		__CSS.temp(child);
		return;
	},
	/**. '{object color}: Registra uma cor para cada efeito de soltura.**/
	color: {move: "ForestGreen", copy: "MediumPurple", link: "DodgerBlue"},
	/**. '{void dropZone(node drop, string effect, string event)}: Define o comportamento do estilo do elemento de soltura a depender do evento e do efeito. Se '{effect} for diferente de "copy", "move" ou "link" ou '{event} for diferente de "dragstart", "dragleave", "dragover" ou "dragenter", a configuração será removida do elemento de solutura.**/
	dropZone: function(drop, effect, event) {
		__CSS.temp(drop);
		const line = {move: "ForestGreen", copy: "MediumPurple", link: "DodgerBlue"};
		const temp = {minWidth: {"*": "1em"}, minHeight: {"*": "1em"}, display: {inline: "inline-block"}};
		if (effect in this.color) {
			if (event === "dragstart" || event === "dragleave")
				temp.outline = {"*": `medium dashed ${this.color[effect]}`};
			else if (event === "dragover" || event === "dragenter")
				temp.outline = {"*": `medium solid  ${this.color[effect]}`};
			if ("outline" in temp)
				__CSS.temp(drop, temp);
		}
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
		if (data !== null && type !== null)
			data.call({event: ev.type, drag: drag, drop: drop, over: drop, effect: type, x: ev.clientX, y: ev.clientY});
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
		if (data !== null && type !== null)
			data.call({event: ev.type, drag: drag, drop: drop, over: null, effect: type, x: ev.clientX, y: ev.clientY});
		return;
	},
	/**. '{void dragover(object ev)}: Manipulador ao navegar o drag sobre o drop (não carrega dataTransfer no chromium).**/
	dragover: function(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		/*-- registrar efeito de arrasto --*/
		const drag = this.grab;
		const data = __HEAP.data(drag);
		const drop = ev.currentTarget;
		const type = this.dropEffect(drop);
		ev.dataTransfer.dropEffect = type === null ? "none" : type;
		if (!this.grab.contains(ev.target) && data !== null && type !== null)
			data.call({event: ev.type, drag: drag, drop: drop, over: ev.target, effect: type, x: ev.clientX, y: ev.clientY});
		return;
	},
	/**. '{void drop(object ev)}: Manipulador ao soltar o drag sobre o drop.**/
	drop: function(ev) {
		const drag = this.grab;
		const data = __HEAP.data(drag);
		const drop = ev.currentTarget;
		const type = this.dropEffect(drop);
		ev.dataTransfer.dropEffect = type === null ? "none" : type;
		if (!this.grab.contains(ev.target) && data !== null && type !== null)
			data.call({event: ev.type, drag: drag, drop: drop, over: ev.target, effect: type, x: ev.clientX, y: ev.clientY});
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador de manipulação chamado durante os eventos '{dragstart}, '{dragend}, '{dragover}, '{dragleave} e '{drop}.**/
	handleEvent: function(ev) {
		if (ev.type in this) this[ev.type](ev);
		return;
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
.css-js-wd-drag-over-end {
	color: rgba(125,125,125,0.2);
}

.css-js-wd-drag-over-start {
	background-size: auto auto;
	background-repeat: no-repeat;
	background-position: 0 0;
	background-origin: content-box;
	background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(0)' opacity='1' height='1em' width='1em' style='background-color: inherit;'><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-family='monospace' font-size='1em'>↖️</text></svg>");
}
.css-js-wd-drag-over-end {
	background-size: auto auto;
	background-repeat: no-repeat;
	background-position: 100% 100%;
	background-origin: content-box;
	background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(0)' opacity='1' height='1em' width='1em' style='background-color: inherit;'><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-family='monospace' font-size='1em'>↘️</text></svg>");
}

.css-js-wd-drag-link.css-js-wd-drag-over-start,
.css-js-wd-drag-link.css-js-wd-drag-over-end,
.css-js-wd-drag-link .css-js-wd-drag-over-start,
.css-js-wd-drag-link .css-js-wd-drag-over-end{
	border-color: inherit;

}
`);