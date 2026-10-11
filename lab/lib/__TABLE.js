/**
#3 Tabela
O objeto '{__TABLE} controla as alterações da tela atribuida a um tipo de dispositivo.
**/

const __TABLE = {

//FIXME mudei o __LANG.user e HTML.lang e não mudou o formato
//FIXME __Type("29/02/2020").toLocaleString() dá 01/03/2020


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
		const line = __HTML("tr");
		for (let i = 0; i < head.length; i++) {
			let cell   = __HTML("td");
			let find   = __HTML("input", {type: "search", "aria-label": `Search column ${i+1}`, addEventListener: {input: this}})
			let button = __HTML("button", {type: "button", textContent: head[i].textContent, addEventListener: {click: this}});
			head[i].innerHTML = "";
			head[i].appendChild(button);
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



	/**. '{object filter(string check)}: Retorna os dados do filtro para checagem:
	FIXME fazer a tabela das propriedades

	**/
	filter: function(check) {
		check = String(check).trim();
		const reLine = /^\s*\{\s*([1-9]\d*)([-/:])([1-9]\d*)\s*\}\s*$/;
		const reMath = /^([=!]\=|[<>]\=?)(.*)$/;
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




	check: function(rule, cell, row, rows) {
		const type  = cell.dataset.wdTableType;
		const value = type === "number" ? Number(cell.dataset.wdTableValue) : cell.dataset.wdTableValue;
		console.log(value, rule.check, rule.data)
		if (rule.check === "==") return value == rule.data.value;
		if (rule.check === "!=") return value != rule.data.value;
		if (rule.check === ">")  return value >  rule.data.value;
		if (rule.check === "<")  return value <  rule.data.value;
		if (rule.check === ">=") return value >= rule.data.value;
		if (rule.check === "<=") return value <= rule.data.value;
		if (rule.check === "re") return rule.data.test(cell.textContent.trim());
		//TODO linha i até linha n {i-n}
		if (rule.check === "-")  return (row+1 >= rule.data[0] && row+1 <= rule.data[1]);
		//TODO grupo i de n linhas {i:n} (progressão aritimética)
		if (rule.check === ":")  return (row >= (rule.data[0] - 1)*rule.data[1] && row < (rule.data[0])*rule.data[1]);
		//TODO página i de n páginas {i/n}
		if (rule.check === "/")  return this.check({check: ":", data: [rule.data[0], Math.ceil(rows/rule.data[1])]}, cell, row, rows);
		if (Array.isArray(rule.check)) {
			const data1 = this.check({check: rule.check[0], data: rule.data[0]}, cell, row, rows);
			const data2 = this.check({check: rule.check[1], data: rule.data[1]}, cell, line, rows);
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
	font-family: Verdana, sans-serif;
	font-size: smaller;
	border-collapse: collapse;
	border-spacing: 0;
	border-radius: 0.5em;
	border: thin solid;
	margin: auto;
	cursor: default;
}

.css-js-wd-table tbody tr:nth-of-type(2n+1) {background-color: transparent;}
.css-js-wd-table tbody tr:nth-of-type(2n)   {background-color: var(--var-js-wd-hover);}
.css-js-wd-table tbody:hover tr             {background-color: var(--var-js-wd-hover);}
.css-js-wd-table tbody:hover tr:hover       {background-color: transparent;}
.css-js-wd-table thead th,
.css-js-wd-table thead td,
.css-js-wd-table tbody td {
	border: var(--var-js-wd-panel-border);
	padding: 0.2em 0.3em;
}
.css-js-wd-table thead tr {
	border: thin solid;
}


.css-js-wd-table thead th {
	text-align: center;
	text-weight: bold;
}



.css-js-wd-table tbody td {
	text-align: left;
}

.css-js-wd-table tbody td[data-wd-table-type="date"],
.css-js-wd-table tbody td[data-wd-table-type="time"],
.css-js-wd-table tbody td[data-wd-table-type="datetime"],
.css-js-wd-table tbody td[data-wd-table-type="number"] {
	text-align: right;
}
.css-js-wd-table thead th > button {
	width: 100%;
	cursor: pointer;
	background-color: transparent;
	border: 0;
	text-align: inherit;
	font-family: inherit;
	font-weight: inherit;
	color: inherit;
}
.css-js-wd-table thead th > button:before,
.css-js-wd-table thead th > button:after {
	content: " ";
	display: inline-block;
	width: 1em;
	height: 1em;
	vertical-align: middle;
	background-size: auto auto;
	background-repeat: no-repeat;
	background-position: 50% 50%;
	background-origin: content-box;
}
.css-js-wd-table thead th > button:focus:before,
.css-js-wd-table thead th > button:hover:before {
	background-image: var(--var-js-wd-bg-barrow);
}
.css-js-wd-table thead th[aria-sort="ascending"] > button:before {
	background-image: var(--var-js-wd-bg-barrow);
}
.css-js-wd-table thead th[aria-sort="descending"] > button:before {
	background-image: var(--var-js-wd-bg-tarrow);
}

.css-js-wd-table thead td {
	position: relative;
	min-width: 5em;
	min-height: 2em;
}
.css-js-wd-table thead td > input {
	/*position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;*/
	appearance: none;
	border: none;
min-width: 5em;
	min-height: 2em;
	text-align: center;
	font-size: smaller;
}




`);