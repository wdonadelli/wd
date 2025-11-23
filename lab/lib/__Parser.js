/**
#3 Transformação de Dados
O constructor '{__Parser} efetuar transformação de dados informados como argumento. Se a transformação falhar, os atributos retornarão nulo. Todos as propriedades retornam uma nova instância do objeto i{__Parser} com o resultado da transformação anterior com o objetivo de fazê-las em cadeia. Utilize o método i{get} ao fim das trasformações para obter seu valor.
**/
function __Parser(input) {
	if (!(this instanceof __Parser)) return new __Parser(input);
	const check = new __Type(input);
	Object.defineProperties(this, {
		_data:  {value: input},
		_check: {value: check},
		_saved: {value: {}},
		_table: {value: check.instanceOf("HTMLTableElement")}
	});
}

Object.defineProperties(__Parser.prototype, {
	constructor: {value: __Parser},
	/**. '{object csvTable}: Transforma string [CSV]<https://www.rfc-editor.org/rfc/rfc4180> em tabela HTML.**/
	csvTable: {
		get: function() {
			if ("csvTable" in this._saved)
				return new __Parser(this._saved.csvTable);
			let data = null;
			if (this._check.chars) {
				const tree = new __Tree();
				const text = this._data.replace(/\r\n/g, "\n");
				const code = text.split("");
				const rows = text.trim().split("\n").length;
				const cols = /[\ \,\;\t\|]/;
				let    col = null;
				let  lines = 0;
				tree.open("table").open("thead").open("tr");
				code.forEach(function(v,i,a) {
					const tag = tree.level;
					/*-- células entre aspas --*/
					if (tag === "span") {
						if (v === "'" && a[i+1] === "'") {
							a[i+1] = "";
							tree.add("\"");
						} else if (v === "\"") {
							tree.close();
							if (col === null && a[i+1] !== "\n") col = a[i+1];
						} else {
							tree.add(v)
						}
					}
					/*-- células descrição ou de cabeçalho --*/
					else if (tag === "td" || tag === "th") {
						if (v === "\n") {
							if (lines === 0) {
								tree.close().close().close().open("tbody").open("tr");
							} else if (lines < (rows - 1)) {
								tree.close().close().open("tr");
							}
							lines++;
						} else if (col === null && cols.test(v)) { /*-- capturando separador de célula --*/
							col = v;
							tree.close()
						} else if (col === v) { /*-- encerrando célula --*/
							tree.close();
						} else {
							tree.add(v);
						}
					}
					/*-- linhas --*/
					else if (tag === "tr") {
						if (v === "\n") {
							if (lines === 0) {
								tree.close().close().open("tbody").open("tr");
							} else if (lines < (rows - 1)) {
								tree.close().open("tr");
							}
							lines++;
						} else if (v === "\"") {
							tree.open(lines === 0 ? "th" : "td").open("span");
						} else {
							tree.open(lines === 0 ? "th" : "td").add(v);
						}
					}
				});
				tree.finish();
				data = __HTML("div", {innerHTML: tree.valueOf()}).children[0];
			}
			this._saved["csvTable"] = data;
			return this.csvTable;
		}
	},
	/**. '{object tableMatrix}: Transforma tabela HTML em matriz 2x2.**/
	tableMatrix: {
		get: function() {
			if ("tableMatrix" in this._saved)
				return new __Parser(this._saved.tableMatrix);
			let data = null;
			if (this._table) {
				const matrix = Array.prototype.slice.call(this._data.rows);
				for (let i = 0; i < matrix.length; i++)
				  matrix[i] = Array.prototype.slice.call(matrix[i].cells);
				data = matrix;
			}
			this._saved["tableMatrix"] = data;
			return this.tableMatrix;
		}
	},
	/**. '{object tableValues}: Igual à propriedade '{tableMatrix}, mas exibindo os valores das células.**/
	tableValues: {
		get: function() {
			if ("tableValues" in this._saved)
				return new __Parser(this._saved.tableValues);
			let data = this.tableMatrix.get();
			if (data !== null) {
				for (let i = 0; i < data.length; i++)
					for (let j = 0; j < data[i].length; j++)
						data[i][j] = data[i][j].innerText;
			}
			this._saved["tableValues"] = data;
			return this.tableValues;
		}
	},
	/**. '{object matrixCSV}: Transforma uma matriz em string CSV.**/
	matrixCSV: {
		get: function() {
			if ("matrixCSV" in this._saved)
				return new __Parser(this._saved.matrixCSV);
			let data = null;
			if (this._check.array) {
				try {
					const csv = [];
					this._data.forEach(function (row,i,a) {
						csv.push([]);
						row.forEach(function (col,j,b) {
							let text = String(col).replace(/\"/g, "''");
							csv[i].push("\"" + text + "\"");
						});
						csv[i] = csv[i].join(",");
					});
					data = csv.join("\r\n");
				} catch(e) {}
			}
			this._saved["matrixCSV"] = data;
			return this.matrixCSV;
		}
	},
	/**. '{object matrixList}: Transforma uma matriz em uma lista de objetos.**/
	matrixList: {
		get: function() {
			if ("matrixList" in this._saved)
				return new __Parser(this._saved.matrixList);
			let data = null;
			if (this._check.array) {
				try {
					const object = [];
					let   title  = null;
					this._data.forEach(function (row,i,a) {
						if (!__Type(row).array) return;
						if (title === null) {
							title = row;
							return;
						}
						let item = {};
						row.forEach(function(value,j,b) {
							let name = j < title.length ? title[j] : "#"+j;
							item[name] = value;
						});
						object.push(item)
					});
					data = object;
				} catch(e) {}
			}
			this._saved["matrixList"] = data;
			return this.matrixList;
		}
	},
	/**. '{object stringJSON}: Transforma string JSON em objeto.**/
	stringJSON: {
		get: function() {
			if ("stringJSON" in this._saved)
				return new __Parser(this._saved.stringJSON);
			let data = null;
			if (this._check.chars) {
				try {data = JSON.parse(this._data);} catch(e) {}
			}
			this._saved["stringJSON"] = data;
			return this.stringJSON;
		}
	},
	/**. '{object jsonString}: Transforma objeto em string JSON.**/
	jsonString: {
		get: function() {
			if ("jsonString" in this._saved)
				return new __Parser(this._saved.jsonString);
			let data = null;
			try {data = JSON.stringify(this._data);} catch(e) {}
			this._saved["jsonString"] = data;
			return this.jsonString;
		}
	},
	/**. '{object stringHTML}: Transforma string em documento HTML.**/
	stringHTML: {
		get: function() {
			if ("stringHTML" in this._saved)
				return new __Parser(this._saved.stringHTML);
			let data = null;
			if (this._check.chars) {
				try {
					let parser = new DOMParser();
					data = parser.parseFromString(this._data, "text/html");
				} catch(e) {}
			}
			this._saved["stringHTML"] = data;
			return this.stringHTML;
		}
	},
	/**. '{object stringXML}: Transforma string em documento XML.**/
	stringXML: {
		get: function() {
			if ("stringXML" in this._saved)
				return new __Parser(this._saved.stringXML);
			let data = null;
			if (this._check.chars) {
				try {
					let parser = new DOMParser();
					data = parser.parseFromString(this._data, "application/xml");
				} catch(e) {}
			}
			this._saved["stringXML"] = data;
			return this.stringXML;
		}
	},
	/**. '{object stringSVG}: Transforma string em documento SVG.**/
	stringSVG: {
		get: function() {
			if ("stringSVG" in this._saved)
				return (this._saved.stringSVG);
			let data = null;
			if (this._check.chars) {
				try {
					let parser = new DOMParser();
					data = parser.parseFromString(this._data, "image/svg+xml");
				} catch(e) {}
			}
			this._saved["stringSVG"] = data;
			return this.stringSVG;
		}
	},
	/**. '{object arrayWD}: Transforma array de objetos em notação wd.**/
	arrayWD: {
		get: function() {
			if ("arrayWD" in this._saved)
				return new __Parser(this._saved.arrayWD);
			let data = null;
			try {
				if (this._check.array) {
					function parse(value, save, root) {
						const check = new __Type(value);
						/*--------------------------------------------------------------*/
						if (check.chars) {
							let item = value.replace(/\'/g, "''");
							save.push(`'${item}'`);
						}
						/*--------------------------------------------------------------*/
						else if (check.regexp) {
							save.push(value.toString());
						}
						/*--------------------------------------------------------------*/
						else if (check.function) {
							save.push(`(${value.name})`);
						}
						/*--------------------------------------------------------------*/
						else if (check.array) {
							save.push(root === true ? "" : "[");
							for (let i = 0; i < value.length; i++) {
								let test = root === true ? new __Type(value[i]) : {object: false};
								if (root === true && !test.object)
									throw new Error("Item is not an object.");
								save.push(i > 0 ? "," : "");
								save = parse(value[i], save, false);
							}
							save.push(root === true ? "" : "]");
						}
						/*--------------------------------------------------------------*/
						else if (check.object) {
							const re = /^([a-z0-9_\-]+|\$\$?)$/i;
							let    n = 0;
							save.push("{");
							for (let i in value) {
								let name = i.trim();
								if (!re.test(name)) throw new Error("Invalid property name.");
								save.push((n++ === 0 ? "" : ";")+name+":");
								if (name === "$" || name === "$$") {
									let test = new __Type(value[i]);
									let node = test.node ? test.value : null;
									if (node === null) throw new Error("Invalid property value.");
									save.push("'");
									for (let j = 0; j < node.length; j++) {
										let id  = "#"+node[j].id.trim();
										let tag = node[j].tagName.toLowerCase();
										let css = node[j].className.trim().replace(/\s+/g, ".");
										save.push(j > 0 ? "," : "");
										save.push(id !== "#" ? id : (tag + (css === "" ? "" : ".") + css));
									}
									save.push("'");
								}
								else {
									save = parse(value[i], save, false);
								}
							}
							save.push("}");
						}
						/*--------------------------------------------------------------*/
						else {
							save.push(String(value));
						}
						/*--------------------------------------------------------------*/
						return save;
					};
					/*----------------------------------------------------------------*/
					const note = parse(this._data, [], true);
					data = note.join("");
				}
			} catch(e) {console.log(e.message);}
			this._saved["arrayWD"] = data;
			return this.arrayWD;
		}
	},
	/**. '{object wdArray}: Transforma notação wd em um array de objetos semelhante a notação JSON exceto pelo seguinte:
	- o nome das propriedades do objeto não contem aspas e são compostos de caracteres alfanuméricos, traços e sublinhados;
	- por padrão, todos os valores são strings, exceto números, i{null}, i{true} e i{false}.
	- strings são delimitadas por aspas simples;
	- a aspa simples dentro da string é representada por duas aspas simples em sequência;
	- são permitidos como valores expressões regulares, seletores CSS de elementos e funções do escopo de window;
	- valores inválidos ou vazios para expressões regulares, seletores CSS e funções assumem o valor nulo;
	- a notação para expressão regular é semelhante à primitiva, os escapes devem ser duplos;
	- para referenciar função, definidas com i{var} ou i{function}, informe seu nome entre parenteses;
	- seletores CSS são alocados entre parênteses com os símbolos $ (elemento) ou $$ (lista) antecedendo a abertura;
	- se o array principal conter apenas um objeto, não é preciso adicionar as chaves inicial e final do objeto.
	. É possível referenciar um array de objetos no escopo de window informando o caractere # seguido do nome da variável.**/
	wdArray: {
		get: function() {
			if ("wdArray" in this._saved)
				return new __Parser(this._saved.wdArray);
			let data = null;
			try {
				if (this._check.string) {
					const note = this._data.normalize().trim();
					/*-- Referência para uma variável --------------------------------*/
					if ((/^\#.+$/).test(note)) {
						let list  = window[note.replace("#", "")];
						let check = new __Type(list);
						if (!check.array) throw new Error("Array not found.");
						for (let i = 0; i < list.length; i++) {
							let test = new __Type(list[i]);
							if (!test.object) throw new Error("Invalid item.");
						}
						this._saved["wdArray"] = list;
						return this.wdArray;
					}
					/*-- Ajustando o código e definindo verificações -----------------*/
					const code = [
						note[0]        === "{" ? "[" : "[{",
						note,
						note.slice(-1) === "}" ? "]" : "}]"
					].join("").split("");
					const last = code.length;
					let tag, val, txt;
					let find, rate, walk, name, test;
					let index = 0, count = 0;
					const tree = new __Tree();
					tree.xml = true;
					tree.open("wd");
					/*-- Circulando pelo código --------------------------------------*/
					while (index < last) {
						if (++count > 2*last) throw new Error("Many recursions.");
						val = code[index];
						tag = tree.level;
						txt = code.slice(index).join("");
						/*-- Tag externa (array) ---------------------------------------*/
						if (tag === "wd") {
							if (index === 0)
								tree.add("[").open("array");
							else
								tree.close();
							index += index === 0 ? 1 : last;
						}
						/*-- Array -----------------------------------------------------*/
						else if (tag === "array") {
							let reItem = /^\s*(\S)/;
							let reNext = /^\s*(\,\s*\]|\,|\])/;
							rate = null;
							if (reNext.test(txt)) {
								find = txt.match(reNext);
								rate = find[0].trim().slice(-1);
								walk = find[0].length;
							}
							else if (reItem.test(txt)) {
								find = txt.match(reItem);
								rate = find[0].trim();
								walk = find[0].length;
							}
							switch(rate) {
								case null: {throw new Error("wdArray - invalid array notation.");}
								case ",": {tree.add(", "); break;}
								case "]": {tree.close().add("]"); break;}
								case "[": {tree.add("[").open("array");  break;}
								case "{": {tree.add("{").open("object"); break;}
								case "/": {tree.open("regexp");   walk--; break;}
								case "'": {tree.open("string");   walk--; break;}
								case "(": {tree.open("function"); walk--; break;}
								case "$": {tree.open("node");     walk--; break;}
								default:  {tree.open("item");     walk--;}
							}
							index += walk;
						}
						/*-- Object ----------------------------------------------------*/
						else if (tag === "object") {
							let reName = /^\s*([a-z0-9_\-]+)\s*\:\s*(\S)/i;
							let reNext = /^\s*(\,\s*\}|\,|\})/;
							rate = null;
							if (reNext.test(txt)) {
								find = txt.match(reNext);
								rate = find[0].trim().slice(-1);
								walk = find[0].length;
							}
							else if (reName.test(txt)) {
								find = txt.match(reName);
								name = find[0].replace(reName, "$1");
								rate = find[0].replace(reName, "$2");
								walk = find[0].length;
								tree.add(`"${name}": `);
							}
							switch(rate) {
								case null: {throw new Error("wdArray - invalid object notation.");}
								case ",":  {tree.add(", "); break;}
								case "}":  {tree.close().add("}"); break;}
								case "{":  {tree.add("{").open("object"); break;}
								case "[":  {tree.add("[").open("array");  break;}
								case "/":  {tree.open("regexp");   walk--; break;}
								case "'":  {tree.open("string");   walk--; break;}
								case "(":  {tree.open("function"); walk--; break;}
								case "$":  {tree.open("node");     walk--; break;}
								default:   {tree.open("value");    walk--;}
							}
							index += walk;
						}
						/*-- Item (array) ou Value (object) ----------------------------*/
						else if (tag === "value" || tag === "item") {
							let lang = /^(true|false|null)$/;
							let div  = tag === "item" ? /^[^,\]]+/ : /^[^,}]+/;
							find = txt.match(div);
							rate = find === null ? null : find[0].trim();
							test = new __Type(rate);
							walk = find === null ? last : find[0].length;
							test = new __Type(rate);
							if (rate === null)
								throw new Error(`object: undefined ${tag} data.`);
							else if (test.finite)
								tree.add(test.toString()).close(tag);
							else if (lang.test(rate))
								tree.add(rate).close(tag);
							else
								tree.add(JSON.stringify(`${rate}`)).close(tag);
							index += walk;
						}
						/*-- Function --------------------------------------------------*/
						else if (tag === "function") {
							let reName = /^\(([^)]+)\)/;
							find = txt.match(reName);
							rate = find === null ? null : find[0].replace(reName, "$1").trim();
							walk = find === null ? last : find[0].length;
							if (rate === null)
								throw new Error("wdArray - invalid function notation.");
							else
								tree.add(JSON.stringify(`@function:${rate}`)).close();
							index += walk;
						}
						/*-- String ----------------------------------------------------*/
						else if (tag === "string") {
							rate = [];
							find = false;
							while(++index < last && !find) {
								if (code[index] === "'") {
									if (code[index+1] !== "'")
										find = true;
									else
										rate.push(code[++index]);
								}
								else {
									rate.push(code[index]);
								}
							}
							tree.add(JSON.stringify(rate.join(""))).close();
						}
						/*-- RegExp ----------------------------------------------------*/
						else if (tag === "regexp") {
							rate = [];
							find = false;
							let flag, char, scape, prop, text, open = 0;
							while(++index < last && !find) {
								char  = code[index];
								scape = code[index-1] === "\\";
								if (!scape && open < 1 && char === "[")
									open++;
								else if (!scape && open > 0 && char === "]")
									open--;
								else if (!scape && open < 1 && char === "/")
									find = true;
								if (!find) rate.push(char);
							}
							flag = code.slice(index).join("").match(/^[gim]*/);
							prop = {re: rate.join(""), flag: flag === null ? "" : flag[0]};
							text = `@regexp(${prop.flag}):${prop.re}`;
							tree.add(JSON.stringify(text)).close();
							index += prop.flag.length;
						}
						/*-- Nodes ----------------------------------------------------*/
						else if (tag === "node") {
							let reNode = /^\$\$?\(/;
							/*-- não inicia no formato $( ou $$( - retorna para item ou value --*/
							if (!reNode.test(txt)) {
								tree.close();
								tree.open(tree.level === "array" ? "item" : "value");
							}
							else {
								let all = txt.slice(0,2) === "$$";
								rate    = [];
								find    = 1;
								index  += all ? 2 : 1;
								let char, str = false;
								while(++index < last && find > 0) {
									char = code[index];
									if (!str) {
										str   = char === "'";
										find += char === "(" ? 1 : (char === ")" ? -1 : 0);
										rate.push(str ? "\"" : (find > 0 ? char : ""));
									}
									else {
										str = char !== "'";
										rate.push(!str ? "\"" : char);
									}
								}
								let query = all ?  "nodes" : "node";
								tree.add(JSON.stringify(`@${query}:${rate.join("")}`)).close();
							}
						}
					}

					/*--------------------------------------------------------------*/
					tree.finish();
					let json = JSON.parse(tree.toString());
					/*--------------------------------------------------------------*/
					const parse = function(item) {
						const check = new __Type(item);
						if (check.array) {
							for (let i = 0; i < item.length; i++)
								item[i] = parse(item[i]);
						}
						else if (check.object) {
							for (let i in item)
								item[i] = parse(item[i]);
						}
						else if (check.string) {
							let reExtra = {
								function: /^\@function\:(.*)$/,
								regexp:   /^\@regexp\(([gim]*)\)\:(.*)$/,
								node:     /^\@(nodes?)\:(.*)$/
							};
							if (reExtra.function.test(item)) {
								let name   = item.replace(reExtra.function, "$1");
								let method = typeof window[name] === "function";
								item = method ? window[name] : null;
							}
							else if (reExtra.regexp.test(item)) {
								let main = item.replace(reExtra.regexp, "$2");
								let flag = item.replace(reExtra.regexp, "$1");
								try      {item = new RegExp(main, flag);}
								catch(e) {item = null;}
							}
							else if (reExtra.node.test(item)) {
								let len  = item.replace(reExtra.node, "$1");
								let css  = item.replace(reExtra.node, "$2");
								let name = len === "nodes" ? "querySelectorAll" : "querySelector";
								try      {item = document[name](css);}
								catch(e) {item = null;}
								let test = new __Type(item);
								item = test.node && test.value.length > 0 ? item : null;
							}
						}
						return item;
					};
					data = parse(json);
				}
			}
			catch(e) {
				const msg = `wdArrayError: ${this._data}`;
				__UNDERMAINTENANCE ? console.error(e) : console.info(msg);
			}
			this._saved["wdArray"] = data;
			return this.wdArray;
		}
	},
	/**. '{object fileURL}: Transforma dados em string URL.**/
	fileURL: {
		get: function() {
			if ("fileURL" in this._saved)
				return new __Parser(this._saved.fileURL);
			let data = null;
			try {
				if (this._check.instanceOf("Blob") || this._check.instanceOf("File"))
					data = URL.createObjectURL(this._data);
			} catch(e) {}
			this._saved["fileURL"] = data;
			return this.fileURL;
		}
	},
	/**. '{object dataBlob}: Transforma dados em objeto Blob.**/
	dataBlob: {
		get: function() {
			if ("dataBlob" in this._saved)
				return new __Parser(this._saved.dataBlob);
			let data = null;
			try {
				const opt = {type: this._check.chars ? "text/plan" : "application/octet-stream"};
				data = new Blob([this._data], opt);
			} catch(e) {console.log(e);}
			this._saved["dataBlob"] = data;
			return this.dataBlob;
		}
	},
	/**. '{any get()}: Obtem o valor da transformação ou de entrada.**/
	get: {
		value: function() {return this._data;}
	},
	//FIXME não funciona, tem que estar fora de um objeto
	/**. '{void mixin(object supplier, array exceptions)}: Cópia as propriedades do __objeto__ definido em '{supplier} para o __objeto__ de entrada, exceto aquelas propriedades listadas em '{exceptions}.**/
	mixin: {
		value: function(supplier, exceptions) {
			if (!this.check.object) return;
			if (!__Type(supplier).object) return;
			if (!__Type(exceptions).array) exceptions = [];
			const names = Object.getOwnPropertyNames(supplier);
			for (let name of names) {
				if (exceptions.indexOf(name) < 0) {
					let desc = Object.getOwnPropertyDescriptor(supplier, name);
					Object.defineProperty(this.get, name, desc);
				}
			}
			return;
		}
	},
	/**. '{object wdComment(string open, string close)}: Segrega o código fonte do conteúdo definido entre os caracteres '{open} e '{close}. Retorna um objeto com as propriedades i{src} (código fonte), i{doc} (conteúdo segregado) e i{html} (documento HTML montado a partir do conteúdo segregado).**/
	wdComment: {
		value: function(open, close) {
			if (!this._check.string) return null;
			open  = open  === undefined ? "//" : String(open).normalize();
			close = close === undefined ? "\n" : String(close).normalize();
			const src  = [];
			const doc  = [];
			const data = this._data.trim().normalize();
			const list = data.split("");
			let txt, end, index = 0, type = "src";
			/*-- separar código e comentários ------------------------------------*/
			while (index < list.length) {
				end = index + (type === "src" ? open.length : close.length);
				txt = data.slice(index, end);
				if (type === "src" && txt === open) {
					src.push("\n");
					type  = "doc";
					index = end;
				}
				else if (type === "doc" && txt === close) {
					doc.push("\n");
					type = "src";
					index = end;
				}
				else {
					type === "doc" ? doc.push(data[index]) : src.push(data[index]);
					index++;
				}
			}
			return {
				src:  src.join("").replace(/\n+/g, "\n"),
				doc:  doc.join(""),
				get html() {return new __Parser(this.doc).wdDoc.get();}
			};
		}
	},
	/**. '{string wdDoc}: Transforma os dados segregados do método '{wdComment} em notação HTML (tag main) adotando as seguintes regras de notação:
	|Element|Tipo|Ocorrência|Descrição|
	|Citação|Bloco|Parágrafo|Inicia e termina com duas aspas duplas.|
	|Código|Bloco|Parágrafo|Inicia e termina com duas aspas simples.|
	|Tabela|Bloco|Linha|Inicia, termina e separa células com barra vertical, a primeira linha é o cabeçalho.|
	|Lista|Bloco|Linha|Inicia com "- " seguido do conteúdo.|
	|Descrição|Bloco|Linha|Inicia com ". " seguido do conteúdo.|
	|Títulos|Bloco|Linha|Inicia com "#0-6 " seguido do conteúdo.|
	|Mídia|Bloco|Linha|Inicia com "@MIMETYPE " seguido do link entre os caracteres "< >" e o texto em caso de falha.|
	|Parágrafo|Bloco|Linha|Quando não seguir as regras anteriores.|
	|Formatação|Em linha|Conteúdo|Nome da tag HTML seguindo do conteúdo limitado pelos caracteres "{ }".|
	- Se a descrição conter um caractere ":" intermediário, a parte anterior será título (dt) e a posterior a descrição (dd);
	- O número do título indica seu tipo, o valor zero cria um menu referenciando os títulos do tipo 3 a 5;
	- O valor MIMETYPE deve ser alterado conforme o tipo de arquivo a ser carregado;
	- A tag HTML i{code} pode ser abreviada por um caracteres de aspas simples;
	- Atributos de elementos em linha são informados após o caracter "}" delimitado por colchetes "[attr]" (opcional); e
	- Não é possível efetuar formatações dentro do conteúdo dos elementos em linha.**/
	wdDoc: {
		get: function() {
			if ("wdDoc" in this._saved)
				return new __Parser(this._saved.wdDoc);
			let data = null;
			try {
				if (this._check.string) {
					const menu = new __Tree();
					const note = this._data.trim().normalize();
					const code = note.split("\n");
					const tree = new __Tree();
					const type = {
						/*-- blocos múltiplas linhas --*/
						quote: /^(\"\")(.+)/,
						pre:   /^(\'\')(.+)/,
						/*-- blocos de consistência --*/
						table: /^\|(.+)\|$/,
						ul:    /^(\-)\s+(.+)$/,
						dl:    /^(\.)\s+(.+)$/,
						/*-- blocos de linha única --*/
						head:  /^\#([0-6])\s+(.+)$/,
						media: /^\@([a-z/]+)\s+\<([^>]+)\>(.*)$/i,
					};
					/*-- função para elementos inline --*/
					function inline(tree, input) {
						const code = input.split("");
						const find = /^([a-z\-0-9]+|\')\{([^}]+)\}(\[[^\]]+\])?/i;
						let txt, val, tag, index = 0;
						while (index < code.length) {
							tag = tree.level;
							txt = code.slice(index).join("");
							val = code[index];
							if (find.test(txt)) {
								let base = txt.match(find)[0];
								let elem = base.replace(find, "$1");
								let text = base.replace(find, "$2");
								let attr = base.replace(find, "$3").replace(/^\[/, "").replace(/\]$/, "");
								if (elem === "'") elem = "code";
								tree.open(`${elem} ${attr}`).add(text).close();
								index += base.length;
							} else {
								tree.add(val);
								index++
							}
						}
						return;
					};
					/*----------------------------------------------------------------*/
					let tag, txt, key, index = 0, title = -1;
					tree.xml = true;
					while (index < code.length) {
						tag = tree.level;
						txt = code[index].trim();
						key = null;
						for (let i in type)
							if (key === null && type[i].test(txt)) key = i;
						/*--------------------------------------------------------------*/
						if (tag === null) {
							switch(key) {
								/*-- blocos de consistência --*/
								case "table": {tree.open("table");      break;}
								case "ul":    {tree.open("ul");         break;}
								case "dl":    {tree.open("dl");         break;}
								/*-- blocos múltiplas linhas --*/
								case "pre":   {code[index] = txt.slice(2); tree.open("pre");        break;}
								case "quote": {code[index] = txt.slice(2); tree.open("blockquote"); break;}
								/*-- blocos de linha única --*/
								case "head":  {
									let head = Number(txt.replace(type.head, "$1"));
									let text = txt.replace(type.head, "$2").trim();
									let href = `head_${++title}`;
									if (head === 0)
										tree.open(`h3`).add(text).close().
										open("menu").add("%MENUITEM%").close();
									else
										tree.open(`h${head} id="${href}"`).add(text).close();
									if (head > 2 && head < 6)
										menu.open("li").add((". . . . ").repeat(head - 3))
										.open(`a href="#${href}"`).add(text).close().close();
									index++;
									break;
								}
								case "media":  {
									/^\@(image|audio|video)\s+\<([^>]+)\>(.*)$/
									let mime = txt.replace(type.media, "$1");
									let data = txt.replace(type.media, "$2");
									let text = txt.replace(type.media, "$3");
									tree.open(`object type="${mime}" data="${data}"`).add(text).close();
									index++;
									break;
								}
								default: {
									if (txt !== "")
										tree.open("p").add(inline(tree, txt)).close();
									index++;
								}
							}
						}
						/*--------------------------------------------------------------*/
						else if (tag === "table") {
							let th = txt.replace(type.table, "$1").split("|");
							tree.open("thead").open("tr");
							for (let i = 0; i < th.length; i++)
								tree.open("th").add(inline(tree, th[i])).close();
							tree.close().close().open("tbody");
							index++;
						}
						/*--------------------------------------------------------------*/
						else if (tag === "tbody") {
							if (key !== "table") {
								tree.close().close();
							}
							else {
								let td = txt.replace(type.table, "$1").split("|");
								tree.open("tr");
								for (let i = 0; i < td.length; i++)
									tree.open("td").add(inline(tree, td[i])).close();
								tree.close();
								index++;
							}
						}
						/*--------------------------------------------------------------*/
						else if (tag === "dl") {
							if (key !== "dl") {
								tree.close();
							}
							else {
								let re = /^([^:]+)\:(.+)$/;
								let dl = txt.replace(type.dl, "$2").trim();
								let dt = re.test(dl) ? dl.replace(re, "$1").trim() : null;
								let dd = re.test(dl) ? dl.replace(re, "$2").trim() : dl;
								if (dt !== null)
									tree.open("dt").add(inline(tree, dt)).close();
								tree.open("dd").add(inline(tree, dd)).close();
								index++;
							}
						}
						/*--------------------------------------------------------------*/
						else if (tag === "ul") {
							if (key !== "ul") {
								tree.close();
							} else {
								let li = txt.replace(type.ul, "$2");
								tree.open("li").add(inline(tree, li)).close();
								index++;
							}
						}
						/*--------------------------------------------------------------*/
						else if (tag === "pre") {
							let re  = /(\'\')$/;
							let end = re.test(txt);
							let pre = end ? txt.replace(re, "") : txt;
							tree.add(pre).add(end ? "" : "\n");
							if (end) tree.close();
							index++;
						}
						/*--------------------------------------------------------------*/
						else if (tag === "blockquote") {
							let re    = /(\"\")$/;
							let end   = re.test(txt);
							let quote = end ? txt.replace(re, "") : txt;
							tree.open("p").add(inline(tree, quote)).close();
							if (end) tree.close();
							index++;
						}
						else throw new Error("tag not found.")
					}
					tree.finish();
					menu.finish();
					data = tree.valueOf().replace("<menu>%MENUITEM%</menu>", `<menu>${menu.valueOf()}</menu>`);
				}
			}
			catch(e) {
				console.info(e)
			}
			this._saved["wdDoc"] = data;
			return this.wdDoc;
		}
	}
});