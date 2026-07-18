/**#4 WDtime
	Construtor para manipulação de tempo (ver '{WDmain})**/
function WDtime(input, data) {
	WDmain.call(this, input, data);
	Object.defineProperties(this, {});
}
WDtime.prototype = Object.create(WDmain.prototype, {
	constructor: {value: WDtime},
	/**. '{integer hour}: Retorna o valor da hora.**/
	hour: {get: function() {return this._data._data.H;}},
	/**. '{integer minute}: Retorna o valor do minuto.**/
	minute: {get: function()  {return this._data._data.m;}},
	/**. '{integer second}: Retorna o valor do segundo.**/
	second: {get: function()  {return this._data._data.s;}},
	/**. '{integer millisecond}: Retorna o valor do milissegundo.**/
	millisecond: {get: function()  {return this._data._data.l;}},
	/**. '{string delta(string walk)}: Desloca o tempo e retorna o tempo deslocado.**/
	delta: {value: function(walk) {
		return __DATETIME.delta(this._data._data, walk).string;
	}},
	/**. '{string toLocaleString(object opt)}: Retorna o valor local do tempo.**/
	toLocaleString: {value: function(opt) {
		return __DATETIME.locale(this._data._data, opt);
	}},
});