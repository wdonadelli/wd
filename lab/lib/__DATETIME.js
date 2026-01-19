/**
#3 String de Data e Tempo
O objeto `{__DATETIME} estabelece as regras para extrair data e tempo a partir de strings adotando a seguinte nomenclatura:
|Sigla|Descrição|Observação|
|Y|Ano quantidade de dígitos livre||
|YYYY|Ano com 4 Dígitos ou mais||
|M|Mês de 1-12 ou 01-12||
|MM|Mês com 2 Dígitos 01-12||
|MMM|Nome curto do mês||
|MMMM|Nome longo do mês||
|D|Dia de 1-31 ou 01-31|O valor deve corresponder ao mês e ano|
|DD|Dia com 2 Dígitos 01-31|Ver observação anterior|
|d|Dia da semana de 1-7 ou 01-07 (domingo à sábado)|Quando se trata de semana ISO, a semana começa na segunda (1)|
|dd|Dia da semana com 2 Dígitos 01-07|Ver observaçao anterior|
|ddd|Nome curto do dia da semana||
|dddd|Nome longo do dia da semana||
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
|p|Período do dia AM ou PM||
|P|Direção do tempo, se antes (-) ou depois (+) do ano 0|Opcional para anos a partir de zero|
Todos os caracteres alfabéticos não são sensíveis à altura da caixa.**/
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
		{flag: {P: 1, w: 3, Y: 2},       type: "week", model: "(P)(YYYY)-W(ww)"},
		{flag: {P: 1, w: 3, Y: 2},       type: "week", model: "(P)(YYYY)W(ww)"},
		{flag: {P: 1, w: 3, Y: 2, d: 4}, type: "week", model: "(P)(YYYY)-W(ww)-(d)"},
		{flag: {P: 1, w: 3, Y: 2, d: 4}, type: "week", model: "(P)(YYYY)W(ww)(d)"},
		{flag: {P: 3, w: 2, Y: 4, d: 1}, type: "week", model: "(ddd), (w) (P)(YYYY)"},
		{flag: {P: 3, w: 2, Y: 4, d: 1}, type: "week", model: "(dddd), (w) (P)(YYYY)"},
		/*-- tempo --*/
		{flag: {H: 1, m: 2, s: 3},       type: "time", model: "(H):(mm):(ss)"},
		{flag: {H: 1, m: 2},             type: "time", model: "(H):(mm)"},
		{flag: {h: 1, m: 2, s: 3, p: 4}, type: "time", model: "(h):(mm):(ss) (p)"},
		{flag: {h: 1, m: 2, p: 3},       type: "time", model: "(h):(mm) (p)"},
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
		flag.P = flag.P === "-" ? (flag.Y === 0 ? "" : "-") : "";
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
		flag.P = flag.P === "-" ? (flag.Y === 0 ? "" : "-") : "";
		/*-- transformando o mês --*/
		flag.M = typeof flag.M !== "number" ? Number(this.monthName(flag.M)) : flag.M;
		return true;
	},
	/**. '{boolean week(object flag)}: Analisa e manipula a i{flag} recebida e, se a a{semana}[href="https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Date_and_time_formats#week_strings" target="_blank"] for correta, retorna verdadeiro.**/
	week: function(flag) {
		/*-- chencando ano --*/
		flag.P = flag.P === "-" ? (flag.Y === 0 ? "" : "-") : "";
		/*-- checando limite --*/
		const init = this.weekDay(flag.Y, 1, 1);
		const max  = init === 5 || (init === 4 && this.leap(flag.Y)) ? 53 : 52;
		if (flag.w > max) return false;
		/*-- acertando o dia da semana (conflito domingo x segunda) --*/
		if (!("d" in flag)) {
			flag.d = 2;
		} else if (typeof flag.d === "number") {
			flag.d = flag.d === 7 ? 1 : flag.d + 1;
		} else {
			flag.d = Number(this.dayName(flag.d));
		}
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
		/*-- string, value, form --*/
		this.string(data);
		this.value(data);
		this.form(data);
		data.default = data.string;
		return data;
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
	/**. '{object parserDate(object date)}: Retorna a mesma informação do método '{match} mas a partir da instância de '{Date}.**/
	parserDate: function(date) {
		const data = {
			P: date.getFullYear() < 0 ? "-" : "",
			Y: Math.abs(date.getFullYear()), M: date.getMonth() + 1, D: date.getDate(),
			H: date.getHours(),              m: date.getMinutes(),   s: date.getSeconds()+(date.getMilliseconds()/1000),
			type: "datetime",
		};
		this.date(data);
		this.time(data);
		this.string(data);
		this.value(data);
		this.form(data);
		data.default = data.string;
		return data;
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
		return Number((3600*hour + 60*minute + second).toFixed(3));
	},
	/**. '{integer dateTimeElapsed(interger year, ...)}: Retorna os segundos decorridos de 0000-01-01T00:00:00 (valor 0) até a hora.**/
	dateTimeElapsed: function(year, month, day, hour, minute, second) {
		const date = 24*3600*this.daysElapsed(year, month, day);
		const time = this.timeElapsed(hour, minute, second);
		return Number((date + time).toFixed(3));
	},
	/**. '{integer daysElapsedWeek(interger year, integer week, integer day)}: Retorna os dias decorridos desde 0000-01-01T00:00:00 (valor 0) até a semana conforme a{ISO 8601}[href="https://en.wikipedia.org/wiki/ISO_8601#Week_dates"], ou seja, a semana começa na segunda-feira (1) e termina no domingo (7). strong{ATENÇÃO}: O argumento opcional '{day} é o dia da semana que começa no domingo (1) e termina no sábado (7) e seu valor padrão é 2, não obedecendo a regra ISO para fins do método.**/
	daysElapsedWeek: function(year, week, day) {
		const days = this.daysElapsed(year, 1, 1);
		const init = this.weekDay(year, 1, 1);
		const mon  = [null,+1,+0,-1,-2,-3,+3,+2][init];
		const walk = [null,+6,+0,+1,+2,+3,+4,+5][typeof day === "number" ? day : 2];
		return days + mon + (7*(week - 1)) + walk;
	},
	/**. '{integer weekDay(integer year, integer month, integer day)}: Retorna o dia da semana (1-7), de domingo a sábado.**/
	weekDay: function(year, month, day) {
		/*-- Domingo, 01/01/2023 = 0 --*/
		const sun = this.daysElapsedYear(2023);
		const now = this.daysElapsed(year, month, day);
		const gap = (now - sun)%7;
		return (gap < 0 ? 7 : 0) + gap + 1;
	},
	/**. '{integer workDaysYear(integer year, integer month, integer day)}: Retorna os dias úteis decorridos desde o dia 2 de janeiro do ano.**/
	workDaysYear: function(year, month, day) {
		const week = this.weekDay(year, 1, 2);
		const init = this.daysElapsed(year, 1, 2);
		const last = this.daysElapsed(year, month, day === 1 && month === 1 ? 2 : day);
		const sun1 = init + [null,0,6,5,4,3,2,1][week];
		const sat1 = init + [null,6,5,4,3,2,1,0][week];
		const nsun = Math.ceil((last - sun1)/7);
		const nsat = Math.ceil((last - sat1)/7);
		return (last - init) - (nsun + nsat)
	},

	/**. '{object numberDate(integer value)}: Retorna os dados de '{match} para data a partir dos dias decorridos '{value}.**/
	numberDate: function(value) {
		const date = {P: value < 0 ? "-" : "", type: "date", D: Math.abs(value)};
		/*-- anos (zero e diferente de zero) -------------------------------------*/
		if (value >= 0 && value < 366) {
			date.Y = 0;
			date.D = date.D+1;
		}
		/*-- anos maiores que zero, desconta-se os dias já completos e se tira 1 porque não conta o dia ativo, só os completos --*/
		else {
			const init = (value > 0 ? -365 : 0) - 1;
			let   days = date.D + init;
			/*-- constantes de captura --*/
			const d001 = 365;
			const d004 =  4*d001 + 1;
			const d100 = 25*d004 - 1;
			const d400 =  4*d100 + 1;
			/*-- bloco de 400 anos --*/
			const y400 = Math.trunc(days/d400);
			days -= y400 * d400;
			/*-- bloco de 100 anos --*/
			const y100 = Math.trunc(days/d100);
			days -= y100 * d100;
			/*-- bloco de 4 anos --*/
			const y004 = Math.trunc(days/d004);
			days -= y004 * d004;
			/*-- bloco de 1 ano --*/
			const y001 = Math.trunc(days/d001);
			days -= y001 * d001;
			/*-- definindo o ano --*/
			date.Y = ((400*y400) + (100*y100) + (4*y004) + (1*y001) + 1);
			date.D = days+1;
		}
		/*-- meses ---------------------------------------------------------------*/
		const leap = this.leap(date.Y);
		const d012 = [31,leap ? 29 : 28,31,30,31,30,31,31,30,31,30,31];
		const line = value < 0 ? d012.reverse() : d012;
		/*-- percorrendo os meses até encerrar days --*/
		date.M = value < 0 ? 12 : 1;
		let m = -1;
		while (date.D > line[++m]) {
			date.M = value < 0 ? (12 - m - 1) : (m + 2);
			date.D -= line[m];
		}
		/*-- dias ----------------------------------------------------------------*/
		date.D = value < 0 ? (d012[date.M - 1] - date.D) + 1 : date.D;
		/*-- aprimorando dados e retornando --------------------------------------*/
		this.date(date);
		this.value(date);
		this.string(date);
		return date;
	},
	/**. '{object numberTime(integer value)}: Retorna os dados de '{match} para tempo a partir dos segundos decorridos '{value}.**/
	numberTime: function(value) {
		const time = {type: "time"};
		const h24  = 24*3600;
		const data = (h24 + value%h24)%h24;
		time.H     = Math.trunc(data/3600);
		time.m     = Math.trunc((data - 3600*time.H)/60);
		time.s     = Number((data - 60*time.m - 3600*time.H).toFixed(3));
		this.time(time);
		this.value(time);
		this.string(time);
		return time;
	},
	/**. '{object numberDateTime(integer value)}: Retorna os dados de '{match} para data/tempo a partir dos segundos decorridos '{value}.**/
	numberDateTime: function(value) {
		const time = this.numberTime(value);
		const h24  = 24*3600;
		const days = Math.trunc((value - value%h24)/h24) + (value < 0 && time.value !== 0 ? -1 : 0);
		const date = this.numberDate(days);
		const data = Object.assign({}, date, time);
		data.type = "datetime";
		this.date(data);
		this.time(data);
		this.value(data);
		this.string(data);
		return data;
		//FIXME no value fixar para 3 casas decimais
		//FIXME dá errado para negativo
		/*const day  = 24*3600;
		const sec  = value%day;
		const days = Math.trunc((value - sec)/day);
		const date = this.daysToDate(days + (value < 0 && sec !== 0 ? -1 : 0)	);
		const time = this.secondsToTime(sec);
		return [date[0],date[1],date[2],time[0],time[1],time[2]];*/
	},










	/**. '{string string(object flag)}: Analisa e manipula a i{flag} recebida para definir o formato textual.**/
	string: function(flag) {
		flag.string  = "";
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
			flag.string += "-" + String(flag.d === 1 ? 7 : flag.d - 1);
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
		else if (flag.type === "week")
			flag.value = this.daysElapsedWeek(flag.P === "-" ? -flag.Y : flag.Y, flag.w, flag.d);
		return flag.value;
	},
	/**. '{string form(object flag)}: Analisa e manipula a i{flag} recebida para definir o valor para formulário HTML.**/
	form: function(flag) {
		if (flag.P === "-" || flag.Y === 0)
			flag.form = null;
		else if (flag.type === "time" || flag.type === "datetime")
			flag.form = flag.string.replace(/\:\d\d\.\d\d\d$/, "");
		else if (flag.type === "week")
			flag.form = flag.string.replace(/\-\d$/, "");
		else
			flag.form = flag.string;
		return flag;
	},
};