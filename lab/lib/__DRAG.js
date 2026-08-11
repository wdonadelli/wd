/**
#3 Arrasto de Elementos
O objeto '{__DRAG} define elemento de arrasto, de soltura e o respectivo comportamento.
**/
//FIXME borda pequena ao acionar o drop e borda grande ao entrar
const __DRAG = {
	/**. '{object data}: Guarda as informações sobre o arrasto '{DRAG.id -> DROP.id -> (effect, call)}**/
	data: {},
	/**. '{node fake}: Registra o container falso que indica a posição da queda.**/
	fake: document.createElement("div"),
	/**. '{node grab}: Registra o elemento arrastado porque no Chromium não carrega '{dataTransfer} do drag no drop.**/
	grab: null,
	/**. '{void attach(node drag, node drop, string effect, function call)}: Vincula um elemento de arrasto ao de queda:
	|Propriedade|Descrição|
	|drag|Elemento a ser arrastado|
	|drop|Elemento recebedor do arrasto|
	|effect|Tipo do efeito: "copy", "move" ou "link"|
	|call|Função opcional a ser chamada após a queda do elemento|
	. A propriedade '{call} receberá como argumentos:
	- o elemento arrastado;
	- o elemento de queda; e
	- o efeito aplicado.
	. strong{Importante!} Alguns navegadores podem apresentar problemas com o efeito "link" (Chromium).**/
	attach: function(drag, drop, effect, call) {
		drag.id = __ID.id(drag);
		drop.id = __ID.id(drop);
		effect  = (/^(copy|link|move)$/i).test(effect) ? String(effect).toLowerCase() : "move";
		/*-- adicionar dados --*/
		if (!(drag.id in this.data)) {
			this.data[drag.id] = {};
			drag.draggable = true;
			drag.addEventListener("dragstart", this);
		}
		this.data[drag.id][drop.id] = {effect: effect, call: call};
		return;
	},
	/**. '{void detach(node drag, node drop)}: Desvincula o elemento de arrasto ao de queda, se '{drop} for informado, ou remove o arrasto de '{drag}.**/
	detach: function(drag, drop) {
		if (drag.id in this.data) {
			if (drop === null || drop === undefined) {
				drag.draggable = false;
				drag.removeEventListener("dragstart", this);
				delete this.data[drag.id];
			}
			else if (drop.id in this.data[drag.id]) {
				delete this.data[drag.id][drop.id];
			}
		}
		return;
	},
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
	/**. '{string effect(string id)}: Retorna o efeito do elemento arrastável a partir de seu '{id}.**/
	effect: function(id) {
		const info = {move: false, link: false, copy: false};
		if (id in this.data)
			for (let i in this.data[id])
				info[this.data[id][i].effect] = true;
		if (info.move && info.copy && info.link)
			return "all";
		if (info.move && info.copy)
			return "copyMove";
		if (info.copy && info.link)
			return "copyLink";
		if (info.move && info.link)
			return "linkMove";
		return info.move ? "move" : (info.copy ? "copy" : (info.link ? "link" : "none"));
	},
	/**. '{void dragstart(object ev)}: Manipulador que inicializa o arrasto.**/
	dragstart: function(ev) {
		const drag = ev.target;
		let   fire = false;
		ev.dataTransfer.setData("text", drag.id);
		ev.dataTransfer.effectAllowed = this.effect(drag.id);
		/*-- configurando drops --*/
		for (let i in this.data[drag.id]) {
			let drop = document.getElementById(i);
			if (!drag.contains(drop)) {
				let effect = this.data[drag.id][i].effect;
				drop.addEventListener("dragover", this);
				drop.addEventListener("dragenter", this);
				drop.addEventListener("dragleave", this);
				drop.addEventListener("drop", this);
				this.dropZone(drop, effect, ev.type);
				fire = true;
			}
		}
		if (fire) {
			this.grab = drag;
			drag.addEventListener("dragend", this);
			this.makeFake(null, drag);
		}
		return;
	},
	/**. '{void dragend(object ev)}: Manipulador que encerra o arrasto.**/
	dragend: function(ev) {
		const drag = ev.target;
		drag.removeEventListener("dragend", this);
		this.makeFake();
		this.grab = null;
		for (let i in this.data[drag.id]) {
			let drop   = document.getElementById(i);
			drop.removeEventListener("dragover", this);
			drop.removeEventListener("dragenter", this);
			drop.removeEventListener("dragleave", this);
			drop.removeEventListener("drop", this);
			this.dropZone(drop);
		}
		return;
	},
	/**. '{void dragenter(object ev)}: Manipulador ao entrar sobre o drop (não carrega dataTransfer no chromium).**/
	dragenter: function(ev) {
		const drag = this.grab;
		const drop = ev.currentTarget;
		const data = this.data[drag.id][drop.id];
		this.dropZone(drop, data.effect, ev.type);
		return;
	},
	/**. '{void dragover(object ev)}: Manipulador ao navegar o drag sobre o drop (não carrega dataTransfer no chromium).**/
	dragover: function(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		const drag = this.grab;
		const drop = ev.currentTarget;
		const data = this.data[drag.id][drop.id];
		ev.dataTransfer.dropEffect = data.effect;
		this.makeFake(data.effect);
		this.appendFake(ev);
		return;
	},
	/**. '{void dragleave(object ev)}: Manipulador ao tirar o drag sobre o drop (não carrega dataTransfer no chromium).**/
	dragleave: function(ev) {
		if (!ev.currentTarget.contains(ev.relatedTarget)) {
			const drag = this.grab;
			const drop = ev.currentTarget;
			const data = this.data[drag.id][drop.id];
			this.makeFake();
			this.dropZone(drop, data.effect, ev.type)
		}
		return;
	},
	/**. '{void drop(object ev)}: Manipulador ao soltar o drag sobre o drop.**/
	drop: function(ev) {
		const drag = this.grab;
		const drop = ev.currentTarget;
		const data = this.data[drag.id][drop.id];
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
		/*-- remover fake e chamar o disparador, se existir --*/
		this.makeFake();
		if (typeof data.call === "function")
			data.call(drag, drop, data.effect);
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador de manipulação chamado durante os eventos '{dragstart}, '{dragend}, '{dragover}, '{dragleave} e '{drop}.**/
	handleEvent: function(ev) {
		return this[ev.type](ev);
	},
};
__CSS.push(`/*-- DRAG --*/
[draggable]:hover  {cursor: grab;}
[draggable]:active {cursor: grabbing;}
`);