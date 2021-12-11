Object.defineProperties(WDdom, {/*objetos do construtor*/
	checkCss: {
		value: function(e, css) {
			var list = wd_no_spaces(e.className).split(" ");
			return list.indexOf(css) >= 0 ? true : false;
		}
	},
	tag: {/*retorna a tag do elemento*/
		value: function(e) {return e.tagName.toLowerCase();}
	},
	form: {/*informa se o elemento é de formulário*/
		value: function(e) {
			var form = ["textarea", "select", "button", "input", "option"];
			return form.indexOf(this.tag(e)) < 0 ? false : true;
		}
	},
	type: {/*informa o tipo do elemento de formulário*/
		value: function(e) {
			if (!this.form(e)) return null;
			var types = [
				"button", "reset", "submit", "image", "color", "radio",
				"checkbox", "date", "datetime", "datetime-local", "email",
				"text", "search", "tel", "url", "month", "number", "password",
				"range", "time", "week", "hidden", "file"
			];
			var attr = "type" in e.attributes ? e.attributes.type.value.toLowerCase() : null;
			var type = "type" in e ? e.type.toLowerCase() : null;
		 	if (types.indexOf(attr) >= 0) return attr; /*DIGITADO no HTML*/
		 	if (types.indexOf(type) >= 0) return type; /*CONSIDERADO no HTML*/
			return this.tag(e);
		}
	},
	name: {/*informa o valor do atributo name do formulário*/
		value: function(e) {
			if (!this.form(e) || !("name" in e)) return null;
			var name = wd_vtype(e.name);
			return name.type === "text" ? name.input : null;
		}
	},
	value: {/*retorna o valor do atributo value do formulário*/
		value: function(e) {
			if (!this.form(e) || !("value" in e)) return null;
			var type  = this.type(e);
			var value = e.value;
			var check = WD(value);
			if (type === "radio")    return e.checked               ? value            : null;
			if (type === "checkbox") return e.checked               ? value            : null;
			if (type === "date")     return check.type === "date"   ? check.toString() : null;
			if (type === "time")     return check.type === "time"   ? check.toString() : null;
			if (type === "number")   return check.type === "number" ? check.valueOf()  : null;
			if (type === "range")    return check.type === "number" ? check.valueOf()  : null;
			if (type === "file")     return e.files.length > 0      ? e.files : null;
			if (type === "select") {
				value = [];
				for (var i = 0; i < e.length; i++) {
					if (e[i].selected) value.push(e[i].value);
				}
				return value.length === 0 ? null : value;
			}
			return value === "" ? null : value;
		}
	},
	send: {/*informa se os dados do elemento podem ser enviados*/
		value: function(e) {
			if (this.name(e) === null || this.value(e) === null) return false;
			var noSend = ["submit", "button", "reset", "image", "option"];
			if (noSend.indexOf(this.type(e)) >= 0) return false;
			if (noSend.indexOf(this.tag(e))  >= 0) return false;
			return true;
		}
	},
	mask: {/*retorna o atributo para aplicação da máscara*/
		value: function(e) {
			if (!this.form(e)) return "textContent" in e ? "textContent" : null;
			var text = ["button", "option"];
			if (text.indexOf(this.tag(e)) >= 0) return "textContent";
			var value = [
				"textarea", "button", "submit", "email", "text", "search",
				"tel", "url"
			];
			if (value.indexOf(this.tag(e)) >= 0)  return "value";
			if (value.indexOf(this.type(e)) >= 0) return "value";
			return null;
		}
	},
	load: {/*retona o atributo para carregar outro elemento interno*/
		value: function(e) {
			if (this.tag(e) === "button" || this.tag(e) === "option") return "textContent";
			var value = [
				"textarea", "button", "reset", "submit", "email", "text",
				"search", "tel", "url", "hidden"
			];
			if (this.form(e)) return value.indexOf(this.type(e)) >= 0 ? "value" : null;
			return "innerHTML" in e ? "innerHTML" : "textContent";
		}
	},
	formdata: {
		value: function(e) {/*retorna um array de objetos com os dados para envio em requisições*/
			var form  = [];
			if (!this.send(e)) return form;
			var name  = this.name(e);
			var value = this.value(e);
			if (this.type(e) === "file") {
				for (var i = 0; i < value.length; i++) {
					form.push({
						NAME: i === 0 ? name : name+"_"+i, /*atributo nome*/
						GET:  encodeURIComponent(value[i].name), /*nome do arquivo*/
						POST: value[i] /*dados do arquivo*/
					});
				}
				return form;
			}
			if (this.tag(e) === "select") {
				for (var i = 0; i < value.length; i++) {
					form.push({
						NAME: i === 0 ? name : name+"_"+i,
						GET:  encodeURIComponent(value[i]),
						POST: value[i]
					});
				}
				return form;
			}
			form.push({
				NAME: name,
				GET:  encodeURIComponent(value),
				POST: value
			});
			return form;
		}
	},
	dataset: {
		value: function(e, attr) {/*obter o conteúdo de dataset e ransformar em um array de objetos*/
			var list = [{}];
			if (!(attr in e.dataset)) return list;
			var key    = 0;
			var open   = 0;
			var name   = "";
			var value  = "";
			var object = false;
			var core  = String(e.dataset[attr]).trim().split("");
			for (var i = 0; i < core.length; i++) {
				if (core[i] === "{" && open === 0) {/*abrir captura do valor do atributo*/
					open++;
				} else if (core[i] === "}" && open === 1) {/*finalizar captura do valor do atributo*/
					open--;
					object = true;
					value  = value.trim();
					name   = name.trim();
					list[key][name] = value === "null" ? null : value;
					name  = "";
					value = "";
					if (core[i+1] === "&") {/*novo grupo*/
						list.push({});
						key++;
						i++;
					}
				} else if (open > 0) {/*capturando valor do atributo*/
					if (core[i] === "{") {open++;} else if (core[i] === "}") {open--;}
					value += core[i];
				} else {/*capturando nome do atributo*/
					name += core[i];
				}
			}
			return object ? list : (name.trim() === "null" ? [{value: null}] : [{value: name}]);
		}
	},
	brosIndex: {
		value: function(e) {
			var bros = e.parentElement.children;
			for (var i = 0; i < bros.length; i++) {
				if (bros[i] === e) return i;
			}
			return 0;
		}
	}
});

