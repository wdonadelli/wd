/**
#3 Abas
O objeto '{__TAB} organiza um container em forma de abas.
**/
const __TAB = {
	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- TAB --*/
.css-wd-tab {
	display: flex;
	align-items: stretch;
	justify-content: center;
	padding: 0;
}
.css-wd-tab [role=tablist] {
	display: flex;
	align-items: stretch;
	justify-content: start;
	margin: 0;
	font-size: var(--var-js-wd-font-size);
	font-family: var(--var-js-wd-font-type);
}
.css-wd-tab [role=tablist][aria-orientation=horizontal] {
	flex: 1 1 auto;
	flex-flow: row wrap;
}
.css-wd-tab [role=tablist][aria-orientation=vertical]   {
	flex: 0 1 25%;
	flex-flow: column nowrap;
}
.css-wd-tab [role=tab] {
	margin: 3px;
	flex: 1 1 auto;
}
.css-wd-tab  [role=tab][aria-selected=true] {
	outline-width: thin;
	outline-style: solid;
}
.css-wd-tab [role=tabpanel] {
	flex: 1 1 auto;1F82C
	margin: 0;
}
.css-wd-tab [role=tablist][aria-orientation=vertical] ~ [role=tabpanel] {
	flex: 1 1 75%;
}`),
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
		node.style.flexDirection = vertical === true ? "row" : "column";
		node.className = "css-wd-tab";
		/*-- definindo abas e configurando paineis --*/
		const data = node.children;
		const list = {tag: "div", child: [], attr: {
			tabIndex: -1,
			role: "tablist",
			"aria-orientation": vertical === true ? "vertical" : "horizontal",
			addEventListener: {click: this, keydown: this}
		}};
		for (let i = 0; i < data.length; i++)
			list.child.push(this.design(data[i], i));
		/*-- adicionando a lista ao container (topo) --*/
		node.insertBefore(__DOM(list).tag, node.firstElementChild);
		return;
	},
	/**. '{void open(node tab)}: Abre o paineil a partir da aba.**/
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
		const tabs = Array.prototype.slice.call(ev.currentTarget.children);
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
