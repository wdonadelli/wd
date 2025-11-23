/**
#3 Gestão de Identificadores
O objeto `{__ID} faz a gestão e gera identificadores para a biblioteca.
**/
const __ID = {
	/**. '{integer init}: Controla a unicidade na geração de identificadores.**/
	init: Date.now(),
	/**. '{integer shift}: Define o incremento a cada geração de um novo identificador.**/
	get shift() {
		const list = new Uint16Array(1);
		window.crypto.getRandomValues(list);
		return list[0];
	},
	/**. '{string value}: Retorna um novo identificador único.**/
	get value() {
		this.init += this.shift;
		const id   = `id${this.init.toString(16)}`;
		const find = document.getElementById(id);
		return find === null ? id : this.value;
	},
	/**. '{string id(node node)}: Retorna o valor da propriedade '{id} do nó, definindo-o se inexistente.**/
	id: function(node) {
		node.id = node.id.trim() === "" ? this.value : node.id;
		return node.id;
	},
};