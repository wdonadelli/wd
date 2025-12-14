"use strict";
/**
#3 Código Fonte
O objeto '{__CODE} renderiza um código para o formato HTML.
**/
const __CODE = {
	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- CODE --*/
.css-wd-code-root       {color: black; background-color: snow; padding: 1em; font-family: Fira Mono, DejaVu Sans Mono, Menlo, Consolas, Liberation Mono, Monaco, Lucida Console, monospace;}
/*-- divisões --*/
.css-wd-code-tag        {color: royalblue;}
.css-wd-code-doctype    {color: red;}
.css-wd-code-comment    {color: silver;}
/*-- palavras chaves --*/
.css-wd-code-attribute  {color: orange;}
.css-wd-code-keyword    {color: orange;}
/*-- valores --*/
.css-wd-code-value      {color: green;}
.css-wd-code-string     {color: green;}
/*-- especiais --*/
.css-wd-code-flag       {font-weight: bold; background-color: yellow;}
.css-wd-code-style      {color: black; font-style: italic;}
.css-wd-code-script     {color: black; font-style: italic;}

`),
	/**. '{string swap(string str)}: Retorna a string transformada em formato HTML (caracteres especiais).**/
	swap: function(str) {
		return str
		.replace(/\&/g, "&amp;")
		.replace(/\</g, "&lt;")
		.replace(/\>/g, "&gt;");
	},
	/**. '{string span(string name, string text, boolean swap)}: Retorna o texto da tag span para definição visual do código.**/
	span: function(name, text, swap) {
		text = text === undefined || text === null ? "" : text;
		text = swap === true ? this.swap(text) : text;
		return `<span class="css-wd-code-${name}">${text}</span>`;
	},
	/**. '{string comment(string str)}: Retorna os dados da string no formato HTML.**/
	comment: function(str) {
		const re   = /(\s?TODO|FIXME|OPTIMIZE|HACK|REVIEW\s?)/g;
		const self = this;
		const html = this.swap(str).replace(re, function(text, p1) {return self.span("flag", p1);});
		return this.span("comment", html);
	},
	/**. '{string xmlAttribute(string str)}: Retorna a string de atributos/valores XML/HTML no formato HTML.**/
	xmlAttribute: function(str) {
		const re   = /([a-zA-Z_][a-zA-Z0-9_:-]*)((\s*\=\s*)(\"(?:\\\"|[^"])*\"|\'(?:\\\'|[^'])*\'|\`(?:\\\`|[^`])*\`|\S*))?(\s*)/g;
		const self = this;
		return str.replace(re, function(text, p1, p2, p3, p4, p5) {
			const p = [p1, p3, p4, p5].map(function(v,i,a) {return v === undefined ? "" : v;})
			return self.span("attribute", p[0], true) + p[1] + self.span("value", p[2], true) + p[3];
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
		const re = /^(\<[?!/]?[a-zA-Z_][a-zA-Z0-9_:-]*\s*)((?:[a-zA-Z_][a-zA-Z0-9_:-]*(?:\s*\=\s*(?:\"(?:\\\"|[^"])*\"|\'(?:\\\'|[^'])*\'|\`(?:\\\`|[^`])*\`|\S*))?\s*)*)(\/?\>)/;
		const find = str.match(re);
		if (find === null) return null;
		const name = find[1].replace("<", "").trim().toLowerCase();
		const main = name[0] === "?" || name[0] === "!" ? "doctype" : "tag";
		const code = name === "script" || name === "style";
		const open = find[3] !== "/>";
		const push = open && (name ===  "script" || name ===  "style") ? `<span class="css-wd-code-${name}">` : "";
		const kill = open && (name === "/script" || name === "/style") ? `</span>` : "";
		const html = kill + this.span(main, this.swap(find[1]) + this.xmlAttribute(find[2]) + this.swap(find[3])) + push;
		return {length: find[0].length, html: html};
	},
	/**. '{object xmlComment(string str)}: Retorna os dados da string caso esteja no formato de comentário XML/HTML ou nulo.**/
	xmlComment: function(str) {
		const re = /^(?:\<\!\-\-(?:(?!\-\-\>)(?:.|\s))*\-\-\>)/;
		const find = str.match(re);
		const html = find === null ? null : this.comment(find[0]);
		return html === null ? null : {length: find[0].length, html: html};
	},
	/**. '{string xml(string str)}: Retorna a string XML/HTML renderizado no formato HTML.**/
	xml: function(str) {
		const code = String(str).normalize();
		const html = [];
		let i = 0;
		while (i < code.length) {
			let txt = code.slice(i);
			let tag = this.xmlTag(txt);
			let cmt = this.xmlComment(txt);
			let xml = tag !== null ? tag : (cmt !== null ? cmt : null);
			if (xml !== null) {
				html.push(xml.html);
				i += xml.length;
			}
			else {
				html.push(this.swap(code[i]));
				i++;
			}
		}
		return `<pre class="css-wd-code-root">${html.join("")}</pre>`;
	},
	/**. '{regexp reTrim(string open, string close, boolean noCase)}: Retorna a expressão regular de chaves delimitadoras.**/
	reTrim: function(open, close, noCase) {
		const init = open.replace(/([\W])/g, `\\$1`);
		const last = close.replace(/([\W])/g, `\\$1`);
		const flag = noCase === true ? "i" : "";
		/*-- modelo aspas: /^(\"(?:\\\"|[^"])*\")/ --*/
		if (close.length === 1)
			if (close[close.length - 1] !== "\n")
				return new RegExp(`^(?:${init}(?:\\\\${last}|[^${last}])*${last})`, flag);
			else
				return new RegExp(`^(?:${init}(?:\\\\${last}|[^${last}])*${last}?)`, flag);
		/*-- modelo tag: /^(\<\!\-\-(?:(?!\-\-\>)(?:.|\s))*\-\-\>)/ --*/
		return new RegExp(`^(?:${init}(?:(?!${last})(?:.|\\s))*${last})`, flag);
	},
	/**. '{regexp reWord(string list, boolean noCase)}: Retorna a expressão regular listagem.**/
	reWord: function(list, noCase) {
		const keys = list
		.trim()
		.replace(/\s+/g, " ")
		.split(" ")
		.map(function(v,i,a) {return v.trim().replace(/([\W])/g, `\\$1`);})
		.sort(function(a,b)  {return a.length > b.length ? -1 : 1;})
		.join("|");
		return new RegExp(`^(${keys})(?:\\W)`, noCase === true ? "i" : "");
	},
	/**. '{array rules(array data)}: Retorna um array com as regras da renderização organizadas:
	|Nome|Tipo|Descrição|
	|type|string|Define o nome da formatação a ser usada (ver '{__CSS}|
	|re|regexp|Retorna a expressão regular que captura o casamento da expressão|
	|apart|boolean|Se falso, casa a expressão inteira, casos contrário, deve-se ignorar o último caractere.|**/
	rules: function(data) {
		const rules = (Array.isArray(data) ? data : []).map(function(v,i,a) {
			if (v === null || typeof v !== "object") return null;
			const type = String(v.type).trim().toLowerCase();
			const caSe = v.noCase === true;
			/*-- delimitadores --*/
			if (typeof v.open === "string" && v.open.trim() !== "") {
				const init = v.open;
				const last = typeof v.close === "string" ? v.close : init;
				const trim = this.reTrim(init, last, caSe);
				return {type: type, re: trim, apart: false};
			}
			/*-- palavras --*/
			if (typeof v.list === "string" && v.list.trim() !== "") {
				const word = this.reWord(v.list, caSe);
				return {type: type, re: word, apart: true};
			}
			return null;
		}, this).filter(function(v,i,a) {return v !== null;});
		/*-- número decimal FIXME delimitador?--*/
		rules.push({type: "value", re: /^([+-]?(?:\.?\d+|\d+\.\d+)(?:[eE][+-]?\d+)?)(?:\W)/, apart: true});
		/*-- número hexadecimal FIXME delimitador?--*/
		rules.push({type: "value", re: /^([+-]?0x[0-9a-fA-F]+)(?:[^0-9a-fA-F])/, apart: true});
		/*-- número binário FIXME delimitador? --*/
		rules.push({type: "value", re: /^([+-]?0[bB][01]+)(?:[^01])/, apart: true});

		return rules;
	},
	/**. '{object match(string str, array rules)}: Retorna os dados do casamento da expressão:
	|Nome|Tipo|Descrição|
	|type|string|Nome da formatação a ser usada (ver '{__CSS}|
	|length|integer|Comprimento da expressão casada.|
	|main|string|Expressão principal casada.|**/
	match: function(str, rules) {
		for (let i = 0; i < rules.length; i++) {
			let find = str.match(rules[i].re);
			if (find !== null) return {
				type:   rules[i].type,
				length: find[0].length + (rules[i].apart ? -1 : 0),
				main:   rules[i].apart ? find[1] : find[0],
			};
		}
		return null;
	},
	/**. '{string code(string str, array rules)}: Retorna a string renderizada no formato HTML conforme regras:
	- FIXME


	**/
	code: function(str, rules) {
		const code = String(str).normalize();
		const rule = this.rules(rules);
		const html = [];
		let i = 0;
		while (i < code.length) {
			let text = code.slice(i);
			let find = this.match(text, rule);
			if (find === null) {
				html.push(this.swap(text[0]));
				i++;
			}
			else {
				if (find.type === "comment")
					html.push(this.comment(find.main));
				else
					html.push(this.span(find.type, find.main, true));
				i += find.length;
			}
		}
		return `<pre class="css-wd-code-root">${html.join("")}</pre>`;
	},


	JS: [
		{type: "string", open: `"`},
		{type: "string", open: `'`},
		{type: "string", open: "`"},
		{type: "comment", open: "/*", close: "*/"},
		{type: "comment", open: "//", close: "\n"},
		{type: "value", list: "false null true undefined NaN Infinity"},
		{type: "keyword", list: "break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof new return super switch throw try typeof var void while with let static yied await async this"}
	],
};