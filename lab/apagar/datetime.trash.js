/**###### ``**constructor** ''object'' __DateTime(''any'' input)``
	Construtor para manipulação de data/tempo. O atributo ``input`` aceita valores do tipo:
	- Data, tempo ou data/tempo nos parâmetros da biblioteca;
	- Numérico correspondendo ao número de segundos desde 0000-01-01T00:00:00.0000 (segundo 0);
	- Objeto contendo a definição de data/tempo por meio de chaves (``year``,``month``, ``day``, ``hour``, ``minute``, ``second``) e seus respectivos valores; e
	- Caso contrário, assumirá o valor de data e tempo atuais.**/
	function __DateTime(input) {
		if (!(this instanceof __DateTime)) return new __DateTime(input);
		const check = __Type(input);
		const test  = check._test;
		let   group = check.type;
		let   value = __Type(new Date()).toString();
		if (check.time) {
			value = "0000-01-01T" + check.value;
		}
		else if (check.date) {
			value = check.value + "T00:00:00.000";
		}
		else if (check.datetime) {
			value = check.value;
		}
		else if (check.finite) {
			const dt  = new __DateTime("0000-01-01T00:00:00.000");
			dt.second = check.value;
			value     = dt.toString();
		}
		else if (check.object) {
			const keys = {year: 0, month: 1, day: 1, hour: 0, minute: 0, second: 0};
			const dt   = new __DateTime("0000-01-01T00:00:00.000");
			for (let i in keys) {
				let test = __Type(i in input ? input[i] : keys[i]);
				dt[i]    = test.finite ? test.value : keys[i];
			}
			value = dt.toString();
		}
		else if (test.group === "month") {
			const config = {
				MMYYYY:   {m: "$1", y: "$2"},
				YYYYMM:   {m: "$2", y: "$1"},
				MMMMYYYY: {m: "$1", y: "$2"}
			};
			const type = test.subgroup;
			let month  = test.value.replace(test.regexp, config[type].m);
			let year   = test.value.replace(test.regexp, config[type].y);
			if (type === "MMMMYYYY") {
				const search = __LANG.searchByName("months", month);
				month = search === null ? null : search.value;
			}
			if (month !== null) {
				const date = [year, month, "01"];
				value = date.join("-") + "T00:00:00.000";
				group = test.group;
			}
		}
		else if (test.group === "week") {
			const config = {
				WWYYYY:   {w: "$1", y: "$2"},
				YYYYWW:   {w: "$2", y: "$1"},
			};
			const type = test.subgroup;
			const week = Number(test.value.replace(test.regexp, config[type].w));
			const year = test.value.replace(test.regexp, config[type].y);
			const last = new __DateTime(year + "-12-31");
			if (week <= last.week) {
				const dt    = new __DateTime(year + "-01-01");
				dt.day     += 7 * (week - 1);
				const delta = dt.weekDay - 1;
				dt.day = (dt.day - delta) < 1 ? 1 : (dt.day - delta);
				value = dt.toString();
				group = test.group;
			}
		} else {
			group = "undefined";
		}
		const data = value.split("T");
		const date = data[0];
		const time = data[1];

		Object.defineProperties(this, {

			_Y: {value: Number(date.slice(0,-6)),  writable: true}, /* ano */
			_M: {value: Number(date.slice(-5,-3)), writable: true}, /* mês */
			_D: {value: Number(date.slice(-2)),    writable: true}, /* dia */
			_h: {value: Number(time.slice(0,2)),   writable: true}, /* hora */
			_m: {value: Number(time.slice(3,5)),   writable: true}, /* minutos */
			_s: {value: Number(time.slice(6)),     writable: true}, /* segundos */
			_group:  {value: group},                /* tipo de entrada */
			_change: {value: null, writable: true}, /* disparador do evento alteração */
			_print:  {value: null, writable: true}, /* retrato dos parâmetros */
			_field:  {value: null, writable: true}, /* parâmetro que chamou o disparador */
		});
	}

	Object.defineProperties(__DateTime.prototype, {
		constructor: {value: __DateTime},
		/**. ``''void'' _trigger(''string'' field)``: Método que aciona o disparador nas mudanças dos parâmetros de data e tempo. O atributo ``field`` identifica o parâmetro que solicita a demanda. O disparador receberá como argumento um __objeto__ com as seguintes chaves:
		.. ``''object'' target``: O objeto ``__DateTime``.
		.. ``''string'' field``: Nome do parâmetro alterado.
		.. ``''number'' old``: Valor anterior do campo.
		.. ``''number'' new``: Valor atual do campo.**/
		_trigger: {
			value: function (field) {
				if (this._change === null) {
					return;
				} else if (this._field === null) {
					this._print = {year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0};
					this._field = field;
					for (let i in this._print) this._print[i] = this[i];
				} else if (this._field === field) {
					for (let i in this._print)
						if (this._print[i] !== this[i]) this._change({
							target: this, field: i, old: this._print[i], new: this[i]
						});
					this._field = null;
					this._print = null;
				}
				return;
			}
		},
		/**. ``''boolean'' _leap(''integer'' y=year)``: Método que retorna se o ano é bissexto. O atributo ``y`` define o ano que, se indefinido, assumirá o ano registrado pelo objeto.**/
		_leap: {
			value: function(y) {
				y = Math.abs(y === undefined ? this.year : y);
				return (y%400 === 0 || (y%4 === 0 && y%100 !== 0));
			}
		},
		/**. ``''integer'' _maxDay(''integer'' m=month, ''integer'' y=year)``: Método que retorna a quantidade de dias do mês. Os atributos ``m`` e ``y`` correspondem ao mês e ao ano e que, se indefinidos, assumirão o mês o e ano registrados pelo objeto, respectivamente.**/
		_maxDay: {
			value: function(m, y) {
				if (m === undefined) m = this.month;
				if (y === undefined) y = this.year;
				const fev = this._leap(y) ? 29 : 28;
				const max = [31, fev, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				return max[m-1];
			}
		},
		/**. ``''integer'' _weekDay(''integer'' x=dateValueOf())``: Retorna o dia da semana (1-7), de domingo à sábado, tendo como referência o dia desde 0000-01-01. O atributo opcional ``x`` define o valor de referência do dia a ser analisado que, se indefinido, assumirá o valor do método ``dateValueOf``.**/
		_weekDay: {
			value: function(x) {
				/* dias positivos: +0000-01-01, dia 1, é sábado (7) (crescente) */
				/* dias negativos: -0001-12-31, dia 0, é sexta-feira (6) (decrescente) */
				if (x === undefined) x = this.dateValueOf();
				let wday = x > 0 ? [6, 7, 1, 2, 3, 4, 5] : [6, 5, 4, 3, 2, 1, 7];
				return wday[Math.abs(x)%7];
			}
		},
		/**. ``''integer'' year``: Define ou retorna o ano.**/
		year: {
			get: function() {return this._Y;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite || check.value === this.year) return;
				this._trigger("year");
				const val = __Number(check.value);
				const int = val.int;
				const dec = Math.abs(val.dec);
				this._Y = int;
				if (dec !== 0) this.month = 12*dec;
				return this._trigger("year");
			}
		},
		/**. ``''integer'' month``: Define ou retorna o mês de 1 a 12 (janeiro a dezembro). O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites. (**Observação**: ao alterar o mês de 2000-01-31 para fevereiro, a data definida será 2000-02-29 e não 2000-03-02)**/
		month: {
			get: function() {return this._M;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite || check.value === this.month) return;
				this._trigger("month");
				const val  = __Number(check.value);
				const int  = val.int;
				const dec  = Math.abs(val.dec);
				this._M    = int%12 <= 0 ? (int%12+12) : (int%12);
				this.year += Math.trunc(int < 1 ? (int-12)/12 : (int-1)/12);
				if (dec !== 0) this.day = dec*this._maxDay();
				return this._trigger("month");
			}
		},
		/**. ``''integer'' day``: Define ou retorna o dia de 1 a 31. O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites. (**Observação**: Quando o dia de um mês for maior que a quantidade de dias do mês alterado, o valor ficará limitado ao último dia e, ao acrescentar unidades de mês à data 2000-01-31, por exemplo, o resultado será 2000-02-29, 2000-03-31, 2000-04-30, 2000-05-31...**/
		day: {
			get: function() {return this._D > this._maxDay() ? this._maxDay() : this._D;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite || check.value === this.day) return;
				this._trigger("day");
				const val = __Number(check.value);
				const int = val.int;
				const dec = Math.abs(val.dec);
				if (int >= 1 && int <= this._maxDay()) {
					this._D = int;
				} else {
					this._D      = int < 1 ? 1 : this._maxDay();
					const delta  = int - this._D;
					const future = this.dateValueOf() + delta;
					/* aproximação anual */
					this.year  += Math.trunc((future - this.dateValueOf())/365);
					/* aproximação mensal */
					this.month += Math.trunc((future - this.dateValueOf())/30);
					/* aproximação diária */
					while (this.dateValueOf() !== future) {
						this._D += this.dateValueOf() < future ? +1 : -1;
						if (this._D > this._maxDay()) { /* IMPORTANTE: definir dia antes do mês */
							this._D = 1;
							this.month++;
						} else if (this._D < 1) { /* IMPORTANTE: definir mês antes do dia */
							this.month--;
							this._D = this._maxDay();
						}
					}
				}
				if (dec !== 0) this.hour = 24*dec;
				return this._trigger("day");
			}
		},
		/**. ``''integer'' hour``: Define ou retorna a hora (0 a 23). O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites.**/
		hour: {
			get: function() {return this._h;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite || check.value === this.hour) return;
				this._trigger("hour");
				const val = __Number(check.value);
				const int = val.int;
				const dec = Math.abs(val.dec);
				this._h   = (int%24 < 0 ? 24 : 0) + int%24;
				this.day += Math.trunc(int/24) + (val < 0 && int%24 !== 0 ? -1 : 0);
				if (dec !== 0) this.minute = 60*dec;
				return this._trigger("hour");
			}
		},
		/**. ``''integer'' minute``: Define ou retorna o minuto de 0 a 59. O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites.**/
		minute: {
			get: function() {return this._m;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite || check.value === this.minute) return;
				this._trigger("minute");
				const val  = __Number(check.value);
				const int  = val.int;
				const dec  = Math.abs(val.dec);
				this._m    = (int%60 < 0 ? 60 : 0) + int%60;
				this.hour += Math.trunc(int/60) + (val < 0 && int%60 !== 0 ? -1 : 0);
				if (dec !== 0) this.second = 60*dec;
				return this._trigger("minute");
			}
		},
		/**. ``''number'' second``: Define ou retorna o segundo de 0 a 59.999. O parâmetro será alterado para o valor definido, exceto quando extrapolar o limites.**/
		second: {
			get: function() {return this._s;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite || check.value === this.second) return;
				this._trigger("second");
				const val    = __Number(check.value);
				const int    = val.int;
				const dec    = Math.abs(val.dec);
				this._s      = (int%60 < 0 ? 60 : 0) + int%60 + dec;
				this.minute += Math.trunc(int/60) + (val < 0 && int%60 !== 0 ? -1 : 0);
				return this._trigger("second");
			}
		},
		/**. ``''boolean'' leap``: Informa se o ano definido é bissexto.**/
		leap: {get: function() {return this._leap();}},
		/**. ``''integer'' dayYear``: Informa o dia do ano (1-366).**/
		dayYear: {
			get: function() {
				const days = [0,31,59,90,120,151,181,212,243,273,304,334,365];
				const leap = this.leap && this.month > 2 ? 1 : 0;
				return days[this.month-1] + leap + this.day;
			}
		},
		/**. ``''integer'' weekDay``: Retorna o dia da semana de domingo (1) à sábado (7).**/
		weekDay: {
			get: function() { return this._weekDay();}
		},
		/**. ``''integer'' week``: Retorna a semana do ano (1-54) a partir de seu primeiro dia.**/
		week: {
			get: function() {
				const start = this._weekDay(this.dateValueOf() - this.dayYear + 1);
				const today = this.weekDay;
				const day0  = 1 - (start - 1);
				const dayn  = this.dayYear - (today - 1);
				return 1+(dayn - day0)/7;
			}
		},
		/**. ``''boolean'' workingDay``: Retorna se é um dia útil.**/
		workingDay: {
			get: function() {return this.weekDay !== 1 && this.weekDay !== 7;}
		},
		/**. ``''integer'' nonWorkingDays``: Retorna a quantidade de dias não úteis atá a data no ano.**/
		nonWorkingDays: {
			get: function() {
				const start = this._weekDay(this.dateValueOf() - this.dayYear + 1);
				const today = this.weekDay;
				const weeks = this.week;
				const day1  = weeks - (start === 1 ? 0 : 1);
				const day7  = weeks - (today === 7 ? 0 : 1);
				return day1 + day7;
			}
		},
		/**. ``''integer'' width``: Retorna a quantidade de dias no mês.**/
		width: {
			get: function() {return this._maxDay();}
		},
		/**. ``''integer'' workingDays``: Retorna a quantidade de dias úteis atá a data no ano.**/
		workingDays: {
			get: function() {
				return this.dayYear - this.nonWorkingDays;
			}
		},
		/**. ``''string'' code(''string'' value)``: Retorna o valor correspondente ao código informado no argumento ``value``:
		|Código|Descrição|
		|Y|Ano|
		|YY|Ano com os dois últimos dígitos|
		|YYYY|Ano com pelo menos quatro dígitos|
		|M|Mês|
		|MM|Mês com dois dígitos|
		|MMM|Nome abreviado do mês|
		|MMMM|Nome do mês|
		|D|Dia|
		|DD|Dia com dois dígitos|
		|DDD|Nome abreviado do dia da semana|
		|DDDD|Nome do dia da semana|
		|w|Número da semana do ano|
		|ww|Número da semana do ano com dois dígitos|
		|h|Hora|
		|hh|Hora com dois dígitos|
		|m|Minuto|
		|mm|Minuot com dois dígitos|
		|s|Segundos|
		|ss|Segundos com cinco dígitos (inteiros e milésimos)|
		|ampm|AM ou PM a depender da hora|
		|h12|Hora de relógio de 12h|
		|hh12|Hora de relógio de 12h com dois dígitos|.**/
		 code: {
		 	value: function(value) {
		 		const id    = String(value).trim();
		 		const self  = this;
		 		const codes = {
		 			get    Y() {return String(self.year);},
		 			get   YY() {return this.YYYY.replace(/(\-?)\d+(\d\d)$/, "$1$2");},
		 			get YYYY() {
		 				const y   = Math.abs(self.year);
				 		const len = (y < 10 ? 3 : (y < 100 ? 2 : (y < 1000 ? 1 : 0)));
				 		return (self.year < 0 ? "-" : "") + ("0").repeat(len) + String(y);
		 			},
		 			get    M() {return String(self.month);},
		 			get   MM() {return (this.M.length < 2 ? "0" : "") + this.M;},
		 			get  MMM() {return __LANG.searchByIndex("months", this.M).short;},
		 			get MMMM() {return __LANG.searchByIndex("months", this.M).long;},
		 			get    D() {return String(self.day);},
		 			get   DD() {return (this.D.length < 2 ? "0" : "") + this.D;},
		 			get  DDD() {return __LANG.searchByIndex("days", self.weekDay).short;},
		 			get DDDD() {return __LANG.searchByIndex("days", self.weekDay).long;},
					get    w() {return String(self.week);},
		 			get   ww() {return (this.W.length < 2 ? "0" : "") + this.W;},
		 			get    h() {return String(self.hour);},
		 			get   hh() {return (this.h.length < 2 ? "0" : "") + this.h;},
		 			get    m() {return String(self.minute);},
		 			get   mm() {return (this.m.length < 2 ? "0" : "") + this.m;},
		 			get    s() {return (self.second).toFixed(3);},
		 			get   ss() {return (this.s.length < 6 ? "0" : "") + this.s;},
		 			get ampm() {return self.hour < 12 ? "AM" : "PM";},
		 			get  h12() {return String(self.hour - (self.hour < 13 ? 0 : 12));},
		 			get hh12() {return (this.h12.length < 2 ? "0" : "") + this.h12;},
				};
	 			return id in codes ? codes[id] : value;
		 	}
		 },
		/**. ``''integer'' maxWeekForm``: Retorna a quantidade de semanas do ano para fins do [fomulário HTML ``week``]<https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#week_strings>.**/
		maxWeekForm: {
			get: function() {
				let week = this._weekDay(this.dateValueOf() - this.dayYear + 1);
				return (week === 5 || (week === 4 && this.leap)) ? 53 : 52;
			}
		},
		/**. ``''string'' format(''string'' x)``: Retorna uma string pré-formatada com valores dos atributos sendo representados por atalhos correspondentes ao nome do respectivo atributo entre chaves ``{nome}``. O argumento ``x`` deve conter as configurações da string a ser retornada (**Exemplo**: ``{DD}/{MM}/{YYYY}`` returna a data no formato ``DD/MM/YYYY``).**/
		format: {
			value: function(x) {
				x = __Type(x).chars ? x: "{DDDD}, {D} {MMMM} {YYYY}, {h}:{mm}:{ss}";
				let data = x.match(/\{\w+\}/gi);
				if (data === null) return x;
				for (let v of data) {
					let code  = v.replace(/^\{(\w+)\}$/, "$1");
					let value = this.code(code);
					x = x.replace(v, value);
				}
				return x;
			}
		},
		/**. ``''function'' onchange``: Define um disparador para ser chamado quando houver mudanças nos parâmetros de data e tempo. Para removê-lo, deve-se definí-lo com o valor ``null``.**/
		onchange: {
			set: function(x) {
				if (!__Type(x).function && x !== null) return;
				this._change = x;
			}
		},
		/**. ``''integer'' valueOf()``: Retorna os segundos desde 0000-01-01T00:00:00.**/
		valueOf: {
			value: function() {
				let date = this.dateValueOf();
				let time = this.timeValueOf();
				if (date >= 1)
					return 24*3600*(date-1)+time;
				return 24*3600*date - (24*3600 - time);
      }
		},
		/**. ``''integer'' timeValueOf()``: Retorna o tempo em segundos.**/
		timeValueOf: {
			value: function() {
				return 3600*this.hour + 60*this.minute + this.second;
			}
		},
		/**. ``''integer'' dateValueOf()``: Retorna os dias desde 0000-01-01 (dia 1).**/
		dateValueOf: {
			value: function() {
				/* se o ano for zero: dias do ano corrente */
				if (this.year === 0) return this.dayYear;
				/* se o ano for diferente de zero, calcular dias de anos completos (ano - 1) */
				const year = Math.abs(this.year) - 1;
				const y365 = 365*year;
				const y400 = Math.trunc(year/400);
				const y004 = Math.trunc(year/4);
				const y100 = Math.trunc(year/100);
				const days = y365 + y400 + y004 - y100;
				/* se o ano for positivo: dias do ano zero + dias de anos completos + dias do ano corrente */
				if (this.year >= 0) return 366 + days + this.dayYear;
				/* se o ano for negativo: dias de anos completos + (dias total do ano - dias do ano corrente) */
				return -(days + ((this.leap ? 366 : 365) - this.dayYear));
			}
		},
		/**. ``''string'' toString()``: Retorna a data e o tempo no formato ``YYYY-MM-DDThh:mm:ss.sss``.**/
		toString: {
			value: function() {return this.format("{YYYY}-{MM}-{DD}T{hh}:{mm}:{ss}");}
		},
		/**. ``''string'' toTimeString()``: Retorna o tempo no formato ``hh:mm:ss.sss``.**/
		toTimeString: {
			value: function() {return this.format("{hh}:{mm}:{ss}");}
		},
		/**. ``''string'' toDateString()``: Retorna a data no formato ``YYYY-MM-DD``.**/
		toDateString: {
			value: function() {return this.format("{YYYY}-{MM}-{DD}");}
		},
		/**. ``''string'' toWeekString()``: Retorna a semana no formato ``YYYY-wWW``.**/
		toWeekString: {
			value: function() {return this.format("{YYYY}-W{WW}");}
		},
		/**. ``''string'' toMonthString()``: Retorna o mês no formato ``YYYY-MM``.**/
		toMonthString: {
			value: function() {return this.format("{YYYY}-{MM}");}
		},
		/**. ``''string'' toTimeFormString()``: Retorna o tempo no formato para formulário ``hh:mm``.**/
		toTimeFormString: {
			value: function() {return this.format("{hh}:{mm}");}
		},
		/**. ``''string'' toDateFormString()``: Retorna a data no formato para formulário ``YYYY-MM-DD`` limitado ao ano 1 ou vazio.**/
		toDateFormString: {
			value: function() {return this.year < 1 ? "" : this.format("{YYYY}-{MM}-{DD}");}
		},
		/**. ``''string'' toFormString()``: Retorna data/tempo no formato para formulário ou vazio.**/
		toFormString: {
			value: function() {
				return this.year < 1 ? "" : this.format("{YYYY}-{MM}-{DD}T{hh}:{mm}");
			}
		},

		toLocaleDateString: {
			value: function() {
				// se lang for ar fudeu o esquema
				const format = new Intl.DateTimeFormat(__LANG.main);
				return format.formatToParts();
				//return format.format();
			}
		},






		/**. ``''string'' testDrive(''integer'' x=100)``: checa a sequencialidade dos dias e dos dias da semana. O atributo ``x`` define o ciclo da simulação em anos, do negativo ao positivo (dobra).**/
		testDrive: {
			value: function(x) {
				/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date */
				x = (x === undefined ? 100 : Math.abs(x))*365*24*3600;
				let min = __DateTime(-x);
				let max = __DateTime(+x);
				let i   = min.dateValueOf();
				let w   = min.weekDay;
				let ni  = min.dateValueOf();
				let nf  = max.dateValueOf();
				console.log({min: min.toDateString(), max: max.toDateString()});
				while (min < max) {
					if (i !== min.dateValueOf()) throw new Error("dateValueOf: "  + min.toString());
					if (w !== min.weekDay)  throw new Error("weekDay: " + min.toString());
					min.day++;
					i++;
					w = w === 7 ? 1 : (w+1);
				}
				console.log({min: min.toDateString(), max: max.toDateString()});
				return "Sucesso!"
			}
		}
	});
