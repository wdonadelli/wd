/**
#3 Dispositivos e Design Responsivo
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
	/**. '{object rules}: Retorna as regras para adicionar ou remover propriedades de acordo com o tipo de dispositivo (0 elimina e 1 adiciona)**/
	get rules() {
		return {
			desktop: {phone: 0, tablet: 0, mobile: 0, desktop: 1},
			tablet:  {phone: 0, tablet: 1, mobile: 1, desktop: 0},
			phone:   {phone: 1, tablet: 0, mobile: 1, desktop: 0},
		}[this.device];
	},
	/**. '{boolean change}: Informa se o dispositivo foi alterado desde a última consulta.**/
	get changeDevice() {
		const device = this.device;
		if (this.log !== device) {
			this.log = device;
			return true;
		}
		return false;
	},
	/**. '{void css(node node, object data)}: Define atributos CSS ao nó conforme o tipo de dispositivo definidos em '{data}:
	- As propriedades de '{data} correspondem ao tipo de dispositivo presente em '{rules};
	- Os valores das propriedades devem ser strings contendo as classes separadas por espaço; e
	- Não há propriedade obrigatória.**/
	css: function(node, data) {
		data = __Type(data).object ? data : {};
		const rules = this.rules;
		/*-- removendo css --*/
		for (let i in rules) {
			if (rules[i] === 0 && i in data) __HTML(node, {classList: {remove: data[i]}});
		}
		/*-- adcionando css --*/
		for (let i in rules) {
			if (rules[i] === 1 && i in data) __HTML(node, {classList: {add: data[i]}});
		}
		return;
	},
};