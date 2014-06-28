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
				return ytplayer.config.args.title;
			},
			function() {
				return document.querySelector("meta[name=title]").getAttribute("content");
			},
			function() {
				return document.querySelector("meta[property=\"og:title\"]").getAttribute("content");
			},
			function() {
				return document.querySelector("#watch-headline-title > .yt-uix-expander-head").getAttribute("title");
			},
			function() {
				return document.title.match(/^(.*) - YouTube$/)[1];
			}
		);

		self.author = Try.all(
			function() {
				return document.querySelector("#watch7-user-header > .yt-user-name").textContent;
			},
			function() {
				return document.querySelector("#watch7-user-header .yt-thumb-clip img").getAttribute("alt");
			},
			function() {
				return document.querySelector("span[itemprop=author] > link[itemprop=url]").getAttribute("href").match(/www.youtube.com\/user\/([^\/]+)/)[1];
			}
		);

		self.date = Try.all(
			function() {
				var dateRegex = /.*([A-Z][a-z]{2} [1-3]?[0-9], 20[0-9]{2}).*/
				return new Date(document.getElementById("watch-uploader-info").textContent.match(dateRegex)[1]);
			}
		);

		self.video_id = Try.all(
			function() {
				return new URI(document.location.href).query.v;
			}
		);

		self.seconds = Try.all(
			function() {
				return Math.floor(Number(ytplayer.config.args.length_seconds));
			}
		);

		if (self.date)
		{
			self.day = ("0" + self.date.getDate()).match(/..$/)[0];
			self.month = ("0" + (self.date.getMonth() + 1)).match(/..$/)[0];
			self.year = self.date.getFullYear().toString();

			self.date.toString = function() {
				return self.year + "-" + self.month + "-" + self.day;
			};
		}

		if (self.seconds)
			self.duration = Math.floor(self.seconds / 60) + ":" + self.seconds % 60;
	}

	return self;
})();
