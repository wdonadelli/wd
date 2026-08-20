/**
#3 Registros de Manipuladores
	O objeto '{__HEAP} destina-se a registrar os elementos HTML contruídos pela biblioteca, garantindo que os tipos de construção não se confundam ao evitar que o mesmo elemento seja atribuído a mais de um construtor.**/
const __HEAP = {
	/**. '{object heap}: Registra o identificador, o objeto construtor e os respectivos dados.**/
	heap: {},
	/**. '{void attach(node node, any data, object source)}: Registra os dados e o construtor do elemento à pilha:
	|Argumento|Descrição|
	|'{node}|Elemento que recebeu a atribuição|
	|'{data}|Dados que serão utilizados para executar e desconstruir o elemento|
	|'{source}|Construtor do elemento u{contendo} os métodos '{attach} e '{detach}|
	|""Tabela de argumento da ferramenta __HEAP""|**/
	attach: function(node, data, source) {
		this.detach(node);
		this.heap[node.id] = {data: data, source: source};
		return;
	},
	/**. '{void detach(node node)}: Destroi o elemento construído.**/
	detach: function(node) {
		if (__ID.id(node) in this.heap) {
			this.heap[node.id].source.detach(node);
			delete this.heap[node.id];
		}
		return;
	},
	/**. '{any data(node node)}: Retorna os dados do elemento registrado ou nulo se não encontrado.**/
	data: function(node) {
		return node.id in this.heap ? this.heap[node.id].data : null;
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