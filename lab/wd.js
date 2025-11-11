/* wd5.js https://github.com/wdonadelli/wd
 *
 * Copyright 2023-2024 Willian Donadelli <wdonadelli@github.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * SPDX-License-Identifier: MIT
 */

"use strict";

const wd = (function() {
	/**#1 Biblioteca JavaScript
	#2 Documentação para Manutenção
	#0 Menu
	#3 Constantes
	|Nome|Tipo|Descrição|
	|__VERSION|string|Registra a versão da biblioteca|
	|__UNDERMAINTENANCE|boolean|Se verdadeiro, libera em WD métodos em teste e imprime cascata de disparadores|
	|__CSS|string|Folha de estilos básica da biblioteca|**/
	const __VERSION = "WD JS v5.0.0";
	const __UNDERMAINTENANCE = true;
	const __CSS = `
		/*-- Variáveis -----------------------------------------------------------*/
		:root {
			--var-js-wd-z-index-0: 9999;
			--var-js-wd-z-index-1: 9998;
			--var-js-wd-z-index-2: 9997;
			--var-js-wd-z-index-3: 9996;
			--var-js-wd-move-edge: 15px;
			--var-js-wd-font-type: Verdana, sans-serif, monospace;
			--var-js-wd-font-size: 12px;
		}

		/*-- Animações -----------------------------------------------------------*/
		@keyframes js-wd-animation-emerge {
			from {opacity: 0;} to {opacity: 1;}
		}
		@keyframes js-wd-animation-fade {
			from {opacity: 1;} to {opacity: 0;}
		}
		@keyframes js-wd-animation-emerge-modal {
			from {background-color: rgba(50,50,50,0);} to {background-color: rgba(50,50,50,0.7);}
		}
		@keyframes js-wd-animation-expand {
			from {transform: scale(0);} to {transform: scale(1);}
		}
		@keyframes js-wd-animation-shrink {
			from {transform: scale(1);} to {transform: scale(0);}
		}
		/*-- Geral ---------------------------------------------------------------*/
		* {box-sizing: border-box !important;}
		/*-- Inert ---------------------------------------------------------------*/
		${"inert" in document.body ? "" : "[inert] {display: none !important;}"}
		/*-- Freeze --------------------------------------------------------------*/
		.js-wd-freeze {overflow: hidden !important;}
		/*-- Tip/Validity --------------------------------------------------------*/
		.css-wd-form-error, .css-wd-tooltip {
			display: inline-block;
			padding: 0.25em;
			margin: 0.25em 0;
			font-size: var(--var-js-wd-font-size);
			font-family: var(--var-js-wd-font-type);
			border: thin solid;
			border-radius: 0.2em;
		}
		.css-wd-tooltip {
			display: none;
			position: absolute;
			top: 100%;
			left: 0;
		}
		*:hover > .css-wd-tooltip {
			display: inline-block;
			animation: js-wd-animation-emerge 3s ease;
		}
		/*-- Tip -----------------------------------------------------------------*/














		/*-- WINDOW --------------------------------------------------------------*/
		/*-- FRAME --*/
		[data-js-wd-window="frame"] {
			position: fixed !important;
			bottom: 0 !important;
			left:   0 !important;
			right:  0 !important;
			display: flex !important;
			flex-direction: column !important;
			margin:  0.5em !important;
			padding: 0 !important;
			max-height: calc(100vh - 1em) !important;
			overflow-y: auto !important;
			z-index: var(--var-js-wd-z-index-3) !important;
			background: tranparent !important;
		}
		@media screen and (min-width: 768px) {
			[data-js-wd-window="frame"] {
				right: initial !important;
				width: 25vw !important;
			}
		}
		[data-js-wd-window="frame"] > * ~ * {
			margin-top: 0.5em !important;
		}
		/*-- FLOAT --*/
		[data-js-wd-window="float"] {
			position: fixed !important;
			display: block !important;
			margin:  0 !important;
			padding: 0 !important;
			overflow-y: auto !important;
			z-index:  var(--var-js-wd-z-index-2) !important;
			background: transparent !important;
		}
		/*-- MODAL --*/
		[data-js-wd-window="modal"] {
			position: fixed !important;
			top:     0 !important;
			left:    0 !important;
			right:   0 !important;
			bottom:  0 !important;
			margin:  0 !important;
			padding: 0.5em !important;
			overflow-y: auto !important;
			z-index: var(--var-js-wd-z-index-1);
			background: rgb(50,50,50) !important;
			background: rgba(50,50,50,0.5) !important;
			display:         flex !important;
			flex-direction:  row !important;
			justify-content: center !important;
			align-items:     center !important;
		}
		/*-- PROGRESS ------------------------------------------------------------*/
		[data-js-wd-window="progress"] {
			position: fixed !important;
			top:   0 !important;
			right: 0 !important;
			display: block !important;
			margin: 0 !important;
			padding: 0 1em 0 0.5em !important;
			overflow: hidden !important;
			z-index: var(--var-js-wd-z-index-0) !important;
			font-size: var(--var-js-wd-font-size);
			font-family: var(--var-js-wd-font-type);
		}
		/*-- SIGNAL --------------------------------------------------------------*/
		.css-wd-alert, .css-wd-dialog {
			font-size: 14px;
			font-family: var(--var-js-wd-font-type);
			border: thin solid black;
			border-radius: 0.25em;
			position: relative;
		}
		.css-wd-alert > *, .css-wd-dialog > * {
			margin: 0;
			padding: 0.5em;
		}
		.css-wd-alert > h1, .css-wd-dialog > h1 {font-size: 1.0em; padding-right: 2em;}
		.css-wd-alert > p  {font-size: 0.9em;}
		.css-wd-quit {
			font-size: 1em;
			position: absolute;
			top: 0.5em;
			right: 1em;
			margin: 0;
			padding: 0;
			background: none;
			border: 0;
		}
		/*-- MENU ----------------------------------------------------------------*/
		.css-wd-menu {
			padding: 0.3em;
			margin: 0;
			color: black;
			border-radius: 0.2em;
			border: thin solid black;
			font-size: var(--var-js-wd-font-size);
			font-family: var(--var-js-wd-font-type);
		}
		.css-wd-menu menu {
			list-style: none;
			padding: 0;
			margin: 0
		}
		.css-wd-menu li {
			padding: 0;
			margin: 0.3em 0 0 0;
		}
		.css-wd-menu > *:first-child {
			text-align: center;
			font-weight: bold;
		}
		.css-wd-menu button {
			text-align: left;
			font-weight: normal;
			cursor: pointer;
		}
		.css-wd-menu > *:first-child, .css-wd-menu button {
			position: relative;
			display: block;
			width: 100%;
			margin: 0;
			padding: 0.25em 2em;
			font-size: inherit;
			font-family: inherit;
			border-radius: 0.2em;
		}
		.css-wd-menu .css-wd-menu-open:after {
			content: "\\276F";
			position: absolute;
			right: 0;
			margin: 0 0.5em 0 0;
			text-align: center;
		}
		.css-wd-menu .css-wd-menu-back:before {
			content: "\\276E";
			position: absolute;
			left: 0;
			margin: 0 0 0 0.5em;
			text-align: center;
		}
		/*-- TAB -----------------------------------------------------------------*/
		.css-wd-tab {
			display: flex;
			align-items: stretch;
			justify-content: center;
			padding: 0;
		}
		.css-wd-tab [role=tablist] {
			display: flex;
			align-items: stretch;
  		justify-content: start;
  		margin: 0;
  		font-size: var(--var-js-wd-font-size);
			font-family: var(--var-js-wd-font-type);
		}
		.css-wd-tab [role=tablist][aria-orientation=horizontal] {
			flex: 1 1 auto;
			flex-flow: row wrap;
		}
		.css-wd-tab [role=tablist][aria-orientation=vertical]   {
			flex: 0 1 25%;
			flex-flow: column nowrap;
		}
		.css-wd-tab [role=tab] {
			margin: 3px;
			flex: 1 1 auto;
		}
		.css-wd-tab  [role=tab][aria-selected=true] {
			outline-width: thin;
			outline-style: solid;
		}
		.css-wd-tab [role=tabpanel] {
			flex: 1 1 auto;1F82C
			margin: 0;
		}
		.css-wd-tab [role=tablist][aria-orientation=vertical] ~ [role=tabpanel] {
			flex: 1 1 75%;
		}



		/*-- ICON ----------------------------------------------------------------*/
		.css-wd-icon-circle, .css-wd-icon-square {
				font-family: monospace;
				height:  1em;
				width:   1em;
				padding: 0;
				border:  none;
				margin:  auto;
			}
			.css-wd-icon-circle {border-radius: 0.5em;}
		/*-- MOVE/RESIZE ---------------------------------------------------------*/
		[data-js-wd-role=move] {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 999;
			border: 2px dashed red;
			font-size: var(--var-js-wd-font-size);
			font-family: var(--var-js-wd-font-type);
		}
		[data-js-wd-role=move] > * {
			position: absolute;
			border: 0;
			background: transparent;
			font-family: inherit;
			font-size: inherit;
		}
		/*-- resize vertical --*/
		.js-wd-move-n, .js-wd-move-s {
			height: var(--var-js-wd-move-edge);
			left:   calc(var(--var-js-wd-move-edge) / 2);
			right:  calc(var(--var-js-wd-move-edge) / 2);
		}
    .js-wd-move-n {
    	top:    calc(-1 * var(--var-js-wd-move-edge) / 2);
    	cursor: n-resize;
    }
    .js-wd-move-s {
    	bottom: calc(-1 * var(--var-js-wd-move-edge) / 2);
    	cursor: s-resize;
    }
    /*-- resize horizontal --*/
    .js-wd-move-w, .js-wd-move-e {
			width:  var(--var-js-wd-move-edge);
			top:    calc(var(--var-js-wd-move-edge) / 2);
			bottom: calc(var(--var-js-wd-move-edge) / 2);
		}
    .js-wd-move-w {
    	left:   calc(-1 * var(--var-js-wd-move-edge) / 2);
    	cursor: w-resize;
    }
    .js-wd-move-e {
    	right:  calc(-1 * var(--var-js-wd-move-edge) / 2);
    	cursor: e-resize;
    }
    /*-- resize bidimensional --*/
    .js-wd-move-nw, .js-wd-move-ne, .js-wd-move-sw, .js-wd-move-se {
    	width:  var(--var-js-wd-move-edge);
			height: var(--var-js-wd-move-edge);
			border: 2px solid red;
			background: white;
			/*border-radius: calc(var(--var-js-wd-move-edge) / 2);*/
    }
    .js-wd-move-nw {
			left:   calc(-1 * var(--var-js-wd-move-edge) / 2);
			top:    calc(-1 * var(--var-js-wd-move-edge) / 2);
			cursor: nw-resize;
    }
    .js-wd-move-ne {
			right:  calc(-1 * var(--var-js-wd-move-edge) / 2);
			top:    calc(-1 * var(--var-js-wd-move-edge) / 2);
			cursor: ne-resize;
    }
    .js-wd-move-sw {
			left:   calc(-1 * var(--var-js-wd-move-edge) / 2);
			bottom: calc(-1 * var(--var-js-wd-move-edge) / 2);
			cursor: sw-resize;
    }
    .js-wd-move-se {
			right:   calc(-1 * var(--var-js-wd-move-edge) / 2);
			bottom:  calc(-1 * var(--var-js-wd-move-edge) / 2);
			cursor: se-resize;
    }
    .js-wd-move-c {
			left:   calc(var(--var-js-wd-move-edge) / 2);
			top:    calc(var(--var-js-wd-move-edge) / 2);
			right:  calc(var(--var-js-wd-move-edge) / 2);
			bottom: calc(var(--var-js-wd-move-edge) / 2);
			cursor: move;
			color: black;
			background: rgba(255,255,255,0.7);
    }
    /*-- DRAG/DROP -----------------------------------------------------------*/
    [draggable]:hover  {cursor: grab;}
    [draggable]:active {cursor: grabbing;}
    .css-wd-drop-copy  {outline: 2px dashed  green;}
    .css-wd-drop-move  {outline: 2px dashed  red;}
    .css-wd-drop-link  {outline: 2px dashed  blue;}
    .js-wd-fake {
			border: 1px solid black;
			border-radius: 1em;
			background-color: yellow;
			width: auto;
			min-width: 3em;
			height: auto;
			min-height: 2em;
			padding: 0 1em;
			text-align: center;
		}
		.js-wd-fake:after {content: "\\2690";}

















		/*-- Signal: box --*/
		[data-js-wd-signal] {
			position: relative !important;
			display: flex !important;
			flex-direction: column !important;
			padding: 0 !important;
			margin: 0.25em 3px !important;
			box-shadow: 2px 2px 2px rgba(0,0,0,0.5) !important;
			animation: js-wd-animation-expand 0.5s ease !important;
			font-size: 14px !important;
			font-family: Tahoma, Verdana, sans-serif !important;
			line-height: 1.2 !important;
			border-radius: 0.3em !important;
			background-repeat: no-repeat !important;
			background-position: center !important;
			background-size: cover !important;
			background-origin: content-box !important;
		}

		[data-js-wd-signal="info"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(140, 180, 255) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(-15)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\24d8</text></svg>") !important;
		}
		[data-js-wd-signal="ok"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(160, 250, 160) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(0)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\2714</text></svg>") !important;
		}
		[data-js-wd-signal="warn"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(255, 255, 150) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(-15)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\26A0</text></svg>") !important;
		}
		[data-js-wd-signal="error"] {
			color: rgb(50, 50, 50) !important;
			background-color: rgb(255, 200, 200) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(0)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\1F6AB</text></svg>") !important;
		}
		[data-js-wd-signal="dialog"] {
			margin: 0 !important;
			max-width: 95vw !important;
			min-width: 25vw !important;
			color: rgb(50, 50, 50) !important;
			background-color: rgb(200,220,220) !important;
			background-image: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(-15)' opacity='0.1' height='1em' width='2em' ><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-height='1.2' font-size='1em'>\\2BD1</text></svg>") !important;
		}

		@media screen and (min-width: 768px) {
			[data-js-wd-signal="dialog"] {max-width: 75vw !important;}
		}

		.js-wd-signal-head {
			padding: 0.5em 2em 0.5em 0.5em !important;
			border-bottom: thin solid !important;
			font-weight: bold !important;
		}
		.js-wd-signal-body {
			padding: 0.5em !important;
			white-space: pre-wrap !important;
		}
		.js-wd-signal-node {
			padding: 0 0.5em !important;
			display: flex !important;
			flex-direction: column !important;
		}
		.js-wd-signal-fire {
			display: flex !important;
			flex-direction: column !important;
			padding: 0.5em !important;
		}
		@media screen and (min-width: 768containspx) {
			.js-wd-signal-fire {
				flex-direction: row !important;
				justify-content: space-evenly !important;
				align-items: center !important;
			}
		}
		.js-wd-signal-kill {
			position: absolute !important;
			top: 0 !important;
			right: 0 !important;
			margin:  0.4em !important;
			height: 1em !important;
			width: 1em !important;
			border-radius: 0.5em !important;
			line-height: calc(5 / 6) !important;
			font-size: 1em !important;
			text-align: center !important;
			cursor: pointer !important;
			z-index: 10 !important;
		}
    .js-wd-signal-kill:focus, .js-wd-signal-kill:hover {outline: 1px solid !important;}



		/*-- dataset -------------------------------------------------------------*/
		[data-wd-grid] [aria-sort] {cursor: pointer !important;}
		[data-wd-grid] [aria-sort]:before {content: "\\2195 " !important;;}
		[data-wd-grid] [aria-sort="descending"]:before {content: "\\2191 " !important;}
		[data-wd-grid] [aria-sort="ascending"]:before  {content: "\\2193 " !important;}

		[data-wd-send], [data-wd-set], [data-wd-edit], [data-wd-shared] {
			cursor: pointer !important;
		}

		/*-- data-wd-float --------------------------------------------------------*/
		[data-wd-float] {cursor: context-menu !important;}


		[data-wd-repeat] > *, [data-wd-load] > * {visibility: hidden !important;}
		[data-wd-slide] > * {animation: js-wd-animation-emerge 1s, js-wd-animation-shrink-out 0.5s !important;}
		svg .js-wd-chart-hide {display: none !important;}
		@media screen and (min-width: 768px) {svg .js-wd-chart-hide {display: inline !important;}}
		wd-mark {background-color: rgba(154,205,50,0.7) !important; display: inline !important; border-radius: 0.2em !important; color: #000000 !important;}


		/*-- Códificação ---------------------------------------------------------*/

		/*-- containers --*/
		[data-wd-encoding="code"] {
			display: block !important;
			position: relative !important;
			width:  auto !important;
			height: auto !important;
			padding: 0 !important;
			border-radius: 0.2em !important;
			border: thin solid #000000 !important;
			overflow: hidden !important;
		}
		[data-wd-encoding="code"] > * {
			display: block !important;
			width:  auto !important;
			height: auto !important;
			margin:  0 !important;
			padding: 0.5em !important;
			overflow: hidden !important;
			font-family: monospace !important;
			font-size: 14px !important;
			text-decoration: none !important;
			font-style: normal !important;
			font-weight: normal !important;
			text-align: left !important;
			color: black !important;
			white-space: pre-wrap !important;
			letter-spacing: normal;
			word-break: break-all;
			border: none !important;
		}
		[data-wd-encoding="mask"] {
			position: relative !important;
			z-index: 0 !important;
			counter-reset: lines !important;
		}
		[data-wd-encoding="text"] {
			position: absolute !important;
			top: 0 !important;
			bottom: 0 !important;
			right: 0 !important;
			left: 0 !important;
			z-index: 1 !important;
			-webkit-text-fill-color: transparent !important;
			resize: none !important;
		}
		[data-wd-encoding="line"]        {position: relative !important;}
		/*-- linhas --*/
		[data-wd-encoding="line"]::after {content: " " !important;}
		[data-wd-encoding-lines] [data-wd-encoding="line"]::before {
			display: inline-block !important;
			position: absolute !important;contains
			top: 0;
			padding: 0 0.2em 0 0 !important;
			text-align: right !important;
			counter-increment: lines !important;
			content: counter(lines) !important;
		}
		[data-wd-encoding-lines="0"] [data-wd-encoding="line"]::before {
			left: -1em !important;
			width: 1em !important;
		}
		[data-wd-encoding-lines="0"] [data-wd-encoding="mask"],
		[data-wd-encoding-lines="0"] [data-wd-encoding="text"] {
			padding-left: 1em !important;
		}
		[data-wd-encoding-lines="1"] [data-wd-encoding="line"]::before {
			left: -2em !important;
			width: 2em !important;
		}
		[data-wd-encoding-lines="1"] [data-wd-encoding="mask"],
		[data-wd-encoding-lines="1"] [data-wd-encoding="text"] {
			padding-left: 2em !important;
		}
		[data-wd-encoding-lines="2"] [data-wd-encoding="line"]::before {
			left: -3em !important;
			width: 3em !important;
		}
		[data-wd-encoding-lines="2"] [data-wd-encoding="mask"],
		[data-wd-encoding-lines="2"] [data-wd-encoding="text"] {
			padding-left: 3em !important;
		}
		[data-wd-encoding-lines="3"] [datcontainsa-wd-encoding="line"]::before {
			left: -4em !important;
			width: 4em !important;
		}
		[data-wd-encoding-lines="3"] [data-wd-encoding="mask"],
		[data-wd-encoding-lines="3"] [data-wd-encoding="text"] {
			padding-left: 4em !important;
		}
		[data-wd-encoding-lines="4"] [data-wd-encoding="line"]::before {
			left: -5em !important;
			width: 5em !important;
		}
		[data-wd-encoding-lines="4"] [data-wd-encoding="mask"],
		[data-wd-encoding-lines="4"] [data-wd-encoding="text"] {
			padding-left: 5em !important;
		}
		/*-- cores --*/
		[data-wd-encoding="text"]         {color: white !important; background-color: transparent !important;}
		[data-wd-encoding="mask"]         {color: snow  !important; background-color: black !important;}
		[data-wd-encoding="line"]         {color: inherit !important;}
		[data-wd-encoding="line"]::before {color: WhiteSmoke !important;}
		[data-wd-encoding="comment"]      {color: silver !important; font-style: italic !important;}
		[data-wd-encoding="flag"]         {color: khaki !important; font-weight: bold !important;}
		[data-wd-encoding="doc"]          {color: MediumPurple !important; font-weight: bold !important;}
		[data-wd-encoding="tag"]          {color: DodgerBlue !important;}
		[data-wd-encoding="attr"]         {color: teal !important;}
		[data-wd-encoding="script"]       {color: aqua !important; font-style: italic !important;}
		[data-wd-encoding="value"]        {color: violet !important;}
		[data-wd-encoding="number"]       {color: violet !important;}
		[data-wd-encoding="string"]       {color: violet !important;}
		[data-wd-encoding="word"]         {color: DodgerBlue !important; font-weight: bold !important;}
		[data-wd-encoding="scope"]        {color: orange !important; font-weight: bold !important;}
		[data-wd-encoding="trash"]        {color: red !important; text-decoration: underline !important;}


		/*-- Importantes ---------------------------------------------------------*/
		/*FIXME o que é isso*/
		/*[data-js-wd-hide]:not([data-js-wd-show]) {
			display: none !important;
		}*/
		[data-js-wd-hide] {display: none !important;}

		[data-js-wd-cursor="move"],    [data-js-wd-cursor="move"]    * {cursor:     grab !important;}
		[data-js-wd-cursor="moving"],  [data-js-wd-cursor="moving"]  * {cursor:     move !important;}
		[data-js-wd-cursor="drag"],    [data-js-wd-cursor="drag"]    * {cursor:     grab !important;}
		[data-js-wd-cursor="draging"], [data-js-wd-cursor="draging"] * {cursor: grabbing !important;}


		[data-js-wd-area] {
			position: fixed !important;
			background-color: rgba(127,127,127,0.2) !important;
			z-index: 9999 !important;
		}
		[data-js-wd-area="vertical"] {
			top: 0 !important;
			bottom: 0 !important;
			height: 100vh !important;
			border-left:  thin dashed rgb(128, 128, 128) !important;
			border-right: thin dashed rgb(128, 128, 128) !important;
		}
		[data-js-wd-area="horizontal"] {
			left: 0 !important;
			right: 0 !important;
			width: 100vw !important;
			border-top:    thin dashed rgb(128, 128, 128) !important;
			border-bottom: thin dashed rgb(128, 128, 128) !important;
		}

		.js-wd-mark-text {
			background-color: lime !important;
			color: black !important;
		}
		`;
			//"*::backdrop {background-color: white;}",
			//TODO ver coloração https://developer.mozilla.org/pt-BR/docs/Web/CSS/background-color
			//TODO interessante https://developer.mozilla.org/en-US/docs/Web/CSS/::file-selector-button
/*============================================================================*/
	/**#3 Tipologia e Gestão de Dados
	#4 Identificadores
	''const object __ID''
	Cria identificadores para biblioteca.**/
	const __ID = {
		/**. '{integer init}: Controlador dos identificadores.**/
		init: Date.now(),
		/**. '{integer shift}: Define o incremento.**/
		get shift() {
			const list = new Uint16Array(1);
			window.crypto.getRandomValues(list);
			return list[0];
		},
		/**. '{string value}: Retorna um identificador.**/
		get value() {
			this.init += this.shift;
			const id   = `id${this.init.toString(16)}`;
			const find = document.getElementById(id);
			return find === null ? id : this.value;
		},
		/**. '{string id}: Define, se inexiste, e retorna o valor da propriedade '{id}.**/
		id: function(node) {
			node.id = node.id.trim() === "" ? this.value : node.id;
			return node.id;
		},
	};

/*----------------------------------------------------------------------------*/
	/**#4 Linguagem
	''const object __LANG''
	Controla a linguagem local da biblioteca.**/
	const __LANG = {
		/**. '{regexp re}: Expressão regular para o formato de a{linguagem}[href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)"].**/
		re: /^[a-z]{2,3}(\-[A-Z][a-z]{3})?(\-([A-Z]{2}|[0-9]{3}))?$/,
		/**. '{array node(node elem)}: Retorna a lista dos atributos i{lang} do elemento HTML e ascendentes.**/
		node: function(elem) {
			let list, lang = [];
			while (elem !== null) {
				if (elem.hasAttribute("lang")) {
					list = elem.lang.replace(/\s+/g, " ").split(" ");
					lang = lang.concat(list);
				}
				elem = elem.parentElement;
			}
			return lang;
		},
		/**. '{string user}: Define ou retorna a cadeia de linguagens definida no corpo do documento.**/
		set user(x) {
			x = typeof x === "string" ? x.replace(/\s+/g, "") : null;
			if (x === null)
				document.body.removeAttribute("lang");
			else if (this.re.test(x))
				document.body.setAttribute("lang", x);
		},
		get user() {
			return document.body.hasAttribute("lang") ? document.body.getAttribute("lang") : "";
		},
		/**. '{array value}: Define ou retorna a cadeia de linguagens estabelecidas.**/
		get value() {
			return this.node(document.body).concat(navigator.languages, ["en"]);
		},
	};

/*----------------------------------------------------------------------------*/
	/**#4 String para Data e Tempo
	''const object __DATETIME''
	Estabelece as regras para data e tempo em formato de string. Nomenclatura:
	|Dado|Código|Valores|Código|Valores|Código|Valores|Código|Valores|
	|Ano|Y|Número inteiro|YYYY|4 Dígitos ou mais|||||
	|Mês|M|1-12 ou 01-12|MM|2 Dígitos 01-12|MMM|Nome curto|MMMM|Nome longo|
	|Dia|D|1-31 ou 01-31|DD|2 Dígitos 01-31|||||
	|Dia da semana|d|1-7 ou 01-07|dd|2 Dígitos 01-07|ddd|Nome curto|dddd|Nome longo|
	|Semana do ano|w|1-53 ou 01-53|ww|2 Dígitos 01-53|||||
	|Horas|H|0-24 ou 00-24|HH|2 Dígitos 00-24|h|0-12 ou 00-12|hh|2 Dígitos 00-12|
	|Minuto|m|0-59 ou 00-59|mm|2 Dígitos 00-59|||||
	|Segundo|s|0-59.999 ou 00-59.999|ss|2 Dígitos 00-59.999|||||
	|Período do dia|p|AM ou PM|||||||
	|Antes do ano 0|P|"-" ou "+" (opcional)|||||||**/
	const __DATETIME = {
		/**. '{string lang}: Registra o identificador da linguagem local para fins de atualização.**/
		lang: null,
		/**. '{object local}: Registra os nomes dos meses e dias, curtos e longos.**/
		local: null,
		/**. '{object base}: Registra as unidades de tempo para fins de montagem dos modelos.**/
		base: {
			Y:   "([0-9]+)",                    YYYY: "([0-9][0-9][0-9][0-9]+)",
			M:   "(0?[1-9]|1[0-2])",            MM:   "(0[1-9]|1[0-2])",
			MMM: null,                          MMMM: null,
			D:   "(0?[1-9]|[12][0-9]|3[01])",   DD:   "(0[1-9]|[12][0-9]|3[01])",
			d:   "(0?[1-7])",                   dd:   "0[1-7]",
			ddd: null,                          dddd: null,
			w:   "(0?[1-9]|[1-4][0-9]|5[0-3])", ww:   "(0[1-9]|[1-4][0-9]|5[0-3])",
			H:   "([01]?[0-9]|2[0-4])",         HH:   "([01][0-9]|2[0-4])",
			h:   "(0?[1-9]|1[0-2])",            hh:   "(0[1-9]|1[0-2])",
			m:   "([0-5]?[0-9])",               mm:   "([0-5][0-9])",
			s:   "([0-5]?[0-9]|[0-5]?[0-9]\\.[0-9][0-9]?[0-9]?)",
			ss:  "([0-5][0-9]|[0-5][0-9]\\.[0-9][0-9]?[0-9]?)",
			p:   "([AP]M)", P: "([\\+\\-]?)"
		},
		/**. '{array templates}: Registra os modelos de tempo e suas configurações.**/
		templates: [
			/*-- datas: meses numéricos --*/
			{re: null, P: "$1", Y: "$2", M: "$3", D: "$4", type: "date", model: "PYYYY-MM-DD"},
			{re: null, P: "$1", D: "$2", M: "$3", Y: "$4", type: "date", model: "PDD/MM/YYYY"},
			{re: null, P: "$1", M: "$2", D: "$3", Y: "$4", type: "date", model: "PMM-DD-YYYY"},
			/*-- datas: meses nominais --*/
			{re: null, P: "$1", Y: "$2", M: "$3", D: "$4", type: "date", model: "PYYYY MMM D"},
			{re: null, P: "$1", Y: "$2", M: "$3", D: "$4", type: "date", model: "PYYYY MMMM D"},
			{re: null, P: "$1", D: "$2", M: "$3", Y: "$4", type: "date", model: "PD MMM YYYY"},
			{re: null, P: "$1", D: "$2", M: "$3", Y: "$4", type: "date", model: "PD MMMM YYYY"},
			{re: null, P: "$1", M: "$2", D: "$3", Y: "$4", type: "date", model: "PMMM D YYYY"},
			{re: null, P: "$1", M: "$2", D: "$3", Y: "$4", type: "date", model: "PMMMM D YYYY"},
			/*-- mêses numéricos --*/
			{re: null, P: "$1", Y: "$2", M: "$3", type: "month", model: "PYYYY-MM"},
			{re: null, P: "$1", M: "$2", Y: "$3", type: "month", model: "PMM/YYYY"},
			{re: null, P: "$1", M: "$2", Y: "$3", type: "month", model: "PMM-YYYY"},
			/*-- mêses nominais --*/
			{re: null, P: "$1", M: "$2", Y: "$3", type: "month", model: "PMMM YYYY"},
			{re: null, P: "$1", M: "$2", Y: "$3", type: "month", model: "PMMMM YYYY"},
			{re: null, P: "$1", Y: "$2", M: "$3", type: "month", model: "PYYYY MMM D"},
			{re: null, P: "$1", Y: "$2", M: "$3", type: "month", model: "PYYYY MMMM D"},
			/*-- semanas --*/
			{re: null, P: "$1", Y: "$2", w: "$3", type: "week", model: "PYYYY-Www"},
			/*-- tempo --*/
			{re: null, H: "$1", m: "$2", s: "$3",          type: "time", model: "H:mm:ss"},
			{re: null, H: "$1", m: "$2",                   type: "time", model: "H:mm"},
			{re: null, h: "$1", m: "$2", s: "$3", p: "$4", type: "time", model: "h:mm:ss p"},
			{re: null, h: "$1", m: "$2", p: "$3",          type: "time", model: "h:mm p"},
			//week	WWYYYY	01, 2010 (semana de 01-54)
		],
		/**. '{object names(array lang)}: Retorna os nomes dos meses e dias (ddd dddd MMM MMMM) na língua definida no argumento.**/
		names: function(lang) {
			const data = {ddd: Array(7), dddd: Array(7), MMM: Array(12), MMMM: Array(12)};
			const date = new Date(1970, 0, 15, 12, 0, 0, 0);
			for (let i = 0; i < 12; i++) {
				data.MMMM[date.getMonth()] = date.toLocaleDateString(lang, {month: "long"}).trim();
				data.MMM[date.getMonth()]  = date.toLocaleDateString(lang, {month: "short"}).trim();
				date.setMonth(date.getMonth() + 1);
			}
			for (let i = 0; i < 7; i++) {
				data.dddd[date.getDay()] = date.toLocaleDateString(lang, {weekday: "long"}).trim();
				data.ddd[date.getDay()]  = date.toLocaleDateString(lang, {weekday: "short"}).trim();
				date.setDate(date.getDate() + 1);
			}
			return data;
		},
		/**. '{void update()}: Atualiza os modelos em caso de mundança de linguagem.**/
		update: function() {
			/*-- verificando alteração de lang --*/
			const lang = __LANG.value.join(" ");
			if (lang === this.lang) return;
			/*-- atualizar valores --*/
			this.lang  = lang;
			this.local = this.names(lang.split(" "));
			/*-- atualizar unidades básicas ''--*/
			for (let i in this.local) {
				let list = this.local[i].slice();
				list.forEach(function(v,i,a) {a[i] = v.replace(/(\W)/g, "\\$1");});
				let data = list.join("|");
				this.base[i] = `(${data})`;
			}
			/*-- atualizar expressões regulares dos modelos --*/
			const wall  = /(\W)/g;
			const find  = /(Y+|D+|M+|w+|d+|H+|h+|m+|s+|p|P)/g;
			for (let i in this.templates) {
				/*-- obtendo valores dos dados --*/
				let parts = {};
				let model = this.templates[i].model.replace(wall, "\\$1");
				let type  = this.templates[i].type;
				let units = model.match(find);
				for (let unit = 0; unit < units.length; unit++)
					parts[units[unit]] = this.base[units[unit]];
				/*-- executando a substituição de dados --*/
				model = model.replace(find, "<<<$1>>>");
				for (let part in parts)
					model = model.replace(`<<<${part}>>>`, parts[part]);
				/*-- construindo expressão regular --*/
				this.templates[i].re = new RegExp(`^${model}$`, "i");
			}
			return;
		},
		/**. '{boolean leap(integer year)}: Informar se o ano definido no argumento é bissexto.**/
		leap: function(year) {
			const y = Math.abs(year);
			return (y%400 === 0 || (y%4 === 0 && y%100 !== 0));
		},
		/**. '{integer max(integer year, integer month)}: Informar o número máximo de dias no mês.**/
		max: function(year, month) {
			const max = [31,(this.leap(year) ? 29 : 28),31,30,31,30,31,31,30,31,30,31];
			return max[month-1];
		},
		/**. '{number|string value(string data, string unit)}: Retorna o valor numérico declarado em '{data}:
		- '{unit} aceitas os valores Y D M w d h H m s p P;
		- em caso de número, retornará seu valor numérico;
		- se '{unit} for "d" ou "M" e '{data} um nome, retornará seu índice a partir de 1;
		- se '{unit} for "P", retornará -1, caso negativo, ou 1; e
		- se '{unit} for "p", retornará "AM" ou "PM".**/
		value: function (data, unit) {
			this.update();
			const number = /^\d+(\.\d+)?$/;
			if (number.test(data)) return Number(data);
			const upper = String(data).toUpperCase();
			const lower = String(data).toLowerCase();
			if (unit === "P")
				return data === "-" ? -1 : 1;
			if (unit === "d" || unit === "M") {
				const attr = unit === "d" ? ["dddd", "ddd"] : ["MMMM", "MMM"];
				const div  = unit === "d" ? 7 : 12;
				const list = this.local[attr[0]].concat(this.local[attr[1]]);
				for (let i = 0; i < list.length; i++) {
					if (list[i].toUpperCase() === upper || list[i].toLowerCase() === lower)
						return i%div + 1;
				}
			}
			return upper;
		},
		/**. '{string string(number data, string unit)}: Retorna o valor textual conforme formato definido em '{unit}**/
		string: function(data, unit) {
			const abs = Math.abs(data);
			if (unit === "YYYY" || unit === "Y") {
				const len = abs < 10 ? 3 : (abs < 100 ? 2 : (abs < 1000 ? 1 : 0));
				return String("0").repeat(unit === "Y" ? 0 : len)+String(abs);
			}
			if (unit === "ss") {
				const num = String(abs).split(".");
				if (num.length < 2) num.push("000");
				const int = num[0].length;
				const dec = num[1].length;
				num[0] = (int === 1 ? "0" : "") + num[0];
				num[1] = num[1] + (dec === 1 ? "00" : (dec === 2 ? "0" : ""));
				return num.join(".");
			}
			if (unit === "ddd" || unit === "dddd" || unit === "MMM" || unit === "MMMM") {
				const div   = unit[0] === "d" ? 7 : 12;
				const item  = data - 1;
				const index = item%div + (item < 0 ? div : 0);
				return this.local[unit][index];
			}
			if (unit === "P")
				return Number(data) < 0 ? "-" : "";
			if ((/^(MM|DD|dd|ww|HH|hh|mm)$/).test(unit))
				return (abs < 10 ? "0" : "") + String(abs);
			if ((/^[YMDdwHhms]$/).test(unit))
				return String(abs);
			return String(data).toUpperCase();
		},
		/**. '{string iso(object data)}: Retorna uma string padrão a partir do resultado do método '{check}.**/
		iso: function(data) {
			if (typeof data !== "object") return null;
			if (data.type === "date") {
				const P    = this.string(data.P, "P");
				const YYYY = this.string(data.Y, "YYYY");
				const MM   = this.string(data.M, "MM");
				const DD   = this.string(data.D, "DD");
				return `${P}${YYYY}-${MM}-${DD}`;
			}
			if (data.type === "month") {
				const P    = this.string(data.P, "P");
				const YYYY = this.string(data.Y, "YYYY");
				const MM   = this.string(data.M, "MM");
				return `${P}${YYYY}-${MM}`;
			}
			if (data.type === "week") {
				const P    = this.string(data.P, "P");
				const YYYY = this.string(data.Y, "YYYY");
				const ww   = this.string(data.w, "ww");
				return `${P}${YYYY}-W${ww}`;
			}
			if (data.type === "time") {
				const HH = this.string(data.H, "HH");
				const mm = this.string(data.m, "mm");
				const ss = this.string(data.s, "ss");
				return `${HH}:${mm}:${ss}`;
			}
			if (data.type === "datetime") {
				const copy = {};
				for (let i in data) copy[i] = data[i];
				copy.type  = "date";
				const date = this.iso(copy);
				copy.type  = "time";
				const time = this.iso(copy);
				return [date,time].join("T");
			}
			return null;
		},
		/**. '{string form(object data)}: Retorna uma string para formulário a partir do resultado do método '{check}.**/
		form: function(data) {
			if (typeof data !== "object")    return "";
			if ("P" in data && data.P < 0)   return "";
			if ("Y" in data && (data.Y < 1)) return "";
			if (data.type === "date") {
				const YYYY = this.string(data.Y, "YYYY");
				const MM   = this.string(data.M, "MM");
				const DD   = this.string(data.D, "DD");
				return `${YYYY}-${MM}-${DD}`;
			}
			if (data.type === "month") {
				const YYYY = this.string(data.Y, "YYYY");
				const MM   = this.string(data.M, "MM");
				return `${YYYY}-${MM}`;
			}
			if (data.type === "week") {
				const YYYY = this.string(data.Y, "YYYY");
				const ww   = this.string(data.w, "ww");
				return `${YYYY}-W${ww}`;
			}
			if (data.type === "time") {
				const HH = this.string(data.H, "HH");
				const mm = this.string(data.m, "mm");
				return `${HH}:${mm}`;
			}
			if (data.type === "datetime") {
				const copy = {};
				for (let i in data) copy[i] = data[i];
				copy.type  = "date";
				const date = this.form(copy);
				copy.type  = "time";
				const time = this.form(copy);
				return [date,time].join("T");
			}
			return null;
		},
		/**. '{object check(string input)}: Testa o valor de entrada ('{input}) como data, tempo, mês ou semana. Retonará nulo, se incorreto, ou um objeto contendo as unidades de data ou tempo**/
		check: function(input) {
			this.update();
			input = String(input).trim();
			const find  = /^(Y+|D+|M+|w+|d+|H+|h+|m+|s+|p|P)$/g;
			/*-- checando as expressões regulares --*/
			for (let i = 0; i < this.templates.length; i++) {
				let item = this.templates[i];
				if (item.re.test(input)) {
					let data = {type: item.type, model: item.model, re: item.re};
					for (let j in item) {
						if (!(j in data)) {
							let info = input.replace(item.re, item[j]);
							data[j]  = this.value(info, j);
						}
					}

					/*-- checando o dia do mês --*/
					if (data.type === "date" && data.D > this.max(data.Y, data.M)) {
						continue;
					}
					/*-- checando a semana <https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Date_and_time_formats#week_strings> --*/
					if (data.type === "week") {
						const base = new __Week(data.Y, 1, 1);
						const init = base.weekDay;
						const leap = base.leap;
						const max  = init === 5 || (init === 4 && leap) ? 53 : 52;
						if (data.w > max) continue;
					}
					/*-- checando tempo --*/
					if (data.type === "time") {
						/*-- 12 horas --*/
						if ("h" in data) {
							data.H = data.h%12 + (data.p === "PM" ? 12 : 0);
						}
						/*-- 24 horas --*/
						else if ("H" in data) {
							data.H = data.H%24;
							data.p = data.H >= 12 ? "PM" : "AM";
							data.h = data.H === 0 ? 12 : data.H - (data.H < 13 ? 0 : 12);
						}
						/*-- sem o segundo --*/
						if (!("s" in data)) data.s = 0;
					}
					/*-- retornar --*/
					data.iso  = this.iso(data);
					data.form = this.form(data);
					return data;
				}
			}
			return null;
		},
		/**. '{object test(string input)}: Testa o valor de entrada como u{data e tempo} ou o retorna o resultado do método '{check}.**/
		test: function(input) {
			const find = /([0-9][0-9])(T|\,|\ |\,\ )(\d?\d\:[0-5][0-9])/;
			/*-- testar tempo ou data --*/
			if (!find.test(input)) return this.check(input);
			/*-- testar tempo e data --*/
			//FIXME Date() não está contemplado?
			const list = input.replace(find, "$1\n$2\n$3").split("\n");
			const date = this.check(list[0]);
			const time = this.check(list[2]);
			const join = list[1];
			/*-- não é datetime --*/
			if (date === null || time === null || date.type !== "date" || time.type !== "time")
				return null;
			/*-- é datetime --*/
			const dt = {};
			for (let i in date) dt[i] = date[i];
			for (let i in time) dt[i] = time[i];
			dt.type  = "datetime";
			dt.model = `${date.model}${join}${time.model}`;
			dt.iso   = this.iso(dt);
			dt.form  = this.form(dt);
			dt.re    = null;
			return dt;
		},
		/**. '{object toObject(string input)}: Testa o valor de entrada e retorna os atributos do tempo.**/
		toObject: function(input) {
			const data = {type: null};
			const info = {M: "month", D: "day", d: "weekDay", w: "week", H: "hour", m: "minute", s: "second", iso: "iso", type: "type"};
			const time = this.test(input);
			if (time !== null) {
				for (let i in info) {
					if (i in time) data[info[i]] = time[i];
				}
				if ("Y" in time) data.year  = time.P * time.Y;
			}
			return data;
		},
	};

/*----------------------------------------------------------------------------*/
	/**#4 String para Números
	''const object __NUMBER''
	Estabelece as regras para números em formato de string.**/
	const __NUMBER = {
		/**. '{object re}: Objeto contendo as expressões regulares dos números em formato string.**/
		re: {
			finite:    /^[+-]?(\.?\d+|\d+\.\d+)(e[+-]?\d+)?\%?$/i,
			factorial: /^\+?\d+\!$/,
			infinite:  /^[+-]?\∞$/,
		},
		/**. '{string search(string input)}: Retorna o tipo de número (nome) de acordo com a pripriedade '{re} ou nulo.**/
		search: function(input) {
			for (let i in this.re)
				if (this.re[i].test(input)) return i;
				return null;
		},
		/**. '{integer test(string input)}: Testa o valor de entrada e retorna seu valor ou nulo, se não enquadrado.**/
		test: function (input) {
			const type = this.search(input);
			if (type === "infinite")
				return input[0] === "-" ? -Infinity : Infinity;
			if (type === "finite")
				return Number(input.replace("%", ""))/(input.slice(-1) === "%" ? 100 : 1);
			if (type === "factorial") {
				let int = Number(input.replace("!", ""));
				let val = int;
				while (--int > 1) val = val * int;
				return val;
			}
			return null;
		}
	};

/*----------------------------------------------------------------------------*/
	/**#4 Checagem de Tipos
	''const object __CHECK''
	Estabelece as regras para identificação dos tipos básicos e seus valores.**/
	const __CHECK = {
		/**. '{object instances}: Lista de instâncias conhecidas para identificação do tipo de objeto.**/
		instances: {
			String:                     {type: "string",   value: "valueOf"},
			Number:                     {type: "number",   value: "valueOf"},
			Boolean:                    {type: "boolean",  value: "valueOf"},
			RegExp:                     {type: "regexp",   value: "valueOf"},
			Date:                       {type: "datetime", value: "datetime"},
			Function:                   {type: "function", value: "valueOf"},
			HTMLElement:                {type: "node",     value: "item"},
			SVGElement:                 {type: "node",     value: "item"},
			MathMLElement:              {type: "node",     value: "item"},
			NodeList:                   {type: "node",     value: "nodes"},
			RadioNodeList:              {type: "node",     value: "nodes"},
			HTMLCollection:             {type: "node",     value: "nodes"},
			HTMLAllCollection:          {type: "node",     value: "nodes"},
			HTMLOptionsCollection:      {type: "node",     value: "nodes"},
			HTMLFormControlsCollection: {type: "node",     value: "nodes"},
		},
		/**. '{object datetime(object date)}: Retorna os valores numéricos de '{Date} (P, Y, M, D, d, H, m, s e type).**/
		datetime: function(date) {
			return __DATETIME.iso({
				Y: Math.abs(date.getFullYear()), P: date.getFullYear() < 0 ? -1 : 1,
				M: date.getMonth() + 1, D: date.getDate(),    d: date.getDay() + 1,
				H: date.getHours(),     m: date.getMinutes(), type: "datetime",
				s: date.getSeconds()+(date.getMilliseconds()/1000),
			});
		},
		/**. '{object test(object input)}: Testa o objeto informado e retorna um objeto contendo seu tipo (type) valor (value).**/
		test: function(input) {
			const data = {type: typeof input, value: input};
			if (data.type !== "object")
				return data;
			if (input === null)
				return {type: "null",  value: null};
			if (Array.isArray(input))
				return {type: "array", value: input.slice()};
			/*-- objetos comuns --*/
			for (let name in this.instances) {
				if (name in window && input instanceof window[name]) {
					let item  = this.instances[name];
					data.type = item.type;
					if (item.value === "valueOf")
						data.value = input.valueOf();
					else if (item.value === "datetime")
						data.value = this.datetime(input);
					else if (item.value === "item")
						data.value = [input];
					else if (item.value === "nodes")
						data.value = Array.prototype.slice.call(input).filter(function(v,i,a) {
							return v.nodeType === 1;
						});
				}
			}
			return data;
		}
	};

/*----------------------------------------------------------------------------*/
	/**#4 Tipologia
	''constructor object __Type(any  input)''
	Construtor para identificação do tipo de dado informado em '{input}.**/
	function __Type(input) {
		if (!(this instanceof __Type)) return new __Type(input);
		let find = __CHECK.test(input);
		let char = find.type === "string";
		let data = {type: find.type, value: find.value};
		/*-- checando valores em string --*/
		if (find.type === "string") {
			let types    = ["date", "time", "datetime"];
			let datetime = __DATETIME.test(input);
			let number   = __NUMBER.test(input);
			if (datetime !== null && types.indexOf(datetime.type) >= 0)
				data = {type: datetime.type, value: datetime.iso};
			else if (number !== null)
				data = {type: "number", value: number};
		}
		/*-- checando NaN --*/
		if (data.type === "number" && isNaN(data.value)) {
			data.type = "NaN";
		}
		Object.defineProperties(this, {
			_input: {value: input},
			_char:  {value: char},
			_type:  {value: data.type},
			_value: {value: data.value},
		});
	}

	Object.defineProperties(__Type.prototype, {
		constructor: {value: __Type},
		_re_email: {value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/},
		/*-- Strings -------------------------------------------------------------*/
		/**. '{boolean string}: Checa se o valor é uma string diferente de número ou data/tempo.**/
		string: {get: function() {return this.type === "string";}},
		/**. '{boolean chars}: Checa se o valor é uma string.**/
		chars: {get: function() {return this._char;}},
		/**. '{boolean empty}: Checa se o valor é uma string de caracteres não visualizáveis.**/
		empty: {get: function() {return this.chars && this._input.trim().length === 0;}},
		/**. '{boolean nonempty}: Checa se o valor é uma string de caracteres visualizáveis.**/
		nonempty: {get: function() {return this.chars && !this.empty;}},
		/**. '{boolean lang}: Checa se o valor é uma string no formato de linguagem.**/
		lang: {get: function() {return this.chars && __LANG.re(this._input.trim());}},
		/**. '{boolean email}: Checa se o valor é uma string no formato de email.**/
		email: {get: function() {return this.chars && this._re_email.test(this._input.trim());}},
		/*-- DateTime ------------------------------------------------------------*/
		/**. '{boolean datetime}: Checa se o valor é um conjunto data e tempo.**/
		datetime: {get: function() {return this.type === "datetime";}},
		/**. '{boolean date}: Checa se o valor é uma data em formato de string.**/
		date: {get: function() {return this.type === "date";}},
		/**. '{boolean time}: Checa se o argumento é uma string que representa uma unidade de tempo.**/
		time: {get: function() {return this.type === "time";}},
		/*-- Number ---------------------------------------------------------------*/
		/**. '{boolean number}: Checa se o valor é um número real, fatorial (string) ou percentual (string).**/
		number: {get: function() {return this.type === "number";}},
		/**. '{boolean finite}: Checa se o valor é um número finito.**/
		finite: {get: function() {return this.number && isFinite(this.value);}},
		/**. '{boolean infinite}: Checa se o valor é um número infinito.**/
		infinite: {get: function() {return this.number && !this.finite;}},
		/**. '{boolean integer}: Checa se o valor é um número real inteiro.**/
		integer: {get: function() {return this.finite && (this.value%1) === 0;}},
		/**. '{boolean real}: Checa se o valor é um número real não inteiro.**/
		decimal: {get: function() {return this.finite && (this.value%1) !== 0;}},
		/**. '{boolean positive}: Checa se o valor é um número positivo.**/
		positive: {get: function() {return this.number && this.value > 0;}},
		/**. '{boolean negative}: Checa se o valor é um número negativo.**/
		negative: {get: function() {return this.number && this.value < 0;}},
		/**. '{boolean zero}: Checa se o valor é zero.**/
		zero: {get: function() {return this.value === 0;}},
		/*-- Diversos ------------------------------------------------------------*/
		/**. '{boolean boolean}: Checa se o valor é um valor booleano.**/
		boolean: {get: function() {return this.type === "boolean";}},
		/**. '{boolean regexp}: Checa se o valor é uma expressão regular.**/
		regexp: {get: function() {return this.type === "regexp";}},
		/**. '{boolean function}: Checa se o valor é uma função.**/
		function: {get: function() {return this.type === "function";}},
		/**. '{boolean array}: Checa se o valor é um array.**/
		array: {get: function() {return this.type === "array";}},
		/**. '{boolean node}: Checa se o argumento é um elemento HTML ou uma coleção desses.**/
		node: {get: function() {return this.type === "node";}},
		/**. '{boolean object}: Checa se o argumento é um objeto que não se enquadra nas demais categorias.**/
		object: {get: function() {return this.type === "object";}},
		/*-- Sem valores ---------------------------------------------------------*/
		/**. '{boolean null}: Checa se o valor é nulo.**/
		null: {get: function () {return this.type === "null";}},
		/**. '{boolean undefined}: Checa se o valor é indefinido.**/
		undefined: {get: function() {return this.type === "undefined";}},
		/*-- Checagens -----------------------------------------------------------*/
		/**. '{string type}: Retorna o tipo do argumento verificado.**/
		type: {get: function() {return this._type;}},
		/**. '{any  value}: Retorna o valor do argumento de acordo com o atributo '{type}.**/
		value: {get: function() {return this._value;}},
		/**. '{void  valueOf()}: Método padrão.**/
		valueOf: {value: function() {return this._value.valueOf();}},
		/**. '{string toString()}: Método padrão.**/
		toString: {value: function() {return this._value.toString();}},
		/**. '{boolean instanceOf(string name)}: Retorna se o valor informado é instância do objeto nomeado em '{name}.**/
		instanceOf: {
			value: function (name) {
				const data = String(name).trim();
				const type = typeof this._input === "object";
				return type && data in window && this._input instanceof window[data];
			}
		}
	});

/*----------------------------------------------------------------------------*/
	/**#4 Gestão de Dados
	''constructor object __DataSet(any input)''
	Construtor para gerir conjunto de dados. O argumento opcional '{input} será importado conforme método '{import} que será chamado durante a construção.**/
	function __DataSet(input) {
		if (!(this instanceof __DataSet))	return new __DataSet(input);
		Object.defineProperties(this, {_data: {value: []}});
		this.import(input);
	}

	Object.defineProperties(__DataSet.prototype, {
		constructor: {value: __DataSet},
		/**. '{self import(any input)}: Importa os dados de '{input} que podendo ser uma string no formato "name: value\r\n", um objeto, um array ou instâncias de Headers, FormData, URLSearchParams ou __DataSet.**/
		import: {
			value: function(input) {
				const check  = __Type(input);
				const self   = this;
				const header = /^([a-z\-]+\:\ [^\n]+\r\n)+$/;
				const search = /^([^?]+\?|\?)?([^=]+\=(\&?|[^&]+\&?))+$/;
				/*-- string header => name: value\r\n --*/
				if (check.nonempty && header.test(input)) {
					const data = input.trim().split("\r\n");
					for (let i = 0; i < data.length; i++) {
						let part  = data[i].split(": ");
						let name  = part[0].trim();
						let value = part.length > 0 ? part[1].trim() : "";
						if (name.length > 0) this.append(name, value);
					}
				}
				/*-- string search => ?name=value& --*/
				else if (check.nonempty && search.test(input)) {
					const url  = input.split("?");
					const data = url[url.length - 1].trim().split("&");
					for (let i = 0; i < data.length; i++) {
						let part  = data[i].split("=");
						let name  = part[0].trim().replace(/\[\]$/, "");
						let value = part.length > 1 ? part[1] : "";
						if (name.length > 0) this.append(name, value);
					}
				}
				/*-- instância de URL --*/
				else if (check.instanceOf("URL")) {
					return this.import(input.search);
				}
				/*-- instância de Headers --*/
				else if (check.instanceOf("Headers")) {
					input.forEach(function (value,name,data) {self.append(name, value);});
				}
				/*-- instância de URLSearchParams --*/
				else if (check.instanceOf("URLSearchParams")) {
					input.forEach(function (value,name,data) {self.append(name, value);});
				}
				/*-- instância de FormData --*/
				else if (check.instanceOf("FormData")) {
					for (const data of input.entries()) {this.append(data[0], data[1]);}
				}
				/*-- instância de Map --*/
				else if (check.instanceOf("Map")) {
					input.forEach(function (value,name,data) {self.append(name, value);});
				}
				/*-- instância de __DataSet --*/
				else if (input instanceof __DataSet) {
					input.forEach(function (value,name,data) {self.append(name, value);});
				}
				/*-- JS Array --*/
				else if (check.array) {
					for (let i = 0; i < input.length; i++) this.append(String(i), input[i]);
				}
				/*-- JS Objeto (ficar por último) --*/
				else if (check.object) {
					for (let name in input) this.append(name, input[name]);
				}
				return;
			}
		},
		/**. '{self append(string name, any value)}: Acrescenta um valor ('{value}) vinculado a um identificador ('{name}).**/
		append: {
			value: function(name, value) {
				name = String(name).replace(/\[\]$/, "").trim();
				if (name.length !== 0)
					this._data.push({name: name, value: value});
				return this
			}
		},
		/**. '{self delete(string name)}: Remove todos os valores associados ao indentificador '{name}.**/
		delete: {
			value: function(name) {
				name = String(name).replace(/\[\]$/, "").trim();
				if (name.length !== 0)
					this._data.forEach(function(v,i,a) {
						if (v !== null && name === v.name) a[i] = null;
					});
				return this;
			}
		},
		/**. '{self set(string name, any value)}: Define um valor ('{value}) vinculado a um identificador ('{name}), substuindo os existentes.**/
		set: {
			value: function(name, value) {
				this.delete(name).append(name, value);
				return this;
			}
		},
		/**. '{array getAll(string name)}: Retorna uma lista de valores identificados por '{name}.**/
		getAll: {
			value: function(name) {
				name = String(name).replace(/\[\]$/, "").trim();
				const list = [];
				if (name.length !== 0) {
					for (let i of this.entries())
						if (name === i[0]) list.push(i[1]);
				}
				return list;
			}
		},
		/**. '{boolean has(string name)}: Retorna verdadeiro se o identificador '{name} existir.**/
		has: {
			value: function(name) {
				name = String(name).replace(/\[\]$/, "").trim();
				if (name.length !== 0) {
					for (let i of this.entries())
						if (name === i[0]) return true;
				}
				return false;
			}
		},
		/**. '{object toObject}: Converte o conjunto de dados em um objeto com **sobreposição de identificadores**.**/
		toObject: {
			get: function() {
				const data = {};
				for (let i of this.entries()) data[i[0]] = i[1];
				return data;
			}
		},
		/**. '{object toMap}: Converte o conjunto de dados em um Mapa com **sobreposição de identificadores**.**/
		toMap: {
			get: function() {
				const data = new Map();
				for (let i of this.entries()) data.set(i[0],i[1]);
				return data;
			}
		},
		/**. '{object toListObject}: Converte o conjunto de dados em um objeto organizado em listas de valores.**/
		toListObject: {
			get: function() {
				const data = {};
				for (let v of this.entries()) {
					let name  = v[0];
					let value = v[1];
					let check = __Type(value);
					/*-- definição da propriedade, se for objeto analisar cada item adiante --*/
					if (!(name in data) && !check.object) data[name] = [];

					if (check.instanceOf("FileList") || check.array) {
						if (value.length === 0)
							data[name].push("");
						else
							for (let i = 0; i < value.length; i++) data[name].push(value[i]);
					}
					else if (check.object) {
						let count = 0;
						for (let i in value) count++;
						if (count === 0) {
							if (!(name in data)) data[name] = [];
							data[name].push("");
						} else {
							for (let i in value) {
								let prop = name+"."+i;
								if (!(prop in data)) data[prop] = [];
								data[prop].push(value[i]);
							}
						}
					}
					else {
						data[name].push(value);
					}
				}
				return data;
			}
		},
		/**. '{object toObjectHeaders}: Converte o conjunto de dados em um objeto organizado em strings com valores separador por ", ".**/
		toObjectHeaders: {
			get: function() {
				const data = {};
				const src  = this.toListObject;
				for (let i in src) {
					let name = i.toLowerCase();
					if (name in data)
						data[name] = [data[name], src[i].join(", ")].join(", ");
					else
						data[name] = src[i].join(", ")
				}
				return data;
			}
		},
		/**. '{object toHeaders}: Converte o conjunto de dados em um objeto Headers. Se a ferramenta não estiver definida, retornará o resultado da propriedade '{toObjectHeaders}.**/
		toHeaders: {
			get: function() {
				if (!("Headers" in window)) return this.toObjectHeaders;
				const data = new Headers();
				const src  = this.toListObject;
				for (let name in src)
					for (let value of src[name])
						data.append(name, value);
				return data;
			}
		},
		/**. '{string toStringHeaders}: Converte o conjunto de dados em uma string com dados separados por "\r\n" e nome e valor separados por ": ".**/
		toStringHeaders: {
			get: function() {
				const data = [];
				const src  = this.toObjectHeaders;
				for (let i in src) data.push(i + ": " + src[i] + "\r\n");
				return data.join("");
			}
		},
		/**. '{object toFormData}: Converte o conjunto de dados em um objeto FormData. Se a ferramenta não estiver definida, retornará o resultado da propriedade '{toSearch}.**/
		toFormData: {
			get: function() {
				if (!("FormData" in window)) return this.toSearch;
				const data = new FormData();
				const src  = this.toListObject;
				for (let name in src)
					for (let value of src[name])
						data.append(name+(src[name].length > 1 ? "[]" : ""), value);
				return data;
			}
		},
		/**. '{object toURLSearchParams}: Converte o conjunto de dados em um objeto URLSearchParams. Se a ferramenta não estiver definida, retornará o resultado da propriedade '{toSearch}.**/
		toURLSearchParams: {
			get: function() {
				if (!("URLSearchParams" in window)) return this.toSearch;
				const data = new URLSearchParams();
				const src  = this.toListObject;
				for (let name in src) {
					for (let value of src[name]) {
						let file = __Type(value).instanceOf("File");
						let prop = name+(src[name].length > 1 ? "[]" : "")
						let val  = file ? value.name : value
						data.append(prop, val);
					}
				}
				return data;
			}
		},
		/**. '{string toSearch}: Converte o conjunto de dados em uma string com itens separados por &amp;.**/
		toSearch: {
			get: function() {
				const data = [];
				const src  = this.toListObject;
				for (let name in src) {
					for (let value of src[name]) {
						let file = __Type(value).instanceOf("File");
						let prop = encodeURIComponent(name)+(src[name].length > 1 ? "[]" : "");
						let val  = encodeURIComponent(file ? value.name : value);
						data.push(prop+"="+val);
					}
				}
				return data.join("&");
			}
		},
		[Symbol.iterator]: {
			value: function*() {for (let v of this.entries()) yield v;}
		},
		/**. '{object entries()}: Retorna um objeto Generator para looping i{for of} das entradas.**/
		entries: {
			value: function*() {
				for (let v of this._data)
					if (v !== null) yield [v.name, v.value];
			}
		},
		/**. '{object keys()}: Retorna um objeto Generator para looping i{for of} das chaves.**/
		keys: {
			value: function*() {for (let v of this.entries()) yield v[0];}
		},
		/**. '{object values()}: Retorna um objeto Generator para looping i{for of} dos valores.**/
		values: {
			value: function*() {for (let v of this.entries()) yield v[1];}
		},
		/**. '{self forEach(function' caller)}: Chama '{caller} para cada item, repassando o valor e nome, e um objeto com o par nome/valor, respectivamente, como argumentos.**/
		forEach: {
			value: function(caller) {
				if (__Type(caller).function) {
					const dataset = this.valueOf();
					for (let i in dataset)
						caller(dataset[i], i.trim(), dataset);
				}
				return this;
			}
		},
		/**. '{integer size}: Retorna um objeto representativo e não utilizável dos dados.**/
		size: {
			get: function() {
				let size = 0;
					for (let i of this.entries()) size++;
				return size;
			}
		},
		/**. '{object valueOf()}: Retorna uma representação dos dados em forma de objeto.**/
		valueOf: {
			value: function() {
				const counter = {};
				const dataset = {};
				for (let i of this.entries()) {
					let name  = i[0];
					let value = i[1];
					if (!(name in counter)) counter[name] = 0;
					let prop = name + ("\r").repeat(++counter[name]);
					dataset[prop] = value;
				}
				return dataset;
			}
		},
		/**. '{string toString()}: Retorna o mesmo produto da propriedade '{toStringHeaders}.**/
		toString: {
			value: function() {return this.toStringHeaders;}
		},
		/**. '{object toSubmit(any action, string method)}: O argumento '{action} é a URL (string ou objeto URL) e o argumento '{method} é o método da requisição. O método retorna um objeto com as seguintes propriedades para fins de requisição XMLHttpRequest, devendo inicialmente povoar o objeto com os valores de formulário e depois chamar o método:
		|Nome|Descrição|
		|url|URL a ser utilizada na requisição|
		|ctype|O content-type a ser informado no cabeçalho, dependendo do método|
		|body|O corpo da requisição, a depender do método|**/
		toSubmit: {
			value: function(action, method) {
				/*-- https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods --*/
				/*-- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form --*/
				method        = String(method).toLowerCase().trim();
				const hasBody = {get: 0, head: 0, post: 1, put: 1, delete: 1, connect: 1, options: 0, trace: 0, patch: 1};
				const check   = new __Type(action);
				const ctype   = {post: "multipart/form-data", get: "application/x-www-form-urlencoded", text: "text/plain"};
				const data    = {
					url:     check.instanceOf("URL") ? action.href : (check.nonempty ? action : ""),
					ctype: hasBody[method] === 1 ? ctype.post : ctype.get,
					body:    hasBody[method] === 1 ? this.toFormData : null
				};
				if (hasBody[method] !== 1) {
					const dataset = new this.constructor(data.url);
					dataset.import(this);
					data.url = data.url.split("?")[0]+"?"+dataset.toSearch;
				}
				return data;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 Árvore de Dados
	''constructor object __Tree()''
	Construtor para manipulação de regras com com aberturas e fechamentos de níveis para fins de construção guiada de código XML.**/
	function __Tree() {
		if (!(this instanceof __Tree)) return new __Tree();
		Object.defineProperties(this, {
			_tree:    {value: []},
			_data:    {value: []},
			_pattern: {writable: true, value: "?"},
			_save:    {writable: true, value: []},
			_xml:     {writable: true, value: false}
		});
	}

	Object.defineProperties(__Tree.prototype, {
		constructor: {value: __Tree},
		/**. '{string char(string x)}: Retorna o argumento adaptado para exibição HTML.**/
		char: {
			value: function(x) {
				if (x === undefined || x === null) return "";
				const chars = String(x).split("");
				const html  = [{a: "&",  b: "&amp;"}, {a: "<",  b: "&lt;"},  {a: ">", b: "&gt;"}];
				if (!this.xml)
					html.push({a: "\n", b: "<br/>"}, {a: "\t", b: "&Tab;"}, {a: " ", b: "&nbsp;"});
				chars.forEach(function(v,i,a) {
					for (let h of html)
						if (v === h.a) a[i] = h.b;
				});
				return chars.join("");
			}
		},
		/**. '{boolean xml}: Define se a estrutura da árvore se destina à marcação XML.**/
		xml: {
			get: function()  {return this._xml === true;},
			set: function(x) {this._xml = x === true;}
		},
		/**. '{string level}: Retorna o nome do último nível informado ou nulo se vazio.**/
		level: {
			get: function() {
				if (this._tree.length === 0) return null;
				return this._tree[this._tree.length - 1];
			}
		},
		/**. '{string pattern(string model)}: Define e retorna um modelo padrão de i{tag} a ser elaborada a partir do nome do nível. O nome do nível será inserido no modelo a partir da substituição do caracteres de interrogação. Por exemplo, se definido o modelo "span-?" e nível "line", a i{tag} de abertura será i{<span-line>}. O valor padrão é "?", obtido quando se define o argumento como string vazia ou nulo. Se o argumento for indefinido, retorna o valor.**/
		pattern: {
			value: function(model) {
				if (model === undefined) return this._pattern;
				const pattern = model === null ? "?" : String(model).replace(/\s+/g, "").trim();
				this._pattern = pattern.length === 0 ? "?" : pattern;
				return this._pattern;
			}
		},
		/**. '{self add(string chars)}: Adiciona caracteres à arvore.**/
		add: {
			value: function(chars) {
				this._data.push(this.char(chars));
				return this;
			}
		},
		/**. '{self open(string name)}: Abre novo nível nomeado conforme argumento '{name}. O argumento é a tag do elemento seguido, se houver, dos atributos a serem aplicados.**/
		open: {
			value: function(name) {
				const data = String(name).replace(/\s+/g, " ").trim().split(" ");
				const tag  = data[0];
				const attr = data.slice(1).join(" ");
				const elem = this.pattern().replace(/\?+/g, tag);
				this._tree.push(tag);
				this._data.push(attr === "" ? `<${elem}>` : `<${elem} ${attr}>`);
				return this;
			}
		},
		/**. '{self close()}: Fecha o último nível aberto.**/
		close: {
			value: function() {
				const elem = this.pattern().replace(/\?+/g, this.level);
				this._data.push("</"+elem+">");
				this._tree.pop();
				return this;
			}
		},
		/**. '{self append(string name, string chars)}: Aplica o método '{open} e '{close} em sequência inserido o conteúdo de '{chars}.**/
		append: {
			value: function(name, chars) {
				return this.open(name).add(chars).close();
			}
		},
		/**. '{self finish()}: Fecha todos os níveis abertos.**/
		finish: {
			value: function() {
				while (this.level !== null) this.close();
				return this;
			}
		},
		/**. '{self walkTo(integer level)}: Fechar todos os níveis até o nível informado em i{level}, salvando o caminho para restauração através do método i{backTo}.**/
		walkTo: {
			value: function(level) {
				const check = __Type(level);
				if (check.integer && !check.negative && check.value < this._tree.length) {
					this._save = this._tree.slice();
					while (this._tree.length > check.value) this.close();
				}
				return this;
			}
		},
		/**. '{self backTo()}: Reabre os caminhos fechados em i{walkTo}.**/
		backTo: {
			value: function() {
				if (this._tree.length < this._save.length) {
					for (let i = this._tree.length; i < this._save.length; i++)
						this.open(this._save[i], "");
					this._save = [];
				}
				return this;
			}
		},
		/**. '{string toString()}: Retorna o conteúdo textual da árvore.**/
		toString: {
			value: function() {
				return __HTML("pre", {innerHTML: this._data.join("")}).innerText;
			}
		},
		/**. '{string valueOf()}: Retorna a estrutura (HTML) da árvore.**/
		valueOf: {value: function() {return this._data.join("");}}
	});

/*----------------------------------------------------------------------------*/
	/**#4 Transformação de Dados
	''constructor object __Parser(any input)''
	Construtor para transformação de dados. Os dados de entrada são informados no argumento '{input}. Se a transformação falhar, os atributos retornarão nulo. Todos as propriedades retornam uma nova instância do objeto i{__Parser} com o resultado da transformação anterior com o objetivo de fazê-las em cadeia. Utilize o método i{get} ao fim das trasformações para obter seu valor.**/
	function __Parser(input) {
		if (!(this instanceof __Parser)) return new __Parser(input);
		const check = new __Type(input);
		Object.defineProperties(this, {
			_data:  {value: input},
			_check: {value: check},
			_saved: {value: {}},
			_table: {value: check.instanceOf("HTMLTableElement")}
		});
	}

	Object.defineProperties(__Parser.prototype, {
		constructor: {value: __Parser},
		/**. '{object csvTable}: Transforma string [CSV]<https://www.rfc-editor.org/rfc/rfc4180> em tabela HTML.**/
		csvTable: {
			get: function() {
				if ("csvTable" in this._saved)
					return new __Parser(this._saved.csvTable);
				let data = null;
				if (this._check.chars) {
					const tree = new __Tree();
					const text = this._data.replace(/\r\n/g, "\n");
					const code = text.split("");
					const rows = text.trim().split("\n").length;
					const cols = /[\ \,\;\t\|]/;
					let    col = null;
					let  lines = 0;
					tree.open("table").open("thead").open("tr");
					code.forEach(function(v,i,a) {
						const tag = tree.level;
						/*-- células entre aspas --*/
						if (tag === "span") {
							if (v === "'" && a[i+1] === "'") {
								a[i+1] = "";
								tree.add("\"");
							} else if (v === "\"") {
								tree.close();
								if (col === null && a[i+1] !== "\n") col = a[i+1];
							} else {
								tree.add(v)
							}
						}
						/*-- células descrição ou de cabeçalho --*/
						else if (tag === "td" || tag === "th") {
							if (v === "\n") {
								if (lines === 0) {
									tree.close().close().close().open("tbody").open("tr");
								} else if (lines < (rows - 1)) {
									tree.close().close().open("tr");
								}
								lines++;
							} else if (col === null && cols.test(v)) { /*-- capturando separador de célula --*/
								col = v;
								tree.close()
							} else if (col === v) { /*-- encerrando célula --*/
								tree.close();
							} else {
								tree.add(v);
							}
						}
						/*-- linhas --*/
						else if (tag === "tr") {
							if (v === "\n") {
								if (lines === 0) {
									tree.close().close().open("tbody").open("tr");
								} else if (lines < (rows - 1)) {
									tree.close().open("tr");
								}
								lines++;
							} else if (v === "\"") {
								tree.open(lines === 0 ? "th" : "td").open("span");
							} else {
								tree.open(lines === 0 ? "th" : "td").add(v);
							}
						}
					});
					tree.finish();
					data = __HTML("div", {innerHTML: tree.valueOf()}).children[0];
				}
				this._saved["csvTable"] = data;
				return this.csvTable;
			}
		},
		/**. '{object tableMatrix}: Transforma tabela HTML em matriz 2x2.**/
		tableMatrix: {
			get: function() {
				if ("tableMatrix" in this._saved)
					return new __Parser(this._saved.tableMatrix);
				let data = null;
				if (this._table) {
  				const matrix = Array.prototype.slice.call(this._data.rows);
					for (let i = 0; i < matrix.length; i++)
					  matrix[i] = Array.prototype.slice.call(matrix[i].cells);
					data = matrix;
				}
				this._saved["tableMatrix"] = data;
				return this.tableMatrix;
			}
		},
		/**. '{object tableValues}: Igual à propriedade '{tableMatrix}, mas exibindo os valores das células.**/
		tableValues: {
			get: function() {
				if ("tableValues" in this._saved)
					return new __Parser(this._saved.tableValues);
				let data = this.tableMatrix.get();
				if (data !== null) {
  				for (let i = 0; i < data.length; i++)
  					for (let j = 0; j < data[i].length; j++)
  						data[i][j] = data[i][j].innerText;
				}
				this._saved["tableValues"] = data;
				return this.tableValues;
			}
		},
		/**. '{object matrixCSV}: Transforma uma matriz em string CSV.**/
		matrixCSV: {
			get: function() {
				if ("matrixCSV" in this._saved)
					return new __Parser(this._saved.matrixCSV);
				let data = null;
				if (this._check.array) {
					try {
						const csv = [];
						this._data.forEach(function (row,i,a) {
							csv.push([]);
							row.forEach(function (col,j,b) {
								let text = String(col).replace(/\"/g, "''");
								csv[i].push("\"" + text + "\"");
							});
							csv[i] = csv[i].join(",");
						});
						data = csv.join("\r\n");
					} catch(e) {}
				}
				this._saved["matrixCSV"] = data;
				return this.matrixCSV;
			}
		},
		/**. '{object matrixList}: Transforma uma matriz em uma lista de objetos.**/
		matrixList: {
			get: function() {
				if ("matrixList" in this._saved)
					return new __Parser(this._saved.matrixList);
				let data = null;
				if (this._check.array) {
					try {
						const object = [];
						let   title  = null;
						this._data.forEach(function (row,i,a) {
							if (!__Type(row).array) return;
							if (title === null) {
								title = row;
								return;
							}
							let item = {};
							row.forEach(function(value,j,b) {
								let name = j < title.length ? title[j] : "#"+j;
								item[name] = value;
							});
							object.push(item)
						});
						data = object;
					} catch(e) {}
				}
				this._saved["matrixList"] = data;
				return this.matrixList;
			}
		},
		/**. '{object stringJSON}: Transforma string JSON em objeto.**/
		stringJSON: {
			get: function() {
				if ("stringJSON" in this._saved)
					return new __Parser(this._saved.stringJSON);
				let data = null;
				if (this._check.chars) {
					try {data = JSON.parse(this._data);} catch(e) {}
				}
				this._saved["stringJSON"] = data;
				return this.stringJSON;
			}
		},
		/**. '{object jsonString}: Transforma objeto em string JSON.**/
		jsonString: {
			get: function() {
				if ("jsonString" in this._saved)
					return new __Parser(this._saved.jsonString);
				let data = null;
				try {data = JSON.stringify(this._data);} catch(e) {}
				this._saved["jsonString"] = data;
				return this.jsonString;
			}
		},
		/**. '{object stringHTML}: Transforma string em documento HTML.**/
		stringHTML: {
			get: function() {
				if ("stringHTML" in this._saved)
					return new __Parser(this._saved.stringHTML);
				let data = null;
				if (this._check.chars) {
					try {
						let parser = new DOMParser();
						data = parser.parseFromString(this._data, "text/html");
					} catch(e) {}
				}
				this._saved["stringHTML"] = data;
				return this.stringHTML;
			}
		},
		/**. '{object stringXML}: Transforma string em documento XML.**/
		stringXML: {
			get: function() {
				if ("stringXML" in this._saved)
					return new __Parser(this._saved.stringXML);
				let data = null;
				if (this._check.chars) {
					try {
						let parser = new DOMParser();
						data = parser.parseFromString(this._data, "application/xml");
					} catch(e) {}
				}
				this._saved["stringXML"] = data;
				return this.stringXML;
			}
		},
		/**. '{object stringSVG}: Transforma string em documento SVG.**/
		stringSVG: {
			get: function() {
				if ("stringSVG" in this._saved)
					return (this._saved.stringSVG);
				let data = null;
				if (this._check.chars) {
					try {
						let parser = new DOMParser();
						data = parser.parseFromString(this._data, "image/svg+xml");
					} catch(e) {}
				}
				this._saved["stringSVG"] = data;
				return this.stringSVG;
			}
		},
		/**. '{object arrayWD}: Transforma array de objetos em notação wd.**/
		arrayWD: {
			get: function() {
				if ("arrayWD" in this._saved)
					return new __Parser(this._saved.arrayWD);
				let data = null;
				try {
					if (this._check.array) {
						function parse(value, save, root) {
							const check = new __Type(value);
							/*--------------------------------------------------------------*/
							if (check.chars) {
								let item = value.replace(/\'/g, "''");
								save.push(`'${item}'`);
							}
							/*--------------------------------------------------------------*/
							else if (check.regexp) {
								save.push(value.toString());
							}
							/*--------------------------------------------------------------*/
							else if (check.function) {
								save.push(`(${value.name})`);
							}
							/*--------------------------------------------------------------*/
							else if (check.array) {
								save.push(root === true ? "" : "[");
								for (let i = 0; i < value.length; i++) {
									let test = root === true ? new __Type(value[i]) : {object: false};
									if (root === true && !test.object)
										throw new Error("Item is not an object.");
									save.push(i > 0 ? "," : "");
									save = parse(value[i], save, false);
								}
								save.push(root === true ? "" : "]");
							}
							/*--------------------------------------------------------------*/
							else if (check.object) {
								const re = /^([a-z0-9_\-]+|\$\$?)$/i;
								let    n = 0;
								save.push("{");
								for (let i in value) {
									let name = i.trim();
									if (!re.test(name)) throw new Error("Invalid property name.");
									save.push((n++ === 0 ? "" : ";")+name+":");
									if (name === "$" || name === "$$") {
										let test = new __Type(value[i]);
										let node = test.node ? test.value : null;
										if (node === null) throw new Error("Invalid property value.");
										save.push("'");
										for (let j = 0; j < node.length; j++) {
											let id  = "#"+node[j].id.trim();
											let tag = node[j].tagName.toLowerCase();
											let css = node[j].className.trim().replace(/\s+/g, ".");
											save.push(j > 0 ? "," : "");
											save.push(id !== "#" ? id : (tag + (css === "" ? "" : ".") + css));
										}
										save.push("'");
									}
									else {
										save = parse(value[i], save, false);
									}
								}
								save.push("}");
							}
							/*--------------------------------------------------------------*/
							else {
								save.push(String(value));
							}
							/*--------------------------------------------------------------*/
							return save;
						};
						/*----------------------------------------------------------------*/
						const note = parse(this._data, [], true);
						data = note.join("");
					}
				} catch(e) {console.log(e.message);}
				this._saved["arrayWD"] = data;
				return this.arrayWD;
			}
		},
		/**. '{object wdArray}: Transforma notação wd em um array de objetos semelhante a notação JSON exceto pelo seguinte:
		- o nome das propriedades do objeto não contem aspas e são compostos de caracteres alfanuméricos, traços e sublinhados;
		- por padrão, todos os valores são strings, exceto números, i{null}, i{true} e i{false}.
		- strings são delimitadas por aspas simples;
		- a aspa simples dentro da string é representada por duas aspas simples em sequência;
		- são permitidos como valores expressões regulares, seletores CSS de elementos e funções do escopo de window;
		- valores inválidos ou vazios para expressões regulares, seletores CSS e funções assumem o valor nulo;
		- a notação para expressão regular é semelhante à primitiva, os escapes devem ser duplos;
		- para referenciar função, definidas com i{var} ou i{function}, informe seu nome entre parenteses;
		- seletores CSS são alocados entre parênteses com os símbolos $ (elemento) ou $$ (lista) antecedendo a abertura;
		- se o array principal conter apenas um objeto, não é preciso adicionar as chaves inicial e final do objeto.
		. É possível referenciar um array de objetos no escopo de window informando o caractere # seguido do nome da variável.**/
		wdArray: {
			get: function() {
				if ("wdArray" in this._saved)
					return new __Parser(this._saved.wdArray);
				let data = null;
				try {
					if (this._check.string) {
						const note = this._data.normalize().trim();
						/*-- Referência para uma variável --------------------------------*/
						if ((/^\#.+$/).test(note)) {
							let list  = window[note.replace("#", "")];
							let check = new __Type(list);
							if (!check.array) throw new Error("Array not found.");
							for (let i = 0; i < list.length; i++) {
								let test = new __Type(list[i]);
								if (!test.object) throw new Error("Invalid item.");
							}
							this._saved["wdArray"] = list;
							return this.wdArray;
						}
						/*-- Ajustando o código e definindo verificações -----------------*/
						const code = [
							note[0]        === "{" ? "[" : "[{",
							note,
							note.slice(-1) === "}" ? "]" : "}]"
						].join("").split("");
						const last = code.length;
						let tag, val, txt;
						let find, rate, walk, name, test;
						let index = 0, count = 0;
						const tree = new __Tree();
						tree.xml = true;
						tree.open("wd");
						/*-- Circulando pelo código --------------------------------------*/
						while (index < last) {
							if (++count > 2*last) throw new Error("Many recursions.");
							val = code[index];
							tag = tree.level;
							txt = code.slice(index).join("");
							/*-- Tag externa (array) ---------------------------------------*/
							if (tag === "wd") {
								if (index === 0)
									tree.add("[").open("array");
								else
									tree.close();
								index += index === 0 ? 1 : last;
							}
							/*-- Array -----------------------------------------------------*/
							else if (tag === "array") {
								let reItem = /^\s*(\S)/;
								let reNext = /^\s*(\,\s*\]|\,|\])/;
								rate = null;
								if (reNext.test(txt)) {
									find = txt.match(reNext);
									rate = find[0].trim().slice(-1);
									walk = find[0].length;
								}
								else if (reItem.test(txt)) {
									find = txt.match(reItem);
									rate = find[0].trim();
									walk = find[0].length;
								}
								switch(rate) {
									case null: {throw new Error("wdArray - invalid array notation.");}
									case ",": {tree.add(", "); break;}
									case "]": {tree.close().add("]"); break;}
									case "[": {tree.add("[").open("array");  break;}
									case "{": {tree.add("{").open("object"); break;}
									case "/": {tree.open("regexp");   walk--; break;}
									case "'": {tree.open("string");   walk--; break;}
									case "(": {tree.open("function"); walk--; break;}
									case "$": {tree.open("node");     walk--; break;}
									default:  {tree.open("item");     walk--;}
								}
								index += walk;
							}
							/*-- Object ----------------------------------------------------*/
							else if (tag === "object") {
								let reName = /^\s*([a-z0-9_\-]+)\s*\:\s*(\S)/i;
								let reNext = /^\s*(\,\s*\}|\,|\})/;
								rate = null;
								if (reNext.test(txt)) {
									find = txt.match(reNext);
									rate = find[0].trim().slice(-1);
									walk = find[0].length;
								}
								else if (reName.test(txt)) {
									find = txt.match(reName);
									name = find[0].replace(reName, "$1");
									rate = find[0].replace(reName, "$2");
									walk = find[0].length;
									tree.add(`"${name}": `);
								}
								switch(rate) {
									case null: {throw new Error("wdArray - invalid object notation.");}
									case ",":  {tree.add(", "); break;}
									case "}":  {tree.close().add("}"); break;}
									case "{":  {tree.add("{").open("object"); break;}
									case "[":  {tree.add("[").open("array");  break;}
									case "/":  {tree.open("regexp");   walk--; break;}
									case "'":  {tree.open("string");   walk--; break;}
									case "(":  {tree.open("function"); walk--; break;}
									case "$":  {tree.open("node");     walk--; break;}
									default:   {tree.open("value");    walk--;}
								}
								index += walk;
							}
							/*-- Item (array) ou Value (object) ----------------------------*/
							else if (tag === "value" || tag === "item") {
								let lang = /^(true|false|null)$/;
								let div  = tag === "item" ? /^[^,\]]+/ : /^[^,}]+/;
								find = txt.match(div);
								rate = find === null ? null : find[0].trim();
								test = new __Type(rate);
								walk = find === null ? last : find[0].length;
								test = new __Type(rate);
								if (rate === null)
									throw new Error(`object: undefined ${tag} data.`);
								else if (test.finite)
									tree.add(test.toString()).close(tag);
								else if (lang.test(rate))
									tree.add(rate).close(tag);
								else
									tree.add(JSON.stringify(`${rate}`)).close(tag);
								index += walk;
							}
							/*-- Function --------------------------------------------------*/
							else if (tag === "function") {
								let reName = /^\(([^)]+)\)/;
								find = txt.match(reName);
								rate = find === null ? null : find[0].replace(reName, "$1").trim();
								walk = find === null ? last : find[0].length;
								if (rate === null)
									throw new Error("wdArray - invalid function notation.");
								else
									tree.add(JSON.stringify(`@function:${rate}`)).close();
								index += walk;
							}
							/*-- String ----------------------------------------------------*/
							else if (tag === "string") {
								rate = [];
								find = false;
								while(++index < last && !find) {
									if (code[index] === "'") {
										if (code[index+1] !== "'")
											find = true;
										else
											rate.push(code[++index]);
									}
									else {
										rate.push(code[index]);
									}
								}
								tree.add(JSON.stringify(rate.join(""))).close();
							}
							/*-- RegExp ----------------------------------------------------*/
							else if (tag === "regexp") {
								rate = [];
								find = false;
								let flag, char, scape, prop, text, open = 0;
								while(++index < last && !find) {
									char  = code[index];
									scape = code[index-1] === "\\";
									if (!scape && open < 1 && char === "[")
										open++;
									else if (!scape && open > 0 && char === "]")
										open--;
									else if (!scape && open < 1 && char === "/")
										find = true;
									if (!find) rate.push(char);
								}
								flag = code.slice(index).join("").match(/^[gim]*/);
								prop = {re: rate.join(""), flag: flag === null ? "" : flag[0]};
								text = `@regexp(${prop.flag}):${prop.re}`;
								tree.add(JSON.stringify(text)).close();
								index += prop.flag.length;
							}
							/*-- Nodes ----------------------------------------------------*/
							else if (tag === "node") {
								let reNode = /^\$\$?\(/;
								/*-- não inicia no formato $( ou $$( - retorna para item ou value --*/
								if (!reNode.test(txt)) {
									tree.close();
									tree.open(tree.level === "array" ? "item" : "value");
								}
								else {
									let all = txt.slice(0,2) === "$$";
									rate    = [];
									find    = 1;
									index  += all ? 2 : 1;
									let char, str = false;
									while(++index < last && find > 0) {
										char = code[index];
										if (!str) {
											str   = char === "'";
											find += char === "(" ? 1 : (char === ")" ? -1 : 0);
											rate.push(str ? "\"" : (find > 0 ? char : ""));
										}
										else {
											str = char !== "'";
											rate.push(!str ? "\"" : char);
										}
									}
									let query = all ?  "nodes" : "node";
									tree.add(JSON.stringify(`@${query}:${rate.join("")}`)).close();
								}
							}
						}

						/*--------------------------------------------------------------*/
						tree.finish();
						let json = JSON.parse(tree.toString());
						/*--------------------------------------------------------------*/
						const parse = function(item) {
							const check = new __Type(item);
							if (check.array) {
								for (let i = 0; i < item.length; i++)
									item[i] = parse(item[i]);
							}
							else if (check.object) {
								for (let i in item)
									item[i] = parse(item[i]);
							}
							else if (check.string) {
								let reExtra = {
									function: /^\@function\:(.*)$/,
									regexp:   /^\@regexp\(([gim]*)\)\:(.*)$/,
									node:     /^\@(nodes?)\:(.*)$/
								};
								if (reExtra.function.test(item)) {
									let name   = item.replace(reExtra.function, "$1");
									let method = typeof window[name] === "function";
									item = method ? window[name] : null;
								}
								else if (reExtra.regexp.test(item)) {
									let main = item.replace(reExtra.regexp, "$2");
									let flag = item.replace(reExtra.regexp, "$1");
									try      {item = new RegExp(main, flag);}
									catch(e) {item = null;}
								}
								else if (reExtra.node.test(item)) {
									let len  = item.replace(reExtra.node, "$1");
									let css  = item.replace(reExtra.node, "$2");
									let name = len === "nodes" ? "querySelectorAll" : "querySelector";
									try      {item = document[name](css);}
									catch(e) {item = null;}
									let test = new __Type(item);
									item = test.node && test.value.length > 0 ? item : null;
								}
							}
							return item;
						};
						data = parse(json);
					}
				}
				catch(e) {
					const msg = `wdArrayError: ${this._data}`;
					__UNDERMAINTENANCE ? console.error(e) : console.info(msg);
				}
				this._saved["wdArray"] = data;
				return this.wdArray;
			}
		},
		/**. '{object fileURL}: Transforma dados em string URL.**/
		fileURL: {
			get: function() {
				if ("fileURL" in this._saved)
					return new __Parser(this._saved.fileURL);
				let data = null;
				try {
					if (this._check.instanceOf("Blob") || this._check.instanceOf("File"))
						data = URL.createObjectURL(this._data);
				} catch(e) {}
				this._saved["fileURL"] = data;
				return this.fileURL;
			}
		},
		/**. '{object dataBlob}: Transforma dados em objeto Blob.**/
		dataBlob: {
			get: function() {
				if ("dataBlob" in this._saved)
					return new __Parser(this._saved.dataBlob);
				let data = null;
				try {
					const opt = {type: this._check.chars ? "text/plan" : "application/octet-stream"};
					data = new Blob([this._data], opt);
				} catch(e) {console.log(e);}
				this._saved["dataBlob"] = data;
				return this.dataBlob;
			}
		},
		/**. '{any get()}: Obtem o valor da transformação ou de entrada.**/
		get: {
			value: function() {return this._data;}
		},
		//FIXME não funciona, tem que estar fora de um objeto
		/**. '{void mixin(object supplier, array exceptions)}: Cópia as propriedades do __objeto__ definido em '{supplier} para o __objeto__ de entrada, exceto aquelas propriedades listadas em '{exceptions}.**/
		mixin: {
			value: function(supplier, exceptions) {
				if (!this.check.object) return;
				if (!__Type(supplier).object) return;
				if (!__Type(exceptions).array) exceptions = [];
				const names = Object.getOwnPropertyNames(supplier);
				for (let name of names) {
					if (exceptions.indexOf(name) < 0) {
						let desc = Object.getOwnPropertyDescriptor(supplier, name);
						Object.defineProperty(this.get, name, desc);
					}
				}
				return;
			}
		},
		/**. '{object wdComment(string open, string close)}: Segrega o código fonte do conteúdo definido entre os caracteres '{open} e '{close}. Retorna um objeto com as propriedades i{src} (código fonte), i{doc} (conteúdo segregado) e i{html} (documento HTML montado a partir do conteúdo segregado).**/
		wdComment: {
			value: function(open, close) {
				if (!this._check.string) return null;
				open  = open  === undefined ? "//" : String(open).normalize();
				close = close === undefined ? "\n" : String(close).normalize();
				const src  = [];
				const doc  = [];
				const data = this._data.trim().normalize();
				const list = data.split("");
				let txt, end, index = 0, type = "src";
				/*-- separar código e comentários ------------------------------------*/
				while (index < list.length) {
					end = index + (type === "src" ? open.length : close.length);
					txt = data.slice(index, end);
					if (type === "src" && txt === open) {
						src.push("\n");
						type  = "doc";
						index = end;
					}
					else if (type === "doc" && txt === close) {
						doc.push("\n");
						type = "src";
						index = end;
					}
					else {
						type === "doc" ? doc.push(data[index]) : src.push(data[index]);
						index++;
					}
				}
				return {
					src:  src.join("").replace(/\n+/g, "\n"),
					doc:  doc.join(""),
					get html() {return new __Parser(this.doc).wdDoc.get();}
				};
			}
		},
		/**. '{string wdDoc}: Transforma os dados segregados do método '{wdComment} em notação HTML (tag main) adotando as seguintes regras de notação:
		|Element|Tipo|Ocorrência|Descrição|
		|Citação|Bloco|Parágrafo|Inicia e termina com duas aspas duplas.|
		|Código|Bloco|Parágrafo|Inicia e termina com duas aspas simples.|
		|Tabela|Bloco|Linha|Inicia, termina e separa células com barra vertical, a primeira linha é o cabeçalho.|
		|Lista|Bloco|Linha|Inicia com "- " seguido do conteúdo.|
		|Descrição|Bloco|Linha|Inicia com ". " seguido do conteúdo.|
		|Títulos|Bloco|Linha|Inicia com "#0-6 " seguido do conteúdo.|
		|Mídia|Bloco|Linha|Inicia com "@MIMETYPE " seguido do link entre os caracteres "< >" e o texto em caso de falha.|
		|Parágrafo|Bloco|Linha|Quando não seguir as regras anteriores.|
		|Formatação|Em linha|Conteúdo|Nome da tag HTML seguindo do conteúdo limitado pelos caracteres "{ }".|
		- Se a descrição conter um caractere ":" intermediário, a parte anterior será título (dt) e a posterior a descrição (dd);
		- O número do título indica seu tipo, o valor zero cria um menu referenciando os títulos do tipo 3 a 5;
		- O valor MIMETYPE deve ser alterado conforme o tipo de arquivo a ser carregado;
		- A tag HTML i{code} pode ser abreviada por um caracteres de aspas simples;
		- Atributos de elementos em linha são informados após o caracter "}" delimitado por colchetes "[attr]" (opcional); e
		- Não é possível efetuar formatações dentro do conteúdo dos elementos em linha.**/
		wdDoc: {
			get: function() {
				if ("wdDoc" in this._saved)
					return new __Parser(this._saved.wdDoc);
				let data = null;
				try {
					if (this._check.string) {
						const menu = new __Tree();
						const note = this._data.trim().normalize();
						const code = note.split("\n");
						const tree = new __Tree();
						const type = {
							/*-- blocos múltiplas linhas --*/
							quote: /^(\"\")(.+)/,
							pre:   /^(\'\')(.+)/,
							/*-- blocos de consistência --*/
							table: /^\|(.+)\|$/,
							ul:    /^(\-)\s+(.+)$/,
							dl:    /^(\.)\s+(.+)$/,
							/*-- blocos de linha única --*/
							head:  /^\#([0-6])\s+(.+)$/,
							media: /^\@([a-z/]+)\s+\<([^>]+)\>(.*)$/i,
						};
						/*-- função para elementos inline --*/
						function inline(tree, input) {
							const code = input.split("");
							const find = /^([a-z\-0-9]+|\')\{([^}]+)\}(\[[^\]]+\])?/i;
							let txt, val, tag, index = 0;
							while (index < code.length) {
								tag = tree.level;
								txt = code.slice(index).join("");
								val = code[index];
								if (find.test(txt)) {
									let base = txt.match(find)[0];
									let elem = base.replace(find, "$1");
									let text = base.replace(find, "$2");
									let attr = base.replace(find, "$3").replace(/^\[/, "").replace(/\]$/, "");
									if (elem === "'") elem = "code";
									tree.open(`${elem} ${attr}`).add(text).close();
									index += base.length;
								} else {
									tree.add(val);
									index++
								}
							}
							return;
						};
						/*----------------------------------------------------------------*/
						let tag, txt, key, index = 0, title = -1;
						tree.xml = true;
						while (index < code.length) {
							tag = tree.level;
							txt = code[index].trim();
							key = null;
							for (let i in type)
								if (key === null && type[i].test(txt)) key = i;
							/*--------------------------------------------------------------*/
							if (tag === null) {
								switch(key) {
									/*-- blocos de consistência --*/
									case "table": {tree.open("table");      break;}
									case "ul":    {tree.open("ul");         break;}
									case "dl":    {tree.open("dl");         break;}
									/*-- blocos múltiplas linhas --*/
									case "pre":   {code[index] = txt.slice(2); tree.open("pre");        break;}
									case "quote": {code[index] = txt.slice(2); tree.open("blockquote"); break;}
									/*-- blocos de linha única --*/
									case "head":  {
										let head = Number(txt.replace(type.head, "$1"));
										let text = txt.replace(type.head, "$2").trim();
										let href = `head_${++title}`;
										if (head === 0)
											tree.open(`h3`).add(text).close().
											open("menu").add("%MENUITEM%").close();
										else
											tree.open(`h${head} id="${href}"`).add(text).close();
										if (head > 2 && head < 6)
											menu.open("li").add((". . . . ").repeat(head - 3))
											.open(`a href="#${href}"`).add(text).close().close();
										index++;
										break;
									}
									case "media":  {
										/^\@(image|audio|video)\s+\<([^>]+)\>(.*)$/
										let mime = txt.replace(type.media, "$1");
										let data = txt.replace(type.media, "$2");
										let text = txt.replace(type.media, "$3");
										tree.open(`object type="${mime}" data="${data}"`).add(text).close();
										index++;
										break;
									}
									default: {
										if (txt !== "")
											tree.open("p").add(inline(tree, txt)).close();
										index++;
									}
								}
							}
							/*--------------------------------------------------------------*/
							else if (tag === "table") {
								let th = txt.replace(type.table, "$1").split("|");
								tree.open("thead").open("tr");
								for (let i = 0; i < th.length; i++)
									tree.open("th").add(inline(tree, th[i])).close();
								tree.close().close().open("tbody");
								index++;
							}
							/*--------------------------------------------------------------*/
							else if (tag === "tbody") {
								if (key !== "table") {
									tree.close().close();
								}
								else {
									let td = txt.replace(type.table, "$1").split("|");
									tree.open("tr");
									for (let i = 0; i < td.length; i++)
										tree.open("td").add(inline(tree, td[i])).close();
									tree.close();
									index++;
								}
							}
							/*--------------------------------------------------------------*/
							else if (tag === "dl") {
								if (key !== "dl") {
									tree.close();
								}
								else {
									let re = /^([^:]+)\:(.+)$/;
									let dl = txt.replace(type.dl, "$2").trim();
									let dt = re.test(dl) ? dl.replace(re, "$1").trim() : null;
									let dd = re.test(dl) ? dl.replace(re, "$2").trim() : dl;
									if (dt !== null)
										tree.open("dt").add(inline(tree, dt)).close();
									tree.open("dd").add(inline(tree, dd)).close();
									index++;
								}
							}
							/*--------------------------------------------------------------*/
							else if (tag === "ul") {
								if (key !== "ul") {
									tree.close();
								} else {
									let li = txt.replace(type.ul, "$2");
									tree.open("li").add(inline(tree, li)).close();
									index++;
								}
							}
							/*--------------------------------------------------------------*/
							else if (tag === "pre") {
								let re  = /(\'\')$/;
								let end = re.test(txt);
								let pre = end ? txt.replace(re, "") : txt;
								tree.add(pre).add(end ? "" : "\n");
								if (end) tree.close();
								index++;
							}
							/*--------------------------------------------------------------*/
							else if (tag === "blockquote") {
								let re    = /(\"\")$/;
								let end   = re.test(txt);
								let quote = end ? txt.replace(re, "") : txt;
								tree.open("p").add(inline(tree, quote)).close();
								if (end) tree.close();
								index++;
							}
							else throw new Error("tag not found.")
						}
						tree.finish();
						menu.finish();
						data = tree.valueOf().replace("<menu>%MENUITEM%</menu>", `<menu>${menu.valueOf()}</menu>`);
					}
				}
				catch(e) {
					console.info(e)
				}
				this._saved["wdDoc"] = data;
				return this.wdDoc;
			}
		}
	});

/*============================================================================*/
	/**#3 Manipulando HTML
	#4 Tipos de Dispositivo
	''const object __DEVICE''
	Checa alterações da tela atribuida a um tipo de dispositivo.**/
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

/*----------------------------------------------------------------------------*/
	/**#4 Ancoragem para Elementos Fixos
	''const object __HASH''
	Ajusta margens e posição do elementos ancorados na tela.**/
	const __HASH = {
		/**. '{array fixed}: Retorna uma lista de nós com posicionamento fixo a '{body}.**/
		get fixed() {
			const css   = "body > :not([data-js-wd-window])";
			const query = Array.prototype.slice.call(document.querySelectorAll(css));
			return query.filter(function(node,i,a) {
				const style = window.getComputedStyle(node, null);
				return style.position === "fixed";
			});
		},
		/**. '{array full}: Retorna uma lista de objetos contendo dados ('{top bottom left right width height}) dos nós fixos caso eles ocupem completamente alguma das laterais de '{body}. A propriedade '{side} indicará o lateral ocupada.**/
		get full() {
			const width  = window.innerWidth;
			const height = window.innerHeight;
			const list   = [];
			this.fixed.forEach(function(node,i,a) {
				const data = node.getBoundingClientRect();
				/*-- horizontal --*/
				if (data.left === 0 && data.right === width)
					data.side = data.top === 0 ? "top" : (data.bottom === height ? "bottom" : null);
				/*-- vertical --*/
				else if (data.top === 0 && data.bottom === height)
					data.side = data.left === 0 ? "left" : (data.right === width ? "right" : null);
				if (data.side !== null) list.push(data);
			});
			return list;
		},
		/**. '{object max}: Retorna os maiores dados encontrados para cada lateral ocupada completamente advinda de '{full}.**/
		get max() {
			const size = {top: 0, bottom: 0, left: 0, right: 0};
			const look = {top: "height", bottom: "height", left: "width", right: "width"};
			const data = {top: null, bottom: null, left: null, right: null};
			this.full.forEach(function(item,i,a) {
				if (item[look[item.side]] > size[item.side]) {
					size[item.side] = item[look[item.side]];
					data[item.side] = item;
				}
			});
			return data;
		},
		/**. '{void handleEvent(object ev)}: Disparador do objeto chamado durante os eventos '{resize}, '{hashchange} e '{wdreload}.**/
		handleEvent: function(ev) {
			const data = this.max;
			const body = window.getComputedStyle(document.body, null);
			const side = {marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0};
			/*-- obter dados das margnes de body --*/
			for (let i in side)
				side[i] = Number(body[i].replace(/\D+$/, ""));
			/*-- acertar margens de body --*/
			for (let i in data) {
				if (data[i] !== null) {
					if      (i === "top"    && data[i].height > side.marginTop)
						document.body.style.marginTop    = `${data[i].height}px`;
					else if (i === "bottom" && data[i].height > side.marginBottom)
						document.body.style.marginBottom = `${data[i].height}px`;
					else if (i === "left"   && data[i].width  > side.marginLeft)
						document.body.style.marginLeft   = `${data[i].width}px`;
					else if (i === "right"  && data[i].width  > side.marginRight)
						document.body.style.marginRight  = `${data[i].width}px`;
				}
			}
			/*-- acertar posicionamento do hash --*/
			if ((ev.type === "wdreload" || ev.type === "hashchange") && data.top !== null) {
				const hash  = window.location.hash;
				const query = hash === "" ? null : document.querySelector(hash);
				if (query !== null) {
					window.scrollTo(0, query.offsetTop - side.marginTop);
				}
			}
			return;
		}
	};

/*----------------------------------------------------------------------------*/
	/**#4 Tipos de Formulários
	''const object __FTYPES''
	Define os tipos de campos de formulário com a respectiva função para obter ou definir valor:
	- Campos numéricos são definidos por números finitos (string ou number) e retornam valores numéricos.
	- Campos de checagem e opção retornam o valor do atributo, se checados ou selecionados, ou nulo.
	- Campos de checagem e opção podem ser definido por valores booleanos para definir o estado da checagem ou seleção.
	- Campos múltiplos podem ser definidos como array e obtidos como array, se houver mais de um valor habilitado.
	- Campos de data e tempo são definidos conforme tipo e definição da biblioteca.
	- O campo "datetime" aceita qualquer propriedade de data ou tempo independente do período.
	- O campo "file" retorna o objeto '{File}, se simples, e '{FileList}, se múltiplo.
	- Os valores dos campos "url" e "email" devem estar no respectivo formato para serem definidos ou retornados.
	- O campo "color" pode ser definido por um número inteiro, por uma lista com os valores (0-255) de RGB, nessa ordem, ou por um objeto contendo os valores das propriedades i{red}, i{green}, i{blue}.
		- Outros elementos retornam ou definem o valor da propriedade ou atributo.**/
	const __FTYPES = {
		button:   function(node, value) {return this.text(node, value);},
		reset:    function(node, value) {return this.text(node, value);},
		submit:   function(node, value) {return this.text(node, value);},
		image:    function(node, value) {return this.text(node, value);},
		password: function(node, value) {return this.text(node, value);},
		hidden:   function(node, value) {return this.text(node, value);},
		search:   function(node, value) {return this.text(node, value);},
		tel:      function(node, value) {return this.text(node, value);},
		output:   function(node, value) {return this.text(node, value);},
		textarea: function(node, value) {return this.text(node, value);},
		range:    function(node, value) {return this.number(node, value);},
		meter:    function(node, value) {return this.number(node, value);},
		progress: function(node, value) {return this.number(node, value);},
		checkbox: function(node, value) {return this.radio(node, value);},
		text:     function(node, value) {
			if (value !== undefined)
				node.value = value;
			if (value === null)
				node.removeAttribute("value");
			return node.value;
		},
		number:   function(node, value) {
			const read = value === undefined;
			const data = new __Type(read ? this.text(node) : value);
			const fail = !data.finite;
			if (read)  return fail ? "" : data.value;
			if (!fail) this.text(node, data.value);
			return this.number(node);
		},
		date:     function(node, value) {
			const read = value === undefined;
			const data = __DATETIME.test(read ? this.text(node) : value);
			const fail = data === null || data.type !== "date";
			if (read)  return fail ? "" : data.form;
			if (!fail) this.text(node, data.form);
			return this.date(node);
		},
		time:     function(node, value) {
			const read = value === undefined;
			const data = __DATETIME.test(read ? this.text(node) : value);
			const fail = data === null || data.type !== "time";
			if (read)  return fail ? "" : data.form;
			if (!fail) this.text(node, data.form);
			return this.time(node);
		},
		month:    function(node, value) {
			const read = value === undefined;
			const data = __DATETIME.test(read ? this.text(node) : value);
			const fail = data === null || data.type !== "month";
			if (read)  return fail ? "" : data.form;
			if (!fail) this.text(node, data.form);
			return this.month(node);
		},
		week:     function(node, value) {
			const read = value === undefined;
			const data = __DATETIME.test(read ? this.text(node) : value);
			const fail = data === null || data.type !== "week";
			if (read)  return fail ? "" : data.form;
			if (!fail) this.text(node, data.form);
			return this.week(node);
		},
		"datetime-local": function(node, value) {
			const read = value === undefined;
			const data = __DATETIME.test(read ? this.text(node) : value);
			const fail = data === null || data.type !== "datetime";
			if (read)  return fail ? "" : data.form;
			if (!fail) this.text(node, data.form);
			return this["datetime-local"](node);
		},
		datetime: function(node, value) {
			const read = value === undefined;
			const data = __DATETIME.test(read ? this.text(node) : value);
			const fail = data === null;
			if (read)  return fail ? "" : data.iso;
			if (!fail) this.text(node, data.iso);
			return this.datetime(node);
		},
		radio: function(node, value) {
			const read = value === undefined;
			const data = new __Type(value);
			if (read) return node.checked ? this.text(node) : null;
			data.boolean ? (node.checked = data.value) : this.text(node, value);
			return this.radio(node);
		},
		option: function(node, value) {
			const read = value === undefined;
			const data = new __Type(value);
			if (read) return node.selected ? this.text(node) : null;
			data.boolean ? (node.selected = data.value) : this.text(node, value);
			return this.option(node);
		},
		url: function(node, value) {
			const read = value === undefined;
			const data = new __Type(read ? this.text(node) : value);
			let url = null;
			if (data.instanceOf("URL"))
				url = String(data._input);
			else
				try {url = String(new URL(data._input));} catch(e){}
			const fail = url === null;
			if (read)  return fail ? "" : url;
			if (!fail) this.text(node, url);
			return this.url(node, url);
		},
		color: function(node, value) {
			const read = value === undefined;
			const data = read ? this.text(node) : value;
			const iso  = /^\#[0-9a-f]{6}$/i;
			if (typeof data === "string") {
				const hex  = "#"+("000000"+data.replace(/(\s+|\#)/g, "")).slice(-6);
				const fail = !iso.test(hex);
				if (read)  return fail ? "#000000" : hex;
				if (!fail) this.text(node, hex);
				return this.color(node);
			}
			/*-- somente definição de valores pode ser tipo diferente de string --*/
			if (Array.isArray(data)) {
				data.forEach(function(v,i,a) {
					const num = v !== null && isFinite(v) && !isNaN(v) ? Number(v)%256 : 0;
					a[i] = ("00"+num.toString(16)).slice(-2);
				});jjjj
				return this.color(node, "#"+data.join(""));
			}
			if (data !== null && typeof data === "object") {
				return this.color(node, [data.red, data.green, data.blue]);
			}
			if (data !== null && isFinite(data)) {
				const num = Number(data)%(0xffffff+1);
				return this.color(node, "#"+num.toString(16));
			}
			return this.text(node);
		},
		file: function(node, value) {
			if (value === null) return this.text(node, null);
			const mult = node.multiple === true;
			const data = node.files;
			const fail = data.length === 0 || (!mult && data.length > 1);
			return fail ? "" : (data.length === 1 ? data[0] : data);
		},
		email:    function(node, value) {
			const read = value === undefined;
			const mult = node.multiple === true;
			const data = read ? this.text(node) : value;
			if (typeof data === "string") {
				const list = data.replace(/\s+/g, "").split(",");
				const mail = list.filter(function(v,i,a) {return new __Type(v).email;});
				const fail = list.length !== mail.length || mail.length === 0 || (!mult && mail.length > 1);
				if (read)  return fail ? "" : (mail.length > 1 ? mail : mail.join(","));
				if (!fail) this.text(node, mail.join(","));
				return this.email(node);
			}
			/*-- somente definição de valores pode ser tipo diferente de string --*/
			if (Array.isArray(data))
				return this.email(node, data.join(","));
			return this.text(node);
		},
		select:   function(node, value) {
			const read = value === undefined;
			const mult = node.multiple === true;
			const data = read ? [] : Array.isArray(value) ? value : [value];
			data.forEach(function(v,i,a) {a[i] = String(v);});
			for (let i = 0; i < node.length; i++) {
				if (!read)
					node[i].selected = data.indexOf(node[i].value) >= 0;
				else if (node[i].selected)
					data.push(node[i].value);
			}
			const fail = (!mult && data.length > 1) || data.length === 0;
			if (read) return fail ? "" : data.length > 1 ? data : data[0];
			return this.select(node);
		},
	};

/*----------------------------------------------------------------------------*/
	/**#4 Campos de Formulários
	''const object __FIELDS''
	Define um conjunto de métodos para obter as propriedades de campos de formulário HTML.**/
	const __FIELDS = {
		/**. '{string tag(node node)}: Informa a tag do elemento.**/
		tag: function(node) {return node.tagName.toLowerCase();},
		/**. '{string tag(node node)}: Informa o tipo de campo ou nulo.**/
		type: function(node) {
			const tag  = this.tag(node);
			const list = {input: 1, button: 1, textarea: 0, select: 0};
			if (list[tag] === 1) {
				const attr = String(node.getAttribute("type")).toLowerCase();
				const prop = String(node.type).toLowerCase();
				return attr in __FTYPES ? attr : (prop in __FTYPES ? prop : null);
			}
			return tag in __FTYPES ? tag : null;
		},
		/**. '{boolean hasMask(node node)}: Informa se o campo tem máscara nativa.**/
		hasMask: function(node) {
			if (this.type(node) !== null) {
				const error = "A1!@#$%¨&*()+";
				const clone = node.cloneNode();
				try {clone.value = error;} catch(e) {}
				return clone.value !== error;
			}
			return false;
		},
		/**. '{any value(node node, any value)}: Define ou retorna o valor da propriedade/atributo '{value} do nó**/
		value: function(node, value) {
			const type = this.type(node);
			if (type in __FTYPES)
				return __FTYPES[type](node, value);
			if (value === undefined)
				return "value" in node ? node.value : node.getAttribute("value");
			if ("value" in node)
				node.value = value;
			else
				node.setAttribute("value", value);
			return this.value(node);
		},
		/**. '{boolean submit(node node)}: Informa se o campo está apto a ser submetido.**/
		submit: function(node) {
			const form = __DOM({tag: "form", child: [{tag: node.cloneNode(true)}]});
			const data = new FormData(form.tag);
			return data.get(node.name) !== null;
		},
		/**. '{object data(node node)}: Retorna o objeto '{__DataSet} com os campos a submeter ou nulo.**/
		data: function(node) {
			const form = this.tag(node) === "form" ? node : __DOM({tag: "form", child: [{tag: node.cloneNode(true)}]}).tag;
			const data = new __DataSet();
			for (let i = 0; i < form.length; i++) {
				if (this.submit(form[i]))
					if (this.error(form[i]))
						return null;
					else
						data.append(form[i].name, this.value(form[i]));
			}
			return data;
		},
		/**. '{boolean error(node node)}: Define ou retorna se o campo de formulário é inválido.**/
		error: function(node, text) {
			if (!("setCustomValidity" in node)) return false;
			let data = null;
			/*-- lendo mensagem de erro --*/
			if (text === undefined) {
				if (!node.checkValidity())
					data = node.validationMessage.trim();
				else if (node.value !== "" && this.value(node) === "")
					data = `${this.type(node)}: ${this.messages.pattern}`;
			}
			/*-- definindo mensagem de erro (substituir node.reportValidity()) --*/
			else {
				node.setCustomValidity(String(text === null ? "" : text).trim());
				return this.error(node);
			}
			/*-- imprimindo mensagem --*/
			if (data !== null) {
				const label = "labels" in node && node.labels.length > 0 ? node.labels[0] : null;
				const attr  = {role: "alert", textContent: data, className: "css-wd-form-error"};
				if (label !== null) {
					label.id = label.id.trim() === "" ? __ID.value : label.id;
					attr["aria-labelledby"] = label.id;
				}
				__WINDOW.add(__DOM({tag: "div", attr: attr}).tag, "float", node);
			}
			return !node.checkValidity();
		},
		/**. '{object messages}: Retorna um objeto com mensagens de erros para campos de formulários.**/
		get messages() {
			const lang = __LANG.value.join(" ");
			const data = {
				pattern:  __HTML("input", {pattern: "[0-9]", value: "ABC", lang: lang}),
				required: __HTML("input", {required: true,   value: "",    lang: lang}),
			};
			for (let i in data)
				data[i] = data[i].validationMessage;
			return data;
		},
	};

/*----------------------------------------------------------------------------*/
	/**#4 Obter Propriedades/Atributos
	''const object __GET_HTML''
	Define um conjunto de métodos para obter as propriedades de elementos HTML de forma personalizada.**/
	const __GET_HTML = {
		/**. '{string className(node node)}: Retorna o valor do atributo '{class}.**/
		className: function(node) {
			const attr = node.getAttribute("class");
			const text = attr === null ? "" : attr.replace(/\s+/g, " ").trim();
			const list = text.split(" ").filter(function(v,i,a) {return a.indexOf(v) === i;});
			const data = list.sort().join(" ");
			if (attr !== null && attr !== data)
				node.setAttribute("class", data);
			return data;
		},
	};

/*----------------------------------------------------------------------------*/
	/**#4 Definir Propriedades/Atributos
	''const object __SET_HTML''
	Define um conjunto de métodos para definir propriedades em elementos HTML de forma personalizada.**/
	const __SET_HTML = {
		/**. '{void value(node node, string value)}: Define o valor da propriedade ou atributo '{value}.**/
		value: function(node, value) {
			return __FIELDS.value(node, value);
		},
		/**. '{void innerHTML(node node, string value)}: Define o valor da propriedade e reanalisa o documento.**/
		innerHTML: function(node, value) {
			const event    = new CustomEvent("wdreload", {detail: null, bubbles: true});
			node.innerHTML = value;
			node.dispatchEvent(event);
			return;
		},
		/**. '{void outerHTML(node node, string value)}: Define o valor da propriedade e reanalisa o documento.**/
		outerHTML: function(node, value) {
			const event    = new CustomEvent("wdreload", {detail: null, bubbles: true});
			const parent   = node.parentElement;
			node.outerHTML = value;
			parent.dispatchEvent(event);
			return;
		},
		/**. '{void appendChild(node node, string value)}: Define o valor da propriedade e reanalisa o documento.**/
		appendChild(node, value) {
			if (Array.isArray(value)) {
				const isNew = value[0].parentElement === null;
				node.appendChild(value[0]);
				if (isNew) {
					const event = new CustomEvent("wdreload", {detail: null, bubbles: true});
					node.dispatchEvent(event);
				}
			}
			return;
		},
		/**. '{void insertAdjacentElement(node node, string value)}: Define o valor da propriedade e reanalisa o documento.**/
		insertAdjacentElement(node, value) {
			if (Array.isArray(value)) {
				const isNew = value[1].parentElement === null;
				node.insertAdjacentElement(value[0], value[1]);
				if (isNew) {
					const event = new CustomEvent("wdreload", {detail: null, bubbles: true});
					node.dispatchEvent(event);
				}
			}
			return;
		},
		/**. '{void insertBefore(node node, string value)}: Define o valor da propriedade e reanalisa o documento.**/
		insertBefore(node, value) {
			if (Array.isArray(value)) {
				const isNew = value[0].parentElement === null;
				node.insertBefore(value[0], value[1]);
				if (isNew) {
					const event = new CustomEvent("wdreload", {detail: null, bubbles: true});
					node.dispatchEvent(event);
				}
			}
			return;
		},
		/**. '{void style(node node, any value)}: Define o valor da propriedade/atributo:
		|Tipo|Descrição|
		|nulo|Remove o atributo|
		|string|Define o atributo|
		|object|Define a propriedade|**/
		style: function(node, value) {
			const check = new __Type(value);
			if (check.null)
				node.removeAttribute("style");
			else if (check.chars)
				node.setAttribute("style", value);
			else if (check.object)
				for (let name in value)
					node.style[name] = value[name];
			return;
		},
		/**. '{void className(node node, string value)}: Define o valor do atributo '{class}:
		|Valor|Descrição|
		|nulo|O atributo é excluído|
		|string|O valor é definido|
		|object|O método '{classList} é chamado|**/
		className: function(node, value) {
			const check = new __Type(value);
			if (check.null) {
				node.removeAttribute("class");
			}
			else if (check.object) {
				this.classList(node, value);
			}
			else if (check.chars) {
				node.setAttribute("class", value);
				__GET_HTML.className(node);
			}
			return;
		},
		/**. '{void classList(node node, object value)}: Define o valor do atributo '{class}:
		|Nome|Descrição|
		|replace|Substitui o primeiro valor pelo segundo separados por espaço|
		|toggle|Alterna a existência do valor|
		|add|Adiciona os valores separados por espaço|
		|remove|Adiciona os valores separados por espaço|
		Se não for objeto chama o método '{className}. Todos os valores das propriedades são string.**/
		classList: function(node, value) {
			const check = __CHECK.test(value);
			if (check.type === "object") {
				const prop = ["replace", "toggle", "add", "remove"];
				let   list = __GET_HTML.className(node).split(" ");
				for (let i = 0; i < prop.length; i++) {
					if (prop[i] in value) {
						let css = String(value[prop[i]]).replace(/\s+/g, " ").trim().split(" ");
						if (prop[i] === "replace")
							list.forEach(function(v,i,a) {
								a[i] = v === css[0] && css.length > 1 ? css[1] : v;
							});
						else if (prop[i] === "toggle")
							css.forEach(function(v,i,a) {
								const item = list.indexOf(v);
								if (item < 0) list.push(v);
								else          list[item] = "";
							});
						else if (prop[i] === "add")
							css.forEach(function(v,i,a) {list.push(v);});
						else if (prop[i] === "remove")
							list = list.filter(function(v,i,a) {return css.indexOf(v) < 0;});
					}
				}
				value = list.join(" ");
			}
			this.className(node, value);
			return;
		},
		/**. '{void addEventListener(node node, any value, boolean remove)}: Adiciona ou remove ouvintes de eventos. Se o valor for um array, cada item do array corresponderá ao argumento do método. Em caso de objeto, a referência aos argumentos são:
		|Valor|Array|Evento|Disparador|Complemento|
		|function|-|propriedade|valor|-|
		|object (handleEvent)|-|propriedade|valor|-|
		|array|1 item|propriedade|item 1|-|
		|array|2 itens|propriedade|item 1|item 2|
		|array|3 itens|item 1|item 2|item 3|**/
		addEventListener: function(node, value, remove) {
			const attr  = remove === true ? "removeEventListener" : "addEventListener";
			const check = new __Type(value);
			if (check.array)
				node[attr].apply(node, value);
			else if (check.object)
				for(let ev in value) {
					let test = new __Type(value[ev]);
					let name = ev.trim().replace(/^(on)?/i, "");
					if (test.function || test.object)
						node[attr](name, value[ev]);
					else if (test.array && value[ev].length > 0)
						node[attr].apply(node, value[ev].length > 2 ? value[ev] : [name].concat(value[ev]));
				}
				return;
		},
		/**. '{void removeEventLister(node node, any value)}: Mesma lógica de '{addEventListener}.**/
		removeEventListener: function(node, value) {
			return this.addEventListener(node, value, true);
		},
		/**. '{void dataset(node node, any value)}: Adiciona ou remove propriedades de '{dataset} e dispara o evento '{wddataset}:
		|Tipo|Valor|Descrição|
		|nulo||Apaga todas as propriedades|
		|object|nulo|Apaga a propriedade específica|
		|object||item 1|Define o valor da propriedade|**/
		dataset: function(node, value) {
				const check = new __Type(value);
				/*-- limpar propriedades --*/
				if (check.null)
					for (let i in node.dataset) {
						delete node.dataset[i];
					}
				/*-- definir propriedades --*/
				else if (check.object)
					for (let name in value) {
						let prop = name.replace(/\-+/g, "").replace(/^\-|\-$/g, "");
						if (prop.indexOf("-") >= 0)
							prop = prop.replace(/\-./g, function(x) {return x.toUpperCase().replace("-", "");});
						if (value[name] === null && prop in node.dataset) {
							delete node.dataset[prop];
						}
						else if (value[name] !== null) {
							node.dataset[prop] = value[name];
							/*-- dispara evento para propriedades "data-wd-... --*/
							if ((/^wd[A-Z]/).test(prop)) {
								const event = new CustomEvent("wddataset", {detail: prop, bubbles: true});
								node.dispatchEvent(event);
							}
						}
					}
			return;
		},
		/**. '{void setAttribute(node node, object|array value)}: Define atributos HTML.**/
		setAttribute: function(node, value) {
			const check = new __Type(value);
			if (check.object) {
				for (let i in value) this.setAttribute(node, [i, value[i]]);
				return;
			}
			if (check.array) {
				/*-- data-wd-... --*/
				if ((/^data\-wd\-.+/i).test(value[0])) {
					const camel = function(x) {return x.toUpperCase().replace("-", "");};
					const data  = {};
					const name  = String(value[0]).toLowerCase().replace(/^data\-+|\-+$/gi, "").replace(/\-+/g, "-");
					data[name.replace(/\-./gi, camel)] = value[1];
					this.dataset(node, data);
				}
				/*-- value --*/
				else if ((/^value$/i).test(value[0])) {
					this.value(node, value[1]);
				}
				/*-- normal --*/
				else {
					node.setAttribute(value[0], value[1]);
				}
			}
			return;
		},
		/**. '{void removeAttribute(node node, any value)}: Remove atributos HTML**/
		removeAttribute: function(node, value) {
			const check = new __Type(value);
			if (check.array) {
				for (let i = 0; i < value.length; i++)
					node.removeAttribute(value[i]);
			}
			else if (check.null) {
				const attr = node.attributes;
				for (let i = 0; i < attr.length; i++)
					node.removeAttribute(attr[i].name);
			}
			else {
				node.removeAttribute(value);
			}
		},
	};

/*----------------------------------------------------------------------------*/
	/**#4 Criar/Manipular Elemento
	''node __HTML(string/node tag, object attr, string uri)''
	Cria um elemento HTML ou define suas propriedades e atributos retornando-o ou nulo (falha).
	|Argumento|Tipo|Descrição|
	|tag|string|Nome da tag do elemento a ser criado e manipulado.|
	|tag|node|Elemento HTML a ser manipulado.|
	|attr|object|Propriedades ou atributos, nessa ordem, do elemento e seus respectivos valores.|
	|uri|url|Namespace URI para um elemento qualificado|
	Se a propriedade for uma função, os argumentos são repassados como array.**/
	function __HTML(tag, attr, uri) {
		/*-- analisando dados --*/
		const check  = {tag: new __Type(tag), attr: new __Type(attr)};
		const prop   = check.attr.object ? attr : {};
		const isURI  = (/^https?\:\/\/.+/i).test(uri);
		let node     = null;
		if (check.tag.chars)
			node = isURI ? document.createElementNS(uri, tag) : document.createElement(tag);
		else if (check.tag.node && check.tag.value.length > 0)
			node = check.tag.value[0];
		else
			return null;
		/*-- definindo prorpiedades e atributos, nessa ordem --*/
		for (let name in prop) {
			let value  = prop[name];
			check.value = new __Type(value);
			check.prop  = new __Type(node[name]);
			/*-- propriedade/atributo especial --*/
			if (name in __SET_HTML) {
				__SET_HTML[name](node, value);
			}
			/*-- propriedade --*/
			else if (name in node) {
				if (check.prop.function && check.value.array)
					node[name].apply(node, value);
				else if (check.value.object)
					for (let i in value)
						node[name][i] = value[i];
				else
					node[name] = value;
			}
			/*-- atributos --*/
			else if (value === null) {
				__SET_HTML.removeAttribute(node, value)
			}
			else {
				__SET_HTML.setAttribute(node, [name, value]);
			}
		}
		return node;
	};

/*----------------------------------------------------------------------------*/
	/**#4 Criar Árvore DOM
	''object __DOM(object html, node parent)''
	Cria uma estrutura de elementos HTML a partir de objetos retornando-a. As propriedades de cada objeto são:
	|Nome|Tipo|Descrição|
	|tag|string/node|Mesmo propósito do argumento da função '{__HTML}|
	|attr|object|Mesmo propósito do argumento da função '{__HTML}|
	|uri|string|Mesmo propósito do argumento da função '{__HTML}|
	|child|array|Lista de objetos, com as mesmas propriedades, representando os elementos filhos.|
	O argumento opcional '{parent} define o elemento pai do objeto principal.**/
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

/*----------------------------------------------------------------------------*/
	/**#4 Acessibilidade
	''const object __ARIA''
	Agrupa ações de acessibilidade.**/
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

/*----------------------------------------------------------------------------*/
	/**#4 Focus
	''const object __FOCUS''
	Agrupa ações de foco.**/
	const __FOCUS = {
		/**. '{array tagDiverse(node node)}: Retorna uma lista com as tags dos elementos filhos do nó.**/
		tagDiverse: function(node) {
			const child = node.children;
			const tags  = []
			for (let i = 0; i < child.length; i++)
				if (tags.indexOf(child[i].tagName) < 0)
					tags.push(child[i].tagName);
			return tags;
		},
		/**. '{object overFlow(node node)}: Retorna se o nó está usando barra de rolagem nos eixos x e y ('{boolean}).**/
		overFlow: function(node) {
			const styles = window.getComputedStyle(node, null);
			const values = ["auto", "scroll"];
			return {
				x: node.scrollWidth  > node.clientWidth  && values.indexOf(styles.overflowX) >= 0,
				y: node.scrollHeight > node.clientHeight && values.indexOf(styles.overflowY) >= 0,
			};
		},
		/**. '{object getFocus(node node)}: Localiza os elementos focáveis dentro do nó:
		|Propriedade|Tipo|Descrição|
		|focus|Array|Elementos focáveis com o atributo '{autofocus}|
		|index|Array|Elementos focáveis|
		|auto|Array|Elementos não focáveis mas com o atributo '{autofocus}|**/
		getFocus: function(node) {
			const data = {index: [], auto: [], focus: []};
			const find = node.querySelectorAll("*");
			for (let i = 0; i < find.length; i++) {
				let index = find[i].tabIndex >= 0;
				let auto  = find[i].autofocus;
				if (index)
					data.index.push(find[i]);
				if (auto)
					data.auto.push(find[i]);
				if (index && auto)
					data.focus.push(find[i]);
			}
			return data;
		},
		/**. '{void setFocus(node node)}: Define o elemento focável para o nó.**/
		setFocus: function(node) {
			const data = this.getFocus(node);
			const body = __ARIA.getNodeBy(node, "aria-describedby");
			const head = __ARIA.getNodeBy(node, "aria-labelledby");
			const over = body === null ? {} : this.overFlow(body);
			const many = body === null ? false : this.tagDiverse(body).length > 0;
			let  focus = node;
			function focusout(ev) {
				ev.target.removeAttribute("tabindex");
				ev.target.removeEventListener("focusout", focusout);
			}
			/*-- conteúdo extenso: primeiro filho do conteúdo --*/
			if (over.x === true || over.y === true || many)
				focus = body.firstElementChild;
			/*-- autofocus focável --*/
			else if (data.focus.length > 0)
				focus = data.focus[0];
			/*-- elemento focável --*/
			else if (data.index.length > 0)
				focus = data.index[0];
			/*-- forçando o autofocus não focável --*/
			else if (data.auto.length > 0)
				focus = data.auto[0];
			/*-- forçando o título --*/
			else if (head !== null)
				focus = head;
			/*-- forçando o próprio nó --*/
			else
				focus = node;
			/*-- definindo focus --*/
			if (focus.tabIndex >= 0) {
				focus.focus();
			}
			else {
				focus.tabIndex = -1;
				focus.focus();
				focus.addEventListener("focusout", focusout);
			}
			return;
		},
	};

/*----------------------------------------------------------------------------*/
	/**#4 Formulário
	''const object __FORM''
	Cria elementos de formulários a partir de objetos.
	|Argumento|Tipo|Descrição|Obrigatório|
	|type|string|Tipo de formulário|Sim|
	|label|string|Rótulo do formulário|Sim|
	|name|string|Nome do formulário|Sim|
	|value|string|Valor do formulário|Sim|
	|value|array|Lista dos rótulos dos items do formulário (label), se aplicável|Sim|
	|value|object|Lista dos rótulos e valores dos items do formulário, se aplicável|Sim|
	|check|string|Valor padrão do formulário|Não|
	|check|list|Valores padrão do formulário, se aplicável|Não|
	|id|string|Identificador do formulário|Não|**/
	const __FORM = {
		/**. '{object info}: Define a tábula de campos de formulário.**/
		field: Object.freeze({
			text:     {method: "combo", tag: "input"},
			tel:      {method: "combo", tag: "input"},
			email:    {method: "combo", tag: "input"},
			url:      {method: "combo", tag: "input"},
			search:   {method: "combo", tag: "input"},
			number:   {method:  "text", tag: "input"},
			range:    {method:  "text", tag: "input"},
			file:     {method:  "text", tag: "input"},
			hidden:   {method:  "text", tag: "input"},
			password: {method:  "text", tag: "input"},
			date:     {method:  "text", tag: "input"},
			time:     {method:  "text", tag: "input"},
			datetime: {method:  "text", tag: "input"},
			month:    {method:  "text", tag: "input"},
			week:     {method:  "text", tag: "input"},
			textarea: {method:  "text", tag: "textarea"},
			button:   {method: "click", tag: "button"},
			submit:   {method: "click", tag: "button"},
			reset:    {method: "click", tag: "button"},
			color:    {method: "click", tag: "input"},
			image:    {method: "click", tag: "input"},
			checkbox: {method: "check", tag: "input"},
			radio:    {method: "check", tag: "input"},
			select:   {method: "list",  tag: "select"},
			"datetime-local": {method:  "text", tag: "input"},
		}),
		/**. '{object html(string type, string label)}: Retorna a estrutura de elemento HTML.**/
		html: function(type, label) {
			return {tag: type, attr: {innerHTML: label}, child: []};
		},
		/**. '{object label(string label)}: Retorna a estrutura de elemento HTML de rótulo.**/
		label: function(label) {
			return {tag: "label", attr: {}, child: [this.html("span", label)]};
		},
		/**. '{array options(any value, any check)}: Retorna uma lista de estruturas do elemento HTML '{option}.**/
		options: function (value, check) {
			const child = [];
			const list  = Array.isArray(check) ? check : [check];
			if (Array.isArray(value)) {
				for (let i = 0; i < value.length; i++)
					child.push({tag: "option", attr: {
						value: value[i], textContent: value[i], selected: list.indexOf(value[i]) >= 0
					}});
			}
			else if (typeof value === "object") {
				for (let i in value)
					child.push({tag: "option", attr: {
						value: i, textContent: value[i], selected: list.indexOf(i) >= 0
					}});
			}
			/*-- value é outro tipo --*/
			else {
				child.push({tag: "option", attr: {
					value: value, textContent: value, selected: list.indexOf(value[i]) >= 0
				}});
			}
			return child;
		},
		/**. '{object text(string type, string label, string name, string value)}: Retorna a estrutura de elemento HTML de texto.**/
		text: function(type, label, name, value) {
			const base = this.label(label);
			const attr = {type: type, name: name, value: value};
			if      (type === "textarea") delete attr.type;
			else if (type === "file")     delete attr.value;
			else if (type === "password") delete attr.value;
			else if (type === "hidden")   return {tag: this.field[type].tag, attr: attr, child: []};
			base.child.push({tag: this.field[type].tag, attr: attr, child: []});
			return base;
		},
		/**. '{object list(string type, string label, string name, any value, any check)}: Retorna a estrutura de elemento HTML de seleção.**/
		list: function(type, label, name, value, check) {
			const base = this.label(label);
			const attr = {name: name, multiple: Array.isArray(check) && check.length > 1};
			const list = this.options(value, check);
			const data = {tag: this.field[type].tag, attr: attr, child: list};
			base.child.push(data);
			return base;
		},
		/**. '{object combo(string type, string label, string name, any value, any check)}: Retorna a estrutura de elemento HTML de combo.**/
		combo: function(type, label, name, value, check) {
			if (!Array.isArray(value) && typeof value !== "object")
				return this.text(type, label, name, value);
			const base = this.label(label);
			const data = {tag: "datalist", attr: {id: __ID.value}, child: this.options(value)};
			const show = Array.isArray(check) ? check : [typeof check === null || check === undefined ? "" : check];
			const attr = {type: type, name: name, value: show.join(","), setAttribute: ["list", data.attr.id]};
			if (type === "email" && init.length > 1)
				attr.multiple = true;
			base.child.push(data);
			base.child.push({tag: this.field[type].tag, attr: attr, child: []});
			return base;
		},
		/**. '{object check(string type, string label, string name, any value, any check)}: Retorna a estrutura de elemento HTML de checagem.**/
		check: function(type, label, name, value, check) {
			check = Array.isArray(check) ? check : [check];
			const keep = type === "radio";
			const list = [this.html("legend", label)];
			let   item = 0;
			if (Array.isArray(value)) {
				for (let i = 0; i < value.length; i++)
					list.push(this.check(type, value[i], keep ? name : `${name}_${i}`, value[i], check));
			}
			else if (typeof value === "object") {
				for (let i in value)
					list.push(this.check(type, value[i], keep ? name : `${name}_${item++}`, i, check));
			}
			else {
				const attr  = {type: type, name: name, value: value, checked: check.indexOf(value) >= 0};
				const input = {tag: this.field[type].tag, attr: attr, child: []};
				const base  = this.label(label);
				base.child.unshift(input);
				return base;
			}
			return {tag: "fieldset", attr: {}, child: list};
		},
		/**. '{object click(string type, string label, string name, any value, any check)}: Retorna a estrutura de elemento HTML de botão.**/
		click: function(type, label, name, value, check) {
			check = Array.isArray(check) ? check : [check];
			const tag  = this.field[type].tag;
			const btn  = tag === "button";
			const list = [];
			let   item = 0;
			if (Array.isArray(value)) {
				for (let i = 0; i < value.length; i++)
					list.push(this.click(type, value[i], `${name}_${i}`, value[i], check));
			}
			else if (typeof value === "object") {
				for (let i in value)
					list.push(this.click(type, btn ? value[i] : i, `${name}_${item++}`, btn ? i : value[i], check));
			}
			else {
				const attr = {type: type, name: name, value: value, autoFocus: check.indexOf(value) >= 0};
				attr[btn ? "innerHTML" : "aria-label"] = label;
				return {tag: tag, attr: attr, child: []};
			}
			return {tag: "div", attr: {}, child: list};
		},
		/**. '{object builder(string type, string label, string name, any value, any check)}: Retorna a estrutura de elemento HTML genérico.**/
		builder: function(type, label, name, value, check) {
			type  = String(type).toLowerCase().trim();
			label = String(label).trim();
			name  = String(name).trim();
			const method = type in this.field ? this.field[type].method : "html";
			return this[method](type, label, name, value, check);
		},
		/**. '{node form(array data, object attr)}: Os items do argumento são i{array} e seguem a mesma ordem do método '{builder}.**/
		form: function(data, attr) {
			if (!Array.isArray(data)) return null;
			const form = {tag: "form", attr: attr, child: []};
			for (let i = 0; i < data.length; i++) {
				if (Array.isArray(data[i]))
					form.child.push(this.builder.apply(this, data[i]));
			}
			return __DOM(form).tag;
		},
	};

/*----------------------------------------------------------------------------*/
	/**#4 Menu
	''const object __MENU''
	Cria elementos de menus a partir de arrays. Os seguintes argumentos são comuns aos métodos:
	|Argumento|Tipo|Descrição|
	|list|array|Lista principal de itens e submenus repassada ao método '{form}.|
	|input|any|O conteúdo do item de '{list} que definirá um item ou um submenu (array secundário).|
	|level|integer|Nível do menu iniciado por 1.|
	|heap|string|Cadeia de índices, separados por ponto, que direcionam o menu.|
	|type|string|Tipo de ação do botão: open (abrir submenu), back (voltar ao menu pai), item (executar)|
	|home|any|Conteúdo do primeiro item de cada menu ou submenu.|
	|menu|array|Lista das estruturas dos containers do menu (cabeçalho e menu) de todo o conjunto.|
	|items|array|Lista das estruturas dos itens de cada menu.|
	|link|string|Identificador do menu para fins de lincagem com o cabeçalho respectivo.|
	A configuração do menu obedece o seguinte regramento:
	- Um formulário HTML acomodará um conjunto de blocos de menu;
	- Cada bloco de menu possui um cabeçalho e uma lista de itens (menu);
	- Cada bloco será exibido de forma individual na posição vertical;
	- Cada bloco de menu é definido por um array;
	- O texto do cabeçalho do bloco é definido pelo conteúdo do primeiro item do array;
	- O texto dos itens do menu é definido pelos demais itens do array;
	- Se o item do array for um objeto, o texto será definido pela propriedade '{text};
	- Se o item do array for outro array, um novo bloco (submenu) será criado;
	- Demais valores definirão o texto do item ou do cabeçalho, conforme o caso;
	- Os itens do menu podem avançar/retroceder pelos menus ou executar uma ação;
	- Ao executar uma ação, o evento '{wdmenu} será disparado no formulário;
	- A propriedade '{detail} do evento disparado conterá o conteúdo do respectivo item do array;
	- Somente valores presentes no formato JSON poderão ser utilizados.**/
	const __MENU = {
		//FIXME manter propriedade help?
		/**. '{object data(any input, string base)}: Extraí e retorna os valores do texto (`{text}) da descrição (`{help}) de '{input}**/
		data: function(input, base) {
			const obj = typeof input === "object" && !Array.isArray(input) && input !== null;
			const txt = typeof input === "string" || typeof input === "number";
			return {
				text: obj && "text" in input ? input.text : (txt ? input : base),
				help: obj && "help" in input ? input.help : null
			}
		},
		/**. '{object head(string text, integer level, string link)}: Retorna a estrutura do cabeçalho do menu com o título `{text}**/
		head: function(text, level, link) {
			const attr = {innerHTML: text, role: "heading", "aria-level": level, id: link};
			return {
				tag:  level > 6 ? "div" : `h${level}`,
				attr: level > 6 ? attr  : {innerHTML: text, id: link},
				child: [],
			}
		},
		/**. '{object menu(string link, array items)}: Retorna a estrutura do menu.**/
		menu: function(link, items) {
			return {tag: "menu", attr: {"aria-labelledby": link}, child: items};
		},
		/**. '{object items(any input, integer level, string type)}: Retorna a estrutura do item do menu**/
		item: function(input, heap, type) {
			const data = this.data(input, `Item ${heap}`); console.log(heap, data)
			const attr = {
				innerHTML: data.text,
				type: "button",
				className: `css-wd-menu-${type}`,
				value: heap,
				name: `${type}:${heap}`,
				autofocus: heap === "1",
				addEventListener: {keydown: this, click: this, mouseenter: this},
				dataset: {wdMenuItem: JSON.stringify(input)}
			};
			return {tag: "li", attr: {}, child: [{tag: "button", attr: attr, child: []}]};
		},
		/**. '{object box(any input, integer level, array items)}: Retorna a estrutura do container do menu (cabeçalho e menu).|**/
		box: function(input, level, items) {
			const data = this.data(input, `Menu ${level}`);
			const link = __ID.value;
			const attr = {className: "css-wd-menu", hidden: level > 1, "aria-labelledby": link};
			const head = this.head(data.text, level, link);
			const menu = this.menu(link, items);
			return {tag: "section", attr: attr, child: [head, menu]};
		},
		/**. '{void main(array menu, array list, integer level, string heap, any home)}: Define estrutura do conjunto de menus.**/
		main: function(menu, list, level, heap, home) {
			const items = [];
			for (let i = 0; i < list.length; i++) {
				let data = list[i];
				let path = `${heap}${i}`;
				/*-- 1º botão: menu [ignorar], submenu [retorno ao pai] --*/
				if (i === 0) {
					if (home !== null)
						items.push(this.item(home[0], path, "back"));
				}
				/*-- Avanço de Menu e Submenu --*/
				else if (Array.isArray(data)) {
					this.main(menu, data, level+1, `${path}.`, list);
					items.push(this.item(data[0], path, "open"));
				}
				/*-- Executar Menu --*/
				else {
					items.push(this.item(data, path, "item"));
				}
			}
			menu.push(this.box(list[0], level, items));
			return;
		},
		/**. '{node menu(array list)} Retorna um formulário contendo os blocos de menu.**/
		form: function(list) {
			const menu = [];
			if (Array.isArray(list))
				this.main(menu, list, 1, "", null);
			const form = __DOM({tag: "form", attr: {}, child: menu}).tag;
			return form;
		},
/*FIXME The element that opens the menu has role button.
The element with role button has aria-haspopup set to either menu or true.
When the menu is displayed, the element with role button has aria-expanded set to true. When the menu is hidden, aria-expanded is set to false.
The element that contains the menu items displayed by activating the button has role menu.
Optionally, the element with role button has a value specified for aria-controls that refers to the element with role menu.
Additional roles, states, and properties needed for the menu element are described in the Menu and Menubar Pattern.
<button type="button" id="menubutton1" aria-haspopup="true" aria-expanded="false" aria-controls="menu1">*/
		/**. '{void openMenu(node button, string way)}: Navega horizontalmente entre os menus.**/
		openMenu: function(button, way) {
			const data = button.name.split(":");
			const heap = button.value;
			const deep = /\.\d+$/;
			const open = {
				open: data[0] === "open" ? `${heap}.0` : null,
				back: data[0] === "back" ? heap.replace(deep, "") : null,
				left: deep.test(heap) ? heap.replace(deep, "") : heap
			};
			const find = way in open ? button.form.querySelector(`button[value="${open[way]}"]`) : null;
			if (find !== null) {
				const list = Array.prototype.slice.call(button.form.children);
				for (let i = 0; i < list.length; i++)
					list[i].hidden = !list[i].contains(find);
				find.focus();
			}
			return;
		},
		/**. '{void walkMenu(node button, string way)}: Navega verticalmente entre os itens.**/
		walkMenu: function(button, way) {
			const menu = button.parentElement.parentElement;
			const list = Array.prototype.slice.call(menu.querySelectorAll("button"));
			const item = list.indexOf(button);
			const walk = {
				home:  0,
				end:   list.length - 1,
				below: (item + 1)%list.length,
				above: (list.length + item - 1)%list.length
			}
			list[walk[way]].focus();
			return;
		},
		/**. '{void fireMenu(node button)}: Dispara o evento '{wdmenu} no formulário.**/
		fireMenu: function(button) {
			let data = null;
			try {data = JSON.parse(button.dataset.wdMenuItem);} catch(e) {};
			const event = new CustomEvent("wdmenu", {detail: data, bubbles: true});
			button.dispatchEvent(event);
			return;
		},
		/**. '{void handleEvent(object ev)}: Disparador do menu chamado durante os eventos '{keydown}, '{click} e {mouseenter}.**/
		handleEvent: function(ev) {
			/*-- teclado --*/
			if (ev.type === "keydown") {
				const stop = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
				const walk = {ArrowDown: "below", ArrowUp: "above", Home: "home", End: "end"};
				const open = {ArrowRight: "open", ArrowLeft: "left"};
				if (ev.key in walk || ev.key in open)
					ev.preventDefault();
				if (ev.key in walk)
					return this.walkMenu(ev.target, walk[ev.key]);
				if (ev.key in open)
					return this.openMenu(ev.target, open[ev.key]);
				return;
			}
			/*-- clique --*/
			if (ev.type === "click") {
				const data = ev.target.name.split(":");
				if (data[0] === "open" || data[0] === "back")
					return this.openMenu(ev.target, data[0]);
				if (data[0] === "item")
					return this.fireMenu(ev.target)
				return;
			}
			/*-- mouse sobre --*/
			if (ev.type === "mouseenter") {
				ev.target.focus();
				return;
			}
			return;
		}
	};

/*----------------------------------------------------------------------------*/
	/**#4 Abas
	''const object __TAB''
	Organiza um container em forma de abas.**/
	const __TAB = {
		/**. '{string label(node panel, integer index)}: Procura por cabeçalhos no painel e retorna o texto da aba.**/
		//FIXME não apagar cabeçalho
		label: function(panel, index) {
			const find = "h1, h2, h3, h4, h5, h6, [role=heading]";
			const aria = panel.hasAttribute("aria-label") ? panel.getAttribute("aria-label") : null
			const data = panel.querySelector(find);
			if (data !== null) data.hidden = true;
			return data !== null ? data.innerHTML : (aria !== null ? aria : `Tab ${index}`);
		},
		/**. '{object create(node panel, integer index)}: Retorna a estrutura da aba e configura o painel.**/
		create: function(panel, index) {
			const data = {panel: __ID.id(panel), tab: __ID.value, label: this.label(panel, index)};
			/*-- preparando painel --*/
			__HTML(panel, {
				id: data.panel,
				tabIndex: -1,
				role: "tabpanel",
				"aria-labelledby": data.tab,
				hidden: index !== 0,
			});
			/*-- retornando a aba --*/
			return {tag: "button", child: [], attr: {
				type: "button",
				innerHTML: data.label,
				tabIndex: index === 0 ? 0 : -1,
				id: data.tab,
				role: "tab",
				"aria-controls": data.panel,
				"aria-selected": index === 0 ? "true" : "false"
			}};
		},
		/**. '{void builder(node node, boolean vertical)}: Define uma caixa de abas para referenciar os filhos do nó.**/
		builder: function(node, vertical) {
			node.style.flexDirection = vertical === true ? "row" : "column";
			node.className = "css-wd-tab";
			/*-- definindo abas e configurando paineis --*/
			const data = node.children;
			const list = {tag: "div", child: [], attr: {
				tabIndex: -1,
				role: "tablist",
				"aria-orientation": vertical === true ? "vertical" : "horizontal",
				addEventListener: {click: this, keydown: this}
			}};
			for (let i = 0; i < data.length; i++)
				list.child.push(this.create(data[i], i));
			/*-- adicionando a lista ao container (topo) --*/
			node.insertBefore(__DOM(list).tag, node.firstElementChild);
			return;
		},
   	/**. '{void click(object ev)}: Manipulador que define o painel de acordo com o click na aba.**/
   	click: function(ev) {
   		const tab    = ev.target;
   		const list   = ev.currentTarget;
   		const panel  = document.getElementById(tab.getAttribute("aria-controls"));
   		const tabs   = list.children;
   		const panels = list.parentElement.children;
   		/*-- definindo painel ativo --*/
			for (let i = 0; i < panels.length; i++)
				__HTML(panels[i], {
					hidden: panels[i] !== list && panels[i] !== panel
				});
   		/*-- definindo aba ativa --*/
   		for (let i = 0; i < tabs.length; i++)
   			__HTML(tabs[i], {
					tabIndex:        tabs[i] === tab ? 0 : -1,
					"aria-selected": tabs[i] === tab ? "true" : "false",
				});
			tab.focus();
			return;
   	},
   	/**. '{void keydown(object ev)}: Manipulador para navegar pelas abas pelo teclado.**/
		keydown: function (ev) {
			const path = ev.currentTarget.getAttribute("aria-orientation")
			const tabs = Array.prototype.slice.call(ev.currentTarget.children);
			const item = tabs.indexOf(ev.target);
			const vert = {ArrowDown:  item + 1, ArrowUp:   item - 1, Home: 0, End: tabs.length - 1}
			const hori = {ArrowRight: item + 1, ArrowLeft: item - 1, Home: 0, End: tabs.length - 1};
			const walk = path === "vertical" ? vert : hori;
			const next = (walk[ev.key] + tabs.length)%tabs.length;
			tabs[next].click();
			return;
   	},
   	/**. '{void handleEvent(object ev)}: Disparador de abas chamado durante os eventos '{keydown}, '{click}.**/
		handleEvent: function(ev) {
			if (ev.target === ev.currentTarget) return;
			if (ev.type === "click") {
				ev.stopPropagation();
				ev.preventDefault();
				this.click(ev);
			}
			else if (ev.type === "keydown") {
				const path = ev.currentTarget.getAttribute("aria-orientation");
				const keys = path === "vertical" ? /^(ArrowUp|ArrowDown|Home|End)$/ : /^(ArrowRight|ArrowLeft|Home|End)$/;
				/*-- sair das abas: focar no painel ativo --*/
				if (ev.key === "Tab" && !ev.shiftKey) {
					ev.stopPropagation();
					ev.preventDefault();
					const panel = ev.target.getAttribute("aria-controls");
					document.getElementById(panel).focus();
				}
				/*-- navegar pelo teclado --*/
				else if (keys.test(ev.key)) {
					ev.stopPropagation();
					ev.preventDefault();
					this.keydown(ev);
				}
			}
			return;
		},
	};

	/*----------------------------------------------------------------------------*/
	/**#4 Ícones
	''const object __ICON''
	Define plano de fundo estilizado por i{dingbats}/'{symbols} em unicode.**/
	const __ICON = {
		/**. '{string image(object data)}: Retorna o valor para o atributo '{background-image}. Propriedade do argumento '{data}:
		|Nome|Tipo|Descrição|Padrão|
		|x|string|Posição horizontal do caractere|50%|
		|y|string|Posição vertical do caractere|50%|
		|code|string|Unicode do caractere|003F|
		|size|string|Tamanho da fonte do caractere|1em|
		|height|string|Altura da imagem|1em|
		|width|string|Comprimento da imagem|1em|
		|rotate|string|Rotação da imagem|0|
		|opacity|string|Opacidade da imagem|1|**/
		image: function(data) {
			data.x       = typeof data.x       === "string" ? data.x       : "50%";
			data.y       = typeof data.y       === "string" ? data.y       : "50%";
			data.height  = typeof data.height  === "string" ? data.height  : "1em";
			data.width   = typeof data.width   === "string" ? data.width   : "1em";
			data.rotate  = typeof data.rotate  === "string" ? data.rotate  : "0";
			data.opacity = typeof data.opacity === "string" ? data.opacity : "1";
			data.code    = typeof data.code    === "string" ? data.code    : "003F";
			data.size    = typeof data.size    === "string" ? data.size    : "1em";
			return `url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' transform='rotate(${data.rotate})' opacity='${data.opacity}' height='${data.height}' width='${data.width}' style='background-color: inherit;'><text x='${data.x}' y='${data.y}' text-anchor='middle' dominant-baseline='middle' font-family='monospace' font-size='${data.size}'>\\${data.code}</text></svg>")`;
		},
		/**. '{void style(node, image, size, repeat, position, origin)}: Define o estilo do fundo do nó ('{node}):
		|Nome|Tipo|CSS|Padrão|
		|image|object|-|Ver método '{image}|
		|size|string|a{backgroundSize}[href="https://developer.mozilla.org/en-US/docs/Web/CSS/background-size"]|1em|
		|repeat|string|a{backgroundRepeat}[href="https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat"]|no-repeat|
		|position|string|a{backgroundPosition}[href="https://developer.mozilla.org/en-US/docs/Web/CSS/background-position"]|50% 50%|
		|origin|string|a{backgroundOrigin}[href="https://developer.mozilla.org/en-US/docs/Web/CSS/background-origin"]|content-box|**/
		style: function(node, image, size, repeat, position, origin) {
			node.style.backgroundImage    = this.image(image);
			node.style.backgroundSize     = typeof size     === "string" ? size     : "1em";
			node.style.backgroundRepeat   = typeof repeat   === "string" ? repeat   : "no-repeat";
			node.style.backgroundPosition = typeof position === "string" ? position : "50% 50%";
			node.style.backgroundOrigin   = typeof origin   === "string" ? origin   : "content-box";
			return;
		},
		/**. '{void icon(node node, string code, boolean circle)}: Atribui ao nó um ícone quadrado sem conteúdo. O argumento '{circle} estabelece bordas arredondadas se verdadeiro.**/
		icon: function(node, code, circle) {
			node.className = `css-wd-icon-${circle === true ? "circle" : "square"}`;
			this.style(node, {code: code, y: "56%"}, "contain", "no-repeat", "50% 50%");
			return;
		},
		/**. '{void button(node node, string code, string locale)}: Atribui ao nó um formato de botão. Argumento '{locale} define o posicionamento do ícone e do texto:
		|Valor|Ícone|Texto|
		|top|Superior|Inferior|
		|bottom|Inferior|Superior|
		|left|Esquerda|Direita|
		|right|Direita|Esquerda|
		|circle|Todo o nó com bordas arredondadas|Não visível|
		|default|Todo o nó|Não visível|**/
		button: function(node, code, locale) {
			const data = {top: "div", bottom: "div", left: "span", right: "span"};
			/*-- redefinir conteúdo textual do nó --*/
			const kill = node.querySelectorAll(".css-wd-icon");
			for (let i = 0; i < kill.length; i++) kill[i].remove();
			const text = node.textContent.trim();
			/*-- redefinindo características do nó --*/
			const info = window.getComputedStyle(node, null);
			__HTML(node, {
				innerHTML: "",
				"aria-label": null,
				style: {
					fontSize: null,
					textAlign: "center",
					position: info.position === "static" ? "relative" : info.position,
					className: "",
				},
			});
			/*-- definindo ícone --*/
			const tag  = locale === "top" || locale === "bottom" ? "div" : "span";
			const icon = __HTML(tag, {style: {
				display:  tag === "div" ? "block" : "inline-block",
				margin:   tag === "div" ? "auto"  : "0 0.25em",
				fontSize: tag === "div" ? "3em"   : "1em",
			}});
			/*-- aplicando regras --*/
			if (locale in data) {
				const init = locale === "top" || locale === "left";
				const span = {tag: tag, attr: {textContent: text}};
				__DOM({tag: node, child: init ? [{tag: icon}, span] : [span, {tag: icon}]});
				this.icon(icon, code, true);
			}
			else {
				const byid = __ID.value;
				const span = {tag: "span", attr: {textContent: text, id: byid, className: "css-wd-tooltip"}};
				__DOM({tag: node, child: [span], attr: {"aria-labelledby": byid, style: {fontSize: "3em"}}});
				this.icon(node, code, locale === "circle");
			}
			return;
		},
		/**. '{void icon(node node, string code, string size, string data)}: Define um plano de fundo com o ícone. O argumento '{data} pode se referir à posição x,y (com a unidade de medida, separada por espaço, sem repetição) ou o tipo de repetição.**/
		background: function(node, code, size, data) {
			data = String(data).replace(/\s+/g, " ").trim().toLowerCase()
			const mult = /^(space|round|repeat\-x|repeat\-y)$/;
			const site = /^(0|\d+(\.\d+)?(\%|[a-z]+))\ (0|\d+(\.\d+)?(\%|[a-z]+))$/;
			if (mult.test(data))
				return this.style(node, {code: code}, size, data);
			if (site.test(data))
				return this.style(node, {code: code}, size, "no-repeat", data);
			return this.style(node, {code: code}, size);
		}
	};

/*----------------------------------------------------------------------------*/
	/**#4 Redimensionamento
	''const object __MOVE''
	Define plano de fundo estilizado por i{dingbats}/'{symbols} em unicode.**/
	const __MOVE = {
		/**. '{number delta}: Espaço entre as movimentaçoes do teclado.**/
		delta: Math.min(window.screen.height, window.screen.width)/100,
		/**. '{array sides}: Identificação dos lados do manipulador com relação à posição relativa (ordem de focalização).**/
		sides: ["nw", "n", "ne", "w", "c", "e", "sw", "s", "se"],
		/**. '{object mouse}: Registra dados para manipulação do mouse.**/
		mouse: null,
		/**. '{void attach(node target)}: Anexa o manipulador ao alvo.**/
		attach: function(target) {
			this.detach(target);
			const view = __ID.value;
			const ctrl = __ID.id(target);
			const fire = {keydown: this, mousedown: this, focusin: this};
			const move = {tag: "div", attr: {"data-js-wd-role": "move", addEventListener: fire}, child: []};
			/*-- posicionamento --*/
			this.temp(target, {position: {static: "relative"}, display: {inline: "inline-block"}});
			/*-- manipuladores específicos --*/
			this.sides.forEach(function(v,i,a) {
				const attr = {className: `js-wd-move-${v}`, "aria-controls": ctrl, "aria-label": v.toUpperCase()};
				attr[v === "c" ? "id" : "aria-describedby"] = view;
				move.child.push({tag: "button", attr: attr, child: []});
			}, this);
			/*-- anexando manipulador e focalizando --*/
			window.addEventListener("click", this);
			__DOM(move, target).tag.children[this.sides.indexOf("c")].focus();
			return;
		},
		/**. '{void detach(node target)}: Desanexa o manipulador do alvo.**/
		detach: function(target) {
			const find = target.querySelector("[data-js-wd-role=move]");
			if (find !== null && find.parentElement === target) {
				find.remove();
				target.focus();
				window.removeEventListener("click", this);
			}
			return;
		},
		/**. '{void temp(node target, object style)}: Define temporariamente as propriedades do atributo '{style} e reverte-o.
		. O argumento '{style} é um objeto cujas propriedades fazem referência às propriedades do atributo '{style}. O valor dessas propriedades também são objetos cujas propriedades apontam para o valor inaquedado do atributo e seu valor aponta para o novo valor a ser utilizado temporariamente.
		. Se a propriedade '{style.display} com o valor "inline" tiver que ser alterada para o valor "inline-block", o argumento '{style} deverá ser display: {inline: "inline-block"}. Se o argumento '{style} não for informado, os valores serão reestabelecidos.**/
		temp: function(node, style) {
			if (style === undefined && "jsWdTemp" in node.dataset) {
				const temp = JSON.parse(node.dataset.jsWdTemp);
				delete node.dataset.jsWdTemp;
				for (let i in temp) node.style[i] = temp[i];
			}
			else if (style !== null && typeof style === "object") {
				const data = window.getComputedStyle(node, null);
				const temp = "jsWdTemp" in node.dataset ? JSON.parse(node.dataset.jsWdTemp) : {};
				for (let name in style) {
					for (let value in style[name]) {
						/*-- se o valor incorreto da propriedade for encontrado --*/
						if (data[name] === value) {
							/*-- preservar a informação original --*/
							if (!(name in temp))
								temp[name] = node.style[name] === "" ? null : node.style[name];
							/*-- definindo o novo valor temporariamente --*/
							node.style[name] = style[name][value];
							break;
						}
					}
				}
				node.dataset.jsWdTemp = JSON.stringify(temp);
			}
			return;
		},
		/**. '{object size(node node, object data)}: Define ou retorna os valores dimensionais do nó ('{height, width, left, right, top, bottom, fontSize}).**/
		size: function(node, data) {
			const read = !(data !== null && typeof data === "object");
			const info = read ? {height: 0, width: 0, left: 0, top: 0, right: 0, bottom: 0, fontSize: 0} : this.size(node);
			const css  = read ? window.getComputedStyle(node, null) : null;
			for (let i in info) {
				if (read)
					info[i] = Number(css[i].replace(/\D+$/, ""));
				else if (i in data)
					node.style[i] = `${data[i]}px`;
			}
			return read ? info : this.size(node);
		},
		/**. '{string move(node node, number dx, number dy)}: Desloca o nó e retorna a descrição da sua posição.**/
		move: function(node, dx, dy) {
			const size = this.size(node);
			size.left   += dx;
			size.right  -= dx;
			size.top    += dy;
			size.bottom -= dy;
			const data = this.size(node, size);
			return `(${Math.trunc(data.left)}, ${Math.trunc(data.top)})`;
		},
		/**. '{string resize(node node, number dx, number dy)}: Desloca o nó e retorna a descrição da sua dimensão.**/
		resize: function(node, dn, de, ds, dw) {
			const size = this.size(node);
			/*-- vertical superior --*/
			size.height -= dn;
			size.top    += dn;
			/*-- vertical inferior --*/
			size.height += ds;
			size.bottom -= ds;
			/*-- horizontal esquerda --*/
			size.width  -= dw;
			size.left   += dw;
			/*-- horizontal direita --*/
			size.width  += de;
			size.right  -= de;
			const data = this.size(node, size);
			return `${Math.trunc(data.width)} x ${Math.trunc(data.height)}`;
		},
		/**. '{void data(object ev)}: Retorna os dados envolvendo manipulador ou nulo.**/
		data: function(ev) {
			const list = Array.prototype.slice.call(ev.currentTarget.children);
			const item = list.indexOf(ev.target);
			return {
				node: ev.currentTarget.parentElement,
				main: ev.currentTarget,
				side: ev.target,
				name: this.sides[item],
				text: list[this.sides.indexOf("c")],
				next: list[(item + 1)%list.length],
				prev: list[(list.length + item - 1)%list.length],
			};
		},
		/**. '{void tab(object ev, object data)}: Manipulador que gerencia a mudança de foco dos manipuladores.**/
		tab: function(ev, data) {
			(ev.shiftKey ? data.prev.focus() : data.next.focus());
			return;
		},
		/**. '{void focus(object ev, object data)}: Manipulador que gerencia o foco dos elementos.**/
		focus: function(ev, data) {
			data.text.textContent = this[data.name === "c" ? "move" : "resize"](data.node, 0, 0, 0, 0);;
			return;
		},
		/**. '{void moveKey(object ev, object data)}: Manipulador para mover o elemento com o teclado.**/
		moveKey: function(ev, data) {
			const dy   = this.delta * (ev.key === "ArrowUp"   ? -1 : (ev.key === "ArrowDown"  ? 1 : 0));
			const dx   = this.delta * (ev.key === "ArrowLeft" ? -1 : (ev.key === "ArrowRight" ? 1 : 0));
			data.text.textContent = this.move(data.node, dx, dy);
			return;
		},
		/**. '{void resizeKey(object ev, object data)}: Manipulador para altera as dimenssões do elemento com o teclado.**/
		resizeKey: function(ev, data) {
			const line = {ArrowUp: "v", ArrowDown: "v", ArrowRight: "h", ArrowLeft: "h"};
			const side = {dn: 0, ds: 0, dw: 0, de: 0};
			if      (line[ev.key] === "v" && data.name.indexOf("n") >= 0)
				side.dn = this.delta * (ev.key === "ArrowUp"    ? -1 : +1);
			else if (line[ev.key] === "v" && data.name.indexOf("s") >= 0)
				side.ds = this.delta * (ev.key === "ArrowUp"    ? -1 : +1);
			else if (line[ev.key] === "h" && data.name.indexOf("e") >= 0)
				side.de = this.delta * (ev.key === "ArrowRight" ? +1 : -1);
			else if (line[ev.key] === "h" && data.name.indexOf("w") >= 0)
				side.dw = this.delta * (ev.key === "ArrowRight" ? +1 : -1);
			data.text.textContent = this.resize(data.node, side.dn, side.de, side.ds, side.dw);
			return;
		},
		/**. '{void mouseDown(object ev, object data)}: Manipulador que inicializa o movimento a partir do mouse.**/
		mouseDown: function(ev, data) {
			this.mouse   = data;
			this.mouse.x = ev.pageX;
			this.mouse.y = ev.pageY;
			window.addEventListener("mouseup", this);
			window.addEventListener("mousemove", this);
			return;
		},
		/**. '{void mouseUp(object ev, object data)}: Manipulador que encerra o movimento a partir do mouse.**/
		mouseUp: function(ev, data) {
			window.removeEventListener("mouseup", this);
			window.removeEventListener("mousemove", this);
			this.mouse.side.focus();
			this.mouse = null;
			return;
		},
		/**. '{void mouseMove(object ev, object data)}: Manipulador que define o movimento a partir do mouse.**/
		mouseMove: function(ev, data) {
			const attr = {
				id: this.mouse.name,
				dx: ev.pageX - this.mouse.x,
				dy: ev.pageY - this.mouse.y,
				get dn() {return this.id.indexOf("n") >= 0 ? this.dy : 0;},
				get ds() {return this.id.indexOf("s") >= 0 ? this.dy : 0;},
				get de() {return this.id.indexOf("e") >= 0 ? this.dx : 0;},
				get dw() {return this.id.indexOf("w") >= 0 ? this.dx : 0;},
			};
			/*-- redefinir referência --*/
			this.mouse.x += attr.dx;
			this.mouse.y += attr.dy;
			/*-- aplicar ajustes --*/
			if (this.mouse.name === "c")
				this.mouse.text.textContent = this.move(this.mouse.node, attr.dx, attr.dy);
			else
				this.mouse.text.textContent = this.resize(this.mouse.node, attr.dn, attr.de, attr.ds, attr.dw);
			return;
		},
		/**. '{void click(object ev, object data)}: Manipulador Define o movimento a partir do mouse.**/
		click: function(ev, data) {
			const query = document.querySelectorAll("[data-js-wd-role=move]");
			for (let i = 0; i < query.length; i++) {
				let node = query[i].parentElement;
				if (!node.contains(ev.target))
					this.detach(node);
			}
			return;
		},
		/**. '{void handleEvent(object ev)}: Disparador de manipulação chamado durante os eventos '{keydown}, '{click}, '{mousedown}, '{mouseup}, '{mousemove} e '{focusin}.**/
		handleEvent: function(ev) {
			if (ev.target === ev.currentTarget) return;
			ev.stopPropagation();
			const data = ev.currentTarget === window ? null : this.data(ev);
			const keys = /^(Escape|Tab|ArrowUp|ArrowRight|ArrowLeft|ArrowDown)$/;
			if (ev.type === "keydown" && keys.test(ev.key)) {
				ev.preventDefault();
				if (ev.key === "Escape")
					this.detach(data.node);
				else if (ev.key === "Tab")
					this.tab(ev, data);
				else if (data.name === "c")
					this.moveKey(ev, data);
				else
					this.resizeKey(ev, data);
			}
			else if (ev.type === "mousedown" && ev.button === 0)
				this.mouseDown(ev, data);
			else if (ev.type === "mousemove")
				this.mouseMove(ev, data);
			else if (ev.type === "mouseup")
				this.mouseUp(ev, data);
			else if (ev.type === "focusin")
				this.focus(ev, data);
			else if (ev.type === "click")
				this.click(ev, data)
			return;
		},
	};


/*----------------------------------------------------------------------------*/
	/**#4 Arrasto
	''const object __DRAG''
	Define plano de fundo estilizado por i{dingbats}/'{symbols} em unicode.**/
	const __DRAG = {
		/**. '{object data}: Guarda as informações sobre o arrasto.**/
		data: {},
		/**. '{node fake}: Registra o container falso que indica a posição da queda.**/
		fake: document.createElement("div"),
		//FIXME fazer um link também

		/**. '{void make(node drag}: Prepara as dimensões de '{fake}.**/
		make: function(drag) {
			this.fake.removeAttribute("style");
			this.fake.className = "js-wd-fake";
			this.fake.style.display = window.getComputedStyle(drag, null).display;
			return;
		},
		/**. '{void attach(node drag, node drop, string effect, function call)}: Vincula um elemento de arrasto ao de queda:
		|Propriedade|Descrição|
		|drag|Elemento a ser arrastado|
		|drop|Elemento recebedor do arrasto|
		|effect|Tipo do efeito "copy", "move", "link"|
		|call|Função opcional a ser chamada após a queda|
		. A propriedade '{call} receberá como argumentos:
		- o elemento arrastado;
		- o elemento de queda;
		- o efeito aplicado; e
		- o elemento de origem do elemento arrastado.**/
		attach: function(drag, drop, effect, call) {
			drag.id = __ID.id(drag);
			drop.id = __ID.id(drop);
			effect  = (/^(copy|link|move)$/i).test(effect) ? String(effect).toLowerCase() : "move";
			/*-- adicionar dados --*/
			if (!(drag.id in this.data)) {
				this.data[drag.id] = {};
				drag.draggable = true;
				drag.addEventListener("dragstart", this);
			}
			this.data[drag.id][drop.id] = {effect: effect, call: call, src: drag.parentElement};
			return;
		},
		/**. '{void detach(node drag, node drop)}: Desvincula o elemento de arrasto ao de queda, se '{drop} for informado, ou remove o arrasto de '{drag}.**/
		detach: function(drag, drop) {
			if (drag.id in this.data) {
				if (drop === null || drop === undefined) {
					drag.draggable = false;
					drag.removeEventListener("dragstart", this);
					delete this.data[drag.id];
				}
				else if (drop.id in this.data[drag.id]) {
					delete this.data[drag.id][drop.id];
				}
			}
			return;
		},
		/**. '{string effect(string id)}: Retorna o efeito do elemento arrastável a partir de seu '{id}.**/
		effect: function(id) {
			const info = {move: false, link: false, copy: false};
			if (id in this.data)
				for (let i in this.data[id])
					info[this.data[id][i].effect] = true;
			if (info.move && info.copy && info.link)
				return "all";
			if (info.move && info.copy)
				return "copyMove";
			if (info.copy && info.link)
				return "copyLink";
			if (info.move && info.link)
				return "linkMove";
			return info.move ? "move" : (info.copy ? "copy" : (info.link ? "link" : "none"));
		},
		/**. '{void dragstart(object ev)}: Manipulador que inicializa o arrasto.**/
		dragstart: function(ev) {
			const drag = ev.target;
			let   fire = false;
			ev.dataTransfer.setData("text", drag.id);
  		ev.dataTransfer.effectAllowed = this.effect(drag.id);
  		/*-- configurando drops --*/
  		for (let i in this.data[drag.id]) {
  			let drop = document.getElementById(i);
  			if (!drag.contains(drop)) {
					drop.className += ` css-wd-drop-${this.data[drag.id][i].effect} `;
					drop.addEventListener("dragover", this);
					//FIXME drop.addEventListener("dragleave", this);
					drop.addEventListener("drop", this);
					fire = true;
				}
			}
			if (fire) drag.addEventListener("dragend", this);
			this.make(drag);
			return;
		},
		/**. '{void dragend(object ev)}: Manipulador que encerra o arrasto.**/
		dragend: function(ev) {
			const drag = ev.target;
			const css  = /\s?css\-wd\-drop\-(link|move|copy)\s?/;
			drag.removeEventListener("dragend", this);
			this.fake.remove();
			for (let i in this.data[drag.id]) {
  			let drop = document.getElementById(i);
  			drop.className = drop.className.replace(css, " ");
  			drop.removeEventListener("dragover", this);
  			//FIXME drop.removeEventListener("dragleave", this);
  			drop.removeEventListener("drop", this);
  		}
  		return;
		},
		/**. '{void appendFake(object ev)}: Manipulador que exibe o '{fake} conforme conteúdo de i{drop} .**/
		appendFake: function(ev) {
			const drop = ev.currentTarget;
			let  child = ev.target;
			/*-- o alvo é o fake: não fazer nada --*/
			if (child.contains(this.fake)) return;
			/*-- drop sem filhos: adicionar fake ao container --*/
			if (drop.childElementCount === 0) {
				drop.appendChild(this.fake);
				return;
			}
			/*-- posicionar pelo filho --*/
			while (child.parentElement !== drop)
				child = child.parentElement;
			const size = __MOVE.size(child);
			const flow = ev.offsetY >= size.height * (1 - ev.offsetX/size.width);
			const bros = flow ? child.nextElementSibling : child.previousElementSibling;
			if (flow && bros === null)
				drop.appendChild(this.fake);
			else if (flow && bros !== this.fake)
				drop.insertBefore(this.fake, bros);
			else if (!flow && bros !== this.fake)
				drop.insertBefore(this.fake, child);
			console.log({x: ev.offsetX, y: ev.offsetY, Y: size.height * (1 - ev.offsetX/size.width), flow: flow})
			return;
		},



		/**. '{void dragover(object ev)}: Manipulador ao navegar o drag sobre o drop.**/
		dragover: function(ev) {
			ev.preventDefault();
			ev.stopPropagation();
			const drag = document.getElementById(ev.dataTransfer.getData("text"));
			const drop = ev.currentTarget;
			const data = this.data[drag.id][drop.id];
			ev.dataTransfer.dropEffect = data.effect;
			//__ICON.background(this.fake, data.effect === "copy" ? "1F4DD" : "1F4E5");
			if (data.effect === "copy" || data.effect === "move")
				this.appendFake(ev);



			return;
		},
		/**. '{void dragleave(object ev)}: Manipulador ao tirar o drag sobre o drop.**/
		dragleave: function(ev) {
			return;
		},
		drop: function(ev) {
			const drag = document.getElementById(ev.dataTransfer.getData("text"));
			const drop = ev.currentTarget;
			const data = this.data[drag.id][drop.id];
			if (data.effect === "copy") {
				const clone = drag.cloneNode(true);
				clone.id = __ID.value;
				drop.insertBefore(clone, this.fake);
			}
			else if (data.effect === "move") {
				drop.insertBefore(drag, this.fake);
			}
			else
				console.log(data.effect)

			this.fake.remove();
			return;
		},









		/**. '{void handleEvent(object ev)}: Disparador de manipulação chamado durante os eventos '{keydown}, '{click}, '{mousedown}, '{mouseup}, '{mousemove} e '{focus}.**/
		handleEvent: function(ev) {
			console.log(ev.type)
			this[ev.type](ev);
		},








		sdfhslkdjhflsd: function() {


		function clearDrops() {
			WD.$$("[data-wd-dropping], [data-wd-dragging]").forEach(function(node) {
				node.removeAttribute("data-wd-dropping");
				node.removeAttribute("data-wd-dragging");
				node.ondragover  = null;
				node.ondragleave = null;
				node.ondrop      = null;
			});
			window.getSelection().removeAllRanges();
			return;
		}
		/*-- Habilitando configuração de arrasto ---------------------------------*/
		if (event.type === "mouseover") {
			 target.draggable = true;
		}
		/*-- Definindo drops -----------------------------------------------------*/
		else if (event.type === "dragstart") {
			const effects = {link: 0, move: 0, copy: 0};
			const parent  = target.parentElement;
			/*-- looping pelos grupos --*/
			for (let i = 0; i < data.length; i++) {
				let query  = data[i].$$ || data[i].$ || null;
				let effect = String(data[i].effect).toLowerCase();
				let caller = new __Type(data[i].drop).function ? data[i].drop : function (drop, drag, effect) {
					if (effect === "move") {
						drop.appendChild(drag);
					}
					else if (effect === "copy") {
						drop.appendChild(drag.cloneNode(true));
					}
					else if (effect === "link") {
						if (drag.id.trim() === "")
							drag.id = "ID_drag_link_" + String(new Date().valueOf());
						if (drop.tagName.toLowerCase() === "a") {
							drop.href = `#${drag.id}`;
						} else {
							drop.style.cursor = "pointer";
							drop.tabIndex     = 0;
							drop.onclick      = function(ev) {location.hash = drag.id;}
							drop.onkeypress   = function(ev) {
								if ((/enter/i).test(ev.key)) ev.target.click();
							}
						}
						drop.focus();
					}
					return;
				}
				/*-- efeito confirmado, drop existentes: definir disparadores --*/
				if (effect in effects && query !== null) {
					effects[effect] = 1;
					WD(query).forEach(function(node) {
						if (node !== parent && !target.contains(node)) {
							node.dataset.wdDropping = effect;
							node.ondragover = function(ev) {
								ev.preventDefault();
								if ((/^(on)?dragover$/i).test(ev.type)) {
									ev.target.dataset.wdDropping = effect.toUpperCase();
									ev.dataTransfer.dropEffect   = effect;
								}
								else if ((/^(on)?dragleave$/i).test(ev.type)) {
									ev.target.dataset.wdDropping = effect;
								}
								else if ((/^(on)?drop$/i).test(ev.type)) {
									caller(ev.target, target, effect);
									clearDrops();
								}
								return;
							}
							node.ondragleave = node.ondragover;
							node.ondrop      = node.ondragover;
						}
					});
				}
			}
			/*-- definindo o tipo de drag permitido ao elemento arrastável --*/
			if (effects.move > 0 && effects.copy > 0 && effects.link > 0)
				event.dataTransfer.effectAllowed = "all";
			else if (effects.move > 0 && effects.copy > 0)
				event.dataTransfer.effectAllowed = "copyMove";
			else if (effects.copy > 0 && effects.link > 0)
				event.dataTransfer.effectAllowed = "copyLink";
			else if (effects.move > 0 && effects.link > 0)
				event.dataTransfer.effectAllowed = "linkMove";
			else if (effects.move > 0)
				event.dataTransfer.effectAllowed = "move";
			else if (effects.copy > 0)
				event.dataTransfer.effectAllowed = "copy";
			else if (effects.link > 0)
				event.dataTransfer.effectAllowed = "link";
			else
				event.dataTransfer.effectAllowed = "none";
			if (event.dataTransfer.effectAllowed !== "none")
				target.dataset.wdDragging = event.dataTransfer.effectAllowed;
		}
		/*-- Encerrando arrasto --------------------------------------------------*/
		else if (event.type === "dragend") {
			clearDrops();
		}
		},








	};



/*----------------------------------------------------------------------------*/
	/**#4 Fixação
	''constructor object __Pin(node box, any pin)''
	Construtor para efetuar posicionamento do nó ('{box}) fixo à tela ou a relativo a outro nó ('{pin}):
	|tipo|Descrição|
	|Nó|Fixará o '{box} relativamente ao nó|
	|object|Fixará o '{box} na posição definida pelas propriedades '{x} e '{y}|.**/
	//FIXME e quando não existir espaço acima ou abaixo (elemento cobre toda a tela)?
	function __Pin(box, pin) {
		if (!(this instanceof __Pin)) return new __Pin(box, pin);
		const test = {box: new __Type(box), pin: new __Type(pin)};
		const node = test.pin.node && test.pin.value.length > 0;
		let   data = {x: 0, y: 0};
		if (!test.box.node || test.box.value.length < 1)
			throw new TypeError("__Fixed: box must be an HTML element.");
		if (node)
			data = test.pin.value[0].getBoundingClientRect();
		else if (test.pin.object)
			data = {
				x: !isFinite(pin.x) ? 0 : Number(pin.x) >= 0 ? Number(pin.x) : 0,
				y: !isFinite(pin.y) ? 0 : Number(pin.y) >= 0 ? Number(pin.y) : 0,
			};
		Object.defineProperties(this, {
			/**. '{node box}: Nó a ser posicionado.**/
			box:  {value: test.box.value[0]},
			/**. '{object bcr}: Retorna as dimensões do nó a ser fixado.**/
			bcr:  {value: test.box.value[0].getBoundingClientRect()},
			/**. '{object pin}: Retorna o ponto de fixação do nó.**/
			pin:  {value: data},
			/**. '{boolean node}: Informa se o ponto de referência para fixação é um nó.**/
			node: {value: node}
		});
	}

	Object.defineProperties(__Pin.prototype, {
		constructor: {value: __Pin},
		/**. '{object ecra}: Retorna as dimensões do monitor (w/h).**/
		ecra: {value: {w: window.screen.width, h: window.screen.height}},
		/**. '{object area}: Retorna as dimensões da tela (w/h).**/
		area: {get: function() {return {w: window.innerWidth, h: window.innerHeight};}},
		/**. '{integer padd}: Retorna a expessura das bordas.**/
		padd: {get: function() {return Math.min(this.ecra.w, this.ecra.h)*0.01;}},
		/**. '{object edge}: Retorna as dimensões da área útil (t/r/b/l/w/h).**/
		edge: {get: function() {
			return {
				t: this.padd, b: this.area.h - this.padd,
				l: this.padd, r: this.area.w - this.padd,
				w: this.area.w - 2*this.padd,
				h: this.area.h - 2*this.padd,
			};
		}},
		/**. '{object space}: Retorna o espaço disponível em cada direção (n/e/s/w) em relação à área exibida.**/
		space: {get: function() {
			return {
				n: this.node ? this.pin.top   : this.pin.y,
				w: this.node ? this.pin.right : this.pin.x,
				s: this.area.h - (this.node ? this.pin.bottom : this.pin.y),
				e: this.area.w - (this.node ? this.pin.left   : this.pin.x)
			};
		}},
		/**. '{object wide}: Retorna a direção que contém o maior espaço (e/w para horizontal e n/s para vertical).**/
		wide: {get: function() {
			const data = this.space;
			return {v: data.s >= data.n ? "s" : "n", h: data.e >= data.w ? "e" : "w"};
		}},
		/**. '{integer width}: Retorna o comprimento da caixa.**/
		width: {get: function() {
			return this.bcr.width > this.edge.w ? this.edge.w : this.bcr.width;
		}},
		/**. '{number horizontal}: Retorna a âncora horizontal para a caixa (negativo fixa i{left}, positivo fixa i{right}).**/
		horizontal: {get: function() {
			const edge  = this.edge;
			const left  = this.node ? this.pin.left  : this.pin.x;
			const right = this.node ? this.pin.right : this.pin.x;
			const width = this.width;
			const wide  = this.padd * (this.wide.h === "w" ? -1 : 1);
			return left + width <= edge.r ? -left : (right - width >= edge.l ? this.area.w - right : wide);
		}},
		/**. '{number vertical}: Retorna a âncora na vertical para a caixa (negativo fixa i{top} positivo fixa i{bottom}).**/
		vertical: {get: function() {
			const edge   = this.edge;
			const top    = this.node ? this.pin.top    : this.pin.y;
			const bottom = this.node ? this.pin.bottom : this.pin.y;
			const height = this.bcr.height;
			const wide   = this.wide.v === "s" ? -bottom : this.area.h - top;
			return bottom + height <= edge.b ? -bottom : (top - height >= edge.t ? this.area.h - top : wide);
		}},
		/**. '{integer height}: Retorna a altura máxima da caixa.**/
		height: {get: function() {
			const data = this.vertical;
			const abs  = Math.abs(data);
			return data < 0 ? (this.edge.b + data) : (this.edge.h - data - this.edge.t);
		}},
		/**. '{number fix()}: Fixa a caixa à tela.**/
		fix: {
			value: function() {
				/*-- ajustar posição para incluir bordas quando não for fixado a nó --*/
				if (!this.node) {
					const edge = this.edge;
					this.pin.x = this.pin.x < edge.l ? edge.l : (this.pin.x > edge.r ? edge.r : this.pin.x);
					this.pin.y = this.pin.y < edge.t ? edge.t : (this.pin.y > edge.b ? edge.b : this.pin.y);
				}
				const h = this.horizontal;
				const v = this.vertical;
				const a = {
					width:     `${Math.abs(this.width)}px`,
					maxHeight: `${Math.abs(this.height)}px`
				};
				a[h < 0 ? "left" : "right"]  = `${Math.abs(h)}px`;
				a[v < 0 ? "top"  : "bottom"] = `${Math.abs(v)}px`;
				__HTML(this.box, {style: a});
				return;
			}
		}
	});

/*----------------------------------------------------------------------------*/
	/**#4 Janelas
	''const object __WINDOW''
	Administrador de paredes e janelas:
	- frame: Parede de profundidade baixa e posição invariável e fixa à tela permitindo a adição de múltiplas janelas sem restrição.
	- float: Parede de profundidade intermediária e posição variável e fixa à tela ou absoluta a um elemento permitindo a adição de uma única janela a cada interação. Pode ser fechada por meio da tecla kbd{Esc} ou por um clique externo. É incompatível com a parede "modal" ou com outra janela "float".
	- modal: Parede de profundidade alta e posiçã__Pino fixa à tela, ocupando toda a área, permitindo a adição de múltiplas janelas organizadas por meio de uma fila, exibindo apenas uma janela a cada interação. Pode ser fechada por meio da tecla kbd{Esc}. Elementos fora da janela ficarão inertes.
	A cada mudança de '{status}, o evento i{wdwindow} será disparado. A propriedade '{detail} do evento contera os dados do identificador '{id} e do '{status} (string):
	|Status|Descrição|
	|open|Indica que a janela foi fixada à parede e está sendo exibida na tela|
	|closed|Indica que a janela renderizada foi removida da parede|
	|canceled|Indica que a janela foi removida da fila|**/
	const __WINDOW = {
		/**. '{array heap}: Guarda os registros vigentes.**/
		heap: [],
		/**. '{object wall}: Registra as paredes fixadoras de janelas.**/
		wall: Object.freeze({
			frame: __HTML("div", {"data-js-wd-window": "frame"}),
			modal: __HTML("div", {"data-js-wd-window": "modal"}),
			float: __HTML("div", {"data-js-wd-window": "float"})
		}),
		/**. '{void clear(string wall)}: Remove e limpa atributos da parede especificada em '{wall}.**/
		clear: function(wall) {
			const attr = {"data-js-wd-window": wall, style: null, className: null, removeAttribute: ["id"]};
			if (wall in this.wall) {
				this.wall[wall].remove();
				__HTML(this.wall[wall], attr);
			}
			return;
		},
		/**. '{object find(any key)}: Retorna o primeiro identificador encontrado na pilha ou nulo conforme argumento '{key}. Se o argumento for um nó HTML, buscará pela janela, se for uma string, fará a busca pelo nome da janela ou pelo identificador.**/
		find: function(key) {
			const node = typeof key === "object" && key instanceof HTMLElement;
			const text = typeof key === "string";
			const wall = text && (/^(float|modal|frame)$/i).test(key.toLowerCase());
			const len  = node || wall || text ? this.heap.length : 0;
			for (let i = 0; i < len; i++) {
				if (node && this.heap[i].window.contains(key))
					return this.heap[i];
				if (wall && this.heap[i].wall === key.toLowerCase())
					return this.heap[i];
				if (text && this.heap[i].id === key)
					return this.heap[i];
			}
			return null;
		},
		/**. '{object list}: Retorna as informações da pilha em forma de '{array} separados por paredes.**/
		get list() {
			const wall = {float: [], modal: [], frame: []};
			for (let i = 0; i < this.heap.length; i++)
				wall[this.heap[i].wall].push(this.heap[i]);
			return wall;
		},
		/**. '{object fire(object heap)}: Dispara eventos de mutação da janela.**/
		fire: function(heap) {
			const detail = {id: heap.id, status: heap.status};
			const event  = new CustomEvent("wdwindow", {detail: detail});
			heap.window.dispatchEvent(event);
			return;
		},
		/**. '{boolean inert}: Define a inércia no documento.**/
		set inert(x) {
			const query = x ? document.body.children : document.querySelectorAll("body > *[inert]");
			for (let i = 0; i < query.length; i++) {
				if (query[i] !== this.wall.modal) {
					if (x) query[i].setAttribute("inert", "true");
					else   query[i].removeAttribute("inert");
				}
			}
		},
		/**. '{boolean freeze}: Define o congelamento do documento.**/
		set freeze(x) {
			const data = x ? {add: "js-wd-freeze"} : {remove: "js-wd-freeze"};
			__HTML(document.body, {className: data});
		},
		/**. '{void pin(object heap)}: Define a forma de fixação das janelas '{float/modal} à tela.**/
		pin: function(heap) {
			/*-- fixar posição --*/
			if (heap.wall === "float") {
				const pin = new __Pin(this.wall.float, heap.pin);
				pin.fix();
			}
			//FIXME checar o foco nesse negócio: focar em onfocus/janela ou do jeito que está?


			/*-- definir focus --*/
			if (heap.wall === "float" || heap.wall === "modal")
				__FOCUS.setFocus(heap.window);
			/*-- cor --*/
			const bg = window.getComputedStyle(heap.window).background;
			if (bg === "none") {
				heap.window.style.color = "black";
				heap.window.style.background = "white";
			}
			return;
		},
		/**. '{void update()}: Atualiza fixação das janelas.**/
		update: function() {
			/*-- removendo eventos --*/
			const event = {float: ["keydown", "resize", "click"], modal: ["keydown"]};
			for (let i = 0; i < event.float.length; i++)
				window.removeEventListener(event.float[i], this);
			/*-- atualizando lista --*/
			const list = this.list;
			for (let wall in list) {
				list[wall].forEach(function(heap,i,a) {
					/*-- parede modal: só analisar a primeira janela --*/
					if (heap.wall === "modal" && i > 0) return;
					/*-- Adicionando janelas e fixando paredes --*/
					if (heap.window.parentElement !== this.wall[heap.wall]) {
						/*-- adicionar janela à parede --*/
						this.wall[heap.wall].appendChild(heap.window);
						/*-- adicionar parede ao documento (não necessariamente a body) --*/
						if (this.wall[heap.wall].parentElement === null)
							document.body.appendChild(this.wall[heap.wall]);
						/*-- definindo posicionamento e foco --*/
						this.pin(heap);
						/*-- disparar evento --*/
						heap.status = "open";
						this.fire(heap);
					}
				}, this);
				/*-- limpar dados da parede --*/
				if (list[wall].length < 1) this.clear(wall);
			}
			/*-- adicionando eventos à window --*/
			const ev = list.modal.length > 0 ? "modal" : (list.float.length > 0 ? "float" : null);
			if (ev in event)
				for (let i = 0; i < event[ev].length; i++)
					window.addEventListener(event[ev][i], this);
			/*-- inert e freeze --*/
			this.inert  = list.modal.length > 0;
			this.freeze = list.float.length > 0;
			return;
		},
		/**. '{integer remove(any key)}: Remove a janela da pilha (ver método '{find} quanto ao argumento '{key}).**/
		remove: function(key) {
			const heap = this.find(key);
			const wall = heap === null ? null : heap.wall;
			const show = heap === null ? null : this.wall[heap.wall].contains(heap.window);
			if (heap !== null) {
				heap.window.remove();
				heap.status = show ? "closed" : "canceled";
				this.heap = this.heap.filter(function(v,i,a) {return v.id !== heap.id;});
				this.fire(heap);
				this.update();
				/*-- voltar o foco ao elemento --*/
				if (heap.wall === "float" || heap.wall === "modal") {
					const list = this.list;
					if (list.float.length + list.modal.length === 0) {
						try {heap.pin.focus();} catch(e) {
							try {heap.focus.focus();} catch(f) {}
						}
					}
				}
			}
			return heap === null ? null : heap.id;
		},
		/**. '{boolean checkWindow(node win, string wall)}: Checa se a janela atende os critérios para inclusão na pilha.**/
		checkWindow: function(win, wall) {
			wall = wall in this.wall ? wall : "frame";
			const list = this.list;
			/*-- 1) a janela precisa ser um nó --*/
			if (typeof win !== "object" || !(win instanceof HTMLElement))
				return false;
			/*-- 2) a janela não pode estar contida na pilha --*/
			if (this.find(win) !== null)
				return false;
			/*-- 3) a janela não pode estar contida nas paredes --*/
			for (let i in this.wall)
				if (win.contains(this.wall[i])) return false;
			/*-- 4) janela float aberta é fechada, exceto em caso de nova janela frame --*/
			if (list.float.length > 0 && wall !== "frame")
				list.float.forEach(function(v,i,a) {this.remove(v.window);}, this);
			/*-- 5) janela float é incompatível com uma janela modal aberta --*/
			if (wall === "float" && list.modal.length > 0)
				return false;
			return true;
		},
		/**. '{string add(node win, string wall, any pin)}: Adiciona a janela e retorna seu '{id} ou nulo em caso de insucesso:
		|Argumento|Tipo|Descrição|
		|win|node|Janela a ser adicionada, não pode ser parte de outra janela já adicionada (ver método '{checkWindow}).|
		|wall|string|Tipo de parede: "float", "modal" ou "frame"|
		|pin|string|Localização da janela na parede modal:  "top", "bottom", "left", "right", "full" e "center".|
		|pin|node|Nó de fixação da parede float.|
		|pin|object|Posição (x, y) da parede float.|**/
		add: function(win, wall, pin) {
			wall = wall in this.wall ? wall : "frame";
			if (!this.checkWindow(win, wall)) return null;
			const id = __ID.value;
			this.heap.push({
				id:     id,
				status: null,
				window: win,
				wall:   wall,
				pin:    pin,
				focus:  document.activeElement
			});
			this.update();
			return id;
		},
		/**. '{void handleEvent(object ev)}: Disparador do objeto chamado durante os eventos '{resize, click e keydown}.**/
		handleEvent: function(ev) {
			let   kill = false;
			const list = this.list;
			/*-- FLOAT --*/
			if (list.float.length > 0) {
				if (ev.type === "click")
					kill = !this.wall.float.contains(ev.target)
				else if (ev.type === "keydown")
					kill = ev.key === "Escape";
				else if (ev.type === "resize")
					kill = true;
				if (kill)
					this.remove(list.float[0].id);
			}
			/*-- MODAL --*/
			if (list.modal.length > 0) {
				if (ev.type === "keydown")
					kill = ev.key === "Escape";
				if (kill)
					this.remove(list.modal[0].id);
			}
			return;
		},
	};

/*----------------------------------------------------------------------------*/
	/**''const object __SIGNAL''
	Renderiza mensagens e notificações.**/
	const __SIGNAL = {
		/**. '{void handleEvent(object ev)}: Disparador do objeto chamado durante os eventos '{submit e click}.**/
		handleEvent: function(ev) {
			ev.preventDefault();
			if (ev.type === "wdwindow") {
				if (ev.detail.status === "canceled" || ev.detail.status === "closed") {
					const form = ev.target.querySelector("form");
					if (form !== null) {
						form.remove();
						form.removeEventListener("submit", this)
					}
				}
			}
			else if (ev.type === "click" || ev.type === "submit") {
				__WINDOW.remove(ev.target);
			}
			return;
		},
		/**. '{object quit(string label)}: Retorna a estrutura do botão de fechar o alerta. O argumento define a descrição do botão.**/
		quit: function(label) {
			return {tag:  "button", attr: {
				type: "button",
				className: "css-wd-quit",
				"aria-label": String(label || "").trim() || "Close",
				addEventListener: {click: this},
				innerHTML: "&#x2715;"
			}};
		},
		/**. '{node alert(string body, string head, string quit)}: Exibe e retorna um nó de alerta (ver evento '{wdwinow}) ou nulo:
		|Argumento|Descrição|Observação|
		|body|Texto da mensagem|Obrigatório|
		|head|Texto do título|Opcional|
		|quit|Rótulo do botão fechar|Recomendado|**/
		alert: function(body, head, quit) {
			head = String(head || "").trim() || document.title.trim() || window.location.hostname;
			body = String(body || "").trim() || null;
			/*-- alerta --*/
			const box0 = {tag: "div", attr: {role: "alert", className: "css-wd-alert"}};
			const box1 = {tag:  "h1", attr: {innerHTML: head}};
			const box2 = {tag:   "p", attr: {innerHTML: body}};
			box0.child = [box1, box2, this.quit(quit)];
			const data = body === null ? null : __WINDOW.add(__DOM(box0).tag, "frame");
			return data === null ? null : __WINDOW.find(data).window;
		},
		/**. '{node dialog(node form, string head, string quit)}: Exibe e retorna um nó de diálogo (ver evento '{wdwinow}) ou nulo:
		|Argumento|Descrição|Observação|
		|form|Formulário para o diálogo|Obrigatório|
		|head|Texto do título|Opcional|
		|quit|Rótulo do botão fechar|Recomendado|**/
		dialog: function(form, head, quit) {
			head = String(head || "").trim() || document.title.trim() || window.location.hostname;
			form = typeof form === "object" && form instanceof HTMLFormElement ? form : null;
			/*-- Barrar formulário inválido ou já existente --*/
			if (form === null || __WINDOW.find(form) !== null)
				return null;
			if (form.method.toLowerCase() === "dialog") form.method = "get";
			/*-- diálogo --*/
			const attr = {
				"aria-labelledby":  __ID.value,
				"aria-describedby": form.id.trim() !== "" ? form.id : __ID.value,
				addEventListener:   {wdwindow: this},
				role:               "alertdialog",
				className:          "css-wd-dialog"
			};
			const box0 = {tag: "div", attr: attr};
			const box1 = {tag:  "h1", attr: {id: attr["aria-labelledby"], innerHTML: head}};
			const box2 = {tag:  form, attr: {id: attr["aria-describedby"], addEventListener: {submit: this}}};
			box0.child = [box1, box2, this.quit(quit)];
			const data = __WINDOW.add(__DOM(box0).tag, "modal");
			return data === null ? null : __WINDOW.find(data).window;
		},
		/**. '{void notify(string body, string head)}: Exibe uma notificação (ver método i{alert}).**/
		notify: function (body, head) {
			head = String(head || "").trim() || document.title.trim() || window.location.hostname;
			body = String(body || "").trim() || null;
			if (body !== null) {
				const config = {lang: __LANG.value, body: body, tag: __ID.value,};
				if (Notification.permission === "denied")
					return;
				if (Notification.permission === "granted")
					new Notification(head, config);
				else
					Notification.requestPermission().then(function(x) {
						if (x === "granted") new Notification(head, config);
					});
			}
			return;
		},
	};

/*============================================================================*/
	/**#3 Eventos Customizados //FIXME acabar com isso
	''{const object wdDatasetEvent''
	Evento a ser disparado ao definir o atributo HTML i{dataset} pela ferramenta da biblioteca (ver __Node).**/
	const wdDatasetEvent = new CustomEvent("wddataset", {detail: null, bubbles: true});
/*----------------------------------------------------------------------------*/
	/**''const object wdReloadEvent''
	Evento a ser disparado ao carregar elementos pela biblioteca (ver __Node.load).**/
	const wdReloadEvent = new CustomEvent("wdreload", {detail: null, bubbles: true});



/*============================================================================*/
	/**#3 Requisições e Respostas
	#4 Barra de Progresso
	''const object __PROGRESS''
	Registra a barra de progresso das requisições da biblioteca.**/
	const __PROGRESS = {
		//FIXME https://w3c.github.io/aria/#aria-busy colocar isso no load e no repeat enquanto a página é carregada
		//TODO https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress#describing_a_particular_region
		/**. '{object heap}: Pilha de processos em andamento.**/
		heap: {},
		/**. '{node tree}: Elementos da barra de progresso (main, label, bar).**/
		tree: (function() {
			const bar   = {tag: "PROGRESS", attr: {id:  "js_wd_window_progress"}};
			const label = {tag: "LABEL",    attr: {for: bar.attr.id, id: "js_wd_window_progress_percent"}};
			const attr  = {"data-js-wd-window": "progress", role: "dialog", "aria-labelledby": label.attr.id}
			const dom   = __DOM({tag: "FORM", attr: attr, child: [bar, label]});
			return {main: dom.tag, bar: dom.child[0].tag, label: dom.child[1].tag};
		})(),
		/**. '{void calc()}: Calcula o valor da barra de progresso.**/
		calc: function() {
			let empty = 0;
			let total = 0;
			let width = 0;
			for (let i in this.heap) {
				width++;
				empty += this.heap[i] === null ? 1 : 0;
				total += this.heap[i] === null ? 0 : this.heap[i];
			}
			if (width === 0) {
				this.tree.main.remove();
				this.tree.label.textContent = "?";
				this.tree.bar.removeAttribute("value");
			}
			else if (empty === width) {
				this.tree.bar.removeAttribute("value");
				this.tree.label.textContent = "?";
			}
			else {
				const value = total/(width - empty);
				const text  = value.toLocaleString(__LANG.value, {style: "percent", maximumFractionDigits: 0});
				this.tree.bar.value       = value;
				this.tree.label.innerText = text;
			}
			return;
		},
		/**. '{string open()}: Abre um processo e retorna seu identificador.**/
		open: function() {
			const id = __ID.value;
			this.heap[id] = null;
			if (this.tree.main.parentElement !== document.body)
				document.body.appendChild(this.tree.main);
			this.calc();
			return id;
		},
		/**. '{void close(string id)}: Fecha o processo aberto com o identificador especificado.**/
		close: function(id) {
			if (id in this.heap) {
				delete this.heap[id];
				this.calc();
			}
			return;
		},
		/**. '{void value(string id, float data)}: Define o valor do progresso.**/
		value: function(id, data) {
			if (id in this.heap) {
				this.heap[id] = isFinite(data) ? Math.abs(Number(data)) : null;//FIXME como otimizar isso?
				this.calc();
			}
			return;
		},
	};

/*----------------------------------------------------------------------------*/
	/**#4 Constantes
	''const object __MIME''
	Registra tipos a{MIME}[href="https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types/Common_types"] mais usados.**/
	const __MIME = {
		"text/plain": "text", "text/csv":   "csv", "text/css": "css",
		"text/xml":    "xml", "text/html": "html", "text/javascript": "js",
		"application/octet-stream": "default",
		"application/json": "json", "application/javascript": "js",
		"application/xml":   "xml",
		"image/svg+xml": "svg",
	};

/*----------------------------------------------------------------------------*/
	/**''const object __RESPONSETYPES''
	Registra os tipos de respostas para as requisições:
	|Nível|Nome|Descrição|
	|1|-|Tipo de resposta|
	|2|-|Método de envio ou leitura (objeto utilizado para a requisição)|
	|3|type|Tipo de leitura original do método|
	|3|parser|String que identifica a cadeira modificadora da resposta conforme MIMETYPE ou '{type} (modificador principal)|
	Tipos de resposta:
	|Nome|Descrição|**/
	const __RESPONSETYPES = {
		/**|text|Fornece parâmetros para o retorno do conteúdo em forma de texto|**/
		text: {
			send:  {type: "text",       parser: {type: null}},
			read:  {type: "readAsText", parser: {type: null}},
			fetch: {type: "text",       parser: {type: null}},
		},
		/**|blob|Fornece parâmetros para o retorno do conteúdo como arquivo, exceto no caso em '{read} que retorna uma string|**/
		blob:   {
			send:  {type: "blob",               parser: {type: null}},
			read:  {type: "readAsBinaryString", parser: {type: null}},
			fetch: {type: "blob",               parser: {type: null}},
		},
		/**|html|Fornece parâmetros para o retorno do conteúdo como HTML|**/
		html:   {
			send:  {type: "document",   parser: {type: null}},
			read:  {type: "readAsText", parser: {type: "stringHTML"}},
			fetch: {type: "text",       parser: {type: "stringHTML"}},
		},
		/**|xml|Fornece parâmetros para o retorno do conteúdo como XML|**/
		xml:    {
			send:  {type: "text",       parser: {type: "stringXML"}},
			read:  {type: "readAsText", parser: {type: "stringXML"}},
			fetch: {type: "text",       parser: {type: "stringXML"}},
		},
		/**|json|Fornece parâmetros para o retorno do conteúdo como objeto javaScript|**/
		json:   {
			send:  {type: "json",       parser: {type: null}},
			read:  {type: "readAsText", parser: {type: "stringJSON"}},
			fetch: {type: "json",       parser: {type: null}},
		},
		/**|buffer|Fornece parâmetros para o retorno do conteúdo como Array Buffer|**/
		buffer: {
			send:  {type: "arraybuffer",       parser: {type: null}},
			read:  {type: "readAsArrayBuffer", parser: {type: null}},
			fetch: {type: "arrayBuffer",       parser: {type: null}},
		},
		/**|url|Fornece parâmetros para o retorno do conteúdo como URL|**/
		url:    {
			send:  {type: "blob",          parser: {type: "fileURL"}},
			read:  {type: "readAsDataURL", parser: {type: null}},
			fetch: {type: "blob",          parser: {type: "fileURL"}},
		},
		/**|matrix|Fornece parâmetros para o retorno do conteúdo CSV como um array de duas dimensões|**/
		matrix: {
			send:  {type: "text",       parser: {type: "csvTable.tableValues"}},
			read:  {type: "readAsText", parser: {type: "csvTable.tableValues"}},
			fetch: {type: "text",       parser: {type: "csvTable.tableValues"}},
		},
		/**|object|Fornece parâmetros para o retorno do conteúdo CSV como um array de objetos|**/
		object: {
			send:  {type: "text",       parser: {type: "csvTable.tableValues.matrixList"}},
			read:  {type: "readAsText", parser: {type: "csvTable.tableValues.matrixList"}},
			fetch: {type: "text",       parser: {type: "csvTable.tableValues.matrixList"}}
		},
		/**|table|Fornece parâmetros para o retorno do conteúdo CSV ou JSON como uma tabela HTML|**/
		table:  {
			send:  {type: "text",       parser: {type: "csvTable", json: "stringJSON.matrixCSV.csvTable"}},
			read:  {type: "readAsText", parser: {type: "csvTable", json: "stringJSON.matrixCSV.csvTable"}},
			fetch: {type: "text",       parser: {type: "csvTable", json: "stringJSON.matrixCSV.csvTable"}}
		},
	};

/*----------------------------------------------------------------------------*/
	/**#4 Resposta
	''constructor object __Response(__Request object)''
	Construtor para respostas a a{requisições Web}[href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest"] ou leituras de a{arquivos}[href="https://developer.mozilla.org/en-US/docs/Web/API/FileReader"] efetuadas por meio do objeto __Request, que deve ser seu argumento. A cada interação, a função '{trigger}, se definida em __Request, será disparada recebendo um objeto com as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|done|boolean|Indica o fim do processo|
	|ok|boolean|Indica, ao fim do processo, o sucesso ao obter os dados|
	|status|string|Traz informações sobre o processo ou nulo|
	|time|integer|Indica o tempo de execução do processo|
	|size|integer|Indica a quantidade de trabalho do processo|
	|progress|float|Indica o progresso do processo (de 0 a 1)|
	|headers|object|Traz, ao fim do processo, o cabeçalho de retorno ('{Headers object}) ou nulo|
	|response|any|Traz, ao fim do processo, o conteúdo do procedimento ou nulo.|
	|abort|function|Uma função para abortar o procedimento ou nulo.|
	|mime|string|Retorna o tipo de arquivo proveniente do cabeçalho ou nulo.|**/
	function __Response(request) {
		if (!(this instanceof __Response)) return new __Response(request);
		if (typeof request !== "object" || !(request instanceof __Request))
			throw new TypeError("Input value must be an instance of __Request.");
		const date = new Date();
		Object.defineProperties(this, {
			id:       {value: __PROGRESS.open()},
			request:  {value: request},
			start:    {value: new Date()},
			/*-- retornam ao usuário --*/
			time:     {value: 0,     writable: true},
			done:     {value: false, writable: true},
			ok:       {value: false, writable: true},
			status:   {value: null,  writable: true},
			size:     {value: 0,     writable: true},
			progress: {value: 0,     writable: true},
			headers:  {value: null,  writable: true},
			response: {value: null,  writable: true},
			abort:    {value: null,  writable: true},
			mime:     {value: null,  writable: true},
		});
	}
	Object.defineProperties(__Response.prototype, {
		constructor: {value: __Response},
		/**. '{void _changes(string type, string caller)}: Define o formato da resposta ('{_response.response}) conforme tipo ('{type}) e o método ('{caller}).**/
		handleEvent: {
			value: function(ev) {
				if (!this.done) {
					/*-- obter o tempo de execução (time) --*/
					const date = new Date();
					const time = date.valueOf() - this.start.valueOf();
					this.time  = time%2 === 0 ? time : time+1;
					/*-- Obter dados conforme método chamado em __Request --*/
					let call;
					if (typeof ev !== "object")
						throw new Error("__Response: The event value must be an object.");
					else if (ev.target instanceof XMLHttpRequest)
						call = "send";
					else if (ev.target instanceof FileReader)
						call = "read";
					else if (ev instanceof Response)
						call = "fetch";
					else if (ev instanceof Error)
						call = "error";
					else
						throw new Error("__Response: Unknown event.");
					this[call](ev);
					/*-- renderizar progresso --*/
					__PROGRESS.value(this.id, this.progress);
					/*-- headers/mime --*/
					if (this.headers !== null) {
						const header = new __DataSet(this.headers);
						this.headers = header.toHeaders;
						const list   = header.getAll("content-type");
						this.mime    = list.length > 0 ? list[0] : null;
					}
					/*-- response --*/
					if (this.response !== null) {
						const data    = this.request.data[call].responseTypeParser;
						const chain   = this.mime in data ? data[this.mime] : data.type;
						const names   = chain === null ? [] : chain.split(".");
						let   parser  = new __Parser(this.response);
						names.forEach(function(v,i,a) {parser = parser[v];});
						this.response = parser.get();
					}
					/*-- chamando o método --*/
					if (this.request.trigger !== null) {
						/*-- definindo o argumento --*/
						const arg = {
							done:    this.done,    ok:    this.ok,   status:   this.status,
							time:    this.time,    size:  this.size, progress: this.progress,
							headers: this.headers, mime:  this.mime, response: this.response,
							abort:   this.abort,   error: this.error
						};
						/*-- não se sabe quanto tempo vai demorar a função do usuário --*/
						if (this.done) __PROGRESS.value(this.id);
						try      {this.request.trigger(arg);}
						catch(e) {this.done = true;}
					}
					/*-- encerrando o progresso --*/
					if (this.done) __PROGRESS.close(this.id);
				}
			}
		},
		/**. '{void error(object ev)}: Obtém os dados para o disparador invocado por um erro.**/
		error: {
			value: function(ev) {
				this.progress = 1;
				this.done     = true;
				this.ok       = false;
				this.status   = `${ev.name} ${ev.message}`;
				return;
			}
		},
		/**. '{void send(object ev)}: Obtém os dados para o disparador invocado pelo método '{send} de __Request.**/
		send: {
			value: function(ev) {
				/*-- atributos gerais --*/
				this.abort    = this.abort === null ? function() {ev.target.abort();} : this.abort;
				this.size     = ev.lengthComputable ? ev.total : this.size;
				this.progress = ev.lengthComputable && ev.total !== 0 ? ev.loaded/ev.total : this.progress;
				this.status   = `${ev.target.status} ${ev.target.statusText}`;
				/*-- fim da requisição --*/
				const done    = {loadend: 1, error: 0, abort: 0, timeout: 0};
				if (ev.type in done) {
					const fail  = done[ev.type] === 0;
					this.done   = true;
					this.status = fail ? ev.type : this.status;
					this.ok     = fail ? false : (ev.target.status >= 200 && ev.target.status < 300);
				}
				/*-- Requisição encerrada com sucesso --*/
				if (this.ok) {
					this.headers  = ev.target.getAllResponseHeaders();
					this.response = ev.target.response;
				}
				return;
			}
		},
		/**. '{void read(object ev)}: Obtém os dados para o disparador invocado pelo método '{read} de __Request.**/
		read: {
			value: function(ev) {
				/*-- checando timeout forçado --*/
				const status  = ["EMPTY", "LOADING", "DONE"];
				const timeout = this.request.data.read.timeout;
				const expired = timeout > 0 && this.time > timeout;
				/*-- atributos gerais --*/
				this.abort    = this.abort === null ? function() {ev.target.abort();} : this.abort;
				this.size     = ev.lengthComputable ? ev.total : this.size;
				this.progress = ev.lengthComputable && ev.total !== 0 ? ev.loaded/ev.total : this.progress;
				this.status   = `${ev.target.readyState} ${status[ev.target.readyState]}`;
				/*-- fim da requisição --*/
				const done = {loadend: 1, error: 0, abort: 0};
				if (ev.type in done || expired) {
					const fail = done[ev.type] === 0 || expired;
					this.done  = true;
					this.status = fail ? (expired ? "timeout" : ev.type) : this.status;
					this.ok     = !fail;
					if (expired) ev.target.abort();
				}
				/*-- Requisição encerrada com sucesso --*/
				if (this.ok) {
					this.headers  = {
						"content-length": this.request.data.read.url.size,
						"content-type":   this.request.data.read.url.type,
					};
					this.response = ev.target.result;
				}
				return;
			}
		},
		/**. '{void fetch(object ev)}: Obtém os dados para o disparador invocado pelo método '{fetch} de __Request.**/
		fetch: {
			value: function(ev) {
				const data = this.request.data.fetch;
				/*-- primeira iteração --*/
				if (this.progress === 0) {
					/*-- erro na requisição: encerrar --*/
					if (!ev.ok) {
						this.done     = true;
						this.ok       = false;
						this.progress = 1;
						this.status   = `${ev.status} ${ev.statusText}`;
					}
					/*-- sucesso na requisição: carregar dados --*/
					else {
						/*-- carregar dados: em processo --*/
						this.status   = "LOADING";
						this.progress = 0.45;
						this.size     = ev.headers.has("content-length") ? Number(ev.headers.get("content-length")) : 0;
						const type    = this.request.data.fetch.responseTypeData;
						const self    = this;
						/*-- processo de carregamento --*/
						return ev[type]()
						.then(function(value) {
							self.status        = "READY";
							self.progress      = 0.90;
							data.fetchResponse = value;
							self.handleEvent(ev);
						})
						.catch(function(error) {
							self.status   = `${error.name} ${error.message}`;
							self.progress = 0.90;
							self.handleEvent(ev);
						});
					}
				}
				/*-- carregar dados: encerrado --*/
				else if (this.progress >= 0.90) {
					this.done     = true;
					this.ok       = true;
					this.status   = `${ev.status} ${ev.statusText}`;
					this.progress = 1;
					this.headers  = ev.headers;
					this.response = "fetchResponse" in data ? data.fetchResponse : null;
				}
				return;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 Requisição
	''constructor object __Request(object config)''
	Construtor para a{requisições Web}[href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest"] ou leituras de a{arquivos}[href="https://developer.mozilla.org/en-US/docs/Web/API/FileReader"]. O argumento '{config} aceita os mesmos valores do objeto '{__Dataset} e contém as propriedades da requisição de acordo com o método escolhido, sendo os básicos:
	|Nome|Referência|Aplicação|Padrão|
	|url|Alvo da requisição ou da leitura, não necessariamento um URL|'{send read fetch}||
	|method|a{Método da requisição}[href="https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods"]|'{send fetch}|"post"|
	|type|Tipo de resposta a retornar|'{send read fetch}|"text"|
	|headers|Cabeçalhos a enviar (ver __DataSet)|'{send fetch}||
	|body|Dados a enviar na requisição|'{send fetch}||
	|timeout|Tempo de espera pela resposta|'{send read}|0|
	|trigger|Disparador a ser chamado durante o progresso|'{send read fetch}|**/
	function __Request(config) {
		if (!(this instanceof __Request)) return new __Request(config);
		const info   = new __DataSet(config);
		const data   = info.toObject;
		const method = ["post", "connect", "delete", "get", "head", "options", "patch", "put", "trace"];
		/*-- acertando dados gerais --*/
		data.type    = String(data.type).toLowerCase();
		data.type    = data.type in __RESPONSETYPES ? data.type : "text";
		data.method  = String(data.method).toLowerCase();
		data.method  = method.indexOf(data.method) >= 0 ? data.method : method[0];
		data.headers = new __DataSet(data.headers);
		data.timeout = isFinite(data.timeout) && Number(data.timeout) > 0 ? Math.trunc(Number(data.timeout)) : 0;
		if ("body" in data && data.method === "get" || data.method === "head")
			delete data.body;
		/*-- copiando dados para main (exceto type e trigger) --*/
		const main = {send: {}, read: {}, fetch: {}};
		for (let i in main) {
			main[i].responseTypeData   = __RESPONSETYPES[data.type][i].type;
			main[i].responseTypeParser = __RESPONSETYPES[data.type][i].parser;
			for (let j in data)
				main[i][j] = data[j];
		}
		/*-- acertando dados específicos --*/
		main.send.headers  = main.send.headers.toObjectHeaders;
		main.read.headers  = {};
		main.fetch.headers = main.fetch.headers.toHeaders;
		/*-- para send --*/
		const send = {async: true, user: null, password: null};
		for (let i in send)
			main.send[i] = i in main.send ? main.send[i] : send[i];
 		Object.defineProperties(this, {
 			trigger: {value: typeof data.trigger === "function" ? data.trigger : null},
 			data:    {value: main},
		});
	}
	Object.defineProperties(__Request.prototype, {
		constructor: {value: __Request},
		/**. '{void send()}: Envia uma requisição ao servidor via '{XMLHttpRequest}. Propriedades opcionais específicas:
		|Nome|Descrição|
		|async|Indica se a requisição é assíncrona (padrão verdadeiro)|
		|user|Usuário (padrão nulo)|
		|password|Senha (padrão nulo)|
		|withCredentials|Aplica-se à propriedade de mesmo nome|
		|overrideMimeType|Aplica-se ao método de mesmo nome|**/
		send: {
			value: function(trigger) {
				const data     = this.data.send;
				const request  = new XMLHttpRequest();
				const response = new __Response(this);
				try {
					request.open(data.method, data.url, data.async, data.user, data.password);
					request.responseType = data.responseTypeData;
					request.timeout      = data.timeout;
					for (let i in data.headers)
						request.setRequestHeader(i, data.headers[i]);
					if ("withCredentials" in data)
						request.withCredentials = data.withCredentials;
					if ("overrideMimeType" in data)
						request.overrideMimeType(data.overrideMimeType);
					/*-- atribuindo disparadores aos eventos --*/
					const events = ["abort", "error", "load", "loadend", "loadstart", "progress", "timeout"];
					events.forEach(function(event,i,a) {
						if (`on${event}` in request)
							request.addEventListener(event, response);
						if (`on${event}` in request.upload)
							request.upload.addEventListener(event, response);
					});
					/*-- executar a requisição --*/
					request.send(data.body);
				} catch(e) {
					response.handleEvent(e);
				}
				return;
			},
		},
		/**. '{void read()}: Lê um arquivo via '{FileReader}.**/
		read: {
			value: function() {
				const data = this.data.read;
				const test = new __Type(data.url);
				/*-- se for uma lista de arquivos, chamar para cada um deles --*/
				if (test.instanceOf("FileList")) {
					const list = data.url;
					for (let i = 0; i < list.length; i++) {
						data.url = list[i];
						let request = new __Request(data);
						request.read();
					}
					return;
				}
				/*-- um único arquivo --*/
				const request  = new FileReader();
				const response = new __Response(this);
				try {
					/*-- atribuindo disparadores aos eventos --*/
					const events = ["abort", "error", "load", "loadend", "loadstart", "progress", "timeout"];
					events.forEach(function(event,i,a) {
						if (`on${event}` in request)
							request.addEventListener(event, response);
					});
					/*-- executar a requisição --*/
					request[data.responseTypeData](data.url);
				} catch(e) {
					response.handleEvent(e);
				}
				return;
			},
		},
		/**. '{void fetch()}: Envia uma requisição ao servidor via '{fetch}. As propriedades são iguais a do método nativo, exceto i{url}.**/
		fetch: {
			value: function() {
				const response = new __Response(this);
				try {
					fetch(this.data.fetch.url, this.data.fetch)
					.then(function(output)  {response.handleEvent(output);})
					.catch(function(output) {response.handleEvent(output);});
				} catch(e) {
					response.handleEvent(e);
				}
				return;
			}
		}
	});

/*============================================================================*/
	/**#3 Números
	''constructor object __Number(number input=0)''
	Construtor para manipulação de números. O argumento '{input} se refere ao número de entrada do construtor.**/
	function __Number(input) {
		if (!(this instanceof __Number)) return new __Number(input);
		let check = __Type(input);
		if (!check.number) throw new TypeError("Value entered is not a valid number.");
		Object.defineProperties(this, {
			_check: {value: check},
			value:  {value: check.value},
		});
	}

	Object.defineProperties(__Number.prototype, {
		constructor: {value: __Number},
		/**. '{array _primes}: Lista de números primos até 1000.**/
		_primes: {value: [
			2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,
			103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,
			199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,
			313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,
			433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,
			563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,
			673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,
			811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,
			941,947,953,967,971,977,983,991,997
		]},
		/**. '{boolean finite}: Checa se o número é finito.**/
		finite: {get: function() {return this._check.finite;}},
		/**. '{number valueOf()}: Retorna o valor numérico.**/
		valueOf: {value: function() {return this.value;}},
		/**. '{number toString()}: Retorna o valor em forma de string.**/
		toString: {value: function() {return this._check.toString()}},
		/**. '{number abs}: Retorna o valor absoluto do número.**/
		abs: {get: function() {return Math.abs(this.value);}},
		/**. '{integer int}: Retorna a parte inteira do número.**/
		int: {get: function() {return Math.trunc(this.value);}},
		/**. '{string type}: Retorna o tipo do número (zero, infinite, integer, decimal).**/
		type: {
			get: function() {
				const types = ["infinite", "zero", "integer", "decimal"];
				for (let i = 0; i < types.length; i++)
					if (this._check[types[i]] === true) return types[i];
				return "unknow";
			}
		},
		/**. '{string random(object options)}: Retorna conjuntos de números inteiros "aleatórios" conforme especificado no argumento '{options}:
		|Nome|Descrição|
		|min|Número inteiro que indica o menor valor do conjunto|
		|max|Número inteiro que indica o maior valor do conjunto|
		|len|Número inteiro que indica o tamanho do conjunto|
		|set|Número inteiro que indica a quantidade de conjuntos|**/
		random: {
			value: function(options) {
				/*-----------------------------------------------
				let a = new Uint8Array(len);
				window.crypto.getRandomValues(a)
				-----------------------------------------------*/
				if (!__Type(options).object) options = {};
				const min  = "min" in options ? Number(options.min) : 1;
				const max  = "max" in options ? Number(options.max) : 60;
				const len  = "len" in options ? Number(options.len) : 6;
				const set  = "set" in options ? Number(options.set) : 3;
				const bets = [];
				let bet, list, num;
				while (bets.length < set) {
					list = [];
					while (list.length < len) {
						num = Math.trunc(min) + Math.trunc(max*Math.random());
						if (list.indexOf(num) < 0) list.push(num);
					}
					list.sort(function (a,b) {return a < b ? -1 : 1;});
					bet = list.join("\t");
					if (bets.indexOf(bet) < 0) bets.push(bet);
				}
				return bets.join("\n");
			}
		},
		/**. '{array crypto(integer bit, integer len)}: Retorna uma lista de '{len} itens contendo números inteiros de comprimento '{bit} (8, 16 ou 32).**/
		crypto: {
			value: function(bit, len) {
				bit = Number(bit);
				len = Number(len);
				len = isFinite(len) && len >= 1 ? Math.trunc(len) : 1;
				let array;
				switch(bit) {
					case 32: array = new Uint32Array(len); break;
					case 16: array = new Uint16Array(len); break;
					default: array = new Uint8Array(len);  break;
				}
				window.crypto.getRandomValues(array);
				return array;
			}
		},
		/**. '{float dec}: Retorna a parte decimal do número (zero se infinito ou inteiro).**/
		dec: {
			get: function() {
				if (this.type !== "decimal") return 0;
				if (this.abs < 1) return this.value;
				const sign = this.value < 0 ? "-0." : "0.";
				return Number(sign+String(this.value).split(".")[1]);
			}
		},
		/**. '{number fixed(integer length, boolean round)}: Fixa a quantidade máxima de casas decimais definidas em '{length}. O argumento '{round}, se falso, não arredondará o valor.**/
		fixed: {
			value: function(length, round) {
				if (this.type !== "decimal") return this.value;
				round  = round !== false;
				length = isFinite(length) && Number(length) >= 0  ? Math.trunc(Number(length)) : 0;
				const fixed = Number(this.value.toFixed(length));
				const base  = Math.pow(10, length);
				const cut   = Math.trunc(base*this.value)/base;
				return round ?  fixed : cut;
			}
		},
		/**. '{array primes}: Retorna uma lista com os números primos até o número informado.**/
		primes: {
			get: function() {
				if (this.abs < 2) return [];
				const value = this.abs;
				/*-- Checando se o número primo já consta na lista --*/
				const last = this._primes[this._primes.length - 1];
				if (value <= last) {
					let i = 0;
					while (value >= this._primes[i]) i++;
					return this._primes.slice(0, i);
				}
				/*-- Adicionando novos números primos --*/
				for (let num = last+2; num <= value; num += 2) {
					for (let item = 0; item < this._primes.length; item++) {
						if (num % this._primes[item] === 0)
							break;
						else if (item === this._primes.length - 1)
							this._primes.push(num);
					}
				}
				return this._primes;
			}
		},
		/**. '{boolean prime}: Checa se número é primo.**/
		prime: {
			get: function() {
				/*-- testar se é um inteiro maior que 1 --*/
				if (this.type !== "integer" || this.value < 2)
					return false;
				/*-- testar se ele já existe na lista --*/
				if (this.value <= this._primes[this._primes.length - 1])
					return this._primes.indexOf(this.value) >= 0;
				/*-- verificando se não é divisível por primo --*/
				for (let i = 0; i < this._primes.length; i++)
					if (this.value%this._primes[i] === 0) return false;
				/*-- capturando novos primos até a raiz do número --*/
				new __Number(this.value).primes;
				return this.prime;
			}
		},
		/**. '{array factorization}: Retorna a fatorização do inteiro em números primos.**/
		factorization: {
			get: function() {
				if (this.type !== "integer") return [];
				const list = [];
				let value  = Math.abs(this.int);
				let primes = this._primes;
				let item   = 0;
				/*-- Looping sobre os primos existentes --*/
				while (value >= primes[item] && item < primes.length) {
					if (value%primes[item] === 0) {
						value = value / primes[item];
						list.push(primes[item]);
					} else {item++;}
				}
				/*-- Looping sobre os primos extraordinários --*/
				if (value > 1) {
					new __Number(value).primes;
					while (value >= primes[item] && item < primes.length) {
						if (value%primes[item] === 0) {
							value = value / primes[item];
							list.push(primes[item]);
						} else {item++;}
					}
				}
				return list;
			}
		},
		/**. '{number gcd(...)}: Retorna o máximo divisor comum de números inteiros comparando o número informado com aqueles passados como argumento.**/
		gcd: {
			value: function() {
				const fact = this.factorization;
				const gcd  = [1];
				const args = [];
				/*-- Capturando a fatorização dos argumentos --*/
				for (let i = 0; i < arguments.length; i++) {
					let check = __Type(arguments[i]);
					if (check.integer) {
						let number = new __Number(check.value);
						args.push(number.factorization)
					}
				}
				/*-- Checando fatores em comum --*/
				for (let i = 0; i < fact.length; i++) {
					let found = true;
					let value = fact[i];
					for (let j = 0; j < args.length; j++) {
						let index = args[j].indexOf(value);
						if (index < 0) {
							found = false;
							break;
						} else {
							args[j][index] = null;
						}
					}
					if (found) gcd.push(value);
				}
				/*-- Calculando Máximo Divisor Comum --*/
				let value = 1;
				for (let i = 0; i < gcd.length; i++) value = value * gcd[i];
				return value;
			}
		},
		/**. '{string frac}: Retorna a notação numérica em forma de fração com máximo de 6 dígitos no numerador e aproximação de até 6 casas decimais.**/
		frac: {
			get: function() {
				if (this.type !== "decimal") return this.toString();
				/*--x = a/b = a/(a+n), n = a(1/x-1)--*/
				const int = this.int;
				const dec = Math.abs(this.dec);
				const num = int !== 0 ? String(int)+" " : (this.value < 0 ? "-" : "");
				const max = 1e6; /*-- número máximo de dígitos do numerador --*/
				const err = 6;   /*-- número de casas a arrendondar na checagem  --*/
				let   dnd = 0;   /*-- dividendo --*/
				let   div = 0.5; /*-- divisor (valor não inteiro por causa do while) --*/
				while (!Number.isInteger(div) && ++dnd < max)
				  div = Number((dnd/dec).toFixed(err));
				/*-- caso não tenha encontrado o valor dentro do limite --*/
				if (!Number.isInteger(div)) {
					const str = String(dec.toFixed(err)).split(".")[1];
					dnd = str.replace(/^0+/, "");
					div = String(Math.pow(10, str.length));
					while((dnd%2 === 0 && div%2 === 0) || (dnd%5 === 0 && div%5 === 0)) {
					  let gcd = dnd%2 === 0 && div%2 === 0 ? 2 : 5;
					  dnd = dnd/gcd;
					  div = div/gcd;
					}
				}
				return num+String(dnd)+"/"+String(div);
			}
		},
		/**. '{string bytes}: Retorna a notação em bytes (de i{B} a i{YB}).**/
		bytes: {
			get: function() {
				if (!this.finite) return this.toString()+" B";
				if (this.value < 1)
				 return this.value <= 0 ? "0 B" : Math.trunc(8*this.value)+" b";
				const scale = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
				let exp = scale.length;
				let int = this.int;
				while (--exp >= 0) {
					let pow = Math.pow(1024, exp);
					if (int >= pow) return (int/pow).toFixed(2)+" "+scale[exp];
				}
				return int+" B";
			}
		},
		/**. '{number exp}: Retorna o expoente do número em base 10.**/
		exp: {
			get: function() {
				if (!this.finite || this.value === 0) return !this.finite ? 0 : Infinity;
				let value = this.abs;
				let n = 0;
				while (value < 1 || value >= 10) {
					n    += value < 1 ? -1 : +1;
					value = value * (value < 1 ? 10 : 1/10);
				}
				return n;
			}
		},
		/**. '{string toLocaleString(object options)}: Retorna o número no formato local de acordo com as [configurações]<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat> definidas no argumento '{options}, que possui as seguintes propriedades:
|Nome|Tipo|Descrição|Obrigatório|
|type|string|Tipo de notação a ser exibida|Sim|
|value|string|Informação complementar ao tipo de notação|Depende do tipo de notação|
|display|string|Forma da exibição da notação|Não|
|group|boolean|Separador de milhar|Não|
|decimal|integer|Quantidade de casas decimais (0-20)|Não|
|integer|integer|Quantidade de números inteiros (1-21)|Não|
|digits|integer|Quantidade de números significativos (0-20)|Não|
|sign|string|Exibição do sinal (auto, always, exceptZero, negative, never)|Não|
. Os seguintes tipos são possíveis&colon;
|type|value|display|
|unit|[unidade de medida]<https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier>|short, long, narrow|
|currency|[código monetário]<https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=currency-codes>|symbol, narrowSymbol, name, code|
|compact||short, long|
|percent|||
|scientific|||
|engineering|||
|decimal|||**/
		toLocaleString: {
			value: function(options) {
				if (typeof options !== "object") options = {};
				/*-- {attr: real, name: atalho, values: opções (0 é padrão)} --*/
				const properties = {
					currency: [
						{attr: "style",           name: null,      values: ["currency"]},
						{attr: "currencyDisplay", name: "display", values: ["symbol", "narrowSymbol", "name", "code"]},
						{attr: "currency",        name: "value",   values: []}
					],
					unit: [
						{attr: "style",       name: null,      values: ["unit"]},
						{attr: "unit",        name: "value",   values: []},
						{attr: "unitDisplay", name: "display", values: ["short", "long", "narrow"]},
					],
					percent: [
						{attr: "style", name: null, values: ["percent"]},
					],
					scientific: [
						{attr: "style",    name: null, values: ["decimal"]},
						{attr: "notation", name: null, values: ["scientific"]},
					],
					engineering: [
						{attr: "style",    name: null, values: ["decimal"]},
						{attr: "notation", name: null, values: ["engineering"]},
					],
					compact: [
						{attr: "style",          name: null,      values: ["decimal"]},
						{attr: "notation",       name: null,      values: ["compact"]},
						{attr: "compactDisplay", name: "display", values: ["short", "long"]},
					],
					decimal: [ /*-- padrão --*/
						{attr: "style",    name: null, values: ["decimal"]},
					],
				};
				const property = options.type in properties ? properties[options.type] : properties.decimal;
				/*-- obtendo os dados de configuração --*/
				const config = {};
				for (let i = 0; i < property.length; i++) {
					let item = property[i];
					/*-- propriedade não configurável (name = null) --*/
					if (item.name === null) {
						config[item.attr] = item.values[0];
					}
					/*-- propriedade configurável sem valores definidos (values = []) --*/
					else if (item.values.length === 0) {
						if (item.name in options)
							config[item.attr] = String(options[item.name]);
					}
					/*-- propriedade configurável com valores definidos (values = [...]) --*/
					else {
						let index = item.values.indexOf(options[item.name]);
						config[item.attr] = item.values[index < 0 ? 0 : index];
					}
				}
				/*-- propriedades opcionais --*/
				const intList = new Array(22);
				for (let i = 0; i < intList.length; i++) intList[i] = i;

				if ("sign" in options) {
					let value = ["auto", "always", "exceptZero", "negative", "never"];
					let index = value.indexOf(options.sign);
					if (index >= 0) config.signDisplay = value[index];
				}
				if ("group" in options) {
					let value = ["auto", true, false];
					let index = value.indexOf(options.group);
					if (index >= 0) config.useGrouping = value[index];
				}
				if ("digits" in options) {
					let value = intList.slice(1,22);
					let index = value.indexOf(Number(options.digits));
					if (index >= 0) {
						config.minimumSignificantDigits = value[index];
						config.maximumSignificantDigits = value[index];
					}
				}
				if (!("minimumSignificantDigits" in config)) {
					/* Significant é prevalente sobre Fraction e Integer */
					if ("integer" in options) {
						let value = intList.slice(1,22);
						let index = value.indexOf(Number(options.integer));
						if (index >= 0) config.minimumIntegerDigits = value[index];
					}
					if ("decimal" in options) {
						let value = intList.slice(0,21);
						let index = value.indexOf(Number(options.decimal));
						if (index >= 0) {
							config.minimumFractionDigits = value[index];
							config.maximumFractionDigits = value[index];
						}
					} else if (config.style !== "currency") {
						config.maximumFractionDigits = 20;
					}
				}
				/*-- Retornando valor --*/
				try      {return this.value.toLocaleString(__LANG.value, config);}
				catch(e) {return this.value.toLocaleString(__LANG.value);}
			}
		},
	});
/*===========================================================================*/
	/**#3 Caracteres
	''constructor object __String(string input)''
	Construtor para manipulação de textos. O argumento '{input} define o texto de entrada.**/
	/*-- https://symbl.cc/pt/unicode-table/ --*/
	function __String(input) {
		if (!(this instanceof __String)) return new __String(input);
		input = String(input).normalize("NFC");
		Object.defineProperties(this, {
			_value:  {value: input},
			_parser: {value: new __Parser(input)}
		});
	}

	Object.defineProperties(__String.prototype, {
		constructor: {value: __String},
		/**. '{string valueOf()}: Retorna o valor de entrada.**/
		valueOf: {value: function() {return this._value;}},
		/**. '{string toString()}: Retorna o valor de entrada.**/
		toString: {value: function() {return this._value;}},
		/**. '{string length}: Retorna a quantidade de caracteres.**/
		length: {get: function() {return this._value.length;}},
		/**. '{string upper}: Retorna o valor de entrada em caixa alta.**/
		upper: {get: function() {return this._value.toUpperCase();}},
		/**. '{string lower}: Retorna o valor de entrada em caixa baixa.**/
		lower: {get: function() {return this._value.toLowerCase();}},
		/**. '{string lean}: Retorna o valor de entrada em linha sem espaços extras.**/
		lean: {get: function() {return this._value.replace(/\s+/g, " ").trim();}},
		/**. '{string like}: Retorna o conteúdo textual para fins de comparação por equivalência.**/
		like: {get: function() {return this._value.normalize("NFKC");}},
		/**. '{string clean}: Retorna o valor de entrada sem o intervalo unicode \u0300-\u036f.**/
		clean: {
			get: function() {
				const re = /[\u0300-\u036f]/g;
				return this._value.normalize("NFD").replace(re, "").normalize("NFC");
			}
		},
		/**. '{string near}: Como o '{like}, mas sem acento.**/
		near: {
			get: function() {
				const re = /[\u0300-\u036f]/g
				return this._value.normalize("NFKD").replace(re, "").normalize("NFKC");
			}
		},
		/**. '{string toggle}: Inverte a caixa.**/
		toggle: {
			get: function() {
				const chars = this._value.split("");
				chars.forEach(function(v,i,a) {
					a[i] = v === v.toUpperCase() ? v.toLowerCase() : v.toUpperCase();
				});
				return chars.join("");
			}
			},
		/**. '{string captalize}: Caixa alta na primeira letra de cada palavra apenas.**/
		capitalize: {
			get: function() {
				const chars = this._value.split("");
				chars.forEach(function(v,i,a) {
					let space = i === 0 || (/\s/).test(a[i-1]);
					a[i] = space ? v.toUpperCase() : v.toLowerCase();
				});
				return chars.join("");
			}
		},
		/**. '{string clear(boolean white, boolean accent)}: Limpa espaços desnecessários ou acentos. O argumento '{white}, se diferente de falso, limpa os espaços extras e o argumento '{accent}, se diferente de falso, remove os acentos.**/
		clear: {
			value: function(white, accent) {
				let value = this.valueOf();
				if (white !== false)
					value = value.replace(/\s+/g, " ").trim();
				if (accent !== false)
					value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				return value.normalize();
			}
		},
		/**. '{string mask(string model)}: Checa se a string casa com o formato de máscara definido no argumento '{model} e retorna uma string vazia em caso de insucesso ou os caracteres formatados:
		|Manipulador|Descrição|
		|#|Exige um dígito.|
		|@|Exige um não dígito.|
		|*|Exige um valor qualquer.|
		|?|Separa modelos alternativos caso o anterior não case.|
		|%|Cancela o efeito do manipulador que o precede.|
		. Exemplos:
		|Modelo|Valor|Retorno|
		|##/##/####|01234567|01/23/4567|
		|(##) # ####-####?(##) ####-####|01234567890|(01) 2 3456-7890|
		|(##) # ####-####?(##) ####-####|0123456789|(01) 2345-6789|**/
		mask: {
			value: function(model) {
				/*-------------------------------------------------
					char: lista de caracteres de entrada
					c:    índice do caracter do texto de entrada
					mask: lista de caracteres da máscara
					m:    índice do caracter do modelo da máscara
					base: lista de caracteres de saída
					code: caracteres manipuladores
					ok:   condição do casamento da máscara
			  -------------------------------------------------*/
			  const char = this._value.split("");
				const mask = String(model).split("");
				const code = "#@*%";
				let c = 0, m = -1, ok = true, base = [];
				/*-- looping sobre cada caracteres do modelo --*/
				while (++m < mask.length) {
					/*-- Não fazer nada quando um caracter do modelo for definido como nulo --*/
					if (mask[m] === null) {
						continue;
					}
					/*-- Checar o casamento da máscara ao fim de cada modelo --*/
					else if (mask[m] === "?") {
						/*-- máscara bateu? já checou todos os caracteres de entrada? --*/
						if (ok && c === char.length) return base.join("");
						ok = true; c = 0; base = [];
					}
					/*-- Checar caractere manipulador a ser fixado como caractere comum --*/
					else if (ok && mask[m] === "%") {
						let fixed = code.indexOf(mask[m+1]) >= 0;
						let point = fixed ? mask[m+1] : mask[m];
						base.push(point);
						if (fixed) mask[m+1] = null;
						/*-- Se o caractere do modelo tiver sido informado na entrada, avançar na checagem --*/
						c += char[c] === point ? 1 : 0;
					}
					/*-- Checar se o caractere de entrada casa com o manipulador --*/
					else if (ok && code.indexOf(mask[m]) >= 0) {
						switch(mask[m]) {
							case "#": {ok = (/^\d$/).test(char[c]); break;}
							case "@": {ok = (/^\D$/).test(char[c]); break;}
							case "*": {ok = (/^\.$/).test(char[c]); break;}
						}
						if (ok) {
							base.push(char[c]);
							c++;
						} else {
							base = [];
							c = 0;
						}
					}
					/*-- Adicionar o caractere não manipulador do modelo à saída --*/
					else if (ok) {
						base.push(mask[m]);
						/*-- Se o caractere do modelo tiver sido informado na entrada, avançar na checagem --*/
						c += char[c] === mask[m] ? 1 : 0;
					}
				}
				/*-- máscara bateu? já checou todos os caracteres de entrada? --*/
				return (ok && c === char.length) ? base.join("") : "";
			}
		},
		/**. '{string dash}: Retorna uma string identificadora no formato de traços (alfabetos latinos).**/
		dash: {
			get: function() {
				const only  = /(\s|\-)+/g;
				const trash = /[^a-zA-Z0-9_.:\-]/g;
				const trim  = /^\-+|\-+$/g;
				const chars = this.clean.replace(only, "-").replace(trash, "").replace(trim, "");
				if (chars.indexOf("-") >= 0)
					return chars.toLowerCase()
				return chars.replace(/[A-Z]/g, function(x) {return "-"+x.toLowerCase();});
			}
		},
		/**. '{string camel}: Retorna uma string identificadora no formato de camelCase (alfabetos latinos).**/
		camel: {
			get: function() {
				return this.dash.replace(/\-./g, function(x) {return x[1].toUpperCase();})
			}
		},
		/**. '{matrix csv}: Retorna uma matriz (array) a partir de uma string CSV.**/
		csv: {get: function() {return this._parser.csvTable.tableValues.matrixCSV.get();}},
		/**. '{object json}: Retorna objeto JSON a partir de uma string nesse formato.**/
		json: {get: function() {return this._parser.stringJSON.get();}},


		chain: {
			value: function(name) {
				//FIXME
				const data = Object.getOwnPropertyDescriptor(__String.prototype, name);
				const test = new __Type(typeof data === "object" ? data.get : null);
				return test.function ? new __String(this[name]) : this;
			}


		},

	});

/*----------------------------------------------------------------------------*/
	/**#3 Código
	''constructor object __Code(string input)''
	Construtor para manipulação de textos com formatação de códigos. O argumento '{input} define o código fonte.**/
	function __Code(input) {
		if (!(this instanceof __Code)) return new __Code(input);
		this.input = input;
		Object.defineProperties(this, {
			_input:   {writable: true,  value: ""},
			_frames:  {writable: false, value: {linear: null, xml: null, html: null}},
			_string:  {writable: true,  value: []},
			_comment: {writable: true,  value: []},
			_word:    {writable: true,  value: []},
			_value:   {writable: true,  value: []},
			_flags:   {writable: false, value: "/^(TODO|FIXME|OPTIMIZE|HACK|REVIEW)\ /"}
		});
		return;
	}

	Object.defineProperties(__Code.prototype, {
		constructor: {value: __Code},
		/**. '{array _ends}: Caracteres de controle fixo de encerramento.**/
		_ends: {
			value: {
				word:  "/^([()\\[\\]{},;]|\\s)/",
				value: "/^([()\\[\\]{},;!=|&+\\-%/*^?:]|\\s|\\>|\\>)/"
			}
		},
		/**. '{string _translate(string input)}: Altera codificação HTML adaptada para padrão.**/
		_translate: {
			value: function(input) {
				const tags = [
					"line", "doc", "tag", "attr", "script", "flag", "trash",
					"number", "value", "word", "comment", "string", "scope"
				];
				for (let i = 0; i < tags.length; i++) {
					let tag   = tags[i];
					let find1 = new RegExp(`\\<wd\\-${tag}\\>`, "g");
					let find2 = new RegExp(`\\<\\/wd\\-${tag}\\>`, "g");
					let swap1 = `<span data-wd-encoding="${tag}">`;
					let swap2 = `</span>`;
					input = input.replace(find1, swap1);
					input = input.replace(find2, swap2);
				}
				return input;
			}
		},
		/**. '{object frames}: Retorna os caracteres de controle.**/
		frames: {
			get: function() {
				const type  = this.type;
				if (this._frames[type] !== null) return this._frames[type];
				const isre   = /^\/.+\/([a-z]+)?$/i
				const data   = [];
				const frames = type === "xml" || type === "html" ? {
					tag: [
						{open: "/^\\<\\/?[a-z]([a-z0-9_\\-]+)?/i", close: "/^\\/?\\>/", double: false}
					],
					doc: [
						{open: "/^\\<![a-z]([a-z0-9_\\-]+)?/i", close: "/^\\/?\\>/", double: false}
					],
					string: [
						{open: "\"", close: "\"", double: false},
						{open: "\'", close: "\'", double: false}
					],
					comment: [
						{open: "<!--", close: "-->", double: false},
					]
				} : {
					scope: [
						{open: "[", close: "", double: false}, {open: "]", close: "", double: false},
						{open: "(", close: "", double: false}, {open: ")", close: "", double: false},
						{open: "{", close: "", double: false}, {open: "}", close: "", double: false}
					],
					number: [
						{open: "/^[+\\-]?\\d+\\.\\d+e[+\\-]?\\d+/i", close: this._ends.value, double: true},
						{open: "/^[+\\-]?\\.?\\d+e[+\\-]?\\d+/i",    close: this._ends.value, double: true},
						{open: "/^[+\\-]?\\d+\\.\\d+/",              close: this._ends.value, double: true},
						{open: "/^[+\\-]?\\.?\\d+/",                 close: this._ends.value, double: true}
					],
					string:  this._string,
					comment: this._comment,
					word:    this._word,
					value:   this._value
				};
				/*-- adicionando em lista --*/
				for (let name in frames) {
					for (let i = 0; i < frames[name].length; i++) {
						let item = frames[name][i];
						data.push({
							type:   name,
							open:   item.open,
							close:  item.close,
							double: item.double,
							regexp: isre.test(item.open)
						});
					}
				}
				/*-- ordenando a lista --*/
				this._frames[type] = data.sort(function(x,y) {
					const A = x.open.length;
					const B = y.open.length;
					const a = x.regexp;
					const b = y.regexp;
					if (a !== b)
						return a ? 1 : -1;
					else
						return A > B ? -1 : (A === B ? 0 : 1);
				});
				return this._frames[type];
			}
		},
		/**. '{string input}: Define ou retorna o código fonte.**/
		input: {
			get: function()  {return this._input;},
			set: function(x) {this._input = String(x);}
		},
		/**. '{string type}: Retorna o tipo de código: xml, html ou linear.**/
		type: {
			get: function() {
				const input = this.input.trim();
				const start = /^\<[a-z0-9.\-_:?!]+([^\>]+)?\>/i;
				const close = /\<\/?[a-z0-9.\-_:?!]+([^\>]+)?\/?\>$/i;
				if (start.test(input) && close.test(input))
					return (/\<\/html(\s[^>]+)?\>$/).test(input) ? "html" : "xml";
				return "linear";
			}
		},
		/**. '{void add(string type, string value)}: Adiciona caracteres de controle da linguagem. O argumento i{type} pode ser "string", "comment", "word" ou "value". O argumento i{value} é uma lista de caracteres de controle separados por um espaço em branco. No caso de "string" e "comment", os caracteres de fechamento devem vir logo depois de seu caracteres de abertura (tanto a dupla quanto os conjunto são separados por um espaço).**/
		add: {
			value: function(type, value) {
				type  = String(type).toLowerCase();
				value = String(value).replace(/\ +/g, " ");
				const data = value.split(" ");
				const next = {comment: 2, string: 2, word: 1, value: 1};
				if (type in next) {
					for (let i = 0; i < data.length; i = i + next[type]) {
						if (type === "comment")
							this._comment.push({open: data[i], close: data[i+1], double: false});
						else if (type === "string")
							this._string.push({open: data[i], close: data[i+1], double: false});
						else if (type === "word")
							this._word.push({open: data[i], close: this._ends.word, double: true});
						else if (type === "value")
							this._value.push({open: data[i], close: this._ends.value, double: true});
					}
				}
				this._frames.linear = null;
				return;
			}
		},
		/**. '{void clear()}: Apaga o conjunto de caracteres de controles definidos.**/
		clear: {
			value: function() {
				const name = {_comment: [], _string: [], _word: [], _value: []};
				for (let i in name) this[i] = name[i];
				this._frames.linear = null;
				return;
			}
		},
		/**. '{void JS()}: Define caracteres básicos de controle JavaScript.**/
		JS: {
			value: function() {
				this.clear();
				this.add("word", "break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof new return super switch throw try typeof var void while with let static yied await async");
				this.add("value", "false null this true undefined NaN Infinity /^\\/[^*](.+)?\\/([a-z]+)?/");
				this.add("comment", "// \n /* */");
				this.add("string", "\" \" ' ' ` `");
				return;
			}
		},
		/**. '{void CSS()}: Define caracteres básicos de controle CSS.**/
		CSS: {
			value: function() {
				this.clear();
				this.add("word", "[a-zA-Z0-9\\-]+\\:");
				this.add("value", "none initial \\#[0-9a-fA-F]+ [a-zA-Z]+\\([^)]+\\)");
				this.add("comment", "/* */");
				this.add("string", "\" \" ' '");
				return;
			}
		},
		/**. '{object find(integer index, string search))}: Verifica se o código a partir de i{index} casa com '{search}. É retornado um objeto contendo as propriedades i{match} (texto casado) e i{length} (comprimento do texto casado). Se nada for encontrado, retonará nulo. Se i{search} iniciar e terminar com barra, será considerado uma expressão regular, aceitando ignore case.**/
		find: {
			value: function(index, search) {
				const re   = /^\/(.+)\/i?$/;
				const isre = re.test(search);
				const isic = isre && (/i$/).test(search) ? "i" : "";
				const find = isre ? new RegExp(search.replace(re, "$1"), isic) : search;
				const text = this.input.slice(index, isre ? Infinity : index+search.length);
				const data = {
					match: null,
					get length() {return this.match.length;},
					get next()   {return index + this.length;}
				};
				if (isre && find.test(text))
					data.match = text.match(find)[0];
				else if (!isre && find === text)
					data.match = find;
				return data.match === null ? null : data;
			}
		},
		/**. '{object pack(integer index, array list))}: Retorna um objeto contendo as informações de i{frames} e i{find} se a informação casar com os tipos de caracteres de controle listados em i{list}. Caso contrário, retorna nulo.**/
		pack: {
			value: function(index, list) {
				const frames = this.frames;
				for (let i = 0; i < frames.length; i++) {
					let frame = frames[i];
					let type  = list.indexOf(frame.type) >= 0;
					let find  = type ? this.find(index, frame.open) : null;
					if (find !== null) {
						//console.log({find: find.match, frame: frame, next: this.input.slice(index+find.length)})
						let ok = !frame.double ? true : this.find(index+find.length, frame.close) !== null;
						if (ok) return {
							match: find.match,
							length: find.length,
							next: find.next,
							type: frame.type,
							open: frame.open,
							close: frame.close,
							double: frame.double
						};
					}
				}
				return null;
			}
		},
		/**. '{string linear}: Retorna o código genérico renderizado.**/
		linear: {
			get: function() {
				const tree = __Tree();
				const code = this.input.split("");
				const list = ["string", "comment", "number", "value", "word", "scope"];
				let tag, val, close, pack, find, esc, flag;

				tree.pattern("wd-?");
				tree.open("line");

				for (let index = 0; index < code.length; index++) {
					tag = tree.level;
					val = code[index];

					if (tag === "line") {
						pack = this.pack(index, list);
						if (val === "\n") {
							tree.walkTo(0).add(val).backTo();
						}
						else if (pack === null) {
							tree.add(val);
						}
						else if (pack.type === "string" || pack.type === "comment") {
							close = pack.close;
							tree.open(pack.type).add(pack.match);
							index = pack.next - 1;
						}
						else if (pack.type === "value" || pack.type === "word" || pack.type === "number" || pack.type === "scope") {
							tree.open(pack.type).add(pack.match).close();
							index = pack.next - 1;
						}
					}
					else if (tag === "string") {
						find = this.find(index, close);
						esc  = tag === "string" && code[index-1] === "\\";
						if (find !== null && find.match === "\n") {
							tree.close().walkTo(0).add(val).backTo();
						}
						else if (find !== null && !esc) {
							tree.add(find.match).close();
							index = find.next - 1;
						}
						else {
							tree.add(val);
						}
					}
					else if (tag === "comment") {
						find = this.find(index, close);
						flag = this.find(index, this._flags);
						if (close === "\n" && val === "\n") {
							tree.close().walkTo(0).add(val).backTo();
						}
						else if (flag !== null) {
							tree.open("flag").add(flag.match).close();
							index = flag.next - 1;
						}
						else if (find !== null) {
							tree.add(find.match).close();
							index = find.next - 1;
						}
						else {
							tree.add(val);
						}
					}
					else {
						tree.open("trash").add(val).close();
					}
				}
				tree.finish();
				return this._translate(tree.valueOf());
			}
		},
		/**. '{string markup}: Retorna o código codificado em XML/HTML renderizado.**/
		markup: {
			get: function() {
				const tree   = __Tree();
				const code   = this.input.split("");
				const script = ["<script", "<style", "<textarea"];
				let tag, val, close, pack, find, end, html, flag;

				tree.pattern("wd-?");
				tree.open("line");

				for (let index = 0; index < code.length; index++) {
					tag = tree.level;
					val = code[index];

					if (val === "\n") {
						tree.walkTo(0).add(val).backTo();
					}
					else if (tag === "line") {
						pack = this.pack(index, ["comment", "tag", "doc"]);
						if (pack === null) {
							tree.add(val);
						}
						else if (pack.type === "comment") {
							close = pack.close;
							tree.open(pack.type).add(pack.match);
							index = pack.next - 1;
						} else if (pack.type === "tag" || pack.type === "doc") {
							close = pack.close;
							tree.open(pack.type).add(pack.match).open("attr");
							index = pack.next - 1;
							html  = pack.match;
						}
					}
					else if (tag === "comment") {
						find = this.find(index, close);
						flag = this.find(index, this._flags);
						if (flag !== null) {
							tree.open("flag").add(flag.match).close();
							index = flag.next - 1;
						}
						else if (find !== null) {
							tree.add(find.match).close();
							index = find.next - 1;
						}
						else {
							tree.add(val);
						}
					}
					else if (tag === "string") {
						find = this.find(index, end);
						if (find !== null && code[index-1] !== "\\") {
							tree.add(find.match).close();
							index = find.next - 1;
						}
						else {
							tree.add(val);
						}
					}
					else if (tag === "attr") {
						pack = this.pack(index, ["string"]);
						find = this.find(index, close);

						if (find !== null) {
							tree.close().add(find.match).close();
							index = find.next - 1;
							if (this.type === "html" && script.indexOf(html) >= 0 && find.match === ">") {
								html = html.replace("<", "</");
								tree.open("script");
							}
						}
						else if (pack !== null && pack.type === "string") {
							end = pack.close;
							tree.open(pack.type).add(pack.match);
							index = pack.next - 1;
						}
						else {
							tree.add(val);
						}
					}
					else if (tag === "script") {
						find = this.find(index, html);
						if (find !== null) {
							tree.close().open("tag").add(find.match).open("attr");
							index = find.next - 1;
						}
						else {
							tree.add(val);
						}
					}
				}
				tree.finish();
				return this._translate(tree.valueOf());
			}
		},
		/**. '{node valueOf()}: Retorna a codificação estruturada em HTML.**/
		valueOf: {
			value: function() {	return this.type === "linear" ? this.linear : this.markup;}
		},
		/**. '{string toString()}: Retorna a codificação.**/
		toString: {
			value: function() {return this.input;}
		},
	});

/*===========================================================================*/
	/**#3 Data e Tempo
	#4 Ano
	''constructor object __Year(integer year)''
	Construtor para resgate de informações sobre o ano ('{year}).**/
	function __Year(year) {
		if (!(this instanceof __Year)) return new __Year(year);
		const error = `The year must be an integer (${year}).`
		const check = new __Type(year);
		if (!check.integer) throw new RangeError(error);
		Object.defineProperties(this, {
			/**. '{integer year}: Retorna o ano.**/
			year: {value: check.value},
		});
	}

	Object.defineProperties(__Year.prototype, {
		constructor: {value: __Year},
		/**. '{boolean leap}: Informa se o ano é bissexto.**/
		leap: {get: function() {return __DATETIME.leap(this.year);}},
		/**. '{integer daysElapsedYear}: Retorna os dias decorridos de 0000-01-01T00:00:00 (valor 0) até o primeiro dia do ano.**/
		daysElapsedYear: {
			get: function() {
				let   days = this.year > 0 ? 365 : 0;
				let   back = this.year > 0 ? (this.leap ? 365 : 364) : 0;
				const y365 = 365*this.year;
				const y400 = Math.trunc(this.year/400);
				const y004 = Math.trunc(this.year/4);
				const y100 = Math.trunc(this.year/100);
				days += y365 + y004 - y100 + y400;
				return days - back;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 Mês
	''constructor object __Month(integer year, integer month)''
	Construtor para resgate de informações sobre meses a partir da informação do ano ('{year}) e do mês (1-12) ('{month}). Herda propriedades do objeto __Year.**/
	function __Month(year, month) {
		if (!(this instanceof __Month)) return new __Month(year, month);
		__Year.call(this, year);
		const error = `The month must be an integer from 1 to 12 (${month}).`;
		const check = new __Type(month);
		if (!check.integer || check < 1 || check > 12) throw RangeError(error);
		Object.defineProperties(this, {
			/**. '{integer month}: Registra o mês (1-12).**/
			month: {value: check.value},
		});
	}

	__Month.prototype = Object.create(__Year.prototype, {
		constructor: {value: __Month},
		/**. '{integer width}: Retorna a quantidade de dias do mês.**/
		width: {get: function() {return __DATETIME.max(this.year, this.month);}},
		/**. '{integer daysElapsedMonth}: Retorna os dias decorridos de 0000-01-01T00:00:00 (valor 0) até o primeiro dia do mês.**/
		daysElapsedMonth: {
			get: function() {
				const year = this.daysElapsedYear;
				const days = this.firstDayMonthYear;
				return year + days - 1;
			}
		},
		/**. '{integer firstDayMonthYear}: Retorna o dia do ano em que o mês inicia.**/
		firstDayMonthYear: {
			get: function() {
				const gap  = this.month > 2 && this.leap ? 1 : 0;
				const days = [null,1,32,60,91,121,152,182,213,244,274,305,335];
				return days[this.month] + gap;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 Dia
	''constructor object __Day(integer year, integer month, integer day)''
	Construtor para resgate de informações sobre dias a partir da informação do ano ('{year}), mês (1-12) ('{month}) e dia (1-31) ('{day}). Herda propriedades do objeto __Month.**/
	function __Day(year, month, day) {
		if (!(this instanceof __Day)) return new __Day(year, month, day);
		__Month.call(this, year, month);
		const error = `The day must be an integer from 1 to ${this.width} (${day}).`;
		const check = new __Type(day);
		if (!check.integer || check < 1 || check > this.width) throw new RangeError(error);
		Object.defineProperties(this, {
			/**. '{integer day}: Registra o dia (1-31).**/
			day: {value: check.value}
		});
	}

	__Day.prototype = Object.create(__Month.prototype, {
		constructor: {value: __Day},
		/**. '{integer days}: Retorna o dia do ano.**/
		days: {get: function() {return this.firstDayMonthYear + this.day - 1;}},
		/**. '{integer daysElapsed}: Retorna os dias decorridos de 0000-01-01T00:00:00 (valor 0) até o dia.**/
		daysElapsed: {
			get: function() {
				const year = this.daysElapsedYear;
				const days = this.days;
				return year + days - 1;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 Dia da Semana
	''constructor object __Week(integer year, integer month, integer day)''
	Construtor para resgate de informações sobre a semana a partir da informação do ano ('{year}), mês (1-12) ('{month}) e dia (1-31) ('{day}). Herda propriedades do objeto __Day.**/
	function __Week(year, month, day) {
		if (!(this instanceof __Week)) return new __Week(year, month, day);
		__Day.call(this, year, month, day);
		/*-- referências (Domingo, 01/01/2023 = 0) --*/
		const sun  = new __Year(2023).daysElapsedYear;
		const days = {init: this.daysElapsedYear, today: this.daysElapsed};
		/*-- localizar dia da semana --*/
		const wday = {};
		for (let i in days) {
			let diff = (0 + (days[i] - sun))%7;
			wday[i] = (diff + (diff < 0 ? 7 : 0));
		}
		/*-- localizar semana do ano a partir de 01 de janeiro --*/
		const ref  = days.init - wday.init;
		const week = Math.trunc((days.today - ref)/7);
		Object.defineProperties(this, {
			/**. '{integer weekDay}: Registra o dia da semana, de domingo a sábado (1-7).**/
			weekDay: {value: wday.today + 1},
			/**. '{integer firstWeekDay}: Registra o primeiro dia da semana do ano (1-7).**/
			firstWeekDay: {value: wday.init + 1},
			/**. '{integer week}: Retorna a semana do ano (1-54), com início no domingo, desde o primeiro dia do ano.**/
			week: {value: week + 1},
		});
	}

	__Week.prototype = Object.create(__Day.prototype, {
		constructor: {value: __Week},
		/**. '{string YYYYWww}: Retorna a semana conforme a{ISO 8601}[href="https://en.wikipedia.org/wiki/ISO_8601#Week_dates"], ou seja, a semana começa na segunda-feira do primeiro dia útil.**/
		//FIXME verificar se foi considerado que 1º de janeiro não é dia útil!
		YYYYWww: {
			get: function() {
				function week(year, days) {
					const init = new __Week(year + 0, 1, 1);
					const last = new __Week(year + 1, 1, 1);
					const data = [+1,0,-1,-2,-3,+3,+2];
					const min  = init.daysElapsed + data[init.weekDay - 1];
					const max  = last.daysElapsed + data[last.weekDay - 1] - 1;
					if (days >= min && days <= max)
						return {Y: year, P: year, w: Math.trunc((days - min)/7) + 1, type: "week"};
					return week(year + (days < min ? -1 : 1), days);
				}
				const iso = week(this.year, this.daysElapsed);
				return __DATETIME.iso(iso);
			}
		},
		/**. '{integer work}: Retorna a quantidade de dias úteis decorridos até o dia.**/
		work: {
			get: function() {
				const sun  = ([null,1,7,6,5,4,3,2])[this.firstWeekDay];
				const sat  = ([null,7,6,5,4,3,2,1])[this.firstWeekDay];
				const end  = this.days;
				const dsun = this.day < sun ? 0 : (Math.trunc((end - sun)/7) + 1);
				const dsat = this.day < sat ? 0 : (Math.trunc((end - sat)/7) + 1);
				return end - (dsun + dsat);
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 Tempo
	''constructor object __Time(integer year, integer month, integer day, integer hour, integer minute, i{finite} second)''
	Construtor para resgate de informações sobre a hora a partir da informação do ano ('{year}), mês (1-12) ('{month}), dia (1-31) ('{day}), hora (0-24) ('{hour}), minuto (0-59) ('{minute}) e segundo (0-59.999) ('{second}).  Herda propriedades do objeto __Week.**/
	function __Time(year, month, day, hour, minute, second) {
		if (!(this instanceof __Time)) return new __Time(year, month, day, hour, minute, second);
		__Week.call(this, year, month, day);
		const checkH = new __Type(hour);
		const checkM = new __Type(minute);
		const checkS = new __Type(second);
		if (!checkH.integer || checkH > 24 || checkH < 0)
			throw RangeError(`The hour value must be an integer from 0 to 24 (${hour}).`);
		if (!checkM.integer || checkM > 59 || checkM < 0)
			throw RangeError(`The minute value must be an integer from 0 to 59 (${minute}).`);
		if (!checkS.finite || checkS >= 60 || checkS < 0)
			throw RangeError(`The value of the second must be an integer from 0 to 59.999 (${second}).`);
		Object.defineProperties(this, {
			/**. '{integer hour}: Registra a hora (0-23).**/
			hour:   {value: checkH.value % 24},
			/**. '{integer minute}: Registra o minuot (0-59).**/
			minute: {value: checkM.value},
			/**. '{number second}: Registra o segundo (0-59.999).**/
			second: {value: checkS.value},
		});
	}

	__Time.prototype = Object.create(__Week.prototype, {
		constructor: {value: __Time},
		/**. '{string toString()}: Retorna o tempo no formato "YYYY-MM-DDThh:mm:ss".**/
		toString: {value: function() {return this.codes.YYYYMMDDhhmmss;}},
		/**. '{string valueOf()}: Retorna o mesmo que a propriedade '{timeElapsed}.**/
		valueOf:  {value: function() {return this.timeElapsed;}},
		/**. '{number time}: Retorna a quantidade total de segundos.**/
		time: {get: function() {return 3600*this.hour + 60*this.minute + this.second;}},
		/**. '{integer timeElapsed}: Retorna os segundos decorridos de 0000-01-01T00:00:00 (valor 0) até a hora.**/
		timeElapsed: {get: function() {return 24*3600*this.daysElapsed + this.time;}},
		/**. '{string meridiem}: Retorna AM ou PM de acordo com a hora.**/
		meridiem: {get: function() {return this.hour < 12 ? "AM" : "PM";}},
		/**. '{integer h12}: Retorna a hora no formato de 12 horas (AM/PM).**/
		h12: {
			get: function() {
				return this.hour === 0 ? 12 : this.hour - (this.hour < 13 ? 0 : 12);
			}
		},
		/**. '{object next()}: Retorna uma instância do objeto para o dia seguinte.**/
		next: {
			value: function() {
				const d = this.day === this.width ? 1 : (this.day + 1);
				const m = this.day === this.width ? (this.month + 1) : this.month;
				const y = m > 12 ?  (this.year + 1) : this.year;
				return new __Time(y, (m > 12 ? 1 : m), d, this.hour, this.minute, this.second);
			}
		},
		/**. '{object walk(integer value)}: Retorna uma instância do objeto caminhando o valor de segundos definidos no argumento.**/
		walk: {
			value: function(value) {
				const check = new __Type(value);
				if (!check.finite) value = 0;
				const time = this.timeElapsed;
				return this.constructor.toTimeObject(time + value);
			}
		},
		/**. '{string codes(string format)}: Retorna um objeto contendo propriedades temporais abreviadas ('{format}).**/
		codes: {
			value: function(format) {
				const data = {
		 			Y: this.year,    YYYY: this.year,
		 			M: this.month,     MM: this.month,   MMM: this.month,   MMMM: this.month,
					D: this.day,       DD: this.day,
					d: this.weekDay,   dd: this.weekDay, ddd: this.weekDay, dddd: this.weekDay,
					w: this.week,      ww: this.week,
		 			H: this.hour,      HH: this.hour,
		 			h: this.h12,       hh: this.h12,
		 			m: this.minute,    mm: this.minute,
		 			s: this.second,    ss: this.second,
		 			p: this.meridiem,   P: this.year < 0 ? -1 : 1,
				};
				return __DATETIME.string(data[format], format);
			}
		},
		/**. '{string toString()}: Retorna uma stringo no formato "dddd, PD MMMM YYYY h:mm p".**/
		toString: {
			value: function() {
				const data = {P: "", YYYY: "", MMMM: "", D: "", h: "", mm: "", dddd: "", p: ""};
				for (let i in data) data[i] = this.codes(i);
				return `${data.dddd}, ${data.P}${data.D} ${data.MMMM} ${data.YYYY} ${data.h}:${data.mm} ${data.p}`;
			}
		},
		/**. '{number toString()}: Retorna o mesmo valor da propriedade '{timeElapsed}.**/
		valueOf: {
			value: function() {return this.timeElapsed;}
		},
		/**. '{string log}: Retorna uma stringo no formato "PYYYY-MM-DD-dd-Www HH:mm:ss ...".**/
		log: {
			get: function() {
				const week = this.isoWeek;
				const days = this.daysElapsed;
				const time = this.timeElapsed;
				const data = {P: "", YYYY: "", MM: "", DD: "", HH: "", mm: "", ss: "", ww: "", dd: ""};
				for (let i in data) data[i] = this.codes(i);
				return [
					`${data.P}${data.YYYY}-${data.MM}-${data.DD}-${data.dd}-W${data.ww}`,
					`${data.HH}:${data.mm}:${data.ss} day ${days} time ${time} (${week})`
				].join(" ")
			}
		},

	});

	Object.defineProperties(__Time, {
		/**#5 Métodos e Propriedades Estáticos
		. '{array daysToYear(integer value)}: Retorna o ano (item 0) a partir do número de dias ('{value}).**/
		daysToYear: {
			value: function(value) {
				const check = new __Type(value);
				if (!check.integer)
					throw TypeError("[daysToYear] Value must be an integer.");
				value = check.value;
				/*-- Ano zero --*/
				if (value >= 0 && value <= 365) return [0];
				/*-- Correção para contagem dos anos diferentes de zero --*/
				let   year = 0;
				let   days = value > 0 ? value - 365 : value;
				/*-- dias por período --*/
				const d001 = 365;
				const d004 =  4*d001 + 1;
				const d100 = 25*d004 - 1;
				const d400 =  4*d100 + 1;
				/*-- anos por período (progressão aritmética) --*/
				const y400 = Math.trunc(days/d400);
				days -= y400 * d400;
				const y100 = Math.trunc(days/d100);
				days -= y100 * d100;
				const y004 = Math.trunc(days/d004);
				days -= y004 * d004;
				const y001 = Math.trunc(days/d001);
				days -= y001 * d001;
				const rest = days === 0 ? 0 : (value < 0 ? -1 : (value > 365 ? +1 : 0));
				year += 400*y400 + 100*y100 + 4*y004 + y001 + rest;
				return [year];
			}
		},
		/**. '{array daysToMonth(integer value)}: Retorna o ano (item 0) e o mês (item 1) a partir do número de dias ('{value}).**/
		daysToMonth: {
			value: function(value) {
				const year = this.daysToYear(value)[0];
				const leap = __DATETIME.leap(year);
				const d365 = [31,59,90,120,151,181,212,243,273,304,334,365];
				const d366 = [31,60,91,121,152,182,213,244,274,305,335,366];
				const days = leap ? d366 : d365;
				const data = new __Year(year);
				const diff = value - data.daysElapsedYear;
				for (let i = 0; i < days.length; i++)
					if (diff < days[i]) return [year, i+1];
				/*-- precaução em caso de falha --*/
				let help = new __Month(year,12);
				while (value < help.daysElapsedMonth)
					help = new __Month(year, help.month-1);
				return [year, help.month]
			}
		},
		/**. '{array daysToDate(integer value)}: Retorna o ano (item 0), o mês (item 1) e o dia (item 2) a partir do número de dias ('{value}).**/
		daysToDate: {
			value: function(value) {
				const data = this.daysToMonth(value);
				const date = new __Month(data[0], data[1]);
				const day  = value - date.daysElapsedMonth + 1;
				return [date.year, date.month, day];
			}
		},
		/**. '{array secondsToTime(number value)}: Retorna a hora (item 0), o minuto (item 1) e o segundo (item 2) a partir do número de segundos ('{value}).**/
		secondsToTime: {
			value: function(value) {
				const check = new __Type(value);
				if (!check.finite)
					throw TypeError("[secondsToTime] Value must be a finite number.");
				const day    = 24*3600;
				const rest   = check.value%day;
				const time   = rest + (rest < 0 ? day : 0);
				const hour   = Math.trunc(time/3600);
				const minute = Math.trunc((time - 3600*hour)/60);
				const second = time - 60*minute - 3600*hour;
				return [hour, minute, Number(second.toFixed(3))];
			}
		},
		/**. '{array secondsToDate(integer value)}: Retorna o ano (item 0), o mês (item 1), o dia (item 2), a hora (item 3), o minuto (item 4) e o segundo (item 5) a partir do número de segundos ('{value}).**/
		secondsToDate: {
			value: function(value) {
				const day  = 24*3600;
				const sec  = value%day;
				const days = Math.trunc((value - sec)/day);
				const date = this.daysToDate(days + (value < 0 && sec !== 0 ? -1 : 0)	);
				const time = this.secondsToTime(sec);
				return [date[0],date[1],date[2],time[0],time[1],time[2]];
			}
		},
		/**. '{array weekToDate(string value)}: Retorna o ano (item 0), o mês (item 1) e o dia (item 2) a partir da string no formato de semana ('{value}).**/
		weekToDate: {
			value: function(value) {
				const info = __DATETIME.test(value);
				if (info === null || info.type !== "week") return null;
				const year = info.P * info.Y;
				const init = new __Year(year);
				const days = init.daysElapsedYear + 7*(info.w - 2);
				const date = this.daysToDate(days);
				let   time = new __Time(date[0], date[1], date[2], 0, 0, 0);
				while (time.YYYYWww !== info.iso) {
					time = time.next();
					if (Math.abs(time.year - year) > 1) return null;
				}
				return [time.year, time.month, time.day];
			}
		},
		/**. '{object toTimeObject(integer value)}: Retorna o objeto '{__Time} a partir do número de segundos ('{value}).**/
		toTimeObject: {
			value: function(value) {
				const data = this.secondsToDate(value);
				return new __Time(data[0],data[1],data[2],data[3],data[4],data[5]);
			}
		},
		/**. '{async sequentialityTest(integer start, integer stop)}: Testa a sequencialidade da data do ano '{start} até '{stop}.**/
		sequentialityTest: {
			value: async function(start, stop) {
				if (stop === undefined || stop < start) stop = start;
				const init = new Date().valueOf();
				const data = new __Time(start,1,1,0,0,0);
				const hist = {a: data, b: data.next()};
				let  count = 1;
				while (hist.b.year <= stop) {
					let days = {a: hist.a.daysElapsed, b: hist.b.daysElapsed};
					let wday = {a: (hist.a.weekDay - 1), b: (hist.b.weekDay - 1)};
					let week = {a: hist.a.week, b: hist.b.week};
					let err  = null;
					if (days.b - days.a !== 1)
						err = "daysElapsed";
					else if ((wday.a + 1)%7 !== wday.b)
						err = "weekDay";
					if (hist.a.year === hist.b.year) {
						if (wday.b > wday.a && week.b !== week.a)
							err = "week"
						else if (wday.b < wday.a && week.b - week.a !== 1)
							err = "week"
					}
					if (err !== null)
						throw ReferenceError(`${err}\nA) ${hist.a.log}\nB) ${hist.b.log}`);
					hist.a = hist.b;
					hist.b = hist.b.next();
					count++;
				}
				if (hist.b.daysElapsed !== data.daysElapsed+count)
					throw ReferenceError(`count (${count})\nA) ${data.log}\nB) ${hist.b.log}`);
				const time = ((new Date()).valueOf() - init)/1000;
				console.info(`${time}s, ${count} days, ${count/time} days/s`);
			}
		}
	});

/*----------------------------------------------------------------------------*/
	/**#4 Data e Tempo
	''constructor object __DateTime(any input)''
	Construtor para manipulação de data/tempo. O argumento '{input} aceita os seguintes valores:
	- Data, tempo, data e tempo, mês e semana (se válida) nos parâmetros da biblioteca;
	- Valor numérico que corresponde aos segundos desde 0000-01-01T00:00:00.0000 (segundo 0);
	- Objeto contendo as propriedades year, month, day, hour, minute e second; e
	- Se indefinido, assumirá o valor de data e tempo atuais.**/
	//FIXME procurar pelo construtor e ver se a propriedade type, removeida, é usada.
	function __DateTime(input) {
		if (!(this instanceof __DateTime)) return new __DateTime(input);
		const error = `The date value is unknown (${input})`;
		const data  = {year: 0, month: 1, day: 1, hour: 0, minute: 0, second: 0};
		const value = new __Type(input);
		/*-- objeto (padrão) --*/
		if (value.object) {
			for (let i in data)
				data[i] = i in input ? input[i] : data[i];
		}
		/*-- segundos --*/
		else if (value.integer) {
			const info = __Time.toTimeObject(value.value)
			return new __DateTime(info);
		}
		/*-- data e tempo --*/
		else if (value.nonempty || value.datetime) {
			const info = __DATETIME.toObject(value.nonempty ? input : value.value);
			if (info.type === null) throw new TypeError(error);
			if (info.type === "week") {
				const week = __Time.weekToDate(info.iso);
				if (week === null) throw new TypeError(error);;
				info.year  = week[0];
				info.month = week[1];
				info.day   = week[2];
			}
			return new __DateTime(info);
		}
		/*-- data e tempo atuais --*/
		else if (input === undefined) {
			return new __DateTime(new Date());
		}
		/*-- erro --*/
		else throw new TypeError(error);
		/*-- objeto principal --*/
		const main = new __Time(data.year, data.month,  data.day, data.hour, data.minute, data.second);

		Object.defineProperties(this, {
			_max:  {value: null, writable: true},
			/**. '{object main}: Registra o objeto __Time auxiliar.**/
			main:  {value: main, writable: true},
		});
	}

	Object.defineProperties(__DateTime.prototype, {
		constructor: {value: __DateTime},
		/**. '{object toDateObject}: Retorna um objeto nativo Date com o tempo fixado no ano 2000.**/
		toDateObject: {
			get: function() {
				const sec  = Math.trunc(this.second);
				const mill = 1000*Number("0."+this.format("[ss]").split(".")[1]);
				const utc  = Date.UTC(2000, this.month-1, this.day, this.hour, this.minute, sec, mill)
				const date = new Date(utc);
				return date;
			}
		},
		/**. '{number valueOf()}: Retorna os segundos desde 0000-01-01T00:00:00.000.**/
		valueOf: {value: function() {return this.main.timeElapsed;}},
		/**. '{integer valueOfDate()}: Retorna os dias desde 0000-01-01.**/
		valueOfDate: {value: function() {return this.main.daysElapsed;}},
		/**. '{number valueOfTime()}: Retorna os segundos desde 00:00:00.000.**/
		valueOfTime: {value: function() {return this.main.time;}},
		/**. '{number valueOfDays()}: Retorna os dias desde 0000-01-01 com o tempo como elemento decimal.**/
		valueOfDays: {value: function() {return this.valueOfDate()+this.valueOfTime()/(24*3600);}},
		/**. '{string toString()}: Retorna o tempo no formato YYYY-MM-DDThh:mm:ss.sss.**/
		toString: {value: function() {return this.format("[P][YYYY]-[MM]-[DD]T[HH]:[mm]:[ss]");}},
		/**. '{string toDateString()}: Retorna o tempo no formato YYYY-MM-DD.**/
		toDateString: {value: function() {return this.format("[P][YYYY]-[MM]-[DD]");}},
		/**. '{string toWeekString()}: Retorna a semana no formato YYYY-Www.**/
		toWeekString: {value: function() {return this.main.YYYYWww;}},
		/**. '{string toString()}: Retorna o tempo no formato hh:mm:ss.sss.**/
		toTimeString: {value: function() {return this.format("[HH]:[mm]:[ss]");}},
		/**. '{string toLocaleString()}: Retorna o valor data/tempo no formato local.**/
		toLocaleString: {
			value: function() {
				const date = this.toDateObject;
				const iso  = date.toLocaleString(__LANG.value, {timeZone: "UTC"});
				const from = date.toLocaleDateString(__LANG.value, {timeZone: "UTC"});
				const to   = this.toLocaleDateString();
				return iso.replace(from, to);
			}
		},
		/**. '{string toLocaleDateString()}: Retorna a data no formato local.**/
		toLocaleDateString: {
			value: function() {
				const date = this.toDateObject;
				const year = new __Number(this.year).toLocaleString({group: false});
				const intl = new Intl.DateTimeFormat(__LANG.value, {timeZone: "UTC"});
				if ("formatToParts" in intl) {
					const text = [];
					const part = intl.formatToParts(date);
					for (let i = 0; i < part.length; i++)
						text.push(part[i].type === "year" ? year : part[i].value);
					return text.join("");
				} else {
					const type = intl.resolvedOptions(date).year;
					const yntl = new Intl.DateTimeFormat(__LANG.value, {timeZone: "UTC", year: type});
					const from = yntl.format(date);
					return intl.format(date).replace(from, year);
				}
			}
		},
		/**. '{string toLocaleTimeString()}: Retorna o tempo no formato local.**/
		toLocaleTimeString: {
			value: function() {
				return this.toDateObject.toLocaleTimeString(__LANG.value, {timeZone: "UTC"});
			}
		},
		/**. '{string format(string input, string only)}: Retorna notação de data/tempo pre-formatada a partir de codificação especificada no argumento '{input} (Ex. 5 jan. 2015 é "[D] [MMM] [YYYY]"). O valor da semana (w ou ww) diz respeito ao retorno da propriedade '{week} e não o do método '{toWeekString}. O argumento opcional '{only} limite caracteres de tempo ou data ("date", "time").**/
		format: {
			value: function(input, only) {
				input = String(input);
				const chars = {
					date: `Y YYYY M MM MMM MMMM D DD d dd ddd dddd w ww P`,
					time: `h hh H HH m mm s ss p`
				}
				const type = (only in chars ? chars[only] : `${chars.date} ${chars.time}`).split(" ");
				for (let i = 0; i < type.length; i++) {
					let regexp = new RegExp("\\["+type[i]+"\\]", "gm");
					let code   = this.main.codes(type[i]);
					input = input.replace(regexp, code);
				}
				return input;
			}
		},
		/**. '{integer year}: Define ou retorna o ano.**/
		year: {
			get: function() {return this.main.year;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite || check.value === this.year) return;
				const val = __Number(check.value);
				const int = val.int;
				const dec = val.dec;
				const obj = new __Day(int, this.month, 1);
				const day = this._max === null ? this.day : this._max;
				this.main = new __Time(
					int, this.month, day > obj.width ? obj.width : day,
					this.hour, this.minute, this.second
				);
				this._max = day > obj.width ? day : null;
				if (Math.trunc(12*dec) !== 0)
					this.month = 12*dec;
			}
		},
		/**. '{integer month}: Define ou retorna o mês de 1 a 12 (janeiro a dezembro). O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites. (**Observação**: ao alterar o mês de 2000-01-31 para fevereiro, a data definida será 2000-02-29 e não 2000-03-02)**/
		month: {
			get: function() {return this.main.month;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite) return;
				const val   = __Number(check.value);
				const int   = val.int;
				const dec   = val.dec;
				const month = (12 + (int-1)%12)%12 + 1;
				const year  = Math.trunc((int - (int < 1 ? 12 : 1))/12) + this.year;
				const obj = new __Day(year, month, 1);
				const day = this._max === null ? this.day : this._max;
				this.main = new __Time(
					year, month, day > obj.width ? obj.width : day,
					this.hour, this.minute, this.second
				);
				this._max = day > obj.width ? day : null;
				if (Math.trunc(this.main.width*dec) !== 0)
					this.day = this.main.width*dec;
			}
		},
		/**. '{integer day}: Define ou retorna o dia de 1 a 31. O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites. (**Observação**: Quando o dia de um mês for maior que a quantidade de dias do mês alterado, o valor ficará limitado ao último dia e, ao acrescentar unidades de mês à data 2000-01-31, por exemplo, o resultado será 2000-02-29, 2000-03-31, 2000-04-30, 2000-05-31...**/
		day: {
			get: function() {return this.main.day;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite) return;
				const val = __Number(check.value);
				const int = val.int;
				const dec = val.dec;
				const gap = 24*60*60*(int - this.day);
				this.main = this.main.walk(gap);
				this._max = null;
				if (Math.trunc(24*dec) !== 0)
					this.hour = 24*dec;
			}
		},
		/**. '{integer hour}: Define ou retorna a hora (0 a 23). O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites.**/
		hour: {
			get: function() {return this.main.hour;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite) return;
				const val = __Number(check.value);
				const int = val.int;
				const dec = val.dec;
				const gap = 60*60*(int - this.hour);
				this.main = this.main.walk(gap);
				if (Math.trunc(60*dec) !== 0)
					this.minute = 60*dec;
			}
		},
		/**. '{integer minute}: Define ou retorna o minuto de 0 a 59. O parâmetro será alterado para o valor definido, exceto quando extrapolar os limites.**/
		minute: {
			get: function() {return this.main.minute;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite) return;
				const val = __Number(check.value);
				const int = val.int;
				const dec = val.dec;
				const gap = 60*(int - this.minute);
				this.main = this.main.walk(gap);
				if (Math.trunc(60*dec) !== 0)
					this.second = 60*dec;
			}
		},
		/**. '{number second}: Define ou retorna o segundo de 0 a 59.999. O parâmetro será alterado para o valor definido, exceto quando extrapolar o limites.**/
		second: {
			get: function() {return this.main.second;},
			set: function(x) {
				const check = __Type(x);
				if (!check.finite) return;
				const gap = check.value - this.second;
				this.main = this.main.walk(gap);
			}
		},
	});

/*===========================================================================*/
	/**#3 Listas
	''constructor object __Array(array input|void  ...)''
	Construtor para manipulação de listas (array).
	Caso não seja informado argumento, seja atribuído uma lista vazia. Caso seja informado múltiplos argumentos, cada valor corresponderá a um item do array. Caso seja informado um array como argumento, esse será o valor considerado pelo objeto. Caso contrário, o valor informado será o item do array.**/
	function __Array() {
		let input;
		if (arguments.length === 0)
			input = [];
		else if (arguments.length > 1)
			input = Array.prototype.slice.call(arguments);
		else
			input = __Type(arguments[0]).array ? arguments[0] : [arguments[0]];

		if (!(this instanceof __Array))	return new __Array(input);
		Object.defineProperties(this, {
			_value: {value: input},
			/**. '{integer index}: Retorna o valor do índice (ver '{next} e '{index}).**/
			index:  {value: -1, writable: true},
		});
	}

	Object.defineProperties(__Array.prototype, {
		constructor: {value: __Array},
		[Symbol.iterator]: {
			value: function*() {
				for (let i = 0; i < this._value.length; i++) yield this._value[i];
			}
		},
		/**. '{any  valueOf(integer n)}: Retorna o array definido ou um de seus itens se for especificado o índice como argumento, podendo se estender para além do cumprimento do array, repetindo-se a lista de forma constante.**/
		valueOf: {
			value: function(n) {
				const array = this._value.slice();
				if (n === null || n === undefined) return array;
				const check = __Type(n);
				if (!check.finite) return array;
				const value = Math.trunc(check.value);
				const index = (Math.abs(value)*this.length + value)%this.length;
				return array[index];
			}
		},
		/**. '{string toString()}: Retorna a representação em texto do array.**/
		toString: {
			value: function() {
				const parser = __Parser(this._value);
				return parser.jsonString.get();
			}
		},
		/**. '{integer length}: Retorna a quantidade de itens da lista.**/
		length: {get: function() {return this._value.length;}},
		/**. '{any value}: Retorna o valor do item (ver '{next} e '{index}).**/
		value:  {get: function() {return this._value[this.index];}},
		/**. '{boolean  next(boolean run)}: Método para utilizar em looping i{while}. Retornará verdadeiro enquanto os itens não forem percorridos ou enquando o argumento '{run} for diferente de falso. A cada fim de ciclo, com retorno falso, o processo é reiniciado. Utilizar em conjunto com as propriedades '{value} e '{index}.**/
		next: {
			value: function(run) {
				run = run !== false && this.index < this.length - 1;
				this.index = run ? this.index + 1 : -1;
				return run;
			}
		},
		/**. '{array only(string type, boolean keep=false, boolean change=true)}: Retorna uma lista somente com os tipos de itens definidos. O argumento '{type} define o tipo do item a ser mantido na lista (ver '{&lowbar;&lowbar;Type}); o argumento '{keep}, se verdadeiro, manterá na lista o item não enquadrado em '{type} mas com o valor '{null}; e o argumento '{change}, se verdadeiro, alterará o item casado para o valor do objeto ('{valueOf} de '{&lowbar;&lowbar;Type}.**/
		only: {
			value: function(type, keep, change) {
				const list = [];
				for (let i = 0; i < this.length; i++) {
					let check = __Type(this._value[i]);
					if (check[type] === true)
						list.push(change === false ? this._value[i] : check.valueOf());
					else if (keep === true)
						list.push(null);
				}
				return list;
			}
		},
		/**. '{array convert(function' f, string type)}: Retorna uma lista com o resultado de '{f(x)} ou nulo se algo falhar. O argumento '{f} corresponde à função a ser aplicada aos itens da lista. O item da lista será o argumento da função cujo retorno substituirá o valor do item. O argumento opcional '{type} informa o tipo do resultado esperado de acordo com o método '{&lowbar;&lowbar;Type} que, se diferente, devolverá um valor nulo.**/
		convert: {
			value: function(f, type) {
				if (!__Type(f).function) return null;
				const list = this._value.slice();
				const test = new __Type(type);
				for (let i = 0; i < list.length; i++) {
					try {
						let value = f(list[i]);
						let check = new __Type(value);
						if (test.chars && type in check)
							list[i] = check[type] ? check.value : null;
						else
							list[i] = value;
					} catch(e) {
						list[i] = null;
					}
				}
				return list;
			}
		},
		/**. '{number min}: Retorna o menor número finito do conjunto de items da lista ou nulo em caso de vazio.**/
		min: {
			get: function() {
				const list = this.only("finite");
				return list.length === 0 ? null : Math.min.apply(null, list);
			}
		},
		/**. '{number max}:  Retorna o maior número finito do conjunto de items da lista ou nulo em caso de vazio.**/
		max: {
			get: function() {
				const list = this.only("finite");
				return list.length === 0 ? null : Math.max.apply(null, list);
			}
		},
		/**. '{number sum}: Retorna a soma dos números finitos da lista ou nulo em caso de vazio.**/
		sum: {
			get: function() {
				const list = this.only("finite");
				let sum = 0, i = -1;
				while (++i < list.length) sum += list[i];
				return list.length === 0 ? null : sum;
			}
		},
		/**. '{number avg}: Retorna a média dos números finitos da lista ou nulo em caso de vazio.**/
		avg: {
			get: function() {
				const list = this.only("finite");
				let sum = 0, i = -1;
				while (++i < list.length) sum += list[i];
				return list.length === 0 ? null : sum/list.length;
			}
		},
		/**. '{number med}: Retorna a mediana dos números finitos da lista ou nulo em caso de vazio.**/
		med: {
			get: function() {
				const list = this.only("finite");
				const y = list.sort(function(a,b) {return a < b ? -1 : 1;});
				const l = list.length;
				return l === 0 ? null : (l%2 === 0 ? (y[l/2]+y[(l/2)-1])/2 : y[(l-1)/2]);
			}
		},
		/**. '{number harm}: Retorna a média harmônica dos números finitos __diferentes de zero__ da lista ou nulo em caso de vazio.**/
		harm: {
			get: function() {
				const list = this.only("finite");
				let sum = 0, len = 0, i = -1;
				while (++i < list.length) {
				  sum += list[i] === 0 ? 0 : 1/list[i];
				  len += list[i] === 0 ? 0 : 1;
				}
				return len === 0 || sum === 0 ? null : len/sum;
			}
		},
		/**. '{number geo}: Retorna a média geométrica dos números finitos __positivos__ da lista ou nulo em caso de vazio.**/
		geo: {
			get: function() {
				const list = this.only("finite");
				let val = 1, len = 0, i = -1;
				while (++i < list.length) {
				  val  = val * (list[i] <= 0 ? 1 : list[i]);
				  len += list[i] <= 0 ? 0 : 1;
				}
				return len === 0 ? null : Math.pow(val, 1/len);
			}
		},
		/**. '{number gcd}: Retorna o máximo divisor comum dos números inteiros da lista ou nulo em caso de vazio.**/
		gcd: {
			get: function() {
				const list = this.only("integer");
				if (list.length < 2) return list.length === 0 ? null : list[0];
				const number = new __Number(list[0]);
				return number.gcd.apply(number, list.slice(1));
			}
		},
		/**. '{array unique}: Retorna a lista sem valores repetidos.**/
		unique: {
			get: function(){
				return this._value.filter(function(v,i,a) {return a.indexOf(v) === i;});
			}
		},
		/**. '{array mode}: Retorna uma lista com os valores da moda (valores que mais se repetem).**/
		mode: {
			get: function() {
				const items = this.unique;
				const count = [];
				while (count.length !== items.length) count.push(0);
				for (let i = 0; i < this._value.length; i++)
				  count[items.indexOf(this._value[i])]++;
				const max = Math.max.apply(null, count);
				return items.filter(function(v,i,a) {return count[i] === max;});
			}
		},
		/**. '{boolean check(any  ...)}: Checa se os valores informados como argumento estão presentes na lista.**/
		check: {
			value: function() {
				if (arguments.length === 0) return false;
				const list = Array.prototype.slice.call(arguments);
				for (let i = 0; i < list.length; i++)
				  if (this._value.indexOf(list[i]) < 0) return false;
				return true;
			}
		},
		/**. '{array search(any  value)}: Retorna uma lista com os índices onde o valor informado no argumento '{value} foi localizado.**/
		search: {
			value: function(value) {
				const index = [];
				for (let i = 0; i < this._value.length; i++)
				  if (this._value[i] === value) index.push(i);
				return index;
			}
		},
		/**. '{array hide(any  ...)}: Retorna uma lista ignorando os valores informados como argumento.**/
		hide: {
			value: function() {
				const hide = Array.prototype.slice.call(arguments);
				return this._value.filter(function(v,i,a) {return hide.indexOf(v) < 0;});
			}
		},
		/**. '{number count(any  value)}: Retorna a quantidade de vezes que o valor informado no argumento '{value} aparece na lista.**/
		count: {
			value: function(value) {return this.search(value).length;}
		},
		/**. '{array sort(boolean asc)}: Retorna a lista ordenada e organizada por grupos na seguinte sequência: número, tempo, data, datatempo, string, booleano, nulo, nós, lista, objeto, função, expressão regular, indefinido e demais valores.
		. O argumento opcional '{asc} define a classificação da lista. Se verdadeiro, ascendente; se falso, descendente; e, se omitido, inverterá a ordenação atual com prevalência da ordem ascendente.**/
		sort: {
			value: function(asc) {
				const data  = __Type(asc);
				const array = this._value.slice();
				const order = [
					"number", "time", "date", "datetime", "string", "boolean", "null", "node",
					"array", "object", "function", "regexp", "undefined", "unknow"
				];
				asc = data.boolean ? data.value : null;
				array.sort(function(a,b) {
					let A = __Type(a);
					let B = __Type(b);
					/*-- comparação entre tipos diferentes --*/
					if (A.type !== B.type) {
						let typeA = order.indexOf(A.type);
						let typeB = order.indexOf(B.type);
						return typeA < typeB ? -1 : (typeA > typeB ? 1 : 0);
					}
					/*-- comparação entre tipos iguais --*/
					let avalue, bvalue;
					/*-- números/boleanos/data/tempo --*/
					if (A.number || A.boolean || A.date || A.time || A.datetime) {
						avalue = A.value;
						bvalue = B.value;
					}
					/*-- string/node --*/
					else if (A.string || A.node) {
						let aval = new __String(A.node ? a.innerText : a);
						let bval = new __String(B.node ? b.innerText : b);
						avalue = aval.near.toUpperCase().trim();
						bvalue = bval.near.toUpperCase().trim();
					}
					/*-- valores não específicos --*/
					else {
						avalue = a;
						bvalue = b;
					}
					return avalue === bvalue ? 0 : (avalue > bvalue ? 1 : -1);
				});
				/*-- retornando com ordem definida --*/
				if (asc === false || asc === true)
					return asc === true ? array : array.reverse();
				/*-- retornando sem ordem definida --*/
				for (let i = 0; i < array.length; i++)
					if (array[i] !== this._value[i]) return array;
				return array.reverse();
			}
		},
		/**. '{array order}: Retorna uma lista ordenada de forma crescente sem valores repetidos.**/
		order: {
			get: function() {return __Array(this.unique).sort(true);}
		},
		/**. '{array add(any  ...)}: Adiciona itens (argumentos) ao fim da lista e a retorna.**/
		add: {
			value: function() {
				this._value.push.apply(this._value, arguments);
				return this.valueOf();
			}
		},
		/**. '{array jump(any  ...)}: Adiciona itens (argumentos) ao início da lista e a retorna.**/
		jump: {
			value: function() {
				this._value.unshift.apply(this._value, arguments);
				return this.valueOf();
			}
		},
		/**. '{array put(any  ...)}: Adiciona itens (argumentos) __não existentes__ ao fim da lista e a retorna.**/
		put: {
			value: function() {
				for (let i = 0; i < arguments.length; i++)
					if (!this.check(arguments[i]))
						this.add(arguments[i]);
				return this.valueOf();
			}
		},
		/**. '{array concat(any ...)}: Concatena listas ou adiciona itens (argumentos) à lista original.**/
		concat: {
			value: function() {
				for (let i = 0; i < arguments.length; i++) {
					let item = arguments[i];
					this.add.apply(this, __Type(item).array ? item : [item]);
				}
				return this.valueOf();
			}
		},
		/**. '{array replace(any  from, any  to)}: Altera os valores da lista conforme especificado e a retorna. O argumento '{from} definie o valor a ser encontrado e substituído na lista e o argumento '{to} define seu novo valor.**/
		replace: {
			value: function (from, to) {
			  for (let i = 0; i < this._value.length; i++)
			    if (this._value[i] === from) this._value[i] = to;
				return this.valueOf();
			}
		},
		/**. '{array remove(any ...)}: Remove itens (argumentos) da lista e a retorna.**/
		remove: {
			value: function() {
				const list = this.hide.apply(this, arguments);
				while(this._value.length !== 0) this._value.pop();
				this.add.apply(this, list);
				return this.valueOf();
			}
		},
		/**. '{array toggle(any  ...)}: Remove, se existente, ou insere ao fim, se ausente, itens (argumentos) da lista e a retorna.**/
		toggle: {
			value: function() {
				const tgl  = Array.prototype.slice.call(arguments);
				for (let i = 0; i < tgl.length; i++) {
					if (this._value.indexOf(tgl[i]) < 0)
					  this.add(tgl[i]);
					else
					  this.remove(tgl[i]);
				}
				return this.valueOf();
			}
		},
	});

/*============================================================================*/
	/**#3 Nós HTML
	#4 Pesquisa por Elementos
	''constructor object __Query(string css, node root=document)''
	Construtor para obter elementos HTML. O argumento '{css} é um seletor CSS válido e o argumento opcional '{root} define o elemento raiz da busca.	**/
	function __Query(css, root) {
		if (!(this instanceof __Query))	return new __Query(css, root);
		const check = __Type(root);
		Object.defineProperties(this, {
			css:  {value: __Type(css).nonempty ? String(css).trim() : ""},
			root: {value: check.node && check.value.length > 0 ? check.value[0] : document},
		});
	}

	Object.defineProperties(__Query.prototype, {
		constructor: {value: __Query},
		/**. '{array $$}: retorna uma lista de nós ('{NodeList}).**/
		$$: {
			get: function() {
				let elem = null;
				try {elem = this.root.querySelectorAll(this.css);} catch(e) {}
				return __Type(elem).node ? elem : document.querySelectorAll("#_._");
			}
		},
		/**. '{array $}: retorna um nó específico ou lista de nós ('{NodeList}) vazia.**/
		$: {
			get: function() {
				let elem = null;
				try {elem = this.root.querySelector(this.css);} catch(e) {}
				return __Type(elem).node ? elem : this.$$;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 Formulários
	''constructor object __FNode(node input)''
	Construtor para checar características de campo de formulário HTML (argumento '{input}).**/
	function __FNode(input) {
		if (!(this instanceof __FNode))	return new __FNode(input);
		const check = new __Type(input);
		if (!check.node || check.value.length < 1)
			throw new TypeError("Input value is not an HTML node");
		/*-- capturando informações --*/
		const data = {};
		data.node = check.value[0];
		data.tag  = data.node.tagName.toLowerCase();
		data.form = data.tag in this._config;
		if (data.form && "types" in this._config[data.tag]) {
			const attr = String(data.node.getAttribute("type")).toLowerCase();
			const prop = String(data.node.type).toLowerCase();
			const find = this._config[data.tag].types;
			data.type = attr in find ? attr : (prop in find ? prop : "text");
			data.work = attr === prop && attr in find;
			data.cfg  = this._config[data.tag].types[data.type];
		} else {
			data.type = data.form ? data.tag : "";
			data.work = data.form;
			data.cfg  = data.form ? this._config[data.tag] : null;
		}
		data.text  = data.form ? data.cfg.text  : false;
		data.send  = data.form ? data.cfg.send  : false;
		data.check = data.form ? data.cfg.check : "";
		data.mask  = !data.form || !data.cfg.mask ? false : (function () {
			const error = "A1!@#$%¨&*()+";
			const clone = data.node.cloneNode();
			try {clone.value = error;} catch(e) {}
			return clone.value !== error;
		})();
		Object.defineProperties(this, {
			/**. '{node node}: Retorna o nó.**/
			node:   {value: data.node},
			/**. '{string tag}: Retorna a tag do nó.**/
			tag:    {value: data.tag},
			/**. '{boolean form}: Informa se o nó é campo de formulário.**/
			form:   {value: data.form},
			/**. '{string ftype}: Retorna o tipo de formulário ou vazio.**/
			ftype:  {value: data.type},
			/**. '{boolean fmask}: Informa se o formulário possui máscara nativa implementada.**/
			fmask:  {value: data.mask},
			/**. '{boolean fsend}: Informa se o formulário pode ser enviado em requisições ou falso.**/
			fsend:  {value: data.send},
			/**. '{boolean fwork}: Informa se o formulário está implementado.**/
			fwork:  {value: data.work},
			/**. '{string fcheck}: Informa o tipo de verificação do valor do formulário.**/
			fcheck: {value: data.check},
			/**. '{boolean ftext}: Informa se o formulário aceita conteúdo de texto.**/
			ftext:  {value: data.text},
		});
	}

	Object.defineProperties(__FNode.prototype, {
		constructor: {value: __FNode},
		/**. '{object _msg}: Registra algumas mensagens de validação de formulários.**/
		_msg: {
			value: (function(){
				const re   = "[0-9]";
				const elem = __HTML("input", {required: true, title: re, pattern: re, value: "ABC"});
				const msg  = {
					pattern:  elem.validationMessage.replace(re , "?"),
					required: elem.validationMessage
				};
				Object.freeze(msg);
				return msg;
			})()
		},
		/**. '{object _config}: Contém as configurações sobre os campos de formulário.**/
		_config: {
			value: (function() {
				/*-- informações que definem o tipo do campo de formulário -------------
					tag.tipo:config1;config2
						tag: tag do elemento
						tipo: tipo do elemento quando houver (tag input e button)

					SUBMIT: o campo pode ser submetido em um formulário
					VISUAL: o campo possui representação textual
					VALUE.tipo: define o valor aceito pelo campo
					MASK: checar se o campo possui máscara nativa
				----------------------------------------------------------------------*/
				const config = [
					"button.button:VALUE.text;VISUAL",
					"button.reset:VALUE.text;VISUAL",
					"button.submit:SUBMIT;VALUE.text;VISUAL",
					"input.button:VALUE.text",
					"input.checkbox:SUBMIT;VALUE.check",
					"input.color:SUBMIT;MASK;VALUE.text",
					"input.date:SUBMIT;MASK;VALUE.datetime",
					"input.datetime-local:SUBMIT;MASK;VALUE.datetime",
					"input.datetime:SUBMIT;MASK;VALUE.datetime",
					"input.email:SUBMIT;MASK;VALUE.combo",
					"input.file:SUBMIT;VALUE.combo",
					"input.hidden:SUBMIT;VALUE.text",
					"input.image:",
					"input.month:SUBMIT;MASK;VALUE.datetime",
					"input.number:SUBMIT;MASK;VALUE.finite",
					"input.password:SUBMIT;VALUE.text",
					"input.radio:SUBMIT;VALUE.check",
					"input.range:SUBMIT;MASK;VALUE.finite",
					"input.reset:VALUE.text",
					"input.search:SUBMIT;VALUE.text",
					"input.submit:SUBMIT;VALUE.text",
					"input.tel:SUBMIT;VALUE.text",
					"input.text:SUBMIT;VALUE.text",
					"input.time:SUBMIT;MASK;VALUE.datetime",
					"input.url:SUBMIT;MASK;VALUE.text",
					"input.week:SUBMIT;MASK;VALUE.datetime",
					"meter:VALUE.finite",
					"option:VALUE.text;VISUAL",
					"output:VALUE.text;VISUAL",
					"progress:VALUE.finite",
					"select:SUBMIT;VALUE.combo",
					"textarea:SUBMIT;VALUE.text"
				];
				/*-- redesenhando config para objeto --*/
				const data = {};
				for (let i = 0; i < config.length; i++) {
					let item = config[i].split(":");
					let cfg1 = item[0].split(".");
					let cfg2 = item[1].split(";");
					let tag  = cfg1[0];
					let type = cfg1.length > 1 ? cfg1[1] : null;
					let val  = cfg2.filter(function(x) {return (/^VALUE\./).test(x);});
					if (type !== null && !(tag in data))
						data[tag] = {types: {}};
					let obj = type === null ? data : data[tag].types;
					obj[type === null ? tag : type] = {
						mask:  cfg2.indexOf("SUBMIT") >= 0,
						send:  cfg2.indexOf("SUBMIT") >= 0,
						text:  cfg2.indexOf("VISUAL") >= 0,
						check: val.length > 0 ? val[0].split(".")[1] : ""
					}
				}
				Object.freeze(data);
				return data;
			})()
		},
		/**. '{string fname}: Define ou retorna o valor do atributo '{name} do formulário ou vazio.**/
		fname: {
			get: function()  {return this.form ? this.node.name.trim() : "";},
			set: function(x) {
				if (this.form) this.node.name = x === null ? "" : String(x).trim();
			}
		},
		/**. '{any fvalue}: Define ou retorna o valor do formulário ou nulo.**/
		fvalue: {
			get: function() {
				if (!this.form) return null;
				const node  = this.node;
				const value = node.value;
				const check = new __Type(value);
				/*-- valor finito --*/
				if (this.fcheck === "finite") {
					return check.finite ? check.value : "";
				}
				/*-- data/tempo --*/
				if (this.fcheck === "datetime") {
					const data = __DATETIME.test(value);
					if (data === null)
						return "";
					if (data.type === "week" && __Time.weekToDate(data.iso) === null)
						return "";
					if (this.ftype === "datetime")
						return data.iso;
					if (data.type === "datetime" && this.ftype === "datetime-local")
						return data.form;
					if (data.type === this.ftype)
						return data.form;
					return "";
				}
				/*-- lista de valores --*/
				if (this.fcheck === "combo") {
					switch(this.ftype) {
						case "file": {
							const list = node.files;
							return !node.multiple && list.length > 1 ? [] : list;
						}
						case "email": {
							const list = value.split(",");
							for (let i = 0; i < list.length; i++) {
								let item = new __Type(list[i]);
								if (!item.email) return [];
								list[i] = list[i].trim();
							}
							return node.multiple === false && list.length > 1 ? [] : list;
						}
						case "select": {
							const list = [];
							for (let i = 0; i < node.length; i++)
								if (node[i].selected) list.push(node[i].value);
							return node.multiple === false && list.length > 1 ? [] : list;
						}
					}
					return [];
				}
				/*-- valor boleano --*/
				if (this.fcheck === "check") {
					return node.checked ? value : null;
				}
				/*-- valor textual/cor --*/
				if (this.fcheck === "text") {
					const color = /^\#[0-9a-f]{6}$/i;
					switch(this.ftype) {
						case "color": return color.test(value.trim()) ? value.trim() : "#000000";
						case "url":   try {return new URL(value).href;} catch(e) {return "";}
					}
					return value;
				}
				/*-- outros valores --*/
				return null;
			},
			/*----------------------------------------------------------------------*/
			set: function(value) {
				if (!this.form) return;
				const node  = this.node;
				const check = new __Type(value);
				const mask  = this.fmask;
				/*-- apagar valor --*/
				if (check.null && this.fcheck !== "check") {
					node.value = null;
					return;
				}
				/*-- definir valor finito --*/
				if (this.fcheck === "finite") {
					if (check.finite) node.value = check.value;
					return;
				}
				/*-- definir data/tempo --*/
				if (this.fcheck === "datetime") {
					const data  = __DATETIME.test(value);
					if (data === null)
						return;
					if (data.type === "week" && __Time.weekToDate(data.iso) === null)
						return;
					if (this.ftype === "datetime")
						node.value = data.iso;
					else if (data.type === "datetime" && this.ftype === "datetime-local")
						node.value = data.form;
					else if (data.type === this.ftype)
						node.value = data.form;
					return;
				}
				/*-- definir lista de valores --*/
				if (this.fcheck === "combo") {
					if (this.ftype === "file")
						return;
					if (this.ftype === "email") {
						const list = check.array ? value : String(value).split(",");
						if (node.multiple === false && list.length > 1) return;
						for (let i = 0; i < list.length; i++) {
							let item = new __Type(list[i]);
							if (!item.email) return;
							list[i] = list[i].trim();
						}
						node.value = list.join(",")
						return;
					}
					if (this.ftype === "select") {
						const list = check.array ? value : [value];
						list.forEach(function(v,i,a) {a[i] = String(v);})
						for (let i = 0; i < node.length; i++)
							node[i].selected = list.indexOf(node[i].value) >= 0;
						return;
					}
					return;
				}
				/*-- definir valores boleanos --*/
				if (this.fcheck === "check") {
					if (check.boolean)
						node.checked = check.value;
					else if (check.null)
						node.checked = !node.checked;
					else
						node.checked = check.value;
					return;
				}
				/*-- definir valores textuais/color/url --*/
				if (this.fcheck === "text") {
					if (this.ftype === "color") {
						const color = /^\#[0-9a-f]{6}$/i;
						if (color.test(value.trim()))
							node.value = value.trim().toLowerCase();
						return;
					}
					if (this.ftype === "url") {
						if (check.instanceOf("URL"))
							node.value = value.href;
						else
							try {node.value = new URL(value).href;} catch(e) {}
						return;
					}
					node.value = value;
				}
				return;
			}
		},
		/**. '{boolean ferror}: Retorna se o campo de formulário é inválido.**/
		ferror: {
			get: function() {
				if (this.form) {
					/*-- Zerando erros personalizados --*/
					this.fvalidity = "";
					/*-- Erros implementados pelo navegador --*/
					if (this.node.checkValidity() === false) return true;
					/*-- Erros de valores (conteúdo e valor devem ser coerentes) --*/
					const combo  = this.fcheck === "combo";
					const value  = this.node.value !== "";
					const fvalue = combo ? this.fvalue.length > 0 : this.fvalue !== "";
					if (value && !fvalue) {
					 this.fvalidity = this._msg.pattern.replace("?", "");
					 return true;
					}
					/*-- Erros do dataset-wd-mask --*/
					if ("wdMask" in this.node.dataset)
						this.node.dispatchEvent(wdReloadEvent);
					/*-- retornando se há erro encontrado --*/
					return !this.node.checkValidity()	;
				}
				return false;
			}
		},
		/**. '{string fvalidity}: Define ou retorna mensagem de restrição do formulário.**/
		fvalidity	: {
			get: function() {
				return this.ferror ? this.node.validationMessage.trim() : "";
			},
			set: function(x) {
				const check = this.form && "setCustomValidity" in this.node;
				const error = x === null ? "" : String(x).trim();
				if (check) this.node.setCustomValidity(error);
			}
		},
		/**. '{object fsubmit}: Retorna um objeto contendo as propriedades '{name}, '{value}, '{error} e '{message} do formulário ou nulo se não for o caso para submeter.**/
		fsubmit: {
			get: function() {
				if (this.fsend) {
					const data = {
						name:  this.fname,  value:   this.fvalue,
						error: this.ferror, message: this.fvalidity
					};
					return data.name === "" || data.value === null ? null : data;
				}
				return null;
			}
		},
		/**. '{void falert()}: Exibe a mensagem de erro na tela, se implementado pelo navegador.**/
		falert	: {
			value: function() {
				const validity = this.fvalidity;
				if (validity !== "") {
					if ("reportValidity" in this.node)
						this.node.reportValidity();
					else
						__SIGNAL.signal({body: validity, title: "!"});
				}
				return;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**
	#4 Nós
	''constructor object __Node(node input)''
	Construtor para manipulação de nós HTML.**/
	function __Node(input) {
		if (!(this instanceof __Node)) return new __Node(input);
		__FNode.call(this, input);
	}

	__Node.prototype = Object.create(__FNode.prototype, {
		constructor: {value: __Node},
		/**. '{any attribute(string name, any value)}: Define e retorna valores de atributos ou propriedades dos elementos HTML. O argumento '{name} (i{string}) corresponde ao nome do atributo ou da propriedade e '{value} o seu respectivo valor:
		|name|value|Ação|
		|Ausente|Ausente|Retorna um objeto com os u{atributos} do elemento.|
		|Presente|Ausente|Retorna o valor do atributo ou propriedade.|
		|Presente|Presente|Define o valor do atributo ou propriedade e o retorna.|
		- Caso o atributo ou a propriedade seja método, a lista de argumentos é definida como um array no argumento '{value};
		- Inicialmente, seja checada a existência da propriedade ou método e depois do atributo;
		- O manipulação de i{class/Name/List, style, dataset e add/removeEventListener} foram readequados.**/
		attribute: {
			value: function (name, value) {
				const tName  = new __Type(name);
				const tValue = new __Type(value);
				const isSet  = arguments.length > 1;
				const work   = tName.nonempty ? (isSet ? "set" : "get") : "all";
				/*-- RETORNAR LISTA DE ATRIBUTOS -------------------------------------*/
				if (work === "all") {
					const data = {};
					const attr = this.node.attributes;
					for (let i = 0; i < attr.length; i++)
						data[attr[i].name] = attr[i].value;
					return data;
				}
				/*-- RETORNAR/DEFINIR DADO -------------------------------------------*/
				else {
					name = name.trim();
					/*-- métodos/atributos com comportamento da biblioteca --*/
					const native = {
						style: "style", dataset: "dataset",
						class: "class", className: "className", classList: "classList",
						innerHTML: "innerHTML", outerHTML: "outerHTML",
						addEventListener: "addEventListener", removeEventListener: "removeEventListener",
						value: this.form ? "fvalue" : "value", name: this.form ? "fname" : "value",
					};
					/*-- COMPORTAMENTO DA BIBLIOTECA -----------------------------------*/
					if (name in native) {
						if (work === "set") this[native[name]] = value;
						return this[native[name]];
					}
					/*-- COMPORTAMENTO PADRÃO ------------------------------------------*/
					else {
						/*-- DEFINIÇÃO ---------------------------------------------------*/
						if (work === "set") {
							const cfg = {};
							cfg[name] = value;
							__HTML(this.node, cfg);
						}
						/*-- RETORNO -----------------------------------------------------*/
						if (name in this.node)
							return this.node[name];
						else
							return this.node.getAttribute(name);
					}
				}
					/*FIXME implanto ou não isso?
					/*-- propriedade booleana --* /
					if (testAttr.boolean && (testValue.boolean || value === "!")) {
						this.node[name] = testValue.boolean ? testValuevalue : !this.node[name];
					}
					*/
			}
		},
		/**. '{object style}: Define e retorna o valor do atributo '{style}. Se u{nulo}, o atributo é u{excluído}; se u{textual}, o é definido; e, se objeto, o atributo é definido conforme nome da propriedade e seu valor.**/
		style: {
			get: function() {
				const data = {};
				for (let i = 0; i < this.node.style.length; i++) {
					let attr = this.node.style[i];
					let name = __String(attr).camel;
					data[name] = this.node.style[attr];
				}
				return data;
			},
			set: function(x) {
				const data = new __Type(x);
				if (data.null) {
					this.node.removeAttribute("style");
				}
				else if (data.chars) {
					this.node.setAttribute("style", x);
				}
				else if (data.object) {
					for (let i in x) {
						let name = new __String(i).camel;
						this.node.style[name] = x[i];
					}
				}
			}
		},
		/**. '{string|object className}: Propriedade auxiliar para a propriedade '{class}.**/
		className: {
			set: function(x) {this.class = x;},
			get: function()  {return this.class;}
		},
		/**. '{string|object classList}: Propriedade auxiliar para a propriedade '{class}.**/
		classList: {
			set: function(x) {this.class = x;},
			get: function()  {return this.class;}
		},
		/**. '{string|object class}: Define e retorna o valor do atributo '{class}. Se u{nulo}, o atributo é u{excluído}; se u{textual}, o valor é definido; e, se objeto, as seguintes ações são possíveis:
		|Nome|Tipo|Descrição|
		|replace|string|Substitui a primeira propriedade pela segunda.|
		|toggle|string|Alterna a existência das propriedades.|
		|add|string|Adiciona as propriedades.|
		|remove|string|Remove as propriedades.|
		Os valores das propriedades acima consiste no nome da propriedade CSS separada por espaço em branco.**/
		class: {
			get: function() {
				const attr = this.node.getAttribute("class");
				const list = attr === null ? [""] : attr.replace(/\s+/g, " ").trim().split(" ");
				const only = list.filter(function(v,i,a) {return a.indexOf(v) === i;});
				const sort = only.sort();
				const data = sort.join(" ");
				if (attr !== null)
					this.node.setAttribute("class", data);
				return data;
			},
			set: function(x) {
				const data = new __Type(x);
				if (data.chars) {
					this.node.setAttribute("class", x.trim());
				}
				else if (data.null) {
					this.node.removeAttribute("class");
				}
				else if (data.object) {
					const data = new __Array(this.class.split(" "));
					const sort = ["replace", "toggle", "add", "remove"];
					for (let i = 0; i < sort.length; i++) {
						if (sort[i] in x) {
							let list = String(x[sort[i]]).replace(/\s+/g, " ").trim().split(" ");
							data[sort[i]].apply(data, list);
						}
					}
					this.node.setAttribute("class", data.order.join(" "));
				}
				this.class;
			}
		},
		/**. '{array|object  addEventListener}: Propriedade para adicionar disparadores a eventos, aceitando dois tipos de valores.
		. Se o valor for um array, cada item do array corresponderá aos argumentos do método padrão, na mesma sequência (evento, disparador, captura).
		. Se o valor for um objeto, o nome da propriedade corresponderá ao evento e seu valor ao disparador ou uma lista de disparadores (array). A captura será definida pelo valor padrão.**/
		addEventListener: {
			set: function(x) {return this.eventListener(x, false);}
		},
		/**. '{array|object  removeEventLister}: Propriedade semelhante à i{addEventListener}, mas para remover disparadores dos eventos.**/
		removeEventListener: {
			set: function(x) {return this.eventListener(x, true);}
		},
		/**. '{void  eventListener(object|array data, boolean remove)}: Função auxiliar para as propriedades '{addEventListener} e '{removeEventListener}. O argumento '{data} define o valor de entrada e o argumento '{remove} define a exclusão do disparador.**/
		eventListener: {
			value: function(data, remove) {
				const check = new __Type(data);
				if (check.array) {
					const attr = remove === true ?  "removeEventListener" : "addEventListener";
					try {this.node[attr].apply(this.node, data);}
					catch(e) {if (__UNDERMAINTENANCE) console.info(e);}
				}
				else if (check.object) {
					for (let ev in data) {
						let event = String(ev).trim().replace(/^(on)?/i, "");
						let test  = new __Type(data[ev]);
						let list  = test.array ? data[ev] : [data[ev]];
						for (let i = 0; i < list.length; i++)
							this.eventListener([event, list[i]], remove);
					}
				}
				return;
			}
		},
		/**. '{object dataset}: Define e retorna o valor do atributo '{dataset}. Se u{nulo}, o atributo é u{excluído} e, se objeto, o atributo é definido conforme nome da propriedade e seu valor.**/
		dataset: {
			get: function() {
				const data = {};
				for (let i in this.node.dataset)
					data[i] = this.node.dataset[i];
				return data;
			},
			set: function(x) {
				const data  = new __Type(x);
				/*-- deletar todas as propriedades de dataset --*/
				if (data.null) {
					const attr = this.dataset;
					for (let i in attr)
						delete this.node.dataset[i];
				}
				/*-- definir ou excluir propriedades de dataset --*/
				else if (data.object) {
					const wddataset = [];
					for (let i in x) {
						let name = __String(i).camel;
						if (x[i] !== null) {
							this.node.dataset[name] = x[i];
							wddataset.push(name);
						}
						else if (name in this.node.dataset) {
							delete this.node.dataset[name];
						}
					}
					//FIXME consertar isso (não lembro mais o porquê)
					this.node.dataset.wddataset = wddataset.join(" ");
					this.node.dispatchEvent(wdDatasetEvent);
				}
				/*-- invocar evento de atribuição de dataset --*/
				//this.node.dispatchEvent(wdDatasetEvent);
			}
		},
		/**. '{node clone(boolean childs=true)}: Retorna um clone do objeto. Se o argumento opcional '{childs} for falso, os elementos filhos não serão clonados.**/
		clone: {
			value: function(childs) {
				let special = ["script"];
				/* se não for um script */
				if (special.indexOf(this.tag) < 0)
					return this.node.cloneNode(childs !== false);
				/* se for um script */
				let attrs = this.attribute();
				let clone = __HTML(this.tag, {innerHTML: this.node.innerHTML});
				for (let i in attrs)
					clone.setAttribute(i, attrs[i]);
				return clone;
			}
		},
		/**. '{string innerHTML}: Define ou retorna o valor da propriedade HTML para fins da biblioteca.|**/
		innerHTML: {
			get: function() {return this.node.innerHTML;},
			set: function(x) {
				this.node.innerHTML = x;
				this.node.dispatchEvent(wdReloadEvent);
				return;
			}
		},
		/**. '{string outerHTML}: Define ou retorna o valor da propriedade HTML para fins da biblioteca.|**/
		outerHTML: {
			get: function() {return this.node.outerHTML;},
			set: function(x) {
				const parent = this.node.parentElement;
				this.node.outerHTML = x;
				parent.dispatchEvent(wdReloadEvent);
				return;
			}
		},
		/**. '{void forcedHTML(string input, boolean outer)}: Define a propriedade i{inner/outerHTML} forçando a execução de scripts. O argumento '{input} (string) define o código HTML e o argumento '{outer} (boolean), se verdadeiro, definirá a propriedade "outer", caso contrário "inner".**/
		forcedHTML: {
			value: function(input, outer) {
				const re   = /\<script([^>]*\>)/ig;
				const to   = `<script data-wd-script="force" $1`;
				const code = String(input).replace(re, to);
				const elem = outer === true ? this.node.parentElement : this.node
				/*-- definindo propriedade --*/
				this.node[outer === true ? "outerHTML" : "innerHTML"] = code;
				/*-- executando scripts --*/
				const query = elem.querySelectorAll(`script[data-wd-script="force"]`);
				for (let i = 0; i < query.length; i++) {
					let node  = new __Node(query[i]);
					let clone = node.clone(true);
					clone.removeAttribute("data-wd-script");
					query[i].parentElement.replaceChild(clone, query[i]);
				}
				elem.dispatchEvent(wdReloadEvent);
				return;
			}
		},
		/**. '{void repeat(array list)}: Clona os filhos do elemento repetindo-os de acordo com as informações repassadas pela lista de objetos ('{list}). O elemento filho que contiver o nome do atributo do objeto entre duas chaves ({{nome}}) terá o fragmento substituídos pelo valor do atributo do objeto correspondente.**/
		repeat: {
			value: function(list) {
				if (!__Type(list).array) list = [];
				let   html = this.node.innerHTML;
				const re   = /\{\{([^}]+)\}\}/;
				/*-- definindo modelo oriundo de innerHTML {{name}} --*/
				if (re.test(html))
					this.node.dataset.wdRepeatModel = html;
				/*-- capturando modelo em data-wd-repeat-model --*/
				else if ("wdRepeatModel" in this.node.dataset)
					html = this.node.dataset.wdRepeatModel;
				/*-- modelo não encontrado --*/
				else
					return;

				/*-- contruindo lista de conteúdo --*/
				const load = [];
				for (let i = 0; i < list.length; i++) {
					let inner = html;
					let data  = new __Type(list[i]).object ? list[i] : {};
					for (let j in data)
						inner = inner.split(`{{${j}}}`).join(data[j]);
					load.push(inner);
				}
				/*-- limpando e renderizando --*/
				const repeat   = load.join("").replace(/\{\{[^}]+\}\}/g, "");
				this.innerHTML = repeat;
				return;
			}
		},
		/**. '{boolean show}: Retorna e define a visibilidade do elemento nos termos da biblioteca.**/
		show: {
			//FIXME por que eu criei [data-js-wd-hide]:not([data-js-wd-show])
			get: function() {
				return !this.node.hasAttribute("data-js-wd-hide");
			},
			set: function(x) {
				if      (x === false) this.node.setAttribute("data-js-wd-hide", "");
				else if (x === true)  this.node.removeAttribute("data-js-wd-hide");
			}
		},
		/**. '{void only(boolean hide)}: Exibe o nó e esconde os irmãos ou, se '{hide} for verdadeiro, o contrário.**/
		only: {
			value: function(hide) {
				const elem = this.node;
				const data = new __Type(elem.parentElement.children);
				data.value.forEach(function(v,i,a) {
					const node = new __Node(v);
					node.show = v === elem ? (hide !== true) : (hide === true);
				});
			}
		},
		/**. '{void slice(number init, number last)}: Define o intervalo de nós filhos a ser exibido entre o índice inicial ('{init}) e final ('{last}), como no método '{Array.slice}.**/
		slice: {
			value: function (init, last) {
				const child = new __Type(this.node.children);
				const check = {init: new __Type(init), last: new __Type(last)};
				for (let i in check) check[i] = check[i].number ? check[i].value : undefined;
				const show = child.value.slice(check.init, check.last);
				child.value.forEach(function(v,i,a) {
					const node = new __Node(v);
					node.show = show.indexOf(v) >= 0;
				});
			}
		},

		//FIXME apagar: isso seria usado para carrossel e pages
		/**. '{array groups(boolean child)}: Retorna uma lista de objetos contendo os intervalos (propriedades '{init} e '{last}) dos elementos visíveis. Se o argumento '{child} for verdadeiro, a análise será dentre os filhos, caso contrário, entre elemento e seus irmãos.**/
		groups: {
			value: function(child) {
				const target = child === true ? this.node : this.node.parentElement;
				const nodes  = __Type(target.children).value;
				const groups = [];
				const data   = {init: null, last: null};
				for (let i = 0; i < nodes.length; i++) {
					let show = nodes[i].className.split(/\s/).indexOf("js-wd-hide") < 0;
					if (show) {
						if (data.init === null) data.init = i;
						data.last  = i;
						if (i === (nodes.length - 1))
							groups.push({init: data.init, last: data.last});
					} else if (data.init !== null) {
						groups.push({init: data.init, last: data.last});
						data.init = null;
						data.last = null;
					}
				}
				return groups;
			}
		},
		//FIXME apagar: isso seria usado para carrossel
		/**. '{void walk(integer n=1)}: Exibe um único nó filho avançando ou retrocedendo '{n} posições entre os irmãos. O argumento '{n} indica o intervalo a avançar (positivo) ou a retroceder (negativo).**/
		walk: {
			value: function(n) {
				if (this.node.childElementCount < 2) return this.slice(0, 0);
				const data   = __Type(n);
				const childs = this.node.childElementCount;
				const delta  = data.finite ? Math.trunc(data.value) : 1;
				const groups = this.groups(true);
				let   active = groups.length === 0 ? 0 : groups[0].init;
				if (delta >= 0)
					active = groups.length === 0 ? -1 : groups[groups.length - 1].last;
				let next   = (active + delta)%childs;
				if (next < 0) next = childs + next;
				this.slice(next, next);
			}
		},
		/**. '{integer page(integer size, integer page)}: Organiza os nós filhos em grupos ('{page}) de determinado tamanho ('{size}) e retornar o valor da última página.**/
		page: {
			value: function(size, page) {
				/*-- checando argumentos --*/
				const data = {size: new __Type(size), page: new __Type(page)};
				for (let i in data)
					data[i] = data[i].integer && data[i] > 0 ? data[i].value : 1;
				/*-- definindo o grupo --*/
				const len = this.node.childElementCount;
				const max = Math.trunc(len/data.size) + (len%data.size > 0 ? 1 : 0);
				data.page = (data.page > max ? max : data.page) - 1;
				const init = data.page * data.size;
				const last = init + data.size;
				this.slice(init, last);
				return max;
			}
		},
		/**. '{void filter(string|regexp find, integer size)}: Exibe os nós filhos que casam com o valor definido em '{find}. O argumento '{size} indica o número mínimo de caracteres:
		|find|size|Condição|Descrição|
		|regexp|-|-|Não aplicável|
		|string|positivo|search < length|Todos elementos serão exibidos|
		|string|negativo|search < length|Nenhum elemento será exibido|
		string|-|search >= length|Elementos que casam serão exibidos|**/
		filter: {
			//FIXME não está selecionando a palavra corretamente
			value: function(find, size) {
				const test  = {find: new __Type(find), size: new __Type(size)}
				find = test.find.chars  ? find.trim() : (test.find.regexp ? find : "");
				size = test.size.finite ? test.size.value : 0;
				const child = new __Type(this.node.children);
				const none  = !test.find.regexp && (find.length < Math.abs(size) || find === "");
				const elem  = __HTML("mark", {className: "js-wd-mark-text"});
				const query = new __Type(this.node.querySelectorAll("mark.js-wd-mark-text"));
				/*-- apagar todos os destaques existentes no nó --*/
				for (let i = 0; i < query.value.length; i++)
					this.tagText(query.value[i]);
					/*-- looping sobre os filhos --*/
				for (let i = 0; i < child.value.length; i++) {
					let node = new __Node(child.value[i]);
					/*-- nada a buscar --*/
					if (!test.find.regexp && size === 0 && find === "") {
						node.show = true;
					}
					/*-- quantidade mínima de caracteres não atendida --*/
					else if (!test.find.regexp && find.length < Math.abs(size)) {
						node.show = size > 0;
					}
					/*-- buscar casamento textual --*/
					else {
						let index = node.textMatch(find);
						node.show = index !== null;
						if (index !== null)
							node.textTag(elem, index.init, index.last);
					}
				}
				return;
			}
		},
		/**. '{boolean mask(string model)}: Retorna falso se o conteúdo do elemento não corresponder ao modelo da máscara '{model} (ver __String.mask). Caso contrário, definirá o valor do conteúdo conforme definido pela máscara.**/
		mask: {
			value: function(model) {
				/*-- se for um formulário com máscara primitiva, não avaliar --*/
				if (this.fmask) return true;
				/*-- se o conteúdo for vazio, não avaliar --*/
				const val = this.node[!this.form || this.ftext ? "innerText" : "value"];
				if (val === "") return true;
				/*-- avaliando máscara --*/
				const str = new __String(val);
				const txt = str.mask(model);
				/*-- validando formulário --*/
				if (this.form)
					this.fvalidity = txt === "" ? this._msg.pattern.replace("?", model) : "";
				/*-- definindo valor da máscara --*/
				if (txt !== "" && txt !== val)
					this.node[!this.form || this.ftext ? "innerText" : "value"] = txt;
				return txt !== "";
			}
		},
		/**. '{void sort(boolean asc)}: Ordena os elementos filhos. O argumento '{asc} define a classificação, se verdadeiro ascendente, se falso descendente e, se ausemte, o inverso da classificação vigente.**/
		sort: {
			value: function(asc) {
				const node  = this.node;
				const child = new __Type(node.children);
				const array = new __Array(child.value);
				array.sort(asc).forEach(function(v,i,a) {node.appendChild(v);});
				return;
			}
		},
		/**. '{void tsort(integer order...)}: Ordena colunas de tabelas. Os argumentos '{order} definem a sequência de prioridade na classificação, com a indicação do número da coluna (a partir de 1, da esquerda para a direita). Se indicador da coluna for positivo, sua ordem será ascendente, caso contrário, descendente. O método deverá ser aplicado sobre o agrupador de linhas**/
		tsort: {
			value: function() {
				/*-- acertando argumentos --*/
				const args = [];
				const rule = [];
				for (let i = 0; i < arguments.length; i++) {
					let data = new __Type(arguments[i]);
					if (data.integer && data.value !== 0 && args.indexOf(data.value) < 0) {
						args.push(data.value);
						rule.push({asc: data.value > 0, col: Math.abs(data.value) - 1});
					}
				}
				/*-- ordernar linhas --*/
				const desc = new __Type(this.node.children);
				const rows = desc.value;
				rows.sort(function(a, b) {
					/*-- definindo quantidade de colunas em cada linha a comparar --*/
					const maxA  = a.childElementCount - 1;
					const maxB  = b.childElementCount - 1;
					/*-- looping pelas regras de ordenação --*/
					for (let i = 0; i < rule.length; i++) {
						let col = rule[i].col;
						let asc = rule[i].asc;
						/*-- índice das colunas informadas não constam na linha --*/
						if (col > maxA && col > maxB) continue;
						/*-- obter os valores para comparação --*/
						let dataA = col > maxA ? "" : a.children[col].innerText.toLowerCase();
						let dataB = col > maxB ? "" : b.children[col].innerText.toLowerCase();
						let textA = new __String(dataA);
						let textB = new __String(dataB);
						let typeA = new __Type(textA.near.trim());
						let typeB = new __Type(textB.near.trim());
						/*-- se os valores forem iguais, passar para a próxima regra --*/
						if (typeA.value === typeB.value) continue;
						/*-- caso contrário, definir ordenamento --*/
						let list = new __Array(typeA.value, typeB.value);
						let sort = list.sort(asc);
						return sort[0] === typeA.value ? -1 : +1;
					}
					/*-- se nenhuma ordenação for encontrada --*/
					return 0;
				});
				/*-- reordenar elementos --*/
				for (let i = 0; i < rows.length; i++)
					this.node.appendChild(rows[i]);
			}
		},
		/**. '{void jump(node list)}: O nó será adicionado aos elementos na ordem definida em '{list} a cada chamada do método. O argumento '{list} é uma lista de nós que acomodará o elemento.**/
		jump: {
			value: function(list) {
				const check = __Type(list);
				if (!check.node && !check.array) return;
				const nodes = [];
				const value = check.value;
				for (let i = 0; i < value.length; i++)
				  if (__Type(value[i]).node && value[i] != this.node)
				    nodes.push(value[i]);
				if (nodes.length > 0) {
					const next = nodes.indexOf(this.node.parentElement) + 1;
					const node = nodes[next%nodes.length];
					node.appendChild(this.node);
				}
				return;
			}
		},
		/**. '{void full()}: Alterna a exibição do nó em tela cheia.**/
		//TODO interessante: https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop    https://developer.mozilla.org/en-US/docs/Web/CSS/:fullscreen
		full: {
			value: function() {
				const attr = {
					open: ["requestFullscreen", "webkitRequestFullscreen", "msRequestFullscreen"],
					exit: ["exitFullscreen",    "webkitExitFullscreen",    "msExitFullscreen"]
				};
				const full = document.fullscreenElement;
				const act  = full === this.node ? "exit" : "open";
				const node = act === "exit" ? document : this.node;
				for (let i = 0; i < attr[act].length; i++) {
					if (attr[act][i] in node)
						try {return node[attr[act][i]]();} catch(e) {}
				}
				return;
			}
		},
		/**. '{object styles}: Retorna um objeto contendo os estilos e seus valores computados ao elemento.**/
		styles: {
			get: function() {
				const object = {};
				const styles = window.getComputedStyle(this.node, null);
				for (let i in styles)
					if (!(/\d+/).test(i))
						object[i] = styles[i];
				return object;
			}
		},
		/**. '{object position}: Retorna ou define o dimensionamento do elemento por meio de um objeto com os seguintes atributos: width, height, top, right, bottom e left. Os valores dependem do posicionalmento do elemento e devem ser numéricos.**/
		position: {
			get: function() {
				const re   = /[^0-9\.\-]/g;
				const css  = this.styles;
				let   data = {height: 0, width: 0, left: 0, top: 0, right: 0, bottom: 0};
				for (let i in data)
					data[i] = Number(css[i].replace(re, ""));
				return data;
			},
			set: function(x) {
				if (!__Type(x).object) return;
				let data = this.position;
				for (let i in data)
					if (i in x) this.node.style[i] = String(x[i])+"px";
				return;
			}
		},
		/**. '{object highlight(boolean show)}: Exibe ou remove destaque ao elemento.**/
		highlight: {
			value: function(show) {
				if (show === false) {
					const query = document.querySelectorAll("[data-js-wd-area]");
					for (let i = 0; i < query.length; i++)
						query[i].remove();
				} else {
					const data  = this.node.getBoundingClientRect();
					const mouse = window.getComputedStyle(this.node).cursor;
					let  hline = document.querySelector(`[data-js-wd-area="horizontal"]`);
					let  vline = document.querySelector(`[data-js-wd-area="vertical"]`);
					if (hline === null) {
						hline = document.createElement("DIV");
						hline.dataset.jsWdArea = "horizontal";
						document.body.appendChild(hline);
					}
					if (vline === null) {
						vline = document.createElement("DIV");
						vline.dataset.jsWdArea = "vertical";
						document.body.appendChild(vline);
					}
					hline.style.top    = data.top+"px";
					hline.style.height = data.height+"px";
					hline.style.cursor = mouse;
					vline.style.left   = data.left+"px";
					vline.style.width  = data.width+"px";
					vline.style.cursor = mouse;
				}
				return;
			}
		},
		/**. '{array textNodes()}: Retorna uma lista de nós de texto.**/
		textNodes: {
			get: function() {
				function getTextNode(elem) {
					const nodes = elem.childNodes;
					let   list  = [];
					for (let i = 0; i < nodes.length; i++) {
						if (nodes[i].nodeType === 3) /*-- texto --*/
							list.push(nodes[i]);
						else if (nodes[i].nodeType === 1) /*-- elemento --*/
							list = list.concat(getTextNode(nodes[i]));
					}
					return list;
				}
				return getTextNode(this.node);
			}
		},
		/**. '{array textNodesData()}: Retorna uma lista de objetos contendo as seguintes propriedades:
		|nome|Descrição|
		|node|O nó textual|
		|text|O texto normalizado em NFC|
		|init|O primeiro índice em relação ao primeiro caracteres do primeiro nó|
		|last|O último índice em relação ao primeiro caracteres do primeiro nó|
		|size|O tamanho de '{text}|**/
		textNodesData: {
			get: function() {
				const nodes = this.textNodes;
				const index = [];
				const re    = /[\u0300-\u036f]/g;
				let node, text, size, last, init = 0;
				for (let i = 0; i < nodes.length; i++) {
					node = nodes[i];
					text = node.nodeValue.normalize("NFC");
					size = text.length;
					last = init + size - 1;
					index.push({node: node, text: text, init: init, last: last, size: size});
					init += size;
				}
				return index;
			}
		},
		/**. '{object textMatch(regexp|string search)}: Localiza o fragmento '{search} no conteúdo textual e retorna nulo, se não encontrado, ou objeto contendo:
		|Nome|Tipo|Descrição|
		|value|string|Valor textual capturado|
		|length|integer|Comprimento do valor textual|
		|init|integer|Índice inicial da captura|
		|last|integer|Índice final da captura|**/
		textMatch: {
			value: function(search) {
				const test = new __Type(search);
				const view = this.node.innerText.replace(/\u00A0/g, " ").normalize("NFC");
				const text = this.node.textContent.replace(/\u00A0/g, " ").normalize("NFC");
				let re, find = null;
				/*-- localizar no texto renderizado --*/
				if (test.regexp) {
					find = search.test(view) ? view.match(search)[0] : null;
				}
				else if (test.nonempty) {
					search = search.replace(/\u00A0/g, " ").normalize("NFC");
					if (view.indexOf(search) >= 0)
						find = search;
					else if (view.toUpperCase().indexOf(search.toUpperCase()) >= 0)
						find = search.toUpperCase();
					else if (view.toLowerCase().indexOf(search.toLowerCase()) >= 0)
						find = search.toLowerCase();
					else
						find = null;
				}
				/*-- localizar no texto do nó --*/
				if (find !== null) {
					re = find.replace(/\s+/g, " ").trim();
					re = re.replace(/([^0-9a-zA-Z\ ])/gi, "\\$1");
					re = re.replace(/\s+/g, "\\s+");
					const regexp = new RegExp(re, "i");
					const match  = regexp.test(text) ? text.match(regexp)[0] : null;
					if (match === null) throw new Error("Location of the text fragment.");
					return {
						value:  match,
						init:   text.indexOf(match),
						last:   text.indexOf(match) + match.length - 1,
						length: match.length,
					};
				}
				return null;
			}
		},
		/**. '{void insertTag(string tag, integer start, integer end)}: Insere uma '{tag} HTML entre os índices '{start} e '{end} do conteúdo textual. Método destrutivo, não utilizar se houver conteúdo editável no nó.**/
		textTag: {
			value: function(tag, init, last) {
				const test = {init: new __Type(init), last: new __Type(last)};
				const data = this.textNodesData;
				const html = __HTML(tag);
				const trim = {
					init: test.init.integer && test.init >= 0 ? test.init.value : 0,
					last: test.last.integer && test.last >= 0 ? test.last.value : Infinity
				}
				if (trim.init > trim.last) {
					const aux = trim.init;
					trim.init = trim.last;
					trim.last = aux;
				}
				/*-- percorrer nós de texto --*/
				for (let i = 0; i < data.length; i++) {
					let item  = data[i];
					let node  = item.node;
					let text  = node.nodeValue;
					let elem  = html.cloneNode(false);
					let group = [];
					let index = function(trim) {return trim - item.init;}
					/*-- não iniciado ou encerrado --*/
					if (trim.init > item.last || trim.last < item.init) { console.log("não iniciado ou encerrado")
						if (trim.last < item.init) return;
						continue;
					}
					/*-- totalmente contido: text+node+text --*/
					else if (trim.init > item.init && trim.last < item.last) { console.log("totalmente contido")
						group.push({text: text.slice(0, index(trim.init)), type: "text"});
						group.push({text: text.slice(index(trim.init), index(trim.last)+1), type: "elem"});
						group.push({text: text.slice(index(trim.last)+1), type: "text"});
					}
					/*-- totalmente ocupado: node --*/
					else if (trim.init <= item.init && trim.last >= item.last) { console.log("totalmente ocupado")
						group.push({text: text, type: "elem"});
					}
					/*-- parcialmente contido à direita: text+node --*/
					else if (trim.init > item.init && trim.last >= item.last) { console.log("parcialmente contido à direita")
						group.push({text: text.slice(0, index(trim.init)), type: "text"});
						group.push({text: text.slice(index(trim.init)),    type: "elem"});
					}
					/*-- parcialmente contido à esquerda: node+text --*/
					else if (trim.init <= item.init && trim.last < item.last) { console.log("parcialmente contido à esquerda")
						group.push({text: text.slice(0, index(trim.last)+1), type: "elem"});
						group.push({text: text.slice(index(trim.last)+1),    type: "text"});
					}
					/*-- adicionar novos nós e excluir o original --*/
					for (let j = 0; j < group.length; j++) {
						let string = group[j].text;
						let isElem = group[j].type === "elem";
						let value  = isElem ? elem : document.createTextNode(string);
						if (isElem) elem.textContent = string;
						node.parentNode.insertBefore(value, node);
					}
					node.parentNode.removeChild(node);
				}
				return;
			}
		},
		/**. '{void tagText(node elem)}: Transforme o elemento filho '{elem} em nó de texto.**/
		tagText: {
			value: function(elem) {
				if (this.node.contains(elem)) {
					const text = elem.textContent.length === 0 ? null : document.createTextNode(elem.textContent);
					if (text === null)
						elem.remove	(elem);
					else
						elem.parentElement.replaceChild(text, elem);
				}
				return;
			}
		},











		/**. '{void select()}: Seleciona o conteúdo do nó.**/
		select: {
			value: function() {
				const select = window.getSelection();
				const range  = document.createRange();
				select.removeAllRanges();
				range.selectNode(this.node);
				select.addRange(range);
				return;
			}
		},

		select2: {
			value: function() {
				const select = window.getSelection();
				const range  = document.createRange();
				select.removeAllRanges();
				range.selectNodeContents(this.node);
				select.addRange(range);
				return;
			}
		},

















		/**. '{vois copy()}: Seleciona o conteúdo do nó.**/
		copy: {
			value: function() {
				this.select();
				document.execCommand("copy");
				window.getSelection().removeAllRanges();
			}
		},

		copy2: {
			value: function() {
				this.select2();
				document.execCommand("copy");
				window.getSelection().removeAllRanges();
			}
		},






		/* copiar DOM: elemento ou tudo */
		/*let data = wd_vtype(value);
		if (data.type === "dom" && "execCommand" in document) {
			let element = data.value.length > 0 ? data.value[0] : document.body;
			let range   = document.createRange();
			let select  = window.getSelection();
			select.removeAllRanges();          /* limpar seleção existente */
			//range.selectNodeContents(element); /* pegar os nós do elemento */
		//	select.addRange(range);            /* seleciona os nós do elemento */
			//document.execCommand("copy");      /* copia o texto selecionado */
			//select.removeAllRanges();          /* limpar seleção novamente */
			//return true;
		//}
		/* copiar valor informado */
		//if ("clipboard" in navigator && "writeText" in navigator.clipboard) {
//			navigator.clipboard.writeText(value === null ? "" : value).then(
	//			function () {/*sucesso*/},
		//		function () {/*erro*/}
			//);
			//return true;


		cursor: {
			value: function(n) {
				this.select();
				window.getSelection().collapse(this.node, n);
			}
		},

	});

/*----------------------------------------------------------------------------*/
	/**#4 Tabela
	''constructor object __Table(any input)''
	Construtor para obter dados de tabela e matrizes. O argumento '{input} pode ser uma String CSV, uma matriz de array ou uma tabela HTML;**/
	function __Table(input) {
		if (!(this instanceof __Table))	return new __Table(input);
		const parser = new __Parser(input);
		let table;
		if (parser._check.nonempty)
		  table = parser.csvTable.get();
		else if (parser._check.array)
		  table = parser.matrixCSV.csvTable.get();
		else if (parser._check.node && parser._check.value[0].tagName.toLowerCase() === "table")
		  table = parser._check.value[0];
		else
		  table = document.createElement("TABLE");
		Object.defineProperties(this,
		  /**. '{node table}: Retorna a tabela.**/
		  {table: {value: table}}
		);
	}

	Object.defineProperties(__Table.prototype, {
		constructor: {value: __Table},
		/**. '{object to}: Retorna um objeto para exportar os dados da tabela para:
		|Nome|Descrição|
		|matrix|Retorna os nós i{td} e i{th} da tabela em forma de matriz 2X2|
		|values|Semelhante à propriedade '{matrix} mas exibe os valores das células|
		|struct|Retorna uma lista de objetos cujas propriedades correspondem ao título da coluna|
		|csv|Retorna os dados da tabela em formato CSV|
		|json|Retorna o resultado da propriedade '{values} no formato JSON|**/
		to: {
			get: function() {
				const parser = new __Parser(this.table);
				return {
					get matrix() {return parser.tableMatrix.get();},
					get values() {return parser.tableValues.get();},
					get struct() {return parser.tableValues.matrixList.get();},
					get csv()    {return parser.tableValues.matrixCSV.get();},
					get json()   {return parser.tableValues.jsonString.get();}
				};
			}
		},
		/**. '{string toString()}: Retorna os valores da tabela em formato CSV.**/
		toString: {value: function() {return this.to.csv;}},
		/**. '{string valueOf()}: Retorna os valores da tabela em forma de matriz.**/
		valueOf: {value: function() {return this.to.values;}},
		/**. '{integer rows}: Retorna a quantidade de linhas da tabela.**/
    rows: {get: function() {return this.valueOf().length;}},
		/**. '{integer cols}: Retorna a quantidade máxima de colunas da tabela.**/
    cols: {
    	get: function() {
    		const matrix = this.valueOf();
    		let cols = 0;
    		for (let i = 0; i < matrix.length; i++)
    			if (matrix[i].length > cols) cols = matrix[i].length;
    		return cols;
    	}
    },
    /**. '{string caption}: Define ou retorna o valor do título da tabela.**/
		caption: {
		  get: function () {
		    return this.table.caption === null ? "" : this.table.caption.textContent;
		  },
		  set: function (x) {
		    if (this.table.caption === null) {
		      const node = document.createElement("CAPTION");
		      this.table.appendChild(node);
		    }
		    this.table.caption.textContent = String(x);
		  }
		},
		/**. '{array cells(string target, function caller)}: Retorna uma lista de células da tabela conforme configuração definida no argumento '{target}.
		//FIXME os dois ponto está quebrando a linha errada
		. A célula é especificada pelos índices da linha e coluna separados por vírgula (i{row,col}), onde zero é a origem e o caractere "asterísco" o último índice. Para especificar um intervalo de células, deve-se separar as células por um caractere de "dois pontos" (i{row1,col1:row2,col2}), nesse caso, a linha e a coluna da célula inicial devem ser menores ou iguais a aqueles especificados na célula final. Para especificar várias células ou intervalos de forma independente, deve-se separá-los por um caractere de "ponto e vírgula" (i{row1,col1;row2,col2:row3,col3}).
		. A função opcional definida em '{caller} permite alterar o conteúdo retornado. Por padrão, cada item da lista conterá o nó '{td} ou '{th} da tabela conforme definido em '{target}. A função receberá três argumentos, o nó HTML e os índices da linha e coluna, nessa ordem. O retorno da função, se definido, definirá o novo valor do item da lista.**/
		cells: {
			value: function(target, caller) {
				const groups = String(target).replace(/\s+/g, "").split(";");
				const change = new __Type(caller).function;
				const reCell = /^(\d+|\*)\,(\d+|\*)$/;
				const reArea = /^(\d+|\*)\,(\d+|\*)\:(\d+|\*)\,(\d+|\*)$/;
				const rows   = this.rows;
				const cols   = this.cols;
				const matrix = this.to.matrix
				const list   = [];
				let group, data, area, item, result;
				/*-- grupos separados por ";" --*/
				for (let i = 0; i < groups.length; i++) {
					/*-- capturando dados das células --*/
					group = groups[i];
					area  = reArea.test(group);
					if (area || reCell.test(group)) {
						data = {
							row1: group.replace((area ? reArea : reCell), "$1"),
							col1: group.replace((area ? reArea : reCell), "$2"),
							row2: area ? group.replace(reArea , "$3") : null,
							col2: area ? group.replace(reArea , "$4") : null
						};
						/*-- ajustando as células --*/
						for (let attr in data) {
							if (data[attr] === "*")
								data[attr] = ((/^row/).test(attr) ? rows : cols) - 1;
							if (data[attr] !== null)
								data[attr] = Number(data[attr]);
						}
						if (data.row2 === null) data.row2 = data.row1;
						if (data.col2 === null) data.col2 = data.col1;
						/*-- capturando dados --*/
						for (let row = data.row1; row <= data.row2; row++) {
							for (let col = data.col1; col <= data.col2; col++) {
								if (row < rows && col < matrix[row].length) {
									item   = matrix[row][col];
									result = change ? caller(item, row, col) : undefined;
									list.push(result === undefined ? item : result);
								}
							}
						}
					}
				}
				return list;
			}
		},
		/**.  '{node plot(object options)}: Retorna um gráfico de acordo com os dados da tabela e conforme especificado em '{options} (ver __Plot2D.add) ou nulo:
		|Nome|Tipo|Descrição|
		|xLabel|string|Rótulo do eixo i{x}.|
		|yLabel|string|Rótulo do eixo i{y}.|
		|title|string|Título do gráfico.|
		|xAxis|string|Define a formatação da escala do eixo i{x}, se i{number}, i{date}, i{time}, i{datetime} ou i{percent}.|
		|yAxis|string|Define a formatação da escala do eixo i{y} (ver xAxis).|
		|plot|string|Tipo de gráfico, i{plan}, i{cols} ou i{pie}.|
		|data|array|Uma lista de objetos com os parâmetros da plotagem.|
		. Os itens da propriedade '{data} são objetos com os seguintes especificações:
		|Nome|Tipo|Descrição|
		|x|any|Valores do eixo i{x}: um array, um objeto (cols ou pie) ou o número da coluna da tabela precedido de &num;.|
		|y|any|Valores do eixo i{y}, pode ser um array, uma função, uma constante ou o número da coluna precedido de &num;.|
		|label|string|Rótulo do gráfico.|
		|fit|string|Especifica o tipo do gráfico cartesiano.|
		. Os valores permitidos para o atributo '{fit} são:
		|Valor|Descrição|Valores de Y|
		|sum|Exibe a soma aproximada da área dentro da curva.|function, constante, array, matrix|
		|avg|Exibe a média aproximada da curva.|function, array, matrix|
		|line|Liga os pontos do gráfico com um seguimento de reta.||
		|link|Liga os pontos do gráfico com um seguimento de reta lincado por um ponto.|array, matrix|
		|dots|Exibe os pontos do gráfico.|array, matrix|
		|linear|Executa um ajuste linear aproximado.||
		|exponential|Executa um ajuste exponencial aproximado.||
		|geometric|Executa um ajuste geométrico aproximado.||
		|logarithmic|Executa um ajuste logarítmo aproximado.||
		|minimum|Executa um ajuste com o menor desvio médio padrão.||**/
		plot: {
			value: function(options) {
				if (!__Type(options).object) return null;
				const chart = new __Plot2D(options.plot);
				const isCol = /^\#(\d+)$/;
				const data  = __Type(options.data).array ? options.data : [];
				/*-- propriedades principais --*/
				const names = ["xLabel", "yLabel", "title", "xAxis", "yAxis"];
				for (let i = 0; i < names.length; i++) {
					if (names[i] in options)
						chart[names[i]] = options[names[i]];
				}
				/*-- parâmetros de plotagem --*/
				for (let i = 0; i < data.length; i++) {
					if (!__Type(data[i]).object) continue;
					let struct = {x: data[i].x, y: data[i].y, label: data[i].label, fit: data[i].fit};
					let col, arr, cell;
					/*-- x faz referência à coluna --*/
					if (isCol.test(struct.x)) {
						col  = struct.x.replace(isCol, "$1");
						cell = `1,${col}:*,${col}`;
						arr  = this.cells(cell, function(v,r,c) {return v.innerText;});
						struct.x = arr;
					}
					/*-- y faz referência à coluna --*/
					if (isCol.test(struct.y)) {
						col = Number(struct.y.replace(isCol, "$1"));
						cell = `0,${col}:*,${col}`;
						arr = this.cells(cell, function(v,r,c) {return v.innerText;});
						struct.y     = arr.slice(1);
						struct.label = arr[0];
					}
					chart.add(struct.x, struct.y, struct.label, struct.fit);
				}
				return chart.plot();
			}
		},
	});



/*============================================================================*/
	/**#3 Figuras
	''constructor object __SVG(number width=100, number height=100, number xmin=0, number ymin=0)''
	Construtor de imagens SVG.
	Os argumentos são opcionais e estão relacionados ao atributo ['{viewBox}]<https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox> do elemento SVG.
	**/
	function __SVG(width, height, xmin, ymin) {
		if (!(this instanceof __SVG)) return new __SVG(width, height, xmin, ymin);
		const svg  = this.create("svg");
		const vbox = [xmin, ymin, width, height];
		const main = [0, 0, 100, 100];
		for (let i = 0; i < vbox.length; i++)
			vbox[i] = __Type(vbox[i]).finite ? Number(vbox[i]) : main[i];
		svg.setAttribute("viewBox", vbox.join(" "));
		Object.defineProperties(this, {
			_svg:  {value: svg},
			_last: {value: svg, writable: true}
		});
	}
	Object.defineProperties(__SVG.prototype, {
		constructor: {value: __SVG},
		/**. '{node last}: Define (adiciona) ou retorna o último nó adicionado ao SVG.**/
		last: {
			get: function()  {return this._last;},
			set: function(svg) {
				this._svg.appendChild(svg);
				this._last = svg;
			}
		},
		/**. '{node create(string tag)}: Retorna um novo elemento SVG do tipo informado em '{tag}.**/
		create: {
			value: function(tag) {
				return document.createElementNS("http://www.w3.org/2000/svg", tag);
			}
		},
		/**. '{self close()}: Clona o último elemento adicionado e o define no lugar.**/
		clone: {
			value: function() {
				this.last = this.last.cloneNode(true);
				return this;
			}
		},
		/**. '{number xmin}: Retorna e define o valor de '{xmin}.**/
		xmin: {
			get: function()  {return this._svg.viewBox.baseVal.x;},
			set: function(x) {
				if (__Type(x).finite)	this._svg.viewBox.baseVal.x = Number(x);
			}
		},
		/**. '{number ymin}: Retorna e define o valor de '{ymin}.**/
		ymin: {
			get: function()  {return this._svg.viewBox.baseVal.y;},
			set: function(y) {
				if (__Type(y).finite)	this._svg.viewBox.baseVal.y = Number(y);
			}
		},
		/**. '{number width}: Retorna e define o valor de '{width}.**/
		width: {
			get: function()  {return this._svg.viewBox.baseVal.width;},
			set: function(w) {
				if (__Type(w).finite)	this._svg.viewBox.baseVal.width = Number(w);}
		},
		/**. '{number height}: Retorna e define o valor de '{height}.**/
		height: {
			get: function()  {return this._svg.viewBox.baseVal.height;},
			set: function(h) {
				if (__Type(h).finite)	this._svg.viewBox.baseVal.height = Number(h);}
		},
		/**. '{self attribute(object attr)}: Define os atributos do último elemento adicionado. O argumento '{attr} é um objeto cujas chaves representam o valor do atributo e seu respectivo valores.**/
		attribute: {
			value: function(attr) {
				if (__Type(attr).object)
					for (let i in attr) this.last.setAttribute(i, attr[i]);
				return this;
			}
		},
		/**. '{self title(string value)}: Define um título (dica) ao último elemento adicionado. O argumento '{value} é o texto da dica.**/
		title: {
			value: function(value) {
				const svg = this.create("title");
				svg.textContent = value;
				this.last.appendChild(svg);
				return this;
			}
		},
		/**. '{self line(array p1, array p2)}: Define uma linha ligando dois pontos das coordenadas. Os argumentos '{p1} e '{p2} são as coordenadas (x,y).**/
		line: {
			value: function(p1, p2) {
				this.last = this.create("line");
				return this.attribute({x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1]});
			}
		},
		/**. '{self lines(array x, array y, boolean close=false)}: Define diversos segmentos de reta a partir de um conjunto de coordenadas. Os argumentos '{x} e '{y} são as coordenadas (x,y) e o argumento '{close} indica se o último ponto deve voltar à origem.**/
		lines: {
			value: function(x, y, close) {
				this.last = this.create("path");
				let line = x.slice();
				line.forEach(function(v,i,a) {
					a[i] = [(i === 0 ? "M" : "L"), v, y[i]].join(" ");
				});
				if (close === true) x.push("Z");
				return this.attribute({d: line.join(" ")});
			}
		},
		/**. '{self circle(number cx, number cy, number r)}: Define um círculo. Os argumentos '{cx}, '{cy} e '{r} são o centro em x e y e o raio, respectivamente.**/
		circle: {
			value: function(cx, cy, r) {
				this.last = this.create("circle");
				return this.attribute({cx: cx, cy: cy, r: r});
			}
		},
		/**. '{self semicircle(number cx, number cy, number r, number start, number width)}: Define um semicírculo. Os argumentos '{cx}, '{cy} e '{r} são o centro em x e y e o raio, respectivamente. Os argumentos '{start} e '{width} indicam o ângulo inicial e seu tamanho em graus, respectivamente.**/
		semicircle: {
			value: function(cx, cy, r, start, width) {
				this.last = this.create("path");
				if (Math.abs(width) >= 360) return this.circle(cx, cy, r);
				start  = 2*Math.PI*start/360;
				width  = 2*Math.PI*width/360;
				if (width < 0) {
					start += width;
					width  = Math.abs(width);
				}
				const x1 = cx + r*Math.cos(start);
				const y1 = cy - r*Math.sin(start);
				const x2 = cx + r*Math.cos(start + width);
				const y2 = cy - r*Math.sin(start + width);
				const lg = width > Math.PI ? 1 : 0;
				const  d = ["M", cx, cy, "L", x1, y1, "A", r, r, 0, lg, 0, x2, y2, "Z"];
				return this.attribute({d: d.join(" ")});
			}
		},
		/**. '{self rect(number x, number y, number width, number height)}: Define um retângulo. Os argumentos '{x} e '{y} definem o ponto de partida da figura e os argumentos '{width} e '{height} definem o comprimento e a altura do retângulo, respectivamente.**/
		rect: {
			value: function(x, y, width, height) {
				this.last = this.create("rect");
				return this.attribute({x: x, y: y, width: width, height: height});
			}
		},
		/**. '{self path(string path)}: Define um nó SVG a partir de uma sequência de comandos. O argumento '{path} define os comandos.**/
		path: {
			value: function(path) {
				this.last = this.create("path");
				return this.attribute({d: path});
			}
		},
		/**. '{self text(number x, number y, string|array text, string point)}: Define um SVG textual. Os argumentos '{x} e '{y} definem o posicionamento. O argumento '{text}, se lista, criará um elemento i{tspan} para cada item empilhados e, se texto, criará um elemento i{text}. O argumento '{point} define a posição (vertical/horizontal) e a âncora do texto. O primeiro caractere define a posição, i{v} para vertical e i{h} para horizontal, os demais definem a âncora conforme pontos cardeais: i{n, ne, e, se, s, sw, w, nw} e i{c} para o meio.**/
		text: {
			value: function(x, y, text, point) {
				/*-- definindo atributos do texto --*/
				const vanchor = ["start", "middle", "end"];
				const vbase   = ["auto", "middle", "hanging"];
				const anchor  = {n: 1, ne: 2, e: 2, se: 2, s: 1, sw: 0, w: 0, nw: 0, c: 1};
				const base    = {n: 2, ne: 2, e: 1, se: 0, s: 0, sw: 0, w: 1, nw: 2, c: 1};
				const attr    = {
					x: point[0] === "v" ? -y : x,
					y: point[0] === "v" ?  x : y,
					"text-anchor":       vanchor[anchor[point.substring(1)]],
					"dominant-baseline": vbase[base[point.substring(1)]],
					"transform":         point[0] === "v" ? "rotate(270)" : "",
				};
				this.last = this.create("text");
				this.last.style.whiteSpace = "break-spaces";
				this.attribute(attr);
				/*-- definindo texto em linha ou empilhado --*/
				if (!__Type(text).array) {
					const value = String(text);
					const tspan = this.create("tspan");
					tspan.textContent = value == "" ? " " : value;
					this.last.appendChild(tspan);
				} else {
					for (let i = 0; i < text.length; i++) {
						let style = {x: attr.x, dy: (i === 0 ? 0 : "1.5em")};
						let value = String(text[i]);
						let tspan = this.create("tspan");
						tspan.textContent = value === "" ? " " : value;
						for (let j in style) tspan.setAttribute(j, style[j]);
						this.last.appendChild(tspan);
					}
				}
				return this;
			}
		},
		/**. '{self ellipse(number cx, number cy, number rx, number ry)}: Define uma elípse.Os argumentos '{cx}, '{cy}, '{rx} e '{ry} definem o centro de referência em x e y e os raios de x e y, respectivamente.**/
		ellipse: {
			value: function(cx, cy, rx, ry) {
				this.last = this.create("ellipse");
				return this.attribute({cx: cx, cy: cy, rx: rx, ry: ry});
			}
		},
		/**. '{node svg(node append)}: Retorna o elemento SVG. O argumento opcional '{append} irá receber o elemento SVG.**/
		svg: {
			value: function(append) {
				if (__Type(append).node) append.appendChild(this._svg);
				return this._svg;
			}
		},

	});
/*============================================================================*/
	/**#3 Análise de Dados
	#4 Análise Quantitativa
	''constructor object __Data2D(array x, any y)''
	Análise de dados em duas dimensões.
	O argumento '{x} corresponde a uma lista de valores (array) de referência que aceita valores finitos e de data/tempo, conforme regras da biblioteca.
	O argumento '{y} é a resposta em função de '{x}, podendo ser uma lista de valores do mesmo tipo que '{x}, uma constante ou uma função. No caso de função, '{y} receberá o valor de '{y(x)}.
	Valores não finitos serão eliminados do conjunto '{(x, y)}.**/
	function __Data2D(x, y) {
		if (!(this instanceof __Data2D)) return new __Data2D(x, y);
		const xtest = __Type(x);
		const ytest = __Type(y);
		function dataArray(n) {
			const check = __Type(n);
			if (check.finite)
				return check.value;
			if (check.date || check.time || check.datetime)
				return new __DateTime(n).valueOf();
			return null;
		}

		/*-- avaliando X --*/
		x = __Array(xtest.array ? x : []).convert(dataArray, "finite");
		/*-- avaliando Y --*/
		if (ytest.array)
			y = __Array(y).convert(dataArray, "finite");
		else if (ytest.finite)
			y = __Array(x).convert(function(n) {return ytest.value;}, "finite");
		else if (ytest.date || ytest.time || ytest.datetime)
			y = __Array(x).convert(function(n) {return new __DateTime(y).valueOf();}, "finite");
		else if (ytest.function)
			y = __Array(x).convert(y, "finite");
		else
			y = [];

		/*-- igualando conjunto --*/
		const less = y.length < x.length ? y : x;
		const data = [];
		for (let i = 0; i < less.length; i++) {
			if (x[i] !== null && y[i] !== null)
				data.push({x: x[i], y: y[i]});
		}
		/*-- ordenando em x --*/
		data.sort(function(a,b) {
			return a.x === b.x ? 0 : (a.x < b.x ? -1 : 1);
		});

		/*-- retornando valores --*/
		const sortx = [];
		const sorty = [];
		for (let i = 0; i < data.length; i++) {
			sortx.push(data[i].x);
			sorty.push(data[i].y);
		}
		Object.defineProperties(this, {
			/**. '{array x}: Registra os valores do argumento '{x} ajustado.**/
			x: {value: sortx},
			/**. '{array y}: Retorna os valores do argumento '{y} ajustado.**/
			y: {value: sorty},
			/**. '{boolean error}: Se o conjunto tiver menos que um par de valores, retornará verdadeiro.**/
			error: {value: sortx.length < 2 || sorty.length < 2}
		});
	}

	Object.defineProperties(__Data2D.prototype, {
		constructor: {value: __Data2D},
		/**. '{object leastSquares}: Aplica o método dos mínimos quadrados ao conjunto de dados e retorna objeto contendo o coeficiente angular '{a} e o linear '{b} de '{y = ax + b}.**/
		leastSquares: {
			get: function () {
				if (this.error) return {a: 0, b: 0};
				if ("_leastSquares" in this) return this._leastSquares;
				const x   = this.x;
				const y   = this.y;
				const len = x.length;
				let sumX  = 0;
				let sumY  = 0;
				let sumX2 = 0;
				let sumXY = 0;
				for (let i = 0; i < len; i++) {
					sumX  += x[i];
					sumY  += y[i];
					sumX2 += x[i]*x[i];
					sumXY += x[i]*y[i];
				}
				const data = {};
				data.a = ((len * sumXY) - (sumX * sumY)) / ((len * sumX2) - (sumX * sumX));
				data.b = ((sumY) - (sumX * data.a)) / (len);
				this._leastSquares = data;
				return this.leastSquares;
			}
		},
		/**. '{object standardDeviation}: Retorna o desvio padrão entre o conjunto de dados.**/
		standardDeviation: {
			get: function() {
				if (this.error) return Infinity;
				if ("_standardDeviation" in this) return this._standardDeviation;
				const data = [];
				for (let i = 0; i < this.x.length; i++)
					data.push(this.x[i] - this.y[i]);
				this._standardDeviation = Math.hypot.apply(null, data) / Math.sqrt(data.length);
				return this._standardDeviation;
			}
		},
		/**. '{object linearFit}: Retorna um objeto contendo os dados da regressão linear ou '{null} em caso de erro.
		. O objeto retornado possui as chaves '{t} (tipo/nome da regressão); '{a} e '{b} (coeficientes da regressão); '{f} (função da regressão); '{d}: (desvio padrão), '{m} (representação visual da regressão); e '{s} (igual a '{m} mas exibindo os coeficientes).**/
		linearFit: {
			get: function() {
				if (this.error) return null;
				if ("_linearFit" in this) return this._linearFit;
				const X    = new __Array(this.x);
				const Y    = new __Array(this.y);
				const sqrs = this.leastSquares;
				const fit  = {};
				fit.a = sqrs.a;
				fit.b = sqrs.b;
				fit.f = function(x) {return fit.a*x + fit.b;}
				fit.d = new __Data2D(this.y, X.convert(fit.f, "finite")).standardDeviation;
				fit.m = "y = a x + (b) ± σ";
				fit.s = fit.m.toString()
				const cte = {a: "a", b: "b", d: "σ"};
				for (let k in cte) fit.s = fit.s.replace(cte[k], fit[k]);
				this._linearFit = fit;
				return fit;
			}
		},
		/**. '{object geometricFit}: Retorna um objeto contendo os dados da regressão geométrica ou '{null} em caso de erro.
		. O objeto retornado possui as mesmas caractrísticas de '{linearFit}. **/
		geometricFit: {
			get: function() {
				if (this.error) return null;
				if ("_geometricFit" in this) return this._geometricFit;
				const X    = new __Array(this.x);
				const Y    = new __Array(this.y);
				const data = new __Data2D(
					X.convert(Math.log, "finite"),
					Y.convert(Math.log, "finite")
				);
				if (data.error) {
					this._geometricFit = null;
					return null;
				}
				const sqrs = data.leastSquares;
				const fit  = {};
				fit.a = Math.exp(sqrs.b);
				fit.b = sqrs.a;
				fit.f = function(x) {return fit.a*Math.pow(x, fit.b);}
				fit.d = __Data2D(this.y, X.convert(fit.f, "finite")).standardDeviation;
				fit.m = "y = a x^(b) ± σ";
				fit.s = fit.m.toString();
				const cte = {a: "a", b: "b", d: "σ"};
				for (let k in cte) fit.s = fit.s.replace(cte[k], fit[k]);
				this._geometricFit = fit;
				return fit;
			}
		},
		/**. '{object exponentialFit}: Retorna um objeto contendo os dados da regressão exponencial ou '{null} em caso de erro.
		. O objeto retornado possui as mesmas caractrísticas de '{linearFit}. **/
		exponentialFit: {
			get: function() {
				if (this.error) return null;
				if ("_exponentialFit" in this) return this._exponentialFit;
				const X    = new __Array(this.x);
				const Y    = new __Array(this.y);
				const data = new __Data2D(this.x, Y.convert(Math.log, "finite"));
				if (data.error) {
					this._exponentialFit = null;
					return null;
				}
				const sqrs = data.leastSquares;
				const fit  = {};
				fit.a = Math.exp(sqrs.b);
				fit.b = sqrs.a;
				fit.f = function(x) {return fit.a*Math.exp(fit.b*x);}
				fit.d = __Data2D(this.y, X.convert(fit.f, "finite")).standardDeviation;
				fit.m = "y = a exp(b x) ± σ";
				fit.s = fit.m.toString();
				const cte = {a: "a", b: "b", d: "σ"};
				for (let k in cte) fit.s = fit.s.replace(cte[k], fit[k]);
				this._exponentialFit = fit;
				return fit;
			}
		},
		/**. '{object logarithmicFit}: Retorna um objeto contendo os dados da regressão logarítmica ou '{null} em caso de erro.
		. O objeto retornado possui as mesmas caractrísticas de '{linearFit}.**/
		logarithmicFit: {
			get: function() {
				if (this.error) return null;
				if ("_logarithmicFit" in this) return this._logarithmicFit;
				const X    = new __Array(this.x);
				const Y    = new __Array(this.y);
				const data = new __Data2D(this.x, Y.convert(Math.exp, "finite")
				);
				if (data.geometricFit === null) {
					this._logarithmicFit = null;
					return null;
				}
				const sqrs = data.geometricFit;
				const fit  = {};
				fit.a = sqrs.b;
				fit.b = Math.pow(sqrs.a, 1/sqrs.b);
				fit.f = function(x) {return fit.a*Math.log(fit.b*x);}
				fit.d = __Data2D(this.y, X.convert(fit.f)).standardDeviation;
				fit.m = "y = a ln(b x) ± σ";
				fit.s = fit.m.toString();
				const cte = {a: "a", b: "b", d: "σ"};
				for (let k in cte) fit.s = fit.s.replace(cte[k], fit[k]);
				this._logarithmicFit = fit;
				return fit;
			}
		},
		/**. '{object minDeviation}: Retorna o objeto contendo os dados da regressão com o menor valor de desvio padrão.**/
		minDeviation: {
			get: function() {
				if (this.error) return null;
				if ("_minDeviation" in this) return this._minDeviation;
				const fit  = ["linear", "geometric", "exponential", "logarithmic"];
				const best = {value: Infinity, name: null};
				for (let i = 0; i < fit.length; i++) {
					let id = fit[i]+"Fit";
					if (this[id] !== null && this[id].d < best.value) {
						 best.value = this[id].d;
						 best.name  = id;
						 if (best.value === 0) break;
					}
				}
				this._minDeviation = best.name === null ? null : this[best.name];
				return this._minDeviation;
			}
		},
		/**. '{number area}: Retorna a soma da área entre a reta que liga as coordenadas e o eixo '{y} em zero ou '{null} em caso de falha.**/
		area: {
    	get: function() {
	    	if (this.error) return null;
				if ("_area" in this) return this._area;
				const x  = this.x;
				const y  = this.y;
				let area = 0;
				for (let i = 1; i < x.length; i++)
					area += (y[i]+y[i-1])*(x[i]-x[i-1])/2;
				this._area = area;
				return this._area;
		  }
    },
    /**. '{number average}: Retorna a média do valor obtido com o atributo '{area} ou '{null} em caso de falha.**/
    average: {
    	get: function() {
    		if (this.area === null) return null;
    		if ("_average" in this) return this._average;
    		const data = new __Array(this.x);
    		const div  = data.max - data.min;
    		this._average = div === 0 ? null : this.area / div;
    		return this._average;
    	}
    },
	});
/*============================================================================*/
	/**#4 Análise Gráfica
	''constructor object __Plot2D(string type)''
	Objeto para preparar dados para construção de gráfico 2D. O argumento '{type} define o tipo do gráfico:
	|Valor|Descrição|
	|plan|Gráfico cartesiano xy (padrão)|
	|cols|Gráfico de colunas|
	|pie|Gráfico circular ou gráfico de colunas se houver valores negativos|**/
	function __Plot2D(type) {
		if (!(this instanceof __Plot2D)) return new __Plot2D(type);
		type = String(type).toLowerCase();
		const types = ["plan", "cols", "pie"];
		const chart = types.indexOf(type) < 0 ? types[0] : type;
		Object.defineProperties(this, {
			_chart:  {value: chart},                        /* tipo do gráfico */
			_title:  {value: "Title",   writable: true},    /* título do gráfico */
			_xLabel: {value: "X Label", writable: true},    /* nome do eixo x */
			_yLabel: {value: "Y Label", writable: true},    /* nome do eixo y */
			_xAxis:  {value: "default", writable: true},    /* tipo de dado do eixo x */
			_yAxis:  {value: "default", writable: true},    /* tipo de dado do eixo y */
			_id:     {value: -1,        writable: true},    /* controle das plotagens */
			_data:   {value: []},                           /* dados adicionados para plotagem */
			_min:    {value: {x: +Infinity, y: +Infinity}}, /* menor valor de x,y */
			_max:    {value: {x: -Infinity, y: -Infinity}}, /* maior valor de x,y */
		});
	}

	Object.defineProperties(__Plot2D.prototype, {
		constructor: {value: __Plot2D},
		/**. '{number _xMax}: Define ou retorna o maior valor da coordenada '{x}.**/
		_xMax: {
			get: function()  {
				let min = this._min.x;
				let max = this._max.x;
				return max + (min === max ? (max === 0 ? 1 : max/2) : 0);
			},
			set: function(x) {
				if (x > this._max.x) this._max.x = x;
			}
		},
		/**. '{number _yMax}: Define ou retorna o maior valor da coordenada '{y}.**/
		_yMax: {
			get: function()  {
				let min = this._min.y;
				let max = this._max.y;
				return max + (min === max ? (max === 0 ? 1 : max/2) : 0);
			},
			set: function(y) {
				if (y > this._max.y) this._max.y = y;
			}
		},
		/**. '{number _xMin}: Define ou retorna menor valor da coordenada '{x}.**/
		_xMin: {
			get: function()  {
				let min = this._min.x;
				let max = this._max.x;
				return min - (min === max ? (min === 0 ? 1 : min/2) : 0);
			},
			set: function(x) {
				if (x < this._min.x) this._min.x = x;
			}
		},
		/**. '{number _yMin}: Define ou retorna menor valor da coordenada '{y}.**/
		_yMin: {
			get: function()  {
				let min = this._min.y;
				let max = this._max.y;
				return min - (min === max ? (min === 0 ? 1 : min/2) : 0);
			},
			set: function(y) {
				if (y < this._min.y) this._min.y = y;
			}
		},
		/**. '{number _xScale(number x)}: Transforma a coordenada horizontal real i{x} para gráfica.**/
		_xScale: {
			value: function(x) {
				let dx = this._xMax - this._xMin;
				let dX = this._cfg.xSize;
				let  X = ((x - this._xMin)*(dX/dx)) + this._cfg.xStart;
				return X;
			}
		},
		/**. '{number _yScale(number y)}: Transforma a coordenada vertical real (i{y}) para gráfica.**/
		_yScale: {
			value: function(y) {
				let dy = this._yMax - this._yMin;
				let dY = -this._cfg.ySize;
				let  Y = ((y - this._yMin)*(dY/dy)) + this._cfg.yClose;
				return Y;
			}
		},
		/**. '{number _dx}: Retorna o menor valor real de '{x}.**/
		_dx: {
			get: function() {
				let width = this._cfg.width + (this._cfg.width%2 === 0 ? 1 : 0);
				return Math.abs(this._xMax - this._xMin)/width;
			}
		},
		/**. '{array _xSpace}: Retorna uma lista contendo todos os valores possíveis de '{x}**/
		_xSpace: {
			get: function() {
				const x   = [this._xMin];
				const max = this._xMax;
				const dx  = this._dx;
				const mid = (this._xMax + this._xMin)/2;
				let value = -Infinity;
				while (value < max) {
					value = x[x.length - 1] + dx;
					/*-- número central de x (manter nessa posição) --*/
					if (value > mid && (value-dx) < mid) x.push(mid);
					x.push(value <= max ? value : max);
				}
				return x;
			}
		},
		/**. '{object _cfg}: Registra as configurações do gráfico:
		|Nome|Tipo|Descrição|
		|vertical|number|registra o menor tamanho da tela do dispositivo.|
		|horizontal|number|registra o maior tamanho da tela do dispositivo.|
		|xInit|number|Registra o início do eixo horizontal '{x} (porcentagem).|
		|xEnd|number|Registra o fim do eixo horizontal '{x} (porcentagem).|
		|yInit|number|Registra o início do eixo vertical '{y} (porcentagem).|
		|yEnd|number|Registra o fim do eixo vertical '{y} (porcentagem).|
		|points|number|Número de divisões dos eixos no gráfico (impar).|
		|padd|number|Define um valor para espaçamento relativo (porcentagem).|
		|width|number|Define a dimensão horizontal do gráfico.|
		|height|number|Retorna a dimensão vertical do gráfico proporcional à '{width}.|
		|xStart|number|Coordenada horizontal da origem do gráfico.|
		|xSize|number|Tamanho do eixo '{x}.|
		|xMiddle|number|Metade do eixo '{x}.|
		|xClose|number|Fim do eixo '{x}.|
		|yStart|number|Coordenada vertical da origem do gráfico.|
		|ySize|number|Tamanho do eixo '{y}.|
		|yMiddle|number|Metade do eixo '{y}.|
		|yClose|number|Fim do eixo '{y}.|
		|top|number|A metade do espaço superior.|
		|bottom|number|A metade do espaço inferior.|
		|left|number|A metade do espaço esquerdo.|
		|right|number|A metade do espaço direito.|
		|padding|number|Retorna o espaçamento definido.|**/
		_cfg: {
			value: {
				vertical:   Math.min(window.screen.width, window.screen.height),
				horizontal: Math.max(window.screen.width, window.screen.height),
				xInit:      0.10,
				xEnd:       0.80,
				yInit:      0.10,
				yEnd:       0.90,
				points:     5.00,
				padd:       0.005,
				width:      1000,
				get height()  {return this.width * (this.vertical / this.horizontal);},
				get xStart()  {return this.xInit * this.width;},
				get xClose()  {return this.xEnd * this.width;},
				get xSize()   {return this.xClose - this.xStart;},
				get xMiddle() {return this.xStart + (this.xSize/2);},
				get yStart()  {return this.yInit * this.height;},
				get yClose()  {return this.yEnd * this.height;},
				get ySize()   {return this.yClose - this.yStart;},
				get yMiddle() {return this.yStart + (this.ySize/2);},
				get top()     {return this.yStart/2;},
				get bottom()  {return this.yClose + (this.height - this.yClose)/2;},
				get left()    {return this.xStart/2;},
				get right()   {return this.xClose + (this.width - this.xClose)/2;},
				get padding() {return this.padd*this.width;}
			}
		},
		/**. '{void color(integer id)}: Retorna a cor a partir do identificador ('{id}) de ciclo  infinito.**/
		color: {
			value: function(id) {
				if (id === undefined) return "#000000";
				const colors = [
					"darkred",   "navy",           "indigo",          "teal",
					"crimson",   "dodgerblue",     "mediumslateblue", "yellowgreen",
					"deeppink",  "cornflowerblue", "purple",          "darkgreen",
					"orangered", "cyan",           "blueviolet",      "limegreen",
					"dimgray"
				];
				const color = __Array(colors);
				return color.valueOf(id);
			}
		},
		/**. '{void _struct(node svg, string builder)}: Constrói a área do gráfico, devendo ser chamado após a análise dos dados. O argumento '{svg} é o objeto de construçã da imagem do gráfico e '{builder} é uma string podendo adicionar os seguintes valores separados por espaços:
		|Nome|Descrição|
		|title|Adiciona o título ao gráfico.|
		|xlabel|Adiciona o rótulo do eixo x.|
		|ylabel|Adiciona o rótulo do eixo y.|
		|xyplan|Adiciona um retângulo à area de plotagem.|
		|xyaxes|Adiciona os eixos abscissa e ordenada (incompatível com xyplan).|
		|hlines|Adiciona subdivisões de linhas horizontais.|
		|vlines|Adiciona subdivisões de linhas verticais.|
		|xscale|Adiciona a escala ao eixo x.|
		|yscale|Adiciona a escala ao eixo y.|
		|hzero|Adiciona uma linha horizontal se zero estiver no intervalo.|
		|vzero|Adiciona uma linha vertical se zero estiver no intervalo.|
		|mouse|Adiciona um identificador de posição no gráfico a partir da posição do mouse.|**/
		_struct: {
			value: function(svg, builder) {
				if (!__Type(builder).chars) return;
				const cfg    = this._cfg;
				const parts  = builder.replace(/\ +/, " ").trim().toLowerCase().split(" ");
				const chart  = {};
				const color  = this.color();
				const border = {n: false, e: false, s: false, w: false};
				for (let i = 0; i < parts.length; i++) chart[parts[i]] = true;

				/*-- Área de plotagem --*/
				const attrMain = {stroke: "none", fill: "none", "stroke-width": 2, "stroke-linecap": "round"};
				svg.rect(cfg.xStart, cfg.yStart, cfg.xSize, cfg.ySize).attribute(attrMain);
				const main = svg.last;

				/*-- Título do gráfico --*/
				if (chart.title) {
					svg.text(cfg.xMiddle, cfg.top, this.title, "hc").attribute({
						fill: color, "font-size": "1.5em", "font-weight": "bold", cursor: "default"
					});
				}
				/*-- Rótulo do eixo horizontal --*/
				if (chart.xlabel) {
					svg.text(cfg.xMiddle, cfg.height - 2*cfg.padding, this.xLabel, "hs")
					.attribute({fill: color, cursor: "default"});
				}
				/*-- Rótulo do eixo vertical --*/
				if (chart.ylabel) {
					svg.text(2*cfg.padding, cfg.yMiddle, this.yLabel, "vn")
					.attribute({fill: color, cursor: "default"});
				}
				/*-- Linha secundária de zero horizontal --*/
				if (chart.hzero && (this._yMin < 0 && this._yMax > 0)) {
					const zero = this._yScale(0);
					svg.line([cfg.xStart, zero], [cfg.xClose, zero])
					.attribute({stroke: color, "stroke-width": 2, fill: "none"});
				}
				/*-- Linha secundária de zero vertical --*/
				if (chart.vzero && (this._xMin < 0 && this._xMax > 0)) {
					const zero = this._xScale(0);
					svg.line([zero, cfg.yStart], [zero, cfg.xClose])
					.attribute({stroke: color, "stroke-width": 2, fill: "none"});
				}
				/*-- Abscissas e ordenadas (retângulo) --*/
				if (chart.xyplan) {
					main.setAttribute("stroke", color);
					for (let j in border) border[j] = true;
				}
				/*-- Abscissa e ordenada (eixos perpendiculares) --*/
				else if (chart.xyaxes) {
					svg.lines(
						[cfg.xStart, cfg.xStart, cfg.xClose],
						[cfg.yStart, cfg.yClose, cfg.yClose],
						false
					).attribute(attrMain).attribute({stroke: color});
					border.s = true;
					border.w = true;
				}
				/*-- pontos, valores e âncoras --*/
				const dw = (cfg.xClose - cfg.xStart) / (cfg.points - 1);
				const dh = (cfg.yClose - cfg.yStart) / (cfg.points - 1);
				const dx = (this._xMax - this._xMin) / (cfg.points - 1);
				const dy = (this._yMax - this._yMin) / (cfg.points - 1);
				const xAxis = this.xAxis;
				const yAxis = this.yAxis;
				let px, py, vx, vy, ax, ay;
				let i = -1;
				while (++i < cfg.points) {
					/*-- obtendo referenciais para montagem da área de plotagem --*/
					let zero = i === 0;
					let half = i === ((cfg.points - 1) / 2);
					let last = i === (cfg.points - 1);
					let hide = i%2 !== 0;
					let line = {h: true, v: true};
					/*-- primeiro e último valor da escala --*/
					if (zero || last) {
						px = zero ? cfg.xStart : cfg.xClose;
						py = zero ? cfg.yClose : cfg.yStart;
						vx = zero ? this._xMin : this._xMax;
						vy = zero ? this._yMin : this._yMax;
						ax = zero ? "hnw" : "hne";
						ay = zero ? "hse" : "hne";
						line.h = zero ? !border.s : !border.n;
						line.v = zero ? !border.w : !border.e;
					}
					/*-- valores intermediários da escala --*/
					else {
						px = half ? (cfg.xClose + cfg.xStart) / 2 : px + dw;
						py = half ? (cfg.yStart + cfg.yClose) / 2 : py - dh;
						vx = half ? (this._xMax + this._xMin) / 2 : vx + dx;
						vy = half ? (this._yMax + this._yMin) / 2 : vy + dy;
						ax = "hn";
						ay = "he";
					}
					/*-- Linhas secundárias horizontais --*/
					if (chart.hlines) {
						svg.line([cfg.xStart, py], [cfg.xClose, py]).attribute({
							stroke: "#778899", "stroke-width": 1, "stroke-linecap": "round",
							"stroke-dasharray": (vy === 0 ? "none" : "6,6"),
							"class": (hide ? "js-wd-chart-hide" : ""),
							"display": line.h ? "inline" : "none"
						});
					}
					/*-- Linhas secundárias verticais --*/
					if (chart.vlines) {
						svg.line([px, cfg.yStart], [px, cfg.yClose]).attribute({
							stroke: "#778899", "stroke-width": 1, "stroke-linecap": "round",
							"stroke-dasharray": (vx === 0 ? "none" : "6,6"),
							"class": (hide ? "js-wd-chart-hide" : ""),
							"display": line.v ? "inline" : "none"
						});
					}
					/*-- Escala eixo horizontal --*/
					if (chart.xscale) {
						let size = xAxis === "datetime" ? "x-small" : "smaller";
						let sval = this._values(vx, "x");
						svg.text(px, cfg.yClose + cfg.padding, sval, ax)
						.attribute({
							fill: color, "class": (hide ? "js-wd-chart-hide" : ""),
							cursor: "default", "font-size": size
						}).title(this._values(vx, "X"));
					}
					/*-- Escala eixo vertical --*/
					if (chart.yscale) {
						let size = (/^(date)?(time)?$/).test(yAxis) ? "x-small" : "smaller";
						let sval = this._values(vy, "y");
						svg.text(cfg.xStart - cfg.padding, py, sval, ay)
						.attribute({
							fill: color, "class": (hide ? "js-wd-chart-hide" : ""),
							cursor: "default", "font-size": size
						}).title(this._values(vy, "Y"));
					}
				}
				/*-- Evento do mouse dentro da área de plotagem --*/
				if (chart.mouse) {
					/*-- texto com os valores do conjunto (x,y) --*/
					svg.text(cfg.width - cfg.padding, cfg.height - cfg.padding, "", "hse")
					.attribute({
						fill: color, cursor: "default", "data-wd-chart-tool": "coordinates",
						"font-size": "small"
					});
					/*-- linha horizontal --*/
					svg.line([cfg.xStart, cfg.yStart], [cfg.xClose, cfg.yStart])
					.attribute({
						"stroke-width": 1, stroke: color, display: "none", "data-wd-chart-tool": "hline"
					});
					/*-- linha vertical --*/
					svg.line([cfg.xStart, cfg.yStart], [cfg.xStart, cfg.yClose])
					.attribute({
						"stroke-width": 1, stroke: color, display: "none", "data-wd-chart-tool": "vline"
					});
					/*-- Disparador do Evento do mouse --*/
					const self = this;
					svg.svg().onmousemove = function (ev) {
						const ps = svg.svg().getBoundingClientRect();
						const pm = main.getBoundingClientRect();
						const mx = ev.clientX;
						const my = ev.clientY;
						const go = mx >= pm.left && mx <= pm.right && my >= pm.top && my <= pm.bottom;
						const hline = svg.svg().querySelector("[data-wd-chart-tool=hline]");
						const vline = svg.svg().querySelector("[data-wd-chart-tool=vline]");
						const xypos = svg.svg().querySelector("[data-wd-chart-tool=coordinates]");
						/*-- Dentro da área de plotagem --*/
						if (go) {
							const dx = self._xMax - self._xMin;
							const dy = self._yMax - self._yMin;
							const vx = self._xMin + ((mx - pm.left)/pm.width)*dx;
							const vy = self._yMax - ((my - pm.top)/pm.height)*dy;
							const px = self._xScale(vx);
							const py = self._yScale(vy);
							const tx = self._values(vx, "X");
							const ty = self._values(vy, "Y");
							const hl = {y1: py, y2: py, display: "inline"};
							const vl = {x1: px, x2: px, display: "inline"};
							xypos.textContent = tx+" × "+ty;
							svg.svg().setAttribute("cursor", "crosshair");
							for (let i in hl) hline.setAttribute(i, hl[i]);
							for (let i in vl) vline.setAttribute(i, vl[i]);
						}
						/*-- Fora da área de plotagem --*/
						else {
							xypos.textContent = "";
							hline.setAttribute("display", "none");
							vline.setAttribute("display", "none");
							svg.svg().removeAttribute("cursor");
						}
						return;
					}
				}
				return;
			}
		},
		/**. '{string _values(number value, string type)}: Formata e retorna o valor a ser exibido nos eixos. O argumento '{value} corresponde ao valor numérico a ser formatado. O argumento opcional '{type} diz respeito ao tipo de informação (number, i{time}, i{date}, i{datetime} ou i{percent}).**/
		_values: {
			value: function(value, axis) {
				//minúsculo é para o eixo maiúsculo para para exibição
				const x = axis === "x" || axis === "X";
				const y = axis === "y" || axis === "Y";
				/*-- valores para eixos e exibição --*/
				if (x || y) {
					const scale = x ? this.xAxis : this.yAxis;
					/*-- escala data/tempo | valor para eixo e exibição --*/
					if ((/^(date|time|datetime)$/).test(scale)) {
						const num = new __DateTime(value);
						if (scale === "date") return num.toLocaleDateString();
						if (scale === "time") return num.toLocaleTimeString();
						const dt = num.toLocaleString()
						return axis === "y" ? dt.replace(/\,?\s+/, "\n") : dt;
					}
					/*-- escala numérica/proporcional --*/
					const num = new __Number(value);
					const exp = num.exp;
					let cfg;
					/*-- valores para eixo --*/
					if (axis === "x" || axis === "y") {
						if (scale === "percent") {
							cfg = {type: "percent"};
							     if (num ==  0) cfg.decimal = 0;
							else if (exp <= -4) cfg.decimal = 4;
							else if (exp <= -3) cfg.decimal = 3;
							else if (exp <=  0) cfg.decimal = 2;
							else if (exp <= +1) cfg.decimal = 1;
							else                cfg.decimal = 0;
						} else {
							     if (num ==    0) cfg = {type: "decimal",    decimal: 0};
							else if (exp >=  100) cfg = {type: "scientific", decimal: 0};
							else if (exp >=   10) cfg = {type: "scientific", decimal: 1};
							else if (exp >=    3) cfg = {type: "scientific", decimal: 2};
							else if (exp >=    2) cfg = {type: "decimal",    decimal: 1};
							else if (exp >=    1) cfg = {type: "decimal",    decimal: 2};
							else if (exp <= -100) cfg = {type: "scientific", decimal: 0};
							else if (exp <=  -10) cfg = {type: "scientific", decimal: 1};
							else if (exp <    -1) cfg = {type: "scientific", decimal: 2};
							else                  cfg = {type: "decimal",    decimal: 2};
						}
					}
					/*-- valores para exibição --*/
					else {
						const min = x ? this._xMin : this._yMin;
						const max = x ? this._xMax : this._yMax;
						const gap = (max - min) / (x ? this._cfg.width : this._cfg.height);
						const dec = gap < 1 ? Math.abs(new __Number(gap).exp) : 0;
						const sci = exp > 2 || exp < -2;
						cfg = {};
						if (scale === "percent") {
							cfg.type = "percent";
							cfg.decimal = dec <= 2 ? 0 : dec-2;
						} else {
							cfg.type    = sci ? "scientific" : "decimal";
							cfg.decimal = dec + (sci ? exp : 0);
						}
					}
					return num.toLocaleString(cfg);
				}
				/*-- valores para constantes --*/
				const num = new __Number(value);
				return num.toLocaleString();
			}
		},
		/**. '{void _legend(node svg, object data)}: Constrói a legenda do gráfico. O argumento '{svg} é o elemento SVG onde o gŕafico está sendo construído. O argumento '{data} contém as propriedades '{id} (identificador da legenda), '{name} (nome da curva), '{info} (informação complementar) e '{color} (cor a ser utilizada na legenda). Se '{name} for nulo, a ação será ignorada.**/
		_legend: {
			value: function(svg, data) {
				/*-- definindo itens da legenda --*/
				const legend = [];
				const items  = [];
				const color  = this.color();
				const char   = {val: "*", len: 35};
				for (let i = 0; i < data.length; i++) {
					if (data[i].name !== null) {
						let name = String(data[i].name).trim();
						let side = Math.trunc((char.len-name.length-2)/2);
						let cfg = {
							id:    String(data[i].id),
							text:  String("\u25A0 "+name),
							color: data[i].color,
							info:  [
								char.val.repeat(side)+" "+String(name)+" "+char.val.repeat(side),
								String(data[i].info),
								char.val.repeat(2*side+2+name.length)
							].join("\n"),
							link: null,
						};
						legend.push(cfg);
						items.push(cfg.text);
					}
				}
				if (legend.length < 1) return;
				/*-- Renderizando os itens da legenda --*/
				svg.text(
					this._cfg.xClose + 2*this._cfg.padding,
					this._cfg.yStart + 2*this._cfg.padding,
					items, "hnw"
				);
				/*-- definindo atributos dos itens da legenda --*/
				const links = svg.last.children;
				for (let i = 0; i < legend.length; i++) {
					legend[i].link = links[i];
					let attr  = {
						"font-size": "1.2em", cursor: "pointer", fill: legend[i].color,
						"data-wd-chart-link": legend[i].id
					};
					for (let j in attr)
						legend[i].link.setAttribute(j, attr[j]);
					/*-- definindo informação complementar da curva --*/
					svg.text(
						this._cfg.xStart + 2*this._cfg.padding,
						this._cfg.yStart + 2*this._cfg.padding,
						legend[i].info, "hnw"
					).attribute({
						fill: color, "font-size": "1em", opacity: "0",
						"font-family": "Courier New, monospace",
						"data-wd-chart-info": legend[i].id
					});
					/*-- definindo ação da legenda --*/
					legend[i].link.onclick = function(ev) {
						let root = ev.target;
						while (root.tagName.toLowerCase() !== "svg")
							root = root.parentElement;
						const id     = ev.target.dataset.wdChartLink;
						const show   = root.dataset.wdChartShow !== id;
						const infos  = root.querySelectorAll("[data-wd-chart-info]");
						const curves = root.querySelectorAll("[data-wd-chart-curve]");
						const links  = root.querySelectorAll("[data-wd-chart-link]");
						root.dataset.wdChartShow = show ? id : "";
						/*-- destacando informações complementares --*/
						for (let k = 0; k < infos.length; k++) {
							let ref = infos[k].dataset.wdChartInfo;
							let val = show && ref === id ? "1" : "0";
							infos[k].setAttribute("opacity", val);
						}
						/*-- destacando curvas --*/
						for (let k = 0; k < curves.length; k++) {
							let ref = curves[k].dataset.wdChartCurve;
							let val = show ? (ref === id ? "0.8" : "0.1") : "1";
							curves[k].setAttribute("opacity", val);
						}
						/*-- destacando items da legenda --*/
						for (let k = 0; k < links.length; k++) {
							let ref = links[k].dataset.wdChartLink;
							let val = show ? (ref === id ? "0.8" : "0.1") : "1";
							links[k].setAttribute("fill-opacity", val);
						}

						return;
					}
				}
				return;
			}
		},
		/**. '{node plot()}: Constrói o gráfico e o retorna (elemento SVG) ou nulo.**/
		plot: {
			value: function() {
				if (this._data.length === 0) return null;
				const attrs = {
					line: {"stroke-width": 3, "stroke-linecap": "round", fill: "none"},
					sum:  {"fill-opacity": 0.5, "stroke-width": 1, "stroke-linecap": "round", fill: "none"},
					dash: {"stroke-width": 1, "stroke-linecap": "round", "stroke-dasharray": "5,5", fill: "none"}
				};
				let data   = this._data.slice();
				let legend = [];
				const svg  = __SVG(this._cfg.width, this._cfg.height);
				//FIXME colocar no CSS ou no style?
				const css  = {backgroundColor: "#ffffff", fontSize: "16px", fontWeight: "normal", fontStyle: "normal"};
				for (let i in css) svg.svg().style[i] = css[i];
				/* redefinindo funções para array ----------------------------------- */
				if (this._chart === "plan") {
					let x = this._xSpace;
					let i = -1;
					while(++i < data.length) {
						if (data[i].f) {
							let list = __Data2D(x, data[i].y);
							if (list.error) return null;
							data[i].x = list.x;
							data[i].y = list.y;
							let yList = __Array(data[i].y);
							this._yMin = yList.min;
							this._yMax = yList.max;
						}
					}
				}
				/*-- plotando plano cartesiano ---------------------------------------*/
				if (this._chart === "plan") {
					let i = -1;
					while(++i < data.length) {
						/* obtendo dados da plotagem */
						let id    = data[i].id;
						let x     = data[i].x.slice();
						let y     = data[i].y.slice();
						let name  = data[i].name;
						let info  = data[i].info;
						let color = this.color(id);
						let curve = {id: id, color: color, info: info, name: name};
						/* transformando coordenadas reais para gráficas */
						for (let i = 0; i < x.length; i++) {
							x[i] = this._xScale(x[i]);
							y[i] = this._yScale(y[i]);
						}
						/* plotando de acordo com o tipo de curva */
						if (data[i].type === "line" || data[i].type === "link") {
							svg.lines(x, y)
							.attribute(attrs.line)
							.attribute({stroke: color, "data-wd-chart-curve": id});
						}
						if (data[i].type === "dash") {
							svg.lines(x, y)
							.attribute(attrs.dash)
							.attribute({stroke: color, "data-wd-chart-curve": id});
						}
						if (data[i].type === "dots" || data[i].type === "link") {
							let j = -1;
							while(++j < x.length) {
								svg.circle(x[j], y[j], 4)
								.attribute({fill: color, "data-wd-chart-curve": id});
							}
						}
						if (data[i].type === "sum") {
							let fit = __Data2D(data[i].x, data[i].y);
							let sum = fit.area;
							curve.info = " ∑ yΔx ≈ " + this._values(sum);
							/* obter posicionamento para inserir o rótulo da área */
							let min = Math.min.apply(null, fit.y);
							let max = Math.max.apply(null, fit.y);
							let big = Math.abs(max) >= Math.abs(min) ? max : min;
							let ind = fit.y.indexOf(big);
							let ym  = this._yScale(big/2);
							let xm  = this._xScale(fit.x[ind]);
							let pm  = "hc";
							if (xm <= this._cfg.xStart) xm += this._cfg.padding;
							if (xm >= this._cfg.xClose) xm -= this._cfg.padding;
							if (xm <= (this._cfg.xStart + this._cfg.xSize/4)) pm = "hw";
							if (xm >= (this._cfg.xClose - this._cfg.xSize/4)) pm = "he";
							/* unindo a curva ao eixo horizontal */
							x.unshift(x[0]);
							x.push(x[x.length - 1]);
							y.unshift(this._yScale(0));
							y.push(this._yScale(0));
							/* plotando */
							svg.lines(x, y, true) /* área */
							.attribute(attrs.sum)
							.attribute({stroke: color, fill: color, "data-wd-chart-curve": id})
							.text(xm, ym, this._values(sum, "Y"), pm) /* valor numérico */
							.attribute({fill: color, "data-wd-chart-curve": id})
						}
						if (data[i].type === "avg") {
							let fit = __Data2D(data[i].x, data[i].y);
							let avg = fit.average;
							let xi  = this._xScale(this._xMin);
							let xn  = this._xScale(this._xMax);
							let ya  = this._yScale(avg);
							curve.info = " (∑ yΔx)/ΔX ≈ " + this._values(avg);
							/* plotando a curva e a linha média */
							svg.lines(x, y)
							.attribute(attrs.dash)
							.attribute({stroke: color, "data-wd-chart-curve": id})
							.lines([xi, xn], [ya, ya])
							.attribute(attrs.line)
							.attribute({stroke: color, "data-wd-chart-curve": id})
							.text(x[0]+5, ya-5, this._values(avg, "Y"), "hsw")
							.attribute({fill: color, "data-wd-chart-curve": id});
						}
						legend.push(curve);
					}
					this._struct(svg, "xyaxes hlines vlines xlabel ylabel xscale yscale title mouse");
				}
				/* plotando gráfico proporcional ------------------------------------ */
				else {
					/* checando condições */
					let minus = false;
					let plus  = false;
					let zero  = true;
					let count = 0;
					let total = 0;
					let positive = 0;
					let negative = 0;
					let min      = +Infinity;
					let max      = -Infinity;

					for (let i in data[0]) {
						let value = data[0][i];
						count++;
						total += value;
						if (value < 0)   minus = true;
						if (value > 0)   plus  = true;
						if (value !== 0) zero  = false;
						if (value < 0) negative += value;
						else           positive += value;
						if (value < min) min = value;
						if (value > max) max = value;
					}
					if (count === 0 || zero) return false;
					/* calculando proporções e definindo limites */
					this._xMin  = 0;
					this._xMax  = count;
					this._yMin  = 0;
					this._yMax  = 0;
					let pieces  = [];
					let id      = -1;

					for (let i in data[0]) {
						let value = data[0][i];
						pieces.push({
							value: value,
							ratio: total === 0 ? null : value/total,
							name:  i,
							id:    ++id,
							color: this.color(id),
						});
						this._yMin = value;
						this._yMax = value;
					}
					/*-- gráfico circular ----------------------------------------------*/
					if (this._chart !== "cols" && minus !== plus && total !== 0) {
						this.yAxis = "percent";
						/*-- rótulo inferior --*/
						svg.text(
							this._cfg.xMiddle, this._cfg.bottom,
							this.yLabel + " × " + this.xLabel, "hc"
						).attribute({cursor: "default"});

						/*-- dados para construção dos semi-círculos --*/
						let start = 0;
						let width = 0;
						let i = -1;
						while (++i < pieces.length) {
							let item  = pieces[i];
							let id    = item.id;
							let name  = item.name;
							let value = item.value;
							let ratio = item.ratio;
							let color = item.color;
							let r     = 2*this._cfg.ySize/5;
							let cx    = this._cfg.xMiddle;
							let cy    = this._cfg.yMiddle;
							let curve = {id: id, color: color, info: "", name: name};
							//FIXME melhorar a notação matemática desse negócio
							curve.info = [
								`i) ${this.xLabel} --`,
								`  i  = ${this._values(i+1)} / ${this._values(count)}`,
								//"  {i ∈ ℕ | 1 ≤ i ≤ n}",
								//"  n = "+this._values(count),
								//"  i = "+this._values(i+1),
								`y) ${this.yLabel} --`,
								`  yᵢ = ${this._values(value)} (${this._values(ratio, "y")})`,

								`  ∑y = ${this._values(total)}`,
								`  ȳ  = ${this._values(total/count)}`,
								`  ${this._values(min)} ≤ y ≤ ${this._values(max)}`,


								//"  {y ∈ ℝ | "+this._values(min)+" ≤ y ≤ "+this._values(max)+"}",
								//"  y     = "+this._values(value),
								//"  ∑yᵢ   = "+this._values(total),
								//"  y/∑yᵢ = "+this._values(ratio, "y"),
								//"  ∑yᵢ/n = "+this._values(total/count)
							].join("\n");
							width = 360*ratio;
							/*-- semi-círculos --*/
							svg.semicircle(cx, cy, r, start, width)
							.attribute({fill: color, "data-wd-chart-curve": id, "fill-opacity": 0.8})
							.attribute({"stroke-linecap": "round", "stroke-width": 1, stroke: color})
							.title(curve.info);
							/*-- legenda ao lado dos semi-círculos --*/
							let m = start + width/2;
							let x = cx + (r + 5)*Math.cos(2*Math.PI*m/360);
							let y = cy - (r + 5)*Math.sin(2*Math.PI*m/360);
							let p;
							if      (m <  90) p = m ===   0 ? "hw" : "hsw";
							else if (m < 180) p = m ===  90 ? "hs" : "hse";
							else if (m < 270) p = m === 180 ? "he" : "hne";
							else if (m < 360) p = m === 270 ? "hn" : "hnw";
							else p = "hw";
							svg.text(x, y, name+" ("+this._values(ratio, "y")+")", p)
							.attribute({fill: color, cursor: "default", "data-wd-chart-curve": id})
							.title(curve.info);
							/* iterando */
							start += width;
							legend.push(curve);
						}
						this._struct(svg, "title");
					}
					/*-- gráfico de colunas --------------------------------------------*/
					else {
						this.yAxis = "number";
						/*-- dados para construção das colunas --*/
						const width = this._cfg.xSize / count;
						let i = -1;
						while (++i < pieces.length) {
							let item  = pieces[i];
							let id    = item.id;
							let color = item.color;
							let name  = item.name;
							let value = item.value;
							let x     = this._xScale(i);
							let y     = this._yScale(item.value >= 0 ? item.value : 0);
							let w     = width;
							let h     = Math.abs(this._yScale(item.value) - this._yScale(0));
							let curve = {id: id, color: color, info: "", name: this._values(id+1)+") "+name};
							curve.info = [
								" "+this.xLabel,
								"  {i ∈ ℕ | 1 ≤ i ≤ n}",
								"  n = "+this._values(count),
								"  i = "+this._values(i+1),
								" "+this.yLabel,
								"  {y ∈ ℝ | "+this._values(min)+" ≤ y ≤ "+this._values(max)+"}",
								"  y     = "+this._values(value),
								"  ∑yᵢ   = "+this._values(total),
								"  ∑yᵢ/n = "+this._values(total/count)
							].join("\n");
							/*-- colunas --*/
							svg.rect(x, y, w, h)
							.attribute({fill: color, "fill-opacity": 0.8})
							.attribute({stroke: color, "stroke-width": 2})
							.attribute({"data-wd-chart-curve": id})
							.title(curve.info);
							/*-- Escalas valores (horizontal) --*/
							svg.text(
								x + width/2,
								value >= 0 ? (y-5) : (y+h+5),
								this._values(value, "y"),
								value >= 0 ? "hs" : "hn"
							)
							.attribute({fill: color, cursor: "default", "data-wd-chart-curve": id})
							.title(this._values(value));
							/*-- Escalas id (horizontal) --*/
							svg.text(
								x + width/2,
								value >= 0 ? (y+h+5) : (y-5),
								this._values(id+1),
								value >= 0 ? "hn" : "hs"
							)
							.attribute({fill: color, cursor: "default", "font-weight": "bold", "data-wd-chart-curve": id})
							.title(this._values(id+1)+") "+name);
							legend.push(curve);
						}
						this._struct(svg, "hlines ylabel xlabel yscale hzero title");
					}
				}
				this._legend(svg, legend);
				return svg.svg();
			}
		},
		/**. '{string xLabel}: Define ou retorna o valor do rótulo do eixo x.**/
		xLabel: {
			get: function()  {return this._xLabel;},
			set: function(x) {this._xLabel = x === null || x === undefined ? "X Label" : String(x);}
		},
		/**. '{string yLabel}: Define ou retorna o valor do rótulo do eixo y.**/
		yLabel: {
			get: function()  {return this._yLabel;},
			set: function(x) {this._yLabel = x === null || x === undefined ? "Y Label" : String(x);}
		},
		/**. '{string title}: Define ou retorna o valor do título do gráfico.**/
		title: {
			get: function()  {return this._title;},
			set: function(x) {this._title = x === null || x === undefined ? "Title" : String(x);}
		},
		/**. '{string xAxis}: Define ou retorna o tipo de escala do eixo '{x}: number, date, time, datetime ou percent.**/
		xAxis: {
			get: function()  {return this._xAxis;},
			set: function(x) {
				let values  = ["date", "time", "datetime", "percent"];
				this._xAxis = values.indexOf(x) >= 0 ? x : "number";
			}
		},
		/**. '{string yAxis}: Define ou retorna o tipo de escala do eixo '{y}: number, date, time, datetime ou percent.**/
		yAxis: {
			get: function()  {return this._yAxis;},
			set: function(x) {
				let values  = ["date", "time", "datetime", "percent"];
				this._yAxis = values.indexOf(x) >= 0 ? x : "number";
			}
		},
		/**. '{boolean add(array x, any y, string label, string option)}: Adiciona dados para plotagem e retorna falso se não for possível processar a solicitação. Os argumentos '{x} e '{y} representam a abscissa (eixo horizontal) e a ordenada (eixo vertical), respectivamente. Seus valores dependem do tipo de gráfico.
		|Propriedade|Plotagem|Tipo|Descrição|
		|x|Plano cartesiano|array|Lista de valores finitos ou data/tempo|
		|y|Plano cartesiano|array|Lista de valores finitos ou data/tempo|
		|y|Plano cartesiano|função|Função i{f(x)} que retorna um valor finito|
		|y|Plano cartesiano|número|Uma constante finita|
		|x|Circular/Colunas|array|Lista de identificadores|
		|y|Circular/Colunas|array|Lista de valores finitos ou data/tempo relacionados a cada identificador (item) de i{x}|
		|x|Circular/Colunas|objeto|Um objeto cujas propriedades e seus valores correspondem as listas de i{x} e i{y}|
		|y|Circular/Colunas|indefinido|Se i{x} for um objeto|
		|label|Plano cartesiano|string|utilizado para identificar o gráfico|
		. No caso de gráfico circular, se existir valores positivos e negativos para os identificadores, um gráfico de barras será exibido no lugar.
		. Quando utilizar valores de data/tempo, a referência obtida será a quantidade de segundos desde 0000-01-01.
		. O argumento '{option} é opcional e direcionado para o gráfico de plano cartesiano com valores de '{x} e '{y} como array. Seus valores podem ser (todos retornam valores aproximados):
		|Valor|Descrição|
		|linear|Traça a regressão linear.|
		|geometric|Traça a regressão geométrica.|
		|logarithmic|Traça a regressão logarítmica.|
		|exponential|Traça a regressão exponencial.|
		|minimum|Traça a regressão com o menor valor de desvio padrão.|
		|avg|Traça o valor médio da curva.|
		|sum|Traça a área sob a curva.|
		|line|Traça uma linha ligando os pontos da curva.|
		|link|Traça uma linha ligando os pontos demarcados da curva.|
		|dots|Traça os pontos demarcados.|**/
		add: {
			value: function(x, y, label, option) {
				let xdata = __Type(x);
				let ydata = __Type(y);
				label = label === null || label === undefined ? "Label ?" : String(label).trim();

				/*----------------------------------------------------------------------
					gráfico proporcional
				----------------------------------------------------------------------*/
				if (this._chart === "pie" || this._chart === "cols") {
					if (this._data.length === 0) this._data.push({});
					let data = this._data[0];

					/*-- objeto --------------------------------------------------------*/
					if (xdata.object) {
						for (let name in x) {
							let check = __Type(x[name]);
							let value = null;
							if (check.finite || check.date || check.time || check.datetime)
								value = check.finite ? check.value : new __DateTime(x[name]).valueOf();
							if (value !== null)
								data[name] = value + (name in data ? data[name] : 0);
						}
						return true;
					}
					/*-- array ---------------------------------------------------------*/
					else if (xdata.array && ydata.array) {
						let i   = -1;
						let obj = {};
						while (++i < x.length) {
							if (i >= y.length) break;
							obj[String(x[i])] = y[i];
						}
						return this.add(obj);
					}
					return false;
				}
				/*----------------------------------------------------------------------
					gráfico cartesiano
				----------------------------------------------------------------------*/
				else {
					/* checando dados e definindo tipos de curvas */
					if (!xdata.array) return false;
					option    = String(option).trim();
					let types = {
						function: {sum: "sum", avg: "avg", line: "line", main: "line"},
						finite:   {sum: "sum", main: "line"},
						array:    {sum: "sum", avg: "avg", line: "line", link: "link", dots: "dots", main: "link"},
						fit:      {
							linear:    "linearFit",    exponential: "exponentialFit",
							geometric: "geometricFit", logarithmic: "logarithmicFit",
							minimum:   "minDeviation"
						}
					};
					/* definindo limites superiores e inferiores no caso de área */
					if (option === "sum") {
						this._yMin = 0;
						this._yMax = 0;
					}
					/* Y é função ------------------------------------------------------- */
					if (ydata.function) {
						let curve = types.function;
						let data  = __Data2D(x, x);
						if (data.error) return false;
						let xmin   = Math.min.apply(null, data.x);
						let xmax   = Math.max.apply(null, data.x);
						this._xMin = xmin;
						this._xMax = xmax;
						this._data.push({
							x:    [xmin, xmax],
							y:    y,
							name: label,
							info: y.name.trim() === "" ? " y = "+label : " f(x) = "+y.name+"(x)",
							f:    true,
							type: option in curve ? curve[option] : curve.main,
							id:   ++this._id
						});console.log(y.name)
						return true;
					}
					/* Y é constante ---------------------------------------------------- */
					else if (ydata.finite) {
						let curve = types.finite;
						let data  = __Data2D(x, y);
						if (data.error) return false;
						let cte    = ydata.value;
						let xmin   = Math.min.apply(null, data.x);
						let xmax   = Math.max.apply(null, data.x);
						this._xMin = xmin;
						this._xMax = xmax;
						if (this._yMin >= cte)
							this._yMin = cte === 0 ? -1 : cte - Math.abs(cte/2);
						if (this._yMax <= cte)
							this._yMax = cte === 0 ? +1 : cte + Math.abs(cte/2);
						this._data.push({
							x:    [xmin, xmax],
							y:    [cte, cte],
							name: label,
							info: " f(x) = "+this._values(cte),
							f:    false,
							type: option in curve ? curve[option] : curve.main,
							id:   ++this._id
						});
						return true;
					}
					/* Y é array -------------------------------------------------------- */
					else if (ydata.array) {
						let curve = types.array;
						let data  = __Data2D(x, y);
						if (data.error) return false;
						let xlimit = {
							min: Math.min.apply(null, data.x),
							max: Math.max.apply(null, data.x)
						};
						let ylimit = {
							min: Math.min.apply(null, data.y),
							max: Math.max.apply(null, data.y)
						};
						this._xMin = xlimit.min;
						this._xMax = xlimit.max;
						this._yMin = ylimit.min;
						this._yMax = ylimit.max;
						this._data.push({
							x:    data.x,
							y:    data.y,
							name: label,
							info: "",
							f:    false,
							type: option in curve ? curve[option] : curve.main,
							id:   ++this._id
						});
						/* regressões ----------------------------------------------------- */
						if (option in types.fit) {
							let fit = data[types.fit[option]];
							if (fit === null) return false;
							let target = this._data.length - 1;
							this._data[target].info = [
								" "+fit.m,
								" a = "+this._values(fit.a),
								" b = "+this._values(fit.b),
								" σ = "+this._values(fit.d)
							].join("\n");
							this._data[target].type = "dots";

							/* função principal */
							this._data.push({
									x:    [xlimit.min, xlimit.max],
									y:    fit.f,
									name: null,
									info: "",
									f:    true,
									type: "line",
									id:   this._id
							});
							/* desvio padrão */
							if (fit.d === 0) return true;
							this._data.push({
									x:     [xlimit.min, xlimit.max],
									y:     function(x) {return fit.f(x)+fit.d;},
									name:  null,
									info:  "",
									f:     true,
									type:  "dash",
									id:   this._id
							});
							this._data.push({
									x:    [xlimit.min, xlimit.max],
									y:    function(x) {return fit.f(x)-fit.d;},
									name: null,
									info: "",
									f:    true,
									type: "dash",
									id:   this._id
							});
						}
						return true;
					}
				}
				return false;
			}
		},
	});








//FIXME copy como fazer?
/*----------------------------------------------------------------------------*/
	function wd_copy(value) { /* copia o conteúdo da variável para a área de transferência */
		/* copiar o que está selecionado */
		if (value === undefined && "execCommand" in document) {
			document.execCommand("copy");
			return true;
		}
		/* copiar DOM: elemento ou tudo */
		let data = wd_vtype(value);
		if (data.type === "dom" && "execCommand" in document) {
			let element = data.value.length > 0 ? data.value[0] : document.body;
			let range   = document.createRange();
			let select  = window.getSelection();
			select.removeAllRanges();          /* limpar seleção existente */
			range.selectNodeContents(element); /* pegar os nós do elemento */
			select.addRange(range);            /* seleciona os nós do elemento */
			document.execCommand("copy");      /* copia o texto selecionado */
			select.removeAllRanges();          /* limpar seleção novamente */
			return true;
		}

		/* array e object: JSON */
		if (data.type === "array" || data.type === "object")
			value = wd_json(value);

		/* copiar valor informado */
		if ("clipboard" in navigator && "writeText" in navigator.clipboard) {
			navigator.clipboard.writeText(value === null ? "" : value).then(
				function () {/*sucesso*/},
				function () {/*erro*/}
			);
			return true;
		}

		return false;
	}










/* == BLOCO 2 ================================================================*/

/*----------------------------------------------------------------------------*/
	/**#3 Interface do Usuário
	Trata-se de construtores e funções para interface com o usuário na manipulação de dados.

	#4 WDmain
	''constructor object WDmain(any  input, object data)''
	Construtor genérico para manipulação de dados cujos construtores específicos herdarão seu comportamento.
	O argumento '{input} se refere ao dado informado pelo usuário e o argumento '{data} corresponde à instância de '{__Type}, cuja alimentação será realizada pela função '{WD}.**/
	function WDmain(input, data) {
		Object.defineProperties(this, {
			_input: {value: input},
			_data:  {value: data},
		});
	}

	Object.defineProperties(WDmain.prototype, {
		constructor: {value: WDmain},
		/**. '{any valueOf()}: Retorna o valor do dado (ver '{__Type}).**/
		valueOf: {value: function() {return this._data.valueOf();}},
		/**. '{string toString()}: Retorna o valor textual do dado (ver '{__Type}).**/
		toString: {value: function() {return this._data.toString();}},
		/**. '{string type}: Retorna o tipo do dado.**/
		type: {get: function() {return this._data.type;}},
		/**. '{boolean or(string type...)}: Retorna verdadeiro algum tipo informado em '{type} corresponder ao dado.**/
		or: {
			value: function(type) {
				for (let i = 0; i < arguments.length; i++)
					if (this._data[arguments[i]] === true) return true;
				return false;
			}
		},
		/**. '{boolean is(string type...)}: Retorna verdadeiro todos os tipos informados em '{type} corresponder ao dado.**/
		is: {
			value: function(type) {
				if (arguments.length < 2) return this.or(type);
				for (let i = 0; i < arguments.length; i++)
					if (this._data[arguments[i]] !== true) return false;
				return true;
			}
		},
		/**. '{string mask(string model)}: Retorna o valor formatado pela máscara definida no argumento '{model}. Se a máscara não casar, retornará uma string vazia.**/
		mask: {value: function(model) {return new __String(this._input).mask(model);}},
		/**. '{boolean instanceOf(string name)}: Checa se o conteúdo é instância do objeto informado em '{name}.**/
		instanceOf: {value: function(name) {return this._data.instanceOf(name);}},


		//FIXME colocar isso de forma genérica? to(type)
		/**. '{array csv}: Retorna string em CSV para array.**/
		//csv: {get: function() {return this._main.csv;}},
		/**. '{any json}: Retorna notação em JSON para valor em Javascript ou nulo se inválido.**/
		//json: {get: function() {return this._main.json;}},
		/**. '{node html}: Retorna notação em HTML para documento correspondente ou nulo se inválido.**/
		//html: {get: function() {return this._main.html;}},
		/**. '{node xml}: Retorna notação em XML para documento correspondente ou nulo se inválido.**/
		//xml: {get: function() {return this._main.xml;}},
		/**. '{string csv}: Retorna o array, se organizado em forma de matriz, no formato CSV.**/
		/*mcsv: {
			get: function() {
				let table = __Table();
				table.matrix(this.valueOf());
				return table.csv();
			;}
		},*/



	});

/*----------------------------------------------------------------------------*/
	/**#4 WDstring
	''constructor object WDstring(any  input, object data)''
	Construtor genérico para manipulação de strings. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDstring(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __String(data.value)},
		});
	}

	WDstring.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDstring},
		/**. '{integer length}: Retorna a quantidade de caracteres.**/
		length: {get: function() {return this._main.length;}},
		/**. '{string upper}: Retorna caixa alta.**/
		upper: {get: function() {return this._main.upper;}},
		/**. '{string lower}: Retorna caixa baixa.**/
		lower: {get: function() {return this._main.lower;}},
		/**. '{string capitalize}: Retorna a primeira letra de cada palavra em caixa alta.**/
		capitalize: {get: function() {return this._main.capitalize;}},
		/**. '{string toggle}: Inverte a caixa.**/
		toggle: {get: function() {return this._main.toggle;}},
		/**. '{string camel}: Transforma a string em camelCase.**/
		camel: {get: function() {return this._main.camel;}},
		/**. '{string dash}: Divide a string em traços.**/
		dash: {get: function() {return this._main.dash;}},
		/**. '{string clear}: Remove acentos.**/
		clear: {get: function() {return this._main.clear(false, true);}},
		/**. '{string trim}: Remove espaços excedentes.**/
		trim: {get: function() {return this._main.clear(true, false);}},
		/**. '{string clean}: Remove acentos e espaços excedentes.**/
		clean: {get: function() {return this._main.clear();}},
	});

/*----------------------------------------------------------------------------*/
	/**#4 WDnumber
	''constructor object WDnumber(any  input, object data)''
	Construtor genérico para manipulação de números. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDnumber(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __Number(data.value)},
		});
	}

	WDnumber.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnumber},
		/**. '{integer int}: Retorna a parte inteira.**/
		int: {get: function() {return this._main.int;}},
		/**. '{number dec}: Retorna a parte decimal.**/
		dec: {get: function() {return this._main.dec;}},
		/**. '{number abs}: Retorna o valor absoluto.**/
		abs: {get: function() {return this._main.abs;}},
		/**. '{boolean prime}: Informa se o número é primo por meio de um Promise.**/
		prime: {get: async function() {return this._main.prime;}},
		/**. '{array primes}: Retorna uma lista de primos precedentes por meio de um Promise.**/
		primes: {get: async function() {return this._main.primes;}},
		/**. '{number factorization}: Retorna a fatorização do número por meio de um Promise.**/
		factorization: {get: async function() {return this._main.factorization;}},
		/**. '{number fixed(integer length, boolean round)}: Abrevia o número para as casas decimais (ver __Number).**/
		fixed: {value: function(lenght, round) {return this._main.fixed(lenght, round);}},
		/**. '{string fraction}: Retorna o número em forma de fração.**/
		fraction: {get: function() {return this._main.frac;}},
		/**. '{string bytes}: Retorna o número em quantidade de bytes.**/
		bytes: {get: function() {return this._main.bytes;}},
		/**. '{string toString()}: Funciona como o método nativo.**/
		toString: {value: function(type) {return this._main.value.toString(type);}},
		/**. '{string toLocaleString(object options)}: Ver __Number.**/
		toLocaleString: {value: function(options) {return this._main.toLocaleString(options);}},
	});

/*----------------------------------------------------------------------------*/
	/**#4 WDtime**/
	/**''constructor object WDtime(any  input, object data)''
	Construtor para manipulação de tempo. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDtime(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __DateTime(data.value)},
		});
	}

	WDtime.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDtime},
		/**. '{number hour}: Retorna ou define a hora.**/
		hour: {
			get: function()  {return this._main.hour;},
			set: function(x) {return this._main.hour = x;}
		},
		/**. '{number minute}: Retorna ou define o minuto.**/
		minute: {
			get: function()  {return this._main.minute;},
			set: function(x) {return this._main.minute = x;}
		},
		/**. '{number second}: Retorna ou define o segundo.**/
		second: {
			get: function()  {return this._main.second;},
			set: function(x) {return this._main.second = x;}
		},
		/**. '{integer h12}: Retorna a hora no ciclo de 12h.**/
		h12: {get: function() {return this._main.main.h12;}},
		/**. '{string h12}: Retorna AM ou PM.**/
		meridiem: {get: function() {return this._main.main.meridiem;}},
		/**. '{integer valueOf()}: Retorna os segundos desde 00:00:00.000.**/
		valueOf: {value: function() {return this._main.valueOfTime();}},
		/**. '{string toString()}: Retorna o tempo no formado hh:mm:ss.sss.**/
		toString: {value: function() {return this._main.toTimeString();}},
		/**. '{string toLocaleString()}: Retorna o tempo no formato local.**/
		toLocaleString: {value: function() {return this._main.toLocaleTimeString();}},
		/**. '{string format(string input)}: Retorna notação de hora pre-formatada em '{input}.**/
		format: {value: function(input) {return this._main.format(input, "time");}},
	});

/*----------------------------------------------------------------------------*/
	/**#4 WDdate**/
	/**''constructor object WDdate(any  input, object data)''
	Construtor para manipulação de data. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDdate(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __DateTime(data.value)},
		});
	}

	WDdate.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDdate},
		/**. '{number year}: Retorna ou define o ano.**/
		year: {
			get: function()  {return this._main.year;},
			set: function(x) {return this._main.year = x;}
		},
		/**. '{number month}: Retorna ou define o mês.**/
		month: {
			get: function()  {return this._main.month;},
			set: function(x) {return this._main.month = x;}
		},
		/**. '{number day}: Retorna ou define o dia.**/
		day: {
			get: function()  {return this._main.day;},
			set: function(x) {return this._main.day = x;}
		},
		/**. '{integer week}: Retorna o número da semana.**/
		week: {get: function()  {return this._main.main.week;}},
		/**. '{integer weekDay}: Retorna o número do dia da semana.**/
		weekDay: {get: function()  {return this._main.main.weekDay;}},
		/**. '{boolean leap}: Informa se o ano é bissexto.**/
		leap: {get: function()  {return this._main.main.leap;}},
		/**. '{integer width}: Retorna a quantidade de dias do mês.**/
		width: {get: function()  {return this._main.main.width;}},
		/**. '{integer days}: Retorna o número do dia do ano.**/
		days: {get: function()  {return this._main.main.days;}},
		/**. '{integer work}: Retorna o número de dias úteis até o momento.**/
		work: {get: function()  {return this._main.main.work;}},
		/**. '{integer valueOf()}: Retorna o número de dias desde 0000-01-01.**/
		valueOf: {value: function() {return this._main.valueOfDate();}},
		/**. '{string toString()}: Retorna a data no formato YYYY-MM-DD.**/
		toString: {value: function() {return this._main.toDateString();}},
		/**. '{string toWeekString()}: Retorna a semana no formato YYYY-Www.**/
		toWeekString: {value: function() {return this._main.toWeekString();}},
		/**. '{string toLocaleString()}: Retorna a data no formato local.**/
		toLocaleString: {value: function() {return this._main.toLocaleDateString();}},
		/**. '{string format(string input)}: Retorna notação de data pre-formatada em '{input}.**/
		format: {value: function(input) {return this._main.format(input, "date");}},
	});

/*----------------------------------------------------------------------------*/
	/**#4 WDdatetime**/
	/**''constructor object WDdatetime(any  input, object data)''
	Construtor para manipulação de data/tempo. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDdatetime(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __DateTime(data.value)},
		});
	}

	WDdatetime.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDdatetime},
		/**. '{integer valueOf()}: Retorna o número de segundos desde 0000-01-01T00:00:00.000.**/
		valueOf:     {value: function() {return this._main.valueOf();}},
		/**. '{integer valueOfDate()}: Retorna o número de dias desde 0000-01-01.**/
		valueOfDate: {value: function() {return this._main.valueOfDate();}},
		/**. '{number valueOfTime()}: Retorna os segundos desde 00:00:00.000.**/
		valueOfTime: {value: function() {return this._main.valueOfTime();}},
		/**. '{number valueOfDays()}: Retorna os dias desde 0000-01-01 com o tempo como elemento decimal.**/
		valueOfDays: {value: function() {return this._main.valueOfDays();}},
		/**. '{string toDateString()}: Retorna a data no formato YYYY-MM-DD.**/
		toDateString: {value: function() {return this._main.toDateString();}},
		/**. '{string toTimeString()}: Retorna o tempo no formato hh:mm:ss.sss.**/
		toTimeString: {value: function() {return this._main.toTimeString();}},
		/**. '{string toWeekString()}: Retorna a semana no formato YYYY-Www.**/
		toString: {value: function() {return this._main.toString();}},
		/**. '{string toLocaleDateString()}: Retorna a data no formato local.**/
		toLocaleDateString: {value: function() {return this._main.toLocaleDateString();}},
		/**. '{string toLocaleTimeString()}: Retorna o tempo no formato local.**/
		toLocaleTimeString: {value: function() {return this._main.toLocaleTimeString();}},
		/**. '{string toLocaleString()}: Retorna o valor data/tempo no formato local.**/
		toLocaleString: {value: function() {return this._main.toLocaleString();}},
		/**. '{string format(string input)}: Retorna notação data/tempo pre-formatada em '{input}.**/
		format: {value: function(input) {return this._main.format(input);}},
	});

	/*-- copiando propriedades de WDtime e WDdate para WDdatetime --------------*/
	const TIME_PROPERTIES = Object.getOwnPropertyNames(WDtime.prototype);
	for (let i of TIME_PROPERTIES) {
		if (!(i in WDdatetime.prototype)) {
			let descriptor = Object.getOwnPropertyDescriptor(WDtime.prototype, i);
			Object.defineProperty(WDdatetime.prototype, i, descriptor);
		}
	}
	const DATE_PROPERTIES = Object.getOwnPropertyNames(WDdate.prototype);
	for (let i of DATE_PROPERTIES) {
		if (!(i in WDdatetime.prototype)) {
			let descriptor = Object.getOwnPropertyDescriptor(WDdate.prototype, i);
			Object.defineProperty(WDdatetime.prototype, i, descriptor);
		}
	}

/*----------------------------------------------------------------------------*/
	/**#4 WDarray
	''constructor object WDarray(any  input, object data)''
	Construtor genérico para manipulação de tempo. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDarray(input, data) {
		WDmain.call(this, input, data);
		Object.defineProperties(this, {
			_main: {value: new __Array(data.value)},
		});
	}

	WDarray.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDarray},
		[Symbol.iterator]: {value: function*() {for (let i of this._main) yield i;}},
		/**. '{integer length}: Retorna a quantidade de itens no array.**/
		length: {get: function() {return this._main.length;}},
		/**. '{array unique}: Retorna a lista sem valores repetidos.**/
		unique: {get: function() {return this._main.unique;}},
		/**. '{array asc}: Retorna a lista ordenada de forma ascentende.**/
		asc: {get: function() {return this._main.sort(true);}},
		/**. '{array desc}: Retorna a lista ordenada de forma descendente.**/
		desc: {get: function() {return this._main.sort(false);}},
		/**. '{array sort}: Retorna a lista com ordem inversa ou forma ascendente, se desordenada.**/
		sort: {get: function() {return this._main.sort();}},
		/**. '{array order}: Retorna a lista ordenada de forma ascendente sem repetições.**/
		order: {get: function() {return this._main.order;}},
		/**. '{array add(any ...)}: Adicina itens ao fim da lista e a retorna.**/
		add: {value: function() {return this._main.add.apply(this._main, arguments);}},
		/**. '{array jump(any ...)}: Adicina itens ao início da lista e a retorna.**/
		jump: {value: function() {return this._main.jump.apply(this._main, arguments);}},
		/**. '{array put(any ...)}: Adicina itens, se inexistentes, ao fim da lista e a retorna.**/
		put: {value: function() {return this._main.put.apply(this._main, arguments);}},
		/**. '{array concat(any ...)}: Concatena itens ou arrays ao fim da lista e a retorna.**/
		concat: {value: function() {return this._main.concat.apply(this._main, arguments);}},
		/**. '{array remove(any ...)}: Remove da lista todas as ocorrências dos itens especificados e a retorna.**/
		remove: {value: function() {return this._main.remove.apply(this._main, arguments);}},
		/**. '{array toggle(any ...)}: Alterna a existência dos itens especificados na lista e a retorna.**/
		toggle: {value: function() {return this._main.toggle.apply(this._main, arguments);}},
		/**. '{array replace(any from, any to)}: Altera todas as ocorrências ('{from}) pelo novo valor ('{to}) e retorna a lista modificada.**/
		replace: {value: function(from, to) {return this._main.replace(from, to);}},
		/**. '{array search(any value)}: Retorna uma lista com os índices em que o argumento '{value} aparece.**/
		search: {value: function(value) {return this._main.search(value);}},
		/**. '{boolean check(any ...)}: Retorna verdadeiro se todos os argumentos informados forem localizados.**/
		check: {value: function() {return this._main.check.apply(this._main, arguments);}},
		/**. '{array hide(any ...)}: Retorna a lista ignorando os valores informados como argumento.**/
		hide: {value: function() {return this._main.hide.apply(this._main, arguments);}},
		/**. '{any item(integer index)}: Retorna o item especificado no argumento '{index} considerando uma lista circular.**/
		item: {value: function(index) {return this._main.valueOf(__Type(index).number ? index : 0);}},
		/**. '{string toString()}: Retorna a lista em forma de JSON.**/
		toString: {value: function() {return JSON.stringify(this._data.value);}},
		/**. '{array|number valueOf(string value)}: Retorna uma cópia da lista ou os seguintes valores de acordo com o valor do argumento opcional '{value} que, caso não exista o valor possível, retornará nulo:
		|Value|Tipo|Descrição|
		|min|number|Retorna o menor número finito da lista.|
		|max|number|Retorna o maior número finito da lista.|
		|sum|number|Retorna a soma dos números finitos da lista.|
		|avg|number|Retorna a média dos números finitos da lista.|
		|med|number|Retorna a mediana dos números finitos da lista.|
		|harm|number|Retorna a média harmônica dos números finitos da lista.|
		|geo|number|Retorna a média geométrica dos números finitos da lista.|
		|gcd|number|Retorna máximo divisor comum dos números finitos da lista.|
		|mode|array|Retorna uma lista com os items mais recorrentes.|**/
		valueOf: {
			value: function(value) {
				value = String(value).toLowerCase().trim();
				const self  = this;
				switch(value) {
					case "min":  return self._main.min;
					case "max":  return self._main.max;
					case "sum":  return self._main.sum;
					case "avg":  return self._main.avg;
					case "med":  return self._main.med;
					case "harm": return self._main.harm;
					case "geo":  return self._main.geo;
					case "gcd":  return self._main.gcd;
					case "mode": return self._main.mode;
				}
				return this._main.valueOf().slice();
			}
		},
		//FIXME coloco onde isso aqui?
		/**. '{array cell(string area)}: Retorna uma lista contendo os valores definidos no argumento '{area} de um array organizado no formato de matriz (ver __Table).**/
		cell: {
			value: function(area) {
				let table = __Table();
				table.matrix(this.valueOf());
				return table.cell(area, true);
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 WDobject
	''constructor object WDobject(any  input, object data)''
	Construtor genérico para manipulação de tempo. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDobject(input, data) {
		WDmain.call(this, input, data);
		const request = new __Request(this._input);
		Object.defineProperties(this, {
			_main:    {value: new __DataSet(data.value)},
			_request: {value: request}
		});
	}

	WDobject.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDobject},
		/**. '{self send(function' trigger)}: Efetua requisição XMLHttpRequest e dispara '{trigger}(ver __Request).**/
		send: {value: function(trigger) {this._request.send(trigger); return this;}},
		/**. '{self fetch(function' trigger)}: Efetua requisição fetch e dispara '{trigger}(ver __Request).**/
		fetch: {value: function(trigger) {this._request.fetch(trigger); return this;}},
		/**. '{self read(function' trigger)}: Efetua leitura de arquivos e dispara '{trigger}(ver __Request).**/
		read: {	value: function(trigger) {this._request.read(trigger); return this;}},
		/**. '{string toString()}: Retorna o objeto em forma de JSON, se possível.**/
		toString: {value: function() {return JSON.stringify(this._data.value);}},
	});

/*----------------------------------------------------------------------------*/
	/**#4 WDnode
	''constructor object WDnode(any  input, object data)''
	Construtor genérico para manipulação de nós HTML. Os argumentos '{input} e '{data} se referem aos argumento de '{WDmain}**/
	function WDnode(input, data) {
		WDmain.call(this, input, data);
		const main = this._data.value.slice();
		main.forEach(function(v,i,a) {a[i] = new __Node(v);});
		Object.defineProperties(this, {
			_main:  {value: main},
			_array: {value: new __Array(main)}
		});
	}

	WDnode.prototype = Object.create(WDmain.prototype, {
		constructor: {value: WDnode},
		/**. '{integer length}: Retorna a quantidade de nós HTML.**/
		length: {get: function() {return this._data.value.length;}},
		/**. '{array valueOf()}: Retorna uma cópia da lista contendo os nós HTML.**/
		valueOf: {value: function() {return this._data.value.slice();}},
		/**. '{self forEach(function' callback)}: Executa looping nos nós HTML. A função definida em '{callback} receberá como argumentos um nó, o seu índice e uma b{cópia} da lista de nós. Se a função retornar falso, o looping é interrompido.**/
		forEach: {
			value: function(run) {
				if (__Type(run).function) {
					const nodes = this.valueOf();
					for (let i = 0; i < nodes.length; i++)
						if (run(nodes[i], i, nodes) === false) break;
				}
				return this;
			}
		},
		//FIXME files para que serve isso mesmo?
		/**. '{array files}: Retorna uma lista com os arquivos selecionados nos campos de formulário.**/
		files: {
			get: function() {
				const pack = [];
				for (let i = 0; i < this._main.length; i++) {
					let obj = this._main[i];
					if (obj.ftype === "file")
						for (let j = 0; j < obj.node.files.length; j++)
							pack.push(obj.node.files[j]);
				}
				return pack;
			}
		},
		/**. '{object submit(string method, boolean ignore)}: Retornará o mesmo resultado que o método __DataSet.toSubmit, exceto se o processo for interrompido por alguma restrição no campo de formulário, retornando nulo. Para não verificar restrições, o argumento '{ignore} deverá ser verdadeiro.**/
		submit: {
			value: function(url, method, ignore) {
				ignore = ignore === true;
				const data = new __DataSet();

				for (let i = 0; i < this._main.length; i++) {
					let node   = this._main[i];
					let submit = node.fsubmit;
					if (submit !== null) {
						data.append(submit.name, submit.value);
						if (!ignore && submit.error) {
							node.falert(submit.message);
							node.node.focus();
							return null;
						}
					}
				}
				return data.toSubmit(url, method);
			}
		},
		/**. '{self repeat(array list)}: Repete elementos a partir de um modelo. '{list} é uma lista de objetos cujo valor do atributo substituirá o respectivo valor entre do modelo que será informado em chaves duplas ({{atributo}}).**/
		repeat: {
			value: function(list) {
				for (let i = 0; i < this._main.length; i++)
					this._main[i].repeat(list);
				return this;
			}
		},
		/**. '{self set(object data)}: Atribui aos elementos o valor dos atributos especificados em '{data} (ver __Node.atrribute).**/
		set: {
			value: function(data) {
				if (__Type(data).object)
					for (let i = 0; i < this._main.length; i++)
						for (let attr in data)
							this._main[i].attribute(attr, data[attr]);
				return this;
			}
		},
		/**. '{self display(string act)}: Exibe os elementos conforme especificado:
		|Ação|Descrição|
		|show|Exibe o elemento|
		|hide|Esconde o elemento|
		|toggle|Alterna a exibição do elemento|
		|full|Alterna a exibição do elemento em tela cheia|
		|alone|Exibe o elemento e esconde os nós irmãos|
		|missing|Esconde o elemento e exibe os nós irmãos|
		|all|Exibe o elemento e os nós irmãos|
		|none|Esconde o elemento e os nós irmãos|
		|asc|Ordena os nós filhos em ordem ascendente|
		|desc|Ordena os nós filhos em ordem descendente|
		|sort|Alterna a ordenação dos nós filhos|**/
		display: {
			value: function(act) {
				act = String(act).toLowerCase();
				for (let i = 0; i < this._main.length; i++) {
					if (act === "show" || act === "hide" || act === "toggle")
						this._main[i].show = act === "toggle" ? !this._main[i].show : act === "show";
					else if (act === "alone" || act === "missing")
						this._main[i].only(act === "missing");
					else if (act === "all" || act === "none")
						this.display(act === "all" ? "missing" : "alone").display(act === "all" ? "show" : "hide");
					else if (act === "sort" || act === "asc" || act === "desc")
						this._main[i].sort(act === "sort" ? null : act === "asc");
					else if (act === "full") {
						this._main[i].show = true;
						this._main[i].full();
					}
				}
				return this;
			}
		},
		/**. '{self slice(integer init, integer last)}: Fatia os elementos filhos Exibe os elementos, exceto se '{visible} for falso.**/
		slice: {
			value: function(init, last) {
				for (let i = 0; i < this._main.length; i++)
					this._main[i].slice(init, last);
				return this;
			}
		},







		/**. '{self display(string action)}: Organiza a exibição dos elementos filhos conforme argumento '{action}. Quanto ao elemento:
		|Ação|Descrição|
		. Quanto à organização dos filhos:
		|Valor|Descrição|
		|+N|exibe o filho avançando N posições do elemento atual (ciclo infinito)|
		|-N|exibe o filho retrocedendo N posições do elemento atual (ciclo infinito)|
		|N-M|intervalo de filhos a exibir, índices inicial e final|
		|N:D|organiza os filhos por grupos de D elementos, onde N representa o índice do grupo|
		|+N:D|avança N grupos de filhos organizados em grupos de D elementos|
		|-N:D|retrocede N grupos de filhos organizados em grupos de D elementos|
		. Quanto aos netos:
		|Valor|Descrição|
		|[+N&verbar;-M&verbar;...]|ordena os filhos com base no valor dos netos na ordem especificada e conforme sinais (positivos ascendentes, negativos descendentes).|
		. Onde N e M são números inteiros e D pode ser inteiro ou decimal. Para representar o último índice, utilizar o caractere asterisco.**/
		display2: {
			value: function(action) {
				action = String(action).replace(/\s+/g, "").toLowerCase();
				for (let i = 0; i < this._main.length; i++) {
					let node = this._main[i];
					/*-- avanço/retrocesso de filhos --*/
					if ((/^[+-]?\d+$/).test(action)) {
						node.walk(action);
					}
					/*-- intervalo de filhos --*/
					else if ((/^(\+?\d+|\*)\-(\+?\d+|\*)$/).test(action)) {
						const val = action.split("-");
						node.slice(val[0] === "*" ? -1 : val[0], val[1] === "*" ? -1 : val[1]);
					}
					/*-- agrupamento de nós --*/
					else if ((/^([+-]?\d+|\*)\:(\d+|0?\.\d+)$/).test(action)) {
						const val   = action.split(":");
						const walk  = (/^[+-]\d+/).test(action);
						const index = Number(val[0] === "*" ? -1 : val[0]) * (walk ? Infinity : 1);
						const width = Number(val[1]);
						node.pages(index, width);
					}
					/*-- ordenamento de colunas --*/
					else if ((/^\[[+-]?\d+((\|[+-]?\d+)+)?\]$/).test(action)) {
						const val = action.replace(/^\[(.+)\]$/, "$1").split("|");
						for (let j = 0; j < val.length; j++)
							val[j]  = (val[j][0] === "-" ? -1 : +1) + Number(val[j]);
						node.tsort.apply(node, val);
					}

				}
				return this;
			}
		},




		/**. '{self filter(any search, integer width)}: Exibe somente os elementos filhos que contenham o conteúdo de '{search} (ver __Node.filter)**/
		filter: {
			value: function(search, width) {
				for (let i = 0; i < this._main.length; i++)
					this._main[i].filter(search, width);
				return this;
			}
		},
		/**. '{self jump(node spaces)}: Alterna a posição dos nós entre os elementos informados em '{spaces} (ver __Node.jump)**/
		jump: {
			value: function(spaces) {
				if (__Type(spaces).node)
					for (let i = 0; i < this._main.length; i++)
						this._main[i].jump(spaces);
				return this;
			}
		},
	});

/*----------------------------------------------------------------------------*/
	/**#4 WDmatrix
	''constructor object WDmatrix(any  input)''
	Cópia do construtor __Table**/
	function WDmatrix(input) {__Table.call(this, input);}
	WDmatrix.prototype = Object.create(__Table.prototype, {constructor: {value: WDmatrix}});

/*----------------------------------------------------------------------------*/
	/**#4 Função Mestre
	''	object WD(any input)''
	Função principal, única de acesso ao usuário, com o objetivo de chamar os construtores correspondentes ao valor informado no argumento '{input}.**/
	function WD(input) {
		let data = __Type(input);
		switch(data.type) {
			case "number":   return new WDnumber(input, data);
			case "array":    return new WDarray(input, data);
			case "date":     return new WDdate(input, data);
			case "time":     return new WDtime(input, data);
			case "datetime": return new WDdatetime(input, data);
			case "node":     return new WDnode(input, data);
			case "string":   return new WDstring(input, data);
			case "object":   return new WDobject(input, data);
		}
		return new WDmain(input, data);
	}
	/**#5 Métodos e Atributos Estáticos**/
	WD.constructor = WD;
	Object.defineProperties(WD, {
		/**. '{string version}: Retorna a versão da biblioteca.**/
		version: {value: __VERSION},
		/**. '{string device}: Retorna o tipo de tela de acordo com a biblioteca.**/
		device:  {get: function() {return __DEVICE.device;}},
		/**. '{object now}: Retorna a instância do objeto do tipo tempo com o valor atual.**/
		now: {get: function() {return WD(new __DateTime().toTimeString());}},
		/**. '{object today}: Retorna a instância do objeto do tipo data com o valor atual.**/
		today: {get: function() {return WD(new __DateTime().toDateString());}},
		/**. '{object already}: Retorna a instância do objeto do tipo data/tempo com o valor atual.**/
		already: {get: function() {return WD(__DateTime().toString());}},
		/**. '{string lang}: Define ou retorna a lista de linguagem em ordem de preferência da biblioteca.**/
		lang: {
			get: function()  {return __LANG.user;},
			set: function(x) {__LANG.user = x;}
		},
		/**. '{object $(string css, node root)}: Retorna um objeto do tipo nó conforme seletor i{css} individual. O argumento opcional i{root} é o elemento pai a ser consultado cujo valor padrão é i{document}.**/
		$: {value: function(css, root) {return WD(__Query(css, root).$);}},
		/**. '{object $$(string css, node root)}: Retorna um objeto do tipo nó conforme seletor i{css} múltiplo. O argumento opcional i{root} é o elemento pai a ser consultado cujo valor padrão é i{document}.**/
		$$: {value: function(css, root) {return WD(__Query(css, root).$$);}},
		/**. '{void signal(object options)}: Produz uma interação (ver i{__SIGNAL.signal}).**/
		signal:  {value: function(options) {return __SIGNAL.signal(options);}},
		/**. '{object matrix(any input)}: Retorna um objeto do tipo matriz conforme '{input} (table, array, csv)**/
		matrix:  {value: function(input) {return new WDmatrix(input);}},







		copy: {value: function(text)  {return wd_copy(text);}}, //FIXME como fica copy?






		/**. '{object datetime(any input)}: Retorna um objeto WD de data/tempo a partir dos valores:
		|input|Descrição|
		|Padrão|O valor atual de data/tempo|
		|Tempo|O tempo com data definida em 000-01-01|
		|Data|A data com tempo definido em 00:00:00|
		|Data/Tempo|Conforme definido|
		|Número|A quantidade de segundos desde 0000-01-01T00:00:00|
		|Semana|O primeiro dia da semana com tempo definido em 00:00:00|
		|Mês|Primeiro dia do mês com tempo definido em 00:00:00|
		|Objeto|As propriedades definidas alteram o valor atual da data/tempo|**/
		datetime: {value: function(input) {return WD(new __DateTime(input).toString());}},
	});

	if (__UNDERMAINTENANCE) {
		console["warn" in console ? "warn" : "log"]("WD JS Library: The maintenance module is on.");
		Object.defineProperties(WD, {
			type:     {value: function(){return __Type.apply(null, Array.prototype.slice.call(arguments));}},
			array:    {value: function(){return __Array.apply(null, Array.prototype.slice.call(arguments));}},
			date:     {value: function(){return __DateTime.apply(null, Array.prototype.slice.call(arguments));}},
			time:     {value: function(){return __Time.apply(null, Array.prototype.slice.call(arguments));}},
			node:     {value: function(){return __Node.apply(null, Array.prototype.slice.call(arguments));}},
			number:   {value: function(){return __Number.apply(null, Array.prototype.slice.call(arguments));}},
			string:   {value: function(){return __String.apply(null, Array.prototype.slice.call(arguments));}},
			code:     {value: function(){return __Code.apply(null, Array.prototype.slice.call(arguments));}},
			data2D:   {value: function(){return __Data2D.apply(null, Array.prototype.slice.call(arguments));}},
			plot:     {value: function(){return __Plot2D.apply(null, Array.prototype.slice.call(arguments));}},
			request:  {value: function(){return __Request.apply(null, Array.prototype.slice.call(arguments));}},
			response: {value: function(){return __Response.apply(null, Array.prototype.slice.call(arguments));}},
			query:    {value: function(){return __Query.apply(null, Array.prototype.slice.call(arguments));}},
			svg:      {value: function(){return __SVG.apply(null, Array.prototype.slice.call(arguments));}},
			table:    {value: function(){return __Table.apply(null, Array.prototype.slice.call(arguments));}},
			dataset:  {value: function(){return __DataSet.apply(null, Array.prototype.slice.call(arguments));}},
			parser:   {value: function(){return __Parser.apply(null, Array.prototype.slice.call(arguments));}},
			tree:     {value: function(){return __Tree.apply(null, Array.prototype.slice.call(arguments));}},
			pin:      {value: function(){return __Pin.apply(null, Array.prototype.slice.call(arguments));}},
			ID:       {value: __ID},
			SETHTML:  {value: __SET_HTML},
			GETHTML:  {value: __GET_HTML},
			HTML:     {value: __HTML},
			DOM:      {value: __DOM},
			FORM:     {value: __FORM},
			MENU:     {value: __MENU},
			TAB:      {value: __TAB},
			ICON:     {value: __ICON},
			MOVE:     {value: __MOVE},
			DRAG:     {value: __DRAG},
			FTYPES:   {value: __FTYPES},
			FIELDS:   {value: __FIELDS},
			LANG:     {value: __LANG},
			DEVICE:   {value: __DEVICE},
			PROGRESS: {value: __PROGRESS},
			RESPONSE: {value: __RESPONSETYPES},
			WINDOW:   {value: __WINDOW},
			SIGNAL:   {value: __SIGNAL},
			MIME:     {value: __MIME},
			CSS:      {value: __CSS},
			DATETIME: {value: __DATETIME},
			NUMBER:   {value: __NUMBER},
			OBJECT:   {value: __CHECK},
			ARIA:     {value: __ARIA},
			FOCUS:    {value: __FOCUS},
			HASH:     {value: __HASH},
		});
	}

/*============================================================================*/
/**#3 Atributos HTML dataset**/
/*============================================================================*/

	/**#4 Dispositivo: Design Responsivo
	''function void data_wd_device(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-size|
	|Objetivo|Manipular atributo '{class} conforme tamanho da tela (design responsivo via javascript)|
	|Eventos|load wdreload wddataset resize|
	|Alvos|Elemento|
	|Grupos|Único|
	|Referências|__DEVICE|
	span{ }
	|Propriedades|Tipo|Descrição|
	|desktop|string|Estilos CSS aplicados à tela desktop.|
	|tablet|string|Estilos aplicados à tela tablet.|
	|phone|string|Estilos aplicados à tela phone.|
	|mobile|string|Estilos aplicados à tela tablet ou phone.|
	Observações:
	- Não há propriedade obrigatória; e
	- O estilos CSS devem estar separados por espaços em branco.**/
	function data_wd_device(target, event, wdArray) {
		const query  = WD(target);
		const data   = wdArray[0];
		const device = __DEVICE.device;
		const types  = { /* 0: elimina css, 1: adiciona css */
			desktop: {phone: 0, tablet: 0, mobile: 0, desktop: 1},
			tablet:  {phone: 0, tablet: 1, mobile: 1, desktop: 0},
			phone:   {phone: 1, tablet: 0, mobile: 1, desktop: 0},
		};
		if (device in types) {
			let type = types[device];
			/* 1) removendo css dos dispositivos incompatíveis */
			for (let i in type)
				if (i in data && type[i] === 0) query.set({class: {remove: data[i]}});
			/* 2) adicionando css dos dispositivos compatíveis */
			for (let i in type)
				if (i in data && type[i] === 1) query.set({class: {add: data[i]}});
		}
		return;
	};


/*----------------------------------------------------------------------------*/
	/**#4 Requisições
	''function void data_wd_send(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-send|
	|Objetivo|Efetuar requisições web|
	|Eventos|click|
	|Alvos|Conforme especificado|
	|Grupos|Múltiplo|
	|Referências|__Request.send, __Node.submit|
	span{ }
	|Propriedades|Tipo|Descrição|
	|query|string|Seletor CSS dos campos de formulário a serem enviados|
	|noValidate|boolean|Se verdadeiro, a requisição não fará a validação primária dos campos.|
	|trigger|function|Nome do disparador a ser chamado durante a requisição.|
	Observações:
	- Demais propriedades seguem a definição de __Request.send, exceto i{body}, que será definido por '{query}; e
	- O disparador deve estar contido no escopo de '{window} utilizando-se de '{var} ou '{function}.**/
	function data_wd_send(target, event, wdArray) {
		let test, data, query, submit, trigger, head;
		for (let i = 0; i < wdArray.length; i++) {
			data    = wdArray[i];
			test    = new __Type(data.query);
			query   = test.node ? data.query : document.body;
			trigger = data.trigger;
			submit  = WD(query).submit(data.url, data.method, data.noValidate);
			/*-- cabeçalho --*/
			data.headers = new __DataSet(data.headers);
			/*-- Efetuar requisição se não encontrados erros --*/
			if (submit !== null) {
				data.url  = submit.url;
				data.body = submit.body;
				if (!data.headers.has("content-type"))
					data.headers.set("content-type", submit.ctype);
				WD(data).send(trigger);
			}
		}
		return;
	}

/*----------------------------------------------------------------------------*/
	/**#4 Requisições: formulários
	''function void data_wd_submit(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-submit|
	|Objetivo|Efetuar requisições assícronas por submissão de formulário|
	|Eventos|submit|
	|Alvos|Campos do elemento formulário|
	|Grupos|Único|
	|Referências|__Request.send, __Node.submit|
	Mecanismo semelhante à função '{data_wd_send} com as seguintes observações:
	- A propriedade query não se aplica, o conteúdo de i{body} é definido pelos campos vinculados ao formulário;
	- A propriedade i{url} é definida pelo atributo i{action} do formulário;
	- A propriedade i{method} é definida pelo atributo i{method} do formulário;
	- A propriedade i{noValidate} é definida pelo atributo i{noValidate} do formulário; e
	- A propriedade i{content-type} em i{headers} é definida pelo atributo i{enctype} do formulário.**/
	function data_wd_submit(target, event, wdArray) {
		const data  = wdArray[0];
		const form  = target;
		const query = form.elements;
		const html  = {method: null,	enctype: null, action: null, noValidate: null};
		const enter = (function(){
			const elem = document.activeElement;
			const test = new __Type(elem);
			const node = new __Node(test.node ? elem : form);
			const type = /^(image|submit)$/;
			return elem.form !== form || !type.test(node.ftype) ? null : elem;
		})();
		/*-- cabeçalho --*/
			data.headers = new __DataSet(data.headers);
		/*-- Informações do formulário: button ou form --*/
		for (let i in html) {
			/*-- 1) procurar atributo no elemento acionador --*/
			if (enter !== null) {
				const camel = "form"+(i.replace(i[0], i[0].toUpperCase()));
				const lower = camel.toLowerCase();
				const value = enter.hasAttribute(lower) ? enter[camel].trim() : "";
				html[i] = value !== "" ? value : null;
			}
			/*-- 2) se não localizado, buscar no formulário --*/
			if (html[i] === null) {
				const valid = !__Type(form[i]).node;
				const value = form.hasAttribute(i) ? form.getAttribute(i).trim() : "";
				html[i] = valid ? form[i] : (value !== "" ? value : null);
			}
		}
		/*-- Redefinindo atributos de configuração para envio à data_wd_send --*/
		if (html.method     !== null) data.method = html.method;
		if (html.action     !== null) data.url = html.action;
		if (html.enctype    !== null) data.headers.set("content-type", html.enctype);
		if (html.noValidate !== null) data.noValidate = html.noValidate;
		data.query = query;
		return data_wd_send(target, event, [data]);
	}

/*----------------------------------------------------------------------------*/
	/**#4 Carregamentos
	''function void data_wd_load(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-load|
	|Objetivo|Carregar conteúdos externos ao documento|
	|Eventos|load wdreload wddataset|
	|Alvos|Elemento|
	|Grupos|Único|
	|Referências|__Node.innerHTML/outerHTML/attribute|
	Possui as mesmas propriedades de i{data_wd_send}, exceto i{trigger} e i{type}, acrescida da seguinte propriedade:
	|Propriedades|Tipo|Descrição|
	|serialization|string|Comportamento da serialização outer/innerHTML/Text (__Node.attribute)|
	span{ }
	Observações:
	- Se o arquivo for CSV e a propriedade for inner/outerHTML, uma tabela com dados será adicionada ao documento;
	- O mesmo comportamento anterior ocorrerá caso o arquivo seja JSON com uma matriz (array de duas dimensões) de dados;
	- Em caso de innerText em elemento de formulário sem conteúdo textual, a propriedade modificada será a '{value}.**/
	function data_wd_load(target, event, wdArray) {
		const data   = wdArray[0];
		const node   = new __Node(target);
		data.type    = "text";
		data.trigger = function(x) {
			if (x.ok) {
				const mime = __MIME[x.contentType];
				const find = /^(inner|outer)(HTML|Text)$/;
				const attr = find.test(data.serialization) ? data.serialization : "innerHTML";
				const html = (/HTML$/).test(attr);
				let   text = x.response;
				if (html) {
					const parser = new __Parser(text);
					let test;
					if (mime === "html") {
						test = parser.stringHTML.get();
						text = test === null ? text : test.body.innerHTML;
					}
					else if (mime === "csv") {
						test = parser.csvTable.get();
						text = test === null ? text : test.outerHTML;
					}
					else if (mime === "json") {
						test = parser.stringJSON.matrixCSV.csvTable.get();
						text = test === null ? text : test.outerHTML;
					}
				}
				/*-- definir --*/
				if (attr === "innerText" && node.form && !node.ftext)
					node.attribute("value", text);
				else
					node.attribute(attr, text);
			}
		}
		return data_wd_send(target, event, [data]);
	}

/*----------------------------------------------------------------------------*/
	/**#4 Repetições
	''function void data_wd_repeat(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-repeat|
	|Objetivo|Replicar cópias de elementos os filhos com conteúdo configurável a partir de um arquivo externo.|
	|Eventos|load wdreload wddataset|
	|Alvos|Elemento|
	|Grupos|Único|
	|Referências|__Node.repeat|
	Possui as mesmas propriedades de i{data_wd_send}, exceto i{trigger} e i{type}.
	Os arquivos permitidos devem estar em formato CSV ou JSON (array de objetos);	**/
	function data_wd_repeat(target, event, wdArray) {
		const data   = wdArray[0];
		data.type    = "text";
		data.trigger = function(x) {
			if (x.ok)  {
				const mime = __MIME[x.contentType];
				let   list = null;
				if (mime === "json" || mime === "csv") {
					const parser = new __Parser(x.response);
					const value  = mime === "json" ? parser.stringJSON : parser.csvTable.tableValues.matrixList;
					list = value.get();
				}
				WD(target).repeat(list === null ? [] : list);
			}
		}
		return data_wd_send(target, event, [data]);
	}

/*----------------------------------------------------------------------------*/
	/**#4 Atribuição de Valores
	''function void data_wd_tools(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-tools|
	|Objetivo|Define ações aos elementos definidos por meio dos métodos de WDnode.|
	|Eventos|click|
	|Alvos|Elementos que possar receber cliques|
	|Grupos|Múltiplos|
	|Referências|__Node|
	span{ }
	Observações:
	- as ações serão aplicadas aos elementos definidos pela propriedade '{query} (seletor CSS de elementos);
	- se '{query} estiver ausente no grupo, terá como valor o próprio elemento; e
	- os argumentos dos métodos devem ser informados em arrays.**/
	function data_wd_tools(target, event, wdArray) {
		/*-- looping sobre os grupos --*/
		wdArray.forEach(function(group,i,a) {
			const test  = new __Type(group.query);
			const query = test.node ? group.query : target;
			const tools = WD(query);
			console.log({query: query, type: tools.type})
			/*-- looping pelos métodos --*/
			for (let method in group) {
				let check1 = new __Type(tools[method]);
				let check2 = new __Type(group[method]);
				if (check1.function && check2.array)
					tools[method].apply(tools, group[method]);
			}
		});
		return;
	};

/*----------------------------------------------------------------------------*/
	/**#4 Gráficos 2D
	''function void data_wd_chart(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-chart|
	|Objetivo|Cria um gráfico 2D a partir de comandos e dados em arquivos ou elementos.|
	|Eventos|load wdreload wddataset|
	|Alvos|Elementos que possar receber filhos renderizáveis|
	|Grupos|Único|
	|Referências|__Table.plot|
	Observações:
	- As propriedades do atributo têm a mesma estrutura do argumento do método __Table.plot;
	- O gráfico gerado substituirá o conteúdo do alvo;
	- A fonte de dados (opcional), é especificada por meio da propriedade '{source};
	- '{source} pode ser um elemento HTML (nó) ou o caminho (string) para um arquivo CSV ou JSON (array de duas dimensões);
	- No caso de fonte externa, as propriedades de i{data_wd_send}, exceto i{trigger} e i{type}, são aceitas;
	- O elemento poderá ser uma tabela, um campo de formulário ou elemento com conteúdo textual;
	- No caso de formulário ou conteúdo textual, o formato do conteúdo deverá ser em CSV.**/
	function data_wd_chart(target, event, wdArray) {
		const data = wdArray[0];
		const test = new __Type(data.source);
		const plot = function (input) {
			const table = new __Table(input);
			const svg   = table.plot(data);
			if (svg !== null) {
				target.innerHTML = "";
				target.appendChild(svg);
			}
		}
		/*-- elemento HTML como fonte de dados --*/
		if (test.node && test.value.length > 0) {
			const elem  = test.value[0];
			const node  = new __Node(elem);
			const form  = node.form && !node.ftext;
			const input = form ? elem.value : (node.tag === "table" ? elem : elem.textContent);
			plot(input);
		}
		/*-- arquivo CSV/JSON como fonte de dados --*/
		else if (test.nonempty) {
			data.url     = data.source;
			data.type    = "table";
			data.trigger = function(x) {
				if (x.done)
					plot(x.ok && x.response !== null ? x.response : undefined);
			};
			data_wd_send(target, event, [data]);
		}
		/*-- sem fonte de dados --*/
		else {
			plot();
		}
		return;
	}

/*----------------------------------------------------------------------------*/
	/**#4 Auto Clique
	''function void data_wd_click(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-click|
	|Objetivo|Promover eventos de clicagem ao elemento|
	|Eventos|load wdreload wddataset|
	|Alvos|Elementos que possam receber click|
	|Grupos|Único|
	|Referências|-|
	span{ }
	|Propriedades|Tipo|Descrição|
	|time|integer|Intervalos de tempo, em milissegundos, entre cliques (opcional)|
	|times|integer|Quantidade de vezes a repetir (opcional)|
	Observações:
	- Se '{time} for informado e '{times} não, a repetição ocorrerá indefinidamente;
	- Se '{times} for informado e '{time} não, a repetição ocorrerá sem intervalo de tempo;
	- Se nem '{time} e nem '{times} for informado, apenas um clique será executado;**/
	function data_wd_click(target, event, wdArray) {
		const data = wdArray[0];
		/*-- não há atributo: apagar identificador da interação --*/
		if (!("wdClick" in target.dataset)) {
			delete target.dataset.wdClickId;
		}
		/*-- primeira interação: executar clique e preparar repetições (com ou sem intervalo) --*/
		else if (event !== data) {
			const test = {time: new __Type(data.time), times: new __Type(data.times)};
			data.time  = test.time.integer  && test.time  > 0 ? test.time.value  : 0;
			data.times = test.times.integer && test.times > 0 ? test.times.value : 0;
			data.id    = String(new Date().valueOf());
			/*-- executar clique principal --*/
			target.click();
			/*-- repetir sem intervalo de tempo --*/
			if (data.time === 0) {
				while (--data.times > 0)
					target.click();
				delete target.dataset.wdClick;
			}
			/*-- repetir com intervalo de tempo --*/
			else {
				data.times = data.times === 0 ? Infinity : data.times;
				target.wdClickId = data.id;
				window.setTimeout(function() {
					data_wd_click(target, data, [data]);
				}, data.time);
			}
		}
		/*-- segunda interação: id válido --*/
		else if (data.id === target.wdClickId) {
			/*-- com repetições pendentes --*/
			if (--data.times > 0) {
				target.click();
				window.setTimeout(function() {
					data_wd_click(target, data, [data]);
				}, data.time);
			}
			/*-- sem repetições pendentes --*/
			else {
				delete target.wdClickId;
				delete target.dataset.wdClick;
			}
		}
		return;
	};

/*----------------------------------------------------------------------------*/
	/**#4 Filtro Textual
	''function void data_wd_filter(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-filter|
	|Objetivo|Filtrar elementos de acordo com seu conteúdo textual|
	|Eventos|load wdreload wddataset input|
	|Alvos|Elementos que possam receber digitação|
	|Grupos|Único|
	|Referências|__Node.filter|
	span{ }
	|Propriedades|Tipo|Descrição|
	|query|string|Seletor CSS que define os elementos que terão seus filhos filtrados|
	|size|integer|Mesmo propósito do argumento de __Node.filter (opcional)|**/
	function data_wd_filter(target, event, wdArray) {
		const data   = wdArray[0];
		const query  = WD(data.query);
		const size   = data.size;
		const node   = new __Node(target);
		const regexp = /^\/(.+)\/([gim]+)?$/;
		const value  = target[node.form && !node.ftext ? "value" : "innerText"];
		const search = !regexp.test(value) ? value : (function() {
			const arg1 = value.replace(regexp, "$1");
			const arg2 = value.replace(regexp, "$2");
			return new RegExp(arg1, arg2);
		})();
		if (query.type === "node")
			query.filter(search, size);
		return;
	};

/*----------------------------------------------------------------------------*/
	/**#4 Filtro Textual FIXME continuar a partir daqui a arrumar a descrição e trocar $$ por propriedade
	''function void data_wd_tabs(node target, object event, array wdArray)''
	|Disparador|Descrição|
	|Atributo|data-wd-filter|
	|Objetivo|Filtrar elementos de acordo com seu conteúdo textual|
	|Eventos|load wdreload wddataset input|
	|Alvos|Elementos que possam receber digitação|
	|Grupos|Único|
	|Referências|__Node.filter|
	span{ }
	|Propriedades|Tipo|Descrição|
	|$ ou $$|node|Seletor CSS que define os elementos que terão seus filhos filtrados|
	|size|integer|Mesmo propósito do argumento de __Node.filter (opcional)|**/

	function data_wd_tabs(target, event, wdArray) {
		//TODO ver __TAB
		return;
	};

/*----------------------------------------------------------------------------*/
	/**''function void data_wd_mask(node target, object event, array wdArray)''
	Função com o propósito de definir máscaras por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-mask|load wdreload wddataset focusout|Único|Múltiplos|__Node.display|Elemento que possa receber conteúdo|
	Possui as seguintes propriedades opcionais:
	|Nome|Tipo|Descrição|
	|model|string|Modelo da máscara|
	|check|function|Função a ser checada se a máscara casar ou não for informada|**/
	function data_wd_mask(target, event, wdArray) {
		const data  = wdArray[0];
		const node  = new __Node(target);
		const model = "model" in data ? String(data.model) : null;
		const check = __Type(data.check).function ? data.check : null;
		const mask  = model === null ? true : node.mask(model);
		if (mask && check !== null)
			node.fvalidity = check(node.form ? node.fvalue : target.textContent);
		return;
	};

/*----------------------------------------------------------------------------*/
	/**''function void data_wd_edit(node target, object event, array wdArray)''
	Função com o propósito de formatar textos em elementos editáveis por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-edit|click|Único|Múltiplos|-|Elementos que possa receber click|
	As propriedades e seus valores são advindas da ferramenta nativa i{execCommand}. TODO melhorar isso**/
	function data_wd_edit(target, event, wdArray) {
		const data = wdArray[0]
		for (let cmd in data) {
			let arg = data[cmd].trim() === "" ? undefined : data[cmd].trim();
			if (cmd === "createLink") {
				arg = prompt("Link:", "https://...");
				if (arg === null || arg.trim() === "") cmd = "unlink";
			}
			else if (cmd === "insertImage") {
				arg = prompt("Link:", "https://...");
			}
			document.execCommand(cmd, false, arg);
		}
		return;
	};







/*----------------------------------------------------------------------------*/
	/**''function void data_wdValue(node  e, object event)''
	Função vinculada ao atributo HTML '{data-wd-value} cujos objetivos são:
	- Aplicar e validar máscara;
	- Validar dados;
	- Renderizar dados; e
	- Obter e definir valores da URL.
	Possui múltiplos atributos e grupo único:
	|Nome|Descrição|
	|mask|Define o modelo da máscara a ser aplicada ao conteúdo.|
	|fail|Texto do erro da máscara.|
	|$$ ou $|Seletores CSS dos elementos de entrada vinculados ao valor de saída (i{output}).|
	|valid|Nome da função, definida no escopo de i{windows} com i{var} ou i{function}, para validar o valor.|
	|output|Nome da função, definida no escopo de i{windows} com i{var} ou i{function}, para definir o valor de saída.|
	A função i{output} será chamada quando os elementos de entrada dispararem um evento i{input}. Ela também será chamada ao carregar conteúdo ou definir o atributo. A função receberá o elemento e deverá retornar o seu valor.
	A aplicação da máscara será avalida nos carregamento de conteúdo, definição de atributo e quando o elemento perder o foco. Será chamada também no evento i{input} se i{output} for chamada. Se o conteúdo não casar com a máscara, o nó assumirá como mensagem de erro o valor de '{fail} ou o modelo da máscara.
	A função i{valid} será chamada nos carregamento de conteúdo e definição de atributo. A função receberá o elemento e deverá retornar o valor da mensagem de erro ou uma string em branco se não houver. No evento i{input}, i{valid} só será executada se i{output} tiver sido chamada.**/
	function data_wd_output(target, event, wdArray) {
		const nodes = WD.$$("[data-wd-output]");
		nodes.forEach(function(output,i) {
			const parser  = new __Parser(output.dataset.wdOutput);
			const wdarray = parser.wdArray.get();
			if (wdarray !== null) {
				const input = target;
				const data  = wdarray[0];
				const query = data.$$ || data.$ || null;
				const call  = __Type(data.call).function ? data.call : null;
				const list  = new __Type(query).value;
				if (query === null || call === null || list.indexOf(target) < 0) return;
				if ("$"  in data) delete data["$"];
				if ("$$" in data) delete data["$$"];
				delete data["call"];
				call(input, output, data)
			}
		});
		return;
	};


























/*----------------------------------------------------------------------------*/
	/**''function void data_wd_code(node target, object event, array wdArray)''
	Função com o propósito de definir exibições de codificação por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-code|load wdreload input|Múltiplas|Único|__Code|Elemento que possa receber texto de codificação.|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|word|string|Palavras reservadas da codificação|
	|value|string|Valores específicos da codificação|
	|string|string|Caracteres de abertura e fechamento de string|
	|comment|string|Caracteres de abertura e fechamento de comentários|
	|editable|boolean|Informa se o container poderá ser editado|
	|lines|boolean|Informa se as linhas serão numeradas|**/
	function data_wd_code(target, event, wdArray) {
		const data = wdArray[0];
		const node = new __Node(target);
		const text = node.form ? target.value : target.innerText.replace(/\s$/, "");
		const edit = data.editable !== true;
		const line = data.lines !== false;
		const code = new __Code(text);
		const tags = {code: "DIV", mask: "DIV", text: "TEXTAREA"};
		const name = ["value", "comment", "word", "string"];
		/*-- configurando código --*/
		for (let i = 0; i < name.length; i++) {
			if (name[i] in data)
				code.add(name[i], String(data[name[i]]));
		}
		/*-- construindo container e definindo propriedades --*/
		for (let i in tags) {
			tags[i] = document.createElement(tags[i]);
			tags[i].dataset.wdEncoding = i;
			tags[i].spellcheck = false;
			tags[i].translate  = false;
			if (i === "text") {
				tags[i].value    = text;
				tags[i].readOnly = edit;
				tags[i].id       = target.id;
			}
		}
		/*-- definindo disparador --*/
		tags.text.oninput  = function(ev) {
			code.input = tags.text.value;
			if (line) {
				const number = new __Number(code.input.split("\n").length);
				tags.code.dataset.wdEncodingLines = number.exp;
			}
			tags.mask.innerHTML = code.valueOf();
		};
		/*-- montando blocos e executando --*/
		tags.code.appendChild(tags.mask);
		tags.code.appendChild(tags.text);
		target.parentElement.replaceChild(tags.code, target);
		tags.text.oninput();
		return;
	};








/*----------------------------------------------------------------------------*/
	/**''function void data_wd_move(node target, object event, array wdArray)''
	Função com o propósito de mover o elemento por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-move|mousedown mousemove e mouseup|Único|Único|-|Elementos que possam ser movidos|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|$|node|Seletor CSS que define a o elemento a ser movido|
	O atributo i{data-wd-move} deve ficar sobre o elemento âncora e a propriedade i{$} especificará o elemento que será movido. Para um movimento padrão, a âncora deve ser um filho do elemento a se mover, se não definido, será o próprio elemento. Elementos com posicionamento i{static} e i{sticky} não serão movimentados.**/
	function data_wd_move(target, event, wdArray) {
		const data = wdArray[0];
		//FIXME aplicar __MOVE e estabelecer as teclas para acionar
		return;
	}

/*----------------------------------------------------------------------------*/
	/**''function void data_wd_drag(node target, object event, array wdArray)''
	Função com o propósito de arrastar elementos por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-drag|mousemove, dragstart e dragend|Múltipla|Múltiplos|-|Nós de elementos que possam ser arrastados|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|effect|string|(obrigatório) Efeito do arrasto: move, copy ou link|
	|drop|function|Função a ser executada ao derrubar o elemento|
	|$ ou $$|String|(obrigatório) Seletores CSS que identifica os elementos receptores do arrasto para o efeito especificado|
	Se o elemento arrastável tiver múltiplos efeitos, cada efeito deverá ser informado em um grupo diferente cuidando para que não haja concomitâncias de elementos receptores entre os grupos (o efeito do último grupo prevalecerá).
	A função '{drop} receberá como argumentos o elemento drop, o elemento drag e o efeito aplicado. Se nenhum função for especificada, um comportamento padrão será executado de acordo com o efeito definido.
	O elemento receptor não pode ser o elemento pai e nem o elemento arrastável ou estar contido nele.**/
	function data_wd_drag(target, event, wdArray) {
		const data = wdArray;
		return;
	}

/*----------------------------------------------------------------------------*/
	/**''function void data_wd_drop(node target, object event, array wdArray)''
	Função com o propósito de definir o comportamento do elemento ao receber arquivos arrastáveis por meio do atributo HTML i{data}.
	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-drop|dragover, dragleave e drop|Único|Múltiplos|-|Nós que podem receber informações de arquivos.|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|drop|function|Função a ser chamada ao derrubar os arquivos|
	A função i{drop} receberá como argumentos o elemento drop e os arquivos arrastáveis (FileList) e, se não informada, uma ação padrão será realizada. Nessa ação padrão, tentar-se-á carregar o arquivo na página (o primeiro arquivo de tamanho até 1000000 Bytes apenas).**/
	function data_wd_drop(target, event, wdArray) {
		const data  = wdArray[0];
		const file  = event.dataTransfer.types.indexOf("Files") >= 0;
		const time  = new Date();
		const ready = document.querySelectorAll("[data-wd-drop][data-wd-dropping]").length > 0;
		function clearDrops() {
			document.body.removeAttribute("data-wd-file-drop-time");
			WD.$$("[data-wd-dropping]").forEach(function(node) {
				node.removeAttribute("data-wd-dropping");
				node.ondragover  = null;
				node.ondragleave = null;
				node.ondrop      = null;
			});
			window.getSelection().removeAllRanges();
			return;
		};
		/*-- somente atuar em caso de arquivos --*/
		if (file)
			document.body.dataset.wdFileDropTime = time.valueOf();
		else
			return;
		/*-- Definindo visualização de queda -------------------------------------*/
		if (event.type === "dragover" && !ready) {
			const caller = new __Type(data.drop).function ? data.drop : function (drop, files) {
				for (let i = 0; i < files.length; i++) {
					if (files[i].size <= 10000000) {
						drop.innerHTML = "";
						let file = new __Request({url: files[i], type: "url",});
						file.read(function(x) {
							if (x.ok) {
								const object   = document.createElement("OBJECT");
								const span     = document.createElement("em");
								object.data    = x.response;
								object.type    = files[i].type;
								span.innerHTML = `&#x1F6A7; ${files[i].name} (${files[i].type})`;
								drop.appendChild(object);
								object.appendChild(span);
							}
						});
						break;
					}
					return;
				}
			};
			event.dataTransfer.dropEffect = "none";
			WD.$$("[data-wd-drop]").forEach(function(node) {
				node.dataset.wdDropping = "file";
				node.ondragover = function(ev) {
					ev.preventDefault();
					if ((/^(on)?dragover$/i).test(ev.type)) {
						ev.target.dataset.wdDropping = "FILE";
						ev.dataTransfer.dropEffect   = "copy";
					}
					else if ((/^(on)?dragleave$/i).test(ev.type)) {
						ev.target.dataset.wdDropping = "file";
					}
					else if ((/^(on)?drop$/i).test(ev.type)) {
						caller(ev.target, ev.dataTransfer.files);
						clearDrops();
					}
					return;
				}
				node.ondragleave = node.ondragover;
				node.ondrop      = node.ondragover;
			});
		}
		/*-- Apagando visualização de queda --------------------------------------*/
		else if (event.type === "dragleave" && ready) {
			const delta = 200;
			window.setTimeout(function() {
				const now = new Date();
				const val = Number(document.body.dataset.wdFileDropTime);
				if (now.valueOf() - val >= delta) clearDrops();
			}, delta);
		}
	}





/*----------------------------------------------------------------------------*/
	/**''function void data_wdTsort(node  e, object event)''
	Função vinculada ao atributo HTML '{data-wd-tsort} cujo objetivo é ordenar colunas específicas de tabelas. Não possui atributo.**/
	function data_wdTsort(e, event) {
		if (!("wdTsort" in e.dataset)) return;
		try {
			let thead = e.parentElement.parentElement;
			if (thead.tagName.toLowerCase() !== "thead") return;
			let tbody = thead.parentElement.tBodies;
			let heads = __Type(e.parentElement.children).value;
			let index = heads.indexOf(e);
			let data  = __String("").wdValue(e.dataset.wdTsort);
			let sort  = data === 1 ? -1 : 1;
			WD(tbody).display("["+(sort * (index + 1))+"]");
			heads.forEach(function(v,i,a) {
				if ("wdTsort" in v.dataset)
					v.dataset.wdTsort = v === e ? (sort > 0 ? "+1" : "-1") : "";
			});
		} catch(e) {}
		return;
	};




/*----------------------------------------------------------------------------*/
	function data_wdShared(e, event) { /* FIXME pendente Experimental: compartilhar em redes sociais: data-wd-shared=rede */
		if (!("wdShared" in e.dataset)) return;
		let url    = encodeURIComponent(document.URL);
		let title  = encodeURIComponent(document.title);
		let social = e.dataset.wdShared.trim().toLowerCase();
		let link   = {
			/* https://developers.facebook.com/docs/workplace/sharing/share-dialog/#sharedialogvialink */
			/* https://developers.facebook.com/docs/plugins/share-button/ */
			facebook: "https://www.facebook.com/sharer.php?u="+url,
			/* https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent */
			twitter:  "https://twitter.com/intent/tweet?url="+url+"&text="+title,
			/* https://www.coderstool.com/share-social-link-generator */
			linkedin: "https://www.linkedin.com/shareArticle?url="+url+"&title="+title,
			/* https://www.reddit.com/dev/api#POST_api_submit */
			reddit:   "https://reddit.com/submit?url="+url+"&title="+title,
			/* https://www.coderstool.com/share-social-link-generator */
			evernote: "https://www.evernote.com/clip.action?url="+url+"&title="+title,
			/* https://core.telegram.org/widgets/share */
			telegram: "https://t.me/share/url?url="+url+"&text="+title,
			/* https://faq.whatsapp.com/563219570998715/?locale=en_US */
			whatsapp: "https://wa.me/?text="+url,
		}
		if ("clipboard" in navigator) navigator.clipboard.writeText(document.URL);
		if (social in link) {window.open(link[social]);}

		return;
	};

/*----------------------------------------------------------------------------*/
/**''function void data_wd_float(node target, object event, array wdArray)''
	Função com o propósito de exibir elementos no ponto de clicagem por meio do atributo HTML i{data}.


	|Atributo HTML|Evento|Propriedades|Grupos|Métodos|Alvo|
	|data-wd-move|dragstart e dragend|Único|Múltiplos|-|Nós de elementos que possam ser arrastados|
	Possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|type|string|Tipo do movimento, que deve ser i{drag}|
	|effect|array|Efeitos do movimento: i{hide, move, copy e link}|**/
	function data_wd_float(target, event, wdArray) {
		console.log(wdArray[0])
		const data  = wdArray[0];
		const query = data.$ || data.$$ || null;
		const check = new __Type(query);
		const float = check.node ? check.value[0] : null;
		if (float !== null) {
			/*-- definindo propriedades e atributos --*/
			document.body.appendChild(float);
			float.tabIndex = -1;
			float.setAttribute("aria-modal", "false");
			float.onkeydown = function(ev) {
				ev.preventDefault();
				const re = /^(Escape|Tab)/i;
				if (re.test(ev.key)) float.style.display = "none";
			}
			/*-- definindo estilos --*/
			const place = target.getBoundingClientRect();
			float.style.position  = "fixed";
			float.style.display   = "block";
			float.style.maxWidth  = "30vw";
			float.style.maxHeight = "75vw";
			if (event.clientY > (window.innerHeight/2))
				float.style.top = (event.clientY - place.height)+"px";
			else
				float.style.top = (event.clientY)+"px";
			if (event.clientX > (window.innerWidth/2))
				float.style.left = (event.clientX - place.width)+"px";
			else
				float.style.left = (event.clientX)+"px";
			/*-- Focando no primeiro elemento focável --*/
			const child = float.querySelectorAll("*");
			for (let i = 0; i < child.length; i++) {
				if (child[i].tabIndex >= 0) {
					child[i].focus();
					break;
				}
			}
		}
		return;
	};

						//FIXME nos atributos dataset de clicar devo colocar tabindex, role e onkeydown?
						//TODO ideia: no evento keydown de enter forçar um click e tá resolvido
						//TODO ideia: no load e set definir tabindex se o atributo for de clique



/*============================================================================*/
/* -- DISPARADORES -- */
/*============================================================================*/
	/**''const object __EVENTS''
	Registra os eventos da biblioteca e seus disparadores.
	O primeiro nível de dados diz respeito ao nome do evento cujo valor é um objeto.
	O segundo nível de propriedades possui as seguintes características:
	|Nome|Tipo|Descrição|
	|target|object|É o alvo genérico (bubble) do disparador (window, document)|
	|preventDefault|boolean|Define se evoca o método preventDefault dp evento|
	|data|Array|Lista de objetos contendo a configuração de cada evento|
	|extra|string|Define uma especifidade a ser verificada para o evento (opcional)|
	Os itens da lista definida em '{data} possui as seguintes propriedades:
	|Nome|Tipo|Descrição|
	|name|string ou nulo|Define o seletor CSS, se existir, vinculado ao disparador|
	|kill|boolean|Define se o atributo dataset será excluído após chamar o disparador|
	|bind|object|Propriedades obrigatórias do dataset que serão definidas caso não tenham sido|
	|call|function|nome do disparador|
	|extra|string|Define uma especifidade a ser verificada para o método (opcional)|
	Quanto aos tipo de seletores, tem-se:
	|Tipo|Exemplo|Comportamento|
	|atributo data|[data-wd-nome]|Aplica-se ao elementos descendentes do alvo|
	|atributo data|*[data-wd-nome]|Aplica-se ao elementos descendentes do documento|
	|propriedade dataset|wdNome|Aplica-se ao elemento titular da propriedade|
	|Seletor CSS|*|Aplica-se aos elementos identificados pelo seletor definido|
	|null|null|Aplica-se ao alvo específico|
	Regras específicas:
	- Se a propriedade '{target} for definida como window, document será considerado como alvo;
	- Os eventos só ocorrem para elementos HTML (tipo 1) ou document (tipo 9);
	- O valor dos tipos "atributo data" e "propriedade dataset" precisa estar no formato wdArray obrigatoriamente;
	- As propriedades '{bind} e '{kill} se aplicam apenas aos tipos "atributo data" e "propriedade dataset";
	- O disparador '{call} receberá como argumentos o alvo, os dados do evento e uma lista wdArray; e
	- A lista wdArray será nula nos casos de tipos diferentes de "atributo data" e "propriedade dataset".**/
	//FIXME quando o evento de clique receber um enter, forçar um click
	//FIXME implantar extra para cada disparador
	const __EVENTS = {
		wdreload: {
			target: window, preventDefault: false,
			data: [
				{name: "[data-wd-repeat]", call: data_wd_repeat,  kill: true,  bind: {headers: {}}},
				{name: "[data-wd-load]",   call: data_wd_load,    kill: true,  bind: {headers: {}}},
				{name: "[data-wd-chart]",  call: data_wd_chart,   kill: true,  bind: {}},
				{name: "[data-wd-code]",   call: data_wd_code,    kill: true,  bind: {}},
				{name: "[data-wd-click]",  call: data_wd_click,   kill: false, bind: {}},
				{name: "[data-wd-filter]", call: data_wd_filter,  kill: false, bind: {}},
				{name: "[data-wd-mask]",   call: data_wd_mask,    kill: false, bind: {}},
				{name: "[data-wd-device]", call: data_wd_device,  kill: false, bind: {}},
				{name: "[data-wd-tabs]",   call: data_wd_tabs, kill: true,  bind: {}},
			]
		},
		wddataset: {
			target: document, preventDefault: false, extra: "wddatasetList",
			data: [
				{name: "wdRepeat", call: data_wd_repeat, kill: true,  bind: {headers: {}}},
				{name: "wdLoad",   call: data_wd_load,   kill: true,  bind: {headers: {}}},
				{name: "wdChart",  call: data_wd_chart,  kill: true,  bind: {}},
				{name: "wdCode",   call: data_wd_code,   kill: true,  bind: {}},
				{name: "wdClick",  call: data_wd_click,  kill: false, bind: {id: null}},
				{name: "wdFilter", call: data_wd_filter, kill: false, bind: {}},
				{name: "wdMask",   call: data_wd_mask,   kill: false, bind: {}},
				{name: "wdDevice", call: data_wd_device, kill: false, bind: {}},
				{name: "wdTabs",   call: data_wd_tabs,   kill: true,  bind: {}},
			]
		},
		submit: {
			target: document, preventDefault: true,
			data: [
				{name: "wdSubmit", call: data_wd_submit, kill: false, bind: {headers: {}}}
			]
		},
		//FIXME verificar o impacto de preventDefault nos disparadores de clique (testar todos)
		click: {
			target: document, preventDefault: false, extra: "leftClick",
			data: [
				{name: "wdSend",    call: data_wd_send,    kill: false, bind: {headers: {}}},
				{name: "wdTools",   call: data_wd_tools,   kill: false, bind: {}},
				{name: "wdEdit",    call: data_wd_edit,    kill: false, bind: {}},
			]
		},
		input: {
			target: document, preventDefault: false, extra: "checkTypingTime",
			data: [
				{name: "wdFilter", call: data_wd_filter, kill: false, bind: {id: null}},
				{name: null,       call: data_wd_output, kill: false, bind: {}}
			]
		},
		focusout: {
			target: document, preventDefault: false,
			data: [
				{name: "wdMask", call: data_wd_mask,   kill: false, bind: {}},
				//{name: null,      call: data_wd_output, kill: false, bind: {}}
			]
		},
		focusin: {
			target: document, preventDefault: false,
			data: [
				//{name: null, call: wdOnFocusIn, kill: false, bind: {}}
			]
		},
		drag: {
			target: document, preventDefault: false,
			data: []
		},
		dragstart: {
			target: document, preventDefault: false,
			data: [
				//{name: "wdDrag", call: data_wd_drag, kill: false, bind: {}}
			]
		},
		dragend: {
			target: document, preventDefault: false,
			data: [
				//{name: "wdDrag", call: data_wd_drag, kill: false, bind: {}}
			]
		},
		dragleave: {
			target: document, preventDefault: true,
			data: [
				//{name: "html", call: data_wd_drop, kill: false, bind: {}}
			]
		},
		dragover: {
			target: document, preventDefault: true,
			data: [
				//{name: null, call: data_wd_drop, kill: false, bind: {}}
			]
		},
		dragenter: {
			target: document, preventDefault: true,
			data: []
		},
		drop: {
			target: document, preventDefault: true,
			data: []
		},
		mousedown: {
			target: document, preventDefault: false, extra: "leftClick",
			data: []
		},
		mouseup: {
			target: document, preventDefault: false, extra: "leftClick",
			data: []
		},
		mousemove: {
			target: document, preventDefault: false,
			data: []
		},
		mouseenter: {
			target: document, preventDefault: false,
			data: [
				//{name: "wdDrag", call: data_wd_drag, kill: false, bind: {effect: "all"}}
			]
		},
		mouseleave: {
			target: document, preventDefault: false,
			data: []
		},
		mouseover: {
			target: document, preventDefault: false,
			data: [
				{name: "wdDrag", call: data_wd_drag, kill: false, bind: {}}
			]
		},
		mouseout: {
			target: document, preventDefault: false,
			data: []
		},
		dblclick: {
			target: document, preventDefault: false, extra: "leftClick",
			data: []
		},
		keydown: {
			target: window, preventDefault: false,
			data: [],
		},
	};

	/**''function void eventManager(event)''
	Disparador genérico da biblioteca, administra o conteúdo de __EVENTS.**/
	function eventManager(event) {
		/*-- Checar alvo do evento: elemento (1) ou documento (9) ----------------*/
		const target = event.target === window ? document : event.target;
		if ([1, 9].indexOf(target.nodeType) < 0) return;
		/*-- obtendo dados iniciais --*/
		const config    = __EVENTS[event.type];
		const dataset   = config.data;
		const wddataset = [];
		const trigger   = [];
		const search    = /^\*?\[(data\-wd\-[0-9a-zA-Z\-]+)(\=[^\]]+)?\]$/;//TODO retirar o $ do fim da re?
		const extra     = {
			 /*-- tempo mínimo para digitação encerrar --*/
			 typingTime: function(ev) {
				const body = document.body;
				if (!("wdTypingTime" in ev)) {
					ev.wdTypingTime   = new Date().valueOf();
					body.wdTypingTime = ev.wdTypingTime;
					window.setTimeout(function() {eventManager(ev);}, 500);
					return false;
				}
				if (ev.wdTypingTime === body.wdTypingTime) {
					delete ev.wdTypingTime;
					delete body.wdTypingTime;
					return true;
				}
				return false;
			},
			/*-- clique com o botão esquerdo do mouse --*/
			leftClick: function(ev) {
				return event.which === 1;
			},
			/*-- capturar as propriedades definidas em dataset (wddataset = variável global) --*/
			wddatasetList: function(ev) {
				if (ev.target.nodeType === 1 && "wddataset" in ev.target.dataset) {
					const list = ev.target.dataset.wddataset.split(" ");
					list.forEach(function(v,i,a) {wddataset.push(v);});
					delete ev.target.dataset.wddataset;
				}
				return true;
			},
		};

		/*-- checar especifidades de cada evento ---------------------------------*/
		if ("extra" in config && config.extra in extra)
			if (!extra[config.extra](event)) return;

		/*-- Lista de disparadores: elementos qua casam com o parâmetro ----------*/
		let map, root, name, query;
		for (let i = 0; i < dataset.length; i++) {
			map = dataset[i];
			/*-- Elementos descendentes com atributo HTML data: *[data-wd...] (wdArray) --*/
			if (search.test(map.name)) {
				root  = map.name[0] === "*" ? document : target;
				name  = map.name.replace(search, "$1");
				query = WD.$$(map.name, root);
				query.forEach(function(node) {
					trigger.push({
						target:  node,                    /*-- nó alvo --*/
						name:    map.name,                /*-- selector CSS --*/
						call:    map.call,                /*-- função a ser chamada --*/
						bind:    map.bind,                /*-- configurações iniciais do evento --*/
						value:   node.getAttribute(name), /*-- valor do atributo --*/
						wdArray: null,                    /*-- valor de wdArray --*/
					});
					if (map.kill) node.removeAttribute(name);
				});
			}
			/*-- Elementos por nome da propriedade dataset: wdNome (wdArray) --*/
			else if ("dataset" in target && map.name in target.dataset) {
				trigger.push({
					target:  target,
					name:    map.name,
					call:    map.call,
					bind:    map.bind,
					value:   target.dataset[map.name],
					wdArray: null,
				});
				if (map.kill) delete target.dataset[map.name];
			}
			/*-- Busca genérica, independente da propriedade dataset ou atributo HTML data --*/
			else {
				query = typeof map.name === "string" ? WD.$$(map.name, document) : [target];
				query.forEach(function(node) {
					trigger.push({
						target:  node,
						name:    map.name,
						call:    map.call,
						bind:    map.bind,
						value:   "",
						wdArray: null,
					});
				});
			}
		}

		/*-- Analisando e chamando disparadores ----------------------------------*/
		const info = {};
		let parser, wdarray, count = 0;
		trigger.forEach(function(map,i,a) {
			/*-- evento wddataset: verificar se a propriedade definida está prevista --*/
			if (wddataset.length > 0 && wddataset.indexOf(map.name) < 0)
				return;
			/*-- verificar se o valor do atributo pode ser obtido --*/
			parser  = new __Parser(map.value);console.log(map)
			wdarray = parser.wdArray.get();
			if (wdarray === null)
				return;
			if (wdarray.length === 0)
				wdarray.push({});
			/*-- verificar se há alguma propriedade obrigatória a definir --*/
			for (let prop in map.bind) {
				for (let j = 0; j < wdarray.length; j++) {
					if (!(prop in wdarray[j]))
						wdarray[j][prop] = map.bind[prop];
				}
			}
			map.wdArray = wdarray;



			/*-- log de manutenção--*/
			info[event.type] = map.name;
			info.call = map.call.name;
			info.data = map.wdArray;
			if (__UNDERMAINTENANCE) console.info(info);

			/*-- chamar disparador --*/
			if (config.preventDefault && count === 0)
				event.preventDefault();
			map.call(map.target, event, map.wdArray);
			count++;
		});
		return;
	};

	/*-- defininir eventos e disparadores --*/
	for (let ev in __EVENTS)
		__EVENTS[ev].target.addEventListener(ev, eventManager, false);



	window.addEventListener("resize", __DEVICE);
	window.addEventListener("resize", __HASH);
	window.addEventListener("hashchange", __HASH);
	window.addEventListener("wdreload", __HASH);


	window.addEventListener("load", function(ev) {
		const node = document.createElement("STYLE");
		node.innerHTML = __CSS;
		document.head.appendChild(node);
		document.dispatchEvent(wdReloadEvent);
		return;
	});









	/*-- retornar a função principal da biblioteca --*/
	return WD;
}());