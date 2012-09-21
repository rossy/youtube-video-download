// ==UserScript==
// @name           YouTube Video Download
// @namespace      sooaweso.me
// @description    Download videos from YouTube. Simple, lightweight and supports all formats, including WebM.
// @version        VERSION
// @author         rossy
// @license        MIT License
// @grant          none
// @include        http://*.youtube.com/watch?*
// @include        https://*.youtube.com/watch?*
// @include        http://*.c.youtube.com/videoplayback?*
// ==/UserScript==

(function() {
	"use strict";

	function formatSize(bytes)
	{
		if (bytes < 1048576)
			return (bytes / 1024).toFixed(1) + " KiB";
		else
			return (bytes / 1048576).toFixed(1) + " MiB";
	}

	document.addEventListener("ytd-update-link", function(event) {
		if (window.chrome)
		{
			var xhr = new XMLHttpRequest();
			var data = JSON.parse(event.data);
			var set = false;

			xhr.open("HEAD", data.href, true);
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState >= 2 && !set)
				{
					set = true;

					var length = xhr.getResponseHeader("Content-length");
					var target = document.getElementById(data.target);
					target.setAttribute("title", target.getAttribute("title") + ", " + formatSize(Number(length)));

					xhr.abort();
				}
			};
			xhr.send(null);
		}
	}, false);

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
