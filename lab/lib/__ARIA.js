/**
#3 Acessibilidade
O objeto '{__ARIA} agrupa ações de acessibilidade.
**/
const __ARIA = {
	/**. '{node getNodeBy(node node, string attr)}: Retorna o nó filho, quando único, referenciado pelo argumento '{attr}: aria-labelledby, aria-describedby, aria-details...**/
	getNodeBy: function(node, attr) {
		const id    = node.hasAttribute(attr) ? node.getAttribute(attr) : null;
		const mult  = id === null ? true : id.split(" ").length > 0;
		const find  = mult ? null : document.getElementById(id);
		const child = find === null ? false : node.contains(find);
		return child ? find : null;
	},
	//FIXME substituir o método acima por este
	/**. '{array getNodesBy(node node, string attr)}: Retorna os nós referenciados pelos indentificadores constantes no atributo no argumento '{attr} (list, aria-labelledby, aria-describedby, aria-details...).**/
	getNodesBy: function(node, attr) {
		const list  = node.hasAttribute(attr) ? node.getAttribute(attr).trim() : "";
		const query = "#"+list.replace(/\s+/g, ", #");
		try {return document.querySelectorAll(query);}
		catch(e) {return [];}
	},
};