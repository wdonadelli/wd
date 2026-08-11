/**
#3 Sinais
O objeto '{__SIGNAL} renderiza mensagens e notificações.
**/
const __SIGNAL = {
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
		/*-- fechamento janela --*/
		struct.quit.addEventListener("click", function(x) {__WINDOW.detach(struct.main);});
		return struct;
	},
	/**. '{void alert(string head, string body, any dialog, function call)}: Exibe uma caixa de alerta ou de diálogo:
	|Argumento|Opcional|Descrição|
	|'{head}|Não|Define o título da caixa.|
	|'{body}|Não|Define a mensagem da caixa.|
	|'{dialog}|Sim|Pode ser uma lista de rótulos ou um nó de formulário.|
	|'{call}|Sim|Função a ser executada a cada mudança de '{status} da caixa.|
	|""Tabela com os argumentos do método '{alert}""|
	. Quanto ao argumento '{dialog}, observar as regras abaixo:
	- O comportamento padrão é a exibição de uma caixa de alerta com um botão para possibilitar seu fechamento;
	- Se '{dialog} for uma lista ou um nó de formulário, uma caixa de diálogo será exibida;
	- A lista e o nó de formulário precisam ter itens/campos maiores que zero;
	- No caso de uma lista, cada item corresponderá ao rótulo do botão de ação;
	- Adicionar um asterisco ao fim do rótulo o define com foco principal;
	- No caso de um nó de formulário, um campo de submissão será necessário para fechar a caixa de diálogo;
	- O nó de formulário utilizado não terá qualquer ação personalizada pelo método;
	- A funcão '{call} recebe o mesmo argumento do objeto '{__WINDOW}, exceto pela propriedade '{window}; e
	- No caso de uma lista, a propriedade '{submit} apresentará o índice da lista no lugar dos dados do evento.**/
	alert: function(head, body, dialog, call) {
		const base = this.struct();
		const elem = document.createElement("div");
		/*-- título e mensagem ---------------------------------------------------*/
		elem.innerHTML = head;
		base.head.textContent = elem.textContent;
		elem.innerHTML = body;
		base.body.textContent =  elem.textContent;
		/*-- diálogo de ações ----------------------------------------------------*/
		if (Array.isArray(dialog) && dialog.length > 0) {
			base.main.setAttribute("role", "alertdialog");
			base.quit.remove();
			/*-- botões --*/
			dialog.forEach(function(v,i,a) {
				elem.innerHTML = String(v).trim().replace(/\*$/, "");
				const send = __HTML("button", {type: "submit", textContent: elem.textContent, autofocus: (/\*$/).test(v.trim())});
				send.addEventListener("keydown", this);
				send.addEventListener("click", function(x) {base.main.dataset.dialogIndex = i;});
				base.form.appendChild(send);
			}, this);
			/*-- disparador --*/
			return __WINDOW.attach(base.main, "modal", typeof call !== "function" ? null : function(x) {
				if (x.signal === "submit" && "dialogIndex" in x.window.dataset) {
					x.submit = Number(x.window.dataset.dialogIndex);
					delete x.window.dataset.dialogIndex;
				}
				delete x.window;
				return call(x);
			});
		}
		/*-- diálogo com formulário próprio --------------------------------------*/
		if (__Type(dialog).instanceOf("HTMLFormElement") && dialog.length > 0) {
			base.main.setAttribute("role", "alertdialog");
			base.quit.remove();
			/*-- formulário --*/
			const parent = dialog.parentElement;
			base.main.replaceChild(dialog, base.form);
			/*-- disparador --*/
			return __WINDOW.attach(base.main, "modal", typeof call !== "function" ? null : function(x) {
				if (x.close) parent.appendChild(dialog);
				delete x.window;
				return call(x);
			});
		}
		/*-- um alerta -----------------------------------------------------------*/
		base.main.setAttribute("role", "alert");
		base.form.remove();
		return __WINDOW.attach(base.main, "frame", typeof call !== "function" ? null : function(x) {
			delete x.window;
			return call(x);
		});
	},
	/**. '{void dialog(node box, function call)}: Exibe uma caixa de diálogo modal a partir de um nó HTML já preparado:
	- O nó HTML precisará conter um formulário para submissão para fechar o diálogo; e
	- O argumento '{call} receberá o mesmo parâmetro do objeto '{__WINDOW}.**/
	dialog: function(box, call) {
		if (__Type(box).instanceOf("HTMLElement")) {
			__HTML(box, {role: "alertdialog"});
			__WINDOW.attach(box, "modal", call);
		}
		return;
	},
	/**. '{void notify(string head, string body, function call)}: Exibe uma notificação:
	- Pode não funcionar em navegadores móveis em razão da maneira como construído a{exigências}@href{https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification}target{_blank};
	- Os argumentos '{head} e '{body} definem o cabeçalho e o texto da mensagem, respectivamente;
	- O argumento '{call} é uma função chamada após o envio da notificação que recebe o status da notificação;
	- A funcão opcional '{call} recebe como argumento um objeto (ver '{alert}) com a propriedade '{signal} informando o '{status} da notificação; e
	- Os status possíveis são '{granted}, se a notificação foi permitida, e '{denied}, se foi negada.**/
	notify: function (head, body, call) {
		head = String(head || "").trim() || document.title.trim() || window.location.hostname;
		call = typeof call === "function" ? call : null;
		const config = {lang: __LANG.value, body: body};
		if (Notification.permission === "denied") {
			return call !== null ? call({signal: "denied", close: false, open: false, submit: null}) : undefined;
		}
		if (Notification.permission === "granted") {
			new Notification(head, config);
			return call !== null ? call({signal: "granted", close: false, open: true, submit: null}) : undefined;
		}
		else
			Notification.requestPermission().then(function(x) {
				if (x === "granted") new Notification(head, config);
				return call !== null ? call({signal: x, close: false, open: x === "granted", submit: null}) : undefined;
			});
		return;
	},
	/**. '{void keydown(object ev)}: Manipulador para teclado.**/
	keydown: function(ev) {
		const re = /^(Arrow(Up|Left|Down|Right)|Home|End)$/;
		if (ev.type === "keydown" && re.test(ev.key)) {
			const prev = ev.currentTarget.previousElementSibling;
			const next = ev.currentTarget.nextElementSibling;
			const init = ev.currentTarget.parentElement.firstElementChild;
			const last = ev.currentTarget.parentElement.lastElementChild;
			const row  = init.getBoundingClientRect().top === last.getBoundingClientRect().top;
			if (init === last)
				return;
			if (((!row && ev.key === "ArrowUp")   || (row && ev.key === "ArrowLeft")) && prev)
				return prev.focus();
			if (((!row && ev.key === "ArrowDown") || (row && ev.key === "ArrowRight")) && next)
				return next.focus();
			if (ev.key === "Home")
				return init.focus();
			if (ev.key === "End")
				return last.focus();
		}
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador do objeto chamado durante os eventos '{keydown click}.**/
	handleEvent: function(ev) {
		return ev.type in this ? this[ev.type](ev) : undefined;
	},
};
__CSS.push(`/*-- SIGNAL --*/
:root {
	--var-js-wd-signal-fg: #303030;
	--var-js-wd-signal-bg: #f1f1f1;
}
.css-js-wd-signal {
	position: relative;
	padding: 0.5em;
	font-size: 14px;
	font-family: sans-serif;
	background: var(--var-js-wd-signal-bg);
	color: var(--var-js-wd-signal-fg);
	border: thin solid black;
	border-radius: 0.25em;
}
.css-js-wd-signal > .css-js-wd-signal-quit {
	font-size: inherit;
	position: absolute;
	top: 0.5em;
	right: 0.5em;
	margin: 0;
	padding: 0;
	border: 0;
	background: none;
	color: var(--var-js-wd-signal-bg);
	cursor: pointer;
}
.css-js-wd-signal > .css-js-wd-signal-head {
	margin: -0.5em -0.5em 0 -0.5em;
	padding: 0.5em 2em 0.5em 0.5em;
	font-size: inherit;
	font-weight: bold;
	color: var(--var-js-wd-signal-bg);
	background: var(--var-js-wd-signal-fg);
	border-radius: 0.25em 0.25em 0 0;
}
.css-js-wd-signal > .css-js-wd-signal-body {
	margin: 1em 0;
}
.css-js-wd-signal > .css-js-wd-signal-form {
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	align-items: stretch;
  justify-content: space-around;
}
.css-js-wd-signal > .css-js-wd-signal-form > button {
	font-size: inherit;
	font-family: inherit;
	border: thin solid black;
	border-radius: 0.25em;
	cursor: pointer;
	margin: 0.25em 0;
	padding: 0.25em 0.5em;
	color: #000000;
	background: #d9d9d9;
	appearance: none;
}
.css-js-wd-signal > .css-js-wd-signal-form > button:hover {
	background: #c0c0c0;
}
.css-js-wd-signal > .css-js-wd-signal-form > button:focus {
	outline: 0.2em solid dodgerblue;
}
@media screen and (min-width: 768px) {
	.css-js-wd-signal > .css-js-wd-signal-form {
		flex-direction: row;
		align-items: center;
	}
	.css-js-wd-signal > .css-js-wd-signal-form > button {
		margin: 0 0.5em;
	}
}`);