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
	|note|string|Representação binária da notação|
	|int|string|Representação binária do inteiro|
	|dc|string|Representação binária do decimal|**/
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
		data.int  = exp >= 0 ? ref.slice(0, exp+1) : "0";
		data.dec  = exp >= 0 ? ref.slice(exp+1)    : ("0".repeat(-exp-1) + ref);
		return data;
	},
	/**. '{number float64(number value)}: Retorna o decimal do número por meio dos dados binários.**/
	float64: function(value) {
		if (isNaN(value) || Number.isInteger(Number(value))) return 0
		const bin = this.float64data(value);
		let sum = 0
		for (let i = 0; i < bin.dec.length; i++)
			sum += bin.dec[i] === "0" ? 0 : Math.pow(2, -(i+1));
		return sum;
	},
	/**. '{string humanDiv(integer num, integer den, integer dec)}: Retorna a divisão entre dois números inteiros positivos:
	|Argumento|Descrição|
	|'{num}|Numerador|
	|'{den}|Denominador|
	|'{dec}|Número máximo de casas decimais, padrão 50|**/
	humanDiv: function(num, den, dec) {
		dec = Number.isInteger(dec) && dec > 0 ? dec : 50;
		num = Math.abs(Math.trunc(num));
		den = Math.abs(Math.trunc(den));
		let val, div = "";
		/*-- num < den --*/
		while(num < den) {
			num = 10*num;
			div = div + (div.indexOf(".") < 0 ? div+"0." : "0");
		}
		/*-- dividindo --*/
		while (num > 0 && div.replace(/^\d+\.?/, "").length < dec) {
			val = Math.trunc(num/den);
			num = 10*(num - val*den);
			div = div + String(val) + (num > 0 && div.indexOf(".") < 0 ? "." : "");
		}
		return div;
	},
	/**. '{string humanSum(string num1, string num2)}: Retorna a soma de dois números decimais positivos escritos em forma de string.**/
	humanSum: function(num1, num2) {
		num1 = String(num1) + (String(num1).indexOf(".") < 0 ? ".0" : "");
		num2 = String(num2) + (String(num2).indexOf(".") < 0 ? ".0" : "");
		const re   = /^(\d+)\.(\d+)$/;
		const len1 = num1.match(re);
		const len2 = num2.match(re);
		if (len1 === null || len2 === null) return "0";
		/*-- normalizando parte inteira --*/
		if (len1[1].length > len2[1].length)
			num2 = "0".repeat(len1[1].length - len2[1].length) + num2;
		else if (len1[1].length < len2[1].length)
			num1 = "0".repeat(len2[1].length - len1[1].length) + num1;
		/*-- normalizando parte decimal --*/
		if (len1[2].length > len2[2].length)
			num2 = num2 + "0".repeat(len1[2].length - len2[2].length);
		else if (len1[2].length < len2[2].length)
			num1 = num1 + "0".repeat(len2[2].length - len1[2].length);
		/*-- calculando --*/
		let val1, val2, val;
		const sum = Array(num1.length);
		for (let i = sum.length - 1; i >= 0 ; i--) {
			val1   = Number(num1[i]);
			val2   = Number(num2[i]);
			sum[i] = num1[i] === "." ? "." : ((Number.isInteger(sum[i]) ? sum[i] : 0) + (val1 + val2));
			if (sum[i] !== "." && sum[i] > 9 && i > 0) {
				sum[i] = sum[i]%10;
				sum[i - (num1[i-1] === "." ? 2 : 1)] = 1;
			}
		}
		return sum.join("").replace(/0+$/, "");
	},
	/**. '{string humanFloat64(number value)}: Retorna o decimal do número por meio dos dados binários.**/
	humanFloat64: function(value) {
		if (isNaN(value) || Number.isInteger(Number(value))) return 0
		const bin = this.float64data(value);
		let val, sum = null;
		for (let i = 0; i < bin.dec.length; i++) {
			if (bin.dec[i] === "1") {
				val = this.humanDiv(1, Math.pow(2, i+1));
				sum = this.humanSum(sum === null ? "0" : sum, val);
			}
		}
		return sum;
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



	frac: function (value) {
		//FIXME tem que resolver os problemas com as dízimas


		let prev = Math.trunc(value);
		let dec = [];
		let next, num, den, data, a = 0, b = 1, i = 0;
		/*-- enquanto a multiplicação não eliminar os decimais --*/
		//TODO este while consegue extrair as casas decimais uma a uma

		while((value * Math.pow(10, i++))%1 !== 0) {
			den  = Number(`1e${i}`);
			next = Math.trunc(value * den);
			num  = next - prev*10;
			prev = next;
			if (num !== 0) {
				data = this.reduce(num, den);
				a = (a*data.den + b*data.num);
				b = b*data.den;
				data = this.reduce(a, b);
				a = data.num;
				b = data.den;
			}
		}
		return `${a}/${b}`;
	},
};