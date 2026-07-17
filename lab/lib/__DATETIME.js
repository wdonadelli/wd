/**
#3 String de Data e Tempo
O objeto '{__DATETIME} estabelece as regras para extrair data e tempo a partir de strings adotando a seguinte nomenclatura:
|Sigla|Descrição|Observação|
|Y|Ano quantidade de dígitos livre||
|YYYY|Ano com 4 Dígitos ou mais||
|M|Mês de 1-12 ou 01-12||
|MM|Mês com 2 Dígitos 01-12||
|MMM|Nome curto do mês|Insensível à altura da caixa|
|MMMM|Nome longo do mês|Insensível à altura da caixa|
|D|Dia de 1-31 ou 01-31|O valor deve corresponder ao mês e ano|
|DD|Dia com 2 Dígitos 01-31|Ver observação anterior|
|d|Dia da semana de 1-7 ou 01-07 (domingo à sábado)|Quando se trata de semana ISO, a semana começa na segunda (1)|
|dd|Dia da semana com 2 Dígitos 01-07|Ver observaçao anterior|
|ddd|Nome curto do dia da semana|Insensível à altura da caixa|
|dddd|Nome longo do dia da semana|Insensível à altura da caixa|
|w|Semana do ano de 1-53 ou 01-53|O valor deve corresponder ao ano|
|ww|Semana do ano com 2 Dígitos 01-53|Ver observação anterior|
|H|Horas de 0-24 ou 00-24||
|HH|Horas com 2 Dígitos 00-24||
|h|Horas de 0-12 ou 00-12||
|hh|Horas com 2 Dígitos 00-12||
|m|Minutos de 0-59 ou 00-59||
|mm|Minutos com 2 Dígitos 00-59||
|s|Segundos de 0-59.999 ou 00-59.999||
|ss|Segundos com 2 Dígitos 00-59.999||
|l|Milissegundos de 0 a 999||
|ll|Milissegundos com 3 dígitos de 000 a 999||
|p|Período do dia AM ou PM||
|P|Direção do tempo, se antes (-) ou depois (+) do ano 0|Opcional para anos a partir de zero|
Observações:
- Formatos de data, mês e semana são tratados como data e identificados em dias desde '{0000-01-01};
- Farmatos de tempo e data/tempo são tratados como tempo e identificados em milissegundos;
- Formatos de tempo correspondem ao ciclo de 24 horas iniciado em ´{00:00:00.000};
- Formatos de data/tempo correspondem ao período iniciado em ´{0000-01-01T00:00:00.000};
- Dias da semana são relatados de domingo (1) a sábado (7);
- Formatos de semana obedecem à a{ISO 8601}@href{https://en.wikipedia.org/wiki/ISO_8601#Week_dates}, ou seja, começa na segunda-feira (1) e termina no domingo (7).
- Valores máximos e mínimos de identificadores confiáveis são dados por MAX_SAFE_INTEGER e MIN_SAFE_INTEGER;
**/
const __DATETIME = {
	/**. '{string lang}: Identifica a linguagem utilizada para carregar meses e dias da semana.**/
	lang: null,
	/**. '{object names}: Registra os nomes dos meses e dias, curtos e longos, conforme linguagem '{lang}.**/
	names: null,
	/**. '{array template}: Registra a lista de modelos de data/tempo e suas configurações:
	|Nome|Tipo|Descrição|
	|re|regexp|Expressão regular para checar casamento e capturar dados|
	|flag|object|Posição das unidades básicas no modelo|
	|type|string|Tipo do modelo|**/
	templates: null,
	/**. '{object unit}: Registra as unidades básicas de data e tempo.**/
	unit: {
		Y:   /(\d+)/,                    YYYY: /(\d{4,})/,
		M:   /(0?[1-9]|1[0-2])/,         MM:   /(0[1-9]|1[0-2])/,
		MMM: null,                       MMMM: null,
		D:   /(0?[1-9]|[12]\d|3[01])/,   DD:   /(0[1-9]|[12]\d|3[01])/,
		d:   /(0?[1-7])/,                dd:   /(0[1-7])/,
		ddd: null,                       dddd: null,
		w:   /(0?[1-9]|[1-4]\d|5[0-3])/, ww:   /(0[1-9]|[1-4]\d|5[0-3])/,
		H:   /([01]?\d|2[0-4])/,         HH:   /([01]\d|2[0-4])/,
		h:   /(0?[1-9]|1[0-2])/,         hh:   /(0[1-9]|1[0-2])/,
		m:   /([0-5]?\d)/,               mm:   /([0-5]\d)/,
		s:   /([0-5]?\d)/,               ss:   /([0-5]\d)/,
		l:   /(\d{1,3})/,                ll:   /(\d\d\d)/,
		p:   /([AP]M)/,                  P:   /([+\-]?)/
	},
	/**. '{array template}: Registra os modelos de tempo e suas configurações.**/
	base: [
		/*-- datas: meses numéricos --*/
		{flag: {P: 1, D: 4, M: 3, Y: 2}, type: "date", model: "(P)(YYYY)-(MM)-(DD)"},
		{flag: {P: 1, D: 2, M: 3, Y: 4}, type: "date", model: "(P)(DD)/(MM)/(YYYY)"},
		{flag: {P: 1, D: 3, M: 2, Y: 4}, type: "date", model: "(P)(MM)-(DD)-(YYYY)"},
		/*-- datas: meses nominais --*/
		{flag: {P: 1, D: 4, M: 3, Y: 2}, type: "date", model: "(P)(YYYY) (MMM) (D)"},
		{flag: {P: 1, D: 4, M: 3, Y: 2}, type: "date", model: "(P)(YYYY) (MMMM) (D)"},
		{flag: {P: 1, D: 2, M: 3, Y: 4}, type: "date", model: "(P)(D) (MMM) (YYYY)"},
		{flag: {P: 1, D: 2, M: 3, Y: 4}, type: "date", model: "(P)(D) (MMMM) (YYYY)"},
		{flag: {P: 1, D: 3, M: 2, Y: 4}, type: "date", model: "(P)(MMM) (D) (YYYY)"},
		{flag: {P: 1, D: 3, M: 2, Y: 4}, type: "date", model: "(P)(MMMM) (D) (YYYY)"},
		/*-- meses numéricos --*/
		{flag: {P: 1, M: 3, Y: 2}, type: "month", model: "(P)(YYYY)-(MM)"},
		{flag: {P: 1, M: 2, Y: 3}, type: "month", model: "(P)(MM)/(YYYY)"},
		{flag: {P: 1, M: 2, Y: 3}, type: "month", model: "(P)(MM)-(YYYY)"},
		/*-- meses nominais --*/
		{flag: {P: 1, M: 2, Y: 3}, type: "month", model: "(P)(MMM) (YYYY)"},
		{flag: {P: 1, M: 2, Y: 3}, type: "month", model: "(P)(MMMM) (YYYY)"},
		{flag: {P: 1, M: 3, Y: 2}, type: "month", model: "(P)(YYYY) (MMM)"},
		{flag: {P: 1, M: 3, Y: 2}, type: "month", model: "(P)(YYYY) (MMMM)"},
		/*-- semanas --*/
		{flag: {P: 1, w: 3, Y: 2},       type: "week", model: "(P)(YYYY)-W(ww)"},
		{flag: {P: 1, w: 3, Y: 2},       type: "week", model: "(P)(YYYY)W(ww)"},
		{flag: {P: 1, w: 3, Y: 2, d: 4}, type: "week", model: "(P)(YYYY)-W(ww)-(d)"},
		{flag: {P: 1, w: 3, Y: 2, d: 4}, type: "week", model: "(P)(YYYY)W(ww)(d)"},
		{flag: {P: 3, w: 2, Y: 4, d: 1}, type: "week", model: "(ddd), (w) (P)(YYYY)"},
		{flag: {P: 3, w: 2, Y: 4, d: 1}, type: "week", model: "(dddd), (w) (P)(YYYY)"},
		/*-- tempo --*/
		{flag: {H: 1, m: 2, s: 3, l: 4},       type: "time", model: "(H):(mm):(ss).(ll)"},
		{flag: {H: 1, m: 2, s: 3},             type: "time", model: "(H):(mm):(ss)"},
		{flag: {H: 1, m: 2},                   type: "time", model: "(H):(mm)"},
		{flag: {h: 1, m: 2, s: 3, l: 4, p: 5}, type: "time", model: "(h):(mm):(ss).(ll) (p)"},
		{flag: {h: 1, m: 2, s: 3, p: 4},       type: "time", model: "(h):(mm):(ss) (p)"},
		{flag: {h: 1, m: 2, p: 3},             type: "time", model: "(h):(mm) (p)"},
	],
	/**. '{object getNames(array lang)}: Retorna os nomes dos meses e dias (ddd dddd MMM MMMM) na língua definida no argumento.**/
	getNames: function(lang) {
		const data = {ddd: Array(7), dddd: Array(7), MMM: Array(12), MMMM: Array(12)};
		const date = new Date(1970, 0, 15, 12, 0, 0, 0);
		const MMMM = new Intl.DateTimeFormat(lang, {month:   "long"});
		const MMM  = new Intl.DateTimeFormat(lang, {month:   "short"});
		const dddd = new Intl.DateTimeFormat(lang, {weekday: "long"});
		const ddd  = new Intl.DateTimeFormat(lang, {weekday: "short"});
		/*-- obter o nome dos meses (janeiro = 0) --*/
		for (let i = 0; i < 12; i++) {
			data.MMMM[date.getMonth()] = MMMM.format(date).trim();
			data.MMM[date.getMonth()]  = MMM.format(date).trim();
			date.setMonth(date.getMonth() + 1);
		}
		/*-- obter o nome dos dias da semana (domingo = 0) --*/
		for (let i = 0; i < 7; i++) {
			data.dddd[date.getDay()] = dddd.format(date).trim();
			data.ddd[date.getDay()]  = ddd.format(date).trim();
			date.setDate(date.getDate() + 1);
		}
		return data;
	},
	/**. '{void setTemplates(array lang)}: Define a propriedade '{templates} quando necessário.**/
	setTemplates: function() {
		const lang = __LANG.value;
		const fail = this.lang === null || this.templates === null || lang.join(",") !== this.lang.join(",");
		if (!fail) return;
		/*-- definir lang, names e unit --*/
		this.lang  = lang;
		this.names = this.getNames(lang);
		for (let i in this.names) {
			let names    = this.names[i].map(function(v,i,a) {return v.replace(/(\W)/g, "\\$1");});
			this.unit[i] = new RegExp(`(${names.join("|")})`);
		}
		/*-- construir templates --*/
		const list = [];
		const date = [];
		const time = [];
		/*-- looping pelos tipos básicos --*/
		for (let i = 0; i < this.base.length; i++) {
			let base  = this.base[i];
			let data = {};
			/*-- definindo flag --*/
			data.flag = Object.assign({}, base.flag);
			data.type = base.type;
			/*-- definindo expressão regular --*/
			let model = base.model.replace(/([^()a-zA-Z])/g, "\\$1");
			for (let x in this.unit)
				model = model.replace(`(${x})`, this.unit[x].source);
			data.re = new RegExp(`^\\s*${model}\\s*$`, "i");
			/*-- adicionando às listas --*/
			list.push(data);
			if (data.type === "date") date.push(data);
			if (data.type === "time") time.push(data);
		}
		/*-- construindo datetime --*/
		for (let i = 0; i < date.length; i++) {
			for (let j = 0; j < time.length; j++) {
				let dateModel = date[i].re.source.replace("\\s*$", "");
				let timeModel = time[j].re.source.replace("^\\s*", "");
				let flagWidth = 0;
				let datetime  = {};
				datetime.re   = new RegExp(`${dateModel}(?:\\ |T|\\,\\ )${timeModel}z?`, "i");
				datetime.type = "datetime";
				datetime.flag = Object.assign({}, date[i].flag);
				for (let k in datetime.flag)
					flagWidth = Math.max(datetime.flag[k], flagWidth);
				for (let k in time[j].flag)
					datetime.flag[k] = time[j].flag[k] + flagWidth;
				list.push(datetime);
			}
		}
		this.templates = list;
		return;
	},
	/**. '{any name(any value, string type, boolean short)}: Retorna o valor numérico ou textual do mês ou dia.
	|Nome|Descrição|
	|value|Se valor numérico, retorna o nome, se valor textual, o número|
	|type|'{month} para avaliar meses e '{day} (padrão) para avaliar dias|
	|short|Sensível apenas no retorno de valor textual que, se verdadeiro, retornará a abreviação|**/
	name: function(value, type, short) {
		this.setTemplates();
		const find = Number.isInteger(Number(value)) ? Number(value) : String(value).normalize().toUpperCase().trim();
		const rest = type === "month" ? 12 : 7;
		const list = type === "month" ? this.names.MMMM.concat(this.names.MMM) : this.names.dddd.concat(this.names.ddd);
		for (let i = 0; i < list.length/2; i++) {
			if (list[i].toUpperCase() === find || list[i+rest].toUpperCase() === find)
				return i + 1;
			if (i+1 === find)
				return list[short === true ? i+rest : i];
		}
		return null;
	},
	/**. '{string digits(integer num, interger n)}: Retorna o número na quantidade mínima de caracteres '{n}.**/
	digits: function(num, n) {
		n   = Math.trunc(Math.abs(n));
		num = Math.trunc(num);
		if (Math.abs(num) >= Math.pow(10, n)) return String(num);
		return (num < 0 ? "-" : "") + (("0").repeat(n) + String(Math.abs(num))).slice(-n);
	},
	/**. '{boolean leap(integer year)}: Informar se o ano definido no argumento é bissexto.**/
	leap: function(year) {
		const y = Math.abs(year);
		return (y%400 === 0 || (y%4 === 0 && y%100 !== 0));
	},
	/**. '{integer idYear(integer year)}: Retorna o ID da data no u{primeiro dia do ano} ('{01/01/YYYY}).**/
	idYear: function(year) {
		/*-- ajuste do ano zero --*/
		const zero = year > 0 ? 365 : 0;
		/*-- ajuste de retorno ao primeiro dia do ano --*/
		const back = year > 0 ? (this.leap(year) ? 365 : 364) : 0;
		/*-- cálculo dos anos --*/
		const d365 = 365*year;
		const y400 = Math.trunc(year/400);
		const y004 = Math.trunc(year/4);
		const y100 = Math.trunc(year/100);
		return zero + d365 + y004 - y100 + y400 - back;
	},
	/**. '{integer idToMonth(integer year, integer month)}: Retorna um identificador exclusivo para o mês.**/
	idToMonth: function(year, month) {return 12*year + (month-1);},
	/**. '{integer idDate(integer year, integer month, integer day)}: Retorna o ID de data no dia.**/
	idDate: function(year, month, day) {
		return this.idYear(year) + (this.dataMonth(year)[month - 1].init - 1) + (day - 1);
	},
	/**. '{number idTime(integer hour, integer minute, integer second, integer millisecond)}: Retorna o ID de tempo para o dia.**/
	idTime: function(hour, minute, second, millisecond) {
		return Math.trunc(1000*(3600*hour + 60*minute + second) + millisecond);
	},
	/**. '{integer idDateTime(interger year, ...)}: Retorna o ID de tempo.**/
	idDateTime: function(year, month, day, hour, minute, second, millisecond) {
		const date = 24*3600000*this.idDate(year, month, day);
		const time = this.idTime(hour, minute, second, millisecond);
		return date + time;
	},
	/**. '{integer idDay(integer year, integer month, integer day)}: Retorna o dia da semana (1-7), de domingo a sábado.**/
	idDay: function(year, month, day) {
		/*-- Domingo, 01/01/2023 = 0 --*/
		const sun = this.idDate(2023, 1, 1);
		const now = this.idDate(year, month, day);
		const gap = (now - sun)%7;
		return (gap < 0 ? gap + 7 : gap) + 1;
	},
	/**. '{array dataMonth(integer year)}: Retorna uma lista de objetos contendo os dados dos meses do ano ´{year}:
	|Propriedade|Tipo|Descrição|
	|month|integer|Mês do ano, de 1 a 12|
	|init|integer|Dia do ano no início do mês (a partir de 1)|
	|last|integer|Dia do ano no término do mês (até 365 ou 366)|
	|length|integer|Número de dias do mês|**/
	dataMonth: function(year) {
		return [31,this.leap(year) ? 29 : 28,31,30,31,30,31,31,30,31,30,31].map(function(v,i,a) {
			return {
				month:  i+1,
				init:   a.slice(0,i+0).reduce(function(sum,v,i,a) {return sum+v;}, 0) + 1,
				last:   a.slice(0,i+1).reduce(function(sum,v,i,a) {return sum+v;}, 0),
				short:  this.names.MMM[i],
				long:   this.names.MMMM[i],
				length: v,
			};
		}, this);
	},
	/**. '{boolean date(object flag)}: Analisa e manipula a i{flag} recebida e, se a data for correta, retorna verdadeiro.**/
	date: function(flag) {
		/*-- mês --*/
		flag.M    = typeof flag.M !== "number" ? Number(this.name(flag.M, "month")) : flag.M;
		flag.MMM  = this.names.MMM[flag.M - 1]
		flag.MMMM = this.names.MMMM[flag.M - 1]
		/*-- dia --*/
		const max = this.dataMonth(flag.Y)[flag.M - 1].length;
		if (flag.D > max) return null;
		flag.d    = this.idDay(flag.Y, flag.M, flag.D);
		flag.ddd  = this.names.ddd[flag.d - 1];
		flag.dddd = this.names.dddd[flag.d - 1];
		/*-- valor --*/
		flag.value = this.idDate(flag.Y, flag.M, flag.D);
		/*-- string/form/locale --*/
		const str = {
			Y: this.digits(flag.Y, 4),
			M: this.digits(flag.M, 2),
			D: this.digits(flag.D, 2)
		};
		if (flag.type === "date" || flag.type === "datetime") {
			flag.string = `${str.Y}-${str.M}-${str.D}`;
			flag.form   = flag.Y < 1 ? null : `${str.Y}-${str.M}-${str.D}`;
			flag.locale = this.locale(flag);
		}
		else if (flag.type === "month") {
			flag.string = `${str.Y}-${str.M}`;
			flag.form   = flag.Y < 1 ? null : `${str.Y}-${str.M}`;
			flag.locale = this.locale(flag, {month: "long", year: "numeric"});
		}
		flag.default = flag.string;
		return true;
	},
	/**. '{boolean month(object flag)}: Analisa e manipula a i{flag} recebida e, se o mês for correto, retorna verdadeiro.**/
	month: function(flag) {
		flag.D = 1;
		return this.date(flag);
	},
	/**. '{boolean week(object flag)}: Analisa e manipula a i{flag} recebida e, se a a{semana}@href{https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Date_and_time_formats#week_strings}target{_blank} for correta, retorna verdadeiro.**/
	week: function(flag) {
		/*-- checando limite --*/
		const year = flag.Y;
		const day  = this.idDay(year, 1, 1);
		const max  = day === 5 || (day === 4 && this.leap(flag.Y)) ? 53 : 52;
		if (flag.w > max) return false;
		/*-- localizando data --*/
		const initY = [year, year, year - 1, year - 1, year - 1, year, year][day-1];
		const initM = [1, 1, 12, 12, 12, 1, 1][day-1];
		const initD = [2, 1, 31, 30, 29, 4, 3][day-1];
		const delta = "d" in flag ? (flag.d - 1) : 0;
		const find  = this.idDate(initY, initM, initD) + 7*(flag.w - 1) + delta
		const date  = this.dateID(find);
		const str   = {
			Y: this.digits(flag.Y, 4),
			w: this.digits(flag.w, 2),
			d: String(date.d === 1 ? 7 : date.d - 1),
		};
		/*-- string/form --*/
		flag.string = `${str.Y}-W${str.w}-${str.d}`;
		flag.form   = flag.Y < 0 ? null : `${str.Y}-W${str.w}`;
		/*-- redefinindo para a data --*/
		flag.Y = date.Y;
		flag.M = date.M;
		flag.D = date.D;
		/*-- locale --*/
		flag.locale = this.locale(flag, {weekday: "long", day: "numeric", month: "long", year: "numeric"});
		return this.date(flag);
	},
	/**. '{boolean time(object flag)}: Analisa e manipula a i{flag} recebida e, se o tempo for correto, retorna verdadeiro.**/
	time: function(flag) {
		/*-- variação de dias --*/
		flag.dD = !("dD" in flag) || flag.dD === "" ? 0 : flag.dD;
		/*-- hora --*/
		if ("H" in flag) {
			flag.H = flag.H%24;
			flag.p = flag.H >= 12 ? "PM": "AM";
			flag.h = flag.H === 0 ? 12 : flag.H - (flag.H < 13 ? 0 : 12);
		}
		else if ("h" in flag) {
			flag.H = flag.h%12 + (flag.p === "PM" ? 12 : 0);
		}
		/*-- segundos, milissegundos --*/
		flag.s  = !("s" in flag) || flag.s  === "" ? 0 : flag.s;
		flag.l  = !("l" in flag) || flag.l  === "" ? 0 : flag.l;
		/*-- value --*/
		if (flag.type === "datetime")
			flag.value = this.idDateTime(flag.Y, flag.M, flag.D, flag.H, flag.m, flag.s, flag.l);
		else
			flag.value = this.idTime(flag.H, flag.m, flag.s, flag.l);
		/*-- string/form/locale -- */
		const str = {
			H: this.digits(flag.H, 2),
			m: this.digits(flag.m, 2),
			s: this.digits(flag.s, 2),
			l: this.digits(flag.l, 3),
		};
		const date   = flag.type === "datetime";
		const form   = !date || flag.Y > 0;
		flag.string  = `${date ? (flag.string + "T") : ""}${str.H}:${str.m}:${str.s}.${str.l}`;
		flag.form    = form ? `${date ? (flag.form + "T") : ""}${str.H}:${str.m}` : null;
		flag.locale  = this.locale(flag);
		flag.default = flag.string;
		return true;
	},
	/**. '{boolean datetime(object flag)}: Analisa e manipula a i{flag} recebida e, se o data/tempo for correto, retorna verdadeiro.**/
	datetime: function(flag) {
		return this.date(flag) && this.time(flag);
	},
	/**. '{object parser(string value, object match)}: Captura e retorna os dados casados ou nulo.**/
	parser: function(value, match) {
		const data = {type: match.type};
		const find = String(value).match(match.re);
		/*-- capturar dados casados --*/
		for (let i in match.flag) {
			let str = find[match.flag[i]] === undefined ? "" : find[match.flag[i]];
			data[i] = str !== "" && isFinite(str) ? Number(str) : str.toUpperCase();
		}
		/*-- eliminando influência de P --*/
		if ("Y" in data)
			data.Y = data.P === "-" ? -data.Y : data.Y;
		/*-- retornando valores --*/
		return this[data.type](data) ? data : null;
	},
	/**. '{object parserDate(object date)}: Retorna a mesma informação do método '{match} mas a partir da instância de '{Date}.**/
	parserDate: function(date) {
		const data = {
			Y: date.getFullYear(),     M: date.getMonth() + 1, D: date.getDate(),
			H: date.getHours(),        m: date.getMinutes(),   s: date.getSeconds(),
			l: date.getMilliseconds(), type: "datetime",       P: date.getFullYear() < 0 ? "-" : ""
		};
		return this.datetime(data) ? data : null;
	},
	/**. '{object match(string value)}: Retorna os dados da informação se '{value} casar com algum i{template}.**/
	match: function(value) {
		this.setTemplates();
		const type = typeof value;
		/*-- para o objeto padrão Date --*/
		if (type === "object" && value instanceof Date)
			return this.parserDate(value);
		/*-- para tempo em forma de string --*/
		if (type === "string" || (type === "object" && value instanceof String)) {
			const string = String(value).trim();
			for (let i = 0; i < this.templates.length; i++) {
				if (this.templates[i].re.test(string))
					return this.parser(string, this.templates[i]);
			}
		}
		return null;
	},
	/**. '{string weekDate(integer year, integer month, integer day)}: Retorna a representação ISO da semana do ano.**/
	weekDate: function(year, month, day) {
		const date = this.dateID(this.idDate(year, month, day));
		const week = [Number(year) - 1, Number(year), Number(year) + 1].map(function(v,i,a) {
			const YYYY = this.digits(v, 4);
			const week = this.match(`${YYYY}-W01`);
			return {value: week.value, YYYY: YYYY};
		}, this);
		/*-- obtendo informações --*/
		let WEEK, YYYY, DAY = [null,"-7","-1","-2","-3","-4","-5","-6"][date.d];
		/*-- última semana do ano anterior --*/
		if (date.value < week[1].value) {
			WEEK = Math.trunc((date.value - week[0].value)/7) + 1;
			YYYY = week[0].YYYY;
		}
		/*-- primeira semana do ano posterior --*/
		else if (date.value >= week[2].value) {
			WEEK = Math.trunc((date.value - week[2].value)/7) + 1;
			YYYY = week[2].YYYY;
		}
		/*-- ano corrente --*/
		else {
			WEEK = Math.trunc((date.value - week[1].value)/7) + 1;
			YYYY = week[1].YYYY;
		}
		return `${YYYY}-W${(WEEK < 10 ? "0" : "") + WEEK}${DAY}`;
	},
	/**. '{object nativeDate(integer Y, integer M...)}: Recebe os dados de data ou tempo e devolve a instância nativa de '{Date}.**/
	nativeDate: function(Y, M, D, H, m, s, l) {
		const date = new Date(Date.UTC(
			1970,
			Number.isInteger(M) ? M - 1 : 0,
			Number.isInteger(D) ? D : 1,
			Number.isInteger(H) ? H : 0,
			Number.isInteger(m) ? m : 0,
			Number.isInteger(s) ? s : 0,
			Number.isInteger(l) ? l : 0
		));
		if (Number.isInteger(Y)) date.setUTCFullYear(Y);
		return isNaN(date.getDate()) ? null : date;
	},
	/**. '{string locale(object flag)}: Recebe a i{flag} e retorna o valor local amparado pelos a{métodos}@href{https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#locale_options}target{_blank} do objeto nativo '{Date}.**/
	locale: function(flag, cfg) {
		const data = typeof cfg === "object" && cfg !== null ? cfg : {};
		const date = this.nativeDate(flag.Y, flag.M, flag.D, flag.H, flag.m, flag.s, flag.l);
		const type = flag.type === "datetime" || flag.type === "time" ? flag.type : "date";
		const attr = {date: "toLocaleDateString", time: "toLocaleTimeString", datetime: "toLocaleString"};
		const none = {
			date: /^(hour|minute|second|dayPeriod|fractionalSecondDigits|timeZoneName|hour12|hourCycle|timeStyle)$/,
			time: /^(day|month|year|weekday|era|calendar|dateStyle)$/
		};
		if (date === null) return flag.string;
		/*-- opções padrão --*/
		data.timeZone = !("timeZone" in data) ? "UTC" : data.timeZone;
		data.era      = !("era" in data) && date.getUTCFullYear() < 1 ? "short" : data.era;
		/*-- apagar configurações desconexas --*/
		if (type !== "datetime") {
			for (let i in data)
				if (none[type].test(i)) delete data[i];
		}
		return date[attr[type]](__LANG.value, data);
	},
	/**. '{integer workDaysYear(integer year, integer month, integer day)}: Retorna os dias úteis desde o dia 2 de janeiro.**/
	workDaysYear: function(year, month, day) {
		const week = this.idDay(year, 1, 2) - 1;
		const init = this.idDate(year, 1, 2);
		const last = this.idDate(year, month, day === 1 && month === 1 ? 2 : day);
		return new Uint8Array(last - init).reduce(function(sum,v,i,a) {
			return sum + ((week+i)%7 === 0 || (week+i)%7 === 6 ? 0 : 1);
		},0);
	},
	/**. '{integer workDays(string date1, string date2)}: Retorna a quantidades de dias úteis entre as datas iniciando 1º de janeiro.**/
	workDays: function(date1, date2) {
		const init = this.match(date1);
		const last = this.match(date2);
		const diff = last.value - init.value;
		const week = (diff < 0 ? last.d : init.d) - 1;
		return new Uint8Array(Math.abs(diff)).reduce(function(sum,v,i,a) {
			return sum + ((week+i)%7 === 0 || (week+i)%7 === 6 ? 0 : 1);
		}, 0);
	},
	/**. '{integer yearID(integer id)}: Retorna o ano a partir do '{id} em u{dias}.**/
	yearID: function(id) {
		if (!Number.isInteger(id)) return null;
		/*-- ano zero --*/
		if (id >=0 && id <= 365) return 0;
		/*-- períodos --*/
		const y001 = 365;
		const y004 =   4*y001 + 1;
		const y100 =  25*y004 - 1;
		const y400 =   4*y100 + 1;
		const last = Math.abs(Math.trunc(id));
		let   init = id < 0 ? 0 : 365;
		/*-- quantidade de períodos --*/
		const n400 = Math.trunc((last-init)/y400); init += y400*n400;
		const n100 = Math.trunc((last-init)/y100); init += y100*n100;
		const n004 = Math.trunc((last-init)/y004); init += y004*n004;
		const n001 = Math.trunc((last-init)/y001); init += y001*n001;
		const rest = init === last ? 0 : 1;
		/*-- retornando a soma dos períodos --*/
		return Math.sign(id) * (400*n400 + 100*n100 + 4*n004 + 1*n001 + rest);
	},
	/**. '{object monthFromID(integer id)}: Retorna os dados do ano '{Y} e mês '{M} a partir do identificador retornado de '{idToMonth}.**/
	monthFromID: function(id) {return {Y: Math.floor(id/12), M: (id%12 + (id < 0 ? 12 : 0))%12 + 1};},
	/**. '{object dateID(integer id)}: Retorna os dados de '{match} para data a partir do '{id} em u{dias} ou nulo.**/
	dateID: function (id) {
		if (!Number.isInteger(id)) return null;
		const year = this.yearID(id);
		const days = id - this.idYear(year) + 1;
		const info = this.dataMonth(year).filter(function(v,i,a) {return days >= v.init && days <= v.last;})[0];
		const date = {
			type: "date",
			P: id < 0 ? "-" : "",
			Y: year,
			M: info.month,
			D: days - info.init + 1
		};
		return this.date(date) ? date : null;
	},
	/**. '{object timeId(integer id)}: Retorna os dados de '{match} para tempo a partir do '{id} em u{segundos}.**/
	timeID: function(id) {
		if (!Number.isInteger(id)) return null;
		const time = {type: "time"};
		const h24  = 24*3600000;
		const data = (h24 + id%h24)%h24;
		time.H     = Math.trunc(data/3600000);
		time.m     = Math.trunc((data - 3600000*time.H)/60000);
		time.s     = Math.trunc((data - 3600000*time.H - 60000*time.m)/1000);
		time.l     = data - 3600000*time.H - 60000*time.m - 1000*time.s;
		time.dD    = Math.trunc(id/h24) + (id < 0 ? -1 : 0);
		return this.time(time) ? time : null;
	},
	/**. '{object dateTimeID(integer id)}: Retorna os dados de '{match} para data/tempo a partir do '{id} em u{segundos}.**/
	dateTimeID: function(id) {
		if (!Number.isInteger(id)) return null;
		const time = this.timeID(id);
		const h24  = 24*3600000;
		const days = Math.trunc((id - id%h24)/h24) + (id < 0 && time.value !== 0 ? -1 : 0);
		const date = this.dateID(days);
		const data = Object.assign({}, date, time);
		data.type  = "datetime";
		data.P     = data.Y < 0 ? "-" : "";
		data.Y     = data.Y;
		return this.datetime(data) ? data : null;
	},
	/**. '{object delta(object flag, string walk)}: Desloca o tempo de '{flag} conforme especificado em '{walk} e retorna uma nova '{flag} redefinida:
	- '{walk} é uma string que define o tempo a ser deslocado;
	- O valor de '{walk} consiste em um número inteiro seguido de espaço e da unidade de tempo a deslocar;
	- As unidades de tempo possíves são '{millisecond, second, minute, hour, day, week, month e year}; e
	- A unidade de tempo pode estar no singular ou plural e não é sensível à caixa.**/
	delta: function(flag, walk) {
		const re   = /^\s*([\-+]?[1-9]\d*)\s+(millisecond|second|minute|hour|day|week|month|year)s?\s*$/i;
		const find = String(walk).match(re);
		const jump = find === null ? null : Number(find[1]);
		const type = find === null ? null : find[2].toLowerCase();
		const hide = "hide" in flag ? flag.hide : 0;
		const date = ["week", "month", "date", "datetime"].indexOf(flag.type) >= 0;
		/*-- apagando dia escondido --*/
		delete flag.hide;
		/*-- analisando possibilidades --*/
		if (type === "millisecond") {
			if (flag.type === "time")
				return this.timeID(flag.value + jump);
			if (flag.type === "datetime")
				return this.dateTimeID(flag.value + jump);
		}
		else if (type === "second") {
			if (flag.type === "time")
				return this.timeID(flag.value + 1000*jump);
			if (flag.type === "datetime")
				return this.dateTimeID(flag.value + 1000*jump);
		}
		else if (type === "minute") {
			if (flag.type === "time")
				return this.timeID(flag.value + 60000*jump);
			if (flag.type === "datetime")
				return this.dateTimeID(flag.value + 60000*jump);
		}
		else if (type === "hour") {
			if (flag.type === "time")
				return this.timeID(flag.value + 3600000*jump);
			if (flag.type === "datetime")
				return this.dateTimeID(flag.value + 3600000*jump);
		}
		else if (type === "day") {
			if (flag.type === "week" || flag.type === "month" || flag.type === "date")
				return this.dateID(flag.value + jump);
			if (flag.type === "datetime")
				return this.dateTimeID(flag.value + 86400000*jump);
		}
		else if (type === "week") {
			if (flag.type === "week" || flag.type === "month" || flag.type === "date")
				return this.dateID(flag.value + 7*jump);
			if (flag.type === "datetime")
				return this.dateTimeID(flag.value + 604800000*jump);
		}
		else if (type === "month" && date) {
			const attr = flag.type === "datetime" ? "idDateTime" : "idDate";
			const ID   = this.idToMonth(flag.Y, flag.M);
			const date = this.monthFromID(ID + jump);
			const last = this.dataMonth(date.Y)[date.M - 1].length;
			const day  = hide > 0 ? (hide > last ? last : hide) : (flag.D > last ? last : flag.D);
			const id   = this[attr](date.Y, date.M, day, flag.H, flag.m, flag.s, flag.l);
			const data = flag.type === "datetime" ? this.dateTimeID(id) : this.dateID(id);
			/*-- reinserindo hide --*/
			if (day < hide || day < flag.D)
				data.hide = day < hide ? hide : flag.D;
			return data;
		}
		else if (type === "year" && date) {
			const attr = flag.type === "datetime" ? "idDateTime" : "idDate";
			const year = flag.Y + jump;
			const last = this.dataMonth(year)[flag.M - 1].length;
			const day  = hide > 0 ? (hide > last ? last : hide) : (flag.D > last ? last : flag.D);
			const id   = this[attr](year, flag.M, day, flag.H, flag.m, flag.s, flag.l);
			const data = flag.type === "datetime" ? this.dateTimeID(id) : this.dateID(id);
			/*-- reinserindo hide --*/
			if (day < hide || day < flag.D)
				data.hide = day < hide ? hide : flag.D;
			return data;
		}
		/*-- devolvendo hide, por não se enquadrar em nenhuma situação --*/
		if (hide > 0) flag.hide = hide;
		return flag;
	},
};