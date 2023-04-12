let id = 1;

export interface IStyleFragment {
    selector?: string;
    content: string;
    children: IStyleFragment[];
}

export type IStyleParameter = string | number | ((x: typeof styled) => any);

const prefix = "styled-";

export const nextId = () => 
    `${prefix}-${id++}`;

function append (selector: string, f: IStyleFragment) {
    f.selector = selector + (f.selector || "");
    if (f.children) {
        for (const iterator of f.children) {
            append(f.selector, iterator);
        }
    }
    return f;
}

function expand(f: IStyleFragment) {
    let content = `${f.selector} {${f.content}}`;
    if (f.children) {
        for (const iterator of f.children) {
            content += "\n";
            content += expand(iterator);
        }
    }
    return content;
}

export interface IStyleRules {
    [key: string]: ((strings: TemplateStringsArray, ... p: any[]) => IStyleFragment);
}

const styleProxy = (input: (x: string) => string): IStyleRules => {
    return (new Proxy({}, {
        get(t, p) {
            return styled.createSelector(input(String(p)));
        }
    })) as IStyleRules;
};

const styled = {

    class: styleProxy((x) => x.startsWith(".") ? x : `.${x}`),
    attribute: styleProxy((x) => `[${x}]`),
    child: styleProxy((x) => ` > ${x}`),
    nested: styleProxy((x) => ` ${x}`),
    element: styleProxy((x) => x),
    selector: styleProxy((x) => x),
    and: styleProxy((x) => x),

    install(f: IStyleFragment) {
        const style = document.createElement("style");
        style.id = f.selector;
        style.textContent = expand(f);
        document.head.appendChild(style);
        return f.selector;
    },

    get local() {
        return this.createSelector(this.nextId);
    },

    style(strings: TemplateStringsArray, ... p: any[]) {
        const list = [];
        const children = [];
        for (let index = 0; index < strings.length; index++) {
            const element = strings[index];
            list.push(element);
            if (index < p.length) {
                if (typeof p === "object") {
                    const pc = p as any as IStyleFragment;
                    children.push(pc);
                }
                list.push(p.toString());
            }
        }
        const content = list.join("");
        return { selector: "", content: ` {${content}}`, children };
    },

    rule(selector: string) {
        return this.createSelector(selector);
    },

    createSelector(selector: string) {
        return (strings: TemplateStringsArray, ... p: any[]) => {
            const list = [];
            const children = [];
            for (let index = 0; index < strings.length; index++) {
                const element = strings[index];
                list.push(element);
                if (index < p.length) {
                    if (typeof p === "object") {
                        const pc = p as any as IStyleFragment;
                        children.push(pc);
                    }
                    list.push(p.toString());
                }
            }
            const content = list.join("");
            return { selector, content, children };
        };
    }

}



const a = styled.install(

    styled.local`
        color: red;

        ${styled.rule("a")`
            overflow:hidden;
        `}
    `

);