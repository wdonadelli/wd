/**
#3 Segregando Código
O objeto '{__DOCODE} segrega as linhas de comentário do código fonte podendo ser traduzido o conteúdo para notação HTML caso seja escrito com determinadas regras de notação.
**/
const __DOCODE = {
	/**. '{object split(string code, string open, string stop)}: Separa o código conforme caracteres de abertura e fechamento de comentário ('{open/stop}) retornando um objeto contendo informação da fonte ('{src}) e dos comentários ('{doc}).
	. Os caracteres de abertura e fechamento de comentários não podem estar contidos em strings!**/
	/**. '{object marks}: Registra as notações da codificação que são analisadas a cada quebra de linha:
	|Blocos|Notação|
	|Citação|O caracter &{#x0022} delimita o início e o fim do bloco, as linhas entre os caracteres definirão seu conteúdo.|
	|Código|O caracter &{#x0027} delimita o início e o fim do bloco, as linhas entre os caracteres definirão seu conteúdo.|
	|Tabela|Utilize o caracter &{#x007C} como separador de coluna, iniciando e terminando a linha com ele.|
	|Lista Desordenada|Utilize o caracter &{#x002D} para definir um item desordenado.|
	|Lista Ordenada|Utilize o caracter &{#x002B} para definir um item ordenado.|
	|Lista Descritiva|Utilize o caracter &{#x002E} para definir um item descritivo.|
	|Títulos|Utilize o caracter &{#x0023} seguindo do número (1-6) para definir um título e seu nível.|
	- Linhas vazias não são consideradas e não interrompem a sequência do bloco;
	- Os caracteres de abertura e fechamento dos blocos de citação e código não podem conter outros caracteres;
	- Os caracteres de lista e título devem estar no começo da linha e seguido de um espaço e o seu conteúdo;
	- Utilize o caracter &{#x003A} para separar o título do item de sua descrição na lista descritiva; e
	- Se nenhuma notação acima for utilizada, será considerado um parágrafo.**/

	/**. '{node doc(string code, string open, string stop)}`: Retorna os comentários renderizados como documento.**/
	/**. '{string inline(string inner)}: Retorna o valor de '{innerHTML} para formatar os elementos filhos profundos e possibilitar a definição de elementos i{inline}:
'
COM ATRIBUTOS:  tag{texto}[atributo1="valor1" atributo2="valor2"]
SEM ATRIBUTOS:  tag{texto}
CODE ABREVIADO: '{texto}
CARACTERES:     &{code}
'**/









	split: function(code, start, close) {
		code  = typeof close === "string" ? code.normalize()         : null;
		start = typeof start === "string" ? start.normalize().trim() : null;
		close = typeof close === "string" ? close.normalize().trim() : "\n";
		if (code === null || start === null) return null;
		const data = [];
		let init, line, last, find, text, eof = false;
		while (!eof) {
			init = code.indexOf(start);
			line = code.slice(init + start.length).indexOf(close);
			last = (init + start.length) + (line < 0 ? Infinity : line) + close.length;
			eof  = init < 0 || line < 0;
			if (init >= 0) {
				text = code.slice(init, last);
				find = text.slice(start.length, line < 0 ? Infinity : text.length - close.length);
				code = code.replace(text, "");
				data.push(find);
			}
		}
		data.push(`''${code.replace(/^\s*$/g, "")}''`);
		this.render(document.body, data.join("\n"))
	},
	/**. '{string inner(string code)}: Decodifica o conteúdo textual para código HTML e o retorna.**/
	inner: function(code) {
		const  re  = /(\&amp\;|'|[a-z]+)\{([^\}]*)\}(?:\[([^\]]*)\])?/;
		let inner = code.trim().replace(/\&/g, "&amp;").replace(/\>/g, "&gt;").replace(/\</g, "&lt;");
		while(re.test(inner)) {
			let find = inner.match(re);
			let attr = find[3] ? find[3] : "";
			switch(find[1]) {
				case "'":     inner = inner.replace(find[0], `<code ${attr} translate="no">${find[2]}</code>`); break;
				case "&amp;": inner = inner.replace(find[0], `&${find[2]};`); break;
				default:      inner = inner.replace(find[0], `<${find[1]} ${attr}>${find[2]}</${find[1]}>`);
			}
		}
		return inner;
	},
	/**. '{node create(node body, string tag)}: Retorna o nó especificado em '{tag} filho de '{body}.**/
	create: function(body, tag) {
		const html = body.lastElementChild;
		if (html === null || html.tagName.toLowerCase() !== tag) {
			const node = document.createElement(tag);
			body.appendChild(node);
			return node;
		}
		return html;
	},
	/**. '{boolean head(node body, string code)}: Checa e adiciona estrutura de títulos e retorna o resultado.**/
	head: function(body, code) {
		const re = /^\s*\#([1-6])(.*)$/;
		if (!re.test(code)) return false;
		/*-- registrar --*/
		const find = code.match(re);
		const elem = document.createElement(`h${find[1]}`);
		if (find[2].trim() !== "") {
			elem.innerHTML = this.inner(find[2].trim());
			elem.id = __ID.value;
			body.appendChild(elem);
		}
		return true;
	},
	/**. '{boolean table(node body, string code)}: Checa e adiciona estrutura de tabela e retorna o resultado.**/
	table: function(body, code) {
		const re = /^\s*\|(.*)\|\s*$/;
		if (!re.test(code)) return false;
		/*-- registrar --*/
		const find = code.match(re);
		const elem = this.create(body, "table");
		const tbox = elem.tHead === null ? "head" : "body";
		const trow = document.createElement("tr");
		/*-- criando containers --*/
		if (elem.tHead === null)       elem.createTHead();
		if (elem.tBodies.length === 0) elem.createTBody();
		/*-- capturando células --*/
		find[1].split("|").forEach(function(v,i,a) {
			const cell = document.createElement(tbox === "head" ? "th" : "td");
			cell.innerHTML = this.inner(v);
			trow.appendChild(cell);
		}, this);
		/*-- adicionando linha --*/
		if (trow.childElementCount > 0)
			(tbox === "head" ? elem.tHead.appendChild(trow) : elem.tBodies[0].appendChild(trow));
		return true;
	},
	/**. '{boolean list(node body, string code)}: Checa e adiciona estrutura de lista e retorna o resultado.**/
	list: function(body, code) {
		const re = /^\s*([.+\-])\s+(.+)$/;
		if (!re.test(code)) return false;
		/*-- registrar --*/
		const tags = {"+": "ol", "-": "ul", ".": "dl"};
		const find = code.match(re);
		const elem = this.create(body, tags[find[1]]);
		/*-- listas ordenadas e não ordenadas --*/
		if (find[2] && (tags[find[1]] === "ul" || tags[find[1]] === "ol")) {
			const li = document.createElement("li");
			li.innerHTML = this.inner(find[2]);
			elem.appendChild(li);
		}
		/*-- listas descritivas --*/
		else if (find[2] && tags[find[1]] === "dl") {
			const dl = find[2].trim().match(/^(?:(?:([^:]+)\:)?(.+))$/);
			if (dl[1]) {
				const dt = document.createElement("dt");
				dt.innerHTML = this.inner(dl[1]);
				elem.appendChild(dt);
			}
			if (dl[2]) {
				const dd = document.createElement("dd");
				dd.innerHTML = this.inner(dl[2].trim());
				elem.appendChild(dd);
			}
		}
		return true;
	},
	/**. '{boolean text(node body, string code)}: Checa e adiciona estrutura de blocos de texto e retorna o resultado.**/
	text: function(body, code) {
		const node = body.lastElementChild;
		const tag  = node === null ? null : node.tagName.toLowerCase();
		const data = {
			pre:        {start: /^(\s*\'\')/, close: /(\'\'\s*)$/,},
			blockquote: {start: /^(\s*\"\")/, close: /(\"\"\s*)$/,},
		};
		/*-- definindo status --*/
		for (let name in data) {
			let open  = name === tag && node.dataset.open == "1";
			let start = data[name].start.test(code);
			let close = data[name].close.test(code);
			data[name].status = open ? (close ? "close" : "add") : (start ? "open" : null);
		}
		/*-- blocos específicos --*/
		for (let name in data) {
			if (data[name].status === "open") {
				const elem = document.createElement(name);
				body.appendChild(elem);
				elem.dataset.open = "1";
				return this.text(body, code.replace(data[name].start, ""));
			}
			if (data[name].status === "add") {
				if (name === "pre") {
					node.textContent += `\n${code}`;
				}
				else if (name === "blockquote") {
					const elem = document.createElement("p");
					elem.innerHTML = this.inner(code.trim());
					node.appendChild(elem);
				}
				return true;
			}
			if (data[name].status === "close") {
				this.text(body, code.replace(data[name].close, ""));
				delete node.dataset.open;
				return true;
			}
		}
		return false;
	},
	/**. '{boolean append(node body, string code)}: Checa, adiciona estruturas e retorna o resultado.**/
	append: function(body, code) {
		/*-- text precisa ser o primeiro --*/
		if (this.text(body, code))  return true;
		if (this.list(body, code))  return true;
		if (this.table(body, code)) return true;
		if (this.head(body, code))  return true;
		/*-- parágrafo genérico --*/
		if (code.trim().length > 0) {
			const elem = document.createElement("p");
			elem.innerHTML = this.inner(code.trim());
			body.appendChild(elem);
			return true;
		}
		return false;
	},
	/**. '{void render(node body, string code)}: Renderiza o código no elemento '{body}.**/
	render: function(body, code) {
		String(code).trim().normalize().split("\n").forEach(function(v,i,a) {
			return this.append(body, v);
		}, this);
		return;
	},
};