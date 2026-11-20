/**
#3 Campos de Formulários
O objeto '{__FORMDATA} define um conjunto de métodos para obter as propriedades de campos de formulário HTML.**/
const __FORMDATA = {
	/**. '{string tag(node node)}: Informa a tag do elemento (minúsculo).**/
	tag: function(node) {return node.tagName.toLowerCase();},
	/**. '{string type(node node)}: Informa o tipo de campo (minúsculo) ou nulo (não formulário).**/
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
	/**. '{boolean freeEdit(node node)}: Informa se o elemento possui edição livre (habilitado e sem máscara nativa).**/
	freeEdit: function(node) {
		if (this.type(node) === null) return node.isContentEditable;
		return !(node.readOnly || node.disabled || this.hasMask(node));
	},
	/**. '{boolean nativeKeyClick(node node, string key)}: Informa se o elemento possui clique nativo pela tecla informada.**/
	nativeKeyClick: function(node, key) {
		const bttn = (/^(button|reset|submit|image)$/i).test(this.type(node));
		const link = this.tag(node) === "a" && node.hasAttribute("href")
		return (link && key === "Enter") || (bttn && (key === "Enter" || key === " "));
	},
	/**. '{any value(node node, any value)}: Define ou retorna o valor da propriedade/atributo '{value} do nó de formulário.**/
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
	/**. '{array fields(node form)}: Retorna uma lista de objetos contendo os dados dos campos de formulário:
	|Dado|Tipo|Descrição|
	|'{field}|'{node}|Campo do formulário|
	|'{tag}|'{string}|Tipo de elemento|
	|'{type}|'{string}|Tipo de campo|
	|'{name}|'{string}|Nome do campo|
	|'{value}|'{any}|Valor do campo|
	|'{error}|'{boolean}|Informa se o valor do campo contém erro|
	|'{submit}|'{boolean}|Informa se o campo está adequado ao objeto '{FormData}|**/
	fields: function(form, ignore) {
		const data = new FormData(form);
		return Array.from(form.elements).map(function(v,i,a) {
			return {
				field:  v,
				tag:    this.tag(v),
				type:   this.type(v),
				name:   v.name.trim(),
				value:  this.value(v),
				error:  !v.checkValidity(),
				submit: data.get(v.name) === v.value, //FIXME não funciona para file
			};
		}, this);
	},
	/**. '{boolean error(node node, string text)}: Define ou retorna se o campo de formulário é inválido:
	- se '{text} for indefinido, verificará se o valor do campo está incorreto;
	- se '{text} for um conteúdo textual, uma mensagem de erro personalizada será atribuída; e
	- se '{text} for nulo, a mensagem de erro personalizada será removida.**/
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
			//FIXME que porra é essa?
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
	/**. '{object data(node field)}: Retorna os dados do formulário a partir do nó de formulário e seu campo invocador:
	|Propriedade|Tipo|Descrição|
	|'{action}|'{string}|A URL definida no formulário|
	|'{enctype}|'{string}|O tipo de conteúdo de dados|
	|'{method}|'{string}|O método de envio|
	|'{noValidate}|'{boolean}|Se é para verificar validade dos campos|
	|'{submit}|'{object}|Uma instância de '{__DataSet} com os dados do campo a submeter|**/
	data: function(form, submitter) {
		const type = submitter ? __FORMDATA.type(submitter) : null;
		const invk = (type === "submit" || type === "image") && submitter.form === form;
		const attr = {action: "formAction", enctype: "formEnctype", method: "formMethod", noValidate: "formNoValidate"};
		for (let i in attr) {
			let base = [i.toLowerCase(), attr[i].toLowerCase()];
			attr[i] = invk && submitter.hasAttribute(base[1]) ? submitter[attr[i]] : (form.hasAttribute(base[0]) ? form[i] : null);
		}
		attr.noValidate = attr.noValidate ? true : false;
		attr.submit     = new __DataSet();
		/*-- capturar campos para submeter --*/
		this.fields(form).forEach(function(v,i,a) {
			if (v.submit || (v.field === submitter && v.field.name.trim() !== "")) {
				if (!v.error || attr.noValidate)
					attr.submit.append(v.name, !v.error ? v.value : v.field.value);
				else
					return this.error(v.field);
			}
		});
		return attr;
	},
};