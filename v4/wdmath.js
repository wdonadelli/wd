var WD = wd;

function WDdataSet() {
	if (!(this instanceof WDdataSet)) return new WDdataSet();
}

Object.defineProperties(WDdataSet.prototype, {
	constructor: {value: WDdataSet},
	SET_FINITE: {
		value: function(x) {
			var data = [];
			for (var i = 0; i < x.length; i++) {
				var val = WD(x[i]);
				data.push(val.finite ? val.valueOf() : null);
			}
			return data;
		}
	},
	SUM: {/*soma listas e aplica operações matemáticas entre elas (até 2)*/
		value: function(list1, exp1, list2, exp2) {
			if (list2 === undefined) list2 = null;
			var value = 0;
			for (var i = 0; i < list1.length; i++) {
				if (exp1 < 0 && list1[i] === 0) return null; /*divisão por zero*/
				if (list2 !== null && exp2 < 0 && list2[i] === 0) return null; /*divisão por zero*/
				var val1 = Math.pow(list1[i], exp1);
				var val2 = list2 === null ? 1 : Math.pow(list2[i], exp2);
				value += val1 * val2;
			}
			return value;
		}
	},
	PRODUCT: {
		value: function(list, exp) {/*calcula o produto da lista e aplica potenciação*/
			var value = 1;
			for (var i = 0; i < list.length; i++) {
				if (exp < 0 && list[i] === 0) return null; /*divisão por zero*/
				var val = Math.pow(list[i], exp);
				value = value * val;
			}
			return value;
		}
	},
	DEVIATION: {/*calcula devios genéricos*/
		value: function(list, ref, exp) {/*calcula desvios a partir de uma lista/função e referência*/
			var value = 0;
			var check = WD(ref);
			for (var i = 0; i < list.length; i++) {
				var diff = Math.abs((check.type === "array" ? ref[i] : ref) - list[i]);
				if (exp < 0 && diff === 0) return null; /*divisão por zero*/
				var val = Math.pow(diff, exp);
				value += val;
			}
			return value;
		}
	},
	STD_DEV: {/*Calcula o desvio padrão*/
		value: function(list, ref) {
			var data = this.DEVIATION(list, ref, 2);
			return data ===  null ? data : Math.sqrt(data/list.length);
		}
	},
	LEAST_SQUARES: {/*Método dos mínimos quadrados*/
		value: function(x, y) {
			var X  = this.SUM(x, 1);
			var Y  = this.SUM(y, 1);
			var X2 = this.SUM(x, 2);
			var XY = this.SUM(x, 1, y, 1);
			if ([X, Y, XY, X2].indexOf(null) >= 0) return null;
			var N    = y.length;
			var data = {};
			data.a   = ((N * XY) - (X * Y)) / ((N * X2) - (X * X));
			data.b   = ((Y) - (X * data.a)) / (N);
			return data;
		}
	},
	ADJUST_LISTS: {/*retorna as listas em pares de informações não nulas*/
		value: function(list1, list2) {
			var loop = list1.length > list2.length ? list2.length : list1.length;
			var lists = {list1: [], list2: [], length: 0};
			for (var i = 0; i < loop; i++) {
				if (list1[i] === null || list2[i] === null) continue;
				lists.list1.push(list1[i]);
				lists.list2.push(list2[i]);
				lists.length++;
			}
			return lists;
		}
	},
	SET_Y: {/*define uma lista a partir da aplicação de uma função sobre os valores de outra lista*/
		value: function(x, f) {
			var data = [];
			for (var i = 0; i < x.length; i++) data.push(f(x[i]));
			return data;
		}
	},

});

/*----------------------------------------------------------------------------*/

function WDstatistics(x) {
	if (!(this instanceof WDstatistics)) return new WDstatistics(x);
	WDdataSet.call(this);
	if (WD(x).type !== "array") x = [];
	var val = WD(WD(this.SET_FINITE(x)).sort()).del(null);
	Object.defineProperties(this, {
		x: {value: val}, /*array numérico sem nulos*/
		l: {value: val.length}, /*comprimento array sem nulos*/
		e: {value: val.length < 1 ? true : false} /*erro*/
	});
}

WDstatistics.prototype = Object.create(WDdataSet.prototype, {
		constructor: {value: WDstatistics}
});

