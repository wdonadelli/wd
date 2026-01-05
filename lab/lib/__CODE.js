"use strict";
/**
#3 Código Fonte
O objeto '{__CODE} renderiza um código para o formato HTML.
**/
const __CODE = {
	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- CODE --*/
.css-wd-code {
	display:  block;
	position: relative;
	width:    auto;
	height:   auto;
	padding:  0;
	overflow: hidden;
	border:   thin solid #000000;
	border-radius: 0.2em;
}
.css-wd-code-root, .css-wd-code-edit {
	display:         block;
	width:           auto;
	height:          auto;
	margin:          0;
	padding:         1em 1em 1em 3em;
	overflow:        hidden;
	border:          none;
	font-family:     var(--var-js-wd-font-code);
	font-size:       16px;/*var(--var-js-wd-font-size);*/
	font-style:      normal;
	font-weight:     normal;
	text-align:      left;
	text-decoration: none;
	white-space:     pre-wrap;
	letter-spacing:  normal;
	word-break:      break-all;
}
.css-wd-code-root {
	position: relative;
	z-index:  0;
	counter-reset: line;
}
.css-wd-code-edit {
	position: absolute;
	top:      0;
	bottom:   0;
	right:    0;
	left:     0;
	z-index:  1;
	resize:   none;
	-webkit-text-fill-color: transparent;
}
.css-wd-code-line:before {
	counter-increment: line;
  content: counter(line);
  display: inline-block;
  width: 2.5em;
  margin-left: -3em;
  text-align: right;
  opacity: 0.3;
}

/*-- cores --*/
.css-wd-code-edit    {color: black; background-color: transparent;}
.css-wd-code-root    {color: black; background-color: white;}
.css-wd-code-base    {color: black;}
.css-wd-code-line    {color: darkslategray;}
.css-wd-code-flag    {color: purple;}
.css-wd-code-comment {color: darkslategray;}
.css-wd-code-name    {color: saddlebrown;}
.css-wd-code-value   {color: darkgreen;}
.css-wd-code-scope   {color: blue;}


`),
//darkred darkslategray saddlebrown darkgreen blue purple


	/**. '{string swap(string str)}: Retorna a string transformada em formato HTML (caracteres especiais).**/
	swap: function(str) {
		return str
		.replace(/\&/g, "&amp;")
		.replace(/\</g, "&lt;")
		.replace(/\>/g, "&gt;");
	},
	/**. '{boolean isHTML(string code)}: Retorna verdadeiro se o código tiver características de marcação HTML (tag HTML).**/
	isHTML: function(code) {
		code = code.normalize().replace(/\s+/, " ").trim();
		const html = /\<html(\s.*?|\s*)\>(.*)\<\/html(\s+)?\>$/i;
		return code[0] === "<" && html.test(code);
	},
	/**. '{node pre(string html, boolean line)}: Recebe a estrutura HTML e devolve o nó com linhas, se '{line} for verdadeiro.**/
	pre: function(html, line) {//FIXME mudar o nome e acabar com o outro método
		const span = `<span class="css-wd-code-line"></span>`;
		const base = line === true ? span + html.replace(/\n/g, `\n${span}`) : html;
		return __HTML("pre", {innerHTML: html, className: "css-wd-code-root"});
	},
	/**. '{regexp atom(any base)}: Adequa o valor recebido para expressão regular destinada a captura de escopos.**/
	atom: function(base) {
		if (typeof base === "object" && base instanceof RegExp)
			return new RegExp("^"+base.source.replace(/^\^/, ""), base.flags);
		return new RegExp("^"+String(base).normalize().replace(/(\W)/g, `\\$1`));
	},
	/**. '{array rules(array list)}: Adequa as regras fornecidas para efetuar capturas de escopo:
	|Propriedade|Tipo|Descrição|
	|init|regexp|Captura de início de escopo inclusivo|
	|open|regexp|Captura de início de escopo não inclusivo|
	|last|regexp|Captura de fim de escopo inclusivo|
	|close|regexp|Captura de fim de escopo não inclusivo|
	|rules|array|Lista de regras internas do escopo|
	|look|string|Nome da classe (CSS) a ser aplicada à regra|
	As propriedades '{init} e '{open} são incompatíveis assim como '{last} e '{close}, sendo '{init} e '{last} prevalentes.**/
	rules: function(list) {
		return !Array.isArray(list) ? [] : list.map(function(v,i,a) {
			/*-- checando item --*/
			if (v === null || typeof v !== "object") return null;
			/*-- capturando e checando atributos de extremidades --*/
			let init = "init" in v ? "init" : ("open"  in v ? "open"  : null);
			let last = "last" in v ? "last" : ("close" in v ? "close" : null);
			if (init === null || last === null) return null;
			/*-- capturando e checando valores de extremidades --*/
			const rule = {};
			rule[init] = this.atom(v[init]);
			rule[last] = this.atom(v[last]);
			rule.rules = this.rules(v.rules);
			rule.look  = String(v.look);;
			if (rule[init] === null || rule[last] === null) return null;
			/*-- retornando regra --*/
			return rule;
		}, this).filter(function(v,i,a) {return v !== null;});
	},
	/**. '{object match(string code, array rules)}: Checa o casamento de alguma regra no início do código e a retorna ou nulo.**/
	match: function(code, rules) {
		for (let i = 0; i < rules.length; i++) {
			if (rules[i]["init" in rules[i] ? "init" : "open"].test(code))
				return rules[i];
		}
		return null;
	},
	/**. '{object encode(object data, object scope, array rules)}: Construtor da estrutura HTML do código:
	|Argumento|Descrição|
	|data|Objeto que contém os dados da estrutura, utilizado para administrar a evoluçao da contrução.|
	|scope|Regra de abertura e encerramento do escopo.|
	|rules|Regas vigentes dentro do escopo.|**/
	encode:  function(data, scope, rules) {
		/*-- dados da análise --*/
		const INIT  = scope === null ? null : ("init" in scope ? "init" : "open");
		const LAST  = scope === null ? null : ("last" in scope ? "last" : "close");
		const LOOK  = scope === null ?   "" : scope.look;
		const init  = scope === null ? null : scope[INIT];
		const last  = scope === null ? null : scope[LAST];
		/*-- capturar abertura do scopo --*/
		if (INIT !== null) {
			let span = `<span class="${LOOK}" >`;
			let find = data.code.slice(data.i).match(init);
			let html = this.swap(find[0]);
			data.html.push(INIT === "init" ? span + html : html + span);
			data.i += find[0].length;
		}
		/*-- capturar dados do scopo --*/
		while(data.i < data.code.length) {
			let text = data.code.slice(data.i);
			let rule = this.match(text, rules);
			//console.log(rule)
			/*-- regra localizada --*/
			if (rule !== null) {
				this.encode(data, rule, rule.rules);
			}
			/*-- regra não localizada --*/
			else {
				/*-- checar fim do escopo --*/
				if (LAST !== null) {
					let end = text.match(last);
					if (end !== null) {
						let html = this.swap(end[0]);
						let span = "</span>";
						data.html.push(LAST === "last" ? html + span : span);
						data.i += LAST === "last" ? end[0].length : 0;
						return data;
					}
				}
				/*-- adicionar caractere ao escopo --*/
				let ahead = text.match(/^[a-zA-Z_]+/)
				data.html.push(this.swap(ahead === null ? text[0] : ahead[0]));
				data.i += ahead === null ? 1 : ahead[0].length;
			}
		}
		return data;
	},
	/**. 'FIXME {string code(string code, array rules, boolean line)}: Retorna a string renderizada no formato HTML conforme regras:
	- O argumento line, se verdadeiro, define se as linhas serão numeradas; FIXME
	- O argumento '{rules} é uma lista de objetos que contém as regras de captura e renderização;
	- As regras são analisadas na ordem estabelecida no array, critério para definir prioridades;
	- Cada escopo pode conter regras internas que seguem o mesmo formato;
	- As regras são baseadas em escopos identificados por  abertura e encerramento dentro do código;
	- As propriedades de abertura e encerramento podem ser expressões regulares ou strings;
	- A propriedade '{init} define a captura de abertura, participando do destaque;
	- A propriedade '{open} define a captura de abertura, não participando do destaque;
	- A propriedade '{init} é prevalente sobre '{open}, sendo obrigatória uma delas;
	- A propriedade '{last} define a captura de encerramento, participando do destaque;
	- A propriedade '{close} define a captura de encerramento, não participando do destaque;
	- A propriedade '{last} é prevalente sobre '{close}, sendo obrigatória uma delas;
	- Na propriedade '{last} há avanço na leitura do código, na propriedade '{close} não, retornando do mesmo ponto.//FIXME
	- A propriedade '{look} é uma string que define o nome do estilo CSS a ser aplicado ao escopo;
	- A propriedade '{rules} define as regras internas de cada escopo;
	- O valor de '{look} pode ser "value", "string", "comment" e "doctype", cada um com destaque personalizado;FIXME
	- O método não tem por objetivo corrigir erros no código fonte, apenas define uma forma de destaque genérico.**/
	code: function(code, rules) {
		const data = {code: String(code).normalize(), html: [], i: 0};
		this.encode(data, null, this.rules(rules));
		return data.html.join("");
	},




	get format() {
		const data = {};
		/*-- strings --*/
		data.escape  = {init: "\\", last: /./, look: "css-wd-code-flag",   rules: []};
		data.quotes  = {init: `"`,  last: `"`, look: "css-wd-code-value", rules: [data.escape]};
		data.quote   = {init: `'`,  last: `'`, look: "css-wd-code-value", rules: [data.escape]};
		data.strCode = {init: "${", last: "}", look: "css-wd-code-flag",   rules: [data.quotes, data.quote,]};
		data.string  = {init: "`",  last: "`", look: "css-wd-code-value", rules: [data.escape, data.strCode]};
		/*-- comments --*/
		data.flags = {init: /(TODO|FIXME|OPTIMIZE|HACK|REVIEW)(?!\w)/, close: /./, look: "css-wd-code-flag", rules: []};
		data.jsComment1 = {init: "//",   close: "\n",  look: "css-wd-code-comment", rules: [data.flags]};
		data.jsComment2 = {init: "/*",   last: "*/",   look: "css-wd-code-comment", rules: [data.flags]};
		data.cssComment = data.jsComment2;
		data.xmlComment = {init: "<!--", last: "-->",  look: "css-wd-code-comment", rules: [data.flags]};
		/*-- number --*/
		data.number  = {init: /(0x[a-fA-F0-9]+|0[bB][01]+|0o[0-7]+|d+n|(\.?\d+|\d+\.\d+)([eE][+-]?\d+)?)(?!\w)/, close: /./, look: "css-wd-code-value", rules: []};
		/*-- Javascript --*/
		data.jsFlags   = {init: "use strict", close: /\W/, look: "css-wd-code-flag", rules: []};
		data.jsValues  = {init: /(false|null|true|undefined|NaN|Infinity)(?!\w)/, close: /./, look: "css-wd-code-value", rules: []};
		data.jsKeys    = {init: /(break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|function|if|import|in|instanceof|new|return|super|switch|throw|try|typeof|var|void|while|with|let|static|yied|await|async|this)(?!\w)/, close: /./, look: "css-wd-code-name", rules: []};
		data.jsReList = {init: "[",             last: "]",  look: "",                  rules: [data.escape]};
		data.jsRegExp = {open: /[[(,=?:]\s*\//, close: "/", look: "css-wd-code-value", rules: [data.escape, data.jsReList]};
		data.JS = [data.quotes, data.quote, data.string, data.jsComment1, data.jsComment2, data.number, data.jsValues, data.jsKeys, data.jsRegExp, data.jsFlags];
		/*-- css --*/
		data.cssHigh  = {init: "!important", close: ";", look: "css-wd-code-flag", rules:[]}
		data.cssData  = {open: ":", close: ";", look: "css-wd-code-value", rules: [data.cssComment, data.quotes, data.quote, data.cssHigh]};
		data.cssMain  = {open: "{", close: "}", look: "css-wd-code-name",  rules: [data.cssComment, data.cssData]};
		data.cssQuery = {init: /[[*.#a-z]/i, last:  "}", look: "css-wd-code-scope", rules: [data.cssComment, data.quotes, data.quote, data.cssMain]};

		data.cssApply = {open: "{",  close: "}", look: "css-wd-code-base",  rules: [data.cssComment, data.cssQuery]};
		data.cssRule  = {init: "@",   last: "}", look: "css-wd-code-flag",  rules: [data.cssComment, data.quotes, data.quote, data.cssApply]};




		data .CSS     = [data.cssComment, data.cssRule, data.cssQuery];

		/*-- xml --*/
		data.xmlCode  = {init: `&`,                   last: /\w+\;/,   look: "css-wd-code-flag",  rules: []};
		data.xmlName  = {init: /[a-zA-Z_](\w|[:-])*/, close: /./,      look: "css-wd-code-name",  rules: []};
		data.xmlValue = {open: /\=\s*/,               close: /\W/,     look: "css-wd-code-value", rules: [data.quotes, data.quote]};
		data.xmlTag   = {init: /\<\/?[a-zA-Z_](\w|[:-])*/, last: ">",  look: "css-wd-code-scope", rules: [data.xmlName, data.xmlValue]};
		data.xmlDoc   = {init: /\<[!?][a-zA-Z_](\w|[:-])*/, last: ">", look: "css-wd-code-flag",  rules: [data.xmlName, data.xmlValue]};
		data.XML      = [data.xmlCode, data.xmlComment, data.xmlTag, data.xmlDoc];
		/*-- html --*/
		data.htmlJS    = {open: ">", close: /\<\/\s*script/i, look: "css-wd-code-base", rules: data.JS};
		data.tagScript = {init: /\<script\s*/i, close: /./, look: "css-wd-code-scope", rules: [data.xmlName, data.xmlValue, data.htmlJS]};
		data.HTML      = [data.xmlCode, data.xmlComment, data.tagScript, data.xmlTag, data.xmlDoc];
		return data;
	},


	get chupa() {
		const data = this.format;
		const info = [];
		for (let i in data) {
			if (Array.isArray(data[i])) continue;
			if (info.indexOf(data[i].look) >= 0) continue;
			info.push(data[i].look);
		}
		return info;


	},


	/**. '{array CSS}: Lista com regras básicas para CSS.**/
	CSS: [
		{look: "string",  init: /['"`]/},
		{look: "comment", init: "/*", last: "*/"},
		{look: "value",   list: /(?:\d+|\d*\.?\d+)(?:em|ch|rem|vw|vh|vmin|vmax|%|cm|mm|in|px|pt|pc)?/, case: false},
		{look: "value",   list: /\#[a-fA-F0-9]{6}/},
		{look: "keyword", list: /[a-zA-Z][a-zA-Z0-9\-]+\s*\:/,},
		{look: "value",   init: /[a-zA-Z][a-zA-Z0-9\-]+\s*\(/, last: ")"},
		//FIXME
		{look: "value",   list: Object.keys(__CSS.colors).join(" "), case: false}
	],
	/**. '{object heap}: Guarda os registros da regras aplicadas aos códigos para edição.**/
	heap: {},
	/**. '{void render(node edit)}: Obtem o código da área de edição e transfere renderizado para um novo elemento.**/
	render: function(edit) {
		const data = edit.id in this.heap ? this.heap[edit.id] : null;
		const code = edit.value;
		const swap = edit.parentElement.querySelector(".css-wd-code-root");
		let   root = null;
		if (data === null) return;
		/*-- definindo root --*/
		if (data.rules === "JS" || data.rules === "CSS")
			root = this.code(code, data.rules === "JS" ? this.JS : this.CSS);
		else if (data.rules === "XML" || data.rules === "HTML")
			root = this.xml(code);
		else
			root = this.code(code, data.rules);
		root = root === null ? this.code(code, []) : root;
		/*-- renderizando root --*/
		if (swap === null)
			edit.parentElement.appendChild(root);
		else
			edit.parentElement.replaceChild(root, swap);
		return;
	},
	/**. '{void attach(node textarea, any rules, boolean editable)}: Prepara o '{textarea} para renderização do código e, se '{editable} for verdadeiro, sua edição. O argumento '{rules} pode ser, além de um array de objetos, as strings "JS", "CSS", "XML" e "HTML". **/
	attach: function(textarea, rules, editable) {
		if (textarea.tagName.toLowerCase() !== "textarea") return;
		/*-- construir editor ainda não definido --*/
		if (!(textarea.id in this.heap)) {
			__HTML(textarea, {
				className:  "css-wd-code-edit",
				readOnly:   true,
				id:         __ID.id(textarea),
				spellcheck: false,
				translate:  false,
				disabled:   false,
				addEventListener: {keydown: this, input: this}
			});
			const frame = __HTML("div", {className: "css-wd-code", translate: false});
			textarea.parentElement.replaceChild(frame, textarea);
			frame.appendChild(textarea);
		}
		/*-- adicionar à pilha --*/
		this.heap[textarea.id] = {rules: rules, editable: editable === true};
		this.render(textarea);
		return;
	},
	/**. '{void insertKey(node textarea, string char)}: Adiciona o caractere '{char} na posição atual do seletor no '{textarea}.**/
	insertKey: function(textarea, char) {
		const start = textarea.selectionStart;
    const end   = textarea.selectionEnd;
		/*-- moderno --*/
		if ("setRangeText" in textarea) {
			textarea.setRangeText(char, start, end, "end");
			textarea.selectionStart = textarea.selectionEnd = textarea.selectionStart;
		}
		/*-- antigo --*/
		else {
	    const before = textarea.value.substring(0, start);
	    const after  = textarea.value.substring(end);
	    textarea.value = before + char + after;
  	  textarea.selectionStart = start + char.length;
  	  textarea.selectionEnd   = start + char.length;
		}
	},
	/**. '{void keydown(object ev)}: Manipulador para habilitar e desabilitar a edição do código.**/
	keydown: function(ev) {
		const editable = !ev.target.readOnly;
		/*-- ativar edição --*/
		if (!editable && ev.key === "Enter") {
			ev.preventDefault();
			ev.target.readOnly = false;
			return;
		}
		/*-- desativar edição --*/
		if (editable && ev.key === "Escape") {
			const start = ev.target.selectionStart;
			ev.target.readOnly = true;
			ev.target.focus();
			return;
		}
		/*-- habilitar tab na edição --*/
		if (editable && ev.key === "Tab") {
			ev.preventDefault();
			this.insertKey(ev.target, "\t");
      this.render(ev.target);
		}
		return;
	},
	/**. '{void input(object ev)}: Manipulador para editar o código.**/
	input: function(ev) {console.log(1);
		return this.render(ev.target);
	},
	/**. '{void handleEvent(object ev)}: Disparador de manipulação chamado durante os eventos '{input}.**/
	handleEvent: function(ev) {
		if (!(ev.target.id in this.heap))      return;
		if (!this.heap[ev.target.id].editable) return;
		if (ev.type in this) this[ev.type](ev);
		return;
	},






















};
