/* Willian Donadelli | <wdonadelli@gmail.com> | v1.1.4 */

"use strict";
var wd = (function() {

/*===========================================================================*/
	/*Parâmetros de configuração de data*/
	const Y_0 = 1, Y_4 = 4, Y_100 = 100, Y_400 = 400, WEEK_REF = 1, Y_max = 9999;

	/*Guarda o tamanho da tela*/
	var deviceController = null;

	/*Janela modal para processamentos ajax*/
	const MODAL = document.createElement("DIV");
	MODAL.textContent = "Loading data, please wait!";
	htmlStyle(MODAL, {
		display: "block", width: "100%", height: "100%", zIndex: 999999,
		position: "fixed", top: 0, right: 0, bottom: 0, left: 0,
		color: "white", backgroundColor: "black", opacity: "0.9", cursor: "progress"
	});

	/*Controlador da janela modal (ajax)*/
	var modalController = 0;

	function addAjaxModal() {
		modalController++;
		checkAjaxModal();
		return;
	}

	function delAjaxModal() {
		window.setTimeout(function () {
			modalController--;
			checkAjaxModal();
			return;
		}, 250);;
		return;
	}
	
	function checkAjaxModal() {
		if (modalController <= 0) {
			modalController = 0;
			htmlAction(MODAL, "del");
		} else if (MODAL.parentElement !== document.body) {
			document.body.appendChild(MODAL);
		}
		return;
	};
/*===========================================================================*/
	function WD(input) {
		if (!(this instanceof WD)) {return new WD(input);}
		Object.defineProperties(this, {_input: {value: input}});
	};
	Object.defineProperties(WD.prototype, {
		constructor: {value: WD},
		valueOf:  {value: function() {return this._input.valueOf();}},
		toString: {value: function() {return this._input.toString();}},
		toSource: {value: function() {return this._input;}},
		type:     {enumerable: true, get: function() {return type(this._input);}}
	});
/*---------------------------------------------------------------------------*/
	function WDstring(input) {
		if (!(this instanceof WDstring)) {return new WDstring(input);}
		WD.call(this, input);
	};
	WDstring.prototype = Object.create(WD.prototype, {
		constructor: {value: WDstring},
		title:  {enumerable: true, get: function() {return stringTitle(this._input);}},
		trim:   {enumerable: true, get: function() {return stringTrim(this._input);}},
		tt:     {enumerable: true, get: function() {return stringTitle(this.trim);}},
		mask:   {enumerable: true, value: function(regex) {return stringMask(this._input, regex);}},
	});
/*---------------------------------------------------------------------------*/
	function WDarray(input) {
		if (!(this instanceof WDarray)) {return new WDarray(input);}
		WD.call(this, input);
	};
	WDarray.prototype = Object.create(WD.prototype, {
		constructor: {value: WDarray},
		sort:      {enumerable: true, get: function() {return arraySort(this._input);}},
		unique:    {enumerable: true, get: function() {return arrayUnique(this._input);}},
		organized: {enumerable: true, get: function() {return arrayOrganized(this._input);}},
		del:       {enumerable: true, value: function(item) {return arrayDel(this._input, item);}},
		add:       {enumerable: true, value: function(item) {return arrayAdd(this._input, item);}},
		toggle:    {enumerable: true, value: function(item) {return arrayToggle(this._input, item);}},
		amount:    {enumerable: true, value: function(item) {return arrayCount(this._input, item);}},
		replace:   {enumerable: true, value: function(item, value) {return arrayReplace(this._input, item, value);}},
	});
/*---------------------------------------------------------------------------*/
	function WDregexp(input) {
		if (!(this instanceof WDregexp)) {return new WDregexp(input);}
		WD.call(this, input);
	};
	WDregexp.prototype = Object.create(WD.prototype, {
		constructor: {value: WDregexp},
		mask: {enumerable: true, value: function(string) {return stringMask(string, this._input);}},
	});
/*---------------------------------------------------------------------------*/
	function WDboolean(input) {
		if (!(this instanceof WDboolean)) {return new WDboolean(input);}
		WD.call(this, input);
	};
	WDboolean.prototype = Object.create(WD.prototype, {
		constructor: {value: WDboolean},
		value: {enumerable: true, get: function() {return input === true ? 1 : 0;}},
	});
/*---------------------------------------------------------------------------*/
	function WDnumber(input) {
		if (!(this instanceof WDnumber)) {return new WDnumber(input);}
		WD.call(this, input);
	};
	WDnumber.prototype = Object.create(WD.prototype, {
		constructor: {value: WDnumber},
		integer:    {enumerable: true, get: function() {return numberInteger(this._input);}},
		fraction:   {enumerable: true, get: function() {return numberFraction(this._input);}},
		isInteger:  {enumerable: true, get: function() {return numberIsInteger(this._input);}},
		isFloat:    {enumerable: true, get: function() {return numberIsFloat(this._input);}},
		isNatural:  {enumerable: true, get: function() {return numberIsNatural(this._input);}},
		isNegative: {enumerable: true, get: function() {return numberIsNegative(this._input);}},
		isPositive: {enumerable: true, get: function() {return numberIsPositive(this._input);}},
		abs:        {enumerable: true, get: function() {return numberAbs(this._input);}},
		inverse:    {enumerable: true, get: function() {return numberInverse(this._input);}},
		roundUp:    {enumerable: true, get: function() {return numberRoundUp(this._input);}},
		round:      {enumerable: true, value: function(n) {return numberRound(this._input, n);}},
		scientific: {enumerable: true, value: function(n) {return numberScientific(this._input, n);}},
		locale:     {enumerable: true, value: function(cod) {return numberLocale(this._input, cod);}},
		currency:   {enumerable: true, value: function(val, cod) {return numberCurrency(this._input, cod, val);}
		},
	});
/*---------------------------------------------------------------------------*/
	function WDdate(input) {
		if (!(this instanceof WDdate)) {return new WDdate(input);}
		WD.call(this, input);
		Object.defineProperties(this, {_d: {writable: true, value: dateDefiner(input)}});
	};
	WDdate.prototype = Object.create(WD.prototype, {
		constructor: {value: WDdate},
		day: {enumerable: true,
			get: function() {return dateFromNumber(this._d).d;},
			set: function(input) {this._d = dateSet(this._d, input, "d"); return;}
		},
		month: {enumerable: true,
			get: function() {return dateFromNumber(this._d).m;},
			set: function(input) {this._d = dateSet(this._d, input, "m"); return;}
		},
		year: {enumerable: true,
			get: function() {return dateFromNumber(this._d).y;},
			set: function(input) {this._d = dateSet(this._d, input, "y"); return;}
		},
		week:      {enumerable: true, get: function() {return dateWeek(this._d);}},
		leap:      {enumerable: true, get: function() {return dateLeap(this.year);}},
		days:      {enumerable: true, get: function() {return dateDayYear(this.year, this.month, this.day);}},
		width:     {enumerable: true, get: function() {return dateLenghtMonth(this.year, this.month);}},
		weeks:     {enumerable: true, get: function() {return dateWeeks(this.year, this.days);}},
		countdown: {enumerable: true, get: function() {return dateCountdown(this.year, this.month, this.day);}},
		format:    {enumerable: true, value: function(string, locale) {return dateFormat(this._d, string, locale);}},
		toString:  {value: function() {return dateFormat(this._d);}},
		valueOf:   {value: function() {return this._d;}},
	});
/*---------------------------------------------------------------------------*/
	function WDtime(input) {
		if (!(this instanceof WDtime)) {return new WDtime(input);}
		WD.call(this, input);
		Object.defineProperties(this, {_t: {writable: true, value: timeDefiner(input)}});
	};
	WDtime.prototype = Object.create(WD.prototype, {
		constructor: {value: WDtime},
		hour: {enumerable: true,
			get: function() {return timeGet(this._t, "h");},
			set: function(input) {this._t = timeToNumber(input, this.minute, this.second, this._t); return;}
		},
		minute: {enumerable: true,
			get: function() {return timeGet(this._t, "m");},
			set: function(input) {this._t = timeToNumber(this.hour, input, this.second, this._t); return;}
		},
		second: {enumerable: true,
			get: function() {return timeGet(this._t, "s")},
			set: function(input) {this._t = timeToNumber(this.hour, this.minute, input, this._t); return;}
		},
		h24:      {enumerable: true, get: function() {return timeGet(this._t, "h24")}},
		ampm:     {enumerable: true, get: function() {return timeGet(this._t, "ampm")}},
		format:   {enumerable: true, value: function(string) {return timeFormat(this._t, string);}},
		toString: {value: function() {return timeGet(this._t);}},
		valueOf:  {value: function() {return this._t;}},
	});
/*---------------------------------------------------------------------------*/
	function WDajax(input) {
		if (!(this instanceof WDajax)) {return new WDajax(input);}
		WD.call(this, input);
	};
	WDajax.prototype = Object.create(WDstring.prototype, {
		constructor: {value: WDajax},
		post: {enumerable: true, value: function(execute, time) {ajaxSend(this._input, "POST", execute, time);}},
		get:  {enumerable: true, value: function(execute, time) {ajaxSend(this._input, "GET", execute, time);}},
		type: {enumerable: true, get: function() {return type(this._input, true);}}
	});
/*---------------------------------------------------------------------------*/
	function WDhtml(input) {
		if (!(this instanceof WDhtml)) {return new WDhtml(input);}
		WD.call(this, input);
	};
	WDhtml.prototype = Object.create(WD.prototype, {
		constructor: {value: WDhtml},
		execute: {enumerable: true, value: function(method) {
			htmlRun(this._input, method); return;
		}},
		handler: {enumerable: true, value: function(events, remove) {
			htmlRun(this._input, function(elem) {htmlHandler(elem, events, remove); return;}); return this;
		}},
		class: {enumerable: true, value: function(list) {
			htmlRun(this._input, function(elem) {htmlClass(elem, list); return;}); return this;
		}},
		style: {enumerable: true, value: function(list) {
			htmlRun(this._input, function(elem) {htmlStyle(elem, list); return;}); return this;
		}},
		data: {enumerable: true, value: function(list) {
			htmlRun(this._input, function(elem) {htmlData(elem, list); return;}); return this;
		}},
		filter: {enumerable: true, value: function(text, min) {
			htmlRun(this._input, function(elem) {htmlFilter(elem, text, min); return;}); return this;
		}},
		sort: {enumerable: true, value: function(order, col) {
			htmlRun(this._input, function(elem) {htmlSort(elem, order, col); return;}); return this;
		}},
		page: {enumerable: true, value: function(page, size) {
			htmlRun(this._input, function(elem) {htmlPage(elem, page, size); return;}); return this;
		}},
		repeat: {enumerable: true, value: function(obj) {
			htmlRun(this._input, function(elem) {htmlRepeat(elem, obj); return;}); return this;
		}},
		load: {enumerable: true, value: function(html) {
			htmlRun(this._input, function(elem) {htmlLoad(elem, html); return;}); return this;
		}},
		action: {enumerable: true, value: function(act) {
			htmlRun(this._input, function(elem) {htmlAction(elem, act); return;}); return this;
		}},
		get:    {enumerable: true, get: function() {return type(this._input) !== "[html]" ? [this._input] : this._input;}},
		styles: {enumerable: true, get: function() {return htmlGetStyles(type(this._input) !== "[html]" ? [this._input] : this._input);}},
	});

/*===========================================================================*/
	function data_wdLoad(e) {
		/*Carrega html externo*/
		if (!("wdLoad" in e.dataset)) {return;}
		var value, method, file, ajax, target;
		value  = e.dataset.wdLoad;
		method = (/^post\:/i).test(value) ? "post" : "get";
		file   = value.replace(/^(post|get)\:/i, "");
		ajax   = wd(file);
		target = wd(e);
		target.data({wdLoad: null});
		if (ajax.type !== "path") {
			msg("data-wd-load=\""+value+"\" - Attribute value is not an accessible file path.", "e")
		} else {
			ajax[method](function(x) {
				if (x.error) {
					msg(file+": Error accessing file or timeout.", "e");
				} else {
					target.load(x.text);
				}
				return;
			});
		}
		return;
	};

	function data_wdRepeat(e) {
		/*Constroe html a partir de um arquivo json*/
		if (!("wdRepeat" in e.dataset)) {return;}
		var value, method, file, ajax, target;
		value  = e.dataset.wdRepeat;
		method = (/^post\:/i).test(value) ? "post" : "get";
		file   = value.replace(/^(post|get)\:/i, "");
		ajax   = wd(file);
		target = wd(e);
		target.data({wdRepeat: null});
		if (ajax.type !== "path") {
			msg("data-wd-repeat=\""+value+"\" - Attribute value is not an accessible file path.", "e");
		} else {
			ajax[method](function(x) {
				if (x.error || x.json === null) {
					msg(file+": Error accessing file, timeout or it's not a json file.", "e");
				} else {
					target.repeat(x.json);
				}
				return;
			});
		}
		return;
	};

	function data_wdSort(e) {
		/*Ordena elementos filhos*/
		if (!("wdSort" in e.dataset)) {return;}
		var order = wd(e.dataset.wdSort);
		wd(e).sort(order.type !== "number" ? 1 : order.valueOf()).data({wdSort: null});
		return;
	};

	function data_wdFilter(e) {
		/*Filtra elementos filhos*/
		if (!("wdFilter" in e.dataset)) {return;}
		var min, target, text;
		text   = "value" in e ? e.value : e.textContent;
		min    = (/^[0-9]+\:/).test(e.dataset.wdFilter) ? wd(e.dataset.wdFilter.split(":")[0]).valueOf() : 0;
		target = e.dataset.wdFilter.replace(/^[0-9]+\:/, "");
		wd($(target)).filter(text, min);
		return;
	};

	function data_wdMask(e) {
		/*Define máscara do elemento*/
		if (!("wdMask" in e.dataset)) {return;}
		var value, re, mask;
		value = "value" in e ? e.value : e.textContent;
		re    = new RegExp(e.dataset.wdMask);
		mask  = wd(re).mask(value);
		if (mask === false) {
			if ("setCustomValidity" in e) {e.setCustomValidity("Incorrect value: "+re.source);}
		} else {
			if ("value" in e) {e.value = mask} else {e.textContent = mask;}
			if ("setCustomValidity" in e) {e.setCustomValidity("");}
		}
		return;
	};

	function data_wdPage(e) {
		/*Define os elementos a serem exibidos*/
		if (!("wdPage" in e.dataset)) {return;}
		var page, size, attr;
		attr = e.dataset.wdPage.replace(/[^\-\.\:0-9]/g, "").split(":");
		page = wd(attr[0]).type !== "number" ? 0 : wd(attr[0]).valueOf();
		size = wd(attr[1]).type !== "number" ? 0 : wd(attr[1]).valueOf();
		wd(e).page(page, size).data({wdPage: null});
		return;
	};
	
	function data_wdClick(e) {
		/*Executa o método click() ao elemento após o load*/
		if (!("wdClick" in e.dataset)) {return;}
		if (!("click" in e)) {
			msg("data-wd-click: Element does not have the click event.", "w");
		} else {
			e.click();
		}
		wd(e).data({wdClick: null});
		return;
	};

	function data_wdAction(e) {
		/*Executa uma ação ao alvo após o click*/
		if (!("wdAction" in e.dataset)) {return;}
		var attr, action, target;
		attr = e.dataset.wdAction.split("&");
		for (var i = 0; i < attr.length; i++) {
			action = attr[i].split(":")[0].trim();
			target = attr[i].split(":")[1] === undefined ? e : $(attr[i].trim().replace(action+":", ""));
			wd(target).action(action);
		}
		return;
	};

	function data_wdActive(e) {
		/*Define o link ativo do elemento nav*/
		if (e.parentElement !== null && e.parentElement.tagName.toUpperCase() === "NAV") {
			wd(e.parentElement.children).data({wdActive: null});
			if (e.tagName.toUpperCase() === "A") {
				wd(e).data({wdActive: true});
			}
		}
		return;
	};

	function data_wdSortCol(e) {
		/*Ordena as colunas de uma tabela*/
		if (!("wdSortCol" in e.dataset)) {return;}
		if (e.parentElement.parentElement.tagName.toUpperCase() !== "THEAD") {return;}
		var order, thead, heads, bodies;
		order  = e.dataset.wdSortCol === "+1" ? -1 : 1;
		thead  = e.parentElement.parentElement;
		heads  = e.parentElement.children;
		bodies = thead.parentElement.tBodies;
		wd(heads).data({wdSortCol: ""});
		for (var i = 0; i < heads.length; i++) {
			if (heads[i] === e) {
				wd(bodies).sort(order, i);
				wd(e).data({wdSortCol: order === 1 ? "+1" : "-1"});
				break;
			}
		}
		return;
	};
		
	function data_wdDevice(e) {
		/*Define o estilo do elemento a partir do tamanho da tela*/
		if (!("wdDesktop" in e.dataset) && !("wdTablet" in e.dataset) && !("wdPhone" in e.dataset)) {return;}
		var device, desktop, tablet, phone, add, del;
		device  = deviceController;
		desktop = "wdDesktop" in e.dataset ? e.dataset.wdDesktop : "";
		tablet  = "wdTablet"  in e.dataset ? e.dataset.wdTablet : "";
		phone   = "wdPhone"   in e.dataset ? e.dataset.wdPhone : "";
		switch(device) {
			case "desktop":
				add = desktop.split(" ");
				del = (tablet+" "+phone).split(" ");
				break;
			case "tablet":
				add = tablet.split(" ");
				del = (desktop+" "+phone).split(" ");
				break;
			case "phone":
				add = phone.split(" ");
				del = (desktop+" "+tablet).split(" ");
				break;
		}
		for (var i = 0; i < add.length; i++) {
			del = arrayDel(del, add[i]);
		}
		wd(e).class({add: add, del: del});
		return;
	};

/*===========================================================================*/
	function hashProcedures() {
		/*Procedimentos quando se usa as classes wd-bar ao mudar a âncora*/
		var bar, hbar, hash, target, htop;
		bar    = $(".wd-bar, .wd-bar-N");
		hbar   = bar.length === 0 ? 0 : bar[0].offsetHeight;
		hash   = window.location.hash;
		target = hash === undefined || hash === "" ? [] : $(hash);
		htop   = target.length === 0 ? 0 : target[0].offsetTop;
		if (hbar !== 0) {
			window.scrollTo(0, htop - hbar);
		}
		return;
	};

	function loadingProcedures() {
		/*Procedimentos para carregar objetos externos*/
		var attr = $("[data-wd-load], [data-wd-repeat]");
		if (deviceController === null) {scalingProcedures();}
		if (attr.length === 0) {
			organizationProcedures();
			stylingProcedures();
		} else {
			wd(attr[0]).execute(data_wdRepeat);
			wd(attr[0]).execute(data_wdLoad);
		}
		return;
	};
	
	function organizationProcedures() {
		/*Procedimento para organizar elementos após fim dos carregamentos*/
		wd($("[data-wd-sort]")).execute(data_wdSort);
		wd($("[data-wd-filter]")).execute(data_wdFilter);
		wd($("[data-wd-mask]")).execute(data_wdMask);
		wd($("[data-wd-page]")).execute(data_wdPage);
		wd($("[data-wd-click]")).execute(data_wdClick);
		return;
	};

	function clickProcedures(ev) {
		/*Procedimento a executar após eventos click*/
		if (ev.which !== 1) {return;}
		data_wdAction(ev.target);
		data_wdActive(ev.target);
		data_wdSortCol(ev.target);
		return;
	};
	
	function keyboardProcedures(ev) {
		/*Procedimento a executar após acionamento do teclado*/
		data_wdFilter(ev.target);
		data_wdMask(ev.target);
		return;
	};

	function scalingProcedures(ev) {
		/*Procedimento para definir o dispositivo pelo tamanho da tela*/
		var device, width, height;
		width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		if (width >= 768) {
			device = "desktop";
		} else if (width >= 600) {
			device = "tablet";
		} else {
			device = "phone";
		};
		if (device !== deviceController) {
			deviceController = device;
			if (type(ev) !== "?") {
				stylingProcedures();
			}
		}
		return;
	};
	
	function stylingProcedures() {
		/*Procedimento a executar após redimensionamento da tela*/
		wd($("[data-wd-desktop], [data-wd-tablet], [data-wd-phone]")).execute(data_wdDevice);
		return;
	};

	function settingProcedures(e, attr) {
		/*Procedimento a executar após definição de dataset*/
		switch(attr) {
			case "wdLoad":    loadingProcedures(); break;
			case "wdRepeat":  loadingProcedures(); break;
			case "wdSort":    data_wdSort(e);      break;
			case "wdFilter":  data_wdFilter(e);    break;
			case "wdMask":    data_wdMask(e);      break;
			case "wdPage":    data_wdPage(e);      break;
			case "wdClick":   data_wdClick(e);     break;
			case "wdDesktop": data_wdDevice(e);    break;
			case "wdTablet":  data_wdDevice(e);    break;
			case "wdPhone":   data_wdDevice(e);    break;
		};
		return;
	};

	/*Definindo eventos*/
	wd(window).handler({
		load: [loadingProcedures, hashProcedures],
		resize: scalingProcedures,
		hashchange: hashProcedures
	});
	wd(document).handler({
		click: clickProcedures,
		keyup: keyboardProcedures
	});

/*===========================================================================*/
	function wd(input) {
		/*Retorna o construtor de acordo com o tipo de input*/
		switch(type(input, true)) {
			case "text":   return WDstring(input); break;
			case "bool":   return WDboolean(input); break;
			case "number": return WDnumber(numberDefiner(input)); break;
			case "array":  return WDarray(input); break;
			case "regex":  return WDregexp(input); break;
			case "date":   return WDdate(input); break;
			case "time":   return WDtime(input); break;
			case "path":   return WDajax(input); break;
			case "html":   return WDhtml(input); break;
			case "[html]": return WDhtml(input); break;
			case "doc":    return WDhtml(input); break;
			case "win":    return WDhtml(input); break;
			default:       return WD(input);
		}
		return null;
	};

	function msg(text, type) {
		/*Imprime mensagem no console*/
		var types = {e: "error", w: "warn", i: "info"};
		if (types[type] in console) {
			console[types[type]](text);
		} else {
			console.log(text);
		}
		return;
	};

	function $(selector, root) {
		/*Retorna os elementos html identificados pelo seletor css no elemento root*/
		if (root === undefined) {root = document;}
		return root.querySelectorAll(selector);
	};

	function lang() {
		/*Retorna a linguagem do documento, a definida ou a do navegador*/
		var lang = document.body.parentElement.lang.replace(/\ +/g, "");
		return lang.length !== 0 ? lang : navigator.language || navigator.browserLanguage || "en-US";
	};
	
	function type(input, ajax) {
		/*Retorna o tipo de input*/
		if (ajax === undefined) {ajax = false;}
		var x;
		if (input === undefined) {
			x = "?";
		} else if (input === null) {
			x = "0";
		} else if (typeof input === "boolean" || input instanceof Boolean) {
			x = "bool";
		} else if (typeof input === "number" || input instanceof Number) {
			x = "number";
		} else if (typeof input === "string" || input instanceof String) {
			if (numberDefiner(input) !== null) {
				x = "number";
			} else if (timeDefiner(input) !== null) {
				x = "time";
			} else if (dateDefiner(input) !== null) {
				x = "date";
			} else if (ajax === true && ajaxFileExists(input)) {
				x = "path";
			} else {
				x = "text";
			}
		} else if (Array.isArray(input) || input instanceof Array) {
			x = "array";
		} else if (input.constructor === RegExp || input instanceof RegExp) {
			x = "regex";
		} else if (typeof input === "f()" || input instanceof Function) {
			x = "f()";
		} else if (input instanceof Date) {
			x = "date";
		} else if (input.constructor === Object) {
			x = "object";
		} else if (input instanceof HTMLElement) {
			x = "html";
		} else if (
			input instanceof NodeList ||
			input instanceof HTMLCollection ||
			input instanceof HTMLAllCollection ||
			input instanceof HTMLFormControlsCollection
		) {
			x = "[html]";
		} else if (input === document) {
			x = "doc";
		} else if (input === window) {
			x = "win";
		} else {
			try {
				x = input.constructor.name;
			} catch(e) {
				x = "unknown"
			}
		}
		return x;
	};

/*===========================================================================*/
	function stringMask(input, regex) {
		/*Se input casar com regex, retorna input com a máscara de regex, caso contrário, falso*/
		input = String(input);
		if (regex.test(input)) {return input;}
		var pattern, check, target, group, close, metaReference, metacharacter, expression;
		pattern = regex.source;
		check   = "";
		target  = "";
		group   = 1;
		close   = true;
		metaReference = ["n", "d", "D", "w", "W", "s", "S", "t", "r", "n", "v", "f", "b", "B"];
		metacharacter = ["\n", "\d", "\D", "\w", "\W", "\s", "\S", "\t", "\r", "\n", "\v", "\f", "\b", "\B"];
		expression    = ["[", "]", "|", "^", "$", ".", "(", ")", "*", "+", "?", "{", "}"];
		for (var i = 0; i < pattern.length; i++) {
			if (pattern[i] === "\\") {
				i++;
				if (metaReference.indexOf(pattern[i]) < 0) {
					target += pattern[i];
				}	else {
					target += metacharacter[metaReference.indexOf(pattern[i])];
				}
			} else if (pattern[i] === "(") {
				check  += pattern[i];
				target += "$"+group;
				close   = false;
				group++;
			} else if (pattern[i] === ")") {
				check += pattern[i];
				close  = true;
			} else if (close && expression.indexOf(pattern[i]) === -1) {
				target += pattern[i];
			} else {
				check += pattern[i];
			}
		}
		check = new RegExp(check);
		if (check.test(input)) {
			input = input.replace(check, target);
			return input;
		}
		return false;
	};

	function stringTitle(input) {
		/*Retorna input com primeira letra de cada palavra em caixa alta*/
		var value = "";
		for (var i = 0; i < input.length; i++) {
			if (input[i-1] === " " || i === 0) {value += input[i].toUpperCase();
			} else {
				value += input[i];
			}
		}
		return value;
	};

	function stringTrim(input) {
		/*Elimina espaços desnecessários de input*/
		return input.trim().replace(/ +/g, " ");
	};

	function stringClear(input) {
		/*Elimina os acentos de input*/
		var clear = {
			A: /[À-Æ]/g,
			C: /[Ç]/g,
			E: /[È-Ë]/g,
			I: /[Ì-Ï]/g,
			D: /[Ð]/g,
			N: /[Ñ]/g,
			O: /[Ò-ÖØ]/g,
			U: /[Ù-Ü]/g,
			Y: /[Ý]/g,
			a: /[à-æ]/g,
			c: /[ç]/g,
			e: /[è-ë]/g,
			i: /[ì-ï]/g,
			d: /[ð]/g,
			n: /[ñ]/g,
			o: /[ò-öø]/g,
			u: /[ù-ü]/g,
			y: /[ýÿ]/g
		};
		input = String(input);
		if ("normalize" in String) {
			input = input.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
		} else {
			for (var i in clear) {
				input = input.replace(clear[i], i);
			}
		}
		return input;
	};

/*===========================================================================*/
	function arrayDel(array, item) {
		/*Retona array sem item*/
		while (array.indexOf(item) >= 0) {
			array.splice(array.indexOf(item), 1);
		}
		return array;
	};
	
	function arrayAdd(array, item) {
		/*Retona o array acrescido de item, se item ainda não estiver listado*/
		if (array.indexOf(item) < 0) {array.push(item);}
		return array;
	};

	function arrayToggle(array, item) {
		/*Retorna array acrescido ou diminuído de item a depender da existência de item em array*/
		if (arrayCount(array, item) === 0) {
			array = arrayAdd(array, item);
		} else {
			array = arrayDel(array, item);
		}
		return array;
	};

	function arrayCount(array, item) {
		/*Retorna a quantidade de vezes que o item aparece em array*/
		var count = 0;
		for (var i = 0; i < array.length; i++) {
			if (array[i] === item) {count++;}
		}
		return count;
	};

	function arrayReplace(array, item, value) {
		/*Retorna array com substituição de item por value*/
		if (item === value) {return array;}
		while (array.indexOf(item) >= 0) {
			array[array.indexOf(item)] = value;
		}
		return array;
	};

	function arraySort(array) {
		/*Retorna o array ordenado: números, tempo, data e outros*/
		var aNumber, aTime, aDate, aNormal, aReturn, re, y, x, kind;
		aNumber = [];
		aTime   = [];
		aDate   = [];
		aNormal = [];
		aReturn = [];
		for (var i = 0; i < array.length; i++) {
			x    = array[i];
			kind = type(x);
			if (kind === "number") {
				aNumber.push({"x": x, "y": numberDefiner(x)});
			} else if (kind === "date") {
				aDate.push({"x": x, "y": dateDefiner(x)});
			} else if (kind === "time") {
				aDate.push({"x": x, "y": timeDefiner(x)});
			} else {
				aNormal.push({"x": x, "y": stringClear(x)});
			}
		}
		aNumber.sort(function(a,b) {return a.y - b.y;});
		aTime.sort(function(a,b) {return a.y - b.y;});
		aDate.sort(function(a,b) {return a.y - b.y;});
		aNormal.sort(function(a,b) {return a.y > b.y;});
		aNumber.forEach(function(v, i, a) {a[i] = v.x;});
		aTime.forEach(function(v, i, a) {a[i] = v.x;});
		aDate.forEach(function(v, i, a) {a[i] = v.x;});
		aNormal.forEach(function(v, i, a) {a[i] = v.x;});
		aReturn = aReturn.concat(aNumber, aTime, aDate, aNormal);
		return aReturn;
	};

	function arrayUnique(array) {
		/*Retorna array sem elementos duplicados*/
		return array.filter(function(v, i, a) {return a.indexOf(v) == i;});
	};

	function arrayOrganized(array) {
		/*Retorna array combinadocom arrayUnique e arraySort*/
		return arraySort(arrayUnique(array));
	};

/*===========================================================================*/
	function numberDefiner(input) {
		/*checa se o valor de entrada é um número e retorna seu valor, caso contrário, retorna falso*/
		var value;
		if (typeof input === "number" || input instanceof Number) {
			value = input;
		} else {
			input = String(input).trim();
			if (/^(\+|\-)?[0-9]+(\.[0-9]+)?$/.test(input)) {
				value = Number(input);
			} else if (/^(\+|\-)?[0-9]+(\.[0-9]+)?e(\+|\-)?[0-9]+$/.test(input)) {
				value = Number(input);
			} else if (/^(\+|\-)Infinity$/.test(input)) {
				value = Number(input);
			} else {
				value = null;
			}
		}
		return value;
	};

	function numberInteger(input) {
		/*Retorna o valor inteiro do número*/
		input = numberDefiner(input);
		return Number(String(input).replace(/\.[0-9]+/g, ""));
	};

	function numberFraction(input) {
		/*Retorna a parte decimal do número*/
		input = numberDefiner(input);
		return input%1 === 0 ? 0 : Number(String(input).replace(/[0-9]+\./g, "0."));
	};

	function numberIsInteger(input) {
		/*Verifica se o número é inteiro*/
		input = numberDefiner(input);
		return input%1 === 0 ? true : false;
	};

	function numberIsFloat(input) {
		/*Verifica se o número é decimal*/
		input = numberDefiner(input);
		return input%1 !== 0 ? true : false;
	};

	function numberIsNatural(input) {
		/*Verifica se o número é natural >= 0*/
		input = numberDefiner(input);
		return input%1 === 0 && input >= 0 ? true : false;
	};

	function numberIsNegative(input) {
		/*Verifica se o número é maior que zero*/
		input = numberDefiner(input);
		return input < 0 ? true : false;
	};

	function numberIsPositive(input) {
		/*Verifica se o número é menor que zero*/
		input = numberDefiner(input);
		return input > 0 ? true : false;
	};

	function numberAbs(input) {
		/*Retorna o valor absoluto do número*/
		input = numberDefiner(input);
		return input < 0 ? -input : input;
	};

	function numberInverse(input) {
		/*Retorna o inverso do número (1/x)*/
		input = numberDefiner(input);
		var x;
		if (input === 0) {
			x = Infinity;
		} else if (input === Infinity || input === -Infinity) {
			x = 0;
		} else {
			x = 1/input;
		}
		return x;
	};

	function numberRound(input, width) {
		/*Arredonda o número*/
		input = numberDefiner(input);
		return Number(input.toFixed(width));
	};

	function numberRoundUp(input) {
		/*Arredonda o número para cima*/
		input = numberDefiner(input);
		var x = input;
		if (input === 0) {
			x = input;
		} else if (input > 0) {
			x = numberInteger(input)+1;
		} else {
			x = numberInteger(input)-1;
		}
		return x;
	};

	function numberScientific(input, width) {
		/*Transcreve a notação científica para html*/
		input = numberDefiner(input);
		return input.toExponential(width).replace(/e(.+)$/, " x 10<sup>$1</sup>").replace("+", "");
	};

	function numberLocale(input, locale) {
		/*Retorna o número no formato local ou definido no html*/
		input = numberDefiner(input);
		if (locale === undefined) {locale = lang();}
		return "toLocaleString" in Number ? input.toLocaleString(locale) : input.toString();
	};

	function numberCurrency(input, locale, currency) {
		/*Retorna o número no formato monetário local ou defuinido no html*/
		input = numberDefiner(input);
		if (locale === undefined) {locale = lang();}
		if (currency === undefined) {currency = "";}
		var x;
		if ("toLocaleString" in Number) {
			try {
				x = input.toLocaleString(locale, {style: "currency", currency: currency});
			} catch(e) {
				x = currency+numberLocale(input, locale);
			}
		} else {
			x = input.toString();
		}
		return x;
	};

/*===========================================================================*/
	function dateLeap(y) {
		/*Retorna verdadeiro se o y (ano) é bissexto e falso se não for*/
		var x = false;
		if (y === 0) {
			x = false;
		} else if (y%400 === 0) {
			x = true;
		} else if (y%100 === 0) {
			x = false;
		} else if (y%4 === 0) {
			x = true;
		} else {
			x = false;
		}
		return x;
	};

	function dateWeek(n) {
		/*Retorna o dia da semana(1 - domingo, 7 - sábado)*/
		return (n + WEEK_REF)%7 === 0 ? 7 : (n + WEEK_REF)%7;
	};

	function dateWeeks(y, days) {
		/*Retorna a semana do ano*/
		var ref, weeks;
		ref   = dateWeek(dateToNumber(y, 1, 1));
		weeks = numberInteger(1 + (ref + days - 2)/7);
		return weeks;
	};

	function dateDayYear(y, m, d) {
		/*Retorna o da do ano*/
		var n = dateLeap(y) ? 1 : 0;
		return [0, 31, 59+n, 90+n, 120+n, 151+n, 181+n, 212+n, 243+n, 273+n, 304+n, 334+n][m-1]+d;
	};
	
	function dateCountdown(y, m, d) {
		/*Contagem regressiva para o fim do ano*/
		return (dateLeap(y) ? 366 : 365) - dateDayYear(y, m, d);
	};

	function dateLenghtMonth(y, m) {
		/*Retorna a quantidade de dias do mês*/
		var n = dateLeap(y) ? 1 : 0;
		return [31, 28+n, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m-1];
	};
	
	function dateChecking(y, m, d) {
		/*Checa se a data existe*/
		var x;
		if (y < Y_0 || y > Y_max) {
			x = false;
		} else if (m < 1 || m > 12) {
			x = false;
		} else if (d < 1 || d > dateLenghtMonth(y, m)) {
			x = false;
		} else {
			x = true;
		}
		return x;
	};

	function dateToNumber(y, m, d) {
		/*Transforma a data para a referência numérica*/
		var l4, l100, l400, delta;
		delta = y === Y_0 ? 0 : 365*(y - Y_0);
		l4    = y < Y_4 ? 0   : numberInteger((y - 1)/4);
		l100  = y < Y_100 ? 0 : numberInteger((y - 1)/100);
		l400  = y < Y_400 ? 0 : numberInteger((y - 1)/400);
		return delta + l4 - l100 + l400 + dateDayYear(y, m, d);
	};

	function dateFromNumber(n) {
		/*Transforma número em data*/
		var y, m = 1, d = 1, x;
		y = numberInteger(n/365) + Y_0;
		while (dateToNumber(y,1,1) > n) {y--;}
		while (dateToNumber(y, m+1, 1) - 1 < n) {m++;}
		while (dateToNumber(y, m, d) !== n) {d++;}
		return {y: y, m: m, d: d};
	};

	function dateDefiner(input) {
		/*Define o valor numérico da data se verdadeiro, ou retorna null se data inválida*/
		var date;
		if (input === "%today") {
			input = new Date();
			date = {y: input.getFullYear(), m: input.getMonth()+1, d: input.getDate()};
		} else if (input instanceof Date) {
			date = {y: input.getFullYear(), m: input.getMonth()+1, d: input.getDate()};
		} else if (/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/.test(input)) {/*YYYY-MM-DD*/
			input = input.split("-");
			date = {y: numberDefiner(input[0]), m: numberDefiner(input[1]), d: numberDefiner(input[2])};
		} else if (/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(input)) {/*MM/DD/YYYY*/
			input = input.split("/");
			date = {y: numberDefiner(input[2]), m: numberDefiner(input[0]), d: numberDefiner(input[1])};
		} else if (/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/.test(input)) {/*DD.MM.YYYY*/
			input = input.split(".");
			date = {y: numberDefiner(input[2]), m: numberDefiner(input[1]), d: numberDefiner(input[0])};
		} else {
			date = null;
		}
		if (date !== null && dateChecking(date.y, date.m, date.d) === true) {
			date = dateToNumber(date.y, date.m, date.d);
		} else {
			date = null;
		}
		return date;
	};

	function dateSet(value, input, id) {
		/*Altera o valor da data a partir da definição de dia, mês ou ano*/
		input = numberDefiner(input);
		var date, test, output, y, m, d;
		if (type(input) !== "number" || !numberIsInteger(input)) {
			msg("Values must be an integer number.", "e");
			output  = value;
		} else {
			date = dateFromNumber(value);
			test = {y: date.y, m: date.m, d: date.d};
			test[id] = input;
			if (id !== "d" && test.d > dateLenghtMonth(test.y, test.m)) {
				test.d = dateLenghtMonth(test.y, test.m);
			}
			if (dateChecking(test.y, test.m, test.d) === true) {
				output = dateToNumber(test.y, test.m, test.d);
			} else if (id === "d") {
				output = dateToNumber(date.y, date.m, 1) - 1 + input;
			} else if (id === "m") {
				y = date.y + (input <= 0 ? numberInteger((input - 12)/12) : numberInteger((input - 1)/12));
				m = input < 1 ? 12 - numberAbs(input)%12 : input%12	;
				if (m === 0) {
					m = 12;
				}
				d = date.d > dateLenghtMonth(y, m) ? dateLenghtMonth(y, m) : date.d;
				output = dateToNumber(y, m, d);
			} else if (id === "y") {
				m = date.m;
				y = input;
				d = date.d > dateLenghtMonth(y, m) ? dateLenghtMonth(y, m) : date.d;
				output = dateToNumber(y, m, d);
			}
			if (output < 1) {
				msg("Lower limit for date has been extrapolated. Limit value set.", "w");
				output = 1;
			}
			else if (output > dateToNumber(Y_max, 12, 31)){
				msg("Upper limit for date has been extrapolated. Limit value set.", "w");
				output = dateToNumber(Y_max, 12, 31);
			}
		}
		return output;
	};

	function dateFormat(value, string, locale) {
		/*Formata a data de acordo conforme especificado na string*/
		if (locale === undefined) {locale = lang();}
		var date, ref, names;
		date   = dateFromNumber(value);
		ref    = new Date(1970, date.m - 1, 15, 12, 0, 0, 0);
		ref.setDate(15 + dateWeek(value) - (ref.getDay()+1));
		names = {
			"%d": date.d, "%D": ("00"+date.d).slice(-2), "@d": dateDayYear(date.y, date.m, date.d),
			"%m": date.m, "%M": ("00"+date.m).slice(-2), "@m": dateLenghtMonth(date.y, date.m),
			"#m": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.m - 1],
			"#M": [
				"January", "February", "March", "April",
				"May", "June", "July", "August",
				"September", "October", "November", "December"
			][date.m - 1],
			"%y": date.y, "%Y": ("0000"+date.y).slice(-4),
			"%w": dateWeek(value), "@w": dateWeeks(date.y, dateDayYear(date.y, date.m, date.d)),
			"#w": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dateWeek(value) - 1],
			"#W": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dateWeek(value) - 1],
			"%l": dateLeap(date.y) ? 366 : 365, "%c": dateCountdown(date.y, date.m, date.d)
		}
		try {
			ref.toLocaleString(locale);
			names["#w"] = ref.toLocaleString(locale, {weekday: "short"});
			names["#W"] = ref.toLocaleString(locale, {weekday: "long"});
			names["#m"] = ref.toLocaleString(locale, {month: "short"});
			names["#M"] = ref.toLocaleString(locale, {month: "long"});
		} catch(e) {
			msg("dateFormat: toLocaleString not defined.", "a");
		}
		if (type(string) === "?") {
			string = ("0000"+date.y).slice(-4)+"-"+("00"+date.m).slice(-2)+"-"+("00"+date.d).slice(-2);
		} else {
			for (var i in names) {string = string.replace(new RegExp(i, "g"), names[i]);}
		}
		return string;
	};

