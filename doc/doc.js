/**# Marcação para Manual em Código Fonte
Esse é um parágrafo.
>isso é um código
>tá lígado?
>	bah
* loko1
* loko2
* loko3
** loko4

- atributo: valor
* lista
* lista
- atributo 2: valor

**/

function Manual(texto) {
		if (!(this instanceof Manual)) return new Manual(texto);
		Object.defineProperties(this, {
			_linhas: {value: texto.split("\n")},      /* lista com as linhas do código fonte */
			_aberto: {value: false,  writable: true}, /* indica se o espaço de marcação foi aberto */
			_hash:   {value: null,   writable: true}, /* indica se o comentário se faz por # */
			_linha:  {value: null,   writable: true}, /* linha individual do código fonte */
			_item:   {value: 0,      writable: true}, /* índice da linha individual do código fonte */
			_codigo: {value: [],     writable: true}, /* registra o código fonte */
			_menu:   {value: document.createElement("UL")},   /* registra os títulos */
			_manual: {value: document.createElement("MAIN")}, /* registra o manual */
			_caixa:  {value: null,   writable: true}  /* registra o último container incluído ainda não fechado */
		});
		this.caixa = this._manual;
		this.analisar();
	}

	Object.defineProperties(Manual.prototype, {
		constructor: {value: Manual},
		/**- `''boolean'' protocolar()`: informa se á área do manual está aberta.**/
		protocolar: {
			value: function() {
				this._linha = this._linhas[this._item];
				if ((/^(\#\{|\/\*\*|\<\!\-\-\{)/).test(this._linha.trim()))
					this._aberto = true;
				if (this._hash === null)
					this._hash = (/^\#\{/).test(this._linha.trim());
				return this._aberto;
			}
		},
		/**- `''void'' despachar()`: Despacha para a próxima linha do código fonte.**/
		despachar: {
			value: function() {
				if ((/(\#\}|\*\*\/|\}\-\-\>)$/).test(this._linha.trim()))
					this._aberto = false;
				this._item++;
			}
		},
		/**- `''void'' analisar()`: Análisa a marcação de cada linha do código fonte.**/
		analisar: {
			value: function() {
				while (this._item < this._linhas.length) {

					/* protocolo negado: capturar como código de programação ---------- */
					if (!this.protocolar()) {
						this._codigo.push(this._linha);
						this.despachar();
						continue;
					}

					/* Protocolo aberto: capturar dados do manual --------------------- */
					let linha = this._linha.trim();
					if (this._hash) {
						if ((/\#\}$/).test(linha))
							linha = linha.replace(/\#\}$/, "");
						if ((/^\#\{/).test(linha))
							linha = linha.replace(/^\#\{/, "");
						else
							linha = linha.replace(/^\#/, "");
					} else {
						linha = linha.replace(/^(\/\*\*|\<\!\-\-\{)/, "");
						linha = linha.replace(/(\*\*\/|\}\-\-\>)$/, "");
					}

					this.bloco(linha.trim());
					this.despachar();
				}
			}
		},
		/**- `''void'' bloco(''string'' linha)`: Define o bloco a partir da configuração da linha.
		|Início|Espaço|Subníveis|Descrição do Bloco|
		|#|Sim|6|Títulos|
		|-|Sim|3|Listas descritivas|
		|*|Sim|3|Listas|
		|\\|Não|0|Tabela|
		|>|Não|0|Código|
		||Não|0|Parágrafo|**/
		bloco: {
			value: function(linha) {
				if ((/^\#+\ /).test(linha))
					return this.h(linha);
				if ((/^\-+\ /).test(linha))
					return this.dl(linha);
				if ((/^\*+\ /).test(linha))
					return this.ul(linha);
				if ((/^\|/).test(linha))
					return this.table(linha);
				if ((/^\>/).test(linha))
					return this.pre(linha);
				if (linha !== "")
					return this.p(linha);
				this.caixa = this._manual;
			}
		},
		/**- `''string'' emLinha(''string'' linha)`: Define os elementos em linha e retorna o HTML.
		|Entre|Descrição|
		|`|Código|
		|**|Negrito|
		|''|Itálico|
		|__|Sublinhado|
		|[](link)|Link|
		|[texto](link)|Link com texto|**/
		emLinha: {
			value: function(linha) {
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
					while (re.test(linha)) {
						linha = linha.replace(re, rp);
					}
				}
				return linha;
			}
		},
		/**- `''object'' caixa`: Retorna um objeto contendo informações sobre o último container adicionado ou define o último container:
		-- `''node'' bloco`: último bloco adicionado.
		-- `''string'' tag`: tag do último bloco adicionado.
		-- `''node'' filho`: último filho do último bloco adicionado.**/
		caixa: {
			get: function() {
				let bloco = this._caixa;
				let filho = bloco.children;
				return {
					bloco: bloco,
					filho: filho === 0 ? null : filho[filho.length - 1],
					tag:   bloco.tagName.toLowerCase(),
				};
			},
			set: function(x) {this._caixa = x;}
		},
		/**- `''void'' p(''string'' linha)`: Define um parágrafo ao manual a partir da configuração do argumento `linha`.**/
		p: {
			value: function(linha) {
				let p = document.createElement("P");
				p.innerHTML = this.emLinha(linha.trim());
				this._manual.appendChild(p);
				this.caixa = this._manual;
			}
		},
		/**- `''void'' h(''string'' linha)`: Define um título ao manual a partir da configuração do argumento `linha`.**/
		h: {
			value: function(linha) {
				linha = linha.trim().split(" ");
				let n = linha[0].trim().length;
				linha.shift();
				let txt  = linha.join(" ").trim();
				let htm  = this.emLinha(txt);
				let id   = wd(txt).camel;
				let link = document.createElement("A");
				let item = document.createElement("LI");
				let hn   = document.createElement("H"+n);

				link.href      = "#"+id;
				link.innerHTML = htm;
				item.className = "nivel-"+n;
				hn.id          = id;
				hn.innerHTML   = htm;

				item.appendChild(link);
				this._menu.appendChild(item);
				this._manual.appendChild(hn);
				this.caixa = this._manual;
			}
		},
		/**- `''void'' pre(''string'' linha)`: Define um bloco de código ao manual a partir da configuração do argumento `linha`.**/
		pre: {
			value: function(linha) {
				/* remove configuração da linha */
				linha = linha.replace(">", "");
				let caixa = this.caixa;
				/* se o pre é o último container */
				if (caixa.tag === "pre") {
					caixa.bloco.innerHTML += "\n"+this.emLinha(linha);
					return;
				}
				/* se pre não é o último container */
				let pre = document.createElement("PRE");
				/* se estiver dentro de uma lista descritiva, respeitar a identação */
				if (caixa.tag === "dl") {
					let dd  = document.createElement("DD");
					dd.className = caixa.filho === null ? "nivel-1" : caixa.filho.className;
					dd.appendChild(pre);
					caixa.bloco.appendChild(dd);
				} else {
					caixa.bloco.appendChild(pre);
				}
				/* adicionar o pre como último container e reprocessar */
				pre.innerHTML = this.emLinha(linha);
				this.caixa = pre;
				return;
			}
		},
		/**- `''void'' ul(''string'' linha)`: Define uma lista ao manual a partir da configuração do argumento `linha`.**/
		ul: {
			value: function(linha) {
				/* remove a configuração da linha */
				linha = linha.split(" ");
				let n = linha[0].trim().length;
				linha.shift();
				let txt   = linha.join(" ").trim();
				let inner = this.emLinha(txt);
				let li    = document.createElement("LI");
				li.innerHTML = inner;
				li.className = "nivel-"+n;
				let caixa = this.caixa;
				/* se ul é o último container */
				if (caixa.tag === "ul") {
					caixa.bloco.appendChild(li);
					return;
				}
				let ul = document.createElement("UL");
				/* se estiver dentro de uma lista descritiva, respeitar a identação */
				if (caixa.tag === "dl") {
					let dd  = document.createElement("DD");
					dd.className = caixa.filho === null ? "nivel-1" : caixa.filho.className;
					dd.appendChild(ul);
					caixa.bloco.appendChild(dd);
				} else {
					this._manual.appendChild(ul);
				}
				this.caixa = ul;
				return;
			}
		},
		/**- `''void'' table(''string'' linha)`: Define uma tabela ao manual a partir da configuração do argumento `linha`.**/
		table: {
			value: function(linha) {
				/* remove a configuração da linha */
				linha = this.emLinha(linha.replace(/^\|/, "").replace(/\|$/, "")).split("|");
				let caixa = this.caixa;
				let row   = document.createElement("TR");
				let i     = -1;
				while (++i < linha.length) {
					let col = document.createElement(caixa.tag === "table" ? "TD" : "TH");
					col.innerHTML = this.emLinha(linha[i]);
					row.appendChild(col);
				}
				/* se table é o último container */
				if (caixa.tag === "table") {
					caixa.bloco.tBodies[0].appendChild(row);
					return;
				}
				let table = document.createElement("TABLE");
				let thead = document.createElement("THEAD");
				let tbody = document.createElement("TBODY");
				/* se estiver dentro de uma lista descritiva, respeitar a identação */
				if (caixa.tag === "dl") {
					let dd  = document.createElement("DD");
					dd.className = caixa.filho === null ? "nivel-1" : caixa.filho.className;
					dd.appendChild(table);
					caixa.bloco.appendChild(dd);
				} else {
					this._manual.appendChild(table);
				}
				table.border = 1;
				thead.appendChild(row);
				table.appendChild(thead);
				table.appendChild(tbody);
				this.caixa = table;
				return;
			}
		},







		/**- `''void'' dl(''string'' linha)`: Define uma lista descritiva ao manual a partir da configuração do argumento `linha`.**/
		dl: {
			value: function(linha) {
				/* remove a configuração da linha */
				linha = linha.split(" ");
				let n = linha[0].trim().length;
				linha.shift();
				let val = linha.join(" ").trim();
				let atr = null;
				let div = val.split(":");
				if (div.length > 1) {
					atr = div[0].trim();
					div.shift();
					div = div.join(":").trim()
					val = div === "" ? null : div;
				}
				let dt = atr === null ? null : document.createElement("DT");
				let dd = val === null ? null : document.createElement("DD");
				if (dt !== null) {
					dt.innerHTML = this.emLinha(atr);
					dt.className = "nivel-"+n;
				}
				if (dd !== null) {
					dd.innerHTML = this.emLinha(val);
					dd.className = "nivel-"+n;
				}
				let caixa = this.caixa;
				/* se dl não for o último container */
				if (caixa.tag !== "dl") {
					let dl = document.createElement("DL");
					this._manual.appendChild(dl);
					this.caixa = dl;
					caixa = this.caixa;
				}
				if (dt !== null) caixa.bloco.appendChild(dt);
				if (dd !== null) caixa.bloco.appendChild(dd);
				return;
			}
		},
















		/**- `''string'' codigo`: Retorna o código fonte.**/
		codigo: {
			get: function() {
				return this._codigo.join("\n");
			}
		},
		/**- `''node'' manual`: Retorna o manual.**/
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

/* transforma as notações em HTML (formatação de texto) */
function emlinha(x) {
	let inline = [
		{re: /\`([^`]+)\`/g,              rp: "<code>$1</code>"},
		{re: /\*\*([^*][^*]+)\*\*/,       rp: "<b>$1</b>"},
		{re: /\'\'([^'][^']+)\'\'/,       rp: "<i>$1</i>"},
		{re: /\_\_([^_][^_]+)\_\_/,       rp: "<u>$1</u>"},
		{re: /\[([^\]]+)\]\(([^()]+)\)/g, rp: "<a href=\"$2\" target=\"_blank\">$1</a>"},
	];
	let i = -1;
	while (++i < inline.length) {
		let re = inline[i].re;
		let rp = inline[i].rp;
		while (re.test(x)) {
			x = x.replace(re, rp);
		}
	}
	return x;
}

/* transforma as notações em HTML (blocos) */
function blocos(x) {
	x = x.replace("/**", "").replace("**/", "").replace(/\ +/, " ").trim();

	let re;
	let a    = x[0];
	let z    = x[x.length - 1];
	let tags = {
		empty:  {re: "",    rp: ""},
		table1: {re: "[",   rp: "<table border=\"1\">"},
		table2: {re: "]",   rp: "</table>"},
		ul1:    {re: "(",   rp: "<ul>"},
		ul2:    {re: ")",   rp: "</ul>"},
		ulul1:  {re: "* (", rp: "\t<li>\n\t\t<ul>"},
		ulul2:  {re: "* )", rp: "\t\t</ul>\n\t</li>"},
		dl1:    {re: "{",   rp: "<dl>"},
		dl2:    {re: "}",   rp: "</dl>"},
		dd1:    {re: "- {", rp: "\t<dd>"},
		dd2:    {re: "- }", rp: "\t</dd>"},
		li:     {re: /^\*\ (.+)$/,            rp: "\t<li>$1</li>"},
		dt:     {re: /^\-\ ([^:]+)\:$/,       rp: "\t<dt>$1</dt>"},
		dd:     {re: /^\-\ ([^:]+)$/,         rp: "\t<dd>$1</dd>"},
		dtdl:   {re: /^\-\ ([^:]+)\:\ (.+)$/, rp: "\t<dt>$1</dt>\n\t<dd>$2</dd>"},
		pre:    {re: /^\`\`\`([^`]+)\`\`\`$/, rp: "<pre>$1</pre>"},
	};

	for (let i in tags) {
		let re = tags[i].re;
		let rp = tags[i].rp;
		let string = typeof re === "string";
		if (string && x === re)    return rp;
		if (!string && re.test(x)) return x.replace(re, rp);
	}

	/* Título */
	re = /^\#+\ (.+)$/;
	if (re.test(x)) {
		let id = wd(x).camel;
		let hn = "h"+x.split(" ")[0].length;
		let el = "<"+hn+" id=\""+id+"\" >$1</"+hn+">";
		if (hn === "h1" || hn === "h2")
			document.title += " | "+x.replace(re, "$1")
		return x.replace(re, el);
	}

	/* Tabelas */
	re = /^(\||\[)(.+)?(\||\])$/;
	if (re.test(x)) {
		let col = x.slice(1, x.length-1);
		if (a === "[" && z === "|")
			col = "<th>"+col.replace(/\|/g, "</th><th>")+"</th>"
		else
			col = "<td>"+col.replace(/\|/g, "</td><td>")+"</td>"
		let row = "\t\t<tr>"+col+"</tr>";

		if (a === "[" && z === "]")
			return "<table border=\"1\">\n\t<tbody>\n"+row+"\n\t</tbody>\n</table>";
		if (a === "[" && z === "|")
			return "<table border=\"1\">\n\t<thead>\n"+row+"\n\t</thead>\n\t<tbody>";
		if (a === "|" && z === "]")
			return row+"\n\t</tbody>\n</table>";
		if (a === "|" && z === "|")
			return row;
	}

	/* Parágrafos */
	return "<p>"+x+"</p>";
}

/* Retorna o andamento dos comentários abertos com \/\*\* e fechados com \*\*\/
	Retornos:
	 0 - Bloco que abre e fecha
	+1 - Abertura de bloco
	+2 - Fechamento de bloco
	-1 - sem informação
*/
function comentario(x) {
	x = x.trim();
	if ((/^\/\*\*(.+)?\*\*\/$/).test(x)) return 0;
	if ((/^\/\*\*(.+)?$/).test(x))       return 1;
	if ((/^(.+)?\*\*\/$/).test(x))       return 2;
	return -1;
}

/* roda o manual */
function manual(x) {
	if (x === null || x === undefined) throw new Error("Leitura do arquivo.");
	let code = alvo().code;
	let html = document.createElement(code ? "PRE" : "DIV");
	let line = x.split("\n");
	let open = false;
	html.className = "wd-read";
	document.title = alvo().file.replace(/\/([^/]+)$/, "$1");

	line.forEach(function(v,i,a) {
		/* checar abertura de comentários */
		let test = comentario(v);
		if (test >= 0) open = true;

		/* obter apenas o código da fonte */
		if (code) {
			if (open) a[i] = "";
			if (test === 0 || test === 2) open = false;
			return;
		}

		/* obter apenas os comentários */
		if (open || test >= 0)
			a[i] = emlinha(blocos(v));
		else
			a[i] = "";

		if (test === 0 || test === 2) open = false;
		return;

	});
	line = line.join("\n").replace(/\n+/g, "\n");
	//console.log(line);
	html.innerHTML = line;
	document.querySelector("main").appendChild(html);
	return
}

/* disparador de onload */
function ler() {
	wd().send(alvo().file, function (x) {
		if (x.closed)
			manual(x.text);
		return;
	});
}

wd(window).addHandler({
	load: function() {ler();}
});
//FIM
