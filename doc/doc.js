function Manual(texto) {
		if (!(this instanceof Manual)) return new Manual(texto);
		Object.defineProperties(this, {
			_linhas: {value: texto.split("\n")},
			_aberto: {value: false,  writable: true}, /* indica se deve capturar o manual */
			_hash:   {value: null,   writable: true}, /* indica se o comentário se faz por # */
			_linha:  {value: null,   writable: true}, /* define a linha atual */
			_item:   {value: 0,      writable: true}, /* define o item atual */
			_bloco:  {value: null,   writable: true}, /* registra o último bloco aberto */
			_menu:   {value: [],     writable: true}, /* registra os títulos */
			_codigo: {value: [],     writable: true}, /* registra o código fonte */
			_manual: {value: document.createElement("MAIN")}, /* registra o manual */

		});
		this._bloco = this._manual;
		this.analisar();
	}

	Object.defineProperties(Manual.prototype, {
		constructor: {value: Manual},
		/**- `''boolean'' protocolar()`: informa se é devido o registro do manual.**/
		protocolar: {
			value: function() {
				this._linha = this._linhas[this._item];
				if ((/^(\#\{|\/\*\*)/).test(this._linha.trim()))
					this._aberto = true;
				if (this._hash === null)
					this._hash = (/^\#\{/).test(this._linha.trim());
				return this._aberto;
			}
		},
		/**- `''void'' despachar()`: Despacha para a próxima linha.**/
		despachar: {
			value: function() {
				if ((/(\#\}|\*\*\/)$/).test(this._linha.trim()))
					this._aberto = false;
				this._item++;
			}
		},
		/**- `''void'' despachar()`: Análisa o conteúdo da fonte.**/
		analisar: {
			value: function() {
				while (this._item < this._linhas.length) {

					/* capturar como código de programação ---------------------------- */
					if (!this.protocolar()) {
						this._codigo.push(this._linha);
						this.despachar();
						continue;
					}

					/* Preparar para captura do manual -------------------------------- */
					let linha = this._linha.trim();
					if (this._hash) {
						if ((/\#\}$/).test(linha))
							linha = linha.replace(/\#\}$/, "");
						if ((/^\#\{/).test(linha))
							linha = linha.replace(/^\#\{/, "");
						else
							linha = linha.replace(/^\#/, "");
					} else {
						linha = linha.replace(/^\/\*\*/, "").replace(/\*\*\/$/, "");
					}

					this.bloco(linha.trim());
					this.despachar();
				}
			}
		},
		/**- `''void'' bloco(''string'' linha)`: Define o bloco a partir da configuração da linha.
		|Inicia com|Subníveis|Descrição|
		|"# "|Sim, até 6|Títulos|
		|"- "|Sim, até 3|Listas descritivas|
		|"* "|Sim, até 3|Listas|
		|"|"|Não|Tabela|
		|"% "|Não|Código|**/
		bloco: {
			value: function(linha) {
				if ((/^\#+\ /).test(linha))
					return this.h(linha);
				if ((/^\-+\ /).test(linha))
					return this.dl(linha);
				if ((/^\*+\ /).test(linha))
					return this.ul(linha);
				if ((/^\|([^|]+\|)+/).test(linha))
					return this.table(linha);
				if ((/^\%/).test(linha))
					return this.pre(linha);
				if (linha !== "")
					return this.p(this.linha);
				this._bloco = this._manual;
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
		/**- `''object'' dados`: Retorna um objeto contendo os elementos:
		-- `''node'' bloco`: Retorna o bloco aberto.
		-- `''node'' filho`: Retorna o último filho do bloco aberto.**/
		dados: {
			get: function() {
				return {
					bloco: this._bloco,
					get filho() {
						let filhos = this.bloco.children;
						return filhos.lenght > 0 ? filhos[filhos.length - 1] : null;
					},
					get tagBloco() {
						return this.bloco === null ? "" : this.bloco.tagName.toLowerCase();
					},
					get tagFilho() {
						return this.filho === null ? "" : this.filho.tagName.toLowerCase();
					}
				};
			}
		},
		/**- `''void'' p(''string'' linha)`: Define o bloco de parágrafo e adiciona ao principal.**/
		p: {
			value: function(linha) {
				let p = document.createElement("P");
				p.innerHTML = this.emLinha(linha.trim());
				this._manual.appendChild(p);
				this._bloco = this._manual;
			}
		},
		/**- `''void'' h(''string'' linha)`: Define o bloco de títulos e adiciona ao principal.**/
		h: {
			value: function(linha) {
				let h  = linha.trim().split(" ");
				let n  = h[0].length;
				let hn = document.createElement("H"+n);
				h.shift();
				hn.id = wd(h.join(" ")).camel;
				hn.innerHTML = this.emLinha(h.join(" "));
				this._manual.appendChild(hn);
				this._bloco = this._manual;
			}
		},
		/**- `''void'' pre(''string'' linha)`: Define o bloco de código e adiciona ao elemento anterior.**/
		pre: {
			value: function(linha) {
				/* remove a configuração da linha */
				linha = linha.replace("%", "");
				/* se o último filho é pre, apenas adicionar a linha */
				if (this.dados.tagFilho === "pre") {
					this.dados.filho.textContent += "\n"+linha;
					return;
				}
				/* criar elemento pre */
				let pre = document.createElement("PRE");
				pre.textContent = linha;
				this.dados.bloco.appendChild(pre);
				return;
			}
		},

		/**- `''void'' table(''string'' linha)`: Define a tabela e adiciona ao elemento anterior.**/
		table: {
			value: function(linha) {
				/* remove a configuração da linha */
				linha = this.emLinha(linha.replace(/^\|/, "").replace(/\|$/, "")).split("|");
				/* se o último filho é table, apenas adicionar a linha */
				if (this.dados.tagFilho === "table") {
					let tr = document.createElement("TR");
					tr.innerHTML = "<td>"+linha.join("</td><td>")+"</td>";
					this.dados.filho.tBodies[0].appendChild(tr);
					return;
				}
				/* criar elemento table */
				let table = document.createElement("TABLE");
				let thead = document.createElement("THEAD");
				let tbody = document.createElement("TBODY");
				let tr    = document.createElement("TR");
				tr.innerHTML = "<th>"+linha.join("</th><th>")+"</th>";
				thead.appendChild(tr);
				table.appendChild(thead);
				table.appendChild(tbody);
				this.dados.bloco.appendChild(table);
				return;
			}
		},

		/**- `''void'' dl(''string'' linha)`: Define a lista descritiva e adiciona ao elemento anterior.**/
		dl: {
			value: function(linha) {

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
