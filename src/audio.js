#import "streammap.js"
#import "videoinfo.js"

// Audio - Communicate with the YouTube Audio Download script
var Audio = (function() {
	var self = {
		present: false,
		get: get,
		addStreams: addStreams,
		updateLink: updateLink,
	};

	var toaster;

	function createToaster()
	{
		var toaster = document.createElement("div");
		toaster.setAttribute("style", "position: fixed; z-index: 90000;" +
			"right: 0px; bottom: 0px; width: 360px; max-height: 100%;" +
			"box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" +
			"overflow: auto;");
		document.body.appendChild(toaster);

		return toaster;
	}

	function get(url, defaultName, stream)
	{
		var toast,
		    statusText,
		    statusSpan,
		    blobURL,
		    cancel;

		var obj = new URI(url);
		obj.pathname = "/#" + obj.pathname;
		url = obj.toString();

		var iframe = document.createElement("iframe");
		iframe.setAttribute("style", "position: absolute; left: -1px;" +
			"top: -1px; width: 1px; height: 1px; opacity: 0;");
		iframe.setAttribute("src", url);
		document.body.appendChild(iframe);

		function sendMessage(type, data)
		{
			iframe.contentWindow.postMessage(JSON.stringify({ type: type, data: data }), "*");
		}

		function createToast()
		{
			if (!toaster)
				toaster = createToaster();

			toast = document.createElement("div");
			toast.setAttribute("style", "padding: 12px;" +
				"border-left: 1px solid rgb(229, 229, 229);" +
				"border-top: 1px solid rgb(229, 229, 229);" +
				"background-color: white; color: black; font: 14px Arial;" +
				"line-height: 24px;");

			var titleB = document.createElement("b");
			titleB.appendChild(document.createTextNode("Splitting AAC audio from " + stream.height + "p video... "));

			cancel = document.createElement("a");
			cancel.innerHTML = "cancel";
			cancel.setAttribute("href", "javascript:;");
			cancel.setAttribute("style", "float: right;");
			cancel.addEventListener("click", function() {
				sendMessage("cancel");
			}, false);

			statusSpan = document.createElement("span");
			statusText = document.createTextNode("&nbsp;");
			statusSpan.appendChild(statusText);

			toast.appendChild(titleB);
			toast.appendChild(cancel);
			toast.appendChild(document.createElement("br"));
			toast.appendChild(statusSpan);

			toaster.appendChild(toast);
		}

		function processMessage(type, data)
		{
			switch (type)
			{
				case "ready":
					createToast();
					sendMessage("ready-ack");
					break;
				case "progress":
					statusText.data = "Downloading... (" +
						(data.loaded / 1048576).toFixed(2) + "/" +
						(data.total / 1048576).toFixed(2) + " MiB, " +
						(data.loaded / data.total * 100).toFixed(0) + "%)";
					break;
				case "error":
					alert(data.msg);
					sendMessage("cancel");
					break;
				case "finished":
					sendMessage("save", { defaultName: defaultName });
					blobURL = data.blob;
					break;
				case "save-ack":
					sendMessage("revoke");
					break;
				case "save-fail":
					statusText.data = "";

					cancel.innerHTML = "close";

					var a = document.createElement("a");
					a.setAttribute("href", blobURL);
					a.setAttribute("download", defaultName);
					a.appendChild(document.createTextNode("Finished. Right-click and save as to download."));

					toast.appendChild(a);
					break;
				case "cancel-ack":
					sendMessage("revoke");
					break;
				case "revoke-ack":
					document.body.removeChild(iframe);
					window.removeEventListener("message", onWindowMessage, false);
					if (toast)
						toaster.removeChild(toast);
					break;
			}
		}

		function onWindowMessage(e)
		{
			if (e.source != iframe.contentWindow)
				return;

			var json = JSON.parse(e.data);

			processMessage(json.type, json.data);
		}

		window.addEventListener("message", onWindowMessage, false);
	}

	function addStreams(streams)
	{
		streams = streams.slice();

		for (var i = 0, max = streams.length; i < max; i ++)
		{
			var stream = streams[i];

			if (stream.container == "MP4" && stream.acodec == "AAC")
				streams.push(extend({ audio: true }, stream));
		}

		return streams;
	}

	function updateLink(stream, elem)
	{
		elem.setAttribute("href", "javascript:;");
		elem.addEventListener("click", function() {
			get(StreamMap.getURL(stream),
				formatFileName(format(localStorage["ytd-title-format"], merge(stream, VideoInfo))) + StreamMap.getExtension(stream),
				stream);
		});
	}

	if (document.documentElement.getAttribute("data-ytd-audio-present") == "data-ytd-audio-present")
		self.present = true;

	return self;
})();
