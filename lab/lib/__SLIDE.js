/**#3 Apresentação
O objeto '{__SLIDE} organiza um container em forma de apresentação de '{slides}.**/
const __SLIDE = {

/**. '{void attach(node node, integer time)}: Define uma caixa de abas para referenciar os filhos do nó.**/
	attach: function(node, time) {
		if (!(node instanceof HTMLElement)) return;
		/*-- obtendo informações iniciais --*/
		const height  = {max: 0.9* window.innerHeight, min: 0.5 * window.innerHeight, val: 0};
		const slides  = Array.from(node.children);
		const tablist = {tag: "div", child: [], attr: {id: __ID.value, role: "tablist", "aria-label": "Slides",}};
		/*-- registrando elementos --*/
		const data = {
			time:    Math.trunc(1000 * (__Type(time).finite ? Math.abs(Number(time)) : 3)),
			root:    __HEAP.getAttr(node, "aria-roledescription", "class", "aria-live"),
			tablist: tablist.attr.id,
			slides:  slides.reduce(function(x,v,i,a) {
				x[__ID.id(v)] = __HEAP.getAttr(v, "role", "aria-roledescription", "aria-label", "hidden");
				return x;
			}, {}),
		};
		__HEAP.attach(node, data, this);
		/*-- slides --*/
		tablist.child = slides.map(function(v,i,a) {
			/*-- slide --*/
			__HTML(v, {
				id: __ID.id(v),
				role: "tabpanel",
				"aria-roledescription": "slide",
				"aria-label": `Slide ${i+1}/${slides.length}`,
				hidden: i > 0
			});
			/*-- retornando aba --*/
			return {tag: "button", child: [], attr: {
				type: "button",
				tabIndex: i === 0 ? 0 : -1,
				id: __ID.value,
				role: "tab",
				"aria-controls": v.id,
				"aria-selected": i === 0 ? "true" : "false",
				"aria-label": `Slide ${i+1}`,
				addEventListener: {click: this, keydown: this}
			}};
		}, this);
		/*-- configurando o container de abas --*/
		__HTML(node, {classList: {add: "css-js-wd-slide"}, insertBefore:[__DOM(tablist).tag, node.firstElementChild]});
		/*-- calculando altura ideal --*/
		//const rect = tablist.tag.getBoundingClientRect().height;
		//height.val = rect > height.val ? rect : height.val;
		//node.style.height = (height.val < height.min ? height.min : (height.val > height.max ? height.max : height.val))+"px";
		console.log("AAAAAAAAAAAAAAAAAAAA")
		return;
	},
	/**. '{void detach(node node)}: Desvincula uma caixa de abas dos elementos referenciados.**/
	detach: function(node) {
		if (__HEAP.data(node, this) === null) return;
		const data = __HEAP.data(node, this);
		document.getElementById(data.tablist).remove();
		__HEAP.resetAttr(data.root);
		for (let i in data.slides) __HEAP.resetAttr(data.slides[i]);
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