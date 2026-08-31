/**
#3 Requisições e Leituras
	O objeto '{__REQUEST} tem o objetivo de efetuar a{requisições Web}@href{https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest} ou leituras de a{arquivos}@href{https://developer.mozilla.org/en-US/docs/Web/API/FileReader}.
	Os métodos de leitura e requisição recebem como argumento um objeto ('{data}) contendo os parâmetros para a interação. Os parâmetros principais são:
|Nome|'{send}|'{read}|'{fetch}|Descrição|
|'{url}|Sim|Sim|Sim|Dado obrigatório que define o alvo da requisição ou leitura.|
|'{call}|Sim|Sim|Sim|Disparador a ser chamado durante a interação.|
|'{type}|Sim|Sim|Sim|Define o tipo de resposta.|
|'{timeout}|Sim|Não|Sim|Inteiro que define o tempo máximo da interação em milissegundos, se implementado.|
|'{headers}|Sim|Não|Sim|Define o cabeçalho com as informações a enviar na interação.|
|'{body}|Sim|Não|Sim|Define os dados a serem enviados na interação.|
|'{method}|Sim|Não|Sim|Define a forma a realizar a interação (GET, POST, HEAD...).|
|""Tabelas dos principais parâmetros das requisições""|
Outros parâmetros podem ser aplicados a depender do método utilizado.
Cada método retorna um identificador que pode ser utilizado para abortar a interação durante o processo.
**/
const __REQUEST = {
	/**. '{object heap}: Registra as requisições em aberto com dados de '{target}, '{call}, '{init} e '{url}.**/
	heap: {},
	/**. '{string find(object ev)}: Retorna o id da requisição a partir dos dados do evento ou nulo.**/
	find: function(ev) {
		for (let id in this.heap) {
			if (this.heap[id].target === ev.target) return id;
		}
		return null;
	},
	/**. '{object fileHeader(object file)}: Retorna um cabeçalho contendo os dados do arquivo ('{File}/'{Blob}) se existentes:
	|Cabeçalho|Popriedade|Valor|
	|content-type|type|a{MIME Type}@href{https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types/Common_types}|
	|content-length|size|Tamanho do arquivo|
	|last-modified|lastModified|Última modificação|
	|content-disposition|name|Nome do arquivo guardado no atributo '{filename}|**/
	fileHeader: function(file) {
		const data = new __DataSet();
		const name = file.name ? __STRING.RFC5987(file.name) : null;
		if (file.type)         data.append("content-type",   file.type);
		if (file.size)         data.append("content-length", file.size);
		if (file.lastModified) data.append("last-modified",  file.lastModified);
		if (name !== null)     data.append("content-disposition", `attachment; filename="${file.name}"; filename*=UTF-8''${name}`);
		return data.toHeaders;
	},
	/**. '{object blob(string content, string type)}: Retorna um objeto do tipo '{Blob} com o conteúdo e tipo informado.**/
	blob: function(content, type) {
		return new Blob([content], {type: typeof type === "string" ? type.trim() : "application/octet-stream"});
	},



	//FIXME incorporar __FILE aqui?

	/**. '{object type}: Registra o parâmetro da propriedade '{type} que dispara as seguintes propriedades/métodos dos mecanismos nativos utilizados nas interações:
|Valor|'{send}|'{read}|'{fetch}|
|'{text}|'{text}|'{readAsText}|'{text}|
|'{buffer}|'{arraybuffer}|'{readAsArrayBuffer}|'{arrayBuffer}|
|'{blob}|'{blob}|'{readAsBinaryString}|'{blob}|
|'{doc}|'{document}|-|-|
|'{json}|'{json}|-|'{json}|
|'{url}|-|'{readAsDataURL}|-|**/
	type: {
		send:  {text: "text",       buffer: "arraybuffer",       blob: "blob",               json: "json", doc: "document"},
		read:  {text: "readAsText", buffer: "readAsArrayBuffer", blob: "readAsBinaryString", url: "readAsDataURL"},
		fetch: {text: "text",       buffer: "arrayBuffer",       blob: "blob",               json: "json", data: "formData"},
	},
	/**. '{void fix(object data)}: Acerta propriedades específicas da configuração da requisição.**/
	fix: function(data) {
		if (!__Type(data).object || !("url" in data))
			throw new TypeError(`The argument must be an object containing the "url" property.`);
		const method  = /^\s*(post|connect|delete|get|head|options|patch|put|trace)\s*$/i;
		const timeout = Number.isInteger(Number(data.timeout)) ? Number(data.timeout) : 0;
		data.method   = method.test(data.method) ? data.method.trim().toLowerCase() : "get";
		data.timeout  = timeout > 0 ? timeout : 0;
		data.headers = new __DataSet(data.headers);
		data.call    = typeof data.call === "function" ? data.call : null;
		data.type    = String(data.type).trim().toLowerCase();
		data.body    = !("body" in data) || (data.method === "get" || data.method === "head") ? null : data.body;
		return;
	},
	/**. '{string make(object data)}: Efetua a requisição ('{send}) ou leitura ('{read}) conforme o conteúdo da propriedade '{url}.**/
	make: function(data) {
		this.fix(data);
		if (data.url instanceof FileList || data.url instanceof Blob || data.url instanceof File)
			return this.read(data);
		return this.send(data);
	},


	/**. '{string send(object data)}: Efetua a requisição ao servidor via a{XMLHttpRequest}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest}target{_blank} e retorna seu identificador. As propriedades específicas são:
	- a{async}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest#async}target{_blank} (boolean);
	- a{user}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest#user}target{_blank} (string);
	- a{password}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest#password}target{_blank} (string);
	- a{withCredentials}@href{https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials}target{_blank} (boolean);
	- a{overrideMimeType}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest#overridemimetype}target{_blank} (string);**/
	send: function(data) {
		this.fix(data);
		const id      = __PROGRESS.open();
		const request = new XMLHttpRequest();
		const events  = ["load", "progress", "abort", "error", "timeout"];
		const mime    = "overrideMimeType" in data ? data.overrideMimeType : null;
		/*-- definindo requisição --*/
		request.open(data.method, data.url, data.async !== false, data.user ? data.user : null, data.password ? data.password : null);
		request.responseType    = this.type.send[data.type in this.type.send ? data.type : "text"];
		request.withCredentials = data.withCredentials === true;
		request.timeout         = data.timeout;
		data.headers.forEach(function(value,name,head) {
			request.setRequestHeader(name, value);
		});
		if  (mime !== null) request.overrideMimeType(mime);
		/*-- atribuindo disparadores aos eventos --*/
		events.forEach(function(ev,i,a) {
			if (`on${ev}` in request)
				request.addEventListener(ev, this);
			if (`on${ev}` in request.upload)
				request.upload.addEventListener(ev, this);
		}, this);
		/*-- registrar e executar a requisição --*/
		this.heap[id] = {init: Date.now(), target: request, call: data.call, url: data.url};
		request.send(data.body);
		return id;
	},
	/**. '{string read(object data)}: Lê um arquivo via a{FileReader}@href{https://developer.mozilla.org/en-US/docs/Web/API/FileReader}target{_blank} e retorna seu identificador.**/
	read: function(data) {
		this.fix(data);
		/*-- lista de arquivos --*/
		if (__Type(data.url).instanceOf("FileList")) {
			for (let i = 0; i < data.url.length; i++)
				this.read({url: data.url[i], type: data.type, call: data.call});
			return;
		}
		/*-- um único arquivo --*/
		const request = new FileReader();
		const events  = ["abort", "error", "load", "progress"];
		events.forEach(function(ev,i,a) {
			if (`on${ev}` in request)
				request.addEventListener(ev, this);
		}, this);
		/*-- registrar e executar a requisição --*/
		try {
			const id      = __PROGRESS.open();
			this.heap[id] = {init: Date.now(), target: request, call: data.call, url: data.url};
			request[this.type.read[data.type in this.type.read ? data.type : "text"]](data.url);
			return id;
		} catch(e) {
			return null;
		}
	},
	/**. '{string fetch(object data)}: Envia uma requisição ao servidor via a{fetch}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Using_Fetch}target{_blank} e retorna seu identificador. As propriedades específicas são as mesmas da ferramenta nativa de mesmo nome.**/
	fetch: function(data) {
		this.fix(data);
		const type  = data.type;
		const types = this.type.fetch;
		const main  = {init: Date.now(), call: data.call, url: data.url, target: new this.Fetch(data)}
		const id    = __PROGRESS.open();
		this.heap[id] = main;
		/*-- executando a requisição --*/
		fetch(main.url, data)
			.then(function(response) {
				main.target.trigger("progress", response, null, null);
				if (response.ok)
					response[types[type in types ? type : "text"]]()
						.then(function (result) {main.target.trigger("load", response, result, null);})
						.catch(function(fail)   {main.target.trigger("load", response, null, fail);});
			})
			.catch(function(error) {
				if (error.name === "AbortError")
    			main.target.trigger("abort", null, null, error);
  			else if (error.name === "TimeoutError")
  				main.target.trigger("timeout", null, null, error);
  			else
  				main.target.trigger("error", null, null, error);
			});
		return id;
	},
	/**. '{void abort(string id)}: Aborta a requisição vinculada ao identificador.**/
	abort: function(id) {
		if (id in this.heap)
			this.heap[id].target.abort();
		return;
	},
	/**. '{object sendResponse(object ev, object heap)}: Retorna dados básicos da requisição chamada pelo método '{send}.**/
	sendResponse: function(ev, heap) {
		const done    = {load: true, error: false, abort: false, timeout: false};
		const comp    = ev.lengthComputable === true && ev.total > 0;
		const data    = {};
		data.done     = ev.type in done;
		data.ok       = done[ev.type] === true && ev.target.status >= 200 && ev.target.status < 300;
		data.status   = done[ev.type] === false ? ev.type : `${ev.target.status} ${ev.target.statusText}`;
		data.progress = data.done ? 1 : (comp ? ev.loaded/ev.total : undefined);
		data.result   = data.ok ? ev.target.response : null;
		data.headers  = data.ok ? ev.target.getAllResponseHeaders() : null;
		return data;
	},
	/**. '{object readResponse(object ev, object heap)}: Retorna dados básicos da requisição chamada pelo método '{read}.**/
	readResponse: function(ev, heap) {
		const done    = {load: true, error: false, abort: false};
		const comp    = ev.lengthComputable === true && ev.total > 0;
		const status  = ["EMPTY", "LOADING", "DONE"][ev.target.readyState];
		const data    = {};
		data.done     = ev.type in done;
		data.ok       = done[ev.type] === true;
		data.status   = done[ev.type] === false ? ev.type : `${ev.target.readyState} ${status}`;
		data.progress = data.done ? 1 : (comp ? ev.loaded/ev.total : undefined);
		data.result   = data.ok ? ev.target.result : null;
		data.headers  = data.ok ? this.fileHeader(heap.url) : null;
		return data;
	},
	/**. '{constructor Fetch(object data)}: Disparador para o método '{fetch} para adequação à ferramenta face ausência de ouvintes.**/
	Fetch: function(data) {
		const timeout = data.timeout;
		delete data.type;
		delete data.url;
		delete data.timeout;
		data.headers = data.headers.toHeaders;
		/*-- acertando objeto --*/
		this.controller = typeof window.AbortController === "function" ? new AbortController() : null;
		if (this.controller !== null) {
			if ("AbortSignal" in window && timeout > 0)
				data.signal = AbortSignal.any([this.controller.signal, AbortSignal.timeout(timeout)]);
			else
				data.signal = this.controller.signal
		}
		/*-- método para abortar --*/
		this.abort = function() {
			if (this.controller !== null)
				this.controller.abort();
		};
		this.trigger = function(type, response, result, error) {
			this.response = response;
			this.error    = error;
			const done    = {load: true, error: false, abort: false, timeout: false};
			return __REQUEST.handleEvent({target: this, type: type, data: {
				done:     type in done,
				ok:       done[type] === true && response.ok,
				status:   done[type] === false ? type : `${response.status} ${response.statusText}`,
				progress: type in done ? 1 : undefined,
				headers: 	done[type] === true && response !== null ? response.headers : null,
				result:   result,
			}});
		}
	},
	/**. '{void handleEvent(object ev)}: Disparador que provoca os eventos de requisição e leitura. O método '{call} informado nos parãmetro da interação receberá como argumento um objeto com as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|'{target}|object|O objeto que provocou a interação.|
	|'{done}|boolean|Informa se a interação terminou.|
	|'{ok}|boolean|Informa se a interação terminou u{com sucesso}.|
	|'{status}|string|Uma mensagem sobre a interação.|
	|'{headers}|object|Dados do cabeçalho retornado.|
	|'{result}|any|Conteúdo retornado da interação.|
	|'{mime}|string|Tipo do conteúdo extraído da propriedade '{headers}.|
	|'{time}|integer|Tempo decorrido desde o início da interação.|
	|'{url}|any|Alvo da requisição/leitura.|
	|'{progress}|number|Valor do progresso da interação.|
	A interação pode terminar com sucesso ('{ok} verdadeiro) e o valor de '{result} ser falso se o tipo de resposta não corresponder ao conteúdo do alvo.**/
	handleEvent: function(ev) {
		const id = this.find(ev);
		if (id === null) return;
		/*-- obtendo as respostas --*/
		const heap = this.heap[id];
		let   data;
		if (ev.target instanceof XMLHttpRequest)
			data = this.sendResponse(ev, heap);
		else if (ev.target instanceof FileReader)
			data = this.readResponse(ev, heap);
		else if (ev.target instanceof this.Fetch)
			data = ev.data;
		/*-- refinando respostas --*/
		const head   = data.headers === null ? null : new __DataSet(data.headers);//console.log(head.getAll("content-type"));
		const mime   = head !== null && head.getAll("content-type").length > 0;
		data.time    = Date.now() - heap.init;
		data.headers = head === null ? null : head.toHeaders;
		data.mime    = mime ? head.getAll("content-type")[0].split(";")[0].replace(/\s+/g, "").toLowerCase() : "application/octet-stream";
		data.url     = heap.url;
		data.target  = ev.target;
		/*-- exibindo progresso --*/
		__PROGRESS.value(id, data.progress);
		/*-- chamando disparador --*/
		if (heap.call !== null) try {heap.call(data);} catch(e) {}
		/*-- encerradno --*/
		if (data.done) {
			__PROGRESS.close(id);
			delete this.heap[id];
		}
		return;
	},
};