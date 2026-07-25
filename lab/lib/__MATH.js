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
	/**. '{array getPrimes(integer value)}: Retorna uma lista de números primos até o valor positivo inteiro de '{value}.**/
	getPrimes: function(value) {
		const data = isNaN(value) ? 0 : Math.trunc(Math.abs(Number(value)));
		const sqrt = Math.sqrt(data);
		const list = [];
		while (this.primes[this.primes.length - 1] <= sqrt) this.addPrime();
		return this.primes.filter(function(v,i,a) {return v <= sqrt;})
	},
	/**. '{boolean isPrime(integer value)}: Retorna verdadeiro se o valor positivo inteiro de '{value} for primo.**/
	isPrime: function(value) {
		/*-- valores constantes na lista --*/
		const data = isNaN(value) ? 0 : Math.trunc(Math.abs(Number(value)));
		if (this.primes.indexOf(data) >= 0) return true;
		/*-- valores não constantes na lista --*/
		const list = this.getPrimes(data);
		for (let i = 0; i < list.length; i++)
			if (data%list[i] === 0) return false;
		return list.length > 0;
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
		let p1, p2, gcd = 1;
		while (num%10 === 0 && den%10 === 0) {
			num /= 10;
			den /= 10;
			gcd *= 10;
		}
		/*-- fatorar --*/
		const primes = this.getPrimes(Math.min(num, den));
		for (let i = 0; i < primes.length; i++) {
			p1 = this.isPrime(num);
			p2 = this.isPrime(den);
			/*-- um deles já é primo --*/
			if (p1 || p2) return {num: num, den: den, gcd: gcd};
			/*-- ambos são divisíveis pelo primo --*/
			if (num%primes[i] === 0 && den%primes[i] === 0) {
				num /= primes[i];
				den /= primes[i];
				gcd *= primes[i];
				i--;
			}
		}
		return {num: num, den: den, gcd: gcd};
	},
	/**. '{number dec(number value, boolean round)}: Retorna o decimal do número por meio da valor textual aplicando arredondamento se '{round} for diferente de falso.**/
	dec: function(value, round) {
		const re = /^([-+]?)(?:\d+\.(\d+)|((?:\d+\.)?(?:\d+e\-\d+)))$/i;
		const rd = /(\d)\1+(\d+)$/;
		if (isNaN(value) || Number.isInteger(Number(value)) || !re.test(value)) return 0;
		const find = String(value).match(re);
		let   text = find[3] ? value : `${find[1]}0.${find[2]}`;
		/*-- arrendondamento --*/
		if (round !== false && !find[3] && rd.test(text)) {
			const look = text.match(rd);
			const swap = new RegExp(`${look[1]}${look[1]}\\d+$`);
			text = text.replace(swap, look[1].repeat(20));
		}
		return Number(text);
	},
	/**. '{number adjust(number value)}: Retorna o número com dízimas ajustadas conforme o método '{dec}.**/
	adjust: function(value) {
		const dec = this.dec(value);
		const int = Math.trunc(Math.abs(value));
		return dec === 0 ? int : (int === 0 ? dec : Number(String(dec).replace("0", int)));
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
		/*-- transformando binário em decimal: soma de bit_n *  1/2^n --*/
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
};