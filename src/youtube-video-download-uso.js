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

/*
 * This file is a part of YouTube Video Download, which has been placed under
 * the MIT/Expat license.
 *
 * Copyright (c) 2012-2013, James Ross-Gowan and other contributors.
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
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/*
 * Feel free to read and modify this source code, however please note that this
 * is the compiled/pre-processed version of the script. It has been generated
 * from several files and most whitespace has been removed. For easier reading,
 * see the GitHub repository:
 * https://github.com/rossy2401/youtube-video-download/tree/stable/src
 *
 * For translations, language files can be found here:
 * https://github.com/rossy2401/youtube-video-download/tree/stable/lang
 */

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
