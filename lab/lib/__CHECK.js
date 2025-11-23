/**
#3 Checagem de Tipos
O objeto '{__CHECK} estabelece as regras para identificação dos tipos básicos e seus valores.
**/
const __CHECK = {
	/**. '{object instances}: Lista de instâncias conhecidas para identificação do tipo de objeto.**/
	instances: {
		String:                     {type: "string",   value: "valueOf"},
		Number:                     {type: "number",   value: "valueOf"},
		Boolean:                    {type: "boolean",  value: "valueOf"},
		RegExp:                     {type: "regexp",   value: "valueOf"},
		Date:                       {type: "datetime", value: "datetime"},
		Function:                   {type: "function", value: "valueOf"},
		HTMLElement:                {type: "node",     value: "item"},
		SVGElement:                 {type: "node",     value: "item"},
		MathMLElement:              {type: "node",     value: "item"},
		NodeList:                   {type: "node",     value: "nodes"},
		RadioNodeList:              {type: "node",     value: "nodes"},
		HTMLCollection:             {type: "node",     value: "nodes"},
		HTMLAllCollection:          {type: "node",     value: "nodes"},
		HTMLOptionsCollection:      {type: "node",     value: "nodes"},
		HTMLFormControlsCollection: {type: "node",     value: "nodes"},
	},
	/**. '{object datetime(object date)}: Retorna os valores numéricos de '{Date} (P, Y, M, D, d, H, m, s e type).**/
	datetime: function(date) {
		return __DATETIME.iso({
			Y: Math.abs(date.getFullYear()), P: date.getFullYear() < 0 ? -1 : 1,
			M: date.getMonth() + 1, D: date.getDate(),    d: date.getDay() + 1,
			H: date.getHours(),     m: date.getMinutes(), type: "datetime",
			s: date.getSeconds()+(date.getMilliseconds()/1000),
		});
	},
	/**. '{object test(object input)}: Testa o objeto informado e retorna um objeto contendo seu tipo (type) valor (value).**/
	test: function(input) {
		const data = {type: typeof input, value: input};
		if (data.type !== "object")
			return data;
		if (input === null)
			return {type: "null",  value: null};
		if (Array.isArray(input))
			return {type: "array", value: input.slice()};
		/*-- objetos comuns --*/
		for (let name in this.instances) {
			if (name in window && input instanceof window[name]) {
				let item  = this.instances[name];
				data.type = item.type;
				if (item.value === "valueOf")
					data.value = input.valueOf();
				else if (item.value === "datetime")
					data.value = this.datetime(input);
				else if (item.value === "item")
					data.value = [input];
				else if (item.value === "nodes")
					data.value = Array.prototype.slice.call(input).filter(function(v,i,a) {
						return v.nodeType === 1;
					});
			}
		}
		//FIXME para verificar objeto primitivo {} utilizar a comparação Object.prototype === Object.getPrototypeOf(teste)
		return data;
	}
};
