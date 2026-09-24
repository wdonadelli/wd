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
		const data = {value: value, type: "number", string: value.toString(), locale: this.locale(value)};
		if (Math.abs(value) === Infinity)
			data.string = (value < 0 ? "-" : "+") + "∞";
		else if (isNaN(value))
			data.type = "nan";
		return data;
	},

	//string locale(number value, string type, string data, object extra)

	/**. '{string locale(number value, object opt)}: Retorna o número ('{value}) no a{formato local}@href{https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat}target{_blank} conforme especificado em '{opt}:
	|Nome|Tipo|Descrição|Valores|Padrão|
	|'{type}|string|Tipo do formato|Ver abaixo|'{decimal}|
	|'{data}|string|Especificação do formato|Depende do tipo do formato||
	|'{sign}|string|Exibição do sinal|'{auto}, '{always}, '{exceptZero}, '{negative} ou '{never}||
	|'{group}|string ou boolean|Separadores de milhar|"'{auto}", "'{always}", "'{min2}", '{true} ou '{false}||
	|'{minDigits}|integer|Quantidade mínima de dígitos significantes|De 1 a 22||
	|'{maxDigits}|integer|Quantidade máxima de dígitos significantes|De 1 a 22||
	|'{integer}|integer|Quantidade mínima de dígitos inteiros|De 1 a 22||
	|'{minDecimal}|integer|Quantidade mínima de dígitos decimais|De 0 a 21||
	|'{maxDecimal}|integer|Quantidade máxima de dígitos decimais|De 0 a 21||
	. Tipos e suas especificações:
	|Tipo|Descrição|Especificação|
	|'{currency}|Formato monetário|a{Código monetário}@href{https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=currency-codes}target{_blank}|
	|'{currencyNarrow}|Formato monetário com símbolo estreito|Ver '{currency}|
	|'{currencyName}|Formato monetário em texto|Ver '{currency}|
	|'{currencyCode}|Formato monetário com código monetário|Ver '{currency}|
	|'{unit}|Unidade de medida|a{Nome da unidade de medida}@href{https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier}target{_blank}|
	|'{unitLong}|Unidade de medida longa|Ver '{unit}|
	|'{unitNarrow}|Unidade de medida estreita|Ver '{unit}|
	|'{compact}|Valor textual compacto|Expressão longa ('{long}) ou curta ('{short})|
	|'{decimal}|Valor decimal|Formato do valor: '{percent}, '{scientific}, '{engineering}, '{short} ou '{compact}|
	**/
	//function(value, type, data, extra)
	locale: function(value, opt) {
		opt = typeof opt === "object" && opt !== null && !Array.isArray(opt) ? opt : {};
		const base = {
			percent:     {style:    "percent"},
			scientific:  {notation: "scientific"},
			engineering: {notation: "engineering"},
			short:       {notation: "compact", compactDisplay: "short"},
			compact:     {notation: "compact", compactDisplay: "long"},
		};
		const types = {
			currency:       {style: "currency", currency: opt.data, currencyDisplay: "symbol"},
			currencyNarrow: {style: "currency", currency: opt.data, currencyDisplay: "narrowSymbol"},
			currencyName:   {style: "currency", currency: opt.data, currencyDisplay: "name"},
			currencyCode:   {style: "currency", currency: opt.data, currencyDisplay: "code"},
			unit:           {style: "unit",     unit:     opt.data, unitDisplay:     "short"},
			unitLong:       {style: "unit",     unit:     opt.data, unitDisplay:     "long"},
			unitNarrow:     {style: "unit",     unit:     opt.data, unitDisplay:     "narrow"},
			decimal:        opt.data in base ? base[opt.data] : {},
		};
		const conf = opt.type in types ? types[opt.type] : types.decimal;
		const list = new Uint8Array(22).map(function(v,i,a) {return i;});
		const extras = {
			sign:       {attr: "signDisplay",              values: ["auto", "always", "exceptZero", "negative", "never"]},
			group:      {attr: "useGrouping",              values: ["auto", "always", "min2", true, false]},
			minDigits:  {attr: "minimumSignificantDigits", values: list.slice(1,22)},
			maxDigits:  {attr: "maximumSignificantDigits", values: list.slice(1,22)},
			integer:    {attr: "minimumIntegerDigits",     values: list.slice(1,22)},
			minDecimal: {attr: "minimumFractionDigits",    values: list.slice(0,21)},
			maxDecimal: {attr: "maximumFractionDigits",    values: list.slice(0,21)},
		};
		/*-- capturando complementos --*/
		for (let i in extras) {
			if (i in opt && extras[i].values.indexOf(opt[i]) >= 0)
				conf[extras[i].attr] = opt[i];
		}
		return value.toLocaleString(__LANG.value, conf);
	},


};