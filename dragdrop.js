


		//move: 1F4E5, copy: 1F4DD, link: 1F517, file, 1F5BA
			//FIXME especificar cada tipo
			if (data.effect === "copys" || data.effect === "moves") {
				__ICON.background(this.fake, data.effect === "copy" ? "1F4DD" : "1F4E5");
				this.appendFake(ev);
			}

			if (data.effect === "copy") {
				const clone = drag.cloneNode(true);
				clone.id = __ID.value;
				//drop.insertBefore(clone, this.fake);
				drop.appendChild(clone);
			}
			else if (data.effect === "move") {
				//drop.insertBefore(drag, this.fake);
				drop.appendChild(drag);
			}
			else
				console.log(data.effect)