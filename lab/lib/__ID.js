/**
### Gestão de Identificadores

O objeto `__ID` tem o objetivo de efetuar a gestão de identificadores de elementos HTML.
**/
const __ID = {
	/**
	`integer init`
	: Faz a gestão Controlador dos identificadores.
**/
	init: Date.now(),
	/**. '{integer shift}: Define o incremento.**/
	get shift() {
		const list = new Uint16Array(1);
		window.crypto.getRandomValues(list);
		return list[0];
	},
	/**. '{string value}: Retorna um identificador.**/
	get value() {
		this.init += this.shift;
		const id   = `id${this.init.toString(16)}`;
		const find = document.getElementById(id);
		return find === null ? id : this.value;
	},
	/**. '{string id}: Define, se inexiste, e retorna o valor da propriedade '{id}.**/
	id: function(node) {
		node.id = node.id.trim() === "" ? this.value : node.id;
		return node.id;
	},
};