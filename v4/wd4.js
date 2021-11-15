/*----------------------------------------------------------------------------
wd.js (v4.0.0)

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

//FIXME: abandonar IE, não tem oninput não funciona como deveria


"use strict";

var wd = (function() {

	function WDbox(input) {
		if (!(this instanceof WDbox)) return new WDbox(input);
		Object.defineProperty(this, "_input", {value: input});
	}

	Object.defineProperty(WDbox.prototype, "constructor", {value: WDbox});

	WDbox.version = "v4.0.0 2022-01-01";

	/*expressoes regulares*/
	WDbox.re = {
		noids: /[^a-zA-Z0-9\.\_\:\-\ ]/g,
		camel: /^[a-z0-9\.\_\:][a-zA-Z0-9\.\_\:]+$/,
		dash:  /^[a-z0-9\_\.\:]+((\-[a-z0-9\_\.\:]+)+)?$/,
		empty: /[\0- ]+/g,
	};

	WDbox.clearSpaces = function (x, punct) {
		return x.replace(WDbox.re.empty, (punct === undefined ? " " : punct));
	};

	WDbox.int = function(n, abs) {
		var val = new Number(n).valueOf();
		if (abs === true) val = Math.abs(val);
		return val < 0 ? Math.ceil(n) : Math.floor(n);
	};

	WDbox.finite = function(n) {
		if (n === null || n === undefined) return false;
		if (n === true || n === false)     return false;
		if (isNaN(n)   || !isFinite(n))    return false;
		return true;
	};

	WDbox.lang = function() { /*Retorna a linguagem do documento: definida ou navegador*/
		var attr  = document.body.parentElement.attributes;
		var value = "lang" in attr ? attr.lang.value.replace(/\ /g, "") : null;
		if (value === null) value = navigator.language || navigator.browserLanguage || "en-US";
		return value;
	}

	WDbox.calcByte = function(value) { /*calculadora de bytes*/
		if (value >= 1099511627776) return (value/1099511627776).toFixed(2)+"TB";
		if (value >= 1073741824)    return (value/1073741824).toFixed(2)+"GB";
		if (value >= 1048576)       return (value/1048576).toFixed(2)+"MB";
		if (value >= 1024)          return (value/1024).toFixed(2)+"kB";
		return value+"B";
	}

	/*Retorna os elementos html identificados pelo seletor css no elemento root*/
	WDbox.$ = function(selector, root) {
		try {return root.querySelector(selector);    } catch(e) {}
		try {return document.querySelector(selector);} catch(e) {}
		return null;
	}
	WDbox.$$ = function(selector, root) {
		try {return root.querySelectorAll(selector);    } catch(e) {}
		try {return document.querySelectorAll(selector);} catch(e) {}
		return null;
	}
	WDbox.get$$ = function(obj) {
		var selOne = "$"  in obj && obj["$"].trim()  !== "" ? obj["$"].trim()  : null;
		var selAll = "$$" in obj && obj["$$"].trim() !== "" ? obj["$$"].trim() : null;
		var words  = {"document": document, "window":  window};
		if (selOne in words) return words[selOne];
		if (selAll in words) return words[selAll];
		var qAll = selAll === null ? null : WDbox.$$(selAll);
		var qOne = selOne === null ? null : WDbox.$(selOne);
		if (qAll !== null && qAll.length > 0) return qAll;
		return qOne;
	}

	WDbox.isLeap = function(y) { /*Retorna verdadeiro se o ano for bissexto*/
		if (y === 0)       return false;
		if (y % 400 === 0) return true;
		if (y % 100 === 0) return false;
		if (y % 4 === 0)   return true;
		return false;
	}

	WDbox.timeNumber = function(h, m, s) { /*Converte tempo em número*/
		var time = 0;
		time += h * 3600;
		time += m * 60;
		time += s;
		return time % 86400;
	}

	WDbox.numberTime = function(n) { /*Converte número em tempo (objeto)*/
		var time = {};
		n      = n < 0 ? (86400 + (n % 86400)) : (n % 86400);
		time.h = (n - (n % 3600)) / 3600;
		n      = n - (3600 * time.h);
		time.m = (n - (n % 60)) / 60;
		time.s = n - (60 * time.m);
		return time;
	}

	WDbox.noonDate = function(date, d, m, y) { /*Define data ao meio dia*/
		if (date === null || date === undefined) date = new Date();
		date.setMilliseconds(0);
		date.setSeconds(0);
		date.setMinutes(0);
		date.setHours(12);
		if (WDbox.finite(y)) date.setFullYear(y);
		if (WDbox.finite(m)) date.setMonth(m - 1);
		if (WDbox.finite(d)) date.setDate(d);
		return date;
	}

	WDbox.csv = function(input) {/*CSV para Array*/
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

	WDbox.matrixObject = function(array) {/*matriz de array para objeto*/
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

	WDbox.device = function() {/*tipo do dispositivo*/
		if (window.innerWidth >= 768) return "desktop";
		if (window.innerWidth >= 600) return "tablet";
		return "phone";
	};

	/* Guarda informação do dispositivo (desktop, mobile...) */
	WDbox.deviceController = null;
	/* Guarda o intervalo de tempo para executar funções vinculadas aos eventos de tecla */
	WDbox.keyTimeRange = 500;

/*============================================================================*/

	function WDtype(input) {
		if (!(this instanceof WDtype)) return new WDtype(input);
		this._INPUT = input;     /* guarda o valor de entrada (imutável) */
		this._input = input;     /* guarda o valor de entrada */
		this._value = undefined; /* guarda o valor do objeto */
		this._type  = "unknown"; /* guarda o tipo do objeto */
		if (this.isString) this._input = input.trim();
		this._run();
	}

	Object.defineProperty(WDtype.prototype, "constructor", {value: WDtype});

	Object.defineProperty(WDtype.prototype, "isFullString", {get: function() {
		if (!this.isString)            return false;
		if (this._input.trim() === "") return false;
		return true;
	}});

	Object.defineProperty(WDtype.prototype, "isString", {get: function() {
		if (typeof this._input === "string") return true;
		if (this._input instanceof String)   return true;
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isNull", {get: function() {
		if (this._input === null || this._input === "") {
			this._type  = "null";
			this._value = null;
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isUndefined", {get: function() {
		if (this._input === undefined) {
			this._type  = "undefined";
			this._value = undefined;
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isRegExp", {get: function() {
		if (typeof this._input === "regexp" || this._input instanceof RegExp) {
			this._type  = "regexp";
			this._value = this._input;
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isBoolean", {get: function() {
		if (
			this._input === true  ||
			this._input === false ||
		 	typeof this._input === "boolean" ||
			this._input instanceof Boolean
		) {
			this._type  = "boolean";
			this._value = this._input.valueOf();
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isArray", {get: function() {
		if (Array.isArray(this._input) || this._input instanceof Array) {
			this._type  = "array";
			this._value = this._input.slice();
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isObject", {get: function() {
		if (
			typeof this._input === "object" &&
			this._input instanceof Object &&
			(/^\{.*\}$/).test(JSON.stringify(this._input))
		) {
			this._type  = "object";
			this._value = this._input;
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isFunction", {get: function() {
		if (typeof this._input === "function" || this._input instanceof Function){
			this._type  = "function";
			this._value = this._input;
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isDOM", {get: function() {
		if (
			this._input === document ||
			this._input === window   ||
			this._input instanceof HTMLElement ||
			this._input instanceof SVGElement
		) {
			this._type  = "dom";
			this._value = [this._input];
			return true;
		}

		if (
			this._input instanceof NodeList ||
			this._input instanceof HTMLCollection ||
			this._input instanceof HTMLAllCollection ||
			"HTMLOptionsCollection" in window && this._input instanceof HTMLOptionsCollection || /*IE11*/
			"HTMLFormControlsCollection" in window && this._input instanceof HTMLFormControlsCollection /*IE 11*/
		) {
			this._type  = "dom";
			this._value = [];
			for (var i = 0; i < this._input.length; i++)
				this._value.push(this._input[i]);
			return true;
		}

		try {
			if (
				"nodeType" in this._input &&
				this._input.nodeType === 1 &&
				this._input.constructor.name in window &&
				"parentElement" in this._input
			) {
				this._type  = "dom";
				this._value = [this._input];
				return true;
			}
		} catch(e) {}

		if (!this.isString) return false;

		var save = this._input.toString();

		if ((/^\$\$\{.+\}$/).test(this._input)) {
			var selector = save.substr(3, (save.length - 4));
			this._input  = WDbox.$$(selector);
			if (this.isDOM && this._input.length > 0) return true;
		}

		if ((/^\$\{.+\}$/).test(this._input)) {
			var selector = save.substr(2, (save.length - 3));
			this._input  = WDbox.$(selector);
			if (this.isDOM) return true;
		}

		this._input = save;
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isText", {get: function() {
		if (!this.isString) return false;
		this._type  = "text";
		this._value = this._input;
		return true;
	}});

	Object.defineProperty(WDtype.prototype, "isNumber", {get: function() {
		if (
			(typeof this._input === "number" || this._input instanceof Number) &&
			!isNaN(this._input)
		) {
			this._type  = "number";
			this._value = this._input.valueOf();
			return true;
		}

		if (!this.isString) return false;
		if ((/Infinity$/).test(this._input)) return false;
		/*número em forma de texto (padrão)*/
		if (this._input == Number(this._input)) {
			this._type  = "number";
			this._value = Number(this._input).valueOf();
			return true;
		}
		/*fatorial*/
		if ((/^[0-9]+\!$/).test(this._input)) {
			var number = Number(this._input.replace("!", "")).valueOf();
			var value  = 1;
			while (number > 1) {
				value *= number;
				number--;
			}
			this._type  = "number";
			this._value = value;
			return true;
		}
		/*porcentagem*/
		if ((/^[\+\-]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)\%$/).test(this._input)) {
			var number  = Number(this._input.replace("%", "")).valueOf();
			this._type  = "number";
			this._value = number / 100;
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isTime", {get: function() {
		if (!this.isString) return false;

		if (/^(0?[0-9]|1[0-9]|2[0-4])(\:[0-5][0-9]){1,2}$/.test(this._input)) {/*HH:MM:SS*/
			this._type  = "time";
			var time    = this._input.split(":");
			this._value = WDbox.timeNumber(
				Number(time[0]),
				Number(time[1]),
				time.length === 3 ? Number(time[2]) : 0
			);
			return true;
		}

		if ((/^(0?[1-9]|1[0-2])\:[0-5][0-9]\ ?(am|pm)$/i).test(this._input)) {/*HH:MM AM|PM*/
			this._type  = "time";
			this._input = this._input.toLowerCase();
			var sep     = this._input[this._input.length - 2];
			var time    = this._input.split(sep)[0].trim().split(":");
			var hour    = Number(time[0]);
			this._value = WDbox.timeNumber(
				sep === "a" ? hour : (hour === 12 ? 0 : (12 + hour)),
				Number(time[1]),
				0
			);
			return true;
		}

		if ((/^(0?[0-9]|1[0-9]|2[0-4])h[0-5][0-9]$/i).test(this._input)) { /*24HhMM*/
			this._type  = "time";
			var time    = this._input.toLowerCase().split("h");
			this._value = WDbox.timeNumber(
				Number(time[0]),
				Number(time[1]),
				0
			);
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isDate", {get: function() {
		if (this._input instanceof Date) {/*DATE*/
			this._type  = "date";
			this._value = WDbox.noonDate(this._input);
			return true;
		}
		if (!this.isString) return false;

		var d, m, y, array, type, symbol, index;
		/*capturando formatos padrão (YYYY-MM-DD DD/MM/YYYY MM.DD.YYYY)*/
		if      (/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/.test(this._input)) type = 0;
		else if (/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(this._input)) type = 1;
		else if (/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/.test(this._input)) type = 2;
		else return false;

		symbol = ["-", "/", "."];
		index  = {d: [2, 0, 1], m: [1, 1, 0], y: [0, 2, 2]};
		array  = this._input.split(symbol[type]);

		d = Number(array[index.d[type]]);
		m = Number(array[index.m[type]]);
		y = Number(array[index.y[type]]);

		/*analisando formatos padrão*/
		if (y > 9999 || y < 1)  return false;
		if (m > 12   || m < 1)  return false;
		if (d > 31   || d < 1)  return false;
		if (d > 30   && [2, 4, 6, 9, 11].indexOf(m) >= 0) return false;
		if (d > 29   && m == 2) return false;
		if (d == 29  && m == 2 && !WDbox.isLeap(y)) return false;

		this._type  = "date";
		this._value = new Date();
		this._value = WDbox.noonDate(this._value, d, m, y);
		return true;
	}});

	Object.defineProperty(WDtype.prototype, "_run", {value: function() {
		var methods = [/*importante: objetos específicos devem estar antes dos genéricos*/
			"isUndefined", /*0*/
			"isNull",      /*0*/
			"isBoolean",   /*0*/
			"isRegExp",    /*0*/
			"isArray",     /*0*/
			"isDOM",       /*0*/
			"isFunction",  /*0*/
			"isTime",      /*0*/
			"isDate",      /*0*/
			"isNumber",    /*0*/
			"isText",      /*1*/
			"isObject"     /*2*/
		];
		for (var i = 0; i < methods.length; i++) {
			if (this[methods[i]]) return;
		}
		this._type  = "unknown";
		this._value = this._input;
	}});

	Object.defineProperty(WDtype.prototype, "type", {
		get: function() {return this._type;}
	});

	Object.defineProperty(WDtype.prototype, "value", {
		get: function() {return this._value;}
	});

	Object.defineProperty(WDtype.prototype, "input", {
		get: function() {return this._INPUT;}
	});

/*============================================================================*/

	function WDrequest(input) {
		if (!(this instanceof WDrequest)) return new WDrequest(input);
		this._action   = input;
		this._pack     = null;
		this._callback = null;
		this._method   = "GET";
		this._async    = true;

		this._start    = 0;        /* registra o início da requisição */
		this._request  = null;     /* registra o objeto para requisições */
		this._closed   = false;    /* indica o término da requisição */
		this._status   = "UNSENT"; /* UNSENT|OPENED|HEADERS|LOADING|UPLOADING|DONE|NOTFOUND|ABORTED|ERROR|TIMEOUT */
		this._time     = 0;        /* tempo decorrido desde o início da chamada (milisegundos)*/
		this._total    = 0;        /* registra o tamanho total do arquivo */
		this._loaded   = 0;        /* registra o tamanho carregado na requisição */
		this._progress = 0;        /* registra o andamento da requisição */
		this._text     = null;     /* registra o conteúdo textual da requisição */
		this._xml      = null;     /* registra o XML da requisição */
		this._json     = null;     /* registra o JSON da requisição */
		this._csv      = null;     /* transforma um arquivo CSV em JSON */
	}

	/* Métodos Estáticos ------------------------------------------------------*/
	WDrequest.window   = document.createElement("DIV"); /*guarda a janela modal*/
	WDrequest.progress = document.createElement("PROGRESS"); /*guarda a barra de progresso*/
	WDrequest.count    = 0; /*guarda o número de janelas abertas*/
	WDrequest.styled   = false; /*guarda a informação se a janela já foi estilizada*/

	WDrequest.setStyle = function() { /*define o estilo padrão se ainda não definido*/
		if (this.styled) return;
		this.window.appendChild(this.progress);
		this.progress.max = 1;
		var style    = {      /*guarda o estilo padrão da janela*/
			display:  "block", width: "100%", height: "100%",
			padding: "0.1em 0.5em", margin: "0", zIndex: "999999",
			position: "fixed", top: "0", right: "0", bottom: "0",	left: "0",
			cursor: "progress", backgroundColor: "rgba(0,0,0,0.4)"
		};
		for (var i in style) this.window.style[i] = style[i];
		this.styled = true;
		return;
	}

	WDrequest.open     = function() { /*abre a janela modal, se não estiver aberta*/
		this.setStyle();
		if (this.count === 0) document.body.appendChild(this.window);
		this.count++;
		return;
	}

	WDrequest.close    = function() { /*fecha a janela modal, se estiver aberta*/
		var parent = this;
		window.setTimeout(function () {
			if (parent.count > 0) parent.count--;
			if (parent.count < 1) document.body.removeChild(parent.window);
			return;
		}, 250);
		return;
	}

	/* Métodos de Protótipos --------------------------------------------------*/
	Object.defineProperty(WDrequest.prototype, "constructor", {value: WDrequest});

	Object.defineProperty(WDrequest.prototype, "_abort", {value: function() {
		this.setEvents("ABORTED", true, 0, 0);
		return;
	}});

	Object.defineProperty(WDrequest.prototype, "data", {get: function() {
		var data = {
			action: null, closed: null, status: null, time: null,
			total: null, loaded: null, progress: null,
			text: null, xml: null, json: null, csv: null,
			request: null, abort: null
		};
		for (var i in data) data[i] = this["_"+i];
		return data;
	}});

	Object.defineProperty(WDrequest.prototype, "setEvents", {
		value: function (status, closed, loaded, total) {
			if (this._closed) return;
			this._status   = status;
			this._closed   = closed;
			this._loaded   = loaded;
			this._total    = total;
			this._progress = this._total > 0 ? this._loaded/this._total : 1;
			this._time     = (new Date()) - this._start;

			/*barra de progresso*/
			var progressValue = this._progress;
			var progressBar   =  this.constructor.progress;
			window.setTimeout(function() {
				return progressBar.value = progressValue;
			}, 10);

			if (this._status === "ABORTED") this._request.abort();
			if (this._callback !== null)    this._callback(this.data);
			this._progress = 0;
			this._loaded   = 0;
			this._total    = 0;

			return;
		}
	});

	Object.defineProperty(WDrequest.prototype, "setRequestHandlers", {
		value: function() {/*define o ciclo da requisição*/
			var parent = this;

			this.request.onprogress = function(x) {
				return parent.setEvents("LOADING", false, x.loaded, x.total);
			}

			this.request.onerror = function(x) {
				return parent.setEvents("ERROR", true, 0, 0);
			}

			this.request.ontimeout = function(x) {
				return parent.setEvents("TIMEOUT", true, 0, 0);
			}

			this.request.upload.onprogress = function(x) {
				return parent.setEvents("UPLOADING", false, x.loaded, x.total);
			}

			this.request.upload.onabort   = this._request.onerror;
			this.request.upload.ontimeout = this._request.ontimeout;

			this.request.onreadystatechange = function(x) {

				if (parent._request.readyState < 1) return;
				if (parent._closed) return;

				if (parent._status === "UNSENT") {
					parent._status = "OPENED";
					parent.constructor.open();
				} else if (parent.request.status === 404) {
					parent._status = "NOTFOUND";
					parent._closed = true;
				} else if (parent.request.readyState === 2) {
					parent._status = "HEADERS";
				} else if (parent.request.readyState === 3) {
					parent._status = "LOADING";
				} else if (parent.request.readyState === 4) {
					parent._closed = true;
					if (parent.request.status === 200 || parent.request.status === 304) {
						parent._status    = "DONE";
						parent._progress  = 1;
						parent._text      = parent.request.responseText;
						parent._xml       = parent.request.responseXML;
						try {parent._json = JSON.parse(parent._text);} catch(e) {};
						try {parent._csv  = WDbox.csv(parent._text); } catch(e) {};
					} else {
						parent._status = "ERROR";
					}
				}

				parent._time = (new Date()) - parent._start;
				if (parent.callback !== null) parent.callback(parent.data);
				if (parent._closed) parent.constructor.close();

				return;
			}
			return;
		}
	});

	Object.defineProperty(WDrequest.prototype, "action", {
		get: function()  {return this._action;},
		set: function(x) {return this._action = x;}
	});

	Object.defineProperty(WDrequest.prototype, "callback", {
		get: function()  {return this._callback;},
		set: function(x) {return this._callback = x;}
	});

	Object.defineProperty(WDrequest.prototype, "method", {
		get: function()  {return this._method;},
		set: function(x) {return this._method = x.toUpperCase();}
	});

	Object.defineProperty(WDrequest.prototype, "async", {
		get: function()  {return this._async;},
		set: function(x) {return this._async = x === false ? false : true;}
	});

	Object.defineProperty(WDrequest.prototype, "pack", {
		get: function()  {return this._pack;},
		set: function(x) {return this._pack = x;}
	});

	Object.defineProperty(WDrequest.prototype, "request", {
		get: function()  {return this._request;},
		set: function(x) {return this._request = x;}
	});

	Object.defineProperty(WDrequest.prototype, "send", {value: function() {

		this._start  = new Date();
		this.request = new XMLHttpRequest();
		this.setRequestHandlers();
		var pack = WDtype(this._pack);

		if (this.method === "GET" && pack.type === "text") {
			var action   = this.action.split("?");
			this.action += action.length > 1 ? pack.value : "?" + pack.value;
			this.pack    = null;
		}

		try {
			this.request.open(this.method, this.action, this.async);
		} catch(e) {
			this.setEvents("ERROR", true, 0, 0)
			if (this.callback !== null) this.callback(this.data);
			this.constructor.close();
			return false;
		}

		if (this.method === "POST" && pack.type === "text") {
			this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}

		this.request.send(this.pack);

		return true;
	}});

/*============================================================================*/

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

		var style = WDbox.device() === "desktop" ? this.cmicro : this.cphone;
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

/*============================================================================*/

	function WD(input) {
		var wd  = new WDtype(input);
		var obj = {
			"undefined": WDundefined, "null":     WDnull,
			"boolean":   WDboolean,   "function": WDfunction,
			"object":    WDobject,    "regexp":   WDregexp,
			"array":     WDarray,     "dom":      WDdom,
			"time":      WDtime,      "date":     WDdate,
			"number":    WDnumber,    "text":     WDtext
		};
		for (var i in obj) {
			if (wd.type === i) return new obj[i](wd.input, wd.type, wd.value);
		}
		return new WDmain(wd.input, wd.type, wd.value)
	}

	WD.constructor = WD;
	Object.defineProperties(WD, {
		version: {get: function() {
			return WDbox.version;
		}},
		$: {value: function(css, root) {
			return WD(WDbox.$(css, root));
		}},
		$$: {value: function(css, root) {
			return WD(WDbox.$$(css, root));
		}},
		today: {get: function() {
			return WD(WDbox.noonDate(new Date()));
		}},
		now: {get: function() {
			var t = new Date();
			var o = {h: t.getHours(), m: t.getMinutes(), s: t.getSeconds()};
			for (var i in o) o[i] = (o[i] < 10 ? "0" : "") + o[i].toString();
			return WD(o.h+":"+o.m+":"+o.s);
		}},
	});

/*============================================================================*/

	function WDmain(input, type, value) {
		if (!(this instanceof WDmain)) return new WDmain(input, type, value);

		var writables = ["time", "date", "text", "array"];

		Object.defineProperties(this, {
			version: {get: function() {return WD.version;}},
			_input:  {value: input},
			_type:   {value: type},
			_value:  {
				value: value,
				writable: writables.indexOf(type) >= 0 ? true : false
			}
		});
	}

	Object.defineProperties(WDmain.prototype, {
		constructor: {value: WDmain},
		type:     {
			enumerable: true,
			get:   function() {return this._type;}
		},
		valueOf:  {
			value: function() {
				try {return this._value.valueOf();} catch(e) {}
				return Number(this._value).valueOf();
			}
		},
		toString: {
			value: function() {
				try {return this._value.toString();} catch(e) {}
				return String(this._value).toString();
			}
		}
	});

	Object.defineProperty(WDmain.prototype, "send", {
		enumerable: true,
		value: function (action, callback, method, async) {

			action   = new WDtype(action);
			if (!action.isFullString) return false;

			callback = new WDtype(callback);

			action   = action.input.trim();
			callback = callback.type === "function" ? callback.input : null;
			method   = new String(method).toUpperCase().trim();
			async    = async === false ? false : true;

			var pack;

			if (this.type === "dom") {
				pack = this.form(method);
			} else if (this.type === "number") {
				pack = "value="+this.valueOf();
			} else {
				pack = "value="+this.toString();
			}

			/*efetuando a requisição*/
			var request      = new WDrequest(action);
			request.method   = method;
			request.callback = callback;
			request.async    = async;
			request.pack     = pack;
			request.send();

			return true;
		}
	});

	Object.defineProperty(WDmain.prototype, "signal", {/*renderizar mensagem*/
		enumerable: true,
		value: function(title) {
			WDsignal.msg(title, this.toString());
			return this.type === "dom" ? this : null;
		}
	});

	Object.defineProperty(WDmain.prototype, "notify", {/*renderizar notificação*/
		enumerable: true,
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
		enumerable: true,
		get: function() {
			if (this.type !== "number") return false;
			return this.abs !== Infinity ? true : false;
		}
	});

/*============================================================================*/

	function WDundefined(input, type, value) {
		if (!(this instanceof WDundefined)) return new WDundefined(input, type, value);
		WDmain.call(this, input, type, value);
	}

	WDundefined.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDundefined}
	});

	Object.defineProperties(WDundefined.prototype, {
		valueOf:  {value: function() {return Infinity;}},
		toString: {value: function() {return "?";}}
	});

/*============================================================================*/

	function WDnull(input, type, value) {
		if (!(this instanceof WDnull)) return new WDnull(input, type, value);
		WDmain.call(this, input, type, value);
	}

	WDnull.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnull}
	});

	Object.defineProperties(WDnull.prototype, {
		valueOf:  {value: function() {return 0;}},
		toString: {value: function() {return "";}}
	});

/*============================================================================*/

	function WDboolean(input, type, value) {
		if (!(this instanceof WDboolean)) return new WDboolean(input, type, value);
		WDmain.call(this, input, type, value);
	}

	WDboolean.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDboolean}
	});

	Object.defineProperties(WDboolean.prototype, {
		valueOf:  {value: function() {return this._value ? 1 : 0;}},
		toString: {value: function() {return this._value ? "True" : "False";}}
	});

/*============================================================================*/

	function WDfunction(input, type, value) {
		if (!(this instanceof WDfunction)) return new WDfunction(input, type, value);
		WDmain.call(this, input, type, value);
	}

	WDfunction.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDfunction}
	});

