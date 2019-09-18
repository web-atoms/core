import DISingleton from "../../di/DISingleton";

type Processor = [string, string, (s: string, e: string, t: string) => string ];

type Exp = [ RegExp, Processor?, Processor?, Processor?, Processor?, Processor?, Processor? ] |
    [ RegExp , (t) => string ];

const regExps: Exp[] = [
    [
        /(?<s>(_)+)(?<m>[^\_]+)(?<e>(_)+)/gmi,
        ["___", null, (m) => `<strong><em>${m}</em></strong>`],
        ["__", null, (m) => `<strong>${m}</strong>`],
        ["_", null, (m) => `<em>${m}</em>`]
    ],
    [
        /(?<s>(\*)+)(?<m>[^\*]+)(?<e>(\*)+)/gmi,
        ["***", null, (m) => `<strong><em>${m}</em></strong>`],
        ["**", null, (m) => `<strong>${m}</strong>`],
        ["*", null, (m) => `<em>${m}</em>`]
    ],
    [
        /(?<s>(\#)+)(\s)(?<m>[^\n]+)/gmi,
        ["#", null, (m) => `<h1>${m}</h1>`],
        ["##", null, (m) => `<h2>${m}</h2>`],
        ["###", null, (m) => `<h3>${m}</h3>`],
        ["####", null, (m) => `<h4>${m}</h4>`],
        ["#####", null, (m) => `<h5>${m}</h5>`]
    ],
    [
        /\n+/gmi,
        (t) => `<br/>`
    ]
];

@DISingleton()
export default class Markdown {

    public toHtml(text: string): string {
        for (const iterator of regExps) {
            const r = iterator[0];
            if (iterator.length === 2) {
                const gs = r.exec(text) as any;
            }
        }
    }

}
