	function WDtype(input) {
		if (!(this instanceof WDtype)) return new WDtype(input);
		this._INPUT = input;     /* guarda o valor de entrada (imutável) */
		this._input = input;     /* guarda o valor de entrada */
		this._value = undefined; /* guarda o valor do objeto */
		this._type  = "unknown"; /* guarda o tipo do objeto */
		if (this.isString) this._input = input.trim();
		this._run();
	}

	Object.defineProperty(WDtype.prototype, "constructor", {value: WDtype});

	Object.defineProperty(WDtype.prototype, "isFullString", {get: function() {
		if (!this.isString)            return false;
		if (this._input.trim() === "") return false;
		return true;
	}});

	Object.defineProperty(WDtype.prototype, "isString", {get: function() {
		if (typeof this._input === "string") return true;
		if (this._input instanceof String)   return true;
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isNull", {get: function() {
		if (this._input === null || this._input === "") {
			this._type  = "null";
			this._value = null;
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isUndefined", {get: function() {
		if (this._input === undefined) {
			this._type  = "undefined";
			this._value = undefined;
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isRegExp", {get: function() {
		if (typeof this._input === "regexp" || this._input instanceof RegExp) {
			this._type  = "regexp";
			this._value = this._input;
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isBoolean", {get: function() {
		if (
			this._input === true  ||
			this._input === false ||
		 	typeof this._input === "boolean" ||
			this._input instanceof Boolean
		) {
			this._type  = "boolean";
			this._value = this._input.valueOf();
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isArray", {get: function() {
		if (Array.isArray(this._input) || this._input instanceof Array) {
			this._type  = "array";
			this._value = this._input.slice();
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isObject", {get: function() {
		if (
			typeof this._input === "object" &&
			this._input instanceof Object &&
			(/^\{.*\}$/).test(JSON.stringify(this._input))
		) {
			this._type  = "object";
			this._value = this._input;
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isFunction", {get: function() {
		if (typeof this._input === "function" || this._input instanceof Function){
			this._type  = "function";
			this._value = this._input;
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isDOM", {get: function() {
		if (
			this._input === document ||
			this._input === window   ||
			this._input instanceof HTMLElement ||
			this._input instanceof SVGElement
		) {
			this._type  = "dom";
			this._value = [this._input];
			return true;
		}

		if (
			this._input instanceof NodeList ||
			this._input instanceof HTMLCollection ||
			this._input instanceof HTMLAllCollection ||
			"HTMLOptionsCollection" in window && this._input instanceof HTMLOptionsCollection || /*IE11*/
			"HTMLFormControlsCollection" in window && this._input instanceof HTMLFormControlsCollection /*IE 11*/
		) {
			this._type  = "dom";
			this._value = [];
			for (var i = 0; i < this._input.length; i++)
				this._value.push(this._input[i]);
			return true;
		}

		try {
			if (
				"nodeType" in this._input &&
				this._input.nodeType === 1 &&
				this._input.constructor.name in window &&
				"parentElement" in this._input
			) {
				this._type  = "dom";
				this._value = [this._input];
				return true;
			}
		} catch(e) {}

		if (!this.isString) return false;

		var save = this._input.toString();

		if ((/^\$\$\{.+\}$/).test(this._input)) {
			var selector = save.substr(3, (save.length - 4));
			this._input  = wd_$$(selector);
			if (this.isDOM && this._input.length > 0) return true;
		}

		if ((/^\$\{.+\}$/).test(this._input)) {
			var selector = save.substr(2, (save.length - 3));
			this._input  = wd_$(selector);
			if (this.isDOM) return true;
		}

		this._input = save;
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isText", {get: function() {
		if (!this.isString) return false;
		this._type  = "text";
		this._value = this._input;
		return true;
	}});

	Object.defineProperty(WDtype.prototype, "isNumber", {get: function() {
		if (
			(typeof this._input === "number" || this._input instanceof Number) &&
			!isNaN(this._input)
		) {
			this._type  = "number";
			this._value = this._input.valueOf();
			return true;
		}

		if (!this.isString) return false;
		if ((/Infinity$/).test(this._input)) return false;
		/*número em forma de texto (padrão)*/
		if (this._input == Number(this._input)) {
			this._type  = "number";
			this._value = Number(this._input).valueOf();
			return true;
		}
		/*fatorial*/
		if ((/^[0-9]+\!$/).test(this._input)) {
			var number = Number(this._input.replace("!", "")).valueOf();
			var value  = 1;
			while (number > 1) {
				value *= number;
				number--;
			}
			this._type  = "number";
			this._value = value;
			return true;
		}
		/*porcentagem*/
		if ((/^[\+\-]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)\%$/).test(this._input)) {
			var number  = Number(this._input.replace("%", "")).valueOf();
			this._type  = "number";
			this._value = number / 100;
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isTime", {get: function() {
		if (!this.isString) return false;

		if (/^(0?[0-9]|1[0-9]|2[0-4])(\:[0-5][0-9]){1,2}$/.test(this._input)) {/*HH:MM:SS*/
			this._type  = "time";
			var time    = this._input.split(":");
			this._value = wd_time_number(
				Number(time[0]),
				Number(time[1]),
				time.length === 3 ? Number(time[2]) : 0
			);
			return true;
		}

		if ((/^(0?[1-9]|1[0-2])\:[0-5][0-9]\ ?(am|pm)$/i).test(this._input)) {/*HH:MM AM|PM*/
			this._type  = "time";
			this._input = this._input.toLowerCase();
			var sep     = this._input[this._input.length - 2];
			var time    = this._input.split(sep)[0].trim().split(":");
			var hour    = Number(time[0]);
			this._value = wd_time_number(
				sep === "a" ? hour : (hour === 12 ? 0 : (12 + hour)),
				Number(time[1]),
				0
			);
			return true;
		}

		if ((/^(0?[0-9]|1[0-9]|2[0-4])h[0-5][0-9]$/i).test(this._input)) { /*24HhMM*/
			this._type  = "time";
			var time    = this._input.toLowerCase().split("h");
			this._value = wd_time_number(
				Number(time[0]),
				Number(time[1]),
				0
			);
			return true;
		}
		return false;
	}});

	Object.defineProperty(WDtype.prototype, "isDate", {get: function() {
		if (this._input instanceof Date) {/*DATE*/
			this._type  = "date";
			this._value = wd_set_date(this._input);
			return true;
		}
		if (!this.isString) return false;

		var d, m, y, array, type, symbol, index;
		/*capturando formatos padrão (YYYY-MM-DD DD/MM/YYYY MM.DD.YYYY)*/
		if      (/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/.test(this._input)) type = 0;
		else if (/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(this._input)) type = 1;
		else if (/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/.test(this._input)) type = 2;
		else return false;

		symbol = ["-", "/", "."];
		index  = {d: [2, 0, 1], m: [1, 1, 0], y: [0, 2, 2]};
		array  = this._input.split(symbol[type]);

		d = Number(array[index.d[type]]);
		m = Number(array[index.m[type]]);
		y = Number(array[index.y[type]]);

		/*analisando formatos padrão*/
		if (y > 9999 || y < 1)  return false;
		if (m > 12   || m < 1)  return false;
		if (d > 31   || d < 1)  return false;
		if (d > 30   && [2, 4, 6, 9, 11].indexOf(m) >= 0) return false;
		if (d > 29   && m == 2) return false;
		if (d == 29  && m == 2 && !wd_is_leap(y)) return false;

		this._type  = "date";
		this._value = new Date();
		this._value = wd_set_date(this._value, d, m, y);
		return true;
	}});

	Object.defineProperty(WDtype.prototype, "_run", {value: function() {
		var methods = [/*importante: objetos específicos devem estar antes dos genéricos*/
			"isUndefined", /*0*/
			"isNull",      /*0*/
			"isBoolean",   /*0*/
			"isRegExp",    /*0*/
			"isArray",     /*0*/
			"isDOM",       /*0*/
			"isFunction",  /*0*/
			"isTime",      /*0*/
			"isDate",      /*0*/
			"isNumber",    /*0*/
			"isText",      /*1*/
			"isObject"     /*2*/
		];
		for (var i = 0; i < methods.length; i++) {
			if (this[methods[i]]) return;
		}
		this._type  = "unknown";
		this._value = this._input;
	}});

	Object.defineProperty(WDtype.prototype, "type", {
		get: function() {return this._type;}
	});

	Object.defineProperty(WDtype.prototype, "value", {
		get: function() {return this._value;}
	});

	Object.defineProperty(WDtype.prototype, "input", {
		get: function() {return this._INPUT;}
	});

