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
	/**. '{array dataSet(array x, array y)}: Retorna uma lista de objetos contendo as coordenadas ('{x}, '{y})**/
	dataSet: function(x, y) {
		return (x.length < y.length ? x : y).map(function(v,i,a) {
			return {x: x[i], y: y[i]}
		});
	},




	/**. '{number toFinite(any value)}: Retorna a conversão de '{value} para finito, dias ou segundos ou nulo:
	|Tipo|Origem|
	|Numérico|finite|
	|Dias|date|
	|Segundos|time e datetime|**/
	toFinite: function(value) {
		const data = new __Type(value);
		return data.finite || data.date || data.time || data.datetime ? data.valueOf() : null;
	},
	/**. '{array map(array list, function call}: Define o resultado da função '{call} aos itens da lista e a retorna. Apenas números finitos (ver método '{toFinite}) são permitidos como valores de entrada ou saída, outros valores serão definidos como nulo. O argumento '{call}, se ausente, apenas definirá o item como finito ou nulo.**/
	map: function(list, call) {
		if (typeof call !== "function")
			call = function(x) {return x;}
		return list.map(function(v,i,a) {
			if (!Number.isFinite(v))
				v = this.toFinite(v);
			if (v === null) return null;
			try      {return this.toFinite(call(v));}
			catch(e) {return null;}
		}, this);
	},
	/**. '{array dataXY(array x, any y}: Retorna uma lista ordenada do conjunto de dados numéricos finitos estabelecidos pelos argumentos '{x} e '{y}. O argumento '{y} pode ser um array, uma função ou uma constante finita. O resultado desse método é utilizado nos demais métodos que tratam de ajustes de curva.**/
	dataXY: function(x, y) {
		/*-- acertando x,y --*/
		x = Array.isArray(x) ? this.map(x) : [];
		y = Array.isArray(y) ? this.map(y) : (typeof y === "function" ? this.map(x, y) : this.map(x.slice().fill(y)));
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
	/**. '{object toList(object dataXY, string axis)}: Retorna a lista do eixo '{x} ou '{y} proveniente do método '{dataXY}.**/
	toList: function(dataXY, axis) {
		return dataXY.map(function(v,i,a) {return v[axis];});
	},
	/**. '{object ols(object dataXY)}: Retorna os coeficientes angular e linear pelo "método dos mínimos quadrados" ou nulo. O argumento '{list} deve ser o retorno do método '{toData}, que deve conter pelo menos duas coordenadas.**/
	ols: function(dataXY) {
		if (dataXY.length < 2) return null;
		let sumX = 0, sumY = 0, sumX2 = 0, sumXY = 0, len = dataXY.length;
		dataXY.forEach(function(v,i,a) {
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
	/**. '{number rmse(object dataXY, function fit)}: Retorna raiz do erro quadrático médio entre o conjunto de dados ou nulo. O argumento fit é a função que resultou da regressão.**/
	rmse: function(dataXY, fit) {
		const  y1 = this.toList(dataXY, "y");
		const  y2 = this.map(this.toList(dataXY, "x"), fit);
		let   len = 0;
		console.log(y1, y2);
		const sum = y2.reduce(function(sum,v,i,a) {
			const ok = Number.isFinite(v) && Number.isFinite(y1[i]);
			len += ok ? 1 : 0;
			console.log(v, y1[i], v - y1[i], Math.pow(v - y1[i], 2))
			return ok ? sum + Math.pow(v - y1[i], 2) : sum;
		}, 0);
		return Math.sqrt(sum/len);


		/*const data = dataXY.map(function(v,i,a) {
			const y = this.toFinite(fit(v.x));
			return y === null ? 0 : v.y - y;
		}, this);
		return Math.hypot.apply(null, data) / Math.sqrt(dataXY.length);*/

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
	/**. '{object linearFit(object dataXY)}: Retorna um objeto contendo os dados da regressão linear ou nulo. O argumento '{list} é o retorno do método '{toData}:
	|Propriedade|Tipo|Descrição|
	|a|finite|O coeficiente '{a} do modelo da regressão|
	|b|finite|O coeficiente '{b} do modelo da regressão|
	|p|object|O conjunto de dados de referência|
	|f|function|A função obtida pela regressão|
	|d|finite|O erro quadrático médio|
	|m|string|O modelo da regressão|
	|v|string|A visualização da regressão|**/
	linearFit: function(dataXY) {
		const fit = this.ols(dataXY);
		if (fit !== null) {
			fit.p = dataXY;
			fit.f = function(x) {return fit.a*x + fit.b;};
			fit.d = this.rmse(fit.p, fit.f);
			this.stringFit(fit, "linear");
		}
		return fit;
	},
	/**. '{object geometricFit(object dataXY)}: Retorna um objeto contendo os dados da regressão geométrica com os mesmos parâmetros do método '{linearFit}**/
	geometricFit: function(dataXY) {
		/*-- efetuar a transformada de dados --*/
		const x    = this.map(this.toList(dataXY, "x"), Math.log);
		const y    = this.map(this.toList(dataXY, "y"), Math.log);
		const data = this.dataXY(x, y);
		const calc = this.ols(data);
		const fit  = calc === null ? null : {};
		if (fit !== null) {
			fit.a = Math.exp(calc.b)
			fit.b = calc.a;
			fit.p = dataXY;
			fit.f = function(x) {return fit.a*Math.pow(x, fit.b);};
			fit.d = this.rmse(fit.p, fit.f);
			this.stringFit(fit, "geometric");
		}
		return fit;
	},

	teste: function(x) {
		for (let i = 0; i <= 100; i++)
			if (Math.abs(x - Number(x.toFixed(i))) < Number.EPSILON)
				return Number(x.toFixed(i));
		return x;
	},


	/**. '{object exponentialFit(object dataXY)}: Retorna um objeto contendo os dados da regressão exponencial com os mesmos parâmetros do método '{linearFit}**/
	exponentialFit: function(dataXY) {
		/*-- efetuar a transformada de dados --*/
		const x    = this.toList(dataXY, "x");
		const y    = this.map(this.toList(dataXY, "y"), Math.log);
		const data = this.dataXY(x, y);
		const calc = this.ols(data);
		const fit  = calc === null ? null : {};
		if (fit !== null) {
			fit.a = Math.exp(calc.b)
			fit.b = calc.a;

			fit.a = this.teste(Math.exp(calc.b));
			fit.b = this.teste(calc.a);


			fit.p = dataXY;
			fit.f = function(x) {return fit.a*Math.exp(fit.b*x);};
			fit.d = this.rmse(fit.p, fit.f);
			this.stringFit(fit, "exponential");
		}
		return fit;
	},
	/**. '{object logarithmicFit(object dataXY)}: Retorna um objeto contendo os dados da regressão logarítmica com os mesmos parâmetros do método '{linearFit}**/
	logarithmicFit: function(dataXY) {
		/*-- efetuar a transformada de dados --*/
		const x    = this.toList(dataXY, "x");
		const y    = this.map(this.toList(dataXY, "y"), Math.exp);
		const data = this.dataXY(x, y);
		const calc = this.geometricFit(data);
		const fit  = calc === null ? null : {};
		if (fit !== null) {
			fit.a = calc.b;
			fit.b = Math.pow(calc.a, 1/calc.b);
			fit.p = dataXY;
			fit.f = function(x) {return fit.a*Math.log(fit.b*x);};
			fit.d = this.rmse(fit.p, fit.f);
			this.stringFit(fit, "logarithmic");
		}
		return fit;
	},
	/**. '{object minRMSE(object dataXY)}: Retorna a regressão com menor erro quadrático médio ou nulo.**/
	minRMSE: function(dataXY) {
		return [
			this.linearFit(dataXY),
			this.geometricFit(dataXY),
			this.exponentialFit(dataXY),
			this.logarithmicFit(dataXY)
		].sort(function(a,b) {
			return a === null ? 1 : (b === null ? -1 : (a.d === b.d ? 0 : (a.d < b.d ? -1 : 1)));
		})[0];
	},
	/**. '{object sumFit(object dataXY)}: Retorna um objeto contendo os dados da soma das áreas com os mesmos parâmetros do método '{linearFit}**/
	sumFit: function(dataXY) {
		const fit = {a: 0, b: 0};
		dataXY.forEach(function(v,i,a) {
			fit.a += i === 0 ? 0 : ((v.y + a[i-1].y) * (v.x - a[i-1].x)) / 2;
		});
		if (fit !== null) {
			fit.p = dataXY;
			fit.f = function(x) {return fit.a;};
			fit.d = this.rmse(fit.p, fit.f);
			this.stringFit(fit, "sum");
		}
		return fit;
	},
	/**. '{object avgFit(object dataXY)}: Retorna um objeto contendo os dados da média com os mesmos parâmetros do método '{linearFit}**/
	avgFit: function(dataXY) {
		const base = this.toList(dataXY);
		const min  = Math.min.apply(null, base.x);
		const max  = Math.max.apply(null, base.x);
		const fit  = this.sumFit(dataXY);
		if (fit !== null) {
			fit.a = fit.a/(max-min);
			fit.p = dataXY;
			fit.f = function(x) {return fit.a;};
			fit.d = this.rmse(fit.p, fit.f);
			this.stringFit(fit, "avg");
		}
		return fit;
	},
	/**. '{array ASC(array list)}: Retorna a lista de finitos em ordem ascendente.**/
	ASC: function(list, order) {
		return list
			.filter(function(v,i,a) {return Number.isFinite(v);})
			.sort(function(a,b) {return a === b ? 0 : (a < b ? -1 : 1);});
	},
	/**. '{array DESC(array list)}: Retorna a lista de finitos em ordem descendente.**/
	DESC: function(list) {
		return this.ASC(list).reverse();
	},
	/**. '{number MIN(array list)}: Retorna o menor número da lista de finitos.**/
	MIN: function (list) {
		return list.reduce(function (min,v,i,a) {return Number.isFinite(v) && v < min ? v : min;}, Infinity);
	},
	/**. '{number MAX(array list)}: Retorna o maior número da lista de finitos.**/
	MAX: function (list) {
		return list.reduce(function (max,v,i,a) {return Number.isFinite(v) && v > max ? v : min;}, -Infinity);
	},
	/**. '{number SUM(array list)}: Retorna a soma da lista de finitos.**/
	SUM: function(list) {
		return list.reduce(function (sum,v,i,a) {return sum + (Number.isFinite(v) ? v : 0);}, 0);
	},
	/**. '{number AVG(array list)}: Retorna a média da lista de finitos ou nulo.**/
	AVG: function(list) {
		const len = list.reduce(function (len,v,i,a) {return len + (Number.isFinite(v) ? 1 : 0);}, 0);
		return len === 0 ? null : this.SUM(list)/len;
	},
	/**. '{number MED(array list)}: Retorna a mediana da lista de finitos ou nulo.**/
	MED: function(list) {
		const y = this.ASC(list);
		const l = y.length;
		return l === 0 ? null : (l%2 === 0 ? (y[l/2]+y[(l/2)-1])/2 : y[(l-1)/2]);
	},
	/**. '{number HARM(array list)}: Retorna a média harmônica da lista de finitos ou nulo.**/
	HARM: function(list) {
		const len = list.reduce(function (len,v,i,a) {return len + (Number.isFinite(v) && v !== 0 ? 1 : 0);}, 0);
		const sum = list.reduce(function (sum,v,i,a) {return sum + (Number.isFinite(v) && v !== 0 ? 1/v : 0);}, 0);
		return sum === 0 ? null : len/sum;
	},
	/**. '{number HARM(array list)}: Retorna a média geométrica da lista de finitos ou nulo.**/
	GEO: function(list) {
		const len = list.reduce(function (len,v,i,a) {return len + (Number.isFinite(v) && v > 0 ? 1 : 0);}, 0);
		const sum = list.reduce(function (sum,v,i,a) {return sum * (Number.isFinite(v) && v > 0 ? v : 1);}, 1);
		return len === 0 ? null : Math.pow(sum, 1/len);
	},
	/**. '{number SD(array list)}: Retorna o desvio padrão da lista de finitos ou nulo.**/
	SD: function(list) {
		const len = list.reduce(function (len,v,i,a) {return len + (Number.isFinite(v) ? 1 : 0);}, 0);
		const avg = this.AVG(list);
		const sum = list.reduce(function (sum,v,i,a) {return sum + (Number.isFinite(v) ? (v-avg)*(v-avg) : 0);}, 0);
		return len === 0 ? null : Math.sqrt(sum/len);
	},

	DISTINCT: function(list, data) {
		const dist = list.filter(function(v,i,a) {
			const ok = Number.isFinite(v) || (typeof v === "string" && v.trim() !== "");
			return ok && a.indexOf(v) === i;
		});
		return data === true ? dist.reduce(function(obj,v,i,a) {obj[v] = 0; return obj;}, {}) : dist;
	},

	COUNT: function(list, ratio) {
		const data = this.DISTINCT(list, true);
		const item = list.filter(function(v,i,a) {
			if (v in data) data[v]++;
			return v in data;
		});
		if (ratio === true)
			for (let i in data) data[i] = data[i]/item.length;
		return data;
	},



};