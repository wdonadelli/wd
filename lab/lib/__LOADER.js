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
			if (!__Type(v).object) return;
			let inner = html;
			for (let name in v)
				inner = inner.split(`{{${name}}}`).join(v[name]);
			inner = inner.replace(find, "");
			load.push(inner);
		});
		/*-- encerrando --*/
		__HTML(node, {innerHTML: load.join("\n")});
		node.removeAttribute("aria-busy");
		return;
	},
	/**. '{object urlRepeat(node elem, object data, string model)}: Semelhante ao método '{repeat}, mas utilizando arquivos externos (JSON/CSV). Os dados da requisição/leitura são definidos pelo argumento '{data}.**/
	urlRepeat: function(elem, data, model) {
		if (!__Type(data).object) return;
		data.type = "text";
		data.call = function(x) {
			if (x.ok && x.result !== null) try {
				const mime = x.mime.split(";")[0].trim().toLowerCase();
				if (mime === "text/csv")
					return __LOADER.repeat(elem, __CSV.parseList(x.result), model);
				if (mime === "application/json")
					return __LOADER.repeat(elem, JSON.parse(x.result), model);
			} catch(e) {
				return __LOADER.repeat(elem, [], model);
			}
		};
		__REQUEST.make(data);
		return;
	},
	/**. '{object urlHTML(node elem, object data, boolean replace)}: Carrega o código HTML ou o conteúdo textual, conforme o caso, a partir de fontes externas:
	|Argumento|Descrição|
	|'{elem}|Onde onde serão carregados o código ou o texto do arquivo externo.|
	|'{data}|Parâmetros da requisição ou leitura (ver __REQUEST).|
	|'{replace}|Se verdadeiro, o elemento será substituído pelo conteúdo, caso contrário, o receberá.|**/
	urlHTML: function(elem, data, replace) {
		if (!__Type(data).object) return null;
		elem.setAttribute("aria-busy", "true");
		data.type  = "text";
		const form = ["textarea", "input"].indexOf(elem.tagName.toLowerCase()) >= 0;
		data.call = function(x) {
			if (x.ok && x.result !== null) {
				const html = replace === true ? "outerHTML" : (form ? "value" : "innerHTML");
				const text = replace === true ? "outerText" : (form ? "value" : "innerText");
				const attr = {};
				if (x.mime === "text/csv")
					attr[html] = form ? x.result : __CSV.parseTable(x.result).outerHTML;
				else if (x.mime === "text/html" || x.mime === "application/xml+html" || x.mime === "image/svg+xml")
					attr[html] = __STRING.parserDOM(x.result, x.mime).body.innerHTML;
				else
					attr[text] = x.result;
				elem.removeAttribute("aria-busy");
				__HTML(elem, attr);
			}
			else if (x.done) elem.removeAttribute("aria-busy");
			return;
		};
		__REQUEST.make(data);
		return;
	},
};