/**
#3 Tabela

	O objeto '{__TABLE} tem como objetivo trabalhar com dados tabulares para gerar tabelas ou gráficos:
- A fonte de dados pode ser ser uma tabela HTML ou dados em CSV;
- A identificação numérica das linhas e colunas iniciam em um (1);
- A tabela gerada possui mecanismo de ordenação e filtragem das colunas;
- A ordenação é definida mediante clique na célula que contém o nome da coluna (primeira linha do cabeçalho);
- A coluna inicialmente é definida em ordem crescente, os cliques seguintes invertem a ordem anterior;
- Os filtros estão dispostos logo abaixo do nome da coluna (segunda linha do cabeçalho);
- Os filhos são caixas de entrada de texto que recebem determinados comandos;
- Dados numéricos e de data/tempo, nos termos da biblioteca, serão adaptados à linguagem definida pela biblioteca;
- É possível evitar a adaptação à liguagem local para exibição dos dados brutos;
- É possível definir o formato dos valores das células da tabela e sua estilização por meio da função '{format};
- A função '{format} pode definir tanto a exibição textual quanto o estilo das células;
- A função '{format} não terá efeito para definir a exibição textual no caso de exibição de dados brutos;
- A formatação da exibição textual é aplicada para valores numéricos e de data/tempo;
- Propriedades específicas definem o tipo de retorno e configurações complementares; e
- Ao retornar um gráfico, nenhuma tabela será gerada ou estilizada se a fonte de dados for uma '{string} CSV.

#4 Do Mecanismo de Filtragem

	Os seguintes mecanismos de filtragem de dados de coluna estão disponíveis:
|Filtro|Descrição|Condição|
|var{=x}|Exibe a linha da coluna que seja igual a var{x}||
|var{!x}|Exibe a linha da coluna que seja diferente de var{x}||
|var{/x/}|Exibe a linha da coluna que case com a expressão regular var{x}|Aceita a i{flag} var{i}|
|var{>x}|Exibe a linha da coluna que seja maior que var{x}||
|var{>=x}|Exibe a linha da coluna que seja maior ou igual a var{x}||
|var{<x}|Exibe a linha da coluna que seja menor que var{x}||
|var{<=x}|Exibe a linha da coluna que seja menor ou igual a var{x}||
|var{[a,b]}|Exibe a linha da coluna que case com o conjunto fechado|var{a <= x <= b}|
|var{]a,b[}|Exibe a linha da coluna que case com o conjunto aberto|var{a < x < b}|
|var{i-n}|Exibe as linhas de var{i} a var{n}|var{i > 0, n > 0, n >= i}|
|var{i:n}|Divide a tabela em grupos de var{n} linhas exibindo o grupo var{i}|var{i > 0, n > 0}|
|var{i/n}|Divide a tabela em var{n} páginas exibindo a página var{i}|var{i > 0, n > 0, i <= n}|
|""Tipos de filtro de coluna""|

#4 A Função de Estilização

	A função '{format} recebe um objeto com as seguintes propriedades:
|Propriedade|Tipo|Descrição|
|'{row}|'{integer}|Número da linha|
|'{col}|'{integer}|Número da coluna|
|'{text}|'{string}|Valor bruto da célula|
|'{type}|'{string}|Tipo do dado conforme biblioteca (ver '{__Type.type})|
|'{value}|'{any}|Valor padrão do dado conforme biblioteca (ver '{__Type.value})|
|'{name}|'{string}/'{integer}|Nome da coluna ou sua identificação numérica|
|""Propriedades contendo os dados das células""|
	A função '{format} deverá retornar um objeto contendo as propriedades para estilização do valor da célula conforme o método '{toLocaleString} de '{__Type} e tipo de dado (numérico ou data/tempo).
	Para estilização da célula, deverá ser definida a propriedade '{style} no objeto retornado de '{format} contendo os estilos CSS a serem aplicados, podendo ser em forma de objeto ou '{string}.

#4 Tipos de Retorno

	Um objeto definirá o tipo de retorno e suas configurações complementares por meio da propriedade '{table} ('{string}):
|Valor|Descrição|
|'{local}|Retorna uma tabela com dados adaptados à linguagem local (padrão)|
|'{raw}|Retorna uma tabela com os dados brutos|
|'{plan}|Retorna um gráfico em plano cartesiano|
|'{pie}|Retorna um gráfico de setores|
|'{bar}|Retorna um gráfico de barras|
	Uma propriedade u{com o mesmo nome} do valor de '{table} deverá ser informada contendo os dados complementares.
	Nos casos de '{local} e '{raw}, uma '{string} definirá o título da tabela.
	No caso de '{plan}, uma lista definirá as propriedades do gráfico conforme segue:
	|Item|Tipo|Descrição|
	|0|'{string}|Título do gráfico|
	|1|'{string}|Rótulo do eixo x|
	|2|'{string}|Rótulo do eixo y|
	|3|'{integer}|Número da coluna que contém os dados do eixo x|
	|4|'{integer}|Número da coluna que contém os dados do eixo y|
	|5|'{string}|Tipo de curva a ser aplicada ao conjunto de dados anterior|
	Outras curvas podem ser adicionados acrescentando mais itens à lista com o mesmo padrão dos itens 4 e 5.
	No caso de '{pie} ou '{bar}, uma lista definirá as propriedades do gráfico conforme segue:
	|Item|Tipo|Descrição|
	|0|'{string}|Título do gráfico|
	|1|'{string}|Tipo de análise|
	|2|'{integer}|Número da coluna que contém o conjunto de dados|
	Outros conjuntos de dados podem ser adicionados acrescentando mais itens à lista com o mesmo padrão do item 3.**/

