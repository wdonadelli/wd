/**#4 WDregexp
	Construtor genérico para manipulação de expressão regular (ver '{WDmain}).**/
function WDregexp(input, data) {
	WDmain.call(this, input, data);
	Object.defineProperties(this, {});
}
WDregexp.prototype = Object.create(WDmain.prototype, {
	constructor: {value: WDregexp},
	///**. '{integer value}: Retorna 1 se verdadeiro e 0 se falso.**/
	//value: {get: function() {return __STRING.length(this._input);}},
});