/*===========================================================================*/
	function timeDefiner(input) {
		/*Define o valor numérico do tempo se verdadeiro, ou retorna null se inválido*/
		var time;
		if (input === "%now") {
			input = new Date();
			time = 3600*input.getHours() + 60*input.getMinutes() + input.getSeconds();
		} else if (/^[0-9]+(\:[0-5][0-9]){1,2}$/.test(input)) {
			input = input.split(":");
			time  = 3600*Number(input[0]) + 60*Number(input[1]) + (input[2] === undefined ? 0 : Number(input[2]))
		} else if (/^12:[0-5][0-9]am$/.test(input)) {
			input = input.split(/[^0-9]/);
			time  = 3600*0+60*Number(input[1]);
		} else if (/^(0?[1-9]|1[0-1]):[0-5][0-9]am$/.test(input)) {
			input = input.split(/[^0-9]/);
			time  = 3600*Number(input[0])+60*Number(input[1]);
		} else if (/^12:[0-5][0-9]pm$/.test(input)) {
			input = input.split(/[^0-9]/);
			time  = 3600*12+60*Number(input[1]);
		} else if (/^(0?[1-9]|1[0-1]):[0-5][0-9]pm$/.test(input)) {
			input = input.split(/[^0-9]/);
			time  = 3600*(12+Number(input[0]))+60*Number(input[1]);
		} else if (/^([01][0-9]|2[0-3])h[0-5][0-9]$/.test(input)) {
			input = input.split("h");
			time  = 3600*Number(input[0])+60*Number(input[1]);
		} else {
			time = null;
		}
		return time;
	};
	
	function timeToNumber(h, m, s, t) {
		/*Transforma tempo para segundos*/
		if (
			type(h) !== "number" || !numberIsInteger(h) ||
			type(m) !== "number" || !numberIsInteger(m) ||
			type(s) !== "number" || !numberIsInteger(s)
		) {
			msg("Values must be an integer number.", "e");
		} else {
			t = 3600*numberDefiner(h) + 60*numberDefiner(m) + numberDefiner(s);
			if (t < 0) {
				msg("Lower limit for time has been extrapolated. Limit value set.", "w");
				t = 0;
			}
		}
		return t;
	};

	function timeFromNumber(t) {
		/*Transforma segundos em tempo*/
		var h, m, s;
		h = numberInteger(t/3600);
		m = numberInteger((t - (3600*h))/60)
		s = t - 3600*h - 60*m;
		return {h: h, m: m, s: s};
	};

	function timeGet(t, id) {
		/*Retorna as propriedades do tempo*/
		var time, h24, output;
		time = timeFromNumber(t);
		h24  = time.h%24;
		if (id in time) {
			output = time[id];
		} else if (id === "h24") {
			output = h24;
		} else if (id === "ampm") {
			if (h24 === 0) {
				output = "12:"+("00"+time.m).slice(-2)+"am";
			} else if (h24 < 12) {
				output = h24+":"+("00"+time.m).slice(-2)+"am";
			} else if (h24 === 12) {
				output = "12:"+("00"+time.m).slice(-2)+"pm";
			} else {
				output = (h24-12)+":"+("00"+time.m).slice(-2)+"pm";
			}
		} else {
			output = time.h+":"+("00"+time.m).slice(-2)+":"+("00"+time.s).slice(-2)
		}
		return output;
	};

	function timeFormat(t, string) {
		/*Formata o tempo de acordo com o especificado na string substituindo os valores dos objetos*/
		var time, names;
		time = timeFromNumber(t);
		names = {
			"%h": time.h, "%H": timeGet(t, "h24"), "#h": timeGet(t, "ampm"),
			"%m": time.m, "%M": ("00"+time.m).slice(-2),
			"%s": time.s, "%S": ("00"+time.s).slice(-2),
		}
		if (type(string) === "?") {
			string = timeGet(t);
		} else {
			for (var i in names) {
				string = string.replace(new RegExp(i, "g"), names[i]);
			}
		}
		return string;
	};

