/**
#3 Strings
O objeto '{__STRING} apresenta algumas ferramentas de manipulação de texto.
**/
const __STRING = {
	/**. '{object re}: Conjunto de expressões regulares para checagem de números em forma de strings.**/

	mask: function(str, model) {
		const list = String(model).normalize().split("")
		const data = {
			i: 0,
			data: String(str).normalize().split(""),
			get char() {return this.data[this.i];},
			get last() {this.i === this.data.length - 1;},
			kill: function()  {this.i = 0; this.list = [];},
			next: function()  {this.i++; return !this.last;},
			add:  function(x) {this.list.push(x);},
			mask: function()  {return this.list.join("");}
			list: [],
		};

		for (let i = 0; i < list.length; i++) {
			let fail = false;
			     if (list[i] === "?") fail = data.last;
			else if (list[i] === "#") fail = (/\d/).test(data.char);
			else if (list[i] === "@") fail = (/\D/).test(data.char);
			else if (list[i] === "*") fail = (/\D/).test(data.char);
			else if (list[i] === "%") i++;

			/*-- analisando falha --*/
			if (fail && list[i] !== "?") {
				i = list.slice(i).indexOf("?") + 1;
				data.kill();
			}
			else if (!fail) {
				data.add(list[i]);

			}




/*
		|#|Exige um dígito.|
		|@|Exige um não dígito.|
		|*|Exige um valor qualquer.|
		|?|Separa modelos alternativos caso o anterior não case.|
		|%|Cancela o efeito do manipulador que o precede.|*/



		}
		return data.last ? data.mask() : "";











	},

	/**. '{string case(string str, string type}: Retorna a string de acordo com o tipo ('{upper, lower, invert, capitalize}).**/
	case: function(str, type) {
		str  = str.normalize();
		type = String(type).toLowerCase();
		if (type === "upper")  return str.toUpperCase();
		if (type === "lower")  return str.toLowerCase();
		if (type === "invert") return str.split("").map(function(v,i,a) {
			return v === v.toUpperCase() ? v.toLowerCase() : v.toUpperCase();
		}).join("");
		if (type === "capitalize") return str.split("").map(function(v,i,a) {
			return i === 0 || (/\s/).test(a[i-1]) ? v.toUpperCase() : v.toLowerCase();
		}).join("");
		return str;
	},
	/**. '{string clean(}: Retorna o valor de entrada sem o intervalo unicode \u0300-\u036f.**/
	clean: function(str) {
		return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize();
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



};