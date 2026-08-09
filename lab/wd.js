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
	const __CSS = `
		/*-- Inert ---------------------------------------------------------------*/
		${"inert" in document.body ? "" : "[inert] {display: none !important;}"}
		/*-- Freeze --------------------------------------------------------------*/
		.js-wd-freeze {overflow: hidden !important;}
		/*-- Tip/Validity --------------------------------------------------------*/
		.css-wd-form-error, .css-wd-tooltip {
			display: inline-block;
			padding: 0.25em;
			margin: 0.25em 0;
			font-size: var(--var-js-wd-font-size);
			font-family: var(--var-js-wd-font-type);
			border: thin solid;
			border-radius: 0.2em;
		}
		.css-wd-tooltip {
			display: none;
			position: absolute;
			top: 100%;
			left: 0;
		}
		*:hover > .css-wd-tooltip {
			display: inline-block;
			animation: js-wd-animation-emerge 3s ease;
		}
		/*-- Tip -----------------------------------------------------------------*/













		/*-- Signal: box --*/
		[data-js-wd-signal] {
			position: relative !important;
			display: flex !important;
			flex-direction: column !important;
			padding: 0 !important;
			margin: 0.25em 3px !important;
			box-shadow: 2px 2px 2px rgba(0,0,0,0.5) !important;
			animation: js-wd-animation-expand 0.5s ease !important;
			font-size: 14px !important;
			font-family: Tahoma, Verdana, sans-serif !important;
			line-height: 1.2 !important;
			border-radius: 0.3em !important;
			background-repeat: no-repeat !important;
			background-position: center !important;
			background-size: cover !important;
			background-origin: content-box !important;
		}

		[data-js-wd-signal="info"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(140, 180, 255) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(-15)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\24d8</text></svg>") !important;
		}
		[data-js-wd-signal="ok"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(160, 250, 160) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(0)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\2714</text></svg>") !important;
		}
		[data-js-wd-signal="warn"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(255, 255, 150) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(-15)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\26A0</text></svg>") !important;
		}
		[data-js-wd-signal="error"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(255, 200, 200) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(0)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\1F6AB</text></svg>") !important;
		}
		[data-js-wd-signal="dialog"] {
			margin: 0 !important;
			max-width: 95vw !important;
			min-width: 25vw !important;
			color: rgb(50, 50, 50) !important;
			background-color: rgb(200,220,220) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(-15)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\2BD1</text></svg>") !important;
		}

		@media screen and (min-width: 768px) {
			[data-js-wd-signal="dialog"] {max-width: 75vw !important;}
		}

		.js-wd-signal-head {
			padding: 0.5em 2em 0.5em 0.5em !important;
			border-bottom: thin solid !important;
			font-weight: bold !important;
		}
		.js-wd-signal-body {
			padding: 0.5em !important;
			white-space: pre-wrap !important;
		}
		.js-wd-signal-node {
			padding: 0 0.5em !important;
			display: flex !important;
			flex-direction: column !important;
		}
		.js-wd-signal-fire {
			display: flex !important;
			flex-direction: column !important;
			padding: 0.5em !important;
		}
		@media screen and (min-width: 768containspx) {
			.js-wd-signal-fire {
				flex-direction: row !important;
				justify-content: space-evenly !important;
				align-items: center !important;
			}
		}
		.js-wd-signal-kill {
			position: absolute !important;
			top: 0 !important;
			right: 0 !important;
			margin:  0.4em !important;
			height: 1em !important;
			width: 1em !important;
			border-radius: 0.5em !important;
			line-height: calc(5 / 6) !important;
			font-size: 1em !important;
			text-align: center !important;
			cursor: pointer !important;
			z-index: 10 !important;
		}
    .js-wd-signal-kill:focus, .js-wd-signal-kill:hover {outline: 1px solid !important;}



		/*-- dataset -------------------------------------------------------------*/
		[data-wd-grid] [aria-sort] {cursor: pointer !important;}
		[data-wd-grid] [aria-sort]:before {content: "\\2195 " !important;;}
		[data-wd-grid] [aria-sort="descending"]:before {content: "\\2191 " !important;}
		[data-wd-grid] [aria-sort="ascending"]:before  {content: "\\2193 " !important;}

		[data-wd-send], [data-wd-set], [data-wd-edit], [data-wd-shared] {
			cursor: pointer !important;
		}

		/*-- data-wd-float --------------------------------------------------------*/
		[data-wd-float] {cursor: context-menu !important;}


		[data-wd-repeat] > *, [data-wd-load] > * {visibility: hidden !important;}
		[data-wd-slide] > * {animation: js-wd-animation-emerge 1s, js-wd-animation-shrink-out 0.5s !important;}
		svg .js-wd-chart-hide {display: none !important;}
		@media screen and (min-width: 768px) {svg .js-wd-chart-hide {display: inline !important;}}
		wd-mark {background-color: rgba(154,205,50,0.7) !important; display: inline !important; border-radius: 0.2em !important; color: #000000 !important;}


		/*-- Códificação ---------------------------------------------------------*/

		/*-- containers --*/



		/*-- Importantes ---------------------------------------------------------*/
		/*FIXME o que é isso*/
		/*[data-js-wd-hide]:not([data-js-wd-show]) {
			display: none !important;
		}*/
		[data-js-wd-hide] {display: none !important;}

		[data-js-wd-cursor="move"],    [data-js-wd-cursor="move"]    * {cursor:     grab !important;}
		[data-js-wd-cursor="moving"],  [data-js-wd-cursor="moving"]  * {cursor:     move !important;}
		[data-js-wd-cursor="drag"],    [data-js-wd-cursor="drag"]    * {cursor:     grab !important;}
		[data-js-wd-cursor="draging"], [data-js-wd-cursor="draging"] * {cursor: grabbing !important;}


		[data-js-wd-area] {
			position: fixed !important;
			background-color: rgba(127,127,127,0.2) !important;
			z-index: 9999 !important;
		}
		[data-js-wd-area="vertical"] {
			top: 0 !important;
			bottom: 0 !important;
			height: 100vh !important;
			border-left:  thin dashed rgb(128, 128, 128) !important;
			border-right: thin dashed rgb(128, 128, 128) !important;
		}
		[data-js-wd-area="horizontal"] {
			left: 0 !important;
			right: 0 !important;
			width: 100vw !important;
			border-top:    thin dashed rgb(128, 128, 128) !important;
			border-bottom: thin dashed rgb(128, 128, 128) !important;
		}

		.js-wd-mark-text {
			background-color: lime !important;
			color: black !important;
		}
		`;
			//"*::backdrop {background-color: white;}",
			//TODO ver coloração https://developer.mozilla.org/pt-BR/docs/Web/CSS/background-color
			//TODO interessante https://developer.mozilla.org/en-US/docs/Web/CSS/::file-selector-button





