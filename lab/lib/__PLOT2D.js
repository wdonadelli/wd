/**
#3 Análise Gráfica
O objeto '{__PLOT2D} apresenta ferramentas para construção de gráficos duas dimensões.
**/
const __PLOT2D = {
	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- PLOT2D --*/
.css-wd-plot {
	background: white;
	color: #333333;
	font-family: sans-serif;
	font-size: ${__SVG.labelSize}px;
	border: thin solid black;
}
.css-wd-plot .css-wd-plot-title {
	font-size: ${__SVG.titleSize}px;
	font-weight: bold;
}
.css-wd-plot .css-wd-plot-area {
	stroke-width: 1;
	stroke-linecap: round;
	fill-opacity: 0.75;
}
.css-wd-plot .css-wd-plot-line {
	stroke: #333333;
	fill: none;
	stroke-width: 1;
	stroke-linecap: round;
}`),
	/**. '{object heap}: Registra os gŕaficos construídos.**/
	heap: {},
	/**. '{object ground}: Define a fonte e a cor de fundo ('{back}) e da fonte ('{fore}).**/
	ground: {
		fore: "white",
		back: "#202020",
		font: "Fira Mono, DejaVu Sans Mono, Menlo, Consolas, Liberation Mono, Monaco, Lucida Console, monospace",
	},
	/**. '{array RGB}: Registra as cores na sequência azul verde vermelho amarelo branco.**/
	RGB: ("deepSkyBlue lime hotPink gold khaki cornflowerBlue mediumSpringGreen orchid darkOrange beige aqua greenYellow salmon coral silver aquamarine mediumSeaGreen tomato peru lightBlue").split(" "),
	/**. '{object curve(any y, string fit}: Retorna um objeto que identifica o tipo ('{type}) de dado, o modelo da curva principal ('{curve}) e o modelo da curva do ajuste ('{fit}) ou nulo em casa de valores de '{y} diferentes de constante, função e lista. O argumento '{fit} é o valor informado pelo usuário (opcional):
	|Curva|Descrição|Tipo de dado|
	|'{dot}|Pontos representados por círculos|Lista|
	|'{line}|Pontos ligados por linha|Lista, constante e função|
	|'{step}|Pontos ligados em níveis|Lista|
	|'{curve}|Pontos ligados por curvas|Lista e função|
	|'{dash}|Pontos ligados por linhas pontilhadas|Lista e função|
	|'{link}|Pontos ligados por linhas e círculos|Lista|
	|'{linFit}|Ajuste linear dos pontos|Lista, função e constante|
	|'{expFit}|Ajuste exponencial dos pontos|Lista, função e constante|
	|'{logFit}|Ajuste logaritmo dos pontos|Lista, função e constante|
	|'{geoFit}|Ajuste geométrico dos pontos|Lista, função e constante|
	|'{avgFit}|Média dos pontos|Lista, função e constante|
	|'{sumFit}|Área sobre os pontos ligados por linhas|Lista, função e constante|**/
	curve: function(y, fit) {
		const data  = {type: null, curve: null, fit: null};
		const isFit = (/^(lin|exp|log|geo|avg|sum)Fit$/).test(fit);
		const array = ["dot", "line", "step", "link", "curve", "dash"];
		const funct = ["line", "dash", "curve"];
		/*-- tipo de dado --*/
		if (Array.isArray(y) && y.length > 1)    data.type  = "array";
		else if (typeof y === "function")        data.type  = "function";
		else if (__DATA2D.toNumeric(y) !== null) data.type  = "constant";
		else return null;
		/*-- tipo de curva --*/
		if      (data.type === "constant") data.curve = "line";
		else if (data.type === "function") data.curve = funct.indexOf(fit) >= 0 ? fit : "line";
		else                               data.curve = array.indexOf(fit) >= 0 ? fit : "dot";
		/*-- tipo de ajuste --*/
		if (isFit) {
			data.fit   = fit === "sumFit" ? "area" : "line";
			data.curve = fit === "sumFit" ? "line" : (data.type === "array" ? "dot" : "dash");
		}
		return data;
	},
	/**. '{string svgPath(array dataXY, string type}: Retorna o valor do atributo '{d} para uso no elemento '{path}.**/
	svgPath: function(dataXY, type) {
		const r = 7;
		if (type === "dot") return dataXY.reduce(function(path,v,i,a) {
			return path + `M ${v.x-r},${v.y} a ${r},${r} 0 1,0 ${2*r},0 a ${r},${r} 0 1,0 ${-2*r},0`
		}, "");
		if (type === "line") return dataXY.reduce(function(path,v,i,a) {
			return path + `${i === 0 ? "M" : (i === 1 ? "L" : "")} ${v.x},${v.y} `;
		}, "");
		if (type === "step") return dataXY.reduce(function(path,v,i,a) {
			return path + (i === 0 ? `M ${v.x},${v.y} ` : `H ${v.x} V ${v.y} `);
		}, "");
		if (type === "curve") return dataXY.reduce(function(path,v,i,a) {
			if (i === 0)
				return path + `M ${v.x},${v.y} `;
			if (a.length < 3)
				return path + `Q ${a[i-1].x},${a[i-1].y} ${v.x},${v.y} `;
			if (i === 2)
				return path + `C ${a[i-2].x},${a[i-2].y} ${a[i-1].x},${a[i-1].y} ${v.x},${v.y} `;
			if (i > 2 && i%2 === 0)
				return path + `S ${a[i-1].x},${a[i-1].y} ${v.x},${v.y} `;
			if (i === a.length - 1)
				return path + `S ${v.x},${v.y} ${v.x},${v.y} `;
			return path;
		}, "");
		if (type === "area")
			return this.svgPath(dataXY, "line") + "Z";
		if (type === "link")
			return this.svgPath(dataXY, "line") + this.svgPath(dataXY, "dot");
		if (type === "dash")
			return this.svgPath(dataXY, "line");
		return "";
	},
	/**. '{object frame}: Registra os pontos de referência do gráfico em '{px}.
	|Atributo|Descrição|
	|w|Tamanho horizontal da tela|
	|h|Tamanho vertical da tela|
	|s|Número de pontos da escala|
	|p|Espaço de preenchimento|
	|xi|Ponto de início do eixo x|
	|xf|Ponto de término do eixo x|
	|x|Tamanho do eixo x|
	|xm|Centro do eixo x|
	|gm|Funcção que retorna a posição das grades secundárias Centro do eixo x|
	|yi|Ponto de início do eixo y|
	|yf|Ponto de término do eixo y|
	|y|Tamanho do eixo y|
	|ym|Centro do eixo y|**/
	frame: {
		w: Math.max(window.screen.width, window.screen.height),
		h: Math.min(window.screen.width, window.screen.height),
		s: 5,
		get p()  {return Math.trunc(0.01 * this.w);},
		get xi() {return Math.trunc(0.10 * this.w);},
		get xf() {return this.w - Math.trunc(0.15 * this.w);},
		get x()  {return this.xf - this.xi;},
		get xm() {return Math.trunc((this.xi + this.xf)/2);},
		get yi() {return Math.trunc(0.10 * this.h);},
		get yf() {return this.h - Math.trunc(0.15 * this.h);},
		get y()  {return this.yf - this.yi;},
		get ym() {return Math.trunc((this.yi + this.yf)/2);},
	},
	/**. '{void gridInfo(object plot)}: Retorna os dados do gráfico para fins de acessibilidade.**/
	gridInfo: function (plot) {
		return [
			"-- Chart -----------------------------------------",
			"Type: Cartesian Plane",
			`Title: ${plot.title}`,
			`Dataset: ${plot.yData.length}`,
			`Scale Divisions: ${this.frame.s} (horizontal e vertical)`,
			"Background: black",
			"Foreground: white",
			"-- X-Axis (Abscissa/Horizontal) ------------------",
			`Label: ${plot.xLabel}`,
			`Minimum: ${this.scale(plot.xMin, plot.xType)}`,
			`Maximum: ${this.scale(plot.xMax, plot.xType)}`,
			"-- Y-Axis (Ordinate/Vertical) --------------------",
			`Label: ${plot.yLabel}`,
			`Minimum: ${this.scale(plot.yMin, plot.yType)}`,
			`Maximum: ${this.scale(plot.yMax, plot.yType)}`
		].join("\n");
	},
	/**. '{string scale(number value, string type)}: Retorna o valor visual a ser exibido no gráfico conforme tipo da escala.**/
	scale: function(value, type) {
		if (type === "date")     return __DATA2D.date(value);
		if (type === "time")     return __DATA2D.time(value);
		if (type === "datetime") return __DATA2D.datetime(value);
		return __DATA2D.numeric(value);
	},
	/**. '{void struct(object plot)}: Define a estrutura básica do gráfico.**/
	struct: function(plot) {
		const back = this.ground.back;
		const fore = this.ground.fore;
		const font = this.ground.font;
		const attr = {
			svg:   {style: `background: ${back}; font-family: ${font};`, "aria-labelledby": __ID.value, id: __ID.value,},
			main:  {stroke: fore, fill: "none", "stroke-width": 2, "stroke-linecap": "round"},
			title: {fill: fore, "font-size": "1.5em"},
			label: {fill: fore, "font-size": 20},
			scale: {fill: fore, "font-size": 20},
			grid:  {stroke: fore, fill: "none", "stroke-width": 1, "stroke-linecap": "round"},
			guide: {stroke: fore, fill: "none", "stroke-width": 1, "stroke-linecap": "round", "stroke-dasharray": "5,5", display: "none"},
			point: {fill: fore, "font-size": 20},
			back:  {fill: back, "fill-opacity": 0.75, display: "none"}
		};
		/*-- SVG --*/
		plot.svg.attribute(attr.svg);
		plot.svg.last.addEventListener("mousemove", this);
		plot.svg.last.setAttribute("class", "css-wd-plot");
		plot.frame = {};
		/*-- título --*/
		plot.frame.title = plot.svg
			.text(this.frame.xm, this.frame.yi/2, plot.title, "h")
			.attribute(attr.title)
			.attribute({id: attr.svg["aria-labelledby"], "font-size": 30})
			.last;
		/*-- quadro principal --*/
		plot.frame.main = plot.svg
			.rect(this.frame.xi, this.frame.yi, this.frame.x, this.frame.y)
			.attribute(attr.main)
			.desc(this.gridInfo(plot))
			.last;
		/*-- Rótulo x --*/
		plot.frame.xLabel = plot.svg
			.text(this.frame.xm, this.frame.h - this.frame.p, plot.xLabel, "hs")
			.attribute(attr.label)
			.last;
		/*-- Rótulo y --*/
		plot.frame.yLabel = plot.svg
			.text(0 + this.frame.p, this.frame.ym, plot.yLabel, "vn")
			.attribute(attr.label)
			.last;
		/*-- grades e escalas --*/
		for (let i = 0; i < this.frame.s; i++) {
			let px = this.frame.xi + i*(this.frame.x/(this.frame.s - 1));
			let py = this.frame.yi + i*(this.frame.y/(this.frame.s - 1));
			let vx = i === this.frame.s - 1 ? plot.xMax : plot.xMin + i*((plot.xMax - plot.xMin)/(this.frame.s - 1));
			let tx = i === 0 ? "hnw" : (i === this.frame.s - 1 ? "hne" : "hn");
			let vy = i === this.frame.s - 1 ? plot.yMin : plot.yMax - i*((plot.yMax - plot.yMin)/(this.frame.s - 1));
			let ty = i === 0 ? "hne" : (i === this.frame.s - 1 ? "hse" : "he");
			/*-- grades de subdivisão --*/
			if (i > 0 && i < this.frame.s - 1) {
				plot.frame[`xGrid${i}`] = plot.svg
					.path(`M ${px},${this.frame.yi} V ${this.frame.yf}`)
					.attribute(attr.grid)
					.last;
				plot.frame[`yGrid${i}`] =  plot.svg
					.path(`M ${this.frame.xi},${py} H ${this.frame.xf}`)
					.attribute(attr.grid)
					.last;
			}
			/*-- ajuste espacial para a escala --*/
			let dx = 0, dy = 0;
			if (plot.yType === "date" || plot.yType === "time") {
				ty = i === 0 ? "vse" : (i === this.frame.s - 1 ? "vsw" : "vs");
				dx = -(i)%2 * (1.5 * attr.label["font-size"]);
			} else if (plot.yType === "datetime") {
				ty = i === 0 ? "hnw" : "hsw";
				dx = 2*this.frame.p;
				py += (i === 0 ? 1 : -1) * this.frame.p;
			}
			if (plot.xType === "datetime") {
				dy = i%2 * (1.5 * attr.label["font-size"]);
			}
			/*-- escala --*/
			plot.frame[`xScale${i}`] = plot.svg
				.text(px, this.frame.yf + this.frame.p + dy, this.scale(vx, plot.xType), tx)
				.attribute(attr.scale)
				.last;
			plot.frame[`yScale${i}`] = plot.svg
				.text(this.frame.xi - this.frame.p + dx, py, this.scale(vy, plot.yType), ty)
				.attribute(attr.scale)
				.last;
		}
		/*-- visualizadores de posição --*/
		plot.frame.xPoint = plot.svg
			.text(this.frame.xf, this.frame.yf + this.frame.p, "xPoint", "hn")
			.attribute(attr.point)
			.attribute({id: __ID.value, display: "none"})
			.last;
		plot.frame.yPoint = plot.svg
			.text(this.frame.xi - this.frame.p, this.frame.yi, "yPoint", "vs")
			.attribute(attr.point)
			.attribute({id: __ID.value, display: "none"})
			.last;
		/*-- marcadores de posição --*/
		plot.frame.xGuide = plot.svg
			.path(`M ${this.frame.xm}, ${this.frame.yi} V ${this.frame.yf}`)
			.attribute(attr.guide)
			.attribute({"aria-labelledby": plot.frame.xPoint.id})
			.last;
		plot.frame.yGuide = plot.svg
			.path(`M ${this.frame.xi}, ${this.frame.ym} H ${this.frame.xf}`)
			.attribute(attr.guide)
			.attribute({"aria-labelledby": plot.frame.yPoint.id})
			.last;
		/*-- visualizador de dados --*/
		plot.frame.back = plot.svg
			.rect(this.frame.xi, this.frame.yi, this.frame.x, this.frame.y)
			.attribute(attr.back)
			.last;
		return;
	},
	/**. '{object dataXY(array x, any y, array xList)}: Função auxiliadora do método '{filter} retornando o valor de '{xy}, e os valores mínimo ('{min}) e máximo ('{max}) de '{y} ou nulo.**/
	dataXY: function(x, y, xList) {
		const curve = this.curve(y);
		const data  = {};
		if (curve.type === "constant") {
			const Y  = __DATA2D.toNumeric(y);
			const XY = __DATA2D.dataXY(x, Array(x.length).fill(Y));
			data.xy  = [XY[0], XY[XY.length - 1]];
			data.min = Y;
			data.max = Y;
			return data;
		}
		if (curve.type === "function") {
			const Y  = __DATA2D.map(xList, y);
			data.xy  = __DATA2D.dataXY(xList, Y);
			data.min = __DATA2D.MIN(Y);
			data.max = __DATA2D.MAX(Y);
			return data;
		}
		if (curve.type === "array") {
			const Y  = __DATA2D.convert(y);
			data.xy  = __DATA2D.dataXY(x, Y);
			data.min = __DATA2D.MIN(Y);
			data.max = __DATA2D.MAX(Y);
			return data;
		}
		return null;
	},
	/**. '{boolean filter(object plot, object yData, integer i)}: Função auxiliadora do método '{plot}.**/
	filter: function (plot, yData, i) {
		const dataset = {};
		const dataXY  = this.dataXY(plot.xData, yData.data, plot.xList);
		const curve   = this.curve(yData.data, yData.fit);
		if (dataXY === null) return false;
		/*-- curva principal --*/
		dataset.data  = dataXY.xy;
		dataset.name  = "name" in yData ? String(yData.name).trim() : `#${i}`;
		dataset.color = this.RGB[i%this.RGB.length];
		dataset.curve = curve.curve;
		dataset.id    = __ID.value;
		dataset.fit   = curve.fit === null ? null : __DATA2D[yData.fit](dataset.data);
		dataset.plus  = null;
		const yList   = __DATA2D.toList(dataset.data, "y");
		plot.yMin     = Math.min(plot.yMin, __DATA2D.MIN(yList));
		plot.yMax     = Math.max(plot.yMax, __DATA2D.MAX(yList));
		plot.yType.push(__DATA2D.numType(Array.isArray(yData.data) ? yData.data : yList));
		/*-- curva de ajuste --*/
		if (dataset.fit !== null) {
			const fitXY = this.dataXY(plot.xData, dataset.fit.f, plot.xList);
			dataset.fit.curve = curve.fit;
			dataset.fit.data  = fitXY.xy;
			if (yData.fit === "linFit" || yData.fit === "avgFit")
				dataset.fit.data = [fitXY.xy[0], fitXY.xy[fitXY.xy.length - 1]];
			else if (yData.fit === "sumFit") {
				dataset.fit.data = dataset.data.slice();
				dataset.fit.data.unshift({x: dataset.data[0].x, y: 0});
				dataset.fit.data.push({x: dataset.data[dataset.data.length - 1].x, y: 0});
			}
			const yFitList = __DATA2D.toList(dataset.fit.data, "y");
			plot.yMin   = Math.min(plot.yMin, __DATA2D.MIN(yFitList));
			plot.yMax   = Math.max(plot.yMax, __DATA2D.MAX(yFitList));
		}
		plot.yData.push(dataset);
		return true;
	},
	/**. '{void convert(object plot, object data)}: Função auxiliar do método '{print} que converte dados numéricos em pontos no gráfico.**/
	convert: function(plot, data) {
		const dx = __DATA2D.round(plot.xMax - plot.xMin);
		const dy = __DATA2D.round(plot.yMin - plot.yMax);
		const rx = __DATA2D.round(this.frame.x/dx);
		const ry = __DATA2D.round(this.frame.y/dy);
		const xi = this.frame.xi;
		const xf = this.frame.xf;
		const yi = this.frame.yi;
		const yf = this.frame.yf;
		return data.map(function(v,i,a) {
			return {
				x: v.x === plot.xMin ? xi : (v.x === plot.xMax ? xf : xi + __DATA2D.round(rx * (v.x - plot.xMin))),
				y: v.y === plot.yMin ? yf : (v.y === plot.yMax ? yi : yi + __DATA2D.round(ry * (v.y - plot.yMax)))
			};
		});
	},
	/**. '{void infoCurve(object data)}: Desfine a descrição da curva para acessibilidade.**/
	infoCurve: function(data) {
		const info = [
			"-- Curve Data ------------------------------------",
			`Name: ${data.name}`,
			`Color: ${data.color.replace(/([A-Z])/g, " $1").toLowerCase()}`,
			`Shape: ${data.curve}`,
		];
		if (data.fit !== null) {
			info.push("-- Curve Fitting Data ----------------------------");
			info.push(`Fitting: ${data.fit.t}`);
			info.push(`Shape: ${data.fit.m}`);
			if (data.fit.a !== null) info.push(`a: ${data.fit.a}`);
			if (data.fit.b !== null) info.push(`b: ${data.fit.b}`);
			if (data.fit.d !== null) info.push(`σ: ${data.fit.d}`);
		}
		info.push("-- Curve Dataset ---------------------------------");
		info.push(data.data.reduce(function(txt,v,i,a) {
			return txt + `${i}\t${v.x}\t${v.y}` + (i === a.length - 1 ? "" : "\n");
		}, "#\tx\ty\n"));
		info.push("--------------------------------------------------\n");
		return info.join("\n");
	},
	/**. '{void print(object plot)}: Plota as curvas no gráfico.**/
	print: function(plot) {
		const attr = {
			line:  function(color) {return {stroke: color,  "stroke-width": 3, "stroke-linecap": "round", fill: "none"};},
			area:  function(color) {return {fill: color, "fill-opacity": 0.4};},
			dash:  function(color) {return Object.assign(this.line(color), {"stroke-dasharray": "5 6", "stroke-width": 2});},
			step:  function(color) {return Object.assign(this.line(color), {"stroke-width": 12, "stroke-linecap": "butt"});},
			link:  function(color) {return this.line(color);},
			curve: function(color) {return this.line(color);},
			dot:   function(color) {return {fill: color};},
		};
		plot.yData.filter(function(v,i,a) {
			const main = this.convert(plot, v.data);
			const info = this.infoCurve(v);
			const size = 24;
			const head = __ID.value;
			const body = __ID.value;
			/*-- legenda --*/
			plot.frame[`legend${i}`] = plot.svg
				.text(this.frame.xf + 2*this.frame.p, this.frame.yi + 3/2*i*size, v.name, "hnw")
				.attribute({id: head, fill: v.color, "font-size": size, cursor: "pointer", tabindex: 0})
				.attribute({"aria-controls": body, "aria-expanded": "false"})
				.last;
			plot.svg.last.addEventListener("click", this);
			plot.svg.last.addEventListener("keydown", this);
			/*-- curva principal --*/
			plot.frame[`curve${i}`] = plot.svg
				.path(this.svgPath(main, v.curve))
				.attribute(attr[v.curve](v.color))
				.attribute({id: v.id, "aria-labelledby": head})
				.desc(info)
				.last;
			/*-- detalhes --*/
			plot.frame[`detail${i}`] = plot.svg
				.text(this.frame.xi + this.frame.p, this.frame.yi + this.frame.p, info.split("-- Curve Dataset")[0], "hnw")
				.attribute({id: body, "aria-labelledby": head, fill: v.color, "font-size": size, display: "none"})
				.last;
			/*-- curva de ajuste --*/
			const fit = v.fit !== null ? this.convert(plot, v.fit.data) : null;
			if (fit !== null)
				plot.frame[`fit${i}`] = plot.svg
					.path(this.svgPath(fit, v.fit.curve))
					.attribute(attr[v.fit.curve](v.color))
					.title(v.fit.v)
					.desc(info)
					.last;
		}, this);
		return;
	},
	/**. '{array xList(number min, number max)}: Retorna o array contendo os intervalos de '{x} para definir pontos da função.**/
	xList: function(min, max) {
		const dw = __DATA2D.round(max - min);
		const pt = this.frame.x;
		const dx = __DATA2D.round(dw/pt);
		return Array(pt).fill(0).map(function(v,i,a) {
			return i === a.length - 1 ? max : __DATA2D.round(min + __DATA2D.round(i * dx));
		});
	},
	/**. '{node plot(object data)}: Retorna um gráfico de plano cartesiano em SVG conforme especificado em '{data} ou nulo:
	|Propriedade|Tipo|Opcional|Descrição|Observação|
	|title|string|Sim|Título do gráfico||
	|x|object|Não|Registra dados do eixo x||
	|x.label|string|Sim|Rótulo do eixo x||
	|x.data|array|Não|Lista de valores de '{x} da curva|Cumprimento maior ou igual a dois|
	|y|object|Não|Registra dados do eixo y|
	|y.label|string|Sim|Rótulo do eixo y||
	|y.dataset|array|Não|Conjunto de curvas||
	|y.dataset.name|string|Sim|Nome da curva||
	|y.dataset.data|finite|Não|A constante da curva||
	|y.dataset.data|function|Não|A função da curva||
	|y.dataset.data|array|Não|A lista de valores de '{y} para a curva||
	|y.dataset.fit|string|Sim|Ajuste ou tipo de curva|ver '{curves}|
	Os valores de plotagem devem ser do tipo finito, data (em dias), tempo ou datatempo (em milissegundos).**/
	plot: function(data) {
		/*-- checando validade dos dados --*/
		if (
			typeof data !== "object" || typeof data.x !== "object" || typeof data.y !== "object" ||
			!Array.isArray(data.x.data) || !Array.isArray(data.y.dataset)
		) return null;
		const plot  = {};
		/*-- geral --*/
		plot.svg    = new __SVG(this.frame.w, this.frame.h, 0, 0);
		plot.title  = "title" in data   ? data.title   : "Title";
		/*-- eixo x --*/
		plot.xLabel = "label" in data.x ? data.x.label : "Label x";
		plot.xData  = __DATA2D.convert(data.x.data);
		plot.xType  = __DATA2D.numType(data.x.data);
		plot.xMin   = __DATA2D.MIN(plot.xData);
		plot.xMax   = __DATA2D.MAX(plot.xData);
		plot.xLen   = __DATA2D.round(plot.xMax - plot.xMin);
		plot.xList  = this.xList(plot.xMin, plot.xMax);
		if (plot.xMin === plot.xMax || plot.xData.length === 0) return null;
		/*-- eixo y --*/
		plot.yLabel = "label" in data.y ? data.y.label : "Label y";
		plot.yMin   = +Infinity;
		plot.yMax   = -Infinity;
		plot.yType  = [];
		plot.yData  = [];
		data.y.dataset.filter(function(v,i,a) {
			return typeof v === "object" ? this.filter(plot, v, i) : false;
		}, this);
		if (plot.yMin === plot.yMax) {
			plot.yMin -= plot.yMin === 0 ? 1 : plot.yMin/2;
			plot.yMax += plot.yMax === 0 ? 1 : plot.yMax/2;
		}
		plot.yType = plot.yType.filter(function(v,i,a) {return a.indexOf(v) === i;});
		plot.yType = plot.yType.length > 1 ? "finite" : plot.yType[0];
		/*-- construindo gráfico --*/
		this.struct(plot);
		this.print(plot);
		/*-- registrando o gráfico --*/
		const svg = plot.svg.svg(document.body);//TODO remover document.body
		this.heap[svg.id] = plot;
		return svg;
	},
	/**. '{void mousemove(object ev)}: Manipulador ao movimentar o mouse sobre a caixa de plotagem.**/
	mousemove: function(ev) {
		const heap = this.heap[ev.currentTarget.id];
		const re   = /^[xy](Grid|Scale)\d+$/;
		const gx   = heap.frame.xGuide;
		const gy   = heap.frame.yGuide;
		const sx   = heap.frame.xPoint;
		const sy   = heap.frame.yPoint;
		const data = ev.currentTarget.getBoundingClientRect();
		const px   = (ev.offsetX/data.width)  * this.frame.w;
		const py   = (ev.offsetY/data.height) * this.frame.h;
		/*-- dentro da grade principal --*/
		if (px >= this.frame.xi && px <= this.frame.xf && py >= this.frame.yi && py <= this.frame.yf) {
			const frame = this.frame;
			const xMin  = heap.xMin;
			const xMax  = heap.xMax;
			const vx    = px === frame.xi ? xMin : (px === frame.xf ? xMax : (((px - frame.xi)/frame.x) * (xMax - xMin)) + xMin);
			const yMin  = heap.yMin;
			const yMax  = heap.yMax;
			const vy    = py === frame.yi ? yMax : (py === frame.yf ? yMin : (((py - frame.yi)/frame.y) * (yMin - yMax)) + yMax);
			gx.setAttribute("d", `M ${px},${frame.yi} V ${frame.yf}`);
			gy.setAttribute("d", `M ${frame.xi},${py} H ${frame.xf}`);
			sx.textContent = this.scale(vx, heap.xType);
			sy.textContent = this.scale(vy, heap.yType);
			sx.setAttribute("x", px);
			sy.setAttribute("x", -py);
			/*-- mostrar guia dinâmica --*/
			[gx, gy, sx, sy].forEach(function(v,i,a) {v.removeAttribute("display");});
			/*-- esconder grade e escala --*/
			for (let i in heap.frame)
				if (re.test(i)) heap.frame[i].setAttribute("display", "none");
		}
		/*-- fora da grade principal --*/
		else {
			/*-- esconder guia dinâmica --*/
			[gx, gy, sx, sy].forEach(function(v,i,a) {v.setAttribute("display", "none");});
			/*-- mostrar grade e escala --*/
			for (let i in heap.frame)
				if (re.test(i)) heap.frame[i].removeAttribute("display");
		}
		return;
	},
	/**. '{void click(object ev)}: Manipulador ao clicar sobre o nome da curva na legenda.**/
	click: function(ev) {
		const heap = this.heap[ev.currentTarget.parentElement.id].frame;
		const open = ev.currentTarget.getAttribute("aria-expanded") === "false";
		const ctrl = ev.currentTarget.getAttribute("aria-controls");
		/*-- procedimento para exibir ou esconder detalhes --*/
		heap.back.setAttribute("display", "none");
		for (let i in heap) {
			if ((/^legend\d+$/).test(i)) {
				heap[i].setAttribute("aria-expanded", heap[i] === ev.currentTarget && open ? "true" : "false");
			}
			else if ((/^detail\d+$/).test(i)) {
				if (heap[i].id === ctrl && open) {
					heap.back.removeAttribute("display");
					heap[i].removeAttribute("display");
					ev.currentTarget.parentElement.appendChild(heap.back);
					ev.currentTarget.parentElement.appendChild(heap[i]);
				}
				else {
					heap[i].setAttribute("display", "none");
				}
			}
		}
		return;
	},
	/**. '{void keydown(object ev)}: Manipulador ao teclar ENTER sobre o nome da curva na legenda.**/
	keydown: function(ev) {
		if (ev.key === "Enter") this.click(ev);
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador de manipulação chamado durante os eventos '{mousemove} e '{click}.**/
	handleEvent: function(ev) {
		if (ev.type in this) this[ev.type](ev);
		return;
	},
};