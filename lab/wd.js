const wd = (function() {
	const __CSS = `
		/*-- Inert ---------------------------------------------------------------*/
		${"inert" in document.body ? "" : "[inert] {display: none !important;}"}
		/*-- Freeze --------------------------------------------------------------*/
		.js-wd-freeze {overflow: hidden !important;}
		/*-- Tip/Validity --------------------------------------------------------*/
		.css-wd-form-error, .css-wd-tooltip {
			display: inline-block;
			padding: 0.25em;
			margin: 0.25em 0;
			font-size: var(--var-js-wd-font-size);
			font-family: var(--var-js-wd-font-type);
			border: thin solid;
			border-radius: 0.2em;
		}
		.css-wd-tooltip {
			display: none;
			position: absolute;
			top: 100%;
			left: 0;
		}
		*:hover > .css-wd-tooltip {
			display: inline-block;
			animation: js-wd-animation-emerge 3s ease;
		}
		/*-- Tip -----------------------------------------------------------------*/













		/*-- Signal: box --*/
		[data-js-wd-signal] {
			position: relative !important;
			display: flex !important;
			flex-direction: column !important;
			padding: 0 !important;
			margin: 0.25em 3px !important;
			box-shadow: 2px 2px 2px rgba(0,0,0,0.5) !important;
			animation: js-wd-animation-expand 0.5s ease !important;
			font-size: 14px !important;
			font-family: Tahoma, Verdana, sans-serif !important;
			line-height: 1.2 !important;
			border-radius: 0.3em !important;
			background-repeat: no-repeat !important;
			background-position: center !important;
			background-size: cover !important;
			background-origin: content-box !important;
		}

		[data-js-wd-signal="info"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(140, 180, 255) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(-15)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\24d8</text></svg>") !important;
		}
		[data-js-wd-signal="ok"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(160, 250, 160) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(0)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\2714</text></svg>") !important;
		}
		[data-js-wd-signal="warn"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(255, 255, 150) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(-15)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\26A0</text></svg>") !important;
		}
		[data-js-wd-signal="error"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(255, 200, 200) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(0)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\1F6AB</text></svg>") !important;
		}
		[data-js-wd-signal="dialog"] {
			margin: 0 !important;
			max-width: 95vw !important;
			min-width: 25vw !important;
			color: rgb(50, 50, 50) !important;
			background-color: rgb(200,220,220) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(-15)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\2BD1</text></svg>") !important;
		}

		@media screen and (min-width: 768px) {
			[data-js-wd-signal="dialog"] {max-width: 75vw !important;}
		}

		.js-wd-signal-head {
			padding: 0.5em 2em 0.5em 0.5em !important;
			border-bottom: thin solid !important;
			font-weight: bold !important;
		}
		.js-wd-signal-body {
			padding: 0.5em !important;
			white-space: pre-wrap !important;
		}
		.js-wd-signal-node {
			padding: 0 0.5em !important;
			display: flex !important;
			flex-direction: column !important;
		}
		.js-wd-signal-fire {
			display: flex !important;
			flex-direction: column !important;
			padding: 0.5em !important;
		}
		@media screen and (min-width: 768containspx) {
			.js-wd-signal-fire {
				flex-direction: row !important;
				justify-content: space-evenly !important;
				align-items: center !important;
			}
		}
		.js-wd-signal-kill {
			position: absolute !important;
			top: 0 !important;
			right: 0 !important;
			margin:  0.4em !important;
			height: 1em !important;
			width: 1em !important;
			border-radius: 0.5em !important;
			line-height: calc(5 / 6) !important;
			font-size: 1em !important;
			text-align: center !important;
			cursor: pointer !important;
			z-index: 10 !important;
		}
    .js-wd-signal-kill:focus, .js-wd-signal-kill:hover {outline: 1px solid !important;}



		/*-- dataset -------------------------------------------------------------*/
		[data-wd-grid] [aria-sort] {cursor: pointer !important;}
		[data-wd-grid] [aria-sort]:before {content: "\\2195 " !important;;}
		[data-wd-grid] [aria-sort="descending"]:before {content: "\\2191 " !important;}
		[data-wd-grid] [aria-sort="ascending"]:before  {content: "\\2193 " !important;}

		[data-wd-send], [data-wd-set], [data-wd-edit], [data-wd-shared] {
			cursor: pointer !important;
		}

		/*-- data-wd-float --------------------------------------------------------*/
		[data-wd-float] {cursor: context-menu !important;}


		[data-wd-repeat] > *, [data-wd-load] > * {visibility: hidden !important;}
		[data-wd-slide] > * {animation: js-wd-animation-emerge 1s, js-wd-animation-shrink-out 0.5s !important;}
		svg .js-wd-chart-hide {display: none !important;}
		@media screen and (min-width: 768px) {svg .js-wd-chart-hide {display: inline !important;}}
		wd-mark {background-color: rgba(154,205,50,0.7) !important; display: inline !important; border-radius: 0.2em !important; color: #000000 !important;}


		/*-- Códificação ---------------------------------------------------------*/

		/*-- containers --*/



		/*-- Importantes ---------------------------------------------------------*/
		/*FIXME o que é isso*/
		/*[data-js-wd-hide]:not([data-js-wd-show]) {
			display: none !important;
		}*/
		[data-js-wd-hide] {display: none !important;}

		[data-js-wd-cursor="move"],    [data-js-wd-cursor="move"]    * {cursor:     grab !important;}
		[data-js-wd-cursor="moving"],  [data-js-wd-cursor="moving"]  * {cursor:     move !important;}
		[data-js-wd-cursor="drag"],    [data-js-wd-cursor="drag"]    * {cursor:     grab !important;}
		[data-js-wd-cursor="draging"], [data-js-wd-cursor="draging"] * {cursor: grabbing !important;}


		[data-js-wd-area] {
			position: fixed !important;
			background-color: rgba(127,127,127,0.2) !important;
			z-index: 9999 !important;
		}
		[data-js-wd-area="vertical"] {
			top: 0 !important;
			bottom: 0 !important;
			height: 100vh !important;
			border-left:  thin dashed rgb(128, 128, 128) !important;
			border-right: thin dashed rgb(128, 128, 128) !important;
		}
		[data-js-wd-area="horizontal"] {
			left: 0 !important;
			right: 0 !important;
			width: 100vw !important;
			border-top:    thin dashed rgb(128, 128, 128) !important;
			border-bottom: thin dashed rgb(128, 128, 128) !important;
		}

		.js-wd-mark-text {
			background-color: lime !important;
			color: black !important;
		}
		`;
			//"*::backdrop {background-color: white;}",
			//TODO ver coloração https://developer.mozilla.org/pt-BR/docs/Web/CSS/background-color
			//TODO interessante https://developer.mozilla.org/en-US/docs/Web/CSS/::file-selector-button

/*----------------------------------------------------------------------------*/
	/**
	#4 Nós
	''constructor object __Node(node input)''
	Construtor para manipulação de nós HTML.**/
	function __Node(input) {
		if (!(this instanceof __Node)) return new __Node(input);
		__FNode.call(this, input);
	}

	__Node.prototype = Object.create(__FNode.prototype, {

		/**. '{void tsort(integer order...)}: Ordena colunas de tabelas. Os argumentos '{order} definem a sequência de prioridade na classificação, com a indicação do número da coluna (a partir de 1, da esquerda para a direita). Se indicador da coluna for positivo, sua ordem será ascendente, caso contrário, descendente. O método deverá ser aplicado sobre o agrupador de linhas**/
		tsort: {
			value: function() {
				/*-- acertando argumentos --*/
				const args = [];
				const rule = [];
				for (let i = 0; i < arguments.length; i++) {
					let data = new __Type(arguments[i]);
					if (data.integer && data.value !== 0 && args.indexOf(data.value) < 0) {
						args.push(data.value);
						rule.push({asc: data.value > 0, col: Math.abs(data.value) - 1});
					}
				}
				/*-- ordernar linhas --*/
				const desc = new __Type(this.node.children);
				const rows = desc.value;
				rows.sort(function(a, b) {
					/*-- definindo quantidade de colunas em cada linha a comparar --*/
					const maxA  = a.childElementCount - 1;
					const maxB  = b.childElementCount - 1;
					/*-- looping pelas regras de ordenação --*/
					for (let i = 0; i < rule.length; i++) {
						let col = rule[i].col;
						let asc = rule[i].asc;
						/*-- índice das colunas informadas não constam na linha --*/
						if (col > maxA && col > maxB) continue;
						/*-- obter os valores para comparação --*/
						let dataA = col > maxA ? "" : a.children[col].innerText.toLowerCase();
						let dataB = col > maxB ? "" : b.children[col].innerText.toLowerCase();
						let textA = new __String(dataA);
						let textB = new __String(dataB);
						let typeA = new __Type(textA.near.trim());
						let typeB = new __Type(textB.near.trim());
						/*-- se os valores forem iguais, passar para a próxima regra --*/
						if (typeA.value === typeB.value) continue;
						/*-- caso contrário, definir ordenamento --*/
						let list = new __Array(typeA.value, typeB.value);
						let sort = list.sort(asc);
						return sort[0] === typeA.value ? -1 : +1;
					}
					/*-- se nenhuma ordenação for encontrada --*/
					return 0;
				});
				/*-- reordenar elementos --*/
				for (let i = 0; i < rows.length; i++)
					this.node.appendChild(rows[i]);
			}
		},
		/**. '{void jump(node list)}: O nó será adicionado aos elementos na ordem definida em '{list} a cada chamada do método. O argumento '{list} é uma lista de nós que acomodará o elemento.**/
		jump: {
			value: function(list) {
				const check = __Type(list);
				if (!check.node && !check.array) return;
				const nodes = [];
				const value = check.value;
				for (let i = 0; i < value.length; i++)
				  if (__Type(value[i]).node && value[i] != this.node)
				    nodes.push(value[i]);
				if (nodes.length > 0) {
					const next = nodes.indexOf(this.node.parentElement) + 1;
					const node = nodes[next%nodes.length];
					node.appendChild(this.node);
				}
				return;
			}
		},

		/**. '{void select()}: Seleciona o conteúdo do nó.**/
		select: {
			value: function() {
				const select = window.getSelection();
				const range  = document.createRange();
				select.removeAllRanges();
				range.selectNode(this.node);
				select.addRange(range);
				return;
			}
		},
		select2: {
			value: function() {
				const select = window.getSelection();
				const range  = document.createRange();
				select.removeAllRanges();
				range.selectNodeContents(this.node);
				select.addRange(range);
				return;
			}
		},
		/**. '{vois copy()}: Seleciona o conteúdo do nó.**/
		copy: {
			value: function() {
				this.select();
				document.execCommand("copy");
				window.getSelection().removeAllRanges();
			}
		},
		copy2: {
			value: function() {
				this.select2();
				document.execCommand("copy");
				window.getSelection().removeAllRanges();
			}
		},
		/* copiar DOM: elemento ou tudo */
		/*let data = wd_vtype(value);
		if (data.type === "dom" && "execCommand" in document) {
			let element = data.value.length > 0 ? data.value[0] : document.body;
			let range   = document.createRange();
			let select  = window.getSelection();
			select.removeAllRanges();          /* limpar seleção existente */
			//range.selectNodeContents(element); /* pegar os nós do elemento */
		//	select.addRange(range);            /* seleciona os nós do elemento */
			//document.execCommand("copy");      /* copia o texto selecionado */
			//select.removeAllRanges();          /* limpar seleção novamente */
			//return true;
		//}
		/* copiar valor informado */
		//if ("clipboard" in navigator && "writeText" in navigator.clipboard) {
//			navigator.clipboard.writeText(value === null ? "" : value).then(
	//			function () {/*sucesso*/},
		//		function () {/*erro*/}
			//);
			//return true;


		cursor: {
			value: function(n) {
				this.select();
				window.getSelection().collapse(this.node, n);
			}
		},

	});

/*----------------------------------------------------------------------------*/
	/**#4 Tabela
	''constructor object __Table(any input)''
	Construtor para obter dados de tabela e matrizes. O argumento '{input} pode ser uma String CSV, uma matriz de array ou uma tabela HTML;**/
	function __Table(input) {
		if (!(this instanceof __Table))	return new __Table(input);
		const parser = new __Parser(input);
		let table;
		if (parser._check.nonempty)
		  table = parser.csvTable.get();
		else if (parser._check.array)
		  table = parser.matrixCSV.csvTable.get();
		else if (parser._check.node && parser._check.value[0].tagName.toLowerCase() === "table")
		  table = parser._check.value[0];
		else
		  table = document.createElement("TABLE");
		Object.defineProperties(this,
		  /**. '{node table}: Retorna a tabela.**/
		  {table: {value: table}}
		);
	}

	Object.defineProperties(__Table.prototype, {
		constructor: {value: __Table},
		/**. '{object to}: Retorna um objeto para exportar os dados da tabela para:
		|Nome|Descrição|
		|matrix|Retorna os nós i{td} e i{th} da tabela em forma de matriz 2X2|
		|values|Semelhante à propriedade '{matrix} mas exibe os valores das células|
		|struct|Retorna uma lista de objetos cujas propriedades correspondem ao título da coluna|
		|csv|Retorna os dados da tabela em formato CSV|
		|json|Retorna o resultado da propriedade '{values} no formato JSON|**/
		to: {
			get: function() {
				const parser = new __Parser(this.table);
				return {
					get matrix() {return parser.tableMatrix.get();},
					get values() {return parser.tableValues.get();},
					get struct() {return parser.tableValues.matrixList.get();},
					get csv()    {return parser.tableValues.matrixCSV.get();},
					get json()   {return parser.tableValues.jsonString.get();}
				};
			}
		},
		/**. '{string toString()}: Retorna os valores da tabela em formato CSV.**/
		toString: {value: function() {return this.to.csv;}},
		/**. '{string valueOf()}: Retorna os valores da tabela em forma de matriz.**/
		valueOf: {value: function() {return this.to.values;}},
		/**. '{integer rows}: Retorna a quantidade de linhas da tabela.**/
    rows: {get: function() {return this.valueOf().length;}},
		/**. '{integer cols}: Retorna a quantidade máxima de colunas da tabela.**/
    cols: {
    	get: function() {
    		const matrix = this.valueOf();
    		let cols = 0;
    		for (let i = 0; i < matrix.length; i++)
    			if (matrix[i].length > cols) cols = matrix[i].length;
    		return cols;
    	}
    },
    /**. '{string caption}: Define ou retorna o valor do título da tabela.**/
		caption: {
		  get: function () {
		    return this.table.caption === null ? "" : this.table.caption.textContent;
		  },
		  set: function (x) {
		    if (this.table.caption === null) {
		      const node = document.createElement("CAPTION");
		      this.table.appendChild(node);
		    }
		    this.table.caption.textContent = String(x);
		  }
		},
		/**. '{array cells(string target, function caller)}: Retorna uma lista de células da tabela conforme configuração definida no argumento '{target}.
		//FIXME os dois ponto está quebrando a linha errada
		. A célula é especificada pelos índices da linha e coluna separados por vírgula (i{row,col}), onde zero é a origem e o caractere "asterísco" o último índice. Para especificar um intervalo de células, deve-se separar as células por um caractere de "dois pontos" (i{row1,col1:row2,col2}), nesse caso, a linha e a coluna da célula inicial devem ser menores ou iguais a aqueles especificados na célula final. Para especificar várias células ou intervalos de forma independente, deve-se separá-los por um caractere de "ponto e vírgula" (i{row1,col1;row2,col2:row3,col3}).
		. A função opcional definida em '{caller} permite alterar o conteúdo retornado. Por padrão, cada item da lista conterá o nó '{td} ou '{th} da tabela conforme definido em '{target}. A função receberá três argumentos, o nó HTML e os índices da linha e coluna, nessa ordem. O retorno da função, se definido, definirá o novo valor do item da lista.**/
		cells: {
			value: function(target, caller) {
				const groups = String(target).replace(/\s+/g, "").split(";");
				const change = new __Type(caller).function;
				const reCell = /^(\d+|\*)\,(\d+|\*)$/;
				const reArea = /^(\d+|\*)\,(\d+|\*)\:(\d+|\*)\,(\d+|\*)$/;
				const rows   = this.rows;
				const cols   = this.cols;
				const matrix = this.to.matrix
				const list   = [];
				let group, data, area, item, result;
				/*-- grupos separados por ";" --*/
				for (let i = 0; i < groups.length; i++) {
					/*-- capturando dados das células --*/
					group = groups[i];
					area  = reArea.test(group);
					if (area || reCell.test(group)) {
						data = {
							row1: group.replace((area ? reArea : reCell), "$1"),
							col1: group.replace((area ? reArea : reCell), "$2"),
							row2: area ? group.replace(reArea , "$3") : null,
							col2: area ? group.replace(reArea , "$4") : null
						};
						/*-- ajustando as células --*/
						for (let attr in data) {
							if (data[attr] === "*")
								data[attr] = ((/^row/).test(attr) ? rows : cols) - 1;
							if (data[attr] !== null)
								data[attr] = Number(data[attr]);
						}
						if (data.row2 === null) data.row2 = data.row1;
						if (data.col2 === null) data.col2 = data.col1;
						/*-- capturando dados --*/
						for (let row = data.row1; row <= data.row2; row++) {
							for (let col = data.col1; col <= data.col2; col++) {
								if (row < rows && col < matrix[row].length) {
									item   = matrix[row][col];
									result = change ? caller(item, row, col) : undefined;
									list.push(result === undefined ? item : result);
								}
							}
						}
					}
				}
				return list;
			}
		},

//FIXME copy como fazer?
/*----------------------------------------------------------------------------*/
	function wd_copy(value) { /* copia o conteúdo da variável para a área de transferência */
		/* copiar o que está selecionado */
		if (value === undefined && "execCommand" in document) {
			document.execCommand("copy");
			return true;
		}
		/* copiar DOM: elemento ou tudo */
		let data = wd_vtype(value);
		if (data.type === "dom" && "execCommand" in document) {
			let element = data.value.length > 0 ? data.value[0] : document.body;
			let range   = document.createRange();
			let select  = window.getSelection();
			select.removeAllRanges();          /* limpar seleção existente */
			range.selectNodeContents(element); /* pegar os nós do elemento */
			select.addRange(range);            /* seleciona os nós do elemento */
			document.execCommand("copy");      /* copia o texto selecionado */
			select.removeAllRanges();          /* limpar seleção novamente */
			return true;
		}

		/* array e object: JSON */
		if (data.type === "array" || data.type === "object")
			value = wd_json(value);

		/* copiar valor informado */
		if ("clipboard" in navigator && "writeText" in navigator.clipboard) {
			navigator.clipboard.writeText(value === null ? "" : value).then(
				function () {/*sucesso*/},
				function () {/*erro*/}
			);
			return true;
		}

		return false;
	}




/*============================================================================*/
/**#3 Atributos HTML dataset**/
/*============================================================================*/



/*----------------------------------------------------------------------------*/
	/**#4 Requisições
	''function void data_wd_send(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-send|
	|Objetivo|Efetuar requisições web|
	|Eventos|click|
	|Alvos|Conforme especificado|
	|Grupos|Múltiplo|
	|Referências|__Request.send, __Node.submit|
	span{ }
	|Propriedades|Tipo|Descrição|
	|query|string|Seletor CSS dos campos de formulário a serem enviados|
	|noValidate|boolean|Se verdadeiro, a requisição não fará a validação primária dos campos.|
	|trigger|function|Nome do disparador a ser chamado durante a requisição.|
	Observações:
	- Demais propriedades seguem a definição de __Request.send, exceto i{body}, que será definido por '{query}; e
	- O disparador deve estar contido no escopo de '{window} utilizando-se de '{var} ou '{function}.**/
	function data_wd_send(target, event, wdArray) {
		let test, data, query, submit, trigger, head;
		for (let i = 0; i < wdArray.length; i++) {
			data    = wdArray[i];
			test    = new __Type(data.query);
			query   = test.node ? data.query : document.body;
			trigger = data.trigger;
			submit  = WD(query).submit(data.url, data.method, data.noValidate);
			/*-- cabeçalho --*/
			data.headers = new __DataSet(data.headers);
			/*-- Efetuar requisição se não encontrados erros --*/
			if (submit !== null) {
				data.url  = submit.url;
				data.body = submit.body;
				if (!data.headers.has("content-type"))
					data.headers.set("content-type", submit.ctype);
				WD(data).send(trigger);
			}
		}
		return;
	}

/*----------------------------------------------------------------------------*/
	/**#4 Requisições: formulários
	''function void data_wd_submit(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-submit|
	|Objetivo|Efetuar requisições assícronas por submissão de formulário|
	|Eventos|submit|
	|Alvos|Campos do elemento formulário|
	|Grupos|Único|
	|Referências|__Request.send, __Node.submit|
	Mecanismo semelhante à função '{data_wd_send} com as seguintes observações:
	- A propriedade query não se aplica, o conteúdo de i{body} é definido pelos campos vinculados ao formulário;
	- A propriedade i{url} é definida pelo atributo i{action} do formulário;
	- A propriedade i{method} é definida pelo atributo i{method} do formulário;
	- A propriedade i{noValidate} é definida pelo atributo i{noValidate} do formulário; e
	- A propriedade i{content-type} em i{headers} é definida pelo atributo i{enctype} do formulário.**/
	function data_wd_submit(target, event, wdArray) {
		const data  = wdArray[0];
		const form  = target;
		const query = form.elements;
		const html  = {method: null,	enctype: null, action: null, noValidate: null};
		const enter = (function(){
			const elem = document.activeElement;
			const test = new __Type(elem);
			const node = new __Node(test.node ? elem : form);
			const type = /^(image|submit)$/;
			return elem.form !== form || !type.test(node.ftype) ? null : elem;
		})();
		/*-- cabeçalho --*/
			data.headers = new __DataSet(data.headers);
		/*-- Informações do formulário: button ou form --*/
		for (let i in html) {
			/*-- 1) procurar atributo no elemento acionador --*/
			if (enter !== null) {
				const camel = "form"+(i.replace(i[0], i[0].toUpperCase()));
				const lower = camel.toLowerCase();
				const value = enter.hasAttribute(lower) ? enter[camel].trim() : "";
				html[i] = value !== "" ? value : null;
			}
			/*-- 2) se não localizado, buscar no formulário --*/
			if (html[i] === null) {
				const valid = !__Type(form[i]).node;
				const value = form.hasAttribute(i) ? form.getAttribute(i).trim() : "";
				html[i] = valid ? form[i] : (value !== "" ? value : null);
			}
		}
		/*-- Redefinindo atributos de configuração para envio à data_wd_send --*/
		if (html.method     !== null) data.method = html.method;
		if (html.action     !== null) data.url = html.action;
		if (html.enctype    !== null) data.headers.set("content-type", html.enctype);
		if (html.noValidate !== null) data.noValidate = html.noValidate;
		data.query = query;
		return data_wd_send(target, event, [data]);
	}



/*----------------------------------------------------------------------------*/
	/**#4 Atribuição de Valores
	''function void data_wd_tools(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-tools|
	|Objetivo|Define ações aos elementos definidos por meio dos métodos de WDnode.|
	|Eventos|click|
	|Alvos|Elementos que possar receber cliques|
	|Grupos|Múltiplos|
	|Referências|__Node|
	span{ }
	Observações:
	- as ações serão aplicadas aos elementos definidos pela propriedade '{query} (seletor CSS de elementos);
	- se '{query} estiver ausente no grupo, terá como valor o próprio elemento; e
	- os argumentos dos métodos devem ser informados em arrays.**/
	function data_wd_tools(target, event, wdArray) {
		/*-- looping sobre os grupos --*/
		wdArray.forEach(function(group,i,a) {
			const test  = new __Type(group.query);
			const query = test.node ? group.query : target;
			const tools = WD(query);
			console.log({query: query, type: tools.type})
			/*-- looping pelos métodos --*/
			for (let method in group) {
				let check1 = new __Type(tools[method]);
				let check2 = new __Type(group[method]);
				if (check1.function && check2.array)
					tools[method].apply(tools, group[method]);
			}
		});
		return;
	};

/*----------------------------------------------------------------------------*/
	/**#4 Gráficos 2D
	''function void data_wd_chart(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-chart|
	|Objetivo|Cria um gráfico 2D a partir de comandos e dados em arquivos ou elementos.|
	|Eventos|load wdreload wddataset|
	|Alvos|Elementos que possar receber filhos renderizáveis|
	|Grupos|Único|
	|Referências|__Table.plot|
	Observações:
	- As propriedades do atributo têm a mesma estrutura do argumento do método __Table.plot;
	- O gráfico gerado substituirá o conteúdo do alvo;
	- A fonte de dados (opcional), é especificada por meio da propriedade '{source};
	- '{source} pode ser um elemento HTML (nó) ou o caminho (string) para um arquivo CSV ou JSON (array de duas dimensões);
	- No caso de fonte externa, as propriedades de i{data_wd_send}, exceto i{trigger} e i{type}, são aceitas;
	- O elemento poderá ser uma tabela, um campo de formulário ou elemento com conteúdo textual;
	- No caso de formulário ou conteúdo textual, o formato do conteúdo deverá ser em CSV.**/
	function data_wd_chart(target, event, wdArray) {
		const data = wdArray[0];
		const test = new __Type(data.source);
		const plot = function (input) {
			const table = new __Table(input);
			const svg   = table.plot(data);
			if (svg !== null) {
				target.innerHTML = "";
				target.appendChild(svg);
			}
		}
		/*-- elemento HTML como fonte de dados --*/
		if (test.node && test.value.length > 0) {
			const elem  = test.value[0];
			const node  = new __Node(elem);
			const form  = node.form && !node.ftext;
			const input = form ? elem.value : (node.tag === "table" ? elem : elem.textContent);
			plot(input);
		}
		/*-- arquivo CSV/JSON como fonte de dados --*/
		else if (test.nonempty) {
			data.url     = data.source;
			data.type    = "table";
			data.trigger = function(x) {
				if (x.done)
					plot(x.ok && x.response !== null ? x.response : undefined);
			};
			data_wd_send(target, event, [data]);
		}
		/*-- sem fonte de dados --*/
		else {
			plot();
		}
		return;
	}

/*----------------------------------------------------------------------------*/
	/**#4 Auto Clique
	''function void data_wd_click(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-click|
	|Objetivo|Promover eventos de clicagem ao elemento|
	|Eventos|load wdreload wddataset|
	|Alvos|Elementos que possam receber click|
	|Grupos|Único|
	|Referências|-|
	span{ }
	|Propriedades|Tipo|Descrição|
	|time|integer|Intervalos de tempo, em milissegundos, entre cliques (opcional)|
	|times|integer|Quantidade de vezes a repetir (opcional)|
	Observações:
	- Se '{time} for informado e '{times} não, a repetição ocorrerá indefinidamente;
	- Se '{times} for informado e '{time} não, a repetição ocorrerá sem intervalo de tempo;
	- Se nem '{time} e nem '{times} for informado, apenas um clique será executado;**/
	function data_wd_click(target, event, wdArray) {
		const data = wdArray[0];
		/*-- não há atributo: apagar identificador da interação --*/
		if (!("wdClick" in target.dataset)) {
			delete target.dataset.wdClickId;
		}
		/*-- primeira interação: executar clique e preparar repetições (com ou sem intervalo) --*/
		else if (event !== data) {
			const test = {time: new __Type(data.time), times: new __Type(data.times)};
			data.time  = test.time.integer  && test.time  > 0 ? test.time.value  : 0;
			data.times = test.times.integer && test.times > 0 ? test.times.value : 0;
			data.id    = String(new Date().valueOf());
			/*-- executar clique principal --*/
			target.click();
			/*-- repetir sem intervalo de tempo --*/
			if (data.time === 0) {
				while (--data.times > 0)
					target.click();
				delete target.dataset.wdClick;
			}
			/*-- repetir com intervalo de tempo --*/
			else {
				data.times = data.times === 0 ? Infinity : data.times;
				target.wdClickId = data.id;
				window.setTimeout(function() {
					data_wd_click(target, data, [data]);
				}, data.time);
			}
		}
		/*-- segunda interação: id válido --*/
		else if (data.id === target.wdClickId) {
			/*-- com repetições pendentes --*/
			if (--data.times > 0) {
				target.click();
				window.setTimeout(function() {
					data_wd_click(target, data, [data]);
				}, data.time);
			}
			/*-- sem repetições pendentes --*/
			else {
				delete target.wdClickId;
				delete target.dataset.wdClick;
			}
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	/**#4 Filtro Textual
	''function void data_wd_filter(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-filter|
	|Objetivo|Filtrar elementos de acordo com seu conteúdo textual|
	|Eventos|load wdreload wddataset input|
	|Alvos|Elementos que possam receber digitação|
	|Grupos|Único|
	|Referências|__Node.filter|
	span{ }
	|Propriedades|Tipo|Descrição|
	|query|string|Seletor CSS que define os elementos que terão seus filhos filtrados|
	|size|integer|Mesmo propósito do argumento de __Node.filter (opcional)|**/
	function data_wd_filter(target, event, wdArray) {
		const data   = wdArray[0];
		const query  = WD(data.query);
		const size   = data.size;
		const node   = new __Node(target);
		const regexp = /^\/(.+)\/([gim]+)?$/;
		const value  = target[node.form && !node.ftext ? "value" : "innerText"];
		const search = !regexp.test(value) ? value : (function() {
			const arg1 = value.replace(regexp, "$1");
			const arg2 = value.replace(regexp, "$2");
			return new RegExp(arg1, arg2);
		})();
		if (query.type === "node")
			query.filter(search, size);
		return;
	};


/*----------------------------------------------------------------------------*/
	/**''function void data_wd_edit(node target, object event, array wdArray)''
	Função com o propósito de formatar textos em elementos editáveis por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-edit|click|Único|Múltiplos|-|Elementos que possa receber click|
	As propriedades e seus valores são advindas da ferramenta nativa i{execCommand}. TODO melhorar isso**/
	function data_wd_edit(target, event, wdArray) {
		const data = wdArray[0]
		for (let cmd in data) {
			let arg = data[cmd].trim() === "" ? undefined : data[cmd].trim();
			if (cmd === "createLink") {
				arg = prompt("Link:", "https://...");
				if (arg === null || arg.trim() === "") cmd = "unlink";
			}
			else if (cmd === "insertImage") {
				arg = prompt("Link:", "https://...");
			}
			document.execCommand(cmd, false, arg);
		}
		return;
	};







/*----------------------------------------------------------------------------*/
	/**''function void data_wdValue(node  e, object event)''
	Função vinculada ao atributo HTML '{data-wd-value} cujos objetivos são:
	- Aplicar e validar máscara;
	- Validar dados;
	- Renderizar dados; e
	- Obter e definir valores da URL.
	Possui múltiplos atributos e grupo único:
	|Nome|Descrição|
	|mask|Define o modelo da máscara a ser aplicada ao conteúdo.|
	|fail|Texto do erro da máscara.|
	|$$ ou $|Seletores CSS dos elementos de entrada vinculados ao valor de saída (i{output}).|
	|valid|Nome da função, definida no escopo de i{windows} com i{var} ou i{function}, para validar o valor.|
	|output|Nome da função, definida no escopo de i{windows} com i{var} ou i{function}, para definir o valor de saída.|
	A função i{output} será chamada quando os elementos de entrada dispararem um evento i{input}. Ela também será chamada ao carregar conteúdo ou definir o atributo. A função receberá o elemento e deverá retornar o seu valor.
	A aplicação da máscara será avalida nos carregamento de conteúdo, definição de atributo e quando o elemento perder o foco. Será chamada também no evento i{input} se i{output} for chamada. Se o conteúdo não casar com a máscara, o nó assumirá como mensagem de erro o valor de '{fail} ou o modelo da máscara.
	A função i{valid} será chamada nos carregamento de conteúdo e definição de atributo. A função receberá o elemento e deverá retornar o valor da mensagem de erro ou uma string em branco se não houver. No evento i{input}, i{valid} só será executada se i{output} tiver sido chamada.**/
	function data_wd_output(target, event, wdArray) {
		const nodes = WD.$$("[data-wd-output]");
		nodes.forEach(function(output,i) {
			const parser  = new __Parser(output.dataset.wdOutput);
			const wdarray = parser.wdArray.get();
			if (wdarray !== null) {
				const input = target;
				const data  = wdarray[0];
				const query = data.$$ || data.$ || null;
				const call  = __Type(data.call).function ? data.call : null;
				const list  = new __Type(query).value;
				if (query === null || call === null || list.indexOf(target) < 0) return;
				if ("$"  in data) delete data["$"];
				if ("$$" in data) delete data["$$"];
				delete data["call"];
				call(input, output, data)
			}
		});
		return;
	};


























/*----------------------------------------------------------------------------*/
	/**''function void data_wd_code(node target, object event, array wdArray)''
	Função com o propósito de definir exibições de codificação por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-code|load wdreload input|Múltiplas|Único|__Code|Elemento que possa receber texto de codificação.|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|word|string|Palavras reservadas da codificação|
	|value|string|Valores específicos da codificação|
	|string|string|Caracteres de abertura e fechamento de string|
	|comment|string|Caracteres de abertura e fechamento de comentários|
	|editable|boolean|Informa se o container poderá ser editado|
	|lines|boolean|Informa se as linhas serão numeradas|**/
	function data_wd_code(target, event, wdArray) {
		const data = wdArray[0];
		const node = new __Node(target);
		const text = node.form ? target.value : target.innerText.replace(/\s$/, "");
		const edit = data.editable !== true;
		const line = data.lines !== false;
		const code = new __Code(text);
		const tags = {code: "DIV", mask: "DIV", text: "TEXTAREA"};
		const name = ["value", "comment", "word", "string"];
		/*-- configurando código --*/
		for (let i = 0; i < name.length; i++) {
			if (name[i] in data)
				code.add(name[i], String(data[name[i]]));
		}
		/*-- construindo container e definindo propriedades --*/
		for (let i in tags) {
			tags[i] = document.createElement(tags[i]);
			tags[i].dataset.wdEncoding = i;
			tags[i].spellcheck = false;
			tags[i].translate  = false;
			if (i === "text") {
				tags[i].value    = text;
				tags[i].readOnly = edit;
				tags[i].id       = target.id;
			}
		}
		/*-- definindo disparador --*/
		tags.text.oninput  = function(ev) {
			code.input = tags.text.value;
			if (line) {
				const number = new __Number(code.input.split("\n").length);
				tags.code.dataset.wdEncodingLines = number.exp;
			}
			tags.mask.innerHTML = code.valueOf();
		};
		/*-- montando blocos e executando --*/
		tags.code.appendChild(tags.mask);
		tags.code.appendChild(tags.text);
		target.parentElement.replaceChild(tags.code, target);
		tags.text.oninput();
		return;
	};








/*----------------------------------------------------------------------------*/
	/**''function void data_wd_move(node target, object event, array wdArray)''
	Função com o propósito de mover o elemento por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-move|mousedown mousemove e mouseup|Único|Único|-|Elementos que possam ser movidos|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|$|node|Seletor CSS que define a o elemento a ser movido|
	O atributo i{data-wd-move} deve ficar sobre o elemento âncora e a propriedade i{$} especificará o elemento que será movido. Para um movimento padrão, a âncora deve ser um filho do elemento a se mover, se não definido, será o próprio elemento. Elementos com posicionamento i{static} e i{sticky} não serão movimentados.**/
	function data_wd_move(target, event, wdArray) {
		const data = wdArray[0];
		//FIXME aplicar __MOVE e estabelecer as teclas para acionar
		return;
	}

/*----------------------------------------------------------------------------*/
	/**''function void data_wd_drag(node target, object event, array wdArray)''
	Função com o propósito de arrastar elementos por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-drag|mousemove, dragstart e dragend|Múltipla|Múltiplos|-|Nós de elementos que possam ser arrastados|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|effect|string|(obrigatório) Efeito do arrasto: move, copy ou link|
	|drop|function|Função a ser executada ao derrubar o elemento|
	|$ ou $$|String|(obrigatório) Seletores CSS que identifica os elementos receptores do arrasto para o efeito especificado|
	Se o elemento arrastável tiver múltiplos efeitos, cada efeito deverá ser informado em um grupo diferente cuidando para que não haja concomitâncias de elementos receptores entre os grupos (o efeito do último grupo prevalecerá).
	A função '{drop} receberá como argumentos o elemento drop, o elemento drag e o efeito aplicado. Se nenhum função for especificada, um comportamento padrão será executado de acordo com o efeito definido.
	O elemento receptor não pode ser o elemento pai e nem o elemento arrastável ou estar contido nele.**/
	function data_wd_drag(target, event, wdArray) {
		const data = wdArray;
		return;
	}

/*----------------------------------------------------------------------------*/
	/**''function void data_wd_drop(node target, object event, array wdArray)''
	Função com o propósito de definir o comportamento do elemento ao receber arquivos arrastáveis por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-drop|dragover, dragleave e drop|Único|Múltiplos|-|Nós que podem receber informações de arquivos.|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|drop|function|Função a ser chamada ao derrubar os arquivos|
	A função i{drop} receberá como argumentos o elemento drop e os arquivos arrastáveis (FileList) e, se não informada, uma ação padrão será realizada. Nessa ação padrão, tentar-se-á carregar o arquivo na página (o primeiro arquivo de tamanho até 1000000 Bytes apenas).**/
	function data_wd_drop(target, event, wdArray) {}
/*----------------------------------------------------------------------------*/
	/**''function void data_wdTsort(node  e, object event)''
	Função vinculada ao atributo HTML '{data-wd-tsort} cujo objetivo é ordenar colunas específicas de tabelas. Não possui atributo.**/
	function data_wdTsort(e, event) {
		if (!("wdTsort" in e.dataset)) return;
		try {
			let thead = e.parentElement.parentElement;
			if (thead.tagName.toLowerCase() !== "thead") return;
			let tbody = thead.parentElement.tBodies;
			let heads = __Type(e.parentElement.children).value;
			let index = heads.indexOf(e);
			let data  = __String("").wdValue(e.dataset.wdTsort);
			let sort  = data === 1 ? -1 : 1;
			WD(tbody).display("["+(sort * (index + 1))+"]");
			heads.forEach(function(v,i,a) {
				if ("wdTsort" in v.dataset)
					v.dataset.wdTsort = v === e ? (sort > 0 ? "+1" : "-1") : "";
			});
		} catch(e) {}
		return;
	};




/*----------------------------------------------------------------------------*/
	function data_wdShared(e, event) { /* FIXME pendente Experimental: compartilhar em redes sociais: data-wd-shared=rede */
		if (!("wdShared" in e.dataset)) return;
		let url    = encodeURIComponent(document.URL);
		let title  = encodeURIComponent(document.title);
		let social = e.dataset.wdShared.trim().toLowerCase();
		let link   = {
			/* https://developers.facebook.com/docs/workplace/sharing/share-dialog/#sharedialogvialink */
			/* https://developers.facebook.com/docs/plugins/share-button/ */
			facebook: "https://www.facebook.com/sharer.php?u="+url,
			/* https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent */
			twitter:  "https://twitter.com/intent/tweet?url="+url+"&text="+title,
			/* https://www.coderstool.com/share-social-link-generator */
			linkedin: "https://www.linkedin.com/shareArticle?url="+url+"&title="+title,
			/* https://www.reddit.com/dev/api#POST_api_submit */
			reddit:   "https://reddit.com/submit?url="+url+"&title="+title,
			/* https://www.coderstool.com/share-social-link-generator */
			evernote: "https://www.evernote.com/clip.action?url="+url+"&title="+title,
			/* https://core.telegram.org/widgets/share */
			telegram: "https://t.me/share/url?url="+url+"&text="+title,
			/* https://faq.whatsapp.com/563219570998715/?locale=en_US */
			whatsapp: "https://wa.me/?text="+url,
		}
		if ("clipboard" in navigator) navigator.clipboard.writeText(document.URL);
		if (social in link) {window.open(link[social]);}

		return;
	};

/*----------------------------------------------------------------------------*/
/**''function void data_wd_float(node target, object event, array wdArray)''
	Função com o propósito de exibir elementos no ponto de clicagem por meio do atributo HTML i{data}.


	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-move|dragstart e dragend|Único|Múltiplos|-|Nós de elementos que possam ser arrastados|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|type|string|Tipo do movimento, que deve ser i{drag}|
	|effect|array|Efeitos do movimento: i{hide, move, copy e link}|**/
	function data_wd_float(target, event, wdArray) {
		console.log(wdArray[0])
		const data  = wdArray[0];
		const query = data.$ || data.$$ || null;
		const check = new __Type(query);
		const float = check.node ? check.value[0] : null;
		if (float !== null) {
			/*-- definindo propriedades e atributos --*/
			document.body.appendChild(float);
			float.tabIndex = -1;
			float.setAttribute("aria-modal", "false");
			float.onkeydown = function(ev) {
				ev.preventDefault();
				const re = /^(Escape|Tab)/i;
				if (re.test(ev.key)) float.style.display = "none";
			}
			/*-- definindo estilos --*/
			const place = target.getBoundingClientRect();
			float.style.position  = "fixed";
			float.style.display   = "block";
			float.style.maxWidth  = "30vw";
			float.style.maxHeight = "75vw";
			if (event.clientY > (window.innerHeight/2))
				float.style.top = (event.clientY - place.height)+"px";
			else
				float.style.top = (event.clientY)+"px";
			if (event.clientX > (window.innerWidth/2))
				float.style.left = (event.clientX - place.width)+"px";
			else
				float.style.left = (event.clientX)+"px";
			/*-- Focando no primeiro elemento focável --*/
			const child = float.querySelectorAll("*");
			for (let i = 0; i < child.length; i++) {
				if (child[i].tabIndex >= 0) {
					child[i].focus();
					break;
				}
			}
		}
		return;
	};

						//FIXME nos atributos dataset de clicar devo colocar tabindex, role e onkeydown?
						//TODO ideia: no evento keydown de enter forçar um click e tá resolvido
						//TODO ideia: no load e set definir tabindex se o atributo for de clique



/*============================================================================*/
/* -- DISPARADORES -- */
/*============================================================================*/
	/**''const object __EVENTS''
	Registra os eventos da biblioteca e seus disparadores.
	O primeiro nível de dados diz respeito ao nome do evento cujo valor é um objeto.
	O segundo nível de propriedades possui as seguintes características:
	|Nome|Tipo|Descrição|
	|target|object|É o alvo genérico (bubble) do disparador (window, document)|
	|preventDefault|boolean|Define se evoca o método preventDefault dp evento|
	|data|Array|Lista de objetos contendo a configuração de cada evento|
	|extra|string|Define uma especifidade a ser verificada para o evento (opcional)|
	Os itens da lista definida em '{data} possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|name|string ou nulo|Define o seletor CSS, se existir, vinculado ao disparador|
	|kill|boolean|Define se o atributo dataset será excluído após chamar o disparador|
	|bind|object|Propriedades obrigatórias do dataset que serão definidas caso não tenham sido|
	|call|function|nome do disparador|
	|extra|string|Define uma especifidade a ser verificada para o método (opcional)|
	Quanto aos tipo de seletores, tem-se:
	|Tipo|Exemplo|Comportamento|
	|atributo data|[data-wd-nome]|Aplica-se ao elementos descendentes do alvo|
	|atributo data|*[data-wd-nome]|Aplica-se ao elementos descendentes do documento|
	|propriedade dataset|wdNome|Aplica-se ao elemento titular da propriedade|
	|Seletor CSS|*|Aplica-se aos elementos identificados pelo seletor definido|
	|null|null|Aplica-se ao alvo específico|
	Regras específicas:
	- Se a propriedade '{target} for definida como window, document será considerado como alvo;
	- Os eventos só ocorrem para elementos HTML (tipo 1) ou document (tipo 9);
	- O valor dos tipos "atributo data" e "propriedade dataset" precisa estar no formato wdArray obrigatoriamente;
	- As propriedades '{bind} e '{kill} se aplicam apenas aos tipos "atributo data" e "propriedade dataset";
	- O disparador '{call} receberá como argumentos o alvo, os dados do evento e uma lista wdArray; e
	- A lista wdArray será nula nos casos de tipos diferentes de "atributo data" e "propriedade dataset".**/
	//FIXME quando o evento de clique receber um enter, forçar um click
	//FIXME implantar extra para cada disparador
	const __EVENTS = {
		wdreload: {
			target: window, preventDefault: false,
			data: [
				{name: "[data-wd-repeat]", call: data_wd_repeat,  kill: true,  bind: {headers: {}}},
				{name: "[data-wd-load]",   call: data_wd_load,    kill: true,  bind: {headers: {}}},
				{name: "[data-wd-chart]",  call: data_wd_chart,   kill: true,  bind: {}},
				{name: "[data-wd-code]",   call: data_wd_code,    kill: true,  bind: {}},
				{name: "[data-wd-click]",  call: data_wd_click,   kill: false, bind: {}},
				{name: "[data-wd-filter]", call: data_wd_filter,  kill: false, bind: {}},
				{name: "[data-wd-mask]",   call: data_wd_mask,    kill: false, bind: {}},
				{name: "[data-wd-device]", call: data_wd_device,  kill: false, bind: {}},
				{name: "[data-wd-tabs]",   call: data_wd_tabs, kill: true,  bind: {}},
			]
		},
		wddataset: {
			target: document, preventDefault: false, extra: "wddatasetList",
			data: [
				{name: "wdRepeat", call: data_wd_repeat, kill: true,  bind: {headers: {}}},
				{name: "wdLoad",   call: data_wd_load,   kill: true,  bind: {headers: {}}},
				{name: "wdChart",  call: data_wd_chart,  kill: true,  bind: {}},
				{name: "wdCode",   call: data_wd_code,   kill: true,  bind: {}},
				{name: "wdClick",  call: data_wd_click,  kill: false, bind: {id: null}},
				{name: "wdFilter", call: data_wd_filter, kill: false, bind: {}},
				{name: "wdMask",   call: data_wd_mask,   kill: false, bind: {}},
				{name: "wdDevice", call: data_wd_device, kill: false, bind: {}},
				{name: "wdTabs",   call: data_wd_tabs,   kill: true,  bind: {}},
			]
		},
		submit: {
			target: document, preventDefault: true,
			data: [
				{name: "wdSubmit", call: data_wd_submit, kill: false, bind: {headers: {}}}
			]
		},
		//FIXME verificar o impacto de preventDefault nos disparadores de clique (testar todos)
		click: {
			target: document, preventDefault: false, extra: "leftClick",
			data: [
				{name: "wdSend",    call: data_wd_send,    kill: false, bind: {headers: {}}},
				{name: "wdTools",   call: data_wd_tools,   kill: false, bind: {}},
				{name: "wdEdit",    call: data_wd_edit,    kill: false, bind: {}},
			]
		},
		input: {
			target: document, preventDefault: false, extra: "checkTypingTime",
			data: [
				{name: "wdFilter", call: data_wd_filter, kill: false, bind: {id: null}},
				{name: null,       call: data_wd_output, kill: false, bind: {}}
			]
		},
		focusout: {
			target: document, preventDefault: false,
			data: [
				{name: "wdMask", call: data_wd_mask,   kill: false, bind: {}},
				//{name: null,      call: data_wd_output, kill: false, bind: {}}
			]
		},
		focusin: {
			target: document, preventDefault: false,
			data: [
				//{name: null, call: wdOnFocusIn, kill: false, bind: {}}
			]
		},
		drag: {
			target: document, preventDefault: false,
			data: []
		},
		dragstart: {
			target: document, preventDefault: false,
			data: [
				//{name: "wdDrag", call: data_wd_drag, kill: false, bind: {}}
			]
		},
		dragend: {
			target: document, preventDefault: false,
			data: [
				//{name: "wdDrag", call: data_wd_drag, kill: false, bind: {}}
			]
		},
		dragleave: {
			target: document, preventDefault: true,
			data: [
				//{name: "html", call: data_wd_drop, kill: false, bind: {}}
			]
		},
		dragover: {
			target: document, preventDefault: true,
			data: [
				//{name: null, call: data_wd_drop, kill: false, bind: {}}
			]
		},
		dragenter: {
			target: document, preventDefault: true,
			data: []
		},
		drop: {
			target: document, preventDefault: true,
			data: []
		},
		mousedown: {
			target: document, preventDefault: false, extra: "leftClick",
			data: []
		},
		mouseup: {
			target: document, preventDefault: false, extra: "leftClick",
			data: []
		},
		mousemove: {
			target: document, preventDefault: false,
			data: []
		},
		mouseenter: {
			target: document, preventDefault: false,
			data: [
				//{name: "wdDrag", call: data_wd_drag, kill: false, bind: {effect: "all"}}
			]
		},
		mouseleave: {
			target: document, preventDefault: false,
			data: []
		},
		mouseover: {
			target: document, preventDefault: false,
			data: [
				{name: "wdDrag", call: data_wd_drag, kill: false, bind: {}}
			]
		},
		mouseout: {
			target: document, preventDefault: false,
			data: []
		},
		dblclick: {
			target: document, preventDefault: false, extra: "leftClick",
			data: []
		},
		keydown: {
			target: window, preventDefault: false,
			data: [],
		},
	};

	/**''function void eventManager(event)''
	Disparador genérico da biblioteca, administra o conteúdo de __EVENTS.**/
	function eventManager(event) {
		/*-- Checar alvo do evento: elemento (1) ou documento (9) ----------------*/
		const target = event.target === window ? document : event.target;
		if ([1, 9].indexOf(target.nodeType) < 0) return;
		/*-- obtendo dados iniciais --*/
		const config    = __EVENTS[event.type];
		const dataset   = config.data;
		const wddataset = [];
		const trigger   = [];
		const search    = /^\*?\[(data\-wd\-[0-9a-zA-Z\-]+)(\=[^\]]+)?\]$/;//TODO retirar o $ do fim da re?
		const extra     = {
			 /*-- tempo mínimo para digitação encerrar --*/
			 typingTime: function(ev) {
				const body = document.body;
				if (!("wdTypingTime" in ev)) {
					ev.wdTypingTime   = new Date().valueOf();
					body.wdTypingTime = ev.wdTypingTime;
					window.setTimeout(function() {eventManager(ev);}, 500);
					return false;
				}
				if (ev.wdTypingTime === body.wdTypingTime) {
					delete ev.wdTypingTime;
					delete body.wdTypingTime;
					return true;
				}
				return false;
			},
			/*-- clique com o botão esquerdo do mouse --*/
			leftClick: function(ev) {
				return event.which === 1;
			},
			/*-- capturar as propriedades definidas em dataset (wddataset = variável global) --*/
			wddatasetList: function(ev) {
				if (ev.target.nodeType === 1 && "wddataset" in ev.target.dataset) {
					const list = ev.target.dataset.wddataset.split(" ");
					list.forEach(function(v,i,a) {wddataset.push(v);});
					delete ev.target.dataset.wddataset;
				}
				return true;
			},
		};

		/*-- checar especifidades de cada evento ---------------------------------*/
		if ("extra" in config && config.extra in extra)
			if (!extra[config.extra](event)) return;

		/*-- Lista de disparadores: elementos qua casam com o parâmetro ----------*/
		let map, root, name, query;
		for (let i = 0; i < dataset.length; i++) {
			map = dataset[i];
			/*-- Elementos descendentes com atributo HTML data: *[data-wd...] (wdArray) --*/
			if (search.test(map.name)) {
				root  = map.name[0] === "*" ? document : target;
				name  = map.name.replace(search, "$1");
				query = WD.$$(map.name, root);
				query.forEach(function(node) {
					trigger.push({
						target:  node,                    /*-- nó alvo --*/
						name:    map.name,                /*-- selector CSS --*/
						call:    map.call,                /*-- função a ser chamada --*/
						bind:    map.bind,                /*-- configurações iniciais do evento --*/
						value:   node.getAttribute(name), /*-- valor do atributo --*/
						wdArray: null,                    /*-- valor de wdArray --*/
					});
					if (map.kill) node.removeAttribute(name);
				});
			}
			/*-- Elementos por nome da propriedade dataset: wdNome (wdArray) --*/
			else if ("dataset" in target && map.name in target.dataset) {
				trigger.push({
					target:  target,
					name:    map.name,
					call:    map.call,
					bind:    map.bind,
					value:   target.dataset[map.name],
					wdArray: null,
				});
				if (map.kill) delete target.dataset[map.name];
			}
			/*-- Busca genérica, independente da propriedade dataset ou atributo HTML data --*/
			else {
				query = typeof map.name === "string" ? WD.$$(map.name, document) : [target];
				query.forEach(function(node) {
					trigger.push({
						target:  node,
						name:    map.name,
						call:    map.call,
						bind:    map.bind,
						value:   "",
						wdArray: null,
					});
				});
			}
		}

		/*-- Analisando e chamando disparadores ----------------------------------*/
		const info = {};
		let parser, wdarray, count = 0;
		trigger.forEach(function(map,i,a) {
			/*-- evento wddataset: verificar se a propriedade definida está prevista --*/
			if (wddataset.length > 0 && wddataset.indexOf(map.name) < 0)
				return;
			/*-- verificar se o valor do atributo pode ser obtido --*/
			parser  = new __Parser(map.value);console.log(map)
			wdarray = parser.wdArray.get();
			if (wdarray === null)
				return;
			if (wdarray.length === 0)
				wdarray.push({});
			/*-- verificar se há alguma propriedade obrigatória a definir --*/
			for (let prop in map.bind) {
				for (let j = 0; j < wdarray.length; j++) {
					if (!(prop in wdarray[j]))
						wdarray[j][prop] = map.bind[prop];
				}
			}
			map.wdArray = wdarray;



			/*-- log de manutenção--*/
			info[event.type] = map.name;
			info.call = map.call.name;
			info.data = map.wdArray;
			if (__UNDERMAINTENANCE) console.info(info);

			/*-- chamar disparador --*/
			if (config.preventDefault && count === 0)
				event.preventDefault();
			map.call(map.target, event, map.wdArray);
			count++;
		});
		return;
	};

	/*-- defininir eventos e disparadores --*/ //FIXME desabilitei isso aqui, ligar depois
	/*for (let ev in __EVENTS)
		__EVENTS[ev].target.addEventListener(ev, eventManager, false);*/



	window.addEventListener("resize", __DEVICE);
	window.addEventListener("resize", __HASH);
	window.addEventListener("hashchange", __HASH);
	window.addEventListener("wdreload", __HASH);
	window.addEventListener("load", function(ev) {
		document.dispatchEvent(wdReloadEvent);
		return;
	});
	/*-- retornar a função principal da biblioteca --*/
	return WD;
}());