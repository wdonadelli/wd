var WD = wd;

function WDdataSet(x) {
	if (!(this instanceof WDdataSet)) return new WDdataSet(x);
	if (WD(x).type !== "array") x = [];
	for (var i = 0; i < x.length; i++) {
		var val = WD(x[i]);
		x[i] = val.finite ? val.valueOf() : null;
	}

	Object.defineProperties(this, {
		x: {value: x}, /*array com conteúdo não finitos anulados*/
		a: {value: WD(x).del(null)}, /*array somente com números finitos*/
	});
}

Object.defineProperty(WDdataSet.prototype, "constructor", {value: WDdataSet});

Object.defineProperties(WDdataSet.prototype, {
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

});























Object.defineProperties(WDdataSet.prototype, {
	sum: {/*soma*/
		get: function() {
			if (this.a.length === 0) return null;
			return this.SUM(this.a, 1);
		}
	},
	min: {/*menor valor*/
		get: function() {
			if (this.a.length === 0) return null;
			return WD(this.a).sort()[0];
		}
	},
	max: {/*maior valor*/
		get: function() {
			if (this.a.length === 0) return null;
			return WD(this.a).sort().reverse()[0];
		}
	},
	average: {/*média*/
		get: function() {
			if (this.a.length === 0) return null;
			return this.sum/this.a.length;
		}
	},
	median: {/*mediana*/
		get: function() {
			if (this.a.length === 0) return null;
			var a = WD(this.a).sort();
			var l = a.length;
			return (l % 2 === 0) ? (a[l/2]+a[(l/2)-1])/2 : a[(l-1)/2];
		}
	},
	geometric: {/*média geométrica*/
		get: function() {
			if (this.a.length === 0) return null;
			var v = this.PRODUCT(this.a, 1);
			var l = this.a.length;
			return v === null ? null : Math.pow(Math.abs(v), 1/l);
		}
	},
	harmonic: {/*média harmônica*/
		get: function() {
			if (this.a.length === 0) return null;
			var v = this.SUM(this.a, -1);
			var l = this.a.length;
			return v === null ? null : l/v;
		}
	},
































	deviation: {/*desvio padrão*/
		value: function(ref) {
			if (this.a.length === 0) return null;
			/*valores numéricos*/
			var lnum = ["sum", "min", "max", "average", "median", "geometric", "harmonic"];
			if (lnum.indexOf(ref) >= 0) {
				var val = this[ref];
				return val === null ? null : this.STDDEV(this.a, val);
			}
			return null;
		}
	}
});
