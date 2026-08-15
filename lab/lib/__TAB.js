/**#3 Abas
O objeto '{__TAB} organiza um container em forma de abas.**/
const __TAB = {
	/**. '{string label(node panel, integer index)}: Procura por cabeçalhos no painel e retorna o texto da aba ou nulo.**/
	label: function(panel, index) {
		const query = panel.querySelector("h1, h2, h3, h4, h5, h6, [role=heading]");
		const label = panel.hasAttribute("aria-label")      ? panel.getAttribute("aria-label").trim()      : null;
		const outer = panel.hasAttribute("aria-labelledby") ? panel.getAttribute("aria-labelledby").trim() : null;
		const text  = panel.innerText.trim().split("\n")[0].replace(/\s+/g, " ").replace(/^\W+|\W+$/, "");
		if (label !== null && label !== "")
			return label;
		if (outer !== null && document.getElementById(outer) !== null)
			return document.getElementById(outer).textContent.trim();
		if (query !== null)
			return query.textContent.trim();
		if (text.length > 0)
			return text.split(" ").slice(0,5).join(" ");
		return null;
	},
	/**. '{object design(node panel, integer index)}: Retorna a estrutura da aba e configura o painel.**/
	design: function(panel, index) {
		const text = this.label(panel);
		const data = {panel: __ID.id(panel), tab: __ID.value, label: text ===  null ? `Tab ${index}` : text};
		/*-- preparando painel --*/
		__HTML(panel, {
			id: data.panel,
			tabIndex: -1,
			role: "tabpanel",
			"aria-labelledby": data.tab,
			hidden: index !== 0,
		});
		/*-- retornando a aba --*/
		return {tag: "button", child: [], attr: {
			type: "button",
			innerHTML: data.label,
			tabIndex: index === 0 ? 0 : -1,
			id: data.tab,
			role: "tab",
			"aria-controls": data.panel,
			"aria-selected": index === 0 ? "true" : "false"
		}};
	},
	/**. '{void create(node node, boolean vertical)}: Define uma caixa de abas para referenciar os filhos do nó.**/
	create: function(node, vertical) {
		const data = node.children;
		const list = {tag: "div", child: [], attr: {
			tabIndex: -1,
			role: "tablist",
			"aria-orientation": vertical === true ? "vertical" : "horizontal",
			addEventListener: {click: this, keydown: this}
		}};
		/*-- configurando paineis --*/
		let val, max = 0;
		for (let i = 0; i < data.length; i++) {
			list.child.push(this.design(data[i], i));
			val = data[i].getBoundingClientRect().height;
			max = val > max ? val : max;
		}
		/*-- adicionando a lista ao container (topo) --*/
		node.style.flexDirection = vertical === true ? "row" : "column";
		node.style.height = (max === 0 || max > 0.9 * window.innerHeight ? 0.9 * window.innerHeight : max)+"px";
		node.className = "css-wd-tab";
		node.insertBefore(__DOM(list).tag, node.firstElementChild);
		return;
	},
	/**. '{void open(node tab)}: Abre o painel a partir da aba.**/
	open: function(tab) {
		const list   = tab.parentElement;
		const tabs   = list.children;
		const panel  = document.getElementById(tab.getAttribute("aria-controls"));
		const panels = panel.parentElement.children;
		/*-- manipulado os paineis --*/
		for (let i = 0; i < panels.length; i++) {
			panels[i].hidden = panels[i] !== list && panels[i] !== panel;
		}
		/*-- manipulado as abas --*/
		for (let i = 0; i < tabs.length; i++) {
			tabs[i].tabIndex = tabs[i] === tab ? 0 : -1;
			tabs[i].setAttribute("aria-selected", tabs[i] === tab ? "true" : "false");
		}
		tab.focus();
		return;
	},
 	/**. '{void keydown(object ev)}: Manipulador para navegar pelas abas pelo teclado.**/
	keydown: function (ev) {
		const tabs = Array.from(ev.currentTarget.children);
		const item = tabs.indexOf(ev.target);
		const jump = {
			ArrowDown:  item + 1, ArrowUp:   item - 1, Home: 0,
			ArrowRight: item + 1, ArrowLeft: item - 1, End: tabs.length - 1
		};
		const next = (tabs.length + jump[ev.key])%tabs.length;
		this.open(tabs[next]);
		return;
 	},
 	/**. '{void handleEvent(object ev)}: Disparador de abas chamado durante os eventos '{keydown}, '{click}.**/
	handleEvent: function(ev) {
		if (ev.target.tagName.toLowerCase() !== "button") return;
		const path = ev.currentTarget.getAttribute("aria-orientation");
		const keys = path === "vertical" ? /^(ArrowUp|ArrowDown|Home|End)$/ : /^(ArrowRight|ArrowLeft|Home|End)$/;
		const stop = {click: true, keydown: (ev.key === "Tab" && !ev.shiftKey) || keys.test(ev.key)};
		if (ev.type in stop && stop[ev.type]) {
			ev.stopPropagation();
			ev.preventDefault();
		}
		if (ev.type === "click") {
			this.open(ev.target);
		}
		else if (ev.type === "keydown" && stop.keydown) {
			if (ev.key === "Tab")
				document.getElementById(ev.target.getAttribute("aria-controls")).focus();
			else
				this.keydown(ev);
		}
		return;
	},
};