/*============================================================================*/

	function WDobject(input, type, value) {
		if (!(this instanceof WDobject)) return new WDobject(input, type, value);
		WDmain.call(this, input, type, value);
	}

	WDobject.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDobject}
	});

	Object.defineProperty(WDobject.prototype, "toString", {
		value: function() {return JSON.stringify(this._value);}
	});

/*============================================================================*/

	function WDregexp(input, type, value) {
		if (!(this instanceof WDregexp)) return new WDregexp(input, type, value);
		WDmain.call(this, input, type, value);
	}

	WDregexp.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDregexp}
	});

	Object.defineProperty(WDregexp.prototype, "toString", {
		value: function() {return this._value.source;}
	});

/*============================================================================*/

	function WDtext(input, type, value) {
		if (!(this instanceof WDtext)) return new WDtext(input, type, value);
		WDmain.call(this, input, type, value);
	}

	Object.defineProperties(WDtext, {
		mask: {/*checa e retorna uma máscara (obs.: não é o método de protótipo)*/
			value: function(input, check, callback) {
				check = String(check).toString();
				var code  = {"#": "[0-9]", "@": "[a-zA-ZÀ-ÿ]", "*": "."};
				var mask  = ["^"]; /*Formato da máscara (conteúdo + caracteres)*/
				var only  = ["^"]; /*Conteúdo da máscara (conteúdo apenas)*/
				var gaps  = [];    /*Caracteres da máscara (comprimento do formato)*/
				var func  = new WDtype(callback);
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

				/*returnar se o usuário entrou com a máscara já formatada adequadamente*/
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
		}
	});

	WDtext.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDtext}
	});

	Object.defineProperty(WDtext.prototype, "caps", {/*captular*/
		enumerable: true,
		get: function() {
			var input = this.lower.split("");
			var empty = true;
			for (var i = 0; i < input.length; i++) {
				input[i] = empty ? input[i].toUpperCase() : input[i];
				empty    = input[i].trim() === "" ? true : false;
			}
			return input.join("");
		}
	});

	Object.defineProperty(WDtext.prototype, "toggle", {/*inverte a caixa*/
		enumerable: true,
		get: function() {
			var input = this.toString().split("");
			for (var i = 0; i < input.length; i++) {
				var test = input[i].toUpperCase();
				input[i] = input[i] === test ? input[i].toLowerCase() : test;
			}
			return input.join("");
		}
	});

	Object.defineProperty(WDtext.prototype, "upper", {/*caixa alta*/
		enumerable: true,
		get: function() {
			return this.toString().toUpperCase();
		}
	});

	Object.defineProperty(WDtext.prototype, "lower", {/*caixa baixa*/
		enumerable: true,
		get: function() {
			return this.toString().toLowerCase();
		}
	});

	Object.defineProperty(WDtext.prototype, "camel", { /*abc-def para abcDef*/
		enumerable: true,
		get: function() {
			var x = this.clear.replace(WDbox.re.noids, "");
			if (WDbox.re.camel.test(x)) return x;

			x = WDbox.clearSpaces(x, "-").split("");

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
	});

	Object.defineProperty(WDtext.prototype, "dash", { /*abcDef para abc-def*/
		enumerable: true,
		get: function() {
			var x = this.clear.replace(WDbox.re.noids, "");
			if (WDbox.re.dash.test(x)) return x;

			x = WDbox.clearSpaces(x, "-").split("");

			for (var i = 1; i < x.length; i++) {
				x[i] = x[i].toLowerCase() == x[i] ? x[i] : "-"+x[i];
			}

			x = x.join("").toLowerCase().replace(/\-+/g, "-");
			x = x.replace(/^\-+/g, "").replace(/\-+$/g, "");

			return x === "" ? null : x;
		}
	});

	Object.defineProperty(WDtext.prototype, "json", {/*JSON para objeto*/
		enumerable: true,
		get: function() {
			try {return JSON.parse(this.toString());} catch(e) {}
			return null;
		}
	});

	Object.defineProperty(WDtext.prototype, "csv", { /*CSV para matriz*/
		enumerable: true,
		get: function() {
			return WDbox.csv(this.toString());
		}
	});

	Object.defineProperty(WDtext.prototype, "trim", { /*remove espeços extras*/
		enumerable: true,
		get: function() {
			return WDbox.clearSpaces(this.toString()).trim();
		}
	});

	Object.defineProperty(WDtext.prototype, "format", { /*aplica atributos múltiplos*/
		enumerable: true,
		value: function() {
			var save = this._value.toString();
			for (var i = 0; i < arguments.length; i++) {
				if (!(arguments[i] in this)) continue;
				var check = Object.getOwnPropertyDescriptor(WDtext.prototype, arguments[i]);
				if (check === undefined || check.get === undefined) continue;
				var value = new WDtype(this[arguments[i]]);
				if (value.type !== "text")   continue;
				this._value = value.input;
			}
			var text = this._value.toString();
			this._value = save;
			return text;
		}
	});

	Object.defineProperty(WDtext.prototype, "replace", {/*replaceAll*/
		enumerable: true,
		value: function(search, change) {
			search = new String(search);
			change = new String(change);
			var x = this.toString().split(search);
			return x.join(change);
		}
	});

	Object.defineProperty(WDtext.prototype, "clear", { /*elimina acentos*/
		enumerable: true,
		get: function() {
			var value = new String(this.toString());

			if ("normalize" in value)
				return value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

			var clear = {
				A: /[À-Å]/g, C: /[Ç]/g,   E: /[È-Ë]/g, I: /[Ì-Ï]/g,
				N: /[Ñ]/g,   O: /[Ò-Ö]/g, U: /[Ù-Ü]/g, Y: /[ÝŸ]/g,
				a: /[à-å]/g, c: /[ç]/g,   e: /[è-ë]/g, i: /[ì-ï]/g,
				n: /[ñ]/g,   o: /[ò-ö]/g, u: /[ù-ü]/g, y: /[ýÿ]/g
			};

			for (var i in clear) value = value.replace(clear[i], i);

			return value;
		}
	});

	Object.defineProperty(WDtext.prototype, "mask", { /*máscaras temáticas*/
		enumerable: true,
		value: function(check, callback) {
			var masks = this.toString().split("?");
			for (var i = 0; i < masks.length; i++) {
				var mask = WDtext.mask(masks[i], check, callback);
				if (mask !== null) return mask;
			}
			return null;
		}
	});

/*============================================================================*/

	function WDnumber(input, type, value) {
		if (!(this instanceof WDnumber)) return new WDnumber(input, type, value);
		WDmain.call(this, input, type, value);
	}

	Object.defineProperties(WDnumber, {
		nFloat: {
			value: function(x) {/*conta casas decimais*/
				if (!WDbox.finite(x)) return 0;
				var i = 0;
				while ((x * Math.pow(10, i)) % 1 !== 0) i++;
				return i;
			}
		},
		prime: {
			value: [
				2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
				67, 71, 73, 79, 83, 89, 97, 
			]
		},
		mdc: {
			value: function(a, b) {
				var div   = [];
				var prime = this.prime;
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
		}
	});

	WDnumber.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnumber}
	});

	Object.defineProperty(WDnumber.prototype, "ntype", {/* tipo do número */
		enumerable: true,
		get: function() {
			if (this.valueOf() === 0)         return "zero";
			if (this.valueOf() ===  Infinity) return "+infinity";
			if (this.valueOf() === -Infinity) return "-infinity";
			if (this.valueOf() === this.int)  return this.valueOf() < 0 ? "-integer" : "+integer";
			return this.valueOf() < 0 ? "-real" : "+real";
		}
	});

	Object.defineProperty(WDnumber.prototype, "test", {/* testa o tipo do número */
		enumerable: true,
		value: function() {
			var type = this.ntype;
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] === type) return true;
				if (arguments[i] === type.substr(1, type.length)) return true;
			}
			return false;
		}
	});

	Object.defineProperty(WDnumber.prototype, "int", { /*parte inteira*/
		enumerable: true,
		get: function() {
			return WDbox.int(this.valueOf());
		}
	});

	Object.defineProperty(WDnumber.prototype, "decimal", {/*parte decimal*/
		enumerable: true,
		get: function() {
			var pow10  = Math.pow(10, WDnumber.nFloat(this.valueOf()));
			if (pow10 === 1) return 0;
			return (this.valueOf()*pow10 - this.int*pow10) / pow10;
		}
	});

	Object.defineProperty(WDnumber.prototype, "abs", {/*valor absoluto*/
		enumerable: true,
		get: function() {
			return this.valueOf() * (this.valueOf() < 0 ? -1 : 1);
		}
	});

	Object.defineProperty(WDnumber.prototype, "frac", {/*representação em fração (2 casas)*/
		enumerable: true,
		get: function() {
			if (this.test("integer", "zero")) return this.int.toFixed(0);
			if (this.test("+infinity")) return this.toString();

			var data  = {int: Math.abs(this.int), num: 0, den: 1, error: 1};
			var value = Math.abs(this.decimal);
			var prime = WDnumber.prime;
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

			var mdc = WDnumber.mdc(data.num, data.den);
			data.num = data.num/mdc;
			data.den = data.den/mdc;

			if (data.num === 0 && data.int === 0) return "0";
			if (data.num === 0 && data.int !== 0) return data.int.toFixed(0);

			data.int = data.int === 0 ? "" : data.int.toFixed(0)+" ";
			data.num = data.num.toFixed(0)+"/";
			data.den = data.den.toFixed(0);
			return (this.int < 0 ? "-" : "")+data.int+data.num+data.den;
		}
	});

	Object.defineProperty(WDnumber.prototype, "round", {/*arredonda casas decimais*/
		enumerable: true,
		value: function(width) {
			width = WDbox.finite(width) ? Math.abs(WDbox.int(width)) : 0;
			return Number(this.valueOf().toFixed(width)).valueOf();
		}
	});

	Object.defineProperty(WDnumber.prototype, "pow10", {/*notação científica*/
		enumerable: true,
		value: function(width) {
			if (this.test("infinity", "zero")) return this.toString();

			width = WDbox.finite(width) ? Math.abs(WDbox.int(width)) : undefined;

			var chars = {
				"0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵",
				"6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "+": "⁺", "-": "⁻"
			};
			var exp = this.valueOf().toExponential(width).split(/[eE]/);
			for (var i in chars) {
				var re = (/[0-9]/).test(i) ? new RegExp(i, "g") : new RegExp("\\"+i, "g");
				exp[1] = exp[1].replace(re, chars[i]);
			}
			return exp.join(" x 10");
		}
	});

	Object.defineProperty(WDnumber.prototype, "locale", {/*notação local*/
		enumerable: true,
		value: function(locale, currency) {
			locale   = locale   === undefined ? WDbox.lang() : locale;
			currency = currency === undefined ? currency : {style: "currency", currency: currency};

			try {return new Intl.NumberFormat(locale, currency).format(this.valueOf());} catch(e) {}
			try {return new Intl.NumberFormat(locale).format(this.valueOf());} catch(e) {}

			return this.valueOf().toLocaleString();
		}
	});

	Object.defineProperty(WDnumber.prototype, "fixed", {/*fixador de números*/
		enumerable: true,
		value: function(ldec, lint) {
			if (this.test("infinity")) return this.toString();

			lint = WDbox.finite(lint) ? WDbox.int(lint, true) : 0;
			ldec = WDbox.finite(ldec) ? WDbox.int(ldec, true) : 0;

			var sign = this.valueOf() < 0 ? "-" : "";
			var int  = Math.abs(this.int);
			var dec  = Math.abs(this.decimal);

			dec = dec.toFixed((ldec > 20 ? 20 : ldec));
			if ((/^1/).test(dec)) int++;
			dec = ldec === 0 ? "" : "."+dec.split(".")[1];

			int = int.toLocaleString("en-US").split(".")[0].replace(/\,/g, "").split("");
			while (int.length < lint) int.unshift("0");
			int = int.join("");

			return sign+int+dec;
		}
	});

	Object.defineProperties(WDnumber.prototype, {
		toString: {
			value: function() {
				if (Math.abs(this.valueOf()) !== Infinity) return this.valueOf().toString();
				return (this.valueOf() < 0 ? "-" : "") + "∞";
			}
		}
	});

