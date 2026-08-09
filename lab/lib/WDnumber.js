/**#4 WDnumber
	Construtor genérico para manipulação de números (ver '{WDmain})**/
function WDnumber(input, data) {
	WDmain.call(this, input, data);
	Object.defineProperties(this, {});
}
WDnumber.prototype = Object.create(WDmain.prototype, {
	constructor: {value: WDnumber},
	/**. '{string format(string type, string data, object extra)}: ver método '{locale} de '{__NUMBER}).**/
	format: {value: function(type, data, extra) {return __NUMBER.locale(this._data.value, type, data, extra);}},
	/**. '{object split}: Ver o método de mesmo nome em '{__MATH}.**/
	split: {get: function(round) {return __MATH.split(this._input);}},
	/**. '{string bytes}: Ver o método de mesmo nome em '{__MATH}.**/
	bytes: {get: function() {return __MATH.bytes(this._input);}},
	/**. '{string mask(string model)}: Retorna o valor formatado pela máscara definida em '{model}.**/
	mask: {value: function(model) {return __STRING.mask(this._input, model);}},
	/**. '{Promise boolean prime}: Retorna uma promessa informando se o número é primo.**/
	prime: {get: async function() {return __MATH.isPrime(this._input);}},
	/**. '{Promise array primes}: Retorna uma promessa contendo a lista de primos divisores do número.**/
	primes: {get: async function() {return __MATH.getPrimes(this._input);}},
});