//FIXME o container principal precisa de uma altura máxima; melhorar essa feiura.

__CSS.push(`/*-- TAB --*/
/*-- container principal -----------------------------------------------------*/
.css-wd-tab {
	display: flex;
	align-items: stretch;
	justify-content: center;
	padding: 0;
}
/*-- lista de abas -----------------------------------------------------------*/
.css-wd-tab [role=tablist] {
	order: 0;
	font-size: 14px;
	margin: 0;
}
.css-wd-tab [role=tablist][aria-orientation=vertical] {
	flex: 0 0 15%;
	padding: 0 0.5em;
	overflow-y: auto;
}
.css-wd-tab [role=tablist][aria-orientation=horizontal] {
	flex: 0 0 auto;
	padding: 0.5em 0;
	overflow-x: auto;
}
/*-- abas --------------------------------------------------------------------*/
.css-wd-tab [role=tab] {
	appearance: none;
	padding: 0.5em 1em;
	font-size: inherit;
	font-family: Lucida Sans, sans-serif;
	color: inherit;
	background-color: inherit;
	border-radius: 0.3em;
	border: 1px solid transparent;
	cursor: pointer;
}
.css-wd-tab [role=tab]:hover,
.css-wd-tab [role=tab]:focus {
	background: rgba(204,204,204,0.3);
}
.css-wd-tab [role=tablist] [role=tab][aria-selected=true] {
	border: 1px solid;
}
/*-- aba vertical ------------------------------------------------------------*/
.css-wd-tab [role=tablist][aria-orientation=vertical] [role=tab] {
	display: block;
	width: 100%;
	margin: 0.25em 0;
	text-align: left;
}
.css-wd-tab [role=tablist][aria-orientation=vertical] [role=tab][aria-selected=true] {
	box-shadow: inset 0.25em 0;
}
/*-- aba horizontal -----------------------------------------------------------*/
.css-wd-tab [role=tablist][aria-orientation=horizontal] [role=tab] {
	display: inline-block;
	width: auto;
	margin: 0 0.25em;
	text-align: center;
}
.css-wd-tab [role=tablist][aria-orientation=horizontal] [role=tab][aria-selected=true] {
	box-shadow: inset 0 0.25em;
}
/*-- painel de conteúdo ------------------------------------------------------*/
.css-wd-tab [role=tabpanel] {
	flex: 1 1 auto;
	order: 1;
	margin: 0;
	padding: 0em;
	border: 1px solid rgba(204,204,204,0.3);
	border-radius: 0.3em;
	overflow-y: auto;
}`);