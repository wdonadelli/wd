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
