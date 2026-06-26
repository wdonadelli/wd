/**
#3 Sinais
O objeto '{__SIGNAL} renderiza mensagens e notificações.
**/
const __SIGNAL = {
	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- SIGNAL --*/
.css-wd-alert, .css-wd-dialog {
	font-size: 14px;
	font-family: var(--var-js-wd-font-type);
	border: thin solid black;
	border-radius: 0.25em;
	position: relative;
}
.css-wd-alert > *, .css-wd-dialog > * {
	margin: 0;
	padding: 0.5em;
}
.css-wd-alert > h1, .css-wd-dialog > h1 {font-size: 1.0em; padding-right: 2em;}
.css-wd-alert > p  {font-size: 0.9em;}
.css-wd-quit {
	font-size: 1em;
	position: absolute;
	top: 0.5em;
	right: 1em;
	margin: 0;
	padding: 0;
	background: none;
	border: 0;
}`) - 1,

	/**. '{string head(string text)}: Retorna o cabeçalho definido em '{text}.**/
	head: function(text) {return String(text || "").trim() || document.title.trim() || window.location.hostname;},
	/**. '{object struct()}: Retorna a estrutura para alertas e diálogos:
	|Nome|Descrição|
	|'{quit}|Botão padrão para fechar diálogo|
	|'{heap}|Elemento para o cabeçalho|
	|'{body}|Elemento para a mensagem|
	|'{base}|Elemento para anexar estrutura HTML|
	|'{main}|Caixa estruturada com os elementos acima|**/
	struct: function() {
		const struct = {};
		struct.quit = __HTML("button", {type: "button", className: "css-wd-signal-quit", "aria-label": "Close", innerHTML: "&#x2715;"});
		struct.head = __HTML("h1",  {className: "css-wd-signal-head", id: __ID.value});
		struct.body = __HTML("p",   {className: "css-wd-signal-body", id: __ID.value});
		struct.html = __HTML("div", {id: __ID.value});
		struct.main = __DOM({
			tag: "div",
			attr: {"aria-labelledby": struct.head.id, className: "css-wd-signal"},
			child: [{tag: struct.quit}, {tag: struct.head}, {tag: struct.body}, {tag: struct.html}],
		}).tag;
		struct.quit.addEventListener("click", function(ev) {return __WINDOW.detach(ev.currentTarget.parentElement);})
		return struct;
	},
	/**. '{boolean isDialog(node data)}: Retorna se o argumento é ou possui um formulário com botão de submissão.**/
	isDialog: function(data) {
		const html = typeof data === "object" && data instanceof HTMLElement;
		const form = html ? (data instanceof HTMLFormElement || data.querySelector("form") !== null) : false;
		const elem = form ? (data instanceof HTMLFormElement ? data : data.querySelector("form")) : null;
		const exit = form ? elem.querySelector(`input[type="submit"], input[type="image"], button[type="submit"]`) !== null : false;
		return exit;
	},

	window: function (data) {
		data = __Type(data).object ? data : {};
		const base = this.struct();
		/*-- cabeçalho --*/
		base.head.textContent = this.head(data.head);
		/*-- mensagem --*/
		if ("body" in data) {
			base.body.textContent = String(data.body).trim();
			base.main.setAttribute("aria-describedby", base.body.id);
		} else {
			base.body.remove();
			data.body = null;
		}
		/*-- estrutura HTML --*/
		if (typeof data.html === "object" && data.html instanceof HTMLElement) {
			base.html.appendChild(data.html);
			if (data.body === null)
				base.main.setAttribute("aria-details", base.html.id);
		} else {
			base.html.remove();
			data.html = null;
		}
		/*-- role --*/
		const role = this.isDialog(base.main) ? (data.modal === true ? "alertdialog" : "dialog") : "alert";
		base.main.setAttribute("role", role);
		if (role !== "alert")
			base.quit.remove();
		/*-- janela --*/
		const win = {alert: "frame", dialog: "float", alertdialog: "modal"};
		return __WINDOW.attach(base.main, win[role], data.call);
	},














	/**. '{node alert(string body, string head, string quit)}: Exibe e retorna um nó de alerta (ver evento '{wdwindow}) ou nulo:
	|Argumento|Descrição|Observação|
	|body|Texto da mensagem|Obrigatório|
	|head|Texto do título|Opcional|
	|quit|Rótulo do botão fechar|Recomendado|**/
	alert: function(body, head, time) {
		const html = this.struct();
		//TODO criar função timeout
		const fire = !Number.isInteger(time) || time < 1 ? null : function(elem, type, ev) {
			setTimeout(function() {__WINDOW.detach(html.main);}, time);
		}
		html.main.setAttribute("role", "alert");
		html.head.textContent = this.head(head);
		html.body.textContent = body;
		return __WINDOW.attach(html.main, "frame", fire);
	},




	/**. '{node dialog(node form, string head, string quit)}: Exibe e retorna um nó de diálogo (ver evento '{wdwinow}) ou nulo:
	|Argumento|Descrição|Observação|
	|form|Formulário para o diálogo|Obrigatório|
	|head|Texto do título|Opcional|
	|quit|Rótulo do botão fechar|Recomendado|**/
	dialog: function(form, head, quit) {
		head = String(head || "").trim() || document.title.trim() || window.location.hostname;
		form = typeof form === "object" && form instanceof HTMLFormElement ? form : null;
		/*-- Barrar formulário inválido ou já existente --*/
		if (form === null || __WINDOW.find(form) !== null)
			return null;
		if (form.method.toLowerCase() === "dialog") form.method = "get";
		/*-- diálogo --*/
		const attr = {
			"aria-labelledby":  __ID.value,
			"aria-describedby": form.id.trim() !== "" ? form.id : __ID.value,
			addEventListener:   {wdwindow: this},
			role:               "alertdialog",
			className:          "css-wd-dialog"
		};
		const box0 = {tag: "div", attr: attr};
		const box1 = {tag:  "h1", attr: {id: attr["aria-labelledby"], innerHTML: head}};
		const box2 = {tag:  form, attr: {id: attr["aria-describedby"], addEventListener: {submit: this}}};
		box0.child = [box1, box2, this.quit(quit)];
		const data = __WINDOW.add(__DOM(box0).tag, "modal");
		return data === null ? null : __WINDOW.find(data).window;
	},
	/**. '{void notify(string body, string head)}: Exibe uma notificação (ver método i{alert}).**/
	notify: function (body, head) {
		head = this.head(head);
		body = String(body || "").trim() || null;
		if (body !== null) {
			const config = {lang: __LANG.value, body: body, tag: __ID.value,};
			if (Notification.permission === "denied")
				return;
			if (Notification.permission === "granted")
				new Notification(head, config);
			else
				Notification.requestPermission().then(function(x) {
					if (x === "granted") new Notification(head, config);
				});
		}
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador do objeto chamado durante os eventos '{submit e click}.**/
	handleEvent: function(ev) {
		ev.preventDefault();
		if (ev.type === "wdwindow") {
			if (ev.detail.status === "canceled" || ev.detail.status === "closed") {
				const form = ev.target.querySelector("form");
				if (form !== null) {
					form.remove();
					form.removeEventListener("submit", this)
				}
			}
		}
		else if (ev.type === "click" || ev.type === "submit") {
			__WINDOW.remove(ev.target);
		}
		return;
	},
};
