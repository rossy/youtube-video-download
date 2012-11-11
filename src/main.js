#import "videoinfo.js"
#import "interface.js"
#import "streammap.js"
#import "update.js"

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
		if (localStorage["ytd-current-sha1sum"] != hash ||
			!localStorage["ytd-last-update"] ||
			Number(localStorage["ytd-last-update"]) < Date.now() - 2 * 24 * 60 * 60 * 1000)
			Update.check();
		else if (localStorage["ytd-update-sha1sum"] && localStorage["ytd-update-sha1sum"].substr(0, 7) != hash)
			Interface.notifyUpdate();

	localStorage["ytd-current-sha1sum"] = hash;
}
