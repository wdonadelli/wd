//DataAttr
//DataElem



function AttrHTML(elem) {
	if (!(this instanceof AttrHTML)) {
			return new AttrHTML(elem);
	}
	this.elem = elem;
}

Object.defineProperties(AttrHTML.prototype, {
	constructor: {
		value: AttrHTML
	},
	_forms: {
		get: function() {/*retorna os parâmetros dos formulários para send, mask e load: tag > type > parameters*/
			var attr = {
				textarea: {
					textarea: {send: true,  mask: "value", load: "value"}
				},
				select: {
					select: {send: true,  mask: null, load: null}
				},
				button: {
					submit: {send: false, mask: "textContent", load: "textContent"},
					button: {send: false, mask: "textContent", load: "textContent"},
					reset:  {send: false, mask: "textContent", load: "textContent"}
				},
				input: {
					button:           {send: false, mask: "value", load: "value"},
					reset:            {send: false, mask: "value", load: "value"},
					submit:           {send: false, mask: "value", load: "value"},
					image:            {send: false, mask: null,    load: null},
					color:            {send: true,  mask: null,    load: null},
					radio:            {send: true,  mask: null,    load: null},
					checkbox:         {send: true,  mask: null,    load: null},
					date:             {send: true,  mask: null,    load: null},
					datetime:         {send: true,  mask: null,    load: null},
					"datetime-local": {send: true,  mask: null,    load: null},
					email:            {send: true,  mask: "value", load: "value"},
					text:             {send: true,  mask: "value", load: "value"},
					search:           {send: true,  mask: "value", load: "value"},
					tel:              {send: true,  mask: "value", load: "value"},
					url:              {send: true,  mask: "value", load: "value"},
					month:            {send: true,  mask: null,    load: null},
					number:           {send: true,  mask: null,    load: null},
					password:         {send: true,  mask: null,    load: null},
					range:            {send: true,  mask: null,    load: null},
					time:             {send: true,  mask: null,    load: null},
					week:             {send: true,  mask: null,    load: null},
					hidden:           {send: true,  mask: null,    load: "value"},
					file:             {send: true,  mask: null,    load: null}
				},
				option: {
					option: {send: false, mask: null, load: null}
				}
			};
			return attr;
		}
	},
	tag: {
		get: function() {/*retona a tag do elemento*/
			return this.elem.tagName.toLowerCase();
		}
	},
	form: {
		get: function() {/*retorna se é elemento de formulário*/
			return this.tag in this._forms ? true : false;
		}
	},
	type: {
		get: function() {/*retorna o tipo de elemento de formulário ou tag*/
			var value, tag, attr, type;
			value = null;
			if (this.form === true) {
				tag  = this.tag;
				attr = "type" in this.elem.attributes ? this.elem.attributes.type.value.toLowerCase() : null;
				type = "type" in this.elem ? this.elem.type.toLowerCase() : null;
			 	if (attr !== null && attr in this._forms[tag]) {
					value = attr; /*atributo DIGITADO no HTML*/
				} else if (type !== null && type in this._forms[tag]) {
					value = type; /*atributo CONSIDERADO no HTML*/
				} else if (tag in this._forms[tag]) {
					value = tag;
				}
			}
			return value;
		}
	},
	name: {
		get: function() {/*devolve o valor do atributo name ou null*/
			var name = "name" in this.elem ? this.elem.name : null
			return WD(name).type === "null" ? null : name;
		}
	},
	fname: {
		get: function() {/*devolve o valor do atributo nome dos formulários apenas, ou null*/
			return (this.name !== null && this.form === true) ? this.name : null;
		}
	},
	value: {
		get: function() {/*devolve o valor do atributo value (formulários: string/lista), se existir, caso contrário retorna null*/
			var value = null;
			if (this.form === true && "value" in this.elem) {
				var type = this.type;
				value = this.elem.value;
				if (type === "radio" || type === "checkbox") {
					value = this.elem.checked === true ? value : null;
				} else if (type === "date") {
					value = WD(value).type === "date" && value !== "%today" ? WD(value).toString() : null;
				} else if (type === "time") {
					value = WD(value).type === "time" && value !== "%now" ? WD(value).toString() : null;
				} else if (type === "number" || type === "range") {
					value = WD(value).type === "number" ? WD(value).valueOf() : null;
				} else if (type === "file" && "files" in this.elem) {
					value =  this.elem.files.length > 0 ? this.elem.files : null;
				} else if (type === "file") {
					value = value === "" ? null : [{name: value.split(/(\/|\\)/).reverse()[0], type: "???"}];
				} else if (type === "select") {
					value = [];
					for (var i = 0; i < this.elem.length; i++) {
						if (this.elem[i].selected === true) {
							value.push(this.elem[i].value);
						}
					}
					value = value.length === 0 ? null :  value;
				}
			}
			return value;
		}
	},
	send: {
		get: function() {/*indica se é um elemento para enviar nas requisições*/
			var value = false;
			if (this.fname !== null && this.value !== null && this.type !== null) {
				value = this._forms[this.tag][this.type].send;
			}
			return value;
		}
	},
	mask: {
		get: function() {/*devolve o atributo para aplicação da máscara, ou null se não for possível*/
			var value = "textContent" in this.elem ? "textContent" : null;
			if (this.form === true && this.type !== null) {
				value = this._forms[this.tag][this.type].mask;
			}
			return value;
		}
	},
	load: {
		get: function() {/*devolve o atributo para aplicação do load, ou null se não for possível*/
			var value = null;
			if (this.form === true && this.type !== null) {
				value = this._forms[this.tag][this.type].load;
			} else if ("innerHTML" in this.elem) {
				value = "innerHTML";
			} else if ("textContent" in this.elem) {
				value = "textContent";
			}
			return value;
		}
	},
	formData: {
		get: function() {/* devolve (array de objetos) os valores para serem enviados via requisição*/
			var form, name, value;
			form  = [];
			if (this.send === true) {
				name  = this.name;
				value = this.value;
				if (this.type === "file") {
					for (var i = 0; i < value.length; i++) {
						form.push({
							name:  i === 0 ? name : name+"_"+i,
							value: encodeURIComponent(value[i].name),
							post:  value[i].type === "???" ? value[i].name : value[i]
						});
					}
				} else if (this.type === "select") {
					for (var i = 0; i < value.length; i++) {
						form.push({
							name:  i === 0 ? name : name+"_"+i,
							value: encodeURIComponent(value[i]),
							post:  value[i]
						});
					}
				} else {
					form.push({
						name:  name,
						value: encodeURIComponent(value),
						post:  value
					});
				}
			}
			return form;
		}
	},
	dataName: {
		value: function(attr) {/*define o nome do attributo data sem o prefixo data-*/
			attr = WD(WD(attr).toString().replace(/^data\-/i, "")).camel;
			return WD(attr).type === "text" ? attr : undefined;
		}
	},
	dataset: {
		get: function() {/*retorna objeto dataset*/
			var data, name, value;
			if ("dataset" in this.elem) {
				data = this.elem.dataset;
			} else {
				data = {};
				for (var i = 0; i < this.elem.attributes.length; i++) {
					name  = this.elem.attributes[i].name;
					value = this.elem.attributes[i].value;
					if ((/^data\-/i).test(name) === true) {
						name = this.dataName(name);
						if (name !== undefined) {
							data[name] = value;
						}
					}
				}
			}
			return data;
		}
	},
	data: {
		value: function (attr, val) {/*define ou retorna o valor de data*/
			attr = this.dataName(attr);
			val  = WD(val).type === "regexp" ? WD(val).toString() : val;
			if (attr === undefined) {
				return attr;			
			} else if (val === undefined) {
				return attr in this.dataset ? this.dataset[attr] : val;
			} else if ("dataset" in this.elem) {
				this.elem.dataset[attr] = val;
				return val;
			} else {
				attr = "data-"+WD(attr).dash;
				this.elem.setAttribute(attr, val);
				return val;
			}
			return undefined;
		}
	},
	del: {
		value: function(name) {/* remove o atributo data*/
			name = this.dataName(name);
			if (name  === undefined) {
				return false;
			} else if ("dataset" in elem) {
				this.elem.dataset[name] = null;
				delete elem.dataset[name];
				return true;
			} else {
				name = "data-"+WD(name).dash;
				this.data(name, null);
				this.elem.removeAttribute(name);
				return true
			}
			return false;
		}
	},
	has: {
		value: function(name) {/*verifica se o atributo data existe*/
			name = this.dataName(name);
			return name in this.dataset;
		}
	},
	_dataConvert: {
		value: function(input) {/*obter atributos pares key1{value1}...&... em objeto [{key1: value1,...}, ...]*/
			var open, name, value, list, key;
			list  = [{}];
			key   = 0;
			open  = 0;
			name  = "";
			value = "";
			input = String(input).trim().split("");
			for (var i = 0; i < input.length; i++) {
				if (input[i] === "{" && open === 0) {
					open++;
				} else if (input[i] === "}" && open === 1) {
					open--;
					list[key][name.trim()] = value.trim();
					name  = "";
					value = "";
					if (input[i+1] === "&") {
						list.push({});
						key++;
						i++;
					}
				} else if (open > 0) {
					if (input[i] === "{") {
						open++;
					} else if (input[i] === "}") {
						open--;
					}
					value += input[i];
				} else {
					name += input[i];
				}
			}
			return list;
		}
	},
	core: {
		value: function(attr) {/*retorna o objeto de convert a partir do atributo*/
			return this.has(attr) === true ? this._dataConvert(this.data(attr)) : [{}];
		}
	}
});
