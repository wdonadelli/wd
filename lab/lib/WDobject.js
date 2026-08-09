/**#4 WDobject
	Construtor para manipulação objetos e ferramentas (ver '{WDmain}).**/
function WDobject(input, data) {
	WDmain.call(this, input, data);
	Object.defineProperties(this, {});
}
WDobject.prototype = Object.create(WDmain.prototype, {
	constructor: {value: WDobject},
	/**. '{node plot(boolean ratio)}: Retorna um nó contendo gráfico cartesiano ou de proporção (ver '{__PLOT2D} e '{__PLOT2DRATIO}).**/
	plot: {value: function(ratio) {
		return (ratio === true ? __PLOT2DRATIO : __PLOT2D).plot(this.valueOf());
	}},
	/**. '{string request(boolean fetch)}: Efetua requisições ou leituras de arquivo e retorna seu identificador (ver '{__REQUEST}).**/
	request: {value: function(fetch) {
		return __REQUEST[fetch === true ? "fetch" : "make"](this.valueOf());
	}},
	/**. '{void signal(boolean notify)}: Efetua alertas, diálogos e notificações (ver '{__SIGNAL}).**/
	signal: {value: function(notify) {
		const data = this.valueOf();
		return __SIGNAL[notify === true ? "notify" : "alert"](data.head, data.body, data[notify === true ? "call" : "dialog"], data.call);
	}},


	convert: function(to) {



	},
});