/**
#3 Ferramentas
	O objeto '{__TOOLS} tem o objetivo de agrupar ferramentas diversas não incluídas em outras categorias.
**/
const __TOOLS = {
	/**. '{void attach(object data)}: Executa os métodos da biblioteca a partir de um objeto.**/
	//FIXME isso não funciona porque tem método recebem argumentos de diferentes tipos
	attach: function(data) {
		data = __Type(data).object ? data : {};
		for (let i in data) {
			if (i in this) this[i](data[i]);
		}
		return;
	},
	/**. '{void full(node elem)}: Alterna a exibição do nó em tela cheia (funciona apenas em manipuladores de evento).**/
	full: function(elem) {
		const name = {
			open: ["requestFullscreen", "webkitRequestFullscreen", "msRequestFullscreen"],
			exit: ["exitFullscreen",    "webkitExitFullscreen",    "msExitFullscreen"]
		};
		const full = document.fullscreenElement;
		const attr = full === elem ? "exit" : "open";
		const node = attr === "exit" ? document : elem;
		for (let i = 0; i < name[attr].length; i++) {
			if (typeof node[name[attr][i]] === "function")
				return node[name[attr][i]]();
		}
		return;
	},
	/**. '{void select(node elem)}: Seleciona o conteúdo do nó.**/
	select: function(elem, inner) {
		const select = window.getSelection();
		const range  = document.createRange();
		select.removeAllRanges();
		range[inner === true ? "selectNodeContents" : "selectNode"](elem);
		select.addRange(range);
		return range;
	},
	/**. '{void exec(object command)}: Aplica os camandos do método a{execCommand}@href{https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand}target{_blank} conforme definido no argumento:
	- os nomes representam o tipo de comando e o seu valor, se aplicável, o complemento correspondente;
	- os nomes podem ser no formato '{camelCase} ou '{kebab};
	- o método só funciona quando vinculado a um evento de usuário; e
	- o comando '{insertHTML} não é executado.**/
	exec: function (command) {
		const data = __Type(command).object ? command : {};
		const bool = /^(contentReadOnly|useCSS|styleWithCSS|showDefaultUI)$/;
		const sel  = window.getSelection().toString();
		let arg, cmd;
		for (let i in data) {
			cmd = __STRING.case(i, "camel").trim();
			arg = data[i];
			if (cmd === "insertHTML") continue;
			if (bool.test(cmd) && typeof arg !== "boolean") {
				if ((/true/i).test(arg))       arg = true;
				else if ((/false/i).test(arg)) arg = false;
				else if (!isNaN(arg))          arg = Number(arg);
			}
			if (cmd === "createLink" && !__Type(arg).url) {
				arg = prompt(sel.trim() === "" ? "Link:" : sel, __Type(sel).url ? new URL(sel) : "");
				cmd = arg === null || arg.trim() === "" ? "unlink" : cmd;
			}
			else if (cmd === "insertImage") {
				arg = prompt("Link:", arg ? arg : "");
			}
			document.execCommand(cmd, false, arg);
		}
		return;
	},
	/**. '{void copy(node elem)}: Copia o conteúdo textual do elemento para o '{clipboard}.**/
	copy: function(elem) {
		this.select(elem);
		document.execCommand("copy");
		window.getSelection().removeAllRanges();
		return;
	},
	/**. '{void write(string text)}: Copia o argumento para o '{clipboard}.**/
	write: function(text) {
		const self = this;
		const copy = function(x) {
			const div = __HTML("div", {innerText: text});
			document.body.appendChild(div);
			self.copy(div);
			div.remove();
			return;
		};
		if ("clipboards" in navigator && "writeText" in navigator.clipboard)
			navigator.clipboard.writeText(text).then(null, copy).catch(copy);
		else
			copy();
		return;
	},
	//FIXME não sei se funciona
	cursor: function(elem, n) {
		this.select(elem);
		window.getSelection().collapse(elem, n);
	},
};