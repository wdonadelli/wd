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
					return null;
				}
				const match = this.match();
				/*console.log({
					temp: this.temp.join(""),
					match: match,
					list: this.list.slice(this.i).join("")
				});*/
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
			}
		};
		while (data.next() !== null);
		return {
			src: data.src.join("").replace(/\n+/g, "\n"),
			doc: data.doc.join("").replace(/\n+/g, "\n"),
		};
	},
//__Request({url: "lib/__DOCODE.js", call: (x) => {if (x.ok) {console.log(__DOCODE.split(x.response, "/**", "**/").doc)}}}).send()





/**. '{object wdComment(string open, string close)}: .**/
	wdComment: {
		value: function(open, close) {
			if (!this._check.string) return null;

			const data = this._data.trim().normalize();
			const list = data.split("");
			let txt, end, index = 0, type = "src";
			/*-- separar código e comentários ------------------------------------*/
			while (index < list.length) {
				end = index + (type === "src" ? open.length : close.length);
				txt = data.slice(index, end);
				if (type === "src" && txt === open) {
					src.push("\n");
					type  = "doc";
					index = end;
				}
				else if (type === "doc" && txt === close) {
					doc.push("\n");
					type = "src";
					index = end;
				}
				else {
					type === "doc" ? doc.push(data[index]) : src.push(data[index]);
					index++;
				}
			}
			return {
				src:  src.join("").replace(/\n+/g, "\n"),
				doc:  doc.join(""),
				get html() {return new __Parser(this.doc).wdDoc.get();}
			};
		}
	},
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