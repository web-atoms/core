// tslint:disable:member-ordering
export class ColorItem {

    public readonly red: number ;
    public readonly green: number;
    public readonly blue: number;
    public readonly alpha: number;

    public readonly colorCode: string;
    public readonly namedColor: string;

    constructor(red: number, green: number, blue: number, alpha?: number)
    /**
     * @param colorCode HEX or RGBA code
     * @param namedColor name of color
     */
    constructor(colorCode: string, namedColor?: string)
    constructor( colorCodeOrRed: string | number, namedColorOrGreen?: string | number, blue?: number, alpha?: number) {
        if (typeof colorCodeOrRed === "string") {
            this.colorCode = colorCodeOrRed;
            if (typeof namedColorOrGreen === "string") {
                this.namedColor = namedColorOrGreen;
            }
            const r = ColorItem.parseRgb(this.colorCode);
            this.red = r.red;
            this.green = r.green;
            this.blue = r.blue;
            this.alpha = r.alpha;
        } else {
            this.red = colorCodeOrRed;
            if (typeof namedColorOrGreen === "number") {
                this.green = namedColorOrGreen;
            }
            this.blue = blue;
            this.alpha = alpha;

            this.colorCode = ColorItem.rgb(this.red, this.green, this.blue, this.alpha);
        }
    }

    public toString(): string {
        return this.colorCode;
    }

    public withAlphaPercent(a: number): ColorItem {
        // a = a * 255;
        return new ColorItem(this.red, this.green, this.blue, a);
    }

    private static parseRgb(rgba: string): { red: number, green: number, blue: number, alpha?: number } {
        if (/^\#/.test(rgba)) {
            rgba = rgba.substr(1);
            // this is hex...
            if (rgba.length === 3) {
                rgba = rgba.split("").map( (x) => x + x).join("");
            }
            const red = Number.parseInt(rgba[0] + rgba[1], 16);
            const green = Number.parseInt(rgba[2] + rgba[3], 16);
            const blue = Number.parseInt(rgba[4] + rgba[5], 16);
            if (rgba.length > 6) {
                const alpha = Number.parseInt(rgba[6] + rgba[7], 16);
                return { red, green, blue, alpha };
            }
            return { red, green, blue };
        }
        if (/^rgba/i.test(rgba)) {
            rgba = rgba.substr(5);
            rgba = rgba.substr(0, rgba.length - 1);
            const a = rgba.split(",").map( (x, i) => i === 3 ? Number.parseFloat(x) : Number.parseInt(x, 10) );
            return { red: a[0], green: a[1], blue: a[2], alpha: a[3]};
        }
        if (/^rgb/i.test(rgba)) {
            rgba = rgba.substr(4);
            rgba = rgba.substr(0, rgba.length - 1);
            const a = rgba.split(",").map( (x) => Number.parseInt(x, 10) );
            return { red: a[0], green: a[1], blue: a[2]};
        }

        throw new Error("Unknown color format " + rgba);
    }

    private static rgb(r: number, g: number, b: number, a?: number): string {
        // if (!isInt(r)) {
        //     // all must be less than one...
        //     if (isInt(g) || isInt(b) || (a !== undefined && isInt(a))) {
        //         throw new Error("All color values must be either fractions or integers between 0 to 255");
        //     }
        //     r = r * 255;
        //     g = g * 255;
        //     b = b * 255;
        // }
        if (a !== undefined) {
            return `rgba(${r},${g},${b},${a})`;
        }
        return "#" + toFixedString(r) + toFixedString(g) + toFixedString(b);
    }
}

// function isInt(n: number): boolean {
//     return Number(n) === n && n % 1 === 0;
// }

function toFixedString(t: number): string {
    return ("0" + t.toString(16)).slice(-2);
}

export default class Colors {

    public static rgba(red: number, green: number, blue: number, alpha?: number): ColorItem {
        return new ColorItem(red, green, blue, alpha);
    }

