	/*obter os dados de formulários nome|valor (retora um array de objetos)*/
	function getFormData(elem) {
		var form, type, name, value;

		/*é preciso que o elemento tenha value e name ou retornará null*/
		form = [];
		type = [];
		name  = "name"  in elem ? elem.name  : null;
		value = "value" in elem ? elem.value : null;
		if (name === null || value === null || WD(name).type === "null") {
			return form;
		}

		/* caso o elemento seja um input (possui o atributo type) */
		if (elem.tagName.toLowerCase() === "input") {

			/* verificando o type definido e o type informado */
			type.push(elem.type.toLowerCase());
			type.push("type" in elem.attributes ? elem.attributes.type.value.toLowerCase() : type[0]);

			/* caixas de seleção */
			if (WD(type).inside("radio") || WD(type).inside("checkbox")) {
				value = elem.checked ? value : null;
			/* data */
			} else if (WD(type).inside("date")) {
				value = WD(value).type === "date" && value !== "%today" ? WD(value).toString() : null;
			/* tempo */
			} else if (WD(type).inside("time")) {
				value = WD(value).type === "time" && value !== "%now" ? WD(value).toString() : null;
			/* número */
			} else if (WD(type).inside("number") || WD(type).inside("range")) {
				value = WD(value).type === "number" ? WD(value).valueOf() : null;
			/* arquivos */
			} else if (WD(type).inside("file")) {
				/* se houver o atributo files (caso especial) */
				if ("files" in elem) {
					for (var i = 0; i < elem.files.length; i++) {
						form.push({
							name:  name+"_"+i,
							value: encodeURIComponent(elem.files[i].name),
							post:  elem.files[i]
						});
						/* para evitar o último condicional */
						value = null;
					}
				} else {
					value = value.split(/(\/|\\)/).reverse()[0];
				}
			}
		}

		/* definindo série, exceto se files existir e for maior que zero */
		if (value !== null) {
			form.push({
				name:  name,
				value: encodeURIComponent(value),
				post:  value
			});
		}

		return form;
	};
