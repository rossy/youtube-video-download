#import "interface.js"

// Update - Check GitHub for updates
var Update = (function() {
	var self = {
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

	// check() - Query GitHub for changes to
	// "youtube-video-download.user.js.sha1sum". If there is, inform the
	// Interface module.
	function check()
	{
		delete localStorage["ytd-update-sha1sum"];
		delete localStorage["ytd-last-update"];

		apiRequest("https://api.github.com/repos/rossy2401/youtube-video-download/git/refs/heads/master", function(json) {
			if (!json)
				return;

			apiRequest(json.object.url, function (json) {
				if (!json)
					return;

				apiRequest(json.tree.url, function (json) {
					if (!json)
						return;

					apiRequest(json.tree.filter(function(a) { return a.path == "youtube-video-download.user.js.sha1sum"; })[0].url, function (json) {
						if (!json)
							return;

						var sha1sum = atob(json.content.replace(/\n/g, ""));

						localStorage["ytd-update-sha1sum"] = sha1sum;
						localStorage["ytd-last-update"] = Date.now();

						if (sha1sum.substr(0, 7) != hash)
							Interface.notifyUpdate();
					});
				});
			});
		});
	}

	return self;
})();
