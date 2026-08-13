/**
#3 Menu
	O objeto '{__MENU} cria um menu a partir de uma lista:
	- A lista principal é composta por rótulos (strings) ou sub-listas (array);
	- Rótulos definem o nome do menu ou seus itens;
	- Sub-listas definem um submenu, mas as mesmas regras da lista principal;
	- O primeiro rótulo da lista define o nome do menu;
	- Os rótulos seguintes definem um item de menu ou um grupo;
	- Um caracter especial antecedendo o rótulo define o tipo de item ou a abertura de um novo grupo:
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
	- Não é possível criar subgrupos;
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
	/**. '{object heap}: Registra os dados dos menus criados:
	|Nome|Tipo|Descrição|
	|'{type}|string|Tipo do menu ('{menu} ou '{menuButton})|
	|'{trigger}|node|Disparador que abre o '{menuButton}|
	|'{menu}|node|Nó HTML do menu|
	|'{call}|function|Função disparadora do menu|
	|""Propriedades Registradas dos Menus""|**/
	heap: {},
	/**. '{node li(string str, boolean div)}: Cria e retorna um nó de item ou grupo de menu (elemento '{li} ou '{div}).**/
	li: function(str, div) {
		const item  = /^\s*([-+.*#]|\&[^;]+\;)?\s*(.*)$/;
		const find  = String(str).match(item);
		const elem  = __HTML("div");
		const check = {
			"+": {role: "menuitemcheckbox", checked:  "true"}, "*": {role: "menuitemradio", checked:  "true"},
			"-": {role: "menuitemcheckbox", checked: "false"}, ".": {role: "menuitemradio", checked: "false"},
		};
		elem.innerHTML = find[2].trim();
		const text = elem.textContent.trim();
		/*-- grupo --*/
		if (find[1] === "#") {
			const head = __HTML("div", {role: "heading", "aria-level": 2, id: __ID.value, textContent: text})
			const root = __HTML("li",  {role: "group", "aria-labelledby": head.id, "data-label": str});
			root.appendChild(head);
			return root;
		}
		/*-- item --*/
		const li    = __HTML(div === true ? "div" : "li", {id: __ID.value, tabindex: -1, role: "menuitem", "data-label": str});
		const span1 = __HTML("span", {"aria-hidden": "true"});
		const span2 = __HTML("span", {"aria-hidden": "false", textContent: text});
		const span3 = __HTML("span", {"aria-hidden": "true"});
		/*-- check/radio --*/
		if (find[1] in check)
			__HTML(li, {role: check[find[1]].role, "aria-checked": check[find[1]].checked});
		/*-- ícone --*/
		else if (find[1])
			span1.innerHTML = find[1];
		/*-- métodos --*/
		li.appendChild(span1);
		li.appendChild(span2);
		li.appendChild(span3);
		li.addEventListener("mouseenter", this);
		li.addEventListener("focusin",    this);
		li.addEventListener("keydown",    this);
		li.addEventListener("click",      this);
		return li;
	},
	/**. '{node create(array list)}: Cria e retornar menus/submenus a partir de uma lista.**/
	create: function(list) {
		const menu  = __HTML("menu", {id: __ID.value, role: "menu", tabindex: -1});
		if (Array.isArray(list)) list.forEach(function(v,i,a) {
			const group = menu.childElementCount > 0 && menu.lastElementChild.getAttribute("role") === "group";
			/*-- título --*/
			if (i === 0) {
				const head  = __HTML("li", {role: "heading", "aria-level": 1, id: __ID.value, textContent: String(v).trim()});
				__HTML(menu, {"aria-labelledby": head.id, appendChild: [head], "data-label": v});
				return;
			}
			/*-- submenu --*/
			if (Array.isArray(v)) {
				const li  = __HTML("li", {role: "none"});
				const sub = this.create(v);
				const div = this.li(v[0], true);
				__HTML(div, {"aria-haspopup": "true", "aria-controls": sub.id, "aria-expanded": "false"});
				/*-- ajustes --*/
				sub.firstElementChild.remove();
				sub.setAttribute("aria-labelledby", div.id);
				sub.hidden = true;
				li.appendChild(div);
				li.appendChild(sub);
				(group ? menu.lastElementChild : menu).appendChild(li);
				return;
			}
			/*-- itens/check/radio/separador/grupo --*/
			const li = this.li(v, group);
			if (li.getAttribute("role") === "group") {
				if (i > 1) menu.appendChild(__HTML("li", {role: "separator"}));
				menu.appendChild(li);
			}
			else {
				(group ? menu.lastElementChild : menu).appendChild(li);
			}
			return;
		}, this);
		return menu;
	},
	/**. '{node menu(array list, function call)}: Cria um mecanismo de menu vertical a partir de uma lista**/
	menu: function(list, call) {
		const menu = this.create(list);
		const item = menu.querySelector(`[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]`);
		__HTML(menu, {className: "css-js-wd-menu", "aria-activedescendant": item.id});
		item.setAttribute("tabindex", "0");
		/*-- colocando na pilha --*/
		this.heap[menu.id] = {type: "menu", trigger: null, menu: menu, call: typeof call === "function" ? call : null};
		return menu;
	},
	/**. '{void attach(node trigger, array list, function call)}: Atribui um menu a um nó HTML ('{trigger})**/
	attach: function(trigger, list, call) {
		/*-- checando condições --*/
		if (!(trigger instanceof HTMLElement) || !Array.isArray(list)) return null;
		for (let i in this.heap) {
			if (this.heap[i].trigger === trigger)
				this.detach(trigger);
		}
		/*-- obtendo menu e definindo propriedades do elemento disparador --*/
		const menu = this.menu(list, call);
		__HTML(trigger, {
			"aria-haspopup": "true",
			"aria-controls": menu.id,
			"aria-expanded": "false",
			className: trigger.className + " css-js-wd-menu-open",
			tabindex: 0,
			addEventListener: {click: this.handlerMenuButton, keydown: this.handlerMenuButton},
		});
		/*-- manipulando pilha --*/
		this.heap[menu.id].type    = "menuButton";
		this.heap[menu.id].trigger = trigger;
		return;
	},
	/**. '{void dettach(node trigger)}: Remove o menu do nó HTML.**/
	detach: function(trigger) {
		const id = trigger.getAttribute("aria-controls");
		if (id in this.heap) {
			trigger.removeAttribute("aria-haspopup");
			trigger.removeAttribute("aria-controls");
			trigger.removeAttribute("aria-expanded");
			trigger.removeAttribute("tabindex");
			trigger.removeEventListener("click", this.handlerMenuButton);
			trigger.removeEventListener("keydown", this.handlerMenuButton);
			trigger.className = trigger.className.replace("css-js-wd-menu-open", "").replace(/\s+/g, " ").trim(),
			this.heap[id].menu.remove();
			delete this.heap[id];
		}
		return;
	},
	/**. '{void handlerMenuButton(object ev)}: Manipulador para definir comportamento do acionado do menu.**/
	handlerMenuButton: function(ev) {
		const click = ev.type === "keydown" && (ev.key === " " || ev.key === "ArrowDown" || ev.key === "Enter");
		if (ev.type === "click" || click) {
			const button = ev.currentTarget;
			const id     = button.getAttribute("aria-controls");
			const menu   = __MENU.heap[id].menu;
			__WINDOW.attach(menu, "float", function(x) {
				button.setAttribute("aria-expanded", x.close ? "false" : "true");
				if (!x.close)
					document.getElementById(menu.getAttribute("aria-activedescendant")).focus();
			});
		}
		return;
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
			else if ((role === "heading" || role === "separator") && all === true)
				list.push(v);
			else if (role === "none" || role === "group")
				this.items(v, all).forEach(function(x,y,z) {list.push(x);});
		}, this);
		return list;
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
		const item  = ev.currentTarget;
		const path  = this.path(ev.currentTarget);
		const items = this.items(path[path.length - 1]);
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
		/*-- abrir --*/
		if ((ev.key === "ArrowRight" || click) && item.getAttribute("aria-expanded") === "false")
			return item.click();
		/*-- fechar --*/
		if (ev.key === "ArrowLeft" && path.length > 1)
			return path[path.length - 1].previousElementSibling.click();
		/*-- caixa de checagem --*/
		if (click && (role === "menuitemcheckbox" || role === "menuitemradio" || role === "menuitem"))
			return item.click();
		return;
	},
	/**. '{void click(object ev)}: Manipulador para abrir e fechar submenu pelo mouse.**/
	click: function(ev) {
		const item     = ev.currentTarget;
		const path     = this.path(item);
		const role     = item.getAttribute("role");
		const checked  = item.getAttribute("aria-checked") === "true";
		/*-- abrir e fechar submenu --*/
		if (role === "menuitem" && item.hasAttribute("aria-haspopup")) {
			const expanded = item.getAttribute("aria-expanded") === "true";
			const submenu  = document.getElementById(item.getAttribute("aria-controls"));
			const items    = this.items(path[path.length - 1], true);
			/*-- alterar atributo e exibir/ocultar menu --*/
			item.setAttribute("aria-expanded", expanded ? "false" : "true");
			submenu.hidden = expanded;
			/*-- focando --*/
			(expanded ? item.focus() : this.items(submenu)[0].focus());
			/*-- ocultando/exibindo --*/
			items.forEach(function(v,i,a) {v.hidden = !(expanded || v === item);});
			/*-- ocultando/exibindo submenu ancestrais --*/
			if (path.length > 1) {
				const target = path[path.length - 1].previousElementSibling;
				target.hidden = !expanded;
			}
			return;
		}
		/*-- acionamento de itens --*/
		const data = {type: null, path: [], checked: false};
		const heap = path[0].id in this.heap ? this.heap[path[0].id] : null;
		if (role === "menuitem") {
			data.type = "item";
		}
		else if (role === "menuitemcheckbox") {
			item.setAttribute("aria-checked", checked ? "false" : "true");
			data.type    = "checkbox";
			data.checked = !checked;
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
		if (data.type !== null && heap !== null) {
			if (heap.call !== null) {
				data.path = this.line(item);
				heap.call(data);
			}
			if (heap.type === "menuButton")
				__WINDOW.detach(heap.menu);
		}
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador do menu chamado durante os eventos '{keydown}, '{click}, e {mouseover}.**/
	handleEvent: function(ev) {return this[ev.type](ev);},
};
__CSS.push(`/*-- MENU --*/
:root {
	--var-js-wd-menu-fg: #202020;
	--var-js-wd-menu-bg: #f9f9f9;
	--var-js-wd-menu-hv: #eeeeee;
}
.css-js-wd-menu {
	/*display: inline-block;*/
	list-style: none;
	padding: 0.5em;
	margin: 0;
	color: var(--var-js-wd-menu-fg);
	background: var(--var-js-wd-menu-bg);
	border-radius: 0.2em;
	border: thin solid black;
	font-size: 14px;
	font-family: Lucida Sans, sans-serif;
	box-shadow: 0.25em 0.25em 0 0 #cccccc;
}
.css-js-wd-menu [role="menu"] {
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
}
.css-js-wd-menu [role="heading"][aria-level="1"],
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
	background: var(--var-js-wd-menu-hv);
}
.css-js-wd-menu [role="heading"][aria-level="1"],
.css-js-wd-menu [role="menuitem"][aria-expanded="true"] {
	font-weight: bold;
	text-align: center;
	margin-bottom: 0.5em;
	background: var(--var-js-wd-menu-hv);
}
.css-js-wd-menu [role="heading"][aria-level="2"] {
	font-style: italic;
	font-size: smaller;
	opacity: 0.8;
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