/* Willian Donadelli | <wdonadelli@gmail.com> | v2.0.0 */

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
		attr = document.body.parentElement.attributes;
		value = "lang" in attr ? attr.lang.value.replace(/\ /g, "") : "";
		if (value === "") {
			value = navigator.language || navigator.browserLanguage || "en-US";
		}
		return value;
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
		if (typeof value === "boolean") {
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
		} else if (/^[0-9]+(\:[0-5][0-9]){1,2}$/.test(value.trim())) {
			x =  true;
		} else if ((/^(0?[1-9]|1[0-2])\:[0-5][0-9]\ ?(am|pm)$/i).test(value.trim())) {
			x =  true;
		} else if ((/^(0?[0-9]|1[0-9]|2[0-3])h[0-5][0-9]$/i).test(value.trim())) {
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
			if (isBoolean(input)) {
				input = input.valueOf();
			} else if (isString(input) && input.trim() === "") {
				input = null;
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
			types = {
				"undefined": isUndefined,
				"null": isNull,
				"boolean": isBoolean,
				"number": isNumber,
				"date": isDate,
				"time": isTime,
				"array": isArray,
				"regexp": isRegExp,
				"function": isFunction,
				"dom": isDOM,
				"text": isText
			};
			x = null;
			if ((/^WD[a-z]+$/).test(this.constructor.name)) {
				x = this.constructor.name.replace("WD", "");
			} else {
				for (var i in types) {
					if (types[i](this._value)) {
						x = i;
						break;
					}
				};
			}
			if (x === null && "constructor" in this._value) {
				x = this._value.constructor.name.toLowerCase();
			} else if (x === null) {
				x = "unknown";
			}
			return x;
		}
	});

	/*Exibe os métodos e atributos enumeráveis do objeto*/
	Object.defineProperty(WD.prototype, "keys", {
		enumerable: true,
		get: function () {
			var x = []
			for (var i in this) {
				x.push(i);
			}
			return x;
		}
	});

	/*retorna o método valueOf*/
	Object.defineProperty(WD.prototype, "valueOf", {
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
						log(e, "w");
						x = Number(this._value).valueOf();
					}
				}
			return x;
		}
	});

	/*retorna o método toString*/
	Object.defineProperty(WD.prototype, "toString", {
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
					x = this._value.valueOf() === true ? "True" : "False";
					break;
				default:
					try {
						x = this._value.toString();
					} catch(e) {
						log(e, "w");
						x = String(this._value).toString();
					}
				}
			return x;
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
				loadModal.del();
				method.call(this, arg);
			}
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
			if (change !== true) {
				change = false;
			}
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
			if (change !== true) {
				change = false;
			}
			var value;
			value = this.toString().trim().replace(/\ +/g, " ");
			if (change === true) {
				this._value = value;
				value =  this;
			}
			return value;	
		}
	});


	/*Elimina os acentos de input*/
	Object.defineProperty(WDtext.prototype, "clear", {
		enumerable: true,
		value: function(change) {
			if (change !== true) {
				change = false;
			}
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
				log("The \"method\" argument is required.", "w");
				return null;
			}
			var xhttp, path, serial, value, types;
			xhttp  = request();
			value  = this.toString().replace(/^\'/, "").split("?");
			path   = value[0];
			serial = getSerial(value[1]);
			time   = WD(time);
			if (time.number === "natural") {
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
						//xhttp.setRequestHeader("Content-type", "multipart/form-data");
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
		





	//FIXME
	/*Obtem o valor do texto serializado*/
	function getSerial(value) {
		var x, serial, form, inputs;
		if (value === "") {
			x = "";
		}
		else if ((/^\@/).test(value)) {
			//fazer essa bagunça depois de arrumar o WDdom
		} else {
			x = value;
		}
		return x;
	};

	//Jogar essa porra no dom ^^^^^^^^^^^^^^//
	function ajaxGetSerialForm(fname) {
		/*Obtem a serialização a partir do formulário informado*/
		var form, serial, inputs, elem, name, tag, value, itype, atype, check;
		form = document.getElementsByName(fname.replace("@", ""))[0];
		serial = [];
		if (form !== undefined && form.tagName.toUpperCase() === "FORM") {
			inputs = form.elements;
			for (var i = 0; i < inputs.length; i++) {
				elem  = inputs[i];
				name  = elem.name;
				tag   = elem.tagName.toUpperCase();
				value = elem.value;
				itype = tag === "INPUT" ? elem.type.toUpperCase() : null;
				atype = tag === "INPUT" ? elem.attributes.type.value.toUpperCase() : itype;
				check = itype === "RADIO" || itype === "CHECKBOX" ? elem.checked : null;
				if (name === undefined || name === null || stringTrim(name) === "") {
					continue;
				} else if ((itype === "RADIO" || itype === "CHECKBOX") && check === false) {
					continue;
				} else if (atype === "DATE" || itype === "DATE") {
						value = type2(value) === "date" && value !== "%today" ? dateFormat(dateDefiner(value)) : value;
				} else if (atype === "TIME" || itype === "TIME") {
						value = type2(value) === "time" && value !== "%now" ? timeFormat(timeDefiner(value)) : value;
				}
				serial.push(name+"="+encodeURIComponent(value));
			}
		}
		return serial.join("&");
	};

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
					if (WD(metaReference).inside(pattern[i])) {
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
				return input;
			}
			return false;
		}
	});

	/*Retorna o método toString*/
	Object.defineProperties(WDregexp.prototype, {
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
				x = "real";
			} else if (this.valueOf() % 1 !== 0) {
				x = "rational";
			} else if (this.valueOf() % 1 === 0 && this.valueOf() <= 0) {
				x = "integer";
			} else if (this.valueOf() % 1 === 0 && this.valueOf() > 0) {
				x = "natural";
			} else {
				x = "?";
			}
			return x
		}
	});

	/*Retorna se o número é positivo (1), negativo (-1) ou nulo (0)*/
	Object.defineProperty(WDnumber.prototype, "signal", {
		enumerable: true,
		get: function() {
			var x;
			if (this.valueOf() === 0) {
				x = 0;
			} else if (this.valueOf() > 0) {
				x = 1;
			} else if (this.valueOf() < 0) {
				x = -1;
			} else {
				x = "?";
			}
			return x;
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
				x = this.valueOf() - (this.valueOf() % 1);
			}
			return x;
		}
	});

	/*Retorna o valor inteiro do número*/
	Object.defineProperty(WDnumber.prototype, "fraction", {
		enumerable: true,
		get: function() {
			var x;
			if (this.valueOf() === Infinity || this.valueOf() === -Infinity) {
				x = this.valueOf();
			} else if (this.valueOf() % 1 !== 0) {
				x = Number(this.toString().replace(/.*\./, "0.")).valueOf();
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

	/*Retorna o inverso do número (1/x)*/
	Object.defineProperty(WDnumber.prototype, "inverse", {
		enumerable: true,
		get: function() {
			var x;
			if (this.valueOf() === 0) {
				x = Infinity;
			} else if (this.valueOf() === Infinity || this.valueOf() === -Infinity) {
				x = 0;
			} else {
				x = 1/this.valueOf();
			}
			return x;
		}
	});

	/*Arredonda o número para cima*/
	Object.defineProperty(WDnumber.prototype, "up", {
		enumerable: true,
		get: function() {
			var x;
			if (this.fraction === 0) {
				x = this.valueOf();
			} else if (this.valueOf() > 0) {
				x = this.integer+1;
			} else {
				x = this.integer-1;
			}
			return x;
		}
	});

	/*Arredonda o valor informado para determinado número de casas*/
	Object.defineProperty(WDnumber.prototype, "round", {
		enumerable: true,
		value: function(width) {
			var x;
			width = WD(width);
			if (width.number === "natural" || width.valueOf() === 0) {
				try {
				 	x = Number(this.valueOf().toFixed(width.valueOf())).valueOf();
				} catch(e) {
					x = this.valueOf();
					log(e.toString(), "w");
				}
			} else {
				x = this.valueOf();
			}
			return x;
		}
	});

	/*Transcreve a notação científica para html*/
	Object.defineProperty(WDnumber.prototype, "scientific", {
		enumerable: true,
		value: function(width) {
			var x;
			try {
				x = this.valueOf().toExponential(width);
			} catch(e) {
				x = this.valueOf().toExponential();
				log(e.toString(), "w");
			}
			x = x.replace(/e(.+)$/, " &times; 10<sup>$1</sup>").replace(/\+/g, "");
			return x;
		}
	});

	/*Retorna o número no formato local ou definido no html*/
	Object.defineProperty(WDnumber.prototype, "locale", {
		enumerable: true,
		value: function(locale) {
			var x;
			if (locale === undefined) {
				locale = lang();
			}
			try {
				x = this.valueOf().toLocaleString(locale);
			} catch(e) {
				x = this.valueOf().toString();
				log(e.toString(), "w");
			}
			return x;
		}
	});

	/*Retorna o número no formato monetário local ou defuinido no html*/
	Object.defineProperty(WDnumber.prototype, "currency", {
		enumerable: true,
		value: function(currency, locale) {
			var x;
			if (locale === undefined)   {
				locale = lang();
			}
			if (currency === undefined) {
				currency = "¤";
			}
			try {
				x = this.valueOf().toLocaleString(locale, {style: "currency", currency: currency});
			} catch(e) {
				x = currency+this.locale();
				log(e.toString(), "w");
			}
			return x;
		}
	});
	
	/*Fixa a quantidade de caracteres na parte inteira do número*/
	Object.defineProperty(WDnumber.prototype, "fixed", {
		enumerable: true,
		value: function(int, frac, sign) {
			if (WD(sign).type !== "boolean") {
				sign = true;
			}
			var s, x, y, z;
			if (this.number === "real") {
				z = this.toString();
			} else {
				s = sign ? (this.signal < 0 ? "-" : "+") : "";
				x = String(this.integer).replace(/[^0-9]/, "").split("");
				int  = WD(int);
				if (int.number === "natural") {
					while(x.length < int.valueOf()) {
						x.unshift(0);
					}
				}
				y = WD(this.round(frac)).fraction;
				y = y === 0 ? [] : String(y).split(".")[1].split("");
				frac = WD(frac);
				if (frac.number === "natural") {
					while(y.length < frac.valueOf()) {
						y.push(0);
					}
				}
				x =  x.join("");
				y =  y.length === 0 ? "" : "."+y.join("");
				z = s+x+y
			}
			return z;			
		}
	});

/* === TIME ================================================================ */

	/*Função auxiliar para o método format*/
	function timeFormat(caracter) {
		var x;
		switch(caracter) {
			case "%h":
				x = this.hour;
				break;
			case "%H":
				x = this.h24;
				break;
			case "#h":
				x = this.ampm;
				break;
			case "#H":
				x = WD(this.h24).fixed(2, 0, false);
				break;
			case "%m":
				x = this.minute;
				break;
			case "%M":
				x = WD(this.minute).fixed(2, 0, false);
				break;
			case "%s":
				x = this.second;
				break;
			case "%S":
				x = WD(this.second).fixed(2, 0, false);
				break;
		}
		return x;
	};

/*...........................................................................*/

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
		} else if (/^[0-9]+(\:[0-5][0-9]){1,2}$/.test(input)) {
			x     = input.split(":");
			time  = [Number(x[0]).valueOf(), Number(x[1]).valueOf(), x[2] === undefined ? 0 : Number(x[2]).valueOf()];
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
			var time;
			h = WD(h);
			if (h.valueOf() === 0 || h.number === "natural") {
				this._value = 3600*h.valueOf() + 60*this.minute + this.second;
			} else {
				log("The value must be a positive integer.", "w");
			}
			return this.valueOf();
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
			if (m.number !== "natural" && m.number !== "integer") {
				log("The value must be an integer.", "w");
			} else if (m.valueOf() > 59 || m.valueOf() < 0) {
				time = 60*(m.valueOf() - this.minute);
				this._value += time;
			} else {
				this._value = 3600*this.hour + 60*m.valueOf() + this.second;
			}
			return this.valueOf();
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
			if (s.number !== "natural" && s.number !== "integer") {
				log("The value must be an integer.", "w");
			} else if (s.valueOf() > 59 || s.valueOf() < 0) {
				time = s.valueOf() - this.second;
				this._value += time;
			} else {
				this._value = 3600*this.hour + 60*this.minute + s.valueOf();
			}
			return this.valueOf();
		}
	});	


	/*Retorna a hora no formato 24h e o tempo no formato ampm*/
	Object.defineProperties(WDtime.prototype, {
		h24: {
			enumerable: true,
			get: function() {
				return this.hour%24;
			}
		},
		ampm: {
			enumerable: true,
			get: function() {
				var h, m, p;
				p = this.h24 < 12 ? "AM" : "PM"; 
				if (this.h24 === 0) {
					h = 12;
				} else if (this.h24 <= 12) {
					h = this.h24;
				} else {
					h = this.h24 - 12;
				}
				m = WD(this.minute).fixed(2, 0, false);
				return h+":"+m+p;
			}
		}
	});

	/*Formata o tempo de acordo com o especificado na string*/
	Object.defineProperty(WDtime.prototype, "format", {
		enumerable: true,
		value: function(string) {
			var re, names;
			string = String(string).toString();
			names = ["%h", "%H", "#h", "#H", "%m", "%M", "%s", "%S"]
			for (var i = 0; i < names.length; i++) {
				if (string.indexOf(names[i]) >= 0) {
					re = new RegExp(names[i], "g")
					string = string.replace(re, timeFormat.call(this, names[i]));
				}
			}
			return string;
		}
	});

	/*Retorna o método toString e valueOf*/
	Object.defineProperties(WDtime.prototype, {
		toString: {
			value: function() {
				return this.format("#H:%M:%S");
			}
		},
		valueOf: {//FIXME: se maior que 24h tirar o excedente e recíproca? 25h = 01h -01h = 23h (mudar _value)?????
			value: function() {
				if (WD(this._value).type !== "number") {
					log("Improper change of internal value has been adjusted to the minimum value.", "w");
					this._value = 0;
				} else if (this._value > 0 && WD(this._value).number !== "natural") {
					log("Improper change of internal value has been adjusted to an approximate value.", "w");
					this._value = WD(this._value).round(0);
				} else if (this._value < 0) {
					log("Lower limit for time has been extrapolated. Limit value set.", "w");
					this._value = 0;
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
	
	/*Obtem o valor do mês ou semana na língua local*/
	function dateLocale(locale, m, w) {
		var ref;
		if (!isString(locale)) {
			locale = lang();
		}
		var options = [
			{month: {short: "Jan", long: "January"},   week: {short: "Sun", long: "Sunday"}},
			{month: {short: "Feb", long: "February"},  week: {short: "Mon", long: "Monday"}},
			{month: {short: "Mar", long: "March"},     week: {short: "Tue", long: "Tuesday"}},
			{month: {short: "Apr", long: "April"},     week: {short: "Wed", long: "Wednesday"}},
			{month: {short: "May", long: "May"},       week: {short: "Thu", long: "Thursday"}},
			{month: {short: "Jun", long: "June"},      week: {short: "Fri", long: "Friday"}},
			{month: {short: "Jul", long: "July"},      week: {short: "Sat", long: "Saturday"}},
			{month: {short: "Aug", long: "August"},    week: {short: "?", long: "?"}},
			{month: {short: "Sep", long: "September"}, week: {short: "?", long: "?"}},
			{month: {short: "Oct", long: "October"},   week: {short: "?", long: "?"}},
			{month: {short: "Nov", long: "November"},  week: {short: "?", long: "?"}},
			{month: {short: "Dec", long: "December"},  week: {short: "?", long: "?"}}
		];
		try {
			ref = new Date(1970, m - 1, 15, 12, 0, 0, 0);
			ref.setDate(15 + w - (ref.getDay()+1));
			ref.toLocaleString(locale);
			for (var i = 0; i < options.length; i++) {
				options[i].month.short = ref.toLocaleString(locale, {month: "short"});
				options[i].month.long  = ref.toLocaleString(locale, {month: "long"});
				if (i < 7) {
					options[i].week.short = ref.toLocaleString(locale, {weekday: "short"});
					options[i].week.long  = ref.toLocaleString(locale, {weekday: "long"});
				}
			}
		} catch(e) {
			log(e.toString(), "a");
		}
		return options;
	};

	/*Função auxiliar para o método format*/
	function dateFormat(caracter, locale) {
		var x;
		switch(caracter) {
			case "%d":
 				x = this.day;
 				break;
			case "%D":
 				x = WD(this.day).fixed(2, 0, false);
 				break;
			case "@d":
 				x = this.days;
 				break;
			case "%m":
 				x = this.month;
 				break;
			case "%M":
 				x = WD(this.month).fixed(2, 0, false);
 				break;
			case "@m":
 				x = this.width;
 				break;
			case "#m":
 				x = dateLocale(locale, this.month, this.week)[this.month-1].month.short;
 				break;
			case "#M":
 				x = dateLocale(locale, this.month, this.week)[this.month-1].month.long;
 				break;
			case "%y":
 				x = this.year;
 				break;
			case "%Y":
 				x = WD(this.year).fixed(4, 0, false);
 				break;
			case "%w":
 				x = this.week;
 				break;
			case "@w":
 				x = this.weeks;
 				break;
			case "#w":
 				x = dateLocale(locale, this.month, this.week)[this.week-1].week.short;
 				break;
			case "#W":
 				x = dateLocale(locale, this.month, this.week)[this.week-1].week.long;
 				break;
			case "%l":
 				x = this.leap ? 366 : 365;
 				break;
			case "%c":
 				x = this.countdown;
 				break;
		}
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
			if (x.number !== "natural") throw Error("An unexpected error occurred while setting date!");
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
			if (y.number !== "natural" || y.valueOf() > Y_max || y.valueOf() < Y_min) {
				log("The value must be a positive integer between "+Y_min+" and "+Y_max+".", "w");
			} else {
				this._value = dateToNumber(y.valueOf(), this.month, this.day);
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
			if (m.number !== "integer" && m.number !== "natural") {
				log("The value must be an integer.", "w");
			} else {
				m = m.valueOf();
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
			if (d.number !== "integer" && d.number !== "natural") {
				log("The value must be an integer.", "w");
			} else {
				if (d.valueOf() > this.width) {
					z = this.valueOf() + d.valueOf() - this.day;
				} else if (d.valueOf() < 1) {
					z = this.valueOf() - (this.day - d.valueOf());
				} else {
					z = this.valueOf() + (d.valueOf() - this.day);
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
				y   = WD(this.year).fixed(4, 0, false);
				ref = WD(y+"-01-01").valueOf();
				return this.valueOf() - ref + 1;
			}		
		},
		weeks: {
			enumerable: true,
			get: function() {
				var ref, weeks, y;
				y     = WD(this.year).fixed(4, 0, false);
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

	/*Formata a data de acordo com a string informada*/
	Object.defineProperty(WDdate.prototype, "format", {
		enumerable: true,
		value: function(string, locale) {
			var re, names;
			if (string === undefined) {
				return this.toString();
			}
			if (locale === undefined)   {
				locale = lang();
			}
			names = ["%d", "%D", "@d", "%m", "%M", "@m", "#m", "#M", "%y", "%Y", "%w", "@w", "#w", "#W", "%l", "%c"];
			string = String(string).toString();
			for (var i = 0; i < names.length; i++) {
				if (string.indexOf(names[i]) >= 0) {
					re = new RegExp(names[i], "g");
					string = string.replace(re , dateFormat.call(this, names[i], locale));
				}
			}
			return string;
		}
	});

	/*Retorna o método toString e valueOf*/
	Object.defineProperties(WDdate.prototype, {
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
				} else if (WD(this._value).number !== "natural") {
					log("Incorrect change of internal value was adjusted to approximate value.", "w");
					this._value = WD(this._value).round(0);
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
	Object.defineProperty(WDarray.prototype, "width", {
		enumerable: true,
		get: function() {
			return this.valueOf().length;
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
			for (var i = 0; i < this.width; i++) {
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
					this.valueOf().splice(this.valueOf().indexOf(arguments[i]), 1);
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
					this.valueOf().push(arguments[i]);
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
				this.valueOf()[index[i]] = value;
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
			var aNull, aNumber, aTime, aDate, aText, aOthers, aFinal;
			var uNull, uNumber, uTime, uDate, uText, uOthers;
			var real, made;
			aNull   = []; uNull   = [];
			aNumber = []; uNumber = [];
			aTime   = []; uTime   = [];
			aDate   = []; uDate   = [];
			aText   = []; uText   = [];
			aOthers = []; uOthers = [];
			aFinal  = [];
			for (var i = 0; i < this.valueOf().length; i++) {
				real = this.valueOf()[i];
				made = WD(real);
				switch(made.type) {
					case "null":
						if (unique !== true) {
							aNull.push(real);
						} else if (!WD(uNull).inside(made.valueOf())) {
							aNull.push(null);
							uNull.push(made.valueOf());
						}
						break;
					case "number":
						if (unique !== true) {
							aNumber.push({real: real, made: made.valueOf()});
						} else if (!WD(uNumber).inside(made.valueOf())) {
							aNumber.push({real: made.valueOf(), made: made.valueOf()});
							uNumber.push(made.valueOf());
						}
						break;
					case "time":
						if (unique !== true) {
							aTime.push({real: real, made: made.valueOf()});
						} else if (!WD(uTime).inside(made.valueOf())) {
							aTime.push({real: made.toString(), made: made.valueOf()});
							uTime.push(made.valueOf());
						}
						break;
					case "date":
						if (unique !== true) {
							aDate.push({real: real, made: made.valueOf()});
						} else if (!WD(uDate).inside(made.valueOf())) {
							aDate.push({real: made.toString(), made: made.valueOf()});
							uDate.push(made.valueOf());
						}
						break;
					case "text":
						if (unique !== true) {
							aText.push({real: real, made: made.toString().toUpperCase()});
						} else if (!WD(uText).inside(made.toString())) {
							aText.push({real: made.toString(), made: made.toString().toUpperCase()});
							uText.push(made.toString());
						}
						break;
					default:
						if (unique !== true) {
							aOthers.push(real);
						} else if (!WD(uOthers).inside(real)) {
							aOthers.push(real);
							uOthers.push(real);
						}
				}
			}
			aNull.sort();
			aNumber.sort(function(a,b) {
				return a.made - b.made;
			});
			aTime.sort(function(a,b) {
				return a.made - b.made;
			});
			aDate.sort(function(a,b) {
				return a.made - b.made;
			});
			aText.sort(function(a,b) {
				return a.made > b.made;
			});
			aOthers.sort();
			aFinal = aFinal.concat(aNull);
			made = [aNumber, aTime, aDate, aText];
			for (i = 0; i < made.length; i++) {
				for (var j = 0; j < made[i].length; j++) {
					aFinal.push(made[i][j].real);
				}		
			}
			aFinal = aFinal.concat(aOthers);
			return aFinal;
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














/*...........................................................................*/

	function WDdom(input) {
		if (!(this instanceof WDdom)) {
			return new WDdom(input);
		}
		if (!isDOM(input)){log(8658675867);
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
			if (WD(method).type !== "function") {
				log("The \"method\" argument is required.", "w");
				return null;
			}
			var x;
			for (var i = 0; i < this.valueOf().length; i++) {
				x = this.valueOf()[i];
				if (x !== window && x.nodeType != 1 && x.nodeType != 9) {
					continue;
				}
				method(x);
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
					//htmlAction(script, "del"); //FIXME alterar para WD(script).action("del") e testar
				}
				//loadingProcedures(); //FIXME apagar comentário depois de tudo pronto e testar
				return;
			});
			return this;
		}
	});

	/*Define o valor dos atributos data*/
	Object.defineProperty(WDdom.prototype, "data", {
		enumerable: true,
		value: function(obj) {
			if (WD(obj).type !== "object") {
				log("data: Invalid argument!", "w");
				return this;
			}
			this.run(function(elem) {
				var key;
				for (var i in obj) {
					key = camelCase(i);
					if (obj[i] === null) {
						delete elem.dataset[key];
					} else {
						elem.dataset[key] = WD(obj[i]).type === "regexp" ? WD(obj[i]).toString() : obj[i];
						//settingProcedures(elem, key); //FIXME apagar comentário depois de tudo pronto e testar
					}
				}
				return;
			});
			return this;
		}
	});

	/*Define o atributo style do elemento a partir da nomenclatura CSS*/
	Object.defineProperty(WDdom.prototype, "style", {
		enumerable: true,
		value: function(styles) {
			if (WD(styles).type !== "object") {
				log("style: Invalid argument!", "w");
				return this;
			}
			this.run(function(elem) {
				var key;
				for (var i in styles) {
					key = camelCase(i);
					if (key in elem.style) {
						elem.style[key] = styles[io.i];
					} else {
						log("The \""+i+"\" style was not found in "+elem.tagName+" element!", "w");
					}
				}
				return;
			});
			return this;
		}
	});

	/*Manipula os valores do atributo class*/
	Object.defineProperty(WDdom.prototype, "class", {
		enumerable: true,
		value: function (list) {
			if (!WD(["object", "null", "undefined"]).inside(WD(list).type)) {
				log("class: Invalid argument!", "w");
				return this;
			}
			this.run(function(elem) {
				var css, cls, i;
				css = WD(elem.className);
				css = css.type === "null" ? [] : css.trim().split(" ");
				if (list === null || list === undefined) {
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
			return this;
		}
		
	});
	
	/*Exibe somente os elementos filhos cujo conteúdo textual contenha o valor informado*/
	Object.defineProperty(WDdom.prototype, "filter", {
		enumerable: true,
		value: function (text, show, min) {
			if (show !== false) {
				show = true;
			}
			if (WD(min).number !== "natural") {
				min = 0;
			}
			if (WD(text) !== "text") {
				text = String(text).toString();
			}
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
							WD(child[i]).class({del: "js-wd-no-display"});
						} else {//FIXME adicionar a classe js-wd-no-display numa folha de estilo interna (onload) ou substituir por action(show) action(hide) [melhor essa última]
							WD(child[i]).class({add: "js-wd-no-display"});
						}
					} else {
						if (text.length >= min && content.indexOf(text) >= 0 && text !== "") {
							WD(child[i]).class({del: "js-wd-no-display"});
						} else {
							WD(child[i]).class({add: "js-wd-no-display"});
						}
					}
				};
				return;
			});
			return this;
		}
	});



















	


	function htmlSetHandler(elem, event, method, act) {
		/*Define função para adicionar eventos*/
		event = (/^on/i).test(event) ? event.toLowerCase() : "on"+event.toLowerCase();
		if (type2(method) !== "f()" && method !== null) {
			log("The "+event+" attribute must be a function or null value.", "e");
			return;
		}
		if (!(event in elem)) {
			log("The \""+event+"\" attribute was not found in "+elem.tagName+" element!", "w");
			return;
		}
		if (method === null) {
			elem[event] = null;
			return;
		}
		var methods;
		if (type2(elem[event]) !== "f()") {
			methods = [];
		} else if (elem[event].name === "wdEventHandler") {
				methods = elem[event]("showMethods");
		} else {
			methods = [elem[event]];
		}
		if (act === "add") {
			methods = arrayAdd(methods, method);
		} else if (act === "del") {
			methods = arrayDel(methods, method);
		}
		function wdEventHandler(ev) {
			if (ev === "showMethods") {return methods;}
			for (var i = 0; i < methods.length; i++) {methods[i].call(this, ev);}
		}
		elem[event] = wdEventHandler;
		return;
	};

	function htmlHandler(elem, obj, remove) {
		/*Determina ação para definir manipuladores de evento a partir de um objeto*/
		if (obj === undefined) {obj = {};}
		if (remove === undefined) {remove = false;}
		var act, method, methods;
		act = remove === true ? "del" : "add";
		for (var event in obj) {
			methods = type2(obj[event]) === "array" ? obj[event] : [obj[event]];
			for (var j = 0; j < methods.length; j++) {
				method = methods[j];
				htmlSetHandler(elem, event, method, act);
			}
		}
		return;
	};

	

	
	

	
	function htmlRepeat(elem, object) {
		/*Constroi elementos html a partir de um array de objetos*/
		var inner, re, html;
		html = elem.innerHTML;
		if (html.search(/\{\{.+\}\}/gi) >= 0) {
			elem.dataset.wdRepeatModel = html;
		} else if ("wdRepeatModel" in elem.dataset) {
			html = elem.dataset.wdRepeatModel;
		} else {
			return false;
		}
		elem.innerHTML = "";
		html = html.replace(/\}\}\=\"\"/gi, "}}");
		for (var i in object) {
			inner = html;
			for (var c in object[i]) {
				re = new RegExp("\\{\\{"+c+"\\}\\}", "g");
				inner = inner.replace(re, object[i][c]);
			};
			elem.innerHTML += inner;
		};
		loadingProcedures();
		return;
	};

	function htmlSort(elem, order, col) {
		/*Ordena os filhos do elemento com base em seu conteúdo textual*/
		if (order === undefined) {order = 1;}
		if (col === undefined) {col = null;}
		var dom = [], text = [], sort = [], seq = [], index, childs, value;
		childs = elem.children;
		for (var i = 0; i < childs.length; i++) {
			dom.push(childs[i]);
			value = col === null ? childs[i].textContent : childs[i].children[col].textContent;
			text.push(stringTrim(value));
			sort.push(stringTrim(value));
		};
		sort = arraySort(sort);
		for (i = 0; i < sort.length; i++) {
			index = text.indexOf(sort[i]);
			seq.push(index);
			text[index] = null;
		};
		if (order < 0) {seq.reverse();}
		for (i = 0; i < seq.length; i++) {
			elem.appendChild(dom[seq[i]]);
		};
		return;
	};

	function htmlPage(elem, page, size) {
		/*Exibe somente os elementos filhos no intervalo numérico informado*/
		if (page === undefined) {page = 0;}
		if (size === undefined) {size = 1;}
		var lines, width, pages = [], section = [];
		page = numberRound(page, 0);
		size = size === 0 ? 1 : numberAbs(size);
		lines = elem.children;
		width = (size <= 1 && size > 0) ? numberRound(size * lines.length, 0) : numberRound(size, 0);
		for (var i = 0; i < lines.length; i++) {
			section.push(lines[i]);
			if (section.length%width === 0 || i+1 === lines.length) {
				pages.push(section);
				section = [];
			}
		}
		if (page < 0) {page = (pages.length + page) < 0 ? 0 : pages.length + page;}
		if (page+1 > pages.length) {page = pages.length-1;}
		for (i = 0; i < pages.length; i++) {
			for (var n = 0; n < pages[i].length; n++) {
				if (i === page) {
					pages[i][n].style.display = null;
				} else {
					pages[i][n].style.display = "none";
				}
			}
		}
		return pages.length;
	};

	function htmlAction(elem, act) {
		/*Define ação para o objeto html*/
		if (act === undefined) {act = "toggle";}
		var tag = elem.tagName.toUpperCase();
		switch(act) {
			case "open":
				if (tag === "DIALOG" && "showModal" in elem) {
					elem.showModal();

				} else if (tag === "DETAILS" && "open" in elem) {
					elem.open = true;
				} else {
					elem.dataset.wdOpen = true;
				}
				break;
			case "close":
				if (tag === "DIALOG" && "close" in elem) {
					elem.close();
				} else if (tag === "DETAILS" && "open" in elem) {
					elem.open = false;
				}
				delete elem.dataset.wdOpen;
				break;
			case "toggle":
				if (elem.open === true || "wdOpen" in elem.dataset) {
					htmlAction(elem, "close");
				} else {
					htmlAction(elem, "open");
				}
				break;
			case "tab":
				var childs = elem.parentElement.children;
				for (var i = 0; i < childs.length; i++) {childs[i].style.display = "none";}
				elem.style.display = null;
				break;
			case "del":
				if (elem.remove !== undefined) {
					elem.remove();
				} else {
					elem.parentElement.removeChild(elem);
				}
				break;
			case "show":
				if (elem.style.display === "none") {
					elem.style.display = "wdHide" in elem.dataset ? elem.dataset.wdHide : null;
				}
				delete elem.dataset.wdHide;
				break;
			case "hide":
				if (elem.style.display !== "none") {
					elem.dataset.wdHide = elem.style.display;
					elem.style.display = "none";
				}
				break;
			case "check":
				if (elem.tagName.toUpperCase() === "INPUT") {
					if (elem.type.toUpperCase() === "CHECKBOX" || elem.type.toUpperCase() === "RADIO") {
						elem.checked = true;
					}
				}
				break;
			case "uncheck":
				if (elem.tagName.toUpperCase() === "INPUT") {
					if (elem.type.toUpperCase() === "CHECKBOX" || elem.type.toUpperCase() === "RADIO") {
						elem.checked = false;
					}
				}
				break;
			case "togglecheck":
				if (elem.tagName.toUpperCase() === "INPUT") {
					if (elem.type.toUpperCase() === "CHECKBOX" || elem.type.toUpperCase() === "RADIO") {
						elem.checked = elem.checked === true ? false : true;
					}
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
	};


	/*FIXME não funciona o getDefaultComputedStyle em outros navegadores*/
	function htmlGetStyles(input) {
		/*Retorna um array contendo os estilos (padrão ou computado) de todos os elementos de input*/
		var list = [];
		for (var i = 0; i < input.length; i++) {
			try {
				list.push({
					default:  "getDefaultComputedStyle" in window ? window.getDefaultComputedStyle(input[i], null) : {},
					computed: "getComputedStyle" in window ? window.getComputedStyle(input[i], null) : {}
				});
			} catch(e) {
				list.push({default: {}, computed: {}});
			}
		}
		return list;
	};









	/*Retorna o método toString, valueOf*/
	Object.defineProperties(WDdom.prototype, {
		e: {
			enumerable: true,
			get: function() {
				return this.valueOf();
			}
		},
		valueOf: {
			value: function() {
				var x;
				if (this._value === document || this._value === window) {
					x = [this._value];
				} else if (this._value instanceof HTMLElement) {
					x = [this._value];
				} else {
					x = this._value;
				}
				return x;
			}
		}
	});











/*	
	WDdom.prototype = Object.create(WD.prototype, {
		constructor: {value: WDdom},
		execute: {enumerable: true, value: function(method) {
			htmlRun(this._value, method); return;
		}},
		handler: {enumerable: true, value: function(events, remove) {
			htmlRun(this._value, function(elem) {htmlHandler(elem, events, remove); return;}); return this;
		}},
		class: {enumerable: true, value: function(list) {
			htmlRun(this._value, function(elem) {htmlClass(elem, list); return;}); return this;
		}},
		style: {enumerable: true, value: function(list) {
			htmlRun(this._value, function(elem) {htmlStyle(elem, list); return;}); return this;
		}},
		data: {enumerable: true, value: function(list) {
			htmlRun(this._value, function(elem) {htmlData(elem, list); return;}); return this;
		}},
		filter: {enumerable: true, value: function(text, min) {
			htmlRun(this._value, function(elem) {htmlFilter(elem, text, min); return;}); return this;
		}},
		sort: {enumerable: true, value: function(order, col) {
			htmlRun(this._value, function(elem) {htmlSort(elem, order, col); return;}); return this;
		}},
		page: {enumerable: true, value: function(page, size) {
			htmlRun(this._value, function(elem) {htmlPage(elem, page, size); return;}); return this;
		}},
		repeat: {enumerable: true, value: function(obj) {
			htmlRun(this._value, function(elem) {htmlRepeat(elem, obj); return;}); return this;
		}},
		load: {enumerable: true, value: function(html) {
			htmlRun(this._value, function(elem) {htmlLoad(elem, html); return;}); return this;
		}},
		action: {enumerable: true, value: function(act) {
			htmlRun(this._value, function(elem) {htmlAction(elem, act); return;}); return this;
		}},
		get:    {enumerable: true, get: function() {return type2(this._value) !== "[html]" ? [this._value] : this._value;}},
		styles: {enumerable: true, get: function() {return htmlGetStyles(type2(this._value) !== "[html]" ? [this._value] : this._value);}},
	});

*/




























/*===========================================================================*/
	function arrayAdd() {}//fixme apagar essa merda


	function $(selector, root) {
		/*Retorna os elementos html identificados pelo seletor css no elemento root*/
		if (root === undefined) {
			root = document;
		}
		return root.querySelectorAll(selector);
	};




	function data_wdLoad(e) {
		/*Carrega html externo*/
		if (!("wdLoad" in e.dataset)) {return;}
		var value, method, file, ajax, target;
		value  = e.dataset.wdLoad;
		method = (/^post\:/i).test(value) ? "post" : "get";
		file   = value.replace(/^(post|get)\:/i, "");
		ajax   = wd(file);
		target = wd(e);
		target.data({wdLoad: null});
		if (ajax.type !== "path") {
			log("data-wd-load=\""+value+"\" - Attribute value is not an accessible file path.", "e")
		} else {
			ajax[method](function(x) {
				if (x.error) {
					log(file+": Error accessing file or timeout.", "e");
				} else {
					target.load(x.text);
				}
				return;
			});
		}
		return;
	};

	function data_wdRepeat(e) {
		/*Constroe html a partir de um arquivo json*/
		if (!("wdRepeat" in e.dataset)) {return;}
		var value, method, file, ajax, target;
		value  = e.dataset.wdRepeat;
		method = (/^post\:/i).test(value) ? "post" : "get";
		file   = value.replace(/^(post|get)\:/i, "");
		ajax   = wd(file);
		target = wd(e);
		target.data({wdRepeat: null});
		if (ajax.type !== "path") {
			log("data-wd-repeat=\""+value+"\" - Attribute value is not an accessible file path.", "e");
		} else {
			ajax[method](function(x) {
				if (x.error || x.json === null) {
					log(file+": Error accessing file, timeout or it's not a json file.", "e");
				} else {
					target.repeat(x.json);
				}
				return;
			});
		}
		return;
	};

	function data_wdSort(e) {
		/*Ordena elementos filhos*/
		if (!("wdSort" in e.dataset)) {return;}
		var order = wd(e.dataset.wdSort);
		wd(e).sort(order.type !== "number" ? 1 : order.valueOf()).data({wdSort: null});
		return;
	};

	function data_wdFilter(e) {
		/*Filtra elementos filhos*/
		if (!("wdFilter" in e.dataset)) {return;}
		var min, target, text;
		text   = "value" in e ? e.value : e.textContent;
		min    = (/^[0-9]+\:/).test(e.dataset.wdFilter) ? wd(e.dataset.wdFilter.split(":")[0]).valueOf() : 0;
		target = e.dataset.wdFilter.replace(/^[0-9]+\:/, "");
		wd($(target)).filter(text, min);
		return;
	};

	function data_wdMask(e) {
		/*Define máscara do elemento*/
		if (!("wdMask" in e.dataset)) {return;}
		var value, re, mask;
		value = "value" in e ? e.value : e.textContent;
		re    = new RegExp(e.dataset.wdMask);
		mask  = wd(re).mask(value);
		if (mask === false) {
			if ("setCustomValidity" in e) {e.setCustomValidity("Incorrect value: "+re.source);}
		} else {
			if ("value" in e) {e.value = mask} else {e.textContent = mask;}
			if ("setCustomValidity" in e) {e.setCustomValidity("");}
		}
		return;
	};

	function data_wdPage(e) {
		/*Define os elementos a serem exibidos*/
		if (!("wdPage" in e.dataset)) {return;}
		var page, size, attr;
		attr = e.dataset.wdPage.replace(/[^\-\.\:0-9]/g, "").split(":");
		page = wd(attr[0]).type !== "number" ? 0 : wd(attr[0]).valueOf();
		size = wd(attr[1]).type !== "number" ? 0 : wd(attr[1]).valueOf();
		wd(e).page(page, size).data({wdPage: null});
		return;
	};
	
	function data_wdClick(e) {
		/*Executa o método click() ao elemento após o load*/
		if (!("wdClick" in e.dataset)) {return;}
		if (!("click" in e)) {
			log("data-wd-click: Element does not have the click event.", "w");
		} else {
			e.click();
		}
		wd(e).data({wdClick: null});
		return;
	};

	function data_wdAction(e) {
		/*Executa uma ação ao alvo após o click*/
		if (!("wdAction" in e.dataset)) {return;}
		var attr, action, target;
		attr = e.dataset.wdAction.split("&");
		for (var i = 0; i < attr.length; i++) {
			action = attr[i].split(":")[0].trim();
			target = attr[i].split(":")[1] === undefined ? e : $(attr[i].trim().replace(action+":", ""));
			wd(target).action(action);
		}
		return;
	};

	function data_wdActive(e) {
		/*Define o link ativo do elemento nav*/
		if (e.parentElement !== null && e.parentElement.tagName.toUpperCase() === "NAV") {
			wd(e.parentElement.children).data({wdActive: null});
			if (e.tagName.toUpperCase() === "A") {
				wd(e).data({wdActive: true});
			}
		}
		return;
	};

	function data_wdSortCol(e) {
		/*Ordena as colunas de uma tabela*/
		if (!("wdSortCol" in e.dataset)) {return;}
		if (e.parentElement.parentElement.tagName.toUpperCase() !== "THEAD") {return;}
		var order, thead, heads, bodies;
		order  = e.dataset.wdSortCol === "+1" ? -1 : 1;
		thead  = e.parentElement.parentElement;
		heads  = e.parentElement.children;
		bodies = thead.parentElement.tBodies;
		wd(heads).data({wdSortCol: ""});
		for (var i = 0; i < heads.length; i++) {
			if (heads[i] === e) {
				wd(bodies).sort(order, i);
				wd(e).data({wdSortCol: order === 1 ? "+1" : "-1"});
				break;
			}
		}
		return;
	};

	/*Guarda o tamanho da tela*/
	var deviceController = null;
	
	/*Define o estilo do elemento a partir do tamanho da tela*/
	function data_wdDevice(e) {
		if (!("wdDesktop" in e.dataset) && !("wdTablet" in e.dataset) && !("wdPhone" in e.dataset)) {return;}
		var device, desktop, tablet, phone, add, del;
		device  = deviceController;
		desktop = "wdDesktop" in e.dataset ? e.dataset.wdDesktop : "";
		tablet  = "wdTablet"  in e.dataset ? e.dataset.wdTablet : "";
		phone   = "wdPhone"   in e.dataset ? e.dataset.wdPhone : "";
		switch(device) {
			case "desktop":
				add = desktop.split(" ");
				del = (tablet+" "+phone).split(" ");
				break;
			case "tablet":
				add = tablet.split(" ");
				del = (desktop+" "+phone).split(" ");
				break;
			case "phone":
				add = phone.split(" ");
				del = (desktop+" "+tablet).split(" ");
				break;
		}
		for (var i = 0; i < add.length; i++) {
			del = arrayDel(del, add[i]);
		}
		wd(e).class({add: add, del: del});
		return;
	};

/*===========================================================================*/
	function hashProcedures() {
		/*Procedimentos quando se usa as classes wd-bar ao mudar a âncora*/
		var bar, hbar, hash, target, htop;
		bar    = $(".wd-bar, .wd-bar-N");
		hbar   = bar.length === 0 ? 0 : bar[0].offsetHeight;
		hash   = window.location.hash;
		target = hash === undefined || hash === "" ? [] : $(hash);
		htop   = target.length === 0 ? 0 : target[0].offsetTop;
		if (hbar !== 0) {
			window.scrollTo(0, htop - hbar);
		}
		return;
	};

	function loadingProcedures() {
		/*Procedimentos para carregar objetos externos*/
		var attr = $("[data-wd-load], [data-wd-repeat]");
		if (deviceController === null) {scalingProcedures();}
		if (attr.length === 0) {
			organizationProcedures();
			stylingProcedures();
		} else {
			wd(attr[0]).execute(data_wdRepeat);
			wd(attr[0]).execute(data_wdLoad);
		}
		return;
	};
	
	function organizationProcedures() {
		/*Procedimento para organizar elementos após fim dos carregamentos*/
		wd($("[data-wd-sort]")).execute(data_wdSort);
		wd($("[data-wd-filter]")).execute(data_wdFilter);
		wd($("[data-wd-mask]")).execute(data_wdMask);
		wd($("[data-wd-page]")).execute(data_wdPage);
		wd($("[data-wd-click]")).execute(data_wdClick);
		return;
	};

	function clickProcedures(ev) {
		/*Procedimento a executar após eventos click*/
		if (ev.which !== 1) {return;}
		data_wdAction(ev.target);
		data_wdActive(ev.target);
		data_wdSortCol(ev.target);
		return;
	};
	
	function keyboardProcedures(ev) {
		/*Procedimento a executar após acionamento do teclado*/
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
			device = "desktop";
		} else if (width >= 600) {
			device = "tablet";
		} else {
			device = "phone";
		};
		if (device !== deviceController) {
			deviceController = device;
			if (type2(ev) !== "?") {
				stylingProcedures();
			}
		}
		return;
	};
	
	function stylingProcedures() {
		/*Procedimento a executar após redimensionamento da tela*/
		wd($("[data-wd-desktop], [data-wd-tablet], [data-wd-phone]")).execute(data_wdDevice);
		return;
	};

	function settingProcedures(e, attr) {
		/*Procedimento a executar após definição de dataset*/
		switch(attr) {
			case "wdLoad":    loadingProcedures(); break;
			case "wdRepeat":  loadingProcedures(); break;
			case "wdSort":    data_wdSort(e);      break;
			case "wdFilter":  data_wdFilter(e);    break;
			case "wdMask":    data_wdMask(e);      break;
			case "wdPage":    data_wdPage(e);      break;
			case "wdClick":   data_wdClick(e);     break;
			case "wdDesktop": data_wdDevice(e);    break;
			case "wdTablet":  data_wdDevice(e);    break;
			case "wdPhone":   data_wdDevice(e);    break;
		};
		return;
	};

	/*Definindo eventos*/
	/*
	wd(window).handler({
		load: [loadingProcedures, hashProcedures],
		resize: scalingProcedures,
		hashchange: hashProcedures
	});
	wd(document).handler({
		click: clickProcedures,
		keyup: keyboardProcedures
	});

	*/	





//FIXME acabar com essa merda
/*===========================================================================*/
	function wd(input) {
		/*Retorna o construtor de acordo com o tipo de input*/
		switch(type2(input, true)) {
			case "text":   return WDtext(input); break;
			case "bool":   return WDboolean(input); break;
			case "number": return WDnumber(numberDefiner(input)); break;
			case "array":  return WDarray(input); break;
			case "regex":  return WDregexp(input); break;
			case "date":   return WDdate(input); break;
			case "time":   return WDtime(input); break;
			case "path":   return WDpath(input); break;
			case "html":   return WDdom(input); break;
			case "[html]": return WDdom(input); break;
			case "doc":    return WDdom(input); break;
			case "win":    return WDdom(input); break;
			default:       return WD(input);
		}
		return null;
	};

	function type2(input, ajax) {
		/*Retorna o tipo de input*/
		if (ajax === undefined) {ajax = false;}
		var x;
		if (input === undefined) {
			x = "?";
		} else if (input === null) {
			x = "0";
		} else if (typeof input === "boolean" || input instanceof Boolean) {
			x = "bool";
		} else if (typeof input === "number" || input instanceof Number) {
			x = "number";
		} else if (typeof input === "string" || input instanceof String) {
			if (input.trim() === "") {
				x = "0";
			} else if (numberDefiner(input) !== null) {
				x = "number";
			} else if (timeDefiner(input) !== null) {
				x = "time";
			} else if (dateDefiner(input) !== null) {
				x = "date";
			} else if (ajax === true && ajaxFileExists(input)) {
				x = "path";
			} else {
				x = "text";
			}
		} else if (Array.isArray(input) || input instanceof Array) {
			x = "array";
		} else if (input.constructor === RegExp || input instanceof RegExp) {
			x = "regex";
		} else if (typeof input === "f()" || input instanceof Function) {
			x = "f()";
		} else if (input instanceof Date) {
			x = "date";
		} else if (input.constructor === Object) {
			x = "object";
		} else if (input instanceof HTMLElement) {
			x = "html";
		} else if (
			input instanceof NodeList ||
			input instanceof HTMLCollection ||
			input instanceof HTMLAllCollection ||
			input instanceof HTMLFormControlsCollection
		) {
			x = "[html]";
		} else if (input === document) {
			x = "doc";
		} else if (input === window) {
			x = "win";
		} else {
			try {
				x = input.constructor.name;
			} catch(e) {
				x = "unknown"
			}
		}
		return x;
	};











	return WD
}());


function wd$(input, root) {
	/*Atalho para o uso do método querySelectorAll em wdHtml*/
	var query = null;
	if (root === undefined || !("querySelectorAll" in root)) {
		root = document;
	}
	try {
		query = root.querySelectorAll(input);
	} catch(e) {
		query = null;
	}
	return wd(query);
};
