/**
#3 Máscaras de Texto
	O objeto '{__MASK} destina-se a registrar os elementos HTML contruídos pela biblioteca, garantindo que os tipos de construção não se confundam ao evitar que o mesmo elemento seja atribuído a mais de um construtor.**/
const __MASK = {
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
	/**. '{void attach(node node, string model)}: Atribui ao nó uma máscara textual:
	- Se o valor informado no campo casar com a máscara, essa será aplicada;
	- Se o valor não casar, uma string vazia será atribuída;
	- A máscara é verificada na atribuição e ao perder o foco;
	- Se a máscara não casar, o campo receberá o foco novamente, se aplicável; e
	- Se o campo possuir máscara nativa, não será possível vinculá-lo à ferramenta.
	|Argumento|Descrição|
	|'{node}|Campo a receber a máscara|
	|'{model}|Formato da máscará (ver '{mask})|**/
	attach: function(node, model) {
		/*-- não aceitar formulário com máscara nativa --*/
		if (!(node instanceof HTMLElement) || __FORMDATA.hasMask(node)) return;
		const data = {
			attr:  __HEAP.getAttr(node, "placeholder", "aria-placeholder", "role"),
			model: model,
		};
		__HEAP.attach(node, data, this);
		/*-- construindo o elemento --*/
		if (__FORMDATA.type(node) !== null) {
			node.setAttribute("placeholder", data.model);
		}
		else {
			node.setAttribute("role", "textbox");
			node.setAttribute("aria-placeholder", model);
		}
		node.addEventListener("focusout", this);
		this.focusout({currentTarget: node});
		return;
	},
	/**. '{void detach(node node)}: Remove a máscara textual do elemento.**/
	detach: function(node) {
		if (__HEAP.data(node) === null) return;
		const data = __HEAP.data(node);
		__HEAP.resetAttr(data.attr);
		node.removeEventListener("focusout", this);
		return;
	},
	/**. '{void focusout(object ev)}: Disparador a ser chamado para aplicação da máscara.**/
	focusout: function(ev) {
		const data = __HEAP.data(ev.currentTarget);
		if (data === null) return;
		const form = __FORMDATA.type(ev.currentTarget) !== null;
		const attr = form ? "value" : "textContent";
		const text = ev.currentTarget[attr];
		const mask = this.mask(text, data.model);
		ev.currentTarget[attr] = mask;
		/*-- retornar ao elemento se a máscara falhar --*/
		if (text.length > 0 && mask.length === 0)
			ev.currentTarget.focus();
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador principal do objeto.**/
	handleEvent: function(ev) {
		if (ev.type in this) this[ev.type](ev);
		return;
	},
};