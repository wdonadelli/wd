/**
#3 Arrasto de Elementos
O objeto '{__DRAG} define elemento de arrasto, de soltura e o respectivo comportamento.
**/
const __DRAG = {
	/**. '{object data}: Guarda as informações sobre o arrasto.**/
	data: {},
	/**. '{node fake}: Registra o container falso que indica a posição da queda.**/
	fake: document.createElement("div"),
	/**. '{node color}: Define as cores para identificar o effeito do arrasto (, ).**/
	color: {
		move: {line: "rgb( 34, 139,  34)", back: "rgba( 34, 139,  34, 0.3)", name: "ForestGreen"},
		copy: {line: "rgb(147, 112, 219)", back: "rgba(147, 112, 219, 0.3)", name: "MediumPurple"},
		link: {line: "rgb( 30, 144, 255)", back: "rgba( 30, 144, 255, 0.3)", name: "DodgerBlue"},
	},
	/**. '{void attach(node drag, node drop, string effect, function call)}: Vincula um elemento de arrasto ao de queda:
	|Propriedade|Descrição|
	|drag|Elemento a ser arrastado|
	|drop|Elemento recebedor do arrasto|
	|effect|Tipo do efeito: "copy", "move" ou "link"|
	|call|Função opcional a ser chamada após a queda do elemento|
	. A propriedade '{call} receberá como argumentos:
	- o elemento arrastado;
	- o elemento de queda; e
	- o efeito aplicado.**/
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
				__MOVE.temp(drop, {outline: {"*": `medium dashed ${this.color[effect].line}`}});
				drop.addEventListener("dragover", this);
				drop.addEventListener("dragleave", this);
				drop.addEventListener("drop", this);
				fire = true;
			}
		}
		if (fire) {
			drag.addEventListener("dragend", this);
			this.fake = drag.cloneNode(true);
			this.fake.id = __ID.value;
		}
		return;
	},
	/**. '{void dragend(object ev)}: Manipulador que encerra o arrasto.**/
	dragend: function(ev) {
		const drag = ev.target;
		drag.removeEventListener("dragend", this);
		this.fake.remove();
		for (let i in this.data[drag.id]) {
			let drop = document.getElementById(i);
			__MOVE.temp(drop);
			drop.removeEventListener("dragover", this);
			drop.removeEventListener("dragleave", this);
			drop.removeEventListener("drop", this);
		}
		return;
	},
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
		/*-- posicionar pelo filho --*/
		if (ev.target === drop) return;
		while (child.parentElement !== drop)
			child = child.parentElement;
		__MOVE.temp(child, {display: {inline: "inline-block"}});
		const size = __MOVE.size(child);
		const flow = ev.offsetY >= size.height * (1 - ev.offsetX/size.width);
		const bros = flow ? child.nextElementSibling : child.previousElementSibling;
		if (flow && bros === null)
			drop.appendChild(this.fake);
		else if (flow && bros !== this.fake)
			drop.insertBefore(this.fake, bros);
		else if (!flow && bros !== this.fake)
			drop.insertBefore(this.fake, child);
		__MOVE.temp(child);
		return;
	},
	/**. '{void dragover(object ev)}: Manipulador ao navegar o drag sobre o drop.**/
	dragover: function(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		const drag = document.getElementById(ev.dataTransfer.getData("text"));
		const drop = ev.currentTarget;
		const icon = {copy: "1F5B6", move: "1F588", link: "1F587"};
		const data = this.data[drag.id][drop.id];
		ev.dataTransfer.dropEffect = data.effect;
		__ICON.background(this.fake, icon[data.effect], "1.5em", "50% 50%");
		__MOVE.temp(this.fake, {backgroundColor: {"*": this.color[data.effect].back}});
		this.appendFake(ev);
		return;
	},
	/**. '{void dragleave(object ev)}: Manipulador ao tirar o drag sobre o drop.**/
	dragleave: function(ev) {
		if (!ev.currentTarget.contains(ev.relatedTarget))
			this.fake.remove();
		return;
	},
	/**. '{void drop(object ev)}: Manipulador ao soltar o drag sobre o drop.**/
	drop: function(ev) {
		const drag = document.getElementById(ev.dataTransfer.getData("text"));
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
			drop.insertBefore(link, this.fake);
		}
		this.fake.remove();
		if (typeof data.call === "function")
			data.call(drag, drop, data.effect);
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador de manipulação chamado durante os eventos '{dragstart}, '{dragend}, '{dragover}, '{dragleave} e '{drop}.**/
	handleEvent: function(ev) {
	return this[ev.type](ev);
	},
};