// ==UserScript==
// @name           YouTube Video Download
// @namespace      sooaweso.me
// @description    Download videos from YouTube. Simple, lightweight and supports all formats, including WebM.
// @version        VERSION
// @author         rossy
// @license        MIT License
// @include        http://*.youtube.com/watch?*
// @include        https://*.youtube.com/watch?*
// ==/UserScript==

(function() {
	"use strict";

	function script()
	{
		var version = VERSION, hash = "HASH";
		#import "tools.js"
		#import "main.js"

		main();
	}

	function inject(str)
	{
		var elem = document.createElement("script");

		elem.setAttribute("type", "application/javascript");
		elem.textContent = "(function() {\"use strict\"; (" + str + ")();})();";

		document.body.appendChild(elem);
	}

	inject(script);
})();
