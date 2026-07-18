/**
#3 Listas
O objeto '{__ARRAY} apresenta ferramentas para trabalhar com listas.
**/
const __ARRAY = {
	/**. '{array unique(array list)}: Retorna a lista sem valores repetidos.**/
	unique: function(list) {
		return list.filter(function(v,i,a) {return a.indexOf(v) === i;});
	},
	/**. '{array unique(array list, integer order)}: Retorna a lista ordenada conforme definido em '{order} na seguinte preferência: número, inteiro grande, tempo, data, data/tempo, string, boleano, nó HTML, função, expressão regular, array e outros tipos (agrupados sem ordem definida).
	|Ordem|Descrição|
	|+1|Ascendente (padrão)|
	|-1|Descendente|
	|0|Reverso|
	|""Tabela de valores para ordenação da listagem""|**/
	sort: function(list, order) {
		const data = list.slice();
		const type = ["number", "bigint", "time", "date", "datetime", "string", "boolean", "node", "function", "regexp", "array"];
		data.sort(function(a,b) {
			const A = new __Type(a);
			const B = new __Type(b);
			/*-- comparação entre tipos diferentes --*/
			if (A.type !== B.type) {
				const aindex = type.indexOf(A.type);
				const bindex = type.indexOf(B.type);
				/*-- tipo fora da lista de classificação --*/
				if (aindex < 0 || bindex < 0)
					return aindex === bindex ? (A.type <= B.type ? -1 : 1) : (aindex > bindex ? -1 : 1);

				/*if (aindex >= 0 && bindex <  0) return -1;
				if (aindex <  0 && bindex >= 0) return  1;
				if (aindex <  0 && bindex <  0) return A.type <= B.type ? -1 : 1;*/
				return aindex <= bindex ? -1 : 1;
			}
			/*-- comparação entre tipos iguais --*/
			let avalue = a;
			let bvalue = b;
			if (A.array || A.number || A.boolean || A.date || A.time || A.datetime) {
				avalue = A.array ? a.length : A.value;
				bvalue = B.array ? b.length : B.value;
			}
			else if (A.string || A.node) {
				avalue = __STRING.clear(A.node ? a.innerText : a).toUpperCase();
				bvalue = __STRING.clear(B.node ? b.innerText : b).toUpperCase();
			}
			else if (A.function || A.regexp) {
				avalue = A.function ? a.name : a.source;
				bvalue = B.function ? b.name : b.source;
			}
			return avalue <= bvalue ? -1 : 1;
		});
		/*-- reverter --*/
		if (order === 0) {
			for (let i = 0; i < data.length; i++)
				if (data[i] !== list[i]) return data;
			return list.reverse();
		}
		return order < 0 ? data.reverse() : data;
	},
	/**. '{array clean(array list)}: Retorna a lista ordenada e sem valores repetidos.**/
	clean: function(list) {
		return this.sort(this.unique(list), 1);
	},
	/**. '{any item(array list, integer index)}: Retorna o item da lista contido em '{index} de forma rotativa.**/
	item: function(list, index) {
		const l = list.length;
		const n = Math.trunc(isNaN(index) ? 0 : index);
		return list[(l + n%l)%l];
	},
	/**. '{any finite(array list, string type)}: Isola o conjunto de números finitos e retorna alguma informação, se especificado:
	|Argumento '{type}|Tipo de Retorno|Descrição|
	|ASC|'{array}|Retorna a lista de finitos em ordem ascendente|
	|DESC|'{array}|Retorna a lista de finitos em ordem descendente|
	|MIN|'{number}|Retorna o menor número da lista de finitos|
	|MAX|'{number}|Retorna o maior número da lista de finitos|
	|SUM|'{number}|Retorna a soma da lista de finitos|
	|AVG|'{number}|Retorna a média da lista de finitos ou zero|
	|MED|'{number}|Retorna a mediana da lista de finitos ou zero|
	|HARM|'{number}|Retorna a média harmônica da lista de finitos ou zero|
	|GEO|'{number}|Retorna a média geométrica da lista de finitos ou zero|
	|SD|'{number}|Retorna o desvio padrão da lista de finitos ou zero|
	|MOD|'{array}|Retorna a lista dos módulos dos valores finitos.|
	|MODE|'{array}|Retorna uma lista com os valores finitos mais recorrentes.|
	|""Tabela de tipo de análise em números finitos""|**/
	finite: function(list, type) {
		const attr = String(type).trim().toUpperCase();
		const re   = /^(ASC|DESC|MIN|MAX|SUM|AVG|MED|HARM|GEO|SD|MOD|MODE)$/;
		const heap = list.map(function(v,i,a) {
			const data = new __Type(v);
			return data.finite ? data.value : null;
		}).filter(function(v,i,a) {return v !== null;});
		return re.test(attr) ? __DATA2D[attr](heap) : heap;
	},
	/**. '{array search(array list, any value)}: Retorna uma lista com os índices em que o argumento '{value} aparece.**/
	search: function(list, value) {
		return list.reduce(function(search,v,i,a) {
			if (v === value) search.push(i);
			return search;
		}, []);
	},
	/**. '{boolean check(array list, any ...)}: Retorna verdadeiro se todos os argumentos informados forem localizados.**/
	check: function(list) {
		const check = Array.from(arguments).slice(1);
		for (let v of check)
			if (list.indexOf(v) < 0) return false;
		return true;
	},
};