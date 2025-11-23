/**
#3 Definir Propriedades/Atributos HTML
O objeto __SETHTML define um conjunto de métodos para definir propriedades em elementos HTML de forma personalizada.
**/
const __SETHTML = {
	/**. '{void value(node node, string value)}: Define o valor da propriedade ou atributo '{value}.**/
	value: function(node, value) {
		return __FIELDS.value(node, value);
	},
	/**. '{void innerHTML(node node, string value)}: Define o valor da propriedade e reanalisa o documento.**/
	innerHTML: function(node, value) {
		const event    = new CustomEvent("wdreload", {detail: null, bubbles: true});
		node.innerHTML = value;
		node.dispatchEvent(event);
		return;
	},
	/**. '{void outerHTML(node node, string value)}: Define o valor da propriedade e reanalisa o documento.**/
	outerHTML: function(node, value) {
		const event    = new CustomEvent("wdreload", {detail: null, bubbles: true});
		const parent   = node.parentElement;
		node.outerHTML = value;
		parent.dispatchEvent(event);
		return;
	},
	/**. '{void appendChild(node node, string value)}: Define o valor da propriedade e reanalisa o documento.**/
	appendChild(node, value) {
		if (Array.isArray(value)) {
			const isNew = value[0].parentElement === null;
			node.appendChild(value[0]);
			if (isNew) {
				const event = new CustomEvent("wdreload", {detail: null, bubbles: true});
				node.dispatchEvent(event);
			}
		}
		return;
	},
	/**. '{void insertAdjacentElement(node node, string value)}: Define o valor da propriedade e reanalisa o documento.**/
	insertAdjacentElement(node, value) {
		if (Array.isArray(value)) {
			const isNew = value[1].parentElement === null;
			node.insertAdjacentElement(value[0], value[1]);
			if (isNew) {
				const event = new CustomEvent("wdreload", {detail: null, bubbles: true});
				node.dispatchEvent(event);
			}
		}
		return;
	},
	/**. '{void insertBefore(node node, string value)}: Define o valor da propriedade e reanalisa o documento.**/
	insertBefore(node, value) {
		if (Array.isArray(value)) {
			const isNew = value[0].parentElement === null;
			node.insertBefore(value[0], value[1]);
			if (isNew) {
				const event = new CustomEvent("wdreload", {detail: null, bubbles: true});
				node.dispatchEvent(event);
			}
		}
		return;
	},
	/**. '{void style(node node, any value)}: Define o valor da propriedade/atributo:
	|Tipo|Descrição|
	|nulo|Remove o atributo|
	|string|Define o atributo|
	|object|Define a propriedade|**/
	style: function(node, value) {
		const check = new __Type(value);
		if (check.null)
			node.removeAttribute("style");
		else if (check.chars)
			node.setAttribute("style", value);
		else if (check.object)
			for (let name in value)
				node.style[name] = value[name];
		return;
	},
	/**. '{void className(node node, string value)}: Define o valor do atributo '{class}:
	|Valor|Descrição|
	|nulo|O atributo é excluído|
	|string|O valor é definido|
	|object|O método '{classList} é chamado|**/
	className: function(node, value) {
		const check = new __Type(value);
		if (check.null) {
			node.removeAttribute("class");
		}
		else if (check.object) {
			this.classList(node, value);
		}
		else if (check.chars) {
			const list = value.replace(/\s+/g, " ").trim().split(" ");
			const heap = list.filter(function(v,i,a) {return a.indexOf(v) === i;});
			node.setAttribute("class", heap.sort().join(" "));
		}
		return;
	},
	/**. '{void classList(node node, object value)}: Define o valor do atributo '{class}:
	|Nome|Descrição|
	|replace|Substitui o primeiro valor pelo segundo separados por espaço|
	|toggle|Alterna a existência do valor|
	|add|Adiciona os valores separados por espaço|
	|remove|Adiciona os valores separados por espaço|
	Se não for objeto chama o método '{className}. Todos os valores das propriedades são string.**/
	classList: function(node, value) {
		const check = __CHECK.test(value);
		if (check.type === "object") {
			const prop = ["replace", "toggle", "add", "remove"];
			const name = node.getAttribute("class");
			this.className(node, name === null ? "" : name);
			let   list = name === null ? [] : node.getAttribute("class").split(" ");
			for (let i = 0; i < prop.length; i++) {
				if (prop[i] in value) {
					let css = String(value[prop[i]]).replace(/\s+/g, " ").trim().split(" ");
					if (prop[i] === "replace")
						list.forEach(function(v,i,a) {
							a[i] = v === css[0] && css.length > 1 ? css[1] : v;
						});
					else if (prop[i] === "toggle")
						css.forEach(function(v,i,a) {
							const item = list.indexOf(v);
							if (item < 0) list.push(v);
							else          list[item] = "";
						});
					else if (prop[i] === "add")
						css.forEach(function(v,i,a) {list.push(v);});
					else if (prop[i] === "remove")
						list = list.filter(function(v,i,a) {return css.indexOf(v) < 0;});
				}
			}
			value = list.join(" ");
		}
		this.className(node, value);
		return;
	},
	/**. '{void addEventListener(node node, any value, boolean remove)}: Adiciona ou remove ouvintes de eventos. Se o valor for um array, cada item do array corresponderá ao argumento do método. Em caso de objeto, a referência aos argumentos são:
	|Valor|Array|Evento|Disparador|Complemento|
	|function|-|propriedade|valor|-|
	|object (handleEvent)|-|propriedade|valor|-|
	|array|1 item|propriedade|item 1|-|
	|array|2 itens|propriedade|item 1|item 2|
	|array|3 itens|item 1|item 2|item 3|**/
	addEventListener: function(node, value, remove) {
		const attr  = remove === true ? "removeEventListener" : "addEventListener";
		const check = new __Type(value);
		if (check.array)
			node[attr].apply(node, value);
		else if (check.object)
			for(let ev in value) {
				let test = new __Type(value[ev]);
				let name = ev.trim().replace(/^(on)?/i, "");
				if (test.function || test.object)
					node[attr](name, value[ev]);
				else if (test.array && value[ev].length > 0)
					node[attr].apply(node, value[ev].length > 2 ? value[ev] : [name].concat(value[ev]));
			}
			return;
	},
	/**. '{void removeEventLister(node node, any value)}: Mesma lógica de '{addEventListener}.**/
	removeEventListener: function(node, value) {
		return this.addEventListener(node, value, true);
	},
	/**. '{void dataset(node node, any value)}: Adiciona ou remove propriedades de '{dataset} e dispara o evento '{wddataset}:
	|Tipo|Valor|Descrição|
	|nulo||Apaga todas as propriedades|
	|object|nulo|Apaga a propriedade específica|
	|object||item 1|Define o valor da propriedade|**/
	dataset: function(node, value) {
			const check = new __Type(value);
			/*-- limpar propriedades --*/
			if (check.null)
				for (let i in node.dataset) {
					delete node.dataset[i];
				}
			/*-- definir propriedades --*/
			else if (check.object)
				for (let name in value) {
					let prop = name.replace(/\-+/g, "").replace(/^\-|\-$/g, "");
					if (prop.indexOf("-") >= 0)
						prop = prop.replace(/\-./g, function(x) {return x.toUpperCase().replace("-", "");});
					if (value[name] === null && prop in node.dataset) {
						delete node.dataset[prop];
					}
					else if (value[name] !== null) {
						node.dataset[prop] = value[name];
						/*-- dispara evento para propriedades "data-wd-... --*/
						if ((/^wd[A-Z]/).test(prop)) {
							const event = new CustomEvent("wddataset", {detail: prop, bubbles: true});
							node.dispatchEvent(event);
						}
					}
				}
		return;
	},
	/**. '{void setAttribute(node node, object|array value)}: Define atributos HTML.**/
	setAttribute: function(node, value) {
		const check = new __Type(value);
		if (check.object) {
			for (let i in value) this.setAttribute(node, [i, value[i]]);
			return;
		}
		if (check.array) {
			/*-- data-wd-... --*/
			if ((/^data\-wd\-.+/i).test(value[0])) {
				const camel = function(x) {return x.toUpperCase().replace("-", "");};
				const data  = {};
				const name  = String(value[0]).toLowerCase().replace(/^data\-+|\-+$/gi, "").replace(/\-+/g, "-");
				data[name.replace(/\-./gi, camel)] = value[1];
				this.dataset(node, data);
			}
			/*-- value --*/
			else if ((/^value$/i).test(value[0])) {
				this.value(node, value[1]);
			}
			/*-- normal --*/
			else {
				node.setAttribute(value[0], value[1]);
			}
		}
		return;
	},
	/**. '{void removeAttribute(node node, any value)}: Remove atributos HTML**/
	removeAttribute: function(node, value) {
		const check = new __Type(value);
		if (check.array) {
			for (let i = 0; i < value.length; i++)
				node.removeAttribute(value[i]);
		}
		else if (check.null) {
			const attr = node.attributes;
			for (let i = 0; i < attr.length; i++)
				node.removeAttribute(attr[i].name);
		}
		else {
			node.removeAttribute(value);
		}
	},
};