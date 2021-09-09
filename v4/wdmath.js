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
	var val = WD(this.SET_FINITE(a)).del(null);
	Object.defineProperties(this, {
		a: {value: val},
		l: {value: val.length}
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
	linear: {/*regressão linear*/
		get: function() {
			if (this.l === 0) return null;
			var val = this.LEAST_SQUARES(this.x, this.y);
			if (val === null) return null;
			var data = {
				e: "y(x) = a.x+b",
				a: val.a,
				b: val.b,
				f: function(x) {return this.a*x + this.b;},
			};
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
				f: function(x) {return this.a*Math.exp(this.b*x);}			
			};
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
				f: function(x) {return this.a*Math.pow(x, this.b);}
			};





			/*FIXME tudo isso pode ficar numa fórmula só, acho
			var diff = this.ADJUST_LISTS(data.y, this.SET_Y(data.x, data.f));
			data.d = this.STD_DEV(diff.list1, diff.list2);
			data.c = function(delta) {
				return this.CONTINUOUS(data.f, data.x[0], data.x[data.x.length-1], delta);
			};
			data.i = function(delta) {
				var val = data.c(delta);
				return this.INTEGRAL(val.x, val.y);
			}*/
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



















});
