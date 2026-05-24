/**
#3 Formulário
O objeto '{__FORMCREATE} cria elementos de formulários a partir de objetos. Os seguinte argumentos são tratados em seus métodos:
|Argumento|Tipo|Descrição|Obrigatório|
|type|string|Tipo de formulário|Sim|
|label|string|Rótulo do formulário|Sim|
|name|string|Nome do formulário|Sim|
|value|string|Valor do formulário|Sim|
|value|array|Lista dos rótulos dos items do formulário (label), se aplicável|Sim|
|value|object|Lista dos rótulos e valores dos items do formulário, se aplicável|Sim|
|check|string|Valor padrão do formulário|Não|
|check|list|Valores padrão do formulário, se aplicável|Não|
|id|string|Identificador do formulário|Não|
**/



const __FORMCODE = {

	input: function(form, code) {
		const re = /^\s*([^*:]+)(\*)?\:\s*\[([^\]]*)\]\.(text|tel|emails?|url|search|number|range|files?|hidden|password|date|time|datetime|month|week|textarea|datetime\-local)\.(\w+)(?:\:(.*))?\s*$/;
		if (!re.test(code)) return false;
		const find = code.match(re);
		const data = find[6] === undefined || find[6].trim() === "" || find[4] === "textarea" ? null : find[6].split(",");
		const trim = ["date", "month", "week", "time", "datetime-local", "number", "range"];
		const mult = find[4] === "files" || find[4] === "emails";
		/*-- datalist --*/
		const datalist = data === null || trim.indexOf(find[4]) >= 0  ? null : {
			tag:  "datalist",
			attr: {id: __ID.value},
			child: data.map(function(v,i,a) {
				return {tag: "option", attr: {value: v.trim()}, child: []};
			})
		};
		/*-- campo --*/
		const field = {
			tag: find[4] === "textarea" ? find[4] : "input",
			attr: {
				type:     find[4] === "textarea" ? null : (mult ? find[4].replace(/s$/, "") : find[4]),
				value:    find[3] === undefined ? "" : find[3],
				name:     find[5],
				required: find[2] === "*",
				id:        __ID.value,
			},
			child: []
		};
		/*-- atributos específicos --*/
		if (data !== null && trim.indexOf(find[4]) > 0 && __Type(data[0]).number)
			field.attr.min = Number(data[0]);
		if (data !== null && trim.indexOf(find[4]) > 0 && __Type(data[1]).number)
			field.attr.max = Number(data[1]);
		if (data !== null && trim.indexOf(find[4]) > 0 && __Type(data[2]).number)
			field.attr.step = Number(data[2]);
		if (datalist !== null)
			field.attr.setAttribute = ["list", datalist.attr.id];
		if (mult)
			field.attr.multiple = true;
		/*-- rótulo --*/
		const label = {tag: "label", attr: {
				for: field.attr.id,
				textContent: find[1].trim() + (find[2] === undefined ? "" : "*"),
			}, child: []
		};
		/*-- definindo --*/
		__DOM({tag: form, attr: {}, child: [datalist, label, field]});
		return true;
	},

	button: function(form, code) {
		const re = /^\s*\[([^\]]+)\]\.(button|submit|reset|image|color)\.(\w+)(?:\:(.*))?\s*$/;
		if (!re.test(code)) return false;
		const find = code.match(re);
		/*-- capturando dados do campo --*/
		const field = {
			tag: find[2] === "image" || find[2] === "color" ? "input" : "button",
			attr: {
				type:        find[2],
				value:       find[2] === "color" ? find[1] : (find[2] !== "image" && find[4] !== undefined ? find[4].trim() : null),
				name:        find[3],
				id:           __ID.value,
				textContent: find[2] === "button" ? find[1].trim() : "",
				alt:         find[2] === "image" && find[4] !== undefined  ? find[4] : null,
				src:         find[2] === "image" ? find[1].trim() : null,
			},
			child: []
		}
		__DOM({tag: form, attr: {}, child:[field]});
		return true;
	},

	/*
		select:   {method: "list",  tag: "select"},
*/
	check: function(form, code) {
		const re = /^\s*(\(\s*x?\s*\)|\[\s*x?\s*\])\s+([^{]+)\{\s*(\w+)\:([^}]*)\}\s*$/;
		if (!re.test(code)) return false;
		const find = code.match(re);
		console.log(find)
		/*-- campo --*/
		const field = {
			tag: "input",
			attr: {
				type:    find[1][0] === "(" ? "radio" : "checkbox",
				checked: (/x/i).test(find[1]),
				name:   find[3],
				value:  find[4] === undefined ? "" : find[4].trim(),
			},
			child: [],
		};
		/*-- rótulo --*/
		const label = {
			tag: "label",
			attr: {},
			child: [field, {
				tag: "span",
				attr: {textContent: find[2].trim() + " "},
				child: []
			}]
		};
		__DOM({tag: form, attr: {}, child:[label]});
		return true;
	},

	fieldset: function(form, code) {
		const start = /^\s*\-\-\s*(\-[^-]+|[^-]+)\s*\-\-\s*$/;
		const close = /^\s*\-\-\s*$/;
		const last  = form.lastElementChild;
		const open  = last !== null && last.tagName.toLowerCase() === "fieldset" && last.dataset.open === "1";
		/*-- sair se a análise estiver num fieldset --*/
		if (form.tagName.toLowerCase() === "fieldset")
			return false;
		/*-- abrir fieldset --*/
		if (!open && start.test(code)) {
			const label = code.match(start)[1].trim();
			const field = __DOM({
				tag: "fieldset",
				attr: {setAttribute: ["data-open", "1"]},
				child: [label === "" ? null : {tag:  "legend", attr: {textContent: label}, child: []}]
			}).tag;
			__DOM({tag: form, attr: {}, child: [{tag: field, attr: {}, child: []}]});
			return true;
		}
		/*-- fechar fieldset --*/
		if (open && close.test(code)) {
			delete last.dataset.open;
			return true;
		}
		/*-- incluir em fieldset --*/
		if (open) {
			this.append(last, code);
			return true;
		}
		return false;
	},


	append: function(form, code) {
		if (this.fieldset(form, code)) return true;
		if (this.input(form, code))    return true;
		if (this.button(form, code))   return true;
		if (this.check(form, code))    return true;
		return false;
	}






};













