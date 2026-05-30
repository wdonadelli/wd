/**
#3 Arquivo
O objeto '{__FILE} define um conjunto de ferramentas envolvendo arquivos.
**/
const __FILE = {
	/**. '{string RFC5987(string name)}: Retorna o valor de nome em formato a{RFC5987}@href{https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#encoding_for_content-disposition_and_link_headers}.**/
	RFC5987: function(name) {
		return String(name).normalize("NFC").split("").map(function(v,i,a) {
			const code = (/['()*]/).test(v) ? `%${v.charCodeAt(0).toString(16).toUpperCase()}` : encodeURIComponent(v);
			return (/[|`^]/).test(v) ? v : code;
		}).join("");
	},
	/**. '{object toHeaders(object file)}: Retorna um cabeçalho contendo os dados do arquivo ('{File}/'{Blob}) se existentes:
	|Cabeçalho|Popriedade|Valor|
	|content-type|type|a{MIME Type}@href{https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types/Common_types}|
	|content-length|size|Tamanho do arquivo|
	|last-modified|lastModified|Última modificação|
	|content-disposition|name|Nome do arquivo guardado no atributo '{filename}|**/
	toHeaders: function(file) {
		const data = new __DataSet();
		if (file.type)         data.append("content-type",   file.type);
		if (file.size)         data.append("content-length", file.size);
		if (file.lastModified) data.append("last-modified",  file.lastModified);
		if (file.name) {
			const RFC5987 = this.RFC5987(file.name);
			data.append("content-disposition", `attachment; filename="${file.name}"; filename*=UTF-8''${RFC5987}`);
		}
		return data.toHeaders;
	},
	/**. '{object fromHeaders(any headers)}: Faz o inverso do método '{toHeaders}.**/
	fromHeaders: function(headers) {
		const data = new __DataSet(headers);
		const info = {};
		const re   = /filename\=\"(.+)\";/;
		data.forEach(function(v,i,a) {
			switch(i.toLowerCase()) {
				case "content-disposition": info.name         = String(v).match(re)[1];  break;
				case "content-type":        info.type         = String(v).split(";")[0]; break;
				case "content-length":      info.size         = Number(v); break;
				case "last-modified":       info.lastModified = Number(v); break;
			}
		});
		return info;
	},
	/**. '{object blob(string content, string type)}: Retorna um objeto do tipo '{Blob} com o conteúdo e tipo informado.**/
	blob: function(content, type) {
		return new Blob([content], {type: typeof type === "string" ? type.trim() : "application/octet-stream"});
	},
	/**. '{node text(string text, string name, string type)}: Retorna nó de texto com o conteúdo.**/
	text: function(text, name, type) {
		return __DOM({tag: "pre", child: [], attr: {
			textContent: `-- ${name} --\n${text}`, style: {overflow: "auto"}
		}}).tag;
	},
	/**. '{node link(string url, string name, string type)}: Retorna um '{link} de download.**/
	link: function(url, name, type) {
		return __DOM({tag: "a", child: [], attr: {
			href: url, textContent: name, download: name, type: type
		}}).tag;
	},
	/**. '{node link(string url, string name, string type)}: Um '{frame} para arquivo.**/
	frame: function(url, name, type) {
		const link = this.link(url, name, type);
		const main = type.split("/")[0];
		if (main === "audio")
			return __DOM({tag: "audio", attr: {src: url, controls: true}, child: [link]}).tag;
		if (main === "video")
			return __DOM({tag: "video", attr: {src: url, controls: true}, child: [link]}).tag;
		if (main === "image")
			return __DOM({tag: "img", attr: {src: url, alt: `${type}: ${name}`}, child: [link]}).tag;
		if (main === "text" || main === "application")
			return __DOM({tag: "iframe", attr: {src: url}, child: [link]}).tag;
		return __DOM({tag: "object", attr: {data: url, type: type}, child: [link]}).tag;
	},
};