/*============================================================================*/

	function WDtime(input, type, value) {
		if (!(this instanceof WDtime)) return new WDtime(input, type, value);
		WDmain.call(this, input, type, value);
	}

	WDtime.format = function(obj, char) {
		if (char === "%h") return String(obj.h).toString();
		if (char === "%H") return (obj.h < 10 ? "0" : "") + String(obj.h).toString();
		if (char === "#h") return obj.h12;
		if (char === "%m") return String(obj.m).toString();
		if (char === "%M") return (obj.m < 10 ? "0" : "") + String(obj.m).toString();
		if (char === "%s") return String(obj.s).toString();
		if (char === "%S") return (obj.s < 10 ? "0" : "") + String(obj.s).toString();
		return "";
	}

	WDtime.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDtime}
	});


	Object.defineProperties(WDtime.prototype, {/*define/obtem a hora*/
		h: {
			enumerable: true,
			get: function() {
				return WDbox.numberTime(this.valueOf()).h;
			},
			set: function(x) {
				if (!WDbox.finite(x)) return;
				x = WDbox.int(x);
				this._value = WDbox.timeNumber(x, this.m, this.s);
				return;
			}
		},
		hour: {
			enumerable: true,
			get: function()  {return this.h;},
			set: function(x) {return this.h = x;}
		}
	});

	Object.defineProperties(WDtime.prototype, {/*define/obtem o minuto*/
		m: {
			enumerable: true,
			get: function() {
				return WDbox.numberTime(this.valueOf()).m;
			},
			set: function(x) {
				if (!WDbox.finite(x)) return;
				x = WDbox.int(x);
				this._value = WDbox.timeNumber(this.h, x, this.s);
				return;
			}
		},
		minute: {
			enumerable: true,
			get: function()  {return this.m;},
			set: function(x) {return this.m = x;}
		}
	});

	Object.defineProperties(WDtime.prototype, {/*define/obtem o segundo*/
		s: {
			enumerable: true,
			get: function() {
				return WDbox.numberTime(this.valueOf()).s;
			},
			set: function(x) {
				if (!WDbox.finite(x)) return;
				x = WDbox.int(x);
				this._value = WDbox.timeNumber(this.h, this.m, x);
				return;
			}
		},
		second: {
			enumerable: true,
			get: function()  {return this.s;},
			set: function(x) {return this.s = x;}
		}
	});

	/*Retorna a hora no formato ampm*/
	Object.defineProperty(WDtime.prototype, "h12", {
		enumerable: true,
		get: function() {
			var h = this.h === 0 ? 12 : (this.h <= 12 ? this.h : (this.h - 12));
			var m = (this.m < 10 ? ":0" : ":") + String(this.m).toString();
			var p = this.h < 12 ? " AM" : " PM"; 
			return String(h).toString()+m+p;
		}
	});

	Object.defineProperty(WDtime.prototype, "format", {/*formata saída string*/
		enumerable: true,
		value: function(str) {
			var str   = String(str).toString();
			var chars = ["%h", "%H", "#h", "%m", "%M", "%s", "%S"];

			for (var i = 0; i < chars.length; i++) {
				str = str.split(chars[i]);
				str = str.join(WDtime.format(this, chars[i]));
			}
			return str;
		}
	});

	Object.defineProperties(WDtime.prototype, {
		toString: {value: function() {return this.format("%h:%M:%S");}}
	});

