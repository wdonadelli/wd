/**
#3 Barra de Progresso
	O objeto '{__PROGRESS} registra a barra de progresso das requisições da biblioteca.**/
const __PROGRESS = {
	//TODO https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress#describing_a_particular_region

	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- PROGRESS --*/
.css-wd-progress {
	padding: 0.25em 0.5em;
	border: thin solid black;
	border-radius: 0.25em;
	background-color: white;
	color: black;
	text-align: right;
	opacity: 0.75;
	font-family: var(--var-js-wd-font-type);
	font-size: var(--var-js-wd-font-size);
}
.css-wd-progress * {
	width: 100%;
}`),
	/**. '{object heap}: Pilha de processos em andamento.**/
	heap: {},
	/**. '{node box}: Container da caixa de progress.**/
	box:	__DOM({
		tag: "div",
		attr: {role: "alert", className: "css-wd-progress"},
		child: [
			{tag: "label", attr: {}, child: [
				{tag: "progress", attr: {}, child: []}
			]},
			{tag: "div", attr: {}, child: []}
		]
	}).tag,
	/**. '{void calc()}: Calcula o valor da barra de progresso.**/
	calc: function() {
		const val = {sum: 0, len: 0};
		const bar = this.box.firstElementChild.firstElementChild;
		const txt = this.box.lastElementChild;
		for (let i in this.heap) {
			val.sum = val.sum === null || this.heap[i] === null ? null : val.sum + this.heap[i];
			val.len++;
		}
		if (val.sum === null || val.len === 0) {
			bar.removeAttribute("value")
			txt.textContent = "...";
		}
		else {
			const value = val.sum/val.len;
			const label = value.toLocaleString(__LANG.value, {style: "percent", maximumFractionDigits: 0});
			bar.value = value;
			txt.textContent = label;
		}
		return;
	},
	/**. '{boolean empty}: Informa se heap está vazio.**/
	get empty() {
		for (let i in this.heap) return false;
		return true;
	},
	/**. '{string open()}: Abre um processo e retorna seu identificador.**/
	open: function() {
		if (this.empty) __WINDOW.attach(this.box, "frame");
		const id = __ID.value;
		this.heap[id] = null;
		this.calc();
		return id;
	},
	/**. '{void close(string id)}: Fecha o processo aberto com o identificador especificado.**/
	close: function(id) {
		if (id in this.heap) {
			delete this.heap[id];
			this.calc();
		}
		if (this.empty) __WINDOW.detach(this.box);
		return;
	},
	/**. '{void value(string id, float data)}: Define o valor do progresso.**/
	value: function(id, data) {
		if (id in this.heap) {
			const val     = isFinite(data) ? Number(data) : null;
			this.heap[id] = val === null ? val : (val > 1 ? 1 : (val < 0 ? 0 : val));
			this.calc();
		}
		return;
	},
};