/*===========================================================================*/
	function ajaxGetRequest() {
		/*Obtém objeto para requisições ajax*/
		try {return new XMLHttpRequest();} catch(e) {}
		try {return new ActiveXObject("Msxml2.XMLHTTP");} catch(e) {}
		try {return new ActiveXObject("Microsoft.XMLHTP");} catch(e) {}
		msg("AJAX is not available in your browser.", "e");
		return null;	
	};

	function ajaxFileExists(input) {
		/*Verifica se input é um caminho ou arquivo acessível*/
		var xhttp = ajaxGetRequest();
		if (xhttp === null) {return false;}
		try {
			xhttp.open("HEAD", ajaxPath(input).action, false);
			xhttp.send();
			return xhttp.status === 200 || xhttp.status === 304 ? true : false;
		} catch(e) {
			return false;
		}
	};

	function ajaxResponse(response, error) {
		/*Retorna objeto contendo os métodos com as informações da requisição*/
		var argument = {
			error: error,
			request: response,
			get text() {return this.error ? null : this.request.responseText;},
			get xml()  {return this.error ? null : this.request.responseXML;},
			get json() {
				if (this.error) {return null;}
				try {
					return JSON.parse(this.text);
				} catch(e) {
					try {return eval("("+this.text+")");} catch(e) {return null;}
				}
			}
		};
		Object.freeze(argument);
		return argument;	
	};

	function ajaxSend(path, method, execute, time) {
		/*Solicita e retorna requisição ajax*/
		addAjaxModal();
		var argument = {error: true, request: null, text: null, xml: null, json: null};
		try {
			var path, request;
			request = ajaxGetRequest()
			path    = ajaxPath(path);
			if (type(time) === "number") {request.timeout = 1000*numberDefiner(time);}
			request.onreadystatechange = function(ev) {
				if (this.readyState === 4) {
					if (this.status === 200 || this.status === 304) {
						argument = ajaxResponse(this, false);
					} else {
						argument = ajaxResponse(this, true);
					}
					delAjaxModal();
					if (type(execute) === "f()") {execute.call(this, argument);}
				}
				return;
			};
			if (method === "POST") {
				request.open(method, path.action, true);
				request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				request.send(path.serial);
				//request.setRequestHeader("Content-type", "multipart/form-data");
				//request.send(path.file);
			} else {
				request.open(method, path.full, true);
				request.send();
			}
		} catch(e) {
			delAjaxModal();
			if (type(execute) === "f()") {execute.call(this, argument);}
		}
		return;
	};

	function ajaxPath(input) {
		/*Retorna objeto contendo as informações sobre a URL separadas em action, serial e full*/
		var action, serial, hash;
		input  = input.split("?");
		action = input[0];
		if (input.length === 1) {
			serial = "";
		} else if (input[1][0] === "@") {
			serial = ajaxGetSerialForm(input[1].split("#")[0]);
		} else {
			serial = input.join("?").replace(action+"?", "");
		}
		return {
			action: action,
			serial: serial === "" ? null : serial,
			full: serial === "" ? action : action+"?"+serial,
		};
	};
	
	
	function ajaxGetSerialForm(fname) {
		/*Obtem a serialização a partir do formulário informado*/
		var form, serial, inputs, elem, name, tag, value, itype, atype, check;
		form = document.getElementsByName(fname.replace("@", ""))[0];
		serial = [];
		if (form !== undefined && form.tagName.toUpperCase() === "FORM") {
			inputs = form.elements;
			for (var i = 0; i < inputs.length; i++) {
				elem  = inputs[i];
				name  = elem.name;
				tag   = elem.tagName.toUpperCase();
				value = elem.value;
				itype = tag === "INPUT" ? elem.type.toUpperCase() : null;
				atype = tag === "INPUT" ? elem.attributes.type.value.toUpperCase() : itype;
				check = itype === "RADIO" || itype === "CHECKBOX" ? elem.checked : null;
				if (name === undefined || name === null || stringTrim(name) === "") {
					continue;
				} else if ((itype === "RADIO" || itype === "CHECKBOX") && check === false) {
					continue;
				} else if (atype === "DATE" || itype === "DATE") {
						value = type(value) === "date" && value !== "%today" ? dateFormat(dateDefiner(value)) : value;
				} else if (atype === "TIME" || itype === "TIME") {
						value = type(value) === "time" && value !== "%now" ? timeFormat(timeDefiner(value)) : value;
				}
				serial.push(name+"="+encodeURIComponent(value));
			}
		}
		return serial.join("&");
	};
