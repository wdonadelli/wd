	/*Obtêm o conteúdo do caminho e retorna o método de requisição (descontinuar)*/
	Object.defineProperty(WDtext.prototype, "request", {
		enumerable: true,
		value: function(method, time) {
			var path, pack;

			/* para o caso do endereço ser um número, remover ' do início */
			pack    = this.toString().replace(/^\'/, "").split("?");
			path    = pack[0];
			pack[0] = "";
			pack = pack.join("?").replace("?", "");/*!!!deixar assim para o caso de ter mais de um ?*/

			/* definindo pack (serialized) */
			if (WD(pack).type !== "text") {
				pack = null;
			} else if ((/^\$\{.+\}$/).test(pack)) {
				pack = $(new DataAttr().convert(pack)[0]["$"]);
			}

			/* ajustando o tempo (segundos = *1000) */
			time = WD(time);
			time = (time.type === "number" && time.valueOf() > 0) ? 1000*time.valueOf() : 0;

			/* função a ser executada */
			function textRequestFunction(METHOD) {
				WD(pack).send(path, function(x) {
					if (x.closed === true) {
						x.error = x.status === "DONE" ? false : true;
						method(x);
					} else if (time > 0 && data.time > time) {
						x.abort();
					}
					return;			
				}, METHOD);
				return;
			}

			return {
				get: function() {
					textRequestFunction("GET");
				},
				post: function () {
					textRequestFunction("POST");
				}
			};
		}
	});
	
	
		/*Faz requisição a um arquivo externo data-wd-request=post|get{file}method{function()}*/
	function data_wdRequest(e) {
		var value, method, file, callback, data;
		data = new DataAttr(e);
		if (data.has("wdRequest")) {
			value    = data.core("wdRequest")[0];
			method   = "post" in value ? "post" : "get";
			file     = value[method];
			callback = window[value["method"]];
			WD(file).request(callback)[method]();
		}			
		return;
	};
	
	
		/*Adiciona ou remove disparadores*/
	Object.defineProperty(WDdom.prototype, "handler", {
		enumerable: true,
		value: function (input, remove) {
			var del, event, methods;
			if (WD(input).type !== "object") {return false;}

			/*looping nos eventos*/
			for (var i in input) {
				event   = i;
				del     = (remove === true || (/^\-/).test(event)) ? true : false;
				methods = WD(input[i]).type === "array" ? WD(input[i]).unique() : [input[i]];

				/*looping nos métodos*/
				for (var n = 0; n < methods.length; n++) {
					/*looping nos elementos*/
					this.run(function(elem) {
						if (!setHandler(event, methods[n], elem, del)) {
							log("handler: Invalid argument ("+event+" "+methods[n].name+")", "w");
						}
						return;
					});
				}
			}
			return true;
		}
	});

