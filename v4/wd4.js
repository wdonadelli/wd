/*----------------------------------------------------------------------------
MIT License

Copyright (c) 2022 Willian Donadelli <wdonadelli@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.﻿
----------------------------------------------------------------------------*/

/* wd.js (v4.0.0) | https://github.com/wdonadelli/wd */

"use strict";

var wd = (function() {

/*------------------------------------------------------------------------------
BLOCO 1: atributos e funções globais
BLOCO 2: objetos especiais para atividades específicas
BLOCO 3: objetos de interface (acessíveis aos usuários)
BLOCO 4: funções de atributos HTML
BLOCO 5: boot
------------------------------------------------------------------------------/*

/* == BLOCO 1 ================================================================*/

/*----------------------------------------------------------------------------*/
	var wd_version = "v4.0.0 2022-01-01";
	/* Guarda informação do dispositivo (desktop, mobile...) */
	var wd_device_controller = null;
	/* Guarda o intervalo de tempo para executar funções vinculadas aos eventos de tecla */
	var wd_key_time_range = 500;
	/* Guarda a barra de progresso das requisições */
	var wd_request_progress = document.createElement("PROGRESS");
	wd_request_progress.max = 1;
	/* Guarda o container da janela modal para requisições */
	var wd_modal_window = document.createElement("DIV");
	wd_modal_window.className = "js-wd-modal";
	wd_modal_window.appendChild(wd_request_progress);
	/* Guarda o número requisições abertas */
	var wd_request_counter = 0;
	/* guarda os números primos */
	var wd_number_primes = [
		2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
		67, 71, 73, 79, 83, 89, 97, 
	];
	/* Guarda os estilos da biblioteca Selector Database */
	var wd_js_styles = [
		{s: ".js-wd-modal", d: [
			"display: block; width: 100%; height: 100%;",
			"padding: 0.1em 0.5em; margin: 0; zIndex: 999999;",
			"position: fixed; top: 0; right: 0; bottom: 0; left: 0;",
			"cursor: progress; backgroundColor: rgba(0,0,0,0.4);"
		]},


	];


/*----------------------------------------------------------------------------*/
	/* Executando comandos iniciais */



	wd_modal_window.style.backgroundColor = "red";
	wd_modal_window.style.position = "fixed";
	wd_modal_window.style.top = "0";
	wd_modal_window.style.right = "0";
	wd_modal_window.style.bottom = "0";
	wd_modal_window.style.left = "0";







/*----------------------------------------------------------------------------*/
	function wd_lang() { /*Retorna o local: definido ou do navegador*/
		var attr  = document.body.parentElement.attributes;
		if ("lang" in attr) return attr.lang.value.replace(/\ /g, "");
		return navigator.language || navigator.browserLanguage || "en-US";
	}

/*----------------------------------------------------------------------------*/
	function wd_get_device() {/*tipo do dispositivo*/
		if (window.innerWidth >= 768) return "desktop";
		if (window.innerWidth >= 600) return "tablet";
		return "phone";
	};
/*----------------------------------------------------------------------------*/
	function wd_bytes(value) { /*calculadora de bytes*/
		if (value >= 1099511627776) return (value/1099511627776).toFixed(2)+"TB";
		if (value >= 1073741824)    return (value/1073741824).toFixed(2)+"GB";
		if (value >= 1048576)       return (value/1048576).toFixed(2)+"MB";
		if (value >= 1024)          return (value/1024).toFixed(2)+"kB";
		return value+"B";
	}

/*----------------------------------------------------------------------------*/
	function wd_is_leap(y) { /*Retorna verdadeiro se o ano (y) for bissexto*/
		if (y === 0)       return false;
		if (y % 400 === 0) return true;
		if (y % 100 === 0) return false;
		if (y % 4 === 0)   return true;
		return false;
	}

/*----------------------------------------------------------------------------*/
	function wd_set_date(date, d, m, y) { /*Define data de referência */
		if (date === null || date === undefined) date = new Date();
		date.setMilliseconds(0);
		date.setSeconds(0);
		date.setMinutes(0);
		date.setHours(12);
		if (y !== null && y !== undefined) date.setFullYear(y);
		if (m !== null && m !== undefined) date.setMonth(m - 1);
		if (d !== null && d !== undefined) date.setDate(d);
		return date;
	}

/*----------------------------------------------------------------------------*/
	function wd_time_number(h, m, s) { /*Converte tempo em número*/
		var time = 0;
		time += h * 3600;
		time += m * 60;
		time += s === undefined ? 0 : s;
		return time % 86400;
	}

/*----------------------------------------------------------------------------*/
	function wd_number_time(n) { /*Converte número em tempo (objeto{h,m,s})*/
		var time = {};
		n      = n < 0 ? (86400 + (n % 86400)) : (n % 86400);
		time.h = (n - (n % 3600)) / 3600;
		n      = n - (3600 * time.h);
		time.m = (n - (n % 60)) / 60;
		time.s = n - (60 * time.m);
		return time;
	}

/*----------------------------------------------------------------------------*/
	function wd_str_time(val) { /* obtém tempo a partir de uma string */
		var data = [
			{re: /^(0?[1-9]|1[0-2])\:[0-5][0-9]\ ?(am|pm)$/i, sym: "ampm"},
			{re: /^(0?[0-9]|1[0-9]|2[0-4])(\:[0-5][0-9]){1,2}$/, sym: "time"},
		];
	
		var index = -1;
		for (var i = 0; i < data.length; i++) {
			if (data[i].re.test(val)) index = i;
			if (index >= 0) break;
		}
		if (index < 0) return null;

		var values = val.replace(/[^0-9\:]/g, "").split(":");
		for (var i = 0; i < values.length; i++)
			values[i] = new Number(values[i]).valueOf();

		if ((/am$/i).test(val) && values[0] === 12) values[0] = 0;
		if ((/pm$/i).test(val) && values[0] < 12)   values[0] = values[0] + 12;

		return wd_time_number(values[0], values[1], values[2]);
	}

/*----------------------------------------------------------------------------*/
	function wd_str_date (val) { /* obtém data em formato string */
		var data = [
			{re: /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/, sym: "-", y: 0, m: 1, d: 2},
			{re: /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/, sym: "/", y: 2, m: 1, d: 0},
			{re: /^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/, sym: ".", y: 2, m: 0, d: 1},
		];

		var index = -1;
		for (var i = 0; i < data.length; i++) {
			if (data[i].re.test(val)) index = i;
			if (index >= 0) break;
		}

		if (index < 0) return null;

		var date = val.split(data[index].sym);
		var d    = Number(date[data[index].d]);
		var m    = Number(date[data[index].m]);
		var y    = Number(date[data[index].y]);

		if (y > 9999 || y < 1 || m > 12 || m < 1 || d > 31 || d < 1) return null;
		if (d > 30 && [2, 4, 6, 9, 11].indexOf(m) >= 0)              return null;
		if (m === 2 && (d > 29 || (d === 29 && !wd_is_leap(y))))     return null;

		return wd_set_date(null, d, m, y);
	}

/*----------------------------------------------------------------------------*/
	function wd_str_number(val) { /* obtem números em formato de string */
		var data = [
			{re: /^[0-9]+\!$/, sym: "!"},
			{re: /^[\+\-]?([0-9]+|([0-9]+)?\.[0-9]+)(e[\-\+]?[0-9]+)?\%$/i, sym: "%"},
			{re: /^[\-\+]?([0-9]+|([0-9]+)?\.[0-9]+)(e[\-\+]?[0-9]+)?$/i, sym: null},
		];
	
		var index = -1;
		for (var i = 0; i < data.length; i++) {
			if (data[i].re.test(val)) index = i;
			if (index >= 0) break;
		}

		if (index < 0) return null;
		if (data[index].sym === "%")
			return new Number(val.replace("%", "")).valueOf() / 100;
		if (data[index].sym === "!") {
			var number =  new Number(val.replace("!", "")).valueOf();
			var value  = 1;
			while (number > 1) {
				value *= number;
				number--;
			}
			return value;
		}

		return new Number(val).valueOf();
	}

/*----------------------------------------------------------------------------*/
	function wd_dom(val) { /* verifica e obtem DOM */
		if (val === document || val === window) return [val];

		var data = {
			HTMLElement: "dom",
			SVGElement:  "dom",
			NodeList: "doms",
			HTMLCollection: "doms",
			HTMLAllCollection: "doms",
			HTMLOptionsCollection: "doms",
			HTMLFormControlsCollection: "doms",
		};

		for (var i in data) {
			if (i in window && val instanceof window[i]) {
				if (data[i] === "dom") return [val];
				var array = [];
				for (var n = 0; n < val.length; n++) array.push(val[n]);
				return array;
			}
		}
		return null;
	}

/*----------------------------------------------------------------------------*/
	function wd_vtype(val) {/* retorna o tipo e o valor do objeto */
		var value;

		/* Valores simples */
		if (val === undefined)             return {type: "undefined", value: val};
		if (val === null)                  return {type: "null", value: val};
		if (val === true || val === false) return {type: "boolean", value: val};

		/* Valores em forma de string */
		if (typeof val === "string" || val instanceof String) {
			val = val.trim();
			if (val === "") return {type: "null", value: null};

			var mtds = {
				"date": wd_str_date, "time": wd_str_time, "number": wd_str_number
			};
			for (var t in mtds) {
				value = mtds[t](val);
				if (value !== null) return {value: value, type: t}
			}

			return {type: "text", value: val.toString()};
		}

		/* Elementos da árvore DOM */
		value = wd_dom(val);
		if (value !== null) return {value: value, type: "dom"};

		/* Outros tipos de valores */
		var types = [/* to: typeof, ct: constructor, tp: type, ck: checagem */
			{tp: "Number",   ck: !isNaN(val)},
			{tp: "Array",    ck: Array.isArray(val)},
			{tp: "Date",     ck: true},
			{tp: "Boolean",  ck: true},
			{tp: "Regexp",   ck: true},
			{tp: "Function", ck: true},
			{tp: "Object",   ck: (/^\{.*\}$/).test(JSON.stringify(val))},
		];

		var vtype = {type: "unknown", value: val};
		for (var i = 0; i < types.length; i++) {
			if (!types[i].ck) continue;
			if (typeof val === types[i].tp.toLowerCase())
				vtype.type = types[i].tp.toLowerCase();
			else if (types[i].tp in window && val instanceof window[types[i].tp])
				vtype.type = types[i].tp.toLowerCase();
			if (vtype.type !== "unknown") break;
		}

		if (vtype.type === "boolean" || vtype.type === "number")
			vtype.value = vtype.value.valueOf();
		else if (vtype.type === "array")
			vtype.value = vtype.value.slice();
		else if (vtype.type === "date")
			vtype.value = wd_set_date(vtype.value);

		return vtype;
	}

/*----------------------------------------------------------------------------*/
	function wd_$(selector, root) {/* retorna querySelector */
		var elem = null;
		try {elem = root.querySelector(selector);    } catch(e) {}
		if (elem !== null) return elem;
		try {elem = document.querySelector(selector);} catch(e) {}
		return elem;
	}

/*----------------------------------------------------------------------------*/
	function wd_$$(selector, root) {/* retorna querySelectorAll */
		var elem = null;
		try {elem = root.querySelectorAll(selector);    } catch(e) {}
		if (elem !== null) return elem;
		try {elem = document.querySelectorAll(selector);} catch(e) {}
		return elem;
	}

/*----------------------------------------------------------------------------*/
	function wd_$$$(obj) { /* captura os valores de $ e $$ dentro de um objeto */
		var one = obj["$"].trim();
		var all = obj["$$"].trim();
		var words  = {"document": document, "window":  window};
		if (one in words) return words[selOne];
		if (all in words) return words[selAll];
		return all !== null ? all : one;
	}

/*----------------------------------------------------------------------------*/
	function wd_text_caps(input) { /* captaliza string */
		var input = input.split("");
		var empty = true;
		for (var i = 0; i < input.length; i++) {
			input[i] = empty ? input[i].toUpperCase() : input[i].toLowerCase();
			empty    = input[i].trim() === "" ? true : false;
		}
		return input.join("");
	}

/*----------------------------------------------------------------------------*/
	function wd_text_toggle(input) { /* altera caixa de string */
		var input = input.split("");
		for (var i = 0; i < input.length; i++) {
			var test = input[i].toUpperCase();
			input[i] = input[i] === test ? input[i].toLowerCase() : test;
		}
		return input.join("");
	}

/*----------------------------------------------------------------------------*/
	function wd_mask(input, check, callback) { /* aplica máscaras a strings */
		check = String(check).toString();
		var code  = {"#": "[0-9]", "@": "[a-zA-ZÀ-ÿ]", "*": "."};
		var mask  = ["^"]; /*Formato da máscara (conteúdo + caracteres)*/
		var only  = ["^"]; /*Conteúdo da máscara (conteúdo apenas)*/
		var gaps  = [];    /*Caracteres da máscara (comprimento do formato)*/
		var func  = wd_vtype(callback);
		if (func.type !== "function") callback = function(x) {return true;}

		/* obtendo a máscara e os containers para ocupação */
		for (var i = 0; i < input.length; i++) {
			var char = input[i];

			if (char in code) { /*caracteres de máscara*/
				mask.push(code[char]);
				gaps.push(null);
				only.push(code[char])
			} else if ((/\w/).test(char)) { /*números, letras e sublinhado*/
				mask.push(char === "_" ? "\\_" : char);
				gaps.push(char);
			} else if (char === "\\" && input[i+1] in re) { /*caracteres especiais*/
				mask.push(char+input[i+1]);
				gaps.push(input[i+1]);
				i++;
			} else { /*outros caracteres*/
				mask.push("\\"+char);
				gaps.push(char);
			}
		}

		/* retorna se o usuário entrou com a máscara já formatada adequadamente*/
		mask.push("$");
		mask = new RegExp(mask.join(""));
		if (mask.test(check) && callback(check)) return check;

		/*se os caracteres não estiverem de acordo com a máscara*/
		only.push("$");
		only = new RegExp(only.join(""));
		if (!only.test(check)) return null;

		/*se os caracteres estiverem de acordo com a máscara*/
		var n = 0;
		for (var i = 0; i < gaps.length; i++) {
			if (gaps[i] === null) {
				gaps[i] = check[n];
				n++;
			}
		}
		gaps = gaps.join("");

		if (callback(gaps)) return gaps;

		return null;
	}

/*----------------------------------------------------------------------------*/
	function wd_multiple_masks(input, check, callback) { /* aplica múltiplas máscaras com separador ? */
		var masks = input.split("?");
		for (var i = 0; i < masks.length; i++) {
			var mask = wd_mask(masks[i], check, callback);
			if (mask !== null) return mask;
		}
		return null;
	}

/*----------------------------------------------------------------------------*/
	function wd_csv_array(input) {/* CSV para Array */
		var data = [];
		var rows = input.trim().split("\n");
		for (var r = 0; r < rows.length; r++) {
			data.push([]);
			var cols = rows[r].split("\t")
			for (var c = 0; c < cols.length; c++) {
				var value = cols[c];
				if ((/^\"(.+)?\"$/).test(value)) value = value.replace(/^\"/, "").replace(/\"$/, "");
				data[r].push(value);
			}
		}
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_json(input) { /* se texto, retornar um objeto, caso contrário, um JSON */
		if (input === null || input === undefined) return {};
		if (wd_vtype(input).type === "text") {
			try {return JSON.parse(input.toString());}
			catch(e) {return {};}
		}
		try {return JSON.stringify(input)}
		catch(e) {return ""}
	}

/*----------------------------------------------------------------------------*/
	function wd_no_spaces(txt, char) { /* Troca múltiplos espaço por um caracter*/
		return txt.replace(/[\0- ]+/g, (char === undefined ? " " : char)).trim();
	};

/*----------------------------------------------------------------------------*/
	function wd_text_clear(value) { /* elimina acentos */
		value = new String(value);
		if ("normalize" in value)
			return value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

		var ascii = {
			A: /[À-Å]/g, C: /[Ç]/g,   E: /[È-Ë]/g, I: /[Ì-Ï]/g,
			N: /[Ñ]/g,   O: /[Ò-Ö]/g, U: /[Ù-Ü]/g, Y: /[ÝŸ]/g,
			a: /[à-å]/g, c: /[ç]/g,   e: /[è-ë]/g, i: /[ì-ï]/g,
			n: /[ñ]/g,   o: /[ò-ö]/g, u: /[ù-ü]/g, y: /[ýÿ]/g
		};
		for (var i in ascii)
			value = value.replace(ascii[i], i);

		return value;
	}

/*----------------------------------------------------------------------------*/
	function wd_text_camel(value) { /* abc-def para abcDef */
		var x = wd_text_clear(value).replace(/[^a-zA-Z0-9\.\_\:\-\ ]/g, "");

		/* testando se já está no formato */
		if ((/^[a-z0-9\.\_\:][a-zA-Z0-9\.\_\:]+$/).test(x)) return x;

		/* adequando string */
		var x = wd_no_spaces(value, "-").split("");
		for (var i = 0; i < x.length; i++) {
			if (x[i].toLowerCase() != x[i]) x[i] = "-"+x[i];
			if (x[i-1] === "-") x[i] = x[i].toUpperCase();
		}

		x = x.join("").replace(/\-+/g, "-").replace(/^\-+/g, "");
		x = x.split("-");
		x[0] = x[0].toLowerCase();
		x = x.join("").replace(/\-/g, "");

		return x === "" ? null : x;
	}

/*----------------------------------------------------------------------------*/
	function wd_text_dash(value) { /*abcDef para abc-def*/
		var x = wd_text_clear(value).replace(/[^a-zA-Z0-9\.\_\:\-\ ]/g, "");

		/* testando se já está no formato */
		if ((/^[a-z0-9\_\.\:]+((\-[a-z0-9\_\.\:]+)+)?$/).test(x)) return x;

		/* adequando string */
		x = wd_no_spaces(x, "-").split("");
		for (var i = 1; i < x.length; i++)
			x[i] = x[i].toLowerCase() == x[i] ? x[i] : "-"+x[i];

		x = x.join("").toLowerCase().replace(/\-+/g, "-");
		x = x.replace(/^\-+/g, "").replace(/\-+$/g, "");

		return x === "" ? null : x;
	}

/*----------------------------------------------------------------------------*/
	function wd_replace_all(input, search, change) { /* replaceAll simples */
		search = new String(search);
		change = new String(change);
		var x = input.split(search);
		return x.join(change);
	}

/*----------------------------------------------------------------------------*/
	function wd_apply_getters(object, args) { /* auto-aplica getter em objeto */
		var obj   = object;
		var type  = object.type;
		var value = null;

		for (var i = 0; i < args.length; i++) {
			var attr = args[i];
			/* atributo existe? */
			if (!(args[i] in obj)) continue;
			var val   = obj[args[i]];
			var vtype = wd_vtype(val);
			/* o novo valor é do mesmo tipo que o original? */
			if (vtype.type !== type) continue;
			value = vtype.value;
			/* recriando o objeto para não interferir no original */
			obj = new object.constructor(value);
		}
		return value;
	}

/*----------------------------------------------------------------------------*/
	function wd_finite(n) {/* verifica se é um valor finito */
		var vtype = wd_vtype(n);
		if (vtype.type !== "number") return false;
		return isFinite(vtype.value);
	};

/*----------------------------------------------------------------------------*/
	function wd_integer(n, abs) { /* retorna o inteiro do número ou seu valor absoluto */
		var vtype = wd_vtype(n);
		if (vtype.type !== "number") return null;
		var val = abs === true ? Math.abs(vtype.value) : vtype.value;
		return val < 0 ? Math.ceil(val) : Math.floor(val);
	};

/*----------------------------------------------------------------------------*/
	function wd_decimal(value) {/* retorna o número de casas decimais */
		if (!wd_finite(value)) return 0;
		var i = 0;
		while ((value * Math.pow(10, i)) % 1 !== 0) i++;
		var pow10  = Math.pow(10, i);
		if (pow10 === 1) return 0;
		return (value*pow10 - wd_integer(value)*pow10) / pow10;
	}

/*----------------------------------------------------------------------------*/
	function wd_mdc(a, b) {
		var div   = [];
		var prime = wd_number_primes;
		for (var i = 0; i < prime.length; i++) {
			if (prime[i] > a || prime[i] > b) break;
			while (a % prime[i] === 0 && b % prime[i] === 0) {
				div.push(prime[i]);
				a = a/prime[i];
				b = b/prime[i];
			}
		}
		var mdc = 1;
		for (var i = 0; i < div.length; i++) mdc = mdc * div[i];
		return mdc;
	}

/*----------------------------------------------------------------------------*/
	function wd_num_type(n) { /* retorna o tipo de número */
		if (n === 0)         return "zero";
		var type = n < 0 ? "-" : "+";
		if (Math.abs(n) === Infinity) return type+"infinity";
		if (n === wd_integer(n))          return type+"integer";
		return type+"real";
	}

/*----------------------------------------------------------------------------*/
	function wd_num_test(n, tests) {/* testa se o tipo de número se enquadra em alguma categoria */
		var type = wd_num_type(n);
		for (var i = 0; i < tests.length; i++) {
			if (tests[i] === type) return true;
			if (tests[i] === type.substr(1, type.length)) return true;
		}
		return false;
	}

/*----------------------------------------------------------------------------*/
	function wd_num_frac(n) { /* representação em fração (2 casas) */
		if (wd_num_test(n, ["integer", "zero"]))
			return wd_integer(n).toFixed(0);
		if (wd_num_test(n, ["infinity"]))
			return wd_num_str(n);

		var integer = wd_integer(n);
		var decimal = wd_decimal(n);

		var data  = {int: Math.abs(integer), num: 0, den: 1, error: 1};
		var value = Math.abs(decimal);
		var prime = wd_number_primes.slice();
		prime.push(10);
		prime.push(100);

		for (var i = 0; i < prime.length; i++) {
			var n = 0;
			var d = prime[i];
			while (n < d) {
				var err = Math.abs((n/d)-value)/value;
				if (err < data.error) {
					data.den   = d;
					data.num   = n;
					data.error = err;
				}
				if (data.error === 0) break;
				n++;
			}
			if (data.error === 0) break;
		}

		var mdc = wd_mdc(data.num, data.den);
		data.num = data.num/mdc;
		data.den = data.den/mdc;

		if (data.num === 0 && data.int === 0) return "0";
		if (data.num === 0 && data.int !== 0) return data.int.toFixed(0);

		data.int = data.int === 0 ? "" : data.int.toFixed(0)+" ";
		data.num = data.num.toFixed(0)+"/";
		data.den = data.den.toFixed(0);
		return (n < 0 ? "-" : "")+data.int+data.num+data.den;
	}

/*----------------------------------------------------------------------------*/
	function wd_num_round(n, width) { /* arredonda número para determinado tamanho */
		width = wd_finite(width) ? wd_integer(width, true) : 0;
		return new Number(n.toFixed(width)).valueOf();
	}

/*----------------------------------------------------------------------------*/
	function wd_num_pow10(n, width) { /* transforma número em notação científica */
		if (wd_num_test(n, ["infinity", "zero"])) return wd_num_str(n);

		width = wd_finite(width) ? wd_integer(width, true) : undefined;

		var chars = {
			"0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵",
			"6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "+": "⁺", "-": "⁻"
		};
		var exp = n.toExponential(width).split(/[eE]/);
		for (var i in chars) {
			var re = (/[0-9]/).test(i) ? new RegExp(i, "g") : new RegExp("\\"+i, "g");
			exp[1] = exp[1].replace(re, chars[i]);
		}
		return exp.join(" x 10");
	}

/*----------------------------------------------------------------------------*/
	function wd_num_local(n, currency) { /* notação numérica local */
		if (currency !== undefined) {
			currency = {style: "currency", currency: currency};
			try {return new Intl.NumberFormat(wd_lang(), currency).format(n);}
			catch(e) {}
		}
		try {return new Intl.NumberFormat(wd_lang()).format(n);} catch(e) {}
		return n.toLocaleString();
	}

/*----------------------------------------------------------------------------*/
	function wd_num_fixed(n, ldec, lint) { /* fixa quantidade de dígitos (decimal e inteiro) */
		if (wd_num_test(n, ["infinity"])) return wd_num_str(n);

		lint = wd_finite(lint) ? wd_integer(lint, true) : 0;
		ldec = wd_finite(ldec) ? wd_integer(ldec, true) : 0;

		var sign = n < 0 ? "-" : "";
		var int  = Math.abs(wd_integer(n));
		var dec  = Math.abs(wd_decimal(n));

		dec = dec.toFixed((ldec > 20 ? 20 : ldec));
		if ((/^1/).test(dec)) int++;
		dec = ldec === 0 ? "" : "."+dec.split(".")[1];

		int = int.toLocaleString("en-US").split(".")[0].replace(/\,/g, "").split("");
		while (int.length < lint) int.unshift("0");
		int = int.join("");

		return sign+int+dec;
	}

/*----------------------------------------------------------------------------*/
	function wd_num_str(n, ratio) { /* Define a exibição de valores numéricos */
		if (ratio === true) n = 100*n;
		if (wd_num_test(n, ["infinity"]))
			return (n < 0 ? "\u2212" : "\u002B")+"\u221E";
		
		var end = ratio === true ? "\u0025" : "";
		var val = Math.abs(n);

		if (val === 0) return "0"+end;
		if ((1/val) > 1) {
			if (val <= 1e-10) return n.toExponential(0)+end;
			if (val <= 1e-3)  return n.toExponential(1)+end;
			if (val <= 1e-2)  return wd_num_fixed(n,2,0)+end;
		} else {
			if (val >= 1e10) return n.toExponential(0)+end;
			if (val >= 1e3)  return n.toExponential(1)+end;
			if (val >= 1e2)  return wd_num_fixed(n,0,0)+end;
			if (val >= 1e1)  return wd_num_fixed(n,1,0)+end;
		}
		return wd_num_fixed(n,2,0)+end;
	}

/*----------------------------------------------------------------------------*/
	function wd_time_ampm(h, m) { /* retorna hora no formato ampm */
		var p = h < 12 ? " AM" : " PM"; 
		h = h === 0 ? 12 : (h <= 12 ? h : (h - 12));
		m = wd_num_fixed(m, 0, 2);
		return wd_num_fixed(h)+":"+m+p;
	}

/*----------------------------------------------------------------------------*/
	function wd_time_format(obj, char) { /* define um formato de tempo a partir de caracteres especiais */
		char = new String(char).toString();
		var words = [
			{c: "%h", v: function() {return wd_num_fixed(obj.h, 0, 0);}},
			{c: "%H", v: function() {return wd_num_fixed(obj.h, 0, 2);}},
			{c: "#h", v: function() {return obj.h12;}},
			{c: "%m", v: function() {return wd_num_fixed(obj.m, 0, 0);}},
			{c: "%M", v: function() {return wd_num_fixed(obj.m, 0, 2);}},
			{c: "%s", v: function() {return wd_num_fixed(obj.s, 0, 0);}},
			{c: "%S", v: function() {return wd_num_fixed(obj.s, 0, 2);}},
		];
		for (var i = 0; i < words.length; i++)
			if (char.indexOf(words[i].c) >= 0)
				char = wd_replace_all(char, words[i].c, words[i].v());
		return char
	}

/*----------------------------------------------------------------------------*/
	function wd_time_iso(number) { /* transforma valor numérico em tempo no formato HH:MM:SS */
		var obj = wd_number_time(number);
		var time = wd_num_fixed(obj.h, 0, 0)+":";
		time    += wd_num_fixed(obj.m, 0, 2)+":";
		time    += wd_num_fixed(obj.s, 0, 2);
		return time;
	}

/*----------------------------------------------------------------------------*/
	function wd_date_format(obj, char) { /* define um formato de data a partir de caracteres especiais */
		char = new String(char).toString();
		var words = [
			{c: "%d", v: function() {return wd_num_fixed(obj.d, 0, 0);}},
			{c: "%D", v: function() {return wd_num_fixed(obj.d, 0, 2);}},
			{c: "@d", v: function() {return wd_num_fixed(obj.today, 0, 0);}},
			{c: "@D", v: function() {return wd_num_fixed(obj.days, 0, 0);}},
			{c: "#d", v: function() {return obj.shortDay;}},
			{c: "#D", v: function() {return obj.longDay}},
			{c: "$d", v: function() {return wd_num_fixed(obj.working, 0, 0);}},
			{c: "%m", v: function() {return wd_num_fixed(obj.m, 0, 0);}},
			{c: "%M", v: function() {return wd_num_fixed(obj.m, 0, 2);}},
			{c: "@m", v: function() {return wd_num_fixed(obj.size, 0, 0);}},
			{c: "#m", v: function() {return obj.shortMonth;}},
			{c: "#M", v: function() {return obj.longMonth;}},
			{c: "%y", v: function() {return wd_num_fixed(obj.y, 0, 0);}},
			{c: "%Y", v: function() {return wd_num_fixed(obj.y, 0, 4);}},
			{c: "@y", v: function() {return wd_num_fixed(obj.week, 0, 0);}},
			{c: "@Y", v: function() {return wd_num_fixed(obj.length, 0, 0);}},
			{c: "$y", v: function() {return wd_num_fixed(obj.workingYear, 0, 0);}},
		];
		for (var i = 0; i < words.length; i++)
			if (char.indexOf(words[i].c) >= 0)
				char = wd_replace_all(char, words[i].c, words[i].v());
		return char
	};

/*----------------------------------------------------------------------------*/
	function wd_date_iso(value) { /* retorna data no formato YYYY-MM-YY a partir de um Date() */
		var date = wd_num_fixed(value.getFullYear(), 0, 4)+"-";
		date    += wd_num_fixed(value.getMonth()+1, 0, 2)+"-";
		date    += wd_num_fixed(value.getDate(), 0, 2);
		return date;
	}

/*----------------------------------------------------------------------------*/
	function wd_date_first_day(search, year) { /* encontra o primeiro dia do ano (valor inteiro) */
		var init = wd_set_date(null, 1, 1, year).getDay() + 1;
		var diff = search < init ? search + 7 - init : search - init
		return 1 + diff;
	}

/*----------------------------------------------------------------------------*/
	function wd_date_locale(obj, value) { /* obtem o nome do atributo da data no local */
		try {return obj.toLocaleString(wd_lang(), value);} catch(e) {}
		return obj.toLocaleString(undefined, value);
	}

/*----------------------------------------------------------------------------*/
	function wd_date_size(m, y) { /* quantidade de dias no mês */
				var list = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				return (m === 2 && wd_is_leap(y) ? 1 : 0) + list[m - 1];
	};

/*----------------------------------------------------------------------------*/
	function wd_date_working(y, ref) { /* obtem os dias úteis a partir de uma referência */
		var sat  = wd_date_first_day(7, y);
		var sun  = wd_date_first_day(1, y);
		var nSat = wd_integer((ref - sat)/7) + 1;
		var nSun = wd_integer((ref - sun)/7) + 1;
		var work = ref - (nSat + nSun)
		return work < 0 ? 0 : work;
	}

/*----------------------------------------------------------------------------*/
	function wd_date_days(y, m, d) { /* dias transcorridos no ano */
		var days  = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
		return days[m - 1] + d + ((m > 2 && wd_is_leap(y)) ? 1 : 0);
	}

/*----------------------------------------------------------------------------*/
	function wd_date_week(days, today) { /* retorna a semana do ano (cheia) */
		var ref = days - today + 1;
		return (ref % 7 > 0 ? 1 : 0) + wd_integer(ref/7);
	}

/*----------------------------------------------------------------------------*/
	function wd_matrix_cell(matrix, cell) { /* obtem lista de valores ade matriz a partir de endereço linha:coluna */
		/* celula linha:coluna */
		cell = new String(cell).trim().split(":");
		if (cell.length < 2) cell.push("");

		/* i: célula inicial, n: célula final */
		var row  = {i: -Infinity, n: Infinity};
		var col  = {i: -Infinity, n: Infinity};
		var list = [];
		var item = [row, col];
		
		/* definindo parâmetros para captura da linha (0) e coluna (1) */
		for (var i = 0; i < item.length; i++) {
			if ((/^[0-9]+$/).test(cell[i])) { /* unico endereço */
				item[i].i = wd_integer(cell[i]);
				item[i].n = wd_integer(cell[i]);
			} else if ((/^\-[0-9]+$/).test(cell[i])) { /* do início até o endereço */
				item[i].n = wd_integer(cell[i].replace("-", ""));
			} else if ((/^[0-9]+\-$/).test(cell[i])) { /* do endereço até o fim */
				item[i].i = wd_integer(cell[i].replace("-", ""));
			} else if ((/^[0-9]+\-[0-9]+$/).test(cell[i])) { /* do endereço inicial até o final */
				var gap   = cell[i].split("-");
				item[i].i = wd_integer(gap[0]);
				item[i].n = wd_integer(gap[1]);
			}
		}

		/* obtendo valores */
		for (var r = 0; r < matrix.length; r++) {
			var check = wd_vtype(matrix[r]);
			if (check.type !== "array") continue;
			for (var c = 0; c < matrix[r].length; c++) {
				if (r >= row.i && r <= row.n && c >= col.i && c <= col.n)
					list.push(matrix[r][c]);
			}
		}

		return list;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_cells(matrix, values) { /* obtem lista a partir de múltiplas referências */
		var data = [];
		for (var i = 0; i < values.length; i++) {
			values[i] = new String(values[i]).toString();
			values[i] = wd_replace_all(values[i], " ", "");
			var items = wd_matrix_cell(matrix, values[i]);
			for (var j = 0; j < items.length; j++) data.push(items[j]);
		}
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_item(array, i) { /* retorna o índice especificado ou seu comprimento */
		if (!wd_finite(i)) return array.length;
		i = wd_integer(i);
		i = i < 0 ? this._value.length + i : i;
		return array[i];
	}

/*----------------------------------------------------------------------------*/
	function wd_array_check(array, values) { /* informa se o array contem os valores */
		if (values.length === 0) return false;
		for (var i = 0; i < values.length; i++)
			if (array.indexOf(values[i]) < 0) return false;
		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_search(array, value) { /* procura item no array e retorna os índices localizados */
		var index = [];
		for (var i = 0; i < array.length; i++) 
			if (array[i] === value) index.push(i);
		return index.length === 0 ? null : index;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_del(array, values) { /* retorna um array sem os valores informados */
		var list = [];
		for (var i = 0; i < array.length; i++)
			if (values.indexOf(array[i]) < 0) list.push(array[i])
		return list;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_add(array, values) { /* adiciona items ao array */
		array = array.slice();
		for (var i = 0 ; i < values.length; i++) array.push(values[i])
		return array;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_tgl(array, values) { /* alterna a existência de valores do array */
		for (var i = 0 ; i < values.length; i++) {
			if (array.indexOf(values[i]) < 0)
				array = wd_array_add(array, [values[i]]);
			else 
				array = wd_array_del(array, [values[i]]);
		}
		return array;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_count(array, value) { /* retorna a quantidade de vezes que o item aparece */
		var test = wd_array_search(array, value);
		return test === null ? 0 : test.length;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_rpl(array, item, value) { /* muda os valores de determinado item */
		var index = wd_array_search(array, item);
		if (index === null) return array;
		array = array.slice();
		for (var i = 0; i < index.length; i++) array[index[i]] = value;
		return array;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_unique(array) { /* remove itens repetidos */
		return array.filter(function(v, i, a) {
			return a.indexOf(v) == i;}
		);
	}

/*----------------------------------------------------------------------------*/
	function wd_array_sort(array) { /* ordena items */

		var order = [/*sequência de exibição por tipo*/
			"number", "time", "date", "text", "boolean", "null", "dom",
			"array", "object", "function", "regexp", "undefined", "unknown"
		];

		array = array.slice();
		array.sort(function(a, b) {
			var atype  = wd_vtype(a).type;
			var btype  = wd_vtype(b).type;
			var aindex = order.indexOf(atype);
			var bindex = order.indexOf(btype);
			var avalue = a;
			var bvalue = b;

			if (aindex > bindex) return  1;
			if (aindex < bindex) return -1;
			if (atype === "dom") {/*atype === btype (tipos iguais)*/
				var check = wd_array_sort([a.textContent, b.textContent]);
				avalue = a.textContent === check[0] ? 0 : 1;
				bvalue = avalue === 0 ? 1 : 0;
			} else if (atype === "text") {
				avalue = new WD(a).format("clear", "upper");
				bvalue = new WD(b).format("clear", "upper");
			} else if (["number", "boolean", "date", "time"].indexOf(atype) >= 0) {
				avalue = wd_vtype(a).value;
				bvalue = wd_vtype(b).value;
			}
			return avalue > bvalue ? 1 : -1;
		});

		return array;
	}

/*----------------------------------------------------------------------------*/
	function wd_matrix_data(matrix, x, y) { /* retorna dados estatísticos de uma matriz */
		x = wd_matrix_cell(matrix, x);
		y = wd_matrix_cell(matrix, y);
		return {
			get cmp()  {return wd_coord_compare(x, y);},
			get rlin() {return wd_coord_rlin(x, y);},
			get rexp() {return wd_coord_rlin(x, y);},
			get rgeo() {return wd_coord_rgeo(x, y);},
			get rsum() {return wd_coord_rsum(x, y);},
			get ravg() {return wd_coord_ravg(x, y);},
			get sum()  {return wd_coord_sum(x, 1).value;},
			get min()  {return wd_coord_limits(x).min;},
			get max()  {return wd_coord_limits(x).max;},
			get avg()  {return wd_coord_avg(x);},
			get med()  {return wd_coord_med(x);},
			get geo()  {return wd_coord_geo(x);},
			get harm() {return wd_coord_harm(x);},
			dev: function(n) {return wd_coord_deviation(x, this[n]);}
		};
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_adjust(x, y, z) { /* retorna pares de coordenadas numéricas */
	  var coord = {x: [], y: [], z: [], length: 0};
    /* checando se argumentos são arrays (x é obrigatório) */
    if (wd_vtype(x).type !== "array") return null;
    if (wd_vtype(y).type !== "array") y = null;
    if (wd_vtype(z).type !== "array") z = null;

		/* verificando conteúdo (deve ser numérico */
		var n = x.length;
		if (y !== null && y.length < n) n = y.length;
		if (z !== null && z.length < n) n = z.length;
		for (var i = 0; i < n; i++) {
		  var xtype = wd_vtype(x[i]);
		  var ytype = y === null ? null : wd_vtype(y[i]);
		  var ztype = z === null ? null : wd_vtype(z[i]);
		  if (!wd_finite(xtype.value)) continue;
		  if (y !== null && !wd_finite(ytype.value)) continue;
		  if (z !== null && !wd_finite(ztype.value)) continue;

      coord.x.push(xtype.value);
      if (y !== null) coord.y.push(ytype.value);
      if (z !== null) coord.z.push(ztype.value);
      coord.length++;
		}

		/* definindo valor final */
		if (y === null) coord.y = null;
		if (z === null) coord.z = null;
		return coord.length === 0 ? null : coord;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_sum(x, nx, y, ny, z, nz ) { /* retorna a soma de coordernadas */
		var coord = wd_coord_adjust(x, y, z);
		if (coord === null) return null;
		x = coord.x;
		y = coord.y;
		z = coord.z;
		var data = {value: 0, length: 0};
		for (var i = 0; i < coord.length; i++) {
			var vx = Math.pow(x[i],nx);
			var vy = y === null ? 1 : Math.pow(y[i],ny);
			var vz = z === null ? 1 : Math.pow(z[i],nz);
			if (!wd_finite(vx) || !wd_finite(vy) || !wd_finite(vz)) continue;
			data.value += vx * vy * vz;
			data.length++;
		}
		return data.length === 0 ? null : data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_product(x, nx) { /* retorna o produto da coordernada */
		var coord = wd_coord_adjust(x);
		if (coord === null) return null;
		x = coord.x;
		var data = {value: 1, length: 0};
		for (var i = 0; i < coord.length; i++) {
			var vx = Math.pow(x[i], nx);
			if (vx === 0 || !wd_finite(vx)) continue;
			data.value = data.value * vx;
			data.length++;
		}
		return data.length === 0 ? null : data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_limits(x) { /* retorna os maiores e menores valores da lista */
		var coord = wd_coord_adjust(x);
		if (coord === null) return null;
		x = wd_array_sort(coord.x);
		return {min: x[0], max: x.reverse()[0]};
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_avg(x) { /* retorna a média dos valores da lista */
		var sum = wd_coord_sum(x, 1);
		if (sum === null) return null
		return sum.value/sum.length;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_med(x) { /* retorna a mediana dos valores da lista */
		var coord = wd_coord_adjust(x);
		if (coord === null) return null
		x = wd_array_sort(coord.x);
		var l = x.length
		return l%2 === 0 ? (x[l/2]+x[(l/2)-1])/2 : x[(l-1)/2]
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_harm(x) { /* retorna a média harmonica */
		var harm = wd_coord_sum(x, -1);
		return (harm === null) ? null : harm.length/harm.value;
	}

/*----------------------------------------------------------------------------*/
  function wd_coord_geo(x) { /* retorna a média geométrica */
		var geo = wd_coord_product(x, 1);
		return (geo === null) ? null : Math.pow(geo.value, 1/geo.length);
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_deviation(x, ref) { /* retorna o desvio padrão entre listas ou uma referência */
		/* checando argumentos */
		var vref  = wd_vtype(ref);
		var coord = wd_coord_adjust(x, (vref.type === "array" ? ref : null));
		if (coord === null) return null;

		if (vref.type === "number") {
			if (!wd_finite(vref.value)) return null;
			ref = vref.value;
			x = coord.x;
		} else if (vref.type === "array") {
			x   = coord.x;
			ref = coord.y;
		} else return null;

		/* calculando */
		var data = {value: 0, length: 0};
		for (var i = 0; i < x.length; i++) {
			var diff = x[i] - (vref.type === "array" ? ref[i] : ref);
			var val = Math.pow(diff, 2);
			if (!wd_finite(val)) continue;
			data.value += val;
			data.length++;
		}
		return data.length === 0 ? null : Math.sqrt(data.value/data.length);
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_least_squares(x, y) { /* Método dos mínimos quadrados (obrigatório 2 coordenadas) */
		var coord = wd_coord_adjust(x, y);
		if (coord === null || coord.length < 2) return null;
		x = coord.x;
		y = coord.y;

		var X  = wd_coord_sum(x, 1);
		var Y  = wd_coord_sum(y, 1);
		var X2 = wd_coord_sum(x, 2);
		var XY = wd_coord_sum(x, 1, y, 1);
		if ([X, Y, XY, X2].indexOf(null) >= 0) return null;
		X  = X.value;
		Y  = Y.value;
		X2 = X2.value;
		XY = XY.value;
		var N    = coord.length;
		var data = {};
		data.a   = ((N * XY) - (X * Y)) / ((N * X2) - (X * X));
		data.b   = ((Y) - (X * data.a)) / (N);
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_setter(x, f) { /* obtem uma nova coordenada mediante aplicação de uma função */
		var data = [];
		for (var i = 0; i < x.length; i++) {
			try {var val = f(x[i]);} catch(e) {var val = null;}
			data.push(wd_finite(val) ? val : null);
		}
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_rmath(e, a, b, d) { /* define a forma numérica da função */
		e = wd_replace_all(e, "a", wd_num_str(a));
		e = wd_replace_all(e, "b", wd_num_str(b));
		return e+(d === 0 ? "" : " \u00B1 "+wd_num_str(d));
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_rlin(x, y) { /* regressão linear */
		var coord = wd_coord_adjust(x, y);
		if (coord === null) return null;
		x = coord.x;
		y = coord.y;
		var val = wd_coord_least_squares(x, y);
		if (val === null) return null;
		var data = {};
		data.e = "y = (a)x+(b)";
		data.a = val.a;
		data.b = val.b;
		data.f = function(x) {return data.a*x + data.b;};
		data.d = wd_coord_deviation(y, wd_coord_setter(x, data.f));
		data.m = wd_coord_rmath(data.e, data.a, data.b, data.d);
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_rexp(x, y) { /* regressão exponential */
		var coord = wd_coord_adjust(x, y);
		if (coord === null) return null;
		x = coord.x;
		y = coord.y;
		var val = wd_coord_least_squares(x, wd_coord_setter(y, Math.log));
		if (val === null) return null;
		var data = {};
		data.e = "y = (a)\u212F^(bx)";
		data.a = Math.exp(val.b);
		data.b = val.a;
		data.f = function(x) {return data.a*Math.exp(data.b*x);};
		data.d = wd_coord_deviation(y, wd_coord_setter(x, data.f));
		data.m = wd_coord_rmath(data.e, data.a, data.b, data.d);
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_rgeo(x, y) { /* regressão geométrica */
		var coord = wd_coord_adjust(x, y);
		if (coord === null) return null;
		x = coord.x;
		y = coord.y;
		var val = wd_coord_least_squares(
			wd_coord_setter(x, Math.log), wd_coord_setter(y, Math.log)
		);
		if (val === null) return null;
		var data = {};
		data.e = "y = (a)x^(b)";
		data.a = Math.exp(val.b);
		data.b = val.a;
		data.f = function(x) {return data.a*Math.pow(x, data.b);};
		data.d = wd_coord_deviation(y, wd_coord_setter(x, data.f));
		data.m = wd_coord_rmath(data.e, data.a, data.b, data.d);
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_rsum(x, y) { /* área embaixo da reta que une as coordenadas */
		var coord = wd_coord_adjust(x, y);
		if (coord === null) return null;
		x = coord.x;
		y = coord.y;
		/* -- integral ax+b = (yf+yi)(xf-xi)/2 -- */
		var int = 0;
		for (var i = 0; i < (coord.length - 1); i++)
			int += (y[i+1]+y[i])*(x[i+1]-x[i])/2;

		var data = {};
		data.e = "\u03A3y\u0394x \u2248 b";
		data.a = 0;
		data.b = int;
		data.f = function(z) {
			var i = 0;
			var n = null;
			while (n === null && ++i !== coord.length)
				if (z <= x[i]) n = i;
			if (n === null) n = coord.length-1;
			var line = wd_coord_rlin([x[n-1], x[n]], [y[n-1], y[n]]);
			return line === null ? null : line.f(z);
		}
		data.d = 0;
		data.m = wd_coord_rmath(data.e, data.a, data.b, data.d);
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_ravg(x, y) { /* calcula a média da área embaixo das retas que ligam os pontos */
		var sum = wd_coord_rsum(x, y);
		if (sum === null) return null
		var end = wd_coord_limits(x);
		var avg = sum.b / (end.max - end.min);
		var data = {};
		data.e = "(\u03A3y\u0394x)/\u0394x \u2248 b";
		data.a = 0;
		data.b = avg;
		data.f = function(x) {return data.b;};
		data.d = 0;
		data.m = wd_coord_rmath(data.e, data.a, data.b, data.d);
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_continuous(xcoord, func, delta) { /* retorna coordenadas (x,y) a partir de uma função de regressão */
		if (wd_vtype(func).type !== "function") return null;
		var ends = wd_coord_limits(xcoord);
		if (ends === null) return null;
		delta = wd_vtype(delta).value;
		if (!wd_finite(delta)) delta = (ends.max - ends.min)/xcoords.length;
		delta = Math.abs(delta);

		/* obtendo amostra */
		var x = [];
		while (ends.min < ends.max) {
			x.push(ends.min);
			ends.min += delta;
		}
		x.push(ends.max);

		var y = wd_coord_setter(x, func);
		var c = wd_coord_adjust(x, y);
		if (c === null) return null;
		return {x: c.x, y: c.y};
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_compare(x, y, list) { /* compara dados entre dois arrays x,y */
		if (wd_vtype(x).type !== "array" || wd_vtype(y).type !== "array")
			return null;
		/* organizando dados */
		var data = {};
		var sum  = 0;
		for (var i = 0; i < x.length; i++) {
			if (i > (y.length-1)) break;
			var vtype = wd_vtype(y[i]);
			if (vtype.type !== "number") continue
			var name = new String(x[i]).trim();
			if (name === "") name = "?";
			if (!(name in data)) {
				data[name] = {
					amt: vtype.value,
					occ: 1,
					avg: vtype.value,
				};
			} else {
				data[name].amt += vtype.value;
				data[name].occ++;
				data[name].avg = data[name].amt/data[name].occ;
			}
			sum += vtype.value;
		}
		/* obtendo outros dados */
		for (var name in data) {
			data[name].per = sum === 0 ? 0 : data[name].amt/sum;
		}
		if (list === true) {
			var obj = {sum: sum, x: [], amt: [], avg: [], occ:[], per: []};
			for (var i in data) {
				obj.x.push(i);
				for (var j in data[i]) obj[j].push(data[i][j]);
			}
			return obj;
		}
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_matrix_object(array) { /* matriz de array para objeto*/
		var x = [];
		for (var row = 1; row < array.length; row++) {
			var cols = array[row];
			x.push({});
			for (var col = 0; col < cols.length; col++) {
				x[row-1][array[0][col]] = array[row][col];
			}
		}
		return x;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_tag(elem) { /* retorna a tag do elemento em minúsculo */
		return elem.tagName.toLowerCase();
	}

/*----------------------------------------------------------------------------*/
	function wd_html_form(elem) { /* diz se o elemento é uma campo de formulário */
		var form = ["textarea", "select", "input"];
		return form.indexOf(wd_html_tag(elem)) < 0 ? false : true;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_form_type(elem) { /* retorna o tipo do campo de formulário */
		if (!wd_html_form(elem) && wd_html_tag(elem) !== "button") return null;
		var types = [
			"button", "reset", "submit", "image", "color", "radio",
			"checkbox", "date", "datetime", "datetime-local", "email",
			"text", "search", "tel", "url", "month", "number", "password",
			"range", "time", "week", "hidden", "file"
		];
		if ("type" in elem.attributes) { /* tipo digitado */
			var type = elem.attributes.type.value.toLowerCase();
			if (types.indexOf(type) >= 0) return type;
		}
		if ("type" in elem) { /* tipo definido */
			var type = elem.type.toLowerCase();
			if (types.indexOf(type) >= 0) return type;
		}
		return wd_html_tag(elem);
	}

/*----------------------------------------------------------------------------*/
	function wd_html_form_name(elem) { /* retorna o valor do atributo name do campo de formulário */
		if (wd_html_form_type(elem) === null) return null;
		var name = wd_vtype(elem.name);
		return name.type === "text" ? name.value : null;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_form_value(elem) { /* retorna o valor do atributo value do campo de formulário */
		var type = wd_html_form_type(elem);
		if (type === null) return null;
		var attr = wd_vtype(elem.value).value;
		if (type === "radio" || type === "checkbox")
			return elem.checked ? attr : null;
		if (type === "date")
			return attr.type === "date" ? wd_date_iso(attr) : null;
		if (type === "time")
			return attr.type === "time" ? wd_time_iso(attr) : null;
		if (type === "number" || type === "range")
			return attr.type === "number" ? attr : null;
		if (type === "file")
			return elem.files.length > 0 ? elem.files : null;
		if (type === "select") {
			value = [];
			for (var i = 0; i < elem.length; i++)
				if (elem[i].selected) value.push(e[i].value);
			return value.length === 0 ? null : value;
		}
		return attr;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_form_send(elem) { /* informa se os dados do campo de formulário podem ser enviados */
		if (wd_html_form_name(elem)  === null) return false;
		if (wd_html_form_value(elem) === null) return false;
		var noSend = ["submit", "button", "reset", "image"]; /* não submeter botões */
		return noSend.indexOf(wd_html_form_type(elem))>= 0 ? false : true;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_mask_attr(elem) { /* retorna o atributo para aplicação da máscara */
		var tag = wd_html_tag(elem);
		if (tag === "button" || tag === "option") return "textContent";
		var value = [
			"textarea", "button", "submit", "email", "text", "search",
			"tel", "url"
		];
		var type = wd_html_form_type(elem);
		if (value.indexOf(type) >= 0) return "value";
		return "textContent" in elem ? "textContent" : null;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_load_attr(elem) { /* retorna o atributo para carregar HTML em forma de texto */
		var tag = wd_html_tag(elem);
		if (tag === "button" || tag === "option") return "textContent";
		var value = [
			"textarea", "button", "reset", "submit", "email", "text",
			"search", "tel", "url", "hidden"
		];
		var type = wd_html_form_type(elem);
		if (value.indexOf(type) >= 0) return "value";
		return "innerHTML" in elem ? "innerHTML" : "textContent";
	}

/*----------------------------------------------------------------------------*/
	function wd_html_form_data(elem) { /* retorna um array de objetos {NAME|GET|POST} com os dados para envio em requisições */
		var form  = [];
		if (!wd_html_form_send(elem)) return form;
		var name  = wd_html_form_name(elem);
		var value = wd_html_form_value(elem);
		var type  = wd_html_form_type(elem);
		if (type === "file") {
			for (var i = 0; i < value.length; i++)
				form.push({
					NAME: i === 0 ? name : name+"_"+i, /*atributo nome*/
					GET:  encodeURIComponent(value[i].name), /*nome do arquivo*/
					POST: value[i] /*dados do arquivo*/
				});
			return form;
		}
		if (type === "select") {
			for (var i = 0; i < value.length; i++)
				form.push({
					NAME: i === 0 ? name : name+"_"+i,
					GET:  encodeURIComponent(value[i]),
					POST: value[i]
				});
			return form;
		}
		form.push({
			NAME: name,
			GET:  encodeURIComponent(value),
			POST: value
		});
		return form;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_dataset_notation(elem, attr) { /* transforma o conteúdo em formato especial do dataset em um array de objetos */
		var list = [{}];
		if (!(attr in elem.dataset)) return list;
		var key    = 0;
		var open   = 0;
		var name   = "";
		var value  = "";
		var object = false;
		var core   = new String(elem.dataset[attr]).trim().split("");
		for (var i = 0; i < core.length; i++) {
			if (core[i] === "{" && open === 0) {/*abrir captura do valor do atributo*/
				open++;
			} else if (core[i] === "}" && open === 1) {/*finalizar captura do valor do atributo*/
				open--;
				object = true;
				value  = value.trim();
				name   = name.trim();
				list[key][name] = value === "null" ? null : value;
				name  = "";
				value = "";
				if (core[i+1] === "&") {/*novo grupo*/
					list.push({});
					key++;
					i++;
				}
			} else if (open > 0) {/*capturando valor do atributo*/
				if (core[i] === "{") {open++;} else if (core[i] === "}") {open--;}
				value += core[i];
			} else {/*capturando nome do atributo*/
				name += core[i];
			}
		}
		return object ? list : (name.trim() === "null" ? [{value: null}] : [{value: name}]);
	}

/*----------------------------------------------------------------------------*/
	function wd_dom_run(method) { /* função vinculada ao construtor WDdom para executar rotina sobre os elementos */
		/* checando argumentos obrigatórios */
		if (wd_vtype(method).type !== "function") return null;
		/* obtendo argumentos secundários */
		var args = [null];
		for (var i = 1; i < arguments.length; i++)
			args.push(arguments[i]);
		/* looping nos elementos */
		var query = this.valueOf();
		for (var i = 0; i < query.length; i++) {
			var x = query[i];
			if (x !== window && x.nodeType !== 1 && x.nodeType !== 9) continue;
			/* informando elemento como primeiro argumento */
			args[0] = x;
			method.apply(null, args);
		}
		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_handler(elem, events, remove) { /* define ou remove disparadores */
		if (wd_vtype(elem).type !== "dom") return null;
		var action = remove === true ? "removeEventListener" : "addEventListener";
		for (var ev in events) {
			var method = events[ev];
			if (wd_vtype(method).type !== "function") continue;
			var event  = ev.toLowerCase().replace(/^on/, "");
			elem[action](event, method, false);
		}
		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_style(elem, styles) { /* define ou remove estilo ao elemento */
		if (styles === null) { /* limpando styles */
			while (elem.style.length > 0)
				elem.style[elem.style[0]] = null;
			return true;
		}

		if (wd_vtype(styles).type !== "object") return null;
		for (var i in styles) /* definindo styles */
			elem.style[wd_text_camel(i)] = styles[i];
		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_class(elem, value) { /* obtem/define o valor do atributo class */
		var val = elem.className;
		if (value === undefined) { /* obter valor do atributo */
			if (typeof val === "string") return val;
			val = elem.getAttribute("class");
			return val === null ? "" : val;
		}
		/* definir valor do atributo */
		if (typeof val === "string") return elem.className = value;
		return elem.setAttribute("class", value);
	}

/*----------------------------------------------------------------------------*/
	function wd_html_css(elem, obj) { /* manipula o atributo class por meio de um objeto com instruções */
		if (obj === null) return wd_html_class(elem, "");
		if (wd_vtype(obj).type !== "object") return null;
		var array = wd_no_spaces(wd_html_class(elem)).split(" ");

		for (var i in obj) {
			var val = wd_vtype(obj[i]);
			if (val.type !== "text") continue;
			val = wd_no_spaces(val.value).split(" ");
			if (i === "rpl" && val.length < 2) continue;

			if (i === "add") array = wd_array_add(array, val); else
			if (i === "del") array = wd_array_del(array, val); else
			if (i === "tgl") array = wd_array_tgl(array, val); else
			if (i === "rpl") array = wd_array_rpl(array, val[0], val[1]);
		}
		array = wd_array_sort(wd_array_unique(array)).join(" ");
		return wd_html_class(elem, wd_no_spaces(array));
	}

/*----------------------------------------------------------------------------*/
	function wd_html_data(elem, obj) { /* define atributos dataset no elemento a partir de um objeto */
		if (obj === null) {
			for (var i in elem.dataset)
				delete elem.dataset[i];
			return true;
		}
		if (wd_vtype(obj).type !== "object") return null;

		for (var i in obj) {
			if (wd_vtype(i).type !== "text") continue;
			var key = wd_text_camel(i);

			if (obj[i] === null) {
				delete elem.dataset[key];
			} else {
				elem.dataset[key] = obj[i];
				settingProcedures(elem, key);
			}
		}
		return;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_load(elem, text) {
		text = text === undefined || text === null ? "" : new String(text).toString();
		var attr = wd_html_load_attr(elem);
		elem[attr] = text;
		if (attr === "innerHTML") {
			var scripts = wd_vtype(wd_$$("script", elem)).value;
			for (var i = 0; i < scripts.length; i++) {
				var script = scripts[i].cloneNode(true);
				elem.removeChild(scripts[i]);
				elem.appendChild(script);
			}
		}
		loadingProcedures();
		return;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_repeat(elem, json) { /* clona elementos por array repetindo-os */
		if (wd_vtype(json).type !== "array") return null;

		var html = elem.innerHTML;

		if (html.search(/\{\{.+\}\}/gi) >= 0)
			elem.dataset.wdRepeatModel = html;
		else if ("wdRepeatModel" in elem.dataset)
			html = elem.dataset.wdRepeatModel;
		else
			return;

		elem.innerHTML = "";
		html = html.split("}}=\"\"").join("}}");
		for (var i = 0; i < json.length; i++) {
			var inner  = html;
			if (wd_vtype(json[i]).type !== "object") continue;
			for (var c in json[i]) inner = inner.split("{{"+c+"}}").join(json[i][c]);
			elem.innerHTML += inner;
		}
		loadingProcedures();
		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_nav(elem, action) { /* define exibições e inibições de elementos */
		action = new String(action).toLowerCase();

		if (action === "show")   return wd_html_css(elem, {del: "js-wd-no-display"});
		if (action === "hide")   return wd_html_css(elem, {add: "js-wd-no-display"});
		if (action === "toggle") return wd_html_css(elem, {tgl: "js-wd-no-display"});
		if (action === "prev" || action === "next") {
			var child = wd_vtype(elem.children).value;
			if (child.length === 0) return null;
			if (child.length === 1) return wd_html_nav(child[0], "toggle");
			var first = +Infinity;
			var last  = -Infinity;
			/* Procurando pelos filhos visíveis */
			for (var i = 0; i < child.length; i++) {
				var css  = wd_html_class(child[i]).split(" ");
				var show = css.indexOf("js-wd-no-display") < 0 ? true : false;
				if (show && i < first) first = i;
				if (show && i > last ) last  = i;
			}
			if (first === +Infinity) first = 0;
			if (last === +Infinity ) last  = child.length-1;
			/* definindo os próximos a serem exibidos */
			var next = last >= (child.length-1) ? 0 : last+1;
			var prev = first <= 0 ? child.length-1 : first-1;
			console.log("first:", first, "last:", last, "next:", next, "prev:", prev);
			return wd_html_nav(child[action === "prev" ? prev : next]);
		}
		if ((/^[0-9]+\:[0-9]+$/).test(action)) {
			var child = wd_vtype(elem.children).value;
			if (child.length === 0) return null;
			var value = action.split(":");
			var init = wd_vtype(value[0]).value;
			var end  = wd_vtype(value[1]).value;
			var show = end >= init ? true : false;
			for (var i = 0; i < child.length; i++) {
				if (i >= init && i <= end)
					wd_html_nav(child[i], (show ? "show" : "hide"));
				else
					wd_html_nav(child[i], (show ? "hide" : "show"));
			}
			return true;
		}
		/*default*/
		var bros = elem.parentElement.children;
		for (var i = 0; i < bros.length; i++)
			wd_html_nav(bros[i], (bros[i] === elem ? "show": "hide"));
		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_filter(elem, search, chars) { /* exibe somente o elemento que contenha o texto casado */
		chars = wd_finite(chars) && chars !== 0 ? wd_integer(chars) : 1;

		/*definindo valor de busca*/
		var vtype = wd_vtype(search);
		if (search === null || search === undefined)
			search = "";
		else if (vtype.type === "text")
			search = wd_text_clear(search).toUpperCase();
		else if (vtype.type !== "regexp")
			search = new String(search).toUpperCase();

		var child = wd_vtype(elem.children).value;
		for (var i = 0; i < child.length; i++) {
			if (!("textContent" in child[i])) continue;

			/* obtendo conteúdo do elemento */
			var content = wd_text_clear(child[i].textContent).toUpperCase();

			if (vtype.type === "regexp" && search.test(content))
				return wd_html_nav(child[i]);

			var found = content.indexOf(search) >= 0 ? true : false;
			var width = search.length;
			if (chars < 0) {
				wd_html_nav(child[i], (found && width >= -chars) ? "show" :  "hide");
			} else {
				wd_html_nav(child[i], (!found && width >= chars) ? "hide" :  "show");
			}
		};
		return;
	}
















/*----------------------------------------------------------------------------*/
	function wd_request_set(n) { /* define o número de requisições e decide sobre a janela modal */
		if (n > 0) {
			if (wd_request_counter === 0)
				document.body.appendChild(wd_modal_window);
			wd_request_counter++;
		} else {
			window.setTimeout(function () {
				wd_request_counter--;
				if (wd_request_counter < 1)
					document.body.removeChild(wd_modal_window);
			}, 250);
		}
		return wd_request_counter;
	}

/*----------------------------------------------------------------------------*/
	function wd_request(action, pack, callback, method, async) {
		/* ajustes iniciais */
		action = new String(action).toString();
		if (pack === undefined) pack = null;
		if (wd_vtype(callback).type !== "function") callback = null;
		method = method === undefined ? "POST" : method.toUpperCase();
		async  = async !== false ?  true : false;

		/* Chamando requisição e iniciando o tempo */
		var request = new XMLHttpRequest();
		var start   = new Date().valueOf();

		/* conjunto de dados a ser repassado para a função */
		var data = {
			target: action,
			request: request,  /* registra o objeto para requisições */
			closed:  false,    /* indica o término da requisição */
			status:  "UNSENT", /* UNSENT|OPENED|HEADERS|LOADING|UPLOADING|DONE|NOTFOUND|ABORTED|ERROR|TIMEOUT */
			total:   0,        /* registra o tamanho total do arquivo */
			loaded:  0,        /* registra o tamanho carregado na requisição */
			/* método para abortar */
			abort: function() {return set_data("ABORTED", true, 0, 0);},
			/* tempo decorrido desde o início da chamada (milisegundos)*/
			get time() {return (new Date()).valueOf() - start;},
			/* registra o andamento da requisição */
			get progress() {return this.total > 0 ? this.loaded/this.total : 1;},
			/* registra o conteúdo textual da requisição */
			get text() {try {return this.request.responseText;} catch(e){return null;}},
			/* registra o XML da requisição */
			get xml() {try {return this.request.responseXML;} catch(e){return null;}},
			/* registra o JSON da requisição */
			get json() {try {return wd_json(this.text);} catch(e){return null;}},
			/* transforma um arquivo CSV em ARRAY */
			get csv() {try {return wd_csv_array(this.text);} catch(e){return null;}},
		}

		/* disparadores */
		function set_data(status, closed, loaded, total) {
			if (data.closed) return;
			data.status = status;
			data.closed = closed;
			data.loaded = loaded;
			data.total  = total;

			/* barra de progresso */
			window.setTimeout(function() {
				return wd_request_progress.value = data.progress;
			}, 10);

			if (status === "ABORTED") request.abort();
			if (callback !== null)    callback(data);
		}

		function state_change(x) {
			if (request.readyState < 1) return;
			if (data.closed) return;
			if (data.status === "UNSENT") {
				data.status = "OPENED";
				wd_request_set(1);
			} else if (request.status === 404) {
				data.status = "NOTFOUND";
				data.closed = true;
			} else if (request.readyState === 2) {
				data.status = "HEADERS";
			} else if (request.readyState === 3) {
				data.status = "LOADING";
			} else if (request.readyState === 4) {
				data.closed = true;
				data.status = (request.status === 200 || request.status === 304) ? "DONE" : "ERROR";
			}
			if (callback !== null) callback(data);
			if (data.closed) wd_request_set(-1);
		}

		/* definindo disparador aos eventos */
		request.onprogress = function(x) {set_data("LOADING", false, x.loaded, x.total);}
		request.onerror    = function(x) {set_data("ERROR",   true, 0, 0);}
		request.ontimeout  = function(x) {set_data("TIMEOUT", true, 0, 0);}
		request.upload.onprogress  = function(x) {set_data("UPLOADING", false, x.loaded, x.total);}
		request.upload.onabort     = request.onerror;
		request.upload.ontimeout   = request.ontimeout;
		request.onreadystatechange = state_change;
		/* executando os comandos para a requisição */
		var vpack = wd_vtype(pack);
		/* se a requisição for do tipo GET */
		if (method === "GET" && vpack.type === "text") {
			var action = action.split("?");
			action    += action.length > 1 ? vpack.value : "?" + vpack.value;
			pack       = null;
		}
		/* tentar abrir a requisição */
		try {
			request.open(method, action, async);
		} catch(e) {
			set_data("ERROR", true, 0, 0)
			if (callback !== null) callback(data);
			return null;
		}
		/* se o método for POST */
		if (method === "POST" && pack.type === "text")
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		/* enviar requisição */
		request.send(pack);
		return true;
	}



















/* == BLOCO 2 ================================================================*/


/*----------------------------------------------------------------------------*/

	function WDsignal(input) {
		if (!(this instanceof WDsignal)) return new WDsignal(input);
		this._msg = input;
	}
	Object.defineProperty(WDsignal.prototype, "constructor", {value: WDsignal});

	/* Métodos estáticos ------------------------------------------------------*/
	WDsignal.window = document.createElement("DIV"); /*container das mensagens*/
	WDsignal.opened = false; /*container aberto?*/
	WDsignal.styled = false; /*container estilizado?*/

	WDsignal.cbase  = {position: "fixed", top: "0", right: "0", margin: "auto", zIndex: "999999"};
	WDsignal.cmicro = {left: "initial", width:  "33%"};
	WDsignal.cphone = {left: "0",       width: "100%"};

	WDsignal.msg = function(title, message) {
		var parent = this;

		/*Elementos da mensagem*/
		var box = {
			div: document.createElement("DIV"),
			hdr: document.createElement("HEADER"),
			btn: document.createElement("SPAN"),
			ttl: document.createElement("SPAN"),
			msg: document.createElement("SECTION")
		};

		/*Montagem*/
		box.div.appendChild(box.hdr);
		box.div.appendChild(box.msg);
		box.div.appendChild(box.btn);
		box.hdr.appendChild(box.ttl);

		/*Estilos*/
		var style = {
			div: {
				margin: "0.5em", position: "relative", padding: "0",
				border: "1px solid rgba(0, 0, 0, 0.6)", borderRadius: "0.2em",
				boxShadow: "1px 1px 6px rgba(0, 0, 0, 0.6)",
				backgroundColor: "rgba(255, 255, 255, 0.8)"
			},
			ttl: {fontWeight: "bold"},
			hdr: {padding: "0.5em", borderRadius: "inherit inherit 0 0"},
			msg: {padding: "0.5em", borderRadius: "0 0 inherit inherit"},
			btn: {cursor: "pointer", position: "absolute", top: "0.5em", right: "0.5em", lineHeight: "1"},

		};
		box.div.className = "js-wd-signal";

		for (var b in box)
			for (var s in style[b])
				box[b].style[s] = style[b][s];

		/*textos*/
		box.btn.textContent = "\u00D7";
		box.msg.innerHTML   = message;
		box.ttl.textContent = title === undefined ? "\u2139" : title;

		/*Disparadores*/
		box.btn.onclick = function() {
			box.div.parentElement.removeChild(box.div);
			parent.close();
			return;
		}

		window.setTimeout(function() {
			try {
				box.div.parentElement.removeChild(box.div);
				box.div.remove();
				parent.close();
			} catch(e) {}
			return;
		}, 9000);

		/*Incluir na janela*/
		this.open();
		this.window.insertAdjacentElement("afterbegin", box.div);
		return;
	}

	WDsignal.open = function() {
		if (!this.styled) {
			for (var i in this.cbase) this.window.style[i] = this.cbase[i];
			this.styled = true;
		}

		var style = wd_get_device() === "desktop" ? this.cmicro : this.cphone;
		for (var i in style) this.window.style[i] = style[i];

		if (!this.opened) document.body.appendChild(this.window);
		this.opened = true;
		return;
	}

	WDsignal.close = function() {
		if (!this.opened) return;
		if (this.window.children.length > 0) return;

		document.body.removeChild(this.window);
		this.opened = false;
		return;
	}

/* == BLOCO 3 ================================================================*/

/*----------------------------------------------------------------------------*/
	function WDmain(value) {
		Object.defineProperties(this, {
			_value:  {value: value, writable: true}
		});
	}

	Object.defineProperties(WDmain.prototype, {
		constructor: {value: WDmain},
		type:        {value: "unknown"},
		valueOf: {
			value: function() {
				try {return this._value.valueOf();} catch(e) {}
				return new Number(this._value).valueOf();
			}
		},
		toString: {
			value: function() {
				try {return this._value.toString();} catch(e) {}
				return new String(this._value).toString();
			}
		},
		send: {
			value: function (action, callback, method, async) {
				var pack = "value="+this.toString();
				if (this.type === "dom")    pack = this.form(method); else
				if (this.type === "number") pack = "value="+this.valueOf();
				return wd_request(action, pack, callback, method, async)
			}
		},
	});

	Object.defineProperty(WDmain.prototype, "signal", {/*renderizar mensagem*/

		value: function(title) {
			WDsignal.msg(title, this.toString());
			return this.type === "dom" ? this : null;
		}
	});

	Object.defineProperty(WDmain.prototype, "notify", {/*renderizar notificação*/

		value: function(title) {
			if (!("Notification" in window))
				return this.signal(title);
			if (Notification.permission === "denied")
				return this.type === "dom" ? this : null;
			var content = this.toString();
			if (Notification.permission === "granted")
				new Notification(title, {body: content});
			else
				Notification.requestPermission().then(function(x) {
					if (x === "granted")
						new Notification(title, {body: content});
				});
			return this.type === "dom" ? this : null;
		}
	});

	Object.defineProperty(WDmain.prototype, "finite", {/*informa se é um número é finito*/

		get: function() {
			if (this.type !== "number") return false;
			return this.abs !== Infinity ? true : false;
		}
	});

/*----------------------------------------------------------------------------*/
	function WDundefined(value) {WDmain.call(this, value);}

	WDundefined.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDundefined},
		type:        {value: "undefined"},
		valueOf:     {value: function() {return Infinity;}},
		toString:    {value: function() {return "?";}}
	});

/*----------------------------------------------------------------------------*/
	function WDnull(value) {WDmain.call(this, value);}

	WDnull.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnull},
		type:        {value: "null"},
		valueOf:     {value: function() {return 0;}},
		toString:    {value: function() {return "";}}
	});

/*----------------------------------------------------------------------------*/
	function WDboolean(value) {WDmain.call(this, value);}

	WDboolean.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDboolean},
		type:        {value: "boolean"},
		valueOf:     {value: function() {return this._value ? 1 : 0;}},
		toString:    {value: function() {return this._value ? "True" : "False";}}
	});

/*----------------------------------------------------------------------------*/
	function WDfunction(value) {WDmain.call(this, value);}

	WDfunction.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDfunction},
		type:        {value: "function"},
	});

/*----------------------------------------------------------------------------*/
	function WDobject(value) {WDmain.call(this, value);}

	WDobject.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDobject},
		type:        {value: "object"},
		toString:    {value: function() {return wd_json(this._value);}}
	});

/*----------------------------------------------------------------------------*/
	function WDregexp(value) {WDmain.call(this, value);}

	WDregexp.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDregexp},
		type:        {value: "regexp"},
		toString:    {value: function() {return this._value.source;}}
	});

/*----------------------------------------------------------------------------*/
	function WDtext(value) {WDmain.call(this, value);}

	WDtext.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDtext},
		type:        {value: "text"},
		upper: { /* retorna valor em caixa alta */
			get: function() {return this.toString().toUpperCase();}
		},
		lower: { /* retorna valor em caixa baixa */
			get: function() {return this.toString().toLowerCase();}
		},
		caps: { /* retorna valor capitulado */
			get: function() {return wd_text_caps(this.toString());}
		},
		toggle: { /* inverte caixa */
			get: function() {return wd_text_toggle(this.toString());}
		},
		clear: { /* remove acentos da string */
			get: function() {return wd_text_clear(this.toString());}
		},
		camel: { /* transforma string para inicioMeioFim */
			get: function() {return wd_text_camel(this.toString());}
		},
		dash: { /* transforma string para inicio-meio-fim */
			get: function() {return wd_text_dash(this.toString());}
		},
		csv: { /* CSV para Matriz */
			get: function() {return wd_csv_array(this.toString());}
		},
		trim: { /* remove múltiplos espaços */
			get: function() {return wd_no_spaces(this.toString());}
		},
		json: { /* JSON para Object */
			get: function() {return wd_json(this.toString());}
		},
		rpl: { /* replaceAll simples (só texto) */
			value: function(search, change) {
				return wd_replace_all(this.toString(), search, change);
			}
		},
		mask: { /* máscaras temáticas */
			value: function(check, callback) {
				return wd_multiple_masks(this.toString, check, callback);
			}
		},
		format: { /*aplica atributos múltiplos*/
			value: function() {
				return wd_apply_getters(this, Array.prototype.slice.call(arguments));
			}
		},

	});

/*----------------------------------------------------------------------------*/
	function WDnumber(value) {WDmain.call(this, value);}

	WDnumber.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnumber},
		type:        {value: "number"},
		int: { /* retorna a parte inteira */
			get: function() {return wd_integer(this.valueOf());}
		},
		decimal: { /* retorna a parte decimal */
			get: function() {return wd_decimal (this.valueOf());}
		},
		abs: { /* retorna a parte decimal */
			get: function() {return Math.abs(this.valueOf());}
		},
		ntype: { /* retorna o tipo de número */
			get: function() {return wd_num_type(this.valueOf());}
		},
		frac: { /* representação em fração (2 casas) */
			get: function () {return wd_num_frac(this.valueOf());}
		},
		byte: { /* retorna notação para bytes */
			get: function () {return wd_bytes(this.valueOf());}
		},
		str: { /* retorna string simplificada do número */
			get: function() {return wd_num_str(this.valueOf());}
		},
		test: { /* testa se o tipo de número se enquadra em alguma categoria */
			value: function() {
				return wd_num_test(this.valueOf(), Array.prototype.slice.call(arguments));
			}
		},
		round: { /* arredonda número para determinado tamanho */
			value: function(width) {
				return wd_num_round(this.valueOf(), width);
			}
		},
		pow10: { /* transforma número em notação científica */
			value: function(width) {
				return wd_num_pow10(this.valueOf(), width);
			}
		},
		locale: { /* notação numérica local */
			value: function(currency) {
				return wd_num_local(this.valueOf(), currency);
			}
		},
		fixed: { /* fixa quantidade de dígitos (int e dec) */
			value: function(ldec, lint) {
				return wd_num_fixed(this.valueOf(), ldec, lint);
			}
		},
		toString: { /* método padrão */
			value: function() {
				return this.test("infinity") ? this.str : this.valueOf().toString();
			}
		},
	});

/*----------------------------------------------------------------------------*/
	function WDtime(value) {WDmain.call(this, value);}

	WDtime.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDtime},
		type:        {value: "time"},
		h: { /* define/obtem a hora */
			get: function() {return wd_number_time(this.valueOf()).h;},
			set: function(x) {
				if (wd_finite(x))
					this._value = wd_time_number(wd_integer(x), this.m, this.s);
			}
		},
		hour: {
			get: function()  {return this.h;},
			set: function(x) {return this.h = x;}
		},
		m: { /* define/obtem o minuto */
			get: function() {return wd_number_time(this.valueOf()).m;},
			set: function(x) {
				if (wd_finite(x))
					this._value = wd_time_number(this.h, wd_integer(x), this.s);
			}
		},
		minute: {
			get: function()  {return this.m;},
			set: function(x) {return this.m = x;}
		},
		s: { /* define/obtem o segundo */
			get: function() {return wd_number_time(this.valueOf()).s;},
			set: function(x) {
				if (wd_finite(x))
					this._value = wd_time_number(this.h, this.m, wd_integer(x));
			}
		},
		second: {
			get: function()  {return this.s;},
			set: function(x) {return this.s = x;}
		},
		h12: { /* Retorna a hora no formato ampm */
			get: function() {return wd_time_ampm(this.h, this.m);},
		},
		format: { /* formata saída string */
			value: function(str) {
				return wd_time_format(this, str);
			}
		},
		toString: { /* método padrão */
			value: function() {return wd_time_iso(this.valueOf());}
		}

	});

/*----------------------------------------------------------------------------*/
	function WDdate(value) {WDmain.call(this, value);}

	WDdate.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDdate},
		type:        {value: "date"},
		y: { /* ano */
			get: function() {return this._value.getFullYear();},
			set: function(x) {
				if (wd_finite(x) && x >= 0)
					this._value = wd_set_date(this._value, undefined, undefined, wd_integer(x));
			}
		},
		m: { /* mês */
			get: function() {return this._value.getMonth() + 1;},
			set: function(x) {
				if (wd_finite(x))
					this._value = wd_set_date(this._value, undefined, wd_integer(x), undefined);
			}
		},
		d: { /* dia */
			get: function() {return this._value.getDate();},
			set: function(x) {
				if (wd_finite(x))
					this._value = wd_set_date(this._value, wd_integer(x), undefined, undefined);
			}
		},
		year: {
			get: function()  {return this.y;},
			set: function(x) {return this.y = x;}
		},
		month: {
			get: function()  {return this.m;},
			set: function(x) {return this.m = x;}
		},
		day: {
			get: function()  {return this.d;},
			set: function(x) {return this.d = x;}
		},
		length: {/*dias no ano*/
			get: function() {return wd_is_leap(this.y) ? 366 : 365;}
		},
		shortMonth: { /* mês abreviado */
			get: function() {return wd_date_locale(this._value, {month: "short"});}
		},
		longMonth: { /* nome do mês */
			get: function() {return wd_date_locale(this._value, {month: "long"});}
		},
		shortDay: { /* dia abreviado */
			get: function() {return wd_date_locale(this._value, {weekday: "short"});}
		},
		longDay: { /* nome do dia */
			get: function() {return wd_date_locale(this._value, {weekday: "long"});}
		},
		today: { /* dia da semana [1-7] */
			get: function() {return this._value.getDay() + 1;}
		},
		size: { /* quantidade de dias no mês */
			get: function() {return wd_date_size(this.m, this.y);}
		},
		workingYear: { /* dias úteis no ano */
			get: function() { return wd_date_working(this.y, this.length);}
		},
		working: { /* dias úteis até o momento */
			get: function() { return wd_date_working(this.y, this.days);}
		},
		days: { /*dias transcorridos no ano*/
			get: function() {return wd_date_days(this.y, this.m, this.d);}
		},
		week: {/*semana cheia do ano*/
			get: function(days, today) {return wd_date_week(this.days, this.today);}
		},
		format: { /* formata saída string */
			value: function(str) {
				return wd_date_format(this, str);
			}
		},
		toString: { /* método padrão */
			value: function() {
				return wd_date_iso(this._value);
			}
		},
		valueOf: { /* método padrão */
			value: function() {
				return (this._value < 0 ? -1 : 0) + wd_integer(this._value/86400000);
			}
		},
	});

/*----------------------------------------------------------------------------*/








/*----------------------------------------------------------------------------*/
	function wd_svg_create(type, attr) { /* cria elementos SVG genéricos com medidas relativas */
		if (attr === undefined) attr = {};
		/* Propriedades a serem definidas em porcentagem */
		var ref  = [
			"x", "y", "x1", "x2", "y1", "y2", "height", "width", "cx", "cy", "r", "dx", "dy"
		];

		var elem = document.createElementNS("http://www.w3.org/2000/svg", type);

		for (var i in attr) {/* definindo atributos */
			var val = attr[i];
			if (i === "tspan" || i === "title") {/* texto ou dicas */
				if (val !== null) {
					var info = wd_svg_create(i);
					info.textContent = val;
					elem.appendChild(info);
				}
			} else { /* atributos */
				if (ref.indexOf(i) >= 0 && wd_finite(val))
					val = new String(val).toString()+"%";
				elem.setAttribute(i, val);
			}
		}
		return elem;
	}

/*----------------------------------------------------------------------------*/
	function wd_svg_dots(cx, cy, r, title, color) { /* cria pontos: coordenada no centro */
		if (color === undefined) color = "#000000";
	 	return wd_svg_create("circle", {
			cx: cx, cy: cy, r: r, fill: color, title: title
		});
	}

/*----------------------------------------------------------------------------*/
	function wd_svg_line(x1, y1, x2, y2, width, title, color) { /* cria linhas: coordenadas no início e fim */
		if (color === undefined) color = "#000000";
		return wd_svg_create("line", {
			x1: x1, y1: y1, x2: x2, y2: y2,
			stroke: color,
			"stroke-width":     width === 0 ? "1px" : width+"px",
			"stroke-dasharray": width === 0 ? "1,5" : "0",
			title: title
		});
	}

/*----------------------------------------------------------------------------*/
	function wd_svg_rect(x1, y1, x2, y2, title, color) { /* cria retângulos: coordenadas nos cantos opostos */
		if (color === undefined) color = "#000000";
		return wd_svg_create("rect", {
			x:       x2 > x1 ? x1 : x2,
			y:       y2 > y1 ? y1 : y2,
			width:   x2 > x1 ? x2-x1 : x1-x2,
			height:  y2 > y1 ? y2-y1 : y1-y2,
			fill:    color,
			title:   title,
			opacity: 0.8,
		});
	}

/*----------------------------------------------------------------------------*/
	function wd_svg_label(x, y, text, point, vertical, color, bold) { /* cria textos: coordenadas na âncora (point) */
		if (color === undefined) color = "#000000";
		var vanchor = ["start", "middle", "end"];
		var vbase   = ["auto", "middle", "hanging"];
		var anchor  = {n: 1, ne: 2, e: 2, se: 2, s: 1, sw: 0, w: 0, nw: 0, c: 1};
		var base    = {n: 2, ne: 2, e: 1, se: 0, s: 0, sw: 0, w: 1, nw: 2, c: 1};
		point       = point in base ? point : "c" ;
		return wd_svg_create("text", {
			x: x, y: y,
			fill: color,
			"text-anchor": vanchor[anchor[point]],
			"dominant-baseline": vbase[base[point]],
			"font-size": "0.8em",
			"font-family": "monospace",
			"transform": vertical === true ? "rotate(270)" : "",
			"font-weight": bold === true ? "bold" : "normal",
			tspan: text,
		});
	}












/*----------------------------------------------------------------------------*/
	function WDchart(box, title) {/*Objeto para criar gráficos*/
		this.box   = box;
		this.title = title;
		this.data  = [];
		this.color = 0;
	};

	Object.defineProperties(WDchart.prototype, {
		boot: {
			value: function () {
				this.svg    = null;
				this.xscale = 1;
				this.yscale = 1;
				this.xmin   = Infinity;
				this.xmax   = -Infinity;
				this.ymin   = Infinity;
				this.ymax   = -Infinity;
				this.padd   = {t: 0, r: 0, b: 0, l: 0};
				this.color = 0;
				this.legend = 0;
				this.print  = 0;
				this.box.className = "";
				this.box.style = null;
				this.box.style.paddingTop = new String(100 * this._RATIO).toString()+"%";//TODO
				this.box.style.position   = "relative";
				var child = this.box.children;
				while (child.length > 0) this.box.removeChild(child[0]);
			}
		},

		ratio: {/* Relação altura/comprimento do gráfico (igual a da tela) *///FIXME: no celular fica esquisito (altura maior que largura)
			value: window.screen.height > window.screen.width ? 1 : window.screen.height/window.screen.width
		},

		space: { /* define e obtem os espaços do gráfico a partir do padding */
			set: function(x) {
				for (var i in x) this.padd[i] = x[i];
			},
			get: function() {
				var padd = this.padd;
				return {
					t: padd.t,
					r: 100-padd.r,
					b: 100-padd.b,
					l: padd.l,
					w: 100-(padd.l+padd.r),
					h: 100-(padd.t+padd.b),
					cx: padd.l+(100-(padd.l+padd.r))/2,
					cy: padd.t+(100-(padd.t+padd.b))/2,

				}
			}
		},
		rgb: { /* retorna uma cor a partir de um número */
			value: function(n) {
				if (n === undefined) n = this.color;
				var ref = n <= 0 ? 0 : (2*n+1)%7+1; /* 2,4,6,1,3,5,7,2...*/
				var val = wd_num_fixed(ref, 0, 3).split("");
				val.forEach(function(e,i,a){a[i] = 153*Number(e);});
				return "rgb("+val[0]+","+val[1]+","+val[2]+")";
			}
		},


		_DELTA: {/* Devolve a menor partícula em X */
			value: function(x) {
				return (x <= 0 ? 1 : x)/this._SCALE.x;
			}
		},

		_TARGET: {/* Transforma coordanadas reais em relativas (%) */
			value: function(x,y) {
				if (!WD(x).finite || !WD(y).finite) return null;
				x = x - this._ENDS.x.min;
				y = y - this._ENDS.y.min;
				var msrs = this._MEASURES;
				return {
					x: msrs.l + x*this._SCALE.x,
					y: msrs.b - y*this._SCALE.y,
				};
			}
		},
		_ADD_LEGEND: { /* Adiciona Legendas (texto e funções)*/
			value: function(text, top) {
				if (text === null) return;
				var ref = this._MEASURES;
				var n = this._NDATA[(top ? "t" : "r")]++;
				var x = top ? ref.l : ref.r;
				var y = 4*n+ref.t;
				this._BUILD_LABEL(x+1, y+1, (top ? "" : "\u25CF ")+text, "nw", false, true);
			}
		},
		ends: {
			value: function(axis, array) {
				var axes = {
					x: {min: "xmin", max: "xmax"},
					y: {min: "ymin", max: "ymax"},
				};
				array = array.slice();
				array.push(this[axes[axis].min]);
				array.push(this[axes[axis].max]);
				var limits = wd_coord_limits(array);
				this[axes[axis].min] = limits.min;
				this[axes[axis].max] = limits.max;
			}
		},
		scale: {/* Define o valor da escala horizontal e vertical e retorna o menor fragmento do eixo (delta) */
			value: function(axis) {
				var width = this.space[axis === "x" ? "w" : "h"];
				var delta = this[axis+"max"] - this[axis+"min"];
				this[axis+"scale"] = width/delta;
				return 1/this[axis+"scale"];
			}
		},

		pdata: { /* prepara os dados da plotagem (plano x,y) */
			get: function() {
				var array = [];
				/* obtendo somente os dados de plotagem solicitado */
				for (var i = 0; i < this.data.length; i++) {
					var data = this.data[i];
					if (data.t === "compare") continue;
					this.ends("x", data.x);
					if (data.f !== true) this.ends("y", data.y);
					array.push(data);
				}
				/* definindo a escala em x */
				this.space = {t: 10, r: 20, b: 10, l: 15};
				var delta  = this.scale("x");
				/* definindo valores de funções */
				for (var i = 0; i < array.length; i++) {
					var data = array[i];
					if (data.f !== true) continue;
					var values = wd_coord_continuous(data.x, data.y, data.t === "cols" ? 0.1 : delta);
					if (values === null) continue;
					array[i].x = values.x;
					array[i].y = values.y;
					this.ends("y", values.y);
				}
				/* definindo a escala em y e retornando */
				this.scale("y");
				return array;
			}
		},
		area: { /* prepara os dados da plotagem (plano x,y) */
			value: function(xlabel, ylabel, n, compare) {
				/* criando imagem svg */
				this.svg = wd_svg_create("svg", {fill: "red"});
				this.svg.setAttribute("class", "js-wd-plot");


				var ref = this.space;
				var clr = this.rgb(0);
				var dx  = ref.w/n;
				var dy  = ref.h/n;

				/* construindo linhas */
				for (var i = 0; i < (n+1); i++) {
					var x1, y1, x2, y2, dash;

					dash = (i === 0 || i === n) && compare !== true ? 1 : 0;
					/* eixo vertical */
					x1 = ref.l+i*dx;
					x2 = x1;
					y1 = ref.t;
					y2 = y1+ref.h;
					this.svg.appendChild(
						wd_svg_line(x1, y1, x2, y2, dash, null, clr)
					);
					/* eixo horizontal */
					x1 = ref.l;
					x2 = x1+ref.w;
					y1 = ref.t+ref.h-i*dy;
					y2 = y1;
					this.svg.appendChild(
						wd_svg_line(x1, y1, x2, y2, dash, null, clr)
					);
				}
				/* Título e labels */
					this.svg.appendChild(
						wd_svg_label(ref.l+ref.w/2, 1, this.title, "n", false, clr, true)
					);
					this.svg.appendChild(
						wd_svg_label(ref.cx, 99, xlabel, "s", false, clr, false)
					);
					this.svg.appendChild(//FIXME
						wd_svg_label(-ref.cy, 1, ylabel, "n", true, clr, false)
					);



			}
		},

		cdata: { /* prepara dados de plotagem para "compare" */
			get: function() {
				return [];
			}
		},
		plot: {
			value: function(xlabel, ylabel, compare) { /* desenha gráfico plano */
				this.boot();
				var data = compare === true ? this.cdata : this.pdata;
				this.area(xlabel, ylabel, (compare === true ? data.length : 4), compare);
				this.box.appendChild(this.svg)


				/* Plotagem da área e das linhas
				var lines = 4;
				var grid  = this._SET_AREA("plan", lines, xlabel, ylabel);

				for (var i = 0; i < data.length; i++) {
					var item = data[i];
					this._COLOR = item.c;
					this._ADD_LEGEND(item.l, item.f);

					/*coordenadas
					for (var j = 0; j < item.x.length; j++) { /*obterndo coordenadas
						var title = "("+item.x[j]+", "+item.y[j]+")";
						var trg1  = this._TARGET(item.x[j], item.y[j]);
						var trg2  = this._TARGET(item.x[j+1], item.y[j+1]);
						var zero  = this._TARGET(item.x[j], 0);

						if (item.t === "dots")
							this._BUILD_DOTS(trg1.x, trg1.y, title);
						if (item.t === "dotted")
							this._BUILD_DOTS(trg1.x, trg1.y, title, 1);
						if (item.t === "line" && trg2 !== null)
							this._BUILD_LINE(trg1.x, trg1.y, trg2.x, trg2.y, title, 2);
						if (item.t === "cols" && trg2 !== null)
							this._BUILD_RECT(trg1.x, (trg2.y+trg1.y)/2, trg2.x, zero.y, title, true);
					}
				}

				/*valores dos eixos
				this._COLOR = - 1;
				var dX = (this._ENDS.x.max - this._ENDS.x.min) / lines;
				var dY = (this._ENDS.y.max - this._ENDS.y.min) / lines;
				for (var i = 0; i < grid.x.length; i++) {
					var x  = this._LABEL_VALUE(this._ENDS.x.min + i*dX);
					var y  = this._LABEL_VALUE(this._ENDS.y.min + i*dY);
					var px = i === 0 ? "nw" : (i === lines ? "ne" : "n");
					var py = i === 0 ? "se" : (i === lines ? "ne" : "e");
					this._BUILD_LABEL(grid.x[i].x, grid.x[i].y+1, x, px);
					this._BUILD_LABEL(grid.y[i].x-1, grid.y[i].y, y, py);
				}
				*/
				return true;
			}
		},



		add: {/* Adiciona conjunto de dados para plotagem */
			value: function(x, y, label, type) {

				if (wd_vtype(y).type === "function") {
					var data = wd_coord_adjust(x);
					if (data === null) return false;
					this.data.push(
						{x: data.x, y: y, l: label, t: "line", f: true, c: ++this.color}
					);
					return true;
				}

				if (type === "compare") {
					var data = wd_coord_compare(x, y, true);
					if (data === null) return false;
					this.data.push(
						{x: data.x, y: data.amt, l: label, t: "compare", f: false, c: null}
					);
					return true;
				}

				var coord = wd_coord_adjust(x, y);
				if (coord === null) return false;
				x = coord.x;
				y = coord.y;

				var ref = {
					avg: {c1: "line", c2: "line", c3: null,   m: wd_coord_ravg},
					sum: {c1: "line", c2: "cols", c3: null,   m: wd_coord_rsum},
					exp: {c1: "dots", c2: "line", c3: "dash", m: wd_coord_rexp},
					lin: {c1: "dots", c2: "line", c3: "dash", m: wd_coord_rlin},
					geo: {c1: "dots", c2: "line", c3: "dash", m: wd_coord_rgeo},
				};

				if (type in ref) {
					var data = ref[type].m(x, y);
					if (data === null) return false;
					this.data.push(
						{x: x, y: y, l: label, t: ref[type].c1, f: false, c: ++this.color}
					);
					this.data.push(
						{x: x, y: data.f, l: data.m, t: ref[type].c2, f: true, c: ++this.color}
					);
					if (data.d !== 0) {
						var sup = function(n) {return data.f(n)+data.d;}
						var sub = function(n) {return data.f(n)-data.d;}
						this.data.push(
							{x: x, y: sup, l: null, t: ref[type].c3, f: true, c: this.color}
						);
						this.data.push(
							{x: x, y: sub, l: null, t: ref[type].c3, f: true, c: this.color}
						);
					}
					return true;
				}

				this.data.push(
					{x: x, y: y, l: label, t: "line", f: false, c: ++this.color}
				);
				this.data.push(
					{x: x, y: y, l: null, t: "dots", f: false, c: this.color}
				);
				return true;
			}
		},
	});































	function WDarray(value) {WDmain.call(this, value);}

	WDarray.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDarray},
		type:        {value: "array"},
		unique: { /* remove itens repetidos */
			get: function() {return wd_array_unique(this.valueOf());}
		},
		sort: { /* ordena items */
			get: function() {return wd_array_sort(this.valueOf());}
		},
		item: { /* retorna o índice especificado ou seu comprimento */
			value: function(i) {
				return wd_array_item(this.valueOf(), i);
			}
		},
		check: { /* informa se o array contem os valores */
			value: function() {
				return wd_array_check(this.valueOf(), Array.prototype.slice.call(arguments));
			}
		},
		search: { /* procura item no array e retorna os índices localizados */
			value: function(value) {
				return wd_array_search(this.valueOf(), value);
			}
		},
		del: { /* retorna um array sem os valores informados */
			value: function() {
				return wd_array_del(this.valueOf(), Array.prototype.slice.call(arguments));
			}
		},
		add: { /* adiciona items ao array */
			value: function() {
				return wd_array_add(this.valueOf(), Array.prototype.slice.call(arguments));
			}
		},
		tgl: { /* alterna a existência de valores do array */
			value: function() {
				return wd_array_tgl(this.valueOf(), Array.prototype.slice.call(arguments));
			}
		},
		count: { /* retorna a quantidade de vezes que o item aparece */
			value: function(value) {
				return wd_array_count(this.valueOf(), value);
			}
		},
		rpl: { /* muda os valores de determinado item */
			value: function(item, value) {
				return wd_array_rpl(this.valueOf(), item, value);
			}
		},
		cell: { /* retorna uma lista de valores a partir de endereços de uma matriz do tipo linha:coluna */
			value: function() {
				return wd_array_cells(this.valueOf(), Array.prototype.slice.call(arguments));
			}
		},
		data: { /* obtem dados estatísticos a partir dos itens do array/matriz */
			value: function(x, y) {
				return wd_matrix_data(this.valueOf(), x, y);
			}
		},
		toString: { /* método padrão */
			value: function() {
				return wd_json(this.valueOf());
			}
		},
		valueOf: { /* método padrão */
			value: function() {
				return this._value.slice();
			}
		}

	});

/*----------------------------------------------------------------------------*/
	function WDdom(value) {WDmain.call(this, value);}

	WDdom.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDdom},
		type:        {value: "dom"},
		valueOf: { /* método padrão */
			value: function() {
				return this._value.slice();
			}
		},
		item: { /* retorna o item ou quantidade */
			value: function(i) {
				return wd_array_item(this.valueOf(), i);
			}
		},
		run: { /* executa um job nos elementos */
			value: function(method) {
				wd_dom_run.apply(this, arguments); return this;
			}
		},
		addHandler: { /* adiciona disparadores */
			value: function(events) {
				return this.run(wd_html_handler, events);
			}
		},
		delHandler: { /* remove disparadores */
			value: function(events) {
				return this.run(wd_html_handler, events, true);
			}
		},
		style: { /* remove disparadores */
			value: function(styles) {
				return this.run(wd_html_style, styles);
			}
		},
		css: { /* manipula atributo class */
			value: function(obj) {
				return this.run(wd_html_css, obj);
			}
		},
		data: { /* manipula atributo dataset */
			value: function(obj) {
				return this.run(wd_html_data, obj);
			}
		},
		load: { /* carrega elementos HTML em forma de texto */
			value: function(text) {
				return this.run(wd_html_load, text);
			}
		},
		repeat: {  /* clona elementos por array repetindo-os */
			value: function(json) {
				return this.run(wd_html_repeat, json);
			}
		},
		nav: {  /* define exibições e inibições de elementos */
			value: function(action) {
				return this.run(wd_html_nav, action);
			}
		},
		filter: {  /* exibe somente o elemento que contenha o texto casado */
			value: function(search, chars) {
				return this.run(wd_html_filter, search, chars);
			}
		},
		set: {  /* define atributos/funcões no elemento */
			value: function(attr, val) {
				return this.run(wd_html_set, attr, val);
			}
		},
		page: {  /* exibe determinados grupos de elementos filhos */
			value: function(page, size) {
				return this.run(wd_html_page, page, size);
			}
		},
		sort: { /* ordena elementos filho pelo conteúdo */
			value: function(order, col) {
				return this.run(wd_html_sort, order, col);
			}
		},
		full: { /* deixa o elemento em tela cheia (só primeiro elemento) */
			value: function(exit) {
				return wd_html_full(this._value[0], exit);
			}
		},
		form: { /* obtém serialização de formulário */
			value: function(get) {
				return wd_html_form_submit(this._value, get);
			}
		},
		vstyle: {  /* devolve o valor do estilo especificado (só primeiro elemento) */
			value: function(css) {
				return wd_html_style_get(this._value[0], css);
			}
		},




		tag: {  /* devolve o nome do elemento em minúsculo (só primeiro elemento) */
			get: function(css) {return wd_html_tag(this._value[0]);}
		},
		table: {  /* transforma os dados de uma tabela (table) em matriz */
			get: function(css) {return wd_html_table_array(this._value[0]);}
		},

	});
 /*  */

/*----------------------------------------------------------------------------*/
	function wd_html_set(elem, attr, val) { /* define atributos/funcões no elemento */
		var args = [];
		for (var i = 2; i < arguments.length; i++)
			args.push(arguments[i]);
		if (wd_vtype(elem[attr]).type === "function")
			return elem[attr].apply(elem, args);
		if (attr in elem)
			try {return elem[attr] = val;} catch(e) {}
		return elem.setAttribute(attr, val);
	}

/*----------------------------------------------------------------------------*/
	function wd_html_full(elem, exit) { /* deixa o elemento em tela cheia */
		var action = {
			open: ["requestFullscreen", "webkitRequestFullscreen", "msRequestFullscreen"],
			exit: ["exitFullscreen", "webkitExitFullscreen", "msExitFullscreen"]
		};
		var full   = exit === true ? action.exit : action.open;
		var target = exit === true ? document : elem;
		for (var i = 0; i < full.length; i++) {
			if (full[i] in target)
				try {return target[full[i]]();} catch(e) {}
		}
		return null;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_page(elem, page, size) { /* exibe determinados grupos de elementos filhos */
		var lines  = wd_vtype(elem.children).value;
		if (lines.length === 0) return null;
		page = wd_vtype(page).value;
		size = wd_vtype(size).value;
		if (!wd_finite(page) || !wd_finite(size)) return null;

		if (size <= 0) /* toda a amostra */
			size = lines.length;
		else if (size < 1) /* uma fração da amostra */
			size = wd_integer(size*lines.length);
		else /* padrão */
			size = wd_integer(size);

		if (size === lines.length) /* toda a amostra */
			page = 0;
		else if (page < 0) /* última página */
			page = wd_integer(lines.length/size);
		else /* padrão */
			page = wd_integer(page);

		var start = page*size;
		var end   = start+size-1;
		return wd_html_nav(elem, ""+start+":"+end+"");
	}

/*----------------------------------------------------------------------------*/
	function wd_html_sort(elem, order, col) { /* ordena elementos filho pelo conteúdo */
		order = wd_finite(order) ? wd_integer(order) : 1;
		col   = wd_finite(col)   ? wd_integer(col, true) : null;

		var children = wd_vtype(elem.children).value;
		var aux = [];

		for (var i = 0; i < children.length; i++) {
			if (col === null)
				aux.push(children[i]);
			else if (children[i].children[col] !== undefined)
				aux.push(children[i].children[col]);
		}

		var sort = wd_array_sort(aux);
		if (order < 0) sort = sort.reverse();
		for (var i = 0; i < sort.length; i++)
			elem.appendChild(col === null ? sort[i] : sort[i].parentElement);

		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_style_get(elem, css) { /* devolve o valor do estilo especificado */
		var style = window.getComputedStyle(elem, null);
		return css in style ? style.getPropertyValue(css) : null;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_table_array(elem) { /* transforma os dados de uma tabela (table) em matriz */
		var tag = wd_html_tag(elem);
		if (["tfoot", "tbody", "thead", "table"].indexOf(tag) < 0) return null;
		var data = [];
		var rows = elem.rows;
		for (var row = 0; row < rows.length; row++) {
			var cols = wd_vtype(rows[row].children).value;
			if (data[row] === undefined) data.push([]);
			for (var col = 0; col < cols.length; col++) {
				if (data[row][col] === undefined) data[row].push([]);
				data[row][col] = wd_vtype(cols[col].textContent).value;
			}
		}
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_form_submit(list, get) { /* obtém serialização de formulário */
		list = wd_vtype(list).value;
		var pkg = get === true ? [] : new FormData();
		for (var e = 0; e < list.length; e++) {
			var data = wd_html_form_data(list[e]);
			for (var i = 0; i < data.length; i++) {
				var name  = data[i].NAME;
				var value = get === true ? data[i].GET : data[i].POST;
				if (wd_vtype(value).type === "array") {
					for (var j = 0; j < value.length; j++) {
						if (get === true) pkg.push(name+"="+value[j]);
						else pkg.append(name, value[j]);
					}
				} else {
					if (get === true) pkg.push(name+"="+value);
					else pkg.append(name, value);
				}
			}
		}
		return get === true ? pkg.join("&") : pkg;
	}




	Object.defineProperty(WDdom.prototype, "chart", {/*retorna um objeto (aplicável somente ao 1º elemento) de criação de gráficos*/
		value: function(title) {
			return new wdChart(this.item(0), title);
		}
	});









/*----------------------------------------------------------------------------*/
	function WD(input) { /* função de interface ao usuário */
		var vtype  = wd_vtype(input);
		var object = {
			"undefined": WDundefined, "null":     WDnull,
			"boolean":   WDboolean,   "function": WDfunction,
			"object":    WDobject,    "regexp":   WDregexp,
			"array":     WDarray,     "dom":      WDdom,
			"time":      WDtime,      "date":     WDdate,
			"number":    WDnumber,    "text":     WDtext,
			"unknown":   WDmain
		};

		return new object[vtype.type](vtype.value);
	}

	WD.constructor = WD;
	Object.defineProperties(WD, {
		version: {value: wd_version},
		$:       {value: function(css, root) {return WD(wd_$(css, root));}},
		$$:      {value: function(css, root) {return WD(wd_$$(css, root));}},
		today:   {get:   function() {return WD(new Date());}},
		now: {get: function() {
			var t = new Date();
			var o = {h: t.getHours(), m: t.getMinutes(), s: t.getSeconds()};
			for (var i in o) o[i] = (o[i] < 10 ? "0" : "") + o[i].toString();
			return WD(o.h+":"+o.m+":"+o.s);
		}},
		loko: {value: WDchart}
	});

/* == BLOCO 4 ================================================================*/

/*----------------------------------------------------------------------------*/
	function data_wdLoad(e) {/*carrega HTML: data-wd-load=path{file}method{get|post}${form}*/
		if (!("wdLoad" in e.dataset)) return;
		var data   = wd_html_dataset_notation(e, "wdLoad")[0];
		var target = WD(e);
		var method = "method" in data ? data.method : "post";
		var file   = data.path;
		var pack   = wd_$$$(data);
		var exec   = WD(pack);

		target.data({wdLoad: null});
		exec.send(file, function(x) {
			if (x.closed) target.load(x.text);
		}, method);
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdRepeat(e) {/*Repete modelo HTML: data-wd-repeat=path{file}method{get|post}${form}*/
		if (!("wdRepeat" in e.dataset)) return;
		var data   = wd_html_dataset_notation(e, "wdRepeat")[0];
		var target = WD(e);
		var method = "method" in data ? data.method : "post";
		var file   = data.path;
		var pack   = wd_$$$(data);
		var exec   = WD(pack);

		target.data({wdRepeat: null});
		exec.send(file, function(x) {
			if (x.closed) {
				if (x.json !== null) return target.repeat(x.json);
				if (x.csv !== null)  return target.repeat(wd_matrix_object(x.csv));
				return target.repeat([]);
			}
		}, method);
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdChart(e) {/*Plotar Gráfico: data-wd-chart*/
		/*a partir de uma tabela: table{target}cols{x,y1:anal1,y2:anal2...}labels{title,x,y}*/
		/*a partir de um arquivo: path{...}method{...}form{...}cols{x,y1:anal1,y2:anal2...}labels{title,x,y}*/
		if (!("wdChart" in e.dataset)) return;
		var data   = wd_html_dataset_notation(e, "wdChart")[0];
		var target = WD(e);

		/*Função para analisar dados e manipular objeto*/
		var buildChart = function(elem, matrix, data) {
			var obj = WD(matrix);
			if (obj.type !== "array") return;
			var labels = data.labels.split(",");
			var cols    = data.cols.split(",");
			var xcol    = cols[0].replace(/[^0-9]/g, "");
			var xaxis   = obj.cell("1-:"+xcol);
			var chart   = WD(elem).chart(labels[0].trim());
			var compare = true;
			/*obtendo eixo y e adicionando dados*/
			for (var i = 1; i < cols.length; i++) {
				var info  = cols[i].split(":");
				var ycol  = info[0].replace(/[^0-9]/g, "");
				var anal  = info.length === 2 ? info[1].trim() : "";
				if (anal !== "compare") compare = false;
				var yaxis = obj.cell("1-:"+ycol);
				var label = obj.cell("0:"+ycol);
				chart.add(xaxis, yaxis, label, anal);
			}
			return chart.plot(labels[1].trim(), labels[2].trim(), compare);
		}
		/*trabalhar com os dados, se tabela ou arquivo*/
		if ("table" in data) { /*para fonte tabela*/
			var table  = WD.$(data.table);
			var matrix = table.table();
			if (matrix.length === 0) return;
			return buildChart(e, matrix[0], data);
		} else if ("path" in data) { /*para fonte arquivo*/
			var method = "method" in data ? data.method : "post";
			var file   = data.path;
			var pack   = wd_$$$(data);
			var exec   = WD(pack);
			exec.send(file, function(x) {
				if (x.closed) {
					if (x.csv !== null) return buildChart(e, x.csv, data);
				}
			}, method);
		}
		target.data({wdChart: null});
		return;
	}

/*----------------------------------------------------------------------------*/

	function data_wdSend(e) {/*Requisições: data-wd-send=path{file}method{get|post}${form}call{name}&*/
		if (!("wdSend" in e.dataset)) return;
		var data = wd_html_dataset_notation(e, "wdSend");
		for (var i = 0; i < data.length; i++) {
			if (!("get" in data[i]) && !("post" in data[i])) continue;
			var method = "method" in data[i] ? data.method[i] : "post";
			var file   = data[i].path;
			var pack   = wd_$$$(data[i]);
			var call   = window[data[i]["call"]];
			var exec   = WD(pack);
			exec.send(file, call, method);
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdSort(e) {/*Ordenar HTML: data-wd-sort="order{±1}col{>0?}"*/
		if (!("wdSort" in e.dataset)) return;
		var data  = wd_html_dataset_notation(e, "wdSort")[0];
		var order = "order" in data ? data.order : 1;
		var col   = "col"   in data ? data.col : null;
		WD(e).sort(order, col).data({wdSort: null});
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdTsort(e) {/*Ordena tabelas: data-wd-tsort=""*/
		if (!("wdTsort" in e.dataset)) return;
		if (wd_html_tag(e.parentElement.parentElement) !== "thead") return;
		var order = e.dataset.wdTsort === "+1" ? -1 : 1;
		var col   = WDdom.brosIndex(e);
		var heads = e.parentElement.children;
		var thead = e.parentElement.parentElement;
		var body  = thead.parentElement.tBodies;

		WD(body).sort(order, col);
		WD(heads).run(function(x) {
			if ("wdTsort" in x.dataset) x.dataset.wdTsort = "";
		});
		WD(e).data({wdTsort: (order < 0 ? "-1" : "+1")});

		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdFilter(e) {/*Filtrar elementos: data-wd-filter=chars{}${css}&...*/
		if (!("wdFilter" in e.dataset)) return;

		var search = wd_html_form(e) ? WDdom.value(e) : e.textContent;
		if (search === null) search = "";
		if (search[0] === "/" && search.length > 3) {/*É RegExp?*/
			if (search[search.length - 1] === "/") {
				search = new RegExp(search.substr(1, (search.length - 2)));
			} else if (search.substr((search.length - 2), 2) === "/i") {
				search = new RegExp(search.substr(1, (search.length - 3)), "i");
			}
		}

		var data = wd_html_dataset_notation(e, "wdFilter");
		for (var i = 0; i < data.length; i++) {
			var chars  = data[i].chars;
			var target = wd_$$$(data[i]);
			if (target !== null) WD(target).filter(search, chars);
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdMask(e) {/*Máscara: data-wd-mask="model{mask}call{callback}"*/
		if (!("wdMask" in e.dataset)) return;
		var attr = WDdom.mask(e);
		if (attr === null) return;
		var data = wd_html_dataset_notation(e, "wdMask")[0];
		if (!("model" in data)) return;
		var checks = {
			date: function(x) {return WD(x).type === "date" ? true : false},
			time: function(x) {return WD(x).type === "time" ? true : false},
		};
		var shorts = {
			"%DMY": {mask: "##/##/####", func: checks.date},
			"%MDY": {mask: "##.##.####", func: checks.date},
			"%YMD": {mask: "####-##-##", func: checks.date},
			"%H":   {mask: "#:##?##:##?#:##:##?##:##:##", func: checks.time}
		};
		var text = e[attr];
		var mask = data.model;
		var func = "call" in data && data["call"] in window ? window[data["call"]] : null;
		if (mask in shorts) {
			func = shorts[data.model].func;
			mask = shorts[data.model].mask;
		}

		var value = WD(mask).mask(text, func);
		if (value !== null) e[attr] = value;
		if (attr === "value") {
			if (e.value !== "" && value === null) return WD(e).css({add: "js-wd-mask-error"});
			return WD(e).css({del: "js-wd-mask-error"});
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdPage(e) {/*separação em grupos: data-wd-page=page{p}size{s}*/
		if (!("wdPage" in e.dataset)) return;
		var data = wd_html_dataset_notation(e, "wdPage")[0];
		WD(e).page(data.page, data.size).data({wdPage: null});
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdClick(e) {/*Executa click(): data-wd-click=""*/
		if (!("wdClick" in e.dataset)) return;
		if ("click" in e) e.click();
		WD(e).data({wdClick: null});
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdData(e) {/*define dataset: data-wd-data=attr1{value}${css}&*/
		if (!("wdData" in e.dataset)) return;
		var data = wd_html_dataset_notation(e, "wdData");
		for (var i = 0; i < data.length; i++) {
			var target = wd_$$$(data[i]);
			delete data[i]["$"];
			delete data[i]["$$"];
			for (var j in data[i]) if (data[i][j] === "null") data[i][j] = null;
			WD(target === null ? e : target).data(data[i]);
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdEdit(e) {/*edita texto: data-wd-edit=comando{especificação}...*/
		if (!("execCommand" in document)) return;
		if (!("wdEdit" in e.dataset)) return;
		var data = wd_html_dataset_notation(e, "wdEdit")[0];
		for (var i in data) {
			var cmd = i;
			var arg = data[i].trim() === "" ? undefined : data[i].trim();
			if (cmd === "createLink") {
				arg = prompt("Link:");
				if (arg === "" || arg === null) cmd = "unlink";
			}
			if (cmd === "insertImage") {
				arg = prompt("Link:");
			}
			document.execCommand(cmd, false, arg);
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdDevice(e) {/*Estilo widescreen: data-wd-device=desktop{css}tablet{css}phone{css}mobile{css}*/
		if (!("wdDevice" in e.dataset)) return;
		var data = wd_html_dataset_notation(e, "wdDevice")[0];
		var desktop = "desktop" in data ? data.desktop : "";
		var mobile  = "mobile"  in data ? data.mobile  : "";
		var tablet  = "tablet"  in data ? data.tablet  : "";
		var phone   = "phone"   in data ? data.phone   : "";
		var device  = wd_get_device();
		if (device === "desktop") {
			return WD(e).css({del: phone}).css({del: tablet}).css({del: mobile}).css({add: desktop});
		}
		if (device === "tablet") {
			return WD(e).css({del: desktop}).css({del: phone}).css({add: mobile}).css({add: tablet});
		}
		if (device === "phone") {
			return WD(e).css({del: desktop}).css({del: tablet}).css({add: mobile}).css({add: phone});
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdFull(e) {/*Estilo fullscreen: data-wd-full=exit{}${}*/
		if (!("wdFull" in e.dataset)) return;
		var data   = wd_html_dataset_notation(e, "wdFull")[0];
		var exit   = "exit" in data ? true : false;
		var target = wd_$$$(data);
		if (target === null) target = document.documentElement;
		WD(target).full(exit);
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdSlide(e) {/*Carrossel: data-wd-slide=time*/
		if (!("wdSlide" in e.dataset)) return delete e.dataset.wdSlideRun;
		var time = wd_finite(e.dataset.wdSlide) ? wd_integer(e.dataset.wdSlide) : 1000;;

		if (!("wdSlideRun" in e.dataset)) {
			WD(e).nav((time < 0 ? "prev" : "next"));
			e.dataset.wdSlideRun = "1";
			window.setTimeout(function() {
				delete e.dataset.wdSlideRun
				data_wdSlide(e);
				return;
			}, (time === 0 ? 1000 : Math.abs(time)));
			return;
		}
		return delete e.dataset.wdSlideRun;
	};

/*----------------------------------------------------------------------------*/

	function data_wdShared(e) {/*TODO: Link para redes sociais: data-wd-shared=rede*/
		if (!("wdShared" in e.dataset)) return;
		var url    = encodeURIComponent(document.URL);
		var title  = encodeURIComponent(document.title);
		var social = e.dataset.wdShared.trim().toLowerCase();
		var link   = {
			facebook: "https://www.facebook.com/sharer.php?u="+url,
			twitter:  "https://twitter.com/share?url="+url+"&text="+title+"&via=&hashtags=",
			linkedin: "https://www.linkedin.com/shareArticle?url="+url+"&title="+title,
			reddit:   "https://reddit.com/submit?url="+url+"&title="+title,
			evernote: "https://www.evernote.com/clip.action?url="+url+"&title="+title,
		}
		if (social in link) {window.open(link[social]);}
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdSet(e) {/*define attributos: data-wd-set=attr{value}${css}&...*/
		if (!("wdSet" in e.dataset)) return;
		var data  = wd_html_dataset_notation(e, "wdSet");
		var words = {"null": null, "false": false, "true": true};
		for (var i = 0; i < data.length; i++) {
			var target = wd_$$$(data[i]);
			delete data[i]["$"];
			delete data[i]["$$"];
			for (var j in data[i]) {
				if (data[i][j] in words) data[i][j] = words[data[i][j]];
				WD(target === null ? e : target).set(j, data[i][j]);
			}
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdCss(e) {/*define class: data-wd-css=add{value}tgl{css}del{css}${css}&...*/
		if (!("wdCss" in e.dataset)) return;
		var data = wd_html_dataset_notation(e, "wdCss");
		for (var i = 0; i < data.length; i++) {
			var target = wd_$$$(data[i]);
			delete data[i]["$"];
			delete data[i]["$$"];
			if (JSON.stringify(data[i]) === "{}") data[i] = null;
			WD(target === null ? e : target).css(data[i]);
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdNav(e) {/*Navegação: data-wd-nav=type{arg}${css}&*/
		if (!("wdNav" in e.dataset)) return;
		var data = wd_html_dataset_notation(e, "wdNav");
		for (var i = 0; i < data.length; i++) {
			var target = wd_$$$(data[i]);
			var value  = "type" in data[i] ? data[i].type : null;
			WD(target === null ? e : target).nav(value);
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdOutput(e) {/*Atribui um valor ao target: data-wd-output=${target}call{}*/
		if (!("wdOutput" in e.dataset)) return;
		var data   = wd_html_dataset_notation(e, "wdOutput")[0];
		var target = wd_$$$(data);
		if (target === null) return;



/*
		var table = WD(target).table()[0];
		if (table === null) return;
		var value = WD(table).data(data.x, data.y);
		var index = "value" in data ? data.value.split(".") : [];
		for (var i = 0; i < index.length; i++)
			try {value = value[index[i]];} catch(e) {value = null; break;}
		e.textContent = value === null ? "?" : value;
		return;
*/
	};

/*----------------------------------------------------------------------------*/

	function data_wdFile(e) {/*Análise de arquivos: data-wd-file=fs{}ft{}fc{}nf{}ms{}call{}*/
	/*analisa as informações do arquivo 
		nf: number of files      (quantidade máxima de arquivos)
		ms: maximum size         (tamanho total de arquivos)
		fs: file size            (tamanho individual do arquivo)
		ft: file type            (tipo do arquivo aceito)
		fc: forbidden characters (caracteres não permitidos)
		call: função a ser chamada
	*/
		if (!("wdFile" in e.dataset) || WDdom.type(e) !== "file") return;

		var data  = wd_html_dataset_notation(e, "wdFile")[0];
		var info  = {error: null, file: null, value: null, parameter: null};
		var files = e.files;

		if ("nf" in data && files.length > wd_integer(data.nf, true)) {
			info.error     = "nf";
			info.value     = files.length;
			info.file      = "";
			info.parameter = wd_integer(data.nf, true);
		} else {
			var ms = 0;
			var fc = "fc" in data ? new RegExp("("+data.fc+")", "g") : null;

			for (var i = 0; i < files.length; i++) {
				ms += files[i].size;
				if ("ms" in data && ms > wd_integer(data.ms, true)) {
					info.error     = "ms";
					info.value     = wd_bytes(ms);
					info.parameter = wd_bytes(wd_integer(data.ms, true));
				} else if ("fs" in data && files[i].size > wd_integer(data.fs, true)) {
					info.error     = "fs";
					info.value     = wd_bytes(files[i].size);
					info.parameter = wd_bytes(wd_integer(data.fs, true));
				} else if ("ft" in data && data.ft.split(" ").indexOf(files[i].type) < 0) {
					info.error     = "ft";
					info.value     = files[i].type;
					info.parameter = data.ft;
				} else if (fc !== null && fc.test(files[i].name)) {
					info.error     = "fc";
					info.value     = files[i].name.replace(fc, "<b style=\"color: #FF0000;\">$1</b>");
					info.parameter = data.fc;
				}
				if (info.error !== null) {
					break;
				}
			}
		}

		if (info.error !== null) {
			e.value = null;
			WD(e).css({add: "js-wd-mask-error"});
			if (WD(window[data["call"]]).type === "function") window[data["call"]](info);
			return;
		}
		return WD(e).css({del: "js-wd-mask-error"});
	};

/*----------------------------------------------------------------------------*/

	function navLink(e) {/*link ativo do navegador*/
		if (e.parentElement === null) return;
		if (wd_html_tag(e.parentElement) !== "nav") return;
		WD(e.parentElement.children).css({add: "js-wd-nav-inactive"});
		WD(e).css({del: "js-wd-nav-inactive"});
		return;
	};

/*============================================================================*/
/* -- DISPARADORES -- */
/*============================================================================*/

	function loadProcedures(ev) {
		/*definer o dispositivo*/
		wd_device_controller = wd_get_device();

		/*criar o estilo interno*/
		var styles = [
			{target: "@keyframes js-wd-fade-in",
				value: "from {opacity: 0;} to {opacity: 1;}"},
			{target: "@keyframes js-wd-fade-out",
				value: "from {opacity: 1;} to {opacity: 0;}"},
			{target: ".js-wd-signal",
				value: "animation-name: js-wd-fade-in, js-wd-fade-out; animation-duration: 1.5s, 1.5s; animation-delay: 0s, 7.5s;"},
			{target: ".js-wd-no-display",
				value: "display: none !important;"},
			{target: ".js-wd-mask-error",
				value: "color: #db1414 !important; background-color: #fde8e8 !important;"},
			{target: "[data-wd-nav], [data-wd-send], [data-wd-tsort], [data-wd-data]",
				value: "cursor: pointer;"},
			{target: "[data-wd-set], [data-wd-edit], [data-wd-shared], [data-wd-css], [data-wd-table]",
				value: "cursor: pointer;"},
			{target: "[data-wd-tsort]:before",
				value: "content: \"\\2195 \";"},
			{target: "[data-wd-tsort=\"-1\"]:before",
				value: "content: \"\\2191 \";"},
			{target: "[data-wd-tsort=\"+1\"]:before",
				value: "content: \"\\2193 \";"},
			{target: "[data-wd-repeat] > *, [data-wd-load] > *",
				value: "visibility: hidden !important;"},
			{target: "[data-wd-slide] > * ",
				value: "animation: js-wd-fade-in 1s;"},
			{target: "nav > *.js-wd-nav-inactive",
				value: "background-color: rgba(230,230,230,0.8) !important; color: #737373 !important;"},
			{target: ".js-wd-plot",
				value: "height: 100%; width: 100%; position: absolute; top: 0; left: 0; bottom: 0; right: 0;"}
		];
		var style = document.createElement("STYLE");
		for(var i = 0; i < styles.length; i++)
			style.textContent += styles[i].target+" {"+styles[i].value+"}\n"
		document.head.appendChild(style);

		/*definindo ícone*/
		if (wd_$("link[rel=icon]") !== null) {
			var favicon = document.createElement("LINK");
			favicon.rel = "icon";
			favicon.href = "https://wdonadelli.github.io/wd/image/favicon.ico";
			document.head.appendChild(favicon);
		}

		/*aplicando carregamentos*/
		loadingProcedures();

		/*Verificando âncoras lincadas*/
		hashProcedures();

		return;
	}

/*----------------------------------------------------------------------------*/

	function hashProcedures(ev) {/*define margens de body quando houver cabeçalhos filhos fixos: caso muito especial*/
		var measures = function (e) {
			var obj = WD(e);
			if (obj.type !== "dom" || obj.item() === 0) return null;
			return {
				elem:         obj.item(0),
				tag:          wd_html_tag(obj.item(0)),
				position:     obj.vstyle("position")[0].toLowerCase(),
				height:       wd_integer(obj.vstyle("height")[0].replace(/[^0-9\.]/g, "")),
				marginTop:    wd_integer(obj.vstyle("margin-top")[0].replace(/[^0-9\.]/g, "")),
				marginBottom: wd_integer(obj.vstyle("margin-bottom")[0].replace(/[^0-9\.]/g, "")),
				bottom:       wd_integer(obj.vstyle("bottom")[0].replace(/[^0-9\.]/g, "")),
				top:          wd_integer(obj.vstyle("top")[0].replace(/[^0-9\.]/g, "")),
			};
		}

		var head = measures("${body > header}");
		if (head !== null && head.position === "fixed")
			document.body.style.marginTop = (head.top+head.height+head.marginBottom)+"px";

		var foot = measures("${body > footer}");
		if (foot !== null && foot.position === "fixed")
			document.body.style.marginBottom = (foot.bottom+foot.height+foot.marginTop)+"px";

		var body = measures(document.body);
		var hash = measures("${"+window.location.hash+"}");
		if (hash !== null && head.position === "fixed")
			window.scrollTo(0, hash.elem.offsetTop - body.marginTop);

		return;
	};

/*----------------------------------------------------------------------------*/

	function loadingProcedures() {/*procedimento para carregamentos*/

		var repeat = WD.$("[data-wd-repeat]");
		if (repeat.type === "dom") repeat.run(data_wdRepeat);

		var load = WD.$("[data-wd-load]");
		if (load.type === "dom") load.run(data_wdLoad);

		organizationProcedures();
		return;
	};

/*----------------------------------------------------------------------------*/

	function scalingProcedures(ev) {/*procedimentos para definir dispositivo e aplicar estilos*/
		var device = wd_get_device();
		if (device !== wd_device_controller) {
			wd_device_controller = device;
			WD.$$("[data-wd-device]").run(data_wdDevice);
		}
		hashProcedures();
		return;
	};

/*----------------------------------------------------------------------------*/

	function organizationProcedures() {/*procedimento PÓS carregamentos*/
		WD.$$("[data-wd-sort]").run(data_wdSort);
		WD.$$("[data-wd-filter]").run(data_wdFilter);
		WD.$$("[data-wd-mask]").run(data_wdMask);
		WD.$$("[data-wd-page]").run(data_wdPage);
		WD.$$("[data-wd-click]").run(data_wdClick);
		WD.$$("[data-wd-slide]").run(data_wdSlide);
		WD.$$("[data-wd-device]").run(data_wdDevice);
		WD.$$("[data-wd-table]").run(data_wdOutput);
		WD.$$("[data-wd-chart]").run(data_wdChart);
		return;
	};

/*----------------------------------------------------------------------------*/

	function settingProcedures(e, attr) {/*procedimentos para dataset*/
		switch(attr) {
			case "wdLoad":    loadingProcedures(); break;
			case "wdRepeat":  loadingProcedures(); break;
			case "wdSort":    data_wdSort(e);      break;
			case "wdFilter":  data_wdFilter(e);    break;
			case "wdMask":    data_wdMask(e);      break;
			case "wdPage":    data_wdPage(e);      break;
			case "wdClick":   data_wdClick(e);     break;
			case "wdDevice":  data_wdDevice(e);    break;
			case "wdSlide":   data_wdSlide(e);     break;
			case "wdFile":    data_wdFile(e);      break;
			case "wdOutput":  data_wdOutput(e);    break;
			case "wdChart":   data_wdChart(e);     break;
		};
		return;
	};

/*----------------------------------------------------------------------------*/

	function clickProcedures(ev) {/*procedimentos para cliques*/
		if (ev.which !== 1) return;
		var elem = ev.target
		while (elem !== null) {
			data_wdSend(elem);
			data_wdTsort(elem);
			data_wdData(elem);
			data_wdEdit(elem);
			data_wdShared(elem);
			data_wdSet(elem);
			data_wdCss(elem);
			data_wdNav(elem);
			data_wdFull(elem);
			navLink(elem);
			elem = "wdNoBubbles" in elem.dataset ? null : elem.parentElement;/*efeito bolha*/
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function keyboardProcedures(ev, relay) {/*procedimentos de teclado para outros elementos*/
		/* não serve para formulários */
		if (wd_html_form(ev.target)) return;

		/*FIXME elementos com contentEditable funcionam com o evento input, ver como function no IE11*/
		/*se funcionar, eliminar esse procedimento com o evento keyup*/
		


		var now  = (new Date()).valueOf();
		var time = Number(ev.target.dataset.wdTimeKey);

		/*definir atributo e pedir para verificar posteriormente*/
		if (relay !== true) {
			ev.target.dataset.wdTimeKey = now;
			window.setTimeout(function() {/*verificar daqui um intervalo de tempo*/
				keyboardProcedures(ev, true);
			}, wd_key_time_range);
			return;
		}

		/*se há o atributo e o agora superar o intervalo, apagar atributo e executar*/
		if ("wdTimeKey" in ev.target.dataset && now >= (time+wd_key_time_range)) {
			delete ev.target.dataset.wdTimeKey;

			data_wdFilter(ev.target);
			data_wdOutput(ev.target);
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function inputProcedures(ev, relay) {/*procedimentos de teclado para formulários*/
		/* Somente para formulários */
		if (!wd_html_form(ev.target) && ev.target.isContentEditable) return;
	
		var now  = (new Date()).valueOf();
		var time = Number(ev.target.dataset.wdTimeKey);

		/*definir atributo e pedir para verificar posteriormente*/
		if (relay !== true) {
			ev.target.dataset.wdTimeKey = now;
			window.setTimeout(function() {/*verificar daqui um intervalo de tempo*/
				inputProcedures(ev, true);
			}, wd_key_time_range);
			return;
		}

		/*se há o atributo e o agora superar o intervalo, apagar atributo e executar*/
		if ("wdTimeKey" in ev.target.dataset && now >= (time+wd_key_time_range)) {
			delete ev.target.dataset.wdTimeKey;

			data_wdFilter(ev.target);
			data_wdOutput(ev.target);
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function focusoutProcedures(ev) {/*procedimentos para saída de formulários*/
		return data_wdMask(ev.target);
	};

/*----------------------------------------------------------------------------*/

	function changeProcedures(ev) {/*procedimentos para outras mudanças*/
		return data_wdFile(ev.target);
	};

/*----------------------------------------------------------------------------*/

	WD(window).addHandler({/*Definindo eventos window*/
		load: loadProcedures,
		resize: scalingProcedures,
		hashchange: hashProcedures,
	});

	WD(document).addHandler({/*Definindo eventos document*/
		click:    clickProcedures,
		keyup:    keyboardProcedures,
		input:    inputProcedures,
		change:   changeProcedures,
		focusout: focusoutProcedures,
	});

	return WD;
}());
