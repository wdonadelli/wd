/**

@menu

#3 Segregando Código
O objeto '{__DOCODE} permite que comentários, ou outras informações delimitadas por caracteres específicos, possam ser segregados do código fonte.
Também contempla a decodificação de uma linguagem de marcação específica em elementos HTML, permitindo, em conjunto com a ferramenta de segregação, a elaboração de instruções do código dentro do próprio código fonte se utilizando dos comentários.

#4 Regras Gerais
A notação possui as seguintes regras:
+ Há anotações para elementos contínuos, únicos, de escopo, de formatação textual e especiais e para atributos;
+ Linhas sem caracteres imprimíveis são desconsideradas, exceto dentro do escopo de texto pré formatado;
+ Os caracteres &{amp}, &{lt} e &{gt} são tratados como texto, não sendo sensíveis ao código HTML;
+ A notação é definida por caracteres específicos que identificam o tipo de elemento a ser gerado;
+ Cada notação deve estar contida numa única linha, excetos os escopos, que aceitam múltiplas linhas;
+ Os caracteres que abrem ou identificam a notação devem estar no início da linha, exceto a notação para atributos;
+ Se não for identificada nenhuma notação, o conteúdo será definido como parágrafo; e
+ Quando a notação estiver compartilhada com o código fonte, os caracteres delimitadores não podem estar contidos em i{strings} ou expressões regulares.

#4 Notação de Atributos
A notação para atributo estabelece relação com os atributos HTML a serem definidos ao elemento.
+ Somente os elementos de formatação textual, campos de formulários e especiais permitem definir atributos;
+ A notação para atributo inicia com o caractere &{#x0040} seguida dos nomes e valores do atributos;
+ Cada atributo é definido pelo seu nome seguindo do respectivo valor delimitado pelos caracteres &{#x007B} e &{#x007D};
+ Vários conjuntos de atributos podem ser definidos em sequência;
+ Nomes de atributos podem conter caracteres alfanumérico, sublinhado e traço apenas; e
+ Para informar um caractere &{#x007D} como valor do atributo, ele deve ser previamente escapado com &{#x005C}.

#4 Elementos Contínuos
A continuidade de uma determinada notação pressupõe também a continuidade do seu respectivo elemento por ela representado.

#5 Listas
Há notações para listas ordenadas, não ordenadas e de definição:
- Itens de u{listas não ordenadas} são identificados pelo caractere &{#x002D} seguido de espaço em branco e seu conteúdo;
- Itens de u{listas ordenadas} são identificados pelo caractere &{#x002B} seguido de espaço em branco e seu conteúdo;
- Itens de u{listas de definição} são identificados pelo caractere &{#x002E} seguido de espaço em branco e seu conteúdo; e
- Para adicionar um termo à uma u{lista de definição}, deve-se separar o termo da sua descrição com o caractere &{#x003A}.

#5 Tabelas
No caso de tabelas, há notação para linhas/colunas e para legenda.
- Linhas de tabelas são identificadas pelo pelo caractere &{#x007C}, presente no início, no fim e como separador de colunas;
- A primeira linha da notação identificando colunas será o cabeçalho da tabela;
- O conteúdo da célula deve ficar entre os delimitadores de coluna;
- O texto da legenda deve estar numa linha separada entre os caracteres &{#x007C}&{#x0022}&{#x0022} e &{#x0022}&{#x0022}&{#x007C} e ser adjacente às demais linhas;

#4 Elementos Únicos
Elementos únicos são aqueles que não possuem uma continuidade, ocupando a notação de uma única linha.

#5 Títulos/Cabeçalhos
u{Títulos} são identificados pelo caractere &{#x0023} seguido do nível (1-6), de um espaço em branco e seu conteúdo.

#5 Campos de Formulários
A notação de formulários está dividida em u{quatro elementos}, todos u{separados por espaço}: o caractere identificador da notação; o rótulo do campo; os atributos do campo; e o valor ou a lista de valores.
+ Os campos de formulários não precisam estar dentro de um escopo de formulário;
+ A u{notação} de campo de fomulário é definida pelo caractere &{#x002A} no início da linha;
+ O u{rótulo} consiste numa i{string} que identifica visualmente o nome do formulário;
+ Se o campo for de u{preenchimento obrigatório}, o caractere &{#x002A} deve ser adicionado ao fim do rótulo;
+ A função dos u{atributos} é definir o tipo e nome do campo e outras u{características específicas};
+ O primeiro atributo deve ser o u{tipo} do campo, incluídos os valores '{textarea} e '{select};
+ O valor do primeiro atributo (tipo) é o u{nome} do campo;
+ Após os atributos, é possível definir o u{valor inicial} do campo ou uma u{lista da valores} (para elementos que a comportam);
+ A u{lista/valor} é delimitada pelos caracteres &{#x005B} e &{#x005D} - múltipla escolha - ou &{#x0028} e &{#x0029} - escolha única;
+ A definição entre u{múltipla escolha} e u{escolha única} tem relevância apenas para os campos '{select, file, email} e '{radio};
+ A u{lista/valor} é opcional e seu conteúdo pode ser vazio;
+ Para definir uma u{lista}, deve-se separar os itens com caractere &{#x002C};
+ Caso valor e o rótulo do u{item da lista} sejam diferentes, deve-se separá-los com caractere &{#x003A}, nessa ordem; e
+ Para marcar u{item padrão da lista}, o caractere &{#x002A} deve ser adicionado ao fim de seu rótulo.
Com as informações da notação, é possível dispensar o preenchimentos dos seguintes atributos: '{required, type, name, value, multiple, list} e '{checked/selected}. Para os demais atributos mais específicos, é preciso definis-lo após o tipo de campo.


					UF     @select{uf} [PR,SC*,RS]
					Nome   @text{nome}required{true} ()
					Cor    @text{cor} > [Azul, Verde, Vermelho]
					Aceite @checkbox{ok}actived{true}
					Idade  @number{idade}min{0}max{80}step{1}
					OK     @submit.send.formmethod{GET}
					OK     @type{submit}name{send}formmethod{GET}formaction{loko.php}

					@audio?src{loko.mp3}controls{true}
					@audio  loko.mp3
					@video  loko.mpeg
					@figure loko.jpeg <legenda> <descrição da imagem>
					@file   loko.xml
					@menu
					@figure loko.jpeg "O louco. Pintura de Maluco" "Homem doido sentado de pernas para o ar"
					! loko.jpeg
					!	""O louco. Pintura de Maluco""
					! "Homem doido sentado de pernas para o ar"





#4 Elementos de Escopo
- O escopo de u{citação} inicia e termina com um duplo caracter &{#x0022};
- O escopo de u{texto pré formatado} inicia e termina com um duplo caracter &{#x0027};
- O escopo de u{formulário} inicia e termina com um duplo caracter &{#x002A};
- Os dados para submissão do formulários devem ser inseridos num campo do tipo '{submit} ou '{image};
- O escopo de u{agrupamento de campos} inicia com o nome da legenda delimitado por um duplo caractere &{#x005F};
- O escopo de u{agrupamento de campos} termina com um duplo caracter &{#x005F};
- É possível a um escopo conter um escopo de outro tipo, exceto o de texto pré formatado; e
- Os escopos de texto pré formatado e citação podem conter conteúdo após ou antes dos caracteres delimitadores, respecitvamente;

#4 Elementos de Formatção Textual (em linha)
+ Elementos textuais são identificados pelo nome (i{tag} HTML) seguido de seu conteúdo textual delimitado pelos carateres &{#x007B} e &{#x007D};
+ Os atributos podem são informados após o caractere &{#x007D};
+ Não é possível definir filhos aos elementos textuais;
+ Qualquer tipo de elemento, exceto '{script}, pode ser definido, observar o que faz sentido ao conteúdo textual (em linha);
+ Os seguintes atalhos podem ser utilizados em substituição ao nome do elemento:
|""Tabela de atalhos para alguns componentes em HTML""|
|Caractere|Descrição|
|&{#x0027}|Atalho para o elemento '{code}|
|&|Atalho para caracteres especiais do tipo i{&#x003B;}|

#4 Exemplos

''Lista não ordernada:
- Item 1
- Item 2
- Item 3

Lista ordenada:
+ Item 1
+ Item 2
+ Item 3

Lista de definições:
. Termo: Definição
. Definição
. Termo: Definição

Tabela:
|Head 1|Head 2|Head 3|
|Cell 1.1|Cell 1.2|Cell 1.3|
|Cell 2.1|Cell 2.2|Cell 2.3|
|""Caption""|

Cabeçalhos:
#3 Título de Nível 3
#1 Título de Nível 1

Citação:
""Início da Citação.
Meio da citação.
Fim da citação""

Agrupamento de Campos:
__ Legenda __
...
__

Formulário:
** method{get}action{/file.php} **
...
**

Elemento Textuais:
Esta u{frase} contém uma '{palavra}@class{style}id{abc}] sublinhada. &{#x270E}

Equivale a
Esta <u>frase<u> contém uma <code class="style" id="abc">palavra</code> sublinhada. &#x270E;
''

Esta u{frase} contém uma '{palavra}@class{style}id{abc} sublinhada. &{#x270E}


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
|""Nome dos elementos especiais""|
|'{file}|Define um quadro para comportar arquivos.|Caminho para o arquivo|MIME TYPE do arquivo|



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
	/**. '{object attr(string code)}: Checa se '{code} está em formato de atributo da notação e retorna as seguintes informaçẽos:
	|:Tabela de retorno do método '{attr}:|
	|Nome|Tipo|Descrição|
	|'{find}|string|Fragmento da notação de atributo casado|
	|'{html}|string|Codificação do fragmento casado para a notação de atributos HTML|
	|'{json}|object|Codificação do fragmento casado para objeto|**/
	attr: function(code) {
		const attr = /^\@(?:(?:((?:\w|-)+)\{((?:\\\}|[^}])*)\})+)/;
		const data = /((?:\w|-)+)\{((?:\\\}|[^}])*)\}/g;
		const find = code.match(attr);
		const base = find === null ? "" : find[0].replace(/^\@/, "").replace(/\"/g, `\\"`);
		return {
			find: find === null ? "" : find[0],
			html: base.replace(data, `$1="$2" `).replace(/\\\}/g, "}").trim(),
			json: JSON.parse("{" + base.replace(data, `"$1": "$2",`).replace(/\\\}/g, "}").replace(/\,$/, "") + "}"),
		}
	},
	/**. '{string inner(string code)}: Decodifica o conteúdo textual para código HTML e o retorna.**/
	inner: function(code) {
		const  re = /(?:^|\s)((\&amp\;|'|[a-zA-Z0-9\-]+)\{((?:\\\}|[^}])*)\})(\@.+)?/;
		let inner = code.trim().replace(/\&/g, "&amp;").replace(/\>/g, "&gt;").replace(/\</g, "&lt;");
		while(re.test(inner)) {
			let find = inner.match(re);
			let base = find[1];
			let name = find[2].toLowerCase();
			let text = find[3].replace(/\\\}/g, "}");
			let attr = this.attr(find[4] ? find[4] : "");
			let swap = `${base}${attr.find}`;
			switch(name) {
				case "'":      inner = inner.replace(swap, `<code ${attr.html} translate="no">${text}</code>`); break;
				case "&amp;":  inner = inner.replace(swap, `&${text};`); break;
				case "script": inner = inner.replace(swap, ""); break;
				default:       inner = inner.replace(swap, `<${name} ${attr.html}>${text}</${name}>`);
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

	form: function(body, code) {
		const re   = /^\s*\*\s*([^@]+)(\@\w+\{.*?\}[^\[\(]*)(\[[^\]]*\]|\([^\)]*\))?\s*$/;
		const info = /\@(\w+)\{(.*?)\}/;
		if (!re.test(code)) return false;
		/*-- registrar --*/
		const find = code.match(re);
		const data = {};
		data.label    = find[1].trim().replace(/\s*\*$/, "*");
		data.required = data.label.slice(-1) === "*";
		data.attr     = this.attr(find[2].trim());
		data.main     = find[3] ? find[3] : "()";
		data.multiple = data.main[0] === "[";
		data.info     = find[2].trim().match(info);
		data.type     = data.info[1] ? data.info[1] : "";
		data.name     = !data.info[2] || data.info[2].trim() === "" ? label.replace(/\*+$/, "") : data.info[2].trim();
		data.list     = data.main.slice(1, data.main.length - 1).split(",").map(function(v,i,a) {
			const item  = v.split(":");
			const check = v.trim().slice(-1) === "*"
			return {active: check, value: item[0].trim(), text: item[item.length > 1 ? 1 : 0].trim()};
		});
		//data.value    =
		//data.checked  =
		return data;
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
		/*-- checando legenda --*/
		const caption = /^\s*\|\"\"((?:\"[^"]|\"\"[^|]|[^"])+)\"\"\|\s*$/;
		if (caption.test(code)) {
			const text = code.match(caption)[1].trim();
			elem.createCaption().innerHTML = this.inner(text);
			return true;
		}
		/*-- verificar container --*/
		const tbox = elem.tHead === null ? "head" : "body";
		const trow = document.createElement("tr");
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
	/**. '{boolean scope(node body, string code)}: Checa, adiciona estrutura de blocos e retorna o resultado.**/
	//FIXME não é possível abri o mesmo bloco dentro dele
	scope: function(body, code) {
		/*-- avançando para o último bloco em aberto --*/
		const open = body.querySelector("[data-wd-notation='1']");
		if (open !== null) return this.append(open, code);
		/*-- checando tipo de bloco --*/
		const name = body.tagName.toLowerCase();
		const data = {
			pre:        {start: /^(\s*\'\')/, close: /(\'\'\s*)$/,},
			blockquote: {start: /^(\s*\"\")/, close: /(\"\"\s*)$/,},
			form:       {start: /^(\s*\*\*)/, close: /(\*\*\s*)$/,},
			fieldset:   {start: /^(?:\s*\_\_((?:\_[^_]|[^_])+)\_\_\s*)$/, close: /^(\s*\_\_\s*)$/},
			figure:     {start: /^(?:\s*\=\=((?:\=[^=]|[^=])+)\=\=\s*)$/, close: /^(\s*\=\=\s*)$/},
		};
		for (let tag in data) {
			/*-- abrir bloco --*/
			if (data[tag].start.test(code) && name !== tag && name !== "pre") {
				const find = code.match(data[tag].start);
				const elem = document.createElement(tag);
				elem.dataset.wdNotation = 1;
				body.appendChild(elem);
				if (tag === "fieldset") {
					const legend = document.createElement("legend");
					legend.innerHTML = this.inner(find[1].trim());
					elem.appendChild(legend);
				}
				else if (tag === "figure") {
					const img = document.createElement("img");
					img.src = find[1].trim();
					elem.appendChild(img);
				}

				this.append(elem, code.replace(data[tag].start, ""));
				return true;
			}
			/*-- fechar bloco --*/
			if (data[tag].close.test(code) && name === tag) {
				delete body.dataset.wdNotation;
				this.append(body, code.replace(data[tag].close, ""));
				return true;
			}
		}
		/*-- adicionar dados aos elementos específicos --*/
		if (name === "pre") {
			body.textContent += `${code}\n`;
			return true;
		}
		return false;
	},


	//FIXME alterar e criar:
	//@menu
	//@figure: caminho da imagem
	//@alt: descrição da imagem //figura
	//FIXME mudar para __DOM e __HTML
	//FIXME lembrar que var !== null && typeof var === object não é apenas um objeto, pode ser regex

	/**. '{boolean plus(node body, string code)}: Checa, adiciona estruturas especiais e retorna o resultado.**/
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
		if (this.scope(body, code)) return true;
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