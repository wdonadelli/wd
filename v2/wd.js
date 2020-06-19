/*----------------------------------------------------------------------------
wd.js (v2.2.4)

FIXME
MELHORIAS V2.2.4
metodo form:
	melhorias na interpretação de dados
	quando se tratar de iinput type file, o atributo name conterá no final um _ seguido do sequencial a partir de zero (para múltiplos arquivos)
inclusão do método Form
inclusão do método upper e lower em WDtext
inclusão do método send em WD
inclusão do atributo data-wd-send
alteração no método handler (não pode mais null e adicinado argumento remove)
inclusão do método dash e camel em TEXT
método data agora aceita o "data-" no início
wd-active-click funciona para span também
atributo file: data-wd-file=size{value}type{}char{}len{}
nos eventos onclick inserir o crescimento de bolha no caso de elemento inline
toggle-show em action
wdConfig para definir as mensagens em body
wdConfig {
	loading 
	fileSize
	fileTotal
	fileChar
	fileLen
	fileType
}
array.item mudança no retorno do método, ou retorna o valor ou o undefined
atalhos para tempo (h m s) e data (y m d)



<wdonadelli@gmail.com>
https://github.com/wdonadelli/wd
------------------------------------------------------------------------------
MIT License

Copyright (c) 2019 Willian Donadelli

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

"use strict";

var wd = (function() {

/* === WD ================================================================== */

	/*guarda as mensagens da biblioteca*/
	var wdConfig = {};
	/*Guarda o tamanho da tela*/
	var deviceController = null;
	
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

	/* Controlador da janela modal */
	var modalWindow = document.createElement("DIV");

	/* atributos do janela modal */
	modalWindow.style.display         = "block";
	modalWindow.style.width           = "100%";
	modalWindow.style.height          = "100%";
	modalWindow.style.padding         = "0.5em";
	modalWindow.style.position        = "fixed";
	modalWindow.style.top             = "0";
	modalWindow.style.right           = "0";
	modalWindow.style.bottom          = "0";
	modalWindow.style.left            = "0";
	modalWindow.style.color           = "#FFFFFF";
	modalWindow.style.backgroundColor = "#005544";
	modalWindow.style.opacity         = "0.9";
	modalWindow.style.zIndex          = "999999";
	modalWindow.style.cursor          = "progress";

	/* contador da janela modal */
	var modalWindowCount = 0;

	/* abrir chamada modal */
	function modalWindowOpen() {
		data_wdConfig();
		modalWindow.textContent = wdConfig.loading;
		if (modalWindowCount === 0) {/* abrir só se não estiver aberto */
			document.body.appendChild(modalWindow);
		}
		modalWindowCount++;
		return;
	}

	/* fechar chamada modal */
	function modalWindowClose() {
		window.setTimeout(function () {
			if (modalWindowCount > 0) {
				modalWindowCount--;
			}
			if (modalWindowCount < 1) {/* fechar se não houver requisição aberta */
				document.body.removeChild(modalWindow);
			}
			return;
		}, 250);
		return;
	}

	function standardRequest(action, pack, callback, method, async) {

		/* variáveis locais */
		var request, data, time;

		/* verificando argumentos */
		if (WD(action).type !== "text") {
			return false;
		}

		if (pack === undefined || WD(pack).type === "null") {
			pack = null;
		}

		method = WD(method).type === "text" ? method.toUpperCase() : "GET";

		if (async === undefined) {
			async = true;
		}

		if (WD(callback).type !== "function") {
			callback = null
		}

		/* obtendo a interface */
		if ("XMLHttpRequest" in window) {
			request = new XMLHttpRequest();
		} else if ("ActiveXObject" in window) {
			try {
				request = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				request = new ActiveXObject("Microsoft.XMLHTP");
			}
		} else {
			log("XMLHttpRequest and ActiveXObject are not available!", "e");
			return false;
		}

		/* objeto com os dados */
		data = {
			closed:   false,    /* indica o término da requisição */
			status:   "UNSENT", /* UNSENT|OPENED|HEADERS|LOADING|UPLOADING|DONE|NOTFOUND|ABORTED|ERROR|TIMEOUT */
			time:     0,        /* tempo decorrido desde o início da chamada (milisegundos)*/
			size:     0,        /* registra o tamanho total do arquivo */
			loaded:   0,        /* registra o tamanho carregado na requisição */
			progress: 0,        /* registra o andamento da requisição */
			text:     null,     /* registra o conteúdo textual da requisição */
			xml:      null,     /* registra o XML da requisição */
			json:     null,     /* registra o JSON da requisição */
			request:  request,  /* registra os dados da requisição */
		};

		/* função para definir eventos */
		function wdSetEvents(status, closed, loaded, size) {
			if (data.closed === false) {
				data.status   = status;
				data.closed   = closed === true ? true : false;
				data.loaded   = WD(loaded).type === "number" ? loaded : 0;
				data.size     = WD(size).type   === "number" ? size   : 0;
				data.progress = data.size > 0 ? data.loaded/data.size : 1;
				data.time = (new Date()) - time;
				if (status === "ABORTED") {
					request.abort();
				}
				if (callback !== null) {
					callback(data);
				}
				data.progress = 0;
				data.loaded   = 0;
				data.size     = 0;
			}
			return;
		}

		/* função para abortar*/
		data.abort = function() { 
			wdSetEvents("ABORTED", true, 0, 0);
			return;
		},

		/* função de progresso no load */
		request.onprogress = function(x) {
			wdSetEvents("LOADING", false, x.loaded, x.total);
			return;
		}

		/* função de erro */
		request.onerror = function(x) {
			wdSetEvents("ERROR", true, 0, 0);
			return;
		}

		/* função de expirar o tempo */
		request.ontimeout = function(x) {
			wdSetEvents("TIMEOUT", true, 0, 0);
			return;
		}

		/* funções a serem executada durante o upload */
		if ("upload" in request) {
			request.upload.onprogress = function(x) {
				wdSetEvents("UPLOADING", false, x.loaded, x.total);
				return;
			}
			request.upload.onabort   = request.onerror;
			request.upload.ontimeout = request.ontimeout;
		}

		/* função a ser executada a cada mudança de estado */
		request.onreadystatechange = function(x) {
			if (request.readyState < 1 || data.closed === true) {
				return;
			} else if (data.status === "UNSENT") {
				data.status = "OPENED";
			} else if (request.status === 404) {
				data.status = "NOTFOUND";
				data.closed = true;
			} else if (request.readyState === 2) {
				data.status = "HEADERS";
			} else if (request.readyState === 3) {
				if ("onprogress" in request) {
					return;
				} else {
					data.status = "LOADING";
				}
			} else if (request.readyState === 4) {
				data.closed = true;
				if (request.status === 200 || request.status === 304) {
					data.status   = "DONE";
					data.progress = 1;
					data.text     = request.responseText;
					data.xml      = request.responseXML;

					try {
						data.json = JSON.parse(data.text) || eval("("+data.text+")");
					} catch(e) {
						data.json = null;
					}
				} else {
					data.status = "ERROR";
				}
			}
			data.time = (new Date()) - time;
			if (data.closed === true) {
				modalWindowClose();
			}
			if (callback !== null) {
				callback(data);
			}
			return;
		}

		/* abrir janela modal */
		modalWindowOpen();

		/*tempo inicial da chamada */
		time = new Date();

		/* envio da requisição */
		if (method === "GET" && WD(pack).type === "text") {
			action += action.split("?").length > 1 ? pack : "?"+pack;
			pack = null;
		}

		request.open(method, action, async);

		if (method === "POST" && WD(pack).type === "text") {
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}

		request.send(pack);

		return true;
	}

