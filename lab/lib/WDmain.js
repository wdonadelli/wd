/**
#3 WDmain
	Construtor genérico para manipulação de dados cujos construtores específicos herdarão seu comportamento.
	''constructor object WDmain(any input, object data)''
	|Argumento|Descrição|
	|'{input}|Dado informado pelo usuário|
	|'{data}|Instância de '{__Type} alimentada pela função '{WD}|
	|""Tabela de argumento de '{WDmain}""|
**/
function WDmain(input, data) {
	Object.defineProperties(this, {
		_input: {value: input},
		_data:  {value: data},
	});
}
Object.defineProperties(WDmain.prototype, {
	constructor: {value: WDmain},
	/**. '{string type}: Retorna o tipo do dado.**/
	type: {get: function() {return this._data.type;}},
	/**. '{any valueOf()}: Retorna o valor do dado (ver '{__Type}).**/
	valueOf: {value: function() {return this._data.valueOf();}},
	/**. '{string toString()}: Retorna o valor textual do dado (ver '{__Type}).**/
	toString: {value: function() {return this._data.toString();}},
	/**. '{string toLocaleString()}: Retorna o valor textual local do dado (ver '{__Type}).**/
	toLocaleString: {value: function() {return this._data.toLocaleString();}},
	/**. '{boolean or(string type...)}: Retorna verdadeiro algum tipo informado em '{type} corresponder ao dado.**/
	or: {
		value: function(type) {
			for (let i = 0; i < arguments.length; i++)
				if (this._data[arguments[i]] === true) return true;
			return false;
		}
	},
	/**. '{boolean is(string type...)}: Retorna verdadeiro todos os tipos informados em '{type} corresponder ao dado.**/
	is: {
		value: function(type) {
			if (arguments.length < 2) return this.or(type);
			for (let i = 0; i < arguments.length; i++)
				if (this._data[arguments[i]] !== true) return false;
			return true;
		}
	},
	/**. '{boolean instanceOf(string name)}: Checa se o conteúdo é instância do objeto informado em '{name}.**/
	instanceOf: {value: function(name) {return this._data.instanceOf(name);}},
});