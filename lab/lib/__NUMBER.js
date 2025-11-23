/**
#3 String para Números
O objeto '{__NUMBER} estabelece as regras para extrair números a parit de string.
**/
const __NUMBER = {
	/**. '{object re}: Objeto contendo as expressões regulares dos números em formato string.**/
	re: {
		finite:    /^[+-]?(\.?\d+|\d+\.\d+)(e[+-]?\d+)?\%?$/i,
		factorial: /^\+?\d+\!$/,
		infinite:  /^[+-]?\∞$/,
	},
	/**. '{string search(string input)}: Retorna o tipo de número (nome) de acordo com a pripriedade '{re} ou nulo.**/
	search: function(input) {
		for (let i in this.re)
			if (this.re[i].test(input)) return i;
			return null;
	},
	/**. '{integer test(string input)}: Testa o valor de entrada e retorna seu valor ou nulo, se não enquadrado.**/
	test: function (input) {
		const type = this.search(input);
		if (type === "infinite")
			return input[0] === "-" ? -Infinity : Infinity;
		if (type === "finite")
			return Number(input.replace("%", ""))/(input.slice(-1) === "%" ? 100 : 1);
		if (type === "factorial") {
			let int = Number(input.replace("!", ""));
			let val = int;
			while (--int > 1) val = val * int;
			return val;
		}
		return null;
	}
};