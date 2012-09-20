#import "videoinfo.js"
#import "interface.js"
#import "streammap.js"

function setLanguage(language)
{
	if (Languages[language])
		Languages.current = Languages[language];
}

function main()
{
	setLanguage(document.documentElement.getAttribute("lang"));

	VideoInfo.init();
	Interface.init();

	Interface.update(StreamMap.getStreams());
}
