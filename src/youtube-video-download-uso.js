// ==UserScript==
// @name           YouTube Video Download
// @namespace      http://rossy2401.blogspot.com/
// @description    Download videos from YouTube. Simple, lightweight and supports all formats, including WebM.
// @version        VERSION
// @author         rossy
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACC0lEQVR4Xu3TT2sTURQF8LtR88eMTgU/gOA3UNwoaLtw6yJYcaeCC3Er7hT3VlGhCMaC4CIoFAKKtqJYQ8XguOgEk0WCk8AsMsUsEmigSeF4Lg9KCMTORGm6yIXfu8Od+w6BJDKpiT2jMJW8SR/JIVUn/Cf1vtxFOi399Y1Dwi7LitbXqWSaMCZpydvJLGFMsrJiJwqEMSnIJzvhE8bElw92YosQVq/XQ1d1u+h1TTfMnDtRbMn7wwlE0el0BmxoNzY6iJonb3lE0W610Wq32Vumt1vKzDmLmic5HlE0m80hfmtH1DxZ5DGUncTn9AWsXEpvC4IGgkaARtAg0wP2wPTtvS+XL+pdzRieT/L6UBzDvLJiyJ6fge/7I+FdzdCsoSTL428epw7g7sw5eLUaPE95qNVUzfAMzviOzAx3eEfv7pQvL3ns5AGDbp06iZ9ra6hWKqgMqppeJe5w94TeQZhsecEjjIepGG4cP4bV5SWUS2WUy6qEknYDq0vLuqO7CJsrC1Z8kxDGEwZfP3oEuecZuEUXrltE0XUVcgsZfac7uhvWpjyz4nVCWPP6IeL7cP/aVfxwvsNxHD5f0Zm+050ofslTK54nRHU7wd/F2TNKn3U2irzMW7EMYRT3Du5XOhtVRvidTRPGZFq0HqVic4RdNif9xb/OLL0hp8864R+tD2S+o1nZKzUxqT/sC28zrWX8pAAAAABJRU5ErkJggg==
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
