/**
#3 Checagem de Tipos
O objeto '{__CHECK} estabelece as regras para identificação dos tipos básicos e seus valores.
**/
const __CHECK = {
	reEmail: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
	/**. '{array nodes(any list)}: Transforma uma lista de nós em array.**/
	nodes: function(list) {
		return Array.prototype.slice.call(list).filter(function(v,i,a) {return v.nodeType === 1;});
	},
	/**. '{object String(any input)}: Retorna os dados da String.**/
	String: function(input) {
		let data;
		/*-- checar se é número --*/
		data = __NUMBER.match(input);
		if (data !== null) return data;
		/*-- checar se é data ou tempo --*/
		data = __DATETIME.match(input);
		if (data !== null && ["date", "time", "datetime"].indexOf(data.type) >= 0) return data;
		/*-- retornar string --*/
		return {type: "string", value: input.valueOf(), string: input.toString()};
	},
	/**. '{object Number(any input)}: Retorna os dados do número.**/
	Number: function(input) {return __NUMBER.match(input);},
	/**. '{object Boolean(any input)}: Retorna os dados do boleano.**/
	Boolean: function(input) {return {type: "boolean",  value: input.valueOf(), string: input.toString()};},
	/**. '{object RegExp(any input)}: Retorna os dados da expressão regular.**/
	RegExp: function(input) {return {type: "regexp", value: input.valueOf(), string: input.source};},
	/**. '{object Date(any input)}: Retorna os dados do data/tempo.**/
	Date: function(input) {return __DATETIME.match(input);},
	/**. '{object Function(any input)}: Retorna os dados da função.**/
	Function: function(input) {return {type: "function", value: input.valueOf(), string: input.toString()};},
	/**. '{object HTMLElement(any input)}: Retorna os dados do nó HTML.**/
	HTMLElement: function(input) {return {type: "node", value: [input], string: input.toString()};},
	/**. '{object SVGElement(any input)}: Retorna os dados do nó SVG.**/
	SVGElement: function(input) {return {type: "node", value: [input], string: input.toString()};},
	/**. '{object MathMLElement(any input)}: Retorna os dados do nó MathML.**/
	MathMLElement: function(input) {return {type: "node", value: [input], string: input.toString()};},
	/**. '{object String(any input)}: Retorna os dados da lista dos nós.**/
	NodeList: function(input) {return {type: "node", value: this.nodes(input), string: input.toString()};},
	/**. '{object NodeList(any input)}: Retorna os dados da lista de nós.**/
	RadioNodeList: function(input) {return {type: "node", value: this.nodes(input), string: input.toString()};},
	/**. '{object HTMLCollection(any input)}: Retorna os dados da lista de nós.**/
	HTMLCollection: function(input) {return {type: "node", value: this.nodes(input), string: input.toString()};},
	/**. '{object HTMLAllCollection(any input)}: Retorna os dados da lista de nós.**/
	HTMLAllCollection: function(input) {return {type: "node", value: this.nodes(input), string: input.toString()};},
	/**. '{object HTMLOptionsCollection(any input)}: Retorna os dados da lista de nós.**/
	HTMLOptionsCollection: function(input) {return {type: "node", value: this.nodes(input), string: input.toString()};},
	/**. '{object HTMLFormControlsCollection(any input)}: Retorna os dados da lista de nós.**/
	HTMLFormControlsCollection: function(input) {return {type: "node", value: this.nodes(input), string: input.toString()};},
	/**. '{object match(object input)}: Testa o valor e retorna seus dados ('{type, value, string}).**/
	match: function(input) {
		const type = typeof input;
		/*-- não é objeto --*/
		if (type !== "object") {
			switch(type) {
				case "undefined": return {type: type, value: input, string: "?"};
				case "number":    return this.Number(input);
				case "string":    return this.String(input);
				case "regexp":    return this.RegExp(input);
				case "function":  return this.Function(input);
				case "boolean":   return this.Boolean(input);
			};
			return {type: type, value: input.valueOf(), string: input.toString()};
		};
		/*-- se for objeto --*/
		if (input === null)
			return {type: "null",  value: null, string: "0"};
		if (Array.isArray(input))
			return {type: "array", value: input.slice(), string: JSON.stringify(input)};
		/*-- instâncias conhecidas --*/
		for (let name in this) {
			if (name in window && input instanceof window[name])
			 return this[name](input);
		}
		/*-- objeto primitivo {} --*/
		const base = Object.prototype === Object.getPrototypeOf(input);
		return {type: "object", value: base ? Object.assign(input) : input, string: base ? JSON.stringify(input) : input.toString()};
	}
};
