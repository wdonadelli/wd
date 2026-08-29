/**
#3 Menu
	O objeto '{__MENU} cria um menu a partir de uma lista (array):
	- A lista é composta por rótulos (strings) ou sub-listas (array);
	- Rótulos definem o nome e o tipo de item ou o nome do grupo;
	- Sub-listas definem um submenu com as mesmas regras da lista principal;
	- O primeiro rótulo da sub-lista define o rótulo do submenu;
	- Itens podem ser do tipo '{item} (com ou sem ícone), '{checkbox} ou '{radio};
	- O ícone, o tipo e o estado do item são definidos pelos caracteres que antecedem o valor de seu rótulo:
	|Caractere|Tipo|Estado|
	|&{#x002B}|'{checkbox}|Checado|
	|&{#x002D}|'{checkbox}|Não Checado|
	|&{#x002A}|'{radio}|Selecionado|
	|&{#x002E}|'{radio}|Não Selecionado|
	|'{&unicode;}|'{item}|Item com ícone definido pelo caracter unicode|
	||'{item}|Item sem ícone|
	|&{#x0023}|'{group}|Define a abertura de um grupo|
	|""Tabela de caracteres para criação de itens de menu e grupos""|
	- O caractere especial não será exibido no rótulo do item ou grupo;
	- Não é possível criar subgrupos, mas é possível criar submenus;
	- O relacionamento entre os itens de '{radio} são estabelecidos entre aqueles dentro de um mesmo menu ou grupo;
	- Uma função opcional ('{call}) será retornará a cada interação com o menu recebendo como argumento um objeto:
	|Nome|Tipo|Descrição|
	|'{type}|string|O tipo de item: '{item}, '{checkbox} ou '{radio}|
	|'{checked}|boolean|É verdadeiro se um '{checkbox} ou '{radio} tiver sido checado/selecionado|
	|'{path}|array|Linha sucessória do menu principal ao item interagido|
	|""Tabela das propriedades retornadas como argumento de '{call}""|
	- A propriedade '{path} retornará os rótulos dos menus/submenus, dos grupos e do item interagido, da raiz ao item; e
	- O caminho fornecido em '{path} é idêntico aos rótulos informados na lista, incluindo os caracteres especiais.**/