const __FORMCREATE = {
	/**. '{object info}: Define a tábula de campos de formulário.**/
	/*
	* indica campo obrigatório
	Nome*: [Meu Nome]@text.name
	Telefone*: [9999999999]@tel.telefone
	e-mail*: [loko@loko]@email.correio[mult]
	url*: [loko@loko]@url.site
	Altura: [1]@range.altura[1-2]
	Idade: [1]@number.idade[1-2]
	Observações: [loucura]@textarea.obs
	[OK]@submit.ok
	-- Campo --
	(x) Opção 1.opcao
	( ) Opção 2.opcao
	( ) Opção 3.opcao
	----

	[x] Opção 1.opcao1
	[ ] Opção 2.opcao2
	[ ] Opção 3.opcao3

	[x] Opção 1.opcao1
	[ ] Opção 2.opcao2
	[ ] Opção 3.opcao3





	*/
	field: Object.freeze({
		text:     {method: "combo", tag: "input"},
		tel:      {method: "combo", tag: "input"},
		email:    {method: "combo", tag: "input"},
		url:      {method: "combo", tag: "input"},
		search:   {method: "combo", tag: "input"},
		number:   {method:  "text", tag: "input"},
		range:    {method:  "text", tag: "input"},
		file:     {method:  "text", tag: "input"},
		hidden:   {method:  "text", tag: "input"},
		password: {method:  "text", tag: "input"},
		date:     {method:  "text", tag: "input"},
		time:     {method:  "text", tag: "input"},
		datetime: {method:  "text", tag: "input"},
		month:    {method:  "text", tag: "input"},
		week:     {method:  "text", tag: "input"},
		textarea: {method:  "text", tag: "textarea"},
		button:   {method: "click", tag: "button"},
		submit:   {method: "click", tag: "button"},
		reset:    {method: "click", tag: "button"},
		color:    {method: "click", tag: "input"},
		image:    {method: "click", tag: "input"},
		checkbox: {method: "check", tag: "input"},
		radio:    {method: "check", tag: "input"},
		select:   {method: "list",  tag: "select"},
		"datetime-local": {method:  "text", tag: "input"},
	}),
	/**. '{object html(string type, string label)}: Retorna a estrutura de elemento HTML.**/
	html: function(type, label) {
		return {tag: type, attr: {innerHTML: label}, child: []};
	},
	/**. '{object label(string label)}: Retorna a estrutura de elemento HTML de rótulo.**/
	label: function(label) {
		return {tag: "label", attr: {}, child: [this.html("span", label)]};
	},
	/**. '{array options(any value, any check)}: Retorna uma lista de estruturas do elemento HTML '{option}.**/
	options: function (value, check) {
		const child = [];
		const list  = Array.isArray(check) ? check : [check];
		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i++)
				child.push({tag: "option", attr: {
					value: value[i], textContent: value[i], selected: list.indexOf(value[i]) >= 0
				}});
		}
		else if (typeof value === "object") {
			for (let i in value)
				child.push({tag: "option", attr: {
					value: i, textContent: value[i], selected: list.indexOf(i) >= 0
				}});
		}
		/*-- value é outro tipo --*/
		else {
			child.push({tag: "option", attr: {
				value: value, textContent: value, selected: list.indexOf(value[i]) >= 0
			}});
		}
		return child;
	},
	/**. '{object text(string type, string label, string name, string value)}: Retorna a estrutura de elemento HTML de texto.**/
	text: function(type, label, name, value) {
		const base = this.label(label);
		const attr = {type: type, name: name, value: value};
		if      (type === "textarea") delete attr.type;
		else if (type === "file")     delete attr.value;
		else if (type === "password") delete attr.value;
		else if (type === "hidden")   return {tag: this.field[type].tag, attr: attr, child: []};
		base.child.push({tag: this.field[type].tag, attr: attr, child: []});
		return base;
	},
	/**. '{object list(string type, string label, string name, any value, any check)}: Retorna a estrutura de elemento HTML de seleção.**/
	list: function(type, label, name, value, check) {
		const base = this.label(label);
		const attr = {name: name, multiple: Array.isArray(check) && check.length > 1};
		const list = this.options(value, check);
		const data = {tag: this.field[type].tag, attr: attr, child: list};
		base.child.push(data);
		return base;
	},
	/**. '{object combo(string type, string label, string name, any value, any check)}: Retorna a estrutura de elemento HTML de combo.**/
	combo: function(type, label, name, value, check) {
		if (!Array.isArray(value) && typeof value !== "object")
			return this.text(type, label, name, value);
		const base = this.label(label);
		const data = {tag: "datalist", attr: {id: __ID.value}, child: this.options(value)};
		const show = Array.isArray(check) ? check : [typeof check === null || check === undefined ? "" : check];
		const attr = {type: type, name: name, value: show.join(","), setAttribute: ["list", data.attr.id]};
		if (type === "email" && init.length > 1)
			attr.multiple = true;
		base.child.push(data);
		base.child.push({tag: this.field[type].tag, attr: attr, child: []});
		return base;
	},
	/**. '{object check(string type, string label, string name, any value, any check)}: Retorna a estrutura de elemento HTML de checagem.**/
	check: function(type, label, name, value, check) {
		check = Array.isArray(check) ? check : [check];
		const keep = type === "radio";
		const list = [this.html("legend", label)];
		let   item = 0;
		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i++)
				list.push(this.check(type, value[i], keep ? name : `${name}_${i}`, value[i], check));
		}
		else if (typeof value === "object") {
			for (let i in value)
				list.push(this.check(type, value[i], keep ? name : `${name}_${item++}`, i, check));
		}
		else {
			const attr  = {type: type, name: name, value: value, checked: check.indexOf(value) >= 0};
			const input = {tag: this.field[type].tag, attr: attr, child: []};
			const base  = this.label(label);
			base.child.unshift(input);
			return base;
		}
		return {tag: "fieldset", attr: {}, child: list};
	},
	/**. '{object click(string type, string label, string name, any value, any check)}: Retorna a estrutura de elemento HTML de botão.**/
	click: function(type, label, name, value, check) {
		check = Array.isArray(check) ? check : [check];
		const tag  = this.field[type].tag;
		const btn  = tag === "button";
		const list = [];
		let   item = 0;
		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i++)
				list.push(this.click(type, value[i], `${name}_${i}`, value[i], check));
		}
		else if (typeof value === "object") {
			for (let i in value)
				list.push(this.click(type, btn ? value[i] : i, `${name}_${item++}`, btn ? i : value[i], check));
		}
		else {
			const attr = {type: type, name: name, value: value, autoFocus: check.indexOf(value) >= 0};
			attr[btn ? "innerHTML" : "aria-label"] = label;
			return {tag: tag, attr: attr, child: []};
		}
		return {tag: "div", attr: {}, child: list};
	},
	/**. '{object builder(string type, string label, string name, any value, any check)}: Retorna a estrutura de elemento HTML genérico.**/
	builder: function(type, label, name, value, check) {
		type  = String(type).toLowerCase().trim();
		label = String(label).trim();
		name  = String(name).trim();
		const method = type in this.field ? this.field[type].method : "html";
		return this[method](type, label, name, value, check);
	},
	/**. '{node form(array data, object attr)}: Os items do argumento são i{array} e seguem a mesma ordem do método '{builder}.**/
	form: function(data, attr) {
		if (!Array.isArray(data)) return null;
		const form = {tag: "form", attr: attr, child: []};
		for (let i = 0; i < data.length; i++) {
			if (Array.isArray(data[i]))
				form.child.push(this.builder.apply(this, data[i]));
		}
		return __DOM(form).tag;
	},
};