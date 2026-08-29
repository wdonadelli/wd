const WDDATASET = {
	/**. '{object data}: Registra os dados utilizados pelos valores dos atributos HTML da biblioteca.**/
	data: {},
	/**. '{void attach(string name, any data)}: Vincula os valores dos atributos HTML da biblioteca a um identificador:
	|Argumento|Descrição|
	|'{name}|Identificador a ser utilizado como valor dos atributos HTML|
	|'{data}|Valor que determina a configuração do atributo  HTML|**/
	attach: function(name, data) {this.data[name] = data;},
	/**. '{object attr(string value, object parser)}: Retorna o valor do atributo anexado a '{data} ou conforme nomenclatura específica (ver '{__DOCODE.attr}), caso contrário, nulo:
	|Argumento|Opcional|Descrição|
	|'{value}|Não|Valor declarado no atributo|
	|'{parser}|Sim|Objeto contendo os tipos de dados de cada propriedade para fins de transformação|
	|""Tabela dos argumentos de '{attr}""|**/
	attr: function(value, parser) {
		parser = __Type(parser).object ? parser : {};
		const data = __Type(this.data[value]).function ? this.data[value]() : this.data[value];
		const text = __DOCODE.attr(value);
		const attr = __Type(data).object ? data : (text.find !== "" ? text.json : null);
		if (attr === null) return null;
		for (let i in parser) {
			if (!(i in attr)) continue;
			let val = new __Type(attr[i]);
			if (parser[i] === "node")
				attr[i] = val.node ? val.value[0] : document.querySelector(String(attr[i]));
			else if (parser[i] === "nodes")
				attr[i] = val.node ? attr[i] : document.querySelectorAll(String(attr[i]));
			else if (parser[i] === "boolean")
				attr[i] = attr[i] === "false" || attr[i] == false ? false : true;
			else if (parser[i] === "number")
				attr[i] = val.number ? val.value : attr[i];
		}
		return attr;
	},

	events: {
		resize: {wdDevice: {target: "[data-wd-device]", delete: false}},


	},



	/*-- MÉTODOS DE EVENTO -----------------------------------------------------*/
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
	//FIXME cuidado ao apagar
	onresize: function(ev) {
		const tool = {
			wdDevice: __DEVICE.changeDevice,//TODO importante
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

	/*-- ATRIBUTOS SEM REGISTRO ------------------------------------------------*/
	/**. '{void wdLoad(object ev)}: Carrega um conteúdo externo:
	|Nome|Tipo|Opcional|Descrição|
	|'{replace}|boolean|Sim|Ver '{__LOADER}|
	|Demais propriedades|Any|Não|Ver '{__REQUEST}|
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
	|Demais propriedades|Any|Não|Ver '{__REQUEST}|
	|""Tabela de configuração do atributo wdRepeat""|**/
	wdRepeat: function(ev) {
		const data = this.attr(ev.target.dataset.wdRepeat);
		delete ev.target.dataset.wdRepeat;
		if (data) __LOADER.urlRepeat(ev.target, data, data.model);
		return;
	},
	/*-- ATRIBUTOS COM REGISTRO ------------------------------------------------*/
	/**. '{void wdDetach(object ev)}: Desvincula o elemento registrados retornando ao estado inicial.**/
	wdDetach: function(ev) {
		delete ev.target.dataset.wdDetach;
		__HEAP.detach(ev.target);
		return;
	},
	/**. '{void wdMask(object ev)}: Aplica uma máscara ao conteúdo textual do elemento a partir de um modelo.
	|Nome|Tipo|Opcional|Descrição|
	|'{model}|string|Não|Modelo da máscara|
	|""Tabela de configuração do atributo wdMask""|**/
	wdMask: function(ev) {
		const data = this.attr(ev.target.dataset.wdMask);
		delete ev.target.dataset.wdMask;
		if (data) __MASK.attach(ev.target, data.model);
		return;
	},
	/**. '{void wdFilter(object ev)}: Estabelece um localizador de palavras no texto exibindo o elemento filho que contém o fragmento procurado:
	|Nome|Tipo|Opcional|Descrição|
	|'{list}|node|Não|Elemento a procurar pelos fragmento|
	|'{size}|integer|Sim|Quantidade mínima de caracteres para executar o filtro|
	|""Tabela de configuração do atributo wdFilter""|**/
	wdFilter: function(ev) {
		const data = this.attr(ev.target.dataset.wdFilter, {list: "node", size: "number"});
		delete ev.target.dataset.wdFilter;
		if (data) __FILTER.attach(ev.target, data.list, data.size);
		return;
	},
	/**. '{void wdTab(object ev)}: Transforma o elemento num conjunto de paineis controlados por abas:
	|Nome|Tipo|Opcional|Descrição|
	|'{orientation}|string|Não|Disposição das abas: '{horizontal} (padrão) ou '{vertical}|
	|""Tabela de configuração do atributo wdTab""|**/
	wdTab: function(ev) {
		const data = this.attr(ev.target.dataset.wdTab);
		delete ev.target.dataset.wdTab;
		if (data) __TAB.attach(ev.target, data.orientation);
		return;
	},
	/**. '{void wdMenu(object ev)}: Define um menu suspenso:
	|Nome|Tipo|Opcional|Descrição|
	|'{list}|Array|Não|Ver objeto '{__MENU}|
	|'{type}|String|Não|Ver objeto '{__MENU}|
	|'{call}|Function|Sim|Ver objeto '{__MENU}|
	|""Tabela de configuração do atributo wdMenu""|**/
	wdMenu: function(ev) {
		const data = this.attr(ev.target.dataset.wdMenu);
		delete ev.target.dataset.wdMenu;
		if (data) __MENU.attach(ev.target, data.list, data.type, data.call);
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





	/*-- ATRIBUTOS PERMANENTES -------------------------------------------------*/
	/**. '{void wdDevice(object ev)}: Manipula classes de estilos conforme tipo de dispositivo (ver '{__DEVICE.css}).**/
	wdDevice: function(ev) {
		const data = this.attr(ev.target.dataset.wdDevice);
		if (data) __DEVICE.css(ev.target, data);
		return;
	},


	/*--------------------------------------------------------------------------*/
	/**. '{void handleEvent(object ev)}: Manipular principal do objeto.**/
	handleEvent: function(ev) {
		//console.log(ev);
		if (ev.type === "load")      return this.onload(ev);
		if (ev.type === "resize")    return this.onresize(ev);
		if (ev.type === "click")     return this.onclick(ev);
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
document.addEventListener("wddataset", WDDATASET);
document.addEventListener("wdreload",  WDDATASET);