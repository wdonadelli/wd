/**#3 Apresentação
O objeto '{__SLIDE} organiza um container em forma de apresentação de '{slides}.**/

/* TODO
		1) quando a rotação automática é desativada, aria-live é polite
		2) quando a rotação automática é ativada, aria-live é off (para não ficar incomodando
		3) mouseenter e focusin desativam a rotação automática
		4) mouseleave e focusout retomam a rotação automática
		5) adicionar uma função de período em data (registro) e desligar depois em detach
		6) aproveita o mecanismo de __TAB
	*/

const __SLIDE = {
	/**. '{object data}: Registra os dados do temporizador de cada elemento que recebeu o mecanismo:
	|Propriedade|Tipo|Descrição|
	|'{time}|Integer|Valor em milissegundos entre cada troca de '{slide}|
	|'{timer}|Interger|Identificador do método '{setInterval}|
	|'{stamp}|Integer|Carimbo de tempo para cada interação|
	|""Propriedades registradas para fins de automação da rotação de slides""|**/
	data: {},
	/**. '{void attach(node node, integer time)}: Define uma caixa de i{slides} com rotação automática com abas.**/
	attach: function(node, time) {
		if (!(node instanceof HTMLElement)) return;
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
			time:    Math.trunc(1000 * (__Type(time).finite && Math.abs(Number(time)) > 0 ? Math.abs(Number(time)) : 3)),
			root:    __HEAP.getAttr(node, "aria-roledescription", "class", "aria-live", "style"),
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
			id: __ID.id(node),
			classList: {add: "css-js-wd-slide"},
			"aria-roledescription": "carousel",
			"aria-live": "off",
			insertBefore:[__DOM(tablist).tag, node.firstElementChild],
			addEventListener: {mouseenter: this, mouseleave: this, focusin: this, focusout: this}
		});
		/*-- calculando altura ideal --*/
		//const rect = tablist.tag.getBoundingClientRect().height;
		//height.val = rect > height.val ? rect : height.val;
		//node.style.height = (height.val < height.min ? height.min : (height.val > height.max ? height.max : height.val))+"px";
		/*-- registrando temporizador --*/
		this.data[node.id] = {
			time:  data.time,
			timer: window.setInterval(this.timer, data.time, node, this),
			stamp: Date.now(),
		}
		return;
	},
	/**. '{void detach(node node)}: Desvincula uma caixa de abas dos elementos referenciados.**/
	detach: function(node) {
		if (__HEAP.data(node, this) === null) return;
		const data = __HEAP.data(node, this);
		/*-- apagar temporizador --*/
		window.clearInterval(this.data[node.id].timer);
		delete this.data[node.id];
		/*-- remover lista de abas e resetar elementos --*/
		document.getElementById(data.tablist).remove();
		__HTML(node, {removeEventListener: {mouseenter: this, mouseleave: this, focusin: this, focusout: this}});
		__HEAP.resetAttr(data.root);
		for (let i in data.slides) __HEAP.resetAttr(data.slides[i]);
		return;
	},
	/**. '{void timer(node node, object self)}: Função de rotação automática do i{slide} a ser chamada periodicamente. Os argumentos correspondem, respectivamente, ao elemento que recebeu o mecanismo e o objeto '{__SLIDE}.**/
	timer: function(node, self) {
		if (node.getAttribute("aria-live") === "polite") return;
		const data = self.data[node.id];
		const tab  = node.querySelector(`[role="tab"][aria-selected="true"]`);
		const tabs = tab.parentElement.children;
		const next = tab.nextElementSibling === null ? tab.parentElement.firstElementChild : tab.nextElementSibling;
		if (Date.now() - data.stamp >= data.time-5) {
			for (let i = 0; i < tabs.length; i++) {
				let panel	= document.getElementById(tabs[i].getAttribute("aria-controls"));
				panel.hidden = tabs[i] !== next;
				tabs[i].tabIndex = panel.hidden ? -1 : 0;
				tabs[i].setAttribute("aria-selected", panel.hidden ? "false" : "true");
			}
			self.data[node.id].stamp = Date.now();
		}
		return;
	},
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
 	/**. '{void handleEvent(object ev)}: Disparador do objeto.**/
	handleEvent: function(ev) {
		return ev.type in this ? this[ev.type](ev) : undefined;
	},
};
__CSS.push(`/*-- TAB --*/
/*-- container principal -----------------------------------------------------*/
.css-js-wd-slide {
	display:  block;
	position: relative;
	padding:  0;
	border-radius: var(--var-js-wd-panel-radius);
	min-height: 250px;
	background: green;
}
/*-- lista de abas -----------------------------------------------------------*/
.css-js-wd-slide > [role=tablist] {
	display: block;
	position: absolute;
	top: 0;
	left: 50%;
  transform: translateX(-50%);
	width: auto;
	margin: auto;
}
/*-- abas --------------------------------------------------------------------*/
.css-js-wd-slide > [role=tablist] > [role=tab] {
	appearance: none;
	font-size: 14px;
	margin: 0.5em;
	height: 1em;
	width:  1em;
	border-radius: 0.5em;
	border: thin solid gray;
	background-color: transparent;
	cursor: pointer;
}
.css-js-wd-slide > [role=tablist] > [role=tab][aria-selected=true] {
		background-color: gray;
}
/*-- painel de conteúdo ------------------------------------------------------*/
.css-js-wd-slide > [role=tabpanel] {
	border: var(--var-js-wd-panel-border);
	border-radius: var(--var-js-wd-panel-radius);
}`);