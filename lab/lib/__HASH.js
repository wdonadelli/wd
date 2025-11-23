/**
#4 Ancoragem para Elementos Fixos
O objeto '{__HASH} ajusta margens e posição do elementos ancorados na tela.
**/
const __HASH = {
	/**. '{array fixed}: Retorna uma lista de nós com posicionamento fixo a '{body}.**/
	get fixed() {
		const css   = "body > :not([data-js-wd-window])";
		const query = Array.prototype.slice.call(document.querySelectorAll(css));
		return query.filter(function(node,i,a) {
			const style = window.getComputedStyle(node, null);
			return style.position === "fixed";
		});
	},
	/**. '{array full}: Retorna uma lista de objetos contendo dados ('{top bottom left right width height}) dos nós fixos caso eles ocupem completamente alguma das laterais de '{body}. A propriedade '{side} indicará o lateral ocupada.**/
	get full() {
		const width  = window.innerWidth;
		const height = window.innerHeight;
		const list   = [];
		this.fixed.forEach(function(node,i,a) {
			const data = node.getBoundingClientRect();
			/*-- horizontal --*/
			if (data.left === 0 && data.right === width)
				data.side = data.top === 0 ? "top" : (data.bottom === height ? "bottom" : null);
			/*-- vertical --*/
			else if (data.top === 0 && data.bottom === height)
				data.side = data.left === 0 ? "left" : (data.right === width ? "right" : null);
			if (data.side !== null) list.push(data);
		});
		return list;
	},
	/**. '{object max}: Retorna os maiores dados encontrados para cada lateral ocupada completamente advinda de '{full}.**/
	get max() {
		const size = {top: 0, bottom: 0, left: 0, right: 0};
		const look = {top: "height", bottom: "height", left: "width", right: "width"};
		const data = {top: null, bottom: null, left: null, right: null};
		this.full.forEach(function(item,i,a) {
			if (item[look[item.side]] > size[item.side]) {
				size[item.side] = item[look[item.side]];
				data[item.side] = item;
			}
		});
		return data;
	},
	/**. '{void handleEvent(object ev)}: Disparador do objeto chamado durante os eventos '{resize}, '{hashchange} e '{wdreload}.**/
	handleEvent: function(ev) {
		const data = this.max;
		const body = window.getComputedStyle(document.body, null);
		const side = {marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0};
		/*-- obter dados das margnes de body --*/
		for (let i in side)
			side[i] = Number(body[i].replace(/\D+$/, ""));
		/*-- acertar margens de body --*/
		for (let i in data) {
			if (data[i] !== null) {
				if      (i === "top"    && data[i].height > side.marginTop)
					document.body.style.marginTop    = `${data[i].height}px`;
				else if (i === "bottom" && data[i].height > side.marginBottom)
					document.body.style.marginBottom = `${data[i].height}px`;
				else if (i === "left"   && data[i].width  > side.marginLeft)
					document.body.style.marginLeft   = `${data[i].width}px`;
				else if (i === "right"  && data[i].width  > side.marginRight)
					document.body.style.marginRight  = `${data[i].width}px`;
			}
		}
		/*-- acertar posicionamento do hash --*/
		if ((ev.type === "wdreload" || ev.type === "hashchange") && data.top !== null) {
			const hash  = window.location.hash;
			const query = hash === "" ? null : document.querySelector(hash);
			if (query !== null) {
				window.scrollTo(0, query.offsetTop - side.marginTop);
			}
		}
		return;
	}
};