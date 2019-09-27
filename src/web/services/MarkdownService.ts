import DISingleton from "../../di/DISingleton";

type Processor = [string, string, (s: string, e: string, t: string) => string ];

type Exp = [ RegExp, Processor?, Processor?, Processor?, Processor?, Processor?, Processor? ] |
    [ RegExp , (t: string) => string ] |
    [ RegExp , string ];

const regExps: Exp[] = [
    [ /(\_{3})([^\_]+)(\_{3})/gmi, "<strong><em>$2</em></strong>" ],
    [ /(\_{2})([^\_]+)(\_{2})/gmi, "<strong>$2</strong>" ],
    [ /(\_{1})([^\_]+)(\_{1})/gmi, "<em>$2</em>" ],
    [ /(\*{3})([^\*]+)(\*{3})/gmi, "<strong><em>$2</em></strong>" ],
    [ /(\*{2})([^\*]+)(\*{2})/gmi, "<strong>$2</strong>" ],
    [ /(\*{1})([^\*]+)(\*{1})/gmi, "<em>$2</em>" ],
    [ /(\#{5})\s([^\n]+)/gmi, "<h5>$2</h5>"],
    [ /(\#{4})\s([^\n]+)/gmi, "<h4>$2</h4>"],
    [ /(\#{3})\s([^\n]+)/gmi, "<h3>$2</h3>"],
    [ /(\#{2})\s([^\n]+)/gmi, "<h2>$2</h2>"],
    [ /(\#{1})\s([^\n]+)/gmi, "<h1>$2</h1>"],
    [ /\n+/gmi, (t) => `<br/>` ]
];

@DISingleton()
export default class MarkdownService {

    public toHtml(text: string): string {
        for (const iterator of regExps) {
            const reg = iterator[0];
            if (iterator.length === 2) {
                const re = iterator[1];
                if (typeof re === "string" || typeof re === "function") {
                    text = text.replace(reg, re as any);
                }
            }
        }
        return text;
    }

}
