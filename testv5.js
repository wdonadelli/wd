
function WDhtml(elem) { /* objeto para manipular HTML */
	this.e = elem;
};
Object.defineProperties(WDhtml.prototype, {
	tag: { /* retorna a tag do elemento em minúsculo */
		get: function() {
			return this.e.tagName.toLowerCase();
		}
	},
	attr: { /* manipula atributos do elemento HTML */
		value: function(name, value) {
			let items = {};
			let attrs = this.e.attributes;
			for (let i = 0; i < attrs.length; i++) {
				items[attrs[i].name.toLowerCase()] = attrs[i].value.trim();
			}
			/* respostas */
			if (name === undefined) { /* retorna um objeto com os atributos e valores */
				return items;
			}
			if (name === null) { /* remove todos os atributos do elemento e retorna um objeto vazio */
				for (let i in items)
					this.e.removeAttribute(i);
				return this.attr();
			}
			if (value === undefined) { /* retorna o valor do atributo ou nulo, se inexistente */
				return name in items ? items[name] : null
			}
			if (value === null) { /* remove o atributo específico */
				if (name in items)
					this.e.removeAttribute(name);
				return this.attr(name);
			}
			/* define o valor do atributo e o retorna após definição */
			this.e.setAttribute(name, value);
			return this.attr(name);
		}
	},
	clone: { /* clona o elemento e o retorna (funciona para aplicar scripts, o método padrão não faz isso) */
		value: function() {
			if (this.tag !== "script")
				return this.e.cloneNode();
			let clone = document.createElement(this.tag);
			let attrs = this.attr();
			for (let i in attrs)
				clone.setAttribute(i, attrs[i]);
			clone.innerHTML = this.e.innerHTML;
			return clone;
		}
	},
	text: { /* retorna/define o texto do elemento */
		set: function(value) {
			this.e.innerText = value;
		},
		get: function() {
			return this.e.innerText;
		}
	},
	ftype: { /* se for um campo de formulário, retorna o tipo, caso contrário nulo */
		get: function() {
			let types = {
				input:  1, button: 1, select:   0, textarea: 0,
				option: 0, meter:  0, progress: 0
			};
			if (!(this.tag in types)) return null;
			return types[this.tag] === 1 ? this.e.type.toLowerCase().replace(/\-local$/, "") : this.tag;
		}
	},
	value: { /* retorna/define o valor do campo de formulário, se não for um retorna nulo */
		get: function() {
			return this.ftype !== null ? this.e.value : null;
		},
		set: function(value) {
			if (this.ftype !== null) this.e.value = value;
		}
	},


});
