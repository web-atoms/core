let id = 1;

export interface IStyleFragment {
    selector: string;
    content: string;
}

export type IStyleParameter = string | number | ((x: typeof styled) => any);

export default class styled {

    public static prefix = "styled-";

    public static get nextId() {
        return `${this.prefix}-${id++}`;
    }

    public static get installNext() {
        const x = this.selector(this.nextId);
        return x.
    }

    public static selector(selector: string) {
        return (strings: TemplateStringsArray, ... p: any[]) => {
            const list = [];
            for (let index = 0; index < strings.length; index++) {
                const element = strings[index];
                list.push(element);
                if (index < p.length) {
                    list.push(p.toString());
                }
            }
            const content = list.join("");
            return { selector, content };
        }
    }

}

const a = styled.css`
    color: red;
    background-color: green;

    ${ styled.selector("")`` }
`;