/**#4 WDdatetime
	Construtor para manipulação de data/tempo (ver '{WDmain}, '{WDtime} e '{WDdate}**/
function WDdatetime(input, data) {
	WDmain.call(this, input, data);
	Object.defineProperties(this, {});
}
WDdatetime.prototype = Object.create(WDmain.prototype, {
	constructor: {value: WDdatetime},
	/**. '{integer valueOfDate()}: Retorna o número de dias desde 0000-01-01.**/
	valueOfDate: {value: function() {return __DATETIME.match(this.toString().split("T")[0]).value;}},
	/**. '{number valueOfTime()}: Retorna os segundos desde 00:00:00.000.**/
	valueOfTime: {value: function() {return __DATETIME.match(this.toString().split("T")[1]).value;}},
	/**. '{string toDateString()}: Retorna a data no formato YYYY-MM-DD.**/
	toDateString: {value: function() {return __DATETIME.match(this.toString().split("T")[0]).string;}},
	/**. '{string toTimeString()}: Retorna o tempo no formato hh:mm:ss.sss.**/
	toTimeString: {value: function() {return __DATETIME.match(this.toString().split("T")[1]).string;}},
	/**. '{string toLocaleDateString()}: Retorna a data no formato local.**/
	toLocaleDateString: {value: function() {return __DATETIME.match(this.toString().split("T")[0]).locale;}},
	/**. '{string toLocaleTimeString()}: Retorna o tempo no formato local.**/
	toLocaleTimeString: {value: function() {return __DATETIME.match(this.toString().split("T")[1]).locale;}},
});
/*-- copiando propriedades de WDtime e WDdate para WDdatetime ----------------*/
[WDtime.prototype, WDdate.prototype].forEach(
	function(prototype,p,pList) {
		Object.getOwnPropertyNames(prototype).forEach(
			function(name,n,nlist) {
				if (!(name in WDdatetime.prototype)) {
					const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
					Object.defineProperty(WDdatetime.prototype, name, descriptor);
				}
			}
		);
	}
);