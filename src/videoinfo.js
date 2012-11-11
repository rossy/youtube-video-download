#import "try.js"

// VideoInfo - Get global video metadata
var VideoInfo = (function() {
	var self = {
		init: init,
	};

	// init() - Populates the VideoInfo object with video metadata
	function init()
	{
		self.title = Try.all(
			function() {
				return yt.playerConfig.args.title;
			},
			function() {
				return document.querySelector("meta[name=title]").getAttribute("content");
			},
			function() {
				return document.querySelector("meta[property=\"og:title\"]").getAttribute("content");
			},
			function() {
				return document.getElementById("eow-title").getAttribute("title");
			},
			function() {
				return document.querySelector("#watch-headline-title > span").getAttribute("title");
			},
			function() {
				return document.title.match(/^(.*) - YouTube$/)[1];
			}
		);

		self.author = Try.all(
			function() {
				return document.querySelector("#watch-uploader-info > .author").textContent;
			},
			function() {
				return document.querySelector("#watch7-user-header > .yt-user-name").textContent;
			},
			function() {
				return document.querySelector("#watch-userbanner").getAttribute("title");
			},
			function() {
				return document.querySelector("span[itemprop=author] > link[itemprop=url]").getAttribute("href").match(/www.youtube.com\/user\/([^\/]+)/)[1];
			}
		);
	}

	return self;
})();
