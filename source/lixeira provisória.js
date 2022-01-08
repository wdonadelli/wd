/*----------------------------------------------------------------------------*/
	function data_wdFile(e) { /* Análise de arquivos: data-wd-file=fs{}ft{}fc{}nf{}ms{}call{} */
	/*analisa as informações do arquivo
		nf: number of files      (quantidade máxima de arquivos)
		ms: maximum size         (tamanho total de arquivos)
		fs: file size            (tamanho individual do arquivo)
		ft: file type            (tipo do arquivo aceito)
		fc: forbidden characters (caracteres não permitidos)
		call: função a ser chamada
	*/
		if (!("wdFile" in e.dataset) || wd_html_form_type(e) !== "file") return;

		let data  = wd_html_dataset_value(e, "wdFile")[0];
		let info  = {error: null, file: null, value: null, parameter: null};
		let files = e.files;

		if ("nf" in data && files.length > wd_integer(data.nf, true)) {
			info.error     = "nf";
			info.value     = files.length;
			info.file      = "";
			info.parameter = wd_integer(data.nf, true);
		} else {
			let ms = 0;
			let fc = "fc" in data ? new RegExp("("+data.fc+")", "g") : null;

			for (let i = 0; i < files.length; i++) {
				ms += files[i].size;
				if ("ms" in data && ms > wd_integer(data.ms, true)) {
					info.error     = "ms";
					info.value     = wd_bytes(ms);
					info.parameter = wd_bytes(wd_integer(data.ms, true));
				} else if ("fs" in data && files[i].size > wd_integer(data.fs, true)) {
					info.error     = "fs";
					info.value     = wd_bytes(files[i].size);
					info.parameter = wd_bytes(wd_integer(data.fs, true));
				} else if ("ft" in data && data.ft.split(" ").indexOf(files[i].type) < 0) {
					info.error     = "ft";
					info.value     = files[i].type;
					info.parameter = data.ft;
				} else if (fc !== null && fc.test(files[i].name)) {
					info.error     = "fc";
					info.value     = files[i].name.replace(fc, "<b style=\"color: #FF0000;\">$1</b>");
					info.parameter = data.fc;
				}
				if (info.error !== null) {
					break;
				}
			}
		}

		if (info.error !== null) {
			e.value = null;
			WD(e).css({add: "js-wd-mask-error"});
			if (WD(window[data["call"]]).type === "function") window[data["call"]](info);
			return;
		}
		return WD(e).css({del: "js-wd-mask-error"});
	};

