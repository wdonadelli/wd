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
:root {
	--var-js-wd-menu-fg: #202020;
	--var-js-wd-menu-bg: #ffffff;
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
.css-js-wd-menu [role="menuitemcheckbox"],
.css-js-wd-menu [role="menuitemradio"] {
	position: relative;
	padding: 0.2em 1.5em;
	margin: 0;
	border-radius: 0.2em;
	cursor: pointer;
}

.css-js-wd-menu [role="menuitem"]:hover,
.css-js-wd-menu [role="menuitem"]:focus,
.css-js-wd-menu [role="menuitemcheckbox"]:hover,
.css-js-wd-menu [role="menuitemcheckbox"]:focus,
.css-js-wd-menu [role="menuitemradio"]:hover,
.css-js-wd-menu [role="menuitemradio"]:focus {
	background: var(--var-js-wd-menu-hv);
}
.css-js-wd-menu [role="menuitem"][aria-expanded="true"] {
	font-weight: bold;
	text-align: center;
	margin-bottom: 0.5em;
	background: var(--var-js-wd-menu-hv);
}
.css-js-wd-menu [role="menuitem"]:after,
.css-js-wd-menu [role="menuitem"]:before,
.css-js-wd-menu [role="menuitemcheckbox"]:after,
.css-js-wd-menu [role="menuitemcheckbox"]:before,
.css-js-wd-menu [role="menuitemradio"]:after,
.css-js-wd-menu [role="menuitemradio"]:before {
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
	content: "\\2612";
}
.css-js-wd-menu [role="menuitemcheckbox"][aria-checked="false"]:before {
	left: 0;
	content: "\\2610\\ ";
}
.css-js-wd-menu [role="menuitemradio"][aria-checked="true"]:before {
	left: 0;
	content: "\\1F795\\ ";
}
.css-js-wd-menu [role="menuitemradio"][aria-checked="false"]:before {
	left: 0;
	content: "\\1F78E\\ ";
}


`),
	/**. '{object heap}: Registra os dados dos menus criados.**/
	heap: {},
	/**. '{string label(string text)}: Retorna o rótulo reformulado para os items dos menus.**/
	label: function(text) {
		const elem = __HTML("div");
		elem.innerHTML = String(text).trim();
		return elem.textContent;
	},
	/**. '{node menu(string name, array list)}: Cria um mecanismo de menu vertical:
	- O argumento '{name} define o nome do menu principal;
	- Cada item da lista definirá o rótulo do item do menu;
	- Uma string vazia define um separador;
	- Adicione o caractere &{#x002B} (adição) no início do item para definir um '{checkbox} ligado;
	- Adicione o caractere &{#x002D} (subtração) no início do item para definir um '{checkbox} desligado;
	- Adicione o caractere &{#x002E} (ponto) no início do item para definir um '{radio};
	- Os rótulos/itens do '{radio} devem estar separados por vírgulas na string após o ponto;
	- O primeiro rótulo da string de '{radio} define o nome do grupo e os demais as caixas de opções;
	- Para definir uma caixa de '{radio} como ligada, adicione o caractere &{#x002A} ao fim do rótulo;
	- Se o item da lista for um i{array}, um submenu será definido; e
	- O primeiro item do submenu definirá o rótulo do item responsável pela sua abertura e seu nome.**/
	menu: function(name, list) {
		const re   = /^\s*([\-+.])\s*/i;
		const code = /\&.*?\;/g;
		const menu = __HTML("menu", {
			role: "menu",
			"aria-label": String(name).replace(code, "").trim(),
			id: __ID.value,
			tabindex: -1
		});
		if (Array.isArray(list)) list.forEach(function (v,i,a) {
			const box = re.test(v) ? v.match(re)[1] : null;
			/*-- submenu --*/
			if (Array.isArray(v)) {
				const li  = __HTML("li", {role: "none"});
				const sub = this.menu(v[0], v.slice(1));
				const div = __HTML("div", {
					textContent: this.label(v[0]),
					id: __ID.value,
					tabindex: -1,
					role: "menuitem",
					"aria-haspopup": "true",
					"aria-controls": sub.id,
					"aria-expanded": "false",
					"aria-label": String(v[0]).replace(code, "").trim(),
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
			else if (box === "+" || box === "-") {
				menu.appendChild(__HTML("li", {
					role: "menuitemcheckbox",
					"aria-checked": box === "+" ? "true" : "false",
					"aria-label": v.replace(re, "").replace(code, "").trim(),
					id: __ID.value,
					textContent: this.label(v.replace(re, "")),
					tabindex: -1,
				}));
			}
			/*-- radio --*/
			else if (box === ".") {
				const items = v.replace(re, "").split(",");
				const open  = /\*$/;
				const group = __HTML("li", {role: "group", "aria-label": items[0].replace(code, "").trim()});
				menu.appendChild(group);
				items.slice(1).forEach(function(x,y,z) {
					group.appendChild(__HTML("div", {
						role: "menuitemradio",
						"aria-checked": open.test(x) ? "true" : "false",
						"aria-label": x.replace(open, "").replace(code, "").trim(),
						id: __ID.value,
						textContent: this.label(x.replace(open, "")),
						tabindex: -1,
					}));
				}, this);
			}
			/*-- item --*/
			else {
				menu.appendChild(__HTML("li", {
					role: "menuitem",
					"aria-label": String(v).replace(code, "").trim(),
					id: __ID.value,
					textContent: this.label(v),
					tabindex: -1,
				}));
			}
		}, this);
		/*-- definindo atributos --*/
		return menu;
	},
	/**. '{void attach(node target, string name, array list, function call)}: Atribui um menu a um nó HTML:
	|Argumento|Opcional|Descrição|
	|'{target}|Não|Nó HTML que acionará o menu|
	|'{name}|Não|Nome do menu principal|
	|'{list}|Não|Lista contendo os rótulos dos itens do menu e submenus|
	|'{call}|Sim|Função a ser chamada a cada interação com o menu|
	. A função '{call} receberá um objeto como argumento com as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|'{type}|string|O tipo de item: '{item}, '{checkbox} ou '{radio}|
	|'{checked}|boolean|É verdadeiro se um '{checkbox} ou '{radio} tiver sido marcado|
	|'{label}|string|O rótulo do '{item/checkbox/radio} manipulado|
	|'{group}|string|O nome do grupo no caso de '{radio}|
	|'{path}|string|Ancestralidade nominal dos menus separados por &{#x002F} a partir da raiz|**/
	attach: function(target, name, list, call) {
		if (!(target instanceof HTMLElement)) return null;
		const menu = this.menu(name, list);
		const item = menu.querySelector(`[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]`);
		__HTML(menu, {className: "css-js-wd-menu", hidden: "true", "aria-activedescendant": item.id});
		document.body.appendChild(menu);
		/*-- eventos do menu --*/
		menu.addEventListener("mouseover", this);
		menu.addEventListener("keydown", this);
		menu.addEventListener("click", this);
		/*-- definindo propriedades e ações do alvo --*/
		__HTML(target, {
			"aria-label": name,
			"aria-haspopup": "true",
			"aria-controls": menu.id,
			"aria-expanded": "false",
			tabindex: 0,
		});
		target.addEventListener("click", this.handlerMenuButton);
		//target.addEventListener("keydown", this.handlerMenuButton);
		/*-- registrando menu na pilha --*/
		this.heap[menu.id] = {
			target: target,
			menu:   menu,
			type:   "menuButton",
			call:   function(x) {
				if (typeof call === "function") call(x);
				return __WINDOW.detach(menu);
			},
		};
		return;
	},
	//FIXME tem que fixar o width em __WINDOW.float


	/**. '{void dettach(node target)}: Remove o menu do nó HTML.**/
	detach: function(target) {
		const id = target.getAttribute("aria-controls");
		if (id in this.heap) {
			target.removeAttribute("aria-label");
			target.removeAttribute("aria-haspopup");
			target.removeAttribute("aria-controls");
			target.removeAttribute("aria-expanded");
			target.removeAttribute("tabindex");
			target.removeEventListener("click", this.handlerMenuButton);
			this.heap[id].menu.removeEventListener("mouseover", this);
			this.heap[id].menu.removeEventListener("keydown", this);
			this.heap[id].menu.removeEventListener("click", this);
			this.heap[id].menu.remove();
			delete this.heap[id];
		}
		return;
	},
	/**. '{void handlerMenuButton(object ev)}: Manipulador para definir comportamento do acionado do menu.**/
	handlerMenuButton: function(ev) {
		const menu = document.getElementById(ev.target.getAttribute("aria-controls"));
		if (ev.type === "click")
			__WINDOW.attach(menu, "float", function(x) {
				ev.target.setAttribute("aria-expanded", x.close ? "false" : "true");
				document.getElementById(menu.getAttribute("aria-activedescendant")).focus();
			});
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
	/**. '{boolean item(node elem)}: Informa se o nó é um item de menu.**/
	item: function(elem) {
		return (/^menuitem(checkbox|radio)?$/).test(elem.getAttribute("role"));
	},
	/**. '{array items(node menu)}: Retorna a lista de itens do menu, do topo para base.**/
	items: function(menu) {
		const items = [];
		Array.from(menu.children).forEach(function(v,i,a) {
			const role = v.getAttribute("role");
			if (role === "menuitem" || role === "menuitemcheckbox")
				items.push(v);
			else if (role === "none")
				items.push(v.firstElementChild);
			else if (role === "group")
				Array.from(v.children).forEach(function(x,y,z) {items.push(x);});
		});
		return items;
	},
	/**. '{void active(node item)}: Define o item ativo do menu.**/
	active: function(item) {
		this.path(item)[0].setAttribute("aria-activedescendant", item.id);
		item.focus();
		return;
	},

	/**. '{void toggle(node menu)}: Abre ou fecha o submenu especificado.**/
	toggle: function(menu) {
		if (!menu.hasAttribute("aria-activedescendant")) {
			const item = menu.parentElement.firstElementChild;
			const open = item.getAttribute("aria-expanded") === "false";
			const list = item.parentElement.parentElement.children;
			/*-- exibir ou ocultar submenu --*/
			menu.hidden = open ? false : true;
			/*-- redefinir status do acionador --*/
			item.setAttribute("aria-expanded", open ? "true" : "false");
			/*-- ocutar ou exibir itens do menu ancestral --*/
			for (let i = 0; i < list.length; i++)
				list[i].hidden = open ? !list[i].contains(item) : false;
			/*-- redefinir o item ativo --*/
			this.active(open ? this.items(menu)[0] : item);
			/*-- ocultar acionadores intermediário FIXME --*/
			this.path(menu).forEach(function(v,i,a) {
				const toogle = menu.parentElement.firstElementChild;
				if (i > 0) toogle.hidden = toogle !== item;
			});
		}
		return;
	},
	/**. '{void mouseover(object ev)}: Manipulador para definir foco no item pelo mouse.**/
	mouseover: function(ev) {
		if (this.item(ev.target) && ev.target.getAttribute("aria-expanded") !== "true")
			this.active(ev.target);
		return;
	},
	/**. '{void keydown(object ev)}: Manipulador para navegar pelos itens.**/
	keydown: function(ev) {
		if (!this.item(ev.target) || ev.target.getAttribute("aria-expanded") === "true") return;
		const path  = this.path(ev.target);
		const items = this.items(path[path.length - 1]);
		const index = items.indexOf(ev.target);
		const click = ev.key === "Enter" || ev.key === " ";
		const role  = ev.target.getAttribute("role");
		/*-- baixo --*/
		if (ev.key === "ArrowDown")
			return this.active(items[(index + 1)%items.length]);
		/*-- topo --*/
		if (ev.key === "ArrowUp")
			return this.active(items[(items.length + index - 1)%items.length]);
		/*-- primeiro/último --*/
		if (ev.key === "Home" || ev.key === "End")
			return this.active(items[ev.key === "Home" ? 0 : items.length - 1]);
		/*-- abrir --*/
		if ((ev.key === "ArrowRight" || click) && ev.target.getAttribute("aria-expanded") === "false")
			return this.toggle(ev.target.nextElementSibling);
		/*-- fechar --*/
		if (ev.key === "ArrowLeft" && path.length > 1)
			return this.toggle(path[path.length - 1]);
		/*-- caixa de checagem --*/
		if (click && (role === "menuitemcheckbox" || role === "menuitemradio"))
			return this.click(ev);
		return;
	},
	/**. '{void click(object ev)}: Manipulador para abrir e fechar submenu pelo mouse.**/
	click: function(ev) {
		if (!this.item(ev.target)) return;
		const role = ev.target.getAttribute("role");
		/*-- abrir e fechar submenu --*/
		if (role === "menuitem" && ev.target.hasAttribute("aria-expanded")) {
			this.toggle(ev.target.nextElementSibling);
			return;
		}
		/*-- caixa de checagem/radio --*/
		if (role === "menuitemcheckbox" || role === "menuitemradio") {
			const check = ev.target.getAttribute("aria-checked") === "false";
			if (role === "menuitemcheckbox")
				ev.target.setAttribute("aria-checked", check ? "true" : "false");
			else
				Array.from(ev.target.parentElement.children).forEach(function(v,i,a) {
					v.setAttribute("aria-checked", v === ev.target ? "true" : "false");
				});
			return;
		}
		return;
	},
	/**. '{void fire(object ev)}: Provoca o disparador informado a cada interação.**/
	fire: function(ev) {
		const menu = ev.currentTarget;
		const item = this.item(ev.target) && !ev.target.hasAttribute("aria-haspopup") ? ev.target : null;
		const heap = menu.id in this.heap ? this.heap[menu.id] : null;
		const fire = ev.type === "click" || (ev.type === "keydown" && (ev.key === "Enter" || ev.key === " "));
		const type = {menuitem: "item", menuitemcheckbox: "checkbox", menuitemradio: "radio"};
		if (item && heap && fire && heap.call !== null)
			heap.call({
				type:    type[item.getAttribute("role")],
				checked: item.getAttribute("aria-checked") === "true",
				label:   item.getAttribute("aria-label"),
				group:   item.getAttribute("role") === "menuitemradio" ? item.parentElement.getAttribute("aria-label") : "",
				path:    this.path(item).map(function(v,i,a) {return v.getAttribute("aria-label");}).join("/"),
			});
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador do menu chamado durante os eventos '{keydown}, '{click}, e {mouseover}.**/
	handleEvent: function(ev) {
		this[ev.type](ev);
		this.fire(ev);
		return;
	},
};