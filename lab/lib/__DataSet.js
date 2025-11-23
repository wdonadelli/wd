/**
#3 Gestão de Dados
O constructor '{__DataSet} tem o objetivo de gerir conjunto de dados repassados como argumento.**/
function __DataSet(input) {
	if (!(this instanceof __DataSet))	return new __DataSet(input);
	Object.defineProperties(this, {_data: {value: []}});
	this.import(input);
}

Object.defineProperties(__DataSet.prototype, {
	constructor: {value: __DataSet},
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
			const search = /^([^?]+\?|\?)?([^=]+\=(\&?|[^&]+\&?))+$/;
			/*-- string header => name: value\r\n --*/
			if (check.nonempty && header.test(input)) {
				const data = input.trim().split("\r\n");
				for (let i = 0; i < data.length; i++) {
					let part  = data[i].split(": ");
					let name  = part[0].trim();
					let value = part.length > 0 ? part[1].trim() : "";
					if (name.length > 0) this.append(name, value);
				}
			}
			/*-- string search => ?name=value& --*/
			else if (check.nonempty && search.test(input)) {
				const url  = input.split("?");
				const data = url[url.length - 1].trim().split("&");
				for (let i = 0; i < data.length; i++) {
					let part  = data[i].split("=");
					let name  = part[0].trim().replace(/\[\]$/, "");
					let value = part.length > 1 ? part[1] : "";
					if (name.length > 0) this.append(name, value);
				}
			}
			/*-- instância de URL --*/
			else if (check.instanceOf("URL")) {
				return this.import(input.search);
			}
			/*-- instância de Headers --*/
			else if (check.instanceOf("Headers")) {
				input.forEach(function (value,name,data) {self.append(name, value);});
			}
			/*-- instância de URLSearchParams --*/
			else if (check.instanceOf("URLSearchParams")) {
				input.forEach(function (value,name,data) {self.append(name, value);});
			}
			/*-- instância de FormData --*/
			else if (check.instanceOf("FormData")) {
				for (const data of input.entries()) {this.append(data[0], data[1]);}
			}
			/*-- instância de Map --*/
			else if (check.instanceOf("Map")) {
				input.forEach(function (value,name,data) {self.append(name, value);});
			}
			/*-- instância de __DataSet --*/
			else if (input instanceof __DataSet) {
				input.forEach(function (value,name,data) {self.append(name, value);});
			}
			/*-- JS Array --*/
			else if (check.array) {
				for (let i = 0; i < input.length; i++) this.append(String(i), input[i]);
			}
			/*-- JS Objeto (ficar por último) --*/
			else if (check.object) {
				for (let name in input) this.append(name, input[name]);
			}
			return;
		}
	},
	/**. '{self append(string name, any value)}: Acrescenta um valor ('{value}) vinculado a um identificador ('{name}).**/
	append: {
		value: function(name, value) {
			name = String(name).replace(/\[\]$/, "").trim();
			if (name.length !== 0)
				this._data.push({name: name, value: value});
			return this
		}
	},
	/**. '{self delete(string name)}: Remove todos os valores associados ao indentificador '{name}.**/
	delete: {
		value: function(name) {
			name = String(name).replace(/\[\]$/, "").trim();
			if (name.length !== 0)
				this._data.forEach(function(v,i,a) {
					if (v !== null && name === v.name) a[i] = null;
				});
			return this;
		}
	},
	/**. '{self set(string name, any value)}: Define um valor ('{value}) vinculado a um identificador ('{name}), substuindo os existentes.**/
	set: {
		value: function(name, value) {
			this.delete(name).append(name, value);
			return this;
		}
	},
	/**. '{array getAll(string name)}: Retorna uma lista de valores identificados por '{name}.**/
	getAll: {
		value: function(name) {
			name = String(name).replace(/\[\]$/, "").trim();
			const list = [];
			if (name.length !== 0) {
				for (let i of this.entries())
					if (name === i[0]) list.push(i[1]);
			}
			return list;
		}
	},
	/**. '{boolean has(string name)}: Retorna verdadeiro se o identificador '{name} existir.**/
	has: {
		value: function(name) {
			name = String(name).replace(/\[\]$/, "").trim();
			if (name.length !== 0) {
				for (let i of this.entries())
					if (name === i[0]) return true;
			}
			return false;
		}
	},
	/**. '{object toObject}: Converte o conjunto de dados em um objeto com **sobreposição de identificadores**.**/
	toObject: {
		get: function() {
			const data = {};
			for (let i of this.entries()) data[i[0]] = i[1];
			return data;
		}
	},
	/**. '{object toMap}: Converte o conjunto de dados em um Mapa com **sobreposição de identificadores**.**/
	toMap: {
		get: function() {
			const data = new Map();
			for (let i of this.entries()) data.set(i[0],i[1]);
			return data;
		}
	},
	/**. '{object toListObject}: Converte o conjunto de dados em um objeto organizado em listas de valores.**/
	toListObject: {
		get: function() {
			const data = {};
			for (let v of this.entries()) {
				let name  = v[0];
				let value = v[1];
				let check = __Type(value);
				/*-- definição da propriedade, se for objeto analisar cada item adiante --*/
				if (!(name in data) && !check.object) data[name] = [];

				if (check.instanceOf("FileList") || check.array) {
					if (value.length === 0)
						data[name].push("");
					else
						for (let i = 0; i < value.length; i++) data[name].push(value[i]);
				}
				else if (check.object) {
					let count = 0;
					for (let i in value) count++;
					if (count === 0) {
						if (!(name in data)) data[name] = [];
						data[name].push("");
					} else {
						for (let i in value) {
							let prop = name+"."+i;
							if (!(prop in data)) data[prop] = [];
							data[prop].push(value[i]);
						}
					}
				}
				else {
					data[name].push(value);
				}
			}
			return data;
		}
	},
	/**. '{object toObjectHeaders}: Converte o conjunto de dados em um objeto organizado em strings com valores separador por ", ".**/
	toObjectHeaders: {
		get: function() {
			const data = {};
			const src  = this.toListObject;
			for (let i in src) {
				let name = i.toLowerCase();
				if (name in data)
					data[name] = [data[name], src[i].join(", ")].join(", ");
				else
					data[name] = src[i].join(", ")
			}
			return data;
		}
	},
	/**. '{object toHeaders}: Converte o conjunto de dados em um objeto Headers. Se a ferramenta não estiver definida, retornará o resultado da propriedade '{toObjectHeaders}.**/
	toHeaders: {
		get: function() {
			if (!("Headers" in window)) return this.toObjectHeaders;
			const data = new Headers();
			const src  = this.toListObject;
			for (let name in src)
				for (let value of src[name])
					data.append(name, value);
			return data;
		}
	},
	/**. '{string toStringHeaders}: Converte o conjunto de dados em uma string com dados separados por "\r\n" e nome e valor separados por ": ".**/
	toStringHeaders: {
		get: function() {
			const data = [];
			const src  = this.toObjectHeaders;
			for (let i in src) data.push(i + ": " + src[i] + "\r\n");
			return data.join("");
		}
	},
	/**. '{object toFormData}: Converte o conjunto de dados em um objeto FormData. Se a ferramenta não estiver definida, retornará o resultado da propriedade '{toSearch}.**/
	toFormData: {
		get: function() {
			if (!("FormData" in window)) return this.toSearch;
			const data = new FormData();
			const src  = this.toListObject;
			for (let name in src)
				for (let value of src[name])
					data.append(name+(src[name].length > 1 ? "[]" : ""), value);
			return data;
		}
	},
	/**. '{object toURLSearchParams}: Converte o conjunto de dados em um objeto URLSearchParams. Se a ferramenta não estiver definida, retornará o resultado da propriedade '{toSearch}.**/
	toURLSearchParams: {
		get: function() {
			if (!("URLSearchParams" in window)) return this.toSearch;
			const data = new URLSearchParams();
			const src  = this.toListObject;
			for (let name in src) {
				for (let value of src[name]) {
					let file = __Type(value).instanceOf("File");
					let prop = name+(src[name].length > 1 ? "[]" : "")
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
			const src  = this.toListObject;
			for (let name in src) {
				for (let value of src[name]) {
					let file = __Type(value).instanceOf("File");
					let prop = encodeURIComponent(name)+(src[name].length > 1 ? "[]" : "");
					let val  = encodeURIComponent(file ? value.name : value);
					data.push(prop+"="+val);
				}
			}
			return data.join("&");
		}
	},
	[Symbol.iterator]: {
		value: function*() {for (let v of this.entries()) yield v;}
	},
	/**. '{object entries()}: Retorna um objeto Generator para looping i{for of} das entradas.**/
	entries: {
		value: function*() {
			for (let v of this._data)
				if (v !== null) yield [v.name, v.value];
		}
	},
	/**. '{object keys()}: Retorna um objeto Generator para looping i{for of} das chaves.**/
	keys: {
		value: function*() {for (let v of this.entries()) yield v[0];}
	},
	/**. '{object values()}: Retorna um objeto Generator para looping i{for of} dos valores.**/
	values: {
		value: function*() {for (let v of this.entries()) yield v[1];}
	},
	/**. '{self forEach(function' caller)}: Chama '{caller} para cada item, repassando o valor e nome, e um objeto com o par nome/valor, respectivamente, como argumentos.**/
	forEach: {
		value: function(caller) {
			if (__Type(caller).function) {
				const dataset = this.valueOf();
				for (let i in dataset)
					caller(dataset[i], i.trim(), dataset);
			}
			return this;
		}
	},
	/**. '{integer size}: Retorna um objeto representativo e não utilizável dos dados.**/
	size: {
		get: function() {
			let size = 0;
				for (let i of this.entries()) size++;
			return size;
		}
	},
	/**. '{object valueOf()}: Retorna uma representação dos dados em forma de objeto.**/
	valueOf: {
		value: function() {
			const counter = {};
			const dataset = {};
			for (let i of this.entries()) {
				let name  = i[0];
				let value = i[1];
				if (!(name in counter)) counter[name] = 0;
				let prop = name + ("\r").repeat(++counter[name]);
				dataset[prop] = value;
			}
			return dataset;
		}
	},
	/**. '{string toString()}: Retorna o mesmo produto da propriedade '{toStringHeaders}.**/
	toString: {
		value: function() {return this.toStringHeaders;}
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
});