#import "videoinfo.js"
#import "interface.js"
#import "streammap.js"
#import "styles.css.js"

#ifdef USO
#import "update-uso.js"
#else
#import "update.js"
#endif

function main()
{
	if (localStorage.getItem("ytd-check-updates") === null)
		localStorage["ytd-check-updates"] = true;

	if (localStorage.getItem("ytd-prefer-webm") === null)
		localStorage["ytd-prefer-webm"] = false;

	if (localStorage.getItem("ytd-get-sizes") === null)
		localStorage["ytd-get-sizes"] = false;

	if (localStorage.getItem("ytd-title-format") === null)
		localStorage["ytd-title-format"] = "${title}";

	if (localStorage.getItem("ytd-itags") === null)
		localStorage["ytd-itags"] = "37, 22, 18";

	VideoInfo.init();
	Interface.init();
	Styles.injectStyle(Styles.styles);

	Interface.update(StreamMap.getStreams());

#ifdef USO
	if ((String(localStorage["ytd-check-updates"]) == "true"))
		if (localStorage["ytd-current-version"] != version ||
			!localStorage["ytd-last-update"] ||
			Number(localStorage["ytd-last-update"]) < Date.now() - 2 * 24 * 60 * 60 * 1000)
			Update.check();
		else if (localStorage["ytd-update-version"] && localStorage["ytd-update-version"] != version)
			Interface.notifyUpdate();

	localStorage["ytd-current-version"] = version;
#else
	if ((String(localStorage["ytd-check-updates"]) == "true"))
		if (localStorage["ytd-current-sha1sum"] != hash ||
			!localStorage["ytd-last-update"] ||
			Number(localStorage["ytd-last-update"]) < Date.now() - 2 * 24 * 60 * 60 * 1000)
			Update.check();
		else if (localStorage["ytd-update-sha1sum"] && localStorage["ytd-update-sha1sum"].substr(0, 7) != hash)
			Interface.notifyUpdate();

	localStorage["ytd-current-sha1sum"] = hash;
#endif
}
