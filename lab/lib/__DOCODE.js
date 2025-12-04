/**
#3 Segregando Código
O objeto '{__DOCODE} segrega as linhas de comentário do código fonte podendo ser traduzido o conteúdo para notação HTML caso seja escrito com determinadas regras de notação.
**/
const __DOCODE = {

	/**. '{object split(string code, string open, string stop)}: Separa o código conforme caracteres de abertura e fechamento de comentário ('{open/stop}) retornando um objeto contendo informação da fonte ('{src}) e dos comentários ('{doc}).
	. Os caracteres de abertura e fechamento de comentários não podem estar contidos em strings!**/
	split: function(code, open, stop) {
		const data = {
			open: open === undefined ? "//" : String(open).normalize(),
			stop: stop === undefined ? "\n" : String(stop).normalize(),
			list: String(code).normalize().split(""),
			src:  [],
			doc:  [],
			type: "src",
			temp: [],
			i: 0,
			match: function() {
				const find = this.type === "src" ? this.open : this.stop;
				const text = this.list.slice(this.i, this.i + find.length).join("");
				return find === text ? find.length : 0;
			},
			next: function() {
				if (this.i >= this.list.length) {
					this[this.type].push(this.temp.join(""));
					return false;
				}
				const match = this.match();
				if (match === 0) {
					this.temp.push(this.list[this.i]);
					this.i++;
				}
				else {
					this[this.type].push(this.temp.join(""));
					this.temp = [this.type === "doc" && (/\n/).test(this.stop) ? "\n" : ""];
					this.type = this.type === "src" ? "doc" : "src";
					this.i += match;
				}
				return true;
			}
		};
		while (data.next());
		return {
			src: data.src.join("").replace(/\n+/g, "\n"),
			doc: data.doc.join("").replace(/\n+/g, "\n"),
		};
	},
//__Request({url: "lib/__DOCODE.js", call: (x) => {if (x.ok) {console.log(__DOCODE.split(x.response, "/**", "**/").doc)}}}).send()

	/**. '{object marks}: Registra as notações da codificação:**/
	marks: {
		ul:    /^\-\s+(.+)$/,     ol: /^\+\s+(.+)$/,   dl: /^\.\s+(.+)$/,
		h1:    /^\#1\s+(.+)$/,    h2: /^\#2\s+(.+)$/,  h3: /^\#3\s+(.+)$/,
		h4:    /^\#4\s+(.+)$/,    h5: /^\#5\s+(.+)$/,  h6: /^\#6\s+(.+)$/,
		table: /^\|(.+)\|$/,   quote: /^\`()$/,       pre: /^\:()$/,
	},
	/**. '{object info(string line)}: Retorna valor ('{value}) e tipo ('{type}) da notação da linha ('{line}) conforme '{marks}**/
	info: function(line) {
		line = line.trim();
		let info = null;
		for (let name in this.marks) {
			if (info === null && this.marks[name].test(line))
				info = {type: name, value: line.match(this.marks[name])[1]};
		}
		return info === null ? {type: "p", value: line} : info;
	},
/*
`
Esse é um texto longo
Tá ligado?
`
:
Esse é um texto longo
Tá ligado?
:
//FIXME '{code} &{unicode} a{link}[]
*/

	html: function(code) {
		const line = String(code).normalize().split("\n");
		const main = [];
		let   type = null;
		/*-- obter dados de cada linha --*/
		line.map(function(v,i,a) {
			const info = this.info(v);
			/*-- bloco de texto aberto --*/
			if (type === "pre" || type === "quote") {
				type = info.type === type ? null : type;
				return type === null ? null : {type: type, value: type === "pre" ? v : v.trim()};
			}
			/*-- abrir bloco de texto --*/
			if (info.type === "pre" || info.type === "quote") {
				type = info.type;
				return null;
			}
			return info.value === "" ? null : info;
		}, this)
		/*-- agrupar ordenadamente por tipo em main --*/
		.forEach(function(v,i,a) {
			if (v !== null) {
				const last = main.length === 0 ? {} : main[main.length - 1];
				if (v.type !== last.type)
					main.push({type: v.type, value: [v.value]});
				else
					main[main.length - 1].value.push(v.value);
			}
			return;
		});
		/*-- registrar os elementos filhos --*/
		return {tag: "section", attr: {}, child: main.map(function(v,i,a) {
			return this[v.type](v.value);
		}, this)};
	},
	/**. '{string inline(string inner)}: Retorna o valor de '{innerHTML} para formatar os elementos filhos profundos**/
	inline: function(inner) {
		const long  = /([a-z]+)\{([^\}]+)\}\[([^\]]+)\]/g;
		const short = /([a-z]+)\{([^\}]+)\}/g;
		const code  = /\'\{([^\}]+)\}/g;
		const ding  = /\&amp\;\{([^\}]+)\}/g;
		inner = inner.replace(/\&/g, "&amp;").replace(/\>/g, "&gt;").replace(/\</g, "&lt;")
		if (long.test(inner))
			inner = inner.replace(long, `<$1 $3>$2</$1>`);
		if (short.test(inner))
			inner = inner.replace(short, `<$1>$2</$1>`);
		if (code.test(inner))
			inner = inner.replace(code, `<code translate="no">$1</code>`);
		if (ding.test(inner))
			inner = inner.replace(ding, `&$1;`);
		return inner;
	},
	/**. '{object ul(array list)}: Retorna a estrutura do elemento '{ul}.**/
	ul: function(list) {
		return {tag: "ul", attr: {}, child: list.map(function(v,i,a) {
			return {tag: "li", attr: {innerHTML: this.inline(v)}, child: []};
		}, this)}
	},
	/**. '{object ol(array list)}: Retorna a estrutura do elemento '{ol}.**/
	ol: function(list) {
		return {tag: "ol", attr: {}, child: list.map(function(v,i,a) {
			return {tag: "li", attr: {innerHTML: this.inline(v)}, child: []};
		}, this)}
	},
	/**. '{object pre(array list)}: Retorna a estrutura do elemento '{pre}.**/
	pre: function(list) {
		return {tag: "pre", attr: {innerText: list.join("\n"), setAttribute: ["translate", "no"]}, child: []};
	},
	/**. '{object quote(array list)}: Retorna a estrutura do elemento '{blockquote}.**/
	quote: function(list) {
		return {tag: "blockquote", attr: {}, child: list.map(function(v,i,a) {
			return {tag: "p", attr: {innerHTML: this.inline(v.trim())}, child: []};
		}, this)}
	},

	//FIXME o que fazer com p? [p1,p2,p3] o que retornar? um div? o mesmo ocorre com h
	/**. '{object p(array list)}: Retorna a estrutura do elemento '{p}.**/
	p: function(list, head) {
		return {tag: "p", attr: {innerHTML: this.inline(v)}, child: []};
	},
	/**. '{object h1(array list, integer n)}: Retorna a estrutura do elemento '{h1}.**/
	h1: function(list, n) {
		return {tag: `h${n === undefined ? 1 : n}`, attr: {innerHTML: this.inline(list.join("").trim()}, child: []};
	},
	/**. '{object h2(array list)}: Retorna a estrutura do elemento '{h2}.**/
	h2: function(list) {return this.h1(list, 2);},
	/**. '{object h3(array list)}: Retorna a estrutura do elemento '{h3}.**/
	h3: function(list) {return this.h1(list, 3);},
	/**. '{object h4(array list)}: Retorna a estrutura do elemento '{h4}.**/
	h4: function(list) {return this.h1(list, 4);},
	/**. '{object h5(array list)}: Retorna a estrutura do elemento '{h5}.**/
	h5: function(list) {return this.h1(list, 5);},
	/**. '{object h6(array list)}: Retorna a estrutura do elemento '{h6}.**/
	h6: function(list) {return this.h1(list, 6);},








	/**. '{string wdDoc}: Transforma os dados segregados do método '{wdComment} em notação HTML (tag main) adotando as seguintes regras de notação:
	|Element|Tipo|Ocorrência|Descrição|
	|Citação|Bloco|Parágrafo|Inicia e termina com duas aspas duplas.|
	|Código|Bloco|Parágrafo|Inicia e termina com duas aspas simples.|
	|Tabela|Bloco|Linha|Inicia, termina e separa células com barra vertical, a primeira linha é o cabeçalho.|
	|Lista|Bloco|Linha|Inicia com "- " seguido do conteúdo.|
	|Descrição|Bloco|Linha|Inicia com ". " seguido do conteúdo.|
	|Títulos|Bloco|Linha|Inicia com "#0-6 " seguido do conteúdo.|
	|Mídia|Bloco|Linha|Inicia com "@MIMETYPE " seguido do link entre os caracteres "< >" e o texto em caso de falha.|
	|Parágrafo|Bloco|Linha|Quando não seguir as regras anteriores.|
	|Formatação|Em linha|Conteúdo|Nome da tag HTML seguindo do conteúdo limitado pelos caracteres "{ }".|
	- Se a descrição conter um caractere ":" intermediário, a parte anterior será título (dt) e a posterior a descrição (dd);
	- O número do título indica seu tipo, o valor zero cria um menu referenciando os títulos do tipo 3 a 5;
	- O valor MIMETYPE deve ser alterado conforme o tipo de arquivo a ser carregado;
	- A tag HTML i{code} pode ser abreviada por um caracteres de aspas simples;
	- Atributos de elementos em linha são informados após o caracter "}" delimitado por colchetes "[attr]" (opcional); e
	- Não é possível efetuar formatações dentro do conteúdo dos elementos em linha.**/
	wdDoc: {
		get: function() {
			if ("wdDoc" in this._saved)
				return new __Parser(this._saved.wdDoc);
			let data = null;
			try {
				if (this._check.string) {
					const menu = new __Tree();
					const note = this._data.trim().normalize();
					const code = note.split("\n");
					const tree = new __Tree();
					const type = {
						/*-- blocos múltiplas linhas --*/
						quote: /^(\"\")(.+)/,
						pre:   /^(\'\')(.+)/,
						/*-- blocos de consistência --*/
						table: /^\|(.+)\|$/,
						ul:    /^(\-)\s+(.+)$/,
						dl:    /^(\.)\s+(.+)$/,
						/*-- blocos de linha única --*/
						head:  /^\#([0-6])\s+(.+)$/,
						media: /^\@([a-z/]+)\s+\<([^>]+)\>(.*)$/i,
					};
					/*-- função para elementos inline --*/
					function inline(tree, input) {
						const code = input.split("");
						const find = /^([a-z\-0-9]+|\')\{([^}]+)\}(\[[^\]]+\])?/i;
						let txt, val, tag, index = 0;
						while (index < code.length) {
							tag = tree.level;
							txt = code.slice(index).join("");
							val = code[index];
							if (find.test(txt)) {
								let base = txt.match(find)[0];
								let elem = base.replace(find, "$1");
								let text = base.replace(find, "$2");
								let attr = base.replace(find, "$3").replace(/^\[/, "").replace(/\]$/, "");
								if (elem === "'") elem = "code";
								tree.open(`${elem} ${attr}`).add(text).close();
								index += base.length;
							} else {
								tree.add(val);
								index++
							}
						}
						return;
					};
					/*----------------------------------------------------------------*/
					let tag, txt, key, index = 0, title = -1;
					tree.xml = true;
					while (index < code.length) {
						tag = tree.level;
						txt = code[index].trim();
						key = null;
						for (let i in type)
							if (key === null && type[i].test(txt)) key = i;
						/*--------------------------------------------------------------*/
						if (tag === null) {
							switch(key) {
								/*-- blocos de consistência --*/
								case "table": {tree.open("table");      break;}
								case "ul":    {tree.open("ul");         break;}
								case "dl":    {tree.open("dl");         break;}
								/*-- blocos múltiplas linhas --*/
								case "pre":   {code[index] = txt.slice(2); tree.open("pre");        break;}
								case "quote": {code[index] = txt.slice(2); tree.open("blockquote"); break;}
								/*-- blocos de linha única --*/
								case "head":  {
									let head = Number(txt.replace(type.head, "$1"));
									let text = txt.replace(type.head, "$2").trim();
									let href = `head_${++title}`;
									if (head === 0)
										tree.open(`h3`).add(text).close().
										open("menu").add("%MENUITEM%").close();
									else
										tree.open(`h${head} id="${href}"`).add(text).close();
									if (head > 2 && head < 6)
										menu.open("li").add((". . . . ").repeat(head - 3))
										.open(`a href="#${href}"`).add(text).close().close();
									index++;
									break;
								}
								case "media":  {
									/^\@(image|audio|video)\s+\<([^>]+)\>(.*)$/
									let mime = txt.replace(type.media, "$1");
									let data = txt.replace(type.media, "$2");
									let text = txt.replace(type.media, "$3");
									tree.open(`object type="${mime}" data="${data}"`).add(text).close();
									index++;
									break;
								}
								default: {
									if (txt !== "")
										tree.open("p").add(inline(tree, txt)).close();
									index++;
								}
							}
						}
						/*--------------------------------------------------------------*/
						else if (tag === "table") {
							let th = txt.replace(type.table, "$1").split("|");
							tree.open("thead").open("tr");
							for (let i = 0; i < th.length; i++)
								tree.open("th").add(inline(tree, th[i])).close();
							tree.close().close().open("tbody");
							index++;
						}
						/*--------------------------------------------------------------*/
						else if (tag === "tbody") {
							if (key !== "table") {
								tree.close().close();
							}
							else {
								let td = txt.replace(type.table, "$1").split("|");
								tree.open("tr");
								for (let i = 0; i < td.length; i++)
									tree.open("td").add(inline(tree, td[i])).close();
								tree.close();
								index++;
							}
						}
						/*--------------------------------------------------------------*/
						else if (tag === "dl") {
							if (key !== "dl") {
								tree.close();
							}
							else {
								let re = /^([^:]+)\:(.+)$/;
								let dl = txt.replace(type.dl, "$2").trim();
								let dt = re.test(dl) ? dl.replace(re, "$1").trim() : null;
								let dd = re.test(dl) ? dl.replace(re, "$2").trim() : dl;
								if (dt !== null)
									tree.open("dt").add(inline(tree, dt)).close();
								tree.open("dd").add(inline(tree, dd)).close();
								index++;
							}
						}
						/*--------------------------------------------------------------*/
						else if (tag === "ul") {
							if (key !== "ul") {
								tree.close();
							} else {
								let li = txt.replace(type.ul, "$2");
								tree.open("li").add(inline(tree, li)).close();
								index++;
							}
						}
						/*--------------------------------------------------------------*/
						else if (tag === "pre") {
							let re  = /(\'\')$/;
							let end = re.test(txt);
							let pre = end ? txt.replace(re, "") : txt;
							tree.add(pre).add(end ? "" : "\n");
							if (end) tree.close();
							index++;
						}
						/*--------------------------------------------------------------*/
						else if (tag === "blockquote") {
							let re    = /(\"\")$/;
							let end   = re.test(txt);
							let quote = end ? txt.replace(re, "") : txt;
							tree.open("p").add(inline(tree, quote)).close();
							if (end) tree.close();
							index++;
						}
						else throw new Error("tag not found.")
					}
					tree.finish();
					menu.finish();
					data = tree.valueOf().replace("<menu>%MENUITEM%</menu>", `<menu>${menu.valueOf()}</menu>`);
				}
			}
			catch(e) {
				console.info(e)
			}
			this._saved["wdDoc"] = data;
			return this.wdDoc;
		}
	}
};