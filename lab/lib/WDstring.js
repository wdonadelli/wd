/**#4 WDstring
	Construtor genérico para manipulação de strings (ver '{WDmain}).**/
function WDstring(input, data) {
	WDmain.call(this, input, data);
	Object.defineProperties(this, {});
}
WDstring.prototype = Object.create(WDmain.prototype, {
	constructor: {value: WDstring},
	/**. '{integer length}: Retorna a quantidade de caracteres.**/
	length: {get: function() {return __STRING.length(this._input);}},
	/**. '{string clean}: Retorna a string sem acentos.**/
	clean: {get: function() {return __STRING.clean(this._input);}},
	/**. '{string fit}: Retorna a string sem caracteres de espaço repetidos.**/
	fit: {get: function() {return __STRING.fit(this._input);}},
	/**. '{string case(string type)}: Retorna o texto conforme caixa especificada.**/
	case: {value: function(type) {return __STRING.case(this._input, type);}},
	/**. '{boolean compare(string str)}: Retorna verdadeiro se as strings forem semelhantes.**/
	compare: {value: function(str) {return __STRING.compare(this._input, str);}},
	/**. '{string mask(string model)}: Retorna o valor formatado pela máscara definida em '{model}.**/
	mask: {value: function(model) {return __STRING.mask(this._input, model);}},
	//FIXME
	parse: {value: function(type) {return "";}},
});