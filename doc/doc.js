const JS  = "../wd5.js";
const CSS = "../wd5.css";
const tag = [ /* ordem: do mais para o menos específico */
	{re: /^([^#`<|-].+)$/,           rp: "<p>$1</p>"},
	/* Títulos */
	{re: /^\#\#\#\#\#\#([^#].+)$/, rp: "<h6>$1</h6>"},
	{re: /^\#\#\#\#\#([^#].+)$/,   rp: "<h5>$1</h5>"},
	{re: /^\#\#\#\#([^#].+)$/,     rp: "<h4>$1</h4>"},
	{re: /^\#\#\#([^#].+)$/,       rp: "<h3>$1</h3>"},
	{re: /^\#\#([^#].+)$/,         rp: "<h2>$1</h2>"},
	{re: /^\#([^#].+)$/,           rp: "<h1>$1</h1>"},
	/* listas */
	{re: /^\-\ (.+)\:$/,           rp: "<dt>$1</dt>"},
	{re: /^\-\ (.+[^:])$/,         rp: "<dd>$1</dd>"},
	/* Tabelas */
	{re: /\|\:([^|:]+)\:\|/,       rp: "<th>$1</th>"},
	{re: /\|([^|]+)\|/,            rp: "<td>$1</td>"},
	{re: /^\<t(d|h)\>(.+)$/,       rp: "<tr><t$1>$2</t$1></tr>"},
	{re: /^\<tr\>(.+)\<\/tr\>$/,   rp: "<table><tr>$1</tr></table>"},





	{re: /^\`([^`]+)\`$/,          rp: "<pre class=\"wd-cofffde\">$1</pre>"},
	{re: /^\-\ ([^:]+)\:\ (.+)/,   rp: "<dl><dt>$1</dt><dd>$2</dd></dl>"},
	{re: /^\-\ (.+)/,              rp: "<dl><dd>$1</dd></dl>"},
	{re: /\`([^`]+)\`/g,           rp: "<code>$1</code>"},
	//{re: /\"([^"]+)\"/g,           rp: "<q>$1</q>"},
	//{re: /\_\_([^_]+)\_\_/g,       rp: "<b>$1</b>"},
	//{re: /\_([^_]+)\_/g,           rp: "<i>$1</i>"},
	{re: /\[([^\]]+)\]\(([^()]+)\)/g,      rp: "<a href=\"$2\" target=\"_blank\">$1</a>"},
];


function trocas(x) {
	x = x.replace(/\ +/g, " ");
	let i = -1;
	while (++i < tag.length)
		while (tag[i].re.test(x))
			x = x.replace(tag[i].re, tag[i].rp);
	return x;
}

function manual(x) {
if (x === null || x === undefined) throw new Error("Leitura do arquivo.");
let html   = [];
let linhas = x.split("\n");
let aberto = false;
linhas.forEach(function(v,i,a) {
	if (v.trim() === "/**") {
		aberto = true;
		a[i] = "";
	} else if (v.trim() === "**/") {
		aberto = false;
		a[i] = "";
	} else if (!aberto) {
		a[i] = "";
	} else {
		a[i] = trocas(v.trim());
	}
});

document.querySelector("main").innerHTML = linhas.join("")
}

function lerJS() {
wd().send(JS, function (x) {
	if (x.closed)
		manual(x.text);
	return;
});
}

wd(window).addHandler({
load: function() {
	lerJS();



}
});

