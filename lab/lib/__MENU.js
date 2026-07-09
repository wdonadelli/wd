/**
#3 Menu
O objeto '{__MENU} cria elementos de menus a partir de arrays:
- Um formulário HTML acomodará um conjunto de blocos de menu;
- Cada bloco de menu possui um cabeçalho e uma lista de itens (menu);
- Cada bloco será exibido de forma individual na posição vertical;
- Cada bloco de menu é definido por um array;
- O texto do cabeçalho do bloco é definido pelo conteúdo do primeiro item do array;
- O rótulo dos itens do menu é definido pelos demais itens do array;
- Se o item do array for um objeto, o texto será definido pela propriedade '{label};
- Se o item do array for outro array, um novo bloco (submenu) será criado;
- Demais valores definirão o texto do item ou do cabeçalho, conforme o caso;
- Os itens do menu podem avançar/retroceder pelos menus ou executar uma ação;
- Ao executar uma ação, o evento '{wdmenu} será disparado no formulário;
- A propriedade '{detail} do evento disparado conterá o conteúdo do respectivo item do array;
- Somente valores aceitos no formato JSON poderão ser utilizados.
**/
const __MENU = {
	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- MENU --*/
.css-js-wd-menu {
	display: inline-block;
	list-style: none;
	padding: 0.5em;
	margin: 0;
	color: black;
	border-radius: 0.2em;
	border: thin solid black;
	font-size: 14px;
	font-family: sans-serif;
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
	border-bottom: thin solid black;
}


.css-js-wd-menu [role="menuitem"],
.css-js-wd-menu [role="menuitemcheckbox"] {
	position: relative;
	padding: 0.2em 1.5em;
	margin: 0;
	border-radius: 0.25em;
	cursor: pointer;
}

.css-js-wd-menu [role="menuitem"]:hover,
.css-js-wd-menu [role="menuitem"]:focus,
.css-js-wd-menu [role="menuitemcheckbox"]:hover,
.css-js-wd-menu [role="menuitemcheckbox"]:focus {
	background: black;
	color: white;
}
.css-js-wd-menu [role="menuitem"][aria-expanded="true"] {
	font-weight: bold;
	text-align: center;
}
.css-js-wd-menu [role="menuitem"][aria-expanded]:after,
.css-js-wd-menu [role="menuitem"][aria-expanded]:before,
.css-js-wd-menu [role="menuitemcheckbox"]:before {
	position: absolute;
	display: inline-block;
	top:    0.2em;
	bottom: 0.2em;
	width:  1.5em;
	text-align: center;
}
.css-js-wd-menu [role="menuitem"][aria-expanded="false"]:after {
	right:  0;
	content: "\\276F";
}
.css-js-wd-menu [role="menuitem"][aria-expanded="true"]:before {
	left:   0;
	content: "\\276E";
}


.css-js-wd-menu [role="menuitemcheckbox"][aria-checked="true"]:before {
	left: 0;
	content: "\\2611\\ ";
}
.css-js-wd-menu [role="menuitemcheckbox"][aria-checked="false"]:before {
	left: 0;
	content: "\\2610\\ ";
}







/*
.css-js-wd-menu [role="menuitem"][aria-expanded="false"] ~ [role="menu"] {
	display: none;
}

.css-js-wd-menu [role="menuitem"][aria-expanded="true"] ~ [role="menu"] {
	display: block;
}
*/







`),

	heap: {},


	label: function(text) {
		const elem = __HTML("div");
		elem.innerHTML = String(text).trim();
		return elem.textContent;
	},

	menu: function(name, list) {
		const menu  = __HTML("menu", {"aria-label": String(name).trim(), role: "menu", id: __ID.value, tabindex: -1});
		const check = /^\s*\[\s*(x?)\s*\]\s*/i;

		if (Array.isArray(list)) list.forEach(function (v,i,a) {
			/*-- submenu --*/
			if (Array.isArray(v)) {
				const li  = __HTML("li", {role: "none"});
				const sub = this.menu(`${name}/${v[0]}`, v.slice(1));
				const div = __HTML("div", {
					textContent: this.label(v[0]),
					id: __ID.value,
					tabindex: -1,
					role: "menuitem",
					"aria-haspopup": "true",
					"aria-controls": sub.id,
					"aria-expanded": "false",
				});
				sub.hidden = true;
				li.appendChild(div);
				li.appendChild(sub);
				menu.appendChild(li);
			}
			/*-- separador --*/
			else if (String(v).trim() === "") {
				menu.appendChild(__HTML("li", {role: "separator"}));
			}
			/*-- checkbox --*/
			else if (check.test(v)) {
				menu.appendChild(__HTML("li", {
					role: "menuitemcheckbox",
					"aria-checked": v.match(check)[1].trim() === "" ? "false" : "true",
					id: __ID.value,
					textContent: this.label(v).replace(check, ""),
					tabindex: -1,
				}));
			}
			/*-- item --*/
			else {
				menu.appendChild(__HTML("li", {
					role: "menuitem",
					id: __ID.value,
					textContent: this.label(v),
					tabindex: -1,
				}));
			}
		}, this);
		return menu;
	},



	menuButton: function(target, name, list, call) {
		const menu = this.menu(name, list);
		__HTML(menu, {className: "css-js-wd-menu"});
		menu.addEventListener("mouseover", this);
		menu.addEventListener("keydown", this);
		menu.addEventListener("click", this);
		this.heap[menu.id] = {type: "menuButton", call: typeof call === "function" ? call : null};







		//TODO provisórios
		menu.setAttribute("aria-activedescendant", menu.querySelector(`[role="menuitem"]`).id);
		document.body.appendChild(menu);
	},





	/**. '{array getPath(node item)}: Retorna a lista de menus ancestrais a partir do item, da raiz para o atual.**/
	getPath: function(item) {
		const path = [];
		while(item !== null && !item.hasAttribute("aria-activedescendant")) {
			if (item.getAttribute("role") === "menu")
				path.unshift(item);
			item = item.parentElement;
		}
		path.unshift(item);
		return path;
	},
	/**. '{boolean isItem(node elem)}: Informa se o nó é um item de menu.**/
	isItem: function(elem) {
		return (/^menuitem(checkbox)?$/).test(elem.getAttribute("role"));
	},
	/**. '{array getItems(node item, boolean sep)}: Retorna a lista de itens do menu, do topo para base, e do separador, se definido .**/
	getItems: function(menu, sep) {
		return Array.from(menu.children).map(function(v,i,a) {
			const item = this.isItem(v);
			const line = sep === true && v.getAttribute("role") === "separator";
			const open = v.firstElementChild !== null && this.isItem(v.firstElementChild);
			return (item || line) ? v : (open ? v.firstElementChild : null);
		}, this).filter(function(v,i,a) {return v !== null;});
	},
	/**. '{void setActive(node item)}: Define o item ativo.**/
	setActive: function(item) {
		const path = this.getPath(item);
		path[0].setAttribute("aria-activedescendant", item.id);
		item.focus();
		return;
	},
	/**. '{void subMenu(boolean show, node menu)}: Define o submenu a abrir ou fechar.**/
	subMenu: function(show, menu) {
		const path  = this.getPath(menu);
		/*-- abre o menu --*/
		if (show) {
			const item = menu.parentElement.firstElementChild;
			const prev = this.getItems(path[path.length - 2], true);
			const next = this.getItems(path[path.length - 1]);
			/*-- exibe o submenu --*/
			menu.hidden = false;
			/*-- informar no ativador que o menu está aberto --*/
			item.setAttribute("aria-expanded", "true");
			/*-- esconder os itens do menu ancestral --*/
			prev.forEach(function(v,i,a) {v.hidden = v !== item;});
			/*-- foca o primeiro item do submenu --*/
			this.setActive(next[0]);
			/*-- esconder ativadores ancestrais --*/
			if (path.length > 2)
				path[path.length - 2].parentElement.firstElementChild.hidden = true;
		}
		/*-- fecha o menu, se não for o raiz --*/
		else if (path.length > 1) {
			const prev  = path[path.length - 2];
			const child = this.getItems(prev, true);
			/*-- esconde o submenu --*/
			menu.hidden = true;
			child.forEach(function(v,i,a) {
				/*-- ativador --*/
				if (v.getAttribute("aria-expanded") === "true") {
					/*-- informar no ativador que o menu está fechado --*/
					v.setAttribute("aria-expanded", "false");
					/*-- definir foco no ativador --*/
					this.setActive(v);
				}
				/*-- exibir os itens do menu ancestral --*/
				v.hidden = false;
			}, this);
			/*-- exibir ativador ancestral --*/
			if (path.length > 2)
				path[path.length - 2].parentElement.firstElementChild.hidden = false;
		}
		return;
	},


	/**. '{void mouseover(object ev)}: Manipulador para definir foco no item pelo mouse.**/
	mouseover: function(ev) {
		if (!this.isItem(ev.target) || ev.target.getAttribute("aria-expanded") === "true") return;
		return this.setActive(ev.target);
	},
	/**. '{void keydown(object ev)}: Manipulador para navegar pelos itens.**/
	keydown: function(ev) {
		if (!this.isItem(ev.target) || ev.target.getAttribute("aria-expanded") === "true") return;
		const path  = this.getPath(ev.target);
		const items = this.getItems(path[path.length - 1]);
		const index = items.indexOf(ev.target);
		const click = ev.key === "Enter" || ev.key === " ";
		const role  = ev.target.getAttribute("role");
		/*-- baixo --*/
		if (ev.key === "ArrowDown") {
			const active = items[(index + 1)%items.length];
			return this.setActive(active);
		}
		/*-- topo --*/
		if (ev.key === "ArrowUp") {
			const active = items[(items.length + index - 1)%items.length];
			return this.setActive(active);
		}
		/*-- primeiro/último --*/
		if (ev.key === "Home" || ev.key === "End") {
			const active = items[ev.key === "Home" ? 0 : items.length - 1];
			return this.setActive(active);
		}
		/*-- abrir --*/
		if ((ev.key === "ArrowRight" || click) && ev.target.getAttribute("aria-expanded") === "false") {
			return this.subMenu(true, ev.target.nextElementSibling);
		}
		/*-- fechar --*/
		if (ev.key === "ArrowLeft" && path.length > 1) {
			return this.subMenu(false, path[path.length - 1]);
		}
		/*-- caixa de checagem --*/
		if (click && (role === "menuitemcheckbox" || role === "menuitemradio")) {
			return this.click(ev);
		}
		return;
	},
	/**. '{void click(object ev)}: Manipulador para abrir e fechar submenu pelo mouse.**/
	click: function(ev) {
		if (!this.isItem(ev.target)) return;
		const role = ev.target.getAttribute("role");
		/*-- abrir e fechar submenu --*/
		if (role === "menuitem" && ev.target.hasAttribute("aria-expanded")) {
			const open = ev.target.getAttribute("aria-expanded") === "false";
			return this.subMenu(open, ev.target.nextElementSibling);
		}
		/*-- checagem de caixa --*/
		if (role === "menuitemcheckbox") {
			const open = ev.target.getAttribute("aria-checked") === "true";
			ev.target.setAttribute("aria-checked", open ? "false" : "true");
			return;
		}


	},



	fire: function(ev) {
		const menu = ev.currentTarget;
		const item = this.isItem(ev.target) && !ev.target.hasAttribute("aria-haspopup") ? ev.target : null;
		const heap = menu.id in this.heap ? this.heap[menu.id] : null;
		const fire = ev.type === "click" || (ev.type === "keydown" && (ev.key === "Enter" || ev.key === " "));
		const type = {menuitem: "item", menuitemcheckbox: "checkbox", menuitemradio: "radio"};
		if (!item || !heap || !fire) return;

		/*-- acionando disparador do usuário --*/
		if (heap.call !== null) heap.call({
			type:    type[item.getAttribute("role")],
			checked: item.getAttribute("aria-checked") === "true",
			label:   item.textContent,
			path:    item.parentElement.getAttribute("aria-label"),
		});

		/*-- fechando diálogo --*/
		if (heap.type === "menuButton" && (ev.type === "click" || ev.key === "Enter")) {
			console.log("Fechar e mudar botão");


		}

		return;

	},




	handleEvent: function(ev) {
		this[ev.type](ev);
		this.fire(ev);








	},







};















































const nada = {
	/**. '{string label(any input)}: Devolve o valor do rótulo conforme item do array ou nulo.**/
	_label: function(input) {
		const test = new __Type(input);
		if (test.object)
			return "label" in input ? String(input.label) : null;
		if (test.array && input.length > 0)
			return this.label(input[0]);
		if (test.null || test.undefined)
			return null;
		return String(input);
	},
	/**. '{object design(array list, string home, array step, array main)}: Organiza as informações para a construção do menu:
	|Argumento|Descrição|
	|list|Lista u{obrigatória} que definirá a estrutura do menu.|
	|home|Identificador do item ancestral ao submenu.|
	|step|Lista que representa os níveis de navagação do menu.|
	|main|Lista onde será registrado cada informação dos menus|
	. Retorna um objeto contendo:
	|Propriedade|Tipo|Descrição|
	|menus|array|Lista de informações sobre menus|
	|back|object|A relação entre o menu é o submenu pelos identificadores|
	|data|object|Informações sobre os dados enviados nos arrays pelos identificadores|**/
	design: function(list, home, step, main) {
		home = typeof home === "string" ? home : null;
		step = Array.isArray(step) ? step.slice() : [];
		main = typeof main === "object" ? main : {menus: [], back: {}, data: {}};
		/*-- obter dados e estruturar menu --*/
		const menu = {items: [], submenus: [], home: home, step: step};
		list.forEach(function(v,i,a) {
			const test = new __Type(v);
			const text = this.label(v);
			const item = {};
			const back = i === 1 && home !== null;
			const open = i > 1 && test.array && v.length > 0;
			if (i === 0) {
				menu.label = text === null ? `Menu ${step.length+1}` : text;
				menu.step.push(menu.label);
			}
			else {
				item.label = text === null ? `Item ${step.length}.${i}` : text;
				item.open  = open ? __ID.value : null;
				item.back  = back ? home : null;
				item.id    = back ? main.back[home] : __ID.value;
				item.value = JSON.stringify(open || back ? "" : v);
				item.focus = main.menus.length === 0 && i === 1;
				menu.items.push(item);
				if (open) {
					main.back[item.id] = item.open;
					const submenu = v.slice();
					submenu.splice(1, 0, menu.label);
					menu.submenus.push({list: submenu, home: item.id});
				}
			}
		}, this);
		/*-- adicionando menus --*/
		main.menus.push(menu);
		/*-- adicionando submenus --*/
		for (let i = 0; i < menu.submenus.length; i++) {
			let info = menu.submenus[i];
			this.design(info.list, info.home, menu.step, main);
		}
		return main;
	},
	/**. '{object createMenuItem(object data)}: Retorna a estrutura do item de menu.**/
	createMenuItem: function(data) {
		const item = {tag: "button", child: [], attr: {
			id: data.id,
			innerHTML: data.label,
			type: "button",
			value: data.value,
			autofocus: data.focus,
			tabIndex: data.focus ? 0 : -1,
		}};
		if (data.open !== null) {
			item.attr["aria-controls"] = data.open;
			item.attr["aria-haspopup"] = "true";
			item.attr["aria-expanded"] = "false";
		}
		if (data.back !== null) {
			item.attr["aria-controls"] = data.back;
		}
		return item;
	},
	/**. '{object createMenu(object data)}: Retorna a estrutura do menu.**/
	createMenu: function(data) {
		const menu = {tag: "menu", attr: {}, child: []};
		for (let i = 0; i < data.items.length; i++)
			menu.child.push({tag: "li", attr: {}, child: [this.createMenuItem(data.items[i])]});
		if (data.home !== null)
			menu.attr["aria-labelledby"] = data.home;
		else
			menu.attr["aria-label"] = data.label;
		return menu;
	},
	/**. '{object createHead(object data)}: Retorna a estrutura do cabeçalho do menu.**/
	createHead: function(data) {
		const deep = data.step.length;
		const text = data.step.join(" / ");
		const head = {tag: deep <= 6 ? `h${deep}` : "div", child: [], attr: {textContent: text, id: __ID.value}};
		if (deep > 6) {
			head.attr.role = "heading";
			head.attr["aria-level"] = deep;
		}
		return head;
	},
	/**. '{object createBox(object data)}: Retorna a estrutura do container do menu.**/
	createBox: function(data) {
		const head = this.createHead(data);
		const menu = this.createMenu(data);
		return {tag: "section", child: [head, menu], attr: {
			className: "css-wd-menu",
			hidden: data.step.length > 1,
			"aria-labelledby": head.attr.id,
		}};
	},
	/**. '{node create(array list)}: Retorna o menu.**/
	create: function(list) {
		if (!Array.isArray(list)) return null;
		const data = this.design(list);
		const fire = {click: this, keydown: this, mouseover: this, focusin: this, focusout: this};
		const form = {tag: "div", attr: {addEventListener: fire}, child: []};
		for (let i = 0; i < data.menus.length; i++)
			form.child.push(this.createBox(data.menus[i]));
		return __DOM(form, document.body).tag;
	},
	/**. '{void view(string show, string hide)}: Exibe e esconde os menus pelos seus identificadores.**/
	view: function(show, hide) {
		const open = document.getElementById(show);
		const lock = document.getElementById(hide);
		if (open.hasAttribute("aria-expanded"))
			open.setAttribute("aria-expanded", "false");
		if (lock.hasAttribute("aria-expanded"))
			lock.setAttribute("aria-expanded", "true");
		open.parentElement.parentElement.parentElement.hidden = false;
		lock.parentElement.parentElement.parentElement.hidden = true;
		open.focus();
		return;
	},
	/**. '{void wdmenu(object ev)}: Manipulador para disparar evento "wdmenu" ao clicar em botão de ação.**/
	wdmenu: function(ev) {
		let data = null;
		try {data = JSON.parse(ev.target.value);} catch(e) {};
		const event = new CustomEvent("wdmenu", {detail: data, bubbles: true});
		ev.target.dispatchEvent(event);
		return;
	},
	/**. '{void click(object ev)}: Manipulador para cliques.**/
	click: function(ev) {
		const ctrl = ev.target.hasAttribute("aria-controls");
		const show = ctrl ? ev.target.getAttribute("aria-controls") : null;
		const hide = ev.target.id;
		return ctrl ? this.view(show, hide) : this.wdmenu(ev);
	},
	/**. '{void keydown(object ev)}: Manipulador para teclado.**/
	keydown: function(ev) {
		const item  = ev.target.parentElement;
		const menu  = item.parentElement;
		const list  = Array.from(menu.children);
		const index = list.indexOf(item);
		const width = list.length;
		if (ev.key === "Home")
			menu.firstElementChild.firstElementChild.focus();
		else if (ev.key === "End")
			menu.lastElementChild.firstElementChild.focus();
		else if (ev.key === "ArrowDown")
			list[(index + 1)%width].firstElementChild.focus();
		else if (ev.key === "ArrowUp")
			list[(width + index - 1)%width].firstElementChild.focus();
		else if (ev.key === "ArrowLeft" && menu.hasAttribute("aria-labelledby"))
			this.view(menu.getAttribute("aria-labelledby"), ev.target.id);
		else if (ev.key === "ArrowRight" && ev.target.hasAttribute("aria-expanded"))
			this.view(ev.target.getAttribute("aria-controls"), ev.target.id);
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador do menu chamado durante os eventos '{keydown}, '{click}, '{focusin}, '{focuout} e {mouseover}.**/
	handleEvent: function(ev) {
		if (ev.target.tagName.toLowerCase() !== "button") return;
		const re  = /^(ArrowDown|ArrowUp|ArrowRight|ArrowLeft|Home|End)$/;
		ev.stopPropagation();
		if (ev.type === "mouseover") {
			ev.target.focus();
		}
		else if (ev.type === "focusin") {
			ev.target.tabIndex  = 0;
			ev.target.autofocus = false;
		}
		else if (ev.type === "focusout") {
			const exit = ev.relatedTarget === null || !ev.currentTarget.contains(ev.relatedTarget);
			if (!exit) ev.target.tabIndex = -1;
		}
		else if (ev.type === "click") {
			this.click(ev);
		}
		else if (ev.type === "keydown" && re.test(ev.key)) {
			ev.preventDefault();
			this.keydown(ev);
		}
		return;
	},
};