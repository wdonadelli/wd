/**
#3 Sinais
O objeto '{__SIGNAL} renderiza mensagens e notificações.
**/
const __SIGNAL = {
	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- SIGNAL --*/
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
	outline: 0.25em solid dodgerblue;
}
@media screen and (min-width: 768px) {
	.css-js-wd-signal > .css-js-wd-signal-form {
		flex-direction: row;
		align-items: center;
	}
	.css-js-wd-signal > .css-js-wd-signal-form > button {
		margin: 0 0.5em;
	}
}
`) - 1,
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
	/**. '{void alert(string head, string body, array dialog, function call)}: Exibe uma caixa de alerta ou de diálogo:
	|Argumento|Opcional|Descrição|
	|'{head}|Não|Define o título da caixa.|
	|'{body}|Não|Define a mensagem da caixa.|
	|'{dialog}|Sim|Lista com os rótulos dos botões do diálogo.|
	|'{call}|Sim|Função a ser executada a cada mudança de '{status} da caixa.|
	|""Tabela com os argumentos do método '{alert}""|
	- Se '{dialog} for informado, a caixa será de diálogo, caso contrário, de alerta;
	- Adicione um asterisco ao final do rótulo do botão de diálogo para definí-lo como focável;
	- A funcão '{call} recebe dois argumentos: uma string com o '{status} da janela e os dados do evento '{submit};
	- Quanto aos tipos de '{status}, ver objeto __WINDOW;
	- Os dados de '{submit} serão enviados quando clicado no botão de diálogo, fechando a caixa, caso contrário retorna nulo;
	- O valor do item da lista de diálogo será o rótulo do botão e seu índice estará definido na propriedade '{value};
	- Utilize a propriedade '{submitter} para identificar o botão clicado; e
	- Também é possível identificar o índice do botão clicado por meio do atributo '{data-dialog-index} fixado ao alvo do evento '{submit} ('{form}).**/
	alert: function(head, body, dialog, call) {
		const base = this.struct();
		const elem = document.createElement("div");
		base.head.textContent = head;
		base.body.textContent = body;
		if (Array.isArray(dialog)) dialog.forEach(function(v,i,a){
			const text = v.trim().replace(/\*$/, "");
			const auto = (/\*$/).test(v.trim());
			elem.innerHTML = text;
			const send = __HTML("button", {type: "submit", textContent: elem.textContent, autofocus: auto, value: i});
			base.form.appendChild(send);
			send.addEventListener("click", function(ev) {ev.currentTarget.form.dataset.dialogIndex = i;});
		});
		const form = base.form.childElementCount > 0;
		const fire = typeof call !== "function" ? null : function(sig, win, ev) {return call(sig, ev);};
		base.main.setAttribute("role", form ? "alertdialog" : "alert");
		base[form ? "quit" : "form"].remove();
		return __WINDOW.attach(base.main, form ? "modal" : "frame", fire);
	},
	/**. '{void dialog(node form, boolean modal, function call)}: Define uma caixa de diálogo livre a partir de um formulário.
	- O argumento '{form} deve ser um elemento de formulário HTML;
	- O argumento '{modal}, se falso, não interromperá o acesso ao documento;
	- O argumento '{call} trabalha da mesma forma que no método '{alert};
	- O formulário deve ser preparado previamente para acessibilidade e conter campos capazes de provocar sua submissão;
	- O atributo '{role} do formulário deve ter os valores '{alertdialog} ou '{dialog} (padrão); e
	- Na situação de múltiplas chamadas, atribua o nó HTML a uma variável ou chame o método por um ouvinte de clique caso o formulário esteja inserido na árvore do DOM.**/
	dialog: function(form, modal, call) {
		if (!(form instanceof HTMLFormElement)) return null;
		const fire = typeof call !== "function" ? null : function(sig, win, ev) {return call(sig, ev);};
		form.setAttribute("role", modal === false ? "dialog" : "alertdialog");
		return __WINDOW.attach(form, modal === false ? "float" : "modal", fire);
	},
	/**. '{void notify(string head, string body, function call)}: Exibe uma notificação:
	- Pode não funcionar em navegadores móveis em razão da maneira como construído a{exigências}@href{https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification}target{_blank};
	- Os argumentos '{head} e '{body} definem o cabeçalho e o texto da mensagem, respectivamente;
	- O argumento '{call} é uma função chamada após o envio da notificação que recebe o status da notificação;
	- A funcão opcional '{call} recebe como argumento uma string com o '{status} da notificação; e
	- Os status possíveis são ´{granted}, se a notificação foi permitida, e '{denied}, se foi negada.**/
	notify: function (head, body, call) {
		head = String(head || "").trim() || document.title.trim() || window.location.hostname;
		call = typeof call === "function" ? call : null;
		const config = {lang: __LANG.value, body: body};
		if (Notification.permission === "denied") {
			return call !== null ? call("denied") : undefined;
		}
		if (Notification.permission === "granted") {
			new Notification(head, config);
			return call !== null ? call("granted") : undefined;
		}
		else
			Notification.requestPermission().then(function(x) {
				if (x === "granted") new Notification(head, config);
				return call !== null ? call(x) : undefined;
			});
		return;
	},
	/**. '{void handleEvent(object ev)}: Disparador do objeto chamado durante os eventos '{keydown}.**/
	handleEvent: function(ev) {
		const re = /^(Arrow(Up|Left|Down|Right)|Home|End)$/;
		if (ev.type === "keydown" && re.test(ev.key)) {
			const prev = ev.target.previousElementSibling;
			const next = ev.target.nextElementSibling;
			const init = ev.target.parentElement.firstElementChild;
			const last = ev.target.parentElement.lastElementChild;
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
};