Object.defineProperties(WDstatistics.prototype, {/*-- Estatística --*/
	sum: {/*soma*/
		get: function() {
			if (this.e) return null;
			var val  = this.SUM(this.x, 1)
			var diff = this.STD_DEV(this.x, val);
			return {value: val, delta: diff};
		}
	},
	min: {/*menor valor*/
		get: function() {
			if (this.e) return null;
			var val  = this.x[0];
			var diff = this.STD_DEV(this.x, val);
			return {value: val, delta: diff};
		}
	},
	max: {/*maior valor*/
		get: function() {
			if (this.e) return null;
			var val  = this.x[this.l-1];
			var diff = this.STD_DEV(this.x, val);
			return {value: val, delta: diff};
		}
	},
	average: {/*média*/
		get: function() {
			if (this.e) return null;
			var val  = this.sum.value/this.l;
			var diff = this.STD_DEV(this.x, val);
			return {value: val, delta: diff};
		}
	},
	median: {/*mediana*/
		get: function() {
			if (this.e) return null;
			var a = this.x;
			var l = this.l;
			var val  = (l % 2 === 0) ? (a[l/2]+a[(l/2)-1])/2 : a[(l-1)/2];
			var diff = this.STD_DEV(this.x, val);
			return {value: val, delta: diff};
		}
	},
	geometric: {/*média geométrica*/
		get: function() {
			if (this.e) return null;
			var val  = Math.pow(Math.abs(this.PRODUCT(this.x, 1)), 1/this.l);
			var diff = this.STD_DEV(this.x, val);
			return {value: val, delta: diff}
		}
	},
	harmonic: {/*média harmônica*/
		get: function() {
			if (this.e) return null;
			var harm = this.SUM(this.x, -1);
			var val  = harm === 0 || harm === null ? null : this.l/harm;
			var diff = val === null ? null : this.STD_DEV(this.x, val);
			return {value: val, delta: diff}
		}
	},
});

/*----------------------------------------------------------------------------*/

function WDregression(x, y) {
	if (!(this instanceof WDregression)) return new WDregression(x, y);
	WDdataSet.call(this);
	var f = WD(y).type === "function" ? y : null;
	if (WD(x).type !== "array") x = [];
	if (WD(y).type !== "array") y = [];
	if (f !== null) for (var i = 0; i < x.length; i++) y.push(f(x[i]));
	var val  = this.ADJUST_LISTS(this.SET_FINITE(x), this.SET_FINITE(y));
	var ends = WDstatistics(val.list1);
	var diff = ends.e ? 0 : ends.max.value - ends.min.value;
	Object.defineProperties(this, {
		x: {value: val.list1},
		y: {value: val.list2},
		f: {value: f},
		l: {value: val.length},
		e: {value: (val.length < 2 || diff === 0) ? true : false}
	});
}

WDregression.prototype = Object.create(WDdataSet.prototype, {
		constructor: {value: WDregression}
});

