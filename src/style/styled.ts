let id = 1;

const prefix = "styled-";

export const nextId = () => 
    `.${prefix}-${id++}`;


export class StyleFragment {

    public static newRule (strings: TemplateStringsArray, ... p: any[]) {
        const list = [];
        const children = [];
        for (let index = 0; index < strings.length; index++) {
            const element = strings[index];
            list.push(element);
            if (index < p.length) {
                if (typeof p === "object") {
                    const pc = p instanceof StyleFragment;
                    children.push(pc);
                }
                list.push(p.toString());
            }
        }
        const content = list.join("");
        return new StyleFragment({ content, children });
    }

    public static get newRoot() {
        return new StyleFragment();
    }

    private selector: string = "";
    private content: string;
    private children: StyleFragment[];
    private constructor(
        {
            selector = "",
            content = "",
            children = null as StyleFragment[]
        } = {}
    ) {
        this.selector = selector;
        this.content = content;
        this.children = children;
    }

    expand(selector?: string) {
        if (selector) {
            this.selector = selector;
        }
        let content = `${this.selector} {${this.content}}`;
        if (this.children) {
            for (const iterator of this.children) {
                content += "\n";
                content += iterator.expand();
            }
        }
        return content;
    }

    toString() {
        return this.expand();
    }

    and(selector: string, f: StyleFragment) {
        f.selector = selector;
        this.children.push(f);
        return this;
    }

    child(selector: string, f: StyleFragment) {
        f.selector = selector;
        f.selector = " > " + f.selector;
        this.children.push(f);
        return this;
    }

    nested(selector: string, f: StyleFragment) {
        f.selector = selector;
        f.selector = " " + f.selector;
        this.children.push(f);
        return this;
    }

    installGlobal(selector: string = "") {
        const style = document.createElement("style");
        style.textContent = this.expand(selector);
        document.head.appendChild(style);
    }

    installLocal() {
        const selector = nextId();
        const style = document.createElement("style");
        style.textContent = this.expand(selector);
        document.head.appendChild(style);
        return selector;
    }
}

export type IStyleParameter = string | number | ((x: typeof styled) => any);

const styled = {

    css: (strings: TemplateStringsArray, ... p: any[]) => {
        return StyleFragment.newRule(strings, ... p);
    },
}

export default styled;
