// ==UserScript==
// @name           YouTube Video Download
// @namespace      http://rossy2401.blogspot.com/
// @description    Download videos from YouTube. Simple, lightweight and supports all formats, including WebM.
// @version        VERSION
// @author         rossy
// @license        MIT License
// @grant          none
// @updateURL      https://userscripts.org/scripts/source/62634.user.js
// @include        https://userscripts.org/scripts/source/62634.meta.js
// @include        http://www.youtube.com/watch?*
// @include        https://www.youtube.com/watch?*
// @include        http://*.c.youtube.com/videoplayback?*
// ==/UserScript==

(function() {
	"use strict";

	function inject(str)
	{
		var elem = document.createElement("script");

		elem.setAttribute("type", "application/javascript");
		elem.textContent = "(function() {\"use strict\"; (" + str + ")();})();";

		document.body.appendChild(elem);
	}

	if (document.location.href == "https://userscripts.org/scripts/source/62634.meta.js")
	{
		inject(function() {
			window.parent.postMessage(document.documentElement.textContent, "*");
		});

		return;
	}

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
				if (xhr.readyState >= 2)
				{
					if (!set)
					{
						set = true;

						var length = xhr.getResponseHeader("Content-length");
						var target = document.getElementById(data.target);
						target.setAttribute("title", target.getAttribute("title") + ", " + formatSize(Number(length)));
					}

					xhr.abort();
				}
			};
			xhr.send(null);
		}
	}, false);

	function script()
	{
#define STR(s) #s
		var version = STR(VERSION);
#define USO
		#import "tools.js"
		#import "main.js"

		main();
	}

	inject(script);
})();
