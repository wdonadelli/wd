const WDDATASET = {
	/**. '{object data}: Registra os dados utilizados pelos valores dos atributos HTML da biblioteca.**/
	data: {},
	/**. '{void attach(string name, any data)}: Vincula os valores dos atributos HTML da biblioteca a um identificador:
	|Argumento|Descrição|
	|'{name}|Identificador a ser utilizado como valor dos atributos HTML|
	|'{data}|Valor que determina a configuração do atributo  HTML|**/
	attach: function(name, data) {this.data[name] = data;},
	/**. '{object attr(string value)}: Retorna o valor do atributo anexado a '{data} ou conforme nomenclatura específica (ver '{__DOCODE.attr}), caso contrário, nulo.**/
	attr: function(value) {
		const data = typeof this.data[value] === "function" ? this.data[value]() : this.data[value];
		const text = __DOCODE.attr(value);
		return typeof data === "object" && data !== null ? data : (text.find !== "" ? text.json : null);
	},

	/**. '{void wdreload(object ev)}: Busca os atributos HTML da biblioteca durante o carregamento da página e de elementos.**/
	wdreload: function(ev) {console.log("wdreload() chamado");
		const root = ev.target instanceof HTMLElement ? ev.target : document;
		for (let name in this) {
			if (!(/^wd[A-Z]/).test(name)) continue;
			let event = new CustomEvent("wddataset", {detail: name, bubbles: true});
			let query = root.querySelectorAll(`[data-${__STRING.case(name, "kebab")}]`);
			for (let i = 0; i < query.length; i++)
				query[i].dispatchEvent(event);
		}
		return;
	},
	/**. '{void wdMenu(object ev)}: Define um menu suspenso:
	|Nome|Tipo|Opcional|Descrição|
	|'{list}|Array|Não|Ver objeto '{__MENU}|
	|'{call}|Function|Sim|Ver objeto '{__MENU}|
	|""Tabela de configuração do atributo wdMenu""|**/
	wdMenu: function(ev) {
		const data = this.attr(ev.target.dataset.wdMenu);
		delete ev.target.dataset.wdMenu;
		if (data) __MENU.attach(ev.target, data.list, data.call);
		return;
	},
	/**. '{void wdLoad(object ev)}: Carrega um conteúdo externo:
	|Nome|Tipo|Opcional|Descrição|
	|'{outer}|boolean|Sim|Ver '{replace} em '{__LOADER}|
	|Demais propriedades|Any|Não|Ver objeto '{__REQUEST}|
	|""Tabela de configuração do atributo wdLoad""|**/
	wdLoad: function(ev) {
		const data = this.attr(ev.target.dataset.wdLoad);
		delete ev.target.dataset.wdLoad;
		if (data) __LOADER.urlHTML(ev.target, data.source, data.outer);
		return;
	},
	/**. '{void wdRepeat(object ev)}: Cria elementos filhos a partir de um modelo conforme especificado em um arquivo externo:
	|Nome|Tipo|Opcional|Descrição|
	|'{model}|string|Sim|Ver '{__LOADER}|
	|Demais propriedades|Any|Não|Ver objeto '{__REQUEST}|
	|""Tabela de configuração do atributo wdLoad""|**/
	wdRepeat: function(ev) {
		const data = this.attr(ev.target.dataset.wdRepeat);
		delete ev.target.dataset.wdRepeat;
		if (data) __LOADER.urlRepeat(ev.target, data, data.model);
		return;
	},

	wdTab: function(ev) {
		const data = this.attr(ev.target.dataset.wdTab);
		delete ev.target.dataset.wdTab;
		if (data) __TAB.create(ev.target, data.type === "vertical")
		return;
	},






	handleEvent: function(ev) {
		if (ev.type === "load" || ev.type === "wdreload")
			return this.wdreload(ev);
		if (ev.type === "wddataset" && ev.detail in this)
			return this[ev.detail](ev);
	},
};
/*-- eventos da biblioteca --*/
window.addEventListener("load", __CSS);
document.addEventListener("wddataset", WDDATASET);
document.addEventListener("wdreload",  WDDATASET);
window.addEventListener("load",        WDDATASET);
window.addEventListener("resize", __DEVICE);
window.addEventListener("load",   __DEVICE);
window.addEventListener("resize",     __HASH);
window.addEventListener("hashchange", __HASH);
window.addEventListener("wdreload",   __HASH);
window.addEventListener("load",       __HASH);