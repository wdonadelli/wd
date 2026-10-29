/**
#3 Tabela

	O objeto '{__TABLE} tem como objetivo trabalhar com dados tabulares para gerar tabelas ou gráficos:
- A fonte de dados pode ser ser uma tabela HTML ou dados em CSV;
- A tabela gerada possui mecanismo de ordenação e filtros nas colunas;
- A ordenação é definida mediante clique na célula que contém o nome da coluna (primeira linha do cabeçalho);
- A coluna inicialmente é definida em ordem crescente, os cliques seguintes invertem a ordem anterior;
- Os filtros estão dispostos logo abaixo do nome da coluna (segunda linha do cabeçalho);
- Os filhos são caixas de entrada de texto que recebem determinados comandos;
- Dados numéricos e de data/tempo, nos termos da biblioteca, serão adaptados à linguagem definida;
- É possível evitar a adaptação à liguagem local para exibição dos dados brutos (propriedade '{raw});
- É possível definir o formato dos valores das células da tabela e sua estilizaçãoda por meio de uma função ('{format});
- A função '{format} pode definir tanto a exibição textual quanto o estilo CSS das células;
- A função '{format} não terá efeito para definir a exibição textual se escolhida a exibição de dados brutos;
- A formataçao da exibição textual é aplicada para valores numéricos e de data/tempo;
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
|'{row}|'{integer}|Número da linha a partir de 1|
|'{col}|'{integer}|Número da coluna a partir de 1|
|'{text}|'{string}|Valor bruto da célula|
|'{type}|'{string}|Tipo do dado conforme biblioteca (ver '{__Type.type})|
|'{value}|'{any}|Valor do dado padrão convertido conforme biblioteca (ver '{__Type.value})|
|'{name}|'{string}/'{integer}|Cabeçalho da coluna ou sua numeração|
|""Propriedades contendo os dados das células""|
	A função '{format} deverá retornar um objeto contendo as propriedades para estilização do valor da célula conforme o método '{toLocaleString} de '{__Type} e tipo de dado (numérico ou data/tempo).
	Para estilização da célula, a propriedade '{style} deverá ser definida no objeto retornado de '{format} contendo os estilos CSS a serem aplicados, podendo ser em forma de objeto ou '{string}.

#4 Tipos de Retorno

	Um objeto defnirá o tipo de retorno e sua configurações complementares. A propriedade '{table} ('{string}) define o tipo de retorno:
|Valor|Descrição|
|'{table}|Retorna uma tabela com dados adaptados à linguagem local (padrão)|
|'{raw}|Retorna uma tabela com os dados brutos|
|'{plan}|Retorna um gráfico em plano cartesiano|
|'{ratio}|Retorna um gráfico de setores ou de barras|
	As seguintes propriedades abaixo definem configurações complementares conforme valor de '{table}:
|Propriedade|Tipo|'{table}|Descrição|
|'{format}|'{function}|Todos|Recebe os dados de cada célula e devolve a configuração de exibição|
|'{title}|'{string}|Todos|Define o título da tabela ou do gráfico|
|'{xlabel}|'{string}|'{plan}|Define o rótulo do eixo '{x}|
|'{ylabel}|'{string}|'{plan}|Define o rótulo do eixo '{y}|
|'{xcol}|'{integer}|'{plan}|Define a coluna da tabela a ser utilizada como dados do eixo '{x}|
|'{ycols}|'{array}|'{plan}|Lista de inteiros definindo as colunas da tabela a serem utilizadas como dados do eixo '{y}|
|'{fit}|'{array}|'{plan}|Lista de '{strings} definindo o tipo de curva ou ajuste para cada coluna definida em '{ycols}|

xcol{1}ycols{2,3}fit{linear,dots}




**/

const __TABLE = {

	//FIXME mudei o __LANG.user e HTML.lang e não mudou o formato
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
	/**. '{node attach(any table, object data)}: Retorna uma tabela ou gráfico: FIXME mudar o nome do método
	|Argumento|Descrição|
	|'{table}|Uma tabela HTMl ou uma '{string} CSV contendo dados|
	|'{data}|Parâmetros para o retorno da tabela ou gráfico|
	|""Argumentos do método '{attach}""|


	- Os índices das colunas são inteiro iniciado em 1;


	, tipo de retorno, o argumento '{data} possui as seguintes propriedades:
	|Propriedade|Tipo|Descrição|Aplicação|
	|'{table}|'{string}|Define o tipo de retorno|'{local} (padrão), '{data}, ´{plan}, '{ratio}|
	|'{format}|'{function}|Fornece os dados das células da tabela e permite aplicar formatação||
	|'{labels}|'{array}|Define, nessa ordem, o título e os rótulos do eixo x e y do gráfico||


	**/





	attach: function(table, data) {
		data  = __Type(data).object ? data : {};
		table = table instanceof HTMLTableElement ? table : __CSV.parseTable(table, true, false, false, data.caption);
		this.body(table, data.format);
		this.head(table);
		return table;
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
		console.log(value, rule.check, rule.data)
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


	/*
	@csv{table}filter{function}
	@csv{plan}title{Título}labels{xLabel,yLabel}x{0}y{2:linear,3:avg,4:linear}

	@csv{plan}title{Título}xlabel{xLabel}ylabel{yLabel}x{0}y{2,3,4}fit{line,linear,avg}
	{csv: "plan", title: "Título", xlabel: "xLabel", ylabel: "yLabel", x: 0, y: [1,2,3], fit: ["line", "linear", "avg"]



	*/
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
	text-align: right;
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