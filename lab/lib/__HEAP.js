/**
#3 Registros de Manipuladores
	O objeto '{__HEAP} destina-se a registrar os elementos HTML contruídos pela biblioteca, garantindo que os tipos de construção não se confundam ao evitar que o mesmo elemento seja atribuído a mais de um construtor.**/
const __HEAP = {
	/**. '{array heap}: Registra a vinculação de determinada ferramenta a um elemento:
	|Propriedade|Tipo|Descrição|
	|'{target}|'{node}|Elemento que recebeu o comportamento da ferramenta|
	|'{source}|'{object}|Objeto que controla a ferramenta atribuída ao elemento|
	|'{data}|'{any}|Dados inerentes à atribuição da ferramenta|**/
	heap: [],
	/**. '{object find(node|string node, object source)}: Retorna o primeiro item de '{heap} vinculado ao elemento '{node} e à ferramenta ('{source}), ou nulo se não encontrado. O atributo '{node} também pode referenciar o identificador ('{string}) do elemento.**/
	find: function(node, source) {
		for (let i = 0; i < this.heap.length; i++) {
			let heap = this.heap[i];
			if ((node === heap.target || node === heap.target.id) && source === heap.source)
				return heap;
		}
		return null;
	},
	/**. '{any data(node|string node, object source)}: Retorna os dados inerentes à atribuição da ferramenta, ou nulo se não encontrado**/
	data: function(node, source) {
		const find = this.find(node, source);
		return find ? find.data : null;
	},
	/**. '{void attach(node node, any data, object source)}: Registra os dados e o construtor do elemento à pilha:
	|Argumento|Descrição|
	|'{node}|Elemento que recebeu a atribuição|
	|'{data}|Dados que serão utilizados para executar e desconstruir o elemento|
	|'{source}|Construtor do elemento u{contendo} os métodos '{attach} e '{detach}|
	|""Tabela de argumento da ferramenta __HEAP""|**/
	attach: function(node, data, source) {
		this.detach(node, source);
		this.heap.push({target: node, source: source, data: data});
		return;
	},
	/**. '{void detach(node node, object source)}: Destroi o elemento construído.**/
	detach: function(node, source) {
		/*-- importante: o reverse é utilizado para desafixar do atual para a origem --*/
		this.heap = this.heap.reverse().filter(function(v,i,a) {
			const test = (v.target === node || v.target.id === node) && (source ? v.source === source : true);
			if (test) v.source.detach(v.target);
			return !test;
		}).reverse();
		return;
	},
	/**. '{void getAttr(node node, names...)}: Retorna um objeto contendo o nó e os valores dos atributos nomeados como argumentos.**/
	getAttr: function(node) {
		const data = {node: node, attr: {}};
		for (let i = 1; i < arguments.length; i++)
			data.attr[arguments[i]] = node.hasAttribute(arguments[i]) ? node.getAttribute(arguments[i]) : null;
		return data;
	},
	/**. '{void resetAttr(object data)}: Redefine os valores dos atributos obtidos pelo método '{getAttr}.**/
	resetAttr: function(data) {
		for (let name in data.attr)
			data.node[data.attr[name] === null ? "removeAttribute" : "setAttribute"](name, data.attr[name]);
		return;
	},
};