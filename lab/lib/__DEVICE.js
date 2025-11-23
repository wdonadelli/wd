/**
#3 Tipos de Dispositivo
O objeto '{__DEVICE} controla as alterações da tela atribuida a um tipo de dispositivo.
**/
const __DEVICE = {
	/**. '{string log}: Registra o tipo do dispositivo a partir do tamanho da tela atual.**/
	log: null,
	/**. '{object devices}: Registra a lista de nomes dos dispositivos e suas características.**/
	devices: {
		phone:   {min: 0,   max: 600},
		tablet:  {min: 600, max: 768},
		desktop: {min: 768, max: Infinity},
	},
	/**. '{integer width}: Retorna o tamanho da tela atual.**/
	get width() {return window.innerWidth;},
	/**. '{string device}: Retorna o nome do dispositivo vigente.**/
	get device() {
		const width = this.width;
		for (let name in this.devices) {
			if (width >= this.devices[name].min && width < this.devices[name].max)
				return name;
		}
	},
	/**. '{boolean mobile}: Informa se dispositivo não é do tamanho desktop.**/
	get mobile() {return this.device !== "desktop";},
	/**. '{boolean change}: Informa se o dispositivo foi alterado desde a última consulta.**/
	get changeDevice() {
		const device = this.device;
		if (this.log !== device) {
			this.log = device;
			return true;
		}
		return false;
	},
	/**. '{void handleEvent(object ev)}: Disparador que provoca o evento '{wddataset} para os nós que contêm o atributo '{data-wd-device} a cada mudança de dispositivo (vincular ao evento '{rezise} de '{window}).**/
	handleEvent: function(ev) {
		if (this.changeDevice) {
			const query = document.querySelectorAll("[data-wd-device]");
			const event = new CustomEvent("wddataset", {detail: "wdDevice", bubbles: false});
			for (let i = 0; i < query.length; i++)
				query[i].dispatchEvent(event);
		}
		return;
	}
};