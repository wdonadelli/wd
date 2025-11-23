/**
#3 Árvore de Dados
O constructor '{__Tree()} efetua manipulação de regras com aberturas e fechamentos de níveis para fins de construção guiada de código XML.
**/
function __Tree() {
	if (!(this instanceof __Tree)) return new __Tree();
	Object.defineProperties(this, {
		_tree:    {value: []},
		_data:    {value: []},
		_pattern: {writable: true, value: "?"},
		_save:    {writable: true, value: []},
		_xml:     {writable: true, value: false}
	});
}

Object.defineProperties(__Tree.prototype, {
	constructor: {value: __Tree},
	/**. '{string char(string x)}: Retorna o argumento adaptado para exibição HTML.**/
	char: {
		value: function(x) {
			if (x === undefined || x === null) return "";
			const chars = String(x).split("");
			const html  = [{a: "&",  b: "&amp;"}, {a: "<",  b: "&lt;"},  {a: ">", b: "&gt;"}];
			if (!this.xml)
				html.push({a: "\n", b: "<br/>"}, {a: "\t", b: "&Tab;"}, {a: " ", b: "&nbsp;"});
			chars.forEach(function(v,i,a) {
				for (let h of html)
					if (v === h.a) a[i] = h.b;
			});
			return chars.join("");
		}
	},
	/**. '{boolean xml}: Define se a estrutura da árvore se destina à marcação XML.**/
	xml: {
		get: function()  {return this._xml === true;},
		set: function(x) {this._xml = x === true;}
	},
	/**. '{string level}: Retorna o nome do último nível informado ou nulo se vazio.**/
	level: {
		get: function() {
			if (this._tree.length === 0) return null;
			return this._tree[this._tree.length - 1];
		}
	},
	/**. '{string pattern(string model)}: Define e retorna um modelo padrão de i{tag} a ser elaborada a partir do nome do nível. O nome do nível será inserido no modelo a partir da substituição do caracteres de interrogação. Por exemplo, se definido o modelo "span-?" e nível "line", a i{tag} de abertura será i{<span-line>}. O valor padrão é "?", obtido quando se define o argumento como string vazia ou nulo. Se o argumento for indefinido, retorna o valor.**/
	pattern: {
		value: function(model) {
			if (model === undefined) return this._pattern;
			const pattern = model === null ? "?" : String(model).replace(/\s+/g, "").trim();
			this._pattern = pattern.length === 0 ? "?" : pattern;
			return this._pattern;
		}
	},
	/**. '{self add(string chars)}: Adiciona caracteres à arvore.**/
	add: {
		value: function(chars) {
			this._data.push(this.char(chars));
			return this;
		}
	},
	/**. '{self open(string name)}: Abre novo nível nomeado conforme argumento '{name}. O argumento é a tag do elemento seguido, se houver, dos atributos a serem aplicados.**/
	open: {
		value: function(name) {
			const data = String(name).replace(/\s+/g, " ").trim().split(" ");
			const tag  = data[0];
			const attr = data.slice(1).join(" ");
			const elem = this.pattern().replace(/\?+/g, tag);
			this._tree.push(tag);
			this._data.push(attr === "" ? `<${elem}>` : `<${elem} ${attr}>`);
			return this;
		}
	},
	/**. '{self close()}: Fecha o último nível aberto.**/
	close: {
		value: function() {
			const elem = this.pattern().replace(/\?+/g, this.level);
			this._data.push("</"+elem+">");
			this._tree.pop();
			return this;
		}
	},
	/**. '{self append(string name, string chars)}: Aplica o método '{open} e '{close} em sequência inserido o conteúdo de '{chars}.**/
	append: {
		value: function(name, chars) {
			return this.open(name).add(chars).close();
		}
	},
	/**. '{self finish()}: Fecha todos os níveis abertos.**/
	finish: {
		value: function() {
			while (this.level !== null) this.close();
			return this;
		}
	},
	/**. '{self walkTo(integer level)}: Fechar todos os níveis até o nível informado em i{level}, salvando o caminho para restauração através do método i{backTo}.**/
	walkTo: {
		value: function(level) {
			const check = __Type(level);
			if (check.integer && !check.negative && check.value < this._tree.length) {
				this._save = this._tree.slice();
				while (this._tree.length > check.value) this.close();
			}
			return this;
		}
	},
	/**. '{self backTo()}: Reabre os caminhos fechados em i{walkTo}.**/
	backTo: {
		value: function() {
			if (this._tree.length < this._save.length) {
				for (let i = this._tree.length; i < this._save.length; i++)
					this.open(this._save[i], "");
				this._save = [];
			}
			return this;
		}
	},
	/**. '{string toString()}: Retorna o conteúdo textual da árvore.**/
	toString: {
		value: function() {
			return __HTML("pre", {innerHTML: this._data.join("")}).innerText;
		}
	},
	/**. '{string valueOf()}: Retorna a estrutura (HTML) da árvore.**/
	valueOf: {value: function() {return this._data.join("");}}
});