Object.defineProperties(WDregression.prototype, {/*-- Regressões --*/
	REG_DEV: {
		value: function(f) {
			var diff = this.ADJUST_LISTS(this.y, this.SET_Y(this.x, f));
			return this.STD_DEV(diff.list1, diff.list2);
		}
	},
	linear: {/*regressão linear*/
		get: function() {
			if (this.e) return null;
			var val = this.LEAST_SQUARES(this.x, this.y);
			if (val === null) return null;
			var data = {
				e: "y = (a)x+(b)",
				a: val.a,
				b: val.b,
			};
			data.f = function(x) {return data.a*x + data.b;};
			data.d = this.REG_DEV(data.f);
			return data;
		}
	},
	exponential: {/*regressão exponencial*/
		get: function() {
			if (this.e) return null;
			/*pontos para a regressão (ajustando Y para equação linear)*/
			var y    = this.SET_FINITE(this.SET_Y(this.y, Math.log));
			var axes = this.ADJUST_LISTS(this.x, y);
			if (axes.length === 0) return null;
			/*regressão*/
			var val = this.LEAST_SQUARES(axes.list1, axes.list2);
			if (val === null) return null;
			var data = {
				e: "y = (a)\u212F^(bx)",
				a: Math.exp(val.b),
				b: val.a,
			};
			data.f = function(x) {return data.a*Math.exp(data.b*x);};		
			data.d = this.REG_DEV(data.f);
			return data;
		}
	},
	geometric: {/*regressão geométrica*/
		get: function() {
			if (this.e) return null;
			/*pontos para a regressão (ajustando X/Y para equação linear)*/
			var x = this.SET_FINITE(this.SET_Y(this.x, Math.log));
			var y = this.SET_FINITE(this.SET_Y(this.y, Math.log));
			var axes = this.ADJUST_LISTS(x, y);
			if (axes.length === 0) return null;
			/*regressão*/
			var val = this.LEAST_SQUARES(axes.list1, axes.list2);
			if (val === null) return null;
			var data = {
				e: "y = (a)x^(b)",
				a: Math.exp(val.b),
				b: val.a,
			};
			data.f = function(x) {return data.a*Math.pow(x, data.b);};
			data.d = this.REG_DEV(data.f);
			return data;
		}
	},
	sum: {
		get: function() {
			if (this.e) return null;
			var int = 0;
			/* -- integral = (yf+yi)(xf-xi)/2 -- */
			for (var i = 0; i < (this.l - 1); i++)
				int += (this.y[i+1]+this.y[i])*(this.x[i+1]-this.x[i])/2;

			var data = {
				e: "\u03A3y\u0394x \u2248 b",
				a: 0,
				b: int,
			};
			var obj = this;
			data.f = function(x) {
				var X = obj.x, Y = obj.y, i = 0, n = null;
				while (n === null && ++i !== X.length)
					if (x <= X[i]) n = i;
				if (n === null) n = X.length-1;
				var line = WDregression([X[n-1],X[n]], [Y[n-1],Y[n]]);
				return line.linear.f(x);
			};
			data.d = null;
			return data;
		}
	},
	average: {/*calcula a média da variação*/
		get: function() {
			if (this.e) return null;
			var int  = this.sum.b;
			var end = new WDstatistics(this.x);
			var avg = int / (end.max.value - end.min.value);
			var data = {
				e: "(\u03A3y\u0394x)/\u0394x \u2248 b",
				a: 0,
				b: avg,
			};
			data.f = function(x) {return data.b;};
			data.d = null;
			return data;
		}
	},
	continuous: {
		value: function(delta, method) {
			if (this.e) return null;
			if (!WD(delta).finite) return null;
			var methods = ["linear", "exponential", "geometric", "sum", "average"];
			var func = this.f;
			if (methods.indexOf(method) >= 0) {
				var obj = this[method];
				func = obj === null ? null : obj.f;
			}
			if (func === null) return null;

			delta    = WD(delta).abs;
			var end  = WDstatistics(this.x);
			var min  = end.min.value;
			var max  = end.max.value;
			var data = {x: [], y: [], o: obj};

			while (delta > 0) {
				if (min >= max) {
					min   = max;
					delta = 0;
				}
				var val = func(min);
				if (WD(val).finite) {
					data.x.push(min);
					data.y.push(val);
				}
				min += delta;
			}
			return data;
		}
	},

});

/*----------------------------------------------------------------------------*/

function WDcompare(x, y) {
	if (!(this instanceof WDcompare)) return new WDcompare(x, y);
	WDdataSet.call(this);
	if (WD(x).type !== "array") x = [];
	if (WD(y).type !== "array") y = [];
	x = this.SET_STRING(x);
	y = this.SET_FINITE(y);
	var lenX = WD(x).del(null).length;
	var lenY = WD(y).del(null).length;

	Object.defineProperties(this, {
		x: {value: x},
		y: {value: y},
		e: {value: (lenY < 1 || lenX < 1 || lenY !== lenX  ? true : false)}
	});
}

WDcompare.prototype = Object.create(WDdataSet.prototype, {
		constructor: {value: WDcompare}
});

Object.defineProperties(WDcompare.prototype, {/*-- Comparação de dados --*/
	SET_STRING: {
		value: function(x) {
			for (var i = 0; i < x.length; i++)
				x[i] = WD(x[i]).type === "null" ? "#" : String(x[i]).toLowerCase().trim();
			return x;
		}
	},
	occurrences: {/*quantidade de ocorrências de cada item*/
		get: function() {
			if (this.e) return null;
			var data = {};
			for (var i = 0; i < this.x.length; i++) {
				if (!(this.x[i] in data)) data[this.x[i]] = 0;
				data[this.x[i]]++;
			}
			return data;
		}
	},
	amount: {/*quantidade de cada item (soma itens iguais)*/
		get: function() {
			if (this.e) return null;
			var data = this.occurrences;
			for (var i in data) data[i] = 0;
			for (var i = 0; i < this.x.length; i++) {
				if (i >= this.y.length) break;
				data[this.x[i]] += this.y[i] === null ? 0 : this.y[i];
			}
			return data;
		}
	},
	ratio: {/*porcentagem da quantidade*/
		get: function() {
			if (this.e) return null;
			var data = this.amount;
			var sum = 0;
			for (var i in data) sum += data[i];
			for (var i in data) data[i] = data[i]/sum;
			return data;
		}
	},
});

