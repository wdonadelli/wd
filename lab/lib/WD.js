/**
#3 Função Mestre
	Função principal, única de acesso ao usuário, com o objetivo de evocar os construtores correspondentes ao tipo de dado.
	''object WD(any input)''
**/
function WD(input) {
	const data = new __Type(input);
	switch(data.type) {
		case "number":   return new WDnumber(input, data);
		case "array":    return new WDarray(input, data);
		case "date":     return new WDdate(input, data);
		case "time":     return new WDtime(input, data);
		case "boolean":  return new WDboolean(input, data);
		case "regexp":   return new WDregexp(input, data);
		case "datetime": return new WDdatetime(input, data);
		case "node":     return new WDnode(input, data);
		case "string":   return new WDstring(input, data);
		case "object":   return new WDobject(input, data);
	}
	return new WDmain(input, data);
}
/**#5 Métodos e Atributos Estáticos**/
WD.constructor = WD;
Object.defineProperties(WD, {
	/**. '{object info}: Retorna informações sobre a biblioteca.**/
	info: {value: Object.assign({}, __INFO)},
	/**. '{string device}: Retorna o tipo de tela de acordo com a biblioteca.**/
	device:  {get: function() {return __DEVICE.device;}},
	/**. '{object now}: Retorna a instância do objeto do tipo tempo com o valor atual.**/
	now: {get: function() {return WD(new __DateTime().toTimeString());}},
	/**. '{object today}: Retorna a instância do objeto do tipo data com o valor atual.**/
	today: {get: function() {return WD(new __DateTime().toDateString());}},
	/**. '{object already}: Retorna a instância do objeto do tipo data/tempo com o valor atual.**/
	already: {get: function() {return WD(__DateTime().toString());}},
	/**. '{string lang}: Define ou retorna a lista de linguagem em ordem de preferência da biblioteca.**/
	lang: {
		get: function()  {return __LANG.user;},
		set: function(x) {__LANG.user = x;}
	},
	/**. '{object $(string css, node root)}: Retorna um objeto do tipo nó conforme seletor i{css} individual. O argumento opcional i{root} é o elemento pai a ser consultado cujo valor padrão é i{document}.**/
	$: {value: function(css, root) {return WD(__Query(css, root).$);}},
	/**. '{object $$(string css, node root)}: Retorna um objeto do tipo nó conforme seletor i{css} múltiplo. O argumento opcional i{root} é o elemento pai a ser consultado cujo valor padrão é i{document}.**/
	$$: {value: function(css, root) {return WD(__Query(css, root).$$);}},
	/**. '{void signal(object options)}: Produz uma interação (ver i{__SIGNAL.signal}).**/
	signal:  {value: function(options) {return __SIGNAL.signal(options);}},
	/**. '{object matrix(any input)}: Retorna um objeto do tipo matriz conforme '{input} (table, array, csv)**/
	matrix:  {value: function(input) {return new WDmatrix(input);}},







	copy: {value: function(text)  {return wd_copy(text);}}, //FIXME como fica copy?






	/**. '{object datetime(any input)}: Retorna um objeto WD de data/tempo a partir dos valores:
	|input|Descrição|
	|Padrão|O valor atual de data/tempo|
	|Tempo|O tempo com data definida em 000-01-01|
	|Data|A data com tempo definido em 00:00:00|
	|Data/Tempo|Conforme definido|
	|Número|A quantidade de segundos desde 0000-01-01T00:00:00|
	|Semana|O primeiro dia da semana com tempo definido em 00:00:00|
	|Mês|Primeiro dia do mês com tempo definido em 00:00:00|
	|Objeto|As propriedades definidas alteram o valor atual da data/tempo|**/
	datetime: {value: function(input) {return WD(new __DateTime(input).toString());}},
});