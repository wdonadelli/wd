//FIXME mudar wdChart, WDstatistics e WDanalysis para o BLOCO 2
	function wdChart(box, title) {/*Objeto para criar gráficos*/
		if (!(this instanceof wdChart)) return new wdChart(box, title);
		Object.defineProperties(this, {/*atributos do objeto*/
			/* Container HTML a acomodar o gráfico */
			_BOX: {value: this._BUILD_BOX(box)},
			/* Elemento SVG a ser plotado os dados */
			//_SVG: {value: this._BUILD_SVG("svg"), writable: true},
			_SVG: {value: null, writable: true},
			/* Escala do gráfico (x/y) */
			_SCALE: {value: {x: 1, y: 1}},
			/* Guarda a cor e a sequência das legendas */
			_NDATA: {value: {c: "#000000", r: 0, t: 0}},
			/* Registra os valores máximos e mínimos dos eixos */
			_ENDS: {value: {x: {min: Infinity, max: -Infinity}, y: {min: Infinity, max: -Infinity}}},
			/* Margens internas do gráfico */
			_PADDING: {value: {t: 0, r: 0, b: 0, l: 0}},
			/* Registra o título do gráfico */
			_TITLE: {value: title === undefined ? "" : title},
			/* Registra a entrada de dados */
			_DATA: {value: []},
		});
	};

	Object.defineProperties(wdChart.prototype, {
		constructor: {value: wdChart},
		_RATIO: {/* Relação altura/comprimento do gráfico (igual a da tela) */
			//FIXME: no celular fica esquisito (altura maior que largura)
			value: window.screen.height > window.screen.width ? 1 : window.screen.height/window.screen.width
		},
		_MEASURES: {
			set: function(x) {
				for (var i in x) this._PADDING[i] = x[i];
			},
			get: function() {
				var padd = this._PADDING;
				return {
					t: padd.t, r: 100-padd.r, b: 100-padd.b, l: padd.l,
					w: 100-(padd.l+padd.r), h: 100-(padd.t+padd.b),
					cx: padd.l+(100-(padd.l+padd.r))/2,
					cy: padd.t+(100-(padd.t+padd.b))/2,

				}
			}
		},
		_COLOR: {/* Define e obtém a cor a partir de um inteiro (looping) */
			set: function(n) {
				var ref = n < 0 ? 0 : (2*n+1)%7+1; /* 2,4,6,1,3,5,7,2...*/
				var bin = (ref < 2 ? "00" : (ref < 4 ? "0" : ""))+ref.toString(2);
				var clr = bin.split("");
				clr.forEach(function(e,i,a){a[i] = 153*Number(e);});
				this._NDATA.c = "rgb("+clr[0]+","+clr[1]+","+clr[2]+")";
			},
			get: function() {return this._NDATA.c;}
		},
		_CONVERT: {/* Converte número em porcentagem: 58 => "58%" */
			value: function(x) {return new String(x).toString()+"%";}
		},
		_DELTA: {/* Devolve a menor partícula em X */
			value: function(x) {
				return (x <= 0 ? 1 : x)/this._SCALE.x;
			}
		},
		_SET_ENDS: {/* Registra as extremidades */
			value: function(axes, array) {
				var data = WDstatistics(array);
				var min  = data.min;
				var max  = data.max;
				if (min < this._ENDS[axes].min) this._ENDS[axes].min = min;
				if (max > this._ENDS[axes].max) this._ENDS[axes].max = max;
				return;
			}
		},
		_BUILD_BOX: {/* Define as características do container do SVG (parent) */
			value: function(input) {
				var box = WD(input);
				if (box.type !== "dom") return null;
				WD(box.item(0)).set("innerHTML", "").css(null).style(null).style({
					position: "relative", paddingTop: this._CONVERT(100 * this._RATIO)
				});
				input = box.item(0);
				var child = input.children;
				while (child.length > 0) input.removeChild(child[0]);
				return input;
			}
		},
		_BUILD_SVG: {/* Cria e retorna elementos svg conforme atributos */
			value: function(type, attr) {
				if (this._BOX === null) return null;
				if (attr === undefined) attr = {};
				/* Propriedades a serem definidas em porcentagem */
				var ref  = [
					"x", "y", "x1", "x2", "y1", "y2", "height", "width",
					"cx", "cy", "r", "dx", "dy"
				];

				var elem = document.createElementNS("http://www.w3.org/2000/svg", type);

				for (var i in attr) {/* definindo atributos */
					var val = attr[i];
					if (i === "tspan" || i === "title") {/* texto ou dicas */
						var info = this._BUILD_SVG(i);
						info.textContent = val;
						elem.appendChild(info);
					} else { /*atributos*/
						val = (ref.indexOf(i) >= 0 && WD(val).finite) ? this._CONVERT(val) : val;
						elem.setAttribute(i, val);
					}
				}

				if (type === "svg") /* para SVG principal apenas */
					WD(elem).style({
						height: "100%", width: "100%", position: "absolute",
						top: "0", left: "0", bottom: "0", right: "0"
					});

				return elem;
			}
		},
		_BUILD_DOTS: {/* Desenha um ponto: coordenadas do centro */
			value: function(cx, cy, title, r) {
				r = (r === undefined ? 3 : r)+"px";
	 			var point = this._BUILD_SVG("circle", {
					cx: cx, cy: cy, r: r, fill: this._COLOR, title: title
				});
				this._SVG.appendChild(point);
				return point;
			}
		},
		_BUILD_LINE: {/* Desenha uma linha: coordenadas inicial e final */
			value: function(x1, y1, x2, y2, title, width) {
				width = width === undefined ? 1 : width;
				var line = this._BUILD_SVG("line", {
					x1: x1, y1: y1, x2: x2, y2: y2,
					stroke: this._COLOR,
					"stroke-width":     width === 0 ? "1px" : width+"px",
					"stroke-dasharray": width === 0 ? "1,5" : "0",
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
		_CLEAR_SVG: {/* (re)define parâmetros iniciais e SVG */
			value: function() {
				this._COLOR = 0;
				this._ENDS.x   = {min: Infinity, max: -Infinity};
				this._ENDS.y   = {min: Infinity, max: -Infinity};
				this._MEASURES = {t: 0, r: 0, b: 0, l: 0};
				this._NDATA.r  = 0;
				this._NDATA.t  = 0;
				if (this._SVG !== null) this._BOX.removeChild(this._SVG);
				this._SVG = this._BUILD_SVG("svg");
				this._BOX.appendChild(this._SVG);
				return;
			}
		},
		_SET_SCALE: {/* Define o valor da escala horizontal e vertical */
			value: function(axes) {
				var msrs  = this._MEASURES;
				var delta = this._ENDS[axes].max - this._ENDS[axes].min;
				var ref = axes === "x" ? msrs.w : msrs.h;
				this._SCALE[axes] = ref/delta;
				return;
			}
		},
		_TARGET: {/* Transforma coordanadas reais em relativas (%) */
			value: function(x,y) {
				if (!WD(x).finite || !WD(y).finite) return null;
				x = x - this._ENDS.x.min;
				y = y - this._ENDS.y.min;
				var msrs = this._MEASURES;
				return {
					x: msrs.l + x*this._SCALE.x,
					y: msrs.b - y*this._SCALE.y,
				};
			}
		},
		_ADD_LEGEND: { /* Adiciona Legendas (texto e funções)*/
			value: function(text, top) {
				if (text === null) return;
				var ref = this._MEASURES;
				var n = this._NDATA[(top ? "t" : "r")]++;
				var x = top ? ref.l : ref.r;
				var y = 4*n+ref.t;
				this._BUILD_LABEL(x+1, y+1, (top ? "" : "\u25CF ")+text, "nw", false, true);
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
		_SET_AREA: {
			value: function(type, n, xlabel, ylabel) {/* define a área do gŕafico (n = linhas)*/
				n = n === undefined ? 0 : n;
				var config = {/* configurações da área do gráfico */
					plan: {
						width: {t: 1, r: 1, b: 1, l: 1, c: 0},
						padd:  {t: 10, r: 20, b: 10, l: 15},
					},
					compare: {
						width: {t: 0, r: 0, b: 0, l: 0, c: 0},
						padd:  {t: 15, r: 20, b: 10, l: 10},
					},
				};

				/* definindo valores iniciais */
				var data       = config[type];
				this._COLOR    = -1;
				this._MEASURES = data.padd;
				this._SET_SCALE("y");
				this._SET_SCALE("x");
				var ref  = this._MEASURES;
				var dX   = ref.w/n;
				var dY   = ref.h/n;
				var grid = {x: [], y: []};

				/* construindo linhas */
				for (var i = 0; i < (n+1); i++) {
					var hRef = data.width[i === 0 ? "b" : (i === n ? "t" : "c")];
					var vRef = data.width[i === 0 ? "l" : (i === n ? "r" : "c")];
					var val = {
						h: {x1: ref.l, x2: ref.r, y1: ref.t+(i*dY), y2: ref.t+(i*dY)},
						v: {y1: ref.t, y2: ref.b, x1: ref.l+(i*dX), x2: ref.l+(i*dX)},
					}
					this._BUILD_LINE(val.h.x1, val.h.y1, val.h.x2, val.h.y2, "", hRef);
					this._BUILD_LINE(val.v.x1, val.v.y1, val.v.x2, val.v.y2, "", vRef);
					grid.x.push({x: val.v.x1, y: val.v.y2, d: dX});
					grid.y.unshift({x: val.h.x1, y: val.h.y1, d: dY});
				}

				/* construíndo título e labels */
				this._BUILD_LABEL(ref.cx, ref.t/5, this._TITLE, "n", false, true);
				this._BUILD_LABEL(ref.cx, ref.b+(100-ref.b)*3/4, xlabel, "s", false, true);
				this._BUILD_LABEL(1/4*ref.l, ref.cy, ylabel, "s", true, true);

				return grid;
			}
		},
		_COMPARE: { /* desenha um gráfico de colunas comparativo */

			value: function(xlabel, ylabel) {/*desenha gráfico comparativo de colunas*/
				/* Obtendo dados básicos */
				var data = {x: [], y: []};
				for (var i = 0; i < this._DATA.length; i++) {
					var item = this._DATA[i];
					if (item.t === "deleted" || item.t !== "compare") continue;
					for (var j = 0; j < item.x.length; j++) { /*adicionando dados*/
						data.x.push(item.x[j]);
						data.y.push(item.y[j]);
					}
				}
				if (data.x.length === 0) return null; /*se vazio, retornar*

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
				/* definindo limites */
				this._SET_ENDS("x", values.l);
				this._SET_ENDS("y", values.y);
				this._SET_ENDS("y", [0]); /*sempre exibir o ponto y = 0 */

				/* Plotando o gráfico */
				var grid = this._SET_AREA("compare", values.x.length, xlabel, ylabel); /*definindo grade do gŕafico*/
				var sum = 0; /*ponto de referência do comparativo*/

				for (var i = 0; i < values.x.length; i++) {/*construindo colunas*/
					sum += values.v[i];
					this._COLOR = i;
					var trg1 = this._TARGET(i, 0);
					var trg2 = this._TARGET(i+1, values.y[i]);
					var trg3 = this._TARGET((i + 0.5), 0);
					var pct  = this._LABEL_VALUE(values.y[i], true);
					var val  = this._LABEL_VALUE(values.v[i]);
					var ttl  = values.x[i]+": "+val+" ("+pct+")";
					var pos  = values.y[i] < 0 ? -1 : 1;
					this._BUILD_RECT(trg1.x, trg1.y, trg2.x, trg2.y, ttl);
					this._ADD_LEGEND(values.x[i]);
					/* posição: valor no eixo e porcentagem no topo/base */
					this._BUILD_LABEL(trg3.x, trg2.y-pos, pct, pos < 0 ? "n" : "s", false, true);
					this._COLOR = -1;
					this._BUILD_LABEL(trg3.x, trg3.y+pos, val, pos < 0 ? "s" : "n", false);
				}
				/*desenhando eixo zero*/
				var ref = this._MEASURES;
				var zero = this._TARGET(0,0);
				this._BUILD_LINE(ref.l, zero.y, ref.r, zero.y, "", 2);
				this._BUILD_LABEL(99, 99, "\u03A3y = "+this._LABEL_VALUE(sum), "se", false, true);

				return true;
			}
		},
		_LABEL_ANALYSIS: {
			value: function(a, b, d, e) {
				d = d === null ? "" : " \u00B1 "+this._LABEL_VALUE(d);
				a = a === null ? "" : this._LABEL_VALUE(a);
				b = b === null ? "" : this._LABEL_VALUE(b);
				return e.replace("a", a).replace("b", b)+d;
			}
		},
		add: {/* Adiciona conjunto de dados para plotagem */

			value: function(x, y, label, analysis) {
				/*verificando dados*/
				var obj1 = WDanalysis(x,y);
				var obj2 = WDcompare(x,y);
				if (obj1.e && obj2.e) return null;
				var color = this._DATA.length === 0 ? 0 : this._DATA[this._DATA.length-1].c; /*obter a última cor adicionada*/
				/*dados sem condições de análise*/
				if (!obj2.e) this._DATA.push(
					{x: obj2.x, y: obj2.y, l: null, t: "compare", c: color+1, f: false}
				);
				if (obj1.e) return true;

				/*plotar uma função*/
				if (WD(y).type === "function") {
					this._DATA.push(
						{x: obj1.x, y: y, l: label, t: "line", c: color+1, f: false}
					);
					return true;
				}
				/*plotar somente coordenadas*/
				if (!(analysis in obj1)) {
					this._DATA.push(
						{x: obj1.x, y: obj1.y, l: label, t: "dots", c: color+1, f: false}
					);
					this._DATA.push(
						{x: obj1.x, y: obj1.y, l: null, t: "line", c: color+1, f: false}
					);
					return true;
				}
				/*verificar análise*/
				var check = obj1[analysis];
				if (check === null) return null;

				/*referências*/
				var ref = {
					average:     {c1: "line", c2: "line"},
					exponential: {c1: "dots", c2: "line"},
					linear:      {c1: "dots", c2: "line"},
					geometric:   {c1: "dots", c2: "line"},
					sum:         {c1: "line", c2: "cols"},
				};
				/* plotando coordanadas*/
				this._DATA.push(
					{x: obj1.x, y: obj1.y, l: label, t: ref[analysis].c1, c: color+1, f: false}
				);
				/*plotando análise*/
				var l = this._LABEL_ANALYSIS(check.a, check.b, check.d, check.e);
				this._DATA.push(
					{x: obj1.x, y: check.f, l: l, t: ref[analysis].c2, c: color+2, f: true}
				);
				/*plotando desvio padrão*/
				if (check.d !== null) {
					var f1 = function(x) {return check.f(x)+check.d;}
					var f2 = function(x) {return check.f(x)-check.d;}
					this._DATA.push(
						{x: obj1.x, y: f1, l: null, t: "dotted", c: color+2, f: false}
					);
					this._DATA.push(
						{x: obj1.x, y: f2, l: null, t: "dotted", c: color+2, f: false}
					);
				}
				return true;
			}
		},
		clear: {

			value: function() {/*apaga todos os dados do gráfico*/
				this._CLEAR_SVG();
				for (var i = 0; i < this._DATA.length; i++)
					this._DATA[i].t = "deleted";
				return true;
			}
		},
		plot: {

			value: function(xlabel, ylabel, compare) {/*desenha gráfico plano*/
				this._CLEAR_SVG();
				if (compare === true) return this._COMPARE(xlabel, ylabel);

				/* Obtendo valores básicos para definir parâmetros dos gráficos */
				var data = [];
				for (var i = 0; i < this._DATA.length; i++) {
					var item = this._DATA[i];
					if (item.t === "deleted" || item.t === "compare") continue;
					this._SET_ENDS("x", item.x);
					if (WD(item.y).type === "array")
						this._SET_ENDS("y", item.y);
					if (item.t === "cols") /* exibir o ponto y = 0 */
						this._SET_ENDS("y", [0]);
					data.push(item);
				}
				if (data.length === 0) return null;
				this._SET_SCALE("x");

				/* definindo array y para funções */
				for (var i = 0; i < data.length; i++) {
					var item = data[i];
					if (WD(item.y).type !== "function") continue;
					var obj   = WDanalysis(item.x, item.y);
					var prec  = this._DELTA(item.t === "cols" ? 0.1 : 1); /*precisão do desenho*/
					var value = obj.continuous(prec);
					if (value === null) {/*se erro: considerar sómentos os pontos*/
						item.y = obj.y;
					} else {
						item.x = value.x;
						item.y = value.y;
					}
					/* definindo novos limites */
					this._SET_ENDS("x", item.x);
					this._SET_ENDS("y", item.y);
				}

				/* Plotagem da área e das linhas */
				var lines = 4;
				var grid  = this._SET_AREA("plan", lines, xlabel, ylabel);

				for (var i = 0; i < data.length; i++) {
					var item = data[i];
					this._COLOR = item.c;
					this._ADD_LEGEND(item.l, item.f);

					/*coordenadas*/
					for (var j = 0; j < item.x.length; j++) { /*obterndo coordenadas*/
						var title = "("+item.x[j]+", "+item.y[j]+")";
						var trg1  = this._TARGET(item.x[j], item.y[j]);
						var trg2  = this._TARGET(item.x[j+1], item.y[j+1]);
						var zero  = this._TARGET(item.x[j], 0);

						if (item.t === "dots")
							this._BUILD_DOTS(trg1.x, trg1.y, title);
						if (item.t === "dotted")
							this._BUILD_DOTS(trg1.x, trg1.y, title, 1);
						if (item.t === "line" && trg2 !== null)
							this._BUILD_LINE(trg1.x, trg1.y, trg2.x, trg2.y, title, 2);
						if (item.t === "cols" && trg2 !== null)
							this._BUILD_RECT(trg1.x, (trg2.y+trg1.y)/2, trg2.x, zero.y, title, true);
					}
				}

				/*valores dos eixos*/
				this._COLOR = - 1;
				var dX = (this._ENDS.x.max - this._ENDS.x.min) / lines;
				var dY = (this._ENDS.y.max - this._ENDS.y.min) / lines;
				for (var i = 0; i < grid.x.length; i++) {
					var x  = this._LABEL_VALUE(this._ENDS.x.min + i*dX);
					var y  = this._LABEL_VALUE(this._ENDS.y.min + i*dY);
					var px = i === 0 ? "nw" : (i === lines ? "ne" : "n");
					var py = i === 0 ? "se" : (i === lines ? "ne" : "e");
					this._BUILD_LABEL(grid.x[i].x, grid.x[i].y+1, x, px);
					this._BUILD_LABEL(grid.y[i].x-1, grid.y[i].y, y, py);
				}
				return true;
			}
		},
	});





























































































































































































































/*==================================================================================================================*/





	function WDdataSet() { /*WDstatistics, WDanalysis e WDcompare vão herdar esse objeto*/
		if (!(this instanceof WDdataSet)) return new WDdataSet();
	}

	Object.defineProperties(WDdataSet.prototype, {
		constructor: {value: WDdataSet},
		_SET_FINITE: { /* itens não finitos se tornam null no array */
			value: function(x) {
				var data = [];
				for (var i = 0; i < x.length; i++) {
					var obj = WD(x[i]);
					var val = WD(obj.valueOf());
					var tps = ["number", "time", "date"];
					data.push(val.finite && tps.indexOf(obj.type) >= 0 ? val.valueOf() : null);
				}
				return data;
			}
		},
		_SUM: {/*soma listas e aplica operações matemáticas entre elas (até 2)*/
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
		_PRODUCT: {
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
		_DEVIATION: {/*calcula devios genéricos*/
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
		_STD_DEV: {/*Calcula o desvio padrão*/
			value: function(list, ref) {
				var data = this._DEVIATION(list, ref, 2);
				return data ===  null ? data : Math.sqrt(data/list.length);
			}
		},
		_LEAST_SQUARES: {/*Método dos mínimos quadrados*/
			value: function(x, y) {
				var X  = this._SUM(x, 1);
				var Y  = this._SUM(y, 1);
				var X2 = this._SUM(x, 2);
				var XY = this._SUM(x, 1, y, 1);
				if ([X, Y, XY, X2].indexOf(null) >= 0) return null;
				var N    = y.length;
				var data = {};
				data.a   = ((N * XY) - (X * Y)) / ((N * X2) - (X * X));
				data.b   = ((Y) - (X * data.a)) / (N);
				return data;
			}
		},
		_ADJUST_LISTS: {/*retorna as listas em pares de informações não nulas*/
			value: function(x, y) {
				var loop = x.length > y.length ? y.length : x.length;
				var list = {x: [], y: [], length: 0};
				for (var i = 0; i < loop; i++) {
					if (x[i] === null || y[i] === null) continue;
					list.x.push(x[i]);
					list.y.push(y[i]);
					list.length++;
				}
				return list;
			}
		},
		_GET_F_RETURN: {/*define uma lista aplicando uma função sobre outra lista*/
			value: function(x, f) {
				var data = [];
				for (var i = 0; i < x.length; i++) {
					try {var val = f(x[i]);} catch(e) {var val = null;}
					data.push(WD(val).finite ? val : null);
				}
				return data;
			}
		},

	});

/*............................................................................*/

	function WDstatistics(x) { /*retorna dados estatístico de 1 array*/
		if (!(this instanceof WDstatistics)) return new WDstatistics(x);
		WDdataSet.call(this);
		if (WD(x).type !== "array") x = [];
		var val = WD(WD(this._SET_FINITE(x)).sort()).del(null);/*ordena e elimina os nulos*/
		Object.defineProperties(this, {
			x: {value: val}, /*array numérico sem nulos*/
			l: {value: val.length}, /*comprimento array sem nulos*/
			e: {value: val.length < 1 ? true : false} /*erro*/
		});
	}

	WDstatistics.prototype = Object.create(WDdataSet.prototype, {/*herança*/
			constructor: {value: WDstatistics}
	});

	Object.defineProperties(WDstatistics.prototype, {/*-- Estatística --*/
		sum: {/*soma*/
			get: function() {
				return this.e ? null : this._SUM(this.x, 1);
			}
		},
		min: {/*menor valor*/
			get: function() {
				return this.e ? null : this.x[0];
			}
		},
		max: {/*maior valor*/
			get: function() {
				return this.e ? null : this.x[this.l-1];
			}
		},
		average: {/*média*/
			get: function() {
				return this.e ? null : this.sum/this.l;
			}
		},
		median: {/*mediana*/
			get: function() {
				if (this.e) return null;
				var a = this.x;
				var l = this.l;
				return l%2 === 0 ? (a[l/2]+a[(l/2)-1])/2 : a[(l-1)/2];
			}
		},
		geometric: {/*média geométrica*/
			get: function() {
				if (this.e) return null;
				return Math.pow(Math.abs(this._PRODUCT(this.x, 1)), 1/this.l);
			}
		},
		harmonic: {/*média harmônica*/
			get: function() {
				if (this.e) return null;
				var harm = this._SUM(this.x, -1);
				return (harm === 0 || harm === null) ? null : this.l/harm;
			}
		},
		deviation: {/* retorna o desvio padrão */
			value: function(method) {
				if (!(method in this)) return null;
				var val = this[method];
				return val === null ? null : this._STD_DEV(this.x, val);
			}
		}
	});

/*............................................................................*/

	function WDanalysis(x, y) {/*retorna a análise de dados entre 2 arrays*/
		if (!(this instanceof WDanalysis)) return new WDanalysis(x, y);
		WDdataSet.call(this);
		var f = WD(y).type === "function" ? y : null;
		if (WD(x).type !== "array") x = [];
		if (WD(y).type !== "array") y = [];
		x = this._SET_FINITE(x);
		if (f !== null) y = this._GET_F_RETURN(x, f); /*carregando f(x) em y*/
		y = this._SET_FINITE(y);
		var val  = this._ADJUST_LISTS(x, y);
		var ends = WDstatistics(val.x);
		var diff = ends.e ? 0 : ends.max - ends.min;
		Object.defineProperties(this, {
			x: {value: val.x},
			y: {value: val.y},
			f: {value: f},
			l: {value: val.length},
			e: {value: (val.length < 2 || diff === 0) ? true : false}
		});
	}

	WDanalysis.prototype = Object.create(WDdataSet.prototype, {/*herança*/
			constructor: {value: WDanalysis}
	});

	Object.defineProperties(WDanalysis.prototype, {/*-- Regressões --*/
		_REG_DEV: { /*atalho para o desvio padrão deste objeto*/
			value: function(f) {
				var y1  = this.y;
				var y2  = this._GET_F_RETURN(this.x, f);
				var val = this._ADJUST_LISTS(y1, y2);
				return this._STD_DEV(val.x, val.y);
			}
		},
		linear: {/*regressão linear*/
			get: function() {
				if (this.e) return null;
				var val = this._LEAST_SQUARES(this.x, this.y);
				if (val === null) return null;
				var data = {
					e: "y = (a)x+(b)",
					a: val.a,
					b: val.b,
				};
				data.f = function(x) {return data.a*x + data.b;};
				data.d = this._REG_DEV(data.f);
				return data;
			}
		},
		exponential: {/*regressão exponencial*/
			get: function() {
				if (this.e) return null;
				/*pontos para a regressão (ajustando Y para equação linear)*/
				var y    = this._GET_F_RETURN(this.y, Math.log);
				var axes = this._ADJUST_LISTS(this.x, this._SET_FINITE(y));
				if (axes.length < 2) return null; /*tem que ter pelo menos 2 pontos*/
				/*regressão*/
				var val = this._LEAST_SQUARES(axes.x, axes.y);
				if (val === null) return null;
				var data = {
					e: "y = (a)\u212F^(bx)",
					a: Math.exp(val.b),
					b: val.a,
				};
				data.f = function(x) {return data.a*Math.exp(data.b*x);};		
				data.d = this._REG_DEV(data.f);
				return data;
			}
		},
		geometric: {/*regressão geométrica*/
			get: function() {
				if (this.e) return null;
				/*pontos para a regressão (ajustando X/Y para equação linear)*/
				var x    = this._GET_F_RETURN(this.x, Math.log);
				var y    = this._GET_F_RETURN(this.y, Math.log);
				var axes = this._ADJUST_LISTS(this._SET_FINITE(x), this._SET_FINITE(y));
				if (axes.length < 2) return null; /*tem que ter pelo menos 2 pontos*/
				/*regressão*/
				var val = this._LEAST_SQUARES(axes.x, axes.y);
				if (val === null) return null;
				var data = {
					e: "y = (a)x^(b)",
					a: Math.exp(val.b),
					b: val.a,
				};
				data.f = function(x) {return data.a*Math.pow(x, data.b);};
				data.d = this._REG_DEV(data.f);
				return data;
			}
		},
		sum: {
			get: function() {
				if (this.e) return null;
				var int = 0;
				/* -- integral ax+b = (yf+yi)(xf-xi)/2 -- */
				for (var i = 0; i < (this.l - 1); i++)
					int += (this.y[i+1]+this.y[i])*(this.x[i+1]-this.x[i])/2;

				var data = {
					e: "\u03A3y\u0394x \u2248 b",
					a: 0,
					b: int,
				};
				var ref = {x: this.x, y: this.y}
				data.f = function(x) { /*retorna y(x) considerando cada coordenada como um seguimento de reta*/
					var c = ref;
					var i = 0;
					var n = null;
					while (n === null && ++i !== c.x.length)
						if (x <= c.x[i]) n = i;
					if (n === null) n = c.x.length-1;
					var line = WDanalysis([c.x[n-1],c.x[n]], [c.y[n-1],c.y[n]]);
					return line.linear.f(x);
				};
				data.d = null;
				return data;
			}
		},
		average: {/*calcula a média da variação*/
			get: function() {
				if (this.e) return null;
				var int = this.sum.b;
				var end = new WDstatistics(this.x);
				var avg = int / (end.max - end.min);
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
		continuous: { /* define coordenadas (x,y) a partir de um intervalos de x (delta)*/
			value: function(delta, method) {
				if (this.e) return null;
				if (!WD(delta).finite) return null;

				/* define a função: informada ou de análise (methods) */
				var func    = this.f; /* função informada */
				var obj     = {};     /*objeto vazio (sem utilizade para função informada)*/
				var methods = ["linear", "exponential", "geometric", "sum", "average"];
				if (methods.indexOf(method) >= 0) { /*função de análise*/
					obj  = this[method];
					func = obj === null ? null : obj.f;
				}
				if (func === null) return null;

				/* parâmetros para definir os intervalos */
				delta    = WD(delta).abs;
				var end  = WDstatistics(this.x);
				var min  = end.min; /* valor irá variar no looping while */
				var max  = end.max;
				var data = {x: [], y: [], o: obj};

				while (delta > 0) { /*definindo intervalos*/
					if (min >= max) { /*ponto de parada do looping*/
						min   = max;
						delta = 0;
					}
					var val = func(min);
					if (WD(val).finite) { /* definindo pontos se y for finito */
						data.x.push(min);
						data.y.push(val);
					}
					min += delta;
				}
				return data;
			}
		},

	});

/*............................................................................*/

	function WDcompare(x, y) {/*retorna valores que comparam dados*/
		if (!(this instanceof WDcompare)) return new WDcompare(x, y);
		WDdataSet.call(this);
		if (WD(x).type !== "array") x = [];
		if (WD(y).type !== "array") y = [];

		/*acertando dados, excluindo nulos*/
		y = this._SET_FINITE(y);
		for (var i = 0; i < y.length; i++) {
			if (x[i] === undefined) x.push(null);
			var txt = WD(x[i]).toString();
			x[i] = y[i] === null ? null : (txt === "" ? "#" : txt);
		}
		x = WD(x).del(null);
		y = WD(y).del(null);

		/*obtendo objeto com informações agrupadas*/
		var obj = {};
		for (var i = 0; i < x.length; i++) {
			if (!(x[i] in obj)) obj[x[i]] = [];
			obj[x[i]].push(y[i]);
		}

		Object.defineProperties(this, {
			o: {value: obj},
			x: {value: x},
			y: {value: y},
			e: {value: (x.length < 1 || x.length !== y.length) ? true : false}
		});
	}

	WDcompare.prototype = Object.create(WDdataSet.prototype, { /*Herança*/
			constructor: {value: WDcompare}
	});

	Object.defineProperties(WDcompare.prototype, {/*-- Comparação de dados --*/
		occurrences: {/*quantidade de ocorrências de cada item*/
			get: function() {
				if (this.e) return null;
				var data = {};
				for (var i in this.o) data[i] = this.o[i].length;
				return data;
			}
		},
		amount: {/*quantidade de cada item (soma o valor de itens iguais)*/
			get: function() {
				if (this.e) return null;
				var data = {};
				for (var i in this.o) {
					data[i] = 0;
					for (var j = 0; j < this.o[i].length; j++)
						data[i] += this.o[i][j]
				}
				return data;
			}
		},
		sum: {/*retorna a quantidade total*/
			get: function() {
				if (this.e) return null;
				var sum  = 0;
				var data = this.amount;
				for (var i in data) sum += data[i];
				return sum;
			}
		},
		ratio: {/*porcentagem da quantidade*/
			get: function() {
				if (this.e) return null;
				if (sum === 0) return null; /* divisão por zero*/
				var sum  = this.sum;
				var amnt = this.amount;
				var data = {};
				for (var i in amnt) data[i] = amnt[i]/sum;
				return data;
			}
		},
		average: {/*média de cada item*/
			get: function() {
				if (this.e) return null;
				var occu = this.occurrences;
				var amnt = this.amount;
				var data = {};
				for (var i in amnt) data[i] = amnt[i]/occu[i];
				return data;
			}
		},
	});

