/**

@menu{}label{Capítulos}
@menu{table}label{Tabelas}
@menu{figure}label{Figuras}

#3 Segregando Código
O objeto '{__DOCODE} permite que comentários, ou outras informações delimitadas por caracteres específicos, possam ser segregados do código fonte.
Também contempla a decodificação de uma linguagem de marcação específica em elementos HTML, permitindo, em conjunto com a ferramenta de segregação, a elaboração de instruções do código dentro do próprio código fonte se utilizando dos comentários.

@figure{chrome://branding/content/about-logo.png}caption{Loucura demais}


#4 Regras Gerais
A notação possui as seguintes regras:
+ Há anotações para elementos contínuos, textuais, de bloco e de escopo e para definição de atributos;
+ Linhas sem caracteres imprimíveis são desconsideradas, exceto dentro do escopo de texto pré formatado;
+ Os caracteres &{amp}, &{lt} e &{gt} são tratados como texto, não sendo sensíveis ao código HTML;
+ A notação é definida por caracteres específicos que identificam o tipo de elemento a ser gerado;
+ Cada notação deve estar contida numa única linha, excetos no caso de escopos, que aceitam múltiplas linhas;
+ Se não for identificada nenhuma notação específica, o conteúdo será definido como parágrafo; e
+ Quando a notação estiver compartilhada com o código fonte, os caracteres delimitadores não podem estar contidos em i{strings} ou expressões regulares.

#4 Notação de Atributos
A notação para atributo pode se referir aos atributos HTML do elemento como pode estar vinculada a notações de elementos de bloco.
+ A notação para atributo inicia com o caractere &{#x0040} seguido de uma sequência de nomes e valores;
+ Nomes de atributos podem conter caracteres alfanumérico (minúsculo), sublinhado e traço apenas;
+ Logo após o nome do atributo é definido o seu respectivo valor delimitado pelos caracteres &{#x007B} e &{#x007D};
+ Vários conjuntos de atributos podem ser definidos em sequência, sem espeço entre eles; e
+ Para informar um caractere &{#x007D} como valor do atributo, ele deve ser previamente escapado com &{#x005C}.

#4 Elementos Contínuos
Nesses elementos, a continuidade de uma determinada notação pressupõe a continuidade do seu respectivo elemento.
A notação que identifica o elemento deve estar no início da linha.

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

#4 Elementos de Escopo
Elementos de escopo aceitam múltiplas linhas. A notação de abertura deve estar no início da linha e a de fechamento no fim da linha.
- O escopo de u{citação} inicia e termina com um duplo caracter &{#x0022};
- O escopo de u{texto pré formatado} inicia e termina com um duplo caracter &{#x0027};
- O escopo de u{formulário} inicia e termina com um duplo caracter &{#x002A};
- Os dados para submissão do formulários devem ser inseridos num campo do tipo '{submit} ou '{image};
- O escopo de u{agrupamento de campos} inicia com o nome da legenda delimitado por um duplo caractere &{#x005F};
- O escopo de u{agrupamento de campos} termina com um duplo caracter &{#x005F};
- É possível a um escopo conter um escopo de outro tipo, exceto o de texto pré formatado; e
- Os escopos de texto pré formatado e citação podem conter conteúdo após ou antes dos caracteres delimitadores, respecitvamente;

#4 Elementos Textuais (em linha)
Os elementos textuais são informados dentro do conteúdo textual e tem por objetivo aplicar determinado comportamento a um fragmento textual.
+ Elementos textuais são identificados pelo respectivo nome (i{tag} HTML) seguido de seu conteúdo textual delimitado pelos carateres &{#x007B} e &{#x007D};
+ Os atributos podem ser definidos posteriormente ao acréscimo do caractere &{#x007D} logo após ao texto (sem espaço);
+ Não é possível definir filhos aos elementos textuais;
+ Qualquer tipo de elemento pode ser definido, exceto '{script}, inclusive elementos de bloco, mesmo não fazendo sentido ao conteúdo; e
+ Os seguintes atalhos podem ser utilizados em substituição ao nome do elemento
|""Tabela de atalhos para alguns componentes em HTML""|
|Caractere|Descrição|
|&{#x0027}|Atalho para o elemento '{code}|
|&|Atalho para caracteres especiais do tipo i{&#x003B;}|

#4 Elementos de Bloco
	Exceto pelos cabeçalhos, esses elementos são definidos utilizando a notação de atributos, cujo primeiro par nome/valor define o tipo de elemento e uma de suas características, devendo ser único na linha. Atributos específicos podem existir, não correspondendo necessariamente ao mesmo objetivo do atributo HTML de mesmo nome.
	O elementos de bloco não ocuparão necessariamente um espaço vertical isoladamente com ocorre com um elemento '{div}, por exemplo.

#5 Títulos/Cabeçalhos
	Os títulos ou cabeçalhos são identificados pelo caractere &{#x0023} seguido do nível (1-6), de um espaço em branco e seu conteúdo.

#5 Campos de Formulários
	Na notação de campo de formulário, o primeiro atributo deve ser nomeado como '{input}, mesmo se o elemento for um '{textarea}, '{select} ou '{button}, e seu valor corresponde ao rótulo do campo. A notação possui os seguintes atributos específicos:
	- O atributo '{type} identifica o tipo do campo, incluindo os valores '{textarea} e '{select};
	- O atributo '{list} descreve uma lista de opções, sendo aplicado aos campos '{select} e '{input}, se previsto;
	- A lista de opções consiste em uma sequência de valores e rótulos separados pelo caractere ${#x002C};
	- O valor e seu respectivo rótulo são separados pelo caractere ${#x00#A} que, se inexistente, assumirá que o rótulo e o valor possuem a mesma informação; e
	- Os demais atributos atendem às respetivas correspondências em HTML.

#5 Figura, Áudio e Vídeo
	Na notação para u{figuras}, o primeiro atributo deve ser nomeado como '{figure} e seu valor corresponde ao endereço da imagem ('{src}). A notação possui os seguintes atributos específicos:
	- O atributo '{alt} é utilizado para descrever textualmente a imagem;
	- O atributo '{caption} é utilizado para descrever a legenda da figura; e
	- Não há outros atributos possíveis.
	Na notação para áudio e vídeo, o primeiro atributo deve ser nomeado como '{audio} ou '{video}, conforme o caso, e seu valor corresponde ao endereço da mídia ('{src}). Não há outros atributos possíveis.

#5 Menu
	Na notação para u{menu}, o primeiro atributo deve ser nomeado como '{menu} e seu valor vai indicar o objetivo:
	- O valor '{figure} indica que é um menu destinado a figuras;
	- O valor '{table} indica que é um menu destinado a tabelas; e
	- Outros valores indicam que se destina a cabeçalhos.
	Há também o atributo '{label}, que define um rótulo para o menu. Os elementos listados no menu correspondem àqueles criados após a sua definição.

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
**
...
**

Figura, Áudio, Vídeo e menu
	@figure{imagem.jpeg}alt{Uma imagem do sol}caption{Imagem vencedora do concurso de 2015}
	@audio{musica.mp3}
	@video{filme.mp3}
	@menu{}head{Capítulos}

Campos de Formulários
	@input{Nome}type{text}name{nome}
	@input{Idade}type{number}name{idade}min{18}max{80}step{1}
	@input{Estatura}type{select}name{estatura}list{-1: Baixa, 0: Média, 1: Alta}
	@input{Aceita Condições}type{checkbox}name{aceite}value{1}checked{}
	@input{OK}type{submit}formaction{cadastro.php}formmethod{POST}

Elemento Textuais:
Esta u{frase} contém uma '{palavra}@class{style}id{abc}] sublinhada. &{#x270E}

Equivale a
Esta <u>frase<u> contém uma <code class="style" id="abc">palavra</code> sublinhada. &#x270E;
''
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
		const attr = /^\@(?:(?:([a-z0-9_\-]+)\{((?:\\\}|[^}])*)\})+)/;
		const data = /((?:\w|-)+)\{((?:\\\}|[^}])*)\}/g;
		const find = code.match(attr);
		const base = find === null ? "" : find[0].replace(/^\@/, "").replace(/\"/g, `\\"`);
		return {
			find: find === null ? "" : find[0],
			html: base.replace(data, `$1="$2" `).replace(/\\\}/g, "}").trim(),
			json: JSON.parse("{" + base.replace(data, `"$1": "$2",`).replace(/\\\}/g, "}").replace(/\,$/, "") + "}"),
			list: JSON.parse("[" + base.replace(data, `{"name": "$1","value":"$2"},`).replace(/\\\}/g, "}").replace(/\,$/, "") + "]"),
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
	/**. '{node input(node body, object attr)}: Checa, adiciona estrutura de campos de formulários e retorna o resultado.**/
	input: function(body, attr) {
		/*-- dados do elemento --*/
		const tags = {textarea: "textarea", select: "select", button: "button", submit: "button", reset: "button"};
		const type = "type" in attr.json ? attr.json.type.toLowerCase().trim() : "text";
		const tag  = type in tags ? tags[type] : "input";
		const text = attr.list[0].value.trim();
		const list = !("list" in attr.json) ? [] : attr.json.list.split(",").map(function(v,i,a) {
			const data       = v.split(":");
			const item       = document.createElement("option");
			item.value       = data[0].trim();
			item.textContent = data.length > 1 ? data[1].trim() : item.value;
			item.selected    = item.value === String(attr.json.value).trim();
			return item;
		});
		/*-- eliminando propriedades automáticas --*/
		delete attr.json[attr.list[0].name];
		delete attr.json.list;
		delete attr.json.type;
		/*-- elementos básicos --*/
		const elem  = document.createElement(tag);
		const label = document.createElement("label");
		const span  = document.createElement("span");
		/*-- propriedades --*/
		span.textContent = text;
		label.appendChild(span);
		if (type !== "textarea" && type !== "select")
			elem.type = type
		/*-- botões --*/
		if (["button", "submit", "reset"].indexOf(type) >= 0) {
			elem.textContent = text;
			body.appendChild(elem);
		}
		else if (type === "image") {
			elem.setAttribute("aria-label", text);
			body.appendChild(elem);
		}
		else if (type === "select") {
			list.forEach(function(v,i,a) {elem.appendChild(v);});
			label.appendChild(elem);
			body.appendChild(label);
		}
		else if (type === "radio" || type === "checkbox") {
			label.insertBefore(elem, span);
			body.appendChild(label);
		}
		else {
			if (list.length > 0 && ["hidden", "password", "color", "textarea"].indexOf(type) < 0) {
				const data = document.createElement("datalist");
				list.forEach(function(v,i,a) {data.appendChild(v);});
				data.id = __ID.value;
				elem.setAttribute("list", data.id);
				body.appendChild(data);
			}
			label.appendChild(elem);
			body.appendChild(label);
		}
		/*-- definindo atributos --*/
		for (let i in attr.json)
			elem.setAttribute(i, attr.json[i]);
		elem.id = __ID.id(elem);
		label.setAttribute("for", elem.id);
		return true;
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
				Array.from(body.querySelectorAll(`menu[data-docode-menu="head"]`)).forEach(function(v,i,a) {
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
		elem.id    = __ID.id(elem);
		/*-- checando legenda --*/
		const caption = /^\s*\|\"\"((?:\"[^"]|\"\"[^|]|[^"])+)\"\"\|\s*$/;
		if (caption.test(code)) {
			const text = code.match(caption)[1].trim();
			const item = document.createElement("li");
			const link = document.createElement("a");
			if (text !== "") {
				elem.createCaption().textContent = text;
				item.appendChild(link);
				link.href = `#${elem.id}`;
				link.textContent = text;
				Array.from(body.querySelectorAll(`menu[data-docode-menu="table"]`)).forEach(function(v,i,a) {
					v.appendChild(item.cloneNode(true));
				});
			}
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
	//FIXME lembrar que var !== null && typeof var === object não é apenas um objeto, pode ser regex
	/**. '{boolean block(node body, string code)}: Checa, adiciona estruturas de bloco e retorna o resultado.**/
	block: function(body, code) {
		const attr = this.attr(code.trim());
		if (attr.list.length === 0) return false;
		/*-- menu --*/
		if (attr.list[0].name === "menu") {
			const menu = document.createElement("menu");
			const head = document.createElement("h3");
			const type = attr.list[0].value.trim().toLowerCase();
			if ("label" in attr.json && attr.json.label.trim() !== "") {
				head.textContent = attr.json.label.trim();
				head.id          = __ID.value;
				menu.setAttribute("aria-labelledby", head.id);
				body.appendChild(head);
			}
			menu.dataset.docodeMenu = (type === "table" || type === "figure") ? type : "head";
			body.appendChild(menu);
			return true;
		}
		/*-- figure --*/
		if (attr.list[0].name === "figure") {
			const text          = "caption" in attr.json ? this.inner(attr.json.caption.trim()) : "";
			const figure        = document.createElement("figure");
			const img           = document.createElement("img");
			img.src             = attr.list[0].value;
			img.alt             = "alt" in attr.json ? attr.json.alt.trim() : "";
			figure.id           = __ID.value;
			figure.appendChild(img);
			body.appendChild(figure);
			/*-- legenda --*/
			if (text !== "") {
				const caption = document.createElement("figcaption");
				const item    = document.createElement("li");
				const link    = document.createElement("a");
				caption.textContent = text;
				figure.appendChild(caption);
				item.appendChild(link);
				link.href = `#${figure.id}`;
				link.textContent = text;
				Array.from(body.querySelectorAll(`menu[data-docode-menu="figure"]`)).forEach(function(v,i,a) {
					v.appendChild(item.cloneNode(true));
				});
			}
			return true;
		}
		if (attr.list[0].name === "audio" || attr.list[0].name === "video") {
			const midia    = document.createElement(attr.list[0].name);
			midia.src      = attr.list[0].value;
			midia.controls = true;
			body.appendChild(midia);
			return true;
		}

		if (attr.list[0].name === "input") {
			return this.input(body, attr);
		}



		/*if (find[1].toLowerCase() === "file" && find[2] !== undefined && find[3] !== undefined) {
			const elem = __FILE.frame(find[2], find[2].match(file)[1], find[3]);
			body.appendChild(elem);
			return true;
		}*/

		return false;
	},
	/**. '{boolean append(node body, string code)}: Checa, adiciona estruturas e retorna o resultado.**/
	append: function(body, code) {
		/*-- text precisa ser o primeiro --*/
		if (this.scope(body, code)) return true;
		if (this.list(body, code))  return true;
		if (this.table(body, code)) return true;
		if (this.head(body, code))  return true;
		if (this.block(body, code)) return true;
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
		Array.from(body.querySelectorAll("menu[data-docode-menu]")).forEach(function(v,i,a) {
			delete v.dataset.docodeMenu;
		});
		return;
	},
};