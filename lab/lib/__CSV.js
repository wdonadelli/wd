/**
#3 Tabelas
O objeto '{__CVS} tem por objetivo trabalhar com dados tabulares em texto ([CSV]<https://www.rfc-editor.org/rfc/rfc4180>):
- cada linha representa um registro;
- a quebra de linha pode ser no formato \r\n ou apenas \n;
- não é necessário existir quebra de linha no último registro;
- um registro é composto de campos;
- campos são separados por um caractere delimitador;
- não há caractere delimitador antes do primeiro campo nem após o último campo do registro;
- o caractere delimitador pode ser vírgula, ponto e vírgula, dois pontos, barra vertical, espaço ou tabulação;
- campos podem ser empacotados por aspas simples ou duplas;
- aspas simples em campo empacotados por aspas simples são representadas por duas aspas simples em sequência;
- aspas duplas em campo empacotados por aspas duplas são representadas por duas aspas duplas em sequência;
- o primeiro caractere após o primeiro campo do primeiro registro empacotado por aspas será o delimitador; e
- na situação anterior, outros caracteres poderão ser utilizados como delimitadores de campo;**/
const __CSV = {
	/**. '{array parse(string csv)}: Decodifica a entrada CSV para uma matriz 2x2:**/
	parse: function(csv) {
		const reader = {
			re: {
				quote:  /^\'((?:\'\'|[^'])*)(?:\'|$)/,
				quotes: /^\"((?:\"\"|[^"])*)(?:\"|$)/,
				unknow: /^([^\,\;\:\|\ \t\n]*)/,
				basic:  null,
			},
			/*-- definição de propriedades internas --*/
			start: function(csv) {
				this.i        = 0;
				this.char     = String(csv).normalize().replace(/\r\n/g, "\n").replace(/\n+$/, "");
				this.table    = [[]];
				this.re.basic = null;
				return this.next();
			},
			/*-- checagem de leitura de caractere --*/
			next: function() {
				const char = this.char[this.i];
				const name = char === "'" ? "quote" : (char === '"' ? "quotes" : (this.re.basic === null ? "unknow" : "basic"));
				this.cell(name);
				return this.i < this.char.length;
			},
			/*-- capturar células --*/
			cell: function(name) {
				const trim = {quote: {re: /\'\'/g, to: "'"}, quotes: {re: /\"\"/g, to: '"'}};
				const re   = this.re[name];
				const find = this.char.slice(this.i).match(re);
				const data = name in trim ? find[1].replace(trim[name].re, trim[name].to) : find[1];
				this.i    += find[0].length;
				return this.append(data);
			},
			/*-- adiciona registros e campos  --*/
			append: function(value) {
				/*-- adicionar valor --*/
				this.table[this.table.length - 1].push(value);
				/*-- capturar separador --*/
				if (this.re.basic === null)
					this.re.basic = new RegExp(`^([^${this.char[this.i]}\n]*)`);
				/*-- checando quebra de linha --*/
				if (this.char[this.i] === "\n")
					this.table.push([]);
				/*-- avançando no caractere --*/
				this.i++;
				/*-- retornando --*/
				return;
			},
			/*-- ajustar quantidade de campos e retornar lista --*/
			result: function() {
				/*-- capturando número de campos e ajustando quantidade --*/
				const len = this.table.reduce(function(max,v,i,a) {return v.length > max ? v.length : max;}, 0);
				return this.table.map(function(v,i,a) {
					while (v.length < len) v.push("");
					return v;
				});
			},
		};
		/*-- iniciando, lendo e retornando --*/
		reader.start(csv);
		while(reader.next());
		return reader.result();
	},
	/**. '{array list(string csv)}: Decodifica a entrada CSV para uma lista de objetos. Os nomes dos objetos correspondem ao título da coluna (primeira linha) e os valores às informações da respectiva coluna na linha específica. Evitar títulos repetidos para as colunas.**/
	list: function(csv) {
		const grid = this.parse(csv);
		const list = [];
		const head = {};
		for (let row = 1; row < grid.length; row++) {
			let data = {};
			for (let col = 0; col < grid[row].length; col++) {
				data[grid[0][col]] = grid[row][col];
			}
			list.push(data);
		}
		return list;
	},
	/**. '{node table(string csv, boolean head, boolean foot)}: Decodifica a entrada CSV para uma tabela HTML:
	|Argumento|Descrição|Padrão|
	|'{head}|Se verdadeiro, o primeiro registro será o cabeçalho da tabela|'{true}|
	|'{foot}|Se verdadeiro, o último registro será o rodapé da tabela|'{false}|**/
	table: function(csv, head, foot) {
		const grid  = this.parse(csv);
		const table = document.createElement("table");
		/*-- containers --*/
		if (head !== false) table.appendChild(document.createElement("thead"));
												table.appendChild(document.createElement("tbody"));
		if (foot === true)  table.appendChild(document.createElement("tfoot"));
		/*-- linhas e colunas --*/
		let td, tr;
		for (let row = 0; row < grid.length; row++) {
			tr = document.createElement("tr");
			for (let col = 0; col < grid[row].length; col++) {
				td = document.createElement(row === 0 && table.tHead !== null ? "th" : "td");
				td.textContent = grid[row][col];
				tr.appendChild(td);
			}
			if (row === 0 && table.tHead !== null)
				table.tHead.appendChild(tr);
			else if (row === grid.length - 1 && table.tFoot !== null)
				table.tFoot.appendChild(tr);
			else
				table.tBodies[0].appendChild(tr);
		}
		return table;
	},

	/**. '{string stringify(any data)}: Codifica uma matriz 2x2 ou uma tabela em código CSV.**/
	stringify: function(data) {




	},



	matrix: function(table) {
		if (!(table instanceof HTMLTableElement)) return null;
		/*-- ajustando span --*/
		Array.from(table.rows).forEach(function(row,r,list) {





		});


		/*-- retornando matriz --*/
		return Array.from(table.rows).map(function(row,r,ROW) {
			return Array.from(row.cells).map(function(cell,c,CELL) {
				return cell.textContent;
			});
		});
	},






















	/**. '{object tableMatrix}: Transforma tabela HTML em matriz 2x2.**/
	tableMatarix: {
		get: function() {
			if ("tableMatrix" in this._saved)
				return new __Parser(this._saved.tableMatrix);
			let data = null;
			if (this._table) {
				const matrix = Array.from(this._data.rows);
				for (let i = 0; i < matrix.length; i++)
				  matrix[i] = Array.from(matrix[i].cells);
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
};