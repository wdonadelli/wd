/**
# Comentários Informativos
## O Guia no Código Fonte

Trata-se de um ''script'' escrito em JavaScript com o propósito de transformar comentários inseridos no código em um documento de texto a respeito do próprio código, reaproveitando informações.

Ao construir o código fonte, é recomendável que seja realizado comentários esclarecendo sobre as funcionalidades, objetivos e especifidades de cada construção interna criada para fazer com que seu código alcance sue propósito. Tal atitute possibilita mecanismos facilitadores para promover futuras manutenções e direcionar como a ferramenta funciona.

Às vezes, faz-se necessário a contrução de um manual ou guia para orientar o uso da ferramenta. Se o código estiver bem comentado, bastaria reaproveitar essas informações para a criação desse guia. O objetivo, portanto, seria capturar esses comentários e transformá-los em material de leitura, dispensando a escrita de material extra, sendo essa a proposta deste ''script''.

Para cuprir tal, se faz necessário estabelecer caracteres especiais para diferenciar os comentários a serem reaproveitados no guia daqueles detalhamentos específicos de determinado local do código e também para estabelecer formatações que possibilitem organizar o material a ser construído.

###### Menu
@menu


### Dos Comentários

Cada linguagem possui caracteres especiais para definir a abertura ou o fechamento de comentários no código.

Para diferenciar um comentário de um ponto específico do código daquele a ser capturado para construção do documento, os caracteres que definem o comentário na linguagem devem sofrer uma pequena modificação.

Seguem abaixo os tipos de comentários e suas modificações para os fins do presente ''script'':

|Padrão|Abertura|Encerramento|
|&sol;&ast;comentário&ast;&sol;|&sol;&ast;&ast;|&ast;&ast;&sol;|
|&lt;&excl;&dash;&dash;comentário&dash;&dash;&gt;|&lt;&excl;&dash;&dash;&dash;|&dash;&dash;&dash;&gt;|
|&num;comentário|&num;&num;|Não há|
|&dash;&dash;comentário|&dash;&dash;&dash;|Não há|

A coluna ''Padrão'' apresenta o modelo de comentário de determinada linguagem. As colunas ''Abertura'' e ''Encerramento'' definem a modificação necessária para delimitar o início e fim do conteúdo a ser capturado.

O ''script'' realizará a análise por linha do código fonte. Na linguagem oque possuir bloco de comentários, após a abertura da captura, enquanto não forem informados os caracteres de encerramento, a linha será continuará a ser capturada.

Para as linguagens que não contém bloco de comentários, cada linha a ser capturada deverá conter os caracters de abertura.

Os caracteres de abertura e encerramento, se existente, deverão estar, respectivamente, no início e no fim da linha.

### Dos Elementos Textuais e de Blocos

A ferramenta utiliza uma notação específica para definir elementos de blocos e em linha, semelhante ao que ''Markdown'' disponibiliza, para economizar caracteres na escrita.

Os seguintes atalhos são utilizados para especificar elementos em linha:

|Estrutura|HTML|Renderização|
|&bprime;&bprime;code&bprime;&bprime;|&lt;code&gt;code&lt;/code&gt;|``code``|
|&ast;&ast;strong&ast;&ast;|&lt;strong&gt;strong&lt;/strong&gt;|**strong**|
|&apos;&apos;em&apos;&apos;|&lt;em&gt;em&lt;/em&gt;|''em''|
|&lowbar;&lowbar;u&lowbar;&lowbar;|&lt;u&gt;u&lt;/u&gt;|__u__|
|&lsqb;link&rsqb;&lt;alvo&gt;|&lt;a href="alvo" target="_blank" &gt;link&lt;/a&gt;|[link]<#alvo>|

Com excessão do elemento de ''hiperlink'', todos são compostos por duplos caracteres inseridos antes e após ao trecho que se pretende formatar.

No caso do elemento de ''hiperlink'', o conteúdo de ''link'' é opcional e, se não informado, exibirá seu endereço (''alvo'').

$
$ Para nomear uma função em ''JavaScript'', basta escrever seu nome __logo após__ a paravra chave ``function``, separados por **espaço** (veja mais em []<https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions>).

O fragmento acima geraria a seguinte visualização:

Para nomear uma função em ''JavaScript'', basta escrever seu nome __logo após__ a paravra chave ``function``, separados por **espaço** (veja mais em []<https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions>).

Os elementos de bloco são definidos a partir de caracteres especiais informados no início de cada linha seguido de seu conteúdo, podendo haver, em alguns casos, a necessidade de inserir um espaço em branco antes do conteúdo.

### Do Bloco de Citação

O bloco de citação deve iniciar e terminar com o caractere &quot;.

$
$"Esse é um bloco de citação longa. Utilize **aspas duplas** para delimitar seu conteúdo."

O fragmento acima geraria a seguinte visualização:

"Esse é um bloco de citação longa. Utilize **aspas duplas** para delimitar seu conteúdo."

### Do Bloco de Código

O bloco de código deve iniciar com o caractere &dollar;, seguido de seu conteúdo, para cada linha do código.

A primeira linha do código deverá ser utilizada para definir as palavras chaves a serem destacadas, não sendo renderizado seu conteúdo.

$
$$let function return
$$let dobro = function(x) {
$$	return 2*x;
$$}


O fragmento acima geraria a seguinte visualização:

$let function return
$let dobro = function(x) {
$	return 2*x;
$}

### Da Listagem

Os itens da lista devem iniciar com o caractere &dash; no início da linha seguido de um espaço em branco e seu conteúdo.

Para informar subitens, deverá ser acrescido um novo caracteres &dash; ao lado do primeiro.

$
$- Item 1
$- Item 2
$-- Item 2.1
$-- Item 2.2
$- Item 3

O fragmento acima geraria a seguinte visualização:

- Item 1
- Item 2
-- Item 2.1
-- Item 2.2
- Item 3

### Da Lista de Descrição

Os itens da lista são informados inserindo o caractere &period; seguido de um espaço em branco no início da linha.

Para informar subitens, deverá ser acrescido um novo caracteres &period; ao lado do primeiro.

Para criar um conjunto ''nome/valor'' na lista de descrição, fazendo referência a um objeto JavaScript (``{nome: valor}``), deve-se separar o conteúdo com o caractere &colon; seguido de um espaço em branco. O valor inserido antes do caractere será definido como ''nome'' e o conteúdo posterior será o ''valor''. Se não houver conteúdo posterior, será definido como ''valor''.

$
$. **Nome 1**: ''Valor 1.1''
$. ''Valor 1.2''
$. **Nome 2**: ''Valor 2.1''
$.. **Nome 2.1**: ''Valor 2.1.1''
$.. ''Valor 2.1.2''
$. **Nome 3**: ''Valor 3.1''

O fragmento acima, cujo nome está em negrito e o valor em itálico por conveniência, geraria a seguinte visualização:

. **Nome 1**: ''Valor 1.1''
. ''Valor 1.2''
. **Nome 2**: ''Valor 2.1''
.. **Nome 2.1**: ''Valor 2.1.1''
.. ''Valor 2.1.2''
. **Nome 3**: ''Valor 3.1''


### Da Tabela

Para definir uma linha de tabela e suas colunas, utiliza-se o caractere &verbar;. A linha deve iniciar e terminar com o caracteres..

A primeira linha será tratada como linha de título.

$
$|Coluna 1|Coluna 2|Coluna 3|
$|Célula 1.1|Célula 1.2|Célula 1.3|
$|Célula 2.1|Célula 2.2|Célula 2.3|
$|Célula 3.1|Célula 3.2|Célula 3.3|

O fragmento acima geraria a seguinte visualização:

|Coluna 1|Coluna 2|Coluna 3|
|Célula 1.1|Célula 1.2|Célula 1.3|
|Célula 2.1|Célula 2.2|Célula 2.3|
|Célula 3.1|Célula 3.2|Célula 3.3|


### Dos Títulos/Capítulos

Os títulos/capítulos são definidos incluindo o caractere &num; no início da linha, seguido de um espaço em branco e o título.

A quantidade de caracteres indica a hierarquia do título, quanto menor o número de caracteres, maior a hierarquia:

|Quantidade de &num;|Nível|
|1|Título|
|2|Sub Título|
|3|Capítulo (nivel 1)|
|4|Capítulo (nivel 2)|
|5|Capítulo (nivel 3)|
|6|Capítulo (nivel 4)|


### Do Menu

É possível inserir um menu ao documento incluindo uma linha com o termo ''&commat;menu''.

O menu gerará uma listagem com os links para os capítulos de nível primário.

### Do Parágrafo

Se nenhuma das situações de bloco forem encontradas, a linha será considerada como um parágrafo simples.


### Da Manutenção do Ferramenta

A partir de agora, será tratada a questão do código da ferramenta para fins de manutenção.

#### Do Construtor

O construtor é definido da seguinte forma:

$string
$Manual(string texto)

Onde o argumento ``texto`` recebe o conteúdo do código fonte a ser analisado.

#### Dos Métodos e Atributos**/
function Manual(texto) {
		if (!(this instanceof Manual)) return new Manual(texto);
		Object.defineProperties(this, {
			_linhas: {value: texto.split("\n")     },         /* lista com as linhas do código fonte */
			_linha:  {value: null,   writable: true},         /* linha individual do código fonte */
			_item:   {value: 0,      writable: true},         /* índice da linha individual do código fonte */

			_tipo:   {value: null,   writable: true},         /* Registra o tipo de comentário # /* <! */
			_tag:    {value: false,  writable: true},         /* indica se a tag de marcação está aberta */

			_fonte:  {value: [],     writable: true},         /* registra o código fonte */
			_manual: {value: document.createElement("MAIN")}, /* registra a raiz do manual */
			_aberto: {value: null,   writable: true},         /* registra o último elemento aberto */
			_menu:   {value: document.createElement("UL")},   /* registra os títulos para menu */

		});

		/* definindo o tipo de comentário */
		let i = -1;
		while (++i < this._linhas.length) {
			let linha = this._linhas[i].trim();
			if ((/^\#/).test(linha))   this._tipo = "hash";
			if ((/^\-\-/).test(linha)) this._tipo = "sql";
			if ((/^\<\!/).test(linha)) this._tipo = "html";
			if ((/^\/\*/).test(linha)) this._tipo = "main";
			if ((/^\/\//).test(linha)) this._tipo = "main";
			if (this._tipo !== null)   break;
		}
		if (this._tipo === null)
			this.erro("Modelo de comentário não identificado.");
		/* definindo o bloco principal */
		this._aberto = this._manual;
		/* executando a montagem do manual */
		this.executar();
	}

	Object.defineProperties(Manual.prototype, {
		constructor: {value: Manual},
		/**. ``''objeto'' _tags``: Registra as tags de abertura e encerramento dos comentários.
		**/
		_tags: {
			value: {
				hash: {abrir: /^(\s+)?\#\(/,       fechar: /.$/     },
				sql:  {abrir: /^(\s+)?\-\-\-/,     fechar: /.$/   },
				html: {abrir: /^(\s+)?\<\!\-\-\-/, fechar: /\-\-\-\>(\s+)?$/ },
				main: {abrir: /^(\s+)?\/\*\*/,     fechar: /\*\*\/(\s+)?$/   },
			}
 		},
		/**. ``''html'' caixa``: Define ou retorna o elemento HTML aberto para fins de decidir onde inserir determinados blocos.**/
		caixa: {
			get: function()  {return this._aberto;},
			set: function(x) {this._aberto = x;}
		},
		/**. ``''string'' tagCaixa``: Retorna a ''tag'', em maiúsculo, do elemento retornado em ``caixa``.**/
		tagCaixa: {
			get: function() {return this.caixa.tagName.toUpperCase();}

		},
		/**. ``''integer'' nivel``: Retorna o número de elementos de mesmo tipo de ``caixa``, a partir de zero, do mais interno para o externo.**/
		nivel: {
			get: function() {
				let i   = 0;
				let tag = this.tagCaixa;
				let pai = this.caixa.parentElement;
				let avo = pai === null ? null : pai.parentElement;
				while (avo !== null && avo.tagName.toUpperCase() === tag) {
					pai = avo.parentElement;
					avo = pai === null ? null : pai.parentElement;
					i++;
				}
				return i;
			}
		},
		/**. ``''string'' ultimo``: Retorna o último filho de ``caixa``, ou ``null`` se inexistente.**/
		ultimo: {
			get: function() {
				let filhos = this.caixa.children;
				if (filhos.length === 0) return null;
				return filhos[filhos.length - 1];
			}
		},
		/**. ``''string'' tagUltimo``: Retorna a ''tag'', em maiúsculo, do elemento retornado em ``ultimo``, ou ``null`` se inexistente.**/
		tagUltimo: {
			get: function() {
				let ultimo = this.ultimo;
				return ultimo === null ? null : ultimo.tagName.toUpperCase();
			}
		},
		/**. ``''string'' texto(''string'' valor, ''string'' chaves)``: Retorna o código HTML a ser aplicado para fins do bloco de código (ver método ``PRE``).
		. O argumento `valor` é o conteúdo da linha linha e o argumento opcional `chaves` é as palavras chaves definidas.**/
		texto: {
			value: function(valor, chaves) {
				chaves = chaves === undefined ? "" : chaves.replace(/\s+/g, " ").trim();
				chaves = chaves === "" ? [] : chaves.split(" ");
				/* substituir & por &amp; */
				valor = valor.replace(/\&/g, "&amp;")
				/* substituir ` por &bprime; */
				valor = valor.replace(/\`/g, "&bprime;");
				/* substituir < por &lr; e > por &gt; */
				valor = valor.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
				/* substituir o conteúdo entre aspas por var */
				valor = valor.replace(/\"([^\"]+)\"/, "\"<var>$1</var>\"");
				/* substituir palavras chaves por negrito: começo, fim, só e no meio */
				if (chaves === undefined) return valor;

				for (let i = 0; i < chaves.length; i++) {
					let chave  = chaves[i].trim().replace(/(\W)/g, "\\$1");
					let antes  = "([^A-Za-z_\"])";
					let depois = "([^A-Za-z0-9_\"])";
					let regex1 = new RegExp("^("+chave+")"+depois);
					let regex3 = new RegExp(antes+"("+chave+")$");
					let regex4 = new RegExp("^("+chave+")$");
					let regex2 = new RegExp(antes+"("+chave+")"+depois, "g");
					valor      = valor.replace(regex1, "<b>$1</b>$2");
					valor      = valor.replace(regex2, "$1<b>$2</b>$3");
					valor      = valor.replace(regex3, "$1<b>$2</b>");
					valor      = valor.replace(regex4, "<b>$1</b>");
				}
				return valor;
			}
		},
		/**. ``''string'' html(''string'' valor)``: Retorna o código HTML a ser aplicado para fins de formatação em linha.
		. O argumento valor é o conteúdo da linha.**/
		html: {
			value: function(valor) {
				let destaques = [
	 				{re: /\`\`([^`]+)\`\`/,          rp: "<code>$1</code>"},
					{re: /\*\*([^*][^*]+)\*\*/,      rp: "<strong>$1</strong>"},
					{re: /\'\'([^'][^']+)\'\'/,      rp: "<em>$1</em>"},
					{re: /\_\_([^_][^_]+)\_\_/,      rp: "<u>$1</u>"},
					{re: /\[([^\]]+)\]\<([^<>]+)\>/, rp: "<a href=\"$2\" target=\"_blank\">$1</a>"},
					{re: /\[\]\<([^<>]+)\>/,         rp: "<a href=\"$1\" target=\"_blank\">$1</a>"},
					{re: /\(([^\)]+)\)\<([^<>]+)\>/, rp: "<figure><img src=\"$2\" alt=\"$1\" /></figure>"},
					{re: /\(\)\<([^<>]+)\>/,         rp: "<figure><img src=\"$1\" /></figure>"}
	 			];

				let i = -1;
				while (++i < destaques.length) {
					let re  = destaques[i].re;
					let rp  = destaques[i].rp;
					let tag = destaques[i].tag;
					while (re.test(valor)) {
						if (tag === "code") {
							let base  = valor.match()[1];
							let code  = this.codigos(base);
							let velho = "`"+base+"`";
							let novo  = "`"+code+"`";
							valor     = valor.replace(base, code);
						}
						valor = valor.replace(re, rp);
					}
				}
				return valor;
			}
		},
		/**. ``''html'' criar(''string'' tag, ''string'' texto)``: Retorna o elemento HTML especicado no argumento ``tag``.
		 . O argumento opcional ``texto`` tem o propósito de definir o HTML ao elemento criado chamando e aplicando o resultado do método ``html``.**/
		criar: {
			value: function(tag, texto) {
				let html = document.createElement(tag.toLowerCase());
				if (typeof texto === "string")
					html.innerHTML = this.html(texto);
				return html;
			}
		},
		/**. ``''void'' erro(''string'' mensagem)``: Método que força um erro com a mensagem definida no argumento.**/
		erro: {
			value: function(mensagem) {
				let erro = "Erro: "+mensagem+" (linha "+this._item+")\n\t"+this._linha;
				//if (mensagem) throw new Error(erro);
			}
		},
		/**. ``''boolean'' protocolar()``: Retorna verdadeiro se a captura de comentário está aberta para a linha.**/
		protocolar: {
			value: function() {
				let linha   = this._linha.trim();
				let abrir   = this._tags[this._tipo].abrir;
				if (abrir.test(linha)) this._tag = true;
				return this._tag;
			}
		},
		/**. ``''void'' despachar()``: Análisa o fechamento da captura do comentário e despacha para a próxima linha do código fonte.**/
		despachar: {
			value: function() {
				let linha  = this._linha.trim();
				let fechar = this._tags[this._tipo].fechar;
				if (fechar.test(linha)) this._tag = false;
				this._item++;
			}
		},
		/**. ``''boolean'' P(''string'' linha)``: Retorna verdadeiro se a ``linha`` for diferente de vazio, adicionando um parágrafo ao último elemento retornado pelo atributo ``caixa``.**/
		P: {
			value: function(linha) {
				if (linha.trim() === "") return false;
				let novo = this.criar("P", linha.trim());
				this.caixa.appendChild(novo);
				return true;
			}
		},
		/**. ``''boolean'' H(''string'' linha)``: Retorna verdadeiro se ``linha`` for um bloco de cabeçalho, adicionado um título ou capítulo à árvore principal.**/
		H: {
			value: function(linha) {
				let id = /^(\#+)\s/;
				if (!id.test(linha.trim())) return false;

				let valor  = linha.trim().replace(id, "").trim();
				let nivel  = linha.trim().split(/\s/)[0].length;
				let titulo = this.criar("H"+nivel, valor);
				let ID     = wd(valor).camel;
				titulo.id  = ID;
				if (nivel === 3) {
					let link = this.criar("A", valor);
					let item = this.criar("LI");
					link.href = "#"+ID;
					item.appendChild(link);
					this._menu.appendChild(item);
				}
				this._manual.appendChild(titulo);
				this.caixa = this._manual;
				return true;
			}
		},
		/**. ``''boolean'' MENU(''string'' linha)``: Retorna verdadeiro se ``linha`` for um bloco de menu, adicionando uma lista de capítulos à árvore principal**/
		MENU: {
			value: function(linha) {
				let id = /^\@menu$/;
				if (!id.test(linha.trim())) return false;
				this._manual.appendChild(this._menu);
				this.caixa = this._manual;
				return true;
			}
		},
		/**. ``''boolean'' BLOCKQUOTE(''string'' linha)``: Retorna verdadeiro se ``linha`` for um bloco de citação, adicionando uma citação ao elemento retornado pelo atributo ``caixa``.**/
		BLOCKQUOTE: {
			value: function(linha) {
				let id = /^\"(.+)\"$/;
				if (!id.test(linha.trim())) return false;

				let valor = linha.trim().replace(id, "$1");
				let caixa = this.caixa;
				if (this.tagUltimo === "BLOCKQUOTE") {
					this.caixa = this.ultimo;
				} else {
					let novo = this.criar("BLOCKQUOTE");
					caixa.appendChild(novo);
					this.caixa = novo;
				}
				this.analisar(valor);
				this.caixa = caixa;
				return true;
			}
		},
		/**. ``''boolean'' PRE(''string'' linha)``: Retorna verdadeiro se ``linha`` for um bloco de código, adicionando um bloco específico ao elemento retornado pelo atributo ``caixa``.**/
		PRE: {
			value: function(linha) {
				let id = /^\$/;
				if (!id.test(linha.trim())) return false;
				let valor = linha.trim().replace(id, "");
				if (this.tagUltimo === "PRE") {
					let codigo = this.texto(valor, this.ultimo.dataset.chaves);
					let quebra = this.ultimo.innerHTML === "" ? "" : "\n";
					this.ultimo.innerHTML += quebra+codigo;
				} else {
					let novo = this.criar("PRE");
					novo.dataset.chaves = valor.replace(/\s+/, " ").trim();
					novo.className = "wd-code";//FIXME
					this.caixa.appendChild(novo);
				}
				return true;
			}
		},
		/**. `''boolean'' TABLE(''string'' linha)`: Retorna verdadeiro se ``linha`` for um bloco de tabela, adicionando uma linha de tabela ao elemento retornado pelo atributo ``caixa``.**/
		TABLE: {
			value: function(linha) {
				let id = /^\|(.+)\|$/;
				if (!id.test(linha.trim())) return false;

				let valor  = linha.trim().replace(id, "$1").split("|");
				let celula = this.tagUltimo === "TABLE" ? "TD" : "TH";
				let tr     = this.criar("TR");
				let caixa  = this.caixa;

				if (this.tagUltimo === "DL") {//FIXME
					this.caixa = this.ultimo;
					while (this.caixa.children.length !== 0) {
						let index  = this.caixa.children.length - 1;
						this.caixa = this.caixa.children[index];
					}
				}
				if (this.tagUltimo === "TABLE") {
					this.caixa = this.ultimo.tBodies[0];
				} else {
					let novo = this.criar("TABLE");
					let head = this.criar("THEAD");
					let body = this.criar("TBODY");
					caixa.appendChild(novo);
					novo.appendChild(head);
					novo.appendChild(body);
					novo.border = 1;
					this.caixa = head;
				}

				for (let i = 0; i < valor.length; i++) {
					let texto = this.criar(celula, valor[i]);
					tr.appendChild(texto);
				}
				this.caixa.appendChild(tr);
				this.caixa = caixa;
				return true;
			}
		},
		/**. ``''boolean'' UL(''string'' linha)``: Retorna verdadeiro se ``linha`` for um bloco de listagem, adicionando um item ao elemento retornado pelo atributo ``caixa``.**/
		UL: {
			value: function(linha) {
				let id = /^(\-+)\s?/;
				if (!id.test(linha.trim())) return false;

				let valor = linha.trim().replace(id, "").trim();
				let nivel = linha.trim().split(/\s/)[0].length - 1;
				let caixa = this.caixa;
				let item  = this.criar("LI");
				let span  = this.criar("SPAN", valor);
				item.appendChild(span);

				if (this.tagUltimo === "UL") {
					this.caixa = this.ultimo;//ul
					while (nivel > this.nivel) {
						this.caixa = this.ultimo;
						/* checar se tem um UL dentro do último LI */
						if (this.tagUltimo === "UL") {
							this.caixa = this.ultimo;//ul
						} else {
							nivel = -1;
							let novo = this.criar("UL");
							this.caixa.appendChild(novo);
							this.caixa = novo;
						}
					}
					this.caixa.appendChild(item)
					this.caixa = caixa;
				} else {
					/* se o último elemento não for um UL, criá-lo */
					let novo = this.criar("UL");
					this.caixa.appendChild(novo);
					novo.appendChild(item);
				}
				return true;
			}
		},
		/**. ``''boolean'' DL(''string'' linha)``: Retorna verdadeiro se ``linha`` for um bloco de lista de descrição, adicionando um título ou uma descrição ao elemento retornado pelo atributo ``caixa``.**/
		DL: {
			value: function(linha) {
				let id = /^(\.+)\s/;
				if (!id.test(linha.trim())) return false;

				let re    = /^([^:]+)\: (.+)$/;
				let valor = linha.trim().replace(id, "").trim();
				let nivel = linha.trim().split(/\s/)[0].length - 1;
				let caixa = this.caixa;
				let dt    = null;
				let dd    = this.criar("DD", valor);
				if (re.test(valor)) {
					dt = this.criar("DT", valor.replace(re, "$1"));
					dd = this.criar("DD", valor.replace(re, "$2"));
				}

				if (this.tagUltimo === "DL") {
					this.caixa = this.ultimo;
					while (nivel > this.nivel) {
						this.caixa = this.ultimo;
						/* checar se tem um DL dentro do último DD */
						if (this.tagUltimo === "DL") {
							this.caixa = this.ultimo;//ul
						} else {
							nivel = -1;
							let novo = this.criar("DL");
							this.caixa.appendChild(novo);
							this.caixa = novo;
						}
					}
					if (dt !== null)
						this.caixa.appendChild(dt);
					this.caixa.appendChild(dd);
					this.caixa = caixa;
				} else {
					/* se o último elemento não for um UL, criá-lo */
					let novo = this.criar("DL");
					this.caixa.appendChild(novo);
					if (dt !== null)
						novo.appendChild(dt);
					novo.appendChild(dd);
				}
				return true;
			}
		},
		/**. ``''void'' analisar(''string'' linha)``: Analisa a marcação de cada `linha` do arquivo, identificar o bloco e manda executar.**/
		analisar: {
			value: function (linha) {
				if (this.PRE(linha))        return;
				if (this.BLOCKQUOTE(linha)) return;
				if (this.UL(linha))         return;
				if (this.DL(linha))         return;
				if (this.TABLE(linha))      return;
				if (this.H(linha))          return;
				if (this.MENU(linha))       return;
				this.P(linha);
				return;
			}
		},
		/**. ``''void'' executar()``: Decide sobre sobre encaminhamento da análise de cada linha.**/
		executar: {
			value: function() {
				while (this._item < this._linhas.length) {
					this._linha = this._linhas[this._item];

					/* protocolo negado: capturar como código de programação ---------- */
					if (!this.protocolar()) {
						this._fonte.push(this._linha);
					}
					/* Protocolo aberto: capturar dados do manual --------------------- */
					else {
						let abrir  = this._tags[this._tipo].abrir;
						let fechar = this._tags[this._tipo].fechar;
						let linha  = this._linha.replace(abrir, "").replace(fechar, "");
						this.analisar(linha);
					}
					this.despachar();
				}
			}
		},
		/**. ``''string'' fonte``: Retorna o código fonte sem comentários de captura.**/
		fonte: {
			get: function() {
				return this._fonte.join("\n").replace(/\n+/g, "\n");
			}
		},
		/**. ``''node'' manual``: Retorna o HTML do manual.**/
		manual: {
			get: function() {
				return this._manual;
			}
		}
	});


/* informa o arquivo a ser pesquisado e se é para obter o código ou os comentários */
function alvo() {
	let url  = window.location.toString();
	let file = url.replace(/^.+[&?]file=([^&]+)(.+)?/, "$1");
	let code = url.replace(/^.+[&?]code=([^&]+)(.+)?/, "$1");
	return {
		file: decodeURIComponent(file),
		code: decodeURIComponent(code) === "true",
	};
}


function codigo(conteudo) {
	document.querySelector("#DOC").content = "text/plan; charset=UTF-8";
	document.querySelector("html").className = "";
	document.body.textContent = conteudo;
}

function manual(conteudo) {
	document.querySelector("#DOC").content = "text/html; charset=UTF-8";
	document.querySelector("html").className = "wd";
	document.body.appendChild(conteudo);
	conteudo.className = "wd-read";
}


wd(window).addHandler({
	load: function() {
		wd().send(alvo().file, function (x) {
			if (x.closed) {
				try {
					let objeto = new Manual(x.text);
					if (alvo().code) codigo(objeto.fonte);
					else             manual(objeto.manual);
				} catch(e) {
					alert(e);
				}
			}
			return;
		});
	}
});
//FIM
