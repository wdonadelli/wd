/* wd5.js https://github.com/wdonadelli/wd
 *
 * Copyright 2023-2024 Willian Donadelli <wdonadelli@github.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * SPDX-License-Identifier: MIT
 */

"use strict";

const wd = (function() {
	const __CSS = `
		/*-- Inert ---------------------------------------------------------------*/
		${"inert" in document.body ? "" : "[inert] {display: none !important;}"}
		/*-- Freeze --------------------------------------------------------------*/
		.js-wd-freeze {overflow: hidden !important;}
		/*-- Tip/Validity --------------------------------------------------------*/
		.css-wd-form-error, .css-wd-tooltip {
			display: inline-block;
			padding: 0.25em;
			margin: 0.25em 0;
			font-size: var(--var-js-wd-font-size);
			font-family: var(--var-js-wd-font-type);
			border: thin solid;
			border-radius: 0.2em;
		}
		.css-wd-tooltip {
			display: none;
			position: absolute;
			top: 100%;
			left: 0;
		}
		*:hover > .css-wd-tooltip {
			display: inline-block;
			animation: js-wd-animation-emerge 3s ease;
		}
		/*-- Tip -----------------------------------------------------------------*/













		/*-- Signal: box --*/
		[data-js-wd-signal] {
			position: relative !important;
			display: flex !important;
			flex-direction: column !important;
			padding: 0 !important;
			margin: 0.25em 3px !important;
			box-shadow: 2px 2px 2px rgba(0,0,0,0.5) !important;
			animation: js-wd-animation-expand 0.5s ease !important;
			font-size: 14px !important;
			font-family: Tahoma, Verdana, sans-serif !important;
			line-height: 1.2 !important;
			border-radius: 0.3em !important;
			background-repeat: no-repeat !important;
			background-position: center !important;
			background-size: cover !important;
			background-origin: content-box !important;
		}

		[data-js-wd-signal="info"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(140, 180, 255) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(-15)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\24d8</text></svg>") !important;
		}
		[data-js-wd-signal="ok"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(160, 250, 160) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(0)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\2714</text></svg>") !important;
		}
		[data-js-wd-signal="warn"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(255, 255, 150) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(-15)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\26A0</text></svg>") !important;
		}
		[data-js-wd-signal="error"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(255, 200, 200) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(0)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\1F6AB</text></svg>") !important;
		}
		[data-js-wd-signal="dialog"] {
			margin: 0 !important;
			max-width: 95vw !important;
			min-width: 25vw !important;
			color: rgb(50, 50, 50) !important;
			background-color: rgb(200,220,220) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(-15)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\2BD1</text></svg>") !important;
		}

		@media screen and (min-width: 768px) {
			[data-js-wd-signal="dialog"] {max-width: 75vw !important;}
		}

		.js-wd-signal-head {
			padding: 0.5em 2em 0.5em 0.5em !important;
			border-bottom: thin solid !important;
			font-weight: bold !important;
		}
		.js-wd-signal-body {
			padding: 0.5em !important;
			white-space: pre-wrap !important;
		}
		.js-wd-signal-node {
			padding: 0 0.5em !important;
			display: flex !important;
			flex-direction: column !important;
		}
		.js-wd-signal-fire {
			display: flex !important;
			flex-direction: column !important;
			padding: 0.5em !important;
		}
		@media screen and (min-width: 768containspx) {
			.js-wd-signal-fire {
				flex-direction: row !important;
				justify-content: space-evenly !important;
				align-items: center !important;
			}
		}
		.js-wd-signal-kill {
			position: absolute !important;
			top: 0 !important;
			right: 0 !important;
			margin:  0.4em !important;
			height: 1em !important;
			width: 1em !important;
			border-radius: 0.5em !important;
			line-height: calc(5 / 6) !important;
			font-size: 1em !important;
			text-align: center !important;
			cursor: pointer !important;
			z-index: 10 !important;
		}
    .js-wd-signal-kill:focus, .js-wd-signal-kill:hover {outline: 1px solid !important;}



		/*-- dataset -------------------------------------------------------------*/
		[data-wd-grid] [aria-sort] {cursor: pointer !important;}
		[data-wd-grid] [aria-sort]:before {content: "\\2195 " !important;;}
		[data-wd-grid] [aria-sort="descending"]:before {content: "\\2191 " !important;}
		[data-wd-grid] [aria-sort="ascending"]:before  {content: "\\2193 " !important;}

		[data-wd-send], [data-wd-set], [data-wd-edit], [data-wd-shared] {
			cursor: pointer !important;
		}

		/*-- data-wd-float --------------------------------------------------------*/
		[data-wd-float] {cursor: context-menu !important;}


		[data-wd-repeat] > *, [data-wd-load] > * {visibility: hidden !important;}
		[data-wd-slide] > * {animation: js-wd-animation-emerge 1s, js-wd-animation-shrink-out 0.5s !important;}
		svg .js-wd-chart-hide {display: none !important;}
		@media screen and (min-width: 768px) {svg .js-wd-chart-hide {display: inline !important;}}
		wd-mark {background-color: rgba(154,205,50,0.7) !important; display: inline !important; border-radius: 0.2em !important; color: #000000 !important;}


		/*-- Códificação ---------------------------------------------------------*/

		/*-- containers --*/



		/*-- Importantes ---------------------------------------------------------*/
		/*FIXME o que é isso*/
		/*[data-js-wd-hide]:not([data-js-wd-show]) {
			display: none !important;
		}*/
		[data-js-wd-hide] {display: none !important;}

		[data-js-wd-cursor="move"],    [data-js-wd-cursor="move"]    * {cursor:     grab !important;}
		[data-js-wd-cursor="moving"],  [data-js-wd-cursor="moving"]  * {cursor:     move !important;}
		[data-js-wd-cursor="drag"],    [data-js-wd-cursor="drag"]    * {cursor:     grab !important;}
		[data-js-wd-cursor="draging"], [data-js-wd-cursor="draging"] * {cursor: grabbing !important;}


		[data-js-wd-area] {
			position: fixed !important;
			background-color: rgba(127,127,127,0.2) !important;
			z-index: 9999 !important;
		}
		[data-js-wd-area="vertical"] {
			top: 0 !important;
			bottom: 0 !important;
			height: 100vh !important;
			border-left:  thin dashed rgb(128, 128, 128) !important;
			border-right: thin dashed rgb(128, 128, 128) !important;
		}
		[data-js-wd-area="horizontal"] {
			left: 0 !important;
			right: 0 !important;
			width: 100vw !important;
			border-top:    thin dashed rgb(128, 128, 128) !important;
			border-bottom: thin dashed rgb(128, 128, 128) !important;
		}

		.js-wd-mark-text {
			background-color: lime !important;
			color: black !important;
		}
		`;
			//"*::backdrop {background-color: white;}",
			//TODO ver coloração https://developer.mozilla.org/pt-BR/docs/Web/CSS/background-color
			//TODO interessante https://developer.mozilla.org/en-US/docs/Web/CSS/::file-selector-button






/*============================================================================*/
	/**#3 Números
	''constructor object __Number(number input=0)''
	Construtor para manipulação de números. O argumento '{input} se refere ao número de entrada do construtor.**/
	function __Number(input) {
		if (!(this instanceof __Number)) return new __Number(input);
		let check = __Type(input);
		if (!check.number) throw new TypeError("Value entered is not a valid number.");
		Object.defineProperties(this, {
			_check: {value: check},
			value:  {value: check.value},
		});
	}

	Object.defineProperties(__Number.prototype, {
		constructor: {value: __Number},
		/**. '{array _primes}: Lista de números primos até 1000.**/
		_primes: {value: [
			2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,
			103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,
			199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,
			313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,
			433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,
			563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,
			673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,
			811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,
			941,947,953,967,971,977,983,991,997
		]},
		/**. '{boolean finite}: Checa se o número é finito.**/
		finite: {get: function() {return this._check.finite;}},
		/**. '{number valueOf()}: Retorna o valor numérico.**/
		valueOf: {value: function() {return this.value;}},
		/**. '{number toString()}: Retorna o valor em forma de string.**/
		toString: {value: function() {return this._check.toString()}},
		/**. '{number abs}: Retorna o valor absoluto do número.**/
		abs: {get: function() {return Math.abs(this.value);}},
		/**. '{integer int}: Retorna a parte inteira do número.**/
		int: {get: function() {return Math.trunc(this.value);}},
		/**. '{string type}: Retorna o tipo do número (zero, infinite, integer, decimal).**/
		type: {
			get: function() {
				const types = ["infinite", "zero", "integer", "decimal"];
				for (let i = 0; i < types.length; i++)
					if (this._check[types[i]] === true) return types[i];
				return "unknow";
			}
		},
		/**. '{string random(object options)}: Retorna conjuntos de números inteiros "aleatórios" conforme especificado no argumento '{options}:
		|Nome|Descrição|
		|min|Número inteiro que indica o menor valor do conjunto|
		|max|Número inteiro que indica o maior valor do conjunto|
		|len|Número inteiro que indica o tamanho do conjunto|
		|set|Número inteiro que indica a quantidade de conjuntos|**/
		random: {
			value: function(options) {
				/*-----------------------------------------------
				let a = new Uint8Array(len);
				window.crypto.getRandomValues(a)
				-----------------------------------------------*/
				if (!__Type(options).object) options = {};
				const min  = "min" in options ? Number(options.min) : 1;
				const max  = "max" in options ? Number(options.max) : 60;
				const len  = "len" in options ? Number(options.len) : 6;
				const set  = "set" in options ? Number(options.set) : 3;
				const bets = [];
				let bet, list, num;
				while (bets.length < set) {
					list = [];
					while (list.length < len) {
						num = Math.trunc(min) + Math.trunc(max*Math.random());
						if (list.indexOf(num) < 0) list.push(num);
					}
					list.sort(function (a,b) {return a < b ? -1 : 1;});
					bet = list.join("\t");
					if (bets.indexOf(bet) < 0) bets.push(bet);
				}
				return bets.join("\n");
			}
		},
		/**. '{array crypto(integer bit, integer len)}: Retorna uma lista de '{len} itens contendo números inteiros de comprimento '{bit} (8, 16 ou 32).**/
		crypto: {
			value: function(bit, len) {
				bit = Number(bit);
				len = Number(len);
				len = isFinite(len) && len >= 1 ? Math.trunc(len) : 1;
				let array;
				switch(bit) {
					case 32: array = new Uint32Array(len); break;
					case 16: array = new Uint16Array(len); break;
					default: array = new Uint8Array(len);  break;
				}
				window.crypto.getRandomValues(array);
				return array;
			}
		},
		/**. '{float dec}: Retorna a parte decimal do número (zero se infinito ou inteiro).**/
		dec: {
			get: function() {
				if (this.type !== "decimal") return 0;
				if (this.abs < 1) return this.value;
				const sign = this.value < 0 ? "-0." : "0.";
				return Number(sign+String(this.value).split(".")[1]);
			}
		},
		/**. '{number fixed(integer length, boolean round)}: Fixa a quantidade máxima de casas decimais definidas em '{length}. O argumento '{round}, se falso, não arredondará o valor.**/
		fixed: {
			value: function(length, round) {
				if (this.type !== "decimal") return this.value;
				round  = round !== false;
				length = isFinite(length) && Number(length) >= 0  ? Math.trunc(Number(length)) : 0;
				const fixed = Number(this.value.toFixed(length));
				const base  = Math.pow(10, length);
				const cut   = Math.trunc(base*this.value)/base;
				return round ?  fixed : cut;
			}
		},
		/**. '{array primes}: Retorna uma lista com os números primos até o número informado.**/
		primes: {
			get: function() {
				if (this.abs < 2) return [];
				const value = this.abs;
				/*-- Checando se o número primo já consta na lista --*/
				const last = this._primes[this._primes.length - 1];
				if (value <= last) {
					let i = 0;
					while (value >= this._primes[i]) i++;
					return this._primes.slice(0, i);
				}
				/*-- Adicionando novos números primos --*/
				for (let num = last+2; num <= value; num += 2) {
					for (let item = 0; item < this._primes.length; item++) {
						if (num % this._primes[item] === 0)
							break;
						else if (item === this._primes.length - 1)
							this._primes.push(num);
					}
				}
				return this._primes;
			}
		},
		/**. '{boolean prime}: Checa se número é primo.**/
		prime: {
			get: function() {
				/*-- testar se é um inteiro maior que 1 --*/
				if (this.type !== "integer" || this.value < 2)
					return false;
				/*-- testar se ele já existe na lista --*/
				if (this.value <= this._primes[this._primes.length - 1])
					return this._primes.indexOf(this.value) >= 0;
				/*-- verificando se não é divisível por primo --*/
				for (let i = 0; i < this._primes.length; i++)
					if (this.value%this._primes[i] === 0) return false;
				/*-- capturando novos primos até a raiz do número --*/
				new __Number(this.value).primes;
				return this.prime;
			}
		},
		/**. '{array factorization}: Retorna a fatorização do inteiro em números primos.**/
		factorization: {
			get: function() {
				if (this.type !== "integer") return [];
				const list = [];
				let value  = Math.abs(this.int);
				let primes = this._primes;
				let item   = 0;
				/*-- Looping sobre os primos existentes --*/
				while (value >= primes[item] && item < primes.length) {
					if (value%primes[item] === 0) {
						value = value / primes[item];
						list.push(primes[item]);
					} else {item++;}
				}
				/*-- Looping sobre os primos extraordinários --*/
				if (value > 1) {
					new __Number(value).primes;
					while (value >= primes[item] && item < primes.length) {
						if (value%primes[item] === 0) {
							value = value / primes[item];
							list.push(primes[item]);
						} else {item++;}
					}
				}
				return list;
			}
		},
		/**. '{number gcd(...)}: Retorna o máximo divisor comum de números inteiros comparando o número informado com aqueles passados como argumento.**/
		gcd: {
			value: function() {
				const fact = this.factorization;
				const gcd  = [1];
				const args = [];
				/*-- Capturando a fatorização dos argumentos --*/
				for (let i = 0; i < arguments.length; i++) {
					let check = __Type(arguments[i]);
					if (check.integer) {
						let number = new __Number(check.value);
						args.push(number.factorization)
					}
				}
				/*-- Checando fatores em comum --*/
				for (let i = 0; i < fact.length; i++) {
					let found = true;
					let value = fact[i];
					for (let j = 0; j < args.length; j++) {
						let index = args[j].indexOf(value);
						if (index < 0) {
							found = false;
							break;
						} else {
							args[j][index] = null;
						}
					}
					if (found) gcd.push(value);
				}
				/*-- Calculando Máximo Divisor Comum --*/
				let value = 1;
				for (let i = 0; i < gcd.length; i++) value = value * gcd[i];
				return value;
			}
		},
		/**. '{string frac}: Retorna a notação numérica em forma de fração com máximo de 6 dígitos no numerador e aproximação de até 6 casas decimais.**/
		frac: {
			get: function() {
				if (this.type !== "decimal") return this.toString();
				/*--x = a/b = a/(a+n), n = a(1/x-1)--*/
				const int = this.int;
				const dec = Math.abs(this.dec);
				const num = int !== 0 ? String(int)+" " : (this.value < 0 ? "-" : "");
				const max = 1e6; /*-- número máximo de dígitos do numerador --*/
				const err = 6;   /*-- número de casas a arrendondar na checagem  --*/
				let   dnd = 0;   /*-- dividendo --*/
				let   div = 0.5; /*-- divisor (valor não inteiro por causa do while) --*/
				while (!Number.isInteger(div) && ++dnd < max)
				  div = Number((dnd/dec).toFixed(err));
				/*-- caso não tenha encontrado o valor dentro do limite --*/
				if (!Number.isInteger(div)) {
					const str = String(dec.toFixed(err)).split(".")[1];
					dnd = str.replace(/^0+/, "");
					div = String(Math.pow(10, str.length));
					while((dnd%2 === 0 && div%2 === 0) || (dnd%5 === 0 && div%5 === 0)) {
					  let gcd = dnd%2 === 0 && div%2 === 0 ? 2 : 5;
					  dnd = dnd/gcd;
					  div = div/gcd;
					}
				}
				return num+String(dnd)+"/"+String(div);
			}
		},
		/**. '{string bytes}: Retorna a notação em bytes (de i{B} a i{YB}).**/
		bytes: {
			get: function() {
				if (!this.finite) return this.toString()+" B";
				if (this.value < 1)
				 return this.value <= 0 ? "0 B" : Math.trunc(8*this.value)+" b";
				const scale = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
				let exp = scale.length;
				let int = this.int;
				while (--exp >= 0) {
					let pow = Math.pow(1024, exp);
					if (int >= pow) return (int/pow).toFixed(2)+" "+scale[exp];
				}
				return int+" B";
			}
		},
		/**. '{number exp}: Retorna o expoente do número em base 10.**/
		exp: {
			get: function() {
				if (!this.finite || this.value === 0) return !this.finite ? 0 : Infinity;
				let value = this.abs;
				let n = 0;
				while (value < 1 || value >= 10) {
					n    += value < 1 ? -1 : +1;
					value = value * (value < 1 ? 10 : 1/10);
				}
				return n;
			}
		},
		/**. '{string toLocaleString(object options)}: Retorna o número no formato local de acordo com as [configurações]<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat> definidas no argumento '{options}, que possui as seguintes propriedades:
|Nome|Tipo|Descrição|Obrigatório|
|type|string|Tipo de notação a ser exibida|Sim|
|value|string|Informação complementar ao tipo de notação|Depende do tipo de notação|
|display|string|Forma da exibição da notação|Não|
|group|boolean|Separador de milhar|Não|
|decimal|integer|Quantidade de casas decimais (0-20)|Não|
|integer|integer|Quantidade de números inteiros (1-21)|Não|
|digits|integer|Quantidade de números significativos (0-20)|Não|
|sign|string|Exibição do sinal (auto, always, exceptZero, negative, never)|Não|
. Os seguintes tipos são possíveis&colon;
|type|value|display|
|unit|[unidade de medida]<https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier>|short, long, narrow|
|currency|[código monetário]<https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=currency-codes>|symbol, narrowSymbol, name, code|
|compact||short, long|
|percent|||
|scientific|||
|engineering|||
|decimal|||**/
		toLocaleString: {
			value: function(options) {
				if (typeof options !== "object") options = {};
				/*-- {attr: real, name: atalho, values: opções (0 é padrão)} --*/
				const properties = {
					currency: [
						{attr: "style",           name: null,      values: ["currency"]},
						{attr: "currencyDisplay", name: "display", values: ["symbol", "narrowSymbol", "name", "code"]},
						{attr: "currency",        name: "value",   values: []}
					],
					unit: [
						{attr: "style",       name: null,      values: ["unit"]},
						{attr: "unit",        name: "value",   values: []},
						{attr: "unitDisplay", name: "display", values: ["short", "long", "narrow"]},
					],
					percent: [
						{attr: "style", name: null, values: ["percent"]},
					],
					scientific: [
						{attr: "style",    name: null, values: ["decimal"]},
						{attr: "notation", name: null, values: ["scientific"]},
					],
					engineering: [
						{attr: "style",    name: null, values: ["decimal"]},
						{attr: "notation", name: null, values: ["engineering"]},
					],
					compact: [
						{attr: "style",          name: null,      values: ["decimal"]},
						{attr: "notation",       name: null,      values: ["compact"]},
						{attr: "compactDisplay", name: "display", values: ["short", "long"]},
					],
					decimal: [ /*-- padrão --*/
						{attr: "style",    name: null, values: ["decimal"]},
					],
				};
				const property = options.type in properties ? properties[options.type] : properties.decimal;
				/*-- obtendo os dados de configuração --*/
				const config = {};
				for (let i = 0; i < property.length; i++) {
					let item = property[i];
					/*-- propriedade não configurável (name = null) --*/
					if (item.name === null) {
						config[item.attr] = item.values[0];
					}
					/*-- propriedade configurável sem valores definidos (values = []) --*/
					else if (item.values.length === 0) {
						if (item.name in options)
							config[item.attr] = String(options[item.name]);
					}
					/*-- propriedade configurável com valores definidos (values = [...]) --*/
					else {
						let index = item.values.indexOf(options[item.name]);
						config[item.attr] = item.values[index < 0 ? 0 : index];
					}
				}
				/*-- propriedades opcionais --*/
				const intList = new Array(22);
				for (let i = 0; i < intList.length; i++) intList[i] = i;

				if ("sign" in options) {
					let value = ["auto", "always", "exceptZero", "negative", "never"];
					let index = value.indexOf(options.sign);
					if (index >= 0) config.signDisplay = value[index];
				}
				if ("group" in options) {
					let value = ["auto", true, false];
					let index = value.indexOf(options.group);
					if (index >= 0) config.useGrouping = value[index];
				}
				if ("digits" in options) {
					let value = intList.slice(1,22);
					let index = value.indexOf(Number(options.digits));
					if (index >= 0) {
						config.minimumSignificantDigits = value[index];
						config.maximumSignificantDigits = value[index];
					}
				}
				if (!("minimumSignificantDigits" in config)) {
					/* Significant é prevalente sobre Fraction e Integer */
					if ("integer" in options) {
						let value = intList.slice(1,22);
						let index = value.indexOf(Number(options.integer));
						if (index >= 0) config.minimumIntegerDigits = value[index];
					}
					if ("decimal" in options) {
						let value = intList.slice(0,21);
						let index = value.indexOf(Number(options.decimal));
						if (index >= 0) {
							config.minimumFractionDigits = value[index];
							config.maximumFractionDigits = value[index];
						}
					} else if (config.style !== "currency") {
						config.maximumFractionDigits = 20;
					}
				}
				/*-- Retornando valor --*/
				try      {return this.value.toLocaleString(__LANG.value, config);}
				catch(e) {return this.value.toLocaleString(__LANG.value);}
			}
		},
	});
/*===========================================================================*/
	/**#3 Caracteres
	''constructor object __String(string input)''
	Construtor para manipulação de textos. O argumento '{input} define o texto de entrada.**/
	/*-- https://symbl.cc/pt/unicode-table/ --*/
	function __String(input) {
		if (!(this instanceof __String)) return new __String(input);
		input = String(input).normalize("NFC");
		Object.defineProperties(this, {
			_value:  {value: input},
			_parser: {value: new __Parser(input)}
		});
	}

	Object.defineProperties(__String.prototype, {
		constructor: {value: __String},
		/**. '{string valueOf()}: Retorna o valor de entrada.**/
		valueOf: {value: function() {return this._value;}},
		/**. '{string toString()}: Retorna o valor de entrada.**/
		toString: {value: function() {return this._value;}},
		/**. '{string length}: Retorna a quantidade de caracteres.**/
		length: {get: function() {return this._value.length;}},
		/**. '{string upper}: Retorna o valor de entrada em caixa alta.**/
		upper: {get: function() {return this._value.toUpperCase();}},
		/**. '{string lower}: Retorna o valor de entrada em caixa baixa.**/
		lower: {get: function() {return this._value.toLowerCase();}},
		/**. '{string lean}: Retorna o valor de entrada em linha sem espaços extras.**/
		lean: {get: function() {return this._value.replace(/\s+/g, " ").trim();}},
		/**. '{string like}: Retorna o conteúdo textual para fins de comparação por equivalência.**/
		like: {get: function() {return this._value.normalize("NFKC");}},
		/**. '{string clean}: Retorna o valor de entrada sem o intervalo unicode \u0300-\u036f.**/
		clean: {
			get: function() {
				const re = /[\u0300-\u036f]/g;
				return this._value.normalize("NFD").replace(re, "").normalize("NFC");
			}
		},
		/**. '{string near}: Como o '{like}, mas sem acento.**/
		near: {
			get: function() {
				const re = /[\u0300-\u036f]/g
				return this._value.normalize("NFKD").replace(re, "").normalize("NFKC");
			}
		},
		/**. '{string toggle}: Inverte a caixa.**/
		toggle: {
			get: function() {
				const chars = this._value.split("");
				chars.forEach(function(v,i,a) {
					a[i] = v === v.toUpperCase() ? v.toLowerCase() : v.toUpperCase();
				});
				return chars.join("");
			}
			},
		/**. '{string captalize}: Caixa alta na primeira letra de cada palavra apenas.**/
		capitalize: {
			get: function() {
				const chars = this._value.split("");
				chars.forEach(function(v,i,a) {
					let space = i === 0 || (/\s/).test(a[i-1]);
					a[i] = space ? v.toUpperCase() : v.toLowerCase();
				});
				return chars.join("");
			}
		},
		/**. '{string clear(boolean white, boolean accent)}: Limpa espaços desnecessários ou acentos. O argumento '{white}, se diferente de falso, limpa os espaços extras e o argumento '{accent}, se diferente de falso, remove os acentos.**/
		clear: {
			value: function(white, accent) {
				let value = this.valueOf();
				if (white !== false)
					value = value.replace(/\s+/g, " ").trim();
				if (accent !== false)
					value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				return value.normalize();
			}
		},
		/**. '{string mask(string model)}: Checa se a string casa com o formato de máscara definido no argumento '{model} e retorna uma string vazia em caso de insucesso ou os caracteres formatados:
		|Manipulador|Descrição|
		|#|Exige um dígito.|
		|@|Exige um não dígito.|
		|*|Exige um valor qualquer.|
		|?|Separa modelos alternativos caso o anterior não case.|
		|%|Cancela o efeito do manipulador que o precede.|
		. Exemplos:
		|Modelo|Valor|Retorno|
		|##/##/####|01234567|01/23/4567|
		|(##) # ####-####?(##) ####-####|01234567890|(01) 2 3456-7890|
		|(##) # ####-####?(##) ####-####|0123456789|(01) 2345-6789|**/
		mask: {
			value: function(model) {
				/*-------------------------------------------------
					char: lista de caracteres de entrada
					c:    índice do caracter do texto de entrada
					mask: lista de caracteres da máscara
					m:    índice do caracter do modelo da máscara
					base: lista de caracteres de saída
					code: caracteres manipuladores
					ok:   condição do casamento da máscara
			  -------------------------------------------------*/
			  const char = this._value.split("");
				const mask = String(model).split("");
				const code = "#@*%";
				let c = 0, m = -1, ok = true, base = [];
				/*-- looping sobre cada caracteres do modelo --*/
				while (++m < mask.length) {
					/*-- Não fazer nada quando um caracter do modelo for definido como nulo --*/
					if (mask[m] === null) {
						continue;
					}
					/*-- Checar o casamento da máscara ao fim de cada modelo --*/
					else if (mask[m] === "?") {
						/*-- máscara bateu? já checou todos os caracteres de entrada? --*/
						if (ok && c === char.length) return base.join("");
						ok = true; c = 0; base = [];
					}
					/*-- Checar caractere manipulador a ser fixado como caractere comum --*/
					else if (ok && mask[m] === "%") {
						let fixed = code.indexOf(mask[m+1]) >= 0;
						let point = fixed ? mask[m+1] : mask[m];
						base.push(point);
						if (fixed) mask[m+1] = null;
						/*-- Se o caractere do modelo tiver sido informado na entrada, avançar na checagem --*/
						c += char[c] === point ? 1 : 0;
					}
					/*-- Checar se o caractere de entrada casa com o manipulador --*/
					else if (ok && code.indexOf(mask[m]) >= 0) {
						switch(mask[m]) {
							case "#": {ok = (/^\d$/).test(char[c]); break;}
							case "@": {ok = (/^\D$/).test(char[c]); break;}
							case "*": {ok = (/^\.$/).test(char[c]); break;}
						}
						if (ok) {
							base.push(char[c]);
							c++;
						} else {
							base = [];
							c = 0;
						}
					}
					/*-- Adicionar o caractere não manipulador do modelo à saída --*/
					else if (ok) {
						base.push(mask[m]);
						/*-- Se o caractere do modelo tiver sido informado na entrada, avançar na checagem --*/
						c += char[c] === mask[m] ? 1 : 0;
					}
				}
				/*-- máscara bateu? já checou todos os caracteres de entrada? --*/
				return (ok && c === char.length) ? base.join("") : "";
			}
		},
		/**. '{string dash}: Retorna uma string identificadora no formato de traços (alfabetos latinos).**/
		dash: {
			get: function() {
				const only  = /(\s|\-)+/g;
				const trash = /[^a-zA-Z0-9_.:\-]/g;
				const trim  = /^\-+|\-+$/g;
				const chars = this.clean.replace(only, "-").replace(trash, "").replace(trim, "");
				if (chars.indexOf("-") >= 0)
					return chars.toLowerCase()
				return chars.replace(/[A-Z]/g, function(x) {return "-"+x.toLowerCase();});
			}
		},
		/**. '{string camel}: Retorna uma string identificadora no formato de camelCase (alfabetos latinos).**/
		camel: {
			get: function() {
				return this.dash.replace(/\-./g, function(x) {return x[1].toUpperCase();})
			}
		},
		/**. '{matrix csv}: Retorna uma matriz (array) a partir de uma string CSV.**/
		csv: {get: function() {return this._parser.csvTable.tableValues.matrixCSV.get();}},
		/**. '{object json}: Retorna objeto JSON a partir de uma string nesse formato.**/
		json: {get: function() {return this._parser.stringJSON.get();}},


		chain: {
			value: function(name) {
				//FIXME
				const data = Object.getOwnPropertyDescriptor(__String.prototype, name);
				const test = new __Type(typeof data === "object" ? data.get : null);
				return test.function ? new __String(this[name]) : this;
			}


		},

	});


/*===========================================================================*/
	/**#3 Data e Tempo
	#4 Ano
	''constructor object __Year(integer year)''
	Construtor para resgate de informações sobre o ano ('{year}).**/
	function __Year(year) {
		if (!(this instanceof __Year)) return new __Year(year);
		const error = `The year must be an integer (${year}).`
		const check = new __Type(year);
		if (!check.integer) throw new RangeError(error);
		Object.defineProperties(this, {
			/**. '{integer year}: Retorna o ano.**/
			year: {value: check.value},
		});
	}

	Object.defineProperties(__Year.prototype, {
		constructor: {value: __Year},
		/**. '{boolean leap}: Informa se o ano é bissexto.**/
		leap: {get: function() {return __DATETIME.leap(this.year);}},
		/**. '{integer daysElapsedYear}: Retorna os dias decorridos de 0000-01-01T00:00:00 (valor 0) até o primeiro dia do ano.**/
		daysElapsedYear: {
			get: function() {
				let   days = this.year > 0 ? 365 : 0;
				let   back = this.year > 0 ? (this.leap ? 365 : 364) : 0;
				const y365 = 365*this.year;
				const y400 = Math.trunc(this.year/400);
				const y004 = Math.trunc(this.year/4);
				const y100 = Math.trunc(this.year/100);
				days += y365 + y004 - y100 + y400;
				return days - back;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 Mês
	''constructor object __Month(integer year, integer month)''
	Construtor para resgate de informações sobre meses a partir da informação do ano ('{year}) e do mês (1-12) ('{month}). Herda propriedades do objeto __Year.**/
	function __Month(year, month) {
		if (!(this instanceof __Month)) return new __Month(year, month);
		__Year.call(this, year);
		const error = `The month must be an integer from 1 to 12 (${month}).`;
		const check = new __Type(month);
		if (!check.integer || check < 1 || check > 12) throw RangeError(error);
		Object.defineProperties(this, {
			/**. '{integer month}: Registra o mês (1-12).**/
			month: {value: check.value},
		});
	}

	__Month.prototype = Object.create(__Year.prototype, {
		constructor: {value: __Month},
		/**. '{integer width}: Retorna a quantidade de dias do mês.**/
		width: {get: function() {return __DATETIME.max(this.year, this.month);}},
		/**. '{integer daysElapsedMonth}: Retorna os dias decorridos de 0000-01-01T00:00:00 (valor 0) até o primeiro dia do mês.**/
		daysElapsedMonth: {
			get: function() {
				const year = this.daysElapsedYear;
				const days = this.firstDayMonthYear;
				return year + days - 1;
			}
		},
		/**. '{integer firstDayMonthYear}: Retorna o dia do ano em que o mês inicia.**/
		firstDayMonthYear: {
			get: function() {
				const gap  = this.month > 2 && this.leap ? 1 : 0;
				const days = [null,1,32,60,91,121,152,182,213,244,274,305,335];
				return days[this.month] + gap;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 Dia
	''constructor object __Day(integer year, integer month, integer day)''
	Construtor para resgate de informações sobre dias a partir da informação do ano ('{year}), mês (1-12) ('{month}) e dia (1-31) ('{day}). Herda propriedades do objeto __Month.**/
	function __Day(year, month, day) {
		if (!(this instanceof __Day)) return new __Day(year, month, day);
		__Month.call(this, year, month);
		const error = `The day must be an integer from 1 to ${this.width} (${day}).`;
		const check = new __Type(day);
		if (!check.integer || check < 1 || check > this.width) throw new RangeError(error);
		Object.defineProperties(this, {
			/**. '{integer day}: Registra o dia (1-31).**/
			day: {value: check.value}
		});
	}

	__Day.prototype = Object.create(__Month.prototype, {
		constructor: {value: __Day},
		/**. '{integer days}: Retorna o dia do ano.**/
		days: {get: function() {return this.firstDayMonthYear + this.day - 1;}},
		/**. '{integer daysElapsed}: Retorna os dias decorridos de 0000-01-01T00:00:00 (valor 0) até o dia.**/
		daysElapsed: {
			get: function() {
				const year = this.daysElapsedYear;
				const days = this.days;
				return year + days - 1;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 Dia da Semana
	''constructor object __Week(integer year, integer month, integer day)''
	Construtor para resgate de informações sobre a semana a partir da informação do ano ('{year}), mês (1-12) ('{month}) e dia (1-31) ('{day}). Herda propriedades do objeto __Day.**/
	function __Week(year, month, day) {
		if (!(this instanceof __Week)) return new __Week(year, month, day);
		__Day.call(this, year, month, day);
		/*-- referências (Domingo, 01/01/2023 = 0) --*/
		const sun  = new __Year(2023).daysElapsedYear;
		const days = {init: this.daysElapsedYear, today: this.daysElapsed};
		/*-- localizar dia da semana --*/
		const wday = {};
		for (let i in days) {
			let diff = (0 + (days[i] - sun))%7;
			wday[i] = (diff + (diff < 0 ? 7 : 0));
		}
		/*-- localizar semana do ano a partir de 01 de janeiro --*/
		const ref  = days.init - wday.init;
		const week = Math.trunc((days.today - ref)/7);
		Object.defineProperties(this, {
			/**. '{integer weekDay}: Registra o dia da semana, de domingo a sábado (1-7).**/
			weekDay: {value: wday.today + 1},
			/**. '{integer firstWeekDay}: Registra o primeiro dia da semana do ano (1-7).**/
			firstWeekDay: {value: wday.init + 1},
			/**. '{integer week}: Retorna a semana do ano (1-54), com início no domingo, desde o primeiro dia do ano.**/
			week: {value: week + 1},
		});
	}

	__Week.prototype = Object.create(__Day.prototype, {
		constructor: {value: __Week},
		/**. '{string YYYYWww}: Retorna a semana conforme a{ISO 8601}[href="https://en.wikipedia.org/wiki/ISO_8601#Week_dates"], ou seja, a semana começa na segunda-feira do primeiro dia útil.**/
		//FIXME verificar se foi considerado que 1º de janeiro não é dia útil!
		YYYYWww: {
			get: function() {
				function week(year, days) {
					const init = new __Week(year + 0, 1, 1);
					const last = new __Week(year + 1, 1, 1);
					const data = [+1,0,-1,-2,-3,+3,+2];
					const min  = init.daysElapsed + data[init.weekDay - 1];
					const max  = last.daysElapsed + data[last.weekDay - 1] - 1;
					if (days >= min && days <= max)
						return {Y: year, P: year, w: Math.trunc((days - min)/7) + 1, type: "week"};
					return week(year + (days < min ? -1 : 1), days);
				}
				const iso = week(this.year, this.daysElapsed);
				return __DATETIME.iso(iso);
			}
		},
		/**. '{integer work}: Retorna a quantidade de dias úteis decorridos até o dia.**/
		work: {
			get: function() {
				const sun  = ([null,1,7,6,5,4,3,2])[this.firstWeekDay];
				const sat  = ([null,7,6,5,4,3,2,1])[this.firstWeekDay];
				const end  = this.days;
				const dsun = this.day < sun ? 0 : (Math.trunc((end - sun)/7) + 1);
				const dsat = this.day < sat ? 0 : (Math.trunc((end - sat)/7) + 1);
				return end - (dsun + dsat);
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 Tempo
	''constructor object __Time(integer year, integer month, integer day, integer hour, integer minute, i{finite} second)''
	Construtor para resgate de informações sobre a hora a partir da informação do ano ('{year}), mês (1-12) ('{month}), dia (1-31) ('{day}), hora (0-24) ('{hour}), minuto (0-59) ('{minute}) e segundo (0-59.999) ('{second}).  Herda propriedades do objeto __Week.**/
	function __Time(year, month, day, hour, minute, second) {
		if (!(this instanceof __Time)) return new __Time(year, month, day, hour, minute, second);
		__Week.call(this, year, month, day);
		const checkH = new __Type(hour);
		const checkM = new __Type(minute);
		const checkS = new __Type(second);
		if (!checkH.integer || checkH > 24 || checkH < 0)
			throw RangeError(`The hour value must be an integer from 0 to 24 (${hour}).`);
		if (!checkM.integer || checkM > 59 || checkM < 0)
			throw RangeError(`The minute value must be an integer from 0 to 59 (${minute}).`);
		if (!checkS.finite || checkS >= 60 || checkS < 0)
			throw RangeError(`The value of the second must be an integer from 0 to 59.999 (${second}).`);
		Object.defineProperties(this, {
			/**. '{integer hour}: Registra a hora (0-23).**/
			hour:   {value: checkH.value % 24},
			/**. '{integer minute}: Registra o minuot (0-59).**/
			minute: {value: checkM.value},
			/**. '{number second}: Registra o segundo (0-59.999).**/
			second: {value: checkS.value},
		});
	}

	__Time.prototype = Object.create(__Week.prototype, {
		constructor: {value: __Time},
		/**. '{string toString()}: Retorna o tempo no formato "YYYY-MM-DDThh:mm:ss".**/
		toString: {value: function() {return this.codes.YYYYMMDDhhmmss;}},
		/**. '{string valueOf()}: Retorna o mesmo que a propriedade '{timeElapsed}.**/
		valueOf:  {value: function() {return this.timeElapsed;}},
		/**. '{number time}: Retorna a quantidade total de segundos.**/
		time: {get: function() {return 3600*this.hour + 60*this.minute + this.second;}},
		/**. '{integer timeElapsed}: Retorna os segundos decorridos de 0000-01-01T00:00:00 (valor 0) até a hora.**/
		timeElapsed: {get: function() {return 24*3600*this.daysElapsed + this.time;}},
		/**. '{string meridiem}: Retorna AM ou PM de acordo com a hora.**/
		meridiem: {get: function() {return this.hour < 12 ? "AM" : "PM";}},
		/**. '{integer h12}: Retorna a hora no formato de 12 horas (AM/PM).**/
		h12: {
			get: function() {
				return this.hour === 0 ? 12 : this.hour - (this.hour < 13 ? 0 : 12);
			}
		},
		/**. '{object next()}: Retorna uma instância do objeto para o dia seguinte.**/
		next: {
			value: function() {
				const d = this.day === this.width ? 1 : (this.day + 1);
				const m = this.day === this.width ? (this.month + 1) : this.month;
				const y = m > 12 ?  (this.year + 1) : this.year;
				return new __Time(y, (m > 12 ? 1 : m), d, this.hour, this.minute, this.second);
			}
		},
		/**. '{object walk(integer value)}: Retorna uma instância do objeto caminhando o valor de segundos definidos no argumento.**/
		walk: {
			value: function(value) {
				const check = new __Type(value);
				if (!check.finite) value = 0;
				const time = this.timeElapsed;
				return this.constructor.toTimeObject(time + value);
			}
		},
		/**. '{string codes(string format)}: Retorna um objeto contendo propriedades temporais abreviadas ('{format}).**/
		codes: {
			value: function(format) {
				const data = {
		 			Y: this.year,    YYYY: this.year,
		 			M: this.month,     MM: this.month,   MMM: this.month,   MMMM: this.month,
					D: this.day,       DD: this.day,
					d: this.weekDay,   dd: this.weekDay, ddd: this.weekDay, dddd: this.weekDay,
					w: this.week,      ww: this.week,
		 			H: this.hour,      HH: this.hour,
		 			h: this.h12,       hh: this.h12,
		 			m: this.minute,    mm: this.minute,
		 			s: this.second,    ss: this.second,
		 			p: this.meridiem,   P: this.year < 0 ? -1 : 1,
				};
				return __DATETIME.string(data[format], format);
			}
		},
		/**. '{string toString()}: Retorna uma stringo no formato "dddd, PD MMMM YYYY h:mm p".**/
		toString: {
			value: function() {
				const data = {P: "", YYYY: "", MMMM: "", D: "", h: "", mm: "", dddd: "", p: ""};
				for (let i in data) data[i] = this.codes(i);
				return `${data.dddd}, ${data.P}${data.D} ${data.MMMM} ${data.YYYY} ${data.h}:${data.mm} ${data.p}`;
			}
		},
		/**. '{number toString()}: Retorna o mesmo valor da propriedade '{timeElapsed}.**/
		valueOf: {
			value: function() {return this.timeElapsed;}
		},
		/**. '{string log}: Retorna uma stringo no formato "PYYYY-MM-DD-dd-Www HH:mm:ss ...".**/
		log: {
			get: function() {
				const week = this.isoWeek;
				const days = this.daysElapsed;
				const time = this.timeElapsed;
				const data = {P: "", YYYY: "", MM: "", DD: "", HH: "", mm: "", ss: "", ww: "", dd: ""};
				for (let i in data) data[i] = this.codes(i);
				return [
					`${data.P}${data.YYYY}-${data.MM}-${data.DD}-${data.dd}-W${data.ww}`,
					`${data.HH}:${data.mm}:${data.ss} day ${days} time ${time} (${week})`
				].join(" ")
			}
		},

	});

	Object.defineProperties(__Time, {
		/**#5 Métodos e Propriedades Estáticos
		. '{array daysToYear(integer value)}: Retorna o ano (item 0) a partir do número de dias ('{value}).**/
		daysToYear: {
			value: function(value) {
				const check = new __Type(value);
				if (!check.integer)
					throw TypeError("[daysToYear] Value must be an integer.");
				value = check.value;
				/*-- Ano zero --*/
				if (value >= 0 && value <= 365) return [0];
				/*-- Correção para contagem dos anos diferentes de zero --*/
				let   year = 0;
				let   days = value > 0 ? value - 365 : value;
				/*-- dias por período --*/
				const d001 = 365;
				const d004 =  4*d001 + 1;
				const d100 = 25*d004 - 1;
				const d400 =  4*d100 + 1;
				/*-- anos por período (progressão aritmética) --*/
				const y400 = Math.trunc(days/d400);
				days -= y400 * d400;
				const y100 = Math.trunc(days/d100);
				days -= y100 * d100;
				const y004 = Math.trunc(days/d004);
				days -= y004 * d004;
				const y001 = Math.trunc(days/d001);
				days -= y001 * d001;
				const rest = days === 0 ? 0 : (value < 0 ? -1 : (value > 365 ? +1 : 0));
				year += 400*y400 + 100*y100 + 4*y004 + y001 + rest;
				return [year];
			}
		},
		/**. '{array daysToMonth(integer value)}: Retorna o ano (item 0) e o mês (item 1) a partir do número de dias ('{value}).**/
		daysToMonth: {
			value: function(value) {
				const year = this.daysToYear(value)[0];
				const leap = __DATETIME.leap(year);
				const d365 = [31,59,90,120,151,181,212,243,273,304,334,365];
				const d366 = [31,60,91,121,152,182,213,244,274,305,335,366];
				const days = leap ? d366 : d365;
				const data = new __Year(year);
				const diff = value - data.daysElapsedYear;
				for (let i = 0; i < days.length; i++)
					if (diff < days[i]) return [year, i+1];
				/*-- precaução em caso de falha --*/
				let help = new __Month(year,12);
				while (value < help.daysElapsedMonth)
					help = new __Month(year, help.month-1);
				return [year, help.month]
			}
		},
		/**. '{array daysToDate(integer value)}: Retorna o ano (item 0), o mês (item 1) e o dia (item 2) a partir do número de dias ('{value}).**/
		daysToDate: {
			value: function(value) {
				const data = this.daysToMonth(value);
				const date = new __Month(data[0], data[1]);
				const day  = value - date.daysElapsedMonth + 1;
				return [date.year, date.month, day];
			}
		},
		/**. '{array secondsToTime(number value)}: Retorna a hora (item 0), o minuto (item 1) e o segundo (item 2) a partir do número de segundos ('{value}).**/
		secondsToTime: {
			value: function(value) {
				const check = new __Type(value);
				if (!check.finite)
					throw TypeError("[secondsToTime] Value must be a finite number.");
				const day    = 24*3600;
				const rest   = check.value%day;
				const time   = rest + (rest < 0 ? day : 0);
				const hour   = Math.trunc(time/3600);
				const minute = Math.trunc((time - 3600*hour)/60);
				const second = time - 60*minute - 3600*hour;
				return [hour, minute, Number(second.toFixed(3))];
			}
		},
		/**. '{array secondsToDate(integer value)}: Retorna o ano (item 0), o mês (item 1), o dia (item 2), a hora (item 3), o minuto (item 4) e o segundo (item 5) a partir do número de segundos ('{value}).**/
		secondsToDate: {
			value: function(value) {
				const day  = 24*3600;
				const sec  = value%day;
				const days = Math.trunc((value - sec)/day);
				const date = this.daysToDate(days + (value < 0 && sec !== 0 ? -1 : 0)	);
				const time = this.secondsToTime(sec);
				return [date[0],date[1],date[2],time[0],time[1],time[2]];
			}
		},
		/**. '{array weekToDate(string value)}: Retorna o ano (item 0), o mês (item 1) e o dia (item 2) a partir da string no formato de semana ('{value}).**/
		weekToDate: {
			value: function(value) {
				const info = __DATETIME.test(value);
				if (info === null || info.type !== "week") return null;
				const year = info.P * info.Y;
				const init = new __Year(year);
				const days = init.daysElapsedYear + 7*(info.w - 2);
				const date = this.daysToDate(days);
				let   time = new __Time(date[0], date[1], date[2], 0, 0, 0);
				while (time.YYYYWww !== info.iso) {
					time = time.next();
					if (Math.abs(time.year - year) > 1) return null;
				}
				return [time.year, time.month, time.day];
			}
		},
		/**. '{object toTimeObject(integer value)}: Retorna o objeto '{__Time} a partir do número de segundos ('{value}).**/
		toTimeObject: {
			value: function(value) {
				const data = this.secondsToDate(value);
				return new __Time(data[0],data[1],data[2],data[3],data[4],data[5]);
			}
		},
		/**. '{async sequentialityTest(integer start, integer stop)}: Testa a sequencialidade da data do ano '{start} até '{stop}.**/
		sequentialityTest: {
			value: async function(start, stop) {
				if (stop === undefined || stop < start) stop = start;
				const init = new Date().valueOf();
				const data = new __Time(start,1,1,0,0,0);
				const hist = {a: data, b: data.next()};
				let  count = 1;
				while (hist.b.year <= stop) {
					let days = {a: hist.a.daysElapsed, b: hist.b.daysElapsed};
					let wday = {a: (hist.a.weekDay - 1), b: (hist.b.weekDay - 1)};
					let week = {a: hist.a.week, b: hist.b.week};
					let err  = null;
					if (days.b - days.a !== 1)
						err = "daysElapsed";
					else if ((wday.a + 1)%7 !== wday.b)
						err = "weekDay";
					if (hist.a.year === hist.b.year) {
						if (wday.b > wday.a && week.b !== week.a)
							err = "week"
						else if (wday.b < wday.a && week.b - week.a !== 1)
							err = "week"
					}
					if (err !== null)
						throw ReferenceError(`${err}\nA) ${hist.a.log}\nB) ${hist.b.log}`);
					hist.a = hist.b;
					hist.b = hist.b.next();
					count++;
				}
				if (hist.b.daysElapsed !== data.daysElapsed+count)
					throw ReferenceError(`count (${count})\nA) ${data.log}\nB) ${hist.b.log}`);
				const time = ((new Date()).valueOf() - init)/1000;
				console.info(`${time}s, ${count} days, ${count/time} days/s`);
			}
		}
	});

/*----------------------------------------------------------------------------*/
	/**#4 Data e Tempo
	''constructor object __DateTime(any input)''
	Construtor para manipulação de data/tempo. O argumento '{input} aceita os seguintes valores:
	- Data, tempo, data e tempo, mês e semana (se válida) nos parâmetros da biblioteca;
	- Valor numérico que corresponde aos segundos desde 0000-01-01T00:00:00.0000 (segundo 0);
	- Objeto contendo as propriedades year, month, day, hour, minute e second; e
	- Se indefinido, assumirá o valor de data e tempo atuais.**/
	//FIXME procurar pelo construtor e ver se a propriedade type, removeida, é usada.
	function __DateTime(input) {
		if (!(this instanceof __DateTime)) return new __DateTime(input);
		const error = `The date value is unknown (${input})`;
		const data  = {year: 0, month: 1, day: 1, hour: 0, minute: 0, second: 0};
		const value = new __Type(input);
		/*-- objeto (padrão) --*/
		if (value.object) {
			for (let i in data)
				data[i] = i in input ? input[i] : data[i];
		}
		/*-- segundos --*/
		else if (value.integer) {
			const info = __Time.toTimeObject(value.value)
			return new __DateTime(info);
		}
		/*-- data e tempo --*/
		else if (value.nonempty || value.datetime) {
			const info = __DATETIME.toObject(value.nonempty ? input : value.value);
			if (info.type === null) throw new TypeError(error);
			if (info.type === "week") {
				const week = __Time.weekToDate(info.iso);
				if (week === null) throw new TypeError(error);;
				info.year  = week[0];
				info.month = week[1];
				info.day   = week[2];
			}
			return new __DateTime(info);
		}
		/*-- data e tempo atuais --*/
		else if (input === undefined) {
			return new __DateTime(new Date());
		}
		/*-- erro --*/
		else throw new TypeError(error);
		/*-- objeto principal --*/
		const main = new __Time(data.year, data.month,  data.day, data.hour, data.minute, data.second);

		Object.defineProperties(this, {
			_max:  {value: null, writable: true},
			/**. '{object main}: Registra o objeto __Time auxiliar.**/
			main:  {value: main, writable: true},
		});
	}

	Object.defineProperties(__DateTime.prototype, {
		constructor: {value: __DateTime},
		/**. '{object toDateObject}: Retorna um objeto nativo Date com o tempo fixado no ano 2000.**/
		toDateObject: {
			get: function() {
				const sec  = Math.trunc(this.second);
				const mill = 1000*Number("0."+this.format("[ss]").split(".")[1]);
				const utc  = Date.UTC(2000, this.month-1, this.day, this.hour, this.minute, sec, mill)
				const date = new Date(utc);
				return date;
			}
		},
		/**. '{number valueOf()}: Retorna os segundos desde 0000-01-01T00:00:00.000.**/
		valueOf: {value: function() {return this.main.timeElapsed;}},
		/**. '{integer valueOfDate()}: Retorna os dias desde 0000-01-01.**/
		valueOfDate: {value: function() {return this.main.daysElapsed;}},
		/**. '{number valueOfTime()}: Retorna os segundos desde 00:00:00.000.**/
		valueOfTime: {value: function() {return this.main.time;}},
		/**. '{number valueOfDays()}: Retorna os dias desde 0000-01-01 com o tempo como elemento decimal.**/
		valueOfDays: {value: function() {return this.valueOfDate()+this.valueOfTime()/(24*3600);}},
		/**. '{string toString()}: Retorna o tempo no formato YYYY-MM-DDThh:mm:ss.sss.**/
		toString: {value: function() {return this.format("[P][YYYY]-[MM]-[DD]T[HH]:[mm]:[ss]");}},
		/**. '{string toDateString()}: Retorna o tempo no formato YYYY-MM-DD.**/
		toDateString: {value: function() {return this.format("[P][YYYY]-[MM]-[DD]");}},
		/**. '{string toWeekString()}: Retorna a semana no formato YYYY-Www.**/
		toWeekString: {value: function() {return this.main.YYYYWww;}},
		/**. '{string toString()}: Retorna o tempo no formato hh:mm:ss.sss.**/
		toTimeString: {value: function() {return this.format("[HH]:[mm]:[ss]");}},
		/**. '{string toLocaleString()}: Retorna o valor data/tempo no formato local.**/
		toLocaleString: {
			value: function() {
				const date = this.toDateObject;
				const iso  = date.toLocaleString(__LANG.value, {timeZone: "UTC"});
				const from = date.toLocaleDateString(__LANG.value, {timeZone: "UTC"});
				const to   = this.toLocaleDateString();
				return iso.replace(from, to);
			}
		},
		/**. '{string toLocaleDateString()}: Retorna a data no formato local.**/
		toLocaleDateString: {
			value: function() {
				const date = this.toDateObject;
				const year = new __Number(this.year).toLocaleString({group: false});
				const intl = new Intl.DateTimeFormat(__LANG.value, {timeZone: "UTC"});
				if ("formatToParts" in intl) {
					const text = [];
					const part = intl.formatToParts(date);
					for (let i = 0; i < part.length; i++)
						text.push(part[i].type === "year" ? year : part[i].value);
					return text.join("");
				} else {
					const type = intl.resolvedOptions(date).year;
					const yntl = new Intl.DateTimeFormat(__LANG.value, {timeZone: "UTC", year: type});
					const from = yntl.format(date);
					return intl.format(date).replace(from, year);
				}
			}
		},
		/**. '{string toLocaleTimeString()}: Retorna o tempo no formato local.**/
		toLocaleTimeString: {
			value: function() {
				return this.toDateObject.toLocaleTimeString(__LANG.value, {timeZone: "UTC"});
			}
		},
		/**. '{string format(string input, string only)}: Retorna notação de data/tempo pre-formatada a partir de codificação especificada no argumento '{input} (Ex. 5 jan. 2015 é "[D] [MMM] [YYYY]"). O valor da semana (w ou ww) diz respeito ao retorno da propriedade '{week} e não o do método '{toWeekString}. O argumento opcional '{only} limite caracteres de tempo ou data ("date", "time").**/
		format: {
			value: function(input, only) {
				input = String(input);
				const chars = {
					date: `Y YYYY M MM MMM MMMM D DD d dd ddd dddd w ww P`,
					time: `h hh H HH m mm s ss p`
				}
				const type = (only in chars ? chars[only] : `${chars.date} ${chars.time}`).split(" ");
				for (let i = 0; i < type.length; i++) {
					let regexp = new RegExp("\\["+type[i]+"\\]", "gm");
					let code   = this.main.codes(type[i]);
					input = input.replace(regexp, code);
				}
				return input;
			}
		},
		/**. '{integer year}: Define ou retorna o ano.**/
		year: {
			get: function() {return this.main.year;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite || check.value === this.year) return;
				const val = __Number(check.value);
				const int = val.int;
				const dec = val.dec;
				const obj = new __Day(int, this.month, 1);
				const day = this._max === null ? this.day : this._max;
				this.main = new __Time(
					int, this.month, day > obj.width ? obj.width : day,
					this.hour, this.minute, this.second
				);
				this._max = day > obj.width ? day : null;
				if (Math.trunc(12*dec) !== 0)
					this.month = 12*dec;
			}
		},
		/**. '{integer month}: Define ou retorna o mês de 1 a 12 (janeiro a dezembro). O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites. (**Observação**: ao alterar o mês de 2000-01-31 para fevereiro, a data definida será 2000-02-29 e não 2000-03-02)**/
		month: {
			get: function() {return this.main.month;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite) return;
				const val   = __Number(check.value);
				const int   = val.int;
				const dec   = val.dec;
				const month = (12 + (int-1)%12)%12 + 1;
				const year  = Math.trunc((int - (int < 1 ? 12 : 1))/12) + this.year;
				const obj = new __Day(year, month, 1);
				const day = this._max === null ? this.day : this._max;
				this.main = new __Time(
					year, month, day > obj.width ? obj.width : day,
					this.hour, this.minute, this.second
				);
				this._max = day > obj.width ? day : null;
				if (Math.trunc(this.main.width*dec) !== 0)
					this.day = this.main.width*dec;
			}
		},
		/**. '{integer day}: Define ou retorna o dia de 1 a 31. O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites. (**Observação**: Quando o dia de um mês for maior que a quantidade de dias do mês alterado, o valor ficará limitado ao último dia e, ao acrescentar unidades de mês à data 2000-01-31, por exemplo, o resultado será 2000-02-29, 2000-03-31, 2000-04-30, 2000-05-31...**/
		day: {
			get: function() {return this.main.day;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite) return;
				const val = __Number(check.value);
				const int = val.int;
				const dec = val.dec;
				const gap = 24*60*60*(int - this.day);
				this.main = this.main.walk(gap);
				this._max = null;
				if (Math.trunc(24*dec) !== 0)
					this.hour = 24*dec;
			}
		},
		/**. '{integer hour}: Define ou retorna a hora (0 a 23). O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites.**/
		hour: {
			get: function() {return this.main.hour;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite) return;
				const val = __Number(check.value);
				const int = val.int;
				const dec = val.dec;
				const gap = 60*60*(int - this.hour);
				this.main = this.main.walk(gap);
				if (Math.trunc(60*dec) !== 0)
					this.minute = 60*dec;
			}
		},
		/**. '{integer minute}: Define ou retorna o minuto de 0 a 59. O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites.**/
		minute: {
			get: function() {return this.main.minute;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite) return;
				const val = __Number(check.value);
				const int = val.int;
				const dec = val.dec;
				const gap = 60*(int - this.minute);
				this.main = this.main.walk(gap);
				if (Math.trunc(60*dec) !== 0)
					this.second = 60*dec;
			}
		},
		/**. '{number second}: Define ou retorna o segundo de 0 a 59.999. O parâmetro será alterado para o valor definido, exceto quando extrapolar o limites.**/
		second: {
			get: function() {return this.main.second;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite) return;
				const gap = check.value - this.second;
				this.main = this.main.walk(gap);
			}
		},
	});

/*===========================================================================*/
	/**#3 Listas
	''constructor object __Array(array input|void  ...)''
	Construtor para manipulação de listas (array).
	Caso não seja informado argumento, seja atribuído uma lista vazia. Caso seja informado múltiplos argumentos, cada valor corresponderá a um item do array. Caso seja informado um array como argumento, esse será o valor considerado pelo objeto. Caso contrário, o valor informado será o item do array.**/
	function __Array() {
		let input;
		if (arguments.length === 0)
			input = [];
		else if (arguments.length > 1)
			input = Array.prototype.slice.call(arguments);
		else
			input = __Type(arguments[0]).array ? arguments[0] : [arguments[0]];

		if (!(this instanceof __Array))	return new __Array(input);
		Object.defineProperties(this, {
			_value: {value: input},
			/**. '{integer index}: Retorna o valor do índice (ver '{next} e '{index}).**/
			index:  {value: -1, writable: true},
		});
	}

	Object.defineProperties(__Array.prototype, {
		constructor: {value: __Array},
		[Symbol.iterator]: {
			value: function*() {
				for (let i = 0; i < this._value.length; i++) yield this._value[i];
			}
		},
		/**. '{any  valueOf(integer n)}: Retorna o array definido ou um de seus itens se for especificado o índice como argumento, podendo se estender para além do cumprimento do array, repetindo-se a lista de forma constante.**/
		valueOf: {
			value: function(n) {
				const array = this._value.slice();
				if (n === null || n === undefined) return array;
				const check = __Type(n);
				if (!check.finite) return array;
				const value = Math.trunc(check.value);
				const index = (Math.abs(value)*this.length + value)%this.length;
				return array[index];
			}
		},
		/**. '{string toString()}: Retorna a representação em texto do array.**/
		toString: {
			value: function() {
				const parser = __Parser(this._value);
				return parser.jsonString.get();
			}
		},
		/**. '{integer length}: Retorna a quantidade de itens da lista.**/
		length: {get: function() {return this._value.length;}},
		/**. '{any value}: Retorna o valor do item (ver '{next} e '{index}).**/
		value:  {get: function() {return this._value[this.index];}},
		/**. '{boolean  next(boolean run)}: Método para utilizar em looping i{while}. Retornará verdadeiro enquanto os itens não forem percorridos ou enquando o argumento '{run} for diferente de falso. A cada fim de ciclo, com retorno falso, o processo é reiniciado. Utilizar em conjunto com as propriedades '{value} e '{index}.**/
		next: {
			value: function(run) {
				run = run !== false && this.index < this.length - 1;
				this.index = run ? this.index + 1 : -1;
				return run;
			}
		},
		/**. '{array only(string type, boolean keep=false, boolean change=true)}: Retorna uma lista somente com os tipos de itens definidos. O argumento '{type} define o tipo do item a ser mantido na lista (ver '{&lowbar;&lowbar;Type}); o argumento '{keep}, se verdadeiro, manterá na lista o item não enquadrado em '{type} mas com o valor '{null}; e o argumento '{change}, se verdadeiro, alterará o item casado para o valor do objeto ('{valueOf} de '{&lowbar;&lowbar;Type}.**/
		only: {
			value: function(type, keep, change) {
				const list = [];
				for (let i = 0; i < this.length; i++) {
					let check = __Type(this._value[i]);
					if (check[type] === true)
						list.push(change === false ? this._value[i] : check.valueOf());
					else if (keep === true)
						list.push(null);
				}
				return list;
			}
		},
		/**. '{array convert(function' f, string type)}: Retorna uma lista com o resultado de '{f(x)} ou nulo se algo falhar. O argumento '{f} corresponde à função a ser aplicada aos itens da lista. O item da lista será o argumento da função cujo retorno substituirá o valor do item. O argumento opcional '{type} informa o tipo do resultado esperado de acordo com o método '{&lowbar;&lowbar;Type} que, se diferente, devolverá um valor nulo.**/
		convert: {
			value: function(f, type) {
				if (!__Type(f).function) return null;
				const list = this._value.slice();
				const test = new __Type(type);
				for (let i = 0; i < list.length; i++) {
					try {
						let value = f(list[i]);
						let check = new __Type(value);
						if (test.chars && type in check)
							list[i] = check[type] ? check.value : null;
						else
							list[i] = value;
					} catch(e) {
						list[i] = null;
					}
				}
				return list;
			}
		},
		/**. '{number min}: Retorna o menor número finito do conjunto de items da lista ou nulo em caso de vazio.**/
		min: {
			get: function() {
				const list = this.only("finite");
				return list.length === 0 ? null : Math.min.apply(null, list);
			}
		},
		/**. '{number max}:  Retorna o maior número finito do conjunto de items da lista ou nulo em caso de vazio.**/
		max: {
			get: function() {
				const list = this.only("finite");
				return list.length === 0 ? null : Math.max.apply(null, list);
			}
		},
		/**. '{number sum}: Retorna a soma dos números finitos da lista ou nulo em caso de vazio.**/
		sum: {
			get: function() {
				const list = this.only("finite");
				let sum = 0, i = -1;
				while (++i < list.length) sum += list[i];
				return list.length === 0 ? null : sum;
			}
		},
		/**. '{number avg}: Retorna a média dos números finitos da lista ou nulo em caso de vazio.**/
		avg: {
			get: function() {
				const list = this.only("finite");
				let sum = 0, i = -1;
				while (++i < list.length) sum += list[i];
				return list.length === 0 ? null : sum/list.length;
			}
		},
		/**. '{number med}: Retorna a mediana dos números finitos da lista ou nulo em caso de vazio.**/
		med: {
			get: function() {
				const list = this.only("finite");
				const y = list.sort(function(a,b) {return a < b ? -1 : 1;});
				const l = list.length;
				return l === 0 ? null : (l%2 === 0 ? (y[l/2]+y[(l/2)-1])/2 : y[(l-1)/2]);
			}
		},
		/**. '{number harm}: Retorna a média harmônica dos números finitos __diferentes de zero__ da lista ou nulo em caso de vazio.**/
		harm: {
			get: function() {
				const list = this.only("finite");
				let sum = 0, len = 0, i = -1;
				while (++i < list.length) {
				  sum += list[i] === 0 ? 0 : 1/list[i];
				  len += list[i] === 0 ? 0 : 1;
				}
				return len === 0 || sum === 0 ? null : len/sum;
			}
		},
		/**. '{number geo}: Retorna a média geométrica dos números finitos __positivos__ da lista ou nulo em caso de vazio.**/
		geo: {
			get: function() {
				const list = this.only("finite");
				let val = 1, len = 0, i = -1;
				while (++i < list.length) {
				  val  = val * (list[i] <= 0 ? 1 : list[i]);
				  len += list[i] <= 0 ? 0 : 1;
				}
				return len === 0 ? null : Math.pow(val, 1/len);
			}
		},
		/**. '{number gcd}: Retorna o máximo divisor comum dos números inteiros da lista ou nulo em caso de vazio.**/
		gcd: {
			get: function() {
				const list = this.only("integer");
				if (list.length < 2) return list.length === 0 ? null : list[0];
				const number = new __Number(list[0]);
				return number.gcd.apply(number, list.slice(1));
			}
		},
		/**. '{array unique}: Retorna a lista sem valores repetidos.**/
		unique: {
			get: function(){
				return this._value.filter(function(v,i,a) {return a.indexOf(v) === i;});
			}
		},
		/**. '{array mode}: Retorna uma lista com os valores da moda (valores que mais se repetem).**/
		mode: {
			get: function() {
				const items = this.unique;
				const count = [];
				while (count.length !== items.length) count.push(0);
				for (let i = 0; i < this._value.length; i++)
				  count[items.indexOf(this._value[i])]++;
				const max = Math.max.apply(null, count);
				return items.filter(function(v,i,a) {return count[i] === max;});
			}
		},
		/**. '{boolean check(any  ...)}: Checa se os valores informados como argumento estão presentes na lista.**/
		check: {
			value: function() {
				if (arguments.length === 0) return false;
				const list = Array.prototype.slice.call(arguments);
				for (let i = 0; i < list.length; i++)
				  if (this._value.indexOf(list[i]) < 0) return false;
				return true;
			}
		},
		/**. '{array search(any  value)}: Retorna uma lista com os índices onde o valor informado no argumento '{value} foi localizado.**/
		search: {
			value: function(value) {
				const index = [];
				for (let i = 0; i < this._value.length; i++)
				  if (this._value[i] === value) index.push(i);
				return index;
			}
		},
		/**. '{array hide(any  ...)}: Retorna uma lista ignorando os valores informados como argumento.**/
		hide: {
			value: function() {
				const hide = Array.prototype.slice.call(arguments);
				return this._value.filter(function(v,i,a) {return hide.indexOf(v) < 0;});
			}
		},
		/**. '{number count(any  value)}: Retorna a quantidade de vezes que o valor informado no argumento '{value} aparece na lista.**/
		count: {
			value: function(value) {return this.search(value).length;}
		},
		/**. '{array sort(boolean asc)}: Retorna a lista ordenada e organizada por grupos na seguinte sequência: número, tempo, data, datatempo, string, booleano, nulo, nós, lista, objeto, função, expressão regular, indefinido e demais valores.
		. O argumento opcional '{asc} define a classificação da lista. Se verdadeiro, ascendente; se falso, descendente; e, se omitido, inverterá a ordenação atual com prevalência da ordem ascendente.**/
		sort: {
			value: function(asc) {
				const data  = __Type(asc);
				const array = this._value.slice();
				const order = [
					"number", "time", "date", "datetime", "string", "boolean", "null", "node",
					"array", "object", "function", "regexp", "undefined", "unknow"
				];
				asc = data.boolean ? data.value : null;
				array.sort(function(a,b) {
					let A = __Type(a);
					let B = __Type(b);
					/*-- comparação entre tipos diferentes --*/
					if (A.type !== B.type) {
						let typeA = order.indexOf(A.type);
						let typeB = order.indexOf(B.type);
						return typeA < typeB ? -1 : (typeA > typeB ? 1 : 0);
					}
					/*-- comparação entre tipos iguais --*/
					let avalue, bvalue;
					/*-- números/boleanos/data/tempo --*/
					if (A.number || A.boolean || A.date || A.time || A.datetime) {
						avalue = A.value;
						bvalue = B.value;
					}
					/*-- string/node --*/
					else if (A.string || A.node) {
						let aval = new __String(A.node ? a.innerText : a);
						let bval = new __String(B.node ? b.innerText : b);
						avalue = aval.near.toUpperCase().trim();
						bvalue = bval.near.toUpperCase().trim();
					}
					/*-- valores não específicos --*/
					else {
						avalue = a;
						bvalue = b;
					}
					return avalue === bvalue ? 0 : (avalue > bvalue ? 1 : -1);
				});
				/*-- retornando com ordem definida --*/
				if (asc === false || asc === true)
					return asc === true ? array : array.reverse();
				/*-- retornando sem ordem definida --*/
				for (let i = 0; i < array.length; i++)
					if (array[i] !== this._value[i]) return array;
				return array.reverse();
			}
		},
		/**. '{array order}: Retorna uma lista ordenada de forma crescente sem valores repetidos.**/
		order: {
			get: function() {return __Array(this.unique).sort(true);}
		},
		/**. '{array add(any  ...)}: Adiciona itens (argumentos) ao fim da lista e a retorna.**/
		add: {
			value: function() {
				this._value.push.apply(this._value, arguments);
				return this.valueOf();
			}
		},
		/**. '{array jump(any  ...)}: Adiciona itens (argumentos) ao início da lista e a retorna.**/
		jump: {
			value: function() {
				this._value.unshift.apply(this._value, arguments);
				return this.valueOf();
			}
		},
		/**. '{array put(any  ...)}: Adiciona itens (argumentos) __não existentes__ ao fim da lista e a retorna.**/
		put: {
			value: function() {
				for (let i = 0; i < arguments.length; i++)
					if (!this.check(arguments[i]))
						this.add(arguments[i]);
				return this.valueOf();
			}
		},
		/**. '{array concat(any ...)}: Concatena listas ou adiciona itens (argumentos) à lista original.**/
		concat: {
			value: function() {
				for (let i = 0; i < arguments.length; i++) {
					let item = arguments[i];
					this.add.apply(this, __Type(item).array ? item : [item]);
				}
				return this.valueOf();
			}
		},
		/**. '{array replace(any  from, any  to)}: Altera os valores da lista conforme especificado e a retorna. O argumento '{from} definie o valor a ser encontrado e substituído na lista e o argumento '{to} define seu novo valor.**/
		replace: {
			value: function (from, to) {
			  for (let i = 0; i < this._value.length; i++)
			    if (this._value[i] === from) this._value[i] = to;
				return this.valueOf();
			}
		},
		/**. '{array remove(any ...)}: Remove itens (argumentos) da lista e a retorna.**/
		remove: {
			value: function() {
				const list = this.hide.apply(this, arguments);
				while(this._value.length !== 0) this._value.pop();
				this.add.apply(this, list);
				return this.valueOf();
			}
		},
		/**. '{array toggle(any  ...)}: Remove, se existente, ou insere ao fim, se ausente, itens (argumentos) da lista e a retorna.**/
		toggle: {
			value: function() {
				const tgl  = Array.prototype.slice.call(arguments);
				for (let i = 0; i < tgl.length; i++) {
					if (this._value.indexOf(tgl[i]) < 0)
					  this.add(tgl[i]);
					else
					  this.remove(tgl[i]);
				}
				return this.valueOf();
			}
		},
	});

/*============================================================================*/
	/**#3 Nós HTML
	#4 Pesquisa por Elementos
	''constructor object __Query(string css, node root=document)''
	Construtor para obter elementos HTML. O argumento '{css} é um seletor CSS válido e o argumento opcional '{root} define o elemento raiz da busca.	**/
	function __Query(css, root) {
		if (!(this instanceof __Query))	return new __Query(css, root);
		const check = __Type(root);
		Object.defineProperties(this, {
			css:  {value: __Type(css).nonempty ? String(css).trim() : ""},
			root: {value: check.node && check.value.length > 0 ? check.value[0] : document},
		});
	}

	Object.defineProperties(__Query.prototype, {
		constructor: {value: __Query},
		/**. '{array $$}: retorna uma lista de nós ('{NodeList}).**/
		$$: {
			get: function() {
				let elem = null;
				try {elem = this.root.querySelectorAll(this.css);} catch(e) {}
				return __Type(elem).node ? elem : document.querySelectorAll("#_._");
			}
		},
		/**. '{array $}: retorna um nó específico ou lista de nós ('{NodeList}) vazia.**/
		$: {
			get: function() {
				let elem = null;
				try {elem = this.root.querySelector(this.css);} catch(e) {}
				return __Type(elem).node ? elem : this.$$;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 Formulários
	''constructor object __FNode(node input)''
	Construtor para checar características de campo de formulário HTML (argumento '{input}).**/
	function __FNode(input) {
		if (!(this instanceof __FNode))	return new __FNode(input);
		const check = new __Type(input);
		if (!check.node || check.value.length < 1)
			throw new TypeError("Input value is not an HTML node");
		/*-- capturando informações --*/
		const data = {};
		data.node = check.value[0];
		data.tag  = data.node.tagName.toLowerCase();
		data.form = data.tag in this._config;
		if (data.form && "types" in this._config[data.tag]) {
			const attr = String(data.node.getAttribute("type")).toLowerCase();
			const prop = String(data.node.type).toLowerCase();
			const find = this._config[data.tag].types;
			data.type = attr in find ? attr : (prop in find ? prop : "text");
			data.work = attr === prop && attr in find;
			data.cfg  = this._config[data.tag].types[data.type];
		} else {
			data.type = data.form ? data.tag : "";
			data.work = data.form;
			data.cfg  = data.form ? this._config[data.tag] : null;
		}
		data.text  = data.form ? data.cfg.text  : false;
		data.send  = data.form ? data.cfg.send  : false;
		data.check = data.form ? data.cfg.check : "";
		data.mask  = !data.form || !data.cfg.mask ? false : (function () {
			const error = "A1!@#$%¨&*()+";
			const clone = data.node.cloneNode();
			try {clone.value = error;} catch(e) {}
			return clone.value !== error;
		})();
		Object.defineProperties(this, {
			/**. '{node node}: Retorna o nó.**/
			node:   {value: data.node},
			/**. '{string tag}: Retorna a tag do nó.**/
			tag:    {value: data.tag},
			/**. '{boolean form}: Informa se o nó é campo de formulário.**/
			form:   {value: data.form},
			/**. '{string ftype}: Retorna o tipo de formulário ou vazio.**/
			ftype:  {value: data.type},
			/**. '{boolean fmask}: Informa se o formulário possui máscara nativa implementada.**/
			fmask:  {value: data.mask},
			/**. '{boolean fsend}: Informa se o formulário pode ser enviado em requisições ou falso.**/
			fsend:  {value: data.send},
			/**. '{boolean fwork}: Informa se o formulário está implementado.**/
			fwork:  {value: data.work},
			/**. '{string fcheck}: Informa o tipo de verificação do valor do formulário.**/
			fcheck: {value: data.check},
			/**. '{boolean ftext}: Informa se o formulário aceita conteúdo de texto.**/
			ftext:  {value: data.text},
		});
	}

	Object.defineProperties(__FNode.prototype, {
		constructor: {value: __FNode},
		/**. '{object _msg}: Registra algumas mensagens de validação de formulários.**/
		_msg: {
			value: (function(){
				const re   = "[0-9]";
				const elem = __HTML("input", {required: true, title: re, pattern: re, value: "ABC"});
				const msg  = {
					pattern:  elem.validationMessage.replace(re , "?"),
					required: elem.validationMessage
				};
				Object.freeze(msg);
				return msg;
			})()
		},
		/**. '{object _config}: Contém as configurações sobre os campos de formulário.**/
		_config: {
			value: (function() {
				/*-- informações que definem o tipo do campo de formulário -------------
					tag.tipo:config1;config2
						tag: tag do elemento
						tipo: tipo do elemento quando houver (tag input e button)

					SUBMIT: o campo pode ser submetido em um formulário
					VISUAL: o campo possui representação textual
					VALUE.tipo: define o valor aceito pelo campo
					MASK: checar se o campo possui máscara nativa
				----------------------------------------------------------------------*/
				const config = [
					"button.button:VALUE.text;VISUAL",
					"button.reset:VALUE.text;VISUAL",
					"button.submit:SUBMIT;VALUE.text;VISUAL",
					"input.button:VALUE.text",
					"input.checkbox:SUBMIT;VALUE.check",
					"input.color:SUBMIT;MASK;VALUE.text",
					"input.date:SUBMIT;MASK;VALUE.datetime",
					"input.datetime-local:SUBMIT;MASK;VALUE.datetime",
					"input.datetime:SUBMIT;MASK;VALUE.datetime",
					"input.email:SUBMIT;MASK;VALUE.combo",
					"input.file:SUBMIT;VALUE.combo",
					"input.hidden:SUBMIT;VALUE.text",
					"input.image:",
					"input.month:SUBMIT;MASK;VALUE.datetime",
					"input.number:SUBMIT;MASK;VALUE.finite",
					"input.password:SUBMIT;VALUE.text",
					"input.radio:SUBMIT;VALUE.check",
					"input.range:SUBMIT;MASK;VALUE.finite",
					"input.reset:VALUE.text",
					"input.search:SUBMIT;VALUE.text",
					"input.submit:SUBMIT;VALUE.text",
					"input.tel:SUBMIT;VALUE.text",
					"input.text:SUBMIT;VALUE.text",
					"input.time:SUBMIT;MASK;VALUE.datetime",
					"input.url:SUBMIT;MASK;VALUE.text",
					"input.week:SUBMIT;MASK;VALUE.datetime",
					"meter:VALUE.finite",
					"option:VALUE.text;VISUAL",
					"output:VALUE.text;VISUAL",
					"progress:VALUE.finite",
					"select:SUBMIT;VALUE.combo",
					"textarea:SUBMIT;VALUE.text"
				];
				/*-- redesenhando config para objeto --*/
				const data = {};
				for (let i = 0; i < config.length; i++) {
					let item = config[i].split(":");
					let cfg1 = item[0].split(".");
					let cfg2 = item[1].split(";");
					let tag  = cfg1[0];
					let type = cfg1.length > 1 ? cfg1[1] : null;
					let val  = cfg2.filter(function(x) {return (/^VALUE\./).test(x);});
					if (type !== null && !(tag in data))
						data[tag] = {types: {}};
					let obj = type === null ? data : data[tag].types;
					obj[type === null ? tag : type] = {
						mask:  cfg2.indexOf("SUBMIT") >= 0,
						send:  cfg2.indexOf("SUBMIT") >= 0,
						text:  cfg2.indexOf("VISUAL") >= 0,
						check: val.length > 0 ? val[0].split(".")[1] : ""
					}
				}
				Object.freeze(data);
				return data;
			})()
		},
		/**. '{string fname}: Define ou retorna o valor do atributo '{name} do formulário ou vazio.**/
		fname: {
			get: function()  {return this.form ? this.node.name.trim() : "";},
			set: function(x) {
				if (this.form) this.node.name = x === null ? "" : String(x).trim();
			}
		},
		/**. '{any fvalue}: Define ou retorna o valor do formulário ou nulo.**/
		fvalue: {
			get: function() {
				if (!this.form) return null;
				const node  = this.node;
				const value = node.value;
				const check = new __Type(value);
				/*-- valor finito --*/
				if (this.fcheck === "finite") {
					return check.finite ? check.value : "";
				}
				/*-- data/tempo --*/
				if (this.fcheck === "datetime") {
					const data = __DATETIME.test(value);
					if (data === null)
						return "";
					if (data.type === "week" && __Time.weekToDate(data.iso) === null)
						return "";
					if (this.ftype === "datetime")
						return data.iso;
					if (data.type === "datetime" && this.ftype === "datetime-local")
						return data.form;
					if (data.type === this.ftype)
						return data.form;
					return "";
				}
				/*-- lista de valores --*/
				if (this.fcheck === "combo") {
					switch(this.ftype) {
						case "file": {
							const list = node.files;
							return !node.multiple && list.length > 1 ? [] : list;
						}
						case "email": {
							const list = value.split(",");
							for (let i = 0; i < list.length; i++) {
								let item = new __Type(list[i]);
								if (!item.email) return [];
								list[i] = list[i].trim();
							}
							return node.multiple === false && list.length > 1 ? [] : list;
						}
						case "select": {
							const list = [];
							for (let i = 0; i < node.length; i++)
								if (node[i].selected) list.push(node[i].value);
							return node.multiple === false && list.length > 1 ? [] : list;
						}
					}
					return [];
				}
				/*-- valor boleano --*/
				if (this.fcheck === "check") {
					return node.checked ? value : null;
				}
				/*-- valor textual/cor --*/
				if (this.fcheck === "text") {
					const color = /^\#[0-9a-f]{6}$/i;
					switch(this.ftype) {
						case "color": return color.test(value.trim()) ? value.trim() : "#000000";
						case "url":   try {return new URL(value).href;} catch(e) {return "";}
					}
					return value;
				}
				/*-- outros valores --*/
				return null;
			},
			/*----------------------------------------------------------------------*/
			set: function(value) {
				if (!this.form) return;
				const node  = this.node;
				const check = new __Type(value);
				const mask  = this.fmask;
				/*-- apagar valor --*/
				if (check.null && this.fcheck !== "check") {
					node.value = null;
					return;
				}
				/*-- definir valor finito --*/
				if (this.fcheck === "finite") {
					if (check.finite) node.value = check.value;
					return;
				}
				/*-- definir data/tempo --*/
				if (this.fcheck === "datetime") {
					const data  = __DATETIME.test(value);
					if (data === null)
						return;
					if (data.type === "week" && __Time.weekToDate(data.iso) === null)
						return;
					if (this.ftype === "datetime")
						node.value = data.iso;
					else if (data.type === "datetime" && this.ftype === "datetime-local")
						node.value = data.form;
					else if (data.type === this.ftype)
						node.value = data.form;
					return;
				}
				/*-- definir lista de valores --*/
				if (this.fcheck === "combo") {
					if (this.ftype === "file")
						return;
					if (this.ftype === "email") {
						const list = check.array ? value : String(value).split(",");
						if (node.multiple === false && list.length > 1) return;
						for (let i = 0; i < list.length; i++) {
							let item = new __Type(list[i]);
							if (!item.email) return;
							list[i] = list[i].trim();
						}
						node.value = list.join(",")
						return;
					}
					if (this.ftype === "select") {
						const list = check.array ? value : [value];
						list.forEach(function(v,i,a) {a[i] = String(v);})
						for (let i = 0; i < node.length; i++)
							node[i].selected = list.indexOf(node[i].value) >= 0;
						return;
					}
					return;
				}
				/*-- definir valores boleanos --*/
				if (this.fcheck === "check") {
					if (check.boolean)
						node.checked = check.value;
					else if (check.null)
						node.checked = !node.checked;
					else
						node.checked = check.value;
					return;
				}
				/*-- definir valores textuais/color/url --*/
				if (this.fcheck === "text") {
					if (this.ftype === "color") {
						const color = /^\#[0-9a-f]{6}$/i;
						if (color.test(value.trim()))
							node.value = value.trim().toLowerCase();
						return;
					}
					if (this.ftype === "url") {
						if (check.instanceOf("URL"))
							node.value = value.href;
						else
							try {node.value = new URL(value).href;} catch(e) {}
						return;
					}
					node.value = value;
				}
				return;
			}
		},
		/**. '{boolean ferror}: Retorna se o campo de formulário é inválido.**/
		ferror: {
			get: function() {
				if (this.form) {
					/*-- Zerando erros personalizados --*/
					this.fvalidity = "";
					/*-- Erros implementados pelo navegador --*/
					if (this.node.checkValidity() === false) return true;
					/*-- Erros de valores (conteúdo e valor devem ser coerentes) --*/
					const combo  = this.fcheck === "combo";
					const value  = this.node.value !== "";
					const fvalue = combo ? this.fvalue.length > 0 : this.fvalue !== "";
					if (value && !fvalue) {
					 this.fvalidity = this._msg.pattern.replace("?", "");
					 return true;
					}
					/*-- Erros do dataset-wd-mask --*/
					if ("wdMask" in this.node.dataset)
						this.node.dispatchEvent(wdReloadEvent);
					/*-- retornando se há erro encontrado --*/
					return !this.node.checkValidity()	;
				}
				return false;
			}
		},
		/**. '{string fvalidity}: Define ou retorna mensagem de restrição do formulário.**/
		fvalidity	: {
			get: function() {
				return this.ferror ? this.node.validationMessage.trim() : "";
			},
			set: function(x) {
				const check = this.form && "setCustomValidity" in this.node;
				const error = x === null ? "" : String(x).trim();
				if (check) this.node.setCustomValidity(error);
			}
		},
		/**. '{object fsubmit}: Retorna um objeto contendo as propriedades '{name}, '{value}, '{error} e '{message} do formulário ou nulo se não for o caso para submeter.**/
		fsubmit: {
			get: function() {
				if (this.fsend) {
					const data = {
						name:  this.fname,  value:   this.fvalue,
						error: this.ferror, message: this.fvalidity
					};
					return data.name === "" || data.value === null ? null : data;
				}
				return null;
			}
		},
		/**. '{void falert()}: Exibe a mensagem de erro na tela, se implementado pelo navegador.**/
		falert	: {
			value: function() {
				const validity = this.fvalidity;
				if (validity !== "") {
					if ("reportValidity" in this.node)
						this.node.reportValidity();
					else
						__SIGNAL.signal({body: validity, title: "!"});
				}
				return;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**
	#4 Nós
	''constructor object __Node(node input)''
	Construtor para manipulação de nós HTML.**/
	function __Node(input) {
		if (!(this instanceof __Node)) return new __Node(input);
		__FNode.call(this, input);
	}

	__Node.prototype = Object.create(__FNode.prototype, {
		constructor: {value: __Node},
		/**. '{any attribute(string name, any value)}: Define e retorna valores de atributos ou propriedades dos elementos HTML. O argumento '{name} (i{string}) corresponde ao nome do atributo ou da propriedade e '{value} o seu respectivo valor:
		|name|value|Ação|
		|Ausente|Ausente|Retorna um objeto com os u{atributos} do elemento.|
		|Presente|Ausente|Retorna o valor do atributo ou propriedade.|
		|Presente|Presente|Define o valor do atributo ou propriedade e o retorna.|
		- Caso o atributo ou a propriedade seja método, a lista de argumentos é definida como um array no argumento '{value};
		- Inicialmente, seja checada a existência da propriedade ou método e depois do atributo;
		- O manipulação de i{class/Name/List, style, dataset e add/removeEventListener} foram readequados.**/
		attribute: {
			value: function (name, value) {
				const tName  = new __Type(name);
				const tValue = new __Type(value);
				const isSet  = arguments.length > 1;
				const work   = tName.nonempty ? (isSet ? "set" : "get") : "all";
				/*-- RETORNAR LISTA DE ATRIBUTOS -------------------------------------*/
				if (work === "all") {
					const data = {};
					const attr = this.node.attributes;
					for (let i = 0; i < attr.length; i++)
						data[attr[i].name] = attr[i].value;
					return data;
				}
				/*-- RETORNAR/DEFINIR DADO -------------------------------------------*/
				else {
					name = name.trim();
					/*-- métodos/atributos com comportamento da biblioteca --*/
					const native = {
						style: "style", dataset: "dataset",
						class: "class", className: "className", classList: "classList",
						innerHTML: "innerHTML", outerHTML: "outerHTML",
						addEventListener: "addEventListener", removeEventListener: "removeEventListener",
						value: this.form ? "fvalue" : "value", name: this.form ? "fname" : "value",
					};
					/*-- COMPORTAMENTO DA BIBLIOTECA -----------------------------------*/
					if (name in native) {
						if (work === "set") this[native[name]] = value;
						return this[native[name]];
					}
					/*-- COMPORTAMENTO PADRÃO ------------------------------------------*/
					else {
						/*-- DEFINIÇÃO ---------------------------------------------------*/
						if (work === "set") {
							const cfg = {};
							cfg[name] = value;
							__HTML(this.node, cfg);
						}
						/*-- RETORNO -----------------------------------------------------*/
						if (name in this.node)
							return this.node[name];
						else
							return this.node.getAttribute(name);
					}
				}
					/*FIXME implanto ou não isso?
					/*-- propriedade booleana --* /
					if (testAttr.boolean && (testValue.boolean || value === "!")) {
						this.node[name] = testValue.boolean ? testValuevalue : !this.node[name];
					}
					*/
			}
		},
		/**. '{object style}: Define e retorna o valor do atributo '{style}. Se u{nulo}, o atributo é u{excluído}; se u{textual}, o é definido; e, se objeto, o atributo é definido conforme nome da propriedade e seu valor.**/
		style: {
			get: function() {
				const data = {};
				for (let i = 0; i < this.node.style.length; i++) {
					let attr = this.node.style[i];
					let name = __String(attr).camel;
					data[name] = this.node.style[attr];
				}
				return data;
			},
			set: function(x) {
				const data = new __Type(x);
				if (data.null) {
					this.node.removeAttribute("style");
				}
				else if (data.chars) {
					this.node.setAttribute("style", x);
				}
				else if (data.object) {
					for (let i in x) {
						let name = new __String(i).camel;
						this.node.style[name] = x[i];
					}
				}
			}
		},
		/**. '{string|object className}: Propriedade auxiliar para a propriedade '{class}.**/
		className: {
			set: function(x) {this.class = x;},
			get: function()  {return this.class;}
		},
		/**. '{string|object classList}: Propriedade auxiliar para a propriedade '{class}.**/
		classList: {
			set: function(x) {this.class = x;},
			get: function()  {return this.class;}
		},
		/**. '{string|object class}: Define e retorna o valor do atributo '{class}. Se u{nulo}, o atributo é u{excluído}; se u{textual}, o valor é definido; e, se objeto, as seguintes ações são possíveis:
		|Nome|Tipo|Descrição|
		|replace|string|Substitui a primeira propriedade pela segunda.|
		|toggle|string|Alterna a existência das propriedades.|
		|add|string|Adiciona as propriedades.|
		|remove|string|Remove as propriedades.|
		Os valores das propriedades acima consiste no nome da propriedade CSS separada por espaço em branco.**/
		class: {
			get: function() {
				const attr = this.node.getAttribute("class");
				const list = attr === null ? [""] : attr.replace(/\s+/g, " ").trim().split(" ");
				const only = list.filter(function(v,i,a) {return a.indexOf(v) === i;});
				const sort = only.sort();
				const data = sort.join(" ");
				if (attr !== null)
					this.node.setAttribute("class", data);
				return data;
			},
			set: function(x) {
				const data = new __Type(x);
				if (data.chars) {
					this.node.setAttribute("class", x.trim());
				}
				else if (data.null) {
					this.node.removeAttribute("class");
				}
				else if (data.object) {
					const data = new __Array(this.class.split(" "));
					const sort = ["replace", "toggle", "add", "remove"];
					for (let i = 0; i < sort.length; i++) {
						if (sort[i] in x) {
							let list = String(x[sort[i]]).replace(/\s+/g, " ").trim().split(" ");
							data[sort[i]].apply(data, list);
						}
					}
					this.node.setAttribute("class", data.order.join(" "));
				}
				this.class;
			}
		},
		/**. '{array|object  addEventListener}: Propriedade para adicionar disparadores a eventos, aceitando dois tipos de valores.
		. Se o valor for um array, cada item do array corresponderá aos argumentos do método padrão, na mesma sequência (evento, disparador, captura).
		. Se o valor for um objeto, o nome da propriedade corresponderá ao evento e seu valor ao disparador ou uma lista de disparadores (array). A captura será definida pelo valor padrão.**/
		addEventListener: {
			set: function(x) {return this.eventListener(x, false);}
		},
		/**. '{array|object  removeEventLister}: Propriedade semelhante à i{addEventListener}, mas para remover disparadores dos eventos.**/
		removeEventListener: {
			set: function(x) {return this.eventListener(x, true);}
		},
		/**. '{void  eventListener(object|array data, boolean remove)}: Função auxiliar para as propriedades '{addEventListener} e '{removeEventListener}. O argumento '{data} define o valor de entrada e o argumento '{remove} define a exclusão do disparador.**/
		eventListener: {
			value: function(data, remove) {
				const check = new __Type(data);
				if (check.array) {
					const attr = remove === true ?  "removeEventListener" : "addEventListener";
					try {this.node[attr].apply(this.node, data);}
					catch(e) {if (__UNDERMAINTENANCE) console.info(e);}
				}
				else if (check.object) {
					for (let ev in data) {
						let event = String(ev).trim().replace(/^(on)?/i, "");
						let test  = new __Type(data[ev]);
						let list  = test.array ? data[ev] : [data[ev]];
						for (let i = 0; i < list.length; i++)
							this.eventListener([event, list[i]], remove);
					}
				}
				return;
			}
		},
		/**. '{object dataset}: Define e retorna o valor do atributo '{dataset}. Se u{nulo}, o atributo é u{excluído} e, se objeto, o atributo é definido conforme nome da propriedade e seu valor.**/
		dataset: {
			get: function() {
				const data = {};
				for (let i in this.node.dataset)
					data[i] = this.node.dataset[i];
				return data;
			},
			set: function(x) {
				const data  = new __Type(x);
				/*-- deletar todas as propriedades de dataset --*/
				if (data.null) {
					const attr = this.dataset;
					for (let i in attr)
						delete this.node.dataset[i];
				}
				/*-- definir ou excluir propriedades de dataset --*/
				else if (data.object) {
					const wddataset = [];
					for (let i in x) {
						let name = __String(i).camel;
						if (x[i] !== null) {
							this.node.dataset[name] = x[i];
							wddataset.push(name);
						}
						else if (name in this.node.dataset) {
							delete this.node.dataset[name];
						}
					}
					//FIXME consertar isso (não lembro mais o porquê)
					this.node.dataset.wddataset = wddataset.join(" ");
					this.node.dispatchEvent(wdDatasetEvent);
				}
				/*-- invocar evento de atribuição de dataset --*/
				//this.node.dispatchEvent(wdDatasetEvent);
			}
		},
		/**. '{node clone(boolean childs=true)}: Retorna um clone do objeto. Se o argumento opcional '{childs} for falso, os elementos filhos não serão clonados.**/
		clone: {
			value: function(childs) {
				let special = ["script"];
				/* se não for um script */
				if (special.indexOf(this.tag) < 0)
					return this.node.cloneNode(childs !== false);
				/* se for um script */
				let attrs = this.attribute();
				let clone = __HTML(this.tag, {innerHTML: this.node.innerHTML});
				for (let i in attrs)
					clone.setAttribute(i, attrs[i]);
				return clone;
			}
		},
		/**. '{string innerHTML}: Define ou retorna o valor da propriedade HTML para fins da biblioteca.|**/
		innerHTML: {
			get: function() {return this.node.innerHTML;},
			set: function(x) {
				this.node.innerHTML = x;
				this.node.dispatchEvent(wdReloadEvent);
				return;
			}
		},
		/**. '{string outerHTML}: Define ou retorna o valor da propriedade HTML para fins da biblioteca.|**/
		outerHTML: {
			get: function() {return this.node.outerHTML;},
			set: function(x) {
				const parent = this.node.parentElement;
				this.node.outerHTML = x;
				parent.dispatchEvent(wdReloadEvent);
				return;
			}
		},
		/**. '{void forcedHTML(string input, boolean outer)}: Define a propriedade i{inner/outerHTML} forçando a execução de scripts. O argumento '{input} (string) define o código HTML e o argumento '{outer} (boolean), se verdadeiro, definirá a propriedade "outer", caso contrário "inner".**/
		forcedHTML: {
			value: function(input, outer) {
				const re   = /\<script([^>]*\>)/ig;
				const to   = `<script data-wd-script="force" $1`;
				const code = String(input).replace(re, to);
				const elem = outer === true ? this.node.parentElement : this.node
				/*-- definindo propriedade --*/
				this.node[outer === true ? "outerHTML" : "innerHTML"] = code;
				/*-- executando scripts --*/
				const query = elem.querySelectorAll(`script[data-wd-script="force"]`);
				for (let i = 0; i < query.length; i++) {
					let node  = new __Node(query[i]);
					let clone = node.clone(true);
					clone.removeAttribute("data-wd-script");
					query[i].parentElement.replaceChild(clone, query[i]);
				}
				elem.dispatchEvent(wdReloadEvent);
				return;
			}
		},



		repeat: {value: function(list) {}},
		/**. '{boolean show}: Retorna e define a visibilidade do elemento nos termos da biblioteca.**/
		show: {
			//FIXME por que eu criei [data-js-wd-hide]:not([data-js-wd-show])
			get: function() {
				return !this.node.hasAttribute("data-js-wd-hide");
			},
			set: function(x) {
				if      (x === false) this.node.setAttribute("data-js-wd-hide", "");
				else if (x === true)  this.node.removeAttribute("data-js-wd-hide");
			}
		},
		/**. '{void only(boolean hide)}: Exibe o nó e esconde os irmãos ou, se '{hide} for verdadeiro, o contrário.**/
		only: {
			value: function(hide) {
				const elem = this.node;
				const data = new __Type(elem.parentElement.children);
				data.value.forEach(function(v,i,a) {
					const node = new __Node(v);
					node.show = v === elem ? (hide !== true) : (hide === true);
				});
			}
		},
		/**. '{void slice(number init, number last)}: Define o intervalo de nós filhos a ser exibido entre o índice inicial ('{init}) e final ('{last}), como no método '{Array.slice}.**/
		slice: {
			value: function (init, last) {
				const child = new __Type(this.node.children);
				const check = {init: new __Type(init), last: new __Type(last)};
				for (let i in check) check[i] = check[i].number ? check[i].value : undefined;
				const show = child.value.slice(check.init, check.last);
				child.value.forEach(function(v,i,a) {
					const node = new __Node(v);
					node.show = show.indexOf(v) >= 0;
				});
			}
		},

		//FIXME apagar: isso seria usado para carrossel e pages
		/**. '{array groups(boolean child)}: Retorna uma lista de objetos contendo os intervalos (propriedades '{init} e '{last}) dos elementos visíveis. Se o argumento '{child} for verdadeiro, a análise será dentre os filhos, caso contrário, entre elemento e seus irmãos.**/
		groups: {
			value: function(child) {
				const target = child === true ? this.node : this.node.parentElement;
				const nodes  = __Type(target.children).value;
				const groups = [];
				const data   = {init: null, last: null};
				for (let i = 0; i < nodes.length; i++) {
					let show = nodes[i].className.split(/\s/).indexOf("js-wd-hide") < 0;
					if (show) {
						if (data.init === null) data.init = i;
						data.last  = i;
						if (i === (nodes.length - 1))
							groups.push({init: data.init, last: data.last});
					} else if (data.init !== null) {
						groups.push({init: data.init, last: data.last});
						data.init = null;
						data.last = null;
					}
				}
				return groups;
			}
		},
		//FIXME apagar: isso seria usado para carrossel
		/**. '{void walk(integer n=1)}: Exibe um único nó filho avançando ou retrocedendo '{n} posições entre os irmãos. O argumento '{n} indica o intervalo a avançar (positivo) ou a retroceder (negativo).**/
		walk: {
			value: function(n) {
				if (this.node.childElementCount < 2) return this.slice(0, 0);
				const data   = __Type(n);
				const childs = this.node.childElementCount;
				const delta  = data.finite ? Math.trunc(data.value) : 1;
				const groups = this.groups(true);
				let   active = groups.length === 0 ? 0 : groups[0].init;
				if (delta >= 0)
					active = groups.length === 0 ? -1 : groups[groups.length - 1].last;
				let next   = (active + delta)%childs;
				if (next < 0) next = childs + next;
				this.slice(next, next);
			}
		},
		/**. '{integer page(integer size, integer page)}: Organiza os nós filhos em grupos ('{page}) de determinado tamanho ('{size}) e retornar o valor da última página.**/
		page: {
			value: function(size, page) {
				/*-- checando argumentos --*/
				const data = {size: new __Type(size), page: new __Type(page)};
				for (let i in data)
					data[i] = data[i].integer && data[i] > 0 ? data[i].value : 1;
				/*-- definindo o grupo --*/
				const len = this.node.childElementCount;
				const max = Math.trunc(len/data.size) + (len%data.size > 0 ? 1 : 0);
				data.page = (data.page > max ? max : data.page) - 1;
				const init = data.page * data.size;
				const last = init + data.size;
				this.slice(init, last);
				return max;
			}
		},

		/**. '{boolean mask(string model)}: Retorna falso se o conteúdo do elemento não corresponder ao modelo da máscara '{model} (ver __String.mask). Caso contrário, definirá o valor do conteúdo conforme definido pela máscara.**/
		mask: {
			value: function(model) {
				/*-- se for um formulário com máscara primitiva, não avaliar --*/
				if (this.fmask) return true;
				/*-- se o conteúdo for vazio, não avaliar --*/
				const val = this.node[!this.form || this.ftext ? "innerText" : "value"];
				if (val === "") return true;
				/*-- avaliando máscara --*/
				const str = new __String(val);
				const txt = str.mask(model);
				/*-- validando formulário --*/
				if (this.form)
					this.fvalidity = txt === "" ? this._msg.pattern.replace("?", model) : "";
				/*-- definindo valor da máscara --*/
				if (txt !== "" && txt !== val)
					this.node[!this.form || this.ftext ? "innerText" : "value"] = txt;
				return txt !== "";
			}
		},
		/**. '{void sort(boolean asc)}: Ordena os elementos filhos. O argumento '{asc} define a classificação, se verdadeiro ascendente, se falso descendente e, se ausemte, o inverso da classificação vigente.**/
		sort: {
			value: function(asc) {
				const node  = this.node;
				const child = new __Type(node.children);
				const array = new __Array(child.value);
				array.sort(asc).forEach(function(v,i,a) {node.appendChild(v);});
				return;
			}
		},
		/**. '{void tsort(integer order...)}: Ordena colunas de tabelas. Os argumentos '{order} definem a sequência de prioridade na classificação, com a indicação do número da coluna (a partir de 1, da esquerda para a direita). Se indicador da coluna for positivo, sua ordem será ascendente, caso contrário, descendente. O método deverá ser aplicado sobre o agrupador de linhas**/
		tsort: {
			value: function() {
				/*-- acertando argumentos --*/
				const args = [];
				const rule = [];
				for (let i = 0; i < arguments.length; i++) {
					let data = new __Type(arguments[i]);
					if (data.integer && data.value !== 0 && args.indexOf(data.value) < 0) {
						args.push(data.value);
						rule.push({asc: data.value > 0, col: Math.abs(data.value) - 1});
					}
				}
				/*-- ordernar linhas --*/
				const desc = new __Type(this.node.children);
				const rows = desc.value;
				rows.sort(function(a, b) {
					/*-- definindo quantidade de colunas em cada linha a comparar --*/
					const maxA  = a.childElementCount - 1;
					const maxB  = b.childElementCount - 1;
					/*-- looping pelas regras de ordenação --*/
					for (let i = 0; i < rule.length; i++) {
						let col = rule[i].col;
						let asc = rule[i].asc;
						/*-- índice das colunas informadas não constam na linha --*/
						if (col > maxA && col > maxB) continue;
						/*-- obter os valores para comparação --*/
						let dataA = col > maxA ? "" : a.children[col].innerText.toLowerCase();
						let dataB = col > maxB ? "" : b.children[col].innerText.toLowerCase();
						let textA = new __String(dataA);
						let textB = new __String(dataB);
						let typeA = new __Type(textA.near.trim());
						let typeB = new __Type(textB.near.trim());
						/*-- se os valores forem iguais, passar para a próxima regra --*/
						if (typeA.value === typeB.value) continue;
						/*-- caso contrário, definir ordenamento --*/
						let list = new __Array(typeA.value, typeB.value);
						let sort = list.sort(asc);
						return sort[0] === typeA.value ? -1 : +1;
					}
					/*-- se nenhuma ordenação for encontrada --*/
					return 0;
				});
				/*-- reordenar elementos --*/
				for (let i = 0; i < rows.length; i++)
					this.node.appendChild(rows[i]);
			}
		},
		/**. '{void jump(node list)}: O nó será adicionado aos elementos na ordem definida em '{list} a cada chamada do método. O argumento '{list} é uma lista de nós que acomodará o elemento.**/
		jump: {
			value: function(list) {
				const check = __Type(list);
				if (!check.node && !check.array) return;
				const nodes = [];
				const value = check.value;
				for (let i = 0; i < value.length; i++)
				  if (__Type(value[i]).node && value[i] != this.node)
				    nodes.push(value[i]);
				if (nodes.length > 0) {
					const next = nodes.indexOf(this.node.parentElement) + 1;
					const node = nodes[next%nodes.length];
					node.appendChild(this.node);
				}
				return;
			}
		},
		/**. '{void full()}: Alterna a exibição do nó em tela cheia.**/
		//TODO interessante: https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop    https://developer.mozilla.org/en-US/docs/Web/CSS/:fullscreen
		full: {
			value: function() {
				const attr = {
					open: ["requestFullscreen", "webkitRequestFullscreen", "msRequestFullscreen"],
					exit: ["exitFullscreen",    "webkitExitFullscreen",    "msExitFullscreen"]
				};
				const full = document.fullscreenElement;
				const act  = full === this.node ? "exit" : "open";
				const node = act === "exit" ? document : this.node;
				for (let i = 0; i < attr[act].length; i++) {
					if (attr[act][i] in node)
						try {return node[attr[act][i]]();} catch(e) {}
				}
				return;
			}
		},
		/**. '{object styles}: Retorna um objeto contendo os estilos e seus valores computados ao elemento.**/
		styles: {
			get: function() {
				const object = {};
				const styles = window.getComputedStyle(this.node, null);
				for (let i in styles)
					if (!(/\d+/).test(i))
						object[i] = styles[i];
				return object;
			}
		},
		/**. '{object position}: Retorna ou define o dimensionamento do elemento por meio de um objeto com os seguintes atributos: width, height, top, right, bottom e left. Os valores dependem do posicionalmento do elemento e devem ser numéricos.**/
		position: {
			get: function() {
				const re   = /[^0-9\.\-]/g;
				const css  = this.styles;
				let   data = {height: 0, width: 0, left: 0, top: 0, right: 0, bottom: 0};
				for (let i in data)
					data[i] = Number(css[i].replace(re, ""));
				return data;
			},
			set: function(x) {
				if (!__Type(x).object) return;
				let data = this.position;
				for (let i in data)
					if (i in x) this.node.style[i] = String(x[i])+"px";
				return;
			}
		},
		/**. '{object highlight(boolean show)}: Exibe ou remove destaque ao elemento.**/
		highlight: {
			value: function(show) {
				if (show === false) {
					const query = document.querySelectorAll("[data-js-wd-area]");
					for (let i = 0; i < query.length; i++)
						query[i].remove();
				} else {
					const data  = this.node.getBoundingClientRect();
					const mouse = window.getComputedStyle(this.node).cursor;
					let  hline = document.querySelector(`[data-js-wd-area="horizontal"]`);
					let  vline = document.querySelector(`[data-js-wd-area="vertical"]`);
					if (hline === null) {
						hline = document.createElement("DIV");
						hline.dataset.jsWdArea = "horizontal";
						document.body.appendChild(hline);
					}
					if (vline === null) {
						vline = document.createElement("DIV");
						vline.dataset.jsWdArea = "vertical";
						document.body.appendChild(vline);
					}
					hline.style.top    = data.top+"px";
					hline.style.height = data.height+"px";
					hline.style.cursor = mouse;
					vline.style.left   = data.left+"px";
					vline.style.width  = data.width+"px";
					vline.style.cursor = mouse;
				}
				return;
			}
		},














		/**. '{void select()}: Seleciona o conteúdo do nó.**/
		select: {
			value: function() {
				const select = window.getSelection();
				const range  = document.createRange();
				select.removeAllRanges();
				range.selectNode(this.node);
				select.addRange(range);
				return;
			}
		},

		select2: {
			value: function() {
				const select = window.getSelection();
				const range  = document.createRange();
				select.removeAllRanges();
				range.selectNodeContents(this.node);
				select.addRange(range);
				return;
			}
		},

















		/**. '{vois copy()}: Seleciona o conteúdo do nó.**/
		copy: {
			value: function() {
				this.select();
				document.execCommand("copy");
				window.getSelection().removeAllRanges();
			}
		},

		copy2: {
			value: function() {
				this.select2();
				document.execCommand("copy");
				window.getSelection().removeAllRanges();
			}
		},






		/* copiar DOM: elemento ou tudo */
		/*let data = wd_vtype(value);
		if (data.type === "dom" && "execCommand" in document) {
			let element = data.value.length > 0 ? data.value[0] : document.body;
			let range   = document.createRange();
			let select  = window.getSelection();
			select.removeAllRanges();          /* limpar seleção existente */
			//range.selectNodeContents(element); /* pegar os nós do elemento */
		//	select.addRange(range);            /* seleciona os nós do elemento */
			//document.execCommand("copy");      /* copia o texto selecionado */
			//select.removeAllRanges();          /* limpar seleção novamente */
			//return true;
		//}
		/* copiar valor informado */
		//if ("clipboard" in navigator && "writeText" in navigator.clipboard) {
//			navigator.clipboard.writeText(value === null ? "" : value).then(
	//			function () {/*sucesso*/},
		//		function () {/*erro*/}
			//);
			//return true;


		cursor: {
			value: function(n) {
				this.select();
				window.getSelection().collapse(this.node, n);
			}
		},

	});

/*----------------------------------------------------------------------------*/
	/**#4 Tabela
	''constructor object __Table(any input)''
	Construtor para obter dados de tabela e matrizes. O argumento '{input} pode ser uma String CSV, uma matriz de array ou uma tabela HTML;**/
	function __Table(input) {
		if (!(this instanceof __Table))	return new __Table(input);
		const parser = new __Parser(input);
		let table;
		if (parser._check.nonempty)
		  table = parser.csvTable.get();
		else if (parser._check.array)
		  table = parser.matrixCSV.csvTable.get();
		else if (parser._check.node && parser._check.value[0].tagName.toLowerCase() === "table")
		  table = parser._check.value[0];
		else
		  table = document.createElement("TABLE");
		Object.defineProperties(this,
		  /**. '{node table}: Retorna a tabela.**/
		  {table: {value: table}}
		);
	}

	Object.defineProperties(__Table.prototype, {
		constructor: {value: __Table},
		/**. '{object to}: Retorna um objeto para exportar os dados da tabela para:
		|Nome|Descrição|
		|matrix|Retorna os nós i{td} e i{th} da tabela em forma de matriz 2X2|
		|values|Semelhante à propriedade '{matrix} mas exibe os valores das células|
		|struct|Retorna uma lista de objetos cujas propriedades correspondem ao título da coluna|
		|csv|Retorna os dados da tabela em formato CSV|
		|json|Retorna o resultado da propriedade '{values} no formato JSON|**/
		to: {
			get: function() {
				const parser = new __Parser(this.table);
				return {
					get matrix() {return parser.tableMatrix.get();},
					get values() {return parser.tableValues.get();},
					get struct() {return parser.tableValues.matrixList.get();},
					get csv()    {return parser.tableValues.matrixCSV.get();},
					get json()   {return parser.tableValues.jsonString.get();}
				};
			}
		},
		/**. '{string toString()}: Retorna os valores da tabela em formato CSV.**/
		toString: {value: function() {return this.to.csv;}},
		/**. '{string valueOf()}: Retorna os valores da tabela em forma de matriz.**/
		valueOf: {value: function() {return this.to.values;}},
		/**. '{integer rows}: Retorna a quantidade de linhas da tabela.**/
    rows: {get: function() {return this.valueOf().length;}},
		/**. '{integer cols}: Retorna a quantidade máxima de colunas da tabela.**/
    cols: {
    	get: function() {
    		const matrix = this.valueOf();
    		let cols = 0;
    		for (let i = 0; i < matrix.length; i++)
    			if (matrix[i].length > cols) cols = matrix[i].length;
    		return cols;
    	}
    },
    /**. '{string caption}: Define ou retorna o valor do título da tabela.**/
		caption: {
		  get: function () {
		    return this.table.caption === null ? "" : this.table.caption.textContent;
		  },
		  set: function (x) {
		    if (this.table.caption === null) {
		      const node = document.createElement("CAPTION");
		      this.table.appendChild(node);
		    }
		    this.table.caption.textContent = String(x);
		  }
		},
		/**. '{array cells(string target, function caller)}: Retorna uma lista de células da tabela conforme configuração definida no argumento '{target}.
		//FIXME os dois ponto está quebrando a linha errada
		. A célula é especificada pelos índices da linha e coluna separados por vírgula (i{row,col}), onde zero é a origem e o caractere "asterísco" o último índice. Para especificar um intervalo de células, deve-se separar as células por um caractere de "dois pontos" (i{row1,col1:row2,col2}), nesse caso, a linha e a coluna da célula inicial devem ser menores ou iguais a aqueles especificados na célula final. Para especificar várias células ou intervalos de forma independente, deve-se separá-los por um caractere de "ponto e vírgula" (i{row1,col1;row2,col2:row3,col3}).
		. A função opcional definida em '{caller} permite alterar o conteúdo retornado. Por padrão, cada item da lista conterá o nó '{td} ou '{th} da tabela conforme definido em '{target}. A função receberá três argumentos, o nó HTML e os índices da linha e coluna, nessa ordem. O retorno da função, se definido, definirá o novo valor do item da lista.**/
		cells: {
			value: function(target, caller) {
				const groups = String(target).replace(/\s+/g, "").split(";");
				const change = new __Type(caller).function;
				const reCell = /^(\d+|\*)\,(\d+|\*)$/;
				const reArea = /^(\d+|\*)\,(\d+|\*)\:(\d+|\*)\,(\d+|\*)$/;
				const rows   = this.rows;
				const cols   = this.cols;
				const matrix = this.to.matrix
				const list   = [];
				let group, data, area, item, result;
				/*-- grupos separados por ";" --*/
				for (let i = 0; i < groups.length; i++) {
					/*-- capturando dados das células --*/
					group = groups[i];
					area  = reArea.test(group);
					if (area || reCell.test(group)) {
						data = {
							row1: group.replace((area ? reArea : reCell), "$1"),
							col1: group.replace((area ? reArea : reCell), "$2"),
							row2: area ? group.replace(reArea , "$3") : null,
							col2: area ? group.replace(reArea , "$4") : null
						};
						/*-- ajustando as células --*/
						for (let attr in data) {
							if (data[attr] === "*")
								data[attr] = ((/^row/).test(attr) ? rows : cols) - 1;
							if (data[attr] !== null)
								data[attr] = Number(data[attr]);
						}
						if (data.row2 === null) data.row2 = data.row1;
						if (data.col2 === null) data.col2 = data.col1;
						/*-- capturando dados --*/
						for (let row = data.row1; row <= data.row2; row++) {
							for (let col = data.col1; col <= data.col2; col++) {
								if (row < rows && col < matrix[row].length) {
									item   = matrix[row][col];
									result = change ? caller(item, row, col) : undefined;
									list.push(result === undefined ? item : result);
								}
							}
						}
					}
				}
				return list;
			}
		},
		/**.  '{node plot(object options)}: Retorna um gráfico de acordo com os dados da tabela e conforme especificado em '{options} (ver __Plot2D.add) ou nulo:
		|Nome|Tipo|Descrição|
		|xLabel|string|Rótulo do eixo i{x}.|
		|yLabel|string|Rótulo do eixo i{y}.|
		|title|string|Título do gráfico.|
		|xAxis|string|Define a formatação da escala do eixo i{x}, se i{number}, i{date}, i{time}, i{datetime} ou i{percent}.|
		|yAxis|string|Define a formatação da escala do eixo i{y} (ver xAxis).|
		|plot|string|Tipo de gráfico, i{plan}, i{cols} ou i{pie}.|
		|data|array|Uma lista de objetos com os parâmetros da plotagem.|
		. Os itens da propriedade '{data} são objetos com os seguintes especificações:
		|Nome|Tipo|Descrição|
		|x|any|Valores do eixo i{x}: um array, um objeto (cols ou pie) ou o número da coluna da tabela precedido de &num;.|
		|y|any|Valores do eixo i{y}, pode ser um array, uma função, uma constante ou o número da coluna precedido de &num;.|
		|label|string|Rótulo do gráfico.|
		|fit|string|Especifica o tipo do gráfico cartesiano.|
		. Os valores permitidos para o atributo '{fit} são:
		|Valor|Descrição|Valores de Y|
		|sum|Exibe a soma aproximada da área dentro da curva.|function, constante, array, matrix|
		|avg|Exibe a média aproximada da curva.|function, array, matrix|
		|line|Liga os pontos do gráfico com um seguimento de reta.||
		|link|Liga os pontos do gráfico com um seguimento de reta lincado por um ponto.|array, matrix|
		|dots|Exibe os pontos do gráfico.|array, matrix|
		|linear|Executa um ajuste linear aproximado.||
		|exponential|Executa um ajuste exponencial aproximado.||
		|geometric|Executa um ajuste geométrico aproximado.||
		|logarithmic|Executa um ajuste logarítmo aproximado.||
		|minimum|Executa um ajuste com o menor desvio médio padrão.||**/
		plot: {
			value: function(options) {
				if (!__Type(options).object) return null;
				const chart = new __Plot2D(options.plot);
				const isCol = /^\#(\d+)$/;
				const data  = __Type(options.data).array ? options.data : [];
				/*-- propriedades principais --*/
				const names = ["xLabel", "yLabel", "title", "xAxis", "yAxis"];
				for (let i = 0; i < names.length; i++) {
					if (names[i] in options)
						chart[names[i]] = options[names[i]];
				}
				/*-- parâmetros de plotagem --*/
				for (let i = 0; i < data.length; i++) {
					if (!__Type(data[i]).object) continue;
					let struct = {x: data[i].x, y: data[i].y, label: data[i].label, fit: data[i].fit};
					let col, arr, cell;
					/*-- x faz referência à coluna --*/
					if (isCol.test(struct.x)) {
						col  = struct.x.replace(isCol, "$1");
						cell = `1,${col}:*,${col}`;
						arr  = this.cells(cell, function(v,r,c) {return v.innerText;});
						struct.x = arr;
					}
					/*-- y faz referência à coluna --*/
					if (isCol.test(struct.y)) {
						col = Number(struct.y.replace(isCol, "$1"));
						cell = `0,${col}:*,${col}`;
						arr = this.cells(cell, function(v,r,c) {return v.innerText;});
						struct.y     = arr.slice(1);
						struct.label = arr[0];
					}
					chart.add(struct.x, struct.y, struct.label, struct.fit);
				}
				return chart.plot();
			}
		},
	});



/*============================================================================*/
	/**#3 Figuras
	''constructor object __SVG(number width=100, number height=100, number xmin=0, number ymin=0)''
	Construtor de imagens SVG.
	Os argumentos são opcionais e estão relacionados ao atributo ['{viewBox}]<https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox> do elemento SVG.
	**/
	function __SVG(width, height, xmin, ymin) {
		if (!(this instanceof __SVG)) return new __SVG(width, height, xmin, ymin);
		const svg  = this.create("svg");
		const vbox = [xmin, ymin, width, height];
		const main = [0, 0, 100, 100];
		for (let i = 0; i < vbox.length; i++)
			vbox[i] = __Type(vbox[i]).finite ? Number(vbox[i]) : main[i];
		svg.setAttribute("viewBox", vbox.join(" "));
		Object.defineProperties(this, {
			_svg:  {value: svg},
			_last: {value: svg, writable: true}
		});
	}
	Object.defineProperties(__SVG.prototype, {
		constructor: {value: __SVG},
		/**. '{node last}: Define (adiciona) ou retorna o último nó adicionado ao SVG.**/
		last: {
			get: function()  {return this._last;},
			set: function(svg) {
				this._svg.appendChild(svg);
				this._last = svg;
			}
		},
		/**. '{node create(string tag)}: Retorna um novo elemento SVG do tipo informado em '{tag}.**/
		create: {
			value: function(tag) {
				return document.createElementNS("http://www.w3.org/2000/svg", tag);
			}
		},
		/**. '{self close()}: Clona o último elemento adicionado e o define no lugar.**/
		clone: {
			value: function() {
				this.last = this.last.cloneNode(true);
				return this;
			}
		},
		/**. '{number xmin}: Retorna e define o valor de '{xmin}.**/
		xmin: {
			get: function()  {return this._svg.viewBox.baseVal.x;},
			set: function(x) {
				if (__Type(x).finite)	this._svg.viewBox.baseVal.x = Number(x);
			}
		},
		/**. '{number ymin}: Retorna e define o valor de '{ymin}.**/
		ymin: {
			get: function()  {return this._svg.viewBox.baseVal.y;},
			set: function(y) {
				if (__Type(y).finite)	this._svg.viewBox.baseVal.y = Number(y);
			}
		},
		/**. '{number width}: Retorna e define o valor de '{width}.**/
		width: {
			get: function()  {return this._svg.viewBox.baseVal.width;},
			set: function(w) {
				if (__Type(w).finite)	this._svg.viewBox.baseVal.width = Number(w);}
		},
		/**. '{number height}: Retorna e define o valor de '{height}.**/
		height: {
			get: function()  {return this._svg.viewBox.baseVal.height;},
			set: function(h) {
				if (__Type(h).finite)	this._svg.viewBox.baseVal.height = Number(h);}
		},
		/**. '{self attribute(object attr)}: Define os atributos do último elemento adicionado. O argumento '{attr} é um objeto cujas chaves representam o valor do atributo e seu respectivo valores.**/
		attribute: {
			value: function(attr) {
				if (__Type(attr).object)
					for (let i in attr) this.last.setAttribute(i, attr[i]);
				return this;
			}
		},
		/**. '{self title(string value)}: Define um título (dica) ao último elemento adicionado. O argumento '{value} é o texto da dica.**/
		title: {
			value: function(value) {
				const svg = this.create("title");
				svg.textContent = value;
				this.last.appendChild(svg);
				return this;
			}
		},
		/**. '{self line(array p1, array p2)}: Define uma linha ligando dois pontos das coordenadas. Os argumentos '{p1} e '{p2} são as coordenadas (x,y).**/
		line: {
			value: function(p1, p2) {
				this.last = this.create("line");
				return this.attribute({x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1]});
			}
		},
		/**. '{self lines(array x, array y, boolean close=false)}: Define diversos segmentos de reta a partir de um conjunto de coordenadas. Os argumentos '{x} e '{y} são as coordenadas (x,y) e o argumento '{close} indica se o último ponto deve voltar à origem.**/
		lines: {
			value: function(x, y, close) {
				this.last = this.create("path");
				let line = x.slice();
				line.forEach(function(v,i,a) {
					a[i] = [(i === 0 ? "M" : "L"), v, y[i]].join(" ");
				});
				if (close === true) x.push("Z");
				return this.attribute({d: line.join(" ")});
			}
		},
		/**. '{self circle(number cx, number cy, number r)}: Define um círculo. Os argumentos '{cx}, '{cy} e '{r} são o centro em x e y e o raio, respectivamente.**/
		circle: {
			value: function(cx, cy, r) {
				this.last = this.create("circle");
				return this.attribute({cx: cx, cy: cy, r: r});
			}
		},
		/**. '{self semicircle(number cx, number cy, number r, number start, number width)}: Define um semicírculo. Os argumentos '{cx}, '{cy} e '{r} são o centro em x e y e o raio, respectivamente. Os argumentos '{start} e '{width} indicam o ângulo inicial e seu tamanho em graus, respectivamente.**/
		semicircle: {
			value: function(cx, cy, r, start, width) {
				this.last = this.create("path");
				if (Math.abs(width) >= 360) return this.circle(cx, cy, r);
				start  = 2*Math.PI*start/360;
				width  = 2*Math.PI*width/360;
				if (width < 0) {
					start += width;
					width  = Math.abs(width);
				}
				const x1 = cx + r*Math.cos(start);
				const y1 = cy - r*Math.sin(start);
				const x2 = cx + r*Math.cos(start + width);
				const y2 = cy - r*Math.sin(start + width);
				const lg = width > Math.PI ? 1 : 0;
				const  d = ["M", cx, cy, "L", x1, y1, "A", r, r, 0, lg, 0, x2, y2, "Z"];
				return this.attribute({d: d.join(" ")});
			}
		},
		/**. '{self rect(number x, number y, number width, number height)}: Define um retângulo. Os argumentos '{x} e '{y} definem o ponto de partida da figura e os argumentos '{width} e '{height} definem o comprimento e a altura do retângulo, respectivamente.**/
		rect: {
			value: function(x, y, width, height) {
				this.last = this.create("rect");
				return this.attribute({x: x, y: y, width: width, height: height});
			}
		},
		/**. '{self path(string path)}: Define um nó SVG a partir de uma sequência de comandos. O argumento '{path} define os comandos.**/
		path: {
			value: function(path) {
				this.last = this.create("path");
				return this.attribute({d: path});
			}
		},
		/**. '{self text(number x, number y, string|array text, string point)}: Define um SVG textual. Os argumentos '{x} e '{y} definem o posicionamento. O argumento '{text}, se lista, criará um elemento i{tspan} para cada item empilhados e, se texto, criará um elemento i{text}. O argumento '{point} define a posição (vertical/horizontal) e a âncora do texto. O primeiro caractere define a posição, i{v} para vertical e i{h} para horizontal, os demais definem a âncora conforme pontos cardeais: i{n, ne, e, se, s, sw, w, nw} e i{c} para o meio.**/
		text: {
			value: function(x, y, text, point) {
				/*-- definindo atributos do texto --*/
				const vanchor = ["start", "middle", "end"];
				const vbase   = ["auto", "middle", "hanging"];
				const anchor  = {n: 1, ne: 2, e: 2, se: 2, s: 1, sw: 0, w: 0, nw: 0, c: 1};
				const base    = {n: 2, ne: 2, e: 1, se: 0, s: 0, sw: 0, w: 1, nw: 2, c: 1};
				const attr    = {
					x: point[0] === "v" ? -y : x,
					y: point[0] === "v" ?  x : y,
					"text-anchor":       vanchor[anchor[point.substring(1)]],
					"dominant-baseline": vbase[base[point.substring(1)]],
					"transform":         point[0] === "v" ? "rotate(270)" : "",
				};
				this.last = this.create("text");
				this.last.style.whiteSpace = "break-spaces";
				this.attribute(attr);
				/*-- definindo texto em linha ou empilhado --*/
				if (!__Type(text).array) {
					const value = String(text);
					const tspan = this.create("tspan");
					tspan.textContent = value == "" ? " " : value;
					this.last.appendChild(tspan);
				} else {
					for (let i = 0; i < text.length; i++) {
						let style = {x: attr.x, dy: (i === 0 ? 0 : "1.5em")};
						let value = String(text[i]);
						let tspan = this.create("tspan");
						tspan.textContent = value === "" ? " " : value;
						for (let j in style) tspan.setAttribute(j, style[j]);
						this.last.appendChild(tspan);
					}
				}
				return this;
			}
		},
		/**. '{self ellipse(number cx, number cy, number rx, number ry)}: Define uma elípse.Os argumentos '{cx}, '{cy}, '{rx} e '{ry} definem o centro de referência em x e y e os raios de x e y, respectivamente.**/
		ellipse: {
			value: function(cx, cy, rx, ry) {
				this.last = this.create("ellipse");
				return this.attribute({cx: cx, cy: cy, rx: rx, ry: ry});
			}
		},
		/**. '{node svg(node append)}: Retorna o elemento SVG. O argumento opcional '{append} irá receber o elemento SVG.**/
		svg: {
			value: function(append) {
				if (__Type(append).node) append.appendChild(this._svg);
				return this._svg;
			}
		},

	});
/*============================================================================*/
	/**#3 Análise de Dados
	#4 Análise Quantitativa
	''constructor object __Data2D(array x, any y)''
	Análise de dados em duas dimensões.
	O argumento '{x} corresponde a uma lista de valores (array) de referência que aceita valores finitos e de data/tempo, conforme regras da biblioteca.
	O argumento '{y} é a resposta em função de '{x}, podendo ser uma lista de valores do mesmo tipo que '{x}, uma constante ou uma função. No caso de função, '{y} receberá o valor de '{y(x)}.
	Valores não finitos serão eliminados do conjunto '{(x, y)}.**/
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
		/**. '{object leastSquares}: Aplica o método dos mínimos quadrados ao conjunto de dados e retorna objeto contendo o coeficiente angular '{a} e o linear '{b} de '{y = ax + b}.**/
		leastSquares: {
			get: function () {
				if (this.error) return {a: 0, b: 0};
				if ("_leastSquares" in this) return this._leastSquares;
				const x   = this.x;
				const y   = this.y;
				const len = x.length;
				let sumX  = 0;
				let sumY  = 0;
				let sumX2 = 0;
				let sumXY = 0;
				for (let i = 0; i < len; i++) {
					sumX  += x[i];
					sumY  += y[i];
					sumX2 += x[i]*x[i];
					sumXY += x[i]*y[i];
				}
				const data = {};
				data.a = ((len * sumXY) - (sumX * sumY)) / ((len * sumX2) - (sumX * sumX));
				data.b = ((sumY) - (sumX * data.a)) / (len);
				this._leastSquares = data;
				return this.leastSquares;
			}
		},
		/**. '{object standardDeviation}: Retorna o desvio padrão entre o conjunto de dados.**/
		standardDeviation: {
			get: function() {
				if (this.error) return Infinity;
				if ("_standardDeviation" in this) return this._standardDeviation;
				const data = [];
				for (let i = 0; i < this.x.length; i++)
					data.push(this.x[i] - this.y[i]);
				this._standardDeviation = Math.hypot.apply(null, data) / Math.sqrt(data.length);
				return this._standardDeviation;
			}
		},
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
/*============================================================================*/
	/**#4 Análise Gráfica
	''constructor object __Plot2D(string type)''
	Objeto para preparar dados para construção de gráfico 2D. O argumento '{type} define o tipo do gráfico:
	|Valor|Descrição|
	|plan|Gráfico cartesiano xy (padrão)|
	|cols|Gráfico de colunas|
	|pie|Gráfico circular ou gráfico de colunas se houver valores negativos|**/
	function __Plot2D(type) {
		if (!(this instanceof __Plot2D)) return new __Plot2D(type);
		type = String(type).toLowerCase();
		const types = ["plan", "cols", "pie"];
		const chart = types.indexOf(type) < 0 ? types[0] : type;
		Object.defineProperties(this, {
			_chart:  {value: chart},                        /* tipo do gráfico */
			_title:  {value: "Title",   writable: true},    /* título do gráfico */
			_xLabel: {value: "X Label", writable: true},    /* nome do eixo x */
			_yLabel: {value: "Y Label", writable: true},    /* nome do eixo y */
			_xAxis:  {value: "default", writable: true},    /* tipo de dado do eixo x */
			_yAxis:  {value: "default", writable: true},    /* tipo de dado do eixo y */
			_id:     {value: -1,        writable: true},    /* controle das plotagens */
			_data:   {value: []},                           /* dados adicionados para plotagem */
			_min:    {value: {x: +Infinity, y: +Infinity}}, /* menor valor de x,y */
			_max:    {value: {x: -Infinity, y: -Infinity}}, /* maior valor de x,y */
		});
	}

	Object.defineProperties(__Plot2D.prototype, {
		constructor: {value: __Plot2D},
		/**. '{number _xMax}: Define ou retorna o maior valor da coordenada '{x}.**/
		_xMax: {
			get: function()  {
				let min = this._min.x;
				let max = this._max.x;
				return max + (min === max ? (max === 0 ? 1 : max/2) : 0);
			},
			set: function(x) {
				if (x > this._max.x) this._max.x = x;
			}
		},
		/**. '{number _yMax}: Define ou retorna o maior valor da coordenada '{y}.**/
		_yMax: {
			get: function()  {
				let min = this._min.y;
				let max = this._max.y;
				return max + (min === max ? (max === 0 ? 1 : max/2) : 0);
			},
			set: function(y) {
				if (y > this._max.y) this._max.y = y;
			}
		},
		/**. '{number _xMin}: Define ou retorna menor valor da coordenada '{x}.**/
		_xMin: {
			get: function()  {
				let min = this._min.x;
				let max = this._max.x;
				return min - (min === max ? (min === 0 ? 1 : min/2) : 0);
			},
			set: function(x) {
				if (x < this._min.x) this._min.x = x;
			}
		},
		/**. '{number _yMin}: Define ou retorna menor valor da coordenada '{y}.**/
		_yMin: {
			get: function()  {
				let min = this._min.y;
				let max = this._max.y;
				return min - (min === max ? (min === 0 ? 1 : min/2) : 0);
			},
			set: function(y) {
				if (y < this._min.y) this._min.y = y;
			}
		},
		/**. '{number _xScale(number x)}: Transforma a coordenada horizontal real i{x} para gráfica.**/
		_xScale: {
			value: function(x) {
				let dx = this._xMax - this._xMin;
				let dX = this._cfg.xSize;
				let  X = ((x - this._xMin)*(dX/dx)) + this._cfg.xStart;
				return X;
			}
		},
		/**. '{number _yScale(number y)}: Transforma a coordenada vertical real (i{y}) para gráfica.**/
		_yScale: {
			value: function(y) {
				let dy = this._yMax - this._yMin;
				let dY = -this._cfg.ySize;
				let  Y = ((y - this._yMin)*(dY/dy)) + this._cfg.yClose;
				return Y;
			}
		},
		/**. '{number _dx}: Retorna o menor valor real de '{x}.**/
		_dx: {
			get: function() {
				let width = this._cfg.width + (this._cfg.width%2 === 0 ? 1 : 0);
				return Math.abs(this._xMax - this._xMin)/width;
			}
		},
		/**. '{array _xSpace}: Retorna uma lista contendo todos os valores possíveis de '{x}**/
		_xSpace: {
			get: function() {
				const x   = [this._xMin];
				const max = this._xMax;
				const dx  = this._dx;
				const mid = (this._xMax + this._xMin)/2;
				let value = -Infinity;
				while (value < max) {
					value = x[x.length - 1] + dx;
					/*-- número central de x (manter nessa posição) --*/
					if (value > mid && (value-dx) < mid) x.push(mid);
					x.push(value <= max ? value : max);
				}
				return x;
			}
		},
		/**. '{object _cfg}: Registra as configurações do gráfico:
		|Nome|Tipo|Descrição|
		|vertical|number|registra o menor tamanho da tela do dispositivo.|
		|horizontal|number|registra o maior tamanho da tela do dispositivo.|
		|xInit|number|Registra o início do eixo horizontal '{x} (porcentagem).|
		|xEnd|number|Registra o fim do eixo horizontal '{x} (porcentagem).|
		|yInit|number|Registra o início do eixo vertical '{y} (porcentagem).|
		|yEnd|number|Registra o fim do eixo vertical '{y} (porcentagem).|
		|points|number|Número de divisões dos eixos no gráfico (impar).|
		|padd|number|Define um valor para espaçamento relativo (porcentagem).|
		|width|number|Define a dimensão horizontal do gráfico.|
		|height|number|Retorna a dimensão vertical do gráfico proporcional à '{width}.|
		|xStart|number|Coordenada horizontal da origem do gráfico.|
		|xSize|number|Tamanho do eixo '{x}.|
		|xMiddle|number|Metade do eixo '{x}.|
		|xClose|number|Fim do eixo '{x}.|
		|yStart|number|Coordenada vertical da origem do gráfico.|
		|ySize|number|Tamanho do eixo '{y}.|
		|yMiddle|number|Metade do eixo '{y}.|
		|yClose|number|Fim do eixo '{y}.|
		|top|number|A metade do espaço superior.|
		|bottom|number|A metade do espaço inferior.|
		|left|number|A metade do espaço esquerdo.|
		|right|number|A metade do espaço direito.|
		|padding|number|Retorna o espaçamento definido.|**/
		_cfg: {
			value: {
				vertical:   Math.min(window.screen.width, window.screen.height),
				horizontal: Math.max(window.screen.width, window.screen.height),
				xInit:      0.10,
				xEnd:       0.80,
				yInit:      0.10,
				yEnd:       0.90,
				points:     5.00,
				padd:       0.005,
				width:      1000,
				get height()  {return this.width * (this.vertical / this.horizontal);},
				get xStart()  {return this.xInit * this.width;},
				get xClose()  {return this.xEnd * this.width;},
				get xSize()   {return this.xClose - this.xStart;},
				get xMiddle() {return this.xStart + (this.xSize/2);},
				get yStart()  {return this.yInit * this.height;},
				get yClose()  {return this.yEnd * this.height;},
				get ySize()   {return this.yClose - this.yStart;},
				get yMiddle() {return this.yStart + (this.ySize/2);},
				get top()     {return this.yStart/2;},
				get bottom()  {return this.yClose + (this.height - this.yClose)/2;},
				get left()    {return this.xStart/2;},
				get right()   {return this.xClose + (this.width - this.xClose)/2;},
				get padding() {return this.padd*this.width;}
			}
		},
		/**. '{void color(integer id)}: Retorna a cor a partir do identificador ('{id}) de ciclo  infinito.**/
		color: {
			value: function(id) {
				if (id === undefined) return "#000000";
				const colors = [
					"darkred",   "navy",           "indigo",          "teal",
					"crimson",   "dodgerblue",     "mediumslateblue", "yellowgreen",
					"deeppink",  "cornflowerblue", "purple",          "darkgreen",
					"orangered", "cyan",           "blueviolet",      "limegreen",
					"dimgray"
				];
				const color = __Array(colors);
				return color.valueOf(id);
			}
		},
		/**. '{void _struct(node svg, string builder)}: Constrói a área do gráfico, devendo ser chamado após a análise dos dados. O argumento '{svg} é o objeto de construçã da imagem do gráfico e '{builder} é uma string podendo adicionar os seguintes valores separados por espaços:
		|Nome|Descrição|
		|title|Adiciona o título ao gráfico.|
		|xlabel|Adiciona o rótulo do eixo x.|
		|ylabel|Adiciona o rótulo do eixo y.|
		|xyplan|Adiciona um retângulo à area de plotagem.|
		|xyaxes|Adiciona os eixos abscissa e ordenada (incompatível com xyplan).|
		|hlines|Adiciona subdivisões de linhas horizontais.|
		|vlines|Adiciona subdivisões de linhas verticais.|
		|xscale|Adiciona a escala ao eixo x.|
		|yscale|Adiciona a escala ao eixo y.|
		|hzero|Adiciona uma linha horizontal se zero estiver no intervalo.|
		|vzero|Adiciona uma linha vertical se zero estiver no intervalo.|
		|mouse|Adiciona um identificador de posição no gráfico a partir da posição do mouse.|**/
		_struct: {
			value: function(svg, builder) {
				if (!__Type(builder).chars) return;
				const cfg    = this._cfg;
				const parts  = builder.replace(/\ +/, " ").trim().toLowerCase().split(" ");
				const chart  = {};
				const color  = this.color();
				const border = {n: false, e: false, s: false, w: false};
				for (let i = 0; i < parts.length; i++) chart[parts[i]] = true;

				/*-- Área de plotagem --*/
				const attrMain = {stroke: "none", fill: "none", "stroke-width": 2, "stroke-linecap": "round"};
				svg.rect(cfg.xStart, cfg.yStart, cfg.xSize, cfg.ySize).attribute(attrMain);
				const main = svg.last;

				/*-- Título do gráfico --*/
				if (chart.title) {
					svg.text(cfg.xMiddle, cfg.top, this.title, "hc").attribute({
						fill: color, "font-size": "1.5em", "font-weight": "bold", cursor: "default"
					});
				}
				/*-- Rótulo do eixo horizontal --*/
				if (chart.xlabel) {
					svg.text(cfg.xMiddle, cfg.height - 2*cfg.padding, this.xLabel, "hs")
					.attribute({fill: color, cursor: "default"});
				}
				/*-- Rótulo do eixo vertical --*/
				if (chart.ylabel) {
					svg.text(2*cfg.padding, cfg.yMiddle, this.yLabel, "vn")
					.attribute({fill: color, cursor: "default"});
				}
				/*-- Linha secundária de zero horizontal --*/
				if (chart.hzero && (this._yMin < 0 && this._yMax > 0)) {
					const zero = this._yScale(0);
					svg.line([cfg.xStart, zero], [cfg.xClose, zero])
					.attribute({stroke: color, "stroke-width": 2, fill: "none"});
				}
				/*-- Linha secundária de zero vertical --*/
				if (chart.vzero && (this._xMin < 0 && this._xMax > 0)) {
					const zero = this._xScale(0);
					svg.line([zero, cfg.yStart], [zero, cfg.xClose])
					.attribute({stroke: color, "stroke-width": 2, fill: "none"});
				}
				/*-- Abscissas e ordenadas (retângulo) --*/
				if (chart.xyplan) {
					main.setAttribute("stroke", color);
					for (let j in border) border[j] = true;
				}
				/*-- Abscissa e ordenada (eixos perpendiculares) --*/
				else if (chart.xyaxes) {
					svg.lines(
						[cfg.xStart, cfg.xStart, cfg.xClose],
						[cfg.yStart, cfg.yClose, cfg.yClose],
						false
					).attribute(attrMain).attribute({stroke: color});
					border.s = true;
					border.w = true;
				}
				/*-- pontos, valores e âncoras --*/
				const dw = (cfg.xClose - cfg.xStart) / (cfg.points - 1);
				const dh = (cfg.yClose - cfg.yStart) / (cfg.points - 1);
				const dx = (this._xMax - this._xMin) / (cfg.points - 1);
				const dy = (this._yMax - this._yMin) / (cfg.points - 1);
				const xAxis = this.xAxis;
				const yAxis = this.yAxis;
				let px, py, vx, vy, ax, ay;
				let i = -1;
				while (++i < cfg.points) {
					/*-- obtendo referenciais para montagem da área de plotagem --*/
					let zero = i === 0;
					let half = i === ((cfg.points - 1) / 2);
					let last = i === (cfg.points - 1);
					let hide = i%2 !== 0;
					let line = {h: true, v: true};
					/*-- primeiro e último valor da escala --*/
					if (zero || last) {
						px = zero ? cfg.xStart : cfg.xClose;
						py = zero ? cfg.yClose : cfg.yStart;
						vx = zero ? this._xMin : this._xMax;
						vy = zero ? this._yMin : this._yMax;
						ax = zero ? "hnw" : "hne";
						ay = zero ? "hse" : "hne";
						line.h = zero ? !border.s : !border.n;
						line.v = zero ? !border.w : !border.e;
					}
					/*-- valores intermediários da escala --*/
					else {
						px = half ? (cfg.xClose + cfg.xStart) / 2 : px + dw;
						py = half ? (cfg.yStart + cfg.yClose) / 2 : py - dh;
						vx = half ? (this._xMax + this._xMin) / 2 : vx + dx;
						vy = half ? (this._yMax + this._yMin) / 2 : vy + dy;
						ax = "hn";
						ay = "he";
					}
					/*-- Linhas secundárias horizontais --*/
					if (chart.hlines) {
						svg.line([cfg.xStart, py], [cfg.xClose, py]).attribute({
							stroke: "#778899", "stroke-width": 1, "stroke-linecap": "round",
							"stroke-dasharray": (vy === 0 ? "none" : "6,6"),
							"class": (hide ? "js-wd-chart-hide" : ""),
							"display": line.h ? "inline" : "none"
						});
					}
					/*-- Linhas secundárias verticais --*/
					if (chart.vlines) {
						svg.line([px, cfg.yStart], [px, cfg.yClose]).attribute({
							stroke: "#778899", "stroke-width": 1, "stroke-linecap": "round",
							"stroke-dasharray": (vx === 0 ? "none" : "6,6"),
							"class": (hide ? "js-wd-chart-hide" : ""),
							"display": line.v ? "inline" : "none"
						});
					}
					/*-- Escala eixo horizontal --*/
					if (chart.xscale) {
						let size = xAxis === "datetime" ? "x-small" : "smaller";
						let sval = this._values(vx, "x");
						svg.text(px, cfg.yClose + cfg.padding, sval, ax)
						.attribute({
							fill: color, "class": (hide ? "js-wd-chart-hide" : ""),
							cursor: "default", "font-size": size
						}).title(this._values(vx, "X"));
					}
					/*-- Escala eixo vertical --*/
					if (chart.yscale) {
						let size = (/^(date)?(time)?$/).test(yAxis) ? "x-small" : "smaller";
						let sval = this._values(vy, "y");
						svg.text(cfg.xStart - cfg.padding, py, sval, ay)
						.attribute({
							fill: color, "class": (hide ? "js-wd-chart-hide" : ""),
							cursor: "default", "font-size": size
						}).title(this._values(vy, "Y"));
					}
				}
				/*-- Evento do mouse dentro da área de plotagem --*/
				if (chart.mouse) {
					/*-- texto com os valores do conjunto (x,y) --*/
					svg.text(cfg.width - cfg.padding, cfg.height - cfg.padding, "", "hse")
					.attribute({
						fill: color, cursor: "default", "data-wd-chart-tool": "coordinates",
						"font-size": "small"
					});
					/*-- linha horizontal --*/
					svg.line([cfg.xStart, cfg.yStart], [cfg.xClose, cfg.yStart])
					.attribute({
						"stroke-width": 1, stroke: color, display: "none", "data-wd-chart-tool": "hline"
					});
					/*-- linha vertical --*/
					svg.line([cfg.xStart, cfg.yStart], [cfg.xStart, cfg.yClose])
					.attribute({
						"stroke-width": 1, stroke: color, display: "none", "data-wd-chart-tool": "vline"
					});
					/*-- Disparador do Evento do mouse --*/
					const self = this;
					svg.svg().onmousemove = function (ev) {
						const ps = svg.svg().getBoundingClientRect();
						const pm = main.getBoundingClientRect();
						const mx = ev.clientX;
						const my = ev.clientY;
						const go = mx >= pm.left && mx <= pm.right && my >= pm.top && my <= pm.bottom;
						const hline = svg.svg().querySelector("[data-wd-chart-tool=hline]");
						const vline = svg.svg().querySelector("[data-wd-chart-tool=vline]");
						const xypos = svg.svg().querySelector("[data-wd-chart-tool=coordinates]");
						/*-- Dentro da área de plotagem --*/
						if (go) {
							const dx = self._xMax - self._xMin;
							const dy = self._yMax - self._yMin;
							const vx = self._xMin + ((mx - pm.left)/pm.width)*dx;
							const vy = self._yMax - ((my - pm.top)/pm.height)*dy;
							const px = self._xScale(vx);
							const py = self._yScale(vy);
							const tx = self._values(vx, "X");
							const ty = self._values(vy, "Y");
							const hl = {y1: py, y2: py, display: "inline"};
							const vl = {x1: px, x2: px, display: "inline"};
							xypos.textContent = tx+" × "+ty;
							svg.svg().setAttribute("cursor", "crosshair");
							for (let i in hl) hline.setAttribute(i, hl[i]);
							for (let i in vl) vline.setAttribute(i, vl[i]);
						}
						/*-- Fora da área de plotagem --*/
						else {
							xypos.textContent = "";
							hline.setAttribute("display", "none");
							vline.setAttribute("display", "none");
							svg.svg().removeAttribute("cursor");
						}
						return;
					}
				}
				return;
			}
		},
		/**. '{string _values(number value, string type)}: Formata e retorna o valor a ser exibido nos eixos. O argumento '{value} corresponde ao valor numérico a ser formatado. O argumento opcional '{type} diz respeito ao tipo de informação (number, i{time}, i{date}, i{datetime} ou i{percent}).**/
		_values: {
			value: function(value, axis) {
				//minúsculo é para o eixo maiúsculo para para exibição
				const x = axis === "x" || axis === "X";
				const y = axis === "y" || axis === "Y";
				/*-- valores para eixos e exibição --*/
				if (x || y) {
					const scale = x ? this.xAxis : this.yAxis;
					/*-- escala data/tempo | valor para eixo e exibição --*/
					if ((/^(date|time|datetime)$/).test(scale)) {
						const num = new __DateTime(value);
						if (scale === "date") return num.toLocaleDateString();
						if (scale === "time") return num.toLocaleTimeString();
						const dt = num.toLocaleString()
						return axis === "y" ? dt.replace(/\,?\s+/, "\n") : dt;
					}
					/*-- escala numérica/proporcional --*/
					const num = new __Number(value);
					const exp = num.exp;
					let cfg;
					/*-- valores para eixo --*/
					if (axis === "x" || axis === "y") {
						if (scale === "percent") {
							cfg = {type: "percent"};
							     if (num ==  0) cfg.decimal = 0;
							else if (exp <= -4) cfg.decimal = 4;
							else if (exp <= -3) cfg.decimal = 3;
							else if (exp <=  0) cfg.decimal = 2;
							else if (exp <= +1) cfg.decimal = 1;
							else                cfg.decimal = 0;
						} else {
							     if (num ==    0) cfg = {type: "decimal",    decimal: 0};
							else if (exp >=  100) cfg = {type: "scientific", decimal: 0};
							else if (exp >=   10) cfg = {type: "scientific", decimal: 1};
							else if (exp >=    3) cfg = {type: "scientific", decimal: 2};
							else if (exp >=    2) cfg = {type: "decimal",    decimal: 1};
							else if (exp >=    1) cfg = {type: "decimal",    decimal: 2};
							else if (exp <= -100) cfg = {type: "scientific", decimal: 0};
							else if (exp <=  -10) cfg = {type: "scientific", decimal: 1};
							else if (exp <    -1) cfg = {type: "scientific", decimal: 2};
							else                  cfg = {type: "decimal",    decimal: 2};
						}
					}
					/*-- valores para exibição --*/
					else {
						const min = x ? this._xMin : this._yMin;
						const max = x ? this._xMax : this._yMax;
						const gap = (max - min) / (x ? this._cfg.width : this._cfg.height);
						const dec = gap < 1 ? Math.abs(new __Number(gap).exp) : 0;
						const sci = exp > 2 || exp < -2;
						cfg = {};
						if (scale === "percent") {
							cfg.type = "percent";
							cfg.decimal = dec <= 2 ? 0 : dec-2;
						} else {
							cfg.type    = sci ? "scientific" : "decimal";
							cfg.decimal = dec + (sci ? exp : 0);
						}
					}
					return num.toLocaleString(cfg);
				}
				/*-- valores para constantes --*/
				const num = new __Number(value);
				return num.toLocaleString();
			}
		},
		/**. '{void _legend(node svg, object data)}: Constrói a legenda do gráfico. O argumento '{svg} é o elemento SVG onde o gŕafico está sendo construído. O argumento '{data} contém as propriedades '{id} (identificador da legenda), '{name} (nome da curva), '{info} (informação complementar) e '{color} (cor a ser utilizada na legenda). Se '{name} for nulo, a ação será ignorada.**/
		_legend: {
			value: function(svg, data) {
				/*-- definindo itens da legenda --*/
				const legend = [];
				const items  = [];
				const color  = this.color();
				const char   = {val: "*", len: 35};
				for (let i = 0; i < data.length; i++) {
					if (data[i].name !== null) {
						let name = String(data[i].name).trim();
						let side = Math.trunc((char.len-name.length-2)/2);
						let cfg = {
							id:    String(data[i].id),
							text:  String("\u25A0 "+name),
							color: data[i].color,
							info:  [
								char.val.repeat(side)+" "+String(name)+" "+char.val.repeat(side),
								String(data[i].info),
								char.val.repeat(2*side+2+name.length)
							].join("\n"),
							link: null,
						};
						legend.push(cfg);
						items.push(cfg.text);
					}
				}
				if (legend.length < 1) return;
				/*-- Renderizando os itens da legenda --*/
				svg.text(
					this._cfg.xClose + 2*this._cfg.padding,
					this._cfg.yStart + 2*this._cfg.padding,
					items, "hnw"
				);
				/*-- definindo atributos dos itens da legenda --*/
				const links = svg.last.children;
				for (let i = 0; i < legend.length; i++) {
					legend[i].link = links[i];
					let attr  = {
						"font-size": "1.2em", cursor: "pointer", fill: legend[i].color,
						"data-wd-chart-link": legend[i].id
					};
					for (let j in attr)
						legend[i].link.setAttribute(j, attr[j]);
					/*-- definindo informação complementar da curva --*/
					svg.text(
						this._cfg.xStart + 2*this._cfg.padding,
						this._cfg.yStart + 2*this._cfg.padding,
						legend[i].info, "hnw"
					).attribute({
						fill: color, "font-size": "1em", opacity: "0",
						"font-family": "Courier New, monospace",
						"data-wd-chart-info": legend[i].id
					});
					/*-- definindo ação da legenda --*/
					legend[i].link.onclick = function(ev) {
						let root = ev.target;
						while (root.tagName.toLowerCase() !== "svg")
							root = root.parentElement;
						const id     = ev.target.dataset.wdChartLink;
						const show   = root.dataset.wdChartShow !== id;
						const infos  = root.querySelectorAll("[data-wd-chart-info]");
						const curves = root.querySelectorAll("[data-wd-chart-curve]");
						const links  = root.querySelectorAll("[data-wd-chart-link]");
						root.dataset.wdChartShow = show ? id : "";
						/*-- destacando informações complementares --*/
						for (let k = 0; k < infos.length; k++) {
							let ref = infos[k].dataset.wdChartInfo;
							let val = show && ref === id ? "1" : "0";
							infos[k].setAttribute("opacity", val);
						}
						/*-- destacando curvas --*/
						for (let k = 0; k < curves.length; k++) {
							let ref = curves[k].dataset.wdChartCurve;
							let val = show ? (ref === id ? "0.8" : "0.1") : "1";
							curves[k].setAttribute("opacity", val);
						}
						/*-- destacando items da legenda --*/
						for (let k = 0; k < links.length; k++) {
							let ref = links[k].dataset.wdChartLink;
							let val = show ? (ref === id ? "0.8" : "0.1") : "1";
							links[k].setAttribute("fill-opacity", val);
						}

						return;
					}
				}
				return;
			}
		},
		/**. '{node plot()}: Constrói o gráfico e o retorna (elemento SVG) ou nulo.**/
		plot: {
			value: function() {
				if (this._data.length === 0) return null;
				const attrs = {
					line: {"stroke-width": 3, "stroke-linecap": "round", fill: "none"},
					sum:  {"fill-opacity": 0.5, "stroke-width": 1, "stroke-linecap": "round", fill: "none"},
					dash: {"stroke-width": 1, "stroke-linecap": "round", "stroke-dasharray": "5,5", fill: "none"}
				};
				let data   = this._data.slice();
				let legend = [];
				const svg  = __SVG(this._cfg.width, this._cfg.height);
				//FIXME colocar no CSS ou no style?
				const css  = {backgroundColor: "#ffffff", fontSize: "16px", fontWeight: "normal", fontStyle: "normal"};
				for (let i in css) svg.svg().style[i] = css[i];
				/* redefinindo funções para array ----------------------------------- */
				if (this._chart === "plan") {
					let x = this._xSpace;
					let i = -1;
					while(++i < data.length) {
						if (data[i].f) {
							let list = __Data2D(x, data[i].y);
							if (list.error) return null;
							data[i].x = list.x;
							data[i].y = list.y;
							let yList = __Array(data[i].y);
							this._yMin = yList.min;
							this._yMax = yList.max;
						}
					}
				}
				/*-- plotando plano cartesiano ---------------------------------------*/
				if (this._chart === "plan") {
					let i = -1;
					while(++i < data.length) {
						/* obtendo dados da plotagem */
						let id    = data[i].id;
						let x     = data[i].x.slice();
						let y     = data[i].y.slice();
						let name  = data[i].name;
						let info  = data[i].info;
						let color = this.color(id);
						let curve = {id: id, color: color, info: info, name: name};
						/* transformando coordenadas reais para gráficas */
						for (let i = 0; i < x.length; i++) {
							x[i] = this._xScale(x[i]);
							y[i] = this._yScale(y[i]);
						}
						/* plotando de acordo com o tipo de curva */
						if (data[i].type === "line" || data[i].type === "link") {
							svg.lines(x, y)
							.attribute(attrs.line)
							.attribute({stroke: color, "data-wd-chart-curve": id});
						}
						if (data[i].type === "dash") {
							svg.lines(x, y)
							.attribute(attrs.dash)
							.attribute({stroke: color, "data-wd-chart-curve": id});
						}
						if (data[i].type === "dots" || data[i].type === "link") {
							let j = -1;
							while(++j < x.length) {
								svg.circle(x[j], y[j], 4)
								.attribute({fill: color, "data-wd-chart-curve": id});
							}
						}
						if (data[i].type === "sum") {
							let fit = __Data2D(data[i].x, data[i].y);
							let sum = fit.area;
							curve.info = " ∑ yΔx ≈ " + this._values(sum);
							/* obter posicionamento para inserir o rótulo da área */
							let min = Math.min.apply(null, fit.y);
							let max = Math.max.apply(null, fit.y);
							let big = Math.abs(max) >= Math.abs(min) ? max : min;
							let ind = fit.y.indexOf(big);
							let ym  = this._yScale(big/2);
							let xm  = this._xScale(fit.x[ind]);
							let pm  = "hc";
							if (xm <= this._cfg.xStart) xm += this._cfg.padding;
							if (xm >= this._cfg.xClose) xm -= this._cfg.padding;
							if (xm <= (this._cfg.xStart + this._cfg.xSize/4)) pm = "hw";
							if (xm >= (this._cfg.xClose - this._cfg.xSize/4)) pm = "he";
							/* unindo a curva ao eixo horizontal */
							x.unshift(x[0]);
							x.push(x[x.length - 1]);
							y.unshift(this._yScale(0));
							y.push(this._yScale(0));
							/* plotando */
							svg.lines(x, y, true) /* área */
							.attribute(attrs.sum)
							.attribute({stroke: color, fill: color, "data-wd-chart-curve": id})
							.text(xm, ym, this._values(sum, "Y"), pm) /* valor numérico */
							.attribute({fill: color, "data-wd-chart-curve": id})
						}
						if (data[i].type === "avg") {
							let fit = __Data2D(data[i].x, data[i].y);
							let avg = fit.average;
							let xi  = this._xScale(this._xMin);
							let xn  = this._xScale(this._xMax);
							let ya  = this._yScale(avg);
							curve.info = " (∑ yΔx)/ΔX ≈ " + this._values(avg);
							/* plotando a curva e a linha média */
							svg.lines(x, y)
							.attribute(attrs.dash)
							.attribute({stroke: color, "data-wd-chart-curve": id})
							.lines([xi, xn], [ya, ya])
							.attribute(attrs.line)
							.attribute({stroke: color, "data-wd-chart-curve": id})
							.text(x[0]+5, ya-5, this._values(avg, "Y"), "hsw")
							.attribute({fill: color, "data-wd-chart-curve": id});
						}
						legend.push(curve);
					}
					this._struct(svg, "xyaxes hlines vlines xlabel ylabel xscale yscale title mouse");
				}
				/* plotando gráfico proporcional ------------------------------------ */
				else {
					/* checando condições */
					let minus = false;
					let plus  = false;
					let zero  = true;
					let count = 0;
					let total = 0;
					let positive = 0;
					let negative = 0;
					let min      = +Infinity;
					let max      = -Infinity;

					for (let i in data[0]) {
						let value = data[0][i];
						count++;
						total += value;
						if (value < 0)   minus = true;
						if (value > 0)   plus  = true;
						if (value !== 0) zero  = false;
						if (value < 0) negative += value;
						else           positive += value;
						if (value < min) min = value;
						if (value > max) max = value;
					}
					if (count === 0 || zero) return false;
					/* calculando proporções e definindo limites */
					this._xMin  = 0;
					this._xMax  = count;
					this._yMin  = 0;
					this._yMax  = 0;
					let pieces  = [];
					let id      = -1;

					for (let i in data[0]) {
						let value = data[0][i];
						pieces.push({
							value: value,
							ratio: total === 0 ? null : value/total,
							name:  i,
							id:    ++id,
							color: this.color(id),
						});
						this._yMin = value;
						this._yMax = value;
					}
					/*-- gráfico circular ----------------------------------------------*/
					if (this._chart !== "cols" && minus !== plus && total !== 0) {
						this.yAxis = "percent";
						/*-- rótulo inferior --*/
						svg.text(
							this._cfg.xMiddle, this._cfg.bottom,
							this.yLabel + " × " + this.xLabel, "hc"
						).attribute({cursor: "default"});

						/*-- dados para construção dos semi-círculos --*/
						let start = 0;
						let width = 0;
						let i = -1;
						while (++i < pieces.length) {
							let item  = pieces[i];
							let id    = item.id;
							let name  = item.name;
							let value = item.value;
							let ratio = item.ratio;
							let color = item.color;
							let r     = 2*this._cfg.ySize/5;
							let cx    = this._cfg.xMiddle;
							let cy    = this._cfg.yMiddle;
							let curve = {id: id, color: color, info: "", name: name};
							//FIXME melhorar a notação matemática desse negócio
							curve.info = [
								`i) ${this.xLabel} --`,
								`  i  = ${this._values(i+1)} / ${this._values(count)}`,
								//"  {i ∈ ℕ | 1 ≤ i ≤ n}",
								//"  n = "+this._values(count),
								//"  i = "+this._values(i+1),
								`y) ${this.yLabel} --`,
								`  yᵢ = ${this._values(value)} (${this._values(ratio, "y")})`,

								`  ∑y = ${this._values(total)}`,
								`  ȳ  = ${this._values(total/count)}`,
								`  ${this._values(min)} ≤ y ≤ ${this._values(max)}`,


								//"  {y ∈ ℝ | "+this._values(min)+" ≤ y ≤ "+this._values(max)+"}",
								//"  y     = "+this._values(value),
								//"  ∑yᵢ   = "+this._values(total),
								//"  y/∑yᵢ = "+this._values(ratio, "y"),
								//"  ∑yᵢ/n = "+this._values(total/count)
							].join("\n");
							width = 360*ratio;
							/*-- semi-círculos --*/
							svg.semicircle(cx, cy, r, start, width)
							.attribute({fill: color, "data-wd-chart-curve": id, "fill-opacity": 0.8})
							.attribute({"stroke-linecap": "round", "stroke-width": 1, stroke: color})
							.title(curve.info);
							/*-- legenda ao lado dos semi-círculos --*/
							let m = start + width/2;
							let x = cx + (r + 5)*Math.cos(2*Math.PI*m/360);
							let y = cy - (r + 5)*Math.sin(2*Math.PI*m/360);
							let p;
							if      (m <  90) p = m ===   0 ? "hw" : "hsw";
							else if (m < 180) p = m ===  90 ? "hs" : "hse";
							else if (m < 270) p = m === 180 ? "he" : "hne";
							else if (m < 360) p = m === 270 ? "hn" : "hnw";
							else p = "hw";
							svg.text(x, y, name+" ("+this._values(ratio, "y")+")", p)
							.attribute({fill: color, cursor: "default", "data-wd-chart-curve": id})
							.title(curve.info);
							/* iterando */
							start += width;
							legend.push(curve);
						}
						this._struct(svg, "title");
					}
					/*-- gráfico de colunas --------------------------------------------*/
					else {
						this.yAxis = "number";
						/*-- dados para construção das colunas --*/
						const width = this._cfg.xSize / count;
						let i = -1;
						while (++i < pieces.length) {
							let item  = pieces[i];
							let id    = item.id;
							let color = item.color;
							let name  = item.name;
							let value = item.value;
							let x     = this._xScale(i);
							let y     = this._yScale(item.value >= 0 ? item.value : 0);
							let w     = width;
							let h     = Math.abs(this._yScale(item.value) - this._yScale(0));
							let curve = {id: id, color: color, info: "", name: this._values(id+1)+") "+name};
							curve.info = [
								" "+this.xLabel,
								"  {i ∈ ℕ | 1 ≤ i ≤ n}",
								"  n = "+this._values(count),
								"  i = "+this._values(i+1),
								" "+this.yLabel,
								"  {y ∈ ℝ | "+this._values(min)+" ≤ y ≤ "+this._values(max)+"}",
								"  y     = "+this._values(value),
								"  ∑yᵢ   = "+this._values(total),
								"  ∑yᵢ/n = "+this._values(total/count)
							].join("\n");
							/*-- colunas --*/
							svg.rect(x, y, w, h)
							.attribute({fill: color, "fill-opacity": 0.8})
							.attribute({stroke: color, "stroke-width": 2})
							.attribute({"data-wd-chart-curve": id})
							.title(curve.info);
							/*-- Escalas valores (horizontal) --*/
							svg.text(
								x + width/2,
								value >= 0 ? (y-5) : (y+h+5),
								this._values(value, "y"),
								value >= 0 ? "hs" : "hn"
							)
							.attribute({fill: color, cursor: "default", "data-wd-chart-curve": id})
							.title(this._values(value));
							/*-- Escalas id (horizontal) --*/
							svg.text(
								x + width/2,
								value >= 0 ? (y+h+5) : (y-5),
								this._values(id+1),
								value >= 0 ? "hn" : "hs"
							)
							.attribute({fill: color, cursor: "default", "font-weight": "bold", "data-wd-chart-curve": id})
							.title(this._values(id+1)+") "+name);
							legend.push(curve);
						}
						this._struct(svg, "hlines ylabel xlabel yscale hzero title");
					}
				}
				this._legend(svg, legend);
				return svg.svg();
			}
		},
		/**. '{string xLabel}: Define ou retorna o valor do rótulo do eixo x.**/
		xLabel: {
			get: function()  {return this._xLabel;},
			set: function(x) {this._xLabel = x === null || x === undefined ? "X Label" : String(x);}
		},
		/**. '{string yLabel}: Define ou retorna o valor do rótulo do eixo y.**/
		yLabel: {
			get: function()  {return this._yLabel;},
			set: function(x) {this._yLabel = x === null || x === undefined ? "Y Label" : String(x);}
		},
		/**. '{string title}: Define ou retorna o valor do título do gráfico.**/
		title: {
			get: function()  {return this._title;},
			set: function(x) {this._title = x === null || x === undefined ? "Title" : String(x);}
		},
		/**. '{string xAxis}: Define ou retorna o tipo de escala do eixo '{x}: number, date, time, datetime ou percent.**/
		xAxis: {
			get: function()  {return this._xAxis;},
			set: function(x) {
				let values  = ["date", "time", "datetime", "percent"];
				this._xAxis = values.indexOf(x) >= 0 ? x : "number";
			}
		},
		/**. '{string yAxis}: Define ou retorna o tipo de escala do eixo '{y}: number, date, time, datetime ou percent.**/
		yAxis: {
			get: function()  {return this._yAxis;},
			set: function(x) {
				let values  = ["date", "time", "datetime", "percent"];
				this._yAxis = values.indexOf(x) >= 0 ? x : "number";
			}
		},
		/**. '{boolean add(array x, any y, string label, string option)}: Adiciona dados para plotagem e retorna falso se não for possível processar a solicitação. Os argumentos '{x} e '{y} representam a abscissa (eixo horizontal) e a ordenada (eixo vertical), respectivamente. Seus valores dependem do tipo de gráfico.
		|Propriedade|Plotagem|Tipo|Descrição|
		|x|Plano cartesiano|array|Lista de valores finitos ou data/tempo|
		|y|Plano cartesiano|array|Lista de valores finitos ou data/tempo|
		|y|Plano cartesiano|função|Função i{f(x)} que retorna um valor finito|
		|y|Plano cartesiano|número|Uma constante finita|
		|x|Circular/Colunas|array|Lista de identificadores|
		|y|Circular/Colunas|array|Lista de valores finitos ou data/tempo relacionados a cada identificador (item) de i{x}|
		|x|Circular/Colunas|objeto|Um objeto cujas propriedades e seus valores correspondem as listas de i{x} e i{y}|
		|y|Circular/Colunas|indefinido|Se i{x} for um objeto|
		|label|Plano cartesiano|string|utilizado para identificar o gráfico|
		. No caso de gráfico circular, se existir valores positivos e negativos para os identificadores, um gráfico de barras será exibido no lugar.
		. Quando utilizar valores de data/tempo, a referência obtida será a quantidade de segundos desde 0000-01-01.
		. O argumento '{option} é opcional e direcionado para o gráfico de plano cartesiano com valores de '{x} e '{y} como array. Seus valores podem ser (todos retornam valores aproximados):
		|Valor|Descrição|
		|linear|Traça a regressão linear.|
		|geometric|Traça a regressão geométrica.|
		|logarithmic|Traça a regressão logarítmica.|
		|exponential|Traça a regressão exponencial.|
		|minimum|Traça a regressão com o menor valor de desvio padrão.|
		|avg|Traça o valor médio da curva.|
		|sum|Traça a área sob a curva.|
		|line|Traça uma linha ligando os pontos da curva.|
		|link|Traça uma linha ligando os pontos demarcados da curva.|
		|dots|Traça os pontos demarcados.|**/
		add: {
			value: function(x, y, label, option) {
				let xdata = __Type(x);
				let ydata = __Type(y);
				label = label === null || label === undefined ? "Label ?" : String(label).trim();

				/*----------------------------------------------------------------------
					gráfico proporcional
				----------------------------------------------------------------------*/
				if (this._chart === "pie" || this._chart === "cols") {
					if (this._data.length === 0) this._data.push({});
					let data = this._data[0];

					/*-- objeto --------------------------------------------------------*/
					if (xdata.object) {
						for (let name in x) {
							let check = __Type(x[name]);
							let value = null;
							if (check.finite || check.date || check.time || check.datetime)
								value = check.finite ? check.value : new __DateTime(x[name]).valueOf();
							if (value !== null)
								data[name] = value + (name in data ? data[name] : 0);
						}
						return true;
					}
					/*-- array ---------------------------------------------------------*/
					else if (xdata.array && ydata.array) {
						let i   = -1;
						let obj = {};
						while (++i < x.length) {
							if (i >= y.length) break;
							obj[String(x[i])] = y[i];
						}
						return this.add(obj);
					}
					return false;
				}
				/*----------------------------------------------------------------------
					gráfico cartesiano
				----------------------------------------------------------------------*/
				else {
					/* checando dados e definindo tipos de curvas */
					if (!xdata.array) return false;
					option    = String(option).trim();
					let types = {
						function: {sum: "sum", avg: "avg", line: "line", main: "line"},
						finite:   {sum: "sum", main: "line"},
						array:    {sum: "sum", avg: "avg", line: "line", link: "link", dots: "dots", main: "link"},
						fit:      {
							linear:    "linearFit",    exponential: "exponentialFit",
							geometric: "geometricFit", logarithmic: "logarithmicFit",
							minimum:   "minDeviation"
						}
					};
					/* definindo limites superiores e inferiores no caso de área */
					if (option === "sum") {
						this._yMin = 0;
						this._yMax = 0;
					}
					/* Y é função ------------------------------------------------------- */
					if (ydata.function) {
						let curve = types.function;
						let data  = __Data2D(x, x);
						if (data.error) return false;
						let xmin   = Math.min.apply(null, data.x);
						let xmax   = Math.max.apply(null, data.x);
						this._xMin = xmin;
						this._xMax = xmax;
						this._data.push({
							x:    [xmin, xmax],
							y:    y,
							name: label,
							info: y.name.trim() === "" ? " y = "+label : " f(x) = "+y.name+"(x)",
							f:    true,
							type: option in curve ? curve[option] : curve.main,
							id:   ++this._id
						});console.log(y.name)
						return true;
					}
					/* Y é constante ---------------------------------------------------- */
					else if (ydata.finite) {
						let curve = types.finite;
						let data  = __Data2D(x, y);
						if (data.error) return false;
						let cte    = ydata.value;
						let xmin   = Math.min.apply(null, data.x);
						let xmax   = Math.max.apply(null, data.x);
						this._xMin = xmin;
						this._xMax = xmax;
						if (this._yMin >= cte)
							this._yMin = cte === 0 ? -1 : cte - Math.abs(cte/2);
						if (this._yMax <= cte)
							this._yMax = cte === 0 ? +1 : cte + Math.abs(cte/2);
						this._data.push({
							x:    [xmin, xmax],
							y:    [cte, cte],
							name: label,
							info: " f(x) = "+this._values(cte),
							f:    false,
							type: option in curve ? curve[option] : curve.main,
							id:   ++this._id
						});
						return true;
					}
					/* Y é array -------------------------------------------------------- */
					else if (ydata.array) {
						let curve = types.array;
						let data  = __Data2D(x, y);
						if (data.error) return false;
						let xlimit = {
							min: Math.min.apply(null, data.x),
							max: Math.max.apply(null, data.x)
						};
						let ylimit = {
							min: Math.min.apply(null, data.y),
							max: Math.max.apply(null, data.y)
						};
						this._xMin = xlimit.min;
						this._xMax = xlimit.max;
						this._yMin = ylimit.min;
						this._yMax = ylimit.max;
						this._data.push({
							x:    data.x,
							y:    data.y,
							name: label,
							info: "",
							f:    false,
							type: option in curve ? curve[option] : curve.main,
							id:   ++this._id
						});
						/* regressões ----------------------------------------------------- */
						if (option in types.fit) {
							let fit = data[types.fit[option]];
							if (fit === null) return false;
							let target = this._data.length - 1;
							this._data[target].info = [
								" "+fit.m,
								" a = "+this._values(fit.a),
								" b = "+this._values(fit.b),
								" σ = "+this._values(fit.d)
							].join("\n");
							this._data[target].type = "dots";

							/* função principal */
							this._data.push({
									x:    [xlimit.min, xlimit.max],
									y:    fit.f,
									name: null,
									info: "",
									f:    true,
									type: "line",
									id:   this._id
							});
							/* desvio padrão */
							if (fit.d === 0) return true;
							this._data.push({
									x:     [xlimit.min, xlimit.max],
									y:     function(x) {return fit.f(x)+fit.d;},
									name:  null,
									info:  "",
									f:     true,
									type:  "dash",
									id:   this._id
							});
							this._data.push({
									x:    [xlimit.min, xlimit.max],
									y:    function(x) {return fit.f(x)-fit.d;},
									name: null,
									info: "",
									f:    true,
									type: "dash",
									id:   this._id
							});
						}
						return true;
					}
				}
				return false;
			}
		},
	});








//FIXME copy como fazer?
/*----------------------------------------------------------------------------*/
	function wd_copy(value) { /* copia o conteúdo da variável para a área de transferência */
		/* copiar o que está selecionado */
		if (value === undefined && "execCommand" in document) {
			document.execCommand("copy");
			return true;
		}
		/* copiar DOM: elemento ou tudo */
		let data = wd_vtype(value);
		if (data.type === "dom" && "execCommand" in document) {
			let element = data.value.length > 0 ? data.value[0] : document.body;
			let range   = document.createRange();
			let select  = window.getSelection();
			select.removeAllRanges();          /* limpar seleção existente */
			range.selectNodeContents(element); /* pegar os nós do elemento */
			select.addRange(range);            /* seleciona os nós do elemento */
			document.execCommand("copy");      /* copia o texto selecionado */
			select.removeAllRanges();          /* limpar seleção novamente */
			return true;
		}

		/* array e object: JSON */
		if (data.type === "array" || data.type === "object")
			value = wd_json(value);

		/* copiar valor informado */
		if ("clipboard" in navigator && "writeText" in navigator.clipboard) {
			navigator.clipboard.writeText(value === null ? "" : value).then(
				function () {/*sucesso*/},
				function () {/*erro*/}
			);
			return true;
		}

		return false;
	}










/* == BLOCO 2 ================================================================*/

/*----------------------------------------------------------------------------*/
	/**#3 Interface do Usuário
	Trata-se de construtores e funções para interface com o usuário na manipulação de dados.

	#4 WDmain
	''constructor object WDmain(any  input, object data)''
	Construtor genérico para manipulação de dados cujos construtores específicos herdarão seu comportamento.
	O argumento '{input} se refere ao dado informado pelo usuário e o argumento '{data} corresponde à instância de '{__Type}, cuja alimentação será realizada pela função '{WD}.**/
	function WDmain(input, data) {
		Object.defineProperties(this, {
			_input: {value: input},
			_data:  {value: data},
		});
	}

	Object.defineProperties(WDmain.prototype, {
		constructor: {value: WDmain},
		/**. '{any valueOf()}: Retorna o valor do dado (ver '{__Type}).**/
		valueOf: {value: function() {return this._data.valueOf();}},
		/**. '{string toString()}: Retorna o valor textual do dado (ver '{__Type}).**/
		toString: {value: function() {return this._data.toString();}},
		/**. '{string type}: Retorna o tipo do dado.**/
		type: {get: function() {return this._data.type;}},
		/**. '{boolean or(string type...)}: Retorna verdadeiro algum tipo informado em '{type} corresponder ao dado.**/
		or: {
			value: function(type) {
				for (let i = 0; i < arguments.length; i++)
					if (this._data[arguments[i]] === true) return true;
				return false;
			}
		},
		/**. '{boolean is(string type...)}: Retorna verdadeiro todos os tipos informados em '{type} corresponder ao dado.**/
		is: {
			value: function(type) {
				if (arguments.length < 2) return this.or(type);
				for (let i = 0; i < arguments.length; i++)
					if (this._data[arguments[i]] !== true) return false;
				return true;
			}
		},
		/**. '{string mask(string model)}: Retorna o valor formatado pela máscara definida no argumento '{model}. Se a máscara não casar, retornará uma string vazia.**/
		mask: {value: function(model) {return new __String(this._input).mask(model);}},
		/**. '{boolean instanceOf(string name)}: Checa se o conteúdo é instância do objeto informado em '{name}.**/
		instanceOf: {value: function(name) {return this._data.instanceOf(name);}},


		//FIXME colocar isso de forma genérica? to(type)
		/**. '{array csv}: Retorna string em CSV para array.**/
		//csv: {get: function() {return this._main.csv;}},
		/**. '{any json}: Retorna notação em JSON para valor em Javascript ou nulo se inválido.**/
		//json: {get: function() {return this._main.json;}},
		/**. '{node html}: Retorna notação em HTML para documento correspondente ou nulo se inválido.**/
		//html: {get: function() {return this._main.html;}},
		/**. '{node xml}: Retorna notação em XML para documento correspondente ou nulo se inválido.**/
		//xml: {get: function() {return this._main.xml;}},
		/**. '{string csv}: Retorna o array, se organizado em forma de matriz, no formato CSV.**/
		/*mcsv: {
			get: function() {
				let table = __Table();
				table.matrix(this.valueOf());
				return table.csv();
			;}
		},*/



	});

/*----------------------------------------------------------------------------*/
	/**#4 WDstring
	''constructor object WDstring(any  input, object data)''
	Construtor genérico para manipulação de strings. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDstring(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __String(data.value)},
		});
	}

	WDstring.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDstring},
		/**. '{integer length}: Retorna a quantidade de caracteres.**/
		length: {get: function() {return this._main.length;}},
		/**. '{string upper}: Retorna caixa alta.**/
		upper: {get: function() {return this._main.upper;}},
		/**. '{string lower}: Retorna caixa baixa.**/
		lower: {get: function() {return this._main.lower;}},
		/**. '{string capitalize}: Retorna a primeira letra de cada palavra em caixa alta.**/
		capitalize: {get: function() {return this._main.capitalize;}},
		/**. '{string toggle}: Inverte a caixa.**/
		toggle: {get: function() {return this._main.toggle;}},
		/**. '{string camel}: Transforma a string em camelCase.**/
		camel: {get: function() {return this._main.camel;}},
		/**. '{string dash}: Divide a string em traços.**/
		dash: {get: function() {return this._main.dash;}},
		/**. '{string clear}: Remove acentos.**/
		clear: {get: function() {return this._main.clear(false, true);}},
		/**. '{string trim}: Remove espaços excedentes.**/
		trim: {get: function() {return this._main.clear(true, false);}},
		/**. '{string clean}: Remove acentos e espaços excedentes.**/
		clean: {get: function() {return this._main.clear();}},
	});

/*----------------------------------------------------------------------------*/
	/**#4 WDnumber
	''constructor object WDnumber(any  input, object data)''
	Construtor genérico para manipulação de números. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDnumber(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __Number(data.value)},
		});
	}

	WDnumber.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnumber},
		/**. '{integer int}: Retorna a parte inteira.**/
		int: {get: function() {return this._main.int;}},
		/**. '{number dec}: Retorna a parte decimal.**/
		dec: {get: function() {return this._main.dec;}},
		/**. '{number abs}: Retorna o valor absoluto.**/
		abs: {get: function() {return this._main.abs;}},
		/**. '{boolean prime}: Informa se o número é primo por meio de um Promise.**/
		prime: {get: async function() {return this._main.prime;}},
		/**. '{array primes}: Retorna uma lista de primos precedentes por meio de um Promise.**/
		primes: {get: async function() {return this._main.primes;}},
		/**. '{number factorization}: Retorna a fatorização do número por meio de um Promise.**/
		factorization: {get: async function() {return this._main.factorization;}},
		/**. '{number fixed(integer length, boolean round)}: Abrevia o número para as casas decimais (ver __Number).**/
		fixed: {value: function(lenght, round) {return this._main.fixed(lenght, round);}},
		/**. '{string fraction}: Retorna o número em forma de fração.**/
		fraction: {get: function() {return this._main.frac;}},
		/**. '{string bytes}: Retorna o número em quantidade de bytes.**/
		bytes: {get: function() {return this._main.bytes;}},
		/**. '{string toString()}: Funciona como o método nativo.**/
		toString: {value: function(type) {return this._main.value.toString(type);}},
		/**. '{string toLocaleString(object options)}: Ver __Number.**/
		toLocaleString: {value: function(options) {return this._main.toLocaleString(options);}},
	});

/*----------------------------------------------------------------------------*/
	/**#4 WDtime**/
	/**''constructor object WDtime(any  input, object data)''
	Construtor para manipulação de tempo. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDtime(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __DateTime(data.value)},
		});
	}

	WDtime.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDtime},
		/**. '{number hour}: Retorna ou define a hora.**/
		hour: {
			get: function()  {return this._main.hour;},
			set: function(x) {return this._main.hour = x;}
		},
		/**. '{number minute}: Retorna ou define o minuto.**/
		minute: {
			get: function()  {return this._main.minute;},
			set: function(x) {return this._main.minute = x;}
		},
		/**. '{number second}: Retorna ou define o segundo.**/
		second: {
			get: function()  {return this._main.second;},
			set: function(x) {return this._main.second = x;}
		},
		/**. '{integer h12}: Retorna a hora no ciclo de 12h.**/
		h12: {get: function() {return this._main.main.h12;}},
		/**. '{string h12}: Retorna AM ou PM.**/
		meridiem: {get: function() {return this._main.main.meridiem;}},
		/**. '{integer valueOf()}: Retorna os segundos desde 00:00:00.000.**/
		valueOf: {value: function() {return this._main.valueOfTime();}},
		/**. '{string toString()}: Retorna o tempo no formado hh:mm:ss.sss.**/
		toString: {value: function() {return this._main.toTimeString();}},
		/**. '{string toLocaleString()}: Retorna o tempo no formato local.**/
		toLocaleString: {value: function() {return this._main.toLocaleTimeString();}},
		/**. '{string format(string input)}: Retorna notação de hora pre-formatada em '{input}.**/
		format: {value: function(input) {return this._main.format(input, "time");}},
	});

/*----------------------------------------------------------------------------*/
	/**#4 WDdate**/
	/**''constructor object WDdate(any  input, object data)''
	Construtor para manipulação de data. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDdate(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __DateTime(data.value)},
		});
	}

	WDdate.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDdate},
		/**. '{number year}: Retorna ou define o ano.**/
		year: {
			get: function()  {return this._main.year;},
			set: function(x) {return this._main.year = x;}
		},
		/**. '{number month}: Retorna ou define o mês.**/
		month: {
			get: function()  {return this._main.month;},
			set: function(x) {return this._main.month = x;}
		},
		/**. '{number day}: Retorna ou define o dia.**/
		day: {
			get: function()  {return this._main.day;},
			set: function(x) {return this._main.day = x;}
		},
		/**. '{integer week}: Retorna o número da semana.**/
		week: {get: function()  {return this._main.main.week;}},
		/**. '{integer weekDay}: Retorna o número do dia da semana.**/
		weekDay: {get: function()  {return this._main.main.weekDay;}},
		/**. '{boolean leap}: Informa se o ano é bissexto.**/
		leap: {get: function()  {return this._main.main.leap;}},
		/**. '{integer width}: Retorna a quantidade de dias do mês.**/
		width: {get: function()  {return this._main.main.width;}},
		/**. '{integer days}: Retorna o número do dia do ano.**/
		days: {get: function()  {return this._main.main.days;}},
		/**. '{integer work}: Retorna o número de dias úteis até o momento.**/
		work: {get: function()  {return this._main.main.work;}},
		/**. '{integer valueOf()}: Retorna o número de dias desde 0000-01-01.**/
		valueOf: {value: function() {return this._main.valueOfDate();}},
		/**. '{string toString()}: Retorna a data no formato YYYY-MM-DD.**/
		toString: {value: function() {return this._main.toDateString();}},
		/**. '{string toWeekString()}: Retorna a semana no formato YYYY-Www.**/
		toWeekString: {value: function() {return this._main.toWeekString();}},
		/**. '{string toLocaleString()}: Retorna a data no formato local.**/
		toLocaleString: {value: function() {return this._main.toLocaleDateString();}},
		/**. '{string format(string input)}: Retorna notação de data pre-formatada em '{input}.**/
		format: {value: function(input) {return this._main.format(input, "date");}},
	});

/*----------------------------------------------------------------------------*/
	/**#4 WDdatetime**/
	/**''constructor object WDdatetime(any  input, object data)''
	Construtor para manipulação de data/tempo. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDdatetime(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __DateTime(data.value)},
		});
	}

	WDdatetime.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDdatetime},
		/**. '{integer valueOf()}: Retorna o número de segundos desde 0000-01-01T00:00:00.000.**/
		valueOf:     {value: function() {return this._main.valueOf();}},
		/**. '{integer valueOfDate()}: Retorna o número de dias desde 0000-01-01.**/
		valueOfDate: {value: function() {return this._main.valueOfDate();}},
		/**. '{number valueOfTime()}: Retorna os segundos desde 00:00:00.000.**/
		valueOfTime: {value: function() {return this._main.valueOfTime();}},
		/**. '{number valueOfDays()}: Retorna os dias desde 0000-01-01 com o tempo como elemento decimal.**/
		valueOfDays: {value: function() {return this._main.valueOfDays();}},
		/**. '{string toDateString()}: Retorna a data no formato YYYY-MM-DD.**/
		toDateString: {value: function() {return this._main.toDateString();}},
		/**. '{string toTimeString()}: Retorna o tempo no formato hh:mm:ss.sss.**/
		toTimeString: {value: function() {return this._main.toTimeString();}},
		/**. '{string toWeekString()}: Retorna a semana no formato YYYY-Www.**/
		toString: {value: function() {return this._main.toString();}},
		/**. '{string toLocaleDateString()}: Retorna a data no formato local.**/
		toLocaleDateString: {value: function() {return this._main.toLocaleDateString();}},
		/**. '{string toLocaleTimeString()}: Retorna o tempo no formato local.**/
		toLocaleTimeString: {value: function() {return this._main.toLocaleTimeString();}},
		/**. '{string toLocaleString()}: Retorna o valor data/tempo no formato local.**/
		toLocaleString: {value: function() {return this._main.toLocaleString();}},
		/**. '{string format(string input)}: Retorna notação data/tempo pre-formatada em '{input}.**/
		format: {value: function(input) {return this._main.format(input);}},
	});

	/*-- copiando propriedades de WDtime e WDdate para WDdatetime --------------*/
	const TIME_PROPERTIES = Object.getOwnPropertyNames(WDtime.prototype);
	for (let i of TIME_PROPERTIES) {
		if (!(i in WDdatetime.prototype)) {
			let descriptor = Object.getOwnPropertyDescriptor(WDtime.prototype, i);
			Object.defineProperty(WDdatetime.prototype, i, descriptor);
		}
	}
	const DATE_PROPERTIES = Object.getOwnPropertyNames(WDdate.prototype);
	for (let i of DATE_PROPERTIES) {
		if (!(i in WDdatetime.prototype)) {
			let descriptor = Object.getOwnPropertyDescriptor(WDdate.prototype, i);
			Object.defineProperty(WDdatetime.prototype, i, descriptor);
		}
	}

/*----------------------------------------------------------------------------*/
	/**#4 WDarray
	''constructor object WDarray(any  input, object data)''
	Construtor genérico para manipulação de tempo. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDarray(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __Array(data.value)},
		});
	}

	WDarray.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDarray},
		[Symbol.iterator]: {value: function*() {for (let i of this._main) yield i;}},
		/**. '{integer length}: Retorna a quantidade de itens no array.**/
		length: {get: function() {return this._main.length;}},
		/**. '{array unique}: Retorna a lista sem valores repetidos.**/
		unique: {get: function() {return this._main.unique;}},
		/**. '{array asc}: Retorna a lista ordenada de forma ascentende.**/
		asc: {get: function() {return this._main.sort(true);}},
		/**. '{array desc}: Retorna a lista ordenada de forma descendente.**/
		desc: {get: function() {return this._main.sort(false);}},
		/**. '{array sort}: Retorna a lista com ordem inversa ou forma ascendente, se desordenada.**/
		sort: {get: function() {return this._main.sort();}},
		/**. '{array order}: Retorna a lista ordenada de forma ascendente sem repetições.**/
		order: {get: function() {return this._main.order;}},
		/**. '{array add(any ...)}: Adicina itens ao fim da lista e a retorna.**/
		add: {value: function() {return this._main.add.apply(this._main, arguments);}},
		/**. '{array jump(any ...)}: Adicina itens ao início da lista e a retorna.**/
		jump: {value: function() {return this._main.jump.apply(this._main, arguments);}},
		/**. '{array put(any ...)}: Adicina itens, se inexistentes, ao fim da lista e a retorna.**/
		put: {value: function() {return this._main.put.apply(this._main, arguments);}},
		/**. '{array concat(any ...)}: Concatena itens ou arrays ao fim da lista e a retorna.**/
		concat: {value: function() {return this._main.concat.apply(this._main, arguments);}},
		/**. '{array remove(any ...)}: Remove da lista todas as ocorrências dos itens especificados e a retorna.**/
		remove: {value: function() {return this._main.remove.apply(this._main, arguments);}},
		/**. '{array toggle(any ...)}: Alterna a existência dos itens especificados na lista e a retorna.**/
		toggle: {value: function() {return this._main.toggle.apply(this._main, arguments);}},
		/**. '{array replace(any from, any to)}: Altera todas as ocorrências ('{from}) pelo novo valor ('{to}) e retorna a lista modificada.**/
		replace: {value: function(from, to) {return this._main.replace(from, to);}},
		/**. '{array search(any value)}: Retorna uma lista com os índices em que o argumento '{value} aparece.**/
		search: {value: function(value) {return this._main.search(value);}},
		/**. '{boolean check(any ...)}: Retorna verdadeiro se todos os argumentos informados forem localizados.**/
		check: {value: function() {return this._main.check.apply(this._main, arguments);}},
		/**. '{array hide(any ...)}: Retorna a lista ignorando os valores informados como argumento.**/
		hide: {value: function() {return this._main.hide.apply(this._main, arguments);}},
		/**. '{any item(integer index)}: Retorna o item especificado no argumento '{index} considerando uma lista circular.**/
		item: {value: function(index) {return this._main.valueOf(__Type(index).number ? index : 0);}},
		/**. '{string toString()}: Retorna a lista em forma de JSON.**/
		toString: {value: function() {return JSON.stringify(this._data.value);}},
		/**. '{array|number valueOf(string value)}: Retorna uma cópia da lista ou os seguintes valores de acordo com o valor do argumento opcional '{value} que, caso não exista o valor possível, retornará nulo:
		|Value|Tipo|Descrição|
		|min|number|Retorna o menor número finito da lista.|
		|max|number|Retorna o maior número finito da lista.|
		|sum|number|Retorna a soma dos números finitos da lista.|
		|avg|number|Retorna a média dos números finitos da lista.|
		|med|number|Retorna a mediana dos números finitos da lista.|
		|harm|number|Retorna a média harmônica dos números finitos da lista.|
		|geo|number|Retorna a média geométrica dos números finitos da lista.|
		|gcd|number|Retorna máximo divisor comum dos números finitos da lista.|
		|mode|array|Retorna uma lista com os items mais recorrentes.|**/
		valueOf: {
			value: function(value) {
				value = String(value).toLowerCase().trim();
				const self  = this;
				switch(value) {
					case "min":  return self._main.min;
					case "max":  return self._main.max;
					case "sum":  return self._main.sum;
					case "avg":  return self._main.avg;
					case "med":  return self._main.med;
					case "harm": return self._main.harm;
					case "geo":  return self._main.geo;
					case "gcd":  return self._main.gcd;
					case "mode": return self._main.mode;
				}
				return this._main.valueOf().slice();
			}
		},
		//FIXME coloco onde isso aqui?
		/**. '{array cell(string area)}: Retorna uma lista contendo os valores definidos no argumento '{area} de um array organizado no formato de matriz (ver __Table).**/
		cell: {
			value: function(area) {
				let table = __Table();
				table.matrix(this.valueOf());
				return table.cell(area, true);
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 WDobject
	''constructor object WDobject(any  input, object data)''
	Construtor genérico para manipulação de tempo. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDobject(input, data) {
		WDmain.call(this, input, data);
		const request = new __Request(this._input);
		Object.defineProperties(this, {
			_main:    {value: new __DataSet(data.value)},
			_request: {value: request}
		});
	}

	WDobject.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDobject},
		/**. '{self send(function' trigger)}: Efetua requisição XMLHttpRequest e dispara '{trigger}(ver __Request).**/
		send: {value: function(trigger) {this._request.send(trigger); return this;}},
		/**. '{self fetch(function' trigger)}: Efetua requisição fetch e dispara '{trigger}(ver __Request).**/
		fetch: {value: function(trigger) {this._request.fetch(trigger); return this;}},
		/**. '{self read(function' trigger)}: Efetua leitura de arquivos e dispara '{trigger}(ver __Request).**/
		read: {	value: function(trigger) {this._request.read(trigger); return this;}},
		/**. '{string toString()}: Retorna o objeto em forma de JSON, se possível.**/
		toString: {value: function() {return JSON.stringify(this._data.value);}},
	});

/*----------------------------------------------------------------------------*/
	/**#4 WDnode
	''constructor object WDnode(any  input, object data)''
	Construtor genérico para manipulação de nós HTML. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDnode(input, data) {
		WDmain.call(this, input, data);
		const main = this._data.value.slice();
		main.forEach(function(v,i,a) {a[i] = new __Node(v);});
		Object.defineProperties(this, {
			_main:  {value: main},
			_array: {value: new __Array(main)}
		});
	}

	WDnode.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnode},
		/**. '{integer length}: Retorna a quantidade de nós HTML.**/
		length: {get: function() {return this._data.value.length;}},
		/**. '{array valueOf()}: Retorna uma cópia da lista contendo os nós HTML.**/
		valueOf: {value: function() {return this._data.value.slice();}},
		/**. '{self forEach(function' callback)}: Executa looping nos nós HTML. A função definida em '{callback} receberá como argumentos um nó, o seu índice e uma b{cópia} da lista de nós. Se a função retornar falso, o looping é interrompido.**/
		forEach: {
			value: function(run) {
				if (__Type(run).function) {
					const nodes = this.valueOf();
					for (let i = 0; i < nodes.length; i++)
						if (run(nodes[i], i, nodes) === false) break;
				}
				return this;
			}
		},
		//FIXME files para que serve isso mesmo?
		/**. '{array files}: Retorna uma lista com os arquivos selecionados nos campos de formulário.**/
		files: {
			get: function() {
				const pack = [];
				for (let i = 0; i < this._main.length; i++) {
					let obj = this._main[i];
					if (obj.ftype === "file")
						for (let j = 0; j < obj.node.files.length; j++)
							pack.push(obj.node.files[j]);
				}
				return pack;
			}
		},
		/**. '{object submit(string method, boolean ignore)}: Retornará o mesmo resultado que o método __DataSet.toSubmit, exceto se o processo for interrompido por alguma restrição no campo de formulário, retornando nulo. Para não verificar restrições, o argumento '{ignore} deverá ser verdadeiro.**/
		submit: {
			value: function(url, method, ignore) {
				ignore = ignore === true;
				const data = new __DataSet();

				for (let i = 0; i < this._main.length; i++) {
					let node   = this._main[i];
					let submit = node.fsubmit;
					if (submit !== null) {
						data.append(submit.name, submit.value);
						if (!ignore && submit.error) {
							node.falert(submit.message);
							node.node.focus();
							return null;
						}
					}
				}
				return data.toSubmit(url, method);
			}
		},
		/**. '{self repeat(array list)}: Repete elementos a partir de um modelo. '{list} é uma lista de objetos cujo valor do atributo substituirá o respectivo valor entre do modelo que será informado em chaves duplas ({{atributo}}).**/
		repeat: {
			value: function(list) {
				for (let i = 0; i < this._main.length; i++)
					this._main[i].repeat(list);
				return this;
			}
		},
		/**. '{self set(object data)}: Atribui aos elementos o valor dos atributos especificados em '{data} (ver __Node.atrribute).**/
		set: {
			value: function(data) {
				if (__Type(data).object)
					for (let i = 0; i < this._main.length; i++)
						for (let attr in data)
							this._main[i].attribute(attr, data[attr]);
				return this;
			}
		},
		/**. '{self display(string act)}: Exibe os elementos conforme especificado:
		|Ação|Descrição|
		|show|Exibe o elemento|
		|hide|Esconde o elemento|
		|toggle|Alterna a exibição do elemento|
		|full|Alterna a exibição do elemento em tela cheia|
		|alone|Exibe o elemento e esconde os nós irmãos|
		|missing|Esconde o elemento e exibe os nós irmãos|
		|all|Exibe o elemento e os nós irmãos|
		|none|Esconde o elemento e os nós irmãos|
		|asc|Ordena os nós filhos em ordem ascendente|
		|desc|Ordena os nós filhos em ordem descendente|
		|sort|Alterna a ordenação dos nós filhos|**/
		display: {
			value: function(act) {
				act = String(act).toLowerCase();
				for (let i = 0; i < this._main.length; i++) {
					if (act === "show" || act === "hide" || act === "toggle")
						this._main[i].show = act === "toggle" ? !this._main[i].show : act === "show";
					else if (act === "alone" || act === "missing")
						this._main[i].only(act === "missing");
					else if (act === "all" || act === "none")
						this.display(act === "all" ? "missing" : "alone").display(act === "all" ? "show" : "hide");
					else if (act === "sort" || act === "asc" || act === "desc")
						this._main[i].sort(act === "sort" ? null : act === "asc");
					else if (act === "full") {
						this._main[i].show = true;
						this._main[i].full();
					}
				}
				return this;
			}
		},
		/**. '{self slice(integer init, integer last)}: Fatia os elementos filhos Exibe os elementos, exceto se '{visible} for falso.**/
		slice: {
			value: function(init, last) {
				for (let i = 0; i < this._main.length; i++)
					this._main[i].slice(init, last);
				return this;
			}
		},







		/**. '{self display(string action)}: Organiza a exibição dos elementos filhos conforme argumento '{action}. Quanto ao elemento:
		|Ação|Descrição|
		. Quanto à organização dos filhos:
		|Valor|Descrição|
		|+N|exibe o filho avançando N posições do elemento atual (ciclo infinito)|
		|-N|exibe o filho retrocedendo N posições do elemento atual (ciclo infinito)|
		|N-M|intervalo de filhos a exibir, índices inicial e final|
		|N:D|organiza os filhos por grupos de D elementos, onde N representa o índice do grupo|
		|+N:D|avança N grupos de filhos organizados em grupos de D elementos|
		|-N:D|retrocede N grupos de filhos organizados em grupos de D elementos|
		. Quanto aos netos:
		|Valor|Descrição|
		|[+N&verbar;-M&verbar;...]|ordena os filhos com base no valor dos netos na ordem especificada e conforme sinais (positivos ascendentes, negativos descendentes).|
		. Onde N e M são números inteiros e D pode ser inteiro ou decimal. Para representar o último índice, utilizar o caractere asterisco.**/
		display2: {
			value: function(action) {
				action = String(action).replace(/\s+/g, "").toLowerCase();
				for (let i = 0; i < this._main.length; i++) {
					let node = this._main[i];
					/*-- avanço/retrocesso de filhos --*/
					if ((/^[+-]?\d+$/).test(action)) {
						node.walk(action);
					}
					/*-- intervalo de filhos --*/
					else if ((/^(\+?\d+|\*)\-(\+?\d+|\*)$/).test(action)) {
						const val = action.split("-");
						node.slice(val[0] === "*" ? -1 : val[0], val[1] === "*" ? -1 : val[1]);
					}
					/*-- agrupamento de nós --*/
					else if ((/^([+-]?\d+|\*)\:(\d+|0?\.\d+)$/).test(action)) {
						const val   = action.split(":");
						const walk  = (/^[+-]\d+/).test(action);
						const index = Number(val[0] === "*" ? -1 : val[0]) * (walk ? Infinity : 1);
						const width = Number(val[1]);
						node.pages(index, width);
					}
					/*-- ordenamento de colunas --*/
					else if ((/^\[[+-]?\d+((\|[+-]?\d+)+)?\]$/).test(action)) {
						const val = action.replace(/^\[(.+)\]$/, "$1").split("|");
						for (let j = 0; j < val.length; j++)
							val[j]  = (val[j][0] === "-" ? -1 : +1) + Number(val[j]);
						node.tsort.apply(node, val);
					}

				}
				return this;
			}
		},




		/**. '{self filter(any search, integer width)}: Exibe somente os elementos filhos que contenham o conteúdo de '{search} (ver __Node.filter)**/
		filter: {
			value: function(search, width) {
				for (let i = 0; i < this._main.length; i++)
					this._main[i].filter(search, width);
				return this;
			}
		},
		/**. '{self jump(node spaces)}: Alterna a posição dos nós entre os elementos informados em '{spaces} (ver __Node.jump)**/
		jump: {
			value: function(spaces) {
				if (__Type(spaces).node)
					for (let i = 0; i < this._main.length; i++)
						this._main[i].jump(spaces);
				return this;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 WDmatrix
	''constructor object WDmatrix(any  input)''
	Cópia do construtor __Table**/
	function WDmatrix(input) {__Table.call(this, input);}
	WDmatrix.prototype = Object.create(__Table.prototype, {constructor: {value: WDmatrix}});

/*----------------------------------------------------------------------------*/
	/**#4 Função Mestre
	''	object WD(any input)''
	Função principal, única de acesso ao usuário, com o objetivo de chamar os construtores correspondentes ao valor informado no argumento '{input}.**/
	function WD(input) {
		let data = __Type(input);
		switch(data.type) {
			case "number":   return new WDnumber(input, data);
			case "array":    return new WDarray(input, data);
			case "date":     return new WDdate(input, data);
			case "time":     return new WDtime(input, data);
			case "datetime": return new WDdatetime(input, data);
			case "node":     return new WDnode(input, data);
			case "string":   return new WDstring(input, data);
			case "object":   return new WDobject(input, data);
		}
		return new WDmain(input, data);
	}
	/**#5 Métodos e Atributos Estáticos**/
	WD.constructor = WD;
	Object.defineProperties(WD, {
		/**. '{string version}: Retorna a versão da biblioteca.**/
		version: {value: __VERSION},
		/**. '{string device}: Retorna o tipo de tela de acordo com a biblioteca.**/
		device:  {get: function() {return __DEVICE.device;}},
		/**. '{object now}: Retorna a instância do objeto do tipo tempo com o valor atual.**/
		now: {get: function() {return WD(new __DateTime().toTimeString());}},
		/**. '{object today}: Retorna a instância do objeto do tipo data com o valor atual.**/
		today: {get: function() {return WD(new __DateTime().toDateString());}},
		/**. '{object already}: Retorna a instância do objeto do tipo data/tempo com o valor atual.**/
		already: {get: function() {return WD(__DateTime().toString());}},
		/**. '{string lang}: Define ou retorna a lista de linguagem em ordem de preferência da biblioteca.**/
		lang: {
			get: function()  {return __LANG.user;},
			set: function(x) {__LANG.user = x;}
		},
		/**. '{object $(string css, node root)}: Retorna um objeto do tipo nó conforme seletor i{css} individual. O argumento opcional i{root} é o elemento pai a ser consultado cujo valor padrão é i{document}.**/
		$: {value: function(css, root) {return WD(__Query(css, root).$);}},
		/**. '{object $$(string css, node root)}: Retorna um objeto do tipo nó conforme seletor i{css} múltiplo. O argumento opcional i{root} é o elemento pai a ser consultado cujo valor padrão é i{document}.**/
		$$: {value: function(css, root) {return WD(__Query(css, root).$$);}},
		/**. '{void signal(object options)}: Produz uma interação (ver i{__SIGNAL.signal}).**/
		signal:  {value: function(options) {return __SIGNAL.signal(options);}},
		/**. '{object matrix(any input)}: Retorna um objeto do tipo matriz conforme '{input} (table, array, csv)**/
		matrix:  {value: function(input) {return new WDmatrix(input);}},







		copy: {value: function(text)  {return wd_copy(text);}}, //FIXME como fica copy?






		/**. '{object datetime(any input)}: Retorna um objeto WD de data/tempo a partir dos valores:
		|input|Descrição|
		|Padrão|O valor atual de data/tempo|
		|Tempo|O tempo com data definida em 000-01-01|
		|Data|A data com tempo definido em 00:00:00|
		|Data/Tempo|Conforme definido|
		|Número|A quantidade de segundos desde 0000-01-01T00:00:00|
		|Semana|O primeiro dia da semana com tempo definido em 00:00:00|
		|Mês|Primeiro dia do mês com tempo definido em 00:00:00|
		|Objeto|As propriedades definidas alteram o valor atual da data/tempo|**/
		datetime: {value: function(input) {return WD(new __DateTime(input).toString());}},
	});


/*============================================================================*/
/**#3 Atributos HTML dataset**/
/*============================================================================*/

	/**#4 Dispositivo: Design Responsivo
	''function void data_wd_device(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-size|
	|Objetivo|Manipular atributo '{class} conforme tamanho da tela (design responsivo via javascript)|
	|Eventos|load wdreload wddataset resize|
	|Alvos|Elemento|
	|Grupos|Único|
	|Referências|__DEVICE|
	span{ }
	|Propriedades|Tipo|Descrição|
	|desktop|string|Estilos CSS aplicados à tela desktop.|
	|tablet|string|Estilos aplicados à tela tablet.|
	|phone|string|Estilos aplicados à tela phone.|
	|mobile|string|Estilos aplicados à tela tablet ou phone.|
	Observações:
	- Não há propriedade obrigatória; e
	- O estilos CSS devem estar separados por espaços em branco.**/
	function data_wd_device(target, event, wdArray) {
		const query  = WD(target);
		const data   = wdArray[0];
		const device = __DEVICE.device;
		const types  = { /* 0: elimina css, 1: adiciona css */
			desktop: {phone: 0, tablet: 0, mobile: 0, desktop: 1},
			tablet:  {phone: 0, tablet: 1, mobile: 1, desktop: 0},
			phone:   {phone: 1, tablet: 0, mobile: 1, desktop: 0},
		};
		if (device in types) {
			let type = types[device];
			/* 1) removendo css dos dispositivos incompatíveis */
			for (let i in type)
				if (i in data && type[i] === 0) query.set({class: {remove: data[i]}});
			/* 2) adicionando css dos dispositivos compatíveis */
			for (let i in type)
				if (i in data && type[i] === 1) query.set({class: {add: data[i]}});
		}
		return;
	};


/*----------------------------------------------------------------------------*/
	/**#4 Requisições
	''function void data_wd_send(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-send|
	|Objetivo|Efetuar requisições web|
	|Eventos|click|
	|Alvos|Conforme especificado|
	|Grupos|Múltiplo|
	|Referências|__Request.send, __Node.submit|
	span{ }
	|Propriedades|Tipo|Descrição|
	|query|string|Seletor CSS dos campos de formulário a serem enviados|
	|noValidate|boolean|Se verdadeiro, a requisição não fará a validação primária dos campos.|
	|trigger|function|Nome do disparador a ser chamado durante a requisição.|
	Observações:
	- Demais propriedades seguem a definição de __Request.send, exceto i{body}, que será definido por '{query}; e
	- O disparador deve estar contido no escopo de '{window} utilizando-se de '{var} ou '{function}.**/
	function data_wd_send(target, event, wdArray) {
		let test, data, query, submit, trigger, head;
		for (let i = 0; i < wdArray.length; i++) {
			data    = wdArray[i];
			test    = new __Type(data.query);
			query   = test.node ? data.query : document.body;
			trigger = data.trigger;
			submit  = WD(query).submit(data.url, data.method, data.noValidate);
			/*-- cabeçalho --*/
			data.headers = new __DataSet(data.headers);
			/*-- Efetuar requisição se não encontrados erros --*/
			if (submit !== null) {
				data.url  = submit.url;
				data.body = submit.body;
				if (!data.headers.has("content-type"))
					data.headers.set("content-type", submit.ctype);
				WD(data).send(trigger);
			}
		}
		return;
	}

/*----------------------------------------------------------------------------*/
	/**#4 Requisições: formulários
	''function void data_wd_submit(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-submit|
	|Objetivo|Efetuar requisições assícronas por submissão de formulário|
	|Eventos|submit|
	|Alvos|Campos do elemento formulário|
	|Grupos|Único|
	|Referências|__Request.send, __Node.submit|
	Mecanismo semelhante à função '{data_wd_send} com as seguintes observações:
	- A propriedade query não se aplica, o conteúdo de i{body} é definido pelos campos vinculados ao formulário;
	- A propriedade i{url} é definida pelo atributo i{action} do formulário;
	- A propriedade i{method} é definida pelo atributo i{method} do formulário;
	- A propriedade i{noValidate} é definida pelo atributo i{noValidate} do formulário; e
	- A propriedade i{content-type} em i{headers} é definida pelo atributo i{enctype} do formulário.**/
	function data_wd_submit(target, event, wdArray) {
		const data  = wdArray[0];
		const form  = target;
		const query = form.elements;
		const html  = {method: null,	enctype: null, action: null, noValidate: null};
		const enter = (function(){
			const elem = document.activeElement;
			const test = new __Type(elem);
			const node = new __Node(test.node ? elem : form);
			const type = /^(image|submit)$/;
			return elem.form !== form || !type.test(node.ftype) ? null : elem;
		})();
		/*-- cabeçalho --*/
			data.headers = new __DataSet(data.headers);
		/*-- Informações do formulário: button ou form --*/
		for (let i in html) {
			/*-- 1) procurar atributo no elemento acionador --*/
			if (enter !== null) {
				const camel = "form"+(i.replace(i[0], i[0].toUpperCase()));
				const lower = camel.toLowerCase();
				const value = enter.hasAttribute(lower) ? enter[camel].trim() : "";
				html[i] = value !== "" ? value : null;
			}
			/*-- 2) se não localizado, buscar no formulário --*/
			if (html[i] === null) {
				const valid = !__Type(form[i]).node;
				const value = form.hasAttribute(i) ? form.getAttribute(i).trim() : "";
				html[i] = valid ? form[i] : (value !== "" ? value : null);
			}
		}
		/*-- Redefinindo atributos de configuração para envio à data_wd_send --*/
		if (html.method     !== null) data.method = html.method;
		if (html.action     !== null) data.url = html.action;
		if (html.enctype    !== null) data.headers.set("content-type", html.enctype);
		if (html.noValidate !== null) data.noValidate = html.noValidate;
		data.query = query;
		return data_wd_send(target, event, [data]);
	}

/*----------------------------------------------------------------------------*/
	/**#4 Carregamentos
	''function void data_wd_load(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-load|
	|Objetivo|Carregar conteúdos externos ao documento|
	|Eventos|load wdreload wddataset|
	|Alvos|Elemento|
	|Grupos|Único|
	|Referências|__Node.innerHTML/outerHTML/attribute|
	Possui as mesmas propriedades de i{data_wd_send}, exceto i{trigger} e i{type}, acrescida da seguinte propriedade:
	|Propriedades|Tipo|Descrição|
	|serialization|string|Comportamento da serialização outer/innerHTML/Text (__Node.attribute)|
	span{ }
	Observações:
	- Se o arquivo for CSV e a propriedade for inner/outerHTML, uma tabela com dados será adicionada ao documento;
	- O mesmo comportamento anterior ocorrerá caso o arquivo seja JSON com uma matriz (array de duas dimensões) de dados;
	- Em caso de innerText em elemento de formulário sem conteúdo textual, a propriedade modificada será a '{value}.**/
	function data_wd_load(target, event, wdArray) {
		const data   = wdArray[0];
		const node   = new __Node(target);
		data.type    = "text";
		data.trigger = function(x) {
			if (x.ok) {
				const mime = __MIME[x.contentType];
				const find = /^(inner|outer)(HTML|Text)$/;
				const attr = find.test(data.serialization) ? data.serialization : "innerHTML";
				const html = (/HTML$/).test(attr);
				let   text = x.response;
				if (html) {
					const parser = new __Parser(text);
					let test;
					if (mime === "html") {
						test = parser.stringHTML.get();
						text = test === null ? text : test.body.innerHTML;
					}
					else if (mime === "csv") {
						test = parser.csvTable.get();
						text = test === null ? text : test.outerHTML;
					}
					else if (mime === "json") {
						test = parser.stringJSON.matrixCSV.csvTable.get();
						text = test === null ? text : test.outerHTML;
					}
				}
				/*-- definir --*/
				if (attr === "innerText" && node.form && !node.ftext)
					node.attribute("value", text);
				else
					node.attribute(attr, text);
			}
		}
		return data_wd_send(target, event, [data]);
	}

/*----------------------------------------------------------------------------*/
	/**#4 Repetições
	''function void data_wd_repeat(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-repeat|
	|Objetivo|Replicar cópias de elementos os filhos com conteúdo configurável a partir de um arquivo externo.|
	|Eventos|load wdreload wddataset|
	|Alvos|Elemento|
	|Grupos|Único|
	|Referências|__Node.repeat|
	Possui as mesmas propriedades de i{data_wd_send}, exceto i{trigger} e i{type}.
	Os arquivos permitidos devem estar em formato CSV ou JSON (array de objetos);	**/
	function data_wd_repeat(target, event, wdArray) {
		const data   = wdArray[0];
		data.type    = "text";
		data.trigger = function(x) {
			if (x.ok)  {
				const mime = __MIME[x.contentType];
				let   list = null;
				if (mime === "json" || mime === "csv") {
					const parser = new __Parser(x.response);
					const value  = mime === "json" ? parser.stringJSON : parser.csvTable.tableValues.matrixList;
					list = value.get();
				}
				WD(target).repeat(list === null ? [] : list);
			}
		}
		return data_wd_send(target, event, [data]);
	}

/*----------------------------------------------------------------------------*/
	/**#4 Atribuição de Valores
	''function void data_wd_tools(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-tools|
	|Objetivo|Define ações aos elementos definidos por meio dos métodos de WDnode.|
	|Eventos|click|
	|Alvos|Elementos que possar receber cliques|
	|Grupos|Múltiplos|
	|Referências|__Node|
	span{ }
	Observações:
	- as ações serão aplicadas aos elementos definidos pela propriedade '{query} (seletor CSS de elementos);
	- se '{query} estiver ausente no grupo, terá como valor o próprio elemento; e
	- os argumentos dos métodos devem ser informados em arrays.**/
	function data_wd_tools(target, event, wdArray) {
		/*-- looping sobre os grupos --*/
		wdArray.forEach(function(group,i,a) {
			const test  = new __Type(group.query);
			const query = test.node ? group.query : target;
			const tools = WD(query);
			console.log({query: query, type: tools.type})
			/*-- looping pelos métodos --*/
			for (let method in group) {
				let check1 = new __Type(tools[method]);
				let check2 = new __Type(group[method]);
				if (check1.function && check2.array)
					tools[method].apply(tools, group[method]);
			}
		});
		return;
	};

/*----------------------------------------------------------------------------*/
	/**#4 Gráficos 2D
	''function void data_wd_chart(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-chart|
	|Objetivo|Cria um gráfico 2D a partir de comandos e dados em arquivos ou elementos.|
	|Eventos|load wdreload wddataset|
	|Alvos|Elementos que possar receber filhos renderizáveis|
	|Grupos|Único|
	|Referências|__Table.plot|
	Observações:
	- As propriedades do atributo têm a mesma estrutura do argumento do método __Table.plot;
	- O gráfico gerado substituirá o conteúdo do alvo;
	- A fonte de dados (opcional), é especificada por meio da propriedade '{source};
	- '{source} pode ser um elemento HTML (nó) ou o caminho (string) para um arquivo CSV ou JSON (array de duas dimensões);
	- No caso de fonte externa, as propriedades de i{data_wd_send}, exceto i{trigger} e i{type}, são aceitas;
	- O elemento poderá ser uma tabela, um campo de formulário ou elemento com conteúdo textual;
	- No caso de formulário ou conteúdo textual, o formato do conteúdo deverá ser em CSV.**/
	function data_wd_chart(target, event, wdArray) {
		const data = wdArray[0];
		const test = new __Type(data.source);
		const plot = function (input) {
			const table = new __Table(input);
			const svg   = table.plot(data);
			if (svg !== null) {
				target.innerHTML = "";
				target.appendChild(svg);
			}
		}
		/*-- elemento HTML como fonte de dados --*/
		if (test.node && test.value.length > 0) {
			const elem  = test.value[0];
			const node  = new __Node(elem);
			const form  = node.form && !node.ftext;
			const input = form ? elem.value : (node.tag === "table" ? elem : elem.textContent);
			plot(input);
		}
		/*-- arquivo CSV/JSON como fonte de dados --*/
		else if (test.nonempty) {
			data.url     = data.source;
			data.type    = "table";
			data.trigger = function(x) {
				if (x.done)
					plot(x.ok && x.response !== null ? x.response : undefined);
			};
			data_wd_send(target, event, [data]);
		}
		/*-- sem fonte de dados --*/
		else {
			plot();
		}
		return;
	}

/*----------------------------------------------------------------------------*/
	/**#4 Auto Clique
	''function void data_wd_click(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-click|
	|Objetivo|Promover eventos de clicagem ao elemento|
	|Eventos|load wdreload wddataset|
	|Alvos|Elementos que possam receber click|
	|Grupos|Único|
	|Referências|-|
	span{ }
	|Propriedades|Tipo|Descrição|
	|time|integer|Intervalos de tempo, em milissegundos, entre cliques (opcional)|
	|times|integer|Quantidade de vezes a repetir (opcional)|
	Observações:
	- Se '{time} for informado e '{times} não, a repetição ocorrerá indefinidamente;
	- Se '{times} for informado e '{time} não, a repetição ocorrerá sem intervalo de tempo;
	- Se nem '{time} e nem '{times} for informado, apenas um clique será executado;**/
	function data_wd_click(target, event, wdArray) {
		const data = wdArray[0];
		/*-- não há atributo: apagar identificador da interação --*/
		if (!("wdClick" in target.dataset)) {
			delete target.dataset.wdClickId;
		}
		/*-- primeira interação: executar clique e preparar repetições (com ou sem intervalo) --*/
		else if (event !== data) {
			const test = {time: new __Type(data.time), times: new __Type(data.times)};
			data.time  = test.time.integer  && test.time  > 0 ? test.time.value  : 0;
			data.times = test.times.integer && test.times > 0 ? test.times.value : 0;
			data.id    = String(new Date().valueOf());
			/*-- executar clique principal --*/
			target.click();
			/*-- repetir sem intervalo de tempo --*/
			if (data.time === 0) {
				while (--data.times > 0)
					target.click();
				delete target.dataset.wdClick;
			}
			/*-- repetir com intervalo de tempo --*/
			else {
				data.times = data.times === 0 ? Infinity : data.times;
				target.wdClickId = data.id;
				window.setTimeout(function() {
					data_wd_click(target, data, [data]);
				}, data.time);
			}
		}
		/*-- segunda interação: id válido --*/
		else if (data.id === target.wdClickId) {
			/*-- com repetições pendentes --*/
			if (--data.times > 0) {
				target.click();
				window.setTimeout(function() {
					data_wd_click(target, data, [data]);
				}, data.time);
			}
			/*-- sem repetições pendentes --*/
			else {
				delete target.wdClickId;
				delete target.dataset.wdClick;
			}
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	/**#4 Filtro Textual
	''function void data_wd_filter(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-filter|
	|Objetivo|Filtrar elementos de acordo com seu conteúdo textual|
	|Eventos|load wdreload wddataset input|
	|Alvos|Elementos que possam receber digitação|
	|Grupos|Único|
	|Referências|__Node.filter|
	span{ }
	|Propriedades|Tipo|Descrição|
	|query|string|Seletor CSS que define os elementos que terão seus filhos filtrados|
	|size|integer|Mesmo propósito do argumento de __Node.filter (opcional)|**/
	function data_wd_filter(target, event, wdArray) {
		const data   = wdArray[0];
		const query  = WD(data.query);
		const size   = data.size;
		const node   = new __Node(target);
		const regexp = /^\/(.+)\/([gim]+)?$/;
		const value  = target[node.form && !node.ftext ? "value" : "innerText"];
		const search = !regexp.test(value) ? value : (function() {
			const arg1 = value.replace(regexp, "$1");
			const arg2 = value.replace(regexp, "$2");
			return new RegExp(arg1, arg2);
		})();
		if (query.type === "node")
			query.filter(search, size);
		return;
	};

/*----------------------------------------------------------------------------*/
	/**#4 Filtro Textual FIXME continuar a partir daqui a arrumar a descrição e trocar $$ por propriedade
	''function void data_wd_tabs(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-filter|
	|Objetivo|Filtrar elementos de acordo com seu conteúdo textual|
	|Eventos|load wdreload wddataset input|
	|Alvos|Elementos que possam receber digitação|
	|Grupos|Único|
	|Referências|__Node.filter|
	span{ }
	|Propriedades|Tipo|Descrição|
	|$ ou $$|node|Seletor CSS que define os elementos que terão seus filhos filtrados|
	|size|integer|Mesmo propósito do argumento de __Node.filter (opcional)|**/

	function data_wd_tabs(target, event, wdArray) {
		//TODO ver __TAB
		return;
	};

/*----------------------------------------------------------------------------*/
	/**''function void data_wd_mask(node target, object event, array wdArray)''
	Função com o propósito de definir máscaras por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-mask|load wdreload wddataset focusout|Único|Múltiplos|__Node.display|Elemento que possa receber conteúdo|
	Possui as seguintes propriedades opcionais:
	|Nome|Tipo|Descrição|
	|model|string|Modelo da máscara|
	|check|function|Função a ser checada se a máscara casar ou não for informada|**/
	function data_wd_mask(target, event, wdArray) {
		const data  = wdArray[0];
		const node  = new __Node(target);
		const model = "model" in data ? String(data.model) : null;
		const check = __Type(data.check).function ? data.check : null;
		const mask  = model === null ? true : node.mask(model);
		if (mask && check !== null)
			node.fvalidity = check(node.form ? node.fvalue : target.textContent);
		return;
	};

/*----------------------------------------------------------------------------*/
	/**''function void data_wd_edit(node target, object event, array wdArray)''
	Função com o propósito de formatar textos em elementos editáveis por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-edit|click|Único|Múltiplos|-|Elementos que possa receber click|
	As propriedades e seus valores são advindas da ferramenta nativa i{execCommand}. TODO melhorar isso**/
	function data_wd_edit(target, event, wdArray) {
		const data = wdArray[0]
		for (let cmd in data) {
			let arg = data[cmd].trim() === "" ? undefined : data[cmd].trim();
			if (cmd === "createLink") {
				arg = prompt("Link:", "https://...");
				if (arg === null || arg.trim() === "") cmd = "unlink";
			}
			else if (cmd === "insertImage") {
				arg = prompt("Link:", "https://...");
			}
			document.execCommand(cmd, false, arg);
		}
		return;
	};







/*----------------------------------------------------------------------------*/
	/**''function void data_wdValue(node  e, object event)''
	Função vinculada ao atributo HTML '{data-wd-value} cujos objetivos são:
	- Aplicar e validar máscara;
	- Validar dados;
	- Renderizar dados; e
	- Obter e definir valores da URL.
	Possui múltiplos atributos e grupo único:
	|Nome|Descrição|
	|mask|Define o modelo da máscara a ser aplicada ao conteúdo.|
	|fail|Texto do erro da máscara.|
	|$$ ou $|Seletores CSS dos elementos de entrada vinculados ao valor de saída (i{output}).|
	|valid|Nome da função, definida no escopo de i{windows} com i{var} ou i{function}, para validar o valor.|
	|output|Nome da função, definida no escopo de i{windows} com i{var} ou i{function}, para definir o valor de saída.|
	A função i{output} será chamada quando os elementos de entrada dispararem um evento i{input}. Ela também será chamada ao carregar conteúdo ou definir o atributo. A função receberá o elemento e deverá retornar o seu valor.
	A aplicação da máscara será avalida nos carregamento de conteúdo, definição de atributo e quando o elemento perder o foco. Será chamada também no evento i{input} se i{output} for chamada. Se o conteúdo não casar com a máscara, o nó assumirá como mensagem de erro o valor de '{fail} ou o modelo da máscara.
	A função i{valid} será chamada nos carregamento de conteúdo e definição de atributo. A função receberá o elemento e deverá retornar o valor da mensagem de erro ou uma string em branco se não houver. No evento i{input}, i{valid} só será executada se i{output} tiver sido chamada.**/
	function data_wd_output(target, event, wdArray) {
		const nodes = WD.$$("[data-wd-output]");
		nodes.forEach(function(output,i) {
			const parser  = new __Parser(output.dataset.wdOutput);
			const wdarray = parser.wdArray.get();
			if (wdarray !== null) {
				const input = target;
				const data  = wdarray[0];
				const query = data.$$ || data.$ || null;
				const call  = __Type(data.call).function ? data.call : null;
				const list  = new __Type(query).value;
				if (query === null || call === null || list.indexOf(target) < 0) return;
				if ("$"  in data) delete data["$"];
				if ("$$" in data) delete data["$$"];
				delete data["call"];
				call(input, output, data)
			}
		});
		return;
	};


























/*----------------------------------------------------------------------------*/
	/**''function void data_wd_code(node target, object event, array wdArray)''
	Função com o propósito de definir exibições de codificação por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-code|load wdreload input|Múltiplas|Único|__Code|Elemento que possa receber texto de codificação.|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|word|string|Palavras reservadas da codificação|
	|value|string|Valores específicos da codificação|
	|string|string|Caracteres de abertura e fechamento de string|
	|comment|string|Caracteres de abertura e fechamento de comentários|
	|editable|boolean|Informa se o container poderá ser editado|
	|lines|boolean|Informa se as linhas serão numeradas|**/
	function data_wd_code(target, event, wdArray) {
		const data = wdArray[0];
		const node = new __Node(target);
		const text = node.form ? target.value : target.innerText.replace(/\s$/, "");
		const edit = data.editable !== true;
		const line = data.lines !== false;
		const code = new __Code(text);
		const tags = {code: "DIV", mask: "DIV", text: "TEXTAREA"};
		const name = ["value", "comment", "word", "string"];
		/*-- configurando código --*/
		for (let i = 0; i < name.length; i++) {
			if (name[i] in data)
				code.add(name[i], String(data[name[i]]));
		}
		/*-- construindo container e definindo propriedades --*/
		for (let i in tags) {
			tags[i] = document.createElement(tags[i]);
			tags[i].dataset.wdEncoding = i;
			tags[i].spellcheck = false;
			tags[i].translate  = false;
			if (i === "text") {
				tags[i].value    = text;
				tags[i].readOnly = edit;
				tags[i].id       = target.id;
			}
		}
		/*-- definindo disparador --*/
		tags.text.oninput  = function(ev) {
			code.input = tags.text.value;
			if (line) {
				const number = new __Number(code.input.split("\n").length);
				tags.code.dataset.wdEncodingLines = number.exp;
			}
			tags.mask.innerHTML = code.valueOf();
		};
		/*-- montando blocos e executando --*/
		tags.code.appendChild(tags.mask);
		tags.code.appendChild(tags.text);
		target.parentElement.replaceChild(tags.code, target);
		tags.text.oninput();
		return;
	};








/*----------------------------------------------------------------------------*/
	/**''function void data_wd_move(node target, object event, array wdArray)''
	Função com o propósito de mover o elemento por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-move|mousedown mousemove e mouseup|Único|Único|-|Elementos que possam ser movidos|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|$|node|Seletor CSS que define a o elemento a ser movido|
	O atributo i{data-wd-move} deve ficar sobre o elemento âncora e a propriedade i{$} especificará o elemento que será movido. Para um movimento padrão, a âncora deve ser um filho do elemento a se mover, se não definido, será o próprio elemento. Elementos com posicionamento i{static} e i{sticky} não serão movimentados.**/
	function data_wd_move(target, event, wdArray) {
		const data = wdArray[0];
		//FIXME aplicar __MOVE e estabelecer as teclas para acionar
		return;
	}

/*----------------------------------------------------------------------------*/
	/**''function void data_wd_drag(node target, object event, array wdArray)''
	Função com o propósito de arrastar elementos por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-drag|mousemove, dragstart e dragend|Múltipla|Múltiplos|-|Nós de elementos que possam ser arrastados|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|effect|string|(obrigatório) Efeito do arrasto: move, copy ou link|
	|drop|function|Função a ser executada ao derrubar o elemento|
	|$ ou $$|String|(obrigatório) Seletores CSS que identifica os elementos receptores do arrasto para o efeito especificado|
	Se o elemento arrastável tiver múltiplos efeitos, cada efeito deverá ser informado em um grupo diferente cuidando para que não haja concomitâncias de elementos receptores entre os grupos (o efeito do último grupo prevalecerá).
	A função '{drop} receberá como argumentos o elemento drop, o elemento drag e o efeito aplicado. Se nenhum função for especificada, um comportamento padrão será executado de acordo com o efeito definido.
	O elemento receptor não pode ser o elemento pai e nem o elemento arrastável ou estar contido nele.**/
	function data_wd_drag(target, event, wdArray) {
		const data = wdArray;
		return;
	}

/*----------------------------------------------------------------------------*/
	/**''function void data_wd_drop(node target, object event, array wdArray)''
	Função com o propósito de definir o comportamento do elemento ao receber arquivos arrastáveis por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-drop|dragover, dragleave e drop|Único|Múltiplos|-|Nós que podem receber informações de arquivos.|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|drop|function|Função a ser chamada ao derrubar os arquivos|
	A função i{drop} receberá como argumentos o elemento drop e os arquivos arrastáveis (FileList) e, se não informada, uma ação padrão será realizada. Nessa ação padrão, tentar-se-á carregar o arquivo na página (o primeiro arquivo de tamanho até 1000000 Bytes apenas).**/
	function data_wd_drop(target, event, wdArray) {}
/*----------------------------------------------------------------------------*/
	/**''function void data_wdTsort(node  e, object event)''
	Função vinculada ao atributo HTML '{data-wd-tsort} cujo objetivo é ordenar colunas específicas de tabelas. Não possui atributo.**/
	function data_wdTsort(e, event) {
		if (!("wdTsort" in e.dataset)) return;
		try {
			let thead = e.parentElement.parentElement;
			if (thead.tagName.toLowerCase() !== "thead") return;
			let tbody = thead.parentElement.tBodies;
			let heads = __Type(e.parentElement.children).value;
			let index = heads.indexOf(e);
			let data  = __String("").wdValue(e.dataset.wdTsort);
			let sort  = data === 1 ? -1 : 1;
			WD(tbody).display("["+(sort * (index + 1))+"]");
			heads.forEach(function(v,i,a) {
				if ("wdTsort" in v.dataset)
					v.dataset.wdTsort = v === e ? (sort > 0 ? "+1" : "-1") : "";
			});
		} catch(e) {}
		return;
	};




/*----------------------------------------------------------------------------*/
	function data_wdShared(e, event) { /* FIXME pendente Experimental: compartilhar em redes sociais: data-wd-shared=rede */
		if (!("wdShared" in e.dataset)) return;
		let url    = encodeURIComponent(document.URL);
		let title  = encodeURIComponent(document.title);
		let social = e.dataset.wdShared.trim().toLowerCase();
		let link   = {
			/* https://developers.facebook.com/docs/workplace/sharing/share-dialog/#sharedialogvialink */
			/* https://developers.facebook.com/docs/plugins/share-button/ */
			facebook: "https://www.facebook.com/sharer.php?u="+url,
			/* https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent */
			twitter:  "https://twitter.com/intent/tweet?url="+url+"&text="+title,
			/* https://www.coderstool.com/share-social-link-generator */
			linkedin: "https://www.linkedin.com/shareArticle?url="+url+"&title="+title,
			/* https://www.reddit.com/dev/api#POST_api_submit */
			reddit:   "https://reddit.com/submit?url="+url+"&title="+title,
			/* https://www.coderstool.com/share-social-link-generator */
			evernote: "https://www.evernote.com/clip.action?url="+url+"&title="+title,
			/* https://core.telegram.org/widgets/share */
			telegram: "https://t.me/share/url?url="+url+"&text="+title,
			/* https://faq.whatsapp.com/563219570998715/?locale=en_US */
			whatsapp: "https://wa.me/?text="+url,
		}
		if ("clipboard" in navigator) navigator.clipboard.writeText(document.URL);
		if (social in link) {window.open(link[social]);}

		return;
	};

/*----------------------------------------------------------------------------*/
/**''function void data_wd_float(node target, object event, array wdArray)''
	Função com o propósito de exibir elementos no ponto de clicagem por meio do atributo HTML i{data}.


	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-move|dragstart e dragend|Único|Múltiplos|-|Nós de elementos que possam ser arrastados|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|type|string|Tipo do movimento, que deve ser i{drag}|
	|effect|array|Efeitos do movimento: i{hide, move, copy e link}|**/
	function data_wd_float(target, event, wdArray) {
		console.log(wdArray[0])
		const data  = wdArray[0];
		const query = data.$ || data.$$ || null;
		const check = new __Type(query);
		const float = check.node ? check.value[0] : null;
		if (float !== null) {
			/*-- definindo propriedades e atributos --*/
			document.body.appendChild(float);
			float.tabIndex = -1;
			float.setAttribute("aria-modal", "false");
			float.onkeydown = function(ev) {
				ev.preventDefault();
				const re = /^(Escape|Tab)/i;
				if (re.test(ev.key)) float.style.display = "none";
			}
			/*-- definindo estilos --*/
			const place = target.getBoundingClientRect();
			float.style.position  = "fixed";
			float.style.display   = "block";
			float.style.maxWidth  = "30vw";
			float.style.maxHeight = "75vw";
			if (event.clientY > (window.innerHeight/2))
				float.style.top = (event.clientY - place.height)+"px";
			else
				float.style.top = (event.clientY)+"px";
			if (event.clientX > (window.innerWidth/2))
				float.style.left = (event.clientX - place.width)+"px";
			else
				float.style.left = (event.clientX)+"px";
			/*-- Focando no primeiro elemento focável --*/
			const child = float.querySelectorAll("*");
			for (let i = 0; i < child.length; i++) {
				if (child[i].tabIndex >= 0) {
					child[i].focus();
					break;
				}
			}
		}
		return;
	};

						//FIXME nos atributos dataset de clicar devo colocar tabindex, role e onkeydown?
						//TODO ideia: no evento keydown de enter forçar um click e tá resolvido
						//TODO ideia: no load e set definir tabindex se o atributo for de clique



/*============================================================================*/
/* -- DISPARADORES -- */
/*============================================================================*/
	/**''const object __EVENTS''
	Registra os eventos da biblioteca e seus disparadores.
	O primeiro nível de dados diz respeito ao nome do evento cujo valor é um objeto.
	O segundo nível de propriedades possui as seguintes características:
	|Nome|Tipo|Descrição|
	|target|object|É o alvo genérico (bubble) do disparador (window, document)|
	|preventDefault|boolean|Define se evoca o método preventDefault dp evento|
	|data|Array|Lista de objetos contendo a configuração de cada evento|
	|extra|string|Define uma especifidade a ser verificada para o evento (opcional)|
	Os itens da lista definida em '{data} possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|name|string ou nulo|Define o seletor CSS, se existir, vinculado ao disparador|
	|kill|boolean|Define se o atributo dataset será excluído após chamar o disparador|
	|bind|object|Propriedades obrigatórias do dataset que serão definidas caso não tenham sido|
	|call|function|nome do disparador|
	|extra|string|Define uma especifidade a ser verificada para o método (opcional)|
	Quanto aos tipo de seletores, tem-se:
	|Tipo|Exemplo|Comportamento|
	|atributo data|[data-wd-nome]|Aplica-se ao elementos descendentes do alvo|
	|atributo data|*[data-wd-nome]|Aplica-se ao elementos descendentes do documento|
	|propriedade dataset|wdNome|Aplica-se ao elemento titular da propriedade|
	|Seletor CSS|*|Aplica-se aos elementos identificados pelo seletor definido|
	|null|null|Aplica-se ao alvo específico|
	Regras específicas:
	- Se a propriedade '{target} for definida como window, document será considerado como alvo;
	- Os eventos só ocorrem para elementos HTML (tipo 1) ou document (tipo 9);
	- O valor dos tipos "atributo data" e "propriedade dataset" precisa estar no formato wdArray obrigatoriamente;
	- As propriedades '{bind} e '{kill} se aplicam apenas aos tipos "atributo data" e "propriedade dataset";
	- O disparador '{call} receberá como argumentos o alvo, os dados do evento e uma lista wdArray; e
	- A lista wdArray será nula nos casos de tipos diferentes de "atributo data" e "propriedade dataset".**/
	//FIXME quando o evento de clique receber um enter, forçar um click
	//FIXME implantar extra para cada disparador
	const __EVENTS = {
		wdreload: {
			target: window, preventDefault: false,
			data: [
				{name: "[data-wd-repeat]", call: data_wd_repeat,  kill: true,  bind: {headers: {}}},
				{name: "[data-wd-load]",   call: data_wd_load,    kill: true,  bind: {headers: {}}},
				{name: "[data-wd-chart]",  call: data_wd_chart,   kill: true,  bind: {}},
				{name: "[data-wd-code]",   call: data_wd_code,    kill: true,  bind: {}},
				{name: "[data-wd-click]",  call: data_wd_click,   kill: false, bind: {}},
				{name: "[data-wd-filter]", call: data_wd_filter,  kill: false, bind: {}},
				{name: "[data-wd-mask]",   call: data_wd_mask,    kill: false, bind: {}},
				{name: "[data-wd-device]", call: data_wd_device,  kill: false, bind: {}},
				{name: "[data-wd-tabs]",   call: data_wd_tabs, kill: true,  bind: {}},
			]
		},
		wddataset: {
			target: document, preventDefault: false, extra: "wddatasetList",
			data: [
				{name: "wdRepeat", call: data_wd_repeat, kill: true,  bind: {headers: {}}},
				{name: "wdLoad",   call: data_wd_load,   kill: true,  bind: {headers: {}}},
				{name: "wdChart",  call: data_wd_chart,  kill: true,  bind: {}},
				{name: "wdCode",   call: data_wd_code,   kill: true,  bind: {}},
				{name: "wdClick",  call: data_wd_click,  kill: false, bind: {id: null}},
				{name: "wdFilter", call: data_wd_filter, kill: false, bind: {}},
				{name: "wdMask",   call: data_wd_mask,   kill: false, bind: {}},
				{name: "wdDevice", call: data_wd_device, kill: false, bind: {}},
				{name: "wdTabs",   call: data_wd_tabs,   kill: true,  bind: {}},
			]
		},
		submit: {
			target: document, preventDefault: true,
			data: [
				{name: "wdSubmit", call: data_wd_submit, kill: false, bind: {headers: {}}}
			]
		},
		//FIXME verificar o impacto de preventDefault nos disparadores de clique (testar todos)
		click: {
			target: document, preventDefault: false, extra: "leftClick",
			data: [
				{name: "wdSend",    call: data_wd_send,    kill: false, bind: {headers: {}}},
				{name: "wdTools",   call: data_wd_tools,   kill: false, bind: {}},
				{name: "wdEdit",    call: data_wd_edit,    kill: false, bind: {}},
			]
		},
		input: {
			target: document, preventDefault: false, extra: "checkTypingTime",
			data: [
				{name: "wdFilter", call: data_wd_filter, kill: false, bind: {id: null}},
				{name: null,       call: data_wd_output, kill: false, bind: {}}
			]
		},
		focusout: {
			target: document, preventDefault: false,
			data: [
				{name: "wdMask", call: data_wd_mask,   kill: false, bind: {}},
				//{name: null,      call: data_wd_output, kill: false, bind: {}}
			]
		},
		focusin: {
			target: document, preventDefault: false,
			data: [
				//{name: null, call: wdOnFocusIn, kill: false, bind: {}}
			]
		},
		drag: {
			target: document, preventDefault: false,
			data: []
		},
		dragstart: {
			target: document, preventDefault: false,
			data: [
				//{name: "wdDrag", call: data_wd_drag, kill: false, bind: {}}
			]
		},
		dragend: {
			target: document, preventDefault: false,
			data: [
				//{name: "wdDrag", call: data_wd_drag, kill: false, bind: {}}
			]
		},
		dragleave: {
			target: document, preventDefault: true,
			data: [
				//{name: "html", call: data_wd_drop, kill: false, bind: {}}
			]
		},
		dragover: {
			target: document, preventDefault: true,
			data: [
				//{name: null, call: data_wd_drop, kill: false, bind: {}}
			]
		},
		dragenter: {
			target: document, preventDefault: true,
			data: []
		},
		drop: {
			target: document, preventDefault: true,
			data: []
		},
		mousedown: {
			target: document, preventDefault: false, extra: "leftClick",
			data: []
		},
		mouseup: {
			target: document, preventDefault: false, extra: "leftClick",
			data: []
		},
		mousemove: {
			target: document, preventDefault: false,
			data: []
		},
		mouseenter: {
			target: document, preventDefault: false,
			data: [
				//{name: "wdDrag", call: data_wd_drag, kill: false, bind: {effect: "all"}}
			]
		},
		mouseleave: {
			target: document, preventDefault: false,
			data: []
		},
		mouseover: {
			target: document, preventDefault: false,
			data: [
				{name: "wdDrag", call: data_wd_drag, kill: false, bind: {}}
			]
		},
		mouseout: {
			target: document, preventDefault: false,
			data: []
		},
		dblclick: {
			target: document, preventDefault: false, extra: "leftClick",
			data: []
		},
		keydown: {
			target: window, preventDefault: false,
			data: [],
		},
	};

	/**''function void eventManager(event)''
	Disparador genérico da biblioteca, administra o conteúdo de __EVENTS.**/
	function eventManager(event) {
		/*-- Checar alvo do evento: elemento (1) ou documento (9) ----------------*/
		const target = event.target === window ? document : event.target;
		if ([1, 9].indexOf(target.nodeType) < 0) return;
		/*-- obtendo dados iniciais --*/
		const config    = __EVENTS[event.type];
		const dataset   = config.data;
		const wddataset = [];
		const trigger   = [];
		const search    = /^\*?\[(data\-wd\-[0-9a-zA-Z\-]+)(\=[^\]]+)?\]$/;//TODO retirar o $ do fim da re?
		const extra     = {
			 /*-- tempo mínimo para digitação encerrar --*/
			 typingTime: function(ev) {
				const body = document.body;
				if (!("wdTypingTime" in ev)) {
					ev.wdTypingTime   = new Date().valueOf();
					body.wdTypingTime = ev.wdTypingTime;
					window.setTimeout(function() {eventManager(ev);}, 500);
					return false;
				}
				if (ev.wdTypingTime === body.wdTypingTime) {
					delete ev.wdTypingTime;
					delete body.wdTypingTime;
					return true;
				}
				return false;
			},
			/*-- clique com o botão esquerdo do mouse --*/
			leftClick: function(ev) {
				return event.which === 1;
			},
			/*-- capturar as propriedades definidas em dataset (wddataset = variável global) --*/
			wddatasetList: function(ev) {
				if (ev.target.nodeType === 1 && "wddataset" in ev.target.dataset) {
					const list = ev.target.dataset.wddataset.split(" ");
					list.forEach(function(v,i,a) {wddataset.push(v);});
					delete ev.target.dataset.wddataset;
				}
				return true;
			},
		};

		/*-- checar especifidades de cada evento ---------------------------------*/
		if ("extra" in config && config.extra in extra)
			if (!extra[config.extra](event)) return;

		/*-- Lista de disparadores: elementos qua casam com o parâmetro ----------*/
		let map, root, name, query;
		for (let i = 0; i < dataset.length; i++) {
			map = dataset[i];
			/*-- Elementos descendentes com atributo HTML data: *[data-wd...] (wdArray) --*/
			if (search.test(map.name)) {
				root  = map.name[0] === "*" ? document : target;
				name  = map.name.replace(search, "$1");
				query = WD.$$(map.name, root);
				query.forEach(function(node) {
					trigger.push({
						target:  node,                    /*-- nó alvo --*/
						name:    map.name,                /*-- selector CSS --*/
						call:    map.call,                /*-- função a ser chamada --*/
						bind:    map.bind,                /*-- configurações iniciais do evento --*/
						value:   node.getAttribute(name), /*-- valor do atributo --*/
						wdArray: null,                    /*-- valor de wdArray --*/
					});
					if (map.kill) node.removeAttribute(name);
				});
			}
			/*-- Elementos por nome da propriedade dataset: wdNome (wdArray) --*/
			else if ("dataset" in target && map.name in target.dataset) {
				trigger.push({
					target:  target,
					name:    map.name,
					call:    map.call,
					bind:    map.bind,
					value:   target.dataset[map.name],
					wdArray: null,
				});
				if (map.kill) delete target.dataset[map.name];
			}
			/*-- Busca genérica, independente da propriedade dataset ou atributo HTML data --*/
			else {
				query = typeof map.name === "string" ? WD.$$(map.name, document) : [target];
				query.forEach(function(node) {
					trigger.push({
						target:  node,
						name:    map.name,
						call:    map.call,
						bind:    map.bind,
						value:   "",
						wdArray: null,
					});
				});
			}
		}

		/*-- Analisando e chamando disparadores ----------------------------------*/
		const info = {};
		let parser, wdarray, count = 0;
		trigger.forEach(function(map,i,a) {
			/*-- evento wddataset: verificar se a propriedade definida está prevista --*/
			if (wddataset.length > 0 && wddataset.indexOf(map.name) < 0)
				return;
			/*-- verificar se o valor do atributo pode ser obtido --*/
			parser  = new __Parser(map.value);console.log(map)
			wdarray = parser.wdArray.get();
			if (wdarray === null)
				return;
			if (wdarray.length === 0)
				wdarray.push({});
			/*-- verificar se há alguma propriedade obrigatória a definir --*/
			for (let prop in map.bind) {
				for (let j = 0; j < wdarray.length; j++) {
					if (!(prop in wdarray[j]))
						wdarray[j][prop] = map.bind[prop];
				}
			}
			map.wdArray = wdarray;



			/*-- log de manutenção--*/
			info[event.type] = map.name;
			info.call = map.call.name;
			info.data = map.wdArray;
			if (__UNDERMAINTENANCE) console.info(info);

			/*-- chamar disparador --*/
			if (config.preventDefault && count === 0)
				event.preventDefault();
			map.call(map.target, event, map.wdArray);
			count++;
		});
		return;
	};

	/*-- defininir eventos e disparadores --*/ //FIXME desabilitei isso aqui, ligar depois
	/*for (let ev in __EVENTS)
		__EVENTS[ev].target.addEventListener(ev, eventManager, false);*/



	window.addEventListener("resize", __DEVICE);
	window.addEventListener("resize", __HASH);
	window.addEventListener("hashchange", __HASH);
	window.addEventListener("wdreload", __HASH);
	window.addEventListener("load", function(ev) {
		document.dispatchEvent(wdReloadEvent);
		return;
	});
	/*-- retornar a função principal da biblioteca --*/
	return WD;
}());