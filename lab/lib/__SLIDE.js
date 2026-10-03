/**#3 Apresentação
O objeto '{__SLIDE} organiza um container em forma de apresentação de '{slides}.**/
const __SLIDE = {
	/**. '{void attach(node node, integer time)}: Define uma caixa de i{slides} com rotação automática com abas.**/
	attach: function(node, time) {
		if (!(node instanceof HTMLElement)) return;
		time = Math.trunc(1000 * (__Type(time).finite && Math.abs(Number(time)) > 0 ? Math.abs(Number(time)) : 3));
		/*-- informações iniciais --*/
		const height  = {max: 0.9* window.innerHeight, min: 0.5 * window.innerHeight, val: 0};
		const slides  = Array.from(node.children);
		const tablist = {tag: "div", child: [], attr: {
			id: __ID.value,
			role: "tablist",
			"aria-label": "Slides",
			"aria-orientation": "horizontal",
		}};
		/*-- registrando elementos --*/
		const data = {
			time:    time,
			timer:   window.setInterval(this.timer, time+5, node, time),
			root:    __HEAP.getAttr(node, "aria-roledescription", "class", "aria-live", "style", "data-slide-time"),
			tablist: tablist.attr.id,
			slides:  slides.reduce(function(x,v,i,a) {
				x[__ID.id(v)] = __HEAP.getAttr(v, "role", "aria-roledescription", "aria-label", "tabIndex", "hidden");
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
				tabIndex: 0,
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
				/*-- o mecanismo copia o comportamento de abas --*/
				addEventListener: {click: __TAB, keydown: __TAB},
			}};
		}, this);
		/*-- configurando o container de abas --*/
		__HTML(node, {
			classList: {add: "css-js-wd-slide"},
			"aria-roledescription": "carousel",
			"aria-live": "off",
			"data-slide-time": Date.now(),
			insertBefore:[__DOM(tablist).tag, node.firstElementChild],
			addEventListener: {mouseenter: this, mouseleave: this, focusin: this, focusout: this}
		});
		/*-- calculando altura ideal --*/
		//const rect = tablist.tag.getBoundingClientRect().height;
		//height.val = rect > height.val ? rect : height.val;
		//node.style.height = (height.val < height.min ? height.min : (height.val > height.max ? height.max : height.val))+"px";
		return;
	},
	/**. '{void detach(node node)}: Desvincula uma caixa de abas dos elementos referenciados.**/
	detach: function(node) {
		if (__HEAP.data(node, this) === null) return;
		const data = __HEAP.data(node, this);
		window.clearInterval(data.timer);
		document.getElementById(data.tablist).remove();
		__HEAP.resetAttr(data.root);
		__HTML(data.root, {removeEventListener: {mouseenter: this, mouseleave: this, focusin: this, focusout: this}});
		for (let i in data.slides) __HEAP.resetAttr(data.slides[i]);
		return;
	},

	timer: function(node, time) {
		if (!node.hasAttribute("data-slide-time"))
			return node.setAttribute("data-slide-time", Date.now());
		if (node.getAttribute("aria-live") === "polite")
			return;
		const gap  = Number(node.getAttribute("data-slide-time"));
		const tab  = node.querySelector(`[role="tab"][aria-selected="true"]`);
		const tabs = tab.parentElement.children;
		const next = tab.nextElementSibling === null ? tab.parentElement.firstElementChild : tab.nextElementSibling;
		//console.log({node: node, time: time, gap: gap, tab: tab, delta: Date.now() - gap})
		if (Date.now() - gap >= time) {
			for (let i = 0; i < tabs.length; i++) {
				let panel	= document.getElementById(tabs[i].getAttribute("aria-controls"));
				panel.hidden = tabs[i] !== next;
				tabs[i].tabIndex = panel.hidden ? -1 : 0;
				tabs[i].setAttribute("aria-selected", panel.hidden ? "false" : "true");
			}
			node.setAttribute("data-slide-time", Date.now());
			return;
		}
		return;
	},

	/* TODO
		1) quando a rotação automática é desativada, aria-live é polite
		2) quando a rotação automática é ativada, aria-live é off (para não ficar incomodando
		3) mouseenter e focusin encerra a rotação automática
		4) mouseleave e focusout retoma a rotação automática
		5) adicionar uma função de período em data (registro) e desligar depois em detach
	*/
	/**. '{void focusin(object ev)}: Interrompe a rotação automática ao receber foco.**/
	focusin: function(ev) {
		if (!ev.currentTarget.contains(ev.relatedTarget))
			ev.currentTarget.setAttribute("aria-live", "polite");
		return;
	},
	/**. '{void focusout(object ev)}: Retoma a rotação automática ao perder foco.**/
	focusout: function(ev) {
		if (!ev.currentTarget.contains(ev.relatedTarget))
			ev.currentTarget.setAttribute("aria-live", "off");
		return;
	},
	/**. '{void mouseenter(object ev)}: Interrompe a rotação automática ao passar o i{mouse}.**/
	mouseenter: function(ev) {
		if (!ev.currentTarget.contains(ev.relatedTarget))
			ev.currentTarget.setAttribute("aria-live", "polite");
		return;
	},
	/**. '{void mouseleave(object ev)}: Interrompe a rotação automática ao remover o i{mouse}.**/
	mouseleave: function(ev) {
		if (!ev.currentTarget.contains(ev.relatedTarget))
			ev.currentTarget.setAttribute("aria-live", "off");
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