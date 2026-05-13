/**
#3 Carregamento e Repetições HTML
O objeto '{__LOADER} tem o objetivo de carregar informações no documento HTML repetindo, definindo ou substituindo-os.
**/
const __LOADER = {
	/**. '{object model}: Registra os modelos utilizados pelo método '{repeat}.**/
	model: {},
	/**. '{void repeat(node node, array list, string model)}: Adiciona elementos padronizados ao nó a partir de um modelo, repetindo-o e substituindo fragmentos por valores definidos em listagem:
	- cada item da lista deverá ser um objeto contendo os parâmetros de substituição;
	- o nome no objeto identifica o fragmento e seu valor a informação a ser exibida;
	- o modelo será repetido na mesma quantidade de itens da lista;
	- o modelo deverá ser um código HTML válido;
	- se não informado o modelo, será aplicado o último utilizado pelo nó;
	- na inexistência de modelo anterior, o código HTML interno do nó será utilizado;
	- o fragmento a ser substituído no modelo é identificado por um nome encapsulado por chaves duplas; e
	- o nome do fragmento deve corresponder a um nome existente nos itens da lista;**/
	repeat: function(node, list, model) {
		node.setAttribute("aria-busy", "true");
		/*-- acertando argumentos --*/
		node.id = __ID.id(node);
		list    = Array.isArray(list) ? list : [];
		/*-- definindo modelo --*/
		this.model[node.id] = typeof model === "string" ? model : (node.id in this.model ? this.model[node.id] : node.innerHTML);
		/*-- variáveis --*/
		const html = this.model[node.id];
		const find = /\{\{([^}]+)\}\}/g;
		const load = [];
		/*-- clonando e substituindo --*/
		list.forEach(function(v,i,a) {
			if (v === null || typeof v !== "object") return;
			let inner = html;
			for (let name in v)
				inner = inner.split(`{{${name}}}`).join(v[name]);
			inner = inner.replace(find, "");
			load.push(inner);
		});
		/*-- encerrando --*/
		__HTML(node, {innerHTML: load.join("\n")});
		node.setAttribute("aria-busy", "false");
		return;
	},
	/**. '{string fileType(object headers)}: Retorna o tipo de arquivo informado no cabeçalho da requisição ou nulo.**/
	fileType: function(headers) {
		const head = __FILE.fromHeaders(headers);
		switch(head.type) {
			case "application/json":     return "json";
			case "text/csv":             return "csv";
			case "text/html":            return "html";
			case "application/xml+html": return "html";
			case "image/svg+xml":        return "svg";
		}
		return null;
	},























	/**. '{object fileRepeat(node node, object http)}: Semelhante ao método '{repeat}, mas utilizando arquivos externos (JSON/CSV), e retornando a instância do contrutor '{__Request}. Os dados da requisição são definidos pelo argumento '{http}.**/
	fileRepeat: function(node, http) {
		if (http === null || typeof http !== "object") return null;
		http.type = "text";
		http.call = function(x) {
			if (x.ok)
				switch(__LOADER.fileType(x.headers)) {
					case "json": return __LOADER.repeat(node, JSON.parse(x.response));
					case "csv":  return __LOADER.repeat(node, __CSV.list(x.response));
					default:     return __LOADER.repeat(node, []);
				}
			return;
		};
		return new __Request(http);
	},
	/**. '{object requestHTML(node node, object http)}: Carrega o código página HTML a partir de arquivos externos. Retorna a instância do contrutor '{__Request}, sendo os dados da requisição definidos pelo argumento '{http}. O argumento '{replace}, se verdadeiro, substituirá o nó pelo conteúdo, caso contrário, o carregará como conteúdo interno.**/
	requestHTML: function(node, http, replace) {
		if (http === null || typeof http !== "object") return null;
		replace = replace === true;
		node.setAttribute("aria-busy", "true");
		http.type = "text";
		http.call = function(x) {
			if (x.ok) {
				const info = new __Parser(x.response);
				const head = __FILE.fromHeaders(x.headers);
				const attr = {}
				if (head.type === "text/html" || head.type === "application/xml+html")
					attr[replace ? "outerHTML" : "innerHTML"] = info.stringHTML.get().body.innerHTML;
				else if (head.type === "image/svg+xml")
					attr[replace ? "outerHTML" : "innerHTML"] = info.stringSVG.get();
				else if ((/^(application|text)\//).test(head.type))
					attr[replace ? "outerText" : "innerText"] = x.response;
				__HTML(node, attr);
			}
			if (x.done) node.setAttribute("aria-busy", "false");
			return;
		};
		return new __Request(http);
	},
};