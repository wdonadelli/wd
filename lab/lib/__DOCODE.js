/**

@menu

#3 Segregando Código
O objeto '{__DOCODE} permite que comentários, ou outras informações delimitadas por caracteres específicos, possam ser segregados do código fonte.
Também contempla a decodificação de uma linguagem de marcação específica em elementos HTML, permitindo, em conjunto com a ferramenta de segregação, a elaboração de instruções do código dentro do próprio código fonte se utilizando dos comentários.

#4 Regras Gerais
A notação possui as seguintes regras:
+ Linhas sem caracteres imprimíveis são desconsideradas, exceto dentro de um bloco de texto pré formatado;
+ Cada elemento HTML é identificado por caraceres específicos definidos pela notação;
+ Os caracteres &{amp}, &{lt} e &{gt} são tratados como texto, não sendo sensíveis ao código HTML gerado;
+ Há notação para elementos de bloco, elementos textuais (em linha) e outros especiais;
+ Cada notação deve estar separada por quebra de linha, excetos elementos textuais;
+ Blocos de citação e de texto pré formatado podem conter múltiplas linhas;
+ Os caracteres utilizados na notação devem ser informados no início de cada linha seguidos de seu conteúdo;
+ A continuidade de uma determinada notação pressupõe a continuidade do elemento por ela definido;
+ Se não for identificada nenhuma notação, o conteúdo será definido como parágrafo; e
+ Cuidar para que os caracteres delimitadores não estejam contidos em i{strings} ou expressões regulares;

#4 Elementos de Blocos
- Itens de u{listas não ordenadas} são identificadas pelo caractere &{#x002D} seguido de espaço em branco;
- Itens de u{listas ordenadas} são identificadas pelo caractere &{#x002B} seguido de espaço em branco;
- Itens de u{listas de definição} são identificadas pelo caractere &{#x002E} seguido de espaço em branco;
- Para adicionar um termo à uma u{lista de definição}, deve-se separar o termo da sua descrição com o caractere &{#x003A};
- u{Tabelas} são identificadas pelo pelo caractere &{#x007C}, utilizado no início, no fim e como separador de colunas;
- A primeira linha de uma u{tabela} será seu cabeçalho; e
- u{Títulos} são identificados pelo caractere &{#x0023} seguido do respectivo nível (1-6) e um espaço em branco.

#4 Blocos Multilinhas
- Um bloco de u{citação} deve iniciar e terminar com um duplo caractere &{#x0022};
- Um bloco de u{texto pré formatado} deve iniciar e terminar com um duplo caractere &{#x0027}; e
- Os blocos citados podem conter múltiplas linhas, sendo os caracteres da notação os delimitadores de seu conteúdo.

#4 Elementos Textuais (em linha)
+ Elementos textuais são identificados pelo nome (i{tag}) seguindo de seu conteúdo textual delimitado pelos carateres &{#x007B} e &{#x007D} (span&{#x007B}texto&{#x007D} é igual a <span>texto</span>);
+ Os atributos do elemento textual, se necessário, são informados após o caractere &{#x007D}, da mesma forma ocorrida nos elementos HTML, delimitados pelos caracters &{#x005B} e &{#x005D};
+ Não é possível definir filhos aos elementos textuais;
+ Elementos do tipo bloco também são permitidos, mas podem não fazer sentido;
+ Elemento do tipo '{script} é ignorado, o objetivo da notação é formatação textual; e
+ Os seguintes atalhos podem ser utilizados em substituição ao nome do elemento:
|Caractere|Descrição|Exemplo|
|&{#x0027}|Atalho para o elemento '{code}|&{#x0027}&{#x007B}x = 1&{#x007D} e igual à code&{#x007B}x = 1&{#x007D}|
|&|Atalho para caracteres especiais do tipo i{&#x003B;}|&&{#x007B}#x003B&{#x007D} (sem &{#x003B})|
@caption "Tabela de atalhos para alguns componentes em HTML"

#4 Elementos Especiais
+ Os elementos especiais iniciam com o símbolo &{#x0040} seguido de seu nome;
+ Após o nome, atributos poderão ser informados conforme elemento;
+ Os atributos devem estar delimitados por aspas duplas (&{#x0022});
+ O nome e os atributos devem estar separados por espaços; e
+ Todas as informações do elemento devem estar em uma única linha.
|Nome|Descrição|Atributo 1|Atributo 2|
|'{menu}|Define um menu para listar i{links} para os cabeçalhos de u{níveis 2 a 6} b{posteriores} à notação.|-|-|
|'{figure}|Define um quadro para uma imagem.|Caminho para o arquivo.|Descrição da imagem ('{alt}).|
|'{caption}|Define a legenda do b{elemento anterior} nos casos de u{tabela e figura} ('{@figure}).|Texto da legenda|-|
|'{file}|Define um quadro para comportar arquivos.|Caminho para o arquivo|MIME TYPE do arquivo|
@caption "Nome dos elementos especiais"

#4 Métodos
O argumento '{body} corresponde ao elemento HTML onde a notação é renderizada.**/
const __DOCODE = {
	/**. '{object split(string code, string start, string close)}: Segrega os conteúdos delimitados pelos caracteres definidos em '{start} e '{close}, retornando um objeto contendo o conteúdo segregado e o resíduo do conteúdo definido em '{code}:
	|Nome|Tipo|Descrição|
	|'{data}|string|Conteúdo segregado|
	|'{code}|string|Conteúdo original residual com linhas em branco condensadas|**/
	split: function(code, start, close) {
		code  = typeof code  === "string" ? code.normalize()         : null;
		start = typeof start === "string" ? start.normalize().trim() : null;
		close = typeof close === "string" ? close.normalize().trim() : "\n";
		if (code === null || start === null) return null;
		const data = [];
		while (code.indexOf(start) >= 0) {
			/*-- início da captura --*/
			let init = code.indexOf(start);
			let open = init + start.length;
			/*-- fim da captura --*/
			let last = code.slice(open).indexOf(close);
			let stop = last < 0 ? Infinity : open + last;
			/*-- captura e remoção --*/
			let find = code.slice(open, stop);
			let text = start + find + (last < 0 || close === "\n" ? "" : close);
			code = code.replace(text, "");
			data.push(find);
		}
		return {code: code.replace(/^\s*$/gm, "").replace(/\n+/g, "\n"), data: data.join("\n")};
	},
	/**. '{string inner(string code)}: Decodifica o conteúdo textual para código HTML e o retorna.**/
	inner: function(code) {
		const  re  = /(\&amp\;|'|[a-z]+)\{([^\}]*)\}(?:\[([^\]]*)\])?/;
		let inner = code.trim().replace(/\&/g, "&amp;").replace(/\>/g, "&gt;").replace(/\</g, "&lt;");
		while(re.test(inner)) {
			let find = inner.match(re);
			let attr = find[3] ? find[3] : "";
			switch(find[1].toLowerCase()) {
				case "'":      inner = inner.replace(find[0], `<code ${attr} translate="no">${find[2]}</code>`); break;
				case "&amp;":  inner = inner.replace(find[0], `&${find[2]};`); break;
				case "script": inner = inner.replace(find[0], ""); break;
				default:       inner = inner.replace(find[0], `<${find[1]} ${attr}>${find[2]}</${find[1]}>`);
			}
		}
		return inner;
	},
	/**. '{node create(node body, string tag)}: Retorna o nó especificado em '{tag} filho de '{body}.**/
	create: function(body, tag) {
		const last = body.lastElementChild;
		if (last === null || last.tagName.toLowerCase() !== tag) {
			const node = document.createElement(tag);
			body.appendChild(node);
			return node;
		}
		return last;
	},
	/**. '{boolean head(node body, string code)}: Checa, adiciona estrutura de títulos e retorna o resultado.**/
	head: function(body, code) {
		const re = /^\s*\#([1-6])(.*)$/;
		if (!re.test(code)) return false;
		/*-- registrar --*/
		const find = code.match(re);
		const elem = document.createElement(`h${find[1]}`);
		if (find[2].trim() !== "") {
			const id = __ID.value;
			elem.innerHTML = this.inner(find[2].trim());
			elem.id = id;
			body.appendChild(elem);
			/*-- adicionar ao menu --*/
			if (Number(find[1]) > 1) {
				const item = document.createElement("li");
				const link = document.createElement("a");
				item.appendChild(link);
				link.href = `#${id}`;
				link.textContent = (". . ").repeat(find[1] - 2) + elem.textContent;
				Array.from(body.querySelectorAll("menu")).forEach(function(v,i,a) {
					v.appendChild(item.cloneNode(true));
				});
			}
		}
		return true;
	},
	/**. '{boolean table(node body, string code)}: Checa, adiciona estrutura de tabela e retorna o resultado.**/
	table: function(body, code) {
		const re = /^\s*\|(.*)\|\s*$/;
		if (!re.test(code)) return false;
		/*-- registrar --*/
		const find = code.match(re);
		const elem = this.create(body, "table");
		const tbox = elem.tHead === null ? "head" : "body";
		const trow = document.createElement("tr");
		/*-- criando containers --*/
		elem.border = 1;
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
	/**. '{boolean list(node body, string code)}: Checa, adiciona estrutura de lista e retorna o resultado.**/
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
	/**. '{boolean text(node body, string code)}: Checa, adiciona estrutura de blocos de texto e retorna o resultado.**/
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
				else if (name === "blockquote" && code.trim() !== "") {
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
	/**. '{boolean plus(node body, string code)}: Checa, adiciona estruturas especiais e retorna o resultado.**/

	//FIXME alterar e criar:
	//@menu
	//@caption: texto da legenda //tabela e figura
	//@figure: caminho da imagem
	//@alt: descrição da imagem //figura
	//FIXME mudar para __DOM e __HTML
	//FIXME lembrar que var !== null && typeof var === object não é apenas um objeto, pode ser regex


	plus: function(body, code) {
		const re   = /^\s*\@(\w+)(?:\s+\"([^"]+)\")?(?:\s+\"([^"]+)\")?\s*$/;
		const file = /([^/\\]+)$/;
		const find = code.match(re);
		if (find === null) {
			return false;
		}
		if (find[1].toLowerCase() === "menu") {
			const elem = document.createElement("menu");
			body.appendChild(elem);
			return true;
		}
		if (find[1].toLowerCase() === "figure" && find[2] !== undefined) {
			const elem = document.createElement("figure");
			const img  = __FILE.frame(find[2], find[2].match(file)[1], "image");
			img.alt = find[3];
			elem.appendChild(img);
			body.appendChild(elem);
			return true;
		}
		if (find[1].toLowerCase() === "file" && find[2] !== undefined && find[3] !== undefined) {
			const elem = __FILE.frame(find[2], find[2].match(file)[1], find[3]);
			body.appendChild(elem);
			return true;
		}
		if (find[1].toLowerCase() === "caption" && find[2] !== undefined) {
			const last = body.lastElementChild;
			const name = last === null ? null : last.tagName.toLowerCase();
			if (name === "table") {
				last.createCaption().innerHTML = this.inner(find[2]);
				return true;
			}
			else if (name === "figure") {
				const elem = document.createElement("figcaption");
				elem.innerHTML = this.inner(find[2])
				last.appendChild(elem);
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
		if (this.plus(body, code))  return true;
		/*-- parágrafo genérico --*/
		if (code.trim().length > 0) {
			const elem = document.createElement("p");
			elem.innerHTML = this.inner(code.trim());
			body.appendChild(elem);
			return true;
		}
		return false;
	},
	/**. '{void render(node body, string code)}: Renderiza as notações no elemento '{body}.**/
	render: function(body, code) {
		String(code).trim().normalize().split("\n").forEach(function(v,i,a) {
			return this.append(body, v);
		}, this);
		return;
	},
};