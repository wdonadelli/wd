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
	/**. '{number toNumeric(any value)}: Converte '{value} de finito, dias ou segundos para numérico ou nulo.**/
	toNumeric: function(value) {
		const data = new __Type(value);
		return data.finite || data.date || data.time || data.datetime ? data.valueOf() : null;
	},
	/**. '{number round(finite value)}: Retorna o valor arredondado considerando a precisão EPSILON.**/
	//FIXME essa porcaria não funciona ainda
	round: function(value) {
		for (let i = 0; i <= 100; i++)
			if (Math.abs(value - Number(value.toFixed(i))) < Number.EPSILON)
				return Number(value.toFixed(i));
		return value;
	},

	//TODO a fazer
	toDate: function(value)     {return null},
	toTime: function(value)     {return null},
	toDateTime: function(value) {return null},


	/**. '{array convert(array list)}: Converte os itens de '{list} para ...TODO implementar outras possibilidades.**/
	convert: function(list) {
		return list.map(function(v,i,a) {return this.toNumeric(v)}, this);
	},
	/**. '{object dataXY(array x, array y}: Retorna uma lista de objetos contendo as coordenadas '{x, y} de forma alinhada, qualificada, não repetida e ordenada em relação a '{x} dos valores numéricos finitos de ambas as listas.**/
	dataXY: function(x, y) {
		/*-- valores precisam ser numéricos e x não pode repetir --*/
		return x.map(function(v,i,a) {
			return {x: Number.isFinite(v) && a.indexOf(v) === i ? v : null, y: Number.isFinite(y[i]) ? y[i] : null};
		})
		/*-- coordenadas não aprovadas no passo anterior são ignoradas --*/
		.filter(function(v,i,a) {
			return v.x !== null && v.y !== null;
		})
		/*-- ordenando as coordenadas em relação ao valor de x --*/
		.sort(function(a,b) {
			return a.x === b.x ? 0 : (a.x < b.x ? -1 : 1);
		});
	},
	/**. '{object toList(object dataXY, string axis)}: Recebe o resultado do método '{dataXY} e retorna a lista do eixo '{x} ou '{y}.**/
	toList: function(dataXY, axis) {
		return dataXY.map(function(v,i,a) {return v[axis];});
	},
	/**. '{object ols(object dataXY)}: Recebe o resultado do método '{dataXY} e retorna os coeficientes angular '{a} e linear '{b} obtido pelo "método dos mínimos quadrados" ou nulo. O argumento deve conter pelo menos duas coordenadas.**/
	ols: function(dataXY) {
		if (dataXY.length < 2) return null;
		const sumX  = dataXY.reduce(function(sum,v,i,a) {return sum + v.x;}, 0);
		const sumY  = dataXY.reduce(function(sum,v,i,a) {return sum + v.y;}, 0);
		const sumX2 = dataXY.reduce(function(sum,v,i,a) {return sum + (v.x * v.x);}, 0);
		const sumXY = dataXY.reduce(function(sum,v,i,a) {return sum + (v.x * v.y);}, 0);
		const len   = dataXY.length;
		const data  = {};
		data.a = this.round(((len * sumXY) - (sumX * sumY)) / ((len * sumX2) - (sumX * sumX)));
		data.b = this.round(((sumY) - (sumX * data.a)) / (len));
		return data;
	},
	/**. '{array map(array list, function call}: Aplica a função '{call} aos itens da lista e a retorna. Valores não finitos são definidos como nulo.**/
	map: function(list, call) {
		call = typeof call === "function" ? call : function(x) {return x;}
		return list.map(function(v,i,a) {
			try {
				const x = call(v);
				return Number.isFinite(x) ? x : null;
			} catch(e) {return null;}
		}, this);
	},
	/**. '{number rmse(object dataXY, function fit)}: Retorna raiz do erro quadrático médio entre o conjunto de dados ou nulo. O argumento fit é a função que resultou da regressão.**/
	rmse: function(dataXY, fit) {
		const  y1 = this.toList(dataXY, "y");
		const  y2 = this.map(this.toList(dataXY, "x"), fit);
		let   len = 0;
		const sum = y2.reduce(function(sum,v,i,a) {
			const ok = Number.isFinite(v) && Number.isFinite(y1[i]);
			len += ok ? 1 : 0;
			return ok ? sum + Math.pow(v - y1[i], 2) : sum;
		}, 0);
		return Math.sqrt(sum/len);
		//FIXME tente a linha abaixo, a dízima periódica prejudica muito no cálculo do erro
		//x = [2,3,4,5,6,100]; y = __DATA2D.map(x, (x)=> 3*Math.exp(4*x)); z = __DATA2D.exponentialFit(__DATA2D.dataXY(x,y))
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
		else if (type === "sum") {
			fit.m = `∑yi∆xi ≅ a`;
			fit.v = `∑yi∆xi ≅ ${math.a}`;
		}
		else if (type === "avg") {
			fit.m = `∑yi∆xi/∆x ≅ a`;
			fit.v = `∑yi∆xi/∆x ≅ ${math.a}`;
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
			fit.a = this.round(Math.exp(calc.b));
			fit.b = calc.a;
			fit.p = dataXY;
			fit.f = function(x) {return fit.a*Math.pow(x, fit.b);};
			fit.d = this.rmse(fit.p, fit.f);
			this.stringFit(fit, "geometric");
		}
		return fit;
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
	/**. '{object sumFit(object dataXY)}: Retorna um objeto contendo os dados da soma das áreas semelhantecom os mesmos parâmetros do método '{linearFit}**/
	sumFit: function(dataXY) {
		const sum = dataXY.reduce(function(sum,v,i,a) {return sum + (i === 0 ? 0 : ((v.y + a[i-1].y) * (v.x - a[i-1].x)) / 2);}, 0)
		const fit = {};
		fit.a = this.round(sum);
		fit.b = 0,
		fit.p = dataXY;// tem que colocar {x: x1, y: 0} e {x: xn, y: 0}
		fit.f = function(x) {return fit.a;};
		fit.d = 0;
		this.stringFit(fit, "sum");
		return fit;
	},
	/**. '{object avgFit(object dataXY)}: Retorna um objeto contendo os dados da média com os mesmos parâmetros do método '{linearFit}**/
	avgFit: function(dataXY) {
		const xlist = this.toList(dataXY, "x");
		const delta = this.round(this.MAX(xlist) - this.MIN(xlist));
		const fit   = this.sumFit(dataXY);
		fit.a = delta === 0 ? 0 : this.round(fit.a/delta);
		fit.p = dataXY;
		fit.f = function(x) {return fit.a;};
		fit.d = this.rmse(fit.p, fit.f);
		this.stringFit(fit, "avg");
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
		return list.reduce(function (max,v,i,a) {return Number.isFinite(v) && v > max ? v : max;}, -Infinity);
	},
	/**. '{number SUM(array list)}: Retorna a soma da lista de finitos.**/
	SUM: function(list) {
		return this.round(list.reduce(function (sum,v,i,a) {return sum + (Number.isFinite(v) ? v : 0);}, 0));
	},
	/**. '{number AVG(array list)}: Retorna a média da lista de finitos ou zero.**/
	AVG: function(list) {
		const len = list.reduce(function (len,v,i,a) {return len + (Number.isFinite(v) ? 1 : 0);}, 0);
		return len === 0 ? 0 : this.round(this.SUM(list)/len);
	},
	/**. '{number MED(array list)}: Retorna a mediana da lista de finitos ou zero.**/
	MED: function(list) {
		const y = this.ASC(list);
		const l = y.length;
		return l === 0 ? 0 : this.round(l%2 === 0 ? (y[l/2]+y[(l/2)-1])/2 : y[(l-1)/2]);
	},
	/**. '{number HARM(array list)}: Retorna a média harmônica da lista de finitos ou zero.**/
	HARM: function(list) {
		const len = list.reduce(function (len,v,i,a) {return len + (Number.isFinite(v) && v !== 0 ? 1 : 0);}, 0);
		const sum = list.reduce(function (sum,v,i,a) {return sum + (Number.isFinite(v) && v !== 0 ? 1/v : 0);}, 0);
		return sum === 0 ? 0 : this.round(len/sum);
	},
	/**. '{number HARM(array list)}: Retorna a média geométrica da lista de finitos ou zero.**/
	GEO: function(list) {
		const len = list.reduce(function (len,v,i,a) {return len + (Number.isFinite(v) && v > 0 ? 1 : 0);}, 0);
		const sum = list.reduce(function (sum,v,i,a) {return sum * (Number.isFinite(v) && v > 0 ? v : 1);}, 1);
		return len === 0 ? 0 : this.round(Math.pow(sum, 1/len));
	},
	/**. '{number SD(array list)}: Retorna o desvio padrão da lista de finitos ou zero.**/
	SD: function(list) {
		const len = list.reduce(function (len,v,i,a) {return len + (Number.isFinite(v) ? 1 : 0);}, 0);
		const avg = this.AVG(list);
		const sum = list.reduce(function (sum,v,i,a) {return sum + (Number.isFinite(v) ? Math.pow(v - avg, 2) : 0);}, 0);
		return len === 0 ? 0 : this.round(Math.sqrt(sum/len));
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















	path: function(dataXY, type, color) {
		const x = this.toList(dataXY, "x");
		const y = this.toList(dataXY, "y");
		const d = dataXY.map(function(v,i,a) {
			if (type === "dots")


			if (type === "link")

			if (type === "stair")


			if (type === "dash")


			if (type === "area")

			if (type === "line")





		});












	}



};