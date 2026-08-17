/**
#3 Campos de Formulários
O objeto '{__FORMDATA} define um conjunto de métodos para obter as propriedades de campos de formulário HTML.**/
const __FORMDATA = {
	/**. '{string tag(node node)}: Informa a tag do elemento.**/
	tag: function(node) {return node.tagName.toLowerCase();},
	/**. '{string type(node node)}: Informa o tipo de campo ou nulo.**/
	type: function(node) {
		const tag  = this.tag(node);
		const list = {input: 1, button: 1, textarea: 0, select: 0};
		if (list[tag] === 1) {
			const attr = String(node.getAttribute("type")).toLowerCase();
			const prop = String(node.type).toLowerCase();
			return attr in __FORMTYPES ? attr : (prop in __FORMTYPES ? prop : null);
		}
		return tag in __FORMTYPES ? tag : null;
	},
	/**. '{boolean hasMask(node node)}: Informa se o campo tem máscara nativa.**/
	hasMask: function(node) {
		if (this.type(node) !== null) {
			const error = "A1!@#$%¨&*()+";
			const clone = node.cloneNode();
			try {clone.value = error;} catch(e) {}
			return clone.value !== error;
		}
		return false;
	},
	/**. '{boolean freeEdit(node node)}: Informa se o elemento possui edição livre.**/
	freeEdit: function(node) {
		if (this.type(node) === null) return node.isContentEditable;
		return !(node.readOnly || node.disabled || this.hasMask(node));
	},
	/**. '{any value(node node, any value)}: Define ou retorna o valor da propriedade/atributo '{value} do nó**/
	value: function(node, value) {
		const type = this.type(node);
		if (type in __FORMTYPES)
			return __FORMTYPES[type](node, value);
		if (value === undefined)
			return "value" in node ? node.value : node.getAttribute("value");
		if ("value" in node)
			node.value = value;
		else
			node.setAttribute("value", value);
		return this.value(node);
	},
	/**. '{boolean submit(node node)}: Informa se o campo está apto a ser submetido.**/
	submit: function(node) {
		const form = __DOM({tag: "form", child: [{tag: node.cloneNode(true)}]});
		const data = new FormData(form.tag);
		return data.get(node.name) !== null;
	},
	/**. '{object data(node node)}: Retorna o objeto '{__DataSet} com os campos a submeter ou nulo.**/
	data: function(node) {
		const form = this.tag(node) === "form" ? node : __DOM({tag: "form", child: [{tag: node.cloneNode(true)}]}).tag;
		const data = new __DataSet();
		for (let i = 0; i < form.length; i++) {
			if (this.submit(form[i]))
				if (this.error(form[i]))
					return null;
				else
					data.append(form[i].name, this.value(form[i]));
		}
		return data;
	},
	/**. '{boolean error(node node)}: Define ou retorna se o campo de formulário é inválido.**/
	error: function(node, text) {
		if (!("setCustomValidity" in node)) return false;
		let data = null;
		/*-- lendo mensagem de erro --*/
		if (text === undefined) {
			if (!node.checkValidity())
				data = node.validationMessage.trim();
			else if (node.value !== "" && this.value(node) === "")
				data = `${this.type(node)}: ${this.messages.pattern}`;
		}
		/*-- definindo mensagem de erro (substituir node.reportValidity()) --*/
		else {
			node.setCustomValidity(String(text === null ? "" : text).trim());
			return this.error(node);
		}
		/*-- imprimindo mensagem --*/
		if (data !== null) {
			const label = "labels" in node && node.labels.length > 0 ? node.labels[0] : null;
			const attr  = {role: "alert", textContent: data, className: "css-wd-form-error"};
			if (label !== null) {
				label.id = label.id.trim() === "" ? __ID.value : label.id;
				attr["aria-labelledby"] = label.id;
			}
			__WINDOW.add(__DOM({tag: "div", attr: attr}).tag, "float", node);
		}
		return !node.checkValidity();
	},
	/**. '{object messages}: Retorna um objeto com mensagens de erros para campos de formulários.**/
	get messages() {
		const lang = __LANG.value.join(" ");
		const data = {
			pattern:  __HTML("input", {pattern: "[0-9]", value: "ABC", lang: lang}),
			required: __HTML("input", {required: true,   value: "",    lang: lang}),
		};
		for (let i in data)
			data[i] = data[i].validationMessage;
		return data;
	},
};