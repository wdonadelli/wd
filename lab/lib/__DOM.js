/**
#3 Criar Árvore DOM
O objeto '{__DOM} cria uma estrutura de elementos HTML a partir de objetos retornando-a:
|Argumento|Tipo|Descrição|
|html|object|Estrutura de cada nó|
|parent|node|Define o elemento pai do objeto principal (opcional)|
As propriedades de cada objeto são:
|Nome|Tipo|Descrição|
|tag|string/node|Mesmo propósito do argumento da função '{__HTML}|
|attr|object|Mesmo propósito do argumento da função '{__HTML}|
|uri|string|Mesmo propósito do argumento da função '{__HTML}|
|child|array|Lista de objetos, com as mesmas propriedades, representando os elementos filhos.|
**/
function __DOM(html, parent) {
	/*-- contruindo o nó principal --*/
	const test = {html: new __Type(html), parent: new __Type(parent)};
	const data = test.html.object ? html : {};
	data.tag   = __HTML(data.tag, data.attr, data.uri);
	/*-- adicionando filhos --*/
	if (data.tag !== null && Array.isArray(data.child)) {
		for (let i = 0; i < data.child.length; i++)
			__DOM(data.child[i], data.tag);
	}
	/*-- adicionando elemento ao pai, se for um nó --*/
	if (data.tag !== null && test.parent.node && test.parent.value.length > 0)
		test.parent.value[0].appendChild(data.tag)
	return data;
}