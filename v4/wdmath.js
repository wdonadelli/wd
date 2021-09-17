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
	var val = this.SET_FINITE(a);
	Object.defineProperties(this, {
		o: {value: val},
		a: {value: WD(val).del(null)},
		l: {get: function() {return this.a.length;}},
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
			if (this.a.length === 0) return null;
			var val  = WD(this.a).sort()[0];
			var diff = this.STD_DEV(this.a, val);
			return {value: val, delta: diff};
		}
	},
	max: {/*maior valor*/
		get: function() {
			if (this.l === 0) return null;
			var val  = WD(this.a).sort().reverse()[0];
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
			var a = WD(this.a).sort();
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
			console.log(f.toString());
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

	function WDchart(box) {/*Objeto para criar gráficos*/
		if (!(this instanceof WDchart)) return new WDchart(box);
		Object.defineProperties(this, {/*atributos do objeto*/
			BOX:      {value: box},                    /*elemento container*/
			SVG:      {value: this.CREATE_SVG("svg")}, /*elemento SVG*/
			SCALE:    {value: {x: 1, y: 1, d: 0.1}},   /*fator de escala (x/y) e delta (menor unidade de gráfico em %)*/
			N:        {value: 0, writable: true},      /*sequência da cor*/
			MEASURES: {value: {t: 0, r: 0, b: 0, l: 0, w: 100, h: 100}}, /*guarda as dimensões do gráfico*/
			ENDS:     {value: {x: {min: null, max: null}, y: {min: null, max: null}}}, /*guarda os valores extremos*/
		});
		this.SET_BOX();
		this.SET_SVG();
	}

	Object.defineProperties(WDchart.prototype, {
		constructor: {value: WDchart},
		RATIO: {/*proporção do gráfico*/
			value: window.screen.height/window.screen.width
		},
		COLORS: {/*Cores dos gráficos*/
			value: [ 
				"#0000FF", "#FF0000", "#00FF00", "#663399", "#A0522D", "#D2B48C",
				"#1E90FF", "#FF69B4", "#008080", "#800080", "#FFA500", "#DAA520"
			]
		},
		COLOR: {/*Retorna cor a ser utilizada*/
			value: function() {
				var color = this.COLORS[this.N];
				this.N = (this.N + 1) === this.N.length ? 0 : this.N + 1;
				return color;
			}
		},
		REF: {/*converte número em porcentagem: 100 => "100%"*/
			value: function(x) {
				return new String(x).toString()+"%";
			}
		},
		SET_ENDS: {/*registra as extremidades*/
			value: function(axis, array) {
				var data = WDstatistics(array);
				var min  = data.min.value;
				var max  = data.max.value;
				if (this.ENDS[axis].min === null || min < this.ENDS[axis].min)
					this.ENDS[axis].min = min;
				if (this.ENDS[axis].max === null || max > this.ENDS[axis].max)
					this.ENDS[axis].max = max;
				return;
			}
		},
		CHECK_ENDS: {/*Verifica se os extremos estão adequados*/
			value: function() {
				for (var i in this.ENDS) {
					if (this.ENDS[i].min >= this.ENDS[i].max) return false;
					if (this.ENDS[i].min === null || this.ENDS[i].max === null) return false;
				}
				return true;
			}
		},
		CREATE_SVG: {/*cria e retorna elementos svg conforme configurações*/
			value: function(type, attr) {
				var elem = document.createElementNS("http://www.w3.org/2000/svg", type);
				var ref  = [ /*Valores a serem definidos em porcentagem*/
					"x", "y", "x1", "x2", "y1", "y2", "height", "width",
					"cx", "cy", "r", "dx", "dy"
				];

				for (var i in attr) {
					var val = attr[i];
					if (i === "tspan" || i === "title") {
						var info = this.CREATE_SVG(i, {});
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
 		POINT: {/*Desenha um ponto no gráfico: coordenadas do centro*/
 			value: function(cx, cy, title) {
	 			var circle = this.CREATE_SVG("circle", {
					cx: cx, cy: cy, r: "3px", fill: this.COLOR(), title: title
				});
 				this.SVG.appendChild(circle);
 			}
 		},
		LINE: {/*Desenha uma linha no gráfico: coordenadas inicial e final)*/
 			value: function(x1, y1, x2, y2, title, dash) {
 				var line = this.CREATE_SVG("line", {
 					x1: x1, y1: y1, x2: x2, y2: y2,
 					stroke: this.COLOR(),
 					"stroke-width":     dash === true ? "1px" : "2px",
 					"stroke-dasharray": dash === true ? "1,5" : "0",
 					title: title
 				});
 				this.SVG.appendChild(line);
 			}
 		},
		LABEL: {/*cria textos para exibir na tela*/
			value: function (x, y, text, point, vertical) {
				var vanchor = ["start", "middle", "end"];
				var anchor  = {n: 1, ne: 2, e: 2, se: 2, s: 1, sw: 0, w: 0, nw: 0, c: 1};
				var vbase   = ["auto", "middle", "hanging"];
				var base    = {n: 2, ne: 2, e: 1, se: 0, s: 0, sw: 0, w: 1, nw: 2, c: 1};
				point       = point in base ? point : "c" ;
				var attr = {
					x: x, y: y,
					fill: this.COLOR(),
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
				 var label = this.CREATE_SVG("text", attr);
				 this.SVG.appendChild(label);
			}
		},
 		SET_SCALE: {/*Define o valor da escala horizontal e vertical*/
 			value: function() {
 				/*escala em x*/
 				this.SCALE.x = this.MEASURES.w/(this.ENDS.x.max - this.ENDS.x.min);
 				/*escala em y*/
 				this.SCALE.y = this.MEASURES.h/(this.ENDS.y.max - this.ENDS.y.min);
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
 		}
	});

/*----------------------------------------------------------------------------*/




















/*----------------------------------------------------------------------------*/

	function WDchartLinear(box) {
		if (!(this instanceof WDchartLinear)) return new WDchartLinear(box);
		WDchart.call(this, box);
		this.data = []; /*guarda os dados dos pontos em {x,y,label,plotagem,função}*/
		this.func = []; /*guarda os endereços de plotagem de função*/
	}

	WDchartLinear.prototype = Object.create(WDchart.prototype, {
		constructor: {value: WDchartLinear},
		lines:       {value: 4},                         /*linhas auxiliares (n - 1)*/
		padding:     {value: {t: 10, r: 5, b: 10, l: 20}} /*espaços internos entre a lateral e o gráfico*/
	});

	Object.defineProperties(WDchartLinear.prototype, {
		setMeasures: {/*Define as medidas do gráfico (relativa, top, right, bottom, left, width, height)*/
			value: function() {
				this.measures.t = this.padding.t;
				this.measures.r = this.padding.r * this.RATIO;
				this.measures.b = this.padding.b;
				this.measures.l = this.padding.l * this.RATIO;
				this.measures.w = 100 - this.measures.l - this.measures.r;
				this.measures.h = 100 - this.measures.t - this.measures.b;
				return;
			}
		},
		setLabelValue: {/*define a forma de exibição do valor numérico*/
			value: function(x) {
				var val = Math.abs(x);
				var inv = 1/val;
				if (val === 0) return "0";
				if (val >= 1e10 || inv >= 1e10) return x.toExponential(0);
				if (val >= 1e3  || inv >= 1e3 ) return x.toExponential(1);
				if (val >= 1e2  || inv >= 1e2 ) return WD(x).fixed(0,0);
				if (val >= 1e1  || inv >= 1e1 ) return WD(x).fixed(1,0);
				return WD(x).fixed(2,0);
			}
		},
		getAuxLines: {/*Retorna as características das linhas do gráfico (laterais e auxiliares)*/
			value: function(n) {
				return {
					h: {
						x1: this.measures.l,
						y1: this.measures.t + n*(this.measures.h/this.lines),
						x2: this.measures.l + this.measures.w,
						y2: this.measures.t + n*(this.measures.h/this.lines)
					},
					v: {
						x1: this.measures.l + n*(this.measures.w/this.lines),
						y1: this.measures.t,
						x2: this.measures.l + n*(this.measures.w/this.lines),
						y2: this.measures.t + this.measures.h,
					}
				};
			}
		},
		setArea: {/*Define a área do gráfico*/
			value: function() {

				/*linhas secundárias e numeração dos eixos*/
				var label = {
					v:  this.value.x.min,
					dv: (this.value.x.max - this.value.x.min)/this.lines,
					v0: this.value.x.min,
					vn: this.value.x.max,
					/*o eixo y inicia em cima, então tem que fazer o inverso de x:*/
					h:  this.value.y.max,
					dh: -(this.value.y.max - this.value.y.min)/this.lines,
					h0: this.value.y.max,
					hn: this.value.y.min,
				};
				/*desenhando linhas principais*/
				for (var i = 0; i < this.lines+1; i++) {
					var aux = this.getAuxLines(i);
					for (var p in aux) {

						/*eixos*/
						this.setLine(aux[p].x1, aux[p].y1, aux[p].x2, aux[p].y2,
							null, "", (i === 0 || i === this.lines ? false : true)
						);





						/*valores dos eixos FIXME: resumir isso aqui */
						var text = i === 0 ? label[p+"0"] : label[p];
						if (i === this.lines) text = label[p+"n"];

						var pos = p === "h" ? "e" : "n";
						if (i === 0 || i === this.lines) {
							if (p === "h") pos = i === 0 ? "ne" : "se";
							else           pos = i === 0 ? "nw" : "ne";

						}

						this.setLabel(/*text, x, y, color, point, vertical*/
							this.setLabelValue(text),
							aux[p].x1 + (p === "h" ? -1 : 0),
							aux[p].y1 + (p === "v" ? this.measures.h+1 : 0),
							null,
							pos
						);
						label[p] += label["d"+p];







					}
				}

				/*Nome dos eixos (centralização na área útil do gráfico)*/
				var xaxis = this.measures.l + (this.measures.w)/2;
				var yaxis = this.measures.t + (this.measures.h)/2;
				this.setLabel("Eixo X", xaxis, 99.9, null, "s", false);
				this.setLabel("Eixo Y", 0.1, yaxis, null, "n", true);





				return;
 			}
 		},
	});





	Object.defineProperty(WDchartLinear.prototype, "add", {
		enumerable: true,
		value: function(x, y, label, line) {/*Adiciona conjunto de dados para plotagem*/
			line = line === false ? false : true;
			var func = WD(y).type === "function" ? true : false;

			this.data.push({y: y, x: x, label: label,	line: line, func: func});
			for (var i = 0; i < x.length; i++) this.setValue("x", x[i]);
			if (!func)
				for (var i = 0; i < y.length; i++) this.setValue("y", y[i]);
			return;
 		}
	});

	Object.defineProperty(WDchartLinear.prototype, "plot", {
		enumerable: true,
		value: function(title) {/*executa a plotagem*/
			this.setMeasures(); /*define as medidas do gráfico*/
			this.setScale();    /*define a relação entre as escalas reais e gráficas*/
			this.setArea();     /*define a área do gráfico*/

			for (var i = 0; i < this.data.length; i++) {
				for (var j = 0; j < this.data[i].y.length; j++) {
					if (this.data[i].line) {
						if (this.data[i].y[j+1] === undefined) break;
						var coord = {
							x1: this.data[i].x[j],   y1: this.data[i].y[j],
							x2: this.data[i].x[j+1], y2: this.data[i].y[j+1]
						};
						var pos1 = this.getXY(coord.x1, coord.y1);
						var pos2 = this.getXY(coord.x2, coord.y2)
						var title = "(x,y) = ("+coord.x1+", "+coord.y1+")";
						this.setLine(pos1.x, pos1.y, pos2.x, pos2.y, i, title);
					} else {
						var coord = {x1: this.data[i].x[j], y1: this.data[i].y[j]};
						var pos = this.getXY(coord.x1, coord.y1);
						var title = "(x,y) = ("+coord.x1+", "+coord.y1+")";
						this.setPoint(pos.x, pos.y, i, title);
					}
				}
			}
			return;
		}
	});



