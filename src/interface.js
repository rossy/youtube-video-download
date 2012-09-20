#import "languages.js"
#import "streammap.js"

// Interface - Handles the user interface for the watch page
var Interface = (function() {
	var self = {
		init: init,
		update: update,
	};

	var groups = [
		{ title: T("group-high-definition"), predicate: function(stream) {
			return stream.height && stream.container && stream.container != "3GPP" && stream.height > 576;
		} },
		{ title: T("group-standard-definition"), predicate: function(stream) {
			return stream.height && stream.container && stream.container != "3GPP" && stream.height <= 576;
		} },
		{ title: T("group-mobile"), predicate: function(stream) {
			return stream.height && stream.container && stream.container == "3GPP";
		} },
		{ title: T("group-unknown"), flat: true, predicate: function(stream) {
			return !stream.height || !stream.container;
		} },
	];

	// createDlButton() - Creates the instant download button
	function createDlButton()
	{
		var link = document.createElement("a"),
		    elem = document.createElement("button");

		link.setAttribute("href", "javascript:;");

		elem.className = "start yt-uix-tooltip-reverse yt-uix-button yt-uix-button-default yt-uix-tooltip";
		elem.setAttribute("title", T("download-button-tip"));
		elem.setAttribute("type", "button");
		elem.setAttribute("role", "button");

		elem.innerHTML = "<span class=\"yt-uix-button-content\">" + T("download-button-text") + "</span>";

		link.appendChild(elem);

		return link;
	}

	// createMenuButton() - Creates the download menu button
	function createMenuButton()
	{
		var elem = document.createElement("button");

		elem.className = "end yt-uix-tooltip-reverse yt-uix-button yt-uix-button-default yt-uix-tooltip";
		elem.setAttribute("title", T("menu-button-tip"));
		elem.setAttribute("type", "button");
		elem.setAttribute("role", "button");
		elem.setAttribute("onclick", "; return false;");

		elem.innerHTML = "<img class=\"yt-uix-button-arrow\" style=\"margin: 0;\" src=\"//s.ytimg.com/yt/img/pixel-vfl73.gif\" alt=\"\">";

		return elem;
	}

	// createMenu() - Creates the downloads menu
	function createMenu()
	{
		var elem = document.createElement("div");

		elem.className = "yt-uix-button-menu";
		elem.style.display = "none";

		return elem;
	}

	// createMenuItemGroup() - Creates a sub-group for a set of related streams
	function createMenuItemGroup(streams)
	{
		var itemGroup = document.createElement("div"),
		    size = document.createElement("div"),
		    mainLink = document.createElement("a");

		itemGroup.style.position = "relative";
		itemGroup.style.minWidth = streams.length * 64 + 48 + "px";

		size.className = "yt-uix-button-menu-item";
		size.style.textAlign = "right";
		size.style.width = "55px";
		size.style.position = "absolute";
		size.style.left = "0px";
		size.style.top = "0px";
		size.style.paddingLeft = size.style.paddingRight = "0px";
		size.style.color = "inherit";

		mainLink.className = "yt-uix-button-menu-item";
		mainLink.setAttribute("href", StreamMap.getURL(streams[0]));
		mainLink.style.display = "block";
		mainLink.style.paddingLeft = "55px";
		mainLink.style.marginRight = (streams.length - 1) * 64 + "px";

		size.appendChild(document.createTextNode(streams[0].height + "p\u00a0"));
		mainLink.appendChild(size);
		mainLink.appendChild(document.createTextNode((streams[0].stereo3d ? "3D " : "") + streams[0].container));
		itemGroup.appendChild(mainLink);

		for (var i = 1, max = streams.length; i < max; i ++)
		{
			var subLink = document.createElement("a");

			subLink.className = "yt-uix-button-menu-item";
			subLink.setAttribute("href", StreamMap.getURL(streams[i]));
			subLink.style.display = "block";
			subLink.style.position = "absolute";
			subLink.style.right = (streams.length - i - 1) * 64 + "px";
			subLink.style.top = "0px";
			subLink.style.width = "53px";
			subLink.style.paddingLeft = subLink.style.paddingRight = "5px";
			subLink.style.borderLeft = "1px solid #DDD";

			subLink.appendChild(document.createTextNode((streams[i].stereo3d ? "3D " : "") + streams[i].container));
			itemGroup.appendChild(subLink);
		}

		return itemGroup;
	}

	// createGroup(title, streams) - Creates a new menu group
	function createGroup(title, flat, streams)
	{
		var elem = document.createElement("div");

		elem.innerHTML = "<div style=\"padding: 2px 13px; font-weight: bold; border-bottom: 1px solid #999;\">" + title + "</div>";

		if (flat)
			for (var i = 0, max = streams.length; i < max; i ++)
				elem.appendChild(createMenuItemGroup([streams[i]]));
		else
		{
			var resolutions = [],
			    resGroups = {};
			for (var i = 0, max = streams.length; i < max; i ++)
			{
				if (!resGroups[streams[i].height])
				{
					resolutions.push(streams[i].height);
					resGroups[streams[i].height] = [];
				}

				resGroups[streams[i].height].push(streams[i]);
			}

			for (var i = 0, max = resolutions.length; i < max; i ++)
				elem.appendChild(createMenuItemGroup(resGroups[resolutions[i]]));
		}

		return elem;
	}

	// setDlButton(stream) - Sets the default stream to download
	function setDlButton(stream)
	{
		self.dlButton.getElementsByTagName("button")[0]
			.setAttribute("title", T("download-button-tip") +
			" (" + stream.height + "p " + stream.container + ")");

		self.dlButton.setAttribute("href", StreamMap.getURL(stream));
	}

	// update(streams) - Adds streams to the menu
	function update(streams)
	{
		streams = streams
			.filter(function(obj) { return obj.url; })
			.sort(StreamMap.sortFunc);

		var mp4streams = streams.filter(function(obj) { return obj.container == "MP4"; });

		if (mp4streams.length)
			setDlButton(mp4streams[0]);
		else if (streams.length)
			setDlButton(streams[0]);
		else
		{
			var button = self.dlButton.getElementsByTagName("button")[0];

			self.menuButton.disabled = true;
			self.menuButton.setAttribute("title", "");

			button.setAttribute("title", T("error-no-downloads"));
		}

		for (var i = 0, max = groups.length; i < max; i ++)
		{
			var groupStreams = streams.filter(groups[i].predicate);

			if (groupStreams.length)
				self.menu.appendChild(createGroup(groups[i].title, groups[i].flat, groupStreams));
		}
	}

	// init() - Initalises the user interface
	function init()
	{
		// Get the flag button from the actions menu
		var watchFlag = document.getElementById("watch-flag"),
		    buttonGroup = document.createElement("span");

		buttonGroup.className = "yt-uix-button-group";

		self.dlButton = createDlButton();
		self.menuButton = createMenuButton();
		self.menu = createMenu();
		self.menuButton.appendChild(self.menu);

		// If the flag button is disabled, all the controls should be disabled
		self.dlButton.disabled = self.menuButton.disabled = watchFlag.disabled;

		// Populate the button group
		buttonGroup.appendChild(self.dlButton);
		buttonGroup.appendChild(self.menuButton);

		// Insert the button group before the flag button
		watchFlag.parentNode.insertBefore(buttonGroup, watchFlag);

		// Also insert some whitespace
		watchFlag.parentNode.insertBefore(document.createTextNode(" "), watchFlag);
	}

	return self;
})();
