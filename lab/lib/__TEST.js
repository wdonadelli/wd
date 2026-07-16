/**
#3 Ferramentas de Teste
O objeto '{__TEST} tem o objetivo de acomodar métodos de checagem de ferramentas sendo um componente pertencente à homologação da biblioteca, mas não da versão em produção.
**/
const __TEST = {
	/**#4 __DATETIME**/
	/**. '{void random(string type)}: Executa teste nos métodos que traduzem números em tempo '{type}.**/
	random: function(type) {
		const conf = {
			time:     {bit: 16, name: "timeID", uint: true},
			date:     {bit: 16, name: "dateID", uint: false},
			datetime: {bit: 32, name: "dateTimeID", uint: false},
		};
		const attr = type in conf ? conf[type] : conf.datetime;
		__MATH.crypto(attr.bit, 10000, attr.uint).forEach(function(v,i,a) {
			/*-- obter e checar de id para string --*/
			const fromInt = __DATETIME[attr.name](v);
			if (fromInt === null)
				throw new Error(`${attr.name} Error: ${v} > null (${i})`);
			/*-- retornar de string para id --*/
			const fromStr = __DATETIME.match(fromInt.string);
			if (fromStr === null)
				throw new Error(`${attr.name} Error: ${v} > ${fromInt.string} > null (${i})`);
			/*-- comparar a coerência --*/
			if (v !== fromStr.value)
				throw new Error(`${attr.name} Error: ${v} > ${fromInt.string} > ${fromStr.value} (${i})`);
		});
		return;
	},
	/**. '{void wrandom()}: Executa teste nos métodos que traduzem datas em semanas.**/
	wrandom: function() {
		__MATH.crypto(16, 10000, false).forEach(function(v,i,a) {
			const flag = __DATETIME.dateID(v);
			const week = __DATETIME.weekDate(flag.Y, flag.M, flag.D);
			const date = __DATETIME.match(week);
			if (date.value !== flag.value)
				throw new Error(`Week Error: ${flag.string} > ${week} > ${date.string})`);
		});
		return;
	},
	/**. '{void linear(integer min, integer max)}: Teste a linearidade do dia da semana e do valor da escala.**/
	linear: function(min, max) {
		const walker = {
			data: null,
			start: function(min, max) {
				this.min  = max >= min ? min : max;
				this.max  = max >= min ? max : min;
				this.data = __DATETIME.dateID(this.min);
				return;
			},
			shift: function() {
				const last = [31,__DATETIME.leap(this.data.Y) ? 29 : 28,31,30,31,30,31,31,30,31,30,31][this.data.M - 1];;
				this.data.Y = this.data.D === last && this.data.M === 12 ? this.data.Y + 1 : this.data.Y;
				this.data.M = this.data.D === last ? (this.data.M === 12 ? 1 : this.data.M + 1) : this.data.M;
				this.data.D = this.data.D === last ? 1 : this.data.D + 1;
				this.data.d = this.data.d === 7 ? 1 : this.data.d + 1;
				this.data.value++;
				return;
			},
			next: function() {
				const flag = __DATETIME.dateID(this.data.value + 1);
				this.shift();
				if (
					flag.D !== this.data.D ||
					flag.M !== this.data.M ||
					flag.Y !== this.data.Y ||
					flag.d !== this.data.d ||
					flag.value !== this.data.value
				) throw new Error(`\nflag:\n\t${JSON.stringify(flag)}\nwalker:\n\t${JSON.stringify(this)}`);
				return this.data.value < this.max;
			}
		};
		walker.start(min, max);
		while(walker.next());
		return;
	},
};