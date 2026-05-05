/**
#3 Ferramentas de Teste
O objeto `{__TEST} tem o objetivo de acomodar métodos de checagem de ferramentas sendo um componente pertencente à homologação da biblioteca, mas não da versão em produção.
**/
const __TEST = {
	/**#4 __DATETIME**/
	/**. '{void random(string type)}: Executa teste nos métodos que traduzem números em tempo '{type}.**/
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
			let fromInt = __DATETIME[attr.name](list[i]);
			if (fromInt === null)
				throw new Error(`${attr.name} Error: ${list[i]} > null (${i})`);
			/*-- retornar de string para id --*/
			let fromStr = __DATETIME.match(fromInt.string);
			if (fromStr === null)
				throw new Error(`${attr.name} Error: ${list[i]} > ${fromInt.string} > null (${i})`);
			/*-- comparar a coerência --*/
			if (list[i] !== fromStr.value)
				throw new Error(`${attr.name} Error: ${list[i]} > ${fromInt.string} > ${fromStr.value} (${fromStr.value - list[i]})`);
		}
		return null;
	},
	/**. '{void wrandom()}: Executa teste nos métodos que traduzem datas em semanas.**/
	wrandom: function() {
		const list = __MATH.crypto(16, 10000, false);
		for (let i = 0; i < list.length; i++) {
			let flag = __DATETIME.dateID(list[i]);
			let week = __DATETIME.weekDate(flag.P === "-" ? -flag.Y : flag.Y, flag.M, flag.D);
			let date = __DATETIME.match(week);
			if (date.value !== flag.value)
				throw new Error(`Week Error: ${flag.string} > ${week} > ${date.string})`);
		}
		return null;
	},
	/**. '{void linear(integer min, integer max)}: Teste a linearidade do dia da semana e do valor da escala.**/
	linear: function(min, max) {
		const walker = {
			Y: 0, M: 0, D: 0, d: 0, value: 0, end: 0,
			get last() {return [31,__DATETIME.leap(this.Y) ? 29 : 28,31,30,31,30,31,31,30,31,30,31][this.M - 1];},
			check: function() {
				const flag = __DATETIME.dateID(this.value);
				if (
					flag.D !== this.D           ||
					flag.M !== this.M           ||
					flag.Y !== Math.abs(this.Y) ||
					flag.d !== this.d           ||
					flag.value !== this.value
				) throw new Error(`\nflag:\n\t${JSON.stringify(flag)}\nwalker:\n\t${JSON.stringify(this)}`);
			},
			next: function() {
				const last = this.last;
				this.Y = this.D === last && this.M === 12 ? this.Y + 1 : this.Y;
				this.M = this.D === last ? (this.M === 12 ? 1 : this.M + 1) : this.M;
				this.D = this.D === last ? 1 : this.D + 1;
				this.d = this.d === 7 ? 1 : this.d + 1;
				this.value++;
				return this.value <= this.end;
			},
			start: function(min, max) {
				const flag = __DATETIME.dateID(max >= min ? min : max);
				this.end   = max >= min ? max : min;
				this.value = flag.value;
				this.Y = flag.P === "-" ? -flag.Y : flag.Y;
				this.M = flag.M;
				this.D = flag.D;
				this.d = flag.d;
				while(this.next()) this.check();
				return null;
			}
		};
		return walker.start(min, max);
	},
};