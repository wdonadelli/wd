/**#3 Abas
O objeto '{__TAB} organiza um container em forma de abas.**/
const __TAB = {
	/**. '{object heap}: Registra o elemento que recebeu a configuração de abas.**/
	heap: {},
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
	/**. '{void attach(node node, boolean vertical)}: Define uma caixa de abas para referenciar os filhos do nó.**/
	attach: function(node, vertical) {
		const height  = {max: 0.9* window.innerHeight, min: 0.5 * window.innerHeight, val: 0};
		const tablist = {tag: "div", child: [], attr: {
			tabIndex: -1,
			role: "tablist",
			"aria-orientation": vertical === true ? "vertical" : "horizontal",
			addEventListener: {click: this, keydown: this}
		}};
		/*-- redefinindo e registrando container principal --*/
		this.detach(node);
		this.heap[node.id] = node;
		/*-- configurando paineis e contruindo abas --*/
		tablist.child = Array.from(node.children).map(function(v,i,a) {
			const tab  = __ID.value;
			const text = this.label(v);
			const rect = v.getBoundingClientRect().height;
			height.val = rect > height.val ? rect : height.val;
			/*-- configurando painel --*/
			__HTML(v, {
				id: __ID.id(v),
				role: "tabpanel",
				tabIndex: -1,
				hidden: i > 0
			});
			/*-- definindo rótulo do painel, se inexistente, na aba --*/
			if (!v.hasAttribute("aria-labelledby") && !v.hasAttribute("aria-label"))
				v.setAttribute("aria-labelledby", tab);
			/*-- retornando aba --*/
			return {tag: "button", child: [], attr: {
				type: "button",
				textContent: text === null ? `Tab ${index}` : text,
				tabIndex: i === 0 ? 0 : -1,
				id: tab,
				role: "tab",
				"aria-controls": v.id,
				"aria-selected": i === 0 ? "true" : "false"
			}};
		}, this);
		/*-- configurando o container de abas --*/
		__HTML(node, {classList: {add: `css-js-wd-tab css-js-wd-${vertical === true ? "v" : "h"}tab`}});
		node.insertBefore(__DOM(tablist).tag, node.firstElementChild);
		/*-- calculando altura ideal --*/
		const rect = tablist.tag.getBoundingClientRect().height;
		height.val = rect > height.val ? rect : height.val;
		node.style.height = (height.val < height.min ? height.min : (height.val > height.max ? height.max : height.val))+"px";
		return;
	},
	/**. '{void detach(node node)}: Desvincula uma caixa de abas dos elementos referenciados.**/
	detach: function(node) {
		if (!(__ID.id(node) in this.heap)) return;
		delete this.heap[node.id];
		__HTML(node, {
			style:     {height: null},
			classList: {remove: "css-js-wd-tab css-js-wd-htab css-js-wd-vtab"},
		});
		let tablist = null;
		Array.from(node.children).forEach(function(v,i,a) {
			if (String(v.getAttribute("role")).toLowerCase() === "tablist") {
				tablist = v;
				return;
			}
			const label = v.hasAttribute("aria-labelledby") ? document.getElementById(v.getAttribute("aria-labelledby")) : null;
			v.removeAttribute("role");
			v.removeAttribute("tabindex");
			v.hidden = false;
			if (label !== null && label.getAttribute("role") === "tab")
				v.removeAttribute("aria-labelledby");
		});
		if (tablist !== null) tablist.remove();
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
.css-js-wd-tab [role=tablist] {
	order: 0;
	font-size: 14px;
	margin: 0;
}
.css-js-wd-tab [role=tablist][aria-orientation=vertical] {
	flex: 0 0 25%;
	padding: 0 0.5em;
	overflow-y: auto;
}
.css-js-wd-tab [role=tablist][aria-orientation=horizontal] {
	flex: 0 0 auto;
	padding: 0.5em 0;
	overflow-x: auto;
}
/*-- abas --------------------------------------------------------------------*/
.css-js-wd-tab [role=tab] {
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
.css-js-wd-tab [role=tab]:hover,
.css-js-wd-tab [role=tab]:focus {
	background: rgba(204,204,204,0.2);
}
.css-js-wd-tab [role=tablist] [role=tab][aria-selected=true] {
	border: 1px solid;
}
/*-- aba vertical ------------------------------------------------------------*/
.css-js-wd-tab [role=tablist][aria-orientation=vertical] [role=tab] {
	display: block;
	width: 100%;
	margin: 0.25em 0;
	text-align: left;
}
.css-js-wd-tab [role=tablist][aria-orientation=vertical] [role=tab][aria-selected=true] {
	box-shadow: inset 0.25em 0;
}
/*-- aba horizontal -----------------------------------------------------------*/
.css-js-wd-tab [role=tablist][aria-orientation=horizontal] [role=tab] {
	display: inline-block;
	width: auto;
	margin: 0 0.25em;
	text-align: center;
}
.css-js-wd-tab [role=tablist][aria-orientation=horizontal] [role=tab][aria-selected=true] {
	box-shadow: inset 0 0.25em;
}
/*-- painel de conteúdo ------------------------------------------------------*/
.css-js-wd-tab [role=tabpanel] {
	flex: 1 1 auto;
	order: 1;
	margin: 0;
	padding: 0em;
	border: 1px solid rgba(204,204,204,0.3);
	border-radius: 0.3em;
	overflow-y: auto;
}`);