var WD = wd;

function WDdataSet(x) {
	if (!(this instanceof WDdataSet)) return new WDdataSet(x);
	if (WD(x).type !== "array") x = [];
	var val = this.CHECKFINITE(x)
	Object.defineProperties(this, {
		x: {value: val}, /*array com conteúdo não finitos anulados*/
		a: {value: WD(val).del(null)}, /*array somente com números finitos*/
	});
}

Object.defineProperty(WDdataSet.prototype, "constructor", {value: WDdataSet});

Object.defineProperties(WDdataSet.prototype, {
	CHECKFINITE: {
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
	STDDEV: {/*Calcula o desvio padrão*/
		value: function(list, ref) {
			var data = this.DEVIATION(list, ref, 2);
			return data ===  null ? data : Math.sqrt(data/list.length);
		}
	},
	LEASTSQUARES: {/*Método dos mínimos quadrados*/
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
	SETY: {/*define uma lista a partir da aplicação de uma função sobre os valores de outra lista*/
		value: function(x, f) {
			var data = [];
			for (var i = 0; i < x.length; i++) data.push(f(x[i]));
			return data;
		}
	},

});























Object.defineProperties(WDdataSet.prototype, {
	sum: {/*soma*/
		get: function() {
			if (this.a.length === 0) return null;
			var data = {value: this.SUM(this.a, 1)};
			data.delta = this.STDDEV(this.a, data.value);
			return data;
		}
	},
	min: {/*menor valor*/
		get: function() {
			if (this.a.length === 0) return null;
			var data = {value: WD(this.a).sort()[0]};
			data.delta = this.STDDEV(this.a, data.value);
			return data;
		}
	},
	max: {/*maior valor*/
		get: function() {
			if (this.a.length === 0) return null;
			var data = {value: WD(this.a).sort().reverse()[0]};
			data.delta = this.STDDEV(this.a, data.value);
			return data;
		}
	},
	average: {/*média*/
		get: function() {
			if (this.a.length === 0) return null;
			var data = {value: this.sum.value/this.a.length};
			data.delta = this.STDDEV(this.a, data.value);
			return data;
		}
	},
	median: {/*mediana*/
		get: function() {
			if (this.a.length === 0) return null;
			var a = WD(this.a).sort();
			var l = a.length;
			var data = {value: (l % 2 === 0) ? (a[l/2]+a[(l/2)-1])/2 : a[(l-1)/2]};
			data.delta = this.STDDEV(this.a, data.value);
			return data;
		}
	},
	geometric: {/*média geométrica*/
		get: function() {
			if (this.a.length === 0) return null;
			var v = this.PRODUCT(this.a, 1);
			var l = this.a.length;
			var data = {value: v === null ? null : Math.pow(Math.abs(v), 1/l)};
			data.delta = v === null ? null : this.STDDEV(this.a, data.value);
			return data;
		}
	},
	harmonic: {/*média harmônica*/
		get: function() {
			if (this.a.length === 0) return null;
			var v = this.SUM(this.a, -1);
			var l = this.a.length;
			var data = {value: v === null ? null : l/v};
			data.delta = v === null ? null : this.STDDEV(this.a, data.value);
			return data;
		}
	},
	linearRegression: {/*regressão linear*/
		value: function(y) {
			/*conjunto x,y*/
			var axes = this.ADJUST_LISTS(this.x, this.CHECKFINITE(y));
			if (axes.length === 0) return null;
			/*regressão*/
			var val = this.LEASTSQUARES(axes.list1, axes.list2);
			if (val === null) return null;
			var data = {
				e: "y(x) = a.x+b",
				a: val.a,
				b: val.b,
				x: axes.list1,
				y: axes.list2,
			};
			data.f = function(x) {return data.a*x + data.b;}
			var diff = this.ADJUST_LISTS(data.y, this.SETY(data.x, data.f));
			data.d = this.STDDEV(diff.list1, diff.list2);
			var cal = this.CONTINUOUS;
			data.c = function(min, max, delta) {return cal(data.f, min, max, delta);};
			return data;
		}
	},
	exponentialRegression: {/*regressão exponencial*/
		value: function(y) {
			/*conjunto x,y*/
			var axes = this.ADJUST_LISTS(this.x, this.CHECKFINITE(y));
			if (axes.length === 0) return null;
			/*pontos para a regressão (ajustando Y para equação linear)*/
			var axes2 = this.ADJUST_LISTS(
				axes.list1,
				this.CHECKFINITE(this.SETY(axes.list2, Math.log))
			);
			if (axes2.length === 0) return null;
			/*regressão*/
			var val = this.LEASTSQUARES(axes2.list1, axes2.list2);
			if (val === null) return null;
			var data = {
				e: "y(x) = a.exp(b.x)",
				a: Math.exp(val.b),
				b: val.a,
				x: axes.list1,
				y: axes.list2,
			};
			data.f = function(x) {return data.a*Math.exp(data.b*x);}			
			var diff = this.ADJUST_LISTS(data.y, this.SETY(data.x, data.f));
			data.d = this.STDDEV(diff.list1, diff.list2);
			return data;
		}
	},
	geometricRegression: {/*regressão geométrica*/
		value: function(y) {
			/*conjunto x,y*/
			var axes = this.ADJUST_LISTS(this.x, this.CHECKFINITE(y));
			if (axes.length === 0) return null;
			/*pontos para a regressão (ajustando Y para equação linear)*/
			var axes2 = this.ADJUST_LISTS(
				this.CHECKFINITE(this.SETY(axes.list1, Math.log)),
				this.CHECKFINITE(this.SETY(axes.list2, Math.log))
			);
			if (axes2.length === 0) return null;
			/*regressão*/
			var val = this.LEASTSQUARES(axes2.list1, axes2.list2);
			if (val === null) return null;
			var data = {
				e: "y(x) = y = a.x**b",
				a: Math.exp(val.b),
				b: val.a,
				x: axes.list1,
				y: axes.list2,
			};
			data.f = function(x) {return data.a*Math.pow(x, data.b);}

			//FIXME tudo isso pode ficar numa fórmula só, acho
			var diff = this.ADJUST_LISTS(data.y, this.SETY(data.x, data.f));
			data.d = this.STDDEV(diff.list1, diff.list2);
			data.c = function(delta) {
				return this.CONTINUOUS(data.f, data.x[0], data.x[data.x.length-1], delta);
			};
			data.i = function(delta) {
				var val = data.c(delta);
				return this.INTEGRAL(val.x, val.y);
			}
			return data;
		}
	},
	continuous: {
		value: function(func, delta) {
			if (!WD(delta).finite || WD(func).type !== "function") return null;
			var min = this.min.value;
			var max = this.max.value;
			delta   = new Number(delta).valueOf();
			if (min >= max || delta <= 0) return null;

			var data  = {x: [], y: []};
			while (delta > 0) {
				if (min >= max) {
					min = max;
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
	integral: {
		value: function(y) {
			if (WD(y).type !== "array") return null;
			var axes = this.ADJUST_LISTS(this.x, this.CHECKFINITE(y));
			if (axes.length === 0) return null;
			var int = 0;
			for (var i = 0; i < (axes.length - 1); i++) {
				var fi = {x: axes.list1[i],   y: axes.list2[i]};
				var fn = {x: axes.list1[i+1], y: axes.list2[i+1]};
				console.log((fn.y + fi.y)*(fn.x - fi.x)/2);
				int += (fn.y + fi.y)*(fn.x - fi.x)/2;
			}
			return int;
		}
	},



















});
