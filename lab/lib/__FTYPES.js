/**
#3 Tipos de Formulários
O objeto '{__FTYPES} define os tipos de campos de formulário com a respectiva função para obter ou definir valor:
- Campos numéricos são definidos por números finitos (string ou number) e retornam valores numéricos.
- Campos de checagem e opção retornam o valor do atributo, se checados ou selecionados, ou nulo.
- Campos de checagem e opção podem ser definido por valores booleanos para definir o estado da checagem ou seleção.
- Campos múltiplos podem ser definidos como array e obtidos como array, se houver mais de um valor habilitado.
- Campos de data e tempo são definidos conforme tipo e definição da biblioteca.
- O campo "datetime" aceita qualquer propriedade de data ou tempo independente do período.
- O campo "file" retorna o objeto '{File}, se simples, e '{FileList}, se múltiplo.
- Os valores dos campos "url" e "email" devem estar no respectivo formato para serem definidos ou retornados.
- O campo "color" pode ser definido por um número inteiro, por uma lista com os valores (0-255) de RGB, nessa ordem, ou por um objeto contendo os valores das propriedades i{red}, i{green}, i{blue}.
	- Outros elementos retornam ou definem o valor da propriedade ou atributo.**/
const __FTYPES = {
	button:   function(node, value) {return this.text(node, value);},
	reset:    function(node, value) {return this.text(node, value);},
	submit:   function(node, value) {return this.text(node, value);},
	image:    function(node, value) {return this.text(node, value);},
	password: function(node, value) {return this.text(node, value);},
	hidden:   function(node, value) {return this.text(node, value);},
	search:   function(node, value) {return this.text(node, value);},
	tel:      function(node, value) {return this.text(node, value);},
	output:   function(node, value) {return this.text(node, value);},
	textarea: function(node, value) {return this.text(node, value);},
	range:    function(node, value) {return this.number(node, value);},
	meter:    function(node, value) {return this.number(node, value);},
	progress: function(node, value) {return this.number(node, value);},
	checkbox: function(node, value) {return this.radio(node, value);},
	text:     function(node, value) {
		if (value !== undefined)
			node.value = value;
		if (value === null)
			node.removeAttribute("value");
		return node.value;
	},
	number:   function(node, value) {
		const read = value === undefined;
		const data = new __Type(read ? this.text(node) : value);
		const fail = !data.finite;
		if (read)  return fail ? "" : data.value;
		if (!fail) this.text(node, data.value);
		return this.number(node);
	},
	date:     function(node, value) {
		const read = value === undefined;
		const data = __DATETIME.match(read ? this.text(node) : value);
		const fail = data === null || data.type !== "date";
		if (read)  return fail ? "" : data.form;
		if (!fail) this.text(node, data.form);
		return this.date(node);
	},
	time:     function(node, value) {
		const read = value === undefined;
		const data = __DATETIME.match(read ? this.text(node) : value);
		const fail = data === null || data.type !== "time";
		if (read)  return fail ? "" : data.form;
		if (!fail) this.text(node, data.form);
		return this.time(node);
	},
	month:    function(node, value) {
		const read = value === undefined;
		const data = __DATETIME.match(read ? this.text(node) : value);
		const fail = data === null || data.type !== "month";
		if (read)  return fail ? "" : data.form;
		if (!fail) this.text(node, data.form);
		return this.month(node);
	},
	week:     function(node, value) {
		const read = value === undefined;
		const data = __DATETIME.match(read ? this.text(node) : value);
		const fail = data === null || data.type !== "week";
		if (read)  return fail ? "" : data.form;
		if (!fail) this.text(node, data.form);
		return this.week(node);
	},
	"datetime-local": function(node, value) {
		const read = value === undefined;
		const data = __DATETIME.match(read ? this.text(node) : value);
		const fail = data === null || data.type !== "datetime";
		if (read)  return fail ? "" : data.form;
		if (!fail) this.text(node, data.form);
		return this["datetime-local"](node);
	},
	datetime: function(node, value) {
		const read = value === undefined;
		const data = __DATETIME.match(read ? this.text(node) : value);
		const fail = data === null;
		if (read)  return fail ? "" : data.string;
		if (!fail) this.text(node, data.string);
		return this.datetime(node);
	},
	radio: function(node, value) {
		const read = value === undefined;
		const data = new __Type(value);
		if (read) return node.checked ? this.text(node) : null;
		data.boolean ? (node.checked = data.value) : this.text(node, value);
		return this.radio(node);
	},
	option: function(node, value) {
		const read = value === undefined;
		const data = new __Type(value);
		if (read) return node.selected ? this.text(node) : null;
		data.boolean ? (node.selected = data.value) : this.text(node, value);
		return this.option(node);
	},
	url: function(node, value) {
		const read = value === undefined;
		const data = new __Type(read ? this.text(node) : value);
		let url = null;
		if (data.instanceOf("URL"))
			url = String(data._input);
		else
			try {url = String(new URL(data._input));} catch(e){}
		const fail = url === null;
		if (read)  return fail ? "" : url;
		if (!fail) this.text(node, url);
		return this.url(node, url);
	},
	color: function(node, value) {
		const read = value === undefined;
		const data = read ? this.text(node) : value;
		const iso  = /^\#[0-9a-f]{6}$/i;
		if (typeof data === "string") {
			const hex  = "#"+("000000"+data.replace(/(\s+|\#)/g, "")).slice(-6);
			const fail = !iso.test(hex);
			if (read)  return fail ? "#000000" : hex;
			if (!fail) this.text(node, hex);
			return this.color(node);
		}
		/*-- somente definição de valores pode ser tipo diferente de string --*/
		if (Array.isArray(data)) {
			data.forEach(function(v,i,a) {
				const num = v !== null && isFinite(v) && !isNaN(v) ? Number(v)%256 : 0;
				a[i] = ("00"+num.toString(16)).slice(-2);
			});jjjj
			return this.color(node, "#"+data.join(""));
		}
		if (data !== null && typeof data === "object") {
			return this.color(node, [data.red, data.green, data.blue]);
		}
		if (data !== null && isFinite(data)) {
			const num = Number(data)%(0xffffff+1);
			return this.color(node, "#"+num.toString(16));
		}
		return this.text(node);
	},
	file: function(node, value) {
		if (value === null) return this.text(node, null);
		const mult = node.multiple === true;
		const data = node.files;
		const fail = data.length === 0 || (!mult && data.length > 1);
		return fail ? "" : (data.length === 1 ? data[0] : data);
	},
	email:    function(node, value) {
		const read = value === undefined;
		const mult = node.multiple === true;
		const data = read ? this.text(node) : value;
		if (typeof data === "string") {
			const list = data.replace(/\s+/g, "").split(",");
			const mail = list.filter(function(v,i,a) {return new __Type(v).email;});
			const fail = list.length !== mail.length || mail.length === 0 || (!mult && mail.length > 1);
			if (read)  return fail ? "" : (mail.length > 1 ? mail : mail.join(","));
			if (!fail) this.text(node, mail.join(","));
			return this.email(node);
		}
		/*-- somente definição de valores pode ser tipo diferente de string --*/
		if (Array.isArray(data))
			return this.email(node, data.join(","));
		return this.text(node);
	},
	select:   function(node, value) {
		const read = value === undefined;
		const mult = node.multiple === true;
		const data = read ? [] : Array.isArray(value) ? value : [value];
		data.forEach(function(v,i,a) {a[i] = String(v);});
		for (let i = 0; i < node.length; i++) {
			if (!read)
				node[i].selected = data.indexOf(node[i].value) >= 0;
			else if (node[i].selected)
				data.push(node[i].value);
		}
		const fail = (!mult && data.length > 1) || data.length === 0;
		if (read) return fail ? "" : data.length > 1 ? data : data[0];
		return this.select(node);
	},
};