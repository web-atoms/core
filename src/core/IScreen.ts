export type IScreenType = "mobile" | "tablet" | "desktop";

export interface IScreen {
    width?: number;
    height?: number;
    scrollLeft?: number;
    scrollTop?: number;
    orientation?: "portrait" | "landscape";
    screenType?: IScreenType;
}
