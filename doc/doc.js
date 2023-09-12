/**# Marcação para Manual em Código Fonte
Esse é um parágrafo.
[loko1
loko2
loko3
loko4]

[menu]

### título

**/

function Manual(texto) {
		if (!(this instanceof Manual)) return new Manual(texto);
		Object.defineProperties(this, {
			_linhas: {value: texto.split("\n")},      /* lista com as linhas do código fonte */
			_aberto: {value: false,  writable: true}, /* indica se o espaço de marcação foi aberto */
			_tipo:   {value: null,   writable: true}, /* Registra o tipo de comentário */
			_linha:  {value: null,   writable: true}, /* linha individual do código fonte */
			_item:   {value: 0,      writable: true}, /* índice da linha individual do código fonte */
			_codigo: {value: [],     writable: true}, /* registra o código fonte */
			_bloco:  {value: null,   writable: true}, /* registra o bloco aberto */
			_menu:   {value: document.createElement("UL")},   /* registra os títulos para menu */
			_raiz:   {value: document.createElement("MAIN")}, /* registra a raiz do manual */

		});
		this._bloco = this._raiz;
		this.executar();
	}

	Object.defineProperties(Manual.prototype, {
		constructor: {value: Manual},
		_re: {
			value: {
				abrir: {
					hash:  /^\#\$/,
					html:  /^\<\!\-\-\-/,
					outro: /^\/\*\*/
				},
				fechar: {
					hash:  /^\#\$/,
					html:  /\-\-\-\>$/,
					outro: /\*\*\/$/
				}
			}
 		},
 		_containers: {
 			value: [
 				{html: "pre",        abrir: /^\`\`\`/,  fechar: /\`\`\`$/  },
 				{html: "blockquote", abrir: /^\"\"\"/,  fechar: /\"\"\"$/  },
	 			{html: "ul",         abrir: /^\(/,      fechar: /\)$/      },
	 			{html: "dl",         abrir: /^\{/,      fechar: /\}$/      },
	 			{html: "h",          abrir: /^\#+\ /,   fechar: /^\#+\ /   },
	 			{html: "table",      abrir: /^\[.+\|$/, fechar: /^\|.+\]$/ },
	 			{html: "menu",       abrir: /^\@menu$/, fechar: /^\@menu$/ }
 			]



 			/*
 			value: {
 				abrir: {
	 				pre:        /^\`\`\`/,
	 				blockquote: /^\"\"\"/,
	 				ul:         /^\(/,
	 				dl:         /^\{/,
	 				h:          /^\#+\ /,
	 				table:      /^\[.+\|$/,
	 				menu:       /^\@menu$/,
 				},
 				fechar: {
	 				pre:        /^\`\`\`$/,
	 				blockquote: /\"\"\"$/,
	 				ul:         /\)$/,
	 				dl:         /\}$/,
	 				h:          /^\#+\ /,
	 				table:      /^\|.+\]$/,
	 				menu:       /^\@menu$/,
	 			}
 			}*/
 		},

		/**{`''boolean'' protocolar()`: informa se á área do manual está aberta.**/
		protocolar: {
			value: function() {
				this._linha = this._linhas[this._item];

				/* checando o tipo de comentário, se indefinido */
				if (this._tipo === null) {
					for (let i in this._re.abrir) {
						let tipo = this._re.abrir[i];
						if (tipo.test(this._linha)) {
							this._tipo = i;
							break;
						}
					}
				}
				/* verificando se é comentário de abertura */
				let linha = this._linha.trim();
				let re    = this._tipo === null ? null : this._re.abrir[this._tipo];
				if (re !== null && re.test(linha))
					this._aberto = true;

				return this._aberto;
			}
		},
		/**`''void'' despachar()`: Despacha para a próxima linha do código fonte.**/
		despachar: {
			value: function() {
				let linha = this._linha.trim();
				let re    = this._tipo === null ? null : this._re.fechar[this._tipo];

				if (re === null || re.test(linha))
					this._aberto = false

				this._item++;
			}
		},
		/**''string'' `html(''string'' inner, ''no'' elem)`: A partir da informação enviada pelo argumento `inner`, transforma-se conteúdo textual codificado em HTML. Se o argumento `elem` for informado, o HTML será definido no elemento correspodente. Retorna o conteúdo HTML. Os seguintes códigos são aceitos:
		|Entre|Descrição|
		|`|Código|
		|**|Negrito|
		|''|Itálico|
		|__|Sublinhado|
		|[](link)|Link|
		|[texto](link)|Link com texto|**/
		html: {
			value: function(inner, elem) {
				let inline = [
					{re: /\`([^`]+)\`/g,              rp: "<code>$1</code>"},
					{re: /\*\*([^*][^*]+)\*\*/,       rp: "<b>$1</b>"},
					{re: /\'\'([^'][^']+)\'\'/,       rp: "<i>$1</i>"},
					{re: /\_\_([^_][^_]+)\_\_/,       rp: "<u>$1</u>"},
					{re: /\[([^\]]+)\]\(([^()]+)\)/g, rp: "<a href=\"$2\" target=\"_blank\">$1</a>"},
					{re: /\[\]\(([^()]+)\)/g,         rp: "<a href=\"$1\" target=\"_blank\">$1</a>"},
				];
				let i = -1;
				while (++i < inline.length) {
					let re = inline[i].re;
					let rp = inline[i].rp;
					while (re.test(inner)) {
						inner = inner.replace(re, rp);
					}
				}
				if (elem !== undefined && elem !== null)
					elem.innerHTML += inner;
				return inner;
			}
		},
		/**`''no'' criar(''string'' tag, ''string'' texto): Cria o elemento HTML especicado no argumento `tag` e o retorna com o conteúdo especificado no argumento `texto`.**/
		criar: {
			value: function(tag, texto) {
				let html = document.createElement(tag);
				if (typeof texto === "string")
					this.html(texto, html);
				return html;
			}
		},
		/**`''void'' erro(''string'' mensagem): Retorna uma mensagem de erro conforme argumento `mensagem`.**/
		erro: {
			value: function(mensagem) {
				let erro = "Erro: "+mensagem+" (linha "+this._item+")\n\t"+this._linha;
				//if (mensagem) throw new Error(erro);
			}
		},

		/**`''void'' análise(''string'' texto): Analisa cada linha (argumento `texto`) do arquivo para definir o elemento e sua alocação no manual a partir das seguintes marcações:
		|Marcação|Pai|Descrição|
		|[menu]|Raiz|Lista com os títulos informados para fins de montagem de menu|
		**/
		analisar: {
			value: function (texto) {
				let elem = this._bloco;                /* container aberto */
				let nome     = elem.tagName.toLowerCase(); /* tag do container aberto */
				let html     = null;                       /* nome da tag */
				let abrir    = null;                       /* se for para abrir container */
				let fechar   = null;                       /* se for para fechar container */
				let reAbrir  = null;                       /* expressão regular casada para abrir */
				let reFechar = null;                       /* expressão regular casada para fechar */
				for (let i = 0; i < this._containers.length; i++) {
					let teste = this._containers[i];
					let valor = texto.trim();
					abrir    = teste.abrir.test(valor)  ? true : null;
					fechar   = teste.fechar.test(valor) ? true : null;
					reAbrir  = abrir  ? teste.abrir  : null;
					reFechar = fechar ? teste.fechar : null;
					html     = (abrir || fechar) ? teste.html : null;
					if (html !== null) break;
				}

				let acao;//FIXME apagar isso depois

				/*====================================================================*/
				/* -- CODIGO -- */
				/* Se aberto, pode aceitar qualquer coisa, exceto a tag de fechamento */

				if (nome !== "pre" && html === "pre" && abrir === true) {
					let pre = this.criar("PRE");
					pre.dataset.espaco = texto.split(/\S/)[0];
					pre.dataset.chaves = texto.trim().replace(reAbrir, "");
					elem.appendChild(pre);
					this._bloco = pre;
					return;
				}

				if (nome === "pre" && html !== "pre" && fechar !== true ) {
					let chaves = elem.dataset.chaves.trim().replace(/\s+/g, " ").split(" ");
					let espaco = new RegExp("^"+elem.dataset.espaco);
					let valor  = texto.replace(espaco, "");
					valor = valor.replace(/\&/g, "\&amp\;")
					valor = valor.replace(/\</g, "\&lt\;").replace(/\>/g, "\&gt\;");
					valor = valor.replace(/\"([^\"]+)\"/, "\"<var>$1</var>\"");

					for (let i = 0; i < chaves.length; i++) {
						let regex1 = new RegExp("^("+chaves[i].trim()+")(\\W)");
						let regex2 = new RegExp("(\\W)("+chaves[i].trim()+")(\\W)", "g");
						let regex3 = new RegExp("(\\W)("+chaves[i].trim()+")$");
						let regex4 = new RegExp("^("+chaves[i].trim()+")$");
						console.log(chaves[i].trim(),regex1, regex2)
						valor = valor.replace(regex1, "<b>$1</b>$2");
						valor = valor.replace(regex2, "$1<b>$2</b>$3");
						valor = valor.replace(regex3, "$1<b>$2</b>");
						valor = valor.replace(regex4, "<b>$1</b>");
					}
					elem.innerHTML += valor+"\n";
					return;
				}

				if (nome === "pre" && html === "pre") {
					if (fechar === true) {
						let valor = texto.trimEnd().replace(reFechar, "");
						this.analisar(valor);
						this._bloco = elem.parentElement;
						return;
					}
					if (fechar === false) {
						let valor = texto.trimStart().replace(reAbrir, "");
						this._bloco = elem.parentElement;
						this.analisar(valor);
						return;
					}
				}


				/*====================================================================*/
				/* -- CITAÇÃO -- */
				/* Se aberto, executa qualquer elemento, exceto se for para fechar */

				if (html === "blockquote" && abrir === true) {
					let quote = this.criar("BLOCKQUOTE");
					let valor = texto.trim().replace(reAbrir, "");
					elem.appendChild(quote);
					this._bloco = quote;
					this.analisar (valor);
					return;
				}

				if (html === "blockquote" && fechar === true) {
					let valor = texto.trim().replace(reFechar, "");
					this.analisar (valor);
					this._bloco = elem.parentElement;
					return;
				}

				if (nome === "blockquote") {
					if (texto.trim() === "") return;
					let p = this.criar("P", texto.trim());
					elem.appendChild(p);
					return;
				}









				/*====================================================================*/
				/* -- MENU -- */
				if (texto.trim() === "@menu") {
					let titulo = this.criar("H3", "Menu");
					this._raiz.appendChild(titulo)
					this._raiz.appendChild(this._menu);
					this._bloco = this._raiz;
					return;
				}

				/*====================================================================*/
				/* -- TABELA (abertura) -- */
				if ((/^\[.+\|$/).test(texto.trim())) {
					let valor = texto.replace(/^\[/, "|").trim();
					let table = this.criar("TABLE");
					this._bloco = table;
					return this.analisar(valor);
				}

				/* -- TABELA (fechamento) -- */
				if ((/^\|.+\]$/).test(texto.trim())) {
					let valor = texto.replace(/\]$/, "|").trim();
					this.analisar(valor);
					this._bloco = bloco.parentElement;
				}

				/* -- TABELA (intermediário) -- */
				if ((/^\|.+\|$/).test(texto.trim())) {
					if (nome !== "table")
						return this.analisar(texto.trim().replace(/^\|/, "["));

					let colunas = texto.trim().replace(/^\|/, "").replace(/\|$/, "").split("|");
					let tr      = this.criar("TR");
					for (let i = 0; i < colunas.length; i++) {
						let valor  = colunas[i].trim();
						let celula = this.criar(bloco.tHead === null ? "TH" : "TD", valor);
						tr.appendChild(celula);
					}
					if (bloco.tHead === null) {
						let thead = this.criar("THEAD");
						thead.appendChild(tr)
						bloco.appendChild(thead);
						return;
					}
					if (bloco.tBodies.length === 0) {
						let tbody = this.criar("TBODY");
						bloco.appendChild(tbody);
					}
					bloco.tBodies[0].appendChild(tr)
					return;
				}

				/*====================================================================*/
				/* -- LISTA (abertura) -- */
				if ((/^\(/).test(texto.trim())) {

					let valor = texto.trim().replace(/^\(/, "").trim();
					let ul    = criar("UL");
					/* -- pode haver listas secundárias -- */
					if (nome === "ul") {
						let li = this.criar("LI");
						li.appendChild(ul);
						bloco.appendChild(li);
					} else {
						bloco.appendChild(ul);
					}
					this._bloco = ul;
					if (valor !== "") this.analisar(valor);
					return;
				}

				/* -- LISTA (fechamento) -- */
				if ((/\)$/).test(texto.trim())) {
					if (nome !== "ul")
						this.erro("Fechamanto de lista sem sua abertura");
					let valor = texto.trim().replace(/\)$/, "").trim();
					if (valor !== "") this.analisar(valor);
					this._bloco = bloco.parentElement;
					/* pode haver listas secundárias dentro de LI */
					if (this._bloco.tagName.toLowerCase() === "LI")
						this._bloco = this._bloco.parentElement;
					return;
				}

				/*====================================================================*/
				/* -- LISTA DESCRITIVAS (abertura) -- */
				if ((/^\{/).test(texto.trim())) {console.log(this._linha);

					let valor = texto.trim().replace(/^\{/, "").trim();
					let dl    = this.criar("DL");
					/* -- pode haver listas secundárias -- */
					if (nome === "dl") {
						let dd = this.criar("DD");
						dd.appendChild(dl);
						bloco.appendChild(dd);
					} else {
						bloco.appendChild(dl);
					}
					this._bloco = dl;
					if (valor !== "") this.analisar(valor);
					return;
				}

				/* -- LISTA DESCRITIVAS (fechamento) -- */
				if ((/\}$/).test(texto.trim())) {
					if (nome !== "dl")
						this.erro("Fechamanto de lista descritiva sem sua abertura");
					let valor = texto.trim().replace(/\}$/, "").trim();
					if (valor !== "") this.analisar(valor);
					this._bloco = elem.parentElement;
					/* pode haver listas secundárias dentro de DD */
					if (this._bloco.tagName.toLowerCase() === "DD")
						this._bloco = this._bloco.parentElement;
					return;
				}

					/*====================================================================*/
				/* -- TÍTULOS (abertura) -- */
				if ((/^\#+\ /).test(texto.trim())) {
					let nivel = texto.trim().split(" ")[0].length;
					let valor = texto.trim().replace(/^\#+\ /, "").trim();
					let id    = wd(valor).camel;
					let hn    = this.criar("H"+nivel, valor);

					hn.id = id;
					this._raiz.appendChild(hn);
					this._bloco = this._raiz;

					if (nivel > 2) {
						let a  = this.criar("A", valor);
						let li = this.criar("LI");
						a.href = "#"+id;
						li.className = "nivel-"+nivel;
						li.appendChild(a);
						this._menu.appendChild(li);
					}
					return;
				}

				/*====================================================================*/
				/* -- DIVERSOS -- */
				switch(nome+"123") {
					case "pre": {
						bloco.textContent += texto;
						break;
					}
					case "ul": {
						let li = this.criar("LI", texto.trim());
						bloco.appendChild(li);
						break;
					}
					case "blockquote": {
						let p = this.criar("P", texto.trim());
						bloco.appendChild(p);
						break;
					}
					case "pre": {
						bloco.textContent += texto;
						break;
					}
					case "dl": {
						let div = texto.trim().split(":");

						if (div.length < 2) {/* -- apenas descrição -- */
							let p      = this.criar("P", texto.trim());
							let filhos = bloco.children;
							let ultimo =  filhos[quantidade.length - 1];
							if (ultimo.tagName.toLowerCase() === "dd") {
								ultimo.appendChild(p);
							} else {
								let dd = this.criar("DD");
								dd.appendChild(p)
								bloco.appendChild(dd);
							}
						}	else { /* -- Com título -- */
							let dt = this.criar("DT", div[0].trim());
							bloco.appendChild(dt);
							div.shift();
							let descricao = div.join(":").trim();
							if (descricao !== "") {
								let p  = this.criar("P", descricao);
								let dd = this.criar("DD");
								dd.appendChild(p)
								bloco.appendChild(dd);
							}
						}
						break;
					}
					default: {
						let p = this.criar("P", texto.trim());
						//bloco.appendChild(p);
						break;
					}
				}
				return;
			}
		},
		/**`''void'' executar()`: Decide sobre sobre encaminhamento da análise de cada linha.**/
		executar: {
			value: function() {
				while (this._item < this._linhas.length) {

					/* protocolo negado: capturar como código de programação ---------- */
					if (!this.protocolar()) {
						this._codigo.push(this._linha);
						this.despachar();
						continue;
					}

					/* Protocolo aberto: capturar dados do manual --------------------- */
					let abrir  = this._re.abrir[this._tipo];
					let fechar = this._re.fechar[this._tipo];
					let linha  = this._linha.replace(abrir, "").replace(fechar, "");
					this.analisar(linha);

					this.despachar();
				}
			}
		},
		/**`''string'' codigo`: Retorna o código fonte.**/
		codigo: {
			get: function() {
				return this._codigo.join("\n").replace(/\n+/g, "\n");
			}
		},
		/**`''node'' manual`: Retorna o manual.}**/
		manual: {
			get: function() {
				return this._raiz;
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

wd(window).addHandler({
	load: function() {
		wd().send(alvo().file, function (x) {
			if (x.closed) { //FIXME mudar após atualização de wd
				let man = new Manual(x.text);
				if (alvo().code) {
					document.querySelector("#DOC").content = "text/plan; charset=UTF-8";
					document.body.textContent = man.codigo;
				} else {
					document.body.appendChild(man.manual);
				}
			}
			return;
		});
	}
});
//FIM
