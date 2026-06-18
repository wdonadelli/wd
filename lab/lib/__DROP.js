/**
#3 Soltura de arquivos
O objeto '{__DROP} define elemento e o comportamento para soltura de arquivos.
**/
const __DROP = {
	/**. '{object data}: Guarda as informações sobre o elemento de soltura '{DROP.id -> (effect, call)}.**/
	data: {},
	/**. '{boolean hasDrop}: Retorna se há elementos de soltura anexados.**/
	get hasDrop() {
		for (let i in this.data) return true;
		return false;
	},
	/**. '{boolean enable}: Informa se o arrasto já foi implementado durante o dragover.**/
	enabled: false,
	/**. '{void attach(node drop, string effect, function call)}: Habilita o elemento para receber a soltura de arquivos:
	|Argumento|Descrição|
	|drop|Elemento a receber o arrasto de arquivos|
	|effect|Efeito do arrasto.|
	|call|Função a ser chamada na queda dos arquivos|
	. A função '{call} receberá como argumentos a informação dos arquivos arrastados (objeto '{Files}), o elemento de soltura e o efeito aplicado. Se ausente, um comportamento padrão será aplicado:
	|Efeito|Comportamento padrão|
	|link|Adicionará um link para o arquivo no elemento de soltura (padrão).|
	|copy|Copiará o conteúdo do arquivo para o elemento de soltura.|
	|move|Tentará carregar o arquivo no elemento de soltura.|**/
	attach: function(drop, effect, call) {
		drop.id = __ID.id(drop);
		effect  = (/^(copy|link|move)$/i).test(effect) ? String(effect).toLowerCase() : "link";
		this.data[drop.id] = {effect: effect, call: call};
		if (!this.enabled && this.hasDrop) {
			window.addEventListener("dragenter", this);
			this.enabled = true;
		}
		return;
	},
	/**. '{void detach(node drop)}: Desabilita o elemento para receber a soltura de arqvuivos.**/
	detach: function(drop) {
		drop.id = __ID.id(drop);
		if (drop.id in this.data)
			delete this.data[drop.id];
		if (this.enabled && !this.hasDrop) {
			window.removeEventListener("dragenter", this);
			this.enabled = false;
		}
		return;
	},
	/**. '{void dragenter(object ev)}: Manipulador ao entrar com arquivos na janela i{window} ou sobre o elemento de soltura.**/
	dragenter: function(ev) {
		if (ev.currentTarget === window) {
			ev.preventDefault();
			ev.stopPropagation();
			window.removeEventListener("dragenter", this);
			window.addEventListener("dragleave", this);
			for (let i in this.data) {
				let data = this.data[i];
				let drop = document.getElementById(i);
				drop.addEventListener("dragenter", this);
				drop.addEventListener("dragover", this);
				drop.addEventListener("dragleave", this);
				drop.addEventListener("drop", this);
				__DRAG.dropZone(drop, data.effect, "dragstart")
			}
		}
		else {
			const drop = ev.currentTarget;
			__DRAG.dropZone(drop, this.data[drop.id].effect, ev.type)
		}
		return;
	},
	/**. '{void dragleave(object ev)}: Manipulador ao sair com arquivos da janela i{window}.**/
	dragleave: function(ev) {
		if (ev.currentTarget === window) {
			if (ev.relatedTarget === null) {
				window.removeEventListener("dragleave", this);
				window.addEventListener("dragenter", this);
				for (let i in this.data) {
					let data = this.data[i];
					let drop = document.getElementById(i);
					drop.removeEventListener("dragenter", this);
					drop.removeEventListener("dragover", this);
					drop.removeEventListener("dragleave", this);
					drop.removeEventListener("drop", this);
					__DRAG.dropZone(drop);
				}
			}
		}
		else if (ev.relatedTarget === null || !ev.currentTarget.contains(ev.relatedTarget)) {
			const drop = ev.currentTarget;
			__DRAG.dropZone(drop, this.data[drop.id].effect, ev.type);
		}
		return;
	},
	/**. '{void dragover(object ev)}: Manipulador ao navegar os arquivos sobre o elemento de queda.**/
	dragover: function(ev) {
		const drop = ev.currentTarget;
		if (drop !== null && drop.id in this.data) {
			ev.preventDefault();
			ev.stopPropagation();
			ev.dataTransfer.dropEffect = this.data[drop.id].effect;
		}
		return;
	},
	/**. '{void drop(object ev)}: Manipulador ao soltar o arquivo sobre o elemento de soltura.**/
	drop: function(ev) {
		const drop = ev.currentTarget;
		if (drop !== null && drop.id in this.data) {
			ev.preventDefault();
			ev.stopPropagation();
			const data   = this.data[drop.id];
			const effect = ev.dataTransfer.dropEffect;
			const files  = ev.dataTransfer.files;
			/*-- ação personalizada --*/
			if (typeof data.call === "function") {
				data.call(files, drop, effect);
			}
			/*-- ação padrão --*/
			else {
				const attr = {copy: "text", link: "link", move: "frame"};






				//FIXME trocar pelo método de URL e acabar com uso de __FILE
				/*__REQUEST.read({url: files, type: effect === "copy" ? "text": "url", call: function(x) {
					drop.setAttribute("aria-busy", "true");
					if (x.ok) {
						TODO ver método append
					}
					if (x.done) drop.setAttribute("aria-busy", "false");
					return;
				}});*/
			}
			/*-- zerar comportamento --*/
			window.removeEventListener("dragleave", this);
			window.addEventListener("dragenter", this);
			for (let i in this.data) {
				let data = this.data[i];
				let drop = document.getElementById(i);
				drop.removeEventListener("dragenter", this);
				drop.removeEventListener("dragover", this);
				drop.removeEventListener("dragleave", this);
				drop.removeEventListener("drop", this);
				__DRAG.dropZone(drop);
			}
		}
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador de manipulação chamado durante os eventos '{dragstart}, '{dragend}, '{dragover}, '{dragleave} e '{drop}.**/
	handleEvent: function(ev) {return this[ev.type](ev);},

	//TODO eu estava tentando melhorar isso, mas o que esperar quando arrastar e soltar um arquivo na página?
	//FIXME o input.file já faz isso, só não exibe a mídia.
	//FIXME será que não é melhor não fazer nada?
	append: function(file, drop, effect) {
		if (!(file instanceof Blob)) return null;
		const name = "name" in file ? file.name : "blob";
		const type = ("type" in file ? file.type : "application/octet-stream").trim().toLowerCase().split(";")[0];
		const main = type.split("/")[0];
		const href = URL.createObjectURL(file);
		const link = __HTML("a", {href: href, textContent: name, download: name, type: type});
		if (effect === "link") {
			drop.appendChild(link);
			return;
		}
		if (main === "audio") {
			drop.appendChild(__DOM({tag: "audio", attr: {src: href, controls: true}, child: [link]}).tag);
			return;
		}
		if (main === "video") {
			drop.appendChild(__DOM({tag: "video", attr: {src: href, controls: true}, child: [link]}).tag);
			return;
		}
		if (main === "image") {
			drop.appendChild(__DOM({tag: "img", attr: {src: href, alt: name}, child: [link]}).tag);
			return;
		}
		if (main === "text") {
			URL.revokeObjectURL(href);
			__REQUEST.make({url: file, type: "text", call: function(x) {
				if (x.ok && x.result !== null)
					drop.appendChild(__HTML("pre", {innerText: x.result}));
			}});
			return;
		}
		drop.appendChild(__DOM({tag: "iframe", attr: {src: href}, child: [link]}).tag);
		return;
	},


};