/**
#3 Filtrando Resultados
O objeto '{__FILTER} exibe os nós que casam com determinado valor inibindo os demais irmãos. O argumento '{size} indica o número mínimo
**/
const __FILTER = {
	/**. '{string id}: Classe identificadora do elemento de marcação.**/
	id: "css-js-wd-filter",
	/**. '{array textNodes(node node)}: Retorna uma lista de nós de texto.**/
	textNodes: function(node) {
		const list = node.childNodes;
		let   data = [];
		for (let i = 0; i < list.length; i++) {
			/*-- texto --*/
			if (list[i].nodeType === 3)
				data.push(list[i]);
			/*-- elemento --*/
			else if (list[i].nodeType === 1)
				data = data.concat(this.textNodes(list[i]));
		}
		return data;
	},
	/**. '{void mark(node node, integer open, integer stop)}: Efetua destaque nos nós textuais do nós do índice '{open} a '{close}:
	|Nome|Descrição|
	|´{node}|O nó a receber o destaque textual|
	|´{open}|Índice inicial do texto no nó|
	|´{stop}|Índice final do texto no nó|**/
	mark: function(node, open, stop) {
		let next  = 0;
		this.textNodes(node).forEach(function(v,i,a) {
			const text = v.nodeValue.normalize("NFC");
			const size = text.length;
			const init = next;
			const last = init + size - 1;
			const info = {item: -1, text: [], type: null};
			next += size;
			/*-- excluir nodeText vazio --*/
			if (size === 0) return v.remove();
			/*-- fora de captura --*/
			if (open > last || stop < init) return;
			/*-- totalmente contido: text+node+text --*/
			if (open > init && stop < last) {
				info.item = 1;
				info.type = "inside";
				info.text = [text.slice(0, open - init), text.slice(open - init, stop - last), text.slice(stop - last)]
			}
			/*-- totalmente ocupado: node --*/
			else if (open <= init && stop >= last) {
				info.item = 0;
				info.type = "total";
				info.text = [text];
			}
			/*-- parcialmente contido à direita: text+node --*/
			else if (open > init && stop >= last) {
				info.item = 1;
				info.type = "right";
				info.text = [text.slice(0, open - init), text.slice(open - init)];
			}
			/*-- parcialmente contido à esquerda: node+text --*/
			else if (open <= init && stop < last) {
				info.item = 0;
				info.type = "left";
				info.text = [text.slice(0, stop - last), text.slice(stop - last)];
			}
			/*-- definindo as marcações no texto --*/
			info.text.forEach(function(text,item,TXT) {
				const mark = info.item === item;
				const node = mark ? __HTML("mark", {className: this.id, textContent: text}) : document.createTextNode(text);
				v.parentNode.insertBefore(node, v);
			}, this);
			v.remove();
		}, this);
		return;
	},
	/**. '{void unmark(node node)}: Remove o destaque efetuado pelo método '{mark}.**/
	unmark: function(node) {
		/*-- substituido elemento por texto --*/
		Array.from(node.querySelectorAll(`mark.${this.id}`)).forEach(function(v,i,a) {
			const text = document.createTextNode(v.textContent);
			v.parentElement.replaceChild(text, v);
		}, this);
		/*-- eliminando nós textuais em sequência --*/
		this.textNodes(node).forEach(function(v,i,a) {
			if (i > 0 && a[i-1].nextSibling === v) {
				v.textContent = a[i-1].textContent + v.textContent;
				a[i-1].remove();
			}
		});
		return;
	},
	/**. '{boolean find(node node, any data)}: Localiza e marca as ocorrências textuais no nó e retorna falso se não encontrar:
	|Argumento|Descrição|
	|'{node}|Nó HTML a ser aplicado o procedimento|
	|'{data}|Fragmento a ser encontrado, '{string} ou expressão regular|**/
	find: function(node, data) {
		const text = node.textContent.replace(/\u00A0/g, " ").normalize("NFC");
		const find = __Type(data).regexp ? data : String(data).replace(/\u00A0/g, " ").normalize("NFC");
		const list = [];
		let char, open, stop, item = 0
		/*-- desmarcar dados --*/
		this.unmark(node);
		/*-- localizar por string --*/
		if (typeof find === "string") {
			if (find.length === 0) return true;
			while (text.slice(item).indexOf(find) >= 0) {
				open = item + text.slice(item).indexOf(find);
				stop = open + find.length - 1;
				item = open + find.length;
				list.push({init: open, last: stop})
			}
		}
		/*-- localizar por expressão regular --*/
		else {
			while (find.test(text.slice(item))) {
				char = text.slice(item).match(find)[0];
				open = item + text.slice(item).indexOf(char);
				stop = open + char.length - 1;
				item = open + char.length;
				if (char.length === 0) break;
				list.push({init: open, last: stop})
			}
		}
		/*-- aplicar destaques --*/
		list.forEach(function(v,i,a) {this.mark(node, v.init, v.last);}, this);
		return list.length > 0;
	},
	/**. '{void filter(node node, any data, integer size)}: Exibe os filhos do nó que contenham a expressão em '{data}:
	- Quanto aos argumentos '{node} e '{data}, ver método '{find};
	- O argumento '{size} é opcional, sendo seu valor padrão zero;
	- O argumento '{size} não tem efeito se '{data} for uma expressão regular;
	- O argumento '{size} tem o objetivo de estabelecer uma quantidade mínima de caracteres para efetuar a busca;
	- Se '{size} for positivo, executará o filtro se a quantidade de caracteres a ser localizada for maior ou igual ao valor definido;
	- Se '{size} for negativo, terá o mesmo comportamento anterior, mas esconderá os filhos enquanto o filtro não ocorrer.**/
	filter: function(node, data, size) {
		size = __Type(size).integer ? Number(size) : 0;
		data = __Type(data).regexp  ? data : String(data);
		const stop = typeof data === "string" && size !== 0;
		const hide = !stop || size === 0 || data.length >= Math.abs(size) ? null : size < 0;
		Array.from(node.children).forEach(function(v,i,a) {
			v.hidden = hide === null ? !this.find(v, data) : hide;
		}, this);
		return;
	},
	/**. '{void attach(node input, node list, integer size)}: Fixa o mecanismo ao elemento de entrada de texto:
	|Argumento|Descrição|
	|'{input}|Elemento de entrada de texto|
	|'{list}|Elemento alvo da ação|
	|'{size}|Ver método '{filter}|
	|""Tabela de argumento da ferramenta '{__FILTER}""|**/
	attach: function(input, list, size) {
		if (!(input instanceof HTMLElement) || !(list instanceof HTMLElement)) return;
		const data = {
			iAttr: __HEAP.getAttr(input, "role", "aria-controls"),
			lAttr: __HEAP.getAttr(list,  "role", "aria-atomic", "aria-live"),
			list:  list,
			size:  size,
		};
		__HEAP.attach(input, data, this);
		/*-- construindo o elemento --*/
		input[__FORMDATA.type(input) === "search" ? "removeAttribute" : "setAttribute"]("role", "searchbox");
		input.setAttribute("aria-controls", __ID.id(list));
		list.setAttribute("role", "region");
		list.setAttribute("aria-live", "polite");
		list.setAttribute("aria-atomic", "true");
		input.addEventListener("input", this);
		this.input({currentTarget: input});
		return;
	},
	/**. '{void detach(node input)}: Remove o mecanismo do elemento de entrada de texto.**/
	detach: function(input) {
		if (__HEAP.data(input) === null) return;
		const data = __HEAP.data(input);
		const list = document.getElementById(input.getAttribute("aria-controls"));
		__HEAP.resetAttr(data.iAttr);
		__HEAP.resetAttr(data.lAttr);
		input.removeEventListener("input", this);
		this.filter(list, "", 0);
		return;
	},
	/**. '{void input(object ev)}: Disparador ao digitar.**/
	input: function(ev) {
		const data = __HEAP.data(ev.currentTarget);
		if (data === null) return;
		const form = __FORMDATA.type(ev.currentTarget) !== null;
		const text = ev.currentTarget[form ? "value" : "textContent"];
		const find = text.match(/^\/(.+)\/([gim]+)?$/);
		const look = find === null ? text : new RegExp(find[1], find[2] ? find[2] : "");
		const list = document.getElementById(ev.currentTarget.getAttribute("aria-controls"));
		this.filter(list, look, data.size);
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador principal do objeto.**/
	handleEvent: function(ev) {
		if (ev.type in this) this[ev.type](ev);
		return
	},
};
__CSS.push(`/*-- FILTER --*/
.css-js-wd-filter {
	color: white;
	background: yellowgreen;
}`);