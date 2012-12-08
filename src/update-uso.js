#import "interface.js"

// Update - Check Userscripts.org for updates
var Update = (function() {
	self = {
		check: check,
	};

	// apiRequest(path, callback) - Perform a JSON API request for path,
	// calling the callback(json, error) function on completion
	function apiRequest(path, callback)
	{
		var xhr = new XMLHttpRequest();
		xhr.open("GET", path);

		xhr.onload = function() {
			var json;

			try {
				json = JSON.parse(xhr.responseText);
			}
			catch (e) {
				callback(null, true);
			}

			if (json)
				callback(json);
		};

		xhr.onerror = function() {
			callback(null, true);
		};

		xhr.send();
	}

	// check() - Query Userscript.org for changes to the script's version
	// number. If there is, inform the Interface module.
	function check()
	{
		delete localStorage["ytd-update-version"];
		delete localStorage["ytd-last-update"];

		window.addEventListener("message", function(event) {
			var remoteVersion = /^\/\/ @version\s+(.+)$/m.exec(event.data)[1];

			if (remoteVersion)
			{
				localStorage["ytd-last-update"] = Date.now();
				localStorage["ytd-update-version"] = remoteVersion;

				if (remoteVersion != version)
					Interface.notifyUpdate();
			}
		}, false);

		var iframe = document.createElement("iframe");
		iframe.setAttribute("src", "https://userscripts.org/scripts/source/62634.meta.js");
		iframe.setAttribute("style", "position: absolute; left: -1px; top: -1px; width: 1px; height: 1px; opacity: 0;");
		document.body.appendChild(iframe);
	}

	return self;
})();
