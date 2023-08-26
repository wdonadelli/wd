/* alterações preliminares odenadas do mais para o menos específico */
const tag1 = [
	/* Blocos de Texto */
	{re: /^([^\[\]\#\`\<\|\-].+)$/,            rp: "<p>$1</p>"},
	{re: /^\`\`\`([^`]+)\`\`\`$/,     rp: "<pre>$1</pre>"},
	/* Blocos de Títulos */
	{re: /^\#\#\#\#\#\#([^#].+)$/,    rp: "<h6>$1</h6>"},
	{re: /^\#\#\#\#\#([^#].+)$/,      rp: "<h5>$1</h5>"},
	{re: /^\#\#\#\#([^#].+)$/,        rp: "<h4>$1</h4>"},
	{re: /^\#\#\#([^#].+)$/,          rp: "<h3>$1</h3>"},
	{re: /^\#\#([^#].+)$/,            rp: "<h2>$1</h2>"},
	{re: /^\#([^#].+)$/,              rp: "<h1>$1</h1>"},
	/* Lista (abertura e fechamento) */
	{re: /^\{$/,                      rp: "<dl>"},
	{re: /^\}$/,                      rp: "</dl>"},
	/* SubLista (abertura e fechamento) */
	{re: /^\-\ \{$/,                  rp: "<dd><dl>"},
	{re: /^\-\ \}$/,                  rp: "</dl></dd>"},
	/* Tabela em Lista (abertura e fechamento) */
	{re: /^\-\ \[$/,                  rp: "\t<dt>\n<table border=\"1\">\n\t<tbody>"},
	{re: /^\-\ \]$/,                  rp: "\t</tbody>\n</table>\n\t</dt>"},
	/* Itens da Lista  */
	{re: /^\-\ ([^:]+)\:$/,              rp: "\t<dt>$1</dt>"},
	{re: /^\-\ ([^:]+)\:\ (.+)$/,        rp: "\t<dt>$1</dt>\n\t<dd>$2</dd>"},
	{re: /^\-\ (.+)$/,                rp: "\t<dd>$1</dd>"},
	/* Tabela (abertura e fechamento) */
	{re: /^\[$/,                      rp: "<table border=\"1\">\n\t<tbody>"},
	{re: /^\]$/,                      rp: "\t</tbody>\n</table>"},
	{re: /^\|(.+)/,                   rp: "\t\t<tr><td>$1"},
	{re: /(.+)\|$/,                   rp: "$1</td></tr>"},
	{re: /([^|]+)\|([^|]+)/,          rp: "$1</td><td>$2"},
	/* Textos */
	{re: /\`([^`]+)\`/g,              rp: "<code>$1</code>"},
	{re: /\*\*([^*][^*]+)\*\*/,       rp: "<b>$1</b>"},
	{re: /\'\'([^'][^']+)\'\'/,       rp: "<i>$1</i>"},
	{re: /\_\_([^_][^_]+)\_\_/,       rp: "<u>$1</u>"},
	{re: /\[([^\]]+)\]\(([^()]+)\)/g, rp: "<a href=\"$2\" target=\"_blank\">$1</a>"},
];

/* alterações secundárias */
const tag2 = [
	/* Tabela */
//	{re: /([^t][^r][^>]\n)(\<tr\>.+\n)/g, rp: "$1<table><tbody>$2"},
	//{re: /.+(\<\/tr\>\n)([^<][^t][^r])/g, rp: "$1</tbody></table>$2"},
	/* listas */
	{re: /([^d][^dt][^>]\n)(\<d[dh]\>.+\n)/g, rp: "$1<dl>$2"},
	{re: /.+(\<\/d[dt]\>\n)([^<][^d][^dt])/g, rp: "$1</dl>$2"},
];

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

/* limpa a linha (abertura e fechamento de comentários) */
function limpar(x) {
	return x.replace("/**", "").replace("**/", "").trim();
}

/* transforma as notações em HTML */
function trocas(x, tag) {
	x = limpar(x);
	let i = -1;
	while (++i < tag.length)
		while (tag[i].re.test(x))
			x = x.replace(tag[i].re, tag[i].rp);
	return x;
}

/* Retornos:
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
			a[i] = trocas(v, tag1);
		else
			a[i] = "";

		if (test === 0 || test === 2) open = false;
		return;

	});
	line = line.join("\n").replace(/\n+/g, "\n");
	//if (!code) line = trocas(line, tag2);
	console.log(line);
	html.innerHTML = line;
	document.querySelector("main").appendChild(html);
	return
}








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

