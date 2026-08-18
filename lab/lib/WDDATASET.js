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
	/**. '{object onload(object ev)}: Define os procedimentos durante o evento '{load} (documento).**/
	onload: function(ev) {
		for (let name in this) {
			if (!(/^wd[A-Z]/).test(name)) continue;
			let event = new CustomEvent("wddataset", {detail: name, bubbles: true});
			let find  = `[data-${__STRING.case(name, "kebab")}]`;
			let query = Array.from(document.querySelectorAll(find));
			query.forEach(function(v,i,a) {query[i].dispatchEvent(event);}, this);
		}
		return;
	},
	/**. '{object onwdreload(object ev)}: Define os procedimentos durante o evento '{wdreload} (alvo e descendentes).**/
	onwdreload: function(ev) {
		for (let name in this) {
			if (!(/^wd[A-Z]/).test(name)) continue;
			let event = new CustomEvent("wddataset", {detail: name, bubbles: true});
			let find  = `[data-${__STRING.case(name, "kebab")}]`;
			let query = [ev.target].concat(Array.from(ev.target.querySelectorAll(find)));
			query.forEach(function(v,i,a) {query[i].dispatchEvent(event);}, this);
		}
		return;
	},
	/**. '{object onwddataset(object ev)}: Define os procedimentos durante o evento '{wddataset} (alvo).**/
	onwddataset: function(ev) {
		if (ev.detail in this && ev.detail in ev.target.dataset)
			this[ev.detail](ev);
		return;
	},
	/**. '{object onresize(object ev)}: Define os procedimentos durante o evento '{resize} (documento).**/
	onresize: function(ev) {
		const tool = {
			wdDevice: __DEVICE.changeDevice,
		};
		for (let name in tool) {
			if (!tool[name]) continue;
			let event = new CustomEvent("wddataset", {detail: name, bubbles: true});
			let find  = `[data-${__STRING.case(name, "kebab")}]`;
			let query = Array.from(document.querySelectorAll(find));
			query.forEach(function(v,i,a) {query[i].dispatchEvent(event);}, this);
		}
		return;
	},
	/**. '{object onclick(object ev)}: Define os procedimentos durante o evento '{click} (alvo).**/
	onclick: function(ev) {//FIXME
		const tool = {
			//wdDevice: __DEVICE.changeDevice,
		};
		for (let name in tool) {
			if (!tool[name]) continue;
			let event = new CustomEvent("wddataset", {detail: name, bubbles: true});
			let find  = `[data-${__STRING.case(name, "kebab")}]`;
			let query = Array.from(document.querySelectorAll(find));
			query.forEach(function(v,i,a) {query[i].dispatchEvent(event);}, this);
		}
		return;
	},
	/**. '{object onfocusout(object ev)}: Define os procedimentos durante o evento '{focusout} (alvo).**/
	onfocusout: function(ev) {
		const tool = {
			wdMask: "wdMask" in ev.target.dataset && __FORMDATA.freeEdit(ev.target),
		};
		for (let name in tool) {
			if (!tool[name]) continue;
			let event = new CustomEvent("wddataset", {detail: name, bubbles: true});
			ev.target.dispatchEvent(event);
		}
		return;
	},
	/**. '{object oninput(object ev)}: Define os procedimentos durante o evento '{input} (alvo).**/
	oninput: function(ev) {
		const tool = {
			wdFilter: "wdFilter" in ev.target.dataset,
		};
		for (let name in tool) {
			if (!tool[name]) continue;
			let event = new CustomEvent("wddataset", {detail: name, bubbles: true});
			ev.target.dispatchEvent(event);
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
		const data = this.attr(ev.target.dataset.wdLoad);console.log(data)
		delete ev.target.dataset.wdLoad;
		if (data) __LOADER.urlHTML(ev.target, data, data.outer);
		return;
	},
	/**. '{void wdRepeat(object ev)}: Cria elementos filhos a partir de um modelo conforme especificado em um arquivo externo:
	|Nome|Tipo|Opcional|Descrição|
	|'{model}|string|Sim|Ver '{__LOADER}|
	|Demais propriedades|Any|Não|Ver objeto '{__REQUEST}|
	|""Tabela de configuração do atributo wdRepeat""|**/
	wdRepeat: function(ev) {
		const data = this.attr(ev.target.dataset.wdRepeat);
		delete ev.target.dataset.wdRepeat;
		if (data) __LOADER.urlRepeat(ev.target, data, data.model);
		return;
	},
	/**. '{void wdTab(object ev)}: Transforma o elemento num conjunto de paineis controlados por abas:
	|Nome|Tipo|Opcional|Descrição|
	|'{orientation}|string|Não|Disposição das abas: '{horizontal} (padrão) ou '{vertical}|
	|""Tabela de configuração do atributo wdTab""|**/
	wdTab: function(ev) {
		const data = this.attr(ev.target.dataset.wdTab);
		delete ev.target.dataset.wdTab;
		if (data) __TAB.attach(ev.target, data.orientation === "vertical");
		return;
	},
	/**. '{void wdDevice(object ev)}: Manipula classes de estilos conforme tipo de dispositivo (ver '{__DEVICE.css}).**/
	wdDevice: function(ev) {
		const data = this.attr(ev.target.dataset.wdDevice);
		if (data) __DEVICE.css(ev.target, data);
		return;
	},
	/**. '{void wdMask(object ev)}: Aplica uma máscara ao conteúdo textual do elemento a partir de um model, se casado:
	|Nome|Tipo|Opcional|Descrição|
	|'{model}|string|Não|Modelo da máscara (ver '{__STRING})|
	|""Tabela de configuração do atributo wdMask""|**/
	wdMask: function(ev) {
		const data = this.attr(ev.target.dataset.wdMask);
		const form = __FORMDATA.type(ev.target) !== null;
		const text = ev.target[form ? "value" : "textContent"];
		const mask = form && __FORMDATA.hasMask(ev.target) ? text : __STRING.mask(text, data ? data.model : "");
		ev.target.placeholder = data.model;
		if (data) ev.target[form ? "value" : "textContent"] = mask;
		return;
	},






	/**. '{void wdDrag(object ev)}: Define elementos arrastáveis e de queda (ver '{__DRAG}):
	|Nome|Tipo|Opcional|Descrição|
	|'{drop}|string|Não|Seletor CSS para definir os elementos de queda|
	|'{effect}|string|Não|Efeito do arrasto|
	|'{call}|function|Sim|Função a ser disparada quando soltar o elemento|
	|""Tabela de configuração do atributo wdDrag""|**/
	wdDrag: function(ev) {
		//FIXME se o elemento puder ser jogado em mais de um buraco?
		const data = this.attr(ev.target.dataset.wdDrag);
		delete ev.target.dataset.wdDrag;
		if (data) __DRAG.attach(ev.target, data.drop, data.effect, data.call);
		return;
	},


	wdFilter: function(ev) {
		const data = this.attr(ev.target.dataset.wdFilter);console.log("filter-------------------------", data)
		const form = __FORMDATA.type(ev.target) !== null;
		const text = ev.target[form ? "value" : "textContent"];
		const rexp = /^\/(.+)\/([gim]+)?$/;
		const find  = !rexp.test(text) ? text : new RegExp(text.replace(rexp, "$1"), text.replace(rexp, "$2"));
		if (data) WD.$$(data.target).filter(find, Number(data.size));
		return;
	},






	handleEvent: function(ev) {
		console.log(ev);
		if (ev.type === "load")      return this.onload(ev);
		if (ev.type === "resize")    return this.onresize(ev);
		if (ev.type === "click")     return this.onclick(ev);
		if (ev.type === "focusout")  return this.onfocusout(ev);
		if (ev.type === "input")     return this.oninput(ev);
		if (ev.type === "wdreload")  return this.onwdreload(ev);
		if (ev.type === "wddataset") return this.onwddataset(ev);
		return;
	},
};
/*-- eventos da biblioteca --*/
window.addEventListener("load",        __CSS);
window.addEventListener("load",       __HASH);
window.addEventListener("resize",     __HASH);
window.addEventListener("hashchange", __HASH);
window.addEventListener("wdreload",   __HASH);
window.addEventListener("load",        WDDATASET);
window.addEventListener("resize",      WDDATASET);
document.addEventListener("focusout",  WDDATASET);
document.addEventListener("input",     WDDATASET);
document.addEventListener("wddataset", WDDATASET);
document.addEventListener("wdreload",  WDDATASET);