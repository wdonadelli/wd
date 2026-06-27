/**
#3 Sinais
O objeto '{__SIGNAL} renderiza mensagens e notificações.
**/
const __SIGNAL = {
	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- SIGNAL --*/
.css-js-wd-signal {
	position: relative;
	font-size: 14px;
	font-family: sans-serif;
	border: thin solid black;
	border-radius: 0.25em;
	padding: 0.5em;
	background: white;
	color: black;
}
.css-js-wd-signal > .css-js-wd-signal-quit {
	font-size: 1em;
	position: absolute;
	top: 0.5em;
	right: 0.5em;
	margin: 0;
	padding: 0;
	border: 0;
	background: none;
	cursor: pointer;
}
.css-js-wd-signal > .css-js-wd-signal-head {
	font-size: larger;
	border-radius: 0.25em 0.25em 0 0;
	color: white;
	background: rgba(0,0,255,0.3);
	margin: -0.5em -0.5em 0 -0.5em;
	padding: 0.3em 2em 0.3em 0.3em;
}
.css-js-wd-signal > .css-js-wd-signal-body {
	margin: 1em 0;
}
.css-js-wd-signal > .css-js-wd-signal-form {
	position: flex;
	align-items: center;
  justify-content: space-around;
	margin: 0;
}
.css-js-wd-signal > .css-js-wd-signal-form > * {
	font-size: inherit;
	font-family: inherit;
	background: white;
	color: black;
	border: thin solid black;
	border-radius: 0.25em;
	cursor: pointer;
	margin: 0 0.5em;
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
		struct.quit = __HTML("button", {className: "css-js-wd-signal-quit", type: "button", "aria-label": "Close", innerHTML: "&#x2715;"});
		struct.head = __HTML("h1",     {className: "css-js-wd-signal-head", id: __ID.value});
		struct.body = __HTML("p",      {className: "css-js-wd-signal-body", id: __ID.value});
		struct.form = __HTML("form",   {className: "css-js-wd-signal-form"});
		struct.main = __DOM({
			tag: "div",
			attr: {"aria-labelledby": struct.head.id, "aria-describedby": struct.body.id, className: "css-js-wd-signal"},
			child: [{tag: struct.quit}, {tag: struct.head}, {tag: struct.body}, {tag: struct.form}],
		}).tag;
		struct.quit.addEventListener("click", function(ev) {return __WINDOW.detach(ev.currentTarget.parentElement);});
		struct.form.addEventListener("keydown", this);
		return struct;
	},














	/**. '{node alert(string body, string head, string quit)}: Exibe e retorna um nó de alerta (ver evento '{wdwindow}) ou nulo:
	|Argumento|Descrição|Observação|
	|body|Texto da mensagem|Obrigatório|
	|head|Texto do título|Opcional|
	|quit|Rótulo do botão fechar|Recomendado|**/
	alert: function(head, body, dialog, call) {
		const base = this.struct();
		base.head.textContent = head;
		base.body.textContent = body;
		if (Array.isArray(dialog)) dialog.forEach(function(v,i,a){
			const text = v.trim().replace(/\*$/, "");
			const auto = (/\*$/).test(v.trim());
			const send = __HTML("button", {type: "submit", textContent: text, autofocus: auto, value: i});
			base.form.appendChild(send);
			//TODO navegar com as setas do teclado
		});
		const form = base.form.childElementCount > 0;
		const fire = typeof call !== "function" ? null : function(sig, win, ev) {return call(sig, ev);};
		base.main.setAttribute("role", form ? "alertdialog" : "alert");
		base[form ? "quit" : "form"].remove();
		return __WINDOW.attach(base.main, form ? "modal" : "frame", fire);
	},

	dialog: function(form, call) {
		if (!(form instanceof HTMLFormElement)) return null;
		const type = form.getAttribute("role") === "alertdialog" ? "modal" : "float";
		const fire = typeof call !== "function" ? null : function(sig, win, ev) {return call(sig, ev);};
		form.setAttribute("role", type === "modal" ? "alertdialog" : "dialog");
		return __WINDOW.attach(form, type, fire);
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
		if (ev.type === "keydown") {
			const prev = ev.target.previousElementSibling;
			const next = ev.target.nextElementSibling;
			if ((ev.key === "ArrowUp" || ev.key === "ArrowLeft") && prev !== null)
				return prev.focus();
			if ((ev.key === "ArrowDown" || ev.key === "ArrowRight") && next !== null)
				return next.focus();
			if (ev.key === "Home")
				return ev.target.parentElement.firstElementChild.focus();
			if (ev.key === "End")
				return ev.target.parentElement.lastElementChild.focus();
		}
		return;
	},
};
