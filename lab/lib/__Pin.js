/**
#3 Fixação
O construtor '{__Pin} tem o objetivo de efetuar o posicionamento do nó ('{box}) fixamente à tela ou a relativamente a outro nó ('{pin}):
|Argumento|Tipo|Descrição|
|box|node|O nó a ser fixado|
|pin|node|Fixa '{box} relativamente a '{pin}|
|pin|object|Fixa o '{box} na posição definida pelas propriedades '{x} e '{y}|
**/
function __Pin(box, pin) {
	if (!(this instanceof __Pin)) return new __Pin(box, pin);
	const test = {box: new __Type(box), pin: new __Type(pin)};
	const node = test.pin.node && test.pin.value.length > 0;
	let   data = {x: 0, y: 0};
	if (!test.box.node || test.box.value.length < 1)
		throw new TypeError("__Fixed: box must be an HTML element.");
	if (node)
		data = test.pin.value[0].getBoundingClientRect();
	else if (test.pin.object)
		data = {
			x: !isFinite(pin.x) ? 0 : Number(pin.x) >= 0 ? Number(pin.x) : 0,
			y: !isFinite(pin.y) ? 0 : Number(pin.y) >= 0 ? Number(pin.y) : 0,
		};
	Object.defineProperties(this, {
		/**. '{node box}: Nó a ser posicionado.**/
		box:  {value: test.box.value[0]},
		/**. '{object bcr}: Retorna as dimensões do nó a ser fixado.**/
		bcr:  {value: test.box.value[0].getBoundingClientRect()},
		/**. '{object pin}: Retorna o ponto de fixação do nó.**/
		pin:  {value: data},
		/**. '{boolean node}: Informa se o ponto de referência para fixação é um nó.**/
		node: {value: node}
	});
}

Object.defineProperties(__Pin.prototype, {
	constructor: {value: __Pin},
	/**. '{object ecra}: Retorna as dimensões do monitor (w/h).**/
	ecra: {value: {w: window.screen.width, h: window.screen.height}},
	/**. '{object area}: Retorna as dimensões da tela (w/h).**/
	area: {get: function() {return {w: window.innerWidth, h: window.innerHeight};}},
	/**. '{integer padd}: Retorna a expessura das bordas.**/
	padd: {get: function() {return Math.min(this.ecra.w, this.ecra.h)*0.01;}},
	/**. '{object edge}: Retorna as dimensões da área útil (t/r/b/l/w/h).**/
	edge: {get: function() {
		return {
			t: this.padd, b: this.area.h - this.padd,
			l: this.padd, r: this.area.w - this.padd,
			w: this.area.w - 2*this.padd,
			h: this.area.h - 2*this.padd,
		};
	}},
	/**. '{object space}: Retorna o espaço disponível em cada direção (n/e/s/w) em relação à área exibida.**/
	space: {get: function() {
		return {
			n: this.node ? this.pin.top   : this.pin.y,
			w: this.node ? this.pin.right : this.pin.x,
			s: this.area.h - (this.node ? this.pin.bottom : this.pin.y),
			e: this.area.w - (this.node ? this.pin.left   : this.pin.x)
		};
	}},
	/**. '{object wide}: Retorna a direção que contém o maior espaço (e/w para horizontal e n/s para vertical).**/
	wide: {get: function() {
		const data = this.space;
		return {v: data.s >= data.n ? "s" : "n", h: data.e >= data.w ? "e" : "w"};
	}},
	/**. '{integer width}: Retorna o comprimento da caixa.**/
	width: {get: function() {
		return this.bcr.width > this.edge.w ? this.edge.w : this.bcr.width;
	}},
	/**. '{number horizontal}: Retorna a âncora horizontal para a caixa (negativo fixa i{left}, positivo fixa i{right}).**/
	horizontal: {get: function() {
		const edge  = this.edge;
		const left  = this.node ? this.pin.left  : this.pin.x;
		const right = this.node ? this.pin.right : this.pin.x;
		const width = this.width;
		const wide  = this.padd * (this.wide.h === "w" ? -1 : 1);
		return left + width <= edge.r ? -left : (right - width >= edge.l ? this.area.w - right : wide);
	}},
	/**. '{number vertical}: Retorna a âncora na vertical para a caixa (negativo fixa i{top} positivo fixa i{bottom}).**/
	vertical: {get: function() {
		const edge   = this.edge;
		const top    = this.node ? this.pin.top    : this.pin.y;
		const bottom = this.node ? this.pin.bottom : this.pin.y;
		const height = this.bcr.height;
		const wide   = this.wide.v === "s" ? -bottom : this.area.h - top;
		return bottom + height <= edge.b ? -bottom : (top - height >= edge.t ? this.area.h - top : wide);
	}},
	/**. '{integer height}: Retorna a altura máxima da caixa.**/
	height: {get: function() {
		const data = this.vertical;
		const abs  = Math.abs(data);
		return data < 0 ? (this.edge.b + data) : (this.edge.h - data - this.edge.t);
	}},
	/**. '{number fix()}: Fixa a caixa à tela.**/
	fix: {
		value: function() {
			/*-- ajustar posição para incluir bordas quando não for fixado a nó --*/
			if (!this.node) {
				const edge = this.edge;
				this.pin.x = this.pin.x < edge.l ? edge.l : (this.pin.x > edge.r ? edge.r : this.pin.x);
				this.pin.y = this.pin.y < edge.t ? edge.t : (this.pin.y > edge.b ? edge.b : this.pin.y);
			}
			const h = this.horizontal;
			const v = this.vertical;
			const a = {
				width:     `${Math.abs(this.width)}px`,
				maxHeight: `${Math.abs(this.height)}px`
			};
			a[h < 0 ? "left" : "right"]  = `${Math.abs(h)}px`;
			a[v < 0 ? "top"  : "bottom"] = `${Math.abs(v)}px`;
			__HTML(this.box, {style: a});
			return;
		}
	}
});