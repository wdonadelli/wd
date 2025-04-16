function darkMode() {
	const hour = wd.now.hour;
	wd.$("body").set({
		class: {add: hour >= 6 && hour < 18 ? "wd-bg-base" : "wd-bg-black"}
	});
	return;
}























window.addEventListener("load", function() {
	darkMode();
}, false);
