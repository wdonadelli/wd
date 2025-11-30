/**
#3 Barra de Progresso
O objeto '{__PROGRESS} registra a barra de progresso das requisições da biblioteca.
**/
const __PROGRESS = {
	//TODO https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress#describing_a_particular_region

	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- PROGRESS --*/
.css-wd-progress {
	padding: 0.5em;
	border: thin solid black;
	border-radius: 0.25em;
	background-color: white;
}
.css-wd-progress > progress {
	width: 100%;
}`),
	/**. '{object heap}: Pilha de processos em andamento.**/
	heap: {},
	/**. '{node box}: Container da caixa de progress.**/
	box:	__DOM({
		tag: "div",
		attr: {role: "alert", className: "css-wd-progress"},
		child: [{tag: "progress", attr: {}, child: []}]
	}).tag,
	/**. '{void calc()}: Calcula o valor da barra de progresso.**/
	calc: function() {
		const val = {sum: 0, len: 0};
		const bar = this.box.firstElementChild;
		for (let i in this.heap) {
			if (this.heap[i] === null) {
				bar.removeAttribute("value");
				bar.setAttribute("aria-label", "?")
				return;
			}
			val.len++;
			val.sum += this.heap[i];
		}
		const value = val.len === 0 ? 0 : val.sum/val.len;
		const label = value.toLocaleString(__LANG.value, {style: "percent", maximumFractionDigits: 0});
		bar.value   = value;
		bar.setAttribute("aria-label", label);
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