/*===========================================================================*/
	function htmlLoad(elem, text) {
		/*Carrega página HTML requisitada no elemento informado*/
		var scripts, script;
		elem.innerHTML = text;
		scripts = elem.querySelectorAll("script");
		for (var i = 0; i < scripts.length; i++) {
			script = document.createElement("script");
			if (scripts[i].src === "") {
				script.textContent = scripts[i].textContent;
			} else {
				script.src = scripts[i].src;
			}
			elem.appendChild(script);
			htmlAction(script, "del");
		}
		loadingProcedures();
		return;
	};

	function htmlRun(input, method) {
		/*Executa o método informado loopando todos elementos html (input)*/
		if (["html", "doc", "win"].indexOf(type(input)) >= 0) {input = [input];}
		for (var i = 0; i < input.length; i++) {
			if (input[i] !== window && input[i].nodeType != 1 && input[i].nodeType != 9) {continue;}
			method(input[i]);
		}
		return;
	};

	function htmlCamelCase(input) {
		/*Transforma atributo com traço para camel case*/
		var camel = "";
		input = stringTrim(input).toLowerCase();
		for (var n in input) {
			if (input[n] === "-") {
				continue;
			} else if (input[n-1] === "-") {
				camel += input[n].toUpperCase();
			} else {
				camel += input[n];
			}
		}
		return camel;
	};

	function htmlSetHandler(elem, event, method, act) {
		/*Define função para adicionar eventos*/
		event = (/^on/i).test(event) ? event.toLowerCase() : "on"+event.toLowerCase();
		if (type(method) !== "f()" && method !== null) {
			msg("The "+event+" attribute must be a function or null value.", "e");
			return;
		}
		if (!(event in elem)) {
			msg("The \""+event+"\" attribute was not found in "+elem.tagName+" element!", "w");
			return;
		}
		if (method === null) {
			elem[event] = null;
			return;
		}
		var methods;
		if (type(elem[event]) !== "f()") {
			methods = [];
		} else if (elem[event].name === "wdEventHandler") {
				methods = elem[event]("showMethods");
		} else {
			methods = [elem[event]];
		}
		if (act === "add") {
			methods = arrayAdd(methods, method);
		} else if (act === "del") {
			methods = arrayDel(methods, method);
		}
		function wdEventHandler(ev) {
			if (ev === "showMethods") {return methods;}
			for (var i = 0; i < methods.length; i++) {methods[i].call(this, ev);}
		}
		elem[event] = wdEventHandler;
		return;
	};

	function htmlHandler(elem, obj, remove) {
		/*Determina ação para definir manipuladores de evento a partir de um objeto*/
		if (obj === undefined) {obj = {};}
		if (remove === undefined) {remove = false;}
		var act, method, methods;
		act = remove === true ? "del" : "add";
		for (var event in obj) {
			methods = type(obj[event]) === "array" ? obj[event] : [obj[event]];
			for (var j = 0; j < methods.length; j++) {
				method = methods[j];
				htmlSetHandler(elem, event, method, act);
			}
		}
		return;
	};

	function htmlStyle(elem, styles) {
		/*Define o atributo style do elemento a partir da nomenclatura CSS*/
		if (styles === undefined) {styles = {};}
		var css, camel;
		for (var i in styles) {
			camel = stringTrim(i);
			css   = htmlCamelCase(i);
			if (camel in elem.style) {
				elem.style[camel] = styles[i];
			} else if (css in elem.style) {
				elem.style[css] = styles[i];
			} else {
				msg("htmlStyle: the \""+i+"\" attribute was not found in "+elem.tagName+" element!", "w");
			}
		}
		return;
	};

	function htmlClass(elem, list) {
		/*Manipula os valores do atributo class*/
		if (list === undefined) {list = {};}
		var values, i;
		values = arrayOrganized(stringTrim(elem.className).split(" "));
		if (list === null) {
			values = [];
		} else if (type(list) === "object") {
			if ("add" in list) {
				if (type(list.add) !== "array") {
					list.add = [list.add];
				}
				for (i = 0; i < list.add.length; i++) {
					values = arrayAdd(values, list.add[i]);
				}
			}
			if ("del" in list) {
				if (type(list.del) !== "array") {
					list.del = [list.del];
				}
				for (i = 0; i < list.del.length; i++) {
					values = arrayDel(values, list.del[i]);
				}
			}
			if ("toggle" in list) {
				if (type(list.toggle) !== "array") {
					list.toggle = [list.toggle];
				}
				for (i = 0; i < list.toggle.length; i++) {
					values = arrayToggle(values, list.toggle[i]);
				}
			}
		}
		elem.className = values.length === 0 ? "" : stringTrim(arrayOrganized(values).join(" "));
		return;
	};
	
	function htmlData(elem, obj) {
		/*Define o valor dos atributos data*/
		if (obj === undefined) {obj = {};}
		var key;
		for (var i in obj) {
			key = /\-/.test(i) ? htmlCamelCase(i) : i;
			if (obj[i] === null) {
				delete elem.dataset[key];
			} else {
				elem.dataset[key] = type(obj[i]) === "regex" ? obj[i].source : obj[i];
				settingProcedures(elem, key);
			}
		}
		return;
	};

	function htmlFilter(elem, string, min) {
		/*Exibe somente os elementos filhos cujo conteúdo textual contenha o valor informado*/
		if (string === undefined) {string = "";}
		if (min === undefined) {min = 0;}
		
		
		if (string.length < min) {return;}
		var child, content;
		string = string.toUpperCase();
		child  = elem.children;
		for (var i = 0; i < child.length; i++) {
			content = child[i].textContent.toUpperCase();
			if   (content.indexOf(string) === -1) {child[i].style.display = "none";}
			else {child[i].style.display = null;}
		};
		return;
	};

	function htmlRepeat(elem, object) {
		/*Constroi elementos html a partir de um array de objetos*/
		var inner, re, html;
		html = elem.innerHTML;
		if (html.search(/\{\{.+\}\}/gi) >= 0) {
			elem.dataset.wdRepeatModel = html;
		} else if ("wdRepeatModel" in elem.dataset) {
			html = elem.dataset.wdRepeatModel;
		} else {
			return false;
		}
		elem.innerHTML = "";
		html = html.replace(/\}\}\=\"\"/gi, "}}");
		for (var i in object) {
			inner = html;
			for (var c in object[i]) {
				re = new RegExp("\\{\\{"+c+"\\}\\}", "g");
				inner = inner.replace(re, object[i][c]);
			};
			elem.innerHTML += inner;
		};
		loadingProcedures();
		return;
	};

	function htmlSort(elem, order, col) {
		/*Ordena os filhos do elemento com base em seu conteúdo textual*/
		if (order === undefined) {order = 1;}
		if (col === undefined) {col = null;}
		var dom = [], text = [], sort = [], seq = [], index, childs;
		childs = elem.children;
		for (var i = 0; i < childs.length; i++) {
			dom.push(childs[i]);
			if (col === null) {
				text.push(stringTrim(childs[i].textContent.toUpperCase()));
				sort.push(stringTrim(childs[i].textContent.toUpperCase()));
			}
			else {
				text.push(stringTrim(childs[i].children[col].textContent.toUpperCase()));
				sort.push(stringTrim(childs[i].children[col].textContent.toUpperCase()));
			}
		};
		sort = arraySort(sort);
		for (i = 0; i < sort.length; i++) {
			index = text.indexOf(sort[i]);
			seq.push(index);
			text[index] = null;
		};
		if (order < 0) {seq.reverse();}
		for (i = 0; i < seq.length; i++) {
			elem.appendChild(dom[seq[i]]);
		};
		return;
	};

	function htmlPage(elem, page, size) {
		/*Exibe somente os elementos filhos no intervalo numérico informado*/
		if (page === undefined) {page = 0;}
		if (size === undefined) {size = 1;}
		var lines, width, pages = [], section = [];
		page = numberRound(page, 0);
		size = size === 0 ? 1 : numberAbs(size);
		lines = elem.children;
		width = (size <= 1 && size > 0) ? numberRound(size * lines.length, 0) : numberRound(size, 0);
		for (var i = 0; i < lines.length; i++) {
			section.push(lines[i]);
			if (section.length%width === 0 || i+1 === lines.length) {
				pages.push(section);
				section = [];
			}
		}
		if (page < 0) {page = (pages.length + page) < 0 ? 0 : pages.length + page;}
		if (page+1 > pages.length) {page = pages.length-1;}
		for (i = 0; i < pages.length; i++) {
			for (var n = 0; n < pages[i].length; n++) {
				if (i === page) {
					pages[i][n].style.display = null;
				} else {
					pages[i][n].style.display = "none";
				}
			}
		}
		return pages.length;
	};

	function htmlAction(elem, act) {
		/*Define ação para o objeto html*/
		if (act === undefined) {act = "toggle";}
		var tag = elem.tagName.toUpperCase();
		switch(act) {
			case "open":
				if (tag === "DIALOG" && "showModal" in elem) {
					elem.showModal();
				} else if (tag === "DETAILS" && "open" in elem) {
					elem.open = true;
				} else {
					elem.dataset.wdOpen = true;
				}
				break;
			case "close":
				if (tag === "DIALOG" && "close" in elem) {
					elem.close();
				} else if (tag === "DETAILS" && "open" in elem) {
					elem.open = false;
				}
				delete elem.dataset.wdOpen;
				break;
			case "toggle":
				if (elem.open === true || "wdOpen" in elem.dataset) {
					htmlAction(elem, "close");
				} else {
					htmlAction(elem, "open");
				}
				break;
			case "tab":
				var childs = elem.parentElement.children;
				for (var i = 0; i < childs.length; i++) {childs[i].style.display = "none";}
				elem.style.display = null;
				break;
			case "del":
				if (elem.remove !== undefined) {
					elem.remove();
				} else {
					elem.parentElement.removeChild(elem);
				}
				break;
			case "show":
				if (elem.style.display === "none") {
					elem.style.display = "wdHide" in elem.dataset ? elem.dataset.wdHide : null;
				}
				delete elem.dataset.wdHide;
				break;
			case "hide":
				if (elem.style.display !== "none") {
					elem.dataset.wdHide = elem.style.display;
					elem.style.display = "none";
				}
				break;
			case "check":
				if (elem.tagName.toUpperCase() === "INPUT") {
					if (elem.type.toUpperCase() === "CHECKBOX" || elem.type.toUpperCase() === "RADIO") {
						elem.checked = true;
					}
				}
				break;
			case "uncheck":
				if (elem.tagName.toUpperCase() === "INPUT") {
					if (elem.type.toUpperCase() === "CHECKBOX" || elem.type.toUpperCase() === "RADIO") {
						elem.checked = false;
					}
				}
				break;
			case "togglecheck":
				if (elem.tagName.toUpperCase() === "INPUT") {
					if (elem.type.toUpperCase() === "CHECKBOX" || elem.type.toUpperCase() === "RADIO") {
						elem.checked = elem.checked === true ? false : true;
					}
				}
				break;
			case "clean":
				if ("value" in elem) {
					elem.value = "";
				} else if ("textContent" in elem) {
					elem.textContent = ""
				} else if ("innerHTML" in elem) {
					elem.innerHTML = "";
				}
				break;
		}
		return;
	};

	function htmlGetStyles(input) {
		/*Retorna um array contendo os estilos (padrão ou computado) de todos os elementos de input*/
		var list = [];
		for (var i = 0; i < input.length; i++) {
			try {
				list.push({
					default:  "getDefaultComputedStyle" in window ? window.getDefaultComputedStyle(input[i], null) : {},
					computed: "getComputedStyle" in window ? window.getComputedStyle(input[i], null) : {}
				});
			} catch(e) {
				list.push({default: {}, computed: {}});
			}
		}
		return list;
	};
/*===========================================================================*/
	return wd;
}());


function wd$(input, root) {
	/**/
	var query = null;
	if (root === undefined || !("querySelectorAll" in root)) {
		root = document;
	}
	try {
		query = root.querySelectorAll(input);
	} catch(e) {
		query = null;
	}
	return wd(query);
};
