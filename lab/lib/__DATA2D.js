/**
#3 Análise Quantitativa
O objeto '{__DATA2D} apresenta ferramentas para análise de conjunto de dados finitos em duas dimensões.
**/
/*
	''constructor object __Data2D(array x, any y)''
	Análise de dados em duas dimensões.
	O argumento '{x} corresponde a uma lista de valores (array) de referência que aceita valores finitos e de data/tempo, conforme regras da biblioteca.
	O argumento '{y} é a resposta em função de '{x}, podendo ser uma lista de valores do mesmo tipo que '{x}, uma constante ou uma função. No caso de função, '{y} receberá o valor de '{y(x)}.
	Valores não finitos serão eliminados do conjunto '{(x, y)}.*/
const __DATA2D = {
	/**. '{number toFinite(any value)}: Retorna a conversão de '{value} para número finito ou nulo.**/
	toFinite: function(value) {
		const data = new __Type(value);
		if (data.finite)
			return data.valueOf();
		if (data.date || data.time || data.datetime)
			return new __DateTime(data.value).valueOf();
		return null;
		//FIXME colocar year month e day dentro do objeto que trata da data para valueOf retornar os dias ou segundos
	},
	/**. '{array map(array data, function call}: Aplica a função '{call} aos itens de '{data}, ou nulo, e retorna a lista.**/
	map: function(data, call) {
		return data.map(function(v,i,a) {
			try      {return call(v);}
			catch(e) {return null;}
		}, this);
	},
	/**. '{array filter(array x, array y)}: Retorna o array '{[x, y]} apenas com o conjunto que possue números finitos.**/
	filter: function(x, y) {
		const min  = Math.min(x.length, y.length);
		const data = [[], []];
		for (let i = 0; i < min; i++) {
			if (Number.isFinite(x[i]) && Number.isFinite(y[i])) {
				data[0].push(x[i]);
				data[1].push(y[i]);
			}
		}
		return data;
	},
	/**. '{array sort(array x, array y)}: Retorna uma lista de objetos contendo os valores de '{x} e '{y} ajustados e ordenados.**/
	sort: function(x, y) {
		if (!Array.isArray(x) || !Array.isArray(y)) return null;
		const data = this.filter(this.map(x, this.toFinite), this.map(y, this.toFinite));
		const list = data[0].map(function(v,i,a) {
			return {x: v, y: data[1][i]};
		});
		return list.sort(function(a,b) {
			return a.x === b.x ? 0 : (a.x < b.x ? -1 : 1);
		});
	},
	/**. '{object ols(array x, array y)}: Retorna os coeficientes angular e linear pelo "método dos mínimos quadrados" ou nulo.**/
	ols: function(x, y) {
		const list = this.sort(x, y);
		if (list === null || list.length < 2) return null;
		const len  = list.length;
		let sumX  = 0;
		let sumY  = 0;
		let sumX2 = 0;
		let sumXY = 0;
		list.forEach(function(v,i,a) {
			sumX  += v.x;
			sumY  += v.y;
			sumX2 += v.x * v.x;
			sumXY += v.x * v.y;
		});
		const data = {};
		data.a = ((len * sumXY) - (sumX * sumY)) / ((len * sumX2) - (sumX * sumX));
		data.b = ((sumY) - (sumX * data.a)) / (len);
		return data;
	},
	/**. '{number rmse(array x, array y)}: Retorna raiz do erro quadrático médio entre o conjunto de dados ou nulo.**/
	rmse: function(x, y) {
		const list = this.sort(x, y);
		if (list === null || list.length < 2) return null;
		const data = list.map(function(v,i,a) {return v.x - v.y;});
		return Math.hypot.apply(null, data) / Math.sqrt(data.length);
	},











};



