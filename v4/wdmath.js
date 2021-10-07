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
			var lists = {list1: [], list2: [], length: loop};
			for (var i = 0; i < loop; i++) {
				if (list1[i] === null || list2[i] === null) continue;
				lists.list1.push(list1[i]);
				lists.list2.push(list2[i]);
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
				e: "y = ax+b",
				a: val.a,
				b: val.b,
			};
			data.f = function(x) {return data.a*x + data.b;},
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
				e: "y = a.exp(bx)",
				a: Math.exp(val.b),
				b: val.a,
			};
			data.f = function(x) {return data.a*Math.exp(data.b*x);}			
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
				e: "y = a.x**b",
				a: Math.exp(val.b),
				b: val.a,
			};
			data.f = function(x) {return data.a*Math.pow(x, data.b);},
			data.d = this.REG_DEV(data.f);
			return data;
		}
	},
	sum: {
		get: function() {
			if (this.e) return null;
			var int = 0;
			for (var i = 0; i < (this.l - 1); i++) {
				var fi = {x: this.x[i],   y: this.y[i]};
				var fn = {x: this.x[i+1], y: this.y[i+1]};
				int += (fn.y + fi.y)*(fn.x - fi.x)/2;
			}
			var data = {
				e: "\u03A3y\u0394x \u2248 "+int,
				a: 0,
				b: int,
			};
			data.f = function(x) {return data.b;},
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
				e: "(\u03A3y\u0394x)/\u0394x \u2248 "+avg,
				a: 0,
				b: avg,
			};
			data.f = function(x) {return data.b;},
			data.d = this.REG_DEV(data.f);
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
			var data = {x: [], y: []};

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

function WDcomparison(x, y) {
	if (!(this instanceof WDcomparison)) return new WDcomparison(x, y);
	WDdataSet.call(this);
	if (WD(x).type !== "array") x = [];
	if (WD(y).type !== "array") y = [];
	x = this.SET_STRING(x);
	y = this.SET_FINITE(y);

	Object.defineProperties(this, {
		x: {value: x},
		y: {value: y},
		e: {value: (y.length < 1 || x.length < 1 ? true : false)}
	});
}

WDcomparison.prototype = Object.create(WDdataSet.prototype, {
		constructor: {value: WDcomparison}
});

Object.defineProperties(WDcomparison.prototype, {/*-- Comparação de dados --*/
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
	ratio: {/*porcetagem da quantidade*/
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
			/* Escala do gráfico (x/y) e menor unidade gráfica (d em %) */
			_SCALE: {value: {x: 1, y: 1, d: 0.1}},
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
			_DATA: {value: []}
		});
	};

	Object.defineProperties(WDchart.prototype, {
		constructor: {value: WDchart},
		_RATIO: {/* Relação altura/comprimento do gráfico (igual a da tela) */
			value: window.screen.height/window.screen.width
		},
		_COLOR: {/* Define e obtém a cor a partir de um inteiro (looping) */
			set: function(n) {
				var colors = [ /* Sequência de cores */
					"#0000FF", "#FF0000", "#00FF00", "#663399", "#A0522D", "#D2B48C",
					"#1E90FF", "#FF69B4", "#008080", "#800080", "#FFA500", "#DAA520"
				];
				this._NCOLOR = "#000000"; /* Valor padrão */
				if (n !== null)
					this._NCOLOR = colors[n >= colors.length ? n % colors.length : n];
			},
			get: function() {
				return this._NCOLOR;
			}
		},
		_CONVERT: {/* Converte número em porcentagem: 58 => "58%" */
			value: function(x) {
				return new String(x).toString()+"%";
			}
		},
		_SET_ENDS: {/* Registra as extremidades FIXME: criar função? */
			value: function(axes, array) {
				var data = WDstatistics(array);
				var min  = data.min.value;
				var max  = data.max.value;
				if (min < this._ENDS[axes].min) this._ENDS[axes].min = min;
				if (max > this._ENDS[axes].max) this._ENDS[axes].max = max;
				return;
			}
		},
		_CHECK_ENDS: {/* Verifica se os extremos estão adequados FIXME preciso disso? Criar função? */
			value: function(axes) {
				if (this._ENDS[axes].min >= this._ENDS[axes].max) return false;
				if (this._ENDS[axes].min === null || this._ENDS[axes].max === null) return false;
				return true;
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
						backgroundColor: "#F8F8FF", border: "1px dotted black"
					});

				return elem;
			}
		},
 		_BUILD_POINT: {/* Desenha um ponto: coordenadas do centro */
 			value: function(cx, cy, title) {
	 			var point = this._BUILD_SVG("circle", {
					cx: cx, cy: cy, r: "3px", fill: this._COLOR, title: title
				});
 				this._SVG.appendChild(point);
 				return point;
 			}
 		},
		_BUILD_LINE: {/* Desenha uma linha: coordenadas inicial e final */
 			value: function(x1, y1, x2, y2, title, dash) {
 				var line = this._BUILD_SVG("line", {
 					x1: x1, y1: y1, x2: x2, y2: y2,
 					stroke: this._COLOR,
 					"stroke-width":     dash === true ? "1px" : "2px",
 					"stroke-dasharray": dash === true ? "1,5" : "0",
 					title: title
 				});
 				this._SVG.appendChild(line);
 				return line;
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
				 	attr.y = x/this.RATIO;
				 	attr.x = -this.RATIO*y;
				 }
				 if (bold === true) attr["font-weight"] = "bold";
				 var label = this._BUILD_SVG("text", attr);
				 this._SVG.appendChild(label);
				 return label;
			}
		},
		_CLEAR_SVG: {/* Limpa os filhos do SVG */
			value: function() {
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
 				/*ajustando ao eixo*/
 				x = x - this._ENDS.x.min;
 				y = y - this._ENDS.y.min;
 				/*devolvendo o ponto*/
 				return {
 					x: this._MEASURES.l + (x * this._SCALE.x),
 					y: 100 - (this._MEASURES.b + y * this._SCALE.y)
 				};
 			}
 		},
		_ADD_LEGEND: { /* Adiciona Legendas */
			value: function(text, n) {
				this._BUILD_LABEL(
					this._MEASURES.l+this._MEASURES.w+3,
					(n+1)*this._MEASURES.t+3,
					text, "sw"
				);
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

		_GET_PLAN_DATA: {/* Retorna dados principais para plotar gráfico plano */
			value: function(n, lines) {
				return {
					y: {/*linhas horizontais e ylabel*/
						x1: this._MEASURES.l,
						y1: this._MEASURES.t + n*(this._MEASURES.h/lines),
						x2: this._MEASURES.l + this._MEASURES.w,
						y2: this._MEASURES.t + n*(this._MEASURES.h/lines),
						ds: n === 0 || n === lines ? false : true,
						lx: this._MEASURES.l - 1,
						ly: this._MEASURES.t + this._MEASURES.h - n*(this._MEASURES.h/lines),
						lp: n === 0 ? "se" : (n === lines ? "ne" : "e"),
					},
					x: {/*linhas verticais e xlabel */
						x1: this._MEASURES.l + n*(this._MEASURES.w/lines),
						y1: this._MEASURES.t,
						x2: this._MEASURES.l + n*(this._MEASURES.w/lines),
						y2: this._MEASURES.t + this._MEASURES.h,
						ds: n === 0 || n === lines ? false : true,
						lx: this._MEASURES.l + n*(this._MEASURES.w/lines),
						ly: this._MEASURES.t + this._MEASURES.h + 1,
						lp: n === 0 ? "nw" : (n === lines ? "ne" : "n"),
					}
				};
			}
		},


		_SET_PLAN_AREA: { /* Desenha a área do gráfico plano */
			value: function(lines) {
				for (var i = 0; i < (lines+1); i++) {
					var plan = this._GET_PLAN_DATA(i);
					for (var e in plan) {
						this.BUILD_LINE(/*linhas*/
							plan[e].x1, plan[e].y1, plan[e].x2, plan[e].y2,
							"", plan[e].ds
						);
						this.points[e].push(this._BUILD_LABEL(/*labels dos eixos*/
							plan[e].lx, plan[e].ly, i, plan[e].lp, false
						));
					}
				}

				this._BUILD_LABEL(/*nome do eixo X*/
					this._MEASURES.l + (this._MEASURES.w)/2, 98, this.xlabel, "s", false
				);
				this._BUILD_LABEL(/*nome do eixo Y*/
					2, this._MEASURES.t + (this._MEASURES.h)/2, this.ylabel, "n", true
				);
				this._BUILD_LABEL(/*Título do Gráfico*/
					this._MEASURES.l + (this._MEASURES.w)/2, this._MEASURES.t - 2,
					this.TITLE, "s", false, true
				);
			}
		},
		SET_PLAN_AXES: {
			value: function(lines) {
				var deltaX = (this.ENDS.x.max - this.ENDS.x.min) / lines;
				var deltaY = (this.ENDS.y.max - this.ENDS.y.min) / lines;
				var x = this.ENDS.x.min;
				var y = this.ENDS.y.min;
				for (var i = 0; i < this.points.x.length; i++) {
					this.points.x[i].textContent = this.LABEL_VALUE(x);
					this.points.y[i].textContent = this.LABEL_VALUE(y);
					x += deltaX;
					y += deltaY;
				}
				return;
			}
		},

/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
		_PLOT_PLAN: {
			value: function (xlabel, ylabel) {
				/* Definindo Padding e medidas do gráfico */
				var padd = {t: 6, r: 30, b: 10, l: 30};
				for (var i in padd) this._PADDING[i] = padd[i];
				this._SET_MEASURES();

				/* Obtendo valores básicos */
				var data  = [];
				for (var i = 0; i < this._DATA.length; i++) {
					var item = this._DATA[i];
					if (item.regr === null) continue;
					var obj  = {};
					obj.x = item.regr.x;
					obj.f = item.regr.f;
					obj.y = obj.f === null ? item.regr.y : [];
					obj.l = item.lbl;
					obj.a = item.anlys;
					obj.t = obj.f !== null || obj.a === "line" : "line" : "dots";
					obj.o = item.regr;
					this._SET_ENDS("x", obj.x);
					if (obj.f !== null) this._SET_ENDS("y", obj.y);
					data.push(obj);
				}
				if (data.length === 0) return null;









				/* Definindo as análises */
				var additional = ["geometric", "linear", "exponential", "average"];
				if (additional.indexOf(type) >= 0) {
					for (var i = 0; i < data.length; i++) {
						if (data[i].f !== null) continue;
						var obj = WDregression(data[i].x, data[i].y);
						var val = obj[type];
						if (val === null) continue;
						if (type === "average")
							var label = "average: "+val;
						else
							var label = val.replace(
								"a", this._LABEL_VALUE(val.a)
							).replace(
								"b", this._LABEL_VALUE(val.b)
							);
						data.push({
							x: data[i].x,
							y: [], t: "line", l: label, 
							f: type === "average" ? function(x) {return val;} : val.f,
						});
					}
				}

				/* Definindo escalas e definindo valores de funções */
				this._SET_SCALE("x");
				var delta = this._SCALE.d / this._SCALE.x;
				for (var i = 0; i < data.length; i++) {
					if (data[i].f === null) continue;
					data[i].t = "line";
					var obj = WDstatistics(data[i].x);
					var val = obj.continuous(data[i].f, delta);
					console.log(obj)
					data[i].x = val.x;
					data[i].y = val.y;
					this._SET_ENDS("y", (type === "average" ? val.y : val.y));
				}
				this._SET_SCALE("y");

				/* Desenhando plano do Gráfico */
				this._CLEAR_SVG();
				console.log(data)
				//this._SET_AXES();








			}
		},





/* -- Funções acessíveis ---------------------------------------------------- */
		add: {
			enumerable: true,
			value: function(x, y, label, analysis) {/* Adiciona conjunto de dados para plotagem */
				if (this._SVG === null) return null;
				var regr = WDregression(x, y);
				var comp = WDcomparison(x, y);
				if (regr.e && comp.e) return null;
				this._DATA.push({comp: comp, regr: regr, lbl: label, anlys: analysis});
				return this._DATA.length-1;
 			}
		},
		plot: {
			enumerable: true,
			value: function(type, xlabel, ylabel) {/*executa a plotagem*/
				var value = null;
				switch(type) {
					case "circular":
						value = this._PLOT_CIRCULAR();
					case "bars":
						value = this._PLOT_BARS(xlabel, ylabel);
					default:
						value = this._PLOT_PLAN(xlabel, ylabel);
				}
				return value;








/*
				if (this.SET_PLAN_CHART() === null) return null;

				for (var i = 0; i < this.data.length; i++) {
					var data   = this.data[i];
					this._COLOR = i;
					this.ADD_LEGEND(data.label, i);

					for (var j = 0; j < data.x.length; j++) {
						var title   = "("+data.x[j]+", "+data.y[j]+")";
						var target1 = this.TARGET(data.x[j], data.y[j]);
						var target2 = null;
						if ((j+1) < data.x.length)
							target2 = this.TARGET(data.x[j+1], data.y[j+1]);

						if (data.line && target2 !== null) {
							this.BUILD_LINE(
								target1.x, target1.y, target2.x, target2.y, title
							);
						} else if (!data.line) {
							this.BUILD_POINT(target1.x, target1.y, title);
						}
					}
				}
*/
			}
		},
	});
