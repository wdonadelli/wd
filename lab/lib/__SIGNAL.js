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
	/**. '{object quit(string label)}: Retorna a estrutura do botão de fechar o alerta. O argumento define a descrição do botão.**/
	quit: function(label) {
		return {tag:  "button", attr: {
			type: "button",
			className: "css-wd-quit",
			"aria-label": String(label || "").trim() || "Close",
			addEventListener: {click: this},
			innerHTML: "&#x2715;"
		}};
	},
	/**. '{node alert(string body, string head, string quit)}: Exibe e retorna um nó de alerta (ver evento '{wdwindow}) ou nulo:
	|Argumento|Descrição|Observação|
	|body|Texto da mensagem|Obrigatório|
	|head|Texto do título|Opcional|
	|quit|Rótulo do botão fechar|Recomendado|**/
	alert: function(body, head, quit) {
		head = String(head || "").trim() || document.title.trim() || window.location.hostname;
		body = String(body || "").trim() || null;
		/*-- alerta --*/
		const box0 = {tag: "div", attr: {role: "alert", className: "css-wd-alert"}};
		const box1 = {tag:  "h1", attr: {innerHTML: head}};
		const box2 = {tag:   "p", attr: {innerHTML: body}};
		box0.child = [box1, box2, this.quit(quit)];
		const data = body === null ? null : __WINDOW.add(__DOM(box0).tag, "frame");
		return data === null ? null : __WINDOW.find(data).window;
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
		head = String(head || "").trim() || document.title.trim() || window.location.hostname;
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
};
