/**
#3 Dispositivos e Design Responsivo
	O objeto '{__DEVICE} controla os nomes dos atributos CSS aplicados ao elemento (conteúdo do atributo HTML '{class}) conforme a tela do dispositivo (efeito responsivo fora da folha de estilos) a partir da definição dos seguintes tipos (tamanhos):
	|Dispositivo|Descrição|Comprimento da Tela (px)|
	|'{phone}|Telas pequenas|var{0 <= x < 600}|
	|'{tablet}|Telas Medianas|var{600 <= x < 768}|
	|'{desktop}|Telas maiores|var{768 <= x}|
	|'{mobile}|Telas diferentes de '{desktop}|var{0 <= x < 768px}|
	Os nomes dos atributos CSS atribuídos a cada dispositivo serão adicionados ou removidos da seguinte forma:
	|Tela/Dispositivo|'{phone}|'{tablet}|'{mobile}|'{desktop}|
	|'{phone}|Adiciona|Remove|Adiciona|Remove|
	|'{tablet}|Remove|Adiciona|Adiciona|Remove|
	|'{desktop}|Remove|Remove|Remove|Adiciona|
	Os nomes dos atributos CSS devem ser strings contendo as classes separadas por espaço.
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
	/**. '{void attach(node node, object data)}: Define atributos CSS ao nó conforme os tipos de dispositivos definidos em '{data}**/
	attach: function(node, data) {
		data = __Type(data).object ? data : {};
		const rules = this.rules;
		/*-- removendo css --*/
		for (let i in rules) {
			if (rules[i] === 0 && i in data)
				__HTML(node, {classList: {remove: data[i]}});
		}
		/*-- adcionando css --*/
		for (let i in rules) {
			if (rules[i] === 1 && i in data) __HTML(node, {classList: {add: data[i]}});
		}
		return;
	},
};