/*============================================================================*/

	function WDdate(input, type, value) {
		if (!(this instanceof WDdate)) return new WDdate(input, type, value);
		WDmain.call(this, input, type, value);
	}

	WDdate.searchFirstDay = function(search, year) {
		var init = WDbox.noonDate(null, 1, 1, year).getDay() + 1;
		var diff = search < init ? search + 7 - init : search - init
		return 1 + diff;
	}

	WDdate.format = function(obj, char, locale) {

		if (char === "%d") return String(obj.d).toString();
		if (char === "%D") return (obj.d < 10 ? "0" : "") + String(obj.d).toString();
		if (char === "@d") return String(obj.today).toString();
		if (char === "@D") return String(obj.days).toString();
		if (char === "#d") return obj.shortDay(locale);
		if (char === "#D") return obj.longDay(locale);
		if (char === "$d") return String(obj.working).toString();

		if (char === "%m") return String(obj.m).toString();
		if (char === "%M") return (obj.m < 10 ? "0" : "") + String(obj.m).toString();
		if (char === "@m") return String(obj.size).toString();
		if (char === "#m") return obj.shortMonth(locale);
		if (char === "#M") return obj.longMonth(locale);

		if (char === "%y") return String(obj.y).toString();
		if (char === "%Y") return String("0000" + obj.y).slice(-4)
		if (char === "@y") return String(obj.week).toString();
		if (char === "@Y") return String(obj.length).toString();
		if (char === "$y") return String(obj.workingYear).toString();

		return "";
	};

	WDdate.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDdate}
	});


	Object.defineProperties(WDdate.prototype, {/*ANO*/
		y: {
			enumerable: true,
			get: function() {
				return this._value.getFullYear();
			},
			set: function(x) {
				if (!WDbox.finite(x) || x < 0) return;
				x = WDbox.int(x);
				this._value = WDbox.noonDate(this._value, undefined, undefined, x);
				return
			}
		},
		year: {
			enumerable: true,
			get: function() {return this.y;},
			set: function(x) {return this.y = x;}
		},
		length: {/*dias no ano*/
			enumerable: true,
			get: function() {
				return WDbox.isLeap(this.y) ? 366 : 365;
			}
		},
		week: {/*semana cheia do ano*/
			enumerable: true,
			get: function() {
				var ref = this.days - this.today + 1;
				return (ref % 7 > 0 ? 1 : 0) + WDbox.int(ref/7);
			}
		},
		workingYear: {
			enumerable: true,
			get: function() {
				var sat  = WDdate.searchFirstDay(7, this.y);
				var sun  = WDdate.searchFirstDay(1, this.y);
				var nSat = WDbox.int((this.length - sat)/7) + 1;
				var nSun = WDbox.int((this.length - sun)/7) + 1;
				var work = this.length - (nSat + nSun)
				return work < 0 ? 0 : work;
			}
		}
	});

	Object.defineProperties(WDdate.prototype, {/*MÊS*/
		m: {
			enumerable: true,
			get: function() {
				return this._value.getMonth() + 1;
			},
			set: function(x) {
				if (!WDbox.finite(x)) return;
				x = WDbox.int(x);
				this._value = WDbox.noonDate(this._value, undefined, x, undefined);
				return
			}
		},
		month: {
			enumerable: true,
			get: function() {return this.m;},
			set: function(x) {return this.m = x;}
		},
		size: { /*quantidade de dias no mês*/
			enumerable: true,
			get: function() {
				var list = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				return (this.m === 2 && WDbox.isLeap(this.y) ? 1 : 0) + list[this.m - 1];
			},
		},
		shortMonth: {
			enumerable: true,
			value: function(locale) {
				locale = locale === undefined ? WDbox.lang() : locale;
				try {return this._value.toLocaleString(locale, {month: "short"});} catch(e) {}
				return this._value.toLocaleString(undefined,   {month: "short"});
			}
		},
		longMonth: {
			enumerable: true,
			value: function(locale) {
				locale = locale === undefined ? WDbox.lang() : locale;
				try {return this._value.toLocaleString(locale, {month: "long"});} catch(e) {}
				return this._value.toLocaleString(undefined,   {month: "long"});
			}
		}
	});

	Object.defineProperties(WDdate.prototype, {/*DIA*/
		d: {
			enumerable: true,
			get: function() {
				return this._value.getDate();
			},
			set: function(x) {
				if (!WDbox.finite(x)) return;
				x = WDbox.int(x);
				this._value = WDbox.noonDate(this._value, x, undefined, undefined);
				return
			}
		},
		day: {
			enumerable: true,
			get: function() {return this.d;},
			set: function(x) {return this.d = x;}
		},
		days: { /*dias transcorridos no ano*/
			enumerable: true,
			get: function() {
				var days  = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
				var extra = (this.m > 2 && WDbox.isLeap(this.y)) ? 1 : 0;
				return days[this.m - 1] + this.d + extra;
			}
		},
		today: { /*dia da semana [1-7]*/
			enumerable: true,
			get: function() {
				return this._value.getDay() + 1;
			}
		},
		shortDay: {
			enumerable: true,
			value: function(locale) {
				locale = locale === undefined ? WDbox.lang() : locale;
				try {return this._value.toLocaleString(locale, {weekday: "short"});} catch(e) {}
				return this._value.toLocaleString(undefined,   {weekday: "short"});
			}
		},
		longDay: {
			enumerable: true,
			value: function(locale) {
				locale = locale === undefined ? WDbox.lang() : locale;
				try {return this._value.toLocaleString(locale, {weekday: "long"});} catch(e) {}
				return this._value.toLocaleString(undefined,   {weekday: "long"});
			}
		},
		working: {
			enumerable: true,
			get: function() {
				var sat  = WDdate.searchFirstDay(7, this.y);
				var sun  = WDdate.searchFirstDay(1, this.y);
				var nSat = WDbox.int((this.days - sat)/7) + 1;
				var nSun = WDbox.int((this.days - sun)/7) + 1;
				var work = this.days - (nSat + nSun)
				return work < 0 ? 0 : work;
			}
		}
	});

	Object.defineProperty(WDdate.prototype, "format", {/*formata data*/
		enumerable: true,
		value: function(str, locale) {
			var str   = String(str).toString();
			var chars = [
				"%d", "%D", "@d", "@D", "#d", "#D", "$d",
				"%m", "%M", "@m", "#m", "#M",
				"%y", "%Y", "@y", "@Y", "$y"
			];

			for (var i = 0; i < chars.length; i++) {
				str = str.split(chars[i]);
				str = str.join(WDdate.format(this, chars[i], locale));
			}
			return str;
		}
	});

	Object.defineProperties(WDdate.prototype, {
		toString: {
			value: function() {
				return this.format("%Y-%M-%D");
			}
		},
		valueOf: {
			value: function() {
				return (this._value < 0 ? -1 : 0) + WDbox.int(this._value/86400000);
			}
		}
	});

/* === ARRAY =============================================================== */

	function WDarray(input, type, value) {
		if (!(this instanceof WDarray)) return new WDarray(input, type, value);
		WDmain.call(this, input, type, value);
	}

	function WDdataSet() { /*WDstatistics, WDanalysis e WDcompare vão herdar esse objeto*/
		if (!(this instanceof WDdataSet)) return new WDdataSet();
	}

	Object.defineProperties(WDdataSet.prototype, {
		constructor: {value: WDdataSet},
		_SET_FINITE: { /* itens não finitos se tornam null no array */
			value: function(x) {
				var data = [];
				for (var i = 0; i < x.length; i++) {
					var obj = WD(x[i]);
					var val = WD(obj.valueOf());
					var tps = ["number", "time", "date"];
					data.push(val.finite && tps.indexOf(obj.type) >= 0 ? val.valueOf() : null);
				}
				return data;
			}
		},
		_SUM: {/*soma listas e aplica operações matemáticas entre elas (até 2)*/
			value: function(list1, exp1, list2, exp2) {
				if (list2 === undefined) list2 = null;
				var value = 0;
				for (var i = 0; i < list1.length; i++) {
					if (exp1 < 0 && list1[i] === 0) return null; /*divisão por zero*/
					if (list2 !== null && exp2 < 0 && list2[i] === 0) return null; /*divisão por zero*/
					var val1 = Math.pow(list1[i], exp1);
					var val2 = list2 === null ? 1 : Math.pow(list2[i], exp2);
					value += val1 * val2;
				}
				return value;
			}
		},
		_PRODUCT: {
			value: function(list, exp) {/*calcula o produto da lista e aplica potenciação*/
				var value = 1;
				for (var i = 0; i < list.length; i++) {
					if (exp < 0 && list[i] === 0) return null; /*divisão por zero*/
					var val = Math.pow(list[i], exp);
					value = value * val;
				}
				return value;
			}
		},
		_DEVIATION: {/*calcula devios genéricos*/
			value: function(list, ref, exp) {/*calcula desvios a partir de uma lista/função e referência*/
				var value = 0;
				var check = WD(ref);
				for (var i = 0; i < list.length; i++) {
					var diff = Math.abs((check.type === "array" ? ref[i] : ref) - list[i]);
					if (exp < 0 && diff === 0) return null; /*divisão por zero*/
					var val = Math.pow(diff, exp);
					value += val;
				}
				return value;
			}
		},
		_STD_DEV: {/*Calcula o desvio padrão*/
			value: function(list, ref) {
				var data = this._DEVIATION(list, ref, 2);
				return data ===  null ? data : Math.sqrt(data/list.length);
			}
		},
		_LEAST_SQUARES: {/*Método dos mínimos quadrados*/
			value: function(x, y) {
				var X  = this._SUM(x, 1);
				var Y  = this._SUM(y, 1);
				var X2 = this._SUM(x, 2);
				var XY = this._SUM(x, 1, y, 1);
				if ([X, Y, XY, X2].indexOf(null) >= 0) return null;
				var N    = y.length;
				var data = {};
				data.a   = ((N * XY) - (X * Y)) / ((N * X2) - (X * X));
				data.b   = ((Y) - (X * data.a)) / (N);
				return data;
			}
		},
		_ADJUST_LISTS: {/*retorna as listas em pares de informações não nulas*/
			value: function(x, y) {
				var loop = x.length > y.length ? y.length : x.length;
				var list = {x: [], y: [], length: 0};
				for (var i = 0; i < loop; i++) {
					if (x[i] === null || y[i] === null) continue;
					list.x.push(x[i]);
					list.y.push(y[i]);
					list.length++;
				}
				return list;
			}
		},
		_GET_F_RETURN: {/*define uma lista aplicando uma função sobre outra lista*/
			value: function(x, f) {
				var data = [];
				for (var i = 0; i < x.length; i++) {
					try {var val = f(x[i]);} catch(e) {var val = null;}
					data.push(WD(val).finite ? val : null);
				}
				return data;
			}
		},

	});

/*............................................................................*/

	function WDstatistics(x) { /*retorna dados estatístico de 1 array*/
		if (!(this instanceof WDstatistics)) return new WDstatistics(x);
		WDdataSet.call(this);
		if (WD(x).type !== "array") x = [];
		var val = WD(WD(this._SET_FINITE(x)).sort()).del(null);/*ordena e elimina os nulos*/
		Object.defineProperties(this, {
			x: {value: val}, /*array numérico sem nulos*/
			l: {value: val.length}, /*comprimento array sem nulos*/
			e: {value: val.length < 1 ? true : false} /*erro*/
		});
	}

	WDstatistics.prototype = Object.create(WDdataSet.prototype, {/*herança*/
			constructor: {value: WDstatistics}
	});

	Object.defineProperties(WDstatistics.prototype, {/*-- Estatística --*/
		sum: {/*soma*/
			get: function() {
				return this.e ? null : this._SUM(this.x, 1);
			}
		},
		min: {/*menor valor*/
			get: function() {
				return this.e ? null : this.x[0];
			}
		},
		max: {/*maior valor*/
			get: function() {
				return this.e ? null : this.x[this.l-1];
			}
		},
		average: {/*média*/
			get: function() {
				return this.e ? null : this.sum/this.l;
			}
		},
		median: {/*mediana*/
			get: function() {
				if (this.e) return null;
				var a = this.x;
				var l = this.l;
				return l%2 === 0 ? (a[l/2]+a[(l/2)-1])/2 : a[(l-1)/2];
			}
		},
		geometric: {/*média geométrica*/
			get: function() {
				if (this.e) return null;
				return Math.pow(Math.abs(this._PRODUCT(this.x, 1)), 1/this.l);
			}
		},
		harmonic: {/*média harmônica*/
			get: function() {
				if (this.e) return null;
				var harm = this._SUM(this.x, -1);
				return (harm === 0 || harm === null) ? null : this.l/harm;
			}
		},
		deviation: {/* retorna o desvio padrão */
			value: function(method) {
				if (!(method in this)) return null;
				var val = this[method];
				return val === null ? null : this._STD_DEV(this.x, val);
			}
		}
	});

/*............................................................................*/

	function WDanalysis(x, y) {/*retorna a análise de dados entre 2 arrays*/
		if (!(this instanceof WDanalysis)) return new WDanalysis(x, y);
		WDdataSet.call(this);
		var f = WD(y).type === "function" ? y : null;
		if (WD(x).type !== "array") x = [];
		if (WD(y).type !== "array") y = [];
		x = this._SET_FINITE(x);
		if (f !== null) y = this._GET_F_RETURN(x, f); /*carregando f(x) em y*/
		y = this._SET_FINITE(y);
		var val  = this._ADJUST_LISTS(x, y);
		var ends = WDstatistics(val.x);
		var diff = ends.e ? 0 : ends.max - ends.min;
		Object.defineProperties(this, {
			x: {value: val.x},
			y: {value: val.y},
			f: {value: f},
			l: {value: val.length},
			e: {value: (val.length < 2 || diff === 0) ? true : false}
		});
	}

	WDanalysis.prototype = Object.create(WDdataSet.prototype, {/*herança*/
			constructor: {value: WDanalysis}
	});

	Object.defineProperties(WDanalysis.prototype, {/*-- Regressões --*/
		_REG_DEV: { /*atalho para o desvio padrão deste objeto*/
			value: function(f) {
				var y1  = this.y;
				var y2  = this._GET_F_RETURN(this.x, f);
				var val = this._ADJUST_LISTS(y1, y2);
				return this._STD_DEV(val.x, val.y);
			}
		},
		linear: {/*regressão linear*/
			get: function() {
				if (this.e) return null;
				var val = this._LEAST_SQUARES(this.x, this.y);
				if (val === null) return null;
				var data = {
					e: "y = (a)x+(b)",
					a: val.a,
					b: val.b,
				};
				data.f = function(x) {return data.a*x + data.b;};
				data.d = this._REG_DEV(data.f);
				return data;
			}
		},
		exponential: {/*regressão exponencial*/
			get: function() {
				if (this.e) return null;
				/*pontos para a regressão (ajustando Y para equação linear)*/
				var y    = this._GET_F_RETURN(this.y, Math.log);
				var axes = this._ADJUST_LISTS(this.x, this._SET_FINITE(y));
				if (axes.length < 2) return null; /*tem que ter pelo menos 2 pontos*/
				/*regressão*/
				var val = this._LEAST_SQUARES(axes.x, axes.y);
				if (val === null) return null;
				var data = {
					e: "y = (a)\u212F^(bx)",
					a: Math.exp(val.b),
					b: val.a,
				};
				data.f = function(x) {return data.a*Math.exp(data.b*x);};		
				data.d = this._REG_DEV(data.f);
				return data;
			}
		},
		geometric: {/*regressão geométrica*/
			get: function() {
				if (this.e) return null;
				/*pontos para a regressão (ajustando X/Y para equação linear)*/
				var x    = this._GET_F_RETURN(this.x, Math.log);
				var y    = this._GET_F_RETURN(this.y, Math.log);
				var axes = this._ADJUST_LISTS(this._SET_FINITE(x), this._SET_FINITE(y));
				if (axes.length < 2) return null; /*tem que ter pelo menos 2 pontos*/
				/*regressão*/
				var val = this._LEAST_SQUARES(axes.x, axes.y);
				if (val === null) return null;
				var data = {
					e: "y = (a)x^(b)",
					a: Math.exp(val.b),
					b: val.a,
				};
				data.f = function(x) {return data.a*Math.pow(x, data.b);};
				data.d = this._REG_DEV(data.f);
				return data;
			}
		},
		sum: {
			get: function() {
				if (this.e) return null;
				var int = 0;
				/* -- integral ax+b = (yf+yi)(xf-xi)/2 -- */
				for (var i = 0; i < (this.l - 1); i++)
					int += (this.y[i+1]+this.y[i])*(this.x[i+1]-this.x[i])/2;

				var data = {
					e: "\u03A3y\u0394x \u2248 b",
					a: 0,
					b: int,
				};
				var ref = {x: this.x, y: this.y}
				data.f = function(x) { /*retorna y(x) considerando cada coordenada como um seguimento de reta*/
					var c = ref;
					var i = 0;
					var n = null;
					while (n === null && ++i !== c.x.length)
						if (x <= c.x[i]) n = i;
					if (n === null) n = c.x.length-1;
					var line = WDanalysis([c.x[n-1],c.x[n]], [c.y[n-1],c.y[n]]);
					return line.linear.f(x);
				};
				data.d = null;
				return data;
			}
		},
		average: {/*calcula a média da variação*/
			get: function() {
				if (this.e) return null;
				var int = this.sum.b;
				var end = new WDstatistics(this.x);
				var avg = int / (end.max - end.min);
				var data = {
					e: "(\u03A3y\u0394x)/\u0394x \u2248 b",
					a: 0,
					b: avg,
				};
				data.f = function(x) {return data.b;};
				data.d = null;
				return data;
			}
		},
		continuous: { /* define coordenadas (x,y) a partir de um intervalos de x (delta)*/
			value: function(delta, method) {
				if (this.e) return null;
				if (!WD(delta).finite) return null;

				/* define a função: informada ou de análise (methods) */
				var func    = this.f; /* função informada */
				var obj     = {};     /*objeto vazio (sem utilizade para função informada)*/
				var methods = ["linear", "exponential", "geometric", "sum", "average"];
				if (methods.indexOf(method) >= 0) { /*função de análise*/
					obj  = this[method];
					func = obj === null ? null : obj.f;
				}
				if (func === null) return null;

				/* parâmetros para definir os intervalos */
				delta    = WD(delta).abs;
				var end  = WDstatistics(this.x);
				var min  = end.min; /* valor irá variar no looping while */
				var max  = end.max;
				var data = {x: [], y: [], o: obj};

				while (delta > 0) { /*definindo intervalos*/
					if (min >= max) { /*ponto de parada do looping*/
						min   = max;
						delta = 0;
					}
					var val = func(min);
					if (WD(val).finite) { /* definindo pontos se y for finito */
						data.x.push(min);
						data.y.push(val);
					}
					min += delta;
				}
				return data;
			}
		},

	});

