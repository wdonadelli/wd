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

/* Legenda: |^t título|^c capítulo|^0-9 nome|^0-9: descrição|\b negrito|\i itálico|\u sublinhado|\c code*/

"use strict";

const wd = (function() {

	/*t Variáveis e Constantes*/

	/*0 \bconst \bstr wd_version*/
	/*0: Versão da biblioteca JS.*/
	const wd_version = "WD JS v5.0.0";

	/*0 \blet \bstr wd_device_controller*/
	/*0: Identifica o tamanho da tela (\idesktop, \imobile, \itablet, \iphone, \cnull).*/
	let wd_device_controller = null;

	/*0 \bconst \bint wd_key_time_range*/
	/*0: Intervalo de tempo (\ims) para aguardar eventos de digitação (\ioninput, \ionkeyup...).*/
	const wd_key_time_range = 500;

	/*0 \bconst \bstruct wd_counter_control*/
	/*0: Controla a contagem de requisições:*/
	/*1 \bint repeat*//*1: Número de repetições em execução.*/
	/*1 \bint load*//*1: Número de carregamentos em execução.*/
	const wd_counter_control = {
		repeat: 0,
		load:   0
	};

	/*0 \bconst \bstruct wd_modal_control*/
	/*0: Controla a janela modal:*/
	const wd_modal_control = {
		/*1 \bnode modal*//*1: Container do plano de fundo.*/
		modal:   null,
		/*1 \bnode bar*//*1: Barra de progresso (\imeter, \iprogress ou \idiv).*/
		bar:     null,
		/*1 \bint counter*//*1: Número de solicitações em aberto (controlar exibição).*/
		counter:    0,
		/*1 \bint delay*//*1: Tempo (\ims) de espera para fechar a janela e evitar tela piscando.*/
		delay:    250,
		/*1 \bint time*//*1: Tempo (\ims) de interação para atualização da barra de progresso.*/
		time:       5,
		/*1 \bvoid _init()*//*1: \uInicializa os atributos.*/
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
		/*1 \bint start()*//*1: Demanda a exibição da janela modal. Acresce \icounter e o \uretorna.*/
		start: function() { /* abre a janela modal */
			if (this.modal === null) this._init();
			if (this.counter === 0)
				document.body.appendChild(this.modal);
			this.counter++;
			return this.counter;
		},
		/*1 \bint end()*//*1: Demanda o fechamento da janela modal. Decresce \icounter e o \uretorna.*/
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
		/*1 \bvoid progress(\bfloat x)*//*1: Define o valor da barra de progresso.*/
		/*2: \cx - valor da barra de progresso, de 0 a 1.*/
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

	/*0 \bconst \bstruct wd_signal_control*/
	/*0: Controla a caixa de mensagens:*/
	const wd_signal_control = {
		/*1 \bnode main*//*1: Container das caixas de mensagem.*/
		main: null,
		/*1 \bint time*//*1: Tempo de duração da mensagem (ver CSS \cjs-wd-signal-msg).*/
		time: 9000,
		/*1 \bvoid _init()*//*1: \uInicializa os atributos.*/
		_init: function() {
			this.main = document.createElement("DIV");
			this.main.className = "js-wd-signal";
			return;
		},
		/*1 \bstruct _createBox()*//*1: \uRetorna os elementos necessários para criar uma nova caixa de mensagem:*/
		_createBox: function() {
			return {
				/*2 \bnode box*//*2: Caixa da mensagem.*/
				box:     document.createElement("ARTICLE"),
				/*2 \bnode header*//*2: Cabeçalho da mensagem.*/
				header:  document.createElement("HEADER"),
				/*2 \bnode message*//*2: Texto da mensagem.*/
				message: document.createElement("SECTION"),
				/*2 \bnode close*//*2: Botão de fechamento antecipado.*/
				close:   document.createElement("SPAN"),
				/*2 \bnode header*//*2: Texto do cabeçalho.*/
				title:   document.createElement("STRONG")
			};
		},
		/*1 \bvoid _close(\bnode elem)*//*1: Demanda o fechamento da caixa de mensagem (tempo ou ação).*/
		/*2 \celem - caixa de mensagem a ser fechada.*/
		_close: function(elem) {
				try {this.main.removeChild(elem);} catch(e){}
				if (this.main.children.length === 0)
					try {document.body.removeChild(this.main);} catch(e){}
				return;
		},
		/*1 \bnode _box()*//*1: Criar uma nova caixa de mensagem e a \uretorna.*/
		_box: function() {
			let msg = this._createBox();
			msg.box.appendChild(msg.header);
			msg.box.appendChild(msg.message);
			msg.header.appendChild(msg.close);
			msg.header.appendChild(msg.title);
			msg.box.className = "js-wd-signal-msg";
			msg.close.textContent = "\u00D7";
			let object = this;
			msg.close.onclick = function() { /* disparador para quando clicar no botão fechar */
				object._close(msg.box);
			}
			return msg;
		},
		/*1 \bvoid open(\bstr message[, \bstr title)*//*1: Demanda a abertura de uma nova caixa de mensagem.*/
		/*2: \cmessage - texto da mensagem.*//*2: \ctitle - texto do cabeçalho (optional: \bstr vazia).*/
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
	/* Guarda os estilos da biblioteca Selector Database */
	/*0 \bconst \barray wd_js_css*/
	/*0: Os itens da lista são estruturas cujos atributos (\bstr) definem os estilos utilizados pela biblioteca:*/
	/*1: \cs - Seletor CSS.*//*1: \cd - estilos a ser aplicado ao seletor.*/
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

/*===========================================================================*/
	/*t Checagem de Tipos e Valores */
/*===========================================================================*/

	/*0 \bObject WDtype(\bvoid input)*/
	/*0: Construtor que identifica o tipo do argumento e resgata seu valor primitivo.*/
	/*1 input *//*1: Dado a ser examinado.*/
	/*0: Métodos e atributos:*/
	function WDtype(input) {
		if (!(this instanceof WDtype)) return new WDtype(input)
		this._input = input; /* valor original */
		this._data  = null;  /* dados complementares */
		this._type  = null;  /* tipo do valor de entrada */
		this._value = null;  /* valor a ser considerado */
	}

	Object.defineProperties(WDtype.prototype, {
		constructor: {value: WDtype},
		isString: {/*1 \bbool isString*//*1: (\igetter) Checa se o argumento é do tipo \istring.*/
			get: function() {
				return (typeof this._input === "string" || this._input instanceof String) ? true : false;
			}
		},
		isNumber: {/*1 \bbool isNumber*//*1: (\igetter) Checa se o argumento é do tipo \inumber (exceto \iNaN).*/
			get: function() {
				return (typeof this._input === "number" || this._input instanceof Number) ? !isNaN(this._input) : false;
			}
		},
		isBoolean: { /*1 \bbool isBoolean*//*1: (\igetter) Checa se o argumento é do tipo \iboolean.*/
			get: function() {
				return (typeof this._input === "boolean" || this._input instanceof Boolean) ? true : false;
			}
		},
		isRegExp: { /*1 \bbool isRegExp*//*1: (\igetter) Checa se o argumento é do tipo \iregexp.*/
			get: function() {
				return (this._input instanceof RegExp) ? true : false;
			}
		},
		isDate: { /*1 \bbool isDate*//*1: (\igetter) Checa se o argumento é do tipo \idate.*/
			get: function() {
				return (this._input instanceof Date) ? true : false;
			}
		},
		isFunction: {/*1 \bbool isFunction*//*1: (\igetter) Checa se o argumento é do tipo \ifunction.*/
			get: function() {
				return (typeof this._input === "function" || this._input instanceof Function) ? true : false;
			}
		},
		isArray: {/*1 \bbool isArray*//*1: (\igetter) Checa se o argumento é do tipo \iarray.*/
			get: function() {
				return (Array.isArray(this._input) || this._input instanceof Array) ? true : false;
			}
		},
		isStruct: { /*1 \bbool isStruct*//*1: (\igetter) Checa se o argumento é do tipo \iobject primitivo (\bstruct).*/
			get: function() {
				return typeof this._input === "object" && (/^\{.*\}$/).test(JSON.stringify(this._input)) ? true : false;
			}
		},
		isNull: {/*1 \bbool isNull*//*1: (\igetter) Checa se o argumento é do tipo \inull.*/
			get: function () {
				return this._input === null ? true : false;
			}
		},
		isUndefined: {/*1 \bbool isUndefined*//*1: (\igetter) Checa se o argumento é do tipo \iundefined.*/
			get: function() {
				return (this._input === undefined || typeof this._input === "undefined") ? true : false;
			}
		},
		type: {/*1 \bstr type*//*1: (\igetter) retorna o tipo do argumento*/
			get: function() {
				if (this.isNull)      return "null";
				if (this.isUndefined) return "undefined";
				if (this.isString)    return "string";
				if (this.isNumber)    return "number";
				if (this.isArray)     return "array";
				if (this.isBoolean)   return "boolean";
				if (this.isRegExp)    return "regexp";
				if (this.isDate)      return "date";
				if (this.isFunction)  return "function";
				if (this.isStruct)    return "object";
				return "unknow";
			}
		},
		valueOf: {/*1 \bvoid valueOf()*//*1: retorna o valor do argumento.*/
			value: function() {
				switch(this.type) {
					case "null":      return null;
					case "undefined": return undefined;
					case "string":    return this._input.trim();
					case "number":    return this._input.valueOf();
					case "array":     return this._input; //FIXME devolver cópia
					case "boolean":   return this._input == true ? true :  false;
					case "regexp":    return this._input; //FIXME devolver primitivo
					case "date":      return this._input;
					case "function":  return this._input;
					case "object":    return this._input;
				}
				return this._input
			}
		}
	});











//FIXME falta HTML, SVG e HTML Collection












/*===========================================================================*/
	/*c Obtenção de Valores*/
/*===========================================================================*/



/*----------------------------------------------------------------------------*/
	/*0 \bnull|\bstruct wd_getStringTime(\bstr value)*/
	/*0: Se a \istring informada não estiver no formato de tempo, 12 ou 24h (HH:MM AMPM ou HH:MM:SS), retorna \cnull, caso contrário, a estrutura:*/
	/*1 \bint h*//*1: (\ivalue) Valor numérico da hora.*/
	/*1 \bint m*//*1: (\ivalue) Valor numérico da minuto.*/
	/*1 \bint s*//*1: (\ivalue) Valor numérico da segundo.*/
	/*1 \bint time*//*1: (\ivalue) Quantidade total de segundos.*/
	function wd_getStringTime(value) {
		/* variáveis de teste */
		if (!wd_isString(value) || wd_isNull(value)) return null;
		let re12 = /^(0?[1-9]|1[0-2])\:[0-5]\d\ ?[ap]m$/i;
		let re24 = /^(0?\d|1\d|2[0-4])(\:[0-5]\d){1,2}$/;
		let h, m, s;
		/* testando string, desmembrando-a e obtendo a hora de acordo com o tipo */
		value = value.trim();
		if (re12.test(value)) {
			let am = (/am$/i).test(value) ? true : false;
			value  = value.replace(/[^0-9:]/g, "").split(":");
			h = Number(value[0]);
			if (h < 1 || h > 12) return null;
			h = am ? (h % 12) : (h === 12 ? 12 : ((12 + h ) % 24));
		} else if (re24.test(value)) {
			value = value.split(":");
			h = Number(value[0]);
		} else {
			return null;
		}
		/* checando valores */
		h = h % 24;
		m = Number(value[1]);
		s = Number(value.length === 3 ? value[2] : 0);
		if (h > 24 || h < 0) return null;
		if (m > 59 || m < 0) return null;
		if (s > 59 || s < 0) return null;

		return {h: h, m: m, s: s, time: (3600*h + 60*m + s)};
	}

//FIXME falta number e date





















/*----------------------------------------------------------------------------*/
	/*0 \bstruct|\bnull wd_check_number_str(\bstr value)*/
	/*0: Função checa se a string está no formato numérico e \uretorna \cnull, se falso, ou o resultado de \cwd_check_number:*/
	function wd_check_number_str(value) {
		let re = /^(\+?\d+\!|[+-]?(\d+|(\d+)?\.\d+)(e[+-]?\d+)?\%?)$/i;
		if (!re.test(value)) return null;
		//FIXME fatorial e porcentagem



		return wd_check_number(Number(value));
	}



/*----------------------------------------------------------------------------*/
	/*0 \bstruct|\bnull wd_check_str(\bvoid value)*/
	/*0: Função checa se o argumento é uma string. \uRetorna \cnull, se falso, ou a estrutura:*/
	/*1 \bstr value*//*1: (\ivalue) Valor informado.*/
	/*1 \bstruct _re*//*1: (\ivalue) Lista interna de formatos especiais de texto (data, tempo e número).*/
	/*1 \bbool _test*//*1: (\igetter) Testa e retorna qual o formato especial casado em _\cre.*/
	/*1 \bstr trim*//*1: (\igetter) Valor com extremidades aparadas.*/
	/*1 \bstr clear*//*1: (\igetter) Valor sem espaços extras e extremidades aparadas.*/
	/*1 \bstr upper*//*1: (\igetter) Valor em caixa alta*/
	/*1 \bstr lower*//*1: (\igetter) Valor em caixa baixa.*/
	/*1 \bstruct json*//*1: (\igetter) Converte JSON em notação javascript ou uma estrutura vazia, se inválido.*/
	/*1 \bbool isNull*//*1: (\igetter) Testa se é uma string vazia.*/
	/*1 \bbool llNum*//*1: (\igetter) Testa se a string está formatada como número, inclui porcentagem e fatorial.*/
	/*1 \bbool llDate*//*1: (\igetter) Testa se a string está formatada como data (DD/MM/YYYY, MM.DD.YYYY ou YYY-MM-DD).*/
	/*1 \bnull|\bstruct time12*//*1: (\igetter) Retorna o resultado de \cwd_check_time12 para o valor informado.*/
	/*1 \bnull|\bstruct time24*//*1: (\igetter) Retorna o resultado de \cwd_check_time24 para o valor informado.*/
	function wd_check_str(value) {
		if (typeof value === "string" || value instanceof String) {
			return {
				value: value.toString(),
				_re: {
					dateDMY: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
					dateMDY: /^(0[1-9]|1[0-2])\.(0[1-9]|[12]\d|3[01])\.\d{4}$/,
					dateYMD: /^\d{4}\-(0[1-9]|1[0-2])\-(0[1-9]|[12]\d|3[01])$/,
					numFact: /^(\ +)?\+?\d+\!(\ +)?$/
				},
				get _test()  {
					for (let i in this._re)
						if (this._re[i].test(this.value)) return i;
					return null;
				},
				get trim()   {return this.value.trim();},
				get clear()  {return this.trim.replace(/\ +/g, " ");},
				get length() {return this.value.length;},
				get upper()  {return this.value.toUpperCase();},
				get lower()  {return this.value.toLowerCase();},
				get json()   {try {return JSON.parse(this.trim)} catch(e) {return {};}},
				get test()   {for (let i in this._re) {}   },
				get isNull() {return this.trim === "" ? true : false;},
				get number() {return wd_check_number_str(this.trim);},
				get llDate() {return ["dateYMD", "dateDMY", "dateMDY"].indexOf(this._test) >= 0 ? true : false;},
				get time12() {return wd_check_time12(this.trim);},
				get time24() {return wd_check_time24(this.trim);},
			}
		}
		return null;
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

function wd_time_iso(number) { /* transforma valor numérico em tempo no formato HH:MM:SS */
		let obj = wd_number_time(number);
		let time = wd_num_fixed(obj.h, 0, 2)+":";
		time    += wd_num_fixed(obj.m, 0, 2)+":";
		time    += wd_num_fixed(obj.s, 0, 2);
		return time;
	}






	/*1 \bstruct wd_check(\bvoid value, \bstr check...)*/
	function wd_check(value) {/* retorna o tipo e o valor do objeto */
		value;

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
	function wd_get_device() {/*tipo do dispositivo*/
		if (window.innerWidth >= 768) return "desktop";
		if (window.innerWidth >= 600) return "tablet";
		return "phone";
	};
/*----------------------------------------------------------------------------*/
	function wd_bytes(value) { /*calculadora de bytes*/
		if (value === Infinity) return wd_num_str(value)+"B";
		value = value < 1 ? 0 : wd_integer(value, true);
		let scale = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
		for (let i = scale.length - 1; i >= 0; i--)
			if (value >= Math.pow(1024,i))
				return (value/Math.pow(1024,i)).toFixed(2)+scale[i];
		return "0B";
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
	function wd_$(selector, root) {/* retorna querySelector */
		let elem = null;
		try {elem = root.querySelector(selector);    } catch(e) {}
		if (elem !== null) return elem;
		try {elem = document.querySelector(selector);} catch(e) {}
		return elem;
	}

/*----------------------------------------------------------------------------*/
	function wd_$$(selector, root) {/* retorna querySelectorAll */
		let elem = null;
		try {elem = root.querySelectorAll(selector);    } catch(e) {}
		if (elem !== null) return elem;
		try {elem = document.querySelectorAll(selector);} catch(e) {}
		return elem;
	}

/*----------------------------------------------------------------------------*/
	function wd_$$$(obj, root) { /* captura os valores de $ e $$ dentro de um objeto ($$ prioridade) */
		let one =  "$" in obj ? obj["$"].trim()  : null;
		let all = "$$" in obj ? obj["$$"].trim() : null;
		if (one === null && all === null) return null;
		let words  = {"document": document, "window":  window};
		if (one in words) return words[one];
		if (all in words) return words[all];
		one = one === null ? null : wd_$(one, root);
		all = all === null ? null : wd_$$(all, root);
		return all !== null ? all : one;
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
	function wd_text_caps(input) { /* captaliza string */
		input = input.split("");
		let empty = true;
		for (let i = 0; i < input.length; i++) {
			input[i] = empty ? input[i].toUpperCase() : input[i].toLowerCase();
			empty    = input[i].trim() === "" ? true : false;
		}
		return input.join("");
	}

/*----------------------------------------------------------------------------*/
	function wd_text_toggle(input) { /* altera caixa de string */
		input = input.split("");
		for (let i = 0; i < input.length; i++) {
			let test = input[i].toUpperCase();
			input[i] = input[i] === test ? input[i].toLowerCase() : test;
		}
		return input.join("");
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

/*----------------------------------------------------------------------------*/
	function wd_text_camel(value) { /* abc-def para abcDef */
		let x = wd_text_clear(value);
		x = wd_no_spaces(x, " ").replace(/[^a-zA-Z0-9._: -]/g, "");

		/* testando se já está no formato */
		if ((/^[a-z0-9\.\_\:][a-zA-Z0-9\.\_\:]+$/).test(x)) return x;

		/* adequando string */
		x = wd_no_spaces(value, "-").split("");
		for (let i = 0; i < x.length; i++) {
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
		let x = wd_text_clear(value);
		x = wd_no_spaces(x, " ").replace(/[^a-zA-Z0-9._: -]/g, "");

		/* testando se já está no formato */
		if ((/^[a-z0-9\_\.\:]+((\-[a-z0-9\_\.\:]+)+)?$/).test(x)) return x;

		/* adequando string */
		x = wd_no_spaces(x, "-").split("");
		for (let i = 1; i < x.length; i++)
			x[i] = x[i].toLowerCase() == x[i] ? x[i] : "-"+x[i];

		x = x.join("").toLowerCase().replace(/\-+/g, "-");
		x = x.replace(/^\-+/g, "").replace(/\-+$/g, "");

		return x === "" ? null : x;
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
	function wd_finite(n) {/* verifica se é um valor finito */
		let vtype = wd_vtype(n);
		if (vtype.type !== "number") return false;
		return isFinite(vtype.value);
	};

/*----------------------------------------------------------------------------*/
	function wd_integer(n, abs) { /* retorna o inteiro do número ou seu valor absoluto */
		let vtype = wd_vtype(n);
		if (vtype.type !== "number") return null;
		let val = abs === true ? Math.abs(vtype.value) : vtype.value;
		return val < 0 ? Math.ceil(val) : Math.floor(val);
	};

/*----------------------------------------------------------------------------*/
	function wd_decimal(value) {/* retorna o número de casas decimais */
		if (!wd_finite(value)) return 0;
		let i = 0;
		while ((value * Math.pow(10, i)) % 1 !== 0) i++;
		let pow10  = Math.pow(10, i);
		if (pow10 === 1) return 0;
		return (value*pow10 - wd_integer(value)*pow10) / pow10;
	}

/*----------------------------------------------------------------------------*/
	function wd_primes(limit, decimal) {/* retorna os números primos até um limite */
		let primes = [2];
		let count  = 3;
		let pow10  = 10;
		while (count <= limit) {
			let check = true;
			for (let i = 1; i < primes.length; i++) { /* iniciar em 1 (os pares não serão verificados) */
				if (count % primes[i] === 0) {
					check = false;
					break;
				}
			}
			/* incluir os múltiplos de 10 antes */
			if (decimal === true && (count - 1) === pow10) {
				primes.push(pow10);
				pow10 = pow10*10;
			}
			/* se primo, incluir na lista */
			if (check) primes.push(count);
			/* ir para o próximo contador (analisar apenas ímpares) */
			count += 2;
		}
		return primes
	}

/*----------------------------------------------------------------------------*/
	function wd_mdc(a, b) {
		let div   = [];
		let prime = wd_primes(a < b ? a : b);
		for (let i = 0; i < prime.length; i++) {
			if (prime[i] > a || prime[i] > b) break;
			while (a % prime[i] === 0 && b % prime[i] === 0) {
				div.push(prime[i]);
				a = a/prime[i];
				b = b/prime[i];
			}
		}
		let mdc = 1;
		for (let i = 0; i < div.length; i++) mdc = mdc * div[i];
		return mdc;
	}

/*----------------------------------------------------------------------------*/
	function wd_num_type(n) { /* retorna o tipo de número */
		let types = ["zero", "+infinity", "-infinity", "+integer", "-integer", "+float", "-float"];
		for (let i = 0; i < types.length; i++)
			if (wd_test(n, [types[i]]))
				return types[i];
		return "number";
	}

/*----------------------------------------------------------------------------*/
	function wd_num_frac(n) { /* representação em fração (2 casas) */
		/* inteiros ou zero não têm parte fracionária, retornar string */
		if (wd_test(n, ["integer", "zero"]))
			return wd_integer(n).toFixed(0);
		/* infinito também não tem parte fracionária, retornar string */
		if (wd_test(n, ["infinity"]))
			return wd_num_str(n);

		/* capturar parte inteira e decimal */
		let integer = wd_integer(n);
		let decimal = wd_decimal(n);

		/* números pequenos (e.g. 1/10000) retorna zero: ver deslocamento de casas decimais (abaixo) */
		let data  = {
			int: Math.abs(integer), /* parte inteira (valor absoluto) */
			mul: 1,                 /* multiplicador de 10 (melhorar precisão de números demais pequenos) */
			val: Math.abs(decimal), /* valor a ser encontrado */
			num: 0,                 /* numerador */
			den: 1,                 /* denominador */
			error: 1                /* erro: encontrar o menor valor */
		};

		/* deslocar números pequenos demais 0.0001 -> 0.1 (alterando provisoriamente o valor a ser encontrado) */
		while((10*data.val) < 1) {
			data.val = 10*data.val;
			data.mul = 10*data.mul;
		}

		/* capturar números precisão de 3 dígitos */
		let prime = wd_primes(1000, true);

		/* testando valores em busca do menor erro */
		for (let i = 0; i < prime.length; i++) {
			let n = 0;        /* numerador */
			let d = prime[i]; /* denominador */
			let e = 1;        /* erro */
			while (n < d) {
				e = Math.abs((n/d)-data.val)/data.val; /* (final - inicial)/inicial */
				if (e < data.error) {
					data.den   = d;
					data.num   = n;
					data.error = e;
				}
				/* parando se error for zero (melhor valor encontrado) : looping interno */
				if (data.error === 0) break;
				n++;
			}
			/* parando se error for zero (melhor valor encontrado) : looping externo */
			if (data.error === 0) break;
		}

		/* voltar o valor provisório à realidade (den*mul) */
		data.den = data.den * data.mul;

		/* calculando o MDC em busca de simplificações */
		let mdc = wd_mdc(data.num, data.den);
		data.num = data.num/mdc;
		data.den = data.den/mdc;

		/* analisando parte inteira e denominador em caso de aproximação computacional equivocada */
		if (data.num === 0 && data.int === 0) return "0";
		if (data.num === 0 && data.int !== 0) return data.int.toFixed(0);

		/* formatando a fração */
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
		if (wd_test(n, ["infinity", "zero"])) return wd_num_str(n);

		width = wd_finite(width) ? wd_integer(width, true) : undefined;

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

		lint = wd_finite(lint) ? wd_integer(lint, true) : 0;
		ldec = wd_finite(ldec) ? wd_integer(ldec, true) : 0;

		let sign = n < 0 ? "-" : "";
		let int  = Math.abs(wd_integer(n));
		let dec  = Math.abs(wd_decimal(n));

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
		return (ref % 7 > 0 ? 1 : 0) + wd_integer(ref/7);
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
				item[i].i = wd_integer(cell[i]);
				item[i].n = wd_integer(cell[i]);
			} else if ((/^\-[0-9]+$/).test(cell[i])) { /* do início até o endereço */
				item[i].n = wd_integer(cell[i].replace("-", ""));
			} else if ((/^[0-9]+\-$/).test(cell[i])) { /* do endereço até o fim */
				item[i].i = wd_integer(cell[i].replace("-", ""));
			} else if ((/^[0-9]+\-[0-9]+$/).test(cell[i])) { /* do endereço inicial até o final */
				let gap   = cell[i].split("-");
				item[i].i = wd_integer(gap[0]);
				item[i].n = wd_integer(gap[1]);
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
		if (!wd_finite(i)) return array.length;
		i = wd_integer(i);
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
				avalue = wd_text_clear(a.toUpperCase());
				bvalue = wd_text_clear(b.toUpperCase());
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
			if (!wd_finite(vx) || !wd_finite(vy) || !wd_finite(vz)) continue;
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
			if (vx === 0 || !wd_finite(vx)) continue;
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
			if (!wd_finite(vref.value)) return null;
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
			if (!wd_finite(val)) continue;
			data.value += val;
			data.length++;
		}
		return data.length === 0 ? null : Math.sqrt(data.value/data.length);
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_least_squares(x, y) { /* Método dos mínimos quadrados (obrigatório 2 coordenadas) */
		let coord = wd_coord_adjust(x, y);
		if (coord === null || coord.length < 2) return null;
		x = coord.x;
		y = coord.y;

		let X  = wd_coord_sum(x, 1);
		let Y  = wd_coord_sum(y, 1);
		let X2 = wd_coord_sum(x, 2);
		let XY = wd_coord_sum(x, 1, y, 1);
		if ([X, Y, XY, X2].indexOf(null) >= 0) return null;
		X  = X.value;
		Y  = Y.value;
		X2 = X2.value;
		XY = XY.value;
		let N    = coord.length;
		let data = {};
		data.a   = ((N * XY) - (X * Y)) / ((N * X2) - (X * X));
		data.b   = ((Y) - (X * data.a)) / (N);
		return data;
	}

/*----------------------------------------------------------------------------*/
	function wd_coord_setter(x, f) { /* obtem uma nova coordenada mediante aplicação de uma função */
		let data = [];
		let val  = null;
		for (let i = 0; i < x.length; i++) {
			try {val = f(x[i]);} catch(e) {}
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
		let coord = wd_coord_adjust(x, y);
		if (coord === null) return null;
		x = coord.x;
		y = coord.y;
		let val = wd_coord_least_squares(x, y);
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
		let val = wd_coord_least_squares(x, wd_coord_setter(y, Math.log));
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
		let val = wd_coord_least_squares(
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
		if (!wd_finite(delta)) delta = (ends.max - ends.min)/xcoord.length;
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
			elem.style[wd_text_camel(i)] = styles[i];
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
			let key = wd_text_camel(i);
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
		let scripts = wd_vtype(wd_$$("script", temp)).value;

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
			if (!wd_finite(init)) init = 0;
			if (!wd_finite(end))  end  = child.length-1;
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
		chars = wd_finite(chars) && chars !== 0 ? wd_integer(chars) : 1;

		/* definindo valor de busca */
		let type = wd_vtype(search).type;
		if (type !== "regexp") {/* definir string, limpar e por caixa alta */
			search = new String(search);
			search = wd_text_clear(search.toString()).toUpperCase();
		}

		/* looping pelos filhos */
		let child = wd_vtype(elem.children).value;
		for (let i = 0; i < child.length; i++) {
			if (!("textContent" in child[i])) continue;

			/* obtendo conteúdo do elemento (limpar, mas deixar maiúsculo apenas para texto) */
			let content = wd_text_clear(child[i].textContent);

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
		if (!wd_finite(size)) size = -1;
		if (!wd_finite(page) && page !== "+" && page !== "-") page = 0;

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
			size = wd_integer(size < 1 ? size*lines.length : size); /*BC*/
			if (size === 0) size = 1; /*D*/
		}

		function last() { /* informa a última página */
			return wd_integer(lines.length/size + (lines.length % size === 0 ? -1 :0));
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
			page = wd_integer(page);
		let start = page*size;
		let end   = start+size-1;
		wd_html_nav(elem, ""+start+":"+end+"");
		/* guardar informação da última página */
		elem.dataset.wdCurrentPage = page+"/"+wd_integer(lines.length/size);
		return;

	}

/*----------------------------------------------------------------------------*/
	function wd_html_sort(elem, order, col) { /* ordena elementos filho pelo conteúdo */
		order = wd_finite(order) ? wd_integer(order) : 1;
		col   = wd_finite(col)   ? wd_integer(col, true) : null;

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
			let check = wd_vtype(wd_$$$(attrs, elem));
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
				} else if (abs === wd_integer(abs)) {
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
				if (ref.indexOf(i) >= 0 && wd_finite(val))
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
					let month = wd_integer(this.e.value.substr(data[i].m.i, data[i].m.e));
					let year  = wd_integer(this.e.value.substr(data[i].y.i, data[i].y.e));
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
					let week = wd_integer(this.e.value.substr(data[i].w.i, data[i].w.e));
					let year = wd_integer(this.e.value.substr(data[i].y.i, data[i].y.e));
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
				let power = wd_integer(n/6) + 1;
				let value = 255/power;
				let onoff = swap[index].split("");
				let color = [];
				for (let i = 0; i < onoff.length; i++)
					color.push(onoff[i] === "1" ? wd_integer(value) : 33);
				return "rgb("+color.join(",")+")";
			}
		},
		point: { /* Transforma coordanadas reais em relativas (%) */
			value: function(x, y) {
				if (!wd_finite(x) || !wd_finite(y)) return null;
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
			get: function() {return wd_finite(this._value);}
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
			get: function() {return wd_text_caps(this.toString());}
		},
		tgl: { /* inverte caixa */
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
			get: function() {return wd_integer(this.valueOf());}
		},
		dec: { /* retorna a parte decimal */
			get: function() {return wd_decimal(this.valueOf());}
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
	function WDdate(input) {WDmain.call(this, input);}

	WDdate.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDdate},
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
				return (this._value < 0 ? -1 : 0) + wd_integer(this._value/86400000);
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
		$:       {value: function(css, root) {return WD(wd_$(css, root));}},
		$$:      {value: function(css, root) {return WD(wd_$$(css, root));}},
		url:     {value: function(name) {return wd_url(name);}},
		copy:    {value: function(text) {return wd_copy(text);}},
		lang:    {get:   function() {return wd_lang();}},
		device:  {get:   function() {return wd_get_device();}},
		today:   {get:   function() {return WD(new Date());}},
		now:     {get:   function() {return WD(wd_str_now());}},
		i: {value: function(x){return wd_check_str(x);}}
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
		let pack    = wd_$$$(data);
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
		let pack   = wd_$$$(data);
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
			let pack   = wd_$$$(data);
			let exec   = WD(pack);
			exec.send(file, function(x) {
				if (x.closed) {
					input.matrix = x.csv;
					return buildChart(input);
				}
			}, method);
		} else {
			let table = WD(wd_$$$(data));
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
			let pack   = wd_$$$(data[i]);
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
			let target = wd_$$$(data[i]);
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
			let target = wd_$$$(data[i]);
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
		let device  = wd_get_device();
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
		let target = wd_$$$(data);
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
		let time  = wd_finite(value) ? wd_integer(value) : 1000; /*B*/
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
			/**** https://www.coderstool.com/share-social-link-generator ****/
			linkedin: "https://www.linkedin.com/shareArticle?url="+url+"&title="+title,
			/* https://www.reddit.com/dev/api#POST_api_submit */
			reddit:   "https://reddit.com/submit?url="+url+"&title="+title,
			/**** https://www.coderstool.com/share-social-link-generator ****/
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
			let target = wd_$$$(data[i]); /*D*/
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
			let target = wd_$$$(data[i]);
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
			let target = wd_$$$(data[i]);
			let value  = "action" in data[i] ? data[i].action : null;
			WD(target === null ? e : target).nav(value);
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdJump(e) { /* Saltos de pai: data-wd-jump=$${parents}*/
		if (!("wdJump" in e.dataset)) return;
		let data    = wd_html_dataset_value(e, "wdJump")[0];
		let target  = wd_$$$(data);
		let parents = wd_vtype(target)
		if (parents.type === "dom")
			WD(e).jump(parents.value);
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdOutput(e, load) { /* Atribui valor ao target: data-wd-output=${target}call{} */
		let output = wd_$$("[data-wd-output]");
		if (output === null) return;
		/* looping pelos elementos com data-wd-output no documento */
		for (let i = 0; i < output.length; i++) {
			let elem   = output[i];
			let data   = wd_html_dataset_value(elem, "wdOutput")[0];
			let target = wd_$$$(data);
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
		let pack   = wd_$$$(data);
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
					let target = WD(wd_$$(css));
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
		wd_device_controller = wd_get_device();

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
				let val = obj.vstyle(wd_text_dash(stl[i]));
				msr[i]  = wd_integer(val.replace(/[^0-9\.]/g, ""));
			}
			return msr;
		}

		/* margem superior extra para headers */
		let head = measures(wd_$("body > header"));
		if (head.position === "fixed")
			document.body.style.marginTop = (head.top+head.height+head.marginBottom)+"px";
		/* margem inferior extra para footers */
		let foot = measures(wd_$("body > footer"));
		if (foot.position === "fixed")
			document.body.style.marginBottom = (foot.bottom+foot.height+foot.marginTop)+"px";
		/* mudar posicionamento em relação ao topo */
		let body = measures(document.body);
		let hash = measures(wd_$(window.location.hash));
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
		let device = wd_get_device();
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
