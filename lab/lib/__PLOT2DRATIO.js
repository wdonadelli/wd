/**
#3 Análise Gráfica Relativa
O objeto '{__PLOT2DRATIO} apresenta ferramentas para construção de gráficos comparativos (pizza/barras).
**/
const __PLOT2DRATIO = {
	/**. '{object key(array list)}: Retona um objeto com as informações de plotagem no método chave/valor.**/
	key: function(list) {
		return list.reduce(function(data,v,i,a) {
			/*-- definição dos dados básicos --*/
			if (i === 0) return {
				label: v.name, values: [], names: v.data, labels: [], sum: [], min: [], max: [],
			};
			/*-- definição do conjunto de dados --*/
			data.labels.push(v.name);
			data.values.push(a[0].data.map(function(V,I,A) {
				const value = __DATA2D.toNumeric(v.data[I]);
				return value === null ? 0 : value;
			}));
			data.sum.push(__DATA2D.SUM(__DATA2D.MOD(data.values[data.values.length - 1])));
			data.min.push(__DATA2D.MIN(data.values[data.values.length - 1]));
			data.max.push(__DATA2D.MAX(data.values[data.values.length - 1]));
			return data;
		}, null);
	},
	/**. '{object sum(array list)}: Retona um objeto com as informações de plotagem no método somatório de valores.**/
	sum: function(list) {
		return this.key(list.reduce(function(data,v,i,a) {
			data[0].data.push(v.name);
			data[1].data.push(__DATA2D.SUM(v.data));
			return data;
		}, [{name: "", data: []}, {name: "sum", data: []}]));
	},
	/**. '{object count(array list)}: Retona um objeto com as informações de plotagem no método contagem de ocorrências.**/
	count: function(list) {
		return this.key(list.reduce(function(data,v,i,a) {
			/*-- obter identificadores --*/
			const count = __DATA2D.COUNT(v.data);
			for (let x in count) {
				if (data[0].data.indexOf(x) < 0)
					data[0].data.push(x);
			}
			/*-- definir valores --*/
			const item = {name: v.name, data: Array(data[0].data.length).fill(0)};
			for (let x in count) {
				item.data[data[0].data.indexOf(x)] = count[x];
			}
			data.push(item);
			return data;
		}, [{name: "", data: []}]));
	},
	/**. '{object number(finite value, boolean ratio)}: Retona a configuração numérica a ser exibida.**/
	number: function(value, ratio) {
		const abs = Math.abs(value);
		if (ratio) return __NUMBER.locale(value, "decimal", "percent", {maxDecimal: 0});
		if (abs >= 1e15) return __NUMBER.locale(value, "decimal", "scientific", {maxDecimal: 2});
		if (abs >= 1e5)  return __NUMBER.locale(value, "decimal", abs >= 1e13 ? "short" : "compact");
		if (abs <= 1e-5) return __NUMBER.locale(value, "decimal", abs === 0 ? "decimal" : "scientific", {maxDecimal: 2});
		return __NUMBER.locale(value, "decimal", "decimal", {maxDecimal: abs > 1 ? 2 : 4});
	},







	/**. '{void barDesc(object plot)}: Define a descrição inicial para o gŕafico de barras.**/
	barDesc: function(plot) {
		return [

		].join("\n");
	},
	/**. '{void bar(object plot)}: Define a estrutura visual do gráfico de barras.**/
	bar: function(plot) {
		/*-- espaço --*/
		const padd = __SVG.paddSize;
		const hbar = padd + __SVG.labelSize + padd;
		/*-- área --*/
		const yi   = padd + __SVG.titleSize + padd;
		const yf   = yi + hbar * (plot.data.names.length * (plot.data.labels.length + 1));
		const xi   = Math.trunc(0.15 * window.screen.width);
		const xf   = Math.trunc(0.65 * window.screen.width);
		const li   = xf + xi + padd;
		/*-- escala --*/
		const min  = plot.min > 0 ? 0 : plot.min;
		const max  = plot.max < 0 ? 0 : plot.max;
		const dxdv = (xf - xi) / (max - min);
		const zero = xi - min*dxdv;
		const left = (zero - xi) > (xf - zero);
		/*-- Descrição inicial --*/
		plot.desc.push(
			`This is a horizontal bar graph titled "${plot.title}".`,
			`The chart has a white background and the font is predominantly black.`,
			`At the top of the graph is the title, and below it is the plotting area containing the visual representation of the data.`,
			`To the right of the plot area is the legend containing the labels, differentiated by color, that identify each data set.`,
			`The plotting area contains a vertical line that defines the origin of the graph (zero value).`,
			`Positive and negative values ​​are represented by proportional horizontal bars positioned to the right and left of the vertical line, respectively.`,
			`Each bar is accompanied by its relative value, near the origin, and its absolute value, near the end.`,
			`The values ​​are obtained from the absolute values ​​of the dataset.`,
			`The color of the bars and values ​​corresponds to the color of their respective labels.`,
			`To demonstrate the origin of the information individually, the datasets are grouped by identifiers, names positioned just above each data group, which display the values ​​originating from that source.`,
			`The chart shows ${plot.data.names.length} identifier${plot.data.names.length > 1 ? "s, each": ""} containing ${plot.data.labels.length} data set${plot.data.labels.length > 1 ? "s": ""}.`
		);console.log(plot.desc.join("\n"))
		/*-- identificadores --*/
		plot.id.svg   = __ID.value;
		plot.id.title = __ID.value;
		plot.id.desc  = __ID.value;
		plot.id.label = Array(plot.data.labels.length).fill(0).map(function() {return __ID.value;});
		plot.id.name  = Array(plot.data.names.length).fill(0).map(function()  {return __ID.value;});
		/*-- SVG --*/
		plot.svg = new __SVG(window.screen.width, yf + __SVG.labelSize, 0, 0);
		plot.svg
			.attribute({
				id: plot.id.svg,
				class: "css-wd-plot",
				role: "img",
				"aria-labelledby": plot.id.title,
				"aria-describedby": plot.id.desc
			})
			.desc("", {lang: "en-US", id: plot.id.desc})
			/*-- título --*/
			.text(Math.trunc(0.5 * window.screen.width), yi/2, plot.title, "h")
			.attribute({id: plot.id.title, class: "css-wd-plot-title", role: "heading", "aria-level": "1"})
			.title(plot.title)
			/*-- eixo vertical --*/
			.line([zero,yi+hbar], [zero,yf])
			.attribute({class: "css-wd-plot-line", role: "img"})
			.desc("Centered vertical line of the bars.", {lang: "en-US"})
			/*-- Rótulo --*/
			.text(li, yi + hbar/2, plot.data.label, "hw")
			.title(plot.data.label);
		/*-- área do gráfico --*/
		plot.data.names.forEach(function(name,n,lname) {
			/*-- nomes --*/
			const yname = yi + (n * hbar * (plot.data.labels.length + 1));
			plot.svg
				.text(left ? zero-padd : zero+padd, yname + hbar/2, name, left ? "he" : "hw")
				.attribute({id: plot.id.name[n]})
				.title(name);

			plot.data.labels.forEach(function(label,l,llabel) {
				const ylabel  = yname + hbar + (l * hbar);
				const color   = __PLOT2D.RGB[l%__PLOT2D.RGB.length];
				const value   = plot.data.values[l][n];
				const ratio   = value/plot.data.sum[l];
				const width   = Math.abs(dxdv * value);
				const top     = zero + ((value < 0 ? -1 : +1) * (width + padd));
				const base    = zero + ((value < 0 ? +1 : -1) * (padd));
				const idValue = __ID.value;
				const idRatio = __ID.value;
				/*-- legenda --*/
				if (n === 0) plot.svg
					.text(li, ylabel + hbar/2, label, "hw")
					.attribute({fill: color, id: plot.id.label[l]})
					.title(label)
					.desc(color);//TODO o que é isso?
				/*-- barras, valores, porcentagem --*/
				plot.svg
					.rect(zero + (value < 0 ? -width : 0), ylabel, width, hbar)
					.attribute({
						fill: color,
						stroke: color,
						role: "img",
						"aria-labelledby": `${plot.id.name[n]} ${plot.id.label[l]} ${idValue} ${idRatio}`,
						class: "css-wd-plot-area"
					})
					.title(`${value} (${(100*ratio).toFixed(2)}%)`)
					.desc(`Barra exibida na cor "amarela", à direita da linha central, vinculada ao identificador nomeado como "ID" e ao conjunto de dados denominado como "dadinho". Sua dimensão representa o valor de 10.20 unidades num total 200 (soma dos valores absolutos), resultando na proporção de 20%.`, {lang: "en-US"})//TODO fazer a descriçaõ da barra
					.text(top, ylabel + hbar/2, this.number(value, false), value < 0 ? "he" : "hw")
					.attribute({id: idValue, fill: color})
					.title(this.number(value, false))
					.desc("Value label.", {lang: "en-US"})
					.text(base, ylabel + hbar/2, this.number(ratio, true), value < 0 ? "hw" : "he")
					.attribute({id: idRatio, fill: color})
					.title(this.number(value, true))
					.desc("Percentage label.", {lang: "en-US"});
			}, this);
		}, this);
	},
	/**. '{void pie(object plot)}: Define a estrutura visual do gráfico de setores.**/
	pie: function(plot) {
		/*-- espaços --*/
		const padd = __SVG.paddSize;
		const side = __SVG.labelSize;
		/*-- área de plotagem --*/
		const xi = Math.trunc(0.25 * window.screen.width);
		const xf = Math.trunc(0.75 * window.screen.width);
		const xc = (xi + xf)/2;
		const yi = padd + __SVG.titleSize + padd;
		const yf = yi + (xf - xi);
		const yc = (yi + yf)/2;
		const r  = (xf - xc) - (padd + side + padd);
		/*-- identificadores --*/
		const idLabels = Array(plot.data.labels.length).fill(0).map(function() {return __ID.value;});
		const idNames  = Array(plot.data.names.length).fill(0).map(function() {return __ID.value;});
		const idTitle  = __ID.value;
		/*-- SVG/título/legenda --*/
		plot.svg = new __SVG(window.screen.width, yf + side, 0, 0);
		plot.svg
			.attribute({class: "css-wd-plot", "aria-labelledby": idTitle, id: __ID.value})
			.text((xi + xf)/2, yi/2, plot.title, "h")
			.attribute({id: idTitle, class: "css-wd-plot-title"})
			.text(xf + padd, yi + side/2, plot.data.label, "hw");
		/*-- área do gráfico --*/
		plot.data.labels.forEach(function(label,l,LABEL) {
			let    start = 0;
			let controls = [];
			plot.data.names.forEach(function(name,n,NAME) {
				const color = __PLOT2D.RGB[n%__PLOT2D.RGB.length];
				const idVal = __ID.value;
				const idPie = __ID.value;
				const value = plot.data.values[l][n];
				const sum   = plot.data.sum[l];
				const ratio = value/sum;
				const width = Math.abs(360*ratio);
				const half  = (start + width/2);
				const angle = Math.PI*(half/180);
				const tx    = xc + (r+padd)*Math.cos(angle);
				const ty    = yc - (r+padd)*Math.sin(angle);
				const tp    = (
					half < 90  ? (half ===   0 ? "hw" : "hsw") : (
					half < 180 ? (half ===  90 ? "hs" : "hse") : (
					half < 270 ? (half === 180 ? "he" : "hne") : (
					half < 360 ? (half === 270 ? "hn" : "hnw") : "hw"
				))));
				/*-- legenda --*/
				if (l === 0) plot.svg
					.text(xf + padd, yi + (n + 1)*(side+padd) + side/2, `- ${name}`, "hw")
					.attribute({fill: color, id: idNames[n]})
					.desc(color);
				/*-- setor/porcentagem --*/
				plot.svg.semicircle(xc, yc, r, start, width)
					.attribute({fill: color, stroke: color, "aria-labelledby": `${idNames[n]} ${idLabels[l]}`})
					.attribute({class: "css-wd-plot-area", id: idPie, display: l === 0 ? "" : "none"})
					.desc(`${value} (${(100*ratio).toFixed(2)}%)`)
					.text(tx, ty, this.number(ratio, true), tp)
					.attribute({fill: color, id: idVal, display: l === 0 ? "" : "none"})
					.title(`${value} (${(100*ratio).toFixed(2)}%)`);
				/*-- incremento --*/
				start += width;
				controls.push(idPie, idVal);
			}, this);
			/*-- rótulo (interativo, lado esquerdo) --*/
			plot.svg
				.text(padd, yi + l*(side+padd) + side/2, label, "hw")
				.attribute({
					id: idLabels[l],
					tabindex: 0,
					"text-decoration": l === 0 ? "underline" : "normal",
					"font-weight": l === 0 ? "bold" : "normal",
					cursor: "pointer",
					role: "button",
					"aria-expanded": l === 0 ? "true" : "false",
					"aria-controls": controls.join(" "),
				});
			plot.svg.last.addEventListener("click", this);
			plot.svg.last.addEventListener("keydown", this);
		}, this);
	},
	/**. '{node plot(object data)}: Retorna um gráfico de barras ou de setores em SVG conforme especificado em '{data} ou nulo:
	|Propriedade|Tipo|Opcional|Descrição|Observação|
	|title|string|Sim|Título do gráfico||
	|type|string|Sim|Define o tipo de análise gráfica|Valor padrão é '{count}|
	|view|string|Sim|Define o tipo de gráfico, se setores ('{pie}) ou de barras ('{bar})|Valor padrão é '{bar}|
	|y.dataset|array|Não|Conjunto de dados|Lista de objetos|
	|y.dataset.name|string|Sim|Nome do conjunto de dados||
	|y.dataset.data|array|Não|Conjunto de dados numericos para análise|Aceita-se números finitos e datas|
	- Os tipos possíveis são '{key}, '{sum} e '{count};
	- O tipo '{key} estabelece um relacionamento entre o primeiro conjunto (identificadores) e os demais (valores);
	- O tipo '{sum} estabelece um relacionamento entre a soma dos conjuntos (valores) e seus respectivos nomes (identificadores);
	- O tipo '{count} estabelece um relacionamento entre os itens dos conjuntos (identificadores) e sua respectiva contagem (valores);**/
	plot: function(data) {
		/*-- checando dados --*/
		if (data === null || typeof data !== "object" || !Array.isArray(data.dataset)) return null;
		const plot = {
			id:    {},
			desc:  [],
			title: "title" in data ? data.title : "Title",
			type:  (/^sum|count|key$/i).test(data.type) ? data.type.toLowerCase() : "count",
			view:  (/^bar|pie$/i).test(data.view) ? data.view.toLowerCase() : "bar",
			list:  data.dataset.reduce(function(data,v,i,a) {
				if (typeof v === "object" && v !== null && Array.isArray(v.data)) {
					const name = v.name === undefined || v.name === null || (/^\s*$/).test(v.name) ? `#${i}` : String(v.name).trim();
					data.push({name: name, data: v.data})
				}
				return data;
			}, []),
		};
		if (plot.list.length < (plot.data === "key" ? 2 : 1)) return null;
		/*-- obtendo dados para plotagem conforme o método definido --*/
		plot.data = this[plot.type](plot.list);
		plot.min  = __DATA2D.MIN(plot.data.min);
		plot.max  = __DATA2D.MAX(plot.data.max);
		if (plot.min === 0 && plot.max === 0) plot.max = 1;
		this[plot.view](plot);



		plot.svg.svg(document.body).style.width = "50%";//TODO remover essa linha
		__CSS.handleEvent();//TODO remover essa linha
		return plot;//TODO remover essa linha
		return plot.svg.svg();
	},
	/**. '{void click(object ev)}: Manipulador ao clicar sobre o nome da curva na legenda.**/
	click: function(ev) {
		const svg  = ev.currentTarget.parentElement;
		const ctrl = svg.querySelectorAll("[aria-controls]");
		for (let i = 0; i < ctrl.length; i++) {
			let query = "#" + ctrl[i].getAttribute("aria-controls").replace(/\s/g, ", #");
			let elem  = svg.querySelectorAll(query);
			let ok    = ctrl[i] === ev.currentTarget;
			ctrl[i].setAttribute("aria-expanded",   ok ? "true"      : "false");
			ctrl[i].setAttribute("text-decoration", ok ? "underline" : "none");
			ctrl[i].setAttribute("font-weight",     ok ? "bold"      : "normal");
			for (let j = 0; j < elem.length; j++)
				elem[j].setAttribute("display", ok ? "" : "none");
		}
		return;
	},
	/**. '{void keydown(object ev)}: Manipulador ao teclar ENTER sobre o nome da curva na legenda.**/
	keydown: function(ev) {
		if (ev.key === "Enter" || ev.key === " ") {
			ev.preventDefault();
			this.click(ev);
		}
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador de manipulação chamado durante os eventos '{mousemove} e '{click}.**/
	handleEvent: function(ev) {
		if (ev.type in this) this[ev.type](ev);
		return;
	},
};