/*............................................................................*/

	function WDcompare(x, y) {/*retorna valores que comparam dados*/
		if (!(this instanceof WDcompare)) return new WDcompare(x, y);
		WDdataSet.call(this);
		if (WD(x).type !== "array") x = [];
		if (WD(y).type !== "array") y = [];

		/*acertando dados, excluindo nulos*/
		y = this._SET_FINITE(y);
		for (var i = 0; i < y.length; i++) {
			if (x[i] === undefined) x.push(null);
			var txt = WD(x[i]).toString();
			x[i] = y[i] === null ? null : (txt === "" ? "#" : txt);
		}
		x = WD(x).del(null);
		y = WD(y).del(null);

		/*obtendo objeto com informações agrupadas*/
		var obj = {};
		for (var i = 0; i < x.length; i++) {
			if (!(x[i] in obj)) obj[x[i]] = [];
			obj[x[i]].push(y[i]);
		}

		Object.defineProperties(this, {
			o: {value: obj},
			x: {value: x},
			y: {value: y},
			e: {value: (x.length < 1 || x.length !== y.length) ? true : false}
		});
	}

	WDcompare.prototype = Object.create(WDdataSet.prototype, { /*Herança*/
			constructor: {value: WDcompare}
	});

	Object.defineProperties(WDcompare.prototype, {/*-- Comparação de dados --*/
		occurrences: {/*quantidade de ocorrências de cada item*/
			get: function() {
				if (this.e) return null;
				var data = {};
				for (var i in this.o) data[i] = this.o[i].length;
				return data;
			}
		},
		amount: {/*quantidade de cada item (soma o valor de itens iguais)*/
			get: function() {
				if (this.e) return null;
				var data = {};
				for (var i in this.o) {
					data[i] = 0;
					for (var j = 0; j < this.o[i].length; j++)
						data[i] += this.o[i][j]
				}
				return data;
			}
		},
		sum: {/*retorna a quantidade total*/
			get: function() {
				if (this.e) return null;
				var sum  = 0;
				var data = this.amount;
				for (var i in data) sum += data[i];
				return sum;
			}
		},
		ratio: {/*porcentagem da quantidade*/
			get: function() {
				if (this.e) return null;
				if (sum === 0) return null; /* divisão por zero*/
				var sum  = this.sum;
				var amnt = this.amount;
				var data = {};
				for (var i in amnt) data[i] = amnt[i]/sum;
				return data;
			}
		},
		average: {/*média de cada item*/
			get: function() {
				if (this.e) return null;
				var occu = this.occurrences;
				var amnt = this.amount;
				var data = {};
				for (var i in amnt) data[i] = amnt[i]/occu[i];
				return data;
			}
		},
	});

/*............................................................................*/

	Object.defineProperties(WDarray, {/*métodos do construtor*/
		cell: {
			value: function(matrix, cell) {/*obtem lista de valores da matriz a partir de endereços de celulas (linha:coluna)*/
				cell = new String(cell).trim().split(":");
				if (cell.length < 2) cell.push("");

				var row  = {i: -Infinity, n: Infinity};
				var col  = {i: -Infinity, n: Infinity};
				var list = [];

				/*row*/
				if ((/^[0-9]+$/).test(cell[0])) {
					row.i = WDbox.int(cell[0]);
					row.n = WDbox.int(cell[0]);
				} else if ((/^\-[0-9]+$/).test(cell[0])) {
					row.n = WDbox.int(cell[0].replace("-", ""));
				} else if ((/^[0-9]+\-$/).test(cell[0])) {
					row.i = WDbox.int(cell[0].replace("-", ""));
				} else if ((/^[0-9]+\-[0-9]+$/).test(cell[0])) {
					var gap = cell[0].split("-");
					row.i   = WDbox.int(gap[0]);
					row.n   = WDbox.int(gap[1]);
				}

				/*col*/
				if ((/^[0-9]+$/).test(cell[1])) {
					col.i = WDbox.int(cell[1]);
					col.n = WDbox.int(cell[1]);
				} else if ((/^\-[0-9]+$/).test(cell[1])) {
					col.n = WDbox.int(cell[1].replace("-", ""));
				} else if ((/^[0-9]+\-$/).test(cell[1])) {
					col.i = WDbox.int(cell[1].replace("-", ""));
				} else if ((/^[0-9]+\-[0-9]+$/).test(cell[1])) {
					var gap = cell[1].split("-");
					col.i   = WDbox.int(gap[0]);
					col.n   = WDbox.int(gap[1]);
				}

				for (var r = 0; r < matrix.length; r++) {
					var check = WDtype(matrix[r]);
					if (check.type !== "array") continue;
					for (var c = 0; c < matrix[r].length; c++) {
						if (r >= row.i && r <= row.n && c >= col.i && c <= col.n)
							list.push(matrix[r][c]);
					}
				}

				return list;
			}
		},
	});

/*...........................................................................*/

	WDarray.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDarray}
	});

	Object.defineProperty(WDarray.prototype, "item", {/*retorna o índice especificado*/
		enumerable: true,
		value: function(i) {
			if (!WDbox.finite(i)) return this._value.length;
			i = WDbox.int(i);
			i = i < 0 ? this._value.length + i : i;
			return this.valueOf()[i];
		}
	});

	Object.defineProperty(WDarray.prototype, "check", {/*informa se contem o item*/
		enumerable: true,
		value: function() {
			if (arguments.length === 0) return false;
			for (var i = 0; i < arguments.length; i++) {
				if (this._value.indexOf(arguments[i]) < 0) return false;
			}
			return true;
		}
	});

	Object.defineProperty(WDarray.prototype, "search", {/*procura item no array*/
		enumerable: true,
		value: function(value) {
			var index = [];
			for (var i = 0; i < this._value.length; i++) {
				if (this._value[i] === value) index.push(i);
			}
			return index.length === 0 ? null : index;
		}
	});

	Object.defineProperty(WDarray.prototype, "del", {/*remove itens*/
		enumerable: true,
		value: function() {
			for (var i = 0; i < arguments.length; i++) {
				var index = this.search(arguments[i]);
				if (index !== null) {
					index = index.reverse();
					for (var j = 0; j < index.length; j++) this._value.splice(index[j], 1);
				}
			}
			return this.valueOf();
		}
	});

	Object.defineProperty(WDarray.prototype, "add", {/*adiciona items*/
		enumerable: true,
		value: function() {
			for (var i = 0 ; i < arguments.length; i++) {
					this._value.push(arguments[i]);
			}
			return this.valueOf();
		}
	});

	Object.defineProperty(WDarray.prototype, "toggle", {/*adiciona/remove items*/
		enumerable: true,
		value: function() {
			for (var i = 0 ; i < arguments.length; i++) {
				if (this.check(arguments[i])) {this.del(arguments[i]);}
				else                           {this.add(arguments[i]);}
			}
			return this.valueOf();
		}
	});

	Object.defineProperty(WDarray.prototype, "count", {/*quantidade de items*/
		enumerable: true,
		value: function(item) {
			var items = this.search(item);
			return items === null ? 0 : items.length;
		}
	});

	Object.defineProperty(WDarray.prototype, "replace", {/*troca o valor dos items*/
		enumerable: true,
		value: function(item, value) {
			var index = this.search(item, true);
			if (index === null) return this.valueOf();

			for (var i = 0; i < index.length; i++) this._value[index[i]] = value;
			return this.valueOf();
		}
	});

	Object.defineProperty(WDarray.prototype, "unique", {/*remove itens repetidos*/
		enumerable: true,
		value: function() {
			this._value =  this._value.filter(function(v, i, a) {
				return a.indexOf(v) == i;
			});
			return this.valueOf();
		}
	});

	Object.defineProperty(WDarray.prototype, "sort", {/*ordena items*/
		enumerable: true,
		value: function() {

			var order = [/*sequência de exibição por tipo*/
				"number", "time", "date", "text", "boolean", "null", "dom",
				"array", "object", "function", "regexp", "undefined", "unknown"
			];
			var array = this.valueOf();

			array.sort(function(a, b) {
				var atype  = WDtype(a).type;
				var btype  = WDtype(b).type;
				var aindex = order.indexOf(atype);
				var bindex = order.indexOf(btype);
				var avalue = a;
				var bvalue = b;

				if (aindex > bindex) return  1;
				if (aindex < bindex) return -1;
				if (atype === "dom") {/*atype === btype (tipos iguais)*/
					var check = WD([a.textContent, b.textContent]).sort();
					avalue = a.textContent === check[0] ? 0 : 1;
					bvalue = avalue === 0 ? 1 : 0;
				} else if (atype === "text") {
					avalue = new WD(a).format("clear", "upper");
					bvalue = new WD(b).format("clear", "upper");
				} else if (["number", "boolean", "date", "time"].indexOf(atype) >= 0) {
					avalue = new WDtype(a).value;
					bvalue = new WDtype(b).value;
				}
				return avalue > bvalue ? 1 : -1;
			});

			this._value = array;
			return this.valueOf();
		}

	});

	Object.defineProperty(WDarray.prototype, "cell", {/*obtem a lista a partir de uma referência row:col*/
		enumerable: true,
		value: function(ref) {
			ref = new String(ref).trim();
			ref = WDbox.clearSpaces(ref).split(" ");
			var data = [];
			for (var i = 0; i < ref.length; i++) {
				var value = WDarray.cell(this._value, ref[i]);
				for (var j = 0; j < value.length; j++) data.push(value[j]);
			}
			return data;
		}
	});

	Object.defineProperty(WDarray.prototype, "data", {/*obtem dados estatísticos a partir dos itens do array/matriz*/
		enumerable: true,
		value: function(x, y) {
			var info = {
				statistics: new WDstatistics(this.cell(x)),
				compare:    new WDcompare(this.cell(x), this.cell(y)),
				analysis:   new WDanalysis(this.cell(x), this.cell(y)),
			}
			return info;
		}
	});

	Object.defineProperties(WDarray.prototype, {
		toString: {
			value: function() {
				return JSON.stringify(this._value);
			}
		},
		valueOf: {
			value: function() {
				return this._value.slice();
			}
		}
	});

