/**
#3 Gestão de Dados
O constructor '{__DataSet} tem o objetivo de gerir conjunto de dados repassados como argumento.**/
function __DataSet(input) {
	if (!(this instanceof __DataSet))	return new __DataSet(input);
	Object.defineProperties(this, {_data: {value: [], configurable: true}});
	this.import(input);
}

Object.defineProperties(__DataSet.prototype, {
	constructor: {value: __DataSet},
	[Symbol.iterator]: {value: function*() {for (let v of this._data) yield [v.name, v.value];}},
	entries:           {value: function*() {for (let v of this._data) yield [v.name, v.value];}},
	keys:              {value: function*() {for (let v of this.entries()) yield v[0];}},
	values:            {value: function*() {for (let v of this.entries()) yield v[1];}},
	/**. '{self import(any input)}: Incorpora o conjunto de dados de '{input} para o objeto podendo ser:
	- string no formato "name: value\r\n";
	- objeto;
	- array;
	- instância de Headers;
	- instância de FormData;
	- instância de URLSearchParams; ou
	- instância do próprio '{__DataSet}.**/
	import: {
		value: function(input) {
			const check  = __Type(input);
			const self   = this;
			const header = /^([a-z\-]+\:\ [^\n]+\r\n)+$/;
			const search = /^([^?]+\?|\?)?([^=]+\=(\&?|[^&]+\&?))+(\#.*)?$/;
			/*-- string header => name: value\r\n --*/
			if (header.test(input)) {
				input.trim().split("\r\n").forEach(function(v,i,a) {
					const find = v.match(/^([a-z\-]+)\:\ (.*)$/);
					this.append(find[1].trim(), find[2].trim());
				}, this);
				return;
			}
			/*-- string search => ?name=value& --*/
			if (search.test(input)) {
				//console.log(input.split("?").slice(-1)[0])
				input.split("?").slice(-1)[0].trim().replace(/\#.*$/, "").split("&").forEach(function(v,i,a) {
					const find = v.match(/^([^=]+)\=(.*)$/);
					this.append(find[1].trim(), find[2].trim());
				}, this);
				return;
			}
			/*-- instância de URL --*/
			if (check.instanceOf("URL")) {
				return this.import(input.search);
			}
			/*-- instância de Headers --*/
			if (check.instanceOf("Headers")) {
				input.forEach(function (value,name,data) {self.append(name, value);});
				return;
			}
			/*-- instância de URLSearchParams --*/
			if (check.instanceOf("URLSearchParams")) {
				input.forEach(function (value,name,data) {self.append(name, value);});
				return;
			}
			/*-- instância de FormData --*/
			if (check.instanceOf("FormData")) {
				for (const data of input.entries()) {this.append(data[0], data[1]);}
				return;
			}
			/*-- instância de Map --*/
			if (check.instanceOf("Map")) {
				input.forEach(function (value,name,data) {self.append(name, value);});
				return;
			}
			/*-- instância de __DataSet --*/
			if (input instanceof __DataSet) {
				input.forEach(function (value,name,data) {self.append(name, value);});
				return;
			}
			/*-- JS Array --*/
			if (check.array) {
				input.forEach(function (value,name,data) {self.append(name, value);});
				return;
			}
			/*-- JS Objeto (ficar por último) --*/
			if (check.object) {
				for (let name in input) this.append(name, input[name]);
				return;
			}
			return;
		}
	},
	/**. '{self append(string name, any value)}: Acrescenta um valor ('{value}) vinculado a um identificador ('{name}).**/
	append: {
		value: function(name, value) {
			name = String(name).replace(/\[\]$/, "").trim();
			if (name.length > 0) this._data.push({name: name, value: value});
			return this;
		}
	},
	/**. '{self delete(string name)}: Remove todos os valores associados ao indentificador '{name}.**/
	delete: {
		value: function(name) {
			name = String(name).replace(/\[\]$/, "").trim();
			Object.defineProperty(this, "_data", {writable: true});
			this._data = this._data.filter(function(v,i,a) {return v.name !== name;});
			Object.defineProperty(this, "_data", {writable: false});
			return this;
		}
	},
	/**. '{array getAll(string name)}: Retorna uma lista de valores identificados por '{name}.**/
	getAll: {
		value: function(name) {
			name = String(name).replace(/\[\]$/, "").trim();
			return this._data.filter(function(v,i,a) {return v.name === name;}).map(function(v,i,a) {return v.value;});
		}
	},
	/**. '{any get(string name)}: Retorna o valor do primeiro identificador '{name} localizado ou indefinido.**/
	get: {value: function(name) {return this.getAll(name)[0];}},
	/**. '{self set(string name, any value)}: Redefine todos os identificadores '{name} com o valor '{value}.**/
	set: {value: function(name, value) {return this.delete(name).append(name, value);}},
	/**. '{boolean has(string name)}: Retorna verdadeiro se o identificador '{name} existir.**/
	has: {value: function(name) {return this.getAll(name).length > 0;}},
	/**. '{integer size}: Retorna um objeto representativo e não utilizável dos dados.**/
	size: {get: function() {return this._data.length;}},
	/**. '{self forEach(function' callback, object self)}: Chama '{caller} para cada item, repassando o valor e o nome de cada dado como argumentos.**/
	forEach: {
		value: function(callback, self) {
			if (typeof callback === "function")
				this._data.slice().forEach(function(v,i,a) {return callback(v.value, v.name,a);}, self);
			return this;
		}
	},
	/**. '{object toObject}: Converte o conjunto de dados em um objeto com b{sobreposição de identificadores}.**/
	toObject: {
		get: function() {
			return this._data.reduce(function(data,v,i,a) {
				data[v.name] = v.value;
				return data;
			}, {});
		}
	},
	/**. '{object toMap}: Converte o conjunto de dados em um Mapa com **sobreposição de identificadores**.**/
	toMap: {
		get: function() {
			return this._data.reduce(function(data,v,i,a) {
				data.set(v.name, v.value);
				return data;
			}, new Map());
		}
	},
	/**. '{object toListObject}: Converte o conjunto de dados em um objeto organizado por nome e listas de valores correspondentes.**/
	toListObject: {
		get: function() {
			return this._data.reduce(function(data,v,i,a) {
				if (!(v.name in data)) data[v.name] = [];
				const check = new __Type(v.value);
				if (check.instanceOf("FileList") || check.array) {
					if (v.value.length > 0)
						data[v.name] = data[v.name].concat(check.array ? v.value : Array.from(v.value));
					else
						data[v.name].push("");
				}
				else if (check.object) {
					let i = null, name;
					for (i in v.value) {
						name = `${v.name}.${i}`;
						if (!(name in data)) data[name] = [];
						data[name].push(v.value[i]);
					}
					if (i === null) data[v.name].push("");
					if (data[v.name].length === 0) delete data[v.name];
				}
				else {
					data[v.name].push(v.value);
				}
				return data;
			}, {});
		}
	},
	/**. '{object toObjectHeaders}: Converte o conjunto de dados em um objeto organizado em strings com valores separador por ", ".**/
	toObjectHeaders: {
		get: function() {
			const list = this.toListObject;
			const data = {};
			for (let i in list) {
				let name = i.toLowerCase();
				data[name] = (name in data ? [data[name], list[i].join(", ")] : list[i]).join(", ")
			}
			return data;
		}
	},
	/**. '{object toHeaders}: Converte o conjunto de dados em um objeto Headers. Se a ferramenta não estiver definida, retornará o resultado da propriedade '{toObjectHeaders}.**/
	toHeaders: {
		get: function() {
			if (!("Headers" in window)) return this.toObjectHeaders;
			const data = new Headers();
			const list = this.toListObject;
			for (let name in list)
				for (let value of list[name])
					data.append(name, value);
			return data;
		}
	},
	/**. '{string toStringHeaders}: Converte o conjunto de dados em uma string com dados separados por "\r\n" e nome e valor separados por ": ".**/
	toStringHeaders: {
		get: function() {
			const data = [];
			const list = this.toObjectHeaders;
			for (let i in list) data.push(`${i}: ${list[i]}\r\n`);
			return data.join("");
		}
	},
	/**. '{object toFormData}: Converte o conjunto de dados em um objeto FormData. Se a ferramenta não estiver definida, retornará o resultado da propriedade '{toSearch}.**/
	toFormData: {
		get: function() {
			if (!("FormData" in window)) return this.toSearch;
			const data = new FormData();
			const list = this.toListObject;
			for (let name in list)
				for (let value of list[name])
					data.append(name+(list[name].length > 1 ? "[]" : ""), value);
			return data;
		}
	},
	/**. '{object toURLSearchParams}: Converte o conjunto de dados em um objeto URLSearchParams. Se a ferramenta não estiver definida, retornará o resultado da propriedade '{toSearch}.**/
	toURLSearchParams: {
		get: function() {
			if (!("URLSearchParams" in window)) return this.toSearch;
			const data = new URLSearchParams();
			const list = this.toListObject;
			for (let name in list) {
				for (let value of list[name]) {
					let file = __Type(value).instanceOf("File");
					let prop = name+(list[name].length > 1 ? "[]" : "")
					let val  = file ? value.name : value
					data.append(prop, val);
				}
			}
			return data;
		}
	},
	/**. '{string toSearch}: Converte o conjunto de dados em uma string com itens separados por &amp;.**/
	toSearch: {
		get: function() {
			const data = [];
			const list = this.toListObject;
			for (let name in list) {
				for (let value of list[name]) {
					let file = __Type(value).instanceOf("File");
					let prop = encodeURIComponent(name)+(list[name].length > 1 ? "[]" : "");
					let val  = encodeURIComponent(file ? value.name : value);
					data.push(prop+"="+val);
				}
			}
			return data.join("&");
		}
	},
	/**. '{object toSubmit(any action, string method)}: O argumento '{action} é a URL (string ou objeto URL) e o argumento '{method} é o método da requisição. O método retorna um objeto com as seguintes propriedades para fins de requisição XMLHttpRequest, devendo inicialmente povoar o objeto com os valores de formulário e depois chamar o método:
	|Nome|Descrição|
	|url|URL a ser utilizada na requisição|
	|ctype|O content-type a ser informado no cabeçalho, dependendo do método|
	|body|O corpo da requisição, a depender do método|**/
	toSubmit: {
		value: function(action, method) {
			/*-- https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods --*/
			/*-- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form --*/
			method        = String(method).toLowerCase().trim();
			const hasBody = {get: 0, head: 0, post: 1, put: 1, delete: 1, connect: 1, options: 0, trace: 0, patch: 1};
			const check   = new __Type(action);
			const ctype   = {post: "multipart/form-data", get: "application/x-www-form-urlencoded", text: "text/plain"};
			const data    = {
				url:     check.instanceOf("URL") ? action.href : (check.nonempty ? action : ""),
				ctype: hasBody[method] === 1 ? ctype.post : ctype.get,
				body:    hasBody[method] === 1 ? this.toFormData : null
			};
			if (hasBody[method] !== 1) {
				const dataset = new this.constructor(data.url);
				dataset.import(this);
				data.url = data.url.split("?")[0]+"?"+dataset.toSearch;
			}
			return data;
		}
	},
	/**. '{object valueOf()}: Retorna uma representação dos dados em forma de objeto.**/
	valueOf: {
		value: function() {
			const count = {};
			return this._data.reduce(function(data,v,i,a) {
				count[v.name] = v.name in count ? count[v.name] + 1 : 0;
				data[v.name + ("\r").repeat(count[v.name])] = v.value;
				return data;
			},{});
		}
	},
	/**. '{string toString()}: Retorna uma representação dos dados em string.**/
	toString: {
		value: function() {
			return this._data.map(function(v,i,a) {
				const check = new __Type(v.value);
				const value = check.array || check.object ? JSON.stringify(v.value) : String(v.value);
				return `${v.name}: ${value}`;
			}).join("\n");
		}
	},
});