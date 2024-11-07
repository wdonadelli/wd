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
	Se verdadeiro, libera métodos para teste em WD e imprime cascata de eventos.**/
	const __UNDERMAINTENANCE = true;

/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''array'' __STYLE``
	Estilos da biblioteca.**/
	const __STYLE = [
		/*-- animações --*/
		{target: "@keyframes js-wd-emerge", style: ["from {opacity: 0;} to {opacity: 1;}"]},
		{target: "@keyframes js-wd-fade",   style: ["from {opacity: 1;} to {opacity: 0;}"]},
		{target: "@keyframes js-wd-expand", style: ["from {transform: scale(0);} to {transform: scale(1);}"]},
		{target: "@keyframes js-wd-shrink", style: ["from {transform: scale(1);} to {transform: scale(0);}"]},
		/*-- estilos genéricos --*/
		{target: ".js-wd-no-display",      style: ["display: none;"]},
		{target: ".js-wd-overflow-hidden", style: ["overflow: hidden;"]},
		{target: "nav > *.js-wd-nav-inactive", style: ["opacity: 0.5;"]},
		/*-- data-wd- --*/
		{target: "[data-wd-nav], [data-wd-send], [data-wd-set], [data-wd-edit], [data-wd-shared]", style: ["cursor: pointer;"]},
		/*-- data-wd-move --*/
		{target: "[data-wd-move*=\"type{jump}\"]",        style: ["cursor: pointer;"]},
		{target: "[data-wd-move*=\"type{drag}\"]",        style: ["cursor: grab;"]},
		{target: "[data-wd-move*=\"type{drag}\"]:active", style: ["cursor: grabbing;"]},
		{target: "[data-wd-move*=\"type{move}\"]",        style: ["cursor: move;"]},
		/*-- data-wd-move: drop --*/
		{target: "[data-wd-move-action=\"drop\"]", style: [
			"border-image-source: linear-gradient(45deg, white, blue);",
			"border-image-width: 10px; border-image-outset: 5px;",
			"border-image-slice: 1% fill;",
		]},
		/*-- data-wd-move: file --*/
		{target: "[data-wd-move-action=\"files\"]", style: [
			"border-image-source: linear-gradient(45deg, white, gray);",
			"border-image-width: 10px; border-image-outset: 5px;"
		]},
		{target: "[data-wd-move-action=\"files\" > *]", style: ["visibility: hidden;"]},
		/*-- data-wd-move: move --*/
		{target: "[data-wd-move-action=\"move\"], [data-wd-move-action=\"move\"] > *", style: ["cursor: grabbing;"]},
		/*-- data-wd-move: resize --*/
		{target: ".js-wd-cursor-n-resize  *",  style: ["cursor: n-resize;"]},
		{target: ".js-wd-cursor-ne-resize  *", style: ["cursor: ne-resize;"]},
		{target: ".js-wd-cursor-se-resize  *", style: ["cursor: sw-resize;"]},
		{target: ".js-wd-cursor-s-resize  *",  style: ["cursor: s-resize;"]},
		{target: ".js-wd-cursor-sw-resize  *", style: ["cursor: sw-resize;"]},
		{target: ".js-wd-cursor-w-resize  *",  style: ["cursor: w-resize;"]},
		{target: ".js-wd-cursor-nw-resize  *", style: ["cursor: nw-resize;"]},
		{target: ".js-wd-cursor-n-resize  *",  style: ["cursor: n-resize;"]},
		{target: ".js-wd-hline",  style: [
			"position: fixed; left: 0; width: 100vw;",
			"border-top: thin solid #000000; z-index: 999999;"
		]},
		{target: ".js-wd-vline",  style: [
			"position: fixed; top: 0; height: 100vh;",
			"border-left: thin solid #000000; height: 100%; z-index: 999999;"
		]},
		/*-- data-wd-menu --*/
		{target: "[data-wd-menu]", style: ["cursor: context-menu;"]},
		{target: ".js-wd-menu", style: [
			"font-size: 14px; font-family: Verdana,sans-serif;",
			"position: fixed; max-width: 40vw; max-height: 40vh;",
			"display: block; margin: 0; padding: 0.3em;",
			"z-index: 999999; overflow: auto !important;",
			"color: #ffffff; background-color: rgba(0,0,0);",
			"border: 2px inset #101010; border-radius: 0.3em;",
			"animation: js-wd-emerge 0.5s linear 0s"
		]},
		{target: ".js-wd-menu > *", style: [
			"display: block; margin: inherit; padding: inherit; cursor: pointer; border-radius: inherit;"
		]},
		{target: ".js-wd-menu > *:hover", style: ["background-color: rgba(50,50,50);"]},
		/*-- data-wd-tsort --*/
		{target: "[data-wd-tsort]", style: ["cursor: pointer;"]},
		{target: "[data-wd-tsort]:before", style: ["content: \"\\2195 \"; font-weight: normal;"]},
		{target: "[data-wd-tsort=\"-1\"]:before", style: ["content: \"\\2191 \";"]},
		{target: "[data-wd-tsort=\"+1\"]:before", style: ["content: \"\\2193 \";"]},
		/*-- data-wd-repeat/load --*/
		{target: "[data-wd-repeat] > *, [data-wd-load] > *", style: ["visibility: hidden;"]},
		/*-- data-wd-slide --*/
		{target: "[data-wd-slide] > *", style: ["animation: js-wd-emerge 1s, js-wd-shrink-out 0.5s;"]},
		/*-- SVG --*/
		{target: "svg .js-wd-chart-hide", style: ["display: none;"]},
		{target: "@media screen and (min-width: 768px) {svg .js-wd-chart-hide", style: ["display: inline;}"]},
		/*-- tags especiais --*/
		{target: "wdtag-mark", style: [
			"background-color: rgba(154,205,50,0.7); display: inline; border-radius: 0.2em; color: #000000;"
		]},
		{target: "wdtag-root", style: [
			"display: block; padding: 0.3em 0.3em 0.3em 3em; overflow: auto;",
			"border-radius: 0.5em; 	border: 1px solid #000000;",
			"font-family: monospace; font-size: 14px; white-space: pre-wrap;",
			"text-decoration: none; text-indent: 0;",
			"font-style: normal; font-weight: normal;",
			"background-color: #262626;",
			"counter-reset: wdcodelines;"
		]},
		{target: "wdtag-root *", style: [
			"display: inline; position: static; padding: 0;",
			"font-weight: normal; font-style: normal; border: none; border-raius: none;"
		]},
		{target: "wdtag-root wdtag-line", style: ["counter-increment: wdcodelines;"]},
		{target: "wdtag-root wdtag-line:before", style: [
			"content: counter(wdcodelines);",
			"display: inline-block; position: relative;",
			"margin: 0 0 0 -3em; padding-right: 0.5em; min-width: 3em;",
			"color: #bcc118; text-align: right;"
		]},
		{target: "wdtag-root wdtag-content", style: ["color: #b3b3b3;"]},
		{target: "wdtag-root wdtag-comment", style: ["color: #8c8c8c; font-style: italic;"]},
		{target: "wdtag-root wdtag-doc", style: ["color: #df6d6d; font-weight: bold;"]},
		{target: "wdtag-root wdtag-tag", style: ["color: #418bff;"]},
		{target: "wdtag-root wdtag-attribute", style: ["color: #57ac57;"]},
		{target: "wdtag-root wdtag-value", style: ["color: #cf8ee1;"]},
		{target: "wdtag-root wdtag-word", style: ["color: #df6d6d; font-weight: bold;"]},
		{target: "wdtag-root wdtag-tick", style: ["font-weight: bold; color: #68cccc;"]},
		{target: "wdtag-root wdtag-string", style: ["color: #57ac57"]},
		/*-- container da caixa de mensagens --*/
		{target: ".js-wd-signal-box", style: [
			"position: fixed; top: 0; right: 0; left: 0; bottom: initial;",
			"display: block; margin: auto; padding: 1px; width: auto; max-height: 75vh;",
			" overflow: auto; z-index: 999999; font-size: 14px; background-color: transparent;"
		]},
		{target: "@media screen and (min-width: 768px) {.js-wd-signal-box", style: [
			"bottom: 0; right: 0; left: 75vw; top: initial;}"
		]},
		/*-- modal da caixa de diálogo --*/
		{target: ".js-wd-signal-modal", style: [
			"position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 0.1s js-wd-emerge;",
			"margin: 0; padding: 0; background-color: rgba(0,0,50,0.3); z-index: 999999; cursor: forbidden;"
		]},
		/*-- caixas de mensagem e diálogo --*/
		{target: ".js-wd-signal-message, .js-wd-signal-dialog", style: [
			"display: block; padding: 0;",
			"color: #d4d4e6; background-color: #353535;",
			"border: thin solid #000000; border-radius: 0.5em;",
			"box-shadow: inset 0 0 2px 1px rgba(0,0,0,0.6);"
		]},
		/*-- caixa de mensagem --*/
		{target: ".js-wd-signal-message", style: [
			"position: relative; margin: 0.5em 0; ",
			"animation: js-wd-expand 0.5s ease 0s, js-wd-shrink 0.5s ease 8.5s;"
		]},
		/*-- caixa de diálogo --*/
		{target: ".js-wd-signal-dialog", style: [
			"position: absolute; top: 5vh; max-height: 90vh; left: 5vw; width: 90vw; margin: 0;",
			"animation: js-wd-expand 0.5s ease 0s;"
		]},
		{target: "@media screen and (min-width: 768px) {.js-wd-signal-dialog", style: [
			"top: 20vh; max-height: 60vh; left: 30vw; max-width: 40vw;}"
		]},
		/*-- botão para fechar caixa de mensagens --*/
		{target: ".js-wd-signal-close", style: [
			"position: absolute; top: 0.2em; right: 0.2em; display: inline-block;",
			"line-height: 1; cursor: pointer; margin: 0; z-index: 5; font-size: large;"
		]},
		{target: ".js-wd-signal-close:before", style: ["content: \"\\00D7\";"]},
		/*-- cabeçalho das caixas de mensagem e diálogo --*/
		{target: ".js-wd-signal-head", style: [
			"display: block; padding: 0.25em 0.5em; margin: 0;",
			"border-radius: 0.5em 0.5em 0 0;",
			"font-size: larger; font-weight: bold; background-color: #000000;"
		]},
		/*-- corpo das caixas de mensagem e diálogo --*/
		{target: ".js-wd-signal-body", style: [
			"display: block; padding: 1em 1em 1em 2em; margin: 0; white-space: pre-wrap;"
		]},
		{target: ".js-wd-signal-message .js-wd-signal-body", style: ["border-radius: 0 0 0.5em 0.5em;"]},
		/*-- rodapé da caixa de diálogo --*/
		{target: ".js-wd-signal-foot", style: [
			"display: flex; flex-flow: column nowrap;",
			"background-color: #000000; border-radius: 0 0 0.5em 0.5em; font-size: smaller;"
		]},
		{target: "@media screen and (min-width: 768px) {.js-wd-signal-foot", style: [
			"flex-flow: row wrap; justify-content: space-evenly; align-items: baseline;}"
		]},
		/*-- ações da caixa de diálogo --*/
		{target: ".js-wd-signal-action", style: [
			"padding: 0.25em 0.5em; border-radius: 0.2em;",
			"color: #333333; background-color: #f0f0f0; cursor: pointer;",
			 "font-size: inherit; text-align: center;"
		]},
		{target: "@media screen and (min-width: 768px) {.js-wd-signal-action", style: ["flex-shrink: 0;"]},
		{target: ".js-wd-signal-action:focus", style: ["outline: 2px solid #9999ff;"]},
		{target: ".js-wd-signal-action:hover", style: ["text-decoration: underline;"]},
		//"*::backdrop {background-color: white;}",
		//TODO ver coloração https://developer.mozilla.org/pt-BR/docs/Web/CSS/background-color
		//TODO interessante https://developer.mozilla.org/en-US/docs/Web/CSS/::file-selector-button
		/*-- barra de progresso --*/
		{target: ".js-wd-progress-modal", style: [
			"position: fixed; top: 0; left: 0; display: block;",
			"width: 100vw; height: 100vh; padding: 0; margin: 0; z-index: 999999;",
			"cursor: progress; background-color: rgba(0,0,0,0.3); animation: js-wd-emerge 0.1s;",
		]},
		{target: ".js-wd-progress-bar", style: [
			"position: absolute; top: 0; left: 0;",
			"display: block; height: 5px; padding: 0; margin: 0;",
			"background-color: royalblue; border-radius: 0.2em; border: 1px solid black;"
		]}
	];

/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''object'' __DEVICE``
	Checa alterações da tela atribuida a um tipo de dispositivo.**/
	const __DEVICE = {
		/**. ``''string'' _device``: Registra o tipo do dispositivo a partir do tamanho da tela atual.**/
		_device: null,
		/**. ``''array'' _devices``: Registra uma lista de dispositivos em ordem decrescente de tamanho.**/
		_devices: [
				{name: "desktop", size: 768},
				{name: "tablet",  size: 600},
				{name: "phone",   size: 0}
			],
		/**. ``''integer'' width``: Retorna o tamanho da tela.**/
		get width() {return window.innerWidth;},
		/**. ``''string'' device``: Retorna o tipo de dispositivo**/
		get device() {
			const width  = this.width;
			for (let i = 0; i < this._devices.length; i++)
				if (width >= this._devices[i].size) return this._devices[i].name;
		},
		/**. ``''boolean'' mobile``: Informa se dispositivo não é do tamanho desktop.**/
		get mobile() {return this.device !== "desktop";},
		/**. ``''boolean'' change``: Informa se o dispositivo foi alterado desde a última consulta.**/
		get changeDevice() {
			const device = this.device;
			if (this._device !== device) {
				this._device = device;
				return true;
			}
			return false;
		}
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''integer'' __KEYTIMERANGE``
	Registra o intervalo, em milisegundos, entre eventos de digitação (oninput, onkeyup...).**/
	const __KEYTIMERANGE = 500;

/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''node'' __PROGRESS``
	Registra a barra de progresso das requisições da biblioteca.**/
	const __PROGRESS = {
		/**. ``''node'' bar``: Barra de progresso.**/
		bar: (function() {
			/*-- Plano de fundo e barra de  progresso --*/
			const wall = document.createElement("DIV");
			const bar  = document.createElement("DIV");
			wall.className = "js-wd-progress-modal";
			bar.className  = "js-wd-progress-bar";
			wall.appendChild(bar);
			/*-- Definindo atributos --*/
			bar.dataset.delay = 5; /*-- tempo de espera até fechar o modal --*/
			bar.dataset.value = 0; /*-- valor da barra de progresso --*/
			bar.dataset.count = 0; /*-- quantidade de processos em aberto --*/
			/*-- Disparador de abertura de processo --*/
			bar.addEventListener("wdprogressopen", function(ev) {
				const bar  = ev.target;
				const wall = bar.parentElement;
				if (wall.parentElement !== document.body)
					document.body.appendChild(wall);
				bar.dataset.count = Number(bar.dataset.count) + 1;
			}, false);
			/*-- Disparador de fechamento de processo --*/
			bar.addEventListener("wdprogressclose", function(ev) {
				const bar   = ev.target;
				const count = Number(bar.dataset.count) - 1;
				const delay = Number(bar.dataset.delay);
				bar.dataset.count = count < 0 ? 0 : count;
				window.setTimeout(function () {
					const count = Number(bar.dataset.count);
					const wall  = bar.parentElement;
					if (count <= 0 && wall.parentElement !== null)
						wall.parentElement.removeChild(wall);
				}, delay);
			}, false);
			/*-- Disparador de definição de valor --*/
			bar.addEventListener("wdprogressset", function(ev) {
				const bar   = ev.target;
				const value = Number(bar.dataset.value);
				bar.style.width = String(100*value)+"%";
			}, false);
			/*-- retornando a barra de progresso --*/
			return bar;
		})(),
		/**. ``''object'' openEvent``: Evento de abertura da barra de progresso.**/
		openEvent:  new CustomEvent("wdprogressopen"),
		/**. ``''object'' closeEvent``: Evento de fechamento da barra de progresso.**/
		closeEvent: new CustomEvent("wdprogressclose"),
		/**. ``''object'' setEvent``: Evento de definição da barra de progresso.**/
		setEvent:   new CustomEvent("wdprogressset"),
		/**. ``''void'' open()``: Abre a barra de progresso.**/
		open: function()  {
			this.bar.dispatchEvent(this.openEvent);
			return;
		},
		/**. ``''void'' close()``: Fecha a barra de progresso.**/
		close: function() {
			this.bar.dispatchEvent(this.closeEvent);
			return;
		},
		/**. ``''void'' set(''integer'' value)``: Define o valor da barra de progresso pelo seu argumento.**/
		set: function(value) {
			this.bar.dataset.value = value;
			this.bar.dispatchEvent(this.setEvent);
			return;
		}
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''object'' __SIGNAL``
	Renderiza mensagens e notificações.**/
	const __SIGNAL = {
		/**. ``''node'' box``: Agrupador de mensagens.**/
		box: (function() {
			const node  = document.createElement("ASIDE");
			node.className = "js-wd-signal-box";
			return node;
		})(),
		/**. ``''node'' modal``: Modal de diálogo.**/
		modal: (function() {
			const node  = document.createElement("ASIDE");
			node.className = "js-wd-signal-modal";
			return node;
		})(),
		/**. ``''node'' msg``: Caixa de mensagens (para clonar).**/
		msg: (function() {
			const node = document.createElement("SECTION")
			node.className = "js-wd-signal-message";
			const nodes = {HEADER: "head", ARTICLE: "body", SPAN: "close"};
			for (let i in nodes) {
				let child = document.createElement(i);
				child.className = "js-wd-signal-"+nodes[i];
				node.appendChild(child);
			}
			return node;
		})(),
		/**. ``''node'' ask``: Caixa de diálogo (para clonar).**/
		ask: (function() {
			const node = document.createElement("SECTION");
			node.className = "js-wd-signal-dialog";
			const nodes = {HEADER: "head", ARTICLE: "body", FOOTER: "foot"};
			for (let i in nodes) {
				let child = document.createElement(i);
				child.className = "js-wd-signal-"+nodes[i];
				node.appendChild(child);
			}
			return node;
		})(),
		/**. ``''void'' message(''object'' options)``: Ver método ''signal''.**/
		message: function (options) {
			const node = this.msg.cloneNode(true);
			if ("title" in options)
				node.querySelector(".js-wd-signal-head").innerText = options.title;
			if ("body" in options)
				node.querySelector(".js-wd-signal-body").innerText = options.body;
			/*-- Evento do botão de fechar --*/
			node.querySelector(".js-wd-signal-close").addEventListener("click", function(ev) {
				const msg = ev.target.parentElement;
				const box = msg.parentElement;
				if (box !== null) {
					box.removeChild(msg);
					if (box.childElementCount === 0)
						box.parentElement.removeChild(box);
				}
			}, false);
			/*-- Expirando em --*/
			window.setTimeout(function() {
				node.querySelector(".js-wd-signal-close").click();
			}, 8900);
			/*-- renderizando box e node --*/
			if (this.box.parentElement === null)
				document.body.appendChild(this.box);
			this.box.insertAdjacentElement("afterbegin", node);
			return;
		},
		/**. ``''void'' notify(''object'' options)``: Ver método ''signal''.**/
		notify: function (options) {
			const title  = "title" in options ? options.title : "";
			const config = {
				body: "body" in options ? options.body : "",
				lang: __LANG.list,
			};
			if (Notification.permission === "denied")
				return null;
			if (Notification.permission === "granted")
				new Notification(title, config);
			else
				Notification.requestPermission().then(function(x) {
					if (x === "granted") new Notification(title, config);
				});
			return;
		},
		/**. ``''void'' notify(''object'' dialog)``: Ver método ''signal''.**/
		dialog: function (options) {
			/*-- não permitir múltiplos diálogos ou matar processo --*/
			if (this.modal.childElementCount > 0) {
				if (options.close === true) {
					while (this.modal.childElementCount > 0)
						this.modal.removeChild(this.modal.firstElementChild);
					this.modal.parentElement.removeChild(this.modal);
				}
				return;
			}
			/*-- construindo caixa de diálogo --*/
			const wall = this.modal;
			const node = this.ask.cloneNode(true);
			const foot = node.querySelector(".js-wd-signal-foot");
			const fire = typeof options.trigger === "function" ? options.trigger : console.log;
			const acts = typeof options.actions === "object"   ? options.actions : {closed: "\u00D7"};
			function trigger(ev) {
				if (ev.type === "click" || ev.key === "Enter") {
					const link = ev.target;
					const ask  = link.parentElement.parentElement;
					const wall = ask.parentElement;
					wall.removeChild(ask);
					wall.parentElement.removeChild(wall);
					fire(link.dataset.link);
				}
			}

			if ("title" in options)
				node.querySelector(".js-wd-signal-head").innerText = options.title;
			if ("body" in options)
				node.querySelector(".js-wd-signal-body").innerText = options.body;

			let focus = null;
			let index = 0;
			for (let i in acts) {
				let text = acts[i].replace(/\*$/, "");
				let link = document.createElement("span");
				link.className    = "js-wd-signal-action";
				link.dataset.link = i;
				link.innerText    = text;
				link.tabIndex     = ++index;
				link.addEventListener("keypress", trigger, false);
				link.addEventListener("click", trigger, false);
				foot.appendChild(link);
				if ((/\*$/).test(acts[i])) focus = link;
			}
			/*-- renderizando box e node --*/
			document.body.appendChild(wall);
			wall.appendChild(node);
			if (focus !== null) focus.focus();
			return;
		},
		/**. ``''void'' signal(''object'' options)``: Produz interação com o usuário. O argumento ``options`` possui as seguintes propriedades:
		|Nome|Tipo|Valores|Descrição|
		|type|string|notify, dialog ou message (padrão)|Indica o tipo de interação.|
		|title|string|-|Define o título da interação (opcional).|
		|body|string|-|Define a mensgem da interação.|
		|trigger|function|-|Define a função a ser chamada pelo retorno do diálogo (opcional, type=dialog)|
		|actions|object|-|Define os botões do diálogo (opcional, type=dialog)|
		|close|boolean|-|Se verdadeiro, fecha o diálogo aberto (opcional, type=dialog)|
		. O nome das propriedades de ``actions`` define o identificador da ação e seu valor o respectivo texto visual. Ao clicar sobre o botão da ação, a função ``trigger`` será chamada passando como argumento o respectivo identificador da ação. Não é permitido executar múltiplas caixas de diálogo. Se o valor da ação encerrar com o caractere asterisco, essa ação será focalizada.**/
		signal: function(options) {
			if (typeof options !== "object") options = {};
			if (options.type === "notify") return this.notify(options);
			if (options.type === "dialog") return this.dialog(options);
			return this.message(options);
		}
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''object'' __LANG``
	Controla a linguagem local da biblioteca.**/
	const __LANG = {
		_re:          /^[a-z]{2,3}(\-[A-Z][a-z]{3})?(\-([A-Z]{2}|[0-9]{3}))?$/,
		_nav:         navigator.language || navigator.browserLanguage || "",
		_user:        "",
		_currency:    "USD",
		_langNumbers: [],
		_numbers:     [],
		_langMonths:  [],
		_months:      [],
		_langDays:    [],
		_days:        [],
		_langREDates: [],
		_reDates:     {},

		/**. ``''string'' currency``: Define ou retorna o código monetário definido pelo usuário.**/
		get currency()  {return this._currency;},
		set currency(x) {this._currency = String(x).trim();},
		/**. ``''boolean'' test(''string'' x)``: Testa se o argumento ``x`` está no [formato de linguagem](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang).**/
		test: function(x) {return this._re.test(String(x));},
		/**. ``''string'' node(''node'' elem)``: Retorna o atributo ''lang'' do elemento HTML ``elem`` ou seu ascendente ou vazio.**/
		node: function(elem) {
			let lang = "";
			if (elem instanceof HTMLElement) {
				while (elem !== null && lang === "") {
					lang = String(elem.lang).replace(/\s+/g, " ").trim();
					elem = elem.parentElement;
				}
			}
			return lang;
		},
		/**. ``''string'' std``: Retorna a linguagem padrão "en-US".**/
		get std() {return "en-US";},
		/**. ``''string'' nav``: Retorna a linguagem definida pelo navegador ou vazio.**/
		get nav() {return String(this._nav).replace(/\s+/, " ").trim();},
		/**. ``''string'' html``: Retorna a linguagem definida no elemento ''body'' ou ''html''.**/
		get html() {return this.node(document.body);},
		/**. ``''string'' user``: Define ou retorna a linguagens definidas pelo usuário (separação por espaço em branco).**/
		get user()  {return this._user;},
		set user(x) {this._user = String(x).replace(/\s+/g, " ").trim();},
		/**. ``''string'' main``: Retorna a linguagem principal definida pelo usuário, HTML ou navegador.**/
		get main() {return this.list[0];},
		/**. ``''string'' list``: Retorna uma lista de preferências de linguagem (usuário, HTML, navegador ou padrão).**/
		get list() {
			const list = [this.user, this.html, this.nav, this.std].join(" ").split(" ");
			const self = this;
			return list.filter(function(v,i,a) {return self.test(v);})
		},
		/**. ``''boolean'' compare(''array'' base, ''array'' test)``: Retorna verdadeiro se os valores dos arrays informados nos argumentos forem idênticos.**/
		compare: function(base, test) {
			if (base.length !== test.length) return false;
			for (let i = 0; i < base.length; i++)
				if (base[i] !== test[i]) return false;
			return true;
		},
		/**. ``''array'' months``: Retorna uma lista de objetos contendo informações sobre os meses:
		|Nome|Descrição|
		|index|Índice numérico do mês [1-12]|
		|value|Retorna o índice do mês com dois caracteres|
		|long|Nome do mês (MMMM)|
		|short|Abreviação do mês (MMM)|**/
		get months() {
			const lang = this.list;
			if (this.compare(lang, this._langMonths)) return this._months;
			const date = new Date(1970, 0, 1, 12, 0, 0, 0);
			const data = [];
			//const lang = this.main;
			let long, short, index, value;
			for (let i = 0; i < 12; i++) {
				date.setMonth(i);
				long  = date.toLocaleDateString(lang, {month: "long"}).trim();
				short = date.toLocaleDateString(lang, {month: "short"}).trim();
				index = i+1;
				value = (index < 10 ? "0" : "") + String(index);
				data.push({index: index, value: value, long: long, short: short});
			}
			this._langMonths = lang;
			this._months     = data;
			return this._months;
		},
		/**. ``''array'' days``: Retorna uma lista de objetos contendo informações sobre os dias:
		|Nome|Descrição|
		|index|Índice numérico do dia da semana [1-7]|
		|value|Retorna o índice do dia com dois caracteres|
		|long|Nome do dia (DDDD)|
		|short|Abreviação do dia (DDD)|**/
		get days() {
			const lang = this.list;
			if (this.compare(lang, this._langDays)) return this._days;
			const date = new Date(1970, 0, 1, 12, 0, 0, 0);
			const data = [];
			let long, short, index, value;
			for (let i = 1; i < 8; i++) {
				date.setDate(i);
				long  = date.toLocaleDateString(lang, {weekday: "long"}).trim();
				short = date.toLocaleDateString(lang, {weekday: "short"}).trim();
				index = date.getDay() + 1;
				value = "0" + String(index);
				data.push({index: index, value: value, long: long, short: short});
			}
			this._langDays = lang;
			this._days     = data;
			return this._days;
		},
		/**. ``''object'' searchByName(''string'' type, ''string'' name)``: Retorna o objeto com as informações sobre o mês ou o dia da semana (``type``) em buca pelo nome (``name``).**/
		searchByName: function(type, name) {
			name = String(name).trim();
			const upper = name.toUpperCase();
			const lower = name.toLowerCase();
			const data  = this[type];
			let value, short, long, ushort, ulong, lshort, llong;
			for (let i = 0; i < data.length; i++) {
				value  = data[i];
				short  = value.short;
				long   = value.long;
				ushort = short.toUpperCase();
				ulong  = long.toUpperCase();
				lshort = short.toLowerCase();
				llong  = long.toLowerCase();
				if (short  === name  || long  === name)  return value;
				if (ushort === upper || ulong === upper) return value;
				if (lshort === lower || llong === lower) return value;
			}
			return null;
		},
		/**. ``''object'' searchByIndex(''string'' type, ''integer'' index)``: Retorna o objeto com as informações sobre o mês ou o dia da semana (``type``) em buca pelo índice (``index``).**/
		searchByIndex: function(type, index) {
			index = Number(index);
			const data = this[type];
			for (let i = 0; i < data.length; i++) {
				let value = data[i];
				if (index === value.index) return value;
			}
			return null;
		},
		/**. ``''object'' monthRegExp: Retorna um objeto contendo as expressões regulares para os formatos DMMMMYYYY, MMMMDYYYY e MMMMYYYY.**/
		get monthRegExp() {
			const lang = this.list;
			if (this.compare(lang, this._langREDates)) return this._reDates;
			const data = [];
			const day  = "(0?[1-9]|[12]\\d|3[01])";
			const year = "([-+]?\\d{3}\\d+)";
			for (let i = 0; i < this.months.length; i++) {
				let value = this.months[i];
				data.push(value.long.replace(/(\W)/g, "\\$1"));
				data.push(value.short.replace(/(\W)/g, "\\$1"));
			}
			const month = "(" + data.join("|") + ")";
			this._langREDates = lang;
			this._reDates = {
				DMMMMYYYY: new RegExp("^" + ([day, month, year].join("\\ ")) + "$", "i"),
				MMMMDYYYY: new RegExp("^" + ([month, day, year].join("\\ ")) + "$", "i"),
				MMMMYYYY:  new RegExp("^" + ([month, year].join("[\\ /]"))   + "$", "i"),
			}
			return this._reDates;
		},
		/**. ``''array'' numbers``: Retorna uma lista de números inteiros de zero a dez.**/
		get numbers() {
			const lang = this.list;
			if (this.compare(lang, this._langNumbers)) return this._numbers;
			const data = [];
			for (let i = -9; i < 10; i++)
				data.push({id: i, value: Number(i).toLocaleString(lang)});
			this._langNumbers = lang;
			this._numbers     = data;
			return this._numbers;
		},
	};

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
			finite:     /^[+-]?(\.?\d+|\d+\.\d+)(e[+-]?\d+)?$/i,
			percentage: /^[+-]?(\.?\d+|\d+\.\d+)(e[+-]?\d+)?\%$/i,
			factorial:  /^\+?\d+\!$/,
			infinite:   /^[+-]?\∞$/,
		},
		date: {
			YYYYMMDD:  /^([-+]?\d{3}\d+)\-(0[1-9]|1[0-2])\-(0[1-9]|[12]\d|3[01])$/,
			DDMMYYYY:  /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/([-+]?\d{3}\d+)$/,
			MMDDYYYY:  /^(0[1-9]|1[0-2])\.(0[1-9]|[12]\d|3[01])\.([-+]?\d{3}\d+)$/,
			get DMMMMYYYY() {return __LANG.monthRegExp.DMMMMYYYY;},
			get MMMMDYYYY() {return __LANG.monthRegExp.MMMMDYYYY;},
		},
		time: {
			hmmss: /^([01]?\d|2[0-4])\:([0-5]\d)(\:[0-5]\d(\.\d{1,3})?)?$/,
			AM:    /^(0?[1-9]|1[0-2])\:([0-5]\d)(\:[0-5]\d(\.\d{1,3})?)?\ ?am$/i,
			PM:    /^(0?[1-9]|1[0-2])\:([0-5]\d)(\:[0-5]\d(\.\d{1,3})?)?\ ?pm$/i,
		},
		month: {
			YYYYMM:   /^([-+]?\d{3}\d+)\-(0[1-9]|1[0-2])$/,
			MMYYYY:   /^(0[1-9]|1[0-2])\/([-+]?\d{3}\d+)$/,
			get MMMMYYYY() {return __LANG.monthRegExp.MMMMYYYY;},
		},
		week: {
			YYYYWW: /^([-+]?\d{3}\d+)\-W(0[1-9]|[1-4]\d|5[0-4])$/i,
			WWYYYY: /^(0[1-9]|[1-4]\d|5[0-4])\,\ ([-+]?\d{3}\d+)$/,
		},
		email: {
			email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
		},
		/**. ``''object'' test(''any'' x)``: Testa se o valor passado em ``x`` encaixa em alguma expressão regular retornando um objeto contendo os atributos ``group``, ``subgroup`` e ``value`` e ``regexp.**/
		test: function(x) {
			x = String(x).trim();
			for (let i in this) {
				if (i !== "test") {
					for (let j in this[i]) {
						if (this[i][j].test(x))
							return {group: i, subgroup: j, value: x, regexp: this[i][j]};
					}
				}
			}
			return {group: null, subgroup: null, value: x};
		}
	};

/*============================================================================*/
	/**### Eventos Customizados
	###### ``**const** ''object'' wdDatasetEvent``
	Evento a ser disparado ao definir o atributo HTML ''dataset'' pela ferramenta da biblioteca (ver __Node).**/
	const wdDatasetEvent = new CustomEvent("wddataset", {detail: null, bubbles: true});
/*----------------------------------------------------------------------------*/
	/**###### ``**const** ''object'' wdReloadEvent``
	Evento a ser disparado ao carregar elementos pela biblioteca (ver __Node.load).**/
	const wdReloadEvent = new CustomEvent("wdreload", {detail: null, bubbles: true});

/*============================================================================*/
	/**### Administração de Dados
	#### Tipologia
	###### ``**constructor** ''object'' __Type(''any''  input)``
	Construtor para identificação do tipo de dado informado em ``input``.**/
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
		const strings = ["number", "date", "time", "datetime", "string"];
		/* IMPORTANTE: object deve ser o último (qualquer um pode ser um objeto) */
		const objects = [
			"null", "undefined", "boolean", "number", "datetime",
			"array", "node", "regexp", "function", "object"
		];
		/*-- Checagem do tipo --*/
		const types = this.chars ? strings : objects;
		const group = this._test.group;
		if (types.indexOf(group) >= 0 && this[group]) return;
		/*-- Checando cada possibilidade --*/
		for (let i = 0; i < types.length; i++) {
			let value = types[i];
			if (value !== group && this[value]) return;
		}
		/*-- Não se encaixa em nada conhecido --*/
		this._value    = input;
		this._type     = "unknow";
		this._toString = String(input);
		this._valueOf  = Number(input);
	}

Object.defineProperties(__Type.prototype, {
		constructor: {value: __Type},
		/**. ``''boolean'' chars``: Checa se o valor é uma string.**/
		chars: {
			get: function() {
				return (typeof this._input === "string" || this.instanceOf("String"));
			}
		},
		/**. ``''boolean'' empty``: Checa se o valor é uma string de caracteres não visualizáveis.**/
		empty: {
			get: function() {
				return (this.chars && this._input.trim().length === 0);
			}
		},
		/**. ``''boolean'' nonempty``: Checa se o valor é uma string de caracteres visualizáveis.**/
		nonempty: {
			get: function() {
				return (this.chars && this._input.trim().length > 0);
			}
		},
		/**. ``''boolean'' lang``: Checa se o valor é uma string no formato de linguagem.**/
		lang: {
			get: function() {
				return (this.chars && __LANG.test(this._input));
			}
		},
		/**. ``''boolean'' string``: Checa se o valor é uma string diferente de número ou data/tempo.**/
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
		/**. ``''boolean'' number``: Checa se o valor é um número real, fatorial (string) ou percentual (string).**/
		number: {
			get: function() {
				if (this.type !== null) return this.type === "number";
				/*-- Número --*/
				if (typeof this._input === "number" || this.instanceOf("Number")) {
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
					case "infinite": {
						value = value[0] === "-" ? -Infinity : +Infinity
						break;
					}
					default: {
						value = Number(value);
					}
				}
				let check = __Type(value);
				if (!isNaN(value)) {
					this._type     = check._type;
					this._value    = check._value;
					this._valueOf  = check._valueOf;
					this._toString = check._toString;
					return true;
				}
				return false;
			}
		},
		/**. ``''boolean'' finite``: Checa se o valor é um número finito.**/
		finite: {
			get: function() {
				return this.number && isFinite(this.value);
			}
		},
		/**. ``''boolean'' infinite``: Checa se o valor é um número infinito.**/
		infinite: {
			get: function() {
				return this.number && !isFinite(this.value);
			}
		},
		/**. ``''boolean'' integer``: Checa se o valor é um número real inteiro.**/
		integer: {
			get: function() {
				return this.finite && (this.value%1) === 0;
			}
		},
		/**. ``''boolean'' real``: Checa se o valor é um número real não inteiro.**/
		decimal: {
			get: function() {
				return this.finite && (this.value%1) !== 0;
			}
		},
		/**. ``''boolean'' positive``: Checa se o valor é um número positivo.**/
		positive: {
			get: function() {
				return this.number && this.value > 0;
			}
		},
		/**. ``''boolean'' negative``: Checa se o valor é um número negativo.**/
		negative: {
			get: function() {
				return this.number && this.value < 0;
			}
		},
		/**. ``''boolean'' zero``: Checa se o valor é zero.**/
		zero: {
			get: function() {
				return this.value === 0;
			}
		},
		/**. ``''boolean'' boolean``: Checa se o valor é um valor booleano.**/
		boolean: {
			get: function() {
				if (this.type !== null) return this.type === "boolean";
				if (typeof this._input === "boolean" || this.instanceOf("Boolean")) {
					this._type     = "boolean";
					this._value    = this._input.valueOf();
					this._valueOf  = this._value === true ? 1 : 0;
					this._toString = this._value === true ? "true" : "false";
					return true;
				}
				return false;
			}
		},
		/**. ``''boolean'' regexp``: Checa se o valor é uma expressão regular.**/
		regexp: {
			get: function() {
				if (this.type !== null) return this.type === "regexp";
				if (this.instanceOf("RegExp")) {
					this._type  = "regexp";
					this._value = this._input;
					this._valueOf  = this._value.valueOf();
					this._toString = this._value.source;
					return true;
				}
				return false;
			}
		},
		/**. ``''boolean'' datetime``: Checa se o valor é um conjunto data/tempo. Enquadram-se nessa condição o construtor nativo ``Date`` e strings em formato de data e tempo, nos termos da biblioteca, separados por espaço, virgula e espaço ou a letra T.**/
		datetime: {
			get: function() {
				if (this.type !== null) return this.type === "datetime";
				if (this.instanceOf("Date")) {
					const input = this._input;
					const data  = {
						D: input.getDate(),  M: input.getMonth()+1, Y: input.getFullYear(),
						h: input.getHours(), m: input.getMinutes(), s: input.getSeconds(),
						l: input.getMilliseconds()
					};
					let v, repeat, string;
					for (let i in data) {
						v = Math.abs(data[i]);
						if (i === "Y")
							repeat = (v < 10 ? 3 : (v < 100 ? 2 : (v < 1000 ? 1 : 0)));
						else if (i === "l")
							repeat = (v < 10 ? 2 : (v < 100 ? 1 : 0));
						else
							repeat = (v < 10 ? 1 : 0);
						string  = ("0").repeat(repeat) + String(v);
						data[i] = (data[i] < 0 ? "-" : "") + string;
					}
					const time = [data.h, data.m, data.s+"."+data.l].join(":");
					const date = [data.Y, data.M, data.D].join("-");
					this._type     = "datetime";
					this._value    = date+"T"+time;
					this._valueOf  = this._value;
					this._toString = this._value;
					return true;
				}
				/*-- Data/Tempo em formato de string --*/
				if (!this.chars) return false;
				let   dt = this._input.trim();
				const re = /(\d\d)(T|\,\ |\ )(\d?\d\:)/i;
				if (!re.test(dt)) return false;
				dt = dt.replace(re, "$1T$3").split("T");
				const date = __Type(dt[0]);
				const time = __Type(dt[1]);
				if (!date.date || !time.time) return false;
				this._type     = "datetime";
				this._value    = date.value+"T"+time.value;
				this._valueOf  = this._value;
				this._toString = this._value;
				return true;
			}
		},
		/**. ``''boolean'' date``: Checa se o valor é uma data em formato de string.**/
		date: {
			get: function() {
				if (this.type !== null) return this.type === "date";
				if (!this.chars || this._test.group !== "date") return false;
				const type = {
					YYYYMMDD:  {y: "$1", m: "$2", d: "$3", MMMM: false},
					DDMMYYYY:  {y: "$3", m: "$2", d: "$1", MMMM: false},
					MMDDYYYY:  {y: "$3", m: "$1", d: "$2", MMMM: false},
					DMMMMYYYY: {y: "$3", m: "$2", d: "$1", MMMM: true},
					MMMMDYYYY: {y: "$3", m: "$1", d: "$2", MMMM: true}
				}
				if (!(this._test.subgroup in type)) return false;
				const cfg  = type[this._test.subgroup];
				const date = {
					y: this._test.value.replace(this._test.regexp, cfg.y),
					m: this._test.value.replace(this._test.regexp, cfg.m),
					d: this._test.value.replace(this._test.regexp, cfg.d)
				};
				/* caso o mês seja pelo nome, capturar índice do mês */
				if (cfg.MMMM) {
					const MMMM = __LANG.searchByName("months", date.m);
					if (MMMM === null) return false;
					date.m = MMMM.index;
				}
				for (let i in date) date[i] = Number(date[i]);
				/* checando dados da data */
				const y    = date.y;
				const feb  = (y%400 === 0 || (y%4 === 0 && y%100 !== 0)) ? 29 : 28;
				const days = [0, 31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				if (date.d > days[date.m]) return false;
				/* acertando o formato */
				let v, repeat, string;
				for (let i in date) {
					v = Math.abs(date[i]);
					if (i === "y")
						repeat = (v < 10 ? 3 : (v < 100 ? 2 : (v < 1000 ? 1 : 0)));
					else
						repeat = (v < 10 ? 1 : 0);
					string  = ("0").repeat(repeat) + String(v);
					date[i] = (date[i] < 0 ? "-" : "") + string;
				}
				this._type     = "date";
				this._value    = [date.y, date.m, date.d].join("-");
				this._valueOf  = this._value;
				this._toString = this._value;
				return true;
			}
		},
		/**. ``''boolean'' function``: Checa se o valor é uma função.**/
		function: {
			get: function() {
				if (this.type !== null) return this.type === "function";
				if (typeof this._input === "function" || this.instanceOf("Function")) {
					this._type     = "function";
					this._value    = this._input;
					this._valueOf  = "valueOf" in this._value ? this._value.valueOf() : this._value;
					this._toString = "toString" in this._value ? this._value.toString() : this._value;
					return true;
				}
				return false;
			}
		},
		/**. ``''boolean'' array``: Checa se o valor é um array.**/
		array: {
			get: function() {
				if (this.type !== null) return this.type === "array";
				if (Array.isArray(this._input) || this.instanceOf("Array")) {
					this._type     = "array";
					this._value    = this._input;
					this._valueOf  = "valueOf" in this._value ? this._value.valueOf() : this._value;
					this._toString = JSON.stringify(this._value);
					return true;
				}
				return false;
			}
		},
		/**. ``''boolean'' null``: Checa se o valor é nulo.**/
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
		/**. ``''boolean'' undefined``: Checa se o valor é indefinido.**/
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
				let v, repeat, string;
				for (let i in time) {
					v = time[i];
					if (i === "l")
						repeat = (v < 10 ? 2 : (v < 100 ? 1 : 0));
					else
						repeat = (v < 10 ? 1 : 0);
					string  = ("0").repeat(repeat) + String(v);
					time[i] = (time[i] < 0 ? "-" : "") + string;
				}
				this._type     = "time";
				this._value    = [time.h, time.m, time.s+"."+time.l].join(":");
				this._valueOf  = this._value;
				this._toString = this._value;
				return true;
			}
		},
		/**. ``''boolean'' node``: Checa se o argumento é um elemento HTML ou uma coleção desses.**/
		node: {
			get: function() {
				if (this.type !== null) return this.type === "node";
				let   html = null;
				const node = this._input;
				const list = { /* 0: individual, 1: lista */
					HTMLElement: false,
					SVGElement: false,
					MathMLElement: false,
					NodeList: true,
					HTMLCollection: true,
					HTMLAllCollection: true,
					HTMLOptionsCollection: true,
					HTMLFormControlsCollection: true
				};
				for (let object in list) {
					if (this.instanceOf(object)) {
						html  = [];
						if (!list[object]) {
							html.push(node);
						} else {
							let i = -1;
							while (++i < node.length) html.push(node[i]);
						}
						break;
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
		/**. ``''boolean'' object``: Checa se o argumento é um objeto que não se enquadra nas demais categorias.**/
		object: {
			get: function() {
				if (this.type !== null) return this.type === "object";
				if (typeof this._input === "object") {
					this._type     = "object";
					this._value    = this._input;
					this._valueOf  = this._value;
					this._toString = this._value;
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
			value: function() {return this._valueOf;}
		},
		/**. ``''string'' toString()``: Método padrão.**/
		toString: {
			value: function() {return this._toString;}
		},
		/**. ``''boolean'' instanceOf(''string'' name)``: Retorna se o valor informado é instância do objeto cujo __nome__ é informado no argumento ``name``.**/
		instanceOf: {
			value: function (name) {
				name = String(name).trim();
				if (name in window)
					return this._input instanceof window[name];
				return false;
			}
		}
	});

/*----------------------------------------------------------------------------*/
	/**#### Gestão de Dados
	###### ``**constructor** ''object'' __DataSet(''any'' input)``
	Construtor para gerir conjunto de dados. O argumento opcional ``input`` será importado conforme método ``import`` que será chamado durante a construção.**/
	function __DataSet(input) {
		if (!(this instanceof __DataSet))	return new __DataSet(input);
		Object.defineProperties(this, {
			_data: {value: []}
		});
		this.import(input);
	}

	Object.defineProperties(__DataSet.prototype, {
		constructor: {value: __DataSet},
		/**. ``''self'' import(''any'' input)``: Importa os dados de ``input`` que pode ser uma string (name: value\r\n), um objeto ou instâncias de Headers, FormData ou URLSearchParams.**/
		import: {
			value: function(input) {
				const check  = __Type(input);
				const self   = this;
				const header = /^([a-z\-]+\:\ [^\n]+\r\n)+$/;
				const search = /^\??([^=]+\=(\&?|[^&]+\&?))+$/;
				if (check.nonempty && header.test(input)) {
					const data = input.trim().split("\r\n");
					for (let i = 0; i < data.length; i++) {
						let part  = data[i].split(": ");
						let name  = part[0].trim();
						let value = part.length > 0 ? part[1].trim() : "";
						if (name.length > 0) this.append(name, value);
					}
				} else if (check.nonempty && search.test(input)) {
					const data = input.replace(/^\?/, "").trim().split("&");
					for (let i = 0; i < data.length; i++) {
						let part  = data[i].split("=");
						let name  = part[0].trim().replace(/\[\]$/, "");
						let value = part.length > 1 ? part[1] : "";
						if (name.length > 0) this.append(name, value);
					}
				} else if (check.instanceOf("URL")) {
					return this.import(input.search);
				} else if (check.instanceOf("Headers")) {
					input.forEach(function (value,name,data) {self.append(name, value);});
				} else if (check.instanceOf("URLSearchParams")) {
					input.forEach(function (value,name,data) {self.append(name, value);});
				} else if (check.instanceOf("FormData")) {
					for (const data of input.entries()) {this.append(data[0], data[1]);}
				} else if (check.object) {
					for (let name in input) this.append(name, input[name]);
				}
				return;
			}
		},
		/**. ``''self'' append(''string'' name, ''any'' value)``: Acrescenta um valor (``value``) vinculado a um identificador (``name``).**/
		append: {
			value: function(name, value) {
				name = String(name).replace(/\[\]$/, "").trim();
				if (name.length !== 0)
					this._data.push({name: name, value: value});
				return this
			}
		},
		/**. ``''self'' delete(''string'' name)``: Remove todos os valores associados ao indentificador ``name``.**/
		delete: {
			value: function(name) {
				name = String(name).replace(/\[\]$/, "").trim();
				if (name.length !== 0)
					this._data.forEach(function(v,i,a) {
						if (v !== null && name === v.name) a[i] = null;
					});
				return this;
			}
		},
		/**. ``''self'' set(''string'' name, ''any'' value)``: Define um valor (``value``) vinculado a um identificador (``name``), substuindo os existentes.**/
		set: {
			value: function(name, value) {
				this.delete(name).append(name, value);
				return this;
			}
		},
		/**. ``''array'' getAll(''string'' name)``: Retorna uma lista de valores identificados por ``name``.**/
		getAll: {
			value: function(name) {
				name = String(name).replace(/\[\]$/, "").trim();
				const list = [];
				if (name.length !== 0) {
					for (let i of this.entries())
						if (name === i[0]) list.push(i[1]);
				}
				return list;
			}
		},
		/**. ``''boolean'' has(''string'' name)``: Retorna verdadeiro se o identificador ``name`` existir.**/
		has: {
			value: function(name) {
				name = String(name).replace(/\[\]$/, "").trim();
				if (name.length !== 0) {
					for (let i of this.entries())
						if (name === i[0]) return true;
				}
				return false;
			}
		},
		/**. ``''object'' toObject``: Converte o conjunto de dados em um objeto com **sobreposição de identificadores**.**/
		toObject: {
			get: function() {
				const data = {};
				for (let i of this.entries()) data[i[0]] = i[1];
				return data;
			}
		},
		/**. ``''object'' toListObject``: Converte o conjunto de dados em um objeto organizado em listas de valores.**/
		toListObject: {
			get: function() {
				const data = {};
				for (let v of this.entries()) {
					let name  = v[0];
					let value = v[1];
					let check = __Type(value);
					/*-- definição da propriedade, se for objeto analisar cada item adiante --*/
					if (!(name in data) && !check.object) data[name] = [];

					if (check.instanceOf("FileList") || check.array) {
						if (value.length === 0)
							data[name].push("");
						else
							for (let i = 0; i < value.length; i++) data[name].push(value[i]);
					}
					else if (check.object) {
						let count = 0;
						for (let i in value) count++;
						if (count === 0) {
							if (!(name in data)) data[name] = [];
							data[name].push("");
						} else {
							for (let i in value) {
								let prop = name+"."+i;
								if (!(prop in data)) data[prop] = [];
								data[prop].push(value[i]);
							}
						}
					}
					else {
						data[name].push(value);
					}
				}
				return data;
			}
		},
		/**. ``''object'' toHeaders``: Converte o conjunto de dados em um objeto Headers. Se a ferramenta não estiver definida, retornará o resultado da propriedade ``toObjectHeaders``.**/
		toHeaders: {
			get: function() {
				if (!("Headers" in window)) return this.toObjectHeaders;
				const data = new Headers();
				const src  = this.toListObject;
				for (let name in src)
					for (let value of src[name])
						data.append(name, value);
				return data;
			}
		},
		/**. ``''string'' toStringHeaders``: Converte o conjunto de dados em uma string com dados separados por "\r\n" e nome e valor separados por ": ".**/
		toStringHeaders: {
			get: function() {
				const data = [];
				const src  = this.toObjectHeaders;
				for (let i in src) data.push(i + ": " + src[i] + "\r\n");
				return data.join("");
			}
		},
		/**. ``''object'' toObjectHeaders``: Converte o conjunto de dados em um objeto organizado em strings com valores separador por ", ".**/
		toObjectHeaders: {
			get: function() {
				const data = {};
				const src  = this.toListObject;
				for (let i in src) data[i] = src[i].join(", ");
				return data;
			}
		},
		/**. ``''object'' toFormData``: Converte o conjunto de dados em um objeto FormData. Se a ferramenta não estiver definida, retornará o resultado da propriedade ``toSearch``.**/
		toFormData: {
			get: function() {
				if (!("FormData" in window)) return this.toSearch;
				const data = new FormData();
				const src  = this.toListObject;
				for (let name in src)
					for (let value of src[name])
						data.append(name+(src[name].length > 1 ? "[]" : ""), value);
				return data;
			}
		},
		/**. ``''object'' toURLSearchParams``: Converte o conjunto de dados em um objeto URLSearchParams. Se a ferramenta não estiver definida, retornará o resultado da propriedade ``toSearch``.**/
		toURLSearchParams: {
			get: function() {
				if (!("URLSearchParams" in window)) return this.toSearch;
				const data = new URLSearchParams();
				const src  = this.toListObject;
				for (let name in src) {
					for (let value of src[name]) {
						let file = __Type(value).instanceOf("File");
						let prop = name+(src[name].length > 1 ? "[]" : "")
						let val  = file ? value.name : value
						data.append(prop, val);
					}
				}
				return data;
			}
		},
		/**. ``''string'' toSearch``: Converte o conjunto de dados em uma string com itens separados por &amp;.**/
		toSearch: {
			get: function() {
				const data = [];
				const src  = this.toListObject;
				for (let name in src) {
					for (let value of src[name]) {
						let file = __Type(value).instanceOf("File");
						let prop = encodeURIComponent(name)+(src[name].length > 1 ? "[]" : "");
						let val  = encodeURIComponent(file ? value.name : value);
						data.push(prop+"="+val);
					}
				}
				return data.join("&");
			}
		},
		[Symbol.iterator]: {
			value: function*() {for (let v of this.entries()) yield v;}
		},
		/**. ``''object'' entries()``: Retorna um objeto Generator para looping ''for of'' das entradas.**/
		entries: {
			value: function*() {
				for (let v of this._data)
					if (v !== null) yield [v.name, v.value];
			}
		},
		/**. ``''object'' keys()``: Retorna um objeto Generator para looping ''for of'' das chaves.**/
		keys: {
			value: function*() {for (let v of this.entries()) yield v[0];}
		},
		/**. ``''object'' values()``: Retorna um objeto Generator para looping ''for of'' dos valores.**/
		values: {
			value: function*() {for (let v of this.entries()) yield v[1];}
		},
		/**. ``''self'' forEach(''function'' caller)``: Chama ``caller`` para cada item, repassando o valor e nome, e um objeto com o par nome/valor, respectivamente, como argumentos.**/
		forEach: {
			value: function(caller) {
				if (__Type(caller).function) {
					const dataset = this.valueOf();
					for (let i in dataset)
						caller(dataset[i], i.trim(), dataset);
				}
				return this;
			}
		},
		/**. ``''integer'' size``: Retorna um objeto representativo e não utilizável dos dados.**/
		size: {
			get: function() {
				let size = 0;
					for (let i of this.entries()) size++;
				return size;
			}
		},
		/**. ``''object'' valueOf()``: Retorna uma representação dos dados em forma de objeto.**/
		valueOf: {
			value: function() {
				const counter = {};
				const dataset = {};
				for (let i of this.entries()) {
					let name  = i[0];
					let value = i[1];
					if (!(name in counter)) counter[name] = 0;
					let prop = name + ("\r").repeat(++counter[name]);
					dataset[prop] = value;
				}
				return dataset;
			}
		},
		/**. ``''string'' toString()``: Retorna o mesmo produto da propriedade ``toStringHeaders``.**/
		toString: {
			value: function() {return this.toStringHeaders;}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#### Árvore de Dados
	###### ``**constructor** ''object'' __Tree()``
	Construtor para manipulação de regras com com aberturas e fechamentos de níveis para fins de construção guiada de código XML.**/
	function __Tree() {
		if (!(this instanceof __Tree)) return new __Tree();
		Object.defineProperties(this, {
			_tree:    {value: []},
			_data:    {value: []},
			_pattern: {writable: true, value: "?"},
			_save:    {writable: true, value: []},
			_xml:     {writable: true, value: false}
		});
	}

	Object.defineProperties(__Tree.prototype, {
		constructor: {value: __Tree},
		/**. ``''string'' char(''string'' x)``: Retorna o argumento adaptado para exibição HTML.**/
		char: {
			value: function(x) {
				if (x === undefined || x === null) return "";
				const chars = String(x).split("");
				const html  = [{a: "&",  b: "&amp;"}, {a: "<",  b: "&lt;"},  {a: ">", b: "&gt;"}];
				if (!this.xml)
					html.push({a: "\n", b: "<br />"}, {a: "\t", b: "&Tab;"}, {a: " ", b: "&nbsp;"});
				chars.forEach(function(v,i,a) {
					for (let h of html)
						if (v === h.a) a[i] = h.b;
				});
				return chars.join("");
			}
		},
		/**. ``''boolean'' xml``: Define se a estrutura da árvore se destina à marcação XML.**/
		xml: {
			get: function()  {return this._xml === true;},
			set: function(x) {this._xml = x === true;}
		},
		/**. ``''string'' level``: Retorna o nome do último nível informado ou nulo se vazio.**/
		level: {
			get: function() {
				if (this._tree.length === 0) return null;
				return this._tree[this._tree.length - 1];
			}
		},
		/**. ``''string'' pattern(''string'' model)``: Define e retorna um modelo padrão de ''tag'' a ser elaborada a partir do nome do nível. O nome do nível será inserido no modelo a partir da substituição do caracteres de interrogação. Por exemplo, se definido o modelo "span-?" e nível "line", a ''tag'' de abertura será ''<span-line>''. O valor padrão é "?", obtido quando se define o argumento como string vazia ou nulo. Se o argumento for indefinido, retorna o valor.**/
		pattern: {
			value: function(model) {
				if (model === undefined) return this._pattern;
				const pattern = model === null ? "?" : String(model).replace(/\s+/g, "").trim();
				this._pattern = pattern.length === 0 ? "?" : pattern;
				return this._pattern;
			}
		},
		/**. ``''self'' add(''string'' chars)``: Adiciona caracteres à arvore.**/
		add: {
			value: function(chars) {
				this._data.push(this.char(chars));
				return this;
			}
		},
		/**. ``''self'' open(''string'' name)``: Abre novo nível nomeado conforme argumento ``name``.**/
		open: {
			value: function(name) {
				const level = String(name).replace(/\s+/g, "").trim();
				const elem  = this.pattern().replace(/\?+/g, level);
				this._tree.push(level);
				this._data.push("<"+elem+">");
				return this;
			}
		},
		/**. ``''self'' close()``: Fecha o último nível aberto.**/
		close: {
			value: function() {
				const elem = this.pattern().replace(/\?+/g, this.level);
				this._data.push("</"+elem+">");
				this._tree.pop();
				return this;
			}
		},
		/**. ``''self'' append(''string'' name, string'' chars)``: Aplica o método ``open`` e ``close`` em sequência inserido o conteúdo de ``chars``.**/
		append: {
			value: function(name, chars) {
				return this.open(name).add(chars).close();
			}
		},
		/**. ``''self'' finish()``: Fecha todos os níveis abertos.**/
		finish: {
			value: function() {
				while (this.level !== null) this.close();
				return this;
			}
		},
		/**. ``''self'' walkTo(''integer'' level)``: Fechar todos os níveis até o nível informado em ''level'', salvando o caminho para restauração através do método ''backTo''.**/
		walkTo: {
			value: function(level) {
				const check = __Type(level);
				if (check.integer && !check.negative && check.value < this._tree.length) {
					this._save = this._tree.slice();
					while (this._tree.length > check.value) this.close();
				}
				return this;
			}
		},
		/**. ``''self'' backTo()``: Reabre os caminhos fechados em ''walkTo''.**/
		backTo: {
			value: function() {
				if (this._tree.length < this._save.length) {
					for (let i = this._tree.length; i < this._save.length; i++)
						this.open(this._save[i], "");
					this._save = [];
				}
				return this;
			}
		},
		/**. ``''string'' toString()``: Retorna o resultado da árvore.**/
		toString: {value: function() {return this._data.join("");}},
		/**. ``''string'' valueOf()``: Como o método toString.**/
		valueOf: {value: function() {return this._data.join("");}}
	});

/*----------------------------------------------------------------------------*/
	/**#### Transformação de Dados
	###### ``**constructor** ''object'' __Parser(''any'' input)``
	Construtor para transformação de dados. Os dados de entrada são informados no argumento ``input``. Se a transformação falhar, os atributos retornarão nulo. Todos as propriedades retornam uma nova instância do objeto ''__Parser'' com o resultado da transformação anterior com o objetivo de fazê-las em cadeia. Utilize o método ''get'' ao fim das trasformações para obter seu valor.**/
	function __Parser(input) {
		if (!(this instanceof __Parser)) return new __Parser(input);
		const check = new __Type(input);
		Object.defineProperties(this, {
			_data:  {value: input},
			_check: {value: check},
			_saved: {value: {}},
			_table: {value: check.instanceOf("HTMLTableElement")}
		});
	}

	Object.defineProperties(__Parser.prototype, {
		constructor: {value: __Parser},
		/**. ``''object'' csvTable``: Transforma string [CSV]<https://www.rfc-editor.org/rfc/rfc4180> em tabela HTML.**/
		csvTable: {
			get: function() {
				if ("csvTable" in this._saved)
					return new __Parser(this._saved.csvTable);
				let data = null;
				if (this._check.chars) {
					const tree = new __Tree();
					const text = this._data.replace(/\r\n/g, "\n");
					const code = text.split("");
					const rows = text.trim().split("\n").length;
					const cols = /[\ \,\;\t\|]/;
					let    col = null;
					let  lines = 0;
					tree.open("table").open("thead").open("tr");
					code.forEach(function(v,i,a) {
						const tag = tree.level;
						/*-- células entre aspas --*/
						if (tag === "span") {
							if (v === "'" && a[i+1] === "'") {
								a[i+1] = "";
								tree.add("\"");
							} else if (v === "\"") {
								tree.close();
								if (col === null && a[i+1] !== "\n") col = a[i+1];
							} else {
								tree.add(v)
							}
						}
						/*-- células descrição ou de cabeçalho --*/
						else if (tag === "td" || tag === "th") {
							if (v === "\n") {
								if (lines === 0) {
									tree.close().close().close().open("tbody").open("tr");
								} else if (lines < (rows - 1)) {
									tree.close().close().open("tr");
								}
								lines++;
							} else if (col === null && cols.test(v)) { /*-- capturando separador de célula --*/
								col = v;
								tree.close()
							} else if (col === v) { /*-- encerrando célula --*/
								tree.close();
							} else {
								tree.add(v);
							}
						}
						/*-- linhas --*/
						else if (tag === "tr") {
							if (v === "\n") {
								if (lines === 0) {
									tree.close().close().open("tbody").open("tr");
								} else if (lines < (rows - 1)) {
									tree.close().open("tr");
								}
								lines++;
							} else if (v === "\"") {
								tree.open(lines === 0 ? "th" : "td").open("span");
							} else {
								tree.open(lines === 0 ? "th" : "td").add(v);
							}
						}
					});
					tree.finish();
					const div = document.createElement("DIV");
					div.innerHTML = tree.valueOf();
					data = div.children[0];
				}
				this._saved["csvTable"] = data;
				return this.csvTable;
			}
		},
		/**. ``''object'' tableMatrix``: Transforma tabela HTML em matriz 2x2.**/
		tableMatrix: {
			get: function() {
				if ("tableMatrix" in this._saved)
					return new __Parser(this._saved.tableMatrix);
				let data = null;
				if (this._table) {
  				const matrix = Array.prototype.slice.call(this._data.rows);
					for (let i = 0; i < matrix.length; i++)
					  matrix[i] = Array.prototype.slice.call(matrix[i].cells);
					data = matrix;
				}
				this._saved["tableMatrix"] = data;
				return this.tableMatrix;
			}
		},
		/**. ``''object'' tableValues``: Igual à propriedade ``tableMatrix``, mas exibindo os valores das células.**/
		tableValues: {
			get: function() {
				if ("tableValues" in this._saved)
					return new __Parser(this._saved.tableValues);
				let data = this.tableMatrix.get();
				if (data !== null) {
  				for (let i = 0; i < data.length; i++)
  					for (let j = 0; j < data[i].length; j++)
  						data[i][j] = data[i][j].innerText;
				}
				this._saved["tableValues"] = data;
				return this.tableValues;
			}
		},
		/**. ``''object'' matrixCSV``: Transforma uma matriz em string CSV.**/
		matrixCSV: {
			get: function() {
				if ("matrixCSV" in this._saved)
					return new __Parser(this._saved.matrixCSV);
				let data = null;
				if (this._check.array) {
					try {
						const csv = [];
						this._data.forEach(function (row,i,a) {
							csv.push([]);
							row.forEach(function (col,j,b) {
								let text = String(col).replace(/\"/g, "''");
								csv[i].push("\"" + text + "\"");
							});
							csv[i] = csv[i].join(",");
						});
						data = csv.join("\r\n");
					} catch(e) {}
				}
				this._saved["matrixCSV"] = data;
				return this.matrixCSV;
			}
		},
		/**. ``''object'' matrixList``: Transforma uma matriz em uma lista de objetos.**/
		matrixList: {
			get: function() {
				if ("matrixList" in this._saved)
					return new __Parser(this._saved.matrixList);
				let data = null;
				if (this._check.array) {
					try {
						const object = [];
						let   title  = null;
						this._data.forEach(function (row,i,a) {
							if (!__Type(row).array) return;
							if (title === null) {
								title = row;
								return;
							}
							let item = {};
							row.forEach(function(value,j,b) {
								let name = j < title.length ? title[j] : "#"+j;
								item[name] = value;
							});
							object.push(item)
						});
						data = object;
					} catch(e) {}
				}
				this._saved["matrixList"] = data;
				return this.matrixList;
			}
		},
		/**. ``''object'' stringJSON``: Transforma string JSON em objeto.**/
		stringJSON: {
			get: function() {
				if ("stringJSON" in this._saved)
					return new __Parser(this._saved.stringJSON);
				let data = null;
				if (this._check.chars) {
					try {data = JSON.parse(this._data);} catch(e) {}
				}
				this._saved["stringJSON"] = data;
				return this.stringJSON;
			}
		},
		/**. ``''object'' jsonString``: Transforma objeto em string JSON.**/
		jsonString: {
			get: function() {
				if ("jsonString" in this._saved)
					return new __Parser(this._saved.jsonString);
				let data = null;
				try {data = JSON.stringify(this._data);} catch(e) {}
				this._saved["jsonString"] = data;
				return this.jsonString;
			}
		},
		/**. ``''object'' stringHTML``: Transforma string em documento HTML.**/
		stringHTML: {
			get: function() {
				if ("stringHTML" in this._saved)
					return new __Parser(this._saved.stringHTML);
				let data = null;
				if (this._check.chars) {
					try {
						let parser = new DOMParser();
						data = parser.parseFromString(this._data, "text/html");
					} catch(e) {}
				}
				this._saved["stringHTML"] = data;
				return this.stringHTML;
			}
		},
		/**. ``''object'' stringXML``: Transforma string em documento XML.**/
		stringXML: {
			get: function() {
				if ("stringXML" in this._saved)
					return new __Parser(this._saved.stringXML);
				let data = null;
				if (this._check.chars) {
					try {
						let parser = new DOMParser();
						data = parser.parseFromString(this._data, "application/xml");
					} catch(e) {}
				}
				this._saved["stringXML"] = data;
				return this.stringXML;
			}
		},
		/**. ``''object'' stringSVG``: Transforma string em documento SVG.**/
		stringSVG: {
			get: function() {
				if ("stringSVG" in this._saved)
					return (this._saved.stringSVG);
				let data = null;
				if (this._check.chars) {
					try {
						let parser = new DOMParser();
						data = parser.parseFromString(this._data, "image/svg+xml");
					} catch(e) {}
				}
				this._saved["stringSVG"] = data;
				return this.stringSVG;
			}
		},
		/**. ``''object'' wdArray``: Transforma notação wd em array de objetos. Trata-se de uma notação específica para o atributo HTML dataset que invocará as ferramentas da biblioteca ao ter o evento adequado disparado.
		. A notação consiste num conjunto de dados no formato ''nome{valor}'' que resultará num objeto a ser retornado. O par ''nome{valor}'' inicia com o nome do atributo seguido do caracter de abertura do escopo, do seu respectivo valor e do caractere de fechamento de escopo.
		. Há três caracteres de escopo&colon; **&lbrace;&rbrace;** define um valor genérico; **&lbrack;&rbrack;** define um array separado por vírgulas; e **&lpar;&rpar;** define o nome de uma função presente dentro do escopo de ''window'' e defindo por ''var'' ou ''function'' e, se a função não existir, será atribuído o valor nulo.
		. Se o valor contiver o mesmo caractere do escopo, deverá haver a mesma quantidade de caracteres de abertura e de fechamento. Caso seja necessário desobedecer essa regra, o valor deverá ser blindado por apóstrofos (**&apos;**) no início e no fim. Apóstrofos internos são definidos por apóstrofos duplos seguidos (**&apos;&apos;**).
		. O valor retornado será uma lista de objetos. Para acrescentar um objeto à lista, deve-se utilizar o caractere **&amp;**.
		. Os valores dos atributos serão do tipo string, exceto nos casos dos valores ''undefined'', ''null'', ''true'', ''false'' e dígitos, que serão tratados de acordo com o que representam. Para definiir uma expressão regular, o valor deverá iniciar e terminar com o caractere de barra (**&frasl;**), podendo adicionar os complementos ''igm'' após a barra final.
		. A notação é limitada ao primeiro nível. Para adição de cadeias de objetos (objetos dentro de objetos), cada valor deverá ser reprocessado.
		. A string ''a{true}b[1,2,3]c(alert)&a{test}'' retornará a lista ``[{a&colon; true, b&colon; [1,2,3], c&colon; alert()}, {a&colon; "test"}]``.
		. Os atributos identificados com os nomes **&dollar;** e **&dollar;&dollar;**, com valor empacotado por **&lbrace;&rbrace;**, recebem um selector CSS e assumem o valor de um elemento HTML ou de uma lista de elementos (''NodeList'') correspondente ao respectivo seletor. As strings ''document'' e ''window'' assumem os respectivos objetos identificados por esses nomes.**/
		wdArray: {
			get: function() {
				if ("wdArray" in this._saved)
					return new __Parser(this._saved.wdArray);
				let data = null;
				try {
					if (this._check.chars) {
						const tree = new __Tree();
						const code = this._data.split("");
						let  count = 0;
						let tag, val;
						tree.xml = true;
						tree.open("wd").open("object");

						for (let i = 0; i < code.length; i++) {
							val = code[i];
							tag = tree.level;

							if (tag === "object") {
								if (val === "&")
									tree.close().open("object");
								else if (i < code.length)
									tree.open("property").open("name").add(val);
							}
							else if (tag === "property") {
								tree.open("name").add(val);
							}
							else if (tag === "name") {
								if (val === "{") {
									tree.close().open("type").add("value").close().open("value");
									if (code[i+1] === "'") {
										tree.open("quote");
										code[i+1] = "";
									}
								} else if (val === "(") {
									tree.close().open("type").add("function").close().open("function");
								} else if (val === "[") {
									tree.close().open("type").add("array").close().open("array").open("item");
									if (code[i+1] === "'") {
										tree.open("quote");
										code[i+1] = "";
									}
								} else {
									tree.add(val)
								}
							}
							else if (tag === "item") {
								if (val === ",") {
									tree.close().open("item");
									if (code[i+1] === "'") {
										tree.open("quote");
										code[i+1] = "";
									}
								}	else if (val === "]") {
									tree.close().close().close();
								} else {
									tree.add(val);
								}
							}
							else if (tag === "quote") {
								if (val === "'") {
									if (code[i+1] === "'")
										code[i+1] = "\"";
									else
										tree.close();
								} else {
									tree.add(val)
								}
							}
							else if (tag === "value") {
								if (val === "}" && count === 0) {
									tree.close().close();
								} else {
									if (val === "{" || val === "}")
										count += val === "{" ? 1 : -1;
									tree.add(val);
								}
							}
							else if (tag === "function") {
								if (val === ")" && count === 0) {
									tree.close().close();
								} else {
									if (val === "(" || val === ")")
										count += val === "(" ? 1 : -1;
									tree.add(v);
								}
							}
							else if (tag === "array") {
								if (val === "]" && count === 0) {
									tree.close().close();
								} else {
									if (val === "[" || val === "]")
										count += val === "[" ? 1 : -1;
									tree.add(v);
								}
							}
						};
						tree.finish();
						const parser = new __Parser(tree.valueOf());
						const html   = parser.stringHTML.get();
						const object = html.querySelectorAll("object");
						data = [];
						for (let i = 0; i < object.length; i++) {
							let json = {};
							let prop = object[i].querySelectorAll("property");
							for (let j = 0; j < prop.length; j++) {
								let name   = prop[j].querySelector("name").innerText.trim();
								let type   = prop[j].querySelector("type").innerText.trim();
								let source = prop[j].querySelector(type);
								let value  = undefined;
								if (type === "value") {
									value = source.innerText;
									let change = {true: true, false: false, null: null, undefined: undefined};
									let regexp = /^\/(.+)\/([gim]+)?$/;
									if (name === "$" || name === "$$")
										value = new __Query(value)[name];
									else if (value.trim() in change)
										value = change[value.trim()];
									else if (regexp.test(value))
										value = new RegExp(value.replace(regexp, "$1"), value.replace(regexp, "$2"));
									else
										value = __Type(value).value;
								} else if (type === "function") {
									value = source.innerText.trim();
									value = value in window ? window[value] : undefined;
								} else if (type === "array") {
									value = [];
									let items = source.querySelectorAll("item");
									for (let k = 0; k < items.length; k++)
										value.push(items[k].textContent)

								}
								json[name] = value;
							}
							data.push(json);
						}
					}
				} catch(e) {console.log(e);}
				this._saved["wdArray"] = data;
				return this.wdArray;
			}
		},
		/**. ``''object'' arrayWD``: Transforma array de objetos em notação wd.**/
		arrayWD: {
			get: function() {
				if ("arrayWD" in this._saved)
					return new __Parser(this._saved.arrayWD);
				let data = null;
				try {
					if (this._check.array) {
						let wd = [];
						for (let object of this._data) {
							let obj = [];
							let qre = /\"/g;
							for (let name in object) {
								let value = object[name];
								let ref   = __Type(value);
								if (ref.function && value.name in window) {
									obj.push(name, "(", value.name, ")");
								} else if (ref.array) {
									let list = []
									for (let item of value) {
										let text = String(item);
										if ((/[,"]/).test(text))
											text = "'"+text.replace(qre, "''")+"'";
										list.push(text);
									}
									obj.push(name, "[", list.join(","), "]");
								} else {
									let text = String(value);
									if ((/\"/).test(text))
										text = "'"+text.replace(qre, "''")+"'";
									obj.push(name, "{",text, "}");
								}
							}
							wd.push(obj.join(""));
						}
						data = wd.join("&");
					}
				} catch(e) {console.log(e);}
				this._saved["arrayWD"] = data;
				return this.arrayWD;
			}
		},
		/**. ``''object'' fileURL``: Transforma dados em string URL.**/
		fileURL: {
			get: function() {
				if ("fileURL" in this._saved)
					return new __Parser(this._saved.fileURL);
				let data = null;
				try {
					if (this._check.instanceOf("Blob") || this._check.instanceOf("File"))
						data = URL.createObjectURL(this._data);
				} catch(e) {}
				this._saved["fileURL"] = data;
				return this.fileURL;
			}
		},
		/**. ``''object'' dataBlob``: Transforma dados em objeto Blob.**/
		dataBlob: {
			get: function() {
				if ("dataBlob" in this._saved)
					return new __Parser(this._saved.dataBlob);
				let data = null;
				try {
					const opt = {type: this._check.chars ? "text/plan" : "application/octet-stream"};
					data = new Blob([this._data], opt);
				} catch(e) {console.log(e);}
				this._saved["dataBlob"] = data;
				return this.dataBlob;
			}
		},
		/**. ``''any'' get()``: Obtem o valor da transformação ou de entrada.**/
		get: {
			value: function() {return this._data;}
		},
		//FIXME não funciona, tem que estar fora de um objeto
		/**. ``''void'' mixin(''object'' supplier, ''array'' exceptions)``: Cópia as propriedades do __objeto__ definido em ``supplier`` para o __objeto__ de entrada, exceto aquelas propriedades listadas em ``exceptions``.**/
		mixin: {
			value: function(supplier, exceptions) {
				if (!this.check.object) return;
				if (!__Type(supplier).object) return;
				if (!__Type(exceptions).array) exceptions = [];
				const names = Object.getOwnPropertyNames(supplier);
				for (let name of names) {
					if (exceptions.indexOf(name) < 0) {
						let desc = Object.getOwnPropertyDescriptor(supplier, name);
						Object.defineProperty(this.get, name, desc);
					}
				}
				return;
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
		if (!check.number) throw new TypeError("Value entered is not a valid number.");
		Object.defineProperties(this, {
			_check: {value: check},
			value:  {value: check.value},
		});
	}

	Object.defineProperties(__Number.prototype, {
		constructor: {value: __Number},
		/**. ``''array'' _primes``: Lista de números primos até 1000.**/
		_primes: {value: [
			2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,
			103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,
			199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,
			313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,
			433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,
			563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,
			673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,
			811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,
			941,947,953,967,971,977,983,991,997
		]},
		/**. ``''boolean'' finite``: Checa se o número é finito.**/
		finite: {get: function() {return this._check.finite;}},
		/**. ``''number'' valueOf()``: Retorna o valor numérico.**/
		valueOf: {value: function() {return this.value;}},
		/**. ``''number'' toString()``: Retorna o valor em forma de string.**/
		toString: {value: function() {return this._check.toString()}},
		/**. ``''number'' abs``: Retorna o valor absoluto do número.**/
		abs: {get: function() {return Math.abs(this.value);}},
		/**. ``''integer'' int``: Retorna a parte inteira do número.**/
		int: {get: function() {return Math.trunc(this.value);}},
		/**. ``''string'' type``: Retorna o tipo do número (zero, infinite, integer, decimal).**/
		type: {
			get: function() {
				const types = ["infinite", "zero", "integer", "decimal"];
				for (let i = 0; i < types.length; i++)
					if (this._check[types[i]] === true) return types[i];
				return "unknow";
			}
		},
		/**. ``''string'' random(''object'' options)``: Retorna conjuntos de números inteiros "aleatórios" conforme especificado no argumento ``options``:
		|Nome|Descrição|
		|min|Número inteiro que indica o menor valor do conjunto|
		|max|Número inteiro que indica o maior valor do conjunto|
		|len|Número inteiro que indica o tamanho do conjunto|
		|set|Número inteiro que indica a quantidade de conjuntos|**/
		random: {
			value: function(options) {
				/*-----------------------------------------------
				let a = new Uint8Array(len);
				window.crypto.getRandomValues(a)
				-----------------------------------------------*/
				if (!__Type(options).object) options = {};
				const min  = "min" in options ? Number(options.min) : 1;
				const max  = "max" in options ? Number(options.max) : 60;
				const len  = "len" in options ? Number(options.len) : 6;
				const set  = "set" in options ? Number(options.set) : 3;
				const bets = [];
				let bet, list, num;
				while (bets.length < set) {
					list = [];
					while (list.length < len) {
						num = Math.trunc(min) + Math.trunc(max*Math.random());
						if (list.indexOf(num) < 0) list.push(num);
					}
					list.sort(function (a,b) {return a < b ? -1 : 1;});
					bet = list.join("\t");
					if (bets.indexOf(bet) < 0) bets.push(bet);
				}
				return bets.join("\n");
			}
		},
		/**. ``''array'' crypto(''integer'' bit, ''integer'' len)``: Retorna uma lista de ``len`` itens contendo números inteiros de comprimento ``bit`` (8, 16 ou 32).**/
		crypto: {
			value: function(bit, len) {
				bit = Number(bit);
				len = Number(len);
				len = isFinite(len) && len >= 1 ? Math.trunc(len) : 1;
				let array;
				switch(bit) {
					case 32: array = new Uint32Array(len); break;
					case 16: array = new Uint16Array(len); break;
					default: array = new Uint8Array(len);  break;
				}
				window.crypto.getRandomValues(array);
				return array;
			}
		},
		/**. ``''float'' dec``: Retorna a parte decimal do número (zero se infinito ou inteiro).**/
		dec: {
			get: function() {
				if (this.type !== "decimal") return 0;
				if (this.abs < 1) return this.value;
				const sign = this.value < 0 ? "-0." : "0.";
				return Number(sign+String(this.value).split(".")[1]);
			}
		},
		/**. ``''number'' fixed(''integer'' length, ''boolean'' round)``: Fixa a quantidade máxima de casas decimais definidas em ``length``. O argumento ``round``, se falso, não arredondará o valor.**/
		fixed: {
			value: function(length, round) {
				if (this.type !== "decimal") return this.value;
				round  = round !== false;
				length = isFinite(length) && Number(length) >= 0  ? Math.trunc(Number(length)) : 0;
				const fixed = Number(this.value.toFixed(length));
				const base  = Math.pow(10, length);
				const cut   = Math.trunc(base*this.value)/base;
				return round ?  fixed : cut;
			}
		},
		/**. ``''array'' primes``: Retorna uma lista com os números primos até o número informado.**/
		primes: {
			get: function() {
				if (this.abs < 2) return [];
				const value = this.abs;
				/*-- Checando se o número primo já consta na lista --*/
				const last = this._primes[this._primes.length - 1];
				if (value <= last) {
					let i = 0;
					while (value >= this._primes[i]) i++;
					return this._primes.slice(0, i);
				}
				/*-- Adicionando novos números primos --*/
				for (let num = last+2; num <= value; num += 2) {
					for (let item = 0; item < this._primes.length; item++) {
						if (num % this._primes[item] === 0)
							break;
						else if (item === this._primes.length - 1)
							this._primes.push(num);
					}
				}
				return this._primes;
			}
		},
		/**. ``''boolean'' prime``: Checa se número é primo.**/
		prime: {
			get: function() {
				/*-- testar se é um inteiro maior que 1 --*/
				if (this.type !== "integer" || this.value < 2)
					return false;
				/*-- testar se ele já existe na lista --*/
				if (this.value <= this._primes[this._primes.length - 1])
					return this._primes.indexOf(this.value) >= 0;
				/*-- verificando se não é divisível por primo --*/
				for (let i = 0; i < this._primes.length; i++)
					if (this.value%this._primes[i] === 0) return false;
				/*-- capturando novos primos até a raiz do número --*/
				new __Number(this.value).primes;
				return this.prime;
			}
		},
		/**. ``''array'' factorization``: Retorna a fatorização do inteiro em números primos.**/
		factorization: {
			get: function() {
				if (this.type !== "integer") return [];
				const list = [];
				let value  = Math.abs(this.int);
				let primes = this._primes;
				let item   = 0;
				/*-- Looping sobre os primos existentes --*/
				while (value >= primes[item] && item < primes.length) {
					if (value%primes[item] === 0) {
						value = value / primes[item];
						list.push(primes[item]);
					} else {item++;}
				}
				/*-- Looping sobre os primos extraordinários --*/
				if (value > 1) {
					new __Number(value).primes;
					while (value >= primes[item] && item < primes.length) {
						if (value%primes[item] === 0) {
							value = value / primes[item];
							list.push(primes[item]);
						} else {item++;}
					}
				}
				return list;
			}
		},
		/**. ``''number'' gcd(...)``: Retorna o máximo divisor comum de números inteiros comparando o número informado com aqueles passados como argumento.**/
		gcd: {
			value: function() {
				const fact = this.factorization;
				const gcd  = [1];
				const args = [];
				/*-- Capturando a fatorização dos argumentos --*/
				for (let i = 0; i < arguments.length; i++) {
					let check = __Type(arguments[i]);
					if (check.integer) {
						let number = new __Number(check.value);
						args.push(number.factorization)
					}
				}
				/*-- Checando fatores em comum --*/
				for (let i = 0; i < fact.length; i++) {
					let found = true;
					let value = fact[i];
					for (let j = 0; j < args.length; j++) {
						let index = args[j].indexOf(value);
						if (index < 0) {
							found = false;
							break;
						} else {
							args[j][index] = null;
						}
					}
					if (found) gcd.push(value);
				}
				/*-- Calculando Máximo Divisor Comum --*/
				let value = 1;
				for (let i = 0; i < gcd.length; i++) value = value * gcd[i];
				return value;
			}
		},
		/**. ``''string'' frac``: Retorna a notação numérica em forma de fração com máximo de 6 dígitos no numerador e aproximação de até 6 casas decimais.**/
		frac: {
			get: function() {
				if (this.type !== "decimal") return this.toString();
				/*--x = a/b = a/(a+n), n = a(1/x-1)--*/
				const int = this.int;
				const dec = Math.abs(this.dec);
				const num = int !== 0 ? String(int)+" " : (this.value < 0 ? "-" : "");
				const max = 1e6; /*-- número máximo de dígitos do numerador --*/
				const err = 6;   /*-- número de casas a arrendondar na checagem  --*/
				let   dnd = 0;   /*-- dividendo --*/
				let   div = 0.5; /*-- divisor (valor não inteiro por causa do while) --*/
				while (!Number.isInteger(div) && ++dnd < max)
				  div = Number((dnd/dec).toFixed(err));
				/*-- caso não tenha encontrado o valor dentro do limite --*/
				if (!Number.isInteger(div)) {
					const str = String(dec.toFixed(err)).split(".")[1];
					dnd = str.replace(/^0+/, "");
					div = String(Math.pow(10, str.length));
					while((dnd%2 === 0 && div%2 === 0) || (dnd%5 === 0 && div%5 === 0)) {
					  let gcd = dnd%2 === 0 && div%2 === 0 ? 2 : 5;
					  dnd = dnd/gcd;
					  div = div/gcd;
					}
				}
				return num+String(dnd)+"/"+String(div);
			}
		},
		/**. ``''string'' bytes``: Retorna a notação em bytes (de ''B'' a ''YB'').**/
		bytes: {
			get: function() {
				if (!this.finite) return this.toString()+" B";
				if (this.value < 1)
				 return this.value <= 0 ? "0 B" : Math.trunc(8*this.value)+" b";
				const scale = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
				let exp = scale.length;
				let int = this.int;
				while (--exp >= 0) {
					let pow = Math.pow(1024, exp);
					if (int >= pow) return (int/pow).toFixed(2)+" "+scale[exp];
				}
				return int+" B";
			}
		},
		/**. ``''number'' exp``: Retorna o expoente do número em base 10.**/
		exp: {
			get: function() {
				if (!this.finite || this.value === 0) return !this.finite ? 0 : Infinity;
				let value = this.abs;
				let n = 0;
				while (value < 1 || value >= 10) {
					n    += value < 1 ? -1 : +1;
					value = value * (value < 1 ? 10 : 1/10);
				}
				return n;
			}
		},
		/**. ``''string'' toLocaleString(''object'' options)``: Retorna o número no formato local de acordo com as [configurações]<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat> definidas no argumento ``options``, que possui as seguintes propriedades:
|Nome|Tipo|Descrição|Obrigatório|
|type|string|Tipo de notação a ser exibida|Sim|
|value|string|Informação complementar ao tipo de notação|Depende do tipo de notação|
|display|string|Forma da exibição da notação|Não|
|group|boolean|Separador de milhar|Não|
|decimal|integer|Quantidade de casas decimais (0-20)|Não|
|integer|integer|Quantidade de números inteiros (1-21)|Não|
|digits|integer|Quantidade de números significativos (0-20)|Não|
|sign|string|Exibição do sinal (auto, always, exceptZero, negative, never)|Não|
. Os seguintes tipos são possíveis&colon;
|type|value|display|
|unit|[unidade de medida]<https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier>|short, long, narrow|
|currency|[código monetário]<https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=currency-codes>|symbol, narrowSymbol, name, code|
|compact||short, long|
|percent|||
|scientific|||
|engineering|||
|decimal|||**/
		toLocaleString: {
			value: function(options) {
				if (typeof options !== "object") options = {};
				/*-- {attr: real, name: atalho, values: opções (0 é padrão)} --*/
				const properties = {
					currency: [
						{attr: "style",           name: null,      values: ["currency"]},
						{attr: "currencyDisplay", name: "display", values: ["symbol", "narrowSymbol", "name", "code"]},
						{attr: "currency",        name: "value",   values: []}
					],
					unit: [
						{attr: "style",       name: null,      values: ["unit"]},
						{attr: "unit",        name: "value",   values: []},
						{attr: "unitDisplay", name: "display", values: ["short", "long", "narrow"]},
					],
					percent: [
						{attr: "style", name: null, values: ["percent"]},
					],
					scientific: [
						{attr: "style",    name: null, values: ["decimal"]},
						{attr: "notation", name: null, values: ["scientific"]},
					],
					engineering: [
						{attr: "style",    name: null, values: ["decimal"]},
						{attr: "notation", name: null, values: ["engineering"]},
					],
					compact: [
						{attr: "style",          name: null,      values: ["decimal"]},
						{attr: "notation",       name: null,      values: ["compact"]},
						{attr: "compactDisplay", name: "display", values: ["short", "long"]},
					],
					decimal: [ /*-- padrão --*/
						{attr: "style",    name: null, values: ["decimal"]},
					],
				};
				const property = options.type in properties ? properties[options.type] : properties.decimal;
				/*-- obtendo os dados de configuração --*/
				const config = {};
				for (let i = 0; i < property.length; i++) {
					let item = property[i];
					/*-- propriedade não configurável (name = null) --*/
					if (item.name === null) {
						config[item.attr] = item.values[0];
					}
					/*-- propriedade configurável sem valores definidos (values = []) --*/
					else if (item.values.length === 0) {
						if (item.name in options)
							config[item.attr] = String(options[item.name]);
					}
					/*-- propriedade configurável com valores definidos (values = [...]) --*/
					else {
						let index = item.values.indexOf(options[item.name]);
						config[item.attr] = item.values[index < 0 ? 0 : index];
					}
				}
				/*-- propriedades opcionais --*/
				const intList = new Array(22);
				for (let i = 0; i < intList.length; i++) intList[i] = i;

				if ("sign" in options) {
					let value = ["auto", "always", "exceptZero", "negative", "never"];
					let index = value.indexOf(options.sign);
					if (index >= 0) config.signDisplay = value[index];
				}
				if ("group" in options) {
					let value = ["auto", true, false];
					let index = value.indexOf(options.group);
					if (index >= 0) config.useGrouping = value[index];
				}
				if ("digits" in options) {
					let value = intList.slice(1,22);
					let index = value.indexOf(Number(options.digits));
					if (index >= 0) {
						config.minimumSignificantDigits = value[index];
						config.maximumSignificantDigits = value[index];
					}
				}
				if (!("minimumSignificantDigits" in config)) {
					/* Significant é prevalente sobre Fraction e Integer */
					if ("integer" in options) {
						let value = intList.slice(1,22);
						let index = value.indexOf(Number(options.integer));
						if (index >= 0) config.minimumIntegerDigits = value[index];
					}
					if ("decimal" in options) {
						let value = intList.slice(0,21);
						let index = value.indexOf(Number(options.decimal));
						if (index >= 0) {
							config.minimumFractionDigits = value[index];
							config.maximumFractionDigits = value[index];
						}
					} else if (config.style !== "currency") {
						config.maximumFractionDigits = 20;
					}
				}
				/*-- Retornando valor --*/
				try      {return this.value.toLocaleString(__LANG.list, config);}
				catch(e) {return this.value.toLocaleString(__LANG.list);}
			}
		},
	});
/*===========================================================================*/
	/**### Caracteres
	###### ``**constructor** ''object'' __String(''string'' input)``
	Construtor para manipulação de textos. O argumento ``input`` define o texto de entrada.**/
	function __String(input) {
		if (!(this instanceof __String)) return new __String(input);
		input = String(input).normalize();
		const chars = [];
		for (let i of input) chars.push(i);
		Object.defineProperties(this, {
			_value:  {value: input},
			_chars:  {value: chars},
			_parser: {value: new __Parser(input)}
		});
	}

	Object.defineProperties(__String.prototype, {
		constructor: {value: __String},
		/**. ``''string'' valueOf()``: Retorna o valor de entrada.**/
		valueOf: {value: function() {return this._value;}},
		/**. ``''string'' toString()``: Retorna o valor de entrada sem espaços extras.**/
		toString: {value: function() {return this.clear(true, false);}},
		/**. ``''string'' length``: Retorna a quantidade de caracteres.**/
		length: {get: function() {return this._chars.length;}},
		/**. ``''string'' chars``: Retorna uma cópia da lista de caracteres.**/
		chars: {get: function() {return this._chars.slice();}},
		/**. ``''string'' upper``: Retorna caixa alta.**/
		upper: {get: function() {return this.valueOf().toUpperCase();}},
		/**. ``''string'' lower``: Retorna caixa baixa.**/
		lower: {get: function() {return this.valueOf().toLowerCase();}},
		/**. ``''string'' toggle``: Inverte a caixa.**/
		toggle: {
			get: function() {
				const list = this.chars;
				let char, upper, lower;
				for (let i = 0; i < list.length; i++) {
					char  = list[i];
					upper = char.toUpperCase();
					lower = char.toLowerCase();
					list[i] = char === upper ? lower : upper;
				}
				return list.join("");
			}
		},
		/**. ``''string'' captalize``: Caixa alta na primeira letra de cada palavra apenas.**/
		capitalize: {
			get: function() {
				const list = this.chars;
				let char, space;
				for (let i = 0; i < list.length; i++) {
					char  = list[i];
					space = i === 0 || (/\s/).test(list[i-1]);
					list[i] = space ? char.toUpperCase() : char.toLowerCase()
				}
				return list.join("");
			}
		},
		/**. ``''string'' clear(''boolean'' white, ''boolean'' accent)``: Limpa espaços desnecessários ou acentos. O argumento ``white``, se diferente de falso, limpa os espaços extras e o argumento ``accent``, se diferente de falso, remove os acentos.**/
		clear: {
			value: function(white, accent) {
				let value = this.valueOf();
				if (white !== false)
					value = value.replace(/\s+/g, " ").trim();
				if (accent !== false)
					value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				return value.normalize();
			}
		},
		/**. ``''string'' mask(''string'' model)``: Checa se a string casa com o formato de máscara definido no argumento ``model`` e a retorna. Se não casar, retorna uma string vazia. A máscara é definida com os seguintes manipuladores:
		|Caractere|Descrição|
		|#|Exige um dígito.|
		|@|Exige um não dígito.|
		|*|Exige um valor qualquer.|
		|?|Separa modelos alternativos caso o anterior não case.|
		|%|Cancela o efeito do manipulador que o precede.|
		###### Exemplos
		|Modelo|Valor|Retorno|
		|##/##/####|01234567|01/23/4567|
		|(##) # ####-####?(##) ####-####|01234567890|(01) 2 3456-7890|
		|(##) # ####-####?(##) ####-####|0123456789|(01) 2345-6789|**/
		mask: {
			value: function(model) {
				/*-------------------------------------------------
					char: lista de caracteres de entrada
					c:    índice do caracter do texto de entrada
					mask: lista de caracteres da máscara
					m:    índice do caracter do modelo da máscara
					base: lista de caracteres de saída
					code: caracteres manipuladores
					ok:   condição do casamento da máscara
			  -------------------------------------------------*/
			  const char = this.valueOf().split("");
				const mask = String(model).split("");
				const code = "#@*%";
				let c = 0, m = -1, ok = true, base = [];
				/*-- looping sobre cada caracteres do modelo --*/
				while (++m < mask.length) {
					/*-- Não fazer nada quando um caracter do modelo for definido como nulo --*/
					if (mask[m] === null) {
						continue;
					}
					/*-- Checar o casamento da máscara ao fim de cada modelo --*/
					else if (mask[m] === "?") {
						/*-- máscara bateu? já checou todos os caracteres de entrada? --*/
						if (ok && c === char.length) return base.join("");
						ok = true; c = 0; base = [];
					}
					/*-- Checar caractere manipulador a ser fixado como caractere comum --*/
					else if (ok && mask[m] === "%") {
						let fixed = code.indexOf(mask[m+1]) >= 0;
						let point = fixed ? mask[m+1] : mask[m];
						base.push(point);
						if (fixed) mask[m+1] = null;
						/*-- Se o caractere do modelo tiver sido informado na entrada, avançar na checagem --*/
						c += char[c] === point ? 1 : 0;
					}
					/*-- Checar se o caractere de entrada casa com o manipulador --*/
					else if (ok && code.indexOf(mask[m]) >= 0) {
						switch(mask[m]) {
							case "#": {ok = (/^\d$/).test(char[c]); break;}
							case "@": {ok = (/^\D$/).test(char[c]); break;}
							case "*": {ok = (/^\.$/).test(char[c]); break;}
						}
						if (ok) {
							base.push(char[c]);
							c++;
						} else {
							base = [];
							c = 0;
						}
					}
					/*-- Adicionar o caractere não manipulador do modelo à saída --*/
					else if (ok) {
						base.push(mask[m]);
						/*-- Se o caractere do modelo tiver sido informado na entrada, avançar na checagem --*/
						c += char[c] === mask[m] ? 1 : 0;
					}
				}
				/*-- máscara bateu? já checou todos os caracteres de entrada? --*/
				return (ok && c === char.length) ? base.join("") : "";
			}
		},
		/**. ``''string'' dash``: Retorna uma string identificadora no formato de traços (alfabetos latinos).**/
		dash: {
			get: function() {
				let value = this.clear().replace(/\ +/g, "-").split("");
				value.forEach(function (v,i,a) {
					/* eliminar caracteres não permitidos */
					if (!(/[a-zA-Z0-9_.:\-]/).test(v)) a[i] = "";
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
				const value = this.dash.split("-");
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
		/**. ``''matrix'' csv``: Retorna uma matriz (array) a partir de uma string CSV.**/
		csv: {get: function() {return this._parser.csvTable.tableValues.matrixCSV.get();}},
		/**. ``''object'' json``: Retorna objeto JSON a partir de uma string nesse formato.**/
		json: {get: function() {return this._parser.stringJSON.get();}},
	});

/*----------------------------------------------------------------------------*/
	/**### Code
	###### ``**constructor** ''object'' __Code(''string'' input)``
	Construtor para manipulação de textos com formatação de códigos. O argumento ``input`` define o código fonte.**/
	function __Code(input) {
		if (!(this instanceof __Code)) return new __Code(input);
		input = input === undefined || input === null ? "" : String(input);
		const text   = input.trim();
		const start  = /^\<[a-z0-9.\-_:?!]+([^\>]+)?\>/i;
		const close  = /\<\/?[a-z0-9.\-_:?!]+([^\>]+)?\>$/i;
		const markup = start.test(text) && close.test(text);
		Object.defineProperties(this, {
			/**. ``''string'' input``: código de entrada.**/
			input:  {value: input},
			/**. ``''array'' chars``: lista de caracteres.**/
			chars:  {value: input.split("")},
			/**. ``''boolean'' markup``: Informar se é código de marcação tipo XML/HTML.**/
			markup: {value: markup},
			/**. ``''boolean'' html``: Informar se é código de marcação tipo HTML.**/
			html:    {value: markup && (/\<\/html(\s[^>]+)?\>$/).test(text)},
			_code:   {value: null, writable: true},
			_config: {value: {
				string:  ["\"", "\"", "\'", "\'"],
				comment: ["//", "\n", "/*", "*/"],
				word:    [],
				value:   []
			}},
		});
		return;
	}

	Object.defineProperties(__Code.prototype, {
		constructor: {value: __Code},
		/**. ``''void'' setCodeConfig(''string'' x)``: Define a codificação em "javascript" ou "CSS".**/
		setCodeConfig: {
			value: function(x) {
				const codes = {
					javascript: {
						word: "break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof new return super switch throw try typeof var void while with let static yied await async",
						value: "false null this true undefined NaN Infinity",
						comment: "// \n /* */",
						string: "' ' ` ` \" \""
					},
					css: {
						word: "[a-zA-Z0-9\\-]+\\:",
						value: "none initial \\#[0-9a-fA-F]+ [a-zA-Z]+\\([^)]+\\)",
						comment: "/* */",
						string: "' ' \" \""
					}
				};

				x = String(x).toLowerCase();
				if (x in codes)	{
					const data = {};
					for (let i in codes[x])
						data[i] = codes[x][i].split(" ");
					this.config(data);
				}
				return;
			}
		},
		/**. ``''object'' config(''object'' data)``: Define ou retorna os dados de configuração da linguagem. O argumento ``data`` possui as seguintes propriedades cujo valor deve ser um array de strings:
		|Nome|Descrição|
		|string|Pares de abertura e fechamento de strings. Ex.: ``["\"", "\"", "'", "'"]``|
		|comment|Pares de abertura e fechamento de cometários. Ex.: ``["//", "\n", "#", "\n"]``|
		|word|Palavras reservadas. Ex.: ``["let", "function", "var"]``|
		|value|Valores especiais. Ex.: ``["null", "undefined"]``|**/
		config: {
			value: function(data) {
				const cfg = {};
				for (let i in this._config) cfg[i] = this._config[i];

				if (__Type(data).object) {
					for (let i in cfg) {
						cfg[i] = [];
						if (i in data && __Type(data[i]).array)
							for (let v of data[i]) cfg[i].push(String(v));
					}
					for (let i in cfg) this._config[i] = cfg[i];
				}
				cfg.numbers = [
					"[+\\-]?\\d+\\.\\d+[eE][+\\-]?\\d+",
					"[+\\-]?\\.?\\d+[eE][+\\-]?\\d+",
					"[+\\-]?\\d+\\.\\d+",
					"[+\\-]?\\.?\\d+"
				];
				return cfg;
			}
		},
		/**. ``''array'' cages()``: Retorna a lista de caracteres de abertura e fechamento de strings e comentários ordenadas da mais específica para a menos específica. Cada item da lista é um objeto cuja abertura está representada pela propriedade ''a'', e fechamento pela ''b'' e o tipo pela ''type''.**/
		cages: {
			value: function() {
				const cage = [];
				const cfg  = this.config();
				for (let i = 0; i < cfg.string.length; i += 2)
					cage.push({type: "string", a: cfg.string[i], b: cfg.string[i+1]});
				for (let i = 0; i < cfg.comment.length; i += 2)
					cage.push({type: "comment", a: cfg.comment[i], b: cfg.comment[i+1]});
				cage.sort(function(x,y) {
					const A = x.a.length;
					const B = y.a.length;
					return A > B ? -1 : (A === B ? 0 : 1);
				});
				return cage;
			}
		},
		/**. ``''boolean'' right(''integer'' i, ''string|regexp'' search))``: Verifica se o código a partir do índice ``i``, à direita, casa com o texto definido em ``search``.**/
		right: {
		value: function(i, search) {
			const check = __Type(search);
			const delta = check.regexp ? Infinity : String(search).length;
			const value = this.input.substring(i, i+delta);
			return check.regexp ? search.test(value) : String(search) === value;
			}
		},
		/**. ``''boolean'' left(''integer'' i, ''string|regexp'' search))``: Verifica se o código a partir do índice ``i``, à esquerda, casa com o texto definido em ``search``.**/
		left: {
		value: function(i, search) {
			const check = __Type(search);
			const delta = check.regexp ? 0 : String(search).length;
			const value = this.input.substring(delta === 0 ? 0 : (i+1-delta), i+1);
			return check.regexp ? search.test(value) : String(search) === value;
			}
		},
		/**. ``''string'' markupCode()``: Retorna o código de __marcação__ codificado em HTML para renderização ou nulo.**/
		markupCode: {
			value: function() {
				if (!this.markup) return null;
				const tree  = __Tree();
				const code  = this.input.split("");
				let quotes  = null;
				let script  = null;
				let close   = false;
				let tag, val;
				tree.pattern("wdtag-?");
				tree.open("root").append("line");

				for (let i = 0; i < code.length; i++) {
					tag = tree.level;
					val = code[i];

					if (val === "\n") {
						tree.walkTo(1).add(val).append("line").backTo();
					}
					else if (tag === "root") {
						if (this.right(i, "<!--")) {
							tree.open("comment").add(val);
						} else if (this.right(i, /^\<[!?]?\w/)) {
							tree.open(this.right(i, /^\<[!?]/) ? "doc" : "tag").add(val);
						} else {
							tree.add(val);
						}
					}
					else if (tag === "comment") {
						tree.add(val);
						if (val === ">" && this.left(i, "-->"))
							tree.close();
					}
					else if (tag === "tag" || tag === "doc") {
						if (code[i-1] === "<") {
							/*-- checar se é tag script ou style --*/
							if (this.right(i, /^(script|style)(\s|\>)/i))
								script = this.right(i, /^script/i) ? "script" : "style";
							else
								script = null;
							/*-- checar se é tag de fechamento --*/
							close = (/[!?/]/).test(val);
						}
						/*-- analisar dados --*/
						if ((/\s/).test(val)) {
							tree.open("attribute").add(val);
						} else if (this.left(i, /[!?/]\>$/)) {
								tree.add(val).close();
						} else if (val === ">") {
							if (close === true)
								tree.add(val).close();
							else if (script === null)
								tree.add(val).open("content");
							else
								tree.add(val).open(script);
						} else {
							tree.add(val);
						}
					}
					else if (tag === "content") {
						if (this.right(i, "<!--")) {
							tree.open("comment").add(val);
						} else if (this.right(i, /^\<\w/)) {
							tree.open("tag").add(val);
						} else if (this.right(i, /^\<\/\w/)) {
							tree.close().add(val);
						} else {
							tree.add(val);
						}
					}
					else if (tag === "attribute") {
						if (val === "=") {
							tree.add(val).open("value");
						} else if (this.right(i, /^[!?/]?\>/)) {
							tree.close();
							i--;
						} else {
							tree.add(val);
						}
					}
					else if (tag === "value") {
						if (this.left(i, /\=\s+$/)) {
							tree.add(val)
						} else if (quotes === null && (/\s/).test(val)) {
							tree.close().add(val);
						} else if ((/["'`]/).test(val) && quotes === null) {
							quotes = val;
							tree.add(val);
						} else if (quotes === val && code[i-1] !== "\\") {
							quotes = null;
							tree.add(val).close();
						} else {
							tree.add(val);
						}
					}
					else if (tag === "script" || tag === "style") {
						if ((/['"`]/).test(val)) {
							quotes = val;
							tree.open("cages").add(val);
						} else if (this.right(i, "/*")) {
							quotes = "*/";
							tree.open("cages").add(val);
						} else if (tag === "script" && this.right(i, "//")) {
							quotes = "\n";
							tree.open("cages").add(val);
						} else if (this.right(i, /^\<\/(script|style)/i)) {
							tree.close();
							i--;
						} else {
							tree.add(val);
						}
					}
					else if (tag === "cages") {
						if (quotes === "\n" && this.right(i+1, quotes)) {
							quotes = null;
							tree.add(val).close();
						} else if (this.left(i, quotes)) {
							quotes = null;
							tree.add(val).close();
						} else {
							tree.add(val);
						}
					}
					else { /*-- Valores diversos --*/
						tree.add(val);
					}
				}
				tree.finish();

				/*-- Transformando código em HTML --*/
				const elem = document.createElement("DIV");
				elem.innerHTML = tree.valueOf();

				/*-- Acertando script e style em caso de HTML --*/
				if (this.html) {
					const web = {
						javascript: elem.querySelectorAll("wdtag-script"),
						css:        elem.querySelectorAll("wdtag-style")
					}
					const reline = /^\<\/?wdtag\-line\>/i;
					let temp, data, line, target;

					for (let lang in web) {
						target = web[lang];
						for (let i = 0; i < target.length; i++) {
							line = reline.test(target[i].innerHTML);
							temp = new __Code(target[i].innerText);
							temp.setCodeConfig(lang);
							target[i].innerHTML = temp.toString();
							if (!line && target[i].querySelector("wdtag-line") !== null)
								target[i].querySelector("wdtag-line").remove();
						}
					}
				}
				return elem.innerHTML;
			}
		},
		/**. ``''string'' linearCode()``: Retorna o código codificado em HTML para renderização ou nulo.**/
		linearCode: {
			value: function() {
				if (this.markup) return null;
				const tree = __Tree();
				const code = this.input.split("");
				const cage = this.cages();
				let  quote = null;
				let tag, val, scope, close;

				tree.pattern("wdtag-?");
				tree.open("root").append("line").open("content");

				for (let i = 0; i < code.length; i++) {
					tag = tree.level;
					val = code[i];

					if (tag === "content") {
						scope = null;
						/*-- checando abertura de comentário ou texto --*/
						for (let x of cage) {
							if (scope === null && this.right(i, x.a))
								scope = x;
						}
						if (scope !== null) {
							quote = scope.b;
							tree.close().open(scope.type);
						}
						if (val === "\n")
							tree.walkTo(1).add(val).append("line").backTo();
						else
							tree.add(val);
					}
					else if (tag === "comment" || tag === "string") {
						close = this.left(i, quote);
						/*-- checando fechamento de comentário ou texto --*/
						if (close && code[i-1] !== "\\") {
							quote === null;
							tree.add(val === "\n" ? "" : val).close().open("content");
							if (val === "\n")
								tree.walkTo(1).add(val).append("line").backTo();
						} else {
							if (val === "\n")
								tree.walkTo(1).add(val).append("line").backTo();
							else
								tree.add(val);
						}
					}
					else {
						tree.add(v);
					}
				}
				tree.finish();

				/*-- transformando em HTML --*/
				const elem   = document.createElement("DIV");
				elem.innerHTML = tree.valueOf();

				/*-- Complementando o conteúdo --*/
				let re1, re2, re3, re4, inner;
				const query  = elem.querySelectorAll("wdtag-content");
				const config = this.config();
				const words  = "([()\\[\\]{},;]|\\s)";
				const value  = "([()\\[\\]{},;!=|&+\\-%/*^?:]|\\s|\\&gt\\;|\\&lt\\;)";

				for (let i = 0; i < query.length; i++) {
					inner = query[i].innerText;
					/*-- sinais maior/menor --*/
					inner = inner.replace(/\</gm, "&lt;");
					inner = inner.replace(/\>/gm, "&gt;");
					/*-- palavras reservadas --*/
					for (let j = 0; j < config.word.length; j++) {
						val = "("+config.word[j]+")";
						re1 = new RegExp(  "^"+val+"$"  , "g");
						re2 = new RegExp(  "^"+val+words, "g");
						re3 = new RegExp(words+val+"$"  , "g");
						re4 = new RegExp(words+val+words, "g");
						inner = inner.replace(re1, "<wdtag-word>$1</wdtag-word>");
						inner = inner.replace(re2, "<wdtag-word>$1</wdtag-word>$2");
						inner = inner.replace(re3, "$1<wdtag-word>$2</wdtag-word>");
						inner = inner.replace(re4, "$1<wdtag-word>$2</wdtag-word>$3");
					}
					/*-- valores --*/
					for (let j = 0; j < config.value.length; j++) {
						val = "("+config.value[j]+")";
						re1 = new RegExp(  "^"+val+"$"  , "g");
						re2 = new RegExp(  "^"+val+value, "g");
						re3 = new RegExp(value+val+"$"  , "g");
						re4 = new RegExp(value+val+value, "g");
						inner = inner.replace(re1, "<wdtag-value>$1</wdtag-value>");
						inner = inner.replace(re2, "<wdtag-value>$1</wdtag-value>$2");
						inner = inner.replace(re3, "$1<wdtag-value>$2</wdtag-value>");
						inner = inner.replace(re4, "$1<wdtag-value>$2</wdtag-value>$3");
					}
					/*-- Números --*/
					for (let j = 0; j < config.numbers.length; j++) {
						val = "("+config.numbers[j]+")";
						re1 = new RegExp(  "^"+val+"$"  , "g");
						re2 = new RegExp(  "^"+val+value, "g");
						re3 = new RegExp(value+val+"$"  , "g");
						re4 = new RegExp(value+val+value, "g");
						inner = inner.replace(re1, "<wdtag-value>$1</wdtag-value>");
						inner = inner.replace(re1, "<wdtag-value>$1</wdtag-value>");
						inner = inner.replace(re2, "<wdtag-value>$1</wdtag-value>$2");
						inner = inner.replace(re2, "<wdtag-value>$1</wdtag-value>$2");
						inner = inner.replace(re3, "$1<wdtag-value>$2</wdtag-value>");
						inner = inner.replace(re3, "$1<wdtag-value>$2</wdtag-value>");
						inner = inner.replace(re4, "$1<wdtag-value>$2</wdtag-value>$3");
						inner = inner.replace(re4, "$1<wdtag-value>$2</wdtag-value>$3");
					}
					/*-- escopos --*/
					inner = inner.replace(/([\[\]{}()])/gm, "<wdtag-tick>$1</wdtag-tick>");
					/*-- devolver valor --*/
					query[i].innerHTML = inner;
				}
				return elem.innerHTML;
			}
		},
		/**. ``''node'' valueOf()``: Retorna um elemento DIV com a codificação renderizada.**/
		valueOf: {
			value: function() {
				const elem = document.createElement("DIV");
				elem.innerHTML = this.toString();
				return elem;
			}
		},
		/**. ``''string'' toString()``: Retorna o código em codificação HTML.**/
		toString: {
			value: function() {
				return this.markup ? this.markupCode() : this.linearCode();
			}
		},
	});

/*===========================================================================*/
	/**### Data e Tempo
	#### Ano
	###### ``**constructor** ''object'' __Year(''integer'' year)``
	Construtor para resgate de informações sobre o ano (``year``).**/
	function __Year(year) {
		if (!(this instanceof __Year)) return new __Year(year);
		const check = __Type(year);
		if (!check.integer) throw new RangeError("Invalid year value.");
		Object.defineProperties(this, {
			/**. ``''integer'' year``: Retorna o ano.**/
			year: {value: check.value},
		});
	}

	Object.defineProperties(__Year.prototype, {
		constructor: {value: __Year},
		/**. ``''string'' YYYY``: Retorna uma string no formato YYYY.**/
		YYYY: {
			get: function() {
 				const y   = Math.abs(this.year);
				const len = (y < 10 ? 3 : (y < 100 ? 2 : (y < 1000 ? 1 : 0)));
				return (this.year < 0 ? "-" : "") + ("0").repeat(len) + String(y);
			}
		},
		/**. ``''string'' YY``: Retorna uma string no formato YY (dois últimos dígitos do ano).**/
		YY: {
			get: function() {
				return this.YYYY.replace(/(\-?)\d\d(\d\d)/, "$1$2");
			}
		},
		/**. ``''integer'' daysElapsedYear``: Retorna os dias decorridos de 0000-01-01T00:00:00 (valor 0) até o primeiro dia do ano.**/
		daysElapsedYear: {
			get: function() {
				let   days = this.year > 0 ? 365 : 0;
				let   back = this.year > 0 ? (this.leap ? 365 : 364) : 0;
				const y365 = 365*this.year;
				const y400 = Math.trunc(this.year/400);
				const y004 = Math.trunc(this.year/4);
				const y100 = Math.trunc(this.year/100);
				days += y365 + y004 - y100 + y400;
				return days - back;
			}
		},
		/**. ``''boolean'' leap``: Informa se o ano é bissexto.**/
		leap: {
			get: function() {
				const y = Math.abs(this.year);
				return (y%400 === 0 || (y%4 === 0 && y%100 !== 0));
			}
		},

	});

/*----------------------------------------------------------------------------*/
	/**#### Mês
	###### ``**constructor** ''object'' __Month(''integer'' year, ''integer'' month)``
	Construtor para resgate de informações sobre meses a partir da informação do ano (``year``) e do mês (1-12) (``month``). Herda propriedades do objeto __Year.**/
	function __Month(year, month) {
		if (!(this instanceof __Month)) return new __Month(year, month);
		__Year.call(this, year);
		const check = __Type(month);
		if (!check.integer || check < 1 || check > 12)
			throw RangeError("Invalid month value.", {cause: "1 > month > 12"});
		const data = __LANG.searchByIndex("months", check.value);
		Object.defineProperties(this, {
			/**. ``''integer'' month``: Registra o mês (1-12).**/
			month: {value: check.value},
			/**. ``''string'' MMMM``: Retorna o nome do mês.**/
			MMMM:  {value: data.long},
			/**. ``''string'' MMM``: Retorna o nome do mês abreviado.**/
			MMM:   {value: data.short},
			/**. ``''string'' MM``: Retorna o mês com dois dígitos.**/
			MM:    {value: data.value},
		});
	}

	__Month.prototype = Object.create(__Year.prototype, {
		constructor: {value: __Month},
		/**. ``''string'' YYYYMM``: Retorna uma string no formato YYYY-MM.**/
		YYYYMM: {get: function() {return [this.YYYY, this.MM].join("-");}},
		/**. ``''integer'' daysElapsedMonth``: Retorna os dias decorridos de 0000-01-01T00:00:00 (valor 0) até o primeiro dia do mês.**/
		daysElapsedMonth: {
			get: function() {
				const year = this.daysElapsedYear;
				const days = this.firstDayMonthYear;
				return year + days - 1;
			}
		},
		/**. ``''integer'' width``: Retorna a quantidade de dias do mês.**/
		width: {
			get: function() {
				const feb  = this.leap ? 29 : 28;
				const days = [null,31,feb,31,30,31,30,31,31,30,31,30,31];
				return days[this.month];
			}
		},
		/**. ``''integer'' firstDayMonthYear``: Retorna o dia do ano em que o mês inicia.**/
		firstDayMonthYear: {
			get: function() {
				const gap  = this.month > 2 && this.leap ? 1 : 0;
				const days = [null,1,32,60,91,121,152,182,213,244,274,305,335];
				return days[this.month] + gap;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#### Dia
	###### ``**constructor** ''object'' __Day(''integer'' year, ''integer'' month, ''integer'' day)``
	Construtor para resgate de informações sobre dias a partir da informação do ano (``year``), mês (1-12) (``month``) e dia (1-31) (``day``). Herda propriedades do objeto __Month.**/
	function __Day(year, month, day) {
		if (!(this instanceof __Day)) return new __Day(year, month, day);
		__Month.call(this, year, month);
		const check = __Type(day);
		if (!check.integer || check < 1 || check > this.width)
			throw RangeError("Invalid day value.", {cause: "1 > day > " + String(this.width)});
		Object.defineProperties(this, {
			/**. ``''integer'' day``: Registra o dia (1-31).**/
			day: {value: check.value}
		});
	}

	__Day.prototype = Object.create(__Month.prototype, {
		constructor: {value: __Day},
		/**. ``''string'' DD``: Retorna o dia com dois dígitos.**/
		DD: {get: function() {return (this.day < 10 ? "0" : "") + String(this.day);}},
		/**. ``''string'' YYYYMMDD``: Retorna a data no formato YYYY-MM-DD.**/
		YYYYMMDD: {get: function() {return [this.YYYYMM, this.DD].join("-");}},
		/**. ``''integer'' daysElapsed``: Retorna os dias decorridos de 0000-01-01T00:00:00 (valor 0) até o dia.**/
		daysElapsed: {
			get: function() {
				const year = this.daysElapsedYear;
				const days = this.days;
				return year + days - 1;
			}
		},
		/**. ``''integer'' days``: Retorna o dia do ano.**/
		days: {
			get: function() {
				return this.firstDayMonthYear + this.day - 1;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#### Dia da Semana
	###### ``**constructor** ''object'' __WeekDay(''integer'' year, ''integer'' month, ''integer'' day)``
	Construtor para resgate de informações sobre a semana a partir da informação do ano (``year``), mês (1-12) (``month``) e dia (1-31) (``day``).  Herda propriedades do objeto __Day.**/
	function __WeekDay(year, month, day) {
		if (!(this instanceof __WeekDay)) return new __WeekDay(year, month, day);
		__Day.call(this, year, month, day);
		const sunday  = new __Day(2023,1,1).daysElapsed;
		const today   = this.daysElapsed;
		const index   = Math.abs(today - sunday)%7;
		const weekDay =  (today > sunday ? index : (7 - index)%7) + 1;
		const data    = __LANG.searchByIndex("days", weekDay);
		Object.defineProperties(this, {
			/**. ``''integer'' weekDay``: Registra o dia da semana, de domingo a sábado (1-7).**/
			weekDay: {value: weekDay},
			/**. ``''string'' DDD``: Retorna o dia da semana abreviado.**/
			DDD:     {value: data.short},
			/**. ``''string'' DDDD``: Retorna o dia da semana.**/
			DDDD:    {value: data.long},
		});
	}

	__WeekDay.prototype = Object.create(__Day.prototype, {
		constructor: {value: __WeekDay},
	});

/*----------------------------------------------------------------------------*/
	/**#### Semana do Ano
	###### ``**constructor** ''object'' __Week(''integer'' year, ''integer'' month, ''integer'' day)``
	Construtor para resgate de informações sobre a semana do ano a partir da informação do ano (``year``), mês (1-12) (``month``) e dia (1-31) (``day``).  Herda propriedades do objeto __WeekDay.**/
	function __Week(year, month, day) {
		if (!(this instanceof __Week)) return new __Week(year, month, day);
		__WeekDay.call(this, year, month, day);
		const week = this.weekDay - 1;
		const days = (this.days - 1)%7;
		const ref  = week - days;
		const fwd  = 1 + ref + (ref < 0 ? 7 : 0);
		const mfw  = this.leap && fwd === 4 || fwd === 5 ? 53 : 52;
		Object.defineProperties(this, {
			/**. ``''integer'' firstWeekDay``: Registra o primeiro dia da semana do ano (1-7).**/
			firstWeekDay: {value: fwd},
			/**. ``''integer'' maxFormWeek``: Registra o número máximo de semanas no ano para formulário HTML (1-53).**/
			maxFormWeek:  {value: mfw}
		});
	}

	__Week.prototype = Object.create(__WeekDay.prototype, {
		constructor: {value: __Week},
		/**. ``''string'' WW``: Retorna a semana com dois dígitos.**/
		WW: {get: function() {return (this.week < 10 ? "0" : "") + String(this.week);}},
		/**. ``''string'' YYYYWW``: Retorna a semana no formato YYYY-Www.**/
		YYYYWW: {get: function() {return [this.YYYY,this.WW].join("-W");}},
		/**. ``''integer'' week``: Retorna a semana do ano (1-54) desde o primeiro dia do ano e início no domingo.**/
		week: {
			get: function() {
				const sun = ([null,1,0,-1,-2,-3,-4,-5])[this.firstWeekDay];
				const end = this.days;
				return Math.trunc((end - sun)/7) + 1;
			}
		},
		/**. ``''integer'' fweek``: Retorna a semana do ano (1-53) conforme formulário HTML. ()[https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#week_strings]**/
		fweek: {
			get: function() {
				const day  = this.firstWeekDay;
				const mon  = ([null,2,1,0,-1,-2,4,3])[day];
				const end  = this.days;
				const len  = Math.trunc((end - mon)/7) + 1;
				const max  = [null,1,null,null,null,null,3,2];
				const back = (day > 5 || day === 1) && end <= max[day];
				return back ? -(new __Week(this.year-1, 12, 31).maxFormWeek) : len;
			}
		},
		/**. ``''integer'' work``: Retorna a quantidade de dias úteis decorridos até o dia.**/
		work: {
			get: function() {
				const sun  = ([null,1,7,6,5,4,3,2])[this.firstWeekDay];
				const sat  = ([null,7,6,5,4,3,2,1])[this.firstWeekDay];
				const end  = this.days;
				const dsun = this.day < sun ? 0 : (Math.trunc((end - sun)/7) + 1);
				const dsat = this.day < sat ? 0 : (Math.trunc((end - sat)/7) + 1);
				return end - (dsun + dsat);
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#### Tempo
	###### ``**constructor** ''object'' __Time(''integer'' year, ''integer'' month, ''integer'' day, ''integer'' hour, ''integer'' minute, ''finite'' second)``
	Construtor para resgate de informações sobre a hora a partir da informação do ano (``year``), mês (1-12) (``month``), dia (1-31) (``day``), hora (0-24) (``hour``), minuto (0-59) (``minute``) e segundo (0-59.999) (``second``).  Herda propriedades do objeto __Week.**/

	function __Time(year, month, day, hour, minute, second) {
		if (!(this instanceof __Time)) return new __Time(year, month, day, hour, minute, second);
		__Week.call(this, year, month, day);
		const checkH = new __Type(hour);
		const checkM = new __Type(minute);
		const checkS = new __Type(second);
		if (!checkH.integer || checkH > 24 || checkH < 0)
			throw RangeError("Invalid hour value.", {cause: "0 > hour > 24"});
		if (!checkM.integer || checkM > 59 || checkM < 0)
			throw RangeError("Invalid minute value.", {cause: "0 > minute > 59"});
		if (!checkS.finite || checkS >= 60 || checkS < 0)
			throw RangeError("Invalid second value.", {cause: "0 > minute >= 60"});
		Object.defineProperties(this, {
			/**. ``''integer'' hour``: Registra a hora (0-23).**/
			hour:   {value: checkH.value % 24},
			/**. ``''integer'' minute``: Registra o minuot (0-59).**/
			minute: {value: checkM.value},
			/**. ``''number'' second``: Registra o segundo (0-59.999).**/
			second: {value: checkS.value}
		});
	}

	__Time.prototype = Object.create(__Week.prototype, {
		constructor: {value: __Time},
		toString: {value: function() {return [this.YYYYMMDD,this.hhmmss].join("T");}},
		valueOf:  {value: function() {return this.timeElapsed;}},
		/**. ``''string'' hh``: Retorna a hora com dois dígitos.**/
		hh: {get: function() {return (this.hour < 10 ? "0" : "") + String(this.hour)}},
		/**. ``''string'' mm``: Retorna o minuto com dois dígitos.**/
		mm: {get: function() {return (this.minute < 10 ? "0" : "") + String(this.minute)}},
		/**. ``''string'' ss``: Retorna o segundo com dois dígitos e casa centesimais.**/
		ss: {get: function() {return (this.second < 10 ? "0" : "") + (this.second).toFixed(3)}},
		/**. ``''string'' hhmmss``: Retorna a hora no formato hh:mm:ss.**/
		hhmmss: {get: function() {return [this.hh,this.mm,this.ss].join(":")}},
		/**. ``''number'' time``: Retorna a quantidade total de segundos.**/
		time: {get: function() {return 3600*this.hour + 60*this.minute + this.second;}},
		/**. ``''integer'' timeElapsed``: Retorna os segundos decorridos de 0000-01-01T00:00:00 (valor 0) até a hora.**/
		timeElapsed: {get: function() {return 24*3600*this.daysElapsed + this.time;}},
		/**. ``''string'' meridiem``: Retorna AM ou PM de acordo com a hora.**/
		meridiem: {get: function() {return this.hour < 12 ? "AM" : "PM";}},
		/**. ``''integer'' h12``: Retorna a hora no formato de 12 horas (AM/PM).**/
		h12: {
			get: function() {
				return this.hour === 0 ? 12 : this.hour - (this.hour < 13 ? 0 : 12);
			}
		},
		/**. ``''object'' next()``: Retorna uma instância do objeto para o dia seguinte.**/
		next: {
			value: function() {
				const d = this.day === this.width ? 1 : (this.day + 1);
				const m = this.day === this.width ? (this.month + 1) : this.month;
				const y = m > 12 ?  (this.year + 1) : this.year;
				return new __Time(y, (m > 12 ? 1 : m), d, this.hour, this.minute, this.second);
			}
		},
		/**. ``''object'' walk(''integer'' value)``: Retorna uma instância do objeto caminhando o valor de segundos definidos no argumento.**/
		walk: {
			value: function(value) {
				const check = new __Type(value);
				if (!check.finite) value = 0;
				const time = this.timeElapsed;
				return this.constructor.toTimeObject(time + value);
			}
		},
		/** . ``''object'' codes``: Retorna um objeto contendo propriedades temporais abreviadas.**/
		codes: {
			get: function() {
				return {
		 			Y:   String(this.year),   YY: this.YY, YYYY: this.YYYY,
		 			M:   String(this.month),  MM: this.MM, MMM:  this.MMM, MMMM: this.MMMM,
					D:   String(this.day),    DD: this.DD, DDD:  this.DDD, DDDD: this.DDDD,
					w:   String(this.week),   ww: this.WW,
		 			h:   String(this.hour),   hh: this.hh,
		 			m:   String(this.month),  mm: this.mm,
		 			s:   String(this.second), ss: this.ss,
		 			h12: String(this.h12),    ampm: this.meridiem
				};
			}
		},
	});

	Object.defineProperties(__Time, {
		/**##### Tempo:return [this.YYYYMMDD,this.hhmmss].join("T") Métodos e Propriedades Estáticos
		. ``''array'' daysToYear(''integer'' value)``: Retorna o ano (item 0) a partir do número de dias (``value``).**/
		daysToYear: {
			value: function(value) {
				const check = new __Type(value);
				if (!check.integer)
					throw TypeError("Invalid date value", {cause: "Value must be an integer."});
				value = check.value;
				/*-- Ano zero --*/
				if (value >= 0 && value <= 365) return [0];
				/*-- Correção para contagem dos anos diferentes de zero --*/
				let   year = 0;
				let   days = value > 0 ? value - 365 : value;
				/*-- dias por período --*/
				const d001 = 365;
				const d004 =  4*d001 + 1;
				const d100 = 25*d004 - 1;
				const d400 =  4*d100 + 1;
				/*-- anos por período (progressão aritmética) --*/
				const y400 = Math.trunc(days/d400);
				days -= y400 * d400;
				const y100 = Math.trunc(days/d100);
				days -= y100 * d100;
				const y004 = Math.trunc(days/d004);
				days -= y004 * d004;
				const y001 = Math.trunc(days/d001);
				days -= y001 * d001;
				const rest = days === 0 ? 0 : (value < 0 ? -1 : (value > 365 ? +1 : 0));
				year += 400*y400 + 100*y100 + 4*y004 + y001 + rest;
				return [year];
			}
		},
		/**. ``''array'' daysToMonth(''integer'' value)``: Retorna o ano (item 0) e o mês (item 1) a partir do número de dias (``value``).**/
		daysToMonth: {
			value: function(value) {
				const year = this.daysToYear(value)[0];
				const leap = year%400 === 0 || (year%4 === 0 && year%100 !== 0);
				const d365 = [31,59,90,120,151,181,212,243,273,304,334,365];
				const d366 = [31,60,91,121,152,182,213,244,274,305,335,366];
				const days = leap ? d366 : d365;
				const data = new __Year(year);
				const diff = value - data.daysElapsedYear;
				for (let i = 0; i < days.length; i++)
					if (diff < days[i]) return [year, i+1];
				/*-- precaução em caso de falha --*/
				let help = new __Month(year,12);
				while (value < help.daysElapsedMonth)
					help = new __Month(year, help.month-1);
				return [year, help.month]
			}
		},
		/**. ``''array'' daysToDate(''integer'' value)``: Retorna o ano (item 0), o mês (item 1) e o dia (item 2) a partir do número de dias (``value``).**/
		daysToDate: {
			value: function(value) {
				const data = this.daysToMonth(value);
				const date = new __Month(data[0], data[1]);
				const day  = value - date.daysElapsedMonth + 1;
				return [date.year, date.month, day];
			}
		},
		/**. ``''array'' secondsToTime(''number'' value)``: Retorna a hora (item 0), o minuto (item 1) e o segundo (item 2) a partir do número de segundos (``value``).**/
		secondsToTime: {
			value: function(value) {
				const check = new __Type(value);
				if (!check.finite)
					throw TypeError("Invalid time value", {cause: "Value must be a finite number."});
				const day    = 24*3600;
				const rest   = check.value%day;
				const time   = rest + (rest < 0 ? day : 0);
				const hour   = Math.trunc(time/3600);
				const minute = Math.trunc((time - 3600*hour)/60);
				const second = time - 60*minute - 3600*hour;
				return [hour, minute, Number(second.toFixed(3))];
			}
		},
		/**. ``''array'' seconds(''integer'' value)``: Retorna o ano (item 0), o mês (item 1), o dia (item 2), a hora (item 3), o minuto (item 4) e o segundo (item 5) a partir do número de segundos (``value``).**/
		secondsToDate: {
			value: function(value) {
				const day  = 24*3600;
				const sec  = value%day;
				const days = Math.trunc((value - sec)/day);
				const date = this.daysToDate(days + (value < 0 && sec !== 0 ? -1 : 0)	);
				const time = this.secondsToTime(sec);
				return [date[0],date[1],date[2],time[0],time[1],time[2]];
			}
		},
		/**. ``''object'' toTimeObject(''integer'' value)``: Retorna um objeto __Time a partir do número de segundos (``value``).**/
		toTimeObject: {
			value: function(value) {
				const data = this.secondsToDate(value);
				return new __Time(data[0],data[1],data[2],data[3],data[4],data[5]);
			}
		},
		/**. ``''async'' sequentialityTest(''integer'' start, ''integer'' stop, ''integer'' sec)``: Testa a sequencialidade da data do ano ``start`` até o ano ``stop`` (opcional) no tempo fixo de segundos ``sec`` (opcional).**/
		sequentialityTest: {
			value: async function(start, stop, sec) {
				let clock = [0,0,0];
				if (stop === undefined) stop  = start;
				if (sec  !== undefined) clock = this.secondsToTime(sec);
				let zero = new Date().valueOf();
				let next = new __Time(start,1,1,clock[0],clock[1],clock[2]);
				let days = next.daysElapsed;
				let time = days;
				let day  = next.weekDay;
				let week = next.week;
				let year = next.year;
				let gap  = 0;
				let input, output;
				while (next.year <= stop) {
					input  = next.toString();
					output = __Time.toTimeObject(next.timeElapsed);
					next   = next.next();
					if (input !== output.toString())
						throw ReferenceError("toDateTime", {cause: input + " != " + output});
					if (next.daysElapsed !== (days + 1))
						throw ReferenceError("daysElapsed", {cause: next.YYYYMMDD})
					if (next.weekDay !== (day === 7 ? 1 : day+1))
						throw ReferenceError("weekDay", {cause: next.YYYYMMDD})
					if (next.year === year) {
						if (next.weekDay === 1 && next.week !== (week + 1))
							throw ReferenceError("week", {cause: next.YYYYMMDD})
					}
					days = next.daysElapsed;
					day  = next.weekDay;
					week = next.week;
					year = next.year;
					gap++;
				}
				if (gap !== (next.daysElapsed - time))
					throw ReferenceError("timeElapsed", {cause: gap})

				return {start: start, stop: stop, time: ((new Date()).valueOf() - zero)/1000, days: gap};
			}
		}
	});

/*----------------------------------------------------------------------------*/
	/**###### ``**constructor** ''object'' __DateTime(''any'' input)``
	Construtor para manipulação de data/tempo. O atributo ``input`` aceita valores do tipo:
	- Data, tempo ou data/tempo nos parâmetros da biblioteca;
	- Numérico correspondendo ao número de segundos desde 0000-01-01T00:00:00.0000 (segundo 0);
	- Objeto contendo os valores das propriedades de data/tempo (``year``,``month``, ``day``, ``hour``, ``minute``, ``second``) que, se não informados, assumirão zeros; e
	- Caso contrário, assumirá o valor de data e tempo atuais.**/
	function __DateTime(input) {
		if (!(this instanceof __DateTime)) return new __DateTime(input);
		const check = __Type(input);
		const test  = check._test;
		const data  = {year: 0, month: 1, day: 1, hour: 0, minute: 0, second: 0, type: "default"};
		if (check.time) {
			const base = check.value.split(":");
			const list = {hour: base[0], minute: base[1], second: base[2], type: "time"};
			for (let i in data)
				data[i] = i in list ? list[i] : (i === "month" || i === "day" ? 1 : 0);
		}
		else if (check.date) {
			const minus = check.value[0] === "-";
			const base  = check.value.replace(/^\-/, "").split("-");
			base[0]     = (minus ? "-" : "") + base[0];
			const list  = {year: base[0], month: base[1], day: base[2], type: "date"};
			for (let i in data)
				data[i] = i in list ? list[i] : 0;
		}
		else if (check.datetime) {
			const base  = check.value.split("T");
			const minus = base[0][0] === "-";
			const date  = base[0].replace(/^\-/, "").split("-");
			const time  = base[1].split(":");
			date[0] = (minus ? "-" : "") + date[0];
			const list = {
				year: date[0], month:  date[1], day:    date[2],
				hour: time[0], minute: time[1], second: time[2],
				type: "datetime"
			};
			for (let i in data) data[i] = list[i];
		}
		else if (check.finite) {
			const base  = __Time.toTimeObject(check.value);
			for (let i in data) data[i] = base[i];
			data.type  = "number";
		}
		else if (check.object) {
			for (let i in data)
				if (i in input) data[i] = input[i];
			data.type  = "object";
		}
		else if (test.group === "month") {
			const config = {
				MMYYYY:   {m: "$1", y: "$2"},
				YYYYMM:   {m: "$2", y: "$1"},
				MMMMYYYY: {m: "$1", y: "$2"}
			};
			const regexp = test.regexp;
			const format = test.subgroup;
			const list   = {day: 1, type: "month",
				month: test.value.replace(regexp, config[format].m),
				year:  test.value.replace(regexp, config[format].y),
			};
			if (format === "MMMMYYYY")
				list.month = __LANG.searchByName("months", list.month).index;
			for (let i in data)
				data[i] = i in list ? list[i] : 0;
		}
		else if (test.group === "week") {
			const config = {
				WWYYYY:   {w: "$1", y: "$2"},
				YYYYWW:   {w: "$2", y: "$1"},
			};
			const regexp = test.regexp;
			const format = test.subgroup;
			const   week = Number(test.value.replace(regexp, config[format].w));
			const   year = Number(test.value.replace(regexp, config[format].y));
			let     date = new __Time(year,12,31,0,0,0);
			if (week <= date.week) {
				if (date.weekDay !== 1)
					date = date.walk(24*3600*(1 - date.weekDay));
				while (week !== date.week && date.week > 1)
					date = date.walk(-7*24*3600);
				const form = week <= date.maxFormWeek;
				const list = {
					year:  year,
					type:  form ? "fweek" : "week",
					month: date.week === 1 ? 1 : date.month,
					day:   date.week === 1 ? 1 : date.day
				}
				for (let i in data)
					data[i] = i in list ? list[i] : 0;
			}
		}
		else {
			const now = new Date();
			data.year   = now.getFullYear();
			data.month  = now.getMonth() + 1;
			data.day    = now.getDate();
			data.hour   = now.getHours();
			data.minute = now.getMinutes();
			data.second = now.getSeconds() + now.getMilliseconds()/1000;
			data.type   = "now";
		}
		let main, error;
		try {
			main  = new __Time(data.year, data.month,  data.day, data.hour, data.minute, data.second);
			error = "";
		} catch(e) {
			main  = new __DateTime();
			error = e.message;
			data.type  = "error";
		}
		Object.defineProperties(this, {
			_max:  {value: null, writable: true},
			/**. ``''object'' main``: Registra o objeto __Time auxiliar.**/
			main:  {value: main, writable: true},
			/**. ``''string'' error``: Registra o tipo de erro encontrado ou vazio.**/
			error: {value: error},
			/**. ``''string'' type``: Registra o tipo de entrada.**/
			type:  {value: data.type}
		});
	}

	Object.defineProperties(__DateTime.prototype, {
		constructor: {value: __DateTime},
		/**. ``''object'' toDateObject``: Retorna um objeto nativo Date com o tempo fixado no ano 2000.**/
		toDateObject: {
			get: function() {
				const sec  = Math.trunc(this.second);
				const mill = 1000*Number("0."+this.main.ss.split(".")[1]);
				const utc  = Date.UTC(2000, this.month-1, this.day, this.hour, this.minute, sec, mill)
				const date = new Date(utc);
				return date;
			}
		},
		/**. ``''number'' valueOf()``: Retorna os segundos desde 0000-01-01T00:00:00.000.**/
		valueOf: {value: function() {return this.main.timeElapsed;}},
		/**. ``''integer'' valueOfDate()``: Retorna os dias desde 0000-01-01.**/
		valueOfDate: {value: function() {return this.main.daysElapsed;}},
		/**. ``''number'' valueOfTime()``: Retorna os segundos desde 00:00:00.000.**/
		valueOfTime: {value: function() {return this.main.time;}},
		/**. ``''number'' valueOfDays()``: Retorna os dias desde 0000-01-01 com o tempo como elemento decimal.**/
		valueOfDays: {value: function() {return this.valueOfDate()+this.valueOfTime()/(24*3600);}},
		/**. ``''string'' toString()``: Retorna o tempo no formato YYYY-MM-DDThh:mm:ss.sss.**/
		toString: {value: function() {return this.main.toString();}},
		/**. ``''string'' toDateString()``: Retorna o tempo no formato YYYY-MM-DD.**/
		toDateString: {value: function() {return this.main.YYYYMMDD;}},
		/**. ``''string'' toString()``: Retorna o tempo no formato hh:mm:ss.sss.**/
		toTimeString: {value: function() {return this.main.hhmmss;}},
		/**. ``''string'' toLocaleString()``: Retorna o valor data/tempo no formato local.**/
		toLocaleString: {
			value: function() {
				const date = this.toDateObject;
				const iso  = date.toLocaleString(__LANG.list, {timeZone: "UTC"});
				const from = date.toLocaleDateString(__LANG.list, {timeZone: "UTC"});
				const to   = this.toLocaleDateString();
				return iso.replace(from, to);
			}
		},
		/**. ``''string'' toLocaleDateString()``: Retorna a data no formato local.**/
		toLocaleDateString: {
			value: function() {
				const date = this.toDateObject;
				const year = new __Number(this.year).toLocaleString({group: false});
				const intl = new Intl.DateTimeFormat(__LANG.list, {timeZone: "UTC"});
				if ("formatToParts" in intl) {
					const text = [];
					const part = intl.formatToParts(date);
					for (let i = 0; i < part.length; i++)
						text.push(part[i].type === "year" ? year : part[i].value);
					return text.join("");
				} else {
					const type = intl.resolvedOptions(date).year;
					const yntl = new Intl.DateTimeFormat(__LANG.list, {timeZone: "UTC", year: type});
					const from = yntl.format(date);
					return intl.format(date).replace(from, year);
				}
			}
		},
		/**. ``''string'' toLocaleTimeString()``: Retorna o tempo no formato local.**/
		toLocaleTimeString: {
			value: function() {
				return this.toDateObject.toLocaleTimeString(__LANG.list, {timeZone: "UTC"});
			}
		},
		/**. ``''string'' format(''string'' input, ''string'' type)``: Retorna notação de data/tempo pre-formatada a partir de codificação especificada no argumento ``input``. No argumento ``type`` é possível limitar os códigos permitidos para "date" ou "time".**/
		format: {
			value: function(input, type) {
				if (typeof input !== "string") return "";
				type = String(type).trim().toLowerCase();
				const codes = this.main.codes;
				const types = {
					date: ["Y", "YY", "YYYY", "M", "MM", "MMM", "MMMM", "D", "DD", "DDD", "DDDD", "w", "ww"],
					time: ["h", "hh", "h12", "m", "mm", "s", "ss", "ampm"],
				}
				const allow = type in types ? types[type] : types.date.slice().concat(types.time);
				let re, code;
				for (let i = 0; i < allow.length; i++) {
					re   = new RegExp("\\{"+allow[i]+"\\}", "gm");
					input = input.replace(re, codes[allow[i]]);
				}
				return input;
			}
		},
		/**. ``''integer'' year``: Define ou retorna o ano.**/
		year: {
			get: function() {return this.main.year;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite || check.value === this.year) return;
				const val = __Number(check.value);
				const int = val.int;
				const dec = val.dec;
				const obj = new __Day(int, this.month, 1);
				const day = this._max === null ? this.day : this._max;
				this.main = new __Time(
					int, this.month, day > obj.width ? obj.width : day,
					this.hour, this.minute, this.second
				);
				this._max = day > obj.width ? day : null;
				if (Math.trunc(12*dec) !== 0)
					this.month = 12*dec;
			}
		},
		/**. ``''integer'' month``: Define ou retorna o mês de 1 a 12 (janeiro a dezembro). O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites. (**Observação**: ao alterar o mês de 2000-01-31 para fevereiro, a data definida será 2000-02-29 e não 2000-03-02)**/
		month: {
			get: function() {return this.main.month;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite) return;
				const val   = __Number(check.value);
				const int   = val.int;
				const dec   = val.dec;
				const month = (12 + (int-1)%12)%12 + 1;
				const year  = Math.trunc((int - (int < 1 ? 12 : 1))/12) + this.year;
				const obj = new __Day(year, month, 1);
				const day = this._max === null ? this.day : this._max;
				this.main = new __Time(
					year, month, day > obj.width ? obj.width : day,
					this.hour, this.minute, this.second
				);
				this._max = day > obj.width ? day : null;
				if (Math.trunc(this.main.width*dec) !== 0)
					this.day = this.main.width*dec;
			}
		},
		/**. ``''integer'' day``: Define ou retorna o dia de 1 a 31. O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites. (**Observação**: Quando o dia de um mês for maior que a quantidade de dias do mês alterado, o valor ficará limitado ao último dia e, ao acrescentar unidades de mês à data 2000-01-31, por exemplo, o resultado será 2000-02-29, 2000-03-31, 2000-04-30, 2000-05-31...**/
		day: {
			get: function() {return this.main.day;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite) return;
				const val = __Number(check.value);
				const int = val.int;
				const dec = val.dec;
				const gap = 24*60*60*(int - this.day);
				this.main = this.main.walk(gap);
				this._max = null;
				if (Math.trunc(24*dec) !== 0)
					this.hour = 24*dec;
			}
		},
		/**. ``''integer'' hour``: Define ou retorna a hora (0 a 23). O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites.**/
		hour: {
			get: function() {return this.main.hour;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite) return;
				const val = __Number(check.value);
				const int = val.int;
				const dec = val.dec;
				const gap = 60*60*(int - this.hour);
				this.main = this.main.walk(gap);
				if (Math.trunc(60*dec) !== 0)
					this.minute = 60*dec;
			}
		},
		/**. ``''integer'' minute``: Define ou retorna o minuto de 0 a 59. O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites.**/
		minute: {
			get: function() {return this.main.minute;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite) return;
				const val = __Number(check.value);
				const int = val.int;
				const dec = val.dec;
				const gap = 60*(int - this.minute);
				this.main = this.main.walk(gap);
				if (Math.trunc(60*dec) !== 0)
					this.second = 60*dec;
			}
		},
		/**. ``''number'' second``: Define ou retorna o segundo de 0 a 59.999. O parâmetro será alterado para o valor definido, exceto quando extrapolar o limites.**/
		second: {
			get: function() {return this.main.second;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite) return;
				const gap = check.value - this.second;
				this.main = this.main.walk(gap);
			}
		},
	});

/*===========================================================================*/
	/**### Listas
	###### ``**constructor** ''object'' __Array(array input|void  ...)``
	Construtor para manipulação de listas (array).
	Caso não seja informado argumento, seja atribuído uma lista vazia. Caso seja informado múltiplos argumentos, cada valor corresponderá a um item do array. Caso seja informado um array como argumento, esse será o valor considerado pelo objeto. Caso contrário, o valor informado será o item do array.**/
	function __Array() {
		let input;
		if (arguments.length === 0)
			input = [];
		else if (arguments.length > 1)
			input = Array.prototype.slice.call(arguments);
		else
			input = __Type(arguments[0]).array ? arguments[0] : [arguments[0]];

		if (!(this instanceof __Array))	return new __Array(input);
		Object.defineProperties(this, {
			_value: {value: input},
			/**. ``''integer'' index``: Retorna o valor do índice (ver ``next``e ``index``).**/
			index:  {value: -1, writable: true},
		});
	}

	Object.defineProperties(__Array.prototype, {
		constructor: {value: __Array},
		[Symbol.iterator]: {
			value: function*() {
				for (let i = 0; i < this._value.length; i++) yield this._value[i];
			}
		},
		/**. ``''any''  valueOf(''integer'' n)``: Retorna o array definido ou um de seus itens se for especificado o índice como argumento, podendo se estender para além do cumprimento do array, repetindo-se a lista de forma constante.**/
		valueOf: {
			value: function(n) {
				const array = this._value.slice();
				if (n === null || n === undefined) return array;
				const check = __Type(n);
				if (!check.finite) return array;
				const value = Math.trunc(check.value);
				const index = (Math.abs(value)*this.length + value)%this.length;
				return array[index];
			}
		},
		/**. ``''string'' toString()``: Retorna a representação em texto do array.**/
		toString: {
			value: function() {
				const parser = __Parser(this._value);
				return parser.jsonString.get();
			}
		},
		/**. ``''integer'' length``: Retorna a quantidade de itens da lista.**/
		length: {get: function() {return this._value.length;}},
		/**. ``''any'' value``: Retorna o valor do item (ver ``next``e ``index``).**/
		value:  {get: function() {return this._value[this.index];}},
		/**. ``''boolean''  next(''boolean'' run)``: Método para utilizar em looping ''while''. Retornará verdadeiro enquanto os itens não forem percorridos ou enquando o argumento ``run`` for diferente de falso. A cada fim de ciclo, com retorno falso, o processo é reiniciado. Utilizar em conjunto com as propriedades ``value`` e ``index``.**/
		next: {
			value: function(run) {
				run = run !== false && this.index < this.length - 1;
				this.index = run ? this.index + 1 : -1;
				return run;
			}
		},
		/**. ``''array'' only(''string'' type, ''boolean'' keep=false, ''boolean'' change=true)``: Retorna uma lista somente com os tipos de itens definidos. O argumento ``type`` define o tipo do item a ser mantido na lista (ver ``&lowbar;&lowbar;Type``); o argumento ``keep``, se verdadeiro, manterá na lista o item não enquadrado em ``type`` mas com o valor ``null``; e o argumento ``change``, se verdadeiro, alterará o item casado para o valor do objeto (``valueOf`` de ``&lowbar;&lowbar;Type``.**/
		only: {
			value: function(type, keep, change) {
				const list = [];
				for (let i = 0; i < this.length; i++) {
					let check = __Type(this._value[i]);
					if (check[type] === true)
						list.push(change === false ? this._value[i] : check.valueOf());
					else if (keep === true)
						list.push(null);
				}
				return list;
			}
		},
		/**. ``''array'' convert(''Function'' f, ''string'' type)``: Retorna uma lista com o resultado de ``f(x)`` ou nulo se algo falhar. O argumento ``f`` corresponde à função a ser aplicada aos itens da lista. O item da lista será o argumento da função cujo retorno substituirá o valor do item. O argumento opcional ``type`` informa o tipo do resultado esperado de acordo com o método ``&lowbar;&lowbar;Type`` que, se diferente, devolverá um valor nulo.**/
		convert: {
			value: function(f, type) {
				if (!__Type(f).function) return null;
				const list = this._value.slice();
				const test = __Type(type);
				for (let i = 0; i < list.length; i++) {
					try {
						let value = f(list[i]);
						let check = __Type(value);
						if (test.chars && type in check)
							list[i] = check[type] ? check.value : null;
						else
							list[i] = value;
					} catch(e) {
						list[i] = null;
					}
				}
				return list;
			}
		},
		/**. ``''number'' min``: Retorna o menor número finito do conjunto de items da lista ou nulo em caso de vazio.**/
		min: {
			get: function() {
				const list = this.only("finite");
				return list.length === 0 ? null : Math.min.apply(null, list);
			}
		},
		/**. ``''number'' max``:  Retorna o maior número finito do conjunto de items da lista ou nulo em caso de vazio.**/
		max: {
			get: function() {
				const list = this.only("finite");
				return list.length === 0 ? null : Math.max.apply(null, list);
			}
		},
		/**. ``''number'' sum``: Retorna a soma dos números finitos da lista ou nulo em caso de vazio.**/
		sum: {
			get: function() {
				const list = this.only("finite");
				let sum = 0, i = -1;
				while (++i < list.length) sum += list[i];
				return list.length === 0 ? null : sum;
			}
		},
		/**. ``''number'' avg``: Retorna a média dos números finitos da lista ou nulo em caso de vazio.**/
		avg: {
			get: function() {
				const list = this.only("finite");
				let sum = 0, i = -1;
				while (++i < list.length) sum += list[i];
				return list.length === 0 ? null : sum/list.length;
			}
		},
		/**. ``''number'' med``: Retorna a mediana dos números finitos da lista ou nulo em caso de vazio.**/
		med: {
			get: function() {
				const list = this.only("finite");
				const y = list.sort(function(a,b) {return a < b ? -1 : 1;});
				const l = list.length;
				return l === 0 ? null : (l%2 === 0 ? (y[l/2]+y[(l/2)-1])/2 : y[(l-1)/2]);
			}
		},
		/**. ``''number'' harm``: Retorna a média harmônica dos números finitos __diferentes de zero__ da lista ou nulo em caso de vazio.**/
		harm: {
			get: function() {
				const list = this.only("finite");
				let sum = 0, len = 0, i = -1;
				while (++i < list.length) {
				  sum += list[i] === 0 ? 0 : 1/list[i];
				  len += list[i] === 0 ? 0 : 1;
				}
				return len === 0 || sum === 0 ? null : len/sum;
			}
		},
		/**. ``''number'' geo``: Retorna a média geométrica dos números finitos __positivos__ da lista ou nulo em caso de vazio.**/
		geo: {
			get: function() {
				const list = this.only("finite");
				let val = 1, len = 0, i = -1;
				while (++i < list.length) {
				  val  = val * (list[i] <= 0 ? 1 : list[i]);
				  len += list[i] <= 0 ? 0 : 1;
				}
				return len === 0 ? null : Math.pow(val, 1/len);
			}
		},
		/**. ``''number'' gcd``: Retorna o máximo divisor comum dos números inteiros da lista ou nulo em caso de vazio.**/
		gcd: {
			get: function() {
				const list = this.only("integer");
				if (list.length < 2) return list.length === 0 ? null : list[0];
				const number = new __Number(list[0]);
				return number.gcd.apply(number, list.slice(1));
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
				const items = this.unique;
				const count = [];
				while (count.length !== items.length) count.push(0);
				for (let i = 0; i < this._value.length; i++)
				  count[items.indexOf(this._value[i])]++;
				const max = Math.max.apply(null, count);
				return items.filter(function(v,i,a) {return count[i] === max;});
			}
		},
		/**. ``''boolean'' check(''any''  ...)``: Checa se os valores informados como argumento estão presentes na lista.**/
		check: {
			value: function() {
				if (arguments.length === 0) return false;
				const list = Array.prototype.slice.call(arguments);
				for (let i = 0; i < list.length; i++)
				  if (this._value.indexOf(list[i]) < 0) return false;
				return true;
			}
		},
		/**. ``''array'' search(''any''  value)``: Retorna uma lista com os índices onde o valor informado no argumento ``value`` foi localizado.**/
		search: {
			value: function(value) {
				const index = [];
				for (let i = 0; i < this._value.length; i++)
				  if (this._value[i] === value) index.push(i);
				return index;
			}
		},
		/**. ``''array'' hide(''any''  ...)``: Retorna uma lista ignorando os valores informados como argumento.**/
		hide: {
			value: function() {
				const hide = Array.prototype.slice.call(arguments);
				return this._value.filter(function(v,i,a) {return hide.indexOf(v) < 0;});
			}
		},
		/**. ``''number'' count(''any''  value)``: Retorna a quantidade de vezes que o valor informado no argumento ``value`` aparece na lista.**/
		count: {
			value: function(value) {return this.search(value).length;}
		},
		/**. ``''array'' sort(''boolean'' asc)``: Retorna a lista ordenada e organizada por grupos na seguinte sequência: número, tempo, data, datatempo, string, booleano, nulo, nós, lista, objeto, função, expressão regular, indefinido e demais valores.
		. O argumento opcional ``asc`` define a classificação da lista. Se verdadeiro, ascendente; se falso, descendente; e, se omitido, inverterá a ordenação atual com prevalência da ordem ascendente.**/
		sort: {
			value: function(asc) {
				const data  = __Type(asc);
				const array = this._value.slice();
				const order = [
					"number", "time", "date", "datetime", "string", "boolean", "null", "node",
					"array", "object", "function", "regexp", "undefined", "unknow"
				];
				asc = data.boolean ? data.value : null;
				array.sort(function(a,b) {
					let A = __Type(a);
					let B = __Type(b);
					/*-- comparação entre tipos diferentes --*/
					if (A.type !== B.type) {
						let typeA = order.indexOf(A.type);
						let typeB = order.indexOf(B.type);
						return typeA < typeB ? -1 : (typeA > typeB ? 1 : 0);
					}
					/*-- comparação entre tipos iguais --*/
					let avalue, bvalue;
					/*-- números e boleanos --*/
					if (A.number || A.boolean) {
						avalue = A.valueOf();
						bvalue = B.valueOf();
					}
					/*-- data/tempo --*/
					else if (A.date || A.time || A.datetime) {
						avalue = new __DateTime(A.value).valueOf();
						bvalue = new __DateTime(B.value).valueOf();
					}
					/*-- string/node --*/
					else if (A.string || A.node) {
						let aval = (A.node ? a.textContent : a).toLowerCase();
						let bval = (B.node ? b.textContent : b).toLowerCase();
						avalue = new __String(aval).clear();
						bvalue = new __String(bval).clear();
					}
					/*-- valores não específicos --*/
					else {
						avalue = a;
						bvalue = b;
					}
					return avalue > bvalue ? 1 : -1;
				});
				/*-- retornando com ordem definida --*/
				if (asc === false || asc === true)
					return asc === true ? array : array.reverse();
				/*-- retornando sem ordem definida --*/
				for (let i = 0; i < array.length; i++)
					if (array[i] !== this._value[i]) return array;
				return array.reverse();
			}
		},
		/**. ``''array'' order``: Retorna uma lista ordenada de forma crescente sem valores repetidos.**/
		order: {
			get: function() {return __Array(this.unique).sort(true);}
		},
		/**. ``''array'' add(''any''  ...)``: Adiciona itens (argumentos) ao fim da lista e a retorna.**/
		add: {
			value: function() {
				this._value.push.apply(this._value, arguments);
				return this.valueOf();
			}
		},
		/**. ``''array'' jump(''any''  ...)``: Adiciona itens (argumentos) ao início da lista e a retorna.**/
		jump: {
			value: function() {
				this._value.unshift.apply(this._value, arguments);
				return this.valueOf();
			}
		},
		/**. ``''array'' put(''any''  ...)``: Adiciona itens (argumentos) __não existentes__ ao fim da lista e a retorna.**/
		put: {
			value: function() {
				for (let i = 0; i < arguments.length; i++)
					if (!this.check(arguments[i]))
						this.add(arguments[i]);
				return this.valueOf();
			}
		},
		/**. ``''array'' concat(''any'' ...)``: Concatena listas ou adiciona itens (argumentos) à lista original.**/
		concat: {
			value: function() {
				for (let i = 0; i < arguments.length; i++) {
					let item = arguments[i];
					this.add.apply(this, __Type(item).array ? item : [item]);
				}
				return this.valueOf();
			}
		},
		/**. ``''array'' replace(''any''  from, ''any''  to)``: Altera os valores da lista conforme especificado e a retorna. O argumento ``from`` definie o valor a ser encontrado e substituído na lista e o argumento ``to`` define seu novo valor.**/
		replace: {
			value: function (from, to) {
			  for (let i = 0; i < this._value.length; i++)
			    if (this._value[i] === from) this._value[i] = to;
				return this.valueOf();
			}
		},
		/**. ``''array'' remove(''any'' ...)``: Remove itens (argumentos) da lista e a retorna.**/
		remove: {
			value: function() {
				const list = this.hide.apply(this, arguments);
				while(this._value.length !== 0) this._value.pop();
				this.add.apply(this, list);
				return this.valueOf();
			}
		},
		/**. ``''array'' toggle(''any''  ...)``: Remove, se existente, ou insere ao fim, se ausente, itens (argumentos) da lista e a retorna.**/
		toggle: {
			value: function() {
				const tgl  = Array.prototype.slice.call(arguments);
				for (let i = 0; i < tgl.length; i++) {
					if (this._value.indexOf(tgl[i]) < 0)
					  this.add(tgl[i]);
					else
					  this.remove(tgl[i]);
				}
				return this.valueOf();
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
		const check = __Type(root);
		Object.defineProperties(this, {
			css:  {value: __Type(css).nonempty ? String(css).trim() : ""},
			root: {value: check.node && check.value.length > 0 ? check.value[0] : document},
		});
	}

	Object.defineProperties(__Query.prototype, {
		constructor: {value: __Query},
		/**. ``''array'' $$``: retorna uma lista de nós (``NodeList``).**/
		$$: {
			get: function() {
				let elem = null;
				try {elem = this.root.querySelectorAll(this.css);} catch(e) {}
				return __Type(elem).node ? elem : document.querySelectorAll("#_._");
			}
		},
		/**. ``''array'' $``: retorna um nó específico ou lista de nós (``NodeList``) vazia.**/
		$: {
			get: function() {
				let elem = null;
				try {elem = this.root.querySelector(this.css);} catch(e) {}
				return __Type(elem).node ? elem : this.$$;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#### Nós HTML
	#### Formulários
	###### ``**constructor** ''object'' __FNode(''node'' input)``
	Construtor para checar características de campos de formulários HTML (argumento ``node``).**/
	function __FNode(input) {
		if (!(this instanceof __FNode))	return new __FNode(input);
		const check = __Type(input);
		if (!check.node || check.value.length < 1)
			throw new TypeError("Input value is not an HTML node");
		const fcheck = [null, "finite", "datetime", "combo", "check", "text"];
		const forms  = {
			meter:    {send: 0, mask: 0, check: 1, text: 0},
			progress: {send: 0, mask: 0, check: 1, text: 0},
			option:   {send: 0, mask: 0, check: 5, text: 1},
			output:   {send: 0, mask: 0, check: 5, text: 1},
			select:   {send: 1, mask: 0, check: 3, text: 0},
			textarea: {send: 1, mask: 0, check: 5, text: 1},
			button: {
				types: {
					reset:  {send: 0, mask: 0, check: 5, text: 1},
					button: {send: 0, mask: 0, check: 5, text: 1},
					submit: {send: 1, mask: 0, check: 5, text: 1}
				}
			},
			input: {
				types: {
					button:   {send: 0, mask: 0, check: 5, text: 0},
					reset:    {send: 0, mask: 0, check: 5, text: 0},
					submit:   {send: 1, mask: 0, check: 5, text: 0},
					image:    {send: 0, mask: 0, check: 0, text: 0},
					color:    {send: 1, mask: 1, check: 5, text: 0},
					radio:    {send: 1, mask: 0, check: 4, text: 0},
					checkbox: {send: 1, mask: 0, check: 4, text: 0},
					range:    {send: 1, mask: 1, check: 1, text: 0},
					number:   {send: 1, mask: 1, check: 1, text: 0},
					file:     {send: 1, mask: 0, check: 3, text: 0},
					url:      {send: 1, mask: 1, check: 5, text: 0},
					email:    {send: 1, mask: 1, check: 3, text: 0},
					tel:      {send: 1, mask: 0, check: 5, text: 0},
					text:     {send: 1, mask: 0, check: 5, text: 0},
					search:   {send: 1, mask: 0, check: 5, text: 0},
					password: {send: 1, mask: 0, check: 5, text: 0},
					hidden:   {send: 1, mask: 0, check: 5, text: 0},
					date:     {send: 1, mask: 1, check: 2, text: 0},
					datetime: {send: 1, mask: 1, check: 2, text: 0},
					month:    {send: 1, mask: 1, check: 2, text: 0},
					week:     {send: 1, mask: 1, check: 2, text: 0},
					time:     {send: 1, mask: 1, check: 2, text: 0},
					"datetime-local": {send: 1, mask: 1, check: 2, text: 0}
				}
			}
		};
		const node = check.value[0];
		const tag  = node.tagName.toLowerCase();
		const form = tag in forms;
		const data = (function() {
			if (!form) return {};
			const cfg = "types" in forms[tag] ? forms[tag].types : forms;
			let name  = tag;
			let work  = true;
			if ("types" in forms[tag]) {
				const attr = String(node.getAttribute("type")).toLowerCase();
				const prop = String(node.type).toLowerCase();
				name = attr in cfg ? attr : (prop in cfg ? prop : "text");
				work = prop === attr;
			}
			cfg[name].name  = name;
			cfg[name].work  = work;
			cfg[name].check = fcheck[cfg[name].check];
			return cfg[name];
		})();
		const fmask = data.mask !== 1 ? true : (function() {
			const invalid = "A1!@#$%¨&*()+";
			const clone   = node.cloneNode();
			clone.value   = invalid;
			return clone.value !== invalid;
		})();
		Object.defineProperties(this, {
			/**. ``''node'' node``: Retorna o nó.**/
			node:   {value: node},
			/**. ``''string'' tag``: Retorna a tag do nó.**/
			tag:    {value: tag},
			/**. ``''boolean'' form``: Informa se o nó é campo de formulário.**/
			form:   {value: form},
			/**. ``''string'' ftype``: Retorna o tipo de formulário ou vazio.**/
			ftype:  {value: data.name},
			/**. ``''boolean'' fmask``: Informa se o formulário possui máscara nativa implementada.**/
			fmask:  {value: fmask},
			/**. ``''boolean'' fsend``: Informa se o formulário pode ser enviado em requisições ou falso.**/
			fsend:  {value: data.send === 1},
			/**. ``''boolean'' fwork``: Informa se o formulário está implementado.**/
			fwork:  {value: data.work === true},
			/**. ``''string'' fcheck``: Informa o tipo de verificação do valor do formulário.**/
			fcheck: {value: "check" in data ? data.check : ""},
			/**. ``''boolean'' ftext``: Informa se o formulário aceita conteúdo de texto.**/
			ftext:  {value: data.text !== 0},
		});
	}

	Object.defineProperties(__FNode.prototype, {
		constructor: {value: __FNode},
		/**. ``''string'' fname``: Define ou retorna o valor do atributo ``name`` do formulário ou vazio.**/
		fname: {
			get: function()  {return this.form ? this.node.name.trim() : "";},
			set: function(x) {
				if (this.form) this.node.name = x === null ? "" : String(x).trim();
			}
		},
		/**. ``''any'' fvalue``: Define ou retorna o valor do formulário ou nulo.**/
		fvalue: {
			get: function() {
				if (!this.form) return null;
				const node  = this.node;
				const value = node.value;
				const check = __Type(value);
				if (this.fcheck === "finite") {
					return check.finite ? check.value : "";
				}
				if (this.fcheck === "datetime") {
					const data  = __DateTime(value);
					const type  = data.type;
					const main  = data.main;
					const types = ["date", "time", "month", "week", "datetime", "fweek", "number"];
					const found = types.indexOf(type) >= 0;
					switch(this.ftype) {
						case "date":           return type === "date"     ? main.YYYYMMDD   : "";
						case "time":           return type === "time"     ? main.hhmmss     : "";
						case "month":          return type === "month"    ? main.YYYYMM     : "";
						case "week":           return type === "fweek"    ? main.YYYYWW     : "";
						case "datetime":       return found               ? main.toString() : "";
						case "datetime-local": return type === "datetime" ? main.toString() : "";
					}
					return "";
				}
				if (this.fcheck === "combo") {
					switch(this.ftype) {
						case "file": {
							const list = node.files;
							return !node.multiple && list.length > 1 ? [] : list;
						}
						case "email": {
							const email = __TYPE.email.email;
							const list  = value.replace(/\s+/g, "").split(",");
							for (let v of list)
								if (!email.test(v.trim())) return [];
							return node.multiple === false && list.length > 1 ? [] : list;
						}
						case "select": {
							const list = [];
							for (let i = 0; i < node.length; i++)
								if (node[i].selected) list.push(node[i].value);
							return node.multiple === false && list.length > 1 ? [] : list;
						}
					}
					return [];
				}
				if (this.fcheck === "check") {
					return node.checked ? value : null;
				}
				if (this.fcheck === "text") {
					const color = /^\#[0-9a-f]{6}$/i;
					switch(this.ftype) {
						case "color": return color.test(value.trim()) ? value.trim() : "#000000";
						case "url":   try {return new URL(value).href;} catch(e) {return "";}
					}
					return value;
				}
				return null;
			},
			set: function(value) {
				if (!this.form) return;
				const node  = this.node;
				const check = __Type(value);
				const mask  = this.fmask;
				if (check.null && this.fcheck !== "check") {
					node.value = null;
					return;
				}
				if (this.fcheck === "finite") {
					if (check.finite) node.value = check.value;
					return;
				}
				if (this.fcheck === "datetime") {
					const data  = __DateTime(value);
					const type  = data.type;
					const main  = data.main;
					const names = {week: "fweek", "datetime-local": "datetime"};
					const ftype = this.ftype in names ? names[this.ftype] :  this.ftype;
					const types = {
						date:  main.YYYYMMDD,
						time:  mask ? main.hhmmss.substring(0,5) : main.hhmmss,
						month: main.YYYYMM,
						week:  main.YYYYWW,
						fweek: main.YYYYWW,
						datetime: mask ? main.toString().substring(0,16) : main.toString(),
						number:   mask ? main.toString().substring(0,16) : main.toString()
					};
					if (ftype === type || (this.ftype === "datetime" && type in types)) {
						if (mask && type !== "time" && data.year < 1) return;
						node.value = types[ftype];
					}
					return;
				}
				if (this.fcheck === "combo") {
					if (this.ftype === "file") return;
					if (this.ftype === "email") {
						const email = __TYPE.email.email;
						const list  = check.array ? value : String(value).split(",");
						for (let v of list) if (!email.test(v.trim())) return;
						node.value = list.join(",").replace(/\s+/g, "");
						return;
					}
					if (this.ftype === "select") {
						const list = check.array ? value : [value];
						list.forEach(function(v,i,a) {a[i] = String(v);})
						for (let i = 0; i < node.length; i++)
							node[i].selected = list.indexOf(node[i].value) >= 0;
						return;
					}
					return;
				}
				if (this.fcheck === "check") {
					if (check.boolean)
						node.checked = check.value;
					else if (check.null)
						node.checked = !node.checked;
					else
						node.checked = check.value;
					return;
				}
				if (this.fcheck === "text") {
					if (this.ftype === "color") {
						const color = /^\#[0-9a-f]{6}$/i;
						if (color.test(value.trim()))
							node.value = value.trim().toLowerCase();
						return;
					}
					if (this.ftype === "url") {
						if (check.instanceOf("URL"))
							node.value = value.href;
						else
							try {node.value = new URL(value).href;} catch(e) {}
						return;
					}
					node.value = value;
				}
				return;
			}
		},
		/**. ``''boolean'' ferror``: Retorna se o campo de formulário é inválido.**/
		ferror: {
			get: function() {
				if (this.form) {
					/*-- Zerando erros personalizados --*/
					this.fvalidity = "";
					/*-- Checando erros implementados pelo navegador --*/
					if (this.node.checkValidity() === false) return true;
					/*-- Checando erros de valores --*/
					const value  = this.node.value !== "";
					const combo  = this.fcheck === "combo";
					const fvalue = combo ? this.fvalue.length > 0 : this.fvalue !== "";
					if (value && !fvalue) {
					 this.fvalidity = this.ftype+": inadequate value.";
					 return true;
					}
					/*-- checando erros do dataset-wd-value --*/
					this.node.dispatchEvent(wdReloadEvent);
					if (this.node.checkValidity() === false) return true;
				}
				return false;
			}
		},
		/**. ``''string'' fvalidity``: Define ou retorna mensagem de restrição do formulário.**/
		fvalidity	: {
			get: function() {
				return this.ferror ? this.node.validationMessage.trim() : "";
			},
			set: function(x) {
				const check = this.form && "setCustomValidity" in this.node;
				const error = x === null ? "" : String(x).trim();
				if (check) this.node.setCustomValidity(error);
			}
		},
		/**. ``''object'' fsubmit``: Retorna um objeto contendo as propriedades ``name``, ``value``, ``error`` e ``message`` do formulário ou nulo se não for o caso para submeter.**/
		fsubmit: {
			get: function() {
				if (this.fsend) {
					const data = {
						name:  this.fname,  value:   this.fvalue,
						error: this.ferror, message: this.fvalidity
					};
					return data.name === "" || data.value === null ? null : data;
				}
				return null;
			}
		},
		/**. ``''void'' falert()``: Exibe a mensagem de erro na tela, se implementado pelo navegador.**/
		falert	: {
			value: function() {
				const validity = this.fvalidity;
				if (validity !== "" && "reportValidity" in this.node)
					this.node.reportValidity();
				return;
			}
		}
	});

/*----------------------------------------------------------------------------*/
	/**###### ``**constructor** ''object'' __Node(node input)``
	Construtor para manipulação de nós HTML.**/
	function __Node(input) {
		if (!(this instanceof __Node)) return new __Node(input);
		__FNode.call(this, input);
	}

	__Node.prototype = Object.create(__FNode.prototype, {
		constructor: {value: __Node},
		/**. ``''any'' attribute(''string'' name, ''any'' value)``: Define e retorna valores de atributos dos elementos HTML. Os argumentos ``name`` e ``value`` são, respectivamente, o nome e o valor do atributo. Se ``value`` for omitido, retornará o valor de ``name``. Se ``name`` for omitido, retornará um objeto com os nome e valores dos atributos HTML.**/
		attribute: {
			value: function (name, value) {
				/*-- RETORNAR LISTA DE ATRIBUTOS -------------------------------------*/
				if (!__Type(name).nonempty) {
					const data = {};
					const attr = this.node.attributes;
					for (let i = 0; i < attr.length; i++)
						data[attr[i].name] = attr[i].value;
					return data;
				}
				/*-- RETORNAR/DEFINIR ATRIBUTO ---------------------------------------*/
				name = name.trim();
				const prop = {
					form:  {value: "fvalue", name: "fname"},
					node:  {style: "style", class: "class", className: "class", dataset: "dataset"},
					event: {addEventListener: "addHandler", removeEventListener: "removeHandler"}
				};
				/*-- RETORNAR ATRIBUTO -----------------------------------------------*/
				if (arguments.length < 2) {
					const attr = this.attribute();
					/*-- atributos de formulário -- */
					if (this.form && name in prop.form)
						return this[prop.form[name]];
					/*-- atributos com comportamento especial --*/
					if (name in prop.node)
						return this[prop.node[name]];
					/*-- propriedades de objeto --*/
					if (name in this.node)
						return this.node[name];
					/*-- propriedades do elemento --*/
					if (name in attr)
						return this.node.getAttribute(name);
					return undefined;
				}
				/*-- DEFINIR ATRIBUTO ------------------------------------------------*/
				else {
					/*-- atributo de formulário HTML -- */
					if (this.form && name in prop.form) {
						this[prop.form[name]] = value;
						return this.attribute(name);
					}
					/*-- atributo HTML com comportamento especial --*/
					if (name in prop.node) {
						this[prop.node[name]] = value;
						return this.attribute(name);
					}
					/*-- métodos com comportamento especial --*/
					if (name in prop.event) {
						return this[prop.event[name]](value);
					}
					/*-- propriedade do objeto --*/
					if (name in this.node) {
						const testAttr  = __Type(this.node[name]);
						const testValue = __Type(value);
						/*-- método: valor igual array --*/
						if (testAttr.function && testValue.array) {
							return this.node[name].apply(this.node, value);
						}
						/*-- propriedade booleana --*/
						if (testAttr.boolean && (testValue.boolean || value === "!")) {
							this.node[name] = testValue.boolean ? testValuevalue : !this.node[name];
						}
						/*-- demais propriedades --*/
						else if (value === null) {
							delete this.node[name];
						} else {
							this.node[name] = value;
						}
					}
					/*-- attributos do elemento --*/
					else {
						if (value === null)
							this.node.removeAttribute(name);
						else
							this.node.setAttribute(name, value);
					}
					return this.attribute(name);
				}
			}
		},
		/**. ``''object'' style``: Define e retorna o valor do atributo ``style`` por meio de um objeto. Valor nulo excluí o atributo, valor textual define o atributo HTML e valor em objeto define o par nome-valor.**/
		style: {
			get: function() {
				const data = {};
				for (let i = 0; i < this.node.style.length; i++) {
					let attr = this.node.style[i];
					let name = __String(attr).camel;
					data[name] = this.node.style[attr];
				}
				return data;
			},
			set: function(x) {
				const data = new __Type(x);
				if (data.null) {
					this.node.removeAttribute("style");
				}
				else if (data.chars) {
					this.node.setAttribute("style", x);
				}
				else if (data.object) {
					for (let i in x) {
						let name = new __String(i).camel;
						this.node.style[name] = x[i];
					}
				}
			}
		},
		/**. ``''array'' class``: Define e retorna o valor do atributo ``class`` por meio de um array. Valor nulo excluí o atributo, valor textual define o atributo HTML e valor em objeto define ações ''replace'', ''toggle'', ''add'' e  ''remove''.**/
		class: {
			get: function() {
				const css   = this.node.getAttribute("class");
				const array = css === null ? [] : css.replace(/\s+/g, " ").trim().split(" ");
				const value = new __Array(array).order;
				this.node.setAttribute("class", value.join(" "));
				return value;
			},
			set: function(x) {
				const data = new __Type(x);
				if (data.chars) {
					this.node.setAttribute("class", x);
				}
				else if (data.null) {
					this.node.removeAttribute("class");
				}
				else if (data.object) {
					const css = new __Array(this.class);
					if ("replace" in x) css.replace.apply(css, x.replace.split(" "));
					if ("toggle"  in x) css.toggle.apply(css, x.toggle.split(" "));
					if ("add"     in x) css.put.apply(css, x.add.split(" "));
					if ("remove"  in x) css.remove.apply(css, x.remove.split(" "));
					this.node.setAttribute("class", css.order.join(" "));
				}
			}
		},
		/**. ``''void''  handler(''object'' list)``: Define ou remove disparadores ao elemento. As propriedades do argumento ``list`` correspondem ao nome do evento e seus valores as funções disparadoras ou uma lista delas. Caso a função disparadora esteja no escopo de ``window``, poderá ser informada a string com seu nome. As propriedades booleanas especiais "#remove" e "#capture" definem se trata de remoção de evento e o valor do terceiro argumento (``useCapture``) dos métodos nativos "add/removeEventListener".**/
		handler: {
			value: function(list) {
				if (new __Type(list).object) {
					const capture = list["#capture"] === true;
					const remove  = list["#remove"]  === true;
					const method  = (remove ? "remove" : "add")+"EventListener";
					if ("#remove"  in list) delete list["#remove"];
					if ("#capture" in list) delete list["#capture"];
					console.log(list, method, capture);

					for (let i in list) {
						let event = String(i).trim().replace(/^(on)?/i, "");
						let fires = __Type(list[i]).array ? list[i] : [list[i]];
						for (let j = 0; j < fires.length; j++) {
							let fire = fires[j];
							if (new __Type(fire).nonempty) fire = window[fire.trim()];
							if (new __Type(fire).function) this.node[method](event, fire, capture);
						}
					}
				}
				return;
			}
		},
		/**. ``''void''  addHandler(''object|array'' list)``: Método auxiliar de ``handler`` para atrelar disparadores a eventos. Se ``list`` for um array, seus itens deverão ser o nome do evento, a função disparadora ou uma lista delas e o valor do terceiro argumento (``useCapture``) dos métodos nativos, respectivamente.**/
		addHandler: {
			value: function(list) {
				const check     = new __Type(list)
				const data      = check.object ? list : {};
				data["#remove"] = false;
				if (check.array) {
					data[list[0]]    = list[1];
					data["#capture"] = list[2];
				}
				return this.handler(data);
			}
		},
		/**. ``''void''  removeHandler(''object|array'' list)``: Método auxiliar de ``handler`` para desatrelar disparadores a eventos. Se ``list`` for um array, seus itens deverão ser o nome do evento, a função disparadora ou uma lista delas e o valor do terceiro argumento (``useCapture``) dos métodos nativos, respectivamente.**/
		removeHandler: {
			value: function(list) {
				const check     = new __Type(list)
				const data      = check.object ? list : {};
				data["#remove"] = true;
				if (check.array) {
					data[list[0]]    = list[1];
					data["#capture"] = list[2];
				}
				return this.handler(data);
			}
		},
		/**. ``''object'' dataset``: Define e retorna os valores do atributo ``dataset``. Valor nulo excluí o atributo e valor em objeto define seus pares nome-valor.**/
		dataset: {
			get: function() {
				const data = {};
				for (let i in this.node.dataset)
					data[i] = this.node.dataset[i];
				return data;
			},
			set: function(x) {
				const data  = new __Type(x);
				const wdLib = [];
				if (data.null) {
					const attr = this.dataset;
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
				/* registrar os atributos alterados e invocar evento */
				this.node.dataset.wdDatasetEvent = wdLib.join(",");
				this.node.dispatchEvent(wdDatasetEvent);
			}
		},
		/**. ``''node'' clone(boolean childs=true)``: Retorna um clone do objeto. Se o argumento opcional ``childs`` for falso, os elementos filhos não serão clonados.**/
		clone: {
			value: function(childs) {
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
		/**. ``''void'' load(''string'' html="", ''object'')``: Atribui o conteúdo definido em ``html`` ao elemento ou o substitui. O argumento ``html`` pode ser um nó ou um conjunto de nós HTML, uma string em linguagem de marcação ou objetos do tipo um XMLDocument, HTMLDocument ou Document. O argumento ``options`` pode possuir as seguintes propriedades boleanas:
		|Nome|Descrição|
		|script|Se verdadeiro, forçará a execução de scripts (exceto para XML).|
		|replace|Se verdadeiro, o conteúdo substituirá o elemento (nós do mesmo documento serão transferidos)|
		|text|Se verdadeiro, o conteúdo será lançado como texto como ocorre em formulários.|**/
		load: {
			value: function(html, options) {
				if (!__Type(options).object) options = {};
				const check = __Type(html);
				let   xml  = false;
				let   data = []
				const load = [];
				/*-- se for nó(s), capturar a lista --*/
				if (check.node) {
					data = check.value;
				}
				/*-- se for HTML, capturar os filhos --*/
				else if (check.chars) {
					const re = /^\<body.+\<\/body\>$/;
					if (!re.test(html.trim()))
						html = "<body>"+html.trim()+"</body>";
					const parser = new __Parser(html);
					data = parser.stringHTML.get().body.children;
				}
				/*-- se for XML, capturar os filhos --*/
				else if (check.instanceOf("XMLDocument")) {
					xml  = true;
					data = html.documentElement.children;
				}
				/*-- se for document, capturar os filhos de body --*/
				else if (check.instanceOf("HTMLDocument") || check.instanceOf("Document")) {
					data = html.body.children;
				}
				/*-- migrar itens de data para o array load --*/
				for (let i = 0; i < data.length; i++)
					load.push(data[i]);
				/*-- limpar nó --*/
				while (this.node.childElementCount > 0)
					this.node.firstElementChild.remove();
				/*-- adicionar texto: pai formulário ou se optado --*/
				if (this.form || options.text === true) {
					const text = [];
					for (let i = 0; i < load.length; i++)
						text.push(load[i].outerHTML);
					this.attribute("textContent", text.join("\n"));
					return;
				}
				/*-- introduzir ou substituir conteúdo --*/
				if (options.replace === true) {
					for (let i = 0; i < load.length; i++)
						this.node.parentElement.insertBefore(load[i], this.node);
					this.node.remove();
				} else {
					for (let i = 0; i < load.length; i++)
						this.node.appendChild(load[i]);
				}
				/*-- rodando scripts --*/
				if (options.script === true && !xml) {
					for (let i = 0; i < load.length; i++) {
						let list = [load[i]];
						if (load[i].tagName.toLowerCase() !== "script")
							list = __Type(__Query("script", load[i]).$$).value;
						for (let j = 0; j < list.length; j++) {
							let clone = __Node(list[j]).clone();
							list[j].parentElement.insertBefore(clone, list[j]);
							list[j].remove();
						}
					}
				}
				/*-- invocar evento --*/
				if (!xml) {
					if (options.replace === true) {
						for (let i = 0; i < load.length; i++)
							load[i].dispatchEvent(wdReloadEvent);
					} else {
						this.node.dispatchEvent(wdReloadEvent);
					}
				}
			}
		},
		/**. ``''void'' repeat(''array'' list)``: Clona os filhos do elemento repetindo-os de acordo com as informações repassadas pela lista de objetos (``list``). O elemento filho que contiver o nome do atributo do objeto entre duas chaves (''{{nome}}'') terá o fragmento substituídos pelo valor do atributo do objeto correspondente.**/
		repeat: {
			value: function(list) {
				if (!__Type(list).array) list = [];
				/*----------------------------------------------------------------------
					1) innerHTML do nó possui o formato {{propriedade}}?
						sim: armazená-lo em data-wd-repeat-model e ir para 3
						não: ir para 2
					2) Há modelo em data-wd-repeat-model?
						sim: ir para 3
						não: retornar
					3) Criar lista de filhos a carregar (load)
					4) Alterar {{propriedade}} conforme list
					5) Limpar propriedades não encontradas
					6) Carregar filhos
				----------------------------------------------------------------------*/
				let   html = this.node.innerHTML;
				const load = [];
				const re   = /\{\{([^}]+)\}\}/;
				if (re.test(html))
					this.node.dataset.wdRepeatModel = html;
				else if ("wdRepeatModel" in this.node.dataset)
					html = this.node.dataset.wdRepeatModel;
				else
					return;

				for (let i = 0; i < list.length; i++) {
					let obj = list[i];
					if (__Type(obj).object) {
						let inner = html;
						for (let j in obj)
							inner = inner.split("{{"+j+"}}").join(obj[j]);
						while (re.test(inner))
							inner = inner.replace(re, "");
						load.push(inner);
					}
				}
				this.load(load.join(""));
				return;
			}
		},
		/**. ``''boolean'' show``: Retorna e define a visibilidade do elemento nos termos da biblioteca.**/
		show: {
			get: function() {
				return this.class.indexOf("js-wd-no-display") < 0;
			},
			set: function(x) {
				this.class = x === false ? {add: "js-wd-no-display"} : {remove: "js-wd-no-display"}
			}
		},
		/**. ``''void'' only(''boolean'' reverse)``: Exibe o nó e esconde os irmãos. Se ``reverse`` for verdadeiro, inverte-se o resultado.**/
		only: {
			value: function(reverse) {
				const nodes = __Type(this.node.parentElement.children).value;
				for (let i = 0; i < nodes.length; i++) {
				  const data = __Node(nodes[i]);
					data.show = nodes[i] === this.node ? (reverse !== true) : (reverse === true);
				}
			}
		},
		/**. ``''void'' childs(''integer'' init, ''integer'' last)``: Define o intervalo de nós filhos a ser exibido entre o índice inicial (``init``) e final (``last``). Utilize um número negativo para indicar o último elemento.**/
		childs: {
			value: function (init, last) {
				const child = __Type(this.node.children).value;
				const width = child.length - 1;
				const data1 = __Type(init);
				const data2 = __Type(last);
				init = data1.number ? (data1 < 0 ? width : data1.value) : -Infinity;
				last = data2.number ? (data2 < 0 ? width : data2.value) : +Infinity;
				if (init > last) {
					let aux = init;
					init = last;
					last = aux;
				}
				for (let i = 0; i < child.length; i++) {
					const node = __Node(child[i]);
					node.show  = i >= init && i <= last;
				}
			}
		},
		/**. ``''array'' groups(''boolean'' child)``: Retorna uma lista de objetos contendo os intervalos (propriedades ``init`` e ``last``) dos elementos visíveis. Se o argumento ``child`` for verdadeiro, a análise será dentre os filhos, caso contrário, entre elemento e seus irmãos.**/
		groups: {
			value: function(child) {
				const target = child === true ? this.node : this.node.parentElement;
				const nodes  = __Type(target.children).value;
				const groups = [];
				const data   = {init: null, last: null};
				for (let i = 0; i < nodes.length; i++) {
					let show = nodes[i].className.split(/\s/).indexOf("js-wd-no-display") < 0;
					if (show) {
						if (data.init === null) data.init = i;
						data.last  = i;
						if (i === (nodes.length - 1))
							groups.push({init: data.init, last: data.last});
					} else if (data.init !== null) {
						groups.push({init: data.init, last: data.last});
						data.init = null;
						data.last = null;
					}
				}
				return groups;
			}
		},
		/**. ``''void'' walk(''integer'' n=1)``: Exibe um determinado nó filho avançando ou retrocedendo entre os nós irmãos. O argumento ``n`` indica o intervalo a avançar (positivo) ou a retroceder (negativo).**/
		walk: {
			value: function(n) {
				if (this.node.childElementCount < 2) return this.childs(0, 0);
				const data   = __Type(n);
				const childs = this.node.childElementCount;
				const delta  = data.finite ? Math.trunc(data.value) : 1;
				const groups = this.groups(true);
				let   active = groups.length === 0 ? 0 : groups[0].init;
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
				if (this.node.childElementCount < 2) return this.childs(0,0);
				/* definindo o tamanho da página */
				const length = this.node.childElementCount;
				const check1 = __Type(width);
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
		/**. ``''void'' insertTag(''string'' tag, ''integer'' start, ''integer'' end)``: Insere uma ``tag`` HTML entre os índices ``start`` e ``end`` do conteúdo textual. Método destrutivo, não utilizar se houver conteúdo editável no nó.**/
		insertTag: {
			value: function(tag, start, end) {
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
		/**. ``''object'' textMatch(''regexp|string'' search)``: Localiza dentro do conteúdo textual do nó os índices de início e fim de ``search`` em um objeto contendo os atributos ``init`` e ``last``, retorna ou nulo caso não encontre.**/
		textMatch: {
			value: function(search) {
				const check = __Type(search);
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
				if (this.node.childElementCount === 0) return;
				const data  = __Type(search);
				const check = __Type(width);
				const child = __Type(this.node.children).value;
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
						node.insertTag("wdtag-mark", index.init, index.last);
					}
				});
				return;
			}
		},
		/**. ``''void'' sort(''boolean'' asc)``: Ordena os elementos filhos. O argumento opcional ``asc`` define a classificação. Se verdadeiro, será ascendente; se falso, descendente; e, se não boleano, será o inverso da classificação vigente.**/
		sort: {
			value: function(asc) {
				if (this.node.childElementCount === 0) return;
				let node  = this.node;
				const child = __Type(this.node.children).value;
				const sort  = __Array(child).sort(asc);
				for (let i = 0; i < sort.length; i++)
				  this.node.appendChild(sort[i]);
				return;
			}
		},
		/**. ``''void'' tsort(''integer'' order...)``: Ordena os nós filhos com referência aos nós netos, ordenando colunas de tabelas. Os argumentos ``order`` definem a sequência de prioridade na classificação, com a indicação do número da coluna (a partir de 1, da esquerda para a direita). Se indicador da coluna for positivo, sua ordem será ascendente, caso contrário, descendente.**/
		tsort: {
			value: function() {
				if (this.node.childElementCount === 0) return;
				/*-- acertando argumentos --*/
				const args = [];
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
		/**. ``''void'' jump(''node'' list)``: O nó será adicionado aos elementos na ordem definida em ``list`` a cada chamada do método. O argumento ``list`` é uma lista de nós que acomodará o elemento.**/
		jump: {
			value: function(list) {
				const check = __Type(list);
				if (!check.node && !check.array) return;
				const nodes = [];
				const value = check.value;
				for (let i = 0; i < value.length; i++)
				  if (__Type(value[i]).node && value[i] != this.node)
				    nodes.push(value[i]);
				if (nodes.length > 0) {
					const next = nodes.indexOf(this.node.parentElement) + 1;
					const node = nodes[next%nodes.length];
					node.appendChild(this.node);
				}
				return;
			}
		},
		/**. ``''void'' full()``: Alterna a exibição do nó em tela cheia.**/
		//TODO interessante: https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop    https://developer.mozilla.org/en-US/docs/Web/CSS/:fullscreen
		full: {
			value: function() {
				const attr = {
					open: ["requestFullscreen", "webkitRequestFullscreen", "msRequestFullscreen"],
					exit: ["exitFullscreen",    "webkitExitFullscreen",    "msExitFullscreen"]
				};
				const full = document.fullscreenElement;
				const act  = full === this.node ? "exit" : "open";
				const node = act === "exit" ? document : this.node;
				for (let i = 0; i < attr[act].length; i++) {
					if (attr[act][i] in node)
						try {return node[attr[act][i]]();} catch(e) {}
				}
				return;
			}
		},
		/**. ``''object'' styles``: Retorna um objeto contendo os estilos e seus valores computados ao elemento.**/
		styles: {
			get: function() {
				const object = {};
				const styles = window.getComputedStyle(this.node, null);
				for (let i in styles) {
					if ((/\d+/).test(i)) continue;
					object[i] = styles.getPropertyValue(i);
				}
				return object;
			}
		},
		/**. ``''object'' position``: Retorna ou define o dimensionamento do elemento por meio de um objeto com os seguintes atributos: width, height, top, right, bottom e left. Os valores dependem do posicionalmento do elemento e devem ser numéricos.**/
		position: {
			get: function() {
				const re   = /[^0-9\.\-]/g;
				const css  = this.styles;
				let   data = {height: 0, width: 0, left: 0, top: 0, right: 0, bottom: 0};
				for (let i in data)
					data[i] = Number(css[i].replace(re, ""));
				return data;
			},
			set: function(x) {
				if (!__Type(x).object) return;
				let data = this.position;
				for (let i in data)
					if (i in x) this.node.style[i] = String(x[i])+"px";
				return;
			}
		}
	});

/*----------------------------------------------------------------------------*/

	/**#### Tabela
	###### ``**constructor** ''object'' __Table(''any'' input)``
	Construtor para obter dados de tabela e matrizes. O argumento ``input`` pode uma String no formato CSV, uma metriz de array ou uma tabela HTML;**/
	function __Table(input) {
		if (!(this instanceof __Table))	return new __Table(input);
		const parser = new __Parser(input);
		let table;
		if (parser._check.nonempty)
		  table = parser.csvTable.get();
		else if (parser._check.array)
		  table = parser.matrixCSV.csvTable.get();
		else if (parser._check.node && parser._check.value[0].tagName.toLowerCase() === "table")
		  table = parser._check.value[0];
		else
		  table = document.createElement("TABLE");
		Object.defineProperties(this,
		  /**. ``''node'' table``: Retorna a tabela.**/
		  {table: {value: table}}
		);
	}

	Object.defineProperties(__Table.prototype, {
		constructor: {value: __Table},
		/**. ``''object'' to``: Retorna um objeto para exportar os dados da tabela para:
		|Nome|Descrição|
		|matrix|Retorna os nós ''td'' e ''th'' da tabela em forma de matriz 2X2|
		|values|Semelhante à propriedade ``matrix`` mas exibe os valores das células|
		|struct|Retorna uma lista de objetos cujas propriedades correspondem ao título da coluna|
		|csv|Retorna os dados da tabela em formato CSV|
		|json|Retorna o resultado da propriedade ``values`` no formato JSON|**/
		to: {
			get: function() {
				const parser = new __Parser(this.table);
				return {
					get matrix() {return parser.tableMatrix.get();},
					get values() {return parser.tableValues.get();},
					get struct() {return parser.tableValues.matrixList.get();},
					get csv()    {return parser.tableValues.matrixCSV.get();},
					get json()   {return parser.tableValues.jsonString.get();}
				};
			}
		},
		/**. ``''string'' toString()``: Retorna os valores da tabela em formato CSV.**/
		toString: {value: function() {return this.to.csv;}},
		/**. ``''string'' valueOf()``: Retorna os valores da tabela em forma de matriz.**/
		valueOf: {value: function() {return this.to.values;}},
		/**. ``''integer'' rows``: Retorna a quantidade de linhas da tabela.**/
    rows: {get: function() {return this.valueOf().length;}},
		/**. ``''integer'' cols``: Retorna a quantidade máxima de colunas da tabela.**/
    cols: {
    	get: function() {
    		const matrix = this.valueOf();
    		let cols = 0;
    		for (let i = 0; i < matrix.length; i++)
    			if (matrix[i].length > cols) cols = matrix[i].length;
    		return cols;
    	}
    },
    /**. ``''string'' caption``: Define ou retorna o valor do título da tabela.**/
		caption: {
		  get: function () {
		    return this.table.caption === null ? "" : this.table.caption.textContent;
		  },
		  set: function (x) {
		    if (this.table.caption === null) {
		      const node = document.createElement("CAPTION");
		      this.table.appendChild(node);
		    }
		    this.table.caption.textContent = String(x);
		  }
		},
		/**.FIXME reescrever isso ``''array'' cells(''object'' area, ''boolean'' value)``: Retorna uma lista de objetos contendo informações das células conforme especificado no argumento ``area`` com as seguintes propriedades:
		|Nome|Descrição|
		|row|Índice da linha de início da captura (padrão 0).|
		|col|Índice da coluna de início da captura (padrão 0).|
		|rows|Quantidade de linhas (padrão 1).|
		|cols|Quantidade de colunas (padrão 1).|
		. Se o argumento ''value'' for verdadeiro, retornará os valores textuais das células, caso contrário, o elemento HTML da célula. O conteúdo da lista é um objeto com as seguintes propriedades:
		|Nome|Descrição|
		|cell|Elemento HTML ou valor da célula.|
		|row|Número da linha|
		|col|Número da coluna|**/

		cell: {
			value: function(target, caller) {
				const groups = String(target).replace(/\s+/g, "").split(";");
				const change = new __Type(caller).function;
				const reCell = /^(\d+|\*)\,(\d+|\*)$/;
				const reArea = /^(\d+|\*)\,(\d+|\*)\:(\d+|\*)\,(\d+|\*)$/;
				const rows   = this.rows;
				const cols   = this.cols;
				const matrix = this.to.matrix
				const list   = [];
				let group, data, area, item, result;
				/*-- grupos separados por ";" --*/
				for (let i = 0; i < groups.length; i++) {
					/*-- capturando dados das células --*/
					group = groups[i];
					area  = reArea.test(group);
					if (area || reCell.test(group)) {
						data = {
							row1: group.replace((area ? reArea : reCell), "$1"),
							col1: group.replace((area ? reArea : reCell), "$2"),
							row2: area ? group.replace(reArea , "$3") : null,
							col2: area ? group.replace(reArea , "$4") : null
						};
						/*-- ajustando as células --*/
						for (let attr in data) {
							if (data[attr] === "*")
								data[attr] = ((/^row/).test(attr) ? rows : cols) - 1;
							if (data[attr] !== null)
								data[attr] = Number(data[attr]);
						}
						if (data.row2 === null) data.row2 = data.row1;
						if (data.col2 === null) data.col2 = data.col1;
						/*-- capturando dados --*/
						for (let row = data.row1; row <= data.row2; row++) {
							for (let col = data.col1; col <= data.col2; col++) {
								if (row < rows && col < matrix[row].length) {
									item   = matrix[row][col];
									result = change ? caller(item, row, col) : undefined;
									list.push(result === undefined ? item : result);
								}
							}
						}
					}
				}
				return list;
			}
		},





		/**.  ``''node'' plot(''object'' options)``: Retorna um gráfico de acordo com os dados da tabela e conforme especificado em ``options``:
		|Nome|Tipo|Descrição|
		|xLabel|string|Rótulo do eixo ''x''.|
		|yLabel|string|Rótulo do eixo ''y''.|
		|title|string|Título do gráfico.|
		|xAxis|string|Define a formatação da escala do eixo ''x'', se ''number'', ''date'', ''time'', ''datetime'' ou ''percent''.|
		|yAxis|string|Define a formatação da escala do eixo ''y'' (ver xAxis).|
		|type|string|Tipo de gráfico, ''plan'', ''cols'' ou ''pie''.|
		|data|array|Conjunto de dados de plotagem.|
		. Os itens da propriedade ``data`` são objetos com os seguintes especificações:
		|Nome|Tipo|Descrição|
		|x|any|Valores do eixo ''x'': um array, um objeto (cols ou pie) ou o número da coluna da tabela precedido de &num;.|
		|y|any|Valores do eixo ''y'', pode ser um array, uma função, uma constante ou o número da coluna precedido de &num;.|
		|label|string|Rótulo do gráfico.|
		|fit|string|Especifica o tipo do gráfico cartesiano.|
		. Os valores permitidos para o atributo ``fit`` são:
		|Valor|Descrição|Valores de Y|
		|sum|Exibe a soma aproximada da área dentro da curva.|function, constante, array, matrix|
		|avg|Exibe a média aproximada da curva.|function, array, matrix|
		|line|Liga os pontos do gráfico com um seguimento de reta.||
		|link|Liga os pontos do gráfico com um seguimento de reta lincado por um ponto.|array, matrix|
		|dots|Exibe os pontos do gráfico.|array, matrix|
		|linear|Executa um ajuste linear aproximado.||
		|exponential|Executa um ajuste exponencial aproximado.||
		|geometric|Executa um ajuste geométrico aproximado.||
		|logarithmic|Executa um ajuste logarítmo aproximado.||
		|minimum|Executa um ajuste com o menor desvio médio padrão.||**/
		plot: {
			value: function(options) {
				if (!__Type(options).object)     return null;
				if (!__Type(options.data).array) return null;
				if (options.data.length === 0)   return null;
				const chart = __Plot2D(options.type);
				/*-- valores gerais --*/
				const names = ["xLabel", "yLabel", "title", "xAxis", "yAxis"];
				for (let i = 0; i < names.length; i++)
					if (names[i] in options)
						chart[names[i]] = options[attr];
				/*-- adicionando dados --*/
				const re = /^\#(\d+)$/;
				for (let i = 0; i < options.data.length; i++) {
					let item = options.data[i];
					let col, arr;
					if (re.test(item.x)) {
						col = Number(item.x.replace(re, "$1"));
						arr = this.col(col, true);
						item.x = arr.slice(1);
					}
					if (re.test(item.y)) {
						col = Number(item.y.replace(re, "$1"));
						arr = this.col(col, true);
						item.y     = arr.slice(1);
						item.label = arr[0];
					}
					chart.add(item.x, item.y, item.label, item.fit);
				}
				return chart.plot();
			}
		},
	});

/*============================================================================*/
	/**### Requisições e Leituras
	#### Resposta
	``**constructor** ''object'' __Response(''function'' trigger)``
	Construtor para [requisições Web](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) ou leituras de [arquivos](https://developer.mozilla.org/en-US/docs/Web/API/FileReader). O argumento opcional ``trigger`` define o disparador a ser invocado a cada mudança ou encerramento da requisição. O disparador receberá a cada atualização um objeto com as seguintes propriedades:
	|Nome|Descrição|
	|done|Booleano que indica o fim do processo.|
	|ok|Indica, ao fim do processo, se o procedimento foi concluído com sucesso.|
	|status|Traz, ao fim do processo, uma mensagem sobre o procedimento.|
	|time|Indica o tempo de execução do processo.|
	|size|Indica a quantidade de trabalho do processo.|
	|progress|Indica o progresso do processo (de 0 a 1).|
	|headers|Traz, ao fim do processo e se aplicável, o cabeçalho de retorno (Headers ou object).|
	|response|Traz, ao fim do processo, o conteúdo do procedimento ou nulo se inaplicável.|
	|abort()|Uma função para abortar o procedimento.|**/
	function __Response(trigger) {
		if (!(this instanceof __Response)) return new __Response(trigger);
		Object.defineProperties(this, {
			_trigger:  {value: __Type(trigger).function ? trigger : null},
			_start:    {value: new Date().valueOf()},
			_fetch:    {value: null,  writable: true},
			_aborted:  {value: false, writable: true},
			_response: { value: {
					done: false,
					ok: null,
					status: null,
					time: 0,
					size: 0,
					progress: 0,
					headers: null,
					response: null,
					abort: null,
				}
			}
		});
		__PROGRESS.open();
	}
	Object.defineProperties(__Response.prototype, {
		constructor: {value: __Response},
		/**. ``''void'' _changes(''string'' type, ''string'' caller)``: Define o formato da resposta conforme tipo (``type``) e o método (``caller``).**/
		_changes: {
			value: function(type, caller) {
				if (this._response.response !== null) {
					const parser = new __Parser(this._response.response);
					const change = {
						read: {
							xml:    function() {return parser.stringXML.get();},
							html:   function() {return parser.stringHTML.get();},
							json:   function() {return parser.stringJSON.get();},
							table:  function() {return parser.csvTable.get();},
							matrix: function() {return parser.csvTable.tableValues.get();},
							csv:    function() {return parser.csvTable.tableValues.matrixList.get();}
						},
						send: {
							url:    function() {return parser.fileURL.get();},
							table:  function() {return parser.csvTable.get();},
							matrix: function() {return parser.csvTable.tableValues.get();},
							csv:    function() {return parser.csvTable.tableValues.matrixList.get();}
						},
						fetch: {
							url:    function() {return parser.fileURL.get();},
							table:  function() {return parser.csvTable.get();},
							matrix: function() {return parser.csvTable.tableValues.get();},
							csv:    function() {return parser.csvTable.tableValues.matrixList.get();}
						}
					}
					if (type in change[caller])
						this._response.response = change[caller][type]();
				}
				return;
			}
		},
		/**. ``''void'' send(''object'' ev, ''object'' config)``: Disparador para o método ``send`` de __Request. O argumento ``ev`` é o evento disparador e ``config``os dados de configuração da requisição.**/
		send: {
			value: function(ev, config) {
				if (this._response.done) return;
				const target = ev.target;
				const type   = ev.type;
				const done   = {loadend: 1, error: 0, abort: 0, timeout: 0};
				this._response.time   = (new Date().valueOf()) - this._start;
				if (this._response.abort === null && target instanceof XMLHttpRequest)
					this._response.abort = function() {return target.abort();}
				if (ev.lengthComputable === true) {
					this._response.size = ev.total;
					this._response.progress = ev.loaded/ev.total;
					__PROGRESS.set(ev.loaded/ev.total);
				}
				if (target instanceof XMLHttpRequest && type in done) {
					const code = target.status;
					const text = target.statusText;
					const fail = done[type] === 0;
					this._response.done   = true;
					this._response.status = fail ? type  : (code + " - " + text);
					this._response.ok     = fail ? false : (code >= 200 && code < 300);
				}
				if (this._response.ok) {
					const dataset = new __DataSet(target.getAllResponseHeaders());
					this._response.headers  = dataset.toHeaders;
					this._response.response = target.response;
					this._changes(config.type, "send");
				}
				if (this._trigger !== null) this._trigger(this._response);
				if (this._response.done) __PROGRESS.close();
				return;
			}
		},
		/**. ``''void'' read(''object'' ev, ''object'' config)``: Disparador para o método ``read`` de __Request. O argumento ``ev`` é o evento disparador e ``config``os dados de configuração da leitura.**/
		read: {
			value: function(ev, config) {
				if (this._response.done) return;
				const target = ev.target;
				let   type   = ev.type;
				const done   = {loadend: 1, error: 0, abort: 0, timeout: 0};
				this._response.time = (new Date().valueOf()) - this._start;
				if (config.timeout > 0 && !(type in done)) {
					if (this._response.time > config.timeout) type = "timeout";
				}
				if (this._response.abort === null)
					this._response.abort = function() {return target.abort();}
				if (ev.lengthComputable === true) {
					this._response.size = ev.total;
					this._response.progress = ev.loaded/ev.total;
					__PROGRESS.set(ev.loaded/ev.total);
				}
				if (type in done) {
					const code = target.readyState;
					const text = ["EMPTY", "LOADING", "DONE"]
					const fail = done[type] === 0;
					this._response.done   = true;
					this._response.status = fail ? type : (text[code]);
					this._response.ok     = !fail;
				}
				if (this._response.ok) {
					this._response.response = target.result;
					this._changes(config.type, "read");
				}
				if (this._trigger !== null) this._trigger(this._response);
				if (this._response.done)
					__PROGRESS.close();
				return;
			}
		},
		/**. ``''boolean'' fetch(''object'' ev, ''object'' config)``: Disparador para o método ``fetch`` de __Request. O argumento ``ev`` é o retorno do ação e ``config``os dados de configuração da requisição. Retorna falso se os eventos precários "timeout" e "aborted" ocorrerem.**/
		fetch: {
			value: function(ev, config) {
				if (this._response.done) return;
				const self     = this;
				const progress = {EMPTY: 0, LOADEND: 1/2, DONE: 1};
				this._response.time = (new Date().valueOf()) - this._start;
				this._response.progress = progress[config._status];

				if (this._response.abort === null) {
					this._response.abort = function() {self._aborted = true;}
				}
				if (this._aborted) {
					this.error("aborted");
					return false;
				}
				if (config.timeout > 0 && this._response.time > config.timeout) {
					this.error("timeout");
					return false;
				}
				if (config._status === "LOADEND") {
					this._fetch = ev;
				}
				else if (config._status === "DONE") {
					const fetch = this._fetch;
					this._response.done     = true;
					this._response.ok       = fetch.ok;
					this._response.status   = fetch.status + " - " + fetch.statusText;
					this._response.headers  = fetch.headers;
					this._response.response = ev;
					this._changes(config.type, "fetch");
				}

				__PROGRESS.set(this._response.progress);

				if (this._trigger !== null) this._trigger(this._response);
				if (this._response.done)
					__PROGRESS.close();
				return true;
			}
		},
		/**. ``''void'' error(''string'' status)``: Disparador para casos de erro em __Request. O argumento ``status`` é a mensagem de erro.**/
		error: {
			value: function(status) {
				this._response.time     = (new Date().valueOf()) - this._start;
				this._response.progress = 1;
				this._response.done     = true;
				this._response.ok       = false;
				this._response.status   = status;
				if (this._trigger !== null) this._trigger(this._response);
				__PROGRESS.close();
				return;
			}
		}
	});

/*----------------------------------------------------------------------------*/
	/**#### Requisição
	``**constructor** ''object'' __Request(''object'' config)``
	Construtor para [requisições Web](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) ou leituras de [arquivos](https://developer.mozilla.org/en-US/docs/Web/API/FileReader). O argumento ``config`` aceita os mesmos valores do objeto ``__Dataset`` e contem as propriedades da requisição de acordo com o método escolhido, sendo os básicos:
	|Nome|Referência|Aplicação|
	|url|Alvo da requisição ou da leitura, não necessariamento um URL|send, read e fetch|
	|method|Método da Requisição (padrão é post)|send e fetch|
	|type|Tipo de resposta a retornar (padrão text)|send, read e fetch|
	|headers|Cabeçalhos a enviar (ver __DataSet|send e fetch|
	|body|Dados a enviar na requisição|send e fetch|
	|timeout|Tempo de espera pela resposta|send, read e precariamente em fetch|**/
	function __Request(config) {
		if (!(this instanceof __Request)) return new __Request(config);
		const dataset = new __DataSet(config);
		Object.defineProperties(this, {
			_config: {value: dataset.toObject},
		});
	}
	Object.defineProperties(__Request.prototype, {
		constructor: {value: __Request},
		/**. ``''array'' _events``: Array contendo os eventos de XMLHttpRequest e FileReader.**/
		_events: {
			value: ("onabort onerror onload onloadend onloadstart onprogress ontimeout").split(" ")
		},
		/**. ``''array'' _methods``: Array contendo os métodos para requisições web.**/
		_methods: {
			value: ("post connect delete get head options patch put trace").split(" ")
		},
		/**. ``''object'' _types``: Objeto contendo a configuração de responseType conforme definido na propriedade ``type``:
		|Propriedade|Retorno|Exceção|
		|text|Conteúdo em string.|Escolha padrão.|
		|blob|Conteúdo em arquivo.|``read`` retorna como BinaryString.|
		|html|Conteúdo em documento HTML.|``send`` e ``fetch`` retorna um Document.|
		|xml|Conteúdo em documento XML.|``send`` e ``fetch`` retorna um Document.|
		|json|Conteúdo em JSON.|-|
		|buffer|Conteúdo em ArrayBuffer.|-|
		|url|Conteúdo em ObjectURL.|-|
		|matrix|Conteúdo em Array a partir de dados/arquivo CSV.|-|
		|table|Conteúdo em nó HTML ''table'' a partir de dados/arquivo CSV.|-|
		|css|Conteúdo em lista de objetos a partir de dados/arquivo CSV.|-|**/
		_types: {
			value: {
				text:   {send: "text",        read: "readAsText",         fetch: "text"},
				blob:   {send: "blob",        read: "readAsBinaryString", fetch: "blob"},
				html:   {send: "document",    read: "readAsText",         fetch: "document"},
				xml:    {send: "document",    read: "readAsText",         fetch: "document"},
				json:   {send: "json",        read: "readAsText",         fetch: "json"},
				buffer: {send: "arraybuffer", read: "readAsArrayBuffer",  fetch: "arrayBuffer"},
				url:    {send: "blob",        read: "readAsDataURL",      fetch: "blob"},
				matrix: {send: "text",        read: "readAsText",         fetch: "text"},
				table:  {send: "text",        read: "readAsText",         fetch: "text"},
				csv:    {send: "text",        read: "readAsText",         fetch: "text"},
			}
		},
		/**. ``''object'' _cfg(''string'' caller)``: Retorna a configuração adaptada ao tipo de chamada (``caller``).**/
		_cfg: {
			value: function(caller) {
				/*-- clonando --*/
				const cfg = {};
				for (let i in this._config) cfg[i] = this._config[i];
				/*-- cabeçalho --*/
				if (caller === "send" || caller === "fetch") {
					const dataset  = new __DataSet(cfg["headers"]);
					cfg["headers"] = dataset[caller === "send" ? "toObjectHeaders" : "toHeaders"];
				}
				/*-- Método --*/
				if (caller === "send" || caller === "fetch") {
					cfg.method = __Type(cfg.method).nonempty ? cfg.method.toLowerCase().trim() : "post";
					if (this._methods.indexOf(cfg.method) < 0)
						cfg.method = "post"
				}
				/*-- Tipo de resposta --*/
				if (caller === "send" || caller === "fetch") {
					if (!(cfg.type in this._types))
						cfg.type = "text";
					cfg.responseType = this._types[cfg.type][caller];
				} else {
					const type = cfg.url.type.split("/")[0].toLowerCase().trim();
					const file = ["image", "audio", "video"];
					if (!(cfg.type in this._types))
						cfg.type = file.indexOf(type) < 0 ? "text" : "url";
					cfg.responseType = this._types[cfg.type][caller];
				}
				/*-- específico para o método send --*/
				if (caller === "send") {
					const data = {async: true, user: null, password: null};
					for (let i in data)
						if (!(i in cfg)) cfg[i] = data[i];
				}
				/*-- timeout --*/
				const time  = __Type(cfg.timeout);
				cfg.timeout = time.finite && time.positive ? Math.trunc(time.value) : 0;

				return cfg;
			}
		},
		/**. ``''void'' send(''function'' trigger)``: Envia uma requisição ao servidor via XMLHttpRequest e executa o argumento opcional ``trigger`` a cada atualização (ver __Response). As seguintes propriedades opcionais específicas estão disponíveis:
		|Nome|Descrição|
		|async|Indica se a requisição é assíncrona (padrão verdadeiro)|
		|user|Usuário (padrão nulo)|
		|password|Senha (padrão nulo)|
		|withCredentials|Aplica-se à propriedade de mesmo nome|
		|overrideMimeType|Aplica-se ao método de mesmo nome|**/
		send: {
			value: function(trigger) {
				const request  = new XMLHttpRequest();
				const response = new __Response(trigger);
				const cfg      = this._cfg("send");
				try {
					request.open(cfg.method, cfg.url, cfg.async, cfg.user, cfg.password);
					request.responseType = cfg.responseType;
					request.timeout      = cfg.timeout;
					for (let i in cfg.headers)
						request.setRequestHeader(i, cfg.headers[i]);
					if ("withCredentials" in cfg)
						request.withCredentials = cfg.withCredentials;
					if ("overrideMimeType" in cfg)
						request.overrideMimeType(cfg.overrideMimeType);
					for (let v of this._events) {
						if (v in request)
							request[v] = function (ev) {response.send(ev, cfg);};
						if (v in request.upload)
							request.upload[v] = function (ev) {response.send(ev, cfg);};
					}
					request.send(cfg.body);
				} catch(e) {
					response.error(e.name + "- " + e.message);
				}
				return;
			},
		},
		/**. ``''void'' read(''function'' trigger)``: Lê um arquivo via FileReader e executa o argumento opcional ``trigger`` a cada atualização (ver __Response)**/
		read: {
			value: function(trigger) {
				if (__Type(this._config.url).instanceOf("FileList")) {
					const obj = {};
					for (let i in this._config) obj[i] = this._config;
					for (let i = 0; i < cfg.url.length; i++) {
						obj.url = cfg.url[i];
						let data = new __Request(obj);
						data.read(trigger);
					}
					return;
				}
				const request  = new FileReader();
				const response = new __Response(trigger);
				const cfg      = this._cfg("read");
				try {
					for (let v of this._events) {
						if (v in request)
							request[v] = function (ev) {response.read(ev, cfg);};
					}
					request[cfg.responseType](cfg.url);
				} catch(e) {
					response.error(e.name + " - " + e.message);
				}
				return;
			},
		},
		/**. ``''void'' fetch(''function'' trigger)``: Envia uma requisição ao servidor via fetch e executa o argumento opcional ``trigger`` a cada atualização (ver __Response). As propriedades são as mesmas utilizadas no método nativo, exceto ''url''.**/
		fetch: {
			value: function(trigger) {
				const request  = new FileReader();
				const response = new __Response(trigger);
				const cfg      = this._cfg("fetch");

				try {
					cfg._status = "EMPTY";
					response.fetch(null, cfg);
					/*-- chamando fetch --*/
					fetch(cfg.url, cfg)
					.then(function(output) {
						cfg._status = "LOADEND";
						if (output.ok) {
							if (response.fetch(output, cfg)) {
								cfg._status = "DONE"
								output[cfg.responseType]()
								.then(function(data) {response.fetch(data, cfg);})
								.catch(function (e)  {response.fetch(null, cfg);});
							}
						} else {
							if (response.fetch(output, cfg)) {
								cfg._status = "DONE"
								response.fetch(null, cfg);
							}
						}
					})
					.catch(function(e) {
						response.error(e.name + " - " + e.message);
					});
				} catch(e) {
					response.error(e.name + " - " + e.message);
				}
				return;
			},
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
		const svg  = this.create("svg");
		const vbox = [xmin, ymin, width, height];
		const main = [0, 0, 100, 100];
		for (let i = 0; i < vbox.length; i++)
			vbox[i] = __Type(vbox[i]).finite ? Number(vbox[i]) : main[i];
		svg.setAttribute("viewBox", vbox.join(" "));
		Object.defineProperties(this, {
			_svg:  {value: svg},
			_last: {value: svg, writable: true}
		});
	}
	Object.defineProperties(__SVG.prototype, {
		constructor: {value: __SVG},
		/**. ``''node'' last``: Define (adiciona) ou retorna o último nó adicionado ao SVG.**/
		last: {
			get: function()  {return this._last;},
			set: function(svg) {
				this._svg.appendChild(svg);
				this._last = svg;
			}
		},
		/**. ``''node'' create(''string'' tag)``: Retorna um novo elemento SVG do tipo informado em ``tag``.**/
		create: {
			value: function(tag) {
				return document.createElementNS("http://www.w3.org/2000/svg", tag);
			}
		},
		/**. ``''self'' close()``: Clona o último elemento adicionado e o define no lugar.**/
		clone: {
			value: function() {
				this.last = this.last.cloneNode(true);
				return this;
			}
		},
		/**. ``''number'' xmin``: Retorna e define o valor de ``xmin``.**/
		xmin: {
			get: function()  {return this._svg.viewBox.baseVal.x;},
			set: function(x) {
				if (__Type(x).finite)	this._svg.viewBox.baseVal.x = Number(x);
			}
		},
		/**. ``''number'' ymin``: Retorna e define o valor de ``ymin``.**/
		ymin: {
			get: function()  {return this._svg.viewBox.baseVal.y;},
			set: function(y) {
				if (__Type(y).finite)	this._svg.viewBox.baseVal.y = Number(y);
			}
		},
		/**. ``''number'' width``: Retorna e define o valor de ``width``.**/
		width: {
			get: function()  {return this._svg.viewBox.baseVal.width;},
			set: function(w) {
				if (__Type(w).finite)	this._svg.viewBox.baseVal.width = Number(w);}
		},
		/**. ``''number'' height``: Retorna e define o valor de ``height``.**/
		height: {
			get: function()  {return this._svg.viewBox.baseVal.height;},
			set: function(h) {
				if (__Type(h).finite)	this._svg.viewBox.baseVal.height = Number(h);}
		},
		/**. ``''self'' attribute(''object'' attr)``: Define os atributos do último elemento adicionado. O argumento ``attr`` é um objeto cujas chaves representam o valor do atributo e seu respectivo valores.**/
		attribute: {
			value: function(attr) {
				if (__Type(attr).object)
					for (let i in attr) this.last.setAttribute(i, attr[i]);
				return this;
			}
		},
		/**. ``''self'' title(''string'' value)``: Define um título (dica) ao último elemento adicionado. O argumento ``value`` é o texto da dica.**/
		title: {
			value: function(value) {
				const svg = this.create("title");
				svg.textContent = value;
				this.last.appendChild(svg);
				return this;
			}
		},
		/**. ``''self'' line(''array'' p1, ''array'' p2)``: Define uma linha ligando dois pontos das coordenadas. Os argumentos ``p1`` e ``p2`` são as coordenadas (x,y).**/
		line: {
			value: function(p1, p2) {
				this.last = this.create("line");
				return this.attribute({x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1]});
			}
		},
		/**. ``''self'' lines(''array'' x, ''array'' y, ''boolean'' close=false)``: Define diversos segmentos de reta a partir de um conjunto de coordenadas. Os argumentos ``x`` e ``y`` são as coordenadas (x,y) e o argumento ``close`` indica se o último ponto deve voltar à origem.**/
		lines: {
			value: function(x, y, close) {
				this.last = this.create("path");
				let line = x.slice();
				line.forEach(function(v,i,a) {
					a[i] = [(i === 0 ? "M" : "L"), v, y[i]].join(" ");
				});
				if (close === true) x.push("Z");
				return this.attribute({d: line.join(" ")});
			}
		},
		/**. ``''self'' circle(''number'' cx, ''number'' cy, ''number'' r)``: Define um círculo. Os argumentos ``cx``, ``cy`` e ``r`` são o centro em x e y e o raio, respectivamente.**/
		circle: {
			value: function(cx, cy, r) {
				this.last = this.create("circle");
				return this.attribute({cx: cx, cy: cy, r: r});
			}
		},
		/**. ``''self'' semicircle(''number'' cx, ''number'' cy, ''number'' r, ''number'' start, ''number'' width)``: Define um semicírculo. Os argumentos ``cx``, ``cy`` e ``r`` são o centro em x e y e o raio, respectivamente. Os argumentos ``start`` e ``width`` indicam o ângulo inicial e seu tamanho em graus, respectivamente.**/
		semicircle: {
			value: function(cx, cy, r, start, width) {
				this.last = this.create("path");
				if (Math.abs(width) >= 360) return this.circle(cx, cy, r);
				start  = 2*Math.PI*start/360;
				width  = 2*Math.PI*width/360;
				if (width < 0) {
					start += width;
					width  = Math.abs(width);
				}
				const x1 = cx + r*Math.cos(start);
				const y1 = cy - r*Math.sin(start);
				const x2 = cx + r*Math.cos(start + width);
				const y2 = cy - r*Math.sin(start + width);
				const lg = width > Math.PI ? 1 : 0;
				const  d = ["M", cx, cy, "L", x1, y1, "A", r, r, 0, lg, 0, x2, y2, "Z"];
				return this.attribute({d: d.join(" ")});
			}
		},
		/**. ``''self'' rect(''number'' x, ''number'' y, ''number'' width, ''number'' height)``: Define um retângulo. Os argumentos ``x`` e ``y`` definem o ponto de partida da figura e os argumentos ``width`` e ``height`` definem o comprimento e a altura do retângulo, respectivamente.**/
		rect: {
			value: function(x, y, width, height) {
				this.last = this.create("rect");
				return this.attribute({x: x, y: y, width: width, height: height});
			}
		},
		/**. ``''self'' path(''string'' path)``: Define um nó SVG a partir de uma sequência de comandos. O argumento ``path`` define os comandos.**/
		path: {
			value: function(path) {
				this.last = this.create("path");
				return this.attribute({d: path});
			}
		},
		/**. ``''self'' text(''number'' x, ''number'' y, ''string|array'' text, ''string'' point)``: Define um SVG textual. Os argumentos ``x`` e ``y`` definem o posicionamento. O argumento ``text``, se lista, criará um elemento ''tspan'' para cada item empilhados e, se texto, criará um elemento ''text''. O argumento ``point`` define a posição (vertical/horizontal) e a âncora do texto. O primeiro caractere define a posição, ''v'' para vertical e ''h'' para horizontal, os demais definem a âncora conforme pontos cardeais: ''n, ne, e, se, s, sw, w, nw'' e ''c'' para o meio.**/
		text: {
			value: function(x, y, text, point) {
				/*-- definindo atributos do texto --*/
				const vanchor = ["start", "middle", "end"];
				const vbase   = ["auto", "middle", "hanging"];
				const anchor  = {n: 1, ne: 2, e: 2, se: 2, s: 1, sw: 0, w: 0, nw: 0, c: 1};
				const base    = {n: 2, ne: 2, e: 1, se: 0, s: 0, sw: 0, w: 1, nw: 2, c: 1};
				const attr    = {
					x: point[0] === "v" ? -y : x,
					y: point[0] === "v" ?  x : y,
					"text-anchor":       vanchor[anchor[point.substring(1)]],
					"dominant-baseline": vbase[base[point.substring(1)]],
					"transform":         point[0] === "v" ? "rotate(270)" : "",
				};
				this.last = this.create("text");
				this.last.style.whiteSpace = "break-spaces";
				this.attribute(attr);
				/*-- definindo texto em linha ou empilhado --*/
				if (!__Type(text).array) {
					const value = String(text);
					const tspan = this.create("tspan");
					tspan.textContent = value == "" ? " " : value;
					this.last.appendChild(tspan);
				} else {
					for (let i = 0; i < text.length; i++) {
						let style = {x: attr.x, dy: (i === 0 ? 0 : "1.5em")};
						let value = String(text[i]);
						let tspan = this.create("tspan");
						tspan.textContent = value === "" ? " " : value;
						for (let j in style) tspan.setAttribute(j, style[j]);
						this.last.appendChild(tspan);
					}
				}
				return this;
			}
		},
		/**. ``''self'' ellipse(''number'' cx, ''number'' cy, ''number'' rx, ''number'' ry)``: Define uma elípse.Os argumentos ``cx``, ``cy``, ``rx`` e ``ry`` definem o centro de referência em x e y e os raios de x e y, respectivamente.**/
		ellipse: {
			value: function(cx, cy, rx, ry) {
				this.last = this.create("ellipse");
				return this.attribute({cx: cx, cy: cy, rx: rx, ry: ry});
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
	O argumento ``x`` corresponde a uma lista de valores (array) de referência que aceita valores finitos e de data/tempo, conforme regras da biblioteca.
	O argumento ``y`` é a resposta em função de ``x``, podendo ser uma lista de valores do mesmo tipo que ``x``, uma constante ou uma função. No caso de função, ``y`` receberá o valor de ``y(x)``.
	Valores não finitos serão eliminados do conjunto ``(x, y)``.**/
	function __Data2D(x, y) {
		if (!(this instanceof __Data2D)) return new __Data2D(x, y);
		const xtest = __Type(x);
		const ytest = __Type(y);
		function dataArray(n) {
			const check = __Type(n);
			if (check.finite)
				return check.value;
			if (check.date || check.time || check.datetime)
				return new __DateTime(n).valueOf();
			return null;
		}

		/*-- avaliando X --*/
		x = __Array(xtest.array ? x : []).convert(dataArray, "finite");
		/*-- avaliando Y --*/
		if (ytest.array)
			y = __Array(y).convert(dataArray, "finite");
		else if (ytest.finite)
			y = __Array(x).convert(function(n) {return ytest.value;}, "finite");
		else if (ytest.date || ytest.time || ytest.datetime)
			y = __Array(x).convert(function(n) {return new __DateTime(y).valueOf();}, "finite");
		else if (ytest.function)
			y = __Array(x).convert(y, "finite");
		else
			y = [];

		/*-- igualando conjunto --*/
		const less = y.length < x.length ? y : x;
		const data = [];
		for (let i = 0; i < less.length; i++) {
			if (x[i] !== null && y[i] !== null)
				data.push({x: x[i], y: y[i]});
		}
		/*-- ordenando em x --*/
		data.sort(function(a,b) {
			return a.x === b.x ? 0 : (a.x < b.x ? -1 : 1);
		});

		/*-- retornando valores --*/
		const sortx = [];
		const sorty = [];
		for (let i = 0; i < data.length; i++) {
			sortx.push(data[i].x);
			sorty.push(data[i].y);
		}
		Object.defineProperties(this, {
			/**. ``''array'' x``: Registra os valores do argumento ``x`` ajustado.**/
			x: {value: sortx},
			/**. ``''array'' y``: Retorna os valores do argumento ``y`` ajustado.**/
			y: {value: sorty},
			/**. ``''boolean'' error``: Se o conjunto tiver menos que um par de valores, retornará verdadeiro.**/
			error: {value: sortx.length < 2 || sorty.length < 2}
		});
	}

	Object.defineProperties(__Data2D.prototype, {
		constructor: {value: __Data2D},
		/**. ``''object'' leastSquares``: Aplica o método dos mínimos quadrados ao conjunto de dados e retorna objeto contendo o coeficiente angular ``a`` e o linear ``b`` de ``y = ax + b``.**/
		leastSquares: {
			get: function () {
				if (this.error) return {a: 0, b: 0};
				if ("_leastSquares" in this) return this._leastSquares;
				const x   = this.x;
				const y   = this.y;
				const len = x.length;
				let sumX  = 0;
				let sumY  = 0;
				let sumX2 = 0;
				let sumXY = 0;
				for (let i = 0; i < len; i++) {
					sumX  += x[i];
					sumY  += y[i];
					sumX2 += x[i]*x[i];
					sumXY += x[i]*y[i];
				}
				const data = {};
				data.a = ((len * sumXY) - (sumX * sumY)) / ((len * sumX2) - (sumX * sumX));
				data.b = ((sumY) - (sumX * data.a)) / (len);
				this._leastSquares = data;
				return this.leastSquares;
			}
		},
		/**. ``''object'' standardDeviation``: Retorna o desvio padrão entre o conjunto de dados.**/
		standardDeviation: {
			get: function() {
				if (this.error) return Infinity;
				if ("_standardDeviation" in this) return this._standardDeviation;
				const data = [];
				for (let i = 0; i < this.x.length; i++)
					data.push(this.x[i] - this.y[i]);
				this._standardDeviation = Math.hypot.apply(null, data) / Math.sqrt(data.length);
				return this._standardDeviation;
			}
		},
		/**. ``''object'' linearFit``: Retorna um objeto contendo os dados da regressão linear ou ``null`` em caso de erro.
		. O objeto retornado possui as chaves ``t`` (tipo/nome da regressão); ``a`` e ``b`` (coeficientes da regressão); ``f`` (função da regressão); ``d``: (desvio padrão), ``m`` (representação visual da regressão); e ``s`` (igual a ``m`` mas exibindo os coeficientes).**/
		linearFit: {
			get: function() {
				if (this.error) return null;
				if ("_linearFit" in this) return this._linearFit;
				const X    = new __Array(this.x);
				const Y    = new __Array(this.y);
				const sqrs = this.leastSquares;
				const fit  = {};
				fit.a = sqrs.a;
				fit.b = sqrs.b;
				fit.f = function(x) {return fit.a*x + fit.b;}
				fit.d = new __Data2D(this.y, X.convert(fit.f, "finite")).standardDeviation;
				fit.m = "y = a x + (b) ± σ";
				fit.s = fit.m.toString()
				const cte = {a: "a", b: "b", d: "σ"};
				for (let k in cte) fit.s = fit.s.replace(cte[k], fit[k]);
				this._linearFit = fit;
				return fit;
			}
		},
		/**. ``''object'' geometricFit``: Retorna um objeto contendo os dados da regressão geométrica ou ``null`` em caso de erro.
		. O objeto retornado possui as mesmas caractrísticas de ``linearFit``. **/
		geometricFit: {
			get: function() {
				if (this.error) return null;
				if ("_geometricFit" in this) return this._geometricFit;
				const X    = new __Array(this.x);
				const Y    = new __Array(this.y);
				const data = new __Data2D(
					X.convert(Math.log, "finite"),
					Y.convert(Math.log, "finite")
				);
				if (data.error) {
					this._geometricFit = null;
					return null;
				}
				const sqrs = data.leastSquares;
				const fit  = {};
				fit.a = Math.exp(sqrs.b);
				fit.b = sqrs.a;
				fit.f = function(x) {return fit.a*Math.pow(x, fit.b);}
				fit.d = __Data2D(this.y, X.convert(fit.f, "finite")).standardDeviation;
				fit.m = "y = a x^(b) ± σ";
				fit.s = fit.m.toString();
				const cte = {a: "a", b: "b", d: "σ"};
				for (let k in cte) fit.s = fit.s.replace(cte[k], fit[k]);
				this._geometricFit = fit;
				return fit;
			}
		},
		/**. ``''object'' exponentialFit``: Retorna um objeto contendo os dados da regressão exponencial ou ``null`` em caso de erro.
		. O objeto retornado possui as mesmas caractrísticas de ``linearFit``. **/
		exponentialFit: {
			get: function() {
				if (this.error) return null;
				if ("_exponentialFit" in this) return this._exponentialFit;
				const X    = new __Array(this.x);
				const Y    = new __Array(this.y);
				const data = new __Data2D(this.x, Y.convert(Math.log, "finite"));
				if (data.error) {
					this._exponentialFit = null;
					return null;
				}
				const sqrs = data.leastSquares;
				const fit  = {};
				fit.a = Math.exp(sqrs.b);
				fit.b = sqrs.a;
				fit.f = function(x) {return fit.a*Math.exp(fit.b*x);}
				fit.d = __Data2D(this.y, X.convert(fit.f, "finite")).standardDeviation;
				fit.m = "y = a exp(b x) ± σ";
				fit.s = fit.m.toString();
				const cte = {a: "a", b: "b", d: "σ"};
				for (let k in cte) fit.s = fit.s.replace(cte[k], fit[k]);
				this._exponentialFit = fit;
				return fit;
			}
		},
		/**. ``''object'' logarithmicFit``: Retorna um objeto contendo os dados da regressão logarítmica ou ``null`` em caso de erro.
		. O objeto retornado possui as mesmas caractrísticas de ``linearFit``.**/
		logarithmicFit: {
			get: function() {
				if (this.error) return null;
				if ("_logarithmicFit" in this) return this._logarithmicFit;
				const X    = new __Array(this.x);
				const Y    = new __Array(this.y);
				const data = new __Data2D(this.x, Y.convert(Math.exp, "finite")
				);
				if (data.geometricFit === null) {
					this._logarithmicFit = null;
					return null;
				}
				const sqrs = data.geometricFit;
				const fit  = {};
				fit.a = sqrs.b;
				fit.b = Math.pow(sqrs.a, 1/sqrs.b);
				fit.f = function(x) {return fit.a*Math.log(fit.b*x);}
				fit.d = __Data2D(this.y, X.convert(fit.f)).standardDeviation;
				fit.m = "y = a ln(b x) ± σ";
				fit.s = fit.m.toString();
				const cte = {a: "a", b: "b", d: "σ"};
				for (let k in cte) fit.s = fit.s.replace(cte[k], fit[k]);
				this._logarithmicFit = fit;
				return fit;
			}
		},
		/**. ``''object'' minDeviation``: Retorna o objeto contendo os dados da regressão com o menor valor de desvio padrão.**/
		minDeviation: {
			get: function() {
				if (this.error) return null;
				if ("_minDeviation" in this) return this._minDeviation;
				const fit  = ["linear", "geometric", "exponential", "logarithmic"];
				const best = {value: Infinity, name: null};
				for (let i = 0; i < fit.length; i++) {
					let id = fit[i]+"Fit";
					if (this[id] !== null && this[id].d < best.value) {
						 best.value = this[id].d;
						 best.name  = id;
						 if (best.value === 0) break;
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
				const x  = this.x;
				const y  = this.y;
				let area = 0;
				for (let i = 1; i < x.length; i++)
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
    		const data = new __Array(this.x);
    		const div  = data.max - data.min;
    		this._average = div === 0 ? null : this.area / div;
    		return this._average;
    	}
    },
	});
/*============================================================================*/
	/**#### Análise Gráfica

	###### ``**constructor** ''object'' __Plot2D(''string'' type)``
	Objeto para preparar dados para construção de gráfico 2D. O argumento ``type`` define o tipo do gráfico:
	|Valor|Descrição|
	|plan|Gráfico cartesiano xy (padrão)|
	|cols|Gráfico de colunas|
	|pie|Gráfico circular ou gráfico de colunas se houver valores negativos|**/
	function __Plot2D(type) {
		if (!(this instanceof __Plot2D)) return new __Plot2D(type);
		type = String(type).toLowerCase();
		const types = ["plan", "cols", "pie"];
		const chart = types.indexOf(type) < 0 ? types[0] : type;
		Object.defineProperties(this, {
			_chart:  {value: chart},                        /* tipo do gráfico */
			_title:  {value: "Title",   writable: true},    /* título do gráfico */
			_xLabel: {value: "X Label", writable: true},    /* nome do eixo x */
			_yLabel: {value: "Y Label", writable: true},    /* nome do eixo y */
			_xAxis:  {value: "default", writable: true},    /* tipo de dado do eixo x */
			_yAxis:  {value: "default", writable: true},    /* tipo de dado do eixo y */
			_id:     {value: -1,        writable: true},    /* controle das plotagens */
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
		/**. ``''number'' _xScale(''number'' x)``: Transforma a coordenada horizontal real ''x'' para gráfica.**/
		_xScale: {
			value: function(x) {
				let dx = this._xMax - this._xMin;
				let dX = this._cfg.xSize;
				let  X = ((x - this._xMin)*(dX/dx)) + this._cfg.xStart;
				return X;
			}
		},
		/**. ``''number'' _yScale(''number'' y)``: Transforma a coordenada vertical real (''y'') para gráfica.**/
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
				const x   = [this._xMin];
				const max = this._xMax;
				const dx  = this._dx;
				const mid = (this._xMax + this._xMin)/2;
				let value = -Infinity;
				while (value < max) {
					value = x[x.length - 1] + dx;
					/*-- número central de x (manter nessa posição) --*/
					if (value > mid && (value-dx) < mid) x.push(mid);
					x.push(value <= max ? value : max);
				}
				return x;
			}
		},
		/**. ``''object'' _cfg``: Registra as configurações do gráfico:
		|Nome|Tipo|Descrição|
		|vertical|number|registra o menor tamanho da tela do dispositivo.|
		|horizontal|number|registra o maior tamanho da tela do dispositivo.|
		|xInit|number|Registra o início do eixo horizontal ``x`` (porcentagem).|
		|xEnd|number|Registra o fim do eixo horizontal ``x`` (porcentagem).|
		|yInit|number|Registra o início do eixo vertical ``y`` (porcentagem).|
		|yEnd|number|Registra o fim do eixo vertical ``y`` (porcentagem).|
		|points|number|Número de divisões dos eixos no gráfico (impar).|
		|padd|number|Define um valor para espaçamento relativo (porcentagem).|
		|width|number|Define a dimensão horizontal do gráfico.|
		|height|number|Retorna a dimensão vertical do gráfico proporcional à ``width``.|
		|xStart|number|Coordenada horizontal da origem do gráfico.|
		|xSize|number|Tamanho do eixo ``x``.|
		|xMiddle|number|Metade do eixo ``x``.|
		|xClose|number|Fim do eixo ``x``.|
		|yStart|number|Coordenada vertical da origem do gráfico.|
		|ySize|number|Tamanho do eixo ``y``.|
		|yMiddle|number|Metade do eixo ``y``.|
		|yClose|number|Fim do eixo ``y``.|
		|top|number|A metade do espaço superior.|
		|bottom|number|A metade do espaço inferior.|
		|left|number|A metade do espaço esquerdo.|
		|right|number|A metade do espaço direito.|
		|padding|number|Retorna o espaçamento definido.|**/
		_cfg: {
			value: {
				vertical:   Math.min(window.screen.width, window.screen.height),
				horizontal: Math.max(window.screen.width, window.screen.height),
				xInit:      0.10,
				xEnd:       0.80,
				yInit:      0.10,
				yEnd:       0.90,
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
				get padding() {return this.padd*this.width;}
			}
		},
		/**. ``''void'' color(''integer'' id)``: Retorna a cor a partir do identificador (``id``) de ciclo  infinito.**/
		color: {
			value: function(id) {
				if (id === undefined) return "#000000";
				const colors = [
					"darkred",   "navy",           "indigo",          "teal",
					"crimson",   "dodgerblue",     "mediumslateblue", "yellowgreen",
					"deeppink",  "cornflowerblue", "purple",          "darkgreen",
					"orangered", "cyan",           "blueviolet",      "limegreen",
					"dimgray"
				];
				const color = __Array(colors);
				return color.valueOf(id);
			}
		},
		/**. ``''void'' _struct(''node'' svg, ''string'' builder)``: Constrói a área do gráfico, devendo ser chamado após a análise dos dados. O argumento ``svg`` é o objeto de construçã da imagem do gráfico e ``builder`` é uma string podendo adicionar os seguintes valores separados por espaços:
		|Nome|Descrição|
		|title|Adiciona o título ao gráfico.|
		|xlabel|Adiciona o rótulo do eixo x.|
		|ylabel|Adiciona o rótulo do eixo y.|
		|xyplan|Adiciona um retângulo à area de plotagem.|
		|xyaxes|Adiciona os eixos abscissa e ordenada (incompatível com xyplan).|
		|hlines|Adiciona subdivisões de linhas horizontais.|
		|vlines|Adiciona subdivisões de linhas verticais.|
		|xscale|Adiciona a escala ao eixo x.|
		|yscale|Adiciona a escala ao eixo y.|
		|hzero|Adiciona uma linha horizontal se zero estiver no intervalo.|
		|vzero|Adiciona uma linha vertical se zero estiver no intervalo.|
		|mouse|Adiciona um identificador de posição no gráfico a partir da posição do mouse.|**/
		_struct: {
			value: function(svg, builder) {
				if (!__Type(builder).chars) return;
				const cfg    = this._cfg;
				const parts  = builder.replace(/\ +/, " ").trim().toLowerCase().split(" ");
				const chart  = {};
				const color  = this.color();
				const border = {n: false, e: false, s: false, w: false};
				for (let i = 0; i < parts.length; i++) chart[parts[i]] = true;

				/*-- Área de plotagem --*/
				const attrMain = {stroke: "none", fill: "none", "stroke-width": 2, "stroke-linecap": "round"};
				svg.rect(cfg.xStart, cfg.yStart, cfg.xSize, cfg.ySize).attribute(attrMain);
				const main = svg.last;

				/*-- Título do gráfico --*/
				if (chart.title) {
					svg.text(cfg.xMiddle, cfg.top, this.title, "hc").attribute({
						fill: color, "font-size": "1.5em", "font-weight": "bold", cursor: "default"
					});
				}
				/*-- Rótulo do eixo horizontal --*/
				if (chart.xlabel) {
					svg.text(cfg.xMiddle, cfg.height - 2*cfg.padding, this.xLabel, "hs")
					.attribute({fill: color, cursor: "default"});
				}
				/*-- Rótulo do eixo vertical --*/
				if (chart.ylabel) {
					svg.text(2*cfg.padding, cfg.yMiddle, this.yLabel, "vn")
					.attribute({fill: color, cursor: "default"});
				}
				/*-- Linha secundária de zero horizontal --*/
				if (chart.hzero && (this._yMin < 0 && this._yMax > 0)) {
					const zero = this._yScale(0);
					svg.line([cfg.xStart, zero], [cfg.xClose, zero])
					.attribute({stroke: color, "stroke-width": 2, fill: "none"});
				}
				/*-- Linha secundária de zero vertical --*/
				if (chart.vzero && (this._xMin < 0 && this._xMax > 0)) {
					const zero = this._xScale(0);
					svg.line([zero, cfg.yStart], [zero, cfg.xClose])
					.attribute({stroke: color, "stroke-width": 2, fill: "none"});
				}
				/*-- Abscissas e ordenadas (retângulo) --*/
				if (chart.xyplan) {
					main.setAttribute("stroke", color);
					for (let j in border) border[j] = true;
				}
				/*-- Abscissa e ordenada (eixos perpendiculares) --*/
				else if (chart.xyaxes) {
					svg.lines(
						[cfg.xStart, cfg.xStart, cfg.xClose],
						[cfg.yStart, cfg.yClose, cfg.yClose],
						false
					).attribute(attrMain).attribute({stroke: color});
					border.s = true;
					border.w = true;
				}
				/*-- pontos, valores e âncoras --*/
				const dw = (cfg.xClose - cfg.xStart) / (cfg.points - 1);
				const dh = (cfg.yClose - cfg.yStart) / (cfg.points - 1);
				const dx = (this._xMax - this._xMin) / (cfg.points - 1);
				const dy = (this._yMax - this._yMin) / (cfg.points - 1);
				const xAxis = this.xAxis;
				const yAxis = this.yAxis;
				let px, py, vx, vy, ax, ay;
				let i = -1;
				while (++i < cfg.points) {
					/*-- obtendo referenciais para montagem da área de plotagem --*/
					let zero = i === 0;
					let half = i === ((cfg.points - 1) / 2);
					let last = i === (cfg.points - 1);
					let hide = i%2 !== 0;
					let line = {h: true, v: true};
					/*-- primeiro e último valor da escala --*/
					if (zero || last) {
						px = zero ? cfg.xStart : cfg.xClose;
						py = zero ? cfg.yClose : cfg.yStart;
						vx = zero ? this._xMin : this._xMax;
						vy = zero ? this._yMin : this._yMax;
						ax = zero ? "hnw" : "hne";
						ay = zero ? "hse" : "hne";
						line.h = zero ? !border.s : !border.n;
						line.v = zero ? !border.w : !border.e;
					}
					/*-- valores intermediários da escala --*/
					else {
						px = half ? (cfg.xClose + cfg.xStart) / 2 : px + dw;
						py = half ? (cfg.yStart + cfg.yClose) / 2 : py - dh;
						vx = half ? (this._xMax + this._xMin) / 2 : vx + dx;
						vy = half ? (this._yMax + this._yMin) / 2 : vy + dy;
						ax = "hn";
						ay = "he";
					}
					/*-- Linhas secundárias horizontais --*/
					if (chart.hlines) {
						svg.line([cfg.xStart, py], [cfg.xClose, py]).attribute({
							stroke: "#778899", "stroke-width": 1, "stroke-linecap": "round",
							"stroke-dasharray": (vy === 0 ? "none" : "6,6"),
							"class": (hide ? "js-wd-chart-hide" : ""),
							"display": line.h ? "inline" : "none"
						});
					}
					/*-- Linhas secundárias verticais --*/
					if (chart.vlines) {
						svg.line([px, cfg.yStart], [px, cfg.yClose]).attribute({
							stroke: "#778899", "stroke-width": 1, "stroke-linecap": "round",
							"stroke-dasharray": (vx === 0 ? "none" : "6,6"),
							"class": (hide ? "js-wd-chart-hide" : ""),
							"display": line.v ? "inline" : "none"
						});
					}
					/*-- Escala eixo horizontal --*/
					if (chart.xscale) {
						let size = xAxis === "datetime" ? "x-small" : "smaller";
						let sval = this._values(vx, "x");
						svg.text(px, cfg.yClose + cfg.padding, sval, ax)
						.attribute({
							fill: color, "class": (hide ? "js-wd-chart-hide" : ""),
							cursor: "default", "font-size": size
						}).title(this._values(vx, "X"));
					}
					/*-- Escala eixo vertical --*/
					if (chart.yscale) {
						let size = (/^(date)?(time)?$/).test(yAxis) ? "x-small" : "smaller";
						let sval = this._values(vy, "y");
						svg.text(cfg.xStart - cfg.padding, py, sval, ay)
						.attribute({
							fill: color, "class": (hide ? "js-wd-chart-hide" : ""),
							cursor: "default", "font-size": size
						}).title(this._values(vy, "Y"));
					}
				}
				/*-- Evento do mouse dentro da área de plotagem --*/
				if (chart.mouse) {
					/*-- texto com os valores do conjunto (x,y) --*/
					svg.text(cfg.width - cfg.padding, cfg.height - cfg.padding, "", "hse")
					.attribute({
						fill: color, cursor: "default", "data-wd-chart-tool": "coordinates",
						"font-size": "small"
					});
					/*-- linha horizontal --*/
					svg.line([cfg.xStart, cfg.yStart], [cfg.xClose, cfg.yStart])
					.attribute({
						"stroke-width": 1, stroke: color, display: "none", "data-wd-chart-tool": "hline"
					});
					/*-- linha vertical --*/
					svg.line([cfg.xStart, cfg.yStart], [cfg.xStart, cfg.yClose])
					.attribute({
						"stroke-width": 1, stroke: color, display: "none", "data-wd-chart-tool": "vline"
					});
					/*-- Disparador do Evento do mouse --*/
					const self = this;
					svg.svg().onmousemove = function (ev) {
						const ps = svg.svg().getBoundingClientRect();
						const pm = main.getBoundingClientRect();
						const mx = ev.clientX;
						const my = ev.clientY;
						const go = mx >= pm.left && mx <= pm.right && my >= pm.top && my <= pm.bottom;
						const hline = svg.svg().querySelector("[data-wd-chart-tool=hline]");
						const vline = svg.svg().querySelector("[data-wd-chart-tool=vline]");
						const xypos = svg.svg().querySelector("[data-wd-chart-tool=coordinates]");
						/*-- Dentro da área de plotagem --*/
						if (go) {
							const dx = self._xMax - self._xMin;
							const dy = self._yMax - self._yMin;
							const vx = self._xMin + ((mx - pm.left)/pm.width)*dx;
							const vy = self._yMax - ((my - pm.top)/pm.height)*dy;
							const px = self._xScale(vx);
							const py = self._yScale(vy);
							const tx = self._values(vx, "X");
							const ty = self._values(vy, "Y");
							const hl = {y1: py, y2: py, display: "inline"};
							const vl = {x1: px, x2: px, display: "inline"};
							xypos.textContent = tx+" × "+ty;
							svg.svg().setAttribute("cursor", "crosshair");
							for (let i in hl) hline.setAttribute(i, hl[i]);
							for (let i in vl) vline.setAttribute(i, vl[i]);
						}
						/*-- Fora da área de plotagem --*/
						else {
							xypos.textContent = "";
							hline.setAttribute("display", "none");
							vline.setAttribute("display", "none");
							svg.svg().removeAttribute("cursor");
						}
						return;
					}
				}
				return;
			}
		},
		/**. ``''string'' _values(''number'' value, ''string'' type)``: Formata e retorna o valor a ser exibido nos eixos. O argumento ``value`` corresponde ao valor numérico a ser formatado. O argumento opcional ``type`` diz respeito ao tipo de informação (''number'', ''time'', ''date'', ''datetime'' ou ''percent'').**/
		_values: {
			value: function(value, axis) {
				//minúsculo é para o eixo maiúsculo para para exibição
				const x = axis === "x" || axis === "X";
				const y = axis === "y" || axis === "Y";
				/*-- valores para eixos e exibição --*/
				if (x || y) {
					const scale = x ? this.xAxis : this.yAxis;
					/*-- escala data/tempo | valor para eixo e exibição --*/
					if ((/^(date|time|datetime)$/).test(scale)) {
						const num = new __DateTime(value);
						if (scale === "date") return num.toLocaleDateString();
						if (scale === "time") return num.toLocaleTimeString();
						const dt = num.toLocaleString()
						return axis === "y" ? dt.replace(/\,?\s+/, "\n") : dt;
					}
					/*-- escala numérica/proporcional --*/
					const num = new __Number(value);
					const exp = num.exp;
					let cfg;
					/*-- valores para eixo --*/
					if (axis === "x" || axis === "y") {
						if (scale === "percent") {
							cfg = {type: "percent"};
							     if (num ==  0) cfg.decimal = 0;
							else if (exp <= -4) cfg.decimal = 4;
							else if (exp <= -3) cfg.decimal = 3;
							else if (exp <=  0) cfg.decimal = 2;
							else if (exp <= +1) cfg.decimal = 1;
							else                cfg.decimal = 0;
						} else {
							     if (num ==    0) cfg = {type: "decimal",    decimal: 0};
							else if (exp >=  100) cfg = {type: "scientific", decimal: 0};
							else if (exp >=   10) cfg = {type: "scientific", decimal: 1};
							else if (exp >=    3) cfg = {type: "scientific", decimal: 2};
							else if (exp >=    2) cfg = {type: "decimal",    decimal: 1};
							else if (exp >=    1) cfg = {type: "decimal",    decimal: 2};
							else if (exp <= -100) cfg = {type: "scientific", decimal: 0};
							else if (exp <=  -10) cfg = {type: "scientific", decimal: 1};
							else if (exp <    -1) cfg = {type: "scientific", decimal: 2};
							else                  cfg = {type: "decimal",    decimal: 2};
						}
					}
					/*-- valores para exibição --*/
					else {
						const min = x ? this._xMin : this._yMin;
						const max = x ? this._xMax : this._yMax;
						const gap = (max - min) / (x ? this._cfg.width : this._cfg.height);
						const dec = gap < 1 ? Math.abs(new __Number(gap).exp) : 0;
						const sci = exp > 2 || exp < -2;
						cfg = {};
						if (scale === "percent") {
							cfg.type = "percent";
							cfg.decimal = dec <= 2 ? 0 : dec-2;
						} else {
							cfg.type    = sci ? "scientific" : "decimal";
							cfg.decimal = dec + (sci ? exp : 0);
						}
					}
					return num.toLocaleString(cfg);
				}
				/*-- valores para constantes --*/
				const num = new __Number(value);
				return num.toLocaleString();
			}
		},
		/**. ``''void'' _legend(''node'' svg, ''object'' data)``: Constrói a legenda do gráfico. O argumento ``svg`` é o elemento SVG onde o gŕafico está sendo construído. O argumento ``data`` contém as propriedades ``id`` (identificador da legenda), ``name`` (nome da curva), ``info`` (informação complementar) e ``color`` (cor a ser utilizada na legenda). Se ``name`` for nulo, a ação será ignorada.**/
		_legend: {
			value: function(svg, data) {
				/*-- definindo itens da legenda --*/
				const legend = [];
				const items  = [];
				const color  = this.color();
				const char   = {val: "*", len: 35};
				for (let i = 0; i < data.length; i++) {
					if (data[i].name !== null) {
						let name = String(data[i].name).trim();
						let side = Math.trunc((char.len-name.length-2)/2);
						let cfg = {
							id:    String(data[i].id),
							text:  String("\u25A0 "+name),
							color: data[i].color,
							info:  [
								char.val.repeat(side)+" "+String(name)+" "+char.val.repeat(side),
								String(data[i].info),
								char.val.repeat(2*side+2+name.length)
							].join("\n"),
							link: null,
						};
						legend.push(cfg);
						items.push(cfg.text);
					}
				}
				if (legend.length < 1) return;
				/*-- Renderizando os itens da legenda --*/
				svg.text(
					this._cfg.xClose + 2*this._cfg.padding,
					this._cfg.yStart + 2*this._cfg.padding,
					items, "hnw"
				);
				/*-- definindo atributos dos itens da legenda --*/
				const links = svg.last.children;
				for (let i = 0; i < legend.length; i++) {
					legend[i].link = links[i];
					let attr  = {
						"font-size": "1.2em", cursor: "pointer", fill: legend[i].color,
						"data-wd-chart-link": legend[i].id
					};
					for (let j in attr)
						legend[i].link.setAttribute(j, attr[j]);
					/*-- definindo informação complementar da curva --*/
					svg.text(
						this._cfg.xStart + 2*this._cfg.padding,
						this._cfg.yStart + 2*this._cfg.padding,
						legend[i].info, "hnw"
					).attribute({
						fill: color, "font-size": "1em", opacity: "0",
						"font-family": "Courier New, monospace",
						"data-wd-chart-info": legend[i].id
					});
					/*-- definindo ação da legenda --*/
					legend[i].link.onclick = function(ev) {
						let root = ev.target;
						while (root.tagName.toLowerCase() !== "svg")
							root = root.parentElement;
						const id     = ev.target.dataset.wdChartLink;
						const show   = root.dataset.wdChartShow !== id;
						const infos  = root.querySelectorAll("[data-wd-chart-info]");
						const curves = root.querySelectorAll("[data-wd-chart-curve]");
						const links  = root.querySelectorAll("[data-wd-chart-link]");
						root.dataset.wdChartShow = show ? id : "";
						/*-- destacando informações complementares --*/
						for (let k = 0; k < infos.length; k++) {
							let ref = infos[k].dataset.wdChartInfo;
							let val = show && ref === id ? "1" : "0";
							infos[k].setAttribute("opacity", val);
						}
						/*-- destacando curvas --*/
						for (let k = 0; k < curves.length; k++) {
							let ref = curves[k].dataset.wdChartCurve;
							let val = show ? (ref === id ? "0.8" : "0.1") : "1";
							curves[k].setAttribute("opacity", val);
						}
						/*-- destacando items da legenda --*/
						for (let k = 0; k < links.length; k++) {
							let ref = links[k].dataset.wdChartLink;
							let val = show ? (ref === id ? "0.8" : "0.1") : "1";
							links[k].setAttribute("fill-opacity", val);
						}

						return;
					}
				}
				return;
			}
		},
		/**. ``''node'' plot()``: Constrói o gráfico e o retorna (elemento SVG) ou nulo.**/
		plot: {
			value: function() {
				if (this._data.length === 0) return null;
				const attrs = {
					line: {"stroke-width": 3, "stroke-linecap": "round", fill: "none"},
					sum:  {"fill-opacity": 0.5, "stroke-width": 1, "stroke-linecap": "round", fill: "none"},
					dash: {"stroke-width": 1, "stroke-linecap": "round", "stroke-dasharray": "5,5", fill: "none"}
				};
				let data   = this._data.slice();
				let legend = [];
				const svg  = __SVG(this._cfg.width, this._cfg.height);
				svg.svg().style.backgroundColor = "#ffffff";

				/* redefinindo funções para array ----------------------------------- */
				if (this._chart === "plan") {
					let x = this._xSpace;
					let i = -1;
					while(++i < data.length) {
						if (data[i].f) {
							let list = __Data2D(x, data[i].y);
							if (list.error) return null;
							data[i].x = list.x;
							data[i].y = list.y;
							let yList = __Array(data[i].y);
							this._yMin = yList.min;
							this._yMax = yList.max;
						}
					}
				}
				/*-- plotando plano cartesiano ---------------------------------------*/
				if (this._chart === "plan") {
					let i = -1;
					while(++i < data.length) {
						/* obtendo dados da plotagem */
						let id    = data[i].id;
						let x     = data[i].x.slice();
						let y     = data[i].y.slice();
						let name  = data[i].name;
						let info  = data[i].info;
						let color = this.color(id);
						let curve = {id: id, color: color, info: info, name: name};
						/* transformando coordenadas reais para gráficas */
						for (let i = 0; i < x.length; i++) {
							x[i] = this._xScale(x[i]);
							y[i] = this._yScale(y[i]);
						}
						/* plotando de acordo com o tipo de curva */
						if (data[i].type === "line" || data[i].type === "link") {
							svg.lines(x, y)
							.attribute(attrs.line)
							.attribute({stroke: color, "data-wd-chart-curve": id});
						}
						if (data[i].type === "dash") {
							svg.lines(x, y)
							.attribute(attrs.dash)
							.attribute({stroke: color, "data-wd-chart-curve": id});
						}
						if (data[i].type === "dots" || data[i].type === "link") {
							let j = -1;
							while(++j < x.length) {
								svg.circle(x[j], y[j], 4)
								.attribute({fill: color, "data-wd-chart-curve": id});
							}
						}
						if (data[i].type === "sum") {
							let fit = __Data2D(data[i].x, data[i].y);
							let sum = fit.area;
							curve.info = " ∑ yΔx ≈ " + this._values(sum);
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
							/* unindo a curva ao eixo horizontal */
							x.unshift(x[0]);
							x.push(x[x.length - 1]);
							y.unshift(this._yScale(0));
							y.push(this._yScale(0));
							/* plotando */
							svg.lines(x, y, true) /* área */
							.attribute(attrs.sum)
							.attribute({stroke: color, fill: color, "data-wd-chart-curve": id})
							.text(xm, ym, this._values(sum, "Y"), pm) /* valor numérico */
							.attribute({fill: color, "data-wd-chart-curve": id})
						}
						if (data[i].type === "avg") {
							let fit = __Data2D(data[i].x, data[i].y);
							let avg = fit.average;
							let xi  = this._xScale(this._xMin);
							let xn  = this._xScale(this._xMax);
							let ya  = this._yScale(avg);
							curve.info = " (∑ yΔx)/ΔX ≈ " + this._values(avg);
							/* plotando a curva e a linha média */
							svg.lines(x, y)
							.attribute(attrs.dash)
							.attribute({stroke: color, "data-wd-chart-curve": id})
							.lines([xi, xn], [ya, ya])
							.attribute(attrs.line)
							.attribute({stroke: color, "data-wd-chart-curve": id})
							.text(x[0]+5, ya-5, this._values(avg, "Y"), "hsw")
							.attribute({fill: color, "data-wd-chart-curve": id});
						}
						legend.push(curve);
					}
					this._struct(svg, "xyaxes hlines vlines xlabel ylabel xscale yscale title mouse");
				}
				/* plotando gráfico proporcional ------------------------------------ */
				else {
					/* checando condições */
					let minus = false;
					let plus  = false;
					let zero  = true;
					let count = 0;
					let total = 0;
					let positive = 0;
					let negative = 0;

					for (let i in data[0]) {
						let value = data[0][i];
						count++;
						total += value;
						if (value < 0)   minus = true;
						if (value > 0)   plus  = true;
						if (value !== 0) zero  = false;
						if (value < 0) negative += value;
						else           positive += value;
					}
					if (count === 0 || zero) return false;
					/* calculando proporções e definindo limites */
					this._xMin  = 0;
					this._xMax  = count;
					this._yMin  = 0;
					this._yMax  = 0;
					let pieces  = [];
					let id      = -1;

					for (let i in data[0]) {
						let value = data[0][i];
						pieces.push({
							value: value,
							ratio: total === 0 ? null : value/total,
							name:  i,
							id:    ++id,
							color: this.color(id),
						});
						this._yMin = value;
						this._yMax = value;
					}
					/*-- gráfico circular ----------------------------------------------*/
					if (this._chart !== "cols" && minus !== plus && total !== 0) {
						this.yAxis = "percent";
						/*-- rótulo inferior --*/
						svg.text(
							this._cfg.xMiddle, this._cfg.bottom,
							this.yLabel + " × " + this.xLabel, "hc"
						).attribute({cursor: "default"});

						/*-- dados para construção dos semi-círculos --*/
						let start = 0;
						let width = 0;
						let i = -1;
						while (++i < pieces.length) {
							let item  = pieces[i];
							let id    = item.id;
							let name  = item.name;
							let value = item.value;
							let ratio = item.ratio;
							let color = item.color;
							let r     = 2*this._cfg.ySize/5;
							let cx    = this._cfg.xMiddle;
							let cy    = this._cfg.yMiddle;
							let curve = {id: id, color: color, info: "", name: name};
							curve.info = [
								" "+this.yLabel,
								"  "+this._values(total),
								" "+this.xLabel+" ("+this._values(count)+")",
								"  "+name,
								"  "+this._values(value) + " (" + this._values(ratio, "y") + ")"
							].join("\n");
							width = 360*ratio;
							/*-- semi-círculos --*/
							svg.semicircle(cx, cy, r, start, width)
							.attribute({fill: color, "data-wd-chart-curve": id, "fill-opacity": 0.8})
							.attribute({"stroke-linecap": "round", "stroke-width": 1, stroke: color})
							.title(curve.info);
							/*-- legenda ao lado dos semi-círculos --*/
							let m = start + width/2;
							let x = cx + (r + 5)*Math.cos(2*Math.PI*m/360);
							let y = cy - (r + 5)*Math.sin(2*Math.PI*m/360);
							let p;
							if      (m <  90) p = m ===   0 ? "hw" : "hsw";
							else if (m < 180) p = m ===  90 ? "hs" : "hse";
							else if (m < 270) p = m === 180 ? "he" : "hne";
							else if (m < 360) p = m === 270 ? "hn" : "hnw";
							else p = "hw";
							svg.text(x, y, name+" ("+this._values(ratio, "y")+")", p)
							.attribute({fill: color, cursor: "default", "data-wd-chart-curve": id})
							.title(curve.info);
							/* iterando */
							start += width;
							legend.push(curve);
						}
						this._struct(svg, "title");
					}
					/*-- gráfico de colunas --------------------------------------------*/
					else {
						this.yAxis = "number";
						/*-- dados para construção das colunas --*/
						const width = this._cfg.xSize / count;
						let i = -1;
						while (++i < pieces.length) {
							let item  = pieces[i];
							let id    = item.id;
							let color = item.color;
							let name  = item.name;
							let value = item.value;
							let x     = this._xScale(i);
							let y     = this._yScale(item.value >= 0 ? item.value : 0);
							let w     = width;
							let h     = Math.abs(this._yScale(item.value) - this._yScale(0));
							let curve = {id: id, color: color, info: "", name: this._values(id+1)+") "+name};
							curve.info = [
								" "+this.yLabel,
								"  "+this._values(total),
								" "+this.xLabel+" ("+this._values(count)+")",
								"  "+name,
								"  "+this._values(value)
							].join("\n");
							/*-- colunas --*/
							svg.rect(x, y, w, h)
							.attribute({fill: color, "fill-opacity": 0.8})
							.attribute({stroke: color, "stroke-width": 2})
							.attribute({"data-wd-chart-curve": id})
							.title(curve.info);
							/*-- Escalas valores (horizontal) --*/
							svg.text(
								x + width/2,
								value >= 0 ? (y-5) : (y+h+5),
								this._values(value, "y"),
								value >= 0 ? "hs" : "hn"
							)
							.attribute({fill: color, cursor: "default", "data-wd-chart-curve": id})
							.title(this._values(value));
							/*-- Escalas id (horizontal) --*/
							svg.text(
								x + width/2,
								value >= 0 ? (y+h+5) : (y-5),
								this._values(id+1),
								value >= 0 ? "hn" : "hs"
							)
							.attribute({fill: color, cursor: "default", "data-wd-chart-curve": id})
							.title(this._values(id+1)+") "+name);
							legend.push(curve);
						}
						this._struct(svg, "hlines ylabel xlabel yscale hzero title");
					}
				}
				this._legend(svg, legend);
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
		/**. ``''string'' xAxis``: Define ou retorna o tipo de escala do eixo ``x``: number, date, time, datetime ou percent.**/
		xAxis: {
			get: function()  {return this._xAxis;},
			set: function(x) {
				let values  = ["date", "time", "datetime", "percent"];
				this._xAxis = values.indexOf(x) >= 0 ? x : "number";
			}
		},
		/**. ``''string'' yAxis``: Define ou retorna o tipo de escala do eixo ``y``: number, date, time, datetime ou percent.**/
		yAxis: {
			get: function()  {return this._yAxis;},
			set: function(x) {
				let values  = ["date", "time", "datetime", "percent"];
				this._yAxis = values.indexOf(x) >= 0 ? x : "number";
			}
		},
		/**. ``''boolean'' add(''array'' x, ''any'' y, ''string'' label, ''string'' option)``: Adiciona dados para plotagem e retorna falso se não for possível processar a solicitação. Os argumentos ``x`` e ``y`` representam a abscissa (eixo horizontal) e a ordenada (eixo vertical), respectivamente. Seus valores dependem do tipo de gráfico.
		. No caso de plotagem no __plano cartesiano__, o valor de ``x`` deverá ser uma lista de valores finitos ou de data/tempo. Já o valor de ``y`` poderá ser uma __função__ que retorna um valor numérico finito, uma __lista__ de valores finitos ou de data/tempo; ou uma __constante numérica__ finita.
		. No caso de plotagem de __gráfico de proporcionalidade__ (circular ou de barras), o valor de ``x`` poderá ser uma lista de identificadores (string) e ``y`` uma lista de valores finitos ou de data/tempo correspondente aos identificadores definidos em ``x``. O valor de ``x`` também poderá ser um objeto, cujos atributos definirão os identificadores, tornado o valor de ``y`` desnecessário.
		. No caso de gráfico circular, se existir valores positivos e negativos para os identificadores, um gráfico de barras será exibido no lugar.
		. Quando utilizar valores de data/tempo, a referência obtida será a quantidade de segundos desde 0000-01-01.
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
				if (this._chart === "pie" || this._chart === "cols") {
					if (this._data.length === 0) this._data.push({});
					let data = this._data[0];

					/*-- objeto --------------------------------------------------------*/
					if (xdata.object) {
						for (let name in x) {
							let check = __Type(x[name]);
							let value = null;
							if (check.finite || check.date || check.time || check.datetime)
								value = check.finite ? check.value : new __DateTime(x[name]).valueOf();
							if (value !== null)
								data[name] = value + (name in data ? data[name] : 0);
						}
						return true;
					}
					/*-- array ---------------------------------------------------------*/
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
							x:    [xmin, xmax],
							y:    y,
							name: label,
							info: y.name.trim() === "" ? " y = "+label : " f(x) = "+y.name+"(x)",
							f:    true,
							type: option in curve ? curve[option] : curve.main,
							id:   ++this._id
						});console.log(y.name)
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
							x:    [xmin, xmax],
							y:    [cte, cte],
							name: label,
							info: " f(x) = "+this._values(cte),
							f:    false,
							type: option in curve ? curve[option] : curve.main,
							id:   ++this._id
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
							x:    data.x,
							y:    data.y,
							name: label,
							info: "",
							f:    false,
							type: option in curve ? curve[option] : curve.main,
							id:   ++this._id
						});
						/* regressões ----------------------------------------------------- */
						if (option in types.fit) {
							let fit = data[types.fit[option]];
							if (fit === null) return false;
							let target = this._data.length - 1;
							this._data[target].info = [
								" "+fit.m,
								" a = "+this._values(fit.a),
								" b = "+this._values(fit.b),
								" σ = "+this._values(fit.d)
							].join("\n");
							this._data[target].type = "dots";

							/* função principal */
							this._data.push({
									x:    [xlimit.min, xlimit.max],
									y:    fit.f,
									name: null,
									info: "",
									f:    true,
									type: "line",
									id:   this._id
							});
							/* desvio padrão */
							if (fit.d === 0) return true;
							this._data.push({
									x:     [xlimit.min, xlimit.max],
									y:     function(x) {return fit.f(x)+fit.d;},
									name:  null,
									info:  "",
									f:     true,
									type:  "dash",
									id:   this._id
							});
							this._data.push({
									x:    [xlimit.min, xlimit.max],
									y:    function(x) {return fit.f(x)-fit.d;},
									name: null,
									info: "",
									f:    true,
									type: "dash",
									id:   this._id
							});
						}
						return true;
					}
				}
				return false;
			}
		},
	});








//FIXME copy como fazer?
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
		/**. ``''any'' valueOf()``: Retorna o valor do dado (ver ``__Type``).**/
		valueOf: {value: function() {return this._data.valueOf();}},
		/**. ``''string'' toString()``: Retorna o valor textual do dado (ver ``__Type``).**/
		toString: {value: function() {return this._data.toString();}},
		/**. ``''string'' type``: Retorna o tipo do dado.**/
		type: {get: function() {return this._data.type;}},
		/**. ``''boolean'' or(''string'' type...)``: Retorna verdadeiro algum tipo informado em ``type`` corresponder ao dado.**/
		or: {
			value: function(type) {
				for (let i = 0; i < arguments.length; i++)
					if (this._data[arguments[i]] === true) return true;
				return false;
			}
		},
		/**. ``''boolean'' is(''string'' type...)``: Retorna verdadeiro todos os tipos informados em ``type`` corresponder ao dado.**/
		is: {
			value: function(type) {
				if (arguments.length < 2) return this.or(type);
				for (let i = 0; i < arguments.length; i++)
					if (this._data[arguments[i]] !== true) return false;
				return true;
			}
		},
		/**. ``''string'' mask(''string'' model)``: Retorna o valor formatado pela máscara definida no argumento ``model``. Se a máscara não casar, retornará uma string vazia.**/
		mask: {value: function(model) {return new __String(this._input).mask(model);}},
		/**. ``''boolean'' instanceOf(''string'' name)``: Checa se o conteúdo é instância do objeto informado em ``name``.**/
		instanceOf: {value: function(name) {return this._data.instanceOf(name);}},


		//FIXME colocar isso de forma genérica? to(type)
		/**. ``''array'' csv``: Retorna string em CSV para array.**/
		csv: {get: function() {return this._main.csv;}},
		/**. ``''any'' json``: Retorna notação em JSON para valor em Javascript ou nulo se inválido.**/
		json: {get: function() {return this._main.json;}},
		/**. ``''node'' html``: Retorna notação em HTML para documento correspondente ou nulo se inválido.**/
		html: {get: function() {return this._main.html;}},
		/**. ``''node'' xml``: Retorna notação em XML para documento correspondente ou nulo se inválido.**/
		xml: {get: function() {return this._main.xml;}},
		/**. ``''string'' csv``: Retorna o array, se organizado em forma de matriz, no formato CSV.**/
		mcsv: {
			get: function() {
				let table = __Table();
				table.matrix(this.valueOf());
				return table.csv();
			;}
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
		/**. ``''integer'' length``: Retorna a quantidade de caracteres.**/
		length: {get: function() {return this._main.length;}},
		/**. ``''array'' chars``: Retorna um array de caracteres.**/
		chars: {get: function() {return this._main.chars;}},
		/**. ``''string'' upper``: Retorna caixa alta.**/
		upper: {get: function() {return this._main.upper;}},
		/**. ``''string'' lower``: Retorna caixa baixa.**/
		lower: {get: function() {return this._main.lower;}},
		/**. ``''string'' capitalize``: Retorna a primeira letra de cada palavra em caixa alta.**/
		capitalize: {get: function() {return this._main.capitalize;}},
		/**. ``''string'' toggle``: Inverte a caixa.**/
		toggle: {get: function() {return this._main.toggle;}},
		/**. ``''string'' camel``: Transforma a string em camelCase.**/
		camel: {get: function() {return this._main.camel;}},
		/**. ``''string'' dash``: Divide a string em traços.**/
		dash: {get: function() {return this._main.dash;}},
		/**. ``''string'' clear``: Remove acentos.**/
		clear: {get: function() {return this._main.clear(false, true);}},
		/**. ``''string'' trim``: Remove espaços excedentes.**/
		trim: {get: function() {return this._main.clear(true, false);}},
		/**. ``''string'' clean``: Remove acentos e espaços excedentes.**/
		clean: {get: function() {return this._main.clear();}},
	});

/*----------------------------------------------------------------------------*/
	/**#### WDnumber
	###### ``**constructor** ''object'' WDnumber(''any''  input, ''object'' data)``
	Construtor genérico para manipulação de números. Os argumentos ``input`` e ``data`` se referem aos argumento de ``WDmain``**/
	function WDnumber(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __Number(data.value)},
		});
	}

	WDnumber.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnumber},
		/**. ``''integer'' int``: Retorna a parte inteira.**/
		int: {get: function() {return this._main.int;}},
		/**. ``''number'' dec``: Retorna a parte decimal.**/
		dec: {get: function() {return this._main.dec;}},
		/**. ``''number'' abs``: Retorna o valor absoluto.**/
		abs: {get: function() {return this._main.abs;}},
		/**. ``''boolean'' prime``: Informa se o número é primo por meio de um Promise.**/
		prime: {get: async function() {return this._main.prime;}},
		/**. ``''array'' primes``: Retorna uma lista de primos precedentes por meio de um Promise.**/
		primes: {get: async function() {return this._main.primes;}},
		/**. ``''number'' factorization``: Retorna a fatorização do número por meio de um Promise.**/
		factorization: {get: async function() {return this._main.factorization;}},
		/**. ``''number'' fixed(''integer'' length, ''boolean'' round)``: Abrevia o número para as casas decimais (ver __Number).**/
		fixed: {value: function(lenght, round) {return this._main.fixed(lenght, round);}},
		/**. ``''string'' fraction``: Retorna o número em forma de fração.**/
		fraction: {get: function() {return this._main.frac;}},
		/**. ``''string'' bytes``: Retorna o número em quantidade de bytes.**/
		bytes: {get: function() {return this._main.bytes;}},
		/**. ``''string'' toString()``: Funciona como o método nativo.**/
		toString: {value: function(type) {return this._main.value.toString(type);}},
		/**. ``''string'' toLocaleString(''object'' options)``: Ver __Number.**/
		toLocaleString: {value: function(options) {return this._main.toLocaleString(options);}},
	});

/*----------------------------------------------------------------------------*/
	/**#### WDtime**/
	/**###### ``**constructor** ''object'' WDtime(''any''  input, ''object'' data)``
	Construtor para manipulação de tempo. Os argumentos ``input`` e ``data`` se referem aos argumento de ``WDmain``**/
	function WDtime(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __DateTime(data.value)},
		});
	}

	WDtime.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDtime},
		/**. ``''number'' hour``: Retorna ou define a hora.**/
		hour: {
			get: function()  {return this._main.hour;},
			set: function(x) {return this._main.hour = x;}
		},
		/**. ``''number'' minute``: Retorna ou define o minuto.**/
		minute: {
			get: function()  {return this._main.minute;},
			set: function(x) {return this._main.minute = x;}
		},
		/**. ``''number'' second``: Retorna ou define o segundo.**/
		second: {
			get: function()  {return this._main.second;},
			set: function(x) {return this._main.second = x;}
		},
		/**. ``''integer'' h12``: Retorna a hora no ciclo de 12h.**/
		h12: {get: function() {return this._main.main.h12;}},
		/**. ``''string'' h12``: Retorna AM ou PM.**/
		meridiem: {get: function() {return this._main.main.meridiem;}},
		/**. ``''integer'' valueOf()``: Retorna os segundos desde 00:00:00.000.**/
		valueOf: {value: function() {return this._main.valueOfTime();}},
		/**. ``''string'' toString()``: Retorna o tempo no formado hh:mm:ss.sss.**/
		toString: {value: function() {return this._main.toTimeString();}},
		/**. ``''string'' toLocaleString()``: Retorna o tempo no formato local.**/
		toLocaleString: {value: function() {return this._main.toLocaleTimeString();}},
		/**. ``''string'' format(''string'' input)``: Retorna notação de hora pre-formatada em ``input``.**/
		format: {value: function(input) {return this._main.format(input, "time");}},
	});

/*----------------------------------------------------------------------------*/
	/**#### WDdate**/
	/**###### ``**constructor** ''object'' WDdate(''any''  input, ''object'' data)``
	Construtor para manipulação de data. Os argumentos ``input`` e ``data`` se referem aos argumento de ``WDmain``**/
	function WDdate(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __DateTime(data.value)},
		});
	}

	WDdate.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDdate},
		/**. ``''number'' year``: Retorna ou define o ano.**/
		year: {
			get: function()  {return this._main.year;},
			set: function(x) {return this._main.year = x;}
		},
		/**. ``''number'' month``: Retorna ou define o mês.**/
		month: {
			get: function()  {return this._main.month;},
			set: function(x) {return this._main.month = x;}
		},
		/**. ``''number'' day``: Retorna ou define o dia.**/
		day: {
			get: function()  {return this._main.day;},
			set: function(x) {return this._main.day = x;}
		},
		/**. ``''integer'' week``: Retorna o número da semana.**/
		week: {get: function()  {return this._main.main.week;}},
		/**. ``''integer'' weekDay``: Retorna o número do dia da semana.**/
		weekDay: {get: function()  {return this._main.main.weekDay;}},
		/**. ``''boolean'' leap``: Informa se o ano é bissexto.**/
		leap: {get: function()  {return this._main.main.leap;}},
		/**. ``''integer'' width``: Retorna a quantidade de dias do mês.**/
		width: {get: function()  {return this._main.main.width;}},
		/**. ``''integer'' days``: Retorna o número do dia do ano.**/
		days: {get: function()  {return this._main.main.days;}},
		/**. ``''integer'' work``: Retorna o número de dias úteis até o momento.**/
		work: {get: function()  {return this._main.main.work;}},
		/**. ``''integer'' valueOf()``: Retorna o número de dias desde 0000-01-01.**/
		valueOf: {value: function() {return this._main.valueOfDate();}},
		/**. ``''string'' toString()``: Retorna a data no formato YYYY-MM-DD.**/
		toString: {value: function() {return this._main.toDateString();}},
		/**. ``''string'' toLocaleString()``: Retorna a data no formato local.**/
		toLocaleString: {value: function() {return this._main.toLocaleDateString();}},
		/**. ``''string'' format(''string'' input)``: Retorna notação de data pre-formatada em ``input``.**/
		format: {value: function(input) {return this._main.format(input, "date");}},
	});

/*----------------------------------------------------------------------------*/
	/**#### WDdatetime**/
	/**###### ``**constructor** ''object'' WDdatetime(''any''  input, ''object'' data)``
	Construtor para manipulação de data/tempo. Os argumentos ``input`` e ``data`` se referem aos argumento de ``WDmain``**/
	function WDdatetime(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __DateTime(data.value)},
		});
	}

	WDdatetime.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDdatetime},
		/**. ``''integer'' valueOf()``: Retorna o número de segundos desde 0000-01-01T00:00:00.000.**/
		valueOf:     {value: function() {return this._main.valueOf();}},
		/**. ``''integer'' valueOfDate()``: Retorna o número de dias desde 0000-01-01.**/
		valueOfDate: {value: function() {return this._main.valueOfDate();}},
		/**. ``''number'' valueOfTime()``: Retorna os segundos desde 00:00:00.000.**/
		valueOfTime: {value: function() {return this._main.valueOfTime();}},
		/**. ``''number'' valueOfDays()``: Retorna os dias desde 0000-01-01 com o tempo como elemento decimal.**/
		valueOfDays: {value: function() {return this._main.valueOfDays();}},
		/**. ``''string'' toDateString()``: Retorna a data no formato YYYY-MM-DD.**/
		toDateString: {value: function() {return this._main.toDateString();}},
		/**. ``''string'' toTimeString()``: Retorna o tempo no formato hh:mm:ss.sss.**/
		toTimeString: {value: function() {return this._main.toTimeString();}},
		/**. ``''string'' toString()``: Retorna o valor data/tempo no formato YYYY-MM-DDThh:mm:ss.sss.**/
		toString: {value: function() {return this._main.toString();}},
		/**. ``''string'' toLocaleDateString()``: Retorna a data no formato local.**/
		toLocaleDateString: {value: function() {return this._main.toLocaleDateString();}},
		/**. ``''string'' toLocaleTimeString()``: Retorna o tempo no formato local.**/
		toLocaleTimeString: {value: function() {return this._main.toLocaleTimeString();}},
		/**. ``''string'' toLocaleString()``: Retorna o valor data/tempo no formato local.**/
		toLocaleString: {value: function() {return this._main.toLocaleString();}},
		/**. ``''string'' format(''string'' input)``: Retorna notação data/tempo pre-formatada em ``input``.**/
		format: {value: function(input) {return this._main.format(input);}},
	});

	/*-- copiando propriedades de WDtime e WDdate para WDdatetime --------------*/
	const forget   = ["toString", "valueOf", "constructor", "toLocaleString", "format"];
	const timeProp = Object.getOwnPropertyNames(WDtime.prototype);
	const dateProp = Object.getOwnPropertyNames(WDdate.prototype);
	for (let prop of timeProp) {
		if (forget.indexOf(prop) < 0) {
			let desc = Object.getOwnPropertyDescriptor(WDtime.prototype, prop);
			Object.defineProperty(WDdatetime.prototype, prop, desc);
		}
	}
	for (let prop of dateProp) {
		if (forget.indexOf(prop) < 0) {
			let desc = Object.getOwnPropertyDescriptor(WDdate.prototype, prop);
			Object.defineProperty(WDdatetime.prototype, prop, desc);
		}
	}

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
		[Symbol.iterator]: {value: function*() {for (let i of this._main) yield i;}},
		/**. ``''integer'' length``: Retorna a quantidade de itens no array.**/
		length: {get: function() {return this._main.length;}},
		/**. ``''array'' unique``: Retorna a lista sem valores repetidos.**/
		unique: {get: function() {return this._main.unique;}},
		/**. ``''array'' asc``: Retorna a lista ordenada de forma ascentende.**/
		asc: {get: function() {return this._main.sort(true);}},
		/**. ``''array'' desc``: Retorna a lista ordenada de forma descendente.**/
		desc: {get: function() {return this._main.sort(false);}},
		/**. ``''array'' sort``: Retorna a lista com ordem inversa ou forma ascendente, se desordenada.**/
		sort: {get: function() {return this._main.sort();}},
		/**. ``''array'' order``: Retorna a lista ordenada de forma ascendente sem repetições.**/
		order: {get: function() {return this._main.order;}},
		/**. ``''array'' add(''any'' ...)``: Adicina itens ao fim da lista e a retorna.**/
		add: {value: function() {return this._main.add.apply(this._main, arguments);}},
		/**. ``''array'' jump(''any'' ...)``: Adicina itens ao início da lista e a retorna.**/
		jump: {value: function() {return this._main.jump.apply(this._main, arguments);}},
		/**. ``''array'' put(''any'' ...)``: Adicina itens, se inexistentes, ao fim da lista e a retorna.**/
		put: {value: function() {return this._main.put.apply(this._main, arguments);}},
		/**. ``''array'' concat(''any'' ...)``: Concatena itens ou arrays ao fim da lista e a retorna.**/
		concat: {value: function() {return this._main.concat.apply(this._main, arguments);}},
		/**. ``''array'' remove(''any'' ...)``: Remove da lista todas as ocorrências dos itens especificados e a retorna.**/
		remove: {value: function() {return this._main.remove.apply(this._main, arguments);}},
		/**. ``''array'' toggle(''any'' ...)``: Alterna a existência dos itens especificados na lista e a retorna.**/
		toggle: {value: function() {return this._main.toggle.apply(this._main, arguments);}},
		/**. ``''array'' replace(''any'' from, ''any'' to)``: Altera todas as ocorrências (``from``) pelo novo valor (``to``) e retorna a lista modificada.**/
		replace: {value: function(from, to) {return this._main.replace(from, to);}},
		/**. ``''array'' search(''any'' value)``: Retorna uma lista com os índices em que o argumento ``value`` aparece.**/
		search: {value: function(value) {return this._main.search(value);}},
		/**. ``''boolean'' check(''any'' ...)``: Retorna verdadeiro se todos os argumentos informados forem localizados.**/
		check: {value: function() {return this._main.check.apply(this._main, arguments);}},
		/**. ``''array'' hide(''any'' ...)``: Retorna a lista ignorando os valores informados como argumento.**/
		hide: {value: function() {return this._main.hide.apply(this._main, arguments);}},
		/**. ``''any'' item(''integer'' index)``: Retorna o item especificado no argumento ``index`` considerando uma lista circular.**/
		item: {value: function(index) {return this._main.valueOf(__Type(index).number ? index : 0);}},
		/**. ``''string'' toString()``: Retorna a lista em forma de JSON.**/
		toString: {value: function() {return JSON.stringify(this._data.value);}},
		/**. ``''array|number'' valueOf(''string'' value)``: Retorna uma cópia da lista ou os seguintes valores de acordo com o valor do argumento opcional ``value`` que, caso não exista o valor possível, retornará nulo:
		|Value|Tipo|Descrição|
		|min|number|Retorna o menor número finito da lista.|
		|max|number|Retorna o maior número finito da lista.|
		|sum|number|Retorna a soma dos números finitos da lista.|
		|avg|number|Retorna a média dos números finitos da lista.|
		|med|number|Retorna a mediana dos números finitos da lista.|
		|harm|number|Retorna a média harmônica dos números finitos da lista.|
		|geo|number|Retorna a média geométrica dos números finitos da lista.|
		|gcd|number|Retorna máximo divisor comum dos números finitos da lista.|
		|mode|array|Retorna uma lista com os items mais recorrentes.|**/
		valueOf: {
			value: function(value) {
				value = String(value).toLowerCase().trim();
				const self  = this;
				switch(value) {
					case "min":  return self._main.min;
					case "max":  return self._main.max;
					case "sum":  return self._main.sum;
					case "avg":  return self._main.avg;
					case "med":  return self._main.med;
					case "harm": return self._main.harm;
					case "geo":  return self._main.geo;
					case "gcd":  return self._main.gcd;
					case "mode": return self._main.mode;
				}
				return this._main.valueOf().slice();
			}
		},
		//FIXME coloco onde isso aqui?
		/**. ``''array'' cell(''string'' area)``: Retorna uma lista contendo os valores definidos no argumento ``area`` de um array organizado no formato de matriz (ver __Table).**/
		cell: {
			value: function(area) {
				let table = __Table();
				table.matrix(this.valueOf());
				return table.cell(area, true);
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#### WDobject
	###### ``**constructor** ''object'' WDobject(''any''  input, ''object'' data)``
	Construtor genérico para manipulação de tempo. Os argumentos ``input`` e ``data`` se referem aos argumento de ``WDmain``**/
	function WDobject(input, data) {
		WDmain.call(this, input, data);
		const request = new __Request(this._input);
		Object.defineProperties(this, {
			_main:    {value: new __DataSet(data.value)},
			_request: {value: request}
		});
	}

	WDobject.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDobject},
		/**. ``''self'' send(''function'' trigger)``: Efetua requisição XMLHttpRequest e dispara ``trigger``(ver __Request).**/
		send: {value: function(trigger) {this._request.send(trigger); return this;}},
		/**. ``''self'' fetch(''function'' trigger)``: Efetua requisição fetch e dispara ``trigger``(ver __Request).**/
		fetch: {value: function(trigger) {this._request.fetch(trigger); return this;}},
		/**. ``''self'' read(''function'' trigger)``: Efetua leitura de arquivos e dispara ``trigger``(ver __Request).**/
		read: {	value: function(trigger) {this._request.read(trigger); return this;}},
	});

/*----------------------------------------------------------------------------*/
	/**#### WDnode
	###### ``**constructor** ''object'' WDnode(''any''  input, ''object'' data)``
	Construtor genérico para manipulação de nós HTML. Os argumentos ``input`` e ``data`` se referem aos argumento de ``WDmain``**/
	function WDnode(input, data) {
		WDmain.call(this, input, data);
		const node = this._data.value;
		const main = [];
		for (let i = 0; i < node.length; i++)
			main.push(new __Node(node[i]));
		Object.defineProperties(this, {
			_main:  {value: main},
			_array: {value: new __Array(main)}
		});
	}

	WDnode.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnode},
		/**. ``''integer'' length``: Retorna a quantidade de nós HTML.**/
		length: {get: function() {return this._data.value.length;}},
		/**. ``''array'' valueOf()``: Retorna uma cópia da lista contendo os nós HTML.**/
		valueOf: {value: function() {return this._data.value.slice();}},
		/**. ``''self'' forEach(''function'' callback)``: Executa looping nos nós HTML. A função definida em ``callback`` receberá como argumentos um nó, o seu índice e uma **cópia** da lista de nós. Se a função retornar falso, o looping é interrompido.**/
		forEach: {
			value: function(run) {
				if (__Type(run).function) {
					const nodes = this.valueOf();
					for (let i = 0; i < nodes.length; i++)
						if (run(nodes[i], i, nodes) === false) break;
				}
				return this;
			}
		},
		/**. ``''array'' files``: Retorna uma lista com os arquivos selecionados nos campos de formulário.**/
		files: {
			get: function() {
				const pack = [];
				for (let i = 0; i < this._main.length; i++) {
					let obj = this._main[i];
					if (obj.ftype === "file")
						for (let j = 0; j < obj.node.files.length; j++)
							pack.push(obj.node.files[j]);
				}
				return pack;
			}
		},
		//FIXME quando chamado submit, wdOnResize e wdOnReload são chamado. Por quê?
		/**. ``''array'' submit``: Retorna uma lista de objetos contendo o nome e o valor dos campos de formulários. Se houver algum campo com erro, retornará nulo.**/
		submit: {
			get: function() {
				const data = [];
				for (let i = 0; i < this._main.length; i++) {
					let obj  = this._main[i];
					let form = obj.submit;
					if (form !== null) {
						if (form.error) return null;
						data.push({name: form.name, value: form.value});
					}
				}
				return data;
			}
		},
		/**. ``''self'' load(''string'' html, ''boolean'' replace, ''boolean'' run)``: Insere o código HTML contido em ``html`` no elemento. Se ``replace`` for verdadeiro, substituirá o elemento pelo código. Se ``run``for verdadeiro, rodará scripts.**/
		load: {
			value: function(html, replace, run) {
				for (let i = 0; i < this._main.length; i++)
					this._main[i].load(html, replace, run);
				return this;
			}
		},
		/**. ``''self'' repeat(''array'' list)``: Repete elementos a partir de um modelo. ``list`` é uma lista de objetos cujo valor do atributo substituirá o respectivo valor entre do modelo que será informado em chaves duplas ({{atributo}}).**/
		repeat: {
			value: function(list) {
				for (let i = 0; i < this._main.length; i++)
					this._main[i].repeat(list);
				return this;
			}
		},
		/**. ``''self'' set(''object'' data)``: Atribui aos elementos o valor dos atributos especificados em ``data`` (ver __Node.atrribute).**/
		set: {
			value: function(data) {
				if (__Type(data).object)
					for (let i = 0; i < this._main.length; i++)
						for (let attr in data)
							this._main[i].attribute(attr, data[attr]);
				return this;
			}
		},
		/**. ``''self'' display(''string'' action)``: Organiza a exibição dos elementos filhos conforme argumento ``action``. Quanto ao elemento:
		|Valor|Descrição|
		|show|exibe o elemento|
		|hide|oculta o elemento|
		|toogle|alterna a exibição do elemento|
		|full|exibe o elemento em tela cheia|
		. Quanto aos irmãos:
		|Valor|Descrição|
		|ahead|exibe o elemento e oculta os irmãos|
		|behind|oculta o elemento e exibe os irmãos|
		|all|exibe o elemento e seus irmãos|
		|none|oculta o elemento e seus irmãos|
		. Quanto aos filhos:
		|Valor|Descrição|
		|asc|ordena os elemento filhos em ordem crescente|
		|desc|ordena os elemento filhos em ordem decrescente|
		|sort|alterana a order dos elemento filhos|
		. Quanto à organização dos filhos:
		|Valor|Descrição|
		|+N|exibe o filho avançando N posições do elemento atual (ciclo infinito)|
		|-N|exibe o filho retrocedendo N posições do elemento atual (ciclo infinito)|
		|N-M|intervalo de filhos a exibir, índices inicial e final|
		|N:D|organiza os filhos por grupos de D elementos, onde N representa o índice do grupo|
		|+N:D|avança N grupos de filhos organizados em grupos de D elementos|
		|-N:D|retrocede N grupos de filhos organizados em grupos de D elementos|
		. Quanto aos netos:
		|Valor|Descrição|
		|[+N&verbar;-M&verbar;...]|ordena os filhos com base no valor dos netos na ordem especificada e conforme sinais (positivos ascendentes, negativos descendentes).|
		. Onde N e M são números inteiros e D pode ser inteiro ou decimal. Para representar o último índice, utilizar o caractere asterisco.**/
		display: {
			value: function(action) {
				action = String(action).replace(/\s+/g, "").toLowerCase();
				for (let i = 0; i < this._main.length; i++) {
					let node = this._main[i];
					/*-- avanço/retrocesso de filhos --*/
					if ((/^[+-]?\d+$/).test(action)) {
						node.walk(action);
					}
					/*-- intervalo de filhos --*/
					else if ((/^(\+?\d+|\*)\-(\+?\d+|\*)$/).test(action)) {
						const val = action.split("-");
						node.childs(val[0] === "*" ? -1 : val[0], val[1] === "*" ? -1 : val[1]);
					}
					/*-- agrupamento de nós --*/
					else if ((/^([+-]?\d+|\*)\:(\d+|0?\.\d+)$/).test(action)) {
						const val   = action.split(":");
						const walk  = (/^[+-]\d+/).test(action);
						const index = Number(val[0] === "*" ? -1 : val[0]) * (walk ? Infinity : 1);
						const width = Number(val[1]);
						node.pages(index, width);
					}
					/*-- ordenamento de colunas --*/
					else if ((/^\[[+-]?\d+((\|[+-]?\d+)+)?\]$/).test(action)) {
						const val = action.replace(/^\[(.+)\]$/, "$1").split("|");
						for (let j = 0; j < val.length; j++)
							val[j]  = (val[j][0] === "-" ? -1 : +1) + Number(val[j]);
						node.tsort.apply(node, val);
					}
					/*-- exibições do elemento --*/
					else {
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
				}
				return this;
			}
		},
		/**. ``''self'' filter(''any'' search, ''integer'' width)``: Exibe somente os elementos filhos que contenham o conteúdo de ``search`` (ver __Node.filter)**/
		filter: {
			value: function(search, width) {
				for (let i = 0; i < this._main.length; i++)
					this._main[i].filter(search, width);
				return this
			}
		},
		/**. ``''self'' jump(''node'' spaces)``: Alterna a posição dos nós entre os elementos informados em ``spaces`` (ver __Node.jump)**/
		jump: {
			value: function(spaces) {
				if (__Type(spaces).node)
					for (let i = 0; i < this._main.length; i++)
						this._main[i].jump(spaces);
				return this;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#### WDmatrix
	###### ``**constructor** ''object'' WDmatrix(''any''  input, ''object'' data)``
	Construtor genérico para manipulação de nós HTML. Os argumentos ``input`` e ``data`` se referem aos argumento de ``WDmain``**/

	function WDmatrix(input) {
		let table  = new __Table(true, false);
		let target = null;
		let check  = __Type(input);
		if      (check.node)  table.html(check.value[0]);
		else if (check.array) table.matrix(input);
		else if (check.chars) table.csv(input);

		if (check.node && check.value.length > 0)
			if (check.value[0].tagName.toLowerCase() === "table")
				target = check.value[0];

		Object.defineProperties(this, {
			_table:  {value: table},
			_target: {value: target}
		});
	}

	WDmatrix.prototype = Object.create(WDmatrix.prototype, {
		constructor: {value: WDmatrix},
		/**. ``''integer'' rows``: Retorna a quantidade de linhas da matriz.**/
		rows: {
			get: function() {return this._table.rows;}
		},
		/**. ``''integer'' rows``: Retorna a quantidade de colunas da matriz.**/
		cols: {
			get: function() {return this._table.rows;}
		},
		/**. ``''string'' caption``: Define ou retorna o rótulo da tabela.**/
		caption: {
			get: function()  {return this._table.caption;},
			set: function(x) {return this._table.caption = x;}
		},
		/**. ``''array'' array``: Retorna a matriz na forma de array.**/
		array: {
			get: function() {return this._table.matrix();}
		},
		/**. ``''string'' csv``: Retorna a matriz na forma de string.**/
		csv: {
			get: function() {return this._table.csv();}
		},
		/**. ``''node'' html``: Retorna a matriz na forma de tabela HTML.**/
		html: {
			get: function() {return this._table.html();}
		},
		/**. ``''array'' range(''string'' cell)``: Retorna a lista dos valores das células especificadas em ``cell`` (ver &lowbar;&lowbar;Table).**/
		range: {
			value: function(cell) {return this._table.cell(cell, true);}
		},



		forEach: {//FIXME descrever isso, não sei para que
			value: function(cell, callback) {
				if (!__Type(callback).function) return;
				let data = this._table.cell(cell, false);
				let self = this;
				data.forEach(function (v,i,a) {
					let cell = {
						get index()  {return i;},
						get row()    {return v.row;},
						get col()    {return v.col;},
						get value()  {return v.cell.textContent;},
						set value(x) {v.cell.textContent = x;},
						set style(x) {WD(v.cell).set({style: x})},
						range: function(x) {return self.range(x);},
					};
					callback(cell);
				});
			}
		},
		/**.  ``''node'' plot(''object'' options)``: Retorna um gráfico de acordo com os dados da tabela e conforme especificado em ``options``. O atributo ``options`` possui os seguintes atributos:
		|Nome|Tipo|Descrição|
		|xLabel|string|Rótulo do eixo ''x''.|
		|yLabel|string|Rótulo do eixo ''y''.|
		|title|string|Título do gráfico.|
		|xAxis|string|Define o tipo de dado do eixo ''x'': ''number'' (padrão), ''date'', ''time'' e ''datetime''.|
		|ratio|boolean|Se verdadeiro, o gráfico será proporcional, caso contrário, será plano cartesiano.|
		|data|array|Conjunto de dados a serem plotados e corresponde a uma lista de objetos.|
		. Os itens do atributo ``data`` do argumento ``options`` possui os seguintes atributos:
		|Nome|Tipo|Descrição|
		|x|any|Valores do eixo ''x'', pode ser um array, um objeto (ratio = true) ou o número da coluna precedido de &num;.|
		|y|any|Valores do eixo ''y'', pode ser um array, uma função, uma constante ou o número da coluna precedido de &num;.|
		|label|string|Rótulo do gráfico. Se ''y'' utilizar o coluna, o valor será o cabeçalho desta.|
		|fit|string|Especifica o tipo do gráfico cartesiano.|
		. Os tipos permitidos para o atributo ``fit`` são:
		|Valor|Descrição|Valores de Y|
		|sum|Exibe a soma aproximada da área dentro da curva.|function, constante, array, matrix|
		|avg|Exibe a média aproximada da curva.|function, array, matrix|
		|line|Liga os pontos do gráfico com um seguimento de reta.||
		|link|Liga os pontos do gráfico com um seguimento de reta lincado por um ponto.|array, matrix|
		|dots|Exibe os pontos do gráfico.|array, matrix|
		|linear|Executa um ajuste linear aproximado.||
		|exponential|Executa um ajuste exponencial aproximado.||
		|geometric|Executa um ajuste geométrico aproximado.||
		|logarithmic|Executa um ajuste logarítmo aproximado.||
		|minimum|Executa um ajuste com o menor desvio médio padrão.||**/
		plot: {
			value: function(options) {
				if (!__Type(options).object)     return null;
				if (!__Type(options.data).array) return null;
				if (options.data.length === 0)   return null;
				let self  = this;
				let chart = __Plot2D(options.ratio);
				let names = {xLabel: 0, yLabel: 0, title: 0, xAxis: 0};
				for (let attr in names)
					if (attr in options) chart[attr] = options[attr];
				options.data.forEach(function (v,i,a) {
					if (__Type(v.x).string) {
						let col = v.x.replace(/\D/g, "");
						v.x = self.range("1,"+col+":.,"+col, true);
					}
					if (__Type(v.y).string) {
						let col = v.y.replace(/\D/g, "");
						v.y     = self.range("1,"+col+":.,"+col, true);
						v.label = self.range("0,"+col)[0]
					}
					chart.add(v.x, v.y, v.label, v.fit);
				});
				return chart.plot();
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
			case "date":     return new WDdate(input, data);
			case "time":     return new WDtime(input, data);
			case "datetime": return new WDdatetime(input, data);
			case "node":     return new WDnode(input, data);
			case "string":   return new WDstring(input, data);
			case "object":   return new WDobject(input, data);
		}
		return new WDmain(input, data);
	}
	/**#### Métodos Estáticos**/
	WD.constructor = WD;
	Object.defineProperties(WD, {
		/**. ``''string'' version``: Retorna a versão da biblioteca.**/
		version: {value: __VERSION},
		/**. ``''object'' $(''string'' css, ''node'' root)``: Retorna um objeto do tipo nó conforme seletor ''css'' individual. O argumento opcional ''root'' é o elemento pai a ser consultado cujo valor padrão é ''document''.**/
		$: {value: function(css, root) {return WD(__Query(css, root).$);}},
		/**. ``''object'' $$(''string'' css, ''node'' root)``: Retorna um objeto do tipo nó conforme seletor ''css'' múltiplo. O argumento opcional ''root'' é o elemento pai a ser consultado cujo valor padrão é ''document''.**/
		$$: {value: function(css, root) {return WD(__Query(css, root).$$);}},
		/**. ``''void'' signal(''object'' options)``: Produz uma interação (ver ''__SIGNAL.signal'').**/
		signal:  {value: function(options) {return __SIGNAL.signal(options);}},


		copy: {value: function(text)  {return wd_copy(text);}}, //FIXME como fica copy?


		/**. ``''object'' matrix(''any'' input)``: Retorna um objeto do tipo matriz conforme ``input`` (table, array, csv)**/
		matrix:  {value: function(input) {return new WDmatrix(input);}},
		/**. ``''string'' device``: Retorna o tipo de tela de acordo com a biblioteca.**/
		device:  {get: function() {return __DEVICE.device;}},
		/**. ``''object'' today``: Retorna o objeto do tipo data com o valor atual.**/
		already: {get: function() {return WD(__DateTime().toString());}},
		/**. ``''string'' lang``: Define ou retorna a lista de linguagem em ordem de preferência da biblioteca.**/
		lang: {
			get: function()  {return __LANG.list.join(" ");},
			set: function(x) {__LANG.user = x;}
		},
		/**. ``''string'' currency``: Define ou retorna o código monetário para uso pela biblioteca.**/
		currency: {
			get: function()  {return __LANG.currency;},
			set: function(x) {__LANG.currency = x;}
		},
		/**. ``''object'' datetime(''any'' input)``: Retorna um objeto WD de data/tempo a partir dos valores:
		|input|Descrição|
		|Padrão|O valor atual de data/tempo|
		|Tempo|O tempo com data definida em 000-01-01|
		|Data|A data com tempo definido em 00:00:00|
		|Data/Tempo|Conforme definido|
		|Número|A quantidade de segundos desde 0000-01-01T00:00:00|
		|Semana|O primeiro dia da semana com tempo definido em 00:00:00|
		|Mês|Primeiro dia do mês com tempo definido em 00:00:00|
		|Objeto|As propriedades definidas alteram o valor atual da data/tempo|**/
		datetime: {
			value: function(input) {
				const datetime = new __DateTime(input);
				return WD(datetime.toString());
			}
		},
	});

	if (__UNDERMAINTENANCE) {
		console["warn" in console ? "warn" : "log"]("WD JS Library: The maintenance module is on.");
		Object.defineProperties(WD, {
			type:     {value: function(){return __Type.apply(null, Array.prototype.slice.call(arguments));}},
			array:    {value: function(){return __Array.apply(null, Array.prototype.slice.call(arguments));}},
			time:     {value: function(){return __DateTime.apply(null, Array.prototype.slice.call(arguments));}},
			node:     {value: function(){return __Node.apply(null, Array.prototype.slice.call(arguments));}},
			number:   {value: function(){return __Number.apply(null, Array.prototype.slice.call(arguments));}},
			string:   {value: function(){return __String.apply(null, Array.prototype.slice.call(arguments));}},
			code:     {value: function(){return __Code.apply(null, Array.prototype.slice.call(arguments));}},
			data2D:   {value: function(){return __Data2D.apply(null, Array.prototype.slice.call(arguments));}},
			plot:     {value: function(){return __Plot2D.apply(null, Array.prototype.slice.call(arguments));}},
			request:  {value: function(){return __Request.apply(null, Array.prototype.slice.call(arguments));}},
			query:    {value: function(){return __Query.apply(null, Array.prototype.slice.call(arguments));}},
			svg:      {value: function(){return __SVG.apply(null, Array.prototype.slice.call(arguments));}},
			table:    {value: function(){return __Table.apply(null, Array.prototype.slice.call(arguments));}},
			dataset:  {value: function(){return __DataSet.apply(null, Array.prototype.slice.call(arguments));}},
			parser:   {value: function(){return __Parser.apply(null, Array.prototype.slice.call(arguments));}},
			LANG:     {value: __LANG},
			TYPE:     {value: __TYPE},
			DEVICE:   {value: __DEVICE},
			PROGRESS: {value: __PROGRESS},
			SIGNAL:   {value: __SIGNAL},
		});
	}

/*============================================================================*/
/**#### Atributos HTML dataset
	###### ``**function** ''void'' data_wdSend(''node''  e, ''object'' event)``
	Função vinculada ao atributo HTML ``data-wd-send`` cujo objetivo é efetuar requisições web (ver ``WDrequest.send``). Possui múltiplos atributos e grupos. Os atributos são os mesmos do método acrescido do ''_trigger'' que define o nome do disparador a executar ao fim do processo, que deve ter sido declarado no escopo principal (window) utilizando as palavras chaves ``var`` ou ``function``. No caso de submissão de formulário, o grupo será único e os dados serão aqueles definidos no HTML.**/
	function data_wdSend(e, event) {
		if (!("wdSend" in e.dataset)) return;
		event.preventDefault();
		const data = new __Parser(e.dataset.wdSend).wdArray.get();
		if (event.type === "submit") {
			console.clear();
			const config  = data[0];
			const active  = document.activeElement;
			const type    = __Node(active).type;
			const overlap = type === "submit" || type === "image";
			const attr    = {method: null, action: null, enctype: null};
			for (let name in attr) {
				let formName = "form"+__String(name).capitalize;
				let invalid  = __Type(e[name]).node;
				if (overlap && active.hasAttribute(formName))
					attr[name] = active[formName];
				else if (!invalid)
					attr[name] = invalid ? e.getAttribute(name) : e[name];
				else
					delete attr[name];
			}
			for (let name in attr) config[name] = attr[name];











			config.body    = e.elements;
			console.log("config: ", config);


		} else {
			data.forEach(function (config,i,a) {
				WD(config).send(config._trigger);
			});
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdLoad(''node''  e, ''object'' event)``
	Função vinculada ao atributo HTML ``data-wd-load`` cujo objetivo é carregar arquivo HTML (ver ``WDnode.load`` e ``WD.send``). Possui múltiplos atributos e grupo único.**/
	function data_wdLoad(e, event) {
		if (!("wdLoad" in e.dataset)) return;
		const target  = WD(e);
		const data    = new __Parser(e.dataset.wdLoad).wdArray.get()[0];
		const options = {replace: data._replace, script: data._script, text: data._text};
		delete e.dataset.wdLoad;
		wd(data).send(function(x) {
			if (x.ok) target.load(x.response, options);
		});
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdRepeat(''node''  e, ''object'' event)``
	Função vinculada ao atributo HTML ``data-wd-repeat`` cujo objetivo é clonar elementos filhos a partir de parâmentros contidos em arquivo JSON ou CSV (ver ``WDnode.repeat`` e ``WDobject.send``). Possui múltiplos atributos e grupo único. O atributo ``type`` da requisição deve ser ''json'' ou ''css''.**/
	function data_wdRepeat(e, event) {
		if (!("wdRepeat" in e.dataset)) return;
		const target = WD(e);
		const data   = new __Parser(e.dataset.wdRepeat).wdArray.get()[0];
		if (data.type !== "css") data.type = "json";
		delete e.dataset.wdRepeat;
		wd(data).send(function(x) {
			if (x.ok) target.repeat(x.response);
		});
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdSet(''node''  e, ''object'' event)``
	Função vinculada ao atributo HTML ``data-wd-set`` cujo objetivo é manipular atributos/propriedades dos nós HTML. Os dados de configuração poderão vir de um arquivo JSON ou CSV ou a partir das propriedades definidas no atributo dataset (ver ``WDnode.set``). Para fonte arquivo, a propriedade ``_file`` deverá ser definida como ''true'' e a propriedade ``type`` deverá ser ''json'' ou ''css'', a depender do tipo de arquivo. Possui múltiplos atributos e grupos:
	|Nome|Descrição|Obrigatório|
	|_file|Se verdadeiro, define configuração por arquivo externo|Não|
	|$ ou $$|Seletore CSS para identificar os alvos da ferramenta (se ausente, será o próprio elemento)|Não|**/
	function data_wdSet(e, event) {
		if (!("wdSet" in e.dataset)) return;
		const data = new __Parser(e.dataset.wdSet).wdArray.get();
		const exec = function(input) {
			if (!__Type(input).object) return;
			const query  = input.$$ || input.$ || e;
			const target = WD(query);
			if ("$"     in input) delete input.$;
			if ("$$"    in input) delete input.$$;
			if ("_file" in input) delete input._file;
			target.set(input);
			return;
		}

		data.forEach(function(group,i,g) {
			if (group._file === true) {
				WD(group).send(function (x) {
					if (x.ok && __Type(x.response).array)
						x.response.forEach(function(config,j,c) {return exec(config);});
				});
			} else {
				for (let config in group) {
					if ((/^.+\{.+\}$/).test(group[config]))
						group[config] = new __Parser(group[config]).wdArray.get()[0];
				}
				exec(group);
			}
		});
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdChart(''node''  e, ''object'' event)``
	Função vinculada ao atributo HTML ``data-wd-chart`` cujo objetivo é criar um gráfico 2D a partir de uma tabela, um arquivo CSV ou parâmetros. Possui múltiplos atributos e grupo único:
	|Nome|Descrição|Obrigatório|
	|xLabel|Rótulo do eixo ''x''.|Não|
	|yLabel|Rótulo do eixo ''y''.|Não|
	|title|Título do gráfico.|Não|
	|xAxis|Define o tipo de dado do eixo ''x'': number (padrão), date, time ou datetime.|Não|
	|ratio|Se ''true'', o gráfico será proporcional, caso contrário, será plano cartesiano.|Não|
	|data|Lista de dados a serem plotados.|Sim|
	|path|Caminho para o arquivo CSV contendo os dados a serem plotados.|Não|
	|method|Tipo de requisição HTTP se path for informado (ver WD.send)|Não|
	|$$|Seletor CSS do formulário com os parâmetros da requição, se path for informado.|Não|
	|$|Seletor CSS que identifica a tabela HTML contendo os dados a serem plotados (path não pode ser informado).|Não|
	O atributo ''data'' terá os seguintes atributos com a possibilidades de múltiplos grupos:
	|Nome|Origem|Descrição|Obrigatório|
	|x|Qualquer|Array com dados do eixo ''x''.|Sim|
	|x|Arquivo CSV ou tabela|Número da coluna no formato ''&num;col''.|Sim|
	|y|Qualquer|Array com dados do eixo ''y'' ou nome da função no escopo de ''window'' definida com ``var``ou ``function``.|Sim|
	|y|Arquivo CSV ou tabela|Número da coluna no formato ''&num;col''.|Sim|
	|label|Qualquer|Nome da curva.|Não|
	|fit|Qualquer|Nome do ajuste da curva (ratio não pode ser ''true'').|Não|**/
	function data_wdChart(e, event) {
		if (!("wdChart" in e.dataset)) return;
		let data = new __Parser(e.dataset.wdChart).wdArray.get()[0];
		delete e.dataset.wdChart;
		if (!__Type(data.data).array) return;
		data.data.forEach(function(v,i,a) {a[i] = new __Parser(v).wdArray.get()[0];});

		/* definindo origem dos dados */
		let plotter = function(src) {
			let matrix = WD.matrix(src);
			let plot   = matrix.plot(data);
			if (plot !== null) {
				e.innerHTML = "";
				e.appendChild(plot);
			}
			return;
		};
		/* arquivo CSV */
		if ("path" in data)
			WD(data.$$).send(data.path, {
				method: data.method,
				ondone: function (x) {plotter(x.csv);}
			});
		/* tabela HTML */
		else if ("$" in data)
			plotter(data.$);
		/* dados */
		else
			plotter();
		return;
	}

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdDisplay(''node''  e, ''string'' event)``
	Função vinculada ao atributo HTML ``data-wd-display`` cujo objetivo é manipular a exibição de nós, seus irmãos e filhos utilizando a ferramenta ``WDnode.display``. Possui múltiplos atributos e grupos:
	|Nome|Descrição|Obrigatório|
	|action|Ação a ser executada|Sim|
	|$ ou $$|Seletor CSS para indicar o elemento os elementos a aplicar a ação (se ausente, será o próprio elemento)|Não|**/
	function data_wdDisplay(e, event) {
		if (!("wdDisplay" in e.dataset)) return;
		let self = WD(e);
		let data = new __Parser(e.dataset.wdDisplay).wdArray.get();
		data.forEach(function (v,i,a) {
			let query  = v.$$ || v.$ || e;
			let target = WD(query);
			if (target.length === 0)
				self.display(v.action);
			else
				target.display(v.action);
		});
		return;
	};










/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdCode(''node''  e, ''object'' event)``FIXME acertar esse texto
	Função vinculada ao atributo HTML ``data-wd-display`` cujo objetivo é manipular a exibição de nós, seus irmãos e filhos utilizando a ferramenta ``WDnode.display``. Possui múltiplos atributos e grupos:
	|Nome|Descrição|Obrigatório|

	|action|Ação a ser executada|Sim|
	|$ ou $$|Seletor CSS para indicar o elemento os elementos a aplicar a ação (se ausente, será o próprio elemento)|Não|**/
	function data_wdCode(e, event) {//FIXME pendente
		if (!("wdCode" in e.dataset)) return;
		const data = new __Parser(e.dataset.wdCode).wdArray.get()[0];
		const node = __Node(e);
		const code = __Code(node.form ? node.value() : e.innerText);
		let   html = node.form ? document.createElement("PRE") : e;
		if (__Type(data.config).function) {
			code.config(data.config());
		}
		e.spellcheck = false;
		e.translate  = false;
		if (node.form) {
			e.parentElement.insertBefore(html, e);
			html.dataset.wdCode = e.dataset.wdCode;
			html.setAttribute("class", e.getAttribute("class"));
			html.setAttribute("style", e.getAttribute("style"));
			if (!e.readOnly && !e.disabled)
				html.contentEditable = true;
			e.remove();
		}
		if (event.type === "focusin") {
			html.innerText  = code.toString();
		} else {
			html.innerHTML  = code.valueOf();
			window.getSelection().removeAllRanges();
		}
		return;
	};




























/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdClick(''node''  e, ''object'' event)``
	Função vinculada ao atributo HTML ``data-wd-click`` cujo objetivo é efetuar um autoclique ao elemento. Possui valor simples e opcional. Caso um número inteiro maior que zero seja informado, o clique irá ser executado a cada milisegundos conforme valor definido.**/
	function data_wdClick(e, event) { //FIXME pendente
		if (!("wdClick" in e.dataset)) return;
		let data = new __Parser(e.dataset.wdClick).wdArray.get();
		let info = __Type(data);
		let time = info.finite ? Math.trunc(info.value) : null;
		if ("click" in e) e.click();
		if (time > 0)
			window.setTimeout(function() {data_wdClick(e, event);}, time);
		else
			WD(e).set({dataset: {wdClick: null}});
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdFilter(''node''  e, ''object'' event)``
	Função vinculada ao atributo HTML ``data-wd-filter`` cujo objetivo é filtrar os nós filhos que contenham o conteúdo informado utilizando a ferramenta ``WDnode.filter``. Possui múltiplos atributos e grupos:
	|Nome|Descrição|Obrigatório|
	|chars|Determina a quantidade mínima de caracteres para executar a busca|Não|
	|$ ou $$|Seletor CSS dos elementos cujos filhos serão filtrados|Sim|**/
	function data_wdFilter(e, event) {
		if (!("wdFilter" in e.dataset)) return;
		let node = __Node(e);
		let data = new __Parser(e.dataset.wdFilter).wdArray.get();
		data.forEach(function (v,i,a) {
			const query  = v.$$ || v.$ || undefined;
			if (query === undefined) return;
			const target = WD(query);
			const text   = node.attribute("textContent");
			const value  = __String("").wdValue(text);
			const search = __Type(value).regexp ? value : text;
			target.filter(search, v.chars);
		});
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdTsort(''node''  e, ''object'' event)``
	Função vinculada ao atributo HTML ``data-wd-tsort`` cujo objetivo é ordenar colunas específicas de tabelas. Não possui atributo.**/
	function data_wdTsort(e, event) {
		if (!("wdTsort" in e.dataset)) return;
		try {
			let thead = e.parentElement.parentElement;
			if (thead.tagName.toLowerCase() !== "thead") return;
			let tbody = thead.parentElement.tBodies;
			let heads = __Type(e.parentElement.children).value;
			let index = heads.indexOf(e);
			let data  = __String("").wdValue(e.dataset.wdTsort);
			let sort  = data === 1 ? -1 : 1;
			WD(tbody).display("["+(sort * (index + 1))+"]");
			heads.forEach(function(v,i,a) {
				if ("wdTsort" in v.dataset)
					v.dataset.wdTsort = v === e ? (sort > 0 ? "+1" : "-1") : "";
			});
		} catch(e) {}
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdDevice(''node''  e, ''object'' event)``
	Função vinculada ao atributo HTML ``data-wd-device`` cujo objetivo é manipular o atributo ``class`` conforme mudança no tamanho da tela. Possui múltiplos atributos e grupo único:
	|Nome|Descrição|Obrigatório|
	|desktop|Estilos CSS separados por espaço a serem utilizados quando a tela corresponder a um desktop.|Não|
	|tablet|Estilos CSS separados por espaço a serem utilizados quando a tela corresponder a um tablet.|Não|
	|phone|Estilos CSS separados por espaço a serem utilizados quando a tela corresponder a um phone.|Não|
	|mobile|Estilos CSS separados por espaço a serem utilizados quando a tela corresponder a um tablet ou phone.|Não|**/
	function data_wdDevice(e, event) {
		if (!("wdDevice" in e.dataset)) return;
		let query  = WD(e);
		let data   = new __Parser(e.dataset.wdDevice).wdArray.get()[0];
		let device = __DEVICE.device;
		let types  = { /* 0: elimina css, 1: adiciona css */
			desktop: {phone: 0, tablet: 0, mobile: 0, desktop: 1},
			tablet:  {phone: 0, tablet: 1, mobile: 1, desktop: 0},
			phone:   {phone: 1, tablet: 0, mobile: 1, desktop: 0},
		};
		if (device in types) {
			let type = types[device];
			/* 1) removendo css dos dispositivos incompatíveis */
			for (let i in type)
				if (i in data && type[i] === 0) query.set({class: {remove: data[i]}});
			/* 2) adicionando css dos dispositivos compatíveis */
			for (let i in type)
				if (i in data && type[i] === 1) query.set({class: {add: data[i]}});
		}
		return;
	};






/*----------------------------------------------------------------------------*/
	function data_wdEdit(e, event) { /*FIXME pendente edita texto: data-wd-edit=comando{especificação}... */
		if (!("execCommand" in document) || !("wdEdit" in e.dataset)) return;
		let data = new __Parser(e.dataset.wdEdit).wdArray.get()[0];
		for (let cmd in data) {
			let arg = data[cmd].trim() === "" ? undefined : data[cmd].trim();
			switch(cmd) {
				case "createLink": {
					arg = prompt("Link:", "https://...");
					if (arg === null || arg.trim() === "") cmd = "unlink";
					break;
				}
				case "insertImage": {
					arg = prompt("Link:", "https://...");
					break;
				}
			}
			document.execCommand(cmd, false, arg);
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdValue(''node''  e, ''object'' event)``
	Função vinculada ao atributo HTML ``data-wd-value`` cujos objetivos são:
	- Aplicar e validar máscara;
	- Validar dados;
	- Renderizar dados; e
	- Obter e definir valores da URL.
	Possui múltiplos atributos e grupo único:
	|Nome|Descrição|
	|mask|Define o modelo da máscara a ser aplicada ao conteúdo.|
	|fail|Texto do erro da máscara.|
	|$$ ou $|Seletores CSS dos elementos de entrada vinculados ao valor de saída (''output'').|
	|valid|Nome da função, definida no escopo de ''windows'' com ''var'' ou ''function'', para validar o valor.|
	|output|Nome da função, definida no escopo de ''windows'' com ''var'' ou ''function'', para definir o valor de saída.|
	A função ''output'' será chamada quando os elementos de entrada dispararem um evento ''input''. Ela também será chamada ao carregar conteúdo ou definir o atributo. A função receberá o elemento e deverá retornar o seu valor.
	A aplicação da máscara será avalida nos carregamento de conteúdo, definição de atributo e quando o elemento perder o foco. Será chamada também no evento ''input'' se ''output'' for chamada. Se o conteúdo não casar com a máscara, o nó assumirá como mensagem de erro o valor de ``fail`` ou o modelo da máscara.
	A função ''valid'' será chamada nos carregamento de conteúdo e definição de atributo. A função receberá o elemento e deverá retornar o valor da mensagem de erro ou uma string em branco se não houver. No evento ''input'', ''valid'' só será executada se ''output'' tiver sido chamada.**/
	function data_wdValue(e, event) {
		if (!("wdValue" in e.dataset)) return;
		const data   = new __Parser(e.dataset.wdValue).wdArray.get()[0];
		const events = ["wdreload", "wddataset", "focusout", "input"];
		if (!__Type(data).object || events.indexOf(event.type) < 0) return;
		const node   = __Node(e);
		const target = data.$$ || data.$ || undefined;

		const output = (function() {
			const check = __Type(target);
			const input = check.node ? check.value : [];
			if (!__Type(data.output).function) return false;
			if (event.type === "focusout")     return false;
			if (event.type === "input" && input.indexOf(event.target) < 0) return false;
			e[node.ftext ? "textContent" : "value"] = data.output(e);
			return true;
		})();

		const mask   = (function() {
			if (!__Type(data.mask).nonempty)       return false;
			if (event.type === "input" && !output) return false;
			const text  = node.ftext ? e.textContent : e.value;
			const value = WD(text).mask(data.mask);
			const fail  = __Type(data.fail).nonempty ? data.fail : data.mask
			if (text === "") {
				node.fvalidity = "";
			} else if (value === "") {
				node.fvalidity = fail;
			} else {
				e[node.ftext ? "textContent" : "value"] = value;
				node.fvalidity = "";
			}
			return true;
		})();

		const valid  = (function() {
			if (!__Type(data.valid).function)      return false;
			if (event.type === "input" && !output) return false;
			node.fvalidity = data.valid(e);
			return true;
		})();

		return;
	};

/*----------------------------------------------------------------------------*/
	function data_wdShared(e, event) { /* FIXME pendente Experimental: compartilhar em redes sociais: data-wd-shared=rede */
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
	/**###### ``**function** ''void'' navLink(''node''  e, ''string'' event)``
	Função vinculada a atributo HTML cujo objetivo é estabelecer o menu ativo do container ``nav``.**/
	function navLink(e, event) {
		if (e.parentElement === null) return;
		if (e.parentElement.tagName.toLowerCase() !== "nav") return;
		WD(e.parentElement.children).set({class: {add: "js-wd-nav-inactive"}});
		WD(e).set({class: {remove: "js-wd-nav-inactive"}});
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' data_wdMove(''node''  e, ''object'' event)``
	Função vinculada ao atributo HTML ``data-wd-move`` cujo objetivo é fazer pular, arrastar, derrubar ou redimensionar elementos. Possui múltiplo atributos e grupo único. Os objetivos dos atributos dependem do tipo de manipulação.
	O atributo ``type`` indica o tipo de manipulação a ser realizada:
	. ''jump'': Faz com que o elemento salte entre os elementos definidos em $ ou $$ a cada clique efetuado. O atributo deve ser aplicado ao elemento a saltar.
	. ''move'': Muda a posição do elemento, exceto para os posicionamentos ''static'' e ''sticky''. O atributo deve ficar vinculado ao ponto de âncora. Se a âncora não for o próprio elemento a ser movido, o atributo $ deve ser informado para defini-lo, sendo que o elemento de âncora deve ser filho do elemento a ser movido.
	. ''resize'': Redimensiona o elemento. Os posicionamentos ''static'', ''relative'' e ''sticky'' são redimencionados apenas no lado sul e leste.
	. ''drag'': Arrasta o elemento na tela para derrubá-lo em outro ponto. O atributo deve estar vinculado ao elemento a ser arrastado. Os pontos de queda são definidos pelos atributos $ e $$. O atributo opcional ''effect'' define o objetivo do arraste (''copy'', ''link'' e ''move''). O atributo ''action'' define o nome da função a ser chamada quando ocorrer a queda. A função receberá três argumentos, o elemento arrastado (''drag''), o elemento da queda (''drop'') e, se existir, o elemento onde o mouse repousava na queda (''over'') ou nulo.
	. ''drop'': Define o local para queda de arquivos externos. O atributo deve ser aplicado ao elemento que receberá a queda. Assim como o tipo ''drag'', possui os atributos ''effect'' e ''action''. A função definida e ''action'' receberá dois atributos, os arquivos arrastados (FileList) e o elemento da queda (''drop'').**/
	function data_wdMove(e, event) {
		const wdMove = "wdMove" in e.dataset;
		const data   = wdMove ? __Parser(e.dataset.wdMove).wdArray.get()[0] : {};
		const query  = data.$$ || data.$ || null;
		const check  = __Type(query);
		const node   = __Node(e);
		const action = WD.$$("[data-wd-move-action]").length > 0;

		/*------------------------------------------------------------------------*/
		if (data.type === "jump" && event.type === "click") {
			if (check.node) WD(query).jump(e);
			return;
		}

		/*------------------------------------------------------------------------*/
		if (!action && data.type === "move") {

			/*-- Preparando o elemento para mover --*/
			if (event.type === "mousedown") {
				const myself = !check.node || check.value.length < 1 || check.value[0] === e;
				const mover  = myself ? e : check.value[0];
				const target = __Node(mover);
				const nail   = target.styles.position;
				/* Elementos estáticos e adesivos não se mover */
				if (nail === "static" || nail === "sticky") return;
				/* a âncora precisa estar contida no elemento a mover */
				if (!myself) {
					let test = e;
					while (test !== mover) {
						test = test.parentElement;
						if (test === null) return;
					}
				}
				const box = target.position;
				box.pageX = event.pageX;
				box.pageY = event.pageY;
				target.position = box;

				/* definindo dataTransfer manual */
				let dataTransfer = [];
				for (let i in box) dataTransfer.push(i+"{"+box[i]+"}");
				mover.dataset.wdMoveAction   = "move";
				mover.dataset.wdDataTransfer = dataTransfer.join("");
				return;
			}
			return;
		}

		const moving = WD.$$("[data-wd-move-action=move]");
		if (moving.length > 0) {

			moving.forEach(function(x) {
				if (event.type === "mouseup" || event.buttons !== 1) {
					delete x.dataset.wdMoveAction;
					delete x.dataset.wdDataTransfer;
				} else if (event.type === "mousemove") {
					const target = __Node(x);
					const box    = new __Parser(x.dataset.wdDataTransfer).wdArray.get()[0];
					const dx     = event.pageX - box.pageX;
					const dy     = event.pageY - box.pageY;
					box.left    += dx;
					box.right   -= dx;
					box.top     += dy;
					box.bottom  -= dy;
					target.position = box;
				}
				window.getSelection().removeAllRanges();
				return;
			});
			return;
		}

		/*------------------------------------------------------------------------*/
		if (!action && data.type === "resize") {
			/*-- Capturando informações sobre o elemento a redimensionar --*/
			const box  = e.getBoundingClientRect();
			const d    = 6;
			const x    = event.clientX;
			const y    = event.clientY;
			const N    = y >= box.top    && y <= (box.top    + d);
			const S    = y <= box.bottom && y >= (box.bottom - d);
			const W    = x >= box.left   && x <= (box.left   + d);
			const E    = x <= box.right  && x >= (box.right  - d);
			const re   = /js\-wd\-cursor\-[nsew]+\-resize\ ?/g;
			const attr = document.body.className;
			const pos  = node.styles.position;

			let cursor = "";
			if (N || S) cursor += (N ? "n" : "s");
			if (W || E) cursor += (E ? "e" : "w");
			/* Elemento estático, relativo ou só redimensiona para direita e para baixo */
			if (pos === "static" || pos === "relative" || pos === "sticky")
				cursor = cursor.replace(/[nw]/g, "");

			/* especifica o ícone do mouse de acordo com a posição do mouse */
			const mouse = "js-wd-cursor-"+cursor+"-resize";
			if (cursor === "" || event.type === "mouseout") {
				document.body.className = attr.replace(re, "");
				return;
			} else if (attr.indexOf(mouse) < 0) {
				document.body.className = attr.replace(re, "")+" "+mouse;
			}

			/*-- Preparando o redimensionamento --*/
			if (event.type === "mousedown" && cursor !== "") {
				const box = node.position;
				box.pageX = event.pageX;
				box.pageY = event.pageY;
				node.position = box;

				/* definindo dataTransfer manual */
				let dataTransfer = [];
				for (let i in box) dataTransfer.push(i+"{"+box[i]+"}");
				e.dataset.wdMoveAction   = "resize-"+cursor;
				e.dataset.wdDataTransfer = dataTransfer.join("");
				/* Criando linhas auxiliares */
				if ((/[ns]/).test(cursor)) {
					const hline = document.createElement("DIV");
					hline.className = "js-wd-hline";
					document.body.appendChild(hline);
				}
				if ((/[ew]/).test(cursor)) {
					const vline = document.createElement("DIV");
					vline.className = "js-wd-vline";
					document.body.appendChild(vline);
				}
				return;
			}
			return;
		}

		const resizing = WD.$$("[data-wd-move-action|=resize]");
		if (resizing.length > 0) {
			const hline = WD.$$(".js-wd-hline");
			const vline = WD.$$(".js-wd-vline");

			resizing.forEach(function(x) {

				/*-- Encerrando o redimensionamento --*/
				if (event.type === "mouseup" || event.buttons !== 1) {
					delete x.dataset.wdMoveAction;
					delete x.dataset.wdDataTransfer;
					hline.set({remove: []});
					vline.set({remove: []});
					const re = /js\-wd\-cursor\-[nsew]+\-resize\ ?/g;
					let attr = document.body.className.replace(re, "");
					document.body.className = attr;
					return;
				}

				/*-- Redimensionando --*/
				if (event.type === "mousemove") {
					const node   = __Node(x);
					const box    = new __Parser(x.dataset.wdDataTransfer).wdArray.get()[0];
					const cursor = x.dataset.wdMoveAction.replace("resize-", "");
					const dx     = event.pageX - box.pageX;
					const dy     = event.pageY - box.pageY;
					const pos    = node.styles.position;
					if (cursor.indexOf("n") >= 0) {
						box.height -= dy;
						box.top    += dy;
					}
					if (cursor.indexOf("s") >= 0) {
						box.height += dy;
						box.bottom -= dy;
					}
					if (cursor.indexOf("w") >= 0) {
						box.width -= dx;
						box.left  += dx;
					}
					if (cursor.indexOf("e") >= 0) {
						box.width += dx;
						box.right -= dx;
					}
					if (pos === "static" || pos === "relative" || pos === "sticky")
						node.position = {width: box.width, height: box.height};
					else
						node.position = box;
					/* configurando linhas */
					const lines = x.getBoundingClientRect();
					if (cursor.indexOf("n") >= 0)
						hline.set({style: {top: lines.top+"px"}});
					if (cursor.indexOf("s") >= 0)
						hline.set({style: {top: lines.bottom+"px"}});
					if (cursor.indexOf("w") >= 0)
						vline.set({style: {left: lines.left+"px"}});
					if (cursor.indexOf("e") >= 0)
						vline.set({style: {left: lines.right+"px"}});
					window.getSelection().removeAllRanges();
					return;
				}
				return;
			});
			return;
		}

		/*------------------------------------------------------------------------*/
		if (wdMove && data.type === "drag") {
			if (!check.node) return;

			/*-- Preparando o elemento para ser arrastado --*/
			if (event.type === "mouseover" || event.type === "mouseout") {
				e.draggable = event.type === "mouseover";
				return;
			}

			/*-- Iniciando o arrasto --*/
			if (event.type === "dragstart") {
				event.dataTransfer.setData("text", e.dataset.wdMove);
				event.dataTransfer.dropEffect = data.effect;
				event.dataTransfer.effectAllowed = "all";
				e.dataset.wdMoveAction = "drag";

				const drops = WD(query);
				drops.forEach(function(x) {
					if (x === e) return;
					x.dataset.wdMoveAction = "drop";
					x.ondrop = function(ev) {
						ev.preventDefault();
						let drop = ev.target;
						let over = null;
						while (drop.dataset.wdMoveAction !== "drop") {
							over = drop;
							drop = drop.parentElement;
							if (drop === null) return;
						}
						const drag   = document.querySelector("[data-wd-move-action=drag]");
						const attr   = new __Parser(ev.dataTransfer.getData("text")).wdArray.get()[0];
						const effect = event.dataTransfer.dropEffect;
						if (!__Type(attr.action).function) return;

						if (ev.type === "drop") {attr.action(drag, drop, over);}
						else if (ev.type === "dragover") {}
						else if (ev.type === "dragleave" ) {}
						return;
					};
					x.ondragover  = x.ondrop;
					x.ondragover  = x.ondrop;
					x.ondragleave = x.ondrop;
					return;
				});
				return;
			}

			/*-- Encerrando o arrasto --*/
			if (event.type === "dragend") {
				event.preventDefault();
				const wdAction = WD.$$("[data-wd-move-action]");
				wdAction.forEach(function(x) {
					x.ondragover  = null;
					x.ondrop      = null;
					x.ondragover  = null;
					x.ondragleave = null;
					delete x.dataset.wdMoveAction;
					x.removeAttribute("draggable");
					return;
				});
				window.getSelection().removeAllRanges();
				return;
			}
			return;
		}
		/*------------------------------------------------------------------------*/
		if (data.type === "drop") {
			event.preventDefault();
			let drop = e;
			while (!(/type\{drop\}/).test(drop.dataset.wdMove) && drop !== null)
				drop = drop.parentElement;
			if (drop === null) return;

			const attr = new __Parser(drop.dataset.wdMove).wdArray.get()[0];
			if (!__Type(attr.action).function) return;

			if (event.type === "drop") {
				event.dataTransfer.dropEffect = data.effect;
				const files = event.dataTransfer.files;
				attr.action(files, drop);
				delete drop.dataset.wdMoveAction;
			} else if (/*event.type === "dragover" || */event.type === "dragenter") {
				drop.dataset.wdMoveAction = "files";
			} else if (event.type === "dragleave") {
				delete drop.dataset.wdMoveAction;
			}
			return;
		}
		return;
	};





/*----------------------------------------------------------------------------*/
/**###### ``**function** ''void'' data_wdMenu(''node''  e, ''object'' event)``
	Função vinculada ao atributo HTML ``data-wd-menu`` cujo objetivo é exibir um menu suspenso. Possui múltiplos atributos e grupo único:
	|Nome|Descrição|Obrigatório|
	|items|Nome da função que retornará o objeto contendo os subitens do menu.|Sim|
	|event|Nome do evento disparador do menu, ''over'' ou ''click'' (padrão).|Não|
	A função definida em ``items`` receberá como argumento o elemento detentor do atributo e deverá retornar um objeto. Os atributos do objeto definem o identificador da ação e seus valores deverão ser objetos com as seguintes propriedades:
	|Nome|Descrição|Obrigatório|
	|content|Texto ou nó a ser atribuído ao item. O valor padrão é o identificador.|Não|
	|title|Caixa de dica a ser definida ao item.|Não|
	|action|Função a ser chamada ao clicar sobre o item, que fechará o menu.|Não|
	A função definida em ''action'' receberá como argumentos o identificador e o elemento detentor do atributo.**/
	function data_wdMenu(e, event) {
		const menus = WD.$$(".js-wd-menu");
		/* ao clicar em algum ponto da tela, fechar o menu */
		if (event.type === "click")
			menus.forEach(function(x) {
				x.remove();
				WD(document.body).set({class: {remove: "js-wd-overflow-hidden"}});
				return;
			});

		if (!("wdMenu" in e.dataset)) return;
		const data  = new __Parser(e.dataset.wdMenu).wdArray.get()[0];
		const items = __Type(data.items).function ? data.items(e) : null;
		const enter = event.type === "mouseover" && data.event === "over";
		const click = !enter && event.type === "click";

		/* retornar nas seguintes situações */
		if (!__Type(items).object) return;
		if (!enter && !click) return
		if (enter && menus.length > 0) return;

		/* construir o menu */
		const menu = document.createElement("DIV");
		for (let id in items) {
			const item    = __Type(items[id]).object ? items[id] : {};
			const action  = __Type(item.action).function ? item.action : null;
			const content = "content" in item ? item.content : id;
			const submenu = document.createElement("DIV");
			if (__Type(content).node)
				submenu.appendChild(content);
			else
				submenu.innerHTML = content;
			if ("title" in item) submenu.title = item.title;
			submenu.onclick   = function(ev) {
				if (action !== null) action(id, e);
				ev.target.parentElement.remove();
				WD(document.body).set({class: {remove: "js-wd-overflow-hidden"}});
				return;
			}
			menu.appendChild(submenu);
		}
		/* retornar se nenhum submenu for definido */
		if (menu.childElementCount === 0) return;

		/* adicionar menu na tela */
		if (enter) menu.onmouseleave = function(ev) {
			ev.target.remove();
			WD(document.body).set({class: {remove: "js-wd-overflow-hidden"}});
			return;
		};
		menu.classList = "js-wd-menu";
		WD(document.body).set({class: {add: "js-wd-overflow-hidden"}});
		document.body.appendChild(menu);

		/* posicionar menu na tela */
		const box = menu.getBoundingClientRect();

		if (event.clientY > (window.innerHeight/2))
			menu.style.top = (event.clientY - box.height)+"px";
		else
			menu.style.top = (event.clientY)+"px";
		if (event.clientX > (window.innerWidth/2))
			menu.style.left = (event.clientX - box.width)+"px";
		else
			menu.style.left = (event.clientX)+"px";
		return;
	};


/*============================================================================*/
/* -- DISPARADORES -- */
/*============================================================================*/

	/**
	### Disparadores
	Funções a serem invocadas ao disparar determinados eventos.
	###### ``**function** ''void'' wdOnLoad(''object''  ev)``
	Disparador a ser invocado ao carregar a página (load): define o estilo CSS da biblioteca e invoca os processos pós carregamento.**/
	function wdOnLoad(ev) {
		if (__UNDERMAINTENANCE) console.log({wdOnLoad: ev, target: ev.target});
		/*-- construindo CSS da biblioteca --*/
		const node = document.createElement("STYLE");
		const data = [];
		for (let i = 0; i < __STYLE.length; i++) {
			let target = __STYLE[i].target;
			let style  = __STYLE[i].style.join(" ").replace(/\;+/g, " !important;");
			let block  = [target.trim(), " {", style.trim(), "}"].join("");
			data.push(block);
		}
		node.innerHTML = data.join("\n");
		document.head.appendChild(node);
		/*-- aplicar carregamentos, repetições e ajustes --*/
		wdOnReload(ev);
		return;
	}

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' wdOnReload(''object''  ev)``
	Disparador a ser invocado ao efetuar alterações na página e após o carregamento principal (wdreload).**/
	function wdOnReload(ev) {
		if (__UNDERMAINTENANCE) console.log({wdOnReload: ev, target: ev.target});
		const root = __Type(ev.target).node ? ev.target : document;
		const data = [
			{selector: "[data-wd-repeat]", method: data_wdRepeat},
			{selector: "[data-wd-load]",   method: data_wdLoad},
			{selector: "[data-wd-value]",  method: data_wdValue},
			{selector: "[data-wd-click]",  method: data_wdClick},
			{selector: "[data-wd-chart]",  method: data_wdChart},
			{selector: "[data-wd-code]",   method: data_wdCode},
			{selector: "[data-wd-filter]", method: data_wdFilter}//FIXME manter?
		];
		for (let v of data) {
			/*-- avaliar o alvo carregado (root != document) --*/
			if (root !== document)
				WD(root).forEach(function(x) {v.method(x, ev)});
			/*-- avaliar todo o documento (root = document) ou os descendentes do alvo --*/
			WD.$$(v.selector, root).forEach(function(x) {v.method(x, ev)});
		}
		wdOnResize(ev);
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' wdOnHash(''object''  ev)``
	Disparador a ser invocado ao mudar a âncora da página (hashchange): define as margens e o posicionamento da âncora em ''body'' se houver elementos filhos ''header'' ou ''footer'' fixos no topo ou na base.**/
	function wdOnHash(ev) {
		if (__UNDERMAINTENANCE) console.log({wdOnHash: ev, target: ev.target});
		const target = WD.$$("body > header, body > footer");
		const hash   = WD.$(window.location.hash);
		const data   = {header: 0, footer: 0};
		target.forEach(function(x) {
			let node   = __Node(x);
			let style  = node.styles;
			let height = 0;
			if (style.position !== "fixed") return;
			if (node.tag === "header") {
				height += Number(style.top.replace(/[^0-9\.]/g, ""));
				height += Number(style.height.replace(/[^0-9\.]/g, ""));
				height += Number(style.marginBottom.replace(/[^0-9\.]/g, ""));
				if (height > data.header) data.header = height;
			} else if (node.tag === "footer") {
				height += Number(style.bottom.replace(/[^0-9\.]/g, ""));
				height += Number(style.height.replace(/[^0-9\.]/g, ""));
				height += Number(style.marginTop.replace(/[^0-9\.]/g, ""));
				if (height > data.footer) data.footer = height;
			}
		});
		if (data.header > 0) document.body.style.marginTop    = data.header+"px";
		if (data.footer > 0) document.body.style.marginBottom = data.footer+"px";
		if (data.header > 0 && hash.length === 1)
			window.scrollTo(0, hash.valueOf()[0].offsetTop - data.header);
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' wdOnResize(''object''  ev)``
	Disparador a ser invocado após mudanças no tipo de dispositivo (resize).**/
	function wdOnResize(ev) {
		if (__UNDERMAINTENANCE) console.log({wdOnResize: ev, target: ev.target});
		const alldoc = ev.type === "resize" || ev.type === "load";
		const change = __DEVICE.changeDevice;
		/*-- se load ou resize, averiguar todo o documento --*/
		if (alldoc && change) {
			WD.$$("[data-wd-device]").forEach(function(x) {data_wdDevice(x, ev);});
		}
		/*-- caso contrário, avaliar só o elemento e seus descendentes --*/
		else {
			WD.$$(ev.target).forEach(function(x) {data_wdDevice(x, ev);});
			WD.$$("[data-wd-device]", ev.target).forEach(function(x) {data_wdDevice(x, ev);});
		}
		/*-- checar hash no carregamento principal (FIXME funciona?) --*/
		if (ev.type === "load") wdOnHash(ev);
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' wdOnDataset(''object''  ev)``
	Disparador a ser invocado após mudanças no atributo HTML ''dataset'' (evento wddataset) a partir do uso da ferramenta da biblioteca (ver __Node.dataset).**/
	function wdOnDataset(ev) {
		if (__UNDERMAINTENANCE) console.log({wdOnDataset: ev, target: ev.target});
		if (!("wdDatasetEvent" in ev.target.dataset)) return;
		const data   = ev.target.dataset.wdDatasetEvent.split(",");
		const events = {
			wdLoad:   data_wdLoad,
			wdRepeat: data_wdRepeat,
			wdFilter: data_wdFilter,
			wdValue:  data_wdValue,
			wdClick:  data_wdClick,
			wdDevice: data_wdDevice,
			wdChart:  data_wdChart,
			wdCode:   data_wdCode
		};
		/*-- Apagar propriedade registradora das propriedades definidas --*/
		delete ev.target.dataset.wdDatasetEvent;
		for (let v of data) {
			let name = v.trim();
			if (name in events) events[name](ev.target, ev);
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' wdOnInput(''object''  ev)``
	Disparador a ser invocado após o elemento sofrer alteração de seu conteúdo textual (input). Haverá um delay entre a digitação e a execução das funções sensíveis.**/
	function wdOnInput(ev) {
		if (__UNDERMAINTENANCE) console.log({wdOnInput: ev, target: ev.target});
		let now  = (new Date()).valueOf();
		ev.target.dataset.wdTimeStamp = now;
		/*-- chamar funções após o delay quanto ao último input efetuado --*/
		window.setTimeout(function() {
			let now   = (new Date()).valueOf();
			let stamp = Number(ev.target.dataset.wdTimeStamp);
			let delta = now - stamp;
			if (delta >= __KEYTIMERANGE) {
				data_wdFilter(ev.target, ev);
				WD.$$("[data-wd-value]").forEach(function(x) {data_wdValue(x, ev);});
			}
			return;
		}, __KEYTIMERANGE);
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' wdOnFocusOut(''object''  ev)``
	Disparador a ser invocado ao sair de um campo editável (focusout).**/
	function wdOnFocusOut(ev) {
		if (__UNDERMAINTENANCE) console.log({wdOnFocusOut: ev, target: ev.target});
		data_wdValue(ev.target, ev);
		data_wdCode(ev.target, ev);
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' wdOnFocusIn(''object''  ev)``
	Disparador a ser invocado ao entrar em um campo editável (focusin).**/
	function wdOnFocusIn(ev) {
		if (__UNDERMAINTENANCE) console.log({wdOnFocusIn: ev, target: ev.target});
		data_wdCode(ev.target, ev);
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' wdOnSubmit(''object''  ev)``
	Disparador a ser invocado ao submeter formulário.**/
	function wdOnSubmit(ev) {
		if (__UNDERMAINTENANCE) console.log({wdOnSubmit: ev, target: ev.target});
		data_wdSend(ev.target, ev);
		return;
	};

/*----------------------------------------------------------------------------*/
	/**###### ``**function** ''void'' wdOnMouse(''object''  ev)``
	Disparador a ser invocado em eventos de mouse.**/
	function wdOnMouse(ev) {
		//if (__UNDERMAINTENANCE) console.log({wdOnMouse: ev, target: ev.target});
		if (event.target.nodeType !== 1) return;
		const events = {
			click:      {which: 1, bubbles : true, trigger: [
				data_wdSend, data_wdTsort, data_wdEdit, data_wdShared, data_wdSet,
				data_wdDisplay, navLink, data_wdMove, data_wdMenu
			]},
			dblclick:   {which: 1, bubbles : true, trigger: [data_wdMove]},

			mousedown:  {which: 1, bubbles : false, trigger: [data_wdMove]},
			mouseup:    {which: 1, bubbles : false, trigger: [data_wdMove]},
			mousemove:  {which: 1, bubbles : false, trigger: [data_wdMove]},
			mouseenter: {which: 1, bubbles : false, trigger: [data_wdMove]},
			mouseleave: {which: 1, bubbles : false, trigger: [data_wdMove]},
			mouseover:  {which: 1, bubbles : false, trigger: [data_wdMove, data_wdMenu]},
			mouseout:   {which: 1, bubbles : false, trigger: [data_wdMove]},

			drag:       {which: 1, bubbles : false, trigger: [data_wdMove]},
			dragstart:  {which: 1, bubbles : false, trigger: [data_wdMove]},
			dragend:    {which: 1, bubbles : false, trigger: [data_wdMove]},
			dragover:   {which: 1, bubbles : false, trigger: [data_wdMove]},
			dragenter:  {which: 1, bubbles : false, trigger: [data_wdMove]},
			dragleave:  {which: 1, bubbles : false, trigger: [data_wdMove]},
			drop:       {which: 1, bubbles : false, trigger: [data_wdMove]},
		};
		if (!(ev.type in events)) return;
		if (ev.which !== events[ev.type].which) return;
		events[ev.type].trigger.forEach(function (v,i,a) {

			v(ev.target, ev);


			/*let elem = ev.target;
			while (elem !== null) {
				v(elem, ev);
				//FIXME tem que ver esse negócio de efeito bolha (TODO ACABAR COM ISSO!!!)
				if (!events[ev.type].bubbles || "wdNoBubbles" in elem.dataset)
					elem = null;
				else
					elem = elem.parentElement;
			}*/
		});







		return;
	};

/*----------------------------------------------------------------------------*/
	const __TRIGGERS = {
		window: {
			target: window,
			events: {
				load:       wdOnLoad,
				resize:     wdOnResize,
				hashchange: wdOnHash,
			}
		},
		document: {
			target: document,
			events: {
				input:     wdOnInput,

				focusout:  wdOnFocusOut,
				focusin:   wdOnFocusIn,

				drag:      wdOnMouse,
				dragstart: wdOnMouse,
				dragend:   wdOnMouse,
				dragleave: wdOnMouse,
				dragover:  wdOnMouse,
				dragenter: wdOnMouse,
				drop:      wdOnMouse,

				click:      wdOnMouse,
				mousedown:  wdOnMouse,
				mouseup:    wdOnMouse,
				mousemove:  wdOnMouse,
				mouseenter: wdOnMouse,
				mouseleave: wdOnMouse,
				mouseover:  wdOnMouse,
				mouseout:   wdOnMouse,
				dblclick:   wdOnMouse,

				wddataset: wdOnDataset,
				wdreload:  wdOnReload,

				submit:    wdOnSubmit

			}
		}
	};

	for (let i in __TRIGGERS)
		for (let j in __TRIGGERS[i].events)
			__TRIGGERS[i].target.addEventListener(j, __TRIGGERS[i].events[j], false);

	return WD;
}());