/*----------------------------------------------------------------------------*/

function WDchart(box, title) {/*Objeto para criar gráficos*/
	if (!(this instanceof WDchart)) return new WDchart(box, title);
	Object.defineProperties(this, {/*atributos do objeto*/
		/* Container HTML a acomodar o gráfico */
		_BOX: {value: this._BUILD_BOX(box)},
		/* Elemento SVG a ser plotado os dados */
		_SVG: {value: this._BUILD_SVG("svg")},
		/* Escala do gráfico (x/y) e menor unidade gráfica (100 = 100%) */
		_SCALE: {value: {x: 1, y: 1, d: 1}},
		/* Guarda a cor da plotagem */
		_NCOLOR: {value: 0, writable: true},
		/* Dimensões do gráfico (top, right, bottom, left, width, height) */
		_MEASURES: {value: {t: 0, r: 0, b: 0, l: 0, w: 100, h: 100}},
		/* Registra os valores máximos e mínimos dos eixos */
		_ENDS: {value: {x: {min: Infinity, max: -Infinity}, y: {min: Infinity, max: -Infinity}}},
		/* Margens internas do gráfico */
		_PADDING: {value: {t: 0, r: 0, b: 0, l: 0}},
		/* Registra o título do gráfico */
		_TITLE: {value: title === undefined ? "" : title},
		/* Registra a entrada de dados */
		_DATA: {value: []},
		_LEGEND: {value: {text: 0, func: 0}}
	});
};

