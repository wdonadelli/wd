/**
#3 Tabela
O objeto '{__TABLE} controla as alterações da tela atribuida a um tipo de dispositivo.
**/

const __TABLE = {

	//FIXME mudei o __LANG.user e HTML.lang e não mudou o formato
	/**. '{void body(node table, function view)}: Configura o '{tbody} da tabela.**/
	body: function(table, view) {
		const head  = table.tHead.firstElementChild.children;
		const rows  = table.tBodies[0].children;
		table.className = "css-js-wd-table";
		for (let r = 0; r < rows.length; r++) {
			let row  = rows[r];
			let cols = row.children;
			for (let c = 0; c < cols.length; c++) {
				let col  = cols[c];
				let text = new __Type(col.textContent);
				let info = {row: r, col: c, type: text.type, value: text.value, name: head[c].textContent};
				let data = new __Type(typeof view === "function" ? view(info) : {});
				__HTML(col, {
					dataset:     {wdTableText: col.textContent, wdTableType: text.type, wdTableValue: text.value},
					textContent: text.toLocaleString(data.object ? data.value : {}),
					style:       data.object && "style" in data.value ? data.value.style : "",
				});
			}
		}
		return;
	},
	/**. '{void head(node table)}: Configura o '{thead} da tabela.**/
	head: function(table) {
		const head = table.tHead.firstElementChild.children;
		const body = __HTML(table.tBodies[0], {"aria-live": "polite", id: __ID.value});
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

	attach: function(node, csv, caption, view) {
		const table = __CSV.parseTable(csv, true, false, false, caption);
		this.body(table, view);
		this.head(table);
		node.appendChild(__HTML(table));
	},
	/**. '{object filter(string check)}: Retorna os dados do filtro para checagem (ver método '{check}):
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
	|""Tipos de filtro de coluna""|**/
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
.css-js-wd-table thead > tr:first-child > th > button {
	appearance: none;
	width: 100%;
	cursor: pointer;
	color: inherit;
	background-color: transparent;
	border: 0;
	text-align: inherit;
	font-family: inherit;
	font-weight: inherit;
}

/*
.css-js-wd-table thead > tr:first-child > th > button {
	padding: 0.2em 1.2em;
	background-size: 1em 1em;
	background-repeat: no-repeat;
	background-position: -1.1em  50%;
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



.css-js-wd-table thead > tr:first-child > th > button:before,
.css-js-wd-table thead > tr:first-child > th > button:after {
	content: " ";
	display: inline-block;
	width: 1.5em;
	height: 1em;
	vertical-align: middle;
	background-size: 1em 1em;
	background-repeat: no-repeat;
	background-position: center;
	background-origin: content-box;
}
.css-js-wd-table thead > tr:first-child > th > button:focus:before,
.css-js-wd-table thead > tr:first-child > th > button:hover:before {
	background-image: var(--var-js-wd-bg-barrow);
}
.css-js-wd-table thead > tr:first-child > th[aria-sort="ascending"] > button:before {
	background-image: var(--var-js-wd-bg-barrow);
}
.css-js-wd-table thead > tr:first-child > th[aria-sort="descending"] > button:before {
	background-image: var(--var-js-wd-bg-tarrow);
}
.css-js-wd-table thead > tr:last-child > th {
	padding: 0
}
.css-js-wd-table thead > tr:last-child > th > input {
	width: 100%;

	text-align: right;
	text-align: inherit;
	font-family: inherit;
	font-weight: normal;
	border: thin solid;
	border-radius: var(--var-js-wd-panel-radius);
	color: inherit;
	background-color: inherit;
	background-size: 1em 1em;
	background-repeat: no-repeat;
	background-position: left;
	background-origin: content-box;
	background-image: var(--var-js-wd-bg-filter);
}




`);