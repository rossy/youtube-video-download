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

	if (localStorage["ytd-prefer-webm"] === undefined)
		localStorage["ytd-prefer-webm"] = false;

	if (localStorage["ytd-restrict"] === undefined)
		localStorage["ytd-restrict"] = true;

	if (localStorage["ytd-get-sizes"] === undefined)
		localStorage["ytd-get-sizes"] = false;

	if (localStorage["ytd-title-format"] === undefined)
		localStorage["ytd-title-format"] = "${title}";

	VideoInfo.init();
	Interface.init();

	Interface.update(StreamMap.getStreams());

#ifdef USO
	if ((localStorage["ytd-check-updates"] == "true"))
		if (localStorage["ytd-current-version"] != version ||
			!localStorage["ytd-last-update"] ||
			Number(localStorage["ytd-last-update"]) < Date.now() - 2 * 24 * 60 * 60 * 1000)
			Update.check();
		else if (localStorage["ytd-update-version"] && localStorage["ytd-update-version"] != version)
			Interface.notifyUpdate();

	localStorage["ytd-current-version"] = version;
#else
	if ((localStorage["ytd-check-updates"] == "true"))
		if (localStorage["ytd-current-sha1sum"] != hash ||
			!localStorage["ytd-last-update"] ||
			Number(localStorage["ytd-last-update"]) < Date.now() - 2 * 24 * 60 * 60 * 1000)
			Update.check();
		else if (localStorage["ytd-update-sha1sum"] && localStorage["ytd-update-sha1sum"].substr(0, 7) != hash)
			Interface.notifyUpdate();

	localStorage["ytd-current-sha1sum"] = hash;
#endif
}