Object.defineProperties(WDchart.prototype, {
	constructor: {value: WDchart},
	_RATIO: {/* Relação altura/comprimento do gráfico (igual a da tela) */
		value: window.screen.height/window.screen.width
	},
	_COLOR: {/* Define e obtém a cor a partir de um inteiro (looping) */
		set: function(n) {
			var ref = n < 0 ? 0 : n%7+1;
			var bin = (ref < 2 ? "00" : (ref < 4 ? "0" : ""))+ref.toString(2);
			var clr = bin.split("");
			clr.forEach(function(e,i,a){a[i] = 153*Number(e);});
			this._NCOLOR = "rgb("+clr[0]+","+clr[1]+","+clr[2]+")";
		},
		get: function() {return this._NCOLOR;}
	},
	_CONVERT: {/* Converte número em porcentagem: 58 => "58%" */
		value: function(x) {return new String(x).toString()+"%";}
	},
	_DELTA: {/* Devolve a menor partícula em X */
		value: function(x) {
			return (x <= 0 ? this._SCALE.d : x)/this._SCALE.x;
		}
	},
	_SET_ENDS: {/* Registra as extremidades */
		value: function(axes, array) {
			var data = WDstatistics(array);
			var min  = data.min.value;
			var max  = data.max.value;
			if (min < this._ENDS[axes].min) this._ENDS[axes].min = min;
			if (max > this._ENDS[axes].max) this._ENDS[axes].max = max;
			return;
		}
	},
	_SET_MEASURES: {/* Define as medidas relativas a partir do padding */
		value: function() {
			this._MEASURES.t = this._PADDING.t;
			this._MEASURES.r = this._PADDING.r * this._RATIO;
			this._MEASURES.b = this._PADDING.b;
			this._MEASURES.l = this._PADDING.l * this._RATIO;
			this._MEASURES.w = 100 - this._MEASURES.l - this._MEASURES.r;
			this._MEASURES.h = 100 - this._MEASURES.t - this._MEASURES.b;
			return;
		}
	},
	_BUILD_BOX: {/* Define as características do container do SVG */
		value: function(input) {
			var box = WD(input);
			if (box.type !== "dom") return null;
			WD(box.item(0)).set("innerHTML", "").css(null).style(null).style({
				position: "relative", paddingTop: this._CONVERT(100 * this._RATIO)
			});
			return box.item(0);
		}
	},
	_BUILD_SVG: {/* Cria e retorna elementos svg conforme atributos */
		value: function(type, attr) {
			if (this._BOX === null) return null;
			if (attr === undefined) attr = {};
			var elem = document.createElementNS("http://www.w3.org/2000/svg", type);
			/* Propriedades a serem definidas em porcentagem */
			var ref  = [
				"x", "y", "x1", "x2", "y1", "y2", "height", "width",
				"cx", "cy", "r", "dx", "dy"
			];

			for (var i in attr) {
				var val = attr[i];
				if (i === "tspan" || i === "title") {
					var info = this._BUILD_SVG(i);
					info.textContent = val;
					elem.appendChild(info);
				} else {
					if (ref.indexOf(i) >= 0 && WD(val).finite)
						val = this._CONVERT(val);
					elem.setAttribute(i, val);
				}
			}

			if (type === "svg") /* SVG principal apenas */
				WD(elem).style({
					height: "100%", width: "100%", position: "absolute",
					top: "0", left: "0", bottom: "0", right: "0",
					backgroundColor: "#FFFFFF", border: "1px dotted black"
				});

			return elem;
		}
	},
	_BUILD_DOTS: {/* Desenha um ponto: coordenadas do centro */
		value: function(cx, cy, title) {
 			var point = this._BUILD_SVG("circle", {
				cx: cx, cy: cy, r: "3px", fill: this._COLOR, title: title
			});
			this._SVG.appendChild(point);
			return point;
		}
	},
	_BUILD_LINE: {/* Desenha uma linha: coordenadas inicial e final */
		value: function(x1, y1, x2, y2, title, line) {
			var line = this._BUILD_SVG("line", {
				x1: x1, y1: y1, x2: x2, y2: y2,
				stroke: this._COLOR,
				"stroke-width":     line === 0 ? "1px" : line+"px",
				"stroke-dasharray": line === 0 ? "1,5" : "0",
				title: title
			});
			this._SVG.appendChild(line);
			return line;
		}
	},
	_BUILD_RECT: {/* Desenha uma retângulo: coordenadas inicial e final */
		value: function(x1, y1, x2, y2, title, opacity) {
			var rect = this._BUILD_SVG("rect", {
				x:       x2 > x1 ? x1 : x2,
				y:       y2 > y1 ? y1 : y2,
				width:   x2 > x1 ? x2-x1 : x1-x2,
				height:  y2 > y1 ? y2-y1 : y1-y2,
				fill:    this._COLOR,
				title:   title,
				opacity: opacity === true ? 0.3 : 0.8,
			});
			this._SVG.appendChild(rect);
			return rect;
		}
	},
	_BUILD_LABEL: {/* Adiciona texto: coordenadas, texto, âncora, orientação */
		value: function (x, y, text, point, vertical, bold) {
			var vanchor = ["start", "middle", "end"];
			var anchor  = {n: 1, ne: 2, e: 2, se: 2, s: 1, sw: 0, w: 0, nw: 0, c: 1};
			var vbase   = ["auto", "middle", "hanging"];
			var base    = {n: 2, ne: 2, e: 1, se: 0, s: 0, sw: 0, w: 1, nw: 2, c: 1};
			point       = point in base ? point : "c" ;
			var attr = {
				x: x, y: y,
				fill: this._COLOR,
				"text-anchor": vanchor[anchor[point]],
				"dominant-baseline": vbase[base[point]],
				"font-size": "0.8em",
				"font-family": "monospace",
				tspan: text
			};
			 if (vertical === true) {
			 	attr.transform = "rotate(270)";
			 	attr.y = x/this._RATIO;
			 	attr.x = -this._RATIO*y;
			 }
			 if (bold === true) attr["font-weight"] = "bold";
			 var label = this._BUILD_SVG("text", attr);
			 this._SVG.appendChild(label);
			 return label;
		}
	},
	_CLEAR_SVG: {/* Limpa os filhos do SVG */
		value: function() {
			this._LEGEND.text = 0;
			this._LEGEND.func = 0;
			if (this._SVG.parentElement === null)
				this._BOX.appendChild(this._SVG);
			var child = this._SVG.children;
			while (child.length > 0) this._SVG.removeChild(child[0]);
			return;
		}
	},
	_SET_SCALE: {/* Define o valor da escala horizontal e vertical */
		value: function(axes) {
			var ref = axes === "x" ? this._MEASURES.w : this._MEASURES.h;
			this._SCALE[axes] = ref/(this._ENDS[axes].max - this._ENDS[axes].min);
			return;
		}
	},
	_TARGET: {/* Transforma coordanadas reais em relativas (%) */
		value: function(x,y) {
			if (!WD(x).finite || !WD(y).finite) return null;
			x = x - this._ENDS.x.min;
			y = y - this._ENDS.y.min;
			return {
				x: this._MEASURES.l + (x * this._SCALE.x),
				y: 100 - (this._MEASURES.b + y * this._SCALE.y)
			};
		}
	},
	_ADD_LEGEND: { /* Adiciona Legendas (texto e funções)*/
		value: function(text, func) {
			if (text === null) return;
			var ref = this._MEASURES;
			var n = this._LEGEND[(func ? "func" : "text")]++;
			var x = func ? ref.l : ref.l+ref.w;
			var y = 4*n+ref.t;
			this._BUILD_LABEL(x+1, y+1, (func ? "" : "\u25CF ")+text, "nw", false, true);
		}
	},
	_LABEL_VALUE: {/* Define a exibição de valores numéricos */
		value: function(x, ratio) {
			if (ratio === true) x = 100*x;
			var end = ratio === true ? "%" : "";
			var val = Math.abs(x);

			if (val === 0) return "0"+end;
			if ((1/val) > 1) {
				if (val <= 1e-10) return x.toExponential(0)+end;
				if (val <= 1e-3)  return x.toExponential(1)+end;
				if (val <= 1e-2)  return WD(x).fixed(2,0)+end;
			} else {
				if (val >= 1e10) return x.toExponential(0)+end;
				if (val >= 1e3)  return x.toExponential(1)+end;
				if (val >= 1e2) return WD(x).fixed(0,0)+end;
				if (val >= 1e1) return WD(x).fixed(1,0)+end;
			}
			return WD(x).fixed(2,0)+end;
		}
	},

/* -- Gráfico plano --------------------------------------------------------- */
	_SET_AREA: {
		value: function(type, n) {
			n = n === undefined ? 0 : n;
			var config = {/* configurações da área do gráfico */
				plan: {
					lines: {t: 1, r: 1, b: 1, l: 1, c: 0, n: n === 0 ? 4 : n},
					padd:  {t: 10, r: 30, b: 10, l: 20},
					title: {p: "h", r: "t", v: 1/2}
				},
				compare: {
					lines: {t: 0, r: 0, b: 0, l: 0, c: 0, n: n === 0 ? 10 : n},
					padd:  {t: 10, r: 30, b: 10, l: 10},
					title: {p: "v", r: "l", v: 1/2}
				},
			};

			var data = config[type];
		
			/* definindo valores iniciais */
			this._CLEAR_SVG();
			this._COLOR = -1;
			for (var i in data.padd) this._PADDING[i] = data.padd[i];
			this._SET_MEASURES();
			this._SET_SCALE("y");
			this._SET_SCALE("x");
			var ref = this._MEASURES;
			var dX  = ref.w / data.lines.n;
			var dY  = ref.h / data.lines.n;
			var info = {
				x: [], y: [], /* coordenada das linhas */
				dx: dX, dy: dY, /* distância entre dois pontos */
				cx: (ref.l+ref.w)/2, cy: (ref.t+ref.h)/2, /* centro do gráfico */
				xi: ref.l, xf: ref.l+ref.w, /* comprimento inicial e final */
				yi: ref.t, yf: ref.t+ref.h, /* altura inicial e final */
				
			};

			/* construindo linhas */
			for (var i = 0; i < (data.lines.n+1); i++) {
				var h = i === 0 ? "t" : (i === data.lines.n ? "b" : "c");
				this._BUILD_LINE(/* Eixo Horizontal */
					ref.l, ref.t+(i*dY), ref.l+ref.w, ref.t+(i*dY), "", data.lines[h]
				);
				info.y.unshift(ref.t+(i*dY));
				var v = i === 0 ? "l" : (i === data.lines.n ? "r" : "c");
				this._BUILD_LINE(/* Eixo Vertical */
					ref.l+(i*dX), ref.t, ref.l+(i*dX), ref.t+ref.h, "", data.lines[h]
				);
				info.x.push(ref.l+(i*dX));
			}

			/* construíndo título */
			var title = {
				x: data.title.p === "h" ? ref.l+(ref.w)/2 : ref.l*data.title.v,
				y: data.title.p === "h" ? ref.t*data.title.v : ref.t+ref.h/2,
				p: data.title.p === "h" ? false : true
			};
			this._BUILD_LABEL(/* Título */
				title.x, title.y, this._TITLE, "c", title.p, true
			);

			return info;
		}
	},

/* -- Funções acessíveis ---------------------------------------------------- */
	add: {
		enumerable: true,
		value: function(x, y, label, type) {/* Adiciona conjunto de dados para plotagem */
			if (this._SVG === null) return null;
			this._DATA.push({x: x, y: y, l: label, t: type});
			return this._DATA.length-1;
		}
	},
	plan: {
		enumerable: true,
		value: function(xlabel, ylabel) {/*desenha gráfico plano*/
			var types = {
				average:     {draw1: "dots", draw2: "line", reg: true,  dev: true,  prec: 10},
				exponential: {draw1: "dots", draw2: "line", reg: true,  dev: true,  prec: 0},
				linear:      {draw1: "dots", draw2: "line", reg: true,  dev: true,  prec: 0},
				geometric:   {draw1: "dots", draw2: "line", reg: true,  dev: true,  prec: 0},
				sum:         {draw1: "l+d",  draw2: "cols", reg: true,  dev: true,  prec: 0.1},
				line:        {draw1: "line", draw2: null,   reg: false, dev: false, prec: 10},
				dots:        {draw1: "dots", draw2: null,   reg: false, dev: false, prec: 0},
				linedots:    {draw1: "l+d",  draw2: null,   reg: false, dev: false, prec: 10},
				function:    {draw1: null,   draw2: "line", reg: false, dev: false, prec: 0},
			};

			/* Obtendo valores básicos */
			var data = [];

			for (var i = 0; i < this._DATA.length; i++) {
				var item = this._DATA[i];
				if (item === null || !(item.t in types)) continue;
				var check = WDregression(item.x, item.y);
				if (check.e) continue;
				var obj  = {
					o: check,   /*WDregression object*/
					x: check.x, /*X array*/
					y: check.y, /*Y array*/
					d: types[item.t].draw1, /*tipo de linha a desenhar*/
					l: item.l,  /*label*/
					t: item.t,  /*type*/
					r: false, /*exibir fórmula ?*/
					s: null, /*desvio padrão*/
				};
				this._SET_ENDS("x", obj.x);
				this._SET_ENDS("y", obj.y);
				if (item.t === "sum") /*exibir o eixo zero quando for soma*/
					this._SET_ENDS("y", [0]);
				data.push(obj);
			}
			if (data.length === 0) return null;

			/* Definindo o array de funções */
			this._SET_SCALE("x");
			var items = data.length;			

			for (var i = 0; i < items; i++) {
				var item = data[i];
				if (types[item.t].draw2 === null) continue;
				var value = item.o.continuous(this._DELTA(types[item.t].prec), item.t);
				if (value === null) continue;
				var obj = {
					o: item.o,
					x: value.x,
					y: value.y,
					d: types[data[i].t].draw2,
					l: item.l,
					t: item.t,
					r: types[item.t].reg,
					s: null,
				};
				if (item.t in item.o) {
					var a = this._LABEL_VALUE(value.o.a);
					var b = this._LABEL_VALUE(value.o.b);
					var s = value.o.d === null ? "" : " \u00B1 "+this._LABEL_VALUE(value.o.d);
					obj.s = s === null ? null : value.o.d;
					obj.l = value.o.e.replace("a", a).replace("b", b)+s;
				}
				data.push(obj);
				this._SET_ENDS("x", value.x);
				this._SET_ENDS("y", value.y);
				if (obj.s !== null) { /*desvio padrão*/
					for (var j = 0; j < value.y.length; j++) {
						this._SET_ENDS("y", [value.y[j]+obj.s]);
						this._SET_ENDS("y", [value.y[j]-obj.s]);
					}
				}
			}

			/* Área de plotagem */
			var lines = 4;
			var info  = this._SET_AREA("plan", lines);
			var color = 0; /*define o número da cor*/

			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				if (item.d === null) continue;
				this._COLOR = 2*(color++)+1;
				this._ADD_LEGEND(item.l, item.r);

				for (var j = 0; j < item.x.length; j++) {
					var title = "("+item.x[j]+","+item.y[j]+")";
					var trg1  = this._TARGET(item.x[j], item.y[j]);
					var trg2  = this._TARGET(item.x[j+1], item.y[j+1]);
					var zero  = this._TARGET(item.x[j], 0);
					if (0 < this._ENDS.y.min) zero  = this._TARGET(item.x[j], this._ENDS.y.min);
					if (0 > this._ENDS.y.max) zero  = this._TARGET(item.x[j], this._ENDS.y.max);

					if (item.d === "dots" || item.d === "l+d") { /*pontos*/
						this._BUILD_DOTS(trg1.x, trg1.y, item.l, title);
					}
					if ((item.d === "line" || item.d === "l+d") && trg2 !== null) {/*linhas*/
						this._BUILD_LINE(trg1.x, trg1.y, trg2.x, trg2.y, title, 2);
						if (types[item.t].dev && item.s !== null) { /*desvio padrão*/
							var sup1  = this._TARGET(item.x[j], item.y[j]+item.s);
							var sup2  = this._TARGET(item.x[j+1], item.y[j+1]+item.s);
							var inf1  = this._TARGET(item.x[j], item.y[j]-item.s);
							var inf2  = this._TARGET(item.x[j+1], item.y[j+1]-item.s);
							this._BUILD_LINE(sup1.x, sup1.y, sup2.x, sup2.y, null, 0);
							this._BUILD_LINE(inf1.x, inf1.y, inf2.x, inf2.y, null, 0);
						}
					}
					if (item.d === "cols" && trg2 !== null) {
						this._BUILD_RECT(trg1.x, (trg2.y+trg1.y)/2, trg2.x, zero.y, title, true);
					}
				}
			}
			
			/* Plotando labels */
			this._COLOR = -1;
			this._BUILD_LABEL(info.xf+2, info.yf+1, xlabel, "nw", false, true);
			this._BUILD_LABEL(info.xi-1, info.yi-2, ylabel, "se", false, true);

			var dX = (this._ENDS.x.max - this._ENDS.x.min) / lines;
			var dY = (this._ENDS.y.max - this._ENDS.y.min) / lines;

			for (var i = 0; i < info.x.length; i++) {
				var x  = this._LABEL_VALUE(this._ENDS.x.min + i*dX);
				var y  = this._LABEL_VALUE(this._ENDS.y.min + i*dY);
				var px = i === 0 ? "nw" : (i === lines ? "ne" : "n");
				var py = i === 0 ? "se" : (i === lines ? "ne" : "e");
				this._BUILD_LABEL(info.x[i], info.yf+1, x, px);
				this._BUILD_LABEL(info.xi-1, info.y[i], y, py);
			}
		}
	},

	compare: { /* desenha um gráfico de colunas comparativo */
		enumerable: true,
		value: function(label) {/*desenha gráfico comparativo de colunas*/
			/* Obtendo dados básicos */
			var data = {x: [], y: []};
			for (var i = 0; i < this._DATA.length; i++) {
				var item = this._DATA[i];
				if (item === null || item.t !== "compare") continue;
				var check = WDcompare(item.x, item.y);
				if (check.e) continue;
				for (var j = 0; j < check.x.length; j++) {
					data.x.push(check.x[j]);
					data.y.push(check.y[j]);
				}
			}
			if (data.x.length === 0) return null;

			/* Definindo dados para o gráfico */
			var object = WDcompare(data.x, data.y);
			var ratio  = object.ratio;
			var amount = object.amount;
			var values = {l: [0], x: [], y: [], v: []};
			for (var i in ratio) {
				values.l.push(values.l.length);
				values.x.push(i);
				values.y.push(ratio[i]);
				values.v.push(amount[i]);
			}
			this._SET_ENDS("x", values.l);
			this._SET_ENDS("y", values.y);
			this._SET_ENDS("y", [0]);

			/* Plotando o gráfico */
			var info = this._SET_AREA("compare", values.x.length);
			var sum = 0;

			for (var i = 0; i < values.x.length; i++) {
				this._COLOR = 2*i+1;
				var trg1 = this._TARGET(i, 0);
				var trg2 = this._TARGET(i+1, values.y[i]);
				var trg3 = this._TARGET((i + 0.5), 0);
				sum += values.v[i];
				var pct  = this._LABEL_VALUE(values.y[i], true);
				var val  = this._LABEL_VALUE(values.v[i]);
				var ttl  = values.x[i]+": "+val+" ("+pct+")";
				var pos  = values.y[i] < 0 ? -1 : 1;
				this._BUILD_RECT(trg1.x, trg1.y, trg2.x, trg2.y, ttl);
				this._ADD_LEGEND(values.x[i]);
				/* valor perto do eixo e porcentagem na topo ou base */
				this._COLOR = -1;
				this._BUILD_LABEL(trg3.x, trg2.y-pos, pct, pos < 0 ? "n" : "s", false, true);
				this._BUILD_LABEL(trg3.x, trg3.y+pos, val, pos < 0 ? "s" : "n", false);
			}

			var zero = this._TARGET(0,0);
			this._BUILD_LINE(info.xi, zero.y, info.xf, zero.y, "", 1);
			this._BUILD_LABEL(info.xi-0.5, zero.y, "0", "e");
			this._BUILD_LABEL(99, 99, "\u03A3y = "+this._LABEL_VALUE(sum), "se", false, true);

			return true;
		}
	},
});
