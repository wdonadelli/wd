/**
#3 Criador HTML/DOM
Trata-se de um conjunto de funções destinadas à manipulação de elementos e árvores HTML.

#4 Manipulação de Elemento HTML
A função '{__HTML} cria ou manipula as propriedades e atributos de nó HTML retornando-o ou nulo em caso de falha.
|Argumento|Tipo|Opcional|Descrição|
|'{tag}|string|Não|Nome da tag do elemento a ser criado e manipulado.|
|'{tag}|node|Não|Elemento HTML a ser manipulado.|
|'{attr}|object|Sim|Propriedades ou atributos, nessa ordem, do elemento e seus respectivos valores.|
|'{uri}|url|Sim|Namespace URI para um elemento qualificado|
Se a propriedade informada em '{attr} for um método, seu valor deve ser um '{array} cujos itens correspondem aos respectivos argumentos do método, observando o que diz o objeto '{__SETHTML} cujos métodos ou atributos são prevalentes.
**/
function __HTML(tag, attr, uri) {
	const test = {tag: new __Type(tag), attr: new __Type(attr), uri: new __Type(uri)};
	/*-- identificando ou contruindo o elemento --*/
	let node = null;
	if (test.tag.chars)
		node = test.tag.url ? document.createElementNS(uri, tag) : document.createElement(tag);
	else if (test.tag.node && test.tag.value.length > 0)
		node = test.tag.value[0];
	else
		return null;
	/*-- definindo prorpiedades e atributos, nessa ordem --*/
	const prop = test.attr.object ? attr : {};
	for (let name in prop) {
		let value  = prop[name];
		test.value = new __Type(value);
		test.prop  = new __Type(node[name]);
		/*-- propriedades presentes em __SETHTML --*/
		if (name in __SETHTML) {
			__SETHTML[name](node, value);
		}
		/*-- propriedades padrão (métodos, objetos e valores) --*/
		else if (name in node) {
			if (test.prop.function && test.value.array)
				node[name].apply(node, value);
			else if (test.value.object)
				for (let i in value) node[name][i] = value[i];
			else
				node[name] = value;
		}
		/*-- atributos do elemento  --*/
		else if (value === null) {
			__SETHTML.removeAttribute(node, value)
		}
		else {
			__SETHTML.setAttribute(node, [name, value]);
		}
	}
	return node;
};
/**
#4 Manipulação de Árvore DOM
A função '{__DOM} cria uma estrutura de nós HTML seguindo as mesmas diretrizes da função '{__HTML} retornando o objeto informado.
A função possui os seguintes argumentos:
|Argumento|Tipo|Opcional|Descrição|
|'{html}|object|Não|Estrutura  nó|
|'{parent}|node|Sim|Define o nó pai a receber o nó definido no argumento '{html}|
O argumento '{html} possui os seguintes propriedades:
|Nome|Tipo|Opcional|Descrição|
|'{tag}|string/node|Não|Mesmo propósito do primeiro argumento da função '{__HTML}|
|'{attr}|object|Sim|Mesmo propósito do segundo argumento da função '{__HTML}|
|'{uri}|string|Sim|Mesmo propósito do terceiro argumento da função '{__HTML}|
|'{child}|array|Sim|Lista de objetos, com as mesmas propriedades do argumento '{html}, representando os nós filhos.|
**/
function __DOM(data, parent) {
	if (!__Type(data).object) return null;
	/*-- elemento principal --*/
	data.tag = __HTML(data.tag, data.attr, data.uri);
	if (data.tag === null) return null;
	/*-- apensando filhos do elemento --*/
	if (Array.isArray(data.child)) data.child.forEach(function(v,i,a) {
		if (__DOM(v) !== null)
			__HTML(data.tag, {appendChild: [v.tag]});
	});
	/*-- apensando ao pai --*/
	__HTML(parent, {appendChild: [data.tag]})
	return data;
}