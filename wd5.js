/* wd5.js https://github.com/wdonadelli/wd
 *
 * Copyright 2023-2024 Willian Donadelli <wdonadelli@github.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * SPDX-License-Identifier: MIT
 */

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
	/**###### ``**const** ''boolean'' __UNDERMAINTENANCE``
	Se verdadeiro, libera métodos de teste em WD para efetuar testes.**/
	const __UNDERMAINTENANCE = true;
/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''object'' __DEVICECONTROLLER``
	Controla as alterações da tela atribuida a um tipo de dispositivo e executa ações quando houver mudança neste dispositivo idealizado.**/
	console.log(window.innerWidth);
	const __DEVICECONTROLLER = {
		/**. ``''boolean'' _start``: Informar se o controlador já foi iniciado.**/
		_start: false,
		/**. ``''function'' _change``: Registra a função disparadora de alteração do tipo de dispositivo.**/
		_change: null,
		/**. ``''string'' _device``: Registra o tipo de do dispositivo a partir do tamanho da tela em vigor.**/
		_device: null,
		/**. ``''integer'' width``: Retorna o tamanho da tela.**/
		get width() {return window.innerWidth;},
		/**. ``''string'' device``: Retorna o tipo de dispositivo - desktop (&ge; 768px) tablet (&ge; 600px) ou phone (&lt; 600px)**/
		get device() {
			let width = this.width;
			if (width >= 768) return "desktop";
			if (width >= 600) return "tablet";
			return "phone";
		},
		/**. ``''boolean'' mobile``: Informa se dispositivo não é do tamanho desktop.**/
		get mobile() {return this.device !== "desktop";},
		/**. ``''void'' onchange``: Define a função disparadora do evento de mudança de tipo de dispositivo.**/
		set onchange(x) {
			this._change = typeof x === "function" ? x : null;
			this._device = null;
			this.trigger(null);
			/*-- o evento resize será definido quando a função disparadora for informada pela primeira vez --*/
			if (!this._start) {
				let object = this;
				window.addEventListener("resize", function(ev) {return object.trigger(ev);});
				this._start = true;
			}
		},
		/**. ``''void'' trigger()``: Chama a função disparadora injetando como argumento os atributos do objeto e do evento resize.**/
		trigger: function(ev) {
			/*-- checar alteração de dispositivo --*/
			let device = this.device;
			if (this._device === device) return;
			this._device = device;
			/*-- chamar função disparadora --*/
			if (typeof this._change === "function")
				this._change({
					event:   ev,
					target:  this,
					width:   this.width,
					device:  device,
					mobile:  this.mobile,
					trigger: this.trigger,
				});
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
	Controla a janela modal.**/
	const __MODALCONTROL = {
		/**. ``''integer'' counter``: Solicitações em aberto (controla a exibição), fecha se zero.**/
		counter: 0,
		/**. ``''integer'' delay``: Tempo de segurança, em milisegundos, para decidir sobre o fechamento da janela (evitar piscadas).**/
		delay: 250,
		/**. ``''integer'' time``: Intervalo, em milisegundos, de atualização da barra de progresso.**/
		time: 5,
		/**. ``''node'' modal``: Plano de fundo.**/
		modal: (function() {
			/* Estilos */
			let styles = {
				modal: {
					display: "block", width: "100%", height: "100%",
					padding: "0.1em 0.5em", margin: "0", zIndex: "999999",
					position: "fixed", top: "0", right: "0", bottom: "0", left: "0",
					cursor: "progress", backgroundColor: "rgba(0,0,0,0.3)",
					animation: "js-wd-fade-in 0.1s",
				},
				bar: {
					display: "block", margin: "5px 5px auto auto", width: "25%",
					position: "absolute", top: "0", left: "0", right: "0",
				},
			};
			/* janela modal */
			let modal = document.createElement("DIV");
			for (let i in styles.modal) modal.style[i] = styles.modal[i];
			/* barra de progresso */
			let tag = "DIV";
			if      ("HTMLMeterElement"    in window) tag = "METER";
			else if ("HTMLProgressElement" in window) tag = "PROGRESS";
			let bar = document.createElement(tag);
			for (let i in styles.bar) bar.style[i] = styles.bar[i];
			/* unindo os dois */
			modal.appendChild(bar);
			return modal;
		})(),
		/**. ``''integer'' start()``: Solicita a janela modal, acresce ``counter`` e retorna seu valor.**/
		start: function() {
			if (this.counter === 0) document.body.appendChild(this.modal);
			this.counter++;
			return this.counter;
		},
		/**. ``''integer'' end()``: Dispensa à janela modal, decresce counter e retorna seu valor.**/
		end: function() {
			if (this.counter > 0) {
				this.counter--;
				/* checar fechamento da janela após delay */
				if (this.counter === 0) {
					let modal = this.modal;
					window.setTimeout(function () {
						if (modal.parentElement !== null) document.body.removeChild(modal);
					}, this.delay);
				}
			}
			return this.counter;
		},
		/**. ``''void'' progress(''number'' x)``: Define o valor da barra de progresso (0 a 1) por meio do argumento ``x``.**/
		progress: function(x) {
			x = x > 1 ? 1 : (x < 0 ? 0 : x);
			let bar    = this.modal.firstChild;
			let tag    = bar.tagName.toLowerCase();
			/* executar progresso após o tempo de interação com o documento */
			window.setTimeout(function() {
				if (tag !== "div") bar.value       = x;
				else               bar.style.width = String(100*x)+"%";
			}, this.time);
			return;
		}
	};
/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''object'' __SIGNALCONTROL``
	Controla a caixa de mensagens.**/
	const __SIGNALCONTROL = {
		/**. ``''integer'' time``: Tempo de duração da mensagem (ver CSS ``js-wd-signal-msg``).**/
		time: 9000,
		/**. ``''node'' main``: Container das caixas de mensagem.**/
		main: (function() {
			let css = {
				position: "fixed", top: "0", right: "0.5em", left: "0.5em",
				width: "auto", margin: "auto", padding: "0", zIndex: "999999",
				overflow: "auto", maxHeight: "100%"
			};
			let main = document.createElement("DIV");
			for (let i in css) main.style[i] = css[i];
			return main;
		})(),
		/**. ``''node'' model``: Gabarito de caixa de mensagem.**/
		model: (function() {
			let html = {
				message: {
					elem: document.createElement("DIV"),
					className: "js-wd-signal-message",
					style: {
						//animationName: "js-wd-shrink-out, js-wd-shrink-in",
						//animationDuration: "0.5s, 0.5s", animationDelay: "0s, 8.5s",
						position: "relative", margin: "0.5em auto 0 auto", padding: "0",
						backgroundColor: "rgb(50,50,50)", color: "rgb(230,230,230)",
						borderRadius: "0.5em", border: "1px solid rgba(0,0,0,0.6)",
						boxShadow: "1px 1px 6px rgba(0,0,0,0.6)",
					},
				},
				title: {
					elem: document.createElement("HEADER"),
					className: "js-wd-signal-title",
					style: {
						borderRadius: "0.5em 0.5em 0 0", padding: "0", margin: "0.5em",
						fontWeight: "bold"
					}
				},
				body: {
					elem: document.createElement("P"),
					className: "js-wd-signal-body",
					style: {
						margin: "0.5em", padding: "0", borderRadius: "0 0 0.5em 0.5em"
					}
				},
				close: {
					elem: document.createElement("SPAN"),
					className: "js-wd-signal-close",
					style: {
						position: "absolute", top: "0.25em", right: "0.25em",
						lineHeight: "1", cursor: "pointer", margin: "0", zIndex: "5"
					}
				}
			};
			/* definindo elementos */
			for (let i in html) {
				html[i].elem.className = html[i].className;
				for (let j in html[i].style)
					html[i].elem.style[j] = html[i].style[j];
			}
			/* montando a caixa de mensagem */
			html.message.elem.appendChild(html.title.elem);
			html.message.elem.appendChild(html.body.elem);
			html.message.elem.appendChild(html.close.elem);
			html.close.elem.textContent = "\u00D7";
			return html.message.elem;
		})(),
		/**. ``''void'' open(''string'' body, ''string'' title=" ")``: Demanda a abertura de uma nova caixa de mensagem. O argumento ``message`` define o texto da mensagem e o argumento ``title`` define seu título.**/
		open: function(body, title) {
			if (title === undefined || title === null) title = "";
			if (body  === undefined || body  === null) body  = "";
			/* clonando uma nova caixa */
			let width = __DEVICECONTROLLER.device === "desktop" ? "40%" : "auto";
			let main  = this.main;
			let model = this.model.cloneNode(true);
			/* definindo valores */
			main.style.width = width;
			model.querySelector(".js-wd-signal-title").textContent = title;
			model.querySelector(".js-wd-signal-body").textContent  = body;
			model.querySelector(".js-wd-signal-close").onclick     = function(ev) {
				try {main.removeChild(model);} catch(e) {}
				if (main.parentElement !== null && main.children.length === 0)
					document.body.removeChild(main);
				return;
			}
			/* rendenrizando */
			if (main.children.length === 0)
				document.body.appendChild(main);
			main.insertAdjacentElement("afterbegin", model);
			/* definindo fechamento automático */
			window.setTimeout(function() {
				model.querySelector(".js-wd-signal-close").click();
			}, this.time);
			return;
		},
		/**. ``''void'' notify(''string'' body, ''string'' title=" ")``: Demanda a abertura de uma [notificação](https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification). O argumento ``message`` define o texto da mensagem e o argumento ``title`` define seu título.**/
		notify: function(body, title) {
			if (title === undefined || title === null)  title = "";
			if (body  === undefined  || body  === null) body  = "";
			let options = {
				body: body,
				lang: __LANG.main,
				vibrate: [200, 100, 200],
			};
			if (!("Notification" in window))
				return this.open(body, title);
			if (Notification.permission === "denied")
				return null;
			if (Notification.permission === "granted")
				new Notification(title, options);
			else
				Notification.requestPermission().then(function(x) {
					if (x === "granted")
						new Notification(title, options);
				});
			return;
		}
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''object'' __LANG``
	Controla a linguagem local da biblioteca.**/
	const __LANG = {
		_re:       /^[a-z]{2,3}(\-[A-Z][a-z]{3})?(\-([A-Z]{2}|[0-9]{3}))?$/,
		_user:     null,
		_date:     null,
		_currency: "",
		//FIXME fazer monetary
		/**. ``''boolean'' test(''string'' x)``: Testa se o argumento ``x`` está no [formato de linguagem](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang).**/
		test: function(x) {
			return this._re.test(String(x).trim());
		},
		/**. ``''string'' node(''node'' node)``: Retorna a linguagem definida no elemento HTML ``node`` (atributo ''lang'') ou em seu elemento superior. Se não encontrado, retorna ``null``.**/
		node: function(node) {
			if (typeof node !== "object") return null;
			while ("parentElement" in node && "attributes" in node) {
				if ("lang" in node.attributes) {
					let value = String(node.attributes.lang.value).trim();
					if (this.test(value)) return value;
				}
				node = node.parentElement;
				if (node === null || node === undefined) return null;
			}
			return null;
		},
		/**. ``''string'' currency``: Define ou retorna a o código monetário definido pelo usuário.**/
		get currency()  {return this._currency;},
		set currency(x) {this._currency = String(x).trim();},
		/**. ``''string'' nav``: Retorna a linguagem definida pelo navegador ou ``null``.**/
		get nav() {return navigator.language || navigator.browserLanguage || null;},
		/**. ``''string'' html``: Retorna a linguagem definida no elemento ''body'' ou ''html'' ou ``null``, se não definida.**/
		get html() {return this.node(document.body);},
		/**. ``''string'' user``: Define ou retorna a linguagem definida pelo usuário.**/
		get user()  {return this._user;},
		set user(x) {this._user = this.test(String(x).trim()) ? String(x).trim() : null;},
		/**. ``''string'' main``: Retorna a linguagem definida pelo usuário, no HTML ou pela navegador.**/
		get main() {return this.user || this. html || this.nav || "en-US";},
		/**. ``''object'' date``: Retorna um objeto contendo os nomes dos meses e dos dias da semana, na versão longa e curta da linguagem retornada em ``main``.**/
		get date() {
			let lang = this.main;
			if (this._date !== null && this._date.lang === lang) return this._date;
			/* definir */
			let date = new Date(1970, 0, 1, 12, 0, 0, 0);
			let data = {
				lang:  lang,
				month: {long: Array(12), short: Array(12)},
				week:  {long:  Array(7), short:  Array(7)}
			};
			let month = -1;
			while (++month < 12) {
				date.setMonth(month);
				let index = date.getMonth();
				data.month.long[index]  = date.toLocaleDateString(lang, {month: "long"}).trim();
				data.month.short[index] = date.toLocaleDateString(lang, {month: "short"}).trim();
			}
			let day = 0;
			while (++day < 8) {
				date.setDate(day);
				let index = date.getDay();
				data.week.long[index]  = date.toLocaleDateString(lang, {weekday: "long"}).trim();
				data.week.short[index] = date.toLocaleDateString(lang, {weekday: "short"}).trim();
			}
			this._date = data;
			return data;
		},
		/**. ``''integer'' month(''string'' name)``: Retorna o número do mês (1-12), a partir de seu ``nome`` (ignorando caixa), considerando a linguagem retornada em ``main``. Retorna zero se não localizado.**/
		month: function (name) {
			let date  = this.date;
			let name1 = String(name).trim();
			let name2 = name1.toUpperCase();
			let name3 = name1.toLowerCase();
			let i = -1;
			while (++i < date.month.long.length) {
				let long  = date.month.long[i];
				let short = date.month.short[i];
				if (
					name1 === long               || name1 === short ||
					name2 === long.toLowerCase() || name2 === short.toLowerCase() ||
					name3 === long.toLowerCase() || name3 === short.toLowerCase()
				) return i+1;
			}
			return 0;
		},
		/**. ``''integer'' week(''string'' name)``: Retorna o número do dia da semana (1-7 [domingo-sábado]), a partir de seu ``nome`` (ignorando caixa), considerando a linguagem retornada em ``main``. Retorna zero se não localizado.**/
		week: function (name) {
			let date  = this.date;
			let name1 = String(name).trim();
			let name2 = name1.toUpperCase();
			let name3 = name1.toLowerCase();
			let i = -1;
			while (++i < date.week.long.length) {
				let long  = date.week.long[i];
				let short = date.week.short[i];
				if (
					name1 === long               || name1 === short ||
					name2 === long.toLowerCase() || name2 === short.toLowerCase() ||
					name3 === long.toLowerCase() || name3 === short.toLowerCase()
				) return i+1;
			}
			return 0;
		},
		/**. ``''string'' MMM(''integer'' value)``: Retorna o mês abreviado a partir do seu número (``value`` [1-12]).**/
		MMM:  function(value) {return this.date.month.short[value-1];},
		/**. ``''string'' MMM(''integer'' value)``: Retorna o mês a partir do seu número (``value`` [1-12]).**/
		MMMM: function(value) {return this.date.month.long[value-1];},
		/**. ``''string'' MMM(''integer'' value)``: Retorna o dia da semana abreviado a partir do seu número (``value`` [1-7]).**/
		DDD:  function(value) {return this.date.week.short[value-1];},
		/**. ``''string'' MMM(''integer'' value)``: Retorna o dia da semana a partir do seu número (``value`` [1-7]).**/
		DDDD: function(value) {return this.date.week.long[value-1];},
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''array'' __JSCSS``
	Guarda os estilos da biblioteca. Cada item da lista é um objeto que define os estilos:
	. ``''string'' s``: Seletor CSS.
	. ``''string'' d``: Estilos a serem aplicados ao seletor.**/
	const __JSCSS = [
		"@keyframes js-wd-fade-in    {from {opacity: 0 !important;} to {opacity: 1 !important;}}",
		"@keyframes js-wd-fade-out   {from {opacity: 1 !important;} to {opacity: 0 !important;}}",
		"@keyframes js-wd-shrink-out {from {transform: scale(0) !important;} to {transform: scale(1) !important;}}",
		"@keyframes js-wd-shrink-in  {from {transform: scale(1) !important;} to {transform: scale(0) !important;}}",
		".js-wd-no-display {display: none !important;}",
		"[data-wd-nav], [data-wd-send], [data-wd-tsort], [data-wd-data], [data-wd-full], [data-wd-jump] {cursor: pointer;}",
		"[data-wd-set], [data-wd-edit], [data-wd-shared], [data-wd-css], [data-wd-table] {cursor: pointer;}",
		"[data-wd-tsort]:before {content: \"\\2195 \";}",
		"[data-wd-tsort=\"-1\"]:before {content: \"\\2191 \";}",
		"[data-wd-tsort=\"+1\"]:before {content: \"\\2193 \";}",
		"[data-wd-repeat] > *, [data-wd-load] > * {visibility: hidden;}",
		"[data-wd-slide] > * {animation: js-wd-fade-in 1s, js-wd-shrink-out 0.5s;}",
		"nav > *.js-wd-nav-inactive {opacity: 0.5;}",
		".js-wd-plot {height: 100%; width: 100%; position: absolute; top: 0; left: 0; bottom: 0; right: 0;}",
		"/* testes */",
		"*::backdrop {background-color: white;}",
		"mark-wdfilter {background-color: rgba(154,205,50,0.7); display: inline; border-radius: 0.2em;}"
//TODO interessante https://developer.mozilla.org/en-US/docs/Web/CSS/::file-selector-button


	];
	__JSCSS.forEach(function(v,i,a) {
		a[i] = v.replace(/\s+/, " ").replace(/^([^{]+)\{(.+)\}$/, "$1 {\n\t$2\n}\n");
	});
	//FIXME apagar isso aqui em baixo
	let a = document.createElement("STYLE");
	a.innerHTML = __JSCSS.join("");
	document.head.appendChild(a);

/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''object'' __TYPE``
	Registra as expressões regulares para identificação de modelos genéricos de string.
	|Grupo|Subgrupo|Exemplo|
	|number|integer|10e12|
	|number|decimal|+.15e12|
	|number|factorial|3! (apenas inteiro positivo)|
	|number|percentage|10%|
	|number|infinity|-∞|
	|date|YYYYMMDD|2010-03-01|
	|date|DDMMYYYY|01/03/2010|
	|date|MMDDYYYY|03.01.2010|
	|date|DMMMMYYYY|1 março 2010|
	|date|MMMMDYYYY|março 1 2010|
	|time|hmmss|6:05:05.0001 (modelo de 24h)|
	|time|AMPM|1:05:05.0001 AM (modelo de 12h)|
	|time|PM|1:05:05.0001 pm (modelo de 12h)|
	|month|YYYYMM|2010-03|
	|month|MMYYYY|03/2010|
	|month|MMMMYYYY|março/2010 ou março 2010|
	|week|YYYYWW|2010W-01 (semana de 01-54)|
	|week|WWYYYY|01, 2010 (semana de 01-54)|
	|email|email|Um endereço de e-mail|
	O valores acima apresentam as seguintes características:
	- **ATENÇÃO!** O nome do mês depende da linguagem, pode ser curto e ignora caixas;
	- **ATENÇÃO!** O nome do mês deve ser igual ao retornado pelo objeto nativo ``Date``;
	- O ano pode ser negativo;
	- Os segundos e milissegundos são opcionais;
	- AM e PM têm caixa ignorada; e
	- Os espaços em branco são espaços simples.**/

	const __TYPE = {
		number: {
			integer:    /^[+-]?\d+(e[+-]?\d+)?$/i,
			decimal:    /^[+-]?(\d+)?\.\d+(e[+-]?\d+)?$/i,
			percentage: /^[+-]?(\d+|(\d+)?\.\d+)(e[+-]?\d+)?\%$/i,
			factorial:  /^\+?\d+\!$/,
			infinity:   /^[+-]?\∞$/,
		},
		date: {
			YYYYMMDD:  /^([-+]?\d{3}\d+)\-(0[1-9]|1[0-2])\-(0[1-9]|[12]\d|3[01])$/,
			DDMMYYYY:  /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/([-+]?\d{3}\d+)$/,
			MMDDYYYY:  /^(0[1-9]|1[0-2])\.(0[1-9]|[12]\d|3[01])\.([-+]?\d{3}\d+)$/,
			DMMMMYYYY: /^(0?[1-9]|[12]\d|3[01])\ ([^0-9]+)\ ([-+]?\d{3}\d+)$/i,
			MMMMDYYYY: /^([^0-9]+)\ (0?[1-9]|[12]\d|3[01])\ ([-+]?\d{3}\d+)$/i,
		},
		time: {
			hmmss: /^([01]?\d|2[0-4])\:([0-5]\d)(\:[0-5]\d(\.\d{1,3})?)?$/,
			AM:    /^(0?[1-9]|1[0-2])\:([0-5]\d)(\:[0-5]\d(\.\d{1,3})?)?\ ?am$/i,
			PM:    /^(0?[1-9]|1[0-2])\:([0-5]\d)(\:[0-5]\d(\.\d{1,3})?)?\ ?pm$/i,
		},
		month: {
			YYYYMM:   /^([-+]?\d{3}\d+)\-(0[1-9]|1[0-2])$/,
			MMYYYY:   /^(0[1-9]|1[0-2])\/([-+]?\d{3}\d+)$/,
			MMMMYYYY: /^([^0-9]+)[/ ]([-+]?\d{3}\d+)$/i,
		},
		week: {
			YYYYWW: /^([-+]?\d{3}\d+)\-W(0[1-9]|[1-4]\d|5[0-4])?$/i,
			WWYYYY: /^(0[1-9]|[1-4]\d|5[0-4])\,\ ([-+]?\d{3}\d+)$/,
		},
		email: {
			email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
		},
		/**. ``''object'' test(''any'' x)``: Testa se o valor passado em ``x`` encaixa em alguma expressão regular retornando um objeto contendo os atributos ``group``, ``subgroup`` e ``value`` e ``regexp.**/
		test: function(x) {
			x = String(x).trim();
			for (let i in this) {
				if (i === "test") continue;
				for (let j in this[i]) {
					if (this[i][j].test(x))
						return {group: i, subgroup: j, value: x, regexp: this[i][j]};
				}
			}
			return {group: null, subgroup: null, value: x};
		}
	};

/*============================================================================*/
	/**### Checagem de Tipos e Valores
	###### ``**constructor** ''object'' __Type(''any''  input)``
	Construtor para identificação do tipo de dado informado informado no argumento ``input``.**/
	function __Type(input) {
		if (!(this instanceof __Type)) return new __Type(input);
		Object.defineProperties(this, {
			_input:    {value: input},                /* valor de referência */
			_type:     {value: null, writable: true}, /* tipo do valor de entrada */
			_value:    {value: null, writable: true}, /* valor a ser considerado */
			_toString: {value: null, writable: true}, /* referência para string */
			_valueOf:  {value: null, writable: true}, /* referência para valueOf */
			_test:     {value: __TYPE.test(input)},   /* testa o casamento de expressões regulares */
		});

		/* IMPORTANTE: o atributo string deve ser o último */
		let strings = ["number", "date", "time", "datetime", "string"];
		/* IMPORTANTE: object deve ser o último (qualquer um pode ser um objeto) */
		let objects = [
			"null", "undefined", "boolean", "number", "datetime",
			"array", "node", "regexp", "function", "file", "object"
		];
		/*-- Checagem do tipo --*/
		let types = this.chars ? strings : objects;
		let group = this._test.group;
		if (types.indexOf(group) >= 0 && this[group]) return;
		/*-- Checando cada possibilidade --*/
		let i = -1;
		while (++i < types.length)
			if (types[i] !== group && this[types[i]]) return;
		/*-- Não se encaixa em nada conhecido --*/
		this._value    = input;
		this._type     = "unknow";
		this._toString = String(input);
		this._valueOf  = Number(input);
	}
	Object.defineProperties(__Type, {
		/**. ``''string'' __Type.zeros(''integer'' value, ''integer'' lenght)``: Fixa o tamanho do inteiro ``value`` na quantidade definida em ``length`` completando com zeros à esquerda.**/
		zeros: {
			value: function(value, length) {
				value   = Math.trunc(Number(value));
				let str = value < 0 ? "-" : "";
				let abs = Math.abs(value);
				if (abs === 0) return String("0").repeat(length);
				let i = 0;
				while (++i < length) {
					let pow10 = Math.pow(10, i);
					let zeros = String("0").repeat(length - i);
					if (abs < pow10) return str+zeros+abs;
				}
				return str+String(abs);
			}
		},
	});

	Object.defineProperties(__Type.prototype, {
		constructor: {value: __Type},
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
		/**. ``''boolean'' lang``: Checa se o argumento está no formato de linguagem.**/
		lang: {
			get: function() {
				return (this.chars && __LANG.test(this._input));
			}
		},
		/**. ``''boolean'' email``: Checa se o argumento é um e-mail.**/
		email: {
			get: function() {
				if (!this.chars) return false;
				return __TYPE.email.email.test(this._input.trim());
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
		/**. ``''boolean'' month``: Checa se o argumento está no formato de mês:**/
		month: {
			get: function() {
				if (!this.chars)                  return false;
				if (this._test.group !== "month") return false;
				if (this._test.subgroup === "MMMMYYYY") {
					let month = this._input.trim().replace(this._test.regexp, "$1");
					if (month.trim() === month) return __LANG.month(month) > 0;
				}
				return true;
			}
		},
		/**. ``''boolean'' week``: Checa se o argumento está no formato de semana.**/
		week: {
			get: function() {
				if (!this.chars) return false;
				return this._test.group === "week";
			}
		},
		/**. ``''boolean'' string``: Checa se o argumento é uma string diferente de número ou data/tempo.**/
		string: {
			get: function() {
				if (this.type !== null) return this.type === "string";
				if (!this.chars) return false;
				this._type     = "string";
				this._value    = String(this._input);
				this._valueOf  = this._value;
				this._toString = this._value;
				return true;
			}
		},
		/**. ``''boolean'' number``: Checa se o argumento é um número real, fatorial (string) ou percentual (string).**/
		number: {
			get: function() {
				if (this.type !== null) return this.type === "number";
				/*-- Número --*/
				if (typeof this._input === "number" || this._input instanceof Number) {
					if (isNaN(this._input)) return false;
					this._type     = "number";
					this._value    = this._input.valueOf();
					this._valueOf  = this._value;
					this._toString = isFinite(this._value) ? String(this._value) : (this._value < 0 ? "-∞" : "+∞");
					return true;
				}
				/*-- String --*/
				if (!this.chars || this._test.group !== "number") return false;
				let value = this._test.value;
				switch(this._test.subgroup) {
					case "factorial": {
						let mult = Number(value.replace("!", ""));
						value = 1;
						while (mult > 1) value = value * mult--;
						break;
					}
					case "percentage": {
						value = Number(value.replace("%", ""))/100;
						break;
					}
					case "infinity": {
						value = value[0] === "-" ? -Infinity : +Infinity
						break;
					}
					default: {
						value = Number(value);
					}
				}
				let check = __Type(value);
				if (check.number) {
					this._type     = check._type;
					this._value    = check._value;
					this._valueOf  = check._valueOf;
					this._toString = check._toString;
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
		/**. ``''boolean'' xml``: Checa se o argumento é documento XML.**/
		xml: {
			get: function() {
				return this.node && this.value[0] instanceof XMLDocument;
			}
		},
		/**. ``''boolean'' html``: Checa se o argumento é documento XML.**/
		html: {
			get: function() {
				return this.node && this.value[0] instanceof HTMLDocument;
			}
		},
		/**. ``''boolean'' boolean``: Checa se o argumento é um valor booleano.**/
		boolean: {
			get: function() {
				if (this.type !== null) return this.type === "boolean";
				if (typeof this._input === "boolean" || this._input instanceof Boolean) {
					this._type     = "boolean";
					this._value    = this._input.valueOf();
					this._valueOf  = this._value === true ? 1 : 0;
					this._toString = this._value === true ? "true" : "false";
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
					this._valueOf  = this._value.valueOf();
					this._toString = this._value.source;
					return true;
				}
				return false;
			}
		},
		/**. ``''boolean'' datetime``: Checa se o argumento é um conjunto data/tempo. Enquadram-se nessa condição o construtor nativo ``Date`` e strings em formato de data e tempo, nos termos da biblioteca, separados por espaço, virgula e espaço ou a letra T.**/
		datetime: {
			get: function() {
				if (this.type !== null) return this.type === "datetime";
				if (this._input instanceof Date) {
					let input = this._input;
					let number = {
						D: input.getDate(),  M: input.getMonth()+1, Y: input.getFullYear(),
						h: input.getHours(), m: input.getMinutes(), s: input.getSeconds(),
						l: input.getMilliseconds()
					};
					let text = {};
					for (let i in number) {
						let value = number[i];
						switch(i) {
							case "Y": text[i] = __Type.zeros(value, 4); break;
							case "l": text[i] = __Type.zeros(value, 3).substring(0,3); break;
							default:  text[i] = __Type.zeros(value, 2).substring(0,2);
						}
					}
					let time = [text.h, text.m, text.s+"."+text.l].join(":");
					let date = [text.Y, text.M, text.D].join("-");
					this._type     = "datetime";
					this._value    = date+"T"+time;
					this._valueOf  = this._value;
					this._toString = this._value;
					return true;
				}
				/*-- Data/Tempo em formato de string --*/
				if (!this.chars) return false;
				let dt = this._input.trim();
				let re = /(\d\d)(T|\,\ |\ )(\d?\d\:)/i;
				if (!re.test(dt)) return false;
				dt = dt.replace(re, "$1T$3").split("T");
				if (dt.length !== 2) return false;
				let date = __Type(dt[0]);
				let time = __Type(dt[1]);
				if (!date.date || !time.time) return false;
				this._type     = "datetime";
				this._value    = date.value+"T"+time.value;
				this._valueOf  = this._value;
				this._toString = this._value;
				return true;
			}
		},
		/**. ``''boolean'' date``: Checa se o argumento é uma data em formato de string.**/
		date: {
			get: function() {
				if (this.type !== null) return this.type === "date";
				if (!this.chars || this._test.group !== "date") return false;
				let value = this._test.value;
				let date = {};
				let type = {
					YYYYMMDD:  {split: "-", ymd: [0,1,2]},
					DDMMYYYY:  {split: "/", ymd: [2,1,0]},
					MMDDYYYY:  {split: ".", ymd: [2,0,1]},
					DMMMMYYYY: {replace: this._test.regexp, ymd: ["$3", "$2", "$1"]},
					MMMMDYYYY: {replace: this._test.regexp, ymd: ["$3", "$1", "$2"]}
				}
				let cfg = type[this._test.subgroup];
				if ("split" in cfg) {
					let data = value.split(cfg.split);
					date.y = data[cfg.ymd[0]];
					date.m = data[cfg.ymd[1]];
					date.d = data[cfg.ymd[2]];
				} else if ("replace" in cfg) {
					date.y = value.replace(cfg.replace, cfg.ymd[0]);
					date.m = value.replace(cfg.replace, cfg.ymd[1]);
					date.d = value.replace(cfg.replace, cfg.ymd[2]);
					if (date.m !== date.m.trim()) return false;
					date.m = __LANG.month(date.m);
					if (date.m < 1) return false;
				} else {return false;}

				/* checando dados da data */
				let d = Number(date.d);
				let m = Number(date.m);
				let y = Number(date.y);
				/* checando dia */
				let feb  = (y%400 === 0 || (y%4 === 0 && y%100 !== 0)) ?  29 : 28;
				let days = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				if (d > days[m-1]) return false;
				this._type     = "date";
				this._value    = [__Type.zeros(y, 4), __Type.zeros(m, 2), __Type.zeros(d, 2)].join("-");
				this._valueOf  = this._value;
				this._toString = this._value;
				return true;
			}
		},
		/**. ``''boolean'' function``: Checa se o argumento é uma função.**/
		function: {
			get: function() {
				if (this.type !== null) return this.type === "function";
				if (typeof this._input === "function" || this._input instanceof Function) {
					this._type     = "function";
					this._value    = this._input;
					this._valueOf  = "valueOf" in this._value ? this._value.valueOf() : this._value;
					this._toString = "toString" in this._value ? this._value.toString() : this._value;
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
					this._type     = "array";
					this._value    = this._input;
					this._valueOf  = "valueOf" in this._value ? this._value.valueOf() : this._value;
					this._toString = JSON.stringify(this._value);
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
					this._type     = "null";
					this._value    = null;
					this._valueOf  = 0;
					this._toString = "";
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
					this._type     = "undefined";
					this._value    = undefined;
					this._valueOf  = Infinity;
					this._toString = "?";
					return true;
				}
				return false;
			}
		},
		/**. ``''boolean'' time``: Checa se o argumento é uma string que representa uma unidade de tempo.**/
		time: {
			get: function() {
				if (this.type !== null) return this.type === "time";
				if (!this.chars || this._test.group !== "time") return false;
				let value = this._test.value.replace(/[^0-9:.]/g, "");
				let data  = value.replace(".", ":").split(":");
				let time  = {
					h: Number(data[0]),
					m: Number(data[1]),
					s: data.length > 2 ? Number(data[2]) : 0,
					l: data.length > 3 ? 1000*Number("0."+data[3]) : 0
				};
				if (this._test.subgroup === "AM")
					time.h = time.h%12;
				else if (this._test.subgroup === "PM")
					time.h = time.h === 12 ? 12 : ((12 + time.h ) % 24);
				else
					time.h = time.h % 24;
				for (let i in time)
					time[i] = __Type.zeros(time[i], (i === "l" ? 3 : 2));
				this._type     = "time";
				this._value    = [time.h, time.m, time.s+"."+time.l].join(":");
				this._valueOf  = this._value;
				this._toString = this._value;
				return true;
			}
		},
		/**. ``''boolean'' node``: Checa se o argumento é um elemento/document HTML/XML, ou uma coleção desses.**/
		node: {
			get: function() {
				if (this.type !== null) return this.type === "node";
				let html  = null;
				let node  = this._input;
				if (node === window) {
					html = [node];
				} else {
					let nodes = { /* 0: individual, 1: lista */
						XMLDocument: 0,
						HTMLDocument: 0,
						HTMLElement: 0,
						SVGElement: 0,
						MathMLElement: 0,
						NodeList: 1,
						HTMLCollection: 1,
						HTMLAllCollection: 1,
						HTMLOptionsCollection: 1,
						HTMLFormControlsCollection: 1
					};
					for (let HTML in nodes) {
						if (HTML in window && node instanceof window[HTML]) {
							if (nodes[HTML] === 0) node = [node];
							html = [];
							let i = -1;
							while (++i < node.length) html.push(node[i]);
						}
					}
				}
				if (html === null) return false;
				this._type     = "node";
				this._value    = html;
				this._valueOf  = this._value.slice();
				this._toString = this._value;
				return true;
			}
		},
		/**. ``''boolean'' file``: Checa se o argumento é do tipo ``File``, ``FileList`` ou ``Blob``.**/
		file: {
			get: function() {
				if (this.type !== null) return this.type === "file";
				let files = { /* 0: individual, 1: lista */
					File: 0,
					FileList: 1,
					Blob: 0
				};
				let file = null;
				for (let name in files) {
					if (name in window && this._input instanceof window[name]) {
						file = [];
						if (files[name] === 0) {
							file.push(this._input);
						} else {
							let i = -1;
							while (++i < this._input.length)
								file.push(this._input[i]);
						}
					}
				}
				if (file === null) return false;
				this._type     = "file";
				this._value    = file;
				this._valueOf  = this._value.slice();
				this._toString = this._value;
				return true;
			}
		},
		/**. ``''boolean'' object``: Checa se o argumento é um objeto que não se enquadra nas demais categorias.**/
		object: {
			get: function() {
				if (this.type !== null) return this.type === "object";
				if (typeof this._input === "object") {
					this._type     = "object";
					this._value    = this._input;
					this._valueOf  = this._value;
					this._toString = JSON.stringify(this._value);
					return true;
				}
				return false;
			}
		},

		/**. ``''string'' type``: Retorna o tipo do argumento verificado (number, date, time, datetime, string, null, undefined, boolean, array, node, regexp, function, object).**/
		type: {
			get: function() {return this._type;}
		},
		/**. ``''any''  value``: Retorna o valor do argumento de acordo com o atributo ``type``. Tipos de referência, primitivos e data/tempo retornam valores de referência, primitivos e strings, respectivamente.**/
		value: {
			get: function() {return this._value;}
		},
		/**. ``''void''  valueOf()``: Método padrão.**/
		valueOf: {
			value: function() {
				return this._valueOf;
			}
		},
		/**. ``''string'' toString()``: Método padrão.**/
		toString: {
			value: function() {
				return this._toString;
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
				return this.finite ? this._value.toString() : (this < 0 ? "-∞" : "+∞");
			}
		},
		/**. ``''string'' toString()``: Retorna o valor em forma de string de acordo com a linguagem definida.**/
		toLocaleString: {
			value: function() {
				return this._value.toLocaleString(__LANG.main);
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
				if (!this.finite || this.valueOf() < 2) return [];
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
				if (this.valueOf() < 2 || !this.finite || this.dec !== 0) return false;
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
				if (this.valueOf() < 1) return "0 B";
				if (!this.finite)       return this.toString()+" B";
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
				if (this.valueOf() === 0) return "zero";
				if (!this.finite)         return "infinity";
				if (this.dec === 0)       return "integer";
				return "real";
			}
		},
		/**. ``''string'' precision(''integer'' n=3)``: Fixa a quantidade de dígitos numéricos (argumento ``n``) a exibir.**/
		precision: {
			value: function(n) {
				let check = __Type(n);
				let abs   = this.abs;
				n = Math.trunc(check.finite ? check.value : 3);
				if (n < 1) n = 1;
				if (abs < 1 && abs !== 0)
					return this.valueOf()[abs < Math.pow(10,-n+1) ? "toExponential" : "toFixed"](n-1);
				return this.valueOf().toPrecision(n);
			}
		},
		/**. ``''string'' notation(''string'' type, ''any'' code)``: Formata o número em determinada notação ([referência]<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat>).
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
			value: function (type, code) {
				if (!this.finite) return this.toString();
				type      = String(type).toLowerCase();
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
					return this.valueOf().toLocaleString(__LANG.main, (attr in types ? types[attr] : {}));
				} catch(e) {}
				try {
					return this.valueOf().toLocaleString(undefined, (attr in types ? types[attr] : {}));
				} catch(e) {
					return this.valueOf().toLocaleString();
				}
				return this.toString()
			}
		},
		/**. ``''number'' e``: Retorna o expoente do número em base 10.**/
		e: {
			get: function() {
				if (!this.finite)         return 0;
				if (this.valueOf() === 0) return Infinity;
				let value = this.abs;
				let n = 0;
				while (value < 1 || value >= 10) {
					n    += value < 1 ? -1 : +1;
					value = value * (value < 1 ? 10 : 1/10);
				}
				return n;
			}
		}
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
		/**. ``''string'' mask(''string'' model, ''function'' method)``: Checa se a string casa com o formato de máscara definido. Retornará uma string vazia se o valor informado não casar com a máscara ou uma string com a máscara aplicada. O argumento opcional ``method`` define uma função a ser aplicada quando há o casamento da máscara, a função receberá a string formatada como argumento para checagens e manipulações complementares para definir o valor retornado. O argumento ``model`` define o modelo da máscara conforme caracteres abaixo:
		|Caractere|Descrição|
		|#|Exige um dígito.|
		|@|Exige um não dígito.|
		|*|Exige um valor qualquer.|
		|?|Separa modelos alternativos caso o anterior não case.|
		|' (aspóstofro)|Fixa o caractere seguinte sem checar se casa|
		###### Exemplos
		- "##/##/####" (data) casa com "01234567" e retorna "01/23/4567".
		- "(##) # ####-####?(##) ####-####" (telefone) casa com "01234567890", retornando "(01) 2 3456-7890", e casa também com "0123456789" retornando "(01) 2345-6789".**/
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
				if (__Type(method).function) return method(mask.join(""));
				return mask.join("");
			}
		},
		/**. ``''string'' dash``: Retorna uma string identificadora no formato de traços (alfabetos latinos).**/
		dash: {
			get: function() {
				let value = this.clear().replace(/\ +/g, "-").split("");
				value.forEach(function (v,i,a) {
					/* eliminar caracteres não permitidos */
					if (!(/[a-zA-Z0-9._:-]/).test(v)) a[i] = "";
					/* adicionar traço antes de maiúsculas e inverter caixa */
					else if (/[A-Z]/.test(v)) a[i] = "-"+v.toLowerCase();
				});
				value = value.join("").replace(/\-+/g, "-");
				return value.replace(/^\-+/, "").replace(/\-+$/, "");
			}
		},
		/**. ``''string'' camel``: Retorna uma string identificadora no formato de camelCase (alfabetos latinos).**/
		camel: {
			get: function() {
				let value = this.dash.split("-");
				value.forEach(function (v,i,a) {
					if (i !== 0) {
						let dot = v.split("");
						dot[0] = dot[0].toUpperCase();
						a[i] = dot.join("");
					}
				});
				return value.join("");
			}
		},
		/**. ``''matrix'' csv``: Retorna uma matriz (array) a partir de uma string no formato [CSV]<https://www.rfc-editor.org/rfc/rfc4180> cujas colunas sejam separadas por "\t" e linhas por "\n". Se o valor da célula contiver o caractere divisor de coluna ou linha, a célula deverá estar cercada por aspas duplas.**/
		csv: {
			get: function() {
				/* definindo variáveis */
				let td    = "\t";
				let tr    = "\n";
				let txt   = this._value;
				let table = [[]];
				/* o último caractere precisar ser uma quebra de linha */
				if (txt[txt.length - 1] !== tr) txt = txt+tr;
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
 				/* igualando número de colunas de todas as linhas */
 				let max = 0;
 				table.forEach(function(v,i,a) {
 					if (v.length > max) max = v.length;
 				});
 				table.forEach(function(v,i,a) {
 					while (v.length < max) v.push("");
 				});
				/* retornando */
 				return table;
			}
		},
		/**. ``''node'' html``: Retorna um documento HTML caso o conteúdo da string esteja nesse formato, ou nulo.**/
		html: {
			get: function() {
				try {
					let parse = new DOMParser();
					return parse.parseFromString(this._value, "text/html");
				} catch(e) {return null;}
			}
		},
		/**. ``''node'' xml``: Retorna um documento XML caso o conteúdo da string esteja nesse formato, ou nulo.**/
		xml: {
			get: function() {
				try {
					let parse = new DOMParser();
					return parse.parseFromString(this._value, "application/xml");
				} catch(e) {return null;}
			}
		},
		/**. ``''any'' json``: Retorna notação em Javascript caso o conteúdo da string esteja no formato JSON, ou nulo.**/
		json: {
			get: function() {
				try {return JSON.parse(this._value);} catch(e) {return null;}
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
			_print:  {value: null, writable: true}, /* retrato dos parâmetros */
			_field:  {value: null, writable: true}, /* parâmetro que chamou o disparador */
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
		Y:    {get: function() {return __Type.zeros(this.year, 1);}},
		/**. ``''string'' YY``: Retorna o ano com os dois últimos dígitos.**/
		YY:   {get: function() {return this.YYYY.replace(/\d+(\d\d)$/, "$1");}},
		/**. ``''string'' YYYY``: Retorna o ano com pelo menos quatro dígitos.**/
		YYYY: {get: function() {return __Type.zeros(this.year, 4);}},
		/**. ``''string'' M``: Retorna o mês.**/
		M:    {get: function() {return __Type.zeros(this.month, 1);}},
		/**. ``''string'' MM``: Retorna o mês com dois dígitos.**/
		MM:   {get: function() {return __Type.zeros(this.month, 2);}},
		/**. ``''string'' MMM``: Retorna o nome abreviado do mês.**/
		MMM:  {get: function() {return __LANG.MMM(this.month);}},
		/**. ``''string'' MMMM``: Retorna o nome do mês.**/
		MMMM: {get: function() {return __LANG.MMMM(this.month);}},
		/**. ``''string'' D``: Retorna o dia.**/
		D:    {get: function() {return __Type.zeros(this.day, 1);}},
		/**. ``''string'' DD``: Retorna o dia com dois dígitos.**/
		DD:   {get: function() {return __Type.zeros(this.day, 2);}},
		/**. ``''string'' DDD``: Retorna o dia da semana abreviado.**/
		DDD:  {get: function() {return __LANG.DDD(this.weekDay);}},
		/**. ``''string'' DDDD``: Retorna o dia da semana.**/
		DDDD: {get: function() {return __LANG.DDDD(this.weekDay);}},
		/**. ``''string'' W``: Retorna a semana do ano (atributo ``week``).**/
		W:   {get: function() {return __Type.zeros(this.week, 1);}},
		/**. ``''string'' WW``: Retorna a semana do ano com dois dígitos (atributo ``week``).**/
		WW:   {get: function() {return __Type.zeros(this.week, 2);}},
		/**. ``''string'' h``: Retorna a hora.**/
		h:    {get: function() {return __Type.zeros(this.hour, 1);}},
		/**. ``''string'' hh``: Retorna o a hora com dois dígitos.**/
		hh:   {get: function() {return __Type.zeros(this.hour, 2);}},
		/**. ``''string'' m``: Retorna o minuto.**/
		m:    {get: function() {return __Type.zeros(this.minute, 1);}},
		/**. ``''string'' mm``: Retorna o minuto com dois dígitos.**/
		mm:   {get: function() {return __Type.zeros(this.minute, 2);}},
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
		/**. ``''array'' sort(''boolean'' asc)``: Retorna a lista ordenada e organizada por grupos na seguinte sequência: número, tempo, data, datatempo, texto, booelano, nulo, nós, lista, objeto, função, expressão regular, indefinido e demais valores.
		. O argumento opcional ``asc`` define a classificação da lista. Se verdadeiro, ascendente; se falso, descendente; e, se omitido, inverterá a ordenação atual com prevalência da ordem ascendente.**/
		sort: {
			value: function(asc) {
				let order = [
					"boolean", "number", "time", "date", "datetime", "string", "null", "node",
					"array", "object", "function", "regexp", "unknown", "undefined"
				];
				let data  = __Type(asc);
				let array = this._value.slice();
				asc = data.boolean ? data.value : null;
				array.sort(function(a, b) {
					let A = __Type(a);
					let B = __Type(b);
					/* comparação entre tipos diferentes */
					if (A.type !== B.type) {
						let typeA = order.indexOf(A.type);
						let typeB = order.indexOf(B.type);
						return typeA < typeB ? -1 : (typeA > typeB ? 1 : 0);
					}
					/* comparação entre tipos iguais */
					let avalue = a;
					let bvalue = b;
					if (A.node) {
						let node1 = a.textContent;
						let node2 = b.textContent;
						if (node1 === node2) return 0;
						let array = __Array(node1, node2).sort(true);
						return array[0] === node1 ? -1 : 1;
					}
					if (A.number || A.boolean) {
						avalue = A.valueOf();
						bvalue = B.valueOf();
					} else if (A.date || A.time || A.datetime) {
						avalue = __DateTime(A.value).valueOf();
						bvalue = __DateTime(B.value).valueOf();
					} else if (A.string) {
						if (A.empty || B.empty) return A.empty ? 1 : -1;
						avalue = __String(a.toLowerCase()).clear().trim();
						bvalue = __String(b.toLowerCase()).clear().trim();
					}
					return avalue < bvalue ? -1 : (avalue > bvalue ? 1 : 0);
				});
				/* com asc definido */
				if (asc === true)  return array;
				if (asc === false) return array.reverse();
				/* com asc não definido */
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
		/**. ``''array'' remove(void ...)``: Remove itens (argumentos) da lista e a retorna.**/
		remove: {
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
					if (self._value.indexOf(v) < 0) self.add(v); else self.remove(v);
				});
				return this._value;
			}
		},
	});

/*============================================================================*/
	/**### Nós HTML
	#### Pesquisa por Elementos
	###### ``**constructor** ''object'' __Query(''string'' css, ''node'' root=document)``
	Construtor para obter elementos HTML. O argumento ``css`` é um seletor CSS válido e o argumento opcional ``root`` define o elemento raiz da busca.	**/
	function __Query(css, root) {
		if (!(this instanceof __Query))	return new __Query(css, root);
		let check = __Type(root);
		Object.defineProperties(this, {
			_css:  {value: css === undefined || css === null ? "" : String(css).trim()},
			_root: {value: check.node ? check.value[0] : document},
		});
	}

	Object.defineProperties(__Query, {

		/**. ``''array'' __Query.$$$(''object'' data, ''boolean'' unique)``: retorna uma lista de nós (``NodeList``) ou um nó específico a partir do seletor CSS inserido nos atributos de nome ``$`` (nó único) ou ``$$`` (nó múltiplo) do argumento ``data``. Aceita-se como elemento as strings "document" e "window" que correspondem aos objetos/documentos de mesmo nome. Quando os dois atributos são informados, o atributo ``$`` não é utilizado. Os dois atributos serão deletados do objeto original. O argumento ``unique``, se verdadeiro, forçará o retorno de um único elemento.**/
		$$$: {
			value: function(data, unique) {
				if (!__Type(data).object) return __Query().$;
				let one = null;
				let all = null;
				let key = {"document": document, "window":  window};
				let re  = /^(\s+)?(document|window)(\s+)?$/;
				if ("$" in data) {
					one = data["$"];
					delete data["$"];
				}
				if ("$$" in data) {
					all = data["$$"];
					delete data["$$"];
				}
				if (re.test(one)) return key[one.trim()];
				if (re.test(all)) return key[all.trim()];
				let list = all === null ? __Query(one).$ : __Query(all).$$;
				return (all !== null && unique === true && list.length > 0) ? list[0] : list;
			}
		},
	});


	Object.defineProperties(__Query.prototype, {
		constructor: {value: __Query},
		/**. ``''array'' $$``: retorna uma lista de nós (``NodeList``).**/
		$$: {
			get: function() {
				let elem = null;
				try {elem = this._root.querySelectorAll(this._css);} catch(e) {}
				return __Type(elem).node ? elem : document.querySelectorAll("#_._");
			}
		},
		/**. ``''array'' $``: retorna um nó específico ou lista de nós (``NodeList``) vazia.**/
		$: {
			get: function() {
				let elem = null;
				try {elem = this._root.querySelector(this._css);} catch(e) {}
				return __Type(elem).node ? elem : this.$$;
			}
		},




	});

/*----------------------------------------------------------------------------*/
	/**#### Formulários HTML
	###### ``**constructor** ''object'' __URL(''string'' input)``
	Construtor para gerir parâmetros de envio de requisição. O argumento ``input`` é o destino da requisição. Se vazio, observará o URL em vigor. Alguns métodos retornar o próprio objeto**/
	function __URL(input) {
		if (!(this instanceof __URL))	return new __URL(input);
		if (input === undefined || input === null || String(input).trim() === "")
			input = document.URL;
		input = String(input).split("#");
		let target = input[0].trim().replace(/\?+$/, "").trim();
		let hash   = input.length > 1 ? "#"+input[1].trim() :  "";
		Object.defineProperties(this, {
			_target: {value: target},
			_hash:   {value: hash},
			_data:   {value: []},
			_id:     {value: {}},
		});
	}

	Object.defineProperties(__URL.prototype, {
		constructor: {value: __URL},
		/**. ``''self'' append(''string'' name, ''any'' value)``: Apensa um conjunto de dados ``name/value``. Se ``value`` for um array, ``name`` receberá um par de colchetes ao fim da string. Se ``value`` for um objeto, ``name`` receberá ao fim da string o nome do atributo.**/
		append: {
			value: function(name, value) {
				name = String(name).replace(/\[\]$/, "");
				let check = __Type(value);
				let self  = this;
				switch(check.type) {
					case "array": {
						if (value.length === 0)
							self.append(name, "");
						else
							value.forEach(function (v,i,a) {self.append(name, v);});
						break;
					}
					case "object": {
						for (let i in value) this.append(name+"."+i, value[i]);
						break;
					}
					default: {
						if (name in this._id) this._id[name]++;
						else this._id[name] = 1;
						this._data.push({name: name, value: value, type: check.type});
					}
				}
				return this;
			}
		},
		/**. ``''self'' remove(''string'' name)``: Remove todos os conjuntos de dados identificados por ``name``.**/
		remove: {
			value: function(name) {
				name = String(name);
				if (name in this._id) {
					this._data.forEach(function(v,i,a) {
						if (v !== null && v.name === name)
							a[i] = null;
					});
					delete this._id[name];
				}
				return this;
			}
		},
		/**. ``''self'' add(''string'' name, ''any'' value)``: Como ``append``, mas substitui o conjunto.**/
		add: {
			value: function(name, value) {
				this.remove(name);
				this.append(name, value);
				return this;
			}
		},
		/**. ``''array'' values(''string'' name)``: Retorna uma lista de valores identificados por ``name``.**/
		values: {
			values: function(name) {
				name = String(name);
				let list = [];
				if (name in this._id) {
					this._data.forEach(function(v,i,a) {
						if (v !== null && v.name === name) list.push(v.value);
					});
				}
				return list;
			}
		},
		/**. ``''string'' search``: Retorna o parâmetro de busca em forma de string.**/
		search: {
			get: function() {
				let list = [];
				let self = this;
				this._data.forEach(function(v,i,a) {
					if (v !== null) {
						let name  = v.name + (self._id[v.name] > 1 ? "[]" : "");
						let value = v.type === "file" ? v.value.name : String(v.value);
						list.push(name+"="+encodeURIComponent(value));
					}
				});
				return list.join("&").trim();
			}
		},
		/**. ``''object'' form``: Retorna o parâmetro de buscapor meio do objeto ``FormData``.**/
		form: {
			get: function() {
				if (!("FormData" in window)) return null;
				let list = new FormData();
				let self = this;
				this._data.forEach(function(v,i,a) {
					if (v !== null) {
						let name  = v.name + (self._id[v.name] > 1 ? "[]" : "");
						list.append(name, v.value);
					}
				});
				return list;
			}
		},
		/**. ``''string'' target``: Retorna a URL com o parâmetro de busca sem a parte do hash.**/
		target: {
			get: function() {
				let search = this.search;
				let hash   = this._hash;
				let split  = this._target.indexOf("?") >= 0 ? "&" : "?";
				return [
					this._target,
					search === "" ? "" : split+search,
					hash === "" ? "" : hash
				].join("");
			}
		},
		/**. ``''object'' url``: Retorna dados da URL.**/
		url: {
			get: function() {
				try {
					let data = {};
					let url = new URL(this.target);
					for (let i in url) {
						let check = __Type(url[i]);
						if (check.chars) data[i] = url[i];
					}
					return data;
				} catch(e) {
					return null;
				}
			}
		},
		/**. ``''self'' forEach(''function'' x)``: Chama ``x`` para cada item do conjunto, informando o valor o nome como argumentos.**/
		forEach: {
			value: function(x) {
				if (!__Type(x).function) return;
				this._data.forEach(function(v,i,a) {
					if (v !== null) x(v.value, v.name);
				});
				return this;
			}
		}
	});

/*----------------------------------------------------------------------------*/
	/**#### Formulários HTML
	###### ``**constructor** ''object'' __FNode(''node'' input)``
	Construtor para gerir formulários HTML. O argumento ``node`` é o campo de formulário.**/
	function __FNode(input) {
		if (!(this instanceof __FNode))	return new __FNode(input);
		let check = __Type(input);
		let node  = check.node ? check.value[0] : null;
		let elem  = node !== null;
		let tag   = null;
		let type  = null;
		let form  = false;
		let cfg   = null;
		let fwork = false;
		let fmask = false;
		let forms = {
			meter:    {value: "value", text: "value", send: 0, check: null},
			progress: {value: "value", text: "value", send: 0, check: null},
			option:   {value: "value", text:  "text", send: 0, check: null},
			output:   {value: "value", text:  "text", send: 0, check: null},
			select:   {value: "combo", text: "combo", send: 1, check: null},
			textarea: {value: "value", text: "value", send: 1, check: null},
			button:   {
				type: {
					reset:  {value: "value", text: "inner", send: 0, check: null},
					button: {value: "value", text: "inner", send: 0, check: null},
					submit: {value: "value", text: "inner", send: 0, check: null},
				}
			},
			input: {
				type: {
					button:           {value: "value", text: "value", send: 0, check:        null},
					reset:            {value: "value", text: "value", send: 0, check:        null},
					submit:           {value: "value", text: "value", send: 0, check:        null},
					image:            {value: "value", text: "value", send: 0, check:        null},
					color:            {value: "value", text:    null, send: 1, check:        null},
					radio:            {value: "check", text:    null, send: 1, check:        null},
					checkbox:         {value: "check", text:    null, send: 1, check:        null},
					date:             {value: "value", text: "value", send: 1, check:      "date"},
					datetime:         {value: "value", text: "value", send: 1, check: "date|time"},
					month:            {value: "value", text: "value", send: 1, check:     "month"},
					week:             {value: "value", text: "value", send: 1, check:      "week"},
					time:             {value: "value", text: "value", send: 1, check:      "time"},
					range:            {value: "value", text: "value", send: 1, check:    "number"},
					number:           {value: "value", text: "value", send: 1, check:    "number"},
					file:             {value:  "file", text:    null, send: 1, check:        null},
					url:              {value: "value", text: "value", send: 1, check:       "url"},
					email:            {value: "email", text: "value", send: 1, check:     "email"},
					tel:              {value: "value", text: "value", send: 1, check:        null},
					text:             {value: "value", text: "value", send: 1, check:        null},
					search:           {value: "value", text: "value", send: 1, check:        null},
					password:         {value: "value", text: "value", send: 1, check:        null},
					hidden:           {value: "value", text: "value", send: 1, check:        null},
					"datetime-local": {value: "value", text: "value", send: 1, check:  "datetime"},
				}
			}
		};
		/* identificando o tipo de node */
		if (node !== null) {
			if (check.html || check.xml || input === window) {
				tag  = node.constructor.name.toLowerCase();
				elem = false;
			} else {
				tag = node.tagName.toLowerCase();
			}
		}
		/* obtendo informações de formulário */
		if (tag in forms) {
			/* é formulário */
			form  = true;
			cfg   = forms[tag];
			type  = tag;
			fwork = true;
			fmask = (function() {
				try {
					let clone   = node.cloneNode();
					let invalid = "A1!@#$%¨&*()+";
					clone.value = invalid;
					return clone.value !== invalid;
				} catch(e) {
					return false;
				}
			})();
			if ("type" in cfg) {
				/* é um formulário com tipo especificado */
				let type1 = String(node.getAttribute("type")).toLowerCase();
				let type2 = String(node.type).toLowerCase();
				type  = type1 in cfg.type ? type1 : type2;
				cfg   = cfg.type[type];
				fwork = type1 === type2;
			}
		}
		Object.defineProperties(this, {
			_form:  {value:  form}, /* informa se é um formulário */
			_node:  {value:  node}, /* registra o nó */
			_elem:  {value:  elem}, /* registra se o nó é HTML */
			_tag:   {value:   tag}, /* registra a tag do nó */
			_type:  {value:  type}, /* registra o tipo de formulário ou nulo */
			_cfg:   {value:   cfg}, /* registra a configuração do formulário ou nulo */
			_fwork: {value: fwork}, /* registra se o formulário está implementado */
			_fmask: {value: fmask}, /* registra se o formulário possui máscara nativa */
		});
	}

	Object.defineProperties(__FNode.prototype, {
		constructor: {value: __FNode},
		/**. ``''boolean'' form``: Informar se o nó é um formulário.**/
		form: {get: function() {return this._form;}},
		/**. ``''node'' node``: Retorna o nó HTML.**/
		node: {get: function() {return this._node;}},
		/**. ``''string'' type``: Retorna o tipo de nó de formulário ou o atributo ``tag``.**/
		type: {get: function() {return this._type;}},
		/**. ``''string'' tag``: Retorna o a tag do nó em letra minúscula.**/
		tag: {get: function() {return this._tag;}},
		/**. ``''boolean'' picker``: Testa se o campo de fomulário possui máscara nativa implementada.**/

		/**. ``''any'' value(''any'' x)``: Define e retorna o valor do formulário. Se o formulário aceita múltiplos valores, o valor retornado será uma lista.**/
		value: {
			value: function(x) {
				if (!this.form) return;
				let check  = __Type(x);
				let setter = !check.undefined;
				switch(this._cfg.value) {
					case "combo": {
						if (!check.array) x = check.null ? [] : [x];
						x.forEach(function(v,i,a) {a[i] = String(v);});
						let items = [];
						let i  = -1;
						while (++i < this.node.length) {
							if (setter) {
								let value = this.node[i].value;
								this.node[i].selected = x.indexOf(value) >= 0;
							}
							if (this.node[i].selected) items.push(this.node[i].value);
						}
						return items;
					}
					case "email": {
						if (!check.array) x = check.null ? [] : String(x).split(",");
						if (setter) this.node.value = String(x);
						let data  = this.node.value.trim();
						let items = data === "" ? [] : data.split(",");
						items.forEach(function(v,i,a) {a[i] = String(v).trim();});
						return items;
					}
					case "file": {
						if (check.null) this.node.value = null;
						let files = this.node.files;
						return Array.prototype.slice.call(files);
					}
					case "check": {
						if (setter) {
							if (check.boolean)   this.node.checked = check.value;
							else if (check.null) this.node.checked = !this.node.checked;
							else                 this.node.value   = String(x);
						}
						return this.node.checked ? this.node.value : null;
					}
					case "value": {
						if (setter) this.node.value = x;
						return this.node.value;
					}
				}
			}
		},
		/**. ``''any'' value(''any'' x)``: Define e retorna o texto do formulário. Se o formulário aceita múltiplos valores, o valor retornado será uma lista.**/
		text: {
			value: function(x) {
				if (!this.form) return;
				let check  = __Type(x);
				let setter = !check.undefined;
				switch(this._cfg.text) {
					case "value": return this.value(x);
					case "text": {
						if (setter) this.node.textContent = __String(x).clear(true, false);
						return this.node.textContent;
					}
					case "inner": {
						if (setter) this.node.innerHTML = __String(x).clear(true, false);
						return this.node.innerHTML;
					}
					case "combo": {
						if (!check.array) x = check.null ? [] : [x];
						x.forEach(function(v,i,a) {a[i] = __String(v).clear(true, false);});
						let items = [];
						let i  = -1;
						while (++i < this.node.length) {
							if (setter) {
								let value = __String(this.node[i].textContent).clear(true, false);
								this.node[i].selected = x.indexOf(value) >= 0;
							}
							if (this.node[i].selected)
								items.push(__String(this.node[i].textContent).clear(true, false));
						}
						return items;
					}
				}
			}
		},
		/**. ``''string'' name``: Define ou retorna o nome do formulário ou nulo se inexistentes ``name`` ou ``id``.**/
		name: {
			get: function() {
				if (!this.form) return null;
				let name = __Type(this.node.name);
				let id   = __Type(this.node.id);
				if (name.nonempty) return this.node.name.trim();
				if (id.nonempty)   return this.node.id.trim();
				return null;
			},
			set: function(x) {
				if (!this.form) return;
				this.node.name = __Type(x).nonempty ? String(x).trim() : "";
			}
		},
		/**. ``''string'' validity``: Define ou retorna a mensagem de erro do formulário.**/
		validity: {
			set: function(msg) {
				if (!this.form || this._cfg.send !== 1) return;
				let meg = __Type(msg).nonempty ? msg.trim() : "";
				this.node.setCustomValidity(msg);
			},
			get: function() {
				if (!this.form || this._cfg.send !== 1) return "";
				let validity = this.node.checkValidity();
				return validity ? "" : this.node.validationMessage.trim();
			}
		},
		/**. ``''object'' submit``: Retorna os dado do formulário para submissão ou nulo se não for campo de envio de dados. O objeto retornado possui as informações do nome (``name``), do valor (``value``), da validade (``validity``) e da mensagem de erro (``message``) do campo de formulário. Se inválido o valor, será exibida uma mensagem.**/
		submit: {
			get: function() {
				if (!this.form || this._cfg.send !== 1) return null;
				this.validity = "";
				let value     = this.value();
				let name      = this.name;
				let valid     = this.validity;
				if (value === null || name === null) return null;
				/*-- checar validade para formulário não implementado ou sem máscara --*/
				if (!this._fmask || !this._fwork) {
					let check = __Type(value);
					if (valid === "" && (check.nonempty || check.array)) {
						switch(this._cfg.check) {
							case "date": {
								if (check.date) value = check.date;
								else valid = "Invalid date value.";
								break;
							}
							case "time": {
								if (check.time) value = check.time;
								else valid = "Invalid time value.";
								break;
							}
							case "datetime": {
								if (check.datetime) value = check.datetime;
								else valid = "Invalid date/time value.";
								break;
							}
							case "date|time": {
								if (check.date || check.time || check.datetime) value = check.value;
								else valid = "Invalid date or time value.";
								console.log("Passei aqui");
								break;
							}
							case "number": {
								if (check.finite) value = check.finite;
								else valid = "Invalid numeric value.";
								break;
							}
							case "url": {
								if (check.url) value = value.trim();
								else valid = "Invalid URL value.";
								break;
							}
							case "email": {
								if (this.node.multiple !== true && value.length > 1) {
									valid = "Multiple values not allowed.";
									break;
								}
								let email = true;
								value.forEach(function(v,i,a) {
									if (!email) return;
									let test = __Type(v).email;
								});
								if (!email) valid = "Invalid email value."
								break;
							}
							case "file":	 {
								if (this.node.multiple !== true && value.length > 1)
									valid = "Multiple values not allowed.";
								break;
							}
							case "combo": {
								if (this.node.multiple !== true && value.length > 1)
									valid = "Multiple values not allowed.";
								break;
							}
							case "week": {
								if (!check.week) {
									valid = "Invalid week value."
									break;
								}
								let data = {
									WWYYYY: {year: "$2", week: "$1", re: __TYPE.week.WWYYYY},
									YYYYWW: {year: "$1", week: "$2", re: __TYPE.week.YYYYWW},
								};
								let type = data[check._test.subgroup];
								let year = value.replace(type.re, type.year);
								let week = value.replace(type.re, type.week);
								let wmax = __DateTime(__Type.zeros(year, 4)+"-01-01").maxWeekForm;
								if (Number(week) > wmax) {
									valid = "Invalid week value."
									break;
								}
								value    = __Type.zeros(year, 4)+"-W"+__Type.zeros(week, 2);
								break;
							}
							case "month": {
								if (!check.month) {
									valid = "Invalid month value."
									break;
								}
								let data = {
									MMYYYY:   {year: "$2", month: "$1", re: __TYPE.month.MMYYYY,   txt: false},
									YYYYMM:   {year: "$1", month: "$2", re: __TYPE.month.YYYYMM,   txt: false},
									MMMMYYYY: {year: "$2", month: "$1", re: __TYPE.month.MMMMYYYY, txt: true},
								};
								let type  = data[check._test.subgroup];
								let year  = value.replace(type.re, type.year);
								let month = value.replace(type.re, type.month);
								if (type.txt) month = __LANG.month(month);
								value     = __Type.zeros(year, 4)+"-"+__Type.zeros(month, 2);
								break;
							}
						}
						if (valid !== "") this.validity = valid;
					}
				}
				/*-- se não encontrado erro, checar verificação personalizada (data-wd-validity) --*/
				if (valid === "" && "wdValidity" in this.node.dataset) {
					let func = this.node.dataset.wdValidity
					if (func in window && __Type(window[func]).function) {
						let error = window[func](value);
						if (__Type(error).nonempty) {
							valid = error.trim();
							this.validity = valid;
						}
					}
				}
				/*-- definindo valor de retorno --*/
				let data = {
					name: name, value: value, validity: valid === "", message: valid
				};
				/*-- exibindo mensagem de erro caso o valor seja inválido --*/
				if (!data.validity) {
					if ("reportValidity" in this.node) {
						this.node.reportValidity();
					} else {
						__SIGNALCONTROL.notify(this.node.validationMessage, "");
						this.node.focus();
						this.node.select();
					}
				}
				return data;
			}
		}
	});

/*----------------------------------------------------------------------------*/
	/**###### ``**constructor** ''object'' __Node(node input)``
	Construtor para manipulação de nós HTML.
	O argumento ``input`` deve ser um nó HTML simples (um elemento), caso contrário será atribuído um elemento ``DIV``.**/
	function __Node(input) {
		if (!(this instanceof __Node))	return new __Node(input);
		__FNode.call(this, input);
	}

	__Node.prototype = Object.create(__FNode.prototype, {
		constructor: {value: __Node},

		/**. ``''any'' attribute(''string'' name, ''any'' value)``: Define e retorna valores de atributos dos elementos HTML. Os argumentos ``name`` e ``value`` são, respectivamente, o nome e o valor do atributo. Se ``value`` for omitido, retornará o valor de ``name``. Se ``name`` for omitido, retornará um objeto com os nome e valores dos atributos HTML.**/
		attribute: {
			value: function (name, value) {
				if (this._node === null) return;
				/*-- RETORNAR LISTA DE ATRIBUTOS -------------------------------------*/
				if (!__Type(name).nonempty) {
					let data = {};
					if ("attributes" in this.node) {
						let attr = this.node.attributes;
						let i = -1;
						while(++i < attr.length)
							data[attr[i].name] = attr[i].value;
					} else {
						for (let i in this.node)
							data[i] = this.node[i];
					}
					return data;
				}
				/*-- RETORNAR ATRIBUTO -----------------------------------------------*/
				name = name.trim();
				if (arguments.length === 1) {
					/*-- atributo de formulário -- */
					if (this.form) {
						switch(name) {
								case "value":       return this.value();
								case "textContent": return this.text();
								case "name":        return this.name;
						}
					}
					/*-- atributo com comportamento especial --*/
					if (this._elem) {
						switch(name) {
							case "style":     return this.style;
							case "class":     return this.class;
							case "className": return this.class;
							case "dataset":   return this.dataset;
						}
					}
					/*-- atributo de objeto --*/
					if (name in this.node) return this.node[name];
					/*-- ATRIBUTOS DE ELEMENTO HTML --*/
					if (this._elem && "getAttribute" in this.node)
						return this.node.getAttribute(name);
					/*-- NÃO LOCALIZADO --*/
					return undefined;
				}
				/*-- DEFINIR ATRIBUTO ------------------------------------------------*/
				else {
					/*-- atributo de formulário HTML -- */
					if (this.form) {
						switch(name) {
								case "value":       this.value(value); return this.attribute(name);
								case "textContent": this.text(value);  return this.attribute(name);
								case "name":        this.name = value; return this.attribute(name);
						}
					}
					/*-- atributo HTML com comportamento especial --*/
					if (this._elem) {
						switch(name) {
							case "style":     this.style   = value; return this.attribute(name);
							case "class":     this.class   = value; return this.attribute(name);
							case "className": this.class   = value; return this.attribute(name);
							case "dataset":   this.dataset = value; return this.attribute(name);
						}
					}
					/*-- método com comportamento especial --*/
					switch(name) {
						case "addEventListener":    return this.handler(value, false);
						case "removeEventListener": return this.handler(value, true);
					}
					/*-- atributo de objeto --*/
					if (name in this.node) {
						let testAttr  = __Type(this.node[name]);
						let testValue = __Type(value);
						/*-- método --*/
						if (testAttr.function && testValue.array)
							return this.node[name].apply(this.node, value);
						/*-- attributo booleano e não booelano --*/
						if (testAttr.boolean && (testValue.boolean || value === "!"))
							this.node[name] = testValue.boolean ? value : !this.node[name];
						else
							this.node[name] = value;
						return this.attribute(name);
					}
					/*-- atributo html --*/
					if (this._elem) {
						if (value === null)
							this.node.removeAttribute(name);
						else
							this.node.setAttribute(name, value);
						return this.attribute(name);
					}
					/*-- atributo não html --*/
					if (value === null)
						delete this.node[name];
					else
						this.node[name] = value;
					return this.attribute(name);
				}
			}
		},
		/**. ``''object'' style``: Define e retorna o valor do atributo ``style`` por meio de um objeto. Valor nulo excluí o atributo, valor textual define o atributo HTML e valor em objeto define o par nome-valor.**/
		style: {
			get: function() {
				if (!this._elem) return {};
				let data = {};
				let i    = -1;
				while (++i < this.node.style.length) {
					let attr = this.node.style[i];
					let name = __String(attr).camel;
					data[name] = this.node.style[attr];
				}
				return data;
			},
			set: function(x) {
				if (!this._elem) return;
				let data = __Type(x);
				if (data.null) {
					let attr = this.style;
					for (let i in attr) this.node.style[i] = null;
					this.node.removeAttribute("style");
				}
				else if (data.chars) {
					this.node.setAttribute("style", x);
				}
				else if (data.object) {
					for (let i in x) {
						let name = __String(i).camel;
						this.node.style[name] = x[i];
					}
				}
			}
		},
		/**. ``''array'' class``: Define e retorna o valor do atributo ``class`` por meio de um array. Valor nulo excluí o atributo, valor textual define o atributo HTML e valor em objeto define ações ''replace'', ''toggle'', ''add'' e  ''remove''.**/
		class: {
			get: function() {
				if (!this._elem) return [];
				let css   = this.node.getAttribute("class");
				let array = css === null ? [] : css.replace(/\s+/g, " ").trim().split(" ");
				let value = __Array(array).order;
				this.node.setAttribute("class", value.join(" "));
				return value;
			},
			set: function(x) {
				if (!this._elem) return;
				let data = __Type(x);
				if (data.chars) {
					this.node.setAttribute("class", x);
				}
				else if (data.null) {
					this.node.removeAttribute("class");
				}
				else if (data.object) {
					let css = __Array(this.class);
					if ("replace" in x) css.replace.apply(css, x.replace.split(" "));
					if ("toggle"  in x) css.toggle.apply(css, x.toggle.split(" "));
					if ("add"     in x) css.put.apply(css, x.add.split(" "));
					if ("remove"  in x) css.remove.apply(css, x.remove.split(" "));
					this.node.setAttribute("class", css.order.join(" "));
				}
			}
		},
		/**. ``''void''  handler(''any'' list, ''boolean'' remove=false, ''boolean'' capture=false)``: Define ou remove disparadores ao elemento. O argumento ``list`` pode ser um objeto ou uma lista. Se for uma lista, cada item da lista corresponderá, respectivamente, ao nome do evento, a função disparadora e o argumento ``useCapture`` dos métoso ''addEventListener'' e ''removeEventListener''. Se for um objeto, o atributo corresponderá ao nome do evento e seu valor a função disparadora ou uma lista de funções. A função disparadora, se estiver dentro do escopo de ``window``, poderá ser uma string com seu respectivo nome. O argumento opcional ``remove``, se verdadeiro, executará a remoção da função disparadora. O argumento opcional ``capture`` determina o valor do argumento ``useCapture`` dos métodos nativos.**/
		handler: {
			value: function(list, remove, capture) {
				if (this.node === null) return;
				let data = __Type(list);
				if (data.array) {
					let object = {};
					object[list[0]] = list[1];
					return this.handler(object, remove, list[2]);
				}
				if (!data.object) return;
				capture = capture === true;
				remove  = remove  === true;
				for (let i in list) {
					let event   = String(i).trim().replace(/^(on)?/i, "");
					let methods = __Type(list[i]).array ? list[i] : [list[i]];
					let attr    = (remove ? "remove" : "add")+"EventListener";
					let item    = -1;
					while (++item < methods.length) {
						let method = methods[item];
						if (__Type(method).nonempty) method = window[method.trim()];
						if (__Type(method).function) this.node[attr](event, method, capture);
					}
				}
			}
		},
		/**. ``''object'' dataset``: Define e retorna os valores do atributo ``dataset``. Valor nulo excluí o atributo e valor em objeto define seus pares nome-valor.**/
		dataset: {
			get: function() {
				if (!this._elem) return {};
				let data = {};
				for (let i in this.node.dataset)
					data[i] = this.node.dataset[i];
				return data;
			},
			set: function(x) {
				if (!this._elem) return;
				let data  = __Type(x);
				let wdLib = []
				if (data.null) {
					let attr = this.dataset;
					for (let i in attr) {
						wdLib.push(i);
						delete this.node.dataset[i];
					}
				}
				else if (data.object) {
					for (let i in x) {
						wdLib.push(i);
						let name = __String(i).camel;
						if (x[i] !== null)
							this.node.dataset[name] = x[i];
						else if (name in this.node.dataset)
							delete this.node.dataset[name];
					}
				}
				/* IMPORTANTE: cada definição, se for da biblioteca, deverá ser checada */
				let wd = __Array(wdLib).order;
				let i  = -1;
				while (++i < wd.length) {
					if ((/^wd[A-Z]\w+/).test(wd[i]))
						settingProcedures(this.node, wd[i]);
				}
			}
		},
		/**. ``''node'' clone(boolean childs=true)``: Retorna um clone do objeto. Se o argumento opcional ``childs`` for falso, os elementos filhos não serão clonados.**/
		clone: {
			value: function(childs) {
				if (!this._elem) return null;
				let special = ["script"];
				/* se não for um script */
				if (special.indexOf(this.tag) < 0)
					return this.node.cloneNode(childs !== false);
				/* se for um script */
				let attrs = this.attribute();
				let clone = document.createElement(this.tag);
				for (let i in attrs)
					clone.setAttribute(i, attrs[i]);
				clone.innerHTML = this.node.innerHTML
				return clone;
			}
		},
		/**. ``''void'' load(''string'' html="", ''boolean'' replace=false, ''boolean'' run=false)``: Carrega um conteúdo HTML no elemento ou o substitui. O argumento ``html`` deve conter o código HTML a ser carregado; O argumento opcional ``replace``, se verdadeiro, irá substituir o elemento pelo conteúdo de ``html``; e O argumento ``run``, se verdadeiro, executará elementos scripts existentes.**/
		load: {
			value: function(html, replace, run) {
				if (!this._elem) return;
				/* definir elemento */
				let elem = replace === true ? document.createElement("DIV") : this.node;
				elem.innerHTML = html === undefined || html === null ? "" : String(html);
				/* rodando scripts, se for o caso (por padrão não roda por motivo de segurança) */
				if (run === true) {
					let scripts = __Type(__Query("script", elem).$$).value;
					scripts.forEach(function (v,i,a) {
						let parent = v.parentElement;
						let clone  = __Node(v).clone();
						parent.insertBefore(clone, v);
						v.remove();
					});
				}
				/* substituindo o nó pelo conteúdo, se for o caso */
				if (replace === true) {
					let childs = __Type(elem.children).value;
					let node   = this.node;
					childs.forEach(function(v,i,a) {
						node.parentElement.insertBefore(v, node);
					});
					this.node.remove();
				}
				/* IMPORTANTE: checar elemento após carregamento */
				return loadingProcedures();
			}
		},
		/**. ``''void'' repeat(''array'' list)``: Clona os filhos do elemento repetindo-os de acordo com as informações repassadas pelo array de objetos em ``list``. O elemento filho que contiver o nome do atributo do obejto entre duas chaves (''{{nome}}'') terá o fragmento substituídos pelo valor do atributo do objeto correspondente.**/
		repeat: {
			value: function(list) {
				if (!this._elem) return;
				let data = __Type(list);
				if (!data.array) return;
				/* 1) obter o conteúdo interno */
				/* 2) se o conteúdo contiver o formato {{}}, armazená-lo em data-wd-repeat-model */
				/* 3) se não contiver o formato, recuperar o modelo em data-wd-repeat-model */
				/* 4) se não existir, retornar */
				let re   = /\{\{([^}]+)\}\}/
				let html = this.node.innerHTML;
				if (re.test(html))
					this.node.dataset.wdRepeatModel = html;
				else if ("wdRepeatModel" in this.node.dataset)
					html = this.node.dataset.wdRepeatModel;
				else return;
				/* 5) adequar os atributos do DOM ( {{x}} para {{x}}="" ) */
				/* 6) limpar conteúdo interno */
				html = html.split("}}=\"\"").join("}}");
				this.node.innerHTML = "";
				/* 7) Criar lista de filhos */
				/* 8) executar looping */
				/* 9) substituir atributos entre chaves duplas por valores e adicionar */
				let childs = [""];
				__MODALCONTROL.start();
				list.forEach(function (v,i,a) {
					__MODALCONTROL.progress((i+1)/a.length);
					if (__Type(v).object) {
						let inner = html;
						for (let j in v)
							inner = inner.split("{{"+j+"}}").join(v[j]);
						childs.push(inner);
					}
				});
				/* 10) definir filhos */
				this.node.innerHTML = childs.join("\n");
				__MODALCONTROL.end();
				/* IMPORTANTE: checar elementos após carregamento */
				return loadingProcedures();
			}
		},
		/**. ``''boolean'' show``: Retorna e define a visibilidade do elemento nos termos da biblioteca.**/
		show: {
			get: function() {
				if (!this._elem) return true;
				return this.class.indexOf("js-wd-no-display") < 0;
			},
			set: function(x) {
				if (!this._elem) return;
				this.class = x === false ? {add: "js-wd-no-display"} : {remove: "js-wd-no-display"}
			}
		},
		/**. ``''void'' only(''boolean'' reverse)``: Exibe o nó e esconde os irmãos. Se ``reverse`` for verdadeiro, inverte-se o resultado.**/
		only: {
			value: function(reverse) {
				if (!this._elem) return;
				let node  = this.node;
				let nodes = __Type(this.node.parentElement.children).value;
				nodes.forEach(function(v,i,a) {
					let data = __Node(v);
					data.show = v === node ? (reverse !== true) : (reverse === true);
				});
			}
		},
		/**. ``''void'' childs(''integer'' init, ''integer'' last)``: Define o intervalo de nós filhos a ser exibido entre o índice inicial (``init``) e final (``last``). Utilize um número negativo para indicar o último elemento.**/
		childs: {
			value: function (init, last) {
				if (!this._elem) return;
				let child = __Type(this.node.children).value;
				let width = child.length - 1;
				let data1 = __Type(init);
				let data2 = __Type(last);
				init = data1.number ? (data1 < 0 ? width : data1.value) : -Infinity;
				last = data2.number ? (data2 < 0 ? width : data2.value) : +Infinity;
				if (init > last) {
					let aux = init;
					init = last;
					last = aux;
				}
				child.forEach(function(v,i,a) {
					let node = __Node(v);
					node.show = i >= init && i <= last;
				});
			}
		},
		/**. ``''array'' groups(''boolean'' child)``: Retorna uma lista de objetos contendo os intervalos (atributos ``init`` e ``last``) dos elementos visíveis. Se o argumento ``child`` for verdadeiro, a análise será dentre os filhos, caso contrário, entre elemento e seus irmãos.**/
		groups: {
			value: function(child) {
				if (!this._elem) return [];
				let target = child === true ? this.node : this.node.parentElement;
				let nodes  = __Type(target.children).value;
				let groups = [];
				let data   = {init: null, last: null};
				nodes.forEach(function(v,i,a) {
					let show = v.className.indexOf("js-wd-no-display") < 0;
					if (show) {
						if (data.init === null) data.init = i;
						data.last  = i;
						if (i === (a.length - 1))
							groups.push({init: data.init, last: data.last});
					} else if (data.init !== null) {
						groups.push({init: data.init, last: data.last});
						data.init  = null;
						data.last   = null;
					}
				});
				return groups;
			}
		},
		/**. ``''void'' walk(''integer'' n=1)``: Exibe um determinado nó filho avançando ou retrocedendo entre os nós irmãos. O argumento ``n`` indica o intervalo a avançar (positivo) ou a retroceder (negativo).**/
		walk: {
			value: function(n) {
				if (!this._elem) return;
				if (this.node.childElementCount < 2) return this.childs(0, 0);
				let data   = __Type(n);
				let childs = this.node.childElementCount;
				let delta  = data.finite ? Math.trunc(data.value) : 1;
				let groups = this.groups(true);
				let active = groups.length === 0 ? 0 : groups[0].init;
				if (delta >= 0)
					active = groups.length === 0 ? -1 : groups[groups.length - 1].last;
				let next   = (active + delta)%childs;
				if (next < 0) next = childs + next;
				this.childs(next, next);
			}
		},
		/**. ``''void'' pages(''number'' index, ''number'' width)``: Agrupa os nós filhos em grupos de certo comprimento. O argumento ``index`` define o índice do grupo a ser exibido limitado ao primeiro (0) e ao último (-1). Se valores infinitos forem informados, os grupos avançarão (+) ou retrocederão (-) uma unidade. O argumento ``width`` é um número finito positivo que define o comprimento dos grupos, pode ser um número não inteiro.**/
		pages: {
			value: function(index, width) {
				if (!this._elem) return;
				if (this.node.childElementCount < 2) return this.childs(0,0);
				/* definindo o tamanho da página */
				let length = this.node.childElementCount;
				let check1 = __Type(width);
				width = !check1.finite || check1 <= 0 || check1 > length ? length : check1.value;
				if (width < 1) width = Math.round(width * length);
				width = Math.trunc(width) < 1 ? 1 : Math.trunc(width);
				/* definindo a quantidade de páginas */
				let pages = Math.trunc(Math.abs(length/width)) + (length%width === 0 ? 0 : 1);
				/* definindo a página */
				let check2 = __Type(index);
				index = check2.number ? Math.trunc(check2.value) : 0;
				/* páginas certas */
				if (check2.finite) {
					let page = index < 0 ? (pages - 1) : (index > (pages - 1) ? (pages - 1) : index);
					let init = page * width;
					let last = init + width - 1;
					this.childs(init, last);
					return;
				}
				/* caminhar nas páginas */
				let groups = this.groups(true);
				/* sem uma sequência única de elementos visíveis, exibir a primeira página */
				if (groups.length < 1 || groups.length > 1)
					return this.pages(0, width);
				let init = groups[0].init;
				let last = groups[0].last;
				/* se todos os elementos estiverem visíveis, exibir a primeira página */
				if (init === 0 && last === (length - 1))
					return this.pages(0, width);
				/* se o primeiro elemento visível não for o início de uma página, exibir a primeira página */
				if (init % width !== 0)
					return this.pages(0, width);
				/* caso contrário, retornar a página seguinte ou anterior */
				let page = init / width + (index < 0 ? -1 : +1);
				if (page < 0) page = 0;
				return this.pages(page, width);
			}
		},





		//TODO isso é interessante para talvez deixar mais profissional outros métodos
		removeMark: {
			value: function(selector, start, end) {

				if (!this._elem) return;
				tag = String(tag).trim();
				css = __Type(css).nonempty ? css.trim() : "";
				/*-- remover elementos (substituir por span), se for o caso --*/
				if (remove === true) {
					let selector = tag + (css === "" ? "" : "."+css);
					let child    = __Type(this.node.querySelectorAll(selector)).value;
					child.forEach(function (v,i,a) {
						let span = document.createElement("span");
						span.innerHTML = v.innerHTML;
						v.parentElement.replaceChild(span, v); //TODO Essa é a parte interessante
					});
				}
			//TODO interessante também https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceWith aceita texto mas não html
			}
		},





		/** .``''void'' insertTag(''string'' tag, ''integer'' start, ''integer'' end)``: Insere uma ``tag`` HTML entre os índices ``start`` e ``end`` do conteúdo textual. Método destrutivo, não utilizar se houver conteúdo editável no nó.**/
		insertTag: {
			value: function(tag, start, end) {
				if (!this._elem) return;
				let init = __Type(start);
				let last = __Type(end);
				tag  = String(tag).trim().toLowerCase().replace(/[^a-z\-]/gi, "");
				init = init.finite ? Math.trunc(init.value) : 0;
				last = last.finite ? Math.trunc(last.value) : this.node.textContent.length;
				if (init > last) return;

				let inner = this.node.innerHTML.split("");
				let index = -1;
				let open  = false;
				inner.forEach(function (v,i,a) {
					if (index > last) return;
					if (v === "<") {
						open = true;
						return;
					} else if (open && v === ">") {
						open = false;
						return;
					}
					else if (!open) {
						index++;
					} else {
						return;
					}
					if (index === init && index === last)
						a[i] = "<"+tag+">"+v+"</"+tag+">";
					else if (index === init || index === last)
						a[i] = index === init ? "<"+tag+">"+v : v+"</"+tag+">";
				});
				this.node.innerHTML = inner.join("");
				return this.node.innerHTML;
			}
		},
		/** .``''object'' textMatch(''regexp|string'' search)``: Localiza dentro do conteúdo textual do nó os índices de início e fim de ``search`` em um objeto contendo os atributos ``init`` e ``last``, retorna ou nulo caso não encontre.**/
		textMatch: {
			value: function(search) {
				if (!this._elem) return;
				let check = __Type(search);
				if (check.regexp) {
					let text = this.node.innerText;
					let list = text.match(search);
					return list === null ? null : this.textMatch(list[0]);
				} else if (check.nonempty) {
					let text = this.node.textContent.toLowerCase();
					let find = search.trim().toLowerCase();
					find = find.replace(/([^0-9a-zA-Z ])/gi, "\\$1");
					find = find.replace(/\s+/gi, "\\s+");
					let regexp = new RegExp(find, "gi");
					let match  = text.match(regexp);
					if (match === null) return null;
					let init = text.search(regexp);
					let last = init + match[0].length - 1;
					return {init: init, last: last};
				}
				return null;
			}
		},
		/**. ``''void'' filter(''string|regexp'' search, ''integer'' width)``: Exibe os nós filhos que casam com o valor definido em ``search``. O argumento ``width`` indica o número mínimo de caracteres a ser informado em ``search`` (string). Quando ``search`'for menor que o valor absoluto de ``width``, nenhum elemento será exibido, se negativo, ou todos, se positivo.**/
		filter: {
			value: function(search, width) {
				if (!this._elem) return;
				if (this.node.childElementCount === 0) return;
				let data  = __Type(search);
				let check = __Type(width);
				let child = __Type(this.node.children).value;
				/*-- avaliando search (string ou regexp) --*/
				if (data.null || data.undefined)
					search = "";
				else if (!data.regexp && !data.chars)
					search = String(search).trim();
				else if (data.chars)
					search = search.trim();
				/*-- avaliando width (inteiro) quando search for uma string --*/
				width = check.finite ? Math.trunc(check.value) : 0;
				let limit = true;
				if (width !== 0 && !data.regexp) {
					let len1 = search.length;
					let len2 = width < 0 ? -width : +width;
					if (len1 < len2) limit = false;
				}
				/*-- looping sobre os filhos --*/
				child.forEach(function (v,i,a) {
					let node = __Node(v);
					/*-- retornando o nó para sua forma original (sem destaque), se for o caso --*/
					if ("wdFilterInner" in v.dataset) {
						v.innerHTML = v.dataset.wdFilterInner;
						delete v.dataset.wdFilterInner;
					}
					/*-- verificando limite de caracteres --*/
					if (!limit) {
						node.show = width < 0 ? false : true;
						return;
					}
					if (search === "" && width === 0) {
						node.show = true;
						return;
					}
					/*-- casamento da busca --*/
					let index = node.textMatch(search);
					if (index === null) {
						node.show = false;
					} else {
						v.dataset.wdFilterInner = v.innerHTML;
						node.show = true;
						node.insertTag("mark-wdfilter", index.init, index.last);
					}
				});
				return;
			}
		},
		/**. ``''void'' sort(''boolean'' asc)``: Ordena os elementos filhos. O argumento opcional ``asc`` define a classificação. Se verdadeiro, será ascendente; se falso, descendente; e, se não boleano, será o inverso da classificação vigente.**/
		sort: {
			value: function(asc) {
				if (!this._elem) return;
				if (this.node.childElementCount === 0) return;
				let node  = this.node;
				let child = __Type(this.node.children).value;
				let sort  = __Array(child).sort(asc);
				sort.forEach(function(v,i,a) {node.appendChild(v);});
				return;
			}
		},
		/**. ``''void'' tsort(''integer'' order...)``: Ordena os nós filhos com referência aos nós netos, ordenando colunas de tabelas. Os argumentos ``order`` definem a sequência de prioridade na classificação, com a indicação do número da coluna (a partir de 1, da esquerda para a direita). Se indicador da coluna for positivo, sua ordem será ascendente, caso contrário, descendente.**/
		tsort: {
			value: function() {
				if (!this._elem) return;
				if (this.node.childElementCount === 0) return;
				/*-- acertando argumentos --*/
				let args = [];
				let j = -1;
				while (++j < arguments.length) {
					let check = __Type(arguments[j]);
					if (!check.finite || Math.trunc(check.value) === 0) continue;
					args.push(Math.trunc(check.value));
				}
				if (args.length === 0) return this.sort();
				/*-- iniciando ordenação --*/
				let child = __Type(this.node.children).value;
				child.sort(function(a, b) {
					/*-- definindo variáveis --*/
					let maxA  = a.childElementCount - 1;
					let maxB  = b.childElementCount - 1;
					/*-- looping pelas regras de ordenação (argumentos) --*/
					let i = -1;
					while (++i < args.length) {
						/*-- obtendo ordenação (value) e coluna (index) --*/
						let value = args[i];
						let index = Math.abs(value) - 1;
						/*-- checar se o valor do índice está dentro da quantidade de filhos --*/
						if (index > maxA && index > maxB) continue;
						/*-- se válido, checar se valores são diferentes --*/
						let textA = index > maxA ? "" : a.children[index].textContent.toLowerCase();
						let textB = index > maxB ? "" : b.children[index].textContent.toLowerCase();
						let typeA = __Type(__String(textA).clear().trim());
						let typeB = __Type(__String(textB).clear().trim());
						/*-- se forem iguais, passar para a próxima regra --*/
						if (typeA.value === typeB.value) continue;
						/*-- caso contrário, definir ordenamento --*/
						let sort = __Array(typeA.value, typeB.value).sort(value >= 0);
						return sort[0] === typeA.value ? -1 : +1;
					}
					/*-- se não atender os requisitos, retornar o valor padrão --*/
					return 0;
				});
				/*-- reordenando filhos --*/
				let node = this.node;
				child.forEach(function(v,i,a) {node.appendChild(v);});
			}
		},
		/**. ``''void'' jump(''node'' list)``: O nó será adicionado aos elementos na ordem definida em ``list`` a cada chamada do método. O argumento ``list`` é uma lista de nós que comodará o elemento.**/
		jump: {
			value: function(list) {
				if (!this._elem) return;
				let check = __Type(list);
				if (!check.node) return;
				list = check.value;
				let index = list.indexOf(this.node.parentElement) + 1;
				let node  = list[index%list.length];
				let data  = __Type(node);
				if (__Type(node).node) node.appendChild(this.node);
			}
		},
		/**. ``''void'' full()``: Alterna a exibição do nó em tela cheia.**/
		//TODO interessante: https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop    https://developer.mozilla.org/en-US/docs/Web/CSS/:fullscreen
		full: {
			value: function() {
				if (this.node === null) return;
				let attr = {
					open: ["requestFullscreen", "webkitRequestFullscreen", "msRequestFullscreen"],
					exit: ["exitFullscreen",    "webkitExitFullscreen",    "msExitFullscreen"]
				};
				let full = document.fullscreenElement;
				let node = this._elem ? this.node : document.documentElement;
				let act  = full === node ? "exit" : "open";
				if (act === "exit") node = document;
				let i = -1;
				while (++i < attr[act].length) {
					if (attr[act][i] in node)
						try {return node[attr[act][i]]();} catch(e) {}
				}
				return;
			}
		},
		/**. ``''object'' styles``: Retorna um objeto contendo os estilos e seus valores computados ao elemento.**/
		styles: {
			get: function() {
				if (!this._elem) return;
				let object = {};
				let styles = window.getComputedStyle(this.node, null);
				for (let i in styles) {
					if ((/\d+/).test(i)) continue;
					object[i] = styles.getPropertyValue(i);
				}
				return object;
			}
		},
	});

/*----------------------------------------------------------------------------*/

	/**#### Tabela
	###### ``**constructor** ''object'' __Table(''boolean'' head, ''boolean'' foot)``
	Construtor para obter dados de tabela e matrizes.**/
	function __Table(head, foot) {
		if (!(this instanceof __Table))	return new __Table(head, foot);
		let check1  = __Type(head);
		let check2  = __Type(foot);
		//let check3  = __Type(caption);
		let table   = document.createElement("TABLE");
		let caption = document.createElement("CAPTION");
		let thead   = document.createElement("THEAD");
		let tbody   = document.createElement("TBODY");
		let tfoot   = document.createElement("TFOOT");
		table.appendChild(caption);
		table.appendChild(thead);
		table.appendChild(tbody);
		table.appendChild(tfoot);

		Object.defineProperties(this, {
			_head:  {value: check1.boolean ? check1.value : true},
			_foot:  {value: check2.boolean ? check2.value : false},
			_table: {value: table},
		});
	}

	Object.defineProperties(__Table.prototype, {
		constructor: {value: __Table},

		/**. ``''array'' grid``: Retorna um array de duas dimensões contendo as células da tabela.**/
		grid: {
			get: function() {
				let tags = ["tbody", "thead", "tfoot"];
				let grid = [];
				let tabs = Array.prototype.slice.call(this._table.children);
				tabs.forEach(function (tab,t,at) {
					if (tags.indexOf(tab.tagName.toLowerCase()) < 0) return;
					let rows = Array.prototype.slice.call(tab.children);
					rows.forEach(function(row,r,ar) {
						let cols = Array.prototype.slice.call(row.children);
						grid.push(cols);
					});
				});
				return grid;
			}
		},
		/**. ``''void'' clear()``: Remove dados da tabela.**/
		clear: {
			value: function() {
				let tabs = Array.prototype.slice.call(this._table.children);
				tabs.forEach(function (tab,t,at) {
					let rows = Array.prototype.slice.call(tab.children);
					rows.forEach(function(row,r,ar) {
						row.parentElement.removeChild(row);
					});
				});
				this.caption = "";
			}
		},
		/**. ``''integer'' cols``: Retorna a quantidade de colunas da tabela.**/
		cols: {
			get: function() {return this.grid[0].length;}
		},
		/**. ``''integer'' rows``: Retorna a quantidade de linhas da tabela.**/
		rows: {
			get: function() {return this.grid.length;}
		},
		/**. ``''string'' caption``: Define ou retorna o valor do título da tabela.**/
		caption: {
			get: function()  {return this._table.caption.textContent;},
			set: function(x) {this._table.caption.textContent = String(x);}
		},
		/**. ``''array'' matrix(''array'' input)``: Define e retorna os dados da tabela a partir de um array (``input`` é opcional).**/
		matrix: {
			value: function(input) {
				/*-- retornar a matriz --*/
				if (!__Type(input).array) {
					let matrix = this.grid.slice();
					matrix.forEach(function(row,r,ar) {
						row.forEach(function(col,c,ac) {
							ac[c] = col.textContent;
						});
					});
					return matrix;
				}
				/*-- definir a tabela --*/
				let matrix = input.slice();
				let count  = 0;
				/* checando e acertando array de duas dimensões */
				matrix.forEach(function(v,i,a) {
					if (!__Type(v).array) a[i] = [v];
					if (v.length > count) count = v.length;
				});
				/* acertando quantidade de colunas */
				matrix.forEach(function(v,i,a) {
					while (v.length < count) a[i].push("");
				});
				/* definindo nova tabela */
				this.clear();
				let self = this;
				matrix.forEach(function(row,r,ar) {
					let tr = document.createElement("TR");
					if (r === 0 && self._head)
						self._table.tHead.appendChild(tr);
					else if (r === (ar.length - 1) && self._foot)
						self._table.tFoot.appendChild(tr);
					else
						self._table.tBodies[0].appendChild(tr);
					row.forEach(function(col,c,ac) {
						let cell = document.createElement((r === 0 && self._head) ? "TH" : "TD");
						cell.textContent = col;
						tr.appendChild(cell);
					});
				});
				return this.matrix();
			},
		},
		/**. ``''node'' html(''node'' input)``: Define e retorna os dados da tabela a partir de uma tabela HTML (``input`` é opcional).**/
		html: {
			value: function(input) {
				/*-- retornar a tabela --*/
				if (!__Type(input).node) return this._table;
				let nodes = ["table", "thead", "tbody", "tfoot", "caption"];
				let tag   = input.tagName.toLowerCase();
				if (nodes.indexOf(tag) < 0) return this._table;
				/*-- definir a tabela --*/
				let matrix = [];
				switch(tag) {
					case "table": {
						let childs = Array.prototype.slice.call(input.children);
						let object = __Table(this._head, this._foot);
						childs.forEach(function (v,i,a) {
							let node = v.tagName.toLowerCase();
							if (nodes.indexOf(node) < 0) return;
							object.html(v);
							let vector = object.matrix();
							vector.forEach(function(r,j,b) {matrix.push(r);});
						});
						this.caption = object.caption;
						break;
					}
					case "caption": {
						this.caption = input.textContent;
						break;
					}
					default: {
						let rows = Array.prototype.slice.call(input.children);
						rows.forEach(function(row,r,ar) {
							let cols = Array.prototype.slice.call(row.children);
							cols.forEach(function(col,c,ac) {ac[c] = col.textContent;});
							matrix.push(cols);
						});
					}
				}
				/* redefinindo dados */
				this.matrix(matrix);
				return this.html();
			}
		},
		/**. ``''string'' csv(''string'' input)``: Define e retorna os dados da tabela a partir do formato CSV (``input`` é opcional).**/
		csv: {
			value: function(input) {
				/*-- retornando CSV --*/
				if (!__Type(input).nonempty) {
					let matrix = this.matrix();
					matrix.forEach(function(row,i,ar) {
						row.forEach(function (col,j,ac) {
							if ((/(\t|\n)/).test(col)) ac[j] = "\""+col+"\"";
						});
						ar[i] = row.join("\t");
					});
					return matrix.join("\n");
				}
				/*-- definindo tabela --*/
				this.matrix(__String(input).csv);
				return this.csv();
			}
		},
		/**. ``''array'' json``: Retorna uma lista de objetos. Os atributos de cada objeto correspondem aos valores da primeira linha da tabela. Os valores desses atributos correspondem à respectiva coluna da tabela das demais linhas. Cada linha corresponde a um item da lista.**/
		json: {
			get: function() {
				let matrix = this.matrix();
				let data = [];
				matrix.forEach(function(row,r,ar) {
					if (r === 0) return;
					let item = {};
					row.forEach(function(col,c,ac) {item[ar[0][c]] = col;})
					data.push(item);
				});
				return data;
			}
		},
		


		/** FIXME colocar a descrição
		- Número indica a linha ou coluna da célula (a partir de zero);
		- Ponto representa o número da última linha ou coluna;
		- Asterisco corresponde a qualquer número de linha ou coluna;
		- Vírgula é o separador de linha e coluna (linha,coluna);
		- Dois pontos é o separador entre a célula inicial e final; e
		- Ponto e vírgula é o separador de grupos de células.

		|Código|Descrição|
		|1,2|Célula contida na linha 1 e coluna 2|
		|.,2|Célula localizada na última linha da coluna 2|
		|1,.|Célula localizada na última coluna da linha 1|
		|*,2|Qualquer linha da coluna 2|
		|1,*|Qualquer coluna da linha 1|
		|1,3:2,4|Todas as células contidas entre as linhas 1 e 2 e colunas 3 e 4|
		|1,*|Todas as células da linha 1|
		|*,0|Todas as células da coluna 0|
		|1,2;2,3|Células da linha 1 coluna 2 e linha 2 coluna 3|


		**/
		cell: {
			value: function(area, value) {
				let data = String(area).split(";");
				let cell = [];
				/*-- múltiplos grupos --*/
				if (data.length > 1) {
					let self = this;
					data.forEach(function(v,i,a) {
						let subList = self.cell(v, value);
						subList.forEach(function (x,y,z) {cell.push(x);});
					});
					return cell;
				}
				/*-- checando parâmetro --*/
				data   = data.join("").replace(/\s+/g, "");
				let re = /^(\d+|[*.])\,(\d+|[*.])(\:(\d+|[*.])\,(\d+|[*.]))?$/;
				if (!re.test(data)) return cell;
				let gap  = data.split(":");
				let init = gap[0].split(",");
				let end  = (gap.length > 1 ? gap[1] : gap[0]).split(",");
				let drow = {init: init[0], end: end[0]};
				let dcol = {init: init[1], end: end[1]};
				for (let i in drow) {
					if (drow[i] !== "*")
						drow[i] = drow[i] === "." ? (this.rows - 1) : Number(drow[i]);
				}
				for (let i in dcol) {
					if (dcol[i] !== "*")
						dcol[i] = dcol[i] === "." ? (this.cols - 1) : Number(dcol[i]);
				}
				/*-- capturando células definidas --*/
				let grid = value === true ? this.matrix() : this.grid;
				grid.forEach(function(row,r,ar) {
					if (drow.init !== "*" && r < drow.init) return;
					if (drow.end  !== "*" && r > drow.end ) return;
					row.forEach(function(col,c,ac) {
						if (dcol.init !== "*" && c < dcol.init) return;
						if (dcol.end  !== "*" && c > dcol.end ) return;
						cell.push(value === true ? col : {col: c, row: r, cell: col});
					});
				});
				return cell;
			}
		},




		plot: {
			value: function(options) {
				//(x, y, label, option)
				if (!__Type(options).object) return null;
				let self  = this;
				let chart = __Plot2D(options.ratio);
				if ("xLabel" in options) chart.xLabel = options.xLabel;
				if ("yLabel" in options) chart.yLabel = options.yLabel;
				if ("title"  in options) chart.title  = options.title;
				if ("xAxis"  in options) chart.xAxis  = options.xAxis;
				if ("table"  in options && __Type(options.table).array) {
					options.table.forEach(function(v,i,a) {
						if (!__Type(v).object) return;
						let x     = self.cell("1,"+v.x+":.,"+v.x, true);
						let y     = self.cell("1,"+v.y+":.,"+v.y, true);
						let label = "label" in v ? v.label : self.cell("0,"+v.y, true);
						let fit   = v.fit;
						chart.add(x, y, label, fit);
					});
				}
				if ("data"  in options && __Type(options.data).array) {
					options.data.forEach(function(v,i,a) {
						if (__Type(v).object)
							chart.add(v.x, v.y, v.label, v.fit);
					});
				}
				return chart.plot();
			}
		},
		
	});











/*============================================================================*/
	/**### Requisições e Arquivos
	``**constructor** ''object'' __Request(''any'' input)``
	Construtor para [requisições Web](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) ou leituras de [arquivos](https://developer.mozilla.org/en-US/docs/Web/API/FileReader). O argumento ``input` é o alvo a ser requisitado ou lido, pode ser um endereço (string), um arquivo ou uma lista de arquivos (só o primeiro item será lido).**/
	function __Request(input) {
		if (!(this instanceof __Request))	return new __Request(input);
		/*-- analisando argumento --*/
		let check   = __Type(input);
		let request = null;
		let source  = null;
		let target  = null;
		/*-- checando o alvo e obtendo o leitor adequado --*/
		if (check.file && check.value.length > 0) {
			target  = check.value[0];
			request = new FileReader();
			source  = "file";
		} else if (check.nonempty) {
			target  = String(input).trim();
			request = new XMLHttpRequest();
			source  = "path";
		}

		/*-- definindo atributos do objeto --*/
		Object.defineProperties(this, {
			_target:   {value: target},  /* alvo da requisição: file ou path */
			_source:   {value: source},  /* tipo do alvo: path ou file */
			_request:  {value: request}, /* objeto leitor */
			_onchange: {value: null,  writable: true}, /* disparador de mudança */
			_ondone:   {value: null,  writable: true}, /* disparador de término */
			_done:     {value: false, writable: true}, /* informa o encerramento da requisição */
			_maxtime:  {value: 0,     writable: true}, /* tempo máxima da requisição */
			_async:    {value: true,  writable: true}, /* leitura síncrona ou assíncrona */
			_user:     {value: null,  writable: true}, /* usuário */
			_password: {value: null,  writable: true}, /* senha */
			_method:   {value: null,  writable: true}, /* método de envio ou leitura */
			_header:   {value: null,  writable: true}, /* cabeçalhos de envio */
			_start:    {value: 0,     writable: true}, /* tempo de início da requisição */
		});
		if (source === null) return;

		/*-- definir disparador nativo e vinculá-lo aos eventos do objeto leitor --*/
		let self    = this;
		let trigger = function(event) {
			/*-- Não retornar o disparador depois do encerramento ou se não identificado o alvo --*/
			if (self._done || self._target === null) return;

			/*-- definir variáveis do disparador --*/
			let time      = new Date().valueOf() - self._start;
			let source    = self._source;
			let request   = self._request;
			let stateCode = request.readyState;
			let status    = request.status;
			let maxtime   = self.maxtime;
			let type      = event.type;
			let size      = "total"  in event ? event.total  : 0;
			let loaded    = "loaded" in event ? event.loaded : 0;
			let progress  = size === 0 ? 1 : loaded/size;
			let states    = {
				file:   ["empty", "loading", "done"],
				path:   ["unsent", "opened", "headers", "loading", "done"],
				errors: ["abort", "timeout", "error"]
			};
			/*-- definindo o progresso --*/
			if (source === "path" && stateCode !== 3)
				progress = stateCode < 3 ? 0 : 1;
			else if (source === "file" && stateCode !== 1)
				progress = stateCode < 1 ? 0 : 1;
			__MODALCONTROL.progress(progress);

			/*-- analisar o estado da requisição --*/
			let state = states[source][stateCode];

			if (status === 404) {
				self._done = true;
				state = "notfound";
			} else if (states.errors.indexOf(type) >= 0) {
				self._done = true;
				state = type;
			} else if (source === "file" && maxtime > 0 && time > maxtime) {
				request.abort();
				self._done = true;
				state = "timeout";
			} else {
				self._done = state === "done";
			}

			/*-- Obter cabeçalhos --*/
			let headers = null;
			if (self._done && "getAllResponseHeaders" in request) {
				headers = request.getAllResponseHeaders();
				if (__Type(headers).nonempty) {
					let list = headers.split(/[\r\n]+/g);
					headers = {};
					list.forEach(function(v,i,a) {
						let name  = v.split(":")[0].trim();
						let value = v.replace(/^[^:]+\:(.+)$/, "$1").trim();
						headers[name] = value;
					});
				}
			}
			/*-- obter resultado --*/
			let response = null;
			if (self._done)
				response = request[source === "path" ? "response" : "result"];
			let argument = {
				done:    self._done,
				time:    time,
				state:   state,
				size:    size,
				loaded:  loaded,
				headers: headers,
				abort:   function() {if (!this.done) request.abort();},
				get response() {return response;},
				get text() {return __Type(response).chars ? this.response : null;},
				get html() {return this.text === null ? null : __String(this.text).html;},
				get xml()  {return this.text === null ? null : __String(this.text).xml;},
				get json() {return this.text === null ? null : __String(this.text).json;},
				get csv()  {return this.text === null ? null : __String(this.text).csv;}
			};

			/*-- chamar disparadores definidos pelo usuário --*/
			if (self.onchange !== null)             self.onchange(argument);
			if (self._done && self.ondone !== null) self.ondone(argument);
			/*-- encerrar barra de progresso, se processo finalizado --*/
			if (self._done) __MODALCONTROL.end();
		}

		/*-- atribuir o disparador nativos a todos os eventos do leitor --*/
		let events = [
			"onabort", "onerror", "onload", "onloadend", "onloadstart",
			"onprogress", "ontimeout", "onreadystatechange"
		];
		events.forEach(function(v,i,a) {
			if (v in self._request)
				self._request[v] = trigger;
			if ("upload" in self._request && v in self._request.upload)
				self._request.upload[v] = trigger;
		});
	}

	Object.defineProperties(__Request.prototype, {
		constructor: {value: __Request},
		/**. ``''number'' maxtime``: Define e retorna o tempo máximo de requisição em milisegundos.**/
		maxtime: {
			set: function(x) {this._maxtime = x;},
			get: function()  {
				return __Type(this._maxtime).positive ? Math.trunc(this._maxtime) : 0;
			},
		},
		/**. ``''boolean'' async``: Define e retorna se a requisição será assíncrona (apenas para envio de dados).**/
		async: {
			set: function(x) {this._async = x;},
			get: function()  {return this._async === false ? false : true;}
		},
		/**. ``''string'' user``: Define e retorna o usuário da requisição ou nulo se indefinido.**/
		user: {
			set: function(x) {this._user = x;},
			get: function()  {
				let check = __Type(this._user);
				return check.undefined || check.null ? null : String(this._user);
			}
		},
		/**. ``''string'' password``: Define e retorna a senha da requisição ou nulo se indefinida.**/
		password: {
			set: function(x) {this._password = x;},
			get: function()  {
				let check = __Type(this._password);
				return check.undefined || check.null ? null : String(this._password);
			}
		},
		/**. ``''string'' method``: Define e retorna a forma de leitura ou da requisição. Se for requisição HTTP, aceita-se CONNECT, DELETE, GET, HEAD, OPTIONS, PATCH ou POST (padrão). Se for leitura de arquivo, aceita-se readAsBinaryString, readAsText, readAsDataURL ou readAsArrayBuffer, o valor padrão depende do MimeType do arquivo.**/
		method: {
			set: function(x) {this._method = x;},
			get: function()  {
				let value = String(this._method).toUpperCase().trim();
				switch(this._source) {
					case "path": {
						let methodHTTP = [
							"CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST",
							"PUT", "TRACE"
						];
						return methodHTTP.indexOf(value) >= 0 ? value : "POST";
					}
					case "file": {
						let methodRead = {
							READASBINARYSTRING: "readAsBinaryString", READASTEXT:    "readAsText",
							READASARRAYBUFFER: "readAsArrayBuffer",   READASDATAURL: "readAsDataURL"
						};
						if (value in methodRead) return methodRead[value];

						let mime = String(this._target.type).split("/")[0].toUpperCase();
						let methodMime = {
							TEXT:  "readAsText",    URL:   "readAsDataURL",
							AUDIO: "readAsDataURL", VIDEO: "readAsDataURL", IMAGE: "readAsDataURL"
						};
						return mime in methodMime ? methodMime[mime] : "readAsArrayBuffer";
					}
				}
				return null;
			},
		},
		/**. ``''object'' header``: Define e retorna os cabeçalhos em forma de objeto contendo nome/valor.**/
		header: {
			set: function(x) {this._header = x;},
			get: function()  {return __Type(this._header).object ? this._header : {};},
		},
		/**. ``function onchange``: Define e retorna o disparador a ser chamado a cada mudança de estado da requisição ou nulo, se indefinido. O disparador receberá um objeto como argumento contendo os atributos/métodos ''done, time, state, size, loaded, headers, abort(), response, text, html, xml, json e csv''.**/
		onchange: {
			set: function(x) {this._onchange = x;},
			get: function()  {return __Type(this._onchange).function ? this._onchange : null;},
 		},
 		/**. ``function ondone``: Como ``onchange``, mas será disparada somente no fim do procedimento.**/
 		ondone: {
			set: function(x) {this._ondone = x;},
			get: function()  {return __Type(this._ondone).function ? this._ondone : null;},
 		},
		/**. ``''void'' send(void data)``: Envia uma requisição web. O ``data`` a informação a ser enviada ao destino.**/
		send: {
			value: function(data) {
				if (this._source !== "path") return;
				let method  = this.method;
				let header  = this.header;
				let target  = this._target;
				/* iniciando processo */
				this._start = new Date().valueOf();
				this._done  = false;
				this._request.timeout = this.maxtime;
				__MODALCONTROL.start();
				/* tentando enviar */
				try {
					this._request.open(method, target, this.async, this.user, this.password);
					if (header !== null) {
						for (let name in header)
							this._request.setRequestHeader(String(name), String(header[name]));
					}
					this._request.send(data);
				} catch(e) {
					__MODALCONTROL.end();
				}
				return;
			}
		},
		/**. ``''void'' read()``: Lê o conteúdo de um arquivo (objeto ``File``).**/
		read: {
			value: function() {
				if (this._source !== "file") return null;
				/* iniciando processo */
				this._start = new Date().valueOf();
				this._done  = false;
				__MODALCONTROL.start();
				try      {this._request[this.method](this._target);}
				catch(e) {__MODALCONTROL.end();}
				return;
			}
		}
	});

/*============================================================================*/
	/**### Figuras
	###### ``**constructor** ''object'' __SVG(''number'' width=100, ''number'' height=100, ''number'' xmin=0, ''number'' ymin=0)``
	Construtor de imagens SVG.
	Os argumentos são opcionais e estão relacionados ao atributo [``viewBox``]<https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox> do elemento SVG.
	**/
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
		/**. ``''self'' attribute(''object'' attr)``: Define os atributos do último elemento adicionado. O argumento ``attr`` é um objeto cujas chaves representam o valor do atributo e seu respectivo valores.**/
		attribute: {
			value: function(attr) {
				for (let i in attr) this.last.setAttribute(i, attr[i]);
				return this;
			}
		},
		/**. ``''self'' title(''string'' value)``: Define um título (dica) ao último elemento adicionado. O argumento ``value`` é o texto da dica.**/
		title: {
			value: function(value) {
				let svg = document.createElementNS("http://www.w3.org/2000/svg", "title");
				svg.textContent = value;
				this.last.appendChild(svg);
				return this;
			}
		},
		/**. ``''self'' lines(''array'' x, ''array'' y, ''boolean'' close=false)``: Define diversos segmentos de reta a partir de um conjunto de coordenadas. Os argumentos ``x`` e ``y`` são as coordenadas (x,y) e o argumento ``close`` indica se o último ponto deve voltar à origem.**/
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
		/**. ``''self'' circle(''number'' cx, ''number'' cy, ''number'' r)``: Define um círculo. Os argumentos ``cx``, ``cy`` e ``r`` são o centro em x e y e o raio, respectivamente.**/
		circle: {
			value: function(cx, cy, r) {
				let svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
				this.last = svg;
				return this.attribute({cx: cx, cy: cy, r: r});

			}
		},
		/**. ``''self'' semicircle(''number'' cx, ''number'' cy, ''number'' r, ''number'' start, ''number'' width)``: Define um semicírculo. Os argumentos ``cx``, ``cy`` e ``r`` são o centro em x e y e o raio, respectivamente. Os argumentos ``start`` e ``width`` indicam o ângulo inicial e seu tamanho em graus, respectivamente.**/
		semicircle: {
			value: function(cx, cy, r, start, width) {
				if (Math.abs(width) >= 360) return this.circle(cx, cy, r);
				let svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
				start  = 2*Math.PI*start/360;
				width  = 2*Math.PI*width/360;
				if (width < 0) {
					start += width;
					width  = Math.abs(width);
				}
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
		/**. ``''self'' rect(''number'' x, ''number'' y, ''number'' width, ''number'' height)``: Define um retângulo. Os argumentos ``x`` e ``y`` definem o ponto de partida da figura e os argumentos ``width`` e ``height`` definem o comprimento e a altura do retângulo, respectivamente.**/
		rect: {
			value: function(x, y, width, height) {
				let svg   = document.createElementNS("http://www.w3.org/2000/svg", "rect");
				this.last = svg;
				return this.attribute({x: x, y: y, width: width, height: height});

			}
		},
		/**. ``''self'' path(''string'' path)``: Define um nó SVG a partir de uma sequência de comandos. O argumento ``path`` define os comandos.**/
		path: {
			value: function(path) {
				let svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
				this.last = svg;
				return this.attribute({d: path});
			}
		},
		/**. ``''self'' text(''number'' x, ''number'' y, ''string'' text, ''string'' point)``: Define um SVG textual. Os argumentos ``x``, ``y`` e ``text`` definem os pontos de referência (''x'', ''y'') e o valor do texto, respectivamente. O argumento ``point`` define a âncora da referência, composta por dois grupos. O primeiro grupo define o posicionamento, ``v`` para vertical ou ``h``. O segundo grupo define o ponto cardeal:
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
					"text-anchor":       vanchor[anchor[point.substring(1)]],
					"dominant-baseline": vbase[base[point.substring(1)]],
					"transform":         point[0] === "v" ? "rotate(270)" : "",
				};
				svg.textContent = String(text).trim();
				this.last = svg;
				return this.attribute(attr);
			}
		},
		/**. ``''self'' ellipse(''number'' cx, ''number'' cy, ''number'' rx, ''number'' ry)``: Define uma elípse.Os argumentos ``cx``, ``cy``, ``rx`` e ``ry`` definem o centro de referência em x e y e os raios de x e y, respectivamente.**/
		ellipse: {
			value: function(cx, cy, rx, ry) {
				let svg = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
				this.last = svg;
				return this.attribute({cx: cx, cy: cy, rx: rx, ry: ry});
			}
		},
		/**. ``''self'' frame(''number'' x, ''number'' y, ''string'' text, ''string'' point)``: Funciona semelhante ao método ``text``, mas aceita quebra de linha e tabulação no início de cada linha. A primeira linha receberá uma formatação destacada, como um título.**/
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
		/**. ``''node'' svg(''node'' append)``: Retorna o elemento SVG. O argumento opcional ``append`` irá receber o elemento SVG.**/
		svg: {
			value: function(append) {
				if (__Type(append).node) append.appendChild(this._svg);
				return this._svg;
			}
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
			get: function()  {
				let min = this._min.x;
				let max = this._max.x;
				return max + (min === max ? (max === 0 ? 1 : max/2) : 0);
			},
			set: function(x) {
				if (x > this._max.x) this._max.x = x;
			}
		},
		/**. ``''number'' _yMax``: Define ou retorna o maior valor da coordenada ``y``.**/
		_yMax: {
			get: function()  {
				let min = this._min.y;
				let max = this._max.y;
				return max + (min === max ? (max === 0 ? 1 : max/2) : 0);
			},
			set: function(y) {
				if (y > this._max.y) this._max.y = y;
			}
		},
		/**. ``''number'' _xMin``: Define ou retorna menor valor da coordenada ``x``.**/
		_xMin: {
			get: function()  {
				let min = this._min.x;
				let max = this._max.x;
				return min - (min === max ? (min === 0 ? 1 : min/2) : 0);
			},
			set: function(x) {
				if (x < this._min.x) this._min.x = x;
			}
		},
		/**. ``''number'' _yMin``: Define ou retorna menor valor da coordenada ``y``.**/
		_yMin: {
			get: function()  {
				let min = this._min.y;
				let max = this._max.y;
				return min - (min === max ? (min === 0 ? 1 : min/2) : 0);
			},
			set: function(y) {
				if (y < this._min.y) this._min.y = y;
			}
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
				let width = this._cfg.width + (this._cfg.width%2 === 0 ? 1 : 0);
				return Math.abs(this._xMax - this._xMin)/width;
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
		.. ``''number'' vertical``: registra o menor tamanho da tela do dispositivo.
		.. ``''number'' horizontal``: registra o maior tamanho da tela do dispositivo.
		.. ``''number'' xInit``: Registra o início do eixo horizontal ``x`` (porcentagem).
		.. ``''number'' xEnd``: Registra o fim do eixo horizontal ``x`` (porcentagem).
		.. ``''number'' yInit``: Registra o início do eixo vertical ``y`` (porcentagem).
		.. ``''number'' yEnd``: Registra o fim do eixo vertical ``y`` (porcentagem).
		.. ``''number'' points``: Número de divisões dos eixos no gráfico.
		.. ``''number'' padd``: Define um valor para espaçamento relativo (porcentagem).
		.. ``''number'' width``: Define a dimensão horizontal do gráfico.
		.. ``''number'' height``: Retorna a dimensão vertical do gráfico proporcional à ``width``.
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
		.. ``''array'' colors``: Lista de cores.
		.. ``''object'' attr_svg``: atributos do gráfico.
		.. ``''object'' attr_title``: atributos do título do gráfico.
		.. ``''object'' attr_label``: atributos dos rótulos do gráfico.
		.. ``''object'' attr_area``: atributos da área de plotagem.
		.. ``''object'' attr_axes``: atributos dos eixos secundários do gráfico.
		.. ``''object'' attr_tname``: atributos da legenda do gráfico (textual).
		.. ``''object'' attr_vname``: atributos da legenda do gráfico (visual).
		.. ``''object'' curve_line``: atributos da curva em linha.
		.. ``''object'' curve_sum``: atributos da curva de área.
		.. ``''object'' curve_dash``: atributos da curva de traços.**/
		_cfg: {
			value: {
				vertical:   Math.min(window.screen.width, window.screen.height),
				horizontal: Math.max(window.screen.width, window.screen.height),
				xInit:      0.10,
				xEnd:       0.90,
				yInit:      0.10,
				yEnd:       0.85,
				points:     5.00,
				padd:       0.005,
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
					"darkred",   "navy",           "indigo",          "teal",
					"crimson",   "dodgerblue",     "mediumslateblue", "yellowgreen",
					"deeppink",  "cornflowerblue", "purple",          "darkgreen",
					"orangered", "cyan",           "blueviolet",      "limegreen",
					"dimgray"
				],
				attr_svg:   {style: "background-color: #ffffe6; margin: 0 20em;"},
				attr_title: {fill: "#262626", "font-weight": "bold", "font-size": "1.5em"},
				attr_label: {fill: "#262626"},
				attr_area:  {stroke: "#262626", fill: "None", "stroke-width": 2, "stroke-linecap": "round"},
				attr_axes:  {stroke: "#778899", "stroke-width": 0.5, "stroke-dasharray": "6,6", "stroke-linecap": "round"},
				attr_vname: {"stroke-width": 0},
				attr_tname: {fill: "WhiteSmoke", "font-style": "italic"},
				curve_line: {fill: "none", "stroke-width": 3, "stroke-linecap": "round"},
				curve_sum:  {"fill-opacity": 0.5, "stroke-width": 1, "stroke-linecap": "round"},
				curve_dash: {fill: "None", "stroke-width": 1, "stroke-linecap": "round", "stroke-dasharray": "5,5"},
			}
		},
		/**. ``''void'' _plan()``: Constrói a área do gráfico cartesiano.**/
		_plan: {
			value: function(svg) {
				let cfg = this._cfg;
				/* título */
				svg.text(cfg.xMiddle, cfg.top, this.title, "hc").attribute(cfg.attr_title);
				/* rótulo do eixo x */
				svg.text(cfg.xMiddle, cfg.height - cfg.padding, this.xLabel, "hs").attribute(cfg.attr_label);
				/* rótulo do eixo y */
				svg.text(cfg.padding, cfg.yMiddle, this.yLabel, "vn").attribute(cfg.attr_label);
				/* abscissa e ordenada */
				svg.lines([cfg.xStart, cfg.xStart, cfg.xClose], [cfg.yStart, cfg.yClose, cfg.yClose]);
				svg.attribute(cfg.attr_area);
				/* pontos, eixos, rótulos */
				let px, py, wx, wy;
				let cx, cy, dx, dy;
				let lx, ly;
				wx = (cfg.xClose - cfg.xStart) / (cfg.points - 1);
				wy = (cfg.yClose - cfg.yStart) / (cfg.points - 1);
				dx = (this._xMax - this._xMin) / (cfg.points - 1);
				dy = (this._yMax - this._yMin) / (cfg.points - 1);
				let i = -1;
				let p = cfg.points;
				/* eixos secudários e escalas */
				while (++i < p) {
					/* IMPORTANTE: py (cima para baixo) é invertido em relação à cy (baixo para cima) */
					if (i === 0) {
						px = cfg.xStart;
						py = cfg.yClose;
						cx = this._xMin;
						cy = this._yMin;
						lx = "hnw";
						ly = "hse";
					}
					else if (i === (p - 1)) {
						px = cfg.xClose;
						py = cfg.yStart;
						cx = this._xMax;
						cy = this._yMax;
						lx = "hne";
						ly = "hne";
					}
					else {
						let half = i === ((p - 1) / 2);
						px = half ? ((cfg.xClose + cfg.xStart) / 2) : (px + wx);
						py = half ? ((cfg.yStart + cfg.yClose) / 2) : (py - wy);
						cx = half ? ((this._xMax + this._xMin) / 2) : cx + dx;
						cy = half ? ((this._yMax + this._yMin) / 2) : cy + dy;
						lx = "hn";
						ly = "he";
					}

					/* subdivisões: horizontal e vertical */
					if (i > 0) {
						let x = [cfg.xStart, cfg.xClose];
						let y = [cfg.yStart, cfg.yClose];
						svg.lines(x, [py, py]).attribute(cfg.attr_axes);
						if (cy === 0) svg.attribute({"stroke-dasharray": "None"});
						svg.lines([px, px], y).attribute(cfg.attr_axes);
						if (cx === 0) svg.attribute({"stroke-dasharray": "None"});
					}
					/* escala dos eixos: x e y */
					let vx = this._values(cx, this.xAxis);
					let vy = this._values(cy);
					let sx = cfg.xStart - cfg.padding;
					let sy = cfg.yClose + cfg.padding;
					svg.text(px, sy, vx, lx).attribute(cfg.attr_label).title(cx);
					if (this.xAxis === "datetime") svg.attribute({"font-size": "small"});
					svg.text(sx, py, vy, ly).attribute(cfg.attr_label).title(cy);

				}
			}
		},
		/**. ``''string'' _values(''number'' value, ''string'' type)``: Formata e retorna o valor a ser exibido nos eixos.
		. O argumento ``value`` corresponde ao valor numérico a ser formatado. O argumento opcional ``type`` diz respeito ao tipo de informação (''number'', ''time'', ''date'' ou ''datetime'').**/
		_values: {
			value: function(value, type) {
				switch(type) {
					case "date":
						return __DateTime(value).toDateString();
					case "time":
						return __DateTime(value).toTimeString();
					case "datetime":
						return __DateTime(value).format("{YYYY}-{MM}-{DD} {hh}:{mm}");
				}
				let n = __Number(value);
				let e = n.e;

				if (n ==    0) return n.notation("decimal", 0);
				if (e >=  100) return n.notation("scientific", 0);
				if (e >=   10) return n.notation("scientific", 1);
				if (e >=    3) return n.notation("scientific", 2);
				if (e >=    2) return n.notation("decimal", 1);
				if (e >=    1) return n.notation("decimal", 2);
				if (e <= -100) return n.notation("scientific", 0);
				if (e <=  -10) return n.notation("scientific", 1);
				if (e <    -1) return n.notation("scientific", 2);
				return n.notation("decimal", 2);
			}
		},
		/**. ``''void'' _legend(''node'' svg, ''string'' text, ''number'' color)``: Constrói a legenda do gráfico.
		. O argumento ``svg`` é o elemento SVG onde o gŕafico está sendo construído. O argumento ``text`` é o conteúdo da primeiro linha da legenda que, se for ``null``, retornará a função ignorando a legenda. O argumento ``color`` define a cor da legenda.**/
		_legend: {
			value: function(svg, text, color) {
				if (text === null) return;
				let colors = __Array(this._cfg.colors);
				let ncolor = colors.valueOf(color);
				let padd   = this._cfg.padding;
				let delta  = 25;
				let base   = this._cfg.yStart + (1 + color) * (padd + delta);
				let x1     = this._cfg.xClose + padd;
				let x2     = x1 + padd;
				let x3     = this._cfg.width;
				let y1     = base;
				let y2     = y1 - delta;
				let y3     = (y1 + y2)/2;

				svg.lines([x1, x2, x3, x3], [y1, y2, y2, y1], true) /* fundo colorido */
				.attribute(this._cfg.attr_vname)
				.attribute({fill: ncolor, stroke: ncolor})
				.title(text)
				.text(x2+padd, y3, text.split("\n")[0], "hw") /* legenda */
				.attribute(this._cfg.attr_tname)
				.title(text);
			}
		},
		/**. ``''node'' plot()``: Constrói o gráfico e o retorna (elemento SVG).**/
		plot: {
			value: function() {
				if (this._data.length === 0) return null;
				let data   = this._data.slice();
				let colors = __Array(this._cfg.colors);

				/* definindo a área do gráfico -------------------------------------- */
				let svg = __SVG(this._cfg.width, this._cfg.height);
				svg.attribute(this._cfg.attr_svg);

				/* redefinindo funções para array ----------------------------------- */
				if (!this._ratio) {
					let i = -1;
					let x = this._xSpace;
					while(++i < data.length) {
						if (!data[i].f) continue;
						let list = __Data2D(x, data[i].y);
						if (list.error) return false;
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
						/* transformando coordenadas reais para gráficas */
						x.forEach(function(v,i,a){a[i] = self._xScale(v);});
						y.forEach(function(v,i,a){a[i] = self._yScale(v);});
						/* plotando de acordo com o tipo de curva */
						if (data[i].type === "line" || data[i].type === "link") {
							svg.lines(x, y)
							.attribute(this._cfg.curve_line)
							.attribute({stroke: colors.valueOf(color)});
							if (name !== null) svg.title(name);
							this._legend(svg, name, color);
						}
						if (data[i].type === "dash") {
							svg.lines(x, y)
							.attribute(this._cfg.curve_dash)
							.attribute({stroke: colors.valueOf(color)});
							if (name !== null) svg.title(name);
							this._legend(svg, name, color);
						}
						if (data[i].type === "dots" || data[i].type === "link") {
							let j = -1;
							while(++j < x.length) {
								svg.circle(x[j], y[j], 4)
								.attribute({fill: colors.valueOf(color)})
								.title((name === null ? "" : name+"\n")+"("+data[i].x[j]+", "+data[i].y[j]+")");
							}
							this._legend(svg, name, color);
						}
						if (data[i].type === "sum") {
							let fit = __Data2D(data[i].x, data[i].y);
							let sum = fit.area;
							/* obter posicionamento para inserir o rótulo da área */
							let min = Math.min.apply(null, fit.y);
							let max = Math.max.apply(null, fit.y);
							let big = Math.abs(max) >= Math.abs(min) ? max : min;
							let ind = fit.y.indexOf(big);
							let ym  = this._yScale(big/2);
							let xm  = this._xScale(fit.x[ind]);
							let pm  = "hc";
							if (xm <= this._cfg.xStart) xm += this._cfg.padding;
							if (xm >= this._cfg.xClose) xm -= this._cfg.padding;
							if (xm <= (this._cfg.xStart + this._cfg.xSize/4)) pm = "hw";
							if (xm >= (this._cfg.xClose - this._cfg.xSize/4)) pm = "he";
							/* acrescendo informação da média ao nome */
							name   += "\n∑ yΔx ≈ " + sum;
							/* unindo a curva ao eixo horizontal */
							x.unshift(x[0]);
							x.push(x[x.length - 1]);
							y.unshift(self._yScale(0));
							y.push(self._yScale(0));
							/* plotando */
							svg.lines(x, y, true) /* área */
							.attribute(this._cfg.curve_sum)
							.attribute({stroke: colors.valueOf(color), fill: colors.valueOf(color)})
							.title(name)
							.text(xm, ym, this._values(sum), pm) /* valor numérico */
							.attribute(this._cfg.attr_tname)
							.attribute({fill: colors.valueOf(color)})
							.title(name);
							this._legend(svg, name, color);
						}
						if (data[i].type === "avg") {
							let fit = __Data2D(data[i].x, data[i].y);
							let avg = fit.average;
							let xi  = this._xScale(this._xMin);
							let xn  = this._xScale(this._xMax);
							let ya  = this._yScale(avg);
							name   += "\n(∑ yΔx)/ΔX ≈ "+avg;
							/* plotando a curva e a linha média */
							svg.lines(x, y)
							.attribute(this._cfg.curve_dash)
							.attribute({stroke: colors.valueOf(color)})
							.title(name);
							svg.lines([xi, xn], [ya, ya])
							.attribute(this._cfg.curve_line)
							.attribute({stroke: colors.valueOf(color)})
							.title(name);
							svg.text(x[0]+5, ya-5, this._values(avg), "hsw")
							.attribute(this._cfg.attr_tname)
							.attribute({fill: colors.valueOf(color)})
							.title(name);
							this._legend(svg, name, color);
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
						.attribute(this._cfg.attr_title);
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
							else p = "hw";
							svg.text(x, y, item.name+" ("+item._ratio+")", p)
							.attribute({fill: color, "stroke-linecap": "round"})
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
							.title(item.name+"\n"+this.yLabel+": "+item._value+"");
							/* legenda */
							svg.text(
								x + width/2,
								item.value >= 0 ? (y+h+5) : (y-5),
								this._values(item.value),
								item.value >= 0 ? "hn" : "hs"
							)
							.attribute({fill: color});
							this._legend(svg, item.name, i);
						}
						svg.lines( /* linha central */
							[this._cfg.left, this._cfg.right],
							[this._yScale(0), this._yScale(0)]
						).attribute(this._cfg.attr_area)
						.text( /* título */
							this._cfg.xMiddle,
							this._cfg.top,
							this.title,
							"hc"
						).attribute(this._cfg.attr_title)
						.text( /* Rótulo da quantidade de elementos */
							this._cfg.right,
							this._cfg.height-this._cfg.padding,
							this.xLabel+": "+count,
							"hse"
						).attribute(this._cfg.attr_label)
						.text( /* Rótulo da soma de valores */
							this._cfg.left,
							this._cfg.height-this._cfg.padding,
							this.yLabel+": "+__Number(total).notation(),
							"hsw"
						).attribute(this._cfg.attr_label);
					}
				}
				return svg.svg();
			}
		},
		/**. ``''string'' xLabel``: Define ou retorna o valor do rótulo do eixo x.**/
		xLabel: {
			get: function()  {return this._xLabel;},
			set: function(x) {this._xLabel = x === null || x === undefined ? "X Label" : String(x);}
		},
		/**. ``''string'' yLabel``: Define ou retorna o valor do rótulo do eixo y.**/
		yLabel: {
			get: function()  {return this._yLabel;},
			set: function(x) {this._yLabel = x === null || x === undefined ? "Y Label" : String(x);}
		},
		/**. ``''string'' title``: Define ou retorna o valor do título do gráfico.**/
		title: {
			get: function()  {return this._title;},
			set: function(x) {this._title = x === null || x === undefined ? "Title" : String(x);}
		},
		/**. ``''string'' xAxis``: Define ou retorna o tipo de dado do eixo ``x``: ''number'', ''date'', ''time'' ou ''datetime''**/
		xAxis: {
			get: function()  {return this._xAxis;},
			set: function(x) {
				let values  = ["number", "date", "time", "datetime"];
				this._xAxis = values.indexOf(x) >= 0 ? x : "number";
			}
		},
		/**. ``''boolean'' add(''array'' x, ''any'' y, ''string'' label, ''string'' option)``: Adiciona dados para plotagem e retorna falso se não for possível processar a solicitação.
		. Os argumentos ``x`` e ``y`` representam a abscissa (eixo horizontal) e a ordenada (eixo vertical), respectivamente. Seus valores dependem do tipo de gráfico.
		. No caso de plotagem no __plano cartesiano__, o valor de ``x`` deverá ser uma lista de valores numéricos ou de data/tempo. Já o valor de ``y`` poderá ser uma __função__ que retorna um valor numérico finito; uma __lista__ de valores finitos; ou uma __constante numérica__ finita.
		. No caso de plotagem de __gráfico de proporcionalidade__ (circular ou de barras), o valor de ``x`` poderá ser uma lista de identificadores (numéricos ou string) e ``y`` uma lista de valores numéricos correspondentes aos identificadores definidos em ``x``.
		. O valor de ``x`` também poderá ser um objeto, cujos atributos definirão os identificadores, tornado o valor de ``y`` desnecessário.
		. No caso de gráfico de proporcionalidade, o comportamento padrão é exibir uma gráfico circular, mas se existir valores positivos e negativos para os identificadores, um gráfico de barras será exibido.
		. O argumento ``label`` é utilizado para identificar o gráfico no caso de plano cartesiano.
		. O argumento ``option`` é opcional e direcionado para o gráfico de plano cartesiano com valores de ``x`` e ``y`` como array. Seus valores podem ser (todos retornam valores aproximados):
		|Valor|Descrição|
		|linear|Traça a regressão linear.|
		|geometric|Traça a regressão geométrica.|
		|logarithmic|Traça a regressão logarítmica.|
		|exponential|Traça a regressão exponencial.|
		|minimum|Traça a regressão com o menor valor de desvio padrão.|
		|avg|Traça o valor médio da curva.|
		|sum|Traça a área sob a curva.|
		|line|Traça uma linha ligando os pontos da curva.|
		|link|Traça uma linha ligando os pontos demarcados da curva.|
		|dots|Traça os pontos demarcados.|**/
		add: {
			value: function(x, y, label, option) {
				let xdata = __Type(x);
				let ydata = __Type(y);
				label = label === null || label === undefined ? "Label ?" : String(label).trim();

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
					/* checando dados e definindo tipos de curvas */
					if (!xdata.array) return false;
					option    = String(option).trim();
					let types = {
						function: {sum: "sum", avg: "avg", line: "line", main: "line"},
						finite:   {sum: "sum", main: "line"},
						array:    {sum: "sum", avg: "avg", line: "line", link: "link", dots: "dots", main: "link"},
						fit:      {
							linear:    "linearFit",    exponential: "exponentialFit",
							geometric: "geometricFit", logarithmic: "logarithmicFit",
							minimum:   "minDeviation"
						}
					};
					/* definindo limites superiores e inferiores no caso de área */
					if (option === "sum") {
						this._yMin = 0;
						this._yMax = 0;
					}
					/* Y é função ------------------------------------------------------- */
					if (ydata.function) {
						let curve = types.function;
						let data  = __Data2D(x, x);
						if (data.error) return false;
						let xmin   = Math.min.apply(null, data.x);
						let xmax   = Math.max.apply(null, data.x);
						this._xMin = xmin;
						this._xMax = xmax;
						this._data.push({
							x:     [xmin, xmax],
							y:     y,
							name:  label,
							f:     true,
							type:  option in curve ? curve[option] : curve.main,
							color: ++this._color
						});
						return true;
					}
					/* Y é constante ---------------------------------------------------- */
					else if (ydata.finite) {
						let curve = types.finite;
						let data  = __Data2D(x, y);
						if (data.error) return false;
						let cte    = ydata.value;
						let xmin   = Math.min.apply(null, data.x);
						let xmax   = Math.max.apply(null, data.x);
						this._xMin = xmin;
						this._xMax = xmax;
						if (this._yMin >= cte)
							this._yMin = cte === 0 ? -1 : cte - Math.abs(cte/2);
						if (this._yMax <= cte)
							this._yMax = cte === 0 ? +1 : cte + Math.abs(cte/2);
						this._data.push({
							x:     [xmin, xmax],
							y:     [cte, cte],
							name:  label+"\ny = "+cte,
							f:     false,
							type:  option in curve ? curve[option] : curve.main,
							color: ++this._color
						});
						return true;
					}
					/* Y é array -------------------------------------------------------- */
					else if (ydata.array) {
						let curve = types.array;
						let data  = __Data2D(x, y);
						if (data.error) return false;
						let xlimit = {
							min: Math.min.apply(null, data.x),
							max: Math.max.apply(null, data.x)
						};
						let ylimit = {
							min: Math.min.apply(null, data.y),
							max: Math.max.apply(null, data.y)
						};
						this._xMin = xlimit.min;
						this._xMax = xlimit.max;
						this._yMin = ylimit.min;
						this._yMax = ylimit.max;
						this._data.push({
							x:     data.x,
							y:     data.y,
							name:  label,
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
									x:     [xlimit.min, xlimit.max],
									y:     fit.f,
									name:  null,
									f:     true,
									type:  "line",
									color: this._color
							});
							/* desvio padrão */
							if (fit.d === 0) return true;
							this._data.push({
									x:     [xlimit.min, xlimit.max],
									y:     function(x) {return fit.f(x)+fit.d;},
									name:  null,
									f:     true,
									type:  "dash",
									color: this._color
							});
							this._data.push({
									x:     [xlimit.min, xlimit.max],
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










/* == BLOCO 2 ================================================================*/

/*----------------------------------------------------------------------------*/
	/**### Interface do Usuário
	Trata-se de construtores e funções para interface com o usuário na manipulação de dados.

	#### WDmain
	###### ``**constructor** ''object'' WDmain(''any''  input, ''object'' data)``
	Construtor genérico para manipulação de dados cujos construtores específicos herdarão seu comportamento.
	O argumento ``input`` se refere ao dado informado pelo usuário e o argumento ``data`` corresponde à instância de ``__Type``, cuja alimentação será realizada pela função ``WD``.**/
	function WDmain(input, data) {
		Object.defineProperties(this, {
			_input: {value: input},
			_data:  {value: data},
		});
	}

	Object.defineProperties(WDmain.prototype, {
		constructor: {value: WDmain},
		/**. ``''string'' type``: Retorna o tipo do dado.**/
		type: {
			get: function() {return this._data.type;}
		},
		/**. ``''self'' lang(''string'' local)``: Define a linguagem no argumento ``local`` e retorna o próprio objeto.**/
		lang: {
			value: function(local) {
				__LANG.user = local;
				return this;
			}
		},
		//FIXME fazer monetary igual a lang





		/**. ``''boolean'' is(''string'' type)``: Retorna verdadeiro se o argumento ``type`` corresponder ao tipo de dado (ver ``__Type``).**/
		is: {
			value: function(type) {
				return arguments.length === 0 ? false : (this._data[type] === true);
			}
		},
		/**. ``''boolean'' or(''string'' type...)``: Retorna verdadeiro se algum dos tipos informados no argumento ``type`` corresponder ao tipo de dado.**/
		or: {
			value: function() {
				var i = -1;
				while (++i < arguments.length)
					if (this.is(arguments[i])) return true;
				return false;
			}
		},
		/**. ``''boolean'' and(''string'' type...)``: Retorna verdadeiro se todos os tipos informados no argumento ``type`` corresponder ao tipo de dado.**/
		and: {
			value: function() {
				var i = -1;
				while (++i < arguments.length)
					if (!this.is(arguments[i])) return false;
				return true;
			}
		},
		/**. ``''any'' valueOf()``: Retorna o valor do dado (ver ``__Type``).**/
		valueOf: {
			value: function() {
				return this._data.valueOf();
			}
		},
		/**. ``''string'' toString()``: Retorna o valor textual do dado (ver ``__Type``).**/
		toString: {
			value: function() {
				return this._data.toString();
			}
		},
		/**. ``''string'' mask(''string'' mask, ''function'' callback)``: Retorna o valor o valor formatado por uma máscara. O argumento ``mask`` define o formato da máscara e o argumento opcional ``callback`` o método que irá avaliar o retorno da máscara. Se a máscara não casa, será retornado nulo.**/
		mask: {
			value: function(mask, callback) {
				return new __String(this._input).mask(mask, callback)
			}
		},
		/**. ``''self'' read(''object'' options)``: Lê arquivos. O argumento ``options`` é um objeto que define os atributos da requisição (maxtime, method, onchange e ondone). (ver ``__Request.read``)**/
		read: {
			value: function(options) {
				let opt  = {maxtime: 0, method: null, onchange: null, ondone: null};
				let data = __Type(this._input);
				let pack = [];
				/* obtendo lista de arquivos a depender do tipo */
				if (this.type === "node") pack = this.files;
				else if (data.file)       pack = this._data.value;
				if (pack.length === 0)    return this;
				/* acertando opções */
				if (__Type(options).object) {
					for (let i in opt)
						if (i in options) opt[i] = options[i];
				}
				/* executando leituras */
				pack.forEach(function (v,i,a){
					let request = new __Request(v);
					for (let i in opt) request[i] = opt[i];
					request.read();
				});
				return this;
			}
		},
		/**. ``''self'' send(''string'' target, ''object'' options)``: Lê arquivos. O argumento ``target`` é o alvo da requisição e o argumento ``options`` é um objeto que define os atributos da requisição (maxtime, user, password, header, method, onchange e ondone). (ver ``__Request.send``)**/
		send: {
			value: function (target, options) {
				let url = __URL(target);
				let opt = {
					maxtime:    0, user:     null, password: null, header:  {},
					method:  null, onchange: null, ondone:   null
				};

				/* obtendo dados para envio */
				switch(this.type) {
					case "node": {
						let submit = this.submit;
						/* não requisitar se não houver dados para nó HTML (erro no formulário) */
						if (submit === null) return this;
						submit.forEach(function (v,i,a) {url.append(v.name, v.value);});
						break;
					}
					case "object": {
						for (let i in this._input) url.append(i, this._input[i]);
						break;
					}
					case "array": {
						this._data.value.forEach(function(v,i,a) {url.append(i, v);});
						break;
					}
					case "file": {
						url.append(this.type, this._data.value);
						break;
					}
					case "number": {
						url.append(this.type, this._data.value);
						break;
					}
					default: {
						url.append(this.type, this.toString());
					}
				}
				/* acertando opções */
				if (__Type(options).object) {
					for (let i in opt)
						if (i in options) opt[i] = options[i];
				}
				/* checando o tipo de requisição */
				let method = String(opt.method).toUpperCase().trim();
				let head   = method === "GET" || method === "HEAD";
				let pack   = head ? null : url.form;
				/* abrindo requisição, definindo parâmetros e enviando */
				let request = new __Request(head ? url.target : target);
				for (let i in opt) request[i] = opt[i];
				request.send(pack);
				return this;
			}
		},
		/**. ``''self'' signal(''string'' title)``: Renderiza uma mensagem.**/
		signal: {
			value: function(title) {
				__SIGNALCONTROL.open(this.toString(), title);
				return this;
			}
		},
		/**. ``''self'' signal(''string'' title)``: Renderiza uma notificação. Se o tipo de dado for **/
		notify: { /*renderizar notificação*/
			value: function(title) {
				__SIGNALCONTROL.notify(this.toString(), title);
				return this;
			}
		},



		chart: {
			value: function(options) {
				let table = __Table();
				switch(this.type) {
					case "string": {
						table.matrix(this.csv);
						break;
					}
					case "array": {
						table.matrix(this._input);
						break;
					}
					case "node": {
						let table = null;
						this.forEach(function (v,i) {
							if (table.rows !== 0) return;
							table.table(v)
						});
						break;
					}
				}
				return table.plot(options);
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#### WDstring
	###### ``**constructor** ''object'' WDstring(''any''  input, ''object'' data)``
	Construtor genérico para manipulação de strings. Os argumentos ``input`` e ``data`` se referem aos argumento de ``WDmain``**/
	function WDstring(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __String(data.value)},
		});
	}

	WDstring.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDstring},
		/**. ``''string'' upper``: Retorna caixa alta.**/
		upper: {
			get: function() {return this._main.upper;}
		},
		/**. ``''string'' lower``: Retorna caixa baixa.**/
		lower: {
			get: function() {return this._main.lower;}
		},
		/**. ``''string'' capitalize``: Retorna a primeira letra de cada palavra em caixa alta.**/
		capitalize: {
			get: function() {return this._main.capitalize;}
		},
		/**. ``''string'' toggle``: Inverte a caixa.**/
		toggle: {
			get: function() {return this._main.toggle;}
		},
		/**. ``''string'' camel``: Transforma a string em camelCase.**/
		camel: {
			get: function() {return this._main.camel;}
		},
		/**. ``''string'' dash``: Divide a string em traços.**/
		dash: {
			get: function() {return this._main.dash;}
		},
		/**. ``''string'' clear``: Remove acentos.**/
		clear: {
			get: function() {return this._main.clear(false, true);}
		},
		/**. ``''string'' trim``: Remove espaços excedentes.**/
		trim: {
			get: function() {return this._main.clear(true, false);}
		},
		/**. ``''string'' clean``: Remove acentos e espaços excedentes.**/
		clean: {
			get: function() {return this._main.clear();}
		},
		/**. ``''array'' csv``: Retorna string em CSV para array.**/
		csv: {
			get: function() {return this._main.csv;},
		},
		/**. ``''any'' json``: Retorna notação em JSON para valor em Javascript ou nulo se inválido.**/
		json: {
			get: function() {return this._main.json;},
		},
		/**. ``''node'' html``: Retorna notação em HTML para documento correspondente ou nulo se inválido.**/
		html: {
			get: function() {return this._main.html;},
		},
		/**. ``''node'' xml``: Retorna notação em XML para documento correspondente ou nulo se inválido.**/
		xml: {
			get: function() {return this._main.xml;},
		},
	});

/*----------------------------------------------------------------------------*/
	/**#### WDnumber
	###### ``**constructor** ''object'' WDnumber(''any''  input, ''object'' data)``
	Construtor genérico para manipulação de números. Os argumentos ``input`` e ``data`` se referem aos argumento de ``WDmain``**/
	function WDnumber(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main:        {value: new __Number(data.value)},
			_measurement: {value: null, writable: true},
			_monetary:    {value: null, writable: true},
			_digits:      {value: 2, writable: true},
		});
	}

	WDnumber.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnumber},
		/**. ``''object'' decDigits(''integer'' n)``: Fixa a quantidade de dígitos (argumento ``n``) para referência aos atributos e retorna o próprio objeto.**/
		digits: {
			value: function(n) {
				let check = __Type(n);
				if (check.integer && !check.negative && check.finite)
					this._digits = check.value;
				return this;
			}
		},
		/**. ``''object'' monetary(''string'' n)``: Fixa o código monetário (argumento ``n``) para referência aos atributos e retorna o próprio objeto.**/
		monetary: {
			value: function(n) {
				this._monetary = String(n).trim();
				return this;
			},
		},
		/**. ``''object'' measurement(''string'' n)``: Fixa o nome da unidade de medida (argumento ``n``) para referência aos atributos e retorna o próprio objeto.**/
		measurement: {
			value: function(n) {
				this._measurement = String(n).trim();
				return this;
			}
		},
		/**. ``''integer'' int``: Retorna a parte inteira.**/
		int: {
			get: function() {return this._main.int;}
		},
		/**. ``''number'' dec``: Retorna a parte decimal.**/
		dec: {
			get: function() {return this._main.dec;}
		},
		/**. ``''number'' abs``: Retorna o valor absoluto.**/
		abs: {
			get: function() {return this._main.abs;}
		},
		/**. ``''string'' bytes``: Retorna o valor em bytes.**/
		bytes: {
			get: function() {return this._main.bytes;}
		},
		/**. ``''boolean'' prime``: Informa se o número é primo.**/
		prime: {
			get: function() {return this._main.prime;}
		},
		/**. ``''array'' primes``: Retorna uma lista de primos até o número.**/
		primes: {
			get: function() {return this._main.primes;}
		},
		/**. ``''string'' significant: Retorna o número com a quantidade de dígitos significativos definida.**/
		significat: {
			get: function() {return this._main.notation("significant", this._digits);}
		},
		/**. ``''string'' decimal: Retorna o número com a quantidade de casas decimais definida.**/
		decimal: {
			get: function() {return this._main.notation("decimal", this._digits);}
		},
		/**. ``''string'' integer: Retorna o número com a quantidade de dígitos inteiros definida.**/
		integer: {
			get: function() {return this._main.notation("integer", this._digits);}
		},
		/**. ``''string'' percent: Retorna o número em notação percentual com a quantidade de casas decimais definida.**/
		percent: {
			get: function() {return this._main.notation("percent", this._digits);}
		},
		/**. ``''string'' unit: Retorna o número com a unidade de medida definida.**/
		unit: {
			get: function() {return this._main.notation("unit", this._measurement);}
		},
		/**. ``''string'' scientific: Retorna o número em notação científica com a quantidade de casas decimais definida.**/
		scientific: {
			get: function() {return this._main.notation("scientific", this._digits);}
		},
		/**. ``''string'' engineering: Retorna o número em notação de engenharia com a quantidade de casas decimais definida.**/
		engineering: {
			get: function() {return this._main.notation("engineering", this._digits);}
		},
		/**. ``''string'' compact: Retorna o número em notação compacta longa.**/
		compact: {
			get: function() {return this._main.notation("compact1", null);}
		},
		/**. ``''string'' compact: Retorna o número em notação compacta curta.**/
		shortCompact: {
			get: function() {return this._main.notation("compact2", null);}
		},
		/**. ``''string'' currency: Retorna o número em notação monetária.**/
		currency: {
			get: function() {return this._main.notation("currency1", this._monetary);}
		},
		/**. ``''string'' shortCurrency: Retorna o número em notação monetária curta.**/
		shortCurrency: {
			get: function() {return this._main.notation("currency2", this._monetary);}
		},
		/**. ``''string'' longCurrency: Retorna o número em notação monetária longa.**/
		longCurrency: {
			get: function() {return this._main.notation("currency3", this._monetary);}
		},
		/**. ``''number'' round: Retorna o número arredondando-o pela quantidade de casas decimais definida.**/
		round: {
			get: function() {return this._main.round(this._digits);}
		},
		/**. ``''number'' cut: Retorna o número cortando-o pela quantidade de casas decimais definida.**/
		cut: {
			get: function() {return this._main.cut(this._digits);}
		},
		/**. ``''string'' frac: Retorna o número em forma de fração aproximado pela quantidade de casas decimais definida.**/
		frac: {
			get: function() {return this._main.frac(this._digits);}
		},



		toString: {//FIXME descrição
			value: function() {
				return this._main.toString();
			}
		},
		toLocaleString: {//FIXME descrição
			value: function(locale) {
				return this._main.toLocaleString();
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#### WDdatetime
	###### ``**constructor** ''object'' WDdatetime(''any''  input, ''object'' data)``
	Construtor genérico para manipulação de tempo. Os argumentos ``input`` e ``data`` se referem aos argumento de ``WDmain``**/
	function WDdatetime(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __DateTime(data.value)},
		});
	}

	WDdatetime.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDdatetime},
		/**. ``''integer'' year``: Define e retorna o ano.**/
		year: {
			get: function()  {
				return this.type === "time" ? undefined : this._main.year;
			},
			set: function(x) {
				if (this.type !== "time") this._main.year = x;
			}
		},
		/**. ``''integer'' month``: Define e retorna o mês.**/
		month: {
			get: function()  {
				return this.type === "time" ? undefined : this._main.month;
			},
			set: function(x) {
				if (this.type !== "time") this._main.month = x;
			}
		},
		/**. ``''integer'' day``: Define e retorna o dia.**/
		day: {
			get: function()  {
				return this.type === "time" ? undefined : this._main.day;
			},
			set: function(x) {
				if (this.type !== "time") this._main.day = x;
			}
		},
		/**. ``''integer'' hour``: Define e retorna a hora.**/
		hour: {
			get: function()  {
				return this.type === "date" ? undefined : this._main.hour;
			},
			set: function(x) {
				if (this.type !== "date") this._main.hour = x;
			}
		},
		/**. ``''integer'' minute``: Define e retorna o minuot.**/
		minute: {
			get: function()  {
				return this.type === "date" ? undefined : this._main.minute;
			},
			set: function(x) {
				if (this.type !== "date") this._main.minute = x;
			}
		},
		/**. ``''number'' second``: Define e retorna o segundo.**/
		second: {
			get: function()  {
				return this.type === "date" ? undefined : this._main.second;
			},
			set: function(x) {
				if (this.type !== "date") this._main.second = x;
			}
		},
		/**. ``''integer'' h12``: Retorna a hora no formato 12h (1-12).**/
		h12: {
			get: function() {
				return this.type !== "date" ? this._main.h12 : undefined;
			},
		},
		/**. ``''boolean'' leap``: Informa se a data é ano bissexto.**/
		leap: {
			get: function() {
				return this.type !== "time" ? this._main.leap : undefined;
			}
		},
		/**. ``''integer'' dayYear``: Retorna o dia do ano (1-365).**/
		dayYear: {
			get: function() {
				return this.type !== "time" ? this._main.dayYear : undefined;
			}
		},
		/**. ``''integer'' weekDay``: Retorna o dia da semana (1-7).**/
		weekDay: {
			get: function() {
				return this.type !== "time" ? this._main.weekDay : undefined;
			}
		},
		/**. ``''integer'' week``: Retorna a semana do ano (1-54).**/
		week: {
			get: function() {
				return this.type !== "time" ? this._main.week : undefined;
			}
		},
		/**. ``''boolean'' workingDay``: Informa se o dia é útil.**/
		workingDay: {
			get: function() {
				return this.type !== "time" ? this._main.workingDay : undefined;
			}
		},
		/**. ``''integer'' workingDays``: Retorna a quantidade de dias úteis até a data.**/
		workingDays: {
			get: function() {
				return this.type !== "time" ? this._main.workingDays : undefined;
			}
		},
		/**. ``''integer'' nonWorkingDays``: Retorna a quantidade de dias não úteis até a data.**/
		nonWorkingDays: {
			get: function() {
				return this.type !== "time" ? this._main.nonWorkingDays : undefined;
			}
		},
		/**. ``''integer'' width``: Retorna a quantidade de dias do mês (28-31).**/
		width: {
			get: function() {
				return this.type !== "time" ? this._main.width : undefined;
			}
		},
		/**. ``''string'' format(''string'' str)``: Pre-formata data/tempo a partir de codificação específica.**/
		format: {
			value: function(str) {
				return this._main.format(str);
			}
		},
		/**. ``''string'' toString()``: Retorna uma string nos formatos de data ou tempo.**/
		toString: {
			value: function() {
				if (this.type === "time") return this._main.toTimeString();
				if (this.type === "date") return this._main.toDateString();
				return this._main.toString();
			}
		},
		/**. ``''number'' valueOf()``: Retorna a quantidade de segundos ou dias desde a origem (0000-01-01).**/
		valueOf: {
			value: function() {
				if (this.type === "time") return this._main.timeOf();
				if (this.type === "date") return this._main.dateOf();
				return this._main.valueOf();
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#### WDarray
	###### ``**constructor** ''object'' WDarray(''any''  input, ''object'' data)``
	Construtor genérico para manipulação de tempo. Os argumentos ``input`` e ``data`` se referem aos argumento de ``WDmain``**/
	function WDarray(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __Array(data.value)},
		});
	}

	WDarray.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDarray},
		/**. ``''number'' min``: Retorna o menor número finito da lista ou ``null``.**/
		min: {
			get: function() {return this._main.min;}
		},
		/**. ``''number'' max``: Retorna o maior número finito da lista ou ``null``.**/
		max: {
			get: function() {return this._main.max;}
		},
		/**. ``''number'' sum``: Retorna a soma dos números finitos da lista ou ``null``.**/
		sum: {
			get: function() {return this._main.sum;}
		},
		/**. ``''number'' avg``: Retorna a média dos números finitos da lista ou ``null``.**/
		avg: {
			get: function() {return this._main.avg;}
		},
		/**. ``''number'' med``: Retorna a mediana dos números finitos da lista ou ``null``.**/
		med: {
			get: function() {return this._main.med;}
		},
		/**. ``''number'' harm``: Retorna a média harmônica dos números finitos da lista ou ``null``.**/
		harm: {
			get: function() {return this._main.harm;}
		},
		/**. ``''number'' geo``: Retorna a média geométrica dos números finitos da lista ou ``null``.**/
		geo: {
			get: function() {return this._main.geo;}
		},
		/**. ``''number'' gcd``: Retorna máximo divisor comum dos números finitos da lista ou ``null``.**/
		gcd: {
			get: function() {return this._main.gcd;}
		},
		/**. ``''array'' mode``: Retorna uma lista com os items mais recorrents da lista.**/
		mode: {
			get: function() {return this._main.mode;}
		},
		/**. ``''array'' unique``: Retorna a lista sem valores repetidos.**/
		unique: {
			get: function() {return this._main.unique;}
		},
		/**. ``''array'' asc``: Retorna a lista ordenada de forma ascentende.**/
		asc: {
			get: function() {return this._main.sort(true);}
		},
		/**. ``''array'' desc``: Retorna a lista ordenada de forma descendente.**/
		desc: {
			get: function() {return this._main.sort(false);}
		},
		/**. ``''array'' sort``: Retorna a lista com ordem inversa ou forma ascendente, se desordenada.**/
		sort: {
			get: function() {return this._main.sort();}
		},
		/**. ``''array'' order``: Retorna a lista ordenada de forma ascendente sem repetições.**/
		order: {
			get: function() {return this._main.order;}
		},
		/**. ``''array'' add(''any'' ...)``: Adicina itens ao fim da lista e a retorna.**/
		add: {
			value: function() {return this._main.add.apply(this._main, arguments);}
		},
		/**. ``''array'' jump(''any'' ...)``: Adicina itens ao início da lista e a retorna.**/
		jump: {
			value: function() {return this._main.jump.apply(this._main, arguments);}
		},
		/**. ``''array'' put(''any'' ...)``: Adicina itens, se inexistentes, ao fim da lista e a retorna.**/
		put: {
			value: function() {return this._main.put.apply(this._main, arguments);}
		},
		/**. ``''array'' concat(''any'' ...)``: Concatena itens ou arrays ao fim da lista e a retorna.**/
		concat: {
			value: function() {return this._main.concat.apply(this._main, arguments);}
		},
		/**. ``''array'' remove(''any'' ...)``: Remove da lista todas as ocorrências dos itens especificados e a retorna.**/
		remove: {
			value: function() {return this._main.remove.apply(this._main, arguments);}
		},
		/**. ``''array'' toggle(''any'' ...)``: Alterna a existência dos itens especificados na lista e a retorna.**/
		toggle: {
			value: function() {return this._main.toggle.apply(this._main, arguments);}
		},
		/**. ``''array'' replace(''any'' from, ''any'' to)``: Altera todas as ocorrências (``from``) pelo novo valor (``to``) e retorna a lista modificada.**/
		replace: {
			value: function(from, to) {return this._main.replace(from, to);}
		},
		/**. ``''array'' search(''any'' value)``: Retorna uma lista com os índices em que o argumento ``value`` aparece.**/
		search: {
			value: function(value) {return this._main.search(value);}
		},
		/**. ``''any'' item(''integer'' index)``: Retorna o item especificado no argumento ``index`` considerando uma lista circular.**/
		item: {
			value: function(index) {return this._main.valueOf(__Type(index).number ? index : 0);}
		},
		/**. ``''string'' toString()``: Retorna a lista em forma de JSON.**/
		toString: {
			value: function() {return JSON.stringify(this._data.value);}
		},
		/**. ``''array'' valueOf()``: Retorna uma cópia da lista.**/
		valueOf: {
			value: function() {return this._main.valueOf().slice();}
		},

		//FIXME
		csv: { /* matriz para csv */
			get: function() {return wd_array_csv(this.valueOf());}
		},
		cell: { /* retorna uma lista de valores a partir de endereços de uma matriz do tipo linha:coluna */
			value: function() {
				return wd_array_cells(this.valueOf(), Array.prototype.slice.call(arguments));
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#### WDnode
	###### ``**constructor** ''object'' WDnode(''any''  input, ''object'' data)``
	Construtor genérico para manipulação de nós HTML. Os argumentos ``input`` e ``data`` se referem aos argumento de ``WDmain``**/
	function WDnode(input, data) {
		WDmain.call(this, input, data);
		/*Object.defineProperties(this, {
			_main: {value: new __Array(data.value)},
		});*/
	}

	WDnode.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnode},
		/**. ``''array'' valueOf()``: Retorna uma cópia da lista contendo os nós HTML.**/
		valueOf: { /* método padrão */
			value: function() {return this._data.value.slice();}
		},
		/**. ``''self'' forEach(''function'' callback)``: Executa looping nos nós HTML, informando-os no argumento ``callback`` que receberá dois argumento: o nó HTML e sua sequência numérica na lista.**/
		forEach: {
			value: function(callback) {
				if (!__Type(callback).function) return;
				this._data.value.forEach(function(v,i,a) {callback(v,i);});
				return this;
			}
		},
		/**. ``''array'' files``: Retorna uma lista com os arquivos selecionados nos campos de formulário.**/
		files: {
			get: function() {
				let pack = [];
				this.forEach(function(v,i) {
					let node = __Node(v);
					if (node.type === "file") {
						let i = -1;
						while(++i < v.files.length) pack.push(v.files[i]);
					}
				});
				return pack;
			}
		},
		/**. ``''array'' submit``: Retorna uma lista de objetos contendo o nome e o valor dos campos de formulários. Se houver algum campo com erro, retornará nulo.**/
		submit: {
			get: function() {
				let data  = [];
				let error = false;
				this.forEach(function(v,i) {
					if (error) return;
					let node = __Node(v);
					let form = node.submit;
					if (form === null) return;
					if (!form.validity)
						error = true;
					else
						data.push({name: form.name, value: form.value});
				});
				return error ? null : data;
			}
		},
		/**. ``''self'' load(''string'' html, ''boolean'' replace, ''boolean'' run)``: Insere o código HTML contido em ``html`` no elemento. Se ``replace`` for verdadeiro, substituirá o elemento pelo código. Se ``run``for verdadeiro, rodará scripts.**/
		load: {
			value: function(html, replace, run) {
				this.forEach(function(v,i) {__Node(v).load(html, replace, run);});
				return this;
			}
		},
		/**. ``''self'' repeat(''array'' list)``: Repete elementos a partir de um modelo. ``list`` é uma lista de objetos cujo valor do atributo substituirá o respectivo valor entre do modelo que será informado em chaves duplas ({{atributo}}).**/
		repeat: {
			value: function(list) {
				this.forEach(function(v,i) {__Node(v).repeat(list);});
				return this;
			}
		},
		/**. ``''self'' set(''object'' values)``: Define os atributos especificados em ``values`` com seus respectivos valores (ver __Node.atrribute).**/
		set: {
			value: function(values) {
				if (!__Type(values).object) return this;
				this.forEach(function(v,i) {
					let node = __Node(v);
					for (let i in values) node.attribute(i, values[i]);
				});
				return this;
			}
		},
		/**. ``''self'' display(''string'' action)``: Organiza a exibição dos elementos filhos. O argumento ``action`` define a forma de organização:
		- A ação "show" exibe o elemento;
		- A ação "hide" esconde o elemento;
		- A ação "toggle" alterna a exibição do elemento;
		- A ação "ahead" exibe o elemento e esconde os irmãos;
		- A ação "behind" exibe os irmãos e esconde o elemento;
		- A ação "full" exibe o elemento em tela cheia;
		- A ação "all" exibe o elemento e seus irmãos;
		- A ação "none" esconde o elemento e seus irmãos;
		- A ação "asc" ordena os filhos em ordem crescente;
		- A ação "desc" ordena os filhos em ordem decrescente;
		- A ação "sort" alterna a ordenação dos filhos;
		- Um número inteiro positivo ''n'' exibe o filho que está a ''n'' posições adiante do elemento atual (ciclo infinito);
		- Um número inteiro negativo ''n'' exibe o filho que está a ''n'' posições atrás do elemento atual (ciclo infinito);
		- Numeros inteiros não negativos separados pelo caractere traço (''-'') definem o intervalo de filhos a ser exibido. Os números indicam os índices inicial e final dos filhos, independente da ordem. Utilize o caractere * para designar o último elemento;
		- Números separados pelo caractere dois pontos ('':'') organizam a exibição dos filhos em grupos de determinada quantidade. O número após o separador define a quantidade de filhos de cada grupo, devendo ser um número positivo. O número antes do separador define o grupo a ser exibido, devendo ser um número inteiro maior ou igual a zero sem sinal (utilize o caractere ''*'' para designar o último grupo). Para avançar ou retroceder nos grupos, adicione os sinais ''&plus;'' ou ''&minus;'' ao início do argumento, o número informado definirá o intervalo a avançar;

		- FIXME Para ordernar colunas de tabelas, organizados da forma como ocorre em ``tbody``, informe números inteiros diferentes de zero entre colchetes e separados por vírgula (''[1,-2,+3]''). Os números correspondem às colunas da tabela (a partir de 1), o sinal indica a ordenação (positivo para crescente e negativo para decrescente) e a ordem informada define a prioridade da ordenação.**/
		display: {
			value: function(action) {
				action   = String(action).toLowerCase().replace(/\s+/g, "");
				let self = this;
				this.forEach(function(v,i) {
					let node = __Node(v);
					if ((/^[+-]?\d+$/).test(action)) {
						node.walk(Number(action));
					} else if ((/^(\+?\d+|\*)\-(\+?\d+|\*)$/).test(action)) {
						let value = action.split("-");
						value.forEach(function(v,i,a) {a[i] = v.replace(/\*/g, "-1");});
						node.childs(value[0], value[1]);
					} else if ((/^([+-]?\d+|\*)\:\d+(\.\d+)?$/).test(action)) {
						let value = action.split(":");
						let sign  = action[0];
						let walk  = sign === "+" || sign === "-" ? Number(value[0]) : null;
						let index = sign === "*" ? -1 : Number(value[0]);
						let width = Number(value[1]);
						if (walk === null) {
							node.pages(index, width);
						} else if (walk !== 0) {
							node.pages((Infinity * walk), width);
							walk += walk > 0 ? -1 : +1;
							self.order("page", sign+String(Math.abs(walk))+":"+String(width));
						}
					} else if ((/^\[[+-]?\d+((\,[+-]?\d+)+)?\]$/).test(action)) {
						let value = action.replace("[", "").replace("]", "").split(/\,/);
						console.log("[1,-2,3]");
						node.tsort.apply(node, value);
					} else {
						switch(action) {
							case "show":   {node.show = true;                   break;}
							case "hide":   {node.show = false;                  break;}
							case "toggle": {node.show = !node.show;             break;}
							case "ahead":  {node.only();                        break;}
							case "behind": {node.only(true);                    break;}
							case "full":   {node.full();                        break;}
							case "all":    {node.only(true); node.show = true;  break;}
							case "none":   {node.only();     node.show = false; break;}
							case "asc":    {node.sort(true);                    break;}
							case "desc":   {node.sort(false);                   break;}
							case "sort":   {node.sort();                        break;}
						}
					}
				});
				return this;
			}
		},
		/**. ``''self'' filter(''any'' search, ''integer'' width)``: Exibe somente os elementos filhos que contenham o conteúdo de ``search`` (ver __Node.filter)**/
		filter: {
			value: function(search, width) {
				this.forEach(function(v,i) {
					let node = __Node(v);
					node.filter(search, width);
				});
				return this
			}
		},
		/**. ``''self'' jump(''node'' jumper)``: Alterna a posição dos elementos informados em ``jumper`` entre os elementos da seleção (ver __Node.jump)**/
		jump: {
			value: function(jumper) {
				let check = __Type(jumper);
				if (check.node) {
					let nodes = this._input;
					console.log(nodes, check.value);
					check.value.forEach(function(v,i,a) {
						let node = __Node(v);
						node.jump(nodes);
					});
				}
				return this;
			}
		},
	});
/*----------------------------------------------------------------------------*/
	/**### Função Mestre
	###### ``''object'' WD(''any'' input)``
	Função principal, única de acesso ao usuário, com o objetivo de chamar os construtores correspondentes ao valor informado no argumento ``input``.**/
	function WD(input) {
		let data = __Type(input);
		switch(data.type) {
			case "number":   return new WDnumber(input, data);
			case "array":    return new WDarray(input, data);
			case "date":     return new WDdatetime(input, data);
			case "time":     return new WDdatetime(input, data);
			case "datetime": return new WDdatetime(input, data);
			case "node":     return new WDnode(input, data);
			case "string":   return new WDstring(input, data);
		}
		return new WDmain(input, data);
	}

	WD.constructor = WD;
	Object.defineProperties(WD, {
		version: {value: __VERSION},
		$:       {value: function(css, root) {return WD(__Query(css, root).$);}},
		$$:      {value: function(css, root) {return WD(__Query(css, root).$$);}},
		copy:    {value: function(text) {return wd_copy(text);}},
		device:  {get:   function() {return __DEVICECONTROLLER.device;}},
		today:   {get:   function() {return WD(__DateTime().toDateString());}},
		now:     {get:   function() {return WD(__DateTime().toTimeString());}},
	});

	if (__UNDERMAINTENANCE) {
		console["warn" in console ? "warn" : "log"]("WD JS Library: The maintenance module is on.");
		Object.defineProperties(WD, {
			type:     {value: function(x){return __Type.apply(null, Array.prototype.slice.call(arguments));}},
			array:    {value: function(){return __Array.apply(null, Array.prototype.slice.call(arguments));}},
			datetime: {value: function(){return __DateTime.apply(null, Array.prototype.slice.call(arguments));}},
			fnode:    {value: function(){return __FNode.apply(null, Array.prototype.slice.call(arguments));}},
			node:     {value: function(){return __Node.apply(null, Array.prototype.slice.call(arguments));}},
			number:   {value: function(){return __Number.apply(null, Array.prototype.slice.call(arguments));}},
			string:   {value: function(){return __String.apply(null, Array.prototype.slice.call(arguments));}},
			data2D:   {value: function(){return __Data2D.apply(null, Array.prototype.slice.call(arguments));}},
			plot:     {value: function(){return __Plot2D.apply(null, Array.prototype.slice.call(arguments));}},
			request:  {value: function(){return __Request.apply(null, Array.prototype.slice.call(arguments));}},
			query:    {value: function(){return __Query.apply(null, Array.prototype.slice.call(arguments));}},
			svg:      {value: function(){return __SVG.apply(null, Array.prototype.slice.call(arguments));}},
			table:    {value: function(){return __Table.apply(null, Array.prototype.slice.call(arguments));}},
			url:      {value: function(){return __URL.apply(null, Array.prototype.slice.call(arguments));}},
			LANG:     {value: __LANG},
			TYPE:     {value: __TYPE},
			MODAL:    {value: __MODALCONTROL},
			DEVICE:   {value: __DEVICECONTROLLER},
			SIGNAL:   {value: __SIGNALCONTROL},
		});
	}

/*============================================================================*/
/**#### Atributos dataset
	###### ``**function** ''void'' data_wdLoad(''node''  e, ''string'' event)``
	Função vinculada ao atributo HTML ``data-wd-load`` cujo objetivo é carregar arquivo HTML utilizando as ferramentas ``WDnode.load`` e ``WD.send``. Possui múltiplos atributos e grupo único:
	|Nome|Descrição|Obrigatório|
	|path|Caminho para o arquivo HTML externo a ser carregado|Sim|
	|replace|''true'' ou ''false'', ver WDnode.load|Não|
	|run|''true'' ou ''false'', ver WDnode.load|Não|
	|method|Tipo de requisição HTTP, ver WD.send|Não|
	|$ ou $$|Seletor(es) CSS do formulário com os parâmetros da requição|Não|**/
	function data_wdLoad(e, event) {
		if (!("wdLoad" in e.dataset)) return;
		let data   = __String(e.dataset.wdLoad).wdNotation[0];
		let query  = __Query.$$$(data);
		let target = WD(e);
		target.set({dataset: {wdLoad: null}}).load("");
		WD(query).send(data.path, {
			method: data.method,
			ondone: function(x) {target.load(x.text, data.replace, data.run);}
		});
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdRepeat(''node''  e, ''string'' event)``
	Função vinculada ao atributo HTML ``data-wd-repeat`` cujo objetivo é clonar elementos filhos a partir de parâmentros contidos em um arquivo JSON ou CSV utilizando as ferramentas ``WDnode.repeat`` e ``WD.send``. Possui múltiplos atributos e grupo único:
	|Nome|Descrição|Obrigatório|
	|path|Caminho para o arquivo JSON ou CSV a ser carregado|Sim|
	|method|Tipo de requisição HTTP, ver WD.send|Não|
	|$ ou $$|Seletor(es) CSS do formulário com os parâmetros da requição|Não|**/
	function data_wdRepeat(e, event) {
		if (!("wdRepeat" in e.dataset)) return;
		let data   = __String(e.dataset.wdRepeat).wdNotation[0];
		let query  = __Query.$$$(data);
		let target = WD(e);
		target.set({dataset: {wdRepeat: null}}).repeat([]);
		WD(query).send(data.path, {
			method: data.method,
			ondone: function(x) {
				let json  = x.json;
				if (__Type(json).array) {
					return target.repeat(json);
				}
				let csv = x.csv;
				if (__Type(csv).array) {
					let table = __Table();
					table.matrix(csv);
					return target.repeat(table.json);
				}
			}
		});
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdSet(''node''  e, ''string'' event)``
	Função vinculada ao atributo HTML ``data-wd-set`` cujo objetivo é aplicar atributos aos elementos partir de parâmentros contidos em um arquivo JSON ou utilizando a ferramenta ``WDnode.set``. Possui múltiplos atributos e grupos. Se o atributo ``path`` for informado, os valores dos atributos serão executados a partir do arquivo JSON especificado, caso contrário, serão considerados aqueles informados no atributo HTML:
	|Nome|Descrição|Obrigatório|
	|path|Caminho para o arquivo JSON a ser carregado|Não|
	|method|Tipo de requisição HTTP, ver WD.send|Não|
	|$ ou $$|Seletore CSS para identificar os alvos da ferramenta|Não|**/
	function data_wdSet(e, event) {
		if (!("wdSet" in e.dataset)) return;
		let data = __String(e.dataset.wdSet).wdNotation;
		let exec = function(input) {
			let query  = ("$" in input || "$$" in input) ? __Query.$$$(input) : e;
			let target = WD(query);
			return target.set(input);
		}
		data.forEach(function(v,i,a) {
			if ("path" in v) {
				WD().send(v.path, {
					method: v.method,
					ondone: function(x) {
						let json = x.json;
						if (__Type(json).array)
							json.forEach(function(s,j,b) {exec(s);});
					}
				});
			} else {
				for (let i in v)
					if ((/^.+\{.+\}$/).test(v[i]))
						v[i] = __String(v[i]).wdNotation[0];
				exec(v);
			}
		});
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdChart(''node''  e, ''string'' event)``
	Função vinculada ao atributo HTML ``data-wd-chart`` cujo objetivo é criar um gráfico 2D a partir de uma tabela, um arquivo CSV ou parâmetros de dados como filho do elemento possuidor do atributo. Possui múltiplos atributos e grupo único. Para definir funções nos parâmetros, deverá ser informado seu nome e a função deve estar dentro do escopo principal (window) utilizando as palavras chaves ``var`` ou ``function``:
	|Nome|Descrição|Obrigatório|
	|path|Caminho para o arquivo CSV a ser carregado|Não|
	|table|Seletor CSS que indica a tabela de dados (será ignorado se path for informado)|Não|
	|$ ou $$|Seletor(es) CSS do formulário com os parâmetros da requição|Não|
	|method|Tipo de requisição HTTP, ver WD.send (se path for informado)|Não|**/
	function data_wdChart(e, event) {
		if (!("wdChart" in e.dataset)) return;
		let data   = __String(e.dataset.wdChart).wdNotation[0];
		let query  = __Query.$$$(data);
		let target = WD(e);
		target.set({dataset: {wdChart: null}});
		/* acertando nomes de funções para funções */
		let attrs = ["table", "data"];
		let i = -1;
		while (++i < attrs.length) {
			let attr = attrs[i];
			if (attr in data) {
				let j = -1;
				while (++j < data[attr].length) {
					data[attr][j] = __String(data[attr][j]).wdNotation[0];
					if (attr === "data" && data[attr][j].y in window) {
						if (__Type(window[data[attr][j].y]).function)
							data[attr][j].y = window[data[attr][j].y];
					}
				}
			}
		}
		/* plotando gráfico */
		if ("path" in data) {
			let path = data.path;
			delete data.path;
			WD(query).send(path, {
				method: data.method,
				ondone: function(x) {
					let csv   = x.csv;
					if (__type(csv).array)
						return e.appendChild(WD(csv).chart(data));
					let json  = x.json;
					if (__type(json).array)
						return e.appendChild(WD(table).chart(data));
					return e.appendChild(WD().chart(data));
				}
			});
			return;
		}
		e.appendChild(WD(query).chart(data));
		return;
	}

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdSend(''node''  e, ''string'' event)``
	Função vinculada ao atributo HTML ``data-wd-send`` cujo objetivo é efetuar requisições web utilizando a ferramenta ``WDnode.repeat``. Possui múltiplos atributos e grupos. Os atributos possuem os mesmo valores do argumento ``options`` de WD.send acrescidos dos abaixo relacionados. Para definir funções nos parâmetros, deverá ser informado seu nome e a função deve estar dentro do escopo principal (window) utilizando as palavras chaves ``var`` ou ``function``:
	|Nome|Descrição|Obrigatório|
	|path|Caminho para o arquivo a enviar a requisição|Sim|
	|$ ou $$|Seletor(es) CSS do formulário com os parâmetros da requição|Não|**/
	function data_wdSend(e, event) {
		if (!("wdSend" in e.dataset)) return;
		let data = __String(e.dataset.wdSend).wdNotation;
		data.forEach(function (v,i,a) {
			if ("header"   in v) v.header   = __String(v.header).wdNotation[0];
			if ("ondone"   in v) v.ondone   = window[v.ondone];
			if ("onchange" in v) v.onchange = window[v.onchange];
			console.log(v);
			let query  = __Query.$$$(v);
			let target = WD(query);
			target.send(v.path, v);
		});
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdDisplay(''node''  e, ''string'' event)``
	Função vinculada ao atributo HTML ``data-wd-display`` cujo objetivo é manipular a exibição de nós, seus irmãos e filhos utilizando a ferramenta ``WDnode.display``. Possui múltiplos atributos e grupos:
	|Nome|Descrição|Obrigatório|
	|action|Ação a ser executada|Sim|
	|$ ou $$|Seletor CSS para indicar o elemento os elementos a aplicar a ação (se ausente, será o próprio elemento)|Não|**/
	function data_wdDisplay(e, event) {
		if (!("wdDisplay" in e.dataset)) return;
		let data = __String(e.dataset.wdDisplay).wdNotation;
		let self = WD(e);
		data.forEach(function (v,i,a) {
			let query  = __Query.$$$(v);
			let target = WD(query);
			if (target.valueOf().length === 0)
				self.display(v.action);
			else
				target.display(v.action);
		});
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdClick(''node''  e, ''string'' event)``
	Função vinculada ao atributo HTML ``data-wd-click`` cujo objetivo é efetuar um autoclique ao elemento. Possui valor simples e opcional. Caso um número inteiro maior que zero seja informado, o clique irá ser executado a cada milisegundos conforme valor definido.**/
	function data_wdClick(e, event) {
		if (!("wdClick" in e.dataset)) return;
		let data = __String(e.dataset.wdClick).wdNotation;
		let info = __Type(data);
		let time = info.finite ? Math.trunc(info.value) : null;
		if ("click" in e) e.click();
		if (time > 0)
			window.setTimeout(function() {data_wdClick(e);}, time);
		else
			WD(e).set({dataset: {wdClick: null}});
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdFilter(''node''  e, ''string'' event)``
	Função vinculada ao atributo HTML ``data-wd-filter`` cujo objetivo é filtrar os nós filhos que contenham o conteúdo informado utilizando a ferramenta ``WDnode.filter``. Possui múltiplos atributos e grupos:
	|Nome|Descrição|Obrigatório|
	|chars|Determina a quantidade mínima de caracteres para executar a busca|Não|
	|$ ou $$|Seletor CSS dos elementos cujos filhos serão filtrados|Não|**/
	function data_wdFilter(e, event) { /* Filtrar elementos: data-wd-filter=chars{}${css}&... */
		if (!("wdFilter" in e.dataset)) return;
		let node = __Node(e);
		let data = __String(e.dataset.wdFilter).wdNotation;
		data.forEach(function (v,i,a) {
			let query  = __Query.$$$(v);
			let target = WD(query);
			let chars  = v.chars;
			let search = node.attribute("textContent");
			let regexp = /^\/(.+)\/([gim]+?)$/;
			if (regexp.test(search))
				search = new RegExp(search.replace(regexp, "$1"), search.replace(regexp, "$2"));
			target.filter(search, chars);
		});
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdTsort(''node''  e, ''string'' event)``
	Função vinculada ao atributo HTML ``data-wd-tsort`` cujo objetivo é ordenar colunas específicas de tabelas. Não possui atributo:**/
	function data_wdTsort(e, event) { /* Ordena tabelas: data-wd-tsort="" */
		if (!("wdTsort" in e.dataset)) return;
		try {
			let data  = __String(e.dataset.wdTsort).wdNotation;
			let thead = e.parentElement.parentElement;
			let tbody = thead.parentElement.tBodies;
			let heads = __Type(e.parentElement.children).value;
			let index = heads.indexOf(e);
			let sort  = data === 1 ? -1 : 1;
			if (thead.tagName.toLowerCase() !== "thead") return;
			WD(tbody).display("["+(sort * (index + 1))+"]");
			heads.forEach(function(v,i,a) {
				if ("wdTsort" in v.dataset)
					v.dataset.wdTsort = v === e ? (sort > 0 ? "+1" : "-1") : "";
			});
		} catch(e) {}
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdDevice(''node''  e, ''string'' event)``
	Função vinculada ao atributo HTML ``data-wd-device`` cujo objetivo é manipular o atributo ``class`` conforme mudança no tamanho da tela. Possui múltiplos atributos e grupo único:
	|Nome|Descrição|Obrigatório|
	|desktop|Estilos CSS separados por espaço a serem utilizados quando a tela corresponder a um desktop.|Não|
	|tablet|Estilos CSS separados por espaço a serem utilizados quando a tela corresponder a um tablet.|Não|
	|phone|Estilos CSS separados por espaço a serem utilizados quando a tela corresponder a um phone.|Não|
	|mobile|Estilos CSS separados por espaço a serem utilizados quando a tela corresponder a um tablet ou phone.|Não|**/
	function data_wdDevice(e, event) {
		if (!("wdDevice" in e.dataset)) return;
		let query  = WD(e);
		let data   = __String(e.dataset.wdDevice).wdNotation[0];
		let device = __DEVICECONTROLLER.device;
		let types  = {
			desktop: {phone: 0, tablet: 0, mobile: 0, desktop: 1},
			tablet:  {phone: 0, tablet: 1, mobile: 1, desktop: 0},
			phone:   {phone: 1, tablet: 0, mobile: 1, desktop: 0},
		};
		if (device in types) {
			let type = types[device];
			/* removendo css dos dispositivos incompatíveis */

			for (let i in type)
				if (i in data && type[i] === 0) query.set({class: {remove: data[i]}});
			/* adicionando css dos dispositivos compatíveis */
			for (let i in type)
				if (i in data && type[i] === 1) query.set({class: {add: data[i]}});
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdJump(''node''  e, ''string'' event)``
	Função vinculada ao atributo HTML ``data-wd-jump`` cujo objetivo é fazer saltos do nó entre os nós informados. Possui atributo simples e grupo único:
	|Nome|Descrição|Obrigatório|
	|$ ou $$|Seletor CSS dos elementos que receberão o nó|Sim|**/
	function data_wdJump(e, event) { /* Saltos de pai: data-wd-jump=$${parents}*/
		if (!("wdJump" in e.dataset)) return;
		let data   = __String(e.dataset.wdJump).wdNotation[0];
		let query  = __Query.$$$(data);
		let target = WD(query);
		target.jump(e);
		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdEdit(e, event) { /* edita texto: data-wd-edit=comando{especificação}... */
		if (!("execCommand" in document) || !("wdEdit" in e.dataset)) return;
		let data = __String(e.dataset.wdEdit).wdNotation[0];
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
	/**###### ``**function** ''void'' data_wdMask(''node''  e, ''string'' event)``
	Função vinculada ao atributo HTML ``data-wd-mask`` cujo objetivo é definir uma máscara para o campo e checar seu valor utilizando as ferramentas ``WDmain.mask``. Possui múltiplos atributos e grupo único. Para definir a função no parâmetro, deverá ser informado seu nome, devendo estar dentro do escopo principal (window) utilizando as palavras chaves ``var`` ou ``function``:
	|Nome|Descrição|Obrigatório|
	|model|Modelo da máscara|Não|
	|alert|Mensagem a ser exibida se a máscara não casar (funciona somente em campos de formulário)|Não|
	|check|Nome da função que checará e retornará o valor da máscara (em caso de falha, retornar string vazia)|Não|**/
	function data_wdMask(e, event) { /* Máscara: data-wd-mask="model{mask}call{callback}msg{msg}" */
		if (!("wdMask" in e.dataset)) return;
		let data = __String(e.dataset.wdMask).wdNotation[0];
		let node = __Node(e);
		let text = node.attribute("textContent");
		let mask = "";
		node.validity = "";
		if (text.trim() === "")   return;
		if (!__Type(data).object) return;
		if ("model" in data)
			mask = WD(text).mask(data.model, window[data.check]);
		else if (__Type(window[data.check]).function)
			mask = window[data.check](text);
		else
			return;
		if (mask.trim() === "")
			node.validity = "alert" in data ? data.alert : data.model;
		else
			node.attribute("textContent", mask);
		return;
	};











/*----------------------------------------------------------------------------*/
	function data_wdShared(e, event) { /* Experimental: compartilhar em redes sociais: data-wd-shared=rede */
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
	function data_wdOutput(e, load) { /* Atribui valor ao target: data-wd-output=${target}call{} */
		let output = __Query("[data-wd-output]").$$;
		if (output === null) return;
		/* looping pelos elementos com data-wd-output no documento */
		for (let i = 0; i < output.length; i++) {
			let elem   = output[i];
			let data   = wd_html_dataset_value(elem, "wdOutput")[0];
			let target = __Query.$$$(data);
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
	/**###### ``**function** ''void'' navLink(''node''  e, ''string'' event)``
	Função vinculada a atributo HTML cujo objetivo é estabelecer o menu ativo do container ``nav``.**/
	function navLink(e, event) {
		if (e.parentElement === null) return;
		if (e.parentElement.tagName.toLowerCase() !== "nav") return;
		WD(e.parentElement.children).set({class: {add: "js-wd-nav-inactive"}});
		WD(e).set({class: {remove: "js-wd-nav-inactive"}});
		return;
	};

/*============================================================================*/
/* -- DISPARADORES -- */
/*============================================================================*/
	function loadProcedures(ev) {
		/* vinculando disparador de mudança de dispositivo */
		__DEVICECONTROLLER.onchange = function(x) {
			WD.$$("[data-wd-device]").forEach(data_wdDevice);
		}

		/* construindo CSS da biblioteca */
		let style = document.createElement("STYLE");
		style.textContent = __JSCSS.join("");
		document.head.appendChild(style);

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
		let head = measures(__Query("body > header").$);
		if (head.position === "fixed")
			document.body.style.marginTop = (head.top+head.height+head.marginBottom)+"px";
		/* margem inferior extra para footers */
		let foot = measures(__Query("body > footer").$);
		if (foot.position === "fixed")
			document.body.style.marginBottom = (foot.bottom+foot.height+foot.marginTop)+"px";
		/* mudar posicionamento em relação ao topo */
		let body = measures(document.body);
		let hash = measures(__Query(window.location.hash).$);
		if (hash.ok && head.position === "fixed")
			window.scrollTo(0, hash.elem.offsetTop - body.marginTop);

		return;
	};

/*----------------------------------------------------------------------------*/
	function loadingProcedures() { /* procedimento para carregamentos */

		/* 1) processar repetições */
		WD.$$("[data-wd-repeat]").forEach(data_wdRepeat);
		if (__COUNTERCONTROL.repeat > 0) return;

		/* 2) processar carregamentos */
		WD.$$("[data-wd-load]").forEach(data_wdLoad);
		if (__COUNTERCONTROL.load > 0) return;

		/* 3) se repetições e carregamentos terminarem, organizar */
		organizationProcedures();

		return;
	};

/*----------------------------------------------------------------------------*/
	function scalingProcedures(ev) { /* procedimentos para definir dispositivo e aplicar estilos */
		hashProcedures();//FIXME para que serve isso na ordem do script?
		return;
	};

/*----------------------------------------------------------------------------*/
	function organizationProcedures() { /* procedimento PÓS carregamentos */
		WD.$$("[data-wd-filter]").forEach(data_wdFilter);
		WD.$$("[data-wd-mask]").forEach(data_wdMask);
		WD.$$("[data-wd-click]").forEach(data_wdClick);
		WD.$$("[data-wd-device]").forEach(data_wdDevice);
		WD.$$("[data-wd-chart]").forEach(data_wdChart);
		WD.$$("[data-wd-url]").forEach(data_wdUrl);
		data_wdOutput(document, true);
		return;
	};

/*----------------------------------------------------------------------------*/
	function settingProcedures(e, attr) { /* procedimentos para dataset */
		switch(attr) {
			case "wdLoad":      loadingProcedures();    break;
			case "wdRepeat":    loadingProcedures();    break;
			case "wdFilter":    data_wdFilter(e);       break;
			case "wdMask":      data_wdMask(e);         break;
			case "wdClick":     data_wdClick(e);        break;
			case "wdDevice":    data_wdDevice(e);       break;
			case "wdChart":     data_wdChart(e);        break;
			case "wdOutput":    data_wdOutput(e, true); break;
			case "wdUrl":       data_wdUrl(e, true);    break;
		};
		return;
	};

/*----------------------------------------------------------------------------*/
	function clickProcedures(ev) { /* procedimentos para cliques */
		if (ev.which !== 1) return;
		let elem = ev.target
		while (elem !== null) {
			data_wdSend(elem, "click");
			data_wdTsort(elem, "click");
			data_wdEdit(elem, "click");
			data_wdShared(elem, "click");
			data_wdSet(elem, "click");
			data_wdJump(elem, "click");
			data_wdDisplay(elem, "click");
			navLink(elem, "click");
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
		| A) após cada digitação/alteração, definir WDdatetimeKey com o tempo atual
		| B) chamar novamente a função após um intervalo de tempo
		\-------------------------------------------------------------------------*/
		let now = (new Date()).valueOf();
		if (relay !== true) {
			ev.target.dataset.WDdatetimeKey = now; /*A*/
			window.setTimeout(function() { /*B*/
				inputProcedures(ev, true);
			}, __KEYTIMERANGE);
			return;
		}
		/*--------------------------------------------------------------------------
		| C) se WDdatetimeKey está difinido, checar o intervalo desde a última alteração
		| D) se agora for >= tempo definido+intervalo:
		| E) apagar atributo e
		| F) executar
		\-------------------------------------------------------------------------*/
		if ("WDdatetimeKey" in ev.target.dataset) { /*C*/
			let time = new Number(ev.target.dataset.WDdatetimeKey).valueOf();
			if (now >= (time+__KEYTIMERANGE)) { /*D*/
				delete ev.target.dataset.WDdatetimeKey; /*E*/
				/*F*/
				data_wdFilter(ev.target);
				data_wdOutput(ev.target);
			}
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	function focusoutProcedures(ev) { /* procedimentos para saída de formulários */
		data_wdMask(ev.target);
		//let test = new WDform(ev.target);
		//test.checkValidity();
		return;
	};

/*----------------------------------------------------------------------------*/
	function changeProcedures(ev) { /* procedimentos para outras mudanças em formulários (type=file) */
		return;
	};

/*----------------------------------------------------------------------------*/
	WD(window).set({ /* Definindo eventos window */
		addEventListener: {
			load: loadProcedures,
			resize: scalingProcedures,
			hashchange: hashProcedures,
		}
	});

	WD(document).set({ /* Definindo eventos document */
		addEventListener: {
			click:    clickProcedures,
			input:    inputProcedures,
			focusout: focusoutProcedures,
		}
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
		- data-wd-load
			> loadingProcedures()
		- data-wd-mask
		- data-wd-output
		- data-wd-page
		- data-wd-repeat
			> loadingProcedures()
		- data-wd-slide
		- data-wd-tsort
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
			- data-wd-tsort
			- data-wd-url

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
