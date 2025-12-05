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

	/**. '{object marks}: Registra as notações da codificação que são analisadas a cada quebra de linha:
	|Blocos|Notação|
	|Citação|O caracter &{#x0022} delimita o início e o fim do bloco, as linhas entre os caracteres definirão seu conteúdo.|
	|Código|O caracter &{#x0027} delimita o início e o fim do bloco, as linhas entre os caracteres definirão seu conteúdo.|
	|Tabela|Utilize o caracter &{#x007C} como separador de coluna, iniciando e terminando a linha com ele.|
	|Lista Desordenada|Utilize o caracter &{#x002D} para definir um item desordenado.|
	|Lista Ordenada|Utilize o caracter &{#x002B} para definir um item ordenado.|
	|Lista Descritiva|Utilize o caracter &{#x002E} para definir um item descritivo.|
	|Títulos|Utilize o caracter &{#x0023} seguindo do número (1-6) para definir um título e seu nível.|
	- Linhas vazias não são consideradas, mas não interrompem a sequência do bloco;
	- Os caracteres de abertura e fechamento dos blocos de citação e código não podem conter outros caracteres;
	- Os caracteres de lista e título devem estar no começo da linha e seguido de um espaço e o seu conteúdo;
	- Utilize o caracter &{#x003A} para separar o título do item de sua descrição na lista descritiva; e
	- Se nenhuma notação acima for utilizada, será considerado um parágrafo;

	|Mídia|Bloco|Linha|Inicia com "@MIMETYPE " seguido do link entre os caracteres "< >" e o texto em caso de falha.|






	|Formatação|Em linha|Conteúdo|Nome da tag HTML seguindo do conteúdo limitado pelos caracteres "{ }".|
	- O valor MIMETYPE deve ser alterado conforme o tipo de arquivo a ser carregado;
	- Atributos de elementos em linha são informados após o caracter "}" delimitado por colchetes "[attr]" (opcional); e
	- Não é possível efetuar formatações dentro do conteúdo dos elementos em linha.
	**/
	marks: {
		ul:    /^\-\s+(.+)$/,     ol: /^\+\s+(.+)$/,   dl: /^\.\s+(.+)$/,
		h1:    /^\#1\s+(.+)$/,    h2: /^\#2\s+(.+)$/,  h3: /^\#3\s+(.+)$/,
		h4:    /^\#4\s+(.+)$/,    h5: /^\#5\s+(.+)$/,  h6: /^\#6\s+(.+)$/,
		table: /^\|(.+)\|$/,   quote: /^\"()$/,       pre: /^\'()$/,
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
				const item = main.length - 1;
				const last = item < 0 ? {} : main[item];
				const unit = (/^(p|h[1-6])$/).test(v.type);
				if (v.type !== last.type || unit)
					main.push({type: v.type, value: [v.value]});
				else
					main[item].value.push(v.value);
			}
			return;
		});
		/*-- registrar os elementos filhos --*/
		return {tag: "section", attr: {}, child: main.map(function(v,i,a) {
			return this[v.type](v.value);
		}, this)};
	},
	/**. '{string inline(string inner)}: Retorna o valor de '{innerHTML} para formatar os elementos filhos profundos e possibilitar a definição de elementos i{inline}:
'
COM ATRIBUTOS:  tag{texto}[atributo1="valor1" atributo2="valor2"]
SEM ATRIBUTOS:  tag{texto}
CODE ABREVIADO: '{texto}
CARACTERES:     &{code}
'**/
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
	/**. '{object ul(array list, boolean ol)}: Retorna a estrutura do elemento '{ul}.**/
	ul: function(list, ol) {
		return {tag: ol === true ? "ol" : "ul", attr: {}, child: list.map(function(v,i,a) {
			return {tag: "li", attr: {innerHTML: this.inline(v)}, child: []};
		}, this)}
	},
	/**. '{object ol(array list)}: Retorna a estrutura do elemento '{ol}.**/
	ol: function(list) {return this.ul(list, true);},
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
	/**. '{object p(array list)}: Retorna a estrutura do elemento '{p}.**/
	p: function(list) {
		return {tag: "p", attr: {innerHTML: this.inline(list[0])}, child: []};
	},
	/**. '{object h1(array list, integer n)}: Retorna a estrutura do elemento '{h1}.**/
	h1: function(list, n) {
		n = Number.isInteger(n) ? n : 1;
		return {tag: `h${n}`, attr: {id: __ID.value, textContent: list[0]}, child: []};
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
	/**. '{object table(array list)}: Retorna a estrutura do elemento '{table}.**/
	table: function(list) {
		const rows = list.map(function(v,i,a) {return v.split("|");});
		const head = rows.slice(0,1);
		const body = rows.slice(1);
		return {tag: "table", attr: {border: 1}, child: [
			{tag: "thead", attr: {}, child: head.map(function(row,i,a) {
				return {tag: "tr", attr: {}, child: row.map(function(col,y,z) {
					return {tag: "th", attr: {innerHTML: this.inline(col)}, child: []};
				}, this)};
			}, this)},
			{tag: "tbody", attr: {}, child: body.map(function(row,i,a) {
				return {tag: "tr", attr: {}, child: row.map(function(col,y,z) {
					return {tag: "td", attr: {innerHTML: this.inline(col)}, child: []};
				}, this)};
			}, this)},
		]};
	},
	/**. '{object dl(array list)}: Retorna a estrutura do elemento '{dl}.**/
	dl: function(list) {
		const dl = {tag: "dl", attr: {}, child: []};
		const re = /^([^:]+)\:(.+)$/;
		list.forEach(function(v,i,a) {
			if (re.test(v)) {
				dl.child.push({tag: "dt", attr: {innerHTML: this.inline(v.trim().replace(re, "$1"))}, child:[]});
				dl.child.push({tag: "dd", attr: {innerHTML: this.inline(v.trim().replace(re, "$2"))}, child:[]});
			} else {
				dl.child.push({tag: "dd", attr: {innerHTML: this.inline(v)}, child:[]});
			}
		}, this);
		return dl;
	},

	/*
case "media":  {//@video
	/^\@(image|audio|video)\s+\<([^>]+)\>(.*)$/
	let mime = txt.replace(type.media, "$1");
	let data = txt.replace(type.media, "$2");
	let text = txt.replace(type.media, "$3");
	tree.open(`object type="${mime}" data="${data}"`).add(text).close();
	index++;
	break;
}
*/
};