/*============================================================================*/
	/**#3 Nós HTML
	#4 Pesquisa por Elementos
	''constructor object __Query(string css, node root=document)''
	Construtor para obter elementos HTML. O argumento '{css} é um seletor CSS válido e o argumento opcional '{root} define o elemento raiz da busca.	**/
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
		/**. '{array $$}: retorna uma lista de nós ('{NodeList}).**/
		$$: {
			get: function() {
				let elem = null;
				try {elem = this.root.querySelectorAll(this.css);} catch(e) {}
				return __Type(elem).node ? elem : document.querySelectorAll("#_._");
			}
		},
		/**. '{array $}: retorna um nó específico ou lista de nós ('{NodeList}) vazia.**/
		$: {
			get: function() {
				let elem = null;
				try {elem = this.root.querySelector(this.css);} catch(e) {}
				return __Type(elem).node ? elem : this.$$;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 Formulários
	''constructor object __FNode(node input)''
	Construtor para checar características de campo de formulário HTML (argumento '{input}).**/
	function __FNode(input) {
		if (!(this instanceof __FNode))	return new __FNode(input);
		const check = new __Type(input);
		if (!check.node || check.value.length < 1)
			throw new TypeError("Input value is not an HTML node");
		/*-- capturando informações --*/
		const data = {};
		data.node = check.value[0];
		data.tag  = data.node.tagName.toLowerCase();
		data.form = data.tag in this._config;
		if (data.form && "types" in this._config[data.tag]) {
			const attr = String(data.node.getAttribute("type")).toLowerCase();
			const prop = String(data.node.type).toLowerCase();
			const find = this._config[data.tag].types;
			data.type = attr in find ? attr : (prop in find ? prop : "text");
			data.work = attr === prop && attr in find;
			data.cfg  = this._config[data.tag].types[data.type];
		} else {
			data.type = data.form ? data.tag : "";
			data.work = data.form;
			data.cfg  = data.form ? this._config[data.tag] : null;
		}
		data.text  = data.form ? data.cfg.text  : false;
		data.send  = data.form ? data.cfg.send  : false;
		data.check = data.form ? data.cfg.check : "";
		data.mask  = !data.form || !data.cfg.mask ? false : (function () {
			const error = "A1!@#$%¨&*()+";
			const clone = data.node.cloneNode();
			try {clone.value = error;} catch(e) {}
			return clone.value !== error;
		})();
		Object.defineProperties(this, {
			/**. '{node node}: Retorna o nó.**/
			node:   {value: data.node},
			/**. '{string tag}: Retorna a tag do nó.**/
			tag:    {value: data.tag},
			/**. '{boolean form}: Informa se o nó é campo de formulário.**/
			form:   {value: data.form},
			/**. '{string ftype}: Retorna o tipo de formulário ou vazio.**/
			ftype:  {value: data.type},
			/**. '{boolean fmask}: Informa se o formulário possui máscara nativa implementada.**/
			fmask:  {value: data.mask},
			/**. '{boolean fsend}: Informa se o formulário pode ser enviado em requisições ou falso.**/
			fsend:  {value: data.send},
			/**. '{boolean fwork}: Informa se o formulário está implementado.**/
			fwork:  {value: data.work},
			/**. '{string fcheck}: Informa o tipo de verificação do valor do formulário.**/
			fcheck: {value: data.check},
			/**. '{boolean ftext}: Informa se o formulário aceita conteúdo de texto.**/
			ftext:  {value: data.text},
		});
	}

	Object.defineProperties(__FNode.prototype, {
		constructor: {value: __FNode},
		/**. '{object _msg}: Registra algumas mensagens de validação de formulários.**/
		_msg: {
			value: (function(){
				const re   = "[0-9]";
				const elem = __HTML("input", {required: true, title: re, pattern: re, value: "ABC"});
				const msg  = {
					pattern:  elem.validationMessage.replace(re , "?"),
					required: elem.validationMessage
				};
				Object.freeze(msg);
				return msg;
			})()
		},
		/**. '{object _config}: Contém as configurações sobre os campos de formulário.**/
		_config: {
			value: (function() {
				/*-- informações que definem o tipo do campo de formulário -------------
					tag.tipo:config1;config2
						tag: tag do elemento
						tipo: tipo do elemento quando houver (tag input e button)

					SUBMIT: o campo pode ser submetido em um formulário
					VISUAL: o campo possui representação textual
					VALUE.tipo: define o valor aceito pelo campo
					MASK: checar se o campo possui máscara nativa
				----------------------------------------------------------------------*/
				const config = [
					"button.button:VALUE.text;VISUAL",
					"button.reset:VALUE.text;VISUAL",
					"button.submit:SUBMIT;VALUE.text;VISUAL",
					"input.button:VALUE.text",
					"input.checkbox:SUBMIT;VALUE.check",
					"input.color:SUBMIT;MASK;VALUE.text",
					"input.date:SUBMIT;MASK;VALUE.datetime",
					"input.datetime-local:SUBMIT;MASK;VALUE.datetime",
					"input.datetime:SUBMIT;MASK;VALUE.datetime",
					"input.email:SUBMIT;MASK;VALUE.combo",
					"input.file:SUBMIT;VALUE.combo",
					"input.hidden:SUBMIT;VALUE.text",
					"input.image:",
					"input.month:SUBMIT;MASK;VALUE.datetime",
					"input.number:SUBMIT;MASK;VALUE.finite",
					"input.password:SUBMIT;VALUE.text",
					"input.radio:SUBMIT;VALUE.check",
					"input.range:SUBMIT;MASK;VALUE.finite",
					"input.reset:VALUE.text",
					"input.search:SUBMIT;VALUE.text",
					"input.submit:SUBMIT;VALUE.text",
					"input.tel:SUBMIT;VALUE.text",
					"input.text:SUBMIT;VALUE.text",
					"input.time:SUBMIT;MASK;VALUE.datetime",
					"input.url:SUBMIT;MASK;VALUE.text",
					"input.week:SUBMIT;MASK;VALUE.datetime",
					"meter:VALUE.finite",
					"option:VALUE.text;VISUAL",
					"output:VALUE.text;VISUAL",
					"progress:VALUE.finite",
					"select:SUBMIT;VALUE.combo",
					"textarea:SUBMIT;VALUE.text"
				];
				/*-- redesenhando config para objeto --*/
				const data = {};
				for (let i = 0; i < config.length; i++) {
					let item = config[i].split(":");
					let cfg1 = item[0].split(".");
					let cfg2 = item[1].split(";");
					let tag  = cfg1[0];
					let type = cfg1.length > 1 ? cfg1[1] : null;
					let val  = cfg2.filter(function(x) {return (/^VALUE\./).test(x);});
					if (type !== null && !(tag in data))
						data[tag] = {types: {}};
					let obj = type === null ? data : data[tag].types;
					obj[type === null ? tag : type] = {
						mask:  cfg2.indexOf("SUBMIT") >= 0,
						send:  cfg2.indexOf("SUBMIT") >= 0,
						text:  cfg2.indexOf("VISUAL") >= 0,
						check: val.length > 0 ? val[0].split(".")[1] : ""
					}
				}
				Object.freeze(data);
				return data;
			})()
		},
		/**. '{string fname}: Define ou retorna o valor do atributo '{name} do formulário ou vazio.**/
		fname: {
			get: function()  {return this.form ? this.node.name.trim() : "";},
			set: function(x) {
				if (this.form) this.node.name = x === null ? "" : String(x).trim();
			}
		},
		/**. '{any fvalue}: Define ou retorna o valor do formulário ou nulo.**/
		fvalue: {
			get: function() {
				if (!this.form) return null;
				const node  = this.node;
				const value = node.value;
				const check = new __Type(value);
				/*-- valor finito --*/
				if (this.fcheck === "finite") {
					return check.finite ? check.value : "";
				}
				/*-- data/tempo --*/
				if (this.fcheck === "datetime") {
					const data = __DATETIME.test(value);
					if (data === null)
						return "";
					if (data.type === "week" && __Time.weekToDate(data.iso) === null)
						return "";
					if (this.ftype === "datetime")
						return data.iso;
					if (data.type === "datetime" && this.ftype === "datetime-local")
						return data.form;
					if (data.type === this.ftype)
						return data.form;
					return "";
				}
				/*-- lista de valores --*/
				if (this.fcheck === "combo") {
					switch(this.ftype) {
						case "file": {
							const list = node.files;
							return !node.multiple && list.length > 1 ? [] : list;
						}
						case "email": {
							const list = value.split(",");
							for (let i = 0; i < list.length; i++) {
								let item = new __Type(list[i]);
								if (!item.email) return [];
								list[i] = list[i].trim();
							}
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
				/*-- valor boleano --*/
				if (this.fcheck === "check") {
					return node.checked ? value : null;
				}
				/*-- valor textual/cor --*/
				if (this.fcheck === "text") {
					const color = /^\#[0-9a-f]{6}$/i;
					switch(this.ftype) {
						case "color": return color.test(value.trim()) ? value.trim() : "#000000";
						case "url":   try {return new URL(value).href;} catch(e) {return "";}
					}
					return value;
				}
				/*-- outros valores --*/
				return null;
			},
			/*----------------------------------------------------------------------*/
			set: function(value) {
				if (!this.form) return;
				const node  = this.node;
				const check = new __Type(value);
				const mask  = this.fmask;
				/*-- apagar valor --*/
				if (check.null && this.fcheck !== "check") {
					node.value = null;
					return;
				}
				/*-- definir valor finito --*/
				if (this.fcheck === "finite") {
					if (check.finite) node.value = check.value;
					return;
				}
				/*-- definir data/tempo --*/
				if (this.fcheck === "datetime") {
					const data  = __DATETIME.test(value);
					if (data === null)
						return;
					if (data.type === "week" && __Time.weekToDate(data.iso) === null)
						return;
					if (this.ftype === "datetime")
						node.value = data.iso;
					else if (data.type === "datetime" && this.ftype === "datetime-local")
						node.value = data.form;
					else if (data.type === this.ftype)
						node.value = data.form;
					return;
				}
				/*-- definir lista de valores --*/
				if (this.fcheck === "combo") {
					if (this.ftype === "file")
						return;
					if (this.ftype === "email") {
						const list = check.array ? value : String(value).split(",");
						if (node.multiple === false && list.length > 1) return;
						for (let i = 0; i < list.length; i++) {
							let item = new __Type(list[i]);
							if (!item.email) return;
							list[i] = list[i].trim();
						}
						node.value = list.join(",")
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
				/*-- definir valores boleanos --*/
				if (this.fcheck === "check") {
					if (check.boolean)
						node.checked = check.value;
					else if (check.null)
						node.checked = !node.checked;
					else
						node.checked = check.value;
					return;
				}
				/*-- definir valores textuais/color/url --*/
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
		/**. '{boolean ferror}: Retorna se o campo de formulário é inválido.**/
		ferror: {
			get: function() {
				if (this.form) {
					/*-- Zerando erros personalizados --*/
					this.fvalidity = "";
					/*-- Erros implementados pelo navegador --*/
					if (this.node.checkValidity() === false) return true;
					/*-- Erros de valores (conteúdo e valor devem ser coerentes) --*/
					const combo  = this.fcheck === "combo";
					const value  = this.node.value !== "";
					const fvalue = combo ? this.fvalue.length > 0 : this.fvalue !== "";
					if (value && !fvalue) {
					 this.fvalidity = this._msg.pattern.replace("?", "");
					 return true;
					}
					/*-- Erros do dataset-wd-mask --*/
					if ("wdMask" in this.node.dataset)
						this.node.dispatchEvent(wdReloadEvent);
					/*-- retornando se há erro encontrado --*/
					return !this.node.checkValidity()	;
				}
				return false;
			}
		},
		/**. '{string fvalidity}: Define ou retorna mensagem de restrição do formulário.**/
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
		/**. '{object fsubmit}: Retorna um objeto contendo as propriedades '{name}, '{value}, '{error} e '{message} do formulário ou nulo se não for o caso para submeter.**/
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
		/**. '{void falert()}: Exibe a mensagem de erro na tela, se implementado pelo navegador.**/
		falert	: {
			value: function() {
				const validity = this.fvalidity;
				if (validity !== "") {
					if ("reportValidity" in this.node)
						this.node.reportValidity();
					else
						__SIGNAL.signal({body: validity, title: "!"});
				}
				return;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**
	#4 Nós
	''constructor object __Node(node input)''
	Construtor para manipulação de nós HTML.**/
	function __Node(input) {
		if (!(this instanceof __Node)) return new __Node(input);
		__FNode.call(this, input);
	}

	__Node.prototype = Object.create(__FNode.prototype, {
		constructor: {value: __Node},
		/**. '{any attribute(string name, any value)}: Define e retorna valores de atributos ou propriedades dos elementos HTML. O argumento '{name} (i{string}) corresponde ao nome do atributo ou da propriedade e '{value} o seu respectivo valor:
		|name|value|Ação|
		|Ausente|Ausente|Retorna um objeto com os u{atributos} do elemento.|
		|Presente|Ausente|Retorna o valor do atributo ou propriedade.|
		|Presente|Presente|Define o valor do atributo ou propriedade e o retorna.|
		- Caso o atributo ou a propriedade seja método, a lista de argumentos é definida como um array no argumento '{value};
		- Inicialmente, seja checada a existência da propriedade ou método e depois do atributo;
		- O manipulação de i{class/Name/List, style, dataset e add/removeEventListener} foram readequados.**/
		attribute: {
			value: function (name, value) {
				const tName  = new __Type(name);
				const tValue = new __Type(value);
				const isSet  = arguments.length > 1;
				const work   = tName.nonempty ? (isSet ? "set" : "get") : "all";
				/*-- RETORNAR LISTA DE ATRIBUTOS -------------------------------------*/
				if (work === "all") {
					const data = {};
					const attr = this.node.attributes;
					for (let i = 0; i < attr.length; i++)
						data[attr[i].name] = attr[i].value;
					return data;
				}
				/*-- RETORNAR/DEFINIR DADO -------------------------------------------*/
				else {
					name = name.trim();
					/*-- métodos/atributos com comportamento da biblioteca --*/
					const native = {
						style: "style", dataset: "dataset",
						class: "class", className: "className", classList: "classList",
						innerHTML: "innerHTML", outerHTML: "outerHTML",
						addEventListener: "addEventListener", removeEventListener: "removeEventListener",
						value: this.form ? "fvalue" : "value", name: this.form ? "fname" : "value",
					};
					/*-- COMPORTAMENTO DA BIBLIOTECA -----------------------------------*/
					if (name in native) {
						if (work === "set") this[native[name]] = value;
						return this[native[name]];
					}
					/*-- COMPORTAMENTO PADRÃO ------------------------------------------*/
					else {
						/*-- DEFINIÇÃO ---------------------------------------------------*/
						if (work === "set") {
							const cfg = {};
							cfg[name] = value;
							__HTML(this.node, cfg);
						}
						/*-- RETORNO -----------------------------------------------------*/
						if (name in this.node)
							return this.node[name];
						else
							return this.node.getAttribute(name);
					}
				}
					/*FIXME implanto ou não isso?
					/*-- propriedade booleana --* /
					if (testAttr.boolean && (testValue.boolean || value === "!")) {
						this.node[name] = testValue.boolean ? testValuevalue : !this.node[name];
					}
					*/
			}
		},
		/**. '{object style}: Define e retorna o valor do atributo '{style}. Se u{nulo}, o atributo é u{excluído}; se u{textual}, o é definido; e, se objeto, o atributo é definido conforme nome da propriedade e seu valor.**/
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
		/**. '{string|object className}: Propriedade auxiliar para a propriedade '{class}.**/
		className: {
			set: function(x) {this.class = x;},
			get: function()  {return this.class;}
		},
		/**. '{string|object classList}: Propriedade auxiliar para a propriedade '{class}.**/
		classList: {
			set: function(x) {this.class = x;},
			get: function()  {return this.class;}
		},
		/**. '{string|object class}: Define e retorna o valor do atributo '{class}. Se u{nulo}, o atributo é u{excluído}; se u{textual}, o valor é definido; e, se objeto, as seguintes ações são possíveis:
		|Nome|Tipo|Descrição|
		|replace|string|Substitui a primeira propriedade pela segunda.|
		|toggle|string|Alterna a existência das propriedades.|
		|add|string|Adiciona as propriedades.|
		|remove|string|Remove as propriedades.|
		Os valores das propriedades acima consiste no nome da propriedade CSS separada por espaço em branco.**/
		class: {
			get: function() {
				const attr = this.node.getAttribute("class");
				const list = attr === null ? [""] : attr.replace(/\s+/g, " ").trim().split(" ");
				const only = list.filter(function(v,i,a) {return a.indexOf(v) === i;});
				const sort = only.sort();
				const data = sort.join(" ");
				if (attr !== null)
					this.node.setAttribute("class", data);
				return data;
			},
			set: function(x) {
				const data = new __Type(x);
				if (data.chars) {
					this.node.setAttribute("class", x.trim());
				}
				else if (data.null) {
					this.node.removeAttribute("class");
				}
				else if (data.object) {
					const data = new __Array(this.class.split(" "));
					const sort = ["replace", "toggle", "add", "remove"];
					for (let i = 0; i < sort.length; i++) {
						if (sort[i] in x) {
							let list = String(x[sort[i]]).replace(/\s+/g, " ").trim().split(" ");
							data[sort[i]].apply(data, list);
						}
					}
					this.node.setAttribute("class", data.order.join(" "));
				}
				this.class;
			}
		},
		/**. '{array|object  addEventListener}: Propriedade para adicionar disparadores a eventos, aceitando dois tipos de valores.
		. Se o valor for um array, cada item do array corresponderá aos argumentos do método padrão, na mesma sequência (evento, disparador, captura).
		. Se o valor for um objeto, o nome da propriedade corresponderá ao evento e seu valor ao disparador ou uma lista de disparadores (array). A captura será definida pelo valor padrão.**/
		addEventListener: {
			set: function(x) {return this.eventListener(x, false);}
		},
		/**. '{array|object  removeEventLister}: Propriedade semelhante à i{addEventListener}, mas para remover disparadores dos eventos.**/
		removeEventListener: {
			set: function(x) {return this.eventListener(x, true);}
		},
		/**. '{void  eventListener(object|array data, boolean remove)}: Função auxiliar para as propriedades '{addEventListener} e '{removeEventListener}. O argumento '{data} define o valor de entrada e o argumento '{remove} define a exclusão do disparador.**/
		eventListener: {
			value: function(data, remove) {
				const check = new __Type(data);
				if (check.array) {
					const attr = remove === true ?  "removeEventListener" : "addEventListener";
					try {this.node[attr].apply(this.node, data);}
					catch(e) {if (__UNDERMAINTENANCE) console.info(e);}
				}
				else if (check.object) {
					for (let ev in data) {
						let event = String(ev).trim().replace(/^(on)?/i, "");
						let test  = new __Type(data[ev]);
						let list  = test.array ? data[ev] : [data[ev]];
						for (let i = 0; i < list.length; i++)
							this.eventListener([event, list[i]], remove);
					}
				}
				return;
			}
		},
		/**. '{object dataset}: Define e retorna o valor do atributo '{dataset}. Se u{nulo}, o atributo é u{excluído} e, se objeto, o atributo é definido conforme nome da propriedade e seu valor.**/
		dataset: {
			get: function() {
				const data = {};
				for (let i in this.node.dataset)
					data[i] = this.node.dataset[i];
				return data;
			},
			set: function(x) {
				const data  = new __Type(x);
				/*-- deletar todas as propriedades de dataset --*/
				if (data.null) {
					const attr = this.dataset;
					for (let i in attr)
						delete this.node.dataset[i];
				}
				/*-- definir ou excluir propriedades de dataset --*/
				else if (data.object) {
					const wddataset = [];
					for (let i in x) {
						let name = __String(i).camel;
						if (x[i] !== null) {
							this.node.dataset[name] = x[i];
							wddataset.push(name);
						}
						else if (name in this.node.dataset) {
							delete this.node.dataset[name];
						}
					}
					//FIXME consertar isso (não lembro mais o porquê)
					this.node.dataset.wddataset = wddataset.join(" ");
					this.node.dispatchEvent(wdDatasetEvent);
				}
				/*-- invocar evento de atribuição de dataset --*/
				//this.node.dispatchEvent(wdDatasetEvent);
			}
		},
		/**. '{node clone(boolean childs=true)}: Retorna um clone do objeto. Se o argumento opcional '{childs} for falso, os elementos filhos não serão clonados.**/
		clone: {
			value: function(childs) {
				let special = ["script"];
				/* se não for um script */
				if (special.indexOf(this.tag) < 0)
					return this.node.cloneNode(childs !== false);
				/* se for um script */
				let attrs = this.attribute();
				let clone = __HTML(this.tag, {innerHTML: this.node.innerHTML});
				for (let i in attrs)
					clone.setAttribute(i, attrs[i]);
				return clone;
			}
		},
		/**. '{string innerHTML}: Define ou retorna o valor da propriedade HTML para fins da biblioteca.|**/
		innerHTML: {
			get: function() {return this.node.innerHTML;},
			set: function(x) {
				this.node.innerHTML = x;
				this.node.dispatchEvent(wdReloadEvent);
				return;
			}
		},
		/**. '{string outerHTML}: Define ou retorna o valor da propriedade HTML para fins da biblioteca.|**/
		outerHTML: {
			get: function() {return this.node.outerHTML;},
			set: function(x) {
				const parent = this.node.parentElement;
				this.node.outerHTML = x;
				parent.dispatchEvent(wdReloadEvent);
				return;
			}
		},
		/**. '{void forcedHTML(string input, boolean outer)}: Define a propriedade i{inner/outerHTML} forçando a execução de scripts. O argumento '{input} (string) define o código HTML e o argumento '{outer} (boolean), se verdadeiro, definirá a propriedade "outer", caso contrário "inner".**/
		forcedHTML: {
			value: function(input, outer) {
				const re   = /\<script([^>]*\>)/ig;
				const to   = `<script data-wd-script="force" $1`;
				const code = String(input).replace(re, to);
				const elem = outer === true ? this.node.parentElement : this.node
				/*-- definindo propriedade --*/
				this.node[outer === true ? "outerHTML" : "innerHTML"] = code;
				/*-- executando scripts --*/
				const query = elem.querySelectorAll(`script[data-wd-script="force"]`);
				for (let i = 0; i < query.length; i++) {
					let node  = new __Node(query[i]);
					let clone = node.clone(true);
					clone.removeAttribute("data-wd-script");
					query[i].parentElement.replaceChild(clone, query[i]);
				}
				elem.dispatchEvent(wdReloadEvent);
				return;
			}
		},



		repeat: {value: function(list) {}},
		/**. '{boolean show}: Retorna e define a visibilidade do elemento nos termos da biblioteca.**/
		show: {
			//FIXME por que eu criei [data-js-wd-hide]:not([data-js-wd-show])
			get: function() {
				return !this.node.hasAttribute("data-js-wd-hide");
			},
			set: function(x) {
				if      (x === false) this.node.setAttribute("data-js-wd-hide", "");
				else if (x === true)  this.node.removeAttribute("data-js-wd-hide");
			}
		},
		/**. '{void only(boolean hide)}: Exibe o nó e esconde os irmãos ou, se '{hide} for verdadeiro, o contrário.**/
		only: {
			value: function(hide) {
				const elem = this.node;
				const data = new __Type(elem.parentElement.children);
				data.value.forEach(function(v,i,a) {
					const node = new __Node(v);
					node.show = v === elem ? (hide !== true) : (hide === true);
				});
			}
		},
		/**. '{void slice(number init, number last)}: Define o intervalo de nós filhos a ser exibido entre o índice inicial ('{init}) e final ('{last}), como no método '{Array.slice}.**/
		slice: {
			value: function (init, last) {
				const child = new __Type(this.node.children);
				const check = {init: new __Type(init), last: new __Type(last)};
				for (let i in check) check[i] = check[i].number ? check[i].value : undefined;
				const show = child.value.slice(check.init, check.last);
				child.value.forEach(function(v,i,a) {
					const node = new __Node(v);
					node.show = show.indexOf(v) >= 0;
				});
			}
		},

		//FIXME apagar: isso seria usado para carrossel e pages
		/**. '{array groups(boolean child)}: Retorna uma lista de objetos contendo os intervalos (propriedades '{init} e '{last}) dos elementos visíveis. Se o argumento '{child} for verdadeiro, a análise será dentre os filhos, caso contrário, entre elemento e seus irmãos.**/
		groups: {
			value: function(child) {
				const target = child === true ? this.node : this.node.parentElement;
				const nodes  = __Type(target.children).value;
				const groups = [];
				const data   = {init: null, last: null};
				for (let i = 0; i < nodes.length; i++) {
					let show = nodes[i].className.split(/\s/).indexOf("js-wd-hide") < 0;
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
		//FIXME apagar: isso seria usado para carrossel
		/**. '{void walk(integer n=1)}: Exibe um único nó filho avançando ou retrocedendo '{n} posições entre os irmãos. O argumento '{n} indica o intervalo a avançar (positivo) ou a retroceder (negativo).**/
		walk: {
			value: function(n) {
				if (this.node.childElementCount < 2) return this.slice(0, 0);
				const data   = __Type(n);
				const childs = this.node.childElementCount;
				const delta  = data.finite ? Math.trunc(data.value) : 1;
				const groups = this.groups(true);
				let   active = groups.length === 0 ? 0 : groups[0].init;
				if (delta >= 0)
					active = groups.length === 0 ? -1 : groups[groups.length - 1].last;
				let next   = (active + delta)%childs;
				if (next < 0) next = childs + next;
				this.slice(next, next);
			}
		},
		/**. '{integer page(integer size, integer page)}: Organiza os nós filhos em grupos ('{page}) de determinado tamanho ('{size}) e retornar o valor da última página.**/
		page: {
			value: function(size, page) {
				/*-- checando argumentos --*/
				const data = {size: new __Type(size), page: new __Type(page)};
				for (let i in data)
					data[i] = data[i].integer && data[i] > 0 ? data[i].value : 1;
				/*-- definindo o grupo --*/
				const len = this.node.childElementCount;
				const max = Math.trunc(len/data.size) + (len%data.size > 0 ? 1 : 0);
				data.page = (data.page > max ? max : data.page) - 1;
				const init = data.page * data.size;
				const last = init + data.size;
				this.slice(init, last);
				return max;
			}
		},

		/**. '{boolean mask(string model)}: Retorna falso se o conteúdo do elemento não corresponder ao modelo da máscara '{model} (ver __String.mask). Caso contrário, definirá o valor do conteúdo conforme definido pela máscara.**/
		mask: {
			value: function(model) {
				/*-- se for um formulário com máscara primitiva, não avaliar --*/
				if (this.fmask) return true;
				/*-- se o conteúdo for vazio, não avaliar --*/
				const val = this.node[!this.form || this.ftext ? "innerText" : "value"];
				if (val === "") return true;
				/*-- avaliando máscara --*/
				const str = new __String(val);
				const txt = str.mask(model);
				/*-- validando formulário --*/
				if (this.form)
					this.fvalidity = txt === "" ? this._msg.pattern.replace("?", model) : "";
				/*-- definindo valor da máscara --*/
				if (txt !== "" && txt !== val)
					this.node[!this.form || this.ftext ? "innerText" : "value"] = txt;
				return txt !== "";
			}
		},
		/**. '{void sort(boolean asc)}: Ordena os elementos filhos. O argumento '{asc} define a classificação, se verdadeiro ascendente, se falso descendente e, se ausemte, o inverso da classificação vigente.**/
		sort: {
			value: function(asc) {
				const node  = this.node;
				const child = new __Type(node.children);
				const array = new __Array(child.value);
				array.sort(asc).forEach(function(v,i,a) {node.appendChild(v);});
				return;
			}
		},
		/**. '{void tsort(integer order...)}: Ordena colunas de tabelas. Os argumentos '{order} definem a sequência de prioridade na classificação, com a indicação do número da coluna (a partir de 1, da esquerda para a direita). Se indicador da coluna for positivo, sua ordem será ascendente, caso contrário, descendente. O método deverá ser aplicado sobre o agrupador de linhas**/
		tsort: {
			value: function() {
				/*-- acertando argumentos --*/
				const args = [];
				const rule = [];
				for (let i = 0; i < arguments.length; i++) {
					let data = new __Type(arguments[i]);
					if (data.integer && data.value !== 0 && args.indexOf(data.value) < 0) {
						args.push(data.value);
						rule.push({asc: data.value > 0, col: Math.abs(data.value) - 1});
					}
				}
				/*-- ordernar linhas --*/
				const desc = new __Type(this.node.children);
				const rows = desc.value;
				rows.sort(function(a, b) {
					/*-- definindo quantidade de colunas em cada linha a comparar --*/
					const maxA  = a.childElementCount - 1;
					const maxB  = b.childElementCount - 1;
					/*-- looping pelas regras de ordenação --*/
					for (let i = 0; i < rule.length; i++) {
						let col = rule[i].col;
						let asc = rule[i].asc;
						/*-- índice das colunas informadas não constam na linha --*/
						if (col > maxA && col > maxB) continue;
						/*-- obter os valores para comparação --*/
						let dataA = col > maxA ? "" : a.children[col].innerText.toLowerCase();
						let dataB = col > maxB ? "" : b.children[col].innerText.toLowerCase();
						let textA = new __String(dataA);
						let textB = new __String(dataB);
						let typeA = new __Type(textA.near.trim());
						let typeB = new __Type(textB.near.trim());
						/*-- se os valores forem iguais, passar para a próxima regra --*/
						if (typeA.value === typeB.value) continue;
						/*-- caso contrário, definir ordenamento --*/
						let list = new __Array(typeA.value, typeB.value);
						let sort = list.sort(asc);
						return sort[0] === typeA.value ? -1 : +1;
					}
					/*-- se nenhuma ordenação for encontrada --*/
					return 0;
				});
				/*-- reordenar elementos --*/
				for (let i = 0; i < rows.length; i++)
					this.node.appendChild(rows[i]);
			}
		},
		/**. '{void jump(node list)}: O nó será adicionado aos elementos na ordem definida em '{list} a cada chamada do método. O argumento '{list} é uma lista de nós que acomodará o elemento.**/
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
		/**. '{void full()}: Alterna a exibição do nó em tela cheia.**/
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
		/**. '{object styles}: Retorna um objeto contendo os estilos e seus valores computados ao elemento.**/
		styles: {
			get: function() {
				const object = {};
				const styles = window.getComputedStyle(this.node, null);
				for (let i in styles)
					if (!(/\d+/).test(i))
						object[i] = styles[i];
				return object;
			}
		},
		/**. '{object position}: Retorna ou define o dimensionamento do elemento por meio de um objeto com os seguintes atributos: width, height, top, right, bottom e left. Os valores dependem do posicionalmento do elemento e devem ser numéricos.**/
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
		},
		/**. '{object highlight(boolean show)}: Exibe ou remove destaque ao elemento.**/
		highlight: {
			value: function(show) {
				if (show === false) {
					const query = document.querySelectorAll("[data-js-wd-area]");
					for (let i = 0; i < query.length; i++)
						query[i].remove();
				} else {
					const data  = this.node.getBoundingClientRect();
					const mouse = window.getComputedStyle(this.node).cursor;
					let  hline = document.querySelector(`[data-js-wd-area="horizontal"]`);
					let  vline = document.querySelector(`[data-js-wd-area="vertical"]`);
					if (hline === null) {
						hline = document.createElement("DIV");
						hline.dataset.jsWdArea = "horizontal";
						document.body.appendChild(hline);
					}
					if (vline === null) {
						vline = document.createElement("DIV");
						vline.dataset.jsWdArea = "vertical";
						document.body.appendChild(vline);
					}
					hline.style.top    = data.top+"px";
					hline.style.height = data.height+"px";
					hline.style.cursor = mouse;
					vline.style.left   = data.left+"px";
					vline.style.width  = data.width+"px";
					vline.style.cursor = mouse;
				}
				return;
			}
		},














		/**. '{void select()}: Seleciona o conteúdo do nó.**/
		select: {
			value: function() {
				const select = window.getSelection();
				const range  = document.createRange();
				select.removeAllRanges();
				range.selectNode(this.node);
				select.addRange(range);
				return;
			}
		},

		select2: {
			value: function() {
				const select = window.getSelection();
				const range  = document.createRange();
				select.removeAllRanges();
				range.selectNodeContents(this.node);
				select.addRange(range);
				return;
			}
		},

















		/**. '{vois copy()}: Seleciona o conteúdo do nó.**/
		copy: {
			value: function() {
				this.select();
				document.execCommand("copy");
				window.getSelection().removeAllRanges();
			}
		},

		copy2: {
			value: function() {
				this.select2();
				document.execCommand("copy");
				window.getSelection().removeAllRanges();
			}
		},






		/* copiar DOM: elemento ou tudo */
		/*let data = wd_vtype(value);
		if (data.type === "dom" && "execCommand" in document) {
			let element = data.value.length > 0 ? data.value[0] : document.body;
			let range   = document.createRange();
			let select  = window.getSelection();
			select.removeAllRanges();          /* limpar seleção existente */
			//range.selectNodeContents(element); /* pegar os nós do elemento */
		//	select.addRange(range);            /* seleciona os nós do elemento */
			//document.execCommand("copy");      /* copia o texto selecionado */
			//select.removeAllRanges();          /* limpar seleção novamente */
			//return true;
		//}
		/* copiar valor informado */
		//if ("clipboard" in navigator && "writeText" in navigator.clipboard) {
//			navigator.clipboard.writeText(value === null ? "" : value).then(
	//			function () {/*sucesso*/},
		//		function () {/*erro*/}
			//);
			//return true;


		cursor: {
			value: function(n) {
				this.select();
				window.getSelection().collapse(this.node, n);
			}
		},

	});

/*----------------------------------------------------------------------------*/
	/**#4 Tabela
	''constructor object __Table(any input)''
	Construtor para obter dados de tabela e matrizes. O argumento '{input} pode ser uma String CSV, uma matriz de array ou uma tabela HTML;**/
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
		  /**. '{node table}: Retorna a tabela.**/
		  {table: {value: table}}
		);
	}

	Object.defineProperties(__Table.prototype, {
		constructor: {value: __Table},
		/**. '{object to}: Retorna um objeto para exportar os dados da tabela para:
		|Nome|Descrição|
		|matrix|Retorna os nós i{td} e i{th} da tabela em forma de matriz 2X2|
		|values|Semelhante à propriedade '{matrix} mas exibe os valores das células|
		|struct|Retorna uma lista de objetos cujas propriedades correspondem ao título da coluna|
		|csv|Retorna os dados da tabela em formato CSV|
		|json|Retorna o resultado da propriedade '{values} no formato JSON|**/
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
		/**. '{string toString()}: Retorna os valores da tabela em formato CSV.**/
		toString: {value: function() {return this.to.csv;}},
		/**. '{string valueOf()}: Retorna os valores da tabela em forma de matriz.**/
		valueOf: {value: function() {return this.to.values;}},
		/**. '{integer rows}: Retorna a quantidade de linhas da tabela.**/
    rows: {get: function() {return this.valueOf().length;}},
		/**. '{integer cols}: Retorna a quantidade máxima de colunas da tabela.**/
    cols: {
    	get: function() {
    		const matrix = this.valueOf();
    		let cols = 0;
    		for (let i = 0; i < matrix.length; i++)
    			if (matrix[i].length > cols) cols = matrix[i].length;
    		return cols;
    	}
    },
    /**. '{string caption}: Define ou retorna o valor do título da tabela.**/
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
		/**. '{array cells(string target, function caller)}: Retorna uma lista de células da tabela conforme configuração definida no argumento '{target}.
		//FIXME os dois ponto está quebrando a linha errada
		. A célula é especificada pelos índices da linha e coluna separados por vírgula (i{row,col}), onde zero é a origem e o caractere "asterísco" o último índice. Para especificar um intervalo de células, deve-se separar as células por um caractere de "dois pontos" (i{row1,col1:row2,col2}), nesse caso, a linha e a coluna da célula inicial devem ser menores ou iguais a aqueles especificados na célula final. Para especificar várias células ou intervalos de forma independente, deve-se separá-los por um caractere de "ponto e vírgula" (i{row1,col1;row2,col2:row3,col3}).
		. A função opcional definida em '{caller} permite alterar o conteúdo retornado. Por padrão, cada item da lista conterá o nó '{td} ou '{th} da tabela conforme definido em '{target}. A função receberá três argumentos, o nó HTML e os índices da linha e coluna, nessa ordem. O retorno da função, se definido, definirá o novo valor do item da lista.**/
		cells: {
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
		/**.  '{node plot(object options)}: Retorna um gráfico de acordo com os dados da tabela e conforme especificado em '{options} (ver __Plot2D.add) ou nulo:
		|Nome|Tipo|Descrição|
		|xLabel|string|Rótulo do eixo i{x}.|
		|yLabel|string|Rótulo do eixo i{y}.|
		|title|string|Título do gráfico.|
		|xAxis|string|Define a formatação da escala do eixo i{x}, se i{number}, i{date}, i{time}, i{datetime} ou i{percent}.|
		|yAxis|string|Define a formatação da escala do eixo i{y} (ver xAxis).|
		|plot|string|Tipo de gráfico, i{plan}, i{cols} ou i{pie}.|
		|data|array|Uma lista de objetos com os parâmetros da plotagem.|
		. Os itens da propriedade '{data} são objetos com os seguintes especificações:
		|Nome|Tipo|Descrição|
		|x|any|Valores do eixo i{x}: um array, um objeto (cols ou pie) ou o número da coluna da tabela precedido de &num;.|
		|y|any|Valores do eixo i{y}, pode ser um array, uma função, uma constante ou o número da coluna precedido de &num;.|
		|label|string|Rótulo do gráfico.|
		|fit|string|Especifica o tipo do gráfico cartesiano.|
		. Os valores permitidos para o atributo '{fit} são:
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
				if (!__Type(options).object) return null;
				const chart = new __Plot2D(options.plot);
				const isCol = /^\#(\d+)$/;
				const data  = __Type(options.data).array ? options.data : [];
				/*-- propriedades principais --*/
				const names = ["xLabel", "yLabel", "title", "xAxis", "yAxis"];
				for (let i = 0; i < names.length; i++) {
					if (names[i] in options)
						chart[names[i]] = options[names[i]];
				}
				/*-- parâmetros de plotagem --*/
				for (let i = 0; i < data.length; i++) {
					if (!__Type(data[i]).object) continue;
					let struct = {x: data[i].x, y: data[i].y, label: data[i].label, fit: data[i].fit};
					let col, arr, cell;
					/*-- x faz referência à coluna --*/
					if (isCol.test(struct.x)) {
						col  = struct.x.replace(isCol, "$1");
						cell = `1,${col}:*,${col}`;
						arr  = this.cells(cell, function(v,r,c) {return v.innerText;});
						struct.x = arr;
					}
					/*-- y faz referência à coluna --*/
					if (isCol.test(struct.y)) {
						col = Number(struct.y.replace(isCol, "$1"));
						cell = `0,${col}:*,${col}`;
						arr = this.cells(cell, function(v,r,c) {return v.innerText;});
						struct.y     = arr.slice(1);
						struct.label = arr[0];
					}
					chart.add(struct.x, struct.y, struct.label, struct.fit);
				}
				return chart.plot();
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



/*----------------------------------------------------------------------------*/
	/**#4 WDnode
	''constructor object WDnode(any  input, object data)''
	Construtor genérico para manipulação de nós HTML. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDnode(input, data) {
		WDmain.call(this, input, data);
		const main = this._data.value.slice();
		main.forEach(function(v,i,a) {a[i] = new __Node(v);});
		Object.defineProperties(this, {
			_main:  {value: main},
			_array: {value: new __Array(main)}
		});
	}

	WDnode.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnode},

	});

/*----------------------------------------------------------------------------*/
	/**#4 WDmatrix
	''constructor object WDmatrix(any  input)''
	Cópia do construtor __Table**/
	function WDmatrix(input) {__Table.call(this, input);}
	WDmatrix.prototype = Object.create(__Table.prototype, {constructor: {value: WDmatrix}});

/*----------------------------------------------------------------------------*/



/*============================================================================*/
/**#3 Atributos HTML dataset**/
/*============================================================================*/

	/**#4 Dispositivo: Design Responsivo
	''function void data_wd_device(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-size|
	|Objetivo|Manipular atributo '{class} conforme tamanho da tela (design responsivo via javascript)|
	|Eventos|load wdreload wddataset resize|
	|Alvos|Elemento|
	|Grupos|Único|
	|Referências|__DEVICE|
	span{ }
	|Propriedades|Tipo|Descrição|
	|desktop|string|Estilos CSS aplicados à tela desktop.|
	|tablet|string|Estilos aplicados à tela tablet.|
	|phone|string|Estilos aplicados à tela phone.|
	|mobile|string|Estilos aplicados à tela tablet ou phone.|
	Observações:
	- Não há propriedade obrigatória; e
	- O estilos CSS devem estar separados por espaços em branco.**/
	function data_wd_device(target, event, wdArray) {
		const query  = WD(target);
		const data   = wdArray[0];
		const device = __DEVICE.device;
		const types  = { /* 0: elimina css, 1: adiciona css */
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
	/**#4 Requisições
	''function void data_wd_send(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-send|
	|Objetivo|Efetuar requisições web|
	|Eventos|click|
	|Alvos|Conforme especificado|
	|Grupos|Múltiplo|
	|Referências|__Request.send, __Node.submit|
	span{ }
	|Propriedades|Tipo|Descrição|
	|query|string|Seletor CSS dos campos de formulário a serem enviados|
	|noValidate|boolean|Se verdadeiro, a requisição não fará a validação primária dos campos.|
	|trigger|function|Nome do disparador a ser chamado durante a requisição.|
	Observações:
	- Demais propriedades seguem a definição de __Request.send, exceto i{body}, que será definido por '{query}; e
	- O disparador deve estar contido no escopo de '{window} utilizando-se de '{var} ou '{function}.**/
	function data_wd_send(target, event, wdArray) {
		let test, data, query, submit, trigger, head;
		for (let i = 0; i < wdArray.length; i++) {
			data    = wdArray[i];
			test    = new __Type(data.query);
			query   = test.node ? data.query : document.body;
			trigger = data.trigger;
			submit  = WD(query).submit(data.url, data.method, data.noValidate);
			/*-- cabeçalho --*/
			data.headers = new __DataSet(data.headers);
			/*-- Efetuar requisição se não encontrados erros --*/
			if (submit !== null) {
				data.url  = submit.url;
				data.body = submit.body;
				if (!data.headers.has("content-type"))
					data.headers.set("content-type", submit.ctype);
				WD(data).send(trigger);
			}
		}
		return;
	}

/*----------------------------------------------------------------------------*/
	/**#4 Requisições: formulários
	''function void data_wd_submit(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-submit|
	|Objetivo|Efetuar requisições assícronas por submissão de formulário|
	|Eventos|submit|
	|Alvos|Campos do elemento formulário|
	|Grupos|Único|
	|Referências|__Request.send, __Node.submit|
	Mecanismo semelhante à função '{data_wd_send} com as seguintes observações:
	- A propriedade query não se aplica, o conteúdo de i{body} é definido pelos campos vinculados ao formulário;
	- A propriedade i{url} é definida pelo atributo i{action} do formulário;
	- A propriedade i{method} é definida pelo atributo i{method} do formulário;
	- A propriedade i{noValidate} é definida pelo atributo i{noValidate} do formulário; e
	- A propriedade i{content-type} em i{headers} é definida pelo atributo i{enctype} do formulário.**/
	function data_wd_submit(target, event, wdArray) {
		const data  = wdArray[0];
		const form  = target;
		const query = form.elements;
		const html  = {method: null,	enctype: null, action: null, noValidate: null};
		const enter = (function(){
			const elem = document.activeElement;
			const test = new __Type(elem);
			const node = new __Node(test.node ? elem : form);
			const type = /^(image|submit)$/;
			return elem.form !== form || !type.test(node.ftype) ? null : elem;
		})();
		/*-- cabeçalho --*/
			data.headers = new __DataSet(data.headers);
		/*-- Informações do formulário: button ou form --*/
		for (let i in html) {
			/*-- 1) procurar atributo no elemento acionador --*/
			if (enter !== null) {
				const camel = "form"+(i.replace(i[0], i[0].toUpperCase()));
				const lower = camel.toLowerCase();
				const value = enter.hasAttribute(lower) ? enter[camel].trim() : "";
				html[i] = value !== "" ? value : null;
			}
			/*-- 2) se não localizado, buscar no formulário --*/
			if (html[i] === null) {
				const valid = !__Type(form[i]).node;
				const value = form.hasAttribute(i) ? form.getAttribute(i).trim() : "";
				html[i] = valid ? form[i] : (value !== "" ? value : null);
			}
		}
		/*-- Redefinindo atributos de configuração para envio à data_wd_send --*/
		if (html.method     !== null) data.method = html.method;
		if (html.action     !== null) data.url = html.action;
		if (html.enctype    !== null) data.headers.set("content-type", html.enctype);
		if (html.noValidate !== null) data.noValidate = html.noValidate;
		data.query = query;
		return data_wd_send(target, event, [data]);
	}

/*----------------------------------------------------------------------------*/
	/**#4 Carregamentos
	''function void data_wd_load(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-load|
	|Objetivo|Carregar conteúdos externos ao documento|
	|Eventos|load wdreload wddataset|
	|Alvos|Elemento|
	|Grupos|Único|
	|Referências|__Node.innerHTML/outerHTML/attribute|
	Possui as mesmas propriedades de i{data_wd_send}, exceto i{trigger} e i{type}, acrescida da seguinte propriedade:
	|Propriedades|Tipo|Descrição|
	|serialization|string|Comportamento da serialização outer/innerHTML/Text (__Node.attribute)|
	span{ }
	Observações:
	- Se o arquivo for CSV e a propriedade for inner/outerHTML, uma tabela com dados será adicionada ao documento;
	- O mesmo comportamento anterior ocorrerá caso o arquivo seja JSON com uma matriz (array de duas dimensões) de dados;
	- Em caso de innerText em elemento de formulário sem conteúdo textual, a propriedade modificada será a '{value}.**/
	function data_wd_load(target, event, wdArray) {
		const data   = wdArray[0];
		const node   = new __Node(target);
		data.type    = "text";
		data.trigger = function(x) {
			if (x.ok) {
				const mime = __MIME[x.contentType];
				const find = /^(inner|outer)(HTML|Text)$/;
				const attr = find.test(data.serialization) ? data.serialization : "innerHTML";
				const html = (/HTML$/).test(attr);
				let   text = x.response;
				if (html) {
					const parser = new __Parser(text);
					let test;
					if (mime === "html") {
						test = parser.stringHTML.get();
						text = test === null ? text : test.body.innerHTML;
					}
					else if (mime === "csv") {
						test = parser.csvTable.get();
						text = test === null ? text : test.outerHTML;
					}
					else if (mime === "json") {
						test = parser.stringJSON.matrixCSV.csvTable.get();
						text = test === null ? text : test.outerHTML;
					}
				}
				/*-- definir --*/
				if (attr === "innerText" && node.form && !node.ftext)
					node.attribute("value", text);
				else
					node.attribute(attr, text);
			}
		}
		return data_wd_send(target, event, [data]);
	}

/*----------------------------------------------------------------------------*/
	/**#4 Repetições
	''function void data_wd_repeat(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-repeat|
	|Objetivo|Replicar cópias de elementos os filhos com conteúdo configurável a partir de um arquivo externo.|
	|Eventos|load wdreload wddataset|
	|Alvos|Elemento|
	|Grupos|Único|
	|Referências|__Node.repeat|
	Possui as mesmas propriedades de i{data_wd_send}, exceto i{trigger} e i{type}.
	Os arquivos permitidos devem estar em formato CSV ou JSON (array de objetos);	**/
	function data_wd_repeat(target, event, wdArray) {
		const data   = wdArray[0];
		data.type    = "text";
		data.trigger = function(x) {
			if (x.ok)  {
				const mime = __MIME[x.contentType];
				let   list = null;
				if (mime === "json" || mime === "csv") {
					const parser = new __Parser(x.response);
					const value  = mime === "json" ? parser.stringJSON : parser.csvTable.tableValues.matrixList;
					list = value.get();
				}
				WD(target).repeat(list === null ? [] : list);
			}
		}
		return data_wd_send(target, event, [data]);
	}

/*----------------------------------------------------------------------------*/
	/**#4 Atribuição de Valores
	''function void data_wd_tools(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-tools|
	|Objetivo|Define ações aos elementos definidos por meio dos métodos de WDnode.|
	|Eventos|click|
	|Alvos|Elementos que possar receber cliques|
	|Grupos|Múltiplos|
	|Referências|__Node|
	span{ }
	Observações:
	- as ações serão aplicadas aos elementos definidos pela propriedade '{query} (seletor CSS de elementos);
	- se '{query} estiver ausente no grupo, terá como valor o próprio elemento; e
	- os argumentos dos métodos devem ser informados em arrays.**/
	function data_wd_tools(target, event, wdArray) {
		/*-- looping sobre os grupos --*/
		wdArray.forEach(function(group,i,a) {
			const test  = new __Type(group.query);
			const query = test.node ? group.query : target;
			const tools = WD(query);
			console.log({query: query, type: tools.type})
			/*-- looping pelos métodos --*/
			for (let method in group) {
				let check1 = new __Type(tools[method]);
				let check2 = new __Type(group[method]);
				if (check1.function && check2.array)
					tools[method].apply(tools, group[method]);
			}
		});
		return;
	};

/*----------------------------------------------------------------------------*/
	/**#4 Gráficos 2D
	''function void data_wd_chart(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-chart|
	|Objetivo|Cria um gráfico 2D a partir de comandos e dados em arquivos ou elementos.|
	|Eventos|load wdreload wddataset|
	|Alvos|Elementos que possar receber filhos renderizáveis|
	|Grupos|Único|
	|Referências|__Table.plot|
	Observações:
	- As propriedades do atributo têm a mesma estrutura do argumento do método __Table.plot;
	- O gráfico gerado substituirá o conteúdo do alvo;
	- A fonte de dados (opcional), é especificada por meio da propriedade '{source};
	- '{source} pode ser um elemento HTML (nó) ou o caminho (string) para um arquivo CSV ou JSON (array de duas dimensões);
	- No caso de fonte externa, as propriedades de i{data_wd_send}, exceto i{trigger} e i{type}, são aceitas;
	- O elemento poderá ser uma tabela, um campo de formulário ou elemento com conteúdo textual;
	- No caso de formulário ou conteúdo textual, o formato do conteúdo deverá ser em CSV.**/
	function data_wd_chart(target, event, wdArray) {
		const data = wdArray[0];
		const test = new __Type(data.source);
		const plot = function (input) {
			const table = new __Table(input);
			const svg   = table.plot(data);
			if (svg !== null) {
				target.innerHTML = "";
				target.appendChild(svg);
			}
		}
		/*-- elemento HTML como fonte de dados --*/
		if (test.node && test.value.length > 0) {
			const elem  = test.value[0];
			const node  = new __Node(elem);
			const form  = node.form && !node.ftext;
			const input = form ? elem.value : (node.tag === "table" ? elem : elem.textContent);
			plot(input);
		}
		/*-- arquivo CSV/JSON como fonte de dados --*/
		else if (test.nonempty) {
			data.url     = data.source;
			data.type    = "table";
			data.trigger = function(x) {
				if (x.done)
					plot(x.ok && x.response !== null ? x.response : undefined);
			};
			data_wd_send(target, event, [data]);
		}
		/*-- sem fonte de dados --*/
		else {
			plot();
		}
		return;
	}

/*----------------------------------------------------------------------------*/
	/**#4 Auto Clique
	''function void data_wd_click(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-click|
	|Objetivo|Promover eventos de clicagem ao elemento|
	|Eventos|load wdreload wddataset|
	|Alvos|Elementos que possam receber click|
	|Grupos|Único|
	|Referências|-|
	span{ }
	|Propriedades|Tipo|Descrição|
	|time|integer|Intervalos de tempo, em milissegundos, entre cliques (opcional)|
	|times|integer|Quantidade de vezes a repetir (opcional)|
	Observações:
	- Se '{time} for informado e '{times} não, a repetição ocorrerá indefinidamente;
	- Se '{times} for informado e '{time} não, a repetição ocorrerá sem intervalo de tempo;
	- Se nem '{time} e nem '{times} for informado, apenas um clique será executado;**/
	function data_wd_click(target, event, wdArray) {
		const data = wdArray[0];
		/*-- não há atributo: apagar identificador da interação --*/
		if (!("wdClick" in target.dataset)) {
			delete target.dataset.wdClickId;
		}
		/*-- primeira interação: executar clique e preparar repetições (com ou sem intervalo) --*/
		else if (event !== data) {
			const test = {time: new __Type(data.time), times: new __Type(data.times)};
			data.time  = test.time.integer  && test.time  > 0 ? test.time.value  : 0;
			data.times = test.times.integer && test.times > 0 ? test.times.value : 0;
			data.id    = String(new Date().valueOf());
			/*-- executar clique principal --*/
			target.click();
			/*-- repetir sem intervalo de tempo --*/
			if (data.time === 0) {
				while (--data.times > 0)
					target.click();
				delete target.dataset.wdClick;
			}
			/*-- repetir com intervalo de tempo --*/
			else {
				data.times = data.times === 0 ? Infinity : data.times;
				target.wdClickId = data.id;
				window.setTimeout(function() {
					data_wd_click(target, data, [data]);
				}, data.time);
			}
		}
		/*-- segunda interação: id válido --*/
		else if (data.id === target.wdClickId) {
			/*-- com repetições pendentes --*/
			if (--data.times > 0) {
				target.click();
				window.setTimeout(function() {
					data_wd_click(target, data, [data]);
				}, data.time);
			}
			/*-- sem repetições pendentes --*/
			else {
				delete target.wdClickId;
				delete target.dataset.wdClick;
			}
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	/**#4 Filtro Textual
	''function void data_wd_filter(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-filter|
	|Objetivo|Filtrar elementos de acordo com seu conteúdo textual|
	|Eventos|load wdreload wddataset input|
	|Alvos|Elementos que possam receber digitação|
	|Grupos|Único|
	|Referências|__Node.filter|
	span{ }
	|Propriedades|Tipo|Descrição|
	|query|string|Seletor CSS que define os elementos que terão seus filhos filtrados|
	|size|integer|Mesmo propósito do argumento de __Node.filter (opcional)|**/
	function data_wd_filter(target, event, wdArray) {
		const data   = wdArray[0];
		const query  = WD(data.query);
		const size   = data.size;
		const node   = new __Node(target);
		const regexp = /^\/(.+)\/([gim]+)?$/;
		const value  = target[node.form && !node.ftext ? "value" : "innerText"];
		const search = !regexp.test(value) ? value : (function() {
			const arg1 = value.replace(regexp, "$1");
			const arg2 = value.replace(regexp, "$2");
			return new RegExp(arg1, arg2);
		})();
		if (query.type === "node")
			query.filter(search, size);
		return;
	};

/*----------------------------------------------------------------------------*/
	/**#4 Filtro Textual FIXME continuar a partir daqui a arrumar a descrição e trocar $$ por propriedade
	''function void data_wd_tabs(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-filter|
	|Objetivo|Filtrar elementos de acordo com seu conteúdo textual|
	|Eventos|load wdreload wddataset input|
	|Alvos|Elementos que possam receber digitação|
	|Grupos|Único|
	|Referências|__Node.filter|
	span{ }
	|Propriedades|Tipo|Descrição|
	|$ ou $$|node|Seletor CSS que define os elementos que terão seus filhos filtrados|
	|size|integer|Mesmo propósito do argumento de __Node.filter (opcional)|**/

	function data_wd_tabs(target, event, wdArray) {
		//TODO ver __TAB
		return;
	};

/*----------------------------------------------------------------------------*/
	/**''function void data_wd_mask(node target, object event, array wdArray)''
	Função com o propósito de definir máscaras por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-mask|load wdreload wddataset focusout|Único|Múltiplos|__Node.display|Elemento que possa receber conteúdo|
	Possui as seguintes propriedades opcionais:
	|Nome|Tipo|Descrição|
	|model|string|Modelo da máscara|
	|check|function|Função a ser checada se a máscara casar ou não for informada|**/
	function data_wd_mask(target, event, wdArray) {
		const data  = wdArray[0];
		const node  = new __Node(target);
		const model = "model" in data ? String(data.model) : null;
		const check = __Type(data.check).function ? data.check : null;
		const mask  = model === null ? true : node.mask(model);
		if (mask && check !== null)
			node.fvalidity = check(node.form ? node.fvalue : target.textContent);
		return;
	};

/*----------------------------------------------------------------------------*/
	/**''function void data_wd_edit(node target, object event, array wdArray)''
	Função com o propósito de formatar textos em elementos editáveis por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-edit|click|Único|Múltiplos|-|Elementos que possa receber click|
	As propriedades e seus valores são advindas da ferramenta nativa i{execCommand}. TODO melhorar isso**/
	function data_wd_edit(target, event, wdArray) {
		const data = wdArray[0]
		for (let cmd in data) {
			let arg = data[cmd].trim() === "" ? undefined : data[cmd].trim();
			if (cmd === "createLink") {
				arg = prompt("Link:", "https://...");
				if (arg === null || arg.trim() === "") cmd = "unlink";
			}
			else if (cmd === "insertImage") {
				arg = prompt("Link:", "https://...");
			}
			document.execCommand(cmd, false, arg);
		}
		return;
	};







/*----------------------------------------------------------------------------*/
	/**''function void data_wdValue(node  e, object event)''
	Função vinculada ao atributo HTML '{data-wd-value} cujos objetivos são:
	- Aplicar e validar máscara;
	- Validar dados;
	- Renderizar dados; e
	- Obter e definir valores da URL.
	Possui múltiplos atributos e grupo único:
	|Nome|Descrição|
	|mask|Define o modelo da máscara a ser aplicada ao conteúdo.|
	|fail|Texto do erro da máscara.|
	|$$ ou $|Seletores CSS dos elementos de entrada vinculados ao valor de saída (i{output}).|
	|valid|Nome da função, definida no escopo de i{windows} com i{var} ou i{function}, para validar o valor.|
	|output|Nome da função, definida no escopo de i{windows} com i{var} ou i{function}, para definir o valor de saída.|
	A função i{output} será chamada quando os elementos de entrada dispararem um evento i{input}. Ela também será chamada ao carregar conteúdo ou definir o atributo. A função receberá o elemento e deverá retornar o seu valor.
	A aplicação da máscara será avalida nos carregamento de conteúdo, definição de atributo e quando o elemento perder o foco. Será chamada também no evento i{input} se i{output} for chamada. Se o conteúdo não casar com a máscara, o nó assumirá como mensagem de erro o valor de '{fail} ou o modelo da máscara.
	A função i{valid} será chamada nos carregamento de conteúdo e definição de atributo. A função receberá o elemento e deverá retornar o valor da mensagem de erro ou uma string em branco se não houver. No evento i{input}, i{valid} só será executada se i{output} tiver sido chamada.**/
	function data_wd_output(target, event, wdArray) {
		const nodes = WD.$$("[data-wd-output]");
		nodes.forEach(function(output,i) {
			const parser  = new __Parser(output.dataset.wdOutput);
			const wdarray = parser.wdArray.get();
			if (wdarray !== null) {
				const input = target;
				const data  = wdarray[0];
				const query = data.$$ || data.$ || null;
				const call  = __Type(data.call).function ? data.call : null;
				const list  = new __Type(query).value;
				if (query === null || call === null || list.indexOf(target) < 0) return;
				if ("$"  in data) delete data["$"];
				if ("$$" in data) delete data["$$"];
				delete data["call"];
				call(input, output, data)
			}
		});
		return;
	};


























/*----------------------------------------------------------------------------*/
	/**''function void data_wd_code(node target, object event, array wdArray)''
	Função com o propósito de definir exibições de codificação por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-code|load wdreload input|Múltiplas|Único|__Code|Elemento que possa receber texto de codificação.|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|word|string|Palavras reservadas da codificação|
	|value|string|Valores específicos da codificação|
	|string|string|Caracteres de abertura e fechamento de string|
	|comment|string|Caracteres de abertura e fechamento de comentários|
	|editable|boolean|Informa se o container poderá ser editado|
	|lines|boolean|Informa se as linhas serão numeradas|**/
	function data_wd_code(target, event, wdArray) {
		const data = wdArray[0];
		const node = new __Node(target);
		const text = node.form ? target.value : target.innerText.replace(/\s$/, "");
		const edit = data.editable !== true;
		const line = data.lines !== false;
		const code = new __Code(text);
		const tags = {code: "DIV", mask: "DIV", text: "TEXTAREA"};
		const name = ["value", "comment", "word", "string"];
		/*-- configurando código --*/
		for (let i = 0; i < name.length; i++) {
			if (name[i] in data)
				code.add(name[i], String(data[name[i]]));
		}
		/*-- construindo container e definindo propriedades --*/
		for (let i in tags) {
			tags[i] = document.createElement(tags[i]);
			tags[i].dataset.wdEncoding = i;
			tags[i].spellcheck = false;
			tags[i].translate  = false;
			if (i === "text") {
				tags[i].value    = text;
				tags[i].readOnly = edit;
				tags[i].id       = target.id;
			}
		}
		/*-- definindo disparador --*/
		tags.text.oninput  = function(ev) {
			code.input = tags.text.value;
			if (line) {
				const number = new __Number(code.input.split("\n").length);
				tags.code.dataset.wdEncodingLines = number.exp;
			}
			tags.mask.innerHTML = code.valueOf();
		};
		/*-- montando blocos e executando --*/
		tags.code.appendChild(tags.mask);
		tags.code.appendChild(tags.text);
		target.parentElement.replaceChild(tags.code, target);
		tags.text.oninput();
		return;
	};








/*----------------------------------------------------------------------------*/
	/**''function void data_wd_move(node target, object event, array wdArray)''
	Função com o propósito de mover o elemento por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-move|mousedown mousemove e mouseup|Único|Único|-|Elementos que possam ser movidos|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|$|node|Seletor CSS que define a o elemento a ser movido|
	O atributo i{data-wd-move} deve ficar sobre o elemento âncora e a propriedade i{$} especificará o elemento que será movido. Para um movimento padrão, a âncora deve ser um filho do elemento a se mover, se não definido, será o próprio elemento. Elementos com posicionamento i{static} e i{sticky} não serão movimentados.**/
	function data_wd_move(target, event, wdArray) {
		const data = wdArray[0];
		//FIXME aplicar __MOVE e estabelecer as teclas para acionar
		return;
	}

/*----------------------------------------------------------------------------*/
	/**''function void data_wd_drag(node target, object event, array wdArray)''
	Função com o propósito de arrastar elementos por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-drag|mousemove, dragstart e dragend|Múltipla|Múltiplos|-|Nós de elementos que possam ser arrastados|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|effect|string|(obrigatório) Efeito do arrasto: move, copy ou link|
	|drop|function|Função a ser executada ao derrubar o elemento|
	|$ ou $$|String|(obrigatório) Seletores CSS que identifica os elementos receptores do arrasto para o efeito especificado|
	Se o elemento arrastável tiver múltiplos efeitos, cada efeito deverá ser informado em um grupo diferente cuidando para que não haja concomitâncias de elementos receptores entre os grupos (o efeito do último grupo prevalecerá).
	A função '{drop} receberá como argumentos o elemento drop, o elemento drag e o efeito aplicado. Se nenhum função for especificada, um comportamento padrão será executado de acordo com o efeito definido.
	O elemento receptor não pode ser o elemento pai e nem o elemento arrastável ou estar contido nele.**/
	function data_wd_drag(target, event, wdArray) {
		const data = wdArray;
		return;
	}

/*----------------------------------------------------------------------------*/
	/**''function void data_wd_drop(node target, object event, array wdArray)''
	Função com o propósito de definir o comportamento do elemento ao receber arquivos arrastáveis por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-drop|dragover, dragleave e drop|Único|Múltiplos|-|Nós que podem receber informações de arquivos.|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|drop|function|Função a ser chamada ao derrubar os arquivos|
	A função i{drop} receberá como argumentos o elemento drop e os arquivos arrastáveis (FileList) e, se não informada, uma ação padrão será realizada. Nessa ação padrão, tentar-se-á carregar o arquivo na página (o primeiro arquivo de tamanho até 1000000 Bytes apenas).**/
	function data_wd_drop(target, event, wdArray) {}
/*----------------------------------------------------------------------------*/
	/**''function void data_wdTsort(node  e, object event)''
	Função vinculada ao atributo HTML '{data-wd-tsort} cujo objetivo é ordenar colunas específicas de tabelas. Não possui atributo.**/
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
/**''function void data_wd_float(node target, object event, array wdArray)''
	Função com o propósito de exibir elementos no ponto de clicagem por meio do atributo HTML i{data}.


	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-move|dragstart e dragend|Único|Múltiplos|-|Nós de elementos que possam ser arrastados|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|type|string|Tipo do movimento, que deve ser i{drag}|
	|effect|array|Efeitos do movimento: i{hide, move, copy e link}|**/
	function data_wd_float(target, event, wdArray) {
		console.log(wdArray[0])
		const data  = wdArray[0];
		const query = data.$ || data.$$ || null;
		const check = new __Type(query);
		const float = check.node ? check.value[0] : null;
		if (float !== null) {
			/*-- definindo propriedades e atributos --*/
			document.body.appendChild(float);
			float.tabIndex = -1;
			float.setAttribute("aria-modal", "false");
			float.onkeydown = function(ev) {
				ev.preventDefault();
				const re = /^(Escape|Tab)/i;
				if (re.test(ev.key)) float.style.display = "none";
			}
			/*-- definindo estilos --*/
			const place = target.getBoundingClientRect();
			float.style.position  = "fixed";
			float.style.display   = "block";
			float.style.maxWidth  = "30vw";
			float.style.maxHeight = "75vw";
			if (event.clientY > (window.innerHeight/2))
				float.style.top = (event.clientY - place.height)+"px";
			else
				float.style.top = (event.clientY)+"px";
			if (event.clientX > (window.innerWidth/2))
				float.style.left = (event.clientX - place.width)+"px";
			else
				float.style.left = (event.clientX)+"px";
			/*-- Focando no primeiro elemento focável --*/
			const child = float.querySelectorAll("*");
			for (let i = 0; i < child.length; i++) {
				if (child[i].tabIndex >= 0) {
					child[i].focus();
					break;
				}
			}
		}
		return;
	};

						//FIXME nos atributos dataset de clicar devo colocar tabindex, role e onkeydown?
						//TODO ideia: no evento keydown de enter forçar um click e tá resolvido
						//TODO ideia: no load e set definir tabindex se o atributo for de clique



/*============================================================================*/
/* -- DISPARADORES -- */
/*============================================================================*/
	/**''const object __EVENTS''
	Registra os eventos da biblioteca e seus disparadores.
	O primeiro nível de dados diz respeito ao nome do evento cujo valor é um objeto.
	O segundo nível de propriedades possui as seguintes características:
	|Nome|Tipo|Descrição|
	|target|object|É o alvo genérico (bubble) do disparador (window, document)|
	|preventDefault|boolean|Define se evoca o método preventDefault dp evento|
	|data|Array|Lista de objetos contendo a configuração de cada evento|
	|extra|string|Define uma especifidade a ser verificada para o evento (opcional)|
	Os itens da lista definida em '{data} possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|name|string ou nulo|Define o seletor CSS, se existir, vinculado ao disparador|
	|kill|boolean|Define se o atributo dataset será excluído após chamar o disparador|
	|bind|object|Propriedades obrigatórias do dataset que serão definidas caso não tenham sido|
	|call|function|nome do disparador|
	|extra|string|Define uma especifidade a ser verificada para o método (opcional)|
	Quanto aos tipo de seletores, tem-se:
	|Tipo|Exemplo|Comportamento|
	|atributo data|[data-wd-nome]|Aplica-se ao elementos descendentes do alvo|
	|atributo data|*[data-wd-nome]|Aplica-se ao elementos descendentes do documento|
	|propriedade dataset|wdNome|Aplica-se ao elemento titular da propriedade|
	|Seletor CSS|*|Aplica-se aos elementos identificados pelo seletor definido|
	|null|null|Aplica-se ao alvo específico|
	Regras específicas:
	- Se a propriedade '{target} for definida como window, document será considerado como alvo;
	- Os eventos só ocorrem para elementos HTML (tipo 1) ou document (tipo 9);
	- O valor dos tipos "atributo data" e "propriedade dataset" precisa estar no formato wdArray obrigatoriamente;
	- As propriedades '{bind} e '{kill} se aplicam apenas aos tipos "atributo data" e "propriedade dataset";
	- O disparador '{call} receberá como argumentos o alvo, os dados do evento e uma lista wdArray; e
	- A lista wdArray será nula nos casos de tipos diferentes de "atributo data" e "propriedade dataset".**/
	//FIXME quando o evento de clique receber um enter, forçar um click
	//FIXME implantar extra para cada disparador
	const __EVENTS = {
		wdreload: {
			target: window, preventDefault: false,
			data: [
				{name: "[data-wd-repeat]", call: data_wd_repeat,  kill: true,  bind: {headers: {}}},
				{name: "[data-wd-load]",   call: data_wd_load,    kill: true,  bind: {headers: {}}},
				{name: "[data-wd-chart]",  call: data_wd_chart,   kill: true,  bind: {}},
				{name: "[data-wd-code]",   call: data_wd_code,    kill: true,  bind: {}},
				{name: "[data-wd-click]",  call: data_wd_click,   kill: false, bind: {}},
				{name: "[data-wd-filter]", call: data_wd_filter,  kill: false, bind: {}},
				{name: "[data-wd-mask]",   call: data_wd_mask,    kill: false, bind: {}},
				{name: "[data-wd-device]", call: data_wd_device,  kill: false, bind: {}},
				{name: "[data-wd-tabs]",   call: data_wd_tabs, kill: true,  bind: {}},
			]
		},
		wddataset: {
			target: document, preventDefault: false, extra: "wddatasetList",
			data: [
				{name: "wdRepeat", call: data_wd_repeat, kill: true,  bind: {headers: {}}},
				{name: "wdLoad",   call: data_wd_load,   kill: true,  bind: {headers: {}}},
				{name: "wdChart",  call: data_wd_chart,  kill: true,  bind: {}},
				{name: "wdCode",   call: data_wd_code,   kill: true,  bind: {}},
				{name: "wdClick",  call: data_wd_click,  kill: false, bind: {id: null}},
				{name: "wdFilter", call: data_wd_filter, kill: false, bind: {}},
				{name: "wdMask",   call: data_wd_mask,   kill: false, bind: {}},
				{name: "wdDevice", call: data_wd_device, kill: false, bind: {}},
				{name: "wdTabs",   call: data_wd_tabs,   kill: true,  bind: {}},
			]
		},
		submit: {
			target: document, preventDefault: true,
			data: [
				{name: "wdSubmit", call: data_wd_submit, kill: false, bind: {headers: {}}}
			]
		},
		//FIXME verificar o impacto de preventDefault nos disparadores de clique (testar todos)
		click: {
			target: document, preventDefault: false, extra: "leftClick",
			data: [
				{name: "wdSend",    call: data_wd_send,    kill: false, bind: {headers: {}}},
				{name: "wdTools",   call: data_wd_tools,   kill: false, bind: {}},
				{name: "wdEdit",    call: data_wd_edit,    kill: false, bind: {}},
			]
		},
		input: {
			target: document, preventDefault: false, extra: "checkTypingTime",
			data: [
				{name: "wdFilter", call: data_wd_filter, kill: false, bind: {id: null}},
				{name: null,       call: data_wd_output, kill: false, bind: {}}
			]
		},
		focusout: {
			target: document, preventDefault: false,
			data: [
				{name: "wdMask", call: data_wd_mask,   kill: false, bind: {}},
				//{name: null,      call: data_wd_output, kill: false, bind: {}}
			]
		},
		focusin: {
			target: document, preventDefault: false,
			data: [
				//{name: null, call: wdOnFocusIn, kill: false, bind: {}}
			]
		},
		drag: {
			target: document, preventDefault: false,
			data: []
		},
		dragstart: {
			target: document, preventDefault: false,
			data: [
				//{name: "wdDrag", call: data_wd_drag, kill: false, bind: {}}
			]
		},
		dragend: {
			target: document, preventDefault: false,
			data: [
				//{name: "wdDrag", call: data_wd_drag, kill: false, bind: {}}
			]
		},
		dragleave: {
			target: document, preventDefault: true,
			data: [
				//{name: "html", call: data_wd_drop, kill: false, bind: {}}
			]
		},
		dragover: {
			target: document, preventDefault: true,
			data: [
				//{name: null, call: data_wd_drop, kill: false, bind: {}}
			]
		},
		dragenter: {
			target: document, preventDefault: true,
			data: []
		},
		drop: {
			target: document, preventDefault: true,
			data: []
		},
		mousedown: {
			target: document, preventDefault: false, extra: "leftClick",
			data: []
		},
		mouseup: {
			target: document, preventDefault: false, extra: "leftClick",
			data: []
		},
		mousemove: {
			target: document, preventDefault: false,
			data: []
		},
		mouseenter: {
			target: document, preventDefault: false,
			data: [
				//{name: "wdDrag", call: data_wd_drag, kill: false, bind: {effect: "all"}}
			]
		},
		mouseleave: {
			target: document, preventDefault: false,
			data: []
		},
		mouseover: {
			target: document, preventDefault: false,
			data: [
				{name: "wdDrag", call: data_wd_drag, kill: false, bind: {}}
			]
		},
		mouseout: {
			target: document, preventDefault: false,
			data: []
		},
		dblclick: {
			target: document, preventDefault: false, extra: "leftClick",
			data: []
		},
		keydown: {
			target: window, preventDefault: false,
			data: [],
		},
	};

	/**''function void eventManager(event)''
	Disparador genérico da biblioteca, administra o conteúdo de __EVENTS.**/
	function eventManager(event) {
		/*-- Checar alvo do evento: elemento (1) ou documento (9) ----------------*/
		const target = event.target === window ? document : event.target;
		if ([1, 9].indexOf(target.nodeType) < 0) return;
		/*-- obtendo dados iniciais --*/
		const config    = __EVENTS[event.type];
		const dataset   = config.data;
		const wddataset = [];
		const trigger   = [];
		const search    = /^\*?\[(data\-wd\-[0-9a-zA-Z\-]+)(\=[^\]]+)?\]$/;//TODO retirar o $ do fim da re?
		const extra     = {
			 /*-- tempo mínimo para digitação encerrar --*/
			 typingTime: function(ev) {
				const body = document.body;
				if (!("wdTypingTime" in ev)) {
					ev.wdTypingTime   = new Date().valueOf();
					body.wdTypingTime = ev.wdTypingTime;
					window.setTimeout(function() {eventManager(ev);}, 500);
					return false;
				}
				if (ev.wdTypingTime === body.wdTypingTime) {
					delete ev.wdTypingTime;
					delete body.wdTypingTime;
					return true;
				}
				return false;
			},
			/*-- clique com o botão esquerdo do mouse --*/
			leftClick: function(ev) {
				return event.which === 1;
			},
			/*-- capturar as propriedades definidas em dataset (wddataset = variável global) --*/
			wddatasetList: function(ev) {
				if (ev.target.nodeType === 1 && "wddataset" in ev.target.dataset) {
					const list = ev.target.dataset.wddataset.split(" ");
					list.forEach(function(v,i,a) {wddataset.push(v);});
					delete ev.target.dataset.wddataset;
				}
				return true;
			},
		};

		/*-- checar especifidades de cada evento ---------------------------------*/
		if ("extra" in config && config.extra in extra)
			if (!extra[config.extra](event)) return;

		/*-- Lista de disparadores: elementos qua casam com o parâmetro ----------*/
		let map, root, name, query;
		for (let i = 0; i < dataset.length; i++) {
			map = dataset[i];
			/*-- Elementos descendentes com atributo HTML data: *[data-wd...] (wdArray) --*/
			if (search.test(map.name)) {
				root  = map.name[0] === "*" ? document : target;
				name  = map.name.replace(search, "$1");
				query = WD.$$(map.name, root);
				query.forEach(function(node) {
					trigger.push({
						target:  node,                    /*-- nó alvo --*/
						name:    map.name,                /*-- selector CSS --*/
						call:    map.call,                /*-- função a ser chamada --*/
						bind:    map.bind,                /*-- configurações iniciais do evento --*/
						value:   node.getAttribute(name), /*-- valor do atributo --*/
						wdArray: null,                    /*-- valor de wdArray --*/
					});
					if (map.kill) node.removeAttribute(name);
				});
			}
			/*-- Elementos por nome da propriedade dataset: wdNome (wdArray) --*/
			else if ("dataset" in target && map.name in target.dataset) {
				trigger.push({
					target:  target,
					name:    map.name,
					call:    map.call,
					bind:    map.bind,
					value:   target.dataset[map.name],
					wdArray: null,
				});
				if (map.kill) delete target.dataset[map.name];
			}
			/*-- Busca genérica, independente da propriedade dataset ou atributo HTML data --*/
			else {
				query = typeof map.name === "string" ? WD.$$(map.name, document) : [target];
				query.forEach(function(node) {
					trigger.push({
						target:  node,
						name:    map.name,
						call:    map.call,
						bind:    map.bind,
						value:   "",
						wdArray: null,
					});
				});
			}
		}

		/*-- Analisando e chamando disparadores ----------------------------------*/
		const info = {};
		let parser, wdarray, count = 0;
		trigger.forEach(function(map,i,a) {
			/*-- evento wddataset: verificar se a propriedade definida está prevista --*/
			if (wddataset.length > 0 && wddataset.indexOf(map.name) < 0)
				return;
			/*-- verificar se o valor do atributo pode ser obtido --*/
			parser  = new __Parser(map.value);console.log(map)
			wdarray = parser.wdArray.get();
			if (wdarray === null)
				return;
			if (wdarray.length === 0)
				wdarray.push({});
			/*-- verificar se há alguma propriedade obrigatória a definir --*/
			for (let prop in map.bind) {
				for (let j = 0; j < wdarray.length; j++) {
					if (!(prop in wdarray[j]))
						wdarray[j][prop] = map.bind[prop];
				}
			}
			map.wdArray = wdarray;



			/*-- log de manutenção--*/
			info[event.type] = map.name;
			info.call = map.call.name;
			info.data = map.wdArray;
			if (__UNDERMAINTENANCE) console.info(info);

			/*-- chamar disparador --*/
			if (config.preventDefault && count === 0)
				event.preventDefault();
			map.call(map.target, event, map.wdArray);
			count++;
		});
		return;
	};

	/*-- defininir eventos e disparadores --*/ //FIXME desabilitei isso aqui, ligar depois
	/*for (let ev in __EVENTS)
		__EVENTS[ev].target.addEventListener(ev, eventManager, false);*/



	window.addEventListener("resize", __DEVICE);
	window.addEventListener("resize", __HASH);
	window.addEventListener("hashchange", __HASH);
	window.addEventListener("wdreload", __HASH);
	window.addEventListener("load", function(ev) {
		document.dispatchEvent(wdReloadEvent);
		return;
	});
	/*-- retornar a função principal da biblioteca --*/
	return WD;
}());