/*----------------------------------------------------------------------------*/

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


	/*ferramenta para requisições api com xmlhttlrequest*/
	Object.defineProperty(WD.prototype, "send", {
		enumerable: true,
		value: function(action, callback, method, async) {
			if (WD(action).type !== "text") {
				return false;
			}

			var pack;			

			switch(this.type) {
				case "text":
					pack = this.toString();
					break;
				case "dom":
					if (WD(method).type === "text" && WD(method).upper() === "POST") {
						pack = this.Form;
					} else {
						pack = this.form;
					}
					break;
				case "null":
					pack = null;
					break;
				case "undefined":
					pack = null;
					break;
				default:
					pack = "value="+this.toString();
			}

			/*efetuando a requisição*/
			standardRequest(action, pack, callback, method, async);

			return true;
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

	/*caixa alta*/
	Object.defineProperty(WDtext.prototype, "upper", {
		enumerable: true,
		value: function(change) {
			var value;
			value = this.toString().toUpperCase();
			if (change === true) {
				this._value = value;
				value = this;
			}
			return value;
		}
	});

	/*caixa baixa*/
	Object.defineProperty(WDtext.prototype, "lower", {
		enumerable: true,
		value: function(change) {
			var value;
			value = this.toString().toLowerCase();
			if (change === true) {
				this._value = value;
				value = this;
			}
			return value;	
		}
	});

	/*transforma abc-def em abcDef*/
	Object.defineProperty(WDtext.prototype, "camel", {
		enumerable: true,
		value: function() {
			var x;
			x = this.clear();
			if ((/^[a-z0-9\.\_\:][a-zA-Z0-9\.\_\:]+$/).test(x)) {
				/*fazer nada*/
			} else if ((/^[a-z0-9\_\.\:]+((\-[a-z0-9\_\.\:]+)+)?$/g).test(x) === true) {
				x    = x.toLowerCase().replace(/\-/g, " ");
				x    = WD(x).title().split(" ");
				x[0] = x[0].toLowerCase();
				x    = x.join("");
			} else {
				x = null;
			}
			return x;
		}
	});

	/*transforma abc-def em abcDef*/
	Object.defineProperty(WDtext.prototype, "dash", {
		enumerable: true,
		value: function(char) {
			var x;
			x = this.clear();
			if ((/^[a-z0-9\_\.\:]+((\-[a-z0-9\_\.\:]+)+)?$/g).test(x) === true) {
				/*fazer nada*/
			} else if ((/^[a-z0-9\.\_\:][a-zA-Z0-9\.\_\:]+$/).test(x) === true) {
				char = WD(char).type === "text" ? WD(char).toString()[0] : "-";
				x = x.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/\-/g, char);
			} else {
				x = null;
			}
			return x;
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
			var path, ispath;

			/*definindo variáveis*/
			ispath = false;
			path = this.toString().replace(/^\'/, "");

			this.send(path, function(x) {
				if (x.closed && x.status === "DONE") {
					ispath = true;
				}
				return;
			}, "HEAD", false);

			return ispath;
		}
	});

	/*Obtêm o conteúdo do caminho e retorna o método de requisição (descontinuar)*/
	Object.defineProperty(WDtext.prototype, "request", {
		enumerable: true,
		value: function(method, time) {
			var path, pack;

			/* para o caso do endereço ser um número, remover ' do início */
			pack    = this.toString().replace(/^\'/, "").split("?");
			path    = pack[0];
			pack[0] = "";
			pack = pack.join("?").replace("?", "");/*!!!deixar assim para o caso de ter mais de um ?*/

			/* definindo pack (serialized) */
			if (WD(pack).type !== "text") {
				pack = null;
			} else if ((/^\$\{.+\}$/).test(pack)) {
				pack = $(new DataAttr().convert(pack)["$"]);
			}

			/* ajustando o tempo (segundos = *1000) */
			time = WD(time);
			time = (time.type === "number" && time.valueOf() > 0) ? 1000*time.valueOf() : 0;

			/* função a ser executada */
			function textRequestFunction(METHOD) {
				WD(pack).send(path, function(x) {
					if (x.closed === true) {
						x.error = x.status === "DONE" ? false : true;
						method(x);
					} else if (time > 0 && data.time > time) {
						x.abort();
					}
					return;			
				}, METHOD);
				return;
			}

			return {
				get: function() {
					textRequestFunction("GET");
				},
				post: function () {
					textRequestFunction("POST");
				}
			};
		}
	});

	/*Exibe uma mensagem temporária na tela*/
	Object.defineProperty(WDtext.prototype, "message", {
		enumerable: true,
		value: function(type) {
			if (WD(document.body).type === "dom") {
				var msgWindow = document.createElement("DIV");
				msgWindow.innerHTML = this.toString();
				if (type === "error") {
					type = "#DC143C";
				} else if (type === "info") {
					type = "#1E90FF";
				} else if (type === "alert") {
					type = "#ff8c00";
				} else if (type === "ok") {
					type = "#008080";
				} else {
					type = "#000000";
				};

				WD(msgWindow).style({
					display: "block",
					width: deviceController === "Desktop" ? "20%" : "auto",
					padding: "0.5em",
					position: "fixed",
					top: "0.5em",
					right: "0.5em",
					left: deviceController === "Desktop" ? "auto" : "0.5em",
					color: type,
					backgroundColor: "#FFFFFF",
					border: "1px solid "+type,
					boxShadow: "0.5em 0.5em 0.5em #cccccc",
					borderRadius: "0.2em",
					zIndex: "999999",
					cursor: "pointer",
				});
				msgWindow.onclick = function() {
					document.body.removeChild(msgWindow);
					return;
				}
				document.body.appendChild(msgWindow);
				window.setTimeout(function() {
					if (msgWindow.parentElement !== null) {
						document.body.removeChild(msgWindow);
					}
					return
				}, 6500);
			}
			return;
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

	/* atalhos para o tempo */
	Object.defineProperties(WDtime.prototype, {
		h: {
			enumerable: true,
			get: function () {return this.hour;},
			set: function (x) {return this.hour = x;}
		},
		m: {
			enumerable: true,
			get: function () {return this.minute;},
			set: function (x) {return this.minute = x;}
		},
		s: {
			enumerable: true,
			get: function () {return this.second;},
			set: function (x) {return this.second = x;}
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

	/* atalhos para data */
	Object.defineProperties(WDdate.prototype, {
		y: {
			enumerable: true,
			get: function () {return this.year;},
			set: function (x) {return this.year = x;}
		},
		m: {
			enumerable: true,
			get: function () {return this.month;},
			set: function (x) {return this.month = x;}
		},
		d: {
			enumerable: true,
			get: function () {return this.day;},
			set: function (x) {return this.day = x;}
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
			value: function(index) {
				var x = undefined;
				index = WD(index).type === "number" ? WD(index).integer : null;
				if (index === null) {
					/* não fazer nada */
				} else if (index >= 0 && index < this.items) {
					x = this.valueOf()[index];
				} else if (index < 0 && -index <= this.items) {
					x = this.valueOf()[this.items + index];
				}
				return x;
			}
		}
	});

	/*Informar se o argumento está contido no array*/
	Object.defineProperty(WDarray.prototype, "inside", {
		enumerable: true,
		value: function(value, indexes) {
			var x, list;
			x    = false;
			list = [];
			for (var i = 0; i < this.items; i++) {
				if (this.item(i) === value) {
					list.push(i);
					x = true;
					if (indexes !== true) {break;}
				}
			}
			return indexes === true ? list : x;
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

	/*Define método toString e valueOf*/
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
		},
		valueOf: {
			value: function() {
				return this._value;
			}
		}
	});

/* === DOM ================================================================= */

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

	/*função para definir o método de implementação de eventos*/
	function setHandler(event, method, elem, remove) {

		/* checando e definindo valores padrão */
		if (WD(method).type !== "function") {
			return false;
		}
		remove = remove === true ? true : false;
		event  = event.toLowerCase().replace(/^\-/, "").replace(/^on/, "");
		var special = [];

		if (remove === true) {
			if ("removeEventListener" in elem) {
				elem.removeEventListener(event, method, false);
			} else if ("detachEvent" in elem) {
				elem.detachEvent("on"+event, method);
			} else if (("on"+event) in elem) {
				/*função especial para navegadores bem antigos*/
				if (WD(elem["on"+event]).type === "function" && elem["on"+event].name === "wdEventHandler") {
					special = WD(elem["on"+event]("getMethods")).del(method);
				}
				elem["on"+event] = null;
				for (var i = 0; i < special.length; i++) {
					setHandler(event, special[i], elem);
				}
			} else {
				return false;
			}
		} else {
			if ("addEventListener" in elem) {
				elem.addEventListener(event, method, false);
			} else if ("attachEvent" in elem) {
				elem.attachEvent("on"+event, method);
			} else if (("on"+event) in elem) {
				/*função especial para navegadores bem antigos*/
				if (WD(elem["on"+event]).type === "function") {
					special = elem["on"+event].name === "wdEventHandler" ? elem["on"+event]("getMethods") : [elem["on"+event]];
				}
				special = WD(special);
				special.add(method);
				special = special.unique();
				elem["on"+event] = getEventMethod(special);
			} else {
				return false;
			}
		}

		return true;
	};






	/*obter os dados de formulários nome|valor (retora um array de objetos)*/
	function getFormData(elem) {
		var form, type, name, value;

		/*é preciso que o elemento tenha value e name ou retornará null*/
		form = [];
		type = [];
		name  = "name"  in elem ? elem.name  : null;
		value = "value" in elem ? elem.value : null;
		if (name === null || value === null || WD(name).type === "null") {
			return form;
		}

		/* caso o elemento seja um input (possui o atributo type) */
		if (elem.tagName.toLowerCase() === "input") {

			/* verificando o type definido e o type informado */
			type.push(elem.type.toLowerCase());
			type.push("type" in elem.attributes ? elem.attributes.type.value.toLowerCase() : type[0]);

			/* caixas de seleção */
			if (WD(type).inside("radio") || WD(type).inside("checkbox")) {
				value = elem.checked ? value : null;
			/* data */
			} else if (WD(type).inside("date")) {
				value = WD(value).type === "date" && value !== "%today" ? WD(value).toString() : null;
			/* tempo */
			} else if (WD(type).inside("time")) {
				value = WD(value).type === "time" && value !== "%now" ? WD(value).toString() : null;
			/* número */
			} else if (WD(type).inside("number") || WD(type).inside("range")) {
				value = WD(value).type === "number" ? WD(value).valueOf() : null;
			/* arquivos */
			} else if (WD(type).inside("file")) {
				/* se houver o atributo files (caso especial) */
				if ("files" in elem) {
					for (var i = 0; i < elem.files.length; i++) {
						form.push({
							name:  name+"_"+i,
							value: encodeURIComponent(elem.files[i].name),
							post:  elem.files[i]
						});
						/* para evitar o último condicional */
						value = null;
					}
				} else {
					value = value.split(/(\/|\\)/).reverse()[0];
				}
			}
		}

		/* definindo série, exceto se files existir e for maior que zero */
		if (value !== null) {
			form.push({
				name:  name,
				value: encodeURIComponent(value),
				post:  value
			});
		}

		return form;
	};

	/*trabalhar com dataset em crossbrowser*/
	function DataAttr(elem) {
		if (!(this instanceof DataAttr)) {
			return new DataAttr(elem, name);
		}

		/*attributos do objeto*/
		this.elem = WD(elem).type !== "dom" ? document.body : elem;

		/* métodos do objeto*/

		/*define o nome do atributo*/
		this.setName = function(name) {
			name = WD(name).toString().replace(/^data\-/i, "");
			name = WD(name).camel();
			return name;
		}

		/*retorna todos os atributos do tipo data em forma de objeto*/
		this.dataset = function() {
			var data, name, value;
			if ("dataset" in this.elem) {
				data = this.elem.dataset;
			} else {
				data = {};
				for (var i = 0; i < this.elem.attributes.length; i++) {
					name  = this.elem.attributes[i].name;
					value = this.elem.attributes[i].value;
					if ((/^data\-/i).test(name) === true) {
						name = name.replace(/^data\-/i, "").toLowerCase();
						name = WD(name).camel();
						data[name] = value;
					}
				}
			}
			return data;
		}

		/*verifica se o atributo existe*/
		this.has = function(name) {
			name = this.setName(name);
			return name in this.dataset();
		}

		/*obtém o valor do atributo*/
		this.get = function(name) {
			name = this.setName(name);
			if (name in this.dataset()) {
				return this.dataset()[name];
			}
			return null;
		}

		/*define o valor do atributo*/
		this.set = function(name, value) {
			name = this.setName(name);
			value = WD(value).type === "regexp" ? WD(value).toString() : value;
			if (name === null) {
				return false;
			} else if ("dataset" in elem) {
				this.elem.dataset[name] = value;
				return true;
			} else {
				name = "data-"+WD(name).dash();
				this.elem.setAttribute(name, value);
				return true;
			}
			return false;
		}

		/* remove o atributo*/
		this.del = function(name) {
			name = this.setName(name);
			if (name === null) {
				return false;
			} else if ("dataset" in elem) {
				this.elem.dataset[name] = null;
				delete elem.dataset[name];
				return true;
			} else {
				name = "data-"+WD(name).dash();
				this.set(name, null);
				this.elem.removeAttribute(name);
				return true
			}
			return false;
		}

		/*obter os atributo pares key1{value1}... em objeto {key1: value1,...}*/
		this.convert = function(input) {
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

		/*retorna o objeto de convert a partir do atributo*/
		this.core = function(attr) {
			var x = {};
			if (this.has(attr)) {
				x = this.convert(this.get(attr));
			}
			return x;
		};

		/*retorna um array de objetos de core quando separados por &*/
		this.cores = function(attr) {
			var x, value;
			x     = [];
			value = this.get(attr).replace(/\}\&/g, "}--&--").split("--&--");
			if (this.has(attr)) {
				for (var i = 0; i < value.length; i++) {
					x.push(this.convert(value[i]));
				}
			}
			return x;
		};
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
		value: function(input) {
			if (input === null || WD(input).type === "object") {
				this.run(function(elem) {
					var key, data;
					data = new DataAttr(elem);
					if (input === null) {
						for (key in data.dataset()) {
							data.del(key);
						}
					} else {
						for (var i in input) {
							key = data.setName(i);
							if (input[i] === null) {
								data.del(key);
							} else {
								data.set(key, input[i]);
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
							key = WD(i).camel();
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
						if ("remove" in elem) {
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
					case "toggle-show":
						WD(elem).class({toggle: "js-wd-no-display"});
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
		value: function (input, remove) {

			if (WD(input).type !== "object") {
				return false;
			}

			var del, event, methods;

			/*looping nos eventos*/
			for (var i in input) {
				event   = i;
				del     = (remove === true || (/^\-/).test(event)) ? true : false;
				methods = WD(input[i]).type === "array" ? WD(input[i]).unique() : [input[i]];

				/*looping nos métodos*/
				for (var n = 0; n < methods.length; n++) {
					/*looping nos elementos*/
					this.run(function(elem) {
						if (!setHandler(event, methods[n], elem, del)) {
							log("handler: Invalid argument ("+event+" "+methods[n].name+")", "w");
						}
						return;
					});
				}
			}
			return true;
		}
	});

	/*Constroi elementos html a partir de um array de objetos*/
	Object.defineProperty(WDdom.prototype, "repeat", {
		enumerable: true,
		value: function (json) {
			if (WD(json).type === "array") {
				this.run(function(elem) {
					var inner, re, html, data;
					html = elem.innerHTML;
					data = new DataAttr(elem);
					if (html.search(/\{\{.+\}\}/gi) >= 0) {
						data.set("wdRepeatModel", html);
					} else if ("wdRepeatModel" in elem.dataset) {
						html = data.get("wdRepeatModel");
					} else {
						html = null;
					}
					if (html !== null) {
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
			var x = [];
			this.run(function(elem) {
				var data = getFormData(elem);
				for (var i = 0; i < data.length; i++) {
					x.push(data[i].name+"="+data[i].value);
				}
				return;
			});
			return x.join("&");
		}
	});

	/*Obtem a serialização de formulário com FromData*/
	Object.defineProperty(WDdom.prototype, "Form", {
		enumerable: true,
		get: function() {
			if (!("FormData" in window)) {
				return this.form;
			}

			var x = new FormData();

			this.run(function(elem) {
				var data = getFormData(elem);
				for (var i = 0; i < data.length; i++) {
					x.append(
						data[i].name,
						data[i].post === null ? data[i].value : data[i].post
					);
				}
				return;
			});
			return x;
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

	/*define as mensagens da biblioteca wdConfig*/
	function data_wdConfig() {
		var data, value;
		wdConfig = {
			loading:   "Loading data, please wait.",
			fileSize:  "larger file size than allowed.",
			fileTotal: "Total file size larger than allowed.",
			fileChar:  "characters not allowed in the file name",
			fileLen:   "Maximum number of files exceeded.",
			fileType:  "file type not allowed."
		};
		data  = new DataAttr(document.body);
		value = data.core("wdConfig");
		for (var i in wdConfig) {
			if (i in value) {
				wdConfig[i] = value[i];
			}
		}
		return;
	};

	/*Carrega html externo data-wd-load=post|get{file}${}*/
	function data_wdLoad(e) {
		var value, method, file, pack, target, data;
		data = new DataAttr(e);
		if (data.has("wdLoad")) {

			/*corrigindo modelo de versão anterior para novo modelo*/
			if (data.get("wdLoad").search(/\?\$\{/) >= 0) {
				data.set("wdLoad", data.get("wdLoad").replace("?${", "}${").replace("}}", "}"));
			}

			value  = data.core("wdLoad");
			method = "post" in value ? "post" : "get";
			file   = value[method];
			pack   = "$" in value ? $(value["$"]) : null;
			target = WD(e);
			target.data({wdLoad: null});
			WD(pack).send(file, function(x) {
				if (x.closed === true) {
					target.load(x.text === null ? "" : x.text);
					if (x.status !== "DONE") {
						log(file+": The request with the file failed.", "e");
					}
				}
			}, method);
		}
		return;
	};

	/*Constroe html a partir de um arquivo json data-wd-repeat=post{file}|get{file}*/
	function data_wdRepeat(e) {
		var value, method, file, pack, target, data;
		data = new DataAttr(e);
		if (data.has("wdRepeat")) {

			/*corrigindo modelo de versão anterior para novo modelo*/
			if (data.get("wdRepeat").search(/\?\$\{/) >= 0) {
				data.set("wdRepeat", data.get("wdRepeat").replace("?${", "}${").replace("}}", "}"));
			}

			value  = data.core("wdRepeat");
			method = "post" in value ? "post" : "get";
			file   = value[method];
			pack   = "$" in value ? $(value["$"]) : null;
			target = WD(e);
			target.data({wdRepeat: null});
			WD(pack).send(file, function(x) {
				if (x.closed === true) {
					target.repeat(x.json === null ? [] : x.json);
					if (x.status !== "DONE") {
						log(file+": The request with the file failed.", "e");
					}
				}
			}, method);
		}
		return;
	};

	/*Faz requisição a um arquivo externo data-wd-send=post|get{file}${CSS selector}callback{function()}*/
	function data_wdSend(e) {
		var value, method, file, pack, callback, data;
		data = new DataAttr(e);
		if (data.has("wdSend")) {
			value    = data.core("wdSend");
			method   = "post" in value ? "post" : "get";
			file     = value[method];
			pack     = "$" in value ? $(value["$"]) : null;
			callback = window[value["callback"]];
			WD(pack).send(file, callback, method);
		}			
		return;
	};

	/*Faz requisição a um arquivo externo data-wd-request=post|get{file}method{function()}*/
	function data_wdRequest(e) {
		var value, method, file, callback, data;
		data = new DataAttr(e);
		if (data.has("wdRequest")) {
			value    = data.core("wdRequest");
			method   = "post" in value ? "post" : "get";
			file     = value[method];
			callback = window[value["method"]];
			WD(file).request(callback)[method]();
		}			
		return;
	};

	/*Ordena elementos filhos data-wd-sort="number"*/
	function data_wdSort(e) {
		var order, data;
		data = new DataAttr(e);
		if (data.has("wdSort")) {
			order = WD(data.get("wdSort")).valueOf();
			WD(e).sort(order).data({wdSort: null});
		}
		return;
	};

	/*Filtra elementos filhos data-wd-filter=show|hide{min}${css}&...*/
	function data_wdFilter(e) {
		var value, text, data, show, min, target;

		data = new DataAttr(e);
		if (data.has("wdFilter")) {
			text  = "value" in e ? e.value : e.textContent;
			value = data.cores("wdFilter");
			for (var i = 0; i < value.length; i++) {
				show   = "hide" in value[i] ? false : true;
				min    = "hide" in value[i] ? value[i].hide : value[i].show;
				target = "$"    in value[i] ? $(value[i]["$"]) : null;
				if (WD(target).type === "dom") {
					WD(target).filter(text, min, show);
				}
			}
		}
		return;
	};

	/*Define máscara do elemento data-wd-mask="StringMask"*/
	function data_wdMask(e) {
		var value, re, mask, data, shortcutMask;
		shortcutMask = {
			"DDMMYYYY": /^(0[1-9]|[12][0-9]|3[0-1])\.(0[1-9]|1[0-2])\.([0-9]{4})$/,
			"MMDDYYYY": /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[0-1])\/([0-9]{4})$/,
			"YYYYMMDD": /^([0-9]{4})\-(0[1-9]|1[0-2])\-(0[1-9]|[12][0-9]|3[0-1])$/,
			"HHMMSS": /^([01][0-9]|2[0-4])\:([0-5][0-9])\:([0-5][0-9])$/,
			"HHMM": /^([01][0-9]|2[0-4])\h([0-5][0-9])$/,
			"AMPM": /^(0[1-9]|1[0-2])\:([0-5][0-9][apAP])m$/,
		};
		data = new DataAttr(e);
		if (data.has("wdMask")) {
			value = "value" in e ? e.value : e.textContent;
			if (data.get("wdMask") in shortcutMask) {
				re = shortcutMask[data.get("wdMask")];
			} else {
				re = new RegExp(data.get("wdMask"));
			}
			mask  = WD(re).mask(value);
			if (mask !== false) {
				e["value" in e ? "value" : "textContent"] = mask;
			}
			if ("value" in e) {
				if (mask === false && e.value !== "") {
					WD(e).class({add: "js-wd-mask-error"});
				} else {
					WD(e).class({del: "js-wd-mask-error"});
				}
			}
		}
		return;
	};

	/*Define os elementos a serem exibidos data-wd-page=page{p}size{s}*/
	function data_wdPage(e) {
		var attr, page, size, data;
		data = new DataAttr(e);
		if (data.has("wdPage")) {
			attr = data.core("wdPage");
			page = attr.page;
			size = attr.size;
			WD(e).page(page, size).data({wdPage: null});
		}
		return;
	};

	/*Executa o método click() ao elemento após o load data-wd-click=""*/
	function data_wdClick(e) {
		var data;
		data = new DataAttr(e);
		if (data.has("wdClick")) {
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
		data = new DataAttr(e);
		if (data.has("wdAction")) {
			value = data.core("wdAction");console.log(action);
			for (var action in value) {
				target = WD($(value[action]));
				/* se o alvo não for um dom, será aplicado ao próprio elemento*/
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
		data = new DataAttr(e);
		if (data.has("wdData")) {
			value = data.cores("wdData");
			for (var i = 0; i < value.length; i++) {
				/* se o alvo não for um dom, será aplicado ao próprio elemento*/
				target = target = "$" in value[i] ? WD($(value[i]["$"])) : WD(e);
				delete value[i]["$"]; /*!!! a chave $ não definirá data-$*/
				if (target.type === "dom") {
					target.data(value[i]);
				} else {
					WD(e).data(value[i]);
				}
			}
		}
		return;
	};

	/*Define o link ativo do elemento nav sem interface data*/
	function data_wdActive(e) {
		if (e.parentElement !== null && WD(e.parentElement.tagName).title() === "Nav") {
			WD(e.parentElement.children).class({del: "wd-nav-active"});
			if (["A", "SPAN"].indexOf(e.tagName.toUpperCase()) >= 0) {
				WD(e).class({add: "wd-nav-active"});
			}
		}
		return;
	};

	/*Ordena as colunas de uma tabela data-wd-sort-col=""*/
	function data_wdSortCol(e) {
		var order, thead, heads, bodies, data;
		data = new DataAttr(e);
		if (data.has("wdSortCol") && WD(e.parentElement.parentElement.tagName).title() === "Thead") {
			order  = data.get("wdSortCol") === "+1" ? -1 : 1;
			thead  = e.parentElement.parentElement;
			heads  = e.parentElement.children;
			bodies = thead.parentElement.tBodies;
			WD(heads).run(function(x) {
				var ndata;
				ndata = new DataAttr(x);
				if (ndata.has("wdSortCol")) {
					ndata.set("wdSortCol", "");
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

	/*Define o estilo do elemento a partir do tamanho da tela data-wd-device=desktop{css}tablet{css}phone{css}mobile{css}*/
	function data_wdDevice(e) {
		var data, value, desktop, mobile, tablet, phone;
		data = new DataAttr(e);
		if (data.has("wdDevice")) {
			value   = data.core("wdDevice");
			desktop = "desktop" in value ? value.desktop : "";
			mobile  = "mobile"  in value ? value.mobile  : "";
			tablet  = "tablet"  in value ? value.tablet  : "";
			phone   = "phone"   in value ? value.phone   : "";
			switch(deviceController) {
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

	/*analisa as informações do arquivo data-wd-file=size{value}type{}char{}len{}*/
	function data_wdFile(e) {
		var tag, type, files, value, data, info, error, name, total;
		data_wdConfig();
		data  = new DataAttr(e);
		tag   = e.tagName.toLowerCase();
		type  = e.type.toLowerCase();
		files = "files" in e ? e.files : [];
		error = [];
		total = 0;
		value = data.core("wdFile");

		if (data.has("wdFile") && tag === "input" && type === "file") {

			for (var i = 0; i < files.length; i++) {

				/* atributos dos arquivos */
				name   = "name" in files[i] ? "<b>"+files[i].name+"</b><br>" : "";
				total += "size" in files[i] ? files[i].size : 0;

				/* verificar tamanho individual do arquivo*/
				info = WD(value["size"]);
				if (info.type === "number" && "size" in files[i]) {
					if (files[i].size > info.valueOf()) {
						error.push(name+wdConfig.fileSize);
					}
				}

				/* verificar o tipo do arquivo */
				info = WD(value["type"]);
				if (info.type === "text" && "type" in files[i]) {
					info = WD(info.toString().split(" "));
					if (info.inside(files[i].type) === false) {
						error.push(name+wdConfig.fileType);
					}
				}
				/* verificar caracteres do arquivo */
				info = WD(value["char"]);
				if (info.type === "text" && "name" in files[i]) {
					info = new RegExp("["+info.toString()+"]");
					if (files[i].name.search(info) >= 0) {
						error.push(name+wdConfig.fileChar+": "+value["char"]);
					}
				}
			}

			/* verificar quantidade de arquivos */
			info = WD(value["len"]);
			if (info.type === "number" && "length" in files) {
				if (files.length > info.round()) {
					error.push(wdConfig.fileLen);
				}
			}

			/* verificar tamanho total dos arquivos */
			info = WD(value["total"]);
			if (info.type === "number") {
				if (total > info.round()) {
					error.push(wdConfig.fileTotal);
				}
			}

			/* apagando arquivos e exibindo erro */
			if (error.length > 0) {
				e.value = null;
				WD("<small>"+error.join("<hr>")+"<small>").message("error");
				WD(e).class({add: "js-wd-mask-error"});
			} else {
				WD(e).class({del: "js-wd-mask-error"});
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

	/*Procedimentos para carregar objetos externos*/
	function loadingProcedures() {
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
		var elem = ev.target
		while (elem !== null) {
			data_wdAction(elem);
			data_wdData(elem);
			data_wdActive(elem);
			data_wdSortCol(elem);
			data_wdRequest(elem);
			data_wdSend(elem);
			elem = elem.parentElement;
		}
		return;
	};

	/*Procedimento a executar após acionamento do teclado*/
	function keyboardProcedures(ev) {
		data_wdFilter(ev.target);
		data_wdMask(ev.target);
		return;
	};

	/*Procedimento para definir o dispositivo pelo tamanho da tela*/
	function scalingProcedures(ev) {
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
	function stylingProcedures(ev) {
		WD($("[data-wd-device]")).run(data_wdDevice);
		return;
	};

	/*Procedimento a executar após alguma mudança*/
	function changeProcedures(ev) {
		data_wdFile(ev.target);
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
			case "wdFile":    data_wdFile(e);      break;
		};
		return;
	};

	/*Definindo e incluindo os estilos utilizados pelo javascript na tag head*/
	function headScriptProcedures(ev) {
		var style;
		style = document.createElement("STYLE");
		style.textContent  = ".js-wd-no-display {display: none !important;}";
		style.textContent += ".wd-nav-active    {outline: 1px dotted #000000;}";
		style.textContent += ".js-wd-mask-error {color: #663399 !important; background-color: #e8e0f0 !important;}";
		document.head.appendChild(style);
		return;
	};

	/*Definindo eventos*/
	WD(window).handler({
		load: [headScriptProcedures, loadingProcedures, hashProcedures, data_wdConfig],
		resize: scalingProcedures,
		hashchange: hashProcedures
	});
	WD(document).handler({
		click:  clickProcedures,
		keyup:  keyboardProcedures,
		change: changeProcedures
	});

/* === END ================================================================= */

	return WD;

}());

/*Atalho para o uso do método querySelectorAll em wdDom*/
function wd$(selector, root) {
	return wd(wd().$(selector, root));
}
/* ========================================================================= */
