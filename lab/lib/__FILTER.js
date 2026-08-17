/**
#3 Filtrando Resultados
O objeto '{__FILTER} exibe os nós que casam com determinado valor inibindo os demais irmãos. O argumento '{size} indica o número mínimo
**/
const __FILTER = {
	/**. '{node mark(string text)}: Retorna a tag de marcação com o texto a ser renderizado.**/
	mark: function(text) {return __HTML("mark", {className: "css-wd-filter", textContent: text});},
	/**. '{node marks(node node)}: Retorna todas as tags de marcação dentro do nó.**/
	marks: function(node) {return Array.from(node.querySelectorAll(".css-wd-filter"));},
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
	/**. '{array textNodesData()}: Retorna uma lista de objetos contendo as seguintes propriedades:
	|nome|Descrição|
	|node|O nó textual|
	|text|O texto normalizado em NFC|
	|init|O primeiro índice em relação ao primeiro caracteres do primeiro nó|
	|last|O último índice em relação ao primeiro caracteres do primeiro nó|
	|size|O tamanho de '{text}|**/
	textNodesData: function(node) {
		const list = this.textNodes(node);
		const data = [];
		const re    = /[\u0300-\u036f]/g;
		let elem, text, size, last, init = 0;
		for (let i = 0; i < list.length; i++) {
			elem = list[i];
			text = elem.nodeValue.normalize("NFC");
			size = text.length;
			last = init + size - 1;
			data.push({node: elem, text: text, init: init, last: last, size: size});
			init += size;
		}
		return data;
	},
	/**. '{void tagText(node node)}: Transforma o nó HTML em nó textual (remove as tags internas e externas).**/
	tagText: function(node) {
		const width = node.textContent.length;
		const text  = document.createTextNode(node.textContent)
		if (width === 0)
			node.remove();
		else
			node.parentElement.replaceChild(text, node);
		return;
	},
	/**. '{void textTag(node node, string|node tag, integer init, integer last)}: Insere uma '{tag} HTML entre os índices '{init} e '{last} do conteúdo textual do nó. strong{Método destrutivo}, não utilizar se houver conteúdo editável no nó.**/
	textTag: function(node, tag, init, last) {
		/*-- acertando argumentos --*/
		init: init >= 0 ? init : 0;
		last: last >= 0 ? last : Infinity;
		if (init > last) {
			const temp = init;
			init = last;
			last = temp;
		}
		/*-- percorrer nós de texto --*/
		const data = this.textNodesData(node);
		for (let i = 0; i < data.length; i++) {
			let item  = data[i];
			let elem  = item.node;
			let text  = elem.nodeValue;
			let group = [];
			let index = function(trim) {return trim - item.init;}
			/*-- não iniciado ou encerrado --*/
			if (init > item.last || last < item.init) {
				if (last < item.init) return;
				continue;
			}
			/*-- totalmente contido: text+node+text --*/
			else if (init > item.init && last < item.last) {
				group.push({text: text.slice(0, index(init)), type: "text"});
				group.push({text: text.slice(index(init), index(last)+1), type: "elem"});
				group.push({text: text.slice(index(last)+1), type: "text"});
			}
			/*-- totalmente ocupado: node --*/
			else if (init <= item.init && last >= item.last) {
				group.push({text: text, type: "elem"});
			}
			/*-- parcialmente contido à direita: text+node --*/
			else if (init > item.init && last >= item.last) {
				group.push({text: text.slice(0, index(init)), type: "text"});
				group.push({text: text.slice(index(init)),    type: "elem"});
			}
			/*-- parcialmente contido à esquerda: node+text --*/
			else if (init <= item.init && last < item.last) {
				group.push({text: text.slice(0, index(last)+1), type: "elem"});
				group.push({text: text.slice(index(last)+1),    type: "text"});
			}
			/*-- adicionar novos nós e excluir o original --*/
			group.forEach(function(g) {
				const swap = g.type === "elem" ? this.mark(g.text) : document.createTextNode(g.text);
				elem.parentNode.insertBefore(swap, elem);
				return;
			}, this);
			elem.parentNode.removeChild(elem);
		}
		return;
	},
	/**. '{object textMatch(node node, regexp|string find)}: Retorna os dados do posicionamento do conteúdo de '{find} no nó ou nulo:
	|Nome|Tipo|Descrição|
	|value|string|Valor textual capturado|
	|length|integer|Comprimento do valor textual|
	|init|integer|Índice inicial da captura|
	|last|integer|Índice final da captura|**/
	textMatch: function(node, find) {
		const view = node.innerText.replace(/\u00A0/g, " ").normalize("NFC");
		const text = node.textContent.replace(/\u00A0/g, " ").normalize("NFC");
		let   data = null;
		/*-- localizar fragmento no texto renderizado --*/
		if (typeof find !== "string") {
			data = find.test(view) ? view.match(find)[0] : null;
		}
		else if (find !== "") {
			const clean = find.replace(/\u00A0/g, " ").normalize("NFC");
			if (view.indexOf(clean) >= 0)
				data = clean;
			else if (view.toUpperCase().indexOf(clean.toUpperCase()) >= 0)
				data = clean.toUpperCase();
			else if (view.toLowerCase().indexOf(clean.toLowerCase()) >= 0)
				data = clean.toLowerCase();
		}
		/*-- localizar fragmento no texto do nó --*/
		if (data !== null) {
			/*-- transformar o fragmento encontrado em uma expressão regular (textual, barra dupla) --*/
			let re;
			re = data.replace(/\s+/g, " ").trim();
			re = re.replace(/([^0-9a-zA-Z\ ])/gi, "\\$1");
			re = re.replace(/\s+/g, "\\s+");
			const regexp = new RegExp(re, "i");
			const match  = regexp.test(text) ? text.match(regexp)[0] : null;
			console.log(match);
			return match === null ? null : {
				value:  match,
				init:   text.indexOf(match),
				last:   text.indexOf(match) + match.length - 1,
				length: match.length,
			};
		}
		return null;
	},
	/**. '{boolean search(node node, any find, integer size)}: Localiza o conteúdo e exibe os filhos do nó  ('{node}) que o contém:
	|Argumento|Tipo|Descrição|
	|node|node|Container dos elementos a efetuar o filtro|
	|find|string|Texto a ser utilizado para busca|
	|find|regexp|Empressão a ser utilizada para busca|
	|size|Integer|(Opcional) Descreve e limita a maneira de filtragem|
	. O argumento '{size} possui o seguinte mecanismo:
	- Se '{find} for uma expressão regular, nenhum efeito será aplicado;
	- Se positivo, só executará o filtro quando a mesma quantidade de caracteres for informada em '{find};
	- Se negativo, terá o mesmo comportamento acima, mas não exibirá os filhos enquanto o filtro não ocorrer.**/
	search: function(node, find, size) {
		/*-- checando dados --*/
		const test  = {find: new __Type(find), size: new __Type(size)}
		find = test.find.regexp  ? test.find.value : (test.find.nonempty ? find : "");
		size = test.size.integer ? test.size.value : 0;
		/*-- apagar todos os destaques e localizar fragmentos nos descendentes --*/
		const empty = size === 0 && find === "";
		const short = typeof find === "string" && find.length < Math.abs(size);
		this.marks(node).forEach(function(v,i,a) {return this.tagText(v);}, this);
		Array.from(node.children).forEach(function(v,i,a) {
			v.hidden = empty ? false : (short ? size < 0 : false);
			if (empty) {
				v.hidden = false;
			} else if (short) {
				v.hidden = size < 0;
			} else {
				const index = this.textMatch(v, find);
				if (index === null)
					v.hidden = true;
				else
					this.textTag(v, this.mark, index.init, index.last);
			}
		}, this);
		return;
	},
};