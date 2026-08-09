/**#4 WDarray
	Construtor genérico para manipulação de listas (ver '{WDmain}).**/
function WDarray(input, data) {
	WDmain.call(this, input, data);
	Object.defineProperties(this, {});
}
WDarray.prototype = Object.create(WDmain.prototype, {
	constructor: {value: WDarray},
	[Symbol.iterator]: {value: function*() {for (let i of this._input) yield i;}},
	/**. '{integer length}: Retorna a quantidade de itens no array.**/
	length: {get: function() {return this._input.length;}},
	/**. '{array unique}: Retorna a lista sem valores repetidos.**/
	unique: {get: function() {return __ARRAY.unique(this._input);}},
	/**. '{array clear}: Retorna a lista ordenada de forma ascendente sem repetições.**/
	clear: {get: function() {return __ARRAY.clean(this._input);}},
	/**. '{array sort(integer order)}: Retorna a lista ordenada conforme especificado (ver '{__ARRAY}).**/
	sort: {value: function(order) {return __ARRAY.sort(this._input, order);}},
	/**. '{any item(integer index)}: Retorna o item da lista contido em '{index} de forma rotativa.**/
	item: {value: function(index) {return __ARRAY.item(this._input, index);}},
	/**. '{any finite(string type)}: Isola o conjunto de números finitos e retorna alguma informação (ver '{__ARRAY}).**/
	finite: {value: function(type) {return __ARRAY.finite(this._input, type);}},
	/**. '{array search(any value)}: Retorna uma lista com os índices em que o argumento '{value} aparece.**/
	search: {value: function(value) {return __ARRAY.search(this._input, value);}},
	/**. '{boolean check(any ...)}: Retorna verdadeiro se todos os argumentos informados forem localizados.**/
	check: {value: function() {return __ARRAY.check.apply(null, [this._input].concat(Array.from(arguments)));}},
});