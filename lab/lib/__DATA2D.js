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
	/**. '{number toFinite(any value)}: Retorna a conversão de '{value} para finito, dias ou segundos ou nulo:
	|Tipo|Origem|
	|Numérico|finite|
	|Dias|date|
	|Segundos|time e datetime|**/
	toFinite: function(value) {
		const data = new __Type(value);
		return data.finite || data.date || data.time || data.datetime ? data.valueOf() : null;
	},
	/**. '{array map(array list, function call}: Aplica a função '{call} ou define nulo aos itens de '{list} e a retorna.**/
	map: function(list, call) {
		return list.map(function(v,i,a) {
			try      {return this.toFinite(call(v));}
			catch(e) {return null;}
		}, this);
	},
	/**. '{array toData(array x, any y}: Retorna uma lista ordenada do conjunto de dados numéricos finitos estabelecidos pelos argumentos '{x} e '{y}. O argumento '{y} pode ser um array, uma função ou uma constante.**/
	toData: function(x, y) {
		/*-- análise de x --*/
		x = Array.isArray(x) ? this.map(x, function(i) {return i;}) : [];
		/*-- análise de y --*/
		if (Array.isArray(y))
			y = this.map(y, function(i) {return i;});
		else if (typeof y === "function")
			y = this.map(x, y);
		else
			y = this.map(x, function(i) {return y;});
		//console.log(x,y)
		/*-- retornando conjunto de dados --*/
		return x.map(function(v,i,a) {
			return {x: v, y: i < y.length ? y[i] : null};
		})
		.filter(function(v,i,a) {
			return v.x !== null && v.y !== null;
		})
		.sort(function(a,b) {
			return a.x === b.x ? 0 : (a.x < b.x ? -1 : 1);
		});
	},
	/**. '{object toList(object list)}: Retorna a lista dos conjuntos '{x} e '{y} provenientes do método '{toData}.**/
	toList: function(list) {
		const data = {x: [], y: []};
		list.forEach(function(v,i,a) {
			data.x.push(v.x);
			data.y.push(v.y);
		});
		return data;
	},
	/**. '{object ols(object list)}: Retorna os coeficientes angular e linear pelo "método dos mínimos quadrados" ou nulo. O argumento '{list} deve ser o retorno do método '{toData}, que deve conter pelo menos duas coordenadas.**/
	ols: function(list) {
		if (list.length < 2) return null;
		let sumX = 0, sumY = 0, sumX2 = 0, sumXY = 0, len = list.length;
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
	/**. '{number rmse(object list, function fit)}: Retorna raiz do erro quadrático médio entre o conjunto de dados ou nulo. O argumento '{list} é o retorno do método '{toData}, o conjunto de referência, e o argumento fit é a função que resultou da regressão.**/
	rmse: function(list, fit) {
		const data = list.map(function(v,i,a) {
			const y = this.toFinite(fit(v.x));
			return y === null ? 0 : v.y - y;
		}, this);
		return Math.hypot.apply(null, data) / Math.sqrt(list.length);
		/*FIXME tente a linha abaixo, a dízima periódica prejudica muito no cálculo do erro
		__DATA2D.exponentialFit(__DATA2D.toData([2,3,4,5,6,100], (x)=> 3*Math.exp(4*x)))
		if ((erro - 0) - Number.EPSILON) then 0	*/
	},
	/**. '{string valueFit(finite x)}: Retorna a notação númerica local simplificada de '{x}.**/
	valueFit: function(x) {
		const abs = Math.abs(x);
		if (abs === 0)
			return x.toLocaleString(__LANG.value, {style: "decimal", maximumFractionDigits: 2});
		if (abs >= Math.pow(10, 100))
			return x.toLocaleString(__LANG.value, {notation: "scientific", maximumFractionDigits: 0});
		if (abs >= Math.pow(10, 10))
			return x.toLocaleString(__LANG.value, {notation: "scientific", maximumFractionDigits: 1});
		if (abs >= Math.pow(10, 3))
			return x.toLocaleString(__LANG.value, {notation: "scientific", maximumFractionDigits: 2});
		if (abs >= Math.pow(10, 2))
			return x.toLocaleString(__LANG.value, {style: "decimal", maximumFractionDigits: 1});
		if (abs >= Math.pow(10, 1))
			return x.toLocaleString(__LANG.value, {style: "decimal", maximumFractionDigits: 2});
		if (abs <= Math.pow(10, -100))
			return x.toLocaleString(__LANG.value, {notation: "scientific", maximumFractionDigits: 0});
		if (abs <= Math.pow(10, -10))
			return x.toLocaleString(__LANG.value, {notation: "scientific", maximumFractionDigits: 1});
		if (abs <= Math.pow(10, -1))
			return x.toLocaleString(__LANG.value, {notation: "scientific", maximumFractionDigits: 2});
		return x.toLocaleString(__LANG.value, {style: "decimal", maximumFractionDigits: 2});
	},
	/**. '{void stringFit(object fit, string type)}: Define o modelo e a forma visual da regressão conforme seu tipo ('{type}).**/
	stringFit: function(fit, type) {
		const math = {a: this.valueFit(fit.a), b: this.valueFit(fit.b), d: this.valueFit(fit.d)};
		if (type === "linear") {
			fit.m = `y = ax + b ± σ`;
			fit.v = `y = ${math.a}x + (${math.b}) ± ${math.d}`;
		}
		else if (type === "geometric") {
			fit.m = `y = ax^(b) ± σ`;
			fit.v = `y = ${math.a}x^(${math.b}) ± ${math.d}`;
		}
		else if (type === "exponential") {
			fit.m = `y = ae^(bx) ± σ`;
			fit.v = `y = ${math.a}e^(${math.b}x) ± ${math.d}`;
		}
		else if (type === "logarithmic") {
			fit.m = `y = aln(b x) ± σ`;
			fit.v = `y = ${math.a}ln(${math.b}x) ± ${math.d}`;
		}
		return;
	},
	/**. '{object linearFit(object list)}: Retorna um objeto contendo os dados da regressão linear ou nulo. O argumento '{list} é o retorno do método '{toData}:
	|Propriedade|Tipo|Descrição|
	|a|finite|O coeficiente '{a} do modelo da regressão|
	|b|finite|O coeficiente '{b} do modelo da regressão|
	|p|object|O conjunto de dados de referência|
	|f|function|A função obtida pela regressão|
	|d|finite|O erro quadrático médio|
	|m|string|O modelo da regressão|
	|v|string|A visualização da regressão|**/
	linearFit: function(list) {
		const fit = this.ols(list);
		if (fit !== null) {
			fit.p = list;
			fit.f = function(x) {return fit.a*x + fit.b;};
			fit.d = this.rmse(fit.p, fit.f);
			this.stringFit(fit, "linear");
		}
		return fit;
	},
	/**. '{object geometricFit(object list)}: Retorna um objeto contendo os dados da regressão geométrica com os mesmos parâmetros do método '{linearFit}**/
	geometricFit: function(list) {
		/*-- efetuar a transformada de dados --*/
		const base = this.toList(list);
		base.x = this.map(base.x, Math.log);
		base.y = this.map(base.y, Math.log);
		const data = this.toData(base.x, base.y);
		const calc = this.ols(data);
		const fit  = calc === null ? null : {};
		if (fit !== null) {
			fit.a = Math.exp(calc.b)
			fit.b = calc.a;
			fit.p = list;
			fit.f = function(x) {return fit.a*Math.pow(x, fit.b);};
			fit.d = this.rmse(fit.p, fit.f);
			this.stringFit(fit, "geometric");
		}
		return fit;
	},
	/**. '{object exponentialFit(object list)}: Retorna um objeto contendo os dados da regressão exponencial com os mesmos parâmetros do método '{linearFit}**/
	exponentialFit: function(list) {
		/*-- efetuar a transformada de dados --*/
		const base = this.toList(list);
		base.y = this.map(base.y, Math.log);
		const data = this.toData(base.x, base.y);
		const calc = this.ols(data);
		const fit  = calc === null ? null : {};
		if (fit !== null) {
			fit.a = Math.exp(calc.b)
			fit.b = calc.a;
			fit.p = list;
			fit.f = function(x) {return fit.a*Math.exp(fit.b*x);};
			fit.d = this.rmse(fit.p, fit.f);
			this.stringFit(fit, "exponential");
		}
		return fit;
	},
	/**. '{object logarithmicFit(object list)}: Retorna um objeto contendo os dados da regressão logarítmica com os mesmos parâmetros do método '{linearFit}**/
	logarithmicFit: function(list) {
		/*-- efetuar a transformada de dados --*/
		const base = this.toList(list);
		base.y = this.map(base.y, Math.exp);
		const data = this.toData(base.x, base.y);
		//const calc = this.ols(data);
		const calc = this.geometricFit(data);
		const fit  = calc === null ? null : {};
		if (fit !== null) {
			fit.a = calc.b;
			fit.b = Math.pow(calc.a, 1/calc.b);
			fit.p = list;
			fit.f = function(x) {return fit.a*Math.log(fit.b*x);};
			fit.d = this.rmse(fit.p, fit.f);
			this.stringFit(fit, "logarithmic");
		}
		return fit;
	},
	/**. '{object minRMSE(object list)}: Retorna a regressão com menor erro quadrático médio ou nulo.**/
	minRMSE: function(list) {
		return [
			this.linearFit(list),
			this.geometricFit(list),
			this.exponentialFit(list),
			this.logarithmicFit(list)
		].sort(function(a,b) {
			return a === null ? 1 : (b === null ? -1 : (a.d === b.d ? 0 : (a.d < b.d ? -1 : 1)));
		})[0];
	},
	/**. '{object sumFit(object list)}: Retorna um objeto contendo os dados da soma das áreas com os mesmos parâmetros do método '{linearFit}**/
	sumFit: function(list) {
		const fit = {a: 0, b: 0};
		list.forEach(function(v,i,a) {
			fit.a += i === 0 ? 0 : ((v.y + a[i-1].y) * (v.x - a[i-1].x)) / 2;
		});
		if (fit !== null) {
			fit.p = list;
			fit.f = function(x) {return fit.a;};
			fit.d = this.rmse(fit.p, fit.f);
			this.stringFit(fit, "sum");
		}
		return fit;
	},
	/**. '{object avgFit(object list)}: Retorna um objeto contendo os dados da média com os mesmos parâmetros do método '{linearFit}**/
	avgFit: function(list) {
		const base = this.toList(list);
		const min  = Math.min.apply(null, base.x);
		const max  = Math.max.apply(null, base.x);
		const fit  = this.sumFit(list);
		if (fit !== null) {
			fit.a = fit.a/(max-min);
			fit.p = list;
			fit.f = function(x) {return fit.a;};
			fit.d = this.rmse(fit.p, fit.f);
			this.stringFit(fit, "avg");
		}
		return fit;
	},
};