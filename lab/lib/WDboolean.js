/**#4 WDboolean
	Construtor genérico para manipulação de boleanos (ver '{WDmain}).**/
function WDboolean(input, data) {
	WDmain.call(this, input, data);
	Object.defineProperties(this, {});
}
WDboolean.prototype = Object.create(WDmain.prototype, {
	constructor: {value: WDboolean},
	/**. '{integer value}: Retorna 1 se verdadeiro e 0 se falso.**/
	value: {get: function() {return this.valueOf() ? 1 : 0;}},
});