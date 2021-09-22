var WD = wd;

function WDdataSet() {
	if (!(this instanceof WDdataSet)) return new WDdataSet();
}

Object.defineProperty(WDdataSet.prototype, "constructor", {value: WDdataSet});

Object.defineProperties(WDdataSet.prototype, {
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

function WDstatistics(a) {
	if (!(this instanceof WDstatistics)) return new WDstatistics(a);
	WDdataSet.call(this);
	if (WD(a).type !== "array") a = [];
	var val = WD(this.SET_FINITE(a)).sort();
	Object.defineProperties(this, {
		o: {value: val}, /*array numérico completo*/
		a: {value: WD(val).del(null)}, /*array numérico sem nulos*/
		l: {get: function() {return this.a.length;}}, /*comprimento array sem nulos*/
	});
}

WDstatistics.prototype = Object.create(WDdataSet.prototype, {
		constructor: {value: WDstatistics}
});

Object.defineProperties(WDstatistics.prototype, {/*-- Estatística --*/
	sum: {/*soma*/
		get: function() {
			if (this.l === 0) return null;
			var val  = this.SUM(this.a, 1)
			var diff = this.STD_DEV(this.a, val);
			return {value: val, delta: diff};
		}
	},
	min: {/*menor valor*/
		get: function() {
			if (this.l === 0) return null;
			var val  = this.a[0];
			var diff = this.STD_DEV(this.a, val);
			return {value: val, delta: diff};
		}
	},
	max: {/*maior valor*/
		get: function() {
			if (this.l === 0) return null;
			var val  = this.a[this.l-1];
			var diff = this.STD_DEV(this.a, val);
			return {value: val, delta: diff};
		}
	},
	average: {/*média*/
		get: function() {
			if (this.l === 0) return null;
			var val  = this.sum.value/this.l;
			var diff = this.STD_DEV(this.a, val);
			return {value: val, delta: diff};
		}
	},
	median: {/*mediana*/
		get: function() {
			if (this.l === 0) return null;
			var a = this.a;
			var l = this.l;
			var val  = (l % 2 === 0) ? (a[l/2]+a[(l/2)-1])/2 : a[(l-1)/2];
			var diff = this.STD_DEV(this.a, val);
			return {value: val, delta: diff};
		}
	},
	geometric: {/*média geométrica*/
		get: function() {
			if (this.l === 0) return null;
			var val  = Math.pow(Math.abs(this.PRODUCT(this.a, 1)), 1/this.l);
			var diff = this.STD_DEV(this.a, val);
			return {value: val, delta: diff}
		}
	},
	harmonic: {/*média harmônica*/
		get: function() {
			if (this.l === 0) return null;
			var harm = this.SUM(this.a, -1);
			var val  = harm === 0 || harm === null ? null : this.l/harm;
			var diff = val === null ? null : this.STD_DEV(this.a, val);
			return {value: val, delta: diff}
		}
	},
	continuous: {
		value: function(func, delta) {
			if (this.l === 0) return null;
			if (!WD(delta).finite || WD(func).type !== "function") return null;
			delta    = WD(delta).abs;
			var min  = this.min.value;
			var max  = this.max.value;
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

function WDregression(x, y) {
	if (!(this instanceof WDregression)) return new WDregression(x, y);
	WDdataSet.call(this);
	if (WD(x).type !== "array") x = [];
	if (WD(y).type !== "array") y = [];
	var val = this.ADJUST_LISTS(this.SET_FINITE(x), this.SET_FINITE(y));
	Object.defineProperties(this, {
		x: {value: val.list1},
		y: {value: val.list2},
		l: {value: val.length}
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
			if (this.l === 0) return null;
			var val = this.LEAST_SQUARES(this.x, this.y);
			if (val === null) return null;
			var data = {
				e: "y(x) = a.x+b",
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
			if (this.l === 0) return null;
			/*pontos para a regressão (ajustando Y para equação linear)*/
			var y    = this.SET_FINITE(this.SET_Y(this.y, Math.log));
			var axes = this.ADJUST_LISTS(this.x, y);
			if (axes.length === 0) return null;
			/*regressão*/
			var val = this.LEAST_SQUARES(axes.list1, axes.list2);
			if (val === null) return null;
			var data = {
				e: "y(x) = a.exp(b.x)",
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
			if (this.l === 0) return null;
			/*pontos para a regressão (ajustando X/Y para equação linear)*/
			var x = this.SET_FINITE(this.SET_Y(this.x, Math.log));
			var y = this.SET_FINITE(this.SET_Y(this.y, Math.log));
			var axes = this.ADJUST_LISTS(x, y);
			if (axes.length === 0) return null;
			/*regressão*/
			var val = this.LEAST_SQUARES(axes.list1, axes.list2);
			if (val === null) return null;
			var data = {
				e: "y(x) = y = a.x**b",
				a: Math.exp(val.b),
				b: val.a,
			};
			data.f = function(x) {return data.a*Math.pow(x, data.b);},
			data.d = this.REG_DEV(data.f);
			return data;
		}
	},
	integral: {
		get: function() {
			if (this.l === 0) return null;
			var int = 0;
			for (var i = 0; i < (this.l - 1); i++) {
				var fi = {x: this.x[i],   y: this.y[i]};
				var fn = {x: this.x[i+1], y: this.y[i+1]};
				int += (fn.y + fi.y)*(fn.x - fi.x)/2;
			}
			return int;
		}
	},
});

/*----------------------------------------------------------------------------*/

function WDcomparison(x, y) {
	if (!(this instanceof WDcomparison)) return new WDcomparison(x, y);
	WDdataSet.call(this);
	if (WD(x).type !== "array") x = [];
	if (WD(y).type !== "array") y = [];

	Object.defineProperties(this, {
		x: {value: this.SET_STRING(x)},
		y: {value: this.SET_FINITE(y)},
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
			if (this.x.length === 0) return null;
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
			var data = this.occurrences;
			if (data === null || this.y.length === 0) return null;
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
			var data = this.amount;
			if (data === null) return null;
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
			BOX:      {value: box},                    /*elemento container*/
			SVG:      {value: this.BUILD_SVG("svg")}, /*elemento SVG*/
			SCALE:    {value: {x: 1, y: 1, d: 0.1}},   /*fator de escala (x/y) e delta (menor unidade de gráfico em %)*/
			NCOLOR:   {value: 0, writable: true},      /*guarda a cor*/
			MEASURES: {value: {t: 0, r: 0, b: 0, l: 0, w: 100, h: 100}}, /*guarda as dimensões do gráfico*/
			ENDS:     {value: {x: {min: null, max: null}, y: {min: null, max: null}}}, /*guarda os valores extremos*/
			TITLE:    {value: title}
		});
		this.SET_BOX();
		this.SET_SVG();
		this.COLOR = null;
	}

	Object.defineProperties(WDchart.prototype, {
		constructor: {value: WDchart},
		RATIO: {/*proporção do gráfico*/
			value: window.screen.height/window.screen.width
		},
		COLOR: {/*define e obtém a cor a partir de um índice*/
			set: function(n) {
				var colors = [ 
					"#0000FF", "#FF0000", "#00FF00", "#663399", "#A0522D", "#D2B48C",
					"#1E90FF", "#FF69B4", "#008080", "#800080", "#FFA500", "#DAA520"
				];
				if (n === null)
					this.NCOLOR = "#000000";
				else
					this.NCOLOR = colors[n >= colors.length ? n % colors.length : n];
			},
			get: function() {
				return this.NCOLOR;
			}
		},
		REF: {/*converte número em porcentagem: 100 => "100%"*/
			value: function(x) {
				return new String(x).toString()+"%";
			}
		},
		SET_ENDS: {/*registra as extremidades*/
			value: function(axes, array) {
				var data = WDstatistics(array);
				var min  = data.min.value;
				var max  = data.max.value;
				if (this.ENDS[axes].min === null || min < this.ENDS[axes].min)
					this.ENDS[axes].min = min;
				if (this.ENDS[axes].max === null || max > this.ENDS[axes].max)
					this.ENDS[axes].max = max;
				return;
			}
		},
		CHECK_ENDS: {/*Verifica se os extremos estão adequados FIXME preciso disso?*/
			value: function(axes) {
				if (this.ENDS[axes].min >= this.ENDS[axes].max) return false;
				if (this.ENDS[axes].min === null || this.ENDS[axes].max === null) return false;
				return true;
			}
		},
		SET_BOX: {/*Define as características do container do svg*/
			value: function() {
				WD(this.BOX).set("innerHTML", "").css(null).style(null).style({
					position: "relative", paddingTop: this.REF(100 * this.RATIO)
				});
				return;
			}
		},
		SET_SVG: {/*Define as características do SVG e adiciona ao container*/
			value: function() {
				WD(this.SVG).style({
					height: "100%", width: "100%", position: "absolute",
					top: "0", left: "0", bottom: "0", right: "0",
					backgroundColor: "#F8F8FF", border: "1px dotted black"
				});
				this.BOX.appendChild(this.SVG);
				return;
			}
		},
		BUILD_SVG: {/*cria e retorna elementos svg conforme configurações*/
			value: function(type, attr) {
				var elem = document.createElementNS("http://www.w3.org/2000/svg", type);
				var ref  = [ /*Valores a serem definidos em porcentagem*/
					"x", "y", "x1", "x2", "y1", "y2", "height", "width",
					"cx", "cy", "r", "dx", "dy"
				];

				for (var i in attr) {
					var val = attr[i];
					if (i === "tspan" || i === "title") {
						var info = this.BUILD_SVG(i, {});
						info.textContent = val;
						elem.appendChild(info);
					} else {
						if (ref.indexOf(i) >= 0 && WD(val).finite) val = this.REF(val);
						elem.setAttribute(i, val);
					}
				}
				
				return elem;
			}
		},
 		BUILD_POINT: {/*Desenha um ponto no gráfico: coordenadas do centro*/
 			value: function(cx, cy, title) {
	 			var point = this.BUILD_SVG("circle", {
					cx: cx, cy: cy, r: "3px", fill: this.COLOR, title: title
				});
 				this.SVG.appendChild(point);
 				return point;
 			}
 		},
		BUILD_LINE: {/*Desenha uma linha no gráfico: coordenadas inicial e final)*/
 			value: function(x1, y1, x2, y2, title, dash) {
 				var line = this.BUILD_SVG("line", {
 					x1: x1, y1: y1, x2: x2, y2: y2,
 					stroke: this.COLOR,
 					"stroke-width":     dash === true ? "1px" : "2px",
 					"stroke-dasharray": dash === true ? "1,5" : "0",
 					title: title
 				});
 				this.SVG.appendChild(line);
 				return line;
 			}
 		},
		BUILD_LABEL: {/*cria textos para exibir na tela*/
			value: function (x, y, text, point, vertical, bold) {
				var vanchor = ["start", "middle", "end"];
				var anchor  = {n: 1, ne: 2, e: 2, se: 2, s: 1, sw: 0, w: 0, nw: 0, c: 1};
				var vbase   = ["auto", "middle", "hanging"];
				var base    = {n: 2, ne: 2, e: 1, se: 0, s: 0, sw: 0, w: 1, nw: 2, c: 1};
				point       = point in base ? point : "c" ;
				var attr = {
					x: x, y: y,
					fill: this.COLOR,
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
				 var label = this.BUILD_SVG("text", attr);
				 this.SVG.appendChild(label);
				 return label;
			}
		},
 		SET_SCALE: {/*Define o valor da escala horizontal e vertical*/
 			value: function(axes) {
 				var ref = axes === "x" ? this.MEASURES.w : this.MEASURES.h;
 				this.SCALE[axes] = ref/(this.ENDS[axes].max - this.ENDS[axes].min);
 				return;
 			}
 		},
 		TARGET: {/*Retorna as coordenadas relativas a partir dos valores reais*/
 			value: function(x,y) {
 				/*ajustando ao eixo*/
 				x = x - this.ENDS.x.min;
 				y = y - this.ENDS.y.min;
 				/*devolvendo o ponto*/
 				return {
 					x: this.MEASURES.l + (x * this.SCALE.x),
 					y: 100 - (this.MEASURES.b + y * this.SCALE.y)
 				};
 			}
 		},
 		LABEL_VALUE: {/*define a forma de exibição do valor numérico*/
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

	});

/*----------------------------------------------------------------------------*/

	function WDplanChart(box, title, xlabel, ylabel) {
		if (!(this instanceof WDplanChart)) return new WDplanChart(box, title, xlabel, ylabel);
		WDchart.call(this, box, title);
		Object.defineProperties(this, {
			data:   {value: []}, /*guarda os conjunto de dados*/
			points: {value: {x: [], y: []}}, /*guarda os elementos da numeração dos eixos*/
			xlabel: {value: xlabel}, /*guarda o nome do eixo x*/
			ylabel: {value: ylabel}, /*guarda o nome do eixo y*/
		});
		this.SET_MEASURES();
		this.SET_AREA();
	}

	WDplanChart.prototype = Object.create(WDchart.prototype, {
		constructor: {value: WDplanChart},
		LINES:       {value: 4}, /*linhas auxiliares (n - 1)*/
		PADD:        {value: {t: 6, r: 30, b: 10, l: 30}} /*espaços internos entre a lateral e o gráfico*/
	});

	Object.defineProperties(WDplanChart.prototype, {
		SET_MEASURES: {/*Define as medidas relativas (top, right, bottom, left, width, height)*/
			value: function() {
				this.MEASURES.t = this.PADD.t;
				this.MEASURES.r = this.PADD.r * this.RATIO;
				this.MEASURES.b = this.PADD.b;
				this.MEASURES.l = this.PADD.l * this.RATIO;
				this.MEASURES.w = 100 - this.MEASURES.l - this.MEASURES.r;
				this.MEASURES.h = 100 - this.MEASURES.t - this.MEASURES.b;
				return;
			}
		},
		GET_PLAN_DATA: {/*Define o plano do gráfico (laterais e auxiliares)*/
			value: function(n) {
				return {
					y: {/*linhas horizontais e ylabel*/
						x1: this.MEASURES.l,
						y1: this.MEASURES.t + n*(this.MEASURES.h/this.LINES),
						x2: this.MEASURES.l + this.MEASURES.w,
						y2: this.MEASURES.t + n*(this.MEASURES.h/this.LINES),
						ds: n === 0 || n === this.LINES ? false : true,
						lx: this.MEASURES.l - 1,
						ly: this.MEASURES.t + this.MEASURES.h - n*(this.MEASURES.h/this.LINES),
						lp: n === 0 ? "se" : (n === this.LINES ? "ne" : "e"),
					},
					x: {/*linhas verticais e xlabel */
						x1: this.MEASURES.l + n*(this.MEASURES.w/this.LINES),
						y1: this.MEASURES.t,
						x2: this.MEASURES.l + n*(this.MEASURES.w/this.LINES),
						y2: this.MEASURES.t + this.MEASURES.h,
						ds: n === 0 || n === this.LINES ? false : true,
						lx: this.MEASURES.l + n*(this.MEASURES.w/this.LINES),
						ly: this.MEASURES.t + this.MEASURES.h + 1,
						lp: n === 0 ? "nw" : (n === this.LINES ? "ne" : "n"),
					}
				};
			}
		},
		SET_AREA: {
			value: function() {
				for (var i = 0; i < (this.LINES+1); i++) {
					var plan = this.GET_PLAN_DATA(i);
					for (var e in plan) {
						this.BUILD_LINE(/*linhas*/
							plan[e].x1, plan[e].y1, plan[e].x2, plan[e].y2,
							"", plan[e].ds
						);
						this.points[e].push(this.BUILD_LABEL(/*labels dos eixos*/
							plan[e].lx, plan[e].ly, i, plan[e].lp, false
						));
					}
				}

				this.BUILD_LABEL(/*nome do eixo X*/
					this.MEASURES.l + (this.MEASURES.w)/2, 98, this.xlabel, "s", false
				);
				this.BUILD_LABEL(/*nome do eixo Y*/
					2, this.MEASURES.t + (this.MEASURES.h)/2, this.ylabel, "n", true
				);
				this.BUILD_LABEL(/*Título do Gráfico*/
					this.MEASURES.l + (this.MEASURES.w)/2, this.MEASURES.t - 2,
					this.TITLE, "s", false, true
				);
			}
		},
		SET_AXES: {
			value: function() {
				var deltaX = (this.ENDS.x.max - this.ENDS.x.min) / this.LINES;
				var deltaY = (this.ENDS.y.max - this.ENDS.y.min) / this.LINES;
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
		SET_PLAN_CHART: {/*organiza os dados das funções e define escalas e eixos*/
			value: function() {
				if (this.data.length === 0 || !this.CHECK_ENDS("x")) return null;

				/*definindo a escala em x*/
				this.SET_SCALE("x");

				/*trabalhando com funções para definir escala em y*/
				var delta  = this.SCALE.d / this.SCALE.x;
				var object = new WDstatistics([this.ENDS.x.min, this.ENDS.x.max]);

				for (var i = 0; i < this.data.length; i++) {
					if (!this.data[i].func) continue;
					var value = object.continuous(this.data[i].y, delta);
					this.data[i].x = value.x;
					this.data[i].y = value.y;
					this.SET_ENDS("y", value.y);
					this.SET_ENDS("x", value.x);
				}
				
				/*definindo escala em y e definindo valores dos eixos*/
				if (!this.CHECK_ENDS("y")) return null;
				this.SET_SCALE("y");
				this.SET_SCALE("x");
				this.SET_AXES();
			}
		},
		add: {
			enumerable: true,
			value: function(x, y, label, line) {/*Adiciona conjunto de dados para plotagem*/
				if (WD(x).type !== "array") return null;
				if (WD(y).type !== "array" && WD(y).type !== "function") return null;
				var func = WD(y).type === "function" ? true : false;

				if (func) {
					var data = WDstatistics(x);
					x = data.a;
				} else {
					var data = WDregression(x, y);
					x = data.x;
					y = data.y;
				}

				if (data.l < 2) return null;
				this.SET_ENDS("x", x);
				if (!func) this.SET_ENDS("y", y);

				this.data.push({y: y, x: x, label: label,	line: line, func: func});

				return;
 			}
		},
		plot: {
			enumerable: true,
			value: function() {/*executa a plotagem*/
				if (this.SET_PLAN_CHART() === null) return null;

				for (var i = 0; i < this.data.length; i++) {
					var data   = this.data[i];
					this.COLOR = i;
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

				return;
			}
		},
		ADD_LEGEND: {
			value: function(text,n) {
				this.BUILD_LABEL(
					this.MEASURES.l+this.MEASURES.w+3,
					(n+1)*this.MEASURES.t+3,
					text, "sw"
				);
	
			
			}
		}
	});



