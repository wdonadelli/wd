/**
#3 Transformação de Dados
O constructor '{__Parser} efetua transformação de dados informados como argumento. Se a transformação falhar, os atributos retornarão nulo. Todos as propriedades retornam uma nova instância do objeto i{__Parser} com o resultado da transformação anterior com o objetivo de fazê-las em cadeia. Utilize o método i{get} ao fim das trasformações para obter seu valor.
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
			} catch(e) {}
			this._saved["dataBlob"] = data;
			return this.dataBlob;
		}
	},

	/**. '{object wdEncode}: Codifica uma string em uma sequência de unicode.**/
	wdEncode: {
		get: function() {
			if ("wdEncode" in this._saved)
				return new __Parser(this._saved.wdEncode);
			let data = null;
			try {
				const list = String(this._data).normalize("NFC").split("");
				data = list.map(function(v,i,a) {return "%"+v.charCodeAt(0).toString("16");}).join("");
			} catch(e) {console.log(e)}
			this._saved["wdEncode"] = data;
			return this.wdEncode;
		}
	},
	/**. '{object wdDecode}: Decodifica o resultado de '{wdEncode}.**/
	wdDecode: {
		get: function() {
			if ("wdDecode" in this._saved)
				return new __Parser(this._saved.wdDecode);
			let data = null;
			try {
				const list = String(this._data).normalize("NFC").replace("%", "").split("%");
				data = list.map(function(v,i,a) {return String.fromCharCode(parseInt(v, 16));}).join("");
			} catch(e) {console.log(e)}
			this._saved["wdDecode"] = data;
			return this.wdDecode;
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
});