/*============================================================================*/

	function WDdom(input, type, value) {
		if (!(this instanceof WDdom)) return new WDdom(input, type, value);
		WDmain.call(this, input, type, value);
	}

	Object.defineProperties(WDdom, {/*objetos do construtor*/
		checkCss: {
			value: function(e, css) {
				var list = WDbox.clearSpaces(e.className).split(" ");
				return list.indexOf(css) >= 0 ? true : false;
			}
		},
		tag: {/*retorna a tag do elemento*/
			value: function(e) {return e.tagName.toLowerCase();}
		},
		form: {/*informa se o elemento é de formulário*/
			value: function(e) {
				var form = ["textarea", "select", "button", "input", "option"];
				return form.indexOf(this.tag(e)) < 0 ? false : true;
			}
		},
		type: {/*informa o tipo do elemento de formulário*/
			value: function(e) {
				if (!this.form(e)) return null;
				var types = [
					"button", "reset", "submit", "image", "color", "radio",
					"checkbox", "date", "datetime", "datetime-local", "email",
					"text", "search", "tel", "url", "month", "number", "password",
					"range", "time", "week", "hidden", "file"
				];
				var attr = "type" in e.attributes ? e.attributes.type.value.toLowerCase() : null;
				var type = "type" in e ? e.type.toLowerCase() : null;
			 	if (types.indexOf(attr) >= 0) return attr; /*DIGITADO no HTML*/
			 	if (types.indexOf(type) >= 0) return type; /*CONSIDERADO no HTML*/
				return this.tag(e);
			}
		},
		name: {/*informa o valor do atributo name do formulário*/
			value: function(e) {
				if (!this.form(e) || !("name" in e)) return null;
				var name = WDtype(e.name);
				return name.type === "text" ? name.input : null;
			}
		},
		value: {/*retorna o valor do atributo value do formulário*/
			value: function(e) {
				if (!this.form(e) || !("value" in e)) return null;
				var type  = this.type(e);
				var value = e.value;
				var check = WD(value);
				if (type === "radio")    return e.checked               ? value            : null;
				if (type === "checkbox") return e.checked               ? value            : null;
				if (type === "date")     return check.type === "date"   ? check.toString() : null;
				if (type === "time")     return check.type === "time"   ? check.toString() : null;
				if (type === "number")   return check.type === "number" ? check.valueOf()  : null;
				if (type === "range")    return check.type === "number" ? check.valueOf()  : null;
				if (type === "file")     return e.files.length > 0      ? e.files : null;
				if (type === "select") {
					value = [];
					for (var i = 0; i < e.length; i++) {
						if (e[i].selected) value.push(e[i].value);
					}
					return value.length === 0 ? null : value;
				}
				return value === "" ? null : value;
			}
		},
		send: {/*informa se os dados do elemento podem ser enviados*/
			value: function(e) {
				if (this.name(e) === null || this.value(e) === null) return false;
				var noSend = ["submit", "button", "reset", "image", "option"];
				if (noSend.indexOf(this.type(e)) >= 0) return false;
				if (noSend.indexOf(this.tag(e))  >= 0) return false;
				return true;
			}
		},
		mask: {/*retorna o atributo para aplicação da máscara*/
			value: function(e) {
				if (!this.form(e)) return "textContent" in e ? "textContent" : null;
				var text = ["button", "option"];
				if (text.indexOf(this.tag(e)) >= 0) return "textContent";
				var value = [
					"textarea", "button", "submit", "email", "text", "search",
					"tel", "url"
				];
				if (value.indexOf(this.tag(e)) >= 0)  return "value";
				if (value.indexOf(this.type(e)) >= 0) return "value";
				return null;
			}
		},
		load: {/*retona o atributo para carregar outro elemento interno*/
			value: function(e) {
				if (this.tag(e) === "button" || this.tag(e) === "option") return "textContent";
				var value = [
					"textarea", "button", "reset", "submit", "email", "text",
					"search", "tel", "url", "hidden"
				];
				if (this.form(e)) return value.indexOf(this.type(e)) >= 0 ? "value" : null;
				return "innerHTML" in e ? "innerHTML" : "textContent";
			}
		},
		formdata: {
			value: function(e) {/*retorna um array de objetos com os dados para envio em requisições*/
				var form  = [];
				if (!this.send(e)) return form;
				var name  = this.name(e);
				var value = this.value(e);
				if (this.type(e) === "file") {
					for (var i = 0; i < value.length; i++) {
						form.push({
							NAME: i === 0 ? name : name+"_"+i, /*atributo nome*/
							GET:  encodeURIComponent(value[i].name), /*nome do arquivo*/
							POST: value[i] /*dados do arquivo*/
						});
					}
					return form;
				}
				if (this.tag(e) === "select") {
					for (var i = 0; i < value.length; i++) {
						form.push({
							NAME: i === 0 ? name : name+"_"+i,
							GET:  encodeURIComponent(value[i]),
							POST: value[i]
						});
					}
					return form;
				}
				form.push({
					NAME: name,
					GET:  encodeURIComponent(value),
					POST: value
				});
				return form;
			}
		},
		dataset: {
			value: function(e, attr) {/*obter o conteúdo de dataset e ransformar em um array de objetos*/
				var list = [{}];
				if (!(attr in e.dataset)) return list;
				var key    = 0;
				var open   = 0;
				var name   = "";
				var value  = "";
				var object = false;
				var core  = String(e.dataset[attr]).trim().split("");
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
		},
		brosIndex: {
			value: function(e) {
				var bros = e.parentElement.children;
				for (var i = 0; i < bros.length; i++) {
					if (bros[i] === e) return i;
				}
				return 0;
			}
		}
	});

/*............................................................................*/

	function wdChart(box, title) {/*Objeto para criar gráficos*/
		if (!(this instanceof wdChart)) return new wdChart(box, title);
		Object.defineProperties(this, {/*atributos do objeto*/
			/* Container HTML a acomodar o gráfico */
			_BOX: {value: this._BUILD_BOX(box)},
			/* Elemento SVG a ser plotado os dados */
			//_SVG: {value: this._BUILD_SVG("svg"), writable: true},
			_SVG: {value: null, writable: true},
			/* Escala do gráfico (x/y) */
			_SCALE: {value: {x: 1, y: 1}},
			/* Guarda a cor e a sequência das legendas */
			_NDATA: {value: {c: "#000000", r: 0, t: 0}},
			/* Registra os valores máximos e mínimos dos eixos */
			_ENDS: {value: {x: {min: Infinity, max: -Infinity}, y: {min: Infinity, max: -Infinity}}},
			/* Margens internas do gráfico */
			_PADDING: {value: {t: 0, r: 0, b: 0, l: 0}},
			/* Registra o título do gráfico */
			_TITLE: {value: title === undefined ? "" : title},
			/* Registra a entrada de dados */
			_DATA: {value: []},
		});
	};

	Object.defineProperties(wdChart.prototype, {
		constructor: {value: wdChart},
		_RATIO: {/* Relação altura/comprimento do gráfico (igual a da tela) */
			//FIXME: no celular fica esquisito (altura maior que largura)
			value: window.screen.height > window.screen.width ? 1 : window.screen.height/window.screen.width
		},
		_MEASURES: {
			set: function(x) {
				for (var i in x) this._PADDING[i] = x[i];
			},
			get: function() {
				var padd = this._PADDING;
				return {
					t: padd.t, r: 100-padd.r, b: 100-padd.b, l: padd.l,
					w: 100-(padd.l+padd.r), h: 100-(padd.t+padd.b),
					cx: padd.l+(100-(padd.l+padd.r))/2,
					cy: padd.t+(100-(padd.t+padd.b))/2,

				}
			}
		},
		_COLOR: {/* Define e obtém a cor a partir de um inteiro (looping) */
			set: function(n) {
				var ref = n < 0 ? 0 : (2*n+1)%7+1; /* 2,4,6,1,3,5,7,2...*/
				var bin = (ref < 2 ? "00" : (ref < 4 ? "0" : ""))+ref.toString(2);
				var clr = bin.split("");
				clr.forEach(function(e,i,a){a[i] = 153*Number(e);});
				this._NDATA.c = "rgb("+clr[0]+","+clr[1]+","+clr[2]+")";
			},
			get: function() {return this._NDATA.c;}
		},
		_CONVERT: {/* Converte número em porcentagem: 58 => "58%" */
			value: function(x) {return new String(x).toString()+"%";}
		},
		_DELTA: {/* Devolve a menor partícula em X */
			value: function(x) {
				return (x <= 0 ? 1 : x)/this._SCALE.x;
			}
		},
		_SET_ENDS: {/* Registra as extremidades */
			value: function(axes, array) {
				var data = WDstatistics(array);
				var min  = data.min;
				var max  = data.max;
				if (min < this._ENDS[axes].min) this._ENDS[axes].min = min;
				if (max > this._ENDS[axes].max) this._ENDS[axes].max = max;
				return;
			}
		},
		_BUILD_BOX: {/* Define as características do container do SVG (parent) */
			value: function(input) {
				var box = WD(input);
				if (box.type !== "dom") return null;
				WD(box.item(0)).set("innerHTML", "").css(null).style(null).style({
					position: "relative", paddingTop: this._CONVERT(100 * this._RATIO)
				});
				input = box.item(0);
				var child = input.children;
				while (child.length > 0) input.removeChild(child[0]);
				return input;
			}
		},
		_BUILD_SVG: {/* Cria e retorna elementos svg conforme atributos */
			value: function(type, attr) {
				if (this._BOX === null) return null;
				if (attr === undefined) attr = {};
				/* Propriedades a serem definidas em porcentagem */
				var ref  = [
					"x", "y", "x1", "x2", "y1", "y2", "height", "width",
					"cx", "cy", "r", "dx", "dy"
				];

				var elem = document.createElementNS("http://www.w3.org/2000/svg", type);

				for (var i in attr) {/* definindo atributos */
					var val = attr[i];
					if (i === "tspan" || i === "title") {/* texto ou dicas */
						var info = this._BUILD_SVG(i);
						info.textContent = val;
						elem.appendChild(info);
					} else { /*atributos*/
						val = (ref.indexOf(i) >= 0 && WD(val).finite) ? this._CONVERT(val) : val;
						elem.setAttribute(i, val);
					}
				}

				if (type === "svg") /* para SVG principal apenas */
					WD(elem).style({
						height: "100%", width: "100%", position: "absolute",
						top: "0", left: "0", bottom: "0", right: "0"
					});

				return elem;
			}
		},
		_BUILD_DOTS: {/* Desenha um ponto: coordenadas do centro */
			value: function(cx, cy, title, r) {
				r = (r === undefined ? 3 : r)+"px";
	 			var point = this._BUILD_SVG("circle", {
					cx: cx, cy: cy, r: r, fill: this._COLOR, title: title
				});
				this._SVG.appendChild(point);
				return point;
			}
		},
		_BUILD_LINE: {/* Desenha uma linha: coordenadas inicial e final */
			value: function(x1, y1, x2, y2, title, width) {
				width = width === undefined ? 1 : width;
				var line = this._BUILD_SVG("line", {
					x1: x1, y1: y1, x2: x2, y2: y2,
					stroke: this._COLOR,
					"stroke-width":     width === 0 ? "1px" : width+"px",
					"stroke-dasharray": width === 0 ? "1,5" : "0",
					title: title
				});
				this._SVG.appendChild(line);
				return line;
			}
		},
		_BUILD_RECT: {/* Desenha uma retângulo: coordenadas inicial e final */
			value: function(x1, y1, x2, y2, title, opacity) {
				var rect = this._BUILD_SVG("rect", {
					x:       x2 > x1 ? x1 : x2,
					y:       y2 > y1 ? y1 : y2,
					width:   x2 > x1 ? x2-x1 : x1-x2,
					height:  y2 > y1 ? y2-y1 : y1-y2,
					fill:    this._COLOR,
					title:   title,
					opacity: opacity === true ? 0.3 : 0.8,
				});
				this._SVG.appendChild(rect);
				return rect;
			}
		},
		_BUILD_LABEL: {/* Adiciona texto: coordenadas, texto, âncora, orientação */
			value: function (x, y, text, point, vertical, bold) {
				var vanchor = ["start", "middle", "end"];
				var anchor  = {n: 1, ne: 2, e: 2, se: 2, s: 1, sw: 0, w: 0, nw: 0, c: 1};
				var vbase   = ["auto", "middle", "hanging"];
				var base    = {n: 2, ne: 2, e: 1, se: 0, s: 0, sw: 0, w: 1, nw: 2, c: 1};
				point       = point in base ? point : "c" ;
				var attr = {
					x: x, y: y,
					fill: this._COLOR,
					"text-anchor": vanchor[anchor[point]],
					"dominant-baseline": vbase[base[point]],
					"font-size": "0.8em",
					"font-family": "monospace",
					tspan: text
				};
				 if (vertical === true) {
				 	attr.transform = "rotate(270)";
				 	attr.y = x/this._RATIO;
				 	attr.x = -this._RATIO*y;
				 }
				 if (bold === true) attr["font-weight"] = "bold";
				 var label = this._BUILD_SVG("text", attr);
				 this._SVG.appendChild(label);
				 return label;
			}
		},
		_CLEAR_SVG: {/* (re)define parâmetros iniciais e SVG */
			value: function() {
				this._COLOR = 0;
				this._ENDS.x   = {min: Infinity, max: -Infinity};
				this._ENDS.y   = {min: Infinity, max: -Infinity};
				this._MEASURES = {t: 0, r: 0, b: 0, l: 0};
				this._NDATA.r  = 0;
				this._NDATA.t  = 0;
				if (this._SVG !== null) this._BOX.removeChild(this._SVG);
				this._SVG = this._BUILD_SVG("svg");
				this._BOX.appendChild(this._SVG);
				return;
			}
		},
		_SET_SCALE: {/* Define o valor da escala horizontal e vertical */
			value: function(axes) {
				var msrs  = this._MEASURES;
				var delta = this._ENDS[axes].max - this._ENDS[axes].min;
				var ref = axes === "x" ? msrs.w : msrs.h;
				this._SCALE[axes] = ref/delta;
				return;
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
		_LABEL_VALUE: {/* Define a exibição de valores numéricos */
			value: function(x, ratio) {
				if (ratio === true) x = 100*x;
				var end = ratio === true ? "%" : "";
				var val = Math.abs(x);

				if (val === 0) return "0"+end;
				if ((1/val) > 1) {
					if (val <= 1e-10) return x.toExponential(0)+end;
					if (val <= 1e-3)  return x.toExponential(1)+end;
					if (val <= 1e-2)  return WD(x).fixed(2,0)+end;
				} else {
					if (val >= 1e10) return x.toExponential(0)+end;
					if (val >= 1e3)  return x.toExponential(1)+end;
					if (val >= 1e2) return WD(x).fixed(0,0)+end;
					if (val >= 1e1) return WD(x).fixed(1,0)+end;
				}
				return WD(x).fixed(2,0)+end;
			}
		},
		_SET_AREA: {
			value: function(type, n, xlabel, ylabel) {/* define a área do gŕafico (n = linhas)*/
				n = n === undefined ? 0 : n;
				var config = {/* configurações da área do gráfico */
					plan: {
						width: {t: 1, r: 1, b: 1, l: 1, c: 0},
						padd:  {t: 10, r: 20, b: 10, l: 15},
					},
					compare: {
						width: {t: 0, r: 0, b: 0, l: 0, c: 0},
						padd:  {t: 15, r: 20, b: 10, l: 10},
					},
				};

				/* definindo valores iniciais */
				var data       = config[type];
				this._COLOR    = -1;
				this._MEASURES = data.padd;
				this._SET_SCALE("y");
				this._SET_SCALE("x");
				var ref  = this._MEASURES;
				var dX   = ref.w/n;
				var dY   = ref.h/n;
				var grid = {x: [], y: []};

				/* construindo linhas */
				for (var i = 0; i < (n+1); i++) {
					var hRef = data.width[i === 0 ? "b" : (i === n ? "t" : "c")];
					var vRef = data.width[i === 0 ? "l" : (i === n ? "r" : "c")];
					var val = {
						h: {x1: ref.l, x2: ref.r, y1: ref.t+(i*dY), y2: ref.t+(i*dY)},
						v: {y1: ref.t, y2: ref.b, x1: ref.l+(i*dX), x2: ref.l+(i*dX)},
					}
					this._BUILD_LINE(val.h.x1, val.h.y1, val.h.x2, val.h.y2, "", hRef);
					this._BUILD_LINE(val.v.x1, val.v.y1, val.v.x2, val.v.y2, "", vRef);
					grid.x.push({x: val.v.x1, y: val.v.y2, d: dX});
					grid.y.unshift({x: val.h.x1, y: val.h.y1, d: dY});
				}

				/* construíndo título e labels */
				this._BUILD_LABEL(ref.cx, ref.t/5, this._TITLE, "n", false, true);
				this._BUILD_LABEL(ref.cx, ref.b+(100-ref.b)*3/4, xlabel, "s", false, true);
				this._BUILD_LABEL(1/4*ref.l, ref.cy, ylabel, "s", true, true);

				return grid;
			}
		},
		_COMPARE: { /* desenha um gráfico de colunas comparativo */
			enumerable: true,
			value: function(xlabel, ylabel) {/*desenha gráfico comparativo de colunas*/
				/* Obtendo dados básicos */
				var data = {x: [], y: []};
				for (var i = 0; i < this._DATA.length; i++) {
					var item = this._DATA[i];
					if (item.t === "deleted" || item.t !== "compare") continue;
					for (var j = 0; j < item.x.length; j++) { /*adicionando dados*/
						data.x.push(item.x[j]);
						data.y.push(item.y[j]);
					}
				}
				if (data.x.length === 0) return null; /*se vazio, retornar*

				/* Definindo dados para o gráfico */
				var object = WDcompare(data.x, data.y);
				var ratio  = object.ratio;
				var amount = object.amount;
				var values = {l: [0], x: [], y: [], v: []};
				for (var i in ratio) {
					values.l.push(values.l.length);
					values.x.push(i);
					values.y.push(ratio[i]);
					values.v.push(amount[i]);
				}
				/* definindo limites */
				this._SET_ENDS("x", values.l);
				this._SET_ENDS("y", values.y);
				this._SET_ENDS("y", [0]); /*sempre exibir o ponto y = 0 */

				/* Plotando o gráfico */
				var grid = this._SET_AREA("compare", values.x.length, xlabel, ylabel); /*definindo grade do gŕafico*/
				var sum = 0; /*ponto de referência do comparativo*/

				for (var i = 0; i < values.x.length; i++) {/*construindo colunas*/
					sum += values.v[i];
					this._COLOR = i;
					var trg1 = this._TARGET(i, 0);
					var trg2 = this._TARGET(i+1, values.y[i]);
					var trg3 = this._TARGET((i + 0.5), 0);
					var pct  = this._LABEL_VALUE(values.y[i], true);
					var val  = this._LABEL_VALUE(values.v[i]);
					var ttl  = values.x[i]+": "+val+" ("+pct+")";
					var pos  = values.y[i] < 0 ? -1 : 1;
					this._BUILD_RECT(trg1.x, trg1.y, trg2.x, trg2.y, ttl);
					this._ADD_LEGEND(values.x[i]);
					/* posição: valor no eixo e porcentagem no topo/base */
					this._BUILD_LABEL(trg3.x, trg2.y-pos, pct, pos < 0 ? "n" : "s", false, true);
					this._COLOR = -1;
					this._BUILD_LABEL(trg3.x, trg3.y+pos, val, pos < 0 ? "s" : "n", false);
				}
				/*desenhando eixo zero*/
				var ref = this._MEASURES;
				var zero = this._TARGET(0,0);
				this._BUILD_LINE(ref.l, zero.y, ref.r, zero.y, "", 2);
				this._BUILD_LABEL(99, 99, "\u03A3y = "+this._LABEL_VALUE(sum), "se", false, true);

				return true;
			}
		},
		_LABEL_ANALYSIS: {
			value: function(a, b, d, e) {
				d = d === null ? "" : " \u00B1 "+this._LABEL_VALUE(d);
				a = a === null ? "" : this._LABEL_VALUE(a);
				b = b === null ? "" : this._LABEL_VALUE(b);
				return e.replace("a", a).replace("b", b)+d;
			}
		},
		add: {/* Adiciona conjunto de dados para plotagem */
			enumerable: true,
			value: function(x, y, label, analysis) {
				/*verificando dados*/
				var obj1 = WDanalysis(x,y);
				var obj2 = WDcompare(x,y);
				if (obj1.e && obj2.e) return null;
				var color = this._DATA.length === 0 ? 0 : this._DATA[this._DATA.length-1].c; /*obter a última cor adicionada*/
				/*dados sem condições de análise*/
				if (!obj2.e) this._DATA.push(
					{x: obj2.x, y: obj2.y, l: null, t: "compare", c: color+1, f: false}
				);
				if (obj1.e) return true;

				/*plotar uma função*/
				if (WD(y).type === "function") {
					this._DATA.push(
						{x: obj1.x, y: y, l: label, t: "line", c: color+1, f: false}
					);
					return true;
				}
				/*plotar somente coordenadas*/
				if (!(analysis in obj1)) {
					this._DATA.push(
						{x: obj1.x, y: obj1.y, l: label, t: "dots", c: color+1, f: false}
					);
					this._DATA.push(
						{x: obj1.x, y: obj1.y, l: null, t: "line", c: color+1, f: false}
					);
					return true;
				}
				/*verificar análise*/
				var check = obj1[analysis];
				if (check === null) return null;

				/*referências*/
				var ref = {
					average:     {c1: "line", c2: "line"},
					exponential: {c1: "dots", c2: "line"},
					linear:      {c1: "dots", c2: "line"},
					geometric:   {c1: "dots", c2: "line"},
					sum:         {c1: "line", c2: "cols"},
				};
				/* plotando coordanadas*/
				this._DATA.push(
					{x: obj1.x, y: obj1.y, l: label, t: ref[analysis].c1, c: color+1, f: false}
				);
				/*plotando análise*/
				var l = this._LABEL_ANALYSIS(check.a, check.b, check.d, check.e);
				this._DATA.push(
					{x: obj1.x, y: check.f, l: l, t: ref[analysis].c2, c: color+2, f: true}
				);
				/*plotando desvio padrão*/
				if (check.d !== null) {
					var f1 = function(x) {return check.f(x)+check.d;}
					var f2 = function(x) {return check.f(x)-check.d;}
					this._DATA.push(
						{x: obj1.x, y: f1, l: null, t: "dotted", c: color+2, f: false}
					);
					this._DATA.push(
						{x: obj1.x, y: f2, l: null, t: "dotted", c: color+2, f: false}
					);
				}
				return true;
			}
		},
		clear: {
			enumerable: true,
			value: function() {/*apaga todos os dados do gráfico*/
				this._CLEAR_SVG();
				for (var i = 0; i < this._DATA.length; i++)
					this._DATA[i].t = "deleted";
				return true;
			}
		},
		plot: {
			enumerable: true,
			value: function(xlabel, ylabel, compare) {/*desenha gráfico plano*/
				this._CLEAR_SVG();
				if (compare === true) return this._COMPARE(xlabel, ylabel);

				/* Obtendo valores básicos para definir parâmetros dos gráficos */
				var data = [];
				for (var i = 0; i < this._DATA.length; i++) {
					var item = this._DATA[i];
					if (item.t === "deleted" || item.t === "compare") continue;
					this._SET_ENDS("x", item.x);
					if (WD(item.y).type === "array")
						this._SET_ENDS("y", item.y);
					if (item.t === "cols") /* exibir o ponto y = 0 */
						this._SET_ENDS("y", [0]);
					data.push(item);
				}
				if (data.length === 0) return null;
				this._SET_SCALE("x");

				/* definindo array y para funções */
				for (var i = 0; i < data.length; i++) {
					var item = data[i];
					if (WD(item.y).type !== "function") continue;
					var obj   = WDanalysis(item.x, item.y);
					var prec  = this._DELTA(item.t === "cols" ? 0.1 : 1); /*precisão do desenho*/
					var value = obj.continuous(prec);
					if (value === null) {/*se erro: considerar sómentos os pontos*/
						item.y = obj.y;
					} else {
						item.x = value.x;
						item.y = value.y;
					}
					/* definindo novos limites */
					this._SET_ENDS("x", item.x);
					this._SET_ENDS("y", item.y);
				}

				/* Plotagem da área e das linhas */
				var lines = 4;
				var grid  = this._SET_AREA("plan", lines, xlabel, ylabel);

				for (var i = 0; i < data.length; i++) {
					var item = data[i];
					this._COLOR = item.c;
					this._ADD_LEGEND(item.l, item.f);

					/*coordenadas*/
					for (var j = 0; j < item.x.length; j++) { /*obterndo coordenadas*/
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

				/*valores dos eixos*/
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
				return true;
			}
		},
	});

/*...........................................................................*/

	WDdom.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDdom}
	});

	Object.defineProperty(WDdom.prototype, "item", {/*item ou quantidade*/
		enumerable: true,
		value: WDarray.prototype.item
	});

	Object.defineProperty(WDdom.prototype, "run", {/*executa um job nos elementos*/
		enumerable: true,
		value: function(method) {
			var check = new WDtype(method);
			if (check.type !== "function") return this;
			for (var i = 0; i < this.item(); i++) {
				var x = this.item(i);
				if (x !== window && x.nodeType != 1 && x.nodeType != 9) continue;
				method(x);
			}
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "handler", {/*disparadores*/
		enumerable: true,
		value: function (events, remove) {
			var check = WDtype(events);
			if (check.type !== "object") return this;

			this.run(function(elem) {
				for (var ev in events) {
					var method = WDtype(events[ev]);
					if (method.type !== "function") continue;
					var action = remove === true ? "removeEventListener" : "addEventListener";
					var event  = ev.toLowerCase().replace(/^on/, "");
					elem[action](event, method.input, false);
				}
				return;
			});

			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "style", {/*define style*/
		enumerable: true,
		value: function(styles) {
			var check = new WDtype(styles);
			if (check.type !== "object" && check.value !== null) return this;

			this.run(function(elem) {
				if (styles === null) {
					while (elem.style.length > 0) elem.style[elem.style[0]] = null;
					return;
				}
				for (var i in styles) {
					var key = new WD(i).camel;
					elem.style[key] = styles[i];
				}
				return;
			});
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "css", {/*manipular className*/
		enumerable: true,
		value: function (list) {
			var check = new WDtype(list);
			if (check.type !== "object" && check.value !== null) return this;

			this.run(function(elem) {
				if (list === null) {
					elem.className = "";
					return;
				}

				var attr = WD(elem.className);
				if (attr.type !== "text" && attr.type !== "null") /*Há elementos que className não é texto*/
					attr = WD(elem.getAttribute("class"));

				var css = attr.type === "text" ? WD(attr.toString().split(" ")) : WD([]);

				for (var i in list) {
					if (["add", "del", "tgl", "toggle"].indexOf(i) < 0) continue
					var check = new WDtype(list[i]);
					if (check.type !== "text") continue;
					var items = check.value.split(" ");
					for (var j = 0; j < items.length; j++) css[i === "tgl" ? "toggle" : i](items[j]);
				}

				css.del("");
				css.unique();
				css.sort();

				try      {elem.className = css.valueOf().join(" ");}
				catch(e) {elem.setAttribute("class", css.valueOf().join(" "));}/*Há elementos que className não é editável*/

				return;
			});
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "data", {/*define dataset*/
		enumerable: true,
		value: function(input) {
			var check = new WDtype(input);
			if (check.type !== "object" && check.value !== null) return this;

			this.run(function(elem) {
				if (input === null) {
					for (var i in elem.dataset) {
						elem.dataset[i] = null;
						delete elem.dataset[i];
					}
					return;
				}

				for (var i in input) {
					var key = WD(i);
					if (key.type !== "text") continue;
					key = key.camel;

					if (input[i] === null) {
						elem.dataset[key] = null;
						delete elem.dataset[key];
					} else {
						elem.dataset[key] = input[i];
						settingProcedures(elem, key);
					}
				}
				return;
			});
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "load", { /*carregar HTML/Texto*/
		enumerable: true,
		value: function(text) {
			text = text === undefined || text === null ? "" : new String(text).toString();
			this.run(function(elem) {
				var attr = WDdom.load(elem);
				elem[attr] = text;
				if (attr === "innerHTML") {
					var scripts = elem.querySelectorAll("script");
					for (var i = 0; i < scripts.length; i++) {
						var script = document.createElement("script");
						if (scripts[i].src === "") {
							script.textContent = scripts[i].textContent;
						} else {
							script.src = scripts[i].src;
						}
						elem.appendChild(script);
						WD(script).set("remove");
					}
				}
				loadingProcedures();
				return;
			});
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "repeat", {/*clona elementos por array*/
		enumerable: true,
		value: function (json) {
			var check = new WDtype(json);
			if (check.type !== "array") return this;
			this.run(function(elem) {
				var html = elem.innerHTML;

				if (html.search(/\{\{.+\}\}/gi) >= 0) {

					elem.dataset.wdRepeatModel = html;
				} else if ("wdRepeatModel" in elem.dataset) {
					html = elem.dataset.wdRepeatModel;
				} else {
					return;
				}
				elem.innerHTML = "";
				html = html.split("}}=\"\"").join("}}");
				for (var i = 0; i < json.length; i++) {
					var inner  = html;
					var object = new WDtype(json[i]);
					if (object.type !== "object") continue;
					for (var c in json[i]) inner = inner.split("{{"+c+"}}").join(json[i][c]);
					elem.innerHTML += inner;
				}
				loadingProcedures();
				return;
			});
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "filter", {/*exibe somente o texto casado*/
		enumerable: true,
		value: function (search, chars) {
			chars = WDbox.finite(chars) && chars !== 0 ? WDbox.int(chars) : 1;

			/*definindo valor de busca*/
			var check1 = WD(search)
			if      (search === null || search === undefined) {search = "";}
			else if (check1.type === "text")   {search = check1.format("upper", "clear");}
			else if (check1.type !== "regexp") {search = new String(search).trim().toUpperCase();}

			this.run(function (elem) {
				var child = elem.children;
				for (var i = 0; i < child.length; i++) {
					if (!("textContent" in child[i])) continue;

					/*obtendo área de busca*/
					var content = child[i].textContent.trim().toUpperCase();
					var check2  = WD(content);
					if (check2.type === "text") content = check2.format("clear");

					var target = WD(child[i]);

					if (check1.type === "regexp" && search.test(content)) {
						target.nav("show");
						continue;
					}
					var found = content.indexOf(search) >= 0 ? true :  false;
					var width = search.length;
					if (chars < 0) {
						target.nav((found && width >= -chars) ? "show" :  "hide");
					} else {
						target.nav((!found && width >= chars) ? "hide" :  "show");
					}
				};
				return;
			});
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "set", {/*Define atributos*/
		enumerable: true,
		value: function (attr, value) {
			attr = String(attr).trim();
			this.run(function(elem) {
				var check = new WDtype(attr in elem ? elem[attr] : null);
				if (check.type === "function") return elem[attr](value);

				if (attr in elem) {
					try {
						var val = elem[attr];
						if (value === "?" && (val === true || val === false)) {
							elem[attr] = val ? false : true;
							return;
						}
						elem[attr] = value;
						return;
					} catch(e) {}
				}

				if (value === undefined || value === null) return elem.removeAttribute(attr);
				var val = elem.getAttribute(attr);
				if (value === "?") {
					if (val === null) return elem.setAttribute(attr, "");
					if (val !== null) return elem.removeAttribute(attr);
				}
				return elem.setAttribute(attr, value);
			});
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "full", {/*fullScreen: apenas para o 1º elemento*/
		enumerable: true,
		value: function (exit) {
			var action = {
				open: ["requestFullscreen", "webkitRequestFullscreen", "msRequestFullscreen"],
				exit: ["exitFullscreen", "webkitExitFullscreen", "msExitFullscreen"]
			};
			var full   = exit === true ? action.exit : action.open;
			var target = exit === true ? document : this._value[0];
			for (var i = 0; i < full.length; i++) {
				if (full[i] in target) {
					try {target[full[i]]();} catch(e) {}
					break;
				}
			}
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "nav", {/*navegação*/
		enumerable: true,
		value: function (action) {
			action = new String(action).toLowerCase();

			this.run(function(elem) {
				var list = WD(elem);
				if (action === "show")   return list.css({del: "js-wd-no-display"});
				if (action === "hide")   return list.css({add: "js-wd-no-display"});
				if (action === "toggle") return list.css({tgl: "js-wd-no-display"});

				if (action === "prev") {
					var child  = elem.children;
					var length = child.length;
					if (length === 0) return;
					var target = child[length-1];
					for (var i = 0; i < length; i++) {
						if (WDdom.checkCss(child[i], "js-wd-no-display")) continue;
						if (i !== 0) target = child[i-1];
						break;
					}
					var apply = WD(target);
					return apply.nav();
				}

				if (action === "next") {
					var child  = elem.children;
					var length = child.length;
					if (length === 0) return;
					var target = child[0];
					for (var i = (length-1); i >= 0; i--) {
						if (WDdom.checkCss(child[i], "js-wd-no-display")) continue;
						if (i !== (length - 1)) target = child[i+1];
						break;
					}
					var apply = WD(target);
					return apply.nav();
				}
				/*default*/
				var bros = WD(elem.parentElement.children);
				bros.nav("hide");
				list.nav("show")
				return;
			});
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "page", {/*divide os elementos em "páginas"*/
		enumerable: true,
		value: function (page, size) {
			page = WDbox.finite(page) ? WDbox.int(page) : 0;
			size = WDbox.finite(size) && size > 0 ? Math.abs(size) : -1;

			this.run(function(elem) {
				var book  = elem.children;
				var lines = size <= 0 ? book.length : WDbox.int(size < 1 ? size*book.length : size);
				var pages = WDbox.int(book.length/lines);
				var print = [];

				for (var i = 0; i < book.length; i++) {
					var p = WDbox.int(i/lines);
					if (print[p] === undefined) print.push([]);
					print[p].push(book[i]);
				}
				WD(book).nav("hide");
				var show = WD(print).item(page);
				if (show === undefined) show = page < 0 ? print[0] : print[pages];

				for (var i = 0; i < show.length; i++) WD(show[i]).nav("show");
				return;
			});
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "sort", {/*ordenar elementos filhos*/
		enumerable: true,
		value: function (order, col) {
			order = WDbox.finite(order) ? WDbox.int(order) : 1;
			col   = WDbox.finite(col)   ? WDbox.int(col, true) : null;

			this.run(function(elem) {
				var children = elem.children;
				var aux = [];

				for (var i = 0; i < children.length; i++) {
					if (col === null) {
						aux.push(children[i]);
					} else if (children[i].children[col] !== undefined) {
						aux.push(children[i].children[col]);
					}
				}

				var sort = WD(aux).sort();
				if (order < 0) sort = sort.reverse();
				for (var i = 0; i < sort.length; i++) {
					elem.appendChild(col === null ? sort[i] : sort[i].parentElement);
				}

				return;
			});
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "styles", {/*lista os estilos*/
		enumerable: true,
		value: function(css) {
			var check = WDtype(css);
			if (check.type !== "text") return null;
			css = check.value;
			var x = [];
			this.run(function(elem) {
				var style = window.getComputedStyle(elem, null);
				x.push(css in style ? style.getPropertyValue(css) : null);
				return;
			});
			return x;
		}
	});

	Object.defineProperty(WDdom.prototype, "table", {/*captura dados da tabela*/
		enumerable: true,
		value: function() {
			var tables = [];
			this.run(function(elem) {
				var tag = WDdom.tag(elem);
				if (["tfoot", "tbody", "thead", "table"].indexOf(tag) < 0) return tables.push(null);
				var data = [];
				var rows = elem.rows;
				for (var row = 0; row < rows.length; row++) {
					var cols = rows[row].children;
					if (data[row] === undefined) data.push([]);
					for (var col = 0; col < cols.length; col++) {
						if (data[row][col] === undefined) data[row].push([]);
						data[row][col] = cols[col].textContent;
					}
				}
				tables.push(data);
				return;
			});
			return tables;
		}
	});

	Object.defineProperty(WDdom.prototype, "form", {/*obtém serialização de formulário*/
		value: function(method) {
			method = new String(method).toUpperCase().trim();
			var x = method === "GET" ? [] : new FormData();
			this.run(function(elem) {
				var data = WDdom.formdata(elem);
				for (var i = 0; i < data.length; i++) {
					var name  = data[i].NAME;
					var value = method === "GET" ? data[i].GET : data[i].POST;
					var check = new WDtype(value);
					if (check.type === "array") {
						for (var j = 0; j < value.length; j++) {
							if (method === "GET") {x.push(name+"="+value[j]);}
							else                  {x.append(name, value[j]);}
						}
					} else {
						if (method === "GET") {x.push(name+"="+value);}
						else                  {x.append(name, value);}
					}
				}
				return;
			});
			return method === "GET" ? x.join("&") : x;
		}
	});

	Object.defineProperty(WDdom.prototype, "chart", {/*retorna um objeto (aplicável somente ao 1º elemento) de criação de gráficos*/
		value: function(title) {
			return new wdChart(this.item(0), title);
		}
	});


/*============================================================================*/
/* -- ATRIBUTOS -- */
/*============================================================================*/

/*...........................................................................*/

	function data_wdLoad(e) {/*carrega HTML: data-wd-load=path{file}method{get|post}${form}*/
		if (!("wdLoad" in e.dataset)) return;
		var data   = WDdom.dataset(e, "wdLoad")[0];
		var target = WD(e);
		var method = "method" in data ? data.method : "post";
		var file   = data.path;
		var pack   = WDbox.get$$(data);
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
		var data   = WDdom.dataset(e, "wdRepeat")[0];
		var target = WD(e);
		var method = "method" in data ? data.method : "post";
		var file   = data.path;
		var pack   = WDbox.get$$(data);
		var exec   = WD(pack);

		target.data({wdRepeat: null});
		exec.send(file, function(x) {
			if (x.closed) {
				if (x.json !== null) return target.repeat(x.json);
				if (x.csv !== null)  return target.repeat(WDbox.matrixObject(x.csv));
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
		var data   = WDdom.dataset(e, "wdChart")[0];
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
			var pack   = WDbox.get$$(data);
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
		var data = WDdom.dataset(e, "wdSend");
		for (var i = 0; i < data.length; i++) {
			if (!("get" in data[i]) && !("post" in data[i])) continue;
			var method = "method" in data[i] ? data.method[i] : "post";
			var file   = data[i].path;
			var pack   = WDbox.get$$(data[i]);
			var call   = window[data[i]["call"]];
			var exec   = WD(pack);
			exec.send(file, call, method);
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdSort(e) {/*Ordenar HTML: data-wd-sort="order{±1}col{>0?}"*/
		if (!("wdSort" in e.dataset)) return;
		var data  = WDdom.dataset(e, "wdSort")[0];
		var order = "order" in data ? data.order : 1;
		var col   = "col"   in data ? data.col : null;
		WD(e).sort(order, col).data({wdSort: null});
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdTsort(e) {/*Ordena tabelas: data-wd-tsort=""*/
		if (!("wdTsort" in e.dataset)) return;
		if (WDdom.tag(e.parentElement.parentElement) !== "thead") return;
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

		var search = WDdom.form(e) ? WDdom.value(e) : e.textContent;
		if (search === null) search = "";
		if (search[0] === "/" && search.length > 3) {/*É RegExp?*/
			if (search[search.length - 1] === "/") {
				search = new RegExp(search.substr(1, (search.length - 2)));
			} else if (search.substr((search.length - 2), 2) === "/i") {
				search = new RegExp(search.substr(1, (search.length - 3)), "i");
			}
		}

		var data = WDdom.dataset(e, "wdFilter");
		for (var i = 0; i < data.length; i++) {
			var chars  = data[i].chars;
			var target = WDbox.get$$(data[i]);
			if (target !== null) WD(target).filter(search, chars);
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdMask(e) {/*Máscara: data-wd-mask="model{mask}call{callback}"*/
		if (!("wdMask" in e.dataset)) return;
		var attr = WDdom.mask(e);
		if (attr === null) return;
		var data = WDdom.dataset(e, "wdMask")[0];
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
		var data = WDdom.dataset(e, "wdPage")[0];
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
		var data = WDdom.dataset(e, "wdData");
		for (var i = 0; i < data.length; i++) {
			var target = WDbox.get$$(data[i]);
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
		var data = WDdom.dataset(e, "wdEdit")[0];
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
		var data = WDdom.dataset(e, "wdDevice")[0];
		var desktop = "desktop" in data ? data.desktop : "";
		var mobile  = "mobile"  in data ? data.mobile  : "";
		var tablet  = "tablet"  in data ? data.tablet  : "";
		var phone   = "phone"   in data ? data.phone   : "";
		var device  = WDbox.device();
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
		var data   = WDdom.dataset(e, "wdFull")[0];
		var exit   = "exit" in data ? true : false;
		var target = WDbox.get$$(data);
		if (target === null) target = document.documentElement;
		WD(target).full(exit);
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdSlide(e) {/*Carrossel: data-wd-slide=time*/
		if (!("wdSlide" in e.dataset)) return delete e.dataset.wdSlideRun;
		var time = WDbox.finite(e.dataset.wdSlide) ? WDbox.int(e.dataset.wdSlide) : 1000;;

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
		var data  = WDdom.dataset(e, "wdSet");
		var words = {"null": null, "false": false, "true": true};
		for (var i = 0; i < data.length; i++) {
			var target = WDbox.get$$(data[i]);
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
		var data = WDdom.dataset(e, "wdCss");
		for (var i = 0; i < data.length; i++) {
			var target = WDbox.get$$(data[i]);
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
		var data = WDdom.dataset(e, "wdNav");
		for (var i = 0; i < data.length; i++) {
			var target = WDbox.get$$(data[i]);
			var value  = "type" in data[i] ? data[i].type : null;
			WD(target === null ? e : target).nav(value);
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdOutput(e) {/*Atribui um valor ao target: data-wd-output=${target}call{}*/
		if (!("wdOutput" in e.dataset)) return;
		var data   = WDdom.dataset(e, "wdOutput")[0];
		var target = WDbox.get$$(data);
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

		var data  = WDdom.dataset(e, "wdFile")[0];
		var info  = {error: null, file: null, value: null, parameter: null};
		var files = e.files;

		if ("nf" in data && files.length > WDbox.int(data.nf, true)) {
			info.error     = "nf";
			info.value     = files.length;
			info.file      = "";
			info.parameter = WDbox.int(data.nf, true);
		} else {
			var ms = 0;
			var fc = "fc" in data ? new RegExp("("+data.fc+")", "g") : null;

			for (var i = 0; i < files.length; i++) {
				ms += files[i].size;
				if ("ms" in data && ms > WDbox.int(data.ms, true)) {
					info.error     = "ms";
					info.value     = WDbox.calcByte(ms);
					info.parameter = WDbox.calcByte(WDbox.int(data.ms, true));
				} else if ("fs" in data && files[i].size > WDbox.int(data.fs, true)) {
					info.error     = "fs";
					info.value     = WDbox.calcByte(files[i].size);
					info.parameter = WDbox.calcByte(WDbox.int(data.fs, true));
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
		if (WDdom.tag(e.parentElement) !== "nav") return;
		WD(e.parentElement.children).css({add: "js-wd-nav-inactive"});
		WD(e).css({del: "js-wd-nav-inactive"});
		return;
	};

/*============================================================================*/
/* -- DISPARADORES -- */
/*============================================================================*/

	function loadProcedures(ev) {
		/*definer o dispositivo*/
		WDbox.deviceController = WDbox.device();

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
		];
		var style = document.createElement("STYLE");
		for(var i = 0; i < styles.length; i++)
			style.textContent += styles[i].target+" {"+styles[i].value+"}\n"
		document.head.appendChild(style);

		/*definindo ícone*/
		if (WDbox.$("link[rel=icon]") !== null) {
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
				tag:          WDdom.tag(obj.item(0)),
				position:     obj.styles("position")[0].toLowerCase(),
				height:       WDbox.int(obj.styles("height")[0].replace(/[^0-9\.]/g, "")),
				marginTop:    WDbox.int(obj.styles("margin-top")[0].replace(/[^0-9\.]/g, "")),
				marginBottom: WDbox.int(obj.styles("margin-bottom")[0].replace(/[^0-9\.]/g, "")),
				bottom:       WDbox.int(obj.styles("bottom")[0].replace(/[^0-9\.]/g, "")),
				top:          WDbox.int(obj.styles("top")[0].replace(/[^0-9\.]/g, "")),
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
		var device = WDbox.device();
		if (device !== WDbox.deviceController) {
			WDbox.deviceController = device;
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
		if (WDdom.form(ev.target)) return;

		/*FIXME elementos com contentEditable funcionam com o evento input, ver como function no IE11*/
		/*se funcionar, eliminar esse procedimento com o evento keyup*/
		


		var now  = (new Date()).valueOf();
		var time = Number(ev.target.dataset.wdTimeKey);

		/*definir atributo e pedir para verificar posteriormente*/
		if (relay !== true) {
			ev.target.dataset.wdTimeKey = now;
			window.setTimeout(function() {/*verificar daqui um intervalo de tempo*/
				keyboardProcedures(ev, true);
			}, WDbox.keyTimeRange);
			return;
		}

		/*se há o atributo e o agora superar o intervalo, apagar atributo e executar*/
		if ("wdTimeKey" in ev.target.dataset && now >= (time+WDbox.keyTimeRange)) {
			delete ev.target.dataset.wdTimeKey;

			data_wdFilter(ev.target);
			data_wdOutput(ev.target);
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function inputProcedures(ev, relay) {/*procedimentos de teclado para formulários*/
		/* Somente para formulários */
		if (!WDdom.form(ev.target) && ev.target.isContentEditable) return;
	
		var now  = (new Date()).valueOf();
		var time = Number(ev.target.dataset.wdTimeKey);

		/*definir atributo e pedir para verificar posteriormente*/
		if (relay !== true) {
			ev.target.dataset.wdTimeKey = now;
			window.setTimeout(function() {/*verificar daqui um intervalo de tempo*/
				inputProcedures(ev, true);
			}, WDbox.keyTimeRange);
			return;
		}

		/*se há o atributo e o agora superar o intervalo, apagar atributo e executar*/
		if ("wdTimeKey" in ev.target.dataset && now >= (time+WDbox.keyTimeRange)) {
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

	WD(window).handler({/*Definindo eventos window*/
		load: loadProcedures,
		resize: scalingProcedures,
		hashchange: hashProcedures,
	});

	WD(document).handler({/*Definindo eventos document*/
		click:    clickProcedures,
		keyup:    keyboardProcedures,
		input:    inputProcedures,
		change:   changeProcedures,
		focusout: focusoutProcedures,
	});

	return WD;
}());