const __TABLE = {
	/**. '{void body(node table, function format, boolean raw)}: Configura o '{tbody} da tabela:
	|Argumento|Descrição|
	|'{table}|Tabela HTML|
	|'{format}|Função que recebe os dados da célula e retorna o estilo de exibição|
	|'{raw}|Se verdadeiro, exibirá os dados brutos|**/
	body: function(table, format, raw) {
		raw = raw === true;
		const head  = table.tHead ? table.tHead.firstElementChild.children : null;
		const rows  = table.tBodies[0].children;
		table.className = "css-js-wd-table";
		for (let r = 0; r < rows.length; r++) {
			let row  = rows[r];
			let cols = row.children;
			for (let c = 0; c < cols.length; c++) {
				let col  = cols[c];
				let base = col.textContent;
				let text = new __Type(base);
				let info = {row: r+1, col: c+1, text: base, type: text.type, value: text.value, name: head ? head[c].textContent : c+1};
				let data = new __Type(typeof format === "function" ? format(info) : {});
				__HTML(col, {
					dataset:     {wdTableText: base, wdTableType: text.type, wdTableValue: text.value},
					textContent: raw ? base : text.toLocaleString(data.object ? data.value : {}),
					style:       data.object && "style" in data.value ? data.value.style : "",
				});
			}
		}
		return;
	},
	/**. '{void head(node table)}: Configura o '{thead} da tabela.**/
	head: function(table) {
		/*-- criar cabeçalho se a tabela não tiver um --*/
		if (!table.tHead) {
			const line = __HTML("tr");
			for (let i = 0; i < table.tBodies[0].childElementCount; i++)
				line.appendChild(__HTML("th", {textContent: `#${i+1}`}));
			table.createTHead().appendChild(line);
		};
		/*-- criar controles de filtro e ordenação --*/
		const head = table.tHead.firstElementChild.children;
		const body = __HTML(table.tBodies[0], {"aria-live": "polite", "aria-atomic": "false", id: __ID.value});
		const line = __HTML("tr", {"aria-label": "Filters"});
		for (let i = 0; i < head.length; i++) {
			let text = `Search column ${i+1}`;
			let attr = {type: "search", "aria-label": text, "aria-controls": body.id, addEventListener: {input: this}};
			let cell = __HTML("th");
			let find = __HTML("input", attr);
			let sort = __HTML("button", {type: "button", textContent: head[i].textContent, addEventListener: {click: this}});
			head[i].innerHTML = "";
			head[i].appendChild(sort);
			cell.appendChild(find);
			line.appendChild(cell);
		}
		table.tHead.appendChild(line);
		return;
	},
	/**. '{node attach(any table, object data)}: Retorna uma tabela ou gráfico.**/
	attach: function(table, data) {
		data  = __Type(data).object ? data : {};
		const caption = data.table in data ? data[data.table] : ("local" in data ? data.local : "");
		const tabular = table instanceof HTMLTableElement ? table : __CSV.parseTable(table, true, false, false, caption);
		this.body(tabular, data.format, data.table === "raw");
		this.head(tabular);
		if (data.table === "plan" && Array.isArray(data.plan)) {
			const plot = {
				title: data.plan[0],
				x: {label: data.plan[1], data: this.column(tabular, data.plan[3]).value},
				y: {label: data.plan[2], dataset: []},
			};
			for (let i = 4; i < data.plan.length; i = i + 2) {
				let column = this.column(tabular, data.plan[i]);
				plot.y.dataset.push({name: column.name, data: column.value, fit: data.plan[i + 1]});
			}
			return __PLOT2D.plot(plot);
		}
		else if ((data.table === "pie" || data.table === "bar") && Array.isArray(data[data.table])) {
			const ratio = data.table === "pie" ? data.pie : data.bar;
			const plot  = {title: ratio[0], type: ratio[1], view: data.table, dataset: []};
			for (let i = 2; i < ratio.length; i++) {
				let column = this.column(tabular, ratio[i]);
				plot.dataset.push({name: column.name, data: column.value});
			}
			return __PLOT2DRATIO.plot(plot);
		}
		return tabular;
	},

	/**. '{object column(node table, integer col)}: Retorna os dados da coluna especificada da tabela. Se a coluna for menor que 1, os dados da primeira coluna serão retornados; se for maior que o número de colunas, o dados da última coluna serão retornados:
	|Propriedade|Tipo|Descrição|
	|'{name}|'{string}|Título da coluna|
	|'{value}|'{array}|Valores da coluna|**/
	column: function(table, col) {
		col = isNaN(col) ? 1 : Number(col);
		const head = table.tHead.firstElementChild.children;
		const rows = Array.from(table.tBodies[0].children);
		const find = col < 1 ? 0 : (col > head.length ? head.length - 1 : Math.trunc(col) - 1);
		return {
			name:  head[find].textContent,
			value: rows.map(function(v,i,a) {return v.children[find].getAttribute("data-wd-table-value");})
		};
	},
	/**. '{object filter(string check)}: Retorna os dados do filtro para checagem (ver método '{check}).**/
	filter: function(check) {
		check = String(check).trim();
		const reLine = /^\s*([1-9]\d*)([-/:])([1-9]\d*)\s*$/;
		const reMath = /^([=!]|[<>]\=?)(.*)$/;
		const reRExp = /^\/(.+)\/([gim]+)?$/i;
		const reEnds = /^(\[|\])([^,]+)\,([^\[\]]+)(\[|\])$/;
		/*-- testando condições --*/
		if (check.length === 0) return null;
		/*-- condicionais matemáticas --*/
		if (reMath.test(check)) {
			const find = check.match(reMath);
			return find[2].trim().length > 0 ? {check: find[1], data: new __Type(find[2].trim())} : null;
		}
		/*-- expressão regular --*/
		if (reRExp.test(check)) {
			const find = check.match(reRExp);
			return {check: "re", data: new RegExp(find[1], find[2] ? find[2] : "")};
		}
		/*-- intervalo --*/
		if (reEnds.test(check)) {
			const find = check.match(reEnds);
			return {
				check: [find[1] === "[" ? ">=" : ">", find[4] === "]" ? "<=" : "<"],
				data: [new __Type(find[2].trim()), new __Type(find[3].trim())]};
		}
		/*-- linhas --*/
		if (reLine.test(check)) {
			const find = check.match(reLine);
			return {check: find[2], data: [Number(find[1]), Number(find[3])]};
		}
		/*-- outras --*/
		return null;
		return {check: "==", data: new __Type(check)};
	},
	/**. '{boolean check(string rule, node cell, integer row, integer rows)}: Retorna verdadeiro se o conteúdo de '{cell} casar com a condição de '{rule} (ver método '{filter}):**/
	check: function(rule, cell, row, rows) {
		const type  = cell.dataset.wdTableType;
		const value = type === "number" ? Number(cell.dataset.wdTableValue) : cell.dataset.wdTableValue;
		if (rule.check === "=")  return value == rule.data.value;
		if (rule.check === "!")  return value != rule.data.value;
		if (rule.check === ">")  return value >  rule.data.value;
		if (rule.check === "<")  return value <  rule.data.value;
		if (rule.check === ">=") return value >= rule.data.value;
		if (rule.check === "<=") return value <= rule.data.value;
		if (rule.check === "re") return rule.data.test(cell.textContent.trim());
		if (rule.check === "-")  return (row+1 >= rule.data[0] && row+1 <= rule.data[1]);
		if (rule.check === ":")  return (row >= (rule.data[0] - 1)*rule.data[1] && row < (rule.data[0])*rule.data[1]);
		if (rule.check === "/")  return this.check({check: ":", data: [rule.data[0], Math.ceil(rows/rule.data[1])]}, cell, row, rows);
		if (Array.isArray(rule.check)) {
			const data1 = this.check({check: rule.check[0], data: rule.data[0]}, cell, row, rows);
			const data2 = this.check({check: rule.check[1], data: rule.data[1]}, cell, row, rows);
			return data1 && data2;
		}
		return true;
	},
	/**. '{void input(object ev)}: Evento para exibir as células que casam com os filtros.**/
	input: function(ev) {
		const cell = ev.currentTarget.parentElement;
		const cols = Array.from(cell.parentElement.children);
		const body = cell.parentElement.parentElement.parentElement.tBodies[0];
		const rows = Array.from(body.children);
		const rule = cols.map(function(v,i,a) {return this.filter(v.firstElementChild.value);},this);
		/*-- looping pelas linhas --*/
		rows.forEach(function(row,r,R) {
			row.hidden = false;
			const child = row.children;
			/*-- looping pelas células --*/
			for (let i = 0; i < child.length; i++) {
				if (rule[i] === null) continue;
				row.hidden = !this.check(rule[i], child[i], r, rows.length);
				if (row.hidden) return;
			}
		}, this);
		return;
	},
	/**. '{void click(object ev)}: Evento para ordenar a coluna quando clicada.**/
	click: function(ev) {
		const main = ev.currentTarget.parentElement;
		const head = Array.from(main.parentElement.children);
		const body = main.parentElement.parentElement.parentElement.tBodies[0];
		const list = Array.from(body.children);
		const sort = main.getAttribute("aria-sort") === "ascending" ? -1 : 1;
		const item = head.indexOf(main);
		/*-- adequar cabeçalho --*/
		head.forEach(function(v,i,a) {
			return v !== main ? v.removeAttribute("aria-sort") : v.setAttribute("aria-sort", sort === 1 ? "ascending" : "descending");
		});
		/*-- ordenar --*/
		list.sort(function(trA,trB) {
			const line  = ["number", "time", "date", "datetime", "string"]
			const cellA = trA.children[item];
			const cellB = trB.children[item];
			const typeA = cellA.dataset.wdTableType;
			const typeB = cellB.dataset.wdTableType;
			const dataA = typeA === "number" ? Number(cellA.dataset.wdTableValue) : cellA.dataset.wdTableValue;
			const dataB = typeB === "number" ? Number(cellB.dataset.wdTableValue) : cellB.dataset.wdTableValue;
			let order = 0;
			if (typeA === typeB)
				order = dataA < dataB ? -sort : sort;
			else if ((/date(time)?/).test(typeA) && (/date(time)?/).test(typeB))
				order = dataA < dataB ? -sort : sort;
			else
				order = line.indexOf(typeA) < line.indexOf(typeB) ? -sort : sort;
			return order;
		});
		/*-- ordenar linhas --*/
		list.forEach(function(v,i,a) {body.appendChild(v);});
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador do objeto.**/
	handleEvent: function(ev) {
		return ev.type in this ? this[ev.type](ev) : undefined;
	},
};
__CSS.push(`/*-- TABLE --*/
.css-js-wd-table {
	font-family: var(--var-js-wd-font-family);
	font-size: smaller;
	border-collapse: collapse;
	border: var(--var-js-wd-panel-border);
	cursor: default;
  width: calc(100% - 1em);
	margin: 0.5em auto;
}
/*-- linhas --*/
.css-js-wd-table tbody tr:nth-of-type(even) {
	background-color: transparent;
}
.css-js-wd-table tbody tr:nth-of-type(odd) {
	background-color: var(--var-js-wd-hover);
}
.css-js-wd-table tbody:hover tr {
	background-color: transparent;
}
.css-js-wd-table tbody tr:hover {
	background-color: var(--var-js-wd-hover);
}
/*-- células --*/
.css-js-wd-table th,
.css-js-wd-table td {
	border: var(--var-js-wd-panel-border);
}
.css-js-wd-table thead th {
	text-align: center;
	font-weight: bold;
	padding: 0;
}
.css-js-wd-table tbody td {
	text-align: left;
	padding: 0.2em 0.3em;
}
.css-js-wd-table tbody td[data-wd-table-type="date"],
.css-js-wd-table tbody td[data-wd-table-type="time"],
.css-js-wd-table tbody td[data-wd-table-type="datetime"],
.css-js-wd-table tbody td[data-wd-table-type="number"] {
	text-align: right;
}
/*-- ordenação --*/
.css-js-wd-table thead > tr:first-child > th > button {
	appearance: none;
	width: 100%;
	cursor: pointer;
	color: inherit;
	background-color: transparent;
	border: 0;
	text-align: center;
	font-family: var(--var-js-wd-font-family);
	font-weight: bold;
	padding: 0.2em 1.2em;
	background-size: 1em 1em;
	background-repeat: no-repeat;
	background-position: -1.1em 50%;
	background-origin: content-box;
}
.css-js-wd-table thead > tr:first-child > th > button:focus,
.css-js-wd-table thead > tr:first-child > th > button:hover {
	background-image: var(--var-js-wd-bg-barrow);
}
.css-js-wd-table thead > tr:first-child > th[aria-sort="ascending"] > button {
	background-image: var(--var-js-wd-bg-barrow);
}
.css-js-wd-table thead > tr:first-child > th[aria-sort="descending"] > button {
	background-image: var(--var-js-wd-bg-tarrow);
}
*/

/*-- filtro --*/
.css-js-wd-table thead > tr:last-child > th {
	padding: 0
}
.css-js-wd-table thead > tr:last-child > th > input {
	width: 100%;
	text-align: center;
	font-family: var(--var-js-wd-font-family);
	font-weight: normal;
	border: thin solid;
	border-radius: var(--var-js-wd-panel-radius);
	color: inherit;
	padding: 0.2em 0.3em 0.2em 1.2em;
	background-color: inherit;
	background-size: 1em 1em;
	background-repeat: no-repeat;
	background-position: -1.1em 50%;
	background-origin: content-box;
	background-image: var(--var-js-wd-bg-filter);
}`);