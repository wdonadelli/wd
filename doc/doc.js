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
	console.log(line);
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

