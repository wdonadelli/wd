/**
#3 Matemática
O objeto '{__MATH} apresenta uma série de ferramentas para cálculos genéricos. Nenhum argumento será checado, observar a descrição.**/
const __MATH = {
	/**. '{array _primes}: Apresenta uma lista de números primos, que pode aumentar conforme demanda.**/
	primes: [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97],
	/**. '{integer addPrime()}: Adiciona um primo à lista ('{primes}) e o retorna.**/
	addPrime: function() {
		const length = this.primes.length;
		let error, sqrt, item, prime = this.primes[length - 1];
		/*-- enquanto não for adicionado um primo à lista --*/
		while (this.primes.length === length) {
			prime = prime + 2;
			sqrt  = Math.sqrt(prime);
			error = false;
			index = 0;
			/*-- checar individualmente enquanto a raiz quadrada for maior que o primo --*/
			while(error === false && this.primes[++index] <= sqrt)
				error = prime%this.primes[index] === 0;
			/*-- se não tiver erro, adicionar à lista --*/
			if (!error) this.primes.push(prime);
		}
		return this.primes[length];
	},
	/**. '{array getPrimes(integer value)}: Retorna uma lista de números primos do número limitado 64000 registros.**/
	getPrimes: function(value) {
		const lim = this.primes.length < 64000 ? 64000 : this.primes.length + 2048;
		const data = isNaN(value) ? 0 : Math.trunc(Math.abs(Number(value)));
		const list = [];
		let rest = data, i = -1;
		/*-- enquanto o primo for menor que o valor --*/
		while(this.primes[++i] <= rest) {
			/*-- se divisível pelo primo: adicionar à lista e redefinir a busca --*/
			if (rest%this.primes[i] === 0) {
				list.push(this.primes[i]);
				while(rest%this.primes[i] === 0)
					rest /= this.primes[i];
			}
			/*-- se tiver acabado os primos conhecidos: adicionar enquanto o loop estiver válido --*/
			if (i === this.primes.length - 1 && this.primes[i] <= rest && this.primes.length < lim)
				this.addPrime();
		}
		return list;
	},
	/**. '{boolean isPrime(integer value)}: Retorna verdadeiro se o valor positivo inteiro de '{value} for primo.**/
	isPrime: function(value) {
		const data = isNaN(value) ? 0 : Math.trunc(Math.abs(Number(value)));
		const sqrt = Math.sqrt(data);
		let i = -1;
		while (++i < this.primes.length) {
			if (data%this.primes[i] === 0)    return false;
			if (this.primes[i] > sqrt)        return true;
			if (this.primes.length - 1 === i) this.addPrime();
		}
		return true;
	},
	/**. '{number exp10(number value)}: Retorna o expoente de base 10 de '{value}.**/
	exp10: function(value) {
		const exp = value = isNaN(value) ? "0" : Number(value).toExponential();
		return Number(exp.match(/e([-+]\d+)$/i)[1]);
	},
	/**. '{object reduce(integer num, integer den)}: Retorna um objeto com os argumentos reduzido ao máximo divisor comum '{gcd}.**/
	reduce: function(num, den) {
		num = Math.trunc(Math.abs(isNaN(num) ? 0 : Number(num)));
		den = Math.trunc(Math.abs(isNaN(den) ? 0 : Number(den)));
		/*-- checar se são inteiros diferentes de zero --*/
		if (num === 0 || den === 0)
			return {num: 0, den: 0, gcd: 0};
		/*-- checar se são divisíveis entre si --*/
		if (num%den === 0 || den%num === 0)
			return {num: num >= den ? num/den : 1, den: num >= den ? 1 : den/num, gcd: num >= den ? den : num};
		/*-- checar se são divisíveis por 10 --*/
		let gcd = 1;
		while (num%10 === 0 && den%10 === 0) {
			num /= 10;
			den /= 10;
			gcd *= 10;
		}
		/*-- fatorar --*/
		const list = this.getPrimes(Math.min(num, den));
		for (let i = 0; i < list.length; i++) {
			while(num%list[i] === 0 && den%list[i] === 0) {
				num /= list[i];
				den /= list[i];
				gcd *= list[i];
			}
			/*-- parar a fatoração nas situações abaixo --*/
			if (num === 1 || den === 1 || list.indexOf(num) >= 0 || list.indexOf(den) >= 0) break;
		}
		/*-- divisão de número primo ainda não identificado --*/
		if (num > list[list.length - 1] && den > list[list.length - 1]) {
			const lden = this.getPrimes(den);
			const lnum = this.getPrimes(num);
			let vden = den, vnum = num;
			for (let i = 0; i < lden.length && vden >= lden[i]; i++)
				while (vden%lden[i] === 0) vden /= lden[i];
			for (let i = 0; i < lnum.length && vnum >= lnum[i]; i++)
				while (vnum%lnum[i] === 0) vnum /= lnum[i];
			if (vnum === vden) {
				num = num/vnum;
				den = den/vden;
				gcd = gcd*num;
			}
		}
		return {num: num, den: den, gcd: gcd};
	},
	/**. '{object decRepeat(string dec, integer base, boolean debug)}: Retorna um objeto contendo informações sobre os dígitos da parte decimal do número mediante análise de períodos em dízimas periódicas, se existente, ou nulo:
	|Argumento|Descrição|
	|'{dec}|Dígitos posteriores ao divisor de decimal|
	|'{base}|Valor 2 para binário e 10 (padrão) para decimal, conforme '{dec}|
	|'{debug}|Se verdadeiro, exibirá o fragmento capturado de '{dec}|
	|""Tabela de argumento do método""|
	. Quanto ao objeto retornado:
	|Propriedade|Tipo|Descrição|
	|'{val}|String|Valor informado no argumento '{dec}|
	|'{cut}|Integer|Índice do dígito onde inicia o período|
	|'{end}|Boolean|Informa se o fragmento posterior aos períodos capturas são coerente, ignorando o último dígito|
	|'{len}|Number|Informa a proporção dos períodos em relação ao todo|
	|'{num}|Integer|Informa o numerado obtido com a ferramenta|
	|'{den}|Integer|Informa o denominador obtido com a ferramenta|
	|""Tabela de propriedades do objeto retornado""|**/
	decRepeat: function(dec, base, debug) {
		dec  = String(dec);
		base = (/\D/).test(dec) ? 0 : (Number(base) === 2 && (/^[01]+$/).test(dec) ? 2 : 10);
		if (base === 0) return null;
		/*-- analisando dízima periódica --*/
		const re  = /^(\d+)\1+(\d*)$/;
		let data, find, main, rest, end, del;
		for (let i = 0; i < dec.length; i++) {
			find = dec.slice(i).match(re);
			/*-- encontrado período maior que a imprecisão --*/
			if (find && find[1] && find[1].length > find[2].length) {
				data = {cut: i, val: dec}
				main = dec.slice(0, i);
				rest = find[1];
				end  = new RegExp(find[2].length === 0 ? "." : `^${find[2]}?`);
				/*-- refinando o período encontrado --*/
				for (let j = 1; j < rest.length; j++) {
					del = new RegExp(`(${rest.slice(0,j)})+`);
					if (rest.replace(del, "").length === 0) {
						rest = rest.slice(0,j);
						break;
					}
				}
				/*-- imprimindo o resultado da análise --*/
				if (debug) console.log(`${dec.slice(0,i)}'${dec.slice(i)}\n${main}[${rest}...]${find[2]}`);
				/*-- obtendo denominado e numerador conforme base escolhida --*/
				if (base === 10) {
					data.num = Number(main+rest) - Number(main === "" ? 0 : main);
					data.den =  Math.pow(10, i + rest.length) - Math.pow(10, i);
				}
				else if (base === 2) {
					data.num = parseInt(main+rest, 2) - parseInt(main === "" ? "0" : main, 2);
					data.den = Math.pow(2, i + rest.length) - Math.pow(2, i);
				}
				/*-- definindo estatística: menor o i --*/
				data.end = end.test(find[1]);
				data.len = 1 - (i)/(dec.length - 1);
				return data.num === 0 || data.den === 0 ? null : data;
			}
		}
		return null;
	},
	/**. '{object split(number value)}: Retorna um objeto contendo informações sobre o valor repassado):
	|Propriedade|Tipo|Descrição|
	|'{sign}|Integer|Sinal do número, sendo -1 para negativo e 1 para positivo|
	|'{int}|Integer|Valor da parte inteira do número|
	|'{num}|Integer|Valor do numerador da parte fracionária do número (aproximado)|
	|'{den}|Integer|Valor do denominador da parte fracionária do número (aproximado)|
	|'{dec}|Integer|Valor da divisão entre numerador e denominados|
	|""Tabela de propriedades retornadas""|**/
	split: function(value) {
		const val  = Math.abs( isNaN(value) ? 0 : Number(value));
		const sign = Math.sign(isNaN(value) ? 1 : Number(value));
		const inv  = 1/val;
		const rev  = 1/(inv - Math.trunc(inv));
		/*-- valores especiais --*/
		if (!Number.isFinite(val) || Number.isInteger(val))
			return {sign: sign, int: val, num: 0, den: 1};
		if (Number.isInteger(inv))
			return {sign: sign, int: 0, num: 1, den: inv};
		if (val >= 1) {
			const split = this.split(val - Math.trunc(val));
			return {sign: sign, int: Math.trunc(val), num: split.num, den: split.den};
		}
		/*-- análise decimal --*/
		const data = {sign: sign, int: 0, num: 0, den: 1};
		const list = [
			{calc: "val", base:  2, val: val, rep: null, int: 0, num: 0, den: 1},
			{calc: "inv", base:  2, val: inv, rep: null, int: 0, num: 0, den: 1},
			{calc: "rev", base:  2, val: rev, rep: null, int: 0, num: 0, den: 1},
			{calc: "val", base: 10, val: val, rep: null, int: 0, num: 0, den: 1},
			{calc: "inv", base: 10, val: inv, rep: null, int: 0, num: 0, den: 1},
			{calc: "rev", base: 10, val: rev, rep: null, int: 0, num: 0, den: 1},
			{calc: "ten", base: 10, val: val, rep: null, int: 0, num: 0, den: 1}
		]
		/*-- analisando cada método --*/
		.map(function(v,i,a) {
			v.dec = v.val.toString(v.base).split(".")[1];
			v.rep = this.decRepeat(v.dec, v.base);
			const find = v.rep;
			if (v.calc !== "ten" && (!find || !find.num || !find.den)) return v;
			/*-- divisão por 10^n --*/
			if (v.calc === "ten") {
				v.num = Number(v.dec);
				v.den = Number("1" + "0".repeat(v.dec.length));
			}
			/*-- invertido 1/v --*/
			else if (v.calc === "inv") {
				v.num = find.den;
				v.den = Math.trunc(inv)*find.den + find.num;
			}
			/*-- revertido 1/(v - i) --*/
			else if (v.calc === "rev") {
				v.num = Math.trunc(rev)*find.den + find.num;
				v.den = find.den + Math.trunc(rev)*Math.trunc(inv)*find.den + Math.trunc(inv)*find.num;
			}
			/*-- padrão --*/
			else {
				v.num = find.num;
				v.den = find.den;
			}
			/*-- fatorando numerador e denominador --*/
			const reduce = this.reduce(v.num, v.den);
			v.num = reduce.num;
			v.den = reduce.den;
			/*-- readaptando valor inteiro --*/
			while (v.num >= v.den) {
				v.num -= v.den;
				v.int++;
			}
			return v;
		}, this)
		/*-- ordenando pelo melhor resultado (menor denominador) --*/
		.sort(function(a, b) {
			if (a.rep === null || b.rep === null) return b.rep === null ? -1 : 1;
			return a.den <= b.den ? -1 : 1;
		});
		/*-- retornando melhor resultado obtido --*/
		data.int = list[0] === null ? data.int : list[0].int;
		data.num = list[0] === null ? data.num : list[0].num;
		data.den = list[0] === null ? data.den : list[0].den;
		return data;
	},
	/**. '{object float64data(number value)}: Retorna informações sobre a notação binária do número flutuante:
	|Nome|Tipo|Descrição|
	|bin|string|Representação binária do número|
	|sign|string|Representação binária do sinal|
	|ext|string|Representação binária do exponte|
	|main|string|Representação binária da mantissa|
	|note|string|Representação binária da notação|**/
	float64data: function (value) {
		const data   = {bin: ""};
		const buffer = new ArrayBuffer(8);
		const view   = new DataView(buffer);
		/*-- definir float --*/
		view.setFloat64(0, value);
		/*-- capturar valores dos bytes (8 bits) --*/
		for (let i = 0; i < 8; i++) {
			let byte = view.getUint8(i).toString(2);
			data.bin += "0".repeat(8 - byte.length) + byte;
		}
		/*-- extraindo dados --*/
		const exp = parseInt(data.bin.slice(1,12), 2) - 1023;
		const ref = `1${data.bin.slice(-52)}`;
		data.sign = data.bin[0];
		data.exp  = data.bin.slice(1,12);
		data.main = data.bin.slice(-52);
		data.note = `1,${data.main}x2^${exp}`;
		return data;
	},
	/**. '{string humanNormalize(string num)}: Retorna a notação decimal normalizada:
	- O valor deve estar em notação decimal sem sinal;
	- O ponto separa a parte inteira da decimal;
	- Valores inteiros não precisam fixar a parte decimal; e
	- Valor menor que 1 precisa ter a parte inteira fixada em zero.**/
	humanNormalize: function(num) {
		const re  = /^\s*[-+]?(?:0+)?(\d+)(?:\.(\d+))?\s*$/;
		const val = String(num).match(re);
		const int = val === null || !val[1] ? "0" : val[1];
		const dec = val === null || !val[2] ?  "" : val[2].replace(/0+$/, "");
		return int + (dec === "" ? "" : "." + dec);
	},
	/**. '{string humanCompare(string num1, string num2)}: Retorna 0 se os argumentos (ver '{humanNormalize}) forem iguais, 1 se o primeiro for maior que o segundo e -1 se o segundo for maior que o primeiro.**/
	humanCompare: function(num1, num2) {
		const data = this.humanMatch(num1, num2)
		return data[0] === data[1] ? 0 : (data[0] > data[1] ? 1 : -1);
	},
	/**. '{array humanMatch(string num1, string num2)}: Retorna os argumentos '{num1} e '{num2} com a quatidade de dígitos (parte inteira e decimal) equiparada (ver '{humanNormalize}).**/
	humanMatch: function(num1, num2) {
		num1 = this.humanNormalize(num1);
		num2 = this.humanNormalize(num2);
		const re    = /^(\d+)(?:\.(\d+))?$/;
		const find1 = num1.match(re);
		const find2 = num2.match(re);
		const data1 = {int: find1[1].length, dec: find1[2] ? find1[2].length : 0};
		const data2 = {int: find2[1].length, dec: find2[2] ? find2[2].length : 0};
		const frac  = (data1.dec + data2.dec) > 0;
		const info1 = [
			"0".repeat(data2.int > data1.int ? data2.int - data1.int : 0) + find1[1],
			frac ? (find1[2] ? find1[2] : "") + ("0".repeat(data2.dec > data1.dec ? data2.dec - data1.dec : 0)) : ""
		].join(frac ? "." : "");
		const info2 = [
			"0".repeat(data1.int > data2.int ? data1.int - data2.int : 0) + find2[1],
			frac ? (find2[2] ? find2[2] : "") + ("0".repeat(data1.dec > data2.dec ? data1.dec - data2.dec : 0)) : ""
		].join(frac ? "." : "");
		return [info1, info2];
	},
	/**. '{string humanSum(string num1, string num2)}: Retorna a soma dos argumentos (ver '{humanNormalize}).**/
	humanSum: function(num1, num2) {
		const data  = this.humanMatch(num1, num2);
		num1 = data[0].split("");
		num2 = data[1].split("");
		let val, j;
		for (let i = num1.length - 1; i >= 0; i--) {
			if (num1[i] === ".") continue;
			val = Number(num1[i]) + Number(num2[i]);
			num1[i] = val > 9 && i > 0 ? val%10 : val;
			if (val > 9 && i > 0) {
				j = i + (num1[i-1] === "." ? -2 : -1);
				num1[j] = Number(num1[j]) + 1;
			}
		}
		return this.humanNormalize(num1.join(""));
	},
	/**. '{string humanSub(string num1, string num2)}: Retorna a diferença enter argumentos (ver '{humanNormalize}).**/
	humanSub: function(num1, num2) {
		const data  = this.humanMatch(num1, num2);
		if (data[0] === data[1]) return "0";
		num1 = data[data[1] > data[0] ? 1 : 0].split("");
		num2 = data[data[1] > data[0] ? 0 : 1].split("");
		let val, j;
		for (let i = num1.length - 1; i >= 0; i--) {
			if (num1[i] === ".") continue;
			val = Number(num1[i]) - Number(num2[i]);
			num1[i] = val < 0 ? 10 + val : val;
			if (val < 0) {
				j = i + (num1[i-1] === "." ? -2 : -1);
				num1[j] = Number(num1[j]) - 1;
			}
		}
		return this.humanNormalize(num1.join(""));
	},
	/**. '{string humanMult(string num1, string num2)}: Retorna a multiplicação dos argumentos (ver '{humanNormalize}).**/
	humanMult: function(num1, num2) {
		const zero = /^0+?$/;
		const data = this.humanMatch(num1, num2);
		const cut  = data[0].indexOf(".") >= 0 ? 2*data[0].split(".")[1].length : 0;
		num1 = data[0].replace(".", "");
		num2 = data[1].replace(".", "");
		if (zero.test(num1) || zero.test(num2)) return "0";
		const sum = Array(2*num1.length - 1);
		let val;
		/*-- calculando --*/
		for (let i = num2.length - 1; i >= 0; i--) {
			for (let j = num1.length - 1; j >= 0; j--) {
				val = (Number(num2[i]) * Number(num1[j]))  + (typeof sum[i+j] === "number" ? sum[i+j] : 0);
				sum[i+j] = val > 9 && (i+j) > 0 ? val%10 : val;
				if (val > 9 && (i+j) > 0)
					sum[i+j-1] = (typeof sum[i+j-1] === "number" ? sum[i+j-1] : 0) + Math.trunc(val/10);
			}
		}
		const mult = sum.join("");
		return this.humanNormalize(cut > 0 ? (mult.slice(0, mult.length - cut) + "." + mult.slice(-cut)) : mult);
	},
	/**. '{string humanPow(string num, integer exp)}: Retorna a potencialização dos argumentos (ver '{humanNormalize}). O argumento '{exp} deve ser um inteiro positivo.**/
	humanPow: function(num, exp) {
		exp = isNaN(exp) ? 0 : Math.trunc(Math.abs(Number(exp)));
		if (exp === 0) return "1";
		let pow = num;
		for (let i = 2; i <= exp; i++)
			pow = this.humanMult(num, pow);
		return this.humanNormalize(pow);
	},
	/**. '{string humanDiv(integer num, integer den, integer max, boolean debug)}: Retorna a divisão entre dois decimais (ver '{humanNormalize}):
	|Argumento|Descrição|
	|'{num}|Numerador|
	|'{den}|Denominador|
	|'{max}|Número máximo de casas decimais, padrão 64|
	|'{debug}|Se verdadeiro, exibe o desenvolvimento da divisão|**/
	humanDiv: function(num, den, max, debug) {
		max = !Number.isInteger(Number(max)) || Number(max) < 0 ? 64 : Number(max);
		const data = this.humanMatch(num, den);
		const zero = /0$/;
		/*-- obter valores normalizados --*/
		num = data[0].replace(".", "").replace(/^0+/, "");
		den = data[1].replace(".", "").replace(/^0+/, "");
		/*-- checar divisões especiais --*/
		if (num === den || num === "" || den === "" || den === "1")
			return den === "" ? "" : (num === "" ? "0" : (den === "1" ? num : "1"));
		/*-- adequar quantidade de dígitos do numerador --*/
		let div = "";
		while (this.humanCompare(num, den) < 0) {
			num += "0";
			div += div.indexOf(".") < 0 ? "0." : "0";
		}
		/*-- cortar zeros ao fim dos números --*/
		while (zero.test(num) && zero.test(den)) {
			num = num.replace(zero, "");
			den = den.replace(zero, "");
		}
		/*-- definir dados iniciais --*/
		let gap, val, sub;
		gap = num.slice(0, den.length);
		if (this.humanCompare(gap, den) < 0) gap = num.slice(0, den.length + 1);
		num = num.slice(gap.length);
		/*-- checar valores --*/
		while (gap !== "" && div.match(/(\.\d*|.?)$/)[1].length - 1 < max) {
			/*-- baixou um zero do numerador --*/
			if (gap === "0") {
				div += "0";
				gap  = num.length > 0 ? num[0]       : "";
				num  = num.length > 0 ? num.slice(1) : "";
				continue;
			}
			/*-- o número baixado é inferior ao denominador --*/
			if (this.humanCompare(gap, den) < 0) {
				div += num.length > 0 ? "0" : (div.indexOf(".") < 0 ? "." : "0");
				gap += num.length > 0 ? num[0] : "0";
				num  = num.length > 0 ? num.slice(1) : "";
				continue;
			}
			/*-- procurando dígito multiplicador --*/
			for (let i = 9; i >= 0; i--) {
				val = this.humanMult(den, i);
				if (this.humanCompare(gap, val) >= 0) {
					div += String(i) /*+ (num.length === 0 && div.indexOf(".") < 0 ? "." : "")*/;
					sub  = this.humanSub(gap, val);
					if (debug)
						console.log(`${gap}'${num}/${den}; ${i} x ${den} = ${val}; ${gap} - ${val} = ${sub} (${div})`);
					gap  = sub === "0" ? (num.length > 0 ? num[0] : "") : (sub + (num.length > 0 ? num[0] : "0"));
					div += gap === "" || num.length > 0 ? "" : (div.indexOf(".") < 0 ? "." : "");
					num  = num.length > 0 ? num.slice(1) : num;
					break;
				}
			}
		}
		return this.humanNormalize(div);
	},
	/**. '{string humanDecBit(number value)}: Retorna o valor decimal do número ignorando o último digito (incerteza).**/
	humanDecBit: function(value) {
		if (isNaN(value) || Number.isInteger(Number(value))) return 0;
		const bin = Number(value).toString(2).split(".");
		const sig = bin[0][0] === "-" ? "-" : "";
		const dec = bin[1].replace(/0+$/, "");
		const exp = dec.length;
		const den = this.humanPow(2, exp);
		const cut = Math.abs(this.exp10(1/Math.pow(2,dec.length))) + 1;
		/*-- transformando binário em decimal: soma de bit_n * 1/2^n --*/
		let n, pow, num = "0";
		for (let i = 0; i < dec.length; i++) {
			if (dec[i] === "1") {
				n   = exp-(i+1);
				pow = this.humanPow(2, n);
				num = this.humanSum(num, pow);
			}
		}
		/*-- aplicando ajustes --*/
		const div = this.humanDiv(num, den);
		return sig + Number(Number(div).toFixed(cut-2));
	},
	/**. '{array crypto(integer bit, integer size, boolean uint)}: Retorna uma lista "aleatória" de inteiros:
	|Argumento|Descrição|
	|bit|Tamanho dos inteiros (8, 16 ou 32)|
	|size|Quantidade de inteiros|
	|uint|Se falso, poderá conter inteiros negativos|**/
	crypto: function(bit, size, uint) {
		let list;
		switch(bit) {
			case 32: list = uint !== false ? new Uint32Array(size) : new Int32Array(size); break;
			case 16: list = uint !== false ? new Uint16Array(size) : new Int16Array(size); break;
			default: list = uint !== false ? new Uint8Array(size)  : new Int8Array(size);  break;
		};
		return window.crypto.getRandomValues(list);
	},
	/**. '{string random(integer min, integer max, integer len, integer set)}: Retorna conjuntos de inteiros positivos "aleatórios":
	|Nome|Descrição|
	|min|Menor valor do conjunto|
	|max|Maior valor do conjunto|
	|size|Tamanho do conjunto|
	|sets|Quantidade de conjuntos|**/
	random: function(min, max, size, sets) {
		if (min > max) {
			const temp = min;
			min = max;
			max = temp;
		}
		const uint = min < 0 || max < 0 ? false : true;
		const len  = Math.max(Math.abs(min), Math.abs(max));
		const bit  = len > 2**16 ? 32 : (len > 2**8 ? 16 : 8);
		const list = [];
		let loop;
		while (list.length < sets) {
			loop = 0;
			let data = [], base;
			while (data.length < size) {
				data = this.crypto(bit, bit*size, uint)
				.filter(function(v,i,a) {
					return v >= min && v <= max && a.indexOf(v) === i;
				}).slice(0, size);
				if (++loop > 100000)
					throw new RangeError("The attempt to define the sample went beyond what is reasonable; redefine the parameters.");
			}
			base = data.sort(function (a,b) {return a < b ? -1 : 1;}).join(", ");
			if (list.indexOf(base) < 0) list.push(base);
		}
		return list.join("\n");
	},
	/**. '{string bytes(number value)}: Retorna a notação em bit/bytes.**/
	bytes: function(value) {
		value = isNaN(value) ? 0 : Math.abs(Math.trunc(8*Number(value))/8);
		const scale = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
		if (!Number.isFinite(value) || value < 1)
			return value < 1 ? `${Math.trunc(8*value)} b` : "∞ B";
		let i = -1;
		while(++i < scale.length - 1 && value >= 1024) value /= 1024;
		return `${value.toFixed(Number.isInteger(value) ? 0 : 2)} ${scale[i]}`;
	},
};