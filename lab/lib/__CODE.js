"use strict";
/**
#3 Código Fonte
O objeto '{__CODE} renderiza um código para o formato HTML.
**/
const __XML = {
	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- CODE --*/
.css-wd-code-root      {color: black; background-color: snow; padding: 1em}
.css-wd-code-tag       {color: royalblue;}
.css-wd-code-value     {color: green;}
.css-wd-code-attribute {color: orange;}
.css-wd-code-doctype   {color: red;}
.css-wd-code-comment   {color: gray;}
.css-wd-code-style     {background-color: yellow;}
.css-wd-code-script    {background-color: yellow;}
`),
	/**. '{string swap(string str)}: Retorna a string transformada em formato HTML (caracteres especiais).**/
	swap: function(str) {
		return str
		.replace(/\&/g, "&amp;")
		.replace(/\</g, "&lt;")
		.replace(/\>/g, "&gt;");
	},
	/**. '{string attr(string str)}: Retorna a string em formato HTMl para os atributos HTML.**/
	attr: function(str) {
		const re = /(\=\s*)(\"[^"]*\"|\'[^']*\'|\`[^`]*\`|\S*)/g;
		return str.replace(re, `$1<span class="css-wd-code-value">$2</span>`);
	},
	/**. '{object tag(string str)}: Retorna os dados da string caso esteja no formato de uma tag.**/
	tag: function(str) {
		const re = /^(\<[?!/]?[a-zA-Z_][a-zA-Z0-9_:-]*\s*)((?:\s*[a-zA-Z_][a-zA-Z0-9_:-]*(?:\s*\=\s*(?:\"[^"]*\"|\'[^']*\'|\`[^`]*\`|\S*))?\s*)*)(\/?\>)/i;
		const find = str.match(re);
		if (find === null) return null;
		const name = find[1].replace("<", "").trim().toLowerCase();
		const main = name[0] === "?" || name[0] === "!" ? "doctype" : "tag";
		const code = name === "script" || name === "style";
		const open = find[3] !== "/>";
		const push = open && (name ===  "script" || name ===  "style") ? `<span class="css-wd-code-${name}">` : "";
		const kill = open && (name === "/script" || name === "/style") ? `</span>` : "";
		const html = find.slice(1).map(function(v,i,a) {
			const swap = this.swap(v);
			if (i === 0)
				return `${kill}<span class="css-wd-code-${main}">${swap}`;
			if (i === 1)
				return `<span class="css-wd-code-attribute">${this.attr(swap)}</span>`;
			if (i === 2)
				return `${swap}</span>${push}`;
		}, this);
		return {length: find[0].length, html: html.join("")};
	},

	comment: function(str) {

	},



	code: function(str) {
		const code = String(str).normalize();
		const html = [];
		let i = 0;
		while (i <= code.length) {
			let txt = code.slice(i);
			let tag = this.tag(txt);
			if (tag !== null) {
				html.push(tag.html);
				i += tag.length;
			}

			else {
				html.push(code[i]);
				i++;
			}
		}
		const data = html.join("").replace(/\n/g, "<br>");
		return `<pre class="css-wd-code-root">${data}</pre>`;
	},
};

































const __XXXML = {
	/**. '{node line(node tree)}: Adiciona e retorna uma linha da árvore.**/
	line: function(tree) {
		const line = __HTML("span", {className: "css-wd-code-line"});
		tree.appendChild(line);
		return line;
	},
	/**. '{node root(node tree)}: Retorna o último ancestral da árvore.**/
	root: function(tree) {
		let root = tree;
		while(root.parentElement !== null) root = root.parentElement;
		return root;
	},
	/**. '{void erase(node node)}: Apaga todos os nós de texto do nó.**/
	erase: function(node) {
		const nodes = Array.prototype.slice.call(node.childNodes);
		for (let i = 0; i < nodes.length; i++) {
			console.log(nodes[i], nodes[i].nodeType)
			if (nodes[i].nodeType === 3)
				nodes[i].remove();
			else if (nodes[i].nodeType === 1)
				this.erase(nodes[i]);
		}
		return;
	},
	/**. '{node deep(node tree)}: Retorna o nó mais profundo da árvore.**/
	deep: function(tree) {
		let deep = tree;
		while(deep.lastElementChild !== null) deep = deep.lastElementChild;
		return deep;
	},
	/**. '{node break(node tree)}: Adiciona uma nova linha ao root e retorna novo ponto de retorno.**/
	break: function(tree) {
		const root = this.root(tree);
		const last = root.lastElementChild;
		const node = last.lastElementChild;
		const type = node === null ? null : node.nodeType;
		/*-- adicionar nova linha ao root --*/
		root.appendChild(__HTML("br"));
		const line = this.line(root);
		/*-- último elemento da linha anterior é nó --*/
		if (type === 1) {
			const fake = node.cloneNode(true);
			this.erase(fake);
			return this.deep(fake);
		}
		return line
	},
	/**. '{string type(node tree)}: Retorna o tipo do fragmento.**/
	type: function(tree) {return tree.className.replace("css-wd-code-", "")},


	//FIXME provisório
	xml: [
		{name: "comment", call: "box", parent: null, open: "<!--", close: "-->"}

	],
	//TODO melhorar isso
	/**. '{string match(any test, string text)}: A string casada no texto conforme o valor de teste.**/
	match: function(test, text) {
		if (typeof test === "string")
			return test === text.slice(0, test.length) ? test : null;
		const find = text.match(test);
		return find === null ? null : find[0];
	},
	/**. '{object check(...node tree)}: Retorna os dados do casamento do texto ou nulo.**/
	check: function(tree, code, rule, index) {
		const type = this.type(tree);
		const text = code.slice(index);
		const data = rule.filter(function(v,i,a) {
			if (v.parent !== null && type !== v.parent) return false;
			return this.match(v.open, text) !== null;
		}, this);
		return data.length === 0 ? null : data[0];
	},
	/**. '{void main(node tree, string code, array rule, integer index)}: Executa a rotina de montagem do código.**/
	main: function(tree, code, rule, index) {
		/*-- checar o fim do código --*/
		if (index >= code.length) return;
		/*-- checar notação --*/
		const check = this.check(tree, code, rule, index);
		if (check !== null)
			return this[check.call](tree, code, rule, index, check);
		/*-- texto puro --*/
		const newline = code[index] === "\n";
		tree.innerText += newline ? "" : code[index];
		return this.main(newline ? this.break(tree) : tree, code, rule, ++index);
	},

	html: function(code, rule) {
		const list = String(code).normalize();
		const root = __HTML("div", {className: "css-wd-code-root"});
		//TODO
		rule = this.xml;
		//TODO
		this.main(this.line(root), list, rule, 0);
		console.log(root.outerHTML)
		return root;
	},
	box: function(tree, code, rule, index, check) {
		/*-- abertura da caixa --*/
		let find = this.match(check.open, code.slice(index));
		let elem = __HTML("b", {className: `css-wd-code-${check.name}`});
		let base;
		tree.appendChild(elem);
		elem.innerText = find;
		index += find.length;
		/*-- fechamento da caixa --*/
		while (index <= code.length) {
			base = code.slice(index);
			find = this.match(check.close, base);
			/*-- não casou --*/
			if (find === null) {
				if (code[index] === "\n")
					elem = this.break(elem);
				else
					elem.innerText += code[index];
				index++;
			}
			/*-- casou --*/
			else {
				index += find === "\n" ? 0 : find.length;
				if (find !== "\n") elem.innerText += find;
				return this.main(elem.parentElement, code, rule, index);
			}
		}
		return;
	},







};






























/*----------------------------------------------------------------------------*/
	/**#3 Código
	''constructor object __Code(string input)''
	Construtor para manipulação de textos com formatação de códigos. O argumento '{input} define o código fonte.**/
	function __Code(input) {
		if (!(this instanceof __Code)) return new __Code(input);
		this.input = input;
		Object.defineProperties(this, {
			_input:   {writable: true,  value: ""},
			_frames:  {writable: false, value: {linear: null, xml: null, html: null}},
			_string:  {writable: true,  value: []},
			_comment: {writable: true,  value: []},
			_word:    {writable: true,  value: []},
			_value:   {writable: true,  value: []},
			_flags:   {writable: false, value: "/^(TODO|FIXME|OPTIMIZE|HACK|REVIEW)\ /"}
		});
		return;
	}

	Object.defineProperties(__Code.prototype, {
		constructor: {value: __Code},
		/**. '{array _ends}: Caracteres de controle fixo de encerramento.**/
		_ends: {
			value: {
				word:  "/^([()\\[\\]{},;]|\\s)/",
				value: "/^([()\\[\\]{},;!=|&+\\-%/*^?:]|\\s|\\>|\\>)/"
			}
		},
		/**. '{string _translate(string input)}: Altera codificação HTML adaptada para padrão.**/
		_translate: {
			value: function(input) {
				const tags = [
					"line", "doc", "tag", "attr", "script", "flag", "trash",
					"number", "value", "word", "comment", "string", "scope"
				];
				for (let i = 0; i < tags.length; i++) {
					let tag   = tags[i];
					let find1 = new RegExp(`\\<wd\\-${tag}\\>`, "g");
					let find2 = new RegExp(`\\<\\/wd\\-${tag}\\>`, "g");
					let swap1 = `<span data-wd-encoding="${tag}">`;
					let swap2 = `</span>`;
					input = input.replace(find1, swap1);
					input = input.replace(find2, swap2);
				}
				return input;
			}
		},
		/**. '{object frames}: Retorna os caracteres de controle.**/
		frames: {
			get: function() {
				const type  = this.type;
				if (this._frames[type] !== null) return this._frames[type];
				const isre   = /^\/.+\/([a-z]+)?$/i
				const data   = [];
				const frames = type === "xml" || type === "html" ? {
					tag: [
						{open: "/^\\<\\/?[a-z]([a-z0-9_\\-]+)?/i", close: "/^\\/?\\>/", double: false}
					],
					doc: [
						{open: "/^\\<![a-z]([a-z0-9_\\-]+)?/i", close: "/^\\/?\\>/", double: false}
					],
					string: [
						{open: "\"", close: "\"", double: false},
						{open: "\'", close: "\'", double: false}
					],
					comment: [
						{open: "<!--", close: "-->", double: false},
					]
				} : {
					scope: [
						{open: "[", close: "", double: false}, {open: "]", close: "", double: false},
						{open: "(", close: "", double: false}, {open: ")", close: "", double: false},
						{open: "{", close: "", double: false}, {open: "}", close: "", double: false}
					],
					number: [
						{open: "/^[+\\-]?\\d+\\.\\d+e[+\\-]?\\d+/i", close: this._ends.value, double: true},
						{open: "/^[+\\-]?\\.?\\d+e[+\\-]?\\d+/i",    close: this._ends.value, double: true},
						{open: "/^[+\\-]?\\d+\\.\\d+/",              close: this._ends.value, double: true},
						{open: "/^[+\\-]?\\.?\\d+/",                 close: this._ends.value, double: true}
					],
					string:  this._string,
					comment: this._comment,
					word:    this._word,
					value:   this._value
				};
				/*-- adicionando em lista --*/
				for (let name in frames) {
					for (let i = 0; i < frames[name].length; i++) {
						let item = frames[name][i];
						data.push({
							type:   name,
							open:   item.open,
							close:  item.close,
							double: item.double,
							regexp: isre.test(item.open)
						});
					}
				}
				/*-- ordenando a lista --*/
				this._frames[type] = data.sort(function(x,y) {
					const A = x.open.length;
					const B = y.open.length;
					const a = x.regexp;
					const b = y.regexp;
					if (a !== b)
						return a ? 1 : -1;
					else
						return A > B ? -1 : (A === B ? 0 : 1);
				});
				return this._frames[type];
			}
		},
		/**. '{string input}: Define ou retorna o código fonte.**/
		input: {
			get: function()  {return this._input;},
			set: function(x) {this._input = String(x);}
		},
		/**. '{string type}: Retorna o tipo de código: xml, html ou linear.**/
		type: {
			get: function() {
				const input = this.input.trim();
				const start = /^\<[a-z0-9.\-_:?!]+([^\>]+)?\>/i;
				const close = /\<\/?[a-z0-9.\-_:?!]+([^\>]+)?\/?\>$/i;
				if (start.test(input) && close.test(input))
					return (/\<\/html(\s[^>]+)?\>$/).test(input) ? "html" : "xml";
				return "linear";
			}
		},
		/**. '{void add(string type, string value)}: Adiciona caracteres de controle da linguagem. O argumento i{type} pode ser "string", "comment", "word" ou "value". O argumento i{value} é uma lista de caracteres de controle separados por um espaço em branco. No caso de "string" e "comment", os caracteres de fechamento devem vir logo depois de seu caracteres de abertura (tanto a dupla quanto os conjunto são separados por um espaço).**/
		add: {
			value: function(type, value) {
				type  = String(type).toLowerCase();
				value = String(value).replace(/\ +/g, " ");
				const data = value.split(" ");
				const next = {comment: 2, string: 2, word: 1, value: 1};
				if (type in next) {
					for (let i = 0; i < data.length; i = i + next[type]) {
						if (type === "comment")
							this._comment.push({open: data[i], close: data[i+1], double: false});
						else if (type === "string")
							this._string.push({open: data[i], close: data[i+1], double: false});
						else if (type === "word")
							this._word.push({open: data[i], close: this._ends.word, double: true});
						else if (type === "value")
							this._value.push({open: data[i], close: this._ends.value, double: true});
					}
				}
				this._frames.linear = null;
				return;
			}
		},
		/**. '{void clear()}: Apaga o conjunto de caracteres de controles definidos.**/
		clear: {
			value: function() {
				const name = {_comment: [], _string: [], _word: [], _value: []};
				for (let i in name) this[i] = name[i];
				this._frames.linear = null;
				return;
			}
		},
		/**. '{void JS()}: Define caracteres básicos de controle JavaScript.**/
		JS: {
			value: function() {
				this.clear();
				this.add("word", "break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof new return super switch throw try typeof var void while with let static yied await async");
				this.add("value", "false null this true undefined NaN Infinity /^\\/[^*](.+)?\\/([a-z]+)?/");
				this.add("comment", "// \n /* */");
				this.add("string", "\" \" ' ' ` `");
				return;
			}
		},
		/**. '{void CSS()}: Define caracteres básicos de controle CSS.**/
		CSS: {
			value: function() {
				this.clear();
				this.add("word", "[a-zA-Z0-9\\-]+\\:");
				this.add("value", "none initial \\#[0-9a-fA-F]+ [a-zA-Z]+\\([^)]+\\)");
				this.add("comment", "/* */");
				this.add("string", "\" \" ' '");
				return;
			}
		},
		/**. '{object find(integer index, string search))}: Verifica se o código a partir de i{index} casa com '{search}. É retornado um objeto contendo as propriedades i{match} (texto casado) e i{length} (comprimento do texto casado). Se nada for encontrado, retonará nulo. Se i{search} iniciar e terminar com barra, será considerado uma expressão regular, aceitando ignore case.**/
		find: {
			value: function(index, search) {
				const re   = /^\/(.+)\/i?$/;
				const isre = re.test(search);
				const isic = isre && (/i$/).test(search) ? "i" : "";
				const find = isre ? new RegExp(search.replace(re, "$1"), isic) : search;
				const text = this.input.slice(index, isre ? Infinity : index+search.length);
				const data = {
					match: null,
					get length() {return this.match.length;},
					get next()   {return index + this.length;}
				};
				if (isre && find.test(text))
					data.match = text.match(find)[0];
				else if (!isre && find === text)
					data.match = find;
				return data.match === null ? null : data;
			}
		},
		/**. '{object pack(integer index, array list))}: Retorna um objeto contendo as informações de i{frames} e i{find} se a informação casar com os tipos de caracteres de controle listados em i{list}. Caso contrário, retorna nulo.**/
		pack: {
			value: function(index, list) {
				const frames = this.frames;
				for (let i = 0; i < frames.length; i++) {
					let frame = frames[i];
					let type  = list.indexOf(frame.type) >= 0;
					let find  = type ? this.find(index, frame.open) : null;
					if (find !== null) {
						//console.log({find: find.match, frame: frame, next: this.input.slice(index+find.length)})
						let ok = !frame.double ? true : this.find(index+find.length, frame.close) !== null;
						if (ok) return {
							match: find.match,
							length: find.length,
							next: find.next,
							type: frame.type,
							open: frame.open,
							close: frame.close,
							double: frame.double
						};
					}
				}
				return null;
			}
		},
		/**. '{string linear}: Retorna o código genérico renderizado.**/
		linear: {
			get: function() {
				const tree = __Tree();
				const code = this.input.split("");
				const list = ["string", "comment", "number", "value", "word", "scope"];
				let tag, val, close, pack, find, esc, flag;

				tree.pattern("wd-?");
				tree.open("line");

				for (let index = 0; index < code.length; index++) {
					tag = tree.level;
					val = code[index];

					if (tag === "line") {
						pack = this.pack(index, list);
						if (val === "\n") {
							tree.walkTo(0).add(val).backTo();
						}
						else if (pack === null) {
							tree.add(val);
						}
						else if (pack.type === "string" || pack.type === "comment") {
							close = pack.close;
							tree.open(pack.type).add(pack.match);
							index = pack.next - 1;
						}
						else if (pack.type === "value" || pack.type === "word" || pack.type === "number" || pack.type === "scope") {
							tree.open(pack.type).add(pack.match).close();
							index = pack.next - 1;
						}
					}
					else if (tag === "string") {
						find = this.find(index, close);
						esc  = tag === "string" && code[index-1] === "\\";
						if (find !== null && find.match === "\n") {
							tree.close().walkTo(0).add(val).backTo();
						}
						else if (find !== null && !esc) {
							tree.add(find.match).close();
							index = find.next - 1;
						}
						else {
							tree.add(val);
						}
					}
					else if (tag === "comment") {
						find = this.find(index, close);
						flag = this.find(index, this._flags);
						if (close === "\n" && val === "\n") {
							tree.close().walkTo(0).add(val).backTo();
						}
						else if (flag !== null) {
							tree.open("flag").add(flag.match).close();
							index = flag.next - 1;
						}
						else if (find !== null) {
							tree.add(find.match).close();
							index = find.next - 1;
						}
						else {
							tree.add(val);
						}
					}
					else {
						tree.open("trash").add(val).close();
					}
				}
				tree.finish();
				return this._translate(tree.valueOf());
			}
		},
		/**. '{string markup}: Retorna o código codificado em XML/HTML renderizado.**/
		markup: {
			get: function() {
				const tree   = __Tree();
				const code   = this.input.split("");
				const script = ["<script", "<style", "<textarea"];
				let tag, val, close, pack, find, end, html, flag;

				tree.pattern("wd-?");
				tree.open("line");

				for (let index = 0; index < code.length; index++) {
					tag = tree.level;
					val = code[index];

					if (val === "\n") {
						tree.walkTo(0).add(val).backTo();
					}
					else if (tag === "line") {
						pack = this.pack(index, ["comment", "tag", "doc"]);
						if (pack === null) {
							tree.add(val);
						}
						else if (pack.type === "comment") {
							close = pack.close;
							tree.open(pack.type).add(pack.match);
							index = pack.next - 1;
						} else if (pack.type === "tag" || pack.type === "doc") {
							close = pack.close;
							tree.open(pack.type).add(pack.match).open("attr");
							index = pack.next - 1;
							html  = pack.match;
						}
					}
					else if (tag === "comment") {
						find = this.find(index, close);
						flag = this.find(index, this._flags);
						if (flag !== null) {
							tree.open("flag").add(flag.match).close();
							index = flag.next - 1;
						}
						else if (find !== null) {
							tree.add(find.match).close();
							index = find.next - 1;
						}
						else {
							tree.add(val);
						}
					}
					else if (tag === "string") {
						find = this.find(index, end);
						if (find !== null && code[index-1] !== "\\") {
							tree.add(find.match).close();
							index = find.next - 1;
						}
						else {
							tree.add(val);
						}
					}
					else if (tag === "attr") {
						pack = this.pack(index, ["string"]);
						find = this.find(index, close);

						if (find !== null) {
							tree.close().add(find.match).close();
							index = find.next - 1;
							if (this.type === "html" && script.indexOf(html) >= 0 && find.match === ">") {
								html = html.replace("<", "</");
								tree.open("script");
							}
						}
						else if (pack !== null && pack.type === "string") {
							end = pack.close;
							tree.open(pack.type).add(pack.match);
							index = pack.next - 1;
						}
						else {
							tree.add(val);
						}
					}
					else if (tag === "script") {
						find = this.find(index, html);
						if (find !== null) {
							tree.close().open("tag").add(find.match).open("attr");
							index = find.next - 1;
						}
						else {
							tree.add(val);
						}
					}
				}
				tree.finish();
				return this._translate(tree.valueOf());
			}
		},
		/**. '{node valueOf()}: Retorna a codificação estruturada em HTML.**/
		valueOf: {
			value: function() {	return this.type === "linear" ? this.linear : this.markup;}
		},
		/**. '{string toString()}: Retorna a codificação.**/
		toString: {
			value: function() {return this.input;}
		},
	});
