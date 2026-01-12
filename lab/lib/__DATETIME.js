/**
#3 String de Data e Tempo
O objeto `{__DATETIME} estabelece as regras para extrair data e tempo a partir de strings adotando a seguinte nomenclatura:
|Dado|Código|Valores|Código|Valores|Código|Valores|Código|Valores|
|Ano|Y|Número inteiro|YYYY|4 Dígitos ou mais|||||
|Mês|M|1-12 ou 01-12|MM|2 Dígitos 01-12|MMM|Nome curto|MMMM|Nome longo|
|Dia|D|1-31 ou 01-31|DD|2 Dígitos 01-31|||||
|Dia da semana|d|1-7 ou 01-07|dd|2 Dígitos 01-07|ddd|Nome curto|dddd|Nome longo|
|Semana do ano|w|1-53 ou 01-53|ww|2 Dígitos 01-53|||||
|Horas|H|0-24 ou 00-24|HH|2 Dígitos 00-24|h|0-12 ou 00-12|hh|2 Dígitos 00-12|
|Minuto|m|0-59 ou 00-59|mm|2 Dígitos 00-59|||||
|Segundo|s|0-59.999 ou 00-59.999|ss|2 Dígitos 00-59.999|||||
|Período do dia|p|AM ou PM|||||||
|Antes do ano 0|P|"-" ou "+" (opcional)|||||||
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
		Y:   /(\d+)/,                        YYYY: /(\d{4,})/,
		M:   /(0?[1-9]|1[0-2])/,             MM:   /(0[1-9]|1[0-2])/,
		MMM: null,                           MMMM: null,
		D:   /(0?[1-9]|[12]\d|3[01])/,       DD:   /(0[1-9]|[12]\d|3[01])/,
		d:   /(0?[1-7])/,                    dd:   /(0[1-7])/,
		ddd: null,                           dddd: null,
		w:   /(0?[1-9]|[1-4]\d|5[0-3])/,     ww:   /(0[1-9]|[1-4]\d|5[0-3])/,
		H:   /([01]?\d|2[0-4])/,             HH:   /([01]\d|2[0-4])/,
		h:   /(0?[1-9]|1[0-2])/,             hh:   /(0[1-9]|1[0-2])/,
		m:   /([0-5]?\d)/,                   mm:   /([0-5]\d)/,
		s:   /([0-5]?\d|[0-5]?\d\.\d{1,3})/, ss:   /([0-5]\d|[0-5]\d\.\d{1,3})/,
		p:   /([AP]M)/,                       P:   /([+\-]?)/
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
		{flag: {P: 1, w: 3, Y: 2}, type: "week", model: "(P)(YYYY)-W(ww)"},
		/*-- tempo --*/
		{flag: {H: 1, m: 2, s: 3},       type: "time", model: "(H):(mm):(ss)"},
		{flag: {H: 1, m: 2},             type: "time", model: "(H):(mm)"},
		{flag: {h: 1, m: 2, s: 3, p: 4}, type: "time", model: "(h):(mm):(ss) (p)"},
		{flag: {h: 1, m: 2, p: 3},       type: "time", model: "(h):(mm) (p)"},
		//TODO week	WWYYYY	01, 2010 (semana de 01-54)
	],
	/**. '{object getNames(array lang)}: Retorna os nomes dos meses e dias (ddd dddd MMM MMMM) na língua definida no argumento.**/
	getNames: function(lang) {
		const data = {ddd: Array(7), dddd: Array(7), MMM: Array(12), MMMM: Array(12)};
		const date = new Date(1970, 0, 15, 12, 0, 0, 0);
		for (let i = 0; i < 12; i++) {
			data.MMMM[date.getMonth()] = date.toLocaleDateString(lang, {month: "long"}).trim();
			data.MMM[date.getMonth()]  = date.toLocaleDateString(lang, {month: "short"}).trim();
			date.setMonth(date.getMonth() + 1);
		}
		for (let i = 0; i < 7; i++) {
			data.dddd[date.getDay()] = date.toLocaleDateString(lang, {weekday: "long"}).trim();
			data.ddd[date.getDay()]  = date.toLocaleDateString(lang, {weekday: "short"}).trim();
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
		/*-- looping pelos típos básicos --*/
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
	/**. '{string monthName(any value, boolean short)}: Recebe o valor númerico do mês e retorna seu nome, o inverso ou nulo**/
	monthName: function(value, short) {
		this.setTemplates();
		const num = /^\s*(0?[1-9]|1[0-2])\s*$/;
		const str = String(value).toUpperCase();
		/*-- número para texto --*/
		if (num.test(value))
			return this.names[short === true ? "MMM" : "MMMM"][Number(value) - 1];
		/*-- texto para número --*/
		for (let i = 0; i < 12; i++) {
			if (this.names.MMMM[i].toUpperCase() === str || this.names.MMM[i].toUpperCase() === str)
				return String(i + 1);
		}
		return null;
	},
	/**. '{string dayName(any value, boolean short)}: Recebe o valor númerico do dia da semana e retorna seu nome, o inverso ou nulo**/
	dayName: function(value, short) {
		this.setTemplates();
		const num = /^\s*0?[1-7]\s*$/;
		const str = String(value).toUpperCase();
		/*-- número para texto --*/
		if (num.test(value))
			return this.names[short === true ? "ddd" : "dddd"][Number(value) - 1];
		/*-- texto para número --*/
		for (let i = 0; i < 7; i++) {
			if (this.names.dddd[i].toUpperCase() === str || this.names.ddd[i].toUpperCase() === str)
				return String(i + 1);
		}
		return null;
	},
	/**. '{boolean leap(integer year)}: Informar se o ano definido no argumento é bissexto.**/
	leap: function(year) {
		const y = Math.abs(year);
		return (y%400 === 0 || (y%4 === 0 && y%100 !== 0));
	},
	/**. '{boolean date(object flag)}: Analisa e manipula a i{flag} recebida e, se a data for correta, retorna verdadeiro.**/
	date: function(flag) {
		/*-- chencando ano --*/
		flag.P = flag.P === "-" ? "-" : "";
		if (flag.P === "-" && flag.Y >= 0) return false;
		/*-- transformando o mês --*/
		flag.M = typeof flag.M !== "number" ? Number(this.monthName(flag.M)) : flag.M;
		/*-- checando número máximo de dias --*/
		const max = [null,31,(this.leap(flag.Y) ? 29 : 28),31,30,31,30,31,31,30,31,30,31];
		if (flag.D > max[flag.M]) return false;
		/*-- outros valores --*/
		flag.d = this.weekDay(flag.Y, flag.M, flag.D);
		return true;
	},
	/**. '{boolean time(object flag)}: Analisa e manipula a i{flag} recebida e, se o tempo for correto, retorna verdadeiro.**/
	time: function(flag) {
		/*-- manipulando valores --*/
		flag.s = !("s" in flag) || flag.s === "" ? 0 : flag.s;
		if ("H" in flag) {
			flag.H = flag.H%24;
			flag.p = flag.H >= 12 ? "PM": "AM";
			flag.h = flag.H === 0 ? 12 : flag.H - (flag.H < 13 ? 0 : 12);
		}
		else if ("h" in flag) {
			flag.H = flag.h%12 + (flag.p === "PM" ? 12 : 0);
		}
		return true;
	},
	/**. '{boolean month(object flag)}: Analisa e manipula a i{flag} recebida e, se o mês for correto, retorna verdadeiro.**/
	month: function(flag) {
		/*-- chencando ano --*/
		flag.P = flag.P === "-" ? "-" : "";
		if (flag.P === "-" && flag.Y >= 0) return false;
		/*-- transformando o mês --*/
		flag.M = typeof flag.M !== "number" ? Number(this.monthName(flag.M)) : flag.M;
		return true;
	},
	/**. '{boolean week(object flag)}: Analisa e manipula a i{flag} recebida e, se a a{semana}[href="https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Date_and_time_formats#week_strings" target="_blank"] for correta, retorna verdadeiro.**/
	week: function(flag) {
		/*-- chencando ano --*/
		flag.P = flag.P === "-" ? "-" : "";
		if (flag.P === "-" && flag.Y >= 0) return false;
		/*-- checando limite --*/
		const init = this.weekDay(flag.Y, 1, 1);
		const max  = init === 5 || (init === 4 && this.leap(flag.Y)) ? 53 : 52;
		if (flag.w > max) return false;
		return true;
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
		/*-- analisar dados --*/
		if ((data.type === "date" || data.type === "datetime") && !this.date(data))
			return null;
		if ((data.type === "time" || data.type === "datetime") && !this.time(data))
			return null;
		if (data.type === "week" && !this.week(data))
			return null;
		if (data.type === "month" && !this.month(data))
			return null;
		/*-- string e value --*/
		this.string(data);
		this.value(data);




		return data;
	},
	/**. '{object match(string value)}: Retorna o template que casa com '{value}.**/
	match: function(value) {
		this.setTemplates();
		for (let i = 0; i < this.templates.length; i++) {
			if (this.templates[i].re.test(value))
				return this.parser(value, this.templates[i]);
		}
		return null;
	},
	/**. '{integer daysElapsedYear(integer year)}: Retorna número de dias decorridos desde 0000-01-01T00:00:00 (valor 0) até o primeiro dia do ano.**/
	daysElapsedYear: function(year) {
		let   days = year > 0 ? 365 : 0;
		let   back = year > 0 ? (this.leap(year) ? 365 : 364) : 0;
		const y365 = 365*year;
		const y400 = Math.trunc(year/400);
		const y004 = Math.trunc(year/4);
		const y100 = Math.trunc(year/100);
		days += y365 + y004 - y100 + y400;
		return days - back;
	},
	/**. '{integer daysElapsedMonth(integer year, integer month)}: Retorna os dias decorridos desde 0000-01-01T00:00:00 (valor 0) até o primeiro dia do mês.**/
	daysElapsedMonth: function(year, month) {
		const len = [null,0,31,59,90,120,151,181,212,243,273,304,334];
		const gap = month > 2 && this.leap(year) ? 1 : 0;
		return this.daysElapsedYear(year) + len[month] + gap;
	},
	/**. '{integer daysElapsed(integer year, integer month, integer day)}: Retorna os dias decorridos desde 0000-01-01T00:00:00 (valor 0) até o dia.**/
	daysElapsed: function(year, month, day) {
		return this.daysElapsedMonth(year, month) + day - 1;
	},
	/**. '{number timeElapsed(integer hour, integer minute, integer second)}: Retorna a quantidade total de segundos.**/
	timeElapsed: function(hour, minute, second) {
		return 3600*hour + 60*minute + second;
	},
	/**. '{integer dateTimeElapsed(interger year, ...)}: Retorna os segundos decorridos de 0000-01-01T00:00:00 (valor 0) até a hora.**/
	dateTimeElapsed: function(year, month, day, hour, minute, second) {
		return 24*3600*this.daysElapsed(year, month, day) + this.timeElapsed(hour, minute, second);
	},
	/**. '{integer daysElapsedWeek(interger year, integer week)}: Retorna os dias decorridos desde 0000-01-01T00:00:00 (valor 0) até a semana conforme a{ISO 8601}[href="https://en.wikipedia.org/wiki/ISO_8601#Week_dates"] (primeira segunda-feira útil do ano)**/
	daysElapsedWeek: function(year, week) {
		const days = this.daysElapsed(year, 1, 1);
		const day  = this.weekDay(year, 1, 1);


//TODO

		const walk = [null,1,0,6,5,4,3,2][day];
		return days + walk + (7*(week - 1));
	},
	/**. '{integer weekDay(integer year, integer month, integer day)}: Retorna o o dia da semana (1-7).**/
	weekDay: function(year, month, day) {
		/*-- Domingo, 01/01/2023 = 0 --*/
		const sun = this.daysElapsedYear(2023);
		const now = this.daysElapsed(year, month, day);
		const gap = (now - sun)%7;
		return (gap < 0 ? 7 : 0) + gap + 1;
	},
	/**. '{string string(object flag)}: Analisa e manipula a i{flag} recebida para definir o formato textual.**/
	string: function(flag) {
		flag.string = "";
		if (flag.type === "date" || flag.type === "datetime") {
			const len = flag.Y < 10 ? 3 : (flag.Y < 100 ? 2 : (flag.Y < 1000 ? 1 : 0));
			flag.string += flag.P + String("0").repeat(len) + String(flag.Y) + "-";
			flag.string += (flag.M < 10 ? "0" : "") + String(flag.M) + "-";
			flag.string += (flag.D < 10 ? "0" : "") + String(flag.D);
			flag.string += flag.type === "datetime" ? "T" : "";
		}
		if (flag.type === "time" || flag.type === "datetime") {
			const ss  = String(flag.s).split(".");
			const int = Number(ss[0]);
			const dec = ss.length === 1 ? "000" : ss[1] + String("0").repeat(3 - ss[1].length);
			flag.string += (flag.H < 10 ? "0" : "") + String(flag.H) + ":";
			flag.string += (flag.m < 10 ? "0" : "") + String(flag.m) + ":";
			flag.string += (int < 10 ? "0"    : "") + String(int)    + "." + dec;
		}
		if (flag.type === "week") {
			const len = flag.Y < 10 ? 3 : (flag.Y < 100 ? 2 : (flag.Y < 1000 ? 1 : 0));
			flag.string += flag.P + String("0").repeat(len) + String(flag.Y) + "-W";
			flag.string += (flag.w < 10 ? "0" : "") + String(flag.w);
		}
		else if (flag.type === "month") {
			const len = flag.Y < 10 ? 3 : (flag.Y < 100 ? 2 : (flag.Y < 1000 ? 1 : 0));
			flag.string += flag.P + String("0").repeat(len) + String(flag.Y) + "-";
			flag.string += (flag.M < 10 ? "0" : "") + String(flag.M);
		}




		return flag.string;
	},


	/**. '{integer value(object flag)}: Analisa e manipula a i{flag} recebida para definir o valor.**/
	value: function(flag) {
		if (flag.type === "datetime")
			flag.value = this.dateTimeElapsed(flag.P === "-" ? -flag.Y : flag.Y, flag.M, flag.D, flag.H, flag.m, flag.s);
		else if (flag.type === "date")
			flag.value = this.daysElapsed(flag.P === "-" ? -flag.Y : flag.Y, flag.M, flag.D);
		else if (flag.type === "time")
			flag.value = this.timeElapsed(flag.H, flag.m, flag.s);
		else if (flag.type === "month")
			flag.value = this.daysElapsedMonth(flag.P === "-" ? -flag.Y : flag.Y, flag.M);
		return flag.value;
	},





















	/**. '{string form(object data)}: Retorna uma string para formulário a partir do resultado do método '{check}.**/
	form: function(data) {
		if (typeof data !== "object")    return "";
		if ("P" in data && data.P < 0)   return "";
		if ("Y" in data && (data.Y < 1)) return "";
		if (data.type === "date") {
			const YYYY = this.string(data.Y, "YYYY");
			const MM   = this.string(data.M, "MM");
			const DD   = this.string(data.D, "DD");
			return `${YYYY}-${MM}-${DD}`;
		}
		if (data.type === "month") {
			const YYYY = this.string(data.Y, "YYYY");
			const MM   = this.string(data.M, "MM");
			return `${YYYY}-${MM}`;
		}
		if (data.type === "week") {
			const YYYY = this.string(data.Y, "YYYY");
			const ww   = this.string(data.w, "ww");
			return `${YYYY}-W${ww}`;
		}
		if (data.type === "time") {
			const HH = this.string(data.H, "HH");
			const mm = this.string(data.m, "mm");
			return `${HH}:${mm}`;
		}
		if (data.type === "datetime") {
			const copy = {};
			for (let i in data) copy[i] = data[i];
			copy.type  = "date";
			const date = this.form(copy);
			copy.type  = "time";
			const time = this.form(copy);
			return [date,time].join("T");
		}
		return null;
	},
	/**. '{object check(string input)}: Testa o valor de entrada ('{input}) como data, tempo, mês ou semana. Retonará nulo, se incorreto, ou um objeto contendo as unidades de data ou tempo**/
	check: function(input) {
		this.update();
		input = String(input).trim();
		const find  = /^(Y+|D+|M+|w+|d+|H+|h+|m+|s+|p|P)$/g;
		/*-- checando as expressões regulares --*/
		for (let i = 0; i < this.templates.length; i++) {
			let item = this.templates[i];
			if (item.re.test(input)) {
				let data = {type: item.type, model: item.model, re: item.re};
				for (let j in item) {
					if (!(j in data)) {
						let info = input.replace(item.re, item[j]);
						data[j]  = this.value(info, j);
					}
				}

				/*-- checando o dia do mês --*/
				if (data.type === "date" && data.D > this.max(data.Y, data.M)) {
					continue;
				}
				/*-- checando a semana <https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Date_and_time_formats#week_strings> --*/
				if (data.type === "week") {
					const base = new __Week(data.Y, 1, 1);
					const init = base.weekDay;
					const leap = base.leap;
					const max  = init === 5 || (init === 4 && leap) ? 53 : 52;
					if (data.w > max) continue;
				}
				/*-- checando tempo --*/
				if (data.type === "time") {
					/*-- 12 horas --*/
					if ("h" in data) {
						data.H = data.h%12 + (data.p === "PM" ? 12 : 0);
					}
					/*-- 24 horas --*/
					else if ("H" in data) {
						data.H = data.H%24;
						data.p = data.H >= 12 ? "PM" : "AM";
						data.h = data.H === 0 ? 12 : data.H - (data.H < 13 ? 0 : 12);
					}
					/*-- sem o segundo --*/
					if (!("s" in data)) data.s = 0;
				}
				/*-- retornar --*/
				data.iso  = this.iso(data);
				data.form = this.form(data);
				return data;
			}
		}
		return null;
	},
	/**. '{object test(string input)}: Testa o valor de entrada como u{data e tempo} ou o retorna o resultado do método '{check}.**/
	ttest: function(input) {
		const find = /([0-9][0-9])(T|\,|\ |\,\ )(\d?\d\:[0-5][0-9])/;
		/*-- testar tempo ou data --*/
		if (!find.test(input)) return this.check(input);
		/*-- testar tempo e data --*/
		//FIXME Date() não está contemplado?
		const list = input.replace(find, "$1\n$2\n$3").split("\n");
		const date = this.check(list[0]);
		const time = this.check(list[2]);
		const join = list[1];
		/*-- não é datetime --*/
		if (date === null || time === null || date.type !== "date" || time.type !== "time")
			return null;
		/*-- é datetime --*/
		const dt = {};
		for (let i in date) dt[i] = date[i];
		for (let i in time) dt[i] = time[i];
		dt.type  = "datetime";
		dt.model = `${date.model}${join}${time.model}`;
		dt.iso   = this.iso(dt);
		dt.form  = this.form(dt);
		dt.re    = null;
		return dt;
	},
	/**. '{object toObject(string input)}: Testa o valor de entrada e retorna os atributos do tempo.**/
	toObject: function(input) {
		const data = {type: null};
		const info = {M: "month", D: "day", d: "weekDay", w: "week", H: "hour", m: "minute", s: "second", iso: "iso", type: "type"};
		const time = this.test(input);
		if (time !== null) {
			for (let i in info) {
				if (i in time) data[info[i]] = time[i];
			}
			if ("Y" in time) data.year  = time.P * time.Y;
		}
		return data;
	},
};