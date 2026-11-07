/**
#3 Máscaras de Texto
	O objeto '{__MASK} tem por objetivo aplicar uma máscara textual a campos, editáveis ou não:
- A máscara é definida a partir de um modelo ('{string});
- O modelo possui caracteres manipuladores que representam determinados tipos de dado;
- Se o valor informado no campo/elemento casar com o modelo, a máscara será aplicada ao conteúdo;
- Se o valor não casar, o campo/elemento ficará com seu conteúdo vazio;
- Se o campo/elemento for editável, a modelo será verificado ao perder foco;
- No caso de campo/elemento editável, se o modelo não casar, o foco retornará para o elemento;
- Nos demais casos, o modelo será verificado ao definir o atributo ou ao carregar o documento;
- Modelos alternativos podem ser definidos e serão verificados na sequência informada até casar com o conteúdo, se for o caso; e
- Se o campo/elemento possuir máscara nativa, não será possível vincular um modelo.
	Os seguintes caracteres manipuladores definer o modelo da máscara:
|Manipulador|Descrição|
|'{#}|Aguarda um dígito|
|'{@}|Aguarda um não dígito|
|'{*}|Aguarda um valor qualquer|
|'{?}|Separa modelos alternativos|
|'{%}|Anula o efeito do caractere manipulador que o precede.|
|""Tabela de manipuladores para modelos de máscara""|**/
const __MASK = {
	/**. '{string mask(string str, string model)}: Retorna o resultado do casamento de '{str} com o modelo '{model} ou uma string vazia.	**/
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
			if (data.none) {
				let next = list.slice(i).indexOf("?");
				i += next < 0 ? list.length : next;
			}
		}
		return data.last ? data.mask : "";
	},
	/**. '{void attach(node node, string model)}: Atribui ao nó uma máscara textual:
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
		if (__HEAP.data(node, this) === null) return;
		const data = __HEAP.data(node, this);
		__HEAP.resetAttr(data.attr);
		node.removeEventListener("focusout", this);
		return;
	},
	/**. '{void focusout(object ev)}: Disparador a ser chamado para aplicação da máscara.**/
	focusout: function(ev) {
		const data = __HEAP.data(ev.currentTarget, this);
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