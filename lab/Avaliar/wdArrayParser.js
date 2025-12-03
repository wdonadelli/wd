//FIXME acabar com isso
	/**. '{object arrayWD}: Transforma array de objetos em notação wd.**/
	arrayWD: {
		get: function() {
			if ("arrayWD" in this._saved)
				return new __Parser(this._saved.arrayWD);
			let data = null;
			try {
				if (this._check.array) {
					function parse(value, save, root) {
						const check = new __Type(value);
						/*--------------------------------------------------------------*/
						if (check.chars) {
							let item = value.replace(/\'/g, "''");
							save.push(`'${item}'`);
						}
						/*--------------------------------------------------------------*/
						else if (check.regexp) {
							save.push(value.toString());
						}
						/*--------------------------------------------------------------*/
						else if (check.function) {
							save.push(`(${value.name})`);
						}
						/*--------------------------------------------------------------*/
						else if (check.array) {
							save.push(root === true ? "" : "[");
							for (let i = 0; i < value.length; i++) {
								let test = root === true ? new __Type(value[i]) : {object: false};
								if (root === true && !test.object)
									throw new Error("Item is not an object.");
								save.push(i > 0 ? "," : "");
								save = parse(value[i], save, false);
							}
							save.push(root === true ? "" : "]");
						}
						/*--------------------------------------------------------------*/
						else if (check.object) {
							const re = /^([a-z0-9_\-]+|\$\$?)$/i;
							let    n = 0;
							save.push("{");
							for (let i in value) {
								let name = i.trim();
								if (!re.test(name)) throw new Error("Invalid property name.");
								save.push((n++ === 0 ? "" : ";")+name+":");
								if (name === "$" || name === "$$") {
									let test = new __Type(value[i]);
									let node = test.node ? test.value : null;
									if (node === null) throw new Error("Invalid property value.");
									save.push("'");
									for (let j = 0; j < node.length; j++) {
										let id  = "#"+node[j].id.trim();
										let tag = node[j].tagName.toLowerCase();
										let css = node[j].className.trim().replace(/\s+/g, ".");
										save.push(j > 0 ? "," : "");
										save.push(id !== "#" ? id : (tag + (css === "" ? "" : ".") + css));
									}
									save.push("'");
								}
								else {
									save = parse(value[i], save, false);
								}
							}
							save.push("}");
						}
						/*--------------------------------------------------------------*/
						else {
							save.push(String(value));
						}
						/*--------------------------------------------------------------*/
						return save;
					};
					/*----------------------------------------------------------------*/
					const note = parse(this._data, [], true);
					data = note.join("");
				}
			} catch(e) {console.log(e.message);}
			this._saved["arrayWD"] = data;
			return this.arrayWD;
		}
	},
	/**. '{object wdArray}: Transforma notação wd em um array de objetos semelhante a notação JSON exceto pelo seguinte:
	- o nome das propriedades do objeto não contem aspas e são compostos de caracteres alfanuméricos, traços e sublinhados;
	- por padrão, todos os valores são strings, exceto números, i{null}, i{true} e i{false}.
	- strings são delimitadas por aspas simples;
	- a aspa simples dentro da string é representada por duas aspas simples em sequência;
	- são permitidos como valores expressões regulares, seletores CSS de elementos e funções do escopo de window;
	- valores inválidos ou vazios para expressões regulares, seletores CSS e funções assumem o valor nulo;
	- a notação para expressão regular é semelhante à primitiva, os escapes devem ser duplos;
	- para referenciar função, definidas com i{var} ou i{function}, informe seu nome entre parenteses;
	- seletores CSS são alocados entre parênteses com os símbolos $ (elemento) ou $$ (lista) antecedendo a abertura;
	- se o array principal conter apenas um objeto, não é preciso adicionar as chaves inicial e final do objeto.
	. É possível referenciar um array de objetos no escopo de window informando o caractere # seguido do nome da variável.**/
	wdArray: {
		get: function() {
			if ("wdArray" in this._saved)
				return new __Parser(this._saved.wdArray);
			let data = null;
			try {
				if (this._check.string) {
					const note = this._data.normalize().trim();
					/*-- Referência para uma variável --------------------------------*/
					if ((/^\#.+$/).test(note)) {
						let list  = window[note.replace("#", "")];
						let check = new __Type(list);
						if (!check.array) throw new Error("Array not found.");
						for (let i = 0; i < list.length; i++) {
							let test = new __Type(list[i]);
							if (!test.object) throw new Error("Invalid item.");
						}
						this._saved["wdArray"] = list;
						return this.wdArray;
					}
					/*-- Ajustando o código e definindo verificações -----------------*/
					const code = [
						note[0]        === "{" ? "[" : "[{",
						note,
						note.slice(-1) === "}" ? "]" : "}]"
					].join("").split("");
					const last = code.length;
					let tag, val, txt;
					let find, rate, walk, name, test;
					let index = 0, count = 0;
					const tree = new __Tree();
					tree.xml = true;
					tree.open("wd");
					/*-- Circulando pelo código --------------------------------------*/
					while (index < last) {
						if (++count > 2*last) throw new Error("Many recursions.");
						val = code[index];
						tag = tree.level;
						txt = code.slice(index).join("");
						/*-- Tag externa (array) ---------------------------------------*/
						if (tag === "wd") {
							if (index === 0)
								tree.add("[").open("array");
							else
								tree.close();
							index += index === 0 ? 1 : last;
						}
						/*-- Array -----------------------------------------------------*/
						else if (tag === "array") {
							let reItem = /^\s*(\S)/;
							let reNext = /^\s*(\,\s*\]|\,|\])/;
							rate = null;
							if (reNext.test(txt)) {
								find = txt.match(reNext);
								rate = find[0].trim().slice(-1);
								walk = find[0].length;
							}
							else if (reItem.test(txt)) {
								find = txt.match(reItem);
								rate = find[0].trim();
								walk = find[0].length;
							}
							switch(rate) {
								case null: {throw new Error("wdArray - invalid array notation.");}
								case ",": {tree.add(", "); break;}
								case "]": {tree.close().add("]"); break;}
								case "[": {tree.add("[").open("array");  break;}
								case "{": {tree.add("{").open("object"); break;}
								case "/": {tree.open("regexp");   walk--; break;}
								case "'": {tree.open("string");   walk--; break;}
								case "(": {tree.open("function"); walk--; break;}
								case "$": {tree.open("node");     walk--; break;}
								default:  {tree.open("item");     walk--;}
							}
							index += walk;
						}
						/*-- Object ----------------------------------------------------*/
						else if (tag === "object") {
							let reName = /^\s*([a-z0-9_\-]+)\s*\:\s*(\S)/i;
							let reNext = /^\s*(\,\s*\}|\,|\})/;
							rate = null;
							if (reNext.test(txt)) {
								find = txt.match(reNext);
								rate = find[0].trim().slice(-1);
								walk = find[0].length;
							}
							else if (reName.test(txt)) {
								find = txt.match(reName);
								name = find[0].replace(reName, "$1");
								rate = find[0].replace(reName, "$2");
								walk = find[0].length;
								tree.add(`"${name}": `);
							}
							switch(rate) {
								case null: {throw new Error("wdArray - invalid object notation.");}
								case ",":  {tree.add(", "); break;}
								case "}":  {tree.close().add("}"); break;}
								case "{":  {tree.add("{").open("object"); break;}
								case "[":  {tree.add("[").open("array");  break;}
								case "/":  {tree.open("regexp");   walk--; break;}
								case "'":  {tree.open("string");   walk--; break;}
								case "(":  {tree.open("function"); walk--; break;}
								case "$":  {tree.open("node");     walk--; break;}
								default:   {tree.open("value");    walk--;}
							}
							index += walk;
						}
						/*-- Item (array) ou Value (object) ----------------------------*/
						else if (tag === "value" || tag === "item") {
							let lang = /^(true|false|null)$/;
							let div  = tag === "item" ? /^[^,\]]+/ : /^[^,}]+/;
							find = txt.match(div);
							rate = find === null ? null : find[0].trim();
							test = new __Type(rate);
							walk = find === null ? last : find[0].length;
							test = new __Type(rate);
							if (rate === null)
								throw new Error(`object: undefined ${tag} data.`);
							else if (test.finite)
								tree.add(test.toString()).close(tag);
							else if (lang.test(rate))
								tree.add(rate).close(tag);
							else
								tree.add(JSON.stringify(`${rate}`)).close(tag);
							index += walk;
						}
						/*-- Function --------------------------------------------------*/
						else if (tag === "function") {
							let reName = /^\(([^)]+)\)/;
							find = txt.match(reName);
							rate = find === null ? null : find[0].replace(reName, "$1").trim();
							walk = find === null ? last : find[0].length;
							if (rate === null)
								throw new Error("wdArray - invalid function notation.");
							else
								tree.add(JSON.stringify(`@function:${rate}`)).close();
							index += walk;
						}
						/*-- String ----------------------------------------------------*/
						else if (tag === "string") {
							rate = [];
							find = false;
							while(++index < last && !find) {
								if (code[index] === "'") {
									if (code[index+1] !== "'")
										find = true;
									else
										rate.push(code[++index]);
								}
								else {
									rate.push(code[index]);
								}
							}
							tree.add(JSON.stringify(rate.join(""))).close();
						}
						/*-- RegExp ----------------------------------------------------*/
						else if (tag === "regexp") {
							rate = [];
							find = false;
							let flag, char, scape, prop, text, open = 0;
							while(++index < last && !find) {
								char  = code[index];
								scape = code[index-1] === "\\";
								if (!scape && open < 1 && char === "[")
									open++;
								else if (!scape && open > 0 && char === "]")
									open--;
								else if (!scape && open < 1 && char === "/")
									find = true;
								if (!find) rate.push(char);
							}
							flag = code.slice(index).join("").match(/^[gim]*/);
							prop = {re: rate.join(""), flag: flag === null ? "" : flag[0]};
							text = `@regexp(${prop.flag}):${prop.re}`;
							tree.add(JSON.stringify(text)).close();
							index += prop.flag.length;
						}
						/*-- Nodes ----------------------------------------------------*/
						else if (tag === "node") {
							let reNode = /^\$\$?\(/;
							/*-- não inicia no formato $( ou $$( - retorna para item ou value --*/
							if (!reNode.test(txt)) {
								tree.close();
								tree.open(tree.level === "array" ? "item" : "value");
							}
							else {
								let all = txt.slice(0,2) === "$$";
								rate    = [];
								find    = 1;
								index  += all ? 2 : 1;
								let char, str = false;
								while(++index < last && find > 0) {
									char = code[index];
									if (!str) {
										str   = char === "'";
										find += char === "(" ? 1 : (char === ")" ? -1 : 0);
										rate.push(str ? "\"" : (find > 0 ? char : ""));
									}
									else {
										str = char !== "'";
										rate.push(!str ? "\"" : char);
									}
								}
								let query = all ?  "nodes" : "node";
								tree.add(JSON.stringify(`@${query}:${rate.join("")}`)).close();
							}
						}
					}

					/*--------------------------------------------------------------*/
					tree.finish();
					let json = JSON.parse(tree.toString());
					/*--------------------------------------------------------------*/
					const parse = function(item) {
						const check = new __Type(item);
						if (check.array) {
							for (let i = 0; i < item.length; i++)
								item[i] = parse(item[i]);
						}
						else if (check.object) {
							for (let i in item)
								item[i] = parse(item[i]);
						}
						else if (check.string) {
							let reExtra = {
								function: /^\@function\:(.*)$/,
								regexp:   /^\@regexp\(([gim]*)\)\:(.*)$/,
								node:     /^\@(nodes?)\:(.*)$/
							};
							if (reExtra.function.test(item)) {
								let name   = item.replace(reExtra.function, "$1");
								let method = typeof window[name] === "function";
								item = method ? window[name] : null;
							}
							else if (reExtra.regexp.test(item)) {
								let main = item.replace(reExtra.regexp, "$2");
								let flag = item.replace(reExtra.regexp, "$1");
								try      {item = new RegExp(main, flag);}
								catch(e) {item = null;}
							}
							else if (reExtra.node.test(item)) {
								let len  = item.replace(reExtra.node, "$1");
								let css  = item.replace(reExtra.node, "$2");
								let name = len === "nodes" ? "querySelectorAll" : "querySelector";
								try      {item = document[name](css);}
								catch(e) {item = null;}
								let test = new __Type(item);
								item = test.node && test.value.length > 0 ? item : null;
							}
						}
						return item;
					};
					data = parse(json);
				}
			}
			catch(e) {
				const msg = `wdArrayError: ${this._data}`;
				__UNDERMAINTENANCE ? console.error(e) : console.info(msg);
			}
			this._saved["wdArray"] = data;
			return this.wdArray;
		}
	},