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

"use strict";

//var wd = (function() {

/* === WD ================================================================== */

	/*Variáveis globais*/

	/*guarda as mensagens da biblioteca*/
	var wdConfig;
	/*guarda o tamanho da tela*/
	var deviceController;
	/*guarda as propriedades da data*/
	var Y_min, Y_max, Y_004, Y_100, Y_400, WEEK_1st, DATE_min, DATE_max;

/*............................................................................*/


	function WDbox(input) {
		if (!(this instanceof WDbox)) return new WDbox(input);
		Object.defineProperty(this, "_input", {value: input});
	}

	Object.defineProperty(WDbox.prototype, "constructor", {value: WDbox});

	/*Imprime mensagem no console*/
	WDbox.log   = function(x) {return console.log(x);}
	WDbox.info  = function(x) {return console.info(x);}
	WDbox.error = function(x) {return console.error(x);}
	WDbox.warn  = function(x) {return console.warn(x);}

	/*expressoes regulares*/
	WDbox.re = {
		noids: /[^a-zA-Z0-9\.\_\:\-\ ]/g,
		camel: /^[a-z0-9\.\_\:][a-zA-Z0-9\.\_\:]+$/,
		dash:  /^[a-z0-9\_\.\:]+((\-[a-z0-9\_\.\:]+)+)?$/,
		empty: /[\0- ]+/g,
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
		date.setMilliseconds(0);
		date.setSeconds(0);
		date.setMinutes(0);
		date.setHours(12);
		if (isFinite(y)) date.setFullYear(y);
		if (isFinite(m)) date.setMonth(m - 1);
		if (isFinite(d)) date.setDate(d);
		return date;
	}		

	WDbox.csv = function(input) {/*CSV para Array*/
		var data = [];

		var rows = input.trim().split("\n");

		for (var r = 0; r < rows.length; r++) {
			data.push([]);

			var cols = rows[r].split("\t")

			for (var c = 0; c < cols.length; c++) {
				var col = new WDtype(cols[c]);

				if (col.type === "number") {
					data[r].push(col.value);
				} else {
					data[r].push(col.input.replace(/^\"/, "").replace(/\"$/, ""));
				}
			}
		}
		return data;
	}

	WDbox.device = function() {/*tipo do dispositivo*/
		if (window.innerWidth >= 768) return "Desktop";
		if (window.innerWidth >= 600) return "Tablet";
		return "Phone";
	};

	WDbox.Device = undefined; /*último device definido FIXME: vai precisar disso? talvez inserir no lugar do wdconfig*/

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
			this._value = this._input;
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
			this._input instanceof HTMLElement
		) {
			this._type  = "dom";
			this._value = [this._input];
			return true;
		}

		if (
			this._input instanceof NodeList ||
			this._input instanceof HTMLCollection ||
			this._input instanceof HTMLAllCollection ||
			this._input instanceof HTMLFormControlsCollection
		) {
			this._type  = "dom";
			this._value = [];
			for (var i = 0; i < this._input.length; i++) {
				this._value.push(this._input[i]);
			}
			return true;
		}

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
		if (typeof this._input === "number" || this._input instanceof Number) {
			this._type  = "number";
			this._value = this._input.valueOf();
			return true;
		}

		if (!this.isString) return false;

		if (this._input === "Infinity") return false;

		if (this._input == Number(this._input)) {
			this._type  = "number";
			this._value = Number(this._input).valueOf();
			return true;
		}

		if ((/^[0-9]+\!$/).test(this._input)) {
			var number = Number(this._input.substr(0, (this._input.length - 1)));
			var value  = 1;
			while (number > 1) {
				value *= number;
				number--;
			}
			this._type  = "number";
			this._value = value;
			return true;
		}

		if ((/^[0-9]+(\.[0-9]+)?\%$/).test(this._input)) {
			var number  = Number(this._input.substr(0, (this._input.length - 1)));
			this._type  = "number";
			this._value = number / 100;
			return true;
		}

		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isTime", {get: function() {
		if (!this.isString) return false;

		if (this._input === "%now") {/*NOW*/
			this._type  = "time";
			var time    = new Date();
			this._value = WDbox.timeNumber(
				time.getHours(),
				time.getMinutes(),
				time.getSeconds()
			);
			return true;
		}

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

		if (this._input === "%today") {/*TODAY*/
			this._type  = "date";
			this._value = new Date();
			this._value = WDbox.noonDate(new Date());
			return true;
		}

		var d, m, y, array, type, symbol, index;

		/*capturando formatos padrão*/
		if (/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/.test(this._input)) { /*YYYY-MM-DD*/
			type = 0;
		} else if (/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(this._input)) { /*MM/DD/YYYY*/
			type = 1;
		} else if (/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/.test(this._input)) { /*DD.MM.YYYY*/
			type = 2;
		} else {return false;}

		symbol = ["-", "/", "."];
		index  = {d: [2, 1, 0], m: [1, 0, 1], y: [0, 2, 2]};
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
	WDrequest.window = document.createElement("DIV"); /*guarda a janela modal*/

	WDrequest.count  = 0;     /*guarda o número de janelas abertas*/

	WDrequest.styled = false; /*guarda a informação se a janela já foi estilizada*/

	WDrequest.style  = {      /*guarda o stylo padrão da janela*/
		display:  "block", width: "100%", height: "100%", padding: "1em",
		position: "fixed", top: "0", right: "0", bottom: "0",	left: "0",
		zIndex: "999999",	cursor: "progress", fontWeight: "bold", textAlign: "right"
	};

	WDrequest.setStyle = function() { /*define o estilo padrão se ainda não definido*/
		if (this.styled) return;
		for (var i in this.style) this.window.style[i] = this.style[i];
		this.styled = true;
		return;
	}

	WDrequest.open = function() {
		this.setStyle();
		/*FIXME
		data_wdConfig();
		*/
		this.window.textContent           = "Aguarde";//wdConfig.modalMsg;
		this.window.style.color           = "white";//wdConfig.modalFg;
		this.window.style.backgroundColor = "#000000";
		//this.window.style.backgroundColor = wdConfig.modalBg;

		if (this.count === 0) document.body.appendChild(this.window);
		this.count++;
		return;
	}

	WDrequest.close = function() {
		var parent = this;
		window.setTimeout(function () { //FIXME: se tiver que usar o setTimeout, precisa mudar o this
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
				parent.setEvents("LOADING", false, x.loaded, x.total);
				return;
			}

			this.request.onerror = function(x) {
				parent.setEvents("ERROR", true, 0, 0);
				return;
			}

			this.request.ontimeout = function(x) {
				parent.setEvents("TIMEOUT", true, 0, 0);
				return;
			}

			this.request.upload.onprogress = function(x) {
				parent.setEvents("UPLOADING", false, x.loaded, x.total);
				return;
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
			WDbox.error(this._action + " > " +e.message)
			this._closed = true;
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

	/* Métodos estáticos ------------------------------------------------------*/
	WDsignal.window = document.createElement("DIV"); /*container das mensagens*/
	WDsignal.opened = false; /*container aberto?*/
	WDsignal.styled = false; /*container estilizado?*/

	WDsignal.cbase  = {position: "fixed", top:   "0", margin: "auto", zIndex: "999999"};
	WDsignal.cmicro = {left:   "initial", right: "0", width:  "25%", textAlign: "left"};
	WDsignal.csmall = {right:  "initial", left:  "0", width: "100%", textAlign: "center"};

	WDsignal.mbase  = {
		textAlign: "inherit", border: "2px solid", borderRadius: "0.5em",
		margin: "0.5em", padding: "0.5em", cursor: "pointer", opacity: "1",
		backgroundColor: "#FFFFFF", /*boxShadow: "2px 2px #DCDCDC"*/
	};
	WDsignal.minfo  = {color: "#4682B4"};
	WDsignal.mwarn  = {color: "#FF8C00"};
	WDsignal.merror = {color: "#B22222"};
	WDsignal.mok    = {color: "#228B22"};
	WDsignal.mdoubt = {color: "#663399"};
	WDsignal.status = {merror: -2, mdoubt: -1, mwarn: 0, mok: 1, minfo: 2}

	WDsignal.msg = function(type, msg) {
		var parent = this;

		var box = document.createElement("P");
		box.innerHTML = msg;

		for (var i in this.mbase) box.style[i] = this.mbase[i];
		for (var i in this[type]) box.style[i] = this[type][i];

		box.onclick = function() {
			parent.window.removeChild(box);
			parent.close();
			return;
		}

		window.setTimeout(function() {
			try{
				parent.window.removeChild(box);
				parent.close();
			} catch(e) {}
			return;
		}, 8000);
		
		this.open();
		this.window.appendChild(box);
		return this.status[type];
	}

	WDsignal.open = function() {
		if (!this.styled) {
			for (var i in this.cbase) this.window.style[i] = this.cbase[i];
			this.styled = true;
		}

		var style = WDbox.device() === "Desktop" ? this.cmicro : this.csmall;
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
	
	/* Métodos de Protótipos --------------------------------------------------*/
	Object.defineProperty(WDsignal.prototype, "constructor", {value: WDsignal});

	Object.defineProperty(WDsignal.prototype, "info", {value: function() {
		return this.constructor.msg("minfo", this._msg);
	}});
	Object.defineProperty(WDsignal.prototype, "warn", {value: function() {
		return this.constructor.msg("mwarn", this._msg);
	}});
	Object.defineProperty(WDsignal.prototype, "error", {value: function() {
		return this.constructor.msg("merror", this._msg);
	}});
	Object.defineProperty(WDsignal.prototype, "ok", {value: function() {
		return this.constructor.msg("mok", this._msg);
	}});
	Object.defineProperty(WDsignal.prototype, "doubt", {value: function() {
		return this.constructor.msg("mdoubt", this._msg);
	}});

/*============================================================================*/

	function WD(input) {
		var wd  = new WDtype(input);
		var obj = {
			"undefined": WDundefined, "null":     WDnull,
			"boolean":   WDboolean,   "function": WDfunction,
			"object":    WDobject,    "regexp":   WDregexp,
//			"array":     WDarray,     "dom":      WDdom,
			"time":      WDtime,      "date":     WDdate,
			"number":    WDnumber,    "text":     WDtext
		};
		for (var i in obj) {
			if (wd.type === i) return new obj[i](wd.input, wd.type, wd.value);
		}
		return new WDmain(wd.input, wd.type, wd.value)
	}

	WD.constructor = WD;
	WD.$  = function(css, root) {return this.constructor(WDbox.$(css, root));}
	WD.$$ = function(css, root) {return this.constructor(WDbox.$$(css, root));}

/*============================================================================*/

	function WDmain(input, type, value) {
		if (!(this instanceof WDmain)) return new WDmain(input, type, value);

		var writables = ["time", "date", "text"];

		Object.defineProperties(this, {
			_input: {value: input},
			_type:  {value: type},
			_value: {
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
			method   = new WDtype(callback);

			action   = action.input.trim();
			callback = callback.type === "function" ? callback.input : null;
			method   = method.isFullString ? method.input.trim() : "GET";
			async    = async === false ? false : true;

			var pack;

			switch(this.type) {
				case "dom":
					pack = method === "POST" ? this._Form : this._form;
					break;
				case "number":
					pack = "value="+this.valueOf();
					break;
				default:
					pack = "value="+this.toString();
			}

			/*efetuando a requisição*/
			var request      = new WDrequest(action);
			request.method   = method.toUpperCase();
			request.callback = callback;
			request.async    = async;
			request.pack     = pack;
			request.send();

			return true;
		}
	});

	Object.defineProperty(WDmain.prototype, "signal", {/*renderizar mensagem*/
		enumerable: true,
		value: function(type) {
			var signal = new WDsignal(this.toString());
			if (type === "warn")  return signal.warn();
			if (type === "doubt") return signal.doubt();
			if (type === "ok")    return signal.ok();
			if (type === "error") return signal.error();
			return signal.info();
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

			x = x.replace(WDbox.re.empty, "-").split("");

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

			x = x.replace(WDbox.re.empty, "-").split("");

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

	Object.defineProperty(WDtext.prototype, "csv", {
		enumerable: true,
		get: function() {
			return WDbox.csv(this.toString());
		}
	});

	Object.defineProperty(WDtext.prototype, "trim", { /*remove espeços extras*/
		enumerable: true,
		get: function() {
			return this.toString().replace(WDbox.re.empty, " ").trim();
		}
	});

	Object.defineProperty(WDtext.prototype, "format", {	/*atributos múltiplos*/
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

			if ("normalize" in value) return value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

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

			check = String(check).toString();
			var input = this.toString();
			var code  = {"#": "[0-9]", "@": "[a-zA-Z]", "*": ".", "?": ""};
			var mask  = ["^"];
			var gaps  = [];
			var only  = ["^"]
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

			mask.push("$");
			mask = new RegExp(mask.join(""));

			/*se o usuário entrou com a máscara formatada*/
			if (mask.test(check) && callback(check)) return check;

			only.push("$");
			only = new RegExp(only.join(""));

			/*se os caracteres não estiverem de acordo com a máscara*/
			if (!only.test(check)) return null;

			var n = 0;
			for (var i = 0; i < gaps.length; i++) {
				if (gaps[i] === null) {
					gaps[i] = check[n];
					n++;
				}
			}
			gaps = gaps.join("");

			/*se os caracteres passaram pelo teste*/
			if (callback(gaps)) return gaps;

			return null;





	}});



/*============================================================================*/

	function WDnumber(input, type, value) {
		if (!(this instanceof WDnumber)) return new WDnumber(input, type, value);
		WDmain.call(this, input, type, value);
	}

	WDnumber.nFloat = function(x) {/*conta casas decimais*/
		if (x === Infinity || x === -Infinity) return 0;
		var i = 0;
		while ((x * Math.pow(10, i)) % 1 !== 0) i++;
		return i;
	}

	WDnumber.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnumber}
	});

	Object.defineProperty(WDnumber.prototype, "nType", {/* tipo do número */
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
			var type = this.nType;
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
			return parseInt(this.valueOf(), 10);
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
			return this.valueOf() < 0 ? - this.valueOf() : this.valueOf();
		}
	});





	Object.defineProperty(WDnumber.prototype, "fraction", {//FIXME
		enumerable: true,
		get: function() {
			if (this.nType === "zero")      return  "0/1";
			if (this.nType === "+infinity") return  "1/0";
			if (this.nType === "-infinity") return "-1/0";
			if (this.nType === "+integer")  return  "0/1";
			if (this.nType === "-integer")  return "-0/1";

			var ref = Math.abs(this.decimal);

			var den = Number((1/ref).toFixed(1));
			var num = 10;

			den = den*num;

			var prime = [
				2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
				67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137,
				139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199,
				211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277,
				281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359,
				367, 373, 379, 383, 389, 397, 401
			];

			for (var i = 0; i < prime.length; i++) {console.log(prime[i]);
				if (prime[i] > num) break;
			
				while ((num % prime[i] === 0) && (den % prime[i] === 0)) {
					num = Math.floor(num / prime[i]);
					den = Math.floor(den / prime[i]);
				}
			}

			var erro = 100*((num/den) - ref)/ref;

			num = String(num).toString();
			den = String(den).toString();

			return num+"/"+den+" ("+erro.toFixed(2)+"%)";
	}})












	Object.defineProperty(WDnumber.prototype, "round", {/*arredonda casas decimais*/
		enumerable: true,
		value: function(width) {
			width = isFinite(width) ? Math.abs(parseInt(width), 10) : 0;
			return Number(this.valueOf().toFixed(width)).valueOf();
		}
	});

	Object.defineProperty(WDnumber.prototype, "pow10", {/*notação científica*/
		enumerable: true,
		value: function(width) {
			if (this.test("infinity", "zero")) return this.toString();

			width = isFinite(width) ? Math.abs(parseInt(width), 10) : undefined;

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

			ldec = isFinite(ldec) ? Math.abs(parseInt(ldec), 10) : 2;
			lint = isFinite(lint) ? Math.abs(parseInt(lint), 10) : WDnumber.nFloat(this.valueOf());

			var dec = Math.abs(this.decimal);
			dec = dec === 0 ? "" : "."+dec.toFixed(ldec).split(".")[1];

			var int = Math.abs(this.int);
			int = int.toLocaleString("en-US").split(".")[0].replace(/\,/g, "").split("");
			while (int.length < lint) int.unshift("0");
			int = int.join("");

			return (this.valueOf() < 0 ? "-" : "+") + int+dec;
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
				if (!isFinite(x)) return;
				x = parseInt(x, 10);
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
				if (!isFinite(x)) return;
				x = parseInt(x, 10);
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
				if (!isFinite(x)) return;
				x = parseInt(x, 10);
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

/* === DATE ================================================================ */


	/*Retona o correpondente método de acordo com o atalho*/
	function dateFormat(obj, char, locale) {
		switch(char) {
			case "%d": return obj.day;
			case "%D": return new WD(obj.day).fixed(2, 0);
			case "@d": return obj.days;
			case "%m": return obj.month;
			case "%M": return new WD(obj.month).fixed(2, 0);
			case "@m": return obj.width;
			case "#m": return obj.shortMonth(locale);
			case "#M": return obj.longMonth(locale);
			case "%y": return obj.year;
			case "%Y": return new WD(obj.year).fixed(4, 0);
			case "%w": return obj.week;
			case "@w": return obj.weeks;
			case "#w": return obj.shortWeek(locale);
			case "#W": return obj.longWeek(locale);
			case "%l": return obj.leap ? 366 : 365;
			case "%c": return obj.countdown;
			case "%b": return obj.wDays;
			case "%B": return obj.wDaysYear;
		}
		return "";
	};

/*...........................................................................*/

	function WDdate(input, type, value) {
		if (!(this instanceof WDdate)) return new WDdate(input, type, value);
		WDmain.call(this, input, type, value);
	}

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
				if (!isFinite(x) || x < 0) return;
				x = parseInt(x, 10);
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
				return (ref % 7 > 0 ? 1 : 0) + parseInt(ref/7);
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
				if (!isFinite(x)) return;
				x = parseInt(x, 10);
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
				if (!isFinite(x)) return;
				x = parseInt(x, 10);
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
				var sun = this.week;
				var sat = (this.today === 7 ? 1 : 0) + sun;
				var ref = this.days - (sun + sat);
				return ref <= 0 ? (ref + Math.abs(ref)) : ref;
			}
		}
		
		
		
	});

	
	/*Formata a data de acordo com a string informada*/
	Object.defineProperty(WDdate.prototype, "format", {
		enumerable: true,
		value: function(string, locale) {
			if (new WD(string).type !== "text") {
				return this.toString();
			}
			var x, chars;

			x = new WD(string);
			chars = [
				"%d", "%D", "@d", "%m", "%M", "@m", "#m", "#M", "%y",
				"%Y", "%w", "@w", "#w", "#W", "%l", "%c", "%b", "%B"
			];

			for (var i = 0; i < chars.length; i++) {
				if (x.toString().indexOf(chars[i]) >= 0) {
					x.replace(chars[i], dateFormat(this, chars[i], locale), true);
				}
			}

			return x.toString();
		}
	});

	/*Retorna o método toString e valueOf*/
	Object.defineProperties(WDdate.prototype, {
		toString: {
			value: function() {
				return this._value.toISOString();
			}		
		},
		valueOf: {
			value: function() {
				return (this._value < 0 ? -1 : 0) + parseInt(this._value/86400000);
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
				index = new WD(index).type === "number" ? WD(index).integer : 0;
				if (index >= 0 && index < this.items) {
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
				type = new WD(this.item(i)).type
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
						order = new WD([x, y]).sort().indexOf(x) > 0 ? 1 : -1;
					} else if (["number", "boolean", "date", "time"].indexOf(t) >= 0) {
						x = new WD(a).valueOf();
						y = new WD(b).valueOf();
						order = x - y >= 0 ? 1 : -1;
					} else {
						x = new WD(a).toString().trim().toUpperCase();
						y = new WD(b).toString().trim().toUpperCase();
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
				array = new WD(array).unique();
			}
			return array;
		}
	});

	/*Define método toString e valueOf*/
	Object.defineProperties(WDarray.prototype, {
		type: {
			enumerable: true,
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

	/*Define a função para os disparadores em navegadores mais antigos*/
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

/*............................................................................*/

	/*função para definir o método de implementação de eventos*/
	function wdSetHandler(event, method, elem, remove) {

		/* checando e definindo valores padrão */
		if (new WD(method).type !== "function") {
			log("handler: " + event + " callback needs to be a function..", "e");
			return false;
		}
		event  = event.toLowerCase().replace(/^\-/, "").replace(/^on/, "");
		var special = [];

		/*log de eventos*/
		if (!("on"+event in elem)) {
			log("handler: " + event + " event does not exist in " + elem.tagName.toLowerCase() + ".", "w");
		}

		/*vinculando evento*/
		if (remove === true) {
			if ("removeEventListener" in elem) {
				elem.removeEventListener(event, method, false);
			} else if ("detachEvent" in elem) {
				elem.detachEvent("on"+event, method);
			} else if (("on"+event) in elem) {
				/*função especial para navegadores mais antigos*/
				if (new WD(elem["on"+event]).type === "function" && elem["on"+event].name === "wdEventHandler") {
					special = new WD(elem["on"+event]("getMethods")).del(method);
				}
				elem["on"+event] = null;
				for (var i = 0; i < special.length; i++) {
					wdSetHandler(event, special[i], elem);
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
				/*função especial para navegadores mais antigos*/
				if (new WD(elem["on"+event]).type === "function") {
					special = elem["on"+event].name === "wdEventHandler" ? elem["on"+event]("getMethods") : [elem["on"+event]];
				}
				special = new WD(special);
				special.add(method);
				special = special.unique();
				elem["on"+event] = getEventMethod(special);
			} else {
				return false;
			}
		}

		return true;
	};

/*............................................................................*/
	/*trabalha com os elementos de formulário e os atributos name, value, type, data*/
	function AttrHTML(elem) {
		if (!(this instanceof AttrHTML)) {
				return new AttrHTML(elem);
		}
		this.elem = elem;
	}

	Object.defineProperties(AttrHTML.prototype, {
		constructor: {
			value: AttrHTML
		},
		_forms: {
			get: function() {/*retorna os parâmetros dos formulários para send, mask e load: tag > type > parameters*/
				var attr = {
					textarea: {
						textarea: {send: true,  mask: "value", load: "value"}
					},
					select: {
						select: {send: true,  mask: null, load: null}
					},
					button: {
						submit: {send: false, mask: "textContent", load: "textContent"},
						button: {send: false, mask: "textContent", load: "textContent"},
						reset:  {send: false, mask: "textContent", load: "textContent"}
					},
					input: {
						button:           {send: false, mask: "value", load: "value"},
						reset:            {send: false, mask: "value", load: "value"},
						submit:           {send: false, mask: "value", load: "value"},
						image:            {send: false, mask: null,    load: null},
						color:            {send: true,  mask: null,    load: null},
						radio:            {send: true,  mask: null,    load: null},
						checkbox:         {send: true,  mask: null,    load: null},
						date:             {send: true,  mask: null,    load: null},
						datetime:         {send: true,  mask: null,    load: null},
						"datetime-local": {send: true,  mask: null,    load: null},
						email:            {send: true,  mask: "value", load: "value"},
						text:             {send: true,  mask: "value", load: "value"},
						search:           {send: true,  mask: "value", load: "value"},
						tel:              {send: true,  mask: "value", load: "value"},
						url:              {send: true,  mask: "value", load: "value"},
						month:            {send: true,  mask: null,    load: null},
						number:           {send: true,  mask: null,    load: null},
						password:         {send: true,  mask: null,    load: null},
						range:            {send: true,  mask: null,    load: null},
						time:             {send: true,  mask: null,    load: null},
						week:             {send: true,  mask: null,    load: null},
						hidden:           {send: true,  mask: null,    load: "value"},
						file:             {send: true,  mask: null,    load: null}
					},
					option: {
						option: {send: false, mask: "textContent", load: null}
					}
				};
				return attr;
			}
		},
		tag: {
			get: function() {/*retona a tag do elemento*/
				return this.elem.tagName.toLowerCase();
			}
		},
		form: {
			get: function() {/*retorna se é elemento de formulário*/
				return this.tag in this._forms ? true : false;
			}
		},
		type: {
			get: function() {/*retorna o tipo de elemento de formulário ou tag*/
				var value, tag, attr, type;
				value = null;
				if (this.form === true) {
					tag  = this.tag;
					attr = "type" in this.elem.attributes ? this.elem.attributes.type.value.toLowerCase() : null;
					type = "type" in this.elem ? this.elem.type.toLowerCase() : null;
				 	if (attr !== null && attr in this._forms[tag]) {
						value = attr; /*atributo DIGITADO no HTML*/
					} else if (type !== null && type in this._forms[tag]) {
						value = type; /*atributo CONSIDERADO no HTML*/
					} else if (tag in this._forms[tag]) {
						value = tag;
					}
				}
				return value;
			}
		},
		name: {
			get: function() {/*devolve o valor do atributo name ou null*/
				var name = "name" in this.elem ? this.elem.name : null
				return WD(name).type === "null" ? null : name;
			}
		},
		fname: {
			get: function() {/*devolve o valor do atributo nome dos formulários apenas, ou null*/
				return (this.name !== null && this.form === true) ? this.name : null;
			}
		},
		value: {
			get: function() {/*devolve o valor do atributo value (formulários: string/lista), se existir, caso contrário retorna null*/
				var value = null;
				if (this.form === true && "value" in this.elem) {
					var type = this.type;
					value = this.elem.value;
					if (type === "radio" || type === "checkbox") {
						value = this.elem.checked === true ? value : null;
					} else if (type === "date") {
						value = new WD(value).type === "date" && value !== "%today" ? WD(value).toString() : null;
					} else if (type === "time") {
						value = new WD(value).type === "time" && value !== "%now" ? WD(value).toString() : null;
					} else if (type === "number" || type === "range") {
						value = new WD(value).type === "number" ? WD(value).valueOf() : null;
					} else if (type === "file" && "files" in this.elem) {
						value =  this.elem.files.length > 0 ? this.elem.files : null;
					} else if (type === "file") {
						value = value === "" ? null : [{name: value.split(/(\/|\\)/).reverse()[0], type: "???"}];
					} else if (type === "select") {
						value = [];
						for (var i = 0; i < this.elem.length; i++) {
							if (this.elem[i].selected === true) {
								value.push(this.elem[i].value);
							}
						}
						value = value.length === 0 ? null :  value;
					}
				}
				return value;
			}
		},
		send: {
			get: function() {/*indica se é um elemento para enviar nas requisições*/
				var value = false;
				if (this.fname !== null && this.value !== null && this.type !== null) {
					value = this._forms[this.tag][this.type].send;
				}
				return value;
			}
		},
		mask: {
			get: function() {/*devolve o atributo para aplicação da máscara, ou null se não for possível*/
				var value = "textContent" in this.elem ? "textContent" : null;
				if (this.form === true && this.type !== null) {
					value = this._forms[this.tag][this.type].mask;
				}
				return value;
			}
		},
		load: {
			get: function() {/*devolve o atributo para aplicação do load, ou null se não for possível*/
				var value = null;
				if (this.form === true && this.type !== null) {
					value = this._forms[this.tag][this.type].load;
				} else if ("innerHTML" in this.elem) {
					value = "innerHTML";
				} else if ("textContent" in this.elem) {
					value = "textContent";
				}
				return value;
			}
		},
		formData: {
			get: function() {/* devolve (array de objetos) os valores para serem enviados via requisição*/
				var form, name, value;
				form  = [];
				if (this.send === true) {
					name  = this.name;
					value = this.value;
					if (this.type === "file") {
						for (var i = 0; i < value.length; i++) {
							form.push({
								name:  i === 0 ? name : name+"_"+i,
								value: encodeURIComponent(value[i].name),
								post:  value[i].type === "???" ? value[i].name : value[i]
							});
						}
					} else if (this.type === "select") {
						for (var i = 0; i < value.length; i++) {
							form.push({
								name:  i === 0 ? name : name+"_"+i,
								value: encodeURIComponent(value[i]),
								post:  value[i]
							});
						}
					} else {
						form.push({
							name:  name,
							value: encodeURIComponent(value),
							post:  value
						});
					}
				}
				return form;
			}
		},
		dataName: {
			value: function(attr) {/*define o nome do attributo data sem o prefixo data-*/
				attr = new WD(new WD(attr).toString().replace(/^data\-/i, "")).camel;
				return WD(attr).type === "text" ? attr : undefined;
			}
		},
		dataset: {
			get: function() {/*retorna objeto dataset*/
				var data, name, value;
				if ("dataset" in this.elem) {
					data = this.elem.dataset;
				} else {
					data = {};
					for (var i = 0; i < this.elem.attributes.length; i++) {
						name  = this.elem.attributes[i].name;
						value = this.elem.attributes[i].value;
						if ((/^data\-/i).test(name) === true) {
							name = this.dataName(name);
							if (name !== undefined) {
								data[name] = value;
							}
						}
					}
				}
				return data;
			}
		},
		data: {
			value: function (attr, val) {/*define ou retorna o valor de data*/
				attr = this.dataName(attr);
				val  = new WD(val).type === "regexp" ? WD(val).toString() : val;
				if (attr === undefined) {
					return attr;			
				} else if (val === undefined) {
					return attr in this.dataset ? this.dataset[attr] : val;
				} else if ("dataset" in this.elem) {
					this.elem.dataset[attr] = val;
					return val;
				} else {
					attr = "data-"+WD(attr).dash;
					this.elem.setAttribute(attr, val);
					return val;
				}
				return undefined;
			}
		},
		del: {
			value: function(name) {/* remove o atributo data*/
				name = this.dataName(name);
				if (name  === undefined) {
					return false;
				} else if ("dataset" in this.elem) {
					this.elem.dataset[name] = null;
					delete this.elem.dataset[name];
					return true;
				} else {
					name = "data-"+WD(name).dash;
					this.data(name, null);
					this.elem.removeAttribute(name);
					return true
				}
				return false;
			}
		},
		has: {
			value: function(name) {/*verifica se o atributo data existe*/
				name = this.dataName(name);
				return name in this.dataset;
			}
		},
		_dataConvert: {
			value: function(input) {/*obter atributos pares key1{value1}...&... em objeto [{key1: value1,...}, ...]*/
				var open, name, value, list, key;
				list  = [{}];
				key   = 0;
				open  = 0;
				name  = "";
				value = "";
				input = String(input).trim().split("");
				for (var i = 0; i < input.length; i++) {/*ler todos os caracteres do atributo individualmente*/
					if (input[i] === "{" && open === 0) {/*se encontrado { pela primeira vez, abrir captura*/
						open++;
					} else if (input[i] === "}" && open === 1) {/*se encontrado } em mesmo número que {, finalizar captura*/
						open--;
						value = value.trim();
						list[key][name.trim()] = value === "null" ? null : value;/*para deletar atributo*/
						name  = "";
						value = "";
						if (input[i+1] === "&") {
							list.push({});
							key++;
							i++;
						}
					} else if (open > 0) {/*se já estiver aberta a captura, acrescenta ou diminui verificador e captura o valor do atributo*/
						if (input[i] === "{") {
							open++;
						} else if (input[i] === "}") {
							open--;
						}
						value += input[i];
					} else {/*se não se trata das outras possibilidades, captura o nome do atributo*/
						name += input[i];
					}
				}
				return list;
			}
		},
		core: {
			value: function(attr) {/*retorna o objeto de convert a partir do atributo*/
				return this.has(attr) === true ? this._dataConvert(this.data(attr)) : [{}];
			}
		}
	});

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
			if (new WD(method).type === "function") {
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
				var scripts, script, HTML;
				text = text === undefined || text === null ? "" : text;
				HTML = new AttrHTML(elem);
				elem[HTML.load] = text;
				if (HTML.load === "innerHTML") {
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
			if (input === null || new WD(input).type === "object") {
				this.run(function(elem) {
					var key, data;
					data = new AttrHTML(elem)
					if (input === null) {
						for (key in data.dataset) {
							data.del(key);
						}
					} else {
						for (var i in input) {
							key = data.dataName(i);
							if (input[i] === null) {
								data.del(key);
							} else {
								data.data(key, input[i]);
								settingProcedures(elem, key);
							}
						}
					}
					return;
				});
			}
			return this;
		}
	});

	/*Define o atributo style do elemento a partir da nomenclatura CSS*/
	Object.defineProperty(WDdom.prototype, "style", {
		enumerable: true,
		value: function(styles) {
			if (styles === null || new WD(styles).type === "object") {
				this.run(function(elem) {
					var key;
					if (styles === null) {
						while (elem.style.length > 0) {
							key = elem.style[0];
							elem.style[key] = null;
						}
					} else {
						for (var i in styles) {
							key = new WD(i).camel;
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
			if (list === null || new WD(list).type === "object") {
				this.run(function(elem) {
					var css, cls, i;
					css = new WD(elem.className);
					css = css.type === "null" ? [] : css.trim.split(" ");
					if (list === null) {
						css = [];
					} else {
						css = new WD(css);
						if (new WD(list.add).type === "text") {
							cls = new WD(list.add).trim.split(" ");
							for (i = 0; i < cls.length; i++) {
								css.add(cls[i]);
							}
						}
						if (new WD(list.del).type === "text") {
							cls = new WD(list.del).trim.split(" ");
							for (i = 0; i < cls.length; i++) {
								css.del(cls[i]);
							}
						}
						if (new WD(list.toggle).type === "text") {
							cls = new WD(list.toggle).trim.split(" ");
							for (i = 0; i < cls.length; i++) {
								css.toggle(cls[i]);
							}
						}
						css = css.valueOf();
					}
					elem.className = new WD(css).sort(true).join(" ");
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
			if (new WD(min).type !== "number" || new WD(min).number === "infinity" || min < 0) {
				min = 0;
			}

			if (text !== null && text !== undefined && new WD(text).type !== "regexp") {
				text = String(text).toString().toUpperCase();
			} else if (new WD(text).type !== "regexp") {
				text = "";
			}

			this.run(function (elem) {
				var child, content;
				child  = elem.children;
				for (var i = 0; i < child.length; i++) {
					if (!("textContent" in child[i])) {
						continue;
					}

					content = new WD(text).type === "regexp" ? child[i].textContent : child[i].textContent.toUpperCase();

					if (new WD(text).type === "regexp") {
						if (text.test(content) === true) {
							WD(child[i]).action("show");
						} else {
							WD(child[i]).action("hide");
						}
					} else if (show !== false) {
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
				var HTML = new AttrHTML(elem);
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
					case "next":
						var child, ready, array;
						child = new WD(elem.children);
						if (child.items === 0) {break;}
						ready = false;
						for (var i = -1; i >= -child.items; i--) {
							array = child.item(i).className.split(" ");
							if (new WD(array).inside("js-wd-no-display") === false) {
								WD(child.item(i+1)).action("tab");
								ready = true;
								break;
							}
						}
						if (ready !== true) {
							WD(child.item(0)).action("tab");
						}
						break;
					case "prev":
						var child, ready, array;
						child = new WD(elem.children);
						if (child.items === 0) {break;}
						ready = false;
						for (var i = 0; i < child.items; i++) {
							array = child.item(i).className.split(" ");
							if (new WD(array).inside("js-wd-no-display") === false) {
								WD(child.item(i-1)).action("tab");
								ready = true;
								break;
							}
						}
						if (ready !== true) {
							WD(child.item(-1)).action("tab");
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
							WD(elem).class({add: "js-wd-checked"});
						}
						break;
					case "uncheck":
						if ("checked" in elem) {
							elem.checked = false;
						} else {
							WD(elem).class({del: "js-wd-checked"});
						}
						break;
					case "toggle-check":
						if ("checked" in elem) {
							elem.checked = elem.checked !== true ? true : false;
						} else {
							WD(elem).class({toggle: "js-wd-checked"});
						}
						break;
					case "enable":
						if ("disabled" in elem) {
							elem.disabled = false;
						} else {
							WD(elem).class({del: "js-wd-disabled"});
						}
						break;
					case "disable":
						if ("disabled" in elem) {
							elem.disabled = true;
						} else {
							WD(elem).class({add: "js-wd-disabled"});
						}
						break;
					case "toggle-enable":
						if ("disabled" in elem) {
							elem.disabled = elem.disabled !== true ? true : false;
						} else {
							WD(elem).class({toggle: "js-wd-disabled"});
						}
						break;
					case "clean":
						elem[HTML.load] = ""
						break;
					case "del":
						if ("remove" in elem) {
							elem.remove();
						} else {
							elem.parentElement.removeChild(elem);
						}
						break;
				}
				return;
			});
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "handler", {
		enumerable: true,
		value: function (events, remove) {

			if (new WD(events).type === "object") {
				this.run(function(elem) {
					for (var event in events) {
						wdSetHandler(event, events[event], elem, remove);
					}
					return;
				});
			}
			return this;
		}
	});

	/*Constroi elementos html a partir de um array de objetos*/
	Object.defineProperty(WDdom.prototype, "repeat", {
		enumerable: true,
		value: function (json) {
			if (new WD(json).type === "array") {
				this.run(function(elem) {
					var inner, re, html, data;
					html = elem.innerHTML;
					data = new AttrHTML(elem);
					if (html.search(/\{\{.+\}\}/gi) >= 0) {
						data.data("wdRepeatModel", html);
					} else if ("wdRepeatModel" in elem.dataset) {
						html = data.data("wdRepeatModel");
					} else {
						html = null;
					}
					if (html !== null) {
						elem.innerHTML = "";
						html = new WD(html).replace("}}=\"\"", "}}");
						for (var i = 0; i < json.length; i++) {
							inner = html;
							if (new WD(json[i]).type !== "object") {
								log("repeat: Incorrect structure ignored!", "i");
								continue;
							}
							for (var c in json[i]) {
								inner = new WD(inner).replace("{{"+c+"}}", json[i][c]);
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
			page = new WD(page).type !== "number" ? 0 : new WD(page).integer;
			size = new WD(size).type !== "number" || new WD(size).abs === Infinity ? 1 : new WD(size).abs;
			this.run(function(elem) {
				var lines, amount, width, pages, start, end;
				lines  = elem.children;
				amount = lines.length;
				width  = size <= 1 ? WD(size * amount).integer : new WD(size).integer;
				pages  = new WD(amount / width).round();
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
			order = new WD(order);
			col   = new WD(col);
			this.run(function(elem) {
				var array, asort, childs;
				array = new WD(elem.children).valueOf();
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
					asort = new WD(array).sort();
					/*redefinindo os filhos*/
					for (var k = 0; k < asort.length; k++) {
						if (asort[k].parentElement !== elem) {
							asort[k] = asort[k].parentElement;
						}
					}
				/*caso contrário, ordenar só os filhos*/
				} else {
					asort = new WD(array).sort();
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
			} else if (new WD(css).type === "text") {
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

	/*Retorna uma matriz com a captura dos dados em HTML*/
	Object.defineProperty(WDdom.prototype, "matrix", {
		enumerable: true,
		value: function() {
			var x = [];
			this.run(function(elem) {
				var table, head, body, value;
				if (elem.tagName.toLowerCase() === "table") {
					head  = elem.tHead.children[0].children;
					body  = elem.tBodies[0].children;
					table = {title: "", header: [], matrix:  []};

					table.title = elem.caption.textContent;					

					for (var h = 0; h < head.length; h++) {
						table.header.push(head[h].textContent);
					}

					for (var r = 0; r < body.length; r++) {
						table.matrix.push([]);
						for (var c = 0; c < body[r].children.length; c++) {
							value = new WD(body[r].children[c].textContent);
							table.matrix[r].push(
								(value.type === "number" ? value.valueOf() : value.toString())
							);
						}
					}
					x.push(table);
				}
				return;
			});
			return x;
		}
	});

	/*Obtem a serialização de formulário (não disponível ao usuário)*/
	Object.defineProperty(WDdom.prototype, "_form", {
		get: function() {
			var x = [];
			this.run(function(elem) {
				var data = new AttrHTML(elem).formData;
				for (var i = 0; i < data.length; i++) {
					x.push(data[i].name+"="+data[i].value);
				}
				return;
			});
			return x.join("&");
		}
	});

	/*Obtem a serialização de formulário com FromData (não disponível ao usuário)*/
	Object.defineProperty(WDdom.prototype, "_Form", {
		get: function() {
			if (!("FormData" in window)) {
				return this._form;
			}
			var x = new FormData();
			this.run(function(elem) {
				var data = AttrHTML(elem).formData;
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
			enumerable: true,
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
			value: function(index) {
				var x;
				x = undefined;
				index = new WD(index).type === "number" ? WD(index).integer : 0;
				if (index >= 0 && index < this.items) {
					x = this.valueOf()[index];
				} else if (index < 0 && -index <= this.items) {
					x = this.valueOf()[this.items + index];
				}
				return x;
			}
		}
	});

/* === JS ATTRIBUTES ======================================================= */

	/*define as mensagens da biblioteca wdConfig*/
	function data_wdConfig() {
		var data, value, local, attr;
		attr = {
			modalMsg: {
				en: "Request in progress...",
				pt: "Requisição em progresso...",
				es: "Solicitud en curso...",
				it: "Richiesta in corso...",
				ru: "Запрос выполняется...",
				du: "Anfrage in Bearbeitung...",
				fr: "Demande en cours.",
			},
			fileTitle: {
				en: "Archives: occurrences",
				pt: "Arquivos: ocorrências",
				es: "Archivos: ocurrencias",
				it: "Archivi: occorrenze",
				ru: "Архивы: случаи",
				du: "Archiv: Vorkommen",
				fr: "Archives: occurrences",
			},
			fileSize: {
				en: "Individual size exceeded",
				pt: "Tamanho individual excedido",
				es: "Se superó el tamaño individual",
				it: "Dimensione individuale superata",
				ru: "Превышен индивидуальный размер",
				du: "Einzelgröße überschritten",
				fr: "Taille individuelle dépassée",
			},
			fileTotal: {
				en: "Total size exceeded",
				pt: "Tamanho total excedido",
				es: "Tamaño total excedido",
				it: "Dimensioni totali superate",
				ru: "Общий размер превышен",
				du: "Gesamtgröße überschritten",
				fr: "Taille totale dépassée",
			},
			fileChar: {
				en: "Characters not allowed",
				pt: "Caracteres não permitidos",
				es: "Caracteres no permitidos",
				it: "Caratteri non ammessi",
				ru: "Символы не разрешены",
				du: "Zeichen nicht erlaubt",
				fr: "Caractères non autorisés",
			},
			fileLen: {
				en: "Number of files exceeded",
				pt: "Número de arquivos excedido",
				es: "Se superó el número de archivos",
				it: "Numero di file superato",
				ru: "Превышено количество файлов",
				du: "Anzahl der Dateien überschritten",
				fr: "Nombre de fichiers dépassé",
			}
		};

		local = lang().substr(0, 2).toLowerCase();
		wdConfig = {modalFg: "#FFFFFF", modalBg: "rgba(0, 0, 0, 0.8)"};
		for (var j in attr) {
			wdConfig[j] = local in attr[j] ? attr[j][local] : attr[j]["en"];
		}

		data  = new AttrHTML(document.body);
		value = data.core("wdConfig")[0];
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
		data = new AttrHTML(e);
		if (data.has("wdLoad") ===  true) {
			value  = data.core("wdLoad")[0];
			method = "post" in value ? "post" : "get";
			file   = value[method];
			pack   = "$" in value ? $(value["$"]) : null;/*se for informado um formulário, seus dados serão enviados à requisição*/
			target = new WD(e);
			target.data({wdLoad: null});
			WD(pack).send(file, function(x) {
				if (x.closed === true) {
					target.load(x.text === null ? "" : x.text);
					if (x.status !== "DONE") {
						log("wdLoad: Request failed!", "e");
					}
				}
			}, method);
		}
		return;
	};

	/*Constroe html a partir de um arquivo json data-wd-repeat=post{file}|get{file}${}*/
	function data_wdRepeat(e) {
		var value, method, file, pack, target, data;
		data = new AttrHTML(e);
		if (data.has("wdRepeat")) {
			value  = data.core("wdRepeat")[0];
			method = "post" in value ? "post" : "get";
			file   = value[method];
			pack   = "$" in value ? $(value["$"]) : null;/*se for informado um formulário, seus dados serão enviados à requisição*/
			target = new WD(e);
			target.data({wdRepeat: null});

			WD(pack).send(file, function(x) {
				if (x.closed === true) {
					if (x.json !== null) {
						target.repeat(x.json);
					} else if (x.csv !== null) {
						target.repeat(x.csv);
					} else {
						target.repeat([]);
					}
					if (x.status !== "DONE") {
						log("wdRepeat: Request failed!", "e");
					}
				}
			}, method);
		}
		return;
	};

	/*Faz requisição a um arquivo externo data-wd-send=post|get{file}${CSS selector}callback{function()}*/
	function data_wdSend(e) {
		var value, method, file, pack, callback, data;
		data = new AttrHTML(e);
		if (data.has("wdSend")) {
			value    = data.core("wdSend");
			for (var i = 0; i < value.length; i++) {
				method   = "post" in value[i] ? "post" : "get";
				file     = value[i][method]; /*method: ver linha anterior*/
				pack     = "$" in value[i] ? $(value[i]["$"]) : null;
				callback = window[value[i]["callback"]];
				WD(pack).send(file, callback, method);
			}
		}			
		return;
	};

	/*Ordena elementos filhos data-wd-sort="number"*/
	function data_wdSort(e) {
		var order, data;
		data = new AttrHTML(e);
		if (data.has("wdSort")) {
			order = new WD(data.data("wdSort")).valueOf();
			WD(e).sort(order).data({wdSort: null});
		}
		return;
	};

	/*Filtra elementos filhos data-wd-filter=show|hide{min}${css}&...*/
	function data_wdFilter(e) {
		var value, text, data, show, min, target;

		data = new AttrHTML(e);
		if (data.has("wdFilter")) {

			text = data.form ===  true ? data.value : e.textContent;

			/*verificar se é uma expressão regular */
			if (text[0] === "/" && text.length > 3) {
				if (text[text.length - 1] === "/") {
					text = new RegExp(text.substr(1, (text.length - 2)));
				} else if (text.substr((text.length - 2), 2) === "/i") {
					text = new RegExp(text.substr(1, (text.length - 3)), "i");
				}
			}

			value = data.core("wdFilter");
			for (var i = 0; i < value.length; i++) {
				show   = "hide" in value[i] ? false : true;
				min    = "hide" in value[i] ? value[i].hide : value[i].show;
				target = "$"    in value[i] ? $(value[i]["$"]) : null;
				if (new WD(target).type === "dom") {
					WD(target).filter(text, min, show);
				}
			}
		}
		return;
	};

	/*Define máscara do elemento data-wd-mask="StringMask"*/
	function data_wdMask(e) {
		var value, re, mask, shortcutMask, HTML;
		shortcutMask = {
			"DDMMYYYY": /^(0[1-9]|[12][0-9]|3[0-1])\.(0[1-9]|1[0-2])\.([0-9]{4})$/,
			"MMDDYYYY": /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[0-1])\/([0-9]{4})$/,
			"YYYYMMDD": /^([0-9]{4})\-(0[1-9]|1[0-2])\-(0[1-9]|[12][0-9]|3[0-1])$/,
			"HHMMSS": /^([01][0-9]|2[0-4])\:([0-5][0-9])\:([0-5][0-9])$/,
			"HHMM": /^([01][0-9]|2[0-4])\h([0-5][0-9])$/,
			"AMPM": /^(0[1-9]|1[0-2])\:([0-5][0-9][apAP])m$/,
		};
		HTML = new AttrHTML(e);
		if (HTML.has("wdMask") && HTML.mask !== null) {
			value = e[HTML.mask];
			if (HTML.data("wdMask") in shortcutMask) {
				re = shortcutMask[HTML.data("wdMask")];
			} else {
				re = new RegExp(HTML.data("wdMask"));
			}
			mask = new WD(re).mask(value);
			if (mask !== false) {
				e[HTML.mask] = mask;
			}
			if (HTML.mask === "value") {
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
		data = new AttrHTML(e);
		if (data.has("wdPage")) {
			attr = data.core("wdPage")[0];
			page = attr.page;
			size = attr.size;
			WD(e).page(page, size).data({wdPage: null});
		}
		return;
	};

	/*Define seu valor em outro elemento*/
	function data_wdSet(e) {
		var data, core, attr, target;
		data = new AttrHTML(e);
		if (data.has("wdSet")) {
			core = data.core("wdSet");
			for (var c = 0; c < core.length; c++) {
				attr   = core[c];
				target = new WD($(attr["$"])).type === "dom" ? WD($(attr["$"])) : new WD(e);
				target.run(function(x) {
					if ("text"  in attr) {x.textContent  = attr["text"];}
					if ("value" in attr) {x.value        = attr["value"];}
					if ("class" in attr) {x.className    = attr["class"];}
					if ("join"  in attr) {x.textContent += attr["join"];}
					if ("acss"  in attr) {WD(x).class({add: attr["acss"]});}
					if ("dcss"  in attr) {WD(x).class({del: attr["dcss"]});}
					if ("tcss"  in attr) {WD(x).class({toggle: attr["tcss"]});}
					return;
				});
			}
		}
		return;
	};

	/*Executa o método click() ao elemento após o load data-wd-click=""*/
	function data_wdClick(e) {
		var data;
		data = new AttrHTML(e);
		if (data.has("wdClick")) {
			if ("click" in e) {e.click();}
			WD(e).data({wdClick: null});
		}
		return;
	};

	/*Executa uma ação ao alvo após o click data-wd-action=action1{css1}action2{css2}*/
	function data_wdAction(e) {
		var value, data, target;
		data = new AttrHTML(e);
		if (data.has("wdAction")) {
			value = data.core("wdAction")[0];
			for (var action in value) {
				target = new WD($(value[action]));
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
		data = new AttrHTML(e);
		if (data.has("wdData")) {
			value = data.core("wdData");
			for (var i = 0; i < value.length; i++) {
				/* se o alvo não for um dom, será aplicado ao próprio elemento*/
				target = new WD($(value[i]["$"])).type === "dom" ? WD($(value[i]["$"])) : new WD(e);
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
		if (e.parentElement !== null && new WD(e.parentElement.tagName).title === "Nav") {
			WD(e.parentElement.children).class({del: "wd-active"});
			if (["A", "SPAN"].indexOf(e.tagName.toUpperCase()) >= 0) {
				WD(e).class({add: "wd-active"});
			}
		}
		return;
	};

	/*executa funções para edição de texto data-wd-edit=comando{especificação}&...*/
	function data_wdEdit(e) {
		var data, value;
		/*Ferramenta complicada*/
		if (!("execCommand" in document)) {
			log("This browser is not supported.", "e")
			return;
		}
		data = new AttrHTML(e);
		if (data.has("wdEdit")) {
			value = data.core("wdEdit")[0];
			for (var i in value) {
				var cmd, arg;
				cmd = i;
				arg = value[i] === "" ? undefined : value[i];
				switch(i) {
					case "createLink":
						arg = prompt("Link:");
						cmd = arg === "" || arg === null ? "unlink" : i;
						break;
					case "insertImage":
						arg = prompt("Link:");
						break;
				}
				document.execCommand(cmd, false, arg);
			}
		}
		return;
	};

	/*Ordena as colunas de uma tabela data-wd-sort-col=""*/
	function data_wdSortCol(e) {
		var order, thead, heads, bodies, data;
		data = new AttrHTML(e);
		if (data.has("wdSortCol") && new WD(e.parentElement.parentElement.tagName).title === "Thead") {
			order  = data.data("wdSortCol") === "+1" ? -1 : 1;
			thead  = e.parentElement.parentElement;
			heads  = e.parentElement.children;
			bodies = thead.parentElement.tBodies;
			WD(heads).run(function(x) {
				var ndata;
				ndata = new AttrHTML(x);
				if (ndata.has("wdSortCol")) {
					ndata.data("wdSortCol", "");
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
		data = new AttrHTML(e);
		if (data.has("wdDevice")) {
			value   = data.core("wdDevice")[0];
			desktop = "desktop" in value ? value.desktop : "";
			mobile  = "mobile"  in value ? value.mobile  : "";
			tabvar  = "tablet"  in value ? value.tabvar  : "";
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

	/*Define um carrossel de elementos data-wd-slide=tempo*/
	function data_wdSlide(e) {
		var data, time;
		data = new AttrHTML(e);
		if (data.has("wdSlide") && !data.has("wdSlideRun")) {
			time = new WD(data.data("wdSlide"));
			if (time.type === "number" && time.number === "integer") {
				time = time.valueOf() <= 0 ? 1000 : time.valueOf();
			} else {
				time = 1000;
			}
			WD(e).action("next");
			data.data("wdSlideRun", "");
			window.setTimeout(function() {
				data.del("wdSlideRun");
				data_wdSlide(e);
				return;
			}, time);
		} else {
			data.del("wdSlideRun");
		}
		return;
	};

	/*TODO experimental: Define um link de compartilhamento de redes sociais data-wd-shared=rede*/
	function data_wdShared(e) {
		var social, data, link, url, title;
		data = new AttrHTML(e);
		if (data.has("wdShared")) {
			url    = encodeURIComponent(document.URL);
			title  = encodeURIComponent(document.title);
			social = new WD(data.data("wdShared")).toString().toLowerCase();
			switch (social) {
				case "facebook": 
					link = "https://www.facebook.com/sharer.php?u="+url;
					break;
				case "twitter":
					link = "https://twitter.com/share?url="+url+"&text="+title+"&via=&hashtags=";
					break;
				case "linkedin":
					link = "https://www.linkedin.com/shareArticle?url="+url+"&title="+title;
					break;
				case "reddit":
					link = "https://reddit.com/submit?url="+url+"&title="+title;
					break;
				case "evernote":
					link = "https://www.evernote.com/clip.action?url="+url+"&title="+title;
					break;
				default:
					link = null;
			}
			if (link !== null) {window.open(link);}
		}
		return;
	};

	/*analisa as informações do arquivo data-wd-file=size{value}type{}char{}len{}total{}*/
	function data_wdFile(e) {
		var tag, type, files, value, data, info, error, name, msg;
		data_wdConfig();
		data  = new AttrHTML(e);
		tag   = e.tagName.toLowerCase();
		type  = e.type.toLowerCase();
		files = "files" in e ? e.files : [];
		value = data.core("wdFile")[0];
		msg   = [];
		error = {
			fileSize:  [],
			fileChar:  [],
			fileLen:   0,
			fileTotal: 0
		};

		if (data.has("wdFile") && tag === "input" && type === "file") {

			for (var i = 0; i < files.length; i++) {

				error.fileTotal += "size" in files[i] ? files[i].size : 0;
				error.fileLen++;
				name = "name" in files[i] ? files[i].name : "";

				/* verificar tamanho individual do arquivo*/
				info = new WD(value["size"]);
				if (info.type === "number" && "size" in files[i]) {
					if (files[i].size > info.valueOf()) {
						error.fileSize.push(name);
					}
				}

				/* verificar caracteres do arquivo */
				info = new WD(value["char"]);
				if (info.type === "text" && "name" in files[i]) {
					info = new RegExp("["+info.toString()+"]");
					if (files[i].name.search(info) >= 0) {
						error.fileChar.push(name);
					}
				}
			}

			/* verificar quantidade de arquivos */
			info = new WD(value["len"]);
			if (info.type === "number" && "length" in files) {
				if (error.fileLen > info.round()) {
					msg.push(wdConfig.fileLen+" &larr; "+info.round());
				}
			}

			/* verificar tamanho total dos arquivos */
			info = new WD(value["total"]);
			if (info.type === "number") {
				if (error.fileTotal > info.round()) {
					msg.push(wdConfig.fileTotal+" &larr; "+calcByte(info));
				}
			}

			/*verificando tamanho dos arquivos*/
			info = new WD(value["size"]);
			if (error.fileSize.length > 0) {
				msg.push(wdConfig.fileSize+" &larr; "+calcByte(info));
			}

			/*verificando caracteres do arquivos*/
			info = new WD(value["char"]);
			if (error.fileChar.length > 0) {
				msg.push(wdConfig.fileChar+" &larr; "+info);
			}

			/* apagando arquivos e exibindo erro */
			if (msg.length > 1) {
				e.value = null;
				WD("<h3><center>"+wdConfig.fileTitle+"</center></h3><ul><li>"+msg.join("</li><li>")+"</li></ul>").message(10000);
				WD(e).class({add: "js-wd-mask-error"});
			} else {
				WD(e).class({del: "js-wd-mask-error"});
			}
		}
		return;
	};

/* === JS ENGINE =========================================================== */

	/*Obtém as dimensões de body e do filho com display = fixed, se houver para manipular o posicionamento da página*/
	function fixedHeader() {
		var conf, css, stl, obj, attr;

		/*definindo variáveis para captura de dados*/
		conf = {body: {}, head: {}, foot: {}};
		css  = {body: "body", head: "body > header", foot:"body > footer"};
		stl  = ["height", "position", "top", "bottom", "margin-top", "margin-bottom"];

		/*alimentando variável conf*/
		for (var i in css) {
			obj = new WD($(css[i]));
			for (var j = 0; j < stl.length; j++) {
				conf[i][stl[j]] = obj.items > 0 ? obj.getStyle(stl[j])[0].toLowerCase() : "";
				if (stl[j] !== "position") {
					attr = new WD(conf[i][stl[j]].replace(/[^0-9\.]/g, ""));
					conf[i][stl[j]] = attr.type !== "number" ? 0 : attr.valueOf();
				}
			}
			conf[i].hTop    = conf[i].height + conf[i].top    + conf[i]["margin-bottom"];
			conf[i].hBottom = conf[i].height + conf[i].bottom + conf[i]["margin-top"];
		}

		/* -- colocar margins em body se houver elementos fixados -- */
		conf.margin = function() {
			if (this.head.position === "fixed" && this.body["margin-top"] !== this.head.hTop) {
				document.body.style.marginTop = this.head.hTop+"px";
			}
			if (this.foot.position === "fixed" && this.body["margin-bottom"] !== this.foot.hBottom) {
				document.body.style.marginBottom = this.foot.hBottom+"px";
			}
			return;
		}

		/* -- movimentando a tela do hash -- */
		conf.hash = function() {
			this.margin();
			var hash = new WD($(window.location.hash));
			if (this.head.position === "fixed" && hash.type === "dom" && hash.items > 0) {
				window.scrollTo(0, hash.item().offsetTop - this.head.hTop);
			}
			return;
		}
		return conf;
	};

	/*Adequar margens quando há elementos fixados no topo ou na base e mudar a posição quando mudar o hash*/
	function hashProcedures() {
		fixedHeader().hash();
		return;
	};

	/*Procedimentos para carregar objetos externos*/
	function loadingProcedures() {
		var attr = new WD($("[data-wd-load], [data-wd-repeat]"));
		if (deviceController === null || deviceController === undefined) {
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
		WD($("[data-wd-slide]")).run(data_wdSlide);
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
			data_wdSend(elem);
			data_wdSet(elem);
			data_wdShared(elem);
			data_wdEdit(elem);
			elem = elem.parentElement;/*efeito bolha*/
		}
		return;
	};

	/*Procedimento a executar após acionamento do teclado*/
	function keyboardProcedures(ev) {
		var data = new AttrHTML(ev.target);
		if (data.form !== true || !("oninput" in window)) {
			data_wdFilter(ev.target);
			data_wdMask(ev.target);
		}
		return;
	};

	/*Procedimento a executar após acionamento do teclado em formulários*/
	function inputProcedures(ev) {
		data_wdFilter(ev.target);
		data_wdMask(ev.target);
		return;
	};

	/*Procedimento para definir o dispositivo pelo tamanho da tela*/
	function scalingProcedures(ev) {
		var device, width, height;
		width  = window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth;
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
			if (new WD(ev).type !== "undefined") {
				stylingProcedures();
			}
		}
		fixedHeader().margin();
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
			case "wdSlide":   data_wdSlide(e);     break;
		};
		return;
	};

	/*Definindo e incluindo os estilos utilizados pelo javascript na tag head*/
	function headScriptProcedures(ev) {
		var style;
		style = document.createElement("STYLE");
		style.textContent = 
" @keyframes js-wd-fade  {from {opacity: 0;  } to {opacity: 1;}}" +
" @keyframes js-wd-fade2 {from {opacity: 0.4;} to {opacity: 1;}}" +
" .js-wd-no-display     {display: none !important;}" +
" .js-wd-mask-error     {color: #663399 !important; background-color: #e8e0f0 !important;}" +
" .js-wd-checked:before {content: \"\\2713 \"}" +
" .js-wd-disabled       {pointer-events: none; color: #ccc; opacity: 0.8; cursor: default !important;}" +
" *[data-wd-action],   *[data-wd-send] {cursor: pointer;}" +
" *[data-wd-sort-col], *[data-wd-data] {cursor: pointer;}" +
" *[data-wd-set]                       {cursor: pointer;}" +
" *[data-wd-sort-col]:before {content: \"\\2195 \";}" +
" *[data-wd-sort-col=\"-1\"]:before {content: \"\\2191 \";}" +
" *[data-wd-sort-col=\"+1\"]:before {content: \"\\2193 \";}" +
" *[data-wd-repeat] > *, *[data-wd-load] > * {visibility: hidden;}" +
" *[data-wd-slide] > * {animation: js-wd-fade2 1s;}" +
" .js-wd-box-message {color: #333333; background-color: #f8f8ff; border-style: solid; border-width: 1px;}" +
" /*TODO Experimental*/" +
" *[data-wd-shared] {cursor: pointer; display: inline-block; width: 1em; height: 1em;}" +
" *[data-wd-shared] {background-repeat: no-repeat; background-size: cover;}" +
" *[data-wd-shared=\"facebook\"] {background-image: url('https://static.xx.fbcdn.net/rsrc.php/yo/r/iRmz9lCMBD2.ico');}" +
" *[data-wd-shared=\"twitter\"]  {background-image: url('https://abs.twimg.com/favicons/twitter.ico');}" +
" *[data-wd-shared=\"linkedin\"] {background-image: url('https://static-exp1.licdn.com/scds/common/u/images/logos/favicons/v1/favicon.ico');}" +
" *[data-wd-shared=\"reddit\"]   {background-image: url('https://www.redditinc.com/assets/images/favicons/favicon-32x32.png');}" +
" *[data-wd-shared=\"evernote\"] {background-image: url('https://www.evernote.com/favicon.ico?v2');}";
		document.head.appendChild(style);
		
		if (new WD($("link[rel=icon]")).items === 0) {
			var favicon = document.createElement("link");
			favicon.rel = "icon";
			favicon.href = "https://wdonadelli.github.io/wd/image/favicon.ico";
			document.head.appendChild(favicon);
		}
		return;
	};

	/*Definindo eventos*/
	WD(window).handler({
		load: headScriptProcedures
	}).handler({
		load: loadingProcedures
	}).handler({
		load: hashProcedures
	}).handler({
		load: data_wdConfig,
		resize: scalingProcedures,
		hashchange: hashProcedures
	});

	WD(document).handler({
		click:  clickProcedures,
		keyup:  keyboardProcedures,
		input:  inputProcedures,
		change: changeProcedures
	});

/* === END ================================================================= */

//	return WD;

//}());

/*Atalho para o uso do método querySelectorAll em wdDom*/
function wd$(selector, root) {
	return wd(wd().$(selector, root));
}
/* ========================================================================= */
