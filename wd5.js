/*------------------------------------------------------------------------------
MIT License

Copyright (c) 2023 Willian Donadelli <wdonadelli@gmail.com>

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

https://github.com/wdonadelli/wd
------------------------------------------------------------------------------*/

"use strict";

const wd = (function() {
/*===========================================================================*/
	/**3{Mecanismos de Controle}3*/
/*===========================================================================*/

	/**f{b{const string}b wd_version}f*/
	/**p{Guarda a versão da biblioteca.}p*/
	const wd_version = "WD JS v5.0.0";

	/**f{b{let string}b wd_device_controller}f*/
	/**p{Identifica o tamanho da tela (v{desktop tablet phone}v), c{null}c se indefinido.}p*/
	let wd_device_controller = null;

	/**f{b{const integer}b wd_key_time_range}f*/
	/**p{Intervalo (i{ms}i) entre eventos de digitação (i{oninput}i, i{onkeyup}i...).}p*/
	const wd_key_time_range = 500;

	/**f{b{const object}b wd_counter_control}f*/
	/**p{Controla a contagem de requisições de conteúdos externos:}p l{*/
	/**t{b{integer}b repeat}t d{Número de repetições em andamento.}d*/
	/**t{b{integer}b load}t   d{Número de carregamentos em andamento.}d }l*/
	const wd_counter_control = {
		repeat: 0,
		load:   0
	};

	/**f{b{const object}b wd_modal_control}f*/
	/**p{Controla a janela modal com a seguinte estrutura:}p l{*/
	const wd_modal_control = {
		/**t{b{node}b modal}t d{Container do plano de fundo.}d*/
		modal: null,
		/**t{b{node}b bar}t d{Barra de progresso (i{meter}i, i{progress}i ou i{div}i).}d*/
		bar: null,
		/**t{b{integer}b counter}t d{Solicitações em aberto (controla a exibição).}d*/
		counter: 0,
		/**t{b{integer}b delay}t d{Atraso (i{ms}i) para fechar a janela (evitar piscadas).}d*/
		delay: 250,
		/**t{b{integer}b time}t d{Intervalo (i{ms}i) para atualização da barra de progresso.}d*/
		time: 5,
		/**t{b{void}b _init()}t d{Inicializa os atributos.}d*/
		_init: function() {
			/* janela modal */
			this.modal = document.createElement("DIV");
			this.modal.className = "js-wd-modal";
			/* barra de progresso */
			if ("HTMLMeterElement" in window)
				this.bar = document.createElement("METER");
			else if ("HTMLProgressElement" in window)
				this.bar = document.createElement("PROGRESS");
			else
				this.bar = document.createElement("DIV");
			this.bar.className = "js-wd-progress-bar";
			/* unindo os dois */
			this.modal.appendChild(this.bar);
			return;
		},
		/**t{b{integer}b start()}t*/
		/**d{Demanda à janela modal, acresce i{counter}i e o retorna.}d*/
		start: function() { /* abre a janela modal */
			if (this.modal === null) this._init();
			if (this.counter === 0)
				document.body.appendChild(this.modal);
			this.counter++;
			return this.counter;
		},
		/**t{b{integer}b end()}t*/
		/**d{Dispensa à janela modal, decresce i{counter}i e o retorna.}d*/
		end: function() {
			let object = this;
			/* checar fechamento da janela após delay */
			window.setTimeout(function () {
				object.counter--;
				if (object.counter < 1)
					document.body.removeChild(object.modal);
			}, this.delay);

			return this.counter;
		},
		/**t{b{void}b progress(b{float}b x)}t*/
		/**d{Define o valor da barra de progresso.}d*/
		/**d{v{x}v - Valor (0 a 1) da barra de progresso.}d }l*/
		progress: function(x) {
			let tag    = this.bar.tagName.toLowerCase();
			let value  = tag === "div" ? wd_num_str(x, true) : x;
			let object = this;
			/* executar progresso após o tempo de interação com o documento */
			window.setTimeout(function() {
				if (tag === "div") /* sem progress ou meter (usa CSS width) */
					object.bar.style.width = value;
				else /* com progress ou meter */
					object.bar.value = value;
			}, this.time);
			return;
		}
	};

	/**f{b{const object}b wd_signal_control}f*/
	/**p{Controla a caixa de mensagens:}p l{*/
	const wd_signal_control = {
		/**t{b{node}b main}t d{Container das caixas de mensagem.}d*/
		main: null,
		/**t{b{integer}b time}t d{Tempo de duração da mensagem (ver CSS \cjs-wd-signal-msg).}d*/
		time: 9000,
		/**t{b{void}b _init()}t d{Inicializa os atributos.}d*/
		_init: function() {
			this.main = document.createElement("DIV");
			this.main.className = "js-wd-signal";
			return;
		},
		/**t{b{object}b _createBox()}t d{Cria e retorna os componentes nova caixa de mensagem:}d*/
		_createBox: function() {
			return {
				/**L{t{b{node}b box}t d{Container da caixa de mensagem.}d*/
				box:     document.createElement("ARTICLE"),
				/**t{b{node}b header}t d{Cabeçalho da mensagem.}d*/
				header:  document.createElement("HEADER"),
				/**t{b{node}b message}t d{Texto da mensagem.}d*/
				message: document.createElement("SECTION"),
				/**t{b{node}b close}t d{Botão de fechamento antecipado da caixa.}d*/
				close:   document.createElement("SPAN"),
				/**t{b{node}b header}t d{Texto do cabeçalho.}d}L*/
				title:   document.createElement("STRONG")
			};
		},
		/**t{b{void}b _close(b{node}b elem)}t d{Demanda o fechamento da caixa de mensagem.}d*/
		/**d{v{elem}v - caixa de mensagem a ser fechada.}d*/
		_close: function(elem) {
				try {this.main.removeChild(elem);} catch(e){}
				if (this.main.children.length === 0)
					try {document.body.removeChild(this.main);} catch(e){}
				return;
		},
		/**t{b{node}b _box()}t d{Contrói a caixa de mensagem e a retorna.}d*/
		_box: function() {
			let msg = this._createBox();
			msg.box.appendChild(msg.header);
			msg.box.appendChild(msg.message);
			msg.header.appendChild(msg.close);
			msg.header.appendChild(msg.title);
			msg.box.className = "js-wd-signal-msg";
			msg.close.textContent = "\u00D7";
			let object = this;
			msg.close.onclick = function() {
				object._close(msg.box);
			}
			return msg;
		},
		/**t{b{void}b open(b{string}b message, b{string}b title)}t*/
		/**d{Demanda a abertura de uma nova caixa de mensagem:}d*/
		/**d{v{message}v - texto da mensagem.}d*/
		/**d{v{title}v - (opcional) texto do cabeçalho.}d}l*/
		open: function(message, title) { /* abre uma mensagem */
			/* criação do container principal, se inexistente */
			if (this.main === null) this._init();
			/* obtenção da caixa de mensagem */
			let msg = this._box();
			/* definição do título e da mensagem */
			msg.message.textContent = message;
			msg.title.textContent   = title === undefined ? " " : title;
			/* exibindo caixa principal, se escondida */
			if (this.main.children.length === 0)
				document.body.appendChild(this.main);
			/* renderizando mensagem */
			this.main.insertAdjacentElement("afterbegin", msg.box);
			/* definindo um prazo para fechamento automático da caixa */
			let object = this;
			window.setTimeout(function() {
				object._close(msg.box)
			}, this.time);

			return;
		}
	}
	/**f{b{const array}b wd_js_css}f*/
	/**p{Guarda os estilos da biblioteca.}p*/
	/**p{Os itens da lista são objetos cujos atributos definem os estilos:}p l{*/
	/**t{b{string}b s}t d{Seletor CSS.}d*/
	/**t{b{string}b d}t d{Estilos a ser aplicado ao seletor.}d}l*/
	const wd_js_css = [
		{s: "@keyframes js-wd-fade-in",  d: ["from {opacity: 0;} to {opacity: 1;}"]},
		{s: "@keyframes js-wd-fade-out", d: ["from {opacity: 1;} to {opacity: 0;}"]},
		{s: "@keyframes js-wd-shrink-out", d: ["from {transform: scale(0);} to {transform: scale(1);}"]},
		{s: "@keyframes js-wd-shrink-in",  d: ["from {transform: scale(1);} to {transform: scale(0);}"]},
		{s: ".js-wd-modal", d: [
			"display: block; width: 100%; height: 100%;",
			"padding: 0.1em 0.5em; margin: 0; z-index: 999999;",
			"position: fixed; top: 0; right: 0; bottom: 0; left: 0;",
			"cursor: progress; background-color: rgba(0,0,0,0.4);",
			"animation: js-wd-fade-in 0.1s;"
		]},
		{s: ".js-wd-progress-bar", d: [
			"display: block; position: absolute; top: 0; left: 0; right: 0; margin: auto; width: 100%;"
		]},
		{s: "div.js-wd-progress-bar", d: ["height: 1em; background-color: #1e90ff;"]},
		{s: ".js-wd-no-display", d: ["display: none;"]},
		{s: "[data-wd-nav], [data-wd-send], [data-wd-tsort], [data-wd-data], [data-wd-full], [data-wd-jump]", d: [
			"cursor: pointer;"
		]},
		{s: "[data-wd-set], [data-wd-edit], [data-wd-shared], [data-wd-css], [data-wd-table]", d:[
			"cursor: pointer;"
		]},
		{s: "[data-wd-tsort]:before", d: ["content: \"\\2195 \";"]},
		{s: "[data-wd-tsort=\"-1\"]:before", d: ["content: \"\\2191 \";"]},
		{s: "[data-wd-tsort=\"+1\"]:before", d: ["content: \"\\2193 \";"]},
		{s: "[data-wd-repeat] > *, [data-wd-load] > *", d: [
			"visibility: hidden;"
		]},
		{s: "[data-wd-slide] > * ", d: ["animation: js-wd-fade-in 1s, js-wd-shrink-out 0.5s;"]},
		{s: "nav > *.js-wd-nav-inactive", d: ["opacity: 0.5;"]},
		{s: ".js-wd-plot", d: [
			"height: 100%; width: 100%; position: absolute; top: 0; left: 0; bottom: 0; right: 0;"
		]},
		{s: ".js-wd-signal", d: [
			"position: fixed; top: 0; right: 0.5em; left: 0.5em; width: auto;",
			"margin: auto; padding: 0; z-index: 999999;"
		]},
		{s: "@media screen and (min-width: 768px)", d: [".js-wd-signal {width: 40%;}",]},
		{s: ".js-wd-signal-msg", d: [
			"animation-name: js-wd-shrink-out, js-wd-shrink-in;",
			"animation-duration: 0.5s, 0.5s; animation-delay: 0s, 8.5s;",
			"margin: 5px 0; position: relative; padding: 0; border-radius: 0.2em;",
			"border: 1px solid rgba(0,0,0,0.6); box-shadow: 1px 1px 6px rgba(0,0,0,0.6);",
			"background-color: rgb(245,245,245); color: rgb(20,20,20);"
		]},
		{s: ".js-wd-signal-msg > header", d: [
			"padding: 0.5em; border-radius: 0.2em 0.2em 0 0; position: relative;"
		]},
		{s: ".js-wd-signal-msg > header > span", d: [
			"position: absolute; top: 0.5em; right: 0.5em; line-height: 1; cursor: pointer;"
		]},
		{s: ".js-wd-signal-msg > section", d: [
			"padding: 0.5em; border-radius: 0 0 0.2em 0.2em;"
		]},
	];
/*----------------------------------------------------------------------------*/
	/**f{b{string}b __device()}f*/
	/**p{Retorna o tipo de tela utilizada: v{"desktop" "tablet" "phone"}v.}p*/
	function __device() {
		if (window.innerWidth >= 768) return "desktop";
		if (window.innerWidth >= 600) return "tablet";
		return "phone";
	};

/*===========================================================================*/
	/**3{Checagem de Tipos e Valores}3*/
/*===========================================================================*/

	/**f{b{object}b __Type(b{void}b input)}f*/
	/**p{Construtor que identifica o tipo do argumento e extrai seu valor para uso da biblioteca.}p*/
	/**l{d{v{input}v - Dado a ser examinado.}d}l*/
	function __Type(input) {
		if (!(this instanceof __Type)) return new __Type(input);
		this._input = input; /* valor original */
		this._type  = null;  /* tipo do valor de entrada */
		this._value = null;  /* valor a ser considerado */
		this._init();        /* definir atributos próprios */
	}

	/**6{Métodos e atributos}6 l{*/
	Object.defineProperties(__Type.prototype, {
		constructor: {value: __Type},
		/**t{b{object}b _re}t d{Armazena as expressões regulares dos tipos em forma de string.}d*/
		_re: {
			value: {
				number:  /^(\+?\d+\!|[+-]?(\d+|(\d+)?\.\d+)(e[+-]?\d+)?\%?)$/i,
				dateDMY: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
				dateMDY: /^(0[1-9]|1[0-2])\.(0[1-9]|[12]\d|3[01])\.\d{4}$/,
				dateYMD: /^\d{4}\-(0[1-9]|1[0-2])\-(0[1-9]|[12]\d|3[01])$/,
				time12:  /^(0?[1-9]|1[0-2])\:[0-5]\d(\:[0-5]\d)?\ ?[ap]m$/i,
				time24:  /^(0?\d|1\d|2[0-4])(\:[0-5]\d){1,2}$/
			}
		},
		/**t{b{boolean}b string}t d{Checa se o argumento é uma string.}d*/
		string: {
			get: function() {
				if (this.type !== null) return this.type === "string";
				if (typeof this._input === "string" || this._input instanceof String) {
					/* string não pode definir _type porque outras verificações dependem dele */
					return true;
				}
				return false;
			}
		},
		/**t{b{boolean}b number}t d{Checa se o argumento é um número real.}d */
		/**d{Aceita números em forma de string: real, fatorial ou percentual.}d*/
		number: {
			get: function() {
				if (this.type !== null) return this.type === "number";
				/* número normal */
				if (typeof this._input === "number" || this._input instanceof Number) {
					if (isNaN(this._input)) return false;
					this._type  = "number";
					this._value = this._input.valueOf();
					return true
				}
				if (!this.string) return false;
				/* Número em forma de String (normal, percentual e fatorial) */
				let value = this._input.trim();
				if (this._re.number.test(value)) {
					let end = value[value.length-1];
					if (end === "!") { /* fatorial */
						value = Number(value.replace("!", ""));
						let num = 1;
						while (value > 1) num = num * value--;
						this._input = num;
						return this.number;
					}
					if (end === "%") { /* porcentagem */
						value = Number(value.replace("%", ""));
						this._input = value/100;
						return this.number;
					}
					/* normal */
					this._input = Number(value);
					return this.number;
				}

				return false;
			}
		},
		/**t{b{boolean}b finite}t d{Checa se o argumento é um número finito.}d*/
		finite: {
			get: function() {
				return this.type === "number" ? isFinite(this.value) : false;
			}
		},
		integer: {
			get: function() {
				return this.finite ? (this.value%1 === 0) : false;
			}
		},
		decimal: {
			get: function() {
				return this.finite ? (this.value%1 !== 0) : false;
			}
		},
		/**t{b{boolean}b boolean}t d{Checa se o argumento é um valor booleano.}d*/
		boolean: {
			get: function() {
				if (this.type !== null) return this.type === "boolean";
				if (typeof this._input === "boolean" || this._input instanceof Boolean) {
					this._type  = "boolean";
					this._value = this._input.valueOf();
					return true;
				}
				return false;
			}
		},
		/**t{b{boolean}b regexp}t d{Checa se o argumento é uma expressão regular.}d*/
		regexp: {
			get: function() {
				if (this.type !== null) return this.type === "regexp";
				if (this._input instanceof RegExp) {
					this._type  = "regexp";
					this._value = this._input;
					return true;
				}
				return false;
			}
		},
		/**t{b{boolean}b date}t*/
		/**d{Checa se o argumento é uma data (construtor c{Date}c).}d*/
		/**d{Aceita valores string nos formatos: v{DD/MM/YYYY MM.DD.YYYY YYYY-MM-DD}v.}d*/
		date: {
			get: function() {
				if (this.type !== null) return this.type === "date";
				if (this._input instanceof Date) {
					/* fixar em meio dia para evitar horários de verão */
					let input = this._input;
					this._type  = "date";
					this._value = {
						d: input.getDate(),
						m: input.getMonth()+1,
						y: input.getFullYear(),
						valueOf: function() {
							/* anos desde 0001 */
							let delta = this.y - 1;
							/* anos de 365 dias */
							let d365 = 365*delta;
							/* anos múltiplos de 4 (bissexto) */
							let y4   = (delta - delta%4) / 4;
							/* anos múltiplos de 100 (não bissexto) */
							let y100 = (delta - delta%100) / 100;
							/* anos múltiplos de 400 (bissexto) */
							let y400 = (delta - delta%400) / 400;
							/* dias do ano atual */
							let len  = [null, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
							let days = len[this.m] + this.d;
							/* bissexto acresce um dia se após fevereiro */
							if (this.m > 2)
								days += ((this.y%4 === 0 && this.y%100 !== 0) || this.y%400 === 0) ? 1 : 0;
							/* retornando dias desde 0001-01-01 */
							return d365 + y4 -y100 + y400 + days;
						}
					};
					return true;
				}
				if (!this.string) return false;
				/* Datas em forma de String */
				let value = this._input.trim();
				let d, m, y;
				if (this._re.dateDMY.test(value)) { /* DD/MM/YYYY */
					let date = this._input.split("/");
					d = date[0];
					m = date[1];
					y = date[2];
				} else if (this._re.dateMDY.test(value)) { /* MM.DD.YYYY */
					let date = this._input.split(".");
					d = date[1];
					m = date[0];
					y = date[2];
				} else if (this._re.dateYMD.test(value)) { /* YYYY-MM-DD */
					let date = this._input.split("-");
					d = date[2];
					m = date[1];
					y = date[0];
				} else {
					return false;
				}
				d = Number(d);
				m = Number(m);
				y = Number(y);
				/* checando ano */
				if (y < 1 || y > 9999) return false;
				/* checando mês */
				if (m < 1 || m > 12) return false;
				/* checando dia */
				let feb  = (y%400 === 0 || (y%4 === 0 && y%100 !== 0)) ?  29 : 28;
				let days = [null, 31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				if (d < 1 || d > days[m]) return false;
				let date = new Date();
				date.setFullYear(y);
				date.setMonth(m-1);
				date.setDate(d);
				this._input = date;
				return this.date;
			}
		},
		/**t{b{boolean}b function}t d{Checa se o argumento é uma função.}d*/
		function: {
			get: function() {
				if (this.type !== null) return this.type === "function";
				if (typeof this._input === "function" || this._input instanceof Function) {
					this._type  = "function";
					this._value = this._input;
					return true;
				}
				return false;
			}
		},
		/**t{b{boolean}b array}t d{Checa se o argumento é um array.}d*/
		array: {
			get: function() {
				if (this.type !== null) return this.type === "array";
				if (Array.isArray(this._input) || this._input instanceof Array) {
					this._type  = "array";
					this._value = this._input;
					return true;
				}
				return false;
			}
		},
		/**t{b{boolean}b null}t d{Checa se o argumento é um valor nulo ou uma string vazia.}d*/
		null: {
			get: function () {
				if (this.type !== null) return this.type === "null";
				let str = this.string ? (this._input.trim() === "" ? true : false) : false;
				if (this._input === null || str) {
					this._type  = "null"; //FIXME string vazia como null mesmo?
					this._value = null;
					return true;
				}
				return false;
			}
		},
		/**t{b{boolean}b undefined}t d{Checa se o argumento é um valor indefinido.}d*/
		undefined: {
			get: function() {
				if (this.type !== null) return this.type === "undefined";
				if (this._input === undefined || typeof this._input === "undefined") {
					this._type  = "undefined";
					this._value = undefined;
					return true;
				}
				return false;
			}
		},
		/**t{b{boolean}b time}t*/
		/**d{Checa se o argumento é uma string que representa tempo.}d*/
		/**d{Aceita os formato 24h e 12h (v{HH:MM:SS HH:MM AMPM}v).}d*/
		time: {
			get: function() {
				if (this.type !== null) return this.type === "time";
				if (!this.string) return false;
				let value = this._input.trim();
				let h, m, s;
				if (this._re.time12.test(value)) { /* HH:MM AMPM */
					let am   = value[value.length - 2].toUpperCase() === "A" ? true : false;
					let time = value.replace(/[^0-9:]/g, "").split(":");
					h = Number(time[0]);
					if (h < 1 || h > 12) return false;
					h = am ? (h % 12) : (h === 12 ? 12 : ((12 + h ) % 24));
					m = Number(time[1]);
					s = time.length === 3 ? Number(time[2]) : 0;
				} else if (this._re.time24.test(value)) { /* HH:MM:SS */
					let time = this._input.split(":");
					h = Number(time[0]);
					m = Number(time[1]);
					s = time.length === 3 ? Number(time[2]) : 0;
				} else {
					return false;
				}
				h = h%24;
				if (h < 0 || h > 24) return false;
				if (m < 0 || m > 59) return false;
				if (s < 0 || s > 59) return false;
				let ss = 3600*h+60*m+s;
				this._type  = "time";
				this._value = {
					h: h,
					m: m,
					s: s,
					valueOf: function() {
						return 3600*this.h + 60*this.m + this.s;
					}
				};
				return true;
			}
		},
		/**t{b{boolean}b node}t d{Checa se o argumento é um elemento HTML ou uma coleção desses.}d*/
		node: {
			get: function() {
				if (this.type !== null) return this.type === "node";
				/* 0: individual, 1: coletivo, outros: direto */
				let nodes = {
					window: window, document: document,
					HTMLElement: 0, SVGElement: 0, MathMLElement: 0,
					NodeList: 1, HTMLCollection: 1, HTMLAllCollection: 1,
					HTMLOptionsCollection: 1, HTMLFormControlsCollection: 1
				}
				let html = [];
				for (var obj in nodes) {
					let ref = nodes[obj];
					if (ref === 0 || ref === 1) {
						if (obj in window && this._input instanceof window[obj]) {
							this._type = "node";
							if (ref === 0) {
								html.push(this._input);
							} else {
								for (let i = 0; i < this._input.length; i++)
									html.push(this._input[i]);
							}
						}
					} else if (ref === this._input)  {
						this._type = "node";
						html.push(this._input);
					}
					if (this._type === "node") {
						this._value = html;
						return true;
					}
				}
				return false;
			}
		},
		/**t{b{boolean}b object}t d{Checa se o argumento é um objeto diferente das demais categorias.}d */
		object: {
			get: function() {
				if (this.type !== null) return this.type === "object";
				if (this.string) return false;
				if (typeof this._input === "object") {
					this._type  = "object";
					this._value = this._input;
					return true;
				}
				return false;
			}
		},
		/**t{b{void}b _init()}t d{Analisa o argumento e define os parâmetros iniciais do objeto.}d */
		_init: {
			value: function() {
				if (this._type !== null) return;

				/* tipos próprios */
				let types = [
					"null", "undefined", "boolean", "number", "date", "time", "array",
					"node", "regexp", "function"
				];
				for (let i = 0; i < types.length; i++)
					if (this[types[i]]) return;
				/* tipos auxiliares, genéricos e desconhecidos */
				if (this.string) {
					this._type  = "string";
					this._value = this._input.toString();
					return;
				}
				if (this.object) {
					this._type  = "object";
					this._value = this._input;
					return;
				}
				this._value = this._input;
				this._type  = "unknow";
				return;
			}
		},
		/**t{b{void}b value}t d{Retorna o valor do argumento para fins da biblioteca.}d */
		/**d{Tipos de referência retornam valores de referência.}d*/
		/**d{Tipos de primitivos retornam valores primitivos.}d*/
		/**d{O tipo i{time}i retorna um objeto com a seguinte estrutura:}d*/
		/**L{t{b{integer}b h}t d{Hora.}d*/
		/**t{b{integer}b m}t d{Minuto.}d*/
		/**t{b{integer}b s}t d{Segundo.}d*/
		/**t{b{integer}b valueOf()}t d{Quantidade total de segundos desde v{00h00}v.}d}L*/
		/**d{O tipo i{date}i retorna um objeto com a seguinte estrutura:}d*/
		/**L{t{b{integer}b h}t d{dia.}d*/
		/**t{b{integer}b m}t d{mês.}d*/
		/**t{b{integer}b y}t d{ano.}d*/
		/**t{b{integer}b valueOf()}t d{Quantidade total de dias desde v{0001-01-01}v.}d}L*/
		value: {
			get: function() {return this._value;}
		},
		/**t{b{string}b type}t d{Retorna o tipo do argumento para uso da biblioteca.}d */
		type: {
			get: function() {return this._type;}
		},
		/**t{b{void}b valueOf()}t d{Retorna o método i{valueOf}i do retorno do atributo i{value}i.}d*/
		valueOf: {
			value: function() {return this.value.valueOf();}
		},
		/**t{b{string}b toString()}t d{Retorna o método i{toString()}i do retorno do atributo i{value}i.}d*/
		toString: {
			value: function() {return this.value.toString();}
		}
		/**}l*/
	});

/*===========================================================================*/
	/**3{Números}3*/
/*===========================================================================*/

	/**f{b{object}b __Number(b{number}b input)}f*/
	/**p{Construtor para manipulação de números.}p*/
	/**l{d{v{input}v - Número.}d}l*/
	function __Number(input) {
		if (!(this instanceof __Number)) return new __Number(input);
		let check = __Type(input);
		Object.defineProperties(this, {
			_value: {value: check.type !== "number" ? 0    : check.value},
			finite: {value: check.type !== "number" ? true : check.finite}
		});
	}
	/**6{Métodos e atributos}6 l{*/
	Object.defineProperties(__Number.prototype, {
		constructor: {value: __Number},
		/**t{b{boolean}b finite}t d{Retorna verdadeiro se for um número finito.}d*/
		finite: {
			get: function() {return this._finite;}
		},
		valueOf: {
			value: function() {return this._value;}
		},
		toString: {
			value: function() {
				if (this.finite) return this.valueOf().toString();
				return (this < 0 ? "-" : "+")+"\u221E";
			}
		},
		/**t{b{number}b abs}t d{Retorna o valor absoluto do número.}d*/
		abs: {
			get: function() {return (this < 0 ? -1 : +1) * this.valueOf();}
		},
		/**t{b{integer}b int}t d{Retorna a parte inteira do número.}d*/
		int: {
			get: function() {
				return (this.valueOf() < 0 ? -1 : 1) * Math.floor(Math.abs(this.valueOf()));
			}
		},
		/**t{b{float}b dec}t d{Retorna a parte decimal do número.}d*/
		dec: {
			get: function() {
				if (!this.finite) return this.valueOf();
				let exp   = 1;
				while ((this.valueOf() * exp)%1 !== 0) exp = 10*exp;
				return (exp*this.valueOf() - exp*this.int) / exp;
			}
		},
		/**t{b{number}b round(n)}t d{Arredonda o número conforme especificado.}d*/
		/**L{d{v{n}v - (opcional) Quantidade de casas decimais (padrão v{3}v).}d}L*/
		round: {
			value: function(n) {
				if (!this.finite) return this.valueOf();
				n = __Number(__Type(n).finite ? n : 3);
				n = n < 0 ? 0 : n.int;
				return Number(this.valueOf().toFixed(n));
			}
		},
		/**t{b{number}b cut(n)}t d{Corta o número de casas decimais conforme especificado (não arredonda).}d*/
		/**L{d{v{n}v - (opcional) Quantidade de casas decimais (padrão v{3}v).}d}L*/
		cut: {
			value: function(n) {
				if (!this.finite) return this.valueOf();
				n = __Number(__Type(n).finite ? n : 3);
				n = n < 0 ? 0 : n.int;
				let base = 1;
				let i = -1;
				while (++i < n) base = 10*base;
				let value = __Number(base*this.valueOf());
				return value.int/base;
			}
		},
		/**t{b{array}b primes}t d{Retorna uma lista com os números primos até o valor informado.}d*/
		primes: {
			get: function() {
				if (!this.finite || this < 2) return [];
				let list = [2];
				let int  = this.int;
				let i    = 3;
				while (i <= int) {
					let isPrime = true;
					let j = 0; /* não checar o 2 */
					while (++j < list.length) {
						if (i % list[j] === 0) {
							isPrime = false;
							break;
						}
					}
					if (isPrime) list.push(i);
					i += 2; /* não checar par */
				}
				return list;
			}
		},
		/**t{b{boolean}b prime}t d{Retorna verdadeiro se o número for primo.}d*/
		prime: {
			get: function() {
				if (this < 2 || !this.finite || this.dec !== 0) return false;
				return this.primes.reverse()[0] === this.valueOf() ? true : false;
			}
		},
		/**t{b{string}b frac(n)}t d{Retorna a notação em forma de fração.}d*/
		/**L{d{v{n}v - (opcional) Limitador de precisão (padrão v{3}v).}d}L*/
		frac: {
			value: function(n) {
				let int = Math.abs(this.int);
				let dec = Math.abs(this.dec);
				if (!this.finite || dec === 0) return this.toString();
				/* checando argumento limitador */
				n = __Number(__Type(n).finite ? n : 3);
				if (n < 1) return this.int.toString();
				n = n > 5 ? 5 : n.int;
				/* divisor, dividendo e números significativos */
				let div = 1;
				let dnd = dec * div;
				let len = 0;
				while(dnd%1 !== 0) {
					div = 10*div;
					dnd = dec * div;
					/* checando limites */
					let check = __Number(dnd);
					if (check.int !== 0) {
						len++;
						if (len >= n) {
							dnd = check.int;
							break;
						}
					}
				}
				/* obtendo o máximo divisor comum e a fração */
				let gcd = __Array(div, dnd).gcd;
				int = int === 0 ? "" : int.toString()+" ";
				dnd = String(dnd/gcd);
				div = String(div/gcd);
				return (this._value < 0 ? "-" : "")+int+dnd+"/"+div;
			}
		},
		/**t{b{string}b bytes}t d{Retorna a notação em bytes.}d*/
		bytes: {
			get: function() {
				if (this < 1)     return "0 B";
				if (!this.finite) return this.toString()+" B";
				let scale = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
				let i     = scale.length;
				while (--i >= 0)
					if (this >= Math.pow(1024,i))
						return (this.int/Math.pow(1024,i)).toFixed(2)+" "+scale[i];
				return this.int+" B";
			}
		},
		/**t{b{string}b type}t d{Retorna o tipo do número v{zero, infinity, integer, real}v.}d*/
		type: {
			get: function() {
				if (this == 0)      return "zero";
				if (!this.finite)   return "infinity";
				if (this.dec === 0) return "integer";
				return "real";
			}
		},
		/**t{b{string}b precision(n)}t d{Fixa a quantidade de dígitos significativos.}d*/
		/**L{d{v{n}v - (opcional) Quantidade dígitos (padrão v{3}v).}d}L*/
		precision: {
			value: function(n) {
				n = __Number(__Type(n).finite ? n : 3);
				n = n < 1 ? 1 : n.int;
				//FIXME tem que descobrir o que quero com isso e arrumar essa porra
				if (this.abs < 1 && this !== 0)
					return this.valueOf()[this.abs < Math.pow(10,-n+1) ? "toExponential" : "toFixed"](n-1);
				return this.valueOf().toPrecision(n);
			}
		},
		/**t{b{string}b notation(b{number}b value, b{string}b lang, b{string}b type, b{void}b code)}t*/
		/**d{Formata em determinada notação a{https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat}a.}d*/
		/**L{*/
		/**d{v{type}v - Tipo da formatação:}d L{*/
		/**d{v{"significant"}v - fixa número de dígitos significativos.}d*/
		/**d{v{"decimal"}v - fixa número de casas decimais.}d*/
		/**d{v{"integer"}v - fixa número de dígitos inteiros.}d*/
		/**d{v{"percent"}v - transforma o número em notação percentual.}d*/
		/**d{v{"unit"}v - define a unidade de medida.}d*/
		/**d{v{"scientific"}v - notação científica.}d*/
		/**d{v{"engineering"}v - notação de engenharia.}d*/
		/**d{v{"compact"}v - notação compacta curta ou longa.}d*/
		/**d{v{"currency"}v - Notação monetária.}d*/
		/**d{v{"ccy"}v - Notação monetária curta.}d*/
		/**d{v{"nameccy"}v - Notação monetária textual.}d }L*/
		/**d{v{code}v - depende do tipo da formatação:}d L{*/
		/**d{v{"significant"}v - quantidade de números significativos.}d*/
		/**d{v{"decimal"}v - número de casas decimais.}d*/
		/**d{v{"integer"}v - número de dígitos inteiros.}d*/
		/**d{v{"percent"}v - número de casas decimais.}d*/
		/**d{v{"unit"}v - nome da unidade de medida a{https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier}a.}d*/
		/**d{v{"scientific"}v - número de casas decimais.}d*/
		/**d{v{"engineering"}v - número de casas decimais.}d*/
		/**d{v{"compact"}v - Longa (v{"long"}v) ou curta (v{"short"}v).}d*/
		/**d{v{"currency"}v - Código monetário a{https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=currency-codes}a.}d*/
		/**d{v{"ccy"}v - Código monetário.}d*/
		/**d{v{"nameccy"}v - Código monetário.}d }L*/
		/**d{v{lang}v - (Opcional) Código da linguagem a ser aplicada.}d*/
		/**}L*/
		notation: {
			value: function (type, code, lang) {
				if (!this.finite) return this.toString();
				lang = __Type(lang) !== "string" ? undefined : lang.trim();
				let types = {
					significant: {
						minimumSignificantDigits: code,
						maximumSignificantDigits: code
					},
					decimal: {
						style: "decimal",
						minimumFractionDigits: code,
						maximumFractionDigits: code
					},
					integer: {
						style: "decimal",
						minimumIntegerDigits: code
					},
					percent: {
						style: "percent",
						minimumFractionDigits: code,
						maximumFractionDigits: code
					},
					unit: {
						style: "unit",
						unit: code
					},
					scientific: {
						style: "decimal",
						notation: "scientific",
						minimumFractionDigits: code,
						maximumFractionDigits: code
					},
					engineering: {
						style: "decimal",
						notation: "engineering",
						minimumFractionDigits: code,
						maximumFractionDigits: code
					},
					compact: {
						style: "decimal",
						notation: "compact",
						compactDisplay: code === "short" ? code : "long"
					},
					currency: {
						style: "currency",
						currency: code,
						signDisplay: "exceptZero",
						currencyDisplay: "symbol"
					},
					ccy: {
						style: "currency",
						currency: code,
						signDisplay: "exceptZero",
						currencyDisplay: "narrowSymbol"
					},
					nameccy: {
						style: "currency",
						currency: code,
						signDisplay: "auto",
						currencyDisplay: "name"
					}
				};
				type = String(type).toLowerCase();
				try {
					return this.valueOf().toLocaleString(lang, (type in types ? types[type] : {}));
				} catch(e) {
					return this.valueOf().toLocaleString();
				}
			}
		},
	/**}l*/
	});

/*===========================================================================*/
	/**3{Textos}3*/
/*===========================================================================*/

	/**f{b{object}b __String(b{string}b input)}f*/
	/**p{Construtor para manipulação de textos.}p*/
	/**l{d{v{input}v - Texto.}d}l*/
	function __String(input) {
		if (!(this instanceof __String)) return new __String(input);
		if (__Type(input).type !== "string") input = String(input);
		Object.defineProperties(this, {
			_value: {value: input}
		});
	}
	/**6{Métodos e atributos}6 l{*/
	Object.defineProperties(__String.prototype, {
		constructor: {value: __String},
		valueOf: {
			value: function() {return this._value;}
		},
		toString: {
			value: function() {return this.clear(true, false);}
		},
		/**t{b{string}b length}t d{Retorna a quantidade de caracteres.}d*/
		length: {
			get: function() {return this.valueOf().length;}
		},
		/**t{b{string}b upper}t d{Retorna caixa alta.}d*/
		upper: {
			get: function() {return this.valueOf().toUpperCase();}
		},
		/**t{b{string}b lower}t d{Retorna caixa baixa.}d*/
		lower: {
			get: function() {return this.valueOf().toLowerCase();}
		},
		/**t{b{string}b toggle}t d{Inverte a caixa.}d*/
		toggle: {
			get: function() {
				let list = this._value.split("");
				list.forEach(function(v,i,a) {
					a[i] = v === v.toUpperCase() ? v.toLowerCase() : v.toUpperCase();
				});
				return list.join("");
			}
		},
		/**t{b{string}b captalize}t d{Primeira letra de cada palavra, apenas, em caixa alta.}d*/
		capitalize: {
			get: function() {
				let list = this._value.split("");
				list.forEach(function(v,i,a) {
					a[i] = i === 0 || (/\s/).test(a[i-1]) ? v.toUpperCase() : v.toLowerCase();
				});
				return list.join("");
			}
		},
		/**t{b{string}b clear(b{boolean}b white, b{boolean}b accent)}t d{Limpa espaços desnecessários ou acentos.}d L{*/
		/**d{v{white}v - (opcional) Limpa espaços (padrão c{true}c).}d*/
		/**d{v{accent}v - (opcional) Limpa acentos (padrão c{true}c).}d}L*/
		clear: {
			value: function(white, accent) {
				let value = this.valueOf();
				if (white !== false)
					value = value.replace(/\s+/g, " ").trim();
				if (accent !== false)
					value = value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
				return value;
			}
		},
		/**t{b{string}b dash}t d{Retorna uma string identificadora no formato de u{traços}u.}d*/
		dash: {
			get: function() {
				let value = this.clear().replace(/\ +/g, "-").split("");
				let i = -1;
				while (++i < value.length) {
					if (!(/[a-zA-Z0-9._:-]/).test(value[i])) /* eliminar caracteres não permitidos */
						value[i] = "";
					else if (/[A-Z]/.test(value[i])) /* adicionar traço antes de maiúsculas e inverter caixa */
						value[i] = "-"+value[i].toLowerCase();
				}
				value = value.join("").replace(/\-+/g, "-");
				return value.replace(/^\-+/, "").replace(/\-+$/, "");
			}
		},
		/**t{b{string}b camel}t d{Retorna uma string identificadora no formato de u{camelCase}u.}d*/
		camel: {
			get: function() {
				let value = this.dash.split("-");
				let i = 0;
				while (++i < value.length)
					value[i] = value[i].charAt(0).toUpperCase()+value[i].substr(1);
				return value.join("");
			}
		},



		/**t{b{void}b wdNotation}t d{Retorna o valor ou um objeto a partir de uma regra de notação.}d*/
		/**d{c{"value" &rarr; value | "x{X}y{Y}" &rarr; [{x: X, y: Y}] | "x{X}&amp;y{Y}" &rarr; [{x: X}, {y: Y}]}c*/
		wdNotation: {
			get: function() {
		/* a{B}c{D}&e{F} => [{a: B, c: D}, {e: F}] */
				let list   = [{}];
				let data   = this._value.trim();
				let char   = data.split("");
				let open   = 0;
				let key    = 0;
				let types  = {true: true, false: false, null: null, undefined: undefined};
				let name   = [];
				let value  = [];
				let object = false;
				char.forEach(function(v,i,a) {
					if (v === "{" && open === 0) {
						name  = name.join("").trim();
						if (name === "") name = "#";
						list[key][name] = undefined;
						open++;
						value = [];
					} else if (v === "}" && open === 1) {
						value = value.join("").trim();
						if (value === "") value = undefined;
						let check = __Type(value);
						if      (check.type === "number") value = check.value;
						else if (value in types)          value = types[value];
						list[key][name] = value;
						open--;
						name   = [];
						object = true;
					} else if (v === "&" && open === 0) {
						list.push({});
						key++;
					} else if (open === 0) {
						name.push(v);
					} else if (open > 0) {
						if (v === "{" || v === "}") open += v === "{" ? +1 : -1;
						value.push(v);
					}
				});
				if (object) return list;
				let check = __Type(data);
				return check.type === "number" ? check.value : (data in types ? types[data] : data);
			}
		},



	/**}l*/
	});

/*===========================================================================*/
	/**3{Listas}3*/
/*===========================================================================*/

	/**f{b{object}b __Array(b{array}b input|b{void}b ...)}f*/
	/**p{Construtor para manipulação de textos.}p*/
	/**l{d{v{input}v - Array ou cada argumento corresponderá a um item.}d}l*/
	function __Array() {
		let input;
		if (arguments.length === 0)
			input = [];
		else if (arguments.length > 1)
			input = Array.prototype.slice.call(arguments)
		else
			input = __Type(arguments[0]).type === "array" ? arguments[0] : [arguments[0]];

		if (!(this instanceof __Array))	return new __Array(input);
		Object.defineProperties(this, {
			_value: {value: input, writable: true}
		});
	}
	/**6{Métodos e atributos}6 l{*/
	Object.defineProperties(__Array.prototype, {
		constructor: {value: __Array},
		/**t{b{void}b valueOf(b{integer}b n)}t d{Retorna a lista ou o seu item, se definido.}d*/
		/**L{d{v{n}v - (Opcional) Identificador do item, se negativo, a referência inicia no fim da lista.}d}L*/
		valueOf: {
			value: function(n) {
				n = __Type(n).finite ? __Number(n) : null;
				return n === null ? this._value : this._value[n < 0 ? this.length + n.int : n.int]
			}
		},
		/**t{b{void}b toString()}t d{Retorna a lista em formato JSON.}d*/
		toString: {
			value: function() {return JSON.stringify(this._value);}
		},
		/**t{b{string}b length}t d{Retorna a quantidade de itens da lista.}d*/
		length: {
			get: function() {return this._value.length;}
		},
		/**t{b{array}b only(b{string}b type, b{boolean}b keep)}t d{Retorna uma lista somente com os tipos de itens definidos.}d L{*/
		/**d{v{type}v - Tipo do item a se manter na lista (ver atributos de i{__Type}i.}d*/
		/**d{v{keep}v - (opcional) Se verdadeiro, o item não casado com i{type}i será mantido com valor c{null}c (padrão c{false}c).}d}L*/
		only: {
			value: function(type, keep) {
				let list   = [];
				let change = ["finite", "number", "boolean"];
				let i = -1;
				while (++i < this.length) {
					let check = __Type(this._value[i]);
					if (type in check && check[type] === true)
						list.push(change.indexOf(type) < 0 ? this._value[i] : check.valueOf());
					else if (keep === true)
						list.push(null);
				}
				return list;
			}
		},
		/**t{b{array}b convert(b{function}b f, b{boolean}b finite)}t d{Retorna uma lista com o resultado de v{f(x)}v ou c{null}c se falhar.}d L{*/
		/**d{v{f}v - Função a ser aplicada nos valores da lista.}d*/
		/**d{v{type}v - (opcional) Tipo dos itens na lista (ver atributos de i{__Type}i.}d}L*/
		convert: {
			value: function(f, type) {
				if (__Type(f).type !== "function") return null;
				let only = arguments.length < 2 ? false : true;
				let list = only ? this.only(type, true) : this._value.slice();
				list.forEach(function(v,i,a){
					try {
						let value = f(v);
						if (only)
							a[i] = v === null || __Type(value)[type] !== true ? null : value;
						else
							a[i] = value
					} catch(e) {a[i] = null;}
				});
				return list;
			}
		},
		/**t{b{number}b min}t d{Retorna o menor finito ou c{null}c em caso de vazio.}d*/
		min: {
			get: function() {
				let list = this.only("finite");
				return list.length === 0 ? null : Math.min.apply(null, list);
			}
		},
		/**t{b{number}b max}t d{Retorna o maior finito ou c{null}c em caso de vazio.}d*/
		max: {
			get: function() {
				let list = this.only("finite");
				return list.length === 0 ? null : Math.max.apply(null, list);
			}
		},
		/**t{b{number}b sum}t d{Retorna a soma dos finitos ou c{null}c em caso de vazio.}d*/
		sum: {
			get: function() {
				let list = this.only("finite");
				if (list.length === 0) return null;
				let sum  = 0;
				list.forEach(function(v,i,a) {sum += v;});
				return sum;
			}
		},
		/**t{b{number}b avg}t d{Retorna a média dos finitos ou c{null}c em caso de vazio.}d*/
		avg: {
			get: function() {
				let list = this.only("finite");
				return list.length === 0 ? null : this.sum/list.length;
			}
		},
		/**t{b{number}b med}t d{Retorna a mediana dos finitos ou c{null}c em caso de vazio.}d*/
		med: {
			get: function() {
				let list = this.only("finite");
				if (list.length === 0) return null;
				let y    = list.sort(function(a,b) {return a < b ? -1 : 1;});
				let l    = list.length;
				return l%2 === 0 ? (y[l/2]+y[(l/2)-1])/2 : y[(l-1)/2];
			}
		},
		/**t{b{number}b harm}t d{Retorna a média harmônica dos finitos diferentes de zero ou c{null}c em caso de vazio.}d*/
		harm: {
			get: function() {
				let list = this.only("finite");
				let sum  = 0;
				list.forEach(function (v,i,a) {sum += v === 0 ? 0 : 1/v;});
				return list.length === 0 || sum === 0 ? null : list.length/sum;
			}
		},
		/**t{b{number}b geo}t d{Retorna a média geométrica do valor absoluto dos finitos diferentes de zero ou c{null}c em caso de vazio.}d*/
		geo: {
			get: function() {
				let list = this.only("finite");
				let mult = list.length === 0 ? -1 : 1;
				list.forEach(function (v,i,a) {mult = mult * (v === 0 ? 1 : v);});
				return mult < 0 && list.length%2 === 0 ? null : Math.pow(mult, 1/list.length);
			}
		},
		/**t{b{number}b gcd}t d{Retorna o máximo divisor comum do valor absoluto inteiro ou c{null}c em caso de vazio.}d*/
		gcd: {
			get: function() {
				/* obtendo valores absolutos inteiros */
				let input =  this.only("finite");
				input.forEach(function(v,i,a) {a[i] = Math.floor(Math.abs(v));});
				input = __Array(input).order;
				if (input.length < 2) return input.length === 1 ? input[0] : null;
				if (input.indexOf(0) >= 0) return 0;
				if (input.indexOf(1) >= 0) return 1;
				/* obtendo números primos */
				let primes = __Number(Math.min.apply(null, input)).primes;
				if (primes.length === 0) return 1;
				/* obtendo o mdc */
				let mdc = 1;
				let i = 0;
				/* looping pelos primos */
				while (i < primes.length) {
					let test = true;
					let stop = false;
					/* checando se todos os argumentos são divisíveis pelo primo da vez */
					let j = -1;
					while(++j < input.length) {
						if (primes[i] > input[j])     stop = true;
						if (input[j]%primes[i] !== 0)	test = false;
						if (stop || !test)            break;
					}
					/* se todos forem divisíveis, reprocessar argumentos e ajustar mdc ou chamar próximo primo */
					if (test) {
						input.forEach(function(v,k,a) {a[k] = v/primes[i];});
						mdc = mdc * primes[i];
					} else {i++;}
					/* Primo maior que um dos argumentos: parar processamento */
					if (stop) break;
				}
				return mdc;
			}
		},
		/**t{b{array}b unique}t d{Retorna a lista sem valores repetidos.}d*/
		unique: {
			get: function(){
				return this._value.filter(function(v,i,a) {return a.indexOf(v) === i;});
			}
		},
		/**t{b{array}b mode}t d{Retorna uma lista com os valores da moda (valor mais encontrado).}d*/
		mode: {
			get: function() {
				let items  = this.unique;
				let amount = [];
				items.forEach(function() {amount.push(0);})
				this._value.forEach(function(v,i,a) {amount[items.indexOf(v)]++;});
				let max = Math.max.apply(null, amount);
				return items.filter(function(v,i,a) {return amount[i] === max;});
			}
		},
		/**t{b{boolean}b check(b{void}b ...)}t d{Checa se os valores informados estão presentes na lista.}d*/
		check: {
			value: function() {
				if (arguments.length === 0) return false;
				let value = Array.prototype.slice.call(arguments);
				let check = true;
				let list  = this._value;
				value.forEach(function(v,i,a) {if (list.indexOf(v) < 0) check = false;});
				return check;
			}
		},
		/**t{b{array}b search(b{void}b value)}t d{Retorna uma lista com os índices onde o valor foi localizado.}d L{*/
		/**d{v{value}v - Valor a ser localizado.}d}L*/
		search: {
			value: function(value) {
				let index = [];
				this._value.forEach(function (v,i,a){if (v === value) index.push(i);});
				return index;
			}
		},
		/**t{b{array}b hide(b{void}b ...)}t d{Retorna uma lista ignorando os valores informados.}d*/
		hide: {
			value: function() {
				let hide = Array.prototype.slice.call(arguments);
				return this._value.filter(function(v,i,a) {return hide.indexOf(v) < 0;});
			}
		},
		/**t{b{number}b count(b{void}b value)}t d{Retorna a quantidade de vezes que o valor parece na lista.}d L{*/
		/**d{v{value}v - Valor a ser localizado.}d}L*/
		count: {
			value: function(value) {
				return this.search(value).length;
			}
		},
		/**t{b{array}b sort}t d{Ordena a lista na sequencia: número, tempo , data, texto, demais tipos.}d*/
		sort: {
			get: function() {
				let order = [
					"number", "time", "date", "string", "boolean", "null", "node",
					"array", "object", "function", "regexp", "undefined", "unknown"
				];
				let array = this._value.slice();
				return array.sort(function(a, b) {
					let atype  = __Type(a).type;
					let btype  = __Type(b).type;

					/* comparação entre tipos diferentes */
					if (atype !== btype)
						return order.indexOf(atype) > order.indexOf(btype) ? 1 : -1;
					/* comparação entre tipos iguais */
					let avalue = a;
					let bvalue = b;
					if (atype === "node") {
						avalue = __String(a.textContent.toLowerCase()).clear();
						bvalue = __String(b.textContent.toLowerCase()).clear();
					} else if (atype === "string") {
						avalue = __String(a.toLowerCase()).clear();
						bvalue = __String(b.toLowerCase()).clear();
					} else if (["number", "boolean", "date", "time"].indexOf(atype) >= 0) {
						avalue = __Type(a).valueOf();
						bvalue = __Type(b).valueOf();
					}
					return avalue > bvalue ? 1 : -1;
				});
			}
		},
		/**t{b{array}b order}t d{Retorna uma lista ordenada sem valores repetidos.}d*/
		order: {
			get: function() {
				return __Array(this.unique).sort;
			}
		},
		/**6{Métodos Modificadores da Lista}6*/
		/**t{b{array}b add(b{void}b ...)}t d{Adiciona itens (argumentos) ao fim da lista e a retorna.}d*/
		add: {
			value: function() {
				this._value.push.apply(this._value, arguments);
				return this._value;
			}
		},
		/**t{b{array}b addTop(b{void}b ...)}t d{Adiciona itens (argumentos) ao início da lista e a retorna.}d*/
		addTop: {
			value: function() {
				this._value.unshift.apply(this._value, arguments);
				return this._value;
			}
		},
		/**t{b{array}b concat(b{void}b ...)}t d{Concatena listas.}d*/
		concat: {
			value: function() {
				this._value = this._value.concat.apply(this._value, arguments);
				return this._value;
			}
		},
		/**t{b{array}b replace(b{void}b from, b{void}b to)}t d{Altera os valores da lista conforme especificado e a retorna.}d L{*/
		/**d{v{from}v - Valor a ser alterado.}d*/
		/**d{v{to}v - Valor a ser definido.}d}L*/
		replace: {
			value: function (from, to) {
				this._value.forEach(function(v,i,a) {if (v === from) a[i] = to;});
				return this._value;
			}
		},
		/**t{b{array}b delete(b{void}b ...)}t d{Remove itens (argumentos) da lista e a retorna.}d*/
		delete: {
			value: function() {
				let list = this.hide.apply(this, arguments);
				while(this._value.length !== 0) this._value.pop();
				this.add.apply(this, list);
				return this._value;

			}
		},
		/**t{b{array}b toggle(b{void}b ...)}t d{Remove, se existente, ou insere, se ausente, itens (argumentos) da lista e a retorna.}d*/
		toggle: {
			value: function() {
				let tgl  = Array.prototype.slice.call(arguments);
				let self = this;
				tgl.forEach(function(v,i,a) {
					if (self._value.indexOf(v) < 0) self.add(v); else self.delete(v);
				});
				return this._value;
			}
		},
	/**}l*/
	});

/*===========================================================================*/
	/**3{Nós HTML}3*/
/*===========================================================================*/

	/**f{b{object}b __Node(b{array}b input|b{void}b ...)}f*/
	/**p{Construtor para manipulação de nós  HTML}p*/
	/**l{d{v{input}v - Array ou cada argumento corresponderá a um item.}d}l*/
	function __Node(input) {
		if (!(this instanceof __Node))	return new __Node(input);
		let check = __Type(input);
		if (check.type !== "node") input = document.body;
		Object.defineProperties(this, {
			_value: {value: input}
		});
	}
	/**6{Métodos e atributos}6 l{*/
	Object.defineProperties(__Node.prototype, {
		constructor: {value: __Node},
		valueOf: {
			value: function() {return this._value.valueOf();}
		},
		toString: {
			value: function() {return this._value.outerHTML;}
		},
		/**t{b{string}b tag}t d{Retorna o nome do elemento HTML.}d*/
		tag: {
			get: function() {return this._value.tagName.toLowerCase();}
		},
		/**t{b{void}b attribute(b{string}b attr, b{void}b value)}t*/
		/**d{Retorna ou define um atributo HTML, retorna c{null}c se inexistente.}dL{*/
		/**d{v{attr}v - Nome do atributo a ser definido ou retornado.}d*/
		/**d{v{value}v - (Opcional) Valor do atributo. Se ausente, retornará o atributo, se nulo, apagará o atributo.}d}L*/
		attribute: {
			value: function(attr, value) {
				if (arguments.length === 0) return null;
				attr = String(attr);
				if (arguments.length === 1)
					return attr in this._value.attributes ? this._value.attributes[attr].value : null;
				if (value === null)
					this._value.removeAttribute(attr);
				else
					this._value.setAttribute(attr, value);
				return this.attribute(attr);
			}
		},
		/**t{b{void}b object(b{string}b attr, b{void}b ...)}t*/
		/**d{Retorna ou define um atributo ou método do objeto HTML, retorna c{null}c se inexistente.}d*/
		/**L{d{v{attr}v - Nome do atributo ou função a ser definido ou retornado.}d*/
		/**d{Os demais argumentos correspondem ao valor do atributo ou aos argumentos do método.}d}L*/
		object: {
			value: function(attr) {
				if (arguments.length === 0) return null;
				attr = String(attr);
				if (!(attr in this._value)) return null;
				let type = __Type(this._value[attr]).type;
				if (arguments.length === 1)
					return type === "function" ? this._value[attr]() : this._value[attr];
				if (type !== "function") {
					this._value[attr] = arguments[1];
					return this.object(attr);
				}
				let args = Array.prototype.slice.call(arguments);
				args.shift();
				return this._value[attr].apply(this._value, args);
			}
		},
		/**t{b{string}b css}t d{Retorna e organiza, se for o caso, o valor do atributo HTML i{class}i.}d*/
		css: {
			get: function() {
				let css = this.attribute("class");
				if (css === null) return "";
				let value = __String(css).clear().split(" ");
				value = __Array(value).order.join(" ");
				if (css !== value) this.attribute("class", value);
				return value;
			}
		},
		/**t{b{string}b cssAdd(b{string}b ...)}t d{Adiciona atributos CSS (argumentos) ao elemento HTML.}d*/
		cssAdd: {
			value: function() {
				let css = this.css.split(" ");
				css.push.apply(css, arguments);
				this.attribute("class", css.join(" "));
				return this.css;
			}
		},
		/**t{b{string}b cssDelete(b{string}b ...)}t d{Remove atributos CSS (argumentos) do elemento HTML.}d*/
		cssDelete: {
			value: function() {
				let css  = this.css.split(" ");
				let list = __Array(css);
				list.delete.apply(list, arguments);
				this.attribute("class", list.order.join(" "));
				return this.css;
			}
		},
		/**t{b{string}b cssToggle(b{string}b ...)}t d{Alterna atributos CSS (argumentos) no elemento HTML.}d*/
		cssToggle: {
			value: function() {
				let css  = this.css.split(" ");
				let list = __Array(css);
				list.toggle.apply(list, arguments);
				this.attribute("class", list.order.join(" "));
				return this.css;
			}
		},
		/**t{b{boolean}b cssCheck(b{string}b ...)}t d{Checa a existência de atributos CSS (argumentos) no elemento HTML.}d*/
		cssCheck: {
			value: function() {
				let css  = this.css.split(" ");
				let list = __Array(css);
				return list.check.apply(list, arguments);
			}
		},
		/**t{b{string}b style(b{object}b styles)}t d{Define o atributo i{style}i do elemento HTML e retorna seu valor.}d*/
		/**L{d{v{styles}v - Objeto contendo os estilos (atributo) e seu valor. Se c{null}c, todos os estilos serão apagados.}d}L*/
		style: {
			value: function(styles) {
				if (styles === null) {
					while (this._value.style.length > 0)
						this._value.style[this._value.style[0]] = null;
				} else if (__Type(styles).type === "object") {
					for (let i in styles) {
						let attr = __String(i).camel;
						this._value.style[attr] = styles[i];
					}
				}
				return this.attribute("style");
			}
		},
		/**t{b{string}b dataset(b{object}b data)}t d{Define o objeto i{dataset}i do elemento HTML e retorna seu valor.}d*/
		/**L{d{v{data}v - Objeto contendo os atributos e seus valores. Se c{null}c, todos os atributos serão apagados.}d}L*/
		dataset: {
			value: function(data) {//FIXME se data for indefindo retornar tudo
				if (data === null) {
					let list = {};
					for (let i in this._value.dataset) list[i] = null;
					return this.dataset(list);
				} else if (__Type(data).type === "object") {
					for (let i in data) {
						let attr  = __String(i).camel;
						if (data[i] !== null)
							this._value.dataset[attr] = data[i];
						else if (attr in this._value.dataset)
							delete this._value.dataset[attr];
						/* FIXME MUITO IMPORTANTE executar verificação após definição */
						settingProcedures(this._value, attr);
					}
				}
				return JSON.stringify(this._value.dataset);
			}
		},
		/**t{b{void}b handler(b{object}b events, b{boolean}b remove)}t d{Define ou remove disparadores ao elemento HTML.}d L{*/
		/**d{v{events}v - Objeto contendo o evento (atributos) e seus disparadores (valores).}d*/
		/**d{v{remove}v - (Opcional) Se verdadeiro, o disparador será removido do evento.}d}L*/
		handler: {
			value: function(events, remove) {
				if (__Type(events).type === "object") {
					for (let i in events) {
						if (__Type(events[i]).type !== "function") continue;
						let event  = String(i).trim().toLowerCase().replace(/^on/, "");
						let method = remove === true ? "removeEventListener" : "addEventListener";
						this._value[method](event, events[i], false);
					}
				}
			}
		},
		/**t{b{string}b wdNotation(b{void}b attr)}t d{Retorna a notação de mesmo nome de i{__String}i presente em i{dataset}i.}d*/
		/**L{d{v{attr}v - Valor do atributo de i{dataset}i que, se inexistente, retornará nulo.}d}L*/
		wdNotation: {
			value: function(attr) {
				if (!(attr in this._value.dataset)) return null;
				return __String(this._value.dataset[attr]).wdNotation;
			}
		},
		value: {
			value: function(input) { //FIXME isso está muito, mas muito ruim
				let forms = ["select", "textarea", "input", "button"];
				if (forms.indexOf(this.tag) < 0) return null;
				let setme = arguments.length > 0;
				let value = this._value.value;
				switch(this.tag) {
					case "select": {
						let values   = [];
						let multiple = this._value.multiple;
						let length   = this._value.length;
						let i = -1;
						while (++i < length) {
							let item = this._value[i];
							if (!setme)
								if (item.selected) values.push(item.value);
							else if (multiple)
								if (item.value === input) item.selected = true;
							else
								item.selected = item.value === input;
						}
						return set ? this.value() : values;
					}
					case "input": {
						let atype = this.attribute("type");
						let otype = this.object("type");
						switch(type) {





						}
					}
				}

				if (setme) this._value.value = input;
				return this._value.value;




				/*let config = {send: 0, load: 1, mask: 2, text: 3, value: 4};
				let f = false;
				let t = true;
				let n = null;
				let h = "innerHTML";
				let t = "textContent";
				let v = "value";
				let e = this._value;
				data.meter    = {types: N, send: F, load: N, mask: N, text: N, value: N};
				data.progress = {types: N, send: F, load: N, mask: N, text: N, value: N};
				data.output   = {types: N, send: F, load: N, mask: N, text: N, value: N};
				data.option   = {types: N, send: F, load: N, mask: t, text: t, value: N};
				data.form     = {types: N, send: F, load: i, mask: N, text: N, value: N};
				data.textarea = {types: N, send: T, load: v, mask: v, text: v, value: N};
				data.select   = {types: N, send: T, load: i, mask: N, text: N, value: "vselect"};

				data.button         = {types: T};
				data.button.button  = {send: F, load: N, mask: t, text: t, value: N};
				data.button.reset   = {send: F, load: N, mask: t, text: t, value: N};

				data.button.submit  = {send: F, load: N, mask: t, text: t, value: N};
				data.input          = {types: T};
				data.input.button   = {send: F, load: N, mask: v, text:v, value: N};
				data.input.reset    = {send: F, load: N, mask: v, text:v, value: N};
				data.input.submit   = {send: F, load: N, mask: v, text:v, value: N};
				data.input.image    = {send: F, load: N, mask: N, text:N, value: N};
				data.input.color    = {send: T, load: N, mask: N, text:v, value: N};
				data.input.radio    = {send: T, load: N, mask: N, text:N, value: "vcheck"};
				data.input.checkbox = {send: T, load: N, mask: N, text:N, value: "vcheck"};
				data.input.date     = {send: T, load: N, mask: v, text:v, value: "vdate"};
				data.input.datetime = {send: T, load: N, mask: v, text:v, value: "vdatetime"};
				data.input.month    = {send: T, load: N, mask: v, text:v, value: "vmonth"};
				data.input.week     = {send: T, load: N, mask: v, text:v, value: "vweek"};
				data.input.time     = {send: T, load: N, mask: v, text:v, value: "vtime"};
				data.input.range    = {send: T, load: N, mask: N, text:v, value: "vnumber"};
				data.input.number   = {send: T, load: N, mask: v, text:v, value: "vnumber"};
				data.input.file     = {send: T, load: N, mask: N, text:N, value: "vfile"};
				data.input.url      = {send: T, load: N, mask: v, text:v, value: "vurl"};
				data.input.email    = {send: T, load: N, mask: v, text:v, value: "vemail"};
				data.input.tel      = {send: T, load: N, mask: v, text:v, value: N};

				data.input.text     = {send: T, load: N, mask: v, text:v, value: N};
				data.input.search   = {send: T, load: N, mask: v, text:v, value: N};
				data.input.password = {send: T, load: N, mask: N, text:N, value: N};
				data.input.hidden   = {send: T, load: N, mask: N, text:v, value: N};
				data.input["datetime-local"] = {send: T, load: N, mask: v, text:v, value: "vdatetime"};

*/



			}



		},




		value: {
			value: function(input) {





			}
		},



















		/**t{b{array}b _form_select}t d{Retorna uma lista das opções selecionadas ou nulo se não for um i{select}i.}d*/
		_form_select: {
			get: function() {
				if (this.tag !== "select") return null;
				let value = [];
				let i = -1;
				while (++i < this._value.length)
					if (this._value[i].selected) value.push(this._value[i].value);
				return value;
			}
		},
		/**t{b{array}b _form_textarea}t d{Retorna o valor do campo ou nulo se não for um i{textarea}i.}d*/
		_form_textarea: {
			get: function() {
				if (this.tag !== "textarea") return null;
				return this._value.value;
			}
		},


/*
				let data = {}


				data.meter    = {types: N, send: F, load: N, mask: N, text: N, value: N};
				data.progress = {types: N, send: F, load: N, mask: N, text: N, value: N};
				data.output   = {types: N, send: F, load: N, mask: N, text: N, value: N};
				data.option   = {types: N, send: F, load: N, mask: t, text: t, value: N};

				data.form     = {types: N, send: F, load: i, mask: N, text: N, value: N};
				data.textarea = {types: N, send: T, load: v, mask: v, text: v, value: N};
				data.select   = {types: N, send: T, load: i, mask: N, text: N, value: "vselect"};



				select: [1,0,0],
				button: false,
				data.input.reset    = {send: F, load: N, mask: v, text:v, value: N};
				data.input.submit   = {send: F, load: N, mask: v, text:v, value: N};
				data.input.image    = {send: F, load: N, mask: N, text:N, value: N};
				data.input.color    = {send: T, load: N, mask: N, text:v, value: N};
				data.input.radio    = {send: T, load: N, mask: N, text:N, value: "vcheck"};
				data.input.checkbox = {send: T, load: N, mask: N, text:N, value: "vcheck"};
				data.input.date     = {send: T, load: N, mask: v, text:v, value: "vdate"};
				data.input.datetime = {send: T, load: N, mask: v, text:v, value: "vdatetime"};
				data.input.month    = {send: T, load: N, mask: v, text:v, value: "vmonth"};
				data.input.week     = {send: T, load: N, mask: v, text:v, value: "vweek"};
				data.input.time     = {send: T, load: N, mask: v, text:v, value: "vtime"};
				data.input.range    = {send: T, load: N, mask: N, text:v, value: "vnumber"};
				data.input.number   = {send: T, load: N, mask: v, text:v, value: "vnumber"};
				data.input.file     = {send: T, load: N, mask: N, text:N, value: "vfile"};
				data.input.url      = {send: T, load: N, mask: v, text:v, value: "vurl"};
				data.input.email    = {send: T, load: N, mask: v, text:v, value: "vemail"};
				data.input.tel      = {send: T, load: N, mask: v, text:v, value: N};
				data.input.text     = {send: T, load: N, mask: v, text:v, value: N};
				data.input.search   = {send: T, load: N, mask: v, text:v, value: N};
				data.input.password = {send: T, load: N, mask: N, text:N, value: N};
				data.input.hidden   = {send: T, load: N, mask: N, text:v, value: N};
				data.input["datetime-local"] = {send: T, load:




			}
		},



		_fdata: {
			get: function() {
				let forms = ["select", "textarea", "input"];
				return forms.indexOf(this.tag) >= 0 ? true : false;
			}
		},
		_ftype: {
			get: function() {
				if (!this.fdata) return null;
				if (this.tag !== "input") return this.tag;
				let atype = this.attribute("type").toLowerCase();
				let otype = this.object("type").toLowerCase();



			}
		},





/*



		*/











	/**}l*/
	});



//FIXME apagar após reestruturação
	function __finite(value) {
		let input = __Type(value);
		return input.finite;
	}




//FIXME fazer um objeto __$$ e __$ que herdará de __HTML
/*----------------------------------------------------------------------------*/
	/**f{b{node}b __$$(b{string}b selector, b{node}b root)}f*/
	/**p{Retorna uma lista de elementos do tipo obtida em i{querySelectorAll}i, vazia em caso de erro.}p l{*/
	/**d{v{selector}v - Seletor CSS para busca de elementos.}d*/
	/**d{v{root}v - (opcional, i{document}i) Elemento base para busca.}d}l*/
	function __$$(selector, root) {
		let elem = null;
		try {elem = root.querySelectorAll(selector);}
		catch(e) {
			try {elem = document.querySelectorAll(selector);}
			catch(e) {}
		}
		let test = __Type(elem);
		return test.type === "node" ? elem : document.querySelectorAll("#_._");
	}
/*----------------------------------------------------------------------------*/
	/**f{b{node}b __$(b{string}b selector, b{node}b root)}f*/
	/**p{Retorna um elemento do tipo obtido em i{querySelector}i ou o retorno de i{__$$}i em caso de erro.}p l{*/
	/**d{v{selector}v - Seletor CSS para busca do elemento.}d*/
	/**d{v{root}v - (opcional, i{document}i) Elemento base para busca.}d}l*/
	function __$(selector, root) {
		let elem = null;
		try {elem = root.querySelector(selector);}
		catch(e) {
			try {elem = document.querySelector(selector);}
			catch(e) {}
		}
		let test = __Type(elem);
		return test.type === "node" ? elem : __$$(selector, root);
	}
/*----------------------------------------------------------------------------*/
	/**f{b{node}b __$$$(b{object}b obj, b{node}b root)}f*/
	/**p{Localiza em um objeto os atributos v{$}v e v{$$}v e utiliza seus valores como seletores CSS.}p*/
	/**p{O atributo v{$$}v é prevalente sobre o v{$}v para fins de chamada das funções i{__$$}i ou i{__$}i, respectivamente.}p l{*/
	/**d{v{obj}v - Objeto javascript contendo os atributos v{$}v ou v{$$}v.}d*/
	/**d{v{root}v - (opcional, i{document}i) Elemento base para busca.}d}l*/
	function __$$$(obj, root) {
		let one =  "$" in obj ? String(obj["$"]).trim()  : null;
		let all = "$$" in obj ? String(obj["$$"]).trim() : null;
		let key = {"document": document, "window":  window};
		if (one !== null && one in key) one = key[one];
		if (all !== null && all in key) all = key[all];
		return all === null ? __$(one, root) : __$$(all, root);
	}
/*----------------------------------------------------------------------------*/
	/**4{Matemática}4*/
/*----------------------------------------------------------------------------*/
	/**f{b{integer}b __integer(b{number}b value)}f*/
	/**p{Retorna a parte inteira do número ou c{null}c se outro tipo de dado.}p*/
	/**l{d{v{value}v - Valor a ser verificado.}d}l*/
	function __integer(value) {
		let input = __Type(value);
		if (input.type !== "number") return null;
		if (!input.finite) return input.value;
		return (input < 0 ? -1 : 1) * Math.floor(Math.abs(input.value));
	}
/*----------------------------------------------------------------------------*/
	/**f{b{float}b __decimal(b{number}b value)}f*/
	/**p{Retorna a parte decimal do número ou c{null}c se outro tipo de dado.}p*/
	/**l{d{v{value}v - Valor a ser verificado.}d}l*/
	function __decimal(value) {
		let input = __Type(value);
		if (input.type !== "number") return null;
		if (!input.finite) return input.value;
		let exp = 1;
		while ((input * exp)%1 !== 0) exp = 10*exp;
		return (exp*(input.value) - exp*__integer(input.value)) / exp;
	}
/*----------------------------------------------------------------------------*/
		/**f{b{number}b __cut(b{number}b value, b{integer}b n, b{boolean}b cut)}f*/
		/**p{Corta o número de casas decimais conforme especificado ou retorna c{null}c se não for número.}p l{*/
		/**d{v{value}v - Valor a ser checado.}d*/
		/**d{v{n}v - (v{&ge; 0}v) Número de casas decimais a arrendondar.}d*/
		/**d{v{round}v - (opcional, c{true}c), Se falso, não arrendondará o valor.}d}l*/
		function __cut(value, n, round) {
			let input = __Type(value);
			if (input.type !== "number") return null;
			if (!input.finite) return input.value;
			let digit = __Type(n);
			digit = !digit.finite || digit < 0 ? 0 : __integer(digit.value);
			if (round === false) {
				let i = -1;
				let base = 1;
				while (++i < n) base = 10*base;
				return __integer(base*input.value)/base;
			}
			return Number(input.valueOf().toFixed(digit));
		}
/*----------------------------------------------------------------------------*/
	/**f{b{string}b __primes(b{integer}b value)}f*/
	/**p{Retorna uma lista com os números primos até o limite do argumento.}p*/
	/**l{d{v{value}v - (v{&infin; &gt; value &gt; 1}v) Define o limite da lista.}d}l*/
	function __primes(value) {
		let input = __Type(value);
		if (!input.finite || input < 2) return [];
		let list = [2];
		let i    = 3;
		while (i <= input) {
			let isPrime = true;
			let j = 0; /* não checar o 2 */
			while (++j < list.length) {
				if (i % list[j] === 0) {
					isPrime = false;
					break;
				}
			}
			if (isPrime) list.push(i);
			i += 2; /* não checar par */
		}
		return list;
	}
/*----------------------------------------------------------------------------*/
	/**f{b{boolean}b __prime(b{integer}b value)}f*/
	/**p{Checa se o valor é um número primo.}p*/
	/**l{d{v{value}v - Valor a ser checado.}d}l*/
	function __prime(value) {
		let input = __Type(value);
		if (!input.finite || input < 2 || __decimal(input.value) !== 0) return false;
		let list = __primes(input.value);
		return list[list.length - 1] === input.value ? true : false;
	};
/*----------------------------------------------------------------------------*/
	/**f{b{integer}b __gcd(b{integer}b ...)}f*/
	/**p{Retorna o máximo divisor comum dos argumentos.}p*/
	/**p{Os decimais dos números serão desconsiderados assim como valores infinitos.}p*/
	function __gcd() {
		/* analisando argumentos */
		let input =  [];
		let i     = -1;
		while (++i < arguments.length) {
			let data = __Type(arguments[i]);
			if (!data.finite) continue;
			let number = __integer(Math.abs(data.value));
			if (number === 0 || number === 1) return number;
			input.push(number);
		}
		if (input.length < 2)
			return input.length === 1 ? input[0] : 1;
		/* obtendo números primos */
		let min    = Math.min.apply(null, input);
		let primes = __primes(min);
		if (primes.length === 0) return 1;
		/* obtendo o mdc */
		let mdc = 1;
		i = 0;
		/* looping pelos primos */
		while (i < primes.length) {
			let test = true;
			let stop = false;
			/* checando se todos os argumentos são divisíveis pelo primo da vez */
			let j    = -1;
			while(++j < input.length) {
				if (primes[i] > input[j])     stop = true;
				if (input[j]%primes[i] !== 0)	test = false;
				if (stop || !test)            break;
			}
			/* se todos forem divisíveis, reprocessar argumentos e ajustar mdc ou chamar próximo primo */
			if (test) {
				let k = -1;
				while(++k < input.length)
					input[k] = input[k]/primes[i];
				mdc = mdc * primes[i];
			} else {
				i++;
			}
			/* Primo maior que um dos argumentos: parar processamento */
			if (stop) break;
		}
		return mdc;
	}
/*----------------------------------------------------------------------------*/
	/**4{Notação}4*/
/*----------------------------------------------------------------------------*/
	/**f{b{string}b __frac(b{number}b value, b{integer}b limit)}f*/
	/**p{Retorna a notação em fração do número ou v{"0"}v em caso de inconsistência.}p l{*/
	/**d{v{value}v - Valor a ser checado.}d*/
	/**d{v{limit}v - (opcional, v{3, 1 &le; limit &le; 5}v) Limitador de casas decimais significativas.}d}l*/
	function __frac(value, limit) {
		let input = __Type(value);
		if (input.type !== "number") return "0";
		if (!input.finite) return input.toString();
		let int = Math.abs(__integer(input.value));
		let flt = Math.abs(__decimal(input.value));
		if (flt === 0) return int.toString();
		/* checando argumento limitador */
		let min = 1;
		let max = 5;
		let lim = (min+max)/2;
		let check = __Type(limit);
		if (check.finite && check.value !== lim)
			lim = check < min ? min : (check > max ? max : __integer(check.value));
		/* divisor, dividendo e números significativos */
		let div = 1;
		let dnd = flt * div;
		let len = 0;
		while(dnd%1 !== 0) {
			div = 10*div;
			dnd = flt * div;
			/* checando limites */
			if (__integer(dnd) !== 0) {
				len++;
				if (len >= lim) {
					dnd = __integer(dnd);
					break;
				}
			}
		}
		/* obtendo o máximo divisor comum e a fração */
		let gcd = __gcd(div, dnd);
		int = int === 0 ? "" : int.toString()+" ";
		dnd = String(dnd/gcd);
		div = String(div/gcd);
		return (input < 0 ? "-" : "")+int+dnd+"/"+div;
	}
/*----------------------------------------------------------------------------*/
	/**f{b{string}b __bytes(b{integer}b value)}f*/
	/**p{Retorna a notação em bytes de um número inteiro ou v{"0 B"}v se ocorrer um erro.}p*/
	/**l{d{v{value}v - Valor numérico em bytes.}d}l*/
	function __bytes(value) {
		let input = __Type(value);
		if (input.finite) return "0 B";
		value = input < 1 ? 0 : __integer(input.value);
		let scale = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
		let i     = scale.length;
		while (--i >= 0)
			if (value >= Math.pow(1024,i))
				return (value/Math.pow(1024,i)).toFixed(2)+" "+scale[i];
		return value+" B";
	}
/*----------------------------------------------------------------------------*/
	/**f{b{string}b __number(b{number}b value)}f*/
	/**p{Retorna o tipo de número: v{"&#177;integer", "&#177;float", "&#177;infinity", "&#177;real", "zero" e "not numeric"}v.}p*/
	/**l{d{v{value}v - Valor a ser checado.}d}l*/
	function __number(value) {
		let input = __Type(value);
		if (input.type !== "number")         return "not numeric";
		let sign = input < 0 ? "-" : "+";
		if (input == 0)                      return "zero";
		if (!input.finite)                   return sign+"infinity";
		if (input == __integer(input.value)) return sign+"integer";
		if (input == __decimal(input.value))   return sign+"float";
		return sign+"real";
	}
/*----------------------------------------------------------------------------*/
	/**f{b{string}b __precision(b{number}b value, b{integer}b n)}f*/
	/**p{Fixa a quantidade de dígitos significativos do número. Retorna v{null}v se falhar.}p l{*/
	/**d{v{value}v - Valor a ser checado.}d*/
	/**d{v{n}v - (v{&gt; 0}v) Número de dígitos a formatar.}d}l*/
	function __precision(value, n) {
		let input = __Type(value);
		let digit = __Type(n);
		if (input.type !== "number") return null;
		if (!__finite(digit.value) || digit.value < 1) return null;
		digit = __integer(digit.value);
		input = input.value;
		if (Math.abs(input) < 1 && input !== 0) {
			return Math.abs(input) < Math.pow(10, -digit+1) ? input.toExponential(digit-1) : input.toFixed(digit-1);


		} //FIXME tem que decidir o que quer aqui

		return input.toPrecision(digit);
	}
/*----------------------------------------------------------------------------*/
	/**f{b{string}b __notation(b{number}b value, b{string}b lang, b{string}b type, b{void}b code)}f*/
	/**p{Retorna o número conforme linguagem e formatação ou c{null}c se um erro ocorrer a{https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat}a.}pl{*/
	/**d{v{value}v - Valor a ser checado.}d*/
	/**d{v{lang}v - Código da linguagem a ser aplicada.}d*/
	/**d{v{type}v - Tipo da formatação:}d L{*/
	/**d{v{"significant"}v - fixa número de dígitos significativos.}d*/
	/**d{v{"decimal"}v - fixa número de casas decimais.}d*/
	/**d{v{"integer"}v - fixa número de dígitos inteiros.}d*/
	/**d{v{"percent"}v - transforma o número em notação percentual.}d*/
	/**d{v{"unit"}v - define a unidade de medida.}d*/
	/**d{v{"scientific"}v - notação científica.}d*/
	/**d{v{"engineering"}v - notação de engenharia.}d*/
	/**d{v{"compact"}v - notação compacta curta ou longa.}d*/
	/**d{v{"currency"}v - Notação monetária.}d*/
	/**d{v{"ccy"}v - Notação monetária curta.}d*/
	/**d{v{"nameccy"}v - Notação monetária textual.}d }L*/
	/**d{v{code}v - depende do tipo da formatação:}dL{*/
	/**d{v{"significant"}v - quantidade de números significativos.}d*/
	/**d{v{"decimal"}v - número de casas decimais.}d*/
	/**d{v{"integer"}v - número de dígitos inteiros.}d*/
	/**d{v{"percent"}v - número de casas decimais.}d*/
	/**d{v{"unit"}v - nome da unidade de medida a{https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier}a.}d*/
	/**d{v{"scientific"}v - número de casas decimais.}d*/
	/**d{v{"engineering"}v - número de casas decimais.}d*/
	/**d{v{"compact"}v - Longa (v{"long"}v) ou curta (v{"short"}v).}d*/
	/**d{v{"currency"}v - Código monetário a{https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=currency-codes}a.}d*/
	/**d{v{"ccy"}v - Código monetário.}d*/
	/**d{v{"nameccy"}v - Código monetário.}d }L}l*/
	function __notation(value, lang, type, code) {
		let input = __Type(value);
		if (input.type !== "number") return null;
		if (!input.finite) return input.value.toString();
		let types = {
			significant: {minimumSignificantDigits: code, maximumSignificantDigits: code},
			decimal:     {style: "decimal",  minimumFractionDigits: code, maximumFractionDigits: code},
			integer:     {style: "decimal",  minimumIntegerDigits: code, },
			percent:     {style: "percent",  minimumFractionDigits: code, maximumFractionDigits: code},
			unit:        {style: "unit",     unit: code},
			scientific:  {style: "decimal",  notation: "scientific", minimumFractionDigits: code, maximumFractionDigits: code},
			engineering: {style: "decimal",  notation: "engineering", minimumFractionDigits: code, maximumFractionDigits: code},
			compact:     {style: "decimal",  notation: "compact", compactDisplay: code === "short" ? code : "long"},
			currency:    {style: "currency", currency: code, signDisplay: "exceptZero", currencyDisplay: "symbol"},
			ccy:         {style: "currency", currency: code, signDisplay: "exceptZero", currencyDisplay: "narrowSymbol"},
			nameccy:     {style: "currency", currency: code, signDisplay: "auto", currencyDisplay: "name"}
		};
		type = String(type).toLowerCase();
		try {
			return input.value.toLocaleString(lang, (type in types ? types[type] : {}));
		} catch(e) {}
		try {
			input.value.toLocaleString(undefined, (type in types ? types[type] : {}));
		} catch (e) {}
		return input.value.toLocaleString();
	}
/*----------------------------------------------------------------------------*/
	/**4{Conjunto de Dados}4*/
/*----------------------------------------------------------------------------*/
	/**f{b{matrix}b __setFinite(b{array}b ...)}f*/
	/**p{Analisa a série de arrays informada e a transforma numa matriz de números finitos.}p*/
	/**p{Apenas arrays com comprimento maior que zero serão apreciados na construção da matriz.}p*/
	/**p{Cada array informado corresponderá a uma coluna da matriz, na ordem informada.}p*/
	/**p{Linhas com valores não finitos serão eliminadas na construção da matriz em todas as colunas.}p*/
	/**p{Retornará c{null}c em caso de matriz vazia.}p*/
	function __setFinite() {
		let dataset = [];       /* captura apenas os argumentos válidos (array com itens) */
		let error   = [];       /* captura os itens não finitos de cada array */
		let upper   = Infinity; /* captura o menor dentre os últimos itens válidos de cada array */
		/* se o argumento é um array e contém itens, inserir em dataset */
		let i = -1;
		while (++i < arguments.length) {
			let input = __Type(arguments[i]);
			if (input.type === "array" && arguments[i].length > 0)
				dataset.push(arguments[i]);
		}
		if (dataset.length === 0) return null;
		/* se o item de cada array não é finito, registrá-lo para ser ignorado */
		i = -1;
		while (++i < dataset.length) {
			let item = -1;
			let j = -1;
			while (++j < dataset[i].length) {
				let data = __Type(dataset[i][j]);
				dataset[i][j] = data.finite ? data.value : null;
				if (!data.finite) {error.push(j);} else {item = j;}
			}
			/* se algum array não tiver finitos, não continuar */
			if (item < 0) return null;
			upper = item < upper ? item : upper;
		}
		/* se o maior item válido dentre os array é zero, cancelar */
		if (upper < 0) return null;
		/* se o item não estiver para ser ignorado, adicionar à matriz até o limite superior */
		let matrix = [];
		i = -1;
		while (++i < dataset.length) {
			matrix.push([]);
			let j = -1;
			while (++j < (upper+1)) {
				if (error.indexOf(j) < 0) matrix[i].push(dataset[i][j]);
			}
		}
		if (matrix[0].length === 0) return null;
		return matrix;
	}
/*----------------------------------------------------------------------------*/
	/**f{b{matrix}b __setSort(b{array}b ...)}f*/
	/**p{Analisa a série de arrays informada e a transforma numa matriz de números finitos ordenada pela primeira coluna.}p*/
	/**p{Quanto aos argumentos e retorno, observar i{__setFinite}i.}p */
	function __setSort() {
		let matrix = __setFinite.apply(null, arguments);
		if (matrix === null) return null;
		/* obter a ordenação da primeira coluna */
		let order = [];
		let i = -1;
		while (++i < matrix[0].length)
			order.push({item: i, value: matrix[0][i]});
		order = order.sort(function (a, b) {return a.value < b.value ? -1 : 1;});
		/* criar uma matriz odenada */
		let sort = [];
		i = -1;
		while(++i < matrix.length) {
			sort.push([]);
			let j = -1;
			while(++j < order.length)
				sort[i].push(matrix[i][order[j].item]);
		}
		return sort;
	}
/*----------------------------------------------------------------------------*/
	/**f{b{matrix}b __setUnique(b{array}b ...)}f*/
	/**p{Analisa a série de arrays informada e a transforma numa matriz de números finitos não repetidos.}p*/
	/**p{A referência para a não repetição a primeira coluna da matriz.}p*/
	/**p{Quanto aos argumentos e retorno, observar i{__setFinite}i.}p */
	function __setUnique() {
		/* transformar os argumentos numa matrix só de números finitos */
		let matrix = __setFinite.apply(null, arguments);
		if (matrix === null) return null;
		matrix[0].forEach(function(v,i,a) {
			if (a.indexOf(v) !== i) a[i] = null;
		});
		return __setFinite.apply(null, matrix);
	}
/*----------------------------------------------------------------------------*/
	/**f{b{matrix}b __setFunction(b{array}b x, b{function}b f, b{booelan}b finite)}f*/
	/**p{Retorna uma matriz de duas colunas formada pelos valores de v{x}v e do resultado de v{f(x)}v.}p l{*/
	/**d{v{x}v - Conjunto de números base (coluna 0).}d*/
	/**d{v{f}v - Função a ser operada sobre os valores de v{x}v (coluna 1).}d*/
	/**d{v{finite}v - (opcional) Se falso, a matriz retornará todos os valores obtidos, inclusive os não finitos como nulos.}d}l*/
	function __setFunction(x, f, finite) {
		let check = __Type(x);
		let input = __Type(f);
		if (check.type !== "array" || input.type !== "function") return null;
		let y = [];
		let i = -1;
		while (++i < x.length) {
			let item = __Type(x[i]);
			if (item.finite) {
				x[i] = item.value;
				try {
					let data = __Type(f(item.value));
					y.push(data.finite ? data.value : null);
				} catch(e) {
					y.push(null);
				}
			} else {
				x[i] = null;
				y.push(null);
			}
		}
		return finite === false ? [x,y] : __setFinite(x, y);
	}
/*----------------------------------------------------------------------------*/



















/*----------------------------------------------------------------------------*/
	/**f{b{object}b __leastSquares(b{array}b x, b{array}b y)}f*/
	/**p{Retorna um objeto com as constantes angular (v{a}v) e linear (v{b}v) do método dos mínimos quadrados (v{y=ax+b}v).}p l{*/
	/**d{v{x}v - Conjunto de dados da coordenada horizontal.}d*/
	/**d{v{y}v - Conjunto de dados da coordenada vertical.}d}l*/
	function __leastSquares(x, y) {
		let matrix = __setFinite(x, y);
		if (matrix === null || matrix.length !== 2 || matrix[0].length < 2) return null;
		x = matrix[0];
		y = matrix[1];
		let width = x.length;
		let sumX  = 0;
		let sumY  = 0;
		let sumX2 = 0;
		let sumXY = 0;
		let i = -1;
		while(++i < width) {
			sumX  += x[i];
			sumY  += y[i];
			sumX2 += x[i]*x[i];
			sumXY += x[i]*y[i];
		}
		let data = {};
		data.a = ((width * sumXY) - (sumX * sumY)) / ((width * sumX2) - (sumX * sumX));
		data.b = ((sumY) - (sumX * data.a)) / (width);
		return data;
	}
/*----------------------------------------------------------------------------*/
	/**f{b{number}b __stdDeviation(b{array}b y1, b{array|number}b y2)}f*/
	/**p{Retorna o desvio padrão entre dois conjuntos de dados ou um valor de referência, ou c{null}c em caso de insucesso.}p l{*/
	/**d{v{y1}v - Conjunto de dados para avaliar.}d*/
	/**d{v{y2}v - Conjunto de dados comparativo ou valor de referência.}d}l*/
	function __stdDeviation(y1, y2) {
		let input1 = __Type(y1);
		if (input1.type !== "array") return null;
		let input2 = __Type(y2);
		if (input2.finite) {
			let data = __setFinite(y1);
			if (data === null) return null;
			y1 = data[0];
			y2 = input2.value;
		} else if (input2.type === "array") {
			let data = __setFinite(y1, y2);
			if (data === null) return null;
			y1 = data[0];
			y2 = data[1];
		} else {
			return null;
		}
		let items = [];
		let i = -1;
		while(++i < y1.length)
			items.push(y1[i] - (input2.finite ? y2 : y2[i]));
		return Math.hypot.apply(null, items) / Math.sqrt(items.length);
	}
/*----------------------------------------------------------------------------*/
	/**f{b{object}b __Fit2D(b{array}b x, b{array|function}b y)}f*/
	/**p{Objeto para análise de conjuntos de dados em duas dimensões com foco em ajuste de curvas.}p l{*/
	/**d{v{x}v - Conjunto de dados em v{x}v.}d*/
	/**d{v{y}v - Conjunto de dados em v{y}v ou uma função v{f(x)}v que definirá tais valores.}d*/
	/**d{b{Métodos e Atributos}b:}dL{*/
	function __Fit2D(x, y) {
		if (!(this instanceof __Fit2D)) return new __Fit2D(x, y);
		if (__Type(y).type === "function") {
			let data = __setFunction(x, y, true);
			x = data[0];
			y = data[1];
		}
		let matrix = __setUnique(x, y);
		if (matrix === null || matrix.length < 2) throw new TypeError("Inconsistent data set.");
		if (matrix[0].length < 2) throw new Error("Insufficient data set.");
		matrix = __setSort(matrix[0], matrix[1]);
		Object.defineProperties(this, {
			_x: {value: matrix[0]},
			_y: {value: matrix[1]},
			_fit: {value: {
				points: {x: matrix[0], y: matrix[1]}
			}}
		});
	}

	Object.defineProperties(__Fit2D.prototype, {
		constructor: {value: __Fit2D},
		/**t{b{object}b _deviation(b{string}b fit)}t*/
		/**d{Calcula o desvio padrão das regressões ou c{null}c em caso de insucesso.}d*/
		/**d{v{fit}v - Nome do atributo da regressão.}d*/
		_deviation: {
			value: function(fit) {
				if (!(fit in this._fit)) return null;
				let f = this._fit[fit].function;
				let data = __setFunction(this._x, f);
				if (data === null) return null;
				let x  = data[0];
				let y  = data[1];
				let y1 = [];
				let y2 = [];
				let i = -1;
				while (++i < x.length) {
					let index = this._x.indexOf(x[i]);
					y1.push(this._y[index]); /* valor original */
					y2.push(y[i]); /* valor após aplicação da fórmula */
				}
				return __stdDeviation(y1, y2);
			}
		},
		/**t{b{string}b _math(b{string}b fit)}t*/
		/**d{Retorna a expressão matemática visual da regressão, ou c{null}c em caso de insucesso.}d*/
		/**d{v{fit}v - Nome do atributo da regressão.}d*/
		_math: {
			value: function(fit) {
				if (!(fit in this._fit)) return "";
				let m = this._fit[fit].equation;
				m = m.replace("a", __precision(this._fit[fit].a, 3));
				m = m.replace("b", __precision(this._fit[fit].b, 3));
				if (this._fit[fit].deviation !== 0)
					m = m+" \u00B1 ("+__precision(this._fit[fit].deviation, 3)+")";
				return m;
			}
		},
		/**t{b{number}b _integral(b{string}b fit)}t*/
		/**d{Retorna a integral definida da função obtida pela regressão no intervalo de v{x}v informado, ou c{null}c em caso de insucesso.}d*/
		/**d{v{fit}v - Nome do atributo da regressão.}d*/
		_integral: {
			value: function(fit) {
				if (!(fit in this._fit)) return null;
				let i = Math.min.apply(null, this._x);
				let n = Math.max.apply(null, this._x);
				let a = this._fit[fit].a;
				let b = this._fit[fit].b;
				try {
					if (fit === "linear")
						return ((a/2)*(Math.pow(n,2)-Math.pow(i,2)))+(b*(n-i));
					if (fit === "geometric")
						return (a/(b+1))*(Math.pow(n,(b+1))-Math.pow(i,(b+1)));
					if (fit === "exponential")
						return (a/b)*(Math.exp(b*i) - Math.exp(b*n));
				} catch(e) {}
				return null;
			}
		},
		/**t{b{function}b _tangent(b{string}b fit)}t*/
		/**d{Retorna a equação da reta tangente a determinado ponto v{x}v da função obtida pela regressão, ou c{null}c em caso de insucesso.}d*/
		/**d{v{fit}v - Nome do atributo da regressão.}d*/
		/**d{A função retornada aceita um argumento que representa a posição no eixo v{x}v.}d*/
		_tangent: {
			value: function(fit) {
				if (!(fit in this._fit)) return null;
				let a = this._fit[fit].a;
				let b = this._fit[fit].b;
				let f = this._fit[fit].function;
				try {
					if (fit === "geometric")
						return function(x) {
							let y = f(x);
							let A = a*b*Math.pow(x, (b-1));
							let B = y - A*x;
							return function(X) {return A*X+B;}
						}
					if (fit === "exponential")
						return function(x) {
							let y = f(x);
							let A = b*y;
							let B = y - A*x;
							return function(X) {return A*X+B;}
						}
					} catch(e) {}
					return null;
			}
		},
		/**t{b{object}b linear}t*/
		/**d{Os dados da regressão linear, ou c{null}c em caso de insucesso:}d L{*/
		/**t{b{string}b type}t d{Nome da regressão.}d*/
		/**t{b{string}b equation}t d{Representação matemática da equação da regressão.}d*/
		/**t{b{number}b a}t d{Constante angular do método dos mínimos quadrados.}d*/
		/**t{b{number}b b}t d{Constante linear do método dos mínimos quadrados.}d*/
		/**t{b{function}b function}t d{Função Javascript da regressão.}d*/
		/**t{b{number}b deviation}t d{Valor do desvio padrão.}d*/
		/**t{b{string}b math}t d{Representação numérica da equação da regressão.}d*/
		/**t{b{number}b integral}t d{Valor da integral obtida em v{function}v no intervalo v{x}v definido.}d*/
		/**t{b{function}b tangent(b{number}b x)}t*/
		/**d{Retorna a equação da reta tangente a determinado ponto v{x}v em relação à função obtida em v{function}v.}d*/
		/**d{v{x}v - Ponto a ser definida a equação da reta.}d*/
		/**d{A função retornada aceita um argumento que representa a posição no eixo v{x}v.}d*/
		/**d{É nulo em caso de insucesso ou inexistente, situação encontrada na regressão linear.}d}L*/
		linear: {
			get: function() {
				if ("linear" in this._fit) return this._fit.linear;
				let data = __leastSquares(this._x, this._y);
				if (data === null) return null;
				this._fit.linear = {};
				this._fit.linear.type = "linear";
				this._fit.linear.equation = "y = (a)x + (b)";
				this._fit.linear.a = data.a;
				this._fit.linear.b = data.b;
				this._fit.linear.function = function(x) {return data.a*x + data.b;};
				this._fit.linear.deviation = this._deviation("linear");
				this._fit.linear.math = this._math("linear");
				this._fit.linear.integral = this._integral("linear");
				this._fit.linear.tangent = this._tangent("linear");
				return this._fit.linear;
			}
		},
		/**t{b{object}b exponential}t*/
		/**d{Os dados da regressão exponencial, ou c{null}c em caso de insucesso. Retorna um objeto como em v{linear}v.}d*/
		exponential: {
			get: function() {
				if ("exponential" in this._fit) return this._fit.exponential;
				let plan = __setFunction(this._y, Math.log, false)
				if (plan === null) return null;
				let data = __leastSquares(this._x, plan[1]);
				if (data === null) return null;
				this._fit.exponential = {};
				this._fit.exponential.type = "exponential";
				this._fit.exponential.equation = "y = (a)\u2107^(bx)";
				this._fit.exponential.a = Math.exp(data.b);
				this._fit.exponential.b = data.a;
				this._fit.exponential.function = function(x) {return Math.exp(data.b)*Math.exp(data.a*x);};
				this._fit.exponential.deviation = this._deviation("exponential");
				this._fit.exponential.math = this._math("exponential");
				this._fit.exponential.integral = this._integral("exponential");
				this._fit.exponential.tangent = this._tangent("exponential");
				return this._fit.exponential;
			}
		},
		/**t{b{object}b geometric}t*/
		/**d{Os dados da regressão geométrica, ou c{null}c em caso de insucesso. Retorna um objeto como em v{linear}v.}d*/
		geometric: {
			get: function() {
				if ("geometric" in this._fit) return this._fit.geometric;
				let planx = __setFunction(this._x, Math.log, false)
				let plany = __setFunction(this._y, Math.log, false)
				if (planx === null || plany === null) return null;
				let data = __leastSquares(planx[1], plany[1]);
				if (data === null) return null;
				this._fit.geometric = {};
				this._fit.geometric.type = "geometric";
				this._fit.geometric.equation = "y = (a)x^(b)";
				this._fit.geometric.a = Math.exp(data.b);
				this._fit.geometric.b = data.a;
				this._fit.geometric.function = function(x) {return Math.exp(data.b)*Math.pow(x, data.a);};
				this._fit.geometric.deviation = this._deviation("geometric");
				this._fit.geometric.math = this._math("geometric");
				this._fit.geometric.integral = this._integral("geometric");
				this._fit.geometric.tangent = this._tangent("geometric");
				return this._fit.geometric;
			}
		},
		/**t{b{object}b fit}t*/
		/**d{Retorna das dados da regressão com o menor valor de desvio padrão.}d*/
		fit: {
			get: function() {
				let attrs = {
					linear:      null,
					exponential: null,
					geometric:   null
				};
				for (let i in attrs) attrs[i] = this[i];
				let best = Infinity;
				let type = null;
				for (let i in attrs) {
					if (attrs[i] !== null && attrs[i].deviation < best) {
						best = attrs[i].deviation;
						type = i;
					}
				}
				return this[type];
			}
		},

		/**t{b{object}b sum}t*/
		/**d{Retorna um objeto com a soma da áreas formadas pelas linhas que ligam os pontos das coordenadas.}d L{*/
		/**t{b{number}b valueOf()}t d{Retorna o valor da soma.}d*/
		/**t{b{string}b toString()}t d{Retorna uma representação matemática do resultado.}d}L*/
		sum: {
    	get: function() {
	  		let x   = this.x;
    		let y   = this.y;
    		let sum = 0;
  			let i   = 0;
				while (++i < x.length)
					sum += (y[i]+y[i-1])*(x[i]-x[i-1])/2;
				return {
					valueOf:  function() {return sum;},
					toString: function() {return "\u03A3y \u2248 "+__precision(sum, 3);}
		  	};
		  }
    },
    /**t{b{object}b avg}t*/
		/**d{Retorna um objeto com o valor médio das coordenadas.}d L{*/
		/**t{b{number}b valueOf()}t d{Retorna o valor médio.}d*/
		/**t{b{string}b toString()}t d{Retorna uma representação matemática do resultado.}d}L*/
    avg: {
    	get: function() {
    		let x   = this.x;
    		let avg = this.sum/(x[x.length-1] - x[0]);
    		return {
					valueOf:  function() {return avg;},
					toString: function() {return "\u03A3y/\u0394x \u2248 "+__precision(avg, 3);}
		  	};
    	}
    },
		/**t{b{array}b x} d{Retorna valores do eixo x.}d*/
		x: {get: function() {return this._x}},
		/**t{b{array}b y}t d{Retorna valores do eixo y.}d}L}l*/
		y: {get: function() {return this._y}}
	});
/*----------------------------------------------------------------------------*/
	/**4{Plotagem de Dados}4	*/
/*----------------------------------------------------------------------------*/
	/**f{b{object}b __Data2D(b{string}b title, b{string}b xLabel, b{string}b yLabel)}f*/
	/**p{Objeto para preparar dados para construção de gráfico 2D (v{x, y}v).}p l{*/
	/**d{v{title}v - Título do gráfico.}d */
	/**d{v{xLabel}v - Nome do eixo v{x}v.}d */
	/**d{v{yLabel}v - Nome do eixo v{y}v.}d}l l{*/
	function __Data2D(title, xLabel, yLabel) {
		if (!(this instanceof __Data2D)) return new __Data2D(title, xLabel, yLabel);
		Object.defineProperties(this, {
			_title:  {value: title,    writable: true},     /* título do gráfico */
			_xLabel: {value:xLabel,    writable: true},     /* nome do eixo x */
			_yLabel: {value:yLabel,    writable: true},     /* nome do eixo y */
			_lower:  {value: {x: +Infinity, y: +Infinity}}, /* menor valor de x,y */
			_upper:  {value: {x: -Infinity, y: -Infinity}}, /* maior valor de x,y */
			_color:  {value:-1,        writable: true},     /* controle de cores */
			_data:   {value:[],        writable: false}     /* dados adicionados para plotagem */

		});
	}

	Object.defineProperties(__Data2D.prototype, {
		constructor: {value: __Data2D},
		_max: {value: Math.max(window.screen.width, window.screen.height)},
		_min: {value: Math.min(window.screen.width, window.screen.height)},
		/**t{b{number}b _width}t d{Comprimento do gráfico.}d*/
		_width: {get: function() {return 1000;}},
		/**t{b{number}b _height}t d{Altura do gráfico.}d*/
		_height: {get: function() {return this._width*this._min/this._max;}},
		/**t{b{number}b _xStart}t d{Início do eixo v{x}v.}d*/
		_xStart: {get: function() {return 0.10 * this._width;}},
		/**t{b{number}b _xSize}t d{Comprimento do eixo v{x}v.}d*/
		_xSize: {get: function() {return 0.85 * this._width}},
		/**t{b{number}b _yStart}t d{Início do eixo v{y}v.}d*/
		_yStart: {get: function() {return 0.05 * this._height;}},
		/**t{b{number}b _ySize}t d{Comprimento do eixo v{y}v.}d*/
		_ySize: {get: function() {return 0.85 * this._height}},
		/**t{b{number}b _xMin}t d{Obtém e define o limite inferior em v{x}v.}d*/
		_xMin: {
			get: function() {
				if (this._lower.x === this._upper.x)
					return this._lower.x === 0 ? -1 : this._lower.x*(1 - 0.5);
				return this._lower.x;
			},
			set: function(n) {
				let min = __Type(n).type === "array" ? Math.min.apply(null, n) : n;
				this._lower.x = min < this._lower.x ? min : this._lower.x;
			}
		},
		/**t{b{number}b _xMax}t d{Obtém e define o limite superior em v{x}v.}d*/
		_xMax: {
			get: function() {
				if (this._lower.x === this._upper.x)
					return this._upper.x === 0 ? 1 : this._upper.x*(1 + 0.5);
				return this._upper.x;
			},
			set: function(n) {
				let max = __Type(n).type === "array" ? Math.max.apply(null, n) : n;
				this._upper.x = max > this._upper.x ? max : this._upper.x;
			}
		},
		/**t{b{number}b _yMin}t d{Obtém e define o limite inferior em v{y}v.}d*/
		_yMin: {
			get: function() {
				if (this._lower.y === this._upper.y)
					return this._lower.y === 0 ? -1 : this._lower.y*(1 - 0.5);
				return this._lower.y;
			},
			set: function(n) {
				let min = __Type(n).type === "array" ? Math.min.apply(null, n) : n;
				this._lower.y = min < this._lower.y ? min : this._lower.y;
			}
		},
		/**t{b{number}b _yMax}t d{Obtém e define o limite superior em v{y}v.}d*/
		_yMax: {
			get: function() {
				if (this._lower.y === this._upper.y)
					return this._upper.y === 0 ? 1 : this._upper.y*(1 + 0.5);
				return this._upper.y;
			},
			set: function(n) {
				let max = __Type(n).type === "array" ? Math.max.apply(null, n) : n;
				this._upper.y = max > this._upper.y ? max : this._upper.y;
			}
		},
		/**t{b{matrix}b _curve(b{number}b x1, b{number}b x2, b{function}b f)}t*/
		/**d{Retorna uma matriz com o conjunto de coordenadas (v{x, f(x)}v).}d L{*/
		/**d{v{x}v - Valores para o eixo v{x}v}d*/
		/**d{v{f}v - Função para obter v{y = f(x)}v}d }L*/
		_curve: {
			value: function(x, f) {
				if (__Type(x).type !== "array") { /* para tipo ratio (x, y não são arrays) */
					return [x, f];
				}
				if (__Type(f).type !== "function") { /* para coordenadas (x e y são arrays) */
					this._xMin = x;
					this._xMax = x;
					this._yMin = f;
					this._yMax = f;
					return [x, f];
				}
				/* para funções */
				let xn = [];
				let dx = (this._xMax - this._xMin)/this._xSize;
				let x1 = Math.min.apply(null, x);
				let x2 = Math.max.apply(null, x);
				let i = -1;
				while ((x1 + (++i * dx)) <= x2)
					xn.push(x1 + (i * dx));
				let matrix = __setFunction(xn, f);
				if (matrix === null || matrix[0].length < 2) return null;
				this._xMin = matrix[0];
				this._xMax = matrix[0];
				this._yMin = matrix[1];
				this._yMax = matrix[1];
				return matrix;
			}
		},
		/**t{b{void}b _add(b{array}b x, b{array|function}b y, b{string}b name, b{string}b type, b{boolean}b color)}t*/
		/**d{Registra informações do conjunto de dados.}d L{*/
		/**d{v{x}v - Valores para o eixo v{x}v.}d */
		/**d{v{y}v - Valores ou função (v{y = f(x)}v) para o eixo v{y}v.}d */
		/**d{v{name}v - Identificador do conjunto de dados.}d */
		/**d{v{type}v - Tipo da plotagem: v{dash line, dots, area}v.}d */
		/**d{v{color}v - Se verdadeiro, uma nova cor será definida para o conjunto de dados.}d }L*/
		_add: {
			value: function(x, y, name, type, color) {
				let matrix;
				try {
					switch(__Type(y).type) {
						case "array":
							matrix = __setUnique(x, y);
							if (matrix === null) return false;
							matrix = __setSort(matrix[0], matrix[1]);
							if (matrix[0].length < 2) return false;
							x = matrix[0];
							y = matrix[1];
							this._xMin = x;
							this._xMax = x;
							this._yMin = y;
							this._yMax = y;
							break;
						case "function":
							matrix = __setUnique(x);
							if (matrix === null) return false;
							matrix = __setSort(matrix[0]);
							if (matrix[0].length < 2) return false;
							x = matrix[0];
							this._xMin = x;
							this._xMax = x;
							break;
					}
				}
				catch(e) {return false;}
				if (type === "area") {
					this._yMin = 0;
					this._yMax = 0;
				}
				color = color === true ? ++this._color : this._color;
				this._data.push({x: x, y: y, name: name, type: type, color: color});
				return true;
			}
		},
		/**t{b{void}b _addFit(b{array}b x, b{array}b y, b{string}b name, b{string}b type)}t*/
		/**d{Adiciona dados de um conjunto de valores para fins de ajuste de curva (ver i{__Fit2D}i).}d L{*/
		/**d{v{x}v - Valores para o eixo v{x}v.}d */
		/**d{v{y}v - Valores para o eixo v{y}v.}d */
		/**d{v{name}v - Identificador do conjunto de dados.}d*/
		/**d{v{type}v - (opcional) Tipo do ajuste de curva.}d }L*/
		_addFit: {
			value: function(x, y, name, type) {
				let data, fit;
				try {
					data = __Fit2D(x, y);
					fit = data[type];
					if (fit === null) throw "";
				} catch(e) {
					return false;
				}
				this._add(data.x, data.y, name, "dots", true);
				this._add(data.x, fit.function, fit.math, "line", true);
				if (fit.deviation !== 0) {
					let upper = function(x) {return fit.function(x)+fit.deviation;}
					let lower = function(x) {return fit.function(x)-fit.deviation;}
					this._add(data.x, upper, "", "dash", false);
					this._add(data.x, lower, "", "dash", false);
				}
				return true;
      }
		},
		/**t{b{void}b _addRatio(b{array}b x, b{array}b y, b{string}b name)}t*/
		/**d{Adiciona dados de um conjunto de valores para fins de comparação.}d L{*/
		/**d{v{x}v - Valores para o eixo v{x}v (identificador da informação).}d */
		/**d{v{y}v - Valores para o eixo v{y}v (valor da informação).}d */
		/**d{v{name}v - Identificador do conjunto de dados.}d }L*/
		_addRatio: {
			value: function(x, y, name) {
				if (__Type(y).type !== "array") return false;
				let n = [];
				while (n.length < x.length && n.length < y.length)
					n.push(n.length);
				let matrix = __setFinite(n, y);
				if (matrix === null) return false;
				let i = -1;
				while (++i < matrix[0].length) {
					let item = matrix[0][i];
					this._data.push({
						x: String(x[item]).trim(),
						y: matrix[1][i],
						name: name,
						type: "ratio",
						color: null
					});
				}
				return true;
			}
		},
		/**t{b{string}b title}t d{Obtem ou define o título do gráfico.}d*/
		title: {
			get: function()  {return this._title;},
			set: function(x) {this._title = x;}
		},
		/**t{b{string}b xLabel}t d{Obtem ou define o rótulo do eixo v{x}v.}d*/
		xLabel: {
			get: function()  {return this._xLabel;},
			set: function(x) {this._xLabel = x;}
		},
		/**t{b{string}b yLabel}t d{Obtem ou define o rótulo do eixo v{y}v.}d*/
		yLabel: {
			get: function()  {return this._yLabel;},
			set: function(x) {this._yLabel = x;}
		},
		/**t{b{void}b add(b{array}b x, b{array|function}b y, b{string}b name, b{string}b type)}t*/
		/**d{Adiciona dados de um conjunto de valores (v{x, y}v) ou  (v{x, f(x)}v).}d L{*/
		/**d{v{x}v - Valores para o eixo v{x}v.}d */
		/**d{v{y}v - Valores ou função v{f(x)}v para o eixo v{y}v.}d */
		/**d{v{name}v - Identificador do conjunto de dados.}d*/
		/**d{v{type}v - (Opcional) Tipo de plotagem: v{line fit fit-linear fit-exponential fit-geometric area ratio}v.}d*/
		/**d{Valor padrão de i{type}i é v{dots}v.}d }L*/
		add: {
			value: function(x, y, name, type) {
				if (__Type(x).type !== "array") return false;
				if ((["array", "function"]).indexOf(__Type(y).type) < 0) return false;
				switch(type) {
					case "fit":
						return this._addFit(x, y, name, "fit");
					case "fit-linear":
						return this._addFit(x, y, name, "linear");
					case "fit-exponential":
						return this._addFit(x, y, name, "exponential");
					case "fit-geometric":
						return this._addFit(x, y, name, "geometric");
					case "ratio":
						return this._addRatio(x, y);
					case "area":
						return this._add(x, y, name, "area", true);
					case "line":
						return this._add(x, y, name, "line", true);
				}
				return this._add(x, y, name, (__Type(y).type === "function" ? "line" : "dots"), true);
      }
		},
		/**t{b{array}b data()}t*/
		/**d{Prepara e retorna os dados para renderização do gráfico.}d }l*/
		data: {
			value: function() {
				let data = this._data.slice();
				let i = -1;
				while (++i < data.length) {
					let matrix = this._curve(data[i].x, data[i].y);
					if (matrix === null) return null;
					data[i].x = matrix[0];
					data[i].y = matrix[1];
				}
				return data;
			}
		}
	});
/*----------------------------------------------------------------------------*/
	/**f{b{object}b __Plot2D(b{string}b title, b{string}b xLabel, b{string}b yLabel)}f*/
	/**p{Ferramenta para renderizar o gráfico 2D (herda características de i{__Data2D}i).}p l{*/
	/**d{v{title}v - Título do gráfico.}d */
	/**d{v{xLabel}v - Nome do eixo v{x}v.}d */
	/**d{v{yLabel}v - Nome do eixo v{y}v.}d}l l{*/
	function __Plot2D(title, xLabel, yLabel) {
		if (!(this instanceof __Plot2D)) return new __Plot2D(title, xLabel, yLabel);
		__Data2D.call(this, title, xLabel, yLabel);
	}

	__Plot2D.prototype = Object.create(__Data2D.prototype, {
		constructor: {value: __Plot2D},
		/**t{b{number}b _xp(b{number}b x)}t*/
		/**d{Retorna u{o ponto}u de plotagem do eixo v{x}v no SVG.}d L{*/
		/**d{v{x}v - Valor da coordenada v{x}v.}d }L*/
		_xp: {
			value: function (x) { /* dp/dx = (p2-p1)/(x2-x1) = (p-p1)/(x-x1) */
				let p1 = this._xStart;
				let p2 = p1 + this._xSize;
				let dp = p2 - p1;
				if (this._xMin === this._xMax) {//FIXME tem que transformar xMin, xMax, yMin, yMax em getter/setter
					let diff = this._xMin === 0 ? 1 : this._xMin;
					this._xMin = this._xMin - diff;
					this._xMax = this._xMax + diff;
				}
				let x1 = this._xMin;
				let x2 = this._xMax;
				let dx = x2 - x1;
				return ((dp/dx)*(x - x1)) + p1;
      }
    },
    /**t{b{number}b _yp(b{number}b x)}t*/
		/**d{Retorna u{o ponto}u de plotagem do eixo v{y}v no SVG.}d L{*/
		/**d{v{y}v - Valor da coordenada v{y}v.}d }L*/
    _yp: {
			value: function (y) { /* dp/dy = (p2-p1)/(y2-y1) = (p-p1)/(y-y1) */
				let p1 = this._yStart;
				let p2 = p1 + this._ySize;
				let dp = p2 - p1;
				if (this._yMin === this._yMax) {
					let diff = this._yMin === 0 ? 1 : this._yMin;
					this._yMin = this._yMin - diff;
					this._yMax = this._yMax + diff;
				}
				let y1 = this._yMin;
				let y2 = this._yMax;
				if (y1 === y2) {
					let diff = 2*(y1 === 0 ? 1 : y1);
					y1 = y1 - diff;
					y2 = y1 + diff;
				}
				let dy = y2 - y1;
				return p1+p2-(((dp/dy)*(y - y1)) + p1);
      }
    },
		/**t{b{matrix}b _yx(b{array}b x, b{array}b y)t*/
		/**d{Retorna u{os pontos}u de plotagem dos eixos v{x,y}v no SVG.}d L{*/
		/**d{v{x}v - Valores da coordenada v{x}v (coluna 0), ver i{_xp}i.}d*/
		/**d{v{x}v - Valores da coordenada v{y}v (coluna 1), ver i{_yp}i.}d }L*/
		_xy: {
			value: function(x, y) {
				let xy = {x: [], y: []};
    		let i = -1;
    		while (++i < x.length) {
    			xy.x.push(this._xp(x[i]));
    			xy.y.push(this._yp(y[i]));
    		}
    		return [xy.x, xy.y];
			}
		},
		/**t{b{string}b _dline(b{array}b x, b{array}b y, b{boolean}b close)t*/
		/**d{Retorna o caminho para construção de linhas conectadas por pontos.}d L{*/
		/**d{v{x}v - Valores do eixo horizontal.}d*/
		/**d{v{y}v - Valores do eixo vertical.}d*/
		/**d{v{close}v - Informa se é uma figura de área fechada (retorna à origem).}d }L*/
		_dline: {
    	value: function (x, y, close) {
    		let d = [];
    		let i = -1;
    		while (++i < x.length) {
    			let path = [i === 0 ? "M" : "L", x[i], y[i]];
    			d.push(path.join(" "));
    			if (close === true && i === (x.length - 1)) d.push("Z");
    		}
    		return d.join(" ");
    	}
    },


    _palette: {value: []},
   	/**t{b{string}b _rgb(b{integer}b n, b{number}b opacity)}t*/
		/**d{Retorna a cor em RGB definida por v{n}v para ser utilizada pelo elemento SVG.}d L{*/
		/**d{v{n}v - Retorna transparente, se nulo ou indefinido, preto, se menor que zero, ou cor definida.}d }L*/
		_rgb: {
			value: function(n) {
				if (n === null || n === undefined) return "none";
				if (n < 0) return "rgb(0,0,0)";
				/* definir paleta de cores, se ainda não definida */
				if (this._palette.length === 0) {
					let max   = 255;
					let div   = 2.5;
					let delta = max/div;
					let error = [([max,max,max]).join(","), "0,0,0"]
					let color;
					let x = -1;
					while (++x < div) { /* cor principal (decrescente) */
						let y = -1;
						while (++y < div) {
							let z = -1;
							while (++z < div) {
								color = [
									__integer(max-x*delta),
									__integer(y*delta),
									__integer(z*delta)
								]; /* x é a cor redominante */
								let i = -1;
								while (++i < 3) { /* alternância de cor predominante */
									let rgb = ([color[i%3], color[(i+1)%3], color[(i+2)%3]]).join(",");
									if (this._palette.indexOf(rgb) < 0 && error.indexOf(rgb) < 0)
										this._palette.push(rgb);
								}
							}
						}
					}
				}
				let index = n%this._palette.length;
				return "rgb("+this._palette[index]+")";
			}
		},
		/**t{b{node}b _line()}t d{Retorna elemento SVG.}d*/
		_svg: {
			value: function() {
				let svg  = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				let attr = {
					viewBox:"0 0 "+this._width+" "+this._height,
					style: "border: 1px solid red; background-color: #f0f0f0"
				};
				for (let i in attr) svg.setAttribute(i, attr[i]);
				return svg;
			}
		},
		/**t{b{node}b _tip(b{string}b text, b{node}b svg)}t*/
		/**d{Retorna o elemento SVG com dica (i{title}i) adicionada.}d L{*/
		/**d{v{text}v - Texto da dica.}d*/
		/**d{v{svg}v - Elemento svg a ter adicionado dica.}d }L*/
		_tip: {
			value: function(text, svg) {
				let tip = document.createElementNS("http://www.w3.org/2000/svg", "title");
				tip.textContent = text;
				svg.appendChild(tip);
				return svg;
			}
		},
		/**t{b{node}b _lines(b{array}b x, b{array}b y, b{number}b stroke, b{boolean}b close, b{number}b color)}t*/
		/**d{Retorna elemento SVG renderizado com linhas conectadas pelos pontos.}d L{*/
		/**d{v{x}v - Coordenadas do eixo v{x}v.}d*/
		/**d{v{y}v - Coordenadas do eixo v{y}v.}d*/
		/**d{v{stroke}v - Espessura da linha que, se negativo, será tracejada.}d*/
		/**d{v{close}v - Informa se é uma figura de área fechada.}d*/
		/**d{v{color}v - Valor da cor da linha.}d }L*/
		_lines: {
			value: function(x, y, stroke, close, color) {
				let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let width = Math.abs(stroke);
				let attr = {
					"d": this._dline(x, y, close),
					"fill": close === true && color >= 0 ? this._rgb(color) : "none",
					"fill-opacity": close === true && width > 0 ? 0.6 : 1,
					"stroke": this._rgb(color),
					"stroke-width": width,
					"stroke-dasharray": stroke < 0 ? "8,8" : "none",
					"stroke-linecap": "round"
				};
				for (let i in attr) path.setAttribute(i, attr[i]);
				return path;
			}
		},
		/**t{b{node}b _circles(b{number}b cx, b{number}b cy, b{number}b r, b{number}b start, b{number}b width, b{number}b color)}t*/
		/**d{Retorna elemento SVG para circulos e semi-círculos.}d L{*/
		/**d{v{cx}v - Posição do centro do círculo em v{x}v.}d*/
		/**d{v{cy}v - Posição do centro do círculo em v{y}v.}d*/
		/**d{v{r}v - Tamanho do raio do círculo.}d*/
		/**d{v{start}v - Ângulo inicial do arco, em graus (v{0 = (x = r, y = 0)}v).}d*/
		/**d{v{width}v - Variação angular, em graus (sentido anti-horário).}d*/
		/**d{v{color}v - Valor da cor do círculo.}d }L*/
		_circles: {
			value: function(cx, cy, r, start, width, color) {
				let svg  = width >= 360 ? "circle" : "path";
				let path = document.createElementNS("http://www.w3.org/2000/svg", svg);
				let attr = {
					"fill": this._rgb(color),
					"fill-opacity": 0.8,
					"stroke-width": 1,
					"stroke": this._rgb(color)
				};
				if (width >= 360) {
					attr.cx = cx;
					attr.cy = cy;
					attr.r  = r;
				} else {
					start  = 2*Math.PI*start/360;
					width  = 2*Math.PI*width/360;
					let x1 = cx + r*Math.cos(start);
					let y1 = cy - r*Math.sin(start);
					let x2 = cx + r*Math.cos(start + width);
					let y2 = cy - r*Math.sin(start + width);
					let lg = width > Math.PI ? 1 : 0;
					attr.d = ["M", cx, cy, "L", x1, y1, "A", r, r, 0, lg, 0, x2, y2, "Z"].join(" ");
				}
				for (let i in attr) path.setAttribute(i, attr[i]);
				return path;
			}
		},
		/**t{b{node}b _text(b{number}b x, b{number}b y, b{string}b text, b{string}b point, b{number}b color)}t*/
		/**d{Adiciona e retorna elemento SVG para texto.}d L{*/
		/**d{v{x}v - Posição em v{x}v.}d*/
		/**d{v{y}v - Posição em v{y}v.}d*/
		/**d{v{text}v - Conteúdo textual.}d*/
		/**d{v{point}v - Identifica o alinhamento e o ponto de ancoragem do texto.}d*/
		/**d{Exemplos: v{hse}v horizontal-sudeste; v{vn}v vertical-norte.}d*/
		/**d{v{color}v - Valor da cor do texto.}d }L*/
		_text: {
			value: function(x, y, text, point, color) {
				let content = document.createElementNS("http://www.w3.org/2000/svg", "text");
				let vanchor = ["start", "middle", "end"];
				let vbase   = ["auto", "middle", "hanging"];
				let anchor  = {n: 1, ne: 2, e: 2, se: 2, s: 1, sw: 0, w: 0, nw: 0, c: 1};
				let base    = {n: 2, ne: 2, e: 1, se: 0, s: 0, sw: 0, w: 1, nw: 2, c: 1};
				let attr = {
					x: point[0] === "v" ? -y : x,
					y: point[0] === "v" ? x : y,
					fill: this._rgb(color),
					"text-anchor":       vanchor[anchor[point.substr(1)]],
					"dominant-baseline": vbase[base[point.substr(1)]],
					"font-family":       "monospace",
					"font-size":         "1em",
					"transform":         point[0] === "v" ? "rotate(270)" : "",
					"stroke": "black",
					"stroke-width": 0.1,
				};
				for (let i in attr) content.setAttribute(i, attr[i]);
				content.textContent = String(text).trim();
				return content;
			}
		},





		_area: {//FIXME
			value: function(svg, _xlabel, _ylabel, _xgrid, _ygrid) {
				if (_xgrid < 1) _xgrid = -1;
				if (_ygrid < 1) _ygrid = -1;
				/* pontos principais */
				let x1 = this._xStart;
				let x2 = x1 + this._xSize;
				let y1 = this._yStart;
				let y2 = y1 + this._ySize;
				/* título e rótulos */
				svg.appendChild(this._text((x1+x2)/2, y1/2, this.title, "hc", -1));
				svg.appendChild(this._text((x1+x2)/2, (this._height-5), _xlabel, "hs", -1));
				svg.appendChild(this._text(5, (y1+y2)/2, _ylabel, "vn", -1));
				/* grade principal */
				svg.appendChild(this._lines([x1, x2, x2, x1], [y1, y1, y2, y2], 2, true, -1));
				/* grade e escala horizontal */
				let i = -1;
				while (++i <= _xgrid) {
					let yn = y1 + i*((y2-y1)/_xgrid);
					let xn = x1 + i*((x2-x1)/_xgrid);
					svg.appendChild(this._lines([xn, xn], [y1, y2], -0.5, false, -1));
					let sx = this._xMin + i*((this._xMax - this._xMin)/_xgrid);
					let px = i === 0 ? "hnw" : (i === _xgrid ? "hne" : "hn");
					svg.appendChild(this._text(xn  , y2+3, __precision(sx, 3), px, -1));
				}
				/* grade e escala vertical */
				i = -1;
				while (++i <= _ygrid) {
					let yn = y1 + i*((y2-y1)/_ygrid);
					let xn = x1 + i*((x2-x1)/_ygrid);
					svg.appendChild(this._lines([x1, x2], [yn, yn], -0.5, false, -1));
					let sy = this._yMax - i*((this._yMax - this._yMin)/_ygrid);
					let py = i === 0 ? "hne" : (i === _ygrid ? "hse" : "he");
					svg.appendChild(this._text(x1-3, yn  , __precision(sy, 3), py, -1));
				}



/*
				while (++i <= grid) {

					let yn = y1 + i*((y2-y1)/_ygrid);
					let xn = x1 + i*((x2-x1)/_xgrid);
					if (i > 0 && i < grid) {
						svg.appendChild(this._lines([x1, x2], [yn, yn], -0.5, false, -1));
						svg.appendChild(this._lines([xn, xn], [y1, y2], -0.5, false, -1));
					}

					let sx = this._xMin + i*((this._xMax - this._xMin)/grid);
					let sy = this._yMax - i*((this._yMax - this._yMin)/grid);
					let px = i === 0 ? "hnw" : (i === grid ? "hne" : "hn");
					let py = i === 0 ? "hne" : (i === grid ? "hse" : "he");
					svg.appendChild(this._text(xn  , y2+3, __precision(sx, 3), px, -1));
					svg.appendChild(this._text(x1-3, yn  , __precision(sy, 3), py, -1));
				}
*/



			}
		},









		_rplot: {
			value: function(svg, plot) {
				/* gráficos relativos: setores ou barra */
				let data  = {
					items: {},
					add: function(item, val) {
						item = String(item).replace(/\ +/g, " ").trim();
						this.items[item] = item in this.items ? (this.items[item]+val) : val;
					},
					get list() {
						let n = [];
						for (let i in this.items) n.push(this.items[i]);
						return n;
					},
					get sum() {
						let n = 0;
						for (let i in this.items) n += this.items[i];
						return n;
					},
					ratio: function(i) {return this.sum === 0 ? 0 : this.items[i]/this.sum;},
					get len() {return this.list.length;},
					get min() {return Math.min.apply(null, this.list.concat(0));},
					get max() {return Math.max.apply(null, this.list.concat(0));},
					get avg() {return this.sum/this.len;}
				};
				let i = -1;
				while (++i < plot.length) {
					if (plot[i].type === "ratio")
						data.add(plot[i].x, plot[i].y)
				}
				/* setores */
				if (data.min >= 0) {
					let cx = this._width/2;
					let cy = this._height/2;
					let  r = this._height/3;
					let start  = 0;
					let rLabel = 15;
					let info   = [
						this._yLabel+" / "+this._xLabel+" = ",
						__precision(sum, 3)+" / "+__precision(item, 3)+" = ",
						__precision(sum/item, 3)
					]
					/* título e rótulos */
					svg.appendChild(
						this._text(this._width/2, this._height-5, info.join(""), "hs", -1)
					);
					svg.appendChild(
						this._text(this._width/2, this._yStart, this._title, "hs", -1)
					);
					/* gráfico */
					for (let j in data) {
						let width  = data[j]/sum*360;
						let middle = (start+width/2);
						let xLabel = cx + (r+rLabel)*Math.cos(2*Math.PI*middle/360);
						let yLabel = cy - (r+rLabel)*Math.sin(2*Math.PI*middle/360);
						let label  = j+": "+__precision(data[j], 3)+" ("+__precision(100*data[j]/sum, 3)+"%)";
						let fixed  = middle%90 === 0 ? ["hw", "hs", "he", "hn"] : ["hsw", "hse", "hne", "hnw"];
						let anchor = fixed[__integer(middle/90)];
						svg.appendChild(
							this._tip(label, this._circles(cx, cy, r, start, width, color))
						);
						svg.appendChild(
							this._text(xLabel, yLabel, label, anchor, color)
						);
						color++;
						start += width;
					}
				}


					document.body.innerHTML = "";
					document.body.appendChild(svg);
					return;
				}

		},



		plot: {
			value: function(chart) {
				let plot = this.data();
				if (plot.length === 0) return null;
				let svg = this._svg();
				if (chart === "ratio") return this._rplot(svg, plot);

				/* plotar dados coordenadas cartesiana */
				this._area(svg, this.xLabel, this.yLabel, 10, 10);
				let i = -1;
				while (++i < plot.length) {
					let type  = plot[i].type;
					let color = plot[i].color;
					let name  = plot[i].name;
					let x     = plot[i].x;
					let y     = plot[i].y;
					let xy    = this._xy(x, y);
					let X     = xy[0];
					let Y     = xy[1];
					let tip;



					switch(type) {
						case "line":
							svg.appendChild(this._lines(X, Y, 3, false,color));
							break;
						case "dash":
							svg.appendChild(this._lines(X, Y, -1, false,color));
							break;
						case "dots":
							let j = -1;
							while (++j < x.length)
								svg.appendChild(
									this._circles(this._xp(x[j]), this._yp(y[j]), 4, 0, 360, color)
								);
							break;
						case "area":
							/* y0 = yn = 0, extremidades devem encostar no eixo x */
							let fit = __Fit2D(X, Y);
							let ax  =        ([X[0]]).concat(X);
							let ay  = ([this._yp(0)]).concat(Y);
							ax.push(X[X.length-1]);
							ay.push(this._yp(0));
							svg.appendChild(this._lines(ax, ay, 1, true, color));
							svg.appendChild(this._lines(
								[X[0], X[X.length-1]],
								[fit.avg.valueOf(), fit.avg.valueOf()],
								-4,
								false,
								color
							));
							break
					}
				}
				document.body.innerHTML = "";
				document.body.appendChild(svg);







			}
		}





	});




















/*----------------------------------------------------------------------------*/
	function wd_coord_rsum(x, y) { /* área embaixo da reta que une as coordenadas */
		let coord = wd_coord_adjust(x, y);
		if (coord === null) return null;
		x = coord.x;
		y = coord.y;
		/* -- integral ax+b = (yf+yi)(xf-xi)/2 -- */
		let int = 0;
		for (let i = 0; i < (coord.length - 1); i++)
			int += (y[i+1]+y[i])*(x[i+1]-x[i])/2;

		let data = {};
		data.e = "\u03A3y\u0394x \u2248 b";
		data.a = 0;
		data.b = int;
		data.f = function(z) {
			let i = 0;

			let n = null;
			while (n === null && ++i !== coord.length)

				if (z <= x[i]) n = i;
			if (n === null) n = coord.length-1;

			let line = wd_coord_rlin([x[n-1], x[n]], [y[n-1], y[n]]);
			return line === null ? null : line.f(z);

		}

		data.d = 0;
		data.m = wd_coord_rmath(data.e, data.a, data.b, data.d);

		return data;
	}
















































/*----------------------------------------------------------------------------*/
	function wd_no_spaces(txt, char) { /* Troca múltiplos espaço por um caracter*/
		return txt.replace(/\s+/g, (char === undefined ? " " : char)).trim();
	};
/*----------------------------------------------------------------------------*/
	function wd_text_clear(value) { /* elimina acentos */
		value = new String(value);
		if ("normalize" in value)
			return value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

		let ascii = {
			A: /[À-Å]/g, C: /[Ç]/g,   E: /[È-Ë]/g, I: /[Ì-Ï]/g,
			N: /[Ñ]/g,   O: /[Ò-Ö]/g, U: /[Ù-Ü]/g, Y: /[ÝŸ]/g,
			a: /[à-å]/g, c: /[ç]/g,   e: /[è-ë]/g, i: /[ì-ï]/g,
			n: /[ñ]/g,   o: /[ò-ö]/g, u: /[ù-ü]/g, y: /[ýÿ]/g
		};
		for (let i in ascii)
			value = value.replace(ascii[i], i);

		return value;
	}









//FIXME a partir daqui começa a quebrar a biblioteca a cada mudança


/*----------------------------------------------------------------------------*/
	function wd_lang(elem) { /* Retorna a linguagem definida (lang) a partir de um elemento (efeito bolha) ou do navegador*/
		let node = wd_vtype(elem).type === "dom" ? elem : document.body;
		while (node !== null && node !== undefined) {
			if ("lang" in node.attributes) {
				let value = node.attributes.lang.value.trim();
				if (value !== "") return value;
			}
			node = node.parentElement;
		}
		return navigator.language || navigator.browserLanguage || "en-US";
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
		let time = 0;
		time += h * 3600;
		time += m * 60;
		time += s === undefined ? 0 : s;
		return time % 86400;
	}

/*----------------------------------------------------------------------------*/
	function wd_number_time(n) { /*Converte número em tempo (objeto{h,m,s})*/
		let time = {};
		n      = n < 0 ? (86400 + (n % 86400)) : (n % 86400);
		time.h = (n - (n % 3600)) / 3600;
		n      = n - (3600 * time.h);
		time.m = (n - (n % 60)) / 60;
		time.s = n - (60 * time.m);
		return time;
	}

/*----------------------------------------------------------------------------*/
	function wd_str_time(val) { /* obtém tempo a partir de uma string */
		let data = [
			{re: /^(0?[1-9]|1[0-2])\:[0-5][0-9]\ ?(am|pm)$/i, sym: "ampm"},
			{re: /^(0?[0-9]|1[0-9]|2[0-4])(\:[0-5][0-9]){1,2}$/, sym: "time"},
		];

		let index = -1;
		for (let i = 0; i < data.length; i++) {
			if (data[i].re.test(val)) index = i;
			if (index >= 0) break;
		}
		if (index < 0) return null;

		let values = val.replace(/[^0-9\:]/g, "").split(":");
		for (let i = 0; i < values.length; i++)
			values[i] = new Number(values[i]).valueOf();

		if ((/am$/i).test(val) && values[0] === 12) values[0] = 0;
		if ((/pm$/i).test(val) && values[0] < 12)   values[0] = values[0] + 12;

		return wd_time_number(values[0], values[1], values[2]);
	}

/*----------------------------------------------------------------------------*/
	function wd_str_now() { /* retorna o tempo atual em string */
		let t = new Date();
		let o = {h: t.getHours(), m: t.getMinutes(), s: t.getSeconds()};
		for (let i in o) o[i] = (o[i] < 10 ? "0" : "") + o[i].toString();
		return o.h+":"+o.m+":"+o.s;
	}

/*----------------------------------------------------------------------------*/
	function wd_str_date(val) { /* obtém data em formato string */
		let data = [
			{re: /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/, sym: "-", y: 0, m: 1, d: 2},
			{re: /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/, sym: "/", y: 2, m: 1, d: 0},
			{re: /^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/, sym: ".", y: 2, m: 0, d: 1},
		];

		let index = -1;
		for (let i = 0; i < data.length; i++) {
			if (data[i].re.test(val)) index = i;
			if (index >= 0) break;
		}

		if (index < 0) return null;

		let date = val.split(data[index].sym);
		let d    = Number(date[data[index].d]);
		let m    = Number(date[data[index].m]);
		let y    = Number(date[data[index].y]);

		if (y > 9999 || y < 1 || m > 12 || m < 1 || d > 31 || d < 1) return null;
		if (d > 30 && [2, 4, 6, 9, 11].indexOf(m) >= 0)              return null;
		if (m === 2 && (d > 29 || (d === 29 && !wd_is_leap(y))))     return null;

		return wd_set_date(null, d, m, y);
	}

/*----------------------------------------------------------------------------*/
	function wd_str_number(val) { /* obtem números em formato de string */
		let data = [
			{re: /^[0-9]+\!$/, sym: "!"},
			{re: /^[\+\-]?([0-9]+|([0-9]+)?\.[0-9]+)(e[\-\+]?[0-9]+)?\%$/i, sym: "%"},
			{re: /^[\-\+]?([0-9]+|([0-9]+)?\.[0-9]+)(e[\-\+]?[0-9]+)?$/i, sym: null},
		];

		let index = -1;
		for (let i = 0; i < data.length; i++) {
			if (data[i].re.test(val)) index = i;
			if (index >= 0) break;
		}

		if (index < 0) return null;
		if (data[index].sym === "%")
			return new Number(val.replace("%", "")).valueOf() / 100;
		if (data[index].sym === "!") {
			let number =  new Number(val.replace("!", "")).valueOf();
			let value  = 1;
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

		let data = {
			HTMLElement: "dom",
			SVGElement:  "dom",
			NodeList: "doms",
			HTMLCollection: "doms",
			HTMLAllCollection: "doms",
			HTMLOptionsCollection: "doms",
			HTMLFormControlsCollection: "doms",
			MathMLElement: "dom"
		};

		for (let i in data) {
			if (i in window && val instanceof window[i]) {
				if (data[i] === "dom") return [val];
				let array = [];
				for (let n = 0; n < val.length; n++) array.push(val[n]);
				return array;
			}
		}
		return null;
	}

/*----------------------------------------------------------------------------*/
	function wd_vtype(val) {/* retorna o tipo e o valor do objeto */
		let value;

		/* Valores simples */
		if (val === undefined)             return {type: "undefined", value: val};
		if (val === null)                  return {type: "null", value: val};
		if (val === true || val === false) return {type: "boolean", value: val};

		/* Valores em forma de string */
		if (typeof val === "string" || val instanceof String) {
			/* nulo/vazio */
			val = val.trim();
			if (val === "") return {type: "null", value: null};
			/* tempo, data e número */
			let mtds = {
				"date": wd_str_date, "time": wd_str_time, "number": wd_str_number
			};
			for (let t in mtds) {
				value = mtds[t](val);
				if (value !== null) return {value: value, type: t}
			}
			/* padrão: texto */
			return {type: "text", value: val.toString()};
		}

		/* Elementos da árvore DOM */
		value = wd_dom(val);
		if (value !== null)
			return {value: value, type: "dom"};

		/* Outros Elementos */
		/* BigInt */
		if (typeof val === "bigint" || ("BigInt" in window && val instanceof BigInt))
			return {type: "unknown", value: val.valueOf()};
		/* Number e NaN */
		if (typeof val === "number" || ("Number" in window && val instanceof Number))
			return isNaN(val) ? {type: "unknown", value: val} : {type: "number", value: val.valueOf()};
		/* array */
		if ("Array" in window && (("isArray" in Array && Array.isArray(val)) || val instanceof Array))
			return {type: "array", value: val.slice()};
		/* data */
		if ("Date" in window && val instanceof Date)
			return {type: "date", value: wd_set_date(val)};
		/* regexp */
		if ("RegExp" in window && val instanceof RegExp)
			return {type: "regexp", value: val.valueOf()};
		/* boolean */
		if (typeof val === "boolean" || ("Boolean" in window && val instanceof Boolean))
			return {type: "boolean", value: val.valueOf()};
		/* function */
		if (typeof val === "function" || ("Function" in window && val instanceof Function))
			return {type: "function", value: val};
		/* object */
		if (typeof val === "object" && (/^\{.*\}$/).test(JSON.stringify(val)))
			return {type: "object", value: val};
		/* desconhecido: não se encaixa nos anteriores */
		return {type: "unknown", value: val};
	}
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




/*----------------------------------------------------------------------------*/
	function wd_mask(input, check, callback) { /* aplica máscaras a strings */
		check = String(check).toString();
		let code  = {"#": "[0-9]", "@": "[a-zA-ZÀ-ÿ]", "*": "."};
		let mask  = ["^"]; /*Formato da máscara (conteúdo + caracteres)*/
		let only  = ["^"]; /*Conteúdo da máscara (conteúdo apenas)*/
		let gaps  = [];    /*Caracteres da máscara (comprimento do formato)*/
		let func  = wd_vtype(callback);
		if (func.type !== "function") callback = function(x) {return true;}

		/* obtendo a máscara e os containers para ocupação */
		for (let i = 0; i < input.length; i++) {
			let char = input[i];

			if (char in code) { /*caracteres de máscara*/
				mask.push(code[char]);
				gaps.push(null);
				only.push(code[char])
			} else if ((/\w/).test(char)) { /*números, letras e underline*/
				mask.push(char === "_" ? "\\_" : char);
				gaps.push(char);
			} else if (char === "\\" && input[i+1] in code) { /*caracteres especiais*/
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
		let n = 0;
		for (let i = 0; i < gaps.length; i++) {
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
		let masks = input.split("?");
		for (let i = 0; i < masks.length; i++) {
			let mask = wd_mask(masks[i], check, callback);
			if (mask !== null) return mask;
		}
		return null;
	}

/*----------------------------------------------------------------------------*/
	function wd_csv_array(input) {/* CSV para Array */
		let data = [];
		let rows = input.trim().split("\n");
		for (let r = 0; r < rows.length; r++) {
			data.push([]);
			let cols = rows[r].split("\t")
			for (let c = 0; c < cols.length; c++) {
				let value = cols[c];
				if ((/^\"(.+)?\"$/).test(value)) /* limpar aspas desnecessárias */
					value = value.replace(/^\"/, "").replace(/\"$/, "");
				data[r].push(value);
			}
		}
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_json(input) { /* se texto, retornar um objeto, se outra coisa, retorna um JSON */
		if (input === null || input === undefined) return {};
		if (wd_vtype(input).type === "text") {
			try      {return JSON.parse(input.toString());}
			catch(e) {return {};}
		}
		try      {return JSON.stringify(input)}
		catch(e) {return ""}
	}


/*----------------------------------------------------------------------------*/
	function wd_replace_all(input, search, change) { /* replaceAll simples */
		search = new String(search);
		change = new String(change);
		let x = input.split(search);
		return x.join(change);
	}

/*----------------------------------------------------------------------------*/
	function wd_apply_getters(obj, args) { /* auto-aplica getter em objeto */
		let type   = obj.type; /* tipo do objeto original */
		let value  = null;     /* valor a ser retornado */
		let object = obj;

		for (let i = 0; i < args.length; i++) {
			/* continuar se o atributo não existir */
			if (!(args[i] in object)) continue;
			let vtype = wd_vtype(object[args[i]]);
			/* continuar se o valor for diferente do tipo original */
			if (vtype.type !== type) continue;
			object = new object.constructor(vtype);
			value  = vtype.value;
		}
		return value;
	}






/*----------------------------------------------------------------------------*/
	function wd_num_pow10(n, width) { /* transforma número em notação científica */
		if (wd_test(n, ["infinity", "zero"])) return wd_num_str(n);

		width = __finite(width) ? __integer(width, true) : undefined;

		let chars = {
			"0": "\u2070", "1": "\u00B9", "2": "\u00B2", "3": "\u00B3",
			"4": "\u2074", "5": "\u2075", "6": "\u2076", "7": "\u2077",
			"8": "\u2078", "9": "\u2079", "+": "\u207A", "-": "\u207B"
		};
		let exp = n.toExponential(width).split(/[eE]/);
		for (let i in chars) {
			let re = (/[0-9]/).test(i) ? new RegExp(i, "g") : new RegExp("\\"+i, "g");
			exp[1] = exp[1].replace(re, chars[i]);
		}
		return exp.join(" \u00D7 10");
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
		if (wd_test(n, ["infinity"])) return wd_num_str(n);

		lint = __finite(lint) ? __integer(lint, true) : 0;
		ldec = __finite(ldec) ? __integer(ldec, true) : 0;

		let sign = n < 0 ? "-" : "";
		let int  = Math.abs(__integer(n));
		let dec  = Math.abs(__decimal(n));

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
		if (wd_test(n, ["infinity"]))
			return (n < 0 ? "\u2212" : "\u002B")+"\u221E";

		let end = ratio === true ? "\u0025" : "";
		let val = Math.abs(n);

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
		let p = h < 12 ? " AM" : " PM";
		h = h === 0 ? 12 : (h <= 12 ? h : (h - 12));
		m = wd_num_fixed(m, 0, 2);
		return wd_num_fixed(h)+":"+m+p;
	}

/*----------------------------------------------------------------------------*/
	function wd_time_format(obj, char) { /* define um formato de tempo a partir de caracteres especiais */
		char = new String(char).toString();
		let words = [
			{c: "%h", v: function() {return wd_num_fixed(obj.h, 0, 0);}},
			{c: "%H", v: function() {return wd_num_fixed(obj.h, 0, 2);}},
			{c: "#h", v: function() {return obj.h12;}},
			{c: "%m", v: function() {return wd_num_fixed(obj.m, 0, 0);}},
			{c: "%M", v: function() {return wd_num_fixed(obj.m, 0, 2);}},
			{c: "%s", v: function() {return wd_num_fixed(obj.s, 0, 0);}},
			{c: "%S", v: function() {return wd_num_fixed(obj.s, 0, 2);}},
		];
		for (let i = 0; i < words.length; i++)
			if (char.indexOf(words[i].c) >= 0)
				char = wd_replace_all(char, words[i].c, words[i].v());
		return char
	}

/*----------------------------------------------------------------------------*/
	function wd_time_iso(number) { /* transforma valor numérico em tempo no formato HH:MM:SS */
		let obj = wd_number_time(number);
		let time = wd_num_fixed(obj.h, 0, 2)+":";
		time    += wd_num_fixed(obj.m, 0, 2)+":";
		time    += wd_num_fixed(obj.s, 0, 2);
		return time;
	}

/*----------------------------------------------------------------------------*/
	function wd_date_format(obj, char) { /* define um formato de data a partir de caracteres especiais */
		char = new String(char).toString();
		let words = [
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
		for (let i = 0; i < words.length; i++)
			if (char.indexOf(words[i].c) >= 0)
				char = wd_replace_all(char, words[i].c, words[i].v());
		return char
	};

/*----------------------------------------------------------------------------*/
	function wd_date_iso(value) { /* retorna data no formato YYYY-MM-YY a partir de um Date() */
		let date = wd_num_fixed(value.getFullYear(), 0, 4)+"-";
		date    += wd_num_fixed(value.getMonth()+1, 0, 2)+"-";
		date    += wd_num_fixed(value.getDate(), 0, 2);
		return date;
	}

/*----------------------------------------------------------------------------*/
	function wd_date_locale(obj, value) { /* obtem o nome do atributo da data no local */
		try {return obj.toLocaleString(wd_lang(), value);} catch(e) {}
		return obj.toLocaleString(undefined, value);
	}

/*----------------------------------------------------------------------------*/
	function wd_date_size(m, y) { /* quantidade de dias no mês */
				let list = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				return (m === 2 && wd_is_leap(y) ? 1 : 0) + list[m - 1];
	};

/*----------------------------------------------------------------------------*/
	function wd_date_working(y, ref) { /* obtem os dias úteis a partir de uma referência */
		let init = wd_set_date(null, 1, 1, y).getDay()+1;
		let work = 0;
		for (let i = 0; i < ref; i++) {
			if (init === 8) init = 1;         /* reestabelece o looping semanal */
			if (init > 1 && init < 7) work++; /* se for dia útil, conta */
			init++;
		}
		return work;
	}

/*----------------------------------------------------------------------------*/
	function wd_date_days(y, m, d) { /* dias transcorridos no ano */
		let days  = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
		return days[m - 1] + d + ((m > 2 && wd_is_leap(y)) ? 1 : 0);
	}

/*----------------------------------------------------------------------------*/
	function wd_date_week(days, today) { /* retorna a semana do ano (cheia) */
		let ref = days - today + 1;
		return (ref % 7 > 0 ? 1 : 0) + __integer(ref/7);
	}

/*----------------------------------------------------------------------------*/
	function wd_matrix_cell(matrix, cell) { /* obtem lista de valores ade matriz a partir de endereço linha:coluna */
		/* celula linha:coluna */
		cell = new String(cell).trim().split(":");
		if (cell.length < 2) cell.push("");

		/* i: célula inicial, n: célula final */
		let row  = {i: -Infinity, n: Infinity};
		let col  = {i: -Infinity, n: Infinity};
		let list = [];
		let item = [row, col];

		/* definindo parâmetros para captura da linha (0) e coluna (1) */
		for (let i = 0; i < item.length; i++) {
			if ((/^[0-9]+$/).test(cell[i])) { /* unico endereço */
				item[i].i = __integer(cell[i]);
				item[i].n = __integer(cell[i]);
			} else if ((/^\-[0-9]+$/).test(cell[i])) { /* do início até o endereço */
				item[i].n = __integer(cell[i].replace("-", ""));
			} else if ((/^[0-9]+\-$/).test(cell[i])) { /* do endereço até o fim */
				item[i].i = __integer(cell[i].replace("-", ""));
			} else if ((/^[0-9]+\-[0-9]+$/).test(cell[i])) { /* do endereço inicial até o final */
				let gap   = cell[i].split("-");
				item[i].i = __integer(gap[0]);
				item[i].n = __integer(gap[1]);
			}
		}

		/* obtendo valores */
		for (let r = 0; r < matrix.length; r++) {
			let check = wd_vtype(matrix[r]);
			if (check.type !== "array") continue;
			for (let c = 0; c < matrix[r].length; c++) {
				if (r >= row.i && r <= row.n && c >= col.i && c <= col.n)
					list.push(matrix[r][c]);
			}
		}

		return list;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_cells(matrix, values) { /* obtem lista a partir de múltiplas referências */
		let data = [];
		for (let i = 0; i < values.length; i++) {
			values[i] = new String(values[i]).toString();
			values[i] = wd_replace_all(values[i], " ", "");
			let items = wd_matrix_cell(matrix, values[i]);
			for (let j = 0; j < items.length; j++) data.push(items[j]);
		}
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_item(array, i) { /* retorna o índice especificado ou seu comprimento */
		if (!__finite(i)) return array.length;
		i = __integer(i);
		i = i < 0 ? array.length + i : i;
		return array[i];
	}

/*----------------------------------------------------------------------------*/
	function wd_array_check(array, values) { /* informa se o array contem os valores */
		if (values.length === 0) return false;
		for (let i = 0; i < values.length; i++)
			if (array.indexOf(values[i]) < 0) return false;
		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_search(array, value) { /* procura item no array e retorna os índices localizados */
		let index = [];
		for (let i = 0; i < array.length; i++)
			if (array[i] === value) index.push(i);
		return index.length === 0 ? null : index;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_del(array, values) { /* retorna um array sem os valores informados */
		let list = [];
		for (let i = 0; i < array.length; i++)
			if (values.indexOf(array[i]) < 0) list.push(array[i])
		return list;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_add(array, values) { /* adiciona items ao array */
		array = array.slice();
		for (let i = 0 ; i < values.length; i++) array.push(values[i])
		return array;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_tgl(array, values) { /* alterna a existência de valores do array */
		for (let i = 0 ; i < values.length; i++) {
			if (array.indexOf(values[i]) < 0)
				array = wd_array_add(array, [values[i]]);
			else
				array = wd_array_del(array, [values[i]]);
		}
		return array;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_count(array, value) { /* retorna a quantidade de vezes que o item aparece */
		let test = wd_array_search(array, value);
		return test === null ? 0 : test.length;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_rpl(array, item, value) { /* muda os valores de determinado item */
		let index = wd_array_search(array, item);
		if (index === null) return array;
		array = array.slice();
		for (let i = 0; i < index.length; i++) array[index[i]] = value;
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

		let order = [/*sequência de exibição por tipo*/
			"number", "time", "date", "text", "boolean", "null", "dom",
			"array", "object", "function", "regexp", "undefined", "unknown"
		];

		array = array.slice();
		array.sort(function(a, b) {
			let atype  = wd_vtype(a).type;
			let btype  = wd_vtype(b).type;
			let aindex = order.indexOf(atype);
			let bindex = order.indexOf(btype);
			let avalue = a;
			let bvalue = b;

			if (aindex > bindex) return  1;
			if (aindex < bindex) return -1;
			if (atype === "dom") {/*atype === btype (tipos iguais)*/
				let check = wd_array_sort([a.textContent, b.textContent]);
				avalue = a.textContent === check[0] ? 0 : 1;
				bvalue = avalue === 0 ? 1 : 0;
			} else if (atype === "text") {
				avalue = __strClear(a.toUpperCase());
				bvalue = __strClear(b.toUpperCase());
			} else if (["number", "boolean", "date", "time"].indexOf(atype) >= 0) {
				avalue = wd_vtype(a).value;
				bvalue = wd_vtype(b).value;
			}
			return avalue > bvalue ? 1 : -1;
		});

		return array;
	}

/*----------------------------------------------------------------------------*/
	function wd_array_csv(array) { /* transforma um array em dados CSV */
		let csv = [];

		for (let i = 0; i < array.length; i++) {
			let line = array[i];
			let type = wd_vtype(line).type;

			if (type === "array") {
				for (let j = 0; j < line.length; j++)
					line[j] = String(line[j]).replace(/\t/g, " ").replace(/\n/g, " ");
			} else {
				line = [String(line).replace(/\t/g, " ").replace(/\n/g, " ")];
			}

			csv.push(line.join("\t"));
		}

		return csv.join("\n");
	}

/*----------------------------------------------------------------------------*/
	function wd_matrix_data(matrix, x, y) { /* retorna dados estatísticos de uma matriz */
		x = wd_matrix_cell(matrix, x);
		y = wd_matrix_cell(matrix, y);
		return {
			get cmp()  {return wd_coord_compare(x, y, false);},
			get rlin() {return wd_coord_rlin(x, y);},
			get rexp() {return wd_coord_rexp(x, y);},
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
		let coord = {x: [], y: [], z: [], length: 0};
		/* checando se argumentos são arrays (x é obrigatório) */
		if (wd_vtype(x).type !== "array") return null;
		if (wd_vtype(y).type !== "array") y = null;
		if (wd_vtype(z).type !== "array") z = null;

		/* verificando conteúdo (deve ser numérico */
		let n = x.length;
		if (y !== null && y.length < n) n = y.length;
		if (z !== null && z.length < n) n = z.length;
		for (let i = 0; i < n; i++) {
			let xtype = wd_vtype(x[i]);
			let ytype = y === null ? null : wd_vtype(y[i]);
			let ztype = z === null ? null : wd_vtype(z[i]);
			if (!__finite(xtype.value)) continue;
			if (y !== null && !__finite(ytype.value)) continue;
			if (z !== null && !__finite(ztype.value)) continue;

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
		let coord = wd_coord_adjust(x, y, z);
		if (coord === null) return null;
		x = coord.x;
		y = coord.y;
		z = coord.z;
		let data = {value: 0, length: 0};
		for (let i = 0; i < coord.length; i++) {
			let vx = Math.pow(x[i],nx);
			let vy = y === null ? 1 : Math.pow(y[i],ny);
			let vz = z === null ? 1 : Math.pow(z[i],nz);
			if (!__finite(vx) || !__finite(vy) || !__finite(vz)) continue;
			data.value += vx * vy * vz;
			data.length++;
		}
		return data.length === 0 ? null : data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_product(x, nx) { /* retorna o produto da coordernada */
		let coord = wd_coord_adjust(x);
		if (coord === null) return null;
		x = coord.x;
		let data = {value: 1, length: 0};
		for (let i = 0; i < coord.length; i++) {
			let vx = Math.pow(x[i], nx);
			if (vx === 0 || !__finite(vx)) continue;
			data.value = data.value * vx;
			data.length++;
		}
		return data.length === 0 ? null : data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_limits(x) { /* retorna os maiores e menores valores da lista */
		let coord = wd_coord_adjust(x);
		if (coord === null) return null;
		x = wd_array_sort(coord.x);
		return {min: x[0], max: x.reverse()[0]};
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_avg(x) { /* retorna a média dos valores da lista */
		let sum = wd_coord_sum(x, 1);
		if (sum === null) return null
		return sum.value/sum.length;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_med(x) { /* retorna a mediana dos valores da lista */
		let coord = wd_coord_adjust(x);
		if (coord === null) return null
		x = wd_array_sort(coord.x);
		let l = x.length
		return l%2 === 0 ? (x[l/2]+x[(l/2)-1])/2 : x[(l-1)/2]
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_harm(x) { /* retorna a média harmonica */
		let harm = wd_coord_sum(x, -1);
		return (harm === null) ? null : harm.length/harm.value;
	}

/*----------------------------------------------------------------------------*/
  function wd_coord_geo(x) { /* retorna a média geométrica */
		let geo = wd_coord_product(x, 1);
		return (geo === null) ? null : Math.pow(geo.value, 1/geo.length);
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_deviation(x, ref) { /* retorna o desvio padrão entre listas ou uma referência */
		/* checando argumentos */
		let vref  = wd_vtype(ref);
		let coord = wd_coord_adjust(x, (vref.type === "array" ? ref : null));
		if (coord === null) return null;

		if (vref.type === "number") {
			if (!__finite(vref.value)) return null;
			ref = vref.value;
			x = coord.x;
		} else if (vref.type === "array") {
			x   = coord.x;
			ref = coord.y;
		} else return null;

		/* calculando */
		let data = {value: 0, length: 0};
		for (let i = 0; i < x.length; i++) {
			let diff = x[i] - (vref.type === "array" ? ref[i] : ref);
			let val = Math.pow(diff, 2);
			if (!__finite(val)) continue;
			data.value += val;
			data.length++;
		}
		return data.length === 0 ? null : Math.sqrt(data.value/data.length);
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_setter(x, f) { /* obtem uma nova coordenada mediante aplicação de uma função */
		let data = [];
		let val  = null;
		for (let i = 0; i < x.length; i++) {
			try {val = f(x[i]);} catch(e) {}
			data.push(__finite(val) ? val : null);
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
		let coord = wd_coord_adjust(x, y);
		if (coord === null) return null;
		x = coord.x;
		y = coord.y;
		let val = __leastSquares(x, y);
		if (val === null) return null;
		let data = {};
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
		let coord = wd_coord_adjust(x, y);
		if (coord === null) return null;
		x = coord.x;
		y = coord.y;
		let val = __leastSquares(x, wd_coord_setter(y, Math.log));
		if (val === null) return null;
		let data = {};
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
		let coord = wd_coord_adjust(x, y);
		if (coord === null) return null;
		x = coord.x;
		y = coord.y;
		let val = __leastSquares(
			wd_coord_setter(x, Math.log), wd_coord_setter(y, Math.log)
		);
		if (val === null) return null;
		let data = {};
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
		let coord = wd_coord_adjust(x, y);
		if (coord === null) return null;
		x = coord.x;
		y = coord.y;
		/* -- integral ax+b = (yf+yi)(xf-xi)/2 -- */
		let int = 0;
		for (let i = 0; i < (coord.length - 1); i++)
			int += (y[i+1]+y[i])*(x[i+1]-x[i])/2;

		let data = {};
		data.e = "\u03A3y\u0394x \u2248 b";
		data.a = 0;
		data.b = int;
		data.f = function(z) {
			let i = 0;
			let n = null;
			while (n === null && ++i !== coord.length)
				if (z <= x[i]) n = i;
			if (n === null) n = coord.length-1;
			let line = wd_coord_rlin([x[n-1], x[n]], [y[n-1], y[n]]);
			return line === null ? null : line.f(z);
		}
		data.d = 0;
		data.m = wd_coord_rmath(data.e, data.a, data.b, data.d);
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_ravg(x, y) { /* calcula a média da área embaixo das retas que ligam os pontos */
		let sum = wd_coord_rsum(x, y);
		if (sum === null) return null
		let end = wd_coord_limits(x);
		let avg = sum.b / (end.max - end.min);
		let data = {};
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
		let ends = wd_coord_limits(xcoord);
		if (ends === null) return null;
		delta = wd_vtype(delta).value;
		if (!__finite(delta)) delta = (ends.max - ends.min)/xcoord.length;
		delta = Math.abs(delta);

		/* obtendo amostra */
		let x = [];
		while (ends.min < ends.max) {
			x.push(ends.min);
			ends.min += delta;
		}
		x.push(ends.max);

		let y = wd_coord_setter(x, func);
		let c = wd_coord_adjust(x, y);
		if (c === null) return null;
		return {x: c.x, y: c.y};
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_compare(x, y, list) { /* compara dados entre dois arrays x,y */
		if (wd_vtype(x).type !== "array" || wd_vtype(y).type !== "array")
			return null;
		/* organizando dados */
		let data = {};
		let sum  = 0;
		for (let i = 0; i < x.length; i++) {
			if (i > (y.length-1)) break;
			let vtype = wd_vtype(y[i]);
			if (vtype.type !== "number") continue;
			let name = new String(x[i]).trim();
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
		for (let name in data) {
			data[name].per = sum === 0 ? 0 : data[name].amt/sum;
		}
		if (list === true) {
			let obj = {sum: sum, x: [], amt: [], avg: [], occ:[], per: []};
			for (let i in data) {
				obj.x.push(i);
				for (let j in data[i]) obj[j].push(data[i][j]);
			}
			return obj;
		}
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_matrix_object(array) { /* matriz de array para objeto*/
		let x = [];
		for (let row = 1; row < array.length; row++) {
			let cols = array[row];
			x.push({});
			for (let col = 0; col < cols.length; col++) {
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
	function wd_html_vform(list) { /* checar a validade de um conjunto de formulários */
		for (let i = 0; i < list.length; i++) {
			let data = new WDform(list[i]);
			if (data.submit() === false) return false;
		}
		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_dform(list, get) { /* obtém serialização de formulário */
		/* se houver algum elemento inválido, retornar */
		if (!wd_html_vform(list)) return null;
		/* obtendo pacote de dados */
		let data = {};
		for (let e = 0; e < list.length; e++) {
			let form  = new WDform(list[e]);
			let value = form.data;
			if (value === null) continue;
			for (let i in value)
				data[i] = get === true ? value[i].GET : value[i].POST;
		}
		/* montando pacote de dados */
		let isGET  = (get === true || !("FormData" in window)) ? true : false;
		let submit = isGET ? [] : new FormData();
		for (let i in data) {
			if (isGET) submit.push(i+"="+data[i]);
			else submit.append(i, data[i]);
		}
		return isGET ? submit.join("&") : submit;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_dataset_value(elem, attr) { /* transforma o valor dataset em um array de objetos */
		/* a{B}c{D}&e{F} => [{a: B, c: D}, {e: F}] */
		let list = [{}];
		if (!(attr in elem.dataset)) return list;
		let key    = 0;
		let open   = 0;
		let name   = "";
		let value  = "";
		let object = false;
		let core   = new String(elem.dataset[attr]).trim().split("");
		for (let i = 0; i < core.length; i++) {
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
		let args = [null];
		for (let i = 1; i < arguments.length; i++)
			args.push(arguments[i]);
		/* looping nos elementos */
		let query = this.valueOf();
		for (let i = 0; i < query.length; i++) {
			let x = query[i];
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
		let action = remove === true ? "removeEventListener" : "addEventListener";
		for (let ev in events) {
			let method = events[ev];
			if (wd_vtype(method).type !== "function") continue;
			let event  = ev.toLowerCase().replace(/^on/, "");
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
		for (let i in styles) /* definindo styles */
			elem.style[__strCamel(i)] = styles[i];
		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_class(elem, value) { /* obtem/define o valor do atributo class */
		/* FIXME v5: mudar de className para setAttribute("class", value) */
		let val = elem.className;
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
		let array = wd_no_spaces(wd_html_class(elem)).split(" ");
		let old   = wd_array_sort(wd_array_unique(array)).join(" ");

		for (let i in obj) {
			let val = wd_vtype(obj[i]);
			if (val.type !== "text") continue;
			val = wd_no_spaces(val.value).split(" ");
			if (i === "rpl" && val.length < 2) continue;
			if (i === "add") array = wd_array_add(array, val); else
			if (i === "del") array = wd_array_del(array, val); else
			if (i === "tgl") array = wd_array_tgl(array, val); else
			if (i === "rpl") array = wd_array_rpl(array, val[0], val[1]);
		}

		array = wd_no_spaces(wd_array_sort(wd_array_unique(array)).join(" "));

		/* se o valor antigo for igual ao novo, não fazer nada */
		if (array === old) return old;
		/* caso contrário, redefinir */
		return wd_html_class(elem, array);
	}

/*----------------------------------------------------------------------------*/
	function wd_html_data(elem, obj) { /* define atributos dataset no elemento a partir de um objeto */
		/* deletar todos os atributos */
		if (obj === null) {
			let list = {};
			for (let i in elem.dataset) list[i] = null;
			return wd_html_data(elem, list);
		}
		/* checando argumento, se não for um objeto, retornar */
		if (wd_vtype(obj).type !== "object") return null;

		for (let i in obj) {
			/* atributo precisa ser alfabético para transformar em camelCase */
			if (wd_vtype(i).type !== "text") continue;
			let key = __strCamel(i);
			let val = obj[i];

			if (val !== null) /* definir atributo */
				elem.dataset[key] = val;
			else if (key in elem.dataset) /* apagar atributo */
				delete elem.dataset[key];
			else continue

			/* executar verificação após definição */
			settingProcedures(elem, key);
		}
		return;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_clone(elem) { /* clona elementos que o cloneNode não atende (scripts) */
		let tag   = elem.tagName;
		let attrs = elem.attributes;
		let clone = document.createElement(tag);
		/* definindo propriedades */
		clone.innerHTML = elem.innerHTML
		for (let i = 0; i < attrs.length; i++)
			clone.setAttribute(attrs[i].name, attrs[i].value);

		return clone;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_append(base, html, overlap) { /* adiciona/substitui elementos por texto em HTML */
		let temp = overlap ===  true ? document.createElement("DIV") : base;
		temp.innerHTML = html;
		let scripts = wd_vtype(__$$("script", temp)).value;

		/* sem scripts (se inner, já está pronto) */
		if (scripts.length === 0) {
			if (overlap === true) base.outerHTML = html;
			return;
		}
		/* com scripts: clonar, adicionar o clone e remover o original */
		for (let i = 0; i < scripts.length; i++) {
			let script = scripts[i];
			let clone  = wd_html_clone(script);
			let parent = script.parentElement;
			parent.insertBefore(clone, script);
			script.remove();
		}
		/* se for outer, tem que adicionar ao lado da base e depois excluí-la */
		if (overlap === true) {
			let childs = wd_vtype(temp.children).value;
			let parent = base.parentElement;
			for (let i = 0; i < childs.length; i++) {
				let child = childs[i];
				parent.insertBefore(child, base);
			}
			base.remove();
		}
		return;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_load(elem, text, overlap) { /* carrega um HTML (texto) no elemento */
		text = text === undefined || text === null ? "" : new String(text).toString();
		/* obtendo o atributo para carregar o conteúdo HTML */
		let test = new WDform(elem);
		let attr = test.form && test.load !== null ? test.load : "innerHTML";
		/* carregando conteúdo */
		if (attr !== "innerHTML")
			elem[attr] = text;
		else
			wd_html_append(elem, text, overlap);
		/* checar demandas pós procedimento */
		loadingProcedures();

		return;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_repeat(elem, json) { /* clona elementos por array repetindo-os */
		if (wd_vtype(json).type !== "array") return null;

		/*--------------------------------------------------------------------------
		| -- DEFINIR O MODELO A SER REPETIDO --
		| A) obter o conteúdo textual dos filhos
		| B) se o conteúdo de A conter {{}}, armazená-lo em data-wd-repeat-model
		| C) caso contrário, utilizar o conteúdo gravado de data-wd-repeat-model
		| D) caso contrário, não há modelo a ser repetido: retornar
		| E) corrigir a adequação dos atributos do DOM ( {{x}} para {{x}}="" )
		| F) limpar elementos filhos para esconder modelo
		\-------------------------------------------------------------------------*/
		let html = elem.innerHTML; /*A*/
		if (html.search(/\{\{.+\}\}/gi) >= 0) /*B*/
			elem.dataset.wdRepeatModel = html;
		else if ("wdRepeatModel" in elem.dataset) /*C*/
			html = elem.dataset.wdRepeatModel;
		else return; /*D*/

		html = html.split("}}=\"\"").join("}}"); /*E*/
		elem.innerHTML = ""; /*F*/

		/*--------------------------------------------------------------------------
		| -- DEFINIR NOVOS FILHOS A PARTIR DO MODELO E DA LISTA --
		| G) criar uma lista que agrupará o os elementos em forma textual
		| H) looping: array de objetos
		| I) trocar {{attr}} pelo valor do atributo do objeto {attr: valor}
		| J) adicionar conteúdo à lista F
		| K) renderizar filhos do elemento com o agrupamento da lista
		\-------------------------------------------------------------------------*/
		let data = [""]; /*G*/
		for (let i = 0; i < json.length; i++) { /*H*/
			if (wd_vtype(json[i]).type !== "object") continue;
			let inner = html;
			for (let c in json[i]) /*I*/
				inner = inner.split("{{"+c+"}}").join(json[i][c]);
			data.push(inner); /*J*/
		}
		elem.innerHTML = data.join(""); /*K*/

		/* checar demandas pós procedimento */
		loadingProcedures();
		return;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_nav(elem, action) { /* define exibições e inibições de elementos */
		action = new String(action).toLowerCase();

		if (action === "show")   return wd_html_css(elem, {del: "js-wd-no-display"});
		if (action === "hide")   return wd_html_css(elem, {add: "js-wd-no-display"});
		if (action === "toggle") return wd_html_css(elem, {tgl: "js-wd-no-display"});
		if (action === "prev" || action === "next") {
			let child = wd_vtype(elem.children).value;
			if (child.length === 0) return null;
			if (child.length === 1) return wd_html_nav(child[0], "toggle");
			let first = +Infinity;
			let last  = -Infinity;
			/* Procurando pelos filhos visíveis */
			for (let i = 0; i < child.length; i++) {
				let css  = wd_html_class(child[i]).split(" ");
				let show = css.indexOf("js-wd-no-display") < 0 ? true : false;
				if (show && i < first) first = i;
				if (show && i > last ) last  = i;
			}
			if (first === +Infinity) first = 0;
			if (last === +Infinity ) last  = child.length-1;
			/* definindo os próximos a serem exibidos */
			let next = last >= (child.length-1) ? 0 : last+1;
			let prev = first <= 0 ? child.length-1 : first-1;
			return wd_html_nav(child[action === "prev" ? prev : next]);
		}
		if ((/^[0-9]+\:[0-9]+$/).test(action)) {
			let child = wd_vtype(elem.children).value;
			if (child.length === 0) return null;
			let value = action.split(":");
			let init = wd_vtype(value[0]).value;
			let end  = wd_vtype(value[1]).value;
			if (!__finite(init)) init = 0;
			if (!__finite(end))  end  = child.length-1;
			let show = end >= init ? true : false;
			if (!show) {
				let temp = init;
				init = end;
				end  = temp;
			}
			for (let i = 0; i < child.length; i++) {
				if (i >= init && i <= end)
					wd_html_nav(child[i], (show ? "show" : "hide"));
				else
					wd_html_nav(child[i], (show ? "hide" : "show"));
			}
			return true;
		}
		/*default*/
		let bros = elem.parentElement.children;
		for (let i = 0; i < bros.length; i++)
			wd_html_nav(bros[i], (bros[i] === elem ? "show": "hide"));
		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_jump(elem, parents) { /* transporta o elemento entre dois containers */
		for (let i = 0; i < parents.length; i++) {
			if (elem.parentElement === parents[i]) {
				let item = (i + 1) >= (parents.length) ? 0 : (i + 1);
				return parents[item].appendChild(elem);
			}
		}
		return;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_filter(elem, search, chars) { /* exibe somente o elemento que contenha o texto casado */
		if (search === null || search === undefined) return null;

		/* remodelando a quantidade de caracteres */
		chars = __finite(chars) && chars !== 0 ? __integer(chars) : 1;

		/* definindo valor de busca */
		let type = wd_vtype(search).type;
		if (type !== "regexp") {/* definir string, limpar e por caixa alta */
			search = new String(search);
			search = __strClear(search.toString()).toUpperCase();
		}

		/* looping pelos filhos */
		let child = wd_vtype(elem.children).value;
		for (let i = 0; i < child.length; i++) {
			if (!("textContent" in child[i])) continue;

			/* obtendo conteúdo do elemento (limpar, mas deixar maiúsculo apenas para texto) */
			let content = __strClear(child[i].textContent);

			/* se for expressão regular */
			if (type === "regexp") {
				wd_html_nav(child[i], (search.test(content) ? "show" : "hide"));
				continue;
			}

			/* se for texto, encontrou o fragmento? quantos caracteres? */
			let found = content.toUpperCase().indexOf(search) >= 0 ? true : false;
			let width = search.length;

			/* definindo a exibição a partir da quantidade de caracteres */
			if (chars < 0)
				wd_html_nav(child[i], (found && width >= -chars) ? "show" :  "hide");
			else
				wd_html_nav(child[i], (!found && width >= chars) ? "hide" :  "show");
		};
		return;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_set(elem, attr, val) { /* define atributos/funcões no elemento */
		if (wd_vtype(elem[attr]).type === "function")
			return elem[attr](val);
		/* representando um toggle com ? nos casos de booleano */
		let get1 = elem[attr];
		let get2 = elem.getAttribute(attr);
		if (val === "?" && (get1 === true  || get2 === true )) val = false; else
		if (val === "?" && (get1 === false || get2 === false)) val = true;
		/* definindo valores */
		if (attr in elem)
			try {return elem[attr] = val;} catch(e) {} /* nem todos os atributos são writables */
		/* se não for writable (se falhou na linha anterior */
		return elem.setAttribute(attr, val);
	}

/*----------------------------------------------------------------------------*/
	function wd_html_full(elem, exit) { /* deixa o elemento em tela cheia */
		let action = {
			open: ["requestFullscreen", "webkitRequestFullscreen", "msRequestFullscreen"],
			exit: ["exitFullscreen", "webkitExitFullscreen", "msExitFullscreen"]
		};
		let full   = exit === true ? action.exit : action.open;
		let target = exit === true ? document : elem;
		for (let i = 0; i < full.length; i++) {
			if (full[i] in target)
				try {return target[full[i]]();} catch(e) {}
		}
		return null;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_page(elem, page, size) { /* exibe determinados grupos de elementos filhos */
		let lines = wd_vtype(elem.children).value;
		if (lines.length === 0) return null;
		page = wd_vtype(page).value;
		size = wd_vtype(size).value;
		if (!__finite(size)) size = -1;
		if (!__finite(page) && page !== "+" && page !== "-") page = 0;

		/*--------------------------------------------------------------------------
		| A) se size  < 0  obter toda a amostra;
		| B) se size  < 1  obter uma fração da amostra
		| C) se size >= 1 obter a amostra (valor inteiro)
		| D) se size  = 0  size = 1 (limite mínimo de size)
		--------------------------------------------------------------------------*/
		if (size < 0) { /*A*/
			page = 0;
			size = lines.length;
		} else {
			size = __integer(size < 1 ? size*lines.length : size); /*BC*/
			if (size === 0) size = 1; /*D*/
		}

		function last() { /* informa a última página */
			return __integer(lines.length/size + (lines.length % size === 0 ? -1 :0));
		}

		/*--------------------------------------------------------------------------
		| A) se page < 0           exibir a última página;
		| B) se size*page >= lines exibir a última página;
		| C) se page = +     exibir a próxima página;
		| D) se page = -     exibir a página anterior;
		| se size < 1 e amostra = 0, amostra = 1 (limite mínimo de size)
		| caso contrário, obter a amostra (inteiro)
		--------------------------------------------------------------------------*/

		/* próxima página e página anterior */
		if (page === "+" || page === "-") /*CD*/ {
			let current = elem.dataset.wdCurrentPage;
			let npage   = current === undefined ? 0 : wd_vtype(current.split("/")[0]);
			npage = (npage.type !== "number" || npage.value < 0) ? 0 : npage.value;
			npage = page === "+" ? npage+1 : npage-1;
			return wd_html_page(elem, (npage < 0 ? 0 : npage), size);
		}

		/* análise numérica */
		if (page < 0 || size*page >= lines.length) /*AB*/
			page = last();
		else /* padrão */
			page = __integer(page);
		let start = page*size;
		let end   = start+size-1;
		wd_html_nav(elem, ""+start+":"+end+"");
		/* guardar informação da última página */
		elem.dataset.wdCurrentPage = page+"/"+__integer(lines.length/size);
		return;

	}

/*----------------------------------------------------------------------------*/
	function wd_html_sort(elem, order, col) { /* ordena elementos filho pelo conteúdo */
		order = __finite(order) ? __integer(order) : 1;
		col   = __finite(col)   ? __integer(col, true) : null;

		let children = wd_vtype(elem.children).value;
		let aux = [];

		for (let i = 0; i < children.length; i++) {
			if (col === null)
				aux.push(children[i]);
			else if (children[i].children[col] !== undefined)
				aux.push(children[i].children[col]);
		}

		let sort = wd_array_sort(aux);
		if (order < 0) sort = sort.reverse();
		for (let i = 0; i < sort.length; i++)
			elem.appendChild(col === null ? sort[i] : sort[i].parentElement);

		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_style_get(elem, css) { /* devolve o valor do estilo especificado */
		let style = window.getComputedStyle(elem, null);
		return css in style ? style.getPropertyValue(css) : null;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_table_array(elem) { /* transforma os dados de uma tabela (table) em matriz */
		let tag = wd_html_tag(elem);
		if (["tfoot", "tbody", "thead", "table"].indexOf(tag) < 0) return null;
		let data = [];
		let rows = elem.rows;
		for (let row = 0; row < rows.length; row++) {
			let cols = wd_vtype(rows[row].children).value;
			if (data[row] === undefined) data.push([]);
			for (let col = 0; col < cols.length; col++) {
				if (data[row][col] === undefined) data[row].push([]);
				let val = wd_vtype(cols[col].textContent);
				if (val.type === "time") val = wd_time_iso(val.value); else
				if (val.type === "date") val = wd_date_iso(val.value);
				else val = val.value;
				data[row][col] = val;
			}
		}
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_bros_index(elem) { /* obtem o índice (posição) do elemento em relação aos irmãos */
		let bros = elem.parentElement.children;
		for (let i = 0; i < bros.length; i++)
			if (bros[i] === elem) return i;
		return 0;
	}

/*----------------------------------------------------------------------------*/
	function wd_html_info(elem) { /* devolve informações diversas sobre o primeiro elemento */
		let test = new WDform(elem);
		return {
			tag: wd_html_tag(elem),
			value: test.value,
			name: test.name,
			type: test.type,
			text: elem.textContent,
			className: wd_html_class(elem),
			index: wd_html_bros_index(elem),
			table: wd_html_table_array(elem)
		}
	}

/*----------------------------------------------------------------------------*/
	function wd_html_translate(elem, json) { /* carrega tradução vinculada a seletor CSS em arquivo JSON */
		/* FORMATO DO JSON
		[
			{"$$": "CSS Selectors", "$":  "CSS Selector", "textContent": "Text", "title": "Title"},
			...
		]
		*/
		/* rodando itens do array do JSON */
		for (let i = 0; i < json.length; i++) {
			let attrs = json[i];
			let check = wd_vtype(__$$$(attrs, elem));
			if (check.type !== "dom") continue;
			/* rodando alvos */
			let list = check.value;
			for (let l = 0; l < list.length; l++) {
				let target = list[l];
				/* rodando atributos */
				for (let attr in attrs) {
					if (attr === "$" || attr === "$$") continue;
					let value = attrs[attr];
					wd_html_set(target, attr, value);
				}
			}
		}
		return;
	}

/*----------------------------------------------------------------------------*/
	function wd_url(name) { /* obtém o valores da URL */
		/* obter somente o hash */
		if (name === undefined || name === null)
			return null;
		if (typeof name !== "string" || name.trim() === "")
			return null;
		if (name === "*")
			return document.URL;
		if (name === ":")
			return window.location.protocol.replace(/\:$/, "");
		if (name === "@")
			return window.location.host;
		if (name === "$")
			return window.location.hostname;
		if (name === "/")
			return window.location.pathname.replace(/^\//, "");
		if (name === "#")
			return window.location.hash.replace(/^\#/, "");
		if (name === "?")
			return window.location.search.replace(/^\?/, "");

		let data = window.location.search.replace(/^\?/, "").split(name+"=");
		return data.length < 2 ? null : decodeURIComponent(data[1].split("&")[0]);
	}

/*----------------------------------------------------------------------------*/
	function wd_html_chart(elem, data, title, xlabel, ylabel) {
		/* constroe um gráfico a partir de um conjuto de dados [{x: [], y:[], label: "", type:""}]*/
		let compare = true;
		let chart   = new WDchart(elem, title);
		for (let i = 0; i < data.length; i++) {
			if (data[i].type !== "compare") compare = false;
			chart.add(data[i].x, data[i].y, data[i].label, data[i].type);
		}
		return chart.plot(xlabel, ylabel, compare);
	}

/*----------------------------------------------------------------------------*/
	function wd_request(action, pack, callback, method, async) { /* executa requisições */
		/* ajustes iniciais */
		action = new String(action).toString();
		if (pack === undefined) pack = null;
		if (wd_vtype(callback).type !== "function") callback = null;
		method = method === undefined || method === null ? "POST" : method.toUpperCase();
		async  = async !== false ?  true : false;

		/* Chamando requisição e iniciando o tempo */
		let request = new XMLHttpRequest();
		let start   = new Date().valueOf();

		/* conjunto de dados a ser repassado para a função */
		let data = {
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

		function set_data(status, closed, loaded, total) { /* disparador: define a variável data */
			if (data.closed) return;
			data.status = status;
			data.closed = closed;
			data.loaded = loaded;
			data.total  = total;
			wd_modal_control.progress(data.progress);
			if (status === "ABORTED") request.abort();
			if (callback !== null)    callback(data);
		}

		function state_change(x) { /* disparador: mudança de estado */
			if (request.readyState < 1) return;
			if (data.closed) return;
			if (data.status === "UNSENT") {
				data.status = "OPENED";
				wd_modal_control.start();
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
			if (callback !== null)
				callback(data);
			if (data.closed)
				wd_modal_control.end();
		}

		/* definindo disparador aos eventos */
		request.onprogress         = function(x) {set_data("LOADING", false, x.loaded, x.total);}
		request.onerror            = function(x) {set_data("ERROR",   true, 0, 0);}
		request.ontimeout          = function(x) {set_data("TIMEOUT", true, 0, 0);}
		request.upload.onprogress  = function(x) {set_data("UPLOADING", false, x.loaded, x.total);}
		request.upload.onabort     = request.onerror;
		request.upload.ontimeout   = request.ontimeout;
		request.onreadystatechange = state_change;
		/* executando os comandos para a requisição */
		let vpack = wd_vtype(pack);

		if (method === "GET" && vpack.type === "text") {
			action = action.split("?");
			if (action.length > 1)
				action = action[0]+"?"+action[1]+"&"+vpack.value;
			else
				action = action[0]+"?"+vpack.value;
			pack   = null;
		}
		/* tentar abrir a requisição */
		try {
			request.open(method, action, async);
		} catch(e) {
			set_data("ERROR", true, 0, 0)
			if (callback !== null) callback(data);
			return false;
		}
		/* se o método for POST */
		if (method === "POST" && pack.type === "text")
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		/* enviar requisição */
		request.send(pack);
		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_read(elem, call, mode) { /* faz a leitura de arquivos */
		/* testando argumentos */
		let form = new WDform(elem);
		if (form.type !== "file")    return null;
		let arg = wd_vtype(call);
		if (arg.type !== "function") return null;
		let files = form.vfile;
		if (files.length === 0)      return null;

		/* lendo arquivos selecionados */
		for (let i = 0; i < files.length; i++) {
			let file = files[i];
			let mime = String(file.type).split("/")[0].toLowerCase();
			let method = {
				binary: "readAsBinaryString", buffer: "readAsArrayBuffer",
				text:   "readAsText",         audio:  "readAsDataURL",
				video:  "readAsDataURL",      image:  "readAsDataURL",
				url:    "readAsDataURL"
			};
			/* definindo a informação a ser capturada se argumento é inadequado (binary - default) */
			if (!(mode in method))
				mode = mime in method ? mime : "binary";

			/* construindo objeto e chamando janela modal */
			let reader = new FileReader();
			wd_modal_control.start();

			/* disparador para quando terminar o carregamento */
			reader.onload = function() {
				let result = this.result;
				call({
					elem:         elem,
					item:         i,
					length:       files.length,
					name:         file.name,
					size:         file.size,
					type:         file.type,
					lastModified: file.lastModified,
					data:         result
				});
				/* fechando janela modal correspondente */
				wd_modal_control.end();
				return;
			}

			/* disparador para registrar o andamento do carregamento */
			reader.onprogress = function(x) {
				wd_modal_control.progress(x.loaded / x.total);
				return;
			}

			/* capturando dados conforme especificado em mode */
			reader[method[mode]](file);
		}

		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_notify(title, msg) { /* exibe uma notificação, se permitido */
		if (!("Notification" in window))
			return wd_signal_control.open(msg, title);
		if (Notification.permission === "denied")
			return null;
		if (Notification.permission === "granted")
			new Notification(title, {body: msg});
		else
			Notification.requestPermission().then(function(x) {
				if (x === "granted")
					new Notification(title, {body: msg});
			});
		return true;
	}

/*----------------------------------------------------------------------------*/
	function wd_test(input, list) { /* testa, em uma lista de possibilidades, se o valor casa em uma delas */
		let x     = wd_vtype(input);
		let check = [x.type];
		/* deixando a lista toda em minúsculo */
		for (let i = 0; i < list.length; i++)
			list[i] = String(list[i]).toLowerCase();

		/* testando valores especiais */
		switch (x.type) {
			case "boolean":
				check.push(x.value === true ? "+boolean" : "-boolean")
				break;

			case "number":
				let abs = Math.abs(x.value);

				if (x.value > 0) check.push("+number");
				if (x.value < 0) check.push("-number");
				if (abs === 0) {
					check.push("zero");
				} else if (abs === Infinity) {
					check.push("infinity");
					check.push(x.value > 0 ? "+infinity" : "-infinity");
				} else if (abs === __integer(abs)) {
					check.push("integer");
					check.push(x.value > 0 ? "+integer" : "-integer");
				} else {
					check.push("float");
					check.push(x.value > 0 ? "+float" : "-float");
				}
				break;
			case "text":
				if (x.value === x.value.toUpperCase()) check.push("+text");
				if (x.value === x.value.toLowerCase()) check.push("-text");
				break;
			case "time":
				let now = wd_vtype(wd_str_now()).value;
				if (x.value > now) check.push("+time");
				if (x.value < now) check.push("-time");
				break;
			case "date":
				let today = wd_set_date();
				if (x.value > today) check.push("+date");
				if (x.value < today) check.push("-date");
				break;
		}

		/* testando as possibilidades válidas */
		for (let i = 0; i < check.length; i++)
			if (list.indexOf(check[i]) >= 0) return true;

		/* se não casou, retornar false */
		return false;
	}

/*----------------------------------------------------------------------------*/
	function wd_svg_create(type, attr) { /* cria elementos SVG genéricos com medidas relativas */
		if (attr === undefined) attr = {};
		/* Propriedades a serem definidas em porcentagem */
		let ref  = [
			"x", "y", "x1", "x2", "y1", "y2", "height", "width", "cx", "cy", "r", "dx", "dy"
		];

		let elem = document.createElementNS("http://www.w3.org/2000/svg", type);
		for (let i in attr) {/* definindo atributos */
			let val = attr[i];
			if (i === "tspan" || i === "title") {/* texto ou dicas */
				if (val !== null) {
					let info = wd_svg_create(i);
					info.textContent = val;
					elem.appendChild(info);
				}
			} else { /* atributos */
				if (ref.indexOf(i) >= 0 && __finite(val))
					val = new String(val).toString()+"%";
				elem.setAttribute(i, val);
			}
		}
		return elem;
	}

/*----------------------------------------------------------------------------*/
	function wd_svg_dots(cx, cy, r, title, color) { /* cria pontos: coordenada no centro */
	 	return wd_svg_create("circle", {
			cx: cx, cy: cy, r: r, fill: color, title: title
		});
	}

/*----------------------------------------------------------------------------*/
	function wd_svg_line(x1, y1, x2, y2, width, title, color) { /* cria linhas: coordenadas no início e fim */
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
		return wd_svg_create("rect", {
			x:       x2 > x1 ? x1 : x2,
			y:       y2 > y1 ? y1 : y2,
			width:   x2 > x1 ? x2-x1 : x1-x2,
			height:  y2 > y1 ? y2-y1 : y1-y2,
			fill:    color,
			title:   title,
			opacity: 0.9,
		});
	}

/*----------------------------------------------------------------------------*/
	function wd_svg_label(x, y, text, point, vertical, color, bold) {
		/* cria textos: coordenadas na âncora (point) */
		let vanchor = ["start", "middle", "end"];
		let vbase   = ["auto", "middle", "hanging"];
		let anchor  = {n: 1, ne: 2, e: 2, se: 2, s: 1, sw: 0, w: 0, nw: 0, c: 1};
		let base    = {n: 2, ne: 2, e: 1, se: 0, s: 0, sw: 0, w: 1, nw: 2, c: 1};
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

/* == BLOCO 2 ================================================================*/

/*----------------------------------------------------------------------------*/
	function WDform(elem) { /* objeto para analisar campos de formulários */
		this.e = elem;
	};
	Object.defineProperties(WDform.prototype, {
		vdate: { /* valida e formata campo de data, se vazio "", se inválido null */
			get: function() {
				if (this.e.value === "") return "";
				let check = wd_vtype(this.e.value);
				return check.type === "date" ? wd_date_iso(check.value) : null;
			}
		},
		vdatetime: { /* valida e formata campo de data e tempo, se vazio "", se inválido null */
			get: function() {
				if (this.e.value === "") return "";
				let date = wd_vtype(this.e.value.substr(0, 10));
				let time = wd_vtype(this.e.value.substr(11));
				let div  = this.e.value.substr(10, 1);
				if (!(/^[T ]$/i).test(div)) return null; /* dateTtime | date time */
				if (date.type === "date" && time.type === "time")
						return wd_date_iso(date.value)+"T"+wd_time_iso(time.value)
				return null
			}
		},
		vmonth: { /* valida e formata campo de mês, se vazio "", se inválido null*/
			get: function() {
				if (this.e.value === "") return "";
				let data = [
					{re: /^[0-9]{4}\-[0-9]{2}$/, m: {i: 5, e: 2}, y: {i: 0, e: 4}}, /* YYYY-MM */
					{re: /^[0-9]{2}\/[0-9]{4}$/, m: {i: 0, e: 2}, y: {i: 3, e: 4}}, /* MM/YYYY */
					{re: /^[0-9]{2}\.[0-9]{4}$/, m: {i: 0, e: 2}, y: {i: 3, e: 4}}  /* MM.YYYY */
				];
				for (let i = 0; i < data.length; i++) {
					if (!(data[i].re.test(this.e.value))) continue;
					let month = __integer(this.e.value.substr(data[i].m.i, data[i].m.e));
					let year  = __integer(this.e.value.substr(data[i].y.i, data[i].y.e));
					if (month >= 1 && month <= 12 && year >= 1)
						return wd_num_fixed(year, 0, 4)+"-"+wd_num_fixed(month, 0, 2);
				}
				return null;
			}
		},
		vweek: { /* valida e formata campo de semana, se vazio "", se inválido null */
			get: function() {
				if (this.e.value === "") return "";
				let data = [
					{re: /^[0-9]{4}\-W[0-9]{2}?$/i, w: {i: 6, e: 2}, y: {i: 0, e: 4}}, /* YYYY-Www */
					{re: /^[0-9]{2}\,\ [0-9]{4}$/,  w: {i: 0, e: 2}, y: {i: 4, e: 4}}, /* ww, YYYY */
				];
				for (let i = 0; i < data.length; i++) {
					if (!(data[i].re.test(this.e.value))) continue;
					let week = __integer(this.e.value.substr(data[i].w.i, data[i].w.e));
					let year = __integer(this.e.value.substr(data[i].y.i, data[i].y.e));
					if (week >= 1 && week <= 53 && year >= 1)
						return wd_num_fixed(year, 0, 4)+"-W"+wd_num_fixed(week, 0, 2);
				}
				return null;
			}
		},
		vtime: { /* valida e formata campo de tempo, se vazio "", se inválido null */
			get: function() {
				if (this.e.value === "") return "";
				let check = wd_vtype(this.e.value);
				return check.type === "time" ? wd_time_iso(check.value) : null;
			}
		},
		vnumber: { /* valida e formata campo numérico, se vazio "", se inválido null */
		get: function() {
				if (this.e.value === "") return "";
				let check = wd_vtype(this.e.value);
				return check.type === "number" ? this.e.value.trim() : null;
			}
		},
		vfile: { /* retorna valores do campo de arquivos */
			get: function() {
				if ("files" in this.e) return this.e.files;
				let val = this.e.value.trim();
				return val === "" ? [] : [{name: val}];
			}
		},
		vselect: { /* retorna a lista das opções selecionadas, se vazio não submeter, undefined */
			get: function() {
				let value = [];
				for (let i = 0; i < this.e.length; i++)
					if (this.e[i].selected)
						value.push(this.e[i].value.replace(/\,/g, "").trim());
				return value.length > 0 ? value : [];
			}
		},
		vcheck: { /* retorna o valor se checado, caso contrário não submeter, undefined */
			get: function() {
				return this.e.checked ? this.e.value : undefined;
			}
		},
		vemail: { /* retorna uma array de endereços de email, ou null se houver algum inválido*/
			get: function() {
				/* se vazio retornar lista vazia */
				let mail = this.e.value.trim().replace(/(\s+)?\,(\s+)?/g, ",");
				if (mail === "") return [];
				/* se navegador contempla email, retornar o que ele decidir */
				let list = mail.split(",");
				let attr = this.attr("type", true, false);
				if (attr.elem === "email") return list;
				/* caso contrário, verificar lista de email... */
				let re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
				for (let i = 0; i < list.length; i++)
					if (!re.test(list[i])) return null;
				return list;
			}
		},
		vurl: { /* retorna um url, ou null se inválido*/
			get: function() {
				let url = this.e.value.trim();
				if (url === "") return "";
				if (!("URL" in window)) return url;
				try {
					let check = new URL(url);
					return check.toString();
				} catch(e) {
					return null;
				}
				return null;
			}
		},
		attr: { /* obtem atributos do elemento e faz alterações especiais */
			value: function(attr, lower, std) {
				let value = {
					html: attr in this.e.attributes ? this.e.attributes[attr].value : null,
					elem: attr in this.e            ? this.e[attr] : null,
				};
				for (var i in value) {
					if (value[i] === null) continue;
					if (lower === true)
						value[i] = value[i].toLowerCase();
					if (std === true) {
						value[i] = wd_text_clear(value[i]);
						value[i] = wd_no_spaces(value[i].trim(), "_");
						if (!(/^[0-9a-zA-Z\_\-]+$/).test(value[i])) value[i] = null;
					}
				}
				return value;
			}
		},
		config: { /* agrupa e retorna as informações dos formulários */
			/*-------------------------------------------------------------------------
			| configuração do atributo data (se ausente, não aceita mecanismo)
			| send:  informa se o elemento pode submeter (true/false)
			| load:  nome do atributo a receber HTML ou null
			| mask:  nome do atributo a receber máscara ou null
			| text:  nome do atributo a receber conteúdo de texto ou null
			| value: nome da função validadora, null se não possui função
			\-------------------------------------------------------------------------*/
			value: function(type) {
				let T = true;
				let F = false;
				let N = null;
				let t = "textContent";
				let v = "value";
				let i = "innerHTML";

				let data = {}
				data.meter    = {types: N, send: F, load: N, mask: N, text: N, value: N};
				data.progress = {types: N, send: F, load: N, mask: N, text: N, value: N};
				data.output   = {types: N, send: F, load: N, mask: N, text: N, value: N};
				data.option   = {types: N, send: F, load: N, mask: t, text: t, value: N};
				data.form     = {types: N, send: F, load: i, mask: N, text: N, value: N};
				data.textarea = {types: N, send: T, load: v, mask: v, text: v, value: N};
				data.select   = {types: N, send: T, load: i, mask: N, text: N, value: "vselect"};

				data.button         = {types: T};
				data.button.button  = {send: F, load: N, mask: t, text: t, value: N};
				data.button.reset   = {send: F, load: N, mask: t, text: t, value: N};
				data.button.submit  = {send: F, load: N, mask: t, text: t, value: N};
				data.input          = {types: T};
				data.input.button   = {send: F, load: N, mask: v, text:v, value: N};
				data.input.reset    = {send: F, load: N, mask: v, text:v, value: N};
				data.input.submit   = {send: F, load: N, mask: v, text:v, value: N};
				data.input.image    = {send: F, load: N, mask: N, text:N, value: N};
				data.input.color    = {send: T, load: N, mask: N, text:v, value: N};
				data.input.radio    = {send: T, load: N, mask: N, text:N, value: "vcheck"};
				data.input.checkbox = {send: T, load: N, mask: N, text:N, value: "vcheck"};
				data.input.date     = {send: T, load: N, mask: v, text:v, value: "vdate"};
				data.input.datetime = {send: T, load: N, mask: v, text:v, value: "vdatetime"};
				data.input.month    = {send: T, load: N, mask: v, text:v, value: "vmonth"};
				data.input.week     = {send: T, load: N, mask: v, text:v, value: "vweek"};
				data.input.time     = {send: T, load: N, mask: v, text:v, value: "vtime"};
				data.input.range    = {send: T, load: N, mask: N, text:v, value: "vnumber"};
				data.input.number   = {send: T, load: N, mask: v, text:v, value: "vnumber"};
				data.input.file     = {send: T, load: N, mask: N, text:N, value: "vfile"};
				data.input.url      = {send: T, load: N, mask: v, text:v, value: "vurl"};
				data.input.email    = {send: T, load: N, mask: v, text:v, value: "vemail"};
				data.input.tel      = {send: T, load: N, mask: v, text:v, value: N};
				data.input.text     = {send: T, load: N, mask: v, text:v, value: N};
				data.input.search   = {send: T, load: N, mask: v, text:v, value: N};
				data.input.password = {send: T, load: N, mask: N, text:N, value: N};
				data.input.hidden   = {send: T, load: N, mask: N, text:v, value: N};
				data.input["datetime-local"] = {send: T, load: N, mask: v, text:v, value: "vdatetime"};

				if (!(this.tag in data)) return null;
				let config = data[this.tag];
				if (type === undefined || type === null || config.types === null) return config;
				return type in config ? config[type] : null;
			}
		},
		tag: { /* retorna a tag do elemento (minúsculo) */
			get: function () {return wd_html_tag(this.e);}
		},
		form: { /* informar se é um formulário (boolean) */
			get: function() {return this.config() !== null ? true : false;}
		},
		type: { /* retorna o tipo do formulário ou null, se não estiver definido */
			get: function() {
				if (!this.form) return null;
				let config = this.config();
				if (config.types === null) return this.tag;
				let attr = this.attr("type", true, false);
				if (this.config(attr.html) !== null) return attr.html;
				if (this.config(attr.elem) !== null) return attr.elem;
				return null;
			}
		},
		name: { /* retorna o valor do formulário name, id ou null (se não for informado nenhum) */
			get: function() {
				if (!this.form) return null;
				let name = this.attr("name", false, true);
				let id   = this.attr("id", false, true);
				return name.elem !== null ? name.elem : id.elem;
			}
		},
		value: { /* retorna o valor do atributo value, null (se erro), undefined (não enviar) */
			get: function() {
				if (!this.form) return undefined;
				let config = this.config(this.type);
				if (config === null) return undefined;
				return config.value === null ? this.e.value : this[config.value];
			}
		},
		selfMasked: { /* informa se é um campo especial implementado pelo navegador */
			get: function() {
				let atypes = [
					"date", "time", "week", "month", "datetime", "datetime-local",
					"number", "range", "url", "email"
				];
				let type = this.type;
				if (atypes.indexOf(type) < 0) return false;
				let attr = this.attr("type", true, false);
				if (attr.elem === "text") return false;
				return true;
			}
		},
		getConfig: { /* obtem informações sobre a configuração do elemento */
			value: function(attr) {
				return this.form ? this.config(this.type)[attr] : null;
			}
		},
		send: { /* informa se o campo pode ser submetido (true/false) ou null se não contemplado*/
			get: function() {return this.getConfig("send");}
		},
		mask: { /* retorna o atributo que definirá a máscara ou null, se não contemplado */
			get: function() {return this.getConfig("mask");}
		},
		text: { /* retorna o atributo que definirá o campo de texto ou null, se não contemplado */
			get: function() {return this.getConfig("text");}
		},
		load: { /* retorna o atributo que definirá o carregamento HTML ou null, se não contemplado */
			get: function() {return this.getConfig("load");}
		},
		data: { /* retorna um objeto com dados a submeter (GET e POST), vazio se não submeter, null se inválido */
			get: function() {
				let data  = {};
				let value = this.value;
				let name  = this.name;
				let type  = this.type;
				if (value === null)      return null; /* valor inválido, acusar erro */
				if (this.send !== true)  return data; /* campos que não podem submeter, não considerar inválidos */
				if (value === undefined) return data; /* campos válidos mas sem valor a submeter */
				if (name  === null)      return data; /* campos sem name, não considerar inválidos mas não submeter */

				if (type === "select" || type === "email") {
					data[name] = {
						GET: encodeURIComponent(value.join(",")),
						POST: value.join(",")
					}
					return data;
				}
				if (type === "file") {
					data[name] = { /* quantidade de arquivos */
						GET: encodeURIComponent(value.length),
						POST: value.length
					};
					for (let i = 0; i < value.length; i++) {
						let get  = {};
						let info = ["name", "type", "size", "lastModified"];
						for (let j = 0; j < info.length; j++)
							if (info[j] in value[i]) get[info[j]] = value[i][info[j]];
						data[name+"_"+i] = { /* arquivos individuais */
							GET:  encodeURIComponent(wd_json(get)),
							POST: value[i]
						};
					}
					return data;
				}
				data[name] = {
					GET: encodeURIComponent(value.trim()),
					POST: value.trim()
				}
				return data;
			}
		},
		msgErrorValue: {
			value: {
				month: "2010-11 | 11/2010 | 11.2010",
				time: "3:45 | 22:45:50 | 10:45 am | 1:45pm",
				week: "2010-W05 | 05, 2010",
				number: "[0-9]+ | .[0-9]+ | [0-9]+.[0-9]+",
				date: "2010-11-23 | 23/11/2010 | 11.23.2010",
				datetime: "2010-11-23T22:45 | 23/11/2010 22:45:50 | 11.23.2010 10:45 pm",
				"datetime-local": "2010-11-23T22:45 | 23/11/2010 22:45:50 | 11.23.2010 10:45 pm",
				email: "email@mail.com",
				url: "http://address.com",
			}
		},
		validity: { /* registro de validade do campo de formulário */
			set: function(msg) { /* define a mensagem de erro do formulário */
				/* apagar a mensagem de erro alternativa, se existir */
				if ("wdErrorMessage" in this.e.dataset)
					delete this.e.dataset.wdErrorMessage;
				/* definindo mensagem de erro, se existente, para aguardar envio */
				if ("setCustomValidity" in this.e)
					this.e.setCustomValidity(msg === null ?  "" : msg);
				else if (msg !== null)
					this.e.dataset.wdErrorMessage = msg;
				return;
			},
			get: function() { /* informar se o campo do formulário é válido (true/false) */
				/* apagar todas mensagens de erro para checagem */
				this.validity = null;
				/* 1º se não for formulário, retornar como válido */
				if (!this.form) return true;
				/* 2º checar validade padrão, se existente */
				if ("checkValidity" in this.e && this.e.checkValidity() === false)
					return false;
				/* 3º sem validade padrão, verificar se o campo é inválido */
				if (this.data === null) {
					let type = this.type;
					this.validity = type in this.msgErrorValue ? this.msgErrorValue[type] : "?";
					return false;
				}
				/* 4º verificar se a máscara está errada (mask) */
				if ("wdErrorMessageMask" in this.e.dataset) {
					this.validity = this.e.dataset.wdErrorMessageMask;
					return false;
				}
				/* 5º verificar se a checagem personalizada (vform) é inválida */
				if ("wdErrorMessageVform" in this.e.dataset) {
					this.validity = this.e.dataset.wdErrorMessageVform;
					return false;
				}
				return true;
			}
		},
		checkValidity: {
			value: function() {
				return this.validity;
			}
		},
		submit: { /* avaliar e reportar erro do formulário (se for o caso), returna true/false */
			value: function() {
				/* aplicando ferramentas da biblioteca para checagem */
				data_wdMask(this.e);
				data_wdVform(this.e);
				/* checar se o formulário é válido */
				if (this.validity) return true;
				/* reportar mensagem e retornar */
				if ("reportValidity" in this.e) {
					this.e.reportValidity();
				} else if ("validationMessage" in this.e) {
					wd_signal_control.open(this.e.validationMessage, "");
					elem.focus();
				} else {
					wd_signal_control.open(this.e.dataset.wdErrorMessage, "");
					elem.focus();
				}
				/* bug firefox */
				if (this.type === "file") this.e.value = null;

				return false;
			}
		}
	});

/*----------------------------------------------------------------------------*/
	function WDchart(box, title) {/*Objeto para criar gráficos*/
		this.box   = box;   /* container gráfico */
		this.title = title; /* título do gráfico */
		this.data  = [];    /* dados de plotagem */
		this.color = 0;     /* cor de plotagem (não reiniciar no boot) */
	};

	Object.defineProperties(WDchart.prototype, {
		boot: {
			value: function () {
				this.svg    = null; /* gráfico (svg element) */
				this.xscale = 1; /* escala do eixo x */
				this.yscale = 1; /* escala do eixo y */
				this.xmin   = +Infinity; /* menor valor em x */
				this.xmax   = -Infinity; /* maior valor em x */
				this.ymin   = +Infinity; /* menor valor em y */
				this.ymax   = -Infinity; /* maior valor em y */
				this.padd   = {t: 0, r: 0, b: 0, l: 0}; /* espaço interno do gráfico (padding) */
				this.legend = 0; /* contador de legenda */
				this.box.className = ""; /* atributo class do container do gráfico */
				wd_html_style(this.box, null); /* limpando atributo style */
				this.box.style.backgroundColor = "#fafafa";
				this.box.style.paddingTop = wd_num_str(this.ratio, true); /* proporção do container em relação à tela */
				this.box.style.position   = "relative";
				let child = wd_vtype(this.box.children).value; /* filhos do container */
				for (let i = 0; i < child.length; i++) /* limpando filhos (deletando o gráfico) */
					this.box.removeChild(child[i]);
			}
		},
		ratio: {/* Relação altura/comprimento do gráfico (igual a da tela) */
			get: function() {
				let height = window.screen.height;
				let width  = window.screen.width;
				return height >= width ? 1 : height/width;
			}
		},
		space: { /* define e obtem os espaços do gráfico a partir do padding */
			set: function(x) {
				for (let i in x) this.padd[i] = x[i];
			},
			get: function() {
				let padd = this.padd;
				let msrs = {}; /* medidas em % */
				msrs.t  = padd.t;              /* topo do gŕafico (y) */
				msrs.r  = 100-padd.r;          /* direita do gŕafico (x) */
				msrs.b  = 100-padd.b;          /* base do gŕafico (y) */
				msrs.l  = padd.l;              /* esquerda do gráfico (x) */
				msrs.w  = 100-(padd.l+padd.r); /* comprimento do gráfico (x) */
				msrs.h  = 100-(padd.t+padd.b); /* altura do gráfico (x) */
				msrs.cx = padd.l+(msrs.w/2);   /* meio do gráfico (x) */
				msrs.cy = padd.t+(msrs.h/2);   /* meio do gráfico (y) */
				return msrs;
			}
		},
		rgb: { /* retorna uma cor a partir de um número */
			value: function(n) {
				if (n === 0) return "#000000";
				n--;
				let swap  = ["100", "001", "010", "101", "011", "110"];
				let index = n % swap.length;
				let power = __integer(n/6) + 1;
				let value = 255/power;
				let onoff = swap[index].split("");
				let color = [];
				for (let i = 0; i < onoff.length; i++)
					color.push(onoff[i] === "1" ? __integer(value) : 33);
				return "rgb("+color.join(",")+")";
			}
		},
		point: { /* Transforma coordanadas reais em relativas (%) */
			value: function(x, y) {
				if (!__finite(x) || !__finite(y)) return null;
				x = x - this.xmin;
				y = y - this.ymin;
				let msrs = this.space;
				return {
					x: msrs.l + x*this.xscale,
					y: msrs.b - y*this.yscale,
				};
			}
		},
		addLegend: { /* Adiciona Legendas (texto e funções)*/
			value: function(text, color, compare) {
				if (text === null) return;
				text = "\u25CF "+text;
				let ref = this.space;
				let y   = (ref.t + 1)+(4*this.legend);
				let x   = 1 + (compare === true ? ref.r : ref.l);
				this.svg.appendChild(wd_svg_label(
					x, y, text, "nw", false, color, false
				));
				return this.legend++;
			}
		},
		ends: { /* define os limites dos eixos */
			value: function(axis, array) {
				let axes = {
					x: {min: "xmin", max: "xmax"},
					y: {min: "ymin", max: "ymax"},
				};
				array = array.slice();
				array.push(this[axes[axis].min]);
				array.push(this[axes[axis].max]);
				let limits = wd_coord_limits(array);
				this[axes[axis].min] = limits.min;
				this[axes[axis].max] = limits.max;
			}
		},
		scale: {/* Define o valor da escala horizontal e vertical e retorna o menor fragmento do eixo (delta) */
			value: function(axis) {
				let width = this.space[axis === "x" ? "w" : "h"];
				let delta = this[axis+"max"] - this[axis+"min"];
				this[axis+"scale"] = width/delta;
				return 1/this[axis+"scale"];
			}
		},
		add: {/* Adiciona conjunto de dados para plotagem */
			value: function(x, y, label, type) {
				/*----------------------------------------------------------------------
				| A) se y for uma função, definir plotagem em linha
				| B) se o tipo for plotagem comparativa, defini-la
				| C) plotagem de x-y com valores numéricos
				|=======================================================================
				| atributos do objeto a ser adicionado ao array data:
				| x: array numérico ou indefindo (compare) em x,
				| y: array numérico ou função (!compare) em y,
				| l: identificação da plotagem (legenda),
				| t: tipo de plotagem,
				| f: booleano, informa se y é uma função,
				| c: valor numérico da cor, se existente
				\---------------------------------------------------------------------*/
				if (wd_vtype(y).type === "function") { /*A*/
					let data = wd_coord_adjust(x);
					if (data === null) return false;
					this.data.push(
						{x: data.x, y: y, l: label, t: "line", f: true, c: ++this.color}
					);
					return true;
				}
				if (type === "compare") { /*B*/
					let data = wd_coord_compare(x, y, true);
					if (data === null) return false;
					this.data.push(
						{x: data.x, y: data.amt, l: label, t: "compare", f: false, c: null}
					);
					return true;
				}
				let coord = wd_coord_adjust(x, y); /*C*/
				if (coord === null) return false;
				x = coord.x; /*C*/
				y = coord.y; /*C*/
				/* tipo de gráficos: cada tipo pode gerar até três conjuntos de dados */
				let ref = { /* tipo: {c1: tipo de plotagem 1, c2..., c3..., m: método */
					avg: {c1: "line", c2: "line", c3: null,   m: wd_coord_ravg},
					sum: {c1: "line", c2: "cols", c3: null,   m: wd_coord_rsum},
					exp: {c1: "dots", c2: "line", c3: "dash", m: wd_coord_rexp},
					lin: {c1: "dots", c2: "line", c3: "dash", m: wd_coord_rlin},
					geo: {c1: "dots", c2: "line", c3: "dash", m: wd_coord_rgeo},
				};
				if (type in ref) { /* checando escolha de tipo de gráfico específico */
					let data = ref[type].m(x, y); /* executando o método */
					if (data === null) return false;
					this.data.push( /* conjunto de dados da plotagem 1 */
						{x: x, y: y, l: label, t: ref[type].c1, f: false, c: ++this.color}
					);
					this.data.push( /* conjunto de dados da plotagem 2 (função) */
						{x: x, y: data.f, l: data.m, t: ref[type].c2, f: true, c: ++this.color}
					);
					if (data.d !== 0) { /* conjunto de dados da plotagem 3 (função), se desvio padrão != 0 */
						let sup = function(n) {return data.f(n)+data.d;} /* desvio superior */
						let sub = function(n) {return data.f(n)-data.d;} /* desvio inferior */
						this.data.push( /* desvio superior */
							{x: x, y: sup, l: null, t: ref[type].c3, f: true, c: this.color}
						);
						this.data.push( /* desvio inferior */
							{x: x, y: sub, l: null, t: ref[type].c3, f: true, c: this.color}
						);
					}
					return true;
				}
				/* plotagem x-y numérica genérica (linhas e pontos) */
				this.data.push(
					{x: x, y: y, l: label, t: "line", f: false, c: ++this.color}
				);
				this.data.push(
					{x: x, y: y, l: null, t: "dots", f: false, c: this.color}
				);
				return true;
			}
		},
		pdata: { /* prepara os dados da plotagem (plano x-y) */
			get: function() {
				let array = [];
				/*----------------------------------------------------------------------
				| A) looping: filtrando tipo de solicitação e adicionando-os a lista
				| B) ignorando o tipo compare
				| C) (pré-)definindo limites superiores e inferiores de x e y (!= função)
				\---------------------------------------------------------------------*/
				for (let i = 0; i < this.data.length; i++) { /*A*/
					let data = this.data[i];
					if (data.t === "compare") continue; /*B*/
					this.ends("x", data.x); /*C*/
					if (data.t === "cols") this.ends("y", [0]); /* se for coluna tem que mostrar a linha 0 */
					if (data.f !== true) this.ends("y", data.y); /*C*/
					array.push(data); /*A*/
				}
				/*----------------------------------------------------------------------
				| D) definindo espaços (padding) entre o container e o gráfico
				| E) definindo e obtendo a escala em x (valor real X disponível)
				\---------------------------------------------------------------------*/
				this.space = {t: 10, r: 5, b: 15, l: 15}; /*D*/
				let delta  = this.scale("x"); /*E*/
				/*----------------------------------------------------------------------
				| F) looping: transformando eixo y de função para array numérico
				| G) definindo novas listas para x e y após transformação em F
				| H) definindo limites superiores e inferiores em y
				| I) definindo escala em y e retornando dados
				\---------------------------------------------------------------------*/
				for (let i = 0; i < array.length; i++) { /*F*/
					let data = array[i];
					if (data.f !== true) continue;
					let values = wd_coord_continuous( /*F*/
						data.x, data.y, data.t === "cols" ? 0.01 : delta /* para sum (cols) o delta deve ser menor */
					);
					if (values === null) continue;
					array[i].x = values.x; /*G*/
					array[i].y = values.y; /*G*/
					this.ends("y", values.y); /*H*/
				}
				this.scale("y"); /*I*/
				return array;
			}
		},
		cdata: { /* prepara dados de plotagem para "compare" */
			get: function() {
				/*----------------------------------------------------------------------
				| A) lista especial para agrupar informações para posterior tratamento
				| B) looping: filtrando tipo de solicitação e adicionando-os a lista
				| C) ignorando o tipo diferente de compare
				| D) adicionando informações à nova lista especial
				\---------------------------------------------------------------------*/
				let group = {x: [], y: []};
				for (let i = 0; i < this.data.length; i++) { /*B*/
					let data = this.data[i];
					if (data.t !== "compare") continue; /*C*/
					for (let j = 0; j < data.x.length; j++) { /*D*/
						group.x.push(data.x[j]);
						group.y.push(data.y[j]);
					}
				}
				/*----------------------------------------------------------------------
				| E) se não tiver dados, retornar vazio
				| F) transformando os dados
				| H) definindo limites
				| I) contribuindo um nova lista de dados para plotagem
				| G) definindo espaços e escala;
				\---------------------------------------------------------------------*/
				if (group.x.length === 0) return []; /*E*/
				let compare = wd_coord_compare(group.x, group.y, true); /*F*/
				this.ends("y", compare.amt); /*H*/
				this.ends("x", [0, compare.x.length]); /*H*/
				this.ends("y", [0]);  /*H (tem que mostrar a linha y = 0) */
				let array = []; /*I*/
				for (let i = 0; i < compare.x.length; i++) /*I*/
					array.push({
						x: [i, i+1], y: [compare.amt[i], compare.amt[i]],
						l: compare.x[i]+" ("+wd_num_str(compare.per[i], true)+")",
						t: "cols", f: false, c: i+1,
					});
				this.space = {t: 10, r: 20, b: 10, l: 15}; /*G*/
				this.scale("x"); /*G*/
				this.scale("y"); /*G*/
				return array;
			}
		},
		area: { /* prepara os dados da plotagem (plano x,y) */
			value: function(xlabel, ylabel, n, compare) {
				compare = compare === true ? true : false;
				/*----------------------------------------------------------------------
				| A) criando e definindo o SVG principal
				| B) obtendo as medidas referenciais da plotagem (ref)
				| C) obtendo a cor padrão (clr)
				| D) obtendo as menores unidades de x e y (dx, dy)
				| E) obtendo as menores unidades de x e y (dx, dy) e
				| F) contruindo eixos, labels e valores
				\---------------------------------------------------------------------*/
				this.svg = wd_svg_create("svg", {}); /*A*/
				this.svg.setAttribute("class", "js-wd-plot"); /*A*/
				let ref = this.space; /*B*/
				let clr = this.rgb(0); /*C*/
				let dx  = ref.w/n; /*D*/
				let dy  = ref.h/n; /*D*/
				let vx  = (this.xmax - this.xmin)/n; /*E*/
				let vy  = (this.ymax - this.ymin)/n; /*E*/

				for (let i = 0; i < (n+1); i++) { /*F*/
					let x1, y1, x2, y2, ax, ay, x, y, dash;
					/* estilo das linhas (externa contínua, interna tracejada) */
					dash = (i === 0 || i === n) ? 1 : 0;
					/* valores dos eixos (ancoras e valores) */
					ax = i === 0 ? "nw" : (i === n ? "ne" : "n");
					ay = i === 0 ? "ne" : (i === n ? "se" : "e");
					x = this.xmin + i*vx; /* da esquerda para direita */
					y = this.ymax - i*vy; /* de cima para baixo */
					/* coordenadas dos eixos verticais */
					x1 = ref.l+i*dx;
					x2 = x1;
					y1 = ref.t;
					y2 = y1+ref.h;
					this.svg.appendChild(wd_svg_line(x1, y1, x2, y2, dash, null, clr));
					/* valores eixo vertical */
					this.svg.appendChild(wd_svg_label(
						ref.l - 1, y1 + i*dy, wd_num_str(y), ay, false, clr, false
					));

					/* coordenadas dos eixos horizontais */
					x1 = ref.l;
					x2 = x1+ref.w;
					y1 = ref.t+ref.h-i*dy;
					y2 = y1;
					this.svg.appendChild(wd_svg_line(x1, y1, x2, y2, dash, null, clr));
					/* valores eixo horizontal */
					if (!compare)
						this.svg.appendChild(wd_svg_label(
							x1 + i*dx, ref.b + 1, wd_num_str(x), ax, false, clr, false
						));
				}
				/* Título e labels */
				this.svg.appendChild( /* título do gŕafico (centrado no gráfico) */
					wd_svg_label(ref.l+ref.w/2, ref.t/2, this.title, "s", false, clr, true)
				);
				this.svg.appendChild( /* nome do eixo x (horizontal, inferior e centrado no gráfico) */
					wd_svg_label(ref.cx, (ref.b+100)/2, xlabel, "n", false, clr, false)
				);
				this.svg.appendChild( /* nome do eixo x (vertical, esquerda e centrado no gráfico) */
					wd_svg_label(-this.ratio*ref.cy, ref.l/4, ylabel, "n", true, clr, false)
				);
			}
		},
		plot: { /* executa gráfico */
			value: function(xlabel, ylabel, compare) {
				/*----------------------------------------------------------------------
				| A) preparando (reset) valores do objeto
				| B) obtendo dados da plotagem especificada (plano ou comparação)
				| C) definindo área do gráfico (B deve vir primeiro)
				| D) lopping: conjunto de dados
				| E) looping: array de valores
				\---------------------------------------------------------------------*/
				this.boot(); /*A*/
				let data = compare === true ? this.cdata : this.pdata; /*B*/
				if (data.length === 0) return false;
				this.area(xlabel, ylabel, (compare === true ? data.length : 4), compare); /*C*/

				for (let i = 0; i < data.length; i++) { /*D*/
					let item = data[i];
					let clr  = this.rgb(item.c);
					let leg  = item.l;
					this.addLegend(leg, clr, compare);

					for (let j = 0; j < item.x.length; j++) { /*E*/
						let last, xy1, xy2, frag, zero;
						last = j === (item.x.length - 1) ? true : false;
						frag = null;
						xy1  = this.point(item.x[j], item.y[j]);
						xy2  = !last ? this.point(item.x[j+1], item.y[j+1]) : null;
						zero = this.point(0, 0);

						if (item.t === "dots")
							frag = wd_svg_dots(xy1.x, xy1.y, 0.5, leg, clr);
						else if (item.t === "line" && !last)
							frag = wd_svg_line(xy1.x, xy1.y, xy2.x, xy2.y, 2, leg, clr);
						else if (item.t === "dash" && !last)
							frag = wd_svg_line(xy1.x, xy1.y, xy2.x, xy2.y, 0, leg, clr);
						else if (item.t === "cols" && !last)
							frag = wd_svg_rect(xy1.x, zero.y, xy2.x, xy2.y, leg, clr);
						if (frag !== null) this.svg.appendChild(frag);
					}
				}
				this.box.appendChild(this.svg);
				return true;
			}
		},
	});

/* == BLOCO 3 ================================================================*/

/*----------------------------------------------------------------------------*/
	function WDmain(input) {
		Object.defineProperties(this, {
			_value: {value: input.value, writable: true},
			_type:  {value: input.type},
			_input: {value: input.input}
		});
	}

	Object.defineProperties(WDmain.prototype, {
		constructor: {value: WDmain},
		type: { /* informa o tipo do argumento */
			get: function() {return this._type;}
		},
		test: { /* testa se o tipo do valor se enquadra em alguma categoria */
			value: function() {
				return wd_test(this._input, Array.prototype.slice.call(arguments));
			}
		},
		valueOf: { /* método padrão */
			value: function() {
				try {return this._value.valueOf();} catch(e) {}
				return new Number(this._value).valueOf();
			}
		},
		toString: { /* método padrão */
			value: function() {
				try {return this._value.toString();} catch(e) {}
				return new String(this._value).toString();
			}
		},
		send: { /* Efetua requisições */
			value: function (action, callback, method, async) {
				if (wd_vtype(method).type !== "text") method = "POST";

				/* obtendo pacote de dados */
				let pack;
				if (this.type === "dom") {
					pack = this.form(method.toUpperCase() === "GET" ? true: false);
					if (pack === null) return false;
				} else {
					let value = this.type === "number" ? this.valueOf() : this.toString();
					if ("FormData" in window && method.toUpperCase() === "POST") {
						pack = new FormData();
						pack.append("value", value);
					} else {
						pack = "value="+value;
					}
				}

				return wd_request(action, pack, callback, method, async);
			}
		},
		signal: { /*renderizar mensagem*/
			value: function(title) {
				wd_signal_control.open(this.toString(), title);
				return this.type === "dom" ? this : null;
			}
		},
		notify: { /*renderizar notificação*/
			value: function(title) {
				wd_notify(title, this.toString());
				return this.type === "dom" ? this : null;
			}
		},
		finite: { /* informa se é um número finito */
			get: function() {return __finite(this._value);}
		}
	});

/*----------------------------------------------------------------------------*/
	function WDundefined(input) {WDmain.call(this, input);}

	WDundefined.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDundefined},
		valueOf:     {value: function() {return Infinity;}},
		toString:    {value: function() {return "?";}}
	});

/*----------------------------------------------------------------------------*/
	function WDnull(input) {WDmain.call(this, input);}

	WDnull.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnull},
		valueOf:     {value: function() {return 0;}},
		toString:    {value: function() {return "";}}
	});

/*----------------------------------------------------------------------------*/
	function WDboolean(input) {WDmain.call(this, input);}

	WDboolean.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDboolean},
		valueOf:     {value: function() {return this._value ? 1 : 0;}},
		toString:    {value: function() {return this._value ? "True" : "False";}}
	});

/*----------------------------------------------------------------------------*/
	function WDfunction(input) {WDmain.call(this, input);}

	WDfunction.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDfunction},
	});

/*----------------------------------------------------------------------------*/
	function WDobject(input) {WDmain.call(this, input);}

	WDobject.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDobject},
		toString:    {value: function() {return wd_json(this._value);}}
	});

/*----------------------------------------------------------------------------*/
	function WDregexp(input) {WDmain.call(this, input);}

	WDregexp.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDregexp},
		toString:    {value: function() {return this._value.source;}}
	});

/*----------------------------------------------------------------------------*/
	function WDtext(input) {WDmain.call(this, input);}

	WDtext.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDtext},
		upper: { /* retorna valor em caixa alta */
			get: function() {return this.toString().toUpperCase();}
		},
		lower: { /* retorna valor em caixa baixa */
			get: function() {return this.toString().toLowerCase();}
		},
		caps: { /* retorna valor capitulado */
			get: function() {return __caseCapitalize(this.toString());}
		},
		tgl: { /* inverte caixa */
			get: function() {return __caseToggle(this.toString());}
		},
		clear: { /* remove acentos da string */
			get: function() {return wd_text_clear(this.toString());}
		},
		camel: { /* transforma string para inicioMeioFim */
			get: function() {return __strCamel(this.toString());}
		},
		dash: { /* transforma string para inicio-meio-fim */
			get: function() {return __String(this.toString()).dash;}
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
				return wd_multiple_masks(this.toString(), check, callback);
			}
		},
		format: { /*aplica atributos múltiplos*/
			value: function() {
				return wd_apply_getters(this, Array.prototype.slice.call(arguments));
			}
		},

	});

/*----------------------------------------------------------------------------*/
	function WDnumber(input) {WDmain.call(this, input);}

	WDnumber.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnumber},
		int: { /* retorna a parte inteira */
			get: function() {return __integer(this.valueOf());}
		},
		dec: { /* retorna a parte decimal */
			get: function() {return __decimal(this.valueOf());}
		},
		abs: { /* retorna a parte decimal */
			get: function() {return Math.abs(this.valueOf());}
		},
		ntype: { /* retorna o tipo de número */
			get: function() {return __number(this.valueOf());}
		},
		frac: { /* representação em fração (2 casas) */
			get: function () {return __frac(this.valueOf());}
		},
		byte: { /* retorna notação para bytes */
			get: function () {return __bytes(this.valueOf());}
		},
		str: { /* retorna string simplificada do número */
			get: function() {return wd_num_str(this.valueOf());}
		},
		round: { /* arredonda número para determinado tamanho */
			value: function(width) {
				return __cut(this.valueOf(), width);
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
				return Math.abs(this.valueOf()) === Infinity ? this.str : this.valueOf().toString();
			}
		},
	});

/*----------------------------------------------------------------------------*/
	function WDtime(input) {WDmain.call(this, input);}

	WDtime.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDtime},
		h: { /* define/obtem a hora */
			get: function() {return wd_number_time(this.valueOf()).h;},
			set: function(x) {
				if (__finite(x))
					this._value = wd_time_number(__integer(x), this.m, this.s);
			}
		},
		hour: {
			get: function()  {return this.h;},
			set: function(x) {return this.h = x;}
		},
		m: { /* define/obtem o minuto */
			get: function() {return wd_number_time(this.valueOf()).m;},
			set: function(x) {
				if (__finite(x))
					this._value = wd_time_number(this.h, __integer(x), this.s);
			}
		},
		minute: {
			get: function()  {return this.m;},
			set: function(x) {return this.m = x;}
		},
		s: { /* define/obtem o segundo */
			get: function() {return wd_number_time(this.valueOf()).s;},
			set: function(x) {
				if (__finite(x))
					this._value = wd_time_number(this.h, this.m, __integer(x));
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
	function WDdate(input) {WDmain.call(this, input);}

	WDdate.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDdate},
		y: { /* ano */
			get: function() {return this._value.getFullYear();},
			set: function(x) {
				if (__finite(x) && x >= 0)
					this._value = wd_set_date(this._value, undefined, undefined, __integer(x));
			}
		},
		m: { /* mês */
			get: function() {return this._value.getMonth() + 1;},
			set: function(x) {
				if (__finite(x))
					this._value = wd_set_date(this._value, undefined, __integer(x), undefined);
			}
		},
		d: { /* dia */
			get: function() {return this._value.getDate();},
			set: function(x) {
				if (__finite(x))
					this._value = wd_set_date(this._value, __integer(x), undefined, undefined);
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
			get: function() {return wd_date_week(this.days, this.today);}
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
				return (this._value < 0 ? -1 : 0) + __integer(this._value/86400000);
			}
		},
	});

/*----------------------------------------------------------------------------*/
	function WDarray(input) {WDmain.call(this, input);}

	WDarray.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDarray},
		unique: { /* remove itens repetidos */
			get: function() {return wd_array_unique(this.valueOf());}
		},
		sort: { /* ordena items */
			get: function() {return wd_array_sort(this.valueOf());}
		},
		tidy: { /* remove itens repetidos e ordena */
			get: function() {return wd_array_sort(this.unique);}
		},
		csv: { /* matriz para csv */
			get: function() {return wd_array_csv(this.valueOf());}
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
		data: { /* obtem dados estatísticos a partir dos itens de uma matriz */
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
	function WDdom(input) {WDmain.call(this, input);}

	WDdom.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDdom},
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
		style: { /* define ou remove estilo ao elemento */
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
			value: function(text, overlap) {
				return this.run(wd_html_load, text, overlap);
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
		jump: { /* salta elementos entre seus pais (argumentos) */
			value: function(list) {
				return this.run(wd_html_jump, list);
			}
		},
		full: { /* deixa o elemento em tela cheia (só primeiro elemento) */
			value: function(exit) {
				wd_html_full(this._value[0], exit); return this;
			}
		},
		form: { /* obtém serialização de formulário */
			value: function(get) {
				return wd_html_dform(this._value, get);
			}
		},
		vstyle: { /* devolve o valor do estilo especificado (só primeiro elemento) */
			value: function(css) {
				return wd_html_style_get(this._value[0], css);
			}
		},
		chart: { /* desenha gráfico de linhas e colunas */
			value: function(data, title, xlabel, ylabel) {
				return wd_html_chart(this.item(0), data, title, xlabel, ylabel);
			}
		},
		read: { /* lê arquivos especificados em formulário (input:file) */
			value: function(call, mode) {
				return this.run(wd_read, call, mode);
			}
		},
		info: { /* devolve informações diversas sobre o primeiro elemento */
			get: function() {return wd_html_info(this._value[0]);}
		},
		vform: { /* checa a validade dos dados do formulário */
			get: function() {return wd_html_vform(this._value);}
		},
	});

/*----------------------------------------------------------------------------*/
	function WD(input) { /* função de interface ao usuário */
		/* obtendo o tipo e o valor resultando da entrada */
		let vtype  = wd_vtype(input);
		/* acrescentando o valor original aos dados */
		vtype["input"] = input;
		/* lista de objetos a serem chamados */
		let object = {
			"undefined": WDundefined, "null":     WDnull,
			"boolean":   WDboolean,   "function": WDfunction,
			"object":    WDobject,    "regexp":   WDregexp,
			"array":     WDarray,     "dom":      WDdom,
			"time":      WDtime,      "date":     WDdate,
			"number":    WDnumber,    "text":     WDtext,
			"unknown":   WDmain
		};
		/* construindo e retornando o objeto específico */
		return new object[vtype.type](vtype);
	}

	WD.constructor = WD;
	Object.defineProperties(WD, {
		version: {value: wd_version},
		$:       {value: function(css, root) {return WD(__$(css, root));}},
		$$:      {value: function(css, root) {return WD(__$$(css, root));}},
		url:     {value: function(name) {return wd_url(name);}},
		copy:    {value: function(text) {return wd_copy(text);}},
		lang:    {get:   function() {return wd_lang();}},
		device:  {get:   function() {return __device();}},
		today:   {get:   function() {return WD(new Date());}},
		now:     {get:   function() {return WD(wd_str_now());}},
		type:    {value: function(x){return __Type(x);}},

		array: {value: function(){return __Array.apply(null, Array.prototype.slice.call(arguments));}},
		node: {value: function(){return __Node.apply(null, Array.prototype.slice.call(arguments));}},
		number: {value: function(){return __Number.apply(null, Array.prototype.slice.call(arguments));}},
		string: {value: function(){return __String.apply(null, Array.prototype.slice.call(arguments));}},
		arr: {value: function(){return __setHarm.apply(null, Array.prototype.slice.call(arguments));}},
		fit: {value: function(){return __Fit2D.apply(null, Array.prototype.slice.call(arguments));}},
		plot: {value: function(){return __Plot2D.apply(null, Array.prototype.slice.call(arguments));}},
		test: {value: function(){return __setUnique.apply(null, Array.prototype.slice.call(arguments));}},
	});

/* == BLOCO 4 ================================================================*/

/*----------------------------------------------------------------------------*/
	function data_wdLoad(e) { /* carrega HTML: data-wd-load=path{file}method{get|post}${form}overlap{} */
		if (!("wdLoad" in e.dataset)) return;

		/* obter dados do atributo */
		let data    = wd_html_dataset_value(e, "wdLoad")[0];
		let target  = WD(e);
		let method  = data.method;
		let file    = data.path;
		let pack    = __$$$(data);
		let exec    = WD(pack);
		let overlap = data.overlap === "true" ? true : false;

		/* abrir contagem */
		wd_counter_control.load++;
		/* limpar atributo para evitar repetições desnecessárias e limpar conteúdo */
		target.data({wdLoad: null}).load("");
		/* carregar arquivo e executar */
		exec.send(file, function(x) {
			if (x.closed) {
				/* encerrar contagem */
				wd_counter_control.load--;
				/* executar */
				target.load(x.text, overlap);
				return;
			}
		}, method);
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdRepeat(e) { /* Repete modelo HTML: data-wd-repeat=path{file}method{get|post}${form} */
		if (!("wdRepeat" in e.dataset)) return;

		/* obter dados do atributo */
		let data   = wd_html_dataset_value(e, "wdRepeat")[0];
		let target = WD(e);
		let method = data.method;
		let file   = data.path;
		let pack   = __$$$(data);
		let exec   = WD(pack);

		/* abrir contagem */
		wd_counter_control.repeat++;
		/* limpar atributo para evitar repetições desnecessárias e limpar conteúdo */
		target.data({wdRepeat: null}).repeat([]);

		/* carregar arquivo e executar */
		exec.send(file, function(x) {
			if (x.closed) {
				let json = x.json;
				let csv  = x.csv;
				/* fechar contagem */
				wd_counter_control.repeat--;

				/* repetir na ordem de prioridade: JSON | CSV | VAZIO */
				if (wd_vtype(json).type === "array")
					target.repeat(json);
				else if (wd_vtype(csv).type === "array")
					target.repeat(wd_matrix_object(x.csv));
				else
					target.repeat([]);
				return;
			}
		}, method);
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdChart(e) { /* define um gráfico data-wd-chart="..." */
		/*--------------------------------------------------------------------------
		| tabela:  ${table}cols{x,y1:type1,y2:type2...}labels{title,x,y}
		| arquivo: path{file}method{...}${form}cols{x,y1:type1,y2:type2...}labels{title,x,y}
		\-------------------------------------------------------------------------*/
		if (!("wdChart" in e.dataset)) return;

		/*Função para  capturar dados da plotagem */
		let buildChart = function(input) {
			let cell = WD(input.matrix);
			if (cell.type !== "array") return;
			/* obtendo os valores da matriz */
			for (let i = 0; i < input.data.length; i++) {
				input.data[i].x     = cell.cell(input.data[i].x);
				input.data[i].y     = cell.cell(input.data[i].y);
				input.data[i].label = cell.cell(input.data[i].label)[0];
			}
			return WD(input.elem).chart(input.data, input.title, input.xlabel, input.ylabel);
		}
		/* obtendo informações sobre a fonte de dados */
		let data   = wd_html_dataset_value(e, "wdChart")[0];
		let target = WD(e);
		let source = "path" in data ? "file" : "table";
		/* obtendo dados das plotagens (por referência xref, yref, lref) */
		let labels = "labels" in data ? data.labels.split(",") : ["Title", "X axis", "Y axis"];
		let cols   = "cols"   in data ? data.cols.split(",")   : [0, 1];
		let input  = {
			elem:   e,
			title:  labels[0],
			xlabel: labels[1],
			ylabel: labels[2],
			data:   [],
			matrix: null,
		};
		let xref   = "1-:"+cols[0].replace(/[^0-9]/g, "");
		for (let i = 1; i < cols.length; i++) { /* looping começa a partir de 1 (colunas em y) */
			let info = cols[i].split(":");
			let yref = "1-:"+info[0].replace(/[^0-9]/g, "");
			let lref = "0:"+info[0].replace(/[^0-9]/g, "");
			let type = info.length === 2 ? info[1].trim() : null;
			input.data.push({x: xref, y: yref, label: lref, type: type});
		}
		/* obtendo a matriz e executando */
		if (source === "file") {
			let file   = data.path;
			let method = data.method;
			let pack   = __$$$(data);
			let exec   = WD(pack);
			exec.send(file, function(x) {
				if (x.closed) {
					input.matrix = x.csv;
					return buildChart(input);
				}
			}, method);
		} else {
			let table = WD(__$$$(data));
			if (table.type !== "dom") return;
			input.matrix = table.info.table;
			buildChart(input);
		}
		/* limpando atributo */
		target.data({wdChart: null});
		return;
	}

/*----------------------------------------------------------------------------*/
	function data_wdSend(e) { /* Requisições: data-wd-send=path{file}method{get|post}${form}call{name}& */
		if (!("wdSend" in e.dataset)) return;
		let data = wd_html_dataset_value(e, "wdSend");
		for (let i = 0; i < data.length; i++) {
			let method = "method" in data[i] ? data[i].method : "post";
			let file   = data[i].path;
			let pack   = __$$$(data[i]);
			let call   = window[data[i]["call"]];
			let exec   = WD(pack);
			exec.send(file, call, method);
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdSort(e) { /* Ordenar HTML: data-wd-sort="order{±1}col{>0?}" */
		if (!("wdSort" in e.dataset)) return;
		let data  = wd_html_dataset_value(e, "wdSort")[0];
		let order = "order" in data ? data.order : 1;
		let col   = "col"   in data ? data.col : null;
		WD(e).sort(order, col).data({wdSort: null});
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdTsort(e) { /* Ordena tabelas: data-wd-tsort="" */
		if (!("wdTsort" in e.dataset)) return;
		if (wd_html_tag(e.parentElement.parentElement) !== "thead") return;
		let order = e.dataset.wdTsort === "+1" ? -1 : 1;
		let col   = wd_html_bros_index(e);
		let heads = e.parentElement.children;
		let thead = e.parentElement.parentElement;
		let body  = thead.parentElement.tBodies;

		WD(body).sort(order, col);
		WD(heads).run(function(x) {
			if ("wdTsort" in x.dataset) x.dataset.wdTsort = "";
		});
		WD(e).data({wdTsort: (order < 0 ? "-1" : "+1")});

		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdFilter(e) { /* Filtrar elementos: data-wd-filter=chars{}${css}&... */
		if (!("wdFilter" in e.dataset)) return;

		/* verificando se é formulário ou outro elemento */
		let test   = new WDform(e);
		let search = test.form ? test.value : e.textContent;
		if (search === null || search === undefined) search = "";

		/* se for informada uma expressão regular */
		if ((/^\/.+\/$/).test(search))
			search = new RegExp(search.substr(1, (search.length - 2)));
		else if ((/^\/.+\/i$/).test(search))
			search = new RegExp(search.substr(1, (search.length - 3)), "i");
		/* localizar */
		let data = wd_html_dataset_value(e, "wdFilter");
		for (let i = 0; i < data.length; i++) {
			let chars  = data[i].chars;
			let target = __$$$(data[i]);
			if (target !== null) WD(target).filter(search, chars);
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdMask(e) { /* Máscara: data-wd-mask="model{mask}call{callback}msg{msg}" */
		/* apagar mensagem de máscara inválida, se houver */
		if ("wdErrorMessageMask" in e.dataset)
			delete e.dataset.wdErrorMessageMask;
		/* retornar se não tiver nada para fazer */
		if (!("wdMask" in e.dataset)) return;

		let shorts = {
			YMD: {mask: "####-##-##", msg: "YYYY-MM-DD (1996-10-20)"},
			DMY: {mask: "##/##/####", msg: "DD/MM/YYYY (20/10/1996)"},
			MDY: {mask: "##.##.####", msg: "MM.DD.YYYY (10.20.1996)"},
			YM:  {mask: "####-##",    msg: "YYYY-MM (1996-10)"},
			MY:  {mask: "##/####",    msg: "MM/YYYY (10/1996)"},
			YW:  {mask: "####-W##",   msg: "YYYY-Www (1996-W50)"},
			WY:  {mask: "##, ####",   msg: "ww, YYYY (1996-W05)"},
			HMS: {mask: "#:##?##:##?#:##:##?##:##:##", msg: "HH:MM:SS (2:09)"},
			YMDHMS: {
				mask: "%#:##?%##:##?%#:##:##?%##:##:##".replace(/\%/g, "####-##-##T"),
				msg: "YYYY-MM-DDTHH:MM:SS (1996-10-20T2:10)",
			},
			DMYHMS: {
				mask: "%#:##?%##:##?%#:##:##?%##:##:##".replace(/\%/g, "##/##/####T"),
				msg: "DD/MM/YYYYTHH:MM:SS (20/10/1996T2:10)",
			},
			MDYHMS: {
				mask: "%#:##?%##:##?%#:##:##?%##:##:##".replace(/\%/g, "##.##.####T"),
				msg: "MM.DD.YYYYTHH:MM:SS (10.20.1996T2:10)",
			},
			YMD_HMS: {
				mask: "%#:##?%##:##?%#:##:##?%##:##:##".replace(/\%/g, "####-##-## "),
				msg: "YYYY-MM-DD HH:MM:SS (1996-10-20 2:10)",
			},
			DMY_HMS: {
				mask: "%#:##?%##:##?%#:##:##?%##:##:##".replace(/\%/g, "##/##/#### "),
				msg: "DD/MM/YYYY HH:MM:SS (20/10/1996 2:10)",
			},
			MDY_HMS: {
				mask: "%#:##?%##:##?%#:##:##?%##:##:##".replace(/\%/g, "##.##.#### "),
				msg: "MM.DD.YYYY HH:MM:SS (10.20.1996 2:10)",
			},
		};

		/* obter o atributo da máscara e dados de dataset */
		let test = new WDform(e);
		let attr = test.form ? test.mask : "textContent";
		let data = wd_html_dataset_value(e, "wdMask")[0];
		if (attr === null || !("model" in data)) return;
		/* definir outras variáveis*/
		let text = e[attr];
		let mask = data.model;
		let func = "call" in data && data["call"] in window ? window[data["call"]] : null;
		let msg  = "msg" in data ? data["msg"] : null;
		/* obtendo dados de checagem de atalho, se for o caso */
		if (mask in shorts) {
			let path = shorts[data.model];
			func = "func" in path ? path.func : func;
			mask = "mask" in path ? path.mask : mask;
			msg  = "msg"  in path ? path.msg  : msg;
		}

		/* checando máscara e checando validade */
		let value = WD(mask).mask(text, func);
		/*-------------------------------------------------------------------------
		| máscara casou:
		|  entrada e máscara iguais: retornar
		|  entrada e máscara diferentes: definir e retornar
		| máscara não casou:
		|  campo vazio ou indefinido: retornar
		|  campo preenchido:
		|   inválido: retornar (erro de máscara é secundário)
		|   válido: invalidar
		\-------------------------------------------------------------------------*/
		if (value !== null) { /* máscara casou */
			if (text !== value)
				e[attr] = value;
		} else { /* máscara não casou */
			if (test.value !== undefined && test.value !== "" && !test.selfMasked)
				e.dataset.wdErrorMessageMask = msg === null ? mask : msg;
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdPage(e) { /* separação em grupos: data-wd-page=page{p}size{s} */
		if (!("wdPage" in e.dataset)) return;
		let data = wd_html_dataset_value(e, "wdPage")[0];
		WD(e).page(data.page, data.size).data({wdPage: null});
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdClick(e) { /* Executa click(): data-wd-click="" */
		if (!("wdClick" in e.dataset)) return;
		if ("click" in e) e.click();
		WD(e).data({wdClick: null});
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdData(e) { /* define dataset: data-wd-data=attr1{value}${css}& */
		if (!("wdData" in e.dataset)) return;
		let data = wd_html_dataset_value(e, "wdData");
		for (let i = 0; i < data.length; i++) {
			let target = __$$$(data[i]);
			delete data[i]["$"];
			delete data[i]["$$"];
			for (let j in data[i]) if (data[i][j] === "null") data[i][j] = null;
			WD(target === null ? e : target).data(data[i]);
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdEdit(e) { /* edita texto: data-wd-edit=comando{especificação}... */
		if (!("execCommand" in document)) return;
		if (!("wdEdit" in e.dataset)) return;
		let data = wd_html_dataset_value(e, "wdEdit")[0];
		for (let i in data) {
			let cmd = i;
			let arg = data[i].trim() === "" ? undefined : data[i].trim();
			if (cmd === "createLink") {
				arg = prompt("Link:");
				if (arg === "" || arg === null) cmd = "unlink";
			} else if (cmd === "insertImage") {
				arg = prompt("Link:");
			}
			document.execCommand(cmd, false, arg);
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdDevice(e) { /* Estilo widescreen: data-wd-device=desktop{css}tablet{css}phone{css}mobile{css} */
		if (!("wdDevice" in e.dataset)) return;
		let data = wd_html_dataset_value(e, "wdDevice")[0];
		let desktop = "desktop" in data ? data.desktop : "";
		let mobile  = "mobile"  in data ? data.mobile  : "";
		let tablet  = "tablet"  in data ? data.tablet  : "";
		let phone   = "phone"   in data ? data.phone   : "";
		let device  = __device();
		if (device === "desktop")
			return WD(e).css({del: phone}).css({del: tablet}).css({del: mobile}).css({add: desktop});
		if (device === "tablet")
			return WD(e).css({del: desktop}).css({del: phone}).css({add: mobile}).css({add: tablet});
		if (device === "phone")
			return WD(e).css({del: desktop}).css({del: tablet}).css({add: mobile}).css({add: phone});
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdFull(e) { /* Estilo fullscreen: data-wd-full=exit{}${} */
		if (!("wdFull" in e.dataset)) return;
		let data   = wd_html_dataset_value(e, "wdFull")[0];
		let exit   = "exit" in data ? true : false;
		let target = __$$$(data);
		if (target === document || target === window)
			target = document.documentElement;
		else if (target === null)
			target = e;
		WD(target).full(exit);
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdSlide(e) { /* Carrossel: data-wd-slide=time */
		if (!("wdSlide" in e.dataset)) return delete e.dataset.wdSlideRun;
		/*--------------------------------------------------------------------------
		| A) Obter o intervalo entre os slides definido em data-wd-slide
		| B) se não for um inteiro, definir 1s como padrão
		\-------------------------------------------------------------------------*/
		let value = e.dataset.wdSlide; /*A*/
		let time  = __finite(value) ? __integer(value) : 1000; /*B*/
		/*--------------------------------------------------------------------------
		| C) data-wd-slide-run informa se o slide foi executado: definir atividades
		| D) se tempo < 0, exibir filho anterior, caso conctrário, o próximo
		| E) informar o  que o slide foi executado
		| F) decorrido o intervalo, zerar execução e chamar novamente a função
		\-------------------------------------------------------------------------*/
		if (!("wdSlideRun" in e.dataset)) { /*C*/
			WD(e).nav((time < 0 ? "prev" : "next")); /*D*/
			e.dataset.wdSlideRun = "1"; /*E*/
			window.setTimeout(function() { /*F*/
				delete e.dataset.wdSlideRun;
				return data_wdSlide(e);
			}, Math.abs(time));
			return;
		}
		return delete e.dataset.wdSlideRun;
	};

/*----------------------------------------------------------------------------*/
	function data_wdShared(e) { /* Experimental: compartilhar em redes sociais: data-wd-shared=rede */
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
	function data_wdUrl(e) { /* define o valor informado do url no elemento data-wd-url="#" */
		if (!("wdUrl" in e.dataset)) return;
		let data = e.dataset.wdUrl;
		let val  = WD.url(data);
		if (val === null) return;
		let test = new WDform(e);
		let attr = test.form ? test.text : "textContent";
		if (attr === null) return;
		e[attr] = val;
		return WD(e).data({wdUrl: null});
	}

/*----------------------------------------------------------------------------*/
	function data_wdSet(e) { /* define attributos: data-wd-set=attr{value}${css}&... */
		if (!("wdSet" in e.dataset)) return;
		/*--------------------------------------------------------------------------
		| A) obter os grupos do atributo
		| B) definir palavras chaves para as correspondentes na linguagem
		| C) looping pelos grupos
		| D) definir o alvo e remover atributos que representam os seletores CSS
		| E) looping pelos atributos do grupo
		| F) definindo o valor do atributo e verificando palavras chaves
		| G) aplicando método: limitado a um argumento
		\--------------------------------------------------------------------------*/
		let data  = wd_html_dataset_value(e, "wdSet"); /*A*/
		let words = {"null": null, "false": false, "true": true}; /*B*/
		for (let i = 0; i < data.length; i++) { /*C*/
			let target = __$$$(data[i]); /*D*/
			delete data[i]["$"]; /*D*/
			delete data[i]["$$"]; /*D*/
			for (let attr in data[i]) { /*E*/
				let value = data[i][attr]; /*F*/
				if (value in words) value = words[value]; /*F*/
				WD(target === null ? e : target).set(attr, value); /*G*/
			}
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdCss(e) { /* define class: data-wd-css=add{value}tgl{css}del{css}rpl${css}&... */
		if (!("wdCss" in e.dataset)) return;
		let data = wd_html_dataset_value(e, "wdCss");
		for (let i = 0; i < data.length; i++) {
			let target = __$$$(data[i]);
			delete data[i]["$"];
			delete data[i]["$$"];
			if (JSON.stringify(data[i]) === "{}") data[i] = null;
			WD(target === null ? e : target).css(data[i]);
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdNav(e) { /* Navegação: data-wd-nav=action{arg}${css}& */
		if (!("wdNav" in e.dataset)) return;
		let data = wd_html_dataset_value(e, "wdNav");
		for (let i = 0; i < data.length; i++) {
			let target = __$$$(data[i]);
			let value  = "action" in data[i] ? data[i].action : null;
			WD(target === null ? e : target).nav(value);
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdJump(e) { /* Saltos de pai: data-wd-jump=$${parents}*/
		if (!("wdJump" in e.dataset)) return;
		let data    = wd_html_dataset_value(e, "wdJump")[0];
		let target  = __$$$(data);
		let parents = wd_vtype(target)
		if (parents.type === "dom")
			WD(e).jump(parents.value);
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdOutput(e, load) { /* Atribui valor ao target: data-wd-output=${target}call{} */
		let output = __$$("[data-wd-output]");
		if (output === null) return;
		/* looping pelos elementos com data-wd-output no documento */
		for (let i = 0; i < output.length; i++) {
			let elem   = output[i];
			let data   = wd_html_dataset_value(elem, "wdOutput")[0];
			let target = __$$$(data);
			if (!("call" in data) || WD(window[data["call"]]).type !== "function")
				continue;
			/* looping pelos elementos citados no atributo data-wd-output */
			for (let j = 0; j < target.length; j++) {
				if (target[j] === e || load === true) {
					let test = new WDform(elem);
					let attr = test.type !== null ? "value" : "textContent";
					elem[attr] = window[data["call"]]();
					break;
				}
			}
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdVform(e) { /* checa a validade de um formulário data-wd-vform="callback" */
		/* apagar mensagem de formulário inválido, se existir */
		if ("wdErrorMessageVform" in e.dataset)
			delete e.dataset.wdErrorMessageVform;
		/* retornar se não tiver nada para fazer */
		if (!("wdVform" in e.dataset)) return;
		/* obter dado do atributo e, se for função, obter o resultado */
		let data = e.dataset.wdVform;
		if (WD(window[data]).type !== "function") return;

		let value = window[data](e);

		if (value === null || value === undefined) return;
		e.dataset.wdErrorMessageVform = value;
		return;
	}


/*----------------------------------------------------------------------------*/
	function data_wdTranslate(e) { /* carrega tradução: data-wd-translate=path{dir}method{get|post}main{file name} */
		if (!("wdTranslate" in e.dataset)) return;
		let lang   = wd_lang(e).toLowerCase();
		let data   = wd_html_dataset_value(e, "wdTranslate")[0];
		let method = data.method;
		let dir    = "path" in data ? data.path.replace(/\/$/, "") : null;
		let main   = dir  !== null  ? ("main" in data ? data.main : null) : null;
		let file1  = dir  !== null  ? dir+"/"+(lang)+".json" : null;
		let file2  = dir  !== null  ? dir+"/"+(lang.split("-")[0])+".json" : null;
		let file3  = main !== null  ? dir+"/"+main : null;

		function readTranslationFile(files, n) {
			if (n >= files.length) return;
			if (files[n] === null) return readTranslationFile(files, ++n);

			WD().send(files[n], function(x) {
				if (x.closed) {
					if (wd_vtype(x.json).type === "array")
						return wd_html_translate(e, x.json);
					else
						return readTranslationFile(files, ++n);
				}
			}, method);
			return;
		}

		/* executando */
		WD(e).data({wdTranslate: null});
		readTranslationFile([file1, file2, file3], 0);

		return;
	}

/*----------------------------------------------------------------------------*/
	/* FIXME v5: destruir data_wdLang (data_wdTranslate o substituirá por definitivo) */
	function data_wdLang(e) { /* carrega HTML: data-wd-lang=path{file}method{get|post}${form} */
		if (!("wdLang" in e.dataset)) return;
		let data   = wd_html_dataset_value(e, "wdLang")[0];
		let target = WD(e);
		let method = data.method;
		let file   = data.path;
		let pack   = __$$$(data);
		let exec   = WD(pack);
		target.data({wdLang: null});
		exec.send(file, function(x) {
			if (x.closed) {
				let json = x.json;
				if (json === null) return;
				let lang = wd_lang().toLowerCase().replace(/\-/g, "_");
				let init = lang.split("_")[0];

				for (let css in json) { /* looping pelos identificadores css */
					let text;
					if (lang in json[css]) /* código completo (preferêncial) */
						text = json[css][lang];
					else if (init in json[css]) /* só primeiro termo do código (opção genérica) */
						text = json[css][init];
					else if ("*" in json[css]) /* valor principal (opção super-genérica) */
						text = json[css]["*"];
					else /* não mudar nada, se linguagem não localizada */
						continue;

					/* obtendo elementos e aplicando textContent */
					let target = WD(__$$(css));
					if (target.type !== "dom") continue;
					target.run(function(y) {
						y.textContent = text;
					});
				}
			}
		}, method);
		return;
	};

/*----------------------------------------------------------------------------*/
	function navLink(e) { /* link ativo do navegador */
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
		/* capturando o dispositivo */
		wd_device_controller = __device();

		/* construindo CSS da biblioteca */
		let css = [];
		for(let i = 0; i < wd_js_css.length; i++) {
			let selector = wd_js_css[i].s;
			let dataset  = wd_js_css[i].d;
			let value = selector+" {\n\t"+dataset.join("\n\t")+"\n}\n";
			if (!(/^\@keyframes/).test(value))
				value = value.replace(/\;/g, " !important;");
			css.push(value);
		}
		let style_block = document.createElement("STYLE");
		style_block.textContent = css.join("\n");
		document.head.appendChild(style_block);

		/* aplicando carregamentos */
		loadingProcedures();
		/* verificando âncoras lincadas */
		hashProcedures();

		return;
	}

/*----------------------------------------------------------------------------*/
	function hashProcedures(ev) {
		/*--------------------------------------------------------------------------
		| define margens e posicionamento de headers e footers, filhos de body,
		| quando fixo, quando chamada uma âncora interna (href="#ancora")
		\-------------------------------------------------------------------------*/
		let measures = function (e) { /* função interna: obter medidas necessárias */
			let obj = WD(e);
			if (obj.type !== "dom" || obj.item() === 0) return {ok: false};
			let stl = ["height", "marginTop", "marginBottom", "bottom", "top"];
			let msr = {
				ok:       true,
				elem:     obj.item(0),
				tag:      obj.info.tag,
				position: obj.vstyle("position").toLowerCase(),
			};
			for (let i = 0; i < stl.length; i++) {
				let val = obj.vstyle(__String(stl[i]).dash);
				msr[i]  = __integer(val.replace(/[^0-9\.]/g, ""));
			}
			return msr;
		}

		/* margem superior extra para headers */
		let head = measures(__$("body > header"));
		if (head.position === "fixed")
			document.body.style.marginTop = (head.top+head.height+head.marginBottom)+"px";
		/* margem inferior extra para footers */
		let foot = measures(__$("body > footer"));
		if (foot.position === "fixed")
			document.body.style.marginBottom = (foot.bottom+foot.height+foot.marginTop)+"px";
		/* mudar posicionamento em relação ao topo */
		let body = measures(document.body);
		let hash = measures(__$(window.location.hash));
		if (hash.ok && head.position === "fixed")
			window.scrollTo(0, hash.elem.offsetTop - body.marginTop);

		return;
	};

/*----------------------------------------------------------------------------*/
	function loadingProcedures() { /* procedimento para carregamentos */

		/* 1) processar repetições */
		WD.$$("[data-wd-repeat]").run(data_wdRepeat);
		if (wd_counter_control.repeat > 0) return;

		/* 2) processar carregamentos */
		WD.$$("[data-wd-load]").run(data_wdLoad);
		if (wd_counter_control.load > 0) return;

		/* 3) se repetições e carregamentos terminarem, organizar */
		organizationProcedures();

		return;
	};

/*----------------------------------------------------------------------------*/
	function scalingProcedures(ev) { /* procedimentos para definir dispositivo e aplicar estilos */
		let device = __device();
		if (device !== wd_device_controller) {
			wd_device_controller = device;
			WD.$$("[data-wd-device]").run(data_wdDevice);
		}
		hashProcedures();
		return;
	};

/*----------------------------------------------------------------------------*/
	function organizationProcedures() { /* procedimento PÓS carregamentos */
		WD.$$("[data-wd-sort]").run(data_wdSort);
		WD.$$("[data-wd-filter]").run(data_wdFilter);
		WD.$$("[data-wd-mask]").run(data_wdMask);
		WD.$$("[data-wd-page]").run(data_wdPage);
		WD.$$("[data-wd-click]").run(data_wdClick);
		WD.$$("[data-wd-slide]").run(data_wdSlide);
		WD.$$("[data-wd-device]").run(data_wdDevice);
		WD.$$("[data-wd-chart]").run(data_wdChart);
		WD.$$("[data-wd-url]").run(data_wdUrl);
		WD.$$("[data-wd-lang]").run(data_wdLang);
		WD.$$("[data-wd-translate]").run(data_wdTranslate);
		data_wdOutput(document, true);
		return;
	};

/*----------------------------------------------------------------------------*/
	function settingProcedures(e, attr) { /* procedimentos para dataset */
		switch(attr) {
			case "wdLoad":      loadingProcedures();    break;
			case "wdRepeat":    loadingProcedures();    break;
			case "wdSort":      data_wdSort(e);         break;
			case "wdFilter":    data_wdFilter(e);       break;
			case "wdMask":      data_wdMask(e);         break;
			case "wdPage":      data_wdPage(e);         break;
			case "wdClick":     data_wdClick(e);        break;
			case "wdDevice":    data_wdDevice(e);       break;
			case "wdSlide":     data_wdSlide(e);        break;
			case "wdChart":     data_wdChart(e);        break;
			case "wdOutput":    data_wdOutput(e, true); break;
			case "wdUrl":       data_wdUrl(e, true);    break;
			case "wdLang":      data_wdLang(e);         break;
			case "wdTranslate": data_wdTranslate(e);    break;
		};
		return;
	};

/*----------------------------------------------------------------------------*/
	function clickProcedures(ev) { /* procedimentos para cliques */
		if (ev.which !== 1) return;
		let elem = ev.target
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
			data_wdJump(elem);
			navLink(elem);
			/* efeito bolha */
			elem = "wdNoBubbles" in elem.dataset ? null : elem.parentElement;
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	function keyboardProcedures(ev, relay) { /* procedimentos de teclado */
		/* esvaziado na versão 4.0 */
		//if (!wd_html_form(ev.target) && ev.target.isContentEditable) return;
		return;
	};

/*----------------------------------------------------------------------------*/
	function inputProcedures(ev, relay) { /* procedimentos de formulário e contenteditable */
		/*--------------------------------------------------------------------------
		| A) após cada digitação/alteração, definir wdTimeKey com o tempo atual
		| B) chamar novamente a função após um intervalo de tempo
		\-------------------------------------------------------------------------*/
		let now = (new Date()).valueOf();
		if (relay !== true) {
			ev.target.dataset.wdTimeKey = now; /*A*/
			window.setTimeout(function() { /*B*/
				inputProcedures(ev, true);
			}, wd_key_time_range);
			return;
		}
		/*--------------------------------------------------------------------------
		| C) se wdTimeKey está difinido, checar o intervalo desde a última alteração
		| D) se agora for >= tempo definido+intervalo:
		| E) apagar atributo e
		| F) executar
		\-------------------------------------------------------------------------*/
		if ("wdTimeKey" in ev.target.dataset) { /*C*/
			let time = new Number(ev.target.dataset.wdTimeKey).valueOf();
			if (now >= (time+wd_key_time_range)) { /*D*/
				delete ev.target.dataset.wdTimeKey; /*E*/
				/*F*/
				data_wdFilter(ev.target);
				data_wdOutput(ev.target);
			}
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	function focusoutProcedures(ev) { /* procedimentos para saída de formulários */
		data_wdVform(ev.target);
		data_wdMask(ev.target);
		let test = new WDform(ev.target);
		test.checkValidity();
		return;
	};

/*----------------------------------------------------------------------------*/
	function changeProcedures(ev) { /* procedimentos para outras mudanças em formulários (type=file) */
		return;
	};

/*----------------------------------------------------------------------------*/
	WD(window).addHandler({ /* Definindo eventos window */
		load: loadProcedures,
		resize: scalingProcedures,
		hashchange: hashProcedures,
	});

	WD(document).addHandler({ /* Definindo eventos document */
		click:    clickProcedures,
		input:    inputProcedures,
		focusout: focusoutProcedures,
/*		keyup:    keyboardProcedures, desligado na versão 4 */
/*		change:   changeProcedures, desligado na versão 4 */
	});

	return WD;
}());

/*==============================================================================
Atributos e Eventos

loadProcedures()
	> loadingProcedures()
		> organizationProcedures()
	> hashProccedures()

wd_html_load(), wd_html_repeat()
	> loadingProcedures()

wd_html_data(), data-wd-data
	> settingProcedures()
		- data-wd-chart
		- data-wd-click
		- data-wd-device
		- data-wd-filter
		- data-wd-lang
		- data-wd-load
			> loadingProcedures()
		- data-wd-mask
		- data-wd-output
		- data-wd-page
		- data-wd-repeat
			> loadingProcedures()
		- data-wd-slide
		- data-wd-sort
		- data-wd-url

window.onload > loadProcedures()
	- [preparar biblioteca]
	> loadingProcedures()
		- data-wd-load
		- data-wd-repeat
		> organizationProcedures()
			- data-wd-chart
			- data-wd-click
			- data-wd-device
			- data-wd-filter
			- data-wd-mask
			- data-wd-output
			- data-wd-page
			- data-wd-slide
			- data-wd-sort
			- data-wd-url
			- data-wd-lang

window.onhashchange > hashProcedures()
	- [eventos de linkagem]

window.onresize > scalingProcedures()
	- data-wd-device

document.onclick > clickProcedures()
	- data-wd-css
	- data-wd-data
	- data-wd-edit
	- data-wd-full
	- data-wd-jump
	- data-wd-nav
	- data-wd-no-bubbles
	- data-wd-send
	- data-wd-set
	- data-wd-shared
	- data-wd-tsort
	- navlink()

document.oninput > inputProcedures()
	- data-wd-filter
	- data-wd-output

document.focusout > focusOutProcedures()
	- data-wd-mask
	- data-wd-vform
==============================================================================*/
