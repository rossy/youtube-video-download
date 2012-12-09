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

	// Just in case the auto format detection code breaks, fall back on these
	// defaults for determining what is in the streams
	var defaultStreams = [
		{ itag: 5  , width:  320, height:  240, container: "FLV" , acodec:"MP3"   , vcodec: "H.263"                                                    },
		{ itag: 17 , width:  176, height:  144, container: "3GPP", acodec:"AAC"   , vcodec: "MPEG-4"                                                   },
		{ itag: 18 , width:  640, height:  360, container: "MP4" , acodec:"AAC"   , vcodec: "H.264" , vprofile: "Baseline", level: 3.0                 },
		{ itag: 22 , width: 1280, height:  720, container: "MP4" , acodec:"AAC"   , vcodec: "H.264" , vprofile: "High"    , level: 3.1                 },
		{ itag: 34 , width:  640, height:  360, container: "FLV" , acodec:"AAC"   , vcodec: "H.264" , vprofile: "Main"                                 },
		{ itag: 35 , width:  854, height:  480, container: "FLV" , acodec:"AAC"   , vcodec: "H.264" , vprofile: "Main"                                 },
		{ itag: 36 , width:  320, height:  240, container: "3GPP", acodec:"AAC"   , vcodec: "MPEG-4", vprofile: "Simple"                               },
		{ itag: 37 , width: 1920, height: 1080, container: "MP4" , acodec:"AAC"   , vcodec: "H.264" , vprofile: "High"    , level: 3.1                 },
		{ itag: 38 , width: 2048, height: 1536, container: "MP4" , acodec:"AAC"   , vcodec: "H.264" , vprofile: "High"    , level: 3.1                 },
		{ itag: 43 , width:  640, height:  360, container: "WebM", acodec:"Vorbis", vcodec: "VP8"                                                      },
		{ itag: 44 , width:  854, height:  480, container: "WebM", acodec:"Vorbis", vcodec: "VP8"                                                      },
		{ itag: 45 , width: 1280, height:  720, container: "WebM", acodec:"Vorbis", vcodec: "VP8"                                                      },
		{ itag: 46 , width: 1920, height: 1080, container: "WebM", acodec:"Vorbis", vcodec: "VP8"                                                      },
		{ itag: 82 , width:  640, height:  360, container: "MP4" , acodec:"AAC"   , vcodec: "H.264" , vprofile: "Baseline", level: 3.0, stereo3d: true },
		{ itag: 83 , width:  854, height:  480, container: "MP4" , acodec:"AAC"   , vcodec: "H.264" , vprofile: "Baseline", level: 3.1, stereo3d: true },
		{ itag: 84 , width: 1280, height:  720, container: "MP4" , acodec:"AAC"   , vcodec: "H.264" , vprofile: "High",     level: 3.1, stereo3d: true },
		{ itag: 85 , width: 1920, height: 1080, container: "MP4" , acodec:"AAC"   , vcodec: "H.264" , vprofile: "High",     level: 3.1, stereo3d: true },
		{ itag: 100, width:  640, height:  360, container: "WebM", acodec:"Vorbis", vcodec: "VP8"                                     , stereo3d: true },
		{ itag: 101, width:  854, height:  480, container: "WebM", acodec:"Vorbis", vcodec: "VP8"                                     , stereo3d: true },
		{ itag: 102, width: 1280, height:  720, container: "WebM", acodec:"Vorbis", vcodec: "VP8"                                     , stereo3d: true },
	];

	function containerToNum(container)
	{
		if (localStorage["ytd-prefer-webm"] == "true")
			return {
				"WebM": 1,
				"MP4": 2,
				"FLV": 3,
				"3GPP": 4,
			}[container] || 5;
		else
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
		    ret = { container: "Unknown" };

		if (m == "video/mp4")
		{
			ret.container = "MP4";
			ret.vcodec = "H.264";
			ret.acodec = "AAC";

			var m = type.match(/avc1\.(....)(..)/)

			if (m)
			{
				ret.level = parseInt(m[2], 16) / 10;

				if (m[1] == "58A0")
					ret.vprofile = "Extended";
				else if (m[1] == "6400")
					ret.vprofile = "High";
				else if (m[1] == "4D40")
					ret.vprofile = "Main";
				else if (m[1] == "42E0")
					ret.vprofile = "Baseline";
				else if (m[1] == "4200")
					ret.vprofile = "Baseline";
			}
		}
		else if (m == "video/webm")
		{
			ret.container = "WebM";
			ret.vcodec = "VP8";
			ret.acodec = "Vorbis";
		}
		else if (m == "video/x-flv")
		{
			ret.container = "FLV";
		}
		else if (m == "video/3gpp")
		{
			ret.container = "3GPP";
			ret.vcodec = "MPEG-4";
			ret.acodec = "AAC";
		}

		return ret;
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
			    streams = equi("itag", defaultStreams, flashArgs.url_encoded_fmt_stream_map.split(",").map(decodeQuery));

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

	// getExtension(stream) - Get the file extension associated with the
	// container type of the specified stream
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
