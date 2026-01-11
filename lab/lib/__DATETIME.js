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
	|data|object|Posição das unidades básicas no modelo|
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
		{P: 1, Y: 2, M: 3, D: 4, type: "date", model: "(P)(YYYY)-(MM)-(DD)"},
		{P: 1, D: 2, M: 3, Y: 4, type: "date", model: "(P)(DD)/(MM)/(YYYY)"},
		{P: 1, M: 2, D: 3, Y: 4, type: "date", model: "(P)(MM)-(DD)-(YYYY)"},
		/*-- datas: meses nominais --*/
		{P: 1, Y: 2, M: 3, D: 4, type: "date", model: "(P)(YYYY) (MMM) (D)"},
		{P: 1, Y: 2, M: 3, D: 4, type: "date", model: "(P)(YYYY) (MMMM) (D)"},
		{P: 1, D: 2, M: 3, Y: 4, type: "date", model: "(P)(D) (MMM) (YYYY)"},
		{P: 1, D: 2, M: 3, Y: 4, type: "date", model: "(P)(D) (MMMM) (YYYY)"},
		{P: 1, M: 2, D: 3, Y: 4, type: "date", model: "(P)(MMM) (D) (YYYY)"},
		{P: 1, M: 2, D: 3, Y: 4, type: "date", model: "(P)(MMMM) (D) (YYYY)"},
		/*-- mêses numéricos --*/
		{P: 1, Y: 2, M: 3, type: "month", model: "(P)(YYYY)-(MM)"},
		{P: 1, M: 2, Y: 3, type: "month", model: "(P)(MM)/(YYYY)"},
		{P: 1, M: 2, Y: 3, type: "month", model: "(P)(MM)-(YYYY)"},
		/*-- mêses nominais --*/
		{P: 1, M: 2, Y: 3, type: "month", model: "(P)(MMM) (YYYY)"},
		{P: 1, M: 2, Y: 3, type: "month", model: "(P)(MMMM) (YYYY)"},
		{P: 1, Y: 2, M: 3, type: "month", model: "(P)(YYYY) (MMM)"},
		{P: 1, Y: 2, M: 3, type: "month", model: "(P)(YYYY) (MMMM)"},
		/*-- semanas --*/
		{P: 1, Y: 2, w: 3, type: "week", model: "(P)(YYYY)-W(ww)"},
		/*-- tempo --*/
		{H: 1, m: 2, s: 3,       type: "time", model: "(H):(mm):(ss)"},
		{H: 1, m: 2,             type: "time", model: "(H):(mm)"},
		{h: 1, m: 2, s: 3, p: 4, type: "time", model: "(h):(mm):(ss) (p)"},
		{h: 1, m: 2, p: 3,       type: "time", model: "(h):(mm) (p)"},
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
		const swap = /([^()a-zA-Z])/g;
		/*-- looping pelos típos básicos --*/
		for (let i = 0; i < this.base.length; i++) {
			let base  = this.base[i];
			let data = {};
			/*-- definindo data --*/
			data.data = {P: null, D: null, M: null, Y: null, h: null, m: null, s: null, p: null, w: null};
			for (let x in data.data)
				data.data[x] = x in base ? base[x] : null;
			/*-- definindo expressão regular --*/
			let model = base.model.replace(/([^()a-zA-Z])/g, "\\$1");
			for (let x in this.unit)
				model = model.replace(`(${x})`, this.unit[x].source);
			data.re = new RegExp(`^\\s*${model}\\s*$`, "i");
			/*-- definindo tipo --*/
			data.type = base.type;
			list.push(data);
			if (data.type === "date") date.push(data);
			if (data.type === "time") time.push(data);
		}
		/*-- construindo datetime --*/
		for (let i = 0; i < date.length; i++) {
			for (let j = 0; j < time.length; j++) {
				let dateModel = date[i].re.source.replace("\\s*$", "");
				let timeModel = time[j].re.source.replace("^\\s*", "");
				let maxMatch  = 0;
				let datetime  = {};
				datetime.re   = new RegExp(`${dateModel}(?:\\ |T|\\,\\ )${timeModel}`, "i");
				datetime.type = "datetime";
				datetime.data = {P: null, D: null, M: null, Y: null, h: null, m: null, s: null, p: null, w: null};
				for (let k in date[i].data) {
					if (date[i].data[k] !== null) {
						datetime.data[k] = date[i].data[k];
						maxMatch = date[i].data[k] < maxMatch ? maxMatch : date[i].data[k];
					}
				}
				for (let k in time[j].data) {
					if (time[j].data[k] !== null) {
						datetime.data[k] = time[j].data[k] + maxMatch;
					}
				}
				list.push(datetime);
			}
		}
		this.templates = list;
		return;
	},
	/**. '{object match(string value)}: Retorna o template que casa com '{value}.**/
	match: function(value) {
		this.setTemplates();
		for (let i = 0; i < this.templates.length; i++)
			if (this.templates[i].re.test(value))
				return this.templates[i];
		return null;
	},












	/**. '{object base}: Registra as unidades de tempo para fins de montagem dos modelos.**/
	basess: {
		Y:   "([0-9]+)",                    YYYY: "([0-9][0-9][0-9][0-9]+)",
		M:   "(0?[1-9]|1[0-2])",            MM:   "(0[1-9]|1[0-2])",
		MMM: null,                          MMMM: null,
		D:   "(0?[1-9]|[12][0-9]|3[01])",   DD:   "(0[1-9]|[12][0-9]|3[01])",
		d:   "(0?[1-7])",                   dd:   "0[1-7]",
		ddd: null,                          dddd: null,
		w:   "(0?[1-9]|[1-4][0-9]|5[0-3])", ww:   "(0[1-9]|[1-4][0-9]|5[0-3])",
		H:   "([01]?[0-9]|2[0-4])",         HH:   "([01][0-9]|2[0-4])",
		h:   "(0?[1-9]|1[0-2])",            hh:   "(0[1-9]|1[0-2])",
		m:   "([0-5]?[0-9])",               mm:   "([0-5][0-9])",
		s:   "([0-5]?[0-9]|[0-5]?[0-9]\\.[0-9][0-9]?[0-9]?)",
		ss:  "([0-5][0-9]|[0-5][0-9]\\.[0-9][0-9]?[0-9]?)",
		p:   "([AP]M)", P: "([\\+\\-]?)"
	},


	/**. '{void update()}: Atualiza os modelos em caso de mundança de linguagem.**/
	update: function() {
		/*-- verificando alteração de lang --*/
		const lang = __LANG.value.join(" ");
		if (lang === this.lang) return;
		/*-- atualizar valores --*/
		this.lang  = lang;
		this.local = this.names(lang.split(" "));
		/*-- atualizar unidades básicas ''--*/
		for (let i in this.local) {
			let list = this.local[i].slice();
			list.forEach(function(v,i,a) {a[i] = v.replace(/(\W)/g, "\\$1");});
			let data = list.join("|");
			this.base[i] = `(${data})`;
		}
		/*-- atualizar expressões regulares dos modelos --*/
		const wall  = /(\W)/g;
		const find  = /(Y+|D+|M+|w+|d+|H+|h+|m+|s+|p|P)/g;
		for (let i in this.templates) {
			/*-- obtendo valores dos dados --*/
			let parts = {};
			let model = this.templates[i].model.replace(wall, "\\$1");
			let type  = this.templates[i].type;
			let units = model.match(find);
			for (let unit = 0; unit < units.length; unit++)
				parts[units[unit]] = this.base[units[unit]];
			/*-- executando a substituição de dados --*/
			model = model.replace(find, "<<<$1>>>");
			for (let part in parts)
				model = model.replace(`<<<${part}>>>`, parts[part]);
			/*-- construindo expressão regular --*/
			this.templates[i].re = new RegExp(`^${model}$`, "i");
		}
		return;
	},
	/**. '{boolean leap(integer year)}: Informar se o ano definido no argumento é bissexto.**/
	leap: function(year) {
		const y = Math.abs(year);
		return (y%400 === 0 || (y%4 === 0 && y%100 !== 0));
	},
	/**. '{integer max(integer year, integer month)}: Informar o número máximo de dias no mês.**/
	max: function(year, month) {
		const max = [31,(this.leap(year) ? 29 : 28),31,30,31,30,31,31,30,31,30,31];
		return max[month-1];
	},
	/**. '{number|string value(string data, string unit)}: Retorna o valor numérico declarado em '{data}:
	- '{unit} aceitas os valores Y D M w d h H m s p P;
	- em caso de número, retornará seu valor numérico;
	- se '{unit} for "d" ou "M" e '{data} um nome, retornará seu índice a partir de 1;
	- se '{unit} for "P", retornará -1, caso negativo, ou 1; e
	- se '{unit} for "p", retornará "AM" ou "PM".**/
	value: function (data, unit) {
		this.update();
		const number = /^\d+(\.\d+)?$/;
		if (number.test(data)) return Number(data);
		const upper = String(data).toUpperCase();
		const lower = String(data).toLowerCase();
		if (unit === "P")
			return data === "-" ? -1 : 1;
		if (unit === "d" || unit === "M") {
			const attr = unit === "d" ? ["dddd", "ddd"] : ["MMMM", "MMM"];
			const div  = unit === "d" ? 7 : 12;
			const list = this.local[attr[0]].concat(this.local[attr[1]]);
			for (let i = 0; i < list.length; i++) {
				if (list[i].toUpperCase() === upper || list[i].toLowerCase() === lower)
					return i%div + 1;
			}
		}
		return upper;
	},
	/**. '{string string(number data, string unit)}: Retorna o valor textual conforme formato definido em '{unit}**/
	string: function(data, unit) {
		const abs = Math.abs(data);
		if (unit === "YYYY" || unit === "Y") {
			const len = abs < 10 ? 3 : (abs < 100 ? 2 : (abs < 1000 ? 1 : 0));
			return String("0").repeat(unit === "Y" ? 0 : len)+String(abs);
		}
		if (unit === "ss") {
			const num = String(abs).split(".");
			if (num.length < 2) num.push("000");
			const int = num[0].length;
			const dec = num[1].length;
			num[0] = (int === 1 ? "0" : "") + num[0];
			num[1] = num[1] + (dec === 1 ? "00" : (dec === 2 ? "0" : ""));
			return num.join(".");
		}
		if (unit === "ddd" || unit === "dddd" || unit === "MMM" || unit === "MMMM") {
			const div   = unit[0] === "d" ? 7 : 12;
			const item  = data - 1;
			const index = item%div + (item < 0 ? div : 0);
			return this.local[unit][index];
		}
		if (unit === "P")
			return Number(data) < 0 ? "-" : "";
		if ((/^(MM|DD|dd|ww|HH|hh|mm)$/).test(unit))
			return (abs < 10 ? "0" : "") + String(abs);
		if ((/^[YMDdwHhms]$/).test(unit))
			return String(abs);
		return String(data).toUpperCase();
	},
	/**. '{string iso(object data)}: Retorna uma string padrão a partir do resultado do método '{check}.**/
	iso: function(data) {
		if (typeof data !== "object") return null;
		if (data.type === "date") {
			const P    = this.string(data.P, "P");
			const YYYY = this.string(data.Y, "YYYY");
			const MM   = this.string(data.M, "MM");
			const DD   = this.string(data.D, "DD");
			return `${P}${YYYY}-${MM}-${DD}`;
		}
		if (data.type === "month") {
			const P    = this.string(data.P, "P");
			const YYYY = this.string(data.Y, "YYYY");
			const MM   = this.string(data.M, "MM");
			return `${P}${YYYY}-${MM}`;
		}
		if (data.type === "week") {
			const P    = this.string(data.P, "P");
			const YYYY = this.string(data.Y, "YYYY");
			const ww   = this.string(data.w, "ww");
			return `${P}${YYYY}-W${ww}`;
		}
		if (data.type === "time") {
			const HH = this.string(data.H, "HH");
			const mm = this.string(data.m, "mm");
			const ss = this.string(data.s, "ss");
			return `${HH}:${mm}:${ss}`;
		}
		if (data.type === "datetime") {
			const copy = {};
			for (let i in data) copy[i] = data[i];
			copy.type  = "date";
			const date = this.iso(copy);
			copy.type  = "time";
			const time = this.iso(copy);
			return [date,time].join("T");
		}
		return null;
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