/**
#3 Figuras
	O construtor '{__SVG} permite a criação de imagens SVG simples por meio de uma cadeia de métodos que atribuem valor ao elemento principal. Possui os seguintes argumento opcionais relacionados ao a{viewBox}[target="blank" href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox"]:
	|Argumento|Tipo|Padrão|Descrição|
	|width|number|100|Tamanho horizontal da imagem|
	|height|number|100|Tamanho vertical da imagem|
	|dx|number|0|Deslocamento horizontal|
	|dy|number|0|Deslocamento vertical|
**/
	function __SVG(width, height, dx, dy) {
		if (!(this instanceof __SVG)) return new __SVG(width, height, xmin, ymin);
		const svg  = this.create("svg");
		const main = [0, 0, 100, 100];
		const vbox = [dx, dy, width, height].map(function(v,i,a) {
			return isFinite(v) ? Number(v) : main[i];
		});
		svg.setAttribute("viewBox", vbox.join(" "));
		Object.defineProperties(this, {
			_svg:  {value: svg},
			_last: {value: svg, writable: true}
		});
	}
	Object.defineProperties(__SVG.prototype, {
		constructor: {value: __SVG},
		/**. '{node last}: Define ou retorna o último nó da cadeia adicionado ao SVG.**/
		last: {
			get: function()  {return this._last;},
			set: function(svg) {
				this._svg.appendChild(svg);
				this._last = svg;
			}
		},
		/**. '{node create(string tag)}: Retorna um novo elemento SVG do tipo informado em '{tag}.**/
		create: {value: function(tag) {
			return document.createElementNS("http://www.w3.org/2000/svg", tag);
		}},
		/**. '{self close()}: Clona o último nó da cadeia substituindo seu lugar.**/
		clone: {
			value: function() {
				this.last = this.last.cloneNode(true);
				return this;
			}
		},
		/**. '{number dx}: Retorna e define o valor de '{dx}.**/
		dx: {
			get: function()  {return this._svg.viewBox.baseVal.x;},
			set: function(v) {this._svg.viewBox.baseVal.x = isFinite(v) ? Number(v) : this.dx;}
		},
		/**. '{number dy}: Retorna e define o valor de '{dy}.**/
		dy: {
			get: function()  {return this._svg.viewBox.baseVal.y;},
			set: function(v) {this._svg.viewBox.baseVal.y = isFinite(v) ? Number(v) : this.dy;}
		},
		/**. '{number width}: Retorna e define o valor de '{width}.**/
		width: {
			get: function()  {return this._svg.viewBox.baseVal.width;},
			set: function(v) {this._svg.viewBox.baseVal.width = isFinite(v) ? Number(v) : this.width;}
		},
		/**. '{number height}: Retorna e define o valor de '{height}.**/
		height: {
			get: function()  {return this._svg.viewBox.baseVal.height;},
			set: function(v) {this._svg.viewBox.baseVal.height = isFinite(v) ? Number(v) : this.height;}
		},
		/**. '{self attribute(object attr)}: Define os atributos do último nó da cadeia.**/
		attribute: {
			value: function(attr) {
				for (let i in attr) this.last.setAttribute(i, attr[i]);
				return this;
			}
		},
		/**. '{self path(string path)}: Define um nó SVG a partir de uma sequência de comandos definido por '{path}.**/
		path: {
			value: function(path) {
				this.last = this.create("path");
				return this.attribute({d: path});
			}
		},
		/**. '{self title(string title)}: Define um título (dica) ao último nó da cadeia.**/
		title: {
			value: function(tip) {
				const svg = this.create("title");
				svg.textContent = tip;
				this.last.appendChild(svg);
				return this;
			}
		},
		/**. '{self line(array p1, array p2)}: Define uma linha ligando dois pontos das coordenadas '{p1} e '{p2} (x,y).**/
		line: {
			value: function(p1, p2) {
				this.last = this.create("line");
				return this.attribute({x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1]});
			}
		},
		/**. '{self lines(array x, array y, boolean close)}: Define diversos segmentos de reta a partir de um conjunto de coordenadas. Os argumentos '{x} e '{y} são as coordenadas (x,y) e o argumento '{close} define uma reta de retorno à origem.**/
		lines: {
			value: function(x, y, close) {
				const lines = x.map(function(v,i,a) {
					return `${i === 0 ? "M" : "L"} ${v} ${y[i]} `;
				});
				return this.path(lines.join("") + (close === true ? "Z" : ""));
			}
		},
		/**. '{self circle(number cx, number cy, number r)}: Define um círculo com centro em '{cx} e '{cy} e raio '{r}.**/
		circle: {
			value: function(cx, cy, r) {
				this.last = this.create("circle");
				return this.attribute({cx: cx, cy: cy, r: r});
			}
		},
		/**. '{self semicircle(number cx, number cy, number r, number start, number width)}: Define um semicírculo com centro em '{cx}, '{cy}, de raio '{r}, com ângulo iniciado em '{start} de tamanho '{width}.**/
		semicircle: {
			value: function(cx, cy, r, start, width) {
				if (Math.abs(width) >= 360) return this.circle(cx, cy, r);
				start  = 2*Math.PI*start/360;
				width  = 2*Math.PI*width/360;
				if (width < 0) {
					start += width;
					width  = Math.abs(width);
				}
				const x1 = cx + r*Math.cos(start);
				const y1 = cy - r*Math.sin(start);
				const x2 = cx + r*Math.cos(start + width);
				const y2 = cy - r*Math.sin(start + width);
				const lg = width > Math.PI ? 1 : 0;
				const  d = ["M", cx, cy, "L", x1, y1, "A", r, r, 0, lg, 0, x2, y2, "Z"];
				return this.path(d.join(" "));
			}
		},
		/**. '{self rect(number x, number y, number width, number height)}: Define um retângulo iniciado em '{x} e '{y} com comprimento '{width} e altura '{height}.**/
		rect: {
			value: function(x, y, width, height) {
				this.last = this.create("rect");
				return this.attribute({x: x, y: y, width: width, height: height});
			}
		},
		/**. '{self text(number x, number y, string|array text, string point)}: Define um SVG textual posicionado em '{x} e '{y}. O argumento '{text}, se lista, criará um elemento i{tspan} para cada item empilhados e, se texto, criará um elemento i{text}. O argumento '{point} define a posição (vertical/horizontal) e a âncora do texto. O primeiro caractere define a posição, i{v} para vertical e i{h} para horizontal e os demais definem a âncora conforme pontos cardeais: i{n, ne, e, se, s, sw, w, nw} e i{c} para o meio.**/
		text: {
			value: function(x, y, text, point) {
				/*-- definindo atributos do texto --*/
				const vanchor = ["start", "middle", "end"];
				const vbase   = ["auto", "middle", "hanging"];
				const anchor  = {n: 1, ne: 2, e: 2, se: 2, s: 1, sw: 0, w: 0, nw: 0, c: 1};
				const base    = {n: 2, ne: 2, e: 1, se: 0, s: 0, sw: 0, w: 1, nw: 2, c: 1};
				const attr    = {
					x: point[0] === "v" ? -y : x,
					y: point[0] === "v" ?  x : y,
					"text-anchor":       vanchor[anchor[point.substring(1)]],
					"dominant-baseline": vbase[base[point.substring(1)]],
					"transform":         point[0] === "v" ? "rotate(270)" : "",
				};
				this.last = this.create("text");
				this.last.style.whiteSpace = "break-spaces";
				this.attribute(attr);
				/*-- definindo texto em linha ou empilhado --*/
				if (!__Type(text).array) {
					const value = String(text);
					const tspan = this.create("tspan");
					tspan.textContent = value == "" ? " " : value;
					this.last.appendChild(tspan);
				} else {
					for (let i = 0; i < text.length; i++) {
						let style = {x: attr.x, dy: (i === 0 ? 0 : "1.5em")};
						let value = String(text[i]);
						let tspan = this.create("tspan");
						tspan.textContent = value === "" ? " " : value;
						for (let j in style) tspan.setAttribute(j, style[j]);
						this.last.appendChild(tspan);
					}
				}
				return this;
			}
		},
		/**. '{self ellipse(number cx, number cy, number rx, number ry)}: Define uma elípse.Os argumentos '{cx}, '{cy}, '{rx} e '{ry} definem o centro de referência em x e y e os raios de x e y, respectivamente.**/
		ellipse: {
			value: function(cx, cy, rx, ry) {
				this.last = this.create("ellipse");
				return this.attribute({cx: cx, cy: cy, rx: rx, ry: ry});
			}
		},
		/**. '{node svg(node append)}: Retorna o elemento SVG. O argumento opcional '{append} irá receber o elemento SVG.**/
		svg: {
			value: function(append) {
				if (__Type(append).node) append.appendChild(this._svg);
				return this._svg;
			}
		},
	});