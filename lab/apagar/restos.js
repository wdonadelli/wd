


//FIXME apagar essas porcarias no fim
function __strCamel(x) {return __String(x).camel;}
function __strClear(x) {return __String(x).clear;}
function __finite(value) {
	let input = __Type(value);
	return input.finite;
}

/*----------------------------------------------------------------------------*/
	/**
	`node __$$$(object obj, node root)`
	Localiza em um objeto os atributos v{$}v e v{$$}v e utiliza seus valores como seletores CSS.}p
	O atributo v{$$}v é prevalente sobre o v{$}v para fins de chamada das funções i{__$$}i ou i{__$}i,
 respectivamente.
	v{obj}v - Objeto javascript contendo os atributos v{$}v ou v{$$}v.
	v{root}v - (opcional, i{document}i) Elemento base para busca.}d}l
	**/
	function __$$$(obj, root) {
		let one =  "$" in obj ? String(obj["$"]).trim()  : null;
		let all = "$$" in obj ? String(obj["$$"]).trim() : null;
		let key = {"document": document, "window":  window};
		if (one !== null && one in key) one = key[one];
		if (all !== null && all in key) all = key[all];
		return all === null ? __$(one, root) : __$$(all, root);
	}




/*----------------------------------------------------------------------------*/
	function wd_copy(value) { /* copia o conteúdo da variável para a área de transferência */
		/* copiar o que está selecionado */
		if (value === undefined && "execCommand" in document) {
			document.execCommand("copy");
			return true;
		}
		/* copiar DOM: elemento ou tudo */
		let data = wd_vtype(value);
		if (data.type === "dom" && "execCommand" in document) {
			let element = data.value.length > 0 ? data.value[0] : document.body;
			let range   = document.createRange();
			let select  = window.getSelection();
			select.removeAllRanges();          /* limpar seleção existente */
			range.selectNodeContents(element); /* pegar os nós do elemento */
			select.addRange(range);            /* seleciona os nós do elemento */
			document.execCommand("copy");      /* copia o texto selecionado */
			select.removeAllRanges();          /* limpar seleção novamente */
			return true;
		}

		/* array e object: JSON */
		if (data.type === "array" || data.type === "object")
			value = wd_json(value);

		/* copiar valor informado */
		if ("clipboard" in navigator && "writeText" in navigator.clipboard) {
			navigator.clipboard.writeText(value === null ? "" : value).then(
				function () {/*sucesso*/},
				function () {/*erro*/}
			);
			return true;
		}

		return false;
	}



/*----------------------------------------------------------------------------*/
	function wd_replace_all(input, search, change) { /* replaceAll simples */
		search = new String(search);
		change = new String(change);
		let x = input.split(search);
		return x.join(change);
	}

/*----------------------------------------------------------------------------*/
	function wd_apply_getters(obj, args) { /* auto-aplica getter em objeto ???????????????????? */
		let type   = obj.type; /* tipo do objeto original */
		let value  = null;     /* valor a ser retornado */
		let object = obj;

		for (let i = 0; i < args.length; i++) {
			/* continuar se o atributo não existir */
			if (!(args[i] in object)) continue;
			let vtype = wd_vtype(object[args[i]]);
			/* continuar se o valor for diferente do tipo original */
			if (vtype.type !== type) continue;
			object = new object.constructor(vtype);
			value  = vtype.value;
		}
		return value;
	}

/*----------------------------------------------------------------------------*/
	function wd_num_str(n, ratio) { /* Define a exibição de valores numéricos */
		if (ratio === true) n = 100*n;
		if (wd_test(n, ["infinity"]))
			return (n < 0 ? "\u2212" : "\u002B")+"\u221E";

		let end = ratio === true ? "\u0025" : "";
		let val = Math.abs(n);

		if (val === 0) return "0"+end;
		if ((1/val) > 1) {
			if (val <= 1e-10) return n.toExponential(0)+end;
			if (val <= 1e-3)  return n.toExponential(1)+end;
			if (val <= 1e-2)  return wd_num_fixed(n,2,0)+end;
		} else {
			if (val >= 1e10) return n.toExponential(0)+end;
			if (val >= 1e3)  return n.toExponential(1)+end;
			if (val >= 1e2)  return wd_num_fixed(n,0,0)+end;
			if (val >= 1e1)  return wd_num_fixed(n,1,0)+end;
		}
		return wd_num_fixed(n,2,0)+end;
	}

