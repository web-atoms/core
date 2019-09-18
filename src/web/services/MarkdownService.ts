import DISingleton from "../../di/DISingleton";

type Processor = [string, string, (s: string, e: string, t: string) => string ];

type Exp = [ RegExp, Processor?, Processor?, Processor?, Processor?, Processor?, Processor? ] |
    [ RegExp , (t: string) => string ] |
    [ RegExp , string ];

const regExps: Exp[] = [
    [ /(\_{3})(?<m>[^\_]+)(\_{3})/gmi, "<strong><em>$<m></em></strong>" ],
    [ /(\_{2})(?<m>[^\_]+)(\_{2})/gmi, "<strong>$<m></strong>" ],
    [ /(\_{1})(?<m>[^\_]+)(\_{1})/gmi, "<em>$<m></em>" ],
    [ /(\*{3})(?<m>[^\*]+)(\*{3})/gmi, "<strong><em>$<m></em></strong>" ],
    [ /(\*{2})(?<m>[^\*]+)(\*{2})/gmi, "<strong>$<m></strong>" ],
    [ /(\*{1})(?<m>[^\*]+)(\*{1})/gmi, "<em>$<m></em>" ],
    [ /(\#{5})(\s)(?<m>[^\n]+)/gmi, "<h5>$<m></h5>"],
    [ /(\#{4})(\s)(?<m>[^\n]+)/gmi, "<h4>$<m></h4>"],
    [ /(\#{3})(\s)(?<m>[^\n]+)/gmi, "<h3>$<m></h3>"],
    [ /(\#{2})(\s)(?<m>[^\n]+)/gmi, "<h2>$<m></h2>"],
    [ /(\#{1})(\s)(?<m>[^\n]+)/gmi, "<h1>$<m></h1>"],
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
