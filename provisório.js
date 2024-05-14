


		/*-- mover o elemento de lugar --*/
		if (data.type === "moveeeeeeeeee") {
			/* definir o alvo: o elemento ou a âncora */
			const node   = __Node(e);
			const check  = __Type(query);
			const myself = !check.node || check.value.length < 1 || check.value[0] === e;
			const move   = myself ? e : check.value[0];

			/* configurar o alvo e obter dados iniciais */
			if (event.type === "mousedown") {
				window.getSelection().removeAllRanges();
				const aim = __Node(move);
				const css = aim.styles;
				const box = aim.position;
				if (css.position !== "fixed") {
					if (css.position === "static") move.style.position = "relative";
					const values = __Node(e.parentElement).position;
					for (let i in box) box[i] = box[i] - values[i];
				}
				box.clientX = event.clientX;
				box.clientY = event.clientY;
				let attr    = [];
				for (let i in box) attr.push(i+"{"+box[i]+"}");

				e.dataset.wdMoveActionMove = attr.join("");
				setWdMovePosition(move, box, ["width", "height"], event);
				return;
			}

			/* limpar configuração */
			if (event.type === "mouseup" || event.type === "mouseout") {
				if ("wdMoveActionMove" in e.dataset) delete e.dataset.wdMoveActionMove;
				return;
			}

			/* mover o alvo */
			if (event.type === "mousemove") {
				window.getSelection().removeAllRanges();

				if (event.buttons !== 1 || !("wdMoveActionMove" in e.dataset)) return;
				const box  = __String(e.dataset.wdMoveActionMove).wdNotation[0];
				const dx   = event.clientX - box.clientX;
				const dy   = event.clientY - box.clientY;
				box.left   += dx;
				box.right  -= dx;
				box.top    += dy;
				box.bottom -= dy;
				setWdMovePosition(move, box, ["width", "height"]);
				return;
			}
			return;
		}





















		if (data.type === "dragaaaa") {
			const node   = __Node(e);
			const check  = __Type(query);
			const myself = !check.node || check.value.length < 1 || check.value[0] === e;
			const drag   = myself ? e : check.value[0];

			if (event.type === "mouseover") {console.log("entrou");
				if (drag.dataset.wdMoveRun === "drag") return;
				if ("wdMove" in drag.dataset)
					drag.dataset.wdMoveTemp = drag.dataset.wdMove;
				drag.draggable = true;
				drag.dataset.wdMove = "type{draggable}";
				return;
			}

			if (event.type === "mouseout") {console.log("saiu");
				if (drag.dataset.wdMoveRun === "drag") return;
				drag.draggable = false;
				delete drag.dataset.wdMove;
				if ("wdMoveTemp" in drag.dataset) {
					drag.dataset.wdMove = drag.dataset.wdMoveTemp;
					delete drag.dataset.wdMoveTemp;
				}
				return;
			}
			return;
		}

		if (data.type === "draggable") {
			const node = __Node(e);

			if (event.type === "dragstart") {
				event.dataTransfer.effectAllwed = "uninitialized";
				const css = node.styles;
				const box = node.position;
				if (css.position !== "fixed") {
					const parent = __Node(e.parentElement);
					const values = parent.position;
					if (css.position === "static") e.style.position = "relative";
					for (let i in box) box[i] = box[i] - values[i];
				}
				box.clientX  = event.clientX;
				box.clientY  = event.clientY;
				box.position = css.position;
				let attr = [];
				for (let i in box) attr.push(i+"{"+box[i]+"}");
				event.dataTransfer.setData("text", attr.join(""));
				e.dataset.wdMoveRun = "drag";
				return;
			}

			if (event.type === "dragend") {
				event.dataTransfer.effectAllwed = "uninitialized";
				const box    = __String(event.dataTransfer.getData("text")).wdNotation[0];
				const dx     = event.clientX - box.clientX;
				const dy     = event.clientY - box.clientY;
				const width  = window.innerWidth;
				const height = window.innerHeight;
				e.style.left   = String(100*(box.left   + dx)/width)+"vw";
				e.style.right  = String(100*(box.right  - dx)/width)+"vw";
				e.style.top    = String(100*(box.top    + dy)/height)+"vh";
				e.style.bottom = String(100*(box.bottom - dy)/height)+"vh";
				e.style.width  = "auto";
				e.style.height = "auto";
				e.style.transform = "none";

				delete e.dataset.wdMoveRun;
				delete e.dataset.wdMove;
				if ("wdMoveTemp" in e.dataset) {
					e.dataset.wdMove = e.dataset.wdMoveTemp;
					delete e.dataset.wdMoveTemp;
				}
				e.draggable = false;
				return;
			}
			return;
		}










		if (data.type === "size") {
			const node = __Node(e);
			const box  = node.position;
			const gap  = 3;
			const w    = box.width;
			const h    = box.height;
			const x    = event.offsetX;
			const y    = event.offsetY;
			const dx   = event.movementX;
			const dy   = event.movementY;

			if (event.type === "mousemove") {
				let   cursor = null;
				if (x >= (w-gap) && y >= (h-gap))
					cursor = "se-resize";
				else if (x >= (w-gap) || y >= (h-gap))
					cursor = x >= (w-gap) ? "col-resize" : "row-resize";

				e.style.cursor = cursor;
				if (event.buttons === 1) {
					if (cursor === "se-resize" || cursor === "col-resize")
						e.style.width  = String(x+dx+(dx > 0 ? gap : -gap))+"px";
					if (cursor === "se-resize" || cursor === "row-resize")
						e.style.height = String(x+dx+(dy > 0 ? gap : -gap))+"px";
				}


				console.log(event.buttons);




				return;
			}

			if (event.type === "drag") {
				e.style.width  = String(dx)+"px";
				e.style.height = String(dx)+"px";
				return
			}

		}

		if (data.type === "menu" && event.type === "click") {
			if (e.dataset.wdAuxMove === "menuOpen") return;

			const nav = document.createElement("NAV");
			nav.style.position = "fixed";
			nav.style.backgroundColor = "white";
			nav.style.left = String(100 * event.clientX / window.innerWidth)+"vw";
			nav.style.top  = String(100 * event.clientY / window.innerHeight)+"vh";
			const forget = ["type", "$", "$$"];

			e.dataset.wdAuxMove = "menuOpen";

			for (let i in data) {
				if (forget.indexOf(i) < 0 && __Type(data[i]).function) {
					const span = document.createElement("SPAN");
					span.textContent = i;
					span.onclick = function() {
						data[i](e);
						nav.remove();
						delete e.dataset.wdAuxMove;
						return;
					};
					nav.appendChild(span);
				}
			}
			document.body.appendChild(nav);
			return;
		}