/*----------------------------------------------------------------------------*/
	function wd_matrix_cell(matrix, cell) { /* obtem lista de valores ade matriz a partir de endereço linha:coluna */
		/* celula linha:coluna */
		cell = new String(cell).trim().split(":");
		if (cell.length < 2) cell.push("");

		/* i: célula inicial, n: célula final */
		let row  = {i: -Infinity, n: Infinity};
		let col  = {i: -Infinity, n: Infinity};
		let list = [];
		let item = [row, col];

		/* definindo parâmetros para captura da linha (0) e coluna (1) */
		for (let i = 0; i < item.length; i++) {
			if ((/^[0-9]+$/).test(cell[i])) { /* unico endereço */
				item[i].i = __integer(cell[i]);
				item[i].n = __integer(cell[i]);
			} else if ((/^\-[0-9]+$/).test(cell[i])) { /* do início até o endereço */
				item[i].n = __integer(cell[i].replace("-", ""));
			} else if ((/^[0-9]+\-$/).test(cell[i])) { /* do endereço até o fim */
				item[i].i = __integer(cell[i].replace("-", ""));
			} else if ((/^[0-9]+\-[0-9]+$/).test(cell[i])) { /* do endereço inicial até o final */
				let gap   = cell[i].split("-");
				item[i].i = __integer(gap[0]);
				item[i].n = __integer(gap[1]);
			}
		}

		/* obtendo valores */
		for (let r = 0; r < matrix.length; r++) {
			let check = wd_vtype(matrix[r]);
			if (check.type !== "array") continue;
			for (let c = 0; c < matrix[r].length; c++) {
				if (r >= row.i && r <= row.n && c >= col.i && c <= col.n)
					list.push(matrix[r][c]);
			}
		}

		return list;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_cells(matrix, values) { /* obtem lista a partir de múltiplas referências */
		let data = [];
		for (let i = 0; i < values.length; i++) {
			values[i] = new String(values[i]).toString();
			values[i] = wd_replace_all(values[i], " ", "");
			let items = wd_matrix_cell(matrix, values[i]);
			for (let j = 0; j < items.length; j++) data.push(items[j]);
		}
		return data;
	}


/*----------------------------------------------------------------------------*/
	function wd_array_csv(array) { /* transforma um array em dados CSV */
		let csv = [];

		for (let i = 0; i < array.length; i++) {
			let line = array[i];
			let type = wd_vtype(line).type;

			if (type === "array") {
				for (let j = 0; j < line.length; j++)
					line[j] = String(line[j]).replace(/\t/g, " ").replace(/\n/g, " ");
			} else {
				line = [String(line).replace(/\t/g, " ").replace(/\n/g, " ")];
			}

			csv.push(line.join("\t"));
		}

		return csv.join("\n");
	}

/*----------------------------------------------------------------------------*/
	function wd_matrix_data(matrix, x, y) { /* retorna dados estatísticos de uma matriz */
		x = wd_matrix_cell(matrix, x);
		y = wd_matrix_cell(matrix, y);
		return {
			get cmp()  {return wd_coord_compare(x, y, false);},
			get rlin() {return wd_coord_rlin(x, y);},
			get rexp() {return wd_coord_rexp(x, y);},
			get rgeo() {return wd_coord_rgeo(x, y);},
			get rsum() {return wd_coord_rsum(x, y);},
			get ravg() {return wd_coord_ravg(x, y);},
			get sum()  {return wd_coord_sum(x, 1).value;},
			get min()  {return wd_coord_limits(x).min;},
			get max()  {return wd_coord_limits(x).max;},
			get avg()  {return wd_coord_avg(x);},
			get med()  {return wd_coord_med(x);},
			get geo()  {return wd_coord_geo(x);},
			get harm() {return wd_coord_harm(x);},
			dev: function(n) {return wd_coord_deviation(x, this[n]);}
		};
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_adjust(x, y, z) { /* retorna pares de coordenadas numéricas */
		let coord = {x: [], y: [], z: [], length: 0};
		/* checando se argumentos são arrays (x é obrigatório) */
		if (wd_vtype(x).type !== "array") return null;
		if (wd_vtype(y).type !== "array") y = null;
		if (wd_vtype(z).type !== "array") z = null;

		/* verificando conteúdo (deve ser numérico */
		let n = x.length;
		if (y !== null && y.length < n) n = y.length;
		if (z !== null && z.length < n) n = z.length;
		for (let i = 0; i < n; i++) {
			let xtype = wd_vtype(x[i]);
			let ytype = y === null ? null : wd_vtype(y[i]);
			let ztype = z === null ? null : wd_vtype(z[i]);
			if (!__finite(xtype.value)) continue;
			if (y !== null && !__finite(ytype.value)) continue;
			if (z !== null && !__finite(ztype.value)) continue;

			coord.x.push(xtype.value);
			if (y !== null) coord.y.push(ytype.value);
			if (z !== null) coord.z.push(ztype.value);
			coord.length++;
		}

		/* definindo valor final */
		if (y === null) coord.y = null;
		if (z === null) coord.z = null;
		return coord.length === 0 ? null : coord;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_sum(x, nx, y, ny, z, nz ) { /* retorna a soma de coordernadas */
		let coord = wd_coord_adjust(x, y, z);
		if (coord === null) return null;
		x = coord.x;
		y = coord.y;
		z = coord.z;
		let data = {value: 0, length: 0};
		for (let i = 0; i < coord.length; i++) {
			let vx = Math.pow(x[i],nx);
			let vy = y === null ? 1 : Math.pow(y[i],ny);
			let vz = z === null ? 1 : Math.pow(z[i],nz);
			if (!__finite(vx) || !__finite(vy) || !__finite(vz)) continue;
			data.value += vx * vy * vz;
			data.length++;
		}
		return data.length === 0 ? null : data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_product(x, nx) { /* retorna o produto da coordernada */
		let coord = wd_coord_adjust(x);
		if (coord === null) return null;
		x = coord.x;
		let data = {value: 1, length: 0};
		for (let i = 0; i < coord.length; i++) {
			let vx = Math.pow(x[i], nx);
			if (vx === 0 || !__finite(vx)) continue;
			data.value = data.value * vx;
			data.length++;
		}
		return data.length === 0 ? null : data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_limits(x) { /* retorna os maiores e menores valores da lista */
		let coord = wd_coord_adjust(x);
		if (coord === null) return null;
		x = wd_array_sort(coord.x);
		return {min: x[0], max: x.reverse()[0]};
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_ravg(x, y) { /* calcula a média da área embaixo das retas que ligam os pontos */
		let sum = wd_coord_rsum(x, y);
		if (sum === null) return null
		let end = wd_coord_limits(x);
		let avg = sum.b / (end.max - end.min);
		let data = {};
		data.e = "(\u03A3y\u0394x)/\u0394x \u2248 b";
		data.a = 0;
		data.b = avg;
		data.f = function(x) {return data.b;};
		data.d = 0;
		data.m = wd_coord_rmath(data.e, data.a, data.b, data.d);
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_continuous(xcoord, func, delta) { /* retorna coordenadas (x,y) a partir de uma função de regressão */
		if (wd_vtype(func).type !== "function") return null;
		let ends = wd_coord_limits(xcoord);
		if (ends === null) return null;
		delta = wd_vtype(delta).value;
		if (!__finite(delta)) delta = (ends.max - ends.min)/xcoord.length;
		delta = Math.abs(delta);

		/* obtendo amostra */
		let x = [];
		while (ends.min < ends.max) {
			x.push(ends.min);
			ends.min += delta;
		}
		x.push(ends.max);

		let y = wd_coord_setter(x, func);
		let c = wd_coord_adjust(x, y);
		if (c === null) return null;
		return {x: c.x, y: c.y};
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_compare(x, y, list) { /* compara dados entre dois arrays x,y */
		if (wd_vtype(x).type !== "array" || wd_vtype(y).type !== "array")
			return null;
		/* organizando dados */
		let data = {};
		let sum  = 0;
		for (let i = 0; i < x.length; i++) {
			if (i > (y.length-1)) break;
			let vtype = wd_vtype(y[i]);
			if (vtype.type !== "number") continue;
			let name = new String(x[i]).trim();
			if (name === "") name = "?";
			if (!(name in data)) {
				data[name] = {
					amt: vtype.value,
					occ: 1,
					avg: vtype.value,
				};
			} else {
				data[name].amt += vtype.value;
				data[name].occ++;
				data[name].avg = data[name].amt/data[name].occ;
			}
			sum += vtype.value;
		}
		/* obtendo outros dados */
		for (let name in data) {
			data[name].per = sum === 0 ? 0 : data[name].amt/sum;
		}
		if (list === true) {
			let obj = {sum: sum, x: [], amt: [], avg: [], occ:[], per: []};
			for (let i in data) {
				obj.x.push(i);
				for (let j in data[i]) obj[j].push(data[i][j]);
			}
			return obj;
		}
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_matrix_object(array) { /* matriz de array para objeto*/
		let x = [];
		for (let row = 1; row < array.length; row++) {
			let cols = array[row];
			x.push({});
			for (let col = 0; col < cols.length; col++) {
				x[row-1][array[0][col]] = array[row][col];
			}
		}
		return x;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_vform(list) { /* checar a validade de um conjunto de formulários */
		for (let i = 0; i < list.length; i++) {
			let data = new WDform(list[i]);
			if (data.submit() === false) return false;
		}
		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_dform(list, get) { /* obtém serialização de formulário */
		/* se houver algum elemento inválido, retornar */
		if (!wd_html_vform(list)) return null;
		/* obtendo pacote de dados */
		let data = {};
		for (let e = 0; e < list.length; e++) {
			let form  = new WDform(list[e]);
			let value = form.data;
			if (value === null) continue;
			for (let i in value)
				data[i] = get === true ? value[i].GET : value[i].POST;
		}
		/* montando pacote de dados */
		let isGET  = (get === true || !("FormData" in window)) ? true : false;
		let submit = isGET ? [] : new FormData();
		for (let i in data) {
			if (isGET) submit.push(i+"="+data[i]);
			else submit.append(i, data[i]);
		}
		return isGET ? submit.join("&") : submit;
	}


/*----------------------------------------------------------------------------*/
	function wd_dom_run(method) { /* função vinculada ao construtor WDdom para executar rotina sobre os elementos */
		/* checando argumentos obrigatórios */
		if (wd_vtype(method).type !== "function") return null;
		/* obtendo argumentos secundários */
		let args = [null];
		for (let i = 1; i < arguments.length; i++)
			args.push(arguments[i]);
		/* looping nos elementos */
		let query = this.valueOf();
		for (let i = 0; i < query.length; i++) {
			let x = query[i];
			if (x !== window && x.nodeType !== 1 && x.nodeType !== 9) continue;
			/* informando elemento como primeiro argumento */
			args[0] = x;
			method.apply(null, args);
		}
		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_table_array(elem) { /* transforma os dados de uma tabela (table) em matriz */
		let tag = wd_html_tag(elem);
		if (["tfoot", "tbody", "thead", "table"].indexOf(tag) < 0) return null;
		let data = [];
		let rows = elem.rows;
		for (let row = 0; row < rows.length; row++) {
			let cols = wd_vtype(rows[row].children).value;
			if (data[row] === undefined) data.push([]);
			for (let col = 0; col < cols.length; col++) {
				if (data[row][col] === undefined) data[row].push([]);
				let val = wd_vtype(cols[col].textContent);
				if (val.type === "time") val = wd_time_iso(val.value); else
				if (val.type === "date") val = wd_date_iso(val.value);
				else val = val.value;
				data[row][col] = val;
			}
		}
		return data;
	}



/*----------------------------------------------------------------------------*/
	function wd_html_translate(elem, json) { /* carrega tradução vinculada a seletor CSS em arquivo JSON */
		/* FORMATO DO JSON
		[
			{"$$": "CSS Selectors", "$":  "CSS Selector", "textContent": "Text", "title": "Title"},
			...
		]
		*/
		/* rodando itens do array do JSON */
		for (let i = 0; i < json.length; i++) {
			let attrs = json[i];
			let check = wd_vtype(__$$$(attrs, elem));
			if (check.type !== "dom") continue;
			/* rodando alvos */
			let list = check.value;
			for (let l = 0; l < list.length; l++) {
				let target = list[l];
				/* rodando atributos */
				for (let attr in attrs) {
					if (attr === "$" || attr === "$$") continue;
					let value = attrs[attr];
					wd_html_set(target, attr, value);
				}
			}
		}
		return;
	}

/*----------------------------------------------------------------------------*/
	function wd_url(name) { /* obtém o valores da URL */
		/* obter somente o hash */
		if (name === undefined || name === null)
			return null;
		if (typeof name !== "string" || name.trim() === "")
			return null;
		if (name === "*")
			return document.URL;
		if (name === ":")
			return window.location.protocol.replace(/\:$/, "");
		if (name === "@")
			return window.location.host;
		if (name === "$")
			return window.location.hostname;
		if (name === "/")
			return window.location.pathname.replace(/^\//, "");
		if (name === "#")
			return window.location.hash.replace(/^\#/, "");
		if (name === "?")
			return window.location.search.replace(/^\?/, "");

		let data = window.location.search.replace(/^\?/, "").split(name+"=");
		return data.length < 2 ? null : decodeURIComponent(data[1].split("&")[0]);
	}

/*----------------------------------------------------------------------------*/
	function wd_html_chart(elem, data, title, xlabel, ylabel) {
		/* constroe um gráfico a partir de um conjuto de dados [{x: [], y:[], label: "", type:""}]*/
		let compare = true;
		let chart   = new WDchart(elem, title);
		for (let i = 0; i < data.length; i++) {
			if (data[i].type !== "compare") compare = false;
			chart.add(data[i].x, data[i].y, data[i].label, data[i].type);
		}
		return chart.plot(xlabel, ylabel, compare);
	}


/*----------------------------------------------------------------------------*/
	function wd_notify(title, msg) { /* exibe uma notificação, se permitido */
		if (!("Notification" in window))
			return __SIGNALCONTROL.open(msg, title);
		if (Notification.permission === "denied")
			return null;
		if (Notification.permission === "granted")
			new Notification(title, {body: msg});
		else
			Notification.requestPermission().then(function(x) {
				if (x === "granted")
					new Notification(title, {body: msg});
			});
		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_test(input, list) { /* testa, em uma lista de possibilidades, se o valor casa em uma delas */
		let x     = wd_vtype(input);
		let check = [x.type];
		/* deixando a lista toda em minúsculo */
		for (let i = 0; i < list.length; i++)
			list[i] = String(list[i]).toLowerCase();

		/* testando valores especiais */
		switch (x.type) {
			case "boolean":
				check.push(x.value === true ? "+boolean" : "-boolean")
				break;

			case "number":
				let abs = Math.abs(x.value);

				if (x.value > 0) check.push("+number");
				if (x.value < 0) check.push("-number");
				if (abs === 0) {
					check.push("zero");
				} else if (abs === Infinity) {
					check.push("infinity");
					check.push(x.value > 0 ? "+infinity" : "-infinity");
				} else if (abs === __integer(abs)) {
					check.push("integer");
					check.push(x.value > 0 ? "+integer" : "-integer");
				} else {
					check.push("float");
					check.push(x.value > 0 ? "+float" : "-float");
				}
				break;
			case "text":
				if (x.value === x.value.toUpperCase()) check.push("+text");
				if (x.value === x.value.toLowerCase()) check.push("-text");
				break;
			case "time":
				let now = wd_vtype(wd_str_now()).value;
				if (x.value > now) check.push("+time");
				if (x.value < now) check.push("-time");
				break;
			case "date":
				let today = wd_set_date();
				if (x.value > today) check.push("+date");
				if (x.value < today) check.push("-date");
				break;
		}

		/* testando as possibilidades válidas */
		for (let i = 0; i < check.length; i++)
			if (list.indexOf(check[i]) >= 0) return true;

		/* se não casou, retornar false */
		return false;
	}

/*----------------------------------------------------------------------------*/
	function wd_svg_create(type, attr) { /* cria elementos SVG genéricos com medidas relativas */
		if (attr === undefined) attr = {};
		/* Propriedades a serem definidas em porcentagem */
		let ref  = [
			"x", "y", "x1", "x2", "y1", "y2", "height", "width", "cx", "cy", "r", "dx", "dy"
		];

		let elem = document.createElementNS("http://www.w3.org/2000/svg", type);
		for (let i in attr) {/* definindo atributos */
			let val = attr[i];
			if (i === "tspan" || i === "title") {/* texto ou dicas */
				if (val !== null) {
					let info = wd_svg_create(i);
					info.textContent = val;
					elem.appendChild(info);
				}
			} else { /* atributos */
				if (ref.indexOf(i) >= 0 && __finite(val))
					val = new String(val).toString()+"%";
				elem.setAttribute(i, val);
			}
		}
		return elem;
	}

/*----------------------------------------------------------------------------*/
	function wd_svg_dots(cx, cy, r, title, color) { /* cria pontos: coordenada no centro */
	 	return wd_svg_create("circle", {
			cx: cx, cy: cy, r: r, fill: color, title: title
		});
	}

/*----------------------------------------------------------------------------*/
	function wd_svg_line(x1, y1, x2, y2, width, title, color) { /* cria linhas: coordenadas no início e fim */
		return wd_svg_create("line", {
			x1: x1, y1: y1, x2: x2, y2: y2,
			stroke: color,
			"stroke-width":     width === 0 ? "1px" : width+"px",
			"stroke-dasharray": width === 0 ? "1,5" : "0",
			title: title
		});
	}

/*----------------------------------------------------------------------------*/
	function wd_svg_rect(x1, y1, x2, y2, title, color) { /* cria retângulos: coordenadas nos cantos opostos */
		return wd_svg_create("rect", {
			x:       x2 > x1 ? x1 : x2,
			y:       y2 > y1 ? y1 : y2,
			width:   x2 > x1 ? x2-x1 : x1-x2,
			height:  y2 > y1 ? y2-y1 : y1-y2,
			fill:    color,
			title:   title,
			opacity: 0.9,
		});
	}

/*----------------------------------------------------------------------------*/
	function wd_svg_label(x, y, text, point, vertical, color, bold) {
		/* cria textos: coordenadas na âncora (point) */
		let vanchor = ["start", "middle", "end"];
		let vbase   = ["auto", "middle", "hanging"];
		let anchor  = {n: 1, ne: 2, e: 2, se: 2, s: 1, sw: 0, w: 0, nw: 0, c: 1};
		let base    = {n: 2, ne: 2, e: 1, se: 0, s: 0, sw: 0, w: 1, nw: 2, c: 1};
		point       = point in base ? point : "c" ;
		return wd_svg_create("text", {
			x: x, y: y,
			fill: color,
			"text-anchor": vanchor[anchor[point]],
			"dominant-baseline": vbase[base[point]],
			"font-size": "0.8em",
			"font-family": "monospace",
			"transform": vertical === true ? "rotate(270)" : "",
			"font-weight": bold === true ? "bold" : "normal",
			tspan: text,
		});
	}

/* == BLOCO 2 ================================================================*/

/*----------------------------------------------------------------------------*/
	function WDform(elem) { /* objeto para analisar campos de formulários */
		this.e = elem;
	};
	Object.defineProperties(WDform.prototype, {
		vdate: { /* valida e formata campo de data, se vazio "", se inválido null */
			get: function() {
				if (this.e.value === "") return "";
				let check = wd_vtype(this.e.value);
				return check.type === "date" ? wd_date_iso(check.value) : null;
			}
		},
		vdatetime: { /* valida e formata campo de data e tempo, se vazio "", se inválido null */
			get: function() {
				if (this.e.value === "") return "";
				let date = wd_vtype(this.e.value.substr(0, 10));
				let time = wd_vtype(this.e.value.substr(11));
				let div  = this.e.value.substr(10, 1);
				if (!(/^[T ]$/i).test(div)) return null; /* dateTtime | date time */
				if (date.type === "date" && time.type === "time")
						return wd_date_iso(date.value)+"T"+wd_time_iso(time.value)
				return null
			}
		},
		vmonth: { /* valida e formata campo de mês, se vazio "", se inválido null*/
			get: function() {
				if (this.e.value === "") return "";
				let data = [
					{re: /^[0-9]{4}\-[0-9]{2}$/, m: {i: 5, e: 2}, y: {i: 0, e: 4}}, /* YYYY-MM */
					{re: /^[0-9]{2}\/[0-9]{4}$/, m: {i: 0, e: 2}, y: {i: 3, e: 4}}, /* MM/YYYY */
					{re: /^[0-9]{2}\.[0-9]{4}$/, m: {i: 0, e: 2}, y: {i: 3, e: 4}}  /* MM.YYYY */
				];
				for (let i = 0; i < data.length; i++) {
					if (!(data[i].re.test(this.e.value))) continue;
					let month = __integer(this.e.value.substr(data[i].m.i, data[i].m.e));
					let year  = __integer(this.e.value.substr(data[i].y.i, data[i].y.e));
					if (month >= 1 && month <= 12 && year >= 1)
						return wd_num_fixed(year, 0, 4)+"-"+wd_num_fixed(month, 0, 2);
				}
				return null;
			}
		},
		vweek: { /* valida e formata campo de semana, se vazio "", se inválido null */
			get: function() {
				if (this.e.value === "") return "";
				let data = [
					{re: /^[0-9]{4}\-W[0-9]{2}?$/i, w: {i: 6, e: 2}, y: {i: 0, e: 4}}, /* YYYY-Www */
					{re: /^[0-9]{2}\,\ [0-9]{4}$/,  w: {i: 0, e: 2}, y: {i: 4, e: 4}}, /* ww, YYYY */
				];
				for (let i = 0; i < data.length; i++) {
					if (!(data[i].re.test(this.e.value))) continue;
					let week = __integer(this.e.value.substr(data[i].w.i, data[i].w.e));
					let year = __integer(this.e.value.substr(data[i].y.i, data[i].y.e));
					if (week >= 1 && week <= 53 && year >= 1)
						return wd_num_fixed(year, 0, 4)+"-W"+wd_num_fixed(week, 0, 2);
				}
				return null;
			}
		},
		vtime: { /* valida e formata campo de tempo, se vazio "", se inválido null */
			get: function() {
				if (this.e.value === "") return "";
				let check = wd_vtype(this.e.value);
				return check.type === "time" ? wd_time_iso(check.value) : null;
			}
		},
		vnumber: { /* valida e formata campo numérico, se vazio "", se inválido null */
		get: function() {
				if (this.e.value === "") return "";
				let check = wd_vtype(this.e.value);
				return check.type === "number" ? this.e.value.trim() : null;
			}
		},
		vfile: { /* retorna valores do campo de arquivos */
			get: function() {
				if ("files" in this.e) return this.e.files;
				let val = this.e.value.trim();
				return val === "" ? [] : [{name: val}];
			}
		},
		vselect: { /* retorna a lista das opções selecionadas, se vazio não submeter, undefined */
			get: function() {
				let value = [];
				for (let i = 0; i < this.e.length; i++)
					if (this.e[i].selected)
						value.push(this.e[i].value.replace(/\,/g, "").trim());
				return value.length > 0 ? value : [];
			}
		},
		vcheck: { /* retorna o valor se checado, caso contrário não submeter, undefined */
			get: function() {
				return this.e.checked ? this.e.value : undefined;
			}
		},
		vemail: { /* retorna uma array de endereços de email, ou null se houver algum inválido*/
			get: function() {
				/* se vazio retornar lista vazia */
				let mail = this.e.value.trim().replace(/(\s+)?\,(\s+)?/g, ",");
				if (mail === "") return [];
				/* se navegador contempla email, retornar o que ele decidir */
				let list = mail.split(",");
				let attr = this.attr("type", true, false);
				if (attr.elem === "email") return list;
				/* caso contrário, verificar lista de email... */
				let re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
				for (let i = 0; i < list.length; i++)
					if (!re.test(list[i])) return null;
				return list;
			}
		},
		vurl: { /* retorna um url, ou null se inválido*/
			get: function() {
				let url = this.e.value.trim();
				if (url === "") return "";
				if (!("URL" in window)) return url;
				try {
					let check = new URL(url);
					return check.toString();
				} catch(e) {
					return null;
				}
				return null;
			}
		},
		attr: { /* obtem atributos do elemento e faz alterações especiais */
			value: function(attr, lower, std) {
				let value = {
					html: attr in this.e.attributes ? this.e.attributes[attr].value : null,
					elem: attr in this.e            ? this.e[attr] : null,
				};
				for (let i in value) {
					if (value[i] === null) continue;
					if (lower === true)
						value[i] = value[i].toLowerCase();
					if (std === true) {
						value[i] = wd_text_clear(value[i]);
						value[i] = wd_no_spaces(value[i].trim(), "_");
						if (!(/^[0-9a-zA-Z\_\-]+$/).test(value[i])) value[i] = null;
					}
				}
				return value;
			}
		},
		config: { /* agrupa e retorna as informações dos formulários */
			/*-------------------------------------------------------------------------
			| configuração do atributo data (se ausente, não aceita mecanismo)
			| send:  informa se o elemento pode submeter (true/false)
			| load:  nome do atributo a receber HTML ou null
			| mask:  nome do atributo a receber máscara ou null
			| text:  nome do atributo a receber conteúdo de texto ou null
			| value: nome da função validadora, null se não possui função
			\-------------------------------------------------------------------------*/
			value: function(type) {
				let T = true;
				let F = false;
				let N = null;
				let t = "textContent";
				let v = "value";
				let i = "innerHTML";

				let data = {}
				data.meter    = {types: N, send: F, load: N, mask: N, text: N, value: N};
				data.progress = {types: N, send: F, load: N, mask: N, text: N, value: N};
				data.output   = {types: N, send: F, load: N, mask: N, text: N, value: N};
				data.option   = {types: N, send: F, load: N, mask: t, text: t, value: N};
				data.form     = {types: N, send: F, load: i, mask: N, text: N, value: N};
				data.textarea = {types: N, send: T, load: v, mask: v, text: v, value: N};
				data.select   = {types: N, send: T, load: i, mask: N, text: N, value: "vselect"};

				data.button         = {types: T};
				data.button.button  = {send: F, load: N, mask: t, text: t, value: N};
				data.button.reset   = {send: F, load: N, mask: t, text: t, value: N};
				data.button.submit  = {send: F, load: N, mask: t, text: t, value: N};
				data.input          = {types: T};
				data.input.button   = {send: F, load: N, mask: v, text:v, value: N};
				data.input.reset    = {send: F, load: N, mask: v, text:v, value: N};
				data.input.submit   = {send: F, load: N, mask: v, text:v, value: N};
				data.input.image    = {send: F, load: N, mask: N, text:N, value: N};
				data.input.color    = {send: T, load: N, mask: N, text:v, value: N};
				data.input.radio    = {send: T, load: N, mask: N, text:N, value: "vcheck"};
				data.input.checkbox = {send: T, load: N, mask: N, text:N, value: "vcheck"};
				data.input.date     = {send: T, load: N, mask: v, text:v, value: "vdate"};
				data.input.datetime = {send: T, load: N, mask: v, text:v, value: "vdatetime"};
				data.input.month    = {send: T, load: N, mask: v, text:v, value: "vmonth"};
				data.input.week     = {send: T, load: N, mask: v, text:v, value: "vweek"};
				data.input.time     = {send: T, load: N, mask: v, text:v, value: "vtime"};
				data.input.range    = {send: T, load: N, mask: N, text:v, value: "vnumber"};
				data.input.number   = {send: T, load: N, mask: v, text:v, value: "vnumber"};
				data.input.file     = {send: T, load: N, mask: N, text:N, value: "vfile"};
				data.input.url      = {send: T, load: N, mask: v, text:v, value: "vurl"};
				data.input.email    = {send: T, load: N, mask: v, text:v, value: "vemail"};
				data.input.tel      = {send: T, load: N, mask: v, text:v, value: N};
				data.input.text     = {send: T, load: N, mask: v, text:v, value: N};
				data.input.search   = {send: T, load: N, mask: v, text:v, value: N};
				data.input.password = {send: T, load: N, mask: N, text:N, value: N};
				data.input.hidden   = {send: T, load: N, mask: N, text:v, value: N};
				data.input["datetime-local"] = {send: T, load: N, mask: v, text:v, value: "vdatetime"};

				if (!(this.tag in data)) return null;
				let config = data[this.tag];
				if (type === undefined || type === null || config.types === null) return config;
				return type in config ? config[type] : null;
			}
		},
		tag: { /* retorna a tag do elemento (minúsculo) */
			get: function () {return wd_html_tag(this.e);}
		},
		form: { /* informar se é um formulário (boolean) */
			get: function() {return this.config() !== null ? true : false;}
		},
		type: { /* retorna o tipo do formulário ou null, se não estiver definido */
			get: function() {
				if (!this.form) return null;
				let config = this.config();
				if (config.types === null) return this.tag;
				let attr = this.attr("type", true, false);
				if (this.config(attr.html) !== null) return attr.html;
				if (this.config(attr.elem) !== null) return attr.elem;
				return null;
			}
		},
		name: { /* retorna o valor do formulário name, id ou null (se não for informado nenhum) */
			get: function() {
				if (!this.form) return null;
				let name = this.attr("name", false, true);
				let id   = this.attr("id", false, true);
				return name.elem !== null ? name.elem : id.elem;
			}
		},
		value: { /* retorna o valor do atributo value, null (se erro), undefined (não enviar) */
			get: function() {
				if (!this.form) return undefined;
				let config = this.config(this.type);
				if (config === null) return undefined;
				return config.value === null ? this.e.value : this[config.value];
			}
		},
		selfMasked: { /* informa se é um campo especial implementado pelo navegador */
			get: function() {
				let atypes = [
					"date", "time", "week", "month", "datetime", "datetime-local",
					"number", "range", "url", "email"
				];
				let type = this.type;
				if (atypes.indexOf(type) < 0) return false;
				let attr = this.attr("type", true, false);
				if (attr.elem === "text") return false;
				return true;
			}
		},
		getConfig: { /* obtem informações sobre a configuração do elemento */
			value: function(attr) {
				return this.form ? this.config(this.type)[attr] : null;
			}
		},
		send: { /* informa se o campo pode ser submetido (true/false) ou null se não contemplado*/
			get: function() {return this.getConfig("send");}
		},
		mask: { /* retorna o atributo que definirá a máscara ou null, se não contemplado */
			get: function() {return this.getConfig("mask");}
		},
		text: { /* retorna o atributo que definirá o campo de texto ou null, se não contemplado */
			get: function() {return this.getConfig("text");}
		},
		load: { /* retorna o atributo que definirá o carregamento HTML ou null, se não contemplado */
			get: function() {return this.getConfig("load");}
		},
		data: { /* retorna um objeto com dados a submeter (GET e POST), vazio se não submeter, null se inválido */
			get: function() {
				let data  = {};
				let value = this.value;
				let name  = this.name;
				let type  = this.type;
				if (value === null)      return null; /* valor inválido, acusar erro */
				if (this.send !== true)  return data; /* campos que não podem submeter, não considerar inválidos */
				if (value === undefined) return data; /* campos válidos mas sem valor a submeter */
				if (name  === null)      return data; /* campos sem name, não considerar inválidos mas não submeter */

				if (type === "select" || type === "email") {
					data[name] = {
						GET: encodeURIComponent(value.join(",")),
						POST: value.join(",")
					}
					return data;
				}
				if (type === "file") {
					data[name] = { /* quantidade de arquivos */
						GET: encodeURIComponent(value.length),
						POST: value.length
					};
					for (let i = 0; i < value.length; i++) {
						let get  = {};
						let info = ["name", "type", "size", "lastModified"];
						for (let j = 0; j < info.length; j++)
							if (info[j] in value[i]) get[info[j]] = value[i][info[j]];
						data[name+"_"+i] = { /* arquivos individuais */
							GET:  encodeURIComponent(wd_json(get)),
							POST: value[i]
						};
					}
					return data;
				}
				data[name] = {
					GET: encodeURIComponent(value.trim()),
					POST: value.trim()
				}
				return data;
			}
		},
		msgErrorValue: {
			value: {
				month: "2010-11 | 11/2010 | 11.2010",
				time: "3:45 | 22:45:50 | 10:45 am | 1:45pm",
				week: "2010-W05 | 05, 2010",
				number: "[0-9]+ | .[0-9]+ | [0-9]+.[0-9]+",
				date: "2010-11-23 | 23/11/2010 | 11.23.2010",
				datetime: "2010-11-23T22:45 | 23/11/2010 22:45:50 | 11.23.2010 10:45 pm",
				"datetime-local": "2010-11-23T22:45 | 23/11/2010 22:45:50 | 11.23.2010 10:45 pm",
				email: "email@mail.com",
				url: "http://address.com",
			}
		},
		validity: { /* registro de validade do campo de formulário */
			set: function(msg) { /* define a mensagem de erro do formulário */
				/* apagar a mensagem de erro alternativa, se existir */
				if ("wdErrorMessage" in this.e.dataset)
					delete this.e.dataset.wdErrorMessage;
				/* definindo mensagem de erro, se existente, para aguardar envio */
				if ("setCustomValidity" in this.e)
					this.e.setCustomValidity(msg === null ?  "" : msg);
				else if (msg !== null)
					this.e.dataset.wdErrorMessage = msg;
				return;
			},
			get: function() { /* informar se o campo do formulário é válido (true/false) */
				/* apagar todas mensagens de erro para checagem */
				this.validity = null;
				/* 1º se não for formulário, retornar como válido */
				if (!this.form) return true;
				/* 2º checar validade padrão, se existente */
				if ("checkValidity" in this.e && this.e.checkValidity() === false)
					return false;
				/* 3º sem validade padrão, verificar se o campo é inválido */
				if (this.data === null) {
					let type = this.type;
					this.validity = type in this.msgErrorValue ? this.msgErrorValue[type] : "?";
					return false;
				}
				/* 4º verificar se a máscara está errada (mask) */
				if ("wdErrorMessageMask" in this.e.dataset) {
					this.validity = this.e.dataset.wdErrorMessageMask;
					return false;
				}
				/* 5º verificar se a checagem personalizada (vform) é inválida */
				if ("wdErrorMessageVform" in this.e.dataset) {
					this.validity = this.e.dataset.wdErrorMessageVform;
					return false;
				}
				return true;
			}
		},
		checkValidity: {
			value: function() {
				return this.validity;
			}
		},
		submit: { /* avaliar e reportar erro do formulário (se for o caso), returna true/false */
			value: function() {
				/* aplicando ferramentas da biblioteca para checagem */
				data_wdMask(this.e);
				data_wdVform(this.e);
				/* checar se o formulário é válido */
				if (this.validity) return true;
				/* reportar mensagem e retornar */
				if ("reportValidity" in this.e) {
					this.e.reportValidity();
				} else if ("validationMessage" in this.e) {
					__SIGNALCONTROL.open(this.e.validationMessage, "");
					elem.focus();
				} else {
					__SIGNALCONTROL.open(this.e.dataset.wdErrorMessage, "");
					elem.focus();
				}
				/* bug firefox */
				if (this.type === "file") this.e.value = null;

				return false;
			}
		}
	});

/*----------------------------------------------------------------------------*/
	function WDchart(box, title) {/*Objeto para criar gráficos*/
		this.box   = box;   /* container gráfico */
		this.title = title; /* título do gráfico */
		this.data  = [];    /* dados de plotagem */
		this.color = 0;     /* cor de plotagem (não reiniciar no boot) */
	};

	Object.defineProperties(WDchart.prototype, {
		boot: {
			value: function () {
				this.svg    = null; /* gráfico (svg element) */
				this.xscale = 1; /* escala do eixo x */
				this.yscale = 1; /* escala do eixo y */
				this.xmin   = +Infinity; /* menor valor em x */
				this.xmax   = -Infinity; /* maior valor em x */
				this.ymin   = +Infinity; /* menor valor em y */
				this.ymax   = -Infinity; /* maior valor em y */
				this.padd   = {t: 0, r: 0, b: 0, l: 0}; /* espaço interno do gráfico (padding) */
				this.legend = 0; /* contador de legenda */
				this.box.className = ""; /* atributo class do container do gráfico */
				wd_html_style(this.box, null); /* limpando atributo style */
				this.box.style.backgroundColor = "#fafafa";
				this.box.style.paddingTop = wd_num_str(this.ratio, true); /* proporção do container em relação à tela */
				this.box.style.position   = "relative";
				let child = wd_vtype(this.box.children).value; /* filhos do container */
				for (let i = 0; i < child.length; i++) /* limpando filhos (deletando o gráfico) */
					this.box.removeChild(child[i]);
			}
		},
		ratio: {/* Relação altura/comprimento do gráfico (igual a da tela) */
			get: function() {
				let height = window.screen.height;
				let width  = window.screen.width;
				return height >= width ? 1 : height/width;
			}
		},
		space: { /* define e obtem os espaços do gráfico a partir do padding */
			set: function(x) {
				for (let i in x) this.padd[i] = x[i];
			},
			get: function() {
				let padd = this.padd;
				let msrs = {}; /* medidas em % */
				msrs.t  = padd.t;              /* topo do gŕafico (y) */
				msrs.r  = 100-padd.r;          /* direita do gŕafico (x) */
				msrs.b  = 100-padd.b;          /* base do gŕafico (y) */
				msrs.l  = padd.l;              /* esquerda do gráfico (x) */
				msrs.w  = 100-(padd.l+padd.r); /* comprimento do gráfico (x) */
				msrs.h  = 100-(padd.t+padd.b); /* altura do gráfico (x) */
				msrs.cx = padd.l+(msrs.w/2);   /* meio do gráfico (x) */
				msrs.cy = padd.t+(msrs.h/2);   /* meio do gráfico (y) */
				return msrs;
			}
		},
		rgb: { /* retorna uma cor a partir de um número */
			value: function(n) {
				if (n === 0) return "#000000";
				n--;
				let swap  = ["100", "001", "010", "101", "011", "110"];
				let index = n % swap.length;
				let power = __integer(n/6) + 1;
				let value = 255/power;
				let onoff = swap[index].split("");
				let color = [];
				for (let i = 0; i < onoff.length; i++)
					color.push(onoff[i] === "1" ? __integer(value) : 33);
				return "rgb("+color.join(",")+")";
			}
		},
		point: { /* Transforma coordanadas reais em relativas (%) */
			value: function(x, y) {
				if (!__finite(x) || !__finite(y)) return null;
				x = x - this.xmin;
				y = y - this.ymin;
				let msrs = this.space;
				return {
					x: msrs.l + x*this.xscale,
					y: msrs.b - y*this.yscale,
				};
			}
		},
		addLegend: { /* Adiciona Legendas (texto e funções)*/
			value: function(text, color, compare) {
				if (text === null) return;
				text = "\u25CF "+text;
				let ref = this.space;
				let y   = (ref.t + 1)+(4*this.legend);
				let x   = 1 + (compare === true ? ref.r : ref.l);
				this.svg.appendChild(wd_svg_label(
					x, y, text, "nw", false, color, false
				));
				return this.legend++;
			}
		},
		ends: { /* define os limites dos eixos */
			value: function(axis, array) {
				let axes = {
					x: {min: "xmin", max: "xmax"},
					y: {min: "ymin", max: "ymax"},
				};
				array = array.slice();
				array.push(this[axes[axis].min]);
				array.push(this[axes[axis].max]);
				let limits = wd_coord_limits(array);
				this[axes[axis].min] = limits.min;
				this[axes[axis].max] = limits.max;
			}
		},
		scale: {/* Define o valor da escala horizontal e vertical e retorna o menor fragmento do eixo (delta) */
			value: function(axis) {
				let width = this.space[axis === "x" ? "w" : "h"];
				let delta = this[axis+"max"] - this[axis+"min"];
				this[axis+"scale"] = width/delta;
				return 1/this[axis+"scale"];
			}
		},
		add: {/* Adiciona conjunto de dados para plotagem */
			value: function(x, y, label, type) {
				/*----------------------------------------------------------------------
				| A) se y for uma função, definir plotagem em linha
				| B) se o tipo for plotagem comparativa, defini-la
				| C) plotagem de x-y com valores numéricos
				|=======================================================================
				| atributos do objeto a ser adicionado ao array data:
				| x: array numérico ou indefindo (compare) em x,
				| y: array numérico ou função (!compare) em y,
				| l: identificação da plotagem (legenda),
				| t: tipo de plotagem,
				| f: booleano, informa se y é uma função,
				| c: valor numérico da cor, se existente
				\---------------------------------------------------------------------*/
				if (wd_vtype(y).type === "function") { /*A*/
					let data = wd_coord_adjust(x);
					if (data === null) return false;
					this.data.push(
						{x: data.x, y: y, l: label, t: "line", f: true, c: ++this.color}
					);
					return true;
				}
				if (type === "compare") { /*B*/
					let data = wd_coord_compare(x, y, true);
					if (data === null) return false;
					this.data.push(
						{x: data.x, y: data.amt, l: label, t: "compare", f: false, c: null}
					);
					return true;
				}
				let coord = wd_coord_adjust(x, y); /*C*/
				if (coord === null) return false;
				x = coord.x; /*C*/
				y = coord.y; /*C*/
				/* tipo de gráficos: cada tipo pode gerar até três conjuntos de dados */
				let ref = { /* tipo: {c1: tipo de plotagem 1, c2..., c3..., m: método */
					avg: {c1: "line", c2: "line", c3: null,   m: wd_coord_ravg},
					sum: {c1: "line", c2: "cols", c3: null,   m: wd_coord_rsum},
					exp: {c1: "dots", c2: "line", c3: "dash", m: wd_coord_rexp},
					lin: {c1: "dots", c2: "line", c3: "dash", m: wd_coord_rlin},
					geo: {c1: "dots", c2: "line", c3: "dash", m: wd_coord_rgeo},
				};
				if (type in ref) { /* checando escolha de tipo de gráfico específico */
					let data = ref[type].m(x, y); /* executando o método */
					if (data === null) return false;
					this.data.push( /* conjunto de dados da plotagem 1 */
						{x: x, y: y, l: label, t: ref[type].c1, f: false, c: ++this.color}
					);
					this.data.push( /* conjunto de dados da plotagem 2 (função) */
						{x: x, y: data.f, l: data.m, t: ref[type].c2, f: true, c: ++this.color}
					);
					if (data.d !== 0) { /* conjunto de dados da plotagem 3 (função), se desvio padrão != 0 */
						let sup = function(n) {return data.f(n)+data.d;} /* desvio superior */
						let sub = function(n) {return data.f(n)-data.d;} /* desvio inferior */
						this.data.push( /* desvio superior */
							{x: x, y: sup, l: null, t: ref[type].c3, f: true, c: this.color}
						);
						this.data.push( /* desvio inferior */
							{x: x, y: sub, l: null, t: ref[type].c3, f: true, c: this.color}
						);
					}
					return true;
				}
				/* plotagem x-y numérica genérica (linhas e pontos) */
				this.data.push(
					{x: x, y: y, l: label, t: "line", f: false, c: ++this.color}
				);
				this.data.push(
					{x: x, y: y, l: null, t: "dots", f: false, c: this.color}
				);
				return true;
			}
		},
		pdata: { /* prepara os dados da plotagem (plano x-y) */
			get: function() {
				let array = [];
				/*----------------------------------------------------------------------
				| A) looping: filtrando tipo de solicitação e adicionando-os a lista
				| B) ignorando o tipo compare
				| C) (pré-)definindo limites superiores e inferiores de x e y (!= função)
				\---------------------------------------------------------------------*/
				for (let i = 0; i < this.data.length; i++) { /*A*/
					let data = this.data[i];
					if (data.t === "compare") continue; /*B*/
					this.ends("x", data.x); /*C*/
					if (data.t === "cols") this.ends("y", [0]); /* se for coluna tem que mostrar a linha 0 */
					if (data.f !== true) this.ends("y", data.y); /*C*/
					array.push(data); /*A*/
				}
				/*----------------------------------------------------------------------
				| D) definindo espaços (padding) entre o container e o gráfico
				| E) definindo e obtendo a escala em x (valor real X disponível)
				\---------------------------------------------------------------------*/
				this.space = {t: 10, r: 5, b: 15, l: 15}; /*D*/
				let delta  = this.scale("x"); /*E*/
				/*----------------------------------------------------------------------
				| F) looping: transformando eixo y de função para array numérico
				| G) definindo novas listas para x e y após transformação em F
				| H) definindo limites superiores e inferiores em y
				| I) definindo escala em y e retornando dados
				\---------------------------------------------------------------------*/
				for (let i = 0; i < array.length; i++) { /*F*/
					let data = array[i];
					if (data.f !== true) continue;
					let values = wd_coord_continuous( /*F*/
						data.x, data.y, data.t === "cols" ? 0.01 : delta /* para sum (cols) o delta deve ser menor */
					);
					if (values === null) continue;
					array[i].x = values.x; /*G*/
					array[i].y = values.y; /*G*/
					this.ends("y", values.y); /*H*/
				}
				this.scale("y"); /*I*/
				return array;
			}
		},
		cdata: { /* prepara dados de plotagem para "compare" */
			get: function() {
				/*----------------------------------------------------------------------
				| A) lista especial para agrupar informações para posterior tratamento
				| B) looping: filtrando tipo de solicitação e adicionando-os a lista
				| C) ignorando o tipo diferente de compare
				| D) adicionando informações à nova lista especial
				\---------------------------------------------------------------------*/
				let group = {x: [], y: []};
				for (let i = 0; i < this.data.length; i++) { /*B*/
					let data = this.data[i];
					if (data.t !== "compare") continue; /*C*/
					for (let j = 0; j < data.x.length; j++) { /*D*/
						group.x.push(data.x[j]);
						group.y.push(data.y[j]);
					}
				}
				/*----------------------------------------------------------------------
				| E) se não tiver dados, retornar vazio
				| F) transformando os dados
				| H) definindo limites
				| I) contribuindo um nova lista de dados para plotagem
				| G) definindo espaços e escala;
				\---------------------------------------------------------------------*/
				if (group.x.length === 0) return []; /*E*/
				let compare = wd_coord_compare(group.x, group.y, true); /*F*/
				this.ends("y", compare.amt); /*H*/
				this.ends("x", [0, compare.x.length]); /*H*/
				this.ends("y", [0]);  /*H (tem que mostrar a linha y = 0) */
				let array = []; /*I*/
				for (let i = 0; i < compare.x.length; i++) /*I*/
					array.push({
						x: [i, i+1], y: [compare.amt[i], compare.amt[i]],
						l: compare.x[i]+" ("+wd_num_str(compare.per[i], true)+")",
						t: "cols", f: false, c: i+1,
					});
				this.space = {t: 10, r: 20, b: 10, l: 15}; /*G*/
				this.scale("x"); /*G*/
				this.scale("y"); /*G*/
				return array;
			}
		},
		area: { /* prepara os dados da plotagem (plano x,y) */
			value: function(xlabel, ylabel, n, compare) {
				compare = compare === true ? true : false;
				/*----------------------------------------------------------------------
				| A) criando e definindo o SVG principal
				| B) obtendo as medidas referenciais da plotagem (ref)
				| C) obtendo a cor padrão (clr)
				| D) obtendo as menores unidades de x e y (dx, dy)
				| E) obtendo as menores unidades de x e y (dx, dy) e
				| F) contruindo eixos, labels e valores
				\---------------------------------------------------------------------*/
				this.svg = wd_svg_create("svg", {}); /*A*/
				this.svg.setAttribute("class", "js-wd-plot"); /*A*/
				let ref = this.space; /*B*/
				let clr = this.rgb(0); /*C*/
				let dx  = ref.w/n; /*D*/
				let dy  = ref.h/n; /*D*/
				let vx  = (this.xmax - this.xmin)/n; /*E*/
				let vy  = (this.ymax - this.ymin)/n; /*E*/

				for (let i = 0; i < (n+1); i++) { /*F*/
					let x1, y1, x2, y2, ax, ay, x, y, dash;
					/* estilo das linhas (externa contínua, interna tracejada) */
					dash = (i === 0 || i === n) ? 1 : 0;
					/* valores dos eixos (ancoras e valores) */
					ax = i === 0 ? "nw" : (i === n ? "ne" : "n");
					ay = i === 0 ? "ne" : (i === n ? "se" : "e");
					x = this.xmin + i*vx; /* da esquerda para direita */
					y = this.ymax - i*vy; /* de cima para baixo */
					/* coordenadas dos eixos verticais */
					x1 = ref.l+i*dx;
					x2 = x1;
					y1 = ref.t;
					y2 = y1+ref.h;
					this.svg.appendChild(wd_svg_line(x1, y1, x2, y2, dash, null, clr));
					/* valores eixo vertical */
					this.svg.appendChild(wd_svg_label(
						ref.l - 1, y1 + i*dy, wd_num_str(y), ay, false, clr, false
					));

					/* coordenadas dos eixos horizontais */
					x1 = ref.l;
					x2 = x1+ref.w;
					y1 = ref.t+ref.h-i*dy;
					y2 = y1;
					this.svg.appendChild(wd_svg_line(x1, y1, x2, y2, dash, null, clr));
					/* valores eixo horizontal */
					if (!compare)
						this.svg.appendChild(wd_svg_label(
							x1 + i*dx, ref.b + 1, wd_num_str(x), ax, false, clr, false
						));
				}
				/* Título e labels */
				this.svg.appendChild( /* título do gŕafico (centrado no gráfico) */
					wd_svg_label(ref.l+ref.w/2, ref.t/2, this.title, "s", false, clr, true)
				);
				this.svg.appendChild( /* nome do eixo x (horizontal, inferior e centrado no gráfico) */
					wd_svg_label(ref.cx, (ref.b+100)/2, xlabel, "n", false, clr, false)
				);
				this.svg.appendChild( /* nome do eixo x (vertical, esquerda e centrado no gráfico) */
					wd_svg_label(-this.ratio*ref.cy, ref.l/4, ylabel, "n", true, clr, false)
				);
			}
		},
		plot: { /* executa gráfico */
			value: function(xlabel, ylabel, compare) {
				/*----------------------------------------------------------------------
				| A) preparando (reset) valores do objeto
				| B) obtendo dados da plotagem especificada (plano ou comparação)
				| C) definindo área do gráfico (B deve vir primeiro)
				| D) lopping: conjunto de dados
				| E) looping: array de valores
				\---------------------------------------------------------------------*/
				this.boot(); /*A*/
				let data = compare === true ? this.cdata : this.pdata; /*B*/
				if (data.length === 0) return false;
				this.area(xlabel, ylabel, (compare === true ? data.length : 4), compare); /*C*/

				for (let i = 0; i < data.length; i++) { /*D*/
					let item = data[i];
					let clr  = this.rgb(item.c);
					let leg  = item.l;
					this.addLegend(leg, clr, compare);

					for (let j = 0; j < item.x.length; j++) { /*E*/
						let last, xy1, xy2, frag, zero;
						last = j === (item.x.length - 1) ? true : false;
						frag = null;
						xy1  = this.point(item.x[j], item.y[j]);
						xy2  = !last ? this.point(item.x[j+1], item.y[j+1]) : null;
						zero = this.point(0, 0);

						if (item.t === "dots")
							frag = wd_svg_dots(xy1.x, xy1.y, 0.5, leg, clr);
						else if (item.t === "line" && !last)
							frag = wd_svg_line(xy1.x, xy1.y, xy2.x, xy2.y, 2, leg, clr);
						else if (item.t === "dash" && !last)
							frag = wd_svg_line(xy1.x, xy1.y, xy2.x, xy2.y, 0, leg, clr);
						else if (item.t === "cols" && !last)
							frag = wd_svg_rect(xy1.x, zero.y, xy2.x, xy2.y, leg, clr);
						if (frag !== null) this.svg.appendChild(frag);
					}
				}
				this.box.appendChild(this.svg);
				return true;
			}
		},
	});
