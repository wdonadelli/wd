"use strict";
/**
#3 Código Fonte
O objeto '{__CODE} renderiza um código para o formato HTML.
**/
const __CODE = {
	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- CODE --*/
.css-wd-code-root  {padding: 1em; font-family: Fira Mono, DejaVu Sans Mono, Menlo, Consolas, Liberation Mono, Monaco, Lucida Console, monospace;}
/*-- cores --*/
.css-wd-code-root    {color: black; background-color: snow;}
.css-wd-code-doctype {color: red; font-weight: bold;}
.css-wd-code-comment {color: silver;}
.css-wd-code-keyword {color: orange;}
.css-wd-code-value   {color: green;}
.css-wd-code-string  {color: green;}
.css-wd-code-tag     {color: royalblue;}
.css-wd-code-flag    {font-weight: bold;}


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
				html.push(this.swap(code[i]));
				i++;
			}
		}
		return `<pre class="css-wd-code-root">${html.join("")}</pre>`;
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
		const flag = caSe === true ? "i" : ""
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
		const flag = caSe === true ? "i" : "";
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
				last      = last === null ? init : last;
				/*-- tipo de captura e expressão regular --*/
				let left  = "init" in v;
				let right = "last" in v ? true : ("close" in v ? false : left);
				rule.type = left && right ? "all" : (!left && !right ? "center" : (left ? "left" : "right"));
				rule.re   = this.reTrim(init, last, v.case);
			}
			return rule.re === null ? null : rule;
		}, this).filter(function(v,i,a) {return v !== null;});


		/*-- número decimal FIXME delimitador?--* /
		rules.push({type: "value", re: /^([+-]?(?:\.?\d+|\d+\.\d+)(?:[eE][+-]?\d+)?)(?:\W)/, apart: true});
		/*-- número hexadecimal FIXME delimitador?--* /
		rules.push({type: "value", re: /^([+-]?0x[0-9a-fA-F]+)(?:[^0-9a-fA-F])/, apart: true});
		/*-- número binário FIXME delimitador? --* /
		rules.push({type: "value", re: /^([+-]?0[bB][01]+)(?:[^01])/, apart: true});*/

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
	- A propriedade '{look} é uma string que define o estilo do destaque;
	- O valor de '{look} pode ser "value", "string", "comment" e "doctype", cada um com destaque personalizado;
	- Os valores "string" e "comment" possuem bandeiras especiais;
	- O valor da propriedade '{look} também pode ser uma cor no formato hexadecimal '{#000000}; e
	- O método não tem por objetivo corrigir erros no código fonte, apenas define uma forma de destaque genérico.**/
	code: function(str, rules) {
		const code = String(str).normalize();
		const rule = this.rules(rules);
		const pass = /^(?:\w+|\s+)/;
		const html = [];
		let i = 0;
		console.log(rule);//TODO apagar essa linha
		while (i < code.length) {
			let text = code.slice(i);
			let find = this.match(text, rule);
			/*-- fragmento não casado --*/
			if (find === null) {
				//FIXME fazer situações para ignorar e avançar (\w|\s)+
				const ahead = text.match(pass);
				//console.log(ahead);
				html.push(this.swap(ahead === null ? text[0] : ahead[0]));
				i += ahead === null ? 1 : ahead[0].length;

				//FIXME original
				//html.push(this.swap(text[0]));
				//i++;
			}
			/*-- fragmento casado --*/
			else {
				const data = find.data.map(function(v,i,a) {return this.swap(v);}, this);



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

				//console.log(find.data, find.type, data, html[html.length -1]); //FIXME

				/*-- avançar --*/
				i += find.length;
			}
		}
		return `<pre class="css-wd-code-root">${html.join("")}</pre>`;
	},


	JS: [
		//FIXME


		{look: "doctype", init: `"use strict"`, close: ";"},
		{look: "string",  init: `"`},
		{look: "string",  init: `'`},
		{look: "string",  init: "`"},
		{look: "comment", init: "/*", last: "*/"},
		{look: "comment", init: "//", close: "\n"},
		{look: "value",   init: /\/[^/]/, last: "/"},
		{look: "value",   list: "false null true undefined NaN Infinity"},
		{look: "keyword", list: "break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof new return super switch throw try typeof var void while with let static yied await async this"},

	],
};
