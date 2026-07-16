/**
#3 Matemática
O objeto '{__MATH} apresenta uma série de ferramentas para cálculos genéricos. Nenhum argumento será checado, observar a descrição.**/
const __MATH = {
	/**. '{array _primes}: Apresenta uma lista de números primos, que pode aumentar conforme demanda.**/
	_primes: [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97],
	/**. '{boolean _isNewPrime(integer value)}: Função de checagem do método '{primes} ('{value} deve ser um positivo ímpar).**/
	_isNewPrime: function(value) {
		if (Number.isInteger(Math.sqrt(value))) return false;
		const end = Math.ceil(Math.sqrt(value));
		let   num = 0;
		while (this._primes[++num] < end)
			if (value%this._primes[num] === 0) return false;
		return true;
	},
	/**. '{array primes(integer value)}: Retorna uma lista ascendente de números primos menores ou igual a '{value}.**/
	primes: function(value) {
		value = Number.isFinite(value) ? Math.abs(value) : 0;
		let last = this._primes[this._primes.length - 1];
		/*-- se o número estiver na lista de primos, retornar os números --*/
		if (value <= last)
			return this._primes.filter(function(v,i,a) {return v <= value;});
		/*-- se não estiver na lista, acrescentar à lista de primos até o primeiro número maior que o valor --*/
		while(this._primes[this._primes.length - 1] < value)
			if (this._isNewPrime(last = last + 2)) this._primes.push(last);
		/*-- retornar lista --*/
		return this._primes.slice(0, this._primes.length - 1);
	},
	/**. '{object reduce(integer num, integer den)}: Retorna um objeto com os argumentos reduzido ao máximo divisor comum '{gcd}.**/
	reduce: function(num, den) {
		/*-- checar se são inteiros diferentes de zero --*/
		if (!Number.isInteger(num) || !Number.isInteger(den) || num === 0 || den === 0)
			return {num: 0, den: 0, gcd: 0};
		/*-- checar se são divisíveis --*/
		if (num >= den ? num%den === 0 : den%num === 0)
			return {num: num >= den ? num/den : 1, den: num >= den ? 1 : den/num, gcd: num >= den ? den : num};
		/*-- checar se são divisíveis por 10 --*/
		let gcd = 1;
		while (num%10 === 0 && den%10 === 0) {
			num /= 10;
			den /= 10;
			gcd *= 10;
		}
		/*-- fatorar --*/
		const base = this.primes(Math.min(num, den));
		const data = {num: Math.abs(num), den: Math.abs(den), gcd: gcd};
		let i  = 0;
		let p1 = base.indexOf(data.num);
		let p2 = base.indexOf(data.den);
		/*-- se o primo for maior que um dos números: parar fatoração --*/
		while (data.num >= base[i] && data.den >= base[i] && i < base.length) {
			/*-- ambos já são primos: parar a fatoração --*/
			if (p1 >=0 && p2 >=0) break;
			/*-- um é primo: adiantar a fatoração --*/
			if ((p1 >= 0 || p2 >= 0) && (i < p1 || i < p2))
				i = p1 > p2 ? p1 : p2;
			if (data.num%base[i] === 0 && data.den%base[i] === 0) {
				data.num /= base[i];
				data.den /= base[i];
				data.gcd *= base[i];
				p1 = base.indexOf(data.num);
		    p2 = base.indexOf(data.den);
			}
			else {
				i++;
			}
		}
		data.num *= Math.sign(num);
		data.den *= Math.sign(den);
		return data;
	},
	/**. '{integer bitInt(number value)}: Retorna a quantidade de bits da parte inteira do número.**/
	bitInt: function(value) {
		return Math.trunc(Math.abs(value)).toString(2).split(".")[0].length;
	},

	/**. '{any dec10(number value, string output)}: Retorna u{valor absoluto} da parte decimal do número em potência de 10:
	|'{output}|retorno|Destição|
	|array|array|Retorna os decimais como itens do array|
	|string|string|Retorna o decimal como string|
	|Ausente|number|Retorna o decimal como número|.**/
	dec10: function (value, output) {
		if (!Number.isFinite(value) || Number.isInteger(value)) return 0;
		const dec = [];
		let prev = Math.trunc(value), next, num, den, i = 0;
		while((value * Math.pow(10, i++))%1 !== 0) {
			den  = Number(`1e${i}`);
			next = Math.trunc(value * den);
			num  = next - prev*10;
			prev = next;
			dec.push(num);
		}
		dec.forEach(function(v,i,a) {a[i] = Math.abs(v);});
		if (output === "array")  return dec;
		if (output === "string") return `0.${dec.join("")}`;
		return Number(`0.${dec.join("")}`);
	},
	/**. '{number dec10(number value)}: Retorna o u{valor absoluto} da parte decimal do número mediante conversão de binário.**/
	dec2: function(value) {
		if (!Number.isFinite(value) || Number.isInteger(value)) return 0;
		return value.toString(2).split(".")[1].split("").reduce(function(sum,v,i,a) {
			return sum + (v === "1" ? Math.pow(2, -(i + 1)) : 0);
		}, 0);
	},
	/**. '{number decN(number value, integer n)}: Retorna o u{valor absoluto} da parte decimal do número com a precisão '{n} casas decimais (0 a 17). Se a precisão estiver ausente, um valor padrão será definido conforme bits da parte inteira.**/
	decN: function(value, n) {
		if (!Number.isFinite(value) || Number.isInteger(value)) return 0;
		const bit = this.bitInt(value);
		n = Number.isInteger(n) && n >= 0 && n <= 100 ? n : (bit > 16 ? 0 : 17 - bit);
		return Number("0."+value.toPrecision(n).split(".")[1].replace(/0+$/, ""));
	},

	round: function(value) {
		return Math.trunc(value)+this.decN(value);
	},








//TODO near é um pé no saco de difícil
	near: function(value) {
		for (let i = 1; i <= 100; i++) {
			let near = Number(value.toFixed(i));
			//console.log(i, value, near, Math.abs(value - near), Number.EPSILON)
			if (Math.abs(value - near) < Number.EPSILON) return near;

		}
		return value;
	},

	frac: function (value) {
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