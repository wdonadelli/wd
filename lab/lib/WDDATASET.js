const WDDATASET = {
	/**. '{object data}: Registra os dados utilizados pelos valores dos atributos HTML da biblioteca.**/
	data: {},
	/**. '{void attach(string name, any data)}: Vincula os valores dos atributos HTML da biblioteca a um identificador:
	|Argumento|Descrição|
	|'{name}|Identificador a ser utilizado como valor dos atributos HTML|
	|'{data}|Valor que determina a configuração do atributo  HTML|**/
	attach: function(name, data) {this.data[name] = data;},
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
	/**. '{void wdMenu(object ev)}: Define um menu suspenso ():
	|Nome|Tipo|Opcional|Descrição|
	|'{list}|Array|Não|Ver objeto '{__MENU}|
	|'{call}|Function|Sim|Ver objeto '{__MENU}|
	|""Tabela de configuração do atributo wdMenu""|**/
	wdMenu: function(ev) {
		const attr = ev.target.dataset.wdMenu;
		const data = typeof this.data[attr] === "function" ? this.data[attr]() : this.data[attr];
		delete ev.target.dataset.wdMenu;
		if (!data) return;
		__MENU.attach(ev.target, data.list, data.call);
		return;
	},




	wdLoko: function(ev) {
		console.log("loko", ev);

	},




	handleEvent: function(ev) {
		if (ev.type === "load" || ev.type === "wdreload")
			return this.wdreload(ev);
		if (ev.detail in this)
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