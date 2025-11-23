/**
#3 Carregamento e Repetições HTML
O objeto '{__LOADER} ....................TODO.
**/
const __LOADER = {
	/**. '{object model}: Registra os modelos dos elementos.**/
	model: {},
	/**. '{void repeat(node node, array list)}: Repete o código HTML do elemento filho de '{node} conforme as informações presentes na lista de objetos ('{list}). O método extraí a informação textual do elemento filho original para fins de modelo e o repete a cada iteração da lista. Cada item da lista será um objeto e, se alguma propriedade desse objeto estiver presente entre duas chaves no modelo, esse conteúdo será substituído pelo valor da propriedade. Apenas as informações extraídas do u{código HTML} serão trabalhadas, portanto não se trata de clonagens do elemento filho original.**/
	repeat: function(node, list) {
		node.id    = __ID.id(node);
		list       = Array.isArray(list) ? list : [];
		let   html = node.innerHTML;
		const find = /\{\{([^}]+)\}\}/g;
		const load = [];
		/*-- modelo: conteúdo dos filhos com  {{name}} ou modelo gravado --*/
		if (find.test(html))
			this.model[node.id] = html;
		else if (node.id in this.model)
			html = this.model[node.id];
		else
			return;
		/*-- clonando e substituindo --*/
		node.setAttribute("aria-busy", "true");
		list.forEach(function(v,i,a) {
			if (v === null || typeof v !== "object") return;
			let inner = html;
			for (let name in v)
				inner = inner.split(`{{${name}}}`).join(v[name]);
			inner = inner.replace(find, "");
			load.push(inner);
		});
		__HTML(node, {innerHTML: load.join("\n")});
		node.setAttribute("aria-busy", "false");
		return;
	},
	/**. '{object requestRepeat(node node, object data)}: Faz o mesmo procedimento do método '{repeat}, mas utilizando arquivos. Retorna a instância do contrutor '{__Request}, sendo os dados da requisição definidos pelo argumento '{data} sendo possível a repetição a partir de arquivos JSON (array de objetos) e CSV, em que a linha inicial conterá os nomes das propriedades e as linhas seguintes os respectivos valores.**/
	requestRepeat: function(node, data) {
		if (data === null || typeof data !== "object") return;
		__LOADER.repeat(node, []);
		node.setAttribute("aria-busy", "true");
		data.type = "text";
		data.call = function(x) {
			if (x.ok) {
				const info = new __Parser(x.response);
				const head = __DROP.headers(x.headers);
				const mime = head.type.split("/");
				if (mime[1] === "json")
					__LOADER.repeat(node, info.stringJSON.get());
				else if (mime[1] === "csv")
					__LOADER.repeat(node, info.csvTable.tableValues.matrixList.get());
			}
			else if (x.done) {
				node.setAttribute("aria-busy", "false");
			}
			return;
		};
		return new __Request(data);
	},


	/**. '{object requestHTML(node node, object data)}: Carrega o código página HTML a partir de arquivos externos. Retorna a instância do contrutor '{__Request}, sendo os dados da requisição definidos pelo argumento '{data}. O argumento '{replace}, se verdadeiro, substituirá o nó pelo conteúdo, caso contrário, o carregará como conteúdo interno.**/
	requestHTML: function(node, data, replace) {
		if (data === null || typeof data !== "object") return;
		node.setAttribute("aria-busy", "true");
		data.type = "text";
		data.call = function(x) {
			if (x.ok) {
				const info = new __Parser(x.response);
				const head = __DROP.headers(x.headers);
				const mime = head.type.split("/");
				const attr = {}
				if (mime[1] === "html")
					attr[replace === true ? "outerHTML" : "innerHTML"] = info.stringHTML.get();
				else if (mime[1] === "xml")
					attr[replace === true ? "outerHTML" : "innerHTML"] = info.stringXML.get();
				else if (mime[1] === "svg")
					attr[replace === true ? "outerHTML" : "innerHTML"] = info.stringSVG.get();
				else if (mime[0] === "text" || mime[0] === "application")
					attr[replace === true ? "outerText" : "innerText"] = x.response;






			}
			else if (x.done) {
				node.setAttribute("aria-busy", "false");
			}
			return;
		};
		return new __Request(data);
	},





};