function __Data2D(x, y) {
		if (!(this instanceof __Data2D)) return new __Data2D(x, y);
		const xtest = __Type(x);
		const ytest = __Type(y);
		function dataArray(n) {
			const check = __Type(n);
			if (check.finite)
				return check.value;
			if (check.date || check.time || check.datetime)
				return new __DateTime(n).valueOf();
			return null;
		}

		/*-- avaliando X --*/
		x = __Array(xtest.array ? x : []).convert(dataArray, "finite");
		/*-- avaliando Y --*/
		if (ytest.array)
			y = __Array(y).convert(dataArray, "finite");
		else if (ytest.finite)
			y = __Array(x).convert(function(n) {return ytest.value;}, "finite");
		else if (ytest.date || ytest.time || ytest.datetime)
			y = __Array(x).convert(function(n) {return new __DateTime(y).valueOf();}, "finite");
		else if (ytest.function)
			y = __Array(x).convert(y, "finite");
		else
			y = [];

		/*-- igualando conjunto --*/
		const less = y.length < x.length ? y : x;
		const data = [];
		for (let i = 0; i < less.length; i++) {
			if (x[i] !== null && y[i] !== null)
				data.push({x: x[i], y: y[i]});
		}
		/*-- ordenando em x --*/
		data.sort(function(a,b) {
			return a.x === b.x ? 0 : (a.x < b.x ? -1 : 1);
		});

		/*-- retornando valores --*/
		const sortx = [];
		const sorty = [];
		for (let i = 0; i < data.length; i++) {
			sortx.push(data[i].x);
			sorty.push(data[i].y);
		}
		Object.defineProperties(this, {
			/**. '{array x}: Registra os valores do argumento '{x} ajustado.**/
			x: {value: sortx},
			/**. '{array y}: Retorna os valores do argumento '{y} ajustado.**/
			y: {value: sorty},
			/**. '{boolean error}: Se o conjunto tiver menos que um par de valores, retornará verdadeiro.**/
			error: {value: sortx.length < 2 || sorty.length < 2}
		});
	}

	Object.defineProperties(__Data2D.prototype, {
		constructor: {value: __Data2D},


		/**. '{object linearFit}: Retorna um objeto contendo os dados da regressão linear ou '{null} em caso de erro.
		. O objeto retornado possui as chaves '{t} (tipo/nome da regressão); '{a} e '{b} (coeficientes da regressão); '{f} (função da regressão); '{d}: (desvio padrão), '{m} (representação visual da regressão); e '{s} (igual a '{m} mas exibindo os coeficientes).**/
		linearFit: {
			get: function() {
				if (this.error) return null;
				if ("_linearFit" in this) return this._linearFit;
				const X    = new __Array(this.x);
				const Y    = new __Array(this.y);
				const sqrs = this.leastSquares;
				const fit  = {};
				fit.a = sqrs.a;
				fit.b = sqrs.b;
				fit.f = function(x) {return fit.a*x + fit.b;}
				fit.d = new __Data2D(this.y, X.convert(fit.f, "finite")).standardDeviation;
				fit.m = "y = a x + (b) ± σ";
				fit.s = fit.m.toString()
				const cte = {a: "a", b: "b", d: "σ"};
				for (let k in cte) fit.s = fit.s.replace(cte[k], fit[k]);
				this._linearFit = fit;
				return fit;
			}
		},
		/**. '{object geometricFit}: Retorna um objeto contendo os dados da regressão geométrica ou '{null} em caso de erro.
		. O objeto retornado possui as mesmas caractrísticas de '{linearFit}. **/
		geometricFit: {
			get: function() {
				if (this.error) return null;
				if ("_geometricFit" in this) return this._geometricFit;
				const X    = new __Array(this.x);
				const Y    = new __Array(this.y);
				const data = new __Data2D(
					X.convert(Math.log, "finite"),
					Y.convert(Math.log, "finite")
				);
				if (data.error) {
					this._geometricFit = null;
					return null;
				}
				const sqrs = data.leastSquares;
				const fit  = {};
				fit.a = Math.exp(sqrs.b);
				fit.b = sqrs.a;
				fit.f = function(x) {return fit.a*Math.pow(x, fit.b);}
				fit.d = __Data2D(this.y, X.convert(fit.f, "finite")).standardDeviation;
				fit.m = "y = a x^(b) ± σ";
				fit.s = fit.m.toString();
				const cte = {a: "a", b: "b", d: "σ"};
				for (let k in cte) fit.s = fit.s.replace(cte[k], fit[k]);
				this._geometricFit = fit;
				return fit;
			}
		},
		/**. '{object exponentialFit}: Retorna um objeto contendo os dados da regressão exponencial ou '{null} em caso de erro.
		. O objeto retornado possui as mesmas caractrísticas de '{linearFit}. **/
		exponentialFit: {
			get: function() {
				if (this.error) return null;
				if ("_exponentialFit" in this) return this._exponentialFit;
				const X    = new __Array(this.x);
				const Y    = new __Array(this.y);
				const data = new __Data2D(this.x, Y.convert(Math.log, "finite"));
				if (data.error) {
					this._exponentialFit = null;
					return null;
				}
				const sqrs = data.leastSquares;
				const fit  = {};
				fit.a = Math.exp(sqrs.b);
				fit.b = sqrs.a;
				fit.f = function(x) {return fit.a*Math.exp(fit.b*x);}
				fit.d = __Data2D(this.y, X.convert(fit.f, "finite")).standardDeviation;
				fit.m = "y = a exp(b x) ± σ";
				fit.s = fit.m.toString();
				const cte = {a: "a", b: "b", d: "σ"};
				for (let k in cte) fit.s = fit.s.replace(cte[k], fit[k]);
				this._exponentialFit = fit;
				return fit;
			}
		},
		/**. '{object logarithmicFit}: Retorna um objeto contendo os dados da regressão logarítmica ou '{null} em caso de erro.
		. O objeto retornado possui as mesmas caractrísticas de '{linearFit}.**/
		logarithmicFit: {
			get: function() {
				if (this.error) return null;
				if ("_logarithmicFit" in this) return this._logarithmicFit;
				const X    = new __Array(this.x);
				const Y    = new __Array(this.y);
				const data = new __Data2D(this.x, Y.convert(Math.exp, "finite")
				);
				if (data.geometricFit === null) {
					this._logarithmicFit = null;
					return null;
				}
				const sqrs = data.geometricFit;
				const fit  = {};
				fit.a = sqrs.b;
				fit.b = Math.pow(sqrs.a, 1/sqrs.b);
				fit.f = function(x) {return fit.a*Math.log(fit.b*x);}
				fit.d = __Data2D(this.y, X.convert(fit.f)).standardDeviation;
				fit.m = "y = a ln(b x) ± σ";
				fit.s = fit.m.toString();
				const cte = {a: "a", b: "b", d: "σ"};
				for (let k in cte) fit.s = fit.s.replace(cte[k], fit[k]);
				this._logarithmicFit = fit;
				return fit;
			}
		},
		/**. '{object minDeviation}: Retorna o objeto contendo os dados da regressão com o menor valor de desvio padrão.**/
		minDeviation: {
			get: function() {
				if (this.error) return null;
				if ("_minDeviation" in this) return this._minDeviation;
				const fit  = ["linear", "geometric", "exponential", "logarithmic"];
				const best = {value: Infinity, name: null};
				for (let i = 0; i < fit.length; i++) {
					let id = fit[i]+"Fit";
					if (this[id] !== null && this[id].d < best.value) {
						 best.value = this[id].d;
						 best.name  = id;
						 if (best.value === 0) break;
					}
				}
				this._minDeviation = best.name === null ? null : this[best.name];
				return this._minDeviation;
			}
		},
		/**. '{number area}: Retorna a soma da área entre a reta que liga as coordenadas e o eixo '{y} em zero ou '{null} em caso de falha.**/
		area: {
    	get: function() {
	    	if (this.error) return null;
				if ("_area" in this) return this._area;
				const x  = this.x;
				const y  = this.y;
				let area = 0;
				for (let i = 1; i < x.length; i++)
					area += (y[i]+y[i-1])*(x[i]-x[i-1])/2;
				this._area = area;
				return this._area;
		  }
    },
    /**. '{number average}: Retorna a média do valor obtido com o atributo '{area} ou '{null} em caso de falha.**/
    average: {
    	get: function() {
    		if (this.area === null) return null;
    		if ("_average" in this) return this._average;
    		const data = new __Array(this.x);
    		const div  = data.max - data.min;
    		this._average = div === 0 ? null : this.area / div;
    		return this._average;
    	}
    },
	});