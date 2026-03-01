/**
#3 Tipologia
O constructor '{__Type} tem o objetivo de definir o tipo do valor recebido como argumento (ver objeto '{__CHECK}).
**/
function __Type(input) {
	if (!(this instanceof __Type)) return new __Type(input);
	const data = __CHECK.match(input);
	Object.defineProperties(this, {
		_input: {value: input},
		_data:  {value: data},
	});
}

Object.defineProperties(__Type.prototype, {
	constructor: {value: __Type},
	/*-- Genéricos -------------------------------------------------------------*/
	/**. '{string type}: Retorna o tipo do argumento verificado.**/
	type: {get: function() {return this._data.type;}},
	/**. '{any  value}: Retorna o valor do argumento de acordo com o atributo '{type}.**/
	value: {get: function() {return "default" in this._data ? this._data.default : this._data.value;}},
	/**. '{void  valueOf()}: Método padrão.**/
	valueOf: {value: function() {return this._data.value;}},
	/**. '{string toString()}: Método padrão.**/
	toString: {value: function() {return this._data.string;}},
	/**. '{string toLocaleString()}: Método padrão.**/
	toLocaleString: {value: function() {return "locale" in this._data ? this._data.locale : this.toString();}},
	/*-- Strings -------------------------------------------------------------*/
	/**. '{boolean string}: Checa se o valor é uma string u{diferente de número, data ou tempo}.**/
	string: {get: function() {return this.type === "string";}},
	/**. '{boolean chars}: Checa se o valor é uma string.**/
	chars: {get: function() {return typeof this._input === "string";}},
	/**. '{boolean empty}: Checa se o valor é uma string de caracteres não visualizáveis.**/
	empty: {get: function() {return this.chars && this._input.trim().length === 0;}},
	/**. '{boolean nonempty}: Checa se o valor é uma string de caracteres visualizáveis.**/
	nonempty: {get: function() {return this.chars && !this.empty;}},
	/**. '{boolean lang}: Checa se o valor é uma string no formato de linguagem.**/
	lang: {get: function() {return this.chars && __LANG.re(this._input.trim());}},
	/**. '{boolean email}: Checa se o valor é uma string no formato de email.**/
	email: {get: function() {return this.chars && __CHECK.reEmail.test(this._input.trim());}},
	/*-- DateTime ------------------------------------------------------------*/
	/**. '{boolean datetime}: Checa se o valor é um conjunto data e tempo.**/
	datetime: {get: function() {return this.type === "datetime";}},
	/**. '{boolean date}: Checa se o valor é uma data em formato de string.**/
	date: {get: function() {return this.type === "date";}},
	/**. '{boolean time}: Checa se o argumento é uma string que representa uma unidade de tempo.**/
	time: {get: function() {return this.type === "time";}},
	/*-- Number ---------------------------------------------------------------*/
	/**. '{boolean number}: Checa se o valor é um número real, fatorial (string) ou percentual (string).**/
	number: {get: function() {return this.type === "number";}},
	/**. '{boolean finite}: Checa se o valor é um número finito.**/
	finite: {get: function() {return this.number && isFinite(this.value);}},
	/**. '{boolean infinite}: Checa se o valor é um número infinito.**/
	infinite: {get: function() {return this.number && !this.finite;}},
	/**. '{boolean integer}: Checa se o valor é um número real inteiro.**/
	integer: {get: function() {return this.finite && (this.value%1) === 0;}},
	/**. '{boolean real}: Checa se o valor é um número real não inteiro.**/
	decimal: {get: function() {return this.finite && (this.value%1) !== 0;}},
	/**. '{boolean positive}: Checa se o valor é um número positivo.**/
	positive: {get: function() {return this.number && this.value > 0;}},
	/**. '{boolean negative}: Checa se o valor é um número negativo.**/
	negative: {get: function() {return this.number && this.value < 0;}},
	/**. '{boolean zero}: Checa se o valor é zero.**/
	zero: {get: function() {return this.value === 0;}},
	/**. '{boolean NaN}: Checa se o valor é '{NaN}.**/
	NaN: {get: function() {return this.type === "nan";}},
	/*-- Diversos ------------------------------------------------------------*/
	/**. '{boolean boolean}: Checa se o valor é um valor booleano.**/
	boolean: {get: function() {return this.type === "boolean";}},
	/**. '{boolean regexp}: Checa se o valor é uma expressão regular.**/
	regexp: {get: function() {return this.type === "regexp";}},
	/**. '{boolean function}: Checa se o valor é uma função.**/
	function: {get: function() {return this.type === "function";}},
	/**. '{boolean array}: Checa se o valor é um array.**/
	array: {get: function() {return this.type === "array";}},
	/**. '{boolean node}: Checa se o argumento é um elemento HTML ou uma coleção desses.**/
	node: {get: function() {return this.type === "node";}},
	/**. '{boolean object}: Checa se o argumento é um objeto que não se enquadra nas demais categorias.**/
	object: {get: function() {return this.type === "object";}},
	/*-- Sem valores ---------------------------------------------------------*/
	/**. '{boolean null}: Checa se o valor é nulo.**/
	null: {get: function () {return this.type === "null";}},
	/**. '{boolean undefined}: Checa se o valor é indefinido.**/
	undefined: {get: function() {return this.type === "undefined";}},
	/*-- Checagens -----------------------------------------------------------*/
	/**. '{boolean instanceOf(string name)}: Retorna se o valor informado é instância do objeto nomeado em '{name}.**/
	instanceOf: {
		value: function (name) {
			const data = String(name).trim();
			const type = typeof this._input === "object";
			return type && data in window && this._input instanceof window[data];
		}
	}
});