#import "interface.js"

// Update - Check Userscripts.org for updates
var Update = (function() {
	var self = {
		check: check,
	};

	// check() - Query Userscripts.org for changes to the script's version
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
