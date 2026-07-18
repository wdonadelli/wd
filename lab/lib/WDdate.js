/**#4 WDdate
Construtor para manipulação de data (ver '{WDmain})**/
function WDdate(input, data) {
	WDmain.call(this, input, data);
	Object.defineProperties(this, {});
}
WDdate.prototype = Object.create(WDmain.prototype, {
	constructor: {value: WDdate},
	/**. '{integer year}: Retorna o valor do ano.**/
	year: {get: function() {return this._data._data.Y;}},
	/**. '{integer month}: Retorna o valor do mês.**/
	month: {get: function() {return this._data._data.M;}},
	/**. '{integer day}: Retorna o valor do dia.**/
	day: {get: function() {return this._data._data.D;}},
	/**. '{integer weekDay}: Retorna o valor do dia da semana.**/
	weekDay: {get: function() {return this._data._data.d;}},
	/**. '{boolean leap}: Retorna se o ano é bissexto.**/
	leap: {get: function() {return __DATETIME.leap(this.year);}},
	/**. '{integer workDays(string date)}: Retorna a quantidade de dias úteis desde 2 de janeiro ou entre as datas, '{date} corresponder a uma data.**/
	workDays: {value: function(date) {
		const data = WD(date);
		if (data.type === "date" || data.type === "datetime")
			return __DATETIME.workDays(this.toString(), data.toString());
		return __DATETIME.workDaysYear(this.year, this.month, this.day);
	}},
	/**. '{string delta(string walk)}: Desloca o tempo e retorna o tempo deslocado.**/
	delta: {value: function(walk) {
		return __DATETIME.delta(this._data._data, walk).string;
	}},
	/**. '{string toLocaleString(object opt)}: Retorna o valor local do tempo.**/
	toLocaleString: {value: function(opt) {
		return __DATETIME.locale(this._data._data, opt);
	}},
	/**. '{string toISOWeekString()}: Retorna a semana do ano no padrão ISO.**/
	toISOWeekString: {value: function() {
		return __DATETIME.weekDate(this.year, this.month, this.day);
	}},
});