var Styles = (function() {
	var self = {
		injectStyle: injectStyle,
	};

	// injectStyle(text) - Add a stylesheet to the page's head
	function injectStyle(text)
	{
		var style = document.createElement("style");

		style.setAttribute("type", "text/css");
		style.textContent = text;
		document.head.appendChild(style);
	}

	return self;
})();
