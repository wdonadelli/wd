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
		/*-- espaços --*/
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
		/*-- identificadores --*/
		const id   = {
			svg:   __ID.value,
			title: __ID.value,
			desc:  __ID.value,
			name:  Array(plot.data.names.length).fill(0).map(function()  {return __ID.value;}),
			label: Array(plot.data.labels.length).fill(0).map(function() {return __ID.value;}),
			value: Array(plot.data.labels.length).fill(0).map(function() {return __ID.value;}),
			ratio: Array(plot.data.labels.length).fill(0).map(function() {return __ID.value;}),
		};
		/*-- descrição --*/
		const info = {};
		const desc = [
			`This is an image representing a horizontal bar chart.`,
			`By default, the image displays a light background with dark font (the display mode adopted may reverse this setting).`,
			`At the top of the image is the horizontally centered chart title displaying the value "${plot.title}".`,
			`Below the title is the plotting area containing the visual representation of the data.`,
			`To the right of the plotting area is the legend containing the labels that name the existing data sets, visually identified by colors.`,
			`The plotting area contains a vertical axis that defines the origin of the horizontal bars (zero value).`,
			`Positive values ​​are represented by bars positioned to the right of the vertical axis, while negative values ​​are represented by bars to the left of that same axis.`,
			`The length of the bar is proportional to its relative value.`,
			`The bar and its associated labels have the same color as the legend label.`,
			`The relative value label is displayed at the base of the bar, near the vertical axis, and the absolute value label is displayed at the end of the bar.`,
			`The relative value is obtained from the absolute values ​​(modulus) of each data set.`,
			`From top to bottom, along the vertical axis, are distributed the labels identifying the information source followed by the respective values ​​associated with each dataset from that source.`,
			`The chart displays the following information:`
		];
		/*-- SVG --*/
		plot.svg = new __SVG(window.screen.width, yf + __SVG.labelSize, 0, 0);
		plot.svg
			.attribute({
				id: id.svg,
				class: "css-wd-plot",
				role: "img",
				"aria-labelledby": id.title,
				"aria-describedby": id.desc
			})
			.desc("", {lang: "en-US", id: id.desc})
			/*-- título --*/
			.text(Math.trunc(0.5 * window.screen.width), yi/2, plot.title, "h")
			.attribute({id: id.title, class: "css-wd-plot-title", role: "heading", "aria-level": "1"})
			.title(plot.title)
			/*-- eixo vertical --*/
			.line([zero,yi+hbar], [zero,yf])
			.attribute({class: "css-wd-plot-line", role: "img"})
			.desc("Vertical axis", {lang: "en-US"})
			/*-- Rótulo --*/
			.text(li, yi + hbar/2, plot.data.label, "hw")
			.title(plot.data.label);
		/*-- área do gráfico ([names[labels]]) --*/
		plot.data.names.forEach(function(name,n,lname) {
			/*-- fonte (names) --*/
			const yname = yi + (n * hbar * (plot.data.labels.length + 1));
			plot.svg
				.text(left ? zero-padd : zero+padd, yname + hbar/2, name, left ? "he" : "hw")
				.attribute({id: id.name[n]})
				.title(name);
			/*-- dados (labels) --*/
			plot.data.labels.forEach(function(label,l,llabel) {
				const ylabel  = yname + hbar + (l * hbar);
				const color   = __PLOT2D.RGB[l%__PLOT2D.RGB.length];
				const value   = plot.data.values[l][n];
				const ratio   = value/plot.data.sum[l];
				const width   = Math.abs(dxdv * value);
				const top     = zero + ((value < 0 ? -1 : +1) * (width + padd));
				const base    = zero + ((value < 0 ? +1 : -1) * (padd));
				const tvalue  = this.number(value, false);
				const tratio  = this.number(ratio, true);
				const tcolor  = color.replace(/([A-Z])/g, " $1").toLowerCase();
				/*-- legenda --*/
				if (n === 0) plot.svg
					.text(li, ylabel + hbar/2, label, "hw")
					.attribute({fill: color, id: id.label[l]})
					.title(label);
				/*-- barras, valores, porcentagem --*/
				plot.svg
					/*-- barra --*/
					.rect(zero + (value < 0 ? -width : 0), ylabel, width, hbar)
					.attribute({
						fill: color,
						stroke: color,
						role: "img",
						"aria-labelledby": `${id.name[n]} ${id.label[l]} ${id.value[l]} ${id.ratio[l]}`,
						class: "css-wd-plot-area"
					})
					.title(`${label}\n${name}\n${value} (${(100*ratio).toFixed(2)}%)`)
					/*-- valor absoluto --*/
					.text(top, ylabel + hbar/2, tvalue, value < 0 ? "he" : "hw")
					.attribute({id: id.value[l], fill: color})
					.title(tvalue)
					/*-- valor relativo --*/
					.text(base, ylabel + hbar/2, tratio, value < 0 ? "hw" : "he")
					.attribute({id: id.ratio[l], fill: color})
					.title(tratio);
					/*-- informação --*/
					if (n === 0) info[l] = [`\n${label} [${tcolor}]`];
					info[l].push(`${name}: ${tvalue} (${tratio})`);
			}, this);
		}, this);
		/*-- finalizando a descrição --*/
		for(let i in info) desc.push(info[i].join("\n"));
		plot.svg.svg().getElementById(id.desc).textContent = desc.join("\n");
		return;
	},
	/**. '{void pie(object plot)}: Define a estrutura visual do gráfico de setores.**/
	pie: function(plot) {
		/*-- espaços --*/
		const padd = __SVG.paddSize;
		const side = __SVG.labelSize;
		/*-- área de plotagem --*/
		const xi = Math.trunc(0.25 * window.screen.width);
		const xf = Math.trunc(0.75 * window.screen.width);
		const li = xf + 4*padd;
		const xc = (xi + xf)/2;
		const yi = padd + __SVG.titleSize + padd;
		const yf = yi + (xf - xi);
		const yc = (yi + yf)/2;
		const r  = (xf - xc) - (padd + side + padd);
		/*-- identificadores --*/
		const id   = {
			svg:   __ID.value,
			title: __ID.value,
			desc:  __ID.value,
			name:  Array(plot.data.names.length).fill(0).map(function()  {return __ID.value;}),
			label: Array(plot.data.labels.length).fill(0).map(function() {return __ID.value;}),
		};
		/*-- descrição --*/
		const info = {};
		const desc = [
			`This is an image representing a pie chart.`,
			`By default, the image displays a light background with dark font (the display mode adopted may reverse this setting).`,
			`At the top of the image, the chart title is centered horizontally over the plotting area, displaying the value "${plot.title}".`,
			`Below the title is the plotting area containing the visual representation of the data.`,
			`To the right of the plotting area is the legend containing labels that identify the sources of the information, visually differentiated by color.`,
			`To the left of the plotting area is the legend containing the labels that name the existing datasets.`,
			`The dataset labels are click-sensitive, toggling the view of the datasets.`,
			`The plotting area displays a circle divided into sectors (semi-circles) proportional to the relative values ​​of each information source assigned to the selected dataset.`,
			`Next to each sector, a label is displayed showing the relative value it represents.`,
			`The sectors and their associated labels share the same color as the information source label.`,
			`The relative value is obtained from the absolute values ​​(modulus) of each data set.`,
			`The chart displays the following information:`
		];
		/*-- SVG --*/
		plot.svg = new __SVG(window.screen.width, yf + side, 0, 0);
		plot.svg
			.attribute({
				id: id.svg,
				class: "css-wd-plot",
				role: "img",
				"aria-labelledby": id.title,
				"aria-describedby": id.desc
			})
			.desc("", {lang: "en-US", id: id.desc})
			/*-- título --*/
			.text((xi + xf)/2, yi/2, plot.title, "h")
			.attribute({id: id.title, class: "css-wd-plot-title", role: "heading", "aria-level": "1"})
			.title(plot.title)
			/*-- rótulo --*/
			.text(li, yi + side/2, plot.data.label, "hw")
			.title(plot.data.label);
		/*-- área do gráfico --*/
		plot.data.labels.forEach(function(label,l,LABEL) {
			/*-- dados (label) --*/
			let    start = 0;
			let controls = [];
			/*-- descrição --*/
			desc.push(`\n${label}`);
			plot.data.names.forEach(function(name,n,NAME) {
				/*-- fontes (names) --*/
				const color  = __PLOT2D.RGB[n%__PLOT2D.RGB.length];
				const idVal  = __ID.value;
				const idPie  = __ID.value;
				const value  = plot.data.values[l][n];
				const sum    = plot.data.sum[l];
				const ratio  = value/sum;
				const width  = Math.abs(360*ratio);
				const half   = (start + width/2);
				const angle  = Math.PI*(half/180);
				const tvalue = this.number(value, false);
				const tratio = this.number(ratio, true);
				const tcolor = color.replace(/([A-Z])/g, " $1").toLowerCase();
				const tx     = xc + (r+padd)*Math.cos(angle);
				const ty     = yc - (r+padd)*Math.sin(angle);
				const tp     = (
					half < 90  ? (half ===   0 ? "hw" : "hsw") : (
					half < 180 ? (half ===  90 ? "hs" : "hse") : (
					half < 270 ? (half === 180 ? "he" : "hne") : (
					half < 360 ? (half === 270 ? "hn" : "hnw") : "hw"
				))));
				/*-- legenda --*/
				if (l === 0) plot.svg
					.text(li, yi + (n + 1)*(side+padd) + side/2, name, "hw")
					.attribute({fill: color, id: id.name[n]})
					.title(name)
					.desc(color);
				/*-- setor/porcentagem --*/
				plot.svg
					/*-- setor --*/
					.semicircle(xc, yc, r, start, width)
					.attribute({
						id: idPie,
						fill: color,
						stroke: color,
						role: "img",
						"aria-labelledby": `${id.name[n]} ${id.label[l]} ${idVal}`,
						class: "css-wd-plot-area",
						display: l === 0 ? "" : "none"
					})
					.title(`${label}\n${name}\n${value} (${(100*ratio).toFixed(2)}%)`)
					/*-- porcentagem --*/
					.text(tx, ty, tratio, tp)
					.attribute({
						id: idVal,
						fill: color,
						display: l === 0 ? "" : "none"
					})
					.title(tratio);
				/*-- incremento --*/
				start += width;
				controls.push(idPie, idVal);
				/*-- descrição --*/
				desc.push(`${name}: ${tratio} (${tvalue})  [${tcolor}]`);
			}, this);
			/*-- rótulos (interativo, lado esquerdo) --*/
			plot.svg
				.text(padd, yi + l*(side+padd) + side/2, label, "hw")
				.attribute({
					id: id.label[l],
					tabindex: 0,
					"text-decoration": l === 0 ? "underline" : "normal",
					"font-weight": l === 0 ? "bold" : "normal",
					cursor: "pointer",
					role: "button",
					"aria-expanded": l === 0 ? "true" : "false",
					"aria-controls": controls.join(" "),
				})
				.title(label);
			/*-- eventos --*/
			plot.svg.last.addEventListener("click", this);
			plot.svg.last.addEventListener("keydown", this);
		}, this);
		plot.svg.svg().getElementById(id.desc).textContent = desc.join("\n");
		return
	},
	/**. '{node plot(object data)}: Retorna um gráfico de barras ou de setores em SVG conforme especificado em '{data} ou nulo:
	|Propriedade|Tipo|Opcional|Descrição|Observação|
	|title|string|Sim|Título do gráfico||
	|type|string|Sim|Define o tipo de análise gráfica|Valor padrão é '{count}|
	|view|string|Sim|Define o tipo de gráfico, se setores ('{pie}) ou de barras ('{bar})|Valor padrão é '{bar}|
	|dataset|array|Não|Conjunto de dados|Lista de objetos|
	|dataset.name|string|Sim|Nome do conjunto de dados||
	|dataset.data|array|Não|Conjunto de dados numericos para análise|Aceita-se números finitos e datas|
	- Os tipos possíveis são '{key}, '{sum} e '{count};
	- O tipo '{key} estabelece um relacionamento entre o primeiro conjunto (identificadores) e os demais (valores);
	- O tipo '{sum} estabelece um relacionamento entre a soma dos conjuntos (valores) e seus respectivos nomes (identificadores);
	- O tipo '{count} estabelece um relacionamento entre os itens dos conjuntos (identificadores) e sua respectiva contagem (valores);**/
	plot: function(data) {
		/*-- checando dados --*/
		if (data === null || typeof data !== "object" || !Array.isArray(data.dataset)) return null;
		const plot = {
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