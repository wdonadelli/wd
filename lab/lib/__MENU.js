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
.css-wd-menu {
	padding: 0.3em;
	margin: 0;
	color: black;
	border-radius: 0.2em;
	border: thin solid black;
	font-size: var(--var-js-wd-font-size);
	font-family: var(--var-js-wd-font-type);
}
.css-wd-menu * {
	font-size: inherit;
	font-family: inherit;
}
.css-wd-menu menu {
	list-style: none;
	padding: 0;
	margin: 0
}
.css-wd-menu li {
	padding: 0;
	margin: 0.3em 0 0 0;
}
.css-wd-menu > *:first-child {
	text-align: center;
	font-weight: bold;
	padding: 0;
	margin: 0.3em 0 0 0;
}
.css-wd-menu button {
	text-align: left;
	font-weight: normal;
	cursor: pointer;
}
.css-wd-menu button {
	position: relative;
	display: block;
	width: 100%;
	margin: 0;
	padding: 0.25em 2em;
	font-size: inherit;
	font-family: inherit;
	border-radius: 0.2em;
}
.css-wd-menu [aria-controls]:after {
	display: inline-block;
	position: absolute;
	width: 2em;
	text-align: center;
	content: "\\276E";
	left: 0;
}
.css-wd-menu [aria-controls][aria-expanded]:after {
	content: "\\276F";
	left: auto;
	right: 0;
}`),
	/**. '{string label(any input)}: Devolve o valor do rótulo conforme item do array ou nulo.**/
	label: function(input) {
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
		const list  = Array.prototype.slice.call(menu.children);
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