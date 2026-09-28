/**
#3 Tabela
O objeto '{__TABLE} controla as alterações da tela atribuida a um tipo de dispositivo.
**/

const __TABLE = {

//FIXME mudei o __LANG.user e HTML.lang e não mudou o formato


	/**. '{object view(string input, object config)}: Retorna os dados para fins de configuração da visualização da célula, onde '{input} é o conteúdo textual e '{config} a respectiva configuração:
	|Propriedade|Tipo|Descrição|
	|'{data}|object|Retorno do contrutor '{__Type} para '{input}|
	|'{text}|string|Máscara de exibição da célula|
	|'{class}|string|Valor do attributo '{class} da célula|**/
	view: function(input, config) {
		const text = new __Type(input);
		const view = __Type(config).object ? config : {};
		const data = {data: text, text: text.toLocaleString(), class: ""};
		/*-- estilo vinculado a condicionais --*/
		["eq", "ne", "gt", "ge", "lt", "le"].forEach(function(v,i,a) {
			const check = new __Type(view[v]);
			if (check.type === text.type && (v+"v") in view) {
				if (v === "eq")
					data.class += text.value === check.value ? " "+view[v+"v"] : "";
				else if (v === "ne")
					data.class += text.value !== check.value ? " "+view[v+"v"] : "";
				else if (v === "gt")
					data.class += text.value   > check.value ? " "+view[v+"v"] : "";
				else if (v === "ge")
					data.class += text.value  >= check.value ? " "+view[v+"v"] : "";
				else if (v === "lt")
					data.class += text.value   < check.value ? " "+view[v+"v"] : "";
				else if (v === "le")
					data.class += text.value  <= check.value ? " "+view[v+"v"] : "";
			}
		});
		/*-- estilo vinculado à forma --*/
		if ((/date|time|datetime/).test(text.type))
			data.text = __DATETIME.locale(text._data, view);
		else if (text.type === "number")
			data.text = __NUMBER.locale(text.value, view);
		return data;
	},

	body: function(table) {
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

	head: function(table) {
		const head  = table.tHead.firstElementChild.children;
		for (let i = 0; i < head.length; i++) {
			let events = {click: this};
			let button = __HTML("button", {type: "button", textContent: head[i].textContent, addEventListener: events});
			head[i].innerHTML = "";
			head[i].appendChild(button);
		}
		return;
	},

	attach: function(node, csv, title, view) {
		const table = __CSV.parseTable(csv, true, false, false, title);
		this.body(table);
		this.head(table);
		node.appendChild(__HTML(table));
	},


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
			/*-- ordenar linhas --*/
			(order === -1 ? body.insertBefore(trA, trB) : body.insertBefore(trB, trA));
			return order;
		});
		return;
	},



	handleEvent: function(ev) {
		return ev.type in this ? this[ev.type](ev) : undefined;
	},




};
__CSS.push(`/*-- TABLE --*/
.css-js-wd-table {
	font-family: Verdana, sans-serif;
	font-size: 14px;
	border-collapse: collapse;
	border-spacing: 0;
	border-radius: 0.5em;
	border: thin solid;
	margin: auto;
}
.css-js-wd-table tbody tr:hover {
	border: thin dashed;
}


.css-js-wd-table thead th,
.css-js-wd-table tbody td {
	border: 1px solid rgba(125,125,125,0.2);
	padding: 0.2em 0.3em;
}
.css-js-wd-table thead th {text-align: center;}
.css-js-wd-table tbody td {text-align: left;}
.css-js-wd-table tbody td[data-wd-table-type="date"],
.css-js-wd-table tbody td[data-wd-table-type="time"],
.css-js-wd-table tbody td[data-wd-table-type="datetime"],
.css-js-wd-table tbody td[data-wd-table-type="number"] {
	text-align: right;
}

.css-js-wd-table thead th > button {
	width: 100%;
	/*padding: 0.2em 0.2em 0.2em 1em;*/
	cursor: pointer;
	background-color: transparent;
	border: 0;
	text-align: inherit;
	font-family: inherit;
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
	background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' ><path d='M 50,0 L 27.5,45 L 72.5,45 L 50,0 M 50,100 L 27.5,55 L 72.5,55 L 50,100' fill='gray' /></svg>");
}
.css-js-wd-table thead th[aria-sort="ascending"] > button:before {
	background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' ><path d='M 50,100 L 27.5,55 L 72.5,55 L 50,100' fill='gray' /></svg>");
}
.css-js-wd-table thead th[aria-sort="descending"] > button:before {
	background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' ><path d='M 50,0 L 27.5,45 L 72.5,45 L 50,0' fill='gray' /></svg>");
}
`);