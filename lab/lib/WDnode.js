/**#4 WDnode
	Construtor genérico para manipulação de nós HTML (ver '{WDmain}).**/
function WDnode(input, data) {
	WDmain.call(this, input, data);
	Object.defineProperties(this, {});
}
WDnode.prototype = Object.create(WDmain.prototype, {
	constructor: {value: WDnode},
	[Symbol.iterator]: {value: function*() {for (let i of this._input) yield i;}},
	/**. '{array valueOf()}: Retorna uma cópia da lista contendo os nós HTML.**/
	valueOf: {value: function() {return this._data.value.slice();}},
	/**. '{integer length}: Retorna a quantidade de nós HTML.**/
	length: {get: function() {return this._data.value.length;}},
	/**. '{self forEach(function callback, object self)}: Executa looping nos nós HTML. A função definida em '{callback} receberá como argumentos um nó, o seu índice e uma b{cópia} da lista de nós. Se a função retornar falso, o looping é interrompido.**/
	forEach: {
		value: function(callback, self) {
			if (typeof callback === "function") this.valueOf().forEach(callback, self);
			return this;
		}
	},
	/**. '{self set(object data)}: Atribui aos elementos o valor dos atributos especificados em '{data} (ver função __HTML).**/
	set: {
		value: function(data) {
			return this.forEach(function(v,i,a) {__HTML(v, data);});
		}
	},
	/**. '{self sort(integer order)}: Ordena os filhos dos nós conforme ordem especificada (ver '{__ARRAY}).**/
	sort: {
		value: function(order) {
			return this.forEach(function(v,i,a) {
				__ARRAY.sort(Array.from(v.children), order).forEach(function(x,y,z) {v.appendChild(x);});
			});
		}
	},
	/**. '{self repeat(array list, string model)}: Repete elementos a partir de um modelo (ver '{__LOADER.repeat}.**/
	repeat: {
		value: function(list, model) {
			return this.forEach(function(v,i,a) {__LOADER.repeat(v, list, model);});
		}
	},
	/**. '{self urlRepeat(object data, string model)}: Repete elementos a partir de um modelo via arquivo externo (ver '{__LOADER.urlRepeat}.**/
	urlRepeat: {
		value: function(data, model) {
			if (typeof model === "string") this.repeat([], model);
			return this.forEach(function(v,i,a) {__LOADER.urlRepeat(v, data);});
		}
	},
	/**. '{self urlHTML(object data, boolean outer)}: Carrega o conteúdo de um arquivo externo aos nós (ver '{__LOADER.urlHTML}.**/
	urlHTML: {
		value: function(data, outer) {
			return this.forEach(function(v,i,a) {__LOADER.urlHTML(v, data, outer);});
		}
	},








	//FIXME files para que serve isso mesmo?
	/**. '{array files}: Retorna uma lista com os arquivos selecionados nos campos de formulário.**/
	files: {
		get: function() {
			const pack = [];
			for (let i = 0; i < this._main.length; i++) {
				let obj = this._main[i];
				if (obj.ftype === "file")
					for (let j = 0; j < obj.node.files.length; j++)
						pack.push(obj.node.files[j]);
			}
			return pack;
		}
	},














	/**. '{object submit(string method, boolean ignore)}: Retornará o mesmo resultado que o método __DataSet.toSubmit, exceto se o processo for interrompido por alguma restrição no campo de formulário, retornando nulo. Para não verificar restrições, o argumento '{ignore} deverá ser verdadeiro.**/
	submit: {
		value: function(url, method, ignore) {
			ignore = ignore === true;
			const data = new __DataSet();

			for (let i = 0; i < this._main.length; i++) {
				let node   = this._main[i];
				let submit = node.fsubmit;
				if (submit !== null) {
					data.append(submit.name, submit.value);
					if (!ignore && submit.error) {
						node.falert(submit.message);
						node.node.focus();
						return null;
					}
				}
			}
			return data.toSubmit(url, method);
		}
	},


	/**. '{self display(string act)}: Exibe os elementos conforme especificado:
	|Ação|Descrição|
	|show|Exibe o elemento|
	|hide|Esconde o elemento|
	|toggle|Alterna a exibição do elemento|
	|full|Alterna a exibição do elemento em tela cheia|
	|alone|Exibe o elemento e esconde os nós irmãos|
	|missing|Esconde o elemento e exibe os nós irmãos|
	|all|Exibe o elemento e os nós irmãos|
	|none|Esconde o elemento e os nós irmãos|
	|asc|Ordena os nós filhos em ordem ascendente|
	|desc|Ordena os nós filhos em ordem descendente|
	|sort|Alterna a ordenação dos nós filhos|**/
	display: {
		value: function(act) {
			act = String(act).toLowerCase();
			for (let i = 0; i < this._main.length; i++) {
				if (act === "show" || act === "hide" || act === "toggle")
					this._main[i].show = act === "toggle" ? !this._main[i].show : act === "show";
				else if (act === "alone" || act === "missing")
					this._main[i].only(act === "missing");
				else if (act === "all" || act === "none")
					this.display(act === "all" ? "missing" : "alone").display(act === "all" ? "show" : "hide");
				else if (act === "sort" || act === "asc" || act === "desc")
					this._main[i].sort(act === "sort" ? null : act === "asc");
				else if (act === "full") {
					this._main[i].show = true;
					this._main[i].full();
				}
			}
			return this;
		}
	},
	/**. '{self slice(integer init, integer last)}: Fatia os elementos filhos Exibe os elementos, exceto se '{visible} for falso.**/
	slice: {
		value: function(init, last) {
			for (let i = 0; i < this._main.length; i++)
				this._main[i].slice(init, last);
			return this;
		}
	},







	/**. '{self display(string action)}: Organiza a exibição dos elementos filhos conforme argumento '{action}. Quanto ao elemento:
	|Ação|Descrição|
	. Quanto à organização dos filhos:
	|Valor|Descrição|
	|+N|exibe o filho avançando N posições do elemento atual (ciclo infinito)|
	|-N|exibe o filho retrocedendo N posições do elemento atual (ciclo infinito)|
	|N-M|intervalo de filhos a exibir, índices inicial e final|
	|N:D|organiza os filhos por grupos de D elementos, onde N representa o índice do grupo|
	|+N:D|avança N grupos de filhos organizados em grupos de D elementos|
	|-N:D|retrocede N grupos de filhos organizados em grupos de D elementos|
	. Quanto aos netos:
	|Valor|Descrição|
	|[+N&verbar;-M&verbar;...]|ordena os filhos com base no valor dos netos na ordem especificada e conforme sinais (positivos ascendentes, negativos descendentes).|
	. Onde N e M são números inteiros e D pode ser inteiro ou decimal. Para representar o último índice, utilizar o caractere asterisco.**/
	display2: {
		value: function(action) {
			action = String(action).replace(/\s+/g, "").toLowerCase();
			for (let i = 0; i < this._main.length; i++) {
				let node = this._main[i];
				/*-- avanço/retrocesso de filhos --*/
				if ((/^[+-]?\d+$/).test(action)) {
					node.walk(action);
				}
				/*-- intervalo de filhos --*/
				else if ((/^(\+?\d+|\*)\-(\+?\d+|\*)$/).test(action)) {
					const val = action.split("-");
					node.slice(val[0] === "*" ? -1 : val[0], val[1] === "*" ? -1 : val[1]);
				}
				/*-- agrupamento de nós --*/
				else if ((/^([+-]?\d+|\*)\:(\d+|0?\.\d+)$/).test(action)) {
					const val   = action.split(":");
					const walk  = (/^[+-]\d+/).test(action);
					const index = Number(val[0] === "*" ? -1 : val[0]) * (walk ? Infinity : 1);
					const width = Number(val[1]);
					node.pages(index, width);
				}
				/*-- ordenamento de colunas --*/
				else if ((/^\[[+-]?\d+((\|[+-]?\d+)+)?\]$/).test(action)) {
					const val = action.replace(/^\[(.+)\]$/, "$1").split("|");
					for (let j = 0; j < val.length; j++)
						val[j]  = (val[j][0] === "-" ? -1 : +1) + Number(val[j]);
					node.tsort.apply(node, val);
				}

			}
			return this;
		}
	},




	/**. '{self filter(any search, integer width)}: Exibe somente os elementos filhos que contenham o conteúdo de '{search} (ver __Node.filter)**/
	filter: {
		value: function(search, width) {
			for (let i = 0; i < this._main.length; i++)
				this._main[i].filter(search, width);
			return this;
		}
	},
	/**. '{self jump(node spaces)}: Alterna a posição dos nós entre os elementos informados em '{spaces} (ver __Node.jump)**/
	jump: {
		value: function(spaces) {
			if (__Type(spaces).node)
				for (let i = 0; i < this._main.length; i++)
					this._main[i].jump(spaces);
			return this;
		}
	},
});