    public static parse(color: string): ColorItem {

        if (!color) {
            return null;
        }

        color = color.toLowerCase();

        // check if exists in current...
        for (const key in Colors) {
            if (Colors.hasOwnProperty(key)) {
                const element = Colors[key];
                if (element instanceof ColorItem) {
                    const ci = element as ColorItem;
                    if (ci.namedColor === color) {
                        return ci;
                    }
                }
            }
        }

        if (/^(\#|rgb\(|rgba\()/i.test(color)) {
            return new ColorItem(color);
        }

        throw new Error("Invalid color format " + color);
    }

    public static black: ColorItem = new ColorItem ( "#000000", "black" ) ;
    public static silver: ColorItem = new ColorItem ( "#c0c0c0", "silver" ) ;
    public static gray: ColorItem = new ColorItem ( "#808080", "gray" ) ;
    public static white: ColorItem = new ColorItem ( "#ffffff", "white" ) ;
    public static maroon: ColorItem = new ColorItem ( "#800000", "maroon" ) ;
    public static red: ColorItem = new ColorItem ( "#ff0000", "red" ) ;
    public static purple: ColorItem = new ColorItem ( "#800080", "purple" ) ;
    public static fuchsia: ColorItem = new ColorItem ( "#ff00ff", "fuchsia" ) ;
    public static green: ColorItem = new ColorItem ( "#008000", "green" ) ;
    public static lime: ColorItem = new ColorItem ( "#00ff00", "lime" ) ;
    public static olive: ColorItem = new ColorItem ( "#808000", "olive" ) ;
    public static yellow: ColorItem = new ColorItem ( "#ffff00", "yellow" ) ;
    public static navy: ColorItem = new ColorItem ( "#000080", "navy" ) ;
    public static blue: ColorItem = new ColorItem ( "#0000ff", "blue" ) ;
    public static teal: ColorItem = new ColorItem ( "#008080", "teal" ) ;
    public static aqua: ColorItem = new ColorItem ( "#00ffff", "aqua" ) ;
    public static orange: ColorItem = new ColorItem ( "#ffa500", "orange" ) ;
    public static aliceBlue: ColorItem = new ColorItem ( "#f0f8ff", "aliceblue" ) ;
    public static antiqueWhite: ColorItem = new ColorItem ( "#faebd7", "antiquewhite" ) ;
    public static aquaMarine: ColorItem = new ColorItem ( "#7fffd4", "aquamarine" ) ;
    public static azure: ColorItem = new ColorItem ( "#f0ffff", "azure" ) ;
    public static beige: ColorItem = new ColorItem ( "#f5f5dc", "beige" ) ;
    public static bisque: ColorItem = new ColorItem ( "#ffe4c4", "bisque" ) ;
    public static blanchedAlmond: ColorItem = new ColorItem ( "#ffebcd", "blanchedalmond" ) ;
    public static blueViolet: ColorItem = new ColorItem ( "#8a2be2", "blueviolet" ) ;
    public static brown: ColorItem = new ColorItem ( "#a52a2a", "brown" ) ;
    public static burlyWood: ColorItem = new ColorItem ( "#deb887", "burlywood" ) ;
    public static cadetBlue: ColorItem = new ColorItem ( "#5f9ea0", "cadetblue" ) ;
    public static chartReuse: ColorItem = new ColorItem ( "#7fff00", "chartreuse" ) ;
    public static chocolate: ColorItem = new ColorItem ( "#d2691e", "chocolate" ) ;
    public static coral: ColorItem = new ColorItem ( "#ff7f50", "coral" ) ;
    public static cornFlowerBlue: ColorItem = new ColorItem ( "#6495ed", "cornflowerblue" ) ;
    public static cornSilk: ColorItem = new ColorItem ( "#fff8dc", "cornsilk" ) ;
    public static crimson: ColorItem = new ColorItem ( "#dc143c", "crimson" ) ;
    public static cyan: ColorItem = new ColorItem ( "#00ffff", "cyan" ) ;
    public static darkBlue: ColorItem = new ColorItem ( "#00008b", "darkblue" ) ;
    public static darkCyan: ColorItem = new ColorItem ( "#008b8b", "darkcyan" ) ;
    public static darkGoldenRod: ColorItem = new ColorItem ( "#b8860b", "darkgoldenrod" ) ;
    public static darkGray: ColorItem = new ColorItem ( "#a9a9a9", "darkgray" ) ;
    public static darkGreen: ColorItem = new ColorItem ( "#006400", "darkgreen" ) ;
    public static darkGrey: ColorItem = new ColorItem ( "#a9a9a9", "darkgrey" ) ;
    public static darkKhaki: ColorItem = new ColorItem ( "#bdb76b", "darkkhaki" ) ;
    public static darkMagenta: ColorItem = new ColorItem ( "#8b008b", "darkmagenta" ) ;
    public static darkOliveGreen: ColorItem = new ColorItem ( "#556b2f", "darkolivegreen" ) ;
    public static darkOrange: ColorItem = new ColorItem ( "#ff8c00", "darkorange" ) ;
    public static darkOrchid: ColorItem = new ColorItem ( "#9932cc", "darkorchid" ) ;
    public static darkRed: ColorItem = new ColorItem ( "#8b0000", "darkred" ) ;
    public static darkSalmon: ColorItem = new ColorItem ( "#e9967a", "darksalmon" ) ;
    public static darkSeaGreen: ColorItem = new ColorItem ( "#8fbc8f", "darkseagreen" ) ;
    public static darkSlateBlue: ColorItem = new ColorItem ( "#483d8b", "darkslateblue" ) ;
    public static darkSlateGray: ColorItem = new ColorItem ( "#2f4f4f", "darkslategray" ) ;
    public static darkSlateGrey: ColorItem = new ColorItem ( "#2f4f4f", "darkslategrey" ) ;
    public static darkTurquoise: ColorItem = new ColorItem ( "#00ced1", "darkturquoise" ) ;
    public static darkViolet: ColorItem = new ColorItem ( "#9400d3", "darkviolet" ) ;
    public static deepPink: ColorItem = new ColorItem ( "#ff1493", "deeppink" ) ;
    public static deepSkyBlue: ColorItem = new ColorItem ( "#00bfff", "deepskyblue" ) ;
    public static dimGray: ColorItem = new ColorItem ( "#696969", "dimgray" ) ;
    public static dimGrey: ColorItem = new ColorItem ( "#696969", "dimgrey" ) ;
    public static dodgerBlue: ColorItem = new ColorItem ( "#1e90ff", "dodgerblue" ) ;
    public static fireBrick: ColorItem = new ColorItem ( "#b22222", "firebrick" ) ;
    public static floralWhite: ColorItem = new ColorItem ( "#fffaf0", "floralwhite" ) ;
    public static forestGreen: ColorItem = new ColorItem ( "#228b22", "forestgreen" ) ;
    public static gainsboro: ColorItem = new ColorItem ( "#dcdcdc", "gainsboro" ) ;
    public static ghostWhite: ColorItem = new ColorItem ( "#f8f8ff", "ghostwhite" ) ;
    public static gold: ColorItem = new ColorItem ( "#ffd700", "gold" ) ;
    public static goldenRod: ColorItem = new ColorItem ( "#daa520", "goldenrod" ) ;
    public static greenYellow: ColorItem = new ColorItem ( "#adff2f", "greenyellow" ) ;
    public static grey: ColorItem = new ColorItem ( "#808080", "grey" ) ;
    public static honeyDew: ColorItem = new ColorItem ( "#f0fff0", "honeydew" ) ;
    public static hotPink: ColorItem = new ColorItem ( "#ff69b4", "hotpink" ) ;
    public static indianRed: ColorItem = new ColorItem ( "#cd5c5c", "indianred" ) ;
    public static indigo: ColorItem = new ColorItem ( "#4b0082", "indigo" ) ;
    public static ivory: ColorItem = new ColorItem ( "#fffff0", "ivory" ) ;
    public static khaki: ColorItem = new ColorItem ( "#f0e68c", "khaki" ) ;
    public static lavender: ColorItem = new ColorItem ( "#e6e6fa", "lavender" ) ;
    public static lavenderBlush: ColorItem = new ColorItem ( "#fff0f5", "lavenderblush" ) ;
    public static lawnGreen: ColorItem = new ColorItem ( "#7cfc00", "lawngreen" ) ;
    public static lemonChiffon: ColorItem = new ColorItem ( "#fffacd", "lemonchiffon" ) ;
    public static lightBlue: ColorItem = new ColorItem ( "#add8e6", "lightblue" ) ;
    public static lightCoral: ColorItem = new ColorItem ( "#f08080", "lightcoral" ) ;
    public static lightCyan: ColorItem = new ColorItem ( "#e0ffff", "lightcyan" ) ;
    public static lightGoldenRodYellow: ColorItem = new ColorItem ( "#fafad2", "lightgoldenrodyellow" ) ;
    public static lightGray: ColorItem = new ColorItem ( "#d3d3d3", "lightgray" ) ;
    public static lightGreen: ColorItem = new ColorItem ( "#90ee90", "lightgreen" ) ;
    public static lightGrey: ColorItem = new ColorItem ( "#d3d3d3", "lightgrey" ) ;
    public static lightPink: ColorItem = new ColorItem ( "#ffb6c1", "lightpink" ) ;
    public static lightSalmon: ColorItem = new ColorItem ( "#ffa07a", "lightsalmon" ) ;
    public static lightSeaGreen: ColorItem = new ColorItem ( "#20b2aa", "lightseagreen" ) ;
    public static lightSkyBlue: ColorItem = new ColorItem ( "#87cefa", "lightskyblue" ) ;
    public static lightSlateGray: ColorItem = new ColorItem ( "#778899", "lightslategray" ) ;
    public static lightSlateGrey: ColorItem = new ColorItem ( "#778899", "lightslategrey" ) ;
    public static lightSteelBlue: ColorItem = new ColorItem ( "#b0c4de", "lightsteelblue" ) ;
    public static lightYellow: ColorItem = new ColorItem ( "#ffffe0", "lightyellow" ) ;
    public static limeGreen: ColorItem = new ColorItem ( "#32cd32", "limegreen" ) ;
    public static linen: ColorItem = new ColorItem ( "#faf0e6", "linen" ) ;
    public static magenta: ColorItem = new ColorItem ( "#ff00ff", "magenta" ) ;
    public static mediumAquaMarine: ColorItem = new ColorItem ( "#66cdaa", "mediumaquamarine" ) ;
    public static mediumBlue: ColorItem = new ColorItem ( "#0000cd", "mediumblue" ) ;
    public static mediumOrchid: ColorItem = new ColorItem ( "#ba55d3", "mediumorchid" ) ;
    public static mediumPurple: ColorItem = new ColorItem ( "#9370db", "mediumpurple" ) ;
    public static mediumSeaGreen: ColorItem = new ColorItem ( "#3cb371", "mediumseagreen" ) ;
    public static mediumSlateBlue: ColorItem = new ColorItem ( "#7b68ee", "mediumslateblue" ) ;
    public static mediumSpringGreen: ColorItem = new ColorItem ( "#00fa9a", "mediumspringgreen" ) ;
    public static mediumTurquoise: ColorItem = new ColorItem ( "#48d1cc", "mediumturquoise" ) ;
    public static mediumVioletred: ColorItem = new ColorItem ( "#c71585", "mediumvioletred" ) ;
    public static midNightBlue: ColorItem = new ColorItem ( "#191970", "midnightblue" ) ;
    public static mintCream: ColorItem = new ColorItem ( "#f5fffa", "mintcream" ) ;
    public static mistyRose: ColorItem = new ColorItem ( "#ffe4e1", "mistyrose" ) ;
    public static moccasin: ColorItem = new ColorItem ( "#ffe4b5", "moccasin" ) ;
    public static navajoWhite: ColorItem = new ColorItem ( "#ffdead", "navajowhite" ) ;
    public static oldLace: ColorItem = new ColorItem ( "#fdf5e6", "oldlace" ) ;
    public static oliveDrab: ColorItem = new ColorItem ( "#6b8e23", "olivedrab" ) ;
    public static orangeRed: ColorItem = new ColorItem ( "#ff4500", "orangered" ) ;
    public static orchid: ColorItem = new ColorItem ( "#da70d6", "orchid" ) ;
    public static paleGoldenRod: ColorItem = new ColorItem ( "#eee8aa", "palegoldenrod" ) ;
    public static paleGreen: ColorItem = new ColorItem ( "#98fb98", "palegreen" ) ;
    public static paleTurquoise: ColorItem = new ColorItem ( "#afeeee", "paleturquoise" ) ;
    public static paleVioletRed: ColorItem = new ColorItem ( "#db7093", "palevioletred" ) ;
    public static papayaWhip: ColorItem = new ColorItem ( "#ffefd5", "papayawhip" ) ;
    public static peachPuff: ColorItem = new ColorItem ( "#ffdab9", "peachpuff" ) ;
    public static peru: ColorItem = new ColorItem ( "#cd853f", "peru" ) ;
    public static pink: ColorItem = new ColorItem ( "#ffc0cb", "pink" ) ;
    public static plum: ColorItem = new ColorItem ( "#dda0dd", "plum" ) ;
    public static powderBlue: ColorItem = new ColorItem ( "#b0e0e6", "powderblue" ) ;
    public static rosyBrown: ColorItem = new ColorItem ( "#bc8f8f", "rosybrown" ) ;
    public static royalBlue: ColorItem = new ColorItem ( "#4169e1", "royalblue" ) ;
    public static saddleBrown: ColorItem = new ColorItem ( "#8b4513", "saddlebrown" ) ;
    public static salmon: ColorItem = new ColorItem ( "#fa8072", "salmon" ) ;
    public static sandyBrown: ColorItem = new ColorItem ( "#f4a460", "sandybrown" ) ;
    public static seaGreen: ColorItem = new ColorItem ( "#2e8b57", "seagreen" ) ;
    public static seaShell: ColorItem = new ColorItem ( "#fff5ee", "seashell" ) ;
    public static sienna: ColorItem = new ColorItem ( "#a0522d", "sienna" ) ;
    public static skyBlue: ColorItem = new ColorItem ( "#87ceeb", "skyblue" ) ;
    public static slateBlue: ColorItem = new ColorItem ( "#6a5acd", "slateblue" ) ;
    public static slateGray: ColorItem = new ColorItem ( "#708090", "slategray" ) ;
    public static slateGrey: ColorItem = new ColorItem ( "#708090", "slategrey" ) ;
    public static snow: ColorItem = new ColorItem ( "#fffafa", "snow" ) ;
    public static springGreen: ColorItem = new ColorItem ( "#00ff7f", "springgreen" ) ;
    public static steelBlue: ColorItem = new ColorItem ( "#4682b4", "steelblue" ) ;
    public static tan: ColorItem = new ColorItem ( "#d2b48c", "tan" ) ;
    public static thistle: ColorItem = new ColorItem ( "#d8bfd8", "thistle" ) ;
    public static tomato: ColorItem = new ColorItem ( "#ff6347", "tomato" ) ;
    public static turquoise: ColorItem = new ColorItem ( "#40e0d0", "turquoise" ) ;
    public static violet: ColorItem = new ColorItem ( "#ee82ee", "violet" ) ;
    public static wheat: ColorItem = new ColorItem ( "#f5deb3", "wheat" ) ;
    public static whiteSmoke: ColorItem = new ColorItem ( "#f5f5f5", "whitesmoke" ) ;
    public static yellowGreen: ColorItem = new ColorItem ( "#9acd32", "yellowgreen" ) ;
    public static rebeccaPurple: ColorItem = new ColorItem ( "#663399", "rebeccapurple" );
    public static transparent: ColorItem = new ColorItem("#00000000", "transparent");
}
