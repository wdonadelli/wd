/**
#3 Checagem de Números
O objeto '{__NUMBER} faz checagens de elementos numéricos primitivos, de instâncias ou em forma de strings.
**/
const __NUMBER = {
	/**. '{object re}: Conjunto de expressões regulares para checagem de números em forma de strings.**/
	re: {
		finite:     /^[+-]?(?:\.?\d+|\d+\.\d+)(?:[Ee][+-]?\d+)?$/,
		percentage: /^[+-]?(?:\.?\d+|\d+\.\d+)(?:[Ee][+-]?\d+)?\%$/,
		factorial:  /^\+?\d+\!$/,
		infinite:   /^[+-]?\∞$/,
		bit:        /^[+-]?0[Bb][01]+$/,
		octal:      /^[+-]?0[Oo][1-7]+$/,
		hex:        /^[+-]?0[Xx][A-F0-9]+$/,
	},
	/**. '{number finite(string data)}: Retorna o valor numérico para modelo finito.**/
	finite: function(data) {return Number(data);},
	/**. '{number infinite(string data)}: Retorna o valor numérico para modelo infinito.**/
	infinite: function(data) {return data[0] === "-" ? -Infinity : Infinity;},
	/**. '{number percentage(string data)}: Retorna o valor numérico para modelo de porcentagem.**/
	percentage: function(data) {return this.finite(data.replace("%", ""))/100;},
	/**. '{number bit(string data)}: Retorna o valor numérico para modelo BIT.**/
	bit: function(data) {return parseInt(data.replace(/0[bB]/, ""), 2);},
	/**. '{number octal(string data)}: Retorna o valor numérico para modelo OCTAL.**/
	octal: function(data) {return parseInt(data.replace(/0[oO]/, ""), 8);},
	/**. '{number hex(string data)}: Retorna o valor numérico para modelo HEX.**/
	hex: function(data) {return parseInt(data.replace(/0[xX]/, ""), 16);},
	/**. '{number factorial(string data)}: Retorna o valor numérico para modelo de fatorial.**/
	factorial: function(data) {
		let i = this.finite(data.replace("!", ""));
		let v = i;
		while (--i > 1) v = i * v;
		return v;
	},
	/**. '{number match(string value)}: Retorna os dados (método '{data}) do número informado ou retorna nulo.**/
	match: function(value) {
		const type = typeof value;
		/*-- versão numérica --*/
		if (type === "number" || (type === "object" && value instanceof Number))
			return this.data(Number(value));
		/*-- versão em texto --*/
		if (type === "string" || (type === "object" && value instanceof String)) {
			const string = String(value).trim();
			for (let i in this.re)
				if (this.re[i].test(string))
					return this.data(this[i](string));
		}
		return null;
	},
	/**. '{object data(number value)}: Retorna os dados do valor informado ou nulo.**/
	data: function(value) {
		const data = {value: value, type: "number", string: value.toString()};
		if (Math.abs(value) === Infinity)
			data.string = (value < 0 ? "-" : "+") + "∞";
		else if (isNaN(value))
			data.type = "nan";
		return data;
	},
};