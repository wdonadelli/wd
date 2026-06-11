/**
#3 Requisições e Leituras
	O objeto '{__REQUEST} tem o objetivo de efetuar a{requisições Web}@href{https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest} ou leituras de a{arquivos}@href{https://developer.mozilla.org/en-US/docs/Web/API/FileReader}.
	Os métodos de leitura e requisição recebem como argumento um objeto contendo os parâmetros da ação:
|Propriedade|Opcional|Descrição|
|'{url}|Não|Alvo da requisição ou leitura.|
|'{call}|Sim|Disparador a ser chamado a cada interação.|
|'{type}|Sim|O tipo da resposta de retorno.|

	A propriedade '{type} define as seguintes propriedades ou métodos dos mecanismos utilizados para efetuar a interação:
|Valor|send|read|fetch|
|text|text|readAsText|text|
|buffer|arraybuffer|readAsArrayBuffer|arrayBuffer|
|blob|blob|readAsBinaryString|blob|
|doc|document|-||
|json|json|-|json|
|url|-|readAsDataURL|-|

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
	//FIXME melhorar os textos, acabar com o construtor (ver outras páginas), criar método master


	/**. '{void fix(object data)}: Acerta propriedades específicas da configuração da requisição.**/
	fix: function(data) {
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
	/**. '{void send(object data)}: Efetua a requisição ao servidor via a{XMLHttpRequest}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest}target{_blank}. As propriedades específicas são:
	- a{method}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest#method}target{_blank} (string);
	- a{async}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest#async}target{_blank} (boolean);
	- a{user}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest#user}target{_blank} (string);
	- a{password}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest#password}target{_blank} (string);
	- a{withCredentials}@href{https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials}target{_blank} (boolean);
	- a{overrideMimeType}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest#overridemimetype}target{_blank} (string);
	- a{responseType}@href{https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType}target{_blank} (string);
	- a{headers}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest#setrequestheader}target{_blank} (string/object);
	- a{timeout}@href{https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout}target{_blank} (integer); e
	- a{body}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest#body}target{_blank}.**/
	send: function(data) {
		this.fix(data);
		const id      = __PROGRESS.open();
		const request = new XMLHttpRequest();
		const events  = ["load", "progress", "abort", "error", "timeout"];
		const mime    = "overrideMimeType" in data ? data.overrideMimeType : null;
		const types   = {text: "text", buffer: "arraybuffer", blob: "blob", doc: "document", json: "json"};
		/*-- definindo requisição --*/
		request.open(data.method, data.url, data.async !== false, data.user ? data.user : null, data.password ? data.password : null);
		request.responseType    = types[data.type in types ? data.type : "text"];
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
	/**. '{void read(object data)}: Lê um arquivo via a{FileReader}@href{https://developer.mozilla.org/en-US/docs/Web/API/FileReader}target{_blank}.**/
	read: function(data) {
		/*-- lista de arquivos --*/
		if (__Type(data.url).instanceOf("FileList")) {
			for (let i = 0; i < data.url.length; i++)
				this.read({url: data.url[i], type: data.type, call: data.call, url: data.url});
			return;
		}
		/*-- um único arquivo --*/
		this.fix(data);
		const request = new FileReader();
		const events  = ["abort", "error", "load", "progress"];
		const types   = {text: "readAsText", buffer: "readAsArrayBuffer", blob: "readAsBinaryString", url: "readAsDataURL"};
		events.forEach(function(ev,i,a) {
			if (`on${ev}` in request)
				request.addEventListener(ev, this);
		}, this);
		/*-- registrar e executar a requisição --*/
		try {
			const id      = __PROGRESS.open();
			this.heap[id] = {init: Date.now(), target: request, call: data.call, url: data.url};
			request[types[data.type in types ? data.type : "text"]](data.url);
			return id;
		} catch(e) {
			return null;
		}
	},
	/**. '{void fetch(object data)}: Envia uma requisição ao servidor via a{fetch}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Using_Fetch}target{_blank}. As propriedades específicas são as mesmas da ferramenta nativa de mesmo nome.**/
	fetch: function(data) {
		this.fix(data);
		const types = {text: "text", buffer: "arrayBuffer", blob: "blob", json: "json", data: "formData"};
		const type  = data.type;
		const main  = {init: Date.now(), call: data.call, url: data.url, target: new this.Fetch(data)}
		const id    = __PROGRESS.open();
		this.heap[id] = main;
		/*-- executando a requisição --*/
		fetch(main.url, data)
			.then(function(response) {
				main.target.trigger("progress", response, null);
				if (response.ok)
					response[types[type in types ? type : "text"]]()
						.then(function (result) {main.target.trigger("load", response, result);})
						.catch(function(fail)   {main.target.trigger("load", response, null);});
			})
			.catch(function(error) {
				if (error.name === "AbortError")
    			main.target.trigger("abort", null, null);
  			else if (error.name === "TimeoutError")
  				main.target.trigger("timeout", null, null);
  			else
  				main.target.trigger("error", null, null);
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
		data.headers  = data.ok ? __FILE.toHeaders(heap.url) : null;
		return data;
	},
	/**. '{constructor Fetch(object data)}: Disparador para o método '{fetch} para se adequar à ferramenta face ausência de ouvintes.**/
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
		this.trigger = function(type, response, result) {
			this.response = response;
			const done    = {load: true, error: false, abort: false, timeout: false};
			return __REQUEST.handleEvent({target: this, type: type, data: {
				done:     type in done,
				ok:       done[type] === true && response.ok,
				status:   done[type] === false ? type : `${response.status} ${response.statusText}`,
				progress: undefined,
				headers: 	done[type] === true && response !== null ? response.headers : null,
				result:   result,
			}});
		}
	},
	/**. '{void handleEvent(object ev)}: Disparador que provoca os eventos de requisição e leitura. O disparador '{call} informado nos métodos receberá um objeto como argumento com as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|target|object|O objeto que provocou a interação.|
	|done|boolean|Informa se a interação terminou.|
	|ok|boolean|Informa se a interação terminou u{com sucesso}.|
	|status|string|Uma mensagem sobre a interação.|
	|headers|object|Dados do cabeçalho retornado.|
	|result|any|Conteúdo retornado da interação.|
	|mimeType|string|Tipo do conteúdo.|
	|elapsedTime|integer|Tempo decorrido desde o início da interação.|
	|progress|number|Valor do progresso da interação.|**/
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
		const head       = data.headers === null ? null : new __DataSet(data.headers);
		data.elapsedTime = Date.now() - heap.init;
		data.headers     = head === null ? null : head.toHeaders;
		data.mimeType    = head === null ? null : head.getAll("content-type").join(",");
		data.target      = ev.target;
		/*-- exibindo progresso --*/
		__PROGRESS.value(id, data.progress);
		/*-- chamando disparador --*/
		if (typeof heap.call === "function") try {heap.call(data);} catch(e) {}
		/*-- encerradno --*/
		if (data.done) {
			__PROGRESS.close(id);
			delete this.heap[id];
		}
		return;
	},
};

































































/**
#3 Requisições
O constructor '{__Request} tem o objetivo de efetuar a{requisições Web}@href{https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest} ou leituras de a{arquivos}@href{https://developer.mozilla.org/en-US/docs/Web/API/FileReader}. Recebe como argumento um objeto cujos nomes e valores dependem do método de leitura escolhido. As propriedades abaixo são comuns aos três métodos de leitura:
|Propriedade|Descrição|
|url|Alvo da requisição ou da leitura, não necessariamente uma URL, é obrigatória.|
|call|Função que define o disparador a ser chamado a cada interação.|
|type|O tipo da resposta de retorno|
A propriedade '{type} substitui as seguintes propriedades ou métodos:
|Valor|send (responseType)|read|fetch|
|text|text|readAsText|text|
|buffer|arraybuffer|readAsArrayBuffer|arrayBuffer|
|blob|blob|readAsBinaryString|blob|
|doc|document|-||
|json|json|-|json|
|url|-|readAsDataURL|-|
|data|-|-|formData|
**/




function __Request(data) {
	if (!(this instanceof __Request)) return new __Request(data);
	if (data     === null || typeof data !== "object") throw new TypeError("The request argument must be an object!");
	if (data.url === null || data.url === undefined)   throw new TypeError("The url property is required for the request!");
	const reMt = /^post|connect|delete|get|head|options|patch|put|trace$/i;
	const main = {};
	for (let i in data) main[i] = data[i]
	main.call    = typeof main.call === "function" ? main.call : null;
	main.method  = reMt.test(main.method) ? main.method.toLowerCase() : "post";
	main.timeout = Number.isInteger(main.timeout) && main.timeout >= 0 ? main.timeout : 0;
	main.headers = new __DataSet("headers" in data ? data.headers : {});
	Object.defineProperties(this, {
		data: {value: main},
		info: {value: null, writable: true},
	});
}
Object.defineProperties(__Request.prototype, {
	constructor: {value: __Request},
	/**. '{void send()}: Envia os dados de '{body} uma requisição ao servidor via a{XMLHttpRequest}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest}target{_blank}. As propriedades específicas são '{method}, {async}, '{user}, '{password}, '{withCredentials}, '{overrideMimeType}, '{responseType}, '{headers} e '{timeout}.**/
	send: {
		value: function(body) {
			if (this.info !== null) return;
			try {
				const request = new XMLHttpRequest();
				const headers = this.data.headers.toObjectHeaders;
				const mime    = "overrideMimeType" in this.data ? this.data.overrideMimeType : null;
				const events  = ["abort", "error", "load", "loadend", "loadstart", "progress", "timeout"];
				const types   = {text: "text", buffer: "arraybuffer", blob: "blob", doc: "document", json: "json"};
				const attr    = types[this.data.type in types ? this.data.type : "text"];
				request.open(this.data.method, this.data.url,
					this.data.async !== false,
					"user"     in this.data ? this.data.user     : null,
					"password" in this.data ? this.data.password : null
				);
				request.responseType    = attr;
				request.withCredentials = this.data.withCredentials === true;
				request.timeout         = this.data.timeout;
				for (let i in headers) request.setRequestHeader(i, headers[i]);
				if  (mime !== null)    request.overrideMimeType(mime);
				/*-- atribuindo disparadores aos eventos --*/
				events.forEach(function(ev,i,a) {
					if (`on${ev}` in request)
						request.addEventListener(ev, this);
					if (`on${ev}` in request.upload)
						request.upload.addEventListener(ev, this);
				}, this);
				/*-- executar a requisição --*/
				this.info = {id: __PROGRESS.open(), init: Date.now(), target: request};
				request.send(this.data.body);
			}
			catch(e) {console.error(e);}
			return;
		},
	},
	/**. '{void read()}: Lê um arquivo via a{FileReader}@href{https://developer.mozilla.org/en-US/docs/Web/API/FileReader}target{_blank}.**/
	read: {
		value: function() {
			if (this.info !== null) return;
			try {
				const test = new __Type(this.data.url);
				/*-- se for uma lista de arquivos, chamar para cada um deles --*/
				if (test.instanceOf("FileList")) {
					const list = this.data.url;
					for (let i = 0; i < list.length; i++) {
						let request = new __Request({url: list[i], type: this.data.type, call: this.data.call});
						request.read();
					}
					return;
				}
				/*-- um único arquivo --*/
				const request = new FileReader();
				const events  = ["abort", "error", "load", "loadend", "loadstart", "progress"];
				const types   = {text: "readAsText", buffer: "readAsArrayBuffer", blob: "readAsBinaryString", url: "readAsDataURL"};
				const method  = types[this.data.type in types ? this.data.type : "text"];
				events.forEach(function(ev,i,a) {
					if (`on${ev}` in request)
						request.addEventListener(ev, this);
				}, this);
				/*-- executar a requisição --*/
				this.info = {id: __PROGRESS.open(), init: Date.now(), target: request};
				request[method](this.data.url);
			}
			catch(e) {console.error(e);}
			return;
		},
	},
	/**. '{void fetch()}: Envia uma requisição ao servidor via a{fetch}@href{https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Using_Fetch}target{_blank}. As propriedades específicas são '{method}, {headers}, '{body}, '{mode}, '{cache}, '{credentials}, e '{redirect}.'{fetch}.**/
	fetch: {
		value: function() {
			function trigger(status, response, result) {
				const detail = {status: status, response: response, result: result};
				const event  = new CustomEvent("wdfetch", {detail: detail, bubbles: false});
				window.dispatchEvent(event);
				return;
			}
			try {
				window.addEventListener("wdfetch", this);
				const types   = {text: "text", buffer: "arrayBuffer", blob: "blob", json: "json", data: "formData"};
				const method  = types[this.data.type in types ? this.data.type : "text"];
				const control = typeof window.AbortController === "function" ? new AbortController() : null;
				this.info     = {id: __PROGRESS.open(), init: Date.now(), target: control};
				this.data.signal = control.signal;
				trigger("loadstart", null, null);
				fetch(this.data.url, this.data)
					.then(function(response) {
						trigger(response.ok ? "load" : "loadend", response, null);
						if (response.ok)
							response[method]()
								.then(function (result) {trigger("loadend", response, result);})
								.catch(function(fail)   {trigger("loadend", response, null);});
					})
					.catch(function(error) {trigger("error", {ok: false, headers: null, status: "", statusText: error}, null);});
			}
			catch(e) {console.error(e);}
			return;
		}
	},
	/**. '{void abort()}: Aborta a requisição ou leitura ativa.**/
	abort: {
		value: function() {
			if (this.info === null || this.info.target === null) return;
			this.info.target.abort();
			return;
		}
	},
	/**. '{void handleEvent(object ev)}: Disparador que provoca os eventos de requisição e leitura. Para o método '{fetch}, é disparado o evento '{wdfetch} para cada interação. O disparador '{call} informado no contrutor recebe como argumento um objeto com as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|event|object|O evento que provocou a interação.|
	|done|boolean|Informa se a requisição ou leitura terminou.|
	|ok|boolean|Informa se a requisição ou leitura terminou com sucesso.|
	|status|string|Uma mensagem sobre a requisição.|
	|headers|object|Dados do cabeçalho retornado.|
	|response|any|Conteúdo retornado na requisição ou leitura.|
	|elapsedTime|integer|Tempo decorrido desde o início da chamada.|
	|progress|number|Valor do progresso da requisição.|**/
	handleEvent: {
		value: function(ev) {
			if (this.info === null) return;
			const info = {
				event:       ev,
				done:        false,
				ok:          false,
				status:      null,
				headers:     null,
				response:    null,
				elapsedTime: Date.now() - this.info.init,
				progress:    ev.lengthComputable === true && ev.total > 0 ? ev.loaded/ev.total : undefined,
			};
			/*-- método send -----------------------------------------------------*/
			if (ev.target instanceof XMLHttpRequest) {
				const done    = {loadend: 1, error: 0, abort: 0, timeout: 0};
				info.status   = `${ev.target.status} ${ev.target.statusText}`;
				if (ev.type in done) {
					const fail    = done[ev.type] === 0;
					info.done     = true;
					info.status   = fail ? ev.type : info.status;
					info.ok       = fail ? false : (ev.target.status >= 200 && ev.target.status < 300);
					info.progress = 1;
				}
				if (info.ok) {
					info.headers  = ev.target.getAllResponseHeaders();
					info.response = ev.target.response;
				}
			}
			/*-- método read -----------------------------------------------------*/
			else if (ev.target instanceof FileReader) {
				const status  = ["EMPTY", "LOADING", "DONE"];
				const done    = {loadend: 1, error: 0, abort: 0};
				/*-- atributos gerais --*/
				info.status   = `${ev.target.readyState} ${status[ev.target.readyState]}`;
				/*-- fim da requisição --*/
				if (ev.type in done) {
					const fail  = done[ev.type] === 0;
					info.done   = true;
					info.status = fail ? ev.type : info.status;
					info.ok     = !fail;
					info.progress = 1;
				}
				/*-- Requisição encerrada com sucesso --*/
				if (info.ok) {
					info.response = ev.target.result;
					info.headers  = __FILE.toHeaders(this.data.url);
				}
			}
			/*-- método fetch ----------------------------------------------------*/
			else if (ev.type === "wdfetch") {
				const data    = ev.detail;
				const done    = {loadend: 1, error: 0, abort: 0};
				const step    = {loadstart: 1/3, load: 1/2, loadend: 1, error: 1, abort: 1};
				info.done     = data.status in done;
				info.ok       = data.response === null ? false : (info.done && data.response.ok);
				info.status   = data.response === null ? data.status : `${data.response.status} ${data.response.statusText}`;
				info.response = data.result;
				info.progress = step[data.status];
				info.headers  = info.done ? data.response.headers : null;
				if (info.done) window.removeEventListener("wdfetch", this);
			}
			/*-- cabeçalho -------------------------------------------------------*/
			if (info.headers !== null) {
				const data   = new __DataSet(info.headers);
				info.headers = data.toHeaders;
			}
			/*-- barra de progresso ----------------------------------------------*/
			__PROGRESS.value(this.info.id, info.progress);
			/*-- disparador ------------------------------------------------------*/
			if (this.data.call !== null)
				this.data.call(info);
			/*-- encerramento ----------------------------------------------------*/
			if (info.done) {
				__PROGRESS.close(this.info.id);
				this.info = null;
			}
		}
	},
});