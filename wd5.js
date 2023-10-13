/*------------------------------------------------------------------------------
MIT License

Copyright (c) 2023 Willian Donadelli <wdonadelli@gmail.com>

Permission is hereby granted, fr_ee of charge, to any person obtaining a copy
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
	/**# Biblioteca JavaScript
	## Documentação para Manutenção

	@menu

	### Mecanismos de Controle

	###### ``**const** ''string'' __VERSION``
	Registra a versão da biblioteca.**/
	const __VERSION = "WD JS v5.0.0";
/*----------------------------------------------------------------------------*/

	let __device_controller = null;//FIXME substituir isso por __DEVICECONTROLLER

	function __device() { //FIXME substituir isso por __DEVICECONTROLLER
		if (window.innerWidth >= 768) return "desktop";
		if (window.innerWidth >= 600) return "tablet";
		return "phone";
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''object'' __DEVICECONTROLLER``
	Controla as alterações da tela atribuida a um tipo de dispositivo e executa ações quando houver mudança neste dispositivo idealizado.
	. ``''boolean'' _start``: Informar se o controlador já foi iniciado.
	. ``''function'' _change``: Registra a função disparadora de alteração do tipo de dispositivo.
	. ``''string'' _device``: Registra o tipo do dispositivo a partir do tamanho da tela em vigor.
	. ``''integer'' screen``: Retorna o tamanho da tela.
	. ``''string'' device``: Retorna o identificador da tela:
			|Identificador|Tamanho da Tela|
			|desktop|&ge; 768px|
			|tablet|&ge; 600px|
			|phone|&lt; 600px|
	**/
	const __DEVICECONTROLLER = {
		_start: false,
		_change: null,
		_device: null,
		get screen() {return window.innerWidth;},
		get device() {
			let screen = this.screen;
			if (screen >= 768) return "desktop";
			if (screen >= 600) return "tablet";
			return "phone";
		},
		/**. ``''boolean'' mobile``: Informa se dispositivo não é do tamanho desktop.**/
		get mobile() {return this._device !== "desktop";},
		/**. ``''void'' onchange``: Define a função disparadora de alteração de dispositivo (tamanho da tela). Quando definido, o evento ''resize'' será provocado e uma chamada será executada.**/
		set onchange(x) {
			if (typeof x === "function" || x === null) {
				this._change = x;
				this._device = null;
				this._trigger();
			}
			if (!this._start) {
				let object = this;
				window.addEventListener("resize", function(x) {return object._trigger();});
				this._start = true;
			}
		},
		/**. ``''void'' _trigger()``: Executa a função disparadora quando provocado (alteração de tela) enviando um objeto como argumento com as seguintes características:
		.. ``''object'' target``: O objeto ``__DEVICECONTROLLER``.
		.. ``''integer'' width``: O tamanho da tela em px.
		.. ``''string'' device``: O nome do dispositivo correspondente à tela.
		.. ``''boolean'' mobile``: Informa se o dispositivo possui tela inferior ao desktop.**/
		_trigger: function() {
			let device = this.device;
			if (this._device === device) return;
			this._device = device;
			if (this._change === null) return;
			this._change({
				target: this,
				width: this.screen,
				device: device,
				mobile: this.mobile
			});
			return;
		},
	};
/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''integer'' __KEYTIMERANGE``
	Registra o intervalo, em milisegundos, entre eventos de digitação (oninput, onkeyup...).**/
	const __KEYTIMERANGE = 500;
/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''object'' __COUNTERCONTROL``
	Registra a contagem de requisições:
	. ``''integer'' repeat``: Número de manipulações de repetição.
	. ``''integer'' load``: Número de manipulações de carregamentos.**/
	const __COUNTERCONTROL = {
		repeat: 0,
		load:   0
	};
/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''object'' __MODALCONTROL``
	Controla a janela modal.
	. ``''node'' modal``: Plano de fundo.
	. ``''node'' bar``: Barra de progresso (meter, progress ou div).
	. ``''integer'' counter``: Solicitações em aberto (controla a exibição), fecha se zero.
	. ``''integer'' delay``: Tempo de segurança, em milisegundos, para decidir sobre o fechamento da janela (evitar piscadas).
	. ``''integer'' time``: Intervalo, em milisegundos, de atualização da barra de progresso.**/
	const __MODALCONTROL = {
		modal: null,
		bar: null,
		counter: 0,
		delay: 250,
		time: 5,
		/**. ``''void'' _init()``: Inicializa os atributos.**/
		_init: function() {
			if (this.modal !== null) return;
			/* janela modal */
			this.modal = document.createElement("DIV");
			this.modal.className = "js-wd-modal";
			/* barra de progresso */
			if ("HTMLMeterElement1" in window)
				this.bar = document.createElement("METER");
			else if ("HTMLProgressElement1" in window)
				this.bar = document.createElement("PROGRESS");
			else
				this.bar = document.createElement("DIV");
			this.bar.className = "js-wd-progress-bar";
			/* unindo os dois */
			this.modal.appendChild(this.bar);
			return;
		},
		/**. ``''integer'' start()``: Solicita a janela modal, acresce ``counter`` e retorna seu valor.**/
		start: function() { /* abre a janela modal */
			this._init();
			if (this.counter === 0)
				document.body.appendChild(this.modal);
			this.counter++;
			return this.counter;
		},
		/**. ``''integer'' end()``: Dispensa à janela modal, decresce counter e retorna seu valor.**/
		end: function() {
			let object = this;
			/* checar fechamento da janela após delay */
			window.setTimeout(function () {
				object.counter--;
				if (object.counter < 1)
					document.body.removeChild(object.modal); //FIXME no load está dando errado
			}, this.delay);

			return this.counter;
		},
		/**. ``''void'' progress(''number'' x)``: Define o valor da barra de progresso (0 a 1) por meio do argumento ``x``.**/
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
/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''object'' __SIGNALCONTROL``
	Controla a caixa de mensagens.
	. ``''node'' main``: Container das caixas de mensagem.
	. ``''integer'' time``: Tempo de duração da mensagem (ver CSS ``js-wd-signal-msg``).**/
	const __SIGNALCONTROL = {
		main: null,
		time: 9000,
		/**. ``''void'' _init()``: Inicializa os atributos.**/
		_init: function() {
			this.main = document.createElement("DIV");
			this.main.className = "js-wd-signal";
			return;
		},
		/**. ``''object'' _createBox()``: Método interno que cria e retorna um objeto com os componentes de uma nova caixa de mensagem.
		.. ``''node'' box``: Container da caixa de mensagem.
		.. ``''node'' header``: Cabeçalho da mensagem.
		.. ``''node'' message``: Texto da mensagem.
		.. ``''node'' close``: Botão de fechamento antecipado da caixa.
		.. ``''node'' title``: Texto do cabeçalho.**/
		_createBox: function() {
			return {
				box:     document.createElement("ARTICLE"),
				header: document.createElement("HEADER"),
				message: document.createElement("SECTION"),
				close: document.createElement("SPAN"),
				title: document.createElement("STRONG")
			};
		},
		/**. ``''void'' _close(''node'' elem)``: Demanda o fechamento da caixa de mensagem, onde o argumento ``elem`` indica a caixa (nó) a fechar.**/
		_close: function(elem) {
				try {this.main.removeChild(elem);} catch(e){}
				if (this.main.children.length === 0)
					try {document.body.removeChild(this.main);} catch(e){}
				return;
		},
		/**. ``node _box()``: Constrói a caixa de mensagem e a retorna.**/
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
		/**. ``''void'' open(''string'' message, ''string'' title=" ")``: Demanda a abertura de uma nova caixa de mensagem.
		. O argumento ``message`` define o texto da mensagem e o argumento ``title`` define seu título.**/
		open: function(message, title) {
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
	};
/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''array'' __JSCSS``
	Guarda os estilos da biblioteca. Cada item da lista é um objeto que define os estilos:
	. ``''string'' s``: Seletor CSS.
	. ``''string'' d``: Estilos a serem aplicados ao seletor.**/
	const __JSCSS = [
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
	/**### Checagem de Tipos e Valores
	###### ``**constructor** ''object'' __Type(''any''  input)``
	Construtor para identificação do tipo de dado informado informado no argumento ``input``.**/
	function __Type(input) {
		if (!(this instanceof __Type)) return new __Type(input);
		Object.defineProperties(this, {
			_input: {value: input},                 /* valor de referência */
			_type:  {value:  null, writable: true}, /* tipo do valor de entrada */
			_value: {value:  null, writable: true}, /* valor a ser considerado */
		});
		this._init(); /* definir atributos próprios */
	}

	Object.defineProperties(__Type.prototype, {
		constructor: {value: __Type},
		/**. ``''array'' _months``: Registra a lista de nomes dos meses (longos e curtos) na língua inglesa e local para determinar a data.**/
		_months: {
			value: (function() {
				let months = [];
				let data   = {
					long:  [undefined, "en"],
					short: [undefined, "en"]
				};
				for (let type in data) {
					for (let i = 0; i < data[type].length; i++) {
						let date = new Date(1970, 0, 1, 12, 0, 0, 0);
						let lang = data[type][i];
						while(date.getFullYear() <= 1970) {
							let info = date.toLocaleDateString(lang, {month: type});
							months.push(info.toLowerCase());
							date.setMonth(date.getMonth()+1);
						}
					}
				}
				return months;
			})()
		},
		/**. ``''integer'' _getMonths(''string'' x)``: Retorna o valor númerico (1-12) do mês e zero se não encontrado. O argumento ``x`` deverá corresponder ao nome do mês (curto ou longo) na língua inglesa ou local.**/
		_getMonths: {
			value: function(x) {
				x = String(x).toLowerCase();
				let item = this._months.indexOf(x);
				if (item < 0) return 0;
				return item%12+1;
			}
		},
		/**. ``''object'' _re``: Armazena as expressões regulares dos de dados descritos em string.**/
		_re: {
			value: {
				number:  /^(\+?\d+\!|[+-]?(\d+|(\d+)?\.\d+)(e[+-]?\d+)?\%?)$/i,
				date:    /^([-+]?\d{3}\d+)\-(0[1-9]|1[0-2])\-(0[1-9]|[12]\d|3[01])$/,
				dateDMY: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/([-+]?\d{3}\d+)$/,
				dateMDY: /^(0[1-9]|1[0-2])\.(0[1-9]|[12]\d|3[01])\.([-+]?\d{3}\d+)$/,
				datedmy: /^(0?[1-9]|[12]\d|3[01])\ ([^0-9]+)\ ([-+]?\d{3}\d+)$/i,
				datemdy: /^([^0-9]+)\ (0?[1-9]|[12]\d|3[01])\ ([-+]?\d{3}\d+)$/i,
				time:    /^([01]?\d|2[0-4])\:[0-5]\d(\:[0-5]\d(\.\d{1,3})?)?[zZ]?$/,
				time12:  /^(0?[1-9]|1[0-2])\:[0-5]\d(\:[0-5]\d(\.\d{1,3})?)?\ ?[ap]m$/i,
				month:   /^([-+]?\d{3}\d+)\-(0[1-9]|1[0-2])$/,
				monthMY: /^(0[1-9]|1[0-2])\/([-+]?\d{3}\d+)$/,
				monthmy: /^[^0-9]+[/ ]([-+]?\d{3}\d+)$/i,
				week:    /^([-+]?\d{3}\d+)\-W(0[1-9]|[1-4]\d|5[0-4])?$/i,
				weekWY:  /^(0[1-9]|[1-4]\d|5[0-4])\,\ ([-+]?\d{3}\d+)$/,
				email:   /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
				lang:    /^[a-z]{2,3}(\-[A-Z][a-z]{3})?(\-([A-Z]{2}|[0-9]{3}))?$/,
			}
		},
		/**. ``''boolean'' chars``: Checa se o argumento é um conjunto de caracteres (string).**/
		chars: {
			get: function() {
				return (typeof this._input === "string" || this._input instanceof String);
			}
		},
		/**. ``''boolean'' empty``: Checa se o argumento é um conjunto de caracteres não visualizáveis (string vazia).**/
		empty: {
			get: function() {
				return (this.chars && this._input.trim() === "");
			}
		},
		/**. ``''boolean'' nonempty``: Checa se o argumento é um conjunto de caracteres visualizáveis (string não vazia).**/
		nonempty: {
			get: function() {
				return (this.chars && this._input.trim() !== "");
			}
		},
		/**. ``''boolean'' lang``: Checa se o argumento está no [formato de linguagem](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang).**/
		lang: {
			get: function() {
				return (this.chars && this._re.lang.test(this._input.trim()));
			}
		},
		/**. ``''boolean'' email``: Checa se o argumento é um e-mail ou uma lista desse tipo.**/
		email: {
			get: function() {
				if (!this.chars) return false;
				let data = this._input.split(",")
				let i = -1;
				while (++i < data.length)
					if (!this._re.email.test(data[i].trim())) return false;
				return true;
			}
		},
		/**. ``''boolean'' url``: Checa se o argumento é uma URL válida.**/
		url: {
			get: function() {
				if (!this.chars) return false;
				try {
					let url = new URL(this._input.trim());
					return true;
				} catch(e) {
					return false;
				}
			}
		},
		/**. ``''boolean'' month``: Checa se o argumento está no formato de mês (ver atributo date):
		- ``YYYY-MM`` (padrão)
		- ``MM/YYYY``
		- ``MMM/YYYY``
		- ``MMMM/YYYY``
		- ``MMM YYYY``
		- ``MMMM YYYY``**/
		month: {
			get: function() {
				if (!this.chars) return false;
				let data = this._input.trim();
				if (data.indexOf("  ") >= 0) return false;
				if (this._re.month.test(data))   return true; /* YYYY-MM */
				if (this._re.monthMY.test(data)) return true; /* MM/YYYY */
				if (this._re.monthmy.test(data)) /* MMMM[ /]YYYY */
					return this._getMonths(data.split(/[/ -]/)[0]) !== 0;
				return false;
			}
		},
		/**. ``''boolean'' week``: Checa se o argumento está no formato de semana: ``YYYY-wWW`` (padrão) e ``WW, YYYY``. O valor de ``WW`` é a semana com dois dígitos (01-54).**/
		week: {
			get: function() {
				if (!this.chars) return false;
				let data = this._input.trim();
				if (this._re.week.test(data))   return true;
				if (this._re.weekWY.test(data)) return true;
				return false;
			}
		},
		/**. ``''boolean'' string``: Checa se o argumento é uma string diferente de número, data e tempo.**/
		string: {
			get: function() {
				if (this.type !== null) return this.type === "string";
				if (!this.chars) return false;
				this._type  = "string";
				this._value = String(this._input);
				return true;
			}
		},
		/**. ``''boolean'' number``: Checa se o argumento é um número real (número ou string) ou uma representação de fatorial (string) ou percentual (string).**/
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
				/* Número em forma de String (normal, percentual e fatorial) */
				if (!this.chars) return false;
				let value = this._input.trim();
				if (!this._re.number.test(value)) return false;
				switch(value[value.length-1]) { /* analisar o último caractere */
					case "!": { /* fatorial */
						let mult = Number(value.replace("!", ""));
						value = 1;
						while (mult > 1) value = value * mult--;
						break;
					}
					case "%": { /* percentagem */
						value = Number(value.replace("%", ""))/100;
						break;
					}
					default: { /* normal */
						value = Number(value);
					}
				}
				if (typeof value === "number" && !isNaN(value)) {
					this._type  = "number";
					this._value = value;
					return true;
				}
				return false;
			}
		},
		/**. ``''boolean'' finite``: Checa se o argumento é um número finito.**/
		finite: {
			get: function() {
				return this.number ? isFinite(this.value) : false;
			}
		},
		/**. ``''boolean'' infinite``: Checa se o argumento é um número infinito.**/
		infinite: {
			get: function() {
				return this.number ? !this.finite : false;
			}
		},
		/**. ``''boolean'' integer``: Checa se o argumento é um número inteiro.**/
		integer: {
			get: function() {
				return this.finite ? (this.value%1 === 0) : false;
			}
		},
		/**. ``''boolean'' decimal``: Checa se o argumento é um número decimal.**/
		decimal: {
			get: function() {
				return this.finite ? (this.value%1 !== 0) : false;
			}
		},
		/**. ``''boolean'' positive``: Checa se o argumento é um número positivo.**/
		positive: {
			get: function() {
				return this.number && this.value > 0;
			}
		},
		/**. ``''boolean'' negative``: Checa se o argumento é um número negativo.**/
		negative: {
			get: function() {
				return this.number && this.value < 0;
			}
		},
		/**. ``''boolean'' zero``: Checa se o argumento é zero.**/
		zero: {
			get: function() {
				return this.number && this.value === 0;
			}
		},
		/**. ``''boolean'' boolean``: Checa se o argumento é um valor booleano.**/
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
		/**. ``''boolean'' regexp``: Checa se o argumento é uma expressão regular.**/
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
		/**. ``''boolean'' datetime``: Checa se o argumento é um conjunto data/tempo.
		. Enquadram-se nessa condição o construtor nativo ``Date`` e strings em formato de data e tempo, nos termos da biblioteca, separados por espaço, virgula e espaço ou a letra T (ver atributos ``date`` e ``time``).**/
		datetime: {
			get: function() {
				if (this.type !== null) return this.type === "datetime";
				if (this._input instanceof Date) {
					let input = this._input;
					let D = input.getDate();
					let M = input.getMonth()+1;
					let Y = input.getFullYear();
					let h = input.getHours();
					let m = input.getMinutes();
					let s = input.getSeconds()+(input.getMilliseconds()/1000);
					this._type  = "datetime";
					let time = [
						("0"+String(h)).slice(-2),
						("0"+String(m)).slice(-2),
						(s < 10 ? "0" : "") + String(s)
					].join(":");
					let date = [
						(Y < 0 ? "-" : "")+(Math.abs(Y) > 999 ? String(Math.abs(Y)) : ("000"+String(Math.abs(Y))).slice(-4)),
						("0"+String(M)).slice(-2),
						("0"+String(D)).slice(-2)
					].join("-");
					this._value = date+"T"+time;
					return true;
				}
				/* Data/Tempo em formato de string */
				if (!this.chars) return false;
				let dt = this._input.trim();
				let re = /(\d\d)(T|\,\ |\ )(\d?\d\:)/i;
				if (!re.test(dt)) return false;
				dt = dt.replace(re, "$1T$3").split("T");
				if (dt.length !== 2) return false;
				let date = __Type(dt[0]);
				let time = __Type(dt[1]);
				if (!date.date || !time.time) return false;
				this._type  = "datetime";
				this._value = date.value+"T"+time.value;
				return true;
			}
		},
		/**. ``''boolean'' date``: Checa se o argumento é uma data em formato de string:
		- ``YYYY-MM-DD`` (padrão);
		- ``DD/MM/YYYY``;
		- ``MM.DD.YYYY``;
		- ``D MMM YYYY``;
		- ``MMM D YYYY``;
		- ``D MMMM YYYY``; e
		- ``MMMM D YYYY``.
		|Formato|Valor|Descrição|
		|``YYYY``|Ano|Negativo ou positivo, com, no mínimo, quatro dígitos|
		|``MM``|Mês|Dois dígitos (zero à esquerda se menor que 10)|
		|``MMM``|Mês abreviado|Língua inglesa ou local (ignorando a caixa), conforme objeto nativo ``Date``|
		|``MMMM``|Mês longo|Língua inglesa ou local (ignorando a caixa), conforme objeto nativo ``Date``|
		|``D``|Dia|Um ou dois dígitos (zero à esquerda se menor que 10)|
		|``DD``|Dia|Dois dígitos.|**/
		date: {
			get: function() {
				if (this.type !== null) return this.type === "date";
				if (!this.chars) return false;
				let value = this._input.trim();
				if (value.indexOf("  ") >= 0) return false;
				let order = {
					YMD: {y: 0, m: 1, d: 2},
					DMY: {d: 0, m: 1, y: 2},
					MDY: {m: 0, d: 1, y: 2}
				};
				let ref, data;
				if (this._re.date.test(value)) { /* YYYY-MM-DD */
					data = value.split("-");
					if (data.length > 3) { /* data negativa */
						data.shift();
						data[0] = "-"+data[0];
					}
					ref  = order.YMD;
				} else if (this._re.dateDMY.test(value)) { /* DD/MM/YYYY */
					data = value.split("/");
					ref  = order.DMY;
				} else if (this._re.dateMDY.test(value)) { /* MM.DD.YYYY */
					data = value.split(".");
					ref  = order.MDY;
				} else if (this._re.datedmy.test(value)) { /*D MMM YYYY D MMMM YYYY */
					data = value.split(" ");
					ref  = order.DMY;
					data[1] = this._getMonths(data[1]);
					if (data[1] === 0) return false;
				} else if (this._re.datemdy.test(value)) { /* MMM D YYYY MMMM D YYYY */
					data = value.split(" ");
					ref  = order.MDY;
					data[0] = this._getMonths(data[0]);
					if (data[0] === 0) return false;
				} else {
					return false;
				}
				let d = Number(data[ref.d]);
				let m = Number(data[ref.m]);
				let y = Number(data[ref.y]);
				/* checando dia */
				let feb  = (y%400 === 0 || (y%4 === 0 && y%100 !== 0)) ?  29 : 28;
				let days = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				if (d > days[m-1]) return false;
				let Y    = Math.abs(y);
				let YYYY = (y < 0 ? "-" : "") + (Y < 1000 ? ("000"+String(Y)).slice(-4) : String(Y));
				this._type  = "date";
				this._value = [
					YYYY,
					("0"+data[ref.m]).slice(-2),
					("0"+data[ref.d]).slice(-2)
				].join("-");
				return true;
			}
		},
		/**. ``''boolean'' function``: Checa se o argumento é uma função.**/
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
		/**. ``''boolean'' array``: Checa se o argumento é um array.**/
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
		/**. ``''boolean'' null``: Checa se o argumento é um valor nulo (``null``).**/
		null: {
			get: function () {
				if (this.type !== null) return this.type === "null";
				if (this._input === null) {
					this._type  = "null";
					this._value = null;
					return true;
				}
				return false;
			}
		},
		/**. ``''boolean'' undefined``: Checa se o argumento é um valor indefinido (``undefined``).**/
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
		/**. ``''boolean'' time``: Checa se o argumento é uma string que representa uma unidade de tempo: ``h:mm:ss.sss`` (padrão) e ``h12:mm:ss.sss AMPM``.
		|Formato|Valor|Descrição|
		|``h``|Hora|Um ou dois dígitos (zero à esquerda se menor que 10)|
		|``hh``|Hora|Dois dígitos (zero à esquerda se menor que 10)|
		|``h12``|Hora|Formato de 12h com um ou dois dígitos (zero à esquerda se menor que 10)|
		|``mm``|Minuto| com dois dígitos|
		|``ss``|Segundos|Dois dígitos|
		|``sss``|Decimal dos segundos|Até três dígitos|
		|``AMPM``|Ante meridiem (``am``) ou Post meridiem (``pm``)|Ignora a caixa e pode ser precedido ou não de um espaço.|**/
		time: {
			get: function() {
				if (this.type !== null) return this.type === "time";
				if (!this.chars) return false;
				let value = this._input.trim().replace(/[zZ]$/, "");
				let h, m, s;
				if (this._re.time12.test(value)) { /* h12:mm:ss.sss AMPM */
					let am   = value[value.length - 2].toUpperCase() === "A" ? true : false;
					let time = value.replace(/[^0-9:.]/g, "").split(":");
					h = Number(time[0]);
					h = am ? (h % 12) : (h === 12 ? 12 : ((12 + h ) % 24));
					m = Number(time[1]);
					s = time.length === 3 ? Number(time[2]) : 0;
				} else if (this._re.time.test(value)) { /* h24:mm:ss.sss */
					let time = value.split(":");
					h = Number(time[0]);
					m = Number(time[1]);
					s = time.length === 3 ? Number(time[2]) : 0;
				} else {
					return false;
				}
				h = h%24;
				if (h < 0 || h > 24) return false;
				if (m < 0 || m > 59) return false;
				if (s < 0 || s > 59.999) return false;

				this._type  = "time";
				this._value = [
					String((h < 10 ? "0" : "")+h),
					String((m < 10 ? "0" : "")+m),
					String((s < 10 ? "0" : "")+s)
				].join(":");
				return true;
			}
		},
		/**. ``''boolean'' node``: Checa se o argumento é um elemento HTML ou uma coleção desses (lista).**/
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
				for (let obj in nodes) {
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
		/**. ``''boolean'' object``: Checa se o argumento é um objeto que não se enquadra nas demais categorias.**/
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
		/**. ``''boolean'' file``: Checa se o argumento é do tipo ``File`` proveniente de ``FileList``.**/
		file: {
			get: function() {
				if (this.type !== null) return this.type === "file";
				if (typeof this._input !== "object") return false;
				if (this._input.constructor.name === "File") {
					this._type  = "file";
					this._value = this._input;
					return true;
				}
				return false;
			}
		},
		/**. ``''boolean'' files``: Checa se o argumento é do tipo ``FileList`` não vazio.**/
		files: {
			get: function() {
				if (this.type !== null) return this.type === "files";
				if (typeof this._input !== "object") return false;
				if (this._input.constructor.name === "FileList") {
					this._type  = "files";
					this._value = this._input;
					return true;
				}
				return false;
			}
		},
		/**. ``''void'' _init()``: Analisa o dado e define os parâmetros para execução dos demais atributos.**/
		_init: {
			value: function() {
				if (this._type !== null) return;
				/* IMPORTANTE: object precisa ser o último, pois qualquer um pode ser um objeto */
				/* IMPORTANTE: na verificação de strings, o atributo string deve ser o último */
				let types = this.chars ? [
					"number", "date", "time", "datetime", "string"
				] : [
					"null", "undefined", "boolean", "number", "datetime",
					"array", "node", "regexp", "function", "file", "files", "object"
				];
				let i = -1;
				while (++i < types.length)
					if (this[types[i]]) return;
				/* se não se encaixar em nada: desconhecido */
				this._value = this._input;
				this._type  = "unknow";
				return;
			}
		},
		/**. ``''any''  value``: Retorna o valor do argumento nos parâmetos da biblioteca.
		. Tipos de referência, primitivos, data e tempo retornam valores de referência, valores primitivos e strings no formato ``YYYY-MM-DD`` e ``hh:mm:ss.sss``, respectivamente.**/
		value: {
			get: function() {return this._value;}
		},
		/**. ``''string'' type``: Retorna o tipo do argumento verificado (conforme atributos).**/
		type: {
			get: function() {return this._type;}
		},
		/**. ``''void''  valueOf()``: Retorna o método ``valueOf`` do retorno do atributo ``value`` e, se ``null`` ou ``undefined``, seus respectivos valores.**/
		valueOf: {
			value: function() {
				return this.null || this.undefined ? this._value : (this.value).valueOf();
			}
		},
		/**. ``''string'' toString()``: Retorna o método ``toString`` do retorno do atributo ``value``. Se ``null`` retorna uma string vazia e se ``undefined`` um ponto de interrogação.**/
		toString: {
			value: function() {
				if (this.null) return "";
				if (this.undefined) return "?"
				return this.value.toString();
			}
		}
	});
/*============================================================================*/
	/**### Números
	###### ``**constructor** ''object'' __Number(number input=0)``
	Construtor para manipulação de números. O argumento ``input`` se refere ao número de entrada do construtor.**/
	function __Number(input) {
		if (!(this instanceof __Number)) return new __Number(input);
		let check = __Type(input);
		Object.defineProperties(this, {
			_value:  {value: !check.number ?    0 : check.value},
			_finite: {value: !check.number ? true : check.finite}
		});
	}

	Object.defineProperties(__Number.prototype, {
		constructor: {value: __Number},
		/**. ``''boolean'' finite``: Checa se o número é finito.**/
		finite: {
			get: function() {return this._finite;}
		},
		/**. ``''number'' valueOf()``: Retorna o valor numérico.**/
		valueOf: {
			value: function() {return this._value;}
		},
		/**. ``''number'' toString()``: Retorna o valor em forma de string.**/
		toString: {
			value: function() {
				if (this.finite) return this.valueOf().toString();
				return (this < 0 ? "-" : "+")+"\u221E";
			}
		},
		/**. ``''number'' abs``: Retorna o valor absoluto do número.**/
		abs: {
			get: function() {return Math.abs(this.valueOf());}
		},
		/**. ``''integer'' int``: Retorna a parte inteira do número.**/
		int: {
			get: function() {
				return Math.trunc(this.valueOf());
			}
		},
		/**. ``''float'' dec``: Retorna a parte decimal do número.**/
		dec: {
			get: function() {
				if (!this.finite) return this.valueOf();
				let exp = 1;
				while ((this.valueOf() * exp)%1 !== 0) exp = 10*exp;
				return (exp*this.valueOf() - exp*this.int) / exp;
			}
		},
		/**. ``''number'' round(''integer'' n=3)``: Arredonda o número conforme especificado. O argumento ``n`` define a quantidade de casas decimais.**/
		round: {
			value: function(n) {
				if (!this.finite) return this.valueOf();
				n = __Type(n);
				n = !n.finite ? 3 : (n.negative ? 0 : Math.trunc(n.value));
				return Number(this.valueOf().toFixed(n));
			}
		},
		/**. ``''number'' cut(''integer'' n=3)``: Corta o número de casas decimais conforme especificado sem arrendondar. O argumento opcional ``n`` define a quantidade de casas decimais.**/
		cut: {
			value: function(n) {
				if (!this.finite) return this.valueOf();
				n = __Type(n);
				n = !n.finite ? 3 : (n.negative ? 0 : Math.trunc(n.value));
				let base = 1;
				let i = -1;
				while (++i < n) base = 10*base;
				let value = __Number(base*this.valueOf());
				return value.int/base;
			}
		},
		/**. ``''array'' primes``: Retorna uma lista com os números primos até o valor do objeto.**/
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
		/**. ``''boolean'' prime``: Checa se número é primo.**/
		prime: {
			get: function() {
				if (this < 2 || !this.finite || this.dec !== 0) return false;
				return this.primes.reverse()[0] === this.valueOf() ? true : false;
			}
		},
		/**. ``''string'' frac(''integer'' n=3)``: Retorna a notação numérica em forma de fração. O argumento ``n`` define o limitador de precisão (valores maiores exigem mais processamento).**/
		frac: {
			value: function(n) {
				let int = Math.abs(this.int);
				let dec = Math.abs(this.dec);
				if (!this.finite || dec === 0) return this.toString();
				/* checando argumento limitador */
				n = __Type(n);
				n = !n.finite ? 3 : (n < 1 ? 0 : (n > 5 ? 5 : Math.trunc(n.value)));
				if (n === 0) return String(this.int);
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
		/**. ``''string'' bytes``: Retorna a notação em bytes (de ''B'' a ''YB'').**/
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
		/**. ``''string'' type``: Retorna o tipo do número (zero, infinity, integer, real).**/
		type: {
			get: function() {
				if (this == 0)      return "zero";
				if (!this.finite)   return "infinity";
				if (this.dec === 0) return "integer";
				return "real";
			}
		},
		/**. ``''string'' precision(''integer'' n=3)``: Fixa a quantidade de dígitos significativos.
		. O argumento opcional ``n`` define a quantidade dígitos cujo padrão é três.**/
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
		/**. ``''string'' notation(''string'' type, ''any'' code, ''string'' lang)``: Formata o número em determinada notação ([referência]<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat>).
		. O argumento opcional ``lang`` define o código da linguagem a ser aplicada.
		. O argumento ``type`` define o tipo da formatação e o argumento ``code`` dependerá da notação escolhida, podendo ser um número inteiro, uma string ou não ter efeito.
		|type|Descrição|code|
		|``significant``|Fixa o número de dígitos significativos|Quantidade de significativos|
		|``decimal``|Fixa o número de casas decimais|Número de casas decimais|
		|``integer``|Fixa o número de dígitos inteiros|Número de dígitos inteiros|
		|``percent``|Exibe em notação percentual|Número de casas decimais|
		|``unit``|Exibe o número com unidade de medida|Unidade de medida ([referência]<https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier>)|
		|``scientific``|Exibe em notação científica|Número de casas decimais|
		|``engineering``|Exibe em notação de engenharia|Número de casas decimais|
		|``compact1``|Exibe em notação compacta na forma longa|Sem efeito|
		|``compact2``|Exibe em notação compacta na forma abreviada|Sem efeito|
		|``currency1``|Exibe em notação monetária|Código monetário ([referência]<https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=currency-codes>)|
		|``currency2``|Exibe em notação monetária curta|Código monetário|
		|``currency3``|Exibe em notação monetária textual|Código monetário|
		|``currency4``|Exibe código no lugar da notação monetária|Código monetário|**/
		notation: {
			value: function (type, code, lang) {
				if (!this.finite) return this.toString();
				type      = String(type).toLowerCase();
				lang      = __Type(lang).lang ? lang.trim() : undefined;
				let attr  = type.replace(/\d+/, "");
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
						compactDisplay: type === "compact2" ? "short" : "long"
					},
					currency: {
						style: "currency",
						currency: code,
						signDisplay: "exceptZero",
						currencyDisplay: (
							type === "currency4" ? "code" : (
								type === "currency3" ? "name" : (
									type === "currency2" ? "narrowSymbol" : "symbol"
								)
							)
						)
					}
				};

				try {
					return this.valueOf().toLocaleString(lang, (attr in types ? types[attr] : {}));
				} catch(e) {}
				try {
					return this.valueOf().toLocaleString(undefined, (attr in types ? types[attr] : {}));
				} catch(e) {
					return this.valueOf().toLocaleString();
				}
				return this.toString()
			}
		},
	});
/*===========================================================================*/
	/**### Textos
	###### ``**constructor** ''object'' __String(''string'' input)``
	Construtor para manipulação de textos. O argumento ``input`` define o texto de entrada.**/
	function __String(input) {
		if (!(this instanceof __String)) return new __String(input);
		if (!__Type(input).string) input = String(input);
		Object.defineProperties(this, {
			_value: {value: input}
		});
	}

	Object.defineProperties(__String.prototype, {
		constructor: {value: __String},
		valueOf: {
			value: function() {return this._value;}
		},
		toString: {
			value: function() {return this.clear(true, false);}
		},
		/**. ``''string'' length``: Retorna a quantidade de caracteres.**/
		length: {
			get: function() {return this.valueOf().length;}
		},
		/**. ``''string'' upper``: Retorna caixa alta.**/
		upper: {
			get: function() {return this.valueOf().toUpperCase();}
		},
		/**. ``''string'' lower``: Retorna caixa baixa.**/
		lower: {
			get: function() {return this.valueOf().toLowerCase();}
		},
		/**. ``''string'' toggle``: Inverte a caixa.**/
		toggle: {
			get: function() {
				let list = this._value.split("");
				list.forEach(function(v,i,a) {
					a[i] = v === v.toUpperCase() ? v.toLowerCase() : v.toUpperCase();
				});
				return list.join("");
			}
		},
		/**. ``''string'' captalize``: Primeira letra de cada palavra, apenas, em caixa alta.**/
		capitalize: {
			get: function() {
				let list = this._value.split("");
				list.forEach(function(v,i,a) {
					a[i] = i === 0 || (/\s/).test(a[i-1]) ? v.toUpperCase() : v.toLowerCase();
				});
				return list.join("");
			}
		},
		/**. ``''string'' clear(''boolean'' white=true, ''boolean'' accent=true)``: Limpa espaços desnecessários ou acentos. O argumento ``white`` define a limpeza de espaços extras e o argumento ``accent`` define a remoção dos acentos.**/
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
		/**. ``''string'' mask(''string'' model, ''function'' method)``: Checa se a string casa com o formato de máscara definido e a retorna adequada aos parâmetros especificados. Caso não case, uma string vazia será retornada.
		. O argumento ``model`` define o modelo da máscara conforme caracteres abaixo:
		|Caractere|Descrição|
		|#|Exige um dígito|
		|@|Exige um não dígito|
		|*|Exige um valor qualquer|
		|?|Separa modelos alternativos caso o anterior não case|
		|' (aspóstofro)|Fixa o caractere seguinte sem checar se casa|
		###### Exemplos
		- "##/##/####" (data) casa com "01234567" e retorna "01/23/4567".
		- "(##) # ####-####?(##) ####-####" (telefone) casa com "01234567890", retornando "(01) 2 3456-7890", e casa também com "0123456789" retornando "(01) 2345-6789".
		. O argumento opcional ``method`` define uma função a ser aplicada quando a máscara casa. A função receberá a string formatada como argumento para efetuar checagens mais específicas como, por exemplo, checar se a data informada é válida. A função deverá retornar uma string como resultado e, se falhar, preferencialmente, ser vazia.**/
		mask: {
			value: function(model, method) {
				let input = this._value;
				let code  = {"#": /\d/, "@": /\D/, "*": /./};
				let nline = "\n"+String(Date.now())+"\n";
				let mask, test, c;
				model = String(model).replace(/([^'])\?/, "$1"+nline).split(nline);

				let m = -1;
				while (++m < model.length) {
					c    = 0;
					test = true;
					mask = String(model[m]).split("");
					mask.forEach(function(v,i,a) {
						if (!test) return;
						if (v === "'" && i < (a.length-1)) {
							a[i]   = a[i+1];
							a[i+1] = null;
						} else if (v === null) {
							a[i] = "";
						} else if (v in code) {
							test = code[v].test(input[c]);
							a[i] = test ? input[c] : v;
							c    = c + (test ? 1 : 0);
						} else {
							c = c + (v === input[c] ? 1 : 0);
						}
					});
					test = test && c === input.length;
					if (test) break;
				}
				if (!test) return "";
				let check = __Type(method);
				if (check.function) return method(mask.join(""));
				return mask.join("");
			}
		},
		/**. ``''string'' dash``: Retorna uma string identificadora no formato de traços.**/
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
		/**. ``''string'' camel``: Retorna uma string identificadora no formato de camelCase.**/
		camel: {
			get: function() {
				let value = this.dash.split("-");
				let i = 0;
				while (++i < value.length)
					value[i] = value[i].charAt(0).toUpperCase()+value[i].substr(1);
				return value.join("");
			}
		},
		/**. ``''matrix'' csv(''string'' td="\t", ''string'' tr="\n")``: Retorna uma matriz (array) a partir de uma string no formato [CSV]<https://www.rfc-editor.org/rfc/rfc4180>.
		. Os argumentos ``td`` e ``tr`` definem os caracteres que separam as colunas e as linhas, respectivamente. Se o valor da célula contiver o caractere divisor de coluna ou linha, esse deverá estar cercado por aspas duplas.**/
		csv: {
			value: function(td, tr) {
				td = td === undefined ? "\t" : String(td);
				tr = tr === undefined ? "\n" : String(tr);
				let txt = this._value;
				if (txt[txt.length - 1] !== tr) txt = txt+tr;
				let table = [[]];
				while (txt.indexOf(td) >= 0 || txt.indexOf(tr) >= 0) {
					let add, cut, val, quote, cell, line, col;
					col   = table[table.length - 1];
					quote = (/^\"/).test(txt);
					cell  = txt.indexOf(quote ? "\""+td : td);
					line  = txt.indexOf(quote ? "\""+tr : tr);
					add   = (line < 0 ? Infinity : line) < (cell < 0 ? Infinity : cell);
					cut   = (quote ? "\"" : "")+(add ? tr : td);
					txt   = txt.split(cut);
					val   = quote ? txt[0].replace(/^\"/, "") : txt[0];
					col.push(val);
					txt.shift();
					txt = txt.join(cut);
					if (add && txt !== "") table.push([]);
 				}
 				return table;
			}
		},
		/**. ``''any'' wdValue(''any'' x)``: Recebe o valor do argumento ``x`` e o retorna adequado à necessidade do método ``wdNotation``.**/
		wdValue: {
			value: function(x) {//console.log(x);
				let types = {true: true, false: false, null: null, undefined: undefined};
				let check = __Type(x);
				let array = /^\[(.+)\]$/;
				let regex = /^\/(.+)\/(g|i|gi|ig)?$/;
				if (check.chars) {x = x.trim();}

				if (check.array) {
					let self = this;
					x.forEach(function(v,i,a) {a[i] = self.wdValue(v);});
					return x;
				}
				if (regex.test(x)) {
					x = x.split("/");
					return new RegExp(x[1], x[2]);
				}
				if (x in types)    return types[x];
				if (x === "[]")    return [];
				if (array.test(x)) return this.wdValue(x.replace(array, "$1").split(","));
				if (check.number)  return check.value;

				return x;
			}
		},
		/**. ``''any'' wdNotation``: Retorna o valor informado ou um array de objetos a partir de uma notação particular da biblioteca:
		|Entrada|Descrição|Exemplo|
		|"undefined"|Retorna o valor primitivo ``undefined``||
		|"true"|Retorna o valor primitivo ``true``||
		|"false"|Retorna o valor primitivo ``false``||
		|"null"|Retorna o valor primitivo ``null``||
		|"[str1, true, 3...]"|Retorna um array tendo vírgulas como separador|``["str1", true, 3...]``|
		|"/regexp/"|Retorna uma expressão regular (aceita os complementos ''g'' e ''i'')|``/regexp/``|
		|"nome{valor}"|Retorna um array de objetos.|``[{nome: valor}]``|
		|"nome1{valor1}nome2{valor2}"|Retorna um array de objetos com múltiplos atributos|``[{nome1: valor1, nome2: valor2}]``|
		|"nome1{valor1}&amp;nome2{valor2}"|Retorna um array de objetos cujos itens são separados pelo caracteres &amp;|``[{nome1: valor1}, {nome2: valor2}]``|
		. A notação é limitada, só funcionando nos casos acima tratados.**/
		wdNotation: {
			get: function() {
			/* a{B}c{D}&e{F} => [{a: B, c: D}, {e: F}] IMPORTANTE: regexp não resolve */
				let list   = [{}];
				let data   = this._value.trim();
				let char   = data.split("");
				let open   = 0;
				let key    = 0;
				let name   = [];
				let value  = [];
				let object = false;
				let self   = this;
				char.forEach(function(v,i,a) {
					if (v === "{" && open === 0) { /* define nome */
						name  = name.join("").trim();
						if (name === "") name = "#";
						list[key][name] = undefined;
						open++;
						value = [];
					} else if (v === "}" && open === 1) { /* define valor */
						value = value.join("");
						list[key][name] = self.wdValue(value);
						open--;
						name   = [];
						object = true;
					} else if (v === "&" && open === 0) { /* quebra grupo */
						list.push({});
						key++;
					} else if (open === 0) { /* captura nome */
						name.push(v);
					} else if (open > 0) { /* captura valor */
						if (v === "{" || v === "}") open += v === "{" ? +1 : -1;
						value.push(v);
					}
				});
				return object ? list : this.wdValue(data);
			}
		},
	});

/*===========================================================================*/
	/**### Data e Tempo
	###### ``**constructor** ''object'' __DateTime(''any'' input)``
	Construtor para manipulação de data/tempo. O atributo ``input`` aceita valores do tipo:
	- Data, tempo ou data/tempo nos parâmetros da biblioteca;
	- Numérico correspondendo ao número de segundos desde 0000-01-01T00:00:00.0000 (segundo 0);
	- Objeto contendo a definição de data/tempo por meio de chaves (``year``,``month``, ``day``, ``hour``, ``minute``, ``second``) e seus respectivos valores; e
	- Caso contrário, assumirá o valor de data e tempo atuais.**/
	function __DateTime(input) {
		if (!(this instanceof __DateTime)) return new __DateTime(input);
		let check = __Type(input);
		let type  = check.type;
		let datetime, date, time;
		switch(type) {
			case "time":     {datetime = "0000-01-01T"+check.value; break;}
			case "date":     {datetime = check.value+"T00:00:00";   break;}
			case "datetime": {datetime = check.value;               break;}
			case "number":   {
				if (check.finite) {
					let dt    = __DateTime("0000-01-01T00:00:00");
					dt.second = check.value;
					datetime  = dt.toString();
					break;
				}
			}
			case "object": {
				let keys = {year: 0, month: 1, day: 1, hour: 0, minute: 0, second: 0};
				let dt   = __DateTime(0);
				for (let i in keys) {
					let test = __Type(i in input ? input[i] : keys[i]);
					dt[i]    = test.finite ? test.value : keys[i];
				}
				datetime = dt.toString();
				break;
			}
			default: {
				type = "datetime";
				datetime = __Type(new Date()).value;
			}
		}
		datetime = datetime.split("T");
		date     = datetime[0];
		time     = datetime[1];

		Object.defineProperties(this, {
			_Y: {value: Number(date.slice(0,-6)),  writable: true}, /* ano */
			_M: {value: Number(date.slice(-5,-3)), writable: true}, /* mês */
			_D: {value: Number(date.slice(-2)),    writable: true}, /* dia */
			_h: {value: Number(time.slice(0,2)),   writable: true}, /* hora */
			_m: {value: Number(time.slice(3,5)),   writable: true}, /* minutos */
			_s: {value: Number(time.slice(6)),     writable: true}, /* segundos */
			_change: {value: null, writable: true}, /* disparador do evento alteração */
			_print: {value: null, writable: true}, /* retrato dos parâmetros */
			_field: {value: null, writable: true}, /* parâmetro que chamou o disparador */
			//_change: {value: function(x){console.log(x);}}, //FIXME apagar isso
		});
	}

	Object.defineProperties(__DateTime.prototype, {
		constructor: {value: __DateTime},
		/**. ``''void'' _trigger(''string'' field)``: Método que aciona o disparador nas mudanças dos parâmetros de data e tempo. O atributo ``field`` identifica o parâmetro que solicita a demanda.
		. O disparador receberá como argumento um __objeto__ com as seguintes chaves:
		.. ``''object'' target``: O objeto ``__DateTime``.
		.. ``''string'' field``: Nome do parâmetro alterado.
		.. ``''number'' old``: Valor anterior do campo.
		.. ``''number'' new``: Valor atual do campo.**/
		_trigger: {
			value: function (field) {
				if (this._change === null) {
					return;
				} else if (this._field === null) {
					this._print = {year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0};
					this._field = field;
					for (let i in this._print) this._print[i] = this[i];
				} else if (this._field === field) {
					for (let i in this._print)
						if (this._print[i] !== this[i]) this._change({
							target: this, field: i, old: this._print[i], new: this[i]
						});
					this._field = null;
					this._print = null;
				}
				return;
			}
		},
		/**. ``''object'' _names``: Atributo que registra a lista com os nomes curtos e longos de meses e dias da semana localmente a partir do objeto nativo ``Date``.
		.. ``MMM``: lista de meses curtos (Janeiro a Dezembro);
		.. ``MMMM``: lista de meses longos (Janeiro a Dezembro);
		.. ``DDD``: lista de dias curtos (Domingo a Sábado);
		.. ``DDDD``: lista de dias longos (Domingo a Sábado).**/
		_names: {
			value: (function() {
				let data = {MMM: [], MMMM: [], DDD: [], DDDD: []};
				let date = new Date(2012,0,1,12,0,0,0);
				let week = new Date(2012,0,1,12,0,0,0);
				for (let i = 0; i < 12; i++) {
					date.setMonth(i);
					data.MMM.push( date.toLocaleDateString(undefined, {month: "short"}));
					data.MMMM.push(date.toLocaleDateString(undefined, {month: "long"}));
					if (i > 0 && i < 8) {
						week.setDate(i);
						data.DDD.push( week.toLocaleDateString(undefined, {weekday: "short"}));
						data.DDDD.push(week.toLocaleDateString(undefined, {weekday: "long"}));
					}
				}
				return data;
			}())
		},
		/**. ``''boolean'' _leap(''integer'' y=year)``: Método que retorna se o ano é bissexto. O atributo ``y`` define o ano que, se indefinido, assumirá o ano registrado pelo objeto.**/
		_leap: {
			value: function(y) {
				y = Math.abs(y === undefined ? this.year : y);
				return (y%400 === 0 || (y%4 === 0 && y%100 !== 0));
			}
		},
		/**. ``''integer'' _maxDay(''integer'' m=month, ''integer'' y=year)``: Método que retorna a quantidade de dias do mês.
		. Os atributos ``m`` e ``y`` correspondem ao mês e ao ano e que, se indefinidos, assumirão o mês o e ano registrados pelo objeto, respectivamente.**/
		_maxDay: {
			value: function(m, y) {
				if (m === undefined) m = this.month;
				if (y === undefined) y = this.year;
				let fev = this._leap(y) ? 29 : 28;
				let max = [31, fev, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				return max[m-1];
			}
		},
		/**. ``''integer'' _weekDay(''integer'' x=dateOf())``: Retorna o dia da semana (1-7), de domingo à sábado, tendo como referência o dia desde 0000-01-01.
		. O atributo opcional ``x`` define o valor de referência do dia a ser analisado que, se indefinido, assumirá o valor do método ``dateOf``.**/
		_weekDay: {
			value: function(x) {
				/* dias positivos: +0000-01-01, dia 1, é sábado (7) (crescente) */
				/* dias negativos: -0001-12-31, dia 0, é sexta-feira (6) (decrescente) */
				if (x === undefined) x = this.dateOf();
				let wday = x > 0 ? [6, 7, 1, 2, 3, 4, 5] : [6, 5, 4, 3, 2, 1, 7];
				return wday[Math.abs(x)%7];
			}
		},
		/**. ``''integer'' year``: Define ou retorna o ano.**/
		year: {
			get: function() {return this._Y;},
			set: function(x) {
				let check = __Type(x);
				if (!check.finite || check.value === this.year) return;
				this._trigger("year");
				let val = __Number(check.value);
				let int = val.int;
				let dec = Math.abs(val.dec);
				this._Y = int;
				if (dec !== 0) this.month = 12*dec;
				return this._trigger("year");
			}
		},
		/**. ``''integer'' month``: Define ou retorna o mês de 1 a 12 (janeiro a dezembro). O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites. (**Observação**: ao alterar o mês de 2000-01-31 para fevereiro, a data definida será 2000-02-29 e não 2000-03-02)**/
		month: {
			get: function() {return this._M;},
			set: function(x) {
				let check = __Type(x);
				if (!check.finite || check.value === this.month) return;
				this._trigger("month");
				let val    = __Number(check.value);
				let int    = val.int;
				let dec    = Math.abs(val.dec);
				this._M    = int%12 <= 0 ? (int%12+12) : (int%12);
				this.year += Math.trunc(int < 1 ? (int-12)/12 : (int-1)/12);
				if (dec !== 0) this.day = dec*this._maxDay();
				return this._trigger("month");
			}
		},
		/**. ``''integer'' day``: Define ou retorna o dia de 1 a 31. O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites. (**Observação**: Quando o dia de um mês for maior que a quantidade de dias do mês alterado, o valor ficará limitado ao último dia e, ao acrescentar unidades de mês à data 2000-01-31, por exemplo, o resultado será 2000-02-29, 2000-03-31, 2000-04-30, 2000-05-31...**/
		day: {
			get: function() {return this._D > this._maxDay() ? this._maxDay() : this._D;},
			set: function(x) {
				let check = __Type(x);
				if (!check.finite || check.value === this.day) return;
				this._trigger("day");
				let val     = __Number(check.value);
				let int     = val.int;
				let dec     = Math.abs(val.dec);
				if (int >= 1 && int <= this._maxDay()) {
					this._D = int;
				} else {
					this._D     = int < 1 ? 1 : this._maxDay();
					let delta   = int - this._D;
					let future  = this.dateOf() + delta;
					/* aproximação anual */
					this.year  += Math.trunc((future - this.dateOf())/365);
					/* aproximação mensal */
					this.month += Math.trunc((future - this.dateOf())/30);
					/* aproximação diária */
					while (this.dateOf() !== future) {
						this._D += this.dateOf() < future ? +1 : -1;
						if (this._D > this._maxDay()) { /* IMPORTANTE: definir dia antes do mês */
							this._D = 1;
							this.month++;
						} else if (this._D < 1) { /* IMPORTANTE: definir mês antes do dia */
							this.month--;
							this._D = this._maxDay();
						}
					}
				}
				if (dec !== 0) this.hour = 24*dec;
				return this._trigger("day");
			}
		},
		/**. ``''integer'' hour``: Define ou retorna a hora (0 a 23). O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites.**/
		hour: {
			get: function() {return this._h;},
			set: function(x) {
				let check = __Type(x);
				if (!check.finite || check.value === this.hour) return;
				this._trigger("hour");
				let val     = __Number(check.value);
				let int     = val.int;
				let dec     = Math.abs(val.dec);
				this._h     = (int%24 < 0 ? 24 : 0) + int%24;
				this.day   += Math.trunc(int/24) + (val < 0 && int%24 !== 0 ? -1 : 0);
				if (dec !== 0) this.minute = 60*dec;
				return this._trigger("hour");
			}
		},
		/**. ``''integer'' minute``: Define ou retorna o minuto de 0 a 59. O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites.**/
		minute: {
			get: function() {return this._m;},
			set: function(x) {
				let check = __Type(x);
				if (!check.finite || check.value === this.minute) return;
				this._trigger("minute");
				let val    = __Number(check.value);
				let int    = val.int;
				let dec    = Math.abs(val.dec);
				this._m    = (int%60 < 0 ? 60 : 0) + int%60;
				this.hour += Math.trunc(int/60) + (val < 0 && int%60 !== 0 ? -1 : 0);
				if (dec !== 0) this.second = 60*dec;
				return this._trigger("minute");
			}
		},
		/**. ``''number'' second``: Define ou retorna o segundo de 0 a 59.999. O parâmetro será alterado para o valor definido, exceto quando extrapolar o limites.**/
		second: {
			get: function() {return this._s;},
			set: function(x) {
				let check = __Type(x);
				if (!check.finite || check.value === this.second) return;
				this._trigger("second");
				let val      = __Number(check.value);
				let int      = val.int;
				let dec      = Math.abs(val.dec);
				this._s      = (int%60 < 0 ? 60 : 0) + int%60 + dec;
				this.minute += Math.trunc(int/60) + (val < 0 && int%60 !== 0 ? -1 : 0);
				return this._trigger("second");
			}
		},
		/**. ``''boolean'' leap``: Informa se o ano definido é bissexto.**/
		leap: {get: function() {return this._leap();}},
		/**. ``''integer'' dayYear``: Informa o dia do ano (1-366).**/
		dayYear: {
			get: function() {
				let days = [0,31,59,90,120,151,181,212,243,273,304,334,365];
				let leap = this.leap && this.month > 2 ? 1 : 0;
				return days[this.month-1] + leap + this.day;
			}
		},
		/**. ``''integer'' weekDay``: Retorna o dia da semana de domingo (1) à sábado (7).**/
		weekDay: {
			get: function() { return this._weekDay();}
		},
		/**. ``''integer'' week``: Retorna a semana do ano (1-54) a partir de seu primeiro dia.**/
		week: {
			get: function() {
				let start = this._weekDay(this.dateOf() - this.dayYear + 1);
				let today = this.weekDay;
				let day0  = 1 - (start - 1);
				let dayn  = this.dayYear - (today - 1);
				return 1+(dayn - day0)/7;
			}
		},
		/**. ``''boolean'' workingDay``: Retorna se é um dia útil.**/
		workingDay: {
			get: function() {return this.weekDay !== 1 && this.weekDay !== 7;}
		},
		/**. ``''integer'' nonWorkingDays``: Retorna a quantidade de dias não úteis atá a data no ano.**/
		nonWorkingDays: {
			get: function() {
				let start = this._weekDay(this.dateOf() - this.dayYear + 1);
				let today = this.weekDay;
				let weeks = this.week;
				let day1  = weeks - (start === 1 ? 0 : 1);
				let day7  = weeks - (today === 7 ? 0 : 1);
				return day1 + day7;
			}
		},
		/**. ``''integer'' width``: Retorna a quantidade de dias no mês.**/
		width: {
			get: function() {return this._maxDay();}
		},
		/**. ``''integer'' workingDays``: Retorna a quantidade de dias úteis atá a data no ano.**/
		workingDays: {
			get: function() {
				return this.dayYear - this.nonWorkingDays;
			}
		},
		/**. ``''string'' Y``: Retorna o ano.**/
		Y:    {get: function() {return String(this.year);}},
		/**. ``''string'' YY``: Retorna o ano com os dois últimos dígitos.**/
		YY:   {
			get: function() {
				return this.YYYY.replace(/\d+(\d\d)$/, "$1");
			}
		},
		/**. ``''string'' YYYY``: Retorna o ano com pelo menos quatro dígitos.**/
		YYYY: {
			get: function() {
				let YYYY = String(Math.abs(this.year));
				if (YYYY.length < 4) YYYY = ("000"+YYYY).slice(-4);
				return (this.year < 0 ? "-" : "")+YYYY;
			}
		},
		/**. ``''string'' M``: Retorna o mês.**/
		M:    {get: function() {return String(this.month);}},
		/**. ``''string'' MM``: Retorna o mês com dois dígitos.**/
		MM:   {get: function() {return ("0"+this.M).slice(-2);}},
		/**. ``''string'' MMM``: Retorna o nome abreviado do mês.**/
		MMM:  {get: function() {return this._names.MMM[this.month-1];}},
		/**. ``''string'' MMMM``: Retorna o nome do mês.**/
		MMMM: {get: function() {return this._names.MMMM[this.month-1];}},
		/**. ``''string'' D``: Retorna o dia.**/
		D:    {get: function() {return String(this.day);}},
		/**. ``''string'' DD``: Retorna o dia com dois dígitos.**/
		DD:   {get: function() {return ("0"+this.D).slice(-2);}},
		/**. ``''string'' DDD``: Retorna o dia da semana abreviado.**/
		DDD:  {get: function() {return this._names.DDD[this.weekDay-1];}},
		/**. ``''string'' DDDD``: Retorna o dia da semana.**/
		DDDD: {get: function() {return this._names.DDDD[this.weekDay-1];}},
		/**. ``''string'' W``: Retorna a semana do ano (atributo ``week``).**/
		W:   {get: function() {return String(this.week);}},
		/**. ``''string'' WW``: Retorna a semana do ano com dois dígitos (atributo ``week``).**/
		WW:   {get: function() {return ("0"+this.W).slice(-2);}},
		/**. ``''string'' h``: Retorna a hora.**/
		h:    {get: function() {return String(this.hour);}},
		/**. ``''string'' hh``: Retorna o a hora com dois dígitos.**/
		hh:   {get: function() {return ("0"+this.h).slice(-2);}},
		/**. ``''string'' m``: Retorna o minuto.**/
		m:    {get: function() {return String(this.minute);}},
		/**. ``''string'' mm``: Retorna o minuto com dois dígitos.**/
		mm:   {get: function() {return ("0"+this.m).slice(-2);}},
		/**. ``''string'' s``: Retorna o segundo.**/
		s:    {get: function() {return (this.second).toFixed(3);}},
		/**. ``''string'' ss``: Retorna o segundo com dois dígitos.**/
		ss:   {
			get: function() {
				return Math.trunc(this.second) < 10 ? ("0"+this.s) : this.s;
			}
		},
		/**. ``''string'' AMPM``: Retorna ``AM`` se a hora for anterior ao meio dia, caso contrário, ``PM``.**/
		AMPM: {
			get: function() {return this.hour < 12 ? "AM" : "PM";}
		},
		/**. ``''string'' h12``: Retorna a hora no formato 12h.**/
		h12: {
			get: function() {
				return ("0" + String(this.hour - (this.hour < 13 ? 0 : 12))).slice(-2);
			}
		},
		/**. ``''integer'' maxWeekForm``: Retorna a quantidade de semanas do ano para fins do [fomulário HTML ``week``]<https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#week_strings>.**/
		maxWeekForm: {
			get: function() {
				let week = this._weekDay(this.dateOf() - this.dayYear + 1);
				return (week === 5 || (week === 4 && this.leap)) ? 53 : 52;
			}
		},
		/**. ``''string'' format(''string'' x)``: Retorna uma string pré-formatada com valores dos atributos sendo representados por atalhos correspondentes ao nome do respectivo atributo entre chaves ``{nome}``. O argumento ``x`` deve conter as configurações da string a ser retornada (**Exemplo**: ``{DD}/{MM}/{YYYY}`` returna a data no formato ``DD/MM/YYYY``).**/
		format: {
			value: function(x) {
				x = __Type(x).chars ? x: "{DDDD}, {D} {MMMM} {YYYY}, {h}:{mm}:{ss}";
				let obj  = this;
				let data = x.match(/\{\w+\}/gi);
				if (data === null) return x;
				data.forEach(function(v,i,a){
					let id = v.replace("{", "").replace("}", "");
					if (id in obj && !__Type(obj[id]).function)
						x = x.replace(v, obj[id]);
				});
				return x;
			}
		},
		/**. ``''function'' onchange``: Define um disparador para ser chamado quando houver mudanças nos parâmetros de data e tempo. Para removê-lo, deve-se definí-lo com o valor ``null``.**/
		onchange: {
			set: function(x) {
				if (!__Type(x).function && x !== null) return;
				this._change = x;
			}
		},
		/**. ``''integer'' timeOf()``: Retorna o tempo em segundos.**/
		timeOf: {
			value: function() {
				return 3600*this.hour + 60*this.minute + this.second;
			}
		},
		/**. ``''string'' toTimeString()``: Retorna o tempo no formato ``hh:mm:ss.sss``.**/
		toTimeString: {
			value: function() {
				return this.format("{hh}:{mm}:{ss}");
      }
		},
		/**. ``''integer'' dateOf()``: Retorna os dias desde 0000-01-01 (dia 1).**/
		dateOf: {
			value: function() {
				/* se o ano for zero: dias do ano corrente */
				if (this.year === 0) return this.dayYear;
				/* se o ano for diferente de zero, calcular dias de anos completos (ano - 1) */
				let year = Math.abs(this.year) - 1;
				let y365 = 365*year;
				let y400 = Math.trunc(year/400);
				let y004 = Math.trunc(year/4);
				let y100 = Math.trunc(year/100);
				let days = y365 + y400 + y004 - y100;
				/* se o ano for positivo: dias do ano zero + dias de anos completos + dias do ano corrente */
				if (this.year >= 0) return 366 + days + this.dayYear;
				/* se o ano for negativo: dias de anos completos + (dias total do ano - dias do ano corrente) */
				return -(days + ((this.leap ? 366 : 365) - this.dayYear));
			}
		},
		/**. ``''string'' toDateString()``: Retorna a data no formato ``YYYY-MM-DD``.**/
		toDateString: {
			value: function() {
				return this.format("{YYYY}-{MM}-{DD}");
      }
		},
		/**. ``''string'' toString()``: Retorna a data e o tempo no formato ``YYYY-MM-DDThh:mm:ss.sss``.**/
		toString: {
			value: function() {
				return this.toDateString()+"T"+this.toTimeString();
      }
		},
		/**. ``''integer'' valueOf()``: Retorna os segundos desde 0000-01-01T00:00:00.**/
		valueOf: {
			value: function() {
				let date = this.dateOf();
				let time = this.timeOf();
				if (date >= 1)
					return 24*3600*(date-1)+time;
				return 24*3600*date - (24*3600 - time);
      }
		},
		/**. ``''string'' testDrive(''integer'' x=100)``: checa a sequencialidade dos dias e dos dias da semana. O atributo ``x`` define o o ciclo da simulação em anos, do negativo ao positivo (dobra).**/
		testDrive: {
			value: function(x) {
				/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date */
				x = (x === undefined ? 100 : Math.abs(x))*365*24*3600;
				let min = __DateTime(-x);
				let max = __DateTime(+x);
				let i   = min.dateOf();
				let w   = min.weekDay;
				let ni  = min.dateOf();
				let nf  = max.dateOf();
				console.log({min: min.toDateString(), max: max.toDateString()});
				while (min < max) {
					if (i !== min.dateOf()) throw new Error("dateOf: "  + min.toString());
					if (w !== min.weekDay)  throw new Error("weekDay: " + min.toString());
					min.day++;
					i++;
					w = w === 7 ? 1 : (w+1);
				}
				console.log({min: min.toDateString(), max: max.toDateString()});
				return "Sucesso!"
			}
		}
	});

/*===========================================================================*/
	/**### Listas
	###### ``**constructor** ''object'' __Array(array input|void  ...)``
	Construtor para manipulação de listas (array).
	Caso não seja informado argumento, seja atribuído uma lista vazia. Caso seja informado múltiplos argumentos, cada valor corresponderá a um item do array. Caso seja informado um array como argumento, esse será o valor considerado pelo objeto. Caso contrário, o valor informado será o item do array.
	{**/
	function __Array() {
		let input;
		if (arguments.length === 0)
			input = [];
		else if (arguments.length > 1)
			input = Array.prototype.slice.call(arguments)
		else
			input = __Type(arguments[0]).array ? arguments[0] : [arguments[0]];

		if (!(this instanceof __Array))	return new __Array(input);
		Object.defineProperties(this, {
			_value: {value: input, writable: true}
		});
	}

	Object.defineProperties(__Array.prototype, {
		constructor: {value: __Array},
		/**. ``array|void  valueOf(integer n)``: Retorna o array definido ou um de seus itens.
		. O argumento opcional ``n`` corresponde ao índice da lista que se comporta conforme o retorno do método ``index``.**/
		valueOf: {
			value: function(n) {
				if (arguments.length === 0) return this._value;
				return this._value[this.index(n)];
			}
		},
		/**. ``''integer'' index(integer n=0)``: Retorna o índice do array, dentro de seu comprimento, como se repetidas listas estivessem lado a lado.
		. O argumento ``n`` define o valor do índice. Tendo como exemplo um array de três elementos, o conjunto de (``n``, ``index``) teria como resultado  ''{..., (-7, 2), (-6, 0), (-5, 1), (-4, 2), (-3, 0), (-2, 1), (-1, 2), (0, 0), (1, 1), (2, 2), (3, 0), (4, 1), (5, 2), (6, 0), (7, 1), ...}''.**/
		index: {
			value: function(n) {
				let data = __Type(n);
				n = data.finite ? Math.trunc(data.value) : 0;
				return (Math.abs(n)*this.length + n)%this.length;
			}
		},
		/**. ``''string''  toString()``: Retorna a lista em formato JSON.**/
		toString: {
			value: function() {return JSON.stringify(this._value);}
		},
		/**. ``''integer'' length``: Retorna a quantidade de itens da lista.**/
		length: {
			get: function() {return this._value.length;}
		},
		/**. ``''array'' only(string type, boolean keep=false, boolean change=true)``: Retorna uma lista somente com os tipos de itens definidos.
		. O argumento ``type`` define o tipo do item a ser mantido na lista (ver atributos do objeto ``__Type``).
		. O argumento ``keep``, se verdadeiro, manterá na lista o item não enquadrado no tipo definido com o valor ``null``.
		. O argumento ``change``, se verdadeiro, alterará o item casado para o valor (``valueOf``) do objeto ``__Type``.**/
		only: {
			value: function(type, keep, change) {
				let list   = [];
				let i = -1;
				while (++i < this.length) {
					let check = __Type(this._value[i]);
					if (check[type] === true)
						list.push(change === false ? this._value[i] : check.valueOf());
					else if (keep === true)
						list.push(null);
				}
				return list;
			}
		},
		/**. ``''array'' convert(function f, string type)``: Retorna uma lista com o resultado de ``f(x)`` ou ``null`` se algo falhar.
		. O argumento ``f`` corresponde à função a ser aplicada aos itens da lista. O item da lista será o argumento da função cujo retorno substituirá o valor do item. O argumento opcional ``type`` informa o tipo do resultado esperado de acordo com o método ``__Type`` que, se diferente, devolverá um valor nulo.**/
		convert: {
			value: function(f, type) {
				if (!__Type(f).function) return null;
				let list = this._value.slice();
				list.forEach(function(v,i,a) {
					try {
						let value = f(v);
						let check = __Type(value);
						if (__Type(type).chars && type in check)
							a[i] = check[type] ? check.value : null;
						else
							a[i] = value;
					} catch(e) {
						a[i] = null;
					}
				});
				return list;
			}
		},
		/**. ``''number'' min``: Retorna o menor número finito do conjunto de items da lista ou ``null`` em caso de vazio.**/
		min: {
			get: function() {
				let list = this.only("finite");
				return list.length === 0 ? null : Math.min.apply(null, list);
			}
		},
		/**. ``''number'' max``:  Retorna o maior número finito do conjunto de items da lista ou ``null`` em caso de vazio.**/
		max: {
			get: function() {
				let list = this.only("finite");
				return list.length === 0 ? null : Math.max.apply(null, list);
			}
		},
		/**. ``''number'' sum``: Retorna a soma dos números finitos da lista ou ``null`` em caso de vazio.**/
		sum: {
			get: function() {
				let list = this.only("finite");
				if (list.length === 0) return null;
				let sum  = 0;
				list.forEach(function(v,i,a) {sum += v;});
				return sum;
			}
		},
		/**. ``''number'' avg``: Retorna a média dos números finitos da lista ou ``null`` em caso de vazio.**/
		avg: {
			get: function() {
				let list = this.only("finite");
				return list.length === 0 ? null : this.sum/list.length;
			}
		},
		/**. ``''number'' med``: Retorna a mediana dos números finitos da lista ou ``null`` em caso de vazio.**/
		med: {
			get: function() {
				let list = this.only("finite");
				if (list.length === 0) return null;
				let y    = list.sort(function(a,b) {return a < b ? -1 : 1;});
				let l    = list.length;
				return l%2 === 0 ? (y[l/2]+y[(l/2)-1])/2 : y[(l-1)/2];
			}
		},
		/**. ``''number'' harm``: Retorna a média harmônica dos números finitos diferentes de zero da lista ou ``null`` em caso de vazio.**/
		harm: {
			get: function() {
				let list = this.only("finite");
				let sum  = 0;
				list.forEach(function (v,i,a) {sum += v === 0 ? 0 : 1/v;});
				return list.length === 0 || sum === 0 ? null : list.length/sum;
			}
		},
		/**. ``''number'' geo``: Retorna a média geométrica do valor absoluto dos números finitos diferentes de zero da lista ou ``null`` em caso de vazio.**/
		geo: {
			get: function() {
				let list = this.only("finite");
				let mult = list.length === 0 ? -1 : 1;
				list.forEach(function (v,i,a) {mult = mult * (v === 0 ? 1 : v);});
				return mult < 0 && list.length%2 === 0 ? null : Math.pow(mult, 1/list.length);
			}
		},
		/**. ``''number'' gcd``: Retorna o máximo divisor comum do valor absoluto dos números inteiros da lista ou ``null`` em caso de vazio.**/
		gcd: {
			get: function() {
				/* obtendo valores absolutos inteiros */
				let input =  this.only("finite");
				input.forEach(function(v,i,a) {a[i] = Math.trunc(Math.abs(v));});
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
		/**. ``''array'' unique``: Retorna a lista sem valores repetidos.**/
		unique: {
			get: function(){
				return this._value.filter(function(v,i,a) {return a.indexOf(v) === i;});
			}
		},
		/**. ``''array'' mode``: Retorna uma lista com os valores da moda (valores que mais se repetem).**/
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
		/**. ``''boolean'' check(void  ...)``: Checa se os valores informados como argumento estão presentes na lista.**/
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
		/**. ``''array'' search(void  value)``: Retorna uma lista com os índices onde o valor informado no argumento ``value`` foi localizado.**/
		search: {
			value: function(value) {
				let index = [];
				this._value.forEach(function (v,i,a){if (v === value) index.push(i);});
				return index;
			}
		},
		/**. ``''array'' hide(void  ...)``: Retorna uma lista ignorando os valores informados como argumento.**/
		hide: {
			value: function() {
				let hide = Array.prototype.slice.call(arguments);
				return this._value.filter(function(v,i,a) {return hide.indexOf(v) < 0;});
			}
		},
		/**. ``''number'' count(void  value)``: Retorna a quantidade de vezes que o valor informado no argumento ``value`` aparece na lista.**/
		count: {
			value: function(value) {
				return this.search(value).length;
			}
		},
		/**. ``''array'' sort(boolean asc)``: Retorna a lista ordenada e organizada por grupos na seguinte sequência: número, tempo, data, datatempo, texto, booelano, nulo, nós, lista, objeto, função, expressão regular, indefinido e demais valores.
		. O argumento opcional ``asc`` define a classificação da lista. Se verdadeiro, ascendente; se falso, descendente; e, se omitido, inverterá a ordenação atual com prevalência da ordem ascendente.**/
		sort: {
			value: function(asc) {
				let order = [
					"number", "time", "date", "datetime", "string", "boolean", "null", "node",
					"array", "object", "function", "regexp", "undefined", "unknown"
				];
				let data  = __Type(asc);
				let array = this._value.slice();
				asc = data.boolean ? data.value : null;
				array.sort(function(a, b) {
					let A = __Type(a);
					let B = __Type(b);
					/* comparação entre tipos diferentes */
					if (A.type !== B.type)
						return order.indexOf(A.type) > order.indexOf(B.type) ? 1 : -1;
					/* comparação entre tipos iguais */
					let avalue = a;
					let bvalue = b;
					if (A.node) {
						let node1 = __Node(a).text;
						let node2 = __Node(b).text;
						let array = __Array(node1, node2).sort(true);
						return array[1] === node1 ? 1 : -1;
					}
					if (A.number || A.boolean) {
						avalue = A.valueOf();
						bvalue = B.valueOf();
					} else if (A.date || A.time || A.datetime) {
						avalue = __DateTime(A.value).valueOf();
						bvalue = __DateTime(B.value).valueOf();
					} else if (A.string) {
						avalue = __String(a.toLowerCase()).clear().trim();
						bvalue = __String(b.toLowerCase()).clear().trim();
					}
					return avalue > bvalue ? 1 : -1;
				});
				if (asc === true)  return array;
				if (asc === false) return array.reverse();
				let i = -1;
				while (++i < array.length)
					if (array[i] !== this._value[i]) return array;
				return array.reverse();
			}
		},
		/**. ``''array'' order``: Retorna uma lista ordenada de forma crescente sem valores repetidos.**/
		order: {
			get: function() {
				return __Array(this.unique).sort();
			}
		},
		/**. ``''array'' add(void  ...)``: Adiciona itens (argumentos) ao fim da lista e a retorna.**/
		add: {
			value: function() {
				this._value.push.apply(this._value, arguments);
				return this._value;
			}
		},
		/**. ``''array'' jump(void  ...)``: Adiciona itens (argumentos) ao início da lista e a retorna.**/
		jump: {
			value: function() {
				this._value.unshift.apply(this._value, arguments);
				return this._value;
			}
		},
		/**. ``''array'' put(void  ...)``: Adiciona itens (argumentos) não existentes ao fim da lista e a retorna.**/
		put: {
			value: function() {
				let i = -1;
				while (++i < arguments.length)
					if (!this.check(arguments[i]))
						this.add(arguments[i]);
				return this._value;
			}
		},
		/**. ``''array'' concat(array|void ...)``: Concatena ou adiciona listas e itens (argumentos) à lista original.**/
		concat: {
			value: function() {
				this._value = this._value.concat.apply(this._value, arguments);
				return this._value;
			}
		},
		/**. ``''array'' replace(void  from, void  to)``: Altera os valores da lista conforme especificado e a retorna.
		. O argumento ``from`` definie o valor a ser encontrado e substituído na lista e o argumento ``to`` define seu novo valor.**/
		replace: {
			value: function (from, to) {
				this._value.forEach(function(v,i,a) {if (v === from) a[i] = to;});
				return this._value;
			}
		},
		/**. ``''array'' delete(void ...)``: Remove itens (argumentos) da lista e a retorna.**/
		delete: {
			value: function() {
				let list = this.hide.apply(this, arguments);
				while(this._value.length !== 0) this._value.pop();
				this.add.apply(this, list);
				return this._value;

			}
		},
		/**. ``''array'' toggle(void  ...)``: Remove, se existente, ou insere, se ausente, itens (argumentos) da lista e a retorna.**/
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
	});

/*============================================================================*/
	/**### Nós HTML
	###### ``**constructor** ''object'' __Node(node input)``
	Construtor para manipulação de nós HTML.
	O argumento ``input`` deve ser um nó HTML simples (um elemento), caso contrário será atribuído um elemento ``DIV``.**/
	function __Node(input) {
		if (!(this instanceof __Node))	return new __Node(input);
		let check = __Type(input);
		Object.defineProperties(this, {
			_node: {value: check.node ? check.value[0] : document.createElement("DIV")}
		});
	}

	Object.defineProperties(__Node.prototype, {
		constructor: {value: __Node},
		/**. ``''string'' _text``: Retorna ou define o conteúdo textual do elemento (``textContent``).**/
		_text: {
			get: function()  {return this._node.textContent;},
			set: function(x) {this._node.textContent = x;}
		},
		/**. ``''any'' _value``: Retorna ou define o valor do elemento HTML (``value``).**/
		_value: {
			get: function()  {return this._node.value;},
			set: function(x) {this._node.value = x;}
		},
		/**. ``''number'' _number``: Retorna ou define o valor numérico do formulário HTML.**/
		_number: {
			get: function()  {
				let data = __Type(this._value);
				return data.finite ? data.value : "";
			},
			set: function(x) {
				let data = __Type(x);
				this._value = data.finite ? data.valueOf() : null;
			}
		},
		/**. ``''string'' _time``: Retorna ou define o valor temporal do formulário HTML (hora:minuto).**/
		_time: {
			get: function()  {
				let data = __Type(this._value);
				return data.time ? data.toString() : "";
			},
			set: function(x) {
				let data = __Type(x);
				if (data.time) {
					let dt = __DateTime(x);
					this._value = dt.format("{hh}:{mm}")
				} else {
					this._value = null;
				}
			}
		},
		/**. ``''string'' _date``: Retorna ou define o valor de data do formulário HTML (ano &gt; 0).**/
		_date: {
			get: function()  {
				let data = __Type(this._value);
				return data.date ? data.toString() : "";
			},
			set: function(x) {
				let data = __Type(x);
				if (data.date) {
					let dt = __DateTime(x);
					this._value = dt.year < 1 ? null : dt.toDateString();
				} else {
					this._value = null;
				}
			}
		},
		/**. ``''string'' _datetime``: Retorna ou define o valor de data/tempo do formulário HTML (hora:minuto, ano &gt; 0).**/
		_datetime: {
			get: function()  {
				let data = __Type(this._value);
				if (data.time || data.datetime || data.date) {
					return __DateTime(data.toString()).toString();
				}
				return "";
			},
			set: function(x) {
				let data = __Type(x);
				if (data.datetime || data.time || data.date) {
					let now  = __DateTime();
					let date = now.toDateString();
					let time = now.toTimeString();
					let str  = data.value;
					if (data.time || data.date)
						str = data.time ? date+"T"+data.value : data.value+"T"+time;
					let dt = __DateTime(str);
					if (this.type === "datetime")
						this._value = dt.toString();
					else if (dt.year > 0)
						this._value = dt.format("{YYYY}-{MM}-{DD}T{hh}:{mm}");
					else
						this._value = null;
				} else {
					this._value = null;
				}
			}
		},
		/**. ``''string'' _week``: Retorna ou define o valor da semana do formulário HTML.**/
		_week: {
			get: function()  {
				let data = __Type(this._value);
				if (!data.week) return "";
				let info = this._value.trim().replace(/(\,\ |-W)/i, "|").split("|");
				let year = info[0].length >= 4 ? info[0] : info[1];
				let week = info[0].length >= 4 ? info[1] : info[0];
				let maxi = __DateTime(year+"-01-01").maxWeekForm;
				if (Number(week) > maxi) return "";
				return year.replace("+", "")+"-W"+week;
			},
			set: function(x) {
				let data = __Type(x);
				if (data.week) {
					this._value = data.toString();
					let week = this._week;
					this._value = week === "" ? null : week;
 				} else {
					this._value = null;
				}
			}
		},
		/**. ``''string'' _month``: Retorna ou define o valor do mês do formulário HTML.**/
		_month: {
			get: function()  {
				let data = __Type(this._value);
				if (!data.month) return "";
				let info = this._value.trim();
 				if (data._re.month.test(info))
 					return info;
 				if (data._re.monthMY.test(info))
 					return info.replace(/^(\d\d)\/(.+)$/, "$2-$1");
				info = info.split(/[ /]/);
				return info[1]+"-"+("0"+String(data._getMonths(info[0]))).slice(-2);
			},
			set: function(x) {
				let data = __Type(x);
				if (data.month) {
					this._value = data.toString();
					let month = this._month;
					this._value = month === "" ? null : month;
 				} else {
					this._value = null;
				}
			}
		},
		/**. ``''string'' _url``: Retorna ou define o valor da URL do formulário HTML.**/
		_url: {
			get: function()  {
				let data = __Type(this._value);
				return data.url ? this._value.trim() : "";
			},
			set: function(x) {
				let data = __Type(x);
				this._value = data.url ? x.trim() : null;
			}
		},
		/**. ``''string'' _email``: Retorna ou define o valor de e-mail do formulário HTML.
			. Se o elemento tiver o atributo ``multiple``, múltiplos endereços serão definidos ou obtidos por array. Caso contrário por uma string.**/
		_email: {
			get: function()  {
				let data = __Type(this._value);
				if (!data.email) return "";
				let email = this._value.replace(/\ +/g, "").split(",");
				return this._node.multiple ? email : (email.length === 1 ? email[0] : "");
			},
			set: function(x) {
				let data  = __Type(x);
				if (data.array) {
					this._email = x.join(",");
				} else if (data.email) {
					x = x.replace(/\ +/g, "").split(",");
					this._value = this._node.multiple ? x.join(",") : (x.length === 1 ? x[0] : null);
				} else if (data.null) {
					this._value = null;
				}
			}
		},
		/**. ``''string'' _vcombo``: Retorna ou define o valor do formulário HTML de caixa de combinação (``select``).
		. Se o elemento possuir o atributo ``multiple``, o retorno e a definição se realizará por lista de valores. Caso contrário, por valor simples.**/
		_vcombo: {
			get: function() {
				if (!this._node.multiple) return this._value;
				let data = [];
				let i    = -1;
				while (++i < this._node.length)
					if (this._node[i].selected)
						data.push(this._node[i].value);
				return data.length === 0 ? "" : data;
			},
			set: function(x) {
				let data = __Type(x);
				if (data.null) {
					this._value = null;
				} else if (!this._node.multiple) {
					this._value = String(x);
				} else {
					if (!data.array) x = [x];
					x.forEach(function(v,i,a) {a[i] = String(v);});
					let i = -1;
					while (++i < this._node.length)
						this._node[i].selected = x.indexOf(this._node[i].value) >= 0;
				}
			}
		},
		/**. ``''string'' _tcombo``: Retorna ou define o conteúdo textual do formulário HTML de caixa de combinação (``select``).
		. Se o elemento possuir o atributo ``multiple``, o retorno e a definição se realizará por lista de conteúdos textuais. Caso contrário, por valor simples.**/
		_tcombo: {
			get: function() {
				let text = [];
				let i    = -1;
				while (++i < this._node.length)
					if (this._node[i].selected)
						text.push(this._node[i].textContent);
				return text.length === 0 ? "" : (this._node.multiple ? text : text[0]);
			},
			set: function(x) {
				let data = __Type(x);
				if (data.null) {
					this._value = null;
				} else if (!this._node.multiple && data.array) {
					this._value = null;
				} else {
					if (!data.array) x = [x];
					x.forEach(function(v,i,a) {a[i] = String(v);});
					let i = -1;
					while (++i < this._node.length)
						this._node[i].selected = x.indexOf(this._node[i].textContent) >= 0;
				}
			}
		},
		/**. ``''boolean'' _check``: Retorna ou define o valor do formulário HTML ``checkbox`` ou ``radio``.
		. Se o campo estiver checado, retornará o seu valor, caso contrário, retornará ``null``.
		. Se for definido um booleano, definirá a checagem;
		. se for nulo, inverterá a checagem; e
		. se for string, definirá o valor.**/
		_check: {
			get: function() {
				return this._node.checked ? this._value : null;
			},
			set: function(x) {
				let data = __Type(x);
				if (data.null)
					this._node.checked = !this._node.checked;
				else if (data.boolean)
					this._node.checked = x;
				else
					this._value = String(x);
			}
		},
		/**. ``''string'' _tel``: Retorna ou define o valor do formulário HTML ``tel``.
		- Para ser válido, o valor deverá conter pelo menos um número.**/
		_tel: {
			get: function() {
				return (/\d/).test(this._value) ? this._value : "";
			},
			set: function(x) {
				let data = __Type(x);
				if (data.null) {
					this._value = null;
				} else {
					x = String(x);
					this._value = (/\d/).test(x) ? x : null;
				}
			}
		},
		/**. ``''object'' _file``: Retorna ou define (apenas ``null``) o valor do formulário HTML ``file``:
		- Se o comprimento for zero, retornar uma string vazia;
		- Se apenas um arquivo selecionado, retornará um objeto ``File``; e
		- Se mais de um arquivo selecionado, retronará um array.**/
		_file: {
			get: function() {
				if (this._node.files.length === 0)
					return "";
				if (!this._node.multiple)
					return this._node.files[0];
				let data = [];
				let i = -1;
				while (++i < this._node.files.length)
					data.push(this._node.files[i]);
				return data;
			},
			set: function(x) {
				this._value = null;
			}

/* FIXME importantíssimo
se file ou select múltiplo, o nome tem que vir seguido de []
não pode ser assim:
	<input type="file" name="ARQUIVOS" multiple />
tem que ser assim:
	<input type="file" name="ARQUIVOS[]" multiple />
Isso vale para qualquer backend?
Como fazer isso como o objeto Form?
Basta incluir o [] ao fim do nome?


Para FormData function assim:
<select name="ITENS" multiple>...

let data = new FormData();
data.append("ITEMS", value1);
data.append("ITEMS", value2);
...
O método append não substitui o valor contido no atributo name, podendo ser vários.
Já o método set substitui e o delete apaga.

para conferir:
for(var pair of a.entries()) {
   console.log(pair[0]+ ', '+ pair[1]);
}
ou:
let itens = a.entries();
let item = itens.next(); retorna um objeto content {done: true|false, value: [name, value]}
let name = item.value[0];
let value = item.value[1];

E para o método GET, como proceder?

ITEMS[]=value1&ITEMS[]=value2&ITEMS[]=value3

*/
		},
		/**. ``''object'' _form``: Registra os parâmetros dos tipos de formulários HTML organizados pelo nome do elemento (``tag``).
		. Os elementos que possuem tipos (``input`` e ``button``) terão a chave ``type`` para poder identificá-los. A chave ``value`` corresponde ao nome do método que alterará o valor do formulário.
		. A chave ``text`` corresponde ao nome do método que definirá o conteúdo textual do formulário. A chave ``send`` corresponde ao nome do método que buscará o valor a ser submetido em requisições, se for o caso.**/
		_form: {
			value: {
				meter:    {value: "_number", text: "_number"},
				progress: {value: "_number", text: "_number"},
				option:   {value: "_value",  text: "_text"},
				output:   {value: "_value",  text: "_text"},
				select:   {value: "_vcombo", text: "_tcombo", send: "value"},
				textarea: {value: "_value",  text: "_value",  send: "value"},
				button:   {type: {
					reset:  {value: "_value", text: "_text"},
					button: {value: "_value", text: "_text"},
					submit: {value: "_value", text: "_text"},
				}},
				input: {type: {
					button:   {value: "_value", text: "_value"},
					reset:    {value: "_value", text: "_value"},
					submit:   {value: "_value", text: "_value"},
					image:    {},
					color:    {value: "_value",    text: "_value",    send: "value"},
					radio:    {value: "_check",    send: "value"},
					checkbox: {value: "_check",    send: "value"},
					date:     {value: "_date",     text: "_date",     send: "value"},
					datetime: {value: "_datetime", text: "_datetime", send: "value"},
					month:    {value: "_month",    text: "_month",    send: "value"},
					week:     {value: "_week",     text: "_week",     send: "value"},
					time:     {value: "_time",     text: "_time",     send: "value"},
					range:    {value: "_number",   text: "_number",   send: "value"},
					number:   {value: "_number",   text: "_number",   send: "value"},
					file:     {value: "_file",     send: "value"},
					url:      {value: "_url",      text: "_url",      send: "value"},
					email:    {value: "_email",    text: "_mail",     send: "value"},
					tel:      {value: "_tel",      text: "_tel",      send: "value"},
					text:     {value: "_value",    text: "_value",    send: "value"},
					search:   {value: "_value",    text: "_value",    send: "value"},
					password: {send: "_value"},
					hidden:   {value: "_value",    text: "_value",    send: "value"},
					"datetime-local": {value: "_datetime", text: "_datetime", send: "value"},
				}}
			}
		},
		/**. ``''object'' _fdata``: Retorna os parâmetros de formulário contidos em ``_type`` ou um objeto vazio se outro elemento.**/
		_fdata: {
			get: function() {
				let type = this.type;
				if (type === "")     return {};
				if (this.tag === type) return this._form[type]
				return this._form[this.tag].type[type];
			}
		},
		/**. ``''string'' tag``: Retorna o nome, em minúsculo, do elemento HTML.**/
		tag: {
			get: function() {return this._node.tagName.toLowerCase();}
		},
		/**. ``''string'' type``: Retorna o tipo de formulário HTML em minúsculo ou vazio se outro elemento.**/
		type: {
			get: function() {
				if (!(this.tag in this._form)) return "";
				if (!("type" in this._form[this.tag])) return this.tag;
				let type = this._form[this.tag].type;
				let att  = String(this._node.getAttribute("type")).toLowerCase();
				let obj  = String(this._node.type).toLowerCase();
				return (att in type ? att : (obj in type ? obj : ""));
			}
		},
		/**. ``''any'' value``: Retorna ou define o atributo ``value`` do elemento HTML, se existente. O valor retornado depende do elemento.**/
		value: {
			get: function()  {
				let fdata = this._fdata;
				return this[("value" in fdata ? fdata.value : "_value")];
			},
			set: function(x) {
				if (!("value" in this._node)) return;
				let fdata = this._fdata;
				this[("value" in fdata ? fdata.value : "_value")] = x;
			}
		},
		/**. ``''string'' text``: Retorna ou define o conteúdo textual do elemento HTML.**/
		text: {
			get: function()  {
				let fdata = this._fdata;
				return this[("text" in fdata ? fdata.text : "_text")];
			},
			set: function(x) {
				let fdata = this._fdata;
				this[("text" in fdata ? fdata.text : "_text")] = x;
			}
		},
		/**. ``''string'' inner``: Retorna ou define o conteúdo interno do elemento HTML.**/
		inner: {
			get: function() {
				return this.type === "" ? this._node.innerHTML : this.text;
			},
			set: function(x) {
				if (this.type === "") this._node.innerHTML = x;
				else this.text = x;
			}
		},
		/**. ``''string'' name``: Retorno o nome do elemento HTML.
		. O retorno e a definição são definidos pelos atributos ``name`` ou ``id``, nessa ordem. Se ambos forem vazios ou inexistentes, retornará ``null``.**/
		name: {
			get: function() {
				if ("name" in this._node && __Type(this._node.name).nonempty)
					return this._node.name.trim();
				if (__Type(this._node.id).nonempty)
					return this._node.id.trim();
				return null;
			},
			set: function(x) {
				if ("name" in this._node)
					this._node.name = x === null ? "" : String(x).trim();
				else
					this._node.id   = x === null ? "" : String(x).trim();
			}
		},
		/**. ``''object'' send``: retorna um objeto contendo os atributos ``name`` (nome ou identificador do campo) e ``value`` (valor do campo).
		. Retornará ``null`` se o campo não enviar dados em requisições, se o nome do campo não estiver definido ou se seu valor for nulo.**/
		send: {
			get: function() {
				if (!("send" in this._fdata)) return null;
				let pack = {name: this.name, value: this[this._fdata.send]};
				return (pack.name === null || pack.value === null) ? null : pack;
			}
		},
		/**. ``''object'' attribute(null|object x)``: Retorna um objeto contendo os atributos HTMl do elemento e define seus valores.
		. Se o argumento ``x`` for ``null``, todos os atributos HTML do elemento serão removidos.
		. Se o argumento ``x`` for um objeto, o nome e o valor de cada atributo definirão o atributo HTMl de mesmo nome e seu valor, inclusive ``null``, caso o objetivo seja removê-lo.**/
		attribute: {
			value: function(x) {
				if (arguments.length === 0) {
					let attr = this._node.attributes;
					let data = {};
					for (let i in attr) {
						let value = this._node.getAttribute(attr[i].name);
						if (value !== null) data[attr[i].name] = value;
					}
					return data;
				}
				let data = __Type(x);
				if (data.null) {
					let attr = this.attribute();
					for (let i in attr)
						attr[i] = null;
					this.attribute(attr);
				} else if (data.object) {
					for (let i in x) {
						if (x[i] === null)
							this._node.removeAttribute(i);
						else
							this._node.setAttribute(i, x[i]);
					}
				}
				return this.attribute();
			}
		},
		/**. ``''object'' style(null|object x)``: Retorna um objeto contendo os estilos definidos em ``style`` e define seus valores.
		. Se o argumento ``x`` for ``null``, todos os estilos contidos em ``style`` serão removidos.
		. Se o argumento ``x`` for um objeto, o nome e o valor de cada atributo definirão o nome do estilo e seu valor, inclusive ``null``, caso o objetivo seja removê-lo.**/
		style: {
			value: function(x) {
				if (arguments.length === 0) {
					let data = {};
					let i    = -1;
					while (++i < this._node.style.length) {
						let attr = this._node.style[i];
						let name = __String(attr).camel;
						data[name] = this._node.style[attr];
					}
					return data;
				}
				let data = __Type(x);
				if (data.null) {
					let attr = this.style();
					for (let i in attr)
						this._node.style[i] = null;
				} else if (data.object) {
					for (let i in x) {
						let name = __String(i).camel;
						this._node.style[name] = x[i];
					}
				}
				return this.style();
			}
		},
		/**. ``''object'' dataset(''object'' x)``: Retorna um objeto contendo os dados definidos em ``dataset`` e define seus valores.
		. Se o argumento ``x`` for ``null``, todos os dados contidos em ``dataset`` serão removidos.
		. Se o argumento ``x`` for um objeto, o nome e o valor de cada atributo definirão o nome do estilo e seu valor, inclusive ``null``, caso o objetivo seja removê-lo.**/
		dataset: {
			value: function(x) {
				if (arguments.length === 0) {
					let data = {};
					for (let i in this._node.dataset)
						data[i] = this._node.dataset[i];
					return data;
				};
				let data = __Type(x);
				if (data.null) {
					let attr = this.dataset();
					for (let i in attr) {
						delete this._node.dataset[i];
						/* IMPORTANTE: após cada definição, checar procedimentos */
						settingProcedures(this._node, i);
					}
				} else if (data.object) {
					for (let i in x) {
						let name = __String(i).camel;
						if (x[i] !== null)
							this._node.dataset[name] = x[i];
						else if (name in this._node.dataset)
							delete this._node.dataset[name];
						/* IMPORTANTE: após cada definição, checar procedimentos */
						settingProcedures(this._node, name);
					}
				}
				return this.dataset();
			}
		},

		/**. ``''array'' css(''object'' x)``: Retorna a lista de estilos css definidos no atributo HTML ``class`` e define seus valores:
		|Tipo do Argumento|Resultado|
		|string|Os estilos, separados por espaço, serão definidos conforme especificados.|
		|``null``|O atributo HTML ``class`` será removido do elemento.|
		|objeto|O nome do atributo corresponderá a uma operação e seu valor (string) aos estilos associados.|
		. No caso de objeto, o comportamento é definido pelas seguintes chaves:
		|Chave|Comportamento|
		|``set``|define estilos.|
		|``replace``|Permuta estilos.|
		|``add``|Adiciona estilos.|
		|``delete``|Apaga estilos.|
		|``toggle``|Alterna estilos.|**/
		css: {
			value: function(x) {
				if (arguments.length === 0) {
					let css   = this._node.getAttribute("class");
					let array = css === null ? [] : css.replace(/\s+/g, " ").trim().split(" ");
					let value = __Array(array).order;
					this._node.setAttribute("class", value.join(" "));
					return value;
				}
				let data = __Type(x);
				if (data.chars) {
					this._node.setAttribute("class", x);
				} else if (data.null) {
					this._node.removeAttribute("class");
				} else if (data.object) {
					let css = __Array(this.css());
					if ("set" in x) {
						this._node.setAttribute("class", x["set"]);
						delete x["set"];
						return this.css(x);
					}
					if ("replace" in x) css.replace.apply(css, x.replace.split(" "));
					if ("toggle" in x)  css.toggle.apply(css, x.toggle.split(" "));
					if ("add" in x)     css.put.apply(css, x.add.split(" "));
					if ("delete" in x)  css.delete.apply(css, x.delete.split(" "));
					this._node.setAttribute("class", css.order.join(" "));
				}
				return this.css();
			}
		},
		/**. ``''void'' object(''object'' x)``: Define atributos ou executa métodos presentes no objeto HTML.
		. Cada conjunto nome/valor informado no argumento ``x`` representará o nome do atributo ou método e seu valor ou argumento.
		. Caso não exista o atributo ou método especificado, nada ocorrerá.
		. Caso o nome se refira a um método, para definir múltiplos argumentos, deverá ser utilizado um array como valor.
		. Caso o atributo seja boleano e igual ao seu nome precedido do caractere "!", o inverso do valor será definido.
		. Caso contrário, o valor do atributo ou argumento do método será o valor definido.**/
		object: {
			value: function(x) {
				if (arguments.length === 0) return;
				let data = __Type(x);
				if (!data.object) return;
				for (let i in x) {
					if (!(i in this._node)) continue;
					let toggle = x[i] === "!"+i;
					let attr   = this._node[i];
					let acheck = __Type(attr);
					let vcheck = __Type(x[i]);
					if (acheck.function && vcheck.array)
						this._node[i].apply(this._node, x[i]);
					else if (acheck.function)
						this._node[i](x[i]);
					else if (toggle && acheck.boolean)
						this._node[i] = !this._node[i];
					else
						this._node[i] = x[i];
				}
				return;
			}
		},
		/**. ``''void''  handler(''object'' x)``: Define ou remove disparadores ao elemento HTML.
		. Cada conjunto nome/valor informado no argumento ``x`` representará o evento e o método, ou a lista de métodos, a ser disparado.
		. O nome do evento pode ou não começar com o prefixo "on".
		. Se o evento começar com o caractere "!", será feita a remoção do disparador.
		. Para definir múltiplos métodos ao evento, esses deverão ser informados em um array.**/
		handler: {
			value: function(x) {
				let data = __Type(x);
				if (!data.object) return;
				for (let i in x) {
					let check = __Type(x[i]);
					if (!check.array && !check.function) continue;
					let value  = check.array ? x[i] : [x[i]];
					let name   = String(i).toLowerCase().replace(/\s+/g, "");
					let remove = (/^\!/).test(name);
					let event  = name.replace(/^\!?(on)?/, "");
					let j      = -1;
					while (++j < value.length) {
						let method = value[j];
						let test   = __Type(method);
						if (!test.function) continue;
						if (remove)
							this._node.removeEventListener(event, method, false);
						else
							this._node.addEventListener(event, method, false);
					}
				}
				return;
			}
		},
		/**. ``''string'' lang``: Retorna a linguagem do elemento ou seus pais (atributo ``lang``) ou a do navegador ou ainda ``en-US`` como padrão.**/
		lang: {
			get: function() {
				let node = this._node;
				while (node !== null) {
					let lang = ("lang" in node.attributes) ? node.attributes.lang.value : null;
					let test = __Type(lang);
					if (test.lang) return lang.trim();
					node = node.parentElement;
					continue;
				}
				return navigator.language || navigator.browserLanguage || "en-US";
			}
		},
		/**. ``node clone(boolean childs=true)``: Retorna um clone do objeto.
		. Se o argumento opcional ``childs`` for falso, os elementos filhos não serão clonados.**/
		clone: {
			value: function(childs) {
				let special = ["script"];
				if (special.indexOf(this.tag) < 0)
					return this._node.cloneNode(childs !== false);
				let attrs = this.attribute();
				let clone = document.createElement(this.tag);
				for (let i in attrs)
					clone.setAttribute(i, attrs[i]);
				clone.innerHTML = this._node.innerHTML
				return clone;
			}
		},
		/**. ``''void'' load(string html="", boolean overlap=false)``: Carrega um conteúdo HTML no elemento ou o substitui.
		. O argumento ``html`` é o texto em formato HTML a ser carregado ou a substituir o elemento definido.
		. O argumento opcional ``overlap``, se verdadeiro, irá substituir o elemento pelo conteúdo de ``html``.**/
		load: {
			value: function(html, overlap) {
				/* definir elemento */
				let elem    = overlap === true ? document.createElement("DIV") : this._node;
				let node    = __Node(elem);
				node.inner  = html === undefined ? "" : String(html);
				/* redefinir elementos scripts para fazer rodar */
				let scripts = __Type(__$$("script", elem)).value;
				let i = -1;
				while (++i < scripts.length) {
					let script = scripts[i];
					let parent = script.parentElement;
					let clone  = __Node(script).clone();
					parent.insertBefore(clone, script);
					script.remove();
				}
				/* substituindo o nó pelo conteúdo, se for o caso */
				if (overlap === true) {
					let base   = this._node;
					let parent = base.parentElement;
					let childs = __Type(elem.children).value;
					let i = -1;
					while(++i < childs.length)
						parent.insertBefore(childs[i], base);
					base.remove();
				}
				/* IMPORTANTE: checar elemento após carregamento */
				loadingProcedures();
				return;
			}
		},
		//FIXME falta a descrição do método
		repeat: {
			value: function(list) {
				let data = __Type(list);
				if (!data.array) return;
				/* 1) obter o conteúdo interno */
				/* 2) se o conteúdo contiver o formato {{}}, armazená-lo em data-wd-repeat-model */
				/* 3) se não contiver o formato, recuperar o modelo em data-wd-repeat-model */
				/* 4) se não existir, retornar */
				let html = this.inner;
				if ((/\{\{.+\}\}/g).test(html))
					this._node.dataset.wdRepeatModel = html;
				else if ("wdRepeatModel" in this._node.dataset)
					html = this._node.dataset.wdRepeatModel;
				else return;
				/* 5) adequar os atributos do DOM ( {{x}} para {{x}}="" ) */
				/* 6) limpar conteúdo interno */
				html = html.split("}}=\"\"").join("}}");
				this.inner = "";
				/* 7) Criar lista de filhos */
				/* 8) executar looping */
				/* 9) substituir atributos entre chaves duplas por valores e adicionar */
				let childs = [""];
				let i = -1;
				while (++i < list.length) {
					let check = __Type(list[i]);
					if (!check.object) continue;
					let inner = html;
					for (let j in list[i])
						inner = inner.split("{{"+j+"}}").join(list[i][j]);
					childs.push(inner);
				}
				/* 10) definir filhos */
				this.inner = childs.join("\n");
				/* IMPORTANTE: checar elemento após carregamento */
				loadingProcedures();
				return;
			}
		},
		/**. ``''boolean'' show``: Retorna se o elemento está visível nos termos da biblioteca e define sua exibição, exceto se houver estilo predominante que impeça o comportamento.**/
		show: {
			get: function() {
				return this.css().indexOf("js-wd-no-display") < 0;
			},
			set: function(x) {
				this.css(x === false ? {add: "js-wd-no-display"} : {delete: "js-wd-no-display"});
			}
		},
		/**. ``''void'' nav(number init=-Infinity, number last=+Infinity)``: Define o intervalo de nós filhos a ser exibidos.
		. Os argumentos ``init`` e ``last`` definem os índices do primeiro e do último nó, respectivamente. Se ``end`` for maior que ``init``, ocorrerá a inversão da exibição.**/
		nav: {
			value: function(init, last) {
				let child = __Type(this._node.children).value;
				if (child.length === 0) return;
				let data1 = __Type(init);
				let data2 = __Type(last);
				let order = true;
				init = data1.number ? data1.value : -Infinity;
				last = data2.number ? data2.value : +Infinity;
				if (init > last) {
					let aux = init;
					init = last;
					last = aux;
					order = false;
				}
				child.forEach(function(v,i,a){
					let node  = __Node(v);
					node.show = order ? (i >= init && i <= last) : (i < init || i > last);
				});
			}
		},
		/**. ``''void'' walk(integer n=1)``: Exibe um determinado nó filho avançando ou retrocedendo entre os nós irmãos.
		. O argumento ``n`` indica o intervalo a avançar (positivo) ou a retroceder (negativo).**/
		walk: {
			value: function(n) {
				let data  = __Type(n);
				let child = __Type(this._node.children).value;
				let width = child.length;
				let init  = -1;
				let last  = -1;
				let size  =  0;
				if (width === 0 || data.zero) return;
				n = data.finite ? Math.trunc(data.value) : (data.negative ? -1 : +1);
				/* capturando o primeiro e o último nó visível */
				child.forEach(function(v,i,a) {
					let show = v.className.indexOf("js-wd-no-display") < 0;
					if (show) {
						size++;
						if (init < 0) init = i;
						last = i;
					}
				});
				/* todos os nós visíveis ou invisíveis */
				if (size === 0 || size === width) {
					init = 0;
					last = width - 1;
				}
				let index = __Array(child).index((n < 0 ? init : last) + n);
				return this.nav(index, index);
			}
		},
		/**. ``''integer'' index``: Retorna o índice do elemento com relação a seus irmãos.**/
		index: {
			get: function() {
				let parent = this._node.parentElement;
				if (parent === null) return 0;
				let child = __Type(parent.children).value;
				return child.indexOf(this._node);
			}
		},
		/**. ``''void'' alone(boolean x=true)``: exibe o elemento e omite seus elementos irmãos.
		. O argumento ``x``, se falso, inverterá a exibição padrão, escondendo apenas o nó.**/
		alone: {
			value: function(x) {
				let index = this.index;
				let node  = __Node(this._node.parentElement);
				if (x === false) {
					node.nav();
					this.show = false;
					return;
				}
				return node.nav(index, index);
			}
		},
		/**. ``''void'' page(number index=0, integer total, boolean width=false)``: Divide os nós filhos em grupos exibindo apenas aqueles do grupo definido.
		. O argumento ``index`` define o índice de cada grupo limitados ao primeiro e último grupo. Se for igual a &minus;1, retornará o último grupo. Os valores ``+Infinity`` e ``-Infinity`` avançam ou retrocedem para o grupo seguinte ou anterior, respectivamente.
		. O argumento ``total`` é um inteiro positivo que define a quantidade de nós em cada grupo ou a quantidade de grupos (padrão).
		. O argumento ``width`` define o valor de ``total`` como quantidade de grupos, se falso, ou como quantidade de nós por grupo, se verdadeiro.**/
		page: {
			value: function (index, total, width) {
				let data1  = __Type(index);
				let data2  = __Type(total);
				let child  = __Type(this._node.children).value;
				let length = child.length;
				let init   = -1;
				let last   = -1;
				let pages  = [];
				let count  = -1;
				if (child.length === 0) return;
				total = (!data2.finite || data2.value <= 1) ? length : Math.trunc(data2.value);
				total = width === true ? total : Math.ceil(child.length / total);
				index = !data1.number ? 0 : data1.infinite ? data1.value : Math.trunc(data1.value);
				child.forEach(function(v,i,a) {
					/* separar índices dos nós em grupos */
					if (i%total === 0) {
						pages.push([]);
						count++;
					}
					pages[count].push(i);
					/* obtendo o primeiro e o último nó visível */
					let show = v.className.indexOf("js-wd-no-display") < 0;
					if (show) {
						if (init < 0) init = count;
						last = count;
					}
				});
				/* definindo o índice do grupo */
				let array = __Array(pages);
				if (index === +Infinity) {
					let ref = last + 1;
					index = array.index(ref >= pages.length ? (pages.length - 1) : ref);
				} else if (index === -Infinity) {
					let ref = init - 1;
					index = array.index(ref < 0 ? 0 : ref);
				} else {
					let ref = index >= pages.length ? (pages.length - 1) : (index < -1 ? -1 : index);
					index = array.index(ref);
				}
				/* definindo os limites */
				if (index < 0 || index >= pages.length)
					index = index < 0 ? 0 : (pages.length - 1);
				let a = pages[index][0];
				let b = pages[index][pages[index].length - 1];
				return this.nav(a, b);
			}
		},
		/**. ``''void'' filter(string|regexp search, integer chars=1)``: Exibe os nós filhos que casam com o valor definido.
		. O argumento ``search`` é o valor a ser encontrado, podendo ser uma string ou uma expressão regular.
		. O argumento ``chars`` terá efeito quando ``search`` for uma string e indica o número de caracteres mínimo a ser informado em ``search``. Quando não casado, se positivo, exibirá todos os nós, caso contrário os esconderá.**/
		filter: {
			value: function(search, chars) {
				let data1 = __Type(search);
				let data2 = __Type(chars);
				let child = __Type(this._node.children).value;
				if (data1.null || data1.undefined) return this.nav();
				search = data1.regexp ? search : String(search).toUpperCase().trim();
				chars  = data2.finite ? Math.trunc(chars) : 0;
				if (search === "") return;
				child.forEach(function(v,i,a) {
					let node  = __Node(v);
					let value = data1.regexp ? node.text : node.text.toUpperCase();
					let text  = data1.regexp ?     value :__String(value).clear()
					if (data1.regexp)
						node.show = search.test(text);
					else if (search.length >= Math.abs(chars))
						node.show = text.indexOf(search) >= 0;
					else
						node.show = chars >= 0;
				});
			}
		},
		/**. ``''void'' sort(booelan asc, integer ref)``: Ordena os elementos filhos.
		. O argumento opcional ``asc`` define a classificação. Se verdadeiro, será ascendente; se falso, descendente; e, se indefindo ou não boleano, será o inverso da classificação atual.
		. O argumento opcional ``ref`` permite definir um nó neto como parâmetro de ordenação indicando seu índice (útil para ordenação de colunas de uma tabela).**/
		sort: {
			value: function(asc, ref) {
				let data1 = __Type(asc);
				let data2 = __Type(ref);
				let child = __Type(this._node.children).value;
				let array = __Array(child);
				ref = data2.integer && data2 >= 0 ? data2.value : null;
				if (ref !== null) {
					let list = [];
					child.forEach(function(v,i,a){
						let children = v.children;
						if (ref < children.length)
							list.push(children[ref]);
					});
					array = __Array(list);
				}
				let order = array.sort(asc);
				let node  = this._node;
				let init, last;
				order.forEach(function(v,i,a){
						init = i === 0 ? v : init;
						last = v;
						node.appendChild(ref === null ? v : v.parentElement);
				});
				let rank = __Array(init, last).sort(true);
				return rank[0] === init;
			}
		},
		/**. ``''void'' display(string act)``: Promove ações de exibição de elementos.
		. O argumento ``act`` define as ações de exibição a serem executadas ao elemento ou seus filhos:
		|Alvo|Ação|Código|Descrição|
		|Nó|Exibição|show|exibe o nó|
		|Nó|Exibição|hide|esconde o nó|
		|Nó|Exibição|toggle|alterna a exibição do nó|
		|Nó|Exibição|alone|exibe o nó e esconde os irmãos|
		|Nó|Exibição|absent|esconde o nó e exibe os irmãos|
		|Nó|Exibição|all|exibe o nó e irmãos|
		|Nó|Exibição|none|esconde o nó e irmãos|
		|Filhos|Exibição|+|exibe todos os filhos|
		|Filhos|Exibição|-|esconde todos os filhos|
		|Filhos|Exibição|X|exibe o nó detentor do índice ``X``|
		|Filhos|Exibição|X,Y|exibe os nós entre o índices opcionais ``X`` e ``Y`` (inclusive). Invertendo a ordem, inverte-se a exibição|
		|Filhos|Exibição|&gt;|exibe o próximo nó|
		|Filhos|Exibição|&lt;|exibe o nó anterior|
		|Filhos|Exibição|&gt;&gt;|exibe o último nó|
		|Filhos|Exibição|&lt;&lt;|exibe o primeiro nó|
		|Filhos|Exibição|&gt;X|exibe o nó no intervalo ``X`` afrente|
		|Filhos|Exibição|&lt;X|exibe o nó no intervalo ``X`` atrás|
		|Filhos|Agrupamento|X/Y|Exibe o grupo de índice ``X`` (1 é o primeiro 0 é o último) num total de ``Y`` grupos (se possível)|
		|Filhos|Agrupamento|X:Y|Exibe o grupo de índice ``X`` (1 é o primeiro 0 é o último) divididos em grupos de ``Y`` nós|
		|Filhos|Agrupamento|&gt;/Y|Avança para o próximo grupo de um total de ``Y`` grupos|
		|Filhos|Agrupamento|&lt;/Y|Retrocede para o grupo anterior de num total de ``Y`` grupos|
		|Filhos|Agrupamento|&gt;:Y|Avança para o próximo grupo composto de ``Y`` nós|
		|Filhos|Agrupamento|&lt;:Y|Retrocede para o grupo anterior composto de ``Y`` nós|
		|Filhos|Classificação|-&gt;|Classifica em ordem crescente|
		|Filhos|Classificação|&lt;-|Classifica em ordem decrescente|
		|Filhos|Classificação|&lt;-&gt;|Classifica na ordem inversa|
		|Filhos|Classificação|-&gt;X|Classifica em ordem crescente com parâmetro no nó neto de índice ``X``|
		|Filhos|Classificação|X&lt;-|Classifica em ordem decrescente com parâmetro no nó neto de índice ``X``|
		|Filhos|Classificação|&lt;X&gt;|Classifica em ordem inversa com parâmetro no nó neto de índice ``X``|
		|Filhos|Busca|/regexp/gi|Exibe todos os filhos que casam com a expressão regular|
		|Filhos|Busca|"string"X|Exibe os elementos que casam com a string informada. O inteiro ``X`` é opcional e define a quantidade de caracteres mínimos para efetuar a busca que, se negativo, esconderá todos os filhos enquanto não casar a quantidade de caracteres e que, se positivo, exibira todos os filhos.|**/
		display: {
			value: function(act) {
				act = String(act).trim();
				let node = __Node(this._node.parentElement);

				if ((/^([a-z]+|[<>+-]|\<\<|\>\>|\-\>|\<\-|\<\-\>)$/).test(act)) {
					switch (act) {//FIXME não dá pra usar palavras, vai confundir com pesquisa de texto
						case "show":   return (this.show = true);//*
						case "hide":   return (this.show = false);//.
						case "toggle": return (this.show = !this.show);//?
						case "alone":  return this.alone();//.*.
						case "absent": return this.alone(false);//*.*
						case "all":    return node.nav();//***
						case "none":   return node.nav(-1, -1);//...

						case "+":      return this.nav();
						case "-":      return this.nav(-1, -1);
						case ">":      return this.walk(1);
						case "<":      return this.walk(-1);
						case ">>":     return this.page(-1, 1);
						case "<<":     return this.page(0, 1);
						case "->":     return this.sort(true);
						case "<-":     return this.sort(false);
						case "<->":    return this.sort();
						default:       return;
					};
				}
				if ((/^\d+$/).test(act)) {
					return this.nav(act, act);
				}
				if ((/^([+-]?\d+)?\,([+-]?\d+)?$/).test(act)) {
					act = act.split(",");
					return this.nav(act[0], act[1]);
				}
				if ((/^(\>|\<|\d+)[:/][1-9](\d+)?$/).test(act)) {
					let width = (/\:/).test(act);
					let data  = act.split(width ? ":" : "/");
					switch(data[0]) {
						case ">": data[0] = +Infinity; break;
						case "<": data[0] = -Infinity; break;
						default:  data[0] = __Type(data[0]).value - 1;
					}
					return this.page(data[0], data[1], width);
				}
				if ((/^(\-\>\d+|\d+\<\-|\<\d+\>)$/).test(act)) {
					let ref = act.replace(/\D/g, "");
					let asc  = act[0] === "-" ? true : (act[0] === "<" ? null : false);
					return this.sort(asc, ref);//FIXME como saber em que ordem ficou?
				}


				if ((/^\/.+\/(g|i|gi|ig)?/).test(act)) {
					act = act.substr(1).split("/");
					act = new RegExp(act[0], act[1]);
					this.filter(act);
				}

				if ((/^\'.+\'([+-]?[1-9](\d+)?)?$/).test(act)) {//FIXME
					act = act.substr(1).split("/");
					act = new RegExp(act[0], act[1]);
					this.filter(act);
				}

				return;
			}
		},
		/**. ``''void'' jump(array list)``: O elemento será transferido, na ordem definida, como filho na lista de elementos pais a cada chamada do método.
		. O argumento ``list`` é um array de elementos que servirá como pai para o elemento especificado.**/
		jump: {
			value: function(list) {
				let check = __Type(list);
				list = check.array ? list : [list];
				let index = list.indexOf(this._node.parentElement) + 1;
				let node  = list[index%list.length];
				let data  = __Type(node);
				if (data.node)
					node.appendChild(this._node);
			}
		},
		/**. ``''boolean'' full()``: Alterna a exibição do nó em tela cheia e retorna verdadeiro se efetivada essa exibição.**/
		full: {
			value: function() {
				let action = {
					open: ["requestFullscreen", "webkitRequestFullscreen", "msRequestFullscreen"],
					exit: ["exitFullscreen", "webkitExitFullscreen", "msExitFullscreen"]
				};
				let target = document.fullscreenElement;
				let full   = target !== this._node;
				let node   = full ? this._node : document;
				let method = full ? action.open : action.exit;
				let i = -1;
				while (++i < method.length) {
					if (method[i] in node) {
						try {
							node[method[i]]();
							return full;
						} catch(e) {}
					}
				}
				return false;
			}
		},
		/**. ``''object'' styles``: Retorna um objeto contendo os estilos e seus valores computados ao elemento.**/
		styles: {
			get: function() {
				let object = {};
				let styles = window.getComputedStyle(this._node, null);
				for (let i in styles) {
					if ((/\d+/).test(i)) continue;
					object[i] = styles.getPropertyValue(i);

				}
				return object;
			}
		},
	});



	/**FIXME
	#### Pesquisa por Elementos
	###### ``**constructor** ''object'' __Query(string selector, node root=document)``
	Construtor para obter elementos HTML.
	O argumento ``selector`` é um seletor CSS que identifica os elementos HTML, e o argumento opcional ``root`` define o elemento raiz da busca.	**/
	function __Query(selector, root) {
		if (!(this instanceof __Query))	return new __Query(selector, root);
		selector = String(selector).trim();
		let check = __Type(root);
		Object.defineProperties(this, {
			_css:  {value: selector},
			_root: {value: check.node ? check.value[0] : document},
		});
	}

	Object.defineProperties(__Query.prototype, {
		constructor: {value: __Query},
		/**. ``$$``: retorna uma lista de nós (``NodeList``).**/
		$$: {
			get: function() {
				let elem = null;
				try {elem = this._root.querySelectorAll(this._css);} catch(e) {}
				return __Type(elem).node ? elem : document.querySelectorAll("#_._");
			}
		},
		/**. ``$``: retorna um nó específico ou lista de nós (``NodeList``) vazia.**/
		$: {
			get: function() {
				let elem = null;
				try {elem = this._root.querySelector(this._css);} catch(e) {}
				return __Type(elem).node ? elem : this.$$;
			}
		}
	});

/*----------------------------------------------------------------------------*/
	/**
	FIXME o que fazer com isso?
	``node __$$$(object obj, node root)``
	Localiza em um objeto os atributos v{$}v e v{$$}v e utiliza seus valores como seletores CSS.}p
	O atributo v{$$}v é prevalente sobre o v{$}v para fins de chamada das funções i{__$$}i ou i{__$}i,
 respectivamente.
	v{obj}v - Objeto javascript contendo os atributos v{$}v ou v{$$}v.
	v{root}v - (opcional, i{document}i) Elemento base para busca.}d}l
	**/
	function __$$$(obj, root) {
		let one =  "$" in obj ? String(obj["$"]).trim()  : null;
		let all = "$$" in obj ? String(obj["$$"]).trim() : null;
		let key = {"document": document, "window":  window};
		if (one !== null && one in key) one = key[one];
		if (all !== null && all in key) all = key[all];
		return all === null ? __$(one, root) : __$$(all, root);
	}

/*============================================================================*/
	/**### Requisições e Arquivos
	``**constructor** ''object'' __Request(string input)``
	Construtor para [requisições Web](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) ou leituras de [arquivo](https://developer.mozilla.org/en-US/docs/Web/API/FileReader). O argumento ``input`` deve ser o endereço do alvo a ser requisitado.
	{**/
	function __Request(input, method) {
		if (!(this instanceof __Request))	return new __Request(input, method);
		let check = __Type(input);
		let test  = __Type(method);
		let request, source;

		/* identificar se é um endereço de arquivo ou um arquivo */
		if (check.files && input.length > 0) {
			input   = input[0];
			request = new FileReader();
			source  = "file";
		} else if (check.file) {
			request = new FileReader();
			source    = "file";
		} else if (check.nonempty) {
			input   = String(input).trim();
			request = new XMLHttpRequest();
			source  = "path";
		} else {
			input   = null;
			request = null;
			source  = null;
		}

		/* definir atributos internos */
		Object.defineProperties(this, {
			_target:  {value: input},
			_source:  {value: source},
			_request: {value: request},
			_submit:  {value: test.function ? method : null, writable: true},
			_done:    {value: false, writable: true},
			_state:   {value: "", writable: true},
			_start:   {value: 0, writable: true},
			_time:    {value: 0, writable: true},
			_maxtime: {value: 0, writable: true},
			_size:    {value: 0, writable: true},
			_loaded:  {value: 0, writable: true},
		});

		/* definir métodos e eventos */
		let self    = this;
		let trigger = function(x) {
			if (self.done) return;

			/* definindo valores do objeto */
			self._time   = new Date().valueOf();
			self._size   = "total"  in x ? x.total  : 0;
			self._loaded = "loaded" in x ? x.loaded : 0;
			__MODALCONTROL.progress(self.progress);

			/* obtendo valores do evento */
			let source = self._source;
			let type   = x.type;
			let state  = self._request.readyState;
			let errors = ["abort", "timeout", "error"];
			let states, status;
			if (source === "file") {
				states = ["empty", "loading", "closing"];
				status = null;
			} else if (source === "path") {
				status = self._request.status;
				states = ["unsent", "opened", "headers", "loading", "closing"];
			}

			/* analisar progresso da requisição */
			if (status === 404) {
				self._done  = true;
				self._state = "notfound";
			} else if (errors.indexOf(type) >= 0) {
				self._done  = true;
				self._state = type;
			} else if (source === "file" && self.maxtime > 0 && self.time > self.maxtime) {
				self._done  = true;
				self._state = "timeout";
			} else if (source === "path" && state === 4 && type === "loadend") {
				self._done  = true;
				self._state = "done";
			} else if (source === "file" && state === 2 && type === "loadend") {
				self._done  = true;
				self._state = "done";
			} else {
				self._state = states[state];
			}

			/* checando ações */
			if (self.done) __MODALCONTROL.end();
			if (self._submit !== null) self._submit(self);
		}

		let events = ["onabort", "onerror", "onload", "onloadend", "onloadstart",
		"onprogress", "ontimeout", "onreadystatechange"];
		let i = -1;
		while (++i < events.length) {
			let event = events[i];
			if (event in this._request)
				this._request[event] = trigger;
			if ("upload" in this._request && event in this._request.upload)
				this._request.upload[event] = trigger;
		}
	}

	Object.defineProperties(__Request.prototype, {
		constructor: {value: __Request},
		/**. ``''number'' maxtime``: Define e retorna o tempo máximo de requisição em milisegundos.**/
		maxtime: {
			get: function() {return this._maxtime;},
			set: function(x) {
				let data = __Type(x);
				if (data.finite && data.positive)
					this._maxtime = Math.trunc(Math.abs(data.value));
				else
					this._maxtime = 0;
			}
		},
		/**. ``function onsubmit``: Define e retorna o disparador a ser chamado ao executar a requisição.
		. A função receberá o objeto como argumento e será chamado a cada mudança de estado. Para excluir o disparador, deve-se defini-lo como ``null``.**/
		onsubmit: {
			set: function(x) {
				if (!__Type(x).function && x !== null) return;
				this._submit = x;
			},
			get: function() {return this._submit;}
		},
		/**. ``''boolean'' done``: Retorna verdadeiro se a requisição estiver terminada.**/
		done: {
			get: function() {return this._done;}
		},
		/**. ``''string'' target``: Retorna o alvo da requisição.**/
		target: {
			get: function() {
				return this._source === "file" ? this._target.name : this._target;
			}
		},
		/**. ``''object'' request``: Retorna o objeto ``XMLHttpRequest`` ou ``FileReader`` da requisição.**/
		request: {
			get: function() {return this._request;}
		},
		/**-``integer time``: Retorna o tempo de execução da requisição em milisegundos.**/
		time: {
			get: function() {return this._time - this._start;}
		},
		/**. ``''string'' state``: Retorna o estado da requisição: ``opened``, ``headers``, ``loading``, ``closing``, ``done``, ``abort``, ``timeout`` ou ``error``.**/
		state: {
			get: function() {return this._state;}
		},
		/**. ``''integer'' size``: Retorna o tamanho total da requisição (envio ou retorno) em bytes.**/
		size: {
			get: function() {return this._size;}
		},
		/**. ``''integer'' loaded``: Retorna o tamanho parcial da requisição em bytes.**/
		loaded: {
			get: function() {return this._loaded;}
		},
		/**. ``''number'' progress``: Retorna o progresso da requisição (de 0 a 1).**/
		progress: {
			get: function() {return this._size === 0 ? 1 : this._loaded/this._size;}
		},
		/**. ``''string'' print()``: Retorna uma string contendo informações da requisição.**/
		print: {
			value: function() {
				let print = [
					this.state,
					__Number(this.loaded).bytes+"/"+__Number(this.size).bytes,
					__Number(this.progress).notation("percent"),
					this.time/1000+"s"
				];
				return print.join(" | ");
			}
		},
		/**. ``''void'' abort()``: aborta a requisição;**/
		abort: {
			value: function() {this._request.abort();}
		},
		/**. ``''void'' content(string type, string td=\t,string tr=\n)``: Retorna o conteúdo da requisição ou ``null`` se indefinido ou com erro.
		. O argumento opcional ``type``, define o tipo do retorno a partir do conteúdo da requisição, podendo ser ``text``, ``xml``, ``html``, ``xhtml``, ``svg``, ``json`` e ``csv``.
		. No caso de retorno ``csv``, os argumentos opcionais ``td`` e ``tr`` definem os caracteres que separam as colunas e as linhas, respectivamente.//FIXME md5 checksum hex**/
		content: {
			value: function(type) {
				if (!this.done || this._source === null) return null;
				let value = this._request[(this._source === "path" ? "responseText" : "result")];
				try {
					let paser = new DOMParser();
					let chars = __Type(value).chars;

					switch(type) {
						case "text":
							return chars ? value : null;
						case  "xml":
							return chars ? paser.parseFromString(value, "application/xml") : null;
						case "html":
							return chars ? paser.parseFromString(value, "text/html") : null;
						case "xhtml":
							return chars ? paser.parseFromString(value, "application/xhtml+xml") : null;
						case "svg":
							return chars ? paser.parseFromString(value, "image/svg+xml") : null;
						case "json":
							return chars ? JSON.parse(value) : null;
						case "csv":
							return chars ? __String(value).csv() : null;
					}
					return this._source === "path" ? this._request.response : value;
				} catch(e) {return null;}
			}
		},
		/**. ``''void'' _reset()``: Reinicia valores para a requisição;**/
		_reset: {
			value: function() {
				this._time  = new Date().valueOf();
				this._start = this._time;
				this._done  = false;
				this._notfound = false;
				if (this._source === "path")
					this._request.timeout = this.maxtime;
			}
		},
		/**. ``''void'' send(void data, string method="POST")``: Envia uma requisição web.
		. Os argumentos opcionais ``data`` e ``method`` definem o pacote de dados a ser enviado e o tipo do envio, ``GET``ou ``POST``, respectivamente.**/
		send: {
			value: function(data, method) {
				if (this._source !== "path") return null;
				let check  = __Type(data);
				let action = this._target.replace(/\#.+$/, "");
				method = String(method).trim().toUpperCase();
				if (method === "GET") {
					try {
						if (check.nonempty) {
							data   = String(data).trim();
							action = action.indexOf("?") < 0 ? action+"?"+data : action+"&"+data;
						}
						this._reset();
						__MODALCONTROL.start();
						this._request.open("GET", action, true);
						this._request.send(null);
					} catch(e) {return null;}
				} else {
					try {
						this._reset();
						__MODALCONTROL.start();
						this._request.open("POST", this._target, true);
						if (check.nonempty)
							this._request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
						this._request.send(data);
					} catch(e) {return null;}
				}
			}
		},
		/**. ``''void'' read(string readAs)``: Lê o conteúdo de um arquivo (objeto ``File``).
		. O argumento opcional ``readAs`` define o modo de leitura, que pode ser ``binary``, ``text`` ou ``buffer``. Se omitido, será atribído de acordo com o tipo do arquivo ou ``binary``.**/
		read: {
			value: function(readAs) {
				if (this._source !== "file") return null;
				let mode = {
					binary: "readAsBinaryString", buffer: "readAsArrayBuffer",
					text:   "readAsText",         audio:  "readAsDataURL",
					video:  "readAsDataURL",      image:  "readAsDataURL",
					url:    "readAsDataURL"
				};

				let mime = String(this._target.type).split("/")[0].toLowerCase();
				if (!(mime in mode)) mime = "binary";
				let type = readAs in mode ? mode[readAs] : mode[mime];
				try {
					this._reset();
					__MODALCONTROL.start();
					this._request[type](this._target);
				} catch(e) {return null;}
			}
		}
	});

/*============================================================================*/
	/**### Figuras
	###### ``**constructor** ''object'' __SVG(''number'' width=100, ''number'' height=100, ''number'' xmin=0, ''number'' ymin=0)``
	Construtor de imagens SVG.
	Os argumentos são opcionais e estão relacionados ao atributo [``viewBox``]<https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox> do elemento SVG.
	{**/
	function __SVG(width, height, xmin, ymin) {
		if (!(this instanceof __SVG)) return new __SVG(width, height, xmin, ymin);
		let svg  = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		let vbox = [xmin, ymin, width, height];
		let main = [0, 0, 100, 100];
		vbox.forEach(function (v,i,a) {
			let check = __Type(v);
			a[i] = check.finite ? Math.abs(check.value) : main[i];
		});
		svg.setAttribute("viewBox", vbox.join(" "));
		Object.defineProperties(this, {
			_svg:  {value: svg},
			_last: {value: svg, writable: true}
		});

		//FIXME apagar isso depois de pronto
		//let x = document.getElementById("html-block");
		let x = document.body;
		x.className = "";
		x.style = null;
		x.innerHTML = "";
		x.appendChild(svg);
		//x.style.width =  "auto";
		//x.style.margin =  "0 40% 0 40%";
	}

	Object.defineProperties(__SVG.prototype, {
		constructor: {value: __SVG},
		/**. ``''node'' last``: Define ou retorna o último nó adicionado ao SVG.**/
		last: {
			get: function()  {return this._last;},
			set: function(svg) {
				this._svg.appendChild(svg);
				this._last = svg;
			}
		},
		/**. ``''object'' attribute(object attr)``: Define os atributos do último elemento adicionado e retorna o próprio objeto.
		- O argumento ``attr`` é um objeto cujas chaves representam o valor do atributo e seu respectivo valores.**/
		attribute: {
			value: function(attr) {
				for (let i in attr) this.last.setAttribute(i, attr[i]);
				return this;
			}
		},
		/**. ``''object'' title(string value)``: Define um título (dica) ao último elemento adicionado e retorna o próprio objeto.
		- O argumento ``value`` é o texto da dica.**/
		title: {
			value: function(value) {
				let svg = document.createElementNS("http://www.w3.org/2000/svg", "title");
				svg.textContent = value;
				this.last.appendChild(svg);
				return this;
			}
		},
		/**. ``''object'' lines(''array'' x, ''array'' y, ''boolean'' close=false)``: Define diversos segmentos de reta a partir de um conjunto de coordenadas e retorna o próprio objeto.
		. Os argumentos ``x`` e ``y`` são as coordenadas (x,y) e o argumento ``close`` indica se o último ponto deve voltar à origem.**/
		lines: {
			value: function(x, y, close) {
				let svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let line = x.slice();
				line.forEach(function(v,i,a) {
					a[i] = [(i === 0 ? "M" : "L"), v, y[i]].join(" ");
				});
				if (close === true) x.push("Z");
				this.last = svg;
				return this.attribute({d: line.join(" ")});
			}
		},
		/**. ``''object'' circle(number cx, number cy, number r)``: Define um círculo e retorna o próprio objeto.
		. Os argumentos ``cx``, ``cy`` e ``r`` são o centro em x e y e o raio, respectivamente.**/
		circle: {
			value: function(cx, cy, r) {
				let svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
				this.last = svg;
				return this.attribute({cx: cx, cy: cy, r: r});

			}
		},
		/**. ``''object'' semicircle(number cx, number cy, number r, number start, number width)``: Define um semicírculo e retorna o próprio objeto.
		. Os argumentos ``cx``, ``cy`` e ``r`` são o centro em x e y e o raio, respectivamente. Os argumentos ``start`` e ``width`` indicam o ângulo inicial e seu tamanho, respectivamente.**/
		semicircle: {
			value: function(cx, cy, r, start, width) {//FIXME quanto width é negativo, o lance é diferente
				if (Math.abs(width) >= 360) return this.circle(cx, cy, r);
				let svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
				start  = 2*Math.PI*start/360;
				width  = 2*Math.PI*width/360;
				let x1 = cx + r*Math.cos(start);
				let y1 = cy - r*Math.sin(start);
				let x2 = cx + r*Math.cos(start + width);
				let y2 = cy - r*Math.sin(start + width);
				let lg = width > Math.PI ? 1 : 0;
				let  d = ["M", cx, cy, "L", x1, y1, "A", r, r, 0, lg, 0, x2, y2, "Z"];
				this.last = svg;
				return this.attribute({d: d.join(" ")});
			}
		},
		/**. ``''object'' rect(number x, number y, number width, number height)``: Define um retângulo e retorna o próprio objeto.
		. Os argumentos ``x`` e ``y`` definem o ponto de partida da figura e os argumentos ``width`` e ``height`` definem o comprimento e a altura do retângulo, respectivamente.**/
		rect: {
			value: function(x, y, width, height) {
				let svg   = document.createElementNS("http://www.w3.org/2000/svg", "rect");
				this.last = svg;
				return this.attribute({x: x, y: y, width: width, height: height});

			}
		},
		/**. ``''object'' path(string path)``: Define um nó SVG a partir de uma sequência de comandos e retorna o próprio objeto.
		. O argumento ``path`` define os comandos.**/
		path: {
			value: function(path) {
				let svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
				this.last = svg;
				return this.attribute({d: path});
			}
		},
		/**. ``''object'' text(number x, number y, string text, string point)``: Define um SVG textual e retorna o próprio objeto.
		. Os argumentos ``x``, ``y`` e ``text`` definem os pontos de referência (''x'', ''y'') e o valor do texto, respectivamente.
		. O argumento ``point`` define a âncora da referência, composta por dois grupos. O primeiro grupo define o posicionamento, ``v`` para vertical ou ``h``. O segundo grupo define o ponto cardeal:
		||Esquerda/Oeste|Centro|Direita/Leste|
		|**Topo/Norte**|nw|n|ne|
		|**Meio**|w|c|e|
		|**Baixo/Sul**|sw|s|se|**/
		text: {
			value: function(x, y, text, point) {
				let svg     = document.createElementNS("http://www.w3.org/2000/svg", "text");
				let vanchor = ["start", "middle", "end"];
				let vbase   = ["auto", "middle", "hanging"];
				let anchor  = {n: 1, ne: 2, e: 2, se: 2, s: 1, sw: 0, w: 0, nw: 0, c: 1};
				let base    = {n: 2, ne: 2, e: 1, se: 0, s: 0, sw: 0, w: 1, nw: 2, c: 1};
				let attr    = {
					x: point[0] === "v" ? -y : x,
					y: point[0] === "v" ? x : y,
					"text-anchor":       vanchor[anchor[point.substr(1)]],
					"dominant-baseline": vbase[base[point.substr(1)]],
					"transform":         point[0] === "v" ? "rotate(270)" : "",
				};
				svg.textContent = String(text).trim();
				this.last = svg;
				return this.attribute(attr);
			}
		},
		/**. ``''object'' ellipse(number cx, number cy, number rx, number ry)``: Define uma elípse e retorna o próprio objeto.
		. Os argumentos ``cx``, ``cy``, ``rx`` e ``ry`` definem o centro de referência em x e y e os raios de x e y, respectivamente.**/
		ellipse: {
			value: function(cx, cy, rx, ry) {
				let svg = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
				this.last = svg;
				return this.attribute({cx: cx, cy: cy, rx: rx, ry: ry});
			}
		},
		/**. ``''object'' frame(number x, number y, string text, string point)``: Funciona semelhante ao método ``text``, mas aceita quebra de linha e tabulação no início de cada linha. A primeira linha receberá uma formatação destacada, como um título.**/
		frame: {
			value: function(x, y, text, point) {
				this.text(x, y, "", point);
				let line = String(text).split("\n");
				let i = -1;
				while (++i < line.length) {
					let span  = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
					let style = {
						x:  i === 0 ? x : x+4,
						dy: i === 0 ? "0" : "1.5em",
						"font-weight": i === 0 ? "bold" : "normal"
					};
					span.textContent = line[i].trim();
					for (let j in style)
						span.setAttribute(j, style[j]);
					this.last.appendChild(span);
				}
				return this;
			}
		},
		/**. ``''node'' svg()``: Retorna o elemento SVG.**/
		svg: {
			value: function() {return this._svg;}
		},
	});
/*============================================================================*/
	/**### Análise de Dados

	#### Análise Quantitativa
	###### ``**constructor** ''object'' __Data2D(''array'' x, ''any'' y)``
	Análise de dados em duas dimensões.
	O argumento ``x`` corresponde a uma lista de valores (array) de referência que aceita valores numéricos, de tempo, data e data/tempo, conforme regras da biblioteca.
	O argumento ``y`` é a resposta em função de ``x``, podendo ser uma lista de valores numéricos (array), uma constante numérica ou uma função. No caso de função, ``y`` receberá o valor de ``y(x)``.
	Valores não finitos serão eliminados do conjunto ``(x, y)``.**/
	function __Data2D(x, y) {
		if (!(this instanceof __Data2D)) return new __Data2D(x, y);
		/* avaliando X */
		let xtest = __Type(x);
		if (!xtest.array) x = [];
		x = __Array(x).convert(function(n) {
			let check = __Type(n);
			if (check.finite)
				return check.value;
			if (check.date || check.time || check.datetime)
				return __DateTime(check.value).valueOf();
			return null;
		}, "finite");

		/* avaliando Y */
		let ytest = __Type(y);
		if (ytest.array)
			y = __Array(y).only("finite", true);
		else if (ytest.finite)
			y = __Array(x).convert(function(n) {return ytest.value;}, "finite");
		else if (ytest.function)
			y = __Array(x).convert(y, "finite");
		else
			y = [];

		/* igualando conjunto */
		let less = y.length < x.length ? y : x;
		let data = [];
		less.forEach(function(v,i,a) {
			if (x[i] === null || y[i] === null) return;
			data.push({x: x[i], y: y[i]});
		});

		/* ordenando em x */
		data.sort(function(a, b) {return a.x > b.x;});

		/* retornando valores */
		x     = [];
		y     = [];
		let i = -1;
		while (++i < data.length) {
			x.push(data[i].x);
			y.push(data[i].y);
		}
		Object.defineProperties(this, {
			_x:   {value: x},
			_y:   {value: y},
		});
	}

	Object.defineProperties(__Data2D.prototype, {
		constructor: {value: __Data2D},
		/**. ``''array'' x``: Retorna os valores do argumento ``x`` ajustado.**/
		x: {
			get: function() {return this._x;}
		} ,
		/**. ``''array'' y``: Retorna os valores do argumento ``y`` ajustado.**/
		y: {
			get: function() {return this._y;}
		},
		/**. ``''boolean'' error``: Se o conjunto tiver menos que um par de valores, retornará verdadeiro.**/
		error: {
			get: function() {return this._y.length < 2 || this._x.length < 2;}
		},
		/**. ``''object'' leastSquares``: Aplica o método dos mínimos quadrados ao conjunto de dados e retorna objeto contendo o coeficiente angular ``a`` e o linear ``b`` de ``y = ax + b``.**/
		leastSquares: {
			get: function () {
				if (this.error) return {a: 0, b: 0};
				if ("_leastSquares" in this) return this._leastSquares;
				let x     = this.x;
				let y     = this.y;
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
				this._leastSquares = data;
				return this.leastSquares;
			}
		},
		/**. ``''object'' standardDeviation``: Retorna o desvio padrão entre o conjunto de dados.**/
		standardDeviation: {
			get: function() {
				if (this.error) return Infinity;
				if ("_standardDeviation" in this) return this._standardDeviation;
				let data = [];
				let i    = -1;
				while(++i < this.x.length)
					data.push(this.x[i] - this.y[i]);
				this._standardDeviation = Math.hypot.apply(null, data) / Math.sqrt(data.length);
				return this.standardDeviation;
			}
		},
		/**. ``''object'' linearFit``: Retorna um objeto contendo os dados da regressão linear ou ``null`` em caso de erro.
		. O objeto retornado possui as chaves ``t`` (tipo/nome da regressão); ``a`` e ``b`` (coeficientes da regressão); ``f`` (função da regressão); ``d``: (desvio padrão), ``m`` (representação visual da regressão); e ``s`` (igual a ``m`` mas exibindo os coeficientes).**/
		linearFit: {
			get: function() {
				if (this.error) return null;
				if ("_linearFit" in this) return this._linearFit;
				let sqrs = this.leastSquares;
				let a    = sqrs.a;
				let b    = sqrs.b;
				let func = function(x) {return a*x + b;}
				let devi = __Data2D(this.y, __Array(this.x).convert(func, "finite")).standardDeviation;
				let math = "y = a x + (b) ± σ";
				let show = math.replace("a", a).replace("b", b).replace("σ", devi);
				this._linearFit = {
					t: "linear", a: a, b: b, f: func, d: devi, m: math, s: show};
				return this._linearFit;
			}
		},
		/**. ``''object'' geometricFit``: Retorna um objeto contendo os dados da regressão geométrica ou ``null`` em caso de erro.
		. O objeto retornado possui as mesmas caractrísticas de ``linearFit``. **/
		geometricFit: {
			get: function() {
				if (this.error) return null;
				if ("_geometricFit" in this) return this._geometricFit;
				let data = __Data2D(
					__Array(this.x).convert(Math.log, "finite"),
					__Array(this.y).convert(Math.log, "finite")
				);
				if (data.error) {
					this._geometricFit = null;
					return null;
				}
				let sqrs = data.leastSquares;
				let a    = Math.exp(sqrs.b);
				let b    = sqrs.a;
				let func = function(x) {return a*Math.pow(x, b);}
				let devi = __Data2D(this.y, __Array(this.x).convert(func, "finite")).standardDeviation;
				let math = "y = a x^(b) ± σ";
				let show = math.replace("a", a).replace("b", b).replace("σ", devi);
				this._geometricFit = {
					t: "geometric", a: a, b: b, f: func, d: devi, m: math, s: show
				};
				return this._geometricFit;
			}
		},
		/**. ``''object'' exponentialFit``: Retorna um objeto contendo os dados da regressão exponencial ou ``null`` em caso de erro.
		. O objeto retornado possui as mesmas caractrísticas de ``linearFit``. **/
		exponentialFit: {
			get: function() {
				if (this.error) return null;
				if ("_exponentialFit" in this) return this._exponentialFit;
				let data = __Data2D(
					this.x,
					__Array(this.y).convert(Math.log, "finite")
				);
				if (data.error) {
					this._exponentialFit = null;
					return null;
				}
				let sqrs = data.leastSquares;
				let a    = Math.exp(sqrs.b);
				let b    = sqrs.a;
				let func = function(x) {return a*Math.exp(b*x);}
				let devi = __Data2D(this.y, __Array(this.x).convert(func)).standardDeviation;
				let math = "y = a exp(b x) ± σ";
				let show = math.replace("a", a).replace("b", b).replace("σ", devi);
				this._exponentialFit = {
					t: "exponential", a: a, b: b, f: func, d: devi, m: math, s: show
				};
				return this._exponentialFit;
			}
		},
		/**. ``''object'' logarithmicFit``: Retorna um objeto contendo os dados da regressão logarítmica ou ``null`` em caso de erro.
		. O objeto retornado possui as mesmas caractrísticas de ``linearFit``.**/
		logarithmicFit: {
			get: function() {
				if (this.error) return null;
				if ("_logarithmicFit" in this) return this._logarithmicFit;
				let data = __Data2D(
					this.x,
					__Array(this.y).convert(Math.exp, "finite")
				);
				if (data.error || data.geometricFit === null) {
					this._logarithmicFit = null;
					return null;
				}
				let sqrs = data.geometricFit;
				let a    = sqrs.b;
				let b    = Math.pow(sqrs.a, 1/sqrs.b);
				let func = function(x) {return a*Math.log(b*x);}
				let devi = __Data2D(this.y, __Array(this.x).convert(func)).standardDeviation;
				let math = "y = a ln(b x) ± σ";
				let show = math.replace("a", a).replace("b", b).replace("σ", devi);
				this._logarithmicFit = {
					t: "logarithmic", a: a, b: b, f: func, d: devi, m: math, s: show
				};
				return this._logarithmicFit;
			}
		},
		/**. ``''object'' minDeviation``: Retorna o objeto contendo os dados da regressão com o menor valor de desvio padrão.**/
		minDeviation: {
			get: function() {
				if (this.error) return null;
				if ("_minDeviation" in this) return this._minDeviation;
				let fit = [
					"linearFit", "geometricFit", "exponentialFit", "logarithmicFit"
				];
				let best = {value: Infinity, name: null};
				let i = -1;
				while (++i < fit.length) {
					let id = fit[i];
					if (this[id] !== null && this[id].d < best.value) {
						 best.value = this[id].d;
						 best.name  = id;
					}
				}
				this._minDeviation = best.name === null ? null : this[best.name];
				return this._minDeviation;
			}
		},
		/**. ``''number'' area``: Retorna a soma da área entre a reta que liga as coordenadas e o eixo ``y`` em zero ou ``null`` em caso de falha.**/
		area: {
    	get: function() {
	    	if (this.error) return null;
				if ("_area" in this) return this._area;
				let x    = this.x;
				let y    = this.y;
				let area = 0;
				let i    = 0;
				while (++i < x.length)
					area += (y[i]+y[i-1])*(x[i]-x[i-1])/2;
				this._area = area;
				return this._area;
		  }
    },
    /**. ``''number'' average``: Retorna a média do valor obtido com o atributo ``area`` ou ``null`` em caso de falha.**/
    average: {
    	get: function() {
    		if (this.area === null) return null;
    		if ("_average" in this) return this._average;
    		let data = __Array(this.x);
    		let div  = data.max - data.min;
    		this._average = div === 0 ? null : this.area / div;
    		return this._average;
    	}
    },
    /**
    . ``''object'' datetime``: retorna um objeto com as informações de data, tempo e data/tempo (chaves ``date``, ``time`` e ``datetime``) dos valores do eixo ``x``.**/
    datetime: {
    	get: function() {
    		if (this.error) return null;
    		if ("_datetime" in this) return this._datetime;
    		let data = {time: [], date: [], datetime: []};
    		let i    = -1;
    		while(++i < this.x.length) {
    			let dt = __DateTime(this.x[i]);
    			data.time.push(dt.toTimeString());
    			data.date.push(dt.toDateString());
    			data.datetime.push(dt.toString());
    		}
    		this._datetime = data;
    		return this._datetime;
    	}
    }
	});
/*============================================================================*/









	/**#### Análise Gráfica
	###### ``**constructor** ''object'' __Plot2D(''boolean'' ratio=false)``
	Objeto para preparar dados para construção de gráfico 2D.
	O argumento ``ratio``, se falso, define que o gráfico será de coordenadas no plano cartesiano e, se verdadeiro, será de grandezas proporcionais (circular ou colunas)**/
	function __Plot2D(ratio) {
		if (!(this instanceof __Plot2D)) return new __Plot2D(ratio);
		Object.defineProperties(this, {
			_ratio:  {value: ratio === true},               /* tipo do gráfico */
			_title:  {value: "Title",   writable: true},    /* título do gráfico */
			_xLabel: {value: "X Label", writable: true},    /* nome do eixo x */
			_yLabel: {value: "Y Label", writable: true},    /* nome do eixo y */
			_xAxis:  {value: "number",  writable: true},    /* tipo de dado do eixo x */
			_color:  {value: -1,        writable: true},    /* controle de cores */
			_data:   {value: []},                           /* dados adicionados para plotagem */
			_min:    {value: {x: +Infinity, y: +Infinity}}, /* menor valor de x,y */
			_max:    {value: {x: -Infinity, y: -Infinity}}, /* maior valor de x,y */

		});
	}

	Object.defineProperties(__Plot2D.prototype, {
		constructor: {value: __Plot2D},
		/**. ``''number'' _xMax``: Define ou retorna o maior valor da coordenada ``x``.**/
		_xMax: {
			get: function()  {return this._max.x;},
			set: function(x) {if (x > this._max.x) this._max.x = x;}
		},
		/**. ``''number'' _yMax``: Define ou retorna o maior valor da coordenada ``y``.**/
		_yMax: {
			get: function()  {return this._max.y;},
			set: function(y) {if (y > this._max.y) this._max.y = y;}
		},
		/**. ``''number'' _xMin``: Define ou retorna menor valor da coordenada ``x``.**/
		_xMin: {
			get: function()  {return this._min.x;},
			set: function(x) {if (x < this._min.x) this._min.x = x;}
		},
		/**. ``''number'' _xMin``: Define ou retorna menor valor da coordenada ``y``.**/
		_yMin: {
			get: function()  {return this._min.y;},
			set: function(y) {if (y < this._min.y) this._min.y = y;}
		},
		/**. ``''number'' _xScale``: Transforma a coordenada horizontal de real para gráfica.**/
		_xScale: {
			value: function(x) {
				let dx = this._xMax - this._xMin;
				let dX = this._cfg.xSize;
				let  X = ((x - this._xMin)*(dX/dx)) + this._cfg.xStart;
				return X;
			}
		},
		/**. ``''number'' _yScale``: Transforma a coordenada vertical de real para gráfica.**/
		_yScale: {
			value: function(y) {
				let dy = this._yMax - this._yMin;
				let dY = -this._cfg.ySize;
				let  Y = ((y - this._yMin)*(dY/dy)) + this._cfg.yClose;
				return Y;
			}
		},
		/**. ``''number'' _dx``: Retorna o menor valor real de ``x``.**/
		_dx: {
			get: function() {
				return Math.abs(this._xMax - this._xMin)/this._cfg.xSize;
			}
		},
		/**. ``''array'' _xSpace``: Retorna uma lista contendo todos os valores possíveis de ``x``**/
		_xSpace: {
			get: function() {
				let x   = [this._xMin];
				let max = this._xMax;
				let dx  = this._dx;
				let end = false;
				while (!end) {
					let value = x[x.length - 1] + dx;
					x.push(value <=  max ? value : max);
					end = value >= max;
				}
				return x;
			}
		},
		/**. ``''object'' _cfg``: Registra as configurações do gráfico:
		.. ``''number'' vertical``: registra o menor tamanho da tela do dispositivo como referência.
		.. ``''number'' horizontal``: registra o maior tamanho da tela do dispositivo como referência.
		.. ``''number'' xInit``: Registra o início do eixo ``x`` (horizontal) em porcentagem.
		.. ``''number'' xEnd``: Registra o fim do eixo ``x`` (horizontal) em porcentagem.
		.. ``''number'' yInit``: Registra o início do eixo ``y`` (vertical) em porcentagem.
		.. ``''number'' yEnd``: Registra o fim do eixo ``y`` (vertical) em porcentagem.
		.. ``''number'' points``: Número de pontos no gráfico.
		.. ``''number'' padd``: Define um valor para espaçamento relativo.
		.. ``''number'' width``: Registra o tamanho referencial horizontal do gráfico.
		.. ``''number'' height``: Registra o tamanho referencial vertical do gráfico (proporcional à tela e ao tamanho).
		.. ``''number'' xStart``: Coordenada horizontal da origem do gráfico.
		.. ``''number'' xSize``: Tamanho do eixo ``x``.
		.. ``''number'' xMiddle``: Metade do eixo ``x``.
		.. ``''number'' xClose``: Fim do eixo ``x``.
		.. ``''number'' yStart``: Coordenada vertical da origem do gráfico.
		.. ``''number'' ySize``: Tamanho do eixo ``y``.
		.. ``''number'' yMiddle``: Metade do eixo ``y``.
		.. ``''number'' yClose``: Fim do eixo ``y``.
		.. ``''number'' top``: A metade do espaço superior.
		.. ``''number'' bottom``: A metade do espaço inferior.
		.. ``''number'' left``: A metade do espaço esquerdo.
		.. ``''number'' right``: A metade do espaço direito.
		.. ``''number'' padding``: Retorna o espaçamento definido.
		.. ``''array'' colors``: Lista de cores.**/
		_cfg: {
			value: {
				vertical:   Math.min(window.screen.width, window.screen.height),
				horizontal: Math.max(window.screen.width, window.screen.height),
				xInit:      0.10,
				xEnd:       0.90,
				yInit:      0.10,
				yEnd:       0.85,
				points:     5.00,
				padd:       0.01,
				width:      1000,
				get height()  {return this.width * (this.vertical / this.horizontal);},
				get xStart()  {return this.xInit * this.width;},
				get xClose()  {return this.xEnd * this.width;},
				get xSize()   {return this.xClose - this.xStart;},
				get xMiddle() {return this.xStart + (this.xSize/2);},
				get yStart()  {return this.yInit * this.height;},
				get yClose()  {return this.yEnd * this.height;},
				get ySize()   {return this.yClose - this.yStart;},
				get yMiddle() {return this.yStart + (this.ySize/2);},
				get top()     {return this.yStart/2;},
				get bottom()  {return this.yClose + (this.height - this.yClose)/2;},
				get left()    {return this.xStart/2;},
				get right()   {return this.xClose + (this.width - this.xClose)/2;},
				get padding() {return this.padd*this.width;},
				colors: [
					"darkred",   "indigo",          "navy",           "teal",
					"crimson",   "mediumslateblue", "dodgerblue",     "yellowgreen",
					"deeppink",  "purple",          "cornflowerblue", "darkgreen",
					"orangered", "blueviolet",      "cyan",           "limegreen",
					"dimgray"
				],
				_svg:      {style: "background-color: Ivory; margin: 20%"},
				_title:    {fill: "black", "font-weight": "bold", "font-size": "1.5em"},
				_label:    {fill: "black"},
				_area:     {stroke: "black", fill: "none", "stroke-width": 2, "stroke-linecap": "round"},
				_internal: {stroke: "grey", "stroke-width": 0.5, "stroke-dasharray": "6,6", "stroke-linecap": "round"},
				_subtitle: {"stroke-width": 1, "stroke": "black", style: "cursor: help"},
				_line:     {fill: "none", "stroke-width": 3, "stroke-linecap": "round"},
				_sum:      {"fill-opacity": 0.5, "stroke-width": 3, "stroke-linecap": "round"},
				_dash:     {fill: "none", "stroke-width": 1, "stroke-linecap": "round", "stroke-dasharray": "5,5"},


			}
		},
		/**. ``''void'' _plan()``: Constrói a área do gráfico cartesiano.**/
		_plan: {
			value: function(svg) {
				svg
				.text( /* título */
					this._cfg.xMiddle,
					this._cfg.top,
					this.title,
					"hc"
				).attribute(this._cfg._title)
				.text( /* rótulo do eixo x */
					this._cfg.xMiddle,
					this._cfg.height-this._cfg.padding,
					this.xLabel,
					"hs"
				).attribute(this._cfg._label)
				.text( /* rótulo do eixo y */
					this._cfg.padding,
					this._cfg.yMiddle,
					this.yLabel,
					"vn"
				).attribute(this._cfg._label)
				.rect( /* área do gráfico */
					this._cfg.xStart,
					this._cfg.yStart,
					this._cfg.xSize,
					this._cfg.ySize
				).attribute(this._cfg._area);

 				/* subdivisões e escala */
				let div = {
					scale: {
						x:  this._xMin,
						y:  this._yMin,
						dx: (this._xMax - this._xMin)/(this._cfg.points - 1),
						dy: (this._yMax - this._yMin)/(this._cfg.points - 1),
					},
					point: {
						x:  this._cfg.xStart,
						y:  this._cfg.yClose, /* (invertido) */
						dx: this._cfg.xSize/(this._cfg.points - 1),
						dy: this._cfg.ySize/(this._cfg.points - 1),
					},
					padd: {
						x: this._cfg.xStart - this._cfg.padding,
						y: this._cfg.yClose + this._cfg.padding,
					},
					horizontal: [this._cfg.xStart, this._cfg.xClose],
					vertical:   [this._cfg.yStart, this._cfg.yClose],
					next: function() {
						this.scale.x += this.scale.dx;
						this.scale.y += this.scale.dy;
						this.point.x += this.point.dx;
						this.point.y -= this.point.dy; /* (invertido) */
					}
				};
				let i = -1;
				let p = this._cfg.points;

				while (++i < p) {
					if (i > 0 && i < p) {
						svg.lines( /* subdivisões horizontais */
							div.horizontal,
							[div.point.y, div.point.y]
						).attribute(this._cfg._internal)
						.lines( /* subdivisões verticais */
							[div.point.x, div.point.x],
							div.vertical
						).attribute(this._cfg._internal);
					}


					//FIXME verificar como exibir a escala (quantidade de caracteres)
					let print = function(value, type) {
						switch(type) {
							case "date":
								return __DateTime(value).toDateString();
							case "time":
								return __DateTime(value).toTimeString();
							case "datetime":
								return __DateTime(value).format("{YY}-{MM}-{DD} {hh}:{mm}");
						}
						let abs = Math.abs(value);
						let num = __Number(value);
						if (abs === 0)
							return num.notation("decimal", 2);
						if (abs > 100000 || abs < 1/100000)
							return num.notation("scientific", 1);

						return value;

					}

					svg.text( /* escala eixo x */
						div.point.x,
						div.padd.y,
						print(div.scale.x, this.xAxis),
						(i === 0 ? "hnw" : (i < (p - 1) ? "hn" : "hne"))
					).attribute(this._cfg._label)
					.title(div.scale.x)
					.text( /* escala eixo y */
						div.padd.x,
						div.point.y,
						print(div.scale.y),
						(i === 0 ? "hse" : (i < (p - 1) ? "he" : "hne"))
					).attribute(this._cfg._label)
					.title(div.scale.y);
					div.next();
				}
			}
		},

		_subtitle: {
			value: function(svg, text, color) {
				if (text === null) return;
				let colors = __Array(this._cfg.colors);
				let side   = 2*this._cfg.padding;
				let space  = 2*this._cfg.padding;
				let x      = this._cfg.right - this._cfg.padding;
				let y      = this._cfg.yStart + side + color * (side + space);
				let ncolor = colors.valueOf(color);

				svg.rect(x, y, side, side)
				.attribute({fill: ncolor})
				.attribute(this._cfg._subtitle)
				.title(text);
				svg.text(this._cfg.right,y-2,text.split("\n")[0], "hs")
				.title(text.split("\n")[0])
				.attribute({fill: ncolor, "font-size": "small"});
			}
		},



		plot: {
			value: function() {
				if (this._data.length === 0) return null;
				let data   = this._data.slice();
				let colors = __Array(this._cfg.colors);

				/* definindo a área do gráfico -------------------------------------- */
				let svg = __SVG(this._cfg.width, this._cfg.height);
				svg.attribute(this._cfg._svg).attribute({style: "border: 1px solid black;margin: 5em;"})

				/* redefinindo funções para array ----------------------------------- */
				if (!this._ratio) {
					let i = -1;
					let x = this._xSpace;
					while(++i < data.length) {
						if (!data[i].f) continue;
						let list = __Data2D(x, data[i].y);
						if (list === null) return false;
						data[i].x = list.x;
						data[i].y = list.y;
						let yList = __Array(data[i].y);
						this._yMin = yList.min;
						this._yMax = yList.max;
					}
				}

				/* plotando plano cartesiano ---------------------------------------- */
				if (!this._ratio) {
					let i = -1;
					while(++i < data.length) {
						/* obtendo dados da plotagem */
						let x     = data[i].x.slice();
						let y     = data[i].y.slice();
						let name  = data[i].name;
						let color = data[i].color;
						let self  = this;
						/* transformação de coordenadas reais para virtuais */
						x.forEach(function(v,i,a){a[i] = self._xScale(v);});
						y.forEach(function(v,i,a){a[i] = self._yScale(v);});
						/* plotando de acordo com o tipo de curva */
						if (data[i].type === "line" || data[i].type === "link") {
							svg.lines(x, y)
							.attribute(this._cfg._line)
							.attribute({stroke: colors.valueOf(color)})
							this._subtitle(svg, name, color);
						}
						if (data[i].type === "dash") {
							console.log(x, y);
							svg.lines(x, y)
							.attribute(this._cfg._dash)
							.attribute({stroke: colors.valueOf(color)});
							this._subtitle(svg, name, color);
						}
						if (data[i].type === "dots" || data[i].type === "link") {
							let j = -1;
							while(++j < x.length) {
								svg.circle(x[j], y[j], 3)
								.attribute({fill: colors.valueOf(color)})
								.title("("+data[i].x[j]+", "+data[i].y[j]+")");
							}
							this._subtitle(svg, name, color);
						}
						if (data[i].type === "sum") {
							let fit = __Data2D(data[i].x, data[i].y);
							name   += "\n∑ yΔx ≈ "+fit.area;
							x.unshift(x[0]);
							x.push(x[x.length - 1]);
							y.unshift(self._yScale(0));
							y.push(self._yScale(0));
							svg.lines(x, y, true)
							.attribute(this._cfg._sum)
							.attribute({stroke: colors.valueOf(color), fill: colors.valueOf(color)})
							.title(name);
							this._subtitle(svg, name, color);
						}
						if (data[i].type === "avg") {
							let fit = __Data2D(data[i].x, data[i].y);
							let avg = fit.average;
							let xi  = this._xScale(this._xMin);
							let xn  = this._xScale(this._xMax);
							let ya  = this._yScale(avg);

							svg.lines(x, y)
							.attribute(this._cfg._dash)
							.attribute({stroke: colors.valueOf(color)})
							.title(name);

							name += "\n(∑ yΔx)/ΔX ≈ "+avg;
							svg.lines([xi, xn], [ya, ya])
							.attribute(this._cfg._line)
							.attribute({stroke: colors.valueOf(color)})
							.title(name);
							this._subtitle(svg, name, color);
						}
					}
					this._plan(svg);
				}
				/* plotando gráfico proporcional ------------------------------------ */
				else {
					/* checando condições */
					let minus = false;
					let plus  = false;
					let zero  = true;
					let count = 0;
					let total = 0;
					for (let i in data[0]) {
						let value = data[0][i];
						count++;
						total += value;
						if (value < 0)   minus = true;
						if (value > 0)   plus  = true;
						if (value !== 0) zero  = false;
					}
					if (count === 0 || zero) return false;
					/* calculando proporções e definindo limites */
					this._xMin = 0;
					this._xMax = count;
					this._yMin = 0;
					this._yMax = 0;
					let pieces = [];
					for (let i in data[0]) {
						let value = data[0][i];
						pieces.push({
							value:  value,
							_value: __Number(value).notation(),
							ratio:  total === 0 ? null : value/total,
							_ratio: total === 0 ? null : __Number(value/total).notation("percent", 2),
							name: i
						});
						this._yMin = value;
						this._yMax = value;
					}

					/* gráfico de pizza ------------------------------------------------*/
					if (minus !== plus && total !== 0) {
						svg.text(this._cfg.xMiddle, this._cfg.top, this.title, "hc")
						.attribute(this._cfg._title);
						let start = 0;
						let width = 0;
						let i = -1;
						while (++i < pieces.length) {
							let item   = pieces[i];
							let title  = item.name+"\n"+this.yLabel+": "+item._value;
							let color  = colors.valueOf(i);
							let r      = this._cfg.ySize/2;
							let cx     = this._cfg.xMiddle;
							let cy     = this._cfg.yMiddle + this._cfg.top;
							width = 360*item.ratio;
							/* pedaço da pizza */
							svg.semicircle(cx, cy, r, start, width)
							.attribute({fill: color})
							.title(title);
							/* legenda */
							let m = start + width/2;
							let x = cx + (r + 5)*Math.cos(2*Math.PI*m/360);
							let y = cy - (r + 5)*Math.sin(2*Math.PI*m/360);
							let p;
							if      (m <  90) p = m ===   0 ? "hw" : "hsw";
							else if (m < 180) p = m ===  90 ? "hs" : "hse";
							else if (m < 270) p = m === 180 ? "he" : "hne";
							else if (m < 360) p = m === 270 ? "hn" : "hnw";
							svg.text(x, y, item.name+" ("+item._ratio+")", p)
							.attribute({fill: color})
							.title(title);
							/* iterando */
							start += width;
						}
						svg
						.text(
							this._cfg.right,
							this._cfg.height-this._cfg.padding,
							this.xLabel+": "+count,
							"hse"
						)
						.text(
							this._cfg.left,
							this._cfg.height-this._cfg.padding,
							this.yLabel+": "+__Number(total).notation(),
							"hsw"
						);
					}

					/* gráfico de barras -----------------------------------------------*/
					else {
						let width = this._cfg.xSize / count;
						let i = -1;
						while (++i < pieces.length) {
							let item  = pieces[i];
							let color = colors.valueOf(i);
							let x     = this._xScale(i);
							let y     = this._yScale(item.value >= 0 ? item.value : 0);
							let w     = width;
							let h     = Math.abs(this._yScale(item.value) - this._yScale(0));
							/* barra */
							svg.rect(x, y, w, h)
							.attribute({fill: color})
							.title(item.name+" ("+item._value+")");
							/* legenda */
							svg.text(
								x + width/2,
								item.value >= 0 ? (y+h+5) : (y-5),
								item.name,
								item.value >= 0 ? "hn" : "hs"
							)
							.attribute({fill: color});


						}

						svg.lines(
							[this._cfg.xStart, this._cfg.xClose],
							[this._yScale(0), this._yScale(0)]
						)
						.attribute({fill: "None", "stroke": "black"});


						//this._plan(svg);
					}
				}
				return svg.svg();
			}
		},














		/**. ``''string'' xLabel``: Define ou retorna o valor do rótulo do eixo x.**/
		xLabel: {
			get: function()  {return this._xLabel;},
			set: function(x) {this._xLabel = String(x);}
		},
		/**. ``''string'' yLabel``: Define ou retorna o valor do rótulo do eixo y.**/
		yLabel: {
			get: function()  {return this._yLabel;},
			set: function(x) {this._yLabel = String(x);}
		},
		/**. ``''string'' title``: Define ou retorna o valor do título do gráfico.**/
		title: {
			get: function()  {return this._title;},
			set: function(x) {this._title = String(x);}
		},
		/**. ``''string'' xAxis``: Define ou retorna o tipo de dado do eixo ``x``: ''number'', ''date'', ''time'' ou ''datetime''**/
		xAxis: {
			get: function()  {return this._xAxis;},
			set: function(x) {
				let values  = ["number", "date", "time", "datetime"];
				this._xAxis = values.indexOf(x) >= 0 ? x : "number";
			}
		},
		/**. ``''boolean'' add(''array'' x, ''any'' y, ''string'' name, ''string'' option)``: Adiciona dados para plotagem e retorna falso se não for possível processar a solicitação.
		. O argumento ``x`` pode ser uma lista de valores (numéricos ou data/tempo), uma lista de identificadores (numérico ou string), ou um objeto. No caso de plotagem no __plano cartesiano__, o argumento deve ser uma lista de valores e uma lista de identificadores ou um objeto no caso de gráfico proporcional. No caso de objeto, os atributos serão os identificadores e seus valores definirão o argumento ``y``.
		. O argumento ``y`` pode ser uma __função__, uma __constante__ ou uma lista de __valores numéricos__ no caso de gráfico cartesiano. No caso de gráfico proporcional, uma lista de valores correspondentes aos identificadores informados em ``x``. No caso de gráfico proporcional, se ``x`` for um objeto, ``y`` será ignorado.
		. O argumento ``name`` é utilizado para identificar o gráfico no caso de plano cartesiano.
		. O argumento ``option`` é opcional e direcionado para o gráfico de plano cartesiano com valores de ``x`` e ``y`` como array. Seus valores podem ser:
		|Valor|Descrição|
		|linearFit|Traça a regressão linear.|
		|geometricFit|Traça a regressão geométrica.|
		|logarithmicFit|Traça a regressão logarítmica.|
		|exponentialFit|Traça a regressão exponencial.|
		|minDeviation|Traça a a regressão com o menor valor de desvio padrão.|
		|average|Traça o valor médio.|
		|area|Traça a área.|
		|line|Traça uma linha.|**/
		add: {
			value: function(x, y, name, option) {
				let xdata = __Type(x);
				let ydata = __Type(y);

				/*----------------------------------------------------------------------
					gráfico proporcional
				----------------------------------------------------------------------*/
				if (this._ratio) {
					if (this._data.length === 0) this._data.push({});
					let data = this._data[0];

					/* objeto ----------------------------------------------------------  */
					if (xdata.object) {
						for (let name in x) {
							let check = __Type(x[name]);
							if (!check.finite) continue;
							data[name] = check.value + (name in data ? data[name] : 0);
						}
						return true;
					}
					/* array ---------------------------------------------------------- */
					else if (xdata.array && ydata.array) {
						let i   = -1;
						let obj = {};
						while (++i < x.length) {
							if (i >= y.length) break;
							obj[String(x[i])] = y[i];
						}
						return this.add(obj);
					}
					return false;
				}
				/*----------------------------------------------------------------------
					gráfico cartesiano
				----------------------------------------------------------------------*/
				else {
					/* checando dados */
					let data  = __Data2D(x, y);
					if (data.error) return false;
					/* defindo curvas */
					option    = String(option).trim();
					let types = {
						function: {sum: "sum", avg: "avg", line: "line", main: "line"},
						finite:   {main: "line"},
						array:    {sum: "sum", avg: "avg", line: "line", link: "link", main: "link"},
						fit:      {
							linear:    "linearFit",    exponential: "exponentialFit",
							geometric: "geometricFit", logarithmic: "logarithmicFit",
							minimum:   "minDeviation"
						}
					};
					/* definindo previamente os limites superiores e inferiores */
					let xLimit = __Array(data.x);
					let yLimit = ydata.array ? __Array(data.y) : null;
					this._xMin = xLimit.min;
					this._xMax = xLimit.max;
					if (yLimit !== null) {
						this._yMin = yLimit.min;
						this._yMax = yLimit.max;
					}
					/* definindo limites superiores e inferiores no caso de área */
					if (option === "sum") {
						this._xMin = 0;
						this._xMax = 0;
					}

					/* Y é função ------------------------------------------------------- */
					if (ydata.function) {
						let curve = types.function;
						this._data.push({
							x:     [xLimit.min, xLimit.max],
							y:     y,
							name:  String(name),
							f:     true,
							type:  option in curve ? curve[option] : curve.main,
							color: ++this._color
						});
						return true;
					}
					/* Y é constante ---------------------------------------------------- */
					else if (ydata.finite) {
						let curve = types.finite;
						this._data.push({
							x:     [xLimit.min, xLimit.max],
							y:     [y, y],
							name:  String(name),
							f:     false,
							type:  option in curve ? curve[option] : curve.main,
							color: ++this._color
						});
						return true;
					}
					/* Y é array -------------------------------------------------------- */
					else if (ydata.array) {
						let curve = types.array;
						this._data.push({
							x:     data.x,
							y:     data.y,
							name:  String(name).trim(),
							f:     false,
							type:  option in curve ? curve[option] : curve.main,
							color: ++this._color
						});
						/* regressões ----------------------------------------------------- */
						if (option in types.fit) {
							let fit = data[types.fit[option]];
							if (fit === null) return false;
							let target = this._data.length - 1;
							this._data[target].name += [
								"\n", fit.m, "a = "+fit.a, "b = "+fit.b, "σ = "+fit.d
							].join("\n");
							this._data[target].type = "dots";

							/* função principal */
							this._data.push({
									x:     [xLimit.min, xLimit.max],
									y:     fit.f,
									name:  null,
									f:     true,
									type:  "line",
									color: this._color
							});
							/* desvio padrão */
							if (fit.d === 0) return true;
							this._data.push({
									x:     [xLimit.min, xLimit.max],
									y:     function(x) {return fit.f(x)+fit.d;},
									name:  null,
									f:     true,
									type:  "dash",
									color: this._color
							});
							this._data.push({
									x:     [xLimit.min, xLimit.max],
									y:     function(x) {return fit.f(x)-fit.d;},
									name:  null,
									f:     true,
									type:  "dash",
									color: this._color
							});
						}
						return true;
					}
				}
				return false;
			}
		},




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
			__MODALCONTROL.progress(data.progress);
			if (status === "ABORTED") request.abort();
			if (callback !== null)    callback(data);
		}

		function state_change(x) { /* disparador: mudança de estado */
			if (request.readyState < 1) return;
			if (data.closed) return;
			if (data.status === "UNSENT") {
				data.status = "OPENED";
				__MODALCONTROL.start();
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
				__MODALCONTROL.end();
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
	

/*----------------------------------------------------------------------------*/
	function wd_notify(title, msg) { /* exibe uma notificação, se permitido */
		if (!("Notification" in window))
			return __SIGNALCONTROL.open(msg, title);
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
				for (let i in value) {
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
					__SIGNALCONTROL.open(this.e.validationMessage, "");
					elem.focus();
				} else {
					__SIGNALCONTROL.open(this.e.dataset.wdErrorMessage, "");
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


















//FIXME TRASH apagar após reestruturação
	function __strCamel(x) {return __String(x).camel;}
	function __strClear(x) {return __String(x).clear;}
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

	function __finite(value) {
		let input = __Type(value);
		return input.finite;
	}
	function __integer(value) {
		let input = __Type(value);
		if (input.type !== "number") return null;
		if (!input.finite) return input.value;
		return (input < 0 ? -1 : 1) * Math.trunc(Math.abs(input.value));
	}
	function __decimal(value) {
		let input = __Type(value);
		if (input.type !== "number") return null;
		if (!input.finite) return input.value;
		let exp = 1;
		while ((input * exp)%1 !== 0) exp = 10*exp;
		return (exp*(input.value) - exp*__integer(input.value)) / exp;
	}
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
	function __prime(value) {
		let input = __Type(value);
		if (!input.finite || input < 2 || __decimal(input.value) !== 0) return false;
		let list = __primes(input.value);
		return list[list.length - 1] === input.value ? true : false;
	};
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
	function __notation(value, lang, type, code) {
		let input = __Type(value);
		if (input.type !== "number") return null;
		if (!input.finite) return input.value.toString();

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
				minimumIntegerDigits: code,
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
			return input.value.toLocaleString(lang, (type in types ? types[type] : {}));
		} catch(e) {}
		try {
			input.value.toLocaleString(undefined, (type in types ? types[type] : {}));
		} catch (e) {}
		return input.value.toLocaleString();
	}
	function wd_no_spaces(txt, char) { /* Troca múltiplos espaço por um caracter*/
		return txt.replace(/\s+/g, (char === undefined ? " " : char)).trim();
	};
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
				__SIGNALCONTROL.open(this.toString(), title);
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
		version: {value: __VERSION},
		$:       {value: function(css, root) {return WD(__$(css, root));}},
		$$:      {value: function(css, root) {return WD(__$$(css, root));}},
		url:     {value: function(name) {return wd_url(name);}},
		copy:    {value: function(text) {return wd_copy(text);}},
		lang:    {get:   function() {return wd_lang();}},
		device:  {get:   function() {return __device();}},
		today:   {get:   function() {return WD(new Date());}},
		now:     {get:   function() {return WD(wd_str_now());}},
		type:    {value: function(x){return __Type(x);}},

		form: {value: function(){return __Node.apply(null, Array.prototype.slice.call(arguments));}},
		array: {value: function(){return __Array.apply(null, Array.prototype.slice.call(arguments));}},
		datetime: {value: function(){return __DateTime.apply(null, Array.prototype.slice.call(arguments));}},
		node: {value: function(){return __Node.apply(null, Array.prototype.slice.call(arguments));}},
		number: {value: function(){return __Number.apply(null, Array.prototype.slice.call(arguments));}},
		string: {value: function(){return __String.apply(null, Array.prototype.slice.call(arguments));}},
		arr: {value: function(){return __setHarm.apply(null, Array.prototype.slice.call(arguments));}},
		data2D: {value: function(){return __Data2D.apply(null, Array.prototype.slice.call(arguments));}},
		plot: {value: function(){return __Plot2D.apply(null, Array.prototype.slice.call(arguments));}},
		test: {value: function(){return __setUnique.apply(null, Array.prototype.slice.call(arguments));}},
		send: {value: function(){return __Request.apply(null, Array.prototype.slice.call(arguments));}},
		query: {value: function(){return __Query.apply(null, Array.prototype.slice.call(arguments));}},
		svg: {value: function(){return __SVG.apply(null, Array.prototype.slice.call(arguments));}},
		matrix: {value: function(){return __Table.apply(null, Array.prototype.slice.call(arguments));}},
		

		device: {value: __DEVICECONTROLLER}
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
		__COUNTERCONTROL.load++;
		/* limpar atributo para evitar repetições desnecessárias e limpar conteúdo */
		target.data({wdLoad: null}).load("");
		/* carregar arquivo e executar */
		exec.send(file, function(x) {
			if (x.closed) {
				/* encerrar contagem */
				__COUNTERCONTROL.load--;
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
		__COUNTERCONTROL.repeat++;
		/* limpar atributo para evitar repetições desnecessárias e limpar conteúdo */
		target.data({wdRepeat: null}).repeat([]);

		/* carregar arquivo e executar */
		exec.send(file, function(x) {
			if (x.closed) {
				let json = x.json;
				let csv  = x.csv;
				/* fechar contagem */
				__COUNTERCONTROL.repeat--;

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
		__device_controller = __device();

		/* construindo CSS da biblioteca */
		let css = [];
		for(let i = 0; i < __JSCSS.length; i++) {
			let selector = __JSCSS[i].s;
			let dataset  = __JSCSS[i].d;
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
		if (__COUNTERCONTROL.repeat > 0) return;

		/* 2) processar carregamentos */
		WD.$$("[data-wd-load]").run(data_wdLoad);
		if (__COUNTERCONTROL.load > 0) return;

		/* 3) se repetições e carregamentos terminarem, organizar */
		organizationProcedures();

		return;
	};

/*----------------------------------------------------------------------------*/
	function scalingProcedures(ev) { /* procedimentos para definir dispositivo e aplicar estilos */
		let device = __device();
		if (device !== __device_controller) {
			__device_controller = device;
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
			}, __KEYTIMERANGE);
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
			if (now >= (time+__KEYTIMERANGE)) { /*D*/
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
