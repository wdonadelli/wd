/**
#3 Linguagem
O objeto '{__LANG} faz a gestão da linguagem local da biblioteca.
**/
const __LANG = {
	/**. '{regexp re}: Expressão regular para o formato de a{linguagem}@href{https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)}.**/
	re: /^[a-z]{2,3}(\-[A-Z][a-z]{3})?(\-([A-Z]{2}|[0-9]{3}))?$/,
	/**. '{array node(node elem)}: Retorna a lista dos atributos i{lang} do elemento HTML e ascendentes.**/
	node: function(elem) {
		let list, lang = [];
		while (elem !== null) {
			if (elem.hasAttribute("lang")) {
				list = elem.lang.replace(/\s+/g, " ").split(" ");
				lang = lang.concat(list);
			}
			elem = elem.parentElement;
		}
		return lang;
	},
	/**. '{string user}: Define ou retorna a cadeia de linguagens definida no corpo do documento.**/
	set user(x) {
		x = typeof x === "string" ? x.replace(/\s+/g, "") : null;
		if (x === null)
			document.body.removeAttribute("lang");
		else if (this.re.test(x))
			document.body.setAttribute("lang", x);
	},
	get user() {
		return document.body.hasAttribute("lang") ? document.body.getAttribute("lang") : "";
	},
	/**. '{array value}: Define ou retorna a cadeia de linguagens estabelecidas.**/
	get value() {
		return this.node(document.body).concat(navigator.languages, ["en"]);
	},
};