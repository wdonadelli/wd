	function WDrequest(input) {
		if (!(this instanceof WDrequest)) return new WDrequest(input);
		this._action   = input;
		this._pack     = null;
		this._callback = null;
		this._method   = "GET";
		this._async    = true;

		this._start    = 0;        /* registra o início da requisição */
		this._request  = null;     /* registra o objeto para requisições */
		this._closed   = false;    /* indica o término da requisição */
		this._status   = "UNSENT"; /* UNSENT|OPENED|HEADERS|LOADING|UPLOADING|DONE|NOTFOUND|ABORTED|ERROR|TIMEOUT */
		this._time     = 0;        /* tempo decorrido desde o início da chamada (milisegundos)*/
		this._total    = 0;        /* registra o tamanho total do arquivo */
		this._loaded   = 0;        /* registra o tamanho carregado na requisição */
		this._progress = 0;        /* registra o andamento da requisição */
		this._text     = null;     /* registra o conteúdo textual da requisição */
		this._xml      = null;     /* registra o XML da requisição */
		this._json     = null;     /* registra o JSON da requisição */
		this._csv      = null;     /* transforma um arquivo CSV em JSON */
	}

	/* Métodos Estáticos ------------------------------------------------------*/
	WDrequest.window   = document.createElement("DIV"); /*guarda a janela modal*/
	WDrequest.progress = document.createElement("PROGRESS"); /*guarda a barra de progresso*/
	WDrequest.count    = 0; /*guarda o número de janelas abertas*/
	WDrequest.styled   = false; /*guarda a informação se a janela já foi estilizada*/

	WDrequest.setStyle = function() { /*define o estilo padrão se ainda não definido*/
		if (this.styled) return;
		this.window.appendChild(this.progress);
		this.progress.max = 1;
		var style    = {      /*guarda o estilo padrão da janela*/
			display:  "block", width: "100%", height: "100%",
			padding: "0.1em 0.5em", margin: "0", zIndex: "999999",
			position: "fixed", top: "0", right: "0", bottom: "0",	left: "0",
			cursor: "progress", backgroundColor: "rgba(0,0,0,0.4)"
		};
		for (var i in style) this.window.style[i] = style[i];
		this.styled = true;
		return;
	}

	WDrequest.open     = function() { /*abre a janela modal, se não estiver aberta*/
		this.setStyle();
		if (this.count === 0) document.body.appendChild(this.window);
		this.count++;
		return;
	}

	WDrequest.close    = function() { /*fecha a janela modal, se estiver aberta*/
		var parent = this;
		window.setTimeout(function () {
			if (parent.count > 0) parent.count--;
			if (parent.count < 1) document.body.removeChild(parent.window);
			return;
		}, 250);
		return;
	}

	/* Métodos de Protótipos --------------------------------------------------*/
	Object.defineProperty(WDrequest.prototype, "constructor", {value: WDrequest});

	Object.defineProperty(WDrequest.prototype, "_abort", {value: function() {
		this.setEvents("ABORTED", true, 0, 0);
		return;
	}});

	Object.defineProperty(WDrequest.prototype, "data", {get: function() {
		var data = {
			action: null, closed: null, status: null, time: null,
			total: null, loaded: null, progress: null,
			text: null, xml: null, json: null, csv: null,
			request: null, abort: null
		};
		for (var i in data) data[i] = this["_"+i];
		return data;
	}});

	Object.defineProperty(WDrequest.prototype, "setEvents", {
		value: function (status, closed, loaded, total) {
			if (this._closed) return;
			this._status   = status;
			this._closed   = closed;
			this._loaded   = loaded;
			this._total    = total;
			this._progress = this._total > 0 ? this._loaded/this._total : 1;
			this._time     = (new Date()) - this._start;

			/*barra de progresso*/
			var progressValue = this._progress;
			var progressBar   =  this.constructor.progress;
			window.setTimeout(function() {
				return progressBar.value = progressValue;
			}, 10);

			if (this._status === "ABORTED") this._request.abort();
			if (this._callback !== null)    this._callback(this.data);
			this._progress = 0;
			this._loaded   = 0;
			this._total    = 0;

			return;
		}
	});

	Object.defineProperty(WDrequest.prototype, "setRequestHandlers", {
		value: function() {/*define o ciclo da requisição*/
			var parent = this;

			this.request.onprogress = function(x) {
				return parent.setEvents("LOADING", false, x.loaded, x.total);
			}

			this.request.onerror = function(x) {
				return parent.setEvents("ERROR", true, 0, 0);
			}

			this.request.ontimeout = function(x) {
				return parent.setEvents("TIMEOUT", true, 0, 0);
			}

			this.request.upload.onprogress = function(x) {
				return parent.setEvents("UPLOADING", false, x.loaded, x.total);
			}

			this.request.upload.onabort   = this._request.onerror;
			this.request.upload.ontimeout = this._request.ontimeout;

			this.request.onreadystatechange = function(x) {

				if (parent._request.readyState < 1) return;
				if (parent._closed) return;

				if (parent._status === "UNSENT") {
					parent._status = "OPENED";
					parent.constructor.open();
				} else if (parent.request.status === 404) {
					parent._status = "NOTFOUND";
					parent._closed = true;
				} else if (parent.request.readyState === 2) {
					parent._status = "HEADERS";
				} else if (parent.request.readyState === 3) {
					parent._status = "LOADING";
				} else if (parent.request.readyState === 4) {
					parent._closed = true;
					if (parent.request.status === 200 || parent.request.status === 304) {
						parent._status    = "DONE";
						parent._progress  = 1;
						parent._text      = parent.request.responseText;
						parent._xml       = parent.request.responseXML;
						parent._json      = wd_json(parent._text);
						try {parent._csv  = wd_csv_array(parent._text); } catch(e) {};
					} else {
						parent._status = "ERROR";
					}
				}

				parent._time = (new Date()) - parent._start;
				if (parent.callback !== null) parent.callback(parent.data);
				if (parent._closed) parent.constructor.close();

				return;
			}
			return;
		}
	});

	Object.defineProperty(WDrequest.prototype, "action", {
		get: function()  {return this._action;},
		set: function(x) {return this._action = x;}
	});

	Object.defineProperty(WDrequest.prototype, "callback", {
		get: function()  {return this._callback;},
		set: function(x) {return this._callback = x;}
	});

	Object.defineProperty(WDrequest.prototype, "method", {
		get: function()  {return this._method;},
		set: function(x) {return this._method = x.toUpperCase();}
	});

	Object.defineProperty(WDrequest.prototype, "async", {
		get: function()  {return this._async;},
		set: function(x) {return this._async = x === false ? false : true;}
	});

	Object.defineProperty(WDrequest.prototype, "pack", {
		get: function()  {return this._pack;},
		set: function(x) {return this._pack = x;}
	});

	Object.defineProperty(WDrequest.prototype, "request", {
		get: function()  {return this._request;},
		set: function(x) {return this._request = x;}
	});

	Object.defineProperty(WDrequest.prototype, "send", {value: function() {

		this._start  = new Date();
		this.request = new XMLHttpRequest();
		this.setRequestHandlers();
		var pack = wd_vtype(this._pack);

		if (this.method === "GET" && pack.type === "text") {
			var action   = this.action.split("?");
			this.action += action.length > 1 ? pack.value : "?" + pack.value;
			this.pack    = null;
		}

		try {
			this.request.open(this.method, this.action, this.async);
		} catch(e) {
			this.setEvents("ERROR", true, 0, 0)
			if (this.callback !== null) this.callback(this.data);
			this.constructor.close();
			return false;
		}

		if (this.method === "POST" && pack.type === "text") {
			this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}

		this.request.send(this.pack);

		return true;
	}});

