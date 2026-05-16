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
	/**. '{array parse(string csv)}: Retorna o resultado do método '{parseMatrix}.**/
	parse: function(csv) {return this.parseMatrix(csv);},
	/**. '{array parseMatrix(string csv)}: Decodifica a entrada CSV e retorna uma matriz 2x2.**/
	parseMatrix: function(csv) {
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
	/**. '{array parseList(string csv)}: Decodifica a entrada CSV e retorna uma lista de objetos. Os nomes dos objetos correspondem ao título da coluna (primeira linha) e os valores às informações da respectiva coluna na linha específica. Evitar títulos repetidos para as colunas.**/
	parseList: function(csv) {
		const grid = this.parseMatrix(csv);
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
	/**. '{node parseTable(string csv, boolean head, boolean foot, boolean line, string caption)}: Decodifica a entrada CSV e retorna uma tabela HTML:
	|Argumento|Descrição|Padrão|
	|'{head}|Se verdadeiro, o primeiro registro será o cabeçalho da tabela|'{true}|
	|'{foot}|Se verdadeiro, o último registro será o rodapé da tabela|'{false}|
	|'{line}|Se verdadeiro, a primeira célula de cada linha do corpo da tabela será o título da linha|'{false}|
	|'{caption}|Se definido, a tabela conterá uma legenda||**/
	parseTable: function(csv, head, foot, line, caption) {
		/*-- ajustando argumentos --*/
		head = head !== false;
		foot = foot === true;
		line = line === true;
		caption = typeof caption === "string" ? caption : null;
		/*-- constantes --*/
		const grid  = this.parseMatrix(csv);
		const table = document.createElement("table");
		/*-- containers --*/
		if (head)
			table.createTHead();
		table.createTBody();
		if (foot)
			table.createTFoot();
		if (caption !== null)
			table.createCaption().textContent = caption;
		/*-- linhas e colunas --*/
		let td, tr, th, node, type;
		for (let row = 0; row < grid.length; row++) {
			/*-- linha --*/
			tr   = document.createElement("tr");
			type = (row === 0 && head) ? "head" : ((row === grid.length - 1 && foot) ? "foot" : "body");
			node = type === "head" ? table.tHead : (type === "foot" ? table.tFoot : table.tBodies[0]);
			node.appendChild(tr);
			/*-- colunas --*/
			for (let col = 0; col < grid[row].length; col++) {
				th = type === "head" ? "col" : (type === "body" && col === 0 && line ? "row" : null)
				td = document.createElement(th === null ? "td" : "th");
				td.textContent = grid[row][col];
				if (th !== null) td.scope = th;
				tr.appendChild(td);
			}
		}
		return table;
	},
	/**. '{string stringify(any data)}: Codifica uma matriz 2x2 ou uma tabela em código CSV.**/
	stringify: function(data) {
		if (Array.isArray(data) && Array.isArray(data[0]))
			return this.matrixCSV(data);
		if (Array.isArray(data) && typeof data[0] === "object" && data[0] !== null)
			return this.matrixCSV(this.listMatrix(data));
		if (data instanceof HTMLTableElement)
			return this.matrixCSV(this.tableMatrix(data));
		return "";
	},
	/**. '{string matrixCSV(array matrix)}: Codifica uma matriz 2x2 em código CSV.**/
	matrixCSV: function(matrix) {
		let max = 0;
		/*-- filtrando apenas itens array --*/
		return matrix.filter(function(v,i,a) {
			const check = Array.isArray(v);
			max = check && v.length > max ? v.length : max;
			return check;
		})
		/*-- codificando para CSV --*/
		.map(function(row,r,ROW) {
			while(row.length < max) row.push("");
			return '"' + row.map(function(col,c,COL) {
				return String(col).replace(/\"/g, '""');
			}).join('","') + '"';
		}).join("\r\n");
	},
	/**. '{string listMatrix(array list)}: Transforma uma lista de objetos em matriz 2x2.**/
	listMatrix: function(list) {
		const matrix = [[]];
		/*-- capturando cabeçalho e filtrando objetos --*/
		list.filter(function(v,i,a) {
			if (typeof v === "object" && v !== null) {
				for (let name in v) {
					if (matrix[0].indexOf(name) < 0)
						matrix[0].push(name);
				}
				return true;
			}
			return false;
		})
		/*-- capturando células --*/
		.forEach(function(v,i,a) {
			if (i > 0) {
				const col = Array(matrix[0].length).fill("");
				for (let name in v)
					col[matrix[0].indexOf(name)] = v[name];
				matrix.push(col);
			}
		});
		return matrix;
	},
	/**. '{node tableAdjust(node table)}: Retorna uma cópia tabela HTML eliminando os efeitos dos atributos '{rowSpan} e '{colSpan}.**/
	tableAdjust: function(table) {
		const matrix = table.cloneNode(true);
		/*-- número máximo de colunas --*/
		const limit  = Array.from(matrix.rows).reduce(function(num,row,r,ROW) {
			let col = row.cells;
			let len = -1;
			while(++len < col.length)
				if (col[len].colSpan > 1) return num;
			return len > num ? len : num;
		}, 0);
		/*-- ajustando colSpan --*/
		Array.from(matrix.rows).forEach(function(row,r,ROW) {
			Array.from(row.cells).forEach(function(col,c,COL) {
				while (col.colSpan > 1) {
					let td = col.cloneNode();
					td.colSpan = 1;
					/*-- não adicionando colunas além do limite --*/
					if (limit === 0 || row.childElementCount < limit)
						(col.nextElementSibling === null ? row.appendChild(td) : row.insertBefore(td, col.nextElementSibling));
					col.colSpan--;
				}
			});
		});
		/*-- ajustando rowSpan --*/
		Array.from(matrix.rows).forEach(function(row,r,ROW) {
			Array.from(row.cells).forEach(function(col,c,COL) {
				/*-- não adicionar linhas além das já existentes --*/
				if (col.rowSpan > 1) {
					const td = col.cloneNode();
					const tr = row.nextElementSibling;
					td.rowSpan  = col.rowSpan - 1;
					col.rowSpan = 1;
					/*-- não adicionando linhas além do limite --*/
					if (tr !== null)
						tr.insertBefore(td, tr.children[c === 0 ? 0 : c]);
				}
			});
		});
		return matrix;
	},
	/**. '{array tableMatrix(node table, boolean text)}: Transforma as células de um tabela HTML em matriz 2x2. O argumento '{text}, se falso, definirá como valor o nó da célula no lugar de seu conteúdo textual.**/
	tableMatrix: function(table, text) {
		const matrix = this.tableAdjust(table);
		return Array.from(matrix.rows).map(function(row,r,ROW) {
			return Array.from(row.cells).map(function(col,c,COL) {
				return text === false ? col : col.textContent;
			});
		});
	},
























//FIXME o que fazer com esses métodos?
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