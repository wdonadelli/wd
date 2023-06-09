	/**f{b{object}b __Date(b{string}b input)}f*/
	/**p{Construtor para manipulação de datas.}p*/
	/**l{d{v{input}v - Data em objeto ou string.}d}l*/
	function __Date(input) {
		if (!(this instanceof __Date)) return new __Date(input);
		let check = __Type(input);
		let date  = check.date ? check.value : __Type(new Date()).value.split("T")[0];
		date = date.split("-");
		Object.defineProperties(this, {
			_y: {value: Number(date[0]), writable: true},
			_m: {value: Number(date[1]), writable: true},
			_d: {value: Number(date[2]), writable: true},
			_change: {value: null, writable: true}
		});
	}
	/**6{Métodos e atributos}6 l{*/
	Object.defineProperties(__Date.prototype, {
		constructor: {value: __Date},
		//obj.toLocaleString(wd_lang(), value)






		/**t{b{integer}b _ends}t d{Retorna o número de dias do mês.}d*/
		_ends: {
			get: function() {
				let ends = [31, this.leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				return ends[this.month-1];
			}
		},
		/**t{b{integer}b _week(b{integer}b x)}t d{Retorna o dia da semana v{1-7}v a partir do identificador do dia.}d*/
		/**L{d{v{id}v - identificador do dia.}d}L*/
		_week: {
			value: function(id) {
				if (arguments.length === 0) id = this.valueOf();
				/* 2023-05-17 (quarta-feira) = 739022 */
				let value = 739022;
				let week  = 4;
				let rest  = (id - value)%7;
				let day   = (7 + week + rest)%7;
				return day === 0 ? 7 : day;
			}
		},
		/**t{b{number}b year}t d{Retorna ou define o ano.}d*/
		year: {
			get: function() {return this._y;},
			set: function(x) {
				let data = __Type(x);
				if (!data.finite) return;
				let info = {id: "year", old: this.year, new: null};
				let num  = __Number(data.value);
				this._y  = num.int;
				if (num.dec !== 0)
					this.month = Math.abs(12*num.dec);
				info.new = this.year;
				if (this._change !== null) this._change(info);
			}
		},
		/**t{b{number}b month}t d{Retorna ou define o mês.}d*/
		month: {
			get: function() {return this._m;},
			set: function(x) {
				let data = __Type(x);
				if (!data.finite) return;
				let info = {id: "month", old: this.month, new: null};
				let val  = data.value;
				while (val < 1 || val > 12) {
					this.year += val < 1 ? -1 :  +1;
					val       += val < 1 ? +12 : -12;
				}
				let num = __Number(val);
				this._m = num.int;
				if (num.dec !== 0)
					this.day = Math.abs(this._ends*num.dec);
				info.new = this.month;
				if (this._change !== null) this._change(info);
			}
		},
		/**t{b{number}b day}t d{Retorna ou define o dia.}d*/
		day: {
			get: function() {return this._d > this._ends ? this._ends : this._d;},
			set: function(x) {
				let data = __Type(x);
				if (!data.finite) return;
				let info = {id: "day", old: this.day, new: null};
				let val  = data.value;
				while (val < 1 || val > this._ends) {
					if (val < 1) {
						this.month--;
						val += this._ends;
					} else {
						val -= this._ends;
						this.month++;
					}
				}
				let num = __Number(val);
				this._d = num.int;
				info.new = this.day;
				if (this._change !== null) this._change(info);
			}
		},
		/**t{b{boolean}b leap}t d{Retorna se o ano é bissexto.}d*/
		leap: {
			get: function() {
				let y = Math.abs(this.year);
				return (y%400 === 0 || (y%4 === 0 && y%100 !== 0));
			}
		},
		/**t{b{integer}b days}t d{Retorna a u{diferença}u, em dias, entre a data e o primeiro dia do ano.}d*/
		days: {
			get: function() {
				let days = [0,31,59,90,120,151,181,212,243,273,304,334,365];
				let leap = this.leap && this.month > 2 ? 1 : 0;
				return days[this.month-1] + leap + this.day - 1;
			}
		},
		/**t{b{integer}b week}t d{Retorna o dia da semana, sendo v{1}v domingo e v{7}v sábado.}d*/
		week: {
			get: function() {return this._week();}
		},
		/**t{b{integer}b firstweekyear}t d{Retorna que dia da semana que iniciou o ano.}d*/
		firstweekyear: {
			get: function() {
				return this._week(this.valueOf() - this.days);
			}
		},
		/**t{b{integer}b weeks}t d{Retorna a semana do ano v{1-54}v.}d*/
		weeks: {
			get: function() {
				let walk = 7 + this.firstweekyear - 1;
				return Math.trunc((this.days + walk)/7);
			}
		},
		/**t{b{integer}b nonworkingdays}t d{Retorna a quantidade de dias não úteis no ano até a véspera da data.}d*/
		nonworkingdays: {//FIXME até a data ou até a véspera?
			get: function() {
				let weeks = this.weeks;
				let day1  = weeks - (this.firstweekyear === 1 ? 0 : 1);
				let day7  = weeks - (this.week          === 7 ? 0 : 1);
				return day1 + day7 - (!this.workingday ? 1 : 0);
			}
		},
		/**t{b{integer}b nonworkingdays}t d{Retorna a quantidade de dias úteis no ano até a véspera da data.}d*/
		workingdays: {
			get: function() {
				return this.days-this.nonworkingdays;
			}
		},
		/**t{b{boolean}b workingday}t d{Informa se a data é um dia útil.}d*/
		workingday: {
			get: function() {
				return this.week !== 7 && this.week !== 1;
			}
		},
		/**t{b{integer}b maxinputweeks}t d{Retorna a quantidade de semanas do ano para fins do fomulário HTML i{input:week}i (ver a{https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#week_strings}a).}d*/
		maxinputweeks: {
			get: function() {
				let week = this.firstweekyear;
				return (week === 5 || (week === 4 && this.leap)) ? 53 : 52;
			}
		},
		/**t{b{integer}b valueOf()}t d{Retorna a u{diferença}u, em dias, entre a data e o dia 0000-01-01.}d*/
		valueOf: {
			value: function() {
				if (this.year === 0) return this.days;
				let year = Math.abs(this.year)-1;
				let y365 = 365*year;
				let y400 = Math.trunc(year/400);
				let y004 = Math.trunc(year/4);
				let y100 = Math.trunc(year/100);
				let days = y365 + y400 + y004 - y100;
				if (this.year > 0) return 366 + days + this.days;
				return -(days + (this.leap ? 366 : 365) - this.days);
			}
		},
		/**t{b{string}b toString()}t d{Retorna a data no formato v{YYYY-MM-DD}v.}d*/
		toString: {
			value: function() {
				let y = Math.abs(this.year);
				let m = this.month;
				let d = this.day;
				let date = [
					(y < 10 ? "000" : (y < 100 ? "00" : "")) + String(y),
					(m < 10 ? "0" : "") + String(m),
					(d < 10 ? "0" : "") + String(d)
				].join("-");
				return (this.year < 0 ? "-" : "") + date;
			}
		},
		/**t{b{string}b toLocaleString()}t d{Retorna a data definida localmente pelo objeto i{Date}i.}d*/
		toLocaleString: {
			value: function() {
				let date = new Date(2000, this.month-1, this.day, 12, 0, 0, 0);
				date.setFullYear(this.year);
				return date.toLocaleDateString();
			}
		},
		/**t{b{function}b onchange()}t d{Define uma função a ser chamada após ocorrer mudança no dia, mês ou ano.}d*/
		/**L{d{v{x}v - Função a ser chamada ou c{null}c para remover o método definido.}d}L*/
		/**d{A função receberá um argumento em forma de objeto contendo os seguintes atributos:}d L{*/
		/**t{b{string}b id}t d{valor alterado (v{year, month ou day}v).}d*/
		/**t{b{number}b old}t d{valor antes da mudança.}d*/
		/**t{b{number}b new}t d{valor após a mudança.}d}L*/
		onchange: {
			set: function(x) {
				this._change = __Type(x).function ? x : null;
			}
		},
		/**t{b{string}b test(b{finite}b n)}t d{Testa valueOf, week, weeks e nonworkingdays.}d*/
		/**L{d{v{n}v - Ano corresponde à extremidade inferior (padrão v{10}v).}d}L*/
		test: {
			value: function(n) {
				this.day   = 1;
				this.month = 1;
				this.year  = n === undefined || !isFinite(n) ? -10 : -Math.trunc(n);
				let end    = 2*366*Math.abs(this.year);
				let i      = -1;
				let nwork  = 0;
				let weeks  = 0;
				let year   = null;
				console.log("start: "+this.toString());
				while (++i < end) {
					let week, value, _old, _new;
					week   = this.week;
					value  = this.valueOf();
					if (year !== this.year) {
						year  = this.year;
						nwork = 0;
						weeks = 0;
					}
					nwork += week === 1 || week === 7 ? 1 : 0;
					weeks += week === 1 || this.days === 0 ? 1 : 0;
					_old   = "old: "+this.toString()+" ["+week+"] ("+value+"), ";
					if (nwork !== this.nonworkingdays) throw Error("NonWorking {calc: "+nwork+", attr: "+this.nonworkingdays+"} "+_old);
					if (weeks !== this.weeks) throw Error("weeks {calc: "+weeks+", attr: "+this.weeks+"} "+_old);
					this.day++;
					_new  = "new: "+this.toString()+" ["+this.week+"] ("+this.valueOf()+") ";
					if (this.valueOf() !== (value+1)) throw Error("valueOf() "+_old+_new);
					if (this.week%7 !== (week+1)%7)   throw Error("week "+_old+_new);
				}
				console.log("end: "+this.toString());
				return "Done";
			}
		}
	/**}l*/
	});



	/**f{b{object}b __Time(b{string}b input)}f*/
	/**p{Construtor para manipulação de datas.}p*/
	/**l{d{v{input}v - Data em objeto ou string.}d}l*/
	function __Time(input) {
		if (!(this instanceof __Time)) return new __Time(input);
		let check = __Type(input);
		let time  = check.time ? check.value : __Type(new Date()).value.split("T")[1];
		time = time.split(":");
		Object.defineProperties(this, {
			_h: {value: Number(time[0]), writable: true},
			_m: {value: Number(time[1]), writable: true},
			_s: {value: Number(time[2]), writable: true},
			_d: {value: 0, writable: true},
			_change: {value: null, writable: true}
		});
	}
	/**6{Métodos e atributos}6 l{*/
	Object.defineProperties(__Time.prototype, {
		constructor: {value: __Time},
		/**t{b{number}b day}t d{Define ou retorna os avanços dos dias com relação ao tempo inicial.}d*/
		day: {
			get: function()  {return this._d},
			set: function(x) {
				let data = __Type(x);
				if (!data.finite) return;
				let info = {id: "day", old: this.day, new: null};
				let num  = __Number(data.value);
				this._d  = num.int;
				if (num.dec !== 0)
					this.hour = (num < 0 ? 24 : 0) + 24*num.dec;
				info.new = this.day;
				if (this._change !== null) this._change(info);
			}
		},
		/**t{b{number}b hour}t d{Define ou retorna a hora.}d*/
		hour: {
			get: function()  {return this._h;},
			set: function(x) {
				let data = __Type(x);
				if (!data.finite) return;
				let info = {id: "hour", old: this.hour, new: null};
				let val  = data.value;
				while (val < 0 || val >= 24) {
					this.day += val < 0 ?  -1 :  +1;
					val      += val < 0 ? +24 : -24;
				}
				let num = __Number(val);
				this._h = num.int;
				if (num.dec !== 0)
					this.minute = (data.negative ? 60 : 0) + 60*num.dec;
				info.new = this.hour;
				if (this._change !== null) this._change(info);
			}
		},
		/**t{b{number}b minute}t d{Define ou retorna os minutos.}d*/
		minute: {
			get: function()  {return this._m;},
			set: function(x) {
				let data = __Type(x);
				if (!data.finite) return;
				let info = {id: "minute", old: this.minute, new: null};
				let val = data.value;
				while (val < 0 || val >= 60) {
					this.hour += val < 0 ?  -1 :  +1;
					val       += val < 0 ? +60 : -60;
				}
				let num = __Number(val);
				this._m = num.int;
				if (num.dec !== 0)
					this.second = (data.negative ? 60 : 0) + 60*num.dec;
				info.new = this.minute;
				if (this._change !== null) this._change(info);
			}
		},
		/**t{b{number}b second}t d{Define ou retorna os segundos.}d*/
		second: {
			get: function()  {return this._s;},
			set: function(x) {
				let data = __Type(x);
				if (!data.finite) return;
				let info = {id: "second", old: this.second, new: null};
				let val = data.value;
				while (val < 0 || val >= 60) {
					this.minute += val < 0 ?  -1 :  +1;
					val         += val < 0 ? +60 : -60;
				}
				this._s = Number(val.toFixed(3));
				info.new = this.second;
				if (this._change !== null) this._change(info);
			},
		},
		/**t{b{string}b clock}t d{Retorna o tempo no formato HH:MM:SS.}d*/
		clock: {
			get: function() {
				let data = this.toString().split(":");
				data.shift();
				data[2] = __Number(data[2]).int;
				data[2] = (data[2] < 10 ? "0" : "") + String(data[2]);

				return data.join(":");
			}
		},
		/**t{b{string}b toString(b{boolean}b day)}t d{Retorna o tempo e os dias no formato D:HH:MM:SS.}d*/
		/**L{d{v{day}v - Se falso, desconsiderará os avaços dos dias.}d}L*/
		toString: {
			value: function(day) {
				let h = this.hour;
				let m = this.minute;
				let s = this.second;
				let d = this.day;
				let a = [
					String(d),
					(h < 10 ? "0" : "")+String(h),
					(m < 10 ? "0" : "")+String(m),
					(s < 10 ? "0" : "")+String(s)
				];
				if (day === false) a.shift();
				return a.join(":");
			}
		},
		/**t{b{string}b toLocaleString()}t d{Retorna o tempo definido localmente pelo objeto i{Date}i.}d*/
		toLocaleString: {
			value: function() {
				let date = new Date(2000, 0, 0, this.hour, this.minute, Math.trunc(this.second), 0);
				date.setMilliseconds(1000*__Number(this.second).dec);
				return date.toLocaleTimeString();
			}
		},
		/**t{b{number}b valueOf(b{boolean}b day)}t d{Retorna os segundos do tempo considerando os avanços dos dias.}d*/
		/**L{d{v{day}v - Se falso, desconsiderará os avaços dos dias no valor.}d}L*/
		valueOf: {
			value: function(day) {
				let h = 3600*this.hour;
				let m = 60*this.minute;
				let s = this.second;
				let d = day === false ? 0 : 24*3600*this.day;
				return h+m+s+d;
			}
		},
		/**t{b{function}b onchange()}t d{Define uma função a ser chamada após ocorrer mudança no dia, hora, minuto ou segundo.}d*/
		/**L{d{v{x}v - Função a ser chamada ou c{null}c para remover o método definido.}d}L*/
		/**d{A função receberá um argumento em forma de objeto contendo os seguintes atributos:}d L{*/
		/**t{b{string}b id}t d{valor alterado (v{day, hour, minute, second}v).}d*/
		/**t{b{number}b old}t d{valor antes da mudança.}d*/
		/**t{b{number}b new}t d{valor após a mudança.}d}L*/
		onchange: {
			set: function(x) {
				this._change = __Type(x).function ? x : null;
			}
		},
	/**}l*/
	});

	/**f{b{object}b __DateTime(b{string}b input)}f*/
	/**p{Construtor para manipulação de datas e tempo em conjunto.}p*/
	/**l{d{v{input}v - Data em objeto ou string.}d}l*/
	function __DateTime(input) {
		if (!(this instanceof __DateTime)) return new __DateTime(input);
		let check = __Type(input);
		let data  = (check.datetime ? check.value : __Type(new Date()).value).split("T");
		Object.defineProperties(this, {
			_date: {value: __Date(data[0])},
			_time: {value: __Time(data[1])},
		});
		/* IMPORTANTE: alterar o dia da data se alterar o dia do tempo */
		let date = this._date;
		this._time.onchange = function(x) {
			if (x.id === "day")
				date.day += x.new - x.old;
		}
	}
	/**6{Métodos e atributos}6 l{*/
	Object.defineProperties(__DateTime.prototype, {
		constructor: {value: __DateTime},
		/**t{b{number}b year}t d{Retorna ou define o ano.}d*/
		year: {
			get: function()  {return this._date.year;},
			set: function(x) {return this._date.year = x;},
		},
		/**t{b{number}b month}t d{Retorna ou define o mês.}d*/
		month: {
			get: function()  {return this._date.month;},
			set: function(x) {return this._date.month = x;},
		},
		/**t{b{number}b day}t d{Retorna ou define o dia.}d*/
		day: {
			get: function()  {return this._date.day;},
			set: function(x) {return this._date.day = x;},
		},
		/**t{b{number}b hour}t d{Retorna ou define a hora.}d*/
		hour: {
			get: function()  {return this._time.hour;},
			set: function(x) {return this._time.hour = x;},
		},
		/**t{b{number}b minute}t d{Retorna ou define o minuto.}d*/
		minute: {
			get: function()  {return this._time.minute;},
			set: function(x) {return this._time.minute = x;},
		},
		/**t{b{number}b second}t d{Retorna ou define o segundo.}d*/
		second: {
			get: function()  {return this._time.second;},
			set: function(x) {return this._time.second = x;},
		},
		/**t{b{void}b time(b{string}b x)}t d{Retorna o atributo de tempo conforme objeto i{__Time}i.}d*/
		/**L{d{v{x}v - Atributo do objeto i{__Time}i.}d}L*/
		time: {
			value: function(x) {
				return x in this._time ? this._time[x] : undefined;
			}
		},
		/**t{b{void}b date(b{string}b x)}t d{Retorna o atributo de data conforme objeto i{__Date}i.}d*/
		/**L{d{v{x}v - Atributo do objeto i{__Date}i.}d}L*/
		date: {
			value: function(x) {
				return x in this._date ? this._date[x] : undefined;
			}
		},
		/**t{b{number}b valueOf()}t d{Retorna o identificador do data/tempo em segundos sendo 0000-01-01T00:00:00 igual a zero.}d*/
		valueOf: {
			value: function() {
				let date = 24*3600*this._date.valueOf();
				let time = this._time.valueOf(false);
				return date + time;
			}
		},
		/**t{b{number}b toString()}t d{Retorna o valor data/tempo no formato YYYY-MM-DDTHH:MM:SS.}d*/
		toString: {
			value: function() {
				let date = this._date.toString();
				let time = this._time.toString(false);
				return date+"T"+time;
			}
		},
		/**t{b{string}b toLocaleString()}t d{Retorna a data/tempo definido localmente pelo objeto i{Date}i.}d*/
		toLocaleString: {
			value: function() {
				let date = new Date(2000, this.month-1, this.day, this.hour, this.minute, Math.trunc(this.second), 0);
				date.setMilliseconds(1000*__Number(this.second).dec);
				date.setFullYear(this.year);
				return date.toLocaleString();
			}
		},

	/**}l*/
	});




/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/







	/**
	`/**
	`object __DateTime(b{string}b input)`
	Construtor para manipulação de data/tempo.}p*/
	/**l{d{v{input}v - Objeto c{Date}c ou string em forma de data ou tempo, caso contrário assumirá valor atual.}d}l*/
	/* IMPORTANTE: garantir a mudança para o mês definido */
	/* Ex: 2000-01-31 não virar 2000-03-02 quando muda para o mês 02 */
	/* IMPORTANTE: garantir continuidade do dia na mudança de mês e ano */
	/* Ex: 2000-01-31 | 2000-02-29 | 2000-03-31 | 2000-04-30 | 2000-05-31 */
	function __DateTime2(input) {
		if (!(this instanceof __DateTime2)) return new __DateTime2(input);
		let check = __Type(input);
		let type  = check.type;
		let datetime;
		switch(type) {
			case "time":     datetime = "0000-01-01T"+check.value; break;
			case "date":     datetime = check.value+"T00:00:00";   break;
			case "datetime": datetime = check.value;               break;
			default:
				type = "datetime";
				datetime = __Type(new Date()).value;
		}
		datetime   = datetime.split("T");
		let date   = datetime[0];
		let time   = datetime[1];
		let year   = Number(date.slice(0,-6));
		let month  = Number(date.slice(-5,-3))-1;
		let day    = Number(date.slice(-2));
		let hour   = Number(time.slice(0,2));
		let minute = Number(time.slice(3,5));
		let second = Number(time.slice(6,8));
		let millis = Number(time.slice(9) === "" ? 0 : time.slice(9));
		let safe   = year < 0 ? -8.64e15 : +8.64e15;
		/* IMPORTANTE: o ano inicial precisa ser bissexto */
		let value = new Date(Date.UTC(2000, month, day, hour, minute, second, millis));
		value.setUTCFullYear(year);



		Object.defineProperties(this, {
			_value:  {value: value},                /* objeto Date */
			_type:   {value: type},                 /* tipo de tempo de entrada */
			_change: {value: null, writable: true}, /* evento do disparador de alteração */
			_day:    {value: day,  writable: true}, /* registra o dia na alteração de ano ou mês */
			_safe:   {value: safe, writable: true}  /* registro de segurança se extrapolar os limite */
		});

		/* checando os limites da data */
		this._validity();
	}
	/**6{Métodos e atributos}6 l{*/
	Object.defineProperties(__DateTime2.prototype, {
		constructor: {value: __DateTime2},
		/**
	`void  _validity()}t d{Checa os limites do objeto i{Date}i e impede sua alteração se ultrpassados (a{https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_epoch_timestamps_and_invalid_date}a).*/
		_validity: {
			value: function() {
				if (isNaN(this._value.getTime()))  {
					this._value.setTime(this._safe);
					this.toString()
					console.warn(
						"DateTime: Limit exceeded, request unfulfilled or limited ("+this.toString()+")."
					);
				}
				this._safe = this._value.getTime();
			}
		},
		/**
	`void  _trigger(b{/**
	`object)}t d{Disparador de mudança de dados, obtém e checa valores.
		/**d{Retorna um objeto (v{x}v) com os dados de tempo.
		/**L{d{v{x}v - objeto com os dados de tempo. Se definido, checará alterações entre o argumento e os dados atuais.*/
		_trigger: {
			value: function (x) {
				this._validity();
				if (this._change === null) return;
				let data = {year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0};
				let type = __Type(x);
				for (let i in data) {
					if (!type.object) {
						data[i] = this[i];
					} else if (x[i] !== this[i]) {
						this._change({target: i, old: x[i], new: this[i]});
					}
				}
				return data;
			}
		},
		integer}b _zero}t d{Referencial para contagem dos dias (0000-01-01).
		_zero: {
			value: (function() {
				let date = new Date(Date.UTC(1970,0,1,0,0,0,0));
				date.setUTCFullYear(0);
				return date;
			}())
		},
		/**
	`object _local}t d{Retorna uma cópia do data/tempo para fins de uso local.
		_local: {
			get: function() {
				let date = new Date(2000, this.month-1, this.day,	12, 0, 0, 0);
				date.setFullYear(this.year);
				return date;
			}
		},
		integer}b _ends(b{integer}b m)}t d{Retorna o número de dias do mês.
		/**L{d{v{x}v - Mês de referência.}d}L*/
		_ends: {
			value: function(m) {
				if (m === undefined) m = this.month;
				let ends = [31, this.leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				return ends[m-1];
			}
		},
		number}b year}t d{Retorna ou define o ano.
		year: {
			get: function()  {return this._value.getUTCFullYear();},
			set: function(x) {
				let data = __Type(x);
				if (!data.finite) return;
				let trigger = this._trigger();
				/* manter o dia nas mundanças de mês e ano */
				this._day = this._day > this.day ? this._day : this.day;
				this._value.setUTCDate(1);
				/* mudar o ano */
				let num = __Number(data.value);
				this._value.setUTCFullYear(num.int);
				/* definir novo dia se maior que o limite do mês, ou reestabelecer o anterior */
				if (this._day > this._ends()) {
					this._value.setUTCDate(this._ends());
				} else {
					this._value.setUTCDate(this._day);
				}
				this._trigger(trigger);
				if (data.decimal)
					this.month = (data.negative ? 12 : 0) + 12*num.dec;
			}
		},
		number}b month}t d{Retorna ou define o mês.
		month: {
			get: function()  {return this._value.getUTCMonth()+1;},
			set: function(x) {
				let data = __Type(x);
				if (!data.finite) return;
				let trigger = this._trigger();
				/* manter o dia nas mundanças de mês e ano */
				this._day = this._day > this.day ? this._day : this.day;
				this._value.setUTCDate(1);
				/* definir o mês */
				let num = __Number(data.value);
				this._value.setUTCMonth(num.int-1);
				/* definir novo dia se maior que o limite do mês, ou reestabelecer o anterior */
				if (this._day > this._ends()) {
					this._value.setUTCDate(this._ends());
				} else {
					this._value.setUTCDate(this._day);
				}
				this._trigger(trigger);
				if (data.decimal) {
					let ref  = this._ends(this.month);
					this.day = (data.negative ? ref : 0) + ref*num.dec;
				}
			}
		},
		number}b day}t d{Retorna ou define o dia.
		day: {
			get: function() {return this._value.getUTCDate();},
			set: function(x) {
				let data = __Type(x);
				if (!data.finite) return;
				let trigger = this._trigger();
				/* definir o dia */
				this._value.setUTCDate(Math.trunc(data.value));
				this._day = this.day;
				this._trigger(trigger);
				if (data.decimal)
					this.hour = (data.negative ? 24 : 0) + 24*num.dec;
			}
		},
		number}b hour}t d{Define ou retorna a hora.
		hour: {
			get: function()  {return this._value.getUTCHours();},
			set: function(x) {
				let data = __Type(x);
				if (!data.finite) return;
				let trigger = this._trigger();
				let num = __Number(data.value);
				this._value.setUTCHours(num.int);
				this._trigger(trigger);
				if (data.decimal)
					this.minute = (data.negative ? 60 : 0) + 60*num.dec;
			}
		},
		number}b minute}t d{Define ou retorna os minutos.
		minute: {
			get: function()  {return this._value.getUTCMinutes();},
			set: function(x) {
				let data = __Type(x);
				if (!data.finite) return;
				let trigger = this._trigger();
				let num = __Number(data.value);
				this._value.setUTCMinutes(num.int);
				this._trigger(trigger);
				if (data.decimal)
					this.second = (data.negative ? 60 : 0) + 60*num.dec;
			}
		},
		number}b second}t d{Define ou retorna os segundos.
		second: {
			get: function()  {
				return this._value.getUTCSeconds() + (this._value.getUTCMilliseconds()/1000);
			},
			set: function(x) {
				let data = __Type(x);
				if (!data.finite) return;
				let trigger = this._trigger();
				let num = __Number(data.value);
				this._value.setUTCMilliseconds(data.negative ? 0 : 1000*num.dec);
				this._value.setUTCSeconds(data.negative ? 0 : num.int);
				this._trigger(trigger);
			}
		},
		boolean}b leap}t d{Retorna se o ano é bissexto.
		leap: {
			get: function() {
				let y = Math.abs(this.year);
				return (y%400 === 0 || (y%4 === 0 && y%100 !== 0));
			}
		},
		integer}b days}t d{Retorna a u{diferença}u, em dias, entre a data e o primeiro dia do ano.
		days: {
			get: function() {
				let days = [0,31,59,90,120,151,181,212,243,273,304,334,365];
				let leap = this.leap && this.month > 2 ? 1 : 0;
				return days[this.month-1] + leap + this.day - 1;
			}
		},
		integer}b dayYear}t d{Retorna o dia do ano.
		dayYear: {
			get: function() {return this.days+1;}
		},
		integer}b weekDay}t d{Retorna o dia da semana, sendo v{1}v domingo e v{7}v sábado.
		weekDay: {
			get: function() {
				return this._value.getUTCDay()+1;
			}
		},
		integer}b firstWeekDay}t d{Retorna que dia da semana que iniciou o ano.
		firstWeekDay: {
			get: function() {
				let date = new Date();
				date.setTime(this._value.getTime() - 24*3600*1000*this.days);
				return date.getUTCDay()+1;
			}
		},
		integer}b week}t d{Retorna a semana do ano v{1-54}v.
		week: {
			get: function() {
				let fullWeek = (this.firstWeekDay - 1) + 7;
				return Math.trunc((this.days + fullWeek)/7);
			}
		},
		integer}b nonWorkingDays}t d{Retorna a quantidade de dias não úteis no ano até a véspera da data.
		nonWorkingDays: {
			get: function() {
				let week = this.week;
				let day1 = week - (this.firstWeekDay === 1 ? 0 : 1);
				let day7 = week - (this.weekDay      === 7 ? 0 : 1);
				return day1 + day7 - (!this.workingDay ? 1 : 0);
			}
		},
		integer}b nonWorkingDays}t d{Retorna a quantidade de dias úteis no ano até a véspera da data.
		workingDays: {
			get: function() {
				return this.days-this.nonWorkingDays;
			}
		},
		boolean}b workingDay}t d{Informa se a data é um dia útil.
		workingDay: {
			get: function() {
				return this.weekDay !== 7 && this.weekDay !== 1;
			}
		},
		integer}b stdWeek}t d{Retorna a semana do ano no padrão do fomulário HTML i{input:week}i (ver a{https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#week_strings}a).
		stdWeek: {//FIXME que chatice esse negócio de data
			get: function() {
				if (this.firstWeekDay <= 5) return this.week;
				if (this.week > 1) return this.week - 1;
				let year = this.year-1;
				let date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0, 0));
				date.setUTCFullYear(this.year-1);
				let week = date.getUTCDay()+1;
				let leap = true;
				return (week === 5 || (week === 4 && this.leap)) ? 53 : 52;
			}
		},
		string}b D}t d{Retorna o dia
		D: {
			get: function() {return String(this.day);}
		},
		string}b DD}t d{Retorna o dia com dois dígitos.
		DD: {
			get: function() {return ("0"+this.D).slice(-2);}
		},
		string}b DDD}t d{Retorna o nome abreviado do dia da semana do local.
		DDD: {
			get: function() {
				return this._local.toLocaleDateString(undefined, {weekday: "short"});
			}
		},
		string}b DDDD}t d{Retorna o nome do dia da semana do local.
		DDDD: {
			get: function() {
				return this._local.toLocaleDateString(undefined, {weekday: "long"});
			}
		},
		string}b M}t d{Retorna o mês.
		M: {
			get: function() {return String(this.month);}
		},
		string}b MM}t d{Retorna o mês com dois dígitos.
		MM: {
			get: function() {return ("0"+this.M).slice(-2);}
		},
		string}b MMM}t d{Retorna o nome abreviado do mês do local.
		MMM: {
			get: function() {
				return this._local.toLocaleDateString(undefined, {month: "short"});
			}
		},
		string}b MMMM}t d{Retorna o nome do mês do local.
		MMMM: {
			get: function() {
				return this._local.toLocaleDateString(undefined, {month: "long"});
			}
		},
		string}b Y}t d{Retorna o ano.
		Y: {
			get: function() {return String(this.year);}
		},
		string}b YY}t d{Retorna o ano com dois dígitos.
		YY: {
			get: function() {
				return (this.year < 0 ? "-" : "")+("0"+String(Math.abs(this.year))).slice(-2);
			}
		},
		string}b YYYY}t d{Retorna o ano com quatro dígitos.
		YYYY: {
			get: function() {
				if (this.year >= 0 && this.Y.length >= 4) return this.Y;
				if (this.year < 0  && this.Y.length >= 5) return this.Y;
				return (this.year < 0 ? "-" : "")+("000"+String(Math.abs(this.year))).slice(-4);
			}
		},
		string}b h}t d{Retorna a hora.
		h: {
			get: function() {return String(this.hour);}
		},
		string}b hh}t d{Retorna a hora com dois dígitos.
		hh: {
			get: function() {return ("0"+this.h).slice(-2);}
		},
		string}b m}t d{Retorna minuto.
		m: {
			get: function() {return String(this.minute)}
		},
		string}b mm}t d{Retorna o minuto com dois dígitos.
		mm: {
			get: function() {return ("0"+this.m).slice(-2);}
		},
		string}b s}t d{Retorna o segundo.
		s: {
			get: function() {return String(this.second);}
		},
		string}b ss}t d{Retorna o segundo com dois dígitos.
		ss: {
			get: function() {return (this.second < 10 ? "0" : "")+this.s;}
		},

		//FIXME
		string}b WW}t d{Retorna o dia da semana com dois dígitos.
		WW: {
			get: function() {
				return ("0"+String(this.week - (this.firstWeekDay <= 5 ? 0 : 1))).slice(-2);
			}
		},



		integer}b valueOf()}td{Retorna os segundos desde v{0000-01-01T00:00:00}v.
		valueOf: {
			value: function() {return (this._value - this._zero)/1000;}
		},
		string}b toString()}t d{Retorna o momento no formato v{YYYY-MM-DDThh:mm:ss.sss}v.
		toString: {
			value: function() {return this.format("{YYYY}-{MM}-{DD}T{hh}:{mm}:{ss}");}
		},
		integer}b pastDays}td{Retorna os dias desde v{0000-01-01}v.
		pastDays: {
			get: function() {return Math.trunc(this.valueOf()/(24*3600));}
		},
		string}b format(b{string}b x)}t d{Recebe um texto preformatado substituindo seus parâmetros por valores.}dL{*/
		/**d{v{x}v - Texto preformatado cujos parâmetros são informados entre chaves i{{parâmetro}}i:
		/**d{O parâmetro corresponde ao nome de um atributo do objeto.}d}L*/
		format: {
			value: function(x) {
				x = __Type(x).chars ? x: "{DDD}, {D} {MMMM} {YYYY}, {h}:{mm}:{ss}";
				let obj  = this;
				let data = x.match(/\{\w+\}/gi);
				if (data === null) return x;
				data.forEach(function(v,i,a){
					let id = v.replace("{", "").replace("}", "");
					if (id in obj && !__Type(obj[id]).function)
						x = x.replace(v, obj[id]);
				});
				return x;
			}
		},
		function}b onchange()}t d{Dispara uma função após ocorrer mudança nos parâmetros de data/tempo.
		/**L{d{v{x}v - Define o função a ser disparada ou c{null}c para removê-la.}d}L*/
		/**d{A função receberá um argumento em forma de objeto contendo os seguintes atributos:}d L{*/
		string}b target}t d{valor alterado (v{year month day hour minute second}v).
		number}b old}t d{valor antes da mudança.
		number}b new}t d{valor após a mudança.}d}L*/
		onchange: {
			set: function(x) {
				if (!__Type(x).function && x !== null) return;
				this._change = x;
			}
		},

	});

	
