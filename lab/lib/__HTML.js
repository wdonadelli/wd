/**
#3 Criar/Manipular Elemento
A função '{__HTML} cria ou manipula as propriedades e atributos de nó HTML retornando-o ou nulo em caso de falha.
|Argumento|Tipo|Descrição|
|tag|string|Nome da tag do elemento a ser criado e manipulado.|
|tag|node|Elemento HTML a ser manipulado.|
|attr|object|Propriedades ou atributos, nessa ordem, do elemento e seus respectivos valores.|
|uri|url|Namespace URI para um elemento qualificado|
Se a propriedade for uma função, os argumentos são repassados como array, observando o que diz o objeto '{__SETHTML} cujos métodos ou atributos são prevalentes.
**/
function __HTML(tag, attr, uri) {
	/*-- analisando dados --*/
	const check  = {tag: new __Type(tag), attr: new __Type(attr)};
	const prop   = check.attr.object ? attr : {};
	const isURI  = (/^https?\:\/\/.+/i).test(uri);
	let node     = null;
	if (check.tag.chars)
		node = isURI ? document.createElementNS(uri, tag) : document.createElement(tag);
	else if (check.tag.node && check.tag.value.length > 0)
		node = check.tag.value[0];
	else
		return null;
	/*-- definindo prorpiedades e atributos, nessa ordem --*/
	for (let name in prop) {
		let value  = prop[name];
		check.value = new __Type(value);
		check.prop  = new __Type(node[name]);
		/*-- propriedade/atributo especial --*/
		if (name in __SETHTML) {
			__SETHTML[name](node, value);
		}
		/*-- propriedade --*/
		else if (name in node) {
			if (check.prop.function && check.value.array)
				node[name].apply(node, value);
			else if (check.value.object)
				for (let i in value)
					node[name][i] = value[i];
			else
				node[name] = value;
		}
		/*-- atributos --*/
		else if (value === null) {
			__SETHTML.removeAttribute(node, value)
		}
		else {
			__SETHTML.setAttribute(node, [name, value]);
		}
	}
	return node;
};