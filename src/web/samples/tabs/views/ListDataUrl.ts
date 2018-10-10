import WebImage from "../../../../core/WebImage";

// tslint:disable

const base64 = "Ww0KICAgIHsNCiAgICAgICAgImxhYmVsIjogIk1vdmllIDEiLA0KICAgICAgICAidmFsdWUiOiAibW92"+
		"aWUxIg0KICAgIH0sDQogICAgew0KICAgICAgICAibGFiZWwiOiAiTW92aWUgMiIsDQogICAgICAgICJ2"+
		"YWx1ZSI6ICJtb3ZpZTIiDQogICAgfQ0KXQ==";

export default new WebImage(`data:image/jpeg;base64,${base64}`);
