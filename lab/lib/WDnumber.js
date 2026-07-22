/**#4 WDnumber
	Construtor genérico para manipulação de números (ver '{WDmain})**/
function WDnumber(input, data) {
	WDmain.call(this, input, data);
	Object.defineProperties(this, {});
}
WDnumber.prototype = Object.create(WDmain.prototype, {
	constructor: {value: WDnumber},
	/**. '{string locale(string type, string data, object extra)}: Retorna o número no formato local conforme especificado.**/
	locale: {value: function(type, data, extra) {
		return __NUMBER.locale(this._data.value, type, data, extra);
	}},
	/**. '{string mask(string model)}: Retorna o valor formatado pela máscara definida em '{model}.**/
	mask: {value: function(model) {return __STRING.mask(this._input, model);}},
	/**. '{number dec(boolean round)}: Retorna a parte decimal do número com arredondamento de dízima precário se '{round} não é falso.**/
	dec: {value: function(round) {return __MATH.dec(this._input, round);}},



	//FIXME o que colocar aqui de MATH?


	/**. '{integer int}: Retorna a parte inteira.**/
	int: {get: function() {return this._main.int;}},
	/**. '{number dec}: Retorna a parte decimal.**/
	//dec: {get: function() {return this._main.dec;}},
	/**. '{number abs}: Retorna o valor absoluto.**/
	abs: {get: function() {return this._main.abs;}},
	/**. '{boolean prime}: Informa se o número é primo por meio de um Promise.**/
	prime: {get: async function() {return this._main.prime;}},
	/**. '{array primes}: Retorna uma lista de primos precedentes por meio de um Promise.**/
	primes: {get: async function() {return this._main.primes;}},
	/**. '{number factorization}: Retorna a fatorização do número por meio de um Promise.**/
	factorization: {get: async function() {return this._main.factorization;}},
	/**. '{number fixed(integer length, boolean round)}: Abrevia o número para as casas decimais (ver __Number).**/
	fixed: {value: function(lenght, round) {return this._main.fixed(lenght, round);}},
	/**. '{string fraction}: Retorna o número em forma de fração.**/
	fraction: {get: function() {return this._main.frac;}},
	/**. '{string bytes}: Retorna o número em quantidade de bytes.**/
	bytes: {get: function() {return this._main.bytes;}},



});