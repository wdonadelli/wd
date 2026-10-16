/**#3 Abas
O objeto '{__TAB} organiza um container em forma de abas.**/
const __TAB = {
	/**. '{string label(node panel, integer index)}: Procura por cabeçalhos no painel e retorna o texto da aba ou nulo.**/
	label: function(panel, index) {
		const query = panel.querySelector("h1, h2, h3, h4, h5, h6, [role=heading]");
		const label = panel.hasAttribute("aria-label")      ? panel.getAttribute("aria-label").trim()      : null;
		const outer = panel.hasAttribute("aria-labelledby") ? panel.getAttribute("aria-labelledby").trim() : null;
		const text  = panel.innerText.trim().split("\n")[0].replace(/\s+/g, " ").replace(/^\W+|\W+$/, "");
		if (outer !== null && document.getElementById(outer) !== null)
			return document.getElementById(outer).textContent.trim();
		if (label !== null && label !== "")
			return label;
		if (query !== null)
			return query.textContent.trim();
		if (text.length > 0)
			return text.split(" ").slice(0,5).join(" ");
		return null;
	},
	/**. '{void attach(node node, string orientation)}: Define uma caixa de abas para referenciar os filhos do nó.**/
	attach: function(node, orientation) {
		if (!(node instanceof HTMLElement)) return;
		/*-- informações iniciais --*/
		const height  = {max: 0.9* window.innerHeight, min: 0.5 * window.innerHeight, val: 0};
		const panels  = Array.from(node.children);
		const tablist = {tag: "div", child: [], attr: {
			id: __ID.value,
			role: "tablist",
			"aria-orientation": (/^\s*vertical\s*$/i).test(orientation) ? "vertical" : "horizontal",
		}};
		/*-- registrando ferramenta --*/
		const data = {
			orientation: tablist.attr["aria-orientation"],
			root: __HEAP.getAttr(node, "style", "class"),
			tablist: tablist.attr.id,
			panels: panels.reduce(function(x,v,i,a) {
				x[__ID.id(v)] = __HEAP.getAttr(v, "role", "tabIndex", "hidden", "aria-labelledby");
				return x;
			}, {}),
		};
		__HEAP.attach(node, data, this);
		/*-- abas e paineis --*/
		tablist.child = panels.map(function(v,i,a) {
			const tab  = __ID.value;
			const text = this.label(v);
			const rect = v.getBoundingClientRect().height;
			height.val = rect > height.val ? rect : height.val;
			/*-- configurando painel --*/
			__HTML(v, {
				id: __ID.id(v),
				role: "tabpanel",
				tabIndex: 0,
				hidden: i > 0
			});
			/*-- definindo rótulo do painel, se inexistente, na aba --*/
			if (!v.hasAttribute("aria-labelledby") && !v.hasAttribute("aria-label"))
				v.setAttribute("aria-labelledby", tab);
			/*-- retornando aba --*/
			return {tag: "button", child: [], attr: {
				type: "button",
				textContent: text === null ? `Tab ${i + 1}` : text,
				tabIndex: i === 0 ? 0 : -1,
				id: tab,
				role: "tab",
				"aria-controls": v.id,
				"aria-selected": i === 0 ? "true" : "false",
				addEventListener: {click: this, keydown: this},
			}};
		}, this);
		/*-- configurando o container de abas --*/
		__HTML(node, {
			classList:    {add: `css-js-wd-tab css-js-wd-${tablist.attr["aria-orientation"] === "vertical" ? "vtab" : "htab"}`},
			insertBefore: [__DOM(tablist).tag, node.firstElementChild]
		});
		/*-- calculando altura ideal --*/
		const rect = tablist.tag.getBoundingClientRect().height;
		height.val = rect > height.val ? rect : height.val;
		node.style.height = (height.val < height.min ? height.min : (height.val > height.max ? height.max : height.val))+"px";
		return;
	},
	/**. '{void detach(node node)}: Desvincula uma caixa de abas dos elementos referenciados.**/
	detach: function(node) {
		if (__HEAP.data(node, this) === null) return;
		const data = __HEAP.data(node, this);
		document.getElementById(data.tablist).remove();
		__HEAP.resetAttr(data.root);
		for (let i in data.panels) __HEAP.resetAttr(data.panels[i]);
		return;
	},
	/**. '{void click(object ev)}: Manipulador para abrir painel ao clicar na abas.**/
	click: function(ev) {
		const tab  = ev.currentTarget;
		const tabs = tab.parentElement.children;
		for (let i = 0; i < tabs.length; i++) {
			let panel	= document.getElementById(tabs[i].getAttribute("aria-controls"));
			panel.hidden = tabs[i] !== tab;
			tabs[i].tabIndex = panel.hidden ? -1 : 0;
			tabs[i].setAttribute("aria-selected", panel.hidden ? "false" : "true");
		}
		tab.focus();
		return;
	},
	/**. '{void keydown(object ev)}: Manipulador para navegar pelas abas pelo teclado.**/
	keydown: function(ev) {
		const tab  = ev.currentTarget;
		const list = tab.parentElement;
		const vert = list.getAttribute("aria-orientation") === "vertical";
		const keys = vert ? /^(ArrowUp|ArrowDown|Home|End)$/ : /^(ArrowRight|ArrowLeft|Home|End)$/;
		if (!keys.test(ev.key)) return;
		ev.stopPropagation();
		ev.preventDefault();
		if ((vert && ev.key === "ArrowDown") || ev.key === "ArrowRight")
			return tab.nextElementSibling === null ? list.firstElementChild.click() : tab.nextElementSibling.click();
		if ((vert && ev.key === "ArrowUp") || ev.key === "ArrowLeft")
			return tab.previousElementSibling === null ? list.lastElementChild.click() : tab.previousElementSibling.click();
		if (ev.key === "Home" || ev.key === "End")
			return ev.key === "Home" ? list.firstElementChild.click() : list.lastElementChild.click();
		return;
	},
 	/**. '{void handleEvent(object ev)}: Disparador de abas chamado durante os eventos '{keydown}, '{click}.**/
	handleEvent: function(ev) {
		return ev.type in this ? this[ev.type](ev) : undefined;
	},
};
__CSS.push(`/*-- TAB --*/
/*-- container principal -----------------------------------------------------*/
.css-js-wd-tab {
	display: flex;
	align-items: stretch;
	justify-content: center;
	padding: 0;
}
.css-js-wd-tab.css-js-wd-htab {flex-direction: column;}
.css-js-wd-tab.css-js-wd-vtab {flex-direction: row;}
/*-- lista de abas -----------------------------------------------------------*/
.css-js-wd-tab > [role=tablist] {
	order: 0;
	font-size: 14px;
	margin: 0;
}
.css-js-wd-tab > [role=tablist][aria-orientation=vertical] {
	flex: 0 0 25%;
	padding: 0 0.5em;
	overflow-y: auto;
}
.css-js-wd-tab > [role=tablist][aria-orientation=horizontal] {
	flex: 0 0 auto;
	padding: 0.5em 0;
	overflow-x: auto;
}
/*-- abas --------------------------------------------------------------------*/
.css-js-wd-tab > [role=tablist] > [role=tab] {
	appearance: none;
	padding: 0.5em 1em;
	font-size: inherit;
	font-family: var(--var-js-wd-font-family);
	color: inherit;
	background-color: inherit;
	border-radius: var(--var-js-wd-panel-radius);
	border: 1px solid transparent;
	cursor: pointer;
}
.css-js-wd-tab > [role=tablist] > [role=tab]:hover,
.css-js-wd-tab > [role=tablist] > [role=tab]:focus {
	background: var(--var-js-wd-hover);
}
.css-js-wd-tab > [role=tablist] > [role=tab][aria-selected=true] {
	border: 1px solid;
}
/*-- aba vertical ------------------------------------------------------------*/
.css-js-wd-tab > [role=tablist][aria-orientation=vertical] > [role=tab] {
	display: block;
	width: 100%;
	margin: 0.25em 0;
	text-align: left;
}
.css-js-wd-tab > [role=tablist][aria-orientation=vertical] > [role=tab][aria-selected=true] {
	box-shadow: inset 0.25em 0;
}
/*-- aba horizontal -----------------------------------------------------------*/
.css-js-wd-tab > [role=tablist][aria-orientation=horizontal] > [role=tab] {
	display: inline-block;
	width: auto;
	margin: 0 0.25em;
	text-align: center;
}
.css-js-wd-tab > [role=tablist][aria-orientation=horizontal] > [role=tab][aria-selected=true] {
	box-shadow: inset 0 0.25em;
}
/*-- painel de conteúdo ------------------------------------------------------*/
.css-js-wd-tab > [role=tabpanel] {
	flex: 1 1 auto;
	order: 1;
	margin: 0;
	padding: 0em;
	border: var(--var-js-wd-panel-border);
	border-radius: var(--var-js-wd-panel-radius);
	overflow-y: auto;
}`);