const __MENU = {
	/**. '{node createItem(string str, boolean div)}: Cria e retorna um nó de item ('{li}) ou grupo de menu ('{div}).**/
	createItem: function(str, div) {
		const item  = /^\s*([-+.*#]|\&[^;]+\;)?\s*(.*)$/;
		const find  = String(str).match(item);
		const text = String(find[2]).trim();
		const elem  = __HTML("div");
		const check = {
			"+": {role: "menuitemcheckbox", checked:  "true"}, "*": {role: "menuitemradio", checked:  "true"},
			"-": {role: "menuitemcheckbox", checked: "false"}, ".": {role: "menuitemradio", checked: "false"},
		};
		/*-- grupo --*/
		if (find[1] === "#") {
			const head = __HTML("div", {role: "presentation", id: __ID.value, textContent: text})
			const list = __HTML("ul",  {role: "group", id: __ID.value, "aria-labelledby": head.id, "data-label": text})
			const item = __HTML("li",  {role: "none"});
			item.appendChild(head);
			item.appendChild(list);
			return item;
		}
		/*-- item/checkbox/radio --*/
		const role  = find[1] in check ? check[find[1]].role : "menuitem";
		const event = {mouseenter: this, focusin: this, keydown: this, click: this};
		const tag   = div === true ? "div" : "li";
		const icon  = role === "menuitem" && find[1] ? find[1] : "";
		const li    = __HTML(tag, {id: __ID.value, tabindex: -1, role: role, addEventListener: event, "data-label": text});
		const span1 = __HTML("span", {"aria-hidden": "true",  innerHTML:   icon});
		const span2 = __HTML("span", {"aria-hidden": "false", textContent: text});
		const span3 = __HTML("span", {"aria-hidden": "true"});
		if (role !== "menuitem") __HTML(li, {"aria-checked": check[find[1]].checked});
		li.appendChild(span1);
		li.appendChild(span2);
		li.appendChild(span3);
		return li;
	},


	//TODO retorna a quantidade de caracteres do item com mais caracteres para definir o tamanho do menu
	char: function(list) {
		let char = 0;
		list.forEach(function(v,i,a) {
			const len = Array.isArray(v) ? this.char(v) : String(v).trim().length;
			char = char > len ? char : len;
		}, this);
		return char;
	},

	/**. '{node createMenu(array list)}: Cria e retornar menus/submenus a partir de uma lista.**/
	createMenu: function(list) {
		const menu = __HTML("menu", {id: __ID.value, role: "menu"});
		(Array.isArray(list) ? list : []).forEach(function(v,i,a) {
			const last  = menu.childElementCount > 0 ? menu.lastElementChild : null;
			const child = last ? last.children : [];
			const group = child.length > 1 && child[1].getAttribute("role") === "group" ? child[1] : null ;
			/*-- submenu --*/
			if (Array.isArray(v)) {
				const li  = __HTML("li", {role: "none"});
				const sub = this.createMenu(v);
				const ctr = this.createItem(v[0], true);
				__HTML(ctr, {"aria-haspopup": "true", "aria-controls": sub.id, "aria-expanded": "false"});
				/*-- ajustes --*/
				ctr.firstElementChild.innerHTML = "";
				ctr.lastElementChild.innerHTML  = "";
				sub.firstElementChild.remove();
				sub.setAttribute("aria-labelledby", ctr.id);
				sub.setAttribute("data-label", ctr.textContent);
				sub.hidden = true;
				li.appendChild(ctr);
				li.appendChild(sub);
				(group ? group : menu).appendChild(li);
				return;
			}
			/*-- demais items --*/
			const li = this.createItem(v, group);
			const gp = li.childElementCount > 1 && li.children[1].getAttribute("role") ==="group";
			/*-- grupo/separador --*/
			if (gp) {
				if (i > 0) menu.appendChild(__HTML("li", {role: "separator"}));
				menu.appendChild(li);
				return;
			}
			/*-- itens/check/radio --*/
			(group ? group : menu).appendChild(li);
			return;
		}, this);
		return menu;
	},
	/**. '{void attach(node node, array list, string type, function call)}: Atribui um menu vertical a um nó HTML:
	|Argumento|Descrição|
	|'{node}|Elemento HTML que acomodará ou acionará o menu|
	|'{list}|Lista contendo os item e subitens do menu|
	|'{type}|Forma de apresentação do menu, '{float} (padrão) ou '{block}|
	|'{call}|Função a ser chamada ao clicar no menu|
	|""Tabela descrevendo os argumentos do método '{attach}""|**/
	attach: function(node, list, type, call) {
		if (!(node instanceof HTMLElement) || !Array.isArray(list)) return null;
		type = (/\s*(float|block)\s*/i).test(type) ? type.toLowerCase().trim() : "float";
		call = typeof call === "function" ? call : null;
		/*-- criando e configurando condições iniciais do menu --*/
		const menu = this.createMenu(list);
		const char = this.char(list); console.log({char:char});
		const init = menu.querySelector(`[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]`);
		init.setAttribute("tabindex", "0");
		//FIXME aria-labelled do menu (pegar do container agrupador)
		__HTML(menu, {className: "css-js-wd-menu", "aria-activedescendant": init.id});
		/*-- definindo registro do anexação --*/
		const data = {
			attr: __HEAP.getAttr(node, "aria-haspopup", "aria-controls", "aria-expanded", "class", "tabindex"),
			menu: menu, node: node, list: list, call: call, type: type,
		};
		__HEAP.attach(node, data, this);
		/*-- definindo propriedades do elemento disparador (somente para float) --*/
		if (type === "float") __HTML(node, {
			"aria-haspopup": "true",
			"aria-controls": menu.id,
			"aria-expanded": "false",
			classList: {add: "css-js-wd-menu-open"},
			tabindex: 0,
			addEventListener: {click: this.openMenu, keydown: this.openMenu},
		});
		else {
			node.innerHTML = "";
			node.appendChild(menu);
		}
		return;
	},
	/**. '{void dettach(node node)}: Desmontar o menu.**/
	detach: function(node) {
		const data = __HEAP.data(node);
		if (data !== null) {
			data.menu.remove();
			__HEAP.resetAttr(data.attr);
			__HTML(node, {removeEventListener: {click: this.openMenu, keydown: this.openMenu}});
		}
		return;
	},
	/**. '{boolean openMenu(object ev)}: Retorna verdadeiro se o evento de clique for para abrir o menu.**/
	openMenu: function(ev) {
		const keys = /^(\ |ArrowDown|Enter|\ )$/i;
		const open = ev.type === "click" || (ev.type === "keydown" && keys.test(ev.key));
		const data = __HEAP.data(ev.currentTarget);
		if (open && data && data.type === "float") {
			__WINDOW.attach(data.menu, "float", function(x) {
				data.node.setAttribute("aria-expanded", x.close ? "false" : "true");
				if (!x.close)
					document.getElementById(data.menu.getAttribute("aria-activedescendant")).focus();
			});
		}
		return false;
	},
	/**. '{array path(node item)}: Retorna a lista de menus ancestrais a partir do item, da raiz para o atual.**/
	path: function(item) {
		const path = [];
		while(item !== null && !item.hasAttribute("aria-activedescendant")) {
			if (item.getAttribute("role") === "menu")
				path.unshift(item);
			item = item.parentElement;
		}
		path.unshift(item);
		return path;
	},
	/**. '{array line(node item)}: Retorna a lista de rótulos dos menus e grupos ancestrais do item, inclusive, conforme especificado no array original.**/
	line: function(item) {
		const path = [item.getAttribute("data-label")];
		while(item !== null && !item.hasAttribute("aria-activedescendant")) {
			let role = item.getAttribute("role");
			if (role === "menu" || role === "group")
				path.unshift(item.getAttribute("data-label"));
			item = item.parentElement;
		}
		path.unshift(item.getAttribute("data-label"));
		return path;
	},
	/**. '{array items(node box, boolean all)}: Retorna a u{lista de itens do menu/grupo} ou todos os visíveis se o argumento '{all} for verdadeiro.**/
	items: function(box, all) {
		const list = [];
		Array.from(box.children).forEach(function(v,i,a) {
			const role = v.getAttribute("role");
			if (role === "menuitem" || role === "menuitemcheckbox" || role === "menuitemradio")
				list.push(v);
			else if (all === true && (role === "separator" || role === "presentation"))
				list.push(v);
			else if (role === "none" || role === "group")
				this.items(v, all).forEach(function(x,y,z) {list.push(x);});
		}, this);
		return list;
	},
	/**. '{array siblings(node item)}: Retorna a u{lista de itens visíveis} do menu/submenu.**/
	siblings: function(item) {//ainda não funciona
		const path = this.path(item);
		const role = item.getAttribute("role");
		const gate = role === "menuitem" && item.hasAttribute("aria-haspopup") && item.hasAttribute("aria-controls");
		const open = gate && item.getAttribute("aria-expanded") === "true";
		/*-- item controlador aberto --*/
		if (gate && item.getAttribute("aria-expanded") === "true") {
			const ctrl = item.getAttribute("aria-controls");
			const menu = document.getElementById(ctrl);
			return [item].concat(this.items(menu));
		}
		/*-- item ou controlador fechado no submenu --*/
		if (path.length > 1) {
			const menu = path[path.length - 1];
			const crtl = document.querySelector(`[aria-controls="${menu.id}"]`);
			return [crtl].concat(this.items(menu));
		}
		/*-- item ou controlador fechado no menu principal --*/
		return this.items(path[0]);
	},
	/**. '{node group(node elem)}: Retorna o menu ou grupo associado ao elemento.**/
	group: function(elem) {
		while(elem !== null && !(/^(menu|group)$/i).test(elem.getAttribute("role")))
			elem = elem.parentElement;
		return elem;
	},
	/**. '{void mouseenter(object ev)}: Manipulador para definir foco no item pelo mouse.**/
	mouseenter: function(ev) {
		if (ev.currentTarget.getAttribute("aria-expanded") !== "true")
			ev.currentTarget.focus();
		return;
	},
	/**. '{void focusin(object ev)}: Manipulador para definir item ativo do menu.**/
	focusin: function(ev) {
		const root = this.path(ev.currentTarget)[0];
		/*-- definir o item ativo --*/
		root.setAttribute("aria-activedescendant", ev.currentTarget.id);
		/*-- item que ganhou foco --*/
		ev.currentTarget.setAttribute("tabindex", "0");
		/*-- item que perdeu foco --*/
		if (root.contains(ev.relatedTarget))
			ev.relatedTarget.setAttribute("tabindex", "-1");
		return;
	},
	/**. '{void keydown(object ev)}: Manipulador para navegar pelos itens.**/
	keydown: function(ev) {
		/*-- manipulação dos itens --*/
		const item  = ev.currentTarget;
		const path  = this.path(ev.currentTarget);
		const items = this.siblings(item);
		const index = items.indexOf(ev.currentTarget);
		const click = ev.key === "Enter" || ev.key === " ";
		const role  = ev.currentTarget.getAttribute("role");
		/*-- prevenir comportamento padrão --*/
		if ((/^(Arrow(Down|Up|Left|Right)|Home|End|Enter|\ )$/).test(ev.key))
			ev.preventDefault();
		/*-- baixo --*/
		if (ev.key === "ArrowDown")
			return items[(index + 1)%items.length].focus();
		/*-- topo --*/
		if (ev.key === "ArrowUp")
			return items[(items.length + index - 1)%items.length].focus();
		/*-- primeiro/último --*/
		if (ev.key === "Home" || ev.key === "End")
			return items[ev.key === "Home" ? 0 : items.length - 1].focus();
		//FIXME adicionar pageup e pagedown
		/*-- abrir submenu pelo controlador --*/
		if (item.getAttribute("aria-expanded") === "false" && (ev.key === "ArrowRight" || click))
			return item.click();
		/*-- voltar ao menu pelo controlador --*/
		if (item.getAttribute("aria-expanded") === "true" && (ev.key === "ArrowLeft" || click))
			return item.click();
		/*-- voltar ao menu pelos itens --*/
		if (ev.key === "ArrowLeft" && path.length > 1)
			return document.querySelector(`[aria-controls="${path[path.length - 1].id}"]`).click();
		/*-- caixa de checagem --*/
		if (click && (role === "menuitemcheckbox" || role === "menuitemradio" || role === "menuitem"))
			return item.click();
		return;
	},
	/**. '{void click(object ev)}: Manipulador para abrir e fechar submenu pelo mouse.**/
	click: function(ev) {
		/*-- manipulação dos itens --*/
		const item  = ev.currentTarget;
		const path  = this.path(item);
		const find  = document.querySelector(`[aria-controls="${path[0].id}"]`);
		const heap  = __HEAP.data(find === null ? path[0].parentElement : find);
		const role  = item.getAttribute("role");
		const check = item.getAttribute("aria-checked") === "true";
		/*-- submenu: abrir/fechar --*/
		if (role === "menuitem" && item.hasAttribute("aria-haspopup")) {
			const expanded = item.getAttribute("aria-expanded") === "true";
			const submenu  = document.getElementById(item.getAttribute("aria-controls"));
			const items    = this.items(path[path.length - 1], true);
			/*-- alterar atributo e exibir/ocultar menu --*/
			item.setAttribute("aria-expanded", expanded ? "false" : "true");
			item.focus();
			/*-- ocultando/exibindo --*/
			submenu.hidden = expanded;
			items.forEach(function(v,i,a) {v.hidden = !(expanded || v === item);});
			/*-- ocultando/exibindo submenu ancestrais --*/
			if (path.length > 1) {
				const target = path[path.length - 1].previousElementSibling;
				target.hidden = !expanded;
			}
			return;
		}
		/*-- acionamento de itens --*/
		const data = {type: null, path: this.line(item), checked: false};
		if (role === "menuitem") {
			data.type = "item";
		}
		else if (role === "menuitemcheckbox") {
			item.setAttribute("aria-checked", check ? "false" : "true");
			data.type    = "checkbox";
			data.checked = !check;
		}
		else if (role === "menuitemradio") {
			const group = this.group(item);
			const items = this.items(group);
			Array.from(items).forEach(function(v,i,a) {
				if (v.getAttribute("role") === "menuitemradio" && v.parentElement === group)
					v.setAttribute("aria-checked", item === v ? "true" : "false");
			});
			data.type = "radio";
			data.checked = true;
		}
		/*-- chamando disparador --*/
		if (data.type && heap) {
			if (heap.call !== null)
				heap.call(data);
			if (heap.type === "float")
				__WINDOW.detach(heap.menu);
		}
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador principal do objeto.**/
	handleEvent: function(ev) {
		if (ev.type in this) this[ev.type](ev);
		return;
	},
};
__CSS.push(`/*-- MENU --*/
.css-js-wd-menu {
	/*display: inline-block;*/
	list-style: none;
	padding: 0.5em;
	margin: 0;
	color: inherit;
	background: inherit;
	border-radius: 0.2em;
	border: 1px solid;
	font-size: 14px;
	font-family: Lucida Sans, sans-serif;
	box-shadow: 0.25em 0.25em 0 0;
}
.css-js-wd-menu ul, .css-js-wd-menu menu {
	list-style: none;
	padding: 0;
	margin: 0
}
.css-js-wd-menu li {
	padding: 0;
	margin: 0;
}
.css-js-wd-menu [role="separator"] {
	border-bottom: thin solid #bbbbbb;
	margin: 0.5em 0;
}
.css-js-wd-menu [role="menuitem"],
.css-js-wd-menu [role="menuitemcheckbox"],
.css-js-wd-menu [role="menuitemradio"] {
	position: relative;
	padding: 0.2em 1.5em;
	margin: 0;
	border-radius: 0.2em;
	text-align: left;
	cursor: pointer;
}
.css-js-wd-menu [role="menuitem"]:focus,
.css-js-wd-menu [role="menuitemcheckbox"]:focus,
.css-js-wd-menu [role="menuitemradio"]:focus {
	background: rgba(204,204,204,0.3);
}
.css-js-wd-menu [role="menuitem"][aria-expanded="true"] {
	font-weight: bold;
	text-align: center;
}
.css-js-wd-menu [role="presentation"] {
	font-weight: bold;
	/*font-size: smaller;
	opacity: 0.8;*/
}
.css-js-wd-menu [role="menuitem"]         > span:first-child,
.css-js-wd-menu [role="menuitemradio"]    > span:first-child,
.css-js-wd-menu [role="menuitemcheckbox"] > span:first-child,
.css-js-wd-menu [role="menuitem"]         > span:last-child,
.css-js-wd-menu [role="menuitemradio"]    > span:last-child,
.css-js-wd-menu [role="menuitemcheckbox"] > span:last-child {
	position: absolute;
	display: inline-block;
	top:    0.2em;
	bottom: 0.2em;
	width:  1.5em;
	text-align: center;
}
.css-js-wd-menu [role="menuitem"]         > span:first-child,
.css-js-wd-menu [role="menuitemradio"]    > span:first-child,
.css-js-wd-menu [role="menuitemcheckbox"] > span:first-child {left: 0;}
.css-js-wd-menu [role="menuitem"]         > span:last-child,
.css-js-wd-menu [role="menuitemradio"]    > span:last-child,
.css-js-wd-menu [role="menuitemcheckbox"] > span:last-child {right: 0;}
.css-js-wd-menu [role="menuitemcheckbox"][aria-checked="true"]  > span:first-child:before {content: "\\25A3";}
.css-js-wd-menu [role="menuitemcheckbox"][aria-checked="false"] > span:first-child:before {content: "\\25A1\\ ";}
.css-js-wd-menu [role="menuitemradio"][aria-checked="true"]     > span:first-child:before {content: "\\25C9";}
.css-js-wd-menu [role="menuitemradio"][aria-checked="false"]    > span:first-child:before {content: "\\25CB\\ ";}
.css-js-wd-menu [role="menuitem"][aria-expanded="true"]         > span:first-child:before {content: "\\276E";}
.css-js-wd-menu [role="menuitem"][aria-expanded="false"]        > span:last-child:before  {content: "\\276F\\ ";}
.css-js-wd-menu-open[aria-expanded="true"]:after  {content: "\\ \\25BE";}
.css-js-wd-menu-open[aria-expanded="false"]:after {content: "\\ \\25B8";}
`);