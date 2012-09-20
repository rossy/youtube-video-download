var Languages = {
	"en": {"download-button-tip": "Download this video","download-button-text": "Download","menu-button-tip": "Choose from additional formats","group-high-definition": "High definition","group-standard-definition": "Standard definition","group-mobile": "Mobile","group-unknown": "Unknown formats","error-no-downloads": "No downloadable streams found"},
};
Languages.current = Languages.en;
function T(item) { return Languages.current[item] || Languages.en[item]; }
