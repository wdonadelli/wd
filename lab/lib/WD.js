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
	now: {get: function() {return WD(new Date().toISOString().split("T")[1].replace(/[^0-9:.]/g, ""));}},
	/**. '{object today}: Retorna a instância do objeto do tipo data com o valor atual.**/
	today: {get: function() {return WD(new Date().toISOString().split("T")[0]);}},
	/**. '{string lang}: Define ou retorna a linguagem em ordem de preferência da biblioteca.**/
	lang: {
		get: function()  {return __LANG.user;},
		set: function(x) {__LANG.user = x;}
	},
	/**. '{object $(string css, node root)}: Define o nó HTML especificado pelo seletor i{css} como argumento de '{WD}. O valor padrão de i{root} é '{document}.**/
	$: {
		value: function(css, root) {
			root = root instanceof HTMLElement ? root : document;
			try      {return WD(document.querySelector(css, root));}
			catch(e) {return WD(document.querySelectorAll("#_._", root));}
		}
	},
	/**. '{object $$(string css, node root)}: Define a lista de nós HTML especificado pelo seletor i{css} como argumento de '{WD}. O valor padrão de i{root} é '{document}.**/
	$$: {
		value: function(css, root) {
			root = root instanceof HTMLElement ? root : document;
			try      {return WD(document.querySelectorAll(css, root));}
			catch(e) {return WD(document.querySelectorAll("#_._", root));}
		}
	},
	/**. '{void attach(string name, any data)}: Vincula os valores dos atributos HTML da biblioteca a um id (ver '{WDDATASET}).**/
	attach: {
		value: function(name, data) {WDDATASET.attach(name, data);},
	},






	/**. '{object matrix(any input)}: Retorna um objeto do tipo matriz conforme '{input} (table, array, csv)**/
	matrix:  {value: function(input) {return new WDmatrix(input);}},
	copy: {value: function(text)  {return wd_copy(text);}}, //FIXME como fica copy?
});