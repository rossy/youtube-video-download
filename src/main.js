#import "videoinfo.js"
#import "interface.js"
#import "streammap.js"

#ifdef USO
#import "update-uso.js"
#else
#import "update.js"
#endif

function main()
{
	if (yt.config_ && Languages[yt.config_.HL_LOCALE])
		Languages.current = Languages[yt.config_.HL_LOCALE];

	if (localStorage["ytd-check-updates"] === undefined)
		localStorage["ytd-check-updates"] = true;

	if (localStorage["ytd-title-format"] === undefined)
		localStorage["ytd-title-format"] = "${title}";

	VideoInfo.init();
	Interface.init();

	Interface.update(StreamMap.getStreams());

	if ((localStorage["ytd-check-updates"] == "true"))
#ifdef USO
		if (localStorage["ytd-current-version"] != version ||
#else
		if (localStorage["ytd-current-sha1sum"] != hash ||
#endif
			!localStorage["ytd-last-update"] ||
			Number(localStorage["ytd-last-update"]) < Date.now() - 2 * 24 * 60 * 60 * 1000)
			Update.check();
#ifdef USO
		else if (localStorage["ytd-update-version"] && localStorage["ytd-update-version"].substr(0, 7) != version)
#else
		else if (localStorage["ytd-update-sha1sum"] && localStorage["ytd-update-sha1sum"].substr(0, 7) != hash)
#endif
			Interface.notifyUpdate();

#ifdef USO
	localStorage["ytd-current-version"] = version;
#else
	localStorage["ytd-current-sha1sum"] = hash;
#endif
}
