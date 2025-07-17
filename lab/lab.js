function darkMode() {
	const hour = wd.now.hour;
	wd.$("body").set({
		class: {add: hour >= 6 && hour < 18 ? "wd-bg-base" : "wd-bg-black"}
	});
	return;
}


function doc() {
	wd({url: "wd.js", trigger: function(x) {
		//console.log(x)
		if (x.ok) {
			const doc  = new wd.parser(x.response).wdComment("/**", "**/").html;
			document.querySelector("main").innerHTML = doc;
			return;
		}
	}}).send();
}



















window.addEventListener("load", function() {
	darkMode();
	doc();
}, false);
