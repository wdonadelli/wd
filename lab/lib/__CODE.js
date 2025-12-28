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
.css-wd-code-doctype {color: darkred;}
.css-wd-code-comment {color: darkslategray;}
.css-wd-code-keyword {color: saddlebrown;}
.css-wd-code-value   {color: darkgreen;}
.css-wd-code-string  {color: darkgreen;}
.css-wd-code-tag     {color: blue;}
.css-wd-code-flag    {color: purple;}
.css-wd-code-line    {color: darkslategray;}


`),
	/**. '{string swap(string str)}: Retorna a string transformada em formato HTML (caracteres especiais).**/
	swap: function(str) {
		return str
		.replace(/\&/g, "&amp;")
		.replace(/\</g, "&lt;")
		.replace(/\>/g, "&gt;");
	},
	/**. '{string span(string look, string text)}: Retorna o texto da tag span para definição visual do código.**/
	span: function(look, text) {
		look = String(look).trim();
		text = text === undefined || text === null ? "" : text;
		const hex = (/^#[a-f0-9]{6}$/i).test(look);
		const tag = hex ? `style="color: ${look};"` : `class="css-wd-code-${look}"`;
		return `<span ${tag} >${text}</span>`;
	},
	/**. '{string comment(string str)}: Retorna os dados de entrada com i{flags} de comentário.**/
	comment: function(str) {
		const re   = /(\s?TODO|FIXME|OPTIMIZE|HACK|REVIEW\s?)/g;
		const self = this;
		return str.replace(re, function(text, p1) {return self.span("flag", p1);});
	},
	/**. '{string comment(string str)}: Retorna os dados de entrada com i{flags} de string.**/
	string: function(str) {
		const re   = /(\$|\\.)/g;
		const self = this;
		return str.replace(re, function(text, p1) {return self.span("flag", p1);});
	},
	/**. '{string xmlCode(string str)}: Retorna a string de unicode no formato HTML.**/
	xmlCode: function(str) {
		const re = /^\&\w+\;/;
		const find = str.match(re);
		if (find === null) return null;
		/*-- transformar string e retornar dados --*/
		const html = this.span("flag", this.swap(find[0]));
		return {length: find[0].length, html: html};
	},
	/**. '{string xmlAttribute(string str)}: Retorna a string de atributos/valores XML/HTML no formato HTML.**/
	xmlAttribute: function(str) {
		const re   = /([a-zA-Z_][a-zA-Z0-9_:-]*)((\s*\=\s*)(\"(?:[^\\]|\\.)*?\"|\'(?:[^\\]|\\.)*?\'|\`(?:[^\\]|\\.)*?\`|\S*))?(\s*)/g;
		const self = this;
		return str.replace(re, function(text, p1, p2, p3, p4, p5) {
			const p = [p1, p3, p4, p5].map(function(v,i,a) {
				return v === undefined ? "" : self.swap(v);
			});
			return self.span("keyword", p[0]) + p[1] + self.span("string", self.string(p[2])) + p[3];
		});
	},
	/**. '{object xmlTag(string str)}: Retorna os dados da string caso esteja no formato de i{tag} XML/HTML ou nulo.**/
	xmlTag: function(str) {
		/*-- partes da expressão regular --
		1) Captura a tag desde o caractere < até o espaço após o nome, se houver
			^(\<[?!/]?[a-zA-Z_][a-zA-Z0-9_:-]*\s*)
		2) Captura os atributos com ou sem sinal de igual
			((?:\s*[a-zA-Z_][a-zA-Z0-9_:-]*
		3) Captura os valores dos atributos (após o sinal de =) delimitados por ", ', ` ou sem delimitadores
			(?:\s*\=\s*(?:\"(?:\\\"|[^"])*\"|\'(?:\\\'|[^'])*\'|\`(?:\\\`|[^`])\`|\S*))?\s*)*)
		4) Encerra o caractere de tag >
			(\/?\>)
		----------------------------------------
		*/
		//(\')((?:[^\\]|\\.)*?)(\')
		const re = /^(\<[?!/]?[a-zA-Z_][a-zA-Z0-9_:-]*\s*)((?:[a-zA-Z_][a-zA-Z0-9_:-]*(?:\s*\=\s*(?:\"(?:[^\\]|\\.)*?\"|\'(?:[^\\]|\\.)*?\'|\`(?:[^\\]|\\.)*?\`|\S*))?\s*)*)(\/?\>)/;
		const find = str.match(re);
		if (find === null) return null;
		/*-- nome e tipo da tag --*/
		const name = find[1].replace("<", "").trim().toLowerCase();
		const type = name[0] === "?" || name[0] === "!" ? "doctype" : "tag";
		/*-- verificar abertura ou fechamento de script/style --*/
		const code = find[3] !== "/>";
		const push = code && (name ===  "script" || name ===  "style") ? `<span class="css-wd-code-${name}">` : "";
		const kill = code && (name === "/script" || name === "/style") ? `</span>` : "";
		/*-- transformar string e retornar dados --*/
		const html = kill + this.span(type, this.swap(find[1]) + this.xmlAttribute(find[2]) + this.swap(find[3])) + push;
		return {length: find[0].length, html: html};
	},
	/**. '{object xmlComment(string str)}: Retorna os dados da string caso esteja no formato de comentário XML/HTML ou nulo.**/
	xmlComment: function(str) {
		const re = /^(:?\<\!\-\-)((?:[^\\]|\\.)*?)(:?\-\-\>)/;
		const find = str.match(re);
		if (find === null) return null;
		/*-- transformar string e retornar dados --*/
		const html = this.span("comment", this.comment(this.swap(find[0])));
		return {length: find[0].length, html: html};
	},
	/**. '{string xml(string str)}: Retorna a string XML/HTML renderizado no formato HTML.**/
	xml: function(str) {
		const code = String(str).normalize();
		const HTML = (/\<\s*\/\s*html\s*\>/).test(str);
		const html = [];
		let i = 0;
		while (i < code.length) {
			let txt = code.slice(i);
			let tag = this.xmlTag(txt);
			let cmt = this.xmlComment(txt);
			let uni = this.xmlCode(txt);
			let xml = tag !== null ? tag : (cmt !== null ? cmt : (uni !== null ? uni : null));
			/*-- casou --*/
			if (xml !== null) {
				html.push(xml.html);
				i += xml.length;
			}
			/*-- não casou --*/
			else {
				const ahead = this.text(txt);
				html.push(this.swap(ahead.value));
				i += ahead.length;
			}
		}
		return this.pre(html.join(""), true);
	},
	/**. '{node pre(string code, boolean xml)}: Recebe a string do documento HTML do código e retorna o elemento HTML a renderizar.**/
	pre: function(code, xml) {
		const line = `<span class="css-wd-code-line"></span>`;
		const html = xml === true && (/\&lt\;\s*\/\s*html\s*\&gt\;/i).test(code);
		const pre  = __HTML("pre", {innerHTML: code, className: "css-wd-code-root"});
		/*-- se HTML --*/
		if (html) {
			/*-- transformar script --*/
			const script = pre.querySelectorAll(".css-wd-code-script");
			for (let i = 0; i < script.length; i++) {
				let inner = this.code(script[i].innerText, this.JS).innerHTML;
				script[i].innerHTML = inner.split(line).join("");
			}
			/*-- transformar style --*/
			const style = pre.querySelectorAll(".css-wd-code-style");
			for (let i = 0; i < style.length; i++) {
				let inner = this.code(style[i].innerText, this.CSS).innerHTML;
				style[i].innerHTML = inner.split(line).join("");
			}
		}
		/*-- adicionar linhas --*/
		pre.innerHTML = line + pre.innerHTML.replace(/\n/g, `\n${line}`);
		return pre;
	},
	/**. '{string atom(any base, boolean line)}: Retorna a string nos moldes de expressão regular para a particula '{base} que pode ser uma string ou expressão regular ou nulo. O argumento '{end}, se verdadeiro, equipara a quebra de linha ao fim da string.**/
	atom: function(base, end) {
		/*-- transforma grupo numerado (x) em não numerado (?:x) --*/
		const re = /(^|[^\\])(\()((?!\?))/g;
		/*-- equipara o fim da string à quebra de linha --*/
		const bl = end === true && base === "\n" ? "(?=\\n|$)" : null;
		/*-- retornos --*/
		if (typeof base === "string")
			return bl === null ? base.normalize().replace(/(\W)/g, `\\$1`) : bl;
		if (typeof base === "object" && base instanceof RegExp)
			return base.source.replace(re, "$1$2?:$3");
		return null;
	},
	/**. '{regexp reTrim(string open, string close, boolean caSe)}: Retorna a expressão regular de chaves delimitadoras.**/
	reTrim: function(init, last, caSe) {
		init = this.atom(init);
		last = this.atom(last, true);
		if (init === null || last === null) return null;
		const flag = caSe === false ? "i" : ""
		const re   = `^(${init})((?:[^\\\\]|\\\\.)*?)(${last})`;
		/*-- Capturas da Expressão Regular --
		1) ^(init)          => caracteres de abertura
		2) ((?:[^\\]|\\.)*?) => caracteres diferentes de \ ou escapes de forma não gulosa
		3) (last)           => caracteres de fechamento*/
		return new RegExp(re, flag);
	},
	/**. '{regexp reList(string list, boolean caSe)}: Retorna a expressão regular listagem.**/
	reList: function(list, caSe) {
		const atom = this.atom(typeof list === "string" ? list.trim().replace(/\s+/g, "\n") : list);
		if (atom === null) return null;
		const keys = typeof list !== "string" ? atom : atom
		.split("\\\n")
		.sort(function(a,b)  {return a.length > b.length ? -1 : 1;})
		.join("|");
		const flag = caSe === false ? "i" : "";
		const re   = `^()(${keys})(\\W|$)`;
		return new RegExp(re, flag);
	},
	/**. '{array rules(array data)}: Retorna um array com as regras da renderização organizadas:
	|Nome|Tipo|Descrição|
	|look|string|Define a aparência do fragmento.|
	|type|string|Define o tipo de captura: center, left (center + left), right (center + right), all.|
	|re|Expressão regular que captura o fragmento.|**/
	rules: function(data) {
		const rules = (Array.isArray(data) ? data : []).map(function(v,i,a) {
			if (v === null || typeof v !== "object") return null;
			const rule = {look: String(v.look).trim().toLowerCase()};
			/*-- listagem --*/
			if ("list" in v) {
				rule.type = "center";
				rule.re   = this.reList(v.list, v.case);
			}
			/*-- intervalo --*/
			else {
				/*-- delimitadores --*/
				let init  = "init" in v ? v.init : ("open"  in v ? v.open  : null);
				let last  = "last" in v ? v.last : ("close" in v ? v.close : null);
				last      = last === null ? /\1/ : last;
				/*-- tipo de captura e expressão regular --*/
				let left  = "init" in v;
				let right = "last" in v ? true : ("close" in v ? false : left);
				rule.type = left && right ? "all" : (!left && !right ? "center" : (left ? "left" : "right"));
				rule.re   = this.reTrim(init, last, v.case);
			}
			return rule.re === null ? null : rule;
		}, this).filter(function(v,i,a) {return v !== null;});
		return rules;
	},
	/**. '{object match(string str, array rules)}: Retorna os dados do casamento da expressão acrescentando às propriedades:
	|Nome|Tipo|Descrição|
	|length|integer|Comprimento da expressão casada.|
	|match|string|Expressão casada.|
	|data|array|Uma lista com o início, o meio e o fim do casamento.|**/
	match: function(str, rules) {
		for (let i = 0; i < rules.length; i++) {
			let find = str.match(rules[i].re);
			if (find !== null) {
				rules[i].length = find[0].length;
				rules[i].match  = find[0];
				rules[i].data   = [find[1], find[2], find[3]].map(function(v,i,a) {return v === undefined ? "" : v});
				return rules[i];
			};
		}
		return null;
	},
	/**. '{object text(string str)}: Retorna os dados do casamento de caracteres ou espaços (´{value} e '{length})**/
	text: function(str) {
		const text = /^(?:\w+|\s+)/;
		const find = str.match(text);
		return {
			length: find === null ?      1 : find[0].length,
			value:  find === null ? str[0] : find[0]
		};
	},
	/**. '{string code(string str, array rules)}: Retorna a string renderizada no formato HTML conforme regras:
	- O argumento '{rules} é uma lista de objetos que contém as regras de renderização;
	- Há dois tipos de regras: destaque por listagem ou por delimitadores;
	- A listagem é definida pela presença da propriedade '{list};
	- O valor de '{list} é uma string com palavras separadas por espaço ou uma expressão regular;
	- Os delimitadores possuem cadeias de caracteres de abertura e de fechamento, strings ou expressão regular;
	- A propriedade '{init} define os caracteres de abertura, participando do destaque;
	- A propriedade '{open} define os caracteres de abertura, não participando do destaque;
	- A propriedade '{init} é prevalente sobre '{open};
	- A propriedade '{last} define os caracteres de fechamento, participando do destaque;
	- A propriedade '{close} define os caracteres de fechamento, não participando do destaque;
	- A propriedade '{last} é prevalente sobre '{close};
	- Os delimitadores não encerram na quebra de linha, a menos que definam seu término nesse caractere;
	- A propriedade '{case}, se falsa, ignorará o tamanho da caixa do texto;
	- A propriedade '{look} é uma string que define o estilo do destaque;
	- O valor de '{look} pode ser "value", "string", "comment" e "doctype", cada um com destaque personalizado;
	- Os valores "string" e "comment" possuem bandeiras especiais;
	- O valor da propriedade '{look} também pode ser uma cor no formato hexadecimal '{#000000}; e
	- O método não tem por objetivo corrigir erros no código fonte, apenas define uma forma de destaque genérico.**/
	code: function(str, rules) {
		const code = String(str).normalize();
		const rule = this.rules(rules);
		const html = [];
		let i = 0;
		console.log(rule);//TODO apagar essa linha
		while (i < code.length) {
			let text = code.slice(i);
			let find = this.match(text, rule);
			/*-- fragmento não casado --*/
			if (find === null) {
				const ahead = this.text(text);
				html.push(this.swap(ahead.value));
				i += ahead.length;
			}
			/*-- fragmento casado --*/
			else {
				const data = find.data.map(function(v,i,a) {return this.swap(v);}, this);
				console.log(find, data)

				/*-- flags especiais --*/
				if (find.look === "string" || find.look === "comment")
					data[1] = this[find.look](data[1]);
				/*-- juntando as partes --*/
				if (find.type === "all")
					html.push(this.span(find.look, data.join("")));
				else if (find.type === "left")
					html.push(this.span(find.look, data.slice(0,2).join("")) + data[2]);
				else if (find.type === "center")
					html.push(data[0] + this.span(find.look, data[1]) + data[2]);
				else if (find.type === "right")
					html.push(data[0] + this.span(find.look, data.slice(1).join("")));
				i += find.length;
			}
		}
		//return `<pre class="css-wd-code-root">${html.join("")}</pre>`;
		return this.pre(html.join(""), false);
	},
	/**. '{array JS}: Lista com regras básicas para JavaScript.**/
	JS: [
		/*-- números hexadecimal, binário, octal e decimal --*/
		{look: "value", list: /(:?0x[a-fA-F0-9]+|0[bB][01]+|0o[0-7]+|(:?(?:\.?\d+|\d+\.\d+)(?:[eE][+-]?\d+)?)|\d+n)/},
		{look: "doctype", init: `"use strict"`, close: ";"},
		{look: "string",  init: /["'`]/},
		{look: "comment", init: "/*", last: "*/"},
		{look: "comment", init: "//", close: "\n"},
		{look: "value",   init: /\/[^/]/, last: "/"},
		{look: "value",   list: "false null true undefined NaN Infinity"},
		{look: "keyword", list: "break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof new return super switch throw try typeof var void while with let static yied await async this"},
	],
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
