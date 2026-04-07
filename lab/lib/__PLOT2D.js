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
	/**. '{object heap}: Registra os gŕaficos construídos.**/
	heap: {},//TODO apagar isso
	/**. '{object ground}: Define a fonte e a cor de fundo ('{back}) e da fonte ('{fore}).**/
	ground: {//TODO apagar isso
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
	/**. '{void struct(object plot)}: Define a estrutura básica do gráfico.**/
	struct: function(plot) {
		const idTitle  = __ID.value;
		const idDesc   = __ID.value;
		const idxPoint = __ID.value;
		const idyPoint = __ID.value;
		/*-- Registros --*/
		plot.desc.push(`This is a graph plotted on a Cartesian plane titled "${plot.title}".
The chart has a white background and the font is predominantly black.
The x-axis (Abscissa/Horizontal) is labeled "${plot.xLabel}" and its scale (${plot.xType}) has ${this.frame.s} equal interval divisions, from ${this.scale(plot.xMin, plot.xType)} to ${this.scale(plot.xMax, plot.xType)}.
The y-axis (Ordinate/Vertical) is labeled "${plot.yLabel}" and its scale (${plot.yType}) has ${this.frame.s} equal interval divisions, from ${this.scale(plot.yMin, plot.yType)} to ${this.scale(plot.yMax, plot.yType)}.
The chart has ${plot.yData.length} dataset${plot.yData.length > 1 ? "s" : ""}:`);
		/*-- SVG --*/
		plot.svg = new __SVG(this.frame.w, this.frame.h, 0, 0);
		plot.svg.last.addEventListener("mousemove", this);
		plot.svg
			.attribute({
				id: __ID.value,
				class: "css-wd-plot",
				role: "img",
				"aria-labelledby": idTitle,
				"aria-describedby": idDesc,
				"data-x-min": plot.xMin,
				"data-x-max": plot.xMax,
				"data-x-type": plot.xType,
				"data-y-min": plot.yMin,
				"data-y-max": plot.yMax,
				"data-y-type": plot.yType,
			})
			.desc("", {lang: "en-US", id: idDesc})
			/*-- título --*/
			.text(this.frame.xm, this.frame.yi/2, plot.title, "h")
			.attribute({id: idTitle, class: "css-wd-plot-title", role: "heading", "aria-level": "1"})
			/*-- área --*/
			.rect(this.frame.xi, this.frame.yi, this.frame.x, this.frame.y)
			.attribute({"stroke-width": 1, class: "css-wd-plot-line", fill: "none"})
			/*-- rótulos --*/
			.text(this.frame.xm, this.frame.h - this.frame.p, plot.xLabel, "hs")
			.text(0 + this.frame.p, this.frame.ym, plot.yLabel, "vn");
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
			/*-- grades de subdivisão (x e y) --*/
			if (i > 0 && i < this.frame.s - 1) plot.svg
				.line([px, this.frame.yi], [px, this.frame.yf])
				.attribute({class: "css-wd-plot-line"})
				.line([this.frame.xi, py], [this.frame.xf, py])
				.attribute({class: "css-wd-plot-line"});
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
				.attribute(plot.xType !== "finite" ? {} : {"font-size":  "0.8em"})
				.title(plot.xType !== "finite" ? this.scale(vx, plot.xType) : vx)
				.text(this.frame.xi - this.frame.p + dy, py, this.scale(vy, plot.yType), ty)
				.attribute(plot.yType !== "finite" ? {} : {"font-size": "0.8em"})
				.title(plot.yType !== "finite" ? this.scale(vy, plot.yType) : vy);
		}
		/*-- TODO visualizadores de posição --*/
		plot.svg
			/*-- eixo vertical (x) --*/
			.text(this.frame.xm + this.frame.p, this.frame.yi + this.frame.p, "xPoint", "hnw")
			.attribute({id: idxPoint, display: "none"})
			.line([this.frame.xm, this.frame.yi], [this.frame.xm, this.frame.yf])
			.attribute({"aria-labelledby": idxPoint, class: "css-wd-plot-dash", display: "none"})
			/*-- eixo horizontal (y) --*/
			.text(this.frame.xf - this.frame.p, this.frame.ym - this.frame.p, "yPoint", "hse")
			.attribute({id: idyPoint, display: "none"})
			.line([this.frame.xi, this.frame.ym], [this.frame.xf, this.frame.ym])
			.attribute({"aria-labelledby": idyPoint, class: "css-wd-plot-dash", display: "none"})
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
	/**. '{object infoCurve(object data)}: Retorna os dados em string da curva:
	|Nome|Descrição|
	|view|Visão esquemática para ser exibida na tela|
	|aria|Visão textual para fins de acessibilidade|
	|data|Conjunto de dados da curva para fons de acessibilidade|**/
	infoCurve: function(data) {
		const color = data.color.replace(/([A-Z])/g, " $1").toLowerCase();
		const yList = __DATA2D.toList(data.data, "y");
		const yMax  = __DATA2D.MAX(yList);
		const yMin  = __DATA2D.MIN(yList);
		const aria1 = `The curve named "${data.name}" is represented by the color "${color}" and its shape is defined as "${data.curve}".`;
		const aria2 = data.fit === null ? "" : " "+data.fit.desc;
		const view1 = `-- CURVE DATA --\nName: ${data.name};\nColor: ${color};\nShape: ${data.curve}.`;
		const view2 = data.fit === null ? "" : [
			`\n-- CURVE FITTING DATA --`,
			`\nFitting: ${data.fit.t};`,
			`\nShape: ${data.fit.m};`,
			data.fit.a !== null ? `\na: ${data.fit.a};` : "",
			data.fit.b !== null ? `\nb: ${data.fit.b};` : "",
			data.fit.d !== null ? `\nσ: ${data.fit.d};` : "",
		].join("");
		const aria3 = "Coordinates of the dataset:\n" + data.data.map(function(v,i,a) {
			const info = yMin === yMax ? "" : (v.y === yMin ? " (minimum)" : (v.y === yMax ? " (maximum)" : ""));
			return `${i}: x=${v.x}, y=${v.y}${info};`;
		}).join("\n");
		return {view: view1 + view2, aria: aria1 + aria2, data: aria3};
	},
	/**. '{void print(object plot)}: Plota as curvas no gráfico.**/
	print: function(plot) {
		const idBack = __ID.value;
		const attr = {
			line:  function(color) {return {stroke: color,  "stroke-width": 3, "stroke-linecap": "round", fill: "none"};},
			area:  function(color) {return {fill: color, "fill-opacity": 0.5};},
			dash:  function(color) {return Object.assign(this.line(color), {"stroke-dasharray": "5 6", "stroke-width": 2});},
			step:  function(color) {return Object.assign(this.line(color), {"stroke-width": 12, "stroke-linecap": "butt"});},
			link:  function(color) {return this.line(color);},
			curve: function(color) {return this.line(color);},
			dot:   function(color) {return {fill: color};},
		};
		/*-- visualizador de dados --*/
		plot.svg
			.rect(this.frame.xi, this.frame.yi, this.frame.x, this.frame.y)
			.attribute({"fill-opacity": 0.8, display: "none", fill: "#333333", id: idBack});
		/*-- curvas --*/
		plot.yData.filter(function(v,i,a) {
			const main    = this.convert(plot, v.data);
			const info    = this.infoCurve(v);
			const idHead  = __ID.value;
			const idBody  = __ID.value;
			const idCurve = __ID.value;
			plot.desc.push(`\tData set ${i+1} - ${info.aria}`);
			/*-- legenda --*/
			plot.svg
				.text(this.frame.xf + 2*this.frame.p, this.frame.yi + i*(2*this.frame.p + __SVG.labelSize), v.name, "hnw")
				.attribute({
					id: idHead,
					role: "button",
					tabindex: 0,
					"aria-controls": `${idBack} ${idBody}`,
					"aria-expanded": "false",
					fill: v.color,
					cursor: "pointer",
				});
			plot.svg.last.addEventListener("click", this);
			plot.svg.last.addEventListener("keydown", this);
			/*-- curvas e detalhes --*/
			plot.svg
				/*-- curva --*/
				.path(this.svgPath(main, v.curve))
				.attribute(attr[v.curve](v.color))
				.attribute({id: idCurve, "aria-labelledby": idHead, role: "img"})
				.desc(info.data, {lang: "en-US"})
			/*-- detalhes --*/
				.text(this.frame.xi + this.frame.p, this.frame.yi + this.frame.p, info.view, "hnw")
				.attribute({id: idBody, "aria-labelledby": idHead, fill: v.color, display: "none", lang: "en-US"});
			/*-- curva de ajuste --*/
			const fit = v.fit !== null ? this.convert(plot, v.fit.data) : null;
			if (fit !== null) plot.svg
				.path(this.svgPath(fit, v.fit.curve))
				.attribute(attr[v.fit.curve](v.color))
				.attribute({role: "img"})
				.title(v.fit.v);
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
		plot.title  = "title" in data   ? data.title   : "Title";
		plot.desc   = [];
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
		svg.querySelector("#"+svg.getAttribute("aria-describedby")).textContent = plot.desc.join("\n");
		console.log(plot.desc)


		return svg;
	},
	/**. '{void mousemove(object ev)}: Manipulador ao movimentar o mouse sobre a caixa de plotagem.**/
	mousemove: function(ev) {
		/*const heap = this.heap[ev.currentTarget.id];
		const re   = /^[xy](Grid|Scale)\d+$/;
		const gx   = heap.frame.xGuide;
		const gy   = heap.frame.yGuide;
		const sx   = heap.frame.xPoint;
		const sy   = heap.frame.yPoint;*/
		const svg  = ev.currentTarget;
		const data = svg.getBoundingClientRect();
		const px   = (ev.offsetX/data.width)  * this.frame.w;
		const py   = (ev.offsetY/data.height) * this.frame.h;
		/*-- dentro da grade principal --*/
		if (px >= this.frame.xi && px <= this.frame.xf && py >= this.frame.yi && py <= this.frame.yf) {
			svg.setAttribute("cursor", "crosshair");

			/*const frame = this.frame;
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
			/*-- mostrar guia dinâmica --* /
			[gx, gy, sx, sy].forEach(function(v,i,a) {v.removeAttribute("display");});
			/*-- esconder grade e escala --* /
			for (let i in heap.frame)
				if (re.test(i)) heap.frame[i].setAttribute("display", "none");*/
		}
		/*-- fora da grade principal --*/
		else {
			svg.setAttribute("cursor", "default");
			/*-- esconder guia dinâmica --* /
			[gx, gy, sx, sy].forEach(function(v,i,a) {v.setAttribute("display", "none");});
			/*-- mostrar grade e escala --* /
			for (let i in heap.frame)
				if (re.test(i)) heap.frame[i].removeAttribute("display");*/
		}
		return;
	},
	/**. '{void click(object ev)}: Manipulador ao clicar sobre o nome da curva na legenda.**/
	click: function(ev) {
		const svg  = ev.currentTarget.parentElement;
		const ctrl   = svg.querySelectorAll("[aria-controls]");
		const idBack = ctrl[0].getAttribute("aria-controls").trim().split(/\s+/)[0];
		const back   = svg.querySelector(`#${idBack}`);
		back.setAttribute("display", "none");
		for (let i = 0; i < ctrl.length; i++) {
			let idInfo = ctrl[i].getAttribute("aria-controls").trim().split(/\s+/)[1];
			let info   = svg.querySelector(`#${idInfo}`);
			let ok     = ctrl[i] === ev.currentTarget && ctrl[i].getAttribute("aria-expanded") === "false";
			ctrl[i].setAttribute("aria-expanded",   ok ? "true"      : "false");
			ctrl[i].setAttribute("text-decoration", ok ? "underline" : "none");
			ctrl[i].setAttribute("font-weight",     ok ? "bold"      : "normal");
			info.setAttribute("display", ok ? "" : "none")
			if (ok) {
				back.removeAttribute("display");
				svg.appendChild(back);
				svg.appendChild(info);
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