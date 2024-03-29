/*----------------------------------------------------------------------------
wd.js (v2.1.4)
<wdonadelli@gmail.com>
https://github.com/wdonadelli/wd
------------------------------------------------------------------------------
MIT License

Copyright (c) 2019-2020 Willian Donadelli

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
SOFTWARE.
----------------------------------------------------------------------------*/

"use strict";

var wd = (function() {

/* === WD ================================================================== */

	/*Imprime mensagem no console*/
	function log(msg, type) {
		var types = {e: "error", w: "warn", i: "info", l: "log"};
		if (types[type] in console) {
			console[types[type]](msg);
		} else {
			console.log(msg);
		}
		return;
	};

	/*Retorna a linguagem do documento, a definida ou a do navegador*/
	function lang() {
		var value, attr;
		attr  = document.body.parentElement.attributes;
		value = "lang" in attr ? attr.lang.value.replace(/\ /g, "") : "";
		if (value === "") {
			value = navigator.language || navigator.browserLanguage || "en-US";
		}
		return value;
	};

	/*Retorna os elementos html identificados pelo seletor css no elemento root*/
	function $(selector, root) {
		var x;
		if (root === undefined || !("querySelectorAll" in root)) {
			root = document;
		}
		try {
			x = root.querySelectorAll(selector);
		} catch(e) {
			x = null;
		}
		return x;
	};

	/*Obtem o nome e o valor da expressão name{valor}*/
	function getData(input) {
		var x, open, name, value;
		x     = {};
		open  = 0;
		name  = "";
		value = "";
		input = String(input).trim().split("");
		for (var i = 0; i < input.length; i++) {
			if (input[i] === "{" && open === 0) {
				open++;
			} else if (input[i] === "}" && open === 1) {
				open--;
				x[name.trim()] = value.trim();
				name  = "";
				value = "";
			} else if (open > 0) {
				if (input[i] === "{") {
					open++;
				} else if (input[i] === "}") {
					open--;
				}
				value += input[i];
			} else {
				name += input[i];
			}
		}
		return x;
	};

	/*Retorna verdadeiro se o ano for bissexto*/
	function isLeap(y) {
		var x;
		if (y === 0) {
			x = false;
		} else if (y%400 === 0) {
			x = true;
		} else if (y%100 === 0) {
			x = false;
		} else if (y%4 === 0) {
			x = true;
		} else {
			x = false;
		}
		return x;
	};

	/*Verifica se o valor é undefined*/
	function isUndefined(value) {
		return value === undefined ? true : false;
	};

	/*Verifica se o valor é nulo*/
	function isNull(value) {
		return value === null ? true : false;
	};

	/*Verifica se o valor é uma string genérica*/
	function isString(value) {
		var x;
		if (typeof value === "string") {
			x = true
		} else if ("String" in window && value instanceof String) {
			x = true;
		} else if ("String" in window && value.constructor === String) {
			x = true;
		} else {
			x = false;
		}
		return x;
	};

	/*Verifica se o valor é uma expressão regular*/
	function isRegExp(value) {
		var x;
		if (typeof value === "regexp") {
			x = true;
		} else if ("RegExp" in window && value instanceof RegExp) {
			x = true;
		} else if ("RegExp" in window && value.constructor === RegExp) {
			x = true;
		} else {
			x = false;
		}
		return x;
	};

	/*Verifica se o valor é um número*/
	function isNumber(value) {
		var x;
		if (typeof value === "number") {
			x = true;
		} else if ("Number" in window && value instanceof Number) {
			x = true;
		} else if ("Number" in window && value.constructor === Number) {
			x = true;
		} else if (!isString(value)) {
			x = false;
		} else if (value.trim() === "Infinity") {
			x = false;
		} else if (value.trim() == Number(value.trim())) {
			x = true;
		} else {
			x = false;
		}
		return x;
	};

	/*Verifica se o valor é boleano*/
	function isBoolean(value) {
		var x;
		if (x === true || x === false) {
			x = true;
		} else if (typeof value === "boolean") {
			x = true;
		} else if ("Boolean" in window && value instanceof Boolean) {
			x = true;
		} else if ("Boolean" in window && value.constructor === Boolean) {
			x = true;
		} else {
			x = false;
		}
		return x;
	};

	/*Verifica se o valor é uma lista*/
	function isArray(value) {
		var x;
		if ("Array" in window && "isArray" in Array && Array.isArray(value)) {
			x = true;
		} else if ("Array" in window && value instanceof Array) {
			x = true;
		} else if ("Array" in window && value.constructor === Array) {
			x = true;
		} else {
			x = false;
		}
		return x;
	};

	/*Verifica se o valor é um objeto simples {}*/
	function isObject(value) {
		var x;
		if (typeof value === "object" && (/^\{.*\}$/).test(JSON.stringify(value)) === true) {
			x = true;
		} else {
			x = false;
		}
		return x;
	};

	/*Verifica se o valor é uma função*/
	function isFunction(value) {
		var x;
		if (typeof value === "function") {
			x = true;
		} else if ("Function" in window && value instanceof Function) {
			x = true;
		} else if ("Function" in window && value.constructor === Function) {
			x = true;
		} else {
			x = false;
		}
		return x;
	};

	/*Verifica se o valor é um elemento(s) HTML*/
	function isDOM(value) {
		var x;
		if (value === document || value === window) {
			x = true;
		} else if ("HTMLElement" in window && value instanceof HTMLElement) {
			x = true;
		} else if ("HTMLElement" in window && value.constructor === HTMLElement) {
			x = true;
		} else if ("NodeList" in window && value instanceof NodeList) {
			x = true;
		} else if ("NodeList" in window && value.constructor === NodeList) {
			x = true;
		} else if ("HTMLCollection" in window && value instanceof HTMLCollection) {
			x = true;
		} else if ("HTMLCollection" in window && value.constructor === HTMLCollection) {
			x = true;
		} else if ("HTMLAllCollection" in window && value instanceof HTMLAllCollection) {
			x = true;
		} else if ("HTMLAllCollection" in window && value.constructor === HTMLAllCollection) {
			x = true;
		} else if ("HTMLFormControlsCollection" in window && value instanceof HTMLFormControlsCollection) {
			x = true;
		} else if ("HTMLFormControlsCollection" in window && value.constructor === HTMLFormControlsCollection) {
			x = true;
		} else {
			x = false;
		}
		return x;
	};

	/*Verifica se o valor é um tempo válido*/
	function isTime(value) {
		var x;
		if (!isString(value)) {
			x = false;
		} else if (value.trim() === "%now") {
			x =  true;
		} else if (/^(0?[0-9]|1[0-9]|2[0-4])(\:[0-5][0-9]){1,2}$/.test(value.trim())) {
			x =  true;
		} else if ((/^(0?[1-9]|1[0-2])\:[0-5][0-9]\ ?(am|pm)$/i).test(value.trim())) {
			x =  true;
		} else if ((/^(0?[0-9]|1[0-9]|2[0-4])h[0-5][0-9]$/i).test(value.trim())) {
			x =  true;
		} else {
			x =  false;
		}
		return x;
	};

	/*Verifica se o valor é uma data válida*/
	function isDate(value) {
		var x, d, m, y, array;
		if ("Date" in window && value instanceof Date) {
			x = true;
		} else if ("Date" in window && value.constructor === Date) {
			x = true;
		} else if (!isString(value)) {
			x = false;
		} else if (value.trim() === "%today") {
			x = true;
		} else {
			if (/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/.test(value.trim())) {/*YYYY-MM-DD*/
				array = value.split("-");
				d = Number(array[2]);
				m = Number(array[1]);
				y = Number(array[0]);
			} else if (/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(value.trim())) {/*MM/DD/YYYY*/
				array = value.split("/");
				d = Number(array[1]);
				m = Number(array[0]);
				y = Number(array[2]);
			} else if (/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/.test(value.trim())) {/*DD.MM.YYYY*/
				array = value.split(".");
				d = Number(array[0]);
				m = Number(array[1]);
				y = Number(array[2]);
			} else {
				array = null;
			}
			if (array === null) {
				x = false;
			} else if (y > 9999 || y < 1) {
				x = false;
			} else if (m > 12 || m < 1) {
				x = false;
			} else if (d > 31 || d < 1) {
				x = false;
			} else if (d > 30 && [2, 4, 6, 9, 11].indexOf(m) >= 0) {
				x = false;
			} else if (d > 29 && m == 2) {
				x = false;
			} else if (d == 29 && m == 2 && !isLeap(y)) {
				x = false;
			} else {
				x = true;
			}
		}
		return x;
	};

	/*Verifica se o valor é um texto*/
	function isText(value) {
		var x;
		if (!isString(value)) {
			x = false;
		} else if (value.trim() === "") {
			x = false;
		} else if (isTime(value) || isDate(value) || isNumber(value)) {
			x = false;
		} else {
			x = true;
		}
		return x;
	};

/*...........................................................................*/

	function WD(input) {
		if (!(this instanceof WD)) {
			return new WD(input);
		}

		if (!isNull(input) && !isUndefined(input)) {
			if (isString(input) && input.trim() === "") {
				input = null;
			} else if (isBoolean(input)) {
				input = input.valueOf();
			} else if (isRegExp(input)) {
				return new WDregexp(input);
			} else if (isTime(input)) {
				return new WDtime(input);
			} else if (isDate(input)) {
				return new WDdate(input);
			} else if (isArray(input)) {
				return new WDarray(input);
			} else if (isDOM(input)) {
				return new WDdom(input);
			} else if (isNumber(input)) {
				return new WDnumber(input);
			} else if (isText(input)) {
				return new WDtext(input);
			}
		}

		Object.defineProperty(this, "_value", {
			value: input
		});
	};

	Object.defineProperty(WD.prototype, "constructor", {
		value: WD
	});

	/*Retorna o tipo do argumento informado*/
	Object.defineProperty(WD.prototype, "type", {
		enumerable: true,
		get: function () {
			var x, types;
			x = null;
			types = {
				"undefined": isUndefined,
				"null": isNull,
				"boolean": isBoolean,
				"function": isFunction,
				"object": isObject
			};
			for (var i in types) {
				if (types[i](this._value)) {
					x = i;
					break;
				}
			};
			if (x === null) {
				try {
					x = this._value.constructor.name.toLowerCase();
				} catch(e) {
					x = "unknown";
				}
			}
			return x;
		}
	});

	/*Exibe os métodos e atributos enumeráveis do objeto*/
	Object.defineProperty(WD.prototype, "tools", {
		enumerable: true,
		get: function () {
			var x = []
			for (var i in this) {
				x.push(i);
			}
			return WD(x).sort();
		}
	});

	/*retorna o método valueOf e toString*/
	Object.defineProperties(WD.prototype, {
		$: {
			value: $
		},
		valueOf: {
			value: function () {
				var x;
				switch(this.type) {
					case "null":
						x = 0;
						break;
					case "undefined":
						x = Infinity;
						break;
					case "boolean":
						x = this._value.valueOf() === true ? 1 : 0;
						break;
					default:
						try {
							x = this._value.valueOf();
						} catch(e) {
							x = Number(this._value).valueOf();
						}
					}
				return x;
			}
		},
		toString: {
			value: function () {
				var x;
				switch(this.type) {
					case "null":
						x = "Ø";
						break;
					case "undefined":
						x = "?";
						break;
					case "boolean":
						x = this._value === true ? "True" : "False";
						break;
					case "object":
						x = JSON.stringify(this._value);
						break;
					default:
						try {
							x = this._value.toString();
						} catch(e) {
							x = String(this._value).toString();
						}
					}
				return x;
			}
		}
	});

/* === TEXT ================================================================ */

	/*Obtém objeto para requisições ajax*/
	function request() {
		var x;
		if ("XMLHttpRequest" in window) {
			x = new XMLHttpRequest();
		} else if ("ActiveXObject" in window) {
			try {
				x = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				x = new ActiveXObject("Microsoft.XMLHTP");
			}
		} else {
			x = null;
			log("XMLHttpRequest and  ActiveXObject are not available in your browser!", "e");
		}
		return x;
	};

	/*Controlador da janela modal (ajax)*/
	var loadModal = {
		modal: document.createElement("DIV"),
		start: function() {
			this.modal.textContent           = "Loading data, please wait!";
			this.modal.style.display         = "block";
			this.modal.style.width           = "100%";
			this.modal.style.height          = "100%";
			this.modal.style.position        = "fixed";
			this.modal.style.top             = "0";
			this.modal.style.right           = "0";
			this.modal.style.bottom          = "0";
			this.modal.style.left            = "0";
			this.modal.style.color           = "white";
			this.modal.style.backgroundColor = "black";
			this.modal.style.opacity         = "0.9";
			this.modal.style.zIndex          = "999999";
			this.modal.style.cursor          = "progress";
			return;
		},
		counter: 0,
		add: function() {
			this.counter++;
			this.check();
			return;
		},
		del: function() {
			var target = this;
			window.setTimeout(function () {
				target.counter--;
				target.check();
				return;
			}, 250);
			return;
		},
		check: function() {
			if (this.counter > 0) {
				document.body.appendChild(this.modal);
			} else if (this.counter === 0) {
				this.modal.parentElement.removeChild(this.modal);
			} else {
				this.counter = 0;
				this.modal.parentElement.removeChild(this.modal);
			}
			return;
		}
	};
	loadModal.start();

	/*Função que verifica o sucesso da requisição ajax*/
 	function stateChange(ev, method) {
 		var arg, target;
 		target = this;
 		arg = {
			error: true,
			request: target,
			text: null,
			xml: null,
			json: null
		};
		if (this.readyState === 4) {
			if (this.status === 200 || this.status === 304) {
				arg.error = false;
				arg.text = target.responseText || null;
				arg.xml  = target.responseXML || null;
				try {
					arg.json = JSON.parse(target.responseText) || eval("("+target.responseText+")");
				} catch(e) {
					arg.json = null;
				}
			}
			loadModal.del();
			method.call(this, arg);
		}
		return;
	};

/*...........................................................................*/

	function WDtext(input) {
		if (!(this instanceof WDtext)) {
			return new WDtext(input);
		}
		if (!isText(input)) {
			return new WD(input);
		}
		Object.defineProperty(this, "_value", {
			writable: true,
			value: input.trim()
		});
	};

	WDtext.prototype = Object.create(WD.prototype, {
		constructor: {
			value: WDtext
		}
	});

	/*Deixa o texto só com a primeira letra de cada palavra em maiúsculo*/
	Object.defineProperty(WDtext.prototype, "title", {
		enumerable: true,
		value: function(change) {
			var input, value;
			input = this.toString().toLowerCase().split("");
			value = "";

			for (var i = 0; i < input.length; i++) {
				if (input[i-1] === " " || i === 0) {
					value += input[i].toUpperCase();
				} else {
					value += input[i];
				}
			}
			if (change === true) {
				this._value = value;
				value =  this;
			}
			return value;
		}
	});

	/*Elimina espaços desnecessários de input*/
	Object.defineProperty(WDtext.prototype, "trim", {
		enumerable: true,
		value: function(change) {
			var value;
			value = this.toString().trim().replace(/\ +/g, " ");
			if (change === true) {
				this._value = value;
				value = this;
			}
			return value;
		}
	});

	/*Localiza e altera o conteúdo do texto pelo valor informado*/
	Object.defineProperty(WDtext.prototype, "replace", {
		enumerable: true,
		value: function(oldValue, newValue, change) {
			var value;
			value = this.toString();
			newValue = newValue === null || newValue === undefined ? "" : new String(newValue).toString();
			if (WD(oldValue).type === "regexp") {
				oldValue = new RegExp(WD(oldValue).toString(), "g");
				value = value.replace(oldValue, newValue);
			} else {
				oldValue = oldValue === null || oldValue === undefined ? "" : oldValue;
				value = value.split(oldValue).join(newValue);
			}
			if (change === true) {
				this._value = value;
				value = this;
			}
			return value;
		}
	});

	/*Elimina os acentos de input*/
	Object.defineProperty(WDtext.prototype, "clear", {
		enumerable: true,
		value: function(change) {
			var value, clear;
			var clear = {
				A: /[À-Æ]/g,
				C: /[Ç]/g,
				E: /[È-Ë]/g,
				I: /[Ì-Ï]/g,
				D: /[Ð]/g,
				N: /[Ñ]/g,
				O: /[Ò-ÖØ]/g,
				U: /[Ù-Ü]/g,
				Y: /[Ý]/g,
				a: /[à-æ]/g,
				c: /[ç]/g,
				e: /[è-ë]/g,
				i: /[ì-ï]/g,
				d: /[ð]/g,
				n: /[ñ]/g,
				o: /[ò-öø]/g,
				u: /[ù-ü]/g,
				y: /[ýÿ]/g
			};
			value = this.toString();
			if ("normalize" in String) {
				value = value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
			} else {
				for (var i in clear) {
					value = value.replace(clear[i], i);
				}
			}
			if (change === true) {
					this._value = value;
					value =  this;
				}
			return value;
		}
	});

	/*Verifica se o texto é uma caminho acessível*/
	Object.defineProperty(WDtext.prototype, "path", {
		enumerable: true,
		get: function() {
			var x, xhttp, path;
			xhttp = request();
			path  = this.toString().split("?")[0].replace(/^\'/, "");
			if (xhttp === null || path.trim() === "") {
				x = false;
			} else {
				try {
					xhttp.open("HEAD", path, false);
					xhttp.send();
					x = xhttp.status === 200 || xhttp.status === 304 ? true : false;
				} catch(e) {
					x = false;
				}
			}
			return x;
		}
	});

	/*Obtêm o conteúdo do caminho e retorna o método de requisição*/
	Object.defineProperty(WDtext.prototype, "request", {
		enumerable: true,
		value: function(method, time) {
			if (this.path === false) {
				log("\""+this.valueOf()+"\" is not an accessible path!", "w");
				return null;
			}
			if (WD(method).type !== "function") {
				log("request: The \"method\" argument is required.", "w");
				return null;
			}
			var xhttp, value, path, serial, time, types;
			xhttp  = request();
			value  = this.toString().replace(/^\'/, "").split("?");
			path   = value[0];
			serial = value[1];
			if (WD(serial).type !== "text")  {
				serial = "";
			} else if ((/^\$\{.+\}$/).test(WD(serial).toString())) {
				serial = $(getData(serial)["$"]);
				serial = serial !== null ? WD(serial).form : "";
			} else {
				serial = serial.toString();
			}
			time   = WD(time);
			if ((time.number === "integer" || time.number === "real") && time.valueOf() > 0) {
				xhttp.timeout =  1000*time.valueOf();
			}
			xhttp.onreadystatechange = function (ev) {
				stateChange.call(this, ev, method);
			}
			types = {
				get: function() {
					loadModal.add();
					try {
						xhttp.open("GET", path+"?"+serial, true);
						xhttp.send();
						return true;
					} catch(e) {
						log(e, "w");
						loadModal.del();
						return false;
					}
				},
				post: function () {
					loadModal.add();
					try {
						xhttp.open("POST", path, true);
						xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
						/*xhttp.setRequestHeader("Content-type", "multipart/form-data");*/
						xhttp.send(serial === "" ? null : serial);
						return true;
					} catch(e) {
						log(e, "w");
						loadModal.del();
						return false;
					}
				}
			}
			return types;
		}
	});

	/*Retorna o atributo type*/
	Object.defineProperties(WDtext.prototype, {
		type: {
			value: "text"
		}
	});


/* === REGEXP ============================================================== */

	function WDregexp(input) {
		if (!(this instanceof WDregexp)) {
			return new WDregexp(input);
		}

		if (!isRegExp(input)) {
			return new WD(input);
		}
		Object.defineProperty(this, "_value", {
			value: input.valueOf()
		});
	};

	WDregexp.prototype = Object.create(WD.prototype, {
		constructor: {
			value: WDregexp
		}
	});

	/*Aplica máscara ao valor de entrada se casar com a re*/
	Object.defineProperty(WDregexp.prototype, "mask", {
		enumerable: true,
		value: function (input) {
			var pattern, check, target, group, close;
			var metaReference, metacharacter, expression;
			input = String(input).toString();
			if (this._value.test(input)) {
				return input;
			}
			pattern = this.toString();
			check   = "";
			target  = "";
			group   = 1;
			close   = true;
			metaReference = ["n", "d", "D", "w", "W", "s", "S", "t", "r", "n", "v", "f", "b", "B"];
			metacharacter = ["\n", "\d", "\D", "\w", "\W", "\s", "\S", "\t", "\r", "\n", "\v", "\f", "\b", "\B"];
			expression    = ["[", "]", "|", "^", "$", ".", "(", ")", "*", "+", "?", "{", "}"];
			for (var i = 0; i < pattern.length; i++) {
				if (pattern[i] === "\\") {
					i++;
					if (!WD(metaReference).inside(pattern[i])) {
						target += pattern[i];
					}	else {
						target += metacharacter[WD(metaReference).inside(pattern[i], true)[0]];
					}
				} else if (pattern[i] === "(") {
					check  += pattern[i];
					target += "$"+group;
					close   = false;
					group++;
				} else if (pattern[i] === ")") {
					check += pattern[i];
					close  = true;
				} else if (close && !WD(expression).inside(pattern[i])) {
					target += pattern[i];
				} else {
					check += pattern[i];
				}
			}
			check = new RegExp(check);
			if (check.test(input)) {
				input = input.replace(check, target);
			} else {
				input = false;
			}
			return input;
		}
	});

	/*Retorna o método toString e o atributo type*/
	Object.defineProperties(WDregexp.prototype, {
		type: {
			value: "regexp"
		},
		toString: {
			value: function() {
				return this._value.source;
			}
		}
	});

/* === NUMBER ============================================================== */

	function WDnumber(input) {
		if (!(this instanceof WDnumber)) {
			return new WDnumber(input);
		}
		if (!isNumber(input)) {
			return new WD(input);
		}
		Object.defineProperty(this, "_value", {
			value: isString(input) ? Number(input).valueOf() : input.valueOf()
		});
	};

	WDnumber.prototype = Object.create(WD.prototype, {
		constructor: {
			value: WDnumber
		}
	});

	/*Retorna o tipo do número*/
	Object.defineProperty(WDnumber.prototype, "number", {
		enumerable: true,
		get: function() {
			var x;
			if (this.valueOf() === Infinity || this.valueOf() === -Infinity) {
				x = "infinity";
			} else if (this.valueOf() % 1 !== 0) {
				x = "real";
			} else if (this.valueOf() % 1 === 0) {
				x = "integer";
			} else {
				x = "?";
			}
			return x
		}
	});

	/*Retorna o valor inteiro do número*/
	Object.defineProperty(WDnumber.prototype, "integer", {
		enumerable: true,
		get: function() {
			var x;
			if (this.valueOf() === Infinity || this.valueOf() === -Infinity) {
				x = this.valueOf();
			} else {
				x = Number(this.toString().split(".")[0]);
			}
			return x;
		}
	});

	/*Retorna o valor decimal do número*/
	Object.defineProperty(WDnumber.prototype, "decimal", {
		enumerable: true,
		get: function() {
			var x, i;
			if (this.valueOf() === Infinity || this.valueOf() === -Infinity) {
				x = this.valueOf();
			} else if (this.valueOf() % 1 !== 0) {
				x = Number("0."+this.toString().split(".")[1]);
				x = this.valueOf() < 0 ? -1 * x : x;
			} else {
				x = 0;
			}
			return x;
		}
	});

	/*Retorna o valor absoluto do número*/
	Object.defineProperty(WDnumber.prototype, "abs", {
		enumerable: true,
		get: function() {
			return this.valueOf() < 0 ? - this.valueOf() : this.valueOf();
		}
	});

	/*Arredonda o valor para determinado número de casas ou para cima (sem argumento)*/
	Object.defineProperty(WDnumber.prototype, "round", {
		enumerable: true,
		value: function(width) {
			var x;
			width = WD(width);
			if (width.number === "integer" || width.number === "real") {
				width = WD(width.abs).integer;
				try {
				 	x = Number(this.valueOf().toFixed(width)).valueOf();
				} catch(e) {
					x = this.valueOf();
					log(e.toString(), "w");
				}
			} else {
				if (this.decimal === 0) {
					x = this.valueOf();
				} else if (this.valueOf() > 0) {
					x = this.integer+1;
				} else {
					x = this.integer-1;
				}
			}
			return x;
		}
	});

	/*Transcreve a notação científica para html*/
	Object.defineProperty(WDnumber.prototype, "power10", {
		enumerable: true,
		value: function(width, html) {
			var x, sup, value;
			sup = {
				"0": "⁰",
				"1": "¹",
				"2": "²",
				"3": "³",
				"4": "⁴",
				"5": "⁵",
				"6": "⁶",
				"7": "⁷",
				"8": "⁸",
				"9": "⁹",
				"+": "⁺",
				"-": "⁻",
				"x": "×"
			};
			if (this.number === "infinity") {
				x = this.toString();
			} else {
				try {
					width = WD(width);
					width = width.number === "integer" && width >= 0 ? width.valueOf() : undefined;
					x = this.valueOf().toExponential(width);
				} catch(e) {
					x = this.valueOf().toExponential();
				}
				if (html === true) {
					x = x.replace(/e(.+)$/, " &times; 10<sup>$1</sup>");
				} else {
					value = x.split("e")[1].split("");
					for (var i = 0; i < value.length; i++) {
						value[i] = sup[value[i]];
					}
					value = " × 10"+value.join("");
					x = x.replace(/e.+/, value);
				}
			}
			return x;
		}
	});

	/*Retorna o número no formato local ou definido no html*/
	Object.defineProperty(WDnumber.prototype, "locale", {
		enumerable: true,
		value: function(locale) {
			var x;
			if (WD(locale).type !== "text") {
				locale = lang();
			}
			try {
				x = this.valueOf().toLocaleString(locale);
			} catch(e) {
				if (this.number === "infinity") {
					x = this.toString();
				} else {
					x = this.fixed().split(".");
					x[0] = x[0].split("").reverse();
					x[0] = x[0].join("").replace(/([0-9]{3})/g, "$1,");
					x[0] = x[0].replace(/\,(\+|\-)/, "$1").split("").reverse().join("");
					x = x.join(".");
				}
			}
			return x;
		}
	});

	/*Retorna o número no formato monetário local ou defuinido no html*/
	Object.defineProperty(WDnumber.prototype, "coin", {
		enumerable: true,
		value: function(currency, locale) {
			var x;
			if (WD(locale).type !== "text")   {
				locale = lang();
			}
			if (WD(currency).type !== "text") {
				currency = locale === "en-US" ? "USD" : "¤";
			}
			if (this.number === "infinity") {
				x = this.toString();
			} else {
				try {
					x = this.valueOf().toLocaleString(locale, {style: "currency", currency: currency});
				} catch(e) {
					currency = this.valueOf() < 0 ? "-"+currency : currency;
					x = WD(WD(this.integer).abs+0.5).locale().replace(/(.)5$/, "$1");
					x = x+(WD(WD(this.decimal).abs+1).fixed(0, 2).replace(/.+([0-9]{2})$/, "$1"));
					x = currency+" "+x;
				}
			}
			return x;
		}
	});

	/*Fixa a quantidade de caracteres na parte inteira do número*/
	Object.defineProperty(WDnumber.prototype, "fixed", {
		enumerable: true,
		value: function(int, dec) {
			var integer, decimal, x;
			if (this.number === "infinity") {
				x = this.toString();
			} else {
				x = this.toString().split(".");
				integer = x[0].replace(/[^0-9]/, "");;
				decimal = x[1] === undefined ? "0" : x[1];
				integer = integer === "0" ? [] : integer.split("");
				decimal = decimal === "0" ? [] : decimal.split("");
				int = WD(int).type !== "number" ? 1 : WD(int).integer;
				dec = WD(dec).type !== "number" ? decimal.length : WD(dec).integer;
				if (WD(int).number === "infinity" || int < 1) {
					int = 1;
				}
				if (WD(dec).number === "infinity" || dec < 0) {
					dec = decimal.length;
				}
				while (integer.length < int) {
					integer.unshift("0");
				}
				while (decimal.length !== dec) {
					if (decimal.length < dec) {
						decimal.push("0");
					} else {
						decimal.pop();
					}
				}
				x = decimal.length === 0 ? integer.join("") : integer.join("")+"."+decimal.join("");
				if (this.valueOf() < 0) {
					x = "-"+x;
				}
			}
			return x;
		}
	});

	/*Retorna o método toString*/
	Object.defineProperties(WDnumber.prototype, {
		type: {
			value: "number"
		},
		toString: {
			value: function() {
				var x, str, pow, val;
				str = this.valueOf().toString();
				if (this.number === "infinity") {
					x = "∞";
				} else if ((/e\+?[0-9]+$/i).test(str) === true) {
					str = str.toLowerCase().split("e");
					val = str[0].replace(/[^0-9]/g, "").split("");
					pow = Number(str[1].replace(/[^0-9]/, "")).valueOf();
					while (val.length !== pow+1) {
						val.push("0");
					}
					x = val.join("");
				} else if ((/e-[0-9]+$/i).test(str) === true) {
					str = str.toLowerCase().split("e");
					val = str[0].replace(/[^0-9]/g, "").split("");
					pow = Number(str[1].replace(/[^0-9]/, "")).valueOf();
					for (var i = 0; i < pow; i++) {
						val.unshift("0");
					};
					x = val.join("").replace(/([0-9])/, "$1.");
				} else {
					x = str.replace(/[^0-9\.]/g, "");
				}
				x = this.valueOf() < 0 ? "-"+x : x;
				return x;
			}
		}
	});

/* === TIME ================================================================ */

	function WDtime(input) {
		if (!(this instanceof WDtime)) {
			return new WDtime(input);
		}
		if (!isTime(input)) {
			return new WD(input);
		}
		var time, x;
		input = input.replace(/\ /g, "").replace(/h/i, ":").toLowerCase();
		if (input === "%now") {
			x    = new Date();
			time = [x.getHours(), x.getMinutes(), x.getSeconds()];
		} else if ((/am$/).test(input)) {
			x     = input.replace("am", "").split(":");
			time  = [Number(x[0]).valueOf(), Number(x[1]).valueOf(), 0];
		} else if ((/pm$/).test(input)) {
			x     = input.replace("pm", "").split(":");
			time  = [x[0] === "12" ? 0 : 12 + Number(x[0]).valueOf(), Number(x[1]).valueOf(), 0];
		} else if (/^(0?[0-9]|1[0-9]|2[0-4])(\:[0-5][0-9]){1,2}$/.test(input)) {
			x     = input.split(":");
			time  = [Number(x[0]).valueOf()%24, Number(x[1]).valueOf(), x[2] === undefined ? 0 : Number(x[2]).valueOf()];
		} else throw Error("An unexpected error occurred while setting time!");

		Object.defineProperty(this, "_value", {
			writable: true,
			value: 3600*time[0]+60*time[1]+time[2]
		});
	};

	WDtime.prototype = Object.create(WD.prototype, {
		constructor: {
			value: WDtime
		}
	});

	/*Define e obtem o valor da hora*/
	Object.defineProperty(WDtime.prototype, "hour", {
		enumerable: true,
		get: function() {
			var h = WD(this.valueOf()/3600);
			return h.integer;
		},
		set: function(h) {
			var h24, h;
			h24 = 24*60*60;
			h = WD(h);
			if (h.number === "integer" || h.number === "real") {
				h = h.integer;
				if (h >= 0) {
					this._value = 3600*h + 60*this.minute + this.second;
				} else {
					this._value = 3600*h + 60*this.minute + this.second;
				}
				this.valueOf();
			}
			return;
		}
	});

	/*Define e obtem o valor do minuto*/
	Object.defineProperty(WDtime.prototype, "minute", {
		enumerable: true,
		get: function() {
			var m = this.valueOf() - 3600*this.hour;
			m = WD(m/60);
			return m.integer;
		},
		set: function(m) {
			var time;
			m = WD(m);
			if (m.number === "integer" || m.number === "real") {
				m = m.integer;
				if (m > 59 || m < 0) {
					time = 60*(m - this.minute);
					this._value += time;
				} else {
					this._value = 3600*this.hour + 60*m + this.second;
				}
				this.valueOf();
			}
			return;
		}
	});

	/*Define e obtem o valor do segundo*/
	Object.defineProperty(WDtime.prototype, "second", {
		enumerable: true,
		get: function() {
			var s = this.valueOf() - 3600*this.hour - 60*this.minute;
			return s;
		},
		set: function(s) {
			var time;
			s = WD(s);
			if (s.number === "integer" || s.number === "real") {
				s = s.integer;
				if (s > 59 || s < 0) {
					time = s - this.second;
					this._value += time;
				} else {
					this._value = 3600*this.hour + 60*this.minute + s;
				}
				this.valueOf();
			}
			return;
		}
	});


	/*Retorna a hora no formato ampm*/
	Object.defineProperty(WDtime.prototype, "h12", {
		enumerable: true,
		get: function() {
			var h, m, p;
			p = this.hour < 12 ? "AM" : "PM";
			if (this.hour === 0) {
				h = 12;
			} else if (this.hour <= 12) {
				h = this.hour;
			} else {
				h = this.hour - 12;
			}
			h = WD(h).fixed(2, 0);
			m = WD(this.minute).fixed(2, 0);
			return h+":"+m+p;
		}
	});

	/*Formata o tempo de acordo com o especificado na string*/
	Object.defineProperty(WDtime.prototype, "format", {
		enumerable: true,
		value: function(string) {
			if (WD(string).type !== "text") {
				return this.toString();
			}
			var x, chars;
			chars = {
			"%h": this.hour,
			"%H": WD(this.hour).fixed(2, 0),
			"#h": this.h12,
			"%m": this.minute,
			"%M": WD(this.minute).fixed(2, 0),
			"%s": this.second,
			"%S": WD(this.second).fixed(2, 0),
			};
			x = WD(string);
			for (var i in chars) {
				if (x.toString().indexOf(i) >= 0) {
					x.replace(i, chars[i], true);
				}
			}
			return x.toString();
		}
	});

	/*Retorna o método toString e valueOf*/
	Object.defineProperties(WDtime.prototype, {
		type: {
			value: "time"
		},
		toString: {
			value: function() {
				return this.format("%H:%M:%S");
			}
		},
		valueOf: {
			value: function() {
				var h24, x;
				h24 = 24*60*60;
				x   = WD(this._value);
				if (x.type !== "number" || x.number === "infinity") {
					log("Improper change of internal value has been adjusted to the minimum value.", "w");
					this._value = 0;
				} else if (x.number !== "integer") {
					log("Considering that time was defined as a non-integer value, its value was approximated!", "w");
					this._value = WD(this._value).integer;
				}
				if (this._value < 0) {
					this._value = this._value % h24 + h24;
				} else if (this._value >= h24) {
					this._value = this._value % h24;
				}
				return this._value;
			}
		}
	});

/* === DATE ================================================================ */

	/*Parâmetros de configuração de data*/
	var Y_min    = 1;    /*ano inicial*/
	var Y_max    = 9999; /*ano final*/
	var Y_004    = 4;    /*primeiro ano divisível por 4*/
	var Y_100    = 100   /*primeiro ano divisível por 100*/
	var Y_400    = 400   /*primeiro ano divisível por 400*/
	var WEEK_1st = 1;    /*dia da semana + 1 de DATE_min*/
	var DATE_min = dateToNumber(Y_min, 1, 1);   /*data mínima*/
	var DATE_max = dateToNumber(Y_max, 12, 31); /*data máxima*/

	/*Retorna o dia do ano*/
	function dateDayYear(y, m, d) {
		/*Retorna o da do ano*/
		var x365, x366, x;
		x365 = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
		x366 = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
		x = isLeap(y) ? x366[m-1]+d : x365[m-1]+d;
		return x;
	};

	/*Converte uma data para seu valor numérico*/
	function dateToNumber(y, m, d) {
		var l4, l100, l400, delta, x;
		delta = WD(y === Y_min ? 0 : 365*(y - Y_min));
		l4    = WD(y  <  Y_004 ? 0 : (y - 1)/4);
		l100  = WD(y  <  Y_100 ? 0 : (y - 1)/100);
		l400  = WD(y  <  Y_400 ? 0 : (y - 1)/400);
		x = delta.integer + l4.integer - l100.integer + l400.integer + dateDayYear(y, m, d);
		return x;
	};

/*...........................................................................*/

	function WDdate(input) {
		if (!(this instanceof WDdate)) {
			return new WDdate(input);
		}
		if (!isDate(input)) {
			return new WD(input);
		}
		var date, x;
		if ("Date" in window && (input instanceof Date || input.constructor === Date)) {
			x = input;
			date = [x.getFullYear(), x.getMonth()+1, x.getDate()];
		} else {
			input = input.trim();
			if (input === "%today") {
				x = new Date();
				date = [x.getFullYear(), x.getMonth()+1, x.getDate()];
			} else if (input.split("-").length === 3) {
				x = input.split("-");
				date = [x[0], x[1], x[2]];
			} else if (input.split("/").length === 3) {
				x = input.split("/");
				date = [x[2], x[0], x[1]];
			} else if (input.split(".").length === 3) {
				x = input.split(".");
				date = [x[2], x[1], x[0]];
			} else throw Error("An unexpected error occurred while setting date!");
		}
		for (var i = 0; i < date.length; i++) {
			x = WD(date[i]);
			if (x.number !== "integer" || date[i] <= 0) throw Error("An unexpected error occurred while setting date!");
			date[i] = x.valueOf();
		}

		Object.defineProperty(this, "_value", {
			writable: true,
			value: dateToNumber(date[0], date[1], date[2])
		});
	};

	WDdate.prototype = Object.create(WD.prototype, {
		constructor: {
			value: WDdate
		}
	});

	/*Obtêm e define o ano*/
	Object.defineProperty(WDdate.prototype, "year", {
		enumerable: true,
		get: function() {
			var y;
			y = WD(this.valueOf()/365).integer + Y_min;
			while (dateToNumber(y, 1, 1) > this.valueOf()) {
				y--;
			}
			return y;
		},
		set: function(x) {
			var y = WD(x);
			if (y.type !== "number") {
				log("The value must be a positive integer between "+Y_min+" and "+Y_max+".", "w");
			} else if (y.valueOf() > Y_max) {
				this._value = DATE_max;
			} else if (y.valueOf() < Y_min) {
				this._value = DATE_min;
			} else {
				this._value = dateToNumber(y.integer, this.month, this.day);
			}
			return this.valueOf();
		}
	});

	/*Obtêm e define o mês*/
	Object.defineProperty(WDdate.prototype, "month", {
		enumerable: true,
		get: function() {
			var m = 1;
			while (dateToNumber(this.year, m+1, 1) - 1 < this.valueOf()) {
				m++;
			}
			return m;
		},
		set: function(x) {
			var y, m, d;
			y = this.year;
			m = WD(x);
			d = this.day;
			if (m.type !== "number" || m.number === "infinity") {
				log("The value must be an integer.", "w");
			} else {
				m = m.integer;
				if (m === 0) {
					y = this.year-1;
					m = 12;
				} else if (m < 0) {
					y = this.year + WD((m - 12)/12).integer;
					m = 12 + m%12;
				} else if (m > 12) {
					y = this.year + WD((m - 1)/12).integer;
					m = m%12;
				}
				if (WD([4, 6, 9, 11]).inside(m) && d > 30) {
					d = 30;
				} else if (m === 2 && d > 28) {
					d = isLeap(y) ? 29 : 28;
				}
				this._value = dateToNumber(y, m, d);
			}
			return this.valueOf();
		}
	});

	/*Retorna o mês em formato textual*/
	Object.defineProperties(WDdate.prototype, {
		shortMonth: {
			enumerable: true,
			value: function(locale) {
				if (WD(locale).type !== "text") {
					locale = lang();
				}
				var x, main, ref;
				main = [
					"Jan", "Feb", "Mar", "Apr",
					"May", "Jun", "Jul", "Aug",
					"Sep", "Oct", "Nov", "Dec"
				];
				try {
					ref = new Date(2010, this.month - 1, 1, 12, 0, 0, 0);
					x = ref.toLocaleString(locale, {month: "short"});
				} catch(e) {
					log("shortMonth: Default behavior has been performed!", "w");
					x = main[this.month-1];
				}
				return x.toLowerCase();
			}
		},
		longMonth: {
			enumerable: true,
			value: function(locale) {
				if (WD(locale).type !== "text") {
					locale = lang();
				}
				var x, main, ref;
				main = [
					"January",   "February", "March",    "April",
					"May",       "June",     "July",     "August",
					"September", "October",  "November", "December"
				];
				try {
					ref = new Date(2010, this.month - 1, 1, 12, 0, 0, 0);
					x = ref.toLocaleString(locale, {month: "long"});
				} catch(e) {
					log("longMonth: Default behavior has been performed!", "w");
					x = main[this.month-1];
				}
				return x.toLowerCase();
			}
		}
	});

	/*Obtêm e define o dia*/
	Object.defineProperty(WDdate.prototype, "day", {
		enumerable: true,
		get: function() {
			var d = 1;
			while (dateToNumber(this.year, this.month, d) !== this.valueOf()) {
				d++;
			}
			return d;
		},
		set: function(x) {
			var d, z;
			d = WD(x);
			if (d.type !== "number" || d.number === "infinity") {
				log("The value must be an integer.", "w");
			} else {
				d = d.integer;
				if (d > this.width) {
					z = this.valueOf() + d - this.day;
				} else if (d < 1) {
					z = this.valueOf() - (this.day - d);
				} else {
					z = this.valueOf() + (d - this.day);
				}
				this._value = z;
			}
			return this.valueOf();
		}
	});

	/*Pequenos métodos para data*/
	Object.defineProperties(WDdate.prototype, {
		leap: {
			enumerable: true,
			get: function() {toString()
				return isLeap(this.year);
			}
		},
		week: {
			enumerable: true,
			get: function() {
				return (this.valueOf() + WEEK_1st)%7 === 0 ? 7 : (this.valueOf() + WEEK_1st)%7;
			}
		},
		days: {
			enumerable: true,
			get: function() {
				var y, ref;
				y   = WD(this.year).fixed(4, 0);
				ref = WD(y+"-01-01").valueOf();
				return this.valueOf() - ref + 1;
			}
		},
		weeks: {
			enumerable: true,
			get: function() {
				var ref, weeks, y;
				y     = WD(this.year).fixed(4, 0);
				ref   = WD(y+"-01-01").week;
				weeks = WD(1 + (ref + this.days - 2)/7).integer;
				return weeks;
			}
		},
		width: {
			enumerable: true,
			get: function() {
				var w;
				if (WD([1, 3, 5, 7, 8, 10, 12]).inside(this.month)) {
					w = 31;
				} else if (WD([4, 6, 9, 11]).inside(this.month)) {
					w = 30;
				} else {
					w = this.leap ? 29 : 28;
				}
				return w;
			}
		},
		countdown: {
			enumerable: true,
			get: function() {
				return (this.leap ? 366 : 365) - this.days;
			}
		}
	});

	/*Retorna o dia da semana em formato textual*/
	Object.defineProperties(WDdate.prototype, {
		shortWeek: {
			enumerable: true,
			value: function(locale) {
				if (WD(locale).type !== "text") {
					locale = lang();
				}
				var x, main, ref;
				main = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
				main = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				try {
					ref = new Date(1970, this.month - 1, 15, 12, 0, 0, 0);
					ref.setDate(15 + this.week - (ref.getDay()+1));
					ref.toLocaleString(locale);
					x = ref.toLocaleString(locale, {weekday: "short"});
				} catch(e) {
					log("shortWeek: Default behavior has been performed!", "w");
					x = main[this.week-1];
				}
				return x.toLowerCase();
			}
		},
		longWeek: {
			enumerable: true,
			value: function(locale) {
				if (WD(locale).type !== "text") {
					locale = lang();
				}
				var x, main, ref;
				main = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				try {
					ref = new Date(1970, this.month - 1, 15, 12, 0, 0, 0);
					ref.setDate(15 + this.week - (ref.getDay()+1));
					ref.toLocaleString(locale);
					x = ref.toLocaleString(locale, {weekday: "long"});
				} catch(e) {
					log("shortWeek: Default behavior has been performed!", "w");
					x = main[this.week-1];
				}
				return x.toLowerCase();
			}
		}
	});

	/*Formata a data de acordo com a string informada*/
	Object.defineProperty(WDdate.prototype, "format", {
		enumerable: true,
		value: function(string, locale) {
			if (WD(string).type !== "text") {
				return this.toString();
			}
			var x, chars;
			chars = {
				"%d": this.day,
				"%D": WD(this.day).fixed(2, 0),
				"@d": this.days,
				"%m": this.month,
				"%M": WD(this.month).fixed(2, 0),
				"@m": this.width,
				"#m": this.shortMonth(locale),
				"#M": this.longMonth(locale),
				"%y": this.year,
				"%Y": WD(this.year).fixed(4, 0),
				"%w": this.week,
				"@w": this.weeks,
				"#w": this.shortWeek(locale),
				"#W": this.longWeek(locale),
				"%l": this.leap ? 366 : 365,
				"%c": this.countdown
			}
			x = WD(string);
			for (var i in chars) {
				if (x.toString().indexOf(i) >= 0) {
					x.replace(i, chars[i], true);
				}
			}
			return x.toString();
		}
	});

	/*Retorna o método toString e valueOf*/
	Object.defineProperties(WDdate.prototype, {
		type: {
			value: "date"
		},
		toString: {
			value: function() {
				return this.format("%Y-%M-%D");
			}
		},
		valueOf: {
			value: function() {
				if (WD(this._value).type !== "number") {
					log("Improper change of internal value has been adjusted to the minimum value.", "w");
					this._value = DATE_min;
				} else if (this._value < DATE_min) {
					log("Lower limit for date has been extrapolated. Limit value set.", "w");
					this._value = DATE_min;
				} else if (this._value > DATE_max) {
					log("Upper limit for date has been extrapolated. Limit value set.", "w");
					this._value = DATE_max;
				} else if (WD(this._value).number !== "integer") {
					log("Incorrect change of internal value was adjusted to approximate value.", "w");
					this._value = WD(this._value).integer;
				}
				return this._value;
			}
		}
	});

/* === ARRAY =============================================================== */

	function WDarray(input) {
		if (!(this instanceof WDarray)) {
			return new WDarray(input);
		}
		if (!isArray(input)){
			return new WD(input);
		}
		var x = [];
		if ("slice" in input) {
			x = input.slice();
		} else {
			for (var i = 0; i < input.length; i++) {
				x.push(input[i]);
			}
		}
		Object.defineProperty(this, "_value", {
			value: x
		});
	};

	WDarray.prototype = Object.create(WD.prototype, {
		constructor: {
			value: WDarray
		}
	});

	/*Informar o comprimento do array*/
	Object.defineProperties(WDarray.prototype, {
		items: {
			enumerable: true,
			get: function() {
				return this.valueOf().length;
			}
		},
		item: {
			enumerable: true,
			value: function(i) {
				var x;
				i = WD(i);
				if (i.type !== "number") {
					x = this.valueOf();
				} else if (i.valueOf() < 0) {
					x = this.valueOf()[this.items - i.abs];
				} else {
					x = this.valueOf()[i.valueOf()];
				}
				return x;
			}
		}
	});

	/*Informar se o argumento está contido no array*/
	Object.defineProperty(WDarray.prototype, "inside", {
		enumerable: true,
		value: function(item, show) {
			if (show !== true) {
				show = false;
			}
			var x;
			x = show === true ? [] : false;
			for (var i = 0; i < this.items; i++) {
				if (this.valueOf()[i] === item) {
					if (show === true) {
						x.push(i);
					} else {
						x = true;
						break;
					}
				}
			}
			return x;
		}
	});

	/*Remove todos os itens do array e o retorna*/
	Object.defineProperty(WDarray.prototype, "del", {
		enumerable: true,
		value: function() {
			for (var i = 0 ; i < arguments.length; i++) {
				while (this.inside(arguments[i])) {
					this._value.splice(this.valueOf().indexOf(arguments[i]), 1);
				}
			}
			return this.valueOf();
		}
	});

	/*Adiciona itens ao array e o retorna*/
	Object.defineProperty(WDarray.prototype, "add", {
		enumerable: true,
		value: function() {
			for (var i = 0 ; i < arguments.length; i++) {
					this._value.push(arguments[i]);
			}
			return this.valueOf();
		}
	});

	/*Adiciona itens se o item não existir e recíproca*/
	Object.defineProperty(WDarray.prototype, "toggle", {
		enumerable: true,
		value: function() {
			for (var i = 0 ; i < arguments.length; i++) {
				if (this.inside(arguments[i])) {
					this.del(arguments[i]);
				} else {
					this.add(arguments[i]);
				}
			}
			return this.valueOf();
		}
	});

	/*Retorna a quantidade de vezes que o item aparece em array*/
	Object.defineProperty(WDarray.prototype, "count", {
		enumerable: true,
		value: function(item) {
			return this.inside(item, true).length;
		}
	});

	/*Troca o valor antigo pelo novo valor em todas ocorrências*/
	Object.defineProperty(WDarray.prototype, "replace", {
		enumerable: true,
		value: function(item, value) {
			var index;
			index = this.inside(item, true);
			for (var i = 0 ; i < index.length; i++) {
				this._value[index[i]] = value;
			}
			return this.valueOf();
		}
	});

	Object.defineProperty(WDarray.prototype, "unique", {
		enumerable: true,
		value: function(sort) {
			var array;
			array = sort === true ? this.sort() : this.valueOf();
			array =  array.filter(function(v, i, a) {
				return a.indexOf(v) == i;
			});
			return array;
		}
	});

	/*Retorna o array ordenado: nulo, números, tempo, data, text e outros*/
	Object.defineProperty(WDarray.prototype, "sort", {
		enumerable: true,
		value: function(unique) {
			var asort, type, seq, array, key;
			asort = {};
			/*agrupando em arrays os items pelo tipo*/
			for (var i = 0; i < this.items; i++) {
				type = WD(this.item(i)).type
				if (!(type in asort)) {
					asort[type] = [];
				}
				asort[type].push(this.item(i));
			}
			/*determinando a ordem de cada tipo*/
			for (var t in asort) {
				asort[t].sort(function(a, b) {
					var order, x, y;
					if (t === "dom") {
						x = a.textContent || a.innerText || a.innerHTML;
						y = b.textContent || b.innerText || b.innerHTML;
						order = WD([x, y]).sort().indexOf(x) > 0 ? 1 : -1;
					} else if (["number", "boolean", "date", "time"].indexOf(t) >= 0) {
						x = WD(a).valueOf();
						y = WD(b).valueOf();
						order = x - y >= 0 ? 1 : -1;
					} else {
						x = WD(a).toString().trim().toUpperCase();
						y = WD(b).toString().trim().toUpperCase();
						order = x > y ? 1 : -1;
					}
					return order;
				});
			}
			array = [];
			/*montando array conforme ordem de tipos*/
			seq = ["null", "number", "time", "date", "text"];
			for (var j = 0; j < seq.length; j++) {
				key = seq[j];
				if (key in asort) {
					for (var k = 0; k < asort[key].length; k++) {
						array.push(asort[key][k]);
					}
				}
			}
			/*Adicionando os outros itens ao array*/
			for (var p in asort) {
				if (seq.indexOf(p) < 0) {
					for (var q = 0; q < asort[p].length; q++) {
						array.push(asort[p][q]);
					}
				}
			}
			/*verificando argumento*/
			if (unique === true) {
				array = WD(array).unique();
			}
			return array;
		}
	});

	/*Define método toString*/
	Object.defineProperties(WDarray.prototype, {
		type: {
			value: "array"
		},
		toString: {
			value: function() {
				var x;
				try {
					x = JSON.stringify(this._value);
				} catch(e) {
					x = this._value.toString();
				}
				return x;
			}
		}
	});

/* === DOM ================================================================= */

	/*Transforma atributo com traço para camel case*/
	function camelCase(input) {
		var x = WD(input).toString();
		if ((/\-/).test(x)) {
			x = WD(x.replace(/\-/g, " ")).title(true).toString().split(" ");
			x[0] = x[0].toLowerCase();
			x = x.join("");
		}
		return x;
	};

	/*Define a função para os disparadores*/
	function getEventMethod(input) {
		var wdEventHandler = function(ev) {
			var methods = input;
			if (ev === "getMethods") {
				return methods;
			}
			for (var i = 0; i < methods.length; i++) {
				methods[i].call(this, ev);
			}
			return;
		};
		return wdEventHandler;
	};

/*...........................................................................*/

	function WDdom(input) {
		if (!(this instanceof WDdom)) {
			return new WDdom(input);
		}
		if (!isDOM(input)){
			return new WD(input);
		}
		Object.defineProperty(this, "_value", {
			value: input
		});
	};

	WDdom.prototype = Object.create(WD.prototype, {
		constructor: {
			value: WDdom
		}
	});

	/*Executa o método informado loopando todos elementos html (input)*/
	Object.defineProperty(WDdom.prototype, "run", {
		enumerable: true,
		value: function(method) {
			if (WD(method).type === "function") {
				var x;
				for (var i = 0; i < this.valueOf().length; i++) {
					x = this.valueOf()[i];
					if (x !== window && x.nodeType != 1 && x.nodeType != 9) {
						continue;
					}
					method(x);
				}
			} else {
				log("run: Invalid argument!", "w");
			}
			return this;
		}
	});

	/*Carrega página HTML requisitada no elemento informado*/
	Object.defineProperty(WDdom.prototype, "load", {
		enumerable: true,
		value: function(text) {
			this.run(function(elem) {
				var scripts, script;
				elem.innerHTML = text;
				scripts = elem.querySelectorAll("script");
				for (var i = 0; i < scripts.length; i++) {
					script = document.createElement("script");
					if (scripts[i].src === "") {
						script.textContent = scripts[i].textContent;
					} else {
						script.src = scripts[i].src;
					}
					elem.appendChild(script);
					WD(script).action("del");
				}
				loadingProcedures();
				return;
			});
			return this;
		}
	});

	/*Define o valor dos atributos data*/
	Object.defineProperty(WDdom.prototype, "data", {
		enumerable: true,
		value: function(obj) {
			if (obj === null || WD(obj).type === "object") {
				this.run(function(elem) {
					var key;
					if (obj === null) {
						for (key in elem.dataset) {
							delete elem.dataset[key];
						}
					} else {
						for (var i in obj) {
							key = camelCase(i);
							if (obj[i] === null) {
								delete elem.dataset[key];
							} else {
								elem.dataset[key] = WD(obj[i]).type === "regexp" ? WD(obj[i]).toString() : obj[i];
								settingProcedures(elem, key);
							}
						}
					}
					return;
				});
			} else {
				log("data: Invalid argument!", "w");
			}
			return this;
		}
	});

	/*Define o atributo style do elemento a partir da nomenclatura CSS*/
	Object.defineProperty(WDdom.prototype, "style", {
		enumerable: true,
		value: function(styles) {
			if (styles === null || WD(styles).type === "object") {
				this.run(function(elem) {
					var key;
					if (styles === null) {
						while (elem.style.length > 0) {
							key = elem.style[0];
							elem.style[key] = null;
						}
					} else {
						for (var i in styles) {
							key = camelCase(i);
							if (!(key in elem.style)) {
								log("style: Unknown attribute. ("+i+")", "w");
							}
							elem.style[key] = styles[i];
						}
					}
					return;
				});
			} else {
				log("style: Invalid argument!", "w");
			}
			return this;
		}
	});

	/*Manipula os valores do atributo class*/
	Object.defineProperty(WDdom.prototype, "class", {
		enumerable: true,
		value: function (list) {
			if (list === null || WD(list).type === "object") {
				this.run(function(elem) {
					var css, cls, i;
					css = WD(elem.className);
					css = css.type === "null" ? [] : css.trim().split(" ");
					if (list === null) {
						css = [];
					} else {
						css = WD(css);
						if (WD(list.add).type === "text") {
							cls = WD(list.add).trim().split(" ");
							for (i = 0; i < cls.length; i++) {
								css.add(cls[i]);
							}
						}
						if (WD(list.del).type === "text") {
							cls = WD(list.del).trim().split(" ");
							for (i = 0; i < cls.length; i++) {
								css.del(cls[i]);
							}
						}
						if (WD(list.toggle).type === "text") {
							cls = WD(list.toggle).trim().split(" ");
							for (i = 0; i < cls.length; i++) {
								css.toggle(cls[i]);
							}
						}
						css = css.valueOf();
					}
					elem.className = WD(css).sort(true).join(" ");
					return;
				});
			} else {
				log("class: Invalid argument!", "w");
			}
			return this;
		}

	});

	/*Exibe somente os elementos filhos cujo conteúdo textual contenha o valor informado*/
	Object.defineProperty(WDdom.prototype, "filter", {
		enumerable: true,
		value: function (text, min, show) {
			if (show !== false) {
				show = true;
			}
			if (WD(min).type !== "number" || WD(min).number === "infinity" || min < 0) {
				min = 0;
			}
			if (WD(text) !== "text") {
				text = String(text).toString();
			}
			min  = WD(min).integer;
			text = text.toUpperCase();
			this.run(function (elem) {
				var child, content;
				child  = elem.children;
				for (var i = 0; i < child.length; i++) {
					if (!("textContent" in child[i])) {
						continue;
					}
					content = child[i].textContent.toUpperCase();
					if (show === true) {
						if (text.length < min || content.indexOf(text) >= 0 || text === "") {
							WD(child[i]).action("show");
						} else {
							WD(child[i]).action("hide");
						}
					} else {
						if (text.length >= min && content.indexOf(text) >= 0 && text !== "") {
							WD(child[i]).action("show");
						} else {
							WD(child[i]).action("hide");
						}
					}
				};
				return;
			});
			return this;
		}
	});

	/*Define ação para o objeto html*/
	Object.defineProperty(WDdom.prototype, "action", {
		enumerable: true,
		value: function (action) {
			action = String(action).toString().toLowerCase();
			this.run(function(elem) {
				var tag = elem.tagName.toUpperCase();
				switch(action) {
					case "open":
						if ("open" in elem) {
							elem.open = true;
						} else {
							WD(elem).class({add: "wd-open"});
						}
						break;
					case "close":
						if ("open" in elem) {
							elem.open = false;
						} else {
							WD(elem).class({del: "wd-open"});
						}
						break;
					case "toggle-open":
						if ("open" in elem) {
							elem.open = elem.open !== true ? true : false;
						} else {
							WD(elem).class({toggle: "wd-open"});
						}
						break;
					case "tab":
						var bros = elem.parentElement.children;
						WD(bros).action("hide");
						WD(elem).action("show");
						break;
					case "del":
						if (elem.remove !== undefined) {
							elem.remove();
							} else {
							elem.parentElement.removeChild(elem);
						}
						break;
					case "show":
						WD(elem).class({del: "js-wd-no-display"});
						break;
					case "hide":
						WD(elem).class({add: "js-wd-no-display"});
						break;
					case "check":
						if ("checked" in elem) {
							elem.checked = true;
						} else {
							WD(elem).class({add: "wd-cheked"});
						}
						break;
					case "uncheck":
						if ("checked" in elem) {
							elem.checked = false;
						} else {
							WD(elem).class({del: "wd-cheked"});
						}
						break;
					case "toggle-check":
						if ("checked" in elem) {
							elem.checked = elem.checked !== true ? true : false;
						} else {
							WD(elem).class({toggle: "wd-cheked"});
						}
						break;
					case "clean":
						if ("value" in elem) {
							elem.value = "";
						} else if ("textContent" in elem) {
							elem.textContent = ""
						} else if ("innerHTML" in elem) {
							elem.innerHTML = "";
						}
						break;
					}
					return;
				});
			return this;
		}
	});

	/*Adiciona ou remove disparadores*/
	Object.defineProperty(WDdom.prototype, "handler", {
		enumerable: true,
		value: function (events) {
			if (events === null || WD(events).type === "object") {
				this.run(function(elem) {
					var action, event, methods, array, wdEventHandler;
					if (events === null) {
						for (var i in elem) {
							if ((/^on/i).test(i) && WD(elem[i]).type === "function") {
								if (elem[i].name === "wdEventHandler") {
									elem[i] = null;
								}
							}
						}
					} else {
						for (var i in events) {
							action = (/^\-/).test(i) ? "del" : "add";
							event  = i.replace(/[^a-zA-Z]/g, "").toLowerCase();
							event  = (/^on/).test(event) ? event : "on"+event;
							if (!(event in elem)) {
								log("handler: Unknown event. ("+event+")", "w");
							}
							var array;
							if (WD(elem[event]).type !== "function") {
								array = WD([]);
							} else if (elem[event].name === "wdEventHandler") {
								array = WD(elem[event]("getMethods"));
							} else {
								array = WD([elem[event]]);
							}
							methods = WD(events[i]).type === "array" ? events[i] : [events[i]];
							for (var m = 0; m < methods.length; m++) {
								if (WD(methods[m]).type !== "function" && methods[m] !== null ) {
									log("handler: Invalid key value. ("+event+")", "w");
									continue;
								}
								if (methods[m] === null) {
									array = WD([]);
								} else if (action === "add") {
									array.add(methods[m]);
								} else {
									array.del(methods[m]);
								}
							}
							array = array.valueOf();
							if (array.length > 0) {
								elem[event] = getEventMethod(array);
							} else {
								elem[event] = null;
							}
						}
					}
					return;
				});
			} else {
				log("handler: Invalid argument!", "w");
			}
			return this;
		}
	});

	/*Constroi elementos html a partir de um array de objetos*/
	Object.defineProperty(WDdom.prototype, "repeat", {
		enumerable: true,
		value: function (json) {
			if (WD(json).type === "array") {
				this.run(function(elem) {
					var inner, re, html;
					html = elem.innerHTML;
					if (html.search(/\{\{.+\}\}/gi) >= 0) {
						elem.dataset.wdRepeatModel = html;
					} else if ("wdRepeatModel" in elem.dataset) {
						html = elem.dataset.wdRepeatModel;
					} else {
						html = null;
					}
					if (html === null) {
						elem.innerHTML = "<center><mark><small>-- Error: Replication structure not found! --</small></mark></center>";
					} else {
						elem.innerHTML = "";
						html = WD(html).replace("}}=\"\"", "}}");
						for (var i = 0; i < json.length; i++) {
							inner = html;
							if (WD(json[i]).type !== "object") {
								log("repeat: Incorrect structure ignored!", "i");
								continue;
							}
							for (var c in json[i]) {
								inner = WD(inner).replace("{{"+c+"}}", json[i][c]);
							}
							elem.innerHTML += inner;
						}
						loadingProcedures();
					}
					return;
				});
			} else {
				log("repeat: Invalid argument.", "w");
			}
			return this;
		}
	});

	/*Exibe somente os elementos filhos no intervalo numérico informado*/
	Object.defineProperty(WDdom.prototype, "page", {
		enumerable: true,
		value: function (page, size) {
			page = WD(page).type !== "number" ? 0 : WD(page).integer;
			size = WD(size).type !== "number" || WD(size).abs === Infinity ? 1 : WD(size).abs;
			this.run(function(elem) {
				var lines, amount, width, pages, start, end;
				lines  = elem.children;
				amount = lines.length;
				width  = size <= 1 ? WD(size * amount).integer : WD(size).integer;
				pages  = WD(amount / width).round();
				if (page >= pages - 1 || page === -1) {/*page igual ou posterior a última página*/
					start = (pages - 1) * width;
					end   = amount - 1;
				} else if (pages + page <= 0) {/*-page igual ou anterior a primeira página*/
					start = 0;
					end   = start + width - 1;
				} else if (page < 0) {/*-page entre a primeira e última página*/
					start = (pages + page) * width;
					end   = start + width - 1;
				} else {/*page entre a primeira e última página*/
					start = page * width;
					end   = start + width - 1;
				}
				WD(lines).action("hide");
				for (var i = start; i <= end; i++) {
					WD(lines[i]).action("show");
				}
				return;
			});
			return this;
		}
	});

	/*Ordena os filhos do elemento com base em seu conteúdo textual*/
	Object.defineProperty(WDdom.prototype, "sort", {
		enumerable: true,
		value: function (order, col) {
			order = WD(order);
			col   = WD(col);
			this.run(function(elem) {
				var array, asort, childs;
				array = WD(elem.children).valueOf();
				/*para ordenar os filhos através dos netos*/
				if (col.number === "integer" && col.valueOf() >= 0) {
					col = col.valueOf();
					/*verificando e definindo netos*/
					for (var i = 0; i < array.length; i++) {
						childs = array[i].children;
						if (childs.length > 0 && childs.length > col) {
							array[i] = childs[col];
						}
					}
					/*ordenando*/
					asort = WD(array).sort();
					/*redefinindo os filhos*/
					for (var k = 0; k < asort.length; k++) {
						if (asort[k].parentElement !== elem) {
							asort[k] = asort[k].parentElement;
						}
					}
				/*caso contrário, ordenar só os filhos*/
				} else {
					asort = WD(array).sort();
				}
				/*Definindo a ordem dos elementos*/
				if (order.type === "number" && order.valueOf() < 0) {
					asort = asort.reverse();
				}
				/*adicionando os elementos ao pai*/
				for (var j = 0; j < asort.length; j++) {
					elem.appendChild(asort[j]);
				}
				return;
			});
			return this;
		}
	});

	/*Obtêm o estilo aplicado aos elementos (lista)*/
	Object.defineProperty(WDdom.prototype, "getStyle", {
		enumerable: true,
		value: function(css) {
			var x, style;
			x = [];
			if (!("getComputedStyle" in window)) {
				log("getStyle: Your browser does not have the necessary tool!", "w");
			} else if (WD(css).type === "text") {
				this.run(function(elem) {
					style = window.getComputedStyle(elem, null);
					x.push(css in style ? style.getPropertyValue(css) : null);
					return;
				});
			} else {
				log("getStyle: Invalid argument.", "w");
			}
			return x;
		}
	});

	/*Obtem a serialização de formulário*/
	Object.defineProperty(WDdom.prototype, "form", {
		enumerable: true,
		get: function() {
			var x;
			x = [];
			this.run(function(elem) {
				var tag, type, font, name, value, check;
				tag   = elem.tagName.toLowerCase();
				type  = tag === "input" ? elem.type.toLowerCase() : null; /*considerado no objeto*/
				font  = tag === "input" ? elem.attributes.type.value.toLowerCase() : type; /*informado no html*/
				name  = "name"  in elem ? elem.name  : null;
				value = "value" in elem ? elem.value : null;
				check = type === "radio" || type === "checkbox" ? elem.checked : null;
				if ((type === "radio" || type === "checkbox") && check !== true) {
					value = null;
				} else if (type === "radio" || type === "checkbox" && check === true) {
					value =  WD(value).type === "null" ? "True" : value;
				} else if (type === "date" || font === "date") {
					value = value !== "%today" && WD(value).type === "date" ? WD(value).toString() : value;
				} else if (type === "time" || font === "time") {
					value = value !== "%now" && WD(value).type === "time" ? WD(value).toString() : value;
				} else if (type === "number" || font === "number") {
					value = WD(value).type === "number" ? WD(value).valueOf() : value;
				} else if (type === "range" || font === "range") {
					value = WD(value).type === "number" ? WD(value).valueOf() : value;
				}
				if (WD(value).type !== "null" && WD(name).type !== "null") {
					x.push(name+"="+encodeURIComponent(value));
				}
				return;
			});
			return x.join("&");
		}
	});

	/*Retorna o método toString, valueOf*/
	Object.defineProperties(WDdom.prototype, {
		type: {
			value: "dom"
		},
		valueOf: {
			value: function() {
				var x;
				if (this._value === document || this._value === window) {
					x = [this._value];
				} else if (this._value instanceof HTMLElement) {
					x = [this._value];
				} else {
					x = [];
					for (var i = 0; i < this._value.length; i++) {
						x.push(this._value[i]);
					}
				}
				return x;
			}
		},
		items: {
			enumerable: true,
			get: function() {
				return this.valueOf().length;
			}
		},
		item: {
			enumerable: true,
			value: function(i) {
				var x;
				i = WD(i);
				if (i.type !== "number") {
					x = this.valueOf();
				} else if (i.valueOf() < 0) {
					x = this.valueOf()[this.items - i.abs];
				} else {
					x = this.valueOf()[i.valueOf()];
				}
				return x;
			}
		}
	});

/* === JS ATTRIBUTES ======================================================= */

	/*Carrega html externo data-wd-load=post{file}|get{file}*/
	function data_wdLoad(e) {
		var value, method, file, ajax, target;
		if ("wdLoad" in e.dataset) {
			value  = getData(e.dataset.wdLoad);
			if ("post" in value || "get" in value) {
				method = "post" in value ? "post" : "get";
				file   = value[method];
				ajax   = WD(file);
				target = WD(e);
				target.data({wdLoad: null});
				if (ajax.path === true) {
					ajax.request(function(x) {
						if (x.error) {
							log(file+": The request with the file failed.", "e");
						} else {
							target.load(x.text);
						}
						return;
					})[method]();
				}
			}
		}
		return;
	};

	/*Constroe html a partir de um arquivo json data-wd-repeat=post{file}|get{file}*/
	function data_wdRepeat(e) {
		var value, method, file, ajax, target;
		if ("wdRepeat" in e.dataset) {
			value  = getData(e.dataset.wdRepeat);
			if ("post" in value || "get" in value) {
				method = "post" in value ? "post" : "get";
				file   = value[method];
				ajax   = WD(file);
				target = WD(e);
				target.data({wdRepeat: null});
				if (ajax.path === true) {
					ajax.request(function(x) {
						if (x.error || x.json === null) {
							log(file+": The request with the JSON file failed.", "e");
						} else {
							target.repeat(x.json);
						}
						return;
					})[method]();
				}
			}
		}
		return;
	};

	/*Faz requisição a um arquivo externo data-wd-request=post{file}method{function()}|get{file}method{function()}*/
	function data_wdRequest(e) {
		var value, func, file, ajax, target, method;
		if ("wdRequest" in e.dataset) {
			value  = getData(e.dataset.wdRequest);
			if ("post" in value || "get" in value) {
				method = "post" in value ? "post" : "get";
				file   = value[method];
				ajax   = WD(file);
				func   = WD(window[value.method]).type === "function" ? window[value.method] : undefined;
				if (ajax.path === true) {
					ajax.request(func)[method]();
				}
			}
		}
		return;
	};

	/*Ordena elementos filhos data-wd-sort="number"*/
	function data_wdSort(e) {
		var order;
		if ("wdSort" in e.dataset) {
			order = WD(e.dataset.wdSort).valueOf();
			WD(e).sort(order).data({wdSort: null});
		}
		return;
	};

	/*Filtra elementos filhos data-wd-filter=show{min}${css}|hide{min}${css}&*/
	function data_wdFilter(e) {
		var value, text, data, show, min, target;
		if ("wdFilter" in e.dataset) {
			value = e.dataset.wdFilter.split("&");
			text  = "value" in e ? e.value : e.textContent;
			for (var i = 0; i < value.length; i++) {
				data   = getData(value[i]);
				show   = "hide" in data ? false : true;
				min    = "hide" in data ? data.hide : data.show;
				target = "$" in data ? $(data["$"]) : null;
				if (WD(target).type === "dom") {
					WD(target).filter(text, min, show);
				}
			}
		}
		return;
	};

	/* Define atalhos para o atributo data-wd-mask */
	var shortcutMask = {
		"DDMMYYYY": /^(0[1-9]|[12][0-9]|3[0-1])\.(0[1-9]|1[0-2])\.([0-9]{4})$/,
		"MMDDYYYY": /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[0-1])\/([0-9]{4})$/,
		"YYYYMMDD": /^([0-9]{4})\-(0[1-9]|1[0-2])\-(0[1-9]|[12][0-9]|3[0-1])$/,
		"HHMMSS": /^([01][0-9]|2[0-4])\:([0-5][0-9])\:([0-5][0-9])$/,
		"HHMM": /^([01][0-9]|2[0-4])\h([0-5][0-9])$/,
		"AMPM": /^(0[1-9]|1[0-2])\:([0-5][0-9][apAP])m$/,
	};


	/*Define máscara do elemento data-wd-mask="StringMask"*/
	function data_wdMask(e) {
		var value, re, mask;
		if ("wdMask" in e.dataset) {
			value = "value" in e ? e.value : e.textContent;
			if (e.dataset.wdMask in shortcutMask) {
				re = shortcutMask[e.dataset.wdMask];
			} else {
				re    = new RegExp(e.dataset.wdMask);
			}
			mask  = WD(re).mask(value);
			if (mask === false) {
				if ("setCustomValidity" in e) {
					e.setCustomValidity("Incorrect format: "+re.source);
				}
			} else {
				if ("value" in e) {
					e.value = mask;
				}
				if ("textContent" in e) {
					e.textContent = mask;
				}
				if ("setCustomValidity" in e) {
					e.setCustomValidity("");
				}
			}
		}
		return;
	};

	/*Define os elementos a serem exibidos data-wd-page=page{p}size{s}*/
	function data_wdPage(e) {
		var attr, page, size;
		if ("wdPage" in e.dataset) {
			attr = getData(e.dataset.wdPage);
			page = attr.page;
			size = attr.size;
			WD(e).page(page, size).data({wdPage: null});
		}
		return;
	};

	/*Executa o método click() ao elemento após o load data-wd-click=""*/
	function data_wdClick(e) {
		if ("wdClick" in e.dataset) {
			if ("click" in e) {
				e.click();
			}
			WD(e).data({wdClick: null});
		}
		return;
	};

	/*Executa uma ação ao alvo após o click data-wd-action=action1{css1}action2{css2}*/
	function data_wdAction(e) {
		var value, data, target;
		if ("wdAction" in e.dataset) {
			value = e.dataset.wdAction;
			data  = getData(value);
			for (var action in data) {
				target = WD($(data[action]));
				if (target.type === "dom") {
					target.action(action);
				} else {
					WD(e).action(action);
				}
			}
		}
		return;
	};

	/*Define dataset a partir do click data-wd-data=attr1{value}${css}&*/
	function data_wdData(e) {
		var value, data, target;
		if ("wdData" in e.dataset) {
			value = e.dataset.wdData.split("&");
			for (var i = 0; i < value.length; i++) {
				data   = getData(value[i]);
				target = "$" in data ? WD($(data["$"])) : WD(e);
				delete data["$"];
				if (target.type === "dom") {
						target.data(data);
				}
			}
		}
		return;
	};

	/*Define o link ativo do elemento nav sem interface data*/
	function data_wdActive(e) {
		if (e.parentElement != null && WD(e.parentElement.tagName).title() === "Nav") {
			WD(e.parentElement.children).class({del: "wd-nav-active"});
			if (e.tagName.toUpperCase() === "A") {
				WD(e).class({add: "wd-nav-active"});
			}
		}
		return;
	};

	/*Ordena as colunas de uma tabela data-wd-sort-col=""*/
	function data_wdSortCol(e) {
		var order, thead, heads, bodies;
		if ("wdSortCol" in e.dataset && WD(e.parentElement.parentElement.tagName).title() === "Thead") {
			order  = e.dataset.wdSortCol === "+1" ? -1 : 1;
			thead  = e.parentElement.parentElement;
			heads  = e.parentElement.children;
			bodies = thead.parentElement.tBodies;
			WD(heads).run(function(x) {
				if ("wdSortCol" in x.dataset) {
					x.dataset.wdSortCol = "";
				}
			});
			for (var i = 0; i < heads.length; i++) {
				if (heads[i] === e) {
					WD(bodies).sort(order, i);
					WD(e).data({wdSortCol: order === 1 ? "+1" : "-1"});
					break;
				}
			}
		}
		return;
	};

	/*Guarda o tamanho da tela*/
	var deviceController = null;

	/*Define o estilo do elemento a partir do tamanho da tela data-wd-device=desktop{css}tablet{css}phone{css}mobile{css}*/
	function data_wdDevice(e) {
		var device, value, data, desktop, mobile, tablet, phone;
		if ("wdDevice" in e.dataset) {
			device  = deviceController;
			value   = e.dataset.wdDevice;
			data    = getData(value);
			desktop = "desktop" in data ? data.desktop : "";
			mobile  = "mobile"  in data ? data.mobile  : "";
			tablet  = "tablet"  in data ? data.tablet  : "";
			phone   = "phone"   in data ? data.phone   : "";
			switch(device) {
				case "Desktop":
					WD(e).class({del: phone}).class({del: tablet}).class({del: mobile}).class({add: desktop});
					break;
				case "Tablet":
					WD(e).class({del: desktop}).class({del: phone}).class({add: mobile}).class({add: tablet});
					break;
				case "Phone":
					WD(e).class({del: desktop}).class({del: tablet}).class({add: mobile}).class({add: phone});
					break;
			}
		}
		return;
	};

/* === JS ENGINE =========================================================== */

	/*Procedimentos quando se usa as classes wd-bar ao mudar a âncora*/
	function hashProcedures() {
		var bar, top, hbar, htop;
		bar  = WD($(".wd-nav.wd-buddy, .wd-head.wd-buddy"));
		top  = WD($(window.location.hash));
		hbar = bar.type === "dom" && bar.items > 0 ? bar.item(0).offsetHeight : 0;
		htop = top.type === "dom" && top.items > 0 ? top.item(0).offsetTop : 0;
		if (hbar !== 0) {
			window.scrollTo(0, htop - hbar);
		}
		return;
	};

	function loadingProcedures() {
		/*Procedimentos para carregar objetos externos*/
		var attr = WD($("[data-wd-load], [data-wd-repeat]"));
		if (deviceController === null) {
			scalingProcedures();
		}
		if (attr.type !== "dom" || attr.items === 0) {
			organizationProcedures();
			stylingProcedures();
		} else {
			WD(attr.item(0)).run(data_wdRepeat);
			WD(attr.item(0)).run(data_wdLoad);
		}
		return;
	};

	/*Procedimento para organizar elementos após fim dos carregamentos*/
	function organizationProcedures() {
		WD($("[data-wd-sort]")).run(data_wdSort);
		WD($("[data-wd-filter]")).run(data_wdFilter);
		WD($("[data-wd-mask]")).run(data_wdMask);
		WD($("[data-wd-page]")).run(data_wdPage);
		WD($("[data-wd-click]")).run(data_wdClick);
		return;
	};

	/*Procedimento a executar após eventos click*/
	function clickProcedures(ev) {
		if (ev.which !== 1) {return;}
		data_wdAction(ev.target);
		data_wdData(ev.target);
		data_wdActive(ev.target);
		data_wdSortCol(ev.target);
		data_wdRequest(ev.target);
		return;
	};

	/*Procedimento a executar após acionamento do teclado*/
	function keyboardProcedures(ev) {
		data_wdFilter(ev.target);
		data_wdMask(ev.target);
		return;
	};

	function scalingProcedures(ev) {
		/*Procedimento para definir o dispositivo pelo tamanho da tela*/
		var device, width, height;
		width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		if (width >= 768) {
			device = "Desktop";
		} else if (width >= 600) {
			device = "Tablet";
		} else {
			device = "Phone";
		};
		if (device !== deviceController) {
			deviceController = device;
			if (WD(ev).type !== "undefined") {
				stylingProcedures();
			}
		}
		return;
	};

	/*Procedimento a executar após redimensionamento da tela*/
	function stylingProcedures() {
		WD($("[data-wd-device]")).run(data_wdDevice);
		return;
	};

	/*Procedimento a executar após definição de dataset*/
	function settingProcedures(e, attr) {
		switch(attr) {
			case "wdLoad":    loadingProcedures(); break;
			case "wdRepeat":  loadingProcedures(); break;
			case "wdSort":    data_wdSort(e);      break;
			case "wdFilter":  data_wdFilter(e);    break;
			case "wdMask":    data_wdMask(e);      break;
			case "wdPage":    data_wdPage(e);      break;
			case "wdClick":   data_wdClick(e);     break;
			case "wdDevice":  data_wdDevice(e);    break;
		};
		return;
	};

	/*Definindo e incluindo os estilos utilizados pelo javascript na tag head*/
	var style;
	style = document.createElement("STYLE");
	style.textContent  = ".js-wd-no-display {display: none !important;}";
	style.textContent += ".wd-nav-active {outline: 1px dotted black;}";
	WD(window).handler({load: function() {
		document.head.appendChild(style);
		return;
	}});

	/*Definindo eventos*/
	WD(window).handler({
		load: [loadingProcedures, hashProcedures],
		resize: scalingProcedures,
		hashchange: hashProcedures
	});
	WD(document).handler({
		click: clickProcedures,
		keyup: keyboardProcedures
	});

/* === END ================================================================= */

	return WD;

}());

/*Atalho para o uso do método querySelectorAll em wdDom*/
function wd$(selector, root) {
	return wd(wd().$(selector, root));
}
