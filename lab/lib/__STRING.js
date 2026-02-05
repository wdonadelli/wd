/**
#3 Strings
O objeto '{__STRING} apresenta algumas ferramentas de manipulação de texto.
**/
const __STRING = {
	/**. '{string mask(string str, string model)}: Retorna o resultado do casamento de '{str} com o modelo '{model} ou uma string vazia. O modelo de máscara utiliza a seguinte codificação:
	|Manipulador|Descrição|
	|#|Exige um dígito.|
	|@|Exige um não dígito.|
	|*|Exige um valor qualquer.|
	|?|Separa modelos alternativos caso o anterior não case.|
	|%|Anula o efeito do caractere que o precede.|**/
	mask: function(str, model) {
		const list = String(model).normalize().split("")
		const data = {
			i: 0,
			data: String(str).normalize().split(""),
			list: [],
			get char() {return this.data[this.i];},
			get last() {return this.i === this.data.length;},
			get mask() {return this.list.join("");},
			get none() {return this.i === 0 && this.list.length === 0;},
			init: function()  {this.i = 0; this.list = [];},
			push: function()  {this.add(this.char); this.i++;},
			add:  function(x) {this.list.push(x);},
		};
		for (let i = 0; i < list.length; i++) {
			/*-- caracter coringa, casa tudo --*/
			     if (list[i] === "*") data.push();
			/*-- dígito, casa ou reinicia --*/
			else if (list[i] === "#") (/\d/).test(data.char)  ? data.push() : data.init();
			/*-- não dígito, casa ou reinicia --*/
			else if (list[i] === "@") (/\D/).test(data.char)  ? data.push() : data.init();
			/*-- caracter anulador, registrar ou adicionar próximo caracter --*/
			else if (list[i] === "%") list[++i] === data.char ? data.push() : data.add(list[i]);
			/*-- modelo encerrado com sucesso, retornar --*/
			else if (list[i] === "?" && data.last) return data.mask;
			/*-- modelo encerrado sem sucesso, reanalisar --*/
			else if (list[i] === "?") data.init();
			/*-- caracter qualquer, registrar ou adicionar caracter --*/
			else  list[i] === data.char ? data.push() : data.add(list[i]);
			/*-- checar se houve erro ao capturar caracter da máscara --*/
			//console.log("saída", i, list[i], data.mask);
			if (data.none) {
				let next = list.slice(i).indexOf("?");
				i += next < 0 ? list.length : next;
			}
		}
		return data.last ? data.mask : "";
	},
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
	/**. '{object parser(string str, string type)}: Retorna a string transformada em DOM (html, xml, svg ou um MIMETYPE) ou nulo.**/
	parser: function(str, type) {
		type = String(type).toLowerCase();
		const data = {html: "text/html", xml: "application/xml", svg: "image/svg+xml"};
		try {
			if (type === "json") return JSON.parse(str);
			const parser = new DOMParser();
			return parser.parseFromString(str, type in data ? data[type] : type);
		}
		catch(e) {return null;}
	},
	/**. '{string unicode(string str, boolean decode)}: Codifica ou decodifica a string em sequência de a{unicode}[href="https://symbl.cc/pt/unicode-table/" target="_blank"] e a retorna.**/
	unicode: function(str, decode) {
		decode = decode === true;
		str    = String(str).normalize();
		const list = decode ? str.replace("%", "").split("%") : str.split("");
		return list.map(function(v,i,a) {
			return decode ? String.fromCharCode(parseInt(v, 16)) : "%"+v.charCodeAt(0).toString("16");
		}).join("");
	},
};