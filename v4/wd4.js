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

/*............................................................................*/

	function WDbox(input) {
		if (!(this instanceof WDbox)) return new WDbox(input);
		Object.defineProperty(this, "_input", {value: input});
	}

	Object.defineProperty(WDbox.prototype, "constructor", {value: WDbox});

	WDbox.version = "v4.0.0 2021-10-01";

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

	WDbox.int = function(n) {
		var val = new Number(n).valueOf();
		return val < 0 ? Math.ceil(n) : Math.floor(n);
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
		var qall = "$$" in obj && obj["$$"].trim() !== "" ? WDbox.$$(obj["$$"]) : null;
		var qone = "$"  in obj && obj["$"].trim()  !== "" ? WDbox.$(obj["$"])   : null;
		if (qall !== null && qall.length > 0) return qall;
		return qone;
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

	WDbox.posts = 	{
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
		if ((/Infinity$/).test(this._input)) return false;

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
		display:  "block", width: "100%", height: "100%", padding: "0.1em",
		position: "fixed", top: "0", right: "0", bottom: "0",	left: "0",
		zIndex: "999999",	cursor: "progress",
		opacity: "0.4", fontSize: "4em", backgroundColor: "#000000"
	};

	WDrequest.setStyle = function() { /*define o estilo padrão se ainda não definido*/
		if (this.styled) return;
		this.window.textContent = "\u23F1";
		for (var i in this.style) this.window.style[i] = this.style[i];
		this.styled = true;
		return;
	}

	WDrequest.open = function() {
		this.setStyle();
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

			var n = 100*this._progress;
			//FIXME: descobrir como se faz isso para rodar o progresso na tela
			document.title = n;

/*			Array.apply(null, Array(4)).forEach(function (undef, index) {
				setTimeout(function() {
					WDrequest.window.textContent = n.toFixed(0)+"%";
					WDrequest.window.style.color = "white";
					WDrequest.window.style.opacity = "1";
				}
				, 0);
			});*/

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
		textAlign: "inherit", border: "1px solid", borderRadius: "0.1em",
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
		this.window.insertAdjacentElement("afterbegin", box);
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
		version: {get:   function()     {return WDbox.version;}},
		$:  {value: function(css, root) {return WD(WDbox.$(css, root));}},
		$$: {value: function(css, root) {return WD(WDbox.$$(css, root));}}
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

	Object.defineProperties(WDtext, {
		mask: {
			value: function(input, check, callback) {
			check = String(check).toString();
			var code  = {"#": "[0-9]", "@": "[a-zA-ZÀ-ÿ]", "*": "."};
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
				if (!isFinite(x)) return 0;
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
			width = isFinite(width) ? Math.abs(WDbox.int(width)) : 0;
			return Number(this.valueOf().toFixed(width)).valueOf();
		}
	});

	Object.defineProperty(WDnumber.prototype, "pow10", {/*notação científica*/
		enumerable: true,
		value: function(width) {
			if (this.test("infinity", "zero")) return this.toString();

			width = isFinite(width) ? Math.abs(WDbox.int(width)) : undefined;

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

			ldec = isFinite(ldec) ? Math.abs(WDbox.int(ldec)) : 2;
			lint = isFinite(lint) ? Math.abs(WDbox.int(lint)) : WDnumber.nFloat(this.valueOf());

			var dec = Math.abs(this.decimal);
			dec = dec === 0 ? "" : "."+dec.toFixed(ldec).split(".")[1];

			var int = Math.abs(this.int);
			int = int.toLocaleString("en-US").split(".")[0].replace(/\,/g, "").split("");
			while (int.length < lint) int.unshift("0");
			int = int.join("");

			return (this.valueOf() < 0 ? "-" : "+") + int+dec;
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
				if (!isFinite(x)) return;
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
				if (!isFinite(x)) return;
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
				if (!isFinite(x)) return;
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
				if (!isFinite(x) || x < 0) return;
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
				if (!isFinite(x)) return;
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
				if (!isFinite(x)) return;
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

	Object.defineProperties(WDarray, {
		setArray: {
			value: function(list1, list2) {
				var loop = list1.length;
				if (list2 !== undefined && list2.length < loop) loop = list2.length;
				var array1 = [];
				var array2 = list2 === undefined ? null : [];
				for (var i = 0; i < loop; i++) {
					var check1 = WDtype(list1[i]);
					var check2 = array2 === null ? null : WDtype(list2[i]);
					if (check1.type !== "number" || !isFinite(check1.value)) continue;
					if (array2 !== null) {
						if (check2.type !== "number" || !isFinite(check2.value)) continue;
						array2.push(check2.value);
					}
					array1.push(check1.value);
				}
				if (array1.length === 0) return {array1: null, array2: null};
				return {array1: array1, array2: array2};
			}
		},
		sum: {
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
		product: {
			value: function(list, exp) {
				var value = 1;
				for (var i = 0; i < list.length; i++) {
					if (exp < 0 && list[i] === 0) return null; /*divisão por zero*/
					var val = Math.pow(list[i], exp);
					value = value * val;
				}
				return value;
			}
		},
		deviation: {
			value: function(list, ref, exp) {
				var value = 0;
				var check = new WDtype(ref);
				for (var i = 0; i < list.length; i++) {
					var diff = Math.abs((check.type === "array" ? ref[i] : ref) - list[i]);
					if (exp < 0 && diff === 0) return null; /*divisão por zero*/
					var val = Math.pow(diff, exp);
					value += val;
				}
				return value;
			}
		},
		setY: {
			value: function(x, f) {
				var data = [];
				for (var i = 0; i < x.length; i++) data.push(f(x[i]));
				return data;
			}
		},
		stdDev: {
			value: function(list, ref) {
				if (ref === null) return null;
				var data = this.deviation(list, ref, 2);
				return data ===  null ? data : Math.sqrt(data/list.length);
			}
		},
		leastSquares: {
			value: function(x, y) {
				var X  = this.sum(x, 1);
				var Y  = this.sum(y, 1);
				var X2 = this.sum(x, 2);
				var XY = this.sum(x, 1, y, 1);
				if ([X, Y, XY, X2].indexOf(null) >= 0) return null;
				var N    = y.length;
				var data = {};
				data.a   = ((N * XY) - (X * Y)) / ((N * X2) - (X * X));
				data.b   = ((Y) - (X * data.a)) / (N);
				return data;
			}
		}
	});

	WDarray.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDarray}
	});

	Object.defineProperty(WDarray.prototype, "item", {/*retorna o índice especificado*/
		enumerable: true,
		value: function(i) {
			if (!isFinite(i)) return this._value.length;
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
			var arrays = {};

			for (var i = 0; i < this._value.length; i++) {
				var type = new WDtype(this._value[i]).type;
				if (!(type in arrays)) arrays[type] = [];
				arrays[type].push(this._value[i]);
			}

			for (var type in arrays) {
				arrays[type].sort(function(a, b) {
					if (type === "dom") {
						var x = a.textContent;
						var y = b.textContent;
						var h = WD([x,y]).sort();
						return h.indexOf(x) > 0 ? 1 : -1;
					}
					if (type === "text") {
						var x = new WD(a).format("clear", "upper");
						var y = new WD(b).format("clear", "upper");
						return x > y;
					}
					if (["number", "boolean", "date", "time"].indexOf(type) >= 0) {
						var x = new WDtype(a).value;
						var y = new WDtype(b).value;
						return x - y >= 0 ? 1 : -1;
					}
					return x > y;					
				});
			}

			var order = [
				"number", "time", "date", "text", "boolean", "null",
				"dom", "array", "object", "function", "regexp", "undefined"
			];
			var sort = []

			for (var i = 0; i < order.length; i++) {
				if (!(order[i] in arrays)) continue;
				var array = arrays[order[i]];
				for (var j = 0; j < array.length; j++) sort.push(array[j]);
			}
			this._value = sort;
			
			return this.valueOf();
		}
	});

	Object.defineProperty(WDarray.prototype, "matrix", {/*obtem a coluna de uma matriz*/
		enumerable: true,
		value: function(col) {
			col = isFinite(col) ? WDbox.int(Math.abs(col)) : 0;
			var data = [];
			for (var i = 0; i < this._value.length; i++) {
				var check = WDtype(this._value[i]);
				if (check.type !== "array") {
					data.push(col === 0 ? check.input : undefined);
				} else {
					data.push(check.input[col]);
				}
			}
			return data;
		}
	});

	Object.defineProperty(WDarray.prototype, "data", {/*dados estatísticos*/
		enumerable: true,
		get: function() {
			var list = WDarray.setArray(this.sort()).array1;
			if (list === null) return null;
			var len  = list.length;
			var val  = null;
			var data = {};

			/*soma e média, mediana, mínimo, máximo*/
			val = WDarray.sum(list, 1);
			data.sum     = {value: val};
			data.average = {value: val === null ? null : val/len};
			data.median  = {value: len % 2 !== 0 ? list[(len-1)/2] : (list[len/2]+list[(len/2)-1])/2};
			data.min     = {value: list[0]};
			data.max     = {value: list.reverse()[0]};

			/*média geométrica*/
			val = WDarray.product(list, 1);
			data.geometric = {value: val === null ? null : Math.pow(Math.abs(val), 1/len)};

			/*média harmônica*/
			val = WDarray.sum(list, -1);
			data.harmonic = {value: val === null ? null : len/val};

			/*desvio padrão*/
			data.sum.deviation       = WDarray.stdDev(list, data.sum.value);
			data.average.deviation   = WDarray.stdDev(list, data.average.value);
			data.median.deviation    = WDarray.stdDev(list, data.median.value);
			data.min.deviation       = WDarray.stdDev(list, data.min.value);
			data.max.deviation       = WDarray.stdDev(list, data.max.value);
			data.geometric.deviation = WDarray.stdDev(list, data.geometric.value);
			data.harmonic.deviation  = WDarray.stdDev(list, data.harmonic.value);

			return data;
		}
	});

	Object.defineProperty(WDarray.prototype, "regression", {/*regressão linear*/
		enumerable: true,
		value: function(input) {
			var check = WDtype(input);
			if (check.type !== "array") return null;
			var matrix = WDarray.setArray(this._value, input);
			var y = matrix.array1;
			var x = matrix.array2;
			if (x === null || y === null) return null;
			var data = {linear: null, geometric: null, exponential: null};
			var val  = null;
			var refx = [];
			var refy = [];

			/*regressão linear*/
			val = WDarray.leastSquares(x, y);
			if (val !== null) {
				data.linear = {};
				data.linear.e = "y = a x + b";
				data.linear.a = val.a;
				data.linear.b = val.b;
				data.linear.x = x;
				data.linear.y = y;
				data.linear.f = function(x) {return data.linear.a*x+data.linear.b;};
				data.linear.Y = WDarray.setY(x, data.linear.f);
				data.linear.d = WDarray.stdDev(y, data.linear.Y);
			}

			/*regressão exponencial (Y>=0)*/
			refy = WDarray.setY(y, Math.log);
			if (refy === null) {val = null;} else {
				var matrix2 = WDarray.setArray(refy, x);
				var y2 = matrix2.array1;
				var x2 = matrix2.array2;
				if (x2 === null || y2 === null) {val = null} else {
					val = WDarray.leastSquares(x2, y2);
				}
			}
			if (val !== null) {
				data.exponential = {};
				data.exponential.e = "y = a exp(b x)";
				data.exponential.a = Math.exp(val.b);
				data.exponential.b = val.a;
				data.exponential.x = x;
				data.exponential.y = y;
				data.exponential.f = function(x) {return data.exponential.a*Math.exp(data.exponential.b*x);},
				data.exponential.Y = WDarray.setY(x, data.exponential.f);
				data.exponential.d = WDarray.stdDev(y, data.exponential.Y);
			}

			/*regressão geométrica (Y>=0, X>=0)*/
			refy = WDarray.setY(y, Math.log);
			refx = WDarray.setY(x, Math.log);
			if (refy === null || refx === null) {val = null;} else {
				var matrix2 = WDarray.setArray(refy, refx);
				var y2 = matrix2.array1;
				var x2 = matrix2.array2;
				if (x2 === null || y2 === null) {val = null} else {
					val = WDarray.leastSquares(x2, y2);
				}
			}
			if (val !== null) {
				data.geometric = {};
				data.geometric.e = "y = a x**b";
				data.geometric.a = Math.exp(val.b);
				data.geometric.b = val.a;
				data.geometric.x = x;
				data.geometric.y = y;
				data.geometric.f = function(x) {return data.geometric.a*Math.pow(x, data.geometric.b);},
				data.geometric.Y = WDarray.setY(x, data.geometric.f);
				data.geometric.d = WDarray.stdDev(y, data.geometric.Y);
			}

			return data;
		}
	});

	Object.defineProperty(WDarray.prototype, "ratio", {/*comparação entre valores*/
		enumerable: true,
		value: function(label) {
			var data = this.data;
			var sum = data === null ? null : data.sum.value
			if (sum === null) return null;
			var check = new WDtype(label);
			var type  = check.type;
			var list  = WDarray.setArray(this._value).array1;
			var x = {};
			console.info(list, sum, data);
			for (var i = 0; i < list.length; i++) {
				var name  = type === "array" && label[i] !== undefined ? new String(label[i]).toString() : "Item_"+i;
				var value = list[i]/sum;
				x[name] = value;
			}
			return x;
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

	Object.defineProperties(WDdom, {
		checkCss: {
			value: function(e, css) {
				var list = e.className.replace(WDbox.re.empty, " ").split(" ");
				return list.indexOf(css) >= 0 ? true : false;
			}
		}
	});

	Object.defineProperties(WDdom, {
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
				if (type === "radio" || type === "checkbox") return e.checked ? value : null;
				if (type === "date" && value !== "%today")   return check.type === "date" ? check.toString() : null;
				if (type === "time" && value !== "%now")     return check.type === "time" ? check.toString() : null;
				if (type === "number" || type === "range")   return check.type === "number" ? check.valueOf() : null;
				if (type === "file") return e.files.length > 0 ? e.files : null;
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
					key = new WD(i).camel;
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

				var css = WD(elem.className.split(" "));
				if (css.type !== "array") css = WD([]);

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

				elem.className = css.valueOf().join(" ");
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
						WD(script).action("kill");
					}
					loadingProcedures();
				}
				return;
			});
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "filter", {/*exibe somente o texto casado*/
		enumerable: true,
		value: function (search, chars) {
			chars = isFinite(chars) && chars !== 0 ? WDbox.int(chars) : 1;

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
						target.action("show");
						continue;
					}
					var found = content.indexOf(search) >= 0 ? true :  false;
					var width = search.length;
					if (chars < 0) {
						target.action((found && width >= -chars) ? "show" :  "hide");
					} else {
						target.action((!found && width >= chars) ? "hide" :  "show");
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

				if (attr in elem) {//FIXME precisa de mais atenção
					if (value === "?" && elem[attr] === true) {
						elem[attr] =  false;
					} else if (value === "?" && elem[attr] === false) {
						elem[attr] = true;
					} else {
						elem[attr] = value;
					}
					if (elem[attr] === value) return;
				}

				if (value === undefined || value === null) return elem.removeAttribute(attr);
				var val = elem.getAttribute(attr);
				if (value === "?" && val === "true")  return elem.setAttribute(attr, "false");
				if (value === "?" && val === "false") return elem.setAttribute(attr, "true");
				return elem.setAttribute(attr, value);				
			});
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "action", {/*executa determinadas ações*/
		enumerable: true,
		value: function (action) {
			action = new String(action).toLowerCase();

			this.run(function(elem) {
				var list = WD(elem);

				if (action === "open") {
					if ("open" in elem) elem.open = true;
					return;
				}
				if (action === "close") {
					if ("open" in elem) elem.open = false;
					return;
				}
				if (action === "open?") {
					if ("open" in elem) elem.open = elem.open ? false : true;
					return;
				}
				if (action === "show") {
					list.css({del: "js-wd-no-display"});
					return;
				}
				if (action === "hide") {
					list.css({add: "js-wd-no-display"});
					return;
				}
				if (action === "show?") {
					list.css({tgl: "js-wd-no-display"});
					return;
				}
				if (action === "check") {
					if ("checked" in elem) {elem.checked = true;}
					else {list.css({add: "js-wd-checked"});}
					return;
				}
				if (action === "uncheck") {
					if ("checked" in elem) {elem.checked = false;}
					else {list.css({del: "js-wd-checked"});}
					return;
				}
				if (action === "check?") {
					if ("checked" in elem) {elem.checked = elem.checked ? false : true;}
					else {list.css({tgl: "js-wd-checked"});}
					return;
				}
				if (action === "enable") {
					if ("disabled" in elem) {elem.disabled = false;}
					else {list.css({del: "js-wd-disabled"});}
					return;
				}
				if (action === "disable") {
					if ("disabled" in elem) {elem.disabled = true;}
					else {list.css({add: "js-wd-disabled"});}
					return;
				}
				if (action === "enable?") {
					if ("disabled" in elem) {elem.disabled = elem.disabled ? false : true;}
					else {list.css({tgl: "js-wd-disabled"});}
					return;
				}
				if (action === "clear") {
					elem[WDdom.load(elem)] = "";
					return;
				}
				if (action === "kill") {
					if ("remove" in elem) {elem.remove();}
					else {elem.parentElement.removeChild(elem);}
					return;
				}
				if (action === "tab") {
					var bros = WD(elem.parentElement.children);
					bros.action("hide");
					list.action("show")
					return;
				}
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
					apply.action("tab");
					return;
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
					apply.action("tab");
					return;
				}
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

	Object.defineProperty(WDdom.prototype, "page", {/*divide os elementos em "páginas"*/
		enumerable: true,
		value: function (page, size) {
			page = isFinite(page) ? WDbox.int(page) : 0;
			size = isFinite(size) && size > 0 ? Math.abs(size) : 1;

			this.run(function(elem) {
				var book  = elem.children;
				var lines = size < 1 ? WDbox.int(size*book.length) : WDbox.int(size);
				var pages = WDbox.int(book.length/lines);
				var print = [];
				console.info("page: ", page, ", size: ", size, ", length: ", book.length, ", lines: ", lines, ", pages: ", pages);
				
				
				for (var i = 0; i < book.length; i++) {
					var p = WDbox.int(i/lines);
					if (print[p] === undefined) print.push([]);
					console.log("p: ", p, "i: ", i);
					print[p].push(book[i]);
				}
				WD(book).action("hide");
				var show = WD(print).item(page);
				if (show === undefined) show = page < 0 ? print[0] : print[pages];
				
				for (var i = 0; i < show.length; i++) WD(show[i]).action("show");
				return;
			});
			return this;
		}
	});

	Object.defineProperty(WDdom.prototype, "sort", {/*ordenar elementos filhos*/
		enumerable: true,
		value: function (order, col) {
			order = isFinite(order) ? order : 1;
			col   = isFinite(col) && col >= 0 ? WDbox.int(col) : null;

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

				var exec = WD(aux);
				var sort = exec.sort();
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
				if (WDdom.tag(elem) !== "table") return tables.push(null);
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


/*============================================================================*/
/* -- ATRIBUTOS -- */
/*============================================================================*/

	function data_wdLoad(e) {/*carrega HTML: data-wd-load=post|get{file}${form}*/
		if (!("wdLoad" in e.dataset)) return;
		var data = WDdom.dataset(e, "wdLoad")[0];
		if (!("get" in data) && !("post" in data)) return;

		var target = WD(e);
		var method = "get" in data ? "get" : "post";
		var file   = data[method];
		var pack   = WDbox.get$$(data);
		var exec   = WD(pack);

		target.data({wdLoad: null});

		exec.send(file, function(x) {
			if (x.closed) target.load(x.text);
		}, method);
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdRepeat(e) {/*Repete modelo HTML: data-wd-repeat=post|get{file}${form}*/
		if (!("wdRepeat" in e.dataset)) return;
		var data = WDdom.dataset(e, "wdRepeat")[0];
		if (!("get" in data) && !("post" in data)) return;

		var target = WD(e);
		var method = "get" in data ? "get" : "post";
		var file   = data[method];
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

	function data_wdSend(e) {/*Requisições: data-wd-send=post|get{file}${form}call{name}&*/
		if (!("wdSend" in e.dataset)) return;
		var data = WDdom.dataset(e, "wdSend");
		for (var i = 0; i < data.length; i++) {
			if (!("get" in data[i]) && !("post" in data[i])) continue;
			var method = "get" in data[i] ? "get" : "post";
			var file   = data[i][method];
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
		var col   = "col" in data ? data.col : null;
		var target = WD(e);
		target.sort(order, col).data({wdSort: null});
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

		console.log(e, order, col);

		WD(body).sort(order, col);
		WD(heads).data({wdTsort: ""});
		WD(e).data({wdTsort: (order < 0 ? "-1" : "+1")});

		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdFilter(e) {/*Filtrar elementos: data-wd-filter=chars{}${css}&...*/
		if (!("wdFilter" in e.dataset)) return;

		var search = WDdom.form(e) ? WDdom.value(e) : e.textContent;
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
			"%DMY": {mask: "##.##.####", func: checks.date},
			"%MDY": {mask: "##/##/####", func: checks.date},
			"%YMD": {mask: "####-##-##", func: checks.date},
			"%H":   {mask: "#:##?##:##?#:##:##?##:##:##", func: checks.time}
		};
		var text = e[attr];
		var mask = data.model;
		var func = "call" in data ? data["call"] : null;
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
			return WD(e).class({del: phone}).class({del: tablet}).class({del: mobile}).class({add: desktop});
		}
		if (device === "tablet") {
			return WD(e).class({del: desktop}).class({del: phone}).class({add: mobile}).class({add: tablet});
		}
		if (device === "phone") {
			return WD(e).class({del: desktop}).class({del: tablet}).class({add: mobile}).class({add: phone});
		}
		return;
	};

/*----------------------------------------------------------------------------*/

	function data_wdSlide(e) {/*Carrossel: data-wd-slide=time*/
		if (!("wdSlide" in e.dataset)) return delete e.dataset.wdSlideRun;
		var time = isFinite(e.dataset.wdSlide) ? WDbox.int(e.dataset.wdSlide) : 1000;;

		if (!("wdSlideRun" in e.dataset)) {
			WD(e).action((time < 0 ? "prev" : "next"));
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

	function data_wdShared(e) {/*TODO: Redes sociais: data-wd-shared=rede*/
		if (!("Shared" in e.dataset)) return;
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
					if ("tcss"  in attr) {WD(x).class({tgl: attr["tcss"]});}
					return;
				});
			}
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
		var attr = new WD(WDbox.$$("[data-wd-load], [data-wd-repeat]"));
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
			data_wdTsort(elem);
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
