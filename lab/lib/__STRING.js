/**
#3 Strings
O objeto '{__STRING} apresenta algumas ferramentas de manipulação de texto.
**/
const __STRING = {
	/**. '{string case(string str, string type}: Retorna a string de acordo com o tipo ('{upper, lower, invert, capitalize, kebab, snake, screaming, pascal, camel}).**/
	case: function(str, type) {
		str  = str.normalize();
		type = String(type).toLowerCase();
		if (type === "upper")  return str.toUpperCase();
		if (type === "lower")  return str.toLowerCase();
		if (type === "invert") return str.split("").map(function(v,i,a) {
			return v === v.toUpperCase() ? v.toLowerCase() : v.toUpperCase();
		}).join("");
		if (type === "capitalize") return str.split("").map(function(v,i,a) {
			return i === 0 || (/\s/).test(a[i-1]) ? v.toUpperCase() : v.toLowerCase();
		}).join("");
		if (type === "kebab") return this.fit(this.clean(str)).trim()
			.replace(/[^a-zA-Z0-9\-]/g, "-")
			.replace(/([A-Z])/g, "-$1")
			.replace(/\-+/g, "-")
			.replace(/^[\-0-9]+|\-+$/g, "").toLowerCase();
		if (type === "snake") return this.fit(this.clean(str)).trim()
			.replace(/[^a-zA-Z0-9\_]/g, "_")
			.replace(/([A-Z])/g, "_$1")
			.replace(/\_+/g, "_")
			.replace(/^[\_0-9]+|\_+$/g, "").toLowerCase();
		if (type === "screaming") return this.case(str, "snake").toUpperCase();
		if (type === "pascal") return this.fit(this.case(
			this.clean(str)
			.replace(/[^a-zA-Z0-9\ ]/g, " ")
			.replace(/([A-Z])/g, " $1")
			.replace(/^[0-9\ ]+/, "")
		, "capitalize")).replace(/\ +/g, "");
		if (type === "camel") return this.case(str, "pascal").split("").map(function(v,i,a) {
			return i == 0 ? v.toLowerCase() : v;
		}).join("");
		return str;
	},
	/**. '{string clean(string str)}: Retorna o valor de entrada sem o intervalo unicode '{\u0300-\u036f} (acentos).**/
	clean: function(str) {
		return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize();
	},
	/**. '{boolean compare(string str1, string str2)}: Compara as strings são semelhantes.**/
	compare: function(str1, str2) {
		return String(str1).normalize("NFKC") === String(str2).normalize("NFKC");
	},
	/**. '{integer length(string str)}: Retorna a quantidade de caracteres da string.**/
	length: function(str) {
		return String(str).normalize().length;
	},
	/**. '{string fit(string str)}: Retorna a string sem caracteres de espaço repetidos.**/
	fit: function(str) {
		return String(str).replace(/(\s)+/g, "$1");
	},
	/**. '{object parserDOM(string str, string mime)}: Retorna a string transformada em DOM a partir do MIME TYPE (ext/html
	- text/xml
	- application/xml
	- application/xhtml+xml
	- image/svg+xml**/
	parserDOM: function(str, mime) {
		try {
			const parser = new DOMParser();
			return parser.parseFromString(str, String(mime).replace(/\s+/g, "").toLowerCase());
		} catch(e) {}
		return null;
	},
	/**. '{string unicode(string str, boolean decode)}: Codifica ou decodifica a string em sequência de a{unicode}@href{https://symbl.cc/pt/unicode-table/}target{_blank} e a retorna.**/
	unicode: function(str, decode) {
		decode = decode === true;
		str    = String(str).normalize();
		const list = decode ? str.replace("%", "").split("%") : str.split("");
		return list.map(function(v,i,a) {
			return decode ? String.fromCharCode(parseInt(v, 16)) : "%"+v.charCodeAt(0).toString("16");
		}).join("");
	},
	/**. '{string RFC5987(string name)}: Retorna o valor de nome em formato a{RFC5987}@href{https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#encoding_for_content-disposition_and_link_headers}.**/
	RFC5987: function(name) {
		return String(name).normalize("NFC").split("").map(function(v,i,a) {
			const code = (/['()*]/).test(v) ? `%${v.charCodeAt(0).toString(16).toUpperCase()}` : encodeURIComponent(v);
			return (/[|`^]/).test(v) ? v : code;
		}).join("");
	},
};