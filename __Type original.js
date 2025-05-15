function __Type(input) {
		if (!(this instanceof __Type)) return new __Type(input);
		const find = __OBJECT.test(input);
		const data = {type: find.type, value: find.value};
		/*-- checando valores em string --*/
		if (find.type === "string") {
			let types    = ["date", "time", "datetime"];
			let datetime = __DATETIME.test(input);
			let number   = __NUMBER.test(input);
			if (datetime !== null && types.indexOf(datetime.type) >= 0)
				data = {type: datetime.type, value: datetime.iso};
			else if (number !== null)
				data = {type: "number", value: number};
		}
		console.log("-----", data);








		Object.defineProperties(this, {
			_input:    {value: input},                /* valor de referência */
			_type:     {value: null, writable: true}, /* tipo do valor de entrada */
			_value:    {value: null, writable: true}, /* valor a ser considerado */
			_toString: {value: null, writable: true}, /* referência para string */
			_valueOf:  {value: null, writable: true}, /* referência para valueOf */
			_test:     {value: __TYPE.test(input)},   /* testa o casamento de expressões regulares */
		});

		/* IMPORTANTE: o atributo string deve ser o último */
		const strings = ["number", "date", "time", "datetime", "string"];
		/* IMPORTANTE: object deve ser o último (qualquer um pode ser um objeto) */
		const objects = [
			"null", "undefined", "boolean", "number", "datetime",
			"array", "node", "regexp", "function", "object"
		];
		/*-- Checagem do tipo --*/
		const types = this.chars ? strings : objects;
		const group = this._test.group;
		if (types.indexOf(group) >= 0 && this[group]) return;
		/*-- Checando cada possibilidade --*/
		for (let i = 0; i < types.length; i++) {
			let value = types[i];
			if (value !== group && this[value]) return;
		}
		/*-- Não se encaixa em nada conhecido --*/
		this._value    = input;
		this._type     = "unknow";
		this._toString = String(input);
		this._valueOf  = Number(input);
	}

	Object.defineProperties(__Type.prototype, {
		constructor: {value: __Type},
		/**. '{boolean chars}: Checa se o valor é uma string.**/
		chars: {
			get: function() {
				return (typeof this._input === "string" || this.instanceOf("String"));
			}
		},
		/**. '{boolean empty}: Checa se o valor é uma string de caracteres não visualizáveis.**/
		empty: {
			get: function() {
				return (this.chars && this._input.trim().length === 0);
			}
		},
		/**. '{boolean nonempty}: Checa se o valor é uma string de caracteres visualizáveis.**/
		nonempty: {
			get: function() {
				return (this.chars && this._input.trim().length > 0);
			}
		},
		/**. '{boolean lang}: Checa se o valor é uma string no formato de linguagem.**/
		lang: {
			get: function() {
				return (this.chars && __LANG.re(this._input));
			}
		},
		/**. '{boolean string}: Checa se o valor é uma string diferente de número ou data/tempo.**/
		string: {
			get: function() {
				if (this.type !== null) return this.type === "string";
				if (!this.chars) return false;
				this._type     = "string";
				this._value    = String(this._input);
				this._valueOf  = this._value;
				this._toString = this._value;
				return true;
			}
		},
		/**. '{boolean number}: Checa se o valor é um número real, fatorial (string) ou percentual (string).**/
		number: {
			get: function() {
				if (this.type !== null) return this.type === "number";
				/*-- Número --*/
				if (typeof this._input === "number" || this.instanceOf("Number")) {
					if (isNaN(this._input)) return false;
					this._type     = "number";
					this._value    = this._input.valueOf();
					this._valueOf  = this._value;
					this._toString = isFinite(this._value) ? String(this._value) : (this._value < 0 ? "-∞" : "+∞");
					return true;
				}
				/*-- String --*/
				if (!this.chars || this._test.group !== "number") return false;
				let value = this._test.value;
				switch(this._test.subgroup) {
					case "factorial": {
						let mult = Number(value.replace("!", ""));
						value = 1;
						while (mult > 1) value = value * mult--;
						break;
					}
					case "percentage": {
						value = Number(value.replace("%", ""))/100;
						break;
					}
					case "infinite": {
						value = value[0] === "-" ? -Infinity : +Infinity
						break;
					}
					default: {
						value = Number(value);
					}
				}
				let check = __Type(value);
				if (!isNaN(value)) {
					this._type     = check._type;
					this._value    = check._value;
					this._valueOf  = check._valueOf;
					this._toString = check._toString;
					return true;
				}
				return false;
			}
		},
		/**. '{boolean finite}: Checa se o valor é um número finito.**/
		finite: {
			get: function() {
				return this.number && isFinite(this.value);
			}
		},
		/**. '{boolean infinite}: Checa se o valor é um número infinito.**/
		infinite: {
			get: function() {
				return this.number && !isFinite(this.value);
			}
		},
		/**. '{boolean integer}: Checa se o valor é um número real inteiro.**/
		integer: {
			get: function() {
				return this.finite && (this.value%1) === 0;
			}
		},
		/**. '{boolean real}: Checa se o valor é um número real não inteiro.**/
		decimal: {
			get: function() {
				return this.finite && (this.value%1) !== 0;
			}
		},
		/**. '{boolean positive}: Checa se o valor é um número positivo.**/
		positive: {
			get: function() {
				return this.number && this.value > 0;
			}
		},
		/**. '{boolean negative}: Checa se o valor é um número negativo.**/
		negative: {
			get: function() {
				return this.number && this.value < 0;
			}
		},
		/**. '{boolean zero}: Checa se o valor é zero.**/
		zero: {
			get: function() {
				return this.value === 0;
			}
		},
		/**. '{boolean boolean}: Checa se o valor é um valor booleano.**/
		boolean: {
			get: function() {
				if (this.type !== null) return this.type === "boolean";
				if (typeof this._input === "boolean" || this.instanceOf("Boolean")) {
					this._type     = "boolean";
					this._value    = this._input.valueOf();
					this._valueOf  = this._value === true ? 1 : 0;
					this._toString = this._value === true ? "true" : "false";
					return true;
				}
				return false;
			}
		},
		/**. '{boolean regexp}: Checa se o valor é uma expressão regular.**/
		regexp: {
			get: function() {
				if (this.type !== null) return this.type === "regexp";
				if (this.instanceOf("RegExp")) {
					this._type  = "regexp";
					this._value = this._input;
					this._valueOf  = this._value.valueOf();
					this._toString = this._value.source;
					return true;
				}
				return false;
			}
		},
		/**. '{boolean datetime}: Checa se o valor é um conjunto data/tempo. Enquadram-se nessa condição o construtor nativo '{Date} e strings em formato de data e tempo, nos termos da biblioteca, separados por espaço, virgula e espaço ou a letra T.**/
		datetime: {
			get: function() {
				if (this.type !== null) return this.type === "datetime";
				if (this.instanceOf("Date")) {
					const input = this._input;
					const data  = {
						D: input.getDate(),  M: input.getMonth()+1, Y: input.getFullYear(),
						h: input.getHours(), m: input.getMinutes(), s: input.getSeconds(),
						l: input.getMilliseconds()
					};
					let v, repeat, string;
					for (let i in data) {
						v = Math.abs(data[i]);
						if (i === "Y")
							repeat = (v < 10 ? 3 : (v < 100 ? 2 : (v < 1000 ? 1 : 0)));
						else if (i === "l")
							repeat = (v < 10 ? 2 : (v < 100 ? 1 : 0));
						else
							repeat = (v < 10 ? 1 : 0);
						string  = ("0").repeat(repeat) + String(v);
						data[i] = (data[i] < 0 ? "-" : "") + string;
					}
					const time = [data.h, data.m, data.s+"."+data.l].join(":");
					const date = [data.Y, data.M, data.D].join("-");
					this._type     = "datetime";
					this._value    = date+"T"+time;
					this._valueOf  = this._value;
					this._toString = this._value;
					return true;
				}
				/*-- Data/Tempo em formato de string --*/
				if (!this.chars) return false;
				let   dt = this._input.trim();
				const re = /(\d\d)(T|\,\ |\ )(\d?\d\:)/i;
				if (!re.test(dt)) return false;
				dt = dt.replace(re, "$1T$3").split("T");
				const date = __Type(dt[0]);
				const time = __Type(dt[1]);
				if (!date.date || !time.time) return false;
				this._type     = "datetime";
				this._value    = date.value+"T"+time.value;
				this._valueOf  = this._value;
				this._toString = this._value;
				return true;
			}
		},
		/**. '{boolean date}: Checa se o valor é uma data em formato de string.**/
		date: {
			get: function() {
				if (this.type !== null) return this.type === "date";
				if (!this.chars || this._test.group !== "date") return false;
				const type = {
					YYYYMMDD:  {y: "$1", m: "$2", d: "$3", MMMM: false},
					DDMMYYYY:  {y: "$3", m: "$2", d: "$1", MMMM: false},
					MMDDYYYY:  {y: "$3", m: "$1", d: "$2", MMMM: false},
					DMMMMYYYY: {y: "$3", m: "$2", d: "$1", MMMM: true},
					MMMMDYYYY: {y: "$3", m: "$1", d: "$2", MMMM: true}
				}
				if (!(this._test.subgroup in type)) return false;
				const cfg  = type[this._test.subgroup];
				const date = {
					y: this._test.value.replace(this._test.regexp, cfg.y),
					m: this._test.value.replace(this._test.regexp, cfg.m),
					d: this._test.value.replace(this._test.regexp, cfg.d)
				};
				/* caso o mês seja pelo nome, capturar índice do mês */
				if (cfg.MMMM) {
					const MMMM = __LANG.search("month", date.m);
					if (MMMM === null) return false;
					date.m = MMMM.index;
				}
				for (let i in date) date[i] = Number(date[i]);
				/* checando dados da data */
				const y    = date.y;
				const feb  = (y%400 === 0 || (y%4 === 0 && y%100 !== 0)) ? 29 : 28;
				const days = [0, 31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				if (date.d > days[date.m]) return false;
				/* acertando o formato */
				let v, repeat, string;
				for (let i in date) {
					v = Math.abs(date[i]);
					if (i === "y")
						repeat = (v < 10 ? 3 : (v < 100 ? 2 : (v < 1000 ? 1 : 0)));
					else
						repeat = (v < 10 ? 1 : 0);
					string  = ("0").repeat(repeat) + String(v);
					date[i] = (date[i] < 0 ? "-" : "") + string;
				}
				this._type     = "date";
				this._value    = [date.y, date.m, date.d].join("-");
				this._valueOf  = this._value;
				this._toString = this._value;
				return true;
			}
		},
		/**. '{boolean function}: Checa se o valor é uma função.**/
		function: {
			get: function() {
				if (this.type !== null) return this.type === "function";
				if (typeof this._input === "function" || this.instanceOf("Function")) {
					this._type     = "function";
					this._value    = this._input;
					this._valueOf  = "valueOf" in this._value ? this._value.valueOf() : this._value;
					this._toString = "toString" in this._value ? this._value.toString() : this._value;
					return true;
				}
				return false;
			}
		},
		/**. '{boolean array}: Checa se o valor é um array.**/
		array: {
			get: function() {
				if (this.type !== null) return this.type === "array";
				if (Array.isArray(this._input) || this.instanceOf("Array")) {
					this._type     = "array";
					this._value    = this._input;
					this._valueOf  = "valueOf" in this._value ? this._value.valueOf() : this._value;
					this._toString = JSON.stringify(this._value);
					return true;
				}
				return false;
			}
		},
		/**. '{boolean null}: Checa se o valor é nulo.**/
		null: {
			get: function () {
				if (this.type !== null) return this.type === "null";
				if (this._input === null) {
					this._type     = "null";
					this._value    = null;
					this._valueOf  = 0;
					this._toString = "";
					return true;
				}
				return false;
			}
		},
		/**. '{boolean undefined}: Checa se o valor é indefinido.**/
		undefined: {
			get: function() {
				if (this.type !== null) return this.type === "undefined";
				if (this._input === undefined || typeof this._input === "undefined") {
					this._type     = "undefined";
					this._value    = undefined;
					this._valueOf  = Infinity;
					this._toString = "?";
					return true;
				}
				return false;
			}
		},
		/**. '{boolean time}: Checa se o argumento é uma string que representa uma unidade de tempo.**/
		time: {
			get: function() {
				if (this.type !== null) return this.type === "time";
				if (!this.chars || this._test.group !== "time") return false;
				let value = this._test.value.replace(/[^0-9:.]/g, "");
				let data  = value.replace(".", ":").split(":");
				let time  = {
					h: Number(data[0]),
					m: Number(data[1]),
					s: data.length > 2 ? Number(data[2]) : 0,
					l: data.length > 3 ? 1000*Number("0."+data[3]) : 0
				};
				if (this._test.subgroup === "AM")
					time.h = time.h%12;
				else if (this._test.subgroup === "PM")
					time.h = time.h === 12 ? 12 : ((12 + time.h ) % 24);
				else
					time.h = time.h % 24;
				let v, repeat, string;
				for (let i in time) {
					v = time[i];
					if (i === "l")
						repeat = (v < 10 ? 2 : (v < 100 ? 1 : 0));
					else
						repeat = (v < 10 ? 1 : 0);
					string  = ("0").repeat(repeat) + String(v);
					time[i] = (time[i] < 0 ? "-" : "") + string;
				}
				this._type     = "time";
				this._value    = [time.h, time.m, time.s+"."+time.l].join(":");
				this._valueOf  = this._value;
				this._toString = this._value;
				return true;
			}
		},
		/**. '{boolean node}: Checa se o argumento é um elemento HTML ou uma coleção desses.**/
		node: {
			get: function() {
				if (this.type !== null) return this.type === "node";
				let   html = null;
				const node = this._input;
				const list = { /* 0: individual, 1: lista */
					HTMLElement: false,
					SVGElement: false,
					MathMLElement: false,
					NodeList: true,
					HTMLCollection: true,
					HTMLAllCollection: true,
					HTMLOptionsCollection: true,
					HTMLFormControlsCollection: true
				};
				for (let object in list) {
					if (this.instanceOf(object)) {
						html  = [];
						if (!list[object]) {
							html.push(node);
						} else {
							let i = -1;
							while (++i < node.length) html.push(node[i]);
						}
						break;
					}
				}
				if (html === null) return false;
				this._type     = "node";
				this._value    = html;
				this._valueOf  = this._value.slice();
				this._toString = this._value;
				return true;
			}
		},
		/**. '{boolean object}: Checa se o argumento é um objeto que não se enquadra nas demais categorias.**/
		object: {
			get: function() {
				if (this.type !== null) return this.type === "object";
				if (typeof this._input === "object") {
					this._type     = "object";
					this._value    = this._input;
					this._valueOf  = this._value;
					this._toString = this._value;
					return true;
				}
				return false;
			}
		},
		/**. '{string type}: Retorna o tipo do argumento verificado (number, date, time, datetime, string, null, undefined, boolean, array, node, regexp, function, object).**/
		type: {
			get: function() {return this._type;}
		},
		/**. '{any  value}: Retorna o valor do argumento de acordo com o atributo '{type}. Tipos de referência, primitivos e data/tempo retornam valores de referência, primitivos e strings, respectivamente.**/
		value: {
			get: function() {return this._value;}
		},
		/**. '{void  valueOf()}: Método padrão.**/
		valueOf: {
			value: function() {return this._valueOf;}
		},
		/**. '{string toString()}: Método padrão.**/
		toString: {
			value: function() {return this._toString;}
		},
		/**. '{boolean instanceOf(string name)}: Retorna se o valor informado é instância do objeto cujo __nome__ é informado no argumento '{name}.**/
		instanceOf: {
			value: function (name) {
				name = String(name).trim();
				if (name in window)
					return this._input instanceof window[name];
				return false;
			}
		}
	});
