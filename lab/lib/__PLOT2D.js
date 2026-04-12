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
.css-wd-plot .css-wd-plot-line,
.css-wd-plot .css-wd-plot-dash {
	stroke: #333333;
	fill: none;
	stroke-linecap: round;
}
.css-wd-plot .css-wd-plot-dash {
	stroke-dasharray: 5,5
}`),
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
	|lb|Altura do rótulo|
	|tl|Altura do título|
	|xi|Ponto de início do eixo x|
	|xf|Ponto de término do eixo x|
	|x|Tamanho do eixo x|
	|xm|Centro do eixo x|
	|yi|Ponto de início do eixo y|
	|yf|Ponto de término do eixo y|
	|y|Tamanho do eixo y|
	|ym|Centro do eixo y|**/
	frame: {
		w: Math.max(window.screen.width, window.screen.height),
		h: Math.min(window.screen.width, window.screen.height),
		s: 5,
		get p()  {return __SVG.paddSize;},
		get lb() {return __SVG.labelSize;},
		get tl() {return __SVG.titleSize;},
		get xi() {return Math.trunc(2*this.p + this.lb + 0.10 * this.w);},
		get xf() {return Math.trunc(this.w - (this.p + 0.20 * this.w));},
		get x()  {return this.xf - this.xi;},
		get xm() {return (this.xi + this.xf)/2;},
		get yi() {return Math.trunc(2*this.p + this.tl);},
		get yf() {return Math.trunc(this.h - (4*this.p + 3*this.lb));},
		get y()  {return this.yf - this.yi;},
		get ym() {return (this.yi + this.yf)/2;},
	},
	/**. '{string scale(number value, string type)}: Retorna o valor visual a ser exibido no gráfico conforme tipo da escala.**/
	scale: function(value, type) {
		if (type === "date")     return __DATA2D.date(value);
		if (type === "time")     return __DATA2D.time(value);
		if (type === "datetime") return __DATA2D.datetime(value);
		return __DATA2D.numeric(value);
	},
	/**. '{void desc(object plot)}: Define as descrições do gráfico.**/
	desc: function(plot) {
		const types = {
			finite: "numerical value",
			date: "date, unit in days",
			time: "time, unit in seconds",
			datetime: "date and time, unit in seconds"
		};
		plot.desc = {svg: [], curves: [], dataset: []};
		plot.desc.svg.push(
			`This is a graph plotted on a Cartesian plane titled "${plot.title}"`,
			`The chart has a white background and the font is predominantly black.`,
			`At the top of the graph is the graph title, and below it is the plotting area containing the curves.`,
			`On the left side of the plotting area is the y-axis scale and its respective label.`,
			`At the bottom of the plotting area is the x-axis scale and its respective label.`,
			`The scale values ​​increase from the bottom left corner.`,
			`On the right side of the plot is the graph legend containing the names of the curves differentiated by color.`,
			`The x-axis (Abscissa/Horizontal) is labeled "${plot.xLabel}" and its scale (${types[plot.xType]}) has ${this.frame.s} equal interval divisions, from ${this.scale(plot.xMin, plot.xType)} to ${this.scale(plot.xMax, plot.xType)}.`,
			`The y-axis (Ordinate/Vertical) is labeled "${plot.yLabel}" and its scale (${types[plot.yType]}) has ${this.frame.s} equal interval divisions, from ${this.scale(plot.yMin, plot.yType)} to ${this.scale(plot.yMax, plot.yType)}.`,
			`The chart has ${plot.yData.length} dataset${plot.yData.length > 1 ? "s" : ""}.`
		);
		/*-- informações sobre as curvas --*/
		plot.yData.forEach(function(v,i,a) {
			const color = v.color.replace(/([A-Z])/g, " $1").toLowerCase();
			const yList = __DATA2D.toList(v.data, "y");
			const yMax  = __DATA2D.MAX(yList);
			const yMin  = __DATA2D.MIN(yList);
			plot.desc.svg.push([
				`The curve named "${v.name}" is represented by the color "${color}" and its shape is defined as "${v.curve}".`,
				v.fit === null ? "" : v.fit.desc
			].join(" ").trim());
			plot.desc.curves.push([
				`-- CURVE DATA --\n`,
				`Name:  ${v.name};\n`,
				`Color: ${color};\n`,
				`Shape: ${v.curve};\n`,
				v.fit === null ? "" : `\n-- CURVE FITTING DATA --\n`,
				v.fit === null ? "" : `Fitting: ${v.fit.t};\n`,
				v.fit === null ? "" : `Shape:   ${v.fit.m};\n`,
				v.fit === null ? "" : (v.fit.a === null ? "" : `a: ${v.fit.a};\n`),
				v.fit === null ? "" : (v.fit.b === null ? "" : `b: ${v.fit.b};\n`),
				v.fit === null ? "" : (v.fit.d === null ? "" : `σ: ${v.fit.d};\n`),
			].join("").trim());
			plot.desc.dataset.push([
				`Coordinates of the dataset:`,
				v.data.map(function(c,j,b) {
					const info = yMin === yMax ? "" : (c.y === yMin ? " (minimum)" : (c.y === yMax ? " (maximum)" : ""));
					return `${i}: x=${c.x}, y=${c.y}${info};`;
				}).join("\n")
			].join("\n").trim());
		});
		plot.desc.svg = plot.desc.svg.join("\n");
		return;
	},
	/**. '{void struct(object plot)}: Define a estrutura básica do gráfico.**/
	struct: function(plot) {
		const idTitle  = __ID.value;
		const idDesc   = __ID.value;
		const idPoint  = __ID.value;
		/*-- SVG --*/
		plot.svg = new __SVG(this.frame.w, this.frame.h, 0, 0);
		plot.svg
			.attribute({id: plot.id, class: "css-wd-plot", role: "img", "aria-labelledby": idTitle, "aria-describedby": idDesc})
			.desc(plot.desc.svg, {lang: "en-US", id: idDesc})
			.last.addEventListener("mousemove", this);
		/*-- título --*/
		plot.svg
			.text(this.frame.xm, this.frame.yi/2, plot.title, "h")
			.attribute({id: idTitle, class: "css-wd-plot-title", role: "heading", "aria-level": "1"})
			.title(plot.title);
		/*-- área de plotagem --*/
		plot.svg
			.rect(this.frame.xi, this.frame.yi, this.frame.x, this.frame.y)
			.attribute({role: "region", "aria-label": "Area", tabindex: "0", class: "css-wd-plot-line"})
			.desc(`When you move the mouse pointer within the plot area, two tabs, one vertical and one horizontal, will intersect at the pointer's position to dynamically display the x and y coordinates. The same behavior can be manipulated via the keyboard by focusing on the plot area.`, {lang: "en-US"});
			plot.svg.last.addEventListener("focusin", this);
			plot.svg.last.addEventListener("focusout", this);
			plot.svg.last.addEventListener("keydown", this);
		/*-- rótulos --*/
		plot.svg
			.text(this.frame.xm, this.frame.h - this.frame.p, plot.xLabel, "hs")
			.title(plot.xLabel)
			.desc("x-axis label", {lang: "en-US"})
			.text(0 + this.frame.p, this.frame.ym, plot.yLabel, "vn")
			.title(plot.yLabel)
			.desc("y-axis label", {lang: "en-US"});
		/*-- grades e escalas --*/
		for (let i = 0; i < this.frame.s; i++) {
			let lx = i === 0 ? "xMin" : (i === this.frame.s - 1 ? "xMax" : null);
			let ly = i === 0 ? "yMax" : (i === this.frame.s - 1 ? "yMin" : null);
			let px = this.frame.xi + i*(this.frame.x/(this.frame.s - 1));
			let py = this.frame.yi + i*(this.frame.y/(this.frame.s - 1));
			let vx = lx === null ? (plot.xMin + i*((plot.xMax - plot.xMin)/(this.frame.s - 1))) : plot[lx];
			let tx = i === 0 ? "hnw" : (i === this.frame.s - 1 ? "hne" : "hn");
			let vy = ly === null ? (plot.yMax - i*((plot.yMax - plot.yMin)/(this.frame.s - 1))) : plot[ly];
			let ty = i === 0 ? "hne" : (i === this.frame.s - 1 ? "hse" : "he");
			let lm = i === 0 || i === this.frame.s - 1;
			/*-- grades de subdivisão (x e y) --*/
			plot.svg
				.line([px, this.frame[lm ? "yf" : "yi"]], [px, this.frame.yf + this.frame.p/2])
				.attribute({class: "css-wd-plot-line", "stroke-opacity": "0.5"})
				.line([this.frame.xi - this.frame.p/2, py], [this.frame[lm ? "xi" : "xf"], py])
				.attribute({class: "css-wd-plot-line", "stroke-opacity": "0.5"});
			/*-- ajuste espacial para a escala --*/
			let dx = 0, dy = 0;
			if (plot.xType !== "finite") {
				tx = "hnw";
				dx = i%2 * (this.frame.p + this.frame.lb);
			}
			if (plot.yType !== "finite") {
				ty = "vs";
				dy = -i%2 * (this.frame.p + this.frame.lb);
			}
			/*-- escalas --*/
			plot.svg
				.text(px, this.frame.yf + this.frame.p + dx, this.scale(vx, plot.xType), tx)
				.attribute(plot.xType !== "finite" ? {lengthAdjust: "spacingAndGlyphs", textLength: this.frame.x/(this.frame.s-1)} : {})
				.title(this.scale(vx, plot.xType))
				.desc(`x-axis scale value (${i+1}/${this.frame.s}`, {lang: "en-US"})
				.text(this.frame.xi - this.frame.p + dy, py, this.scale(vy, plot.yType), ty)
				.attribute(plot.yType !== "finite" ? {lengthAdjust: "spacingAndGlyphs", textLength: this.frame.y/(this.frame.s-1)} : {})
				.title(this.scale(vy, plot.yType))
				.desc(`y-axis scale value (${this.frame.s-i}/${this.frame.s})`, {lang: "en-US"});
		}
		/*-- visualizadores de posição --*/
		plot.svg
			.path(`M ${this.frame.xm},${this.frame.yi} V ${this.frame.yf} M ${this.frame.xi},${this.frame.ym} H ${this.frame.xf}`)
			.attribute({
				class: "css-wd-plot-dash", display: "none", role: "img", "aria-label": "Guide", "aria-describedby": idPoint, "stroke-width": 3,
				"data-xmin": plot.xMin, "data-xmax": plot.xMax, "data-xtype": plot.xType,
				"data-ymin": plot.yMin, "data-ymax": plot.yMax, "data-ytype": plot.yType
			})
			.text(this.frame.xm + this.frame.p, this.frame.ym - this.frame.p, "x, y", "hsw")
			.attribute({id: idPoint, display: "none", "aria-label": "Coordinates", "font-size": "smaller"});
		return;
	},
	/**. '{void print(object plot)}: Plota as curvas no gráfico.**/
	print: function(plot) {
		const attr = {
			line:  function(color) {return {stroke: color,  "stroke-width": 3, "stroke-linecap": "round", fill: "none"};},
			area:  function(color) {return {fill: color, "fill-opacity": 0.5};},
			dash:  function(color) {return Object.assign(this.line(color), {"stroke-dasharray": "5 6", "stroke-width": 2});},
			step:  function(color) {return Object.assign(this.line(color), {"stroke-width": 12, "stroke-linecap": "butt"});},
			link:  function(color) {return this.line(color);},
			curve: function(color) {return this.line(color);},
			dot:   function(color) {return {fill: color};},
		};
		/*-- curvas --*/
		plot.yData.filter(function(v,i,a) {
			const main    = this.convert(plot, v.data);
			const idHead  = __ID.value;
			const idBody  = __ID.value;
			const idCurve = __ID.value;
			const idFit   = v.fit !== null ? __ID.value : "";
			/*-- legenda --*/
			plot.svg
				.text(this.frame.xf + 2*this.frame.p, this.frame.yi + i*(2*this.frame.p + __SVG.labelSize), v.name, "hnw")
				.attribute({
					id: idHead,
					role: "button",
					tabindex: 0,
					"aria-controls": idBody,
					"aria-expanded": "false",
					fill: v.color,
					cursor: "pointer",
				})
				.title(v.name)
				.desc("Displays and hides curve detail.", {lang: "en-US"});
			plot.svg.last.addEventListener("click", this);
			plot.svg.last.addEventListener("keydown", this);
			/*-- curva --*/
			plot.svg
				.path(this.svgPath(main, v.curve))
				.attribute(attr[v.curve](v.color))
				.attribute({id: idCurve, "aria-labelledby": idHead, role: "img"})
				.title(v.name)
				.desc(plot.desc.dataset[i], {lang: "en-US"});
			/*-- ajuste --*/
			if (v.fit !== null) plot.svg
				.path(this.svgPath(this.convert(plot, v.fit.data), v.fit.curve))
				.attribute(attr[v.fit.curve](v.color))
				.attribute({id: idFit, role: "img", "aria-labelledby": idHead})
				.title(v.fit.v)
				.desc(v.fit.desc, {lang: "en-US"});
			/*-- detalhes --*/
			plot.svg
				.text(this.frame.xi + this.frame.p, this.frame.yi + this.frame.p, plot.desc.curves[i], "hnw")
				.attribute({
					id: idBody,
					role: "note",
					"aria-labelledby": idHead,
					display: "none",
					lang: "en-US",
					"font-family": "math monospace",
				})
				.desc("Information about the curve.");
		}, this);
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
	/**. '{array xList(number min, number max, integer len)}: Retorna um array contendo as coordenadas da abscissa.**/
	xList: function(min, max, len) {
		const pt = Math.floor(len);
		const dx = (max - min)/pt;
		return dx < Number.EPSILON ? this.xList(min, max, (max - min)/Number.EPSILON) : Array(pt).fill(0).map(function(v,i,a) {
			return i === a.length - 1 ? max : (min + i * dx);
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
		plot.id     = __ID.value
		plot.title  = "title" in data ? data.title : "Title";
		plot.desc   = [];
		/*-- eixo x --*/
		plot.xLabel = "label" in data.x ? data.x.label : "Label x";
		plot.xData  = __DATA2D.convert(data.x.data);
		plot.xType  = __DATA2D.numType(data.x.data);
		plot.xMin   = __DATA2D.MIN(plot.xData);
		plot.xMax   = __DATA2D.MAX(plot.xData);
		plot.xLen   = __DATA2D.round(plot.xMax - plot.xMin);
		plot.xList  = this.xList(plot.xMin, plot.xMax, this.frame.x);
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
		this.desc(plot);
		this.struct(plot);
		this.print(plot);
		return plot.svg.svg(document.body);//TODO remover document.body
	},
	/**. '{object guidePosition(string d)}: Retorna as coordenadas da guia a partir do i{path}.**/
	guidePosition: function(d) {
		return {
			x: Number(d.match(/^M\ ([0-9\.]+)/)[1]),
			y: Number(d.match(/\ M\ [0-9\.]+\,([0-9\.]+)/)[1])
		};
	},
	/**. '{void guide(node, svg, finite px, finite, py)}: Define a posição e exibição da guia.**/
	guide: function(svg, px, py) {
		const guide = svg.querySelector(`[aria-label="Guide"]`);
		const coord = svg.querySelector("#"+guide.getAttribute("aria-describedby"));
		const show  = Number.isFinite(px) && Number.isFinite(py)
		guide.setAttribute("display", show ? "" : "none");
		coord.setAttribute("display", show ? "" : "none");
		if (show) {
			px = px > this.frame.xf ? this.frame.xf : (px < this.frame.xi ? this.frame.xi : px);
			py = py > this.frame.yf ? this.frame.yf : (py < this.frame.yi ? this.frame.yi : py);
			const frame = this.frame;
			const xMin  = Number(guide.getAttribute("data-xmin"));
			const xMax  = Number(guide.getAttribute("data-xmax"));
			const yMin  = Number(guide.getAttribute("data-ymin"));
			const yMax  = Number(guide.getAttribute("data-ymax"));
			const vx    = px === frame.xi ? xMin : (px === frame.xf ? xMax : (((px - frame.xi)/frame.x) * (xMax - xMin)) + xMin);
			const vy    = py === frame.yi ? yMax : (py === frame.yf ? yMin : (((py - frame.yi)/frame.y) * (yMin - yMax)) + yMax);
			const tx    = this.scale(vx, guide.getAttribute("data-xtype"));
			const ty    = this.scale(vy, guide.getAttribute("data-ytype"));
			const d     = `M ${px},${this.frame.yi} V ${this.frame.yf} M ${this.frame.xi},${py} H ${this.frame.xf}`;
			coord.textContent = `${tx} x ${ty}`;
			guide.setAttribute("d", d);
			coord.setAttribute("x", (px > this.frame.xm ? px - this.frame.p : px + this.frame.p));
			coord.setAttribute("y", (py > this.frame.ym ? py - this.frame.p : py + this.frame.p));
			coord.setAttribute("text-anchor",       (px > this.frame.xm ? "end"         : "start"));
			coord.setAttribute("dominant-baseline", (py > this.frame.ym ? "ideographic" : "hanging"));
			svg.appendChild(coord);
			svg.appendChild(guide);
		}
		return;
	},
	/**. '{void mousemove(object ev)}: Manipulador ao movimentar o mouse sobre a caixa de plotagem.**/
	mousemove: function(ev) {
		const svg   = ev.currentTarget;
		const area  = svg.querySelector(`[aria-label=Area]`);
		const focus = document.activeElement;
		if (focus === area) return;
		const data  = svg.getBoundingClientRect();
		const px    = (ev.offsetX/data.width)  * this.frame.w;
		const py    = (ev.offsetY/data.height) * this.frame.h;
		const ok    = px >= this.frame.xi && px <= this.frame.xf && py >= this.frame.yi && py <= this.frame.yf;
		svg.setAttribute("cursor", ok ? "crosshair" : "default" )
		return this.guide(svg, ok ? px : null, ok ? py : null);
	},
	/**. '{void focusin(object ev)}: Manipulador ao focar na área de plotagem.**/
	focusin: function(ev) {
		const guide = ev.currentTarget.parentElement.querySelector(`[aria-label="Guide"]`);
		const coord = this.guidePosition(guide.getAttribute("d"));
		return this.guide(ev.currentTarget.parentElement, coord.x, coord.y);
	},
	/**. '{void focusout(object ev)}: Manipulador ao sair na área de plotagem.**/
	focusout: function(ev) {
		return this.guide(ev.currentTarget.parentElement, null, null);
	},
	/**. '{void keydown(object ev)}: Manipulador ao teclar ENTER sobre o nome da curva na legenda.**/
	keydown: function(ev) {
		const role  = String(ev.currentTarget.getAttribute("role")).toLowerCase();
		const arrow = /^Arrow(Up|Down|Right|Left)$/i;
		if (role === "button" && (ev.key === "Enter" || ev.key === " ")) {
			ev.preventDefault();
			this.click(ev);
		}
		else if (role === "region" && arrow.test(ev.key)) {
			ev.preventDefault();
			const svg   = ev.currentTarget.parentElement;
			const guide = svg.querySelector(`[aria-label="Guide"]`);
			const key   = ev.key.toLowerCase();
			const xy    = this.guidePosition(guide.getAttribute("d"));
			const dx    = ev.shiftKey ? this.frame.x/(4*(this.frame.s - 1)) : 1;
			const dy    = ev.shiftKey ? this.frame.y/(4*(this.frame.s - 1)) : 1;
			const walk  = {
				arrowup:    {x: xy.x,      y: xy.y - dy},
				arrowdown:  {x: xy.x,      y: xy.y + dy},
				arrowright: {x: xy.x + dx, y: xy.y},
				arrowleft:  {x: xy.x - dx, y: xy.y},
			};
			this.guide(svg, walk[key].x, walk[key].y);
		}
		return;
	},
	/**. '{void click(object ev)}: Manipulador ao clicar sobre o nome da curva na legenda.**/
	click: function(ev) {
		const svg  = ev.currentTarget.parentElement;
		const ctrl = svg.querySelectorAll("[role=button]");
		const show = ev.currentTarget.getAttribute("aria-expanded") === "false";
		for (let i = 0; i < ctrl.length; i++) {
			let note = svg.querySelector("#"+ctrl[i].getAttribute("aria-controls"));
			let link = svg.querySelectorAll(`[aria-labelledby=${ctrl[i].id}]`);
			let ok   = show && ctrl[i] === ev.currentTarget;
			/*-- destaque legenda clicada --*/
			ctrl[i].setAttribute("aria-expanded",   ok ? "true"      : "false");
			ctrl[i].setAttribute("text-decoration", ok ? "underline" : "none");
			ctrl[i].setAttribute("font-weight",     ok ? "bold"      : "normal");
			/*-- exibir/ocultar nota --*/
			note.setAttribute("display", ok ? "" : "none");
			/*-- exibir/ocultar curvas --*/
			for (let j = 0; j < link.length; j++) {
				if (link[j] !== note)
					link[j].setAttribute("display", show && !ok ? "none" : "");
			}
		}
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador de manipulação chamado durante os eventos '{mousemove}, '{focusin}, '{focusout} e '{click}.**/
	handleEvent: function(ev) {
		if (ev.type in this) this[ev.type](ev);
		return;
	},
};