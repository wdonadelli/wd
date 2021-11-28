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

