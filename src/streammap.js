#import "try.js"
#import "videoinfo.js"

// StreamMap - Get and convert format maps
var StreamMap = (function() {
	var self = {
		getStreams: getStreams,
		getURL: getURL,
		sortFunc: sortFunc,
		getExtension: getExtension,
	};

	function containerToNum(container)
	{
		return {
			"MP4": 1,
			"FLV": 2,
			"WebM": 3,
			"3GPP": 4,
		}[container] || 5;
	}

	// sortFunc(a, b) - Sort streams from best to worst
	function sortFunc(a, b)
	{
		if (a.height && b.height && a.height != b.height)
			return b.height - a.height;

		if (a.stereo3d && !b.stereo3d)
			return 1;
		else if (!a.stereo3d && b.stereo3d)
			return -1;

		if (a.container && b.container && a.container != b.container)
			return containerToNum(a.container) - containerToNum(b.container);

		return (Number(b.itag) - Number(a.itag)) || 0;
	}

	// decodeType(type) - Decode the mime type of the video
	function decodeType(type)
	{
		var m = type.match(/^[^ ;]*/)[0],
		    container = "Unknown", vcodec, acodec, vprofile, level;

		if (m == "video/mp4")
		{
			container = "MP4";
			vcodec = "H.264";
			acodec = "AAC";

			var m = type.match(/avc1\.(....)(..)/)

			if (m)
			{
				level = parseInt(m[2], 16) / 10;

				if (m[1] == "58A0")
					vprofile = "Extended";
				else if (m[1] == "6400")
					vprofile = "High";
				else if (m[1] == "4D40")
					vprofile = "Main";
				else if (m[1] == "42E0")
					vprofile = "Baseline";
				else if (m[1] == "4200")
					vprofile = "Baseline";
			}
		}
		else if (m == "video/webm")
		{
			container = "WebM";
			vcodec = "VP8";
			acodec = "Vorbis";
		}
		else if (m == "video/x-flv")
		{
			container = "FLV";
		}
		else if (m == "video/3gpp")
		{
			container = "3GPP";
			vcodec = "MPEG-4";
			acodec = "AAC";
		}

		return {
			container: container,
			acodec: acodec,
			vcodec: vcodec,
			vprofile: vprofile,
			level: level,
		};
	}

	// processStream(stream) - Add some format information to the stream
	function processStream(stream)
	{
		if (stream.type)
		{
			stream = merge(stream, decodeType(stream.type));

			if (stream.container == "FLV")
				if (stream.flashMajor == 7)
				{
					stream.vcodec = "H.263";
					stream.acodec = "MP3";
				}
				else
				{
					stream.vcodec = "H.264";
					stream.acodec = "AAC";
				}
		}

		return stream;
	}

	// decodeFormat(format) - Decode an element of the fmt_list array
	function decodeFormat(format)
	{
		format = format.split("/");
		var	size = format[1].split("x");

		return {
			itag: format[0],
			width: Number(size[0]),
			height: Number(size[1]),
			flashMajor: Number(format[2]),
			flashMinor: Number(format[3]),
			flashPatch: Number(format[4]),
		};
	}

	// getFlashArgs() - Get the flashvars from the page
	function getFlashArgs()
	{
		return Try.all(
			function() {
				return yt.playerConfig.args;
			},
			function() {
				return decodeQuery(document.getElementById("movie_player").getAttribute("flashvars"));
			}
		);
	}

	// getStreams() - Get the streams from the page
	function getStreams()
	{
		try {
			var flashArgs = getFlashArgs(),
			    streams = flashArgs.url_encoded_fmt_stream_map.split(",").map(decodeQuery);

			try {
				streams = equi("itag", streams, flashArgs.fmt_list.split(",").map(decodeFormat));
			}
			catch (e) {}
		} catch (e) {}

		return streams.map(processStream);
	}

	// getURL(stream) - Get a URL from a stream
	function getURL(stream, title)
	{
		if (stream.url)
		{
			var uri = new URI(stream.url);

			if (!uri.query.signature && stream.sig)
				uri.query.signature = stream.sig;

			if (title)
				uri.query.title = formatFileName(title);

			return uri.toString();
		}
	}

	function getExtension(stream)
	{
		return {
			"MP4": ".mp4",
			"WebM": ".webm",
			"3GPP": ".3gp",
			"FLV": ".flv",
		}[stream.container] || "";
	}

	return self;
})();
