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



	attach: function(node, csv, title, view) {
		const table = __CSV.parseTable(csv, true, false, false, title);
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
					style:       data.object && "stl" in data.value ? data.value.stl : "",
					className:   data.object && "css" in data.value ? data.value.css : "",
				});
			}
		}
		node.appendChild(__HTML(table));
	},






};
__CSS.push(`/*-- TABLE --*/
.css-js-wd-table {
	font-family: Verdana, sans-serif;
	font-size: 14px;
	border-collapse: collapse;
	border-radius: 0.5em;
	border: thin solid;
	margin: auto;
}
.css-js-wd-table thead th,
.css-js-wd-table tbody td {
	border: 1px solid rgba(125,125,125,0.2);
	padding: 0.2em 0.3em;
}

.css-js-wd-table thead th {
	text-align: center;
}
.css-js-wd-table tbody td {
	text-align: left;
}
.css-js-wd-table tbody td[data-wd-table-type="date"],
.css-js-wd-table tbody td[data-wd-table-type="time"],
.css-js-wd-table tbody td[data-wd-table-type="datetime"],
.css-js-wd-table tbody td[data-wd-table-type="number"] {
	text-align: right;
	color: green;
}
`);