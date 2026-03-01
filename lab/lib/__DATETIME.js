/**
#3 String de Data e Tempo
O objeto `{__DATETIME} estabelece as regras para extrair data e tempo a partir de strings adotando a seguinte nomenclatura:
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
- Formatos de semana obedecem à a{ISO 8601}[href="https://en.wikipedia.org/wiki/ISO_8601#Week_dates"], ou seja, começa na segunda-feira (1) e termina no domingo (7).
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
		/*-- obter o nome dos meses (janeiro = 0) --*/
		for (let i = 0; i < 12; i++) {
			data.MMMM[date.getMonth()] = date.toLocaleDateString(lang, {month: "long"}).trim();
			data.MMM[date.getMonth()]  = date.toLocaleDateString(lang, {month: "short"}).trim();
			date.setMonth(date.getMonth() + 1);
		}
		/*-- obter o nome dos dias da semana (domingo = 0) --*/
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
		const find = String(value).toUpperCase().trim();
		/*-- número --*/
		if ((/^(0?[1-9]|1[0-2])$/).test(find))
			return this.names[short === true ? "MMM" : "MMMM"][Number(find) - 1];
		/*-- nome --*/
		const list = this.names.MMMM.concat(this.names.MMM).map(function(v,i,a) {return v.toUpperCase();});
		return list.indexOf(find) < 0 ? null : list.indexOf(find)%12 + 1;
	},
	/**. '{string dayName(any value, boolean short)}: Recebe o valor númerico do dia da semana e retorna seu nome, o inverso ou nulo**/
	dayName: function(value, short) {
		this.setTemplates();
		const find = String(value).toUpperCase().trim();
		/*-- número --*/
		if ((/^0?[1-7]$/).test(find))
			return this.names[short === true ? "ddd" : "dddd"][Number(find) - 1];
		/*-- nome --*/
		const list = this.names.dddd.concat(this.names.ddd).map(function(v,i,a) {return v.toUpperCase();});
		return list.indexOf(find) < 0 ? null : list.indexOf(find)%7 + 1;
	},
	/**. '{boolean leap(integer year)}: Informar se o ano definido no argumento é bissexto.**/
	leap: function(year) {
		const y = Math.abs(year);
		return (y%400 === 0 || (y%4 === 0 && y%100 !== 0));
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
		/*-- chencando ano --*/
		flag.P = flag.P === "-" ? (flag.Y === 0 ? "" : "-") : "";
		/*-- transformando o mês --*/
		flag.M = typeof flag.M !== "number" ? Number(this.monthName(flag.M)) : flag.M;
		/*-- checando número máximo de dias --------------------------------------*/
		if (flag.D > this.dataMonth(flag.Y)[flag.M - 1].length) return null;
		/*-- dia da semana --*/
		flag.d = this.idDay(flag.P === "-" ? -flag.Y : flag.Y, flag.M, flag.D);
		/*-- nomes --*/
		flag.names = {
			MMM: this.names.MMM[flag.M - 1], MMMM: this.names.MMMM[flag.M - 1],
			ddd: this.names.ddd[flag.d - 1], dddd: this.names.dddd[flag.d - 1]
		}
		/*-- value --*/
		flag.value = this.idDate(flag.P === "-" ? -flag.Y : flag.Y, flag.M, flag.D);
		/*-- string --*/
		const width  = flag.Y < 10 ? 3 : (flag.Y < 100 ? 2 : (flag.Y < 1000 ? 1 : 0));
		const week   = flag.type === "week";
		flag.string  = flag.P + String("0").repeat(width) + String(flag.Y);
		if (flag.type === "week") {
			flag.string += "-W" + (flag.w < 10 ? "0" : "") + String(flag.w);
			flag.string += "-" + String(flag.d === 1 ? 7 : flag.d - 1);
		} else {
			flag.string += "-" + (flag.M < 10 ? "0" : "") + String(flag.M);
		}
		if (flag.type === "date" || flag.type === "datetime") {
			flag.string += "-" + (flag.D < 10 ? "0" : "") + String(flag.D);
		}
		/*-- form --*/
		flag.form = flag.P === "-" || flag.Y < 1 ? null : (flag.type === "week" ? flag.string.replace(/\-\d$/, "") : flag.string);
		return true;
	},
	/**. '{boolean month(object flag)}: Analisa e manipula a i{flag} recebida e, se o mês for correto, retorna verdadeiro.**/
	month: function(flag) {
		flag.D = 1;
		return this.date(flag);
	},
	/**. '{boolean week(object flag)}: Analisa e manipula a i{flag} recebida e, se a a{semana}[href="https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Date_and_time_formats#week_strings" target="_blank"] for correta, retorna verdadeiro.**/
	week: function(flag) {
		/*-- checando limite --*/
		const day = this.idDay(flag.Y, 1, 1);
		const max  = day === 5 || (day === 4 && this.leap(flag.Y)) ? 53 : 52;
		if (flag.w > max) return false;
		/*-- localizando data --*/
		const initY = [flag.Y, flag.Y, flag.Y - 1, flag.Y - 1, flag.Y - 1, flag.Y, flag.Y][day-1];
		const initM = [1, 1, 12, 12, 12, 1, 1][day-1];
		const initD = [2, 1, 31, 30, 29, 4, 3][day-1];
		const delta = "d" in flag ? (flag.d - 1) : 0;
		const find  = this.idDate(initY, initM, initD) + 7*(flag.w - 1) + delta
		const date  = this.dateID(find);
		flag.Y = date.Y;
		flag.M = date.M;
		flag.D = date.D;
		return this.date(flag);
	},
	/**. '{boolean time(object flag)}: Analisa e manipula a i{flag} recebida e, se o tempo for correto, retorna verdadeiro.**/
	time: function(flag) {
		/*-- manipulando valores --*/
		flag.s  = !("s" in flag)  || flag.s  === "" ? 0 : flag.s;
		flag.l  = !("l" in flag)  || flag.l  === "" ? 0 : flag.l;
		flag.dD = !("dD" in flag) || flag.dD === "" ? 0 : flag.dD;
		if ("H" in flag) {
			flag.H = flag.H%24;
			flag.p = flag.H >= 12 ? "PM": "AM";
			flag.h = flag.H === 0 ? 12 : flag.H - (flag.H < 13 ? 0 : 12);
		}
		else if ("h" in flag) {
			flag.H = flag.h%12 + (flag.p === "PM" ? 12 : 0);
		}
		/*-- value --*/
		if (flag.type === "datetime") {
			flag.value = this.idDateTime(flag.P === "-" ? -flag.Y : flag.Y, flag.M, flag.D, flag.H, flag.m, flag.s, flag.l);
		} else {
			flag.value = this.idTime(flag.H, flag.m, flag.s, flag.l);
		}
		/*-- string -- */
		const width  = flag.l < 10 ? 2 : (flag.l < 100 ? 1 : 0);
		flag.string  = flag.type === "datetime" ? (flag.string + "T") : "";
		flag.string += (flag.H < 10 ?  "0" : "") + String(flag.H) + ":";
		flag.string += (flag.m < 10 ?  "0" : "") + String(flag.m) + ":";
		flag.string += (flag.s < 10 ?  "0" : "") + String(flag.s) + ".";
		flag.string += String("0").repeat(width) + String(flag.l);
		/*-- form --*/
		flag.form = flag.form === null ? null : flag.string.replace(/\:\d\d\.\d\d\d$/, "");
		return true;
	},
	/**. '{object dateTimeAdjustment(object data)}: Recebe os dados básicos, checa, detalha e o retorna ou nulo.**/
	dateTimeAdjustment: function(data) {
		/*-- checagem (date deve vir antes de time por causa do datetime --*/
		if ((data.type === "date" || data.type === "datetime") && !this.date(data))
			return null;
		if ((data.type === "time" || data.type === "datetime") && !this.time(data))
			return null;
		if (data.type === "week" && !this.week(data))
			return null;
		if (data.type === "month" && !this.month(data))
			return null;
		/*-- complemento --*/
		data.locale  = this.locale(data);
		data.default = data.string;
		return data;
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
		return this.dateTimeAdjustment(data);
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
			Y: Math.abs(date.getFullYear()), M: date.getMonth() + 1, D: date.getDate(),
			H: date.getHours(),              m: date.getMinutes(),   s: date.getSeconds(),
			l: date.getMilliseconds(),    type: "datetime",          P: date.getFullYear() < 0 ? "-" : ""
		};
		return this.dateTimeAdjustment(data);
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
	/**. '{integer idDate(integer year, integer month, integer day)}: Retorna o ID de data no dia.**/
	idDate: function(year, month, day) {
		return this.idYear(year) + (this.dataMonth(year)[month - 1].init - 1) + (day - 1);
	},
	/**. '{number idTime(integer hour, integer minute, integer second, integer millisecond)}: Retorna o ID de tempo para um dia.**/
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
	/**. '{string locale(object flag)}: Recebe a i{flag} e retorna o valor local amparado pelos métodos do objeto nativo '{Date}.**/
	locale: function(flag) {
		if (flag === null || typeof flag !== "object") return "";
		const zone = {timeZone: "UTC"};
		const date = new Date(Date.UTC(
			"Y" in flag ? flag.Y : 1970,
			"M" in flag ? flag.M - 1 : 0,
			"D" in flag ? flag.D : 1,
			"H" in flag ? flag.H : 0,
			"m" in flag ? flag.m : 0,
			"s" in flag ? flag.s : 0,
			"l" in flag ? flag.l : 0
		));
		if (flag.type === "time")
			return date.toLocaleTimeString(__LANG.value, zone);
		if (flag.type === "date" || flag.type === "week" || flag.type === "month")
			return date.toLocaleDateString(__LANG.value, zone);
		return date.toLocaleString(__LANG.value, zone)
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
	/**. '{integer workDays(string date1, string date2)}: Retorna a quantidades de dias úteis entre as data inclindo 1º de janeiro.**/
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
	/**. '{object dateID(integer id)}: Retorna os dados de '{match} para data a partir do '{id} em u{dias} ou nulo.**/
	dateID: function (id) {
		if (!Number.isInteger(id)) return null;
		const year = this.yearID(id);
		const days = id - this.idYear(year) + 1;
		const info = this.dataMonth(year).filter(function(v,i,a) {return days >= v.init && days <= v.last;})[0];
		return this.dateTimeAdjustment({
			type: "date",
			P: id < 0 ? "-" : "",
			Y: Math.abs(year),
			M: info.month,
			D: days - info.init + 1
		});
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
		return this.dateTimeAdjustment(time);
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
		return this.dateTimeAdjustment(data);
	},
	/**. '{void random(string type)}: Faz teste nos métodos que traduzem números em tempo '{type}.**/
	random: function(type) {
		const conf = {
			time:     {bit: 16, name: "timeID"},
			date:     {bit: 16, name: "dateID"},
			datetime: {bit: 32, name: "dateTimeID"},
		};
		const attr = type in conf ? conf[type] : conf.datetime;
		const list = __MATH.crypto(attr.bit, 10000, false);
		for (let i = 0; i < list.length; i++) {
			/*-- obter e checar de id para string --*/
			let fromInt = this[attr.name](list[i]);
			if (fromInt === null)
				throw new Error(`${attr.name} Error: ${list[i]} > null (${i})`);
			/*-- retornar de string para id --*/
			let fromStr = this.match(fromInt.string);
			if (fromStr === null)
				throw new Error(`${attr.name} Error: ${list[i]} > ${fromInt.string} > null (${i})`);
			/*-- comparar a coerência --*/
			if (list[i] !== fromStr.value)
				throw new Error(`${attr.name} Error: ${list[i]} > ${fromInt.string} > ${fromStr.value} (${fromStr.value - list[i]})`);
		}
		return;
	},
	/**. '{void linear(integer min, integer max)}: Teste a linearidade do dia da semana e do valor da escala.**/
	linear: function(min, max) {
		const days = [0,31,28,31,30,31,30,31,31,30,31,30,31];
		let base   = this.dateID(min);
		let value  = base.value;
		let string = base.string;
		let day    = base.d;
		for (let i = min; i < max; i++) {
			days[2] = this.leap(base.Y) ? 29 : 28;
			/*-- adiantando um dia --*/
			base.D = base.D === days[base.M] ? 1 : base.D+1;
			base.M = base.D === 1 ? (base.M === 12 ? 1 : base.M + 1) : base.M;
			base.Y = base.D === 1 && base.M === 1 ? base.Y + (base.P === "-" ? -1 : 1) : base.Y;
			this.date(base);
			this.value(base);
			this.string(base);
			/*-- checando continuidade --*/
			if (base.value - value !== 1)
				throw new Error(`value Error: ${string} > ${value} / ${base.string} > ${base.value}`);
			if (base.d === 1 ? day !== 7 : (base.d - day !== 1))
				throw new Error(`day Error: ${string} > ${day} / ${base.string} > ${base.d}`);
			/*-- redefinindo valores --*/
			value  = base.value;
			string = base.string;
			day    = base.d;
		}
		return;
	},



















	/**. '{object deltaTime(number value)}: Retona o segundo '{s}, o minuto '{m}, a hora '{H} e a variação diária '{dD} a partir de '{value}.**/
	deltaTime: function(flag, tag, value) {
		if (!Number.isFinite(value)) return flag;
		flag[tag] = 0;
		const id  = this.idTime(flag.H, flag.m, flag.s, flag.l);
		const ll  = {H: 3600000, m: 60000, s: 1000, l: 1};
		return this.timeID(id + (tag in ll ? ll[tag] * value : 0));
	},

	deltaDate: function(flag, tag, value) {
		if (!(tag in flag)) return flag;
		if (tag === "D")
			return;




		const upper = Math.trunc(value);
		const lower = value - upper;



		  if (tag === "M") {
			const month = upper + (upper > 12 ? - 1 : (upper < 1 ? - 12 : 0));



		}



	},










	/**. '{object setValues(object input, string name, number value)}: Manipula o elemento '{name} em '{input} conforme '{valua}:
	|Argumento|Descrição|
	|input|Registra os dados de data e tempo (Y, M, D, H, m, s) atuais|
	|name|Nome da propriedade a ser manipulada em '{input}|
	|value|Valor a ser aplicado à propriedade '{name}|**/
	setValues(flag, name, value) {


		if (name === "s") {
			data = this.setSeconds(value);
			input.s = data.s;
			input.m = data.m === 0 ? ("m" in input ? input.m : 0) : data.m;
			input.H = data.H === 0 ? ("H" in input ? input.H : 0) : data.H;
			if (data.dD !== 0)
				return this.setValues(input, "D", ("D" in input ? input.D : 0) + data.dD);
		}




		else if (name === "m") {
			data = this.setSeconds(60*value);
			input.s = "s" in input ? input.s : 0;
			input.m = data.m;
			input.H = data.H === 0 ? ("H" in input ? input.H : 0) : data.H;
			if (data.dD !== 0)
				return this.setValues(input, "D", ("D" in input ? input.D : 0) + data.dD);
		}
		else if (name === "H") {
			data = this.setSeconds(3600*value);
			input.s = "s" in input ? input.s : 0;
			input.m = "m" in input ? input.m : 0;
			input.H = data.H;
			if (data.dD !== 0)
				return this.setValues(input, "D", ("D" in input ? input.D : 0) + data.dD);
		}
		else if (name === "D") {
			let id = this.idMonth("Y" in input ? input.Y : 0, "M" in input ? input.M : 1) - 1 + value;
			data   = this.dateID(id);
			input.D = data.D;
			input.M = data.M;
			input.Y = (data.P === "-" ? -1 : 1) * data.Y;
		}
		else if (name === "M") {
			data = this.deltaMonth(value);
			input.D = "D" in input ? input.D : 1;
			input.M = data.M;
			input.Y = ("Y" in input ? input.Y : 0) + data.dY;
		}
		else if (name === "Y") {
			input.D = "D" in input ? input.D : 1;
			input.M = "M" in input ? input.M : 1;
			input.Y = value;
		}
		return input;
	},







	setValue: function(info, name, value) {
		name  = String(name).trim().toLowerCase();
		const list   = [info.P === "-" ? -info.Y : info.Y, info.M, info.D, info.H, info.m, info.s];
		const item   = {year: 0, month: 1, day: 2, hour: 3, minute: 4, second: 5};
		const time   = {second: 1, minute: 60, hour: 3600};
		const isTime = info.type === "time" || info.type === "datetime";
		const isDate = info.type === "date" || info.type === "datetime";
		/*-- TEMPO --*/
		if (name in time && isTime) {
			list[item[name]] = 0;
			const input  = info.type === "time" ?      "idTime" : "idDateTime";
			const array  = info.type === "time" ? list.slice(3) : list;
			const output = info.type === "time" ?      "timeID" : "dateTimeID";
			const walk   = Number((time[name] * value).toFixed(3));
			const id     = this[input].apply(this, array);
			return this[output](id + walk);
		}
		/*-- DIA --*/
		if (name === "day" && isDate) {
			list[item.day] = 1;
			const input  = info.type === "date" ?  "idDay" : "idDateTime";
			const adjust = info.type === "date" ?        1 : 24*3600;
			const output = info.type === "date" ? "dateID" : "dateTimeID";
			const walk   = info.type === "date" ? Math.trunc(adjust * value) : Number((adjust * value).toFixed(3));
			const id     = this[input].apply(this, list) - adjust;
			return this[output](id + walk);
		}
		/*-- MÊS --*/
		if (name === "month" && isDate) {
			const input  = info.type === "date" ?  "idDay" : "idDateTime";
			const output = info.type === "date" ? "dateID" : "dateTimeID";
			const data   = this.deltaMonth(list[item.year], Math.trunc(value));
			const days   = [0,31,this.leap(data.Y) ? 29 : 28,31,30,31,30,31,31,30,31,30,31][data.M];
			list[item.year]  = data.Y;
			list[item.month] = data.M;
			if (value%1 === 0)
				list[item.day] = list[item.day] > days ? days : list[item.day];
			else
				list[item.day] = (days + days*(value%1));

//FIXME é preciso organizar a mudnaça do mês e do ano seguindo a mesma lógica do dia

			console.log(list);
			list[item.day] = list[item.day] < 0 ? 1 : list[item.day];


			const id = this[input].apply(this, list);
			return this[output](id);
		}

		return info;
		/*const mult = {H: 3600, m: 60, s: 1};
		const info = this.timeID(id);
		info[attr] = 0;
		const data = this.idTime(info.H, info.m, info.s);
		const walk = (attr in mult ? mult[attr] : 0) * value;
		return this.timeID(data + walk);*/
	},




/*
		const data = {Y: 0, M: 1, D: 1, H: 0, m: 0, s: 0};
		if (typeof input === "object")
			for (let i in data)
				data[i] = Number.isFinite(input[i]) ? input[i] : data[i];

		if (!Number.isFinite(value)) return data;

		if (name === "s") {
			let info = this.setSeconds(value);
			data.s  = info.s;
			data.m += info.m;
			data.H += info.H;
			return this.setValues(data, "D", data.D + info.dD);
		}
		else if (name === "m") {
			let info = this.setSeconds(60*value);
			data.m  = info.m;
			data.H += info.H;
			return this.setValues(data, "D", data.D + info.dD);
		}
		else if (name === "H") {
			let info = this.setSeconds(3600*value);
			data.H = info.H;
			return this.setValues(data, "D", data.D + info.dD);
		}
		else if (name === "D") {
			let id   = this.idMonth(input.Y, input.M) - 1 + value;
			let info = this.dateID(id);
			data.D = info.D;
			data.M = info.M;
			data.Y = (info.P === "-" ? -1 : 1) * info.Y;
		}
		else if (name === "M") {
			let info = this.deltaMonth(value);
			data.M  = info.M;
			data.Y += info.dY;
		}
		else if (name === "Y") {
			data.Y = value;
		}
		return data;* /
	},*/








};