/**
#3 Barra de Progresso
O objeto '{__PROGRESS} registra a barra de progresso das requisições da biblioteca.
**/
const __PROGRESS = {
	//TODO https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress#describing_a_particular_region

	/**. '{integer CSS}: Registra o CSS do elemento do módulo.**/
	CSS: __CSS.data.push(`/*-- PROGRESS --*/
[data-js-wd-window="progress"] {
	position: fixed !important;
	top:   0 !important;
	right: 0 !important;
	display: block !important;
	margin: 0 !important;
	padding: 0 1em 0 0.5em !important;
	overflow: hidden !important;
	z-index: var(--var-js-wd-z-index-0) !important;
	font-size: var(--var-js-wd-font-size);
	font-family: var(--var-js-wd-font-type);
}`)-1,
	/**. '{object heap}: Pilha de processos em andamento.**/
	heap: {},
	/**. '{node tree}: Elementos da barra de progresso (main, label, bar).**/
	tree: (function() {
		const bar   = {tag: "PROGRESS", attr: {id:  "js_wd_window_progress"}};
		const label = {tag: "LABEL",    attr: {for: bar.attr.id, id: "js_wd_window_progress_percent"}};
		const attr  = {"data-js-wd-window": "progress", role: "dialog", "aria-labelledby": label.attr.id}
		const dom   = __DOM({tag: "FORM", attr: attr, child: [bar, label]});
		return {main: dom.tag, bar: dom.child[0].tag, label: dom.child[1].tag};
	})(),
	/**. '{void calc()}: Calcula o valor da barra de progresso.**/
	calc: function() {
		let empty = 0;
		let total = 0;
		let width = 0;
		for (let i in this.heap) {
			width++;
			empty += this.heap[i] === null ? 1 : 0;
			total += this.heap[i] === null ? 0 : this.heap[i];
		}
		if (width === 0) {
			this.tree.main.remove();
			this.tree.label.textContent = "?";
			this.tree.bar.removeAttribute("value");
		}
		else if (empty === width) {
			this.tree.bar.removeAttribute("value");
			this.tree.label.textContent = "?";
		}
		else {
			const value = total/(width - empty);
			const text  = value.toLocaleString(__LANG.value, {style: "percent", maximumFractionDigits: 0});
			this.tree.bar.value       = value;
			this.tree.label.innerText = text;
		}
		return;
	},
	/**. '{string open()}: Abre um processo e retorna seu identificador.**/
	open: function() {
		const id = __ID.value;
		this.heap[id] = null;
		if (this.tree.main.parentElement !== document.body)
			document.body.appendChild(this.tree.main);
		this.calc();
		return id;
	},
	/**. '{void close(string id)}: Fecha o processo aberto com o identificador especificado.**/
	close: function(id) {
		if (id in this.heap) {
			delete this.heap[id];
			this.calc();
		}
		return;
	},
	/**. '{void value(string id, float data)}: Define o valor do progresso.**/
	value: function(id, data) {
		if (id in this.heap) {
			this.heap[id] = isFinite(data) ? Math.abs(Number(data)) : null;//FIXME como otimizar isso?
			this.calc();
		}
		return;
	},
};