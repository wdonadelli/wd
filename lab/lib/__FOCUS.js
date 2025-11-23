/**
#3 Foco
O objeto '{__FOCUS} agrupa ações de foco.
**/
const __FOCUS = {
	/**. '{array tagDiverse(node node)}: Retorna uma lista com as tags dos elementos filhos do nó.**/
	tagDiverse: function(node) {
		const child = node.children;
		const tags  = []
		for (let i = 0; i < child.length; i++)
			if (tags.indexOf(child[i].tagName) < 0)
				tags.push(child[i].tagName);
		return tags;
	},
	/**. '{object overFlow(node node)}: Retorna se o nó está usando barra de rolagem nos eixos x e y ('{boolean}).**/
	overFlow: function(node) {
		const styles = window.getComputedStyle(node, null);
		const values = ["auto", "scroll"];
		return {
			x: node.scrollWidth  > node.clientWidth  && values.indexOf(styles.overflowX) >= 0,
			y: node.scrollHeight > node.clientHeight && values.indexOf(styles.overflowY) >= 0,
		};
	},
	/**. '{object getFocus(node node)}: Localiza os elementos focáveis dentro do nó:
	|Propriedade|Tipo|Descrição|
	|focus|Array|Elementos focáveis com o atributo '{autofocus}|
	|index|Array|Elementos focáveis|
	|auto|Array|Elementos não focáveis mas com o atributo '{autofocus}|**/
	getFocus: function(node) {
		const data = {index: [], auto: [], focus: []};
		const find = node.querySelectorAll("*");
		for (let i = 0; i < find.length; i++) {
			let index = find[i].tabIndex >= 0;
			let auto  = find[i].autofocus;
			if (index)
				data.index.push(find[i]);
			if (auto)
				data.auto.push(find[i]);
			if (index && auto)
				data.focus.push(find[i]);
		}
		return data;
	},
	/**. '{void setFocus(node node)}: Define o elemento focável para o nó.**/
	setFocus: function(node) {
		const data = this.getFocus(node);
		const body = __ARIA.getNodeBy(node, "aria-describedby");
		const head = __ARIA.getNodeBy(node, "aria-labelledby");
		const over = body === null ? {} : this.overFlow(body);
		const many = body === null ? false : this.tagDiverse(body).length > 0;
		let  focus = node;
		function focusout(ev) {
			ev.target.removeAttribute("tabindex");
			ev.target.removeEventListener("focusout", focusout);
		}
		/*-- conteúdo extenso: primeiro filho do conteúdo --*/
		if (over.x === true || over.y === true || many)
			focus = body.firstElementChild;
		/*-- autofocus focável --*/
		else if (data.focus.length > 0)
			focus = data.focus[0];
		/*-- elemento focável --*/
		else if (data.index.length > 0)
			focus = data.index[0];
		/*-- forçando o autofocus não focável --*/
		else if (data.auto.length > 0)
			focus = data.auto[0];
		/*-- forçando o título --*/
		else if (head !== null)
			focus = head;
		/*-- forçando o próprio nó --*/
		else
			focus = node;
		/*-- definindo focus --*/
		if (focus.tabIndex >= 0) {
			focus.focus();
		}
		else {
			focus.tabIndex = -1;
			focus.focus();
			focus.addEventListener("focusout", focusout);
		}
		return;
	},
};