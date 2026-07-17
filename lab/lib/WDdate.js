/**#4 WDdate
Construtor para manipulação de data (ver '{WDmain})**/
function WDdate(input, data) {
	WDmain.call(this, input, data);
	Object.defineProperties(this, {});
}
WDdate.prototype = Object.create(WDmain.prototype, {
	constructor: {value: WDdate},
	/**. '{integer year}: Retorna o valor do ano.**/
	year: {get: function()  {return this._data._data.Y;}},
	/**. '{integer month}: Retorna o valor do mês.**/
	month: {get: function()  {return this._data._data.M;}},
	/**. '{integer day}: Retorna o valor do dia.**/
	day: {get: function()  {return this._data._data.D;}},
	/**. '{integer weekDay}: Retorna o valor do dia da semana.**/
	weekDay: {get: function()  {return this._data._data.d;}},
	/**. '{integer workDays(string date)}: Retorna a quantidade de dias úteis desde 2 de janeiro ou entre as datas, '{date} corresponder a uma data.**/
	workDays: {value: function(date) {
		const data = WD(date);
		if (data.type === "date" || data.type === "datetime")
			return __DATETIME.workDays(this.toString(), data.toString());
		return __DATETIME.workDaysYear(this.year, this.month, this.day);
	}},
	/**. '{string delta(string walk)}: Desloca o tempo.**/
	delta: {value: function(walk) {
		return __DATETIME.delta(this._data._data, walk).string;
	}},
	/**. '{string toMonthString(boolean short)}: Retorna o nome do mês, longo ou curto.**/
	toMonthString: {value: function(short) {
		return this._data._data[short === true ? "MMM" : "MMMM"];
	}},
	/**. '{string toWeekDayString(boolean short)}: Retorna o nome do dia da semana, longo ou curto.**/
	toWeekDayString: {value: function(short) {
		return this._data._data[short === true ? "ddd" : "dddd"];
	}},
	/**. '{string toWeekString()}: Retorna a semana do ano no padrão ISO.**/
	toWeekString: {value: function() {
		return __DATETIME.weekDate(this.year, this.month, this.day);
	}},






	/**. '{integer week}: Retorna o número da semana.**/
	//week: {get: function()  {return this._main.main.week;}},
	/**. '{integer weekDay}: Retorna o número do dia da semana.**/
	//weekDay: {get: function()  {return this._main.main.weekDay;}},
	/**. '{boolean leap}: Informa se o ano é bissexto.**/
	//leap: {get: function()  {return this._main.main.leap;}},
	/**. '{integer width}: Retorna a quantidade de dias do mês.**/
	//width: {get: function()  {return this._main.main.width;}},
	/**. '{integer days}: Retorna o número do dia do ano.**/
	//days: {get: function()  {return this._main.main.days;}},
	/**. '{integer work}: Retorna o número de dias úteis até o momento.**/
	//work: {get: function()